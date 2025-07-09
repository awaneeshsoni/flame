import React from "react";
import Footer from "../components/Footer";
import { useState } from "react";
import { useEffect } from "react";

export default function Contact(){
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(
        setLoading(false) 
        , 5000)
        },[])
    return(
        <div className="bg-black text-white min-h-screen py-4 px-4 flex flex-col justify-center"> 
            <div className="max-w-screen align-center flex justify-center">
                {loading && <p>Loading Form... might take a few seconds.</p>}
                <iframe className="
                    h-[80vh] w-[70vh] rounded-md
                "
                src="https://docs.google.com/forms/d/e/1FAIpQLSd87sH9W57-t9GYssbcVNvBSwLErXE9EL-qvtjHX6sz50-4YA/viewform" >

                </iframe>
            </div>
            <Footer />
        </div>
    )
}