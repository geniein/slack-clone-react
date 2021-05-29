import { IDM } from '@typings/db';
import React, { forwardRef, useCallback, useRef, VFC } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import {Scrollbars} from 'react-custom-scrollbars';
import Chat from '@components/Chat';
import Test from '@components/Test';

interface Props {
    chatSections: {[key: string] : IDM[]};
    // setSize: (index: number) => Promise<IDM[][] | undefined>;
    setSize: (f: (size: number) => number) => Promise<(IDM)[][] | undefined>;
    isEmpty: boolean;
    isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({chatSections,setSize,isEmpty,isReachingEnd}, ref) =>{
    
    const onScroll = useCallback(
        (values) => {
            if(values.scrollTop === 0 && !isReachingEnd){
                setSize( (prev: number) => prev + 1).then(()=>{

                });
            }
            
        },
        [],
    )       
    return (
        <ChatZone>            
            <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
                {Object.entries(chatSections).map(([date, chats]) => {
                    return(
                        <Section className={`section-${date}`} key={date}>
                            <StickyHeader>
                                <button>{date}</button>
                            </StickyHeader>
                            {chats?.map((chat) =>{           
                                return (<Chat key={chat.id} data={chat}/>)
                            })}
                            </Section>
                    )
                })}
              
            </Scrollbars>            
        </ChatZone>                        
    )
});

export default ChatList;