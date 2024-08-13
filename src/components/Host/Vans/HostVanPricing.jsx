import React from "react";
import { useOutletContext } from "react-router-dom";

export default function HostVanPricing(){
    const vanDetails = useOutletContext()

    return (
        <div className="host-selected-van-pricing-container">
            ${vanDetails.price.toFixed(2)}<span>/ day</span>
        </div>
    )
}