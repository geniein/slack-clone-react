import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props{
    show: boolean;
    onCloseModal: ()=>void;
    setShowInviteChannelModal: (flag:boolean)=> void;
}

const InviteChannelModal: FC<Props> = ({show, onCloseModal, setShowInviteChannelModal}) => {
    const [newMember, onChangeNewMember, setNewMember] = useInput('');
    const {workspace, channel} = useParams<{workspace:string; channel:string}>();
    const {data: userData} = useSWR(`/api/users`,fetcher);
    // const { revalidate: revalidateMembers} = useSWR<IUser[]>(
    //     userData ? channel`/api/workspaces/${workspace}/channels/${channel}/members` : null,
    //     fetcher
    // );
    const onInviteMember = useCallback(
        (e) => {
            // e.preventDefault();
            // if(!newMember || !newMember.trim()){
            //     return;
            // }
            // axios.post(
            //     `/api/workspaces/${workspace}/channels/${channel}/members`,
            //     {
            //         email:newMember
            //     },
            //     ).then(
            //         () => {
            //             revalidateMembers();
            //             setShowInviteChannelModal(false);
            //             setNewMember('');
            //         }
            //     ).catch((err)=>{
            //         console.dir(err);
            //         toast.error(err.reponse?.data, {position:'bottom-center'});
            //     })
            
        },
        [newMember],
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

export default InviteChannelModal;