import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("lightMode") === "false" ? false : true;
  });

  // Save mode and apply background dynamically
  useEffect(() => {
    localStorage.setItem("lightMode", lightMode);
    document.documentElement.classList.toggle("dark", !lightMode);

    if (lightMode) {
      document.documentElement.style.background =
        "linear-gradient(to right, #ecbc76 50%, #fffef9 50%)";
      document.body.style.background =
        "linear-gradient(to right, #ecbc76 50%, #fffef9 50%)";
    } else {
      document.documentElement.style.background = "black";
      document.body.style.background = "black";
    }
  }, [lightMode]);

  // Full-screen background
  const bodyStyle = {
    background: lightMode
      ? "linear-gradient(to right, #ecbc76 50%, #fffef9 50%)" // Light mode gradient
      : "black", // Dark mode solid black
    minHeight: "100vh",
    width: "100vw",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 0.5s ease-in-out",
  };

  return (
    <div style={isHomePage ? { background: lightMode ? "#ecbc76" : "black" } : bodyStyle}>
      {children}
    </div>
  );
};

export default Layout;
