import { createAsyncThunk } from "@reduxjs/toolkit";
import { database, appwriteConfig } from "../../appwrite/base";
import { Query } from "appwrite";

/**
 * Fonction pour vérifier un code et en générer un nouveau
 */
export const verifyAndGenerateCode = createAsyncThunk(
  "code/verifyAndGenerate",
  async (inputCode, { rejectWithValue }) => {
    try {
      // Récupérer le dernier code valide
      const documents = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.codeCollectionId,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(1)
        ]
      );

      if (documents.documents.length === 0) {
        throw new Error('Aucun code trouvé dans la base de données');
      }

      const lastCode = documents.documents[0].code;

      // Vérifier si le code fourni correspond au dernier code
      if (inputCode !== lastCode) {
        throw new Error('Code invalide');
      }

      // Générer le nouveau code
      const nextCode = generateNextCode(parseInt(lastCode));

      // Sauvegarder le nouveau code
      await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.codeCollectionId,
        'unique()',
        {
          code: nextCode.toString().padStart(4, '0')
        }
      );

      return {
        newCode: nextCode.toString().padStart(4, '0')
      };

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

function generateNextCode(lastCode) {
  const SECRET_KEY = 17;
  const MULTIPLIER = 13;
  const MOD = 10000;
  
  if (!lastCode) {
    return 1210;
  }

  let nextCode = ((lastCode * MULTIPLIER + SECRET_KEY) % MOD);
  
  if (nextCode < 1000) {
    nextCode += 1000;
  }
  
  return nextCode;
} 