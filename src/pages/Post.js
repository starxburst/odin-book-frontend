import React from "react";
import { useLocation } from "react-router-dom";
import { posts } from "../data";
import '../style/Post.css';

const Post = () => {

    const location = useLocation();
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
    )
}

export default Post;