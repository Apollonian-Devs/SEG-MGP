import React, { useState } from "react";
import GenericInput from "./GenericInput";
import { ACCESS_TOKEN } from "../constants";
import GenericForm from "./GenericForm";
import api from "../api";
import { Navigate, useNavigate } from "react-router-dom";

const ChangeDate = ({ ticket, setSelectedTicket, setTickets }) => {

    const[date, setDate] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const access = localStorage.getItem(ACCESS_TOKEN);

            const response = await api.post(
                "api/tickets/change-date", 
                {
                    id: ticket.id,
                    due_date: date
                },
                {
                    headers: {
                    Authorization: `Bearer ${access}`, 
                    },
                })
            if (response.status === 201) {
                alert("The due date for the ticket has been successfully updated")
                console.log(`updated ticket: ${response.data.ticket.id}`);
                console.log(`updated subject: ${response.data.ticket.subject}`);
                console.log(`updated due date: ${response.data.ticket.due_date}`);

                setSelectedTicket(prevTicket => ({
                    ...prevTicket,
                    due_date: response.data.ticket.due_date
                }));
    
                setTickets(prevTickets => 
                    prevTickets.map(t => 
                        t.id === ticket.id ? { ...t, due_date: response.data.ticket.due_date } : t
                    )
                );
            }
        }
        catch (error) {
            console.error("The reason for the error is: ", error)
            if (error.response?.status === 400) {
                alert("Please ensure you pick a valid date that isn't in the past and isn't today's date")
            }
            else {
                alert("There has been an error trying to update the due date of the ticket");
            }
        }
    }

    return (
        <>
            <GenericForm onSubmit={handleSubmit} buttonLabel="Confirm Change">
            <GenericInput
                id="change-date"
                label="Change Date"
                labelClass="flex text-lg font-poppins text-black"
                type="date"
                required={true}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Enter the new date"
            ></GenericInput>
            </GenericForm>
        </>
    )
}

export default ChangeDate;