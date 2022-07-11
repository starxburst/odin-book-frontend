import React, { useContext } from "react";
import UserContext from "../UserContext";
import '../style/ControlBoard.css';
import avatarLogo from "../assets/avatar/avatar.png";

const ControlBoard = () => {
    const { user, setUser } = useContext(UserContext);

    return (
        <div className="controlBoardContainer">
            <div className="controlBoardItem">
                <div className="controlBoardUser">
                    <img src={avatarLogo} alt="" className="avatar"></img>
                    <div className="controlBoardName">{user.name}</div>
                </div>
            </div>
        </div>
    )
}

export default ControlBoard;