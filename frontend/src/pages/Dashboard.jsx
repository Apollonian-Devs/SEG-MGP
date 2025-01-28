import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";

const Dashboard = () => {
  const [current_user, setCurrent_user] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const access = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get("/api/current_user/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      console.log("Current User:", response.data);
      setCurrent_user({
        id: response.data.id,
        username: response.data.username,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        is_staff: response.data.is_staff,
        is_superuser: response.data.is_superuser,
      });
    } catch (error) {
      console.error("Error fetching current user:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div>
      <h1>Current User Details</h1>
      <p>
        <strong>ID:</strong> {current_user.id}
      </p>
      <p>
        <strong>Username:</strong> {current_user.username}
      </p>
      <p>
        <strong>First Name:</strong> {current_user.first_name}
      </p>
      <p>
        <strong>Last Name:</strong> {current_user.last_name}
      </p>
      <p>
        <strong>Email:</strong> {current_user.email}
      </p>
      <p>
        <strong>Is Staff:</strong> {current_user.is_staff ? "Yes" : "No"}
      </p>
      <p>
        <strong>Is Superuser:</strong> {current_user.is_superuser ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default Dashboard;
