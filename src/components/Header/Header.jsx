import React, {useContext} from "react";
import { Link, NavLink } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { AuthContext } from "../Layout/Layout";

export default function Header(){
    
    const {user, logout} = useContext(AuthContext)
    function clearStorage(){
        localStorage.removeItem("loggedInUser")
        logout()
    }
    
    return (
        <header>
            <nav>
                <div className="nav-left">
                    <Link className="home-link" to="/">#VANLIFE</Link>
                </div>
                <div className="nav-right">
                    <NavLink to="/host" className={({ isActive }) => isActive ? "activeLink" : null}>
                        Host
                    </NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? "activeLink" : null}>
                        About
                    </NavLink>
                    <NavLink to="/vans" className={({ isActive }) => isActive ? "activeLink" : null}>
                        Vans
                    </NavLink>
                    <NavLink to="/cart" className={({ isActive }) => isActive ? "activeLink" : null}>
                        Cart
                    </NavLink>
                    <Link to="/login">
                        <FaRegUserCircle />
                    </Link>
                    {
                        user?.name && <p>{`Hi ${user.name}!`}</p>
                    }
                    {
                        user?.name && <button onClick={clearStorage}>Log out</button>
                    }
                </div>
            </nav>
        </header>
    )
}
