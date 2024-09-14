import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserEdit.css';  // Aynı stil dosyasını kullanıyoruz

function UserCreate({ addUser }) {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Yeni kullanıcıyı manuel olarak ekleme (simülasyon)
    const newUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    addUser(newUser);  // Yeni kullanıcıyı ekliyoruz

    alert('Yeni kullanıcı başarıyla oluşturuldu!');
    navigate('/users');  // Kullanıcı oluşturulduktan sonra listeye dön
  };

  return (
    <div className="edit-container">
      <h2>Yeni Kullanıcı Ekle</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ad:</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            placeholder="Adınızı girin"
          />
        </div>
        <div className="form-group">
          <label>Soyad:</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            placeholder="Soyadınızı girin"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email adresinizi girin"
          />
        </div>
        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
}

export default UserCreate;
