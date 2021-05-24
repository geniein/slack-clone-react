import {Channels, Chats, Header, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceName, Workspaces, WorkspaceWrapper} from '@layouts/Workspace/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { Children, FC, useCallback, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR, { mutate } from 'swr';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';

const Channel = loadable(()=> import('@pages/Channel'));
const DirectMessage = loadable(()=> import('@pages/DirectMessage'));

const Workspace: FC = ({children}) =>{
    const [showUserMenu, setShowUserMenu] = useState(false);
    const {data, error, revalidate, mutate } = useSWR('http://localhost:3055/api/users', fetcher);

    const onLogout = useCallback(
        () => {
            axios.post('http://localhost:3055/api/users/logout', null, {
                withCredentials : true,
            }).then( ()=>{
                //revalidate();
                mutate(false, false);
            });
        },
        [],
    );

    const onClickUserProfile = useCallback( ()=> {
        setShowUserMenu((prev)=> !prev);
    }, [] );

    if(data === undefined){
        return <div>Loading...</div>
    }
  
    if(!data){
        console.log('here : ' + data);
        return <Redirect to="/login"/>        
    }

    return (
        <div>
            <Header>
            <RightMenu>
                <span onClick={onClickUserProfile}>
                    <ProfileImg src={gravatar.url(data.nickname, {s:'28px', d:'retro'})} alt={data.nickname}></ProfileImg>
                    {showUserMenu && (
                    <Menu style={{right:0, top:38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                        <ProfileModal>
                            <img src={gravatar.url(data.nickname, {s:'28px', d:'retro'})} alt={data.nickname} />
                            <div>
                                <span id="profile-name"> {data.nick}</span>
                                <span id="profile-active">Active</span>
                            </div>
                        </ProfileModal>
                    </Menu>
                    )
                }
                </span>
            </RightMenu>
            <button onClick={onLogout}>LogOut</button>
            </Header>
            <WorkspaceWrapper>
                <Workspaces>test</Workspaces>
                <Channels>
                    <WorkspaceName>Channel</WorkspaceName>
                    <MenuScroll>scroll</MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/channel" component={Channel}/>
                        <Route path="/workspace/dm" component={DirectMessage}/>
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            {children}
        </div>
    )
}

export default Workspace;