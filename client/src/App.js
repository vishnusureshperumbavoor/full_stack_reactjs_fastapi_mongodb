import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import UsersTable from "./Components/UsersTable";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/addUsers/",
        formData
      );
      console.log(response.data);
      setFormData({
        username: "",
        email: "",
        password: "",
      });

      const updatedUsersResponse = await axios.get(
        "http://localhost:8000/getUsers/"
      );
      setUsers(updatedUsersResponse.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getUsers/");
        const parsedUsers = JSON.parse(response.data); // parse json string to json data
        setUsers(parsedUsers);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUsers();
  }, []);
  return (
    <div className="App">
      <div>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <UsersTable users={users} />
    </div>
  );
}

export default App;
