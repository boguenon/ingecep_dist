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
IG$/*mainapp*/._N12/*MainPanel*/ = $s.extend($s.panel, {
    margin: '0 0 0 0',
    resizeTabs: true,
    minTabWidth: 100,
    // tabWidth: 135,
    
    enableTabScroll: true,
    activeTab: 0,
	layout: {
		type: "card",
		deferredRender: false
	},
	
	deferredRender: false,
	
	tabPosition : 'top',
	removePanelHeader: true,

    plain: false,

    minTabWidth: undefined,
    maxTabWidth: undefined,
    
    customAddTab: function(uid, ext_panel) {
		var me = this,
			tab = me.getComponent(uid);
			
		if (tab)
		{
			IG$/*mainapp*/._I7e/*changeApp*/(2);
			me.setActiveTab(tab);
		}
		else
		{
			IG$/*mainapp*/._I7e/*changeApp*/(2);
			ext_panel.id = uid;
			tab = me.add(ext_panel);
			me.setActiveTab(tab);
		}
	},
	
    m1$7/*navigateApp*/: function(uid, itemtype, itemname, itemaddr, baddhistory, writable, option, toption) {
    	var key,
    		tab = this.getComponent(itemtype + "_" + uid);
    		
    	if (tab)
    	{
    		IG$/*mainapp*/._I7e/*changeApp*/(2);
    		
    		this.setActiveTab(tab);
    		
    		if (toption && tab.applyOption)
    		{
    			tab.applyOption.call(tab, toption);
    		}
    		else if (itemtype == "dashboard")
    		{
    			var teditor = this.getComponent("dashboardedit" + "_" + uid);
    			if (teditor)
    			{
    				if (tab.uid && tab.uid.length > 0)
		    		{
		   				tab.M1/*procRunDashboard*/.call(tab);
		    		}
    			}
    		}
    	}
    	else
    	{
    		var callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
					this.m1$7/*navigateApp*/(uid, itemtype, itemname, itemaddr, baddhistory, writable, option, toption);
				}),
				pitem = IG$/*mainapp*/._I61/*createAppPanel*/(uid, itemtype, itemname, itemaddr, writable, toption || null, callback);
    		
    		if (pitem)
    		{
    			pitem.address = itemaddr;
    			pitem.title = IG$/*mainapp*/._I28/*getTabTitle*/(itemname);
    			
    			if (option)
    			{
    				for (key in option)
    				{
    					pitem[key] = option[key];
    				}
    			}
    			
    			if (pitem.isWindow == true)
    			{
    				baddhistory = false;
    				pitem.title = IG$/*mainapp*/._I28/*getTabTitle*/(itemname) + " (" + IRm$/*resources*/.r1("D_" + itemtype.toUpperCase()) + ")";
    				
    				if (!IG$/*mainapp*/.ps[pitem.address])
    				{
    					IG$/*mainapp*/.ps[pitem.address] = pitem;
    					pitem.on("close", function() {
    						delete IG$/*mainapp*/.ps[pitem.address];
    					});
    					pitem.show();
    				}
    			}
    			else
    			{
    				IG$/*mainapp*/._I7e/*changeApp*/(2);
    				pitem.id = itemtype + "_" + uid;
    				var p = this.add(pitem);
    				this.setActiveTab(p);
    			}
    		}
    		else
    		{
    			baddhistory = false;
    		}
    	}
    	
    	if (baddhistory == true && uid && itemtype)
    	{
    		// lastHist = 'lang=' + useLocale + '&p1=' + itemtype + '&p2=' + uid;
    		lastHist = "&p1=" + itemtype + "&p2=" + uid;
    		setTimeout(function() {
    			hist.addHistory(lastHist);
    		}, 10);
    	}
    },
	
	i1/*initRecentVisit*/ : function(){
		var me = this,
			btn1 = $("#mbutton1"),
			idv_recitems = $("#idv_recitems"),
			welcome = $("#welcome"),
			items;
			
		me.mviewer = {
			mode: "recent",
			mrecenttext: btn1.text()
		};
		
		btn1.unbind("click");
		
		btn1.bind("click", function() {
			me.i1_1/*loadRecentVisit*/.call(me);
		});
		
		items = [
			{
				html: $("#main-getting-started", welcome),
				handler: function() {
					// IG$/*mainapp*/._I7e/*changeApp*/(3);
					IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_APP_WIZARD");
				}
			},
			{
				html: $("#main-navigator", welcome),
				handler: function() {
					IG$/*mainapp*/._I7e/*changeApp*/(1);
				}
			},
			{
				html: $("#main-features", welcome),
				handler: function() {
				}
			}
		];
		
		$.each(items, function(i, item) {
			if (item.html && item.html.length > 0 && item.handler)
			{
				item.html.bind("click", function() {
					item.handler();
				});
			}
		});
				
		me.iLL/*updateLoginInfo*/();
		
		me.i1_1/*loadRecentVisit*/();
	},
	
	ii1/*initAdminMenu*/: function() {
		var dmgr = IG$/*mainapp*/._n26/*dmgrmenu*/,
			dom = dmgr.body.dom,
			body = $(".ig-mgr-body", dom),
			cl = $(".ig-mgr-panel-close", dom),
			menus = ig$/*appoption*/.mainmenu.mainmenu,
			menu,
			i,
			li,
			tli,
			tul;
			
		body.empty();
		
		cl.bind("click", function() {
			IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_HOME");
		});
		
		if (!menus)
			return;
				
		$.each(menus, function(i, menu) {
			tul = $("<ul class='ig-mgr-group'></ul>").appendTo(body);
			
			menu.tul = tul;
			menu.tul.hide();
			
			menu.menus && $.each(menu.menus, function(j, m) {
				var li = $("<li class='ig-mgr-group-item " + (m.acls || "") + "'><h3>" + (IRm$/*resources*/.r1(m.rcs) || m.text) + "</h3><ul class='ig-mgr-menu'></ul></li>").appendTo(tul),
					tli = $(".ig-mgr-menu", li);
					
				$.each(m.items, function(k, mi) {
					var btn = $("<li class='ig-mgr-menu-item " + (mi.acls || "") + "'>" + (IRm$/*resources*/.r1(mi.rcs) || mi.text) + "</li>").appendTo(tli);
					btn.bind("click", function() {
						if (mi.handler)
						{
							mi.handler.call(this);
						}
						else if (mi.cmd == "logout")
						{
				    		IG$/*mainapp*/._I8a/*showLogout*/(new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/));
				    	}
				    	else if (mi.cmd)
				    	{
				    		IG$/*mainapp*/._I65/*procMenuCommand*/(mi.cmd);
				    	}
					});
				});
			});
		});
	},
	
	iLL/*updateLoginInfo*/: function() {
		var llogin = $("#last_login"),
			ltime,
			lmsg,
			viewport = IG$/*mainapp*/.__1/*viewport*/,
			logininfo = IG$/*mainapp*/._I83/*dlgLogin*/ ? IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/ : null,
			cur_login_user_id,
			cur_login_user_nm,
			cur_login_host,
			last_login_time,
			last_login_host;
		
		if (llogin && llogin.length > 0 && logininfo && IG$/*mainapp*/._I83/*dlgLogin*/.lastLogin)
		{
			last_login_time = $(".last_login_time", llogin);
			last_login_host = $(".last_login_host", llogin);
			cur_login_host = $(".cur_login_host", llogin);
			cur_login_user_id = $(".cur_login_user_id", llogin);
			cur_login_user_nm = $(".cur_login_user_nm", llogin);
			
			ltime = IG$/*mainapp*/._I83/*dlgLogin*/.lastLogin.lastaccesstime;
			cur_login_user_id.text(logininfo.u1);
			cur_login_user_nm.text(logininfo.username);
			
			if (ltime)
			{
				lmsg = IG$/*mainapp*/._I40/*formatDate*/(ltime);
				last_login_time.text(lmsg);
				last_login_host.text(IG$/*mainapp*/._I83/*dlgLogin*/.lastLogin.lastaccessaddr + ", " + IG$/*mainapp*/._I83/*dlgLogin*/.lastLogin.lastaccesshost);
				cur_login_host.text(IG$/*mainapp*/._I83/*dlgLogin*/.lastLogin.accessaddr + ", " + IG$/*mainapp*/._I83/*dlgLogin*/.lastLogin.accesshost);
			}
		}
	},
	
	i1_1/*loadRecentVisit*/: function() {
		var panel=this,
			idv_recitems = $("#idv_recitems"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel, 
			{
	            ack: "11",
	        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'bookmarks'})
	        }, panel, panel.rs_sK3/*loadContent*/, null, null);
		req._l/*request*/();
	},
	
	rs_sK3/*loadContent*/: function(xdoc) {
		var panel=this,
			idv_recitems = $("#idv_recitems"),
			i,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = (tnode) ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			items = [], item, col = 3, columns = [],
			tmap = {},
			coldiv;
		
		idv_recitems.empty();
		
		if (tnodes && tnodes.length > 0 && idv_recitems)
		{
			for (i=0; i < col; i++)
			{
				coldiv = $("<div class='recent-columns'></div>").appendTo(idv_recitems);
				coldiv.css({"width": (100 / col) + "%", "float": "left"});
				columns.push({
					div: coldiv,
					di: false
				});
			}
			
			for (i=0; i < tnodes.length; i++)
			{
				item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				if (tmap[item.uid])
				{
					 tmap[item.uid].fatype = item.fatype == "F" ? item.fatype : tmap[item.uid].fatype;
				}
				else
				{
					tmap[item.uid] = item;
					items.push(item);
				}
			}
			
			items.sort(function(a, b) {
				var c = 0;
				
				if (a.type != b.type)
				{
					c = (a.type > b.type) ? 1 : -1;
				}
				
				return c;
			});
			
			panel.shortcuts = {};
			
			var pgroup = 0,
				pgname;
				
			$.each(items, function(i, item) {
				var uc, 
					ul,
					tl;
				
				if (i == 0)
				{
					uc = columns[0];
					ul = uc.div;
					$("<div class='recent-itemtype'><span>" + IRm$/*resources*/.r1("D_" + item.type.toUpperCase()) + "</span></div>").appendTo(ul);
				}
				else if (pgname && pgname != item.type)
				{
					pgroup = (pgroup+1) % columns.length;
					uc = columns[pgroup];
					ul = uc.div;
					tl = $("<div class='recent-itemtype'><span>" + IRm$/*resources*/.r1("D_" + item.type.toUpperCase()) + "</span></div>").appendTo(ul);
					if (uc.di)
					{
						tl.css({marginTop: "20px"});
					}
				}
				else
				{
					uc = columns[pgroup];
					ul = uc.div;
				}
				
				uc.di = true;
				
				var li = $("<div class='recent-row' title='" + item.nodepath + "'></div>");
				var sp = $("<span " + (item.fatype == "F" ? "class='ig-fa-mark'" : "") + ">" + item.name + "</span>");
				sp.bind("click", function() {
					IG$/*mainapp*/._n1/*navigateMenu*/(item.uid);
				});
				
				li.append(sp);
				ul.append(li);
				
				pgname = item.type;
			});
		}
	},
	
	deferredRender : true,
	
	onAdd: function(item, index) {
		$s.tabpanel.prototype.onAdd.call(this, item, index);
	},
	
	//inherit docs
    initComponent: function() {
        var me = this,
            dockedItems = [].concat(me.dockedItems || []),
            activeTab = me.activeTab || (me.activeTab = 0),
            tabPosition = me.tabPosition,
            tbar;

        // Configure the layout with our deferredRender, and with our activeTeb
        me.layout = {
            owner: me,
            type: "card",
            deferredRender: me.deferredRender,
            itemCls: me.itemCls,
            activeItem: activeTab
        };

        /**
         * @property {Ext.tab.Bar} tabBar Internal reference to the docked TabBar
         */
		IG$/*mainapp*/._n12t/*mainPanelTabBar*/ = new $s.tabbar({
			xtype: "tabbar",
			ui: me.ui,
			dock: "top",
			id: "ig-tabbar",
			cls: "ig-main-tabbar",
			flex: 1,
			orientation: "horizontal",
			plain: true, //me.plain,
			cardLayout: me.layout,
			tabPanel: me,
			padding: 0,
			margin: 0,
			bodyPadding: 0,
			listeners: {
			}
		});
		
        me.tabBar = IG$/*mainapp*/._n12t/*mainPanelTabBar*/;

        IG$/*mainapp*/._N12/*MainPanel*/.superclass.initComponent.call(this);
        
        me.setActiveTab = function(card) {
        	IG$/*mainapp*/._I7e/*changeApp*/(2);
        	$s.tabpanel.prototype.setActiveTab.call(me, card);
        };
	    me.getActiveTab = $s.tabpanel.prototype.getActiveTab;
	    me.getTabBar = $s.tabpanel.prototype.getTabBar;
	    me.onItemEnable = $s.tabpanel.prototype.onItemEnable;
	    me.onItemDisable = $s.tabpanel.prototype.onItemDisable;
//	    me.onItemBeforeShow = Ext.tab.Panel.prototype.onItemBeforeShow;
//	    me.onItemIconChange = Ext.tab.Panel.prototype.onItemIconChange;
//	    me.onItemIconClsChange = Ext.tab.Panel.prototype.onItemIconClsChange;
//	    me.onItemTitleChange = Ext.tab.Panel.prototype.onItemTitleChange;
//	    me.doRemove = Ext.tab.Panel.prototype.doRemove;
	    me.onRemove = function(item, destroying) {
	    	$s.tabpanel.prototype.onRemove.call(me, item, destroying);
	    	
	    	var itemcnt = me.items.length;
        	
        	if (itemcnt == 0)
        	{
        		var explorer = IG$/*mainapp*/._IM3/*explorer*/;
        		IG$/*mainapp*/._I7e/*changeApp*/(IG$/*mainapp*/.__atab);
        	}
	    }
		
        // We have to convert the numeric index/string ID config into its component reference
		//  activeTab = me.activeTab = me.getComponent(activeTab);

        // Ensure that the active child's tab is rendered in the active UI state
        if (activeTab) {
            me.tabBar.setActiveTab(activeTab.tab, true);
        }
    },
    
	listeners: {
        beforeadd: function(tobj, comp, index, eopts) {
        	var me = this,
				tabbar = me.getTabBar(),
				maxtab = ig$/*appoption*/.maxtapcount || 0,
				atab;
				
			if (maxtab > 0 && me.items.length >= maxtab)
			{
				// tabbar.remove.call(tabbar, tabbar.items.items[0]);
				// me.setActiveTab(me.items.items[0]);
				atab = me.items.items[0];
				// me.setActiveTab(atab);
				me.remove(atab);
				//atab.close();
			}
        }
    }
});
// mecapp = null;

