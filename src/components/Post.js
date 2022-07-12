import React from "react";
import '../style/Post.css';
import moment from 'moment';

const Post = ({ posts }) => {

    let postContent = posts.map(post => {
        return (
            <div className="postContainer">
                <div className="postHeader">
                    <img/>
                    <div className="postHeaderName">{post.author.name}</div>
                    <div className="postHeaderDate">{moment(post.timestamp).fromNow()}</div>
                </div>
                <div className="postContent">
                    {post.content}
                </div>
            </div>
        )
    })

    return (
        <div>
            {postContent}
        </div>
    )
}

export default Post;