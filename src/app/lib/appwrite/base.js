
/*
    Il s'agit des parametres de bases des fonctionnalités de Appwrite
*/

import { Account, Client, Databases } from "appwrite";

export const appwriteConfig = {
  projectId: "6754bbee0024c8445620",
  endpoint: "https://cloud.appwrite.io/v1",
  databaseId: "675502f900388f3fde54",
  etudiantCollectionId: "675504d40004eb0fb1e3", // Il s agit de l identifiant de la collection des etudiants
  filiereCollectionId: "6755031b003dfd9122a2", // Il s agit de l identifiant de la collection des filieres
  etudiants_associationCollectionId: "675507b60020bc4073b7", // Il s agit de l identifiant de la collection des etudiants_association qui represente une table d association entre les etudiants et les associations entre les parains etudiants et mes filleuls etudiants
  databaseApiKey : "standard_cad4e7daa5210f5b8a390883dff13efea7a916b0dfc232f633d8fcbf41023859fa52c8aca0d27ba993be16f5e4e0415eaa0472fbf55c083cc9995800da20303a1af28340f211823812c2c4c465fec7e328c48ba1af6ce894719702bc36e4862881e775f96d74f9796dcd33bc178e1e7bc40bf3a1e984c6e940b133d16ae5061c"
};

const client = new Client();
client.setProject("6754bbee0024c8445620");
const database = new Databases(client);
client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);
const account = new Account(client);

export { database, account , client};
