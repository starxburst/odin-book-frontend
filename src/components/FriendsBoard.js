import React, { useState, useEffect, useContext } from "react";
import UserContext from "../UserContext";
import { Link } from "react-router-dom";
import { Buffer } from "buffer";
import avatarLogo from "../assets/avatar/avatar.png";
import '../style/FriendsBoard.css';
import toast, { Toaster } from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';



const FriendsBoard = () => {
    const { user, setUser } = useContext(UserContext);
    const [isBusy, setBusy] = useState(true);
    const [fetchedUserFriends, setFetchedUserFriends] = useState([]);

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
                console.log(text);
                toast.error("Something went wrong");
                return;
            } else {
                const data = await response.json();
                setFetchedUserFriends(data.user.friends);
                console.log(fetchedUserFriends);
                console.log(data.user.friends);
                setBusy(false);                
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    let friendsContent = fetchedUserFriends.map(friend => {
        return (
            <div className="friendsBoardContentContainer">
                <Link to={`/profile/${friend._id}`} className="link friendLinkContainer">
                    <img src={renderUserAvatar(friend.avatar)} alt="user avatar" className="postAvatar" />
                    <div className="friendUserName" >{friend.name}</div>
                </Link>
            </div>
        )
    })

    return (
        isBusy ? (
        <div className="friendsBoardContainer">
            <Box sx={{ display: 'flex', width: '15vw', "justify-content": "center", "padding-top": "20vh" }}>
                <CircularProgress size={200}/>
            </Box>
        </div>
        ):
        (
        <div className="friendsBoardContainer">
            <h1 className="friendsBoardText">Friends</h1>
                    { 
                        fetchedUserFriends.length === 0 ? (
                            <div>
                                <p>No friends yet...</p>
                            </div>
                            ) : friendsContent
                    }
        </div>
        )
    )
}

export default FriendsBoard;