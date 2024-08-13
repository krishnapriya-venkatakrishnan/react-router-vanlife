import React, {useState, useEffect} from "react";
import { Outlet, useParams, Link, NavLink } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { getHostVanDetail } from "../../api";

export default function HostVanDetailLayout(){
    
    const [hostVanDetail, setHostVanDetail] = useState(null)
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    useEffect(()=> {
        async function getData(){
            setLoading(true)
            try {
                const data = await getHostVanDetail(params.id)
                setHostVanDetail(data)
            }
            catch(err){
                setError(err)
            }
            finally {
                setLoading(false)
            }
        }
        getData()
    }, [params])

    const getBgColor = (label) => {
        let bgColor = ""
        if (label ==="simple"){
            bgColor = "#E17654"
        }
        else if (label === "rugged"){
            bgColor = "#115E59"
        }
        else if (label === "luxury"){
            bgColor = "#161616"
        }
        return bgColor
    }

    const activeStyle = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616"
    }

    if (loading)
        return (
        <div className="host-van-layout">
            <h1 aria-live="polite">Loading...</h1>
        </div>
        )

    if (error){
        return (
        <div className="host-van-layout">
            <h1 aria-live="assertive">An error was returned: {error.message}</h1>
        </div>)
    }

    if (!hostVanDetail)
        return (
            <div className="host-van-layout">
                <h1>No vans for this host</h1>
            </div>)
    
    return (
        <div className="host-van-layout">
            <Link className="link-van-details" relative="path" to = "..">
                <IoArrowBack />
                Back to all vans
            </Link>
            <div className="host-van-details-container">
                <div className="host-van-brief">
                    <div className="host-van-image">
                        <img src={hostVanDetail.imageUrl.url} alt={`Image of ${hostVanDetail.name}`} />
                    </div>
                    <div className="host-van-info">
                        <div className="label" style={{
                            backgroundColor: getBgColor(hostVanDetail.type)
                            }}>
                                {hostVanDetail.type}
                        </div>
                        <h1>{hostVanDetail.name}</h1>
                        <h2>${hostVanDetail.price}<span>/day</span></h2>
                    </div>
                    <div className="edit-link-container">
                        <Link to = {`edit/${params.id}`} state={{vanId: params}}>Edit</Link>
                    </div>
                </div>
                <div className="host-van-details-link-container">
                    <NavLink to={`.`} end style={({isActive}) => isActive ? activeStyle: null}>
                        Details
                    </NavLink>
                    <NavLink to={`pricing`} style={({isActive}) => isActive ? activeStyle: null}>
                        Pricing
                    </NavLink>
                    <NavLink to={`photos`} style={({isActive}) => isActive ? activeStyle: null}>
                        Photos
                    </NavLink>
                </div>
                
                <Outlet context={hostVanDetail}/>
                
            </div>
        </div>
    )
}
