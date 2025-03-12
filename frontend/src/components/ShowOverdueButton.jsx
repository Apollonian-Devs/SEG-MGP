import React from "react";
import ShowGenericPropertyButton from "./ShowGenericPropertyButton";

const ShowOverdueButton = ({ setTickets, allTickets }) => {
  return (
    <ShowGenericPropertyButton
      endpoint="/api/overdue-tickets/"
      buttonText="Show Overdue Tickets"
      setTickets={setTickets}
      allTickets={allTickets}
    />
  );
};

export default ShowOverdueButton;
