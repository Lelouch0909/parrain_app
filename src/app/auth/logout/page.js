"use client";

import { account } from "../../lib/appwrite/base";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function logout() {
            try {
                // Supprime la session courante
                await account.deleteSession("current");
                // Supprimer le cookie auth-storage
                document.cookie = "auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                // Redirige vers la page de connexion
                router.push("auth/signin");
            } catch (error) {
                console.error("Erreur lors de la déconnexion :", error);
                setErrorMessage("Impossible de vous déconnecter pour le moment. Veuillez réessayer.");
                setTimeout(() => {
                    router.push("/login");
                }, 3000); // Redirection après 3 secondes
            } finally {
                setLoading(false);
            }
        }
        logout();
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            {loading ? (
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-600">Déconnexion en cours...</p>
                    {/* Optionnel : Spinner */}
                    <div className="w-8 h-8 mt-4 border-4 border-t-emerald-500 border-gray-300 rounded-full animate-spin"></div>
                </div>
            ) : errorMessage ? (
                <div className="text-center">
                    <p className="text-lg font-semibold text-red-500">{errorMessage}</p>
                </div>
            ) : null}
        </div>
    );
}
