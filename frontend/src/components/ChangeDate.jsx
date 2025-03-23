import React, { useState } from "react";
import GenericInput from "./GenericInput";
import { ACCESS_TOKEN } from "../constants";
import GenericForm from "./GenericForm";
import api from "../api";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import handleApiError from "../utils/errorHandler.js";
import { postWithAuth } from "../utils/apiUtils";

const ChangeDate = ({ ticket, setSelectedTicket, setTickets }) => {

    const[date, setDate] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await postWithAuth("api/tickets/change-date", { id: ticket.id, due_date: date });

            if (response.status !== 201) return;

            toast.success("The due date for the ticket has been successfully updated");

            const updatedDueDate = response.data.ticket.due_date;

            setSelectedTicket((prevTicket) => ({ ...prevTicket, due_date: updatedDueDate }));

            setTickets((prevTickets) =>
                prevTickets.map((t) => (t.id === ticket.id ? { ...t, due_date: updatedDueDate } : t))
            );
        }
        
        catch (error) {
            
            if (error.response?.status === 400) {
                handleApiError(error, "Please ensure you pick a valid date that isn't in the past and isn't today's date");
            }
            else {
                handleApiError(error, "There has been an error trying to update the due date of the ticket");
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