import { AppleIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"
import { Navigate } from "react-router-dom";
import GenericForm from "./GenericForm";
import GenericButton from "./GenericButton";
import GenericInput from "./GenericInput";

const NewTicketForm = () => {

    const[subject, setSubject] = useState("");
    const[description, setDescription] = useState("");
    const[message, setMessage] = useState("");
    const[attachments, setAttachments] = useState(null);
    const[loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleFileChange = (e) => {
        const files = e.target.files;
    
        // Generate metadata for the selected files
        const fileMetadata = Array.from(files).map((file) => ({
            file_name: file.name,
            file_path: `https://your-storage-service.com/uploads/${file.name}`, // Assuming a pre-uploaded location
            mime_type: file.type,
        }));
    
        setAttachments(fileMetadata);
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            // Prepare the payload, including the file metadata
            const payload = {
                subject,
                description,
                message,
                attachments, // Metadata generated in handleFileChange
            };
    
            // Send the ticket data to the backend
            const response = await api.post("api/tickets/", payload);
    
            if (response.status === 201) {
                alert("Your ticket has been sent and will be reviewed as soon as possible.");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error submitting ticket:", error);
            alert("Sorry, there was an error trying to send this ticket.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <>
        <h1 className='text-left font-poppins mb-10'> Send Query </h1>
        <GenericForm className='space-y-3' onSubmit={handleSubmit} buttonLabel="Send Ticket">
            {/* <label className='flex text-sm text-left font-medium text-black'>
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
            </div> */}

            <GenericInput 
                label="Subject" 
                type="text" 
                required={true} 
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter the subject of your query"
            ></GenericInput>

            {/* <label className='flex text-sm text-left font-medium text-black'>
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
            </div> */}

            <GenericInput 
                label="Description" 
                type="text" 
                required={true} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the description of your query"
            ></GenericInput>

            {/* <label className='flex text-sm text-left font-medium text-black'>
                Message
            </label>
            <div className="mt-2">
                <input 
                    type="text"
                    required
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message to the team"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm"
                ></input>
            </div> */}

            <GenericInput 
                label="Message" 
                type="text" 
                required={true} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message to the team"
            ></GenericInput>

            {/* <label className='flex text-sm text-left font-medium text-black'>
                Attachments
            </label>
            <div className="mt-2">
                <input 
                    type="file"
                    multiple
                    onChange={(e) => setAttachments(e.target.files)}
                ></input>
            </div> */}

            <GenericInput
                label="Attachments"
                type="file"
                multiple={true}
                onChange={handleFileChange}
            />


            {/* <GenericButton
                type="submit"
                className='flex w-full justify-center rounded-md bg-customOrange-dark mt-5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-customOrange-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customOrange-dark'
            >
                Send Ticket
            </GenericButton> */}
        </GenericForm>
        
        </>
    )
}

export default NewTicketForm;