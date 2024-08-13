import React, { useEffect, useState } from "react";
import "../../server"
import { getVans } from "../../api";
import ReturnVanInGrid from "./ReturnVanInGrid";
import { useSearchParams } from "react-router-dom";

export default function DisplayVansInGrid(){

    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [vanData, setVanData] = useState([])
    const typeFilter = searchParams.get("type")
    
    useEffect(()=> {
        
        async function loadVanData(){
            setLoading(true)
            try {
                const data = await getVans()
                setVanData(data)
            }
            catch(err){
                console.log("error happening")
                setError(err)
            }
            finally{
                setLoading(false)
            }
        }

        loadVanData()

    }, [])

    const filteredVanData = typeFilter ?
        vanData.filter(van => van.type.toLowerCase() === typeFilter.toLowerCase())
        : vanData

    const displayData = filteredVanData?.map(van => {
        
        return (
        <ReturnVanInGrid 
            key={van.id}  
            id={van.id}       
            picture={van.imageUrl.url}
            title={van.name}
            price={van.price}
            label={van.type}
            search={searchParams.toString()} />)

    })

    if (loading)
        return (
        <div className="vans-container">
            <h1 aria-live="polite">Loading...</h1>
        </div>
        )

    if (error){
        return (
        <div className="vans-container">
            <h1 aria-live="assertive">An error was returned: {error.message}</h1>
        </div>)
    }

    return (
        <div className="vans-container">
            <h1>Explore our van options</h1>
            <div className="labels-container">
                <div className="labels">
                    <button className={`simple ${typeFilter?.toLowerCase() === "simple" ? "simple-selected" : null}`} 
                        onClick={()=> setSearchParams({type: "simple"})}>Simple</button>
                    <button className={`luxury ${typeFilter?.toLowerCase() === "luxury" ? "luxury-selected" : null}`}  
                        onClick={()=> setSearchParams({type: "luxury"})}>Luxury</button>
                    <button className={`rugged ${typeFilter?.toLowerCase() === "rugged" ? "rugged-selected" : null}`} 
                        onClick={()=> setSearchParams({type: "rugged"})}>Rugged</button>
                </div>
                {typeFilter && <div className="clear-filters-container">
                    <button onClick={()=> setSearchParams({})}>Clear filters</button>
                </div>}
            </div>
            <div className="display-van-grid-container">
                {displayData}
            </div>
        </div>
    )
}