IG$/*mainapp*/._I67/*historyManager*/ = function() {
	this.addHistory = function (key) {
		unFocus.History.addHistory(key);
	};
	
	this.hasMenu = function() {
		var allhash = unFocus.History.getCurrent();
		if (allhash && allhash != "")
		{
			var basehash = allhash.split('&'),
				p1, p2, i, k, val, s, sa;
			
			for (i=0; i < basehash.length; i++)
			{
				sa = basehash[i];
				s = sa.indexOf("=");
				if (s > 0)
				{
					k = sa.substring(0, s);
					val = sa.substring(s+1);
					
					switch (k)
					{
					case "lang":
						break;
					case "p1":
						p1 = val;
						break;
					case "p2":
						p2 = val;
						break;
					}
				}
			}
			
			if (p1 && p2)
				return true;
		}
		
		return false;
	};
	
	this.historyListener = function() {
		var chash = unFocus.History.getCurrent();
		
		if (chash != null && chash != "" && IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/)
        {
        	IG$/*mainapp*/._n1/*navigateMenu*/(chash);
        }
		
		return chash;
	};
	
	unFocus.History.addEventListener('historyChange', this.historyListener);
}

IG$/*mainapp*/._n1/*navigateMenu*/ = function(allhash)
{
	if (allhash && allhash.length > 0 && lastHist != allhash)
	{
		if(IG$/*mainapp*/._I07/*checkUID*/(allhash))
		{
			p2 = allhash;
		}
		else
		{
			var basehash = allhash.split('&'),
				p1, p2, i, k, val, s, sa;
			
			for (i=0; i < basehash.length; i++)
			{
				sa = basehash[i];
				s = sa.indexOf("=");
				if (s > 0)
				{
					k = sa.substring(0, s);
					val = sa.substring(s+1);
					
					switch (k)
					{
					case "lang":
						break;
					case "p1":
						p1 = val;
						break;
					case "p2":
						p2 = val;
						break;
					}
				}
			}
		}
		
		if (p2)
		{
			IG$/*mainapp*/._n2/*navigateMenuByUID*/(p2, p1);
		}
	}
}

