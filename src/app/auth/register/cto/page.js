"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createEtudiant } from "@/app/lib/store/AuthReducer/action";
import { Etudiant } from "@/app/lib/const";
import { useDispatch, useSelector } from "react-redux";
import { getFilieres, addFiliere } from "@/app/lib/store/FiliereReducer/action";
import { createFiliere } from "@/app/lib/store/FiliereReducer/action";
import "../style.css";

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

        const VALID_CODE = "12345"; // Remplacez par votre code secret

        if (secretCode === VALID_CODE) {
            setStep(2); // Passer à l'étape 2
        } else {
            setAttempts((prev) => prev + 1);

            if (attempts + 1 >= 3) {
                // Redirection après trois échecs
                router.push("/");
            } else {
                alert("Code incorrect. Veuillez réessayer.");
            }
        }
    };

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

        const etudiant = new Etudiant(
            formData.name,
            filieres.find((f) => f.$id === newFiliere)?.nom_filiere || "",
            formData.matricule,
            formData.numero,
            formData.email,
            formData.niveau,
            formData.password,
            formData.photo
        );

        dispatch(createEtudiant(etudiant));
        router.push("../../dashboard");
    };

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
                            <label className="block text-sm mb-2">Filières existantes</label>
                            <ul className="text-gray-200">
                                {filieres?.map((filiere) => (
                                    <li key={filiere.$id}>{filiere.nom_filiere}</li>
                                ))}
                            </ul>
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
