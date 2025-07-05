import { useState } from 'react'
import './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Layout from "./components/Layout";
import ClientePage from './pages/Clientes';
import DividaPage from './pages/Divida';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ClientePage />} />
          <Route path="dividas">
              <Route index element={<DividaPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
