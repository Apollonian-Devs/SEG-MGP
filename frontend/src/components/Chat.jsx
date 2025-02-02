import React, { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const Chat = ({ ticket, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages for the given ticket
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const access = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get(`/api/tickets/${ticket.id}/messages/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        setMessages(response.data.messages);
      } catch (error) {
        setError(error.response?.data || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [ticket.id]);

  return (
    <div className="chat-modal">
      <div className="chat-header">
        <h2>Chat for Ticket: {ticket.subject}</h2>
        <button onClick={onClose} className="close-button">✖</button>
      </div>

      {loading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="chat-history">
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.message_id} className={`message ${msg.sender_role.toLowerCase()}`}>
                <strong>{msg.sender} ({msg.sender_role}):</strong>
                <p>{msg.body}</p>
                <small>{new Date(msg.created_at).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
