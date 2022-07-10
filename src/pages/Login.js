import React from "react";
import '../style/Login.css';

const Login = () => {
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
                    <input type="text" placeholder="Username" className="username"/>
                    <input type="password" placeholder="Password" className="password"/>
                    <button className="submit">Login</button>
                </div>
            </div>
        </div>
    )
}

export default Login;