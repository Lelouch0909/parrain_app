"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilieres } from "../lib/store/FiliereReducer/action";
import store from "../lib/store";
import { Etudiant } from "../lib/const";
import { createEtudiant, uploadFile } from "../lib/store/AuthReducer/action";
import { storage } from "../lib/appwrite/base";

/**
 * Dans le dossier store chaque dossier est un reducer qui gere une partie de l'application
 *
 * @returns
 */
function Main() {
  const dispatch = useDispatch(); // Dispatch permet d executer mes fonctions preetablies
  const [nom, setNom] = useState("");
  /**
   * Permet de recuperer un etat preetablies par exemple ici je recuperes les filieres qui peuvent etre dans 3 etats :
   * loading : chargement
   * error : l erreur
   * filieres : le tableau de filieres
   *
   * j aurais aussi pu ecrire :
   * const {filieres}= useSelector((state) => {
   *  state;
   * })
   * et faire if (filieres.error) ...
   * if filieres.loading ...
   * if filieres.filieres ...
   *
   * ca marches pour tous les elements du store par exemple user
   *
   * Donc ici je charge mon composant etat et ensuite avec   dispatch(getFilieres())  je lance la requete pour recuperer les
   * filieres et dans le reste du code je dis if filieres ...
   */
  const { filieres, loading, error } = useSelector((state) => {
    return state.filieres;
  });
  const {
    user,
    loading: loadingUser,
    error: errorUser,
  } = useSelector((state) => {
    return state.auth;
  });
  useEffect(() => {
    dispatch(getFilieres()); // Pour recuperer les filieres. tu utiliseras toujours dispatch avec en parametre la fonction action que tu veux
  }, [dispatch]);

  const [matricule, setMatricule] = useState("");
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [niveau, setNiveau] = useState("");
  const [filiere, setFiliere] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [file,setFile] = useState(null)

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  /**
   * Creation d un nouvel etudiant en initialisant un objet de type Etudiant
   * et en envoyant les donnees avec dispatch(createEtudiant(etudiant))
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    if (nom && matricule && email && filiere && numero && niveau) {


      const etudiant = new Etudiant(
        nom,
        filiere,
        matricule,
        numero,
        email,
        niveau,
        motdepasse,
        file
      );
      dispatch(createEtudiant(etudiant));
    } else {
      alert("Veuillez remplir tous les champs");
    }
  };
 
  return (
    <div>
      <div className="text-center text-3xl">
        <h1>Exemple d&apos;utilisateur</h1>
      </div>
      <div className="flex">
        <div className="m-2 flex flex-col gap-2 w-96">
          <div className="text-xl ">Ajouter un Filleul :</div>
          <input
            type="text"
            className="rounded-sm text-black bg-gray-200 p-2"
            placeholder="Nom ex:hermann lontsi"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          ></input>
          <input
            type="text "
            className="rounded-sm text-black bg-gray-200 p-2"
            placeholder="matricul ex : 21g00200"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
          ></input>
          <input
            type="text "
            className="rounded-sm text-black bg-gray-200 p-2"
            placeholder="mot de passe ex : Azertyui1"
            value={motdepasse}
            onChange={(e) => setMotdepasse(e.target.value)}
          ></input>
          <input
            type="text "
            className="rounded-sm text-black bg-gray-200 p-2"
            placeholder="mail ex: lnhm87404@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <select
            key={filiere}
            className="rounded-sm text-black bg-gray-200 p-2"
            value={filiere}
            multiple={false}
            onChange={(e) => setFiliere(e.target.value)}
          >
            <option value="">Sélectionner une filière</option>
            {filieres ? filieres.map((filiere) => (
              <option
                className="rounded-sm text-black bg-gray-200 p-2"
                key={filiere.$id}
                value={filiere.nom_filiere}
              >
                {filiere.nom_filiere}
              </option>
            )) : ''}
          </select>
          <input
            type="text"
            className="rounded-sm text-black bg-gray-200 p-2"
            placeholder="numero ex: 678901234"
            value={numero}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setNumero(value);
              }
            }}
          />
          <input
            type="number "
            className="rounded-sm text-black bg-gray-200 p-2"
            placeholder="niveau ex: 4"
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
          ></input>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
          Votre photo
          <button
            className="bg-blue-400 p-2 active:bg-blue-500   active:scale-95   "
            onClick={handleSubmit}
          >
            Creer un utilisateur
          </button>
          <div>
            {loadingUser && <div>Loading...</div>}
            {errorUser && <div>Error: {errorUser}</div>}
            {user && <div>User: {user.nom} cree avec succes</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
