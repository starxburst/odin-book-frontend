import React, { useState } from "react";
import UserContext from "../UserContext";
import '../style/CreatePost.css';
import avatarLogo from "../assets/avatar/avatar.png";
import toast, { Toaster } from 'react-hot-toast';

const CreatePost = () => {

    const handlePostCreate = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const content = data.get("content");
        try {
            const response = await fetch("http://localhost:5000/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                },
                body: JSON.stringify({
                    content: content
                })
            })
            if (!response.ok) {
                const text = await response.text();
                toast.error("Please edit your post!");
                return;
            } else {
                const post = await response.json();
                toast.success('Successfully Created Post!');
                console.log(post);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    

    return (
        <div className="createPostContainer">
            <img src={avatarLogo} alt="" className="postAvatar"/>
            <div className="postFormContainer">
                <form onSubmit={(e) => handlePostCreate(e)} className="postForm">
                    <input name="content"  className="postInput" type="text" placeholder="What's on your mind?"/>
                    <button className="postButton">Post</button>
                </form>
            </div>
            <Toaster />
        </div>
    )
}

export default CreatePost;