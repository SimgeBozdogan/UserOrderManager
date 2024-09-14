import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { DataGrid, Column } from "devextreme-react/data-grid";
import Form, {
  SimpleItem,
  ButtonItem,
  RequiredRule,
} from "devextreme-react/form";
import "devextreme/dist/css/dx.light.css";
import "./index.css";

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

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://dummyjson.com/carts");
        const data = await response.json();
        const fetchedOrders = data.carts.flatMap((cart) =>
          cart.products.map((product) => ({
            id: product.id,
            userId: cart.userId,
            product: product.title,
            price: product.price,
            quantity: product.quantity,
            total: product.total,
            discountPercentage: product.discountPercentage,
            discountedTotal: product.discountedTotal
          }))
        );
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Siparişler çekilirken bir hata oluştu:", error);
      }
    };

    fetchOrders();
  }, []);

  const getOrdersForUser = (userId) => {
    return orders.filter((order) => order.userId === userId);
  };

  const handleUserClick = (e) => {
    const userId = e.data.id;
    setSelectedUserId(userId);
    setSelectedOrders(getOrdersForUser(userId));
    setShowOrderForm(false);
    setEditOrderId(null);
  };

  const handleShowOrderForm = () => {
    setShowOrderForm(true);
    setEditOrderId(null);
  };

  const handleAddOrder = (e) => {
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
          onRowClick={handleUserClick}
        >
          <Column
            caption="User"
            cellRender={({ data }) => `${data.firstName} ${data.lastName}`}
          />
          <Column dataField="phone" caption="Phone" />
          <Column dataField="email" caption="Email" />

          <Column
            dataField="id"
            caption=""
            cellRender={({ data }) => (
              <button onClick={() => navigate(`/edit-user/${data.id}`)}>
                Düzenle
              </button>
            )}
            allowSorting={false}
            allowHeaderFiltering={false}
          />
        </DataGrid>
      </div>

      <div className="order-list-section">
        <h2>Sipariş Listesi</h2>
        {selectedUserId === null ? (
          <p>Lütfen bir kullanıcı seçiniz.</p>
        ) : selectedOrders.length > 0 ? (
          <DataGrid
            dataSource={selectedOrders}
            showBorders={true}
            columnAutoWidth={true}
            keyExpr="id"
          >
            <Column dataField="product" caption="Title" />
            <Column dataField="price" caption="Price" />
            <Column dataField="quantity" caption="Quantity" />
            <Column dataField="total" caption="Total" />
            <Column dataField="discountPercentage" caption="Discount" />
            <Column dataField="discountedTotal" caption="Discounted Total" />
            <Column
              caption="Düzenle"
              cellRender={({ data }) => (
                <button
                  className="edit-order-btn"
                  onClick={() => handleEditOrder(data)}
                >
                  Düzenle
                </button>
              )}
              allowSorting={false}
              allowHeaderFiltering={false}
            />
            <Column
              caption="Sil"
              cellRender={({ data }) => (
                <button
                  className="delete-order-btn"
                  onClick={() => handleDeleteOrder(data.id)}
                >
                  Sil
                </button>
              )}
              allowSorting={false}
              allowHeaderFiltering={false}
            />
          </DataGrid>
        ) : (
          <p>Bu kullanıcıya ait sipariş bulunmamaktadır.</p>
        )}

        <button className="add-order-btn" onClick={handleShowOrderForm}>
          Yeni Sipariş Ekle
        </button>

        {showOrderForm && (
          <Form
            formData={newOrder}
            onFieldDataChanged={(e) =>
              setNewOrder(e.component.option("formData"))
            }
            labelLocation="top"
          >
            <SimpleItem dataField="product" label={{ text: "Ürün Adı" }}>
              <RequiredRule message="Ürün adı zorunludur" />
            </SimpleItem>
            <SimpleItem
              dataField="price"
              label={{ text: "Fiyat" }}
              editorType="dxNumberBox"
            >
              <RequiredRule message="Fiyat zorunludur" />
            </SimpleItem>
            <SimpleItem
              dataField="quantity"
              label={{ text: "Adet" }}
              editorType="dxNumberBox"
            >
              <RequiredRule message="Adet zorunludur" />
            </SimpleItem>
            <ButtonItem
              horizontalAlignment="center"
              buttonOptions={{
                text: editOrderId ? "Kaydet" : "Sipariş Ekle",
                type: "success",
                onClick: editOrderId ? handleSaveEditOrder : handleAddOrder,
              }}
            />
          </Form>
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