import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import Pages
import Login from './pages/Auth/Login';
import MainLayout from './components/layout/MainLayout';
import ProductList from './pages/Products/ProductList';
import CustomerList from './pages/Customers/CustomerList';
import OrderList from './pages/Orders/OrderList';
import ImportGoods from './pages/Inventory/ImportGoods';
import Dashboard from './pages/Dashboard/Dashboard';
import ShopPage from './pages/Shop/ShopPage'; // <--- MỚI

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<MainLayout />}>
            {/* Redirect mặc định vào trang Shop cho tiện */}
            <Route index element={<Navigate to="/admin/shop" replace />} />
            
            <Route path="shop" element={<ShopPage />} /> {/* <--- Route MỚI */}
            <Route path="products" element={<ProductList />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="import" element={<ImportGoods />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;