IG$/*mainapp*/._n2/*navigateMenuByUID*/ = function(uid, hashtype, param, bhist)
{
	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
	
	req.init(null, 
		{
            ack: "11",
            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "translate"})
        }, null, function(xdoc) {
        	var node = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
				itemuid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "uid"),
				typename = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "type").toLowerCase(),
				itemname = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "name"),
				itemaddr = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "nodepath"),
				writable = (IG$/*mainapp*/._I1b/*XGetAttr*/(node, "manage") == 'T' || IG$/*mainapp*/._I1b/*XGetAttr*/(node, "writable") == 'T') ? true : false,
				isexport = false; 
				
			if (typename == 'dashboard' && hashtype == 'dashboardedit')
			{
				typename = hashtype;
			}
			else if (typename == "export")
			{
				isexport = true;
				typename = "report";
			}
			
			if (isexport == true)
			{
				var doc = $(document),
					rmain = $("#main"),
					toption = {
						renderTo: rmain[0],
						minHeight: doc.height(),
						address: itemaddr,
						closable: false,
						_ts_: false,
						hiddenstatusbar: true,
						hiddentoolbar: true,
						header: false,
						title: IG$/*mainapp*/._I28/*getTabTitle*/(itemname)
					},
					option = null;
					
					pitem = IG$/*mainapp*/._I61/*createAppPanel*/(itemuid, typename, itemname, itemaddr, writable, toption);
					pitem.on({
						_lc0: function() {
							
						},
						_lc1: function() {
							var cs = pitem.calcSize.call(pitem);
							pitem.setSize(cs.width, cs.height);
						},
						resize: function(t, width, height, oldWidth, oldHeight, eOpts) {
							var dbody = $(document.body);
							
							IG$/*mainapp*/.x_10/*jqueryExtension*/._w(rmain, width);
							IG$/*mainapp*/.x_10/*jqueryExtension*/._h(rmain, height);
							IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dbody, width);
							IG$/*mainapp*/.x_10/*jqueryExtension*/._h(dbody, height);
						}
					});
					pitem.updateLayout();
					pitem.setSize(doc.width(), doc.height());
				
				rmain.css({minHeight: (doc.height() + "px")});
			}
			else
			{
				IG$/*mainapp*/._I7d/*mainPanel*/.m1$7/*navigateApp*/.call(IG$/*mainapp*/._I7d/*mainPanel*/, itemuid, typename, itemname, itemaddr, (typeof(bhist) == "undefined" ? true : bhist), writable, null, param);
			}
        }, null);
	req._l/*request*/();
}

var hist,
	lastHist;

IG$/*mainapp*/._I7e/*changeApp*/ = function(mode, opt) {
	var appsel = IG$/*mainapp*/.appsel,
		l = appsel.getLayout(),
		menus = ig$/*appoption*/.mainmenu.mainmenu,
		i, m,
		c,
		nindex = mode;
		
	switch (mode)
	{
	case 2:
		for (i=0; i < appsel.items.items.length; i++)
		{
			if (appsel.items.items[i].name == "_I7d")
			{
				nindex = i;
				break;
			}
		}
		break;
	}
	
	l.setActiveItem(nindex);
	
	c = l.getActiveItem();
	
	if (mode == 1 && opt)
	{
		c = c.down("[name=mexplorer]");
		c._IPd/*doSearch*/.call(c, opt);
	}
	
	if (mode != 2)
	{
		IG$/*mainapp*/.__atab = mode;
	}
	
	c._IQ4/*initComp*/ && c._IQ4/*initComp*/.call(c);
	
	if (mode == 4 && opt) {
		for (i=0; i < menus.length; i++)
		{
			m = menus[i];
			m.tul && m.tul[m.acls == opt ? "show" : "hide"]();
		}
	}
};

