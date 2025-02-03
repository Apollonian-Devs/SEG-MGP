import React, { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const Chat = ({ ticket, onClose, user }) => {
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

  const [message_body, setMessage_body] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.post(
        `/api/tickets/${ticket.id}/messages/post/`, // Updated URL
        { message_body }, // Pass the message body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Add the new message to the current list
      //setMessages((prevMessages) => [...prevMessages, response.data]);
  
      // Clear the input field
      //setMessage_body("");
      //setError(null);
      setMessage_body("");
      alert("Your message has been sent. Please reload the page")
    } catch (err) {
      setError(err.response?.data || "Failed to send text");
    }
  };
  
  


  return (
    <div style={styles.container}>
      <div style={styles.chatApp}>
        <div style={styles.chat}>
          <div style={styles.chatHeader}>
            <h2 style={styles.chatTitle}>Chat for Ticket: {ticket.subject}</h2>
            <button onClick={onClose} style={styles.closeButton}>
              ✖
            </button>
          </div>

          {loading ? (
            <p>Loading messages...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <div style={styles.chatHistory}>
              {messages.length === 0 ? (
                <p>No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.message_id}
                    style={
                      msg.sender === user.username
                        ? styles.myMessageContainer
                        : styles.otherMessageContainer
                    }
                  >
                    <span style={styles.messageTime}>
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                    <strong>
                      {msg.sender === user.username ? "You" : msg.sender} (
                      {msg.sender_role}):
                    </strong>
                    <div
                      style={
                        msg.sender === user.username
                          ? styles.myMessage
                          : styles.otherMessage
                      }
                    >
                      {msg.body}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        <form onSubmit={handleSubmit} style={styles.chatInputContainer}>
            <input
            type="text"
            value={message_body}
            onChange={(e) => setMessage_body(e.target.value)}
            placeholder="Enter your message"
            style={styles.chatInput}
            />
            <button type="submit" style={styles.sendButton}>
            Send
            </button>
        </form>

        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f4f7f6",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    height: "100vh",
  },
  chatApp: {
    display: "flex",
    width: "90%",
    maxWidth: "800px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.1)",
    flexDirection: "column",
  },
  chatHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px",
    borderBottom: "2px solid #f4f7f6",
  },
  chatTitle: {
    margin: "0",
    fontSize: "18px",
  },
  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: "20px",
    cursor: "pointer",
  },
  chatHistory: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    borderBottom: "2px solid #fff",
  },
  messageTime: {
    fontSize: "12px",
    color: "#666",
    display: "block",
    marginBottom: "5px",
  },
  myMessageContainer: {
    textAlign: "right",
    marginBottom: "15px",
  },
  myMessage: {
    backgroundColor: "#efefef",
    padding: "10px 15px",
    borderRadius: "10px",
    display: "inline-block",
    textAlign: "left",
  },
  otherMessageContainer: {
    textAlign: "left",
    marginBottom: "15px",
  },
  otherMessage: {
    backgroundColor: "#e8f1f3",
    padding: "10px 15px",
    borderRadius: "10px",
    display: "inline-block",
  },
  chatInputContainer: {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    borderTop: "1px solid #eaeaea",
  },
  chatInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  sendButton: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};


export default Chat;