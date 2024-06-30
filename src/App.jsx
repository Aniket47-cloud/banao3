import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Loader from "../Loader";
const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState(null);

  useEffect(() => {
    axios
      .get("https://602e7c2c4410730017c50b9d.mockapi.io/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("No data to show");
        setLoading(false);
      });
  }, []);

  const handleClearSelection = () => {
    setSelectedUser(null);
  };

  const handleUserClick = (userIndex) => {
    // Ensure the function does not attempt to fetch if the index is already selected
    if (selectedUser && selectedUser.index === userIndex) return;

    setUserDetailsLoading(true);
    setUserDetailsError(null);

    // Fetching details based on user index
    axios
      .get("https://602e7c2c4410730017c50b9d.mockapi.io/users")
      .then((response) => {
        setSelectedUser({ ...response.data[userIndex], index: userIndex });
        setUserDetailsLoading(false);
      })
      .catch((error) => {
        setUserDetailsError("Failed to show user details");
        setUserDetailsLoading(false);
      });
  };

  return (
    <div className="app">
      <div className="user-list">
        <h1>User List</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <p>{error}</p>
        ) : users.length === 0 ? (
          <p>No data to show</p>
        ) : (
          users.map((user, index) => (
            <div
              key={index}
              className={`user-item ${
                selectedUser && selectedUser.index === index ? "selected" : ""
              }`}
              onClick={() => handleUserClick(index)}
            >
              <img src={user.avatar} alt={user.profile.username} />
              <div className="user-info">
                <p className="user-name">{`${user.profile.firstName} ${user.profile.lastName}`}</p>
                <p className="user-job">{user.jobTitle}</p>
                <p className="user-location">Other info...</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="user-details">
        {userDetailsLoading ? (
          <Loader />
        ) : userDetailsError ? (
          <p>{userDetailsError}</p>
        ) : selectedUser ? (
          <div className="user-details-content">
            <button className="clear-selection" onClick={handleClearSelection}>
              Back
            </button>
            <img
              src={selectedUser.avatar}
              alt={selectedUser.profile.username}
            />
            <h2>{`${selectedUser.profile.firstName} ${selectedUser.profile.lastName}`}</h2>
            <p>
              <strong>Email:</strong> {selectedUser.profile.email}
            </p>
            <p>
              <strong>Username:</strong> {selectedUser.profile.username}
            </p>
            <p>
              <strong>Job Title:</strong> {selectedUser.jobTitle}
            </p>
            <p>
              <strong>Bio:</strong> {selectedUser.Bio}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedUser.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="selectuser">
            <b>Select a user to see details</b>
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