IG$/*mainapp*/.$1/*loadApp*/ = function(tmpl) {
	var viewport = IG$/*mainapp*/.__1/*viewport*/,
		mainview,
		mview,
		appmenu,
		navitab,
		ntree,
		tabbaritems,
		appselitems,
		appselactive = 0,
		tappmenu = ig$/*appoption*/.mainmenu.mainmenu,
		i;
		
	if (IG$/*mainapp*/.__1m/*viewportpanel*/ || IG$/*mainapp*/.__ep == true)
	{
		setTimeout(function(){
			$("#loading").fadeOut({
				complete: function() {
					$(this).remove();
				}
			});
			$("#loading-mask").fadeOut({
				complete: function() {
					$(this).remove();
				}
			});
		}, (IG$/*mainapp*/.__ep ? 0 : 100));
		
		return;
	}
	
	tmpl = tmpl || {};
	tmpl.mainview = mview = tmpl.mainview || {},
	mview.appmenu = appmenu = mview.appmenu || {};
	mview.navitab = navitab = mview.navitab || {},
	mview.navitree = ntree = mview.navitree || {};
	mview.intropanel = mintro = mview.intropanel || {};	
	navitab.tabhidden = navitab.tabhidden || "F";
	navitab.hidden = navitab.hidden || "F";
	ntree.hidden = ntree.hidden || "T";
	appmenu.bodyCls = typeof(appmenu.bodyCls) == "undefined" ? "idv-side-bar" : appmenu.bodyCls;
	appmenu.explorer = appmenu.explorer == "F" ? false : true;
	
	if (typeof(appmenu.html) == "undefined")
	{
		appmenu.html = "<div class='mainHeader'>"
			+ "<div id='innerLogo' class='innerLogo'>"
			+ "<span class='ig-c-text'>$APP_NAME</span>"
			+ "<div class='ig-c-button'></div>"
			+ "</div>"
			+ "<ul class='mainNav' id='mainNav'></ul>"
			+ "<div class='searchForm' id='searchForm'>"
			+ "<input type='text' id='tsearch' placeholder='Search' class='searchKeyword' maxlength='1000' autocomplete='off'></input>"
			+ "<span class='searchGo'></span>"
			+ "</div>"
			+ "</div>"
			+ "<ul class='mainFooter' id='mainFooter'>"
			+ "<li class='last'>$APP_COPY</li>"
			+ "</ul>";
	}
	
	IG$/*mainapp*/.__ep = mview.appmenu.printmode == "T";
	IG$/*mainapp*/.__ep_m = mview.appmenu.runmode ? parseInt(mview.appmenu.runmode) : 0;
	
	if (!appmenu.explorer && tappmenu)
	{
		for (i=0; i < tappmenu.length; i++)
		{
			if (tappmenu[i].acls == "ig_mnav")
			{
				tappmenu.splice(i, 1);
				break;
			}
		}
	}
	
	if (IG$/*mainapp*/.__ep_m < 1)
	{
		tabbaritems = [
			{
				xtype: "button",
				border: 0,
				hidden: navitab.hidden == "T",
				margin: "0", //"0 5 0 0",
				cls: "ig-top-button",
				overCls: "ig-top-button-over",
				focusCls: "ig-top-button-click",
				text: IRm$/*resources*/.r1("S_HOME"),
				handler: function() {
					IG$/*mainapp*/._I7e/*changeApp*/(0);
				}
			},
			{
				xtype: "button",
				border: 0,
				hidden: navitab.hidden == "T",
				text: IRm$/*resources*/.r1("S_NAVI"),
				cls: "ig-top-button",
				overCls: "ig-top-button-over",
				focusCls: "ig-top-button-click",
				margin: "0 5 0 0",
				handler: function() {
					IG$/*mainapp*/._I7e/*changeApp*/(1);
				}
			}
		];
	}
	
	appselitems = [
		{
			id:'welcome-panel',
			cls: mintro.cls || "",
			header: false,
			title: null, // 'Portal Main',
			autoLoad: {
				url: "./html/" + (ig$/*appoption*/.intropage || "navi_intro") + "_" + (window.useLocale || "en_US") + ".html", 
				callback: IG$/*mainapp*/._I7d/*mainPanel*/.i1/*initRecentVisit*/, 
				scope: IG$/*mainapp*/._I7d/*mainPanel*/
			},
			iconCls:'icon-welcome',
			autoScroll: true
		},
		{
			xtype: "container",
			layout: "fit",
			items: 
				IG$/*mainapp*/._I8e/*explorer*/ ? [
					new IG$/*mainapp*/._I8e/*explorer*/({
						name: "mexplorer",
						show_tree_items: ig$/*appoption*/.uiconfig && ig$/*appoption*/.uiconfig.navigator ? ig$/*appoption*/.uiconfig.navigator.show_tree_items : false
					})
				] : null
		},
		IG$/*mainapp*/._I7d/*mainPanel*/,
		{
			xtype: "panel",
			layout: "fit",
			bodyPadding: 20,
			items: [
				{
					xtype: "panel",
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "container",
							layout: "fit",
							flex: 1,
							name: "dwizard",
							autoScroll: true
						},
						{
							xtype: "container",
							layout: "fit",
							height: 40,
							name: "dwizard_bar"
						}
					]
				}
			]
		},
		{
			xtype: "panel",
			layout: "fit",
			bodyPadding: 0,
			items: [
				{
					xtype: "html",
					name: "dmgr",
					layout: "fit",
					autoScroll: true,
					autoLoad: {
						url: "./html/adm_menu_" + (window.useLocale || "en_US") + ".html", 
						callback: IG$/*mainapp*/._I7d/*mainPanel*/.ii1/*initAdminMenu*/, 
						scope: IG$/*mainapp*/._I7d/*mainPanel*/
					}
				}
			]
		}
	];
	
	if (navitab.items && navitab.items.length > 0)
	{
		$.each(navitab.items, function(i, btn) {
			var objpanel,
				objindex;
			
			if (btn.mtype == "navitab")
			{
				if (btn.type == "Dashboard" || btn.type == "Report")
				{
					objpanel = IG$/*mainapp*/._I61/*createAppPanel*/(btn.uid, btn.type.toLowerCase(), btn.name, null, false, {
						closable: false,
						header: false
					});
					
					appselitems.push(objpanel);
					
					objindex = appselitems.length - 1;
					
					if (appselactive == 0)
					{
						appselactive = objindex;
					}
					
					if (IG$/*mainapp*/.__ep_m < 1)
					{
						tabbaritems.push({
							xtype: "button",
							border: 0,
							text: btn.name,
							cls: "ig-top-button",
							overCls: "ig-top-button-over",
							focusCls: "ig-top-button-click",
							margin: "0 5 0 0",
							handler: function() {
								IG$/*mainapp*/._I7e/*changeApp*/(objindex);
							},
							scope: this
						});
					}
				}
			}
		});
	}
	
	if (IG$/*mainapp*/.__ep_m > 0)
	{
		appselitems.splice(0, 2);
		appselactive = 0;
	}
	
	if (IG$/*mainapp*/.__ep_m < 1)
	{
		tabbaritems.push(IG$/*mainapp*/._n12t/*mainPanelTabBar*/);
	}
	
	IG$/*mainapp*/.__atab = appselactive;
	
	mainview = new $s.panel({
        "layout":'border',
		padding: '0 0 0 0',
		
        items:[ 
        	{
	        	xtype: "panel",
	        	width: appmenu.width || 223, // 40, // 223,
	        	ig_width_o: Number(appmenu.o_width) || 223,
	        	ig_width_c: Number(appmenu.c_width) || 30,
	        	height: appmenu.height || null,
	        	// minWidth: 208,
	        	region: appmenu.region || "west",
	        	name: "appmenu",
	        	collapsible: false,
	        	collapsed: false,
	        	titleCollapse: false,
	        	hidden: appmenu.hidden == "T",
	        	// split:true,
	        	header: false,
	        	border: false,
	        	margins: "0 0 0 0",
	        	collapseMode: "mini",
	        	bodyCls: appmenu.bodyCls || "",
	        	html: appmenu.html,
	        	listeners: {
	        		afterrender: function(tobj) {
	        			var dom = $(tobj.body.dom),
	        				obj = $("#mainFooter", dom),
	        				searchGo = $(".searchGo", dom),
	        				tsearch = $("#tsearch", dom);
	        				
	        			obj.css("position", "absolute");
	        			
	        			tsearch.bind("keyup", function(e) {
	        				if (e.keyCode == 13)
	        				{
	        					var m = IG$/*mainapp*/.__1m/*viewportpanel*/, 
	        						mp, 
	        						k = $(this).val();
	        						
	        					if (ntree.hidden == "F")
	        					{
	        						mp = m.down("[name=mexplorer]");
	        							
	        						if (mp)
	        						{
	        							mp._IPd/*doSearch*/.call(mp, k);
	        						}
	        					}
	        					else
	        					{
	        						IG$/*mainapp*/._I7e/*changeApp*/(1, k);
	        					}
	        				}
	        			});
	        			
	        			searchGo.bind("click", function() {
	        				var m = IG$/*mainapp*/.__1m/*viewportpanel*/, 
        						mp, 
        						k = $(tsearch).val();
        						
        					if (ntree.hidden == "F")
        					{
        						mp = m.down("[name=mexplorer]");
        							
        						if (mp)
        						{
        							mp._IPd/*doSearch*/.call(mp, k);
        						}
        					}
        					else
        					{
        						IG$/*mainapp*/._I7e/*changeApp*/(1, k);
        					}
	        			});
	        		},
	        		resize: function(tobj, width, height, oldWidth, oldHeight, eOpts) {
	        			var smode = (width < 120) ? true : false,
	        				el = $(this.body.dom),
	        				mainFooter = $("#mainFooter", el),
	        				innerLogo = $("#innerLogo", el),
	        				searchForm = $("#searchForm", el),
	        				s = smode ? "hide" : "show";
	        				
	        			mainFooter[s]();
	        			$(".ig-c-text", innerLogo)[s]();
	        			searchForm[s]();
	        		}
	        	}
	        },
	        {
	        	xtype: "panel",
	        	region: "west",
	        	width: 200,
	        	border: 0,
	        	hidden: ntree.hidden == "T",
	        	border: false,
	        	margins: "0 0 0 0",
	        	collapseMode: "mini",
	        	split: true,
	        	header: false,
	        	collapsible: true,
				titleCollapse: false,
	        	layout: "fit",
	        	items: ntree.hidden == "F" ? 
		        	[
		        		new IG$/*mainapp*/._I8e/*explorer*/({
		        			name: "mexplorer",
		        			vmode: "tree",
		        			flex: 1,
		        			split: false,
		        			show_tree_items: true
						})
		        	]
		        	:
		        	null
	        },
	        {
	        	xtype: "container",
	        	region: "center",
	        	border: 0,
	        	layout: "border",
	        	items: [
	        		{
		        		xtype: "container",
		        		region: "north",
		        		//name: "abc_",
		        		height: 28,
		        		hidden: navitab.tabhidden == "T",
		        		padding: "2 2 2 2",
		        		layout: {
		        			type: "hbox",
		        			align: "stretch"
		        		},
		        		items: 
		        			tabbaritems
		        		
		        	},
		        	{
			        	xtype: "container",
			        	layout: "card",
			        	name: "appsel",
			        	region: "center",
			        	minTabWidth: 40,
						deferredRender: false,
						activeItem: appselactive,
			        	items: appselitems
			        }
	        	]
	        }
		]
    });
    
    viewport.add(mainview);
    
    IG$/*mainapp*/._IM3/*explorer*/ = viewport.down("[name=mexplorer]");

    mainview.doLayout();
    
    IG$/*mainapp*/.__1m/*viewportpanel*/ = mainview;
    IG$/*mainapp*/._I8d/*appmenu*/ = mainview.down("[name=appmenu]");
    
    IG$/*mainapp*/.appsel = mainview.down("[name=appsel]");
    IG$/*mainapp*/._n25/*dwizard*/ = {
    	dwizard: mainview.down("[name=dwizard]"),
    	dwizard_bar: mainview.down("[name=dwizard_bar]")
    };
    
    IG$/*mainapp*/._n26/*dmgrmenu*/ = mainview.down("[name=dmgr]");
    
	setTimeout(function(){
        $("#loading").fadeOut({
			complete: function() {
				$(this).remove();
			}
		});
		$("#loading-mask").fadeOut({
			complete: function() {
				$(this).remove();
			}
		});
        
        // IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_APP_LOADED"), null, null, 0, "success");
        
        if (IG$/*mainapp*/.__ep_l)
        {
        	IG$/*mainapp*/._n2/*navigateMenuByUID*/(IG$/*mainapp*/.__ep_l, undefined, undefined, false);
        }
        
    }, (IG$/*mainapp*/.__ep ? 0 : 50));
}

