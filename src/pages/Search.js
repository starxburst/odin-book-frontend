import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import avatarLogo from "../assets/avatar/avatar.png";
import { Buffer } from 'buffer';

const Search = () => {

    const [searchResult, setSearchResult] = useState("");

    const renderUserAvatar = (avatar) => {
        if (avatar === undefined) {
            return avatarLogo;
        } else {
            return `data:${avatar.img.contentType};base64, ${Buffer.from(avatar.img.data.data).toString('base64')}`;
        }
    }


    const handleSearchUsers = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const searchParam = data.get("search");
        console.log(searchParam);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/search/${searchParam}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            });

            if (response.status === 404) {
                return toast.error("No user found");
            } else if (!response.ok) {
                const text = await response.text();
                toast.error(text);
                return;
            } else {
                const searchResult = await response.json();
                console.log(searchResult.users);
                setSearchResult(searchResult.users);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="searchPageContainer">
            <div className="searchUserContainer">
                <h1>Search User</h1>
                <form onSubmit={(e) => handleSearchUsers(e)}>
                    <input name="search" type="text" placeholder="Search User" className="searchUserInput"></input>
                </form>
            </div>
            { searchResult !== "" ? (
            <div className="searchResultSectionContainer">
                <h2>Search result</h2>
                <div className="searchResultContainer">
                    {searchResult.map((user) => {
                        return (
                            <div className="searchResult">
                                <Link to={`/profile/${user._id}`} className="link" >
                                    <img src={renderUserAvatar(user.avatar) } alt="" className="postAvatar"/>
                                    <div className="searchUserName">{user.name}</div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>) : null}
            <Toaster />
        </div>
    )

}

export default Search;