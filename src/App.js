import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import UserList from "./components/UserList";
import UserEdit from "./components/UserEdit";
import UserCreate from "./components/UserCreate";
import Login from "./components/Login";

function App() {
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = Cookies.get("loggedIn");
    setIsLoggedIn(loggedInStatus);
  }, []);

  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users);
      });
  }, []);

  // Yeni kullanıcı ekleme fonksiyonu
  const addUser = (newUser) => {
    fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers([...users, data]);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };

  // Kullanıcı güncelleme fonksiyonu
  const updateUser = (updatedUser) => {
    fetch(`https://dummyjson.com/users/${updatedUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.id) {
          setUsers((prevUsers) => [...prevUsers, updatedUser]);
          return;
        }

        const updatedUsers = users.map((user) =>
          user.id === data.id ? data : user
        );

        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  // Kullanıcı silme fonksiyonu
  const deleteUser = (userId) => {
    fetch(`https://dummyjson.com/users/${userId}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Login setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/users" />
            )
          }
        />
        <Route
          path="/users"
          element={
            isLoggedIn ? (
              <UserList users={users} deleteUser={deleteUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/edit-user/:id"
          element={
            isLoggedIn ? (
              <UserEdit
                users={users}
                updateUser={updateUser}
                deleteUser={deleteUser}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/create-user"
          element={
            isLoggedIn ? <UserCreate addUser={addUser} /> : <Navigate to="/" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
