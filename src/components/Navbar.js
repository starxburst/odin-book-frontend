import React, { useContext, useMemo, useState } from "react";
import UserContext from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import MuiDrawer from "./MuiDrawer";
import avatarLogo from "../assets/avatar/avatar.png";
import '../style/Navbar.css';

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        setUser(false);
        navigate("/login");
    }

    return (

        <div className="navbar">
            <span className="logo">
                <div className="nav-drawer-container">
                    <MuiDrawer className='nav-drawer' logout={logout}/>
                </div>
                <Link className="link navbar-name" to="/">Fake Book</Link>
            </span>
            {user ? (
                <ul className="list">
                    <li className="listItem">
                        <img src={user.avatar} alt="" className="avatar" id="nav-avatar"></img>
                    </li>
                    <li className="listItem" id="nav-username">{user.name}</li>
                    <li onClick={() => logout()} className="listItem" id="nav-logout">Logout</li>
                </ul>
            ) : (<Link className="link" to="/login">Login</Link>)
            }            
        </div>
    )
}

export default Navbar;