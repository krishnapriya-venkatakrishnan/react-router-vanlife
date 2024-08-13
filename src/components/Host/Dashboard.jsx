import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsStarFill } from "react-icons/bs";
import HostVans from "./HostVans";
import { getHostDetails } from "../../api";

export default function Dashboard(){
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [hostData, setHostData] = useState([])

    useEffect(()=> {
        async function getData(){
            try {
                const data = await getHostDetails("123")
                setHostData(data)
            } catch(err){
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    if (loading)
        return (<h1>Loading...</h1>)

    if (error)
        return (<h1>{error}</h1>)

    return (
        <div className="dashboard-container">
            <div className="dashboard-income-container">
                <h1>Welcome!</h1>
                <div className="dashboard-income-link-container">
                    <h2>Total transaction amount</h2>
                    <Link className="dashboard-income-link" to="./income">Details</Link>
                </div>
                <h1>${hostData?.totalTxnAmount || 0}</h1>
            </div>
            <div className="dashboard-review-link-container">
                <h2>Review score <BsStarFill /> {hostData?.ratings || 0}/5</h2>
            </div>
            <HostVans from="dashboard"/>
        </div>
    )
}