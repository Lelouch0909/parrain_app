"use client";

import { useState } from "react";
import Header from "../../components/Header";
import SponsorshipAnimation from "../../components/SponsorshipAnimation";
import MatchList from "../../components/MatchLists";
import { mentors, mentees } from "../../data/users";
import { Provider } from "react-redux";
import store from "../../lib/store";

export default function Home() {
  const [matches, setMatches] = useState([]);
  //   const [mentors, setMentors] = useState([]);
  //   const [mentees, setMentees] = useState([]);

  const handleMatch = (mentor, mentee) => {
    // Vérifier si le mentor a déjà un filleul
    const mentorMatches = matches.filter(m => m.mentor.id === mentor.id);
    const allMentorsHaveMatch = mentors.every(m =>
      matches.some(match => match.mentor.id === m.id)
    );

    // Si le mentor a déjà un filleul et que tous les mentors n'ont pas encore de filleul
    if (mentorMatches.length > 0 && !allMentorsHaveMatch) {
      return;
    }

    // Si le filleul est déjà associé
    if (matches.some(m => m.mentee.id === mentee.id)) {
      return;
    }

    setMatches([...matches, { mentor, mentee }]);
  };

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-16">
            <SponsorshipAnimation
              mentors={mentors}
              mentees={mentees}
              onMatch={handleMatch}
            />
          </div>

          <section>
            <h2 className="text-3xl font-bold mb-8">Matched Pairs</h2>
            <MatchList matches={matches} />
          </section>
        </main>
      </div>
    </Provider>
  );
}