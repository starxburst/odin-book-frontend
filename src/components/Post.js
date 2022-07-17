import React, { useContext } from "react";
import UserContext from "../UserContext";
import '../style/Post.css';
import moment from 'moment';
import avatarLogo from '../assets/avatar/avatar.png';
import Comment from "./Comment";
import CreateComment from "./CreateComment";

const Post = ({ posts, getAllPosts }) => {

    const { user, setUser } = useContext(UserContext);

    let postContent = posts.map(post => {
        return (
            <div className="postContainer">
                <div className="postWrapper">
                    <div className="postHeaderContainer">
                        <img src={user.avatar} alt="" className="postAvatar"/>
                        <div>
                            <div className="postHeaderName">{post.author.name}</div>
                            <div className="postHeaderDate">{moment(post.timestamp).fromNow()}</div>
                        </div>
                    </div>
                    <div className="postContent">
                        {post.content}
                    </div>
                    <Comment comments={post.comments}/>
                    <CreateComment postId={post._id} getAllPosts={getAllPosts}/>
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