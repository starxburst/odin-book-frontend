import React from "react";
import PostWall from "../components/PostWall";
import ControlBoard from "../components/ControlBoard";
import '../style/Home.css';

const Home = () => {
    return (
        <div className="home">
            <ControlBoard/>
            <PostWall/>
        </div>
    )
}

export default Home;