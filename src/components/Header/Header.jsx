import React, {useContext} from "react";
import { Link, NavLink } from "react-router-dom";
import { FiUserPlus, FiUserMinus } from "react-icons/fi";
import { AuthContext } from "../Layout/Layout";

export default function Header(){
    
    const {user, logout} = useContext(AuthContext)
    function clearStorage(){
        localStorage.removeItem("loggedInUser")
        logout()
    }
    
    return (
        <header>
            {
                user?.name && <div id="logged-in-user">{`Hi ${user.name}!`}</div>
            }
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
                        <button className="log-in-out-btn"><FiUserPlus  /></button>
                    </Link>
                    
                    {
                        user?.name && <button className="log-in-out-btn" onClick={clearStorage}><FiUserMinus  /></button>
                    }
                </div>
            </nav>
        </header>
    )
}
