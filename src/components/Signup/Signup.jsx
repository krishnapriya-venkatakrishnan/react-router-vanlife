import React, {useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUserData } from "../../api";

export default function Signup(){

    const location = useLocation()
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [dislpay, setDisplay] = useState("")

    function handleChange(event){
        const {name, value} = event.target

        setFormData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })

    }

    async function submitData(){
        try {
            const data = await updateUserData(formData)
            setDisplay("New user created")
            setFormData({
                name: "",
                email: "",
                password: ""
            })
            const pathName = "/login"
            navigate(pathName)
        } catch(err){
            setDisplay(err)
        }
    }

    function handleSubmit(event){
        event.preventDefault()
        submitData()
    }

    return (

        <div className="login-container">
            <h1>{dislpay}</h1>
            <form onSubmit={handleSubmit}>
                <input type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
                />
                <br />
                <input type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email ID"
                required
                />
                <br />
                <input type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                />

                <button>
                    Submit data
                </button>
            </form>
        </div>

    )
}