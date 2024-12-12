"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeftRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { createAssociationsForFiliere, getAssociations } from "../lib/store/AssociationReducer/action";
import { getAccount } from "../lib/store/AuthReducer/action";

export default function SponsorshipAnimation() {
  const dispach = useDispatch();
  dispach(getAccount());
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleParrainage = async () => {
    setIsAnimating(true);
    try {

      console.log(dispach(createAssociationsForFiliere("6755dc99002e2d967a40")));
      console.log(dispach(getAssociations("6755dc99002e2d967a40")));

      // setMentors(parrain);
      // setMentees(filleul);

      setCurrentIndex(0); // Réinitialise à la première association
    } catch (error) {
      console.error("Erreur lors de la création des associations:", error);
    } finally {
      setIsAnimating(false);
    }
  };

  const nextAssociation = () => {
    if (currentIndex < mentors.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const currentMentor = mentors[currentIndex] || null;
  const currentMentee = mentees[currentIndex] || null;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-16">
        {/* Mentor */}
        <div className="text-center">
          <div className="relative h-32 w-32 mx-auto mb-4 rounded-full overflow-hidden">
            {currentMentor && (
              <img
                src={currentMentor.image}
                alt={currentMentor.name}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <h2 className="text-xl font-semibold">{currentMentor?.name || "..."}</h2>
          <p className="text-sm text-muted-foreground">{currentMentor?.role}</p>
        </div>

        <div className="flex items-center">
          <ArrowLeftRight className="h-8 w-8 text-primary" />
        </div>

        {/* Mentee */}
        <div className="text-center">
          <div className="relative h-32 w-32 mx-auto mb-4 rounded-full overflow-hidden">
            {currentMentee && (
              <img
                src={currentMentee.image}
                alt={currentMentee.name}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <h2 className="text-xl font-semibold">{currentMentee?.name || "..."}</h2>
          <p className="text-sm text-muted-foreground">{currentMentee?.role}</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Bouton Parrainer */}
        <Button
          onClick={handleParrainage}
          disabled={isAnimating}
          size="lg"
          className="px-8"
        >
          {isAnimating ? "Création en cours..." : "Parrainer"}
        </Button>

        {/* Bouton Suivant */}
        <Button
          onClick={nextAssociation}
          disabled={currentIndex >= mentors.length - 1 || mentors.length === 0}
          size="lg"
          className="px-8"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
