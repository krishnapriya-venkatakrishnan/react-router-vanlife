import React from "react";
import { Link } from "react-router-dom";

export default function ReturnVanInGrid({id, picture, title, price, label, search}){

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

    
    return (
        <Link className="link-grid" to = {`./${id}`} state={{stateSearch: search, type: search? label: null}}
        aria-label={`View details for ${title}, 
                    priced at $${price} per day`}>
            <div className="van-in-grid-container">
                <div className="grid-image">
                    <img src={picture} alt={`Image of ${title}`} />
                </div>
                <div className="grid-details">
                    <div className="grid-title">
                        {title}
                    </div>
                    <div className="grid-price">
                        <p className="price">${price}</p>
                        <p>/ day</p>
                    </div>
                </div>
                <div className="grid-label" style={{
                    backgroundColor: bgColor
                    }}>
                    {label}
                </div>
            </div>
        </Link>
    )

}