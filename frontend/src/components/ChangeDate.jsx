import React, { useState } from "react";
import GenericInput from "./GenericInput";
import { ACCESS_TOKEN } from "../constants";
import GenericForm from "./GenericForm";
import api from "../api";

const ChangeDate = ({ ticket_id }) => {

    const[date, setDate] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const access = localStorage.getItem(ACCESS_TOKEN);

            const response = await api.post(
                "api/tickets/change-date", 
                {
                    id: ticket_id,
                    due_date: date
                },
                {
                    headers: {
                    Authorization: `Bearer ${access}`, 
                    },
                })
            if (response.status === 201) {
                alert("The due date for the ticket has been successfully updated")
            }
        }
        catch (error) {
            console.error("The reason for the error is: ", error)
            alert("There has been an error trying to update the due date of the ticket");
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
            ></GenericInput>
            </GenericForm>
        </>
    )
}

export default ChangeDate;