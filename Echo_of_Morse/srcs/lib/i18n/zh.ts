const zh = {
	profile: {
		//------------------ 句子 ------------------
		loading: "正在加载个人资料...",
		loginRequired: "请先登录以查看个人资料。",
		editLoginRequired: "请先登录以编辑个人资料。",
		loadingCurrentProfile: "正在加载当前资料...",
		saving: "保存中...",
		failedToLoadProfile: "加载个人资料失败。",
		loadProfileError: "加载个人资料时出现错误。",
		missingUserId: "缺少用户 ID。",
		//------------------ 词 ------------------
		changeAvatar: "更换头像",
		editProfile: "编辑资料",
		defaultUser: "用户",
		//------- 个人信息/------- 
		bio: "个人签名",
		stats: "统计数据",
		accuracy: "准确率",
		learningLevel: "学习等级",
		levelPrefix: "等级",
		friends: "好友",
		joined: "注册时间",
		connectedAccounts: "绑定账号",
		notConnected: "未绑定",
		connected: "已绑定",
		bindGoogle: "绑定 Google",
		bindFortyTwo: "绑定 42",
		noEmail: "无邮箱",
		//------------------ profil friends ------------------
		userNotFound: "未找到用户",
		//------------------ profil edit ------------------
		username: "用户名",
		usernamePlaceholder: "请输入用户名",
		bioPlaceholder: "介绍一下你自己",
		saveChanges: "保存修改",
		chooseImageFile: "请选择图片文件。",
		readImageError: "无法读取这张图片。",
		failedToUpdateProfile: "更新个人资料失败。",
		updateProfileError: "更新个人资料时出现错误。",
	},

	register: {
		title: "注册",
		description: "创建你的账号以使用平台功能。",
		name: "用户名",
		email: "邮箱",
		password: "密码",
		confirmPassword: "确认密码",
		namePlaceholder: "请输入用户名",
		emailPlaceholder: "请输入邮箱",
		passwordPlaceholder: "请输入密码",
		confirmPasswordPlaceholder: "请再次输入密码",
		passwordHint: "密码至少需要 8 个字符。",
		submitting: "提交中...",
		createAccount: "创建账号",
		nameRequired: "用户名不能为空。",
		emailRequired: "邮箱不能为空。",
		passwordRequired: "密码不能为空。",
		passwordTooShort: "密码长度至少需要 8 个字符。",
		passwordsDoNotMatch: "两次输入的密码不一致。",
		success: "账号创建成功，正在跳转到登录页面...",
		genericError: "注册时出现错误，请稍后再试。",
		usernameOrEmailInUse: "用户名或邮箱已被使用。",
	},

	layout: {
		//------------------ navbar ------------------
		brand: "摩斯之声",
		dashboard: "主页",
		profile: "个人",
		login: "登录",
		logout: "退出",
		user: "用户",

		//------------------ footer ------------------
		footerDescription: "学习、交流，并通过摩斯码进行挑战。",
		privacyPolicy: "隐私政策",
		termsOfService: "服务条款",
		copyright: "© 2026 摩斯之声",
		footerNavigation: "页脚导航",
		mainNavigation: "主导航",

		//------------------ languageSwitcher ------------------
		languageSwitcher: "语言切换",
	},

	dashboard: {
		modulesLabel: "仪表盘模块",

		openModule: "打开模块 →",

		learningTitle: "学习",
		learningDescription: "练习摩斯码，提升你的识别能力。",

		chatTitle: "聊天",
		chatDescription: "通过实时聊天和其他用户交流。",

		competitionTitle: "比赛",
		competitionDescription: "参加挑战并比较你的表现。",
	},

	home: {
		onlineNow: "当前在线",
		usersConnected: "{count} 位用户在线",

		introTitle: "摩斯项目？",
		introDescription: "摩斯码在这里成为学习信号、节奏、交流和互动的一种方式。",

		historyTitle: "摩斯码的历史",
		historyParagraph1: "摩斯码诞生于十九世纪，最初用于通过电报远距离发送信息。它把文字转换成短信号和长信号，也就是现在说的点和划。",
		historyParagraph2: "这个系统以 Samuel Morse 命名。他和 Alfred Vail 等合作者一起，为电报创造了一种实用的通信方法。",
		historyParagraph3: "摩斯码曾在铁路、海上通信、军事、新闻和紧急救援中发挥重要作用。它让信息传递得比信件和报纸更快。",
		historyParagraph4: "虽然它现在不再是全球通信的主要方式，但摩斯码仍然是一种重要的历史媒介，也是一种有用的学习工具。",

		onlineFriends: "在线好友",
		checkingSession: "正在检查登录状态...",
		onlineFriendsDescription: "当前可以聊天或比赛的好友。",
		loadingOnlineFriends: "正在加载在线好友...",
		noFriendsOnline: "目前没有在线好友。",
		viewAllFriends: "查看所有好友",
		unknownUser: "未知用户",
		avatarAlt: "{displayName} 的头像",
		chat: "聊天",
		invite: "邀请",
		pending: "等待中",
		inviteAlreadyPending: "已经有一个比赛邀请在等待中。",
		inviteSent: "已向 {displayName} 发送比赛邀请，等待对方回应。",
	},

	//=========================================== learning =========================================== 
	learningPractice: {
		//------------------ en haut à gauch ------------------
		level: "等级",

		//------------------ à gauche ------------------
		decodeSignal: "识别信号",
		listenPrompt: "听声音或观察灯光信号，然后按下对应字符。",
		playing: "播放中...",
		replaySignal: "重播信号",
		
		encodeCharacter: "输入摩斯码",
		encodePrompt: "左箭头输入点，右箭头输入划。按 Enter 提交。",

		//------------------ en haut à doite ------------------
		correctCount: "题正确",

		//------------------ à droite ------------------
		yourAnswer: "你的答案",
		leftDot: "点",
		rightDash: "划",
		delete: "删除",
		submit: "提交",
		pressMatching: "请按下键盘上对应的字符。",
		buildMorse: "使用方向键输入摩斯码。",
		correct: "正确",
		wrong: "错误",

		//------------------ en bas ------------------
		audio: "声音",
		light: "灯光",

		//------------------ resultat ------------------
		complete: "完成",

		levelPassed: "通过本关",
		tryAgain: "再试一次",
		
		resultSummary: "你答对了 {correctCount} / {questionCount} 题。",
		passConditionText: "通过条件：{passCount} / {questionCount}。",

		accuracy: "准确率",
		status: "状态",
		unlockedNext: "已解锁下一关",
		needsReview: "需要复习",

		practiceAgain: "重新练习",

		signalOn: "信号亮起",
		signalSettings: "信号设置",
		signalOff: "信号关闭",

		//------------------ error ------------------
		noQuestion: "没有可用题目。"
	},

	learning: {
		//------------------ app/learning/page.tsx ------------------
		pageTitle: "学习摩斯码",
		pageDescription: "通过混合练习关卡继续训练摩斯码。",

		//------------------ srcs/components/learning/LearningProgressCard.tsx ------------------
		yourProgress: "你的进度",
		levelLabel: "等级 {level}",
		completedLevels: "你已完成 {completed} / {total} 个等级。",
		today: "今日",
		accuracy: "准确率",
		reaction: "反应",
		sessions: "练习次数",
		minutes: "{minutes} 分钟",
		hours: "{hours} 小时",
		hoursMinutes: "{hours} 小时 {minutes} 分钟",

		//------------------ srcs/components/learning/LearningEntryCards.tsx ------------------
		learningOptions: "学习选项",
		levels: "等级",
		chooseLevel: "选择等级",
		levelsDescription: "查看所有摩斯码等级，并继续一个已解锁的等级。",
		openLevels: "打开等级列表",

		play: "练习",
		reviewCompletedLevels: "复习已完成等级",
		playDescription: "随机练习一个你已经完成的等级。",

		
		//------------------ app/learning/levels/page.tsx ------------------
		levelsPageDescription: "学习路径包含字母、数字和标点。每个等级都使用混合练习：有时识别摩斯码信号，有时用键盘输入摩斯码。",
		breadcrumbLearning: "学习",
		breadcrumbLevels: "等级",
		
		//------------------ srcs/components/learning/LevelGrid.tsx ------------------
		morseLevels: "摩斯码等级",

		//------------------ srcs/components/learning/LevelCard.tsx ------------------
		newCharacters: "新字符",
		questions: "题目",
		pass: "通过",
		review: "复习",
		locked: "未解锁",
		startPractice: "开始练习",

	},

};

export default zh;

