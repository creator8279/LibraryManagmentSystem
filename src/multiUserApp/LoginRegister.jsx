import React, { useState } from "react";

const LoginRegister = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const USERS_KEY = "myAppUsers";

  const getUsers = () => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  };

  const setUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const users = getUsers();

    if (isLogin) {
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        onLogin(user);
      } else {
        setError("Invalid username or password");
      }
    } else {
      if (!username || !password) {
        setError("Please fill all fields");
        return;
      }
      if (users.find((u) => u.username === username)) {
        setError("Username already exists");
        return;
      }
      const newUser = {
        id: Date.now(),
        username,
        password,
        role,
        students: [],
      };
      users.push(newUser);
      setUsers(users);
      onLogin(newUser);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-10 mt-6">
      <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-8">
        {isLogin ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-purple-300 rounded p-3 focus:outline-none focus:ring focus:ring-purple-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-purple-300 rounded p-3 focus:outline-none focus:ring focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div>
            <select
              className="w-full border border-purple-300 rounded p-3 focus:outline-none focus:ring focus:ring-purple-400"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
        {error && (
          <div className="text-red-600 font-semibold text-center">{error}</div>
        )}
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-extrabold rounded-lg p-3 hover:from-purple-700 hover:to-blue-700 transition duration-200">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "New user? " : "Already have an account? "}
        <button
          className="text-purple-700 font-semibold hover:underline"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default LoginRegister;
