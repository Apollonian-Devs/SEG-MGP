import React from "react";
import ShowGenericPropertyButton from "./ShowGenericPropertyButton";

const ShowUnansweredButton = ({ setTickets, allTickets }) => {
  return (
    <ShowGenericPropertyButton
      endpoint="/api/unanswered-tickets/"
      buttonText="Show Unanswered Tickets"
      setTickets={setTickets}
      allTickets={allTickets}
    />
  );
};

export default ShowUnansweredButton;
