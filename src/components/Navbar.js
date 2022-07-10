import React from "react";
import { Link } from "react-router-dom";
import avatarLogo from "../assets/avatar/avatar.png";
import '../style/Navbar.css';

const Navbar = ({user}) => {
    return (
        <div className="navbar">
            <span className="logo">
                <Link className="link" to="/">Fake Book</Link>
            </span>
            {user ? (
                <ul className="list">
                <li className="listItem">
                    <img src={avatarLogo} alt="" className="avatar"></img>
                </li>
                <li className="listItem">Star Burst</li>
                <li className="listItem">Logout</li>
            </ul>
            ) : (<Link className="link" to="/login">Login</Link>)
            }            
        </div>
    )
}

export default Navbar;