$s.ready(function(){
    $("#lpt", "#loading").css("width", "80%");

	webix.ui.fullScreen();
    
    if (!webix.env.touch && webix.ui.scrollSize)
        webix.CustomScroll.init();
    
    if (ig$/*appoption*/.timer_ping && ig$/*appoption*/.timer_ping > 100)
    {
    	setInterval(function() {
    		var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
			lreq.init(null,
				{
					ack: "34",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
					mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
				}, null, function(xdoc) {

				}, false);
			lreq._l/*request*/();
    	}, ig$/*appoption*/.timer_ping);
    }
    
	IRm$/*resources*/.r2/*loadResources*/({
		func: function() {
			$("#lpt", "#loading").css("width", "100%");
			
			setTimeout(function() {
				var i,
					copt;
	    		IG$/*mainapp*/.lE/*loadExtend*/.rcsloaded = true;
	    		
			    IG$/*mainapp*/._I7d/*mainPanel*/ = new IG$/*mainapp*/._N12/*MainPanel*/({
			    	name: "_I7d"
			    });
			    		    
			    IG$/*mainapp*/._I7d/*mainPanel*/.on('tabchange', function(tp, tab){
			        // api.selectClass(tab.cclass); 
			    });
			    
			    copt = {
					closeText: IRm$/*resources*/.r1("L_C_CLOSE"),
					prevText: IRm$/*resources*/.r1("L_C_PREV"),
					nextText: IRm$/*resources*/.r1("L_C_NEXT"),
					currentText: IRm$/*resources*/.r1("L_C_CUR"),
					monthNames: IRm$/*resources*/.r1("L_C_M_NAMES").split("#"),
					monthNamesShort: IRm$/*resources*/.r1("L_C_M_NAMES_S").split("#"),
					dayNames: IRm$/*resources*/.r1("L_C_D_NAMES").split("#"),
					dayNamesShort: IRm$/*resources*/.r1("L_C_D_NAMES_S").split("#"),
					dayNamesMin: IRm$/*resources*/.r1("L_C_D_NAMES_M").split("#"),
					weekHeader: IRm$/*resources*/.r1("L_C_W_H"),
					firstDay: 0,
					isRTL: false,
					showMonthAfterYear: true,
					yearSuffix: IRm$/*resources*/.r1("L_C_YR_SFX")
				};
				
				$.datepicker.setDefaults(copt);
				
				IG$/*mainapp*/.r_cl_lc/*calendar_locale*/ = copt;
			    
			    IG$/*mainapp*/._IM3/*explorer*/ = null;
			    
			    
			    $.each(IG$/*mainapp*/.lE/*loadExtend*/.items, function(i, obj) {
			    	IG$/*mainapp*/.extend(obj.name, obj.base, obj.option);
			    });
			    
			    $.each(IG$/*mainapp*/._IE1/*filteropcodes*/, function(i, obj) {
			    	var l = obj[4];
			    	obj[1] = IRm$/*resources*/.r1(l);
			    });
			    
				var viewport = new $s.viewport({
			        "layout": "fit",
			        id: 'mainview'
				});
				
				viewport.doLayout();
				
				IG$/*mainapp*/.__1/*viewport*/ = viewport;
			
				// var logout = $('<a href="javascript:IG$/*mainapp*/._I8a/*showLogout*/(new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/));" style="padding:5px; color: #989898">Logout</a>');
				// $('#loginInst').empty();
				// $('#loginInst').append(logout);
				
				var uid = $.cookie("lui") || "";
				var upd = "";
					
				IG$/*mainapp*/._I88/*createLoginPanel*/(uid, upd, true);
				IG$/*mainapp*/._I14/*loadMapData*/();
				
				// alert("Check login status");
				
				var req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(null, 
					{
				        ack: "11",
			            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
			            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "ls", mts: (window.m$mts || ""), lang: (window.useLocale || "")})
				    }, null, 
				    function(xdoc){
				    	//check out server login proc
				    	//var xmlmessage = IG$/*mainapp*/._I25/*toXMLString*/(xdoc),
				    	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg'),
				    		islogin = false;
				    	
				    	if (tnode)
				    	{
				    		var uuid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'uuid');
				    		
				    		if (uuid)
				    		{
				    			islogin = true;
				    			IG$/*mainapp*/._I83/*dlgLogin*/.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/);
				    			IG$/*mainapp*/._I83/*dlgLogin*/.uuid = uuid; 
				    			IG$/*mainapp*/._I83/*dlgLogin*/.mts = {
				    				sid: IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "mts"),
				    				name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "mts_name")
				    			};
				    			
				    			IG$/*mainapp*/._g$a/*global_mts*/ = IG$/*mainapp*/._I83/*dlgLogin*/.mts.sid; 
				    			
				    			if (window.m$mts && IG$/*mainapp*/._I83/*dlgLogin*/.mts.name != window.m$mts && IG$/*mainapp*/._I83/*dlgLogin*/.mts.sid != window.m$mts)
				    			{
				    				IG$/*mainapp*/._I8a/*showLogout*/(new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/));
				    				return;
				    			}
				    			
				    			IG$/*mainapp*/._I83/*dlgLogin*/.lastLogin = {
				    				lastaccesstime: IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "lastaccesstime"),
				    				lastaccesshost: IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "lastaccesshost"),
				    				lastaccessaddr: IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "lastaccessaddr"),
				    				accesshost: IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "accesshost"),
									accessaddr: IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "accessaddr"),
									accesstime: IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "accesstime")
				    			};
				    			
				    			if (IG$/*mainapp*/._I7d/*mainPanel*/)
				    			{
				    				IG$/*mainapp*/._I7d/*mainPanel*/.iLL/*updateLoginInfo*/.call(IG$/*mainapp*/._I7d/*mainPanel*/);
				    			}
				    			
				    			IG$/*mainapp*/._I83/*dlgLogin*/.Js4/*getUserDetail*/.call(IG$/*mainapp*/._I83/*dlgLogin*/, false);
				    		
				    			hist = new IG$/*mainapp*/._I67/*historyManager*/();
				    			
				    			hist.historyListener();
				    			
				    			if (typeof window.callPhantom === "function") {
						    		window.callPhantom({_proc: "C"});
						    	}
				    		}
				    	}
				    	
				    	if (islogin == false)
				    	{
				    		IG$/*mainapp*/._I89/*showLogin*/(new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/), 0);
				    	}
				    },
				    function(xdoc){
				    	IG$/*mainapp*/._I89/*showLogin*/(new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/), 0);
				    	return true;
				    });
				
				req._l/*request*/();
				
			}, (IG$/*mainapp*/.__ep ? 10 : 30));
		}
	});
});

