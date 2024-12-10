import { createAsyncThunk } from "@reduxjs/toolkit";
import { database, appwriteConfig } from "../../appwrite/base";
import { Query } from "appwrite";
import { Etudiant, TypeCompte } from "../../const";
import { getAccount, getCurrentUser } from "../AuthReducer/action";

/**
 * Récupère les associations selon le type de compte de l'utilisateur courant
 * retourne soit les filleuls soit les parrains de l utilisateur courant
 */
export const getAssociations = createAsyncThunk(
  "association/getAssociations",
  async (_, { rejectWithValue }) => {
    try {
      const currentAccount = await account.get();
      if (!currentAccount) {
        throw new Error("Aucun utilisateur connecté");
      }

     
    

      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error("Utilisateur non trouvé");
      }
      let associations;
      
      if (currentUser.type_compte === TypeCompte.PARRAIN) {
        associations = await database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.etudiants_associationCollectionId,
          [
            Query.equal("idParrain", currentUser.$id)
          ]
        );

        const filleulsIds = associations.documents.flatMap(
          assoc => assoc.idFilleuls
        );

        const filleuls = await database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.etudiantCollectionId,
          [
            Query.equal("accountId", [...filleulsIds])
          ]
        );

        return filleuls.documents.map(filleul => 
          new Etudiant(
            filleul.nom,
            filleul.filiere,
            filleul.matricule,
            filleul.numero,
            filleul.email,
            filleul.niveau,
            null,
            filleul.photo_id
          )
        );

      } else {
        associations = await database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.etudiants_associationCollectionId,
          [
            Query.contains("idFilleuls", [currentUser.$id])
          ]
        );

        if (!associations.documents.length) {
          return [];
        }

        const parrainsIds = associations.documents.map(
          assoc => assoc.idParrain
        );

        const parrains = await database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.etudiantCollectionId,
          [
            Query.equal("accountId", [...parrainsIds])
          ]
        );

        return parrains.documents.map(parrain => 
          new Etudiant(
            parrain.nom,
            parrain.filiere,
            parrain.matricule,
            parrain.numero,
            parrain.email,
            parrain.niveau,
            null,
            parrain.photo_id
          )
        );
      }

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 *  Pour lancer un parainage
 */
export const createAssociationsForFiliere = createAsyncThunk(
  "association/createAssociationsForFiliere",
  async (filiereId, { rejectWithValue }) => {
    try {
      // 1. Récupérer tous les étudiants de la filière
      const etudiants = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.etudiantCollectionId,
        [Query.equal("filiere", filiereId)]
      );
  
      // 2. Séparer en deux tableaux
      const filleuls = etudiants.documents.filter(
        etudiant => etudiant.type_compte === TypeCompte.FILLEUL
      ).map(etudiant => etudiant.accountId);
  
      const parrains = etudiants.documents.filter(
        etudiant => etudiant.type_compte === TypeCompte.PARRAIN
      ).map(etudiant => etudiant.accountId);
  
      // 3. Récupérer les associations existantes pour éviter les doublons
      const existingAssociations = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.etudiants_associationCollectionId
      );
  
      // 4. Créer les nouvelles associations
      const newAssociations = [];
      const MAX_FILLEULS = 2;
      
      // Premier tour : donner 1 filleul à chaque parrain
      for (const parrainId of parrains) {
        const parrainExistingFilleuls = existingAssociations.documents
          .filter(assoc => assoc.idParrain === parrainId)
          .flatMap(assoc => assoc.idFilleuls);

        // Si le parrain n'a pas encore de filleul
        if (parrainExistingFilleuls.length === 0 && filleuls.length > 0) {
          const filleulToAssign = filleuls.shift(); // Prendre le premier filleul disponible
          
          const newAssoc = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.etudiants_associationCollectionId,
            ID.unique(),
            {
              idParrain: parrainId,
              idFilleuls: [filleulToAssign]
            }
          );
          
          newAssociations.push(newAssoc);
        }
      }

      // Deuxième tour : ajouter un second filleul si possible
      if (filleuls.length > 0) {
        for (const parrainId of parrains) {
          const parrainExistingFilleuls = existingAssociations.documents
            .filter(assoc => assoc.idParrain === parrainId)
            .flatMap(assoc => assoc.idFilleuls);

          // Si le parrain a exactement 1 filleul et qu'il reste des filleuls à assigner
          if (parrainExistingFilleuls.length === 1 && filleuls.length > 0) {
            const filleulToAssign = filleuls.shift();
            
            // Mettre à jour l'association existante
            const existingAssoc = existingAssociations.documents.find(
              assoc => assoc.idParrain === parrainId
            );
            
            await database.updateDocument(
              appwriteConfig.databaseId,
              appwriteConfig.etudiants_associationCollectionId,
              existingAssoc.$id,
              {
                idFilleuls: [...parrainExistingFilleuls, filleulToAssign]
              }
            );
          }
        }
      }

      return newAssociations;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);