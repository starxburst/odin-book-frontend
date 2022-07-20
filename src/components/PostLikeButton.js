import React, { useContext } from "react";
import UserContext from "../UserContext";
import '../style/PostLikeButton.css';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import toast, { Toaster } from 'react-hot-toast';

const PostLikeButton = ({ likedUser, postId, getAllPosts }) => {
    const { user, setUser } = useContext(UserContext);

    const handleLikedPost = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/unlike`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            });
            const json = await response.json();
            if (response.ok) {
                await getAllPosts();
                toast.success('You unliked this post!');
            } else {
                toast.error(json.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }        
    }

    const handleUnlikePost = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            });
            const json = await response.json();
            if (response.ok) {
                await getAllPosts();
                toast.success("You liked this post!");
            } else {
                toast.error(json.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }


    return (
        <div>
            {likedUser.includes(user._id) ? (
                <div onClick={handleLikedPost} className="likeButtonContainer">
                    <ThumbUpAltIcon className="likeButton" />
                    <div className="likeButtonText">Liked</div>
                </div>
            ): (
                <div onClick={handleUnlikePost} className="likeButtonContainer">
                    <ThumbUpOffAltIcon className="likeButton" />
                    <div className="likeButtonText">Like</div>
                </div>
                )}
            <Toaster />
        </div>
    )
}

export default PostLikeButton;