"use client";
import React from 'react';
import { CountdownTimer } from '../components/CountdownTimer';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <CountdownTimer />
    </div>
  );
}

export default App;