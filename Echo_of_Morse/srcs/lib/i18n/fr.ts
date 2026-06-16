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

		review: "Revision",
		reviewDueCharacters: "Reviser les caracteres faibles",
		reviewDescription: "Genere des exercices avec les caracteres les moins reussis selon vos resultats d'entrainement.",
		startReview: "Commencer la revision",

		
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
		locked: "Verrouillé",
		startPractice: "Commencer",

		completed: "Termine",
		current: "Actuel",
		unlocked: "Debloque",

		//------------------ srcs/components/learning/LetterProgressPreview.tsx------------------
		letterProgressLabel: "Progression par caractere",
		letterProgressTitle: "Taux de reussite par caractere",
		letterProgressDescription: "Chaque barre represente le taux de reussite d'un caractere. Les caracteres les plus faibles apparaissent en premier.",
		letterProgressScrollHint: "Faites defiler horizontalement pour voir tous les caracteres.",
		successRate: "taux de reussite",
		correct: "correct",
		wrong: "faux",
	},

	learningReview: {
		title: "Révision espacée",

		loading: "Préparation de votre session de révision...",
		unavailable: "Révision indisponible",
		loadError: "Impossible de charger votre session de révision.",
		saveError: "Impossible d'enregistrer vos résultats.",
		noProgressTitle: "Aucun caractère à réviser",
		noProgressDescription: "Terminez d'abord quelques exercices afin de créer votre calendrier de révision.",
		
		openLevels: "Ouvrir les niveaux",
		sessionSummary: "{dueCount} caractères sont à réviser. Cette session couvre {reviewedCharacters} caractères prioritaires.",
		
		tryAgain: "Réessayer",
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

	//=========================================== privacyPolicy =========================================== 
	privacyPolicy: {
		title: "Politique de confidentialite",
		effectiveDate: "Date d'entree en vigueur : [10/07/2026]",
		sections: [
			{
				title: "1. Introduction",
				paragraphs: [
					"Bienvenue sur Echoes of Morse, une plateforme pour apprendre le code Morse, participer a des competitions et communiquer avec d'autres utilisateurs. Cette politique de confidentialite explique comment Morse Team collecte, utilise, conserve et protege vos donnees personnelles lorsque vous utilisez la plateforme.",
					"En utilisant Echoes of Morse, vous acceptez les pratiques decrites dans cette politique.",
				],
				items: [],
			},
			{
				title: "2. Responsable du traitement",
				paragraphs: ["Morse Team — morseteam@42.fr"],
				items: [],
			},
			{
				title: "3. Donnees que nous collectons",
				paragraphs: [
					"Informations de compte : lorsque vous creez un compte, nous collectons votre nom d'utilisateur et votre adresse email. Votre mot de passe est stocke sous forme hachee. Nous ne stockons pas les mots de passe en clair.",
					"Informations de compte tiers : lorsque vous liez Google ou 42, nous pouvons recevoir votre nom d'utilisateur, votre adresse email et votre photo de profil.",
					"Messages prives : les messages envoyes via le chat prive sont stockes dans notre base de donnees tant que votre compte est actif.",
				],
				items: [
					"Progression d'apprentissage et resultats d'exercices",
					"Historique des competitions et scores",
					"Classements",
					"Adresse IP, type de navigateur et systeme d'exploitation",
					"Horodatages de session et de connexion",
				],
			},
			{
				title: "4. Comment nous utilisons vos donnees",
				paragraphs: [
					"Nous utilisons vos donnees pour fournir l'authentification, le suivi de progression, les competitions, les classements, les amis, le chat et la securite de la plateforme.",
					"Nous n'envoyons pas d'emails marketing. Nous n'utilisons pas vos donnees a des fins publicitaires.",
				],
				items: [],
			},
			{
				title: "5. Services tiers",
				paragraphs: [
					"Nous utilisons Google OAuth et 42 OAuth pour lier un compte tiers ou se connecter. Ces fournisseurs peuvent collecter des donnees selon leurs propres politiques de confidentialite.",
					"Nous ne vendons pas vos donnees personnelles a des tiers.",
				],
				items: [],
			},
			{
				title: "6. Chat prive et moderation",
				paragraphs: [
					"Les messages prives sont conserves tant que votre compte est actif. En cas de signalement, les administrateurs de la plateforme peuvent acceder aux messages concernes a des fins de moderation.",
					"Veuillez ne pas partager d'informations personnelles sensibles dans le chat.",
				],
				items: [],
			},
			{
				title: "7. Conservation des donnees",
				paragraphs: [
					"Nous conservons vos donnees tant que votre compte est actif. Lors de la suppression du compte, votre profil et vos messages sont supprimes.",
					"Les donnees de competition peuvent etre conservees sous forme anonymisee a des fins statistiques.",
				],
				items: [],
			},
			{
				title: "8. Vos droits",
				paragraphs: [
					"En tant qu'utilisateur dans l'Union europeenne, vous avez le droit d'acceder a vos donnees, de les corriger, de les supprimer, d'en limiter le traitement ou de les exporter. Pour exercer ces droits, contactez-nous a morseteam@42.fr.",
					"Nous repondrons sous 30 jours. Vous pouvez aussi deposer une plainte aupres de votre autorite nationale de protection des donnees.",
				],
				items: [],
			},
			{
				title: "9. Securite des donnees",
				paragraphs: [
					"Nous utilisons le stockage hache des mots de passe, l'authentification tierce et des controles d'acces pour proteger vos donnees.",
					"Aucun systeme n'est totalement securise. Nous recommandons d'utiliser des mots de passe forts et de proteger vos comptes tiers.",
				],
				items: [],
			},
			{
				title: "10. Confidentialite des enfants",
				paragraphs: [
					"Echoes of Morse ne s'adresse pas aux enfants de moins de 13 ans. Si vous pensez qu'un enfant nous a fourni des donnees personnelles, contactez-nous et nous les supprimerons rapidement.",
				],
				items: [],
			},
			{
				title: "11. Modifications de cette politique",
				paragraphs: [
					"Nous pouvons mettre a jour cette politique de temps en temps. Continuer a utiliser la plateforme apres des modifications vaut acceptation de la politique mise a jour.",
				],
				items: [],
			},
			{
				title: "12. Contact",
				paragraphs: ["Morse Team — morseteam@42.fr"],
				items: [],
			},
		],
	},

	//=========================================== termsOfService =========================================== 

	termsOfService: {
		title: "Conditions d'utilisation",
		effectiveDate: "Date d'entree en vigueur : [10/07/2026]",
		sections: [
			{
				title: "1. Introduction",
				paragraphs: [
					"Bienvenue sur Echoes of Morse. Ces conditions d'utilisation encadrent votre utilisation de la plateforme, y compris les outils d'apprentissage du code Morse, les competitions, les classements, les amis et la messagerie.",
					"En accedant a Echoes of Morse ou en l'utilisant, vous acceptez ces conditions. Si vous n'etes pas d'accord, veuillez ne pas utiliser la plateforme.",
				],
				items: [],
			},
			{
				title: "2. Eligibilite",
				paragraphs: [
					"Vous devez avoir au moins 13 ans pour utiliser cette plateforme. En utilisant Echoes of Morse, vous confirmez respecter cette condition.",
				],
				items: [],
			},
			{
				title: "3. Comptes utilisateur",
				paragraphs: [
					"L'acces aux fonctionnalites de la plateforme necessite un compte ou une connexion tierce liee.",
					"Vous etes responsable de la securite de votre compte et de toutes les activites effectuees avec celui-ci.",
				],
				items: [],
			},
			{
				title: "4. Utilisation acceptable",
				paragraphs: ["Vous vous engagez a ne pas :"],
				items: [
					"Utiliser la plateforme a des fins illegales",
					"Tenter de pirater, perturber ou surcharger le service",
					"Tricher dans les competitions ou manipuler les classements",
					"Envoyer des messages abusifs, offensants ou dangereux",
					"Usurper l'identite d'un autre utilisateur ou d'une organisation",
				],
			},
			{
				title: "5. Competitions et classements",
				paragraphs: [
					"Echoes of Morse propose des competitions et des classements a des fins educatives et de divertissement.",
					"Nous nous reservons le droit de supprimer des scores, suspendre des comptes ou reinitialiser des classements en cas de triche, d'abus ou de probleme technique.",
				],
				items: [],
			},
			{
				title: "6. Messagerie privee",
				paragraphs: [
					"Les utilisateurs peuvent communiquer via les fonctions de chat prive. Vous etes seul responsable du contenu que vous envoyez.",
					"Nous nous reservons le droit de moderer ou supprimer le contenu qui enfreint ces conditions ou les lois applicables.",
				],
				items: [],
			},
			{
				title: "7. Propriete intellectuelle",
				paragraphs: [
					"Sauf indication contraire, le contenu, le design, les logos et les supports d'apprentissage de la plateforme appartiennent a Morse Team.",
					"Vous ne pouvez pas copier, redistribuer ou exploiter commercialement le contenu de la plateforme sans autorisation.",
				],
				items: [],
			},
			{
				title: "8. Disponibilite du service",
				paragraphs: [
					"Nous faisons de notre mieux pour maintenir l'acces a la plateforme, mais nous ne garantissons pas un service ininterrompu.",
					"La plateforme peut etre modifiee, suspendue ou arretee a tout moment sans preavis.",
				],
				items: [],
			},
			{
				title: "9. Limitation de responsabilite",
				paragraphs: [
					"Echoes of Morse est fourni tel quel, sans garantie d'aucune sorte.",
					"Morse Team ne peut pas etre tenu responsable des pertes de donnees, interruptions de service ou dommages lies a l'utilisation de la plateforme.",
				],
				items: [],
			},
			{
				title: "10. Resiliation",
				paragraphs: [
					"Nous nous reservons le droit de suspendre ou de fermer les comptes qui enfreignent ces conditions ou menacent la securite de la plateforme.",
				],
				items: [],
			},
			{
				title: "11. Modifications de ces conditions",
				paragraphs: [
					"Nous pouvons mettre a jour ces conditions de temps en temps. Continuer a utiliser la plateforme apres des modifications vaut acceptation des conditions mises a jour.",
				],
				items: [],
			},
			{
				title: "12. Contact",
				paragraphs: ["Morse Team — morseteam@42.fr"],
				items: [],
			},
		],
	},
	};

export default fr;
