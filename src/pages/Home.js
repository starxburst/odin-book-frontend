import React from "react";
import { posts } from "../data";
import Card from "../components/Card";

const Home = () => {
    return (
        <div className="home">
            {posts.map(post => (
                <Card post={post} key={post.id} />
                ))}
        </div>
    )
}

export default Home;