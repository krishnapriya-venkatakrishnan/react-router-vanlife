import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHostVans, deleteVanDetails } from "../../api";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";


export default function HostVans({ from }){

    const [hostVans, setHostVans] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(()=> {
        async function getData(){
            setLoading(true)
            try {
                const data = await getHostVans()
                setHostVans(data)
            }
            catch(err){
                setError(err)
            }
            finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    async function deleteVan(vanId){
        await deleteVanDetails(vanId)
        window.location.reload()
    }

    const displayHostVans = hostVans.map(van => {
        return (
        <div className="host-vans-delete-container">
        <Link key={van.id} className="link-host-van" to={`./${van.id}`}>
            <div className="host-van">
                <div className="host-van-image">
                    <img src={van.imageUrl.url} alt={`image of ${van.name}`} />
                </div>
                <div className="host-van-details">
                    <h1>{van.name}</h1>
                    <h2>${van.price}/day</h2>
                </div>                
            </div>
        </Link>
        <button onClick={() => deleteVan(van.id)} className="delete-btn"><FaCircleMinus /></button>    
        </div>)
    })

    const displayHostDashboardVans = hostVans.map(van => {
        return (
            <div className="host-van">
                <div className="host-van-image">
                    <img src={van.imageUrl.url} alt={`image of ${van.name}`} />
                </div>
                <div className="host-van-details">
                    <h1>{van.name}</h1>
                    <h2>${van.price}/day</h2>
                </div>
                <div className="edit-view-container">
                    <Link to={`vans/${van.id}`} className="dashboard-van-link">
                        View
                    </Link>
                </div>
            </div>
        )
    })

    if (loading)
        return (
        <div className="host-vans-container">
            <h1 aria-live="polite">Loading...</h1>
        </div>
        )

    if (error){
        return (
        <div className="host-vans-container">
            <h1 aria-live="assertive">An error was returned: {error.message}</h1>
        </div>)
    }

    return (
        <div className="host-vans-container">
            <div className="host-vans-dashboard-title">
                <h1>Your listed vans</h1>
                {
                    from === "dashboard" ? <Link className="dashboard-vans-link" to="./vans">View all</Link> :
                    <Link className="dashboard-add-vans-link" to="./addVan"><FaCirclePlus /></Link>
                }

            </div>
            {from === "dashboard" 
            ? displayHostDashboardVans
            : displayHostVans}
        </div>
    )
}