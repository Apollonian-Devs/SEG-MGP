import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import GenericButton from "./GenericButton";
import { handleFileChange } from "../utils/attachmentUtils";
import { toast } from 'sonner';
import { getWithAuth } from "../utils/apiUtils";
import { postWithAuth } from "../utils/apiUtils";

const Chat = ({ ticket, onClose, user , fetchTickets}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attachments, setAttachments] = useState([]);

  // Fetch messages for the given ticket
  const fetchMessages = async () => {
    try {
      const response = await getWithAuth(`/api/tickets/${ticket.id}/messages/`);
      setMessages(response.data.messages);
    } catch (error) {
      setError(error.response?.data || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [ticket.id]);

  const [message_body, setMessage_body] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {   
        message_body,   
        attachments: attachments.length > 0 ? attachments : [] 
    };
    const response = await postWithAuth(`/api/tickets/${ticket.id}/messages/post/`, payload);

      fetchMessages();
      setMessage_body("");
      setAttachments([]);
      toast.success("Your message has been sent");
      await fetchTickets();
      
    } catch (err) {
      console.error("Full error object:", err);
      setError(err.response?.data || "Failed to send text");
      toast.error(`Failed to send message: ${err.response?.data?.detail || err.message}`);
    }
  };
  
  


  return (
    <div style={styles.container}>
      <div style={styles.chatApp}>
        <div style={styles.chat}>
          <div style={styles.chatHeader}>
            <h2 style={styles.chatTitle}>Chat for Ticket: {ticket.subject}</h2>
            <GenericButton 
              onClick={onClose} 
              style={styles.closeButton} // Pass inline styles here
            >
              ✖
            </GenericButton>

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
                      {msg.attachments && msg.attachments.length > 0 && (
                      <div>
                        {msg.attachments.map((attachment) => (
                          <a key={attachment.file_name} href={attachment.file_path} target="_blank" rel="noopener noreferrer">
                            {attachment.file_name}
                          </a>
                        ))}
                      </div>
                    )}

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
            required={true}
            />
            <input
            type="file"
            multiple={true}
            onChange={(e) => handleFileChange(e, setAttachments)}
            placeholder="Optionally attach relevant files"
            style={styles.chatInput}
            />
            <GenericButton 
              type="submit" 
              style={styles.sendButton} // Pass inline styles here

            >
            Send
          </GenericButton>

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
    alignItems: "center",
    height: "100vh", 
    overflow: "hidden", 
  },
  
  chatApp: {
    display: "flex",
    width: "90%",
    maxWidth: "800px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.1)",
    flexDirection: "column",
    overflow: "hidden", 
    maxHeight: "80vh", 
  },
  
  chatHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px",
    borderBottom: "2px solid #f4f7f6",
    backgroundColor: "#f4f4f4", 
    zIndex: 1, 
    position: "sticky", 
    top: 0, 
  },
  
  
  chatTitle: {
    margin: "0",
    fontSize: "18px",
    color: "#333", 
    fontWeight: "bold", 
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
    maxHeight: "calc(80vh - 100px)", 
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