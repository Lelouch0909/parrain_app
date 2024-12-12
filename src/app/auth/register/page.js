"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createEtudiant } from "../../lib/store/AuthReducer/action";
import { Etudiant } from "../../lib/const";
import { useDispatch, useSelector } from "react-redux";
import { getFilieres } from "../../lib/store/FiliereReducer/action";
import "./style.css";

export default function Register() {
  const router = useRouter();
  const { account } = useSelector((state) => state.auth);
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [filiere, setFiliere] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    matricule: "",
    numero: "",
    filiereId: "",
    niveau: "",
    photo: null,
  });

  const [isParamsPresent, setIsParamsPresent] = useState(false);

  const dispatch = useDispatch();
  const filieres = useSelector((state) => state.filieres.filieres);

  useEffect(() => {
    // Lire les paramètres de l'URL
    const filiereId = searchParams.get("filiereId");
    const niveau = searchParams.get("niveau");

    if (filiereId && niveau) {
      setIsParamsPresent(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        filiereId,
        niveau,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    // Charger la liste des filières
    dispatch(getFilieres());
  }, [dispatch]);
  useEffect(() => {
    if (account) {
      console.log(account);
      
      router.push("../dashboard");
    }
  }, [account, router]);

  useEffect(() => {
      console.log(account);
   
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Register:", formData);

    // Si aucun paramètre dans l'URL, générer un lien
    if (!isParamsPresent) {
      const generatedLink = `/register?filiereId=${formData.filiereId}&niveau=${formData.niveau}`;
      console.log("Generated Link:", generatedLink);

      const etudiant = new Etudiant(
        formData.name,
        filiere,
        formData.matricule,
        formData.numero,
        formData.email,
        formData.niveau,
        formData.password,
        formData.photo
      );
      dispatch(createEtudiant(etudiant))
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Parrainage</h1>
        <p className="text-gray-400">Create your account to get started.</p>
      </div>

      <div className="bg-[#002633] rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Matricule */}
          <div>
            <label className="block text-sm mb-2">Matricule</label>
            <input
              type="text"
              value={formData.matricule}
              onChange={(e) =>
                setFormData({ ...formData, matricule: e.target.value })
              }
              className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Numero */}
          <div>
            <label className="block text-sm mb-2">Phone Number</label>
            <input
              type="text"
              value={formData.numero}
              onChange={(e) =>
                setFormData({ ...formData, numero: e.target.value })
              }
              className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Filiere et Niveau (affichés uniquement si aucun paramètre dans l'URL) */}
          {!isParamsPresent && (
            <>
              <div>
                <label className="block text-sm mb-2">Filiere</label>
                <select
                  value={formData.filiereId}
                  onChange={(e) => {
                    setFormData({ ...formData, filiereId: e.target.value });

                    setFiliere(e.target.value);
                  }}
                  className="w-full p-3 rounded bg-[#001219] border border-gray-700 
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                    text-gray-200"
                  required
                >
                  <option value="" className="text-gray-400">
                    Sélectionnez une filière
                  </option>
                  {filieres ? filieres.map((filiere) => (
                    <option key={filiere.$id} value={filiere.$id}>
                      {filiere.nom_filiere}
                    </option>
                  )) : ''}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Niveau</label>
                <input
                  type="number"
                  value={formData.niveau}
                  onChange={(e) =>
                    setFormData({ ...formData, niveau: e.target.value })
                  }
                  className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm mb-2">Photo</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition duration-200"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
