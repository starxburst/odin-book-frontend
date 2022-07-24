import React from "react";
import PostWall from "../components/PostWall";
import ControlBoard from "../components/ControlBoard";
import FriendsBoard from "../components/FriendsBoard";
import '../style/Home.css';

const Home = () => {
    return (
        <div className="home">
            <ControlBoard/>
            <PostWall/>
            <FriendsBoard/>
        </div>
    )
}

export default Home;