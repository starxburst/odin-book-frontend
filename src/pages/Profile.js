import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserContext from "../UserContext";
import avatarLogo from "../assets/avatar/avatar.png";
import toast, { Toaster } from 'react-hot-toast';
import '../style/Profile.css';
import { Buffer } from 'buffer';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PostSection from "../components/PostSection";

const Profile = () => {

    const location = useLocation();
    let pathId = location.pathname.split("/")[2];

    const { user, setUser } = useContext(UserContext);
    const [fetchedUserinfo, setFetchedUserinfo] = useState(false);
    const [file, setFile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFetchingPost, setIsFetchingPost] = useState(true);
    const [isFetchingFriendsStaues, setIsFetchingFriendsStaues] = useState(true);
    const [postSkip, setPostSkip] = useState(0);


    useEffect(() => {
        setIsFetchingPost(true);
        setIsFetchingFriendsStaues(true);
        resetPosts()
        firstGetAllPosts();
        getUserInfo()
    }, [pathId]);

    const resetPosts = async () => {
        
        setPosts([]);
        setPostSkip(0);
        
    }

    const firstGetAllPosts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/user/${pathId}?skip=${0}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": JSON.parse(localStorage.getItem("token"))
            }
            })
            if (!response.ok) {
                const text = await response.text();
                toast.error(text);
            } else {
                const userPosts = await response.json();
                if (userPosts.posts.length > 0) {
                    setPosts(userPosts.posts);
                }
                
                
                setPostSkip(prevState => 5);
                setIsFetchingPost(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
        
    }



    const getAllPosts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/user/${pathId}?skip=${postSkip}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": JSON.parse(localStorage.getItem("token"))
            }
            })
            if (!response.ok) {
                const text = await response.text();
                toast.error(text);
            } else {
                const userPosts = await response.json();
                if (userPosts.posts.length > 0) {
                    setPosts(prevState => [...prevState, ...userPosts.posts]);
                }
                
                
                setPostSkip(postSkip + 5);
                setIsFetchingPost(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
        
    }

    const replaceEditedPost = async (postId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            })
            if (!response.ok) {
                const text = await response.text();
                toast.error(text);
                return;
            } else {
                const fetchedPost = await response.json();
                const index = posts.findIndex(post => post._id === postId);
                if (index !== -1) {
                    const tempPosts = [...posts];
                    tempPosts[index] = fetchedPost.post;
                    setPosts(tempPosts);
                }
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
            }
    }

    //handle file upload
    const onInputChange = (e) => {
        setFile(e.target.files[0]);
    }

    //upload image
    const handleAvatarSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Loading...');
        const formData = new FormData();
        formData.append("imageFile", file);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${user._id}/profileimage`, {
            method: "POST",
            body: formData,
            headers: {
                "auth-token": JSON.parse(localStorage.getItem("token"))                
            }
            });
            if (!response.ok) {
                const text = await response.json();
                toast.error(text.message, {
                    id: toastId,
                });
                return;
            } else {
                const image = await response.json();
                toast.success('Successfully updated avatar!', {
                    id: toastId,
                });
                e.target.reset();
                getUserAvatar();
                window.location.reload();
            }
            /*setUser({ ...user, avatar: data.avatar });*/
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", {
                id: toastId,
            });
        }
        
    }

    //get user info
    const getUserInfo = async () => {
        if (pathId !== user._id) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${pathId}`, {
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
                    const avatar = renderUserAvatar(data.user.avatar);
                    data.user.avatar = avatar;
                    data.user.isFriend = data.user.friends.some(friend => friend._id === user._id);
                    data.user.isRequested = data.user.friendRequests.some(request => request._id === user._id);
                    setFetchedUserinfo(data.user);
                    const loggedInUser = await refreshUserInfo();
                    const isRequestedResult = loggedInUser.friendRequests.includes(pathId);

                    setUser({ ...loggedInUser, isRequested: isRequestedResult });
                    setIsFetchingFriendsStaues(false);
                    return;
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
            }
        } else {
            setIsFetchingFriendsStaues(false);
        }
    }

    //GetRefresh user info
    const refreshUserInfo = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/me`, {
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
                const avatar = renderUserAvatar(data.user.avatar);
                data.user.avatar = avatar;
                return data.user;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    const renderUserAvatar = (avatar) => {
        if (avatar === undefined) {
            return avatarLogo;
        } else {
            return `data:${avatar.img.contentType};base64, ${Buffer.from(avatar.img.data.data).toString('base64')}`;
        }
    }

    const getUserAvatar = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${user._id}/profileImage`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            })
            if (!response.ok) {
                const text = await response.text();
                toast.error(text);
                return;
            } else {
                const avatar = await response.json();
                const avatarData = `data:${avatar.avatar.img.contentType};base64, ${Buffer.from(avatar.avatar.img.data.data).toString('base64')}`;
                setUser({ ...user, avatar: avatarData});
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong when fetching avatar");
        }
    }

    const handleSendFriendRequest = async () => {
        const toastId = toast.loading('Loading...');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${fetchedUserinfo._id}/friendrequest`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            })
            if (!response.ok) {
                const text = await response.text();
                toast.error(text, {
                    id: toastId,
                });
                return;
            } else {
                const data = await response.json();
                await getUserInfo();
                toast.success("Friend request sent!", {
                    id: toastId,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", {
                id: toastId,
            });
        }
    }

    const handleAcceptRequest = async () => {
        const toastId = toast.loading('Loading...');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${fetchedUserinfo._id}/acceptfriendrequest`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            })
            if (!response.ok) {
                const text = await response.text();
                toast.error(text, {
                    id: toastId,
                });
                return;
            } else {
                const data = await response.json();
                await refreshUserInfo();
                await getUserInfo();
                toast.success("Friend request accepted!", {
                    id: toastId,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", {
                id: toastId,
            });
        }
    }

    const handleRejectRequest = async () => {
        const toastId = toast.loading('Loading...');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${fetchedUserinfo._id}/rejectfriendrequest`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            })
            if (!response.ok) {
                const text = await response.text();
                toast.error(text, {
                    id: toastId,
                });
                return;
            } else {
                const data = await response.json();
                await refreshUserInfo();
                await getUserInfo();
                toast.success("Friend request rejected!", {
                    id: toastId,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", {
                id: toastId,
            });
        }
    }

    const handleRemoveFriend = async () => {
        const toastId = toast.loading('Loading...');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${fetchedUserinfo._id}/removefriend`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            })
            if (!response.ok) {
                const text = await response.text();
                toast.error(text, {
                    id: toastId,
                });
                return;
            } else {
                const data = await response.json();
                await refreshUserInfo();
                await getUserInfo();
                toast.success("Friend removed!", {
                    id: toastId,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", {
                id: toastId,
            });
        }
    }

    return (
        isFetchingPost || isFetchingFriendsStaues? 
        <Box sx={{ display: 'flex', width: '100vw', "justify-content": "center", "padding-top": "20vh" }}>
            <CircularProgress size={200}/>
        </Box>:
        pathId === user._id?
        <div className="profilePageContainer">
                <div className="profileContainer">
                    <div className="avatarSectionContainer">
                        <img src={user.avatar} alt="" className="profileAvatar"></img>
                        <span className="profileName">{user.name}</span>
                        <form onSubmit={(e) => handleAvatarSubmit(e)} className="avatarForm">
                            <input onChange={(e) => onInputChange(e)} type="file" name="imageFile" id="imageFile" />
                            <button className="updateAvatarButton">Update Avatar</button>
                        </form>
                    </div>                    
                </div>
                <div className="postWallContainer">
                    <PostSection posts={posts} getAllPosts={getAllPosts} replaceEditedPost={replaceEditedPost}/>
                </div>
            <Toaster/>
        </div>:

        // render other user profile page
        <div className="profilePageContainer">
            <div className="profileContainer">
                <div className="avatarSectionContainer">
                    <img src={fetchedUserinfo.avatar} alt="" className="profileAvatar"></img>
                    <span>{fetchedUserinfo.name}</span>
                        {fetchedUserinfo.isFriend ?
                        <div>
                            <span className="friendStatus"></span>
                            <button className="removeFriendButton" onClick={handleRemoveFriend}>Remove Friend</button>
                        </div>
                        : fetchedUserinfo.isRequested ?
                        <div>
                            <div className="requestedFriend">Requested, waiting for response...</div>
                        </div>
                        : user.isRequested ?
                        <div>
                            <button className="acceptRequestButton" onClick={handleAcceptRequest}>Accept</button>
                            <button className="rejectRequestButton" onClick={handleRejectRequest}>Reject</button>
                        </div>
                        :
                        <div>
                            <button className="sendFriendRequestButton" onClick={handleSendFriendRequest}>Send Friend Request</button>
                        </div>}
                </div>                
            </div>
            <div className="postWallContainer">
                <PostSection posts={posts} getAllPosts={getAllPosts} replaceEditedPost={replaceEditedPost}/>
            </div>
            <Toaster/>
        </div>
    )

}

export default Profile;