IG$/*mainapp*/._n5/*mec_sesst*/ = function() {
	var session = ig$/*appoption*/.session,
		t = ig$/*appoption*/.session_expire * 60,
		inrequest = false,
		reqtimer = -1;
	
	if (session)
	{
		$(document).bind("mousemove", function() {
			session.count = 0;
			
			if (inrequest == false)
			{
				if (reqtimer > -1)
				{
					clearTimeout(reqtimer);
					reqtimer = -1;
				}
				
				reqtimer = setTimeout(function() {
					inrequest = true;
					var req = new IG$/*mainapp*/._I3e/*requestServer*/();
					req.init(null, 
						{
				            ack: "11",
			                payload: "<smsg><item mode='write'/></smsg>",
				            mbody: "<smsg><info option='wake'></info></smsg>"
				        }, null, function(xdoc) {
				        	inrequest = false;
				        	session.count = 0;
				        }, null);
					req._l/*request*/();
				}, 2000);
			}
		});
		
		session.timer = setInterval(function() {
			var r = t - session.count,
				disp = "",
				mm = 0,
				m;
			
			if (r > 60)
			{
				mm = Math.floor(r / 60);
				m = r - (mm * 60);
			}
			else
			{
				m = r;
			}
			
			if (mm > 0)
			{
				disp = mm + " min " + m + " sec";
			}
			else
			{
				disp = m + " sec";
			}
			
			if (r < 300)
			{
				session.text.addClass("warn-sess-timer");
			}
			else
			{
				session.text.removeClass("warn-sess-timer");
			}
			
			session.text.html(disp);
			
			if (r < 0)
			{
				clearInterval(session.timer);
				IG$/*mainapp*/._I8a/*showLogout*/(new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/));
			}
			
			session.count += 1;
		}, 1000);
	}
}

IG$/*mainapp*/.sPPL/*refreshMessages*/ = function () {
	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
	
	req.init(null, 
		{
            ack: "11",
            payload: IG$/*mainapp*/._I2f/*getObjAddress*/({mode: 'read'}),
            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'rsn', readmode: 0})
        }, null, IG$/*mainapp*/.rs_sPPL/*refreshMessages*/, function(errcode) {return true;});
    req.showerror = false;
	req._l/*request*/();
}

