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
		//------------------ top left ------------------
		level: "Level",

		//------------------ left ------------------
		decodeSignal: "Decode signal",
		listenPrompt: "Listen or watch the signal, then press the matching key.",
		playing: "Playing...",
		replaySignal: "Replay signal",
		encodeCharacter: "Encode character",
		encodePrompt: "Use Left Arrow for dot and Right Arrow for dash. Press Enter to submit.",

		//------------------ top right ------------------
		correctCount: "Correct",

		//------------------ right ------------------
		yourAnswer: "Your answer",
		leftDot: ".",
		rightDash: "-",
		delete: "Delete",
		submit: "Submit",
		pressMatching: "Press the matching character on your keyboard.",
		buildMorse: "Build the Morse code with the arrow keys.",
		correct: "Correct",
		wrong: "Wrong",

		helpTitle: "Keyboard help:",
		decodeHelpText: "Listen to the sound or watch the light signal, then press the matching character.",
		encodeHelpText: "Press Left Arrow for dot, Right Arrow for dash, and Enter to submit.",

		//------------------ bottom ------------------
		audio: "Audio",
		light: "Light",

		//------------------ result ------------------
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

		signalOn: "Signal on",
		signalSettings: "Signal settings",
		signalOff: "Signal off",
		
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

		
		//------------------ app/learning/levels/page.tsx ------------------
		levelsPageDescription: "The path covers letters, numbers, and punctuation. Each level uses mixed practice: sometimes you decode Morse signals, sometimes you encode characters with the keyboard.",
		breadcrumbLearning: "Learning",
		breadcrumbLevels: "Levels",

		//------------------ srcs/components/learning/LevelGrid.tsx ------------------
		morseLevels: "Morse levels",

		//------------------ srcs/components/learning/LevelCard.tsx ------------------
		newCharacters: "New characters",
		questions: "Questions",
		pass: "Pass",
		review: "Review",
		locked: "Locked",
		startPractice: "Start practice",
	},

};

export default en;
