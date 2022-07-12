import React, { useState, useEffect } from "react";
import UserContext from "../UserContext";
import '../style/PostWall.css';
import CreatePost from "./CreatePost";
import PostSection from "./PostSection";
import toast, { Toaster } from 'react-hot-toast';

const PostWall = () => {
    useEffect(() => {
        getAllPosts();
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

    return (
        <div className="postWallContainer">
            <CreatePost getAllPosts={getAllPosts}/>
            <PostSection posts={posts} getAllPosts={getAllPosts}/>
            <Toaster />
        </div>
    )
}

export default PostWall;