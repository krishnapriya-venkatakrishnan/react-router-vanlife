import React, { useEffect, useState } from "react";
import { BsStarFill } from "react-icons/bs";
import { getVanDetail } from "../../api";

export default function Reviews({vanId}){
    const [reviewsData, setReviewsData] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        async function getData(){
            
            try {
                const data = await getVanDetail(vanId)
                if (data.reviews?.length > 0){
                    let tempData = []
                    for (let i=0; i<data.reviews.length; i++){
                        tempData.push(data.reviews[i])
                    }
                    
                    function parseDate(dateString) {
                        const [day, month, year] = dateString.split("-").map(Number);
                            return new Date(year, month - 1, day);
                    }
    
                    // Sort the reviews array in descending order based on the date
                    const sortedData = tempData.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    
                    setReviewsData(sortedData)
                } else {
                    setError("No reviews yet! 😑")
                }
            } catch(err){
                setError(err)
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    
    if (loading){
        return (<h1>Loading...</h1>)
    }
    
    if (error){
        return (<h1>{error}</h1>)
    }

    const rows = [5, 4, 3, 2, 1]
    
    function calculatePercentage(rating){
        const sameRatingArray = reviewsData.filter(data => {
            return (data.stars === rating)
        })
        return (sameRatingArray.length / reviewsData.length)* 100
    }

    const displayReviewGraph = rows.map((row, index) => {
        const percentage = `${calculatePercentage(row)}%`
        return (
            <div key={`graph-${index}`} className="graph-row">
                <h4>{row} {row > 1 ? "stars" : "star"}</h4>
                <div className="bar-container">
                    <div style={{
                        backgroundColor: "#FF8C38",
                        width: percentage,
                        height: "100%",
                        borderRadius: "inherit",
                    }}></div>
                </div>
                <h4>{percentage}</h4>
            </div>
        )
    })

    function displayRating(rating){
        let ratingElement = []
        for (let i=0; i<rating; i++){
            ratingElement.push(<BsStarFill key={`star-${i}`}/>)
        }
        return ratingElement
    }

    const displayReviewDetails = reviewsData.map((data, index) => {
        return (
            <div key={`reviews-${index}`} className="review-detail">
                <div className="review-rating">
                    {displayRating(data.stars)}
                </div>
                <div className="review-info">
                    <h4>{data.user} <span>{data.date}</span></h4>
                    <h4>{data.description}</h4>
                </div>
                
            </div>
        )
    })

    return (
        reviewsData.length > 0 && <div className="host-reviews-container">
            <div className="title">
                <h1>Reviews </h1>
            </div>

            <div className="reviews-graph-container">
                {displayReviewGraph}
            </div>

            <div className="review-details-container">
                {displayReviewDetails}
            </div>

        </div>
    )
}