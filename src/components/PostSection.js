import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import avatarLogo from "../assets/avatar/avatar.png";
import toast, { Toaster } from 'react-hot-toast';
import Post from "./Post";
import '../style/PostSection.css';

const PostSection = ({posts}) => {

    /*const location = useLocation();
    console.log(location);
    const path = location.pathname.split("/")[2];
    const post = posts.find(post => post.id.toString() === path);
    return (
        <div className="post">
            <img src={post.img} alt="" className="postImg"/>
            <h1 className="postTitle">{post.title}</h1>
            <p className="postDesc">{post.desc}</p>
            <p className="postLongDesc">{post.longDesc}</p>
        </div>
    )*/

    return (
        <div className="postSectionContainer">
            <Post posts={posts} />
            <Toaster />
        </div>
    )

    
}

export default PostSection;