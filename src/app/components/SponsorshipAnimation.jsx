"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFullAssociations, createAssociationsForFiliere } from '../lib/store/AssociationReducer/action';

export default function SponsorshipAnimation({ onMatch }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatchButtonVisible, setIsMatchButtonVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { associations, loading } = useSelector((state) => state.associations);

  useEffect(() => {
    if (user?.filiere) {
      dispatch(getFullAssociations(user.filiere));
    }
  }, [dispatch, user]);

  const handleMatch = async () => {
    if (!user?.filiere) return;
    
    setIsAnimating(true);
    try {
      console.log(user.filiere.$id);
      console.log(user.filiere);
      await dispatch(createAssociationsForFiliere(user.filiere.$id)).unwrap();
      await dispatch(getFullAssociations(user.filiere.$id)).unwrap();
      setIsMatchButtonVisible(false);
    } catch (error) {
      console.error("Erreur lors du parrainage:", error);
    } finally {
      setIsAnimating(false);
    }
  };

  const handleSkip = () => {
    if (associations?.length > 0) {
      setCurrentIndex((prevIndex) => 
        prevIndex + 1 >= associations.length ? 0 : prevIndex + 1
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const currentAssociation = associations?.[currentIndex];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Affichage du parrain (niveau 4) */}
        <div className="bg-[#001824] p-4 rounded-lg opacity-75">
          <h3 className="text-lg font-semibold mb-2">Parrain</h3>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600/50 rounded-full flex items-center justify-center">
              {currentAssociation?.parrain ? (
                <span className="text-white font-medium">
                  {currentAssociation.parrain.nom?.charAt(0) || '?'}
                </span>
              ) : (
                <svg 
                  className="w-6 h-6 text-white/50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              )}
            </div>
            <span className="text-gray-400">
              {currentAssociation?.parrain?.nom || 'En attente...'}
            </span>
          </div>
        </div>

        {/* Affichage du filleul (niveau 3) */}
        <div className="bg-[#001824] p-4 rounded-lg opacity-75">
          <h3 className="text-lg font-semibold mb-2">Filleul</h3>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600/50 rounded-full flex items-center justify-center">
              {currentAssociation?.filleuls?.[0] ? (
                <span className="text-white font-medium">
                  {currentAssociation.filleuls[0].nom?.charAt(0) || '?'}
                </span>
              ) : (
                <svg 
                  className="w-6 h-6 text-white/50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              )}
            </div>
            <span className="text-gray-400">
              {currentAssociation?.filleuls?.[0]?.nom || 'En attente...'}
            </span>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-center space-x-4">
        {isMatchButtonVisible && (
          <button
            onClick={handleMatch}
            disabled={isAnimating || !user?.filiere}
            className={`px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors
              ${(isAnimating || !user?.filiere) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAnimating ? 'Création en cours...' : 'Lancer le parrainage'}
          </button>
        )}
        <button
          onClick={handleSkip}
          className="px-6 py-2 bg-gray-600/50 hover:bg-gray-700/50 text-white/75 rounded-lg transition-colors"
          disabled={!associations?.length || isAnimating}
        >
          Passer
        </button>
      </div>
    </div>
  );
}