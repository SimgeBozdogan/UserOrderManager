import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { DataGrid, Column } from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import "./UserList.css";

function UserList({ users }) {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [newOrder, setNewOrder] = useState({
    product: "",
    price: "",
    quantity: "",
  });

  const [orders, setOrders] = useState([
    { id: 1, userId: 1, product: "Laptop", price: 2000, quantity: 1 },
    { id: 2, userId: 2, product: "Mouse", price: 100, quantity: 2 },
    { id: 3, userId: 3, product: "Telefon", price: 1500, quantity: 1 },
    { id: 4, userId: 4, product: "Klavye", price: 300, quantity: 1 },
    { id: 5, userId: 5, product: "Kulaklık", price: 500, quantity: 1 },
  ]);

  // Kullanıcının siparişlerini alma
  const getOrdersForUser = (userId) => {
    return orders.filter((order) => order.userId === userId);
  };

  // Kullanıcıya tıklayınca siparişleri güncelle
  const handleUserClick = (e) => {
    const userId = e.data.id; // DataGrid'den gelen kullanıcının ID'si
    setSelectedUserId(userId);
    setSelectedOrders(getOrdersForUser(userId));
    setShowOrderForm(false);
    setEditOrderId(null);
  };

  const handleShowOrderForm = () => {
    setShowOrderForm(true);
    setEditOrderId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    if (!newOrder.product || !newOrder.price || !newOrder.quantity) {
      alert("Lütfen tüm sipariş bilgilerini doldurun.");
      return;
    }

    const newOrderToAdd = {
      id: orders.length + 1,
      userId: selectedUserId,
      product: newOrder.product,
      price: parseFloat(newOrder.price),
      quantity: parseInt(newOrder.quantity, 10),
    };
    
    setOrders([...orders, newOrderToAdd]);
    setSelectedOrders([...selectedOrders, newOrderToAdd]);
    setNewOrder({ product: "", price: "", quantity: "" });
    setShowOrderForm(false);
  };

  const handleEditOrder = (order) => {
    setNewOrder({
      product: order.product,
      price: order.price,
      quantity: order.quantity,
    });
    setEditOrderId(order.id);
    setShowOrderForm(true);
  };

  const handleSaveEditOrder = (e) => {
    e.preventDefault();
    const updatedOrders = orders.map((order) =>
      order.id === editOrderId
        ? {
            ...order,
            product: newOrder.product,
            price: parseFloat(newOrder.price),
            quantity: parseInt(newOrder.quantity, 10),
          }
        : order
    );
    setOrders(updatedOrders);
    setSelectedOrders(
      updatedOrders.filter((order) => order.userId === selectedUserId)
    );
    setNewOrder({ product: "", price: "", quantity: "" });
    setShowOrderForm(false);
    setEditOrderId(null);
  };

  const handleDeleteOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    setSelectedOrders(
      updatedOrders.filter((order) => order.userId === selectedUserId)
    );
  };

  const handleLogout = () => {
    Cookies.remove("loggedIn");
    Cookies.remove("username");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="user-order-container">
      <div className="user-list-section">
        <h2>Kullanıcı Listesi</h2>
        <button
          className="add-user-btn"
          onClick={() => navigate("/create-user")}
        >
          Yeni Kullanıcı Ekle
        </button>

        {/* DevExpress DataGrid */}
        <DataGrid
          dataSource={users}
          showBorders={true}
          columnAutoWidth={true}
          onRowClick={handleUserClick} // Kullanıcı satırına tıklayınca
        >
          <Column dataField="firstName" caption="Ad" />
          <Column dataField="lastName" caption="Soyad" />
          <Column dataField="email" caption="Email" />

          {/* Düzenle butonu sütunu */}
          <Column
            dataField="id"
            caption=""
            cellRender={({ data }) => (
              <button onClick={() => navigate(`/edit-user/${data.id}`)}>
                Düzenle
              </button>
            )}
            allowSorting={false} // Sıralama olmasın
            allowHeaderFiltering={false} // Başlıkta filtre olmasın
          />
        </DataGrid>
      </div>

      <div className="order-list-section">
        <h2>Sipariş Listesi</h2>
        {selectedUserId === null ? (
          <p>Lütfen bir kullanıcı seçiniz.</p>
        ) : selectedOrders.length > 0 ? (
          <table className="order-table">
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Fiyat</th>
                <th>Adet</th>
                <th>Düzenle</th>
                <th>Sil</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.product}</td>
                  <td>{order.price} TL</td>
                  <td>{order.quantity}</td>
                  <td>
                    <button
                      className="edit-order-btn"
                      onClick={() => handleEditOrder(order)}
                    >
                      Düzenle
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-order-btn"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Bu kullanıcıya ait sipariş bulunmamaktadır.</p>
        )}

        <button className="add-order-btn" onClick={handleShowOrderForm}>
          Yeni Sipariş Ekle
        </button>

        {showOrderForm && (
          <form
            className="order-form"
            onSubmit={editOrderId ? handleSaveEditOrder : handleAddOrder}
          >
            <div className="form-group">
              <label>Ürün Adı:</label>
              <input
                type="text"
                name="product"
                value={newOrder.product}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fiyat:</label>
              <input
                type="number"
                name="price"
                value={newOrder.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Adet:</label>
              <input
                type="number"
                name="quantity"
                value={newOrder.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="submit-order-btn">
              {editOrderId ? "Kaydet" : "Sipariş Ekle"}
            </button>
          </form>
        )}

        <button
          className="logout-btn"
          style={{ marginTop: showOrderForm ? "20px" : "20px" }}
          onClick={handleLogout}
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

export default UserList;
