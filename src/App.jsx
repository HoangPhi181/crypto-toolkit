import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Home from './pages/Home';
import Symmetric from './pages/Symmetric';
import Asymmetric from './pages/Asymmetric';
import Hash from './pages/Hash';
import './styles/index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast({ message: '', type: 'success' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'symmetric':
        return <Symmetric showToast={showToast} />;
      case 'asymmetric':
        return <Asymmetric showToast={showToast} />;
      case 'hash':
        return <Hash showToast={showToast} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <Header />
      <div className="app-container">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
      {toast.message && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={clearToast} 
        />
      )}
    </>
  );
}

export default App;
