// src/App.jsx (آپدیت شده)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BrandProvider } from './contexts/BrandContext';
import { EvaluationProvider } from './contexts/EvaluationContext';
import { NotificationProvider } from './components/common/Notification';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Evaluation from './pages/Evaluation';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BrandProvider>
          <EvaluationProvider>
            <Router>
              <div className="app">
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/evaluation" element={<Evaluation />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminPanel />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </EvaluationProvider>
        </BrandProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;