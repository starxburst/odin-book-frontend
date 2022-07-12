import React, { useState } from "react";
import UserContext from "../UserContext";
import '../style/PostWall.css';
import CreatePost from "./CreatePost";
import PostSection from "./PostSection";

const PostWall = () => {
    return (
        <div className="postWallContainer">
            <CreatePost/>
            <PostSection/>
        </div>
    )
}

export default PostWall;