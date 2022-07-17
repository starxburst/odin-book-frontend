import React from "react";
import '../style/Comment.css';
import moment from "moment";
import avatarLogo from '../assets/avatar/avatar.png';
import { Buffer } from 'buffer';

const Comment = ({ comments }) => {

    const renderUserAvatar = (avatar) => {
        if (avatar === undefined) {
            return avatarLogo;
        } else {
            return `data:${avatar.img.contentType};base64, ${Buffer.from(avatar.img.data.data).toString('base64')}`;    }
        

    }

    let postComment = comments.map(comment => {
        return (
            <div className="commentContainer">
                <hr className="commentHr" />
                <div className="commentWrapper">
                    <div className="commentHeaderContainer">
                    <img src={renderUserAvatar(comment.user.avatar)} alt="" className="commentAvatar"/>
                        <div>
                            <div className="commentHeaderName">{comment.user.name}</div>
                            <div className="commentHeaderDate">{moment(comment.timestamp).fromNow()}</div>
                        </div>
                    </div>
                    <div className="commentContent">
                        {comment.comment}
                    </div>
                </div>
            </div>
        )
    })

    
    
    return (
        <div>
            {postComment}
        </div>
    )
}

export default Comment;