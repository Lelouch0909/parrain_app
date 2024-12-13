import { createAsyncThunk } from "@reduxjs/toolkit";
import { database, appwriteConfig, storage } from "../../appwrite/base";
import { Query, ID } from "appwrite";
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


      // 2. Séparer en deux tableaux (filleuls et parrains)
      const filleuls = etudiants.documents.filter(
        etudiant => etudiant.type_compte === TypeCompte.FILLEUL
      ).map(etudiant => etudiant.accountId);


      const parrains = etudiants.documents.filter(
        etudiant => etudiant.type_compte === TypeCompte.PARRAIN
      ).map(etudiant => etudiant.accountId);


      if (parrains.length === 0) {
        throw new Error("Aucun parrain disponible");
      }

      // 3. Récupérer les associations existantes pour éviter les doublons
      const existingAssociations = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.etudiants_associationCollectionId
      );


      // 4. Créer les nouvelles associations
      const newAssociations = [];
      const MAX_FILLEULS = 2; // maximum de filleuls par parrain

      // 5. Distribution des filleuls aux parrains
      let parrainIndex = 0;

      // Si nous avons des filleuls, les distribuer
      while (filleuls.length > 0) {
        // Si tous les parrains ont déjà un maximum de filleuls
        if (parrains.length > 0 && parrainIndex < parrains.length) {
          const parrainId = parrains[parrainIndex];

          // Vérifier le nombre de filleuls déjà attribués à ce parrain
          const parrainExistingFilleuls = existingAssociations.documents
            .filter(assoc => assoc.idParrain === parrainId)
            .flatMap(assoc => assoc.idFilleuls);

          const remainingFilleuls = Math.min(MAX_FILLEULS - parrainExistingFilleuls.length, filleuls.length);

          // Attribuer les filleuls à ce parrain
          if (remainingFilleuls > 0) {
            const filleulsToAssign = filleuls.splice(0, remainingFilleuls); // Prendre les filleuls à assigner

            // Créer une nouvelle association ou mettre à jour l'existante
            if (parrainExistingFilleuls.length === 0) {
              const newAssoc = await database.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.etudiants_associationCollectionId,
                ID.unique(),
                {
                  idParrain: parrainId,
                  idFilleuls: filleulsToAssign,
                  idFiliere: filiereId,
                }
              );
              newAssociations.push(newAssoc);
            } else {
              const existingAssoc = existingAssociations.documents.find(
                assoc => assoc.idParrain === parrainId
              );

              // Mettre à jour l'association existante avec les nouveaux filleuls
              await database.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.etudiants_associationCollectionId,
                existingAssoc.$id,
                {
                  idFilleuls: [...parrainExistingFilleuls, ...filleulsToAssign],
                }
              );
            }
          }

          // Passer au parrain suivant
          parrainIndex++;
        } else {
          break; // Si nous avons épuisé tous les parrains, sortir de la boucle
        }
      }

      return newAssociations;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const getAllAssociations = createAsyncThunk(
  "association/getAllAssociations",
  async (filiereId, { rejectWithValue }) => {
    try {
      // 1. Récupérer toutes les associations pour une filière
      const associations = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.etudiants_associationCollectionId,
        [Query.equal("idFiliere", filiereId), Query.limit(100)]
      );

      if (associations.documents.length === 0) {
        return []; // Return empty array instead of throwing error
      }

      // 2. Extraire les ids des parrains et des filleuls
      const parrainsIds = [...new Set(associations.documents.map(assoc => assoc.idParrain))];
      const filleulsIds = [...new Set(associations.documents.flatMap(assoc => assoc.idFilleuls))];

      // 3. Récupérer les parrains et les filleuls à partir de leurs IDs
      const [parrains, filleuls] = await Promise.all([
        database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.etudiantCollectionId,
          [
            Query.equal("accountId", parrainsIds),
            Query.equal("filiere", filiereId)
          ]
        ),
        database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.etudiantCollectionId,
          [
            Query.equal("accountId", filleulsIds),
            Query.equal("filiere", filiereId)
          ]
        )
      ]);

      // 4. Mapper les documents en une liste de tuples (parrain, filleul)
      const fullAssociations = associations.documents
        .flatMap(assoc => {
          const parrain = parrains.documents.find(p => p.accountId === assoc.idParrain);
          const associatedFilleuls = assoc.idFilleuls
            .map(filleulId => filleuls.documents.find(f => f.accountId === filleulId))
            .filter(Boolean); // Supprimer les éléments qui n'ont pas été trouvés

          if (!parrain) return []; // Si aucun parrain trouvé, ignorer cette association

          // Créer un tableau de tuples (parrain, filleul) pour chaque filleul
          return associatedFilleuls.map(filleul => ({
            parrain: {
              nom: parrain.nom,
              filiere: parrain.filiere.nom,
              matricule: parrain.matricule,
              numero: parrain.numero,
              email: parrain.email,
              niveau: parrain.niveau,
              photo_id: storage.getFileView(appwriteConfig.storageId, parrain.photo_id),  // 'null' n'est pas nécessaire ici
            },
            filleul: {
              nom: filleul.nom,
              filiere: filleul.filiere,
              matricule: filleul.matricule,
              numero: filleul.numero,
              email: filleul.email,
              niveau: filleul.niveau,
              photo_id: storage.getFileView(appwriteConfig.storageId, filleul.photo_id),  // 'null' n'est pas nécessaire ici
            },
            idFiliere: filiereId
          }));

        });
      return fullAssociations;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

