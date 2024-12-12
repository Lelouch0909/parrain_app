/**
 * Enumération des types de compte.
 * Représente les différents types de comptes possibles pour un étudiant.
 * @readonly
 * @enum {string}
 */
export const TypeCompte = Object.freeze({
  FILLEUL: "filleul", // Compte filleul
  PARRAIN: "parrain", // Compte parrain
});

export class Etudiant {
  /**
   * Crée une instance de Etudiant.
   * @param {string} nom - Le nom complet de l'étudiant.
   * @param {string} type - Le type de compte (doit être une valeur de TypeCompte).
   * @param {string} filiereId - L'identifiant de la filière à laquelle l'étudiant est rattaché.
   * @param {string} matricule - Le matricule unique de l'étudiant.
   * @param {string} numero - Le numéro de contact de l'étudiant.
   * @param {string} email - L'adresse email de l'étudiant.
   * @param {string} niveau - Le niveau de l'étudiant.
   * @throws {Error} Si le type du compte est invalide.
   * @throws {Error} Si la filière n'est pas une instance de Filiere.
   */
  constructor(
    nom,
    filiereId,
    matricule,
    numero,
    email,
    niveau,
    motdepasse = null,
    photo = null,
    cto = false,
  ) {
    // On définit type_compte après avoir défini this.niveau
    if (!(parseInt(niveau) > 0 && parseInt(niveau) < 5)) {
      throw new Error("Le niveau de l'étudiant est invalide.");
    }
    this.nom = nom;
    this.filiereId = filiereId;
    this.email = email;
    this.matricule = matricule;

    this.numero = numero;
    this.niveau = niveau;
    this.motdepasse = motdepasse;
    this.photo = photo;
    this.cto = cto

    if (niveau === "2" || niveau === "4") {
      this.type_compte = TypeCompte.PARRAIN;
    } else {
      this.type_compte = TypeCompte.FILLEUL;
    }
  }

  get details() {
    return {
      nom: this.nom,
      type_compte: this.type_compte,
      filiereId: this.filiereId,
      matricule: this.matricule,
      numero: this.numero,
      email: this.email,
      motdepasse: this.motdepasse,
      niveau: this.niveau,
      photo: this.photo,
      cto: this.cto
    };
  }
}
