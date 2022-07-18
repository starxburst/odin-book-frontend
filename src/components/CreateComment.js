import React, {useContext} from "react";
import UserContext from "../UserContext";
import '../style/CreateComment.css';
import avatarLogo from '../assets/avatar/avatar.png';
import toast, { Toaster } from 'react-hot-toast';

const CreateComment = ({ postId, getAllPosts }) => {

    const { user, setUser } = useContext(UserContext);

    const handleCommentCreate = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const comment = data.get('comment');
        const id = e.target.id;
        console.log(comment);
        console.log(id);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                },
                body: JSON.stringify({
                    comment: comment
                })
            });
            if (!response.ok) {
                const text = await response.text();
                toast.error(text);
                return;
            } else {
                const comment = await response.json();
                toast.success('Successfully Created Comment!');
                console.log(comment);
                getAllPosts();
                e.target.reset();
            }        
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }


    return (
        <div className="createCommentContainer">
            <img src={user.avatar} alt="" className="commentAvatar"/>
            <div className="postCommentContainer">
                <form onSubmit={(e) => handleCommentCreate(e)} id={postId} className="commentForm">
                    <input name="comment" type="text" className="commentInput" placeholder="Write a comment..." />
                    <button className="commentButton">Send</button>
                </form>
            </div>
            <Toaster />
        </div>
    )
}

export default CreateComment;