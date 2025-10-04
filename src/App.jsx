import classNames from 'classnames';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import PopupModal from './components/shared/PopupModal';
import { useGlobalValue } from './context/GlobalContext';
import { useWebSocket } from './hooks';
import About from './pages/About';
import AddProduct from './pages/AddProduct';
import Category from './pages/Category';
import CategoryProducts from './pages/CategoryProducts';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import { updatePrices } from './redux/reducers/metalPricesSlice';
import { fetchProductsRequest } from './redux/reducers/productsSlice';
import { API_ENDPOINTS } from './constants/index.js';

function App() {
  const { renderMetalPrices } = useGlobalValue();
  const dispatch = useDispatch();

  // Use the WebSocket hook with connection status
  const { data } = useWebSocket(API_ENDPOINTS.WEBSOCKET_URL, {
    reconnectInterval: 30000,
    autoReconnect: true,
  });

  // Update prices when WebSocket data changes
  useEffect(() => {
    if (data?.gold_price && data?.silver_price) {
      dispatch(
        updatePrices({
          gold: data.gold_price,
          silver: data.silver_price,
        })
      );
    }
  }, [data?.gold_price, data?.silver_price]);

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className={classNames('flex-grow', renderMetalPrices ? 'pt-[7.5rem]' : 'pt-16')}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category" element={<Category />} />
          <Route path="/products/:categorySlug" element={<CategoryProducts />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <PopupModal />
      <Footer />
    </div>
  );
}

export default App;
