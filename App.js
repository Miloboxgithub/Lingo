import React, { Suspense } from 'react';
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AiGenerator from './pages/AiGenerator';
import DesignStudio from './pages/DesignStudio';
import SupplyChain from './pages/SupplyChain';
import OrderManagement from './pages/OrderManagement';
import DesignDocumentation from './pages/DesignDocumentation';
import CopyrightRegistration from './components/CopyrightRegistration';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>TEST</h1>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-generator" element={<AiGenerator />} />
              <Route path="/design-studio" element={<DesignStudio />} />
              <Route path="/supply-chain" element={<SupplyChain />} />
              <Route path="/order-management" element={<OrderManagement />} />
              <Route path="/design-documentation" element={<DesignDocumentation />} />
            <Route path="/copyright-registration" element={<CopyrightRegistration />} />
          </Routes>
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;