/*
amplixbi.com on MPLIX project
Copyright(c) 2011 amplixbi.com
http://www.amplixbi.com/
*/
/*
This file is part of INGECEP

Copyright (c) 2011-2013 INGECEP Inc

Contact:  http://www.ingecep.com/contact

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.ingecep.com/contact.

*/
IG$/*mainapp*/._I5f/*geoDatas*/ = [];

IG$/*mainapp*/._I61/*createAppPanel*/ = function(uid, itemtype, name, address, writable, opt, callback) {
	var p = null,
		popt = {uid: uid, writable: writable}, key, val,
		modname,
		modtype = 0,
		scripts;
	
	if (opt)
	{
		for (key in opt)
		{
			popt[key] = opt[key];
		}
	}
	
	switch (itemtype)
	{
	case "report":
		popt.itemtype = "Report";
		popt.iconCls = "icon-report";
		// p = new IG$/*mainapp*/._IBe/*ReportView*/(popt);
		modname = "_IBe";
		break;
	case "sheet":
		popt.itemtype = "Sheet";
		popt.iconCls = "icon-report";
		// p = new IG$/*mainapp*/._IBe/*ReportView*/(popt);
		modname = "_IBe";
		break;
	case "dashboard":
		// p = new IG$/*mainapp*/._IBf/*DashboardView*/(popt);
		modname = "_IBf";
		break;
	case "metaeditor":
		// p = new IG$/*mainapp*/._IC0/*MetaEditorPanel*/(popt);
		modname = "_IC0";
		break;
	case "multimetric":
		// p = new IG$/*mainapp*/._IC3/*multimetric*/(popt);
		modname = "_IC3";
		break;
	case "multimeasure":
		p = new IG$/*mainapp*/._IC4/*multimeasure*/(popt);
		modname = "_IC4";
		break;
	case "cube":
		popt.iconCls = "icon-cube";
		popt.itemtype = "Cube";
		// p = new IG$/*mainapp*/._IC5/*cubeeditor*/(popt);
		modname = "_IC5";
		break;
	case "mcube":
		popt.iconCls = "icon-mcube";
		popt.itemtype = "MCube";
		// p = new IG$/*mainapp*/._IC5/*cubeeditor*/(popt);
		modname = "_IC5";
		break;
	case "datacube":
		popt.iconCls = "icon-excel";
		popt.itemtype = "DataCube";
		// p = new IG$/*mainapp*/._IC6/*ExcelLoaderPanel*/(popt);
		modname = "_IC5";
		break;
	case "cubemodel":
		popt.iconCls = "icon-cubemodel";
		// p = new IG$/*mainapp*/._IC7/*CubeModel*/(popt);
		modname = "_IC7";
		break;
	case "dashboardedit":
		// p = new IG$/*mainapp*/._IC8/*DashboardEdit*/(popt);
		modname = "_IC8";
		modtype = 2;
		break;
	case "template":
		// p = new IG$/*mainapp*/._IC7/*CubeModel*/(popt);
		modname = "_IC7";
		break;
	case "compositereport":
		popt.itemtype = "CompositeReport";
		// p = new IG$/*mainapp*/._IBe/*ReportView*/(popt);
		modname = "_IBe";
		break;
	case "measure":
		// p = new IG$/*mainapp*/._Ie1/*measureEditor*/(popt);
		modname = "_Ie1";
		break;
	case "hierarchy":
		modname = "_IeN";
		break;
	case "formulameasure":
		// p = new IG$/*mainapp*/._Id8/*formulaEditor*/(popt);
		modname = "_Id8";
		break;
	case "custommetric":
		// p = new IG$/*mainapp*/._Ie0/*custommetric*/(popt);
		modname = "_Ie0";
		break;
	case "groupfield":
		// p = new IG$/*mainapp*/._Iae/*udgdialog*/(popt);
		modname = "_Iae";
		break;
	case "chartmeasure":
		// p = new IG$/*mainapp*/._Ie2/*cellwizard*/(popt);
		modname = "_Ie2";
		break;
	case "nosql":
		popt.iconCls = "icon-nosql";
		popt.itemtype = "NoSQL";
		// p = new IG$/*mainapp*/._IC9/*nosqlcube*/(popt);
		// modname = "_IC9";
		modname = "_IC5";
		break;
	case "mdbcube":
		popt.iconCls = "icon-mdbcube";
		popt.itemtype = "MDBCube";
		// p = new IG$/*mainapp*/._IC5/*cubeeditor*/(popt);
		modname = "_IC5";
		break;
	case "datemetric":
		p = new IG$/*mainapp*/.M$dam/*datemetric*/(popt);
		break;
	case "sqlcube":
		popt.iconCls = "icon-sqlcube";
		popt.itemtype = "SQLCube";
		// p = new IG$/*mainapp*/._IC5/*cubeeditor*/(popt);
		modname = "_IC5";
		break;
	case "bigdata":
	case "mongodata":
		popt.iconCls = "icon-bigdata";
		modtype = 3;
		popt.itemtype = itemtype == "bigdata" ? "BigData" : "MongoData";
		// p = new IG$/*mainapp*/._IB9/*flowEditor*/(popt);
		modname = "_IB9";
		break;
	case "bayesnet":
		popt.iconCls = "icon-bigdata";
		modtype = 3;
		popt.itemtype = "BayesNet";
		modname = "_IB9b";
		break;
	case "javaclass":
		popt.iconCls = "icon-javaclass";
		// p = new IG$/*mainapp*/._I9d/*mr_javaeditor*/(popt);
		modname = "_I9d";
		modtype = 3;
		break;
	case "measuregroup":
	case "measuregroupdimension":
		// p = new IG$/*mainapp*/._Id5/*measureGroupEditor*/(popt);
		modname = "_Id5";
		break;
	case "uipage":
		// p = new IG$/*mainapp*/._Ia5/*uipage*/(popt);
		modname = "_Ia5";
		break;
	case "metric":
		// p = new IG$/*mainapp*/._Idf/*metricEditor*/(popt);
		modname = "_Idf";
		break;
	case "codemap":
		// p = new IG$/*mainapp*/._IMm/*codemapping*/(popt);
		modname = "_IMm";
		break;
	case "classmodule":
		popt.iconCls = "icon-javaclass";
		modtype = 1;
		// p = new IG$/*mainapp*/.__C/*classmodule*/(popt);
		modname = "__C";
		break;
	}
	
	if (modname)
	{
		if (IG$/*mainapp*/[modname])
		{
			p = new IG$/*mainapp*/[modname](popt);
		}
		else
		{
			// load module
			scripts = ig$/*appoption*/.scmap[modtype == 1 ? "igcm" : (modtype == 2 ? "igc7" : (modtype == 3 ? "igc9" : "igcn"))];
			
			IG$/*mainapp*/.x03/*getScriptCache*/(
				scripts, 
				new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
					if (IG$/*mainapp*/[modname])
					{
						callback && callback.execute();
					}
					else
					{
						IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("L_ERR_L_MOD"));
					}
				})
			);
		}
	}
	
	return p;
};

IG$/*mainapp*/._I63/*showHelp*/ = function(helpuid, modal, docmode) {
	var h = new IG$/*mainapp*/._Id1/*helpWindow*/({
			uid: helpuid, 
			modal: (modal === false) ? false : true,
			dm: docmode || null
		});
		
	if (docmode != "report")
	{
		IG$/*mainapp*/.r___.b/*loadHelp*/(helpuid, h);
	}
	else
	{
		h.show();
	}
};

IG$/*mainapp*/._I64/*showHideAllWindow*/ = function(b_show) {
	var visible = (b_show == true) ? "visible" : "hidden",
		mtop = (b_show == true) ? 0 : 10000,
		i;
	
	if (IG$/*mainapp*/._I7d/*mainPanel*/)
	{
		for (i=IG$/*mainapp*/._I7d/*mainPanel*/.items.length - 1; i>=0; i--)
		{
			IG$/*mainapp*/._I7d/*mainPanel*/.items.items[i].close();
		}
	}	
};

IG$/*mainapp*/._I65/*procMenuCommand*/ = function(cmd, opt)
{
	var dlgpop,
		panel,
		itemname,
		itemid,
		cmdl = cmd.toLowerCase(),
		modname,
		popt = {},
		modtype = 0,
		sc,
		mp = IG$/*mainapp*/._I7d/*mainPanel*/ || null,
		btype;
	
	switch (cmd)
	{
	case "CMD_PASSWORD_CHANGE":
		dlgpop = new IG$/*mainapp*/._I6d/*passwordMgr*/();
	    IG$/*mainapp*/._I_5/*checkLogin*/(null, dlgpop);
		break;
	case "CMD_PREF":
		dlgpop = new IG$/*mainapp*/._j/*userpref*/();
	    IG$/*mainapp*/._I_5/*checkLogin*/(null, dlgpop);
		break;
	case "CMD_MAKE_WORKSPACE":
		dlgpop = new IG$/*mainapp*/._I6e/*makeItem*/({
			itemtype: "Workspace",
			parentnodepath: "/",
			parentuid: "/"
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(null, dlgpop);
		break;
	case "CMD_SW_APP":
		dlgpop = new IG$/*mainapp*/._I6d_/*workspace_switcher*/({
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(null, dlgpop);
		break;
	case "CMD_SERVER_CONFIG":
		break;
	case "CMD_HELP_MGR":
		// panel = new IG$/*mainapp*/._I6f/*helpManage*/({});
		modname = "_I6f";
		itemid = cmdl;
		itemname = IRm$/*resources*/.r1("I_HELP_MGR");
		break;
	case "CMD_LOCALE":
		// panel = new IG$/*mainapp*/._I70/*resourcemgr*/({});
		modname = "_I70";
		itemid = cmdl;
		itemname = IRm$/*resources*/.r1("I_LOC_MGR");
		break;
	case "CMD_DLOCALE":
		modname = "_I70";
		itemid = cmdl;
		popt.dicmode = 1;
		itemname = IRm$/*resources*/.r1("I_DLOC_MGR");
		break;
	case "CMD_META_IMP":
		// panel = new IG$/*mainapp*/._I71/*metaImport*/({});
		modname = "_I71";
		itemid = cmdl;
		itemname = IRm$/*resources*/.r1("I_META_IMP");
		break;
	case "CMD_RELATION_VIEW":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I72/*relationMgr*/({});
		modname = "_I72";
		itemname = IRm$/*resources*/.r1("L_RELATION_VIEW");
		break;
	case "CMD_TABLE_REGISTER":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I73/*tableManager*/({});
		modname = "_I73";
		itemname = IRm$/*resources*/.r1("L_MGR_DATABASE");
		modtype = 1;
		break;
	case "CMD_LOOKUP":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I7k/*systemlookup*/({});
		modname = "_I7k";
		itemname = IRm$/*resources*/.r1("L_S_LK");
		break;
	case "CMD_CONNECT_DB":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I74/*mgrdb_config*/({});
		modname = "_I74";
		itemname = IRm$/*resources*/.r1("L_REG_DATABASE");
		break;
	case "CMD_DATASET":
		itemid = cmdl;
		modname = "Idm";
		itemname = IRm$/*resources*/.r1("L_REG_DATASET");
		break;
	case "CMD_ABOUT":
		dlgpop = new IG$/*mainapp*/._I75/*aboutApp*/();
		IG$/*mainapp*/._I_5/*checkLogin*/(null, dlgpop);
		break;
//	case "CMD_HELP":
//		IG$/*mainapp*/._I63/*showHelp*/("P0001");
//		break;
	case "CMD_USER_MANAGER":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I76/*mgrUser*/({});
		modname = "_I76";
		itemname = IRm$/*resources*/.r1("L_MGR_USER");
		break;
	case "CMD_VAR":
	case "CMD_BD_CONFIG":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I77/*hadoop_config*/({});
		modname = "_I77";
		modtype = 3;
		itemname = IRm$/*resources*/.r1("I_BD_CONFIG");
		break;
	case "CMD_DBD_MGR":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._xA/*mgr_dashboard*/({});
		modname = "_xA";
		itemname = IRm$/*resources*/.r1("I_MGR_DBD");
		break;
	case "CMD_FEATURES":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I76a/*mgrFeatures*/({});
		modname = "_I76a";
		// itemname = panel.title;
		break;
	case "CMD_REPORT_STYLE":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I78/*styleWizard*/({
		popt.title = IRm$/*resources*/.r1("T_GLOBAL_REPORT_STYLE");
		popt.styletype = "g";
		modname = "_I78";
		// itemname = panel.title;
		break;
	case "CMD_RSN":
		dlgpop = new IG$/*mainapp*/._I79/*rsn_editor*/({});
		IG$/*mainapp*/._I_5/*checkLogin*/(null, dlgpop);
		break;
	case "CMD_SYSMON":
		// panel = new IG$/*mainapp*/._I7a/*sysmon*/({});
		modname = "_I7a";
		// itemname = panel.title;
		itemid = cmdl;
		break;
	case "CMD_SYSRES":
		// panel = new IG$/*mainapp*/._I7b/*sys_resource*/({});
		modname = "_I7b";
		// itemname = panel.title;
		itemid = cmdl;
		break;
	case "CMD_SCHEDULE":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I7c/*scheduler*/({});
		modname = "_I7c";
		itemname = IRm$/*resources*/.r1("I_SCHEDULE");
		break;
	case "CMD_HOME":
		IG$/*mainapp*/._I7e/*changeApp*/(0);
		break;
	case "CMD_BROWSER":
		IG$/*mainapp*/._I7e/*changeApp*/(1);
		break;
	case "CMD_TABPANEL":
		IG$/*mainapp*/._I7e/*changeApp*/(2);
		break;
	case "CMD_WIZARD":
	case "CMD_APP_WIZARD":
		IG$/*mainapp*/._I7e/*changeApp*/(3);
		var dwizard = IG$/*mainapp*/._n25/*dwizard*/;
			
		if (!IG$/*mainapp*/._I7f/*app_wizard*/ && IG$/*mainapp*/.ltW)
		{
			IG$/*mainapp*/._I7f/*app_wizard*/ = new IG$/*mainapp*/._I80/*smartwizard*/(dwizard, IG$/*mainapp*/.ltW);
		}
		break;
	case "CMD_SYNC_USER":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I76n/*sync_user*/({
		popt.uid = opt;
		modname = "_I76n";
		itemname = IRm$/*resources*/.r1("T_SYNC_USER");
		break;
	case "CMD_MGR_MENUS":
		IG$/*mainapp*/._I7e/*changeApp*/(4, "ig_mngr");
		break;
	case "CMD_HD_BFLOW":
	case "CMD_MONG_DATA":
		btype = (cmd == "CMD_HD_BFLOW") ? "BigData" : "MongoData";
		mp && mp.m1$7/*navigateApp*/.call(mp, null, btype.toLowerCase(), btype, null, null, true);
		break;
	case "CMD_MONG_MAPR":
	case "CMD_HD_MAPR":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I72/*relationMgr*/({});
		modname = "_xA";
		popt._cmode = 2;
		itemname = IRm$/*resources*/.r1("L_HD_BFLOW");
		break;
	case "CMD_ML_BAYES":
		btype = "BayesNet";
		mp && mp.m1$7/*navigateApp*/.call(mp, null, btype.toLowerCase(), btype, null, null, true);
		break;
	case "CMD_D_MENU":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I7_/*dashboardmenu*/({});
		modname = "_I7_";
		itemname = cmdl;
		break;
	case "CMD_REVISION":
		itemid = cmdl;
		// panel = new IG$/*mainapp*/._I76b/*mgrRevision*/({
		popt.uid = opt;
		modname = "_I76b";
		itemname = IRm$/*resources*/.r1("T_REVISION");
		break;
	}
	
	if (modname && IG$/*mainapp*/._I7d/*mainPanel*/)
	{
		var tab = IG$/*mainapp*/._I7d/*mainPanel*/.getComponent.call(IG$/*mainapp*/._I7d/*mainPanel*/, itemid);
		
		if (tab)
		{
			IG$/*mainapp*/._I7d/*mainPanel*/.setActiveTab.call(IG$/*mainapp*/._I7d/*mainPanel*/, tab);
			
			if (cmdl == "cmd_revision")
			{
				tab._1/*loadUID*/.call(tab, opt);
			}
		}
		else
		{
			if (IG$/*mainapp*/[modname])
			{
				panel = new IG$/*mainapp*/[modname](popt);
				if (!itemname)
				{
					itemname = panel.title;
				}
			}
			else
			{
				// load module
				scripts = ig$/*appoption*/.scmap[modtype == 1 ? "igcn" : (modtype == 3 ? "igc9" : "igcm")];
				
				IG$/*mainapp*/.x03/*getScriptCache*/(
					scripts, 
					new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
						if (IG$/*mainapp*/[modname])
						{
							panel = new IG$/*mainapp*/[modname](popt);
							if (!itemname)
							{
								itemname = panel.title;
							}
							
							panel.id = itemid
							panel.address = itemid;
							panel.title = IG$/*mainapp*/._I28/*getTabTitle*/(itemname);
							
							if (panel.isWindow == true)
							{
								IG$/*mainapp*/._I_5/*checkLogin*/(null, panel);
							}
							else
							{
								var p = IG$/*mainapp*/._I7d/*mainPanel*/.add.call(IG$/*mainapp*/._I7d/*mainPanel*/, panel);
								IG$/*mainapp*/._I7d/*mainPanel*/.setActiveTab.call(IG$/*mainapp*/._I7d/*mainPanel*/, p);
							}
						}
						else
						{
							IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("L_ERR_L_MOD"));
						}
					})
				);
			}
			
			if (panel)
			{
				panel.id = itemid
				panel.address = itemid;
				panel.title = IG$/*mainapp*/._I28/*getTabTitle*/(itemname);
				
				if (panel.isWindow == true)
				{
					IG$/*mainapp*/._I_5/*checkLogin*/(null, panel);
				}
				else
				{
					var p = IG$/*mainapp*/._I7d/*mainPanel*/.add.call(IG$/*mainapp*/._I7d/*mainPanel*/, panel);
					IG$/*mainapp*/._I7d/*mainPanel*/.setActiveTab.call(IG$/*mainapp*/._I7d/*mainPanel*/, p);
				}
			}
		}
	}
};

IG$/*mainapp*/._I81/*loginUtils*/ = function(config) {
};

IG$/*mainapp*/._I81/*loginUtils*/.prototype = {
	_I85/*processLogin*/: function(){
		var panel = IG$/*mainapp*/._I83/*dlgLogin*/,
			uform = $("#loginform"),
    		userid = uform.items.items[0].getValue(),
			passwd = uform.items.items[1].getValue();
		
		panel.m1$8/*requestLoginKey*/.call(panel, userid, passwd);
	},
	
	rm1$8/*requestLoginKey*/: function(userid, passwd, bg, mts, callback) {
		var panel = this;
		if (bg)
		{
			bg.show();
		}
		
		$.ajax({
			url: ig$/*appoption*/.servlet,
			data: {
				ack: "23",
				payload: "<smsg mts='" + (mts || "") + "'></smsg>",
				mbody: '<smsg></smsg>',
				uniquekey: IG$/*mainapp*/._I4a/*getUniqueKey*/()
			},
			type: "POST",
			dataType: "text",
			timeout: 30000,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			beforeSend: function(xhr, settings) {
			},
			cache: false,
			crossDomain: false,
			processData: true,
			timeout: 300000,
			error: function() {
				callback && callback.execute();
				alert("Error while connecting server");
			},
			success: function(doc) {
				var xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
					root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
					item = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					ltoken,
					errorcode = root ? IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errorcode") : null;
				
				if (item)
				{
					p1 = IG$/*mainapp*/._I1a/*getSubNodeText*/(item, "p1");
					p2 = IG$/*mainapp*/._I1a/*getSubNodeText*/(item, "p2");
					
					if (p1 && p2)
					{
						IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/ = p1;
						IG$/*mainapp*/._I3b/*rsaPpublicKeyExponent*/ = p2;
						IG$/*mainapp*/._g$a/*global_mts*/ = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "mts");
						
						setTimeout(function() {
							panel.m1$8/*intProcLogin*/.call(panel, userid, passwd, bg, mts, callback);
						}, 10);
					}
					else if (bg)
					{
						callback && callback.execute();
						bg.hide();
						alert("Error while get secure key value. Please try again later!");
					}
				}
				else if (errorcode)
				{
					if (bg)
					{
						bg.hide();
					}
					var msg = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errormsg");
					
					callback && callback.execute();
					alert(msg);
				}
			}
		});
	},
	
	m1$8/*intProcLogin*/: function(userid, passwd, bg, mts, callback) {
		var panel = this, 
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		var encpwd = IG$/*mainapp*/._I3c/*encryptkey*/([userid, passwd]);
		// passwd = encpwd.toString(CryptoJS.enc.Hex);
		req.init(panel, 
			{
                ack: "13",
	            payload: "<smsg ptoken=\'\' uuid=\'\'><userid><![CDATA[" + encpwd[0] + "]]></userid><passwd><![CDATA[" + encpwd[1] + "]]></passwd></smsg>",
	            mbody: "<smsg><option lang='" + useLocale + "' mts='" + (mts || "") + "' app='' session_expire='" + (ig$/*appoption*/.session_expire || "0") + "'/></smsg>"
            }, panel, panel.r_I85/*processLogin*/, function(xdoc) {
            	callback && callback.execute(xdoc);
            	
            	if (bg)
            	{
            		bg.hide();
            	}
            }, bg);
		req._l/*request*/();
	},
	
	r_I85/*processLogin*/: function (xdoc, bg) {
		var panel = this;
		
		var root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		ltoken = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "token");
		var nuid = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "uid");
		var ltoken = null;
		var cuser = false;
		var lastlogin = {
			lastaccesstime: IG$/*mainapp*/._I1b/*XGetAttr*/(root, "lastaccesstime"),
			lastaccesshost: IG$/*mainapp*/._I1b/*XGetAttr*/(root, "lastaccesshost"),
			lastaccessaddr: IG$/*mainapp*/._I1b/*XGetAttr*/(root, "lastaccessaddr"),
			accesshost: IG$/*mainapp*/._I1b/*XGetAttr*/(root, "accesshost"),
			accessaddr: IG$/*mainapp*/._I1b/*XGetAttr*/(root, "accessaddr"),
			accesstime: IG$/*mainapp*/._I1b/*XGetAttr*/(root, "accesstime")
		};
		
		if (window.IG$/*mainapp*/._I83/*dlgLogin*/)
		{
			IG$/*mainapp*/._I83/*dlgLogin*/.lastLogin = lastlogin;
			
			if (IG$/*mainapp*/._I7d/*mainPanel*/ && IG$/*mainapp*/._I7d/*mainPanel*/.iLL/*updateLoginInfo*/)
			{
				IG$/*mainapp*/._I7d/*mainPanel*/.iLL/*updateLoginInfo*/.call(IG$/*mainapp*/._I7d/*mainPanel*/);
			}
		}
		
		if (bg)
		{
			bg.hide();
		}
				
		if (panel.uuid && panel.uuid.length > 0 && nuid && panel.uuid != nuid)
		{
			cuser = true;
		}
		panel.uuid = nuid;
		
		if (ltoken != "" && panel.uuid != "")
        {
        	panel.Js2/*closeLoginProc*/.call(panel, cuser);
        }
	},
	
	Js2/*closeLoginProc*/: function(changeuser) {
		this.Js4/*getUserDetail*/(changeuser);
	},
	
	Js3/*finalLoginProc*/: function() {
		var me = this,
			l3 = me.jS1/*loginInfo*/.l3.substring(1),
			mechanlevel = $("#mechanlevel");
		
//		if (window.mecapp)
//		{
//			var app = mecapp;
//			app.a3/*preDesktopLauncher*/.call(app);
//			
//			IG$/*mainapp*/._I64/*showHideAllWindow*/(true);
//			$('#win-mask').css({display: 'none'});
//		}
		
		if (mechanlevel && mechanlevel[0])
		{
			setTimeout(function() {
				switch (l3)
				{
				case "1":
					mechanlevel.attr("title", "Your license is limited using all features.");
					mechanlevel.animate({width: 45}, 2000);
					
					mechanlevel.bind("click", function() {
						window.open("http://www.amplixbi.com/", "_new");
					});
					break;
				case "2":
					mechanlevel.attr("title", "Your license is limited using all features.");
					mechanlevel.animate({width: 60}, 2000);
					mechanlevel.css({backgroundColor: "#0000ff"});
					mechanlevel.bind("click", function() {
						window.open("http://www.amplixbi.com/", "_new");
					});
					break;
				case "3":
				case "4":
					mechanlevel.attr("title", "Currently using full feature and unlimited version.");
					mechanlevel.animate({width: 100}, 2000);
					mechanlevel.css({backgroundColor: "#00ff00"});
					break;
				}
			}, 200);
		}

		if (me.callback)
		{
			setTimeout(function() {
				me.callback.execute();
			}, 100);
		}
		
		// IG$/*mainapp*/._I83/*dlgLogin*/.hide();
	},
	
	Js4/*getUserDetail*/: function(changeuser) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
                ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/user"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "_gi_", uid: panel.uuid, tmpl: (IG$/*mainapp*/.__ep ? "sys_print_mode" : IG$/*mainapp*/.__ep_ || "")})
            }, panel, panel.rs_Js4/*getUserDetail*/, null, [changeuser]);
		req._l/*request*/();
	},
	
	rs_Js4/*getUserDetail*/: function(xdoc, params) {
		var panel = this,
			changeuser = params[0],
			desktop;
		
		var userinfo = new IG$/*mainapp*/._I82/*CUserInfo*/(xdoc);
		panel.jS1/*loginInfo*/ = userinfo;
		panel.jS2/*isAdmin*/ = panel.jS1/*loginInfo*/.jS1/*hasDuty*/('admins', 'A');
		panel.desktopsetting = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/DesktopInfo");
		
		ig$/*appoption*/.fm/*features*/ = userinfo.fm/*features*/;
		
		$.cookie("lui", userinfo.u1/*userid*/, {
			expires: 7
		});
		
		IG$/*mainapp*/.$1/*loadApp*/(userinfo.tmpl, userinfo.fm);
		
		if (changeuser == true)
		{
			IG$/*mainapp*/._I64/*showHideAllWindow*/(true);
			$('#win-mask').css({display: 'none'});
			
//			if (mecapp)
//			{
//				desktop = mecapp;
//				desktop.initDesktop.call(desktop, desktop, desktop.a1/*loadDesktopSettings*/);
//			}
//			else 
			if (IG$/*mainapp*/._I7d/*mainPanel*/)
			{
				IG$/*mainapp*/._I7d/*mainPanel*/.i1/*initRecentVisit*/.call(IG$/*mainapp*/._I7d/*mainPanel*/);
			}
		}
		
		if (IG$/*mainapp*/._I7d/*mainPanel*/)
		{
			IG$/*mainapp*/._I7d/*mainPanel*/.iLL/*updateLoginInfo*/.call(IG$/*mainapp*/._I7d/*mainPanel*/);
		}

		panel.Js3/*finalLoginProc*/.call(panel);
	}
};

IG$/*mainapp*/._I82/*CUserInfo*/ = function (xdoc) {
	var me = this,
		root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/userdetail/smsg/item"),
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(root, "d"),
		fnode = IG$/*mainapp*/._I18/*XGetNode*/(root, "f"),
		hnode = IG$/*mainapp*/._I18/*XGetNode*/(root, "themes"), hnodes,
		child, fnodes, schild, inodes,
		st = [],
		isadmin = false,
		i, p, j, k, pk,
		tmpl,
		mainview,
		nname;
	
	p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(root);
	me.sid = p.sid;
	me.gid = p.gid;
	me.u1/*userid*/ = p.id;
	me.username = p.name;
	me.l3 = p.l3;
	me.l4 = p.l4 == "Y";
	me.auth = [];
	me.authmap = {};
	me.fm/*features*/ = {};
	me.pf/*pdffonts*/ = [];
	me.mts = p.mts;
	me.mts_name = p.mts_name;
	me.tmpl = {};
	
	if (p.a2 && !ig$/*appoption*/.theme_id)
	{
		ig$/*appoption*/.theme_id = p.a2;
	}
	
	tmpl = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/userdetail/smsg/item/tmpl");
	
	if (tmpl)
	{
		mainview = IG$/*mainapp*/._I18/*XGetNode*/(tmpl, "mview");
		if (mainview)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(mainview);
			me.tmpl.mainview = {};
			for (i=0; i < child.length; i++)
			{
				p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[i]);
				p.width = p.width ? Number(p.width) : null;
				p.height = p.height ? Number(p.height) : null;
				
				schild = IG$/*mainapp*/._I26/*getChildNodes*/(child[i]);
				for (j=0; j < schild.length; j++)
				{
					nname = IG$/*mainapp*/._I29/*XGetNodeName*/(schild[j]);
					if (nname == "items")
					{
						p.items = [];
						
						inodes = IG$/*mainapp*/._I26/*getChildNodes*/(schild[j]);
						
						for (k=0; k < inodes.length; k++)
						{
							pk = IG$/*mainapp*/._I1c/*XGetAttrProp*/(inodes[k]);
							p.items.push(pk);
						}
					}
					else
					{
						p[nname] = IG$/*mainapp*/._I24/*getTextContent*/(schild[j]);
					}
				}
				
				if (p.html)
				{
					p.html = IG$/*mainapp*/._I46/*replaceAll*/(p.html, "$APP_NAME", ig$/*appoption*/.appname);
					p.html = IG$/*mainapp*/._I46/*replaceAll*/(p.html, "$APP_COPY", ig$/*appoption*/.copy);
				}
				me.tmpl.mainview[p.name] = p;
			}
		}
	}
	
	child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
	
	for (i=0; i < child.length; i++)
	{
		p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[i]);
		me.auth.push(p);
		me.authmap[p.name.toLowerCase()] = p;
	}
	
	isadmin = me.authmap["admins"] ? true : false;
	
	if (fnode)
	{
		fnodes = IG$/*mainapp*/._I26/*getChildNodes*/(fnode);
		for (i=0; i < fnodes.length; i++)
		{
			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(fnodes[i]);
			me.fm/*features*/[p.cls] = (p.hide == "T");
		}
	}
	
	fnode = IG$/*mainapp*/._I18/*XGetNode*/(root, "pf");
	
	if (fnode)
	{
		fnodes = IG$/*mainapp*/._I26/*getChildNodes*/(fnode);
		for (i=0; i < fnodes.length; i++)
		{
			me.pf/*pdffonts*/.push(IG$/*mainapp*/._I24/*getTextContent*/(fnodes[i]) + ";");
		}
	}
	
	ig$/*appoption*/.fmc/*features_css*/ && ig$/*appoption*/.fmc/*features_css*/.remove();
	
	st.push("<style type='text/css'>");
	$.each(me.fm/*features*/, function(t, f) {
//		!(isadmin && (f.cls == "ig_mngr" || f.cls == "ig_sys" || f.cls == "ig_ft")) && 
//		st.push("." + f.cls + " { display: none; }");
		
		if (t == "ig_mngr" || t == "ig_sys" || t == "ig_ft")
		{
			if (!isadmin)
			{
				st.push("." + t + " { display: none; }");
			}
		}
		else if (f == true)
		{
			st.push("." + t + " { display: none; }");
		}
	});
	st.push("</style>");
	
	ig$/*appoption*/.fmc/*features_css*/ = $(st.join("")).appendTo($("head"));
	
	me.themes = [];
	
	if (hnode)
	{
		hnodes = IG$/*mainapp*/._I26/*getChildNodes*/(hnode);
		
		for (i=0; i < hnodes.length; i++)
		{
			me.themes.push({
				name: IG$/*mainapp*/._I1b/*XGetAttr*/(hnodes[i], "name")
			});
		}
		
		if (window.app_themes)
		{
			try
			{
				window.app_themes(me.themes);
			}
			catch (e)
			{
			}
		}
	}
}

IG$/*mainapp*/._I82/*CUserInfo*/.prototype = {
	jS1/*hasDuty*/: function(name, type) {
		var me = this,
			i;
		
		for (i=0; i < me.auth.length; i++)
		{
			if ((!type || (type && me.auth[i].dutytype == type)) && me.auth[i].name.toLowerCase() == name)
			{
				return true;
			}
		}
		
		return false;
	}
}

IG$/*mainapp*/._I83/*dlgLogin*/ = new IG$/*mainapp*/._I81/*loginUtils*/();
IG$/*mainapp*/._I84/*checkLogin*/ = function(sccall, fail) {
	$.ajax({
		url: ig$/*appoption*/.servlet,
		
		data: {
			ack: "14",
			payload: "<smsg ptoken='' uuid=''></smsg>",
			mbody: "<smsg><option lang='" + useLocale + "' app='" + loadingApp + "'/></smsg>",
			uniquekey: IG$/*mainapp*/._I4a/*getUniqueKey*/()
		},
		type: "POST",
		dataType: "text",
		timeout: 30000,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		beforeSend: function(xhr, settings) {
		},
		cache: false,
		crossDomain: false,
		processData: true,
		error: function() {
			alert("Error while connecting server");
			if (fail)
			{
				fail.call();
			}
		},
		success: function(doc) {
			var xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
				root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
				item = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
				ltoken,
				nuid,
				redirect;
			
			if (item)
			{
				ltoken = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "token");
				nuid = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "uid");
				
				redirect = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "redirect");
				
				if (sccall)
				{
					sccall.call();
				}
				else if (redirect && redirect.length > 0)
				{
					window.location.replace(redirect);
				}
			}
			else
			{
				if (fail)
				{
					fail.call();
				}
			}
		}
	});
}

IG$/*mainapp*/._I85/*processLogin*/ = function(userid, passwd, bg, mts, errcallback) {
	if (bg)
	{
		bg.show();
	}
	
	var il_err = $("#il_err");
	il_err.hide();
	
	$.ajax({
		url: ig$/*appoption*/.servlet,
		type: "POST",
		data: {
			ack: "23",
			payload: "<smsg mts='" + (mts || "") + "'></smsg>",
			mbody: "<smsg></smsg>",
			uniquekey: IG$/*mainapp*/._I4a/*getUniqueKey*/()
		},
		dataType: "text",
		timeout: 30000,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		beforeSend: function(xhr, settings) {
		},
		cache: false,
		crossDomain: false,
		processData: true,
		timeout: 300000,
		error: function() {
			bg.hide();
			alert("Error while connecting server");
		},
		success: function(doc) {
			var xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
				root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
				item = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
				p1, p2;
			
			if (item)
			{
				p1 = IG$/*mainapp*/._I1a/*getSubNodeText*/(item, "p1");
				p2 = IG$/*mainapp*/._I1a/*getSubNodeText*/(item, "p2");
				
				if (p1 && p2)
				{
					IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/ = p1;
					IG$/*mainapp*/._I3b/*rsaPpublicKeyExponent*/ = p2;
					IG$/*mainapp*/._g$a/*global_mts*/ = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "mts");
					
					setTimeout(function() {
						IG$/*mainapp*/._I86/*processLoginRSA*/(userid, passwd, bg, mts, errcallback);
					}, 10);
				}
				else
				{
					alert("Error while get security key");
					if (bg)
					{
						bg.hide();
					}
				}
			}
			else if (root)
			{
				var errcode = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errorcode"),
					msg = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errormsg");
				
				if (errcode)
				{
					if (bg)
					{
						bg.hide();
					}
					
	            	if (errcode == "0x6d00")
	            	{
	            		il_err.unbind("click");
	            		il_err.bind("click", function() {
	            			il_err.hide();
	            		});
	            		il_err.show();
	            		$(".igc-errorinfo-msg", il_err).html(msg);
	            	}
	            	else
	            	{
	            		IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, null);
	            	}
				}
			}
		}
	});
}

IG$/*mainapp*/._I86/*processLoginRSA*/ = function(userid, passwd, bg, mts, errcallback)
{
	var encpwd = IG$/*mainapp*/._I3c/*encryptkey*/([userid, passwd]); // CryptoJS.SHA1(passwd);
	// passwd = encpwd.toString(); //(CryptoJS.enc.Hex);
	
	var il_err = $("#il_err");
	il_err.hide();
	
	$.ajax({
		url: ig$/*appoption*/.servlet,
		data: {
			ack: "13",
			payload: "<smsg ptoken='' uuid=''><userid><![CDATA[" + encpwd[0] + "]]></userid><passwd><![CDATA[" + encpwd[1] + "]]></passwd></smsg>",
			mbody: "<smsg><option lang='" + useLocale + "' app='" + loadingApp + "' session_expire='" + (ig$/*appoption*/.session_expire || "0") + "' mts='" + (mts || "") + "'/></smsg>",
			uniquekey: IG$/*mainapp*/._I4a/*getUniqueKey*/()
		},
		type: "POST",
		dataType: "text",
		timeout: 30000,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		beforeSend: function(xhr, settings) {
		},
		cache: false,
		crossDomain: false,
		processData: true,
		timeout: 300000,
		error: function() {
			if (bg)
				bg.hide();
			alert("Error while connecting server");
		},
		success: function(doc) {
			var xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
				root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
				item = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
				ltoken,
				nuid,
				errcode = root ? IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errorcode") : null,
				redirect;
			
			if (bg)
			{
				bg.hide();
			}
			
			if (item)
			{
				ltoken = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "token");
				nuid = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "uid");
				
				redirect = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "redirect");
					
				if (redirect && redirect.length > 0)
				{
					window.location.replace(redirect);
				}
				else
				{
					alert("System Error:: Application is not defined on config.xml");
				}
			}
			else if (errcode)
			{
				var msg = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errormsg");
					
				if (errcode == "0x6d00")
            	{
            		il_err.unbind("click");
            		il_err.bind("click", function() {
            			il_err.hide();
            		});
            		il_err.show();
            		$(".igc-errorinfo-msg", il_err).html(msg);
            		
            		errcallback && errcallback.execute();
            	}
            	else if (errcallback)
            	{
            		errcallback.execute();
            	}
            	else
            	{
            		IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, null);
            	}
			}
		}
	});
}

IG$/*mainapp*/._I87/*checkServerInfo*/ = function(callback) {
	if (!ig$/*appoption*/.appInfo)
	{
		$.ajax({
			url: ig$/*appoption*/.servlet,
			data: {
				sreq: "version",
				uniquekey: IG$/*mainapp*/._I4a/*getUniqueKey*/()
			},
			dataType: "text",
			type: "GET",
			timeout: 30000,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			beforeSend: function(xhr, settings) {
			},
			cache: false,
			crossDomain: false,
			processData: true,
			error: function() {
				ig$/*appoption*/.appInfo = {
					appversion: "_._",
					apprelease: "_._.___"
				};
				
				callback && callback.call();
			},
			success: function(doc) {
				var xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
					root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
					tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/info");
				
				ig$/*appoption*/.appInfo = {
					appversion: tnode ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "version") : "0.0",
					apprelease: tnode ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "release") : "0.0.000"
				};
				
				callback && callback.call();
			}
		});
	}
	else
	{
		callback && callback.call();
	}
}

IG$/*mainapp*/._I88/*createLoginPanel*/ = function(d1, d2, addevent){
	var loginWindow = $("<div id='loginWindow' class='loginWindow'></div>"),
		i,
		lng = ig$/*appoption*/.lang, l,
		browser = window.bowser;
		
	if (browser.msie)
	{
		loginWindow.css({width: "100%", height: "100%"});
		if (ig$/*appoption*/.appbg)
		{
			var bg = $("<img src='./images/" + (ig$/*appoption*/.appbg) + "' class='background'/>");
			
			bg.css({
				width: "100%", height: "100%", position: "absolute", top: 0, left: 0
			});
			loginWindow.append(bg);
		}
	}
	
	if (lng)
	{
		for (i=0; i < lng.length; i++)
		{
			if (lng[i].code == useLocale)
			{
				l = lng[i];
				break;
			}
		}
	}
	
	// var loginBox = $("<div class='loginBox'></div>").appendTo(loginWindow);
	var loginForm, lf = "<div class='login-mc bounceInDown animated'>"
		+ "<div class='login-ic'>"
		+ "<img class='login-logo' src='./images/logo_7186.png'>"
		+ "<div id='user_lbl'>" + ((l && l.l1) ? l.l1 : "User ID") + "</div>"
		+ "<div id='pass_lbl'>" + ((l && l.l2) ? l.l2 : "Password") + "</div>"
		+ "<form name='login_form' id='login_form' rel='nofollow' target='temp' action=''>"
		+ "	<input id='userid' type='text' name='userid' value='" + (d1 || "") + "'>"
		+ "	<input id='userpassword' type='password' name='userpassword' value='" + (d2 || "") + "'>"
		+ "	<input id='login_btn' type='button' value='" + ((l && l.l3) ? l.l3 : "Login") + "'>"
		+ "</form>"
		+ "<div id='login_locale'><div class='locale_button'><span>Language</span>" // <div class='selbutton'></div>"
		+ "<select id='b_loc'>";
	
	if (lng)
	{
		for (i=0; i < lng.length; i++)
		{
			lf += "<option value='" + lng[i].code + "'" + (useLocale == lng[i].code ? " selected" : "") + ">" + lng[i].disp + "</option>"
		}
	}
		
	lf += "</select></div></div>"
		+ "<div id='license'>Licensed to: MPLIX</div>";

	lf += "</div>"; // login-ic
  	lf += "</div>";
  	
	loginForm = $(lf).appendTo(loginWindow).addClass("loginForm");
  	
	var legal = $("<div class='legal'>"
		+ "<table width='494' border='0' cellpadding='0' cellspacing='0'>"
		+ "  <tr>"
		+ "    <td width='78'>&nbsp;</td>"
		+ "    <td width='416' valign='top'><div align='left'>"
		+ "      <p class='style2'>" + ig$/*appoption*/.copy + "</p>"
		+ "      <p class='style1'><span class='style4'>For support please contact</span>"
		+ "      <a href='" + ig$/*appoption*/.companydomain + "' target='_new'>" + ig$/*appoption*/.companydomain + "</a></p>"
		+ "    </div></td>"
		+ "  </tr>"
		+ "</table></div>").appendTo(loginWindow);

	var build = $("<div class='build'>"
		+ "<div align='right'><span class='style6'>Build Id: <span id='app_release'" + (ig$/*appoption*/.appInfo && ig$/*appoption*/.appInfo.apprelease) + "</span></span></div>"
		+ "</div>").appendTo(loginWindow);
		
	var errorinfo = $("<div id='il_err' class='igc-errorinfo'><div class='igc-errorinfo-msg'></div></div>").appendTo(loginWindow);
	
	var progress = $("<div id='login-progress' class='login-progress'></div>")
		.css({position: "absolute", width:"100%", height: "100%", top: 0, left: 0, right: 0, bottom: 0})
		.hide().appendTo(loginWindow);
	
	if (window.IG$/*mainapp*/.cLogin)
	{
		window.IG$/*mainapp*/.cLogin(loginWindow);
	}
	
	$(document.body).append(loginWindow);
	
	IG$/*mainapp*/._I87/*checkServerInfo*/(function() {
		$("#app_release", build).text(ig$/*appoption*/.appInfo.apprelease);
	});
	
	setTimeout(function() {
		if (d1)
		{
			$("#userpassword").focus();
		}
		else
		{
			$("#userid").focus();
		}
	}, 200);
	
	$("#userpassword").bind("focus", function() {
		$("#userpassword").select();
	});
	
	$("#userid").bind("focus", function() {
		$("#userid").select();
	});
	
	$("#userpassword").bind("mouseup", function() {
		setTimeout(function() {
			$("#userpassword").select();
		}, 80);
	});
	
	$("#userid").bind("mouseup", function() {
		setTimeout(function() {
			$("#userid").select();
		}, 80);
	});
	
	if (addevent !== false)
	{
		$("#b_loc").bind("change", function(e) {
			var b_loc = $("#b_loc"),
				selvalue = $("option:selected", b_loc).val(),
				redirect = $(location).attr('href'),
				p, hv, h = {},
				k, v,
				i, s = false;
				
			if (selvalue && selvalue != window.useLocale)
			{
				if (redirect.indexOf("?") > -1)
				{
					p = redirect.substring(0, redirect.indexOf("?"));
					hv = redirect.substring(redirect.indexOf("?") + 1);
					h = hv.split("&");
					
					for (i=0; i < h.length; i++)
					{
						if (h[i].substring(0, 5) == "lang=")
						{
							h[i] = h[i].substring(0, 5) + selvalue;
							s = true;
							break;
						}
					}
					
					hv = h.join("&");
					
					redirect = p + "?" + hv;
				}
				
				if (s == true)
				{
					progress.show();
					
					setTimeout(function() {
						window.location.replace(redirect);
					}, 100);
				}
			}
		});
		
		$("#login_btn").bind("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			var userid = $("#userid").val(),
				passwd = $("#userpassword").val();
				
			$("#userpassword").val("");
			
	    	IG$/*mainapp*/._I83/*dlgLogin*/.rm1$8/*requestLoginKey*/.call(IG$/*mainapp*/._I83/*dlgLogin*/, userid, passwd, progress, window.m$mts);
			return false;
		});
		
		$("#userpassword").bind("keypress", function(e) {
			if (e.keyCode == 13)
			{
				var userid = $("#userid").val(),
					passwd = $("#userpassword").val();
					
				$("#userpassword").val("");
					
		    	IG$/*mainapp*/._I83/*dlgLogin*/.rm1$8/*requestLoginKey*/.call(IG$/*mainapp*/._I83/*dlgLogin*/, userid, passwd, progress, window.m$mts);
				return false;
			}
			
			return true;
		});
	}
	
	return loginWindow;
}

IG$/*mainapp*/._I89/*showLogin*/ = function(callback, rs)
{
//	if (window.mecapp)
//	{
//		$("#win-mask").css({display: "none"});
//	}
//	else
//	{
//	}
	
	$("#idv-mnu-pnl").hide();
	
	if (IG$/*mainapp*/._I83/*dlgLogin*/)
	{
		IG$/*mainapp*/._I83/*dlgLogin*/.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
			IG$/*mainapp*/._I83/*dlgLogin*/.tl = -1;
			IG$/*mainapp*/._I8b/*showLoginProc*/();
		});
	}
	
	if (window.hist)
	{
		window.hist.addHistory("");
	}
	
	var lform = $("#loginWindow"),
		browser = window.bowser;
		
	lform.css({zIndex: 99});
	if (browser.msie)
	{
		lform.css({position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", margin: 0, padding: 0});
	}
	lform.show();
}

IG$/*mainapp*/._I8a/*showLogout*/ = function(callback)
{
	if (IG$/*mainapp*/.msgint > -1)
	{
		clearInterval(IG$/*mainapp*/.msgint);
		IG$/*mainapp*/.msgint = -1;
	}
	
	IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("L_T_LOUT"), function(dlg) {
		if (dlg == "yes")
		{
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(null, 
				{
			        ack: "15",
			        payload: "",
			        mbody: ""
			    }, null, 
			    function(xdoc){
			    },
			    function(){
			    	return true;
		    });
			
			req._l/*request*/();
			
			IG$/*mainapp*/._I89/*showLogin*/(callback, 1);
		}
	});
}
var clsscript = {},
	fnglobal = {},
	__jsmod = {};

IG$/*mainapp*/.d$$mj/*dynscript*/ = function(uid) {
	this.uid = uid;
	this.lastError = null;
}

IG$/*mainapp*/.d$$mj/*dynscript*/.prototype = {
	_l5/*loadScript*/: function(js) {
		var me = this,
			doc = document,
			head = $('head'),
			jsmode,
			browser = window.bowser;
			
    	jsmode = __jsmod[me.uid];
    	
    	if (!jsmode)
    	{
    		jsmode = document.createElement('script'); // '<script id="clsscript" type="text/javascript"></script>');
    		jsmode.id = 'clsscript';
    		jsmode.type = 'text/javascript';
    		
    		head[0].appendChild(jsmode);
    		
    		__jsmod[me.uid] = jsmode;
    	}
    	
    	delete clsscript[me.uid];
		
		var jscontent = "function " + this.uid + "() {" + js + "} clsscript['" + this.uid + "'] = " + this.uid + ";";
		
		if (browser.msie)
		{
			jsmode.text = jscontent;
		}
		else
		{
			jsmode.innerHTML = jscontent;
		}
		
		delete fnglobal[me.uid];
		
		head[0].removeChild(jsmode);
		delete __jsmod[me.uid];
		
		var nfunc = {};
		
		try
		{
			var fn = clsscript[me.uid];
			fn.call(nfunc);
		}
		catch (e)
		{
			IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("E_SC_LD") + ": " + e.message);
		}
				
		fnglobal[this.uid] = nfunc;
	},
	
	_l6/*preparePrototype*/: function(controls, main) {
		var fn = fnglobal[this.uid];
		
		if (fn)
		{
			fn.controls = controls;
			fn.ptr_main = main;
			fn.parameters = main._9/*framecontent*/.page_param_map;
		}
	},
	
	_l7/*executeScript*/: function(scname) {
		var cdynscript = fnglobal[this.uid],
			args = arguments,
			r = true;
		
		args = Array.prototype.slice.call(args, 1);
		this.lastError = null;
		
		try
		{
			if (!cdynscript[scname])
			{
				this.lastError = "Function call: " + scname + " not found";
				return false;
			}
			r = cdynscript[scname].apply(cdynscript, args);
		}
		catch (e)
		{
			this.lastError = "Error: " + scname + "\n"
						   + this._l9/*printStackTrace*/().join('\n\n');
			return false;
		}
		
		return r;
	},
	
	_l8/*getFunctionList*/: function() {
		var cdynscript = fnglobal[this.uid],
			r = [],
			key,
			obj,
			objtype;
		
		if (cdynscript)
		{
			for (key in cdynscript)
			{
				obj = cdynscript[key];
				objtype = typeof(obj);
				
				if (objtype == "function")
				{
					r.push(key);
				}
			}
		}
		
		return r;
	},
	
	_l9/*printStackTrace*/: function() {
	  	var callstack = [],
	  		isCallstackPopulated = false;
	  	
	  	try {
	    	i.dont.exist+=0; //doesn't exist- that's the point
	  	} catch(e) {
	    	if (e.stack) { //Firefox
	      		var lines = e.stack.split('\n');
	      		for (var i=0, len=lines.length; i<len; i++) {
	        		if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
		          		callstack.push(lines[i]);
		        	}
	      		}
	      		//Remove call to printStackTrace()
	      		callstack.shift();
	      		isCallstackPopulated = true;
	    	}
	    	else if (window.opera && e.message) { //Opera
	      		var lines = e.message.split('\n');
	      		for (var i=0, len=lines.length; i<len; i++) {
	        		if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
	          			var entry = lines[i];
	          			//Append next line also since it has the file info
	          			if (lines[i+1]) {
	            			entry += ' at ' + lines[i+1];
	            			i++;
	          			}
	          			callstack.push(entry);
	        		}
	      		}
	      		//Remove call to printStackTrace()
	      		callstack.shift();
	      		isCallstackPopulated = true;
	    	}
	  	}
	  	if (!isCallstackPopulated) { //IE and Safari
			var currentFunction = arguments.callee.caller;
    		while (currentFunction) {
      			var fn = currentFunction.toString();
      			var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf('')) || 'anonymous';
      			callstack.push(fname);
      			currentFunction = currentFunction.caller;
    		}
	  	}
  		// output(callstack);
  		return callstack;
	}
}
IG$/*mainapp*/._IEFc/*formulas*/ = {
	t_sum: {
    	name: "t_sum",
    	title: "Subtotal",
    	expr: "SUM",
    	grp: "aggr"
    },
    t_avg: {
    	name: "t_avg",
    	title: "Average",
    	expr: "AVG",
    	grp: "aggr"
    },
    t_min: {
    	name: "t_min",
		title: "Minimum",
		expr: "MIN",
		grp: "aggr"
    },
    t_max: {
    	name: "t_max",
		title: "Maximum",
		expr: "MAX",
		grp: "grp"
    },
    t_pot: {
    	name: "t_pot",
		title: "Percent of total",
		usecolumnformat: false,
		formatstring: "#,##0.00 %",
		expr: "PERCENT_OF_TOTAL",
		grp: "pcnt"
    },
	t_cumul: {
		name: "t_cumul",
		title: "Cumulative Percentage",
		usecolumnformat: false,
		formatstring: "#,##0.00 %",
		expr: "CUMUL_PERCENT",
		grp: "pcnt"
	},
	t_incr: {
		name: "t_incr",
		title: "Incremental",
		expr: "INCR",
		grp: "pcnt"
	},
	t_diff: {
		name: "t_diff",
		title: "Difference",
		expr: "DIFF",
		grp: "pcnt"
	},
	t_rank: {
		name: "t_rank",
		title: "Ranking",
		expr: "RANK",
		grp: "pcnt"
	},
	
	t_stdev: {
		name: "t_stdev",
		title: "Standard Deviation",
		expr: "STDEV",
		grp: "stat",
		usecolumnformat: false,
		formatstring: "#,##0.00"
	},
	
	t_stdevp: {
		name: "t_stdevp",
		title: "Standard Deviation P",
		expr: "STDEVP",
		grp: "stat",
		usecolumnformat: false,
		formatstring: "#,##0.00"
	},
	
	t_percentile: {
		name: "t_percentile",
		title: "Percentile",
		expr: "PERCENTILE",
		grp: "stat",
		params: [
	        {name: "k", type: "float"}
		],
		usecolumnformat: false,
		formatstring: "#,##0.00"
	},
	t_percentile_exe: {
		name: "t_percentile_exe",
		title: "Percentile Excel",
		expr: "PERCENTILE_EXE",
		grp: "stat",
		params: [
	        {name: "k", type: "float"}
		],
		usecolumnformat: false,
		formatstring: "#,##0.00"
	}
};


IG$/*mainapp*/._IEF/*dlgFormulaSelector*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pbW, {
	
	modal: true,
	region:'center',
	"layout": "fit",
	
	closable: false,
	resizable: true,
	width: 650,
	height: 440,
	
	_ILb/*sheetoption*/: null,
	sheetindex: -1,
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			dt = [],
			i,
			grddata = me.down("[name=grddata]"),
			grddata_sel = me.down("[name=grddata_sel]"),
			rec, selrec = [],
			scodes = {},
			sel,
			fm = IG$/*mainapp*/._IEFc/*formulas*/,
			sop = me.pS,
			formulas = me.pF,
			pitem = me.pI,
			psel = me.pCC,
			ms;
			
		if (pitem)
		{
			$.each(fm, function(k, f) {
				dt.push(f);
			});
			
			grddata.store.loadData(dt);
			
			for (i=0; i < formulas.length; i++)
			{
				if (formulas[i].baseuid == pitem.uid)
				{
					selrec.push(formulas[i]);
				}
			}
			
			grddata_sel.store.loadData(selrec);
			
			if (psel)
			{
				ms = grddata_sel.store.data.items;
				
				for (i=0; i < ms.length; i++)
				{
					if (ms[i].get("baseuid") == psel.get("baseuid") && ms[i].get("fid") == psel.get("fid"))
					{
						me.c1/*configItem*/(ms[i]);
						break;
					}
				}
			}
		}
	},
	
	c1/*configItem*/: function(rec) {
		var me = this,
			_prop = me.down("[name=_prop]"),
			fm = IG$/*mainapp*/._IEFc/*formulas*/,
			prop,
			i, p,
			bf;
		
		$.each(fm, function(i, f) {
			if (f.expr == rec.get("expression"))
			{
				prop = f;
				return false;
			}
		});
		
		if (me._lprop)
		{
			bf = me.Cp/*confirmProperty*/();
			
			if (!bf)
				return;
		}
		
		me._lprop = {
			prop: prop,
			rec: rec
		};
		
		if (prop)
		{
			prop._params = [
				{
					name: "title",
					required: 1
				},
				{
					xtype: "checkbox",
					name: "showtoprow",
					fieldLabel: IRm$/*resources*/.r1("L_S_TROW")
				},
				{
					xtype: "checkbox",
					name: "groupresults",
					fieldLabel: IRm$/*resources*/.r1("L_S_GRST")
				},
				{
					xtype: "checkbox",
					name: "usecolumnformat",
					fieldLabel: " ",
					boxLabel: "Use Column Format"
				},
				{
					name: "formatstring",
					fieldLabel: IRm$/*resources*/.r1("L_FORMAT")
				},
				{
					name: "direction",
					xtype: "combobox",
					fieldLabel: IRm$/*resources*/.r1("L_C_DIR"),
					displayField: "name",
					valueField: "value",
					store: {
						fields: ["name", "value"],
						data: [
							{
								name: IRm$/*resources*/.r1("L_VERTICAL"),
								value: "vertical"
							},
							{
								name: IRm$/*resources*/.r1("L_HORIZONTAL"),
								value: "horizontal"
							}
						]
					}
				},
				{
					name: "separatecolumn",
					xtype: "checkbox",
					fieldLabel: IRm$/*resources*/.r1("L_SEP_COL")
				}
			];
			
			if (prop.params)
			{
				for (i=0; i < prop.params.length; i++)
				{
					p = prop.params[i];
					p.required = 1;
					prop._params.push(p);
				}
			}
			
			_prop.removeAll();
			
			$.each(prop._params, function(i, p) {
				var pval = rec.get(p.name) || "";
				
				if (p.xtype == "checkbox" && pval == "T")
				{
					pval = true;
				}
				
				_prop.add({
					xtype: p.xtype || "textfield",
					name: "field_" + i,
					fieldLabel: p.fieldLabel || p.name,
					store: p.store,
					value: pval,
					displayField: p.displayField,
					valueField: p.valueField,
					boxLabel: p.boxLabel
				});
			});
			
			_prop.show();
		}
		else
		{
			_prop.hide();
		}
	},
	
	Cp/*confirmProperty*/: function() {
		var me = this,
			_lprop = me._lprop,
			prop, params,
			rec,
			field, fval, pname,
			i,
			bf = 1;
		
		if (_lprop)
		{
			prop = _lprop.prop;
			params = prop._params;
			rec = _lprop.rec;
			
			if (params)
			{
				for (i=0; i < params.length; i++)
				{
					field = me.down("[name=field_" + i + "]");
					fval = field.getValue();
					
					pname = params[i].name;
					
					field.clearInvalid();
					
					if (params[i].required && !fval)
					{
						field.markInvalid("Required Field");
						return 0;
					}
					
					if (pname == "showtoprow" || pname == "groupresults")
					{
						fval = fval ? "T" : "F";
					}
										
					rec.set(pname, fval);
				}
			}
		}
		
		me._lprop = null;
		
		return bf;
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			grddata_sel = me.down("[name=grddata_sel]"),
			store = grddata_sel.store,
			sop = me.pS,
			sel = [],
			sf,
			bf = 0;
		
		sop.si = sop.si || 0;
		
		if (me._lprop)
		{
			bf = me.Cp/*confirmProperty*/();
			
			if (!bf)
				return;
		}
		
		for (i=0; i < store.data.items.length; i++)
		{
			sf = new IG$/*mainapp*/._IF0/*clSheetFormula*/();
			sf.p1/*getRecord*/.call(sf, store.data.items[i]);
			sf.fid = "formula_" + (sop.si++);
			sel.push(sf);
		}
			
		me.__dloaded = false;
		me.callback && me.callback.execute(sel);
		
		me.close();
	},
	
	A1/*addFormula*/: function(sel) {
		var me = this,
			grddata = me.down("[name=grddata]"),
			grddata_sel = me.down("[name=grddata_sel]"),
			sop = me.pS,
			fdef = IG$/*mainapp*/._IEFc/*formulas*/,
			rec,
			i,
			msel = [], mrec,
			nformula,
			tobj,
			rname;
		
		sop.si = sop.si || 0;
		
		for (i=0; i < sel.length; i++)
		{
			rec = sel[i];
			nformula = {
				title: rec.get("title"),
				expression: rec.get("expr"),
				baseuid: me.pI.uid
			};
			
			rname = rec.get("name");
			
			nformula.direction = "vertical";
			nformula.formatstring = "";
			nformula.stylename = null;
			nformula.separatecolumn = true;
			nformula.subtotalbase = null;
			nformula.usecolumnformat = true;
			nformula.showtoprow = "F";
			nformula.groupresults = "F";
			nformula.fid = "formula_" + (sop.si++);
			
			tobj = fdef[rname];
			
			if (tobj)
			{
				if (typeof(tobj.usecolumnformat) != "undefined")
				{
					nformula.usecolumnformat = tobj.usecolumnformat;
				}
				
				if (typeof(tobj.formatstring) != "undefined")
				{
					nformula.formatstring = tobj.formatstring;
				}
			}
			
			mrec = grddata_sel.store.add(nformula);
			msel.push(mrec);
		}
		
		if (msel.length)
		{
			me.c1/*configItem*/(msel[msel.length-1]);
		}
		
		grddata.clearSelection();
	},
	
	_ic/*initComponent*/ : function() {
		var me = this;
			
		me.title = IRm$/*resources*/.r1('T_FM_SEL');
		
		IG$/*mainapp*/.apply(this, {
			items: [
				{
					xtype: "container",
					padding: 10,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "displayfield",
							height: 20,
							value: IRm$/*resources*/.r1('L_DYN_SELECT')
						},
						{
							xtype: "container",
							layout: {
								type: "hbox",
								align: "stretch"
							},
							flex: 1,
							items: [
							    {
							    	xtype: "container",
							    	layout: {
							    		type: "vbox",
							    		align: "stretch"
							    	},
							    	flex: 1,
							    	items: [
										{
											xtype: "combobox",
											fieldLabel: "Formula Group",
											displayField: "name",
											valueField: "value",
											store: {
												xtype: "store",
												fields: ["name", "value"],
												data: [
												    {name: "All Formula", value: ""},
												    {name: "Mostly used", value: "aggr"},
												    {name: "Percentage", value: "pcnt"},
												    {name: "Statistics", value: "stat"}
												]
											},
											listeners: {
												change: function(tobj) {
													var me = this,
														tval = tobj.getValue(),
														grddata = me.down("[name=grddata]");
													
													if (tval)
													{
														grddata.filter({name: "grp", value: tval});
													}
													else
													{
														grddata.filter();
													}
												},
												scope: this
											}
										},
										{
											xtype: "gridpanel",
											name: "grddata",
											selMode: {
												mode: "SINGLE"
											},
											store: {
												xtype: "store",
												fields: [
													"sel", "name", "title", "expr"
												]
											},
											flex: 1,
											columns: [
												{
													xtype: "checkcolumn",
													dataIndex: "sel",
													width: 30
												},
											    {
											    	text: "Name",
											    	dataIndex: "title",
											    	flex: 1
											    }
											]
										}
							    	]
							    },
							    {
							    	xtype: "container",
							    	width: 30,
							    	padding: 3,
							    	layout: {
							    		type: "vbox",
							    		align: "middle"
							    	},
							    	items: [
							    	    {
							    	    	xtype: "container",
							    	    	flex: 1
							    	    },
								    	{
								    		xtype: "button",
								    		text: " > ",
								    		height: 25,
								    		handler: function() {
								    			var me = this,
								    				grddata = me.down("[name=grddata]"),
								    				sm = grddata.getSelectionModel(),
								    				sel = sm.selected;
								    			
								    			me.A1/*addFormula*/(sel);
								    		},
								    		scope: this
								    	},
								    	{
								    		xtype: "container",
								    		flex: 1
								    	}
							    	]
							    },
							    {
							    	xtype: "container",
							    	layout: {
							    		type: "vbox",
							    		align: "stretch"
							    	},
							    	flex: 1,
							    	items: [
										{
											xtype: "displayfield",
											height: 20,
											value: IRm$/*resources*/.r1('L_DYN_SELECT')
										},
										{
											xtype: "gridpanel",
											name: "grddata_sel",
											selMode: me.selMode,
											store: {
												xtype: "store",
												fields: [
													"sel", "name", "title",
													"baseuid", "direction", "stylename", "expression",
													"type", "fid", "formatstring",
													"showtoprow",
													"groupresults", "quart", "k"
												]
											},
											flex: 1,
											columns: [
												{
													xtype: "checkcolumn",
													dataIndex: "sel",
													width: 30
												},
											    {
											    	text: "Title",
											    	dataIndex: "title",
											    	flex: 1
											    },
											    {
											    	text: "Expression",
											    	dataIndex: "expression",
											    	width: 120
											    },
											    {
											    	xtype: "actioncolumn",
											    	width: 70,
											    	items: [
												    	{
												    		iconCls: "icon-grid-config",
												    		handler: function(grid, rindex, cindex, rec) {
												    			var me = this;
												    			me.c1/*configItem*/(rec);
												    		},
												    		scope: this
												    	},
												    	{
												    		iconCls: "icon-grid-delete",
												    		handler: function(grid, rindex, cindex, rec) {
												    			var store = grid.store;
												    			
												    			store.remove(rec);
												    		},
												    		scope: this
												    	}
											    	]
											    }
											]
										},
										{
											xtype: "container",
											name: "_prop",
											hidden: true,
											layout: {
												type: "vbox",
												align: "stretch"
											},
											items: [
											]
										}
							    	]
							    }
							]
						}
					]
				}
			],
			
			buttons:[
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this._IFf/*confirmDialog*/();
					},
					scope: this
				}, {
					text: IRm$/*resources*/.r1('B_CANCEL'),
					handler:function() {
						this.close();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function(ui) {
					me._IFe/*initF*/.call(me);
				}
			}
		});
		
		IG$/*mainapp*/._IEF/*dlgFormulaSelector*/.superclass._ic/*initComponent*/.apply(this, arguments);
	}
});
IG$/*mainapp*/._Iec/*dynFilter*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pbW, {
	
	modal: true,
	region:'center',
	"layout": "fit",
	
	closable: false,
	resizable: true,
	width: 450,
	height: 400,
	
	_ILb/*sheetoption*/: null,
	sheetindex: -1,
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			dt = [],
			i,
			grddata = me.down("[name=grddata]"),
			rec, selrec = [],
			scodes = {},
			sel,
			fi = me.filteritem;
			
		if (fi && fi.data)
		{
			for (i=0; i < fi.data.length; i++)
			{
				dt.push({
					code: fi.data[i].code,
					value: fi.data[i].disp || fi.data[i].code
				});
			}
			
			grddata.store.loadData(dt);
			
			sel = fi.selection;
			
			if (sel && sel.length > 0)
			{
				for (i=0; i < sel.length; i++)
				{
					scodes[sel[i].code] = sel[i];
				}
				
				for (i=0; i < grddata.store.data.items.length; i++)
				{
					rec = grddata.store.data.items[i];
					if (scodes[rec.get("code")])
					{
						selrec.push(rec);
					}
				}
				
				grddata.select(selrec);
			}
		}
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			grddata = me.down("[name=grddata]"),
			selmodel = grddata.getSelectionModel(),
			sel = selmodel.selected;
			
		me.__dloaded = false;
		me.callback && me.callback.execute(sel);
		
		me.close();
	},
	
	_ic/*initComponent*/ : function() {
		var me = this,
			lwidth = 160,
			cols = [
				{
			    	xtype: "checkcolumn",
			    	dataIndex: "sel",
			    	width: 30
			    }
			],
			cwidth = ig$/*appoption*/.valueselect ? ig$/*appoption*/.valueselect.width : null;
			
		me.title = IRm$/*resources*/.r1('T_DYN_SELECT');
		me.smode = me.smode || "codevalue";
		
		switch (me.smode)
		{
		case "code":
			cols.push({
				text: "Code",
				dataIndex: "code",
				flex: 1
			});
			break;
		case "value":
			cols.push({
				text: "Value",
				dataIndex: "value",
				flex: 1
			});
			break;
		case "valuecode":
			cols.push({
				text: "Value",
				dataIndex: "value",
				flex: 1
			});
			
			cols.push({
				text: "Code",
				dataIndex: "code",
				flex: cwidth ? null : 1,
				width: cwidth ? cwidth : null
			});
			break;
		default:
			cols.push({
				text: "Code",
				dataIndex: "code",
				flex: cwidth ? null : 1,
				width: cwidth ? cwidth : null
			});
			
			cols.push({
				text: "Value",
				dataIndex: "value",
				flex: 1
			});
			break;
		}
		
		IG$/*mainapp*/.apply(this, {
			items: [
				{
					xtype: "container",
					padding: 10,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "displayfield",
							height: 20,
							value: IRm$/*resources*/.r1('L_DYN_SELECT')
						},
						{
							xtype: "gridpanel",
							name: "grddata",
							selMode: me.selMode,
							store: {
								xtype: "store",
								fields: [
									"code", "value", "sel"
								]
							},
							flex: 1,
							columns: cols
						}
					]
				}
			],
			
			buttons:[
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this._IFf/*confirmDialog*/();
					},
					scope: this
				}, {
					text: IRm$/*resources*/.r1('B_CANCEL'),
					handler:function() {
						this.close();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function(ui) {
					me._IFe/*initF*/.call(me);
				}
			}
		});
		
		IG$/*mainapp*/._Iec/*dynFilter*/.superclass._ic/*initComponent*/.apply(this, arguments);
	}
});

IG$/*mainapp*/._IeFc/*common_filehandler*/ = {
};

IG$/*mainapp*/._IeF/*dynfilterFileLoader*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pbW, {
	
	modal: true,
	region:'center',
	"layout": "fit",
	
	closable: false,
	resizable: true,
	width: 450,
	height: 400,
	
	_ILb/*sheetoption*/: null,
	sheetindex: -1,
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			dt = [],
			i,
			grddata = me.down("[name=grddata]"),
			rec, selrec = [],
			scodes = {},
			sel,
			fi = me.filteritem,
			req;
			
		me.A/*initOptions*/();
		
		if (fi && fi.uid)
		{
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me,
				{
					ack: "11",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: fi.uid}),
					mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "ftables"})
				}, me, function(xdoc) {
					var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/item");
						
					if (tnode)
					{
						fi.__tbuid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid");
						
						if (fi.__tbuid)
						{
							me._l4m/*showColumnInfo*/();
							me._l6/*loadHistory*/(fi.__tbuid);
						}
					}
				});
			req._l/*request*/();
		}
		
		if (fi && fi.data)
		{
			for (i=0; i < fi.data.length; i++)
			{
				dt.push({
					code: fi.data[i].code,
					value: fi.data[i].disp || fi.data[i].code
				});
			}
			
			grddata.store.loadData(dt);
			
			sel = fi.selection;
			
			if (sel && sel.length > 0)
			{
				for (i=0; i < sel.length; i++)
				{
					scodes[sel[i].code] = sel[i];
				}
				
				for (i=0; i < grddata.store.data.items.length; i++)
				{
					rec = grddata.store.data.items[i];
					if (scodes[rec.get("code")])
					{
						selrec.push(rec);
					}
				}
				
				grddata.select(selrec);
			}
		}
	},
	
	A/*initOptions*/: function() {
		var me = this,
			_m4 = me.down("[name=_m4]"),
			_m4_el = _m4.body.dom,
			m_fileupload,
			fileupload,
			dropzone,
			d_progress,
			i;
			
		fileupload = $("#fileupload", _m4_el);
		d_progress = $("#d_progress", _m4_el);
		
		fileupload.fileupload({
			url: ig$/*appoption*/.servlet,
	        dataType: "text",
	        formData: {
	        	_mts_: IG$/*mainapp*/._g$a/*global_mts*/ || ""
	        },
	        done: function (e, data) {
	        	var doc = data.result || '<smsg errorcode="0xffff" errormsg="Server incorrect responding"/>',
					xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
					errcode = IG$/*mainapp*/._I27/*getErrorCode*/(xdoc),
					tnode, tnodes,
					i, dp = [], p;
				
				if (errcode)
				{
					IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, me, null);
				}
				else
				{
					tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg");
					
					if (tnode)
					{
						tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
						for (i=0; i < tnodes.length; i++)
						{
							p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
							dp.push(p);
						}
					}
				}
				
				me._l1/*loadDataSet*/.call(me, dp);
	        },
	        progressall: function (e, data) {
	            var progress = parseInt(data.loaded / data.total * 100, 10),
	            	bar = $(".bar", d_progress);
	            bar.css(
	                "width",
	                progress + "%"
	            );
	            bar.text("Loaded " + data.loaded + " / " + data.total);
	        }
	    }).bind('fileuploadsubmit', function (e, data) {
	    });
	    
	    fileupload.fileupload("option", "url", ig$/*appoption*/.servlet);
	},
	
	_l1/*loadDataSet*/: function(dp) {
		var me = this,
			i, k;
			
		if (dp)
		{	
			for (i=0; i < dp.length; i++)
			{
				k = dp[i];
				if (k.filename.substring(0, "{ENC}".length) == "{ENC}")
				{
					k.filename = k.filename.substring("{ENC}".length);
					k.filename = Base64.decode(k.filename);
				}
			}
			
			if (dp.length)
			{
				me._l7/*loadFileToTable*/(dp);
			}
		}
	},
	
	_l7/*loadFileToTable*/: function(rec) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			delimiter = null,
			regfile = null,
			file_encoding = null,
			fuid = [],
			i,
			fi = me.filteritem;
			
		me.setLoading(true, true);
		
		for (i=0; i < rec.length; i++)
		{
			fuid.push(rec[i].uid);
		}
		
		if (fuid.length == 0)
			return;
		
		if (!fi || (fi && !fi.__tbuid))
			return;
				
		// store content in separate uid
		req.init(me, 
			{
				ack: "27",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({
					tuid: fi.__tbuid,
					uid: fuid.join(";")
				}, "uid;tuid"),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "loaddatacontent"})
			}, me, function(xdoc) {
				me._l4/*loadColumnInfo*/();
			}
		);
		
		req._l/*request*/();
	},
	
	_l4m/*showColumnInfo*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			fi = me.filteritem;
		
		if (fi && fi.__tbuid)
		{
			req.init(me, 
				{
			        ack: "25",
			        payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: fi.__tbuid, option: "StoredContent"}, "uid;option"),
			        mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "StoredContent"})
			    }, me, function(xdoc) {
			    	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			    		onode = tnode ? IG$/*mainapp*/._I18/*XGetNode*/(tnode, "objinfo") : null,
						tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode, "Field") : null,
						objinfo = onode ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(onode) : null,
						i,
						p,
						dp = [],
						n = 0,
						_mt = me.down("[name=_mt]"),
						tcol = [];
					
					if (tnodes)
					{
						for (i=0; i < tnodes.length; i++)
						{
							p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
							
							if (p.name == objinfo.file_field || p.name == objinfo.seq_field)
								continue;
							
							p.seq = ++n;
							tcol.push(p.name);
							dp.push(p);
						}
					}
					
					_mt.setValue(tcol.join("\t"));
			    }, false);
			req._l/*request*/();
		}
	},
	
	_l6/*loadHistory*/: function(uid) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			grddata = me.down("[name=grddata]");
		
		me.setLoading(true, true);
		
		req.init(me, 
			{
				ack: "11",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid, option: "ftable_hist"}, "uid;option"),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "ftable_hist"})
			}, me, function(xdoc) {
				var me = this,
					tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
					m2 = me.down("[name=m2]"),
					i, j, dp = [],
					p, tn, c, v, mnode;

				if (tnodes)
				{
					for (i=0; i < tnodes.length; i++)
					{
						mnode = tnodes[i];
						
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(mnode);
						tn = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
						
						if (tn)
						{
							for (j=0; j < tn.length; j++)
							{
								c = IG$/*mainapp*/._I29/*XGetNodeName*/(tn[j]);
								v = IG$/*mainapp*/._I24/*getTextContent*/(tn[j]);
								
								p[c] = v;
							}
						}
						
						dp.push(p);
					}
				}
				
				grddata.store.loadData(dp);
			}
		);
		
		req._l/*request*/();
	},
	
	d1/*deleteHistory*/: function(rec, grid) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		me.setLoading(true, true);
		
		req.init(me, 
			{
				ack: "11",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: rec.get("uid"), option: "ftable_rm"}, "uid;option"),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "ftable_rm"})
			}, me, function(xdoc) {
				me._l4/*loadColumnInfo*/();
			}
		);
		
		req._l/*request*/();
	},
	
	_l4/*loadColumnInfo*/: function() {
		var me = this,
			fi = me.filteritem;
		
		if (fi && fi.__tbuid)
		{
			me._l6/*loadHistory*/(fi.__tbuid);
		}
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			grddata = me.down("[name=grddata]"),
			selmodel = grddata.getSelectionModel(),
			sel = selmodel.selected,
			i;
		
		for (i=0; i < sel.length; i++)
		{
			sel[i].set("code", sel[i].get("uname"));
			sel[i].set("value", sel[i].get("fname"));
		}
			
		me.__dloaded = false;
		me.callback && me.callback.execute(sel);
		
		me.close();
	},
	
	_ic/*initComponent*/ : function() {
		var me = this,
			lwidth = 160;
			
		me.title = IRm$/*resources*/.r1('T_DYN_LFILE');
		
		IG$/*mainapp*/.apply(this, {
			items: [
				{
					xtype: "container",
					padding: 10,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "displayfield",
							height: 20,
							value: IRm$/*resources*/.r1('L_DYN_LFILE')
						},
						{
							xtype: "container",
							html: "<div class='igc-o-dzone' id='_tb_f' style='padding:5px;'>"
								+ "<input type='file' id='fileupload' name='files[]' data-url='upload' multiple></input>"
								+ "<div class='file-progress' id='d_progress' style='height:20px;'><div class='bar' style='width: 0%;'></div></div>"
								+ "</div>",
							name: "_m4",
							height: 55
						},
						{
							xtype: "textarea",
							fieldLabel: "Headers",
							name: "_mt",
							height: 60
						},
						{
							xtype: "gridpanel",
							name: "grddata",
							selMode: me.selMode,
							store: {
								xtype: "store",
								fields: [
									"fname", "sel", "rowcount", "uname", "code", "value"
								]
							},
							flex: 1,
							columns: [
								{
							    	xtype: "checkcolumn",
							    	dataIndex: "sel",
							    	width: 30
							    },
							    {
							    	text: "File name",
							    	dataIndex: "fname",
							    	flex: 1
							    },
							    {
							    	text: "Rows",
							    	dataIndex: "rowcount",
							    	width: 50
							    }
							]
						}
					]
				}
			],
			
			buttons:[
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this._IFf/*confirmDialog*/();
					},
					scope: this
				}, {
					text: IRm$/*resources*/.r1('B_CANCEL'),
					handler:function() {
						this.close();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function(ui) {
					me._IFe/*initF*/.call(me);
				}
			}
		});
		
		IG$/*mainapp*/._IeF/*dynfilterFileLoader*/.superclass._ic/*initComponent*/.apply(this, arguments);
	}
});
IG$/*mainapp*/._Iea/*dynFilterDateConfig*/ = {
	data: [
		{name: "Today", value: "today"},
		{name: "Last 1 days", value: "last1day"},
		{name: "Last 2 days", value: "last2day"},
		{name: "Last 3 days", value: "last3day"},
		{name: "Last 4 days", value: "last4day"},
		{name: "Last 5 days", value: "last5day"},
		{name: "Last 6 days", value: "last6day"},
		{name: "Last 7 days", value: "last7day"},
		{name: "Last 8 days", value: "last8day"},
		{name: "Last 10 days", value: "last10day"},
		{name: "From monday", value: "frweek"},
		{name: "Last 15 days", value: "last15day"},
		{name: "Last 30 days", value: "last30day"},
		{name: "From 1st month", value: "frmon"},
		{name: "Last 1 month", value: "last1mon"},
		{name: "Last 2 month", value: "last2mon"},
		{name: "Last 6 month", value: "last6mon"},
		{name: "Last 1 year", value: "last1year"},
		{name: "Last 2 year", value: "last2year"},
		{name: "Last 3 year", value: "last3year"},
		{name: "Last 4 year", value: "last4year"},
		{name: "Last 5 year", value: "last5year"}
	],
	getValue: function(sel, st, ismonth, isyear) {
		var i,
			r = "",
			dt = new Date(),
			m, d, p;
			
		if (st == 0)
		{
			if (sel.indexOf("last") > -1)
			{
				if (sel.indexOf("day") > 0)
				{
					for (i=1; i < 32; i++)
					{
						if (sel == "last" + (i) + "day")
						{
							dt.setDate(dt.getDate()-i);
							p = 1;
							break;
						}
					}
				}
				
				if (!p && sel.indexOf("mon") > 0)
				{
					for (i=1; i < 13; i++)
					{
						if (sel == "last" + i + "mon")
						{
							dt.setMonth(dt.getMonth() - i);
							p = 1;
							break;
						}
					}
				}
				
				if (!p && sel.indexOf("year") > 0)
				{
					for (i=1; i < 11; i++)
					{
						if (sel == "last" + i + "year")
						{
							dt.setMonth(dt.getMonth() - 12*i);
							p = 1;
							break;
						}
					}
				}
			}
			
			if (!p)
			{
				switch(sel)
				{
				case "today":
					break;
				case "frweek":
					startDay = 0;
					dt.setDate(dt.getDate()-(7 + dt.getDay() - startDay) % 7);
					break;
				case "frmon":
					dt.setDate(1);
					break;
				}
			}
		}
		
		m = (dt.getMonth()+1);
		m = (m < 10 ? "0" + m : m);
		d = dt.getDate();
		d = (d < 10 ? "0" + d : d);
		r = "" + dt.getFullYear() + "-" + m + "-" + d;
		
		if (isyear)
		{
			r = "" + dt.getFullYear();
		}
		else if (ismonth)
		{
			r = "" + dt.getFullYear() + "-" + m;
		}
		else
		{
			r = "" + dt.getFullYear() + "-" + m + "-" + d;
		}
		
		return r;
	}
};

IG$/*mainapp*/._Ied/*dynFilterView*/ = function(container, sop, report, isdashboard) {
	var me = this;
	
	me.report = report;
	me.dzone = (report ? report.dzone : null);
	
	me._b1/*isdashboard*/ = isdashboard;
	me.container = container;
	me.utimer = -1;
	me._ILb/*sheetoption*/ = sop;
	
	me.v1/*updateValues*/ = true;
	
	if (me.dzone)
	{
		me._s1/*setDocZone*/(me.dzone);
	}
};

IG$/*mainapp*/._Ied/*dynFilterView*/.prototype = {
	_rcs: [],
	
	_s1/*setDocZone*/: function(dzone) {
		var me = this;
		
		if (!me.dzone && dzone && dzone.b1/*box*/)
		{
			me.dzone = dzone;
			me.dzone.b1/*box*/.bind("updatecomplete", function() {
				me.ll1/*updateViewSelector*/.call(me);
			});
		}
	},
	
	exportSheet: function(filetype) {
    	var me = this;
    	
    	me.container.trigger("export_sheet", [me, {filetype: filetype}]);
    },
	
	_IFd/*init_f*/: function(firstrun) {
		var me = this,
			el,
			_ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
		
		$(me.container).empty();
		
		me.c/*contentarea*/ = $("<div></div>").appendTo(me.container);
		me.sp/*splash*/ = $("<div class='idv-dfilt-splash'></div>")
			.appendTo(me.container)
			.hide();
		
		el = me.c/*contentarea*/[0];
		
		if (!_ILb/*sheetoption*/)
		{
			return;
		}
		
		_ILb/*sheetoption*/.pff1/*filterItems*/ = _ILb/*sheetoption*/.pff1/*filterItems*/ || [];
		
		_ILb/*sheetoption*/.pff1a/*filteroptions*/ = _ILb/*sheetoption*/.pff1a/*filteroptions*/ || {};
		
		if (!me._b1/*isdashboard*/ && $s.dropzone)
		{
			me.dropZone = $s.create($s.dropzone, el, {
				ddGroup: '_I$RD_G_',
				
				nodeouttimer: -1,
				
				getTargetFromEvent: function(e) {
					var px = e.browserEvent.pageX || e.browserEvent.clientX,
		        		py = e.browserEvent.pageY || e.browserEvent.clientY,
		        		renderer = el;

		            return renderer;
		        },
		        
		        onNodeEnter : function(target, dd, e, data){
		        	var i,
		        		dt, dttype,
		        		accept = false,
		        		recs = data.records;
		        		
		        	if (recs && recs.length > 0)
		        	{
		        		dt = recs[0].data;
		        		dttype = dt.type.toLowerCase();
		        		accept = true;
		        	}
		        	else if (data.cellData)
		        	{
		        		dt = data.cellData;
		        		accept = true;
		        	}

		        	this.accept = accept;
		        },
		        onNodeOver : function(target, dd, e, data){
		        	var dt,
		        		accept = this.accept,
		        		ret = (window.Ext ? (accept ? Ext.dd.DropZone.prototype.dropAllowed : Ext.dd.DropZone.prototype.dropNotAllowed) : accept),
		        		recs = data.records;
		        		
		        	if (accept == true)
		        	{
		        		if (recs && recs.length > 0)
		        		{
		        			dt = recs[0].data;
		        		}
		        		else
		        		{
		        			dt = data.cellData;
		        		}
		        	}
		            return ret;
		        },
		        onNodeDrop : function(target, dd, e, data){
		        	var m = this,
		        		recs = data.records;
		            if (m.accept == true)
		            {
		            	if (recs && recs.length > 0)
		        		{
		        			dt = recs[0].data;
		        		}
		        		else
		        		{
		        			dt = data.cellData;
		        		}
		            	
		            	me.l2/*appendFiltering*/.call(me, dt);
		            }
		            
		            me.accept = false;
		            return true;
		        }
			});
		}
		
		setTimeout(function() {
			me.l3/*validateItems*/.call(me, undefined, firstrun);
		}, 100);
	},
	
	rX/*removeObj*/: function() {
	},
	
	setSize: function(w, h) {
		var me = this;
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.c/*contentarea*/, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.c/*contentarea*/, h);
		me.l4/*updateDisplay*/.call(me);
	},
	
	
	
	g1a/*getDefaultDate*/: function(dformat) {
		var c = new Date(),
			m,
			dy, dm, dd, op, opval,
			bp = 0;
		
		if (dformat.length == 8 && IG$/*mainapp*/._I37/*isNumber*/(dformat))
		{
			dy = dformat.substring(0, 4);
			dm = dformat.substring(4, 6);
			dd = dformat.substring(6, 8);
				
			c = new Date(parseInt(dy), parseInt(dm)-1, parseInt(dd));
		}
		else
		{
			if (dformat.indexOf("cdate") > -1)
			{
				dy = c.getFullYear();
				dm = c.getMonth();
				dd = c.getDate();
				
				if (dformat.indexOf("-") > -1 || dformat.indexOf("+") > -1)
				{
					m = dformat.indexOf("-") || dformat.indexOf("+");
					
					op = dformat.substring(m, m+1);
					opval = dformat.substring(m+1);
					
					if (op && opval)
					{
						$.each(["y", "m", "d", ""], function(i, k) {
							if (!bp)
							{
								m = (k ? opval.indexOf(k) : -1);
								
								if (m > -1 || k == "")
								{
									opval = m > -1 ? opval.substring(0, m) : opval;
									opval = parseInt(opval);
									if (opval)
									{
										switch (k)
										{
										case "y":
											dy = (op == "+") ? dy + opval : dy - opval;
											break;
										case "m":
											dm = (op == "+") ? dm + opval : dm - opval;
											break;
										default:
											dd = (op == "+") ? dd + opval : dd - opval;
											break;
										}
									}
									bp = 1;
								}
							}
						});
						
						c = new Date(parseInt(dy), parseInt(dm), parseInt(dd));
					}
				}
			}
			else
			{
				try
				{
					m = eval("(function() {" + dformat + "}())");
					
					if (m)
					{
						c = m;
					}
				}
				catch (e)
				{
					IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_DEF_DATE'), null, null, 1, "error");
				}
			}
		}
		
		return c;
	},
	
	g1/*getRangeLabel*/: function(label, i, bf, rangevalue) {
		var t = null,
			m = "",
			v;
		if (rangevalue && label && label.length > i && label[i])
		{
			v = label[i];
			if (bf == 2 || (bf == 1 && v.substring(0, 1) == "_") || (bf == 0 && v.substring(0, 1) != "_"))
			{
				t = {};
				
				if (bf == 1)
				{
					v = v.substring(1);
				}
				
				t.t = v;
				
				if (v && v.length > 1 && v.charAt(0) == "@")
				{
					v = IRm$/*resources*/.r1(v);
					t.e = 1;
				}
				
				if (bf != 2 && rangevalue != 2)
				{
					m = "<td class='igc-f-range-label-td'>";
				}
				
				m += "<span class='igc-f-range-label f-label_" + i + (bf < 2 ? "_" + bf : "") + "'>" + v + "</span>";
				
				if (bf != 2 && rangevalue != 2)
				{
					m += "</td>";
				}
				
				t.d = m;
			}
		}
		return t;
	},
	
	g1c/*getRangeCol*/: function(label, i, bf, rangevalue) {
		var r = "";
		if (rangevalue && label && label.length > i && label[i])
		{
			v = label[i];
			if (bf == 2 || (bf == 1 && v.substring(0, 1) == "_") || (bf == 0 && v.substring(0, 1) != "_"))
			{
				r = "<col width='40px'></col>";
			}
		}
		
		return r;
	},
	
	l1/*createFilterUI*/: function(filter, mcap, lfilter, viewtype) {
		var me = this,
			ui, i,
			title,
			me = this,
			p = me.p/*parentUI*/,
			clearbtn,
			filteroptions = me._ILb/*sheetoption*/.pff1a/*filteroptions*/,
			showbutton = filteroptions.showbutton,
			f_b_evt = !showbutton && filteroptions.f_b_evt == "T" ? 1 : 0,
			f_b_trg = showbutton && filteroptions.f_b_trg == "T" ? 1 : 0,
			f_b_trg_all = f_b_trg && filteroptions.f_b_trg_all == "T" ? 1 : 0,
			// showrefresh = filteroptions.showrefresh,
			showpopup = filter.showpopup,
			sctrl,
			t,
			ptn,
			rangevalue = filter.rangevalue,
			rangelabel = filter.rangelabel,
			dateseltype = filter.dateseltype,
			browser = window.bowser,
			s1a, s1b, s1c,
			t, mtr, mtd;
			
		if (me.__dx == true)
			return;
		
		if (rangelabel)
		{
			rangelabel = rangelabel.split("^");
		}
		
		switch (filter.objtype)
		{
		case "slider":
			// mcap.height(20);
			s1a = filter.s1a ? Number(filter.s1a) : 0;
			s1b = filter.s1b ? Number(filter.s1b) : 100;
			s1c = filter.s1c ? Number(filter.s1c) : 1;
			ui = $("<div></div>").css({position: "relative", marginLeft: 5, marginRight: 5, marginTop: 7}).slider({
				orientation: "horizontal",
				range: true,
				min: s1a,
				max: s1b,
				values: [s1a, s1b],
				step: s1c,
				create: function(event, ctrl) {
					me.l8/*updateSlideValue*/.call(me, this);
				},
				
				slide: function(event, ctrl) {
					var loffset = $(this).offset(),
						offset = $(ctrl.handle).offset(),
						l = offset.left - loffset.left;
					
					me.l8a/*updateSlideValue*/.call(me, this, ctrl, l);
				},
				
				change: function(event, ctrl) {
					if (filter.iV/*updateValues*/ == true)
						return;
					me.l8/*updateSlideValue*/.call(me, this);
					
					me.l5a/*updateHierarchy*/.call(me, filter);
					
					if (!showbutton && !f_b_evt)
					{
						me.l5/*updateFilterValues*/.call(me);
					}
				},
				
				start: function(event, ctrl) {
					var loffset = $(this).offset(),
						offset = $(ctrl.handle).offset(),
						l = offset.left - loffset.left;
					$("<div class='guide'></div>").css({position: "absolute", top: -18, left: l}).appendTo(this);
				},
				
				stop: function(event, ctrl) {
					var guide = $(this).children(".guide");
					
					if (guide)
					{
						guide.remove();
					}
				}
			});
			break;
		case "combobox":
			if (showpopup == true)
			{
				ui = $("<div></div>");
				var tin = $("<input type='text' class='idv-checkbox-inp'></input>").appendTo(ui);
				tin.css({"float": "left"});
				var tbtn = $("<div class='idv-btn-selected'></div>").appendTo(ui);
				tbtn.bind("click", function(e) {
					e.stopPropagation();
					var dlg = new IG$/*mainapp*/._Iec/*dynFilter*/({
						selMode: "SINGLE",
						smode: filter.smode,
						callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_PM/*checkpopup*/, filter),
						filteritem: filter
					});
					IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
				});
			}
			else
			{
				ui = $("<table class='idv-sel-combo" + (rangevalue ? " idv-sel-rangevalue" : "") + "'>" + (me.g1c/*getRangeCol*/(rangelabel, 0, 0, rangevalue)) + "<col width='*'>" + "<col width='17px'>" + (me.g1c/*getRangeCol*/(rangelabel, 0, 1, rangevalue)) + (rangevalue ? "<col width='18px'>" + (me.g1c/*getRangeCol*/(rangelabel, 2, 0, rangevalue)) + "<col width='*'><col width='17px'>" + (me.g1c/*getRangeCol*/(rangelabel, 2, 1, rangevalue)) : "") + "<tr></tr></table>");
				var ui_tr = $("tr", ui),
					m1,
					m2 = null,
					ml,
					Lt, Dt, S;
					
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 0, 0, rangevalue));
				
				if (Lt)
				{
					Dt = $(Lt.d).appendTo(ui_tr);
					Lt.e && IG$/*mainapp*/._rrcs(me, Lt.t, $("span", Dt), 1);
				}
				
				m1 = $("<td><input type='text' name='c_m1'/></td><td style='width:17px'><div class='idv-sel-combo-button'></div></td>").appendTo(ui_tr);
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 0, 1, rangevalue));
				
				if (Lt)
				{
					Dt = $(Lt.d).appendTo(ui_tr);
					Lt.e && IG$/*mainapp*/._rrcs(me, Lt.t, $("span", Dt), 1);
				}
				
				if (rangevalue)
				{
					Lt = (me.g1/*getRangeLabel*/(rangelabel, 1, 2, rangevalue));
					
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(ui_tr);
					
					if (Lt)
					{
						Dt = $(Lt.d).appendTo(S);
						Lt.e && IG$/*mainapp*/._rrcs(me, Lt.t, $("span", Dt), 1);
					}
					
					Lt = (me.g1/*getRangeLabel*/(rangelabel, 2, 0, rangevalue));
					
					if (Lt)
					{
						Dt = $(Lt.d).appendTo(ui_tr);
						Lt.e && IG$/*mainapp*/._rrcs(me, Lt.t, $("span", Dt), 1);
					}
					
					m2 = $("<td><input type='text' name='c_m2'/></td><td style='width:17px'><div class='idv-sel-combo-button'></div></td>").appendTo(ui_tr);
					
					Lt = (me.g1/*getRangeLabel*/(rangelabel, 2, 1, rangevalue));
					
					if (Lt)
					{
						Dt = $(Lt.d).appendTo(ui_tr);
						Lt.e && IG$/*mainapp*/._rrcs(me, Lt.t, $("span", Dt), 1);
					}
				}
					
				ml = rangevalue ? [m1, m2] : [m1]
				
				$.each(ml, function(k, mui) {
					var ui = mui,
						sctrl;
						
					sctrl = $("input[type=text]", ui);
					sctrl.__c = true;
					sctrl.bind("input", function(e) {
						e.stopPropagation();
						e.stopImmediatePropagation();
						e.preventDefault();
						return false;
					});
					sctrl.autocomplete({
						minLength: 0,
						sortResults: false,
						sortable: false,
						source: function(request, response) {
							var reqval = request.term,
								eval = reqval.split(/,\s*/);
							reqval = eval.pop();
							response($.ui.autocomplete.filter(filter.sdp, reqval));
						},
						focus: function(event, ui) {
							return false;
						},
						select: function(event, mobj) {
							var svalue = mobj.item;
							
							if (!svalue.value)
							{
								if (filter.showallvalue)
								{
									this.value = "";
									ui.trigger("change");
								}
							}
							else
							{
								this.value = svalue.label;
								
								filter._svalues = [
									{
										code: svalue.value,
										text: svalue.label
									}
								];
								ui.trigger("change");
							}
							
							if (browser.msie)
							{
								sctrl.blur();
							}
							return false;
						},
						open: function(event, mobj) {
							sctrl.__c = false;
						},
						close: function(event, mobj) {
							sctrl.__c = false;
							setTimeout(function() {
								sctrl.__c = true;
								if (browser.msie)
								{
									sctrl.blur();
								}
							}, 1200);
						}
					});
					
					sctrl.bind("keydown", function(e) {
						if (event.keyCode === $.ui.keyCode.TAB) 
						{
							sctrl.__c = true;
							
							var vmenu = $(this).autocomplete("widget").menu;
							if (vmenu.active)
							{
								e.preventDefault();
							}
						}
						else if (event.keyCode === $.ui.keyCode.ENTER)
						{
							var i,
								m = 0,
								l = sctrl.val().toLowerCase(), 
								v;
							
							if (filter.sdp && filter.sdp.length && l)
							{
								v = l.length;
								
								for (i=0; i < filter.sdp.length; i++)
								{
									if (filter.sdp[i].label.substring(0, v).toLowerCase() == l)
									{
										filter._svalues = [
											{
												code: filter.sdp[i].value,
												text: filter.sdp[i].label
											}
										];
										sctrl.val(filter.sdp[i].label);
										ui.trigger("change");
										m = 1;
										break;
									}
								}
							}
							if (m)
							{
								sctrl.autocomplete("close");
								sctrl.__c = true;
							}
						}
					});
					
					$(".idv-sel-combo-button", ui).bind("click", function(e) {
						e.stopImmediatePropagation();
						e.stopPropagation();
						e.preventDefault();
						
						if (sctrl.__c)
						{
							sctrl.__c = false;
							sctrl.autocomplete("search", "");
							sctrl.focus();
						}
						else
						{
							sctrl.__c = true;
							sctrl.autocomplete("close");
						}
					});
					
					ui.bind("change", function() {
						var bchanged = true,
							pkey = "__pval" + k,
							tval = sctrl.val(),
							sctrl_sel,
							sctrl_sel_code = "",
							i, placeholder = sctrl.attr("placeholder");
						
						if (filter.sdp && filter.sdp.length)
						{
							for (i=0; i < filter.sdp.length; i++)
							{
								if (placeholder && tval == placeholder)
								{
									continue;
								}
								else if (filter.sdp[i].value == tval || filter.sdp[i].label == tval)
								{
									sctrl_sel =
										{
											code: filter.sdp[i].value,
											text: filter.sdp[i].text || filter.sdp[i].label
										};
									sctrl_sel_code = sctrl_sel.code;
									break;
								}
							}
						}
						
						if (filter[pkey] == sctrl_sel_code)
						{
							bchanged = false;
						}
						
						if (bchanged)
						{
							filter[pkey] = sctrl_sel_code;
							
							me.l5a/*updateHierarchy*/.call(me, filter);
							if (!showbutton && filter.iV/*updateValues*/ != true && !f_b_evt)
							{
								me.l5/*updateFilterValues*/.call(me);
							}
						}
					});
				});
			}
			break;
		case "radiobox":
			ui = $("<select multiple='multiple'></select>").css({height: 80});
			ui.bind("change", function() {
				me.l5a/*updateHierarchy*/.call(me, filter);
				if (!showbutton && filter.iV/*updateValues*/ != true && !f_b_evt)
				{
					me.l5/*updateFilterValues*/.call(me);
				}
			});
			break;
		case "checkbox":
			if (showpopup == true)
			{
				ui = $("<div></div>");
				var tin = $("<input type='text' class='idv-checkbox-inp'></input>").appendTo(ui);
				tin.css({"float": "left"});
				var tbtn = $("<div class='idv-btn-selected'></div>").appendTo(ui);
				tbtn.bind("click", function(e) {
					e.stopPropagation();
					var dlg = new IG$/*mainapp*/._Iec/*dynFilter*/({
						selMode: "MULTI",
						smode: filter.smode,
						callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_PM/*checkpopup*/, filter),
						filteritem: filter
					});
					IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
				});
			}
			else
			{
				ui = $("<select multiple='multiple'></select>").css({height: 80});
				ui.bind("change", function() {
					me.l5a/*updateHierarchy*/.call(me, filter);
					if (!showbutton && filter.iV/*updateValues*/ != true && !f_b_evt)
					{
						me.l5/*updateFilterValues*/.call(me);
					}
				});
			}
			break;
		case "checkbuttons":
			ui = $("<table class='idv-checkbuttons'><tr><td><ul></ul></td></tr></table>");
			var td = $("td", ui);
			td.bind("checkboxchanged", function(ev, dt) {
				if (dt && filter._c_a1 && $("input[type='checkbox']", filter._c_a1).is(':checked') && !$("input[type='checkbox']", dt.u2).is(':checked'))
				{
					$("input[type='checkbox']", filter._c_a1).prop("checked", false);
				}
				
				me.l5a/*updateHierarchy*/.call(me, filter);
				
				if (!showbutton && filter.iV/*updateValues*/ != true && !f_b_evt)
				{
					me.l5/*updateFilterValues*/.call(me);
				}
			});
			break;
		case "radiobuttons":
			ui = $("<table class='mec-radiobuttons'><tr><td><ul></ul></td></tr></table>");
			var td = $("td", ui);
			td.bind("radioboxchanged", function() {
				me.l5a/*updateHierarchy*/.call(me, filter);
				if (!showbutton && !f_b_evt)
				{
					me.l5/*updateFilterValues*/.call(me);
				}
			});
			break;
		case "text":
			ui = $("<table class='idv-sel-combo" + (rangevalue ? " idv-sel-rangevalue" : "") + "'>" + (me.g1c/*getRangeCol*/(rangelabel, 0, 0, rangevalue)) + "<col width='*'>" + (me.g1c/*getRangeCol*/(rangelabel, 0, 1, rangevalue)) + "" + (rangevalue ? "<col width='18px'>" + (me.g1c/*getRangeCol*/(rangelabel, 2, 0, rangevalue)) + "<col width='*'>" + (me.g1c/*getRangeCol*/(rangelabel, 2, 1, rangevalue)) : "") + "<tr></tr></table>");
			var ui_tr = $("tr", ui),
				m1,
				m2 = null,
				ml,
				Lt, Dt, S;
				
			Lt = (me.g1/*getRangeLabel*/(rangelabel, 0, 0, rangevalue));
				
			if (Lt)
			{
				Dt = $(Lt.d).appendTo(ui_tr);
				Lt.e && IG$/*mainapp*/._rrcs(me, Lt.t, $("span", Dt), 1);
			}
			
			m1 = $("<td><input type='text' name='c_m1'/></td>").appendTo(ui_tr);
			
			Lt = (me.g1/*getRangeLabel*/(rangelabel, 0, 1, rangevalue));
			
			if (Lt)
			{
				Dt = $(Lt.d).appendTo(ui_tr);
				Lt.e && IG$/*mainapp*/._rrcs(me, Lt.t, $("span", Dt), 1);
			}
			
			if (rangevalue)
			{
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 1, 2, rangevalue));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(ui_tr);
					Dt = $(Lt.d).appendTo(S);
					Lt.e && IG$/*mainapp*/._rrcs(me, Lt.t, $("span", Dt), 1);
				}
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 2, 0, rangevalue));
				if (Lt)
				{
					Dt = $(Lt.d).appendTo(ui_tr);
					Lt.e && IG$/*mainapp*/._rrcs(me, Lt.t, $("span", Dt), 1);
				}
				
				m2 = $("<td><input type='text' name='c_m2'/></td>").appendTo(ui_tr);
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 2, 1, rangevalue));
				
				if (Lt)
				{
					Dt = $(Lt.d).appendTo(ui_tr);
					Lt.e && IG$/*mainapp*/._rrcs(me, Lt.t, $("span", Dt), 1);
				}
			}
			
			ml = rangevalue ? [m1, m2] : [m1];
			
			$.each(m1, function(i, k) {
				var ui = $("input", k).bind("keyup", function(event) {
					if (event.which == 13)
					{
						me.l5a/*updateHierarchy*/.call(me, filter);
					}
					if (event.which == 13 && !showbutton && !f_b_evt)
					{
						me.l5/*updateFilterValues*/.call(me);
					}
				});
			});
			
			if (filter.defaultvalue)
			{
				$("[name=c_m1]", m1).val(filter._p1/*main*/.m1/*getDefaultValue*/.call(filter._p1/*main*/, filter));
				
				me.l5a/*updateHierarchy*/.call(me, filter);
				
				if (!showbutton && !f_b_evt)
				{
					me.l5a/*updateHierarchy*/.call(me, filter);
				}
			}
			break;
		case "fileupload":
			ui = $("<div></div>");
			var tin = $("<input type='text' class='idv-checkbox-inp'></input>").appendTo(ui);
			tin.css({"float": "left"});
			var tbtn = $("<div class='idv-btn-selected'></div>").appendTo(ui);
			tbtn.bind("click", function(e) {
				e.stopPropagation();
				var dlg = new IG$/*mainapp*/._IeF/*dynfilterFileLoader*/({
					smode: filter.smode,
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_PM/*checkpopup*/, filter),
					filteritem: filter
				});
				IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
			});
			break;
		case "calendar":
			ui = $("<table class='mec-dateperiod-box'></table>");
			
			mtr = $("<tr></tr>").appendTo(ui);
			
			if (dateseltype == "year")
			{
				mtd = $("<td></td>").appendTo(mtr);
				filter.dt = $("<select class='mec-dateperiod-year'></select>").appendTo(mtd);
				
				var ys = filter.yearfrom || "cyear-5", 
					ye = filter.yearto || "cyear",
					ik;
					
				ys = filter._p1/*main*/.m2/*getYearField*/.call(filter._p1/*main*/, ys);
				ye = filter._p1/*main*/.m2/*getYearField*/.call(filter._p1/*main*/, ye);
				
				$("<option value=''>" + IRm$/*resources*/.r1("L_SELECT_VALUE") + "</option>").appendTo(filter.dt);
				
				for (ik=ys; ik < ye+1; ik++)
				{
					$("<option value='" + ik + "'>" + ik + "</option>").appendTo(filter.dt);
				}
				
				if (filter.defaultvalue)
				{
					var sopt = $("option", filter.dt),
						sdval = me.g1a/*getDefaultDate*/(filter.defaultvalue),
						syear = "" + sdval.getFullYear();
						
					for (ik=0; ik < sopt.length; ik++)
					{
						if ($(sopt[ik]).val() == syear)
						{
							$(sopt[ik]).attr("selected", "selected");
						}
					}
				}
				
				filter.dt.bind("change", function() {
					me.l5a/*updateHierarchy*/.call(me, filter);
					if (!showbutton && !f_b_evt)
					{
						me.l5/*updateFilterValues*/.call(me);
					}
				});
			}
			else if (dateseltype == "month")
			{
				ptn = "yyyy-mm";
				mtd = $("<td></td>").appendTo(mtr);
				filter.dt = $("<input class='mec-dateperiod-input' type='text' placeholder='" + ptn + "'></input>").monthpicker({
					monthNames: $.datepicker._defaults.monthNamesShort,
					buttonImage: "./images/calendar.gif",
					buttonImageOnly: true,
					pattern: ptn,
					onSelect: function(dateText, inst) {
						me.l5a/*updateHierarchy*/.call(me, filter);
						if (!showbutton && !f_b_evt)
						{
							me.l5/*updateFilterValues*/.call(me);
						}
					}
				}).appendTo(mtd);
				
				if (filter.defaultvalue)
				{
					filter.dt.monthpicker("setDate", me.g1a/*getDefaultDate*/(filter.defaultvalue));
				}
				
				mtd = $("<td></td>").appendTo(mtr);
				$("<div class='mec-dateperiod-button'>&nbsp;</div>").appendTo(mtd).bind("click", function() {
					filter.dt.monthpicker("show");
				});
			}
			else
			{
				mtd = $("<td></td>").appendTo(mtr);
				filter.dt = $("<input class='mec-dateperiod-input' type='text' placeholder='yyyy-mm-dd'></input>").datepicker({
					monthNames: $.datepicker._defaults.monthNamesShort,
					buttonImage: "./images/calendar.gif",
					buttonImageOnly: true,
					dateFormat: "yy-mm-dd",
					defaultDate: 0,
					onSelect: function(dateText, inst) {
						me.l5a/*updateHierarchy*/.call(me, filter);
						if (!showbutton && !f_b_evt)
						{
							me.l5/*updateFilterValues*/.call(me);
						}
					}
				}).appendTo(mtd);
				
				if (filter.defaultvalue)
				{
					filter.dt.datepicker("setDate", me.g1a/*getDefaultDate*/(filter.defaultvalue));
				}
				
				mtd = $("<td></td>").appendTo(mtr);
				$("<div class='mec-dateperiod-button'>&nbsp;</div>").appendTo(mtd).bind("click", function() {
					filter.dt.datepicker("show");
				});
			}
			
			break;
		case "calendarperiod":
			ui = $("<table class='mec-dateperiod-box'></table>");
			mtr = $("<tr></tr>").appendTo(ui);
			
			mtd = $("<td></td>").appendTo(mtr);
			
			var dval = [],
				dselector = $("<select></select>").appendTo(mtd),
				ismonth = false,
				isyear = false;
			
			mtd[filter.showperiodselector == "T" ? "show" : "hide"]();
			dselector[filter.showperiodselector == "T" ? "show" : "hide"]();
			
			if (dateseltype == "year")
			{
				isyear = true;
				ismonth = false;
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 0, 0, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}

				mtd = $("<td></td>").appendTo(mtr);
				
				filter.dt1 = $("<select></select>").appendTo(mtd);
				
				var ys = filter.yearfrom || "cyear-5", 
					ye = filter.yearto || "cyear",
					ik;
					
				ys = filter._p1/*main*/.m2/*getYearField*/.call(filter._p1/*main*/, ys);
				ye = filter._p1/*main*/.m2/*getYearField*/.call(filter._p1/*main*/, ye);
				
				$("<option value=''>" + IRm$/*resources*/.r1("L_SELECT_VALUE") + "</option>").appendTo(filter.dt1);
				
				for (ik=ys; ik < ye+1; ik++)
				{
					$("<option value='" + ik + "'>" + ik + "</option>").appendTo(filter.dt1);
				}
				
				if (filter.startdate)
				{
					var sopt = $("option", filter.dt1),
						sdval = me.g1a/*getDefaultDate*/(filter.startdate),
						syear = "" + sdval.getFullYear();
						
					for (ik=0; ik < sopt.length; ik++)
					{
						if ($(sopt[ik]).val() == syear)
						{
							$(sopt[ik]).attr("selected", "selected");
						}
					}
				}
				
				filter.dt1.bind("change", function() {
					me.l5a/*updateHierarchy*/.call(me, filter);
					if (!showbutton && !f_b_evt)
					{
						me.l5/*updateFilterValues*/.call(me);
					}
				});
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 0, 1, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}
			}
			else if (dateseltype == "month")
			{
				ismonth = true;
				isyear = false;
				ptn = "yyyy-mm";
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 0, 0, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}
				
				mtd = $("<td></td>").appendTo(mtr);
				
				filter.dt1 = $("<input class='mec-dateperiod-input' type='text' placeholder='" + ptn + "'></input>").monthpicker({
					monthNames: $.datepicker._defaults.monthNamesShort,
					buttonImage: "./images/calendar.gif",
					buttonImageOnly: true,
					pattern: "yyyy-mm",
					onSelect: function(dateText, inst) {
						me.l5a/*updateHierarchy*/.call(me, filter);
						if (!showbutton && !f_b_evt)
						{
							me.l5/*updateFilterValues*/.call(me);
						}
					}
				}).appendTo(mtd);
				
				if (filter.startdate)
				{
					filter.dt1.monthpicker("setDate", me.g1a/*getDefaultDate*/(filter.startdate));
				}
				
				mtd = $("<td></td>").appendTo(mtr);
				$("<div class='mec-dateperiod-button'>&nbsp;</div>").appendTo(mtd).bind("click", function() {
					filter.dt1.monthpicker("show");
				});
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 0, 1, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}
			}
			else
			{
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 0, 0, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}
				
				mtd = $("<td></td>").appendTo(mtr);
				
				filter.dt1 = $("<input class='mec-dateperiod-input' type='text' placeholder='yyyy-mm-dd'></input>").appendTo(mtd);
				
				filter.dt1.css({zIndex: 100});
				
				filter.dt1.datepicker({
					buttonImage: "./images/calendar.gif",
					buttonImageOnly: true,
					dateFormat: "yy-mm-dd",
					onSelect: function(dateText, inst) {
						
						if (filter.dt1.datepicker("getDate") && filter.dt2.datepicker("getDate"))
						{
							me.l5a/*updateHierarchy*/.call(me, filter);
							
							if (!showbutton && !f_b_evt)
							{
								me.l5/*updateFilterValues*/.call(me);
							}
						}
					}
				});
				
				if (filter.startdate)
				{
					filter.dt1.datepicker("setDate", me.g1a/*getDefaultDate*/(filter.startdate));
				}
				
				mtd = $("<td></td>").appendTo(mtr);
				
				$("<div class='mec-dateperiod-button'>&nbsp;</div>").appendTo(mtd).bind("click", function() {
					filter.dt1.datepicker("show");
				});
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 0, 1, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}
			}
			
			Lt = (me.g1/*getRangeLabel*/(rangelabel, 1, 0, 2));
			if (Lt)
			{
				S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
				$(Lt.d).appendTo(S);
			}
			else
			{
				mtd = $("<td></td>").appendTo(mtr);
			}

			if (dateseltype == "year")
			{
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 2, 0, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}
				
				mtd = $("<td></td>").appendTo(mtr);
				
				isyear = true;
				ismonth = false;
				filter.dt2 = $("<select></select>").appendTo(mtd);
				
				var ys = filter.yearfrom || "cyear-5", 
					ye = filter.yearto || "cyear",
					ik;
					
				ys = filter._p1/*main*/.m2/*getYearField*/.call(filter._p1/*main*/, ys);
				ye = filter._p1/*main*/.m2/*getYearField*/.call(filter._p1/*main*/, ye);
				
				$("<option value=''>" + IRm$/*resources*/.r1("L_SELECT_VALUE") + "</option>").appendTo(filter.dt2);
				
				for (ik=ys; ik < ye+1; ik++)
				{
					$("<option value='" + ik + "'>" + ik + "</option>").appendTo(filter.dt2);
				}
				
				if (filter.enddate)
				{
					var sopt = $("option", filter.dt2),
						sdval = me.g1a/*getDefaultDate*/(filter.enddate),
						syear = "" + sdval.getFullYear();
						
					for (ik=0; ik < sopt.length; ik++)
					{
						if ($(sopt[ik]).val() == syear)
						{
							$(sopt[ik]).attr("selected", "selected");
						}
					}
				}
				
				filter.dt2.bind("change", function() {
					me.l5a/*updateHierarchy*/.call(me, filter);
					if (!showbutton && !f_b_evt)
					{
						me.l5/*updateFilterValues*/.call(me);
					}
				});
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 2, 1, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}
			}
			else if (dateseltype == "month")
			{
				ismonth = true;
				isyear = false;
				
				ptn = "yyyy-mm";
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 2, 0, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}
				
				mtd = $("<td></td>").appendTo(mtr);
				
				filter.dt2 = $("<input class='mec-dateperiod-input' type='text' placeholder='" + ptn + "'></input>").monthpicker({
					monthNames: $.datepicker._defaults.monthNamesShort,
					buttonImage: "./images/calendar.gif",
					buttonImageOnly: true,
					pattern: ptn,
					onSelect: function(dateText, inst) {
						me.l5a/*updateHierarchy*/.call(me, filter);
						if (!showbutton && !f_b_evt)
						{
							me.l5/*updateFilterValues*/.call(me);
						}
					}
				}).appendTo(mtd);
				
				if (filter.enddate)
				{
					filter.dt2.monthpicker("setDate", me.g1a/*getDefaultDate*/(filter.enddate));
				}
				
				mtd = $("<td></td>").appendTo(mtr);
				
				$("<div class='mec-dateperiod-button'>&nbsp;</div>").appendTo(mtd).bind("click", function() {
					filter.dt2.monthpicker("show");
				});
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 2, 1, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}
			}
			else
			{
				ptn = "yyyy-mm-dd";
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 2, 0, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}
				
				mtd = $("<td></td>").appendTo(mtr);
				
				filter.dt2 = $("<input class='mec-dateperiod-input' type='text' placeholder='" + ptn + "'></input>")
					.appendTo(mtd);
				filter.dt2.css({zIndex: 100});
				filter.dt2.datepicker({
					buttonImage: "./images/calendar.gif",
					buttonImageOnly: true,
					dateFormat: "yy-mm-dd",
					onSelect: function(dateText, inst) {
						if (filter.dt1.datepicker("getDate") && filter.dt2.datepicker("getDate"))
						{
							me.l5a/*updateHierarchy*/.call(me, filter);
							
							if (!showbutton && !f_b_evt)
							{
								me.l5/*updateFilterValues*/.call(me);
							}
						}
					}
				}).appendTo(mtd);
				
				if (filter.enddate)
				{
					filter.dt2.datepicker("setDate", me.g1a/*getDefaultDate*/(filter.enddate));
				}
				
				mtd = $("<td></td>").appendTo(mtr);
				
				$("<div class='mec-dateperiod-button'>&nbsp;</div>").appendTo(mtd).bind("click", function() {
					filter.dt2.datepicker("show");
				});
				
				Lt = (me.g1/*getRangeLabel*/(rangelabel, 2, 1, 2));
				if (Lt)
				{
					S = $("<td class='igc-f-range-label-td'></td>").appendTo(mtr);
					$(Lt.d).appendTo(S);
				}
			}			
			
			if (filter.periodlist)
			{
				for (i=0; i < filter.periodlist.length; i++)
				{
					// dval.push(new Option(filter.periodlist[i].name, filter.periodlist[i].value));
					$("<option value='" + filter.periodlist[i].value + "'" + (filter.periodlist[i]["default"] == true ? " selected" : "") + ">" + filter.periodlist[i].name + "</option>").appendTo(dselector);
					
					if (filter.periodlist[i]["default"] == true)
					{
						if (isyear == true)
						{
							var sopt = $("option", filter.dt1),
								syear = IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.getValue(filter.periodlist[i].value, 0, ismonth, isyear);
								
							for (ik=0; ik < sopt.length; ik++)
							{
								if ($(sopt[ik]).val() == syear)
								{
									$(sopt[ik]).attr("selected", "selected");
								}
							}
							
							var sopt = $("option", filter.dt2),
								syear = IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.getValue(filter.periodlist[i].value, 1, ismonth, isyear);
								
							for (ik=0; ik < sopt.length; ik++)
							{
								if ($(sopt[ik]).val() == syear)
								{
									$(sopt[ik]).attr("selected", "selected");
								}
							}
						}
						else
						{
							var r1 = IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.getValue(filter.periodlist[i].value, 0, ismonth, isyear),
								r2 = IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.getValue(filter.periodlist[i].value, 1, ismonth, isyear);
							filter.dt1.val(r1);
							filter.dt2.val(r2);
							
							if (ismonth && r1 && r2)
							{
								r1 = r1.split("-");
								r1 = r1.join("") + "01";
								r2 = r2.split("-");
								r2 = r2.join("") + "01";
								
								filter.dt1.monthpicker("setDate", me.g1a/*getDefaultDate*/(r1));
								filter.dt2.monthpicker("setDate", me.g1a/*getDefaultDate*/(r2));
							}
						}
					}
				}
			}
			
			dselector.bind("change", function() {
				var sel = $("option:selected", dselector).val();
				if (sel)
				{
					if (isyear == true)
					{
						var sopt = $("option", filter.dt1),
							syear = IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.getValue(sel, 0, ismonth, isyear),
							ik;
							
						for (ik=0; ik < sopt.length; ik++)
						{
							if ($(sopt[ik]).val() == syear)
							{
								$(sopt[ik]).attr("selected", "selected");
							}
						}
						
						var sopt = $("option", filter.dt2),
							syear = IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.getValue(sel, 1, ismonth, isyear);
							
						for (ik=0; ik < sopt.length; ik++)
						{
							if ($(sopt[ik]).val() == syear)
							{
								$(sopt[ik]).attr("selected", "selected");
							}
						}
					}
					else
					{
						filter.dt1.val(IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.getValue(sel, 0));
						filter.dt2.val(IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.getValue(sel, 1));
					}
					
					if (isyear)
					{
						if ($("option:selected", filter.dt1).val() && $("option:selected", filter.dt2).val())
						{
							me.l5a/*updateHierarchy*/.call(me, filter);
							if (!showbutton && !f_b_evt)
							{
								me.l5/*updateFilterValues*/.call(me);
							}
						}
					}
					else
					{
						if (filter.dt1.val() && filter.dt2.val())
						{
							me.l5a/*updateHierarchy*/.call(me, filter);
							if (!showbutton && !f_b_evt)
							{
								me.l5/*updateFilterValues*/.call(me);
							}
						}
					}
				}
			});
			break;
		}
		
		if (filteroptions.f_t_dir == "top")
		{
			titlecap = $("<div class='df-titlecap-top'></div>");
		}
		else
		{
			titlecap = $("<div class='df-titlecap-row'></div>");
		}
		mcap.append(titlecap);
		
		var mtd;
		
		mtd = $("<div class='df-item-row'></div>");
		
		if (filteroptions.f_t_dir == "top")
		{
			mtd.appendTo(titlecap);
		}
		else
		{
			mtd.appendTo(mcap);
		}
		ui.appendTo(mtd);
		
		title = $("<span class='df-title" + (viewtype == "row" ? " df-title-row" : "") + "'></span>");
		titlecap.prepend(title);
		
		if (filter.compcss)
		{
			ui.addClass(filter.compcss);
		}
		
		filter.lcap = mtd;
		filter.u1 = mcap;
		filter.u2 = ui;
		filter.u3 = title;
		filter.u4 = titlecap;
		
		t = filter.ltitle || filter.title || filter.lname || filter.name || "";
		
		t = IG$/*mainapp*/._rrcs(me, t, filter.u3);
		
		filter.u3.text(t);
		
		mcap.draggable({
			/* containment: me.p, */ 
			handle: titlecap,
			start: function(event, ui) {
				if (me._editmode)
					return true;
				return false;
			},
			drag: function(event, ui) {
				
			},
			stop: function(event, ui) {
				me._lD/*drop_item*/.call(me, filter, event);
				me._lm/*_do_layout*/.call(me);
			}
		});
		
		me.l4/*updateDisplay*/();
				
		return ui;
	},
	
	rs_PM/*checkpopup*/: function(sel, filter) {
		var me = this,
			filteroptions = me._ILb/*sheetoption*/.pff1a/*filteroptions*/,
			showbutton = filteroptions.showbutton,
			f_b_evt = !showbutton && filteroptions.f_b_evt == "T" ? 1 : 0,
			i, tvalue = "",
			fsel;
			
		fsel = filter.selection = [];
		
		if (sel && sel.length > 0)
		{
			for (i=0; i < sel.length; i++)
			{
				fsel.push({
					code: sel[i].get("code"),
					value: sel[i].get("value")
				});
			}
		}
		
		if (fsel.length > 0)
		{
			tvalue = (fsel[0].value || fsel[0].code) + (fsel.length > 1 ? "(" + (fsel.length-1) + " more)" : "");
		}
		
		$("input[type=text]", filter.u2).val(tvalue);
			
		me.l5a/*updateHierarchy*/.call(me, filter);
		if (!showbutton && !f_b_evt)
		{
			me.l5/*updateFilterValues*/.call(me);
		}
	},
	
	c1/*clearFilter*/: function(filter) {
		var me = this,
			p = me.p/*parentUI*/,
			ui = filter.u2,
			filteroptions = me._ILb/*sheetoption*/.pff1a/*filteroptions*/,
			showbutton = filteroptions.showbutton,
			f_b_evt = !showbutton && filteroptions.f_b_evt == "T" ? 1 : 0,
			showpopup = filter.showpopup,
			dateseltype = filter.dateseltype,
			i,
			fd;
			
		if (me.__dx == true)
			return;
		
		switch (filter.objtype)
		{
		case "slider":
			var min = ui.slider("option", "min"),
				max = ui.slider("option", "max");
			
			ui.slider("values", 0, min);
			ui.slider("values", 1, max);
			break;
		case "combobox":
			if (showpopup == true)
			{
				$("input[type=text]", ui).val("");
			}
			else
			{
				$("option:selected", ui).removeAttr("selected");
			}
			break;
		case "radiobox":
			$("option:selected", ui).removeAttr("selected");
			break;
		case "checkbox":
			if (showpopup == true)
			{
				$("input[type=text]", ui).val("");
			}
			else
			{
				$("option:selected", ui).removeAttr("selected");
			}
			break;
		case "fileupload":
			$("input[type=text]", ui).val("");
			break;
		case "text":
			var sctrls = [$("[name=c_m1]", ui)];
			if (item.rangevalue)
			{
				sctrls.push($("[name=c_m2]", ui));
			}
			
			$.each(sctrls, function(m, mi) {
				mi.val("");
			});
			
			if (!showbutton && !f_b_evt)
			{
				me.l5/*updateFilterValues*/.call(me);
			}
			break;
		case "checkbuttons":
			fd = filter.data;
			if (fd && fd.length > 0)
			{
				for (i=0; i < fd.length; i++)
				{
					fd[i].u2 && $("input[type='checkbox']", fd[i].u2).prop("checked", false);
				}
			}
			if (!showbutton && !f_b_evt)
			{
				me.l5/*updateFilterValues*/.call(me);
			}
			break;
		case "radiobuttons":
			fd = filter.data;
			if (fd && fd.length > 0)
			{
				for (i=0; i < fd.length; i++)
				{
					fd[i].u2 && fd[i].u2.removeAttr("selected");
				}
			}
			if (!showbutton && !f_b_evt)
			{
				me.l5/*updateFilterValues*/.call(me);
			}
			break;
		case "calendar":
			if (dateseltype == "year")
			{
				filter.dt.val("");
			}
			else if (dateseltype == "month")
			{
				filter.dt.monthpicker("setDate", null);
			}
			else
			{
				filter.dt.datepicker("setDate", null);
			}
			break;
		case "calendarperiod":
			if (dateseltype == "year")
			{
				filter.dt1.val("");
				filter.dt2.val("");
			}
			else if (dateseltype == "month")
			{
				filter.dt1.monthpicker("setDate", null);
				filter.dt2.monthpicker("setDate", null);
			}
			else
			{
				filter.dt1.datepicker("setDate", null);
				filter.dt2.datepicker("setDate", null);
			}
			break;
		}
		
		if (!showbutton && !f_b_evt)
		{
			me.l5/*updateFilterValues*/.call(me);
		}
	},
	
	l2/*appendFiltering*/: function(dt) {
		var me = this,
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			i;
		for (i=0; i < filteritems.length; i++)
		{
			if (dt.uid && filteritems[i].uid == dt.uid)
			{
				// already exist
				return;
			}
			else if (dt.name && filteritems[i].name == dt.name)
			{
				return;
			}
		}
		
		if (!(/(metric|measure|custommetric|formulameasure|tabdimension|multimetric|multimeasure|measuregroup|measuregroupdimension|groupfield)/.test(dt.type.toLowerCase())))
		{
			// not supported item
			return;
		}
		
		var ditem = {},
			datatype = dt.memo ? dt.memo.toLowerCase() : dt.memo;
		
		IG$/*mainapp*/._I1d/*CopyObject*/(dt, ditem, "uid;name;nodepath;type");
		ditem.uid = IG$/*mainapp*/._I06/*formatUID*/(ditem.uid);
		ditem.title = ditem.name;
		ditem.objtype = "text";
		
		switch (ditem.type.toLowerCase())
		{
		case "metric":
		case "custommetric":
		case "tabdimension":
		case "measuregroupdimension":
			ditem.operator = "EQ";
			if (datatype == "date" || datatype == "datetime" || datatype == "timestamp")
			{
				ditem.objtype = "text";
			}
			else
			{
				ditem.objtype = "combobox";
			}
			break;
		case "measure":
		case "formulameasure":
		case "measuregroup":
			ditem.operator = "GT";
			ditem.objtype = "slider";
			break;
		}
	
		ditem._p1/*main*/ = me._ILb/*sheetoption*/;
		filteritems.push(ditem);
		
		me.l3/*validateItems*/();
	},
	
	I0/*getPvalue*/: function(item) {
		var r = [],
			i,
			prows, prow;
		
		if (item.pvalues)
		{
			prows = item.pvalues.split("\n");
			
			for (i=0; i < prows.length; i++)
			{
				prow = prows[i].split(";");
				r.push({
					code: prow[0],
					disp: prow[1]
				});
			}
		}
		
		return r;
	},
	
	l3/*validateItems*/: function(vitems, firstrun, ishierchy, is_config) {
		var me = this,
			filteritems = vitems || me._ILb/*sheetoption*/.pff1/*filterItems*/,
			item,
			hfilter,
			address = "",
			objtype,
			itemtype,
			i;
		
		for (i=0; i < filteritems.length; i++)
		{
			item = filteritems[i];
			objtype = item.objtype;
			itemtype = item.type;
			
			if (!item.validated)
			{
				hfilter = me.l3b/*checkHFilter*/(item);
				
				if (itemtype == "viewselector")
				{
					me.ll1/*updateViewSelector*/(item);
				}
				else if (/combobox|checkbox|radiobox|slider|checkbuttons|radiobuttons/.test(objtype))
				{
					if (hfilter === false)
					{
					}
					else if (itemtype == "prompt")
					{
						item.validate = true;
						item.data = [];
						
						if (item.cmap_uid)
						{
							address += "<item" + IG$/*mainapp*/._I20/*XUpdateInfo*/(item, "cmap_uid;cmap_disp;name;type", "s") + " uid='" + item.cmap_uid + "'>";
							address += (hfilter ? hfilter : "");
							address += "</item>";
						}
						else if (item.pvalues)
						{
							item.data = me.I0/*getPvalue*/(item);
							me.l6/*updateFilterValue*/(filteritems[i]);
						}
					}
					else
					{
						address += "<item" + IG$/*mainapp*/._I20/*XUpdateInfo*/(item, "name;uid;objtype;nodepath;cmap_uid;cmap_disp", "s") + ">";
						address += (hfilter ? hfilter : "");
						address += "</item>";
					}
				}
			}
		}
		
		if (address != "")
		{
			me.v1/*updateValues*/ = true; 
			me.c2/*isloaded*/ = false;
			
			var req = new IG$/*mainapp*/._I3e/*requestServer*/(),
				cnt,
				rop;
				
			cnt = "<smsg><info option='ValueInfo'>";
			
			if (me.report && me.report._ILa/*reportoption*/ && me.report._ILa/*reportoption*/.reportmode == "sql")
			{
				rop = me.report._ILa/*reportoption*/;
				cnt += rop._IJ1/*getCurrentPivot*/.call(rop);
			}
			
			cnt += "</info></smsg>";
			
			me.setLoading(true);
			
			if (!ishierchy)
			{
				me.l3a/*drawControls*/(firstrun, is_config);
			}
			
			req.init(me, 
				{
		            ack: "18",
		            payload: "<smsg>" + address + "</smsg>",
		            mbody: cnt
		        }, me, function(xdoc) {
		        	var me = this,
		        		m_control = 0;
		        	if (!ishierchy)
		        	{
		        		m_control = 1;
		        	}
		        	me.rs_l3/*validateItems*/(xdoc, [vitems, firstrun, ishierchy, is_config, m_control]);
		        }, function(xdoc) {
		        	var me = this;
		        }, [vitems, firstrun]);
			req._l/*request*/();
		}
		else if (!vitems)
		{
			me.l3a/*drawControls*/(firstrun, is_config);
		}
	},
	
	ll1/*updateViewSelector*/: function() {
		var me = this,
			i, j, k,
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			obj, dobj,
			item,
			tabitem,
			activeTab = 0,
			odata,
			objtype,
			itemtype,
			dc, di,
			n = 0;
			
		if (me.dzone && filteritems)
		{
			for (i=0; i < filteritems.length; i++)
			{
				item = filteritems[i];
				objtype = item.objtype;
				itemtype = item.type;
				if (itemtype == "viewselector")
				{
					obj = {
						data: []
					};
					
					if (item.data && objtype == "radiobuttons")
					{
						for (j=0; j < item.data.length; j++)
						{
							if (item.data[j].u2 && $("input[type='radio']", item.data[j].u2).is(':checked'))
							{
								activeTab = j;
								break;
							}
						}
					}
					
					dobj = me.dzone.docitems[item.tabid];
					
					dc = dobj ? dobj.children : null;
					
					if (dc)
					{
						for (j=0; j < dc.length; j++)
						{
							di = dobj.children[j];
							odata = {
								code: di.docid,
								disp: di.lt.ubody.title || di.lt.ubody.name // me.dzone.items[j].title || me.dzone.items[j].name
							};
							
							if (n == activeTab)
							{
								odata.selected = true;
							}
							obj.data.push(odata);
							n++;
						}
					}
					
					item.validated = true;
					item.data = obj.data;
					
					me.l6/*updateFilterValue*/(item);
				}
			}
		}
	},
	
	rs_l3/*validateItems*/: function(xdoc, params) {
		var me = this,
			vitems = params[0],
			firstrun = params[1],
			ishierchy = params[2],
			is_config = params[3],
			m_control = params[4],
			i, j, clen, cfield, m,
			filteritems = vitems || me._ILb/*sheetoption*/.pff1/*filteritems*/,
			item,
			obj, dnode, dnodes, uid, vnode, delimiter, d,
			mchild,
			snode,
			hnode,
			hnodes,
			dnode,
			tpnode, tpnodes,
			vnode;
			
		if (me.__dx == true)
			return;
		
		mchild = IG$/*mainapp*/._I2a/*parseValueList*/(xdoc);
		
		if (mchild)
		{
			for (m=0; m < mchild.length; m++)
			{
				obj = mchild[m];
				for (i=0; i < filteritems.length; i++)
				{
					if (filteritems[i].uid == obj.uid.substring(0, 17))
					{
						item = filteritems[i];
						item.validated = true;
						item.data = obj.data;
						me.l6/*updateFilterValue*/(item);
						break;
					}
					else if (filteritems[i].cmap_uid == obj.uid.substring(0, 17))
					{
						item = filteritems[i];
						item.validated = true;
						item.data = obj.data;
						me.l6/*updateFilterValue*/(item);
					}
				}
			}
			
			for (i=0; i < filteritems.length; i++)
			{
				if (!filteritems[i].validated)
				{
					item = filteritems[i];
					item.validate = true;
					item.data = [];
					me.l6/*updateFilterValue*/(filteritems[i]);
				}
			}
		}
		
		me.v1/*updateValues*/ = false;
		
		if (!vitems && !ishierchy && !m_control)
		{
			me.l3a/*drawControls*/(firstrun, is_config);
		}
	},
	
	l3b/*checkHFilter*/: function(item) {
		var me = this,
			r = null,
			hfilter,
			i, j, m,
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			hfitem;
		
		if (item.hfilter && item.hfilter.length > 0)
		{
			hfilter = item.hfilter.split(";");
			for (i=0; i < hfilter.length; i++)
			{
				hfitem = null;
				
				for (j=0; j < filteritems.length; j++)
				{
					if (filteritems[j].name == hfilter[i])
					{
						hfitem = filteritems[j];
						break;
					}
				}
				
				if (hfitem)
				{
					hfitem.value = []; //hfitem.value || [];
					m = me.l7a/*updateFilterValue*/(hfitem);
					
					if (m)
					{
						r = (r) ? r+m : "<Filters>" + m;
					}
					else if (hfitem.isnecessary == true || m === 0)
					{
						r = false;
						break;
					}
				}
				else
				{
					r = false;
					break;
				}
			}
		}
		
		if (r)
		{
			r += "</Filters>";
		}
		
		return r;
	},
	
	_lD/*drop_item*/: function(fitem, event) {
		var me = this,
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			filteroptions = me._ILb/*sheetoption*/.pff1a/*filteroptions*/,
			viewtype = filteroptions.viewtype || "table",
			i, j,
			mbox = me._mbox, sx, sy, w, h, l,
			px, py, o = me.p.offset(), nrow, crow;
		
		px = event.pageX - o.left;
		py = event.pageY - o.top;
		
		if (mbox)
		{
			if (viewtype == "table")
			{
				
			}
			else
			{
				sy = 0;
				crow = 0;
				
				for (i=0; i < mbox.rh.length; i++)
				{
					sy += (mbox.rh[i] || 20);
					
					if (py < sy)
					{
						crow = i;
						break;
					}
				}
				
				sx = 0;
				l = -1;
				
				for (i=0; i < filteritems.length; i++)
				{
					if (filteritems[i].crowindex == crow)
					{
						w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(filteritems[i].u1);
						
						if (sx < px && px < sx + w)
						{
							if (px < sx + w / 2)
							{
								l = i;
							}
							else
							{
								l = i + 1;
							}
							
							break;
						}
						
						sx += w;
						l = i + 1;
					}
				}
				
				if (l > -1)
				{
					for (i=0; i < filteritems.length; i++)
					{
						if (filteritems[i] == fitem)
						{
							filteritems.splice(i, 1);
							if (i < l)
							{
								l--;
							}
							filteritems.splice(l, 0, fitem);
							break;
						}
					}
				}
				
				fitem.crowindex = crow;
			}
		}
	},
	
	_lm/*_do_layout*/: function() {
		var me = this,
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			filteroptions = me._ILb/*sheetoption*/.pff1a/*filteroptions*/,
			viewtype = filteroptions.viewtype || "table",
			i, j,
			ntable = (filteroptions.columnsize ? filteroptions.columnsize : 1),
			tw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.container),
			x = 0,
			y = 0, gap = 4, hgap = 10,
			cx, cy, cw, ch,
			fcontainer, rx = [], rh = [], mw = {}, mh = {},
			crow, ccol,
			fitem, n = 0, ttw = 0, tth,
			tcab;
		
		if (viewtype == "table" && filteroptions.f_t_dir != "top")
		{
			for (i=0; i < filteritems.length; i++)
			{
				fitem = filteritems[i];
				tcab = fitem.u4;
				ttw = Math.max(ttw, IG$/*mainapp*/.x_10/*jqueryExtension*/._w(tcab));
			}
		}
		
		for (i=0; i < filteritems.length; i++)
		{
			fitem = filteritems[i];
			fcontainer = fitem.u1;
			tcab = fitem.u4;
			
			if (viewtype == "table" && ttw > 0)
			{
				IG$/*mainapp*/.x_10/*jqueryExtension*/._w(tcab, ttw);
			}
			
			ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(fcontainer);
			cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(fcontainer);
			
			ccol = 0;
			
			if (viewtype == "table")
			{
				if (ntable > 1)
				{
					crow = Math.floor(n / ntable);
					ccol = n % ntable;
				}
				else
				{
					crow = n;
					ccol = 0;
				}
								
				n++;
			}
			else
			{
				crow = fitem.crowindex || 0;
			}
			
			mh[crow] = Math.max(mh[crow] || 0, ch + gap);
			mw[ccol] = Math.max(mw[ccol] || 0, cw + hgap);
		}
		
		if (viewtype != "table")
		{
			for (i=0; i < filteroptions.rowsize; i++)
			{
				rx.push(0);
				rh.push(0);
			}
		}
		
		n = 0;
			
		for (i=0; i < filteritems.length; i++)
		{
			fitem = filteritems[i];
			fcontainer = fitem.u1;
			ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(fcontainer);
			cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(fcontainer);
			
			if (viewtype == "table")
			{
				cx = 0;
				cy = 0;
				
				if (ntable > 1)
				{
					ccol = Math.floor(n / ntable);
					crow = n % ntable;
				}
				else
				{
					ccol = 0;
					crow = n;
				}
				
				for (j=0; j < ccol; j++)
				{
					cx += mw[j];
				}
				
				for (j=0; j < crow; j++)
				{
					cy += mh[j];
				}
				
				n++;
			}
			else
			{
				crow = fitem.crowindex || 0;
				cx = rx[crow];
				cy = gap;
				for (j=0; j < crow; j++)
				{
					cy += rh[j];
				}
				rx[crow] += cw + hgap;
				rh[crow] = Math.max(rh[crow], ch + gap);
			}
			
			fcontainer.css({top: cy, left: cx});
		}
		
		me._mbox = {
			rx: rx,
			rh: rh,
			mh: mh,
			mw: mw
		};
		
		if (filteroptions.showbutton && me._sbtn)
		{
			cy = gap;
			if (viewtype == "table")
			{
				
			}
			else
			{
				for (j=0; j < filteroptions.brow; j++)
				{
					cy += rh[j];
				}
			}
			me._sbtn.css({top: cy, right: gap});
		}
	},
	
	l3a/*drawControls*/: function(firstrun, is_config) {
		var me = this,
			c = me.c/*contentarea*/,
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			filteroptions = me._ILb/*sheetoption*/.pff1a/*filteroptions*/,
			viewtype = filteroptions.viewtype || "table",
			p, i, mcap, colwidth;
		
		c.empty();
		
		if (filteritems.length > 0)
		{
			// this.p = p = $("<ul class='df-list'><ul>").appendTo(c);
			me.p = p = $("<div class='df-list'></div>").appendTo(c);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.p, IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.container) - 10);
			var lcap, td,
				sbtn, stext;
				
			ntable = (filteroptions.columnsize ? filteroptions.columnsize : 1);
						
			$.each(filteritems, function(i, mf) {
				var mcap = $("<div class='df-filter-cont'></div>").appendTo(me.p);
				
				me.l1/*createFilterUI*/.call(me, mf, mcap, (i > 0 ? filteritems[i-1] : null), viewtype);
				
				/*
				if (viewtype == "table")
				{
					if (mf.useprevcont == "T")
					{
					}
					else
					{
						n += (mf.objmerge || 1) ;
					}
				}
				*/
			});
			
			for (i=0; i < filteritems.length; i++)
			{
				me.l6/*updateFilterValue*/(filteritems[i]);
			}
			
			if (filteroptions.showbutton)
			{
				td = $("<div class='df-filter-cont'></div>").appendTo(me.p);
				stext = (filteroptions.buttonname || IRm$/*resources*/.r1('L_BTN_SEARCH'));
				
				sbtn = $("<button class='dt-btn-search'><span>" + IG$/*mainapp*/._rrcsv(stext) + "</span></button>").appendTo(td).bind("click", function() {
					me.l5/*updateFilterValues*/.call(me, 0, null, 0, 1);
				});
				
				IG$/*mainapp*/._rrcs(me, stext, $("span", sbtn));
				
				me._sbtn = td;
			}
			
			me._lm/*_do_layout*/();
		}
		
		me.c2/*isloaded*/ = true;
		me.v1/*updateValues*/ = false;
		
		me.c1/*firstRun*/();
		
		setTimeout(function() {
			me.l5/*updateFilterValues*/.call(me, firstrun, null, is_config);
		}, 500);
	},
	
	l4/*updateDisplay*/: function() {
		var me = this;
		
		if (me.utimer > -1)
		{
			clearTimeout(me.utimer);
		}
		
		me.utimer = setTimeout(function() {
			me.rs_l4/*updateDisplay*/.call(me);
		}, 200);
	},
	
	rs_l4/*updateDisplay*/: function() {
		var me = this,
			cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.container);
		
		me.utimer = -1;
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.p, cw - 10);
		
		me._lm/*_do_layout*/();
	},
	
//	rs_l4/*updateDisplay*/: function() {
//		var me = this,
//			cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.container),
//			i, twidth = cw-10,
//			titlewidth = 0,
//			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
//			filteroptions = me._ILb/*sheetoption*/.pff1a/*filteroptions*/,
//			// showrefresh = filteroptions.showrefresh,
//			filter, uwidth,
//			cbtn = 30,
//			colwidth = me.colwidth,
//			viewtype = filteroptions.viewtype,
//			c = (colwidth ? colwidth.length / 2 : 1);
//		
//		me.utimer = -1;
//		
//		if (me.p)
//		{
//			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.p, cw - 10);
//		}
//		
//		if (viewtype == "row")
//			return;
//		
//		if (filteroptions.f_t_dir == "top")
//		{
//			titlewidth = 2;
//		}
//		else
//		{
//			for (i=0; i < filteritems.length; i++)
//			{
//				filter = filteritems[i];
//				if (filter.u3)
//				{
//					titlewidth = Math.max(titlewidth, IG$/*mainapp*/.x_10/*jqueryExtension*/._w(filter.u3) + 15);
//				}
//			}
//		}
//		
//		uwidth = (twidth - (titlewidth + 3) * c) / c;
//		uwidth = Math.floor(uwidth);
//		
//		for (i=0; i < colwidth.length; i++)
//		{
//			if (i % 2 == 0)
//			{
//				colwidth[i].attr("width", titlewidth);
//			}
//			else if (i % 2 == 1)
//			{
//				colwidth[i].attr("width", uwidth);
//			}
//		}
//		
//		/*
//		uwidth = twidth - titlewidth - 5;
//		*/
//		
//		for (i=0; i < filteritems.length; i++)
//		{
//			filter = filteritems[i];
//			if (filter.u4 && filter.u2)
//			{
//				IG$/*mainapp*/.x_10/*jqueryExtension*/._w(filter.u4, titlewidth);
//				
//				if (filter.objtype == "slider")
//				{
//					// filter.u2.css({left: titlewidth});
//					IG$/*mainapp*/.x_10/*jqueryExtension*/._w(filter.u2, uwidth - 10);
//				}
//				else
//				{
//					IG$/*mainapp*/.x_10/*jqueryExtension*/._w(filter.u2, uwidth - 0);
//					
//					if (filter.objtype == "checkbox" && filter.showpopup == true)
//					{
//						IG$/*mainapp*/.x_10/*jqueryExtension*/._w($("input[type=text]", filter.u2), uwidth - 40);
//					}
//				}
//			}
//		}
//	},
	
	cc1/*changeActiveTab*/: function(f, suppressevent, firstrun, loaded) {
		var me = this,
			i,
			tab = me.dzone.docitems[f.tabid],
			sel = f.value.length > 0 ? f.value[0].code : null,
			ubody = tab ? tab.lt.ubody : null,
			itabpanel,
			tc;
		
		if (tab && ubody && ubody.view && sel)
		{
			tc = tab.children;
			
			for (i=0; i < tc.length; i++)
			{
				itabpanel = tc[i];
				if (suppressevent)
				{
					itabpanel.lt.ubody.visible = false;
				}
				if (itabpanel.docid == sel && ubody.view.buttons.length > i)
				{
					if (suppressevent)
					{
						itabpanel.lt.ubody.visible = true;
					}
					else
					{
						if (firstrun)
						{
							ubody.view.s1/*setActiveDoc*/.call(ubody.view, sel, true);
						}
						else
						{
							ubody.view.buttons[i].trigger("click");
						}
						break;
					}
				}
			}
		}
	},
	
	c1/*firstRun*/: function() {
		this._i10/*afterInit*/ && this._i10/*afterInit*/.f.call(this._i10/*afterInit*/.p, this);
	},
	
	l5m/*checkFilterValues*/: function(ignorewarn, tab_changes, firstrun) {
		var i,
			me = this,
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			f,
			bs = true, bm, mbs,
			berr = [];
			
		for (i=0; i < filteritems.length; i++)
		{
			f = filteritems[i];
			mbs = me.l5m_/*checkFilterValuesItem*/(f, berr, ignorewarn, tab_changes);

			bs = (mbs == false) ? mbs : bs;
		}
		
		if (bs == false)
		{
			if (berr.length > 0 && !ignorewarn)
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SEL_ERR', berr.join(",")), null, null, 1, "error");
			}
			return false;
		}
		
		return true;
	},

	l5m_/*checkFilterValuesItem*/: function(f, berr, ignorewarn, tab_changes) {
		var me = this,
			bm,
			bs = true;

		f.value = [];
		if (f.u3)
		{
			f.u3.removeClass("df-title-error");
		}
		if (f.u2)
		{
			f.value = [];
			bm = me.l7a/*updateFilterValue*/(f);
			if (bm === 0 || (!bm && f.isnecessary == true))
			{
				bs = false;
				if (f.u3)
				{
					f.u3.addClass("df-title-error");
					berr.push(f.title || f.name);
				}
			}
		}
		
		if (f.type == "viewselector" && f.u2)
		{
			f.value = [];
			me.l7a/*updateFilterValue*/(f);
			if (f.value && f.value.length > 0)
			{
				// me.cc1/*changeActiveTab*/(f);
				tab_changes.push(f);
			}
		}

		return bs;
	},
	
	l5/*updateFilterValues*/: function(firstrun, loaded, is_config, is_button) {
		var me = this,
			tab_changes = [],
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			filteroptions = me._ILb/*sheetoption*/.pff1a/*filteroptions*/,
			showbutton = filteroptions ? filteroptions.showbutton : false,
			f_b_trg = (showbutton && filteroptions.f_b_trg == "T") ? 1 : 0,
			f_b_trg_all = f_b_trg && filteroptions.f_b_trg_all == "T" ? 1 : 0,
			r = me.l5m/*checkFilterValues*/(firstrun ? 1 : 0, tab_changes),
			f_b_scr = filteroptions ? filteroptions.f_b_scr : null,
			i, docid, bd, _dzid,
			m, mr = 1;
		
		if (r && me.callback && me.v1/*updateValues*/ == false)
		{
			for (i=0; i < tab_changes.length; i++)
			{
				me.cc1/*changeActiveTab*/(tab_changes[i], true);
			}
			
			me._fr = firstrun;
			
			if (r && f_b_trg && me.report)
			{
				m = me.report.J3/*updateAllFilters*/.call(me.report, me, f_b_trg_all);
				
				if (!m)
				{
					mr = 0;
				}
			}

			if (!is_config && (!firstrun || loaded))
			{
				if (mr)
				{
					if (f_b_scr && window[f_b_scr])
					{
						try
						{
							var fmap = {},
								mr,
								i;
								
							for (i=0; i < filteritems.length; i++)
							{
								fmap[filteritems[i].name] = filteritems[i].value;
							}
								
							mr = window[f_b_scr].call(this, fmap);
							
							if (mr && mr.err)
							{
								IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, mr.errmsg, null, null, 1, "error");
								return;
							}
						}
						catch (e)
						{
							// M$/*mutil*/.L20/*alertmsg*/(m$$.companyname, "Script Error", null, null);
							return;
						}
					}
				}
				
				if (mr)
				{
					if (is_button)
					{
						me.callback.execute(me);
					}
					else
					{
						me.callback.execute(me);
					}
				}
			}
			else if (firstrun)
			{
				me.container.trigger("i_ready");
			}
			
			for (i=0; i < tab_changes.length; i++)
			{
				me.cc1/*changeActiveTab*/(tab_changes[i], undefined, firstrun, loaded);
			}
		}
	},
	
	lv/*isVisible*/: function(uitem, showcondition) {
		var r = 0,
			cs = showcondition.split("="),
			values = uitem.value,
			i, j,
			cv;
			
		if (cs[0] == uitem.name && values && cs[1])
		{
			cv = cs[1].split(",");
			
			for (i=0; i < values.length; i++)
			{
				if (values[i].code == cs[1])
				{
					r = 1;
					break;
				}
				else if (cv.length > 1)
				{
					for (j=0; j < cv.length; j++)
					{
						if (values[i].code == cv[j])
						{
							r = 1;
							break;
						}
					}
				}
				
				if (r)
					break;
			}
		}
		
		return r;
	},
	
	l5a/*updateHierarchy*/: function(uitem) {
		var me = this,
			vitems = [],
			citems = [],
			i, j, hf,
			item,
			m,
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			r = null,
			v;
			
		if (uitem.invokejs && window[uitem.invokejs])
		{
			r = window[uitem.invokejs].call(me, uitem);
		}
		
		if (r != false)
		{
			for (i=0; i < filteritems.length; i++)
			{
				item = filteritems[i];
				if (item.name != uitem.name && item.hfilter && item.hfilter.length > 0)
				{
					hf = item.hfilter.split(";");
					for (j=0; j < hf.length; j++)
					{
						if (hf[j] == uitem.name)
						{
							item.validated = false;
							vitems.push(item);
						}
					}
				}
				
				if (item.name != uitem.name && item.showcondition)
				{
					if (item.showcondition.indexOf(uitem.name) > -1)
					{
						citems.push(item);
					}
				}
			}
			
			if (citems.length > 0)
			{
				uitem.value = [];
				me.l7a/*updateFilterValue*/(uitem);
				
//				if (uitem.value && uitem.value.length > 0)
//				{
//					m = uitem.value[0].code;
//				}
				
				for (i=0; i < citems.length; i++)
				{
					v = me.lv/*isVisible*/(uitem, citems[i].showcondition);
					
					me.c3/*controlVisible*/(citems[i], v);
					 // citems[i].showcondition == uitem.name + "=" + m)
				}
			}
			
			if (vitems.length > 0)
			{
				me._IJ3/*initFilter*/(vitems);
				me.l3/*validateItems*/(vitems, undefined, true);
			}
		}
		
		return r;
	},
	
	c3/*controlVisible*/: function(citem, v) {
		var s = v ? "show" : "hide";
		citem.u2[s]();
		citem.u3[s]();
		citem.u4[s]();
	},
	
	l6/*updateFilterValue*/: function(item) {
		var aname = "";
		item.data = item.data || [];
		item.iV/*updateValues*/ = true;
		if (item.u2)
		{
			var me = this,
				ui = item.u2, tvalue,
				i, data = item.data, dp, allnumeric = true, min, max, step,
				sctrl, sctrl1,
				sdp,
				dval,
				s1a, s1b, s1c;
			
			switch (item.objtype)
			{
			case "slider":
				if (data.length > 0)
				{
					min = parseFloat(data[0].code);
					max = min;
					for (i=0; i < data.length; i++)
					{
						tvalue = parseFloat(data[i].code);
						if (isNaN(tvalue) == false)
						{
							min = Math.min(tvalue, min);
							max = Math.max(tvalue, max);
						}
						else
						{
							allnumeric = false;
							break;
						}
					}
					
					item.allnumeric = allnumeric;
					
					if (allnumeric == true)
					{
						step = (max-min) / Math.max(data.length, 20);
						s1a = item.s1a ? Number(item.s1a) : min;
						s1b = item.s1b ? Number(item.s1b) : max;
						s1c = item.s1c ? Number(item.s1c) : step;
					}
					else
					{
						s1a = item.s1a ? Number(item.s1a) : 0;
						s1b = item.s1b ? Number(item.s1b) : data.length;
						s1c = item.s1c ? Number(item.s1c) : 1;
					}
					
					ui.slider("option", "min", s1a);
					ui.slider("option", "max", s1b);
					ui.slider("option", "step", s1c);
					ui.slider("values", 0, s1a);
					ui.slider("values", 1, s1b);
					
					me.l8/*updateSlideValue*/.call(me, ui);
				}
				break;
			case "fileupload":
				item.selection = [];
				break;
			case "combobox":
				if (item.showpopup == true)
				{
					item.selection = [];
				}
				else
				{
					sctrl = $("[name=c_m1]", ui);
					sctrl1 = $("[name=c_m2]", ui);
					sdp = [];
					if (item.showallvalue == true)
					{
						if (item.isnecessary == true)
						{
							aname = item.aname || IRm$/*resources*/.r1("L_SELECT_VALUE");
						}
						else
						{
							aname = item.aname || IRm$/*resources*/.r1("L_ALL_VALUE");
						}
						
						sctrl.attr("placeholder", aname);
						sctrl1.attr("placeholder", aname);
						
						IG$/*mainapp*/._$A/*placeholder*/(sctrl);
						IG$/*mainapp*/._$A/*placeholder*/(sctrl1);
						
						sdp.push({label: aname, value: ""});
					}
					
					dval = item._p1/*main*/.m1/*getDefaultValue*/.call(item._p1/*main*/, item);
					
					item._svalues = [];
					
					for(i=0; i < data.length; i++)
					{
						sdp.push({label: (data[i].disp || data[i].code), value: data[i].code});
						if (dval && dval == data[i].code)
						{
							if (item.rangevalue)
							{
								item._svalues.push(
									{
										code: data[i].code,
										text: data[i].disp || data[i].code
									}
								);
							}
							else
							{
								item._svalues = [
									{
										code: data[i].code,
										text: data[i].disp || data[i].code
									}
								];
							}
						}
					}
					
					if (!item.showallvalue && !item.defaultvalue && sdp.length)
					{
						item._svalues = [
							{
								code: sdp[0].value,
								text: sdp[0].label
							}
						];
						
						if (item.rangevalue)
						{
							item._svalues.push({
								code: sdp[sdp.length-1].value,
								text: sdp[sdp.length-1].label
							});
						}
					}
					
					if (item._svalues && item._svalues.length)
					{
						sctrl.val(item._svalues[0].text);
						
						if (item.rangevalue)
						{
							item._svalues[1] && sctrl1.val(item._svalues[1].text);
						}
					}
					
					item.sdp = sdp;
					sctrl.trigger("change");
				}
				break;
			case "radiobox":
			case "checkbox":
				if (item.objtype == "checkbox" && item.showpopup == true)
				{
					item.selection = [];
				}
				else
				{
					ui.empty();
					
					dp = ui.attr("options");
					if (item.showallvalue == true)
					{
						if (item.isnecessary == true)
						{
							aname = item.aname || IRm$/*resources*/.r1("L_SELECT_VALUE");
						}
						else
						{
							aname = item.aname || IRm$/*resources*/.r1("L_ALL_VALUE");
						}
						$("<option value=''>" + aname + "</option>").appendTo(ui);
					}
					for(i=0; i < data.length; i++)
					{
						// dp[i+1] = new Option(disp && disp.length > i ? disp[i] : data[i], data[i]);
						$("<option value='" + data[i].code + "'>" + (data[i].disp || data[i].code) + "</option>").appendTo(ui);
					}
					
					item.u2.trigger("change");
				}
				break;
			case "checkbuttons":
				var td = $("ul", ui),
					inp,
					box,
					aname;
					
				td.empty();
				
				dval = item._p1/*main*/.m1/*getDefaultValue*/.call(item._p1/*main*/, item);
				
				if (item.showallvalue)
				{
					aname = item.aname || IRm$/*resources*/.r1("L_SELECT_VALUE");
					box = $("<li class='igc-chk-sel-all'></li>").appendTo(td);
					inp = $("<label><input type='checkbox' value=''/><span>" + (aname) + "</span></label>").appendTo(box);
					inp.bind("click", function() {
						td.trigger("checkbox_sel_all");
						
						item.___prv_event = 1;
						
						var s = 0;
						
						if ($("input[type='checkbox']", inp).is(':checked'))
						{
							s = 1;
						}
						
						$.each(data, function(i, dt) {
							if (dt.u2)
							{
								var dobj = $("input[type='checkbox']", dt.u2);
								if (s)
								{
									dobj.prop("checked", true);
								}
								else
								{
									dobj.prop("checked", false);
								}
								
								// dobj.trigger("change");
							}
						});
						
						item.___prv_event = 0;
						
						td.trigger("checkboxchanged", null);
					});
					
					if (dval == "ALL")
					{
						$("input[type='checkbox']", inp).prop("checked", true);
					}
					
					item._c_a1 = inp;
				}
				
				$.each(data, function(i, dt) {
					var box = $("<li></li>").appendTo(td),
						inp = $("<label><input type='checkbox' value='" + dt.code + "'/><span>" + (dt.disp || dt.code) + "</span></label>").appendTo(box),
						inp_b = $("input[type='checkbox']", inp);
						
					dt.u2 = inp;
					dt.u2b = inp_b;
					
					if (dt.code == dval || dt.selected || dval == "ALL")
					{
						inp_b.prop("checked", true);
					}
					
					inp_b.bind("change", function() {
						if (!item.___prv_event)
						{
							td.trigger("checkboxchanged", dt);
						}
					});
				});
				
				if (item.checkbuttonhor == "T")
				{
					$("li", td).css({
						"float": "left",
						"paddingRight": 5
					});
				}
				
				td.trigger("checkboxchanged", null);
				break;
			case "radiobuttons":
				var td = $("ul", ui),
					inp,
					box;
				td.empty();
				
				window.rdo_id = window.rdo_id || 0;
				window.rdo_id++;
				
				dval = item._p1/*main*/.m1/*getDefaultValue*/.call(item._p1/*main*/, item);
				
				$.each(data, function(i, dt) {
					box = $("<li></li>").appendTo(td);
					inp = $("<label><input type='radio' name='radio_" + (window.rdo_id) + "' value='" + dt.code + "'/><span>" + (dt.disp || dt.code) + "</span></label>").appendTo(box);
					dt.u2 = inp;
					
					if ((dval && dt.code == dval) || dt.selected)
					{
						$("input[type=radio]", inp).prop("checked", true);
					}
					
					inp.bind("change", function() {
						setTimeout(function() {
							td.trigger("radioboxchanged");
						}, 100);
					});
				});
				
				td.trigger("radioboxchanged");
				
				if (item.checkbuttonhor == "T")
				{
					$("li", td).css({
						"float": "left",
						"paddingRight": 5
					});
				}
				break;
			case "text":
				
				break;
			case "calendar":
				
				break;
			case "calendarperiod":
				break;
			}
		}
		
		item.iV/*updateValues*/ = false;
	},
	
	_uu1/*updateFilterPrompt*/: function(prompts) {
		var me = this,
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			filteroptions = me._ILb/*sheetoption*/.pff1a/*filteroptions*/,
			item,
			i, j,
			values, v;
		
		for (i=0; i < filteritems.length; i++)
		{
			item = filteritems[i];
			
			if (item.value && item.value.length > 0)
			{
				for (j=0; j < item.value.length; j++)
				{
					v = item.value[j].value || item.value[j].code;
					values = (j == 0 ? v : values + ", " + v);
				}
				
				prompts[item.name] = values;
			}
		}
	},
	
	_IB4/*getExportData*/: function(sx, sy, docid, d_width, d_height) {
		var me = this,
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			filteroptions = me._ILb/*sheetoption*/.pff1a/*filteroptions*/,
			ntable = (filteroptions.columnsize ? filteroptions.columnsize : 1),
			r = [], item,
			i, j, n=0, mx = sx, my = sy,
			values, v,
			tval;
		
		for (i=0; i < filteritems.length; i++)
		{
			item = filteritems[i];
			
			if (n > 0 && n % ntable == 0)
			{
				my += 30;
				mx = sx;
			}
			
			if (item.value && item.value.length > 0)
			{
				for (j=0; j < item.value.length; j++)
				{
					v = item.value[j].value || item.value[j].code;
					values = (j == 0 ? v : values + ", " + v);
				}
				
				tval = (item.ltitle || item.title || item.lname || item.name);
				
				if (tval && tval.charAt(0) == "$")
				{
					tval = IRm$/*resources*/.r1(tval);
				}
				
				tval += " (" + values + ")"
				
				r.push("<item type='label' x='" + mx + "' y='" + my + "' d_width='" + d_width + "' d_height='" + d_height + "' docid='" + docid + "'>");
				r.push("<text>" + tval + "</text>");
				r.push("</item>");
			}
			
			mx += 100;
			n += (item.objmerge || 1);
		}
			
		return r.join("");
	},
	
	l7/*getFilter*/: function() {
		var me = this,
			i, r = "<FilterData>", j, ui,
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			value, operator, value1, value2,
			item, k;
		
		for (i=0; i < filteritems.length; i++)
		{
			item = filteritems[i];
			
			// if (item.type != "viewselector")
			// {
				item.value = [];
				k = me.l7a/*updateFilterValue*/(item);
				
				if (k)
				{
					r += k;
				}
			// }
		}
		
		r += "</FilterData>";
		return r;
	},
	
	l7a/*updateFilterValue*/: function(item) {
		var me = this,
			i, j, ui, value, disp, operator, value1, value2,
			tval,
			valueformat,
			sctrls,
			r = "",
			dateseltype = item.dateseltype;
		
		if (item.u2)
		{
			ui = item.u2;
			
			switch (item.objtype)
			{
			case "slider":
				var i0 = ui.slider("values", 0),
					i1 = ui.slider("values", 1),
					min = ui.slider("option", "min"),
					max = ui.slider("option", "max");
				
				if (item.allnumeric == false)
				{
					if (i0 > 0 || i1 < item.data.length)
					{
						for (j=i0; j < i1; j++)
						{
							item.value.push({code: item.data[j].code, value: item.data[j].disp, operator: "EQ"});
						}
					}
				}
				else if (min < i0 || max > i1)
				{
					item.value.push({code: "" + i0, value: "" + i0, operator: "GTE"});
					item.value.push({code: "" + i1, value: "" + i1, operator: "LTE"});
				}
				break;
			case "calendar":
				if (dateseltype == "year")
				{
					value = $("option:selected", item.dt).val();
				}
				else if (dateseltype == "month")
				{
					value = item.dt.monthpicker("getDate");
				}
				else
				{
					value = item.dt.datepicker("getDate");
				}
				
				if (value)
				{
					if (dateseltype == "year")
					{
					}
					else
					{
						value = value.format("Ymd"); //  + "000000";
					}
					item.value.push({code: value, value: value, format: "date"});
				}
				break;
			case "calendarperiod":
				if (dateseltype == "year")
				{
					value1 = $("option:selected", item.dt1).val();
					value2 = $("option:selected", item.dt2).val();
				}
				else if (dateseltype == "month")
				{
					value1 = item.dt1.monthpicker("getDate");
					value2 = item.dt2.monthpicker("getDate");
					value2 = new Date(value2.getFullYear(), value2.getMonth()+1, 0);
				}
				else
				{
					value1 = item.dt1.datepicker("getDate");
					value2 = item.dt2.datepicker("getDate");
				}
				
				if (value1 && value2)
				{
					if (dateseltype == "year")
					{
						
					}
					else
					{
						value1 = value1.format("Ymd") + "000000";
						value2 = value2.format("Ymd") + "235959";
					}
					
					if (Number(value1) < Number(value2))
					{
						item.value.push({code: value1, value: value1, operator: "GTE", format: "date"});
						item.value.push({code: value2, value: value2, operator: "LTE", format: "date"});
					}
					else
					{
						r = 0;
					}
				}
				break;
			case "text":
				var sctrls = [$("[name=c_m1]", ui)];
				if (item.rangevalue)
				{
					sctrls.push($("[name=c_m2]", ui));
				}
				
				$.each(sctrls, function(m, mui) {
					var tval = mui.val(),
						i;
					
					if (tval)
					{
						item.value.push({code: tval, value: tval});
					}
				});
				break;
			case "fileupload":
				item.selection = item.selection || [];
				
				if (item.selection.length)
				{
					item.value.push({code: item.selection[0].code, value: item.selection[0].value});
				}
				break;
			case "combobox":
				// value = ui.val();
				// disp = $("option:selected", ui).text();
				if (item.showpopup)
				{
					item.selection = item.selection || [];
					if (item.selection.length)
					{
						item.value.push({code: item.selection[0].code, value: item.selection[0].value});
					}
				}
				else
				{
					var sctrls = [$("[name=c_m1]", ui)];
					if (item.rangevalue)
					{
						sctrls.push($("[name=c_m2]", ui));
					}
					
					value = [];
					
					$.each(sctrls, function(m, mui) {
						var tval = mui.val(),
							placeholder = mui.attr("placeholder"),
							i;
						if (!item.rangevalue && tval && item._svalues && item._svalues.length && item._svalues[0].text == tval)
						{
							if (!placeholder || (placeholder && tval != placeholder))
							{
								value = item._svalues;
							}
						}
						else if (tval && item.sdp && item.sdp.length)
						{
							for (i=0; i < item.sdp.length; i++)
							{
								if (placeholder && tval == placeholder)
								{
									continue;
								}
								else if (item.sdp[i].value == tval || item.sdp[i].label == tval)
								{
									value.push(
										{
											code: item.sdp[i].value,
											text: item.sdp[i].text || item.sdp[i].label
										}
									);
									break;
								}
							}
						}
					});
					
					if (value && (!item.rangevalue && value.length > 0) || (item.rangevalue && value.length > 1))
					{
						for (i=0; i < value.length; i++)
						{
							item.value.push({code: value[i].code, value: value[i].text});
						}
					}
				}
				break;
			case "checkbox":
				if (item.showpopup)
				{
					item.selection = item.selection || [];
					for (j=0; j < item.selection.length; j++)
					{
						item.value.push({code: item.selection[j].code, value: item.selection[j].value});
					}
				}
				else
				{
					value = ui.val() || [];
					for (j=0; j < value.length; j++)
					{
						if (value[j] != "")
						{
							item.value.push({code: value[j], value: value[j]});
						}
					}
				}
				break;
			case "checkbuttons":
				if (item.data)
				{
					for (j=0; j < item.data.length; j++)
					{
						if (item.data[j].u2 && $("input[type='checkbox']", item.data[j].u2).is(':checked'))
						{
							item.value.push({code: item.data[j].code, value: item.data[j].value});
						}
					}
				}
				break;
			case "radiobuttons":
				if (item.data)
				{
					for (j=0; j < item.data.length; j++)
					{
						if (item.data[j].u2 && $("input[type='radio']", item.data[j].u2).is(':checked'))
						{
							item.value.push({code: item.data[j].code, value: item.data[j].value});
						}
					}
				}
				break;
			case "radiobox":
				value = ui.val() || [];
				for (j=0; j < value.length; j++)
				{
					if (value[j] != "")
					{
						item.value.push({code: value[j], value: value[j]});
					}
				}
				break;
			}
			
			if (item.value && item.value.length > 0)
			{
				r += "<Filter>";
				for (j=0; j < item.value.length; j++)
				{
					operator = item.value[j].operator || item.operator || "";
					valueformat = item.valueformat || "";
					
					r += "<Row" + IG$/*mainapp*/._I20/*XUpdateInfo*/(item, "uid;name;type", "s") + 
						" operator='" + operator + "'" +
						" title='" + (item.title || "") + "'" + 
						" useprompt='" + (item.useprompt ? "T" : "F") + "'" + 
						IG$/*mainapp*/._I20/*XUpdateInfo*/(item.value[j], "format", "s") + ">" + 
						((item.value[j].code) ? "<code><![CDATA[" + item.value[j].code + "]]></code>" : "") + 
						((item.value[j].value) ? "<value><![CDATA[" + item.value[j].value + "]]></value>" : "") + 
						(valueformat ? "<valueformat><![CDATA[" + valueformat + "]]></valueformat>" : "") + 
						"</Row>";
				}
				r += "</Filter>";
			}
		}
		
		return r;
	},
	
	l8/*updateSlideValue*/: function(slider) {
		var i, 
			me = this,
			slide = $(slider),
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			filteritem,
			handles = slide.children("a"),
			handle,
			value;
	
		if (handles && handles.length == 2)
		{
			for (i=0; i < filteritems.length; i++)
			{
				if (filteritems[i].u2 && filteritems[i].u2[0] == slide[0])
				{
					filteritem = filteritems[i];
					break;
				}
			}
			
			for (i=0; i < handles.length; i++)
			{
				value = slide.slider("values", i);
				
				if (filteritem && filteritem.data && filteritem.allnumeric == false)
				{
					if (filteritem.data.length > value)
					{
						value = "" + filteritem.data[value].code;
					}
					else
					{
						value = "";
					}
				}
				else
				{
					value = "" + value;
				}
				
				handle = $(handles[i]);
				
				handle.tooltip({
					track: true,
					delay: 0,
					fade: 250,
					showURL: false
				});
				
				handle[0].tooltipText = value;
			}
		}
	},
	
	l8a/*updateSlideValue*/: function(slider, ctrl, left) {
		var i, 
			me = this,
			slide = $(slider),
			filteritems = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			filteritem,
			handles = slide.children("a"),
			handle,
			value, 
			guide;
	
		if (handles && handles.length == 2)
		{
			for (i=0; i < filteritems.length; i++)
			{
				if (filteritems[i].u2 && filteritems[i].u2[0] == slider)
				{
					filteritem = filteritems[i];
					break;
				}
			}
			
			for (i=0; i < handles.length; i++)
			{
				if (ctrl.handle == handles[i])
				{
					value = slide.slider("values", i);
					
					if (filteritem && filteritem.data && filteritem.allnumeric == false)
					{
						if (filteritem.data.length > value)
						{
							value = "" + filteritem.data[value].code;
						}
						else
						{
							value = "";
						}
					}
					else
					{
						value = "" + value;
					}
					
					guide = slide.children(".guide");
					guide.css({left: left}).html(value);
				}
			}
		}
	},
	
	setLoading: function(visible) {
		var me = this;
		
		me.sp/*splash*/[(visible == true) ? "show" : "fadeOut"]();
	},
	
	_IJ3/*initFilter*/: function(vitems, cloaded) {
		var me = this,
			filteritems = vitems || me._ILb/*sheetoption*/.pff1/*filterItems*/,
			item, ui,
			i,
			crun = me.c2/*isloaded*/;
		
		for (i=0; i < filteritems.length; i++)
		{
			item = filteritems[i];
			if (item.u2)
			{
				ui = item.u2;
				
				switch (item.objtype)
				{
				case "slider":
					break;
				case "calendar":
					break;
				case "text":
					var sctrls = [$("[name=c_m1]", ui)];
					if (item.rangevalue)
					{
						sctrls.push($("[name=c_m2]", ui));
					}
					
					$.each(sctrls, function(m, mi) {
						mi.val("");
					});
					break;
				case "combobox":
					if (item.showpopup == true)
					{
						$("input[type=text]", ui).val("");
						item.selection = [];
					}
					else
					{
						$("input[type=text]", ui).val("");
					}
					break;
				case "checkbox":
					if (item.showpopup == true)
					{
						$("input[type=text]", ui).val("");
						item.selection = [];
					}
					else
					{
						ui.val([]);
					}
					break;
				case "radiobox":
					ui.val([]);
					break;
				}
			}
		}
		
		if (cloaded && crun)
		{
			this.c1/*firstRun*/();
		}
	}
}
IG$/*mainapp*/._ICc/*clControlItem*/ = function(node, uctrl, dsmode) {
	var me = this;
	me.P1/*parentcontrol*/ = null;
	me.P2/*subcontrols*/ = [];
	me.P3/*applicationItem*/ = null;
	me.P5/*position*/ = {top: 10, left:10, right: null, bottom: null, width: 100, height: 100, percentwidth: null, percentheight: null};
	me.P6/*ctrlname*/ = "";
	me.dsmode = dsmode;
	
	me.P7/*property*/ = {
		visible: "true",
		border: "1",
		bordercolor: "#e5e5e5",
		backgroundcolor: "#ffffff",
		padding: "2"
	};
	// me.P8/*events*/ = {};
	me.uctrl = uctrl;
	me.actionlist = {};
	
	if (me.uctrl && me.uctrl.P4/*ctrltype*/ == "panel" && me.uctrl.P7/*property*/["layout"] == "border")
	{
		me.P7/*property*/["title"] = me.P7/*property*/["title"] || " ";
	}
	
	if (node)
	{
		me.P4/*ctrltype*/ = node.type;
		var i, propnode, child, nodename, actname, actobj;
		
		me.P5/*position*/ = node.position || null;
		
		me.P7/*property*/ = node.properties;
		me.P6/*ctrlname*/ = node.name;
		
		me.P9/*control*/ = me.getControl(me.P4/*ctrltype*/.toLowerCase());
		
		me.P3/*applicationItem*/ = node.item;
		
		if (node.item)
		{
			me.P9/*control*/.aa/*applyApplication*/(me.P3/*applicationItem*/);
		}
		
		me.actionlist = node.actionlist;
	}
	
	me.P10/*measuredRect*/ = {x:0, y:0, w:20, h:20};
}

IG$/*mainapp*/._ICc/*clControlItem*/.prototype = {
	P12/*getSelectionData*/: function(itemname) {
		var me = this,
			seldata = null;
		
		if (me.P9/*control*/ && me.P9/*control*/.P12/*getSelectionData*/) {
			seldata = me.P9/*control*/.P12/*getSelectionData*/.call(me.P9/*control*/, itemname);
		}
		
		return seldata;
	},
	
	disposeContent: function (ui) {
		if (ui.control && typeof ui.control != 'undefined')
		{
			ui.control.disposeContent(ui.control);
			ui.control = null;
		}
	},
	
	P11/*measurePosition*/: function(uctrl, x, y, w, h) {
		var me = this,
			p = me.P5/*position*/;
			m = me.P10/*measuredRect*/;
		
		if (p.top != null && p.bottom != null)
		{
			m.y = p.top;
			m.h = h - (p.bottom + p.top);
		}
		else if (p.height != null)
		{
			m.h = p.height;
			if (p.top != null)
			{
				m.y = p.top;
			}
			else if (p.bottom != null)
			{
				m.y = h - p.height - p.bottom;
			}		
		}
		else if (p.percentheight != null)
		{
			if (p.top != null)
			{
				m.y = p.top;
				m.h = (h - p.top) * 0.01 * p.percentheight;
			}
			else if (p.bottom != null)
			{
				m.h = (h - p.bottom) * 0.01 * p.percentheight;
				m.y = (h - m.h - p.bottom);
			}
		}
		
		if (p.left != null && p.right != null)
		{
			m.x = p.left;
			m.w = w - (p.right + p.left);
		}
		else if (p.width != null)
		{
			m.w = p.width;
			if (p.left != null)
			{
				m.x = p.left;
			}
			else if (p.right != null)
			{
				m.x = w - p.width - p.right;
			}		
		}
		else if (p.percentwidth != null)
		{
			if (p.left != null)
			{
				m.x = p.left;
				m.w = (w - p.left) * 0.01 * p.percentwidth;
			}
			else if (p.right != null)
			{
				m.w = (w - p.percentwidth * 0.01 - p.right);
				m.x = (w - m.w) - p.right;
			}
		}
		
		m._px = x;
		m._py = y;
	},
	
	getControl: function(ctrltype) {
		var me = this;
		return IG$/*mainapp*/.getControl.call(me, ctrltype, me.dsmode);
	},
	
	i9/*initDesignerMode*/: function(node) {
		var ctrl = this.P9/*control*/,
			html;
		if (ctrl)
		{
			html = ctrl._1/*createControl*/.call(ctrl, node);
		}
		
		node.dummy = ctrl;
		
		return html;
	}
}

IG$/*mainapp*/.getControl = function(ctrltype, dsmode, gsize) {
	var ctrl = null,
		me = this;
		
	if (gsize)
	{
		ctrl = {
			width: 100,
			height: 100
		};
		
		if (/(titlelabel|label|button|textbox|datechooser|monthchooser|combobox)/.test(ctrltype))
		{
			ctrl.height = 25;
		}
	}
	else
	{
		switch (ctrltype)
		{
		case "titlelabel":
			ctrl = new IG$/*mainapp*/._ID4/*ctrlTitleLabel*/(me.P7/*property*/, me, dsmode);
			break;
		case "olapreport":
		case "compositereport":
			ctrl = new IG$/*mainapp*/._IDd/*ctrlOLAPReport*/(me.P7/*property*/, me, dsmode);
			break;
		case "label":
			ctrl = new IG$/*mainapp*/._ID5/*ctrlLabel*/(me.P7/*property*/, me, dsmode);
			break;
		case "textarea":
			ctrl = new IG$/*mainapp*/._ID8/*ctrlTextArea*/(me.P7/*property*/, me, dsmode);
			break;
		case "picture":
		case "image":
			ctrl = new IG$/*mainapp*/._ID6/*ctrlPicture*/(me.P7/*property*/, me, dsmode);
			break;
		case "button":
			ctrl = new IG$/*mainapp*/._ID9/*ctrlButton*/(me.P7/*property*/, me, dsmode);
			break;
		case "textbox":
			ctrl = new IG$/*mainapp*/._ID7/*ctrlTextInput*/(me.P7/*property*/, me, dsmode);
			break;
		case "datechooser":
			ctrl = new IG$/*mainapp*/._IDb/*ctrlDateField*/(me.P7/*property*/, me, dsmode);
			break;
		case "monthchooser":
			ctrl = new IG$/*mainapp*/.jj_3/*ctrlMonthField*/(me.P7/*property*/, me, dsmode);
			break;
		case "combobox":
			ctrl = new IG$/*mainapp*/._IDa/*ctrlComboBox*/(me.P7/*property*/, me, dsmode);
			break;
		case "panel":
			ctrl = new IG$/*mainapp*/._IDc/*ctrlPanel*/(me.P7/*property*/, me, dsmode);
			break;
		case "treefilter":
			ctrl = new IG$/*mainapp*/._IDf/*ctrlTreeFilter*/(me.P7/*property*/, me, dsmode);
			break;
		case "grid":
			ctrl = new IG$/*mainapp*/._Imm/*interactiveGrid*/(me.P7/*property*/, me, dsmode);
			break;
		case "browser":
			ctrl = new IG$/*mainapp*/.jj_1/*browserpanel*/(me.P7/*property*/, me, dsmode);
			break;
		case "sheetfilter":
			ctrl = new IG$/*mainapp*/.jj_2/*sheetfilter*/(me.P7/*property*/, me, dsmode);
			break;
		case "tabpanel":
			ctrl = new IG$/*mainapp*/.jj_3/*tabpanel*/(me.P7/*property*/, me, dsmode);
			break;
		case "dashboard":
			ctrl = new IG$/*mainapp*/.jj_5/*dashboard*/(me.P7/*property*/, me, dsmode);
			break;
		case "promptfilter":
			ctrl = new IG$/*mainapp*/.jj_4/*promptfilter*/(me.P7/*property*/, me, dsmode);
			break;
		case "checkbox":
			ctrl = new IG$/*mainapp*/.$iDa/*ctrlCheckbox*/(me.P7/*property*/, me, dsmode);
			break;
		case "pivotfilter":
			ctrl = new IG$/*mainapp*/.jj_M/*pivotfilter*/(me.P7/*property*/, me, dsmode);
			break;
		default:
			ctrl = new IG$/*mainapp*/._ID3/*ctrlNullControl*/(me.P7/*property*/, me, dsmode);
			break;
		}
	
		ctrl.type = ctrltype;
	}
	
	return ctrl;
}

IG$/*mainapp*/._ICd/*clValueList*/ = function(xdoc, uid) {
	var me = this,
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/result/data"),
		hnode,
		tchild, 
		i, sid, sname, delimiter, rnode, tvalues=null, tdescs=null, dnode, val,
		rprop, cols, tprop,
		codefield = [], sortfield = [],
		n_geolat = -1,
		n_geolng = -1,
		cf = {}, sf = {},
		tindex,
		row,
		geolat, geolng,
		data = [],
		dmode = 0,
		dn,
		snode;
		
	me.data = data;
	
	rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/result");
	
	if (rnode)
	{
		rprop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(rnode);
		
		delimiter = rprop["delimiter"];
		me.pool = rprop["pool"];
		geolat = rprop["geolat"];
		geolng = rprop["geolng"];
		cols = parseInt(rprop["cols"]);
		codefield = rprop["codefield"];
		sortfield = rprop["sortfield"];
		
		codefield = (codefield && codefield.length > 0) ? codefield.split(",") : [];
		sortfield = (sortfield && sortfield.length > 0) ? sortfield.split(",") : [];
	}
	
	if (tnode)
	{
		hnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "Header");
		tchild = IG$/*mainapp*/._I26/*getChildNodes*/(hnode);
	}
	else
	{
		tnode = hnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "TupleData");
		if (tnode)
		{
			tchild = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			dmode = 1;
			cols = 1;
		}
	}
	
	if (tchild)
	{
		if (me.pool && me.pool.indexOf(";") > -1)
		{
			me.pool = me.pool.substring(0, me.pool.indexOf(";"));
		}
		
		tindex = -1;
		
		for (i=0; i < tchild.length; i++)
		{
			tprop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tchild[i]);
			if (tprop["uid"] == uid || tprop["name"] == uid)
			{
				tindex = i;
				snode = IG$/*mainapp*/._I18/*XGetNode*/(tchild[i], "DataList");
			}
			else if (geolat && (tprop.uid == geolat || tprop.name == geolat))
			{
				n_geolat = i;
			}
			else if (geolng && (tprop.uid == geolng || tprop.name == geolng))
			{
				n_geolng = i;
			}
		}
		
		for (i=0; i < codefield.length; i++)
		{
			cf[parseInt(codefield[i])] = 1;
		}
		
		for (i=0; i < sortfield.length; i++)
		{
			sf[parseInt(sortfield[i])] = 1;
		}
		
		tvalues = dmode == 0 ? IG$/*mainapp*/._I24/*getTextContent*/(tnode) : (snode ? IG$/*mainapp*/._I24/*getTextContent*/(snode) : "");
		
		tvalues = tvalues.split(delimiter);
		
		if (tindex > -1)
		{
			i = 0;
			dn = dmode == 0 ? tvalues.length : tvalues.length - 1;
			while (i < dn)
			{
				if (cols == 1)
				{
					data.push({
						code: tvalues[i]
					});
				}
				else
				{
					n = i % cols;
					
					if (n == 0)
					{
						row = {};
					}
					else if (n == cols - 1)
					{
						if (!row.code)
						{
							row.code = row.text;
						}
						data.push(row);
					}
					
					if (n == tindex)
					{
						row.text = tvalues[i];
					}
					else if (cf[n])
					{
						row.code = tvalues[i];
					}
					else if (sf[n])
					{
						row.sort = tvalues[i];
					}
					else if (n_geolat == n)
					{
						row.lat = tvalues[i];
					}
					else if (n_geolng == n)
					{
						row.lng = tvalues[i];
					}
				}
				i++;
			}
		}
	}
}

IG$/*mainapp*/._ICe/*clEvents*/ = function(node) {
	var me = this,
		snode,
		fnode,
		snodelist,
		i, cf, inode, inodes,
		p;
	
	me.eventXML = node;
	
	if (node)
	{
		me.purpose = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "purpose").toLowerCase();
		me.eventtype = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "type");
		me.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "uid");
		me.name = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "name");
		me.description = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "description");
	
		me.P13/*controlid*/ = null;
		me.enableoffline = null;
		me.filters = null;
		
		me.iparams = {};
		me.oparams = {};
		
		me.s_iparams = [];
		me.s_oparams = [];
		
		snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "params");
		
		if (snode)
		{
			inode = IG$/*mainapp*/._I18/*XGetNode*/(snode, "iparams");
			inodes = (inode ? IG$/*mainapp*/._I26/*getChildNodes*/(inode) : null);
			if (inodes)
			{
				for (i=0; i < inodes.length; i++)
				{
					p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(inodes[i]);
					
					me.iparams[p.name] = p;
				}
			}
			inode = IG$/*mainapp*/._I18/*XGetNode*/(snode, "oparams");
			inodes = (inode ? IG$/*mainapp*/._I26/*getChildNodes*/(inode) : null);
			if (inodes)
			{
				for (i=0; i < inodes.length; i++)
				{
					p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(inodes[i]);
					
					me.oparams[p.name] = p;
				}
			}
		}
	
		var purpose = me.purpose;
		
		if (purpose == "onlinereport")
		{
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "item");
			
			if (snode)
			{
				me.P13/*controlid*/ = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "controlid");
				me.item = {};
				IG$/*mainapp*/._I1f/*XGetInfo*/(me.item, snode, "type;nodepath;uid;name", "s");
			}
			
			fnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "item/Filter");
			me.__sfilter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
			
			if (fnode)
			{
				me.p2/*parseFilter*/(fnode, me.__sfilter);
			}
			
			fnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "item/HavingFilter");
			me.__shavingfilter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
			
			if (fnode)
			{
				me.p2/*parseFilter*/(fnode, me.__shavingfilter);
			}
		}
		else if (purpose == "valuelist")
		{
			// <options clearfilter="F" controlid="Combobox1" enableoffline="F" usereportcontent="T"/>
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options");
			if (snode)
			{
				// me.P13/*controlid*/ = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "controlid");
				// me.enableoffline = (IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "enableoffline") === "T") ? true : false;
				// me.usereportcontent = (IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "usereportcontent") === "T") ? true : false;
			}
			
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options/item");
			if (snode)
			{
				me.item = {};
				IG$/*mainapp*/._I1f/*XGetInfo*/(me.item, snode, "type;nodepath;uid;name;cubeuid", "s");
			}
		}
		else if (purpose == "execute_script")
		{
			// <Script/> <item name="execTestScript" ozid="" type=""> <path/></item><options>execTestScript</options>
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options/script");
			if (snode)
			{
				me.script = IG$/*mainapp*/._I24/*getTextContent*/(snode);
			}
		}
		else if (purpose == "servercall")
		{
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options/plugin");
			if (snode)
			{
				IG$/*mainapp*/._I1f/*XGetInfo*/(me, snode, "jmodule;jmodule_name", "s");
				me.jmethod = IG$/*mainapp*/._I24/*getTextContent*/(snode);
			}
		}
		else if (purpose == "open_dlg")
		{
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options/dialog");
			
			if (snode)
			{
				IG$/*mainapp*/._I1f/*XGetInfo*/(me, snode, "btntype;btnclose", "s");
				me.dlgmsg = IG$/*mainapp*/._I1a/*getSubNodeText*/(snode, "dlgmsg");
				me.dlgtitle = IG$/*mainapp*/._I1a/*getSubNodeText*/(snode, "dlgtitle");
			}
		}
		else if (purpose == "open_win")
		{
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options");
			if (snode)
			{
				me.ispopup = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "ispopup") == "T";
			}
			
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options/item");
			
			if (snode)
			{
				me.item = {};
				IG$/*mainapp*/._I1f/*XGetInfo*/(me.item, snode, "type;nodepath;uid;name", "s");
			}
		}
		else if (purpose == "export")
		{
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options/exp");
			
			if (snode)
			{
				// IG$/*mainapp*/._I1f/*XGetInfo*/(me, snode, "exp_out;exp_tmpl", "s");
				me.exp_tmpl = IG$/*mainapp*/._I1a/*getSubNodeText*/(snode, "exp_tmpl");
				me.exp_out = IG$/*mainapp*/._I1a/*getSubNodeText*/(snode, "exp_out");
			}
		}
		else if (purpose == "sql")
		{
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options/execute_sql");
			if (snode)
			{
				IG$/*mainapp*/._I1f/*XGetInfo*/(me, snode, "dsource;rmode", "s");
				me.sqlsyntax = IG$/*mainapp*/._I24/*getTextContent*/(snode);
			}
			
			me.columns = [];
			me.prompts = [];
			
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options/columns");
			
			if (snode)
			{
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
				
				for (i=0; i < snodes.length; i++)
				{
					var p = {};
					IG$/*mainapp*/._I1f/*XGetInfo*/(p, snodes[i], "name;fieldname;sqlfield;type;datatype;tablename;dataoption_data;dataoption_valuetype;dataoption_datadelimiter;dataoption_coldelimiter;uid;kname", "s");
					me.columns.push(p);
				}
			}
			
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options/prompts");
			
			if (snode)
			{
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
				
				for (i=0; i < snodes.length; i++)
				{
					var p = {};
					IG$/*mainapp*/._I1f/*XGetInfo*/(p, snodes[i], "name;fieldname;sqlfield;type;datatype;tablename;dataoption_data;dataoption_valuetype;dataoption_datadelimiter;dataoption_coldelimiter;uid;kname", "s");
					me.prompts.push(p);
				}
			}
		}
		
		snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options/s_iparams");
			
		if (snode)
		{
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
			
			for (i=0; i < snodes.length; i++)
			{
				var p = {};
				IG$/*mainapp*/._I1f/*XGetInfo*/(p, snodes[i], "name;kname", "s");
				me.s_iparams.push(p);
			}
		}
		
		snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "options/s_oparams");
			
		if (snode)
		{
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
			
			for (i=0; i < snodes.length; i++)
			{
				var p = {};
				IG$/*mainapp*/._I1f/*XGetInfo*/(p, snodes[i], "name;kname", "s");
				me.s_oparams.push(p);
			}
		}
	}
}

IG$/*mainapp*/._ICe/*clEvents*/.prototype = {
	p2/*parseFilter*/: function(node, filter) {
		var me = this;
		
		if (node)
		{
			var fglist = IG$/*mainapp*/._I26/*getChildNodes*/(node, "FilterGroup"),
				i;

			if (fglist && fglist.length > 0)
			{
				for (i=0; i < fglist.length; i++)
				{
					var tgroup = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
					tgroup.name = IG$/*mainapp*/._I1b/*XGetAttr*/(fglist[i], "name"); 
					filter.subGroups.push(tgroup);
					me.parseSubFilter(fglist[i], tgroup);
				}
			}
		}
	},
	parseSubFilter: function(fgnode, ugroup) {
		var i, j,
			group,
			sfg,
			me = this;
		
		sfg = IG$/*mainapp*/._I26/*getChildNodes*/(fgnode);
		
		if (sfg && sfg.length > 0)
		{
			for (j=0; j < sfg.length; j++)
			{
				if (IG$/*mainapp*/._I29/*XGetNodeName*/(sfg[j]) == "FilterGroup")
				{
					var group = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
					group.name = IG$/*mainapp*/._I1b/*XGetAttr*/(sfg[j], "name"); 
					me.parseSubFilter(sfg[j], group);
					ugroup.subGroups.push(group);
				}
				else
				{
					ugroup.subConditions.push(new IG$/*mainapp*/._IE9/*clFilter*/(sfg[j]));
				}
			}
		}
	},
	
	getXML: function() {
		var me = this,
			i,
			cf,
			r = "<event " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "purpose;type;name;description", "s") + ">",
			purpose = me.purpose,
			t;
		
		if (purpose == "onlinereport")
		{
			if (me.item)
			{
				r += "<item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.item, "uid;nodepath;type;name", "s") + ">";
			}
			else
			{
				r += "<item>";
			}
						
			r += "<Filter>";
			
			if (me.__sfilter)
			{
				r += me.__sfilter.TX/*getXML*/.call(me.__sfilter);
			}
			
			r += "</Filter>";
			
			r += "<HavingFilter>";
			
			if (me.__shavingfilter)
			{
				r += me.__shavingfilter.TX/*getXML*/.call(me.__shavingfilter);
			}
			
			r += "</HavingFilter>";
			r += "</item>";
			
			r += "<options>";
			
		}
		else if (purpose == "valuelist")
		{
			r += "<options controlid='" + (me.P13/*controlid*/ || "") + "' enableoffline='" + (me.enableoffline == true ? "T" : "F") + "'>";
			
			if (me.item)
			{
				r += "<item" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.item, "type;nodepath;uid;name;cubeuid", "s") + "/>";
			}
		}
		else if (purpose == "execute_script")
		{
			r += "<options><script><![CDATA[" + (me.script || "") + "]]></script>";
		}
		else if (purpose == "servercall")
		{
			r += "<options>";
			r += "<plugin jmodule_name='" + (me.jmodule_name || "") + "' jmodule='" + (me.jmodule || "") + "'><![CDATA[" + (me.jmethod || "") + "]]></plugin>";
		}
		else if (purpose == "open_dlg")
		{
			r += "<options>";
			r += "<dialog " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "btntype;btnclose", "s") + ">";
			r += "<dlgtitle><![CDATA[" + (me.dlgtitle || "") + "]]></dlgtitle>";
			r += "<dlgmsg><![CDATA[" + (me.dlgmsg || "") + "]]></dlgmsg>";
			r += "</dialog>";
		}
		else if (purpose == "export")
		{
			r += "<options>";
			r += "<exp>"; // + IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "btntype;btnclose", "s") + ">";
			r += "<exp_tmpl><![CDATA[" + (me.exp_tmpl || "") + "]]></exp_tmpl>";
			r += "<exp_out><![CDATA[" + (me.exp_out || "") + "]]></exp_out>";
			r += "</exp>";
		}
		else if (purpose == "open_win")
		{
			r += "<options ispopup='" + (me.ispopup ? "T" : "F") + "'>";
			if (me.item)
			{
				r += "<item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.item, "uid;nodepath;type;name", "s") + "/>";
			}
		}
		else if (purpose == "sql")
		{
			r += "<options>";
			r += "<execute_sql dsource='" + (me.dsource || "") + "' rmode='" + (me.rmode || "") + "'><![CDATA["
			r += (me.sqlsyntax || "") + "]]></execute_sql>";
			
			if (me.columns)
			{
				r += "<columns>";
				for (i=0; i < me.columns.length; i++)
				{
					r += "<column " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.columns[i], "name;fieldname;sqlfield;type;datatype;tablename;dataoption_data;dataoption_valuetype;dataoption_datadelimiter;dataoption_coldelimiter;uid;kname", "s") + "/>";
				}
				r += "</columns>";
			}
			
			if (me.prompts)
			{
				r += "<prompts>";
				for (i=0; i < me.prompts.length; i++)
				{
					r += "<prompt " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.prompts[i], "name;fieldname;sqlfield;type;datatype;tablename;dataoption_data;dataoption_valuetype;dataoption_datadelimiter;dataoption_coldelimiter;uid;kname", "s") + "/>";
				}
				r += "</prompts>";
			}
		}
		else
		{
			r += "<options>";
		}
		
		if (me.s_iparams)
		{
			r += "<s_iparams>";
			for (i=0; i < me.s_iparams.length; i++)
			{
				r += "<param " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.s_iparams[i], "name;kname", "s") + "/>";
			}
			r += "</s_iparams>";
		}
		
		if (me.s_oparams)
		{
			r += "<s_oparams>";
			for (i=0; i < me.s_oparams.length; i++)
			{
				r += "<param " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.s_oparams[i], "name;kname", "s") + "/>";
			}
			r += "</s_oparams>";
		}
			
		r += "</options>";
		
		r += "<params>";
		if (me.iparams)
		{
			r += "<iparams>";
			for (k in me.iparams) 
			{
				t = me.iparams[k];
				r += "<param name='" + t.name + "' map_param='" + (t.map_param || "") + "' map_type='" + (t.map_type || "") + "'/>";
			}
			r += "</iparams>";
		}
		
		if (me.oparams)
		{
			r += "<oparams>";
			for (k in me.oparams) 
			{
				t = me.oparams[k];
				r += "<param name='" + t.name + "' map_param='" + (t.map_param || "") + "' map_type='" + (t.map_type || "") + "'/>";
			}
			r += "</oparams>";
		}
		r += "</params>";
				
		r += "</event>";
		
		return r;
	}
}


IG$/*mainapp*/.__util = {};

IG$/*mainapp*/.__util.msgbox = function(msg) {
	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, msg, null, null, 1, "error");
}

IG$/*mainapp*/.__util._rcs = function(rcs, msg) {
	return msg;
}

IG$/*mainapp*/.__util.v_date = function(dt, sep) {
	var r = dt,
		dval;
	if (dt)
	{
		dval = [dt.substring(0, 4), dt.substring(4, 6), dt.substring(6, 8)];
		r = dval.join(sep);
	}
	
	return r;
};

IG$/*mainapp*/.__util.v_field = function(v, msg, title) {
	var r = true;
	
	if (!v)
	{
		r = false;
		
		if (msg)
		{
			IG$/*mainapp*/._I54/*alertmsg*/(title || ig$/*appoption*/.appname, msg, null, null, 1, "error");
		}
	}
	
	return r;
}

IG$/*mainapp*/._IE0/*controls*/ = {};

IG$/*mainapp*/._ID2/*ctrlBase*/ = function(property, ctrl, dsmode) {
	var me = this;
	me.ctrl = ctrl;
	me.p = [
		{name: "visible", type: "property", datatype: "boolean", value: true},
		{name: "border", type: "property", datatype: "number", value: 1},
		{name: "bordercolor", type: "property", datatype: "string", value: "#e5e5e5"},
		{name: "backgroundcolor", type: "property", datatype: "string"},
		{name: "padding", type: "property", datatype: "number", value: 2},
		{name: "flex", type: "property", datatype: "number", value: 1},
		{name: "basecls", type: "property", datatype: "string"}
	];
	me.property = property;
	me.P3/*applicationItem*/ = null;
	
	me.getter = {};
	me.setter = {};
	
	me.dsmode = dsmode;
	
	me.html = $("<div id='" + (ctrl != null ? ctrl.P6/*ctrlname*/ : "") + "' class='ig-db-ctrls'></div>");
	
	me.superclass = IG$/*mainapp*/._ID2/*ctrlBase*/;
	
	me._ic/*initComponent*/.call(me);
}

IG$/*mainapp*/._ID2/*ctrlBase*/.prototype = {
	__pcinit: function() {
		var me = this,
			key, 
			value;
		me.__pcinit_ = 1;
		
		for (key in me.property)
		{
			me.set.call(me, key, me.property[key]);
		}
		
		me.__pcinit_ = 0;
	},
		
	get: function(fname) {
		var me = this;
		
		if (me.getter[fname])
		{
			return me.getter[fname].call(me);
		}
		return null;
	},
	
	set: function(fname, value) {
		var me = this;
		if (me.setter[fname])
		{
			me.setter[fname].call(me, value);
		}
	},
	
	val: function(value) {
		return this[typeof(value) != "undefined" ? "set" : "get"]("text", value);
	},
	
	doGet: function(fname) {
		var me = this;
		
		if (me.getter[fname])
		{
			return me.getter[fname].call(me);
		}
		return null;
	},
	
	doSet: function(fname, value) {
		var me = this;
		if (me.setter[fname])
		{
			me.setter[fname].call(me, value);
		}
	},
	
	invalidate: function() {
	},
	
	updateBorder: function() {
		var me = this,
			bsize = (me.dsmode ? 1 : me.property["border"]),
			borderstyle = "" + bsize + "px solid " + me.property["bordercolor"];
		me.html.css({border: borderstyle});
	},
	
	_1/*createControl*/: function(layout) {
		var me = this;
			
		me.layout = layout;
		
		me.html.bind("click", function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			ev.stopImmediatePropagation();
			
			me._2/*raiseEvent*/.call(me, "click");
			
			return false;
		});
		
		me.html.resizable({
			resize: function(e, ui) {
				var p = ui.position,
					s = ui.size,
					layout = me.layout;
				layout.position.width = s.width;
				layout.position.height = s.height;
				
				me._2/*raiseEvent*/.call(me, "resize");
				
				me.invalidate.call(me);
			}
		});
		
		me.html.draggable({
			stop: function(e, ui) {
				var p = ui.position,
					layout = me.layout;
				
				layout.position.top = p.top;
				layout.position.left = p.left;
				
				me._2/*raiseEvent*/.call(me, "resize");
				
				me.invalidate.call(me);
			}
		});
		
		return me.html;
	},
	
	enabled: function(e) {
	},
	
	_2/*raiseEvent*/: function(ev) {
		var me = this;
		me.html.trigger("e_" + ev);
	},
	
	_b1/*_baseUpdateProperty*/: function(kname, value) {
		var me = this;
		
		me.property[kname] = value;
		
		switch (kname)
		{
		case "visible":
			if (value == false && !me.dsmode)
			{
				me.html.hide();
			}
			else
			{
				me.html.show();
			}
			break;
		case "border":
			me.updateBorder();
			break;
		case "bordercolor":
			me.updateBorder();
			break;
		case "basecls":
			value && me.html && me.html.addClass(value);
			break;
		}
	},
	
	_ic/*initComponent*/: function() {
		var me = this;
		
		$.each(me.p, function(i, k) {
			if (k.type == "property")
			{
				if (typeof(k.value) != "undefined" && typeof(me.property[k.name]) == "undefined")
				{
					me.property[k.name] = k.value;
				}
				
				me.getter[k.name] = function() {
					return this.property[k.name];
				}
				
				me.setter[k.name] = function(value) {
					var ovalue = this.property[k.name];
					this.property[k.name] = value;
					this._b1/*_baseUpdateProperty*/(k.name, value);
					this.updateProperty && this.updateProperty(k.name, value);
				}
			}
		});
	},
	
	aa/*applyApplication*/: function (appItem) {
		var me = this;
		me.P3/*applicationItem*/ = appItem;
	},
	
	initDrawing: function() {
		var me = this;
		me.__pcinit();
	}
}
/******************************************************************
	control : grid component
 ******************************************************************/

IG$/*mainapp*/._Imm2/*gridconfig*/ = function() {
	var me = this;
	
	me.sfields = ["fieldname", "name", "flex", "minw", "hidden", "formatstring", "align"];
	me._c/*columns*/ = [];
};

IG$/*mainapp*/._Imm2/*gridconfig*/.prototype = {
	_l1/*loadData*/: function(xdoc) {
		var me = this,
			_c = me._c/*columns*/,
			tnode, tnodes, i, snodes, col, j, p, v;
		
		_c.splice(0, _c.length);
		
		if (xdoc)
		{
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/cs");
			tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null;
			
			if (tnodes)
			{
				for (i=0; i < tnodes.length; i++)
				{
					snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnodes[i]);
					col = {};
					for (j=0; j < snodes.length; j++)
					{
						p = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[j], "na");
						v = IG$/*mainapp*/._I24/*getTextContent*/(snodes[j]);
						
						if (/(flex|minw)/.test(p) && v)
						{
							v = Number(v);
						}
						else if (p == "hidden")
						{
							v = (v == "T");
						}
						
						col[p] = v;
					}
					_c.push(col);
				}
			}
		}
	},
	_l2/*getXML*/: function() {
		var me = this,
			t = ["<prop><cs>"],
			i, _c = me._c/*columns*/,
			sfields = me.sfields,
			v, f;
			
		for (i=0; i < _c.length; i++)
		{
			t.push("<c>");
			for (j=0; j < sfields.length; j++)
			{
				f = sfields[j];
				v = _c[i][f];
				if (f == "hidden")
				{
					v = (v == true) ? "T" : "F";
				}
				t.push("<m na='" + f + "'><![CDATA[" + v + "]]></m>");
			}
			t.push("</c>");
		}
		
		t.push("</cs>");
		t.push("</prop>");
		
		return IG$/*mainapp*/._I13/*loadXML*/(t.join(""));
	}
};
 
IG$/*mainapp*/._Imm/*interactiveGrid*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		me.activeIndex = 0;
		me.p.push(
			{name: "cell_click", type: "event"},
			{name: "text", type: "property", datatype: "string"},
			{name: "selectionmode", type: "property", datatype: "string", value: "none",
				"enum": [
					{name: "none", value: "none"},
					{name: "single", value: "single"},
					{name: "multi", value: "multi"}
				]
			},
			{name: "selheader", type: "property", datatype: "string", value: ""}
		);
		
		me._cinfo = new IG$/*mainapp*/._Imm2/*gridconfig*/();
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	pe/*processEvent*/: function(evttype, obj) {
	},

	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
			
		me.mcontainer.width(w).height(h);
		
		if (me.viewer)
		{
			me.viewer.setSize(w, h);
		}
	},
	
	initDrawing: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html),
			actionlist = me.ctrl.actionlist,
			pdb = me.ctrl.P1/*parentcontrol*/,
			mcontainer = $("<div></div>").appendTo(me.html),
			cbtn;
		
		me.mcontainer = mcontainer;
		
		me._cinfo._l1/*loadData*/(me.layout._xparam);
		
		if (!me.viewer)
		{
			me.viewer = new $s.gridpanel({
				renderTo: mcontainer[0],
				disabled: me.dsmode,
				columns: [
		    	],
		    	listeners: {
		    		cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eopts) {
		    			if (actionlist["cell_click"])
						{
							pdb.M7a/*executeAction*/.call(pdb, actionlist["cell_click"]);
						}
		    		}
		    	}
			});
		}
		
		me._v1/*validateColumns*/();
		
		if (me.dsmode)
		{
			cbtn = $("<div class='igc-p-config'><div class='igc-p-config-bg'></div><button>Config</button></div>").appendTo(me.html);
			$("button", cbtn).bind("click", function() {
				me.c1/*configComponent*/.call(me);
			});
		}
		me.__pcinit();
	},

	c1/*configComponent*/: function() {
		var me = this,
			pop = new IG$/*mainapp*/._Imm1/*interactiveGridConfig*/({
				_cinfo: me._cinfo,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(dlg, sheetview) {
					me.layout._xparam = me._cinfo._l2/*getXML*/();
					me._v1/*validateColumns*/();
				}, me.viewer)
			});
		
		IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
	},
	updateProperty: function(kname, value) {
		var me = this,
			viewer = me.viewer,
			_cinfo = me._cinfo;
		
		if (me.dsmode)
		{
			return;
		}
		
		switch(kname)
		{
		case "report_control":
			break;
		case "text":
			break;
		case "selectionmode":
			if (value && _cinfo.selmodel != value)
			{
				_cinfo.selmodel = value;
				me._v1/*validateColumns*/(true);
			}
			break;
		}
	},
	
	_ds/*applyDataSet*/: function(value) {
		this.viewer.store.loadData(value.v.data);
	},

	updateLayout: function() {
		var me = this,
			dashboard = me.ctrl.dashboard;
	},
	
	_v1/*validateColumns*/: function(recreate) {
		var me = this,
			viewer = me.viewer,
			store, cols = [],
			_cinfo = me._cinfo,
			_c = _cinfo._c/*columns*/,
			ci,
			i, fields = [], c,
			actionlist = me.ctrl.actionlist,
			pdb = me.ctrl.P1/*parentcontrol*/,
			sm, stype;
			
		if (recreate)
		{
			viewer.close();
			
			if (_cinfo.selmodel == "single" || _cinfo.selmodel == "multi")
			{
				stype = "checkboxmodel";
				sm = {
					selection: "checkboxmodel",
					checkSelector: ".x-grid-cell",
					mode: _cinfo.selmodel == "single" ? "SINGLE" : "MULTI"
				};
			}
			
			viewer = me.viewer = new $s.gridpanel({
				renderTo: me.mcontainer[0],
				selType: stype,
				selModel: sm,
				disabled: me.dsmode,
				columns: [
		    	],
		    	listeners: {
		    		cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eopts) {
		    			if (actionlist["cell_click"])
						{
							pdb.M7a/*executeAction*/.call(pdb, actionlist["cell_click"]);
						}
		    		}
		    	}
			})
		}
			
		if (viewer)
		{
			for (i=0; i < _c.length; i++)
			{
				ci = _c[i];
				c = {
					xtype: "gridcolumn",
					text: (ci.name || ci.fieldname || ("field_" + i)),
					dataIndex: ci.fieldname || ("field_" + i),
					minWidth: ci.minw || 50,
					hidden: !me.dsmode && ci.hidden ? true : false,
					align: ci.align || "left"
				};
				if (ci.flex)
				{
					c.flex = ci.flex;
				}
				
				fields.push(c.dataIndex);
				cols.push(c);
			}
			
			store = {
				fields: fields
			};
			
			viewer.reconfigure(store, cols);
		}
	},

	P12/*getSelectionData*/: function(param) {
		var me = this,
			filteritems,
			i, j,
			viewer = me.viewer,
			berr = [],
			fitem,
			bs,
			rval = [],
			value,
			sel, rec;

		if (param && param.name && viewer)
		{
			sel = viewer.getSelectionModel().selected;
			
			if (sel && sel.length)
			{
				rec = sel.items[0];
				value = rec.get(param.name);
				value && rval.push({code: value, value: value});
			}
		}

		return rval;
	},
	
	selRow: function() {
		return this.viewer.getSelectionModel().selected;
	},
	
	selRowCnt: function() {
		var r = this.selRow().length;
		return r;
	},
	
	selColInfo: function(cindex) {
		var r,
			m = this.selRow(),
			rec, dataindex = cindex,
			cols = this.viewer.columnManager.columns;
		
		if (m && m.length)
		{
			rec = m.items[0];
			if (cols && cols.length > cindex)
			{
				dataindex = cols[cindex].dataIndex;
			}
			r = rec.get(dataindex);
		}
		
		return r;
	},
	
	cell: function(r, c) {
		var me = this,
			cell,
			viewer = me.viewer,
			store = viewer.store,
			i, rec,
			cols = this.viewer.columnManager.columns,
			col = cols[c];
			
		rec = store.data.items[r];
		
		if (rec && col)
		{
			cell = rec.get(col.dataIndex);
		}
		
		return cell;
	}
});

IG$/*mainapp*/._IE0/*controls*/.grid = new IG$/*mainapp*/._Imm/*interactiveGrid*/({}, null);

if (window.Ext)
{
	IG$/*mainapp*/._Imm1/*interactiveGridConfig*/ = $s.extend($s.window, {
		
		modal: false,
		isWindow: true,
		region:"center",
		"layout": "fit",
		
		closable: false,
		resizable:false,
		width: 500,
		height: 450,
		
		_ILa/*reportoption*/: null,
		
		callback: null,
		
		_IFe/*initF*/: function() {
			var panel = this,
				grd = panel.grd;
				
			panel._cinfo && grd.store.loadData(panel._cinfo._c/*columns*/);
		},
		
		_t1/*toolbarhandler*/: function(cmd) {
			var me = this,
				grd = me.grd,
				sel,
				i;
				
			switch (cmd)
			{
			case "c_add":
				grd.store.add({
					minw: 100
				});
				break;
			case "c_del":
				sel = grd.getSelectionModel().selected;
				for (i=sel.length-1; i>=0; i--)
				{
					grd.store.remove(sel[i]);
				}
				break;
			}
		},
		
		_m/*moveGrid*/: function(grid, direction) {
			var records = grid.getSelectionModel().getSelection(),
	    		record = records.length ? records[0] : null;
	    		
			if (!record) 
			{
				return;
			}
			
			var oindex = grid.getStore().indexOf(record),
				index = oindex,
				mobj;
			
			if (direction < 0) 
			{
				index--;
				if (index < 0) 
				{
					return;
				}
			} 
			else 
			{
				index++;
				if (index >= grid.getStore().getCount()) 
				{
					return;
				}
			}
			
			grid.getStore().remove(record);
			grid.getStore().insert(index, record);
			grid.getSelectionModel().select(record, true);
		},
		
		_IFf/*confirmDialog*/: function() {
			var me = this,
				_cinfo = me._cinfo,
				cols = me._cinfo._c/*columns*/,
				grd = me.grd,
				sfields = me.sfields,
				i, rec,
				c;
				
			cols.splice(0, cols.length);
			
			for (i=0; i < grd.store.data.length; i++)
			{
				rec = grd.store.data.items[i];
				c = {};
				$.each(sfields, function(m, k) {
					c[k] = rec.get(k);
				});
				cols.push(c);
			}
			
			me.callback && me.callback.execute();
			
			me.close();
		},
		
		initComponent : function() {
			var panel = this,
				sfields = this._cinfo.sfields;
				
			panel.sfields = sfields;
			
			$s.apply(this, {
				title: IRm$/*resources*/.r1("T_GRD_CFG"),
				items: [
					{
						xtype: "panel",
						layout: {
							type: "vbox",
							align: "stretch"
						},
						bodyPadding: 5,
						tbar: [
							{
								text: "Add",
								handler: function() {
									this._t1/*toolbarhandler*/("c_add");
								},
								scope: this
							},
							{
								text: "Delete",
								handler: function() {
									this._t1/*toolbarhandler*/("c_del");
								},
								scope: this
							},
							{
								text: "Move Up",
								handler: function() {
									var me = this;
									me._m/*moveGrid*/(me.grd, -1);
								},
								scope: this
							},
							{
								text: "Move Down",
								handler: function() {
									var me = this;
									me._m/*moveGrid*/(me.grd, 1);
								},
								scope: this
							}
						],
						items: [
							{
								xtype: "gridpanel",
								flex: 1,
								name: "grd",
								selType: "checkboxmodel",
								selModel: {
									checkSelector: ".x-grid-cell",
									mode: "MULTI"
								},
								sortableColumns: false,
								plugins: [
									{
										ptype: "cellediting",
										clicksToEdit: true
									}
		    	    	    	],
								store: {
									fields: sfields
								},
								columns: [
									{
										text: "Field name",
										dataIndex: "fieldname",
										flex: 1,
										editor: {
											allowBlank: false
										}
									},
									{
										text: "Header",
										dataIndex: "name",
										flex: 1,
										editor: {
											allowBlank: false
										}
									},
									{
										text: "Min Width",
										dataIndex: "minw",
										width: 80,
										editor: {
											xtype: "numberfield",
											allowBlank: false
										}
									},
									{
										text: "Width Flex",
										dataIndex: "flex",
										width: 80,
										editor: {
											xtype: "numberfield",
											allowBlank: true
										}
									},
									{
										xtype: "checkcolumn",
										text: "Hidden",
										dataIndex: "hidden",
										width: 80
									},
									{
										text: "Align",
										dataIndex: "align",
										width: 80,
										editor: {
											allowBlank: true
										}
									}
								]
							}
						]
					}
				],
				buttons:[
					"->",
					{
						text: IRm$/*resources*/.r1("B_CONFIRM"),
						handler: function() {
							this._IFf/*confirmDialog*/();
						},
						scope: this
					}, {
						text: IRm$/*resources*/.r1("B_CANCEL"),
						handler:function() {
							this.close();
						},
						scope: this
					}
				],
				listeners: {
					afterrender: function(ui) {
						var panel = this;
						panel.grd = panel.down("[name=grd]");
						panel._IFe/*initF*/();
					}
				}
			});
			
			IG$/*mainapp*/._Imm1/*interactiveGridConfig*/.superclass.initComponent.apply(this, arguments);
		}
	});
}
/******************************************************************
	control : pivot design component
 ******************************************************************/
if (window.Ext)
{
	IG$/*mainapp*/._Iub_/*pivotdesign_base*/ = $s.extend($s.panel, {
		layout: {
			type: "vbox",
			align: "stretch"
		},
		
		initComponent : function() {
			var me = this;
			
			$s.apply(this, {
				items: [
					{
						xtype: "toolbar",
						items: [
							{
								xtype: "button",
								text: "Pivot Design"
							},
							{
								xtype: "button",
								text: "Filters"
							},
							"->",
							{
								xtype: "button",
								text: "Execute"
							}
						]
					},
					{
						xtype: "panel",
						layout: "card",
						flex: 1,
						items: [
						]
					}
				]
			});
			
			IG$/*mainapp*/._Iub_/*pivotdesign_base*/.superclass.initComponent.apply(this, arguments);
		}
	});
}

IG$/*mainapp*/._Iu/*pivotdesign*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		me.activeIndex = 0;
		me.p.push(
			{name: "request_run", type: "event"},
			{name: "text", type: "property", datatype: "string"}
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	pe/*processEvent*/: function(evttype, obj) {
	},

	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
			
		me.mcontainer.width(w).height(h);
		
		if (me.viewer)
		{
			me.viewer.setSize(w, h);
		}
	},
	
	initDrawing: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html),
			actionlist = me.ctrl.actionlist,
			mcontainer = $("<div></div>").appendTo(me.html),
			cbtn;
		
		me.mcontainer = mcontainer;
		
		if (!me.viewer)
		{
			me.viewer = new IG$/*mainapp*/._Iub_/*pivotdesign_base*/({
				renderTo: mcontainer[0]
			});
		}
		
		me.__pcinit();
	},

	updateProperty: function(kname, value) {
		var me = this,
			viewer = me.viewer,
			_cinfo = me._cinfo;
		
		if (me.dsmode)
		{
			return;
		}
		
		switch(kname)
		{
		case "report_control":
			break;
		case "text":
			break;
		case "selectionmode":
			break;
		}
	},
	
	updateLayout: function() {
		var me = this,
			dashboard = me.ctrl.dashboard;
	},
	
	P12/*getSelectionData*/: function(param) {
		var me = this,
			filteritems,
			i, j,
			viewer = me.viewer,
			berr = [],
			fitem,
			bs,
			rval = [],
			value,
			sel, rec;

		if (param && param.name && viewer)
		{
			sel = viewer.getSelectionModel().selected;
			
			if (sel && sel.length)
			{
				rec = sel.items[0];
				value = rec.get(param.name);
				value && rval.push({code: value, value: value});
			}
		}

		return rval;
	}
});

IG$/*mainapp*/._IE0/*controls*/.pivotdesign = new IG$/*mainapp*/._Iu/*pivotdesign*/({}, null);
IG$/*mainapp*/.jj_2/*sheetfilter*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		
		me.p.push(
			{name: "report_control", type: "property", datatype: "string", vmode: 1},
			{name: "filter_id", type: "property", datatype: "string", vmode: 1},
			{name: "itemclick", type: "event"}
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	pe/*processEvent*/: function(evttype, obj) {
	},
	
	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
	},
	
	aa/*applyApplication*/: function (appItem) {
		this.P3/*applicationItem*/ = appItem;
	},
	initDrawing: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html),
			actionlist = me.ctrl.actionlist;
		
		me.viewer = me.dsmode ? null : new IG$/*mainapp*/._Ied/*dynFilterView*/(me.html, null, me);
		
		me.__pcinit();
	},
	updateProperty: function(kname, value) {
		var me = this;
		
		if (me.dsmode)
		{
			return;
		}
		
		switch(kname)
		{
		case "report_control":
			me.__ivp();
			break;
		}
	},
	__ivp: function() {
		var me = this,
			property = me.property,
			report_control = property["report_control"],
			filter_id = property["filter_id"],
			rptctrl,
			i,
			dashboard = me.ctrl.dashboard,
			dctrl;
			
		if (me.dsmode || me.__pcinit_)
		{
			return;
		}
			
		if (report_control && dashboard && dashboard.P2/*ControlDict*/)
		{
			setTimeout(function() {
				var dctrl,
					dobj;
				dctrl = dashboard.P2/*ControlDict*/[report_control];
				if (dctrl && filter_id)
				{
					dobj = dctrl.P9/*control*/;
					dobj.negoFilter && dobj.negoFilter.call(dobj, me, filter_id);
				}
			}, 20);
		}
	}
});

IG$/*mainapp*/._IE0/*controls*/.sheetfilter = new IG$/*mainapp*/.jj_2/*sheetfilter*/({}, null);
if (window.Ext)
{
	IG$/*mainapp*/.jj_m/*pivotfiltereditor*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
		layout: "fit",
		
		_IJa/*activeSheet*/: 0,
		
		_l1/*loadReport*/: function(p) {
			var me = this,
				req;
			
			me.uid = p.uid;
			
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me,
				{
		            ack: "5",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, revision: me.revision}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
		        }, me, function(xdoc) {
		        	me._ILa/*reportoption*/ = new IG$/*mainapp*/._IEe/*clReports*/(xdoc);
		        	
		        	var browser = me.down("[name=browser]"),
		        		feditor = me.down("[name=feditor]"),
		        		p_opeditor = me.down("[name=p_opeditor]");
		        	
		        	if (me._ILa/*reportoption*/.sheets.length > 0)
		        	{
		        		me._ILb/*sheetoption*/ = me._ILa/*reportoption*/.sheets[0];
		        		me.cubeuid = me._ILb/*sheetoption*/.cubeuid || me._ILa/*reportoption*/.cubeuid;
		        		var reportmode = me._ILb/*sheetoption*/.reportmode || me._ILa/*reportoption*/.reportmode;
		        		var values = {};
						values.type = (reportmode == "rolap") ? "Cube" : "Metric";
						values.name = values.type;
						values.nodepath = values.type;
						values.uid = me.cubeuid || null;
							
						values.leaf = false;
				
						browser.setRootNode.call(browser, values);
						
						browser.show();
						
						feditor._ILa/*reportoption*/ = me._ILa/*reportoption*/;
						feditor._ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
						
						feditor.in$t.call(feditor);
						
						feditor.show();
						
						p_opeditor._ILa/*reportoption*/ = me._ILa/*reportoption*/;
						p_opeditor._ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
						p_opeditor.show();
		        	}
		        }, false);
			req._l/*request*/();
		},
		
		sv/*requestSQLResult*/: function(c, cb) {
			var me = this,
				feditor = me.down("[name=feditor]");
			
			me._lsql = [];
			me._ldb = [];
			
			if (me._ILb/*sheetoption*/ != null && me._ILa/*reportoption*/ != null)
			{
				feditor.m1$9/*confirmFilterSetting*/.call(feditor);
				
				var pivotxml = me._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(me._ILa/*reportoption*/),
					req = new IG$/*mainapp*/._I3e/*requestServer*/();
					
		    	req.init(me, 
					{
			            ack: "18",
			            payload: '<smsg><item uid="' + me.uid + '" option="sql" active="' + me._IJa/*activeSheet*/ + '"/></smsg>',
			            mbody: pivotxml
			        }, me, function(xdoc) {
			        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item/ExecuteQuery'),
			        		sql;
			        	if (tnode)
						{
							sql = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
							me._lsql.push(sql);
						}
						
						c && cb && cb.call(c, 1);
			        }, function(xdoc) {
						c && cb && cb.call(c, false);
			        });
				req._l/*request*/();
			}
		},
		
		set_count: function(counts) {
			var me = this,
				feditor = me.down("[name=feditor]");
			
			feditor.set_count.call(feditor, counts);
		},
		
		initComponent: function() {
			var panel = this;
			
			$s.apply(this, {
				items: [
					{
						xtype: "panel",
						layout: "border",
						items: [
							{
								xtype: "panel",
								title: IRm$/*resources*/.r1("L_pf_navitree"),
								layout: "fit",
								split: true,
								region: "west",
								flex: 1,
								border: 0,
								items: [
									new IG$/*mainapp*/._I98/*naviTree*/({
										showtoolbar: false,
										name: "browser",
										hidden: true,
										cubebrowse: true,
										collapsible: false,
										floatable: false,
										floating: false,
										ddGroup: "_I$RD_G_",
										"layout": "fit",
										enabledrag: true,
										_search: true,
										
										_IHb/*customEventOwner*/: panel,
										
										_IHC/*customDoubleClickFunc*/: function(record) {
											var me = this;
												p_opeditor = me.down("[name=p_opeditor]"),
												filter = new IG$/*mainapp*/._IE9/*clFilter*/(null);
											
											filter.operator = 6;
											
											p_opeditor.m4/*filteritem*/ = filter;
											p_opeditor._IFd/*init_f*/.call(p_opeditor);
											p_opeditor.P2C/*itemSelectedHandler*/.call(p_opeditor, record.data);
										}
									})
								]
							},
							{
								xtype: "panel",
								layout: "border",
								region: "center",
								split: true,
								flex: 2,
								items: [
									{
										xtype: "panel",
										title: IRm$/*resources*/.r1("L_pf_fedit"),
										split: true,
										bodyPadding: 5,
										layout: "fit",
										flex: 1,
										region: "north",
										items: [
											new IG$/*mainapp*/._Idba/*filterEditorPanel*/({
												name: "p_opeditor",
												hidden: true,
												autoScroll: false,
												_cmode: 1,
												flex: 1
											})
										]
									},
									{
										xtype: "panel",
										split: true,
										region: "center",
										title: IRm$/*resources*/.r1("L_pf_filter"),
										flex: 1,
										layout: "fit",
										items: [
											new IG$/*mainapp*/._Ida/*filterEditorPanel*/({
									    		name: "feditor",
									    		hidden: true,
									    		deferredRender: false,
									    		bodyPadding: 10
									    	})
										]
									}
								]
							}
						]
					}
				]
			});
			IG$/*mainapp*/.jj_m/*pivotfiltereditor*/.superclass.initComponent.call(this);
		},
		listeners: {
			afterrender: function(tobj) {
				var me = tobj,
					p_opeditor = me.down("[name=p_opeditor]"),
					feditor = me.down("[name=feditor]");
				
				p_opeditor.on("add_filter", function(ed) {
					ed._IFf/*confirmDialog*/.call(ed);
					var dt = ed.m4/*filteritem*/,
						tnode;
						
					tnode = feditor.rootnode_w.children[0];
					
					feditor.rs_mm5/*appendNewCondition*/.call(feditor, [tnode, dt]);
				});
				p_opeditor._IFd/*init_f*/.call(p_opeditor);
			}
		}
	});
}

IG$/*mainapp*/.jj_M/*pivotfilter*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		
		me.p.push(
			{name: "report_control", type: "property", datatype: "string", vmode: 1},
			{name: "filter_id", type: "property", datatype: "string", vmode: 1},
			{name: "itemclick", type: "event"}
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	pe/*processEvent*/: function(evttype, obj) {
	},
	
	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
			
		if (me.viewer)
		{
			me.r2/*renderto*/.width(w).height(h);
			me.viewer.setSize(w, h);
		}
	},
	
	valid: function() {
		var r = 0;
		
		return r;
	},
	
	confirmFilter: function(mode, c, cb) {
		var me = this,
			r,
			ctrl = me.ctrl,
			dashboard = ctrl.dashboard;
		
		me.viewer.sv/*requestSQLResult*/.call(me.viewer, me, function(r) {
			var cr;
			
			if (r != false)
			{
				try
				{
					cr = cb.call(c, r);
				}
				catch (e)
				{
					cr = false;
					IG$/*mainapp*/._I52/*ShowError*/("filter processing script error");
				}
			}
		
			if (r != false && cr != false)
			{
				dashboard.M8/*contEventProc*/.call(dashboard, dashboard);
			}
			else
			{
				dashboard.M8_/*stopEventProc*/.call(dashboard, dashboard);
			}
		});
	},
	
	aa/*applyApplication*/: function (appItem) {
		this.P3/*applicationItem*/ = appItem;
	},
	initDrawing: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html),
			renderto = $("<div></div>").appendTo(me.html),
			actionlist = me.ctrl.actionlist;
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(renderto, w);
    	IG$/*mainapp*/.x_10/*jqueryExtension*/._h(renderto, h);
    	
		me.viewer = me.dsmode ? null : new IG$/*mainapp*/.jj_m/*pivotfiltereditor*/({
			width: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(renderto),
			height: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(renderto),
			renderTo: renderto[0]
		});
		
		me.r2/*renderto*/ = renderto;
		
		me.__pcinit();
	},
	updateProperty: function(kname, value) {
		var me = this;
		
		if (me.dsmode)
		{
			return;
		}
		
		switch(kname)
		{
		case "report_control":
			me.__ivp();
			break;
		}
	},
	__ivp: function() {
		var me = this,
			property = me.property,
			report_control = property["report_control"],
			filter_id = property["filter_id"],
			rptctrl,
			i,
			dashboard = me.ctrl.dashboard,
			dctrl;
			
		if (me.dsmode || me.__pcinit_)
		{
			return;
		}
			
		if (report_control && dashboard && dashboard.P2/*ControlDict*/)
		{
			setTimeout(function() {
				var dctrl,
					dobj;
				dctrl = dashboard.P2/*ControlDict*/[report_control];
				if (dctrl && filter_id)
				{
					dobj = dctrl.P9/*control*/;
					dobj.negoFilter && dobj.negoFilter.call(dobj, me, filter_id);
				}
			}, 20);
		}
	},
	
	set_base_report: function(rpt, cobj, cback) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel,
			{
	            ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: rpt}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'translate'})
	        }, panel, function(xdoc) {
	        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
	        		p = (tnode) ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode) : null;
	        		
	        	if (p && p.uid)
	        	{
	        		panel.viewer._l1/*loadReport*/.call(panel.viewer, p);
	        	}
	        }, false);
		req._l/*request*/();
	},

	get_sql: function(delimiter) {
		var me = this;
		return me.viewer._lsql.join(delimiter || ";");
	},
	
	get_db: function(delimiter) {
		var me = this;
		return me.viewer._ldb.join(delimiter || ";");
	},
	
	set_count: function(counts) {
		this.viewer.set_count.call(this.viewer, counts);
	}
});

IG$/*mainapp*/._IE0/*controls*/.pivotfilter = new IG$/*mainapp*/.jj_M/*pivotfilter*/({}, null);




IG$/*mainapp*/._ID3/*ctrlNullControl*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this,
			ctrl = me.ctrl,
			thelp = $("<div>" + "unknown control: " + ctrl.P6/*ctrlname*/ + "</div>");
			
		me.html.append(thelp);
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	initDrawing: function () {
		var me = this;
		
		me.html.css({border: '1px solid #a5a5a5'});
		me.__pcinit();
	}
});


IG$/*mainapp*/._ID4/*ctrlTitleLabel*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		
		me.p.push(
			{name: "text", type: "property", datatype: "string"},
			{name: "fontsize", type: "property", datatype: "number"},
			{name: "fontbold", type: "property", datatype: "boolean"},
			{name: "color", type: "property", datatype: "string"}
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	updateProperty: function(kname, value) {
		var me = this;
		
		switch (kname)
		{
		case "text":
			me.html.text(value);
			break;
		case "fontsize":
			me.html.css({fontSize: value + "px"});
			break;
		case "fontbold":
			me.html.css({fontWeight: (value == true ? "bold" : "normal")});
			break;
		case "color":
			me.html.css({color: (value ? value : "#000")});
			break;
		}
	},
	
	initDrawing: function() {
		var me = this;
		
		me.superclass.prototype.initDrawing.call(me);
		
		me.html.addClass("ig_title_label");
	}
});

IG$/*mainapp*/._IE0/*controls*/.titlelabel = new IG$/*mainapp*/._ID4/*ctrlTitleLabel*/({}, null);

IG$/*mainapp*/._ID5/*ctrlLabel*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		
		me.p.push(
			{name: "text", type: "property", datatype: "string"},
			{name: "fontsize", type: "property", datatype: "number", value: 12},
			{name: "fontbold", type: "property", datatype: "boolean"},
			{name: "color", type: "property", datatype: "string"}
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	updateProperty: function(kname, value) {
		var me = this;
		
		switch (kname)
		{
		case "text":
			me.html.text(value);
			break;
		case "fontsize":
			me.html.css({fontSize: value + "px"});
			break;
		case "fontbold":
			me.html.css({fontWeight: (value == true ? "bold" : "normal")});
			break;
		case "color":
			me.html.css({color: (value ? value : "#000")});
			break;
		}
	}
});

IG$/*mainapp*/._IE0/*controls*/.label = new IG$/*mainapp*/._ID5/*ctrlLabel*/({}, null);

IG$/*mainapp*/._ID6/*ctrlPicture*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		
		me.image = null;
		
		me.p.push(
			{name: "imagepath", type:"property", datatype: "string", "enum": "resources"}
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},

	initDrawing: function() {
		var me = this;
		me.image = $('<img/>');
		me.image.appendTo(me.html);
		
		me.superclass.prototype.initDrawing.call(me);
	},
	
	updateProperty: function(kname, value) {
		var me = this;
		
		switch (kname)
		{
		case "imagepath":
			if (value)
			{
				me.image.show();
				me.image.attr("src", ig$/*appoption*/.servlet + "?sreq=resource&_rcs_=" + value + "&_mts_=" + IG$/*mainapp*/._g$a/*global_mts*/);
			}
			else
			{
				me.image.hide();
			}
			break;
		}
	},
	
	invalidate: function() {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
		
		me.image && me.image.css({width: w + "px", height: h + "px"});
	}
});

IG$/*mainapp*/._IE0/*controls*/.image = new IG$/*mainapp*/._ID6/*ctrlPicture*/({}, null);

IG$/*mainapp*/._ID7/*ctrlTextInput*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this,
			dsmode = me.dsmode,
			div, dnode,
			htmltext;
		
		me.p.push(
			{name: "text", type: "property", datatype: "string"},
			{name: "fieldlabel", type: "property", datatype: "string"},
			{name: "labelwidth", type: "property", datatype: "number", value: 80},
			{name: "enterkey", type: "event"}
		)
		
		div = $("<table class='igc-form-field'><tr><td id='_1'></td><td id='_2'></td></tr></table>").appendTo(me.html);
		
		dnode = $("#_2", div);
		
		if (!dsmode)
		{
			me.htmlinput = $("<input type='text' autocomplete='off' style='width:100%;height:100%'></input>").appendTo(dnode);
		}
		else
		{
			me.htmlinput = dnode;
		}
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},

	updateProperty: function(kname, value) {
		var me = this,
			lbl = $("#_1", me.html),
			dom;
		
		switch (kname)
		{
		case "text":
			me.htmlinput.val(value);
			break;
		case "labelwidth":
			dom = $("#_1", me.html);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dom, value);
			break;
		case "fieldlabel":
			if (!value)
			{
				lbl.hide();
			}
			else
			{
				lbl.show();
				lbl.text(value);
			}
			break;
		}
	},
	
	initDrawing: function () {
		var me = this,
			actionlist = me.ctrl.actionlist,
			pdb = me.ctrl.P1/*parentcontrol*/;
			
		me.htmlinput.bind('keyup', function(ev) {
			if (ev.keyCode == 13 && actionlist["enterkey"])
			{
				pdb.M7a/*executeAction*/.call(pdb, actionlist["enterkey"]);
			}
		});
		
		me.superclass.prototype.initDrawing.call(me);
	},
	
	_c1/*commit*/: function() {
		var me = this;
		me.property.text = me.htmlinput.val();
	},
	
	invalidate: function () {
		var me = this;
		// me.htmlinput.width(me.html.width()).height(me.html.height());
	},
	
	P12/*getSelectionData*/: function(itemname) {
		var me = this,
			value = me.htmlinput.val() || "";
		return [{code: value, value: value}];
	}
});

IG$/*mainapp*/._IE0/*controls*/.textbox = new IG$/*mainapp*/._ID7/*ctrlTextInput*/({}, null);

IG$/*mainapp*/._ID8/*ctrlTextArea*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this,
			dsmode = me.dsmode;
			
		me.p.push(
			{name: "htmltext", type: "property", datatype: "string"},
			{name: "text", type: "property", datatype: "string"}
		);
	
		if (dsmode)
		{
			htmltext = "<div></div>";
		}
		else
		{
			htmltext = "<textarea></textarea>";
		}
		me.htmlinput = $(htmltext);
		me.htmlinput.appendTo(me.html);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	updateProperty: function(kname, value) {
		var me = this;
		
		switch (kname)
		{
		case "htmltext":
		case "text":
			me.htmlinput.val(value);
			break;
		}
	},
		
	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
		if (me.htmlinput)
		{
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.htmlinput, w);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.htmlinput, h);
		}
	},
	
	_c1/*commit*/: function() {
		var me = this;
		me.property.text = me.htmlinput.val();
	}
});

IG$/*mainapp*/._IE0/*controls*/.textarea = new IG$/*mainapp*/._ID8/*ctrlTextArea*/({}, null);

IG$/*mainapp*/._ID9/*ctrlButton*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this,
			btnitem,
			lbl,
			dsmode = me.dsmode;
		
		me.p.push(
			{name: "label", type: "property", datatype: "string"},
			{name: "click", type: "event"}
		);
		
		if (dsmode)
		{
			btnitem = "<div class='igc-btn igc-unselectable'>" + (me.property.label || "") + "</div>";

			me.htmlbtn = $(btnitem);
			me.htmlbtn.appendTo(me.html);
		}
		else
		{
			// btnitem = "<button class='igc-btn igc-unselectable'>" + (me.property.label || "") + "</button>";
			btnitem = "<button class='igc-btn'>" + (me.property.label || "") + "</button>";
			
			me.htmlbtn = $(btnitem);
			me.htmlbtn.appendTo(me.html);
			
			me.htmlbtn.button({
				icons: {
					// primary: "ui-icon-gear",
	        		secondary: "ui-icon-triangle-1-s"
				}
			});
			
			me.htmlbtn.hover(function() {
				me.htmlbtn.addClass("igc-btn-over");
			}, function() {
				me.htmlbtn.removeClass("igc-btn-over");
			});
			
			me.htmlbtn.bind("click", function() {
				me.htmlbtn.removeClass("igc-btn-over");
			});
		}
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	updateProperty: function(kname, value) {
		var me = this,
			lbl = me.htmlbtn;
		
		switch (kname)
		{
		case "label":
			lbl.html(value);
			break;
		}
	},
	
	initDrawing: function () {
		var me = this,
			dsmode = me.dsmode,
			actionlist = me.ctrl.actionlist,
			pdb = me.ctrl.P1/*parentcontrol*/;
		
		me.__pcinit();
		
		if (dsmode)
			return;
		
		me.html.bind('click', function() {
			if (actionlist["click"])
			{
				pdb.M7a/*executeAction*/.call(pdb, actionlist["click"]);
			}
		});
	},
	
	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
			
		me.htmlbtn.css({width: (w + "px"), height: (h + "px")});
	}
});

IG$/*mainapp*/._IE0/*controls*/.button = new IG$/*mainapp*/._ID9/*ctrlButton*/({}, null);

IG$/*mainapp*/._IDa/*ctrlComboBox*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		me.p.push(
			{name: "fieldlabel", type: "property", datatype: "string"},
			{name: "labelwidth", type: "property", datatype: "number", value: 80},
			{name: "label_names", type: "property", datatype: "string"},
			{name: "value_names", type: "property", datatype: "string"},
			{name: "name_delimiter", type: "property", datatype: "string", value: ";"},
			{name: "text", type: "property", datatype: "string"},
			{name: "change", type: "event"}
		);
		
		me.combobox = null;
		me.items = [];
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	initDrawing: function () {
		var me = this,
			dsmode = me.dsmode,
			div,
			dnode;
		
		div = $("<table class='igc-form-field'><tr><td id='_1' class='igc-form-label'></td><td id='_2'><div class='igc-form-ctrl'></div></td></tr></table>").appendTo(me.html);
		
		dnode = $(".igc-form-ctrl", div);
		
		if (dsmode)
		{
			me.combobox = $("<div></div>").appendTo(dnode);
		}
		else
		{
			me.combobox = $("<select></select>").appendTo(dnode);
			me.combobox.bind("change", function() {
				var v = $(this).val(),
					i, store = me.items,
					rec;
				
				if (v && store)
				{
					for (i=0; i < store.length; i++)
					{
						if (store[i].code == v)
						{
							rec = store[i];
							break;
						}
					}
				}
				
				if (rec)
				{
					var pdb = me.ctrl.P1/*parentcontrol*/,
						actionlist = me.ctrl.actionlist;
						
					me.property.text = v;
					pdb.M7a/*executeAction*/.call(pdb, actionlist["change"]);
				}
			});
		}
		
		me.superclass.prototype.initDrawing.call(me);
	},
	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html),
			p = me.property,
			labelwidth = p.labelwidth || 0,
			fieldlabel = p.fieldlabel || "";
			
		if (me.dsmode)
		{
			// me.combobox.width(w).height(h);
		}
		else
		{
			// me.combobox.setSize(w, h);
			if (fieldlabel && labelwidth)
			{
				w -= labelwidth;
			}
			me.combobox.width(w).height(h);
		}
	},
	
	_c1/*commit*/: function() {
		var me = this;
	},
	
	_ds/*applyDataSet*/: function(value) {
		var me = this,
			cols = value.v.cols,
			data = value.v.data,
			i, dp = [],
			p,
			combobox = me.combobox;
		
		combobox.empty();
		
		for (i=0; i < data.length; i++)
		{
			p = {
				code: data[i][cols[0].name],
				text: data[i][cols[cols.length > 1 ? 1 : 0].name]
			};
			
			dp.push(p);
			
			combobox.append("<option value='" + p.code + "'>" + p.text + "</option>");
		}
		
		me.items = dp;
		// me.combobox.store.loadData(dp);
	},
	
	updateProperty: function(kname, value) {
		var me = this,
			lbl = $("#_1", me.html),
			jdom;
		
		switch (kname)
		{
		case "text":
			me.sel(value);
			break;
		case "labelwidth":
			jdom = $("#_1", me.html);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom, value);
			break;
		case "fieldlabel":
			if (!value)
			{
				lbl.hide();
			}
			else
			{
				lbl.show();
				lbl.text(value);
			}
			break;
		case "label_names":
		case "value_names":
		case "name_delimiter":
			clearTimeout(me._vtimer);
			me._vtimer = setTimeout(function() {
				me._setData.call(me);
			}, 20);
			break;
		}
	},
	
	P12/*getSelectionData*/: function(itemname) {
		var me = this;
		
		if (me.dsmode) 
			return null;
		
		var strv = me.combobox.getValue(),
			value = [],
			i;
		
		for (i=0; i < me.combobox.store.data.items.length; i++)
		{
			if (me.combobox.store.data.items[i].get("code") == strv)
			{
				value.push({
					code: me.combobox.store.data.items[i].get("code"),
					text: me.combobox.store.data.items[i].get("text")
				});
				break;
			}
		}
		
		return value;
	},
	
	_setData: function() {
		var me = this,
			result = {
				data: []
			},
			i, delim, values, labels,
			property = me.property, m,
			rdata = result.data;
			
		labels = property.label_names || "";
		values = property.value_names || "";
		delim = property.name_delimiter || ";";
		
		labels = labels.split(delim);
		values = values.split(delim);
		
		m = Math.max(labels.length, values.length);
		
		for (i=0; i < m ; i++)
		{
			rdata.push({
				code: values[i] || labels[i],
				text: labels[i] || values[i]
			});
		}
			
		me.loadData(result);
	},
		
	loadData: function(result) {
		var me = this,
			i,
			dp = [],
			p;
		
		for (i=0; i < result.data.length; i++)
		{
			p = result.data[i];
			dp.push({
				code: p.code,
				text: p.text || p.code
			});
		}
		me.items = dp;
		me.combobox.store && me.combobox.store.loadData(dp);
	},
	sel: function(r) {
		var me = this,
			m, combobox = me.combobox,
			st = combobox.store,
			i;
		if (me.dsmode)
			return;
			
		if (typeof(r) == "undefined")
		{
			m = combobox.getValue();
		}
		else
		{
			if (st.data.items[r])
			{
				combobox.setValue(st.data.items[r].get("code"));
			}
			else
			{
				for (i=0; i < st.data.items.length; i++)
				{
					if (st.data.items[i].get("code") == r)
					{
						combobox.setValue(r);
						break;
					}
				}
			}
		}
		
		return m;
	}
});

IG$/*mainapp*/._IE0/*controls*/.combobox = new IG$/*mainapp*/._IDa/*ctrlComboBox*/({}, null);

IG$/*mainapp*/.$iDa/*ctrlCheckbox*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		me.p.push(
			{name: "fieldlabel", type: "property", datatype: "string"},
			{name: "labelwidth", type: "property", datatype: "number", value: 80},
			{name: "label_names", type: "property", datatype: "string"},
			{name: "value_names", type: "property", datatype: "string"},
			{name: "name_delimiter", type: "property", datatype: "string", value: ";"},
			{name: "change", type: "event"}
		);
		
		me.viewer = null;
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	initDrawing: function () {
		var me = this,
			dsmode = me.dsmode,
			div,
			dnode;
		
		div = $("<table class='igc-form-field'><tr><td id='_1' class='igc-form-label'></td><td id='_2'><div class='igc-form-ctrl'></div></td></tr></table>").appendTo(me.html);
		
		dnode = $(".igc-form-ctrl", div);
		
		me.viewer = $("<div></div>").appendTo(dnode);
		
		me.superclass.prototype.initDrawing.call(me);
	},
	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html),
			p = me.property,
			labelwidth = p.labelwidth || 0,
			fieldlabel = p.fieldlabel || "";
			
		if (me.dsmode)
		{
			// me.combobox.width(w).height(h);
		}
		else
		{
			// me.combobox.setSize(w, h);
			if (fieldlabel && labelwidth)
			{
				w -= labelwidth;
			}
			me.viewer.width(w).height(h);
		}
	},
	
	_c1/*commit*/: function() {
		var me = this;
	},
	
	updateProperty: function(kname, value) {
		var me = this,
			lbl = $("#_1", me.html),
			jdom;
		
		switch (kname)
		{
		case "text":
			
			break;
		case "labelwidth":
			jdom = $("#_1", me.html);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom, value);
			break;
		case "fieldlabel":
			if (!value)
			{
				lbl.hide();
			}
			else
			{
				lbl.show();
				lbl.text(value);
			}
			break;
		case "label_names":
		case "value_names":
		case "name_delimiter":
			clearTimeout(me._vtimer);
			me._vtimer = setTimeout(function() {
				me._setData.call(me);
			}, 20);
			break;
		}
	},
	
	P12/*getSelectionData*/: function(itemname) {
		var me = this;
		
		if (me.dsmode) 
			return null;
		
//		var strv = me.combobox.getValue(),
//			value = [],
//			i;
		
//		for (i=0; i < me.combobox.store.data.items.length; i++)
//		{
//			if (me.combobox.store.data.items[i].get("code") == strv)
//			{
//				value.push({
//					code: me.combobox.store.data.items[i].get("code"),
//					text: me.combobox.store.data.items[i].get("text")
//				});
//				break;
//			}
//		}
		
		return value;
	},
	
	_ds/*applyDataSet*/: function(value) {
		var data = value.data,
			i, result = {
				data: []
			}, dp = result.data;
		
		me.loadData(result);
	},
		
	_setData: function() {
		var me = this,
			result = {
				data: []
			},
			i, delim, values, labels,
			property = me.property, m,
			rdata = result.data;
			
		labels = property.label_names || "";
		values = property.value_names || "";
		delim = property.name_delimiter || ";";
		
		labels = labels.split(delim);
		values = values.split(delim);
		
		m = Math.max(labels.length, values.length);
		
		for (i=0; i < m ; i++)
		{
			rdata.push({
				code: values[i] || labels[i],
				text: labels[i] || values[i]
			});
		}
			
		me.loadData(result);
	},
	
	loadData: function(result) {
		var me = this,
			i,
			dp = [],
			p;
			
		me.viewer.empty();
		
		$.each(result.data, function(i, p) {
			if (p.code || p.tet)
			{
				var m = me.viewer.append("<label><input type='checkbox' value='" + (p.code) + "'>" + p.text + "</label>");
			}
		});
	}
});

IG$/*mainapp*/._IE0/*controls*/.checkbox = new IG$/*mainapp*/.$iDa/*ctrlCheckbox*/({}, null);

IG$/*mainapp*/._IDb/*ctrlDateField*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		
		me.p.push(
			{name: "text", type: "property", datatype: "string"}
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	initDrawing: function () {
		var me = this,
			cdate = new Date();
		
		me.superclass.prototype.initDrawing.call(me);
		
		me.datefield = $("<input class='mec-dateperiod-input' type='text' placeholder='yyyy-mm-dd'></input>").datepicker({
			monthNames: $.datepicker._defaults.monthNamesShort,
			buttonImage: "./images/calendar.gif",
			buttonImageOnly: true,
			dateFormat: "yy-mm-dd",
			defaultDate: 0,
			onSelect: function(dateText, inst) {
//				me.l5a/*updateHierarchy*/.call(me, filter);
//				if (showbutton != true)
//				{
//					me.l5/*updateFilterValues*/.call(me);
//				}
			}
		}).appendTo(me.html);
		
		// me.datefield.setValue(cdate);
		me.datefield.datepicker("setDate", cdate);
		
		$("<div class='mec-dateperiod-button'></div>").appendTo(me.html).bind("click", function() {
			me.datefield.datepicker("show");
		});
		
		me.property["text"] = me.getValue();
	},
	
	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
			
		me.datefield.width(w-34).height(h-5);
	},
	
	_c1/*commit*/: function() {
		var me = this;
		me.property["text"] = me.getValue();
	},
	
	getValue: function(param) {
		var dt = this.datefield.datepicker("getDate"),
			strdt;
			
		if (dt)
		{
			strdt = dt.format('Ymd');
			param && param.push({code: strdt, value: strdt});
		}
		return strdt;
	}
});

IG$/*mainapp*/._IE0/*controls*/.datechooser = new IG$/*mainapp*/._IDb/*ctrlDateField*/({}, null);

IG$/*mainapp*/.jj_3/*ctrlMonthField*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	initDrawing: function () {
		var me = this,
			cdate = new Date();
		
		me.superclass.prototype.initDrawing.call(me);
		
		this.datefield = $("<input class='mec-dateperiod-input' type='text'></input>").monthpicker({
			buttonImage: "./images/calendar.gif",
			buttonImageOnly: true,
			pattern: "yyyy-mm",
			onSelect: function(dateText, inst) {
				
			}
		}).appendTo(me.html);
	},
	
	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
			
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.datefield, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.datefield, h);
	},
	
	getValue: function(param) {
		var dt = this.datefield.getValue();
		if (dt)
		{
			var strdt = dt.format('Ymd');
			param.push({code: strdt, value: strdt});
		}
	}
});

IG$/*mainapp*/._IE0/*controls*/.monthchooser = new IG$/*mainapp*/.jj_3/*ctrlMonthField*/({}, null);

IG$/*mainapp*/._IDc/*ctrlPanel*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		
		me.titleheight = 0;
		
		me.p.push(
			{name: "layout", type: "property", datatype: "string", value: "absolute",
				"enum": [
					{name: "absolute", value: "absolute"},
					{name: "vertical", value: "vbox"},
					{name: "horizontal", value: "hbox"},
					{name: "table", value: "table"}
				]
			},
			{name: "region", type: "property", datatype: "string"},
			{name: "title", type: "property", datatype: "string"},
			{name: "collapsible", type: "property", datatype: "boolean"}
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	updateProperty: function(kname, value) {
		var me = this;
		
		switch (kname)
		{
		case "title":
			this.paneltitle.text(value);
		
			if (value != null && typeof(value) != "undefined" && value != "")
			{
				this.paneltitle.show();
				this.titleheight = 25;
			}
			else
			{
				this.paneltitle.hide();
				this.titleheight = 0;
			}
			break;
		case "layout":
			break;
		}
		
		this.updateLayout();
	},
	
	initDrawing: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
		
		me.paneltitle = $("<div class='idv-dbr-title'></div>");
		me.html.append(me.paneltitle);
		
		me.superclass.prototype.initDrawing.call(me);
	},
	
	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
			
		// me.paneltitle.width(w);
		
		me.updateLayout();
	},
	
	updateLayout: function() {
		var me = this,
			dashboard = me.ctrl.dashboard;
		
		clearTimeout(me._l1/*timer*/);
		
		me._l1/*timer*/ = setTimeout(function() {
			if (dashboard)
			{
				dashboard.cL/*changeLayout*/.call(dashboard, me.ctrl);
			}
		}, 50);
	}
});

IG$/*mainapp*/._IE0/*controls*/.panel = new IG$/*mainapp*/._IDc/*ctrlPanel*/({}, null);

IG$/*mainapp*/._IDd/*ctrlOLAPReport*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		
		me.canvas = null;
		me.viewer = null;
		me.options = null;
		me.loading = null;
		me.zoom = false;
		me.sheetindex = 0;
		
		me.hidetoolbar = false;
		me.hidestatusbar = false;
		
		me.p.push(
			{name: "draw", type: "property", datatype: "string"},
			{name: "hidetoolbar", type: "property", datatype: "boolean", vmode: 1},
			{name: "hidestatusbar", type: "property", datatype: "boolean", vmode: 1},
			{name: "execute_completed", type: "event"}
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	onClickMagHandler: function (e) {
		var sender = e.data.sender;
		sender.pe/*processEvent*/("magnifire", sender);
	},
	
	initDrawing: function () {
		var me = this,
			renderto = $("<div></div>").appendTo(me.html),
    		rendermask = $("<div></div>").appendTo(me.html),
    		w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
    		h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
		
    	IG$/*mainapp*/.x_10/*jqueryExtension*/._w(renderto, w);
    	IG$/*mainapp*/.x_10/*jqueryExtension*/._h(renderto, h);
		rendermask.css({position: "absolute", top: 0, left: 0, bottom: 0, right: 0, width: "100%", height: "100%", overflow: "hidden"}).hide();
		
		if (!me.ctrl.dsmode)
		{
			if (!this.viewer)
			{
				this.viewer = new IG$/*mainapp*/._IBe/*ReportView*/({
					width: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(renderto),
					height: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(renderto),
					renderTo: renderto[0],
					rendermask: rendermask,
					uid: me.uid,
					region: "center",
					collapsible: false,
					minSize: 100,
					floatable: false,
					vmode: 1,
					title: 0,
					closeAction: "destroy",
					header: false
				});
				
				this.viewer.on("afterrender", function(tobj) {
					me.updateProperty.call(me, "hidetoolbar");
					me.updateProperty.call(me, "hidestatusbar");
				}, this);
			}
		}
		
		me.__pcinit();
	},
	
	clear: function() {
		var me = this,
			viewer = me.viewer;
			
		viewer && viewer.cL/*clearResult*/.call(viewer);
	},
	
	updateProperty: function(kname) {
		var me = this,
			viewer = me.viewer,
			v = this.property[kname];
		
		if (!viewer)
			return;
			
		switch (kname)
		{
		case "hidetoolbar":
			viewer.hiddentoolbar = v;
			viewer && viewer._2/*toolbar*/ && viewer._2/*toolbar*/.setVisible(v ? false : true);
			break;
		case "hidestatusbar":
			viewer.hiddenstatusbar = v;
			viewer && viewer.down("[name=_1]").setVisible(v ? false : true);
			break;
		}
	},
	
	invalidate: function () {
		var w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(this.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(this.html);
		
		this.viewer && this.viewer.setSize(w, h);
	},
	
	P12/*getSelectionData*/: function(itemname) {
		return null;
	},
	
	eRun: function(cback, filterxml) {
		var me = this,
			viewer = me.viewer,
			sfilter, hfilter, fdoc,
			filter,
			fnode, fnodes, i,
			params = [],
			pname, pvalue,
			pdb = me.ctrl.P1/*parentcontrol*/;
		
		viewer.execallback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(xdoc, iserror) {
			var me = this;
			if (iserror != true)
			{
				if (me.ctrl.actionlist)
				{
					pdb.M7a/*executeAction*/.call(pdb, me.ctrl.actionlist["execute_completed"]);
				}
			}
		})// cback;
		
		if (filterxml)
		{
			fdoc = IG$/*mainapp*/._I13/*loadXML*/(filterxml);
			
			fnode = IG$/*mainapp*/._I18/*XGetNode*/(fdoc, "/smsg/filters/Filter");
			
			if (fnode)
			{
				sfilter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
				me.p2/*parseFilter*/(fnode, sfilter);
			}
			
			fnode = IG$/*mainapp*/._I18/*XGetNode*/(fdoc, "/smsg/filters/HavingFilter");
			
			if (fnode)
			{
				hfilter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
				me.p2/*parseFilter*/(fnode, hfilter);
			}
			
			fnode = IG$/*mainapp*/._I18/*XGetNode*/(fdoc, "/smsg/params");
			
			if (fnode)
			{
				fnodes = IG$/*mainapp*/._I26/*getChildNodes*/(fnode);
				
				for (i=0; i < fnodes.length; i++)
				{
					pname = IG$/*mainapp*/._I1b/*XGetAttr*/(fnodes[i], "name");
					pvalue = IG$/*mainapp*/._I24/*getTextContent*/(fnodes[i]);
					
					params.push({
						name: pname,
						value: pvalue
					})
				}
			}
			
			if (sfilter && hfilter)
			{
				filter = {
					filter: sfilter,
					hfilter: hfilter,
					params: params
				};
			}
		}
		
		if (viewer.uid != me.uid)
		{
			viewer.uid = me.uid;
			viewer.__ld/*loaded*/ = false;
			viewer._IFd/*init_f*/.call(viewer, true);
		}
		
		viewer.__d_c/*dashboard_callback*/ = null;
		
		if (viewer.__ld/*loaded*/)
		{
			viewer._t$/*toolbarHandler*/.call(viewer, "cmd_run", null, null, filter);
		}
		else
		{
			viewer.__d_c/*dashboard_callback*/ = new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
				viewer._t$/*toolbarHandler*/.call(viewer, "cmd_run", null, null, filter);
			});
		}
	},
	
	p2/*parseFilter*/: function(node, filter) {
		var me = this;
		
		if (node)
		{
			var fglist = IG$/*mainapp*/._I26/*getChildNodes*/(node, "FilterGroup"),
				i;

			if (fglist && fglist.length > 0)
			{
				for (i=0; i < fglist.length; i++)
				{
					var tgroup = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
					tgroup.name = IG$/*mainapp*/._I1b/*XGetAttr*/(fglist[i], "name"); 
					filter.subGroups.push(tgroup);
					me.parseSubFilter(fglist[i], tgroup);
				}
			}
		}
	},
	parseSubFilter: function(fgnode, ugroup) {
		var i, j,
			group,
			sfg,
			me = this;
		
		sfg = IG$/*mainapp*/._I26/*getChildNodes*/(fgnode);
		
		if (sfg && sfg.length > 0)
		{
			for (j=0; j < sfg.length; j++)
			{
				if (IG$/*mainapp*/._I29/*XGetNodeName*/(sfg[j]) == "FilterGroup")
				{
					var group = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
					group.name = IG$/*mainapp*/._I1b/*XGetAttr*/(sfg[j], "name"); 
					me.parseSubFilter(sfg[j], group);
					ugroup.subGroups.push(group);
				}
				else
				{
					ugroup.subConditions.push(new IG$/*mainapp*/._IE9/*clFilter*/(sfg[j]));
				}
			}
		}
	},
	
	aa/*applyApplication*/: function (appItem) {
		var me = this;
		me.P3/*applicationItem*/ = appItem;
		
		if (me.P3/*applicationItem*/ != null)
		{
			me.uid = me.P3/*applicationItem*/.uid;
			
			if (!me.dsmode && me.viewer)
			{
				me.viewer.uid = me.uid;
				me.viewer._IFd/*init_f*/.call(me.viewer, true);
			}
		}
	},
		
	negoFilter: function(filterctrl, docid) {
		var me = this;
		
		if (me.viewer)
		{
			var fctrl = filterctrl.viewer,
				ubody;
				
			ubody = me.viewer.dzone ? me.viewer.dzone._IIb/*getBox*/.call(me.viewer.dzone, docid) : null;
			
			if (ubody)
			{
				filterctrl.html.empty();
				filterctrl.viewer = ubody.viewer;
				ubody.view.c/*contentarea*/.appendTo(filterctrl.html);
				ubody.view.sp/*splash*/.appendTo(filterctrl.html);
				ubody.hidden = true;
			}
			else
			{
				me.viewer.regbody.call(me.viewer, docid, fctrl);
			}
		}
	},
	destroy: function() {
		var me = this;
		
		if (me.viewer && me.viewer.close)
		{
			me.viewer.close();
		}
	}
});

IG$/*mainapp*/._IE0/*controls*/.olapreport = new IG$/*mainapp*/._IDd/*ctrlOLAPReport*/({}, null);
IG$/*mainapp*/._IE0/*controls*/.compositereport = new IG$/*mainapp*/._IDd/*ctrlOLAPReport*/({}, null);

IG$/*mainapp*/.jj_1/*browserpanel*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		
		this.p.push(
			{name: "rootpath", type: "property", datatype: "string"},
			{name: "visibleitems", type: "property", datatype: "string"},
			{name: "folder_templates", type: "property", datatype: "string"},
			{name: "templates", type: "property", datatype: "string"},
			{name: "collapsible", type: "property", datatype: "boolean"},
			{name: "foldercollapse", type: "property", datatype: "boolean"},
			{name: "name_exclude", type: "property", datatype: "string"},
			{name: "batchload", type: "property", datatype: "boolean"},
			{name: "itemclick", type: "event"}
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	pe/*processEvent*/: function(evttype, obj) {
	},
	invalidate: function () {
		var w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(this.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(this.html);
	},
	aa/*applyApplication*/: function (appItem) {
		this.P3/*applicationItem*/ = appItem;
	},
	
	initDrawing: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(this.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(this.html),
			actionlist = me.ctrl.actionlist;
		
		// if (me.ctrl.P8/*events*/ && me.ctrl.P8/*events*/['click'])
		var pdb = me.ctrl.P1/*parentcontrol*/;
		
		if (!me.dsmode)
		{
			me.html.bind('menu_click', function(e, item) {
				// pdb.M7/*processRunEvents*/.call(pdb, eventowner.ctrl.P8/*events*/['click']);
				if (actionlist["itemclick"])
				{
					pdb.M7a/*executeAction*/.call(pdb, actionlist["itemclick"], me, item);
				}
			});
		}
		
		this.__pcinit();
	},
	updateProperty: function(k, value) {
		var me = this;
		
		switch(k)
		{
		case "rootpath":
			me.setRootPath();
			break;
		}
	},
	setRootPath: function() {
		var me = this,
			nodepath = me.property["rootpath"],
			req,
			opt = {},
			mopt = {},
			ack = "5";
		
		me.html.empty();
		
		if (nodepath)
		{
			opt.uid = nodepath;
			
			if (me.property["batchload"] == true)
			{
				ack = "11";
				mopt.typelist = "Dashboard;Report";
				mopt.pid = nodepath;
				mopt.option = "search";
			}
			
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
					ack: ack,
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/(opt, "uid"),
					mbody: IG$/*mainapp*/._I2e/*getItemOption*/(mopt)
				}, me, function(xdoc) {
					var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, ack == "11" ? "/smsg/result" : "/smsg/item"),
						p,
						tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
						i,
						ul;
					
					if (tnode)
					{
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
						
						if (p.type == "Folder" || p.type == "Workspace" || ack == "11")
						{
							ul = $("<ul></ul>").appendTo(me.html);
							this.addNodes(tnodes, ul);
						}
					}
				}, false);
			req._l/*request*/();
		}
	},
	
	addNodes: function(tnodes, ul) {
		var me = this,
			items = [],
			i, j,
			p, exnames = me.property["name_exclude"],
			f_template = me.property["folder_templates"],
			template = me.property["templates"],
			exc = 0;
			
		exnames = exnames ? exnames.split(";") : null;
		
		for (i=0; i < tnodes.length; i++)
		{
			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			p.tnode = tnodes[i];
			exc = 0;
			if (exnames)
			{
				for (j=0; j < exnames.length; j++)
				{
					if (p.name.indexOf(exnames[j]) > -1)
					{
						exc = true;
						break;
					}
				}
			}
			!exc && items.push(p);
		}
		
		IG$/*mainapp*/._I10/*sortMeta*/(items);
		
		$.each(items, function(i, item) {
			var li = $("<li></li>").appendTo(ul),
				div = $("<div></div>").appendTo(li),
				sul,
				snodes,
				tmpl = template;
			
			if (item.type == "Folder" || item.type == "Workspace")
			{
				tmpl = f_template;
			}
			
			if (tmpl)
			{
				tmpl = tmpl.replace("{name}", item.name);
				tmpl = tmpl.replace("{description}", item.description);
				tmpl = tmpl.replace("{seq}", "" + i);
			}
			else
			{
				tmpl = "<span>" + item.name + "</span>";
			}
			
			$(tmpl).appendTo(div);
			
			div.bind("click", function() {
				me.html.trigger("menu_click", item);
			});
			
			if (item.type == "Folder" || item.type == "Workspace")
			{
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(item.tnode);
				
				if (snodes && snodes.length > 0)
				{
					sul = $("<ul></ul>").appendTo(li);
					me.addNodes.call(me, snodes, sul);
				}
			}
		});
	}
});

IG$/*mainapp*/._IE0/*controls*/.browser = new IG$/*mainapp*/.jj_1/*browserpanel*/({}, null);

IG$/*mainapp*/.jj_3/*tabpanel*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		me.activeIndex = 0;
		me.p.push(
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	pe/*processEvent*/: function(evttype, obj) {
	},

	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
	},
	
	initDrawing: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html),
			actionlist = me.ctrl.actionlist,
			renderto = $("<div></div>").appendTo(me.html),
			tabbuttons = $("<ul class='igc-p-tap'></ul>").appendTo(renderto),
			mainarea = $("<div></div>").appendTo(renderto);
		
		me.tabbuttons = tabbuttons;
		me.mainarea = mainarea;
		
		me.__pcinit();
	},
	updateProperty: function(kname, value) {
		var me = this;
		
		if (me.dsmode)
		{
			return;
		}
		
		switch(kname)
		{
		case "report_control":
			break;
		}
	},

	updateLayout: function() {
		var me = this,
			dashboard = me.ctrl.dashboard;
		
		clearTimeout(me._l1/*timer*/);
		
		me._l1/*timer*/ = setTimeout(function() {
			if (dashboard)
			{
				dashboard.cL/*changeLayout*/.call(dashboard, me.ctrl);
			}
		}, 50);
	},

	loadHeader: function(items) {
		var me = this,
			tabbuttons = me.tabbuttons,
			i;

		me.tabitems = items;
		tabbuttons.empty();

		$.each(items, function(i, item) {
			var li = $("<li><span>" + (item.title || "Tab " + (i+1)) + "</li>").appendTo(tabbuttons);

			if (me.activeIndex == i)
			{
				li.addClass("active");
			}

			item.__tab_btn = li;

			li.bind("click", function() {
				me.setActiveItem.call(me, i);
			})
		});
	},
	
	getTabHeight: function() {
		return this.tabbuttons ? this.tabbuttons.height() : 0;
	},

	setActiveItem: function(index) {
		var me = this,
			i;

		if (me.tabitems && me.tabitems.length > index && index > -1)
		{
			me.activeIndex = index;
		}

		if (me.activeIndex > -1 && me.tabitems)
		{
			for (i=0; i < me.tabitems.length; i++)
			{
				if (index == i)
				{
					me.tabitems[i].__tab_btn.addClass("active");
				}
				else
				{
					me.tabitems[i].__tab_btn.removeClass("active");
				}

				me.tabitems[i].P9/*controls*/.html[index == i ? "show" : "hide"]();
			}
		}
		// me.updateLayout();
	}
});

IG$/*mainapp*/._IE0/*controls*/.tabpanel = new IG$/*mainapp*/.jj_3/*tabpanel*/({}, null);

IG$/*mainapp*/.jj_4/*promptfilter*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;
		me.activeIndex = 0;
		me.p.push(
			{name: "request_run", type: "event"}
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	pe/*processEvent*/: function(evttype, obj) {
	},

	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);
	},
	
	initDrawing: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html),
			actionlist = me.ctrl.actionlist,
			mcontainer = $("<div></div>").appendTo(me.html),
			cbtn;

		if (!me.viewer)
		{
			me.sop = new IG$/*mainapp*/._IFc/*sheetfiltercomp*/(me.layout._xparam);
			me.sop.objtype = "FILTER";
			me.viewer = new IG$/*mainapp*/._Ied/*dynFilterView*/(mcontainer, me.sop, null, true);
			me.viewer.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
				me.html.trigger("e_request_run");
			});
		}
		
		if (me.dsmode)
		{
			cbtn = $("<div class='igc-p-config'><div class='igc-p-config-bg'></div><button>Config</button></div>").appendTo(me.html);
			$("button", cbtn).bind("click", function() {
				me.configSheet.call(me);
			});
		}
		me.__pcinit();
	},

	configSheet: function() {
		var me = this,
			pop = new IG$/*mainapp*/._If1/*sheetobj*/({
				_ILb/*sheetoption*/: me.viewer._ILb/*sheetoption*/, 
				_ILa/*reportoption*/: null,
				_md/*creatMode*/: 1,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(dlg, sheetview) {
					var tvalue = me.sop.l2/*getXML*/.call(me.sop);

					me.layout._xparam = IG$/*mainapp*/._I13/*loadXML*/(tvalue);
					me.viewer.l3/*validateItems*/.call(me.viewer);
				}, me.viewer)
			});
		
		IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
	},
	updateProperty: function(kname, value) {
		var me = this;
		
		if (me.dsmode)
		{
			return;
		}
		
		switch(kname)
		{
		case "report_control":
			break;
		}
	},

	updateLayout: function() {
		var me = this,
			dashboard = me.ctrl.dashboard;
	},

	P12/*getSelectionData*/: function(param) {
		var me = this,
			filteritems,
			i, j,
			viewer = me.viewer,
			berr = [],
			fitem,
			bs,
			rval = [];

		if (param && param.name && viewer)
		{
			filteritems = viewer._ILb/*sheetoption*/.pff1/*filterItems*/;

			if (filteritems && filteritems.length)
			{
				for (i=0; i < filteritems.length; i++)
				{
					if (filteritems[i].name == param.name)
					{
						fitem = filteritems[i];
						break;
					}
				}

				if (fitem)
				{
					bs = viewer.l5m_/*checkFilterValuesItem*/.call(viewer, fitem, berr, true);

					if (bs)
					{
						for (j=0; j < fitem.value.length; j++)
						{
							rval.push(fitem.value[j]);
						}
					}
				}
			}
		}

		return rval;
	}
});

IG$/*mainapp*/._IE0/*controls*/.promptfilter = new IG$/*mainapp*/.jj_4/*promptfilter*/({}, null);

IG$/*mainapp*/.jj_5/*dashboard*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/._ID2/*ctrlBase*/, {
	_ic/*initComponent*/: function() {
		var me = this;

		me._v/*viewerRendererd*/ = false;
		me.p.push(
		);
		
		me.superclass.prototype._ic/*initComponent*/.call(me);
	},
	
	pe/*processEvent*/: function(evttype, obj) {
	},

	invalidate: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html);

		if (me.viewer)
		{
			me.viewer.setSize(w, h);
		}
	},

	initDrawing: function () {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.html),
			renderto = $("<div class='igc-db-embed'></div>").appendTo(me.html),
    		rendermask = $("<div></div>").appendTo(me.html);
		
    	IG$/*mainapp*/.x_10/*jqueryExtension*/._w(renderto, w);
    	IG$/*mainapp*/.x_10/*jqueryExtension*/._h(renderto, h);
		rendermask.css({position: "absolute", top: 0, left: 0, bottom: 0, right: 0, width: "100%", height: "100%", overflow: "hidden"}).hide();

		if (me.dsmode)
		{
			cbtn = $("<div class='igc-p-config'><div class='igc-p-config-bg'></div><button>Config</button></div>").appendTo(me.html);
			$("button", cbtn).bind("click", function() {
			});
		}
		else
		{
			if (!me.viewer)
			{
				me.viewer = new IG$/*mainapp*/._IBf/*DashboardView*/({
					uid: null,
					width: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(renderto),
					height: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(renderto),
					renderTo: renderto[0],
					rendermask: rendermask,
					floatable: false,
					closeAction: "destroy",
					title: 0,
					uid: me.uid,
					collapsible: false,
					header: false,
					dsmode: 1,
					border: 0,
					sm: 0
				});

				me.viewer.on("afterrender", function(tobj) {
					me._v/*viewerRendererd*/ = true;
				});
			}
		}
		me.__pcinit();
	},

	updateProperty: function(kname, value) {
		var me = this;
		
		if (me.dsmode)
		{
			return;
		}
		
		switch(kname)
		{
		case "report_control":
			break;
		}
	},

	updateLayout: function() {
		var me = this,
			dashboard = me.ctrl.dashboard;
	},
	destroy: function() {
		var me = this;
		
		if (me.viewer && me.viewer.close)
		{
			me.viewer.close();
		}
	}
});

IG$/*mainapp*/._IE0/*controls*/.dashboard = new IG$/*mainapp*/.jj_5/*dashboard*/({}, null);


//IG$/*mainapp*/._IE0/*controls*/ = {
//	titlelabel: ,
//    olapreport: ,
//    compositereport: ,
//    label: ,
//    textarea: ,
//    image: ,
//    button: ,
//    textbox: ,
//    datechooser: ,
//    monthchooser: ,
//    combobox: ,
//    panel: ,
//    tabpanel: ,
//    dashboard: ,
//	grid: ,
//	pivotdesign: ,
//	browser: ,
//	sheetfilter: ,
//	promptfilter: ,
//	
//};
/*
 * Sheet Filtering Component
 */
IG$/*mainapp*/._IFc/*sheetfiltercomp*/ = function(node) {
	var me = this;
	
	me.docid = null;
	me.objtype = null;
	me.layoutinfo = {};
	
	me.pff1/*filterItems*/ = [];
	me.pff1a/*filteroptions*/ = {
		showbutton: false,
		viewtype: "row",
		brow: 0,
		columnsize: 1,
		rowsize: 1,
		buttonname: null,
		f_b_desc: null,
		f_b_scr: null,
		showrefresh: true,
		edrill: true
	};
	me.sf/*taboption*/ = {};

	me.fparam = "uid;name;nodepath;type;title;objtype;operator;sheetindex;sheetname;showperiodselector;objmerge;crowindex;compcss;isnecessary;useprompt;showallvalue;aname;hfilter;showpopup;rangevalue;rangelabel;tabid;valueformat;"
				+ "checkbuttonhor;invokejs;useprevcont;showcondition;defaultvalue;dateseltype;yearfrom;yearto;startdate;enddate;cmap_disp;cmap_uid;f_b_clear;f_t_dir;s1a;s1b;s1c;smode;ltitle;lname;f_b_evt;f_b_trg;f_b_trg_all";
	
	if (node)
	{
		me.l1/*parseContent*/(node);
	}
};

IG$/*mainapp*/._IFc/*sheetfiltercomp*/.prototype = {
	m1/*getDefaultValue*/: function(item) {
		var me = this,
			r = item.defaultvalue;
		
		if (r && r.indexOf("cyear") > -1)
		{
			r = me.m2/*getYearField*/(r);
		}
		
		return r;
	},
	
	m2/*getYearField*/: function(dformat) {
		var r = null;
		
		if (IG$/*mainapp*/._I37/*isNumber*/(dformat))
		{
			r = Number(dformat);
		}
		else
		{
			var c = new Date(),
				cyear = c.getFullYear(),
				sval = 0;
			
			if (dformat.indexOf("-") > -1)
			{
				sval = dformat.substring(dformat.indexOf("-") + 1);
				sval = Number(sval);
				sval = sval * -1;
			}
			else if (dformat.indexOf("+") > -1)
			{
				sval = dformat.substring(dformat.indexOf("+") + 1);
				sval = Number(sval);
			}
			
			r = cyear + sval;
		}
		
		return r;
	},
	
	l1/*parseContent*/: function(node) {
		var me = this,
			i, j, tnode,
			snodes, dateinfo,
			filter, dview, fnode, pnode,
			periodoption;
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, "docid;objtype;playout;tb_prt_i;tb_prt_s", "s");
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, "close;fw;fh;istabview;hidetitle;tb_prt", "b");
		
		me.name = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "name");
		
		fnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "name");
		
		if (fnode)
		{
			me.name = IG$/*mainapp*/._I24/*getTextContent*/(fnode);
		}
		
		me.objtype = me.objtype || "PANEL";
		
		switch (me.objtype)
		{
		case "FILTER":
			
			fnode = IG$/*mainapp*/._I19/*getSubNode*/(node, "filteroption");
			me.pff1a/*filteroptions*/ = {
				showbutton: false,
				viewtype: "row",
				columnsize: 1,
				buttonname: null,
				f_b_desc: null,
				f_b_scr: null,
				showrefresh: false,
				brow: 0,
				rowsize: 1,
				f_b_clear: "F",
				f_t_dir: "left",
				edrill: true,
				f_b_evt: "F",
				f_b_trg: "F",
				f_b_trg_all: "F"
			};
			if (fnode)
			{
				IG$/*mainapp*/._I1f/*XGetInfo*/(me.pff1a/*filteroptions*/, fnode, "columnsize;rowsize;brow;viewtype;buttonname;showbutton;showrefresh;f_b_desc;f_b_scr;drilltarget;f_b_clear;f_t_dir;edrill;f_b_evt;f_b_trg;f_b_trg_all;f_rotate;f_rotate_timer;f_rotate_field", "s");
				me.pff1a/*filteroptions*/.showbutton = me.pff1a/*filteroptions*/.showbutton == "T" ? true : false;
				me.pff1a/*filteroptions*/.showrefresh = me.pff1a/*filteroptions*/.showrefresh == "F" ? false : true;
				me.pff1a/*filteroptions*/.columnsize = (me.pff1a/*filteroptions*/.columnsize) ? parseInt(me.pff1a/*filteroptions*/.columnsize) : 1;
				me.pff1a/*filteroptions*/.brow = (me.pff1a/*filteroptions*/.brow) ? parseInt(me.pff1a/*filteroptions*/.brow) : 1;
				me.pff1a/*filteroptions*/.rowsize = (me.pff1a/*filteroptions*/.rowsize) ? parseInt(me.pff1a/*filteroptions*/.rowsize) : 1;
				me.pff1a/*filteroptions*/.edrill = me.pff1a/*filteroptions*/.edrill == "F" ? false : me.pff1a/*filteroptions*/.edrill;
				me.pff1a/*filteroptions*/.f_rotate_timer = parseInt(me.pff1a/*filteroptions*/.f_rotate_timer || 60);
			}
			fnode = IG$/*mainapp*/._I19/*getSubNode*/(node, "filters");
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(fnode || node, "filter");
			for (i=0; i < snodes.length; i++)
			{
				filter = {};
				IG$/*mainapp*/._I1f/*XGetInfo*/(filter, snodes[i], me.fparam, "s");
 
				pnode = IG$/*mainapp*/._I19/*getSubNode*/(fnode, "pvalues");
				if (pnode)
				{
					filter.pvalues = IG$/*mainapp*/._I24/*getTextContent*/(pnode);
				}
				filter.objmerge = filter.objmerge ? parseInt(filter.objmerge) : 0;
				filter.isnecessary = filter.isnecessary == "T";
				filter.useprompt = filter.useprompt == "T";
				filter.showallvalue = filter.showallvalue == "T";
				filter.showpopup = filter.showpopup == "T";
				filter.rangevalue = filter.rangevalue == "T";
				filter.uid = IG$/*mainapp*/._I06/*formatUID*/(filter.uid);
				filter.crowindex = filter.crowindex ? parseInt(filter.crowindex) : 0;
				filter._p1/*main*/ = me;
				tnode = IG$/*mainapp*/._I19/*getSubNode*/(snodes[i], "periodoption");
				if (tnode)
				{
					tnode = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
					filter.periodlist = [];
					for (j=0; j < tnode.length; j++)
					{
						dateinfo = {};
						IG$/*mainapp*/._I1f/*XGetInfo*/(dateinfo, tnode[j], "name;value;default", "s");
						dateinfo["default"] = (dateinfo["default"] == "T");
						filter.periodlist.push(dateinfo);
					}
				}
				me.pff1/*filterItems*/.push(filter);
			}
			break;
		case "NAVI":
			break;
		case "TEXT":
			snodes = IG$/*mainapp*/._I18/*XGetNode*/(node, "content");
			me.content = (snodes) ? IG$/*mainapp*/._I24/*getTextContent*/(snodes) : "";
			snodes = IG$/*mainapp*/._I18/*XGetNode*/(node, "htmlcontent");
			me.htmlcontent = (snodes) ? IG$/*mainapp*/._I24/*getTextContent*/(snodes) : "";
			break;
		case "PANEL":
			break;
		case "SHEET":
			break;
		case "RPT_VIEW":
			me.rptoption = {};
			fnode = IG$/*mainapp*/._I19/*getSubNode*/(node, "rptoption");
			if (fnode)
			{
				me.rptoption = IG$/*mainapp*/._I1c/*XGetAttrProp*/(fnode);
			}
			break;
		case "TAB":
			me.sf/*taboption*/ = {};
			fnode = IG$/*mainapp*/._I19/*getSubNode*/(node, "taboption");
			if (fnode)
			{
				me.sf/*taboption*/.showtab = IG$/*mainapp*/._I1b/*XGetAttr*/(fnode, "showtab");
			}
			break;
		}
	},
	
	l2/*getXML*/: function() {
		var me = this,
			i, j, filterItems = me.pff1/*filterItems*/,
			filteroptions = me.pff1a/*filteroptions*/,
			detailview = me.dff1/*drillItems*/,
			r = "<control";
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "docid;objtype;playout;tb_prt_i;tb_prt_s", "s") +
		     IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "close;fw;fh;istabview;hidetitle;tb_prt", "b") + ">";
		
		r += "<name><![CDATA[" + (me.name || "") + "]]></name>";
		
		switch (me.objtype)
		{
		case "FILTER":
			r += "<filteroption" + IG$/*mainapp*/._I20/*XUpdateInfo*/(filteroptions, "showbutton;showrefresh", "b") + " f_b_clear='" + (filteroptions.f_b_clear || "F") + "' f_t_dir='" + (filteroptions.f_t_dir || "left") + "' edrill='" + (filteroptions.edrill ? "T" : "F") + "' f_b_evt='" + (filteroptions.f_b_evt || "F") + "' f_b_trg='" + (filteroptions.f_b_trg || "F") + "' f_b_trg_all='" + (filteroptions.f_b_trg_all || "F") + "' f_rotate='" + (filteroptions.f_rotate || "F") + "' f_rotate_field='" + (filteroptions.f_rotate_field || "") + "'"
			  + IG$/*mainapp*/._I20/*XUpdateInfo*/(filteroptions, "columnsize;rowsize;brow;viewtype;buttonname;f_b_desc;f_b_scr;drilltarget;f_rotate_timer", "i") + "></filteroption>";
			  
			r += "<filters>";
			for (i=0; i < filterItems.length; i++)
			{
				r += "<filter" + IG$/*mainapp*/._I20/*XUpdateInfo*/(filterItems[i], me.fparam, "s") + ">";
				r += "<pvalues><![CDATA[";
				if (filterItems[i].pvalues)
				{
					r += filterItems[i].pvalues;
				}
				r += "]]></pvalues>";
				if (filterItems[i].periodlist)
				{
					r += "<periodoption>";
					for (j=0; j < filterItems[i].periodlist.length; j++)
					{
						r += "<period " + IG$/*mainapp*/._I20/*XUpdateInfo*/(filterItems[i].periodlist[j], "name;value", "s")
						  + IG$/*mainapp*/._I20/*XUpdateInfo*/(filterItems[i].periodlist[j], "default", "b") + "/>";
					}
					r += "</periodoption>";
				}
				r += "</filter>";
			}
			r += "</filters>";
			break;
		case "NAVI":
			break;
		case "TEXT":
			r += "<content><![CDATA[" + (me.content || "") + "]]></content>";
			r += "<htmlcontent><![CDATA[" + (me.htmlcontent || "") + "]]></htmlcontent>";
			break;
		case "PANEL":
			break;
		case "SHEET":
			break;
		case "TAB":
			r += "<taboption showtab='" + (me.sf/*taboption*/ ? me.sf/*taboption*/.showtab || "T" : "F") + "'></taboption>";
			break;
		case "RPT_VIEW":
			r += "<rptoption " + (me.rptoption ? IG$/*mainapp*/._I20/*XUpdateInfo*/(me.rptoption, "uid;name;contentfullpath;type", "s") : "") + "/>";
			break;
		}
		
		r += "</control>";
		
		return r;
	}
};

/*
 * Report Text Control
 */
IG$/*mainapp*/._IA2/*rfText*/ = function (container, sop) {
	var me = this;
	
	me.container = container;
	me._ILb/*sheetoption*/ = sop;
	
	me.v1/*updateValues*/ = true;
	
	me._IFd/*init_f*/();
};

IG$/*mainapp*/._IA2/*rfText*/.prototype = {
	_IFd/*init_f*/: function() {
		var me = this,
			carea = $("<div class='idv-pnl-html-cnt'></div>").appendTo(me.container);
		me.c1 = carea;
		me.c/*contentarea*/ = $("<div class='idv-pnl-html'></div>").appendTo(carea);
		me.m4/*setText*/();
	},
	
	rX/*removeObj*/: function() {
	},
	
	l3/*validateItems*/: function() {
		this.m4/*setText*/();
	},
	
	setSize: function(w, h) {
		var me = this,
			c1 = me.c1;
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(c1, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(c1, h);
	},
	
	m4/*setText*/: function() {
		var me = this,
			tvalue,
			finfo = me.finfo,
			tvalues = [],
			mvalues = [],
			mvalue,
			t,
			start = 0,
			end = 0,
			mpos,
			mvalue,
			mat, rvalue,
			i, j, b,
			so = me._ILb/*sheetoption*/;
		
		tvalue = Base64.decode(so.htmlcontent || so.content || "");
		mpos = tvalue.indexOf("{", start);
		
		while (mpos > -1 && end < tvalue.length)
		{
			end = tvalue.indexOf("}", mpos);
			if (end > -1)
			{
				tvalues.push({t: tvalue.substring(start, mpos), m: 0});
				tvalues.push({t: tvalue.substring(mpos+1, end), m: 1});
			}
			else
			{
				end = start;
				tvalues.push({t: tvalue.substring(start, end), m: 0});
			}
			start = end+1;
			mpos = tvalue.indexOf("{", start);
		}
		
		tvalues.push({t: tvalue.substring(start, tvalue.length), m: 0});
		
		for (i=0; i < tvalues.length; i++)
		{
			t = tvalues[i];
			if (t.m == 1)
			{
				mat = t.t.match(/\[(.*?)\]/g);
				if (mat && mat.length > 0)
				{
					b = finfo ? true : false;
					
					if (finfo)
					{
						for (j=0; j < mat.length; j++)
						{
							rvalue = mat[j].replace(/[\[\]]/g, "");
							if (finfo[rvalue])
							{
								t.t = t.t.replace(new RegExp("\\[" + rvalue + "\\]", "g"), finfo[rvalue].data.join(", ") || "");
							}
							else
							{
								b = false;
								break;
							}
						}
					}
					
					if (b == true)
					{
						mvalues.push(t.t);
					} 
				}
				else
				{
					mvalues.push("{" + t.t + "}");
				}
			}
			else
			{
				mvalues.push(t.t);
			}
		}
		mvalue = mvalues.join("");
		me.c/*contentarea*/.html(mvalue);
	},
	
	_ILd/*updateFilterContent*/: function(finfo) {
		var me = this;
		me.finfo = finfo;
		me.m4/*setText*/();
	}
};

/*
 * Report Navi Control
 */
IG$/*mainapp*/._IA3/*rfNavi*/ = function (container, sop, rop, report) {
	var me = this;
	
	me.container = container;
	me._ILb/*sheetoption*/ = sop;
	me._ILa/*reportoption*/ = rop;
	me.rpt = report;
	
	me.v1/*updateValues*/ = true;
	
	me._IFd/*init_f*/();
};

IG$/*mainapp*/._IA3/*rfNavi*/.prototype = {
	_IFd/*init_f*/: function() {
		var me = this,
			values = {},
			rop = me._ILa/*reportoption*/,
			browser;
		
		me.c/*contentarea*/ = $("<div></div>").appendTo(me.container);
		
		this.browser = browser = new IG$/*mainapp*/._I98/*naviTree*/({
			renderTo: me.c/*contentarea*/[0],
			showtoolbar: false,
			cubebrowse: true,
			showcheckselect: false,
			collapsible: false,
			floatable: false,
			floating: false,
			flex: 5,
			"layout": "fit",
			enabledrag: true,
			_IHb/*customEventOwner*/: me,
			checkStateChanged: me._IO7/*checkStateChangedHandler*/
			// region: "center",
			//margins: "0 0 0 0",
			//cmargins: "0 0 0 0"
		});
		
		values.type = (me._ILa/*reportoption*/.reportmode == "rolap") ? "Cube" : "Metric";
		values.name = values.type;
		values.nodepath = values.type;
		values.uid = me._ILa/*reportoption*/.cubeuid || null;
			
		values.leaf = false;
		
		browser.store.setRootNode(values);
	},
	
	rX/*removeObj*/: function() {
		var me = this;
		me.browser = null;
	},
	
	l3/*validateItems*/: function() {
		
	},
	
	setSize: function(w, h) {
		var me = this,
			c = me.c/*contentarea*/;
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(c, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(c, h);
		me.browser.setWidth(w);
		me.browser.setHeight(h);
	},
	
	_ILd/*updateFilterContent*/: function(finfo) {
	}
};

/*
 * Blank Panel Control
 */
IG$/*mainapp*/._IA4/*rfBlankPanel*/ = function (container, sop) {
	var me = this;
	
	me.container = container;
	me._ILb/*sheetoption*/ = sop;
	
	me.v1/*updateValues*/ = true;
	
	me._IFd/*init_f*/();
};

IG$/*mainapp*/._IA4/*rfBlankPanel*/.prototype = {
	_IFd/*init_f*/: function() {
		var me = this,
			values = {},
			browser;
		
		me.c/*contentarea*/ = $("<div></div>").appendTo(me.container);

		if (me.owner && me.owner.b1/*box*/)
		{
			me.owner.b1/*box*/.bind("updatecomplete", function() {
				me.l3/*validateItems*/.call(me);
			});
		}
	},
	
	rX/*removeObj*/: function() {
	},
	
	l3/*validateItems*/: function() {
		var me = this,
			owner = me.owner,
			dobj = (owner && owner.docitems && me._ILb/*sheetoption*/ ? owner.docitems[me._ILb/*sheetoption*/.docid] : null),
			n=0,
			bf = false,
			i;
			
		if (dobj && dobj.children)
		{
			$.each(dobj.children, function(i, item) {
				if (item.docid)
				{
					var di = owner.bodylist[item.docid];
					n++;
				}
			});
		}
	},
	
	setSize: function(w, h) {
		var me = this,
			c = me.c/*contentarea*/;
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(c, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(c, h);
	},
	
	_ILd/*updateFilterContent*/: function(finfo) {
	}
};

/*
 * Blank TabPanel Control
 */
IG$/*mainapp*/._IA5/*rfTabPanel*/ = function (container, sop, owner) {
	var me = this;
	
	me.container = container;
	me._ILb/*sheetoption*/ = sop;
	me.owner = owner;
	
	if (me.owner && me.owner.b1/*box*/)
	{
		me.owner.b1/*box*/.bind("updatecomplete", function() {
			me.l3/*validateItems*/.call(me);
		});
	}
	
	me.v1/*updateValues*/ = true;
	me.active = null;
	me._IFd/*init_f*/();
};

IG$/*mainapp*/._IA5/*rfTabPanel*/.prototype = {
	_IFd/*init_f*/: function() {
		var me = this,
			values = {},
			browser, i,
			owner = me.owner,
			ctrls = me.owner ? me.owner.ctrls : null,
			ctrl, n=0;
		
		me.buttons = [];
		me.c/*contentarea*/ = $("<div></div>").appendTo(me.container);
		me.tab/*tabarea*/ = $("<div class='idv-dtab-area'></div>").appendTo(me.c/*contentarea*/).hide();
		me.tabul = $("<ul></ul>").appendTo(me.tab/*tabarea*/);
		
		me.l3/*validateItems*/();
	},
	
	rX/*removeObj*/: function() {
	},
	
	l3/*validateItems*/: function() {
		var me = this,
			owner = me.owner,
			dobj = (owner && owner.docitems && me._ILb/*sheetoption*/ ? owner.docitems[me._ILb/*sheetoption*/.docid] : null),
			n=0,
			bf = false,
			i,
			pactive,
			tv = me._ILb/*sheetoption*/ && me._ILb/*sheetoption*/.sf/*taboption*/ ? me._ILb/*sheetoption*/.sf/*taboption*/.showtab == "T" : false;
		
		me.tab/*tabarea*/[tv || me.editmode ? "show" : "hide"]();
		me.tabul.empty();
		
		me.buttons = [];
		
		if (dobj && dobj.children && dobj.children.length > 0)
		{
			pactive = dobj.active;
			
			if (dobj.active)
			{
				for (i=0; i < dobj.children.length; i++)
				{
					if (dobj.children[i].docid == dobj.active)
					{
						bf = true;
						break;
					}
				}
				
				dobj.active = (bf == false) ? null : dobj.active;
			}
			
			$.each(dobj.children, function(i, item) {
				if (item.docid)
				{
					var di = owner.bodylist[item.docid],
						btn = $("<li><span class='ig-tab-tt'>" + (di.title || "Tab " + i) + "</span></li>").appendTo(me.tabul);
					if ((dobj.active && dobj.active == item.docid) || (!dobj.active && n == 0))
					{
						btn.addClass("selected");
						dobj.active = item.docid;
					}
					
					btn.docid = item.docid;
					
					btn.bind("click", function() {
						me.s1/*setActiveDoc*/.call(me, item.docid);
					});
					
					me.buttons.push(btn);
					
					n++;
				}
			});
			
			if (pactive != dobj.active && dobj.active)
			{
				me.s1/*setActiveDoc*/(dobj.active, true);
			}
		}
	},
	
	s1/*setActiveDoc*/: function(docid, bsuspend_run) {
		var me = this,
			buttons = me.buttons,
			owner = me.owner,
			dobj = (owner && owner.docitems && me._ILb/*sheetoption*/ ? owner.docitems[me._ILb/*sheetoption*/.docid] : null),
			btn,
			pdocid = me._ILb/*sheetoption*/.docid,
			mview,
			i,
			mc;
		
		for (i=0; i < buttons.length; i++)
		{
			btn = buttons[i];
			if (btn.docid == docid)
			{
				btn.addClass("selected");
			}
			else
			{
				btn.removeClass("selected");
			}
		}
		
		if (dobj)
		{
			dobj.active = docid;
			
			for (i=0; i < dobj.children.length; i++)
			{
				mc = owner.docitems[dobj.children[i].docid];
				
				me.setVisible(mc, mc.docid == docid, bsuspend_run);
			}
		}
	},
	
	setVisible: function(ditem, visible, bsuspend_run) {
		var me = this,
			i,
			mc = ditem.lt.ubody;
		
		if (!mc)
		{
			return;
		}
		
		if (ditem._SP && ditem._SP.length)
		{
			for (i=0; i < ditem._SP.length; i++)
			{
				ditem._SP[i].setV(visible);
			}
		}
		
		if (visible)
		{
			mc.visible = true;
			mc.show();
			
			if (mc.view && mc.objtype == "RPT_VIEW" && !mc.view._v1d/*validated*/)
			{
				mc.view.l3/*validateItems*/.call(mc.view);
			}
			
			mc.objtype == "RPT_VIEW" && mc.view && mc.view._l3/*executeItem*/.call(mc.view);
			
			mc.b2/*boxtitle*/.trigger("click");
			mc.l2/*resizeH*/.call(mc);
			
			if (mc.view && mc.view.btabrun == true)
			{
				if (bsuspend_run || !mc.view._ILb/*sheetoption*/) // || (mc.view._ILb/*sheetoption*/)) //  &&  !mc.view._ILb/*sheetoption*/.openload))
				{
				}
				else
				{
					mc.view._vf/*f_run*/ = false;
					delete mc.view.btabrun;
					mc.view._IJ2/*procRunReport*/.call(mc.view, null);
				}
			}
		}
		else
		{
			mc.visible = false;
			mc.hide();
		}
		
		if (ditem.children)
		{
			for (i=0; i < ditem.children.length; i++)
			{
				me.setVisible(ditem.children[i], visible, bsuspend_run);
			}
		}
	},
	
	setSize: function(w, h) {
		var me = this,
			c = me.c/*contentarea*/;
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(c, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(c, h);
	},
	
	_ILd/*updateFilterContent*/: function(finfo) {
	}
};

IG$/*mainapp*/._IA5r/*rfReportViewer*/ = function (container, sop, owner) {
	var me = this;
	
	me.container = container;
	me._ILb/*sheetoption*/ = sop;
	me.owner = owner;
	
//	if (me.owner && me.owner.b1/*box*/)
//	{
//		me.owner.b1/*box*/.bind("updatecomplete", function() {
//			me.l3/*validateItems*/.call(me);
//		});
//	}
	
	me.v1/*updateValues*/ = true;
	me.active = null;
	me._v1d/*validated*/ = false;
	me._v2/*validateFilter*/ = true;
	me._vf/*f_run*/ = true;
	
	me.in$f();
};

IG$/*mainapp*/._IA5r/*rfReportViewer*/.prototype = {
	in$f: function() {
		var me = this,
			values = {},
			browser, i,
			owner = me.owner,
			ctrls = me.owner ? me.owner.ctrls : null,
			ctrl, n=0;
		
		me.c/*contentarea*/ = $("<div class='igc-rpt-view'></div>").appendTo(me.container);
		
		// me.l3/*validateItems*/();
	},
	
	_l3/*executeItem*/: function() {
		var me = this;
		
		if (me._v2/*validateFilter*/ || me._vf/*f_run*/)
		{
			me._vf/*f_run*/ = false;
			
			clearTimeout(me._v3/*validateCall*/);
			
			me._v3/*validateCall*/ = setTimeout(function() {
				me._l4/*executeValidate*/.call(me);
			}, 50);
		}
	},
	
	_l4/*executeValidate*/: function() {
		var me = this,
			k, i,
			sheet, sop;
		
		if (!me.irpt)
		{
			me.l3/*validateItems*/();
		}
		else
		{
			for (i=0; i < me.irpt.sheets.length; i++)
			{
				sheet = me.irpt.sheets[i];
				sop = sheet._ILb/*sheetoption*/;
				
				if (me._df1/*directfilter*/)
				{
					auxfilter = sop._IL9/*auxfilter*/;
					for (fname in me._df1/*directfilter*/)
					{
						auxfilter[fname] = me._df1/*directfilter*/[fname];
					}
				}
				
				if (sheet._IK9/*olapset*/)
	    		{
	    			pivotxml = sheet._IK9/*olapset*/._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(sheet._IK9/*olapset*/._ILa/*reportoption*/);
	    			sheet._IK9/*olapset*/._IJ0/*requestUpdateReport*/(pivotxml, "mode", i, sheet);
	    		}
	    		else if (sop)
	    		{
	   				sheet._IJ2/*procRunReport*/.call(sheet);
	    		}
			}
		}
		
		me._df1/*directfilter*/ = null;
		
		me._v2/*validateFilter*/ = false;
	},
	
	rX/*removeObj*/: function() {
	},
	
	l3/*validateItems*/: function(runall, isloading) {
		var me = this,
			owner = me.owner,
			n=0,
			sop = me._ILb/*sheetoption*/,
			run = !isloading && (me.btabrun || runall);
			
		if (sop && sop.docid)
		{
			if (sop.rptoption && sop.rptoption.uid)
			{
				if (!me.irpt)
				{
					me._v1d/*validated*/ = true;
					
					var maintab = me.c/*contentarea*/,
						container = me.owner.dockdiv ? $("<div class='report_container'></div>").appendTo(maintab) : null,
						rlogic = me.owner.dockdiv ? $("<div style='display:none;'></div>").appendTo(container) : [];
					
					if (me.__dx != true)
					{
						me.irpt = new IG$/*mainapp*/._IBe/*ReportView*/({
							uid: sop.rptoption.uid,
							header: false,
							hiddenstatusbar: true,
							hiddentoolbar: true,
							border: 0,
							vmode: 1,
							frameHeader: false,
							cmode: 1,
							dockdiv_container: container,
							cvmode: me.cvmode,
							auxfilter: me._df1/*directfilter*/,
							width: me._cw,
							height: me._ch,
							renderTo: rlogic[0] || me.c/*contentarea*/[0],
							_par: me.owner
						});
						
						if (run || isloading)
						{
							me.irpt.on("_lc0", function() {
								me.irpt.un("_lc0");
								
								if (isloading)
								{
									me.container.trigger("i_ready");
								}
								
								if (run)
								{
									me._v2/*validateFilter*/ = true;
									me._l3/*executeItem*/.call(me);
								}
							});
						}
						
						me._df1/*directfilter*/ = null;
						me._v2/*validateFilter*/ = false;
					}
				}
				else
				{
					me.container.trigger("i_ready");
				}
				
				if (me.irpt)
				{
					if (me.irpt.uid != sop.rptoption.uid)
					{
						me.irpt.uid = sop.rptoption.uid;
						me.irpt._IFd/*init_f*/.call(me.irpt);
					}
					else if (!isloading && me.irpt.__loaded)
					{
						me.irpt._IFd/*init_f*/.call(me.irpt);
					}
					me._v2/*validateFilter*/ = false;
				}
			}
		}
	},
	
	setSize: function(w, h, force) {
		var me = this,
			c = me.c/*contentarea*/;
			
		me.pw = me.pw || 0;
		me.ph = me.ph || 0;
		
		me._cw = w;
		me._ch = h;
		
		if (me.irpt && me.irpt.dzone && (force || (Math.abs(me.pw - w) > 5 || Math.abs(me.ph - h) > 5)))
		{
			me.pw = w;
			me.ph = h;
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(c, w);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._h(c, h);
			
			if (me.irpt)
			{
				me.irpt.setSize(w, h);
				
				if (force && !me.irpt.dzone.i2/*sizeapplied*/)
				{
					me.irpt.dzone._IM5/*updateDisplay*/.call(me.irpt.dzone, true);
				}
			}
		}
	},
	
	_ILd/*updateFilterContent*/: function(finfo) {
	}
};
IG$/*mainapp*/._IE1/*filteropcodes*/ = {
	OP_EQUAL: [1, IRm$/*resources*/.r1("L_F_EQ"), "=", "EQUAL", "L_F_EQ"],
	// OP_NOT_EQUAL: [11, IRm$/*resources*/.r1("L_F_NOT_EQ"), "<>", "NOT EQUAL", "L_F_NOT_EQ"],
	OP_GTE: [2, IRm$/*resources*/.r1("L_F_GE"), ">=", "GTE", "L_F_GE"],
	OP_GT: [3, IRm$/*resources*/.r1("L_F_GT"), ">", "GT", "L_F_GT"],
	OP_LTE: [4, IRm$/*resources*/.r1("L_F_LE"), "<=", "LTE", "L_F_LE"],
	OP_LT: [5, IRm$/*resources*/.r1("L_F_LT"), "<", "LT", "L_F_LT"],
	OP_IN: [6, IRm$/*resources*/.r1("L_F_IN"), "In", "IN", "L_F_IN"],
	OP_LIKE: [7, IRm$/*resources*/.r1("L_F_LIKE"), "Like", "LIKE", "L_F_LIKE"],
	OP_BETWEEN: [8, IRm$/*resources*/.r1("L_F_BETWEEN"), "Between", "BETWEEN", "L_F_BETWEEN"],
	// OP_NOTIN: [9, IRm$/*resources*/.r1("L_F_NOTIN"), "Not in", "NOTIN", "L_F_NOTIN"],
	OP_IS: [10, IRm$/*resources*/.r1("L_F_SQL_IS"), "IS", "IS", "L_F_SQL_IS"]
};

IG$/*mainapp*/.__pca = [
	"close;drillreport;isdistinct;fetchall;fw;fh;hidetitle;olap4jsupport;rootsheet;openload;autorefresh;columnfill;enablepivot;enablecache;tb_vch;tb_prt_grd;tb_prt;showlnum;bcluster;edrill;hidemenu;syncrows",
	"label;pagecount;viewmode;objtype;drilltarget;viewchange;toolbutton;cubeuid;tb_prt_i;tb_prt_s;exportbutton;gridprint",
	"panelwidth;panelheight", // "viewchange;exportbutton;toolbutton;
	"measurelocation;customfix;usepaging;pagestyle;dataquerymode;measuretitle",
	"measureposition;customfixcols;rowperpage;refresh_timer",
	"isdistinct;fetchall;treeview;columntree;isbigdecimal;showlnum;hidemenu"
];

IG$/*mainapp*/._dpca/*drilltarget*/ = function(drilltarget) {
	var me = this;
	me._1/*parseDrillTarget*/(drilltarget);
}

IG$/*mainapp*/._dpca/*drilltarget*/.prototype = {
	_1/*parseDrillTarget*/: function(drilltarget) {
		var me = this,
			i, j,
			tvals,
			tval,
			dtval,
			t1,
			tname,
			titem,
			tparams,
			tsheets,
			isdrill;
		
		me.tsheets = tsheets = {};	
		me._e = 0;
		
		if (drilltarget)
		{
			tvals = drilltarget.split(";");
			
			for (i=0; i < tvals.length; i++)
			{
				tval = tvals[i];
				
				if (tval)
				{
					titem = {
						enabled: false,
						items: [],
						item_map: {}
					};
					
					tparams = {
						enabled: false,
						items: [],
						item_map: {}
					};
							
					if (tval.indexOf("^") > -1)
					{
						dtval = tval.split("^");
						tname = dtval[0];
						isdrill = dtval[1] == "T" ? true : false;
						t1 = dtval[2] || null;
						if (t1)
						{
							titem.items = t1.split("_");
							
							for (j=0; j < titem.items.length; j++)
							{
								if (titem.items[j])
								{
									titem.enabled = true;
									titem.item_map[titem.items[j]] = 1;
								}
							}
						}
						t1 = dtval[3] || null;
						if (t1)
						{
							tparams.items = t1.split("_");
							
							for (j=0; j < tparams.items.length; j++)
							{
								if (tparams.items[j])
								{
									tparams.enabled = true;
									tparams.item_map[tparams.items[j]] = 1;
								}
							}
						}
					}
					else
					{
						tname = tval;
						isdrill = true;
						titem = {
							enabled: false,
							items: [],
							item_map: {}
						};
						
						tparams = {
							enabled: false,
							items: [],
							item_map: {}
						};
					}
					
					if (isdrill)
					{
						me._e = 1;
					}
							
					me.tsheets[tname] = {
						name: tname,
						isdrill: isdrill,
						tparams: tparams,
						titem: titem
					};
				}
			}
		}
	},
	_2/*isDrillTarget*/: function(sheetid) {
		var me = this,
			sobj = me.tsheets[sheetid];
		return me._e ? (sobj && sobj.isdrill ? sobj : null) : {
			name: sheetid,
			isdrill: sobj ? sobj.isdrill : false,
			titem: {
				enabled: false,
				items: [],
				item_map: {}
			},
			tparams: {
				enabled: false,
				items: [],
				item_map: {}
			}
		};
	}
};

IG$/*mainapp*/._IE1/*filteropcodes*/._d3/*getOperator*/ = function(value) {
	var opcodes = IG$/*mainapp*/._IE1/*filteropcodes*/;
		r = opcodes.OP_EQUAL[0],
		t;

	t = opcodes["OP_" + value];
	
	if(t)
	{
		r = t[0];
	}
	else
	{
		switch(value)
		{
		case "NE":
			r = opcodes.OP_NOT_EQUAL[0];
			break;
		case "NOTIN":
			r = opcodes.OP_IN[0];
			break;
		}
	}
//	switch (value)
//	{
//	case "NE":
//		r = opcodes.OP_NOT_EQUAL[0];
//		break;
//	case "GTE":
//		r = opcodes.OP_GTE[0];
//		break;
//	case "GT": 
//		r = opcodes.OP_GT[0];
//		break;
//	case "LTE":
//		r = opcodes.OP_LTE[0];
//		break;
//	case "LT":
//		r = opcodes.OP_LT[0];
//		break;
//	case "LIKE": 
//		r = opcodes.OP_LIKE[0];
//		break;
//	case "IN":
//		r = opcodes.OP_IN[0];
//		break;
//	case "NOTIN":
//		// r = opcodes.OP_NOTIN[0];
//		r = opcodes.OP_IN[0];
//		break;
//	case "BETWEEN":
//		r = opcodes.OP_BETWEEN[0];
//		break;
//	case "IS":
//		r = opcodes.OP_IS[0];
//		break;
//	}
	
	return r;
}

IG$/*mainapp*/._IE2/*filterpromptenum*/ = {
	P_TEXTBOX: 1,
	P_COMBOBOX: 2,
	P_DATE: 3,
	P_SELECT_WIN: 4
}

IG$/*mainapp*/._IE3/*fontStyle*/ = {
	P_NONE: 0,
	P_BOLD: 1,
	P_ITALIC: 2,
	P_UNDERLINE: 4
}

IG$/*mainapp*/._IE4/*clMetaItem*/ = function(node) {
	var me = this;
	
	if (node)
	{
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, "uid;type;name;description;updatedate");
		me.uid = IG$/*mainapp*/._I06/*formatUID*/(me.uid);
		me.itemtype = me.type;
		me.itemname = me.name;
	}
}

IG$/*mainapp*/._Ie4/*highlight*/ = function(node) {
	var me = this,
		tnode, values;
		
	me.__pca = [
		"name;delimiter;itemname;uid;operator;stylename;styleuid;apprange;appset"
	];
		
	if (node)
	{
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[0], "s");
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "values");
		if (tnode)
		{
			values = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
		}
		
		me.values = values;
	}
}

IG$/*mainapp*/._Ie4/*highlight*/.prototype = {
	TX/*getXML*/: function() {
		var me = this,
			r;
		
		r = [
			"<hlitem " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[0], "s") + ">",
			"<values><![CDATA[" + (me.values || "") + "]]></values>",
			"</hlitem>"
		];
		
		return r.join("");
	},
	
	g1/*getObj*/: function() {
		var r = {},
			me = this;
		IG$/*mainapp*/._I1d/*CopyObject*/(this, r, me.__pca[0]);
		IG$/*mainapp*/._I1d/*CopyObject*/(this, r, "seq;values");
		return r;
	}
}

IG$/*mainapp*/._Ib4/*prompt*/ = function(node) {
	var me = this,
		tnode;
		
	me.__pca = [
		"uid;name;type;datatype;defaultvalue;allownullvalue;valuetype;datadelimiter;coldelimiter"
	];
	if (node)
	{
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[0], "s");
		
		tnode = IG$/*mainapp*/._I19/*getSubNode*/(node, "sql");
		if (tnode)
		{
			me.sql = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
		}
		
		me.L2/*updatePromptEditor*/();
	}
}

IG$/*mainapp*/._Ib4/*prompt*/.prototype = {
	L1/*getXML*/: function(opt) {
		var me = this,
			j,
			r = "<item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(this, me.__pca[0], "s") + (opt || "") + ">";
		if (me.sql)
		{
			r += "<sql><![CDATA[" + me.sql + "]]></sql>";
		}
		
		if (me.values)
		{
			r += "<values>"
			for (j=0; j < me.values.length ;j++)
			{
				r += "<value><code><![CDATA[" + (me.values[j].code || "") + "]]></code>"
					+ "<text><![CDATA[" + (me.values[j].text || "") + "]]></text>"
					+ "</value>"
			}
			r += "</values>";
		}
		r += "</item>";
		
		return r;
	},
	L2/*updatePromptEditor*/: function() {
		var me = this;
		if (me.type == "combobox")
		{
			me.promptEditor = IG$/*mainapp*/._IE2/*filterpromptenum*/.P_COMBOBOX;
		}
	},
	
	LD/*loadData*/: function(panel, callback) {
		var me = this,
			_d6/*itemList*/ = me._d6/*itemList*/,
			uid = (_d6/*itemList*/ ? _d6/*itemList*/[0].uid : me.uid),
			name = (_d6/*itemList*/ ? _d6/*itemList*/[0].name : me.name),
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			obj, cnt;
		
		me.dataLoaded = true;
		me.data = [];
		
		if (_d6/*itemList*/)
		{
			cnt = IG$/*mainapp*/._I2e/*getItemOption*/();
			obj = IG$/*mainapp*/._I2d/*getItemAddress*/({
				uid: uid, 
				name: name, 
				option: "valuelist", 
				sheetindex: me.sheetindex
			}, "uid;name;option;sheetindex");
		}
		else
		{
			cnt = me._ILa/*reportoption*/._IJ1/*getCurrentPivot*/();
			obj = "<smsg>" + me.L1/*getXML*/(" sheetindex='" + me.sheetindex + "' option='valuelist'") + "</smsg>";
		}
		
		req.init(panel, 
			{
				ack: "18",
				payload: obj,
				mbody: cnt
			}, me, me.rs_LD/*loadData*/, null, callback);
		req._l/*request*/();
	},
	
	rs_LD/*loadData*/: function(xdoc, callback) {
		var me = this,
			_d6/*itemList*/ = me._d6/*itemList*/,
			uid = (_d6/*itemList*/ ? _d6/*itemList*/[0].uid : me.uid),
			result = new IG$/*mainapp*/._ICd/*clValueList*/(xdoc, uid);
		
		me.result = result;
		
		if (callback)
		{
			callback.execute(xdoc);
		}
	},
	
	_d2/*getValueDesc*/: function(selvalues) {
		var r = "";
		
		if (selvalues && selvalues.length > 0)
		{
			r = selvalues[0].code + (selvalues.length > 1 ? " + (" + (selvalues.length-1) + ")" : "");
		}
		
		return r;
	}
}

IG$/*mainapp*/._IE5/*getStyleName*/ = function(mresult, r, c) {
	if (mresult.styledata.length > r && mresult.styledata[r].length > c && mresult.styledata[r][c] != "")
	{
		return " class='" + mresult.styledata[r][c] + "'";
	}
	
	return "";
}

IG$/*mainapp*/._IE6/*clExport*/ = function(value) {
	var me = this,
		k,
		ep, p, pnode,
		i, j_param,
		T0;
	
	$s.apply(me, {
		filterdesc: true,
		pagenumber: true,
		showtitle: true,
		
		repeatheader: true,
		footer: false,
		margine_top: 30,
		margine_left: 30,
		margine_right: 30,
		margine_bottom: 30,
		
		startpage: 1,
		endpage: 20,
		
		scaledown: true, 
		columnfit: true,
		
		alldata: true,
		
		layout: "portrait",
		pagesize: "A4",
		fonttype: "HELVETICA",
		
		u_excel: true,
		u_pdf: true,
		u_html: true,
		u_jasper: false,
		u_csv: true,
		
		dinfo: {}
	});
	
	me.j_param = [
		"jasper_template", "jasper_tmpl_uid", "pdf_output", "pdf_label", "rtf_output", "rtf_label", "ppt_output", "ppt_label", "excel_output", "excel_label",
		"csv_output", 
		"html_output", "html_label", "docx_output", "docx_label", "xml_output", "xml_label"
	];
	
	me.__pca = [
		"layout;pagesize;fonttype;title;footertitle",
		"filterdesc;pagenumber;showtitle;footer;repeatheader;scaledown;alldata;columnfill;hidemenu;u_excel;u_pdf;u_html;u_csv;u_jasper;u_office",
		"margine_top;margine_bottom;margine_left;margine_right;startpage;endpage"
	];
	
	if (value)
	{
		$.each(["s", "b", "i"], function(i, k) {
			IG$/*mainapp*/._I1f/*XGetInfo*/(me, value, me.__pca[i], k);
		});
		
		me.jasper = {
			_1/*loaded*/: true
		};
		
		pnode = IG$/*mainapp*/._I18/*XGetNode*/(value, "jasper");
		
		if (pnode)
		{
			for (i=0; i < me.j_param.length; i++)
			{
				p = me.j_param[i];
				me["jasper"][p] = IG$/*mainapp*/._I1b/*XGetAttr*/(pnode, p);
			}
		}
		
		me.otmpl = [];
		
		pnode = IG$/*mainapp*/._I18/*XGetNode*/(value, "otmpl");
		
		if (pnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(pnode);
			
			for (i=0; i < tnodes.length; i++)
			{
				me.otmpl.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]));
			}
		}
		
		T0 = window.IExport;
		if (T0)
		{
			for (k in T0)
			{
				ep = T0[k];
				me[ep.name] = {
					loaded: false
				};
				pnode = IG$/*mainapp*/._I18/*XGetNode*/(value, ep.name);
				if (pnode)
				{
					me[ep.name]._1/*loaded*/ = true;
					for (i=0; i < ep.params.length; i++)
					{
						p = ep.params[i];
						me[ep.name][p] = IG$/*mainapp*/._I1b/*XGetAttr*/(pnode, p);
					}
				}
			}
		}
		
		pnode = IG$/*mainapp*/._I18/*XGetNode*/(value, "dockitems");
			
		if (pnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(pnode);
			for (i=0; i < tnodes.length; i++)
			{
				p = {
					docid: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "docid"),
					overflow: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "overflow") == "T" ? true : false,
					hidden: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "hidden") == "T" ? true : false
				};
				
				me.dinfo[p.docid] = p;
			}
		}
		
		me.init = true;
	}
	
	if (!me.jasper || (me.jasper && !me.jasper._1/*loaded*/))
	{
		if (!IG$/*mainapp*/._L51/*sysconfig*/)
		{
			IG$/*mainapp*/._l51/*readSysConfig*/(new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.M1/*updateDefault*/, "jasper"));
		}
		else
		{
			me.M1/*updateDefault*/("jasper");
		}
	}
}

IG$/*mainapp*/._IE6/*clExport*/.prototype = {
	TX/*getXML*/: function() {
		var me = this,
			i,
			r = "<ExportOption",
			__t;
		
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[0], "s");
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[1], "b");
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[2], "i");
		r += ">";
		
		if (me.jasper)
		{
			r += "<jasper";
			r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me.jasper, me.j_param.join(";"), "s");
			r += "/>";
		}
		
		if (me.otmpl)
		{
			r += "<otmpl>";
			for (i=0; i < me.otmpl.length; i++)
			{
				r += "<tmpl " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.otmpl[i], "uid;type;name;export_type;description", "s") + "/>";
			}
			r += "</otmpl>";
		}
		
		__t = window.IExport;
		
		if (__t)
		{
			var k,
				ep, p, lparam,
				i;
				
			for (k in __t)
			{
				ep = __t[k];
				if (me[ep.name])
				{
					lparam = ep.params.join(";");
					r += "<" + ep.name + " " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me[ep.name], lparam, "s") + "/>";
				}
			}
		}
		
		r += "</ExportOption>";
		
		return r;
	},
	M1/*updateDefault*/: function(opt) {
		var me = this,
			sysconfig = IG$/*mainapp*/._L51/*sysconfig*/,
			jout,
			i;
		
		if (sysconfig)
		{
			switch (opt)
			{
			case "jasper":
				jout = sysconfig.JASPER_OUTPUT;
				if (jout && jout.value)
				{
					jout = jout.value.split(";");
					me[opt] = me[opt] || {};
					
					for (i=0; i < jout.length; i++)
					{
						me[opt][jout[i] + "_output"] = "T";
					}
				}
				jout = sysconfig.JASPER_TEMPLATE;
				if (jout && jout.value)
				{
					me[opt].jasper_template = jout.value;
				}
				break;
			}
		}
	}
};

IG$/*mainapp*/._IE7/*clCellOption*/ = function(node) {
	var me = this;
	
	me.basetype = 0;
	me.valuemax = 0;
	me.valuemin = 0;
	me.cellwidth = 50;
	me.cellheight = 20;
	me.direction = "horizontal";
	
	me.axismetric = [];
	
	me.__pca = [
		"basedatatype;basetype;cellheight;cellwidth;mctype;uid;valuemax;valuemin;linecolor;fillcolor",
		"direction",
		"separatecolumn",
		"nodepath;description;memo;name;pid;sortorder;type;uid;activeformula;rankcount;aggrfunc;disp_title;hidecolumn;timeformat"
	];
	
	if (node)
	{
		var tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "CellOption"),
			snode,
			tnodes,
			i,
			xitem,
			valuemetric;
			
		if (tnode)
		{
			IG$/*mainapp*/._I1f/*XGetInfo*/(me, tnode, me.__pca[0], "i");
			IG$/*mainapp*/._I1f/*XGetInfo*/(me, tnode, me.__pca[1], "s");
			IG$/*mainapp*/._I1f/*XGetInfo*/(me, tnode, me.__pca[2], "b");
			
			me.uid = IG$/*mainapp*/._I06/*formatUID*/(me.uid);
			
			snode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "AxisMetric");
		
			if (snode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
				for (i=0; i < tnodes.length; i++)
				{
					xitem = {};
					IG$/*mainapp*/._I1f/*XGetInfo*/(xitem, tnodes[i], me.__pca[3], "s");
					xitem.itemtype = xitem.type;
					me.axismetric.push(xitem);
				}
			}
			
			snode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "ValueMetric");
			
			if (snode)
			{
				valuemetric = me.valuemetric = {};
				IG$/*mainapp*/._I1f/*XGetInfo*/(valuemetric, snode, me.__pca[3], "s");
				valuemetric.itemtype = valuemetric.type;
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "objinfo");
		
		if (tnode)
		{
			me.cubeuid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "cubeuid");
			me.cubeuid = IG$/*mainapp*/._I06/*formatUID*/(me.cubeuid);
		}
	}
}

IG$/*mainapp*/._IE7/*clCellOption*/.prototype = {
	C_1/*getXML*/: function () {
		var i,
			xitem,
			me = this,
			r = "<CellOption",
			valuemetric = me.valuemetric;
			
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[0], "i");
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[1], "s");
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[2], "b");
		
		r += ">";
		
		if (me.axismetric)
		{
			r += "<AxisMetric>"
			for (i=0; i < me.axismetric.length; i++)
			{
				xitem = me.axismetric[i];
				xitem.type = xitem.itemtype || xitem.type;
			 	r += "<item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(xitem, me.__pca[3], "s") + "/>";
			}
			r += "</AxisMetric>";
		}

		if (valuemetric)
		{
			valuemetric.type = valuemetric.itemtype || valuemetric.type;
			r += "<ValueMetric" + IG$/*mainapp*/._I20/*XUpdateInfo*/(valuemetric, __m, "s") + "/>";
		}
		
		r += "</CellOption>";
		
		return r;
	}
}

IG$/*mainapp*/._IE8/*clItems*/ = function(node, incsub) {
	var me = this,
		snode, snodes,
		i, sitem;
	
	me.__pca = [
		"uid;name;lname;itemtype;type;nodepath;memo;pid;sortorder;description;activeformula;rankcount;aggrfunc;disp_title;hidecolumn;timeformat"
	];
	
	if (node)
	{
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[0], "s");
		me.itemtype = me.type;
		
		switch (me.itemtype)
		{
		case "CellChart":
		case "ChartMeasure":
			me.C_2/*parseCellChart*/(node);
			break;
		}
		
		if (incsub)
		{
			sitem = me.sitems = [];
			
			snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "sitems");
			if (snode)
			{
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
				
				for (i=0; i < snodes.length; i++)
				{
					sitem = new IG$/*mainapp*/._IE8/*clItems*/(snodes[i], incsub);
					sitems.push(sitem);
				}
			}
		}
	}
}

IG$/*mainapp*/._IE8/*clItems*/.prototype = {
	_I1d/*CopyObject*/: function(item, obj) {
		var me = this;
		IG$/*mainapp*/._I1d/*CopyObject*/(obj, item, me.__pca[0]);
		item.itemtype = item.type || item.itemtype;
	},
	
	C_2/*parseCellChart*/: function(node) {
		this.celloption = new IG$/*mainapp*/._IE7/*clCellOption*/(node);
	},
	
	C_1/*getItemXML*/: function(incsub) {
		var me = this,
			r, i,
			sitems = me.sitems,
			celloption = me.celloption;
			
		me.type = me.itemtype || me.type;
			
		r = "<item"
			+ IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[0], "s");
//			  + " type='" + (me.itemtype || me.type) + "'", 
		
		if (incsub && sitems)
		{
			r += "><sitems>";
			for (i=0; i < sitems.length; i++)
			{
				r += sitems[i].C_1/*getXML*/(incsub);
			}
			r += "</sitems></item>";
		}
		else if (me.itemtype == "ChartMeasure" && celloption)
		{
			r += ">" + celloption.C_1/*getXML*/();
			r += "<objinfo cubeuid='" + (celloption.cubeuid || "") + "'/>";
			r += "</item>";
		}
		else
		{
			r += "/>";
		}
		return r;
	}
}

IG$/*mainapp*/._IE9/*clFilter*/ = function(node) {
	var me = this;
	
	me._d6/*itemList*/ = [];
	me.l_item = [];
	
	me.delimiter = ";";
	
	me._d5/*parseNode*/(node);
}

IG$/*mainapp*/._IE9/*clFilter*/.prototype = {
	_d4/*getDesc*/: function() {
		var me = this,
			r = "",
			i,
			_d6/*itemList*/ = me._d6/*itemList*/;
		
		for (i=0; i < _d6/*itemList*/.length; i++)
		{
			r = (i == 0) ? _d6/*itemList*/[i].name : r + ", " + _d6/*itemList*/[i].name;
		}
		
		r += "\n" + me._d1/*getOperatorDesc*/(me.operator, me.opisnot, 1) + "\n(";
		
		if (me.valuetype == "field")
		{
			r += (me.l_item && me.l_item.length ? me.l_item[0].name : "");
			if (me.operator == 8)
			{
				r += " AND " + (me.l_item && me.l_item.length > 1 ? me.l_item[1].name : "");
			}
		}
		else
		{
			r += me._d2/*getValueDesc*/(me.values);
		}
		
		r += ")";
		
		return r.substring(0, 50);
	},
	_d2/*getValueDesc*/: function(values) {
		var me = this,
			r = "",
			i;
		
		if (values && values.length > 0)
		{
			for (i=0; i < values.length; i++)
			{
				r += (i > 0) ? me.delimiter : "";
				r += (values[i].text) ? values[i].text : values[i].code;
			}
		}
		
		return r;
	},
	_d5/*parseNode*/: function(node) {
		var me = this,
			i,
			tnode,
			child,
			item,
			p,
			p_enum = IG$/*mainapp*/._IE2/*filterpromptenum*/;
		
		me._d6/*itemList*/ = [];
		me.values = [];
		me._d7/*isprompt*/ = false;
		me._d8/*iscustom*/ = false;
		me.delimiter = ";";
		
		if (node)
		{
			me.operator = IG$/*mainapp*/._IE1/*filteropcodes*/._d3/*getOperator*/(IG$/*mainapp*/._I1b/*XGetAttr*/(node, "operator"));
			me.opisnot = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "opisnot") == "T";
			me._d9/*issqlvalue*/ = (IG$/*mainapp*/._I1b/*XGetAttr*/(node, "issqlvalue") == "T") ? true : false;
			me.authname = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "authname");
			me.authuid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "authuid");
			me.active = (IG$/*mainapp*/._I1b/*XGetAttr*/(node, "active") == "T") ? true : false;
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "items");
			
			if (tnode && tnode.hasChildNodes())
			{
				child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				
				for (i=0; i < child.length; i++)
				{
					item = new IG$/*mainapp*/._IE8/*clItems*/(child[i]);
					me._d6/*itemList*/.push(item);
				}
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "l_items");
			
			if (tnode && tnode.hasChildNodes())
			{
				child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				
				for (i=0; i < child.length; i++)
				{
					item = new IG$/*mainapp*/._IE8/*clItems*/(child[i]);
					me.l_item.push(item);
				}
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Values");
			
			if (tnode && tnode.hasChildNodes())
			{
				me.valuetype = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "valuetype");
				
				me._d8/*iscustom*/ = (IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "custom") == "T") ? true : false;
				me.delimiter = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "delimiter") || ";";
				
				if (IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "prompt") == "T")
				{
					me._d7/*isprompt*/ = true;
					
					switch (IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "prompteditor"))
					{
						case "2":
							p = p_enum.P_COMBOBOX;
							break;
						case "3":
							p = p_enum.P_DATE;
							break;
						case "4":
							p = p_enum.P_SELECT_WIN;
							break;
						default:
							p = p_enum.P_TEXTBOX;
							break;
					}
					
					me.promptEditor = p;
				}
				else
				{
					me._d7/*isprompt*/ = false;
				}
				
				child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				
				for (i=0; i < child.length; i++)
				{ 
					var v = {code: null, value: null},
						vnode = child[i],
						cnode = IG$/*mainapp*/._I18/*XGetNode*/(vnode, "code");
					
					if (cnode)
					{
						v.code = IG$/*mainapp*/._I24/*getTextContent*/(cnode);
					}
					
					cnode = IG$/*mainapp*/._I18/*XGetNode*/(vnode, "text");
					
					if (cnode)
					{
						v.text = IG$/*mainapp*/._I24/*getTextContent*/(cnode);
					}
					
					if (v.code)
					{
						me.values.push(v);
					}
				}
			}
		}
	},
	
	_d1/*getOperatorDesc*/: function(op, opisnot, isdesc) {
		var opcodes = IG$/*mainapp*/._IE1/*filteropcodes*/,
			opvalue = "EQUAL",
			oploc = "L_F_EQ";
		
		switch (op)
		{
		case opcodes.OP_GTE[0]:
			opvalue = "GTE";
			oploc = opcodes.OP_GTE[4];
			break;
		case opcodes.OP_GT[0]:
			opvalue = "GT";
			oploc = opcodes.OP_GT[4];
			break;
		case opcodes.OP_LTE[0]:
			opvalue = "LTE";
			oploc = opcodes.OP_LTE[4];
			break;
		case opcodes.OP_LT[0]:
			opvalue = "LT";
			oploc = opcodes.OP_LT[4];
			break;
		case opcodes.OP_LIKE[0]:
			opvalue = "LIKE";
			oploc = opcodes.OP_LIKE[4];
			break;
		case opcodes.OP_IN[0]:
			opvalue = "IN";
			oploc = opcodes.OP_IN[4];
			break;
//		case opcodes.OP_NOTIN[0]:
//			opvalue = "NOTIN";
//			oploc = opcodes.OP_NOTIN[4];
//			break;
		case opcodes.OP_BETWEEN[0]:
			opvalue = "BETWEEN";
			oploc = opcodes.OP_BETWEEN[4];
			break;
		case opcodes.OP_IS[0]:
			opvalue = "IS";
			oploc = opcodes.OP_IS[4];
			break;
		}
		
		if (isdesc)
		{
			opvalue = IRm$/*resources*/.r1(oploc + (opisnot ? "_NOT" : ""));
		}
		
		return opvalue;
	},
	
	TX/*getXML*/: function() {
		var me = this,
			r = "<Condition",
			opvalue = "EQUAL",
			i,
			_d6/*itemList*/ = me._d6/*itemList*/;
		
		opvalue = me._d1/*getOperatorDesc*/(me.operator);
	
		r += " operator='" + opvalue + "'";
		r += " issqlvalue='" + ((me._d9/*issqlvalue*/) ? "T" : "F") + "'";
		r += " opisnot='" + (me.opisnot ? "T" : "F") + "'"
		r += (me.authname ? " authname='" + me.authname + "'" : "");
		r += (me.authuid ? " authuid='" + me.authuid +"'" : "");
		r += (me.authuid && me.authname ? (me.active ? " active='T'" : "active='F'") : "");
		r += ">";
		
		r += "<items>";
		
		for (i=0; i < _d6/*itemList*/.length; i++)
		{
			var mitem = _d6/*itemList*/[i];
			r += mitem.C_1/*getItemXML*/();
		}
		
		r += "</items>";
		
		r += "<Expression>";
		
		r += "<![CDATA[" + (me.expression || "") + "]]>";
		
		r += "</Expression>";
		
		r += "<l_items>";
		
		for (i=0; i < me.l_item.length; i++)
		{
			r += me.l_item[i].C_1/*getItemXML*/();
		}
		
		r += "</l_items>";
		
		r += "<Values";
		r += " valuetype='" + (me.valuetype || "") + "'";
		r += " prompt='" + ((me._d7/*isprompt*/) ? "T" : "F") + "'";
		r += " prompteditor='" + me.promptEditor + "'";
		r += " custom='" + ((me._d8/*iscustom*/) ? "T" : "F") + "'";
		r += " delimiter='" + (me.delimiter || ";") + "'";
		r += ">";
		
		if (me.values)
		{
			for (i=0; i < me.values.length; i++)
			{
				r += "<value>";
				
				if (me.values[i].code)
				{
					r += "<code>";
					r += "<![CDATA[" + (me.values[i].code || "") + "]]>";
					r += "</code>";
				}
				
				if (me.values[i].value)
				{
					r += "<value>";
					r += "<![CDATA[" + (me.values[i].value || "") + "]]>";
					r += "</value>";
				}
	
				r += "</value>";
			}
		}
		
		r += "</Values>";
		r += "</Condition>";
		
		return r;
	},
	
	LD/*loadData*/: function(panel, callback) {
		var me = this,
			uid = me._d6/*itemList*/[0].uid,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		me.dataLoaded = true;
		me.data = [];
		
		req.init(panel, 
			{
				ack: "18",
				payload: "<smsg><item uid='" + uid + "' option='valuelist'/></smsg>",
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
			}, me, me.rs_LD/*loadData*/, null, callback);
		req._l/*request*/();
	},
	rs_LD/*loadData*/: function(xdoc, callback) {
		var me = this,
			uid = me._d6/*itemList*/[0].uid,
			result = new IG$/*mainapp*/._ICd/*clValueList*/(xdoc, uid);
		
		me.result = result;
		
		if (callback)
		{
			callback.execute();
		}
	}
};

IG$/*mainapp*/._IEa/*relations*/ = function(node) {
	var me = this,
		tnode;
		
	me.__pca = [
		"nodepath;datatype;name;tablename;type"
	];

	tnode = IG$/*mainapp*/._I19/*getSubNode*/(node, "source");
	me.source = (tnode ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode) : {});
	tnode = IG$/*mainapp*/._I19/*getSubNode*/(node, "target");
	me.target = (tnode ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode) : {});
}

IG$/*mainapp*/._IEa/*relations*/.prototype = {
	TX/*getXML*/: function() {
		var me = this,
			r = "<Link join='" + (me.join || "inner") + "' operator='" + (me.operator || "=") + "'>";
		
		r += "<source" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.source, me.__pca[0], "s") + "/>";
		r += "<target" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.target, me.__pca[0], "s") + "/>";
		
		r += "</Link>";
		
		return r;
	},
	MX/*makeInfo*/: function() {
		var me = this,
			source = me.source,
			target = me.target;
			
		me.joinfrom = (source ? (source.tablename || "") + "." + (source.name || "") : "");
		me.jointo = (target ? (target.tablename || "") + "." + (target.name || "") : "");
		me.joincondition = me.condition || "=";
	}
};

IG$/*mainapp*/._IEb/*clFilterGroup*/ = function(node) {
	var me = this,
		p;
	
	if (node)
	{
		p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(node);
		me.name = p.name;
		me.authuid = p.authuid;
		me.authname = p.authname;
		me.active = (p.active == "T" ? true : false);
	}
	
	me.subGroups = [];
	me.subConditions = [];
}

IG$/*mainapp*/._IEb/*clFilterGroup*/.prototype = {
	T1/*findItem*/: function(uid) {
		var me = this,
			r = this.T1a/*findSubItem*/(uid, me);
		return r;
	},
	
	T1a/*findSubItem*/: function(uid, group) {
		var i, j,
			r,
			condition,
			_dff = group.subConditions,
			_dfs = group.subGroups,
			_d6/*itemList*/;
			
		for (i=0; i < _dff.length; i++)
		{
			condition = _dff[i];
			_d6/*itemList*/ = condition._d6/*itemList*/;
			if (_d6/*itemList*/ && _d6/*itemList*/.length > 0)
			{
				for (j=0; j < _d6/*itemList*/.length; j++)
				{
					if (_d6/*itemList*/[j].uid == uid)
					{
						r = condition;
						break;
					}
				}
			}
			
			if (r)
			{
				break;
			}
		}
		
		if (!r)
		{
			for (i=0; i < _dfs.length; i++)
			{
				r = this.T1a/*findSubItem*/(uid, _dfs[i]);
				if (r)
				{
					break;
				}
			}
		}
		
		return r;
	},
	
	TX/*getXML*/: function()
	{
		var me = this,
			x = "",
			i,
			cf,
			cg,
			isauthfilter = false,
			subConditions = me.subConditions,
			subGroups = me.subGroups;
			
		if (me.authuid && me.authname)
		{
			isauthfilter = true;
			x += "<Filter authuid='" + me.authuid + "' authname='" + me.authname + "' active='" + (me.active ? "T" : "F") + "'>";
		}
	
		if (subConditions.length > 0 || subGroups.length > 0)
		{
			x += "<FilterGroup";
			x += (me.name) ? " name='" + me.name + "'>" : ">";
			
			if (subConditions.length > 0)
			{
				for (i=0; i < subConditions.length; i++)
				{
					cf = subConditions[i];
					x += cf.TX/*getXML*/();
				}
			}
			
			if (subGroups.length > 0)
			{
				for (i=0; i < subGroups.length; i++)
				{
					cg = subGroups[i];
					x += cg.TX/*getXML*/();
				}
			}
			
			x += "</FilterGroup>";
		}
		
		if (isauthfilter)
		{
			x += "</Filter>";
		}
		
		return x;
	}
}

IG$/*mainapp*/._IEc/*clChartOption*/ = function(node) {
	var me = this,
		i,
		t,
		opt,
		vnode, vnodes, bobj;
	
	me.charttype = "cartesian";
	me.ctangle = 30;
	me.ctdepth = 30;
	me.drillcharttype = [];
	me.legendposition = "BOTTOM_CENTER";
	me.matminuscolor = 16711931;
	me.matshowgrid = true;
	me.matshowplot = true;
	me.matusedropshadow = true;
	me.precision = 0;
	me.maxchartresult = 200;
	me.showlegend = true;
	me.subtype = "column";
	me.tooltip = "[[category]] [[value]]";
	me.zoomdirection = "left";
	me.zoomrange = 10;
	me.pieinnerradius = 0;
	me.pielabeldist = 20;
	me.pielayout = "h";
		
	me.timeseriesduration = 1000;
	me.bmaprow = true;
	me.bmapsize = 10;
	me.p_bands = [];
	
	me.cindicator = null;
	me.xlabel = true;
	me.xaxisrot = true;
	me.xstagl = 1;
	me.xstep = 1;
	me.ytickint = 0;
	
	me.__pca = [
		"animate;drillyaxismax;enabledrill;enablezoom;enabledragselect;legendboxsizing;matshowgrid;matshowplot;matusedropshadow;showlegend;lgndfloating;showtitle;stack;stackperc;usedualaxis;useformula;swapaxis;bmaprow;bmapyaxis;dl_enable;dl_marker;dl_inside;useformatvalue;showvalue;tm_l_alg;xlabel;xaxisrot",
		"chartprovider;charttype;legendposition;subtype;title;titleposition;tooltip;yvalueformat;zoomdirection;drillcharttype;andersonspecies;relationgroups;renderas;dualaxisitem;dl_marker_l;dl_enable_l;maptype;mapcategory;yaxisformat;yaxismin;yaxismax;nat_timefield;nat_datafield;nat_groupfield;nat_xdata;nat_ydata;nat_vdata;timeseriesfield;bmapsizeaxisfield;bmapyaxisfield;colorset;yaxisformat2;yaxismin2;yaxismax2;pielayout;yaxistitle;yaxistitle2;dl_align;tm_l_cl;chd_method",
		"ctangle;ctdepth;drillviewmode;legendboxsize;matminuscolor;matpluscolor;matwidth;zoomrange;rel_range1;rel_range2;comp_range0;comp_range1;pieinnerradius;pielabeldist;precision;maxchartresult;timeseriesduration;bmapsize;xstagl;xstep;ytickint"
	];
	
	if (node)
	{
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[0], "b");
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[1], "s");
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[2], "i");
		
		if (IG$/*mainapp*/.cSET/*chartOptionSet*/)
		{
			IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, IG$/*mainapp*/.cSET/*chartOptionSet*/, "s", 1);
		}
		
		var drillcharttype = me.drillcharttype,
			renderas = me.renderas,
			dualaxisitem = me.dualaxisitem,
			dl_marker_l = me.dl_marker_l,
			dl_enable_l = me.dl_enable_l;
		me.drillcharttype = drillcharttype && drillcharttype.split ? drillcharttype.split(";") : [];
		me.renderas = renderas && renderas.split ? renderas.split(";") : [];
		me.dualaxisitem = dualaxisitem && dualaxisitem.split ? dualaxisitem.split(";") : [];
		me.dl_marker_l = dl_marker_l && dl_marker_l.split ? dl_marker_l.split(";") : [];
		me.dl_enable_l = dl_enable_l && dl_enable_l.split ? dl_enable_l.split(";") : [];
		dualaxisitem = me.dualaxisitem;
		dl_marker_l = me.dl_marker_l;
		dl_enable_l = me.dl_enable_l;
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "cunittext");

		if (vnode)
		{
			me.cunittext = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "piedatalabel");

		if (vnode)
		{
			me.piedatalabel = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "p_bands");
		
		if (vnode)
		{
			vnodes = IG$/*mainapp*/._I26/*getChildNodes*/(vnode);
			for (i=0; i < vnodes.length; i++)
			{
				bobj = new IG$/*mainapp*/._Ifb_n/*chartplotbandobject*/(vnodes[i]);
				me.p_bands.push(bobj);
			}
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "cindicator");
		
		if (vnode)
		{
			me.cindicator = Base64.decode(IG$/*mainapp*/._I24/*getTextContent*/(vnode));
		}
	}
	
	me.chartcategory = [	
		{charttype: "", subtype: ""},
		{charttype: "cartesian", subtype: "column"},
		{charttype: "cartesian", subtype: "line"},
		{charttype: "cartesian", subtype: "spline"},
		{charttype: "cartesian", subtype: "area"},
		{charttype: "cartesian", subtype: "bar"},
		{charttype: "scrollable", subtype: "scrollable"},
		
		{charttype: "pie", subtype: "pie"},
		{charttype: "pie", subtype: "doughnut"},
		{charttype: "bubble", subtype: "bubble"},
		{charttype: "scatter", subtype: "scatter"},
		{charttype: "radar", subtype: "radar"},
		
		{charttype: "map", subtype: "map"},
		
		{charttype: "matrix", subtype: "matrix"},
		{charttype: "candlestick", subtype: "candlestick"},
		{charttype: "ohlc", subtype: "ohlc"},
		
		{charttype: "datagrid", subtype: "datagrid"}
	];
	
	me.getChartInfo = function(id) {
		var i,
			chartcategory = me.chartcategory,
			r = chartcategory[0];
		
		for (i=0; i < chartcategory.length; i++)
		{
			chartcategory[i].id = i;
			if (chartcategory[i].id == id)
			{
				r = chartcategory[i];
				break;
			}
		}
		
		return r;
	}
	
	me.getChartInfoBySubType = function(subtype) {
		var i,
			r,
			me = this,
			chartcategory = me.chartcategory;
		
		for (i=0; i < chartcategory.length; i++)
		{
			if (chartcategory[i].subtype == subtype)
			{
				r = chartcategory[i];
				r.id = i;
				break;
			}
		}
		
		return r;
	}
}

IG$/*mainapp*/._IEc/*clChartOption*/.prototype = {
	TX/*getXML*/: function() {
		var me = this,
			i,
			r = "<ChartOption",
			drillcharttype = me.drillcharttype,
			dualaxisitem = me.dualaxisitem,
			dl_marker_l = me.dl_marker_l,
			dl_enable_l = me.dl_enable_l,
			renderas = me.renderas,
			cs, csm = [], csk = [], cn;
		
		me.drillcharttype = drillcharttype && drillcharttype.length ? drillcharttype.join(";")	: null;
		me.dualaxisitem = dualaxisitem && dualaxisitem.length ? dualaxisitem.join(";") : null;
		me.dl_marker_l = dl_marker_l && dl_marker_l.length ? dl_marker_l.join(";") : null;
		me.dl_enable_l = dl_enable_l && dl_enable_l.length ? dl_enable_l.join(";") : null;
		me.renderas = renderas && renderas.length ? renderas.join(";") : null;
		
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[0], "b");
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[1], "s");
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[2], "i");
		
		dualaxisitem = me.dualaxisitem;
		me.dualaxisitem = dualaxisitem ? dualaxisitem.split(";") : [];
		drillcharttype = me.drillcharttype;
		me.drillcharttype = drillcharttype ? drillcharttype.split(";") : [];
		renderas = me.renderas;
		me.renderas = renderas ? renderas.split(";") : [];
		
		dl_marker_l = me.dl_marker_l;
		me.dl_marker_l = dl_marker_l ? dl_marker_l.split(";") : [];
		dl_enable_l = me.dl_enable_l;
		me.dl_enable_l = dl_enable_l ? dl_enable_l.split(";") : [];
		
		if (IG$/*mainapp*/.cSET/*chartOptionSet*/)
		{
			cs = IG$/*mainapp*/.cSET/*chartOptionSet*/.split(";");
			
			for (i=0; i < cs.length; i++)
			{
				if (cs[i] && cs[i].substring(0, "cdata_".length) == "cdata_")
				{
					csk.push(cs[i]);
				}
				else
				{
					csm.push(cs[i]);
				}
			}
			
			r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, csm.join(";"), "s");
		}
		
		r += ">";
		
		for (i=0; i < csk.length; i++)
		{
			cn = csk[i];
			if (cn && me[cn])
			{
				r += "<" + cn + "><![CDATA[" + me[cn] + "]]></" + cn + ">";
			}
		}
		
		if (me.cunittext)
		{
			r += "<cunittext><![CDATA[" + me.cunittext + "]]></cunittext>";
		}
		
		if (me.piedatalabel)
		{
			r += "<piedatalabel><![CDATA[" + me.piedatalabel + "]]></piedatalabel>";
		}

		if (me.p_bands && me.p_bands.length > 0)
		{
			r += "<p_bands>";
			for (i=0; i < me.p_bands.length; i++)
			{
				r += me.p_bands[i]._2/*getText*/();
			}
			r += "</p_bands>";
		}
		
		if (me.cindicator)
		{
			r += "<cindicator><![CDATA[" + Base64.encode(me.cindicator || "") + "]]></cindicator>";
		}
		
		r += "</ChartOption>"
		return r;
	}
}

IG$/*mainapp*/._IEd/*clROption*/ = function(node) {
	var me = this,
		script, promptvalue,
		snode;
	me.s1/*showSummary*/ = true;
	me.s2/*showScript*/ = true;
	me.s3/*scriptcontent*/ = "";
	me.s4/*rprompt*/ = "";
	me.smw/*minwidth*/ = 0;
	me.smh/*minheight*/ = 0;
	me.pgs = 2000;
	
	// me.s4c/*rpromptcontrols*/ = null;
	// me.s4p/*rpromptvalues*/ = null;
	
	if (node)
	{
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, "s1;s2", "b");
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, "smw;smh;pgs", "i");
		
		snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "script");
		if (snode)
		{
			script = IG$/*mainapp*/._I24/*getTextContent*/(snode);
			if (script)
			{
				me.s3/*scriptcontent*/ = Base64.decode(script);
			}
		}
		snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "prompt");
		if (snode)
		{
			promptvalue = IG$/*mainapp*/._I24/*getTextContent*/(snode);
			if (promptvalue)
			{
				me.s4/*rprompt*/ = Base64.decode(promptvalue);
			}
		}
	}
}

IG$/*mainapp*/._IEd/*clROption*/.prototype = {
	TX/*getXML*/: function() {
		var me = this,
			i, s4p,
			r = "<ROption";
		
		me.FFr/*updatePromptValues*/();
		
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "s1;s2", "b");
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "smw;smh;pgs", "i");
		r += "><script>";
		r += "<![CDATA[" + Base64.encode(me.s3/*scriptcontent*/) + "]]>";
		r += "</script>";
		r += "<prompt>";
		r += "<![CDATA[" + Base64.encode(me.s4/*rprompt*/) + "]]>";
		r += "</prompt>";
		r += "<promptvalues>";
		if (me.s4p/*rpromptvalues*/ && me.s4p/*rpromptvalues*/.length > 0)
		{
			s4p = me.s4p/*rpromptvalues*/;
			for (i=0; i < s4p.length; i++)
			{
				r += "<prompt name='" + s4p[i].name + "'>";
				r += "<value><![CDATA[" + s4p[i].value + "]]></value>";
				r += "</prompt>";
			}
		}
		r += "</promptvalues>";
		r += "</ROption>";
		return r;
	},
	
	FFr/*updatePromptValues*/: function() {
		var me = this,
			controls = me.s4c/*rpromptcontrols*/,
			values = [], // me.s4p/*rpromptvalues*/,
			ctltype,
			ctrl,
			r = true,
			items = controls ? controls.items : null,
			item;
			
		if (items && items.length)
		{
			controls.error = null;
			
			for (i=0; i < items.length; i++)
			{
				item = items[i],
				ctltype = item.type;
				ctrl = item.ctrl;
				
				switch (ctltype.toLowerCase())
				{
				case "combobox":
					item.value = $("option:selected", ctrl).val();
					break;
				case "textinput":
					item.value = ctrl.val();
					break;
				}
				
				values.push({
					name: item.name,
					value: item.value
				});
			}
		}
		
		me.s4p/*rpromptvalues*/ = values;
		
		return r;
	}
}

IG$/*mainapp*/._IEdP/*clPyahonOption*/ = function(node) {
    var me = this;
    
    if (node)
	{
		snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "script");
		if (snode)
		{
			script = IG$/*mainapp*/._I24/*getTextContent*/(snode);
			if (script)
			{
				me.s3/*scriptcontent*/ = Base64.decode(script);
			}
		}
	}
}

IG$/*mainapp*/._IEdP/*clPyahonOption*/.prototype = {
    TX/*getXML*/: function() {
        var me = this,
            r =["<python>"];
        
        r.push("<script>");
		r.push("<![CDATA[" + Base64.encode(me.s3/*scriptcontent*/ || "") + "]]>");
		r.push("</script>");
        
        r.push("</python>");
        
        return r.join("");
    }
}

IG$/*mainapp*/._IEe/*clReports*/ = function(xdoc) {
	var me = this;
	me.reports = [];
	me.sheets = [];
	
	me.__cs = [];

	me.__pca = IG$/*mainapp*/.__pca;
	
	me.PC(xdoc);
}

IG$/*mainapp*/._IEe/*clReports*/.prototype = {
	PC: function(xdoc) {
		var me = this,
			banode,
			cnode,
			cnodes,
			enode,
			ctrl,
			i, j,
			_lmap = {},
			sql_prompts,
			item,
			layoutinfo,
			sheet,
			sj,
			_nm = "/smsg/item",
			T0, T1;
		
		me.sheets = [];
		me.reports = [];
		me.__cs = T0 = {
			m: {},
			l: []
		};
		me.b_sc_load = "F";
		me.ploader = 1;
		me.phideloader = 1;
		
		me.itemtype = "Report";
		layoutinfo = me.layoutinfo = {
			type: "mondrian",
			draggable: false,
			objtype: "_dc",
			_direction: 0, // 0 horizontal, 1 vertical
			width: null,
			height: null,
			children: []
		};
		me.ctrls = {};
		me.sql_prompts = [];
		
		if (xdoc)
		{
			banode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm);
			IG$/*mainapp*/._I1f/*XGetInfo*/(me, banode, "type;nodepath;uid;name");
			me.itemtype = me.type;
			
			cnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/objinfo");

			if (cnode)
			{
				me.reportversion = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, "version");
			}
			
			cnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/sel_cube");
			
			if (cnode)
			{
				T0.d = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, "default");
				
				cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(cnode);
				
				for (i=0; i < cnodes.length; i++)
				{
					p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[i]);
					
					if (!T0.m[p.uid])
					{
						T0.m[p.uid] = p;
						T0.l.push(p);
					}
				}
				
				if (!T0.d && T0.l.length)
				{
					T0.d = T0.l[0].uid;
				}
			}
			
			if (me.cubeuid && !T0.m[me.cubeuid])
			{
				p = {
					uid: me.cubeuid,
					name: me.cubeuid
				};
				T0.m[me.cubeuid] = p;
				T0.l.push(p);
			}

			cnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/sql_prompts");
			
			if (cnode)
			{
				cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(cnode);
				
				for (i=0; i < cnodes.length; i++)
				{
					T1 = cnodes[i];
					me.sql_prompts.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(T1, "name"),
						value: IG$/*mainapp*/._I24/*getTextContent*/(T1),
						defaultValue: IG$/*mainapp*/._I24/*getTextContent*/(T1)
					});
				}
			}
						
			cnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/Pivot");
			if (cnode)
			{
				me.b_sc_load = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, "b_sc_load") || "F";
				me.ploader = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, "ploader") == "F" ? 0 : 1;
				me.phideloader = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, "phideloader") == "F" ? 0 : 1;
			
				cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(cnode);
				
				for (i=0; i < cnodes.length; i++)
				{
					if (IG$/*mainapp*/._I29/*XGetNodeName*/(cnodes[i]) == "Sheet")
					{
						var sheet = new IG$/*mainapp*/._IEf/*clReport*/(cnodes[i], me.itemtype, false);
						sql_prompts = sheet.sql_prompts = [];
						
						for (j=0; j < me.sql_prompts.length; j++)
						{
							sj = me.sql_prompts[j];
							
							sql_prompts.push({
								name: sj.name,
								values: [
									{
										code: sj.value,
										text: sj.value
									}
								]
							});
						}
						me.sheets.push(sheet);
						
						if (sheet.cubeuid && !T0.m[sheet.cubeuid])
						{
							p = {
								uid: sheet.cubeuid,
								name: sheet.cubeuid
							};
							T0.m[sheet.cubeuid] = p;
							T0.l.push(p);
						}
					}
				}
			}
			
			enode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/ExportOption");
			me.exportOption = new IG$/*mainapp*/._IE6/*clExport*/(enode);
			
			enode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/LayoutInfo");
			
			if (enode)
			{
				var linfo = IG$/*mainapp*/._I24/*getTextContent*/(enode),
					layout = linfo.split("|"),
					layout_root,
					linfo = [],
					l, ls, lname, lvalue;
				
				layoutinfo.type = IG$/*mainapp*/._I1b/*XGetAttr*/(enode, "type") || "dock";
			
				for (i=0; i < layout.length; i++)
				{
					if (layout[i])
					{
						l = layout[i].split(",");
						ls = {};
						for (j=0; j < l.length; j++)
						{
							lname = l[j].substring(0, l[j].indexOf("="));
							lvalue = l[j].substring(l[j].indexOf("=") + 1);
							ls[lname] = lvalue;
						}
						ls.objtype = ls.objtype || "PANEL";
						linfo.push(ls);
					}
				}
				
				layoutinfo.items = linfo;
				
				if (layoutinfo.type == "dock")
				{
					layoutinfo.type = "bubble";
					layoutinfo.layout = {
						isroot: true,
						item: null
					};
					
					var items = layoutinfo.items,
						ds = [],
						m,
						rmap = {};
					
					for (i=0; i < items.length; i++)
					{
						item = items[i];
						item.top = item.top || [];
						item.left = item.left || [];
						item.right = item.right || [];
						item.bottom = item.bottom || [];
						item.inner = item.inner || [];
				
						if (!item.r)
						{
							ds.push(item);
						}
				
						if (item.r)
						{
							m = rmap[item.r];
							
							if (!m)
							{
								m = rmap[item.r] = [];
							}
							
							m.push(item);
						}
					}
					
					me.tr1/*transferLayoutInfo*/(ds, layoutinfo.layout, rmap, true);
				}
				else if (layoutinfo.type == "mondrian")
				{
					me.savelayoutinfo = layoutinfo;
					
					var rmap = {},
						k, pobj,
					
					layoutinfo = layout_root = me.layoutinfo = {
						type: "mondrian",
						objtype: "_dc",
						children: [],
						_direction: 0,
						width: null,
						height: null
					};
					
					for (i=0; i < linfo.length; i++)
					{
						item = linfo[i];
						if (!item.r && !layout_root.docid)
						{
							layout_root.docid = item.docid;
							layout_root._direction = parseInt(item.d) || 0;
							layout_root.width = Number(item.width);
							layout_root.height = Number(item.height);
							
							rmap[layout_root.docid] = layout_root;
						}
						else
						{
							rmap[item.docid] = {
								docid: item.docid,
								width: Number(item.width),
								height: Number(item.height),
								objtype: item.objtype,
								_r: item.r,
								children: [],
								_direction: parseInt(item.d)
							};
						}
					}
					
					for (i=0; i < linfo.length; i++)
					{
						item = rmap[linfo[i].docid];
						
						if (item && item._r && rmap[item._r])
						{
							pobj = rmap[item._r];
							pobj.children.push(item);
							item.parent = pobj;
						}
					}
				}
				else
				{
					me.savelayoutinfo = layoutinfo;
					
					layoutinfo.layout = {
						isroot: true,
						item: null
					};
					
					var items = layoutinfo.items,
						rmap = {},
						rootitem,
						pds;
					
					for (i=0; i < items.length; i++)
					{
						item = items[i];
						item.mm = {
							left: item.left,
							top: item.top,
							bottom: item.bottom,
							right: item.right,
							inner: item.inner
						};
						
						item.left = [];
						item.right = [];
						item.bottom = [];
						item.top = [];
						item.inner = [];
						
						rmap[item.docid] = item;
					}
					
					for (i=0; i < items.length; i++)
					{
						pds = items[i];
						
						$.each(["top", "left", "right", "bottom", "inner"], function(t, tp) {
							pds[tp] = pds[tp] || [];
							var pkey = pds.mm[tp],
								k,
								pnode;
							pkey = (pkey ? pkey.split(";") : []);
							for (k=0; k < pkey.length; k++)
							{
								if (pkey[k] && rmap[pkey[k]])
								{
									pnode = rmap[pkey[k]];
									pnode._cr = true;
									if (!pnode.parent)
									{
										pnode.parent = {
											loc: tp,
											node: pds
										};
									
										pds[tp].push(pnode);
									}
								}
							}
						});
					}
					
					for (i=0; i < items.length; i++)
					{
						item = items[i];
						if (item._cr != true)
						{
							item.parent = {
								isroot: true
							};
							layoutinfo.layout.item = item;
							break;
						}
					}
				}
			}
			
			enode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/Controls");
		
			if (enode)
			{
				cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(enode);
				
				for (i=0; i < cnodes.length; i++)
				{
					ctrl = new IG$/*mainapp*/._IFc/*sheetfiltercomp*/(cnodes[i]);
					me.ctrls[ctrl.docid] = ctrl;
				}
				
				if (me.sheets)
				{
					for (i=0; i < me.sheets.length; i++)
					{
						sheet = me.sheets[i];
						var docid = sheet.layoutinfo.docid,
							ctrl = me.ctrls[docid];
						
						if (ctrl)
						{
							ctrl.fw/*fixedwidth*/ = sheet.fw/*fixedwidth*/;
							ctrl.fh/*fixedheight*/ = sheet.fh/*fixedheight*/;
							ctrl.hidetitle = sheet.hidetitle;
						}
					}
				}
			}
		}
	},
	
	tr1/*transferLayoutInfo*/: function(items, layout, rmap, isroot, upanel, pp, _lpds) {
		var me = this,
			i,
			order = {
				north: 0,
				west: 1,
				east: 2,
				south: 3
			},
			pds,
			mpds,
			ppds,
			n = 0,
			dm,
			m,
			vlayout,
			lpds;
				
		items.sort(function(a, b) {
			var as = order[a.p],
				bs = order[b.p];
				
			return as - bs;
		});
		
		if (!isroot)
		{
			pds = layout;
			pds.top = pds && pds.top || [];
			pds.left = pds && pds.left || [];
			pds.right = pds && pds.right || [];
			pds.bottom = pds && pds.bottom || [];
			pds.inner = pds && pds.inner || [];
		}
		
		ppds = null;
		
		if (upanel)
		{
			pds = layout;
			
			if (items.length > 0)
			{
				items[0].p = pp;
				ppds = _lpds;
			}
		}
		
		for (i=0; i < items.length; i++)
		{
			vlayout = items[i];
			
			lpds = ppds;
			
			if (items[i].objtype == "PANEL")
			{
				vlayout = mpds || pds || (isroot && layout.item ? layout.item : vlayout);

				ppds = null;
			}
			else if (n == 0 && isroot)
			{
				layout.item = items[i];
				pds = items[i];
				pds.parent = {
					isroot: true
				};
				
				ppds = pds.p;
				mpds = pds;
				n++;
			}
			else
			{
				mpds = items[i];
				
				if (!ppds)
				{
					items[i].parent = {
						loc: "top",
						node: pds
					};
					pds.top.push(items[i]);
					ppds = "north";
				}
				else
				{
					switch (items[i].p)
					{
					case "north":
						items[i].parent = {
							loc: "top",
							node: pds
						};
						pds.top.push(items[i]);
						break;
					case "east":
						items[i].parent = {
							loc: "bottom",
							node: pds
						};
						pds.bottom.push(items[i]);
						break;
					case "west":
						items[i].parent = {
							loc: "bottom",
							node: pds
						};
						pds.bottom.push(items[i]);
						break;
					case "south":
						items[i].parent = {
							loc: "bottom",
							node: pds
						};
						pds.bottom.push(items[i]);
						pds = items[i];
						break;
					}
					
					ppds = items[i].p;
				}
				
				n++;
			}
			
			if (rmap[items[i].docid])
			{
				dm = rmap[items[i].docid];
				me.tr1/*transferLayoutInfo*/(dm, vlayout, rmap, false, items[i].objtype == "PANEL" ? true : false, items[i].p, lpds);
			}
		}
	},

	_IJ1/*getCurrentPivot*/: function() {
		var i, j,
			r,
			nr,
			sheet,
			ctrlname,
			ctrl,
			me = this,
			rptitem,
			chartPivot,
			cco/*chartOption*/,
			itemstyle,
			sql_prompts,
			Xsf/*sheetformula*/,
			dff1/*drillitems*/,
			sortoption,
			dashboardfilter,
			_dfilter,
			_dff,
			_dfs,
			gfilter,
			exportOption = me.exportOption,
			pivotxml = ["<smsg><item uid='" + me.uid 
					 + "' name='" + IG$/*mainapp*/._I48/*escapeXMLString*/(me.name) 
					 + "' nodepath='" + IG$/*mainapp*/._I48/*escapeXMLString*/(me.nodepath) 
					 + "' type='" + me.itemtype + "'>"],
					 
			T0 = me.__cs,
			__ap;
			
		__ap = function(val) {
			pivotxml.push(val);
		};
		
		__ap("<objinfo version='1.2'/>");
		
		__ap("<sel_cube default='" + (T0.d || "") + "'>");
		
		for (r=0; r < T0.l.length; r++)
		{
			__ap("<item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(T0.l[r], "uid;name;type;nodepath;requirepwd;pool;pooluid", "s") + "/>");
		}
		
		__ap("</sel_cube>");
				 
		__ap("<Pivot b_sc_load='" + (me.b_sc_load || "F") + "' ploader='" + (me.ploader ? "T" : "F") + "' phideloader='" + (me.phideloader ? "T" : "F") + "'>");
	
		for (r=0; r < me.sheets.length; r++)
		{
			sheet = me.sheets[r];
			
			sheet.columnfix = sheet.columnfix || "F";
			sheet.customfixcols = sheet.customfixcols || 0;
			sheet.usepaging = sheet.usepaging || "F";
			sheet.rowperpage = sheet.rowperpage || 20;
			sheet.pagestyle = sheet.pagestyle || "normal";
			sheet.measureformat = sheet.measureformat || "";
			sheet.measureformatname = sheet.measureformatname || "";
			
			__ap(sheet._IJ1/*getCurrentPivot*/.call(sheet, me));
		}
		
		__ap("</Pivot>");
		
		__ap("<LayoutInfo type='mondrian'><![CDATA[" + (me.savelayoutinfo || "") + "]]></LayoutInfo>");
		__ap("<Controls>");
		for (ctrlname in me.ctrls)
		{
			ctrl = me.ctrls[ctrlname];
			__ap(ctrl.l2/*getXML*/.call(ctrl));
		}
		__ap("</Controls>");
		
		_dfilter = me._dfilter;
		
		if (_dfilter)
		{
			__ap("<dfilter>");
			_dff = _dfilter.filter;
			if (_dff)
			{
				__ap("<Filter>");
				_dfs = _dff.subGroups;
				if (_dfs && _dfs.length > 0)
				{
					for (i=0; i < _dfs.length; i++)
					{
						__ap(_dfs[i].TX/*getXML*/());
					}
				}
				__ap("</Filter>");
			}
			
			_dff = _dfilter.hfilter;
			if (_dff)
			{
				__ap("<HavingFilter>");
				_dfs = _dff.subGroups;
				if (_dfs && _dfs.length > 0)
				{
					for (i=0; i < _dfs.length; i++)
					{
						__ap(_dfs[i].TX/*getXML*/());
					}
				}
				__ap("</HavingFilter>");
			}
			
			_dff = _dfilter.params;
			if (_dff)
			{
				__ap("<params>");
				for (i=0; i < _dff.length; i++)
				{
					__ap("<param name='" + _dff[i].name + "'><value><![CDATA[" + _dff[i].value + "]]></value></param>");
				}
				__ap("</params>");
			}
			__ap("</dfilter>");
		}
		
		if (exportOption)
		{
			__ap(exportOption.TX/*getXML*/());
		}
		__ap("</item></smsg>");
		
		return pivotxml.join("");
	}
}

IG$/*mainapp*/._IEf/*clReport*/ = function(node, itemtype) {
	var banode,
		pivot,
		cnodes,
		cnode,
		i,
		me = this;
		
	me.itemtype = itemtype;
	me._IL9/*auxfilter*/ = {};
	me.objtype = "SHEET";
	me.layoutinfo = {};
	
	me.__pca = IG$/*mainapp*/.__pca;
	
	me.c$a/*parseReport*/(node);
}

IG$/*mainapp*/._IEf/*clReport*/.prototype = {
	needPrompt: function() {
		var me = this,
			prompts = [],
			i, _dff, _dfs;
			
		me.checkPrompt(me.filter, prompts);
		
		_dff = me.sql_prompts;
		if (_dff && _dff.length > 0)
		{
			for (i=0; i < _dff.length; i++)
			{
				prompts.push(_dff[i]);
			}
		}
		
		_dff = me.sqloption;
		_dfs = _dff ? _dff.prompts : null;
		if (_dfs && _dfs.length > 0)
		{
			for (i=0; i < _dfs.length; i++)
			{
				prompts.push(_dfs[i]);
			}
		}
		
		return prompts;
	},
	
	g1/*getItem*/: function(idx, pos) {
		var me = this,
			m,
			i, dp;
		
		switch(pos)
		{
		case 1:
			dp = me.rows;
			break;
		case 2:
			dp = me.cols;
			break;
		case 3:
			dp = me.measures;
			break;
		}
		
		if (dp && dp[idx])
		{
			m = dp[idx];
		}
		
		return m;
	},

	checkPrompt: function(filter, prompts) {
		var me = this,
			r = false,
			i,
			_dfs = filter ? filter.subConditions : null,
			_dfg = filter ? filter.subGroups : null;
			
		if (_dfs && _dfs.length > 0)
		{
			for (i=0; i < _dfs.length; i++)
			{
				if (_dfs[i]._d7/*isprompt*/)
				{
					prompts.push(_dfs[i]);
				}
			}
		}
		
		if (_dfg && _dfg.length > 0)
		{
			for (i=0; i < _dfg.length; i++)
			{
				me.checkPrompt(_dfg[i], prompts);
			}
		}
		
		return r;
	},
	
	_IJ1/*getCurrentPivot*/: function(me) {
		var pivotxml,
			sheet = this,
			i, nr,
			_dff, _dfs,
			rptitem,
			chartPivot,
			cco/*chartOption*/,
			sql_prompts,
			gfilter,
			itemstyle,
			Xsf/*sheetformula*/,
			dff1/*drillitems*/,
			sortoption,
			dashboardfilter,
			__ap;
		
		pivotxml = [
			"<Sheet " + IG$/*mainapp*/._I20/*XUpdateInfo*/(sheet, me.__pca[0], "b")
			+ IG$/*mainapp*/._I20/*XUpdateInfo*/(sheet, me.__pca[1], "s")
			+ IG$/*mainapp*/._I20/*XUpdateInfo*/(sheet, me.__pca[2], "i")
			+ ">" + "<name><![CDATA[" + (sheet.name || "") + "]]></name>"
			+ "<Pivot "
			+ IG$/*mainapp*/._I20/*XUpdateInfo*/(sheet, me.__pca[3], "s")
			+ IG$/*mainapp*/._I20/*XUpdateInfo*/(sheet, me.__pca[4], "i")
			+ IG$/*mainapp*/._I20/*XUpdateInfo*/(sheet, me.__pca[5], "b")
			+ ">"];
			
		__ap = function(val) {
			pivotxml.push(val);
		};
		
		$.each([
			{
				a: "RowDimensions",
				b: sheet.rows
			},
			{
				a: "ColumnDimensions",
				b: sheet.cols
			},
			{
				a: "Measures",
				b: sheet.measures
			},
			{
				a: "QueryItems",
				b: sheet.queryItems
			},
			{
				a: "Clusters",
				b: sheet.clusters
			}
		], function(n, m) {
			var i;
			__ap("<" + m.a + ">");
			for (i=0; i < m.b.length; i++)
			{
				__ap(m.b[i].C_1/*getItemXML*/());
			}
			__ap("</" + m.a + ">");
		});
		
		if (sheet.c1)
		{
			__ap("<c1>" + sheet.c1.C_1/*getItemXML*/() + "</c1>");
		}
		
		__ap("<rptitems>");
		for (nr=0; nr < sheet.rptitems.length; nr++)
		{
			rptitem = sheet.rptitems[nr];
			__ap("<rptitem" + IG$/*mainapp*/._I20/*XUpdateInfo*/(rptitem, "name;measureposition;measuretitle", "s") + ">");
			
			$.each([
				{
					a: "rows",
					b: rptitem.rows
				},
				{
					a: "columns",
					b: rptitem.cols
				},
				{
					a: "measures",
					b: rptitem.measures
				}
			], function(n, m) {
				var j;
				if (m.b && m.b.length)
				{
					__ap("<" + m.a + ">");
					for (j=0; j < m.b.length; j++)
					{
						__ap(m.b[j].C_1/*getItemXML*/());
					}
					__ap("</" + m.a + ">");
				}
			});
			
			if (rptitem.c1)
			{
				__ap("<c1>" + rptitem.c1.C_1/*getItemXML*/() + "</c1>");
			}
			
			if (rptitem.ext_title)
			{
				__ap("<ext_title><![CDATA[" + rptitem.ext_title + "]]></ext_title>");
			}
			
			if (rptitem.filter)
			{
				__ap("<Filter>");
				_dff = rptitem.filter;
				_dfs = _dff ? _dff.subGroups : null;
				if (_dfs && _dfs.length > 0)
				{
					for (i=0; i < _dfs.length; i++)
					{
						__ap(_dfs[i].TX/*getXML*/());
					}
				}
				__ap("</Filter>");
			}
			
			if (rptitem.havingfilter)
			{
				__ap("<HavingFilter>");
				_dff = rptitem.havingfilter;
				_dfs = _dff ? _dff.subGroups : null;
				if (_dfs && _dfs.length > 0)
				{
					for (i=0; i < _dfs.length; i++)
					{
						__ap(_dfs[i].TX/*getXML*/());
					}
				}
				__ap("</HavingFilter>");
			}
			
			__ap("</rptitem>");
		}
		__ap("</rptitems></Pivot><UserDefinedGroup/>");
		
		chartPivot = sheet.chartPivot;
		cco/*chartOption*/ = sheet.cco/*chartOption*/;
		
		
		if (sheet.sqloption)
		{
			__ap("<ExecuteSQL dbpool='" + (sheet.sqloption.dbpool || "") + "'"
				+ " querytool='F'"
				+ "><SQL><![CDATA["
				+ (sheet.sqloption.sql || "")
				+ "]]></SQL>");
			
			if (sheet.sqloption.columns)
			{
				__ap("<columns>" + IG$/*mainapp*/._I4e/*ColumnsToString*/(sheet.sqloption.columns, "item") + "</columns>");
			}
			
			if (sheet.sqloption.prompts)
			{
				__ap("<prompts>");
				for (i=0; i < sheet.sqloption.prompts.length; i++)
				{
					__ap(sheet.sqloption.prompts[i].L1/*getXML*/());
				}
				__ap("</prompts>");
			}
					 
			
	  		__ap("</ExecuteSQL>");
		}
		
		sql_prompts = sheet.sql_prompts;
		
		if (sql_prompts || (window._report_prompt && window._report_prompt.length))
		{
			__ap("<sql_prompts>");
			if (sql_prompts && sql_prompts.length)
			{
				for (i=0; i < sql_prompts.length; i++)
				{
					__ap("<prompt name='" + sql_prompts[i].name + "'><values>");
					for (j=0; j < sql_prompts[i].values.length ;j++)
					{
						__ap("<value><code><![CDATA[" + (sql_prompts[i].values[j].code || "") + "]]></code>"
							+ "<text><![CDATA[" + (sql_prompts[i].values[j].text || "") + "]]></text>"
							+ "</value>");
					}
					__ap("</values></prompt>");
				}
			}
			if (window._report_prompt && window._report_prompt.length)
			{
				for (i=0; i < window._report_prompt.length; i++)
				{
					if (window._report_prompt[i].name && window._report_prompt[i].values)
					{
						__ap("<prompt name='" + window._report_prompt[i].name + "'><values>");
						for (j=0; j < window._report_prompt[i].values.length ;j++)
						{
							__ap("<value><code><![CDATA[" + (window._report_prompt[i].values[j].code || "") + "]]></code>"
								+ "<text><![CDATA[" + (window._report_prompt[i].values[j].text || "") + "]]></text>"
								+ "</value>");
						}
						__ap("</values></prompt>");
					}
				}
			}
			__ap("</sql_prompts>");
		}
					
		__ap("<Filter>");
		_dff = sheet.filter;
		_dfs = _dff ? _dff.subGroups : null;
		if (_dfs && _dfs.length > 0)
		{
			for (i=0; i < _dfs.length; i++)
			{
				__ap(_dfs[i].TX/*getXML*/());
			}
		}

		__ap("</Filter>");
		
		__ap("<HavingFilter>");
		_dff = sheet.havingfilter;
		_dfs = _dff ? _dff.subGroups : null;
		if (_dfs && _dfs.length > 0)
		{
			for (i=0; i < _dfs.length; i++)
			{
				__ap(_dfs[i].TX/*getXML*/());
			}
		}
		__ap("</HavingFilter>");
		
		if (sheet._IL9/*auxfilter*/)
		{
			__ap("<AuxFilter>");
			for (var key in sheet._IL9/*auxfilter*/)
			{
				__ap(sheet._IL9/*auxfilter*/[key]);
			}
			__ap("</AuxFilter>");
		}
		
		if (sheet.mdf)
		{
			__ap("<gridfilter>");
			for (var key in sheet.mdf)
			{
				gfilter = sheet.mdf[key];
				if (gfilter && gfilter.op)
				{
					__ap("<c i='" + key + "' op='" + gfilter.op + "'><v1><![CDATA[" + (gfilter.val1 || "") + "]]></v1><v2><![CDATA[" + (gfilter.val2 || "") + "]]></v2></c>");
				}
			}
			__ap("</gridfilter>");
		}
		
		__ap("<MeasureOption><measureformat><![CDATA[" + Base64.encode(sheet.measureformat || "") + "]]></measureformat>");
		__ap("<measureformatname><![CDATA[" + Base64.encode(sheet.measureformatname || "") + "]]></measureformatname>");
		__ap("</MeasureOption>");
		
		__ap("<Style><item>");
		itemstyle = sheet.itemstyle;
		if (itemstyle)
		{
			for (i=0; i < itemstyle.length; i++)
			{
				__ap(itemstyle[i].tx/*getXML*/());
			}
		}
		__ap("</item></Style>");
		__ap("<SheetFormula>");
		Xsf/*sheetformula*/ = sheet.Xsf/*sheetformula*/;
		if (Xsf/*sheetformula*/)
		{
			for (i=0; i < Xsf/*sheetformula*/.length; i++)
			{
				__ap(Xsf/*sheetformula*/[i].TX/*getXML*/());
			}
		}
		__ap("</SheetFormula>");
		__ap("<DetailView>");
		dff1/*drillitems*/ = sheet.dff1/*drillitems*/;
		for (i=0; i < dff1/*drillitems*/.length; i++)
		{
			__ap("<view" + IG$/*mainapp*/._I20/*XUpdateInfo*/(dff1/*drillitems*/[i], "uid;name;nodepath;type;sheetindex;sheetname;titem;tparams", "s") + " showintab='" + (sheet.dff1/*drillitems*/[i].showintab ? "T" : "F") + "'></view>");
		}
		__ap("</DetailView><CellOption/>");
		__ap(cco/*chartOption*/.TX/*getXML*/());
		__ap(sheet.rro/*ROption*/.TX/*getXML*/());
        __ap(sheet.pro/*pythonOption*/.TX/*getXML*/());
		sortoption = sheet.sortoption;
		__ap("<SortOption"
			+ IG$/*mainapp*/._I20/*XUpdateInfo*/(sortoption, "showlastrank;sortbyvalue", "b")
			+ IG$/*mainapp*/._I20/*XUpdateInfo*/(sortoption, "sortcount", "i")
			+ IG$/*mainapp*/._I20/*XUpdateInfo*/(sortoption, "sortmethod;sortmeasure;sortorder;sortorder_type;sortorder_memo;sortpartition", "s")
			+ "/>");
		dashboardfilter = sheet.dashboardfilter;
		if (dashboardfilter && dashboardfilter.length > 0)
		{
			__ap("<DashboardFilter>");
			for (i=0; i < dashboardfilter.length; i++)
			{
				__ap(IG$/*mainapp*/._I25/*toXMLString*/(dashboardfilter[i]));
			}
			__ap("</DashboardFilter>");
		}
		__ap("<WebLayout");
		if (sheet.layoutinfo)
		{
			__ap(IG$/*mainapp*/._I20/*XUpdateInfo*/(sheet.layoutinfo, "headerposition;region;docid", "s"));
			__ap(IG$/*mainapp*/._I20/*XUpdateInfo*/(sheet.layoutinfo, "width;height", "i"));
			__ap(IG$/*mainapp*/._I20/*XUpdateInfo*/(sheet.layoutinfo, "collapsed", "b"));
		}
		__ap("></WebLayout><result uid='" + (sheet.resultuid || "") + "'/></Sheet>");
		
		return pivotxml.join("");
	},
	
	mL/*isdrill*/: function(dobj, renderer) {
		var me = this,
			r = 1,
			cl = renderer.cl,
			i, dp;
		
		if (dobj.titem && cl)
		{
			r = 0;
			
			switch(cl.position)
			{
			case 1:
				dp = me.rows;
				break;
			case 2:
				dp = me.cols;
				break;
			case 3:
				dp = me.measures;
				break;
			}
			
			if (dp && dp[cl.index] && dobj.titem.indexOf(dp[cl.index].uid) > -1)
			{
				r = 1;
			}
		}
		
		return r;
	},

	c$a/*parseReport*/: function(node) {
		var me = this,
			enode,
			opt,
			label, value, tnode, dview,
			layoutinfo,
			m_prt = {};
		
		me.enablepivot = true;
		me.customfix = "F";
		me.customfixcols = 0;
		me.rowperpage = 20;
		me.usepaging = "F";
		me.pagestyle = "normal";
		me.dataquerymode = "M_PIVOT";
		me.viewmode = "grid";
		me.viewchange = "T";
		me.toolbutton = "F";
		me.openload = true;
		me.autorefresh = false;
		me.refresh_timer = 60;
		me.edrill = false;
		me.syncrows = true;
		
		if (node)
		{
			me.columnfill = true;
			IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[0], "b");
			IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[1], "s");
			IG$/*mainapp*/._I1f/*XGetInfo*/(m_prt, node, me.__pca[2], "s");
			
			if (m_prt.viewchange)
			{
				me.tb_vch = m_prt.viewchange == "T";
			}
			
			if (m_prt.toolbutton)
			{
				me.tb_prt = m_prt.toolbutton == "T";
			}
			
			if (m_prt.gridprint)
			{
				me.tb_prt_grd = m_prt.gridprint == "T";
			}
			
			if (m_prt.exportbutton)
			{
				me.tb_prt_i = m_prt.exportbutton.toLowerCase();
			}
			
			me.cubeuid = IG$/*mainapp*/._I06/*formatUID*/(me.cubeuid);
			me.objtype = me.objtype || "SHEET";
			IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, "resultlimit;layoutmode", "i");
			
			me.name = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "name");
			
			pivot = IG$/*mainapp*/._I18/*XGetNode*/(node, "name");
			
			if (pivot)
			{
				me.name = IG$/*mainapp*/._I24/*getTextContent*/(pivot);
			}
			
			pivot = IG$/*mainapp*/._I18/*XGetNode*/(node, "Pivot");
			
			if (pivot)
			{
				IG$/*mainapp*/._I1f/*XGetInfo*/(me, pivot, me.__pca[3], "s");
				IG$/*mainapp*/._I1f/*XGetInfo*/(me, pivot, me.__pca[4], "i");
				IG$/*mainapp*/._I1f/*XGetInfo*/(me, pivot, me.__pca[5], "b");
				
				if (me.dataquerymode == "T")
				{
					me.dataquerymode = "M_DATA";
				}
				else if (me.dataquerymode == "F")
				{
					me.dataquerymode = "M_PIVOT";
				}
			}
		}
		else
		{
			me.measurelocation = "column";
			me.measureposition = 0;
			me.isdistinct = false;
			me.fetchall = false;
			me.showlnum = false;
			me.hidemenu = false;
			me.measuretitle = "F";
			me.ext_title = null;
			
			me.openload = true;
			me.columnfill = true;
			me.viewchange = "T";
			me.toolbutton = "F";
		}
		
		me.rows = [];
		me.cols = [];
		me.measures = [];
		me.clusters = [];
		me.query = [];
		me.queryItems = [];
		me.rptitems = [];
		
		var i,
			j,
			snode,
			nodes,
			sf,
			tn, tns,
			rpt;
		
		if (node && pivot)
		{
			$.each([
				{
					a: "RowDimensions", 
					b: me.rows
				},
				{
					a: "ColumnDimensions",
					b: me.cols
				},
				{
					a: "Measures",
					b: me.measures
				},
				{
					a: "QueryItems",
					b: me.queryItems
				},
				{
					a: "Clusters",
					b: me.clusters
				}
			], function(n, m) {
				var snode = IG$/*mainapp*/._I18/*XGetNode*/(pivot, m.a),
					nodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode),
					item, i;
					
				for (i=0; i < nodes.length; i++)
				{
					item = new IG$/*mainapp*/._IE8/*clItems*/(nodes[i]);
					m.b.push(item);
				}
			});
			
			tn = IG$/*mainapp*/._I18/*XGetNode*/(pivot, "c1/item");
				
			if (tn)
			{
				me.c1 = new IG$/*mainapp*/._IE8/*clItems*/(tn, true);
			}
			
			snode = IG$/*mainapp*/._I18/*XGetNode*/(pivot, "rptitems");
			nodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
			for (i=0; i < nodes.length; i++)
			{
				rpt = {
					rows: [],
					measures: [],
					cols: []
				};
				
				me.rptitems.push(rpt);
				
				IG$/*mainapp*/._I1f/*XGetInfo*/(rpt, nodes[i], "name;measureposition;measuretitle", "s");
				
				$.each([
					{
						a: "columns",
						b: rpt.cols
					},
					{
						a: "measures",
						b: rpt.measures
					}
				], function(n, m) {
					var tn = IG$/*mainapp*/._I18/*XGetNode*/(nodes[i], m.a),
						tns, j,
						item;
					if (tn)
					{
						tns = IG$/*mainapp*/._I26/*getChildNodes*/(tn);
						for (j=0; j < tns.length; j++)
						{
							item = new IG$/*mainapp*/._IE8/*clItems*/(tns[j], true);
							m.b.push(item);
						}
					}
				});
				
				tn = IG$/*mainapp*/._I18/*XGetNode*/(nodes[i], "c1/item");
				
				if (tn)
				{
					rpt.c1 = new IG$/*mainapp*/._IE8/*clItems*/(tn, true);
				}
				
				tn = IG$/*mainapp*/._I18/*XGetNode*/(nodes[i], "ext_title");
				
				if (tn)
				{
					rpt.ext_title = IG$/*mainapp*/._I24/*getTextContent*/(tn);
				}
				
				rpt.filter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
				rpt.havingfilter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
				
				tnode = IG$/*mainapp*/._I18/*XGetNode*/(nodes[i], "Filter");
				me.p2/*parseFilter*/(tnode, rpt.filter);
				
				tnode = IG$/*mainapp*/._I18/*XGetNode*/(nodes[i], "HavingFilter");
				me.p2/*parseFilter*/(tnode, rpt.havingfilter);
			}
		}
		
		me.Xsf/*sheetformula*/ = [];
		me.si = 0;
		me.sortoption = {};
		me.dff1/*drillItems*/ = [];
		
		me.chartPivot = {clusters: [], rows: [], measures: []};
		
		me.filter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
		me.havingfilter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
		
		if (node)
		{
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "ChartOption");
			me.cco/*chartOption*/ = new IG$/*mainapp*/._IEc/*clChartOption*/(tnode);
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "ROption");
			me.rro/*ROption*/ = new IG$/*mainapp*/._IEd/*clROption*/(tnode);
            
            tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "python");
            me.pro/*pythonOption*/ = new IG$/*mainapp*/._IEdP/*clPyahonOption*/(tnode);
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "ChartPivot");
			
			if (tnode)
				me.p1/*parseChartPivot*/(tnode);
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Filter");
			me.p2/*parseFilter*/(tnode, me.filter);
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "HavingFilter");
			me.p2/*parseFilter*/(tnode, me.havingfilter);
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Style");
			me.p3/*parseStyle*/(tnode);
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "MeasureOption");
			if (tnode)
			{
				$.each(["measureformat", "measureformatname"], function(n, s) {
					var snode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, s);
					if (snode)
					{
						me[s] = IG$/*mainapp*/._I24/*getTextContent*/(snode);
						if (me[s])
						{
							me[s] = Base64.decode(me[s]);
						}
					}
				});				
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "SortOption");
			if (tnode)
			{
				me.sortoption = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
				me.sortoption.sortbyvalue = me.sortoption.sortbyvalue == "F" ? false : true;
				me.sortoption.showlastrank = me.sortoption.showlastrank == "T";
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "result");
			if (tnode)
			{
				me.resultuid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid");
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "SheetFormula");
			
			if (tnode)
			{
				nodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < nodes.length; i++)
				{
					sf = new IG$/*mainapp*/._IF0/*clSheetFormula*/(nodes[i]);
					if (sf.fid && sf.fid.indexOf("_") > -1)
					{
						me.si = Math.max(me.si, parseInt(sf.fid.substring(sf.fid.indexOf("_") + 1)) + 1);
					}
					else
					{
						sf.fid = "formula_" + me.si;
						me.si++;
					}
					me.Xsf/*sheetformula*/.push(sf);
				}
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "DetailView");
			
			if (tnode)
			{
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < snodes.length; i++)
				{
					dview = {};
					IG$/*mainapp*/._I1f/*XGetInfo*/(dview, snodes[i], "uid;name;nodepath;type;sheetindex;sheetname;showintab;titem;tparams", "s");
					dview.showintab = (dview.showintab == "T") ? true : false;
					me.dff1/*drillItems*/.push(dview);
				}
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "ExecuteSQL");
			
			if (tnode)
			{
				var snode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "SQL"),
					sc,
					sqloption;
				sqloption = me.sqloption = {};
				sqloption.dbpool = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbpool");
				sqloption.querytool = "T";
				if (snode)
				{
					sqloption.sql = IG$/*mainapp*/._I24/*getTextContent*/(snode);
				}
				snode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "columns");
				if (snode)
				{
					sc = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
					if (sc && sc.length > 0)
					{
						sqloption.columns = [];
						for (i=0; i < sc.length; i++)
						{
							var column = IG$/*mainapp*/._I4f/*parseColumn*/(sc[i]);
							sqloption.columns.push(column);
						}
					}
				}
				
				snode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "prompts");
				if (snode)
				{
					sc = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
					if (sc && sc.length > 0)
					{
						sqloption.prompts = [];
						for (i=0; i < sc.length; i++)
						{
							var prompt = new IG$/*mainapp*/._Ib4/*prompt*/(sc[i]);
							sqloption.prompts.push(prompt);
						}
					}
				}
			}
			
			layoutinfo = me.layoutinfo = {};
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "WebLayout");
			
			if (tnode)
			{
				IG$/*mainapp*/._I1f/*XGetInfo*/(layoutinfo, tnode, "headerposition;region;docid", "s");
				IG$/*mainapp*/._I1f/*XGetInfo*/(layoutinfo, tnode, "width;height", "i");
				IG$/*mainapp*/._I1f/*XGetInfo*/(layoutinfo, tnode, "collapsed", "b");
			}
		}
		else
		{
			me.cco/*chartOption*/ = new IG$/*mainapp*/._IEc/*clChartOption*/();
			me.rro/*ROption*/ = new IG$/*mainapp*/._IEd/*clROption*/();
            me.pro/*pythonOption*/ = new IG$/*mainapp*/._IEdP/*clPyahonOption*/();
		}
	},
	p3/*parseStyle*/: function(node) {
		var me = this,
			i,
			itemnode,
			child,
			st;
		
		me.itemstyle = [];
		
		if (node)
		{
			itemnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "item"); 
			child = IG$/*mainapp*/._I26/*getChildNodes*/(itemnode);
			
			for (i=0; i < child.length; i++)
			{
				st = new IG$/*mainapp*/._IF7/*clReportStyle*/(child[i]);
				me.itemstyle.push(st);
			}
		}
	},
	p1/*parseChartPivot*/: function(node) {
		var me = this,
			i,
			tnode, child,
			item,
			chartPivot = me.chartPivot;
		
		$.each([
			{
				a: "ClusterDimensions",
				b: chartPivot.clusters
			},
			{
				a: "RowDimensions",
				b: chartPivot.rows
			},
			{
				a: "Measures",
				b: chartPivot.measures
			}
		], function(n, m) {
			var tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, m.a),
				i, item;
			if (tnode)
			{
				child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < child.length; i++)
				{
					item = new IG$/*mainapp*/._IE8/*clItems*/(child[i]);
					m.b.push(item);
				}
			}
		});
	},
	p2/*parseFilter*/: function(node, filter) {
		var me = this;
		
		if (node)
		{
			var fglist = IG$/*mainapp*/._I26/*getChildNodes*/(node, "FilterGroup"),
				i;
	
			if (fglist && fglist.length > 0)
			{
				for (i=0; i < fglist.length; i++)
				{
					var tgroup = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
					tgroup.name = IG$/*mainapp*/._I1b/*XGetAttr*/(fglist[i], "name"); 
					filter.subGroups.push(tgroup);
					me.parseSubFilter(fglist[i], tgroup);
				}
			}
		}
	},
	parseSubFilter: function(fgnode, ugroup) {
		var i, j,
			group,
			sfg,
			me = this;
		
		sfg = IG$/*mainapp*/._I26/*getChildNodes*/(fgnode);
		
		if (sfg && sfg.length > 0)
		{
			for (j=0; j < sfg.length; j++)
			{
				if (IG$/*mainapp*/._I29/*XGetNodeName*/(sfg[j]) == "FilterGroup")
				{
					var group = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
					group.name = IG$/*mainapp*/._I1b/*XGetAttr*/(sfg[j], "name"); 
					me.parseSubFilter(sfg[j], group);
					ugroup.subGroups.push(group);
				}
				else
				{
					ugroup.subConditions.push(new IG$/*mainapp*/._IE9/*clFilter*/(sfg[j]));
				}
			}
		}
	},
	
	Uc/*checkCubeAvailable*/: function(cubeuid) {
		var me = this,
			r = 1,
			n = me.rows.length + me.cols.length + me.measures.length + me.clusters.length;
		
		if (n > 0)
		{
			r = (me.cubeuid == cubeuid); 
		}
		
		return r;
	}
};

IG$/*mainapp*/._IF0/*clSheetFormula*/ = function(node) {
	var me = this,
		tnode,
		expr;
	
	me.__pca = [
		"baseuid;direction;stylename;title;type;fid;showtoprow;groupresults",
		"separatecolumn;subtotalbase;usecolumnformat"
	];
	
	if (node)
	{
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[0], "s");
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[1], "b");
		
		IG$/*mainapp*/._I1fx/*XGetInfo*/(me, node, "formatstring");
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Expression");
		
		if (tnode)
		{
			expr = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			$.each(expr, function(k, o) {
				me[k] = o;
			});
			me.expression = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
		}
	}
}

IG$/*mainapp*/._IF0/*clSheetFormula*/.prototype = {
	TX/*getXML*/: function() {
		var me = this,
			r, props;
		
		props = me.g1/*getProperties*/();
		
		r = "<Formula"
		  + IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[0], "s")
		  + IG$/*mainapp*/._I20/*XUpdateInfo*/(me, me.__pca[1], "b")
		  + "><Expression";
		
		if (props)
		{
			$.each(props, function(k, o) {
				if (me[o.name])
				{
					r += " " + o.name + "='" + me[o.name] + "'";
				}
			});
		}
		  
		r += "><![CDATA[" + (me.expression ? me.expression : "") + "]]></Expression>"
		  + (me.formatstring ? "<formatstring><![CDATA[" + (me.formatstring) + "]]></formatstring>" : "")
		  + "</Formula>";
		
		return r;
	},
	p1/*getRecord*/: function(rec) {
		var me = this,
			__pca = me.__pca,
			row,
			i, j,
			props;
		
		for (i=0; i < __pca.length; i++)
		{
			row = __pca[i].split(";");
			
			for (j=0; j < row.length; j++)
			{
				me[row[j]] = rec.get(row[j]);
			}
		}
		
		me.expression = rec.get("expression");
		me.formatstring = rec.get("formatstring");
		
		props = me.g1/*getProperties*/();
		
		if (props)
		{
			$.each(props, function(k, o) {
				me[o.name] = rec.get(o.name);
			});
		}
	},
	
	g1/*getProperties*/: function() {
		var me = this,
			fm = IG$/*mainapp*/._IEFc/*formulas*/,
			props;
		
		$.each(fm, function(k, t) {
			if (t.expr == me.expression)
			{
				props = t.params;
				
				return false;
			}
		});
		
		return props;
	}
}

IG$/*mainapp*/._IF1/*clSheetResult*/ = function(xdoc, maxrowcount) {
	var me = this,
		i, j,
		node = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Sheet");
	
	me.rows = parseInt(IG$/*mainapp*/._I1b/*XGetAttr*/(node, "rowcount"));
	me.cols = parseInt(IG$/*mainapp*/._I1b/*XGetAttr*/(node, "columncount"));
	me.srow = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "startrow");
	me.srow = (me.srow) ? parseInt(me.srow) : 0;
	me.colfix = 0;
	me.rowfix = 0;
	me.delim = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "delimiter");
	
	me.merge = [];
	me.styles = {};
	
	me.header = [];
	me.data = [];
	
	var tnode,
		tchild,
		c,
		tvalue;
	
	tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Header");
	if (tnode)
	{
		tchild = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
		for (i=0; i < tchild.length; i++)
		{
			c = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tchild[i]);
			me.header.push(c);
		}
	}
	
	tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Data");
	if (tnode)
	{
		tvalue = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
	}
	else
	{
		tvalue = IG$/*mainapp*/._I24/*getTextContent*/(node);
	}
	
	var tarr = tvalue.split(me.delim),
		trow = [],
		nrow = 0,
		ncol = 0;
	
	for (i=0; i < tarr.length; i++)
	{
		var tdata = {text:tarr[i], mrow:nrow, mcol:ncol, merged:0, stylename:null, chart:null};
		trow.push(tdata);
		
		ncol++;
		
		if (i > 0 && ncol == me.cols)
		{
			if (nrow == 0 && me.header.length == 0)
			{
				for (j=0; j < trow.length; j++)
				{
					c = {fieldid: "column_" + j, name: trow[j].text, type: "string"};
					me.header.push(c);
				}
			}
			else
			{
				me.data.push(trow);
			}
			trow = [];
			ncol = 0;
			nrow++;
			
			if (maxrowcount && nrow > maxrowcount)
			{
				break;
			}
		}
	}
}

IG$/*mainapp*/._IF2/*clResults*/ = function(xdoc, tnode) {
	var me = this,
		node = tnode || IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/results"),
		nodes,
		snode,
		result,
		i;
	
	me.results = [];
	
	me.r_stat = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/r_results");
	
	me._IL8/*jobid*/ = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "jobid");
	nodes = IG$/*mainapp*/._I26/*getChildNodes*/(node);
	
	for (i=0; i < nodes.length; i++)
	{
		snode = nodes[i];
		result = new IG$/*mainapp*/._IF4/*clResult*/(snode);
		me.results.push(result);
	}
}

IG$/*mainapp*/._IF3/*clValueList*/ = function(node) {
	var me = this,
		i,
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Data"),
		tvalue = IG$/*mainapp*/._I24/*getTextContent*/(tnode),
		arr,
		data;
		
	me.item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(node);
	data = me.data = [];
	
	arr = tvalue.split(me.item.delimiter);
	
	for (i=0; i < arr.length-1; i++)
	{
		data.push({code: arr[i]});
	}
}

IG$/*mainapp*/._IF4/*clResult*/ = function(node) {
	var me = this,
		mnode,
		mnodevalue,
		amerge,
		n, ma, sl,
		snode,
		snodes,
		delim,
		sdelim = ";",
		params,
		i;
	
	params = me._params = {};
	
	me.m1/*havenoresult*/ = true;
	
	if (!node)
		return;
	
	IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, "rows;cols;col;row;pagestart;pageend;source", "i");
	me.colfix = me.col; me.rowfix = me.row;
	IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, "delimiter;clustercode;clustervalue;cache;cache_time;u_cache_time", "s");
	delim = me.delim = me.delimiter;
	me.clustercode = me.clustercode.split(delim);
	me.clustervalue = me.clustervalue.split(delim);
	me.clusterdesc = "";
	
	me.cache = (me.cache == "T" || me.cache == "true");
	
	me.m1/*havenoresult*/ = (me.rows > me.rowfix) ? false : true;
	
	for (i=0; i < me.clustercode.length; i++)
	{
		me.clusterdesc += (i > 0 ? " " : "") + (me.clustervalue[i] || me.clustercode[i]);
	}
	
	mnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "parameters");
	
	if (mnode)
	{
		snodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
		for (n=0; n < snodes.length; n++)
		{
			params[IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[n], "name")] = IG$/*mainapp*/._I24/*getTextContent*/(snodes[n]);
		}
	}
	
	mnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "MergeRange");
	me.merge = [];
	
	me.styles = {};
	
	if (mnode)
	{
		mnodevalue = IG$/*mainapp*/._I24/*getTextContent*/(mnode);
		amerge = mnodevalue.split(";");
		
		for (n=0; n < amerge.length; n++)
		{
			if (amerge[n] != "")
			{
				ma = amerge[n].split(",");
				me.merge.push(ma);
			}
		}
	}
	
	snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Styles");
	if (snode)
	{
		me.c_cset = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "c_cset"); 
		snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
		
		for (n=0; n < snodes.length; n++)
		{
			sl = new IG$/*mainapp*/._IF9/*clStyle*/(snodes[n], false);
			me.styles[sl.name] = sl;
		}
	}
	
	snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Stats");
	me.fs_/*statistics*/ = [];
	var statobj,
		statnode, sn,
		treeinfo, trow, treemap = {},
		mval,
		cr, cc,
		mr, mc, data, geodata;
	
	if (snode)
	{
		snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
		for (n=0; n < snodes.length; n++)
		{
			statobj = {col: Number(IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[n], "colindex"))};
			statnode = IG$/*mainapp*/._I26/*getChildNodes*/(snodes[n]);
			for (sn=0; sn < statnode.length; sn++)
			{
				statobj[IG$/*mainapp*/._I29/*XGetNodeName*/(statnode[sn])] = IG$/*mainapp*/._I24/*getTextContent*/(statnode[sn]);
			}
			me.fs_/*statistics*/.push(statobj);
		}
	}
	
	snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "curvefit/bands");
	
	if (snode)
	{
		snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
		me.__bands = snodes;
	}
	
	me.stylemap = null;
	
	snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "StyleMap");
	if (snode)
	{
		me.stylemap = {};
		var st = IG$/*mainapp*/._I24/*getTextContent*/(snode);
		st = st.split(delim);
		for (n=0; n < st.length-1; n++)
		{
			me.stylemap[n] = st[n];
		}
	}
	
	snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "FilterDesc");
	
	if (snode)
	{
		me.f_/*filterdesc*/ = IG$/*mainapp*/._I24/*getTextContent*/(snode);
	}
	
	snode = IG$/*mainapp*/._I18/*XGetNode*/(node, "TreeInfo");
	if (snode)
	{
		treeinfo = IG$/*mainapp*/._I24/*getTextContent*/(snode);
		if (treeinfo && treeinfo != "")
		{
			treeinfo = treeinfo.split(";");
			this.hastree = true;
			for (i=0; i < treeinfo.length; i++)
			{
				trow = treeinfo[i].split(",");
				treeinfo[i] = {
					r: parseInt(trow[0]),
					c: parseInt(trow[1]),
					d: parseInt(trow[2]),
					p: trow[3],
					e: trow[4],
					hc: trow[5] == "1",
					h: trow[6] == "1",
					hm: parseInt(trow[7])
				};
				
				treemap["" + treeinfo[i].r + "_" + treeinfo[i].c] = treeinfo[i];
			}
		}
	}
	
	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "TableData"),
		p,
		dchild, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, stname, arow, r, k, i,
		r1, r2, c1, c2, cell, key, tj,
		mcell,
		mchart, nn, nno;
	
	data = me.data = [];
	geodata = me.geodata = [];
	
	if (tnode)
	{
		snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);

		if (snodes.length > 0)
		{
			for (n=0; n < snodes.length; n++)
			{
				// text;value;code;style;pos;mi;ist;pi
				p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[n]);
				if (p.lat && p.lng)
				{
					geodata.push({
						row: n,
						lat: p.lat,
						lng: p.lng,
						c: (p.c == "T"),
						cc: p.c == "T" ? parseInt(p.cc) : -1
					});
				}
				dchild = IG$/*mainapp*/._I26/*getChildNodes*/(snodes[n]);
				nno = {};
				for (nn=0; nn < dchild.length; nn++)
				{
					nno[IG$/*mainapp*/._I29/*XGetNodeName*/(dchild[nn])] = dchild[nn];
				}
				a0 = IG$/*mainapp*/._I24/*getTextContent*/(nno.t);
				a0 = (a0 ? a0.split(delim) : null); // text
				a1 = IG$/*mainapp*/._I24/*getTextContent*/(nno.v);
				a1 = (a1 ? a1.split(delim) : null); // value
				a2 = IG$/*mainapp*/._I24/*getTextContent*/(nno.c).split(delim); // code
				a3 = IG$/*mainapp*/._I24/*getTextContent*/(nno.s).split(sdelim); // style
				a4 = IG$/*mainapp*/._I24/*getTextContent*/(nno.p).split(sdelim); // position
				a5 = IG$/*mainapp*/._I24/*getTextContent*/(nno.m).split(sdelim); // metric indexes
				a6 = IG$/*mainapp*/._I24/*getTextContent*/(nno.i).split(sdelim); // istitle
				a7 = IG$/*mainapp*/._I24/*getTextContent*/(nno.pi).split(sdelim); // pi
				a8 = nno.rs ? IG$/*mainapp*/._I24/*getTextContent*/(nno.rs).split(sdelim) : null; // pi
				a9 = nno.cc ? IG$/*mainapp*/._I24/*getTextContent*/(nno.cc).split(sdelim) : null; // color
				a10 = nno.cm ? IG$/*mainapp*/._I24/*getTextContent*/(nno.cm).split(sdelim) : null; // color
				
				arow = [];

				for (r=0; r < me.cols; r++) 
				{
					cell = {
						_n_: p.i,
						text: a0 ? a0[r] : (a1 ? a1[r] : a2[r]), 
						mrow:0, 
						mcol:0, 
						merged:0, 
						stylename: (me.stylemap ? me.stylemap[parseInt(a3[r])] : a3[r]), 
						chart:null,
						position: parseInt(a4[r] || -1),
						code: a2[r] || null,
						value: a1 ? a1[r] || null : null,
						index: parseInt(a5[r] || -1),
						title: parseInt(a6[r] || -1),
						pindex: parseInt(a7[r] || -1),
						cc: a9 ? a9[r] : null,
						si: a8 ? a8[r] : null,
						cm: a10 && a10[r] ? parseInt(a10[r]) : -1
					};
					
					key = "" + n + "_" + r;
					
					if (treeinfo && treemap[key])
					{
						cell.celltree = {
							depth: treemap[key].d,
							ptext: treemap[key].p,
							haschild: treemap[key].hc,
							parent: null,
							opened: treemap[key].e == "1",
							h: treemap[key].h,
							hm: treemap[key].hm
						};
						if (cell.celltree.ptext)
						{
							for (tj=n-1; tj>=0; tj--)
							{
								if (data[tj][r].code == cell.celltree.ptext && data[tj][r].celltree && data[tj][r].celltree.depth == cell.celltree.depth-1)
								{
									data[tj][r].celltree.haschild = true;
									cell.celltree.parent = data[tj][r];
									break;
								}
							}
						}
						
						if (arow.length > 0)
						{
							if (arow[0].mcelltree)
							{
								arow[0].mcelltree.push(r);
							}
							else
							{
								arow[0].mcelltree = [r];
							}
						}
						else
						{
							cell.mcelltree = [r];
						}
					}
					arow.push(cell);
				}
				
				data.push(arow);
			}
		}
		
		for (n=0; n < me.merge.length; n++)
		{
			r1 = parseInt(me.merge[n][0]);
			r2 = parseInt(me.merge[n][1]);
			c1 = parseInt(me.merge[n][2]);
			c2 = parseInt(me.merge[n][3]);
			
			mval = 0;
			
			if (r2 > data.length - 1)
			{
				r2 = data.length-1;
			}
			
			for (k=r1; k < r2+1; k++)
			{
				for (t=c1; t < c2+1; t++)
				{
					mr = r2 - r1;
					mc = c2 - c1;
					
					mcell = data[k][t]; 
					mval = mcell.merged;
					
					if (k == r1 && t == c1)
					{
						if (c2 - c1 > 0)
						{
							mval |= 2;
						}
						if (r2 - r1 > 0)
						{
							mval |= 1;
						}
					}
					/*
					else if (k == r2 && t == c2)
					{
						me.data[k][t].merged = 2;
					}
					*/
					else
					{
						if (c2 - c1 > 0)
						{
							mval |= 4;
						}
						if (r2 - r1 > 0)
						{
							mval |= 8;
						}
					}
					
					cr = mcell.mrow;
					cc = mcell.mcol;
					mcell.merged = mval;
					mcell.mrow = Math.max(mr, cr);
					mcell.mcol = Math.max(mc, cc);
					
					// mcell.text += "(" + mval + "," + mcell.mrow + "," + mcell.mcol + ")";
				}
			}
		}
	}
	
	var minode = IG$/*mainapp*/._I18/*XGetNode*/(node, "MicroChart");
	me.microcharts = [];
	
	if (minode)
	{
		snodes = IG$/*mainapp*/._I26/*getChildNodes*/(minode);
		
		if (snodes.length > 0)
		{
			for (n=0; n < snodes.length; n++)
			{
				mchart = new IG$/*mainapp*/._IF5/*clMicroChart*/(snodes[n]);
				me.microcharts.push(mchart);
				if (me.data.length > mchart.rowIndex && me.data[mchart.rowIndex].length > mchart.colIndex)
				{
					me.data[mchart.rowIndex][mchart.colIndex].chart = mchart;
				}
			}
		}
	}
	
	minode = IG$/*mainapp*/._I18/*XGetNode*/(node, "hidden_columns");
	me.hidden_columns = [];
	
	if (minode)
	{
		var st = IG$/*mainapp*/._I24/*getTextContent*/(minode);
		
		if (st)
		{
			st = st.split(",");
			for (n=0; n < st.length; n++)
			{
				if (st[n])
				{
					me.hidden_columns.push(parseInt(st[n]));
				}
			}
		}
	}
}

IG$/*mainapp*/._IF5/*clMicroChart*/ = function(node) {
	var me = this,
		cdata;
	
	me.rowIndex = -1;
	me.colIndex = -1;
	
	if (node)
	{
		me.rowIndex = parseInt(IG$/*mainapp*/._I1b/*XGetAttr*/(node, "row"));
		me.colIndex = parseInt(IG$/*mainapp*/._I1b/*XGetAttr*/(node, "col"));
		
		cdata = new IG$/*mainapp*/._IF6/*clMicroChartData*/(node);
		me.chartData = cdata;
	}
}

IG$/*mainapp*/._IF6/*clMicroChartData*/ = function(node) {
	var me = this,
		ndata,
		nmeasurenames,
		series,
		childs,
		seriesdata = [],
		adata, dnode, sdata, codedata, dispdata,
		n, i;
	
	IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, "w;h;mctype", "i");
	IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, "linecolor;fillcolor", "s");
	ndata = IG$/*mainapp*/._I24/*getTextContent*/(IG$/*mainapp*/._I18/*XGetNode*/(node, "Data"));
	nmeasurenames = IG$/*mainapp*/._I24/*getTextContent*/(IG$/*mainapp*/._I18/*XGetNode*/(node, "SeriesNames"));
	
	series = IG$/*mainapp*/._I18/*XGetNode*/(node, "SeriesList");
	childs = IG$/*mainapp*/._I26/*getChildNodes*/(series);
	
	for (n=0; n < childs.length; n++)
	{
		dnode = IG$/*mainapp*/._I18/*XGetNode*/(childs[n], "Datum");
		sdata = IG$/*mainapp*/._I24/*getTextContent*/(dnode);
		dnode = IG$/*mainapp*/._I18/*XGetNode*/(childs[n], "Code");
		codedata = IG$/*mainapp*/._I24/*getTextContent*/(dnode);
		dnode = IG$/*mainapp*/._I18/*XGetNode*/(childs[n], "Disp");
		dispdata = IG$/*mainapp*/._I24/*getTextContent*/(dnode);
		
		adata = sdata.split(";");
		adata.deleteRow(adata.length - 1);
		
		for (i=0; i < adata.length; i++)
		{
			adata[i] = parseFloat(adata[i]);
		}
		
		seriesdata.push({data: adata, element: dispdata.split(";")});
	}
	
	me.elementdata = ndata.split(";");
	me.seriesnames = nmeasurenames.split(";");
	me.seriesdata = seriesdata;
}

IG$/*mainapp*/._IF7/*clReportStyle*/ = function(node, type, custom) {
	var tnode,
		me = this;
	
	me.itemtype = type;
	me.custom = custom;
	me.rptseq = "0";
	
	if (node)
	{
		me.nodename = IG$/*mainapp*/._I29/*XGetNodeName*/(node);
		me.basestylename = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "basestylename");
		me.name = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "name");
		me.rptseq = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "rptseq") || "0";
		me.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "uid");
		me.fid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "fid") || "";
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Header");
		me.hs/*headerstyle*/ = new IG$/*mainapp*/._IF8/*clReportItemStyle*/(tnode, "Header");
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Data");
		me.ds/*datastyle*/ = new IG$/*mainapp*/._IF8/*clReportItemStyle*/(tnode, "Data");
	}
}

IG$/*mainapp*/._IF7/*clReportStyle*/.prototype = {
	_IFb/*applyBaseStyle*/: function(base) {
		var me = this;
		me.hs/*headerstyle*/._IFb/*applyBaseStyle*/(base.hs/*headerstyle*/);
		me.ds/*datastyle*/._IFb/*applyBaseStyle*/(base.ds/*datastyle*/);
	},
	Mb_15a/*forceBaseStyle*/: function(base) {
		var me = this;
		me.hs/*headerstyle*/.Mb_15a/*forceBaseStyle*/(base.hs/*headerstyle*/);
		me.ds/*datastyle*/.Mb_15a/*forceBaseStyle*/(base.ds/*datastyle*/);
	},
	Mb_16/*removeBaseStyle*/: function(base) {
		var me = this;
		me.hs/*headerstyle*/.Mb_16/*removeBaseStyle*/(base.hs/*headerstyle*/);
		me.ds/*datastyle*/.Mb_16/*removeBaseStyle*/(base.ds/*datastyle*/);
	},
	tx/*getXML*/: function(bs) {
		var me = this,
			nodename = me.nodename,
			r = "<" + nodename + IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "basestylename;name;uid;rptseq;fid", "s") + ">"
			  + ((me.hs/*headerstyle*/) ? me.hs/*headerstyle*/.tx((bs ? bs.hs/*headerstyle*/ : null)) : "")
			  + ((me.ds/*datastyle*/) ? me.ds/*datastyle*/.tx((bs ? bs.ds/*datastyle*/ : null)) : "")
			  + "</" + nodename + ">";
			  
		return r;
	}
};

IG$/*mainapp*/._IF8/*clReportItemStyle*/ = function(node, nodename) {
	var me = this;
	me.objinfo = "name;backcolor;bordercolor;forecolor;formatstring;fontsize;nullvalue;fontstyle;paddingbottom;paddingleft;paddingright;paddingtop;textalign;width;widthmode;borderbottom;borderright;columnwidth;autowidth;cssname";
	me.nodename = nodename;
	
	me.__pca = [
		"name;backcolor;bordercolor;forecolor;fontsize;nullvalue;autowidth;cssname",
		"fontstyle;paddingbottom;paddingleft;paddingright;paddingtop;textalign;width;widthmode;borderright;borderbottom;columnwidth"
	];
	
	if (node)
	{
		// name="Formula" nullvalue="" paddingbottom="2" paddingleft="2" paddingright="2" paddingtop="2" textalign="1" width="100" widthmode="0"
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[0], "s");
		IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, me.__pca[1], "i");
		IG$/*mainapp*/._I1fx/*XGetInfo*/(me, node, "template");
		IG$/*mainapp*/._I1fx/*XGetInfo*/(me, node, "formatstring");
	}
}

IG$/*mainapp*/.$gv/*getColorValue*/ = function(value) {
	var r = "",
		t,
		i, n;
	
	if (value && value != "")
	{
		if (value.length > 0 && value.charAt(0) == "#")
			r = value;
		else
		{
			t = Number(value).toString(16);
			n = t.length;
			for (i=0; i < 6 - n; i++)
			{
				t = "0" + t;
			}
			r = "#" + t;
		}
	}
	
	return r;
}

IG$/*mainapp*/.$gc/*getColorCode*/ = function(value) {
	var r;
	
	if (value.length > 0 && value.charAt(0) == "#")
	{
		var t = value.substring(1);
		r = parseInt(t, 16);
	}
	
	return r;
}

IG$/*mainapp*/._IF8/*clReportItemStyle*/.prototype = {
	tx/*getXML*/: function(bs) {
		var me = this,
			i,
			m1 = me.__pca[0],
			m2 = me.__pca[1],
			m3, m4, key;
	
		if (bs)
		{
			m3 = m1.split(";");
			m4 = [];
			
			for (i=0; i < m3.length; i++)
			{
				key = m3[i];
				if (key != "name" && me[key] != bs[key])
				{
					m4.push(key);
				}
			}
			
			m1 = m4.join(";");
			
			m3 = m2.split(";");
			m4 = [];
			
			for (i=0; i < m2.length; i++)
			{
				key = m3[i];
				if (key != "name" && me[key] != bs[key])
				{
					m4.push(key);
				}
			}
			
			m2 = m4.join(";");
		}
		
		var r = "<" + me.nodename
			  + IG$/*mainapp*/._I20/*XUpdateInfo*/(me, m1, "s")
			  + IG$/*mainapp*/._I20/*XUpdateInfo*/(me, m2, "i")
			  + ">"
			  + (me.formatstring ? "<formatstring><![CDATA[" + (me.formatstring) + "]]></formatstring>" : "")
			  + (me.template ? "<template><![CDATA[" + (me.template) + "]]></template>" : "")
			  + "</" + me.nodename + ">";
			  
		return r;
	},
	
	_IFb/*applyBaseStyle*/: function(base) {
		var me = this,
			cnames = me.objinfo.split(";"),
			i, key;
		
		for (i=0; i < cnames.length; i++)
		{
			key = cnames[i];
			if (key != "name" && (typeof me[key] == "undefined" || me[key] == null))
			{
				me[key] = base[key];
			}
		}
	},
	
	Mb_15a/*forceBaseStyle*/: function(base) {
		var me = this,
			cnames = me.objinfo.split(";"),
			i, key;
		
		for (i=0; i < cnames.length; i++)
		{
			key = cnames[i];
			me[key] = base[key];
		}
	},
	
	Mb_16/*removeBaseStyle*/: function(base) {
		var me = this,
			cnames = me.objinfo.split(";"),
			i, key;
		
		for (i=0; i < cnames.length; i++)
		{
			key = cnames[i];
			if (key != "name" && me[key] == base[key])
			{
				me[key] = null;
			}
		}
	}
}

IG$/*mainapp*/._IF9/*clStyle*/ = function(node, baddcss) {
	var me = this,
		cssstyle,
		talign;
	
	IG$/*mainapp*/._I1f/*XGetInfo*/(me, node, "name;nullvalue;fontsize;gradient;backcolor1;backcolor2;str_backcolor1;str_backcolor2;backalpha1;backalpha2;bordercolor;borderthickness;padleft;padright;padtop;padbottom;textalign;fontstyle;color;fontsize;borderbottom;borderright;columnwidth;autowidth;cssname", "s");
	IG$/*mainapp*/._I1fx/*XGetInfo*/(me, node, "formatstring");
	IG$/*mainapp*/._I1fx/*XGetInfo*/(me, node, "template");
	
	me.padleft = Number(me.padleft);
	me.padright = Number(me.padright);
	me.padtop = Number(me.padtop);
	me.padbottom = Number(me.padbottom);
	
	talign = "left";
	switch (me.textalign)
	{
	case "1":
	case "4":
	case "7":
		talign = "left";
		break;
	case "2":
	case "5":
	case "8":
		talign = "center";
		break;
	case "3":
	case "6":
	case "9":
		talign = "right";
		break;
	}
	
	if (baddcss)
	{
		cssstyle = "<style> ." + me.name + "{ color:" + me.color + "; text-align: " + talign + "; } </style>";
		$("body").append(cssstyle);
	}
}

IG$/*mainapp*/._IFa/*clMapLoc*/ = function(loctype) {
	var me = this;
	me.loctype = loctype;
	me.loaded = false;
	me.data = [];
}

IG$/*mainapp*/._IFa/*clMapLoc*/.prototype = {
	getGeoPosition: function(sloc) {
		var loc;
		if (typeof(data[sloc]) != "undefined")
		{
			loc = data[sloc];
		}
		
		return loc;
	},

	parseMapData: function (node) {
		var me = this,
			i,
			keyvalue,
			o = [];
			
		$.each(["LOCCODE", "SLOC", "SPLOC", "LAT", "LNG"], function(i, n) {
			var m = IG$/*mainapp*/._I24/*getTextContent*/(IG$/*mainapp*/._I18/*XGetNode*/(node, n)).split(";");
			o.push(m);
		});
		
		for (i=0; i < o[0].length - 1; i++)
		{
			keyvalue = o[0][i];
			switch (me.keyname)
			{
			case "sloc":
				keyvalue = o[1][i];
				break;
			case "ploc":
				keyvalue = o[2][i];
				break;
			}
			me.data[keyvalue] = {loccode: o[0][i], sloc: o[1][i], lat: o[2][i], lng: o[3][i]};
		}
	}
}

IG$/*mainapp*/.iff/*clCodeMapping*/ = function(xdoc) {
	var me = this;
	me.dtype = "static";
	me.coldelim = "\t";
	me.rowdim = "\n";
	me.dvalues = [];
	// me.i_cset = false;
	me.i_cdata = [];
	
	xdoc && me.p1/*parseXML*/(xdoc);
}

IG$/*mainapp*/.iff/*clCodeMapping*/.prototype = {
	p1/*parseXML*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			t, ts, i, p,
			drow,
			cmap = {};
		
		if (tnode)
		{
			me.ditem = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			
			t = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "objinfo");
		
			if (t)
			{
				me.dtype = IG$/*mainapp*/._I1b/*XGetAttr*/(t, "dtype");
			}
			
			t = IG$/*mainapp*/._I18/*XGetNode*/(tnode, me.dtype == "static" ? "static_data" : "sql_data");
			ts = t ? IG$/*mainapp*/._I24/*getTextContent*/(t) : null;
			
			me.displabel = t ? IG$/*mainapp*/._I1b/*XGetAttr*/(t, "displabel") : null;
			
			if (me.dtype == "static" && ts)
			{
				drow = ts.split(me.rowdim);
				for (i=0; i < drow.length; i++)
				{
					p = drow[i].split(me.coldelim);
					p[1] && me.dvalues.push({code: p[0], value: p[1]});
				}
			}
			else if (me.dtype == "sql" && t)
			{
				me.dsql = ts;
				me.ds = IG$/*mainapp*/._I1b/*XGetAttr*/(t, "ds");
			}
			
			t = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "sqljoin");
			if (t)
			{
				if (me.dtype == "sqljoin")
				{
					me.ds = IG$/*mainapp*/._I1b/*XGetAttr*/(t, "ds");
				}
				$.each(["codeschema", "codetable", "codetableuid", 
					"codefield", "valuefield", "sortfield", 
					"codemapping", "viewmode", "displabel"], function(i, f) {
					me[f] = IG$/*mainapp*/._I1b/*XGetAttr*/(t, f);
				});
				
				$.each(["codefilter1", "codefilter2", "codefilter3"], function(i, f) {
					var k = IG$/*mainapp*/._I19/*getSubNode*/(t, f);
					
					if (k)
					{
						me[f] = IG$/*mainapp*/._I24/*getTextContent*/(k);
					}
				});
			}
			
			t = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "i_cdata");
			
			if (t)
			{
				me.i_cset = IG$/*mainapp*/._I1b/*XGetAttr*/(t, "i_cset") == "T";
				
				ts = IG$/*mainapp*/._I24/*getTextContent*/(t);
			
				if (ts)
				{
					drow = ts.split(me.rowdim);
					for (i=0; i < drow.length; i++)
					{
						p = drow[i].split(me.coldelim);
						if (p[1])
						{
							me.i_cdata.push({value: p[0], color: p[1]});
							cmap[p[0]] = p[1];
						}
					}
					
					if (me.dtype == "static")
					{
						for (i=0; i < me.dvalues.length; i++)
						{
							if (cmap[me.dvalues[i].code])
							{
								me.dvalues[i].color = cmap[me.dvalues[i].code];
							}
						}
					}
				}
			}
		}
	},
	p2/*getXML*/: function() {
		var me = this,
			r = ["<smsg><item"],
			i,
			dvalues = me.dvalues,
			dtype = me.dtype,
			i_cdata = me.i_cdata;
		
		r.push(IG$/*mainapp*/._I20/*XUpdateInfo*/(me.ditem, "name;description;uid", "s") + ">");
		r.push("<objinfo dtype='" + (dtype || "static") + "'></objinfo>");
		
		if (dtype == "static")
		{
			r.push("<static_data" + (me.displabel ? " displabel='" + me.displabel + "'" : "") + "><![CDATA[")
			for (i=0; i < dvalues.length; i++)
			{
				i > 0 && r.push("\n");
				r.push((dvalues[i].code || "") + "\t" + (dvalues[i].value || ""));
			}
			r.push("]]></static_data>");
		}
		else if (dtype == "sql")
		{
			r.push("<sql_data ds='" + (me.ds || "") + "'" + (me.displabel ? " displabel='" + me.displabel + "'" : "") + "><![CDATA[")
			r.push(me.dsql || "");
			r.push("]]></sql_data>");
		}
		
		r.push("<sqljoin");
		$.each(["ds", "codeschema", "codetable", "codetableuid", 
			"codefield", "valuefield", "sortfield", 
			"codemapping", "viewmode", "displabel"], function(i, f) {
			if (me[f])
			{
				r.push(" " + f + "='" + me[f] + "'");
			}
		});
		
		r.push(">");
			
		$.each(["codefilter1", "codefilter2", "codefilter3"], function(i, f) {
			if (me[f])
			{
				r.push("<" + f + "><![CDATA[" + me[f] + "]]></" + f + ">");
			}
		});
		
		r.push("</sqljoin>");
		
		r.push("<i_cdata i_cset='" + (me.i_cset ? "T" : "F") + "'><![CDATA[");
		
		for (i=0; i < i_cdata.length; i++)
		{
			i > 0 && r.push("\n");
			r.push((i_cdata[i].value || "") + "\t" + (i_cdata[i].color || ""));
		}
		
		r.push("]]></i_cdata>");
		
		r.push("</item></smsg>");
		
		return r.join("");
	},
	
	get: function(pval) {
		return this[pval];
	},
	
	set: function(pval, p) {
		this[pval] = p;
	}
}

IG$/*mainapp*/.ifg/*classmodule*/ = function(xdoc) {
	var me = this;
	me.modules = [];
	me.objinfo = {};
	me.cls = "";
	xdoc && me.p1/*parseXML*/(xdoc);
}

IG$/*mainapp*/.ifg/*classmodule*/.prototype = {
	p1/*parseXML*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			t, ts, i, p, tp, j;
		
		if (tnode)
		{
			me.ditem = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			
			t = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "objinfo");
			
			me.objinfo = t ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(t) : {};
			
			t = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "cls");
			
			me.cls = t ? IG$/*mainapp*/._I24/*getTextContent*/(t) : "";
			
			t = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "modules");
			
			ts = t ? IG$/*mainapp*/._I26/*getChildNodes*/(t) : null;
			
			if (ts)
			{
				for (i=0; i < ts.length; i++)
				{
					p = {
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(ts[i], "name"),
						iparams: [],
						oparams: []
					};
					
					t = IG$/*mainapp*/._I18/*XGetNode*/(ts[i], "description");
					p.description = t ? IG$/*mainapp*/._I24/*getTextContent*/(t) : null;
					
					t = IG$/*mainapp*/._I18/*XGetNode*/(ts[i], "script");
					p.script = t ? IG$/*mainapp*/._I24/*getTextContent*/(t) : null;
					
					$.each(["iparams", "oparams"], function(n, k) {
						var t = IG$/*mainapp*/._I18/*XGetNode*/(ts[i], k),
							tp,
							j;
					
						if (t)
						{
							tp = IG$/*mainapp*/._I26/*getChildNodes*/(t);
							for (j=0; j < tp.length; j++)
							{
								p[k].push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(tp[j]));
							}
						}
					});
					
					me.modules.push(p);
				}
			}
		}
	},
	p2/*getXML*/: function() {
		var me = this,
			r = ["<smsg><item"],
			i,
			md;
		
		r.push(IG$/*mainapp*/._I20/*XUpdateInfo*/(me.ditem, "name;description;uid", "s") + ">");
		r.push("<objinfo" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.objinfo, "ds", "s") + "></objinfo>");
		r.push("<cls><![CDATA[" + (me.cls || "") + "]]></cls>");
		r.push("<modules>");
		
		for (i=0; i < me.modules.length; i++)
		{
			md = me.modules[i];
			r.push("<module name='" + md.name + "'>");
			r.push("<description><![CDATA[" + (md.description || "") + "]]></description>");
			r.push("<script><![CDATA[" + (md.script || "") + "]]></script>");
			$.each(["iparams", "oparams"], function(j, k) {
				var n,	
					module = md[k];
					
				r.push("<" + k + ">");
				if (module)
				{
					for (n=0; n < module.length; n++)
					{
						r.push("<param name='" + module[n].name + "'></param>");
					}
				}
				r.push("</" + k + ">");
			});
			
			r.push("</module>");
		}
		r.push("</modules>");
		r.push("</item></smsg>");
		
		return r.join("");
	}
}
IG$/*mainapp*/.m$sm/*svgloader*/ = function(container) {
	var me = this;
	me.l5/*container*/ = container;
	me.mindex = 0;
}

IG$/*mainapp*/.m$sm/*svgloader*/.prototype = {
	load: function(fname) {
		var me = this;
		if (me.loaded == fname)
		{
			me.m1/*resizeTo*/.call(me);
			$(me.l5/*container*/).trigger("svgloaded");
			return;
		}
		me.l5/*container*/.empty();
		
		$.ajax({
			url: fname,
			dataType: "text",
			type: "GET",
			cache: true,
			complete: function(xhr, status) {
			
			},
			success: function(data, status, xhr) {
				var xdoc = IG$/*mainapp*/._I13/*loadXML*/(data);
				me.loaded = fname;
				me.l1/*loadSVG*/.call(me, xdoc);
				$(me.l5/*container*/).trigger("svgloaded");
			},
			error: function(xhr, status, err) {
				
			}
		});	
	},
	
	l1/*loadSVG*/: function(xdoc) {
		var me = this,
			tnode, tnodes,
			container = me.l5/*container*/,
			tparam, scale,
			xscale, yscale, i,
			tfactor, nw, nh, mw, mh, my, mx,
			mscale = 1, mxscale = 1, myscale=1,
			vbox;
		
		me.mapid = {};
		me.l4/*gparam*/ = {
			cx: 0,
			cy: 0,
			cwidth: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container),
			cheight: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container),
			
			sx: 0,
			sy: 0,
			swidth: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container),
			sheight: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container)
		};
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/svg");
		
		me.l6/*paper*/ = Raphael(container[0], 0, 0, me.l4/*gparam*/.cwidth, me.l4/*gparam*/.cheight);
		
		me.legend = $("<ul class='map-legend'></ul>").appendTo(container).hide();
		
		if (tnode)
		{
			tparam = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			
			
			me.l4/*gparam*/.sx = (tparam.x) ? me.l3/*getVal*/(tparam.x) : me.l4/*gparam*/.sx;
			me.l4/*gparam*/.sy = (tparam.y) ? me.l3/*getVal*/(tparam.y) : me.l4/*gparam*/.sy;
			
			me.l4/*gparam*/.swidth = (tparam.width) ? me.l3/*getVal*/(tparam.width) : me.l4/*gparam*/.swidth;
			me.l4/*gparam*/.sheight = (tparam.height) ? me.l3/*getVal*/(tparam.height) : me.l4/*gparam*/.sheight;
			
			vbox = tparam.viewBox;
			vbox = (vbox) ? vbox.split(" ") : null;
			if (vbox)
			{
				for (i=0; i < vbox.length; i++)
				{
					vbox[i] = me.l3/*getVal*/(vbox[i]);
				}
				
				vbox = vbox[0] == me.l4/*gparam*/.sx && 
				vbox[1] == me.l4/*gparam*/.sy &&
				vbox[2] == me.l4/*gparam*/.swidth &&
				vbox[3] == me.l4/*gparam*/.sheight ? null : vbox;
			}
			
			me.l4/*gparam*/.vbox = vbox;
			
			me.l6/*paper*/.setSize(me.l4/*gparam*/.cwidth, me.l4/*gparam*/.cheight);
						
			var p = {
				isroot: true,
				id: null,
				children: [],
				childmap: {},
				d: [],
				set: me.l6/*paper*/.set()
			};

			me.l2/*recurseNode*/(tnode, p, tfactor);
			me.p/*mainpage*/ = p;
			
			
			me.m1/*resizeTo*/.call(me);
		}
	},
	
	Y1/*prepareLegend*/: function() {
		var me = this,
			legend = me.legend,
			mapseries = me.mapdata.measures;
			
		legend.empty();
		me.legidx = 0;
		if (mapseries && mapseries.length > 0)
		{
			legend.show();
			$.each(mapseries, function(i, map) 
			{
				$("<li class='map-legend-item'>" + (map.name || map.text) + "</li>")
					.appendTo(legend)
					.bind("click", function() {
						me.legidx = i;
						me.applyColor.call(me, i);
					});
			});
		}
		else
		{
			legend.hide();
		}
	},
	
	l2/*recurseNode*/: function(tnode, parent, tfactor) {
		var me = this,
			i, 
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			nodename, p, path,
			paper = me.l6/*paper*/, pval;
		for (i=0; i < tnodes.length; i++)
		{
			nodename = IG$/*mainapp*/._I29/*XGetNodeName*/(tnodes[i]);
			pval = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			if (nodename == "g")
			{
				p = {
					isroot: true,
					id: pval.id,
					name: pval.name || pval.id,
					children: [],
					childmap: {},
					d: [],
					set: paper.set()
				};
				parent.set.push(p.set);
				parent.children.push(p);
				parent.childmap[p.id || "noid"] = p;
				me.mapid[p.id || "noid"] = p;
				me.l2/*recurseNode*/(tnodes[i], p, tfactor);
			}
			else if (nodename == "path")
			{
				path = paper.path(pval.d);
				
				parent.d.push(path);
				delete pval.d;
				path.attr(path);
				parent.set.push(path);
				// path.transform(tfactor);
			}
		}
	},
	
	l3/*getVal*/: function(val) {
		val = val.replace(/px/, "");
		return Number(val);
	},
	
	m1/*resizeTo*/: function() {
		var me = this,
			tnode, tnodes,
			container = me.l5/*container*/,
			tparam, scale,
			xscale, yscale,
			mscale = 1, mxscale=1, myscale=1,
			paper = me.l6/*paper*/,
			tfactor, nw, nh, mw, mh, my, mx,
			vbox,
			cw, ch, sw, sh,
			p = me.p/*mainpage*/;
		
		me.l4/*gparam*/.cwidth = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container);
		me.l4/*gparam*/.cheight = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container);
		
		vbox = me.l4/*gparam*/.vbox;
		
		cw = me.l4/*gparam*/.cwidth; 
		ch = me.l4/*gparam*/.cheight;
		sw = me.l4/*gparam*/.swidth; 
		sh = me.l4/*gparam*/.sheight;
			
		if (vbox)
		{
			mxscale = vbox[2] / sw;
			myscale = vbox[3] / sh;
			mscale = Math.min(mxscale, myscale);
		}
		
		xscale = cw / sw;
		yscale = ch / sh;
		scale = Math.min(xscale, yscale) * mscale;
		
		me.l6/*paper*/.setSize(cw, ch);
		
		mw = (cw - sw * scale) / 2;
		mh = (ch - sh * scale) / 2;
		tfactor = "s" + (scale) + "," + scale + ",0,0" + "t" + mw + "," + mh;
		
		p.set.transform(tfactor);
	},
	
	loadData: function(chartoption) {
		var me = this;
		
		me.mapdata = chartoption;
		
		me.Y1/*prepareLegend*/();
		
		me.applyColor(0);
	},
	
	applyColor: function(idx) {
		var me = this, i,
			min, max, mindex,
			maxdepth = 155,
			mapdata = me.mapdata,
			c, depth, mincolor = me.mapdata.mincolor || "#ff0000", maxcolor = me.mapdata.maxcolor || "#0000ff",
			legend = me.legend;
		
		me.legidx = idx;
		
		mindex = idx;
		mindex= (mindex < mapdata.measures.length) ? mindex : 0;
		
		legenditems = legend.children("li");
		
		if (legenditems && legenditems.length > 0)
		{
			for (i=0; i < legenditems.length; i++)
			{
				$(legenditems[i]).removeClass("map-legend-selected");
				if (i == mindex)
				{
					$(legenditems[i]).addClass("map-legend-selected");
				}
			}
		}
		
		min = mapdata.measures[mindex].min;
		max = mapdata.measures[mindex].max;
		$.each(mapdata.point, function(i, m) {
			var m = m.data[mindex];
			if (isNaN(m) == false)
			{
				depth = ((max - m) * maxdepth) / (max - min);
				c = IG$/*mainapp*/._I15/*interpolateColor*/(mincolor, maxcolor, maxdepth, depth);
				
				if (me.mapid[i])
				{
					me.mapid[i].set.attr({fill: c});
				}
			}
		});
	}
};
IG$/*mainapp*/._I94/*olapReportView*/ = function(uid, canvas, owner, fsize) {
	var me = this;
	
	me.mresult = null;
	me._ILa/*reportoption*/ = null;
	me._ILb/*sheetoption*/ = null;
	me.uid = uid;
	me._IL8/*jobid*/ = null;
	me.container = canvas;
	me.owner = owner;
	me.width = 0;
	me.height = 0;
	me.ctrl = null;
	me.fsize = fsize;
	me.sheetobj = null;
	
	me._0x030/*mgrid*/ = new IG$/*mainapp*/.cMa/*DataGridView*/();
	
	me._0x030/*mgrid*/._ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
	me._0x030/*mgrid*/.size = me.fsize;
	me._0x030/*mgrid*/.initialize(me.owner);
	me._0x030/*mgrid*/.sheetobj = me.sheetobj;
	
	if (me._0x030/*mgrid*/.ctx)
	{
		var ownerct = me,
			ctx = me._0x030/*mgrid*/.ctx;
		
		ctx.bind({
			itemclick: function(renderer) {
			},
			doubleclick: function(renderer) {
			},
			selectionchanged: function(renderer) {
			},
			menu: function(el) {
			}
		});
	}
	
	me._IN0/*applyOptions*/();
}

IG$/*mainapp*/._I94/*olapReportView*/.prototype = {
	_tsm/*selectedCells*/: function() {
		return this._0x030/*mgrid*/.selectedItems;
	},
	
	dor/*drawOlapResult*/: function (ispageview, _is_sc, _hcell, cresult) {
		var me = this,
			treeview = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.treeview : false,
			columntree = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.columntree : false,
			showlnum = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.showlnum : false,
			hidemenu = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.hidemenu : false,
			mdf = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.mdf : null,
			data,
			measurerow,
			nwidth, nheight,
			mfixcol = -1,
			i, j, hc, hr, orow, oc, oj, om,
			hrow, hm = 0, hmm,
			n;
		
		nwidth = (me.width > 0 ? me.width : me._0x030/*mgrid*/._d/*cwidth*/);
		nheight = (me.height > 0 ? me.height : me._0x030/*mgrid*/._e/*cheight*/);
		
		if (nwidth > 0 && nheight > 0)
		{
			me._0x030/*mgrid*/._d/*cwidth*/ = nwidth;
			me._0x030/*mgrid*/._e/*cheight*/ = nheight;
		}
		
		// console.log(">> 1", me._0x030/*mgrid*/.cwidth, me._0x030/*mgrid*/.cheight);
		
		me._0x030/*mgrid*/._6/*treeRow*/ = -1;
		me._0x030/*mgrid*/._5/*treeCol*/ = -1;
		
		me._0x030/*mgrid*/._3/*fixedRow*/ = 0;
		me._0x030/*mgrid*/._4/*fixedCol*/ = 0;
		
		if (me._ILb/*sheetoption*/ && me._ILb/*sheetoption*/.customfix == "T" && me._ILb/*sheetoption*/.customfixcols > -1)
		{
			mfixcol = me._ILb/*sheetoption*/.customfixcols;
		}
		
		if (me.mresult != null && me.mresult.data != null && me.mresult.data.length > 0)
		{
			if (_hcell && cresult)
			{
				hc = _hcell.c;
				hr = _hcell.r;
				hmm = _hcell.celltree.hm;
				
				orow = me.mresult.data[hr];
				_hcell.celltree.h = 0;
				_hcell.celltree.haschild = true;
				_hcell.celltree.depth = _hcell.celltree.depth || 0;
				
				for (i=cresult.rowfix; i < cresult.data.length; i++)
				{
					hrow = cresult.data[i];
					
					if (hmm == 2)
					{
						for (j=0; j < me.mresult.colfix - cresult.colfix; j++)
						{
							oj = orow[hc - j];
							
							if (oj.merged == 0)
							{
								oj.merged = 1;
							}
							
							oc = {
								_n_: oj._n_,
								c: oj.c,
								cc: oj.cc,
								cm: oj.cm,
								code: oj.code,
								h: oj.h,
								index: oj.index,
								mcol: oj.mcol,
								menus: null,
								merged: 0,
								mrow: oj.mrow,
								pindex: oj.pindex,
								position: oj.position,
								r: oj.r,
								selected: false,
								si: oj.si,
								stylename: oj.stylename,
								text: oj.text,
								title: oj.title,
								value: oj.value,
								celltree: {
								}
							};
							
							oc.merged |= 8;
							oc.celltree.parent = _hcell;
							oc.celltree.depth = _hcell.celltree.depth + 1;
							hrow.splice(hc - _hcell.celltree.depth + j, 0, oc);
						}
						
						om = hrow[hc + 1]; 
						om.celltree = om.celltree || {};
						om.celltree.depth = _hcell.celltree.depth + 1;
						om.celltree.parent = _hcell;
						om.celltree.nd = 1;
						hrow[0].mcelltree = hrow[0].mcelltree || [];
						hrow[0].mcelltree.push(hc+1);
					}
					else if (hmm == 1)
					{
						oc = hrow[hc];
						oc.celltree = oc.celltree || {};
						oc.celltree.parent = _hcell;
						oc.celltree.depth = _hcell.celltree.depth + 1;
						hrow[0].mcelltree = hrow[0].mcelltree || [];
						hrow[0].mcelltree.push(hc);
					}
					
					if (i == cresult.rowfix && hc > 0)
					{
						for (j=0; j < hc; j++)
						{
							if (orow[j].merged == 0)
							{
								orow[j].merged |= 1;
							}
						}
					}
					
					for (j=0; j < hc; j++)
					{
						hrow[j].merged = 0;
						hrow[j].merged |= 8;
					}
					
					me.mresult.data.splice(hr + (++hm), 0, hrow);
				}
			}
			else
			{
				me._0x030/*mgrid*/.styles = me.mresult.styles;
				me._0x030/*mgrid*/.showlnum = showlnum;
				me._0x030/*mgrid*/.hidemenu = hidemenu;
			}
			
			if (treeview == true)
			{
				me._0x030/*mgrid*/._4/*fixedCol*/ = (me.mresult.colfix > 0 ? 1 : 0);
				me._0x030/*mgrid*/._3/*fixedRow*/ = me.mresult.rowfix;
				me._0x030/*mgrid*/._5/*treeCol*/ = (me.mresult.colfix > 0 ? 0 : -1);
				
				data = me.gtr/*generateTreeData*/(me.mresult.data, me.mresult.colfix, me.mresult.rowfix, me.mresult.styles);
			}
			else
			{
				data = me.mresult.data;
				
				if (showlnum)
				{
					for (i=0; i < data.length; i++)
					{
						n = (data[i].length) ? Number(data[i][0]._n_) - me.mresult.rowfix : 0;
						data[i].splice(0, 0, {
							_n_: n,
							chart: null,
							code: "",
							index: 0,
							mcol: 0,
							merged: 0,
							mrow: 0,
							pindex: 0,
							position: 9,
							stylename: "LineNumber_" + (i < me.mresult.rowfix ? "title" : "data"),
							text: (i < me.mresult.rowfix ? "" : "" + (n+1)),
							title: 0,
							value: null
						});
					}
				}
				me._0x030/*mgrid*/._4/*fixedCol*/ = me.mresult.colfix + (showlnum ? 1 : 0);
				me._0x030/*mgrid*/._3/*fixedRow*/ = me.mresult.rowfix;
			}
			
			if (mfixcol > -1)
			{
				me._0x030/*mgrid*/._4/*fixedCol*/ = mfixcol;
			}
			
			if (columntree == true)
			{
				me._0x030/*mgrid*/._3/*fixedRow*/ = me.mresult.rowfix; // (me.mresult.rowfix > 0 ? 1 : 0);
				me._0x030/*mgrid*/._6/*treeRow*/ = me.mresult.rowfix;
				
				// move measurelocation
				if (me._ILb/*sheetoption*/.cols.length > 0 && me._ILb/*sheetoption*/.measurelocation == "column")
				{
					measurerow = me._ILb/*sheetoption*/.cols.length - me._ILb/*sheetoption*/.measureposition;
					if (measurerow > 0)
					{
						// data = me.gtk/*moveMeasureRow*/(data, me._0x030/*mgrid*/.fixedCol, me.mresult.rowfix, measurerow);
					}
					data = me.gtc/*generateTreeColumn*/(data, me._0x030/*mgrid*/._4/*fixedCol*/, me.mresult.rowfix, me.mresult.styles);
				}
			}
		}
		
		me._IN0/*applyOptions*/();
		
		me._0x030/*mgrid*/.__trow = (data ? data.length : 0);
		me._0x030/*mgrid*/.__tpstart = 0;
		me._0x030/*mgrid*/.__tpend = 0;
		me._0x030/*mgrid*/.__gflt = mdf;
		
		if (ispageview == false && (me.mresult.pagestart > 0 || me.mresult.pageend < me.mresult.rows))
		{
			me._0x030/*mgrid*/.__tpstart = me.mresult.pagestart;
			me._0x030/*mgrid*/.__tpend = me.mresult.pageend;
			me._0x030/*mgrid*/.__trow = me.mresult.rows;
		}
		
		me._0x030/*mgrid*/.setDataProvider(data || [], undefined, me.mresult.hidden_columns);
	},
	
	gtk/*moveMeasureRow*/: function(mdata, colfix, rowfix, measurerow) {
		var data = [],
			i, j, colmove = [], actmove = [], row, schild,
			pmeasure;
			
		for (i=colfix; i < mdata[measurerow].length; i++)
		{
			mcell = mdata[measurerow][i];
			colmove.push({
				cindex: i,
				mindex: mcell.index,
				cname: mcell.code
			});
			pmeasure = mcell.code;
		}
		
		colmove.sort(function(a, b) {
			var r = 0;
			if (a.mindex == b.mindex)
			{
				if (a.cindex > b.cindex)
				{
					r = 1;
				}
				else if (a.cindex < b.cindex)
				{
					r = -1;
				}	
			}
			else 
			{
				r = (a.mindex > b.mindex) ? 1 : -1;
			}
			return r;
		});
		
		for (i=0; i < colmove.length; i++)
		{
			actmove.push(colmove[i].cindex);
		}
		
		for (i=0; i < mdata.length; i++)
		{
			row = [];
			for (j=0; j < mdata[i].length; j++)
			{
				if (j < colfix)
				{
					row.push(mdata[i][j]);
				}
				else
				{
					row.push(mdata[i][actmove[j-colfix]]);
				}
			}
			
			if (row[0].children && row[0].children.length > 0)
			{
				schild = this.gtk2/*moveMeasureRowChildren*/(row[0].children, actmove, colfix);
				row[0].children = schild;
			}
			
			if (i == measurerow)
			{
				data.splice(0, 0, row);
			}
			else
			{
				data.push(row);
			}
		}
		
		return data;
	},
	
	gtk2/*moveMeasureRowChildren*/: function(child, actmove, colfix) {
		var i, j,
			schild = [], srow, ichild;
		for (i=0; i < child.length; i++)
		{
			srow = [];
			for (j=0; j < child[i].length; j++)
			{
				if (j < colfix)
				{
					srow.push(child[i][j]);
				}
				else
				{
					srow.push(child[i][actmove[j-colfix]]);
				}
			}
			
			if (srow[0].children && srow[0].children.length > 0)
			{
				ichild = this.gtk2/*moveMeasureRowChildren*/(srow[0].children, actmove, colfix);
				srow[0].children = ichild;
			}
			schild.push(srow);
		}
		
		return schild;
	},
	
	gtc/*generateTreeColumn*/: function(mdata, colfix, rowfix, styles) {
		var me = this,
			data = [],
			i, j, k, nj, k,
			prow = [], row, mrow, mcell, hrow, finalcols, dcell, pcell, depths, depth,
			spcols = [],
			pval, cval, nval;
		
		for (i=0; i < rowfix; i++)
		{
			row = mdata[i];
			
			mrow = [];
		
			for (j=0; j < row.length; j++)
			{
				mcell = this.gmr/*getCellValue*/(row[j], j);
				mrow.push(mcell);
			}
			
			data.push(mrow);
		}
		
		for (i=0; i < rowfix; i++)
		{
			row = data[i];
			pcell = null;
			
			if (i < rowfix-1)
			{
				for (j=row.length-1; j>=colfix; j--)
				{
					pcell = (j > colfix) ? row[j-1] : null;
					if ((pcell != null && row[j].text != pcell.text) || j == colfix)
					{
						depth = i;
						if (row[j].haschild === true)
						{
							depth = row[j].depth;
						}
						if (i == 0 || (i > 0 && depth == i))
						{
							for (k=0; k < rowfix; k++)
							{
								if (k < i)
								{
									dcell = this.gmr/*getCellValue*/(data[k][j], i);
									dcell.haschild = true;
									dcell.depth = depth;
									data[k].splice(j, 0, dcell);
								}
								else
								{
									dcell = this.gmr/*getCellValue*/(row[j], i);
									dcell.haschild = true;
									dcell.depth = depth;
									data[k].splice(j, 0, dcell);
								}
							}
						}
					}
				}
			}
			
			pcell = null;
			depths = [];
			for (j=0; j < rowfix; j++)
			{
				depths[j] = null;
			}
			
			k = -1;
			
			for (j=colfix; j < row.length; j++)
			{
				if (row[j].haschild === true)
				{
					depths[row[j].depth] = j;
					k = j;
					if (row[j].depth > 0 && depths[row[j].depth-1] != null)
					{
						row[j].parent = row[depths[row[j].depth-1]];
					}
				}
				else if (k > -1)
				{
					row[j].parent = row[k];
				}
			}
		}
		
		row = data[rowfix-1];
		
		for (i=row.length-1; i >= 0; i--)
		{
			if (row[i].haschild == true)
			{
				spcols.push(i);
			}
		}
		
		// calculate merge again
		for (i=0; i < rowfix; i++)
		{
			row = data[i];
			for (j=colfix; j < row.length; j++)
			{
				pval = (j == colfix) ? null : row[j-1].code;
				cval = row[j].code;
				nval = (j + 1 < row.length) ? row[j+1].code : null;
				
				if (cval == pval == nval)
				{
					row[j].merged = 4;
				}
				else if (cval == pval)
				{
					row[j].merged = 4;
				}
				else if (cval == nval)
				{
					row[j].merged = 2;
				}
			}
		} 
		
		for (i=rowfix; i < mdata.length; i++)
		{
			mrow = [];
			row = mdata[i];
			
			for (j=0; j < row.length; j++)
			{
				mcell = row[j];
				mrow.push(mcell);
			}
			
			me.gmx/*updateColumnTreeData*/(mrow, spcols, i, 0, data[rowfix-1], rowfix, colfix, styles);
			
			data.push(mrow);
		}
		
		return data;
	},
	
	gmx/*updateColumnTreeData*/: function(row, spcols, rowindex, mi, headerrow, rowfix, colfix, styles) {
		var me = this,
			j, i, tval,
			mcell, startcell, scol, rvalues = [], style, tnum, mc;
		for (j=spcols.length-1; j >= 0; j--)
		{
			scol = spcols[j];
			mcell = this.gmr/*getCellValue*/(row[scol], rowindex);
			mcell.code = null;
			mcell.value = null;
			mcell.text = null;
			
			row.splice(spcols[j], 0, mcell);
		}
		
		for (j=0; j < rowfix; j++)
		{
			rvalues.push(0);
		}
		
		for (j=row.length-1; j >= colfix; j--)
		{
			startcell = headerrow[j];
			
			if (startcell.haschild == true)
			{
				mc = row[j];
				row[j].code = rvalues[startcell.depth  + 1];
				row[j].value = row[j].code;
				row[j].text = row[j].code;
				if (styles && styles[mc.stylename])
				{
					style = styles[mc.stylename];
					tnum = Number(mc.code);
					if (style.formatstring && isNaN(tnum) == false)
					{
						mc.text = tnum.format(style.formatstring);
						mc.value = mc.text;
					}
				}
				rvalues[startcell.depth + 1] = 0;
				rvalues[startcell.depth] += Number(row[j].code);
			}
			else
			{
				rvalues[rvalues.length - 1] += Number(row[j].code);
			}
		}
		
		if (row[0].children && row[0].children.length > 0)
		{
			for (i=0; i < row[0].children.length; i++)
			{
				me.gmx/*updateColumnTreeData*/(row[0].children[i], spcols, rowindex, 1, headerrow, rowfix, colfix, styles);
			}
		}
	},
	
	gmt/*dupFinalTree*/: function(rvalue, dcell) {
		var i, j,
			r = [],
			mr, dchild;
			
		if (rvalue && rvalue.children && rvalue.children.length > 0)
		{
			for (i=0; i < rvalue.children.length; i++)
			{
				dchild = this.gmr/*getCellValue*/(null, -1);
				dcell.children.push(dchild);
				mr = this.gmt/*dupFinalTree*/(rvalue.children[i], dchild);
				if (mr && mr.length > 0)
				{
					for (j=0; j < mr.length; j++)
					{
						r.push(mr[j]);
					}
				}
				else
				{
					r.push(dchild);
				}
			}
		}
		else if (dcell)
		{
			r.push(dcell);
		}
		
		return r;
	},
	
	gmr/*getCellValue*/: function(rvalue, j) {
		var mcell;
		
		if (rvalue)
		{
			mcell = {
				code: rvalue.code,
				chart: rvalue.chart,
				index: rvalue.index,
				mcol: rvalue.mcol,
				merged: 0,
				pindex: rvalue.pindex,
				position: rvalue.position,
				stylename: rvalue.stylename,
				text: rvalue.text,
				title: rvalue.title,
				value: rvalue.value,
				treeinfo: rvalue.treeinfo || {},
				children: rvalue.children || [],
				ccol: j,
				parent: rvalue.parent
			};
		}
		else
		{
			mcell = {
				code: "",
				chart: null,
				index: null,
				mcol: null,
				merged: 0,
				pindex: null,
				position: null,
				stylename: null,
				text: null,
				title: null,
				value: null,
				treeinfo: {},
				children: [],
				ccol: j,
				parent: null
			};
		}
		
		return mcell;
	},
	
	gmd/*duplicateCellValue*/: function(rvalue, svalue) {
		rvalue.code = svalue.code;
		rvalue.chart = svalue.chart;
		rvalue.index = svalue.index;
		rvalue.mcol = svalue.mcol;
		rvalue.pindex = svalue.pindex;
		rvalue.position = svalue.position;
		rvalue.stylename = svalue.stylename;
		rvalue.text = svalue.text;
		rvalue.title = svalue.title;
		rvalue.value = svalue.value;
	},
	
	gtr/*generateTreeData*/: function(mdata, colfix, rowfix, styles) {
		var me = this,
			data = [],
			i, j, k,
			pcol = [], row, mrow, mcell, prow, n, ncolcnt = mdata[0].length - colfix, style, tnum;
		
		for (i=0; i < colfix; i++)
		{
			pcol.push({
				row: null,
				depth: 0
			});
		}
		
		for (i=0; i < mdata.length; i++)
		{
			row = mdata[i];
			
			if (i < rowfix)
			{
				mrow = [];
				
				for (j=0; j < row.length; j++)
				{
					mcell = this.gmr/*getCellValue*/(row[j], j);
					
					if (j < colfix)
					{
						if (j == 0)
						{
							mrow.push(mcell);
						}
						else
						{
							// mcell.parent = mrow[0];
							// mrow[0].children.push(mcell);
						}
					}
					else
					{
						// mcell.parent = mrow[0];
						mrow.push(mcell);
					}
				}
				
				data.push(mrow);
			}
			else
			{
			
				for (j=0; j < row.length; j++)
				{
					mrow = null;
					
					mcell = this.gmr/*getCellValue*/(row[j], j);
					
					if (j < colfix)
					{
						if (pcol[j].row == null || (pcol[j].row && pcol[j].row[0].code != row[j].code))
						{
							prow = pcol[j].row;
							
							mrow = [];
							mrow.push(mcell);
							
							mcell.treeinfo.depth = j;
							
							if (j == 0)
							{
								pcol[j].row = mrow;
								data.push(mrow);
							}
							else
							{
								prow = pcol[j-1].row;
								// case when grad total collapsing
								if (prow[0].position == 4)
								{
									pcol[j].row = prow;
									mcell.parent = prow[0];
								}
								else
								{
									pcol[j].row = mrow;
									prow[0].children.push(mrow);
									mcell.parent = prow[0];
								}
							}
							
							for (k=j+1; k < colfix; k++)
							{
								pcol[k].row = null;
							}
							pcol[j].depth = j;
						}
						else if (pcol[j])
						{
							// do nothing
						}
					}
					else
					{
						n = pcol.length - 1;
						pcol[n].row.push(mcell);
					}
				}
			}
		}
		
		for (i=rowfix; i < data.length; i++)
		{
			mrow = data[i];
			
			svalues = me.ms/*getSubTotals*/(mrow, ncolcnt, styles);
		}
		
		return data;
	},
	
	ms/*getSubTotals*/: function(d, ncolcnt, styles) {
		var me = this,
			i, j,
			svalues = [],
			mvalues, style, tnum,
			mc, isgrandtotal=false,
			nval;
		
		for (i=0; i < ncolcnt; i++)
		{
			svalues.push({
				v: null,
				c: null
			});
		}
			
		if (d.length > 1)
		{
			if (d[0].position == 4)
			{
				isgrandtotal = true;
				return svalues;
			}
			
			for (i=0; i < ncolcnt; i++)
			{
				// if (d[i+1].position != 4)
				// {
					nval = Number(d[i+1].code);
					nval = isNaN(nval) ? 0 : nval;
					svalues[i].v = (svalues[i].v == null) ? nval : svalues[i].v + nval;
					svalues[i].c = d[i+1];
				// }
			}
		}
		else if (d[0].children && d[0].children.length > 0)
		{
			for (i=0; i < d[0].children.length; i++)
			{
				mvalues = me.ms/*getSubTotals*/(d[0].children[i], ncolcnt, styles);
				for (j=0; j < mvalues.length; j++)
				{
					if (mvalues[j].c)
					{
						svalues[j].v = (svalues[j].v == null) ? Number(mvalues[j].v) : svalues[j].v + Number(mvalues[j].v);
						svalues[j].c = mvalues[j].c;
					}
				}
			}
			
			for (i=0; i < svalues.length; i++)
			{
				mc = {
					code: svalues[i].v,
					chart: null,
					index: svalues[i].c ? svalues[i].c.index : null,
					mcol: svalues[i].c ? svalues[i].c.mcol : null,
					merged: 0,
					pindex: svalues[i].c ? svalues[i].c.pindex : null,
					position: svalues[i].c ? svalues[i].c.position : null,
					stylename: svalues[i].c ? svalues[i].c.stylename : null,
					text: "" + svalues[i].v,
					title: svalues[i].c ? svalues[i].c.title : null,
					value: svalues[i].v
				};
				
				if (styles && styles[mc.stylename])
				{
					style = styles[mc.stylename];
					tnum = Number(mc.code);
					if (style.formatstring && isNaN(tnum) == false)
					{
						mc.text = tnum.format(style.formatstring);
						mc.value = mc.text;
					}
				}
				
				d.push(mc);
			}
		}
		
		return svalues;
	},
	
	_IN0/*applyOptions*/: function(rop, sop) {
		var me = this;
		
		if (rop && sop)
		{
			me._ILa/*reportoption*/ = rop;
			me._ILb/*sheetoption*/ = sop;
			
			me._0x030/*mgrid*/._ILb/*sheetoption*/ = sop;
		}
		
		if (me._ILb/*sheetoption*/)
		{
			me._0x030/*mgrid*/.columnfill = me._ILb/*sheetoption*/.columnfill;
		}
	},
	
	Mm12/*invalidateSize*/: function () {
		this.dor/*drawOlapResult*/();
	}
}
IG$/*mainapp*/._I95/*olapChartView*/ = function(rpc, uid, container, tw, th) {
	var i,
		me = this,
		bg,
		logo,
		hscroll, hend, hup, hdown;

	me.rpc = rpc;

	me.mresult = null;
	me._ILa/*reportoption*/ = null;
	me._ILb/*sheetoption*/ = null;
	me.uid = uid;
	me._IL8/*jobid*/ = null;
	me.P1/*maincontainer*/ = $(container);
	me.ctrl = null;

	me._mc/*masterCharts*/ = [];
	me.detailChart = null;

	me.isHighChart = false;
	me.selectedData = null;
	me.ddt/*drillDepth*/ = 0;

	me.f4/*onClickEventHandler*/ = null;
	me.f4a/*onClickEventOwner*/ = null;

	me.drawmode = null;
	me.rfctimer = -1;
	me.pw = -1;
	me.ph = -1;

	me.ti = 0;
	me.scrollsize = 13;
	me.scrollX = 0;
	
	me._sep = IG$/*mainapp*/.sX/*seperator*/;
	
	
	me.PJ2/*jcontainer*/ = $("<div></div>").appendTo(me.P1/*maincontainer*/);
	me.PJ2/*jcontainer*/.css({position: "absolute", top: 0, bottom: 0, left: 0, right: 0});
	tw = tw || IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.P1/*maincontainer*/);
	th = th || IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.P1/*maincontainer*/);
	IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.PJ2/*jcontainer*/, tw);
	IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.PJ2/*jcontainer*/, th);

	me.container = me.PJ2/*jcontainer*/[0];

	me.PJ3/*fcontainer*/ = $("<div class='idv-filter-desc'></div>").appendTo(me.P1/*maincontainer*/).hide();
	me.PJ3/*fcontainer*/.bind("click", function() {
		$(this).fadeOut();
	});
	me.PJ4/*scontainer*/ = $("<div class='m-chart-selection'></div>").appendTo(me.P1/*maincontainer*/).hide();
	$("<div class='m-chart-selection-bg'></div>").appendTo(me.PJ4/*scontainer*/);
	
	me._bN/*bandFormula*/ = $("<div class='igc-cfit-formula'></div>").appendTo(me.P1/*maincontainer*/).hide();

	bg = $("<div class='m-chart-selection-boxtop'></div>").appendTo(me.PJ4/*scontainer*/);
	me.PJ4a/*sbox*/ = $("<div class='m-chart-selection-box'></div>").appendTo(bg);

	if (ig$/*appoption*/.chartlogo && ig$/*appoption*/.chartlogo.enabled)
	{
		logo = $("<div class='" + ig$/*appoption*/.chartlogo.clsname + "'></div>").appendTo(me.P1/*maincontainer*/).hide();

		setTimeout(function() {
			logo.fadeIn(2000);
		}, 500);
	}

   	IG$/*mainapp*/._I0a/*drawLicenseTag*/(me.P1/*maincontainer*/);

	me.reghscroll = $('<div class="m-datagrid-scroll m-datagrid-hscroll"></div>')
		.css({height: me.scrollsize})
		.hide()
		.appendTo(me.P1/*maincontainer*/);
	
//	hup = $('<div class="m-datagrid-track-up icon-caret-right"></div>').appendTo(me.reghscroll);
//	hdown = $('<div class="m-datagrid-track-down icon-caret-left"></div>').appendTo(me.reghscroll);
//	
//	hup.bind("click", function(ev) {
//		ev.preventDefault();
//		ev.stopImmediatePropagation();
//		
//		
//	});
	
	me.hscroll = hscroll = $('<div class="m-datagrid-track m-datagrid-track-h"></div>').appendTo(me.reghscroll);

	me.reghscrollthumb = $('<div class="m-datagrid-scrollthumb m-datagrid-scrollthumb-h"></div>')
		.css({height: (me.scrollsize), width: 20})
		.appendTo(hscroll);

	hend = $('<div class="m-datagrid-end m-datagrid-end-h">')
		.css({height: (me.scrollsize), width: 5})
		.appendTo(me.reghscrollthumb);

	me.reghscroll.bind({
		click: function(ev) {
			var dgrid = me;
			if (dgrid.mv == false)
			{
				dgrid.onscrollmouseclick.call(dgrid, me, ev, "h");
			}
			return false;
		}
	});

	me.reghscrollthumb[0].eventtarget = 'horizontal';

	me.reghscrollthumb.bind({
		mousedown: function(ev) {
			var dgrid = me;
			dgrid.mv = true;
			dgrid.onthumbmousedown.call(dgrid, this, ev, "h");
		},
		mouseup: function(ev) {
			var dgrid = me;
			dgrid.onthumbmouseup.call(dgrid, this, ev, "h");
		}
	});

	me._m1/*unitcontainer*/ = $("<div class='chart-unit-content'></div>").appendTo(me.P1/*maincontainer*/).hide();
}

IG$/*mainapp*/._I95/*olapChartView*/.prototype = {
	onthumbmousedown: function(elem, ev, direction) {
		var owner = this;

		if (ev)
		{
			ev.preventDefault();
			ev.stopImmediatePropagation();

			owner.dt1 = new Date().getTime();
			owner.thumbbuttondown = true;
			owner.thumbMouseStartX = ev.pageX;
			owner.thumbMouseStartY = ev.pageY;
			owner.sx = owner.scrollX;
			owner.sy = owner.scrollY;
			owner.isScrolling = true;
			owner.scrolltarget = elem.eventtarget;

			owner.registerGlobalEvent(direction);
		}

		return false;
	},

	onthumbmouseup: function(elem, ev, direction) {
		var me = this,
			owner = me,
			cdt = new Date().getTime();

		if (ev && me.dt1 && me.dt1 > -1 && cdt - me.dt1 < 200)
		{
			var je = $(elem),
				offset = je.offset(),
				px = ev.pageX - offset.left,
				py = ev.pageY - offset.top,
				pw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(je),
				ph = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(je),
				nsx = me.scrollX,
				nsy = me.scrollY,
				step, inc;

			me.dt1 = -1;

			event.stopPropagation();

			if (me.ge)
			{
				$(document).unbind(me.ge);
				me.ge = null;
			}

			me.globalMouseUp.call(me, ev, direction);

			owner.thumbbuttondown = false;
			owner.thumbMouseStartX = -1;
			owner.thumbMouseStartY = -1;

			if (direction == "v")
			{
				inc = (py > ph / 2) ? 0.1 : -0.1;
				step = Math.min(owner.theight - owner.cheight, (owner.cheight - owner.fixedRowHeight) * 0.1);
				nsy = nsy + step * inc;
				nsy = (nsy < 0) ? 0 : Math.min(nsy, owner.theight - owner.cheight);
				
				if (isNaN(nsy))
					return;
			}
			else if (direction == "h")
			{
				inc = (px > pw / 2) ? 0.1 : -0.1;
				step = step = Math.min(owner.twidth - owner.cwidth, (owner.cwidth - owner.fixedColWidth) * 0.1);
				nsx = nsx + step * inc;
				nsx = (nsx < 0) ? 0 : Math.min(nsx, owner.twidth - owner.cwidth);
				
				if (isNaN(nsx))
					return;
			}
			
			if (owner.scrollX != nsx || owner.scrollY != nsy)
			{
				owner.scrollX = nsx;
				owner.scrollY = nsy;

				owner.updateThumbPosition.call(owner);

				// this.reghscrollthumb.css({left: owner.scrollX )

				if (owner.thumbTimer > -1)
				{
					clearTimeout(owner.thumbTimer);
				}

				// owner.thumbTimer = setTimeout(function() {
					owner.onthumbtimer.call(owner);
				//}, 50);
			}
		}
	},

	registerGlobalEvent: function(direction) {
		var owner = this;

		var _globalMouseDown = function(ev) {
			owner.globalMouseDown.call(owner, ev, direction);
			return false;
		};

		var _globalMouseMove = function(ev) {
			ev.stopPropagation();
			owner.mv = true;
			owner.globalMouseMove.call(owner, ev, direction);
			return false;
		};

		var _globalMouseUp = function(ev) {
			ev.stopPropagation();
			owner.mv = true;

			owner.globalMouseUp.call(owner, ev, direction);
			$(document).unbind({
				mousedown: _globalMouseDown,
				mousemove: _globalMouseMove,
				mouseup: _globalMouseUp
			});
			return false;
		};

		this.ge = {
			mousedown: _globalMouseDown,
			mousemove: _globalMouseMove,
			mouseup: _globalMouseUp
		};

		$(document).bind({
			mousedown: _globalMouseDown,
			mousemove: _globalMouseMove,
			mouseup: _globalMouseUp
		});
	},

	globalMouseDown: function(ev, direction) {
	},

	globalMouseMove: function(ev, direction) {
		var owner = this;
		ev.preventDefault();
		ev.stopImmediatePropagation();

		if (owner)
		{
			owner.scrollHandler.call(owner, {x: ev.pageX, y: ev.pageY}, direction);
		}
	},

	globalMouseUp: function(ev, direction) {
		var owner = this;
		owner.isScrolling = false;
		owner.isDragging = false;

		owner.ge = null;

		setTimeout(function(){
			owner.mv = false;
		}, 50);
	},

	scrollHandler: function(pt, direction) {
		var owner = this,
			me = this,
			reghscroll = me.reghscroll,
			reghscrollthumb = me.reghscrollthumb,
			mx = pt.x - owner.thumbMouseStartX,
			nsx = owner.scrollX;

		nsx = Math.min(IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.hscroll), Math.max(0, owner.sx + mx));

		if (owner.scrollX != nsx)
		{
			owner.scrollX = nsx;

			owner.updateThumbPosition.call(owner);

			if (owner.thumbTimer > -1)
			{
				clearTimeout(owner.thumbTimer);
			}

			owner.thumbTimer = setTimeout(function() {
				owner.onthumbtimer.call(owner);
			}, 100);
		}
	},

	onthumbtimer: function() {
		var me = this,
			sx = 0;

		if (me.__sch/*scrollhandler*/ && me.__sch/*scrollhandler*/.f)
		{
			sx = Math.floor((me.scrollX * me.mresult.rows) / me.thumbhwidth);
			me.__sch/*scrollhandler*/.f.call(me.__sch/*scrollhandler*/.o, me, sx);
		}
	},

	updateThumbPosition: function() {
		var me = this,
			thumbsize = 30,
			hpos = (this.scrollX * this.sh);

		this.reghscrollthumb.css({left: Math.min(this.scrollX, IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.hscroll) - IG$/*mainapp*/.x_10/*jqueryExtension*/._w(this.reghscrollthumb))});
	},

	onscrollmouseclick: function(elem, ev, direction) {
		var owner = this;

		ev.stopPropagation();

		var nsx = owner.scrollX,
			inc = 0,
			step,
			offset = owner.reghscrollthumb.offset();

		inc = (offset.left > ev.pageX) ? -1 : 1;
		step = owner.thumbhwidth * owner.sh;
		nsx += step * inc;
		nsx = Math.floor(nsx);
		nsx = Math.min(IG$/*mainapp*/.x_10/*jqueryExtension*/._w(owner.hscroll) - owner.thumbcalc, Math.max(0, nsx));
		if (owner.scrollX == nsx)
			return;

		owner.scrollX = nsx;

		owner.updateThumbPosition.call(owner);

		clearTimeout(owner.thumbTimer);

		owner.thumbTimer = setTimeout(function() {
			owner.onthumbtimer.call(owner);
		}, 50);
	},

	pj3/*setFilterInfo*/: function(desc) {
		var me = this,
			fcontainer = me.PJ3/*fcontainer*/,
			items,
			i, d, value;

		if (desc && desc != "")
		{
			if (me.ddt/*drillDepth*/ > 0)
			{
				// fcontainer.css({top: 30});
			}
			items = desc.split("\n");
			d = "";
			for (i=0; i < items.length; i++)
			{
				if (items[i] != "")
				{
					value = items[i].substring(0, 40);
					d = (d == "") ? value : d + "<br>" + value;
				}
			}
			if (d != "")
			{
				fcontainer.html(d).show();
			}
			
			clearTimeout(me.__fc);
			
			me.__fc = setTimeout(function() {
				fcontainer.fadeOut();
			}, 2000);
		}
		else
		{
			fcontainer.empty();
			fcontainer.hide();
		}
	},

	pj4/*showHideSelection*/: function(visible) {
		var me = this,
			scontainer = me.PJ4/*scontainer*/;

		if (visible == true)
		{
			scontainer.show();
		}
		else if (visible === false)
		{
			scontainer.hide();
		}
		else
		{
			scontainer.toggle();
		}
	},

	Mm12/*invalidateSize*/: function(w, h) {
		var chartview = this;

		var p1 = chartview.P1/*maincontainer*/,
			p2 = chartview.PJ2/*jcontainer*/;

		h = h - 10;

		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(p2, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(p2, h);

		this.cwidth = w;
		this.cheight = h;

		if (chartview.rfctimer > -1)
		{
			clearTimeout(chartview.rfctimer);
		}

		chartview.rfctimer = setTimeout(
			function() {
				chartview.Mm12a/*updateDisplayList*/.call(chartview, w, h);
			}, 200);
	},

	Mm12a/*updateDisplayList*/: function(w, h) {
		var me = this,
			treemap = me.treemap,
			bindc = me.bindc,
			chartdrawing,
			scontainer = me.PJ4/*scontainer*/,
			i, tw, th, n,
			pielayout = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.cco/*chartOption*/.pielayout : null;

		me.rfctimer = -1;

		if (Math.abs(me.pw - w) < 5 && Math.abs(me.ph - h) < 5)
		{
			return;
		}

		me.pw = w;
		me.ph = h;

		if (me.pw < 5 || me.ph < 5)
		{
			return;
		}

		switch (me.drawmode)
		{
		case "highchart":
			if (me._mc/*masterCharts*/ && me._mc/*masterCharts*/.length > 0)
			{
				if (pielayout == "h")
				{
					tw = w / me._mc/*masterCharts*/.length;
					th = h;
				}
				else if (pielayout == "h")
				{
					th = h / me._mc/*masterCharts*/.length;
					tw = w;
				}
				else
				{
					tw = w;
					th = h;
				}

				// for (i=0; i < me._mc/*masterCharts*/.length; i++)
				$.each(me._mc/*masterCharts*/, function(i, mchart) {
					$(mchart.renderTo).css({
						position: "absolute",
						left: (pielayout == "h" ? tw * i : 0),
						top: (pielayout == "v" ? th * i : 0),
						width: tw,
						height: th
					});

					mchart.setSize.call(mchart, tw, th, doAnimation = true);
					mchart.renderTo && $(mchart.renderTo).hide().show(0);
				});
			}
			break;
		case "echart":
			if (me._mc/*masterCharts*/ && me._mc/*masterCharts*/.length > 0)
			{
				if (pielayout == "h")
				{
					tw = w / me._mc/*masterCharts*/.length;
					th = h;
				}
				else if (pielayout == "h")
				{
					th = h / me._mc/*masterCharts*/.length;
					tw = w;
				}
				else
				{
					tw = w;
					th = h;
				}

				// for (i=0; i < me._mc/*masterCharts*/.length; i++)
				$.each(me._mc/*masterCharts*/, function(i, mchart) {
					$(mchart.renderTo).css({
						position: "absolute",
						left: (pielayout == "h" ? tw * i : 0),
						top: (pielayout == "v" ? th * i : 0),
						width: tw,
						height: th
					});

					mchart.resize.call(mchart, {width: tw, height: th});
				});
			}
			break;
		case "treemap":
			if (treemap && treemap.map)
			{
				// treemap.position.call(treemap, treemap.data.dom, 0, treemap.ti, w, h - treemap.ty);
				// treemap.layout.call(treemap, treemap.data, me.ti, w, h - treemap.ty);
				treemap.box.css({
					top: treemap.ty,
					left: 0,
					width: w,
					height: h - treemap.ty
				});

				treemap.map.setSize(w, h - treemap.ty);
				treemap.map.renderTo && $(treemap.map.renderTo).hide().show(0);
			}
			break;
		case "bindc":
			if (bindc && bindc.container)
			{
				IG$/*mainapp*/.x_10/*jqueryExtension*/._w(bindc.container, w);
				IG$/*mainapp*/.x_10/*jqueryExtension*/._h(bindc.container, h);
			}
			break;
		case "qavis":
			if(me.qavis)
			{
				me.qavis.c9/*updateDisplayList*/.call(me.qavis);
			}
			break;
		case "dcust":
			if (me.dcust)
			{
				me.dcr/*drawChartResult*/(w, h);
			}
			break;
		case "protovis":
			if (me.vis)
			{
				$(me.container).empty();
				me.vis = null;
				
				me.dcr/*drawChartResult*/(w, h);
			}
			break;
		case "bubblemap":
			if (me.bmap)
			{
				me.dcr/*drawChartResult*/(w, h);
			}
			break;
		case "custom":
			if (me.customchart)
			{
				// me.dcr/*drawChartResult*/(w, h);
				me.customchart.updatedisplay.call(me.customchart, me, w, h);
			}
		}
	},

	Umx/*updateSelection*/: function(filters, cols, box) {
		var me = this,
			fs = filters,
			cs = cols,
			bx = box;
		if (me.uMX/*updateSelectionTimer*/)
		{
			clearTimeout(me.uMX/*updateSelectionTimer*/);
		}

		me.uMX/*updateSelectionTimer*/ = setTimeout(function() {
			me.aUmx/*updateSelection*/.call(me, fs, cs, bx);
		}, 800);
	},

	aUmx/*updateSelection*/: function(filters, cols, box) {
		var me = this,
			mresult = me.mresult,
			data = mresult.data,
			fc = mresult.colfix,
			fr = mresult.rowfix,
			tc = (data.length > 0) ? data[0].length : 0,
			i, j, n,
			sel = [], fname, filter, v, col, val,
			scontainer = me.PJ4/*scontainer*/,
			p1, p2;

		if (filters)
		{
			for (i=fr; i < data.length; i++)
			{
				// filter names
				v = true;
				for (j=0; j < cols.length; j++)
				{
					fname = cols[j];
					filter = filters[fname];

					if (filter && isNaN(filter.min) == false && isNaN(filter.max) == false)
					{
						col = j + fc;
						val = data[i][col].code;
						val = (val != "") ? Number(val) : 0;
						if (val < filter.min || val > filter.max)
						{
							v = false;
							break;
						}
					}
				}

				if (v)
				{
					sel.push(i);
				}
			}
		}
		else if (box && cols)
		{
			for (i=0; i < cols.length; i++)
			{
				if (cols[i] == box.px)
				{
					px = i+fc;
				}
				else if (cols[i] == box.py)
				{
					py = i+fc;
				}
			}

			for (i=fr; i < data.length; i++)
			{
				v = true;
				p1 = data[i][px].code;
				p2 = data[i][py].code;
				p1 = (p1 != "") ? Number(p1) : 0;
				p2 = (p2 != "") ? Number(p2) : 0;
				p1 = (isNaN(p1) ? 0 : p1);
				p2 = (isNaN(p2) ? 0 : p2);

				if (p1 < box.x1 || p1 > box.x2 || p2 < box.y1 || p2 > box.y2)
				{
					v = false;
				}

				if (v)
				{
					sel.push(i);
				}
			}
		}

		// update table
		var sbox = me.PJ4a/*sbox*/,
			tb = $("<table></table>"),
			th;

		sbox.empty();
		$("<span>" + (sel.length) + " / " + data.length + " Items selected</span>&nbsp;&nbsp;&nbsp;&nbsp;<br><br>").appendTo(sbox);
		var clipbutton = $("<div class='clipbutton'>Select All</div>").appendTo(sbox);
		clipbutton.bind("click", function() {
			IG$/*mainapp*/._I47/*selectAll*/(tb);
		});
		tb.appendTo(sbox);

		for (i=0; i < fr; i++)
		{
			th = $("<tr></tr>").appendTo(tb);

			for (j=0; j < tc; j++)
			{
				th.append($("<th>" + data[i][j].text + "</th>"));
			}
		}

		for (i=0; i < sel.length; i++)
		{
			th = $("<tr></tr>").appendTo(tb);
			n = sel[i];
			for (j=0; j < tc; j++)
			{
				th.append($("<td>" + data[n][j].text + "</td>"));
			}
		}

		tb.bind("selectstart", function() {
			return true;
		});
	},


	JJ$6/*drawBubbleMap*/: function(mresult) {
		var i,
			j,
			data = mresult.data,
			fc = mresult.colfix,
			fr = mresult.rowfix,
			title,
			fields = [],
			matrixdata = [],
			row,
			tn,
			c,
			r,
			nval = 0,
			me = this,
			xs = [], ys = [], bubbledata = [],
			xmap = {}, ymap = {}, axisx = [], axisy = [], xinc=0, yinc=0,
			bmaprow = me.cop.bmaprow,
			bmapyaxis = me.cop.bmapyaxis,
			isbmapyaxis;

		me.drawmode = "bubblemap";

		if (bmapyaxis == false && fc == 2)
		{
			isbmapyaxis = false;
			for (i=fr; i < data.length; i++)
			{
				if (data[i].length > fc)
				{
					nval = Number(data[i][fc].code) || 0;
					nval = (nval < 0) ? 0 : nval;
				}
				
				if (nval > 0)
				{
					bubbledata.push(nval);
					
					for (j=0; j < fc; j++)
					{
						c = data[i][j];
						tn = c.text || c.code;
						if (j == 0)
						{
							if (!xmap[tn])
							{
								xmap[tn] = {
									inc: xinc++
								};
								axisx.push(tn);
							}
							xs.push(xmap[tn].inc);
						}
						else if (j == 1)
						{
							if (!ymap[tn])
							{
								ymap[tn] = {
									inc: yinc++
								};
								axisy.push(tn);
							}
							ys.push(ymap[tn].inc);
						}
					}
				}
			}
		}
		else
		{
			isbmapyaxis = true;
			var rowval;
			for (i=0; i < fr; i++)
			{
				for (j=fc; j < data[i].length; j++)
				{
					c = data[i][j];
					tn = c.text || c.code;
					if (i == 0)
					{
						axisy.push(tn);
					}
					else
					{
						axisy[j-fc] += me._sep + tn;
					}
				}
			}

			for (i=fr; i < data.length; i++)
			{
				rowval = "";
				for (j=0; j < data[i].length; j++)
				{
					c = data[i][j];
					tn = c.text || c.code;
					if (j < fc)
					{
						rowval = (j == 0) ? tn : rowval + me._sep + tn;
					}
					else
					{
						if (j == fc)
						{
							axisx.push(rowval);
						}
						xs.push(i-fr);
						ys.push(j - fc);

						nval = Number(tn) || 0;
						nval = (nval < 0) ? 0 : nval;
						bubbledata.push(nval);
					}
				}
			}
		}

		r = me.bmap = Raphael(me.container);

		var jdom = $(me.container),
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom);
			
		if (bubbledata.length)
		{
			r.dotchart(0, 0, w, h, xs, ys, bubbledata, {
				symbol: "o",
				max: me.cop.bmapsize,
				heat: true,
				axis: "0 0 1 1",
				axisxstep: Math.min(axisx.length-1, 20),
				axisystep: Math.min(axisy.length-1, 20),
				axisxlabels: axisx,
				axisxtype: " ",
				axisytype: " ",
				axisylabels: axisy
			}).hover(function () {
				this.marker = this.marker || r.tag(this.x, this.y,
					axisx[this.X] + "\n" + axisy[this.Y] + "\n" + this.value
				, 0, this.r + 2).insertBefore(this);
				this.marker.show();
			}, function () {
				this.marker && this.marker.hide();
			}).click(function() {
				var sender = null,
					param = null;
	
				if (isbmapyaxis == false)
				{
					sender = {
						name: axisx[this.X] + IG$/*mainapp*/.sX/*seperator*/ + axisy[this.Y]
					},
					param = {
						point: {
							category: this.value
						}
					};
				}
				else
				{
					sender = {
						name: axisx[this.X]
					},
					param = {
						point: {
							category: axisy[this.Y]
						}
					};
				}
	
				(sender && param) &&
				me.p1/*processClickEvent*/.call(me, sender, param);
			});
		}
	},


	disposeContent: function(ui) {
		var i,
			cobj,
			hc;

		for (i=ui._mc/*masterCharts*/.length - 1; i>= 0; i--)
		{
			try
			{
				cobj = ui._mc/*masterCharts*/[i];
				cobj && cobj.destroy && cobj.destroy();
				cobj && cobj.dispose && cobj.dispose();
			}
			catch (e)
			{
			}
			ui._mc/*masterCharts*/[i] = null;
		}

		ui._mc/*masterCharts*/ = [];
		
		$(".i-sschart-cnt", ui.container).empty();
		
		if (ui.customchart && ui.customchart.destroy)
		{
			ui.customchart.destroy();
			ui.customchart = null;
		}
		
		if (ui.vis)
		{
			$(ui.container).empty();
			ui.vis = null;
		}

//		if (ui.masterChart != null && typeof ui.masterChart != "undefined")
//		{
//			ui.masterChart && ui.masterChart.destroy();
//			ui.masterChart = null;
//		}
	},

	dcr/*drawChartResult*/: function (w, h, isthumb, ispageview) {
		var cret = null,
			me = this,
			mresult = me.mresult,
			charttype,
			cop,
			cinfo,
			useformula,
			timeseriesfield,
			ps = false,
			bdatas, tw;

		me.pw = (w > 0 ? w : me.pw);
		me.ph = (h > 0 ? h : me.ph);

		me._m1/*unitcontainer*/.hide();

		if (mresult)
		{
			if (ispageview == false)
			{
				if (mresult.pagestart > 0 && me.scrollX == 0)
				{
					isthumb = true;
					ps = true;
					var mcr = me._ILb/*sheetoption*/.cco/*chartOption*/,
						maxchartresult = mcr.maxchartresult;

					bdatas = Math.min(mresult.data.length, (maxchartresult > 0 ? maxchartresult : mresult.data.length));
					me.sh = bdatas / mresult.rows;
					me.scrollX = (mresult.pagestart + 20) * w / mresult.rows;
				}
			}

			if (!isthumb)
			{
				me.sh = 1;
				me.scrollX = 0;
			}

			me.cop = me._ILb/*sheetoption*/.cco/*chartOption*/;
			cop = me.cop;
			me.rct/*rendercharttype*/ = cop.charttype;
			me.rcs/*rendersubtype*/ = cop.subtype;
			useformula = cop.useformula;
			timeseriesfield = cop.timeseriesfield;

			if (cop.cunittext)
			{
				me._m1/*unitcontainer*/.empty();
				me._m1/*unitcontainer*/.append("<span>" + cop.cunittext + "</span>");
				me._m1/*unitcontainer*/.show();
			}

			me.pj3/*setFilterInfo*/(mresult.f_/*filterdesc*/ || "");

			if (me.ddt/*drillDepth*/ > 0 && cop.drillcharttype && cop.drillcharttype.length > me.ddt/*drillDepth*/ - 1 && cop.drillcharttype[me.ddt/*drillDepth*/ - 1] != "")
			{
				cinfo = cop.getChartInfo(parseInt(cop.drillcharttype[me.ddt/*drillDepth*/ - 1]));
				me.rct/*rendercharttype*/ = cinfo.charttype;
				me.rcs/*rendersubtype*/ = cinfo.subtype;
			}

			if (me.rct/*rendercharttype*/ == "map")
			{
				me.isHighChart = false;
				me.l3/*drawMapChart*/(mresult);
			}
			else if (me.rct/*rendercharttype*/ == "treemap")
			{
				me.isHighChart = false;
				me.ti = 0;
				me.l3a/*drawTreeMapChart*/(mresult);
			}
			else if (me.rct/*rendercharttype*/ == "bindc")
			{
				me.isHighChart = false;
				me.l3b/*drawIndicator*/(mresult, me.rct/*rendercharttype*/);
			}
			else if (me.rct/*rendercharttype*/ == "matrix")
			{
				me.isHighChart = false;
				me.JJ$3/*drawMatrixChart*/(mresult);
			}
			else if (me.rct/*rendercharttype*/ == "bubblemap")
			{
				me.isHighChart = false;
				me.JJ$6/*drawBubbleMap*/(mresult);
			}
			else if (window.d3 && (me.rct/*rendercharttype*/ == "parallel" ||
					 me.rct/*rendercharttype*/ == "performancemap" ||
					 me.rct/*rendercharttype*/ == "boxplot" ||
					 me.rct/*rendercharttype*/ == "networkdiagram_pos" ||
					 me.rct/*rendercharttype*/ == "networkdiagram_neg" ||
					 me.rct/*rendercharttype*/ == "matrixdiagram" ||
					 me.rct/*rendercharttype*/ == "anderson" ||
					 me.rct/*rendercharttype*/ == "forcelayout" ||
					 me.rct/*rendercharttype*/ == "chord" ||
					 me.rct/*rendercharttype*/ == "sunburst"))
			{
				me.isHighChart = false;
				me.JJ$4/*drawProtovisChart*/(me.rct/*rendercharttype*/, mresult);
			}
			else if (window.d3 && (me.rct/*rendercharttype*/ == "bullet" ||
					 me.rct/*rendercharttype*/ == "nation"))
			{
				me.isHighChart = false;
				me.JJ$4a/*drawD3CustomChart*/(me.rct/*rendercharttype*/, mresult);
			}
			else if (IG$/*mainapp*/.__c_/*chartoption*/ && IG$/*mainapp*/.__c_/*chartoption*/.chartext && IG$/*mainapp*/.__c_/*chartoption*/.chartext[me.rct/*rendercharttype*/])
			{
				me.drawmode = "custom";
				me.isHighChart = false;
				if (!me.customchart)
				{
					me.customchart = new IG$/*mainapp*/.__c_/*chartoption*/.chartext[me.rct/*rendercharttype*/](me);
				}
				try
				{
					me.customchart.drawChart.call(me.customchart, me, mresult);
				}
				catch (e)
				{
					setTimeout(function() {
						IG$/*mainapp*/._I52/*ShowError*/("Error on chart drawing : " + e.message);
					}, 100);
				}
			}
			else
			{
				me.isHighChart = true;
				cret = me._l1/*drawCartesian*/(mresult, w, h, (ps ? false : isthumb));
			}

			if (!isthumb || ps == true)
			{
				if (me.sh < 1)
				{
					tstyle = {left: 0};
					tstyle.width = w;
					
					me.reghscroll.show();
					me.thumbhwidth = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.hscroll); //  * me.sh;
					thumbcalc = Math.max(30, me.thumbhwidth * me.sh);
					me.thumbcalc = thumbcalc;
					me.reghscrollthumb.css({left: Math.min(me.scrollX, me.thumbhwidth - thumbcalc), width: thumbcalc});
					
					me.reghscroll.css(tstyle);
					me.regh = true;
				}
				else
				{
					me.regh = false;
					me.reghscroll.hide();
				}
			}
		}

		return cret;
	},

	l1/*entryLoginMap*/: function(thisobj) {
		this.l3/*drawMapChart*/(this.mresult);
	},

	l2/*loadMapData*/: function(sloc, ploc, mapid, keyname, cview) {
		var panel = this;
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel,
			{
				ack: "11",
				payload: "<smsg><item code='" + sloc + "' pcode='" + ploc + "'/></smsg>",
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "geomap"})
			}, panel, panel.rs_l2/*loadMapData*/, null, [mapid, keyname, cview]);
		req._l/*request*/();
	},


	rs_l2/*loadMapData*/: function(xdoc, params) {
		var mnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/MapData");
		var mapid = params[0];
		var keyname = params[1];
		var cview = params[2];

		if (mnode != null)
		{
			var map = new IG$/*mainapp*/._IFa/*clMapLoc*/(mapid);
			map.keyname = keyname;
			map.parseMapData(mnode);
			IG$/*mainapp*/._I5f/*geoDatas*/[mapid] = map;

			cview.l3/*drawMapChart*/(cview.mresult);
		}
	},

	area: function(pts) {
	   var area=0;
	   var nPts = pts.length;
	   var j=nPts-1;
	   var p1; var p2;

	   for (var i=0;i<nPts;j=i++) {
		  p1=pts[i]; p2=pts[j];
		  area+=p1.lng*p2.lat;
		  area-=p1.lat*p2.lng;
	   }
	   area/=2;
	   return area;
	},

	

	l3b/*drawIndicator*/: function(mresult, ctype) {
		var me = this,
			indc = null,
			dp = [],
			ea = [],
			ma = [],
			i, j,
			r, mvalue, cols = (mresult.data.length > 0 ? mresult.data[0].length : 0);

		for (i=mresult.rowfix; i < mresult.data.length; i++)
		{
			r = [];
			for (j=0; j < mresult.data[i].length; j++)
			{
				mvalue = mresult.data[i][j].code || mresult.data[i][j].text;
				r.push(mvalue);
			}
			dp.push(r);
		}

		for (i=0; i < mresult.colfix; i++)
		{
			ea.push({
				i: i
			});
		}

		for (i=mresult.colfix; i < cols; i++)
		{
			ma.push({
				i: i
			});
		}

		switch (ctype)
		{
		case "bindc":
			indc = new m$Bl($(me.container));
			indc.ea = ea;
			indc.ma = ma;
			indc.mv = null;
			break;
		}

		if (indc)
		{
			indc.loadData.call(indc, dp);
		}

		me.drawmode = ctype;
		me.bindc = indc;
	},
	
	_s1/*selectPointsByDrag*/: function(chart, e) {
		Highcharts.each(chart.series, function (series) {
            Highcharts.each(series.points, function (point) {
                if (point.x >= e.xAxis[0].min && point.x <= e.xAxis[0].max && point.y >= e.yAxis[0].min && point.y <= e.yAxis[0].max) 
                {
                    point.select(true, true);
                }
            });
        });
		
        var points = chart.getSelectedPoints.call(chart);

        this.p1/*processClickEvent*/(chart, points);
	},
	
	_s3/*unselectByClick*/: function(chart, e, isdrill) {
		var me = this,
			points = chart.getSelectedPoints(),
			ctime = new Date().getTime();
		
		if (me.rcs/*rendersubtype*/ == "syncchart")
		{
	        if (points.length > 0) 
	        {
	            Highcharts.each(points, function (point) {
	                point.select(false);
	            });
	        }
	    }
        else
        {
        	if (me._st && (ctime - me._st) < 500)
        	{
        		if (points.length > 0) 
		        {
		            Highcharts.each(points, function (point) {
		                point.select(false);
		            });
		        }
		        
        		me.p1/*processClickEvent*/.call(me, chart, null);
        	}
        	
        	me._st = ctime;
        }
	},
	
	u_/*measureTextSize*/: function(size, text) {
		var me = this,
			cobj = {
				fontSize: size
			},
			s = {};
			
		if (!me.measurediv)
		{
			me.measurediv = $('<div class="m-datagrid-cell-measure"></div>')
				.appendTo($("body"));
		}
		
		me.measurediv.show();
		me.measurediv.css(cobj);
		me.measurediv.html(text || "&nbsp;");
		
		s.height = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.measurediv); // .height();
		s.width = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.measurediv); // .width() + 2;
		
		return s;
	},
	
	dP/*getPieLabel*/: function(piedatalabel, tobj) {
		var fmt = piedatalabel || "<b>{name}</b>: {percent} %",
			n;
		n = fmt.indexOf("{name}");
		if (n > -1)
		{
			fmt = fmt.substring(0, n) + tobj.point.name + fmt.substring(n + "{name}".length);
		}
		n = fmt.indexOf("{percent}");
		if (n > -1)
		{
			fmt = fmt.substring(0, n) + Highcharts.numberFormat(tobj.percentage, 1) + fmt.substring(n + "{percent}".length);
		}
		n = fmt.indexOf("{value}");
		if (n > -1)
		{
			fmt = fmt.substring(0, n) + (tobj.point.fval || Highcharts.numberFormat(tobj.y, 0)) + fmt.substring(n + "{value}".length);
		}
		return fmt;
	},

	_l1/*drawCartesian*/: function (mresult, w, h, isthumb) {
		var i,
			j,
			data = mresult.data,
			fc = mresult.colfix,
			fr = mresult.rowfix,
			hidden_columns = mresult.hidden_columns || {},
			hasdualaxis,
			me = this,

			xticks = [],
			n = 1,
			ename,
			series = [],
			ci,
			labels = [],
			bpointchart = 0,
			bpolarchart = 0,
			bscatter = 0,
			bfixedp = 0,
			bsync = 0,
			bsync_l = -1,
			bdatas,
			cfr,
			scrollX,
			
			mcr = me._ILb/*sheetoption*/.cco/*chartOption*/,
			swapaxis = mcr.swapaxis,
			useformula = mcr.useformula,
			maxchartresult = mcr.maxchartresult,
			timeseriesfield = mcr.timeseriesfield,
			useformatvalue = mcr.useformatvalue,
			measures = me._ILb/*sheetoption*/.measures,
			f, _c, _uc, _fc,
			lbl, lbl_i, lbl_c, lbl_k, lblnames = {},
			mtitle,
			cf = [];

		var tc = (data && data.length > 0) ? data[0].length : 0;
		var tr = (data ? data.length : 0);

		// line, spline, area, areaspline, column, bar, pie and scatter
		var rcs/*rendersubtype*/ = me.rcs/*rendersubtype*/,
			spvalue = [];

		me.drawmode = "highchart";

		if (rcs/*rendersubtype*/ == "radar")
		{
			bpolarchart = 1;
		}
		else if (rcs/*rendersubtype*/ == "fixedplacement")
		{
			bfixedp = 1;
		}
		else if (rcs/*rendersubtype*/ == "syncchart")
		{
			bsync_l = (measures && measures.length > 1) ? measures.length : -1;
			bsync = bsync_l > 1 ? 1 : 0;
		}
		
		bdatas = Math.min(data.length, (maxchartresult > 0 ? maxchartresult : data.length));
		me._dlen = bdatas;
		cfr = fr;
		
		if (!isthumb)
		{
			if (mresult.pagestart > 0 || mresult.rows > mresult.pageend)
			{
				me.sh = bdatas / mresult.rows;
			}
			else if (maxchartresult > 0 && maxchartresult < data.length)
			{
				me.sh = maxchartresult / data.length;
			}
		}
		else
		{
			scrollX = Math.floor((me.scrollX * mresult.rows) / me.thumbhwidth);
			cfr += scrollX;
			bdatas = Math.min(data.length, bdatas + scrollX);
		}
		
		var coptions = [],
			coption = {},
			titleposition = mcr.titleposition || "",
			c_cset = mcr.colorset || mresult.c_cset,
			spacingBottom = 1;
		
		if (IG$/*mainapp*/.__c_/*chartoption*/ && IG$/*mainapp*/.__c_/*chartoption*/.chartcolors && IG$/*mainapp*/.__c_/*chartoption*/.chartcolors[c_cset])
		{
			coption.colors =  IG$/*mainapp*/.__c_/*chartoption*/.chartcolors[c_cset];
		}

		if (fc+1 < tc && (rcs/*rendersubtype*/ == "scatter" || rcs/*rendersubtype*/ == "bubble"))
		{
			var s,
				pvalue;
				//pmax = null,
				// pmin = null,
				// prange = null,
				// zvalue;

			bpointchart = 1;

			if (rcs/*rendersubtype*/ == "bubble")
			{
				bscatter = 1;
				
//				if (!swapaxis && fc+2 < tc)
//				{
//					bscatter = 1;
//
//					for (i=fr; i < data.length; i++)
//					{
//						zvalue = me.mvalue(data[i][fc+2], useformatvalue) || 0;
//						pmax = (i == fr) ? zvalue : Math.max(pmax, zvalue);
//						pmin = (i == fr) ? zvalue : Math.min(pmin, zvalue);
//					}
//
//					prange = 30 / (pmax - pmin);
//				}
//				else if (swapaxis && fr+2 < tr)
//				{
//					bscatter = 1;
//
//					for (i=fc; i < tc; i++)
//					{
//						zvalue = me.mvalue(data[fr+2][i], useformatvalue) || 0;
//						pmax = (i == fc) ? zvalue : Math.max(pmax, zvalue);
//						pmin = (i == fc) ? zvalue : Math.min(pmin, zvalue);
//					}
//
//					prange = 30 / (pmax - pmin);
//				}
			}

			if (swapaxis)
			{
				for (i=fc; i < Math.min(tc, (maxchartresult > 0 ? maxchartresult : tc)); i++)
				{
					var val = {x: me.mvalue(data[fr][i], useformatvalue), y: me.value(data[fr+1][i], useformatvalue)};

					if (bscatter && fr+2  < tr)
					{
						zvalue = me.mvalue(data[fr+2][i], useformatvalue);
//						zvalue = (zvalue - pmin) * prange + 2;

//						val.marker = {
//							radius: zvalue
//						}
						val.z = zvalue;
					}

					var sname;
					for (j=0; j < fr; j++)
					{
						sname = (j == 0) ? data[j][i].text : sname + me._sep + data[j][i].text;
					}

					val.name = sname;
					val.datarow = j;

					cvalue = data[0][j].text;

					if (cvalue != pvalue)
					{
						s = new Object();
						s.name = cvalue;
						s.data = [val];
						series.push(s);
					}
					else if (s)
					{
						s.data.push(val);
					}

					pvalue = cvalue;
				}
			}
			else
			{
				for (i=fr; i < Math.min(data.length, (maxchartresult > 0 ? maxchartresult : data.length)); i++)
				{
					var val = {x: me.mvalue(data[i][fc], useformatvalue), y: me.mvalue(data[i][fc+1], useformatvalue)};

					if (bscatter && fc+2  < tc)
					{
						zvalue = me.mvalue(data[i][fc+2], useformatvalue);
//						zvalue = (zvalue - pmin) * prange + 2;

//						val.marker = {
//							radius: zvalue
//						};
						val.z = zvalue;
					}

					var sname;
					for (j=0; j < fc; j++)
					{
						sname = (j == 0) ? data[i][j].text : sname + me._sep + data[i][j].text;
					}

					val.name = sname;
					val.datarow = i;

					cvalue = data[i][0].text;

					if (cvalue != pvalue)
					{
						s = new Object();
						s.name = cvalue;
						s.data = [val];
						series.push(s);
					}
					else if (s)
					{
						s.data.push(val);
					}

					pvalue = cvalue;
				}
			}
		}
		else
		{
			if (swapaxis == true)
			{
				for (i=fr; i < tr; i++)
				{
					for (j=0; j < fc; j++)
					{
						lbl_i = data[i][j].text;
						lbl = (j==0) ? lbl_i : lbl + lbl_i;
					}
					var s = new Object();
					s.name = lbl;
					s.data = [];
					series.push(s);
					spvalue.push(0);
				}
			}
			else
			{
				for (i=fc; i < tc; i++)
				{
					lbl_k = -1;
					lbl = "";
					if (bsync)
					{
						for (j=0; j < fr; j++)
						{
							lbl_c = data[j][i];
							if (lbl_c.position == 3)
							{
								lbl_k = lbl_c.pindex;
								lblnames[lbl_k] = lbl_c.text;
								continue;
							}
							lbl_i = lbl_c.text;
							lbl = (j==0) ? lbl_i : lbl + me._sep + lbl_i;
						}
					}
					else
					{
						for (j=0; j < fr; j++)
						{
							lbl_i = data[j][i].text;
							lbl = (j==0) ? lbl_i : lbl + me._sep + lbl_i;
						}
					}
					var s = new Object();
					s.name = lbl || lblnames[lbl_k];
					s.meas_k = lbl_k;
					s.data = [];
					series.push(s);
					spvalue.push(0);
				}
			}

			var m = Math.max((swapaxis == true ? tc : data.length), 20),
				bformula = false,
				iswaterfall = me.rcs/*rendersubtype*/ == "waterfall" && mcr.stack == false,
				np,
				_com;

			if (swapaxis == true)
			{
				for (i=fc; i < Math.min(tc, (maxchartresult > 0 ? maxchartresult : tc)); i++)
				{
					bformula = false;

					for (j=0; j < fr; j++)
					{
						ename = (j == 0) ? data[j][i].text : ename + IG$/*mainapp*/.sX/*seperator*/ + data[j][i].text;
						if (data[j][i].position == 4)
						{
							bformula = true;
							break;
						}
					}
					if (bformula == false || useformula == true)
					{
						ci = 0;
						for (j=fr; j < tr; j++)
						{
							var f = me.mvalue(data[j][i], useformatvalue);
							if (isNaN(f) == true)
							{
								series[ci].data.push(null);
							}
							else
							{
								if (bpolarchart)
								{
									series[ci].data.push(f);
								}
								else
								{
									// series[ci].data.push([ename, f]);
									np = series[ci].data.length;
									series[ci].data.push({
										name: ename,
										x: i - fc,
										y: (iswaterfall && np > 0) ? f - spvalue[ci] : f,
										fval: data[j][i].text
									});

									spvalue[ci] = f;
								}
							}
							ci++;
						}

						xticks.push(ename);
						n++;
					}
				}
			}
			else
			{
				_uc = (tc == fc+1) ? 1 : 0;
				
				for (i=cfr; i < bdatas; i++)
				{
					bformula = false;
					_c = null;
					ename = "";

					for (j=0; j < fc; j++)
					{
						if (typeof(hidden_columns[j]) != "undefined")
							continue;
						
						ename = (!ename) ? data[i][j].text : ename + IG$/*mainapp*/.sX/*seperator*/ + data[i][j].text;
						if (data[i][j].position == 4)
						{
							bformula = true;
							break;
						}
						_c = _uc && data[i][j].cc ? data[i][j].cc : _c;
					}
					if (bformula == false || useformula == true)
					{
						ci = 0;
						for (j=fc; j < tc; j++)
						{
							f = me.mvalue(data[i][j], useformatvalue);
							
							if (isNaN(f) == true)
							{
								series[ci].data.push({
									name: ename,
									x: i - cfr,
									y: null,
									fval: null
								});
							}
							else
							{
								if (bpolarchart)
								{
									series[ci].data.push(f);
								}
								else
								{
									// series[ci].data.push([ename, f]);
									np = series[ci].data.length;
									_com = {
										name: ename,
										x: i - cfr,
										y: (iswaterfall && np > 0) ? f - spvalue[ci] : f,
										fval: data[i][j].text
									};
									
									if (!_c && data[i][j].cm > -1)
									{
										var colors = coption.colors || (Highcharts.theme ? Highcharts.theme.colors : null) || Highcharts.getOptions().colors;
										if (colors)
										{
											_fc = me._int/*interpolate*/(data[i][j].cm, colors[ci % colors.length]);
										}
									}
									
									if (_c || _fc)
									{
										_com.color = _c || _fc;
									}
									
									_fc = 0;
									
									series[ci].data.push(_com);

									spvalue[ci] = f;
								}
							}
							ci++;
						}

						xticks.push(ename);
						n++;
					}
				}
			}
		}

		coption.chart = {
			animation: false,
			renderTo: me.container,
			defaultSeriesType: (bfixedp ? null : "area"),
			reflow: false,
			alignTicks: true,
			borderWidth: 0,
			spacingBottom: spacingBottom
		};

		if (bpolarchart)
		{
			coption.chart.polar = true;
			coption.pane = {
				size: "80%"
			};
		}

		if (mcr.showtitle == true)
		{
			coption.title = {text: mcr.title};

			if (titleposition.indexOf("BOTTOM_") > -1)
			{
				coption.title.floating = true;
				coption.chart.marginBottom  = 50;
				coption.title.y = h - 30;
			}

			if (titleposition.indexOf("_LEFT") > -1)
			{
				coption.title.align = "left";
			}
			else if (titleposition.indexOf("_RIGHT") > -1)
			{
				coption.title.align = "right";
			}
		}
		else
		{
			coption.title = {
				text: ""
			};
		}
		
		if (!bfixedp)
		{
			coption.chart.defaultSeriesType = IG$/*mainapp*/._I36/*getSeriesType*/(rcs);
		}

		// coption.subtitle = {text: "Source:"};
		
		if (mcr.enabledragselect)
		{
			coption.chart.zoomType = "xy";
			coption.chart.events = {
				selection: function(e) {
					me._s1/*selectPointsByDrag*/.call(me, this, e);
					return false; // Don't zoom
				},
            	click: function(e) {
            		me._s3/*unselectByClick*/.call(me, this, e, 1);
            	}
            };
		}
		else
		{
			coption.chart.events = {
            	click: function(e) {
            		me._s3/*unselectByClick*/.call(me, this, e, 0);
            	}
            };
		}
			
		if (!bpointchart)
		{
			if (mcr.enablezoom && !mcr.enabledragselect)
			{
				coption.chart.zoomType = "xy";
			}
			
			var xlabels = {
				labels: {
					maxStaggerLines: 2,
					formatter: function() {
						// var s = (this.value.split ? this.value.split(IG$/*mainapp*/.sX/*seperator*/) : [this.value]);
						// return s.join("<br>");
						return this.value;
					}
				} //, rotation: 320
			};
			
			if (mcr.xlabel == false)
			{
				xlabels.labels.enabled = false;
			}
			else
			{
				if (mcr.xaxisrot == false)
				{
					xlabels.labels.autoRotation = false;
					
					if (mcr.xstagl > 0)
					{
						xlabels.labels.staggerLines = mcr.xstagl;
						xlabels.labels.maxStaggerLines = mcr.xstagl;
					}
					
					if (mcr.xstep > 1)
					{
						xlabels.labels.step = mcr.xstep;
					}
				}
			}
			
			coption.xAxis = {
				categories: xticks,
				labels: xlabels.labels,
				showLastTickLabel: true,
				align: "left",
				events: {
					setExtremes: function (event) {
						if (Math.abs(this.options.labels.rotation) == 90)
						{
							var labelWidth = parseInt(this.options.labels.style.lineHeight) + 2,
								plotAreaWidth = parseInt(this.chart.plotBox.width),
								labelsCount = Math.floor(plotAreaWidth / labelWidth),
								pointsCount,
								step;

							if (event.max !== null && event.max !== undefined)
							{
								pointsCount = Math.round(event.max - event.min);
							}
							else
							{
								pointsCount = Math.round(this.dataMax - this.dataMin);
							}

							step = Math.ceil(pointsCount / (labelsCount * (this.tickInterval == null ? 1 : this.tickInterval)));

							this.update({
								labels: {
									step: step
								}
							}, true);
						}
					}
				}
			};
		}
		else
		{
			coption.chart.zoomType = "xy";

			coption.xAxis = {
				startOnTick: true,
				endOnTick: true,
				showLastLabel: true
			};
		}

		if (mcr.e3d_en == "T")
		{
			coption.chart.options3d = {
				enabled: true,
				alpha: Number(mcr.e3d_al),
				beta: Number(mcr.e3d_be),
				depth: Number(mcr.e3d_de),
				viewDistance: Number(mcr.e3d_vd)
			};
		}

		var eventowner = this,
			cnt,
			p_off = 0,
			ylabels = {
			formatter: function() {
				// ###.####
				var yaxisformat = mcr.yaxisformat,
					p = 0,
					value = this.value, 
					postfix = "",
					pval, n, i,
					c;
				
				if (yaxisformat)
				{
					n = yaxisformat.indexOf(".");
					if (n > -1)
					{
						for (i=n+1; i < yaxisformat.length; i++)
						{
							c = yaxisformat.charAt(i);
							if (c == "#" || c == "0")
							{
								p++;
							}
						}
					}
					
					n = yaxisformat.indexOf("%");
					if (n > -1)
					{
						pval = (n-1) > 0 ? yaxisformat.charAt(n-1) : null;
						
						if (pval == "'")
						{
							
						}
						else
						{
							value = value * 100;
						}
						
						postfix = " %";
					}
				}
				
				return Highcharts.numberFormat(value, p) + postfix;
			}
		};

		var ytitle = {
			text: mcr.yaxistitle || null
		};
		coption.yAxis = {title: ytitle, labels: ylabels};

		if (mcr.yaxismax != "" && IG$/*mainapp*/._I37/*isNumber*/(mcr.yaxismax) == true)
		{
			coption.yAxis.max = Number(mcr.yaxismax);
		}

		if (mcr.yaxismin != "" && IG$/*mainapp*/._I37/*isNumber*/(mcr.yaxismin) == true)
		{
			coption.yAxis.min = Number(mcr.yaxismin);
		}
		
		if (mcr.ytickint > 0)
		{
			coption.yAxis.tickInterval = mcr.ytickint;
		}

		if (bpolarchart)
		{
			coption.yAxis.gridLineInterpolation = "polygon";
			coption.yAxis.lineWidth = 0;
		}
		
		coption.legend = {
			margin: 2
		};

		if (mcr.showlegend == true)
		{
			coption.legend.enabled = true;
			mcr.legendposition = mcr.legendposition || "BOTTOM_CENTER";

			coption.legend.verticalAlign = mcr.legendposition.indexOf("BOTTOM_") > -1 ? "bottom" :
				(mcr.legendposition.indexOf("TOP_") > -1 ? "top" : "middle");
			coption.legend.align = (mcr.legendposition.indexOf("LEFT_") > -1) ? "left" :
				((mcr.legendposition.indexOf("RIGHT_") > -1) ? "right" : "center");
			if (coption.legend.align == "center")
			{
				if (mcr.legendposition.indexOf("_RIGHT") > -1)
				{
					coption.legend.x = 200;
				}
				else if (mcr.legendposition.indexOf("_LEFT") > -1)
				{
					coption.legend.x = - w / 2 + 200;
				}

				coption.legend.layout = "horizontal";
			}
			else
			{
				if (mcr.legendposition.indexOf("_TOP") > -1)
				{
					coption.legend.verticalAlign = "top";
				}
				else if (mcr.legendposition.indexOf("_BOTTOM") > -1)
				{
					coption.legend.verticalAlign = "bottom";
				}

				coption.legend.layout = "vertical";
			}
		}
		else
		{
			coption.legend.enabled = false;
		}
		
		if (mcr.lgndfloating)
		{
			coption.legend.floating = true;
			coption.legend.borderWidth = 1;
            coption.legend.backgroundColor = (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF';
		}

		var marker = {
				enabled: mcr.dl_marker ? true : false, 
				states: {
					hover: {
						enabled: true
					}
				}
			},
			dobj,
			options3d = coption.chart ? coption.chart.options3d : null;
		if (/(pie|doughnut|funnel|pyramid)/.test(me.rcs/*rendersubtype*/))
		{
			coption.tooltip = {
				formatter: function() {
					return this.point.name + "<br>" + Highcharts.numberFormat(this.y, mcr.precision || 0) + " (" + Highcharts.numberFormat(this.percentage, 1) + " %)";
				}
			};
			
			coption.plotOptions = {
				pie: {
					allowPointSelect: true,
					cursor: "pointer",
					innerSize: ("" + (me.rcs/*rendersubtype*/ == "doughnut" ? (mcr.pieinnerradius > 20 ? mcr.pieinnerradius : 40) : (mcr.pieinnerradius || 0)) + "%"),
					dataLabels: {
						enabled: true,
						// color: Highcharts.theme.textColor || "#000000",
						distance: mcr.pielabeldist,
						// connectColor: Highcharts.theme.textColor || "#000000",
						formatter: function () {
							return me.dP/*getPieLabel*/(mcr.piedatalabel, this);
						}
					},
					events: {
						click: function(param) {
							eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
						}
					}
				}
			};
			
			if (options3d && options3d.enabled)
			{
				delete options3d["viewDistance"];
			}

			coption.chart.renderTo = null;

			if (!mcr.pielayout)
			{
				series.splice(1, series.length - 1);
			}

			$.each(series, function(k, serie) {

				var cnt = $("<div class='i-sschart-cnt'></div>").appendTo(me.container),
					ocnt = $(me.container),
					owidth = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(ocnt),
					oheight = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(ocnt),
					ow = owidth / series.length,
					oh = oheight / series.length,
					toption = $.extend(true, {}, coption),
					i, csv,
					mw = 0,
					mtitle;
				
				if (toption.title && toption.title.text)
				{
					mtitle = toption.title.text;
					mtitle = IG$/*mainapp*/._I46/*replaceAll*/(mtitle, "{SERIES}", serie.name);
					toption.title.text = mtitle;
				}
				
				if (mcr.pielayout == "h")
				{
					IG$/*mainapp*/.x_10/*jqueryExtension*/._w(cnt, ow);
					IG$/*mainapp*/.x_10/*jqueryExtension*/._h(cnt, oheight);
					cnt.css({left: p_off});
					p_off += ow;
				}
				else if (mcr.pielayout == "v")
				{
					IG$/*mainapp*/.x_10/*jqueryExtension*/._h(cnt, oh);
					IG$/*mainapp*/.x_10/*jqueryExtension*/._w(cnt, owidth);
					cnt.css({top: p_off});
					p_off += oh;
				}

				toption.chart = {
					renderTo: cnt[0],
					type: me.rcs/*rendersubtype*/,
					spacingBottom: spacingBottom
				};
				
				if (coption.chart.options3d)
				{
					toption.chart.options3d = coption.chart.options3d;
				}

				toption.plotOptions = {
					pie: {
						allowPointSelect: true,
						cursor: "pointer",
						innerSize: coption.plotOptions.pie.innerSize,
						dataLabels: {
							enabled: true,
							// color: Highcharts.theme.textColor || "#000000",
							distance: mcr.pielabeldist,
							// connectColor: Highcharts.theme.textColor || "#000000",
							formatter: function () {
								return me.dP/*getPieLabel*/(mcr.piedatalabel, this);
							}
						},
						events: {
							click: function(param) {
								eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
							}
						}
					}
				};
				
				if (options3d)
				{
					toption.plotOptions.pie.depth = options3d.depth;
				}
				
				if (/(funnel|pyramid)/.test(me.rcs/*rendersubtype*/))
				{
					toption.plotOptions = toption.plotOptions || {};
					toption.plotOptions[me.rcs/*rendersubtype*/] = {
						dataLabels: {
							enabled: true,
							softConnector: true,
							inside: true,
							distance: mcr.pielabeldist,
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
							formatter: function () {
								return me.dP/*getPieLabel*/(mcr.piedatalabel, this);
							}
						}
					};
					
					for (i=0; i < serie.data.length; i++)
					{
						csv = me.dP/*getPieLabel*/(mcr.piedatalabel, {
							point: {
								name: serie.data[i].name,
								fval: serie.data[i].fval
							},
							percentage: 99.9
						});
						
						cs = me.u_/*measureTextSize*/(10, csv);
						mw = Math.max(cs.width + 10, mw);
					}
					
					mw = mw + mcr.pielabeldist;
					
					if (mw > owidth * 0.5)
					{
						mw = owidth * 0.5;
					}
					
					toption.chart.marginRight = mw;
					
					if (me.rcs/*rendersubtype*/ == "funnel")
					{
						toption.plotOptions.funnel.neckWidth = "30%";
						toption.plotOptions.funnel.neckHeight = "25%";
					}
				}

				serie.type = me.rcs/*rendersubtype*/ == "doughnut" ? "pie" : me.rcs/*rendersubtype*/;
				toption.series = [serie];
				coptions.push(toption);
			});
		}
		else
		{
			for (i=0; i < series.length; i++)
			{
				if (!bfixedp && mcr.renderas && mcr.renderas.length > i && mcr.renderas[i])
				{
					series[i].type = IG$/*mainapp*/._I36/*getSeriesType*/(mcr.renderas[i]);
				}
				
				if (mcr.dl_enable && mcr.dl_enable_l && mcr.dl_enable_l.length > i && mcr.dl_enable_l[i] == "F")
				{
					series[i].dataLabels = {
						enabled: false
					};
				}
				
//				if (mcr.dl_marker && mcr.dl_marker_l && mcr.dl_marker_l.length > i && mcr.dl_marker_l[i] == "F")
//				{
//					series[i].dataLabels = {
//						enabled: false
//					};
//				}

				if (me.rcs/*rendersubtype*/ == "waterfall")
				{
					series[i].upColor = Highcharts.getOptions().colors[2];
					series[i].color = Highcharts.getOptions().colors[3];
				}
			}

			if (mcr.usedualaxis == true && mcr.dualaxisitem && mcr.dualaxisitem.length > -1 && series.length > 1)
			{
				for (i=0; i < series.length; i++)
				{
					if (mcr.dualaxisitem.length > i && mcr.dualaxisitem[i] == "T")
					{
						hasdualaxis = true;
						break;
					}
				}

				if (hasdualaxis == true)
				{
					var dyax = {
						title: {
							text: mcr.yaxistitle2 || null,
							enabled: mcr.yaxistitle ? true : false
						},
						opposite: true,
						labels: {
							formatter: function() {
								var yaxisformat = mcr.yaxisformat2,
									p = 0;
								if (yaxisformat && yaxisformat.indexOf(".") > -1)
								{
									p = yaxisformat.length - yaxisformat.lastIndexOf(".") - 1;
								}
								return Highcharts.numberFormat(this.value, p);
							}
						}
					};

					if (mcr.yaxismax2 != "" && IG$/*mainapp*/._I37/*isNumber*/(mcr.yaxismax2) == true)
					{
						dyax.max = Number(mcr.yaxismax2);
					}

					if (mcr.yaxismin2 != "" && IG$/*mainapp*/._I37/*isNumber*/(mcr.yaxismin2) == true)
					{
						dyax.min = Number(mcr.yaxismin);
					}
					coption.yAxis = [coption.yAxis];
					coption.yAxis.push(dyax);

					for (i=0; i < mcr.dualaxisitem.length; i++)
					{
						if (series.length > i && mcr.dualaxisitem[i] == "T")
						{
							series[i].yAxis = 1;
						}
					}
				}
			}

			coption.tooltip = {
//					formatter: function() {
//						return this.point.name + "<br>" + Highcharts.numberFormat(this.y, mcr.precision || 0) + " (" + Highcharts.numberFormat(this.percentage, 1) + " %)";
//					}

				formatter: function() {
					var r,
						i;
					if (bfixedp)
					{
						if (this.points && this.points.length)
						{
							r = this.points[0].x + "<br>";
							for (i=0; i < this.points.length; i++)
							{
								r += (i > 0 ? "<br>" : "") + "<b>" + this.points[i].series.name + "</b> " + (this.points[i].fval || Highcharts.numberFormat(this.points[i].y, 0));
							}
						}
					}
					else if (bpointchart)
					{
						r = this.series.name + "<br>" 
							+ (this.point ? this.point.name || "" : "") + "<br>" 
							+ "X: " + this.x + "<br>" 
							+ "Y: " + (this.point.fval || Highcharts.numberFormat(this.y, 0));
					}
					else
					{
						r = this.series.name + "<br>" 
							+ this.x + "<br>" 
							+ (this.point.fval || Highcharts.numberFormat(this.y, 0));
					}
					return r;
				}
			};
			
			coption.plotOptions = {};
			coption.plotOptions.column = {
                turboThreshold: mcr.maxchartresult || 1000,
				allowPointSelect: true,
				events: {
					click: function(param) {
						eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
						return false;
					}
				}
			};

			coption.plotOptions.area = {
                turboThreshold: mcr.maxchartresult || 1000,
				allowPointSelect: true,
				marker: marker,
				events: {
					click: function(param) {
						eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
					}
				}
			};
			
			coption.plotOptions.areaspline = {
                turboThreshold: mcr.maxchartresult || 1000,
				allowPointSelect: true,
				marker: marker,
				events: {
					click: function(param) {
						eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
					}
				}
			};

			coption.plotOptions.line = {
                turboThreshold: mcr.maxchartresult || 1000,
				allowPointSelect: true,
				marker: marker,
				events: {
					click: function(param) {
						eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
					}
				}
			};
			
			coption.plotOptions.spline = {
                turboThreshold: mcr.maxchartresult || 1000,
				allowPointSelect: true,
				marker: marker,
				events: {
					click: function(param) {
						eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
					}
				}
			};

			coption.plotOptions.bar = {
                turboThreshold: mcr.maxchartresult || 1000,
				allowPointSelect: true,
				events: {
					click: function(param) {
						eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
					}
				}
			};
			
			coption.plotOptions.bubble = {
                turboThreshold: mcr.maxchartresult || 1000,
				maxSize: 120,
				minSize: 8
			};

			// dobj = coption.plotOptions[coption.chart.defaultSeriesType];
			
			if (mcr.dl_enable)
			{
				$.each(["column", "area", "areaspline", "line", "spline", "bar"], function(i, k) {
					var dobj = coption.plotOptions[k];
					
					dobj.dataLabels = {
						enabled: true,
						align: mcr.dl_align || "center",
						inside: mcr.dl_inside,
						formatter: function() {
							return this.point.fval || Highcharts.numberFormat(this.y, 0);
						}
					};
				});
			}

			if (bpointchart)
			{
				coption.plotOptions.scatter = {
					allowPointSelect: true,
                    turboThreshold: mcr.maxchartresult || 1000,
					marker: {
						symbol: "circle",
						radius: 5,
						states: {
							hover: {
								enabled: true
							}
						}
					},
					states: {
						hover: {
							marker: {
								enabled: false
							}
						}
					}
				}
			}

			if (mcr.p_bands && mcr.p_bands.length > 0)
			{
				var yaxis = coption.yAxis.length ? coption.yAxis[0] : coption.yAxis,
					xaxis = coption.xAxis && coption.xAxis.length ? coption.xAxis[0] : coption.xAxis,
					band,
					pb;

				yaxis.plotBands = [];
				yaxis.plotLines = [];
				
				if (xaxis)
				{
					xaxis.plotBands = [];
					xaxis.plotLines = [];
				}

				for (i=0; i < mcr.p_bands.length; i++)
				{
					bp = mcr.p_bands[i];
					bp.mresult = mresult;

					if (bp.enabled)
					{
						band = {
							label: {
								text: bp.name
							},
							color: bp.color
						};
						
						if (bp.btype == "curvefit")
						{
							cf.push(bp);
						}
						else
						{
							if (bp.isxaxis)
							{
								if (bp.btype == "band")
								{
									band.from = bp._v1(bp.value_1, true); // Number(bp.value_1);
									band.to = bp._v1(bp.value_2, true); // Number(bp.value_2);
									xaxis.plotBands.push(band);
								}
								else
								{
									band.value = bp._v1(bp.value_1, true); // Number(bp.value_1);
									band.width = Number(bp.borderwidth) || 2;
									xaxis.plotLines.push(band);
								}
							}
							else
							{
								if (bp.btype == "band")
								{
									band.from = bp._v1(bp.value_1); // Number(bp.value_1);
									band.to = bp._v1(bp.value_2); // Number(bp.value_2);
									yaxis.plotBands.push(band);
								}
								else
								{
									band.value = bp._v1(bp.value_1); // Number(bp.value_1);
									band.width = Number(bp.borderwidth) || 2;
									yaxis.plotLines.push(band);
								}
							}
						}
					}
				}
			}

			if (mcr.stack == true && me.rcs/*rendersubtype*/ != "waterfall")
			{
				switch (this.rcs/*rendersubtype*/)
				{
				case "area":
					coption.plotOptions.area.stacking = (mcr.stackperc ? "percent" : "normal");
					break;
				default:
					if (coption.plotOptions.series == null || typeof coption.plotOptions.series == "undefined")
					{
						coption.plotOptions.series = {};
					}
					coption.plotOptions.series.stacking = (mcr.stackperc ? "percent" : "normal");
					break;
				}
			}

			if (!bfixedp && coption.renderas && coption.renderas.length > 0)
			{
				for (i=0; i < coption.renderas.length; i++)
				{
					if (coption.renderas[i] != "" && series.length > i)
					{
						var rtype = IG$/*mainapp*/._I36/*getSeriesType*/(coption.renderas[i])
						series[i].type = rtype;
					}
				}
			}
			
			if (bsync)
			{
				$(me.container).bind('mousemove touchmove', function (e) {
			        var chart,
			            point,
			            i;
					if (!me._mc/*masterCharts*/)
						return;
						
			        for (i = 0; i < me._mc/*masterCharts*/.length; i = i + 1) {
			            chart = me._mc/*masterCharts*/[i];
			            if (chart)
			            {
				            e = chart.pointer.normalize(e); // Find coordinates within the chart
				            point = chart.series[0].searchPoint(e, true); // Get the hovered point
				
				            if (point) {
				                point.onMouseOver(); // Show the hover marker
				                chart.tooltip.refresh(point); // Show the tooltip
				                chart.xAxis[0].drawCrosshair(e, point); // Show the crosshair
				            }
				        }
			        }
			    });
			    
				var xaxis = coption.xAxis = coption.xAxis || {};
				xaxis.crosshair = true;
				xaxis.events = xaxis.events || {};
				xaxis.events.setExtremes = function(e) {
			        var thisChart = this.chart;
			
			        if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
			            Highcharts.each(me._mc/*masterCharts*/, function (chart) {
			                if (chart !== thisChart) 
			                {
			                    if (chart.xAxis[0].setExtremes) // It is null while updating
			                    { 
			                        chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
			                    }
			                }
			            });
			        }
			    };
			    
				coption.chart.renderTo = null;
				coption.chart.marginLeft = 60; // Keep all charts left aligned
                coption.chart.zoomType = "x";

				$.each(lblnames, function(k, lblname) {
					var cnt = $("<div class='i-sschart-cnt'></div>").appendTo(me.container),
						ocnt = $(me.container),
						owidth = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(ocnt),
						oheight = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(ocnt),
						ow = owidth / bsync_l,
						oh = oheight / bsync_l,
						toption = $.extend(true, {}, coption),
						serie = [],
						i;
	
//					if (mcr.pielayout == "h")
//					{
//						IG$/*mainapp*/.x_10/*jqueryExtension*/._w(cnt, ow);
//						IG$/*mainapp*/.x_10/*jqueryExtension*/._h(cnt, oheight);
//						cnt.css({left: p_off});
//						p_off += ow;
//					}
//					else if (mcr.pielayout == "v")
//					{
						IG$/*mainapp*/.x_10/*jqueryExtension*/._h(cnt, oh);
						IG$/*mainapp*/.x_10/*jqueryExtension*/._w(cnt, owidth);
						cnt.css({top: p_off});
						p_off += oh;
//					}
	
					toption.chart.renderTo = cnt[0];
					
					for (i=0; i < series.length; i++)
					{
						if (series[i].meas_k == k)
						{
							serie.push(series[i]);
						}
					}
	
					toption.series = serie;
					coptions.push(toption);
				});
			}
			else
			{
				coption.series = series;
				coptions.push(coption);
			}
		}
		
		if (bfixedp)
		{
			coption.chart.type = "column";
			coption.plotOptions.column.grouping = false;
			coption.plotOptions.column.shadow = false;
			coption.plotOptions.column.borderWidth = 0;
			coption.tooltip = coption.tooltip || {};
			coption.tooltip.shared = true;
			
			var s1 = 0,
				s2 = 0;
			
			for (i=0; i < coption.series.length; i++)
			{
				coption.series[i].pointPadding = (coption.series.length > 2 ? 0.3 : 0.2) + (coption.series[i].yAxis ? s2 : s1) / 10;
				coption.series[i].pointPlacement = (coption.series.length > 2 ? (coption.series[i].yAxis ? 0.2 : -0.2) : 0);
				
				if (!coption.series[i].yAxis && s1 == 0)
				{
					coption.series[i].color = "rgba(165,170,217,1)";
				}
				else if (!coption.series[i].yAxis && s1 == 1)
				{
					coption.series[i].color = "rgba(126,86,134,.9)";
				}
				else if ((coption.series[i].yAxis && s2 == 0) || (!coption.series[i].yAxis && s1 == 2))
				{
					coption.series[i].color = "rgba(248,161,63,1)";
				}
				else if ((coption.series[i].yAxis && s2 == 1) || (!coption.series[i].yAxis && s1 == 3))
				{
					coption.series[i].color = "rgba(186,60,61,.9)";
				}
				
				if (coption.series[i].yAxis)
				{
					s2++;
				}
				else
				{
					s1++;
				}
			}
		}
		
		if (cf.length)
		{
			for (i=0; i < coptions.length; i++)
			{
				coptions[i].__cf = cf;
			}
		}

		return coptions;
	},
	
	_int/*interpolate*/: function(v, c) {
		var nc = null,
			r, g, b,
			a;
		
		if (c && c.charAt(0) == "#")
		{
			r = c.substring(1, 3);
			g = c.substring(3, 5);
			b = c.substring(5, 7);
			
			r = parseInt(r, 16);
			g = parseInt(g, 16);
			b = parseInt(b, 16);
			
			a = (v / 255) * 0.75 + 0.25;
			
			nc = "rgba(" + r + "," + g + "," + b + "," + a + ")";
		}
		
		return nc;
	},
	
	p1/*processClickEvent*/: function(sender, param) {
		var me = this;
		
		me._p1a && clearTimeout(me._p1a);
		
		me._p1a = setTimeout(function() {
			me.p1a/*processClickHandler*/.call(me, sender, param);
		}, 250);
	},

	p1a/*processClickHandler*/: function(sender, param) {
		if (sender)
		{
			var me = this,
				seriesnames = [],
				categnames = [],
                datarows = [],
				seriesname,
				categname,
				eventowner,
				sep = IG$/*mainapp*/.sX/*seperator*/,
				mresult = this.mresult,
				cname,
				swapaxis = me._ILb/*sheetoption*/.cco/*chartOption*/.swapaxis,
				c = -1, r = -1, m,
				_p;
				
			if (!param && (!me.selectedData || (me.selectedData && !me.selectedData.length)))
			{
				return;
			}
			
			me.selectedData = [];
            
            if (me.cop.charttype == "scatter" || me.cop.charttype == "bubble")
            {
                if (param && param.length)
                {
                    for (m=0; m < param.length; m++)
                    {
                        _p = param[m];
                        if (_p.datarow > -1)
                        {
                            datarows.push(_p.datarow);
                        }
                    }
                }
                else if (param)
                {
                    if (param.datarow > -1)
                    {
                        datarows.push(param.datarow);
                    }
                }
            }
            else
            {
                if (param && param.length)
                {
                    for (m=0; m < param.length; m++)
                    {
                        _p = param[m];
                        seriesnames.push(_p.series ? _p.series.name : _p.name);
                        categnames.push(_p.category || _p.name || "");
                    }
                }
                else if (param)
                {
                    seriesnames.push(sender.series ? sender.series.name : sender.name);
                    categnames.push(param.point ? param.point.category || param.point.name : "");
                }
            }
            
			param && param.point && param.point.select && param.point.select(true, false);
            
            if (datarows.length)
            {
                for (m=0; m < datarows.length; m++)
                {
                    r = datarows[m];
                    c = mresult.colfix - 1;
                    
                    if (r > -1 && c > -1)
                    {
                        mresult.data[r][c].r = r;
                        mresult.data[r][c].c = c;
                        this.selectedData.push(mresult.data[r][c]);
                    }
                }
            }
			else
            {
                for (m=0; m < seriesnames.length; m++)
                {
                    seriesname = seriesnames[m];
                    categname = categnames[m];
                    
                    if (swapaxis == true)
                    {
                        for (i=mresult.colfix; i < mresult.data[0].length; i++)
                        {
                            cname = "";
        
                            for (j=0; j < mresult.rowfix; j++)
                            {
                                cname += mresult.data[j][i].text + sep;
                            }
        
                            if (cname == categname + sep)
                            {
                                c = i;
                                break;
                            }
                        }
        
                        if (seriesname)
                        {
                            for (i=mresult.rowfix; i < mresult.data.length; i++)
                            {
                                cname = "";
        
                                for (j=0; j < mresult.colfix; j++)
                                {
                                    cname += mresult.data[i][j].text + sep;
                                }
        
                                if (cname == seriesname + sep)
                                {
                                    r = i;
                                    break;
                                }
                            }
                        }
                    }
                    else
                    {
                        for (i=mresult.rowfix; i < mresult.data.length; i++)
                        {
                            cname = "";
        
                            for (j=0; j < mresult.colfix; j++)
                            {
                                cname += mresult.data[i][j].text + sep;
                            }
        
                            if (cname == categname + sep)
                            {
                                r = i;
                                break;
                            }
                        }
        
                        if (seriesname)
                        {
                            for (i=mresult.colfix; i < mresult.cols; i++)
                            {
                                cname = "";
        
                                for (j=0; j < mresult.rowfix; j++)
                                {
                                    cname += mresult.data[j][i].text + sep;
                                }
        
                                if (cname == seriesname + sep)
                                {
                                    c = i;
                                    break;
                                }
                            }
                        }
                    }
        
                    if (c > -1 && r > -1)
                    {
                        mresult.data[r][c].r = r;
                        mresult.data[r][c].c = c;
                        this.selectedData.push(mresult.data[r][c]);
                    }
                }
            }

			if (me.f4/*onClickEventHandler*/ && me.f4a/*onClickEventOwner*/)
			{
				me.f4/*onClickEventHandler*/.call(me.f4a/*onClickEventOwner*/, me);
			}

			if (me.ctrl && me.ctrl.events && me.ctrl.events["itemclick"])
			{
				var pdb = eventowner.ctrl.dashboard,
					actionlist = eventowner.ctrl.actionlist;

				pdb.M7a/*executeAction*/.call(pdb, actionlist["itemclick"]);
			}
		}
	},

	__r1/*requestData*/: function(option) {
		var me = this,
			rpc = me.rpc;

		rpc.__r1/*requestData*/.call(rpc, me, option);
	},

	_IB4/*getExportData*/: function() {
		var me = this,
			chart,
			svg, svgns, svgnode, svgchild,
			expdata = "";

		switch (me.drawmode)
		{
		case "highchart":
			if (me._mc/*masterCharts*/ && me._mc/*masterCharts*/.length > 0)
			{
				chart = me._mc/*masterCharts*/[0];
				svg = chart.getSVG();
				expdata =  "<ImageData type='svg'><![CDATA[" + Base64.encode(svg) + "]]></ImageData>";
			}
			break;
		case "qavis":
			break;
		case "protovis":
			if (me.vis)
			{
				svgnode = IG$/*mainapp*/._I17/*getFirstChild*/(me.container);

				IG$/*mainapp*/._I23/*XSetAttr*/(svgnode, "xmlns:xlink", "http://www.w3.org/1999/xlink");
				IG$/*mainapp*/._I23/*XSetAttr*/(svgnode, "xmlns", "http://www.w3.org/2000/svg");
				IG$/*mainapp*/._I23/*XSetAttr*/(svgnode, "version", "1.1");

				svg = IG$/*mainapp*/._I25/*toXMLString*/(svgnode);

				expdata =  "<ImageData type='svg'><![CDATA[" + Base64.encode(svg) + "]]></ImageData>";
			}
			break;
		case "dcust":
			if (me.dcust)
			{
				svgnode = IG$/*mainapp*/._I17/*getFirstChild*/(me.container);

				IG$/*mainapp*/._I23/*XSetAttr*/(svgnode, "xmlns:xlink", "http://www.w3.org/1999/xlink");
				IG$/*mainapp*/._I23/*XSetAttr*/(svgnode, "xmlns", "http://www.w3.org/2000/svg");
				IG$/*mainapp*/._I23/*XSetAttr*/(svgnode, "version", "1.1");

				svg = IG$/*mainapp*/._I25/*toXMLString*/(svgnode);

				expdata =  "<ImageData type='svg'><![CDATA[" + Base64.encode(svg) + "]]></ImageData>";
			}
		case "treemap":
			if (me.treemap && me.treemap.map)
			{
				svg = me.treemap.map.getSVG.call(me.treemap.map);
				expdata =  "<ImageData type='svg'><![CDATA[" + Base64.encode(svg) + "]]></ImageData>";
			}
			break;
		case "bubblemap":
			if (me.bmap)
			{
				svg = me.bmap.toSVG.call(me.bmap);
				expdata =  "<ImageData type='svg'><![CDATA[" + Base64.encode(svg) + "]]></ImageData>";
			}
			break;
		case "custom":
			if (me.customchart && me.customchart.getSVG)
			{
				svg = me.customchart.getSVG.call(me.customchart);
				if (svg)
				{
					expdata =  "<ImageData type='svg'><![CDATA[" + Base64.encode(svg) + "]]></ImageData>";
				}
			}
			break;
		}

		return expdata;
	},
	
	mvalue: function(cell, useformatvalue) {
		var r,
			t;
		if (useformatvalue)
		{
			t = cell.text;
	
			if (t.indexOf(",") > -1)
			{
				t = t.split(",");
				t = t.join("");
			}
	
			r = Number(t);
		}
		else
		{
			r = Number(cell.code)
		}
	
		return r;
	},
	
	_dn/*dynamicLoad*/: function(f) {
		var me = this,
			scmap = ig$/*appoption*/.scmap,
			scripts = [],
			i,
			isie8 = false,
			browser = window.bowser;
		
		isie8  = (browser.msie && browser.version < 9) ? true : false;
		
		$.each(
			[
				[
					isie8 ? "./js/excanvas.js" : null,
					"./js/protovis-d3.3.js",
					isie8 ? null : "./js/d3.js",
					"./js/d3.tip.js",
					"./js/d3.geo.js",
					"./js/g.raphael.js",
					"./js/g.dot.js"
				],
				[
					"./js/modules/heatmap.js", 
					"./js/modules/treemap.js"
				],
				scmap.igc6,
				scmap.igco,
				scmap.igcb
			], function(n, ar) {
				var i;
				for (i=0; i < ar.length; i++)
				{
					ar[i] && scripts.push(ar[i]);
				}
			}
		);
				
		IG$/*mainapp*/.x03/*getScriptCache*/(scripts, new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
			var me = this;
			f.call(me);
		}));
	},
	
	JJ$4/*drawProtovisChart*/: function(rct/*rendercharttype*/, mresult) {
		var me = this;
			
		me._dn/*dynamicLoad*/(function() {
			var me = this;
			me.JJ$4/*drawProtovisChart*/.call(me, rct/*rendercharttype*/, mresult);
		});
	},
	
	l3a/*drawTreeMapChart*/: function(mresult) {
		var me = this;
		
		me._dn/*dynamicLoad*/(function() {
			var me = this;
			me.l3a/*drawTreeMapChart*/.call(me, mresult);
		});
	},
	
	JJ$4a/*drawD3CustomChart*/: function(rct/*rendercharttype*/, mresult) {
		var me = this;
		
		me._dn/*dynamicLoad*/(function() {
			var me = this;
			me.JJ$4a/*drawD3CustomChart*/.call(me, rct/*rendercharttype*/, mresult);
		});
	},
	
	JJ$3/*drawMatrixChart*/: function(mresult) {
		var me = this;
		
		me._dn/*dynamicLoad*/(function() {
			var me = this;
			me.JJ$3/*drawMatrixChart*/.call(me, mresult);
		});
	},
	l3/*drawMapChart*/: function(mresult) {
		var me = this;
		
		me._dn/*dynamicLoad*/(function() {
			var me = this;
			me.l3/*drawMapChart*/.call(me, mresult);
		});
	},
	l4/*drawProtoVisMapChart*/: function(mresult) {
		var me = this;
		
		me._dn/*dynamicLoad*/(function() {
			var me = this;
			me.l4/*drawProtoVisMapChart*/.call(me, mresult);
		});
	},
	l5/*drawD3MapChart*/: function(mresult) {
		var me = this;
		
		me._dn/*dynamicLoad*/(function() {
			var me = this;
			me.l5/*drawD3MapChart*/.call(me, mresult);
		});
	},
	l5a/*drawD3ExtMapChart*/: function() {
		var me = this;
		
		me._dn/*dynamicLoad*/(function() {
			var me = this;
			me.l5a/*drawD3ExtMapChart*/.call(me);
		});
	},
	l6/*drawGSAPIMapChart*/: function() {
		var me = this;
		
		me._dn/*dynamicLoad*/(function() {
			var me = this;
			me.l6/*drawGSAPIMapChart*/.call(me);
		});
	}
}

IG$/*mainapp*/._IKa/*reqolap*/ = function () {
	this._IL8/*jobid*/ = null;
	this.panel = null; 
	this.uid = null;
	this.sheet = null;
	this.chart = null;
	
	this._ILa/*reportoption*/ = null;
	this.ctrlsource = null;
	
	// this.pivotxml
};

IG$/*mainapp*/._IKa/*reqolap*/.prototype = {
	_IKb/*requestPivotResult*/: function(pivotxml, pelement, activesheet, drawtype, startpage, endpage, callback, schedule_job, is_scroll, no_update) {
		var me = this,
			_IL8/*jobid*/ = me._IL8/*jobid*/,
			uid = me.uid,
			rop = me._ILa/*reportoption*/,
			pwd,
			ctrl,
			jobid = me.panel.jobid;
			
		if (schedule_job)
		{
			jobid = schedule_job.jobid;
		}
		
		ctrl = pelement || me.sheet || me.chart;
		
		me._IR3/*requestPivotResult*/(null, [ctrl, activesheet, drawtype, pivotxml, startpage, endpage, jobid, callback, schedule_job, is_scroll, no_update]);
		
//		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
//		req.init(me.panel, 
//			{
//	            ack: "18",
//				payload: "<smsg><item option='getjobid'/></smsg>",
//				mbody: "<smsg></smsg>"
//	        }, me, me._IR3/*requestPivotResult*/, null, [ctrl, activesheet, drawtype, pivotxml, startpage]);
//		req.atld/*stoploading*/ = false;
//		req._l/*request*/();
	},
	
	_IR3/*requestPivotResult*/: function(xdoc, params) {
		var me = this,
			_IL8/*jobid*/ = me._IL8/*jobid*/,
			uid = me.uid,
			rop = me._ILa/*reportoption*/,
			pwd,
			ctrl = params[0],
			activesheet = params[1],
			drawtype = params[2],
			pivotxml = params[3],
			startpage = params[4],
			endpage = params[5],
			// jnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			// jobid = IG$/*mainapp*/._I1b/*XGetAttr*/(jnode, "uid"),
			jobid = params[6],
			callback = params[7],
			schedule_job = params[8],
			is_scroll = params[9],
			no_update = params[10],
			ispagechange = "F";
		
		if (typeof(startpage) != "undefined")
		{
			ispagechange = "T";
		}
		
		startpage = startpage || 0;
		
		if (rop && rop.poolname && IG$/*mainapp*/.dbp[rop.poolname])
		{
			pwd = IG$/*mainapp*/.dbp[rop.poolname];
		}
		
		// me.panel.jobid = jobid;
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me.panel, 
			{
	            ack: "18",
				payload: "<smsg><item uid='" + uid + "' option='pivot' active='" + activesheet + "' pivotresult='T'" + (pwd ? " pwd='" + pwd + "'" : "") + " jobid='" + (jobid || "") + "' startpage='" + startpage + "' endpage='" + (endpage || "") + "' ispagechange='" + ispagechange + "' theme_id='" + (ig$/*appoption*/.theme_id || "") + "'/></smsg>",
				mbody: pivotxml
	        }, me, me.r_IKb/*requestPivotResult*/, function(xdoc) {
	        	callback && callback.execute({
	        		xdoc: xdoc,
	        		iserror: true
	        	});
	        }, [ctrl, activesheet, drawtype, callback, schedule_job, is_scroll, no_update]);
		req._l/*request*/();
	},
	
	r_IKb/*requestPivotResult*/: function(xdoc, params) {
		var me = this,
			_IK2/*mresults*/ = new IG$/*mainapp*/._IF2/*clResults*/(xdoc),
			ctrl = params[0],
			activesheet = params[1],
			drawtype = params[2],
			callback = params[3],
			schedule_job = params[4],
			is_scroll = params[5],
			no_update = params[6],
			hier_cell = params[7],
			viewmode;
			
		_IK2/*mresults*/._job = schedule_job;
		_IK2/*mresults*/._is_sc = is_scroll;
		_IK2/*mresults*/._hcell = hier_cell;
		
		if (window.m$dor)
		{
			try
			{
				window.m$dor(this, _IK2/*mresults*/);
			}
			catch (e)
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_ERR_C_REP_PROC'), null, this.panel, 1, "error");
			}
		}
		
		if (!no_update)
		{
			me._IR2/*refreshControls*/(viewmode, activesheet, _IK2/*mresults*/, ctrl, drawtype);
		}
		
		if (this.panel)
		{
			this.panel.setLoading(false);
		}
		
		callback && callback.execute({
			iserror: false,
			mresults: _IK2/*mresults*/
		});
	},
	
//	_IQf/*continueReportOption*/: function(dlg) {
//		var me = this;
//		
//		if (dlg.cubeobj)
//		{
//			var cubeuid = dlg.cubeobj.uid;
//			var reporttype = dlg.reporttype;
//			
//			me._IR4/*setPivotRootCube*/.call(me, cubeuid);
//			me._ILa/*reportoption*/ = new IG$/*mainapp*/._IEe/*clReports*/(me.tempReportXML);
//			me._ILa/*reportoption*/.cubeuid = cubeuid;
//			me._ILa/*reportoption*/.reportmode = reporttype;
//		}
//	},
	
	// Load report content from server for first report use
	_IR0/*requestOlapResult*/: function(uid, drawtype, activesheet, filterxml, callback) {
		this._ILa/*reportoption*/ = null;
		this.uid = uid;
		var me = this;
	
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me.panel, 
			{
	            ack: "18",
				payload: "<smsg><item option='getjobid'/></smsg>",
				mbody: "<smsg></smsg>"
	        }, me, me._IR1/*requestOlapResult*/, null, [activesheet, drawtype, filterxml, callback]);
		req._l/*request*/();
	},
	
	_IR1/*requestOlapResult*/: function(xdoc, params) { 
		var req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			activesheet = params[0],
			drawtype = params[1],
			filterxml = params[2],
			callback = params[3],
			me = this,
			uid = this.uid,
			jnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			jobid = IG$/*mainapp*/._I1b/*XGetAttr*/(jnode, "uid");
		
		me.panel.jobid = jobid;
		
		req.init(me.panel, 
			{
	            cacheid: '',
			    refresh: '',
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid, jobid: jobid, theme_id: ig$/*appoption*/.theme_id}, "uid;jobid;theme_id"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
	        }, me, me.rs__IR0/*requestOlapResult*/, function(xdoc){
	        	callback && callback.execute({
	        		xdoc: xdoc,
	        		iserror: true
	        	});
	        }, [drawtype, activesheet, filterxml, jobid, callback]);
		req._l/*request*/();
	},
	
	rs__IR0/*requestOlapResult*/: function(xdoc, params) {
		var me = this,
			drawtype = params[0],
			activesheet = params[1],
			filterxml = params[2],
			jobid = params[3],
			callback = params[4],
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item'),
			i,
			itemtype = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'type').toLowerCase();
		
		if (me.panel)
		{
			if (me.panel._IIf/*customLoad*/)
			{
				me.panel._IIf/*customLoad*/.call(me.panel, true);
			}
			else
			{
				me.panel.setLoading(true, true);
			}
		}
		
		if (itemtype == 'compositereport')
		{
			var doc = IG$/*mainapp*/._I25/*toXMLString*/(xdoc);
			me._ILa/*reportoption*/ = new IG$/*mainapp*/._IEf/*clReport*/(xdoc, null);
			me._ILa/*reportoption*/.reports[0].viewmode = 'grid';
	        me._IJ0/*requestUpdateReport*/.call(me, doc, 'grid');
	        me.panel.F1/*doCompositeLayout*/.call(me.panel, me._ILa/*reportoption*/);
	        
	        callback && callback.execute();
		}
		else
		{
			var root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Pivot");
	        if (!root)
	        {
	        	if (me.panel)
	        	{
	        		me.panel.setLoading(false);
	        	}
	        	
	        	me.tempReportXML = xdoc;
	        	
	        	callback && callback.execute();
	        	
	        	//var dlgReportOption = new IG$/*mainapp*/._IB6/*reportOption*/();
	        	//dlgReportOption.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IQf/*continueReportOption*/);
	        	//dlgReportOption.show();
	        	return;
	        }
	        
			me._ILa/*reportoption*/ = new IG$/*mainapp*/._IEe/*clReports*/(xdoc);
			 
			if (drawtype == "mode")
			{
				if (me.panel != null)
				{
					me.panel._ILa/*reportoption*/ = this._ILa/*reportoption*/;
				}
			}
			
			if (filterxml)
			{
				var fdoc = IG$/*mainapp*/._I13/*loadXML*/(filterxml),
					fnode = IG$/*mainapp*/._I18/*XGetNode*/(fdoc, '/smsg/Filter'),
					filters = [];
				
				if (fnode && IG$/*mainapp*/._I1b/*XGetAttr*/(fnode, "source") == "dashboard")
				{
					filters = IG$/*mainapp*/._I26/*getChildNodes*/(fnode);
					me._ILa/*reportoption*/.sheets[activesheet].dashboardfilter = filters;
				}
			}
			
			if (!root)
		    {
		    	if (me.panel)
		    	{
		    		me.panel.setLoading(false);
		    	}
		    	
		    	callback && callback.execute();
		    	//var dlgReportOption = new IG$/*mainapp*/._IB6/*reportOption*/();
		    	//dlgReportOption.show();
		    }
		    else
		    {
		    	var doc = me._ILa/*reportoption*/._IJ1/*getCurrentPivot*/(); // IG$/*mainapp*/._I25/*toXMLString*/(xdoc);
		        me._IJ0/*requestUpdateReport*/.call(me, doc, drawtype, activesheet, jobid, callback);
		    }
		}
	},
	
	_IJ0/*requestUpdateReport*/: function(pivotxmlcontent, drawtype, activesheet, sheet, callback, hide_loader) {
		var me = this;
		
		if (me.panel._IIf/*customLoad*/)
		{
			!hide_loader && me.panel._IIf/*customLoad*/.call(me.panel, true);
		}
		else
		{
			!hide_loader && me.panel.setLoading(true, true);
		}
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me.panel, 
			{
	            ack: "18",
				payload: "<smsg><item option='getjobid' djobid='" + (me.panel.jobid || "") + "' theme_id='" + (ig$/*appoption*/.theme_id || "") + "'/></smsg>",
				mbody: "<smsg></smsg>"
	        }, me, function(tdoc) {
	        	var op = me._ILa/*reportoption*/.reportmode == "rolap" ? "run" : 
					me._ILa/*reportoption*/.reportmode == "sql" ? "sqlrun" : "run",
					req = new IG$/*mainapp*/._I3e/*requestServer*/(),
					rop = me._ILa/*reportoption*/,
					pwd,
					jnode = IG$/*mainapp*/._I18/*XGetNode*/(tdoc, "/smsg/item"),
					jobid = IG$/*mainapp*/._I1b/*XGetAttr*/(jnode, "uid");;
				
				if (rop && rop.poolname && IG$/*mainapp*/.dbp[rop.poolname])
				{
					pwd = IG$/*mainapp*/.dbp[rop.poolname];
				}
				
				me.panel.jobid = jobid;
				
				req.init(me.panel, 
					{
			            ack: "18",
						payload: "<smsg><item uid='" + (this.uid ? this.uid : '') + "' option='" + op + "' active='" + activesheet + "' pivotresult='T'" + (pwd ? " pwd='" + pwd + "'" : "") + " jobid='" + (jobid || "") + "' theme_id='" + (ig$/*appoption*/.theme_id || "") + "'/></smsg>",
						mbody: pivotxmlcontent
			        }, me, me.r_IJ0/*requestUpdateReport*/, function(xdoc) {
			        	callback && callback.execute({
			        		xdoc: xdoc,
			        		iserror: true
			        	});
			        }, [drawtype, activesheet, callback]);
				req._l/*request*/();
	        }, null);
		req.atld/*stoploading*/ = false;
		req._l/*request*/();
	},
	
	r_IJ0/*requestUpdateReport*/: function(xdoc, params) {
		var me = this,
			drawtype = params[0],
			activesheet = params[1],
			callback = params[2],
			viewmode;
		
		me.panel.setLoading(false);
		
		var _IK2/*mresults*/ = new IG$/*mainapp*/._IF2/*clResults*/(xdoc),
			iscomposite;
			
		if (window.m$dor)
		{
			try
			{
				window.m$dor(this, _IK2/*mresults*/);
			}
			catch (e)
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_ERR_C_REP_PROC'), null, this.panel, 1, "error");
			}
		}
		
		me._IL8/*jobid*/ = _IK2/*mresults*/._IL8/*jobid*/;
		me.panel.jobid = me._IL8/*jobid*/; 
		
		me._IR2/*refreshControls*/(viewmode, activesheet, _IK2/*mresults*/, null, drawtype);
		
		callback && callback.execute();
	},
	
	_IR2/*refreshControls*/: function(viewmode, activesheet, _IK2/*mresults*/, ctrl, drawtype) {
		var me = this,
			iscomposite,
			i,
			masterChart,
			isrendered = true;
		
		if (ctrl && ctrl.dcr/*drawChartResult*/)
		{
			var jdom = $(ctrl.container),
				w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom),
	    		h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom),
	    		d;
	    		
			ctrl.mresult = _IK2/*mresults*/.results[0];
			var drawchart = ctrl.dcr/*drawChartResult*/.call(ctrl, w, h);
			
			ctrl.drawchart = drawchart;
		
			if (ctrl.isHighChart == true)
			{
				ctrl.disposeContent.call(ctrl, ctrl);
				
				if (ctrl.drawmode == "echart")
				{
					for (i=0; i < drawchart.length; i++)
					{
						d = drawchart[i];
						masterChart = echarts.init(d.chart.renderTo, null, {
							renderer: "svg"
						});
						masterChart.setOption(d);
						ctrl._mc/*masterCharts*/.push(masterChart);
					}
				}
				else
				{
					for (i=0; i < drawchart.length; i++)
					{
						masterChart = new Highcharts.Chart(drawchart[i]); //, function(masterChart) {panel.createDetail(masterChart)});
						ctrl._mc/*masterCharts*/.push(masterChart);
					}
				}
			}
		}
		else if (ctrl && ctrl.dor/*drawOlapResult*/)
		{
			ctrl.mresult = _IK2/*mresults*/.results[0];
			ctrl.dor/*drawOlapResult*/.call(ctrl);
		}
		else if (this.ctrlsource == 'report')
		{
			if (me._ILa/*reportoption*/.iscomposite == true)
			{
				viewmode = 'grid';
				me._ILa/*reportoption*/._IK2/*mresults*/ = _IK2/*mresults*/;
			}
			else
			{
				viewmode = me._ILa/*reportoption*/.sheets[activesheet].viewmode;
				me._ILa/*reportoption*/.sheets[activesheet]._IK2/*mresults*/ = _IK2/*mresults*/;
			}
			
			isrendered = me.panel.__dx == true ? false : true;
			
			if (isrendered)
			{
				me.panel._d/*drawResults*/.call(me.panel, viewmode, _IK2/*mresults*/);
			}
		}
		else if (this.ctrlsource == 'dashboard')
		{
			iscomposite = me._ILa/*reportoption*/.iscomposite;
			
			me.sheet._ILa/*reportoption*/ = me._ILa/*reportoption*/;
			me.sheet._ILb/*sheetoption*/ = (iscomposite == false) ? me._ILa/*reportoption*/.sheets[0] : me._ILa/*reportoption*/.compositereports[0];
			me.sheet._ILb/*sheetoption*/.viewmode = drawtype ? drawtype : me.sheet._ILb/*sheetoption*/.viewmode;
			
			switch (me.sheet._ILb/*sheetoption*/.viewmode)
			{
			case "grid":
				me.sheet._cv/*changeView*//*setActiveItem*/.call(me.sheet, 0);
				me.sheet._IJe/*procLoadResult*/.call(me.sheet, _IK2/*mresults*/);
				break;
			case "chart":
				me.sheet._cv/*changeView*//*setActiveItem*/.call(me.sheet, 1);
				me.sheet._IJe/*procLoadResult*/.call(me.sheet, _IK2/*mresults*/);
				break;
			case "r":
				me.sheet._cv/*changeView*//*setActiveItem*/.call(me.sheet, 1);
				me.sheet._IJe/*procLoadResult*/.call(me.sheet, _IK2/*mresults*/);
				break;
			}
		}
	}
}



