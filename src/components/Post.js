import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";
import '../style/Post.css';
import moment from 'moment';
import avatarLogo from '../assets/avatar/avatar.png';
import Comment from "./Comment";
import CreateComment from "./CreateComment";
import LikeButton from "./PostLikeButton";
import { Buffer } from 'buffer';
import PostLikeButton from "./PostLikeButton";

const Post = ({ posts, getAllPosts }) => {

    const { user, setUser } = useContext(UserContext);

    const renderUserAvatar = (avatar) => {
        if (avatar === undefined) {
            return avatarLogo;
        } else {
            return `data:${avatar.img.contentType};base64, ${Buffer.from(avatar.img.data.data).toString('base64')}`;
        }
    }

    let postContent = posts.map(post => {
        return (
            <div className="postContainer">
                <div className="postWrapper">
                    <div className="postHeaderContainer">
                        <img src={renderUserAvatar(post.author.avatar)} alt="" className="postAvatar"/>
                        <div>
                            <Link to={`/profile/${post.author._id}`} className="link">
                                <div className="postHeaderName">{post.author.name}</div>
                            </Link>
                            <div className="postHeaderDate">{moment(post.timestamp).fromNow()}</div>
                        </div>
                    </div>
                    <div className="postContent">
                        {post.content}
                    </div>
                    <div className="postStatusContainer">
                        <span className="likeCountContainer">{post.likes.length} like</span>
                        <span className="commentCountContainer">{post.comments.length > 1? `${post.comments.length} comments`: `${post.comments.length} comment`}</span>
                    </div>
                    <hr className="commentHr" />
                    <PostLikeButton likedUser={post.likes} postId={post._id} getAllPosts={getAllPosts}/>
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