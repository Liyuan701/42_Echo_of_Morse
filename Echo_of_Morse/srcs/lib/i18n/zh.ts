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

};

export default zh;
