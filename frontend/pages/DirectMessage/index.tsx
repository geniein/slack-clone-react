import { Header } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import React, { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import useSWR, {useSWRInfinite} from 'swr';
import { Container } from './styles';
import gravatar from 'gravatar';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';

const DirectMessage = () =>{
    const {workspace, id} = useParams<{workspace: string; id: string;}>();    
    const {data : userData} = useSWR(`/api/workspaces/${workspace}/users/${id}}`, fetcher);
    const {data : dmData} = useSWR(`/api/users}`, fetcher);
    const [chat, onChangeChat,setChat] = useInput('');
    //SWR
    const {data: chatData, mutate: mutateChat, revalidate, setSize} = useSWRInfinite<IDM[]>(
        (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index +1}`,
        fetcher,
    );    //useSWRInfinite(setSize)
    const isEmpty = chatData?.[0]?.length ===0;
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length -1]?.length < 20) || false;
    const scrollbarRef = useRef<Scrollbars>(null);
    const [socket] = useSocket(workspace);
    const onSubmitForm = useCallback(
        (e) => {
            console.log('DM submit');
            console.log(chat);
            e.preventDefault();            
            //optimistic UI
            if(chat?.trim() &&chatData){
                const savedChat = chat;
                mutateChat((prevChat) =>{
                    prevChat?.[0].unshift({
                        id: (chatData[0][0]?.id || 0) + 1,
                        content: savedChat,
                        SenderId: dmData.id,
                        Sender: dmData,
                        ReceiverId: userData.id,
                        Receiver: userData,
                        createdAt: new Date(),
                    });
                    return prevChat;
                }).then(()=>{
                    setChat('');
                    scrollbarRef.current?.scrollToBottom();
                });
                
                axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{
                    content: chat,
                }).then(()=>{
                    revalidate();
                    // setChat('');
                }).catch(console.error);
            }
        },
        [chat, chatData, dmData, userData, workspace, id], 
    )

    const onMessage = useCallback((data: IDM) => {        
        if (data.SenderId === Number(id) && dmData.id !== Number(id)) {
          mutateChat((chatData) => {
            chatData?.[0].unshift(data);
            return chatData;
          }, false).then(() => {
            if (scrollbarRef.current) {
              if (
                scrollbarRef.current.getScrollHeight() <
                scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
              ) {
                console.log('scrollToBottom!', scrollbarRef.current?.getValues());
                setTimeout(() => {
                  scrollbarRef.current?.scrollToBottom();
                }, 50);
              }
            }
          });
        }
      }, []);
    
    useEffect(() => {
        socket?.on('dm',onMessage);
        return() =>{
            socket?.off('dm',onMessage);
        };
    } ,[socket, onMessage]);
    //loading scollbar
    useEffect(() => {
        if(chatData?.length===1){
            scrollbarRef.current?.scrollToBottom();
        }       
    }, [chatData]);

    if(!userData || !dmData){
        return null;
    }     
    //Rendered more hooks than during the previous render.
    // useEffect(() => {
    //     if(chatData?.length===1){
    //         scrollbarRef.current?.scrollToBottom();
    //     }       
    // }, [chatData]);   
    
    const chatSections = makeSection(chatData ? chatData.flat()?.reverse() : []);

    return <Container>
        <Header>
            <img src={gravatar.url(userData.email,{s: '24px', d: 'retro'})} alt={userData.nickname} />
            <span>{userData.nickname}</span>
        </Header>
        <ChatList chatSections={chatSections} scrollbarRef={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd}/>
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>        
    </Container>
}

export default DirectMessage;