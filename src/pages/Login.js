import React, { useContext } from "react";
import UserContext from "../UserContext";
import Register from "./Register";
import { Link } from "react-router-dom";
import '../style/Login.css';

const Login = () => {

    const { user, setUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        console.log(data);
        const email = data.get("email");
        const password = data.get("password");
        const response = await fetch("http://localhost:5000/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                "email": email,
                "password": password
            }),
            mode: 'cors'
        });
        const user = await response.json();
        if (user.token) {
            console.log(user.user);
            localStorage.setItem("token", JSON.stringify(user.token));
            setUser(user.user.name);
        } else {
            console.log(user);
            alert(user.message);
        }
    }

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
        </div>
    )
}

export default Login;