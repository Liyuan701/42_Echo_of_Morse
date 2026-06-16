const en = {
	profile: {
		//------------------ sentences ------------------
		loading: "Loading profile...",
		loginRequired: "Please log in to view your profile.",
		editLoginRequired: "Please log in to edit your profile.",
		loadingCurrentProfile: "Loading current profile...",
		saving: "Saving...",
		failedToLoadProfile: "Failed to load profile.",
		loadProfileError: "Something went wrong while loading profile.",
		missingUserId: "Missing user ID.",
		//------------------ words ------------------
		changeAvatar: "Change avatar",
		editProfile: "Edit profile",
		defaultUser: "User",
		//------- personal info -------
		bio: "Bio",
		stats: "Stats",
		accuracy: "Accuracy",
		learningLevel: "Learning level",
		levelPrefix: "Level",
		friends: "Friends",
		joined: "Joined",
		connectedAccounts: "Linked accounts",
		notConnected: "Not linked",
		connected: "Linked",
		bindGoogle: "Bind Google",
		bindFortyTwo: "Bind 42",
		noEmail: "No email",
		//------------------ profile friends ------------------
		userNotFound: "User not found",
		//------------------ profile edit ------------------
		username: "Username",
		usernamePlaceholder: "Enter your username",
		bioPlaceholder: "Tell something about yourself",
		saveChanges: "Save changes",
		chooseImageFile: "Please choose an image file.",
		readImageError: "Unable to read this image.",
		failedToUpdateProfile: "Failed to update profile.",
		updateProfileError: "Something went wrong while updating profile.",
	},

	//=========================================== register =========================================== 
	register: {
		title: "Register",
		description: "Create your account to access the platform.",
		name: "Name",
		email: "Email",
		password: "Password",
		confirmPassword: "Confirm Password",
		namePlaceholder: "Enter your name",
		emailPlaceholder: "Enter your email",
		passwordPlaceholder: "Enter your password",
		confirmPasswordPlaceholder: "Confirm your password",
		passwordHint: "Password must contain at least 8 characters.",
		submitting: "Submitting...",
		createAccount: "Create account",
		nameRequired: "Name is required.",
		emailRequired: "Email is required.",
		passwordRequired: "Password is required.",
		passwordTooShort: "Password must be at least 8 characters long.",
		passwordsDoNotMatch: "Passwords do not match.",
		success: "Account created successfully. Redirecting to login...",
		genericError: "Something went wrong during registration.",
		usernameOrEmailInUse: "Username or email already in use.",

		showPassword: "Show",
		hidePassword: "Hide",
		
		emailInvalid: "Invalid email format.",
	},

	layout: {
		//------------------ navbar ------------------
		brand: "Echoes of Morse",
		dashboard: "Dashboard",
		profile: "Profile",
		login: "Login",
		logout: "Logout",
		user: "User",

		//------------------ footer ------------------
		footerDescription: "Learn, communicate, and compete through Morse code.",
		privacyPolicy: "Privacy Policy",
		termsOfService: "Terms of Service",
		copyright: "© 2026 Echoes of Morse",
		mainNavigation: "Main navigation",
		footerNavigation: "Footer navigation",

		//------------------ languageSwitcher ------------------
		languageSwitcher: "Language switcher",
	},

	dashboard: {
		modulesLabel: "Dashboard modules",

		openModule: "Open module →",

		learningTitle: "Learning",
		learningDescription: "Practice Morse code and improve your decoding skills.",

		chatTitle: "Chat",
		chatDescription: "Communicate with other users through real-time chat.",

		competitionTitle: "Competition",
		competitionDescription: "Join challenges and compare your performance.",
	},

	home: {
		onlineNow: "Online now",
		usersConnected: "{count} users connected",

		introTitle: "A Project of Morse?",
		introDescription: "Morse code becomes here a way to learn signals, rhythm, communication, and interaction.",

		historyTitle: "History of Morse",
		historyParagraph1: "Morse code was developed in the nineteenth century as a way to send messages over long distances through the electric telegraph. It transformed written language into short and long signals, now known as dots and dashes.",
		historyParagraph2: "The system is named after Samuel Morse, who worked with collaborators such as Alfred Vail to create a practical communication method for the telegraph.",
		historyParagraph3: "Morse code played an important role in railway networks, maritime communication, military operations, journalism, and emergency rescue.",
		historyParagraph4: "Although it is no longer the main system of global communication, Morse code remains a powerful historical medium and a useful learning tool.",

		onlineFriends: "Online friends",
		checkingSession: "Checking your session...",
		onlineFriendsDescription: "Friends currently available for chat or competition.",
		loadingOnlineFriends: "Loading online friends...",
		noFriendsOnline: "No friends online for now.",
		viewAllFriends: "View all friends",
		unknownUser: "Unknown user",
		avatarAlt: "{displayName}'s avatar",
		chat: "Chat",
		invite: "Invite",
		pending: "Pending",
		inviteAlreadyPending: "A game invitation is already pending.",
		inviteSent: "Game invitation sent to {displayName}. Waiting for their response.",
	},

	//=========================================== learning =========================================== 
	learningPractice: {
		//------------------ titre ------------------
		level: "Level",

		//------------------ exo ------------------
		decodeSignal: "Decode signal",
		playing: "Playing...",
		replaySignal: "Replay signal",
		encodeCharacter: "Encode character",

		//------------------ en haut à doite ------------------
		correctCount: "Correct",

		//------------------ réponse ------------------
		yourAnswer: "Your answer",
		leftDot: ".",
		rightDash: "-",
		delete: "Delete",
		submit: "Submit",

		correct: "Correct",
		wrong: "Wrong",
		correctAnswerText: "The correct answer is ",
		nextQuestion: "Next question",

		helpTitle: "Keyboard help:",
		decodeHelpText: "Listen to the sound or watch the light signal, then type the matching character on your keyboard.",
		encodeHelpText: "Press Left Arrow for dot, Right Arrow for dash, Backspace to delete, and Enter to submit.",

		//------------------ en bas ------------------
		audio: "Audio",
		light: "Light",

		//------------------ cheatSheet ------------------
		cheatSheetTitle: "Morse reference card",
		playSound: "Play",

		//------------------ resultat ------------------
		complete: "complete",

		levelPassed: "Level passed",
		tryAgain: "Try again",

		resultSummary: "You answered {correctCount} of {questionCount} correctly.",
		passConditionText: "Pass condition: {passCount} / {questionCount}.",

		accuracy: "Accuracy",
		status: "Status",
		unlockedNext: "Unlocked next",
		needsReview: "Needs review",

		practiceAgain: "Practice again",
		backToLevels: "Back to levels",
		nextLevel: "Next level",
		
		//------------------ error ------------------
		noQuestion: "No question available."
	},

	learning: {
		//------------------ app/learning/page.tsx ------------------
		pageTitle: "Learn Morse Code",
		pageDescription: "Continue your Morse training through mixed practice levels.",

		//------------------ srcs/components/learning/LearningProgressCard.tsx ------------------
		yourProgress: "Your progress",
		levelLabel: "Level {level}",
		completedLevels: "You have completed {completed} of {total} levels.",
		today: "Today",
		accuracy: "Accuracy",
		reaction: "Reaction",
		sessions: "Sessions",
		minutes: "{minutes} min",
		hours: "{hours}h",
		hoursMinutes: "{hours}h {minutes}min",

		//------------------ srcs/components/learning/LearningEntryCards.tsx ------------------
		learningOptions: "Learning options",
		levels: "Levels",
		chooseLevel: "Choose a level",
		levelsDescription: "View all Morse levels and continue with an unlocked level.",
		openLevels: "Open levels",

		play: "Play",
		reviewCompletedLevels: "Review completed levels",
		playDescription: "Practice a random level you have already completed.",
		//!!! yren: review section
		review: "Review",
		reviewDueCharacters: "Review due characters",
		reviewDescription: "Practice characters selected from your review schedule and weaker results.",
		startReview: "Start review",

		
		//------------------ app/learning/levels/page.tsx ------------------
		levelsPageDescription: "The path covers letters, numbers, and punctuation. Each level uses mixed practice: sometimes you decode Morse signals, sometimes you encode characters with the keyboard.",
		breadcrumbLearning: "Learning",
		breadcrumbLevels: "Levels",

		//------------------ srcs/components/learning/LevelGrid.tsx ------------------
		morseLevels: "Morse levels",
		globalAccuracy: "Global accuracy",
		practiceSessions: "Practice sessions",

		//------------------ srcs/components/learning/LevelCard.tsx ------------------
		newCharacters: "New characters",
		questions: "Questions",
		pass: "Pass",
		locked: "Locked",
		startPractice: "Start practice",

		completed: "Completed",
		current: "Current",
		unlocked: "Unlocked",

		//------------------ srcs/components/learning/LetterProgressPreview.tsx------------------
		letterProgressLabel: "Character progress",
		letterProgressTitle: "Success rate by character",
		letterProgressDescription: "Each bar shows the success rate of one character. Weaker characters appear first.",
		letterProgressScrollHint: "Scroll horizontally to see all characters.",
		successRate: "success rate",
		correct: "correct",
		wrong: "wrong",
	},

	//!!! yren: review section
	learningReview: {
		title: "Spaced review",
		loading: "Preparing your review session...",
		unavailable: "Review unavailable",
		loadError: "Unable to load your review session.",
		saveError: "Unable to save your review results.",
		tryAgain: "Try again",
		noProgressTitle: "No characters to review yet",
		noProgressDescription: "Complete some level practice first so the review system can build your schedule.",
		openLevels: "Open levels",
		sessionSummary: "{dueCount} characters are due. This session covers {reviewedCharacters} priority characters.",
		reviewComplete: "Review complete",
		reviewResultSummary: "You answered {correctCount} of {questionCount} questions correctly.",
		accuracy: "Accuracy",
		reviewAgain: "Review again",
		backToLearning: "Back to learning",
	},

	//=========================================== chat =========================================== 
	chat: {
		//--------- friendList ---------
		chats: "Chats",
		close: "Close",
		add: "+ Add",

		added: "Added",
		pending: "Pending",
		invite: "Invite",

		searchMyFriends: "Search in my friends",
		searchUsersToAdd: "Search users to add",
		noUsersFound: "No users found.",
		noFriendsFound: "No friends found.",

		systemMessages: "System messages",
		noSystemMessages: "No system messages yet.",
		
		//--------- ChatHeader ---------
		offline: "Offline",
		online: "Online",
		
		viewProfile: "View {displayName}'s profile",
		avatarAlt: "{displayName}'s avatar",
		openProfileHint: "Click the name or avatar to open this profile.",
		closeChat: "Close chat",
		
		//--------- ChatModeSelector ---------
		languageToMorse: "Language ⭢ Morse",
		morseToLanguage: "Morse ⭢ Language",
		textOnly: "Text only",
		morseOnly: "Morse only",
		encodeOnly: "Encode only",
		chatModeSelector: "Chat mode selector",
		
		//--------- MessageComposer ---------
		typeTextToMorse: "Type text to show text and Morse...",
		enterMorseToDecode: "Enter Morse code to decode...",
		typeMessage: "Type a message...",
		typeMorseOnly: "Type Morse code only...",
		typeTextAsMorseOnly: "Type text to send as Morse only...",
		send: "Send",
		
		//--------- FriendListItem ---------
		unknownUser: "Unknown user",
		newRemarkName: "New remark name",
		deleteFriendConfirm: "Delete {displayName} from friends?",
		gameInviteAlreadyPending: "A game invitation is already pending",
		inviteFriendToPlay: "Invite this friend to play",
		friendOffline: "This friend is offline",
		
		//--------- ContextMenu ---------
		renameRemark: "Rename remark",
		shareFriend: "Share friend",
		inviteToGame: "Invite to game",
		deleteFriend: "Delete friend",
		friendOfflineOrPending: "This friend is offline or already has a pending invitation.",
		
		//--------- SystemMessage ---------
		systemDescription: "Notifications about friend requests, shared contacts, and local chat actions.",

		//--------- chat/page---------
		pageTitle: "Chat",
		pageDescription: "This page will host real-time chat and communication features.",
	},

	//=========================================== login =========================================== 
	login: {
		title: "Login",
		description: "Sign in to continue to your account.",

		email: "Email",
		password: "Password",
		emailPlaceholder: "Enter your email",
		passwordPlaceholder: "Enter your password",

		emailRequired: "Email is required.",
		passwordRequired: "Password is required.",

		invalidCredentials: "Invalid email or password.",
		genericError: "Something went wrong during login.",
		success: "Login successful.",

		submitting: "Submitting...",
		loginButton: "Login",

		loginWithGoogle: "Login with Google",
		loginWithFortyTwo: "Login with 42",

		noAccount: "Don't have an account?",
		registerHere: "Register here",

		showPassword: "Show",
		hidePassword: "Hide",
	},


};

export default en;
