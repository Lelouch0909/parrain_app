
// Cette fonction sera déployée sur Appwrite
s = async function(req, res) {
  // Configuration de base

  async function getLastCode() {
    try {
      // Récupérer le dernier code enregistré
      const documents = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(1)
        ]
      );

      if (documents.documents.length > 0) {
        return parseInt(documents.documents[0].code);
      }
      return null; // Aucun code trouvé
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier code:', error);
      throw error;
    }
  }

  async function saveNewCode(code) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        'unique()',
        {
          code: code.toString().padStart(4, '0')
        }
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du nouveau code:', error);
      throw error;
    }
  }

  try {
    // Récupérer le dernier code généré
    let lastCode = await getLastCode();
    
    // Générer le prochain code
    const nextCode = generateNextCode(lastCode);
    
    // Sauvegarder le nouveau code
    await saveNewCode(nextCode);

    // Retourner le code
    return res.json({
      code: nextCode.toString().padStart(4, '0')
    });
    
  } catch (error) {
    return res.json({
      error: 'Erreur lors de la génération du code'
    }, 500);
  }
};

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
