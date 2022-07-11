import { Outlet, Navigate } from "react-router-dom";
import UserContext from "../UserContext";
import React, { useContext } from "react";

const PrivateRoutes = () => {
    const { user, setUser } = useContext(UserContext);
    return (
        user ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes;