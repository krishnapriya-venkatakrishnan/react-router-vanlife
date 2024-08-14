import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { updateTransactionDetails } from "../../api";

export default function Cart(){

    const [cartData, setCartData] = useState(null)
    const [hasPaid, setHasPaid] = useState(false)
    
    useEffect(() => {
        
        let storageData = JSON.parse(localStorage.getItem("loggedInUser"))
        let cartDetails = storageData?.cartDetails
    
        let idArray = [], imageArray = [],  priceArray = [], qtyArray = [], nameArray = [], indPriceArray = [], hostIDArray = []
        cartDetails?.forEach(data => {
            if (!idArray.includes(data.id)){
                idArray.push(data.id)
                imageArray.push(data.imageUrl.url)
                priceArray.push(data.price)
                qtyArray.push(1)
                nameArray.push(data.name)
                indPriceArray.push(data.price)
                hostIDArray.push(data.hostId)
            } else {
                const index = parseInt(idArray.findIndex((vanId) => {
                    if (vanId === data.id) {
                        return true
                    }
                }), 10)
                qtyArray[index] += 1
                priceArray[index] = qtyArray[index] * data.price
            }
        })

        setCartData({
            id: idArray,
            image: imageArray,
            price: priceArray,
            qty: qtyArray,
            name: nameArray,
            indPrice: indPriceArray,
            hostId: hostIDArray,
        })
        

    }, [])

    function increment(id){
        setCartData(prev => {
            let tempData = {
                id: [],
                image: [],
                price: [],
                qty: [],
                name: [],
                indPrice: [],
                hostId: [],
            }
            for(let i=0; i<prev.id.length; i++){
                let numOfQty
                if (prev.id[i] === id){
                    numOfQty = prev.qty[i] + 1
                } else {
                    numOfQty = prev.qty[i]
                }
                tempData.qty.push(numOfQty)
                tempData.id.push(prev.id[i])
                tempData.image.push(prev.image[i])
                tempData.price.push(numOfQty * prev.indPrice[i])
                tempData.name.push(prev.name[i])
                tempData.indPrice.push(prev.indPrice[i])
                tempData.hostId.push(prev.hostId[i])
            }
            return tempData
        })
    }

    function decrement(id){
        setCartData(prev => {
            let tempData = {
                id: [],
                image: [],
                price: [],
                qty: [],
                name: [],
                indPrice: [],
                hostId: [],
            }
            for(let i=0; i<prev.id.length; i++){
                let numOfQty
                if (prev.id[i] === id){
                    numOfQty = prev.qty[i] - 1
                } else {
                    numOfQty = prev.qty[i]
                }
                if (numOfQty === 0)
                    continue

                tempData.qty.push(numOfQty)
                tempData.id.push(prev.id[i])
                tempData.image.push(prev.image[i])
                tempData.price.push(numOfQty * prev.indPrice[i])
                tempData.name.push(prev.name[i])
                tempData.indPrice.push(prev.indPrice[i])
                tempData.hostId.push(prev.hostId[i])
            }
            return tempData
        })
    }


    async function updateDetails(){
        
        try {
            const {hostId, price, id} = cartData
            for(let i=0; i<hostId.length; i++){
                const cDate = new Date()
                const txnDate = `${cDate.getDate()}-${cDate.getMonth()+1}-${cDate.getFullYear()}`
                const data = await updateTransactionDetails(hostId[i], id[i], price[i], txnDate)
            }
        } catch (err){
            console.log(err)
        } finally {
            setCartData(null)
            window.location.reload()
        }
    }

    function pay(){
        setHasPaid(true)
        let storageData = JSON.parse(localStorage.getItem("loggedInUser"))
        storageData.cartDetails = []
        localStorage.setItem("loggedInUser", JSON.stringify(storageData))
        
        updateDetails()
        
    }

    const displayCartDetails = cartData?.id.map((data, index) => {
        return (
            <tr key={`cart-${index}`}>
                <td className="cart-item-name">
                    <img src={cartData.image[index]} alt="Image" />
                    {cartData.name[index]}
                </td>
                <td className="cart-item-qty">
                    <FiPlusCircle
                    onClick={() => increment(data)}
                    className="plus" />
                    {cartData.qty[index]}
                    <FiMinusCircle
                    onClick={() => decrement(data)}
                    className="minus"/>
                </td>
                <td className="cart-item-price">{`$ ${cartData.price[index]}`}</td>
            </tr>
        )
    })
    
    function calculateTotal(arr) {
        if (arr?.length)
            return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }
    
    const total = calculateTotal(cartData?.price)
    if (cartData?.price.length > 0 && !total) {
        let storageData = JSON.parse(localStorage.getItem("loggedInUser"))
        storageData.cartDetails = []
        localStorage.setItem("loggedInUser", JSON.stringify(storageData))
    }
    
    return (    
            
        cartData?.id.length ? 
            <div className="cart-container">
                <h1>Cart details</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Number of vans</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayCartDetails}
                    </tbody>
                </table>
                <button onClick={() => pay()} className="pay-btn">
                    {hasPaid ? "Paid" : `Pay $${total}`}
                </button>
            </div> : 
            hasPaid ?
            <div className="cart-container">
                <h1>Paid!!!</h1>
            </div> : 
            <div className="cart-container">
                <h1>Cart is empty!!!</h1>
            </div>
    )
}