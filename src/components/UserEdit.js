import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserEdit.css'; // Stil dosyasını unutmayın

function UserEdit({ users, updateUser, deleteUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    const currentUser = users.find((u) => u.id === parseFloat(id));
    if (currentUser) {
      setUser(currentUser);
    }
  }, [id, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(user); // Kullanıcıyı güncelleme fonksiyonu burada çağrılıyor
    navigate('/users'); // Kaydedildikten sonra kullanıcı listesine yönlendirme
  };

  const handleDelete = () => {
    deleteUser(user.id); // Kullanıcıyı silme işlemi
    navigate('/users'); // Silindikten sonra kullanıcı listesine yönlendirme
  };

  return (
    <div className="edit-container">
      <h2>Kullanıcıyı Düzenle</h2>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Ad:</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Soyad:</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="save-btn">Kaydet</button>
      </form>

      <button onClick={handleDelete} className="delete-btn">
        Kullanıcıyı Sil
      </button>
    </div>
  );
}

export default UserEdit;
