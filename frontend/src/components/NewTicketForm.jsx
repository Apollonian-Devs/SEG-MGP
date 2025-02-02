import { AppleIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"
import { Navigate } from "react-router-dom";
import "../forms.css"

const NewTicketForm = () => {

    const[subject, setSubject] = useState("");
    const[description, setDescription] = useState("");
    const[attachments, setAttachments] = useState(null);
    const[loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const response = await api.post("api/tickets/", {
                subject,
                description,
                attachments
            })

            if (response.status === 201) {
                alert("Your ticket has been sent and will be reviewed as soon as possible.")
                navigate("/")
            }
        }
        catch (error) {
            alert("Sorry, there was an error trying to send this ticket.")
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <>
        <h1 className='text-left mb-10'> Send Query </h1>
        <form className='space-y-3' onSubmit={handleSubmit}>
            <label className='flex text-sm text-left font-medium text-black'>
                Subject 
            </label>
            <div className="mt-2">
                <input
                    type="text"
                    required
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter the subject of your query"
                    className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm'
                ></input>
            </div>
            <label className='flex text-sm text-left font-medium text-black'>
                Description
            </label>
            <div className="mt-2">
                <input 
                    type="text"
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter the details of your query"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm"
                ></input>
            </div>
            <label className='flex text-sm text-left font-medium text-black'>
                Attachments
            </label>
            <div className="mt-2">
                <input 
                    type="file"
                    multiple
                    onChange={(e) => setAttachments(e.target.files)}
                ></input>
            </div>
            <button
                type="submit"
                className='flex w-full justify-center rounded-md bg-customOrange-dark mt-5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-customOrange-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customOrange-dark'
            >Send Ticket</button>
        </form>
        
        </>
    )
}

export default NewTicketForm;