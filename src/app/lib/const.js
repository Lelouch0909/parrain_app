/**
 * Enumération des types de compte.
 * Représente les différents types de comptes possibles pour un étudiant.
 * @readonly
 * @enum {string}
 */
export const TypeCompte = Object.freeze( {
  FILLEUL: "filleul", // Compte filleul
  PARRAIN: "parrain", // Compte parrain
});


export class Filiere {
  /**
   * Crée une instance de Filiere.
   * @param {string} nom - Le nom de la filière.
   */
  constructor(nom) {
    this.nom = nom;
  }
}

export class Etudiant {
  /**
   * Crée une instance de Etudiant.
   * @param {string} nom - Le nom complet de l'étudiant.
   * @param {string} type - Le type de compte (doit être une valeur de TypeCompte).
   * @param {Filiere} filiere - La filière à laquelle l'étudiant est rattaché.
   * @param {string} matricule - Le matricule unique de l'étudiant.
   * @param {number} numero - Le numéro de contact de l'étudiant.
   * @param {string} email - L'adresse email de l'étudiant.
   * @param {integer} niveau - Le niveau de l'étudiant.
   * @throws {Error} Si le type du compte est invalide.
   * @throws {Error} Si la filière n'est pas une instance de Filiere.
   */
  constructor(nom,  filiere, matricule, numero, email , niveau, motdepasse = null) {
  

    if (!(filiere instanceof Filiere)) {
      throw new Error(
        "La filière doit être une instance de la classe Filiere."
      );
    }
    if (niveau === undefined || niveau === null || niveau < 1 || niveau >= 6) {
      throw new Error("Le niveau de l'étudiant est invalide.");
    }
    if (this.niveau === 2 || this.niveau === 4) {
      this.type_compte = TypeCompte.PARRAIN;
    } else {
      this.type_compte = TypeCompte.FILLEUL;
    }
    this.nom = nom; 
    this.filiereId = filiereId; 
    this.email = email;
    this.type_compte = type_compte;
    this.matricule = matricule;
    this.numero = numero;
    this.niveau = niveau
    this.motdepasse = motdepasse
  }

  get nom() {
    return this.nom;
  }

  get type_compte() {
    return this.type_compte;
  }

  get filiere() {
    return this.filiere;
  }

  get matricule() {
    return this.matricule;
  }

  get numero() {
    return this.numero;
  }

  get email() {
    return this.email;
  }

  get description() {
    return `${this.nom} (${this.type_compte}), matricule ${this.matricule}, email: ${this.email}`;
  }
  get motdepasse(){
    return this.motdepasse
  }
}
