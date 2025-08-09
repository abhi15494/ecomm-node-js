import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './assets/styles/index.css';
import './assets/styles/bootstrap.custom.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import HomeScreen from './screen/HomeScreen';
import ProductScreen from './screen/ProductScreen';
import CartScreen from './screen/CartScreen';
import LoginScreen from './screen/LoginScreen';
import RegisterScreen from './screen/RegisterScreen';
import ShippingScreen from './screen/ShippingScreen';
import PaymentScreen from './screen/PaymentScreen';
import PrivateRoute from './components/PrivateRoute';
import PlaceOrderScreen from './screen/PlaceOrderScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
      </Route>

    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
