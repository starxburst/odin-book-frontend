import React, { useState, useEffect, useContext } from "react";
import UserContext from "../UserContext";
import '../style/PostWall.css';
import CreatePost from "./CreatePost";
import PostSection from "./PostSection";
import toast, { Toaster } from 'react-hot-toast';
import { Buffer } from 'buffer';
import avatarLogo from "../assets/avatar/avatar.png";

const PostWall = () => {
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        getAllPosts();
        getUserAvatar();
    }, [])

    const [posts, setPosts] = useState([]);

    const getAllPosts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/posts/", {
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
                const posts = await response.json();
                setPosts(posts.posts);
                console.log(posts.posts);
                console.log(posts);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
        
    }

    const getUserAvatar = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/${user._id}/profileImage`, {
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
        <div className="postWallContainer">
            <CreatePost getAllPosts={getAllPosts}/>
            <PostSection posts={posts} getAllPosts={getAllPosts}/>
            <Toaster />
        </div>
    )
}

export default PostWall;