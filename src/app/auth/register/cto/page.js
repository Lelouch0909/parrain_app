"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import "../style.css";
import { createFiliere, getFilieres } from "../../../lib/store/FiliereReducer/action";
import { Etudiant } from "../../../lib/const";
import { verifyAndGenerateCode } from "../../../lib/store/CodeReducer/action";
import { createEtudiant } from "../../../lib/store/AuthReducer/action";

export default function Register() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const filieres = useSelector((state) => state.filieres.filieres);
    const [showPassword, setShowPassword] = useState(false);

    const [step, setStep] = useState(1); // Étape actuelle (1 = code secret, 2 = ajout de filière, 3 = formulaire personnel)
    const [attempts, setAttempts] = useState(0); // Compteur d'échecs
    const [secretCode, setSecretCode] = useState(""); // Code secret saisi par l'utilisateur

    const [newFiliere, setNewFiliere] = useState(""); // Nouvelle filière à ajouter
    const {success,loading,error} = useSelector((state) => state.code)
    const {user,loading:authLoading} = useSelector((state) => state.auth)
    useEffect(() => {
        if (user) {
            router.push("../../dashboard/admin");
        }
    }, [router, user]);
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

    useEffect(() => {
        // Charger la liste des filières
        dispatch(getFilieres());

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
    }, [dispatch, searchParams]);

    const handleCodeSubmit = (e) => {
        e.preventDefault();
        dispatch(verifyAndGenerateCode(secretCode))

       
    };

    useEffect(() => {
        if (success) {
            setStep(2);
        }
        if (error) {
            alert("code incorrect contactez l'admin");
        }
    }, [success, error]);

    const handleFiliereSubmit = (e) => {
        e.preventDefault();

        if (newFiliere.trim() === "") {
            alert("Veuillez entrer une nouvelle filière.");
            return;
        }
        console.log(newFiliere);
        // Ajouter la nouvelle filière
        dispatch(createFiliere(newFiliere));
        setStep(3); // Passer à l'étape 3
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const etudiant = {
            nom: formData.name,
            filiereId: filieres.find((f) => f.$id === newFiliere)?.nom_filiere || "",
            matricule: formData.matricule,
            numero: formData.numero,
            email: formData.email,
            niveau: formData.niveau,
            motdepasse: formData.password,
            photo: formData.photo,
            type_compte: true,
        };

        dispatch(createEtudiant(etudiant));
    };

    // Ajout du loader pendant la création
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    if (step === 1) {
        return (
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Parrainage</h1>
                    <p className="text-gray-400">Veuillez entrer le code secret pour continuer.</p>
                </div>

                <div className="bg-[#002633] rounded-lg p-8">
                    <form onSubmit={handleCodeSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm mb-2">Code secret</label>
                            <input
                                type="password"
                                value={secretCode}
                                onChange={(e) => setSecretCode(e.target.value)}
                                className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition duration-200"
                        >
                            Valider
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Parrainage</h1>
                    <p className="text-gray-400">Ajouter une nouvelle filière.</p>
                </div>

                <div className="bg-[#002633] rounded-lg p-8">
                    <form onSubmit={handleFiliereSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm mb-4 text-gray-300 font-medium">Filières existantes</label>
                            <div className="bg-[#001219] rounded-lg p-4 mb-6">
                                {filieres?.length > 0 ? (
                                    <ul className="divide-y divide-gray-700">
                                        {filieres.map((filiere) => (
                                            <li 
                                                key={filiere.$id}
                                                className="py-3 px-2 flex items-center space-x-3 hover:bg-[#001824] rounded transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-medium">
                                                        {filiere.nom_filiere.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-gray-200">{filiere.nom_filiere}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 text-center py-2">Aucune filière existante</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Nouvelle filière</label>
                            <input
                                type="text"
                                value={newFiliere}
                                onChange={(e) => setNewFiliere(e.target.value)}
                                className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition duration-200"
                        >
                            Ajouter et continuer
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (step === 3) {
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

                        <div>
                            <label className="block text-sm mb-2">Niveau</label>
                            <input
                                type="number"
                                value={formData.niveau}
                                onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                                className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>


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

    return null;
}