IG$/*mainapp*/.rs_sPPL/*refreshMessages*/ = function (xdoc) {
	var i, thtml, prop, nmax,
		chatsublist = $("#chatsublist"),
		rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
		cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(rnode);
	
	if (cnodes && cnodes.length > 0 && IG$/*mainapp*/.L_SPPL)
	{
		prop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[0]);
		if (prop["msgid"] == IG$/*mainapp*/.L_SPPL)
		{
			return;
		}
	}
	
	chatsublist.empty();
	chatsublist.append($("<li class='view'><span><a href='javascript:f$7(\"CMD_RSN\")'>Write Message</a></span></li>"));
	
	if (cnodes && cnodes.length > 0)
	{
		nmax = Math.min(5, cnodes.length);
		
		if (IG$/*mainapp*/.L_SPPL)
		{
			$("#alertstext").text("Messages (New)");
		}
		
		for (i=0; i < nmax; i++)
		{
			// <a href="#" class="delete">X</a>
			prop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[i]);
			if (i == 0)
			{
				IG$/*mainapp*/.L_SPPL = prop["msgid"];
			}
			thtml = "<li><a href='#' class='delete'>X</a><p><span style='color:#0000ff;'>" + (prop["username"] || "") + ": </span><br>" + IG$/*mainapp*/._I24/*getTextContent*/(cnodes[i]) + " <br><span style='color:#4d4d4d; font-size: 9px; float: right'>(" + (IG$/*mainapp*/._I43/*getFormattedDate*/(prop["updatedate"], true) || "") + ")</span></p></li>";
			chatsublist.append($(thtml));
		}
	}
}

IG$/*mainapp*/._I8c/*setWeb3TopMenu*/ = function() {
	if (!IG$/*mainapp*/._I8d/*appmenu*/)
		return;
		
	var appmenu = IG$/*mainapp*/._I8d/*appmenu*/,
    	appmenu_el = $(appmenu.body.dom),
    	mainFooter = $("#mainFooter", appmenu_el),
    	mainNav = $("#mainNav", appmenu_el),
    	innerLogo = $("#innerLogo", appmenu_el),
    	menus = ig$/*appoption*/.mainmenu,
    	i,
    	menuroles = ig$/*appoption*/.fm/*features*/,
    	cbtn = $(".ig-c-button", innerLogo);
	
	cbtn.unbind("click");
	cbtn.bind("click", function() {
		var w = appmenu.getWidth();
			
		if (w < 150)
		{
			appmenu_el.removeClass("igc-t-collapsed");
			appmenu.setWidth(appmenu.ig_width_o);
		}
		else
		{
			appmenu_el.addClass("igc-t-collapsed");
			appmenu.setWidth(appmenu.ig_width_c);
		}
	});
	if (menus)
	{
		if (menus.footmenu)
		{
			for (i=0; i < menus.footmenu.length; i++)
			{
				if (menus.footmenu[i].html)
				{
					menus.footmenu[i].html.remove();
					menus.footmenu[i].html = null;
				}
			}
			
			$.each(menus.footmenu, function(i, m) {
				var mdiv = $("<li" + (m.acls ? " class='" + m.acls + "'" : "") + "><span>" + (m.rcs ? IRm$/*resources*/.r1(m.rcs) : m.text) + "</span></li>");
				mainFooter.prepend(mdiv);
				mdiv.bind("click", function() {
					if (m.handler)
					{
						m.handler.call(this);
					}
					else if (m.cmd == "logout")
					{
			    		IG$/*mainapp*/._I8a/*showLogout*/(new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/));
			    	}
			    	else if (m.cmd)
			    	{
			    		IG$/*mainapp*/._I65/*procMenuCommand*/(m.cmd);
			    	}
			    });
			    m.html = mdiv;
			});
		}
		
		if (menus.mainmenu && menuroles)
		{
			for (i=0; i < menus.mainmenu.length; i++)
			{
				if (menus.mainmenu[i].html)
				{
					menus.mainmenu[i].html.remove();
					menus.mainmenu[i].html = null;
				}
			}
			
			$.each(menus.mainmenu, function(i, m) {
				var n;
				
				if (m.acls && menuroles[m.acls] == true)
				{
					return;
				}
				
				var tmenu = $("<li class='" + (m.acls || "") + "'></li>").appendTo(mainNav),
					tmenu_title = $("<span class='parent'>" + (m.rcs ? IRm$/*resources*/.r1(m.rcs) : m.text) + "</span>").appendTo(tmenu),
					gf;
				
				if (menuroles[m.acls] === false)
				{
					tmenu.show();
				}
				
				if (m.cmd)
				{
					IG$/*mainapp*/._I65/*procMenuCommand*/(cmd);
				}
				else if (m.handler)
				{
					gf = function(ev) {
						var p = {
								x: ev.pageX,
								y: ev.pageY
							},
							flyout = $(".flyout"),
							im = false;
						
						$.each(menus.mainmenu, function(i, ms) {
							var html = ms.html,
								os,
								box;
							
							if (html && im == false)
							{
								os = html.offset();
								box = {
									x: os.left,
									y: os.top,
									w: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(html),
									h: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(html)
								};
								
								if (box.x < p.x && p.x < box.x + box.w && box.y < p.y && p.y < box.y + box.h)
								{
									im = true;
								}
							}
						});
						
						if (im == false)
						{
							$.each(menus.mainmenu, function(i, ms) {
								
								ms.sv = 0;
							});
						}
						
						flyout.hide();
						$(document).unbind("mouseup", gf);
					}
					
					tmenu_title.bind("click", function(e) {
						var flyout = $(".flyout", tmenu),
							v = 1,
							sv;
							
						if (flyout && flyout.length > 0)
						{
							sv = m.sv;
							$(".flyout").hide();
							
							$.each(menus.mainmenu, function(i, ms) {
								if (ms != m)
								{
									ms.sv = 0;
								}
							});
							
							if (sv)
							{
								m.sv = 0;
								v = 1;
							}
							else
							{
								m.sv = 1;
								flyout.show();
								$(document).bind("mouseup", gf);
								v = 0;
							}
						}
						
						if (v == 1)
						{
							m.handler();
						}
					});
				}
				
				m.html = tmenu;
				
				if (m.menus)
				{
					if (m.type == "column")
					{
						var t = $("<div class='flyout'><h3><span class='rightRaquoBlue'>" + (m.rcs ? IRm$/*resources*/.r1(m.rcs) : m.text) + "</span></h3></div>").appendTo(tmenu),
							cr = $("<div class='colwrapper'>").appendTo(t);
						
						$.each(m.menus, function(j, sm) {
							var c = $("<div class='column" + (sm.acls ? " " + sm.acls : "") + "'><h6>" + (sm.rcs ? IRm$/*resources*/.r1(sm.rcs) : sm.text) + "</h6></div>").appendTo(cr);
							
							if (sm.type == "list")
							{
								var tul = $("<ul class='" + (sm.acls || "") + "'></ul>").appendTo(c);
								
								$.each(sm.items, function(k, si) {
									$("<li class='chevronLink" + (si.acls ? " " + si.acls : "") + "'><span>" + (si.rcs ? IRm$/*resources*/.r1(si.rcs) : si.text) + "</span></li>").appendTo(tul).bind("click", function() {
										if (si.cmd)
										{
											IG$/*mainapp*/._I65/*procMenuCommand*/(si.cmd);
										}
									});
								});
							}
							else if (sm.type == "image")
							{
								var timg,
									tdiv;
							 	timg = sm.src && $("<img src='" + sm.src + "'></img>").appendTo(c);
							 	tdiv = sm.desc && $("<h3>" + sm.desc + "</h3>").appendTo(c);
							 	
							 	if (sm.cmd)
							 	{
							 		timg.bind("click", function() {
							 			IG$/*mainapp*/._I65/*procMenuCommand*/(sm.cmd);
							 		});
							 		
							 		tdiv.bind("click", function() {
							 			IG$/*mainapp*/._I65/*procMenuCommand*/(sm.cmd);
							 		});
							 	}
							}
						});
					}
				}
			});
		}
		
		if (menus.afterrender)
		{
			menus.afterrender.call(this, menus);
		}
	}
    
    // IG$/*mainapp*/.tM/*activateMenu*/(tmenu, "CMD_HOME");
    
    // $("<div class='flyout'><h3><span class='rightRaquoBlue'>Home</span></h3><div class='colwrapper'><div class='column'><h6>Explorer</h6><ul><li class='chevronLink'><span>Home</span></li><li class='chevronLink'><span>Explorer</span></li><li class='chevronLink'><span>Open tabs</span></li></ul></div><div class='column'><h6>Explorer</h6><ul><li><span>Tab</span></li></ul></div><div class='column'><h6>Home</h6><ul><li><span>test1</span></li></ul></div></div></div>").appendTo(tmenu);
    
    // tmenu = $("<li><span class='parent'>Browser</span></li>").appendTo(mainNav);
    // IG$/*mainapp*/.tM/*activateMenu*/(tmenu, "CMD_BROWSER");
    
    // tmenu = $("<li><span class='parent'>Open Items</span></li>").appendTo(mainNav);
    // IG$/*mainapp*/.tM/*activateMenu*/(tmenu, "CMD_TABPANEL");
}

