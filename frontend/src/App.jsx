import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SnackProvider } from './context/SnackContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddSnack from './pages/AddSnack';
import SnackDetail from './pages/SnackDetail';
import Profile from './pages/Profile';

function App() {
  return (
    <SnackProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add-snack" element={<AddSnack />} />
              <Route path="/snack/:id" element={<SnackDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </SnackProvider>
  );
}

export default App;
