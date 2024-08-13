import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HostLayout from "./components/Layout/HostLayout";
import HostVanDetailLayout from "./components/Layout/HostVanDetailsLayout";
import AuthRequiredLayout from "./components/Layout/AuthRequiredLayout";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import DisplayVansInGrid from "./components/Vans/DisplayVansInGrid";
import DisplaySelectedVan from "./components/Vans/DisplaySelectedVan";
import Login from "./components/Login/Login";
import Dashboard from "./components/Host/Dashboard";
import Income from "./components/Host/Income";
import HostVans from "./components/Host/HostVans";
import EditVanDetails from "./components/Host/Vans/EditVanDetails";
import HostVanDetails from "./components/Host/Vans/HostVanDetails";
import HostVanPricing from "./components/Host/Vans/HostVanPricing";
import HostVanPhotos from "./components/Host/Vans/HostVanPhotos";
import NotFound from "./components/NotFound/NotFound";
import AddVanDetails from "./components/Host/Vans/AddVanDetails";
import Cart from "./components/Cart/Cart";
import Signup from "./components/Signup/Signup";

export default function App(){
    return (
        <BrowserRouter>
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />}></Route>
                        <Route path="about" element={<About />}></Route>
                        <Route path="vans" element={<DisplayVansInGrid />}></Route>
                        <Route path="vans/:id" element={<DisplaySelectedVan />}></Route>
                        <Route path="cart" element={<Cart />}></Route>
                        <Route path="login" element={<Login />}></Route>
                        <Route path="signup" element={<Signup />}></Route>                        
                        <Route element={<AuthRequiredLayout />}>
                            <Route path="host" element={<HostLayout />}>
                                <Route index element={<Dashboard />}></Route>
                                <Route path="income" element={<Income />}></Route>
                                <Route path="vans" element={<HostVans />}></Route>
                                <Route path="vans/addVan" element={<AddVanDetails />}></Route>
                                <Route path="vans/:id" element={<HostVanDetailLayout />}>
                                    <Route index element={<HostVanDetails />}></Route>
                                    <Route path="pricing" element={<HostVanPricing />}></Route>
                                    <Route path="photos" element={<HostVanPhotos />}></Route>
                                </Route>
                                <Route path="vans/:id/edit/:id" element={<EditVanDetails />}></Route>
                            </Route>
                        </Route>
                        <Route path="*" element={<NotFound />}></Route>
                    </Route>
                </Routes>
            </div>

        </BrowserRouter>
    )
}