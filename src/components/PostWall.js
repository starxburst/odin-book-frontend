import React, { useState } from "react";
import UserContext from "../UserContext";
import '../style/PostWall.css';
import CreatePost from "./CreatePost";

const PostWall = () => {
    return (
        <div className="postWallContainer">
            <CreatePost/>
        </div>
    )
}

export default PostWall;