var ig$/*appoption*/ = {
	useLocale: "en_US",
	servlet: "/mplix/servlet/krcp",
	companyname: "MPLIX",
	appname: "MPLIX",
	appbg: "bg_7186.png",
	companydomain: "http://www.amplixbi.com",
	copy: "&copy; 2005-2012 amplixbi.com Inc. <br />ALL RIGHTS RESERVED. <br />MPLIX. Confidential Information",
	intropage: "navi_intro",
	timer_rsn: 300000,
	basemap: "googlemap",
	appInfo: {
		appversion:'1.2',
		apprelease:'1.2.060'
	},
	isdev: true,
	register: false,
	file_encoding: [
		{name: "UTF-8", value: "UTF-8"},
		{name: "MS949", value: "MS949"},
		{name: "ISO8859-1", value: "ISO-8859-1"},
		{name: "US-ASCII", value: "US-ASCII"},
		{name: "UTF-16", value: "UTF-16"},
		{name: "UTF-16BE", value: "UTF-16BE"},
		{name: "UTF-16LE", value: "UTF-16LE"}
	],
	mainmenu: {
		trashbin: ["admins"],
		regdb: ["admins"]
	},
	geo_encoding: [
		{name: "SGIS", value: "com.mplix.geo.SGIS"}
	],
	chartlogo: {
		enabled: false,
		clsname: "idv-chart-credit"
	},
	features: {
		enable_scheduler: true
	},
	session_expire: 0,
	maxtapcount: 10,
	uiconfig: {
		navigator: {
			search_hidden: true,
			list_hidden: false,
			list_pos: "south",
			show_tree_items: false
		}
	},
	scmap: {
		"igc6": [
			"./js/igc6.js"
		],
		"igc7": [
			"./js/ace.js",
			"./js/igc7.js"
		],
		"igcb": ["./js/igcb.js"],
		"igco": ["./js/igco.js"],
		"igcm": [
			"./js/jquery.easypiechart.js",
			"./js/igcm.js"
		],
	    "igcn": ["./js/igcn1.js", "./js/igcn2.js"],
	    "igc9": ["./js/igc9.js"],
	    "igcg": ["./js/igcg.js"]
	},
	lang: [
		{code: "en_US", disp: "English", l1: "User ID", l2: "Password", l3: "Login"},
		{code: "ko_KR", disp: "Korean", l1: "사용자 아이디", l2: "패스워드", l3: "로그인"},
		{code: "ja_JP", disp: "Japan", l1: "ユ?ザ?ID", l2: "パスワ?ド", l3: "ログイン"}
	]
	// configuration options for sheet toolbar
//	,sheet_toolbar = [
//		{name: "Custom1", key: "custom1", label: "Custom1", cls: "igc-btn-text", handler: function(view, key) {
//			window._btn_handler(view, key);
//		}},
//		{name: "Custom2", key: "custom2", label: "Custom2", cls: "igc-btn-text", handler: function(view, key) {
//			window._btn_handler(view, key);
//		}}
//	]
	// hide_report_help: true
};
