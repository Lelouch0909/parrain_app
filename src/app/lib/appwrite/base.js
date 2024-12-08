
/*
    Il s'agit des parametres de bases des fonctionnalités de Appwrite
*/

import { Account, Client, Databases } from "appwrite";

export const config = {
  projectId: "6754bbee0024c8445620",
  endpoint: "https://cloud.appwrite.io/v1",
  databaseId: "675502f900388f3fde54",
  etudiantCollectionId: "675504d40004eb0fb1e3", // Il s agit de l identifiant de la collection des etudiants
  filiereCollectionId: "6755031b003dfd9122a2", // Il s agit de l identifiant de la collection des filieres
  etudiants_associationCollectionId: "675507b60020bc4073b7", // Il s agit de l identifiant de la collection des etudiants_association qui represente une table d association entre les etudiants et les associations entre les parains etudiants et mes filleuls etudiants
};

const client = new Client();
client.setProject("6754bbee0024c8445620");
const database = new Databases(client);
client.setEndpoint(config.endpoint).setProject(config.projectId);
const account = new Account(client);

export { database, account , client};
