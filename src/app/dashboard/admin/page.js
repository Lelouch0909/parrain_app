"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signOut, getCurrentUser } from "../../lib/store/AuthReducer/action";
import { getFullAssociations } from "../../lib/store/AssociationReducer/action";
import SponsorshipAnimation from "../../components/SponsorshipAnimation";
import MatchList from "../../components/MatchLists";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
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

  const handleLogout = () => {
    dispatch(signOut());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#001219] text-emerald-400">
      <header className="bg-[#002633] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-3 items-center">
            {/* Profil à gauche */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.nom?.charAt(0)}
                </span>
              </div>
            </div>
            
            {/* Filière au centre */}
            <div className="text-center">
              <h1 className="text-xl font-bold text-emerald-200">
                {user?.filiere}
              </h1>
            </div>
            
            {/* Déconnexion à droite */}
            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-8 md:mb-16">
          <div className="bg-[#002633] rounded-lg p-4 md:p-8 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              Attribution des parrains
            </h2>
            <SponsorshipAnimation />
          </div>
        </div>

        <section className="bg-[#002633] rounded-lg p-4 md:p-8 shadow-lg">
          <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-8">
            Paires formées
          </h2>
          <div className="overflow-x-auto">
            <MatchList matches={associations} />
          </div>
        </section>
      </main>
    </div>
  );
}