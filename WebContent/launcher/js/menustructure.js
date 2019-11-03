ig$/*appoption*/.mainmenu = {
	mainmenu: [
		{
			rcs: "L_NAVIGATOR",
			type: "column",
			acls: "ig_mnav",
			handler: function() {
				IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_BROWSER");
			}
		},
		{
			rcs: "L_MANAGEMENT",
			type: "column",
			acls: "ig_mngr",
			handler: function() {
				IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_MGR_MENUS");
			},
			menus: [
				{
					rcs: "L_SYSTEM",
					acls: "ig_sys",
					type: "list",
					items: [
						{
							rcs: "L_USER_MANAGEMENT",
							acls: "ig_user",
							cmd: "CMD_USER_MANAGER"
						},
						{
							rcs: "L_LOOK_AND_FEEL",
							acls: "ig_lnf",
							cmd: "CMD_REPORT_STYLE"
						},
						{
							rcs: "L_LOCALE_MANAGER",
							acls: "ig_loc",
							cmd: "CMD_LOCALE"
						},
						{
							rcs: "L_DLOCALE_MGR",
							acls: "ig_dloc",
							cmd: "CMD_DLOCALE"
						},
						{
							rcs: "L_FEATURE_CTRL",
							acls: "ig_ft",
							cmd: "CMD_FEATURES"
						}
					]
				},
				{
					rcs: "L_ANALYSIS",
					type: "list",
					acls: "ig_anl",
					items: [
						{
							rcs: "L_DB_INSTANCE",
							cmd: "CMD_CONNECT_DB",
							acls: "ig_dbcon"
						},
						{
							rcs: "L_DATASET",
							cmd: "CMD_DATASET",
							acls: "ig_dataset"
						},
						{
							rcs: "L_REG_TABLE",
							acls: "ig_table",
							cmd: "CMD_TABLE_REGISTER"
						},
						{
							rcs: "L_VARIABLES",
							acls: "ig_var",
							cmd: "CMD_VAR"
						},
						{
							rcs: "L_CODEMAPPING",
							acls: "ig_lookup",
							cmd: "CMD_LOOKUP"
						},
						{
							rcs: "L_MGR_DASHBOARD",
							acls: "ig_dbd",
							cmd: "CMD_DBD_MGR"
						}
					]
				},
				{
					rcs: "L_MONITORING",
					acls: "ig_mon",
					type: "list",
					items: [
						{
							rcs: "L_META_IMPORT",
							acls: "ig_imp",
							cmd: "CMD_META_IMP"
						},
						{
							rcs: "L_SYS_LOG",
							acls: "ig_syslog",
							cmd: "CMD_SYSMON"
						},
						{
							rcs: "L_SYS_RES",
							acls: "ig_sysres",
							cmd: "CMD_SYSRES"
						},
						{
							rcs: "L_SYS_BACKSCH",
							acls: "ig_schedule",
							cmd: "CMD_SCHEDULE"
						}
					]
				}
			]
		},
		{
			rcs: "L_BIGDATA",
			type: "column",
			acls: "ig_bdmgr",
			handler: function() {
				IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_BD_MENUS");
			},
			menus: [
				{
					rcs: "L_HADOOP",
					type: "list",
					acls: "ig_hdoop",
					items: [
						{
							rcs: "L_HD_MAPR",
							cmd: "CMD_HD_MAPR",
							acls: "ig_hd_mapr"
						},
						{
							rcs: "L_HD_BFLOW",
							cmd: "CMD_HD_BFLOW",
							acls: "ig_hd_flow"
						}
					]
				},
				{
					rcs: "L_MONGODB",
					type: "list",
					acls: "ig_mongo",
					items: [
						{
							rcs: "L_MONGO_DPROC",
							cmd: "CMD_MONG_MAPR",
							acls: "ig_mg_dproc"
						},
						{
							rcs: "L_MONGO_DATA",
							cmd: "CMD_MONG_DATA",
							acls: "ig_mg_data"
						}
					]
				}
			]
		},
		{
			rcs: "L_ML",
			type: "column",
			acls: "ig_mlmgr",
			handler: function() {
				IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_ML_MENUS");
			},
			menus: [
				{
					rcs: "L_BAYES",
					type: "list",
					acls: "ig_ml_bayes",
					items: [
						{
							rcs: "L_BAYES_RPT",
							cmd: "CMD_ML_BAYES",
							acls: "ig_ml_bayes_rpt"
						}
					]
				}
			]
		}
	],
	footmenu: [
		{
			rcs: "L_SW_APP",
			acls: "ig_sw_app",
			cmd: "CMD_SW_APP"
		},
		{
			rcs: "L_LOGOUT",
			acls: "ig_logout",
			cmd: "logout"
		},
		{
			rcs: "L_CH_PASSWD",
			acls: "ig_passwd",
			cmd: "CMD_PASSWORD_CHANGE"
		},
		{
			rcs: "L_PREFERENCES",
			acls: "ig_pref",
			cmd: "CMD_PREF"
		},
		{
			rcs: "L_HELP_GUIDES",
			acls: "ig_help",
			handler: function() {
				IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_APP_WIZARD");
			}
		}
	],
	afterrender: function(menu) {
		
	}
};