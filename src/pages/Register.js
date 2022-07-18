import React, { useContext } from "react";
import UserContext from "../UserContext";
import '../style/Register.css';
import { useNavigate } from "react-router-dom";

const Register = () => {

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        console.log(data);
        const email = data.get("email");
        const name = data.get("name");
        const password = data.get("password");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                "name": name,
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
            navigate("/");
        } else {
            console.log(user);
            alert(user.message);
        }
    }

    return (
        <div className="register">
            <h1 className="registerTitle">Enter your username and password</h1>
            <div className="right">
                <form onSubmit={(e) => handleSubmit(e)} action="POST">
                    <input name="email" type="email" placeholder="Email" className="email"/>
                    <input name="name" type="text" placeholder="Name" className="username"/>
                    <input name="password" type="password" placeholder="Password" className="password"/>
                    <button className="submit">Sign Up</button>
                </form>
            </div>
        </div>
    )

}

export default Register;