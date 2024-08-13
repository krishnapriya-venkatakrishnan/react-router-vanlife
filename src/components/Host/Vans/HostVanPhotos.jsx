import React from "react";
import { useOutletContext } from "react-router-dom";

export default function HostVanPhotos(){
    const vanDetails = useOutletContext()

    const displayPhotos = vanDetails.photos?.map((photo, index) => {
        return (
            <div key={`photo-${index}`} className="host-selected-van-photo">
                <img src={photo.url} alt={`Image of ${photo.name}`} />
            </div>
        )
    })

    return (
        <div className="host-selected-van-photos-container">
            {displayPhotos}
        </div>
    )
}