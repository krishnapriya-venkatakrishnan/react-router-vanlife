import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function AuthRequiredLayout(){
    const location = useLocation()
    const authenticated = localStorage.getItem("loggedInUser")

    if (!authenticated)
    {
        return (
            <Navigate to="./login" 
            state={{message: "You must log in first!", redirectTo: location.pathname}}
            replace
            />
        )
    }

    return <Outlet />

}