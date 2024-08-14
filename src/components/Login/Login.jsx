import React, { useState, useContext } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { loginUser } from "../../api";
import { AuthContext } from "../Layout/Layout";

export default function Login(){
    
    const {login} = useContext(AuthContext)
    
    const location = useLocation()
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [status, setStatus] = useState("idle")
    const [error, setError] = useState(null)

    function handleChange(event){
        const {name, value} = event.target
        setFormData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
    }

    async function verifyLoginUser(){
        try {
            let data = await loginUser(formData)
            
            const strData = JSON.stringify(data)
            localStorage.setItem("loggedInUser", strData)
            login({
                name: JSON.parse(strData).name,
                email: JSON.parse(strData).email,
            })

            const pathName = location.state?.redirectTo || "/host"
            navigate(pathName, {replace: true})
            
        } catch (err){
            console.log(err)
            setError(err)
        } finally {
            setStatus("idle")
        }
    }

    function handleSubmit(event){
        setStatus("submitting")
        setError(null)
        event.preventDefault()
        verifyLoginUser()
    }

    return (
        <div className="login-container">
            {
                location.state?.message ? <h1 className="navigate-message">{location.state.message}</h1> :
                null
            }
            <h1>Sign in to your account</h1>
            {
                error && <h1 className="login-error-message">{error.message}</h1>
            }
            <form onSubmit={handleSubmit}>
                <input type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                />
                <input type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <button disabled={status === "submitting"}>
                    {
                        status === "submitting" ? "Loggin in" : "Log in"
                    }
                </button>
            </form>
            <NavLink 
            style={{color: "black"}}
            to="../signup"
            relative="path"
            state={{redirect: location.state?.redirectTo}} 
            replace
            >
                Create account</NavLink>
        </div>
    )
}