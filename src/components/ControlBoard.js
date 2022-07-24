import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";
import '../style/ControlBoard.css';
import avatarLogo from "../assets/avatar/avatar.png";
import friendsLogo from "../assets/icon/friends.png";
import searchLogo from "../assets/icon/search.png";
import settingLogo from "../assets/icon/setting.png";

const ControlBoard = () => {
    const { user, setUser } = useContext(UserContext);

    return (
        <div className="controlBoardContainer">
            <div className="controlBoardItem">
                <div className="controlBoardUser">
                    <img src={user.avatar} alt="" className="avatar"></img>
                    <div className="controlBoardName">{user.name}</div>
                </div>
                <Link to={`/profile/${user._id}`} className="link controlBoardItemContainer">
                    <img src={settingLogo} alt="" className="controlBoardLogo"/>
                    <div className="controlBoardItem">Account</div>
                </Link>
                <Link to={`/friends`} className="link controlBoardItemContainer">
                    <img src={friendsLogo} alt="" className="controlBoardLogo"/>
                    <div className="controlBoardItem">Friends</div>
                </Link>
                <Link to={`/search`} className="link controlBoardItemContainer">
                    <img src={searchLogo} alt="" className="controlBoardLogo"/>
                    <div className="controlBoardItem">Search</div>
                </Link>
            </div>
        </div>
    )
}

export default ControlBoard;