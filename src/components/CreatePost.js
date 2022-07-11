import React, { useState } from "react";
import UserContext from "../UserContext";
import '../style/CreatePost.css';
import avatarLogo from "../assets/avatar/avatar.png";

const CreatePost = () => {
    return (
        <div className="createPostContainer">
            <img src={avatarLogo} alt="" className="postAvatar"/>
            <div className="postFormContainer">
                <form className="postForm">
                    <input className="postInput" type="text" placeholder="What's on your mind?"/>
                    <button className="postButton">Post</button>
                </form>
            </div>
        </div>
    )
}

export default CreatePost;