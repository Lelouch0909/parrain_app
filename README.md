# Documentation des Actions et Reducers

## Auth Reducer

Le Auth Reducer gère l'authentification et les opérations liées aux utilisateurs.

### État Initial
```javascript
{
  user: null,      // Instance de la classe Etudiant
  account: null,   // Compte Appwrite
  error: null,     // Message d'erreur
  loading: false   // État de chargement
}
```

### Actions Disponibles

#### 1. Connexion
```javascript
import { connection } from "./lib/store/AuthReducer/action";

// Utilisation
dispatch(connection({ login: "email@example.com", password: "motdepasse" }));
```

#### 2. Création d'un Étudiant
```javascript
import { createEtudiant } from "./lib/store/AuthReducer/action";
import { Etudiant } from "./lib/const";

// Créer une instance d'Etudiant
const etudiant = new Etudiant(
  nom,            // string
  filiereId,      // string
  matricule,      // string
  numero,         // number (9 chiffres)
  email,          // string
  niveau,         // number (1-5)
  motdepasse,     // string
  photo           // File (optionnel)
);

// Utilisation
dispatch(createEtudiant(etudiant));
```

#### 3. Récupérer le Compte Actuel
```javascript
import { getAccount } from "./lib/store/AuthReducer/action";

// Utilisation
dispatch(getAccount());
```

#### 4. Récupérer l'Utilisateur Actuel
```javascript
import { getCurrentUser } from "./lib/store/AuthReducer/action";

// Utilisation
dispatch(getCurrentUser());
```

### Accéder aux États

```javascript
import { useSelector } from "react-redux";

// Récupérer tous les états
const { user, account, loading, error } = useSelector((state) => state.auth);

// Ou individuellement
const user = useSelector((state) => state.auth.user);
const loading = useSelector((state) => state.auth.loading);
const error = useSelector((state) => state.auth.error);
const account = useSelector((state) => state.auth.account);
```

### Gestion des Erreurs

Chaque action peut retourner une erreur qui sera stockée dans `state.auth.error`. Il est recommandé de vérifier cet état après chaque action :

```javascript
if (error) {
  console.error(error);
  // Gérer l'erreur
}
```

### États de Chargement

L'état `loading` est automatiquement géré pour chaque action :
- `true` pendant l'exécution de l'action
- `false` une fois l'action terminée (succès ou échec)

```javascript
if (loading) {
  // Afficher un indicateur de chargement
}
```

### Exemple d'Utilisation Complète

```javascript
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connection } from './lib/store/AuthReducer/action';

function LoginComponent() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (email, password) => {
    await dispatch(connection({ login: email, password }));
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (user) return <div>Connecté en tant que {user.nom}</div>;

  return (
    // Votre formulaire de connexion
  );
}
```

## Association Reducer

Le Association Reducer gère les relations entre parrains et filleuls.

### État Initial
```javascript
{
  filleul: [],     // Liste des filleuls pour un parrain
  parrain: null,   // Parrain assigné pour un filleul
  error: "",       // Message d'erreur
  loading: false   // État de chargement
}
```

### Actions Disponibles

#### 1. Récupérer les Associations
```javascript
import { getAssociations } from "./lib/store/AssociationReducer/action";

// Utilisation
dispatch(getAssociations());
// Retourne soit les filleuls (si l'utilisateur est un parrain)
// soit le parrain (si l'utilisateur est un filleul)
```

#### 2. Créer des Associations pour une Filière
```javascript
import { createAssociationsForFiliere } from "./lib/store/AssociationReducer/action";

// Utilisation
dispatch(createAssociationsForFiliere(filiereId));
```

### Accéder aux États

```javascript
import { useSelector } from "react-redux";

// Récupérer tous les états
const { filleul, parrain, loading, error } = useSelector((state) => state.associations);

// Ou individuellement
const filleul = useSelector((state) => state.associations.filleul);
const parrain = useSelector((state) => state.associations.parrain);
```

## Filiere Reducer

Le Filiere Reducer gère les opérations liées aux filières.

### Actions Disponibles

#### 1. Récupérer les Filières
```javascript
import { getFilieres } from "./lib/store/FiliereReducer/action";

// Utilisation
dispatch(getFilieres());
```

#### 2. Créer une Nouvelle Filière
```javascript
import { createFiliere } from "./lib/store/FiliereReducer/action";

// Utilisation
dispatch(createFiliere({
  nom: "Nom de la filière",
  description: "Description de la filière", // optionnel
  niveau: ["L1", "L2", "L3"]               // optionnel
}));
```

### Règles d'Association

Les associations entre parrains et filleuls suivent ces règles :
- Un parrain peut avoir maximum 2 filleuls
- Un second filleul n'est attribué à un parrain que si tous les autres parrains ont déjà au moins un filleul
- Les associations se font uniquement entre étudiants de la même filière

### Gestion des Erreurs et Chargement

Comme pour le Auth Reducer, chaque action gère automatiquement :
- L'état de chargement via `loading`
- Les erreurs via `error`

```javascript
const { loading, error } = useSelector((state) => state.associations);

if (loading) {
  // Afficher un indicateur de chargement
}

if (error) {
  // Gérer l'erreur
  console.error(error);
}
```
