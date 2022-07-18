import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";
import '../style/ControlBoard.css';
import avatarLogo from "../assets/avatar/avatar.png";
import Profile from "../pages/Profile";

const ControlBoard = () => {
    const { user, setUser } = useContext(UserContext);

    return (
        <div className="controlBoardContainer">
            <div className="controlBoardItem">
                <div className="controlBoardUser">
                    <img src={user.avatar} alt="" className="avatar"></img>
                    <div className="controlBoardName">{user.name}</div>
                </div>
                <Link to={`/profile/${user._id}`} className="link">
                    <div className="controlBoardItem">Account</div>
                </Link>
                <Link to={`/friends`} className="link">
                    <div className="controlBoardItem">Friends</div>
                </Link>
                <Link to={`/search`} className="link">
                    <div className="controlBoardItem">Search</div>
                </Link>
            </div>
        </div>
    )
}

export default ControlBoard;