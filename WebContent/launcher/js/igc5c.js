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
IG$/*mainapp*/._Ifb/*chartseries*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	width: 340,
	autoHeight: true,
	
	callback: null,
	
	l1/*initApp*/: function() {
		var me = this,
			seriestype = me.down("[name=seriestype]"),
			dl_linetype = me.down("[name=dl_linetype]"),
			dl_marker = me.down("[name=dl_marker]"),
			dl_enable = me.down("[name=dl_enable]"),
			rec = me.cell_record;
		
		seriestype.setValue(rec.get("seriestype"));
		dl_linetype.setValue(rec.get("dl_linetype"));
		dl_marker.setValue(rec.get("dl_marker"));
		dl_enable.setValue(rec.get("dl_enable"));
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	m1$9/*confirmChartSetting*/: function() {
		var me = this;
		
		me.seriestype = me.down("[name=seriestype]").getValue();
		me.dl_linetype = me.down("[name=dl_linetype]").getValue();
		me.dl_marker = me.down("[name=dl_marker]").getValue();
		me.dl_enable = me.down("[name=dl_enable]").getValue();
		
		me.callback && me.callback.execute(me);
		me._IG0/*closeDlgProc*/();
	},
	
	initComponent : function() {
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			title: IRm$/*resources*/.r1('T_CHART_SERIES'),
			items: [
				{
					xtype: "panel",
					"layout": "anchor",
					defaults: {
						anchor: "100%"
					},
					items: [
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1("L_SERIES"),
							defaultType: "textfield",
							items: [
								{
									name: "seriestype",
									xtype: "combobox",
									fieldLabel: IRm$/*resources*/.r1("L_SERIES_TYPE"),
									editable: false,
									valueField: "value",
									displayField: "name",
									queryMode: "local",
									autoSelect: true,
									store: {
										fields: [
											"name", "value"
										],
										data: [
											{name: "Default", value: ""},
											{name: "Column", value: "column"},
											{name: "Line", value: "line"},
											{name: "Spline", value: "spline"},
											{name: "Area", value: "area"},
											{name: "Bar", value: "Bar"},
											{name: "Area Spline", value: "areaspline"}
										]
									}
								},
								{
									name: "dl_linetype",
									xtype: "combobox",
									fieldLabel: IRm$.r1("L_LINE_TYPE"),
									editable: false,
									valueField: "value",
                                    displayField: "name",
                                    queryMode: "local",
                                    autoSelect: true,
                                    store: {
                                        fields: [
                                            "name", "value"
                                        ],
                                        data: [
                                            {name: "Default", value: ""},
                                            {name: "Solid", value: "solid"},
                                            {name: "Dashed", value: "dashed"},
											{name: "Dotted", value: "dotted"}
                                        ]
                                    }
								},
								{
									name: "dl_marker",
									xtype: "combobox",
									fieldLabel: IRm$/*resources*/.r1("L_MARKER"),
									editable: false,
									valueField: "value",
									displayField: "name",
									queryMode: "local",
									autoSelect: true,
									store: {
										fields: [
											"name", "value"
										],
										data: [
											{name: "Default", value: ""},
											{name: "Enable", value: "T"},
											{name: "Disable", value: "F"}
										]
									}
								},
								{
									name: "dl_enable",
									xtype: "combobox",
									fieldLabel: IRm$/*resources*/.r1("L_DATA_LABEL"),
									editable: false,
									valueField: "value",
									displayField: "name",
									queryMode: "local",
									autoSelect: true,
									store: {
										fields: [
											"name", "value"
										],
										data: [
											{name: "Default", value: ""},
											{name: "Enable", value: "T"},
											{name: "Disable", value: "F"}
										]
									}
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
						this.m1$9/*confirmChartSetting*/();
					},
					scope: this
				}, 
				{
					text: IRm$/*resources*/.r1('B_CANCEL'),
					handler:function() {
						this.close();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function(tobj) {
					tobj.l1/*initApp*/();
				}
			}
		});
		
		IG$/*mainapp*/._Ifb/*chartseries*/.superclass.initComponent.apply(this, arguments);
	}
});



IG$/*mainapp*/._Ifb_m/*chartplotband*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	width: 380,
	autoHeight: true,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_1/*initApp*/: function() {
		var me = this,
			ditem = me.ditem;
			
		if (ditem)
		{
			$.each(ditem.valueitems, function(i, k) {
				var ctrl,
					v = ditem[k];
					
				if (k == "name")
				{
					k = "b_name";
				}
				
				ctrl = me.down("[name=" + k + "]");
				
				if (ctrl)
				{
					ctrl.setValue(v);
				}
			});
		}
	},
	
	m1$9/*confirmChartSetting*/: function() {
		var me = this,
			ditem = me.ditem,
			has_error = false;
		
		if (ditem)
		{
			$.each(ditem.valueitems, function(i, k) {
				var ctrl,
					mk = (k == "name" ? "b_name" : k);
					
				ctrl = me.down("[name=" + mk + "]");

				if (ctrl)
				{
					ctrl.clearInvalid();
					
					ditem[k] = ctrl.getValue();
					
					switch (k)
					{
					case "name":
					case "btype":
					case "value_1":
					case "color":
						if (!ditem[k])
						{
							if ((k == "value_1" || k == "color") && me.down("[name=btype]").getValue() == "curvefit")
							{
								// ignore
							}
							else
							{
								ctrl.markInvalid("Required Field");
								has_error = true;
							}
						}
						break;
					}
				}
			});
		}
		
		if (has_error == false)
		{
			me.callback && me.callback.execute(me.ditem);
			me._IG0/*closeDlgProc*/();
		}
	},
	
	initComponent : function() {
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			title: IRm$/*resources*/.r1('T_CHART_PLOTBAND'),
			items: [
				{
					xtype: "panel",
					"layout": "anchor",
					defaults: {
						anchor: "100%"
					},
					items: [
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1('T_CHART_PLOTBAND'),
							items: [
								{
									xtype: "textfield",
									name: "b_name",
									fieldLabel: IRm$/*resources*/.r1("B_NAME")
								},
								{
									name: "btype",
									xtype: "combobox",
									fieldLabel: IRm$/*resources*/.r1("L_BAND_TYPE"),
									editable: false,
									valueField: "value",
									displayField: "name",
									queryMode: "local",
									autoSelect: true,
									store: {
										fields: [
											"name", "value"
										],
										data: [
											{name: "Line", value: "line"},
											{name: "Band", value: "band"},
											{name: "CurveFit", value: "curvefit"}
										]
									},
									listeners: {
										change: function(tobj) {
											var me = this,
												tval = tobj.getValue(),
												t_1 = me.down("[name=t_1]"),
												t_2 = me.down("[name=t_2]");
											
											t_1.setVisible(tval == "line" || tval == "band");
											t_2.setVisible(tval == "curvefit");
										},
										scope: this
									}
								},
								{
									xtype: "fieldcontainer",
									layout: "anchor",
									name: "t_1",
									hidden: true,
									items: [
										{
											xtype: "textfield",
											name: "value_1",
											fieldLabel: IRm$/*resources*/.r1("L_BAND_VALUE_1")
										},
										{
											xtype: "textfield",
											name: "value_2",
											fieldLabel: IRm$/*resources*/.r1("L_BAND_VALUE_2")
										},
										{
											xtype: "fieldcontainer",
											fieldLabel: IRm$/*resources*/.r1("L_BAND_COLOR"),
											layout: {
												type: "hbox"
											},
											items: [
												{
													xtype: "textfield",
													name: "color",
													width: 120
												},
												{
													xtype: "splitter"
												},
												{
													xtype: 'splitbutton',
													width: 30,
													menu: {
														showSeparator: false,
														items: [
															{
																xtype: "colorpicker",
																listeners: {
																	select: function(cp, color) {
																		var forecolor = this.down("[name=color]");
																		forecolor.setValue("#" + color);
																	},
																	scope: this
																}
															}, 
															'-'
														]
													}
												}
											]
										},
										{
											xtype: "numberfield",
											name: "borderwidth",
											fieldLabel: IRm$/*resources*/.r1("L_BAND_BORDER"),
											minValue: 0,
											maxValue: 10
										},
										{
                                        	xtype: "checkbox",
                                        	name: "isxaxis",
                                        	fieldLabel: "On X Axis",
                                        	boxLabel: IRm$.r1("B_ENABLED")
                                        }
									]
								},
								{
									xtype: "fieldcontainer",
									layout: "anchor",
									name: "t_2",
									hidden: true,
									items: [
										{
											name: "rtype",
											xtype: "combobox",
											fieldLabel: IRm$/*resources*/.r1("L_CFIT_TYPE"),
											editable: false,
											valueField: "value",
											displayField: "name",
											queryMode: "local",
											autoSelect: true,
											store: {
												fields: [
													"name", "value"
												],
												data: [
													{name: "Linear", value: "linear"},
													{name: "Polynomial", value: "polynomial"},
													{name: "Exponential", value: "exponential"},
													{name: "Logarithmic", value: "logarithmic"},
													{name: "Power", value: "power"}
												]
											},
											listeners: {
												change: function(tobj) {
													var me = this,
														tval = tobj.getValue(),
														porder = me.down("[name=porder]");
														
													porder.setDisabled(tval != "polynomial");
												},
												scope: this
											}
										},
										{
											xtype: "numberfield",
											name: "porder",
											disabled: true,
											fieldLabel: IRm$/*resources*/.r1("L_CFIT_PORD"),
											minValue: 2,
											maxValue: 5
										},
										{
											xtype: "combobox",
											name: "cf_lc",
											fieldLabel: IRm$/*resources*/.r1("L_CFIT_LC"),
											editable: false,
											valueField: "value",
											displayField: "name",
											queryMode: "local",
											autoSelect: true,
											store: {
												fields: [
													"name", "value"
												],
												data: [
													{name: "Solid", value: "Solid"},
													{name: "ShortDash", value: "ShortDash"},
													{name: "ShortDot", value: "ShortDot"},
													{name: "ShortDashDot", value: "ShortDashDot"},
													{name: "ShortDashDotDot", value: "ShortDashDotDot"},
													{name: "Dot", value: "Dot"},
													{name: "Dash", value: "Dash"},
													{name: "LongDash", value: "LongDash"},
													{name: "DashDot", value: "DashDot"},
													{name: "LongDashDot", value: "LongDashDot"},
													{name: "LongDashDotDot", value: "LongDashDotDot"}
												]
											}
										},
										{
											xtype: "checkbox",
											name: "showfitexp",
											fieldLabel: IRm$/*resources*/.r1("L_CFIT_FOR"),
											boxLabel: IRm$/*resources*/.r1("B_ENABLED")
										},
                                        {
                                            xtype: "numberfield",
                                            name: "cfitfcs",
                                            fieldLabel: IRm$/*resources*/.r1("L_CFIT_FCS"),
                                            minValue: 0,
                                            step: 0.1,
                                            value: 0
                                        },
										{
											xtype: "checkbox",
											name: "cfitallseries",
											fieldLabel: IRm$/*resources*/.r1("L_CFIT_AS"),
											boxLabel: IRm$/*resources*/.r1("B_ENABLED")
										},
										{
											xtype: "checkbox",
											name: "cfitshowsum",
											fieldLabel: IRm$/*resources*/.r1("L_CFIT_SS"),
											boxLabel: IRm$/*resources*/.r1("B_ENABLED")
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
						this.m1$9/*confirmChartSetting*/();
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
					this._1/*initApp*/();
				}
			}
		});
		
		IG$/*mainapp*/._Ifb_m/*chartplotband*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._If4/*r_wizard*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	"layout": {
		type: "fit",
		align: "stretch"
	},
	
	closable: false,
	resizable:false,
	width: 320,
	height: 280,
	
	m1$9/*confirmSetting*/: function() {
		var me = this,
			gridparams = me.down("[name=gridparams]"),
			sel = gridparams.getSelectionModel(), selitem;
		
		if (sel.selected.items.length == 0)
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Select field name to set as a parameter value.", null, null, 0, "error");
			return;
		}
		
		selitem = sel.selected.items[0];
		
		if (me.rec)
		{
			var v = selitem.get("name");
			v = IG$/*mainapp*/._I46/*replaceAll*/(v, " ", "_");
			me.rec.set("value", v);
		}
		
		if (me.callback)
		{
			me.callback.execute(me);
		}
		
		me.close();
	},
	
	_IFd/*init_f*/: function() {
		var me = this,
			dc = me.dc,
			gridparams = me.down("[name=gridparams]"),
			i, dp = [];
			
		if (dc)
		{
			for (i=0; i < dc.length; i++)
			{
				dp.push({
					name: dc[i].name,
					cindex: dc[i].cindex,
					isdata: dc[i].isdata
				});
			}
		}
		
		gridparams.store.loadData(dp);
	},
	
	items: [
		{
			xtype: "gridpanel",
			name: "gridparams",
			selType: 'rowmodel',
			store: {
				sortInfo: {},
				fields: [
					"name", "isdata", "cindex"
				]
			},
			columns: [
				{
					text: "Field name",
					flex: 1,
					sortable: false,
					dataIndex: "name"
				},
				{
					text: "Is measure",
					flex: 1,
					sortable: false,
					dataIndex: "isdata"
				},
				{
					text: "Column index",
					flex: 1,
					sortable: false,
					dataIndex: "cindex"
				}
			]
		}
	],
	
	initComponent: function() {	
		this.title = IRm$/*resources*/.r1("T_R_WIZARD");
		
		this.buttons = [
			{
				text: IRm$/*resources*/.r1("B_CONFIRM"),
				handler: function() {
					this.m1$9/*confirmSetting*/();
				},
				scope: this
			}, 
			{
				text: IRm$/*resources*/.r1("B_CANCEL"),
				handler:function() {
					this.close();
				},
				scope: this
			}
		];
		
		IG$/*mainapp*/._If4/*r_wizard*/.superclass.initComponent.apply(this, arguments);
	},
	
	listeners: {
		afterrender: function(ui) {
			var panel = this;
			panel._IFd/*init_f*/();
		}
	}
});

IG$/*mainapp*/._If3/*r_wizard_u*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	"layout": {
		type: "fit",
		align: "stretch"
	},
	
	closable: false,
	resizable:false,
	width: 500,
	height: 400,
	
	_ILa/*reportoption*/: null,
	_ILb/*sheetoption*/: null,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	m1$9/*confirmSetting*/: function() {
		var p = this;
		if (p.callback)
		{
			p.callback.execute(p.m);
		}
		p.close();
	},
	
	cardNav: function(incr) {
		var me = this,
			p = this.down("[name=mainpanel]"),
			l = p.getLayout(),
			i = l.activeItem.id.split("card-")[1],
			next = parseInt(i, 10) + incr,
			bcont = true;
		
		// check for available to action
		if (i == "0" && next > 0)
		{
			var rtypeview = me.down("[name=rtypeview]"),
				rname = me.down("[name=rname]"),
				rcontent = me.down("[name=rcontent]"),
				rprompt = me.down("[name=rprompt]"),
				cpath;
			
			if (me.newitem == true && !me.ufolder)
			{
				return;
			}
			else if (me.newitem == false && (!me.ufolder || (me.ufolder && me.ufolder.get("type") != "RScript")))
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Select script template to continue.", null, null, 0, "error");
				return;
			}
			
			if (me.newitem == true)
			{
				rname.setValue("");
				rcontent.setValue("");
				rprompt.setValue("");
				rname.enable();
				cpath = me.ufolder.get("nodepath");
				cpath = cpath.substring(0, cpath.lastIndexOf("/"));
				me.m = {uid: null, content: "", manage: "T", name: null, isnew: "T", parentcontentpath: cpath};
			}
			else
			{
				var selitem = me.ufolder,
					req = new IG$/*mainapp*/._I3e/*requestServer*/();
					
				if (selitem.get("manage") != "T")
				{
					rname.disable();
				}
				else
				{
					rname.enable();
				}
				me.m = {uid: selitem.get("uid"), manage: selitem.get("manage"), content: "", name: selitem.get("name")};
				req.init(me, 
					{
			            ack: "5",
		                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: selitem.get("uid"), type: selitem.get("type")}, "uid;type"),
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
			        }, me, me.rs_l5/*loadRContent*/, null);
				req._l/*request*/();
			}
		}
		else if (i == "1" && next == 2)
		{
			bcont = true;
			var req,
				rname = me.down("[name=rname]"),
				rcontent = me.down("[name=rcontent]"),
				rprompt = me.down("[name=rprompt]"),
				mpath, pid, apath;
				
			if (rname.getValue() == "")
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Please fill template name to continue.", null, null, 0, "error");
				return;
			}
		}
		else if (i == "2" && next == 3)
		{
			bcont = true;
			var req,
				rname = me.down("[name=rname]"),
				rcontent = me.down("[name=rcontent]"),
				rprompt = me.down("[name=rprompt]"),
				mpath, pid, apath;
				
			if (rname.getValue() == "")
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Please fill template name to continue.", null, null, 0, "error");
				return;
			}
				
			if (me.newitem == true)
			{
				me.m.name = rname.getValue();
				me.m.content = rcontent.getValue();
				me.m.prompt = rprompt.getValue();
				
				if (me.ufolder.get("type") == "RFolder" || me.ufolder.get("type") == "blank")
				{
					pid = me.ufolder.get("uid");
					mpath = me.ufolder.get("nodepath");
				}
				else
				{
					pid = me.ufolder.get("pid");
					mpath = me.ufolder.get("nodepath");
					mpath = mpath.substring(0, mpath.lastIndexOf("/"));
				}
				
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(me, 
					{
		                ack: "31",
			            payload: "<smsg><item" + IG$/*mainapp*/._I20/*XUpdateInfo*/({
			            	address: mpath + "/" + rname.getValue(), 
			            	name: rname.getValue(),
			            	type: 'RScript',
			            	pid: pid,
			            	description: ''
			            }, "address;name;type;pid;description", "s") + "/></smsg>",
			            mbody: "<smsg><item><Content><rscript><![CDATA[" + Base64.encode(rcontent.getValue()) + "]]></rscript><prompt><![CDATA[" + Base64.encode(rprompt.getValue()) + "]]></prompt></Content></item></smsg>"
		            }, me, me.rs_l6/*saveNewTemplate*/);
			    req._l/*request*/();
			    return;
			}
			
			if (me.m.isnew != "T" && rname.getValue() != "" && me.m.manage == "T" && (me.m.content != rcontent.getValue() || me.m.name != rname.getValue()))
			{
				me.m.content = rcontent.getValue();
				me.m.prompt = rprompt.getValue();
				me.m.name = rname.getValue();
				
				IG$/*mainapp*/._I55/*confirmMessages*/("R Wizard", "Template content is changed and not saved. Would you save this content on the template?", me.lm2/*doCloseSave*/, me, me);
				return;
			}
			
			me.l7/*updateParameters*/();
		}
		else if (i == "3" && next == 4)
		{
			bcont = me.l8/*validateParameters*/();
			
			if (bcont == false)
				return;
		}
		
		l.setActiveItem(next);
		me.down("[name=card-prev]").setDisabled(next === 0);
		me.down("[name=card-next]").setDisabled(next === 4);
		me.down("[name=btnconfirm]").setDisabled(next !== 4);
	},
	
	l7/*updateParameters*/: function() {
		var me = this,
			params = [],
			pnames = {},
			content = me.m.content,
			rparamview = me.down("[name=rparamview]"),
			n = 0, s, p, nval, nkey;
		
		while (true)
		{
			s = content.indexOf("@", n);
			
			if (s < 0)
				break;
			
			t = content.indexOf("@", s+1);
			
			if (t < 0)
				break;
				
			p = content.substring(s+1, t);
			pobj = {param: p, name: p};
			
			if (p.indexOf(":") > -1)
			{
				pobj.name = p.substring(0, p.indexOf(":"));
				pobj.desc = p.substring(p.indexOf(":") + 1);
			}
			if (pobj.name.indexOf("_") > -1)
			{
				nkey = pobj.name.substring(0, pobj.name.indexOf("_")).toLowerCase();
				nval = pobj.name.substring(pobj.name.indexOf("_") + 1);
				
				if ((nkey == "column" || nkey == "dimension") && IG$/*mainapp*/._I37/*isNumber*/(nval) == true)
				{
					pobj.p = true;
					nval = Number(nval);
					if (nkey == "column" && !pobj.desc)
					{
						pobj.desc = nval + "th column of starting from numeric";
					}
					else if (!pobj.desc)
					{
						pobj.desc = nval + "th column starting from 0";
					}
				}
			}
			
			if (!pnames[pobj.name])
			{
				pnames[pobj.name] = pobj;
				params.push(pobj);
			}
			
			n = t + 1;
		}
		
		rparamview.store.loadData(params);
	},
	
	l8/*validateParameters*/: function() {
		var r = true,
			me = this,
			params = [],
			content = me.m.content,
			rparamview = me.down("[name=rparamview]"),
			store = rparamview.store, i, rec;
		
		for (i=0; i < store.data.items.length; i++)
		{
			rec = store.data.items[i];
			params.push({
				param: rec.get("param"),
				name: rec.get("name"),
				value: rec.get("value"),
				p: rec.get("p")
			});
		}
		
		for (i=0; i < params.length; i++)
		{
			if (params[i].p !== true)
			{
				if (params[i].value)
				{
					content = IG$/*mainapp*/._I46/*replaceAll*/(content, "@" + params[i].param + "@", params[i].value);
				}
				else
				{
					IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Fill or set parameter [" + params[i].name + "] value to continue.", null, null, 0, "error");
					r = false;
					break;
				}
			}
		}
		
		me.m.vcontent = content;
		
		return r;
	},
	
	lm2/*doCloseSave*/: function(btn) {
		var me = this,
			req,
			p = this.down("[name=mainpanel]"),
			l = p.getLayout();
		if (btn == "yes")
		{
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
	                ack: "31",
		            payload: "<smsg><item name='" + me.m.name + "' type='RScript' uid='" + me.m.uid + "' description=''/></smsg>",
		            mbody: "<smsg><item><Content><rscript><![CDATA[" + Base64.encode(me.m.content) + "]]></rscript><prompt><![CDATA[" + Base64.encode(me.m.prompt) + "]]></prompt></Content></item></smsg>"
	            }, me, me.rs_l6/*saveNewTemplate*/);
		    req._l/*request*/();
		}
		
		me.l7/*updateParameters*/();
		l.setActiveItem(2);
	},
	
	rs_l6/*saveNewTemplate*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		
		if (tnode)
		{
			me.m.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid");
			me.m.name = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "name");
			me.newitem = false;
		}
		
		me.l1/*loadRScriptList*/();
	},
	
	rs_l5/*loadRContent*/: function(xdoc) {
		var me = this,
			rname = me.down("[name=rname]"),
			rcontent = me.down("[name=rcontent]"),
			rprompt = me.down("[name=rprompt]"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			cnode, content, lnode;
		
		if (tnode)
		{
			me.m.name = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "name");
			me.m.content = "";
			me.m.prompt = "";
			rname.setValue(me.m.name);
			cnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "Content");
			
			if (cnode)
			{
				lnode = IG$/*mainapp*/._I18/*XGetNode*/(cnode, "rscript");
				
				if (lnode)
				{
					content = IG$/*mainapp*/._I24/*getTextContent*/(lnode);
					content = Base64.decode(content);
					me.m.content = content;
				}
				
				lnode = IG$/*mainapp*/._I18/*XGetNode*/(cnode, "prompt");
				if (lnode)
				{
					content = IG$/*mainapp*/._I24/*getTextContent*/(lnode);
					content = Base64.decode(content);
					me.m.prompt = content;
				}
			}
				
			rcontent.setValue(me.m.content);
			rprompt.setValue(me.m.prompt);
		}
	},
	
	_IFe/*initF*/: function() {
		this.l1/*loadRScriptList*/();
		if (this._ILa/*reportoption*/ && this._ILb/*sheetoption*/)
		{
			
		}
	},
	
	l1/*loadRScriptList*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "5",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: "/RScripts", type: "RFolder", depth: "5"}, "uid;type;depth"),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
	        }, panel, panel.rs_l1/*loadRScriptList*/, null);
		req._l/*request*/();
	},
	
	rs_l1/*loadRScriptList*/: function(xdoc) {
		var panel = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			rtypeview = panel.down("[name=rtypeview]"),
			rscripts = [];
		
		if (tnode != null)
		{
			panel.l2/*parseRscripts*/(tnode, rscripts);
		}
		
		rtypeview.store.loadData(rscripts);
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this,
			dlgpop;
			
		switch (cmd)
		{
		case "cmd_add_group":
			dlgpop = new IG$/*mainapp*/._I6e/*makeItem*/({
				parentnodepath: "/RScripts",
				itemtype: "RFolder",
				parentuid: me.rootuid
			});
			dlgpop.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs_m1/*createFolderGroup*/);
			dlgpop.show(me);
			break;
		case "cmd_add_template":
			me.l4/*appendTemplate*/();
			break;
		}
	},
	
	l4/*appendTemplate*/: function() {
		var me = this,
			rtypeview = me.down("[name=rtypeview]"),
			sel = rtypeview.getSelectionModel();
		
		if (sel.selected.items.length > 0)
		{
			me.ufolder = sel.selected.items[0];
			me.newitem = true;
			me.cardNav(1);
		}
		else
		{
			IG$/*mainapp*/._I52/*ShowError*/("Click item to add on the same folder.", this);
		}
	},
	
	rs_m1/*createFolderGroup*/: function(xdoc) {
		var me = this;
		me.l1/*loadRScriptList*/();
	},
	
	l2/*parseRscripts*/: function(tnode, rscripts) {
		var i, panel = this, itemtype, robj,
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode), cpath, apath;
			
		for (i=0; i < tnodes.length; i++)
		{
			robj = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			itemtype = robj.type.toLowerCase();
			if (itemtype == "folder" || itemtype == "rfolder")
			{
				if (tnodes[i].hasChildNodes() == false)
				{
					robj.groupname = robj.nodepath;
					robj.name = "No item is defined!";
					robj.type = "blank";
					rscripts.push(robj);
				}
				else
				{
					panel.l2/*parseRscripts*/(tnodes[i], rscripts);
				}
			}
			else if (itemtype == "rscript")
			{
				cpath = robj.nodepath;
				apath = cpath.split("/");
				apath.splice(apath.length - 1, 1);
				robj.groupname = apath.join("/");
				rscripts.push(robj);
			}
		}
	},
	
	cxc/*loadDataSet*/: function(rowIndex) {
		var panel = this,
			storecolumn = this.down("[name=rtypeview]").store, 
			rec = storecolumn.data.items[rowIndex];
			
		if (rec && rec.get("type") == "RScript")
		{
			panel.ufolder = rec;
			panel.newitem = false;
			panel.cardNav(1);
		}
	},
	
	rxc/*removeDataSet*/: function(rowIndex) {
		var panel = this,
			storecolumn = this.down("[name=rtypeview]").store, 
			rec = storecolumn.data.items[rowIndex];
			
		if (rec)
		{
			if (rec.get("manage") != "T")
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "The content is not removeable.", null, null, 1, "error");
			}
			else
			{
				panel.mrec = rec;
				IG$/*mainapp*/._I55/*confirmMessages*/("R Wizard", "Click yes to remove item or folder.", panel._IM8/*doClose*/, panel, panel);
			}
		}
	},
	
	cxm/*updateParameter*/: function(rowIndex) {
		var panel = this,
			storecolumn = this.down("[name=rparamview]").store, 
			rec = storecolumn.data.items[rowIndex], pw;
			
		if (rec)
		{
			if (rec.get("p") == true)
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Predefined parameters could not be mapped with result.");
				return;
			}
			
			pw = new IG$/*mainapp*/._If4/*r_wizard*/({
				dc: panel.dc,
				rec: rec,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs_cxm/*updateParameter*/)
			});
			pw.show(panel);
		}
	},
	
	rs_cxm/*updateParameter*/: function(dlg) {
	},
	
	_IM8/*doClose*/: function(btn) {
		if (btn == "yes")
		{
			var panel = this,
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
		            ack: "30",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.mrec.get("uid")}, "uid"),
	                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "delete"})
		        }, panel, panel.rs_rxc/*removeDataSet*/, null);
			req._l/*request*/();
		}
	},
	
	rs_rxc/*removeDataSet*/: function(xdoc) {
		var me = this;
		me.l1/*loadRScriptList*/();
	},
	
	initComponent : function() {
		var panel = this;
	    
	    panel.title = IRm$/*resources*/.r1("T_R_WIZARD");
	    
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
			
			items: [
				{
					xtype: "panel",
					name: "mainpanel",
					layout: "card",
					activeItem: 0,
					
					items: [
						{
							id: "card-0",
							xtype: "panel",
							layout: "fit",
							border: 0,
							defaults: {
								anchor: "100%"
							},
							items: [
								{
									xtype: "gridpanel",
									name: "rtypeview",
									height: 290,
									selType: 'rowmodel',
									features: [
										{
											ftype: "grouping",
											groupHeaderTpl: 'RScript: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
										}
									],
							    	store: {
							    		sortInfo: {},
							    		groupField: 'groupname',
							    		fields: [
							    			"name", "uid", "nodepath", "groupname", "description", "type", "manage"
										]
							    	},
							    	columns: [
							    		{
							    			text: "Name",
							    			flex: 1,
							    			sortable: false,
							    			dataIndex: "name"
							    		},
							    		{
							    			text: "Description",
							    			flex: 1,
							    			sortable: false,
							    			dataIndex: "description"
							    		},
							    		{
											xtype: "actioncolumn",
											width: 50,
											sortable: false,
											
											items: [
												{
													// icon: "./images/gears.png",
													iconCls: "icon-grid-config",
													tooltip: IRm$/*resources*/.r1("B_CONFIG_ITEM"),
													handler: function (grid, rowIndex, colIndex) {
														panel.cxc/*loadDataSet*/(rowIndex);
													},
													scope: panel
												},
												{
													// icon: "./images/delete.png",
													iconCls: "icon-grid-delete",
													tooltip: IRm$/*resources*/.r1("B_DELETE_ITEM"),
													handler: function (grid, rowIndex, colIndex) {
														panel.rxc/*removeDataSet*/(rowIndex);
													},
													scope: panel
												}
											]
										}
							    	],
							    	fbar: [
										"->",
										{ 
									  		xtype: 'button', 
									  		plain: true,
									  		text: 'Add Folder',
									  		handler: function() {
									  			this._t$/*toolbarHandler*/('cmd_add_group'); 
									  		},
									  		scope: this
									  	},
								       	{
								        	text: "Or click here to create new template",
								        	handler: function() {
								        		this._t$/*toolbarHandler*/('cmd_add_template'); 
								        	},
								        	scope: this
								       	}
									]
								}
							]
						},
						{
							id: "card-1",
							xtype: "panel",
							border: false,
							"layout": {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "fieldset",
									title: "R Script",
									layout: "anchor",
									defaults: {
										anchor: "100%"
									},
									items: [
										{
											xtype: "textfield",
											name: "rname",
											fieldLabel: "Name",
											labelWidth: 60
										},
										{
											xtype: "textarea",
											height: 240,
											name: "rcontent"
										}
									]
								}
							]
						},
						{
							id: "card-2",
							xtype: "panel",
							border: false,
							"layout": {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "fieldset",
									title: "R Prompt",
									layout: "anchor",
									defaults: {
										anchor: "100%"
									},
									items: [
										{
											xtype: "textarea",
											height: 260,
											name: "rprompt"
										}
									]
								}
							]
						},
						{
							id: "card-3",
							xtype: "panel",
							border: false,
							"layout": {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_R_PARAM"),
									layout: "anchor",
									defaults: {
										anchor: "100%"
									},
									items: [
										{
											xtype: "gridpanel",
											name: "rparamview",
											height: 270,
											store: {
												sortInfo: {},
												fields: [
													"name", "desc", "param", "value", "p"
												]
											},
											columns: [
												{
													text: "Name",
													flex: 1,
													sortable: false,
													dataIndex: "name"
												},
												{
													text: "Value",
													flex: 1,
													sortable: false,
													dataIndex: "value"
												},
												{
													text: "Description",
													flex: 1,
													sortable: false,
													dataIndex: "desc"
												},
												{
													xtype: "actioncolumn",
													width: 50,
													sortable: false,
													
													items: [
														{
															// icon: "./images/gears.png",
															iconCls: "icon-grid-config",
															tooltip: IRm$/*resources*/.r1("B_CONFIG_ITEM"),
															handler: function (grid, rowIndex, colIndex) {
																panel.cxm/*updateParameter*/(rowIndex);
															},
															scope: panel
														}
													]
												}
											]
										}
									]
								}
							]
						},
						{
							id: "card-4",
							xtype: "panel",
							border: false,
							"layout": {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "fieldset",
									title: "Summary",
									defaults: {
										width: 280
									},
									items: [
										{
											html: "Parameters are mapped with report result and ready to run. <BR> Click confirm to get Revolution results on the sheet",
											border: 0
										}
									]
								}
							]
						}
					],
					
					listeners: {
						cardswitch: function() {
						}
					}
				}
			],
			
			buttons:[
				{
					name: "card-prev",
					text: "&laquo; " + IRm$/*resources*/.r1("B_PREVIOUS"),
					handler: function() {
						this.cardNav(-1);
					},
					scope: this,
					disabled: true
				},
				{
					name: "card-next",
					text: IRm$/*resources*/.r1("B_NEXT") + " &raquo;",
					handler: function() {
						var panel = this,
							p = this.down("[name=mainpanel]"),
							rtypeview = panel.down("[name=rtypeview]"),
							sel = rtypeview.getSelectionModel(),
							l = p.getLayout(),
							i = l.activeItem.id;
						
						if (i == "card-0")
						{
							panel.ufolder = (sel.selected && sel.selected.length > 0 ? sel.selected.items[0] : null);
							panel.newitem = false;
						}
						this.cardNav(1);
					},
					scope: this
				},
				{
					name: "btnconfirm",
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						this.m1$9/*confirmSetting*/();
					},
					scope: this
				}, 
				{
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
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/._If3/*r_wizard_u*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._Ia3/*chartwizard*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	"layout": {
		type: "fit",
		align: "stretch"
	},
	
	closable: false,
	resizable:false,
	width: 550,
	height: 480,
	
	_ILa/*reportoption*/: null,
	_ILb/*sheetoption*/: null,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	m1$9/*confirmChartSetting*/: function(b_apply) {
		var me = this,
			p = this.down("[name=_a]");
		if (me.m1$12/*updateChartSetting*/() == true)
		{
			me.callback && me.callback.execute();
			
			!b_apply && me._IG0/*closeDlgProc*/();
		}
	},
	
	cardNav: function(incr) {
		var me = this,
			p = me.down("[name=_a]"),
			l = p.getLayout(), //this.getLayout(),
			a = l.getActiveItem(),
			i, n = -1, next;
		
		for (i=0; i < p.items.length; i++)
		{
			if (p.items.items[i] == a)
			{
				n = i;
				break;
			}
		}

		if (n > -1 && n < p.items.length)
		{
			next = n + incr;
				
			l.setActiveItem(next);
			me.p2/*setAdvancedOptions*/.call(me);
			me.down("[name=card_prev]").setDisabled(next === 0);
			me.down("[name=card_next]").setDisabled(next === p.items.length-1);
		}
	},
	
	srr/*continueSeriesOption*/: function(dlg) {
		if (dlg.cell_record)
		{
			dlg.cell_record.set("seriestype", dlg.seriestype || "");
			dlg.cell_record.set("dl_linetype", dlg.dl_linetype || "");
			dlg.cell_record.set("dl_marker", dlg.dl_marker || "");
			dlg.cell_record.set("dl_enable", dlg.dl_enable || "");
		}
	},
	
	// C1/*charttype*/: "all",
	
	c1/*changeChartGroup*/: function() {
		var me = this,
			chartgroup = me.down("[name=chartgroup]"),
			charttypelist = me.c1l/*charttypelist*/,
			charttypeview = me.down("[name=_b]"),
			charttype = chartgroup.getValue(),
			chartitem,
			opt = this._ILb/*sheetoption*/.cco/*chartOption*/,
			selected = charttypeview.selModel.selected.items,
			subtype = (selected && selected.length > 0) ? selected[0].data.subtype : opt.subtype,
			dp = [], i,
			record;
		
		if (charttype != me.C1/*charttype*/)
		{
			for (i=0; i < charttypelist.length; i++)
			{
				chartitem = charttypelist[i];
				if (charttype == "all" || chartitem.grp == charttype || subtype == chartitem.subtype)
				{
					dp.push(chartitem);
				}
			}
			
			charttypeview.store.loadData(dp);
			
			for (i=0; i < charttypeview.store.data.items.length; i++)
			{
				record = charttypeview.store.data.items[i];
				if (record.data.subtype == subtype)
				{
					setTimeout(function() {
						charttypeview.select(record);
					}, 100);
					break;
				}
			}
			
			me.C1/*charttype*/ = charttype;
		}
	},
	
/* for inner panel*/
	vmap: [
		{n: "useformula"},
		{n: "xlabel"},
		{n: "xaxisrot"},
		{n: "xstagl"},
		{n: "xstep"},
		{n: "ytickint"},
		{n: "swapaxis"},
		{n: "enablepivot", c: "pivotenable"},
		{n: "enabledrill", c: "drillenable"},
		{n: "showlegend"},
		{n: "legendposition"},
		{n: "lgndfloating"},
		{n: "precision", c: "numericprecision"},
		{n: "maxchartresult"},
		{n: "showtitle"},
		{n: "stack", c: "stackvalue"},
		{n: "stackperc", c: "stackperc"},
		{n: "title", c: "titletext"},
		{n: "titleposition"},
		{n: "usedualaxis", c: "dualaxis"},
		{n: "renderbymeasures", c: "renderbymeasures"},
		{n: "colorset"},
		{n: "anderson_species"},
		{n: "enablezoom"},
		{n: "enabledragselect"},
		{n: "yaxisformat"},
		{n: "yaxistitle"},
		{n: "yaxismin"},
		{n: "yaxismax"},
		{n: "yaxisformat2"},
		{n: "yaxistitle2"},
		{n: "yaxismin2"},
		{n: "yaxismax2"},
		{n: "rel_range1", s: -1},
		{n: "rel_range2", s: 1},
		{n: "comp_range0", s: 0},
		{n: "comp_range1", s: 0},
		{n: "maptype", s: "us_states"},
		{n: "mapcategory"},
		{n: "pieinnerradius"},
		{n: "pielabeldist"},
		{n: "pielayout"},
		{n: "tm_l_alg"},
		{n: "tm_l_cl"},
		{n: "nat_timefield"},
		{n: "nat_datafield"},
		{n: "nat_groupfield"},
		{n: "nat_xdata"},
		{n: "nat_ydata"},
		{n: "nat_vdata"},
		{n: "timeseriesfield"},
		{n: "timeseriesduration", d: 1000},
		{n: "bmaprow"},
		{n: "bmapyaxis"},
		{n: "bmapsizeaxisfield"},
		{n: "bmapyaxisfield"},
		{n: "bmapsize"},
		{n: "dl_enable"},
		{n: "dl_marker"},
		{n: "dl_align", s: "center"},
		{n: "dl_inside"},
		{n: "cunittext"},
		{n: "useformatvalue"},
		{n: "chd_method", d: "relations"}
	],
	_IFe/*initF*/: function() {
		var me = this,
			vmap = me.vmap,
			i;
		// make cache
		me.cmap = {};
		for (i=0; i < vmap.length; i++)
		{
			me.cmap[vmap[i].n] = me.down("[name=" + vmap[i].n + "]");
		}
			
		if (me._ILa/*reportoption*/ && me._ILb/*sheetoption*/)
		{
			var opt = me._ILb/*sheetoption*/.cco/*chartOption*/,
				charttypeview = me.down("[name=_b]"),
				ct_relation_group = me.down("[name=relation_group]"),
				maptype = me.cmap["maptype"],
				colorset = me.cmap["colorset"],
				record,
				drows = [],
				dtimerows = [],
				dmeasures = [],
				ritem;
			
			maptype.store.loadData(IG$/*mainapp*/.mLU ? IG$/*mainapp*/.mLU.maptype : []);
			
			for (i=0; i < charttypeview.store.data.items.length; i++)
			{
				record = charttypeview.store.data.items[i];
				if (record.data.subtype == opt.subtype)
				{
					setTimeout(function() {charttypeview.select(record);}, 100);
					break;
				}
			}
			
			dtimerows.push({name: "Not use", uid: ""});
			
			for (i=0; i < me._ILb/*sheetoption*/.rows.length; i++)
			{
				ritem = IG$/*mainapp*/._I1e/*CloneObject*/(me._ILb/*sheetoption*/.rows[i]);
				drows.push(ritem);
				dtimerows.push(ritem);
			}
			
			if (me._ILb/*sheetoption*/.cols.length == 0)
			{
				for (i=0; i < me._ILb/*sheetoption*/.measures.length; i++)
				{
					ritem = IG$/*mainapp*/._I1e/*CloneObject*/(me._ILb/*sheetoption*/.measures[i]);
					dmeasures.push(ritem);
				}
			}
			else
			{
				for (i=0; i < 10; i++)
				{
					ritem = {
						name: "column " + (i+1),
						value: i
					};
					dmeasures.push(ritem);
				}
			}
			
			me.cmap["anderson_species"].store.loadData(drows);
			me.cmap["mapcategory"].store.loadData(drows);
			
			me.cmap["nat_timefield"].store.loadData(drows);
			me.cmap["nat_datafield"].store.loadData(drows);
			me.cmap["nat_groupfield"].store.loadData(drows);
			
			me.cmap["nat_xdata"].store.loadData(dmeasures);
			me.cmap["nat_ydata"].store.loadData(dmeasures);
			me.cmap["nat_vdata"].store.loadData(dmeasures);
			
			me.cmap["timeseriesfield"].store.loadData(dtimerows);
			me.cmap["bmapsizeaxisfield"].store.loadData(dmeasures);
			me.cmap["bmapyaxisfield"].store.loadData(dmeasures);
			
			var rgroups = [],
				opt_groupindex = (opt.relationgroups) ? opt.relationgroups.split(",") : null;
			
			for (i=0; i < me._ILb/*sheetoption*/.measures.length; i++)
			{
				rgroups.push({seq: ""+i, name: me._ILb/*sheetoption*/.measures[i].name, groupindex: (opt_groupindex && opt_groupindex.length > i && opt_groupindex[i] != "") ? parseInt(opt_groupindex[i]) : i});
			}
			
			ct_relation_group.store.loadData(rgroups);
			
			var k, cdp = [
				{name: "Default", value: ""}
			];
			
			for (k in IG$/*mainapp*/.__c_/*chartoption*/.chartcolors) {
				cdp.push({name: k, value: k});
			}
			
			colorset.store.loadData(cdp);
			
			IG$/*mainapp*/._1/*applyFormOptions*/.call(this, opt, vmap, true);
			me.down("[name=tm_l_cl]").setValue(opt.tm_l_cl == "T");
			me.down("[name=piedatalabel]").setValue(opt.piedatalabel);
			
			me.down("[name=p_bands]").store.loadData(opt.p_bands);
			
			me._upd_series_grid();
		}
	},
	
	_upd_series_grid: function() {
		var me = this,
			opt = me._ILb/*sheetoption*/.cco/*chartOption*/,
			renderbymeasures = me.down("[name=renderbymeasures]").getValue(),
			grd_seriestype = me.down("[name=grid_seriestype]"),
			seriestype = [],
			obj,
			measures = me._ILb/*sheetoption*/.measures,
			n = renderbymeasures ? measures.length : Math.max(5, measures.length);
			
		for (i=0; i < n; i++)
		{
			obj = {};
			obj.index = (i+1);
			
			if (renderbymeasures)
			{
				obj.m_name = (measures.length > i) ? measures[i].name : "N/A";
			}
			else
			{
				obj.m_name = "series " + obj.index;
			}
			
			obj.seriestype = (opt.renderas && opt.renderas.length > i) ? opt.renderas[i] : "";
			obj.y2axis = (opt.dualaxisitem && opt.dualaxisitem.length > i) ? opt.dualaxisitem[i] == "T" : false;
			obj.dl_enable = (opt.dl_enable_l && opt.dl_enable_l.length > i) ? opt.dl_enable_l[i] : "";
			obj.dl_marker = (opt.dl_marker_l && opt.dl_marker_l.length > i) ? opt.dl_marker_l[i] : "";
			obj.dl_linetype = (opt.dl_linetype_l && opt.dl_linetype_l.length > i) ? opt.dl_linetype_l[i] : "";
			
			seriestype.push(obj);
		}
		
		grd_seriestype.store.loadData(seriestype);
	},
	
	_v1/*validateFields*/: function() {
		var me = this,
			cp,
			i,
			charttypeview = me.down("[name=_b]"),
			selected = charttypeview.selModel.selected.items,
			opt = {};
		
		if (selected && selected.length)
		{
			opt = {
				charttype: selected[0].get("charttype"),
				subtype: selected[0].get("subtype")
			};
			
			if (me.cPP/*customPanels*/ && me.cPP/*customPanels*/.length > 0)
			{
				for (i=0; i < me.cPP/*customPanels*/.length; i++)
				{
					cp = me.cPP/*customPanels*/[i];
					cp.invalidateFields && cp.invalidateFields.call(cp, opt);
				}
			}
		}
	},
	
	m1$12/*updateChartSetting*/: function() {
		var i,
			me = this,
			opt = me._ILb/*sheetoption*/.cco/*chartOption*/,
			charttypeview = me.down("[name=_b]"),
			selected = charttypeview.selModel.selected.items,
			ct_relation_group = me.down("[name=relation_group]"),
			ct_relgroup_store = ct_relation_group.store.data.items,
			rgroupvalue,
			rgroups = "",
			sto_seriestype = me.down("[name=grid_seriestype]").store.data.items,
			vmap = me.vmap,
			cp,
			rec, bobj,
			p_bands = me.down("[name=p_bands]");
		
		if (selected && selected.length > 0)
		{
			opt.charttype = selected[0].data.charttype;
			opt.subtype = selected[0].data.subtype;
		}
		
		for (i=0; i < ct_relgroup_store.length; i++)
		{
			rgroupvalue = ct_relgroup_store[i].data.groupindex;
			rgroupvalue = parseInt(rgroupvalue);
			if (isNaN(rgroupvalue) == false)
			{
				rgroups += rgroupvalue + ","
			}
		}
		
		opt.p_bands = [];
		
		for (i=0; i < p_bands.store.data.items.length; i++)
		{
			rec = p_bands.store.data.items[i];
			bobj = new IG$/*mainapp*/._Ifb_n/*chartplotbandobject*/(null);
			bobj._3/*readRecords*/(rec);
			opt.p_bands.push(bobj);
		}
		
		opt.relationgroups = rgroups;
		
		IG$/*mainapp*/._1/*applyFormOptions*/.call(this, opt, vmap);
		opt.tm_l_cl = me.down("[name=tm_l_cl]").getValue() ? "T" : "F";
		opt.piedatalabel = me.down("[name=piedatalabel]").getValue();
		
		opt.renderas = [];
		opt.dualaxisitem = [];
		opt.dl_marker_l = [];
		opt.dl_linetype_l = [];
		opt.dl_enable_l = [];
		
		if (sto_seriestype)
		{
			for (i=0; i < sto_seriestype.length; i++)
			{
				opt.renderas.push(sto_seriestype[i].data.seriestype || "");
				opt.dualaxisitem.push(sto_seriestype[i].data.y2axis ? "T" : "");
				opt.dl_marker_l.push(sto_seriestype[i].data.dl_marker || "");
				opt.dl_linetype_l.push(sto_seriestype[i].data.dl_linetype || "");
				opt.dl_enable_l.push(sto_seriestype[i].data.dl_enable || "");
			}
		}
		
		if (me.cPP/*customPanels*/ && me.cPP/*customPanels*/.length > 0)
		{
			for (i=0; i < me.cPP/*customPanels*/.length; i++)
			{
				cp = me.cPP/*customPanels*/[i];
				cp.updateOptionValues && cp.updateOptionValues.call(cp);
			}
		}
		
		return true;
	},
	
	p2/*setAdvancedOptions*/: function() {
		var me = this,
			charttypeview = me.down("[name=_b]"),
			selected = charttypeview.selModel.selected.items,
			charttype = (selected && selected.length > 0) ? selected[0].data.charttype : null,
			timeoption = me.down("[name=timeoption]"),
			mapoptions = me.down("[name=mapoptions]"),
			bubblemapoption = me.down("[name=bubblemapoption]"),
			pieoption = me.down("[name=pieoption]"),
			tm_opt = me.down("[name=tm_opt]"),
			mview,
			i, v;
			
		mview = {
			optview: ["opt_anderson", "opt_relation", "opt_range", "opt_series", "opt_nations", "opt_series", "opt_chord"],
			matrix: ["opt_comparison"],
			anderson: ["opt_anderson"],
			matrixdiagram: ["opt_relation", "opt_range"],
			networkdiagram_pos: ["opt_relation", "opt_range"],
			networkdiagram_neg: ["opt_relation", "opt_range"],
			forcelayout: ["opt_relation", "opt_range"],
			nation: ["opt_nations"],
			chord: ["opt_chord"],
			defaults: ["opt_series"]
		};
		
		timeoption.setVisible(charttype == "nation");
		// pieoption.setVisible(charttype == "pie");
		tm_opt.setVisible(charttype == "treemap");
		
		bubblemapoption.setVisible(charttype == "bubblemap");
		mapoptions.setVisible(charttype == "map");
		
		v = mview[charttype] || mview["defaults"];
		
		for (i=0; i < mview.optview.length; i++)
		{
			me.down("[name=" + v + "]").hide();
		}
		
		for (i=0; i < v.length; i++)
		{
			me.down("[name=" + v + "]").show();
		}
		
		me._v1/*validateFields*/();
	},
/* end of inner panel*/

	_c3d/*change3doption*/: function(c) {
		var me = this,
			e3d_al = me.down("[name=e3d_al]");
		
		if (e3d_al)
		{
			me.down("[name=e3d_al]").setValue(c ? 45 : 15);
			me.down("[name=e3d_be]").setValue(c ? 0 : 15);
			me.down("[name=e3d_de]").setValue(c ? 35 : 50);
			me.down("[name=e3d_vd]").setValue(c ? 0 : 25);
		}
	},
	
	initComponent : function() {
		var panel = this,
			me = this,
			charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype;
			
		panel.title = IRm$/*resources*/.r1("T_CHART_WIZARD");
		
		me.c1l/*charttypelist*/ = charttype;
				 
		panel.cPP/*customPanels*/ = [];
		
		$s.apply(me, {
						
			items: [
				{
					xtype: "panel",
					layout: {
						type: "hbox",
						align: "stretch"
					},
					border: 0,
					items: [
						{
							xtype: "container",
							name: "_c",
							padding: 5,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							width: 80
						},
						{
							xtype: "panel",
							name: "_a",
							flex: 1,
							padding: 10,
							"layout": "card",
							activeItem: 0,
							border: 0,
							$h: 410,
														
							defaults: {
								header: false,
								hideHeaders: true,
								padding: 0
							},
							
							items: [
								{
									xtype: "panel",
									title: IRm$/*resources*/.r1("L_CSTEP_1"),
									border: 0,
									"layout": {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											name: "chartgroup",
											fieldLabel: IRm$/*resources*/.r1("L_CHART_GROUP"),
											
											xtype: "combobox",
											queryMode: "local",
											displayField: "name",
											valueField: "value",
											editable: false,
											autoSelect: true,
											width: 320,
											store: {
												xtype: "store",
												fields: [
													"name", "value"
												],
												data: IG$/*mainapp*/.__c_/*chartoption*/.chartcateg
											},
											listeners: {
												afterrender: function(ui) {
													ui.setValue("all");
												},
												change: function(field, newvalue, oldvalue, opt) {
													var me = this;
													me.c1/*changeChartGroup*/();
												},
												scope: this
											}
										},
										{
											xtype: "panel",
											border: 1,
											flex: 1,
											layout: "fit",
											items: [
												{
													xtype: "dataview",
													name: "_b",
													initialSelect: null,
													store: {
														fields: [
															"label", "charttype", "subtype", "img", "grp"
														],
														sortInfo: {},
														data: charttype
													},
													
													tpl: [
														'<tpl for=".">',
											                '<div class="thumb-wrap" id="{subtype}">',
											                '<div class="thumb"><div class="ig-chart-base ig-chart-{img}" title="{label}"></div></div>',
											                '<span class="x-editable">{label}</span>',
											                '</div>',
											            '</tpl>',
											            '<div class="x-clear"></div>'
													],
											        
											    	overItemCls: "x-item-over",
											    	itemSelector: "div.thumb-wrap",
											    	overItemCls: "phone-hover",
											    	multiSelect: false,
											    	autoScroll: true,
											    	trackOver: true,
											    	listeners: {
											    		beforecontainerclick: function(dview, ev) {
											    			return false;
											    		},
											    		itemclick: function(dview, record, item, index, e, eopts) {
											    			var me = this,
											    				subtype = record.get("subtype");
											    			
											    			if (subtype == "pie" || subtype == "doughnut")
											    			{
											    				me._c3d/*change3doption*/(1);
											    			}
											    			else
											    			{
											    				me._c3d/*change3doption*/(0);
											    			}
											    		},
											    		scope: this
											    	}
												}
											]
										}
									]
								},
								{
									xtype: "panel",
									title: IRm$/*resources*/.r1("L_CSTEP_2"),
									border: false,
									"layout": {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_DATA_OPTION"),
											defaultType: "textfield",
											defaults: {
												width: 280
											},
											items: [
												{
													name: "useformula",
													fieldLabel: IRm$/*resources*/.r1("L_USE_FORMULA"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLE"),
													inputValue: "T",
													checked: false
												},
												{
													name: "swapaxis",
													fieldLabel: IRm$/*resources*/.r1("L_SWAP_AXIS"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLE"),
													inputValue: "T",
													checked: false
												},
												{
													name: "maxchartresult",
													fieldLabel: IRm$/*resources*/.r1("L_MAX_CHART_ELEMENT"),
													xtype: "numberfield",
													value: 0,
													minValue: 0,
													maxValue: 1000000,
													allowDecimals: false,
													decimalPrecision: 0,
													step: 1
												},
												{
													name: "cunittext",
													xtype: "textfield",
													fieldLabel: IRm$/*resources*/.r1("L_UNIT_TEXT")
												}
											]
										},
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_CHART_OPTION"),
											defaultType: "textfield",
											defaults: {
												width: 280
											},
											items: [
												{
													name: "pivotenable",
													fieldLabel: IRm$/*resources*/.r1("L_ENABLE_PIVOT"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													inputValue: "T",
													hidden: true,
													checked: false,
													listener: {
														/*change: function() {
															me.setPivotEnableStatus();
														},
														scope: me
														*/
													}
												},
												{
													name: "drillenable",
													fieldLabel: IRm$/*resources*/.r1("L_ENABLE_DRILL"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													inputValue: "T",
													checked: false
												},
												{
													name: "enablezoom",
													fieldLabel: IRm$/*resources*/.r1("B_ZOOM"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													checked: false,
													listeners: {
														change: function(tobj) {
															var enabledragselect = this.down("[name=enabledragselect]"),
																tval = tobj.getValue();
															enabledragselect.setDisabled(tval);
															if (tval)
															{
																enabledragselect.setValue(false);
															}
														},
														scope: this
													}
												},
												{
													name: "enabledragselect",
													fieldLabel: IRm$/*resources*/.r1("L_DRAG_SELECT"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													checked: false,
													listeners: {
														change: function(tobj) {
															var enablezoom = this.down("[name=enablezoom]"),
																tval = tobj.getValue();
															enablezoom.setDisabled(tval);
															if (tval)
															{
																enablezoom.setValue(false);
															}
														},
														scope: this
													}
												}
											]
										}
									]
								},
								{
									xtype: "panel",
									title: IRm$/*resources*/.r1("L_CSTEP_3"),
									border: false,
									autoScroll: true,
									"layout": {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_VIEW_OPTION"),
											defaultType: "textfield",
											
											items: [
												{
													name: "showlegend",
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_SHOW"),
													inputValue: "T",
													checked: false
												},
												{
													name: "legendposition",
													fieldLabel: IRm$/*resources*/.r1("L_LEGEND_POSITION"),
													
													xtype: "combobox",
													queryMode: "local",
													displayField: "name",
													valueField: "value",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: [
															"name", "value"
														],
														data: [
															{name: "Bottom Left", value: "BOTTOM_LEFT"},
															{name: "Bottom Center", value: "BOTTOM_CENTER", selected: true},
															{name: "Bottom Right", value: "BOTTOM_RIGHT"},
															{name: "Top Left", value: "TOP_LEFT"},
															{name: "Top Center", value: "TOP_CENTER"},
															{name: "Top Right", value: "TOP_RIGHT"},
															{name: "Right Top", value: "RIGHT_TOP"},
															{name: "Right Center", value: "RIGHT_CENTER"},
															{name: "Right Bottom", value: "RIGHT_BOTTOM"},
															{name: "Left Top", value: "LEFT_TOP"},
															{name: "Left Center", value: "LEFT_CENTER"},
															{name: "Left Bottom", value: "LEFT_BOTTOM"}
														]
													}
												},
												{
													name: "lgndfloating",
													fieldLabel: IRm$/*resources*/.r1("L_FLOATING"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED")
												}
											]
										},
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_DATA_LABEL"),
											defaultType: "textfield",
											
											items: [
												{
													name: "dl_enable",
													xtype: "checkbox",
													fieldLabel: IRm$/*resources*/.r1("B_ENABLED"),
													boxLabel: IRm$/*resources*/.r1("B_SHOW"),
													inputValue: "T",
													checked: false
												},
												{
													name: "useformatvalue",
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													fieldLabel: IRm$/*resources*/.r1("L_C_FMT_VAL")
												},
												{
													name: "dl_marker",
													xtype: "checkbox",
													fieldLabel: IRm$/*resources*/.r1("L_MARKER"),
													boxLabel: IRm$/*resources*/.r1("B_SHOW"),
													inputValue: "T",
													checked: false
												},
												{
													name: "dl_align",
													fieldLabel: IRm$/*resources*/.r1("L_LABEL_ALIGN"),
													
													xtype: "combobox",
													queryMode: "local",
													displayField: "name",
													valueField: "value",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: [
															"name", "value"
														],
														data: [
															{name: "Center", value: "center"},
															{name: "Right", value: "right"},
															{name: "Left", value: "Left"}
														]
													}
												},
												{
													name: "dl_inside",
													xtype: "checkbox",
													fieldLabel: IRm$/*resources*/.r1("B_INSIDE"),
													boxLabel: IRm$/*resources*/.r1("B_ENABLE"),
													inputValue: "T",
													checked: false
												}
											]
										},
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_TITLE_OPTION"),
											layout: {
												type: "vbox",
												align: "stretch"
											},
											$w: 350,
											items: [
												{
													name: "showtitle",
													$w: 350,
													fieldLabel: "Visible",
													boxLabel: IRm$/*resources*/.r1("B_SHOW"),
													xtype: "checkbox"
												},
												{
													name: "titletext",
													$w: 350,
													xtype: "textfield",
													fieldLabel: IRm$/*resources*/.r1("L_TITLE")
												},
												{
													name: "titleposition",
													fieldLabel: IRm$/*resources*/.r1("L_TITLE_POSITION"),
													
													xtype: "combobox",
													queryMode: "local",
													displayField: "name",
													valueField: "value",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: [
															"name", "value"
														],
														data: [
															{name: "Bottom Left", value: "BOTTOM_LEFT"},
															{name: "Bottom Center", value: "BOTTOM_CENTER", selected: true},
															{name: "Bottom Right", value: "BOTTOM_RIGHT"},
															{name: "Top Left", value: "TOP_LEFT"},
															{name: "Top Center", value: "TOP_CENTER"},
															{name: "Top Right", value: "TOP_RIGHT"}
														]
													}
												},
												{
													xtype: "displayfield",
													value: "Ex) {SERIES}",
													$w: 230
												}
											]
										}
									]
								},
								{
									xtype: "panel",
									title: IRm$/*resources*/.r1("L_CSTEP_4"),
									border: false,
									autoScroll: true,
									"layout": {
										type: "vbox",
										align: "stretch"
									},
									
									items: [
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_PLOT_STYLES"),
											items: [
												{
													xtype: "combobox",
													queryMode: "local",
													name: "colorset",
										        	fieldLabel: IRm$/*resources*/.r1("L_CLR_SET"),
										        	editable: false,
										        	autoSelect: false,
										        	valueField: "value",
										        	displayField: "name",
										        	store: {
										        		xtype: "store",
										        		fields: [
															"name", "value"
										        		]
										        	}
												}
											]
										},
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_BB_OPT"),
											defaultType: "textfield",
											name: "bubblemapoption",
											hidden: true,
											defaults: {
												width: 280
											},
											items: [
										        {
										        	xtype: "checkbox",
										        	name: "bmaprow",
										        	fieldLabel: IRm$/*resources*/.r1("L_BB_SL"),
										        	boxLabel: "Row data to redraw"
										        },
										        {
										        	xtype: "checkbox",
										        	name: "bmapyaxis",
										        	fieldLabel: IRm$/*resources*/.r1("L_BB_YA")
										        },
										        {
										        	xtype: "combobox",
										        	name: "bmapsizeaxisfield",
										        	queryMode: "local",
										        	fieldLabel: IRm$/*resources*/.r1("L_BB_SA"),
										        	editable: false,
										        	autoSelect: false,
										        	valueField: "uid",
										        	displayField: "name",
										        	store: {
										        		xtype: "store",
										        		fields: [
															"name", "uid", "nodepath", "type"
										        		]
										        	}
										        },
										        {
										        	xtype: "combobox",
										        	queryMode: "local",
										        	name: "bmapyaxisfield",
										        	fieldLabel: IRm$/*resources*/.r1("L_BB_CA"),
										        	valueField: "uid",
										        	displayField: "name",
										        	editable: false,
										        	autoSelect: false,
										        	store: {
										        		xtype: "store",
										        		fields: [
										        		    "name", "uid", "nodepath", "type"
										        		]
										        	}
										        },
										        {
										        	xtype: "numberfield",
										        	name: "bmapsize",
										        	fieldLabel: IRm$/*resources*/.r1("L_BB_MS"),
										        	minValue: 10,
										        	maxValue: 300
										        }
											]
										},
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_TIME_OPTION"),
											defaultType: "textfield",
											name: "timeoption",
											hidden: true,
											defaults: {
												width: 280
											},
											items: [
												{
													name: "timeseriesfield",
													fieldLabel: IRm$/*resources*/.r1("L_TC_TA"),
													xtype: "combobox",
													queryMode: "local",
													displayField: "name",
													valueField: "uid",
													editable: false,
													autoSelect: false,
													store: {
														xtype: "store",
														fields: [
															"name", "uid", "nodepath", "type"
														]
													}
												},
												{
													name: "timeseriesduration",
													fieldLabel: IRm$/*resources*/.r1("L_TC_DU"),
													xtype: "numberfield",
													value: 0.3,
													minValue: 0.3,
													maxValue: 8000
												}
											]
										},
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_PIE_OPTION"),
											name: "pieoption",
											hidden: false,
											defaultType: "textfield",
											defaults: {
												width: 280
											},
											items: [
												{
													name: "pieinnerradius",
													fieldLabel: IRm$/*resources*/.r1("L_INNER_RADIUS"),
													xtype: "numberfield",
													value: 0,
													minValue: 0,
													maxValue: 80
												},
												{
													name: "pielabeldist",
													fieldLabel: IRm$/*resources*/.r1("L_LABEL_DIST"),
													xtype: "numberfield",
													value: 0,
													minValue: -50,
													maxValue: 50
												},
												{
													name: "pielayout",
													fieldLabel: IRm$/*resources*/.r1("L_SERIES_LAYOUT"),
													xtype: "combobox",
													editable: false,
													queryMode: "local",
													displayField: "name",
													valueField: "value",
													store: {
														fields: ["name", "value"],
														data: [
															{name: "Only One Circle", value: ""},
															{name: IRm$/*resources*/.r1("L_HORIZONTAL"), value: "h"},
															{name: IRm$/*resources*/.r1("L_VERTICAL"), value: "v"}
														]
													}
												},
												{
													name: "piedatalabel",
													fieldLabel: IRm$/*resources*/.r1("L_DATA_LABEL_FMT"),
													xtype: "textfield"
												},
												{
													xtype: "displayfield",
													value: "Ex) <b>{name}</b>: {value} ({percent} %)"
												}
											]
										},
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_TREEM_OPTION"),
											name: "tm_opt",
											hidden: true,
											defaultType: "textfield",
											defaults: {
												width: 280
											},
											items: [
												{
													name: "tm_l_alg",
													fieldLabel: IRm$/*resources*/.r1("L_TM_ALG"),
													xtype: "combobox",
													editable: false,
													queryMode: "local",
													displayField: "name",
													valueField: "value",
													store: {
														fields: ["name", "value"],
														data: [
															{name: "Default", value: ""},
															{name: "sliceAndDice", value: "sliceAndDice"},
															{name: "stripes", value: "stripes"},
															{name: "squarified", value: "squarified"},
															{name: "strip", value: "strip"}
														]
													}
												},
												{
													name: "tm_l_cl",
													fieldLabel: IRm$/*resources*/.r1("L_TM_CL"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													inputValue: "T"
												}
											]
										},
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_MAP_OPT"),
											defaultType: "textfield",
											name: "mapoptions",
											defaults: {
												width: 280
											},
											items: [
												{
													name: "maptype",
													fieldLabel: IRm$/*resources*/.r1("L_MAP_TYPE"),
													xtype: "combobox",
													queryMode: "local",
													displayField: "name",
													valueField: "subtype",
													editable: false,
													autoSelect: false,
													store: {
														xtype: "store",
														fields: [
															"name", "subtype", "filename"
														]
													}
												},
												{
													name: "mapcategory",
													fieldLabel: IRm$/*resources*/.r1("L_MAP_AXIS"),
													xtype: "combobox",
													queryMode: "local",
													displayField: "name",
													valueField: "uid",
													editable: false,
													autoSelect: false,
													store: {
														xtype: "store",
														fields: [
															"name", "uid", "type", "nodepath"
														]
													}
												}
											]
										},
										{
											xtype: "fieldset",
											name: "opt_anderson",
											title: "Anderson Option",
											hidden: true,
											items: [
												{
													xtype: "combobox",
											    	name: "anderson_species",
											    	fieldLabel: "Species",
													queryMode: "local",
													displayField: "name",
													valueField: "name",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: [
															"name", "value"
														],
														data: [
															
														]
													}
												}
											]
										},
										{
											xtype: "fieldset",
											name: "opt_range",
											title: "Relation Ranges",
											hidden: true,
											items: [
												{
													xtype: "numberfield",
													name: "rel_range1",
													fieldLabel: "From Range",
													minValue: -1,
													value: 0,
													maxValue: 1,
													step: 0.01
												},
												{
													xtype: "numberfield",
													name: "rel_range2",
													fieldLabel: "End Range",
													minValue: -1,
													value: 1,
													maxValue: 1,
													step: 0.01
												}
											]
										},
										{
											xtype: "fieldset",
											name: "opt_relation",
											title: "Group Mapping",
											hidden: true,
											items: [
												{
													xtype: "grid",
													name: "relation_group",
													hideHeaders: false,
											    	stateful: true,
											    	store: {
														fields: [
															"name", "groupindex", "seq"
														]
													},
											    	height: 80,
											    	plugins: [
											    		{
											    			ptype: "cellediting",
															clicksToEdit: 1
														}
													],
											    	columns: [
											    		{
											    			text: "Sequence",
											    			flex: 1,
											    			sortable: false,
											    			dataIndex: "seq"
											    		},
											    		{
															text: "Group Index",
															flex: 1,
															sortable: false,
															dataIndex: "groupindex",
															editor: {
																allowBlank: false
															}
														},
											    		{
															text: IRm$/*resources*/.r1("B_NAME"),
															flex: 1,
															sortable: false,
															dataIndex: "name"
														}
											    	]
												}
											]
										},
										{
											xtype: "fieldset",
											name: "opt_series",
											title: IRm$/*resources*/.r1("L_SERIES_TYPE"),
											hidden: true,
											items: [
												{
													name: "dualaxis",
													fieldLabel: IRm$/*resources*/.r1("L_DUAL_AXIS"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													inputValue: "T",
													checked: false,
													listeners: {
														change: function(tobj) {
															var me = this,
																dualaxis = me.down("[name=dualaxis]").getValue();
																
															me.down("[name=y2axis]").setVisible(dualaxis);
														},
														scope: this
													}
												},
												{
													name: "renderbymeasures",
													fieldLabel: IRm$.r1("L_RENDER_BY_MEA"),
													xtype: "checkbox",
													boxLabel: IRm$.r1("B_ENABLED"),
													listeners: {
														change: function(tobj) {
															this._upd_series_grid();
														},
														scope: this
													}
												},
												{
													xtype: "grid",
													name: "grid_seriestype",
													hideHeaders: false,
											    	stateful: true,
											    	store: {
														fields: [
															"name", "seriestype", "y2axis", "dl_marker", "dl_linetype", "dl_enable"
														]
													},
											    	height: 120,
											    	//plugins: [cellEditing],
											    	columns: [
											    		{
											    			text: "Index",
											    			flex: 1,
											    			tdCls: "igc-td-link",
											    			sortable: false,
											    			dataIndex: "index"
											    		},
											    		{
											    			text: IRm$/*resources*/.r1("B_NAME"),
											    			flex: 2,
											    			sortable: false,
											    			tdCls: "igc-td-link",
											    			dataIndex: "m_name"
											    		},
											    		{
															text: IRm$/*resources*/.r1("L_SERIES_TYPE"),
															flex: 1,
															sortable: false,
															tdCls: "igc-td-link",
															dataIndex: "seriestype"
														},
											    		{
											    			xtype: "checkcolumn",
															text: "Y2 Axis",
															flex: 1,
															sortable: false,
															tdCls: "igc-td-link",
															dataIndex: "y2axis"
														}
											    	],
											    	listeners: {
											    		itemclick: function(view, record, item, index, e, options) {
											    			var panel = this,
											    				dlgSeriesOption = new IG$/*mainapp*/._Ifb/*chartseries*/({
													    		modal: true,
													    		charttype: charttype,
													    		cell_record: record,
													    		cell_item: item,
													    		cell_index: index,
													    		callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.srr/*continueSeriesOption*/)
													    	});
													    	dlgSeriesOption.show();
											    		},
											    		scope: this
											    	}
												}
											]
										},
										{
											xtype: "fieldset",
											name: "opt_comparison",
											title: "Comparison Matrix",
											hidden: true,
											items: [
												{
													xtype: "numberfield",
													name: "comp_range0",
													fieldLabel: "Red Color Range",
													minValue: -1,
													value: 0,
													maxValue: 0.8,
													step: 0.01
												},
												{
													xtype: "numberfield",
													name: "comp_range1",
													fieldLabel: "Blue Color Range",
													minValue: -0.8,
													value: 0,
													maxValue: 1,
													step: 0.01
												},
												{
													xtype: "displayfield",
													value: "Middle range is colored in gray"
												}
											]
										},
										{
											xtype: "fieldset",
											name: "opt_chord",
											title: "Chord Chart",
											hidden: true,
											items: [
												{
													xtype: "combobox",
											    	name: "chd_method",
											    	fieldLabel: "Chort Data",
													queryMode: "local",
													displayField: "name",
													valueField: "value",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: [
															"name", "value"
														],
														data: [
															{name: "Calculate Relations", value: "relations"},
															{name: "Table Result Matrix", value: "tablematrix"}
														]
													}
												},
												{
													xtype: "displayfield",
													value: "Relations calculates coefficient."
												},
												{
													xtype: "displayfield",
													value: "Table matrix need same name on column and row metrics"
												}
											]
										},
										{
											xtype: "fieldset",
											name: "opt_nations",
											title: "Timeseries Chart",
											hidden: true,
											items: [
												{
													xtype: "combobox",
											    	name: "nat_timefield",
											    	fieldLabel: "Time field",
													queryMode: "local",
													displayField: "name",
													valueField: "name",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: [
															"name", "value"
														],
														data: [
															
														]
													}
												},
												{
													xtype: "combobox",
											    	name: "nat_datafield",
											    	fieldLabel: "Data Field",
													queryMode: "local",
													displayField: "name",
													valueField: "name",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: [
															"name", "value"
														],
														data: [
															
														]
													}
												},
												{
													xtype: "combobox",
											    	name: "nat_groupfield",
											    	fieldLabel: "Group Field",
													queryMode: "local",
													displayField: "name",
													valueField: "name",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: [
															"name", "value"
														],
														data: [
															
														]
													}
												},
												{
													xtype: "combobox",
											    	name: "nat_xdata",
											    	fieldLabel: "X Axis",
													queryMode: "local",
													displayField: "name",
													valueField: "name",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: [
															"name", "value"
														],
														data: [
															
														]
													}
												},
												{
													xtype: "combobox",
											    	name: "nat_ydata",
											    	fieldLabel: "Y Axis",
													queryMode: "local",
													displayField: "name",
													valueField: "name",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: [
															"name", "value"
														],
														data: [
															
														]
													}
												},
												{
													xtype: "combobox",
											    	name: "nat_vdata",
											    	fieldLabel: "Volume",
													queryMode: "local",
													displayField: "name",
													valueField: "name",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: [
															"name", "value"
														],
														data: [
															
														]
													}
												}
											]
										}
									]
								},
								{
									xtype: "panel",
									title: IRm$/*resources*/.r1("L_CSTEP_5"),
									border: false,
									autoScroll: true,
									"layout": {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "fieldset",
											title: "XAxis Settings",
											items: [
												{
													name: "xlabel",
													fieldLabel: IRm$/*resources*/.r1("L_SHOW_LABEL"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED")
												},
												{
													name: "xaxisrot",
													fieldLabel: IRm$/*resources*/.r1("L_AUTO_ROT"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													listeners: {
														change: function(tobj) {
															var me = this,
																v = tobj.getValue(),
																xstagl = me.down("[name=xstagl]"),
																xstep = me.down("[name=xstep]");
																
															xstagl.setDisabled(v);
															xstep.setDisabled(v);
														},
														scope: this
													}
												},
												{
													name: "xstagl",
													fieldLabel: IRm$/*resources*/.r1("L_STG_LINE"),
													xtype: "numberfield",
													value: 0,
													minValue: 0,
													maxValue: 5,
													step: 1
												},
												{
													name: "xstep",
													fieldLabel: IRm$/*resources*/.r1("L_L_STEP"),
													xtype: "numberfield",
													value: 1,
													minValue: 1,
													maxValue: 5,
													step: 1
												}
											]
										},
										{
											xtype: "fieldset",
											title: "YAxis Settings",
											items: [
												{
													name: "yaxisformat",
													fieldLabel: IRm$/*resources*/.r1("L_YAXIS_FORMAT"),
													xtype: "textfield"
												},
												{
													name: "yaxismin",
													fieldLabel: IRm$/*resources*/.r1("L_YAXIS_MIN"),
													xtype: "textfield"
												},
												{
													name: "yaxismax",
													fieldLabel: IRm$/*resources*/.r1("L_YAXIS_MAX"),
													xtype: "textfield"
												},
												{
													name: "numericprecision",
													fieldLabel: IRm$/*resources*/.r1("L_NUMBER_PRECISION"),
													xtype: "numberfield",
													value: 0,
													minValue: 0,
													maxValue: 10,
													allowDecimals: false,
													decimalPrecision: 0,
													step: 1
												},
												{
													name: "yaxistitle",
													fieldLabel: IRm$/*resources*/.r1('L_YAXIS_TITLE'),
													xtype: "textfield"
												},
												{
													name: "ytickint",
													fieldLabel: IRm$/*resources*/.r1('L_TK_INTVL'),
													xtype: "numberfield",
													value: 0,
													minValue: 0,
													maxValue: 100000000,
													allowDecimals: true,
													decimalPrecision: 2
												}
											]
										},
										{
											xtype: "fieldset",
											name: "y2axis",
											hidden: true,
											title: "Second Y Axis Settings",
											items: [
												{
													name: "yaxisformat2",
													fieldLabel: IRm$/*resources*/.r1("L_YAXIS_FORMAT"),
													xtype: "textfield"
												},
												{
													name: "yaxismin2",
													fieldLabel: IRm$/*resources*/.r1("L_YAXIS_MIN"),
													xtype: "textfield"
												},
												{
													name: "yaxismax2",
													fieldLabel: IRm$/*resources*/.r1("L_YAXIS_MAX"),
													xtype: "textfield"
												},
												{
													name: "yaxistitle2",
													fieldLabel: "Right YAxis Title",
													xtype: "textfield"
												}
											]
										},
										{
											xtype: "fieldset",
											title: "Data Series",
											items: [
												{
													name: "stackvalue",
													fieldLabel: IRm$/*resources*/.r1("L_STACK_VALUE"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													inputValue: "T",
													checked: false,
													listeners: {
														change: function(tobj) {
															var me = this,
																cval = tobj.getValue();
																
															me.down("[name=stackperc]").setVisible(cval);
														},
														scope: this
													}
												},
												{
													name: "stackperc",
													fieldLabel: IRm$/*resources*/.r1("L_STACK_PERCENT"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													inputValue: "T",
													checked: false
												}
											]
										}
									]
								},
								{
									xtype: "panel",
									title: IRm$/*resources*/.r1("L_CSTEP_6"),
									border: false,
									autoScroll: true,
									"layout": {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "container",
											layout: {
												type: "hbox",
												align: "stretch"
											},
											items: [
												{
													xtype: "displayfield",
													flex: 1,
													value: "Defines PlotLine and PlotBand for Cartesian Charts"
												},
												{
													xtype: "button",
													text: IRm$/*resources*/.r1("L_ADD_NEW"),
													handler: function() {
														var me = this,
															ditem = new IG$/*mainapp*/._Ifb_n/*chartplotbandobject*/(),
															dlg = new IG$/*mainapp*/._Ifb_m/*chartplotband*/({
																ditem: ditem,
																callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(ditem) {
																	var p_bands = this.down("[name=p_bands]");
																	p_bands.store.add(ditem);
																})
															});
														dlg.show();
													},
													scope: this
												}
											]
										},
										{
											xtype: "gridpanel",
											name: "p_bands",
											flex: 1,
											store: {
												fields: ["name", "color", "borderwidth", "isxaxis", "btype", "value_1", "value_2", "value_desc", "enabled", "rtype", "porder", "showfitexp", "cfitallseries", "cfitshowsum", "cfitfcs", "cf_lc"]
											},
											columns: [
												{
													text: IRm$/*resources*/.r1("B_NAME"),
													flex: 1,
													tdCls: "igc-td-link",
													dataIndex: "name"
												},
												{
													text: IRm$/*resources*/.r1("B_VALUE"),
													flex: 1,
													tdCls: "igc-td-link",
													dataIndex: "value_desc"
												},
												{
													xtype: "checkcolumn",
													text: IRm$/*resources*/.r1("B_STATUS"),
													width: 60,
													dataIndex: "enabled"
												},
												{
													xtype: "actioncolumn",
													width: 30,
													items: [
														{
															// icon: "./images/delete.png",
															iconCls: "icon-grid-delete",
															tooltip: "Delete item",
															handler: function (grid, rowIndex, colIndex) {
																var rec = grid.store.getAt(rowIndex);
																grid.store.removeAt(rowIndex);
															}
														}
													]
												}
											],
											listeners: {
												cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
													if (cellIndex != 2 && cellIndex != 3)
													{
														var me = this,
															ditem = new IG$/*mainapp*/._Ifb_n/*chartplotbandobject*/(),
															dlg;
														
														ditem._3/*readRecords*/(record);
														
														dlg = new IG$/*mainapp*/._Ifb_m/*chartplotband*/({
															ditem: ditem,
															callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(ditem) {
																ditem._4/*updateRecords*/.call(ditem, record);
															})
														});
														dlg.show();
													}
												},
												scope: this
											}
										}
									]
								}
							],
							
							listeners: {
								afterrender: function(ui) {
									var me = this;
										
									me._IFe/*initF*/();
								},
								
//								tabchange: function(tab, ncard, ocard, eopt) {
//									this.p2/*setAdvancedOptions*/();
//								},
//								cardswitch: function() {
//									//if (index == 3)
//									{
//										this.p2/*setAdvancedOptions*/();
//									}
//								},
								scope: this
							}
						}
					]
				}
			],
			buttons:[
				{
					name: "card_prev",
					text: "&laquo; " + IRm$/*resources*/.r1("B_PREVIOUS"),
					handler: function() {
						this.cardNav(-1);
					},
					scope: this,
					disabled: true
				},
				{
					name: "card_next",
					text: IRm$/*resources*/.r1("B_NEXT") + " &raquo;",
					handler: function() {
						this.cardNav(1);
					},
					scope: this
				},
				"->",
				{
					text: IRm$/*resources*/.r1("B_APPLY"),
					handler: function() {
						this.m1$9/*confirmChartSetting*/(1);
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						this.m1$9/*confirmChartSetting*/();
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
				afterrender: function() {
					var me = this,
						i,
						ui = me.down("[name=_a]"),
						tabbuttons = me.down("[name=_c]"),
						ui;
						
					if (window.IG$/*mainapp*/.makeCustomChartOption)
					{
						me.cPP/*customPanels*/ = window.IG$/*mainapp*/.makeCustomChartOption(me, me.down("[name=_a]"));
					}
					
					for (i=0; i < ui.items.length; i++)
					{
						tabbuttons.add({
							xtype: "button",
							p: me,
							pu: ui,
							p1: i,
							margin: "0 0 3",
							text: ui.items.items[i].title,
							handler: function() {
								this.pu.getLayout().setActiveItem(this.p1);
								me.p2/*setAdvancedOptions*/.call(me);
							}
						});
					}
				}
			}
		});
		
		IG$/*mainapp*/._Ia3/*chartwizard*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._IjT/*jasper_template*/ = $s.extend($s.window, {
	modal: true,
	width: 460,
	autoHeight: true,
	layout: "fit",
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			grdmain = me.down("[name=grdmain]"),
			sel = grdmain.getSelectionModel().selected;
		
		if (sel && sel.length)
		{
			me.callback && me.callback.execute(sel);
			me.close();
		}
	},
	
	l1/*loadContent*/: function() {
		var me = this,
			lreq = new IG$/*mainapp*/._I3e/*requestServer*/(),
			tmpl_type = me.down("[name=tmpl_type]").getValue(),
			grdmain = me.down("[name=grdmain]"),
			mname = "DashboardResources",
			cmd,
			obj,
			cnt;
			
		if (!tmpl_type)
		{
			grdmain.store.loadData([]);
			return;
		}
		
		if (tmpl_type == "file")
		{
			cmd = "11";
			obj = IG$/*mainapp*/._I2d/*getItemAddress*/({});
			cnt = IG$/*mainapp*/._I2e/*getItemOption*/({option: me._fopt || "jasper"});
		}
		else
		{
			cmd = "5";
	        obj = IG$/*mainapp*/._I2d/*getItemAddress*/({uid: "/" + mname});
	        cnt = IG$/*mainapp*/._I2e/*getItemOption*/({option: 'folder'});
		}
		
		lreq.init(me, 
			{
	            ack: cmd,
	            payload: obj,
	            mbody: cnt
			}, me,  function(xdoc) {
				var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, tmpl_type == "file" ? "/smsg" : "/smsg/item"),
					tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
					i, p, dp = [],
					c, val, fext,
					_fopt = me._fopt || "jasper";
				
				for (i=0; i < tnodes.length; i++)
				{
					p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
					if (tmpl_type == "resources")
					{
						fext = p.name;
						p.type = "resource";
						
						if (fext.indexOf(".") > -1)
						{
							fext = fext.substring(fext.lastIndexOf(".") + 1);
							if (_fopt == "jasper")
							{
								if (fext == "jrxml")
								{
									dp.push(p);
								}
							}
							else if (_fopt == "office_files")
							{
								if (/(xls|xlsx|doc|docx|ppt|pptx)/.test(fext))
								{
									dp.push(p);
								}
							}
						}
					}
					else
					{
						p.type = "file";
						dp.push(p);
					}
				}
				
				grdmain.store.loadData(dp);
			}, false);
		
		lreq._l/*request*/();
	},
	
	initComponent: function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("T_JASP_TMPL");
		
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					bodyPadding: 5,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							fieldLabel: "Template",
							name: "tmpl_type",
							xtype: "combobox",
							queryMode: 'local',
							valueField: "value",
							displayField: "name",
							editable: false,
							store: {
								xtype: "store",
								fields: [
									"name", "value"
								],
								data: [
									{name: "Select", value: ""},
									{name: "Resources", value: "resources"},
									{name: "File", value: "file"}
								]
							},
							listeners: {
								change: function(tobj) {
									this.l1/*loadContent*/();
								},
								scope: this
							}
						},
						{
							xtype: "gridpanel",
							height: 200,
							name: "grdmain",
							store: {
								xtype: "store",
								fields: ["uid", "name", "contentfullpath", "type", "ext"]
							},
							selType: "checkboxmodel",
							selModel: {
								mode: "SINGLE"
							},
							columns: [
								{
									dataIndex: "name",
									flex: 1,
									text: IRm$/*resources*/.r1("B_NAME")
								},
								{
									dataIndex: "ext",
									width: 80,
									text: "Extension"
								}
							]
						}
					]
				}
			],
			buttons:[
				{
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						this._IFf/*confirmDialog*/();
					},
					scope: this
				}, 
				{
					text: IRm$/*resources*/.r1("B_CANCEL"),
					handler:function() {
						this.close();
					},
					scope: this
				}
			]
		});
		IG$/*mainapp*/._IjT/*jasper_template*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj.down("[name=tmpl_type]").setValue("");
		}
	}
});
	
IG$/*mainapp*/._Ia2/*exportWizard*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	"layout": {
		type: "fit",
		align: "stretch"
	},
	
	closable: false,
	resizable:false,
	width: 760,
	height: 450,
	
	_ILa/*reportoption*/: null,
	_ILb/*sheetoption*/: null,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.callback && this.callback.execute();
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this;
		
		if (me._ILa/*reportoption*/)
		{
			var opt = me._ILa/*reportoption*/.exportOption,
				k, ep,
				i, c, cv, rec,
				grdoption = me.down("[name=grdoption]"),
				grd_otmpl = me.down("[name=grd_otmpl]"),
				j_param = me.j_param;
				
			opt.repeatheader= me.down("[name=repeatheader]").getValue();
			opt.title = me.down("[name=headertitle]").getValue();
			opt.pagenumber = me.down("[name=pagenumber]").getValue();
			opt.footertitle = me.down("[name=footertitle]").getValue();
			opt.alldata = me.down("[name=alldata]").getValue();
			opt.startpage = me.down("[name=startpage]").getValue();
			opt.endpage = me.down("[name=endpage]").getValue();
			opt.filterdesc = me.down("[name=filterdesc]").getValue();
			opt.layout = me.down("[name=layout]").getValue().layouttype;
			opt.pagesize = me.down("[name=pagesize]").getValue();
			opt.fonttype = me.down("[name=fonttype]").getValue();
			opt.scaledown = me.down("[name=scaledown]").getValue();
			
			$.each(["excel", "pdf", "csv", "html", "jasper", "office"], function(i, k) {
				var c = me.down("[name=t_e" + (i+1) + "]");
				opt["u_" + k] = c.getValue();
			});
			
			opt.dinfo = {};
					
			for (i=0; i < grdoption.store.data.items.length; i++)
			{
				rec = grdoption.store.data.items[i];
				opt.dinfo[rec.get("docid")] = {
					docid: rec.get("docid"),
					overflow: rec.get("overflow"),
					hidden: rec.get("hidden")
				};
			}

			opt.jasper = opt.jasper || {};
			
			for (i=0; i < j_param.length; i++)
			{
				c = me.down("[name=" + j_param[i] + "]");
				if (c)
				{
					cv = c.getValue();
					if (cv === true || cv === false)
					{
						cv = (cv ? "T" : "F");
					}
					opt["jasper"][j_param[i]] = cv;
				}
			}
			
			opt.otmpl = [];
			
			for (i=0; i < grd_otmpl.store.data.items.length; i++)
			{
				rec = grd_otmpl.store.data.items[i];
				opt.otmpl.push({
					name: rec.get("name"),
					type: rec.get("type"),
					uid: rec.get("uid"),
					description: rec.get("description"),
					export_type: rec.get("export_type")
				});
			}
			
			for (k in window.IExport)
			{
				ep = window.IExport[k];
				opt[ep.name] = {};
				if (ep.extPanel)
				{
					for (i=0; i < ep.params.length; i++)
					{
						c = ep.extPanel.down("[name=" + ep.params[i] + "]");
						if (c)
						{
							cv = c.getValue();
							if (cv == true || cv == false)
							{
								cv = (cv ? "T" : "F");
							}
							opt[ep.name][ep.params[i]] = cv;
						}
					}
				}
			}
		}
					
		this._IG0/*closeDlgProc*/();
	},
	
	_IFe/*initF*/: function() {
		var me = this,
			_mtab = me.down("[name=_mtab]"),
			grd_otmpl = me.down("[name=grd_otmpl]"),
			k;
			
		window.IExport = window.IExport || {};
		
		me.j_param = [
			"jasper_template", "jasper_tmpl_uid", "pdf_output", "pdf_label", "rtf_output", "rtf_label", "ppt_output", "ppt_label", "excel_label", "excel_output",
			"html_output", "html_label", "docx_output", "docx_label", "xml_output", "xml_label"
		];
		
		for (k in window.IExport)
		{
			if (IExport[k].configPanel)
			{
				IExport[k].configPanel.maincfg = this;
				IExport[k].configPanel.name = IExport[k].name;
				IExport[k].extPanel = new $s.panel(IExport[k].configPanel);
				_mtab.add(IExport[k].extPanel);
			}
		}
			
		if (me._ILa/*reportoption*/)
		{
			var opt = me._ILa/*reportoption*/.exportOption,
				dbg = me.down("[name=layout]"),
				dinfo,
				dock = [],
				docid,
				dzone = me.dzone,
				k,
				ep, c;
				
			dbg.setValue({layouttype: opt.layout || "portrait"}); 
			me.down("[name=repeatheader]").setValue(opt.repeatheader);
			me.down("[name=headertitle]").setValue(opt.title);
			me.down("[name=pagenumber]").setValue(opt.pagenumber);
			me.down("[name=footertitle]").setValue(opt.footertitle);
			me.down("[name=alldata]").setValue(opt.alldata);
			me.down("[name=startpage]").setValue(opt.startpage);
			me.down("[name=endpage]").setValue(opt.endpage);
			me.down("[name=filterdesc]").setValue(opt.filterdesc);
			me.down("[name=pagesize]").setValue(opt.pagesize);
			me.down("[name=fonttype]").setValue(opt.fonttype);
			me.down("[name=scaledown]").setValue(opt.scaledown);
			
			$.each(["excel", "pdf", "csv", "html", "jasper", "office"], function(i, k) {
				var c = me.down("[name=t_e" + (i+1) + "]");
				c.setValue(opt["u_" + k]);
			});
			
			dinfo = opt.dinfo || {};
					
			for (i=0; i < dzone.items.length; i++)
			{
				docid = dzone.items[i].docid;
				dock.push({
					docid: docid,
					objtype: dzone.items[i].objtype,
					title: dzone.items[i].title,
					overflow: dinfo[docid] ? dinfo[docid].overflow : true,
					hidden: dinfo[docid] ? dinfo[docid].hidden : false
				});
			}
			
			me.down("[name=grdoption]").store.loadData(dock);
			
			if (opt.jasper)
			{
				for (i=0; i < me.j_param.length; i++)
				{
					c = me.down("[name=" + me.j_param[i] + "]");
					if (c)
					{
						val = opt.jasper[me.j_param[i]] || "";
						val = (val == "T" || val == "F") ? (val == "T" ? true : false) : val;
						c.setValue(val);
					}
				}
			}
			
			if (opt.otmpl)
			{
				grd_otmpl.store.loadData(opt.otmpl);
			}
			
			$.each(window.IExport, function(k, ep) {
				if (ep.extPanel)
				{
					ep.extPanel.opt = opt;
					ep.extPanel.ep = ep;
					ep.extPanel.pt_p = me;
				}
			});
		}
		
		// me.j_1/*jasperInit*/();
	},
	
	initComponent : function() {
		var me = this,
			fonts = [
			    {label:"Select Font", value:""},
				{label:"HELVETICA", value:"HELVETICA;CP1252"},
                {label:"STSong-Light", value:"STSong-Light;UniGB-UCS2-H"},
                {label:"KozMinPro-Regular", value:"KozMinPro-Regular;UniJIS-UCS2-H"},
                {label:"HYGoThic-Medium", value:"HYGoThic-Medium;UniKS-UCS2-H"}
			],
			i, pf;
		
		me.title = IRm$/*resources*/.r1("T_EXPORT_WIZARD");
		pf = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.pf/*pdffonts*/;
		for (i=0; i < pf.length; i++)
		{
			fonts.push({
				label:pf[i].substring(0, pf[i].length-1),
				value: pf[i]
			});
		}
		
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
			
			items: [
			    {
			    	xtype: "panel",
					bodyBorder: false,
					"layout": "fit",
					fieldDefaults: {
						labelWidth: 160
					},
					
					items: [
						{
							xtype: "tabpanel",
							name: "_mtab",
							activeTab: 0,
							defaults: {
								bodyStyle: "padding: 10px"
							},
							items : [
								{
									title: IRm$/*resources*/.r1("L_EXP_MET"),
									xtype: "panel",
									layout: "anchor",
									items: [
										{
											xtype: "fieldset",
											layout: "vbox",
											title: IRm$/*resources*/.r1("L_EXP_MET_DESC"),
											items: [
												{
													xtype: "checkbox",
													name: "t_e1",
													boxLabel: IRm$/*resources*/.r1('L_EXPORT_EXCEL')
												},
												{
													xtype: "checkbox",
													name: "t_e2",
													boxLabel: IRm$/*resources*/.r1('L_EXPORT_PDF')
												},
												{
													xtype: "checkbox",
													name: "t_e3",
													boxLabel: IRm$/*resources*/.r1('L_EXPORT_CSV')
												},
												{
													xtype: "checkbox",
													name: "t_e4",
													boxLabel: IRm$/*resources*/.r1('L_EXPORT_HTML')
												},
												{
													xtype: "checkbox",
													name: "t_e5",
													boxLabel: IRm$/*resources*/.r1('L_EXPORT_JASPER')
												},
												{
													xtype: "checkbox",
													name: "t_e6",
													boxLabel: IRm$/*resources*/.r1('L_EXPORT_OFFICE')
												}
											]
										}
									]
								},
								{
									title: IRm$/*resources*/.r1("L_GENERAL_OPTION"),
									defaultType: "textfield",
									layout: "anchor",
									defaults: {
										width: 380
									},
									fieldDefaults: {
				            			labelWidth: 55,
				            			anchor: "100%"
				        			},
									items: [
										{
											name: "repeatheader",
											fieldLabel: IRm$/*resources*/.r1("L_REPEAT_HEADER"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											name: "headertitle",
											fieldLabel: IRm$/*resources*/.r1("L_TITLE"),
											xtype: "textfield"
										},
										{
											name: "pagenumber",
											fieldLabel: IRm$/*resources*/.r1("L_SHOW_PAGENUMBER"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											name: "footertitle",
											fieldLabel: IRm$/*resources*/.r1("L_FOOTER"),
											xtype: "textfield"
										},
										{
											name: "alldata",
											fieldLabel: IRm$/*resources*/.r1("L_ALL_DATA"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											name: "startpage",
											fieldLabel: IRm$/*resources*/.r1("L_PG_START"),
											xtype: "numberfield",
											value: 1,
											minValue: 1,
											maxValue: 125
										},
										{
											name: "endpage",
											fieldLabel: IRm$/*resources*/.r1("L_PG_RANGE"),
											xtype: "numberfield",
											value: 30,
											minValue: 1,
											maxValue: 30
										},
										{
											name: "filterdesc",
											fieldLabel: IRm$/*resources*/.r1("L_SHOW_FILTER_INFO"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										}
									]
								},
								{
									title: IRm$/*resources*/.r1("L_PAGE_OPTIONS"),
									defaultType: "textfield",
									layout: "anchor",
									defaults: {
										width: 380
									},
									items: [
										{
											name: "layout",
											fieldLabel: IRm$/*resources*/.r1("L_PG_DIRECTION"),
											xtype: "radiogroup",
											plain: true,
											items: [
												{
													boxLabel: IRm$/*resources*/.r1("L_VERTICAL"), name: "layouttype", inputValue: "portrait"
												},
												{
													boxLabel: IRm$/*resources*/.r1("L_HORIZONTAL"), name: "layouttype", inputValue: "landscape", checked: true
												}
											]
										},
										{
											name: "pagesize",
											fieldLabel: IRm$/*resources*/.r1("L_PG_SIZE"),
											xtype: "combobox",
											labelAlign: "left",
											labelWidth: 120,
											valueField: "value",
											displayField: "label",
			
											editable: false,
											store: {
												fields: [
													"label", "value"
												],
												data: [
													{label:"A1", value:"A1"},
													{label:"A2", value:"A2"},
													{label:"A3", value:"A3"},
		                                            {label:"A4", value:"A4"},
		                                            {label:"A5", value:"A5"},
		                                            {label:"B4", value:"B4"},
		                                            {label:"B5", value:"B5"}
												]
											}
										},
										{
											name: "fonttype",
											fieldLabel: IRm$/*resources*/.r1("L_FONT_SELECT"),
											xtype: "combobox",
											labelAlign: "left",
											labelWidth: 120,
											valueField: "value",
											displayField: "label",
			
											editable: false,
											store: {
												fields: [
													"label", "value"
												],
												data: fonts
											}
										},
										{
											name: "scaledown",
											fieldLabel: "",
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("L_SCALE_DOWN"),
											inputValue: "T",
											checked: false
										},
										{
											name: "setvertical",
											fieldLabel: "",
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("L_ALIGN_VERTICAL"),
											intputValue: "T",
											checked: false
										}
									]
								},
								{
									xtype: "panel",
									title: IRm$/*resources*/.r1("L_SHEET_OPTIONS"),
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "displayfield",
											value: IRm$/*resources*/.r1("L_OVF_DESC")
										},
										{
											xtype: "gridpanel",
											name: "grdoption",
											store: {
												type: "store",
												fields: [
													"docid", "title", "objtype", "overflow", "hidden"
												]
											},
											flex: 1,
											columns: [
												{
													text: "ID",
													width: 60,
													dataIndex: "docid"
												},
												{
													text: IRm$/*resources*/.r1("B_TITLE"),
													flex: 1,
													dataIndex: "title"
												},
												{
													text: IRm$/*resources*/.r1("B_TYPE"),
													width: 50,
													dataIndex: "objtype"
												},
												{
													xtype: "checkcolumn",
													text: IRm$/*resources*/.r1("B_OVERFLOW"),
													width: 60,
													dataIndex: "overflow"
												},
												{
													xtype: "checkcolumn",
													text: IRm$/*resources*/.r1("B_HIDE"),
													width: 60,
													dataIndex: "hidden"
												}
											]
										}
									]
								},
								{
									xtype: "panel",
									title: IRm$/*resources*/.r1("L_EXP_JASP"),
									name: "j_report",
									layout: "anchor",
									defaults: {
										anchor: "100%"
									},
									items: [
										{
											fieldLabel: "Template",
											xtype: "fieldcontainer",
											labelWidth: 80,
											layout: "hbox",
											items: [
												{
													xtype: "textfield",
													name: "jasper_template",
													readOnly: true
												},
												{
													xtype: "textfield",
													hidden: true,
													name: "jasper_tmpl_uid"
												},
												{
													xtype: "textfield",
													hidden: true,
													name: "jasper_tmpl_type"
												},
												{
													xtype: "button",
													text: "..",
													handler: function() {
														var me = this,
															dlg = new IG$/*mainapp*/._IjT/*jasper_template*/({
																callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(sel) {
																	var rec = "";
																	if (sel && sel.length)
																	{
																		rec = sel.items[0];
																		me.down("[name=jasper_tmpl_uid]").setValue(rec.get("uid"));
																		me.down("[name=jasper_template]").setValue(rec.get("name"));
																		me.down("[name=jasper_tmpl_type]").setValue(rec.get("type"));
																	}
																})
															});
														dlg.show();
													},
													scope: this
												}
											]
										},
										{
											xtype: "fieldset",
											title: "Output Format",
											layout: "anchor",
											defaults: {
												anchor: "100%",
												
												layout: {
													type: "hbox",
													anchor: "100%"
												}
											},
											items: [
												{
													xtype: "fieldcontainer",
													defaults: {
														flex: 1,
														labelWidth: 60
													},
													items: [
														{
															xtype: "checkbox",
															fieldLabel: "PDF",
															name: "pdf_output",
															labelAlign: "right"
														},
														{
															xtype: "textfield",
															fieldLabel: "Label",
															name: "pdf_label",
															labelAlign: "right"
														}
													]
												},
												{
													xtype: "fieldcontainer",
													defaults: {
														flex: 1,
														labelWidth: 60
													},
													items: [
														{
															xtype: "checkbox",
															fieldLabel: "RTF",
															name: "rtf_output",
															labelAlign: "right"
														},
														{
															xtype: "textfield",
															fieldLabel: "Label",
															name: "rtf_label",
															labelAlign: "right"
														}
													]
												},
												{
													xtype: "fieldcontainer",
													defaults: {
														flex: 1,
														labelWidth: 60
													},
													items: [
														{
															xtype: "checkbox",
															fieldLabel: "PPT",
															name: "ppt_output",
															labelAlign: "right"
														},
														{
															xtype: "textfield",
															fieldLabel: "Label",
															name: "ppt_label",
															labelAlign: "right"
														}
													]
												},
												{
													xtype: "fieldcontainer",
													defaults: {
														flex: 1,
														labelWidth: 60
													},
													items: [
														{
															xtype: "checkbox",
															fieldLabel: "Excel",
															name: "excel_output",
															labelAlign: "right"
														},
														{
															xtype: "textfield",
															fieldLabel: "Label",
															name: "excel_label",
															labelAlign: "right"
														}
													]
												},
												{
													xtype: "fieldcontainer",
													defaults: {
														flex: 1,
														labelWidth: 60
													},
													items: [
														{
															xtype: "checkbox",
															fieldLabel: "Word docx",
															name: "docx_output",
															labelAlign: "right"
														},
														{
															xtype: "textfield",
															fieldLabel: "Label",
															name: "docx_label",
															labelAlign: "right"
														}
													]
												},
												{
													xtype: "fieldcontainer",
													defaults: {
														flex: 1,
														labelWidth: 60
													},
													items: [
														{
															xtype: "checkbox",
															fieldLabel: "HTML",
															name: "html_output",
															labelAlign: "right"
														},
														{
															xtype: "textfield",
															fieldLabel: "Label",
															name: "html_label",
															labelAlign: "right"
														}
													]
												},
												{
													xtype: "fieldcontainer",
													defaults: {
														flex: 1,
														labelWidth: 60
													},
													items: [
														{
															xtype: "checkbox",
															fieldLabel: "XML",
															name: "xml_output",
															labelAlign: "right"
														},
														{
															xtype: "textfield",
															fieldLabel: "Label",
															name: "xml_label",
															labelAlign: "right"
														}
													]
												}
											]
										}
									]
								},
								{
									xtype: "panel",
									title: IRm$/*resources*/.r1("L_EXP_OFFICE"),
									name: "t_report",
									layout: {
										type: "vbox",
										align: "stretch"
									},
									defaults: {
										anchor: "100%"
									},
									items: [
										{
											fieldLabel: "Template",
											xtype: "fieldcontainer",
											labelWidth: 80,
											layout: "hbox",
											items: [
												{
													xtype: "textfield",
													name: "office_template",
													readOnly: true
												},
												{
													xtype: "textfield",
													hidden: true,
													name: "office_tmpl_uid"
												},
												{
													xtype: "textfield",
													hidden: true,
													name: "office_tmpl_type"
												},
												{
													xtype: "button",
													text: "..",
													handler: function() {
														var me = this,
															dlg = new IG$/*mainapp*/._IjT/*jasper_template*/({
																_fopt: "office_files",
																callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(sel) {
																	var rec = "";
																	if (sel && sel.length)
																	{
																		rec = sel.items[0];
																		me.down("[name=office_tmpl_uid]").setValue(rec.get("uid"));
																		me.down("[name=office_template]").setValue(rec.get("name"));
																		me.down("[name=office_tmpl_type]").setValue(rec.get("type"));
																	}
																})
															});
														dlg.show();
													},
													scope: this
												},
												{
													xtype: "button",
													text: "Add",
													handler: function() {
														var me = this,
															office_tmpl_uid = me.down("[name=office_tmpl_uid]"),
															office_tmpl_type = me.down("[name=office_tmpl_type]"),
															office_tmpl_name = me.down("[name=office_template]"),
															grd_otmpl = me.down("[name=grd_otmpl]"),
															t_e6 = me.down("[name=t_e6]"),
															p = {
																uid: office_tmpl_uid.getValue(),
																type: office_tmpl_type.getValue(),
																name: office_tmpl_name.getValue()
															},
															ext;
														
														t_e6.setValue(true);
														
														if (p.name.indexOf(".") > -1)
														{
															ext = p.name.substring(p.name.lastIndexOf(".") + 1);
															
															if (ext == "docx")
															{
																p.export_type = "pdf";
															}
															else if (ext == "xlsx" || ext == "xls")
															{
																p.export_type = ext;
															}
														}
														
														if (p.name)
														{
															grd_otmpl.store.add(p);
															office_tmpl_uid.setValue("");
															office_tmpl_type.setValue("");
															office_tmpl_name.setValue("");
														}
													},
													scope: this
												}
											]
										},
										{
											xtype: "gridpanel",
											name: "grd_otmpl",
											flex: 1,
											store: {
												fields: ["name", "type", "uid", "description", "export_type"]
											},
											plugins: [
												{
													ptype: "cellediting",
													clicksToEdit: true
												}
											],
											columns: [
												{
													text: "Name",
													dataIndex: "name",
													flex: 1
												},
												{
													text: "Desc",
													flex: 1,
													dataIndex: "description",
													editor: {
														allowBlank: true
													}
												},
												{
													text: "Export As",
													flex: 1,
													dataIndex: "export_type",
													editor: {
														allowBlank: false
													}
												},
												{
													text: "Type",
													dataIndex: "type",
													width: 50
												},
												{
													xtype: "actioncolumn",
													width: 30,
													items: [
														{
															// icon: "./images/delete.png",
															iconCls: "icon-grid-delete",
															tooltip: "Delete item",
															handler: function (grid, rowIndex, colIndex) {
																var rec = grid.store.getAt(rowIndex);
																grid.store.removeAt(rowIndex);
															}
														}
													]
												}
											]
										},
										{
											xtype: "displayfield",
											value: "* For DOCX template, export as options could be docx / pdf / html / field (For Template)."
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
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						this._IFf/*confirmDialog*/();
					},
					scope: this
				}, 
				{
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
					
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/._Ia2/*exportWizard*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Ief/*statistics*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	width: 500,
	height: 440,
	
	_IK2/*mresults*/: null,
		
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
		
		this.callback && this.callback.execute();
	},
		
	_IFd/*init_f*/: function() {
		var panel = this,
			_IK2/*mresults*/ = panel._IK2/*mresults*/,
			results = (_IK2/*mresults*/ && _IK2/*mresults*/.results) ? _IK2/*mresults*/.results : null,
			mainpanel = panel.down("[name=mainpanel]"),
			el = $(mainpanel.el.dom),
			stat,
			dv, tb, tr, td, title,
			i, j, k, col;
		
		el.empty();
		el.css({"overflow-y": "scroll"});
		
		if (results)
		{
			for (i=0; i < results.length; i++)
			{
				dv = $("<div class='idv-br-stable'></div>").appendTo(el);
				stat = results[i].fs_/*statistics*/;
				
				if (stat)
				{
					for (j=0; j < stat.length; j++)
					{
						title = "";
						col = stat[j].col + results[i].colfix;
						if (results[i].rowfix > 0)
						{
							for (k=0; k < results[i].rowfix; k++)
							{
								title += " " + (results[i].data[k][col].text || results[i].data[k][col].code);
							}
						}
						$("<span>Column " + col + "</span>&nbsp;&nbsp;: &nbsp;<span class='idv-br-stable-blue'>" + title + "</span><br>").appendTo(dv);
						tb = $("<table></table>").appendTo(dv);
						$.each([
							{rname: "S_AVG", key: "average"},
							{rname: "S_STDERR", key: "stderr"},
							{rname: "S_MEDIAN", key: "median"},
							{rname: "S_STDEV", key: "stdev"},
							{rname: "S_VAR", key: "variance"},
							{rname: "S_KURT", key: "kurtosis"},
							{rname: "S_SKEW", key: "skewness"},
							{rname: "S_RAN", key: "ranges"},
							{rname: "S_MIN", key: "min"},
							{rname: "S_MAX", key: "max"},
							{rname: "S_SUM", key: "sum"},
							{rname: "S_COUNT", key: "count"}], function(key, value) {
								var nval = stat[j][value["key"]];
								if (nval == "" || nval == null || typeof(nval) == "undefined")
								{
									nval = "N/A";
								}
								tr = $("<tr></tr>").appendTo(tb);
								th = $("<td>" + IRm$/*resources*/.r1(value["rname"]) + "</td>").appendTo(tr);
								th = $("<td>" + nval + "</td>").appendTo(tr);
						});
					}
				}
			}
		}
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1('T_STATISTICS');
		var panel = this;
				 
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				{
					xtype: "formpanel",
					
					bodyBorder: false,
					
					"layout": "fit",
					
					items: [
						{
							xtype: "panel",
							name: "mainpanel",
							autoScroll:false,
							html: "",
							listeners: {
								resize: function(panel) {
									var h = $(panel.el.dom);
									h.css({"overflow-y": "scroll"});
								}
							}
						}
					],
					
					listeners: {
						
					}
				}
			],
			buttons:[
				{
					text: IRm$/*resources*/.r1('B_CLOSE'),
					handler:function() {
						this.close();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function(ui) {
					this._IFd/*init_f*/();
				}
			}
		});
		
		IG$/*mainapp*/._Ief/*statistics*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._If0/*sortOptionDlg*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	width: 580,
	height: 480,
	
	_ILa/*reportoption*/: null,
	_ILb/*sheetoption*/: null,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
		
		this.callback && this.callback.execute();
	},
	
	_IFf/*confirmDialog*/: function() {
		this.l2/*confirmChanges*/();
		this._IG0/*closeDlgProc*/();
	},
	
	_IFd/*init_f*/: function() {
		var me = this,
			sortoption = me._ILb/*sheetoption*/.sortoption,
			rows = me._ILb/*sheetoption*/.rows,
			measures = me._ILb/*sheetoption*/.measures,
			i, j, dprow = [], dpmeasure = [],
			sortpartition = me.down("[name=sortpartition]"),
			sortmeasure = me.down("[name=sortmeasure]"),
			sortbyvalue = me.down("[name=sortbyvalue]"),
			sortorder = (sortoption.sortorder || "").split(";"),
			sortorder_type = (sortoption.sortorder_type || "").split(";"),
			sortorder_memo = (sortoption.sortrder_memo || "").split(";"),
			mgrid_src = me.down("[name=mgrid_src]"),
			mgrid_tgt = me.down("[name=mgrid_tgt]"),
			sortitems = [],
			customsort = [],
			si;
			
		dprow.push({
			name: IRm$/*resources*/.r1('B_DEFAULT'),
			uid: "",
			type: "",
			nodepath: ""
		});
		
		for (i=0; i < rows.length; i++)
		{
			dprow.push({
				name: rows[i].name,
				uid: rows[i].uid,
				type: rows[i].type,
				nodepath: rows[i].nodepath
			});
			
			sortitems.push({
				name: rows[i].name,
				uid: rows[i].uid,
				type: rows[i].type,
				nodepath: rows[i].nodepath,
				sortorder: rows[i].sortorder || "",
				memo: (rows[i].memo == "NUMBER" || rows[i].memo == "VARCHAR") ? rows[i].memo : "",
				numeric: rows[i].memo == "NUMBER" ? true : false,
				sorder: (rows[i].sortorder == "asc" ? IRm$/*resources*/.r1("B_ASC") : (rows[i].sortorder == "desc" ? IRm$/*resources*/.r1("B_DSC") : ""))
			});
		}
		
		dpmeasure.push({
			name: IRm$/*resources*/.r1('B_DEFAULT'),
			uid: "",
			type: "",
			nodepath: ""
		});
		
		for (i=0; i < measures.length; i++)
		{
			dpmeasure.push({
				name: measures[i].name,
				uid: measures[i].uid,
				type: measures[i].type,
				nodepath: measures[i].nodepath
			});
		}
		
		for (j=0; j < sortorder.length; j++)
		{
			for (i=sortitems.length -1; i >= 0; i--)
			{
				if (sortitems[i].uid == sortorder[j])
				{
					si = sortitems[i];
					
					if (sortorder_type.length > j)
					{
						si.sortorder = sortorder_type[j] || "";
						si.sorder = (si.sortorder == "asc" ? IRm$/*resources*/.r1("B_ASC") : (si.sortorder == "desc" ? IRm$/*resources*/.r1("B_DSC") : ""));
					}
					
					if (sortorder_memo.length > j)
					{
						si.memo = sortorder_memo[j].memo || "";
						si.numeric = si.memo == "NUMBER" ? true : false;
					}
					
					customsort.push(si);
					sortitems.splice(i, 1);
					break;
				}
			}
		}
		
		sortpartition.store.loadData(dprow);
		sortmeasure.store.loadData(dpmeasure);
		
		mgrid_src.store.loadData(sortitems);
		mgrid_tgt.store.loadData(customsort);
			
		me.down("[name=sortmethod]").setValue({
			sm: sortoption.sortmethod || "normal"
		});
		me.down("[name=showlastrank]").setValue(sortoption.showlastrank);
		me.down("[name=sortcount]").setValue(sortoption.sortcount || 0);
		sortmeasure.setValue(sortoption.sortmeasure);
		sortpartition.setValue(sortoption.sortpartition);
		sortbyvalue.setValue(sortoption.sortbyvalue);
	},
	
	l1/*changeSortMethod*/: function() {
		var sortmethod = this.down("[name=sortmethod]").getValue().sm,
			rankfield = this.down("[name=rankfield]"),
			customfield = this.down("[name=customfield]");
		
		switch (sortmethod)
		{
		case "normal":
			rankfield.setVisible(false);
			customfield.setVisible(false);
			break;
		case "custom":
			rankfield.setVisible(false);
			customfield.setVisible(true);
			break;
		case "top":
		case "bottom":
			rankfield.setVisible(true);
			customfield.setVisible(false);
			break;
		}
	},
	
	l2/*confirmChanges*/: function() {
		var me = this,
			sortoption = me._ILb/*sheetoption*/.sortoption,
			mgrid_tgt = me.down("[name=mgrid_tgt]").store,
			rows = me._ILb/*sheetoption*/.rows, row, uid,
			i, j, sitem = "", sitem_memo = "", sitem_type = "";
		
		for (i=0; i < mgrid_tgt.data.items.length; i++)
		{
			row = mgrid_tgt.data.items[i];
			uid = row.get("uid");
			sitem += ((i == 0) ? "" : ";") + uid;
			
			for (j=0; j < rows.length; j++)
			{
				if (rows[j].uid == uid)
				{
					switch (row.get("sorder"))
					{
					case IRm$/*resources*/.r1("B_ASC"):
						rows[j].sortorder = "asc";
						break;
					case IRm$/*resources*/.r1("B_DSC"):
						rows[j].sortorder = "desc";
						break;
					default:
						rows[j].sortorder = null;
						break;
					}
					
					if (row.get("numeric") == true)
					{
						rows[j].memo = "NUMBER";
					}
					else 
					{
						rows[j].memo = "VARCHAR";
					}		
					break;
				}
			}
			
			sitem_memo += ((i == 0) ? "" : ";") + (rows[j].memo || "");
			sitem_type += ((i == 0) ? "" : ";") + (rows[j].sortorder || "");
		}
		
		sortoption.sortorder = sitem;
		sortoption.sortorder_memo = sitem_memo;
		sortoption.sortorder_type = sitem_type;
		sortoption.sortmethod = me.down("[name=sortmethod]").getValue().sm;
		sortoption.showlastrank = me.down("[name=showlastrank]").getValue();
		sortoption.sortcount = me.down("[name=sortcount]").getValue();
		sortoption.sortmeasure = me.down("[name=sortmeasure]").getValue();
		sortoption.sortpartition = me.down("[name=sortpartition]").getValue();
		sortoption.sortbyvalue = me.down("[name=sortbyvalue]").getValue();
	},
	
	_m1/*moveSelections*/: function(direction) {
		var me = this,
			mgrid_src = me.down("[name=mgrid_" + (direction == 1 ? "src" : "tgt") + "]"),
			mgrid_tgt = me.down("[name=mgrid_" + (direction == 1 ? "tgt" : "src") + "]"),
			sel = mgrid_src.getSelectionModel().selected,
			i, rec;
			
		if (sel && sel.length)
		{
			for (i=0; i < sel.length; i++)
			{
				rec = sel.items[i];
				mgrid_src.store.remove(rec);
				mgrid_tgt.store.add(rec);
			}
		}
	},
	
	_co/*changeOrder*/: function(direction) {
		var me = this,
			mgrid = me.down("[name=mgrid_tgt]"),
			sm = mgrid.getSelectionModel(),
			sel = sm.selected,
			ri, rec;
			
		if (sel && sel.length == 1)
		{
			rec = sel.items[0];
			ri = mgrid.store.indexOf(rec);
			
			if (direction == -1)
			{
				if (ri > 0)
				{
					mgrid.store.remove(rec);
					mgrid.store.insert(ri-1, rec);
					sm.select(rec, true);
				}
			}
			else 
			{
				if (ri+1 < mgrid.store.data.items.length)
				{
					mgrid.store.remove(rec);
					mgrid.store.insert(ri+1, rec);
					sm.select(rec, true);
				}
			}
		}
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1('L_SORT_OPTION');
		var panel = this;
				 
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				{
					xtype: "panel",
					bodyBorder: false,
					
					"layout": {
						type: "vbox",
						align: "stretch"
					},
					
					defaults: {
						anchor: "100%"
					},
					
					fieldDefaults: {
						labelWidth: 160
					},
					
					// showlastrank;sortcount;sortmethod;sortmeasure;sortorder;sortpartition
					
					items: [
						{
							xtype: "radiogroup",
							name: "sortmethod",
							fieldLabel: IRm$/*resources*/.r1("L_SORT_SEL"),
							columns: 1,
							labelWidth: 100,
							vertical: true,
							items: [
								{
									boxLabel: IRm$/*resources*/.r1('B_DEFAULT'), name: "sm", inputValue: "normal"
								},
								{
									boxLabel: IRm$/*resources*/.r1("B_CUSTOM"), name: "sm", inputValue: "custom"
								},
								{
									boxLabel: IRm$/*resources*/.r1("L_RANK_TOP"), name: "sm", inputValue: "top"
								},
								{
									boxLabel: IRm$/*resources*/.r1("L_RANK_BOTTOM"), name: "sm", inputValue: "bottom"
								}
							],
							listeners: {
								change: function(field, nvalue, ovalue, eopts) {
									panel.l1/*changeSortMethod*/.call(panel);
								}
							}
						},
						{
							xtype: "fieldset",
							name: "rankfield",
							border: 0,
							hidden: true,
							flex: 1,
							fieldDefaults: {
		            			labelWidth: 100
		        			},
		        			items: [
								{
									name: "sortcount",
									xtype: "numberfield",
									fieldLabel: IRm$/*resources*/.r1("L_RNK_CNT")
								},
								{
									name: "showlastrank",
									xtype: "checkbox",
									fieldLabel: IRm$/*resources*/.r1("L_RNK_LST")
								},
								{
									name: "sortmeasure",
									fieldLabel: IRm$/*resources*/.r1("L_RNK_VAL"),
									xtype: "combobox",
									queryMode: "local",
									displayField: "name",
									valueField: "uid",
									editable: false,
									autoSelect: true,
									store: {
										fields: [
											"name", "uid", "type", "nodepath"
										]
									}
								},
								{
									name: "sortpartition",
									fieldLabel: IRm$/*resources*/.r1("L_RNK_PAR"),
									xtype: "combobox",
									queryMode: "local",
									displayField: "name",
									valueField: "uid",
									editable: false,
									autoSelect: true,
									store: {
										fields: [
											"name", "uid", "type", "nodepath"
										]
									}
								},
								{
									name: "sortbyvalue",
									fieldLabel: IRm$/*resources*/.r1("L_RNK_SVAL"),
									xtype: "checkbox"
								}
							]
						},
						{
							xtype: "panel",
							name: "customfield",
							hidden: true,
							border: 0,
							flex: 1,
							layout: {
								type: "hbox",
								align: "stretch"
							},
		        			items: [
		        				{
		        					xtype: "fieldset",
		        					flex: 1,
		        					title: IRm$/*resources*/.r1("L_SORT_SRC"),
		        					layout: "fit",
		        					items: [
		        						{
											name: "mgrid_src",
											flex: 1,
											xtype: "gridpanel",
											stateful: true,
											$h: 240,
											store: {
												fields: [
													"name", "uid", "type", "sortorder", "sorder", "memo", "nodepath"
												]
											},
											selType: "checkboxmodel",
											selModel: {
												checkSelector: ".x-grid-cell"
											},
											viewConfig: {
												plugins: {
													ptype: "gridviewdragdrop",
													dragGroup: "gridDDGroup",
													dropGroup: "gridDDGroup"
												}
											},
											columns: [
												{
													header: IRm$/*resources*/.r1("B_NAME"),
													dataIndex: "name",
													sortable: false,
													hideable: false,
													flex: 1
												},
												{
													header: IRm$/*resources*/.r1("B_TYPE"),
													dataIndex: "type",
													hidden: true,
													sortable: false,
													hideable: false,
													flex: 1
												}
											]
										}
		        					]
								},
								{
									xtype: "container",
									layout: {
										type: "vbox",
										align: "stretch",
										pack: "center",
										padding: 5
									},
									items: [
										{
											xtype: "button",
											iconCls: "ig-btn-dblright",
											handler: function() {
												this._m1/*moveSelections*/(1);
											},
											scope: this
										},
										{
											xtype: "button",
											iconCls: "ig-btn-dblleft",
											handler: function() {
												this._m1/*moveSelections*/(2);
											},
											scope: this
										}
									]
								},
								{
		        					xtype: "fieldset",
		        					flex: 1,
		        					layout: {
		        						type: "hbox",
		        						align: "stretch"
		        					},
		        					title: IRm$/*resources*/.r1("L_SORT_ORD"),
		        					items: [
										{
											name: "mgrid_tgt",
											xtype: "gridpanel",
											stateful: true,
											$h: 240,
											flex: 1,
											selType: "checkboxmodel",
											selModel: {
												checkSelector: ".x-grid-cell"
											},
											store: {
												fields: [
													"name", "uid", "type", "nodepath", "sortorder", "sorder", "memo", "numeric"
												]
											},
											viewConfig: {
												plugins: {
													ptype: "gridviewdragdrop",
													dragGroup: "gridDDGroup",
													dropGroup: "gridDDGroup"
												}
											},
											plugins: [
												{
													ptype: "cellediting",
													clicksToEdit: 1
												}
											],
											seltype: "cellmodel",
											columns: [
												{
													header: IRm$/*resources*/.r1("B_NAME"),
													dataIndex: "name",
													sortable: false,
													hideable: false,
													flex: 1
												},
												{
													header: IRm$/*resources*/.r1("B_TYPE"),
													dataIndex: "type",
													hidden: true,
													sortable: false,
													hideable: false,
													flex: 1
												},
												{
													header: IRm$/*resources*/.r1("B_METHOD"),
													dataIndex: "sorder",
													sortable: false,
													hideable: false,
													width: 60
												},
												{
													header: IRm$/*resources*/.r1("B_NUMERIC"),
													xtype: "checkcolumn",
													dataIndex: "numeric",
													sortable: false,
													hideable: false,
													width: 50
												}
											],
											listeners: {
												cellclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts)
												{
													var selcolumn = cellIndex;
													
													if (selcolumn == 3)
													{
														switch (record.get("sorder"))
														{
														case "":
															record.set("sorder", IRm$/*resources*/.r1("B_ASC"));
															break;
														case IRm$/*resources*/.r1("B_ASC"):
															record.set("sorder", IRm$/*resources*/.r1("B_DSC"));
															break;
														case IRm$/*resources*/.r1("B_DSC"):
															record.set("sorder", "");
															break;
														}
													}
												}
											}
										},
										{
											xtype: "container",
											layout: {
												type: "vbox",
												align: "stretch",
												pack: "center",
												padding: 2
											},
											items: [
												{
													xtype: "button",
													iconCls: "ig-btn-up",
													handler: function() {
														this._co/*changeOrder*/(-1);
													},
													scope: this
												},
												{
													xtype: "button",
													iconCls: "ig-btn-down",
													handler: function() {
														this._co/*changeOrder*/(1);
													},
													scope: this
												}
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
					this._IFd/*init_f*/();
				}
			}
		});
		
		IG$/*mainapp*/._If0/*sortOptionDlg*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Ida/*filterEditorPanel*/ = $s.extend($s.panel, {
	"layout": "fit",
	
	busy: false,
	
	_ILa/*reportoption*/: null,
	_ILb/*sheetoption*/: null,
	
	m1$9/*confirmFilterSetting*/: function() {
		var me = this,
			root = me.rootnode,
			i;
			
		if (me._ILb/*sheetoption*/)
		{
			var ofilter = me._ILb/*sheetoption*/.filter,
				ohavingfilter = me._ILb/*sheetoption*/.havingfilter;
				
			me._ILb/*sheetoption*/.filter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
			me._ILb/*sheetoption*/.havingfilter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
			
			if (ofilter || ohavingfilter)
			{
				if (ofilter)
				{
					me._ILb/*sheetoption*/.filter.authname = ofilter.authname;
					me._ILb/*sheetoption*/.filter.authuid = ofilter.authuid;
					me._ILb/*sheetoption*/.filter.active = ofilter.active;
				}
				
				if (ohavingfilter)
				{
					me._ILb/*sheetoption*/.filter.authname = ohavingfilter.authname;
					me._ILb/*sheetoption*/.filter.authuid = ohavingfilter.authuid;
					me._ILb/*sheetoption*/.filter.active = ohavingfilter.active;
				}
			}
			
			$.each(root.children, function(i, fitem) {
				var sfilter = null;
				
				if (fitem.condition == "WHERE")
				{
					sfilter = me._ILb/*sheetoption*/.filter;
				}
				else if (fitem.condition == "HAVING")
				{
					sfilter = me._ILb/*sheetoption*/.havingfilter;
				}
				
				if (fitem.children.length > 0)
				{
					$.each(fitem.children, function(i, cobj) {
						me.mm1/*updateFilterChanges*/.call(me, sfilter, cobj);
					});
				}
			});
		}
	},
	
	mm1/*updateFilterChanges*/: function(ufilter, cnode) {
		var i,
			me = this;
		
		if (cnode.nodetype == "group")
		{
			if (cnode.children.length > 0)
			{
				var tgroup = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
				tgroup.name = cnode.name;
				ufilter.subGroups.push(tgroup);
				
				$.each(cnode.children, function(i, cobj) {
					me.mm1/*updateFilterChanges*/.call(me, tgroup, cobj);
				});
			}
		}
		else if (cnode.nodetype == "condition")
		{
			var f = cnode.filternode;
			ufilter.subConditions.push(f);
		}
	},
	
	mm2/*getGroupRenderer*/: function(fgroup, unode) {
		var btndiv = $("<div class='filterbtn'></div>"),
			me = this, 
			btn1 = $("<div class='filterbtnitem icon-addfilter-group' title='Add SubGroup'>&nbsp;</div>"),
			filterpid = fgroup.pid,
			tb,
			fnamefield = $("<span>" + fgroup.name + "</span>"),
			fnameeditor = $("<input type='text'></input>"),
			ftitle = $("<div class='filter-header'></div>"),
			i, hasgroup = false,
			cnt;
		
		if (unode.children.length > 0)
		{
			for (i=0; i < unode.children.length; i++)
			{
				if (unode.children[i].nodetype == "group")
				{
					hasgroup = true;
					break;
				}
			}
			
			if (hasgroup)
			{
				fgroup.cblk = $("<td class='filter-condition'>OR</td>").appendTo(unode.h$2/*htmlgrp*/);
			}
		}
		
		fgroup.html = $("<td class='filter-block'><div class='filter-block-cnt'></div></td>");
		cnt = $(".filter-block-cnt", fgroup.html);
		fgroup.html.appendTo(unode.h$2/*htmlgrp*/);
		cnt.append(ftitle);
		ftitle.append(fnamefield);
		fnameeditor.css({width: 80, display: "none"});
		ftitle.append(fnameeditor);
		
		ftitle.append(btndiv);
		btndiv.append(btn1);
		
		fgroup.fnameeditor = fnameeditor;
		fgroup.fnamefield = fnamefield;
		
		fnamefield.bind("click", function() {
			me.mma/*editName*/.call(me, fgroup);
		});
		
		fnameeditor.bind("keypress", function(e) {
			if (e.keyCode == 13)
			{
				me.mmb/*editEndName*/.call(me, fgroup);
			}
		});
		
		btn1.bind("click", function() {
			if (fgroup.children.length > 0)
			{
				me.mm4/*appendNewGroup*/.call(me, fgroup);
			}
		});
		
		var btn2 = $("<div class='filterbtnitem icon-addfilter-cond' title='Add Condition'>&nbsp;</div>");
		btndiv.append(btn2);
		btn2.bind("click", function() {
			me.mm5/*appendNewCondition*/.call(me, fgroup);
		});
		
		var btn3 = $("<div class='filterbtnitem icon-toolbar-remove' title='Delete Condition'>&nbsp;</div>");
		btndiv.append(btn3);
		btn3.bind("click", function() {
			me.mm6/*deleteItem*/.call(me, fgroup, unode);
		});
		
		fgroup.h$1/*htmlcond*/ = $("<div class='filtercond'></div>");
		tb = $("<table class='filtergroup'></table>");
		fgroup.h$2/*htmlgrp*/ = $("<tr></tr>").appendTo(tb);
		cnt.append(fgroup.h$1/*htmlcond*/);
		cnt.append(tb); // fgroup.h$2/*htmlgrp*/);
	},
	
	mm3/*getCondRenderer*/: function(fcond, unode) {
		var me = this,
			btndiv = $("<div class='filterbtn'></div>");
			 
		fcond.html = $("<li></li>");
		unode.h$1/*htmlcond*/.append(fcond.html);
		
		var btnedit = $("<div class='filtereditbtn'>" + fcond.name + "</div>");
		fcond.html.append(btnedit);
		
		fcond.deschtml = btnedit;
		
		btnedit.bind("click", function() {
			me.mm6a/*editItem*/.call(me, fcond);
		});
		
		fcond.html.append(btndiv);
		
		var btn3 = $("<div class='filterbtnitem icon-toolbar-remove' title='Delete Condition'>&nbsp;</div>");
		
		btndiv.append(btn3);
		
		btn3.bind("click", function() {
			me.mm6/*deleteItem*/.call(me, fcond, unode);
		});
	},
	
	mma/*editName*/: function(item) {
		var me = this,
			editor = item.fnameeditor,
			field = item.fnamefield;
		
		field.css({display: "none"});
		editor[0].value = item.name;
		editor.css({display: "inline", width: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(field) || 100});
	},
	
	mmb/*editEndName*/: function(item) {
		var me = this,
			editor = item.fnameeditor,
			field = item.fnamefield,
			fname = editor[0].value;
		
		editor.css({display: "none"});
		// editor[0].text = item.name;
		field.css({display: "inline"});
		item.name = fname;
		field.text(item.name);
	},
	
	mm4/*appendNewGroup*/: function(unode) {
		var me = this;
			
		var fgroup = {
			name: "Conditions",
			nodetype: "group",
			unode: unode,
			children: [],
			filternode: null
		};
		
		me.mm2/*getGroupRenderer*/(fgroup, unode);

		unode.children.push(fgroup);
		
		return fgroup;
	},
	
	mm5/*appendNewCondition*/: function(unode, targetitem) {
		var me = this,
			filter = new IG$/*mainapp*/._IE9/*clFilter*/(null),
			cubeuid = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.cubeuid : null;
		
		filter.operator = 6;
		
    	var pop = new IG$/*mainapp*/._Idb/*filterEditor*/({
    		m4/*filteritem*/: filter,
    		_ILa/*reportoption*/: me._ILa/*reportoption*/,
    		targetitem: targetitem,
    		cubeuid: cubeuid,
    		callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_mm5/*appendNewCondition*/, [unode, filter])
    	});
    	IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
	},
	
	mm6a/*editItem*/: function(item) {
		var me = this,
			i,
			pwin,
			cubeuid = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.cubeuid : null;
			
		if (item)
		{
			pwin = new IG$/*mainapp*/._Idb/*filterEditor*/({
	    		m4/*filteritem*/: item.filternode,
	    		_ILa/*reportoption*/: me._ILa/*reportoption*/,
	    		cubeuid: cubeuid,
	    		callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_mm6a/*editCondition*/, [item, item.filternode])
	    	});
	    	IG$/*mainapp*/._I_5/*checkLogin*/(this, pwin);
		}
	},
	
	rs_mm6a/*editCondition*/: function(param) {
		var me = this,
			unode = param[0],
    		filter = param[1],
    		desc;
    	
    	if (unode)
    	{
    		desc = filter._d4/*getDesc*/();
    		unode.name = desc;
    		
    		unode.deschtml.text(unode.name);
    	}
	},
	
	mm6/*deleteItem*/: function(item, pitem) {
		var me = this,
			i,
			hasmgroup = 0;
		
		if (item)
		{
			for (i=0; i < pitem.children.length; i++)
			{
				if (pitem.children[i] == item)
				{
					pitem.children.splice(i, 1);
					break;
				}
			}
			
			item.cblk && item.cblk.remove();
			item.cblk = null;
			item.html.remove();
			
			if (pitem.children.length > 0)
			{
				for (i=0; i < pitem.children.length; i++)
				{
					if (pitem.children[i].nodetype == "group")
					{
						if (hasmgroup == 0)
						{
							pitem.children[i].cblk && pitem.children[i].cblk.remove();
							pitem.children[i].cblk = null;
						}
						hasmgroup++;
					}
				}
			}
		}
	},
	
	rs_mm5/*appendNewCondition*/: function(param) {
    	var me = this,
    		unode = param[0],
    		filter = param[1];
    	
    	if (unode)
    	{
    		var obj = {
	    		unode: unode,
	    		name: filter._d4/*getDesc*/(),
	    		nodetype: "condition",
	    		filternode: filter
	    	};
	    	
	    	me.mm3/*getCondRenderer*/(obj, unode);
	    	
	    	unode.children.push(obj);
    	}
    },
	
	in$t: function() {
		var me = this,
			i;
		
		me.filterview = me.down("[name=filterview]");
		
		// clear all
		var el = $(".igc-filter-el", me.filterview.body.dom);
		$(el).empty();
		
		me.rootnode = {};
		me.rootnode_w = {};
		me.rootnode_h = {};
		
		if (me._ILb/*sheetoption*/)
		{
			if (!me._ILb/*sheetoption*/.filter)
			{
				me._ILb/*sheetoption*/.filter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
			}

			if (!me._ILb/*sheetoption*/.havingfilter)
			{
				me._ILb/*sheetoption*/.havingfilter = new IG$/*mainapp*/._IEb/*clFilterGroup*/();
			}
			
			me.rootnode = {
				name: "Conditions",
				nodetype: "rootgroup",
				children: [
				]
			};
			
			me.rootnode_w = {
				name: "WHERE",
				nodetype: "rootgroup",
				condition: "WHERE",
				children: [
					
				]
			};
			
			me.rootnode_h = {
				name: "HAVING",
				condition: "HAVING",
				nodetype: "rootgroup",
				children: [
					
				]
			};
			
			me.rootnode.children.push(me.rootnode_w);
			me.rootnode.children.push(me.rootnode_h);
			
			$.each(me.rootnode.children, function(i, rootnode) {
				var rnode, t = $("<div class='filter-root'></div>"),
					btndiv = $("<div class='filterbtn'></div>"),
					filter = me._ILb/*sheetoption*/.filter,
					havingfilter = me._ILb/*sheetoption*/.havingfilter,
					tb,
					btn = $("<div class='filterbtnitem icon-addfilter-group' title='Add SubGroup'>&nbsp;</div>");
					
				t.appendTo(el);
				rnode = rootnode;
				rnode.html = $("<div class='filtercontainer'><div class='filter-header'><span class='filtertitle'>" + rootnode.name + "</span></div></div>");
				btn.appendTo(btndiv);
				$(".filter-header", rnode.html).append(btndiv);
				tb = $("<table class='filtergroup'></table>");
				rnode.h$2/*htmlgrp*/ = $("<tr></tr>").appendTo(tb);
				rnode.html.append(tb);
				rnode.html.appendTo(t);
				
				btn.bind("click", function() {
					me.mm4/*appendNewGroup*/.call(me, rootnode);
				});
				
				if (rootnode.condition == "WHERE")
				{
					me.mm7/*makeFilterData*/.call(me, rootnode, filter);
				}
				else if (rootnode.condition == "HAVING")
				{
					me.mm7/*makeFilterData*/.call(me, rootnode, havingfilter);
				}
			});
			
			if (me.targetitem)
			{
				setTimeout(function() {
					me.in$l.call(me);
				}, 400);
			}
		}
	},
	
	in$l: function() {
		var me = this,
			filter = me._ILb/*sheetoption*/.filter,
			froot = me.rootnode_w,
			tfilter = null,
			targetitem = me.targetitem,
			fg = null;
			
		tfilter = filter.T1/*findItem*/.call(filter, targetitem.uid);
				
		if (tfilter)
		{
			me.mm6a/*editItem*/.call(me, tfilter.id);
		}
		else
		{
			if (filter.subGroups.length > 0)
			{
				fg = froot.children[0];
			}
			else
			{
				fg = me.mm4/*appendNewGroup*/(me.rootnode_w);
			}
			
			me.mm5/*appendNewCondition*/(fg, targetitem);
		}
	},
	
	mm7/*makeFilterData*/: function(unode, fnode) {
		var me = this;
		
		if (fnode.subGroups.length > 1)
		{
			unode.h$2/*htmlgrp*/.addClass("filter-multi-cond");
		}
		else
		{
			unode.h$2/*htmlgrp*/.removeClass("filter-multi-cond");
		}
		
		$.each (fnode.subGroups, function(i, gobj) {
			var filter,
				obj = {
	    			name: gobj.name || "SubGroup",
	    			pnode: unode,
	    			children: [],
	    			nodetype: "group",
	    			filternode: gobj
	    		};
    		
    		me.mm2/*getGroupRenderer*/.call(me, obj, unode);

    		unode.children.push(obj);
    		
    		if (gobj.subGroups && gobj.subGroups.length > 0)
    		{
    			me.mm7/*makeFilterData*/.call(me, obj, gobj);
    		}
    		
    		if (gobj.subConditions && gobj.subConditions.length > 0)
    		{
    			$.each(gobj.subConditions, function(j, scond) {
	    			var filter = scond,
						fobj;
						
					fobj = {
						pnode: obj,
						name: filter._d4/*getDesc*/(),
						nodetype: "condition",
						filternode: filter
					};
					
					me.mm3/*getCondRenderer*/.call(me, fobj, obj);
					obj.h$1/*htmlcond*/.append(fobj.html);
					obj.children.push(fobj);
				});
    		}
		});
	},
	
	mm8/*makeDropZone*/: function(el) {
		var me = this;
		
		me.dropZone = $s.create($s.dropzone, el, {
			ddGroup: "_I$RD_G_",
			
			nodeouttimer: -1,
			
			getTargetFromEvent: function(e) {
				var renderer = el;
	            return renderer;
	        },
	        
	        onNodeEnter : function(target, dd, e, data){
	        	var i,
	        		dt, dttype,
	        		hasitem = false,
	        		accept = false;
	        		
	        	if (data.records && data.records.length > 0)
	        	{
	        		dt = data.records[0].get("type");
	        		
	        		if (dt == "Metric" || dt == "CustomMetric" || dt == "Measure" || dt == "FormulaMeasure")
	        		{
        				accept = true;
	        		}
	        	}
	        		        	
	        	this.accept = accept;
	        },
	        onNodeOut : function(target, dd, e, data){
	        },
	        onNodeOver : function(target, dd, e, data){
	        	var dt,
	        		ret = ((this.accept == true) ? Ext.dd.DropZone.prototype.dropAllowed : Ext.dd.DropZone.prototype.dropNotAllowed);
	        	if (this.accept == true)
	        	{
	        		if (data.records && data.records.length > 0)
	        		{
	        			dt = data.records[0].data;
	        		}
	        		else
	        		{
	        			dt = data.cellData;
	        		}
					
					if (e.xy)
					{
						// me.showDropProxy.call(me, el, e.xy);
					}
	        	}
	            return ret;
	        },
	        onNodeDrop : function(target, dd, e, data){
	            if (this.accept == true)
	            {
	            	if (data.records && data.records.length > 0)
	        		{
	        			dt = data.records[0];
						if (e.xy)
						{
							me.a2/*processFilterDrop*/.call(me, dt, el, e.xy);
						}
	        		}
	        		else
	        		{
	        			dt = data.cellData;
	        		}
	            }
	            
	            this.accept = false;
	            return true;
	        }
		});
	},
	
	a3/*hitBoundary*/: function(node, pt) {
		var thtml,
			toffset,
			i,
			pobj,
			me = this;
		
		for (i=0; i < node.children.length; i++)
		{
			thtml = node.children[i].html;
			toffset = thtml.offset();
			
			if (toffset.left < pt[0] && pt[0] < toffset.left + IG$/*mainapp*/.x_10/*jqueryExtension*/._w(thtml) &&
				toffset.top < pt[1] && pt[1] < toffset.top + IG$/*mainapp*/.x_10/*jqueryExtension*/._h(thtml))
			{
				pobj = node.children[i];
				
				sobj = me.a3/*hitBoundary*/(node.children[i], pt);
				
				if (sobj)
				{
					pobj = sobj;
				}
				break;
			}
		}
		
		return pobj;
	},
	
	a2/*processFilterDrop*/: function(rec, el, pt) {
		var me = this,
			filternode = me.rootnode,
			tnode, pnode, pc;
		
		tnode = me.a3/*hitBoundary*/(filternode, pt);
		
		if (tnode)
		{
			var dt = new IG$/*mainapp*/._IE8/*clItems*/();
			dt.uid = rec.get("uid");
			dt.name = rec.get("name");
			dt.type = rec.get("type");
			dt.contentfullpath = rec.get("contentfullpath");
			dt.itemtype = dt.type;
			
			pnode = tnode.unode;
			
			while (pnode)
			{
				if (pnode.nodetype == "rootgroup")
				{
					pc = pnode.condition;
					break;
				}
				pnode = pnode.unode;
			}
			
			if (dt.type != "Measure" && dt.type != "FormulaMeasure" && pc == "HAVING")
			{
				return;
			}
			
			me.mm5/*appendNewCondition*/.call(me, tnode, dt);
		}
	},
	
	a1/*render*/: function() {
		var me = this,
			filterview = me.down("[name=filterview]"),
			el = filterview.body.dom;
		
		me.mm8/*makeDropZone*/(el);
	},
	
	set_count: function(counts) {
		var me = this;
		
		me._scn/*count_seq*/ = 0;
		
		$.each(me.rootnode.children, function(i, rootnode) {
			if (rootnode.condition == "WHERE")
			{
				me._sc/*update_count*/.call(me, rootnode, counts);
			}
		});
	},
	
	_sc/*update_count*/: function(rnodes, counts) {
		var i,
			tnode,
			sc;
		
		for (i=0; i < rnodes.length; i++)
		{
			tnode = rnodes[i];
			
			if (tnode.nodetype == "group")
			{
				sc = counts.length > me._scn/*count_seq*/ ? counts[me._scn/*count_seq*/] : -1;
				
				me._scn/*count_seq*/++;
				if (tnode.children && tnode.children.length)
				{
					me._sc/*update_count*/(tnode.children, counts);
				}
			}
		}
	},
	
	initComponent : function() {
		$s.apply(this, {
			items: [
				{
					html: "<div class='igc-filter-el'></div>",
					name: "filterview",
					flex: 1,
					autoScroll: true
				}
			],
			
			listeners: {
				afterrender: function() {
					this.a1/*render*/();
					this.in$t();
				},
				resize: function() {
				}
			}
		});
		
		IG$/*mainapp*/._Ida/*filterEditorPanel*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._Ia1/*filterEditorWindow*/ = $s.extend($s.window, {
	title: "Filter",
	modal: true,

	"layout": "fit",
	
	closable: false,
	resizable:false,
	width: 500,
	height: 400,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	m1$9/*confirmFilterSetting*/: function() {
		var me = this;
		
		me._IH1/*mainpanel*/.m1$9/*confirmFilterSetting*/.call(me._IH1/*mainpanel*/);
		me.callback && me.callback.execute(me._ILb/*sheetoption*/);
		me._IG0/*closeDlgProc*/();
	},
	
	initComponent : function() {
		var me = this;
		
		me._IH1/*mainpanel*/ = new IG$/*mainapp*/._Ida/*filterEditorPanel*/({
			_ILa/*reportoption*/: me._ILa/*reportoption*/,
			_ILb/*sheetoption*/: me._ILb/*sheetoption*/,
			targetitem: me.targetitem
		});
		
		$s.apply(me, {
			defaults:{bodyStyle:"padding:10px"},
			
			items: [
			    this._IH1/*mainpanel*/
			],
			buttons:[
//				{
//					text: IRm$/*resources*/.r1("B_HELP"),
//					handler: function() {
//						IG$/*mainapp*/._I63/*showHelp*/("P0011");
//					},
//					scope: this
//				}, 
				"->",
				{
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						this.m1$9/*confirmFilterSetting*/();
					},
					scope: this
				}, {
					text: IRm$/*resources*/.r1("B_CANCEL"),
					handler:function() {
						this.close();
					},
					scope: this
				}
			]
		});
		
		IG$/*mainapp*/._Ia1/*filterEditorWindow*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Ic7/*objectAuth*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": "fit",
	
	closable: false,
	resizable:false,
	width: 500,
	height: 400,
	
	_ILa/*reportoption*/: null,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.callback && this.callback.execute();
		
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		this._IQe/*updateAuthConfig*/();
	},
	
	_IQe/*updateAuthConfig*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			content,
			updateall = 'F',
			ctrl$updateall = panel.down('[name=updateall]'),
			auth = '',
			dgrid = panel.down("[name=datagridview]"),
			items = dgrid.store.data.items,
			record,
			i, d;
			
		if (ctrl$updateall.hidden == false && ctrl$updateall.getValue() == true)
		{
			updateall = 'T';
		}
		
		for (i=0; i < items.length; i++)
		{
			record = items[i];
			d = record.data;
			auth += '<Auth sid="' + d.sid + '" readable="' + ((d.readable == true) ? 'T' : 'F') + '" writable="' + ((d.writable == true) ? 'T' : 'F') + '" manage="' + ((d.manage == true) ? 'T' : 'F') + '"/>';
		}
		
		content = '<smsg><info option="update" updateall="' + updateall + '">' + auth + '</info></smsg>';
		
		panel.setLoading(true);
		
		req.init(panel, 
			{
	            ack: "2",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, type: this.itemtype}),
                mbody: content
	        }, panel, panel.rs__IQe/*updateAuthConfig*/, null);
		req._l/*request*/();
	},
	
	rs__IQe/*updateAuthConfig*/: function(xdoc) {
		this.callback && this.callback.execute();
		this.close();
	},
	
	_IFe/*initF*/: function() {
		if (this.uid)
		{
			var panel = this,
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				
			req.init(panel, 
				{
		            ack: "2",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, type: this.itemtype}),
	                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "standard"})
		        }, panel, panel.rs__IQd/*getAuthInfo*/, null);
			req._l/*request*/();
		}
	},
	
	rs__IQd/*getAuthInfo*/: function(xdoc) {
		var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item'),
			i,
			child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			data,
			dn;
		
		// mgrid.addEventListener(MecGridEvent.DRAW_COMPLETED, drawCompleteHandler, false, 0, true);
		// mgrid.dataProvider = data.children();
		this.dataset = [];
		
		for (i=0; i < child.length; i++)
		{
			data = IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[i]);
			data.readable = (data.readable == 'T') ? true : false;
			data.writable = (data.writable == 'T') ? true : false;
			data.manage = (data.manage == 'T') ? true : false;
			
			switch (data.dutytype)
			{
			case "A":
				dn = "Default";
				break;
			case "C":
				dn = "Custom";
				break;
			case "G":
				dn = "Group";
				break;
			case "U":
				dn = "User";
				break;
			default:
				dn = "Unknown";
				break;
			}
			
			data.dutytype_d = dn;
			
			if (data.dutytype != "A" || data.name.toLowerCase() != "admins")
			{
				this.dataset.push(data);
			}
		}
		
		this.down("[name=datagridview]").store.loadData(this.dataset);
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1('T_OBJECT_AUTH');
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				{
					xtype: "panel",
					"layout": {
						type: 'vbox',
						align: 'stretch'
					},
					
					border: false,
					
					items: [
						{
							xtype: 'displayfield',
							value: IRm$/*resources*/.r1('L_AU_TITLE')
						},
						{
							xtype: "gridpanel",
							name: "datagridview",
							
							store: {
								fields: [
									"name", "readable", "writable", "manage", "uid", "nodepath", "type", "sid", "dutytype_d", "dutytype"
								]
							},
							
							flex: 1,
							
							columns: [
								{
									text: 'Name',
									flex: 1,
									sortable: false,
									dataIndex: 'name'
								},
								{
									text: "Type",
									width: 60,
									dataIndex: "dutytype_d"
								},
								{
									xtype: 'checkcolumn',
									text: 'Read',
									width: 50,
									sortable: false,
									dataIndex: 'readable',
									editor: {
							    		xtype: 'checkbox'
							    	}
								},
								{
									xtype: 'checkcolumn',
									text: 'Write',
									width: 50,
									sortable: false,
									dataIndex: 'writable',
									editor: {
							    		xtype: 'checkbox'
							    	}
								}
							]
						},
						{
							name: 'updateall',
							fieldLabel: IRm$/*resources*/.r1('B_OPTION'),
							xtype: 'checkbox',
							boxLabel: IRm$/*resources*/.r1('L_AU_APPLY_SUB'),
							checked: false,
							hidden: ((this.itemtype == 'Workspace' || this.itemtype == 'Folder') ? false : true)
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
					var panel = this;
					
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/._Ic7/*objectAuth*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._I6d_/*workspace_switcher*/ = $s.extend($s.window, {
	modal: true,
	region:'center',
	
	"layout": "fit",
	
	closable: false,
	resizable:false,
	
	width: 380,
	autoHeight: true,
	
	ldM/*loadMTS*/: function() {
		var panel = this,
			mkw = panel.down("[name=mkw]"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/tenants", action: "get", keyword: mkw.getValue()}, "address;action;keyword"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "select"})
	        }, panel, function(xdoc) {
	        	var i,
	        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
	        		cnodes,
	        		mts,
	        		mtslist = [];
	        	
	        	if (tnode)
	    		{
	    			cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
	    			
	    			for (i=0; i < cnodes.length; i++)
	    			{
	    				mts = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[i]);
//	    				switch (mts.pstatus)
//	    				{
//	    				case "A":
//	    					mts.pstatname = "App";
//	    					break;
//	    				case "1":
//	    					mts.pstatname = "Active";
//	    					break;
//	    				default:
//	    					mts.pstatname = "Disabled";
//	    					break;
//	    				}
	    				(mts.pstatus == "1" || mts.pstatus == "A") && mtslist.push(mts);
	    			}
	    		}
	    		
	    		this.down("[name=mtsgrd]").store.loadData(mtslist);
	        }, false);
		req._l/*request*/();
	},
	
	m1/*confirm*/: function() {
		var panel = this,
			mtsgrd = panel.down("[name=mtsgrd]"),
			sel = mtsgrd.getSelectionModel().selected;
		
		if (sel && sel.length)
		{
			IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("L_SWA_CFM"), function(dlg) {
				if (dlg == "yes")
				{
					var rec = sel.items[0],
						nmts = rec.get("uid"),
						nmtsname = rec.get("name"),
						curl = document.location.href;
					
					if (curl.indexOf("?") > -1)
					{
						curl = curl.substring(0, curl.indexOf("?"));
					}	
					
					// ?lang=ko_KR&mts=0122483f-0155fb46&_d=308
					curl = curl + "?lang=" + (window.useLocale || "en_US") + "&mts=" + nmts;
					
					document.location.href = curl;
				}
			}, panel, panel);
		}
		else
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("E_SWA_CFM"), null, null, 0, "error");
		}
	},
	
	initComponent: function() {
		
		$s.apply(this, {
			title: IRm$/*resources*/.r1("L_SW_APP"),
			items: [
				{
					xtype: "panel",
					bodyPadding: 10,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "container",
							layout: "hbox",
							items: [
								{
									xtype: "textfield",
									labelAlign: "right",
									fieldLabel: "Search",
									name: "mkw",
									labelWidth: 60,
									width: 200,
									enableKeyEvents: true,
									listeners: {
										keyup: function(tobj, e, eopts) {
											if (e.keyCode == 13)
											{
												this.ldM/*loadMTS*/();
											}
										},
										scope: this
									}
								},
								{
									xtype: "button",
									text: "..",
									handler: function() {
										this.ldM/*loadMTS*/();
									},
									scope: this
								}
							]
						},
						{
							xtype: "gridpanel",
							hideHeaders: true,
							name: "mtsgrd",
							height: 150,
							store: {
								xtype: "store",
								fields: [
									"name", "uid"
								]
							},
							selType: "checkboxmodel",
							selModel: {
								checkSelector: ".x-grid-cell",
								mode: "SINGLE"
							},
							columns: [
								{
									text: "Name",
									dataIndex: "name",
									flex: 1
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
						this.m1/*confirm*/();
					},
					scope: this
				}, 
				{
					text: IRm$/*resources*/.r1('B_CANCEL'),
					handler:function() {
						this.close();
					},
					scope: this
				}
			]
		});
		IG$/*mainapp*/._I6d_/*workspace_switcher*/.superclass.initComponent.apply(this, arguments);
	}

});

IG$/*mainapp*/._I6d/*passwordMgr*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	
	"layout": {
		type: 'vbox',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	
	width: 380,
	height: 200,
	
	parentnodepath: null,
	itemtype: null,
	parentuid: null,
	
	callback: null,
	
	m1$21/*processChangePasswd*/: function(){
		var panel = this;
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
    			{
	                ack: "23",
		            payload: '<smsg></smsg>',
		            mbody: '<smsg></smsg>'
	            }, panel, panel.rs_m1$21a/*getSequereKey*/, null);
	    req._l/*request*/();
	},
	
	rs_m1$21a/*getSequereKey*/: function(xdoc) {
		var panel = this,
			root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			item = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			ltoken;
		
		if (item)
		{
			p1 = IG$/*mainapp*/._I1a/*getSubNodeText*/(item, "p1");
			p2 = IG$/*mainapp*/._I1a/*getSubNodeText*/(item, "p2");
			
			if (p1 && p2)
			{
				IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/ = p1;
				IG$/*mainapp*/._I3b/*rsaPpublicKeyExponent*/ = p2;
				panel.m1$21a/*afterSecurityKey*/.call(panel);
			}
		}
	},
	
	m1$21a/*afterSecurityKey*/: function() {
		var panel = this,
			formpanel = panel.inputpanel,
			opasswd = formpanel.down('[name=oldpasswd]').getValue(),
			npass1 = formpanel.down('[name=newpasswd1]').getValue(),
			npass2 = formpanel.down('[name=newpasswd2]').getValue(),
			enc,
			req;
		
		if (npass1 != npass2)
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, 'Password is not match with confirm value', null, null, 1, "error");
			return;
		}
		
		enc = IG$/*mainapp*/._I3c/*encryptkey*/([opasswd, npass1]);
		opasswd = enc[0];
		npass1 = enc[1];
		
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
    			{
	                ack: "28",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/user"}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "changepassword", password: npass1, oldpassword: opasswd})
	            }, panel, panel.rs_m1$21/*processChangePasswd*/, null);
	    req._l/*request*/();
	},
	
	rs_m1$21/*processChangePasswd*/: function (xdoc) {
		var panel = this;
		
		if (panel.callback)
		{
			panel.callback.execute();
		}
		
		panel.close();
	},
		
	initComponent : function() {
		this.title = IRm$/*resources*/.r1('T_PASSWORD_CHANGE');
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
			    {
			    	html: IRm$/*resources*/.r1('L_PWD_LABEL'),
			    	flex: 1,
			    	border: 0
			    },
			    {
			    	xtype: "panel",
					name: 'passwordform',
					
					defaultType: 'textfield',
					fieldDefaults: {
		    			labelWidth: 150,
		    			anchor: '100%'
					},
					
					layout: "anchor",
					
					items: [
		    			{
							name: 'oldpasswd',
							fieldLabel: IRm$/*resources*/.r1('L_PWD_OLD'),
							xtype: 'textfield',
							inputType: 'password',
							allowblack: false,
							labelWidth: 150
						},
						{
							name: 'newpasswd1',
							fieldLabel: IRm$/*resources*/.r1('L_PWD_NEW'),
							xtype: 'textfield',
							inputType: 'password',
							allowblack: false,
							labelWidth: 150
						},
						{
							name: 'newpasswd2',
							fieldLabel: IRm$/*resources*/.r1('L_PWD_CONFIRM'),
							xtype: 'textfield',
							inputType: 'password',
							allowblack: false,
							labelWidth: 150
						}
					]
				}
			],
			buttons:[
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.m1$21/*processChangePasswd*/();
					},
					scope: this
				}, 
				{
					text: IRm$/*resources*/.r1('B_CANCEL'),
					handler:function() {
						this.close();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function(ui) {
					ui.inputpanel = ui.down("[name=passwordform]");
				}
			}
		});
		
		IG$/*mainapp*/._I6d/*passwordMgr*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._j/*userpref*/ = $s.extend($s.window, {
	modal: true,
	"layout": "fit",
	
	closable: true,
	resizable:false,
	
	width: 500,
	autoHeight: true,
	
	_1/*confirmDialog*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			nval = me._5/*getFormatString*/();
			grdtz = me.down("[name=grdtz]"),
			dtz = me.dtz;
			
		if (me.tzloaded && grdtz.getSelectionModel().selected.length > 0)
		{
			dtz = grdtz.getSelectionModel().selected.items[0].get("id");
		}
		
		req.init(me, 
			{
                ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/user"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "_gu_", uid: me.uuid}, null, [
	            	{
		            	name: "dtz",
		            	value: dtz
		            },
		            {
		            	name: "dfrm",
		            	value: nval
		            },
		            {
		            	name: "a1",
		            	value: me.down("[name=a1]").getValue()
		            },
		            {
		            	name: "a2",
		            	value: me.down("[name=a2]").getValue()
		            }
				])
            }, me, me.rs__1/*confirmDialog*/);
		req._l/*request*/();
	},
	
	rs__1/*confirmDialog*/: function(xdoc) {
		this.close();
	},
	
	_2/*loadConfig*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			uuid = panel.uuid || IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.sid;
			
		panel.uuid = uuid;
		
		req.init(panel, 
			{
                ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/user"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "_gi_", uid: uuid, tmpl: (IG$/*mainapp*/.__ep ? "sys_print_mode" : "")})
            }, panel, panel.rs__2/*loadConfig*/);
		req._l/*request*/();
	},
	
	rs__2/*loadConfig*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/userdetail/smsg/item"),
			dformat = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dfrm");
			
		dformat = dformat.replace(/\\&apos;/g, "'");
		
		me.dtz = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dtz");
		me.a1 = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "a1");
		me.a2 = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "a2");
		me.down("[name=a1]").setValue(me.a1 || "");
		me.down("[name=a1]").setValue(me.a2 || "");
		me._3/*updateForm*/(dformat);
	},
	
	_3/*updateForm*/: function(fval) {
		var me = this,
			f_order = me.down("[name=f_order]"),
			f_year = me.down("[name=f_year]"),
			f_month = me.down("[name=f_month]"),
			f_day = me.down("[name=f_day]"),
			f_ampm = me.down("[name=f_ampm]"),
			f_timezone = me.down("[name=f_timezone]"),
			f_datesep = me.down("[name=f_datesep]"),
			f_timesep = me.down("[name=f_timesep]"),
			f_wkday = me.down("[name=f_wkday]"),
			f_weekday = me.down("[name=f_weekday]"),
			f_wkdayod = me.down("[name=f_wkdayod]"),
			f, ny, nm, nd, dsep, md, fy;
		
		ny = fval.indexOf("y");
		nm = fval.indexOf("M");
		nd = fval.indexOf("d");
		
		if (nd < nm && nm < ny)
		{
			f = "DMY"; md = nm;
		}
		else if (ny < nm && nm < nd)
		{
			f = "YMD"; md = nm;
		}
		else if (nm < nd && nd < ny)
		{
			f = "MDY"; md = nd;
		}
		
		dsep = fval.charAt(md-1);
		f_datesep.setValue(dsep);
		
		f_order.setValue(f || "YMD");
		fy = fval.substring(ny, fval.lastIndexOf("y")+1);
		if (ny > 0 && fval.charAt(ny-1) == "'")
		{
			fy = "''" + fy;
		}
		f_year.setValue(fy);
		f_month.setValue(fval.substring(nm, fval.lastIndexOf("M")+1));
		f_day.setValue(fval.substring(nd, fval.lastIndexOf("d")+1));
		
		ny = fval.indexOf("E");
		f = (ny > -1) ? fval.substring(ny, fval.lastIndexOf("E")+1) : "EEEE";
		f_weekday.setValue(f);
		
		if (ny == 0)
		{
			f_wkdayod.setValue(true);
		}
		
		f_wkday.setValue(ny > -1);
		
		ny = fval.indexOf("a");
		f_ampm.setValue(ny > -1);
		
		dsep = fval.charAt(fval.indexOf("m") - 1);
		f_timesep.setValue(dsep);
	},
	
	_4/*loadTimeZone*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel, 
			{
                ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "timezone"})
            }, panel, panel.rs__4/*loadTimeZone*/);
		req._l/*request*/();
	},
	
	rs__4/*loadTimeZone*/: function(xdoc) {
		var me = this,
			tnode,
			tnodes,
			i, dp = [], 
			dp_tmpl = [],
			p,
			grdtz = me.down("[name=grdtz]"),
			a1 = me.down("[name=a1]"),
			a2 = me.down("[name=a2]");
			
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/timezone");
		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
		
		for (i=0; i < tnodes.length; i++)
		{
			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			p.oh = p.offset / (1000*60*60);
			dp.push(p);
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/app_tmpl");
		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
		
		dp_tmpl.push({name: "Select", value: ""});
		
		for (i=0; i < tnodes.length; i++)
		{
			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			p.value = p.name;
			if (p.name.substring(0, 4) != "sys_")
			{
				dp_tmpl.push(p);
			}
		}
		
		a1.store.loadData(dp_tmpl);
		
		a1.setValue(me.a1 || "");
		
		me.tzloaded = true;
		grdtz.store.loadData(dp);
		
		for (i=0; i < grdtz.store.data.items.length; i++)
		{
			p = grdtz.store.data.items[i];
			if (p.get("id") == me.dtz)
			{
				grdtz.getSelectionModel().select(p);
				break;
			}
		}
	},
	
	_5/*getFormatString*/: function() {
		var me = this,
			f_order = me.down("[name=f_order]"),
			f_year = me.down("[name=f_year]"),
			f_month = me.down("[name=f_month]"),
			f_day = me.down("[name=f_day]"),
			f_ampm = me.down("[name=f_ampm]"),
			f_timezone = me.down("[name=f_timezone]"),
			f_datesep = me.down("[name=f_datesep]"),
			f_timesep = me.down("[name=f_timesep]"),
			f_wkday = me.down("[name=f_wkday]"),
			f_weekday = me.down("[name=f_weekday]"),
			f_wkdayod = me.down("[name=f_wkdayod]"),
			f,
			fd, fy, fm, fh;
		
		fy = f_year.getValue();
		fm = f_month.getValue();
		fd = f_day.getValue();
		fh = f_ampm.getValue() ? "hh" : "HH";
		
		switch (f_order.getValue())
		{
		case "DMY":
			f = [fd, fm, fy];
			break;
		case "YMD":
			f = [fy, fm, fd];
			break;
		case "MDY":
			f = [fm, fd, fy];
			break;
		}
		
		f = f.join(f_datesep.getValue());
		
		if (f_wkday.getValue())
		{
			f = (f_wkdayod.getValue()) ? f_weekday.getValue() + " " + f : f + " " + f_weekday.getValue();
		}
		
		f += " " + [fh, "mm", "ss"].join(f_timesep.getValue());
		
		f += f_ampm.getValue() ? " a" : "";
		f += f_timezone.getValue() ? ", z" : "";
		
		return f;
	},

	initComponent: function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("L_PREFERENCES");
		
		$s.apply(this, {
			items: [
				{
					xtype: "tabpanel",
					minHeight: 400,
					minTabWidth: 120,
					deferredRender: false,
					defaults: {
						bodyPadding: 10
					},
					items: [
						{
							xtype: "form",
							title: IRm$/*resources*/.r1("L_DATE_FORMAT"),
							deferredRender: false,
							layout: "anchor",
							items: [
								{
									xtype: "combobox",
									queryMode: "local",
									editable: false,
									fieldLabel: IRm$/*resources*/.r1("L_DF_OS"),
									name: "f_order",
									valueField: "value",
									displayField: "name",
									store: {
										xtype: "store",
										fields: ["name", "value"],
										data: [
											{name: "Day Month Year", value: "DMY"},
											{name: "Year Month Day", value: "YMD"},
											{name: "Month Day Year", value: "MDY"}
										]
									}
								},
								{
									xtype: "combobox",
									queryMode: "local",
									editable: false,
									fieldLabel: IRm$/*resources*/.r1("L_DF_YF"),
									name: "f_year",
									valueField: "value",
									displayField: "name",
									store: {
										xtype: "store",
										fields: ["name", "value"],
										data: [
											{name: "2009", value: "yyyy"},
											{name: "09", value: "yy"},
											{name: "'09", value: "''yy"}
										]
									}
								},
								{
									xtype: "combobox",
									queryMode: "local",
									editable: false,
									name: "f_month",
									fieldLabel: IRm$/*resources*/.r1("L_DF_MF"),
									valueField: "value",
									displayField: "name",
									store: {
										xtype: "store",
										fields: ["name", "value"],
										data: [
											{name: "1", value: "M"},
											{name: "01", value: "MM"},
											{name: "January", value: "MMMMM"},
											{name: "'Jan", value: "MMM"}
										]
									}
								},
								{
									xtype: "combobox",
									queryMode: "local",
									editable: false,
									name: "f_day",
									fieldLabel: IRm$/*resources*/.r1("L_DF_DF"),
									valueField: "value",
									displayField: "name",
									store: {
										xtype: "store",
										fields: ["name", "value"],
										data: [
											{name: "1", value: "d"},
											{name: "01", value: "dd"}
										]
									}
								},
								{
									xtype: "combobox",
									queryMode: "local",
									editable: false,
									name: "f_weekday",
									fieldLabel: IRm$/*resources*/.r1("L_DF_WF"),
									valueField: "value",
									displayField: "name",
									store: {
										xtype: "store",
										fields: ["name", "value"],
										data: [
											{name: "Monday", value: "EEEE"},
											{name: "Mon", value: "EEE"},
											{name: "Mo", value: "EE"},
											{name: "M", value: "E"}
										]
									}
								},
									{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_OPTIONS"),
									items: [
										{
											xtype: "checkbox",
											fieldLabel: IRm$/*resources*/.r1("L_DF_APM"),
											name: "f_ampm",
											boxLabel: IRm$/*resources*/.r1("B_SHOW")
										},
										{
											xtype: "checkbox",
											fieldLabel: IRm$/*resources*/.r1("L_DF_WD"),
											name: "f_wkday",
											boxLabel: IRm$/*resources*/.r1("B_SHOW")
										},
										{
											xtype: "checkbox",
											fieldLabel: IRm$/*resources*/.r1("L_DF_WD_O"),
											name: "f_wkdayod",
											boxLabel: IRm$/*resources*/.r1("L_SHOW_FIRST")
										},
										{
											xtype: "checkbox",
											fieldLabel: "checkbox",
											name: "f_timezone",
											fieldLabel: IRm$/*resources*/.r1("L_TIMEZONE"),
											boxLabel: IRm$/*resources*/.r1("L_SHOW_TZ")
										},
										{
											xtype: "combobox",
											queryMode: "local",
											fieldLabel: IRm$/*resources*/.r1("L_DF_DS"),
											name: "f_datesep",
											editable: false,
											valueField: "value",
											displayField: "name",
											store: {
												xtype: "store",
												fields: ["name", "value"],
												data: [
													{name: ". (dot)", value: "."},
													{name: ": (colon)", value: ":"},
													{name: ", (comma)", value: ","},
													{name: "- (hypen)", value: "-"},
													{name: "  (non)", value: ""}
												]
											}
										},
										{
											xtype: "combobox",
											queryMode: "local",
											fieldLabel: IRm$/*resources*/.r1("L_DF_TS"),
											name: "f_timesep",
											editable: false,
											valueField: "value",
											displayField: "name",
											store: {
												xtype: "store",
												fields: ["name", "value"],
												data: [
													{name: ": (colon)", value: ":"},
													{name: ". (dot)", value: "."},
													{name: ", (comma)", value: ","},
													{name: "- (hypen)", value: "-"},
													{name: "  (non)", value: ""}
												]
											}
										}
									]
								}
							]
						},
						{
							xtype: "form",
							title: IRm$/*resources*/.r1("L_TIMEZONE"),
							deferredRender: false,
							layout: "fit",
							items: [
								{
									xtype: "gridpanel",
									name: "grdtz",
									maxHeight: 380,
									selType: "checkboxmodel",
									selModel: {
										checkSelector: ".x-grid-cell",
										mode: "SINGLE"
									},
									store: {
										xtype: "store",
										fields: [
											"name", "offset", "id", "oh", "select"
										]
									},
									columns: [
										{
											text: "Id",
											dataIndex: "id",
											flex: 1
										},
										{
											text: IRm$/*resources*/.r1("B_NAME"),
											dataIndex: "name",
											flex: 1
										},
										{
											text: IRm$/*resources*/.r1("L_TZ_OFFSET"),
											dataIndex: "oh"
										}
									]
								}
							],
							listeners: {
								afterrender: function() {
									me._4/*loadTimeZone*/.call(me);
								}
							}
						},
						{
							xtype: "form",
							title: IRm$/*resources*/.r1("L_APPL"),
							deferredRender: false,
							layout: "anchor",
							items: [
								{
									xtype: "combobox",
									name: "a1",
									fieldLabel: IRm$/*resources*/.r1("L_APPL_TMPL"),
									labelWidth: 120,
									queryMode: "local",
									editable: false,
									valueField: "value",
									displayField: "name",
									store: {
										xtype: "store",
										fields: ["name", "value"]
									}
								},
								{
									xtype: "combobox",
									name: "a2",
									fieldLabel: IRm$/*resources*/.r1("L_APPL_THEME"),
									labelWidth: 120,
									queryMode: "local",
									editable: false,
									valueField: "value",
									displayField: "name",
									store: {
										xtype: "store",
										fields: ["name", "value"]
									}
								}
							]
						}
					]
				}
			],
			buttons: [
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this._1/*confirmDialog*/();
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1('B_CLOSE'),
					handler: function() {
						this.close();
					},
					scope: this
				}
			]
		});
		
		IG$/*mainapp*/._j/*userpref*/.superclass.initComponent.call(this);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj._2/*loadConfig*/();
		}
	}
});
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
IG$/*mainapp*/._I75/*aboutApp*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	
	"layout": 'fit',
	
	closable: false,
	resizable:false,
	
	width: 500,
	height: 400,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	initComponent : function() {
		var sbg = './images/splash_bg.gif';
		
		this.title = IRm$/*resources*/.r1('I_ABOUT', ig$/*appoption*/.appname);
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:0px'},
			
			items: [
			    {
			    	html: '<p><img src="' + sbg + '" alt="' + ig$/*appoption*/.companyname + ' ' + IG$/*mainapp*/.appversion + '" width="498" height="167" /></p>'
			    		+ '<table width="479" border="0" cellpadding="0" cellspacing="0">'
			    		+ '<tr>'
			    		+ '<td width="69" align="left">&nbsp;</td>'

			    		+ '<td width="410"><div align="right"><span class="about_style6">'
			    		+ 'Build Id: ' + ig$/*appoption*/.appInfo.apprelease
			    		+ '</span></div></td>'
			    		+ '</tr>'
			    		+ '</table>'
			    		+ '<table width="494" border="0" cellpadding="0" cellspacing="0">'
			    		+ '<tr>'
			    		+ '<td width="78">&nbsp;</td>'
			    		+ '<td width="416" valign="top"><div align="left">'
			    		+ '<p class="about_style2"> ' + IRm$/*resources*/.r1('L_CONTACT_CRED') + '<br/>'

			    		+ 'ALL RIGHTS RESERVED. <br />'
			    		+ ig$/*appoption*/.companyname + '. Confidential Information</p>'
			    		+ '<p class="about_style1"><span class="about_style4">' + IRm$/*resources*/.r1('L_CONTACT_HELP') + '</span>'
			    		+ '&nbsp;&nbsp;<a href="' + ig$/*appoption*/.companydomain + '" target="_new">' + ig$/*appoption*/.companydomain + '/</a></p>'
			    		+ '</div></td>'
			    		+ '</tr>'
			    		+ '</table>'

			    		+ '<p>&nbsp;</p>'
			    		+ '<p align="left" class="about_style1">&nbsp;</p>'
			    }
			],
			
			buttons:[
				{
					text: IRm$/*resources*/.r1('B_CLOSE'),
					handler: function() {
						this.close();
					},
					scope: this
				}
			]
		});
		
		IG$/*mainapp*/._I75/*aboutApp*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Id0/*styleEditor*/ = $s.extend($s.formpanel, {
	cstyle: null,
	
	"layout": "anchor",
	
	autoHeight: true,
	
	autoScroll: true,
	
	htype: null,
	
	bodyPadding: 10,
	
	defaults: {
		anchor: "100%"
	},
	
	_IFe/*initF*/: function(cstyle) {
		if (cstyle)
		{
			// clStyle
			var me = this,
				ctrl,
				fs = Number(cstyle.fontstyle),
				fsa = [],
				halign = "left",
				valign = "center",
				n;
			
			if (fs & IG$/*mainapp*/._IE3/*fontStyle*/.P_BOLD)
			{
				fsa.push("bold");
			}
			if (fs & IG$/*mainapp*/._IE3/*fontStyle*/.P_ITALIC)
			{
				fsa.push("italic");
			}
			if (fs & IG$/*mainapp*/._IE3/*fontStyle*/.P_UNDERLINE)
			{
				fsa.push("underline");
			}
			ctrl = me.down("[name=fontstyle]");
			ctrl.setValue({cb_layout: fsa});
			
			ctrl = me.down("[name=" + me.htype + "textalign]");
			
			n = cstyle.textalign;
			
			if (n == 2 || n == 5 || n == 8)
			{
				halign = "center";
			}
			else if (n == 3 || n == 6 || n == 9)
			{
				halign = "right";
			}
			
			if (n < 4)
			{
				valign = "top"
			}
			else if (n > 6)
			{
				valign = "bottom";
			}
			
			var valueobj = {};
			valueobj["cb_" + me.htype + "textalign"] = [halign];
			ctrl.setValue(valueobj);
			
			me.down("[name=nullvalue]").setValue(cstyle.nullvalue || "");
			me.down("[name=formatstring]").setValue(cstyle.formatstring || "");
			me.down("[name=cssname]").setValue(cstyle.cssname || "");
			me.down("[name=template]").setValue(cstyle.template || "");
			me.down("[name=fontsize]").setValue(cstyle.fontsize || null);
			me.down("[name=padtop]").setValue(cstyle.paddingtop || 2);
			me.down("[name=padbottom]").setValue(cstyle.paddingbottom || 2);
			me.down("[name=padleft]").setValue(cstyle.paddingleft || 2);
			me.down("[name=padright]").setValue(cstyle.paddingright || 2);
			me.down("[name=forecolor]").setValue(IG$/*mainapp*/.$gv/*getColorValue*/(cstyle.forecolor));
			me.down("[name=backcolor]").setValue(IG$/*mainapp*/.$gv/*getColorValue*/(cstyle.backcolor));
			me.down("[name=bordercolor]").setValue(IG$/*mainapp*/.$gv/*getColorValue*/(cstyle.bordercolor));
			
			cstyle.borderright = (typeof(cstyle.borderright) == "undefined") ? 1 : cstyle.borderright;
			cstyle.borderbottom = (typeof(cstyle.borderbottom) == "undefined") ? 1 : cstyle.borderbottom;
			cstyle.borderleft = (typeof(cstyle.borderleft) == "undefined") ? 1 : cstyle.borderleft;
			cstyle.bordertop = (typeof(cstyle.bordertop) == "undefined") ? 1 : cstyle.bordertop;
			
			me.down("[name=bordertop]").setValue(cstyle.bordertop);
			me.down("[name=borderleft]").setValue(cstyle.borderleft);
			me.down("[name=borderright]").setValue(cstyle.borderright);
			me.down("[name=borderbottom]").setValue(cstyle.borderbottom);
			
			cstyle.borderoutright = (typeof(cstyle.borderoutright) == "undefined") ? 1 : cstyle.borderoutright;
			cstyle.borderoutbottom = (typeof(cstyle.borderoutbottom) == "undefined") ? 1 : cstyle.borderoutbottom;
			cstyle.borderoutleft = (typeof(cstyle.borderoutleft) == "undefined") ? 1 : cstyle.borderoutleft;
			cstyle.borderouttop = (typeof(cstyle.borderouttop) == "undefined") ? 1 : cstyle.borderouttop;
			
			me.down("[name=borderouttop]").setValue(cstyle.borderouttop);
			me.down("[name=borderoutleft]").setValue(cstyle.borderoutleft);
			me.down("[name=borderoutright]").setValue(cstyle.borderoutright);
			me.down("[name=borderoutbottom]").setValue(cstyle.borderoutbottom);
			
			me.down("[name=columnwidth]").setValue(cstyle.columnwidth || "");
			me.down("[name=autowidth]").setValue(cstyle.autowidth == "F" ? false : true);
		}
	},
	
	Mb_6/*loadStyleData*/: function(data, base) {
		var me = this;
		
		if (!base)
		{
			me.cstyle = data;
		}
		
		me._IFe/*initF*/(data);
	},
	
	Mb_7/*updateStyleData*/: function() {
		var me = this;
		
		if (me.cstyle)
		{
			var ctrl,
				tvalue,
				fs = 0,
				i, vtype;
				
			ctrl = me.down("[name=fontstyle]");
			tvalue = ctrl.getValue();
			
			if (tvalue && tvalue.cb_layout)
			{
				vtype = typeof(tvalue.cb_layout);
				
				if (vtype == "string")
				{
					tvalue = [tvalue.cb_layout];
				}
				else
				{
					tvalue = tvalue.cb_layout;
				}
				
				for (i=0; i < tvalue.length; i++)
				{
					switch (tvalue[i])
					{
					case "bold":
						fs = fs | IG$/*mainapp*/._IE3/*fontStyle*/.P_BOLD;
						break;
					case "italic":
						fs = fs | IG$/*mainapp*/._IE3/*fontStyle*/.P_ITALIC;
						break;
					case "underline":
						fs = fs | IG$/*mainapp*/._IE3/*fontStyle*/.P_UNDERLINE;
						break;
					}
				}
			}
			
			me.cstyle.fontstyle = fs;
			
			// ctrl.setValue({cb_layout: ["bold", "italic", "underline"]});
			ctrl = me.down("[name=" + me.htype + "textalign]");
			tvalue = ctrl.getValue();
			tvalue = (tvalue && tvalue["cb_" + me.htype + "textalign"]) ? tvalue["cb_" + me.htype + "textalign"] : "left";
			
			switch (tvalue)
			{
			case "right":
				tvalue = 6;
				break;
			case "center":
				tvalue = 5;
				break;
			default:
				tvalue = 4;
				break;
			}
			
			me.cstyle.textalign = tvalue;
			me.cstyle.nullvalue = me.down("[name=nullvalue]").getValue();
			me.cstyle.formatstring = me.down("[name=formatstring]").getValue();
			me.cstyle.cssname = me.down("[name=cssname]").getValue();
			me.cstyle.template = me.down("[name=template]").getValue();
			me.cstyle.fontsize = me.down("[name=fontsize]").getValue() || null;
			me.cstyle.paddingtop = me.down("[name=padtop]").getValue();
			me.cstyle.paddingbottom = me.down("[name=padbottom]").getValue();
			me.cstyle.paddingleft = me.down("[name=padleft]").getValue();
			me.cstyle.paddingright = me.down("[name=padright]").getValue();
			me.cstyle.forecolor = IG$/*mainapp*/.$gc/*getColorCode*/(me.down("[name=forecolor]").getValue());
			me.cstyle.backcolor = IG$/*mainapp*/.$gc/*getColorCode*/(me.down("[name=backcolor]").getValue());
			
			me.cstyle.bordercolor = IG$/*mainapp*/.$gc/*getColorCode*/(me.down("[name=bordercolor]").getValue());
			
			me.cstyle.bordertop = me.down("[name=bordertop]").getValue();
			me.cstyle.borderleft = me.down("[name=borderleft]").getValue();
			me.cstyle.borderbottom = me.down("[name=borderbottom]").getValue();
			me.cstyle.borderright = me.down("[name=borderright]").getValue();
			
			me.cstyle.borderouttop = me.down("[name=borderouttop]").getValue();
			me.cstyle.borderoutleft = me.down("[name=borderoutleft]").getValue();
			me.cstyle.borderoutbottom = me.down("[name=borderoutbottom]").getValue();
			me.cstyle.borderoutright = me.down("[name=borderoutright]").getValue();
			
			me.cstyle.autowidth = me.down("[name=autowidth]").getValue() == true ? "T" : "F";
			me.cstyle.columnwidth = me.down("[name=columnwidth]").getValue();
		}
	},
	
	fieldDefaults: {
		labelWidth: 90
	},
	
	initComponent : function() {
		var panel = this;
		
		$s.apply(panel, {
			items: [
				{
					xtype: 'checkboxgroup',
					name: 'fontstyle',
					fieldLabel: IRm$/*resources*/.r1('L_FONT_FACE'),
					plain: true,
					items: [
						{
							boxLabel: IRm$/*resources*/.r1('L_FONT_BOLD'), name: 'cb_layout', inputValue: 'bold', checked: false
						},
						{
							boxLabel: IRm$/*resources*/.r1('L_FONT_ITALIC'), name: 'cb_layout', inputValue: 'italic', checked: false
						},
						{
							boxLabel: IRm$/*resources*/.r1('L_FONT_UNDERLINE'), name: 'cb_layout', inputValue: 'underline', checked: false
						}
					]
				},
				{
					xtype: 'radiogroup',
					name: panel.htype + 'textalign',
					fieldLabel: IRm$/*resources*/.r1('L_FONT_ALIGNMENT'),
					plain: true,
					items: [
						{
							boxLabel: IRm$/*resources*/.r1('L_ALIGN_LEFT'), name: 'cb_' + panel.htype + 'textalign', inputValue: 'left', checked: false
						},
						{
							boxLabel: IRm$/*resources*/.r1('L_ALIGN_CENTER'), name: 'cb_' + panel.htype + 'textalign', inputValue: 'center', checked: false
						},
						{
							boxLabel: IRm$/*resources*/.r1('L_ALIGN_RIGHT'), name: 'cb_' + panel.htype + 'textalign', inputValue: 'right', checked: false
						}
					]
				},
				{
					fieldLabel: IRm$/*resources*/.r1('L_FONTSIZE'),
					name: "fontsize",
					flex: 1,
					xtype: 'textfield'
				},
				{
					fieldLabel: IRm$/*resources*/.r1('L_NULL_VALUE'),
					xtype: "textfield",
					name: "nullvalue"
				},
				{
					xtype: "textfield",
					name: "formatstring",
					fieldLabel: "Format String"
				},
				{
					xtype: "textfield",
					name: "cssname",
					fieldLabel: "CSS Class"
				},
				{
					xtype: "textarea",
					height: 60,
					name: "template",
					fieldLabel: "Template"
				},
				{
					xtype: "displayfield",
					value: "Ex: &lt;span style='font-family: fontawesome; color:#ff0000'&gt;&amp;#xf001;&lt;/span&gt;&lt;span&gt;TEXT&lt;/span&gt;"
				},
				{
					xtype: "fieldset",
					title: "Color Setting",
					collapsible: true,
					"layout": "anchor",
					items: [
						{
							xtype: "fieldcontainer",
							anchor: "100%",
							fieldLabel: IRm$/*resources*/.r1('L_FORE_COLOR'),
							"layout": "hbox",
							items: [
								{
									xtype: "textfield",
									name: "forecolor",
									width: 120
								},
								{
									xtype: "splitter"
								},
								{
									xtype: 'splitbutton',
									width: 30,
									menu: {
										showSeparator: false,
										items: [
											{
												xtype: "colorpicker",
												listeners: {
													select: function(cp, color) {
														var forecolor = this.down("[name=forecolor]");
														forecolor.setValue("#" + color);
													},
													scope: panel
												}
											}, 
											'-'
										]
									}
								}
							]
						},
						{
							xtype: "fieldcontainer",
							anchor: "100%",
							fieldLabel: IRm$/*resources*/.r1('L_BACK_COLOR'),
							"layout": "hbox",
							items: [
								{
									xtype: "textfield",
									name: "backcolor",
									width: 120
								},
								{
									xtype: "splitter"
								},
								{
									fieldLabel: IRm$/*resources*/.r1('L_BACK_COLOR'),
									xtype: 'splitbutton',
									menu: {
										showSeparator: false,
										items: [
											{
												xtype: "colorpicker",
												listeners: {
													select: function(cp, color) {
														var backcolor = this.down("[name=backcolor]");
														backcolor.setValue("#" + color);
													},
													scope: panel
												}
											}, 
											'-'
										]
									}
								}
							]
						},
						{
							xtype: "fieldcontainer",
							anchor: "100%",
							fieldLabel: IRm$/*resources*/.r1('L_BORDER_COLOR'),
							"layout": "hbox",
							hidden: true,
							items: [
								{
									xtype: "textfield",
									name: "bordercolor",
									width: 120
								},
								{
									xtype: "splitter"
								},
								{
									xtype: 'splitbutton',
									menu: {
										showSeparator: false,
										items: [
											{
												xtype: "colorpicker",
												listeners: {
													select: function(cp, color) {
														var bordercolor = this.down("[name=bordercolor]");
														bordercolor.setValue("#" + color);
													},
													scope: panel
												}
											}, 
											'-'
										]
									}
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Inner Border",
							hidden: true,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									fieldLabel: IRm$/*resources*/.r1('L_BORDER_RIGHT'),
									name: "borderright",
									xtype: 'numberfield',
									value: 1
								},
								{
									fieldLabel: IRm$/*resources*/.r1('L_BORDER_LEFT'),
									name: "borderleft",
									xtype: 'numberfield',
									value: 1
								},
								{
									fieldLabel: IRm$/*resources*/.r1('L_BORDER_TOP'),
									name: "bordertop",
									xtype: 'numberfield',
									value: 1
								},
								{
									fieldLabel: IRm$/*resources*/.r1('L_BORDER_BOTTOM'),
									name: "borderbottom",
									xtype: 'numberfield',
									value: 1
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Outer Border",
							hidden: true,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									fieldLabel: IRm$/*resources*/.r1('L_BORDER_RIGHT'),
									name: "borderoutright",
									xtype: 'numberfield',
									value: 1
								},
								{
									fieldLabel: IRm$/*resources*/.r1('L_BORDER_LEFT'),
									name: "borderoutleft",
									xtype: 'numberfield',
									value: 1
								},
								{
									fieldLabel: IRm$/*resources*/.r1('L_BORDER_TOP'),
									name: "borderouttop",
									xtype: 'numberfield',
									value: 1
								},
								{
									fieldLabel: IRm$/*resources*/.r1('L_BORDER_BOTTOM'),
									name: "borderoutbottom",
									xtype: 'numberfield',
									value: 1
								}
							]
						}
					]
				},
				{
					xtype: "fieldset",
					title: IRm$/*resources*/.r1('L_PADDING'),
					collapsible: true,
					"layout": "anchor",
					items: [
						{
							fieldLabel: IRm$/*resources*/.r1('L_PAD_TOP'),
							name: "padtop",
							xtype: 'numberfield'
						},
						{
							fieldLabel: IRm$/*resources*/.r1('L_PAD_LEFT'),
							name: "padleft",
							xtype: 'numberfield'
						},
						{
							fieldLabel: IRm$/*resources*/.r1('L_PAD_BOTTOM'),
							name: "padbottom",
							xtype: 'numberfield'
						},
						{
							fieldLabel: IRm$/*resources*/.r1('L_PAD_RIGHT'),
							name: "padright",
							xtype: 'numberfield'
						}
					]
				},
				{
					xtype: "fieldcontainer",
					"layout": "hbox",
					fieldLabel: IRm$/*resources*/.r1('L_COLUMN_WIDTH'),
					items: [
						{
							xtype: 'checkbox',
							boxLabel: IRm$/*resources*/.r1('L_AUTO_WIDTH'),
							name: "autowidth"
						},
						{
							xtype: 'numberfield',
							name: "columnwidth",
							minValue: 30,
							maxValue: 400
						}
					]
				}
			]
		});
		
		IG$/*mainapp*/._Id0/*styleEditor*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._Iff/*globalRepotStyle*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	
	layout: "fit",
	
	closable: false,
	resizable: true,
	
	width: 650,
	height: 500,
		
	callback: null,
	
	ig1/*ignoreBase*/: false,
	
	_IFd/*init_f*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			addr = "",
			pivotxml = (this._ILa/*reportoption*/ ? this._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(this._ILa/*reportoption*/) : "<smsg></smsg>");
		
		if (this._ILa/*reportoption*/)
		{
			addr = "<smsg><item uid='" + this._ILa/*reportoption*/.uid + "' option='styleinfo' active='" + this._IJa/*activeSheet*/ + "' theme_id='" + (ig$/*appoption*/.theme_id || "") + "'/></smsg>";
		}
		
		req.init(panel, 
			{
	            ack: "18",
				payload: addr,
				mbody: pivotxml
	        }, panel, panel.rs_sK2/*getStyleInfo*/, null);
		req._l/*request*/();
	},
	
	rs_sK2/*getStyleInfo*/: function(xdoc) {
		var me = this,
			tnode,
			tchild,
			i,
			styleitem,
			snode,
			dp = [],
			dpbase = [],
			stylemap = {},
			p, pname;
		
		me.cbaseselect = me.down("[name=basestyle]");
		me.stylelist = me.down("[name=stylelist]");
		
		me.styles = {};
		
		me.styles.app = [];
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/AppStyle/Styles/Default");
		
		if (tnode != null)
		{
			tchild = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < tchild.length; i++)
			{
				styleitem = new IG$/*mainapp*/._IF7/*clReportStyle*/(tchild[i], "appstyle", false);
				me.styles[styleitem.name] = styleitem;
				dpbase.push({name: styleitem.name});
			}
		}
		
		var appendStyle = function(tnode) {
			if (tnode != null)
			{
				var i,
					tchild,
					styleitem;
					
				tchild = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				
				for (i=0; i < tchild.length; i++)
				{
					styleitem = new IG$/*mainapp*/._IF7/*clReportStyle*/(tchild[i], "appstyle", true);
					me.styles[styleitem.name] = styleitem;
					dpbase.push({name: styleitem.name});
					
					if (styleitem.basestylename != null && me.styles[styleitem.basestylename])
					{
						styleitem._IFb/*applyBaseStyle*/(me.styles[styleitem.basestylename]);
					}
				}
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/AppStyle/Styles/Custom");
		
		appendStyle(tnode);
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/CubeStyle/Styles/Default");
		
		appendStyle(tnode);
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/CubeStyle/Styles/Custom");
		
		appendStyle(tnode);
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/stylemap");
		
		if (tnode)
		{
			tchild = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tchild.length; i++)
			{
				p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tchild[i]);
				pname = p.name + "_" + (p.rptseq || "0");
				stylemap[pname] = p.basename;
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/ReportStyle/Style/item");
		
		if (tnode != null)
		{
			tchild = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < tchild.length; i++)
			{
				styleitem = new IG$/*mainapp*/._IF7/*clReportStyle*/(tchild[i], "reportstyle", true);
				me.styles[styleitem.name + "_" + styleitem.rptseq] = styleitem;
				
				dp.push({name: styleitem.name, groupname: "Unit_" + styleitem.rptseq, rptseq: styleitem.rptseq});
				
				if (stylemap[styleitem.name + "_" + styleitem.rptseq])
				{
					styleitem.basestylename = stylemap[styleitem.name + "_" + styleitem.rptseq];
				}
				
				if (styleitem.basestylename != null && me.styles[styleitem.basestylename])
				{
					styleitem._IFb/*applyBaseStyle*/(me.styles[styleitem.basestylename]);
				}
			}
		}
		
		me.cbaseselect.store.loadData(dpbase);
		me.stylelist.store.loadData(dp);
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	Mb_6/*loadStyleData*/: function(stylename) {
		if (this.styles && this.styles[stylename])
		{
			var st = this.styles[stylename],
				seheader = this.down("[name=seheader]"),
				sedata = this.down("[name=sedata]"),
				basestyle = this.down("[name=basestyle]");
			
			this.editingstyle = st;
			
			this.ig1/*ignoreBase*/ = true;
			basestyle.setValue(st.basestylename || "");
			this.ig1/*ignoreBase*/ = false;
			
			seheader.Mb_6/*loadStyleData*/.call(seheader, st.hs/*headerstyle*/);
			sedata.Mb_6/*loadStyleData*/.call(sedata, st.ds/*datastyle*/);
		}
	},
	
	Mb_7/*updateStyleData*/: function() {
		if (this.editingstyle)
		{
			var seheader = this.down("[name=seheader]"),
				sedata = this.down("[name=sedata]"),
				basestyle = this.down("[name=basestyle]");
			
			this.editingstyle.basestylename = basestyle.getValue();
			seheader.Mb_7/*updateStyleData*/.call(seheader);
			sedata.Mb_7/*updateStyleData*/.call(sedata);
		}
	},
	
	Mb_8/*confirmChanges*/: function() {
		this.Mb_7/*updateStyleData*/();
		
		if (this._ILb/*sheetoption*/)
		{
			this._ILb/*sheetoption*/.itemstyle = [];
			for (var key in this.styles)
			{
				if (this.styles[key].itemtype == "reportstyle")
				{
					var st = this.styles[key];
					if (st.basestylename && this.styles[st.basestylename])
					{
						st.Mb_16/*removeBaseStyle*/.call(st, this.styles[st.basestylename]);
					}
					this._ILb/*sheetoption*/.itemstyle.push(st);
				}
			}
		}
		
		this.callback && this.callback.execute();
		
		this._IG0/*closeDlgProc*/();
	},
	
	uB/*updateBaseStyle*/: function() {
		var me = this,
			editingstyle = me.editingstyle,
			basestyle = me.down("[name=basestyle]"),
			bstyle = me.styles[basestyle.getValue()];
			
		if (bstyle && editingstyle)
		{
			var seheader = this.down("[name=seheader]"),
				sedata = this.down("[name=sedata]");
				
			editingstyle.Mb_15a/*forceBaseStyle*/(bstyle);
			
			seheader.Mb_6/*loadStyleData*/.call(seheader, editingstyle.hs/*headerstyle*/);
			sedata.Mb_6/*loadStyleData*/.call(sedata, editingstyle.ds/*datastyle*/);
		}
	},
	
	initComponent : function() {
		
		this.title = IRm$/*resources*/.r1("T_REPORT_STYLE");
		
		$s.apply(this, {
			defaults:{bodyStyle:"padding:5px"},
			
			items: [
				{
					xtype: "panel",
					"layout": {
						type: "hbox",
						align: "stretch"
					},
					
					items: [
						{
							title: "Style Items",
							"layout": "fit",
							flex: 1,
							items: [
								{
									xtype: "grid",
									name: "stylelist",
									features: [
										{
											ftype: "grouping",
											groupHeaderTpl: "Folder: {groupname} ({rows.length} items)"
										}
									],
									store: {
										sorters: ["name"],
										groupField: "groupname",
										fields: [
											"name", "groupname", "rptseq"
										],
										data: []
									},
									hideHeaders: true,
									columns: [
									    {
									    	text: IRm$/*resources*/.r1("B_NAME"),
						    				dataIndex: "name",
						    				tdCls: "igc-td-link",
						    				flex: 1
									    }
									],
									listeners: {
										itemclick: function(view, record, item, index, e) {
											this.Mb_7/*updateStyleData*/();	

		        							var bproc = false;
		        							var data = record.data;
		        							
		        							this.Mb_6/*loadStyleData*/(data.name + "_" + data.rptseq);
		        						},
		        						scope: this
		        					}
								}
							]
						},
						{
							xtype: "panel",
							"layout": {
								type: "vbox",
								align: "stretch"
							},
							flex: 2,
							items: [
								{
									xtype: "combobox",
									name: "basestyle",
									fieldLabel: "Base Style",
									queryMode: "local",
									displayField: "name",
									valueField: "name",
									editable: false,
									autoSelect: true,
									store: {
										fields: [
											{name: "name"}
										]
									},
									listeners: {
										change: function() {
											if (this.ig1/*ignoreBase*/ == false)
											{
												this.uB/*updateBaseStyle*/();
											}
										},
										scope: this
									}
								},
								{
									xtype: "tabpanel",
									"layout": "fit",
									plain: true,
									flex: 1,
									items: [
										new IG$/*mainapp*/._Id0/*styleEditor*/({
											title: "Data Style",
											name: "sedata",
											htype: "dt",
											flex: 1
										}),
										new IG$/*mainapp*/._Id0/*styleEditor*/({
											title: "Header Style",
											name: "seheader",
											htype: "hd",
											flex: 1
										})
									]
								}
							]
						}
					]
				}
			],
			buttons:[
				{
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						this.Mb_8/*confirmChanges*/();
					},
					scope: this
				}, 
				{
					text: IRm$/*resources*/.r1("B_CANCEL"),
					handler:function() {
						this.close();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function(ui) {
					this._IFd/*init_f*/();
				}
			}
		});
		
		IG$/*mainapp*/._I6d/*passwordMgr*/.superclass.initComponent.apply(this, arguments);
	}
});

