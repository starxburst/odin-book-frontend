import React, { useEffect, useState, useContext } from "react";
import UserContext from "../UserContext";
import { Link } from "react-router-dom";
import { Buffer } from 'buffer';
import avatarLogo from "../assets/avatar/avatar.png";
import toast, { Toaster } from 'react-hot-toast';
import '../style/Friends.css';

const Friends = () => {

    const { user, setUser } = useContext(UserContext);
    const [fetchedUserFriends, setFetchedUserFriends] = useState([]);
    const [fetchedUserFriendRequests, setFetchedUserFriendRequests] = useState([]);

    useEffect(() => {
        getUserInfo();
    }, []);

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
                    setFetchedUserFriendRequests(data.user.friendRequests);
                    console.log(fetchedUserFriendRequests);
                    console.log(fetchedUserFriends);
                    console.log(data.user.friends);
                    
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
            }
    }

    let requestsContent = fetchedUserFriendRequests.map(request => {
        return (
            <div>
                {request.name}
            </div>
        )
    })

    let friendsContent = fetchedUserFriends.map(friend => {
        return (
            <div>
                {friend.name}
            </div>
        )
    })

    const renderUserAvatar = (avatar) => {
        if (avatar === undefined) {
            return avatarLogo;
        } else {
            return `data:${avatar.img.contentType};base64, ${Buffer.from(avatar.img.data.data).toString('base64')}`;
        }
    }


    return (
        <div className="friendsPageContainer">
            <div>
                <h1>Friends Requests</h1>
                <div className="friendsRequestContainer">
                    {requestsContent}
                </div>
                <h1>Friends</h1>
                <div className="friendsContainer">
                    {friendsContent}
                </div>
            </div>
        </div>
    )
}

export default Friends;