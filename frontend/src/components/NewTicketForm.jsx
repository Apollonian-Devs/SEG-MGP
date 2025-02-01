import { AppleIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import api from "../api"

const NewTicketForm = ({ user }) => {

    const[title, setTitle] = useState("");
    const[description, setDescription] = useState("");
    const[attachments, setAttachments] = useState(null);

    const handleSubmit = async (e) => {
        // setLoading(true);
        e.preventDefault();

        try {
            const response = await api.post("api/tickets/", {
                title,
                description,
                attachments,
                user
            })

            if (response.status === 201) {
                alert("Your ticket has been sent and will be reviewed as soon as possible.")
            }
        }
        catch (error) {
            alert("Sorry, there was an error trying to send this ticket.")
            console.log(error)
        }
    }


    return (
        <>
        <h1> Send Query {user.username} </h1>
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