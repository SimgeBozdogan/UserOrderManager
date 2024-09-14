import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form, { SimpleItem, GroupItem, ButtonItem, RequiredRule, EmailRule } from 'devextreme-react/form';
import './index.css';

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
    setUser({ ...user, ...e }); // e is the form data change
  };

  const handleSave = (e) => {
    updateUser(user); // Update the user
    navigate('/users'); // Navigate back to user list
  };

  const handleDelete = () => {
    deleteUser(user.id); // Delete the user
    navigate('/users'); // Navigate back to user list
  };

  return (
    <div className="edit-container">
      <h2>Kullanıcıyı Düzenle</h2>
      <Form
        formData={user}
        onFieldDataChanged={(e) => handleChange(e.component.option('formData'))}
        labelLocation="top"
      >
        <GroupItem>
          <SimpleItem dataField="firstName" label={{ text: 'Ad' }} isRequired={true}>
            <RequiredRule message="Ad alanı zorunludur" />
          </SimpleItem>
          <SimpleItem dataField="lastName" label={{ text: 'Soyad' }} isRequired={true}>
            <RequiredRule message="Soyad alanı zorunludur" />
          </SimpleItem>
          <SimpleItem dataField="email" label={{ text: 'Email' }} editorType="dxTextBox">
            <RequiredRule message="Email zorunludur" />
            <EmailRule message="Geçerli bir email girin" />
          </SimpleItem>
        </GroupItem>
        <ButtonItem
          horizontalAlignment="center"
          buttonOptions={{
            text: 'Kaydet',
            type: 'success',
            onClick: handleSave,
          }}
        />
      </Form>
      
      <button onClick={handleDelete} className="delete-btn">
        Kullanıcıyı Sil
      </button>
    </div>
  );
}

export default UserEdit;