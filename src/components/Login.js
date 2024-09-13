import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Login.css';  // Stil dosyasını unutmayalım

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Doğru kullanıcı adı ve şifre
    if (username === 'admin' && password === 'password') {
      Cookies.set('loggedIn', 'true', { expires: 1 });  // Cookie ayarlanır
      setIsLoggedIn(true);  // isLoggedIn güncellenir
      navigate('/users');  // Başarılı giriş sonrası kullanıcı listesine yönlendir
    } else {
      alert('Yanlış kullanıcı adı veya şifre!');  // Yanlış girişte hata ver
    }
  };

  return (
    <div className="login-container">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Kullanıcı Adı:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı adınızı girin"
            required
          />
        </div>
        <div className="form-group">
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifrenizi girin"
            required
          />
        </div>
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
}

export default Login;
