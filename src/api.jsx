import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, getDoc, updateDoc, query, where, setDoc, deleteDoc } from "firebase/firestore/lite";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import firebaseConfig from "./env.js"

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app)
const vansCollectionRef = collection(db, "vans")


export async function getVans() {
    const snapshot = await getDocs(vansCollectionRef)
    const vans = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }))
    return vans
}

export async function getVanDetail(id){
    
    const docRef = doc(db, "vans", id)
    const snapshot = await getDoc(docRef)
    
    return {
        ...snapshot.data(),
        id: snapshot.id
    }
    
}

export async function getHostVans() {
    
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))?.email

    const q = query(vansCollectionRef, where("hostId", "==", loggedInUser))

    const snapshot = await getDocs(q)
    const vans = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }))
    return vans
    
}

export async function getHostVanDetail(id){

    const docRef = doc(db, "vans", id)
    const snapshot = await getDoc(docRef)
    
    return {
        ...snapshot.data(),
        id: snapshot.id
    }

}

export async function getHostDetails(id){
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))?.email

    const docRef = doc(db, "hosts", loggedInUser)
    const snapshot = await getDoc(docRef)
    
    return {
        ...snapshot.data(),
        id: snapshot.id
    }
}

export async function updateSingleValueData( vanId, name, price, type, visibility, description, addVan){
    try {
        if (addVan){
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))?.email
            await setDoc(doc(db, "vans", vanId.toString()), {
                hostId: loggedInUser,
                name: name,
                price: parseInt(price, 10),
                visibility: visibility,
                description: description,
                type: type
            });            
        } else {
            const docRef = doc(db, "vans", vanId);
            await updateDoc(docRef, {
                name: name,
                price: parseInt(price, 10),
                visibility: visibility,
                description: description,
                type: type
            });
        }
        console.log("value updated")
    } catch (error) {
        console.error("Error updating van document:", error);
    }
    return "updated"
}

export async function updateProfilePhoto( vanId, imageUrl){
    let profileUrl = {};
    const folderprofileRef = ref(storage, `${vanId}/profile`);
    try {
        // List all files in the folder
        const listResult = await listAll(folderprofileRef);

        // Iterate through each file and delete it
        for (const itemRef of listResult.items) {
            await deleteObject(itemRef);
            console.log(`Deleted ${itemRef.fullPath}`);
        }

        console.log(`All files in folder ${vanId}/profile have been deleted.`);

    } catch (error) {
        console.error("Error deleting files:", error);
    }

    try {
        imageUrl.url = ""
        const profileStorageRef = ref(storage, `${vanId}/profile/${imageUrl.name}`);
        const profileMetadata = {
            contentType: `image/${imageUrl.name.split('.').pop()}` // e.g., image/jpeg or image/png
        };
        await uploadBytes(profileStorageRef, imageUrl, profileMetadata);
        const profileUrlLink = await getDownloadURL(profileStorageRef);

        profileUrl = {
            url: profileUrlLink,
            name: imageUrl.name
        };
        
    } catch (error) {
        console.error("Error uploading profile photo:", error);
    }

    try {
        const docRef = doc(db, "vans", vanId);
        await updateDoc(docRef, {
            imageUrl: profileUrl
        });
        console.log("value updated")
    } catch (error) {
        console.error("Error updating van document:", error);
    }
    return "updated"
}

export async function updatePhotos( vanId, photos){
    // Update all the photos
    const updatedPhotos = [];

    for (const photo of photos) {
        if (photo.url){
            continue
        }

        try {
            const photoStorageRef = ref(storage, `${vanId}/photos/${photo.name}`);
            const photoMetadata = {
                contentType: `image/${photo.name.split('.').pop()}` // e.g., image/jpeg or image/png
            };

            // Upload the new photo
            await uploadBytes(photoStorageRef, photo, photoMetadata);
            const photoUrlLink = await getDownloadURL(photoStorageRef);

            updatedPhotos.push({
                url: photoUrlLink,
                name: photo.name
            });
        } catch (error) {
            console.error("Error uploading photo:", error);
        }
    }

    
    try {
        const docRef = doc(db, "vans", vanId);
        const docSnap = await getDoc(docRef);
        const existingData = docSnap.exists() ? docSnap.data() : {};
        const mergedPhotos = [...(existingData.photos || []), ...updatedPhotos];
        await updateDoc(docRef, {photos: mergedPhotos});
    } catch (error) {
        console.error("Error updating van document:", error);
    }
    return "updated"
}

export async function deletePhotoFromStorage(vanId, name, formData){

    const updatedPhotos = [];

    for (const photo of formData.photos) {
        const storageRef = ref(storage, `${vanId}/photos/${photo.name}`);
        if (photo.name === name){
            await deleteObject(storageRef);
        } else {
            updatedPhotos.push({
                url: photo.url,
                name: photo.name
            });
        }

    }

    const updatedVanData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        price: parseInt(formData.price, 10),
        visibility: formData.visibility,
        imageUrl: formData.imageUrl,
        photos: updatedPhotos || []
    };
        
    const docRef = doc(db, "vans", vanId);
    await updateDoc(docRef, updatedVanData);     

    return updatedVanData
}

