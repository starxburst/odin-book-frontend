import React, { useState } from "react";
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Post from './pages/Post';
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserContext from './UserContext';

function App() {
  const [user, setUser] = useState(false);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{user, setUser}}>
        <div className="App">
          <Navbar user={user}/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login/>} />
            <Route path="/post/:id" element={user? <Post/> : <Navigate to="/login"/>} />
            <Route path="/register" element={user? <Navigate to="/" /> : <Register/>} />
          </Routes>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
