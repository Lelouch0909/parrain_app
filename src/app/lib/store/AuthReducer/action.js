import { createAsyncThunk } from "@reduxjs/toolkit";
import { database, account, client } from "../../appwrite/base";
import { ID } from "appwrite";


export const createUser = createAsyncThunk(
  "auth/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const newAccount = await account.create(
        ID.unique(),
        userData.email,
        userData.motdepasse,
        userData.nom
      );
      if (!newAccount) {
        throw Error;
      }
      const newUser = await database.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
          username: userData.nom,
          accountId: newAccount.$id,
          matricule: userData.matricule,
          email: userData.email,
          photo_chemin: userData.photo_chemin,
          type_compte: userData.type_compte,
          numero: userData.numero,
          filiere: userData.filiere,
        }
      );
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
