import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import UserList from './components/UserList';
import UserEdit from './components/UserEdit';
import UserCreate from './components/UserCreate';
import Login from './components/Login';

function App() {
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = Cookies.get('loggedIn');
    setIsLoggedIn(loggedInStatus);
  }, []);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (savedUsers.length > 0) {
      setUsers(savedUsers);
    } else {
      fetch('https://dummyjson.com/users')
        .then((response) => response.json())
        .then((data) => {
          setUsers(data.users);
          localStorage.setItem('users', JSON.stringify(data.users)); // localStorage'a kaydet
        });
    }
  }, []);

  // Yeni kullanıcı ekleme fonksiyonu
  const addUser = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // localStorage'a kaydet
  };

  // Kullanıcı güncelleme fonksiyonu
  const updateUser = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Güncellenen kullanıcıyı kaydet
  };

  // Kullanıcı silme fonksiyonu
  const deleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Güncellenmiş kullanıcı listesi
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/users" />} />
        <Route path="/users" element={isLoggedIn ? <UserList users={users} deleteUser={deleteUser} /> : <Navigate to="/" />} />
        <Route path="/edit-user/:id" element={isLoggedIn ? <UserEdit users={users} updateUser={updateUser} deleteUser={deleteUser} /> : <Navigate to="/" />} />
        <Route path="/create-user" element={isLoggedIn ? <UserCreate addUser={addUser} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
