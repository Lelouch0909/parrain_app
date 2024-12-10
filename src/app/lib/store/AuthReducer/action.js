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
      
      return new Etudiant(
        currentUser.nom,
        currentUser.filiere,
        currentUser.matricule,
        currentUser.numero,
        currentUser.email,
        currentUser.niveau,
        null,
        currentUser.photo_id
      );
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Création d'étudiant
export const createEtudiant = createAsyncThunk(
  "auth/createUser",
  async (user, { rejectWithValue }) => {
    try {
      if (!(user instanceof Etudiant)) {
        throw new Error("user is not an instance of Etudiant");
      }

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

      return new Etudiant(
        newUser.nom,
        newUser.filiere,
        newUser.matricule,
        newUser.numero,
        newUser.email,
        newUser.niveau,
        null,
        userData.photo_id
      );
    } catch (error) {
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
      
      return new Etudiant(
        userData.nom,
        userData.filiere,
        userData.matricule,
        userData.numero,
        userData.email,
        userData.niveau,
        null,
        userData.photo_id
      );
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