import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form, { SimpleItem, ButtonItem, RequiredRule, EmailRule } from 'devextreme-react/form';

function UserCreate({ addUser }) {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const navigate = useNavigate();

  const handleSubmit = () => {
    const newUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    addUser(newUser);

    alert('Yeni kullanıcı başarıyla oluşturuldu!');
    navigate('/users');
  };

  return (
    <div className="edit-container">
      <h2>Yeni Kullanıcı Ekle</h2>
      <Form
        formData={user}
        onFieldDataChanged={(e) => setUser(e.component.option('formData'))}
        labelLocation="top"
      >
        <SimpleItem dataField="firstName" label={{ text: 'Ad' }} isRequired={true}>
          <RequiredRule message="Ad zorunludur" />
        </SimpleItem>
        <SimpleItem dataField="lastName" label={{ text: 'Soyad' }} isRequired={true}>
          <RequiredRule message="Soyad zorunludur" />
        </SimpleItem>
        <SimpleItem dataField="email" label={{ text: 'Email' }} editorType="dxTextBox">
          <RequiredRule message="Email zorunludur" />
          <EmailRule message="Geçerli bir email girin" />
        </SimpleItem>
        <ButtonItem
          horizontalAlignment="center"
          buttonOptions={{
            text: 'Kaydet',
            type: 'success',
            onClick: handleSubmit,
          }}
        />
      </Form>
    </div>
  );
}

export default UserCreate;