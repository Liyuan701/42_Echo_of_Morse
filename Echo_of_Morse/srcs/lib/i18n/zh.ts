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

	//=========================================== register =========================================== 
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

		showPassword: "显示",
		hidePassword: "隐藏",
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
		//------------------ titre ------------------
		level: "等级",

		//------------------ exo ------------------
		decodeSignal: "识别信号",
		playing: "播放中...",
		replaySignal: "重播信号",
		encodeCharacter: "输入摩斯码",

		//------------------ en haut à doite ------------------
		correctCount: "题正确",

		//------------------ réponse ------------------
		yourAnswer: "你的答案",
		leftDot: ".",
		rightDash: "-",
		delete: "删除",
		submit: "提交",

		correct: "正确",
		wrong: "错误",
		correctAnswerText: "正确答案是 ",
		nextQuestion: "下一题",

		helpTitle: "键盘操作提示：",
		decodeHelpText: "听声音或观察灯光信号，然后用键盘输入对应字符。",
		encodeHelpText: "左箭头输入点，右箭头输入划，Backspace 删除。按 Enter 提交。",

		//------------------ en bas ------------------
		audio: "声音",
		light: "灯光",

		//------------------ cheatSheet ------------------
		cheatSheetTitle: "摩斯提示卡",
		playSound: "播放",

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
		backToLevels: "返回等级列表",
		nextLevel: "下一关",
		
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
		globalAccuracy: "总体正确率",
		practiceSessions: "练习次数",

		//------------------ srcs/components/learning/LevelCard.tsx ------------------
		newCharacters: "新字符",
		questions: "题目",
		pass: "通过",
		review: "复习",
		locked: "未解锁",
		startPractice: "开始练习",

	},

	//=========================================== chat =========================================== 
	chat: {
		//--------- friendList ---------
		chats: "聊天",
		close: "关闭",
		add: "+ 添加",

		added: "已添加",
		pending: "等待中",
		invite: "邀请",

		searchMyFriends: "搜索我的好友",
		searchUsersToAdd: "搜索要添加的用户",
		noUsersFound: "没有找到用户。",
		noFriendsFound: "没有找到好友。",

		systemMessages: "系统消息",
		noSystemMessages: "暂无系统消息。",
		
		//--------- ChatHeader ---------
		offline: "离线",
		online: "在线",
		
		viewProfile: "查看 {displayName} 的资料",
		avatarAlt: "{displayName} 的头像",
		openProfileHint: "点击名字或头像打开个人资料。",
		closeChat: "关闭聊天",
		
		//--------- ChatModeSelector ---------
		languageToMorse: "文字 ⭢ 摩斯",
		morseToLanguage: "摩斯 ⭢ 文字",
		textOnly: "仅文字",
		morseOnly: "仅摩斯",
		encodeOnly: "仅编码",
		chatModeSelector: "聊天模式选择",
		
		//--------- MessageComposer ---------
		typeTextToMorse: "输入文字，显示文字和摩斯码...",
		enterMorseToDecode: "输入摩斯码进行解码...",
		typeMessage: "输入消息...",
		typeMorseOnly: "只输入摩斯码...",
		typeTextAsMorseOnly: "输入文字并只发送摩斯码...",
		send: "发送",
		
		//--------- FriendListItem ---------
		unknownUser: "未知用户",
		newRemarkName: "新备注名",
		deleteFriendConfirm: "从好友中删除 {displayName}？",
		gameInviteAlreadyPending: "已经有一个游戏邀请在等待中",
		inviteFriendToPlay: "邀请这个好友一起玩",
		friendOffline: "这个好友不在线",
		
		//--------- ContextMenu ---------
		renameRemark: "修改备注",
		shareFriend: "分享好友",
		inviteToGame: "邀请游戏",
		deleteFriend: "删除好友",
		friendOfflineOrPending: "这个好友不在线，或已经有等待中的邀请。",
		
		//--------- SystemMessage ---------
		systemDescription: "关于好友请求、分享联系人和聊天操作的通知。",

		//--------- chat/page---------
		pageTitle: "聊天",
		pageDescription: "这个页面将用于实时聊天和交流功能。",
	},

	//=========================================== login =========================================== 
	login: {
		title: "登录",
		description: "登录以继续使用你的账号。",

		email: "邮箱",
		password: "密码",
		emailPlaceholder: "请输入邮箱",
		passwordPlaceholder: "请输入密码",

		emailRequired: "邮箱不能为空。",
		passwordRequired: "密码不能为空。",

		invalidCredentials: "邮箱或密码不正确。",
		success: "登录成功。",
		genericError: "登录时出现错误。",

		submitting: "提交中...",
		loginButton: "登录",

		loginWithGoogle: "使用 Google 登录",
		loginWithFortyTwo: "使用 42 登录",

		noAccount: "还没有账号？",
		registerHere: "点击这里注册",

		showPassword: "显示",
		hidePassword: "隐藏",
	},

};

export default zh;