export async function deleteVanDetails(vanId){
    try {
        await deleteDoc(doc(db, "vans", vanId));
        console.log("Document successfully deleted!");
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
    
    const photosFolderRef = ref(storage, `${vanId}/photos`);

    try {
        // List all items (files) in the folder
        const listResponse = await listAll(photosFolderRef);
        
        // Create an array of delete promises
        const deletePromises = listResponse.items.map((itemRef) => deleteObject(itemRef));

        // Wait for all delete promises to complete
        await Promise.all(deletePromises);

        console.log('Folder and all its contents have been deleted successfully.');
    } catch (error) {
        console.error('Error deleting folder contents:', error);
    }

    const profileFolderRef = ref(storage, `${vanId}/profile`);

    try {
        // List all items (files) in the folder
        const listResponse = await listAll(profileFolderRef);
        
        // Create an array of delete promises
        const deletePromises = listResponse.items.map((itemRef) => deleteObject(itemRef));

        // Wait for all delete promises to complete
        await Promise.all(deletePromises);

        console.log('Folder and all its contents have been deleted successfully.');
    } catch (error) {
        console.error('Error deleting folder contents:', error);
    }

    return "deleted"
}

export async function loginUser(creds) {
    
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))?.id

    const docRef = doc(db, "users", creds.email)
    const snapshot = await getDoc(docRef)
    
    const user = {
        ...snapshot.data(),
        id: snapshot.id
    }
    
    if(user.email === creds.email && user.password === creds.password)
        return user
    else {
        throw {
            message: "No user with those credentials found!",
            statusText: {},
            status: "401"
        }
    }
    

}

export async function updateUserData( formData){
    try {
        await setDoc(doc(db, "users", formData.email.toString()), {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });  
        
        await setDoc(doc(db, "hosts", formData.email.toString()), {})
        console.log("value updated")
    } catch (error) {
        console.error("Error updating van document:", error);
    }
    return "updated"
}

export async function updateTransactionDetails(hostId, vanId, price, txnDate){
    const docRef = doc(db, "hosts", hostId)
    const snapshot = await getDoc(docRef)
    
    const userData = {
        ...snapshot.data(),
        id: snapshot.id
    }
    
    let month = parseInt(txnDate.split('-')[1], 10) - 1
    let year = txnDate.split('-')[2]
    
    if (userData.txnDetails){
        let updated = false
        userData.currentMonthTxnAmount += parseInt(price, 10)
        userData.totalTxnAmount += parseInt(price, 10)
        userData.monthlyTxnAmount.forEach(data => {
            if (data.year === year){
                updated = true
                data.month[month] += price
            }
        })
        if (!updated){
            userData.monthlyTxnAmount.push(
                {
                    month: Array(12).fill(0),
                    year: year,
                }
            )
            userData.monthlyTxnAmount[userData.monthlyTxnAmount.length-1].month[month] = price
        }
        userData.txnDetails.push(
            {
                txnAmount: parseInt(price, 10),
                txnDate: txnDate,
            }
        )
    } else {
        userData.currentMonthTxnAmount = price
        userData.monthlyTxnAmount = [
            {
                month: Array(12).fill(0),
                year: year,
            }
        ]
        userData.monthlyTxnAmount[0].month[month] = price
        userData.ratings = ""
        userData.totalTxnAmount = parseInt(price, 10)
        userData.txnDetails = [
            {
                txnAmount: parseInt(price, 10),
                txnDate: txnDate,
            }
        ]
    }

    
    // update the userData in the firestore
    try {
        await setDoc(doc(db, "hosts", hostId), userData);            
        console.log("value updated")
    } catch (error) {
        console.error("Error updating host document:", error);
    }

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))?.email
    // the host himself can't give review
    if (loggedInUser === hostId)
        return

    // update rented by in vanID
    const vanDocRef = doc(db, "vans", vanId)
    const vanSnapshot = await getDoc(vanDocRef)
    
    const vanData = {
        ...vanSnapshot.data(),
        id: vanSnapshot.id
    }
    
    if (vanData.rentedBy){
        if (!vanData.rentedBy.includes(loggedInUser))
            vanData.rentedBy.push(loggedInUser)
    } else {
        vanData.rentedBy = [loggedInUser]
    }
    
    // update the vanData in the firestore
    try {
        await setDoc(doc(db, "vans", vanId), vanData);            
        console.log("value updated")
    } catch (error) {
        console.error("Error updating van document:", error);
    }

}

export async function updateReviewDetails(vanId, rDate, review, stars, name){
    
    const docRef = doc(db, "vans", vanId)
    const snapshot = await getDoc(docRef)
    
    const vanData = {
        ...snapshot.data(),
        id: snapshot.id
    }

    if (vanData.reviews?.length > 0) {
        vanData.reviews.push({
            date: rDate,
            description: review,
            stars: stars,
            user: name
        })
    } else {
        vanData.reviews = [{
            date: rDate,
            description: review,
            stars: stars,
            user: name
        }]
    }

    // update the vanData in the firestore
    try {
        await setDoc(doc(db, "vans", vanId), vanData);            
        console.log("value updated")
    } catch (error) {
        console.error("Error updating van document:", error);
    }
}