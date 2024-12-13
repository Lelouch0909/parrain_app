"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowLeftRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createAssociationsForFiliere, getAllAssociations } from "../lib/store/AssociationReducer/action";
import { getAccount, getCurrentUser, association } from "../lib/store/AuthReducer/action";

export default function SponsorshipAnimation() {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedAssociations, setCompletedAssociations] = useState([]); // Nouveau tableau pour stocker les associations déjà affichées
  const [isAnimating, setIsAnimating] = useState(false);

  const { user, account, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { associations = [], loading: associationLoading, error: associationError } = useSelector((state) => state.association || {});

  useEffect(() => {
    dispatch(getAccount());
    dispatch(getCurrentUser());
    dispatch(getAllAssociations("6755dc99002e2d967a40"));
  }, [dispatch]);
  const [ass, setAss] = useState([]);
  const handleParrainage = async () => {

    try {
      setIsAnimating(true);
      await dispatch(createAssociationsForFiliere("6755dc99002e2d967a40"));
      const associationResult = await dispatch(getAllAssociations("6755dc99002e2d967a40"));
      // console.log(associationResult.payload);
      setAss(associationResult.payload);
      ;
    } catch (error) {
      console.error("Erreur lors de la création des associations:", error);
    } finally {
      setIsAnimating(false);
    }

  };
  console.log(ass);
  // Dérivation des mentors et des mentees à partir de `associations`
  const mentors = ass
    .filter((assoc) => assoc.parrain)
    .map((assoc) => ({
      name: assoc.parrain.nom || "Nom inconnu",
      image: assoc.parrain.photo_id || "/placeholder.jpg",
      role: `${assoc.parrain.filiere || "Filière inconnue"} - ${assoc.parrain.niveau || "Niveau inconnu"}`
    }));

  const mentees = ass
  .filter((assoc) => assoc.filleul)
  .map((assoc) => ({
    name: assoc.filleul.nom || "Nom inconnu",
    image: assoc.filleul.photo_id || "/placeholder.jpg",
    role: `${assoc.filleul.filiere || "Filière inconnue"} - ${assoc.filleul.niveau || "Niveau inconnu"}`
  }));
  console.log(mentees);
  // console.log(mentors);


  const nextAssociation = () => {
    const maxIndex = Math.min(mentors.length, mentees.length) - 1;
    if (currentIndex < maxIndex) {
      const currentMentor = mentors[currentIndex];
      const currentMentee = mentees[currentIndex];

      // Ajouter l'association actuelle aux associations complétées
      setCompletedAssociations((prev) => [
        ...prev,
        { mentor: currentMentor, mentee: currentMentee }
      ]);

      // Passer à l'association suivante
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  if (authLoading || associationLoading) {
    return <div>Chargement...</div>;
  }

  if (authError || associationError) {
    return <div className="text-red-500 text-center">Erreur: {authError || associationError}</div>;
  }

  const currentMentor = mentors[currentIndex] || null;
  const currentMentee = mentees[currentIndex] || null;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-16">
        {/* Mentor */}
        <div className="text-center bg-white shadow-md rounded-lg p-4">
          <div className="relative h-32 w-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary">
            {currentMentor ? (
              <img src={currentMentor.image} alt={currentMentor.name} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <span>Chargement...</span>
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold">{currentMentor?.name || "..."}</h2>
          <p className="text-sm text-muted-foreground">{currentMentor?.role}</p>
        </div>

        <div className="flex items-center">
          <ArrowLeftRight className="h-8 w-8 text-primary" />
        </div>

        {/* Mentee */}
        <div className="text-center bg-white shadow-md rounded-lg p-4">
          <div className="relative h-32 w-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary">
            {currentMentee ? (
              <img src={currentMentee.image} alt={currentMentee.name} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <span>Chargement...</span>
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold">{currentMentee?.name || "..."}</h2>
          <p className="text-sm text-muted-foreground">{currentMentee?.role}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleParrainage} disabled={isAnimating} size="lg" className={`px-8 ${isAnimating ? "opacity-50 cursor-not-allowed" : ""}`}>
          {isAnimating ? (
            <div className="flex items-center gap-2">
              <span>Création en cours...</span>
              <span className="animate-spin">🔄</span>
            </div>
          ) : (
            "Parrainer"
          )}
        </Button>

        <Button
          onClick={nextAssociation}
          disabled={mentors.length === 0 || currentIndex >= Math.min(mentors.length, mentees.length) - 1}
          size="lg"
          className="px-8"
        >
          Suivant
        </Button>
      </div>

      {/* Liste des associations complétées */}
      <div className="mt-8 w-full max-w-3xl">
        <h3 className="text-2xl font-semibold mb-4">Associations complétées</h3>
        <ul className="space-y-4">
          {completedAssociations.map(({ mentor, mentee }, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow">
              <div className="flex items-center gap-4">
                <img src={mentor.image} alt={mentor.name} className="h-12 w-12 rounded-full border-2 border-primary" />
                <div>
                  <p className="font-semibold">{mentor.name}</p>
                  <p className="text-sm text-muted-foreground">{mentor.role}</p>
                </div>
              </div>
              <ArrowLeftRight className="h-6 w-6 text-primary" />
              <div className="flex items-center gap-4">
                <img src={mentee.image} alt={mentee.name} className="h-12 w-12 rounded-full border-2 border-primary" />
                <div>
                  <p className="font-semibold">{mentee.name}</p>
                  <p className="text-sm text-muted-foreground">{mentee.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
