import { AppleIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"
import GenericForm from "./GenericForm";
import GenericInput from "./GenericInput";

const NewTicketForm = () => {

    const[subject, setSubject] = useState("");
    const[description, setDescription] = useState("");
    const[message, setMessage] = useState("");
    const[attachments, setAttachments] = useState([]);
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
            
            <GenericInput 
                id="subject"
                label="Subject" 
                type="text" 
                required={true} 
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter the subject of your query"
            ></GenericInput>

            <GenericInput 
                id="description"
                label="Description" 
                type="text" 
                required={true} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the description of your query"
            ></GenericInput>

            <GenericInput 
                id="message"
                label="Message" 
                type="text" 
                required={true} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message to the team"
            ></GenericInput>

            <GenericInput
                id="attachments"
                label="Attachments"
                type="file"
                multiple={true}
                onChange={handleFileChange}
                placeholder="Optionally attach relevant files"
            />
        </GenericForm>
        </>
    )
}

export default NewTicketForm;