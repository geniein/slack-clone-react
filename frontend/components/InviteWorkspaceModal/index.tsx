import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props{
    show: boolean;
    onCloseModal: ()=>void;
    setShowInviteWorkspaceModal: (flag:boolean)=> void;
}

const InviteWorkspaceModal: FC<Props> = ({show, onCloseModal, setShowInviteWorkspaceModal}) => {
    const [newMember, onChangeNewMember, setNewMember] = useInput('');
    const {workspace, channel} = useParams<{workspace:string; channel:string}>();
    const {data: userData} = useSWR(`/api/users`,fetcher);
    const { revalidate: revalidateChannel} = useSWR<IChannel[]>(
        userData ? `/api/workspaces/${workspace}/channels` : null,
        fetcher
    );
    const onInviteMember = useCallback(
        (e) => {
            e.preventDefault();
            if(!newMember || !newMember.trim()){
                return;
            }
            axios.post(
                `/api/workspaces/${workspace}/members`,
                {
                    email:newMember
                },
                ).then(
                    () => {
                        revalidateChannel();
                        setShowInviteWorkspaceModal(false);
                        setNewMember('');
                    }
                ).catch((err)=>{
                    console.dir(err);
                    toast.error(err.reponse?.data, {position:'bottom-center'});
                })
            
        },
        [workspace, newMember],
    );
    return(
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onInviteMember}>
                <Label id="member-label">
                    <span>e-mail</span>
                    <Input id="member" type="email" value={newMember} onChange={onChangeNewMember}/>
                </Label>
                <Button type="submit">Invite</Button>
            </form>
        </Modal>
    )
}

export default InviteWorkspaceModal;