import {AddButton, Channels, Chats, Header, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceButton, WorkspaceModal, WorkspaceName, Workspaces, WorkspaceWrapper} from '@layouts/Workspace/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { Children, VFC, useCallback, useState, useEffect } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router';
import useSWR, { mutate } from 'swr';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import { IChannel, IUser } from '@typings/db';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import {toast} from 'react-toastify';
import CreateChannelModal from '@components/CreateChannelModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
import DMList from '@components/DMList';
import ChannelList from '@components/ChannelList';
import useSocket from '@hooks/useSocket';

const Channel = loadable(()=> import('@pages/Channel'));
const DirectMessage = loadable(()=> import('@pages/DirectMessage'));

const Workspace: VFC = () =>{
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
    const {workspace, channel} = useParams<{workspace: string; channel: string;}>();   
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

    //SWR
    const {data : userData, error, revalidate, mutate } = useSWR<IUser | false>('/api/users', fetcher);
    const {data : channelData} = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
    // const { data: memberData} = useSWR<IUser[]>(
    //     userData ? `/api/workspaces/${workspace}/members` : null,
    //     fetcher
    // );    
    const [socket, disconnect] = useSocket(workspace);

    useEffect( ()=>{
        if(channelData && userData&& socket){
            console.log(socket); //socket object
            socket.emit('login',{id:userData, channels: channelData.map((v)=>v.id)});
        }
        // socket.on('message');
        // socket.emit();
        // disconnect();
    },[socket, channelData, userData]);
    
    useEffect(()=>{
        return() =>{
            disconnect();
        }
    },[workspace,disconnect]);

    const onLogout = useCallback(
        () => {
            axios.post('/api/users/logout', null, {
                withCredentials : true,
            }).then( ()=>{
                //revalidate();
                mutate(false, false);
            });
        },
        [],
    ); 
    //end SWR

    const onCloseUserProfile = useCallback( (e)=> {        
        console.log('close');
        e.stopPropagation();
        setShowUserMenu(false);
    }, [] );

    const onClickUserProfile = useCallback( ()=> {
        console.log('click');        
        setShowUserMenu((prev)=> !prev);
    }, [] );
    

    const onClickCreateWorkspace = useCallback( ()=>{
        setShowCreateWorkspaceModal(true);
    }, []);
    
    const onCloseModal = useCallback( ()=>{        
        setShowCreateWorkspaceModal(false);
        setShowCreateChannelModal(false);
        setShowInviteWorkspaceModal(false);
        setShowInviteChannelModal(false);
    },[]);

    const onCreateWorkspace = useCallback( (e)=>{        
        e.preventDefault();    
        if( !newWorkspace || !newWorkspace.trim()) return;
        if( !newUrl || !newUrl.trim()) return;        
        axios.post('/api/workspaces',
        {
            workspace:newWorkspace,
            url:newUrl,
        }, 
        {
            withCredentials : true
        }).then(()=>{
            revalidate();
            setShowCreateWorkspaceModal(false);
            setNewWorkspace('');
            setNewUrl('');
        }).catch((err)=>{
            console.dir(err);
            toast.error(err.response?.data, {position:'bottom-center'});
        })
    },[newWorkspace, newUrl]);

   const toggleWorkspaceModal = useCallback( ()=>{
       console.log('toggleWorkspaceModal');
       setShowWorkspaceModal((prev) => !prev);
   },[]);

   const onClickAddChannel = useCallback( () =>{
       setShowCreateChannelModal(true);
   },[]);

   const onClickInviteWorkspace = useCallback( () =>{
        setShowInviteWorkspaceModal(true);
    },[]);   

    if(userData === undefined){        
        return <div>Loading...</div>
    }
  
    if(!userData){        
        return <Redirect to="/login"/>
    }
        
    return (
        <div>
            <Header>
            <RightMenu>
                <span onClick={onClickUserProfile}>
                    <ProfileImg src={gravatar.url(userData.nickname, {s:'28px', d:'retro'})} alt={userData.nickname}></ProfileImg>
                    {showUserMenu && (
                    <Menu style={{right:0, top:38}} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                        <ProfileModal>
                            <img src={gravatar.url(userData.nickname, {s:'28px', d:'retro'})} alt={userData.nickname} />
                            <div>
                                <span id="profile-name"> {userData.nickname}</span>
                                <span id="profile-active">Active</span>
                            </div>
                        </ProfileModal>
                        <button onClick={onLogout}>LogOut</button>
                    </Menu>
                    )
                }
                </span>
            </RightMenu>
            
            </Header>
            <WorkspaceWrapper>
                <Workspaces>
                    {userData.Workspaces.map((ws) =>{
                        return (
                            // <div>
                            // </div>
                            <Link key={ws.id} to={`/workspace/${ws.name}/channel/general`}>
                                <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        )
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkspaceModal}>Channel</WorkspaceName>
                    <MenuScroll>
                        <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{top:95, left:80}}>
                            <WorkspaceModal>
                                <h2>Channel</h2>
                                <button onClick={onClickInviteWorkspace}> Invite Workspace</button>
                                <button onClick={onClickAddChannel}>Channel Create</button>
                                <button onClick={onLogout}>Out</button>
                            </WorkspaceModal>
                        </Menu>
                        <ChannelList/>
                        <DMList/>
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/:workspace/channel/:channel" component={Channel}/>
                        <Route path="/workspace/:workspace/dm/:id" component={DirectMessage}/>
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>WS name</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}/>
                    </Label>
                    <Label id="workspace-url-label">
                        <span>WS name</span>
                        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}/>
                    </Label>
                    <Button type="submit">Create</Button>
                </form>
            </Modal>
            <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal} setShowCreateChannelModal={setShowCreateChannelModal}/>
            <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={onCloseModal} setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}/>
            {/* <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} setShowInviteChannelModal={setShowInviteChannelModal}/> */}
        </div>
    )
}

export default Workspace;