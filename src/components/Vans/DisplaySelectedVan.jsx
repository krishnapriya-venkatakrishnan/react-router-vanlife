import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import "../../server"
import { getVanDetail, updateReviewDetails } from "../../api";
import Reviews from "./Reviews";
import { AuthContext } from "../Layout/Layout";

export default function DisplaySelectedVan(){

    const {user} = useContext(AuthContext)
    const params = useParams()
    const id = params.id
    
    const location = useLocation()
    
    const [vanDetail, setVanDetail] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(()=> {
        async function getData(){
            setLoading(true)
            try {
                const data = await getVanDetail(id)
                setVanDetail(data)
            }
            catch(err){
                setError(err)
            }
            finally {
                setLoading(false)
            }
        }
        getData()

    }, [id])

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

    function rentVan(vanId){
        
        let authenticated = localStorage.getItem("loggedInUser")

        if (!authenticated)
        {
            navigate("../../login", {replace: true, relative: "path", state: {redirectTo: location.pathname, message: "You must log in first!"}})
            
        }

        authenticated = JSON.parse(authenticated)

        if (authenticated.cartDetails)
            authenticated.cartDetails.push(vanDetail)
        else 
            authenticated.cartDetails = [vanDetail]
            
        localStorage.setItem("loggedInUser", JSON.stringify(authenticated))

        const btnEl = document.querySelector('.rent-btn')
        btnEl.classList.add("animate")

        btnEl.addEventListener("animationend", () => {
        btnEl.classList.remove("animate");
        }, { once: true });
    }

    const [reviewFormData, setReviewFormData] = useState({
        description: "",
        stars: 0,
        name: ""
    })

    function handleChange(event){
        const {name, value} = event.target
        setReviewFormData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    async function handleSubmit(event){
        event.preventDefault()
        try {
            const cDate = new Date()
            const rDate = `${cDate.getDate()}-${cDate.getMonth()+1}-${cDate.getFullYear()}`
            const data = await updateReviewDetails(id, rDate, reviewFormData.description, parseInt(reviewFormData.stars, 10), reviewFormData.name)
            const vData = await getVanDetail(id)
            setVanDetail(vData)
        } catch (err) {
            setError(err)
        } finally {
            setReviewFormData({
                description: "",
                stars: 0,
                name: "",
            })
        }
    }

    const displayVanDetail = () => {
        const { description, imageUrl, name, price, type, hostId, rentedBy } = vanDetail
        return (
            <>
                <div className="van-image">
                    <img src={imageUrl.url} alt={`Image of ${name}`} />
                </div>
                <div className="van-details">
                    <div className="label" style={{
                    backgroundColor: getBgColor(type)
                    }}>
                        {type}
                    </div>
                    <div className="title">
                        {name}
                    </div>
                    <div className="price">
                        <p className="price">${price}<span>/day</span></p>
                    </div>
                    <div className="description">
                        <p>{description}</p>
                    </div>
                    <button onClick={() => rentVan(id)} className="rent-btn">
                        Rent this van
                    </button>
                    
                    {
                        
                        (user && rentedBy?.length) ? 
                            rentedBy.includes(user.email) ? 
                                <>
                                <div className="title">
                                    <p>Want to rate the van?</p>
                                </div>
                                <form className="review-form">
                                    <textarea
                                    name="description"
                                    value={reviewFormData.description}
                                    onChange={handleChange}
                                    placeholder="Share your review"></textarea>
                                    <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    name="stars"
                                    value={reviewFormData.stars}
                                    onChange={handleChange}
                                    />
                                    <input
                                    type="text"
                                    name="name"
                                    value={reviewFormData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your sign"
                                    />
                                    <button onClick={handleSubmit}>Post review</button>
                                </form>
                                </>
                                : null
                        : null
                    }
                    
                </div>
            </>
        )
    }
    const search = location.state?.stateSearch || ""

    const searchValue = location.state?.type || "all"

    if (loading)
        return (
        <div className="van-details-container">
            <h1 aria-live="polite">Loading...</h1>
        </div>
        )

    if (error){
        return (
        <div className="van-details-container">
            <h1 aria-live="assertive">An error was returned: {error.message}</h1>
        </div>)
    }

    return (
        <div className="van-details-container">
            <Link className="link-van-details" to = {`..?${search}`} relative="path">
                <IoArrowBack />
                {`Back to ${searchValue} vans`}
            </Link>
            <div className="details-container">
                {vanDetail.price && displayVanDetail()}
            </div>
            <div>
                {vanDetail?.reviews && <Reviews vanId={id} />}
            </div>
        </div>
    )
}