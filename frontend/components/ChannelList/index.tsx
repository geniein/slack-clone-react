import React, { FC, useCallback, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { CollapseButton } from '@components/DMList/styles';

const ChannelList: FC = () => {
    const {workspace} = useParams<{workspace:string;}>();
    const {data: userData, error, revalidate, mutate} = useSWR<IUser>('/api/users',fetcher,{ dedupingInterval: 2000});
    const { data: channelData} = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
    
    const [channelCollapse, setChannelCollapse] = useState(false);

    const toggleChannelCollapse = useCallback(
        () => {
            setChannelCollapse((prev)=> !prev);
        },
        [],
    )
     
    return (
        <>
        <h2>
            <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
                <i
                    className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
                    data-qa="channel-section-collapse"
                    aria-hidden="true"
                />
            </CollapseButton>
            <span>Channels</span>
        </h2>
        <div>
            {/* {!channelCollapse &&
            channelData?.map((channel)=>{
                const count = 0;
                //  countList[`c-${channel.id}`];
                return (
                    <NavLink
                        key={channel.name}
                        activeClassName="selected"
                        to={`/workspace/${workspace}/channel/${channel.name}`}
                        // onClick={resetCount(`c-${channel.id}`)}
                    >
                        <span className={count !== undefined && count >= 0 ? 'bold' : undefined}>
                            # {channel.name}
                        </span>
                        {count !== undefined && count >0 && <span className="count">{count}</span>}
                    </NavLink>
                )
            })} */}
            {!channelCollapse &&
          channelData?.map((channel) => {
            return (
              <NavLink
                key={channel.name}
                activeClassName="selected"
                to={`/workspace/${workspace}/channel/${channel.name}`}
              >
                <span># {channel.name}</span>
              </NavLink>
            );
          })}
        </div>
        </>
    );
};

export default ChannelList;