import React, { useContext, useEffect } from "react";
import UserContext from "../UserContext";
import Register from "./Register";
import { Link, useNavigate } from "react-router-dom";
import '../style/Login.css';
import toast, { Toaster } from 'react-hot-toast';
import avatarLogo from '../assets/avatar/avatar.png';
import { Buffer } from 'buffer';
import Button from '@mui/material/Button';

const Login = () => {

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        } else if (JSON.parse(localStorage.getItem("token"))) {
            autoLogin();
        }
    }, []);

    const autoLogin = async () => {
        const toastId = toast.loading('Loading...');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/me`, {
                headers: {
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            });
            if (!response.ok) {
                const text = await response.text();
                toast.error("Something went wrong", {
                    id: toastId,
                });
                return;
            } else {
                const data = await response.json();
                setUser(data.user);
                toast.remove(toastId);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", {
                id: toastId,
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const email = data.get("email");
        const password = data.get("password");
        const toastId = toast.loading('Loading...');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
                if (!response.ok) {
                    const text = await response.text();
                    toast.error(text, {
                        id: toastId,
                    });
                    return;
                };
            
            const user = await response.json();
            if (user.token) {
                localStorage.setItem("token", JSON.stringify(user.token));
                const avatar = renderUserAvatar(user.user.avatar);
                user.user.avatar = avatar;
                setUser(user.user);
                toast.success('Successfully Logged In!', {
                    id: toastId,
                })
                let loginNoti = setInterval(() => {
                    navigate("/");
                }, 2000);
                setTimeout(() => { clearInterval(loginNoti) }, 2000);
            }
        } catch (error) {
            toast.error("Something went wrong", {
                id: toastId,
            });
        }
    }

    const handleExampleUserLogin = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Loading...');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 'email': 'example@gmail.com',
                    'password': '159753' })
            });
                if (!response.ok) {
                    const text = await response.text();
                    toast.error(text, {
                        id: toastId,
                    });
                    return;
                };
            
            const user = await response.json();
            if (user.token) {
                localStorage.setItem("token", JSON.stringify(user.token));
                const avatar = renderUserAvatar(user.user.avatar);
                user.user.avatar = avatar;
                setUser(user.user);
                toast.success('Successfully Logged In!', {
                    id: toastId,
                })
                let loginNoti = setInterval(() => {
                    navigate("/");
                }, 2000);
                setTimeout(() => { clearInterval(loginNoti) }, 2000);
            }
        } catch (error) {
            toast.error("Something went wrong", {
                id: toastId,
            });
        }
    }

    const renderUserAvatar = (avatar) => {
        if (avatar === undefined) {
            return avatarLogo;
        } else {
            return `data:${avatar.img.contentType};base64, ${Buffer.from(avatar.img.data.data).toString('base64')}`;
        }
    }

    /*
        return (
        <div className="login">
            <h1 className="loginTitle">Choose a Login Method</h1>
            <div className="wrapper">
                <div className="left">
                    <div className="loginButton google">
                        <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="google" className="icon"/>
                        Google
                    </div>
                    <div className="loginButton facebook">
                        <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="facebook" className="icon"/>
                        Facebook
                    </div>
                </div>
                <div className="center">
                    <div className="line"/>
                    <div className="or">OR</div>
                </div>
                <div className="right">
                    <form onSubmit={(e) => handleSubmit(e)} action="POST">
                        <input name="email" type="email" placeholder="Email" className="email"/>
                        <input name="password" type="password" placeholder="Password" className="password"/>
                        <button className="submit">Login</button>
                    </form>
                    <Link className="link" to="/register">
                        <button className="submit">Register</button>
                    </Link>                    
                </div>
            </div>
            <Toaster />
        </div>
    )
    */

    return (
        <div className="login">
            <div className="wrapper">
                <div className="right">
                <h1 className="loginTitle">Enter your email and password</h1>
                    <form onSubmit={(e) => handleSubmit(e)} action="POST">
                        <input name="email" type="email" placeholder="Email" className="email"/>
                        <input name="password" type="password" placeholder="Password" className="password"/>
                        <button className="submit">Login</button>
                    </form>
                    <Link className="link" to="/register">
                        <button className="submit registerButton">Register</button>
                    </Link>
                    <Button variant="contained" color="success" onClick={(e) => handleExampleUserLogin(e)}>
                        Example User Login !
                    </Button>                    
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Login;