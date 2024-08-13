import React from "react";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function HostLayout(){
    
    
    const activeStyle = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616"
    }

    return (
        <div className="host-layout-container">
            <div className="link-host">
                <NavLink to="." end style={({ isActive }) => isActive ? activeStyle : null}>
                    Dashboard
                </NavLink>
                <NavLink to="income" style={({ isActive }) => isActive  ? activeStyle : null}>
                    Income
                </NavLink>
                <NavLink to="vans" style={({ isActive }) => isActive  ? activeStyle : null}>
                    Vans
                </NavLink>
                
            </div>
            <Outlet />
        </div>
    )
}