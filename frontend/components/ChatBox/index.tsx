import React, { useCallback, useEffect, useRef, VFC } from 'react';
import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from './styles';
import autosize from 'autosize';
import { Mention, SuggestionDataItem } from 'react-mentions';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar';

interface Props {
    chat: string;
    onSubmitForm: (e:any) => void;
    onChangeChat: (e:any) => void;
    placeholder?: string;
}

const ChatBox: VFC<Props>= ({chat, onChangeChat, onSubmitForm, placeholder}) =>{
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    //SWR
    const {workspace} = useParams<{workspace:string}>();
    const {data : userData, error, revalidate, mutate } = useSWR<IUser | false>('/api/users', fetcher);    
    const { data: memberData} = useSWR<IUser[]>( 
        userData ? `/api/workspaces/${workspace}/members` : null,
        fetcher
    );    

    const renderSuggestion = useCallback(
        (suggestion: SuggestionDataItem, search: string, highlightedDisplay: React.ReactNode, index: number, focus: boolean): React.ReactNode=>{            
            if(!memberData) return;
            return (
                <EachMention focus={focus}>
                    <img src={gravatar.url(memberData[index].email, {s:'20px', d:'retro' })} alt={memberData[index].nickname}/>
                    <span>{highlightedDisplay}</span>
                </EachMention>
            )
        }, []
    )
    useEffect( ()=>{
        if(textareaRef.current){
            autosize(textareaRef.current);
        }
    },[]);
    // const onSubmitForm = useCallback(
    //     () => {
            
    //     },
    //     []
    // );    
    const onKeyDownChat =useCallback( (e)=> {
            if (e.key === 'Enter') {
                if (!e.shiftKey) {
                e.preventDefault();
                onSubmitForm(e);
                }
            }
        }, [onSubmitForm] );

    return (
        <ChatArea>
            <Form onSubmit={onSubmitForm}>
                <MentionsTextarea id="editor-chat" value={chat} onChange={onChangeChat} onKeyDown={onKeyDownChat} placeholder={placeholder} inputRef={textareaRef}>                                    
                {/* ref ==>  inputRef styles에 (MentionInput)참조*/}
                    <Mention appendSpaceOnAdd trigger="@" data={memberData?.map((v)=> ({id:v.id, display: v.nickname})) || []} renderSuggestion={renderSuggestion}/>                    
                </MentionsTextarea>
                <Toolbox>
                    <SendButton
                        className={
                        'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
                        (chat?.trim() ? '' : ' c-texty_input__button--disabled')
                        }
                        data-qa="texty_send_button"
                        aria-label="Send message"
                        data-sk="tooltip_parent"
                        type="submit"
                        disabled={!chat?.trim()}
                    >
                    <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
                    </SendButton>
                </Toolbox>
            </Form>
        </ChatArea>
    )
};

export default ChatBox;