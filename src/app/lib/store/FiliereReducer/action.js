import { createAsyncThunk } from "@reduxjs/toolkit";
import { database,  appwriteConfig } from "../../appwrite/base";
import { Client, ID, Query } from "appwrite";
import {  Filiere } from "../../const";


/**
 * Fonction pour la recuperation des filieres disponibles
 */
export const getFilieres = createAsyncThunk(
  "filieres/getFilieres",



  /**
   * @returns {Promise<Filiere[]>}
   */
  async ( ) => {
    try {
           
      const filieres = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.filiereCollectionId
      );
      
      return filieres;
    } catch (error) {
      
      console.log(error);
      return error.message;
    }
  }
);

/**
 * Crée une nouvelle filière si elle n'existe pas déjà
 */
export const createFiliere = createAsyncThunk(
  "filieres/createFiliere",
  async (nom_filiere, { rejectWithValue }) => {
    try {
      // Vérifier si la filière existe déjà
      const existingFilieres = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.filiereCollectionId,
        [
          Query.equal("nom_filiere", nom_filiere)
        ]
      );

      if (existingFilieres.documents.length > 0) {
        throw new Error("Cette filière existe déjà");
      }

      // Créer la nouvelle filière
      const newFiliere = await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filiereCollectionId,
        ID.unique(),
        {
          nom_filiere: nom_filiere,
        }
      );

      return newFiliere;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
