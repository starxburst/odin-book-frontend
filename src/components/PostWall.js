import React, { useState, useEffect, useContext } from "react";
import UserContext from "../UserContext";
import '../style/PostWall.css';
import CreatePost from "./CreatePost";
import PostSection from "./PostSection";
import toast, { Toaster } from 'react-hot-toast';
import { Buffer } from 'buffer';
import avatarLogo from "../assets/avatar/avatar.png";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PostWall = () => {
    const { user, setUser } = useContext(UserContext);
    const [isBusy, setBusy] = useState(true);
    const [postSkip, setPostSkip] = useState(0);

    useEffect(() => {
        getAllPosts();
        getUserAvatar();
    }, [])

    const [posts, setPosts] = useState([]);

    const getAllPosts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/?skip=${postSkip}`, {
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
                const fetchedPosts = await response.json();
                setPosts([...posts].concat(fetchedPosts.posts));
                console.log(fetchedPosts.posts);
                console.log(fetchedPosts);
                setBusy(false);
                setPostSkip(postSkip + 5);
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

    const getUserAvatar = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${user._id}/profileImage`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            })
            if (response.status === 404 ) {
                return setUser({...user, avatar: avatarLogo});
            }
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

    return (
        isBusy? 
        <Box sx={{ display: 'flex', width: '60vw', "justify-content": "center", "padding-top": "20vh" }}>
            <CircularProgress size={200}/>
        </Box>:
        <div className="postWallContainer">
            <CreatePost getAllPosts={getAllPosts} replaceEditedPost={replaceEditedPost}/>
            <PostSection posts={posts} getAllPosts={getAllPosts} replaceEditedPost={replaceEditedPost}/>
            <Toaster />
        </div>
    )
}

export default PostWall;