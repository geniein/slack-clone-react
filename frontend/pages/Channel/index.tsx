import React, { useCallback } from 'react';
import Workspace from '@layouts/Workspace';
import { container } from 'webpack';
import { Container, Header } from '@pages/DirectMessage/styles';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';

const Channel = () =>{
    const [chat, onChangeChat, setChat] = useInput('');
    const onSubmitForm = useCallback(
        (e) => {
            console.log('submit');
            e.preventDefault();
            setChat('');
        },
        [],
    )
    return (        
        <Container>
            <Header>Channel</Header>
            {/* <ChatList/> */}
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
        </Container>
        
    )
};

export default Channel;