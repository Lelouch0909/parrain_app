// middleware/authMiddleware.js
const authMiddleware = (store) => (next) => (action) => {
    const state = store.getState();
  
    if (action.type === "GET_CURRENT_USER" && state.auth.user) {
      console.log("Utilisateur déjà récupéré, action ignorée.");
      return; // Ignorer l'action si les données existent déjà
    }
  
    if (action.type === "GET_ACCOUNT" && state.auth.account) {
      console.log("Compte déjà récupéré, action ignorée.");
      return; // Ignorer l'action si les données existent déjà
    }
  
    // Passer l'action au prochain middleware ou au reducer
    return next(action);
  };
  
  export default authMiddleware;
  