import React, { useEffect, useState, useContext } from "react";
import UserContext from "../UserContext";
import { Link } from "react-router-dom";
import { Buffer } from 'buffer';
import avatarLogo from "../assets/avatar/avatar.png";
import toast, { Toaster } from 'react-hot-toast';
import '../style/Friends.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Friends = () => {

    const { user, setUser } = useContext(UserContext);
    const [isBusy, setBusy] = useState(true);
    const [fetchedUserFriends, setFetchedUserFriends] = useState([]);
    const [fetchedUserFriendRequests, setFetchedUserFriendRequests] = useState([]);

    useEffect(() => {
        getUserInfo();
    }, []);

    const renderUserAvatar = (avatar) => {
        if (avatar === undefined) {
            return avatarLogo;
        } else {
            return `data:${avatar.img.contentType};base64, ${Buffer.from(avatar.img.data.data).toString('base64')}`;
        }
    }


    //get user info
    const getUserInfo = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${user._id}`, {
                headers: {
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            });
            if (!response.ok) {
                const text = await response.text();
                toast.error("Something went wrong");
                return;
            } else {
                const data = await response.json();
                setFetchedUserFriends(data.user.friends);
                setFetchedUserFriendRequests(data.user.friendRequests);
                setBusy(false);
                
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    let requestsContent = fetchedUserFriendRequests.map(request => {
        return (
            <div className="requestContentContainer">
                <Link to={`/profile/${request._id}`} className="link requestLinkContainer">
                    <img src={renderUserAvatar(request.avatar)} alt="user avatar" className="postAvatar" />
                    <div className="requestUserName" >{request.name}</div>
                </Link>
            </div>
        )
    })

    let friendsContent = fetchedUserFriends.map(friend => {
        return (
            <div className="friendContentContainer">
                <Link to={`/profile/${friend._id}`} className="link friendLinkContainer">
                    <img src={renderUserAvatar(friend.avatar)} alt="user avatar" className="postAvatar" />
                    <div className="friendUserName" >{friend.name}</div>
                </Link>
            </div>
        )
    })

    return (
        isBusy ? 
        <Box sx={{ display: 'flex', width: '100vw', "justify-content": "center", "padding-top": "20vh" }}>
            <CircularProgress size={200}/>
        </Box>:
        <div className="friendsPageContainer">
            <div>
                <h1>Friends Requests</h1>
                <div className="friendsRequestContainer">
                    { fetchedUserFriendRequests.length === 0 ? (
                        <div>
                            <p>No pending friend request yet...</p>
                        </div>
                        ) : requestsContent
                    }
                </div>
                <h1>Friends</h1>
                <div className="friendsContainer">
                    { 
                        fetchedUserFriends.length === 0 ? (
                            <div>
                                <p>No friends yet...</p>
                            </div>
                            ) : friendsContent
                    }
                </div>
            </div>
        </div>
    )
}

export default Friends;