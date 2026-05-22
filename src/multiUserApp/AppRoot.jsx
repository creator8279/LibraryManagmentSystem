import React, { useState, useEffect } from "react";
import LoginRegister from "./LoginRegister";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

const AppRoot = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  if (!currentUser) return <LoginRegister onLogin={handleLogin} />;
  if (currentUser.role === "student") {
    return <StudentDashboard user={currentUser} onLogout={handleLogout} />;
  } else {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  }
};

export default AppRoot;
