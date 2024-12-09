"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilieres } from "../lib/store/FiliereReducer/action";

function Main() {
  const dispatch = useDispatch();
  const [nom, setNom] = useState("");
  const [matricule, setMatricule] = useState("");
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [niveau, setNiveau] = useState("");

  useEffect(() => {
    console.log("useEffect called");
    dispatch(getFilieres())
      .then(() => console.log("getFilieres dispatched successfully"))
      .catch(err => console.error("getFilieres error:", err));
  }, [dispatch]);

  const { filieres, loading, error } = useSelector((state) => {
    console.log("Current state:", state);
    return state.filieres;
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {filieres.map((filiere) => (
        <div key={filiere.$id}>{filiere.nom}</div>
      ))}
      <div className="text-center text-3xl">
        <h1>Exemple d&apos;utilisation</h1>
      </div>
      <div className="flex">
        <div className="m-2 flex flex-col gap-2 w-96">
          <div className="text-xl ">Ajouter un utilisateur :</div>
          <input
            type="text "
            className="rounded-sm text-black bg-gray-200 p-2"
            placeholder="nom"
            value={nom}
            onChange={setNom}
          ></input>
          <input
            type="text "
            className="rounded-sm text-black bg-gray-200 p-2"
            placeholder="matricule"
            value={matricule}
            onChange={setMatricule}
          ></input>
          <input
            type="text "
            className="rounded-sm text-black bg-gray-200 p-2"
            placeholder="email"
            value={email}
            onChange={setEmail}
          ></input>
          <input
            type="text "
            className="rounded-sm text-black bg-gray-200 p-2"
            placeholder="numero"
            value={numero}
            onChange={setNumero}
          ></input>
          <input
            type="number "
            className="rounded-sm text-black bg-gray-200 p-2"
            placeholder="niveau"
            value={niveau}
            onChange={setNiveau}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default Main;
