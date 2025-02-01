import { AppleIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"
import { Navigate } from "react-router-dom";

const NewTicketForm = ({ user }) => {

    const[title, setTitle] = useState("");
    const[description, setDescription] = useState("");
    const[attachments, setAttachments] = useState(null);
    const[loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const response = await api.post("api/tickets/", {
                title,
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
        <h1> Send Query </h1>
        <form onSubmit={handleSubmit}>
           <label>
                Title 
            </label>
                <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                ></input>
            <label>
                Description
            </label>
                <input 
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                ></input>
            <label>
                Attachments
            </label>
                <input 
                    type="file"
                    multiple
                    onChange={(e) => setAttachments(e.target.files)}
                ></input>
            <button
                type="submit"
            >Send Ticket</button>
        </form>
        
        </>
    )
}

export default NewTicketForm;