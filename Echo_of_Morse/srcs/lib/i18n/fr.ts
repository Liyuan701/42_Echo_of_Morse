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

	//=========================================== register =========================================== 
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

		showPassword: "Afficher",
		hidePassword: "Masquer",

		emailInvalid: "Format d'email invalide.",
	},

	layout: {
		//------------------ navbar ------------------
		brand: "Echos de Morse",
		dashboard: "Tableau de bord",
		profile: "Profil",
		login: "Connexion",
		logout: "Deconnexion",
		user: "Utilisateur",

		//------------------ footer ------------------
		footerDescription: "Apprenez, communiquez et relevez des defis avec le code Morse.",
		privacyPolicy: "Politique de confidentialite",
		termsOfService: "Conditions d'utilisation",
		copyright: "© 2026 Echos de Morse",
		mainNavigation: "Navigation principale",
		footerNavigation: "Navigation du pied de page",

		//------------------ languageSwitcher ------------------
		languageSwitcher: "Changer de langue",
	},

	dashboard: {
		modulesLabel: "Modules du tableau de bord",

		openModule: "Ouvrir le module →",

		learningTitle: "Apprentissage",
		learningDescription: "Entrainez-vous au code Morse et ameliorez votre decodage.",

		chatTitle: "Chat",
		chatDescription: "Discutez avec les autres utilisateurs en temps reel.",

		competitionTitle: "Competition",
		competitionDescription: "Participez a des defis et comparez vos resultats.",
	},

	home: {
		onlineNow: "En ligne maintenant",
		usersConnected: "{count} utilisateur(s) connecté(s)",

		introTitle: "Un projet Morse ?",
		introDescription: "Le code Morse devient ici une façon d'apprendre les signaux, le rythme, la communication et l'interaction.",

		historyTitle: "Histoire du Morse",
		historyParagraph1: "Le code Morse a été créé au dix-neuvième siècle pour envoyer des messages à distance avec le télégraphe électrique. Il transforme le texte en signaux courts et longs.",
		historyParagraph2: "Le système porte le nom de Samuel Morse. Il a travaillé avec Alfred Vail et d'autres personnes pour créer une méthode pratique de communication.",
		historyParagraph3: "Le code Morse a été important pour les trains, la mer, l'armée, le journalisme et les secours d'urgence.",
		historyParagraph4: "Aujourd'hui, il n'est plus le moyen principal de communication mondiale, mais il reste un outil historique et utile pour apprendre.",

		onlineFriends: "Amis en ligne",
		checkingSession: "Vérification de votre session...",
		onlineFriendsDescription: "Amis disponibles pour discuter ou jouer.",
		loadingOnlineFriends: "Chargement des amis en ligne...",
		noFriendsOnline: "Aucun ami en ligne pour le moment.",
		viewAllFriends: "Voir tous les amis",
		unknownUser: "Utilisateur inconnu",
		avatarAlt: "Photo de profil de {displayName}",
		chat: "Chat",
		invite: "Inviter",
		pending: "En attente",
		inviteAlreadyPending: "Une invitation de jeu est déjà en attente.",
		inviteSent: "Invitation envoyée à {displayName}. En attente de sa réponse.",
	},

	//=========================================== learning =========================================== 
	learningPractice: {
		//------------------ titre ------------------
		level: "Niveau",

		//------------------ exo ------------------
		decodeSignal: "Decoder le signal",
		playing: "Lecture...",
		replaySignal: "Rejouer le signal",
		encodeCharacter: "Encoder le caractere",

		//------------------ en haut à doite ------------------
		correctCount: "correctes",

		//------------------ réponse ------------------
		yourAnswer: "Votre reponse",
		leftDot: ".",
		rightDash: "-",
		delete: "Supprimer",
		submit: "Valider",

		correct: "Correct",
		wrong: "Erreur",
		correctAnswerText: "La bonne réponse est ",
		nextQuestion: "Question suivante",

		helpTitle: "Aide clavier :",
		decodeHelpText: "Écoute le son ou observe le signal lumineux, puis saisis le caractère correspondant au clavier.",
		encodeHelpText: "Appuie sur la flèche gauche pour un point, la flèche droite pour un trait, Backspace pour supprimer, puis Entrée pour valider.",

		//------------------ en bas ------------------
		audio: "Son",
		light: "Lumiere",

		//------------------ cheatSheet ------------------
		cheatSheetTitle: "Carte de référence Morse",
		playSound: "Écouter",

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
		backToLevels: "Retour aux niveaux",
		nextLevel: "Niveau suivant",

		//------------------ error ------------------
		noQuestion: "Aucune question disponible."
	},

	learning: {
		//------------------ app/learning/page.tsx ------------------
		pageTitle: "Apprendre le code Morse",
		pageDescription: "Continuez votre entraînement Morse avec des niveaux de pratique mixte.",

		//------------------ srcs/components/learning/LearningProgressCard.tsx ------------------
		yourProgress: "Votre progression",
		levelLabel: "Niveau {level}",
		completedLevels: "Vous avez terminé {completed} niveau(x) sur {total}.",
		today: "Aujourd'hui",
		accuracy: "Précision",
		reaction: "Réaction",
		sessions: "Sessions",
		minutes: "{minutes} min",
		hours: "{hours} h",
		hoursMinutes: "{hours} h {minutes} min",

		//------------------ srcs/components/learning/LearningEntryCards.tsx ------------------
		learningOptions: "Options d'apprentissage",
		levels: "Niveaux",
		chooseLevel: "Choisir un niveau",
		levelsDescription: "Voir tous les niveaux Morse et continuer avec un niveau débloqué.",
		openLevels: "Ouvrir les niveaux",

		play: "Jouer",
		reviewCompletedLevels: "Réviser les niveaux terminés",
		playDescription: "Pratiquez un niveau déjà terminé au hasard.",
		//!!! yren: review section
		review: "Révision",
		reviewDueCharacters: "Réviser les caractères prévus",
		reviewDescription: "Travaillez les caractères sélectionnés selon votre calendrier de révision et vos résultats les plus faibles.",
		startReview: "Commencer la révision",

		
		//------------------ app/learning/levels/page.tsx ------------------
		levelsPageDescription: "Le parcours couvre les lettres, les chiffres et la ponctuation. Chaque niveau utilise une pratique mixte : parfois vous décodez des signaux Morse, parfois vous encodez des caractères au clavier.",
		breadcrumbLearning: "Apprentissage",
		breadcrumbLevels: "Niveaux",

		//------------------ srcs/components/learning/LevelGrid.tsx ------------------
		morseLevels: "Niveaux Morse",
		globalAccuracy: "Réussite globale",
		practiceSessions: "Pratiques terminées",

		//------------------ srcs/components/learning/LevelCard.tsx ------------------
		newCharacters: "Nouveaux caractères",
		questions: "Questions",
		pass: "Réussite",
		review: "Révision",
		locked: "Verrouillé",
		startPractice: "Commencer",
	},

	//!!! yren: review section
	learningReview: {
		title: "Révision espacée",
		loading: "Préparation de votre session de révision...",
		unavailable: "Révision indisponible",
		loadError: "Impossible de charger votre session de révision.",
		saveError: "Impossible d'enregistrer vos résultats.",
		tryAgain: "Réessayer",
		noProgressTitle: "Aucun caractère à réviser",
		noProgressDescription: "Terminez d'abord quelques exercices afin de créer votre calendrier de révision.",
		openLevels: "Ouvrir les niveaux",
		sessionSummary: "{dueCount} caractères sont à réviser. Cette session couvre {reviewedCharacters} caractères prioritaires.",
		reviewComplete: "Révision terminée",
		reviewResultSummary: "Vous avez répondu correctement à {correctCount} question(s) sur {questionCount}.",
		accuracy: "Précision",
		reviewAgain: "Réviser à nouveau",
		backToLearning: "Retour à l'apprentissage",
	},

	//=========================================== chat =========================================== 
	chat: {
		//--------- friendList ---------
		chats: "Chats",
		close: "Fermer",
		add: "+ Ajouter",

		added: "Ajoute",
		pending: "En attente",
		invite: "Inviter",

		searchMyFriends: "Chercher dans mes amis",
		searchUsersToAdd: "Chercher des utilisateurs a ajouter",
		noUsersFound: "Aucun utilisateur trouve.",
		noFriendsFound: "Aucun ami trouve.",

		systemMessages: "Messages systeme",
		noSystemMessages: "Aucun message systeme.",
		
		//--------- ChatHeader ---------
		offline: "Hors ligne",
		online: "En ligne",
		
		viewProfile: "Voir le profil de {displayName}",
		avatarAlt: "Avatar de {displayName}",
		openProfileHint: "Cliquez sur le nom ou l'avatar pour ouvrir ce profil.",
		closeChat: "Fermer le chat",
		
		//--------- ChatModeSelector ---------
		languageToMorse: "Langue ⭢ Morse",
		morseToLanguage: "Morse ⭢ Langue",
		textOnly: "Texte seulement",
		morseOnly: "Morse seulement",
		encodeOnly: "Encoder seulement",
		chatModeSelector: "Selecteur du mode chat",
		
		//--------- MessageComposer ---------
		typeTextToMorse: "Tapez du texte pour afficher le texte et le Morse...",
		enterMorseToDecode: "Entrez du code Morse a decoder...",
		typeMessage: "Tapez un message...",
		typeMorseOnly: "Tapez seulement du Morse...",
		typeTextAsMorseOnly: "Tapez du texte a envoyer en Morse seulement...",
		send: "Envoyer",
		
		//--------- FriendListItem ---------
		unknownUser: "Utilisateur inconnu",
		newRemarkName: "Nouvelle remarque",
		deleteFriendConfirm: "Supprimer {displayName} des amis ?",
		gameInviteAlreadyPending: "Une invitation de jeu est deja en attente",
		inviteFriendToPlay: "Inviter cet ami a jouer",
		friendOffline: "Cet ami est hors ligne",
		
		//--------- ContextMenu ---------
		renameRemark: "Renommer la remarque",
		shareFriend: "Partager l'ami",
		inviteToGame: "Inviter au jeu",
		deleteFriend: "Supprimer l'ami",
		friendOfflineOrPending: "Cet ami est hors ligne ou a deja une invitation en attente.",
		
		//--------- SystemMessage ---------
		systemDescription: "Notifications sur les demandes d'ami, les contacts partages et les actions du chat.",

		//--------- chat/page---------
		pageTitle: "Chat",
		pageDescription: "Cette page accueillera le chat en temps reel et les fonctions de communication.",
	},

	//=========================================== login =========================================== 
	login: {
		title: "Connexion",
		description: "Connectez-vous pour continuer vers votre compte.",
		
		email: "Email",
		password: "Mot de passe",
		emailPlaceholder: "Entrez votre email",
		passwordPlaceholder: "Entrez votre mot de passe",
		
		emailRequired: "L'email est requis.",
		passwordRequired: "Le mot de passe est requis.",
		
		invalidCredentials: "Email ou mot de passe incorrect.",
		genericError: "Une erreur est survenue pendant la connexion.",
		success: "Connexion réussie.",
		
		submitting: "Envoi en cours...",
		loginButton: "Connexion",
		
		loginWithGoogle: "Connexion avec Google",
		loginWithFortyTwo: "Connexion avec 42",
		
		noAccount: "Vous n'avez pas de compte ?",
		registerHere: "Inscrivez-vous ici",

		showPassword: "Afficher",
		hidePassword: "Masquer",
	},

};

export default fr;
