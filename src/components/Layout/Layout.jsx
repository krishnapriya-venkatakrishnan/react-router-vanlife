import React, {useState, createContext} from "react";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

const AuthContext = createContext()
export {AuthContext}

export default function Layout(){
    
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("loggedInUser")))

    const login = (userData) => {
        setUser(userData);
    }

    const logout = () => {
        setUser(null);
    }
    
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            <Header />
            <Outlet />
            <Footer />
        </AuthContext.Provider>
    )
}