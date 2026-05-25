const fr = {
	profile: {
		//------------------ phrases ------------------
		loading: "Chargement du profil...",
		loginRequired: "Veuillez vous connecter pour voir votre profil.",
		editLoginRequired: "Veuillez vous connecter pour modifier votre profil.",
		loadingCurrentProfile: "Chargement du profil actuel...",
		saving: "Enregistrement...",
		failedToLoadProfile: "Impossible de charger le profil.",
		loadProfileError: "Une erreur est survenue pendant le chargement du profil.",
		missingUserId: "Identifiant utilisateur manquant.",
		//------------------ mots ------------------
		changeAvatar: "Changer d'avatar",
		editProfile: "Modifier le profil",
		defaultUser: "Utilisateur",
		//------- informations personnelles -------
		bio: "Bio",
		stats: "Statistiques",
		accuracy: "Précision",
		learningLevel: "Niveau d'apprentissage",
		levelPrefix: "Niveau",
		friends: "Amis",
		joined: "Inscription",
		connectedAccounts: "Comptes liés",
		notConnected: "Non lié",
		connected: "Lié",
		bindGoogle: "Lier Google",
		bindFortyTwo: "Lier 42",
		noEmail: "Aucun email",
		//------------------ profil amis ------------------
		userNotFound: "Utilisateur introuvable",
		//------------------ modification du profil ------------------
		username: "Nom d'utilisateur",
		usernamePlaceholder: "Entrez votre nom d'utilisateur",
		bioPlaceholder: "Parlez un peu de vous",
		saveChanges: "Enregistrer les modifications",
		chooseImageFile: "Veuillez choisir un fichier image.",
		readImageError: "Impossible de lire cette image.",
		failedToUpdateProfile: "Impossible de mettre à jour le profil.",
		updateProfileError: "Une erreur est survenue pendant la mise à jour du profil.",
	},

	register: {
		title: "Inscription",
		description: "Créez votre compte pour accéder à la plateforme.",
		name: "Nom",
		email: "Email",
		password: "Mot de passe",
		confirmPassword: "Confirmer le mot de passe",
		namePlaceholder: "Entrez votre nom",
		emailPlaceholder: "Entrez votre email",
		passwordPlaceholder: "Entrez votre mot de passe",
		confirmPasswordPlaceholder: "Confirmez votre mot de passe",
		passwordHint: "Le mot de passe doit contenir au moins 8 caractères.",
		submitting: "Envoi en cours...",
		createAccount: "Créer un compte",
		nameRequired: "Le nom est requis.",
		emailRequired: "L'email est requis.",
		passwordRequired: "Le mot de passe est requis.",
		passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
		passwordsDoNotMatch: "Les mots de passe ne correspondent pas.",
		success: "Compte créé avec succès. Redirection vers la connexion...",
		genericError: "Une erreur est survenue lors de l'inscription.",
		usernameOrEmailInUse: "Le nom d'utilisateur ou l'email est déjà utilisé.",
	},
	
	learningPractice: {
		//------------------ en haut à gauche ------------------
		level: "Niveau",

		//------------------ à gauche ------------------
		decodeSignal: "Decoder le signal",
		listenPrompt: "Ecoutez ou observez le signal, puis appuyez sur la touche correspondante.",
		playing: "Lecture...",
		replaySignal: "Rejouer le signal",
		encodeCharacter: "Encoder le caractere",
		encodePrompt: "Utilisez Fleche gauche pour le point et Fleche droite pour le trait. Appuyez sur Entree pour valider.",

		//------------------ en haut à droite ------------------
		correctCount: "correctes",

		//------------------ à droite ------------------
		yourAnswer: "Votre reponse",
		leftDot: "Point",
		rightDash: "Trait",
		delete: "Supprimer",
		submit: "Valider",
		pressMatching: "Appuyez sur le caractere correspondant au clavier.",
		buildMorse: "Composez le code Morse avec les fleches du clavier.",
		correct: "Correct",
		wrong: "Erreur",

		//------------------ en bas ------------------
		audio: "Son",
		light: "Lumiere",

		//------------------ resultat ------------------
		complete: "termine",

		levelPassed: "Niveau reussi",
		tryAgain: "Reessayer",

		resultSummary: "Vous avez répondu correctement à {correctCount} question(s) sur {questionCount}.",
		passConditionText: "Condition de réussite : {passCount} / {questionCount}.",

		accuracy: "Précision",
		status: "Statut",
		unlockedNext: "Niveau suivant debloque",
		needsReview: "Revision necessaire",

		practiceAgain: "Recommencer",

		signalOn: "Signal allume",
		signalSettings: "Parametres du signal",
		signalOff: "Signal eteint",

		//------------------ error ------------------
		noQuestion: "Aucune question disponible."
	},

};

export default fr;
