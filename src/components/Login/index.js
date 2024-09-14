import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Form, { SimpleItem, ButtonItem, RequiredRule } from 'devextreme-react/form';
import './index.css';  // Stil dosyasını unutmayalım

function Login({ setIsLoggedIn }) {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = () => {
    const { username, password } = loginData;

    // Doğru kullanıcı adı ve şifre
    if (username === 'admin' && password === 'password') {
      Cookies.set('loggedIn', 'true', { expires: 1 });  // Cookie ayarlanır
      setIsLoggedIn(true);  // isLoggedIn güncellenir
      navigate('/users');  // Başarılı giriş sonrası kullanıcı listesine yönlendir
    } else {
      alert('Yanlış kullanıcı adı veya şifre!');  // Yanlış girişte hata ver
    }
  };

  const handleChange = (e) => {
    setLoginData({ ...loginData, ...e }); // Update loginData state on form data change
  };

  return (
    <div className="login-container">
      <h2>Giriş Yap</h2>
      <Form
        formData={loginData}
        onFieldDataChanged={(e) => handleChange(e.component.option('formData'))}
        labelLocation="top"
      >
        <SimpleItem dataField="username" label={{ text: 'Kullanıcı Adı' }} isRequired={true}>
          <RequiredRule message="Kullanıcı adı zorunludur" />
        </SimpleItem>
        <SimpleItem dataField="password" label={{ text: 'Şifre' }} editorType="dxTextBox" editorOptions={{ mode: 'password' }} isRequired={true}>
          <RequiredRule message="Şifre zorunludur" />
        </SimpleItem>
        <ButtonItem
          horizontalAlignment="center"
          buttonOptions={{
            text: 'Giriş Yap',
            type: 'success',
            onClick: handleSubmit
          }}
        />
      </Form>
    </div>
  );
}

export default Login;