IG$/*mainapp*/._I8b/*showLoginProc*/ = function() {
	var lform = $('#loginWindow'),
		uid = $("#userid");
	lform.hide();
	
	IG$/*mainapp*/._IM3/*explorer*/ && IG$/*mainapp*/._IM3/*explorer*/._IQ3/*initData*/.call(IG$/*mainapp*/._IM3/*explorer*/);
	
	lastHist = null;
	if (!hist)
	{
		hist = new IG$/*mainapp*/._I67/*historyManager*/();
	}
	hist.historyListener();
	
	if (uid && uid.length > 0)
		uid[0].value = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.u1/*userid*/;
	
	// top menu for classic top down
	// IG$/*mainapp*/._n4/*setTopMenu*/();
	
	// top menu for new style
	
	if (!IG$/*mainapp*/.__ep)
	{
		IG$/*mainapp*/._I8c/*setWeb3TopMenu*/();
		IG$/*mainapp*/._I7d/*mainPanel*/.i1/*initRecentVisit*/.call(IG$/*mainapp*/._I7d/*mainPanel*/);
	}
	
	// var ischecked = $.cookie("wizard");
	
	// if (ischecked != "F" && hist.hasMenu() == false)
	// {
	// 	if ((window.ig$/*appoption*/ && window.ig$/*appoption*/.onload_show_wizard != false) || ischecked == "T")
	// 	{
	// 		IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_APP_WIZARD");
	// 	}
	// }
}

IG$/*mainapp*/["showLoginProc"] = IG$/*mainapp*/._I8b/*showLoginProc*/;


$.fn.adjustPanel = function(){ 
	$(this).find("ul, .subpanel").css({ 'height' : 'auto'}); //Reset subpanel and ul height
	
	var windowHeight = $(window).height(); //Get the height of the browser viewport
	var panelsub = $(this).find(".subpanel").height(); //Get the height of subpanel	
	var panelAdjust = windowHeight - 100; //Viewport height - 100px (Sets max height of subpanel)
	var ulAdjust =  panelAdjust - 25; //Calculate ul size after adjusting sub-panel (27px is the height of the base panel)
	
	if ( panelsub >= panelAdjust ) {	 //If subpanel is taller than max height...
		$(this).find(".subpanel").css({ 'height' : panelAdjust }); //Adjust subpanel to max height
		$(this).find("ul").css({ 'height' : ulAdjust}); //Adjust subpanel ul to new size
	}
	else if ( panelsub < panelAdjust ) { //If subpanel is smaller than max height...
		$(this).find("ul").css({ 'height' : 'auto'}); //Set subpanel ul to auto (default size)
	}
};

function loadFooterCtrl() {
	//Execute function on load
	$("#chatpanel").adjustPanel(); //Run the adjustPanel function on #chatpanel
	$("#alertpanel").adjustPanel(); //Run the adjustPanel function on #alertpanel
	
	//Each time the viewport is adjusted/resized, execute the function
	$(window).resize(function () {
	    $("#chatpanel").adjustPanel();
	    $("#alertpanel").adjustPanel();
	});
	
	//Click event on Chat Panel and Alert Panel	
	$("#chatpanel a:first, #alertpanel a:first").click(function() { //If clicked on the first link of #chatpanel and #alertpanel...
	    if($(this).next(".subpanel").is(':visible')){ //If subpanel is already active...
	        $(this).next(".subpanel").hide(); //Hide active subpanel
	        $("#idv-mnu-pnl li a").removeClass('active'); //Remove active class on the subpanel trigger
	        $("#alertstext").text("Messages");
	    }
	    else { //if subpanel is not active...
	        $(".subpanel").hide(); //Hide all subpanels
	        $(this).next(".subpanel").toggle(); //Toggle the subpanel to make active
	        $("#idv-mnu-pnl li a").removeClass('active'); //Remove active class on all subpanel trigger
	        $(this).toggleClass('active'); //Toggle the active class on the subpanel trigger
	    }
	    return false; //Prevent browser jump to link anchor
	});
	
	//Click event outside of subpanel
	$(document).click(function() { //Click anywhere and...
	    $(".subpanel").hide(); //hide subpanel
	    $("#idv-mnu-pnl li a").removeClass('active'); //remove active class on subpanel trigger
	});
	$('.subpanel ul').click(function(e) {
	    e.stopPropagation(); //Prevents the subpanel ul from closing on click
	});
	
	//Show/Hide delete icons on Alert Panel
	$("#alertpanel li").hover(function() {
	    $(this).find("a.delete").css({'visibility': 'visible'}); //Show delete icon on hover
	},function() {
	    $(this).find("a.delete").css({'visibility': 'hidden'}); //Hide delete icon on hover out
	});
}

