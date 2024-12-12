"use client";
import React, { useEffect } from 'react';
import { CountdownTimer } from '../components/CountdownTimer';
import { getCurrentUser } from '../lib/store/AuthReducer/action';
import { useDispatch, useSelector } from 'react-redux';


function App() {
  const dispach = useDispatch();
  const { user, account, loading, error } = useSelector((state) => state.auth);
  useEffect(() => {
    dispach(getCurrentUser());
  }, [dispach]);
  // console.log(dispach(getCurrentUser()));
  useEffect(() => {
    console.log(user);
  }, [user]);
  // console.log(user);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <CountdownTimer />
    </div>
  );
}

export default App;