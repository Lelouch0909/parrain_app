import { createAsyncThunk } from "@reduxjs/toolkit";
import { database,  appwriteConfig } from "../../appwrite/base";
import { Client, ID, Query } from "appwrite";
import {  Filiere } from "../../const";

const client = new Client();

client.setEndpoint(appwriteConfig.endpoint)
.setProject(appwriteConfig.projectId)
.set
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
      console.log(filieres);
      
      return filieres;
    } catch (error) {
      
      console.log(error);
      return error.message;
    }
  }
);
