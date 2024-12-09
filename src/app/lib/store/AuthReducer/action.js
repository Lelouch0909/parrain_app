import { createAsyncThunk } from "@reduxjs/toolkit";
import { database, account, client, appwriteConfig } from "../../appwrite/base";
import { ID } from "appwrite";
import { Etudiant } from "../../const";

/**
 * Fonction pour la creation d un etudiant quel qu il doit
 */
export const createUser = createAsyncThunk(
  "auth/createUser",

  /**
   * @param {Etudiant} user
   * @returns {Promise<Etudiant>}
   */
  async (user, { rejectWithValue }) => {
    try {
      if (!(user instanceof Etudiant)) {
        throw new Error("user is not an instance of Etudiant");
      }
      const newAccount = await account.create(
        ID.unique(),
        user.getEmail(),
        user.getMotdepasse(),
        user.getNom()
      );
      if (!newAccount) {
        throw Error;
      }
      const newUser = await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          nom: user.getNom(),
          accountId: newAccount.$id,
          matricule: user.getMatricule(),
          email: user.email,
          photo_chemin: user.photo_chemin,
          type_compte: user.type_compte,
          numero: user.numero,
          filiere: user.filiere,
        }
      );
      console.log(newUser);

      return newUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
