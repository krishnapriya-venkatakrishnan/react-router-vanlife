import React from "react";
import { Link } from "react-router-dom";

export default function About(){
    return (
        <div className="about-container">
            <div className="about-image-container"></div>
            <div className="about-content-container">
                <h1>Don't squeeze in a sedan when you could relax in a van.</h1>
                <h2>Our mission is to enliven your road trip with the perfect travel van rental. Our vans are recertified before each trip to ensure your travel plans can go off without a hitch.</h2>
                <h2>(Hitch costs extra 😉)</h2>

                <h2>Our team is full of vanlife enthusiasts who know firsthand the magic of touring the world on 4 wheels.</h2>
            </div>
            <div className="about-explore-container">
                <h2>Your destination is waiting.
                <br />
                <br />
                Your van is ready.</h2>
                <Link className="link-about-btn" relative="path" to="../vans">Explore our vans</Link>
            </div>
        </div>
    )
}