import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deletePhotoFromStorage, getVanDetail, updatePhotos, updateProfilePhoto, updateSingleValueData, getVans } from "../../../api";


export default function EditVanDetails({addVan}){

    const [params, setParams] = useState(useParams())
    const [vanData, setVanData] = useState(null)
    const [reload, setReload] = useState(false)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "",
        price: "",
        visibility: "",
        imageUrl: {
            name: "",
            url: ""
            },
        photos: []
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");
    const [singleValueDataUpdated, setSingleValueDataUpdated] = useState(false)
    const [profilePicUpdated, setProfilePicUpdated] = useState(false)
    const [vanPhotosUpdated, setVanPhotosUpdated] = useState(false)
    
    useEffect(()=> {
        
        if (addVan){
            async function getVansData(){
                const allVans = await getVans()
                setParams({id: (allVans.length+1).toString()})
            }

            getVansData()
        }
        
        async function getData(){
            setLoading(true)
            try {
                const data = await getVanDetail(params.id)
                setVanData(data)
                
            }
            catch(err){
                setError(err)
            }
            finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    useEffect(() => {
        if (vanData){
            setFormData(prev => ({
                ...prev,
                name: vanData.name,
                description: vanData.description,
                type: vanData.type,
                price: vanData.price,
                visibility: vanData.visibility,
                imageUrl: {
                    name: vanData.imageUrl.name,
                    url: vanData.imageUrl.url,
                },
                photos: vanData.photos || []
            }))
        }
    }, [vanData])
    

    function handleChange(event){
        const {name, value, files, type} = event.target
        if (type === "file" && name=== "photos") {
            setFormData(prev => ({
                ...prev,
                [name]: [...prev.photos, ...files]
            }));
            setVanPhotosUpdated(true)
        } else if (type==="file"){
            setFormData(prev => ({
                ...prev,
                [name]: {...files}
            }));
            setProfilePicUpdated(true)
        } else {
            
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
            setSingleValueDataUpdated(true)
        }
    }

    async function handleSubmit(event){
        event.preventDefault();
        
        try {
            if (singleValueDataUpdated){
                const {name, price, visibility, description, type} = formData
                await updateSingleValueData(params.id, name, price, type, visibility, description, addVan)

            }

            if (profilePicUpdated) {
                const {imageUrl} = formData
                await updateProfilePhoto(params.id, imageUrl[0] || imageUrl)
            }

            if (vanPhotosUpdated){
                const {photos} = formData
                await updatePhotos(params.id, photos)
            }

            console.log("Document successfully updated!");
        } catch (error) {
            console.error("Error updating document: ", error);
        } finally {

            navigate("../..", {replace: true, relative: "path", state: {updatedData: formData}})
        }


    }

    async function deletePhoto(name){
        setReload(true)
        try {
            const data = await deletePhotoFromStorage(params.id, name, formData)
            setFormData(prev => {
                return {
                    ...prev,
                    photos: data.photos
                }
            })
            console.log("Document successfully updated!");
        } catch (error) {
            console.error("Error updating document: ", error);
        } finally {
            setReload(false)
        }
    }

    const displayPhotoLinks = formData?.photos?.map((item, index) => {
        return (
            <div className="photo-container">
                <a href={item.url} target="blank" key={index}>{item.name}</a>
                <p onClick={()=> {deletePhoto(item.name)}}>Delete</p>
            </div>
        )

    })

    return (
        <div className="edit-van-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    required />
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                    name="description"
                    value={formData?.description}
                    onChange={handleChange}
                    required></textarea>
                </div>

                <div>
                    <label>Type</label>
                    <input type="text"
                    name="type"
                    value={formData?.type}
                    onChange={handleChange} />
                </div>

                <div>
                    <label>Price in $</label>
                    <input type="number"
                    name="price"
                    value={formData?.price}
                    onChange={handleChange}
                    required />
                </div>

                <div>
                    <label>Visibility</label>
                    <input type="text"
                    name="visibility"
                    value={formData?.visibility}
                    onChange={handleChange} />
                </div>

                <div>
                    <label>Van profile photo</label>
                    <input type="file"
                    name="imageUrl"
                    onChange={handleChange}
                    />
                    <br />
                </div>

                <div>
                    <label>Photos</label>
                    <input type="file"
                    name="photos"
                    onChange={handleChange} />
                    <br />
                </div>
                <div className="photo-links">
                    {displayPhotoLinks}
                </div>
                
                <button>Done editing!</button>
                
            </form>
        </div>
    )
}