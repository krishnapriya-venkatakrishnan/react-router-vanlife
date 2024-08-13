import React from "react";
import { useOutletContext } from "react-router-dom";

export default function HostVanDetails(){
    const vanDetails = useOutletContext()
    
    return (
        <div className="host-selected-van-details-container">
            <div className="host-selected-van-details-name">
                Name: <span>{vanDetails.name}</span>
            </div>
            <div className="host-selected-van-details-category">
                Category: <span>{vanDetails.type}</span>
            </div>
            <div className="host-selected-van-details-description">
                Description: <span>{vanDetails.description}</span>
            </div>
            <div className="host-selected-van-details-visibility">
                Visibility: <span>Public</span>
            </div>
        </div>
    )
}