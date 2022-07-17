import React, { useContext, useState } from "react";
import UserContext from "../UserContext";
import avatarLogo from "../assets/avatar/avatar.png";
import toast, { Toaster } from 'react-hot-toast';
import { Buffer } from 'buffer';

const Profile = () => {

    const { user, setUser } = useContext(UserContext);
    const [file, setFile] = useState(null);

    const onInputChange = (e) => {
        setFile(e.target.files[0]);
        console.log(file);
    }

    //upload image
    const handleAvatarSubmit = async (e) => {
        e.preventDefault();
        console.log(file);
        const formData = new FormData();
        formData.append("imageFile", file);
        try {
            const response = await fetch(`http://localhost:5000/api/user/${user._id}/profileimage`, {
            method: "POST",
            body: formData,
            headers: {
                "auth-token": JSON.parse(localStorage.getItem("token"))                
            }
            });
            if (!response.ok) {
                const text = await response.text();
                console.log(text);
                toast.error("Something went wrong");
                return;
            } else {
                const image = await response.json();
                console.log(image);
                toast.success('Successfully updated avatar!');
                e.target.reset();
                getUserAvatar();
            }
            /*setUser({ ...user, avatar: data.avatar });*/
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
        
    }

    const getUserAvatar = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/${user._id}/profileImage`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            })
            if (!response.ok) {
                const text = await response.text();
                toast.error(text);
                return;
            } else {
                const avatar = await response.json();
                console.log(avatar);
                const avatarData = `data:${avatar.avatar.img.contentType};base64, ${Buffer.from(avatar.avatar.img.data.data).toString('base64')}`;
                setUser({ ...user, avatar: avatarData});
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong when fetching avatar");
        }
    }

    return (
        <div profileContainer>
            <div className="avatarSectionContainer">
                <img src={user.avatar} alt="" className="avatar"></img>
                <span>{user.name}</span>
                <form onSubmit={(e) => handleAvatarSubmit(e)} className="avatarForm">
                    <input onChange={(e) => onInputChange(e)} type="file" name="imageFile" id="imageFile" />
                    <button className="avatarButton">Change Avatar</button>
                </form>
            </div>
            <Toaster/>
        </div>
    )

}

export default Profile;