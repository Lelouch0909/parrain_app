"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { connection } from "../../lib/store/AuthReducer/action";
import { getCurrentUser } from "../../lib/store/AuthReducer/action";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../dashboard/page";
import AdminDashboard from "../../dashboard/admin/page";

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    try {
      dispatch(
        connection({ login: formData.email, password: formData.password })
      );
    } catch (error) {
      console.log("Erreur lors de la connexion:", error);
    }
  };
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Loader centré
 
  useEffect(() => {
    console.log(user);
    
    // Redirection vers les dashboards
    if (user) {
       user.cto ? router.push("/dashboard/admin") : router.push("/dashboard");
    }
   
  }, [user, router, loading]);
 if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  // Formulaire de connexion
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Parrainage</h1>
          <p className="text-gray-400 text-sm md:text-base px-4">
            Rentrez vos informations et connectez-vous directement à votre compte.
          </p>
        </div>

        <div className="bg-[#002633] rounded-lg p-4 md:p-8 shadow-xl mx-4 md:mx-0">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm mb-2 text-gray-300">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-2.5 md:p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full p-2.5 md:p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 md:py-3 rounded transition duration-200 text-sm md:text-base font-medium"
            >
              Se connecter
            </button>

            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
