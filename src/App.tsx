import React from 'react';
import './App.scss';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';


function App() {
  return (
    <div className="app-layout">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
