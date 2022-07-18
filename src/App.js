import React, { useState } from "react";
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Post from './components/PostSection';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import PrivateRoutes from "./services/PrivateRoutes";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserContext from './UserContext';
import Search from "./pages/Search";

function App() {
  const [user, setUser] = useState(false);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{user, setUser}}>
        <div className="App">
          <Navbar user={user}/>
          <Routes>
            <Route element={<PrivateRoutes/>}>
              <Route path="/" element={<Home />}/>
              <Route path="/post/:id" element={<Post/>} />
              <Route path="/profile/:id" element={<Profile/>} />
              <Route path="/friends" element={<Friends/>} />
              <Route path="/search" element={<Search/>} />
            </Route>
            <Route element={<Login/>} path="/login" />
            <Route path="/register" element={user? <Navigate to="/" /> : <Register/>} />
          </Routes>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
