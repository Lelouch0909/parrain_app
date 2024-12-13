"use client";
import React, { useEffect } from "react";
import { CountdownTimer } from "../components/CountdownTimer";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, signOut } from "../lib/store/AuthReducer/action";
import { useRouter } from "next/navigation";

function App() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(signOut());
  };
  const { user, loading } = useSelector((state) => state.auth);
  const { associations } = useSelector((state) => state.associations);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !user) {
      router.back();
    }
    console.log(user);
    
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Parrainage</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center flex-grow">
        <CountdownTimer />
      </div>
    </div>
  );
}

export default App;
