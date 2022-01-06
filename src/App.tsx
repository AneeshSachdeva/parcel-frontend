import React from 'react';
import { ethers } from 'ethers';
import logo from './logo.svg';
import './App.css';
import createParcel from './utils';

function App() {
  // Visitor

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={async () => { 
          const parcelAddr = await createParcel('test'); 
          console.log("Parcel address:", parcelAddr);
        }}>
          Create Parcel
        </button>
      </header>
    </div>
  );
}

export default App;
