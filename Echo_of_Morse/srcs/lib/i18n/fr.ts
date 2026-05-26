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

		
		//------------------ app/learning/levels/page.tsx ------------------
		levelsPageDescription: "Le parcours couvre les lettres, les chiffres et la ponctuation. Chaque niveau utilise une pratique mixte : parfois vous décodez des signaux Morse, parfois vous encodez des caractères au clavier.",
		breadcrumbLearning: "Apprentissage",
		breadcrumbLevels: "Niveaux",

		//------------------ srcs/components/learning/LevelGrid.tsx ------------------
		morseLevels: "Niveaux Morse",

		//------------------ srcs/components/learning/LevelCard.tsx ------------------
		newCharacters: "Nouveaux caractères",
		questions: "Questions",
		pass: "Réussite",
		review: "Révision",
		locked: "Verrouillé",
		startPractice: "Commencer",
	},



};

export default fr;
