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
    console.log(pathId);

    const { user, setUser } = useContext(UserContext);
    const [fetchedUserinfo, setFetchedUserinfo] = useState(false);
    const [file, setFile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isBusy, setBusy] = useState(true);
    const [postSkip, setPostSkip] = useState(0);


    useEffect(() => {
        
        resetPosts()
        firstGetAllPosts();
        console.log(`path ID changed to ${pathId}`)
        
        getUserInfo()
    }, [pathId]);

    const resetPosts = async () => {
        
        setPosts([]);
        setPostSkip(0);
        console.log(`reset posts ${posts} and skip to ${postSkip}`);
        
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
                console.log(text);
                toast.error(text);
            } else {
                const userPosts = await response.json();
                console.log(posts);
                if (userPosts.posts.length > 0) {
                    setPosts(prevState => [...prevState, ...userPosts.posts]);
                    console.log(`posts: ${posts}`);
                }
                
                
                setPostSkip(prevState => 5);
                console.log(userPosts);
                console.log(userPosts.posts);
                console.log(posts);
                setBusy(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
        
    }



    const getAllPosts = async () => {
        try {
            console.log(`skip to ${postSkip}`);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/user/${pathId}?skip=${postSkip}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": JSON.parse(localStorage.getItem("token"))
            }
            })
            if (!response.ok) {
                const text = await response.text();
                console.log(text);
                toast.error(text);
            } else {
                const userPosts = await response.json();
                console.log(posts);
                if (userPosts.posts.length > 0) {
                    setPosts(prevState => [...prevState, ...userPosts.posts]);
                    console.log(`posts: ${posts}`);
                }
                
                
                setPostSkip(postSkip + 5);
                console.log(userPosts);
                console.log(userPosts.posts);
                console.log(posts);
                setBusy(false);
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
                console.log(fetchedPost);
                const index = posts.findIndex(post => post._id === postId);
                if (index !== -1) {
                    const tempPosts = [...posts];
                    tempPosts[index] = fetchedPost.post;
                    setPosts(tempPosts);
                    console.log(posts);
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
        console.log(file);
    }

    //upload image
    const handleAvatarSubmit = async (e) => {
        e.preventDefault();
        console.log(file);
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
                console.log(text);
                toast.error(text.message);
                return;
            } else {
                const image = await response.json();
                console.log(image);
                toast.success('Successfully updated avatar!');
                e.target.reset();
                getUserAvatar();
                window.location.reload();
            }
            /*setUser({ ...user, avatar: data.avatar });*/
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
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
                    console.log(text);
                    toast.error("Something went wrong");
                    return;
                } else {
                    const data = await response.json();
                    const avatar = renderUserAvatar(data.user.avatar);
                    data.user.avatar = avatar;
                    data.user.isFriend = data.user.friends.some(friend => friend._id === user._id);
                    console.log(data.user.friends);
                    data.user.isRequested = data.user.friendRequests.some(request => request._id === user._id);
                    console.log(data.user);
                    setFetchedUserinfo(data.user);
                    const loggedInUser = await refreshUserInfo();
                    console.log(loggedInUser);
                    console.log(loggedInUser.friendRequests);
                    const isRequestedResult = loggedInUser.friendRequests.includes(pathId);
                    console.log(isRequestedResult);

                    setUser({ ...loggedInUser, isRequested: isRequestedResult });
                    console.log(user);
                    setBusy(false);
                    return;
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
            }
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
                console.log(text);
                toast.error("Something went wrong");
                return;
            } else {
                const data = await response.json();
                const avatar = renderUserAvatar(data.user.avatar);
                data.user.avatar = avatar;
                console.log(data.user);
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
                console.log(avatar);
                const avatarData = `data:${avatar.avatar.img.contentType};base64, ${Buffer.from(avatar.avatar.img.data.data).toString('base64')}`;
                setUser({ ...user, avatar: avatarData});
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong when fetching avatar");
        }
    }

    const handleSendFriendRequest = async () => {
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
                toast.error(text);
                return;
            } else {
                const data = await response.json();
                console.log(data);
                toast.success("Friend request sent!");
                getUserInfo();
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    const handleAcceptRequest = async () => {
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
                toast.error(text);
                return;
            } else {
                const data = await response.json();
                console.log(data);
                toast.success("Friend request accepted!");
                refreshUserInfo();
                getUserInfo();
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    const handleRejectRequest = async () => {
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
                toast.error(text);
                return;
            } else {
                const data = await response.json();
                console.log(data);
                toast.success("Friend request rejected!");
                refreshUserInfo();
                getUserInfo();
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    const handleRemoveFriend = async () => {
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
                toast.error(text);
                return;
            } else {
                const data = await response.json();
                console.log(data);
                toast.success("Friend removed!");
                refreshUserInfo();
                getUserInfo();
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    return (
        isBusy? 
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