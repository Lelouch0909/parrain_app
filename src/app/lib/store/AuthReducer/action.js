import { createAsyncThunk } from "@reduxjs/toolkit";
import { database, account, storage, appwriteConfig } from "../../appwrite/base";
import { ID, Query } from "appwrite";
import { Etudiant } from "../../const";

// Connexion
export const connection = createAsyncThunk(
  "auth/connection",
  async ({ login, password }, { rejectWithValue }) => {
    try {
      if (!login || !password) {
        throw new Error("login ou mot de passe manquant");
      }

      await account.createEmailPasswordSession(login, password);
      const currentUser = await getCurrentUser();
      
      return {
        nom: currentUser.nom,
        filiere: currentUser.filiere,
        matricule: currentUser.matricule,
        numero: currentUser.numero,
        email: currentUser.email,
        niveau: currentUser.niveau,
        photo_id: currentUser.photo_id,
      };
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.message);
    }
  }
);

// Création d'étudiant
export const createEtudiant = createAsyncThunk(
  "auth/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("creation de l'etudiant");
      
      const user = new Etudiant(
        userData.nom,
        userData.filiereId,
        userData.matricule,
        userData.numero,
        userData.email,
        userData.niveau,
        userData.motdepasse,
        userData.photo,
        userData.type_compte
      );

      const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.motdepasse,
        user.nom
      );

      if (!newAccount) throw Error;

      let photoId = null;
      if (user.photo) {
        const uploadResponse = await storage.createFile(
          appwriteConfig.storageId,
          ID.unique(),
          user.photo
        );
        photoId = uploadResponse.$id;
      }

      const newUser = await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.etudiantCollectionId,
        ID.unique(),
        {
          nom: user.nom,
          accountId: newAccount.$id,
          matricule: user.matricule,
          email: user.email,
          photo_id: photoId,
          type_compte: user.type_compte,
          numero: user.numero,
          filiere: user.filiereId,
          niveau: user.niveau
        }
      );

      // Retourner un objet simple au lieu d'une instance de classe
      return {
        nom: newUser.nom,
        filiere: newUser.filiere,
        matricule: newUser.matricule,
        numero: newUser.numero,
        email: newUser.email,
        niveau: newUser.niveau,
        photo_id: newUser.photo_id,
        type_compte: newUser.type_compte
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

// Récupérer le compte actuel
export const getAccount = createAsyncThunk(
  "auth/getAccount",
  async (_, { rejectWithValue }) => {
    try {
      const currentAccount = await account.get();
      return currentAccount;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Récupérer l'utilisateur actuel
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const currentAccount = await account.get();
      
      if (!currentAccount) throw new Error("Aucun compte connecté");

      const response = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.etudiantCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );

      if (!response.documents.length) throw new Error("Utilisateur non trouvé");

      const userData = response.documents[0];
      
      return {
        nom: userData.nom,
        filiere: userData.filiere,
        matricule: userData.matricule,
        numero: userData.numero,
        email: userData.email,
        niveau: userData.niveau,
        photo_id: userData.photo_id,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 *  Pour uploader une photo de profil
 */
async function uploadFile(file) {
  try {
    const response = await storage.createFile(
      appwriteConfig.storageId,      // ID de votre bucket
      ID.unique(),   // Génère un ID unique pour le fichier
      file          // Le fichier à uploader
    );
    
    return response.$id;
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier:", error);
    throw error;
  }
}

// Action de déconnexion
export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await account.deleteSession('current');
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);