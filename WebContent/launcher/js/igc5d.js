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
IG$/*mainapp*/._I98_/*naviTree*/ = $s.extend($s.treepanel, {
	xtype: "treepanel",
	showtoolbar: false,
	customMenu: null,
	cubebrowse: false,
	_IH9/*customParseXmlOwner*/: null,
	_IHa/*customParseXmlFunc*/: null,
	_IHb/*customEventOwner*/: null,
	_IHc/*customClickFunc*/: null,
	_IHC/*customDoubleClickFunc*/: null,
	
	enabledrag: true,
	
	ntritem: null,
	ntrnode: null,
	ntrseq: 0,
	border: 0,
	
	region: "west",
    split:true,
    header: false,
    collapsible: true,
    rootVisible:true,
    lines:false,
    animCollapse:false,
    animate: true,
    collapseMode:"mini",
    
    collapseFirst:false,
    singleExpand: false,
    
	selectedNode: [],
	
	_IHd/*navigateTree*/: function(dt) {
		var me = this,
			root = me.getRootNode(),
			rpath = root.get("nodepath");
		
		me.ntritem = dt;
		me.ntrnode = root;
		me.ntrseq = 1;
		
		if (rpath && dt.nodepath.indexOf(rpath) > -1)
		{
			me.ntrseq = rpath.split("/").length;
		}
		
		me._IHe/*navigateTreeOpen*/();
	},
	
	_IHe/*navigateTreeOpen*/: function() {
		var cpath = this.ntritem.nodepath || this.ntritem,
			cp = cpath.split("/"),
			cname, i, node,
			seq = this.ntrseq,
			pnode = this.ntrnode;
		
		if (pnode && cp.length > seq)
		{
			cname = cp[seq];
			
			for (i=0; i < pnode.childNodes.length; i++)
			{
				node = pnode.childNodes[i];
				if (node.data.name == cname)
				{
					if (node.isLeaf() == false)
					{
						this.ntrnode = node;
						this.ntrseq++;
						
						node.expand(false, this._IHe/*navigateTreeOpen*/, this);
						
						if (node.get("nodepath") == cpath)
						{
							this.getSelectionModel().select(node);
						}
					}
					else
					{
						this.ntrnode = null;
						this.ntrseq = 0;
						
						this.getSelectionModel().select(node);
					}
					break;
				}
			}
		}
	},
	
	_I90/*createMetaObject*/: IG$/*mainapp*/._I90/*createMetaObject*/,
	r_I90/*createMetaObject*/: IG$/*mainapp*/.r_I90/*createMetaObject*/,
	_I91/*renameMetaObject*/: IG$/*mainapp*/._I91/*renameMetaObject*/,
	r_I91/*renameMetaObject*/: IG$/*mainapp*/.r_I91/*renameMetaObject*/,
	
	_IHf/*deleteMetaObject*/: IG$/*mainapp*/._IHf/*deleteMetaObject*/,
	r_IHf/*deleteMetaObject*/: IG$/*mainapp*/.r_IHf/*deleteMetaObject*/,
	
	_II0/*setObjectAuth*/: function(uid, itemtype) {
		var dlgpop;
		dlgpop = new IG$/*mainapp*/._Ic7/*objectAuth*/({uid: uid, itemtype: itemtype});
		dlgpop.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.r_II0/*setObjectAuth*/);
		
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgpop);
	},
	
	r_II0/*setObjectAuth*/: function() {
		
	},
	
	_II1/*moveSelectedItems*/: function() {
		var panel = this,
			i,
			address = "<smsg>",
			itemcnt = 0,
			item,
			req,
			cpath,
			record,
			mpath;
			
		if (panel.selectedNode.length > 0)
		{
			var u5x/*treeOptions*/ = {};
			// cubebrowse: true,
			// rootuid: this.item.cubeuid
			
			for (i=0; i < panel.selectedNode.length; i++)
			{
				item = panel.selectedNode[i];
				if (item.data.type.toLowerCase() == "help")
				{
					u5x/*treeoptions*/.rootuid = panel.rootuid;
				}
				mpath = item.data.nodepath.substring(0, item.data.nodepath.lastIndexOf("/"));
				if (i == 0)
				{
					record = item.parentNode;
					cpath = mpath;
					
					var pnode = record;
	            	
	            	while (pnode)
	            	{
	            		var dtype = pnode.data.type.toLowerCase();
	            		if (dtype == "cube" || dtype == "mcube" || dtype == "datacube" || dtype == "nosql" || dtype == "mdbcube" || dtype == "sqlcube")
	            		{
	            			u5x/*treeoptions*/.cubebrowse = true;
	            			u5x/*treeoptions*/.rootuid = pnode.data.uid;
	            			break;
	            		}
	            		
	            		pnode = pnode.parentNode;
	            	}
				}
				
				if (cpath != mpath)
				{
					itemcnt = 0;
					IG$/*mainapp*/._I52/*ShowError*/("One subfolder content is allowed to move.", panel);
					break;
				} 
				else if (item.data.manage == "T" || item.data.writable == "T")
				{
					address += "<item uid='" + item.data.uid + "'/>";
					itemcnt++;
				}
				else
				{
					itemcnt = 0;
					IG$/*mainapp*/._I52/*ShowError*/("Privilege error on content", panel);
					break;
				}
			}
			
			if (itemcnt > 0)
			{
				address += "</smsg>";
				
				var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
					mode: "select",
					targetobj: "folder",
					visibleItems: "folder",
					u5x/*treeOptions*/: u5x/*treeOptions*/
				});
				dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.r_II1/*moveSelectedItems*/, [address, record]);
				IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
			}
		}
	},
	
	r_II1/*moveSelectedItems*/: function(item, params) {
		var req,
			address = params[0],
			record = params[1],
			panel = this;
		
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "11",
                payload: address,
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "move", target: item.uid})
	        }, panel, panel.r_II2/*moveSelectedItems*/, null, record);
		req._l/*request*/();
	},
	
	r_II2/*moveSelectedItems*/: function(xdoc, record) {
		var panel = this;
		panel._I92/*refreshNode*/(record);
		panel.selectedNode = [];
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Moved items successfully", null, panel, 0, "success");
	},
	
	_II3/*removeSelectedItems*/: function() {
		var panel = this,
			i,
			address = "<smsg>",
			itemcnt = 0,
			item,
			req;
		if (panel.selectedNode.length > 0)
		{
			for (i=0; i < panel.selectedNode.length; i++)
			{
				item = panel.selectedNode[i];
				if (item.data.manage == "T" || item.data.writable == "T")
				{
					address += "<item uid='" + item.data.uid + "'/>";
					itemcnt++;
				}
				else
				{
					itemcnt = 0;
					IG$/*mainapp*/._I52/*ShowError*/("Privilege error on content", panel);
					break;
				}
			}
			
			if (itemcnt > 0)
			{
				address += "</smsg>";
				
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(panel, 
					{
			            ack: "30",
		                payload: address,
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "delete"})
			        }, panel, panel.r_IHf/*deleteMetaObject*/, null);
				req._l/*request*/();
			}
		}
	},
	
	
	
	filterTree: function(t, e){
		
	},
		
	_I92/*refreshNode*/: function(node) {
		var unode = node,
			panel = this;
		if (node.isLeaf() == true)
		{
			unode = node.parentNode;
		}
		
		panel.selectedNode = [];
		this.getSelectionModel().select(unode);
		unode.dirty = true;
		unode.data.loaded = false;
		unode.data.expanded = false;
		// unode.removeAll(true);
		
		while (unode.firstChild)
		{
			unode.removeChild(unode.firstChild);
		}
		
		unode.expand(false);
		panel.doComponentLayout();
	},
	
	_II5/*refreshTopNode*/: function() {
		this.selectedNode = [];
		this.workspaceMenu && this.workspaceMenu.removeAll();
		this.owner && this.owner.workspaceMenu && this.owner.workspaceMenu.removeAll();
		var rnode = this.getRootNode();
		// this.setScrollTop(0);
		this.setPosition(0, 0);
		this.getSelectionModel().select(rnode);
		rnode.dirty = true;
		rnode.data.loaded = false;
		rnode.data.expanded = false;
		// rnode.removeAll(false);
		while (rnode.firstChild)
		{
			rnode.removeChild(rnode.firstChild);
		}
		rnode.expand(false);
	},
	
	_II6/*appendRootWorkspace*/: function(value) {
		var root = this.getRootNode(),
			Model = this.store.model,
			i,
			record,
			bfound = false;
		
		for (i=0; i < root.childNodes.length; i++)
		{
			if (root.childNodes[i].data.uid == value.uid)
			{
				bfound = true;
				break;
			}
		}
		
		if (bfound == false)
		{
    		record = new Model(value);
    		record.raw = value;
    		root.appendChild(record);
		}
	},
	
	_II7/*pasteMetaObject*/: function(record) {
    	var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		this.setLoading(true);
		
		req.init(panel, 
			{
	            ack: "31",
	        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({pid: record.get("uid"), address: IG$/*mainapp*/.cb/*clipboard*/.uid}, "pid;address"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'copy'})
	        }, panel, panel.r_II7/*pasteMetaObject*/, null, record);
		req._l/*request*/();
    },
    
    r_II7/*pasteMetaObject*/: function(xdoc, record) {
    	this._I92/*refreshNode*/(record);
    },
    
    _I8f/*prepareCustomMenu*/: IG$/*mainapp*/._I8f/*prepareCustomMenu*/,
	
	_II8/*mangaeFolder*/: function(rec) {
		var dlg = new IG$/*mainapp*/._Ic6/*folderManagerWin*/({
			root: {
				uid: rec.get("uid"),
				name: rec.get("name"),
				type: rec.get("type")
			}
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	},
	
	_I93/*exportMeta*/: function(meta) {
		var me = this;
		me.meta = meta;
		IG$/*mainapp*/._I55/*confirmMessages*/("ExportMeta", "Would you download meta to share on other server?", me.do__I93/*exportMeta*/, me, me);
	},
	
	do__I93/*exportMeta*/: function(dlg) {
		var panel = this,
			meta = panel.meta,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		if (meta && dlg == "yes")
		{
			req.init(panel, 
				{
		            ack: "5",
	                payload: "<smsg><item" + IG$/*mainapp*/._I20/*XUpdateInfo*/({uid: meta.uid, nodepath: meta.nodepath, name: meta.name, type: meta.type}, "uid;nodepath;name;type", "s") + "/></smsg>",
	                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({output: "file"})
		        }, panel, panel.r_I93/*exportMeta*/, null);
			req._l/*request*/();
		}
	},
	
	r_I93/*exportMeta*/: function(xdoc) {
		var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			fpath, filename;
		
		if (tnode)
		{
			fpath = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "luid");
			filename = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "filename");
			
			if (fpath && filename)
			{
				$.download(ig$/*appoption*/.servlet, [
					{name: "ack", value: "35"},
					{name: "_mts_", value: IG$/*mainapp*/._g$a/*global_mts*/ || ""},
    				{name: "payload", value: fpath},
    				{name: "mbody", value: filename}
    			], 'POST');
			}
		}
	},
	
	initComponent: function(){
    	var me = this,
    		columns = [],
    		tbarobj; 
    	
    	if (me.cubebrowse == true)
		{
			columns = [
				{
		            xtype: "treecolumn", //this is so we know which column will show the tree
		            text: IRm$/*resources*/.r1("B_NAME"),
		            flex: 2,
		            sortable: false,
		            dataIndex: "name",
		            renderer: function(value, metadata, record) {
						return "<span title='" + record.get("nodepath") + "'>" + (record.get("lname") || record.get("name")) + "</span>";
					}
		        }
		    ];
		}
		else
		{
			columns = [
				{
		            xtype: "treecolumn", //this is so we know which column will show the tree
		            text: IRm$/*resources*/.r1("B_NAME"),
		            flex: 2,
		            sortable: false,
		            dataIndex: "name",
		            renderer: function(value, metadata, record) {
						return "<span title='" + record.get("nodepath") + "'>" + (record.get("lname") || record.get("name")) + "</span>";
					}
		        }
		    ];
		}
		
		tbarobj = [
            {
            	iconCls: "icon-refresh",
            	tooltip: IRm$/*resources*/.r1("L_REFRESH"),
            	handler: function() {
            		var me = this;
            		me._II5/*refreshTopNode*/();
            	},
            	scope: this
            }
        ];
        
        if (me.showtoolbar == true)
        {
            tbarobj.push("->");
        }
    	
    	$s.apply(this, {
    		enableDragDrop: true,
    		enableDD: true,
    		useArrows: true,
    		ddGroup: "_I$RD_G_",
    		hideHeaders: true,
    		hiddenPkgs: [],
    		columns: columns,
    		
    		store: {
	        	xtype: "treestore",
	        	fields: [
					"uid", "nodepath", "address", "description", "manage", "memo", "name", "type", "writable", "lname", "locale"
				],
			    customParseOwner: this._IH9/*customParseXmlOwner*/,
				customParseFunc: this._IHa/*customParseXmlFunc*/
			},
    		
    		customMenu: new $s.menu({
	        	items: []
	        }),
	        selModel: {
	        	selection: "treemodel",
				mode: "MULTI"
			},
			viewConfig: me.enabledrag ? {
				plugins: {
					ptype: "gridviewdragdrop",
					dragGroup: "_I$RD_G_"
				},
				listeners: {
					drop: function(node, data, dropRec, dropPosition) {
						var dropOn = dropRec ? " " + dropPosition + " " + dropRec.get("name") : " on empty view";
					}
				}
			} : null,
			
			tbar: this.showtoolbar ? Ext.create("Ext.toolbar.Toolbar", {
	        	items: tbarobj
	        }) : null,
	        
	        listeners: {
	        	afterrender: function(tobj) {
	        		var rnode, root = {
					    name: tobj.rootname || IRm$/*resources*/.r1("B_WORKSPACE"),
					    expanded: true,
					    address: "/",
					    type: "Root",
					    uid: tobj.rootuid || ""
					};
					
					me.__l/*loaded*/ = 1;
					
					if (me.rootuid == "none")
						return;

					setTimeout(function() {
						rnode = tobj.setRootNode(root);
						rnode.expand();
						
						if (me.initpath)
						{
							me._IHd/*navigateTree*/.call(me, me.initpath);
						}
					}, 20);
	        	},
				beforeitemcontextmenu: function(view, record, item, index, e) {
					e.stopEvent();
					
					// if (this.customMenu)
					//{
					var x = e.pageX,
						y = e.pageY,
						
						t = e.getTarget();
						
					var mvisible = this._I8f/*prepareCustomMenu*/(record);
					
					if (mvisible == true)
					{
						this.customMenu.showBy(t);
					}
					
					return false;
				},
				
				itemclick: function(view, record, item, index, e) {
		        	var bproc = false;
		        	var data = record.data;
		        	
		        	if (e.target.nodeName == "INPUT")
		        		return;
		        	
		        	if (this._IHb/*customEventOwner*/ && this._IHc/*customClickFunc*/)
		        	{
		        		bproc = this._IHc/*customClickFunc*/.call(this._IHb/*customEventOwner*/, data);
		        	}
		        	
		        	if (bproc == false)
		        	{
			        	var typename = data.type.toLowerCase(),
			        		itemname = data.name,
			        		itemaddr = data.nodepath,
			        		itemuid = data.uid,
			        		writable = (data.writable == "T" || data.manage == "T") ? true : false,
			        		manageable = (data.manage == "T") ? true : false,
			        		issubcube = data.issubcube;
			    		
			    		if (this.cubebrowse == true)
			    		{
			    			e.stopEvent && e.stopEvent();
			    			return;
			    		}
			        	
			        	if (typename == "igccustom") {
			        		var m = window.igc_custom_menus.menuitems[itemuid];
			        		
			        		if (m && m.handler)
			        		{
			        			m.handler.call(window, m);
			        		}
			        	}
				    	else if (record.isLeaf() == true) {
				    		e.stopEvent();
				    		
				    		if (this.mainPanel)
				    		{
				    			this.mainPanel.m1$7/*navigateApp*/.call(this.mainPanel, itemuid, typename, itemname, itemaddr, true, writable);
				    		}
				    	}
				    }
		        },
		        
		        itemdblclick: function(tobj, record, item, index, e, eopts) {
		        	e.stopPropagation();
		        	
		        	if (this._IHb/*customEventOwner*/ && this._IHC/*customDoubleClickFunc*/)
		        	{
		        		bproc = this._IHC/*customDoubleClickFunc*/.call(this._IHb/*customEventOwner*/, record);
		        	}
		        },
		        
		        beforeitemexpand: function(node, eopts) {
					var me = this,
						ltype = node.get("type"),
						mtype,
						luid = node.get("uid");
						
					if (node.isRoot())
		        	{
		        		if (me.rootuid && me.rootuid != "none")
		        		{
		        			addr = IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.rootuid});
		        		}
		        		else if (luid && luid.length > 0)
		        		{
		        			addr = IG$/*mainapp*/._I2d/*getItemAddress*/({uid: luid});
		        		}
		        		else
		        		{
		        			addr = IG$/*mainapp*/._I2d/*getItemAddress*/({uid: "/", type: "Workspace"});
		        		}
		        	}
		        	else
		        	{
		        		addr = IG$/*mainapp*/._I2d/*getItemAddress*/({uid: luid});
		        		
		        		if (!(node.childNodes.length > 0 && node.childNodes[0].get("type") == "load"))
		        		{
		        			return;
		        		}
		        	}
		        	
		        	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
					
					me.__l/*loaded*/ && me.setLoading(true);
					
					node.removeAll();
					
					req.init(me, 
						{
				            ack: "5",
				            payload: addr,
				            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
				        }, me, function(xdoc) {
				        	var root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
				        		nodes = root ? IG$/*mainapp*/._I26/*getChildNodes*/(root) : null,
				        		i, p, typename, memo,
				        		ishidden,
				        		dt = [];
				        		
				        	if (nodes)
				        	{
					        	for (i=0; i < nodes.length; i++)
					        	{
					        		p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(nodes[i]);
					        		p.text = p.name;
					        		p.address = p.uid;
					        		
								    typename = p.type.toLowerCase();
								    memo = p.memo.toLowerCase();
								    
								    ishidden = (!me.visibleItems || (me.visibleItems && me.visibleItems.indexOf(typename + ";") > -1)) ? 0 : 1;
								    
								    if (ishidden)
								    	continue;
								    	
								    if (memo == "PRIVATE" && typename == "workspace" && IG$/*mainapp*/._I83/*dlgLogin*/.jS2/*isAdmin*/ == true && me.workspaceMenu)
									{
										wmenu = me.workspaceMenu;
										wmenu.add({
							    			text: p.name,
							    			tvalue: p,
							    			treepanel: me,
							    			handler: function() {
												me._II6/*appendRootWorkspace*/.call(me, p);
											}
										});
										
										continue;
									}
								    
								    if (/(cube|mcube|metrics|folder|datacube|rfolder|datemetric|nosql|mdbcube|sqlcube|javapackage)/.test(typename) == true && typename != "cubemodel")
							    	{
							    		p.leaf = false;
							    	}
							    	else if (typename == "help")
							    	{
							    		p.leaf = true;
							    		var locale = ig$/*appoption*/.useLocale || "en_US",
							    			localetext = p["title_" + locale];
							    		
							    		if (localetext)
							    		{
							    			p.name = Base64.decode(localetext) || p.name;
							    		}
							    	}
							    	else if (/(folder|workspace|datemetric|javapackage)/.test(typename) == false)
							    	{
							    		p.leaf = true;
							    		p.allowDrag = true;
							    	}
							    	
							    	if (!p.leaf)
							    	{
							    		p.loaded = false;
							    		p.expanded = false;
							    		p.children = [
							    			{
							    				type: "load",
							    				name: "Wait while get data"
							    			}
							    		];
							    	}
							    	
							    	p.iconCls = IG$/*mainapp*/._I11/*getMetaItemClass*/(typename, memo);
							    	dt.push(p);
					        	}
					        }
					        
					        IG$/*mainapp*/._I10/*sortMeta*/(dt);
					        
				        	dt.length && node.appendChild(dt);
				    	}
				    );
				    
				    req._l/*request*/();
				}
			}
    	});
		
        IG$/*mainapp*/._I98_/*naviTree*/.superclass.initComponent.call(this);
    }
});

IG$/*mainapp*/._Ic5/*naviTreeHelpDoc*/ = $s.extend(IG$/*mainapp*/._I98_/*naviTree*/, {
	_I8f/*prepareCustomMenu*/: function(record) {
		var menu = this.customMenu,
			data = record.data,
			typename = data.type.toLowerCase(),
    		itemname = data.name,
    		itemaddr = data.nodepath,
    		itemuid = data.uid,
    		writable = (data.writable == "T" || data.manage == "T") ? true : false,
    		manageable = (data.manage == "T") ? true : false,
    		issubcube = data.issubcube,
    		cubemenu,
    		
			mvisible = false;
			
		menu.removeAll();
		
		switch (typename)
		{
		case "workspace":
			menu.add(
			    {
			    	text: IRm$/*resources*/.r1("B_FOLDER"),
			    	handler: function() {
			    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    }
			);
			break;
		case "root":
		case "folder":
			menu.add(
				{
					text: IRm$/*resources*/.r1("B_FOLDER"),
			    	handler: function() {
			    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
				},
				{
					text: IRm$/*resources*/.r1("L_RENAME_ITEM", itemname),
					handler: function() {
						this._I91/*renameMetaObject*/.call(this, itemname, itemuid, itemaddr, record);
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1("L_DELETE_ITEM", itemname),
					handler: function() {
						this._IHf/*deleteMetaObject*/.call(this, itemuid);
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1("L_NEW_DOCUMENT"),
			    	handler: function() {
			    		this._I90/*createMetaObject*/.call(this, "Help", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
				}
			);
			break;
		case "help":
			menu.add(
				{
					text: IRm$/*resources*/.r1("L_RENAME_ITEM", itemname),
					handler: function() {
						this._I91/*renameMetaObject*/.call(this, itemname, itemuid, itemaddr, record);
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1("L_DELETE_ITEM", itemname),
					handler: function() {
						this._IHf/*deleteMetaObject*/.call(this, itemuid);
					},
					scope: this
				}
			);
			break;
		}
		
		return true;
	}
});

IG$/*mainapp*/._I98/*naviTree*/ = $s.extend($s.panel, {
	
	setRootNode: function(values) {
		var me = this;
		
		me.sinp.val("");
		me.m_c.getLayout().setActiveItem(0);
		me.m_0.store.setRootNode.call(me.m_0.store, values);
	},
	
	getRootNode: function() {
		return this.m_0.getRootNode();
	},
	
	_a/*doSearch*/: function() {
		var me = this,
			skey = me.sinp.val(),
			m_1 = me.m_1,
			req,
			tuid,
			rnode = me.m_0.getRootNode();
		
		if (skey)
		{
			m_1.store.loadData([]);
			me.m_c.getLayout().setActiveItem(1);
			
			tuid = rnode.get("uid");
			
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "11",
		        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: tuid}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "search", name: skey, pid: tuid, metatypes: "Metric;CustomMetric;Measure;MeasureFormula;Report;Datemetric;Folder"})
		        }, me, function(xdoc) {
		        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/result"),
		        		tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
		        		i, dp = [], p;
		        		
		        	if (tnodes)
		        	{
		        		for (i=0; i < tnodes.length; i++)
		        		{
		        			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
		        			p.ltype = p.type.toLowerCase();
							p.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(p.ltype);
		        			dp.push(p);
		        		}
		        		
		        		m_1.store.loadData(dp);
		        	}
		        }, null);
			req._l/*request*/();
		}
		else
		{
			me.m_c.getLayout().setActiveItem(0);
		}
	},
	
	initComponent: function() {
		var me = this;
		
		$s.apply(this, {
			layout: {
				type: "vbox",
				align: "stretch"
			},
			items: [
				{
					xtype: "container",
					layout: {
						type: "hbox",
						pack: "center"
					},
					height: 30,
					hidden: me._search != true,
					items: [
						{
							html: "<div class='igc-search'></div>",
							name: "m_search",
							height: 30,
							border: 0,
							flex: 1,
							margin: "3 0 0"
						},
						{
							xtype: "button",
						    type: "refresh",
						    margin: "4 2 0",
						    iconCls: "icon-refresh",
						    tooltip: "Refresh",
						    handler: function(event, toolEl, panelHeader) {
						    	var me = this,
						    		m_0 = me.down("[name=m_0]"),
						    		values = {},
						    		mroot = m_0.getRootNode(),
						    		suid = me.rootuid == "none" ? null : (me.rootuid || null);
						    		
						    	if (!suid && mroot && mroot.get("uid"))
						    	{
						    		suid = mroot.get("uid");
						    	}
						    		
								values.type = (me.reportmode == "rolap") ? "Cube" : "Metric";
								values.name = values.type;
								values.nodepath = values.type;
								values.uid = suid;
									
								values.leaf = false;
						
								m_0.setRootNode.call(m_0, values);
								
								m_0.getRootNode().expand();
						    },
						    scope: this
						}
					]
				},
				{
					xtype: "panel",
					flex: 1,
					layout: "card",
					name: "m_c",
					defaults: {
						deferredRender: false
					},
					items: [
						new IG$/*mainapp*/._I98_/*naviTree*/({
							name: "m_0",
							border: 0,
							rootuid: me.rootuid,
							rootuid: me.rootuid,
							initpath: me.initpath,
							mainPanel: me.mainPanel,
							showtoolbar: me.showtoolbar,
							cubebrowse: me.cubebrowse,
							showcheckselect: me.showcheckselect,
							_IH9/*customParseXmlOwner*/: me._IH9/*customParseXmlOwner*/,
							_IHa/*customParseXmlFunc*/: me._IHa/*customParseXmlFunc*/,
							
							ddGroup: me.ddGroup,
							enabledrag: me.enabledrag,
							
							_IHb/*customEventOwner*/: me._IHb/*customEventOwner*/,
							_IHc/*customClickFunc*/: me._IHc/*customClickFunc*/,
							_IHC/*customDoubleClickFunc*/: me._IHC/*customDoubleClickFunc*/,
							checkStateChanged: me.checkStateChanged,
							visibleItems: me.visibleItems
						}),
						{
							xtype: "gridpanel",
							name: "m_1",
							emptyText: IRm$/*resources*/.r1("L_EMPTY"),
							viewConfig: {
								plugins: {
									ptype: "gridviewdragdrop",
									ddGroup: me.ddGroup,
									enabledrag: me.enabledrag
								}
							},
							store: {
								fields: [
									"uid", "name", "type", "nodepath", "iconcls", "lname"
								]
							},
							columns: [
								{
									// xtype: "templatecolumn",
									text: IRm$/*resources*/.r1("B_NAME"),
									flex: 1,
									minWidth: 160,
									tdCls: "ig-navi-namecol",
									// tpl: "<div class='ig-navi-itemicon {iconcls}'></div><span title='{nodepath}'>{name}</span>"
									renderer: function(value, metadata, record) {
										return "<div class='ig-navi-itemicon " + (record.get("iconcls") || "") + "'></div><span title='" + (record.get("nodepath") || "") + "'>" + (record.get("lname") || record.get("name")) + "</span>";
									}
								}
							],
							listeners: {
								itemclick: function(tobj, record, item, index, e, eopts) {
									var me = this;
									if (record.get("type") == "Folder")
									{
										me.m_c.getLayout().setActiveItem(0);
										me.m_0._IHd/*navigateTree*/.call(me.m_0, {
											uid: record.get("uid"),
											nodepath: record.get("nodepath"),
											type: record.get("type")
										});
									}
								},
								scope: this
							}
						}
					]
				}
			]
		});
		
		me.on("afterrender", function(tobj) {
			var me = tobj,
				m_search = me.down("[name=m_search]"),
				dom = m_search.el.dom,
				sbox, sbtn,
				sinp,
				sclose;
				
			me.m_0 = me.down("[name=m_0]");
			me.m_1 = me.down("[name=m_1]");
			me.m_c = me.down("[name=m_c]");
			
			dom = $(".igc-search", dom);
			sbox = $("<div class='igc-search-box' style='position: absolute; top: 0; left: 0; margin:2px 5px 0px; white-space:nowrap; width:90%;'></div>").appendTo(dom);
			sbtn = $("<div class='igc-search-icon' ></div>").appendTo(sbox);
			sinp = $("<input type='text' class='igc-search-field' style='color: rgb(136, 136, 136); width: 100%; padding-bottom: 2px;' placeholder='" + IRm$/*resources*/.r1("L_SEARCH_KWD") + "'></input>").appendTo(sbox);
			sclose = $("<div class='igc-search-close' ></div>").appendTo(sbox);
			me.sinp = sinp;
			sclose.hide();
			
			sinp.bind("keyup", function(e) {
				sinp.val() && sclose.show();
				if (e.keyCode == 13)
				{
					me._a/*doSearch*/.call(me);
				}
			});
			
			sclose.bind("click", function(e) {
				e.stopPropagation();
				sinp.val("");
				me.m_c.getLayout().setActiveItem(0);
				sclose.hide();
			});
			
			// onblur="ZDBSearchUtil.handleBlur(this);" onfocus="ZDBSearchUtil.handleFocus(this);" onkeyup="return ZDBFieldsView.checkKeyAndSearchFields(this,event);"
			// onmousedown="ZDBSearchUtil.clearSearch(this,ZDBFieldsView.searchFields,event);"
		});
		
		IG$/*mainapp*/._I98/*naviTree*/.superclass.initComponent.call(this);
	}
});
IG$/*mainapp*/._I9b/*naviSearch*/ = $s.extend($s.panel, {
	"layout": "border",
	owner: null,
	
	a1/*requestSearch*/: function() {
		var keyword = this.down("[name=keyword]").getValue(),
			fltsetdate = this.down("[name=fltsetdate]").getValue(),
			fltfromdate = this.down("[name=fltfromdate]").getRawValue().split("-"),
			flttodate = this.down("[name=flttodate]").getRawValue().split("-"),
			fltypegrid = this.down("[name=fltypegrid]"),
			i,
			typelist = [],
			panel=this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			soption,
			enablesearch = false;
		
		for (i=0; i < fltypegrid.store.data.items.length; i++)
		{
			if (fltypegrid.store.data.items[i].get("selected") == true)
			{
				typelist.push(fltypegrid.store.data.items[i].get("type"));
			}
		}
		
		if ((keyword && keyword.length > 0) || 
			(fltsetdate == true)) // || (itemlist != null && itemlist.length > 0))
		{
			enablesearch = true;
		}
		
		if (enablesearch == true)
		{
			soption = {option: "search", name: keyword};
			if (fltsetdate == true)
			{
				soption.fromdate = fltfromdate.join("") + "000000";
				soption.todate = flttodate.join("") + "240000";
			}
			
			if (typelist && typelist.length > 0)
			{
				soption.typelist = typelist.join(";");
			}
			
			req.init(panel, 
				{
		            ack: "11",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: ""}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/(soption)
		        }, panel, panel.rs_a1/*requestSearch*/, null);
			req._l/*request*/();
		}
	},
	
	rs_a1/*requestSearch*/: function(xdoc) {
		var panel = this,
			i,
			cnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/result"),
			cnodes,
			mgrid = panel.down("[name=mgrid]"),
			data = [], d;
		
		if (cnode)
		{
			cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(cnode);
			for (i=0; i < cnodes.length; i++)
			{
				d = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[i]);
				d.iconCls = IG$/*mainapp*/._I11/*getMetaItemClass*/(d.type.toLowerCase(), d.memo);
				data.push(d);
			}
		}
		mgrid.store.loadData(data);
	},
	
	initComponent: function() {
		var resultTpl = Ext.create("Ext.XTemplate",
	        '<tpl for=".">',
	        '<div class="idv-sch-item">',
	            '<div class="idv-sch-icon {iconCls}"> </div><h3><span>{name}</span>&nbsp;</h3>',
	            '<p>{nodepath}</p>',
	        '</div></tpl>',
	    {
	        formatDate: function(value)
	        {
	            return Ext.Date.format(value, "M j, Y");
	        }
	    });
		
		var items = [
	        {
	        	xtype: "panel",
	        	bodyStyle: "padding:5px",
	        	"layout": "anchor",
	        	autoHeight: true,
	        	defaults: {
		        	anchor: "100%"
		        },
	        	region: "north",
	        	items: [
	        	    {
	        	    	xtype: "textfield",
	        	    	fieldLabel: "Keyword",
			            labelWidth: 50,
			            border: false,
						flex: 1,
						height: 20,
						hideLabel: false,
						
			            name: "keyword",
			            value: "",
			            allowBlank: true,
			            blankText: "Keyword is required!",
			            enableKeyEvents: true,
			            listeners: {
			        		keyup: function(item, e) {
			        			if (e.keyCode == 13)
			        			{
			        				this.a1/*requestSearch*/.call(this);
			        			}
			        		},
			        		scope: this
			        	}
	        	    },
	        	    {
	    	    		xtype: "fieldset",
	    	    		title: "Advanced Option",
	    	    		collapsible: true,
	    	    		autoHeight: true,
	    	    		collapsed: true,
	    	    		defaults: {
	    	    			labelWidth: 80,
	    	    			anchor: "100%",
	    	    			"layout": "anchor",
	    	    			defaults: {
	        	    			anchor: "100%"
	        	    		}
	    	    		},
	    	    		items: [
	    	    		    {
	    	    		    	xtype: "combobox",
	    	    		    	name: "fltypegroup",
	    	    		    	labelField: "Type",
	    	    		    	queryMode: "local",
	    	    		    	displayField: "name",
	    	    		    	valueField: "gcode",
	    	    		    	
	    	    		    	editable: false,
	    	    		    	
	    	    		    	store: {
	    	    		    		fields: [
 										"name", "gcode"
 									],
 									data: [
 									    {name: "----- Quick Select -----", gcode: ""},
 									    {name: "All", gcode: "all"},
 									    {name: "Folder and Workspace", gcode: "folder"},
 									    {name: (IG$/*mainapp*/.level == 1) ? "Report or dashboard" : "Report", gcode: "report"},
 									    {name: "Analysis item", gcode: "dimensions"}
 									]
	    	    		    	},
	    	    		    	listeners: {
	    	    		    		select: function(combo, records, eOpts) {
	    	    		    			var selvalue = combo.getValue(),
	    	    		    				fltypegrid = this.down("[name=fltypegrid]"),
	    	    		    				store = fltypegrid.store,
	    	    		    				i,
	    	    		    				mtype,
	    	    		    				mkey = null,
	    	    		    				regex = null;
	    	    		    			
	    	    		    			switch (selvalue)
	    	    		    			{
	    	    		    			case "all":
	    	    		    				mkey = null;
	    	    		    				break;
	    	    		    			case "report":
	    	    		    				mkey = "Report|Dashboard";
	    	    		    				break;
	    	    		    			case "folder":
	    	    		    				mkey = "Workspace|Folder";
	    	    		    				break;
	    	    		    			case "dimensions":
	    	    		    				mkey = "Dimension|Measure";
	    	    		    				break;
	    	    		    			}
	    	    		    			
	    	    		    			if (mkey != null)
	    	    		    			{
	    	    		    				regex = new RegExp(mkey);
	    	    		    			}
	    	    		    			
	    	    		    			for (i=0; i < store.data.items.length; i++)
    	    		    				{
    	    		    					mtype = store.data.items[i].get("type");
    	    		    					if (mkey == null || (regex != null && regex.test(mtype) == true))
    	    		    					{
    	    		    						store.data.items[i].set("selected", true);
    	    		    					}
    	    		    					else
    	    		    					{
    	    		    						store.data.items[i].set("selected", false);
    	    		    					}
    	    		    				}
	    	    		    		},
	    	    		    		afterrender: function(ui) {
	    	    		    			ui.setValue("");
	    	    		    		},
	    	    		    		scope: this
	    	    		    	}
	    	    		    },
							{
								xtype: "gridpanel",
								name: "fltypegrid",
								region: "center",
								"layout": "fit",
								hideHeaders: true,
								flex: 1,
								height: 100,
								scroll: "vertical",
								stateful: false,
								store: {
									fields: [
										"selected", "name", "type", "nodepath", "uid", "iconimg"
									],
									data: [
									    {name: "Workspace", type:"Workspace"},
									    {name: "Folder", type: "Folder"},
									    {name: "Cube", type: "Cube"},
									    {name: "Report", type: "Report"},
									    // ((IG$/*mainapp*/.level == 1) ? {name: "Dashboard", type: "Dashboard"},
									    {name: "Dimension", type: "Dimension"},
									    {name: "Measure", type: "Measure"}
									]
								},
								
								// stateful: true,
								
								columns: [
									{
										xtype: "checkcolumn",
										dataIndex: "selected",
										width: 30,
										editor: {
											xtype: "checkbox",
											cls: "x-grid-checkheader-editor"
										}
									},
								    { 	
										header: "",  
								    	dataIndex: "iconimg",
								    	sortable: false,
								        hideable: false,
								        width: 20
								    },
								    { 
								    	header: "Name",  
								    	dataIndex: "name",
								    	sortable: false,
								        hideable: false,
								        flex: 1
								    }
								],
								listeners: {
									afterrender: function(ui) {
									}
								}
							},
							{
								xtype: "checkbox",
								name: "fltsetdate",
								fieldLabel: "",
								boxLabel: "Set date",
								listeners: {
									change: function(field, newvalue, oldvalue, eOpt) {
										var checked = field.getValue(),
											fltfromdate = this.down("[name=fltfromdate]"),
											flttodate = this.down("[name=flttodate]");
										
										fltfromdate.setVisible(checked);
										flttodate.setVisible(checked);
									},
									scope: this
								}
							},
							{
								xtype: "datefield",
								name: "fltfromdate",
								hidden: true,
								labelWidth: 70,
								fieldLabel: "From",
								maxValue: new Date(),
								format: "Y-m-d",
								value: new Date()
							},
							{
								xtype: "datefield",
								name: "flttodate",
								hidden: true,
								labelWidth: 70,
								fieldLabel: "To",
								maxValue: new Date(),
								format: "Y-m-d",
								value: new Date()
							}
	    	    		],
	    	    		listeners: {
	    	    			
	    	    		}
	        	    },
	        	    {
	        	    	xtype: "button",
	        	    	text: IRm$/*resources*/.r1("B_SEARCH"),
	        	    	border: false,
	        	    	handler: function() {
	        	    		this.a1/*requestSearch*/();
	        	    	},
	        	    	scope: this
	        	    }
	        	]
	        },
	        {
	        	xtype: "gridpanel",
	        	name: "mgrid",
	        	region: "center",
	        	flex: 1,
	        	store: {
	        		fields: [
						{name: "name"},
						{name: "type"},
						{name: "nodepath"},
						{name: "uid"},
						{name: "iconimg"}
					]
	        	},
	        	stateful: true,
	        	/*
	        	columns: [
	        	    { 	header: "",  
	        	    	dataIndex: "iconimg",
	        	    	sortable: false,
	        	        hideable: false,
	        	        width: 20
	        	    },
	        	    { 
	        	    	header: "Name",  
	        	    	dataIndex: "name",
	        	    	sortable: false,
	        	        hideable: false,
	        	        flex: 1
	        	    },
	        	    { 
	        	    	header: "Path", 
	        	    	dataIndex: "nodepath", 
	        	    	flex: 1,
	        	    	sortable: false,
	        	        hideable: false
	        	    }
	        	],
	        	*/
	        	xtype: "dataview",
				loadMask: false,
				autoScroll: true,
	        	tpl: resultTpl,
	        	itemSelector: "div.idv-sch-item",
	        	listeners: {
	        		itemdblclick: function(view, record, item, index, ev) {
						var dt = record.data;
					
						if (dt)
						{
							this.owner._IHd/*navigateTree*/.call(this.owner, dt);
						}
					},
					scope: this
	        	}
	        }
		];
		
		$s.apply(this, {
			items: items
		});
		IG$/*mainapp*/._I9b/*naviSearch*/.superclass.initComponent.call(this);
	}
});
IG$/*mainapp*/._I97/*naviBrowser*/ = $s.extend($s.panel, {
	"layout": "card",
	mainPanel: null,
	api: null,
	search: null,
	workspaceMenu: null,
	bodyPadding: 0,
	cmode: 0,
	
	_IHd/*navigateTree*/: function(dt) {
		var p = this,
			l = p.getLayout(),
			ltext,
			btn = p.down("[name=btnsearchitem]");
		
		p.cmode = 0;
		ltext = IRm$/*resources*/.r1("B_SEARCH");
		btn.setText(ltext);
		l.setActiveItem(p.cmode);
		
		this.api._IHd/*navigateTree*/.call(p.api, dt);
	},
	
	initComponent: function() {
		var me = this;
		
		me.api = new IG$/*mainapp*/._I98/*naviTree*/({
			owner: me,
			mainPanel: me.mainPanel,
			showtoolbar: false,
			"layout": "fit"
		});
		
		me.search = new IG$/*mainapp*/._I9b/*naviSearch*/({
			owner: me
		}); 
		
		me.workspaceMenu = new $s.menu({
        	items: []
        });
		
		$s.apply(me, {
			"layout": "card",
			region: me.region || "west",
			split:true,
	        header: false,
	        collapsible: true,
	        margins:"0 0 0 0",
	        cmargins:"0 0 0 0",
	        lines:false,
	        autoScroll:false,
	        animate: true,
	        
			items: [
				me.api,
				me.search
			]
		});
		
		me.tbarobj = [" ",
	        {
				xtype: "button",
				name: "btnsearchitem",
	        	text: IRm$/*resources*/.r1("B_SEARCH"),
	        	handler: function() {
					var p = this,
						l = p.getLayout(), ltext,
						btn = p.down("[name=btnsearchitem]");
					
					p.cmode = (p.cmode == 1) ? 0 : 1;
					ltext = (p.cmode == 0) ? IRm$/*resources*/.r1("B_SEARCH") : IRm$/*resources*/.r1("B_TREEVIEW");
					
					btn.setText(ltext);
					l.setActiveItem(p.cmode);
				},
				scope: me
	        }, 
	        {
	        	iconCls: "icon-refresh",
	        	tooltip: IRm$/*resources*/.r1("L_REFRESH"),
	        	handler: function() {
	        		var me = this,
	        			api = me.api;
	        		api._II5/*refreshTopNode*/.call(api);
	        	},
	        	scope: me
	        }
	    ];
		
	    // me.customToolMenu = null;
	    me.workspaceMenuButton = null;
	    
	    if (me.api.root.address == "/")
	    {
	    	me.workspaceMenuButton = Ext.create("Ext.button.Split", {
	    		text: IRm$/*resources*/.r1("L_GOTO"),
	    		menu: me.workspaceMenu
	    	});
	    }
	    
	    
    	if (me.showallcheckselect == true)
    	{
    		me.tbarobj.push({
    			iconCls: "icon-toolbar-remove",
    			tooltip: IRm$/*resources*/.r1("L_DELETE_CHECKED"),
    			handler: function() {
    				var me = this;
    				me.api._II3/*removeSelectedItems*/();
    			},
    			scope: me
    		});
    		
    		me.tbarobj.push({
    			iconCls: "icon-toolbar-move",
    			tooltip: "Move Selection",
    			handler: function() {
    				var me = this;
    				me.api._II1/*moveSelectedItems*/();
    			},
    			scope: me
    		});
    	}
	    	
        me.tbarobj.push("->");
        if (me.workspaceMenuButton)
        {
        	me.tbarobj.push(me.workspaceMenuButton);
        }
        // me.tbarobj.push(me.customToolMenu);
	    
	    me.toolbar = Ext.create("Ext.toolbar.Toolbar", {
	    	items: me.tbarobj
	    });
	    
	    Ext.apply(me, {
	        tbar: me.toolbar
	    });
	          
		IG$/*mainapp*/._I97/*naviBrowser*/.superclass.initComponent.call(me);
	}
});
IG$/*mainapp*/._Ib0/*tabletree*/ = $s.extend($s.treepanel, {
	columns: [
	    {
	    	xtype: 'treecolumn',
	    	header: 'Name',
	    	dataIndex: 'disp',
	    	flex: 1
	    }
	],
	appendNodeElement: function(pnode, item)
	{
		if(pnode.numNodeNames == undefined){
			pnode.numNodeNames = 1;
		}
		else{
			pnode.numNodeNames++;
	    }
		
		var Model = this.store.model;
		
		var record = new Model(item);
		record.leaf = item.leaf;
		record.raw = item;
		pnode.data.leaf = false;
		pnode.appendChild(record);
			
		return record;
	},
	
	viewConfig: {
		plugins: {
			ptype: 'gridviewdragdrop',
			dragGroup: 'cubeDDGroup',
			dropGroup: 'cubeEDDGroup',
			enableDrag: true,
			enableDrop: false,
			listeners: {
				drop: function(node, data, dropRec, dropPosition) {
					var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
				}
			}
		}
	},
	
	r1/*requestTable*/: function(node) {
		var panel = this,
			nodepath = node.get("nodepath"),
			nodeuid = node.get("uid"),
			ltype = node.get("type"),
			b_view = (ltype == "InlineView"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			ack = "25",
			pload, cnt;
		
		panel.setLoading(true);
		
		if (b_view)
		{
			ack = "5";
			pload = IG$/*mainapp*/._I2d/*getItemAddress*/({uid: node.get("uid")}, "uid");
			cnt = IG$/*mainapp*/._I2e/*getItemOption*/({});
		}
		else
		{
			pload = IG$/*mainapp*/._I2d/*getItemAddress*/({address: (nodeuid || nodepath), option: "StoredContent"}, "address;option");
			cnt = IG$/*mainapp*/._I2e/*getItemOption*/({});
		}
		
		req.init(panel, 
			{
	            ack: ack,
	            payload: pload,
	            mbody: cnt
	        }, panel, function(xdoc) {
	        	var me = this,
	        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					snodes, i, tb, tables = [];
			
				me.setLoading(false);
				
				if (tnode)
				{
					snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode, "Field");
					
					for (i=0; i < snodes.length; i++)
					{
						tb = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
						tb.checked = false;
						tb.leaf = true;
						tb.allowDrag = true;
						
						if (panel.cmode == 1)
						{
							tb.disp = tb.alias ? tb.alias + "(" + tb.name + ")" : tb.name;
						}
						else
						{
							tb.disp = tb.name;
						}
						
						node.appendChild(tb);
					}
				}
	        }, false);
		req._l/*request*/();
	},

	initComponent : function() {
		// call parent
		$s.apply(this, {
			store: {
				/*proxy: {
					type: 'memory'
				},
				*/
				store: "treestore",
				fieldSort: false,
				fields: [
					"name", "alias", "nodepath", "datasize", "selected", "tablename", "type", "uid", "disp", "seq",
					"datatype", "fieldname", "mapto", "sqlfield", "fieldid",
					"sequence", "uniquekey", "mcuid"
				],
				root: {
			        name: 'CubeModel Tables',
			        disp: "CubeModel Tables",
			        address: '/'
		        }
			},
			collapseFirst:false,
			singleExpand: false,
			nodekey: {},
			listeners: {
				/*
				itemclick: function(view, record, item, index, e)
				{
					// this.treeEditor.triggerEdit.call(this.treeEditor, record, item);
					// record.beginEdit();
				},
				*/
				checkchange: function(node, checked) {
					if (node.hasChildNodes() == true)
					{
						for (i=0; i < node.childNodes.length; i++)
						{
							node.childNodes[i].set("checked", checked);
						}
						
						node.expand();
					}
				},
				beforeitemexpand: function(node, eopts) {
					var me = this,
						ltype = node.get("type"),
						mtype;
					
					if ((ltype == "Table" || ltype == "InlineView") && node.hasChildNodes())
					{
						mtype = node.childNodes[0].get("type");
						
						if (mtype == "ml_tb")
						{
							node.removeChild(node.childNodes[0]);
							me.r1/*requestTable*/(node);
						}
					}
				},
				scope: this
			}
		});
		
		IG$/*mainapp*/._Ib0/*tabletree*/.superclass.initComponent.apply(this, arguments);
  	}
});
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




IG$/*mainapp*/._Ieb/*dynFilterConfig*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	width: 500,
	height: 450,	
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			pitem = me.pitem,
			objtype = me.down("[name=objtype]"),
			tabid = me.down("[name=tabid]"),
			l_codemap = me.down("[name=l_codemap]"),
			cdata = [],
			chash = {},
			i, p, n,
			periodlist = me.down("[name=periodlist]"),
			checkbuttonhor = me.down("[name=checkbuttonhor]"),
			fmode = me.down("[name=fmode]"),
			dzone = me.dzone,
			dtabs = [],
			di,
			c, v,
			req;
			
		me._f = [
			{c: "filtertitle", n: "title"},
			{c: "objname", n: "name"},
			{c: "objmerge", d: 0},
			{c: "isnecessary"},
			{c: "useprompt"},
			{c: "showallvalue"},
			{c: "hfilter"},
			{c: "valueformat"},
			{c: "aname"},
			{c: "showpopup"},
			{c: "rangevalue"},
			{c: "rangelabel"},
			{c: "smode", d: "codevalue"},
			{c: "crowindex"},
			{c: "compcss"},
			{c: "dateseltype", d: "date"},
			{c: "yearfrom", d: "cyear-5"},
			{c: "yearto", d: "cyear"},
			{c: "startdate"},
			{c: "enddate"},
			{c: "defaultvalue"},
			{c: "invokejs"},
			{c: "showcondition"}, 
			{c: "pvalues"},
			{c: "cmap_disp"},
			{c: "s1a"},
			{c: "s1b"},
			{c: "s1c"}
		];
		
		objtype = (objtype == "radiobox") ? "checkbox" : objtype;
		objtype.setValue(pitem.objtype);
		
		for (i=0; i < me._f.length; i++)
		{
			c = me.down("[name=" + me._f[i].c + "]");
			v = me._f[i].n || me._f[i].c;
			p = pitem[v];
			
			if (!p && typeof(me._f[i].d) == "undefined")
			{
				p = me._f[i].d;
			}
			
			c.setValue(p);
		}
		
		me.down("[name=useprevcont]").setValue(pitem.useprevcont == "T");
		checkbuttonhor.setValue(pitem.checkbuttonhor == "T" ? true : false);
		
		tabid.setVisible(pitem.type == "viewselector");
		l_codemap.setVisible(pitem.type != "viewselector");
		
		if (dzone)
		{
			for (i=0; i < dzone.items.length; i++)
			{
				di = dzone.items[i];
				if (di.objtype == "TAB")
				{
					dtabs.push({
						label: (di.title || di.docid),
						value: di.docid
					});
				}
			}
			
			tabid.store.loadData(dtabs);
			tabid.setValue(pitem.tabid);
		}
		
		for (i=0; i < IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.data.length; i++)
		{
			cdata.push({
				name: IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.data[i].name,
				value: IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.data[i].value,
				selected: false,
				"default": false
			});
			
			chash[IG$/*mainapp*/._Iea/*dynFilterDateConfig*/.data[i].value] = i+1;
		}
		
		periodlist.store.loadData(cdata);
		me.down("[name=showperiodselector]").setValue(pitem.showperiodselector == "T");
		
		if (pitem.periodlist)
		{
			for (i=0; i < pitem.periodlist.length; i++)
			{
				p = pitem.periodlist[i];
				n = chash[p.value];
				if (n)
				{
					periodlist.store.data.items[n-1].set("selected", true);
					if (p["default"] == true)
					{
						periodlist.store.data.items[n-1].set("default", true);
					}
				}
			}
		}
		
		fmode.hide();
		
		if (pitem.uid)
		{
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me,
				{
					ack: "11",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: pitem.uid}),
					mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "ftables"})
				}, me, function(xdoc) {
					var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/item");
						
					if (tnode)
					{
						fmode.show();
						fmode.setValue(">> Table : (" + IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "name") + ") is available to insert!");
					}
				});
			req._l/*request*/();
		}
		
		me.l1/*updateLayout*/();
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			pitem = me.pitem,
			objtype = me.down("[name=objtype]"),
			periodlist = me.down("[name=periodlist]"),
			
			tabid = me.down("[name=tabid]"),
			checkbuttonhor = me.down("[name=checkbuttonhor]"),
			i, r, pdefault = false, c;
		
		pitem.validated = false;
		pitem.objtype = objtype.getValue();
		pitem.tabid = tabid.getValue();
		
		for (i=0; i < me._f.length; i++)
		{
			c = me.down("[name=" + me._f[i].c + "]");
			v = me._f[i].n || me._f[i].c;
			pitem[v] = c.getValue();
		}
		
		pitem.useprevcont = me.down("[name=useprevcont]").getValue() ? "T" : "F";
		pitem.checkbuttonhor = checkbuttonhor.getValue() == true ? "T" : "F";
		
		pitem.showperiodselector = (me.down("[name=showperiodselector]").getValue() ? "T" : "F");
		pitem.periodlist = [];
		
		for (i=0; i < periodlist.store.data.items.length; i++)
		{
			r = periodlist.store.data.items[i];
			
			if (r.get("selected") == true || r.get("default") == true)
			{
				pitem.periodlist.push({
					name: r.get("name"),
					value: r.get("value"),
					"default": r.get("default") == true && pdefault == false ? true : false
				});
				
				if (r.get("default") == true)
				{
					pdefault = true;
				}
			}
		}
		
		if (pdefault == false && pitem.periodlist.length > 0)
		{
			pitem.periodlist[0]["default"] = true;
		}
		
		if (me.callback)
		{
			me.callback.execute();
		}
					
		me._IG0/*closeDlgProc*/();
	},
	
	l1/*updateLayout*/: function() {
		var me = this,
			objtype = me.down("[name=objtype]").getValue();
		
		me.down("[name=showpopup]").setVisible(objtype == "checkbox" || objtype == "combobox");
		me.down("[name=rangevalue]").setVisible(objtype == "text" || objtype == "combobox");
		me.down("[name=smode]").setVisible(objtype == "checkbox" || objtype == "combobox");
		me.down("[name=checkbuttonhor]").setVisible(objtype == "checkbuttons" || objtype == "radiobuttons");
		me.down("[name=periodset]").setVisible(objtype == "calendarperiod");
		me.down("[name=s1]").setVisible(objtype == "slider");
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("T_DYNFILTER_CONFIG");
				 
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				{
			    	xtype: "panel",
			    	
			    	"layout": "anchor",
			    	
			    	autoScroll: true,
			    	
					bodyBorder: false,
	
					items: [
						{
							xtype: "fieldset",
							title: "General Info",
							layout: "anchor",
							fieldDefaults: {
				    			labelWidth: 130,
				    			anchor: '100%'
							},
							items: [
								{
									name: "objname",
									fieldLabel: "Object ID",
									xtype: "textfield"
								},
								{
									name: 'filtertitle',
									fieldLabel: IRm$/*resources*/.r1('B_TITLE'),
									xtype: 'textfield'
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Value Controls",
							layout: "anchor",
							fieldDefaults: {
				    			labelWidth: 130,
				    			anchor: '100%'
							},
							items: [
								{
									name: "objtype",
									fieldLabel: "Value Selection",
									xtype: "combobox",
									labelAlign: 'left',
									
									valueField: 'value',
									displayField: 'label',
			
									editable: false,
									queryMode: "local",
			            	    	autoSelect: true,
			            	    	
									store: {
				        	    		fields: [
				        	    		    "label", "value"
				        	    		],
				        	    		data: [
				        	    		    {label: "TextInput", value: "text"},
				        	    		    {label: "Single Selection", value: "combobox"},
				        	    		    {label: "Multi Selection", value: "checkbox"},
				        	    		    {label: "Radio buttons", value: "radiobuttons"},
				        	    		    {label: "Check buttons", value: "checkbuttons"},
				        	    		    {label: "Slider", value: "slider"},
				        	    		    {label: "Calendar", value: "calendar"},
				        	    		    {label: "Period", value: "calendarperiod"},
				        	    		    {label: "File Upload", value: "fileupload"}
				        	    		]
									},
									
									listeners: {
										change: function(field, newValue, oldValue, eOpts) {
											var me = this,
												rangevalue = me.down("[name=rangevalue]"),
												brangelabel = me.down("[name=brangelabel]"),
												bfL = me.down("[name=bfL]"),
												bfM = me.down("[name=bfM]"),
												objtype = me.down("[name=objtype]").getValue();
											
											bfL.setVisible(objtype == "fileupload");
											bfM.setVisible(objtype == "calendar" || objtype == "calendarperiod");
											brangelabel.setVisible(((objtype == "text" || objtype == "combobox") && rangevalue.getValue()) || objtype == "calendarperiod");
											me.l1/*updateLayout*/();
										},
										scope: this
									}
								},
								{
									name: "fmode",
									xtype: "displayfield",
									value: "",
									hidden: true
								},
								{
									name: "showpopup",
									fieldLabel: "Popup Dialog",
									xtype: "checkbox",
									boxLabel: "Enabled",
									hidden: true,
									listeners: {
										change: function(tobj) {
											var me = this,
												v = tobj.getValue();
												
											me.down("[name=rangevalue]").setDisabled(v);
											me.down("[name=smode]").setDisabled(!v);
										},
										scope: this
									}
								},
								{
									name: "smode",
									hidden: true,
									fieldLabel: "Value Mode",
									xtype: "combobox",
									valueField: 'value',
									displayField: 'label',
									editable: false,
									queryMode: "local",
			            	    	autoSelect: true,
									store: {
				        	    		fields: [
				        	    		    "label", "value"
				        	    		],
				        	    		data: [
				        	    			{label: "Code Value", value: "codevalue"},
				        	    			{label: "Value", value: "value"},
				        	    			{label: "Code", value: "code"},
				        	    			{label: "Value Code", value: "valuecode"}
				        	    		]
				        	    	}
								},
								{
									name: "rangevalue",
									fieldLabel: "Range Value",
									xtype: "checkbox",
									boxLabel: "Enabled (From - To)",
									hidden: true,
									listeners: {
										change: function(tobj) {
											var me = this,
												brangelabel = me.down("[name=brangelabel]"),
												objtype = me.down("[name=objtype]").getValue();
											
											brangelabel.setVisible(tobj.getValue() || objtype == "calendarperiod");
										},
										scope: this
									}
								},
								{
									xtype: "fieldcontainer",
									name: "brangelabel",
									hidden: true,
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "textfield",
											name: "rangelabel",
											fieldLabel: "Range Text"											
										},
										{
											xtype: "displayfield",
											value: "(Ex: From^~^To to {From ---------- ~ To ----------}} : text is left"
										},
										{
											xtype: "displayfield",
											value: "(Ex: _From^~^_To to {---------- From ~ ---------- To}} : text is right"
										}
									]
								},
								
								{
									name: "isnecessary",
									fieldLabel: "Is necessary field",
									xtype: "checkbox",
									boxLabel: "Necessary"
								},
								{
									name: "showallvalue",
									fieldLabel: "Enabel Select All",
									xtype: "checkbox",
									boxLabel: "Enable"
								},
								{
									name: "aname",
									fieldLabel: "Select title",
									xtype: "textfield"
								},
								{
									name: "hfilter",
									fieldLabel: "Hierarchy Filters",
									xtype: "textfield"
								},
								{
									xtype: "fieldcontainer",
									layout: "hbox",
									fieldLabel: "Format Value",
									items: [
										{
											name: "valueformat",
											xtype: "textfield"
										},
										{
											xtype: "button",
											text: "Example",
											menu: {
												items: [
													{
														text: "substring", 
														handler: function() {
															var valueformat = me.down("[name=valueformat]");
															valueformat.setValue("#helper.substring(value, 0, 4)");
														},
														scope: this
													},
													{
														text: "system date", 
														handler: function() {
															var valueformat = me.down("[name=valueformat]");
															valueformat.setValue("#helper.systemDate('yyyyMMdd')");
														},
														scope: this
													},
													{
														text: "value template", 
														handler: function() {
															var valueformat = me.down("[name=valueformat]");
															valueformat.setValue("${value}");
														},
														scope: this
													}
												]
											}
										}
									]
								},
								{
									name: "useprompt",
									fieldLabel: "Use as prompt",
									xtype: "checkbox",
									boxLabel: "Enable"
								},
								{
									xtype: "combobox",
									name: "tabid",
									hidden: true,
									fieldLabel: "Bind tab panel",
									valueField: 'value',
									displayField: 'label',
			
									editable: false,
									queryMode: "local",
			            	    	autoSelect: true,
			            	    	
									store: {
				        	    		fields: [
				        	    		    "label", "value"
				        	    		]
				        	    	}
								},
								{
									xtype: "fieldcontainer",
									fieldLabel: "Load Values",
									hidden: true,
									name: "l_codemap",
									layout: "hbox",
									items: [
										{
											xtype: "textfield",
											readOnly: true,
											name: "cmap_disp",
											flex: 1
										},
										{
											xtype: "button",
											text: "..",
											handler: function() {
												var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
													visibleItems: "workspace;folder;codemap",
													u5x/*treeOptions*/: {
														cubebrowse: true,
														rootuid: "/SYS_Lookup"
													},
													callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, function(item) {
														var me = this;
														me.pitem.cmap_uid = item.uid;
														me.pitem.cmap_disp = item.name;
														me.down("[name=cmap_disp]").setValue(item.name);
													})
												});
												IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
											},
											scope: this
										},
										{
											xtype: "button",
											text: IRm$/*resources*/.r1("B_CLEAR"),
											handler: function() {
												var me = this;
						        	    		me.down("[name=cmap_disp]").setValue("");
						        	    		me.pitem.cmap_disp = "";
						        	    		me.pitem.cmap_uid = "";
											},
											scope: this
										}
									]
								},
								{
									xtype: "textfield",
									fieldLabel: "Default value",
									name: "defaultvalue"
								}
							]
						},
						{
							xtype: "fieldset",
							title: "File Upload Settings",
							name: "bfL",
							hidden: true,
							layout: "anchor",
							items: [
								{
									xtype: "checkbox",
									fieldLabel: "Upload File",
									boxLabel: "Eneabled"
								},
								{
									xtype: "checkbox",
									fieldLabel: "Show File History",
									boxLabel: "Enabled"
								},
								{
									xtype: "checkbox",
									fieldLabel: "Show All Files",
									boxLabel: "Enabled (Other user's upload file)"
								},
								{
									xtype: "checkbox",
									fieldLabel: "Multiple Files",
									boxLabel: "Allow multiple file upload"
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Layout",
							items: [
								{
									name: "compcss",
									fieldLabel: "CSS Name",
									xtype: "textfield"
								},
								{
									name: "objmerge",
									fieldLabel: "Merge column",
									xtype: "numberfield",
									minValue: 0,
									maxValue: 10
								},
								{
									name: "crowindex",
									fieldLabel: "Row Location",
									xtype: "numberfield",
									minValue: 0,
									maxValue: 10
								},
								{
									xtype: "checkbox",
									name: "checkbuttonhor",
									fieldLabel: "Check Layout",
									boxLabel: "Horizontal"
								},
								{
									xtype: "checkbox",
									fieldLabel: "Use Last TD",
									name: "useprevcont"
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Slider Options",
							name: "s1",
							hidden: true,
							layout: "anchor",
							items: [
								{
									xtype: "textfield",
									name: "s1a",
									fieldLabel: "Minimum"
								},
								{
									xtype: "textfield",
									name: "s1b",
									fieldLabel: "Maximum"
								},
								{
									xtype: "textfield",
									name: "s1c",
									fieldLabel: "Step Increase"
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Date Time setup",
							name: "bfM",
							hidden: true,
							layout: "anchor",
							items: [
								{
									xtype: "combobox",
									queryMode: "local",
									fieldLabel: "Selector Type",
									editable: false,
									name: "dateseltype",
									store: {
										fields: ["name", "value"],
										data: [
											{name: "Select Date", value: "date"},
											{name: "Select Month", value: "month"},
											{name: "Select Year", value: "year"}
										]
									},
									displayField: "name",
									valueField: "value"
								},
								{
									xtype: "textfield",
									fieldLabel: "Year From",
									name: "yearfrom"
								},
								{
									xtype: "textfield",
									fieldLabel: "Year To",
									name: "yearto"
								}
							]
						},
						
						{
							xtype: "fieldset",
							name: "periodset",
							title: "Period setup",
							layout: "anchor",
							defaults: {
								anchor: "100%"
							},
							items: [
								{
									xtype: "checkbox",
									fieldLabel: "Show selection",
									boxLabel: "Show",
									name: "showperiodselector"
								},
								{
									xtype: "textfield",
									fieldLabel: "Start Date",
									name: "startdate"
								},
								{
									xtype: "textfield",
									fieldLabel: "End Date",
									name: "enddate"
								},
								{
									xtype: "gridpanel",
									name: "periodlist",
									height: 120,
									
									store: {
										xtype: "store",
										fields: ["name", "value", "selected", "default"]
									},
									columns: [
										{
											xtype: "checkcolumn",
											text: "Show",
											width: 40,
											dataIndex: "selected"
											
										},
										{
											xtype: "checkcolumn",
											text: "Default",
											width: 50,
											dataIndex: "default"
										},
										{
											xtype: "gridcolumn",
											text: "Name",
											flex: 1,
											dataIndex: "name"
										}
									],
									listeners: {
										headerclick: function( ct, column, e, t, eOpts ) {
											if (column == 0)
											{
											}
										}
									}
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Extra Options",
							layout: "anchor",
							defaults: {
								anchor: "100%"
							},
							items: [
								{
									xtype: "textfield",
									fieldLabel: "Invoke JS",
									hidden: true,
									name: "invokejs"
								},
								{
									xtype: "textfield",
									fieldLabel: "Show When",
									name: "showcondition"
								},
								{
									xtype: "textarea",
									fieldLabel: "Values",
									name: "pvalues"
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
					var panel = this;
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/._Ieb/*dynFilterConfig*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/.$_m/*drill_config*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": "fit",
	
	closable: false,
	resizable:false,
	width: 500,
	height: 450,	
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			sop = me.sop,
			rec = me.rec,
			gdp1 = me.down("[name=dp1]"),
			gdp2 = me.down("[name=dp2]"),
			dp1 = [],
			dp2 = [],
			tval, mval1, mval2,
			titem = rec.get("titem"),
			o_titem = {},
			tparams = rec.get("tparams"),
			o_tparams = {},
			i;
			
		if (sop)
		{
			if (titem)
			{
				tval = titem.split("_");
				
				for (i=0; i < tval.length; i++)
				{
					if (tval[i])
					{
						o_titem[tval[i]] = 1;
					}
				}
			}
			
			if (tparams)
			{
				tval = tparams.split("_");
				
				for (i=0; i < tval.length; i++)
				{
					if (tval[i])
					{
						o_tparams[tval[i]] = 1;
					}
				}
			}
			
			for (i=0; i < sop.rows.length; i++)
			{
				mval1 = {
					uid: sop.rows[i].uid,
					name: sop.rows[i].name,
					sel: o_titem[sop.rows[i].uid] ? true : false
				};
				
				mval2 = {
					uid: sop.rows[i].uid,
					name: sop.rows[i].name,
					sel: o_tparams[sop.rows[i].uid] ? true : false
				};
				
				dp1.push(mval1);
				dp2.push(mval2);
			}
			
			if (sop.dataquerymode == "M_PIVOT")
			{
				for (i=0; i < sop.cols.length; i++)
				{
					mval1 = {
						uid: sop.cols[i].uid,
						name: sop.cols[i].name,
						sel: o_titem[sop.cols[i].uid] ? true : false
					};
					
					mval2 = {
						uid: sop.cols[i].uid,
						name: sop.cols[i].name,
						sel: o_tparams[sop.cols[i].uid] ? true : false
					};
					dp1.push(mval1);
					dp2.push(mval2);
				}
				
				for (i=0; i < sop.measures.length; i++)
				{
					mval1 = {
						uid: sop.measures[i].uid,
						name: sop.measures[i].name,
						sel: o_titem[sop.measures[i].uid] ? true : false
					};
					dp1.push(mval1);
				}
			}
		}
		
		gdp1.store.loadData(dp1);
		gdp2.store.loadData(dp2);
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			mrec = me.rec,
			gdp1 = me.down("[name=dp1]"),
			gdp2 = me.down("[name=dp2]"),
			dp1 = [],
			dp2 = [],
			rec,
			i;
			
		for (i=0; i < gdp1.store.data.items.length; i++)
		{
			rec = gdp1.store.data.items[i];
			if (rec.get("sel"))
			{
				dp1.push(rec.get("uid"));
			}
		}
		
		for (i=0; i < gdp2.store.data.items.length; i++)
		{
			rec = gdp2.store.data.items[i];
			if (rec.get("sel"))
			{
				dp2.push(rec.get("uid"));
			}
		}
		
		mrec.set("titem", dp1.length ? dp1.join("_") : null);
		mrec.set("tparams", dp2.length ? dp2.join("_") : null);
		
		me.close();
	},
	
	initComponent: function() {
		$s.apply(this, {
			title: IRm$/*resources*/.r1("T_DRILL_CONFIG"),
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				{
			    	xtype: "panel",
			    	"layout": {
			    		type: "vbox",
			    		align: "stretch"
			    	},
					bodyBorder: false,
					items: [
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1("L_DRILL_ON"),
							flex: 1,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "gridpanel",
									name: "dp1",
									flex: 1,
									store: {
										fields: ["name", "uid", "sel"]
									},
									columns: [
										{
											xtype: "checkcolumn",
											dataIndex: "sel",
											width: 50
										},
										{
											text: IRm$/*resources*/.r1("B_NAME"),
											dataIndex: "name",
											flex: 1
										}
									]
								},
								{
									xtype: "displayfield",
									value: IRm$/*resources*/.r1("L_DRILL_ON_DESC")
								}
							]
						},
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1("L_DRILL_PARAM"),
							flex: 1,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "gridpanel",
									name: "dp2",
									flex: 1,
									store: {
										fields: ["name", "uid", "sel"]
									},
									columns: [
										{
											xtype: "checkcolumn",
											dataIndex: "sel",
											width: 50
										},
										{
											text: IRm$/*resources*/.r1("B_NAME"),
											dataIndex: "name",
											flex: 1
										}
									]
								},
								{
									xtype: "displayfield",
									value: IRm$/*resources*/.r1("L_DRILL_PARAM_DESC")
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
					var panel = this;
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/.$_m/*drill_config*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._If1/*sheetobj*/ = $s.extend($s.window, {
	
	modal: true,
	"layout": "fit",
	
	closable: false,
	resizable: true,
	width: 600,
	height: 570,
		
	_ILb/*sheetoption*/: null,
	sheetindex: -1,
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			tb_prt_ival, rec, tb_prt_sval, n,
			i,
			dzone = me.dzone,
			sheetlist = [],
			docid,
			docpanel,
			dtarget, dmtarget = {},
			sheets = me.sheets,
			_rop = me._ILa/*reportoption*/,
			opt = me._ILb/*sheetoption*/,
			exportOption = _rop ? _rop.exportOption : null,
			_cnames = "reportname;docid;objtype;viewchange;toolbutton;opt_filter;opt_text;opt_viewer;tcontent;fw;fh;columnfill;hidemenu;detailview;enablepivot;enablecache;grd_detail_spec;tb_prt;tb_prt_i;opt_report;opt_panel;opt_tab;pnldetail;edrill".split(";");
		
		me._tc = [];
		
		for (i=0; i < _cnames.length; i++)
		{
			me._tc[_cnames[i]] = me.down("[name=" + _cnames[i] + "]");
		}
		
		var _tc = me._tc,
			objtype = _tc["objtype"],
			viewchange = _tc["viewchange"],
			toolbutton = _tc["toolbutton"],
			reportname = _tc["reportname"],
			opt_filter = _tc["opt_filter"],
			opt_text = _tc["opt_text"],
			opt_viewer = _tc["opt_viewer"],
			tcontent = _tc["tcontent"],
			fw = _tc["fw"],
			fh = _tc["fh"],
			columnfill = _tc["columnfill"],
			hidemenu = _tc["hidemenu"],
			detailview = _tc["detailview"],
			enablepivot = _tc["enablepivot"],
			enablecache = _tc["enablecache"],
			edrill = _tc["edrill"],
			grd_detail_spec = _tc["grd_detail_spec"],
			tb_prt = _tc["tb_prt"],
			tb_prt_i = _tc["tb_prt_i"],
			ditem,
			sheet,
			dview,
			sop, rop,
			docitems,
			dtname, dtval, dtitem, dparams, isdrill,
			sheet_toolbar = ig$/*appoption*/.sheet_toolbar;
		
		me._op/*optionpack*/ = [
			"hidetitle", "drillreport", "isdistinct", "openload", "autorefresh", "refresh_timer", "columnfill", "hidemenu", "tb_vch", "tb_prt_grd", "tb_prt"
		];
		
		if (_rop)
		{
			me.down("[name=ploader]").setValue(_rop.ploader ? true : false);
			me.down("[name=cubeuid]").store.loadData(_rop.__cs.l);
			me.down("[name=phideloader]").setValue(_rop.phideloader ? true : false);
		}
		
		if (me._l1/*isnewobject*/ && !opt)
		{
			if (me.objtype != "SHEET")
			{
				me._ILb/*sheetoption*/ = opt = new IG$/*mainapp*/._IFc/*sheetfiltercomp*/(null);
			}
			else
			{
				me._ILb/*sheetoption*/ = opt = new IG$/*mainapp*/._IEf/*clReport*/(null, _rop.itemtype, false);
			}
			
			opt.objtype = me.objtype;
		}
		
		if (opt && opt.objtype == "FILTER")
		{
			tb_prt_i.store.loadData([]);
		}
		
		if (exportOption)
		{
			$.each(["excel", "pdf", "csv"], function(i, t) {
				if (exportOption["u_" + t])
				{
					tb_prt_i.store.add({
						showitem: false,
						name: "Builtin (" + t + ")",
						key: t
					});
				}
			});
		}
		
		if (exportOption && exportOption.u_office && exportOption.otmpl)
		{
			$.each(exportOption.otmpl, function(i, p) {
				tb_prt_i.store.add({
					showitem: false,
					name: "Office " + (p.export_type ? "-" + p.export_type + " " : "") + "(" + p.description + ": " + p.name + ")",
					key: "office_" + i
				});
			});
		}
		
		if (exportOption && exportOption.u_jasper && exportOption.jasper && exportOption.jasper.jasper_template)
		{
			$.each(["pdf", "rtf", "ppt", "excel", "xlsx", "docx", "html", "xml"], function(i, p) {
				if (exportOption.jasper[p + "_output"] == "T")
				{
					tb_prt_i.store.add({
						showitem: false,
						name: "JASPER (" + p.toUpperCase() + ")",
						key: "jasper_" + p
					});
				}
			});
		}
		
		if (sheet_toolbar && sheet_toolbar.length)
		{
			for (i=0; i < sheet_toolbar.length; i++)
			{
				tb_prt_i.store.add({
					showitem: false,
					name: sheet_toolbar[i].name,
					key: sheet_toolbar[i].key
				});
			}
		}
		
		me.down("[name=showtab]").setValue(true);
		
		if (sheets)
		{
			dtarget = opt.pff1a/*filteroptions*/ ? opt.pff1a/*filteroptions*/.drilltarget : opt.drilltarget;
			
			if (dtarget)
			{
				dtarget = dtarget.split(";");
				for (i=0; i < dtarget.length; i++)
				{
					if (dtarget[i].indexOf("^") > -1)
					{
						dtval = dtarget[i].split("^");
						dtname = dtval[0];
						isdrill = dtval[1] == "T" ? true : false;
						dtitem = dtval[2] || null;
						dparams = dtval[3] || null;
					}
					else
					{
						dtname = dtarget[i];
						isdrill = true;
						dtitem = null;
						dtparams = null;
					}
					
					dmtarget[dtname] = {
						isdrill: isdrill,
						dtitem: dtitem,
						dparams: dparams
					};
				}
			}
			
			for (i=0; i < sheets.length; i++)
			{
				dtval = dmtarget["sheet_" + i] || null;
				
				if (opt && opt.objtype == "SHEET" && sheets[i]._ILb/*sheetoption*/ == opt)
				{
					continue;
				}
				
				sheetlist.push({
					sid: ("sheet_" + i),
					name: (sheets[i]._ILb/*sheetoption*/.name || "sheet_" + i),
					sheetindex: sheets[i].sheetindex,
					reportname: _rop ? _rop.name : "",
					usedrill: dtval ? dtval.isdrill : false,
					titem: dtval ? dtval.dtitem : null,
					tparams: dtval ? dtval.dparams : null
				});
			}
			
			if (dzone)
			{
				docitems = dzone.docitems;
				
				for (k in docitems)
				{
					ditem = docitems[k].lt.ubody;
					dview = ditem.view;
					
					if (ditem.objtype == "RPT_VIEW")
					{
						if (dview && dview.irpt)
						{
							for (i=0; i < dview.irpt.sheets.length; i++)
							{
								sheet = dview.irpt.sheets[i];
								rop = sheet._ILa/*reportoption*/;
								sop = sheet._ILb/*sheetoption*/;
								
								dtval = dmtarget[rop.uid + "_" + "sheet_" + i] || null;
								
								sheetlist.push({
									sid: (rop.uid + "_" + "sheet_" + i),
									name: rop.name || "sheet_" + i,
									sheetindex: sheet.sheetindex,
									reportname: rop ? rop.name : "",
									usedrill: dtval ? dtval.isdrill : false,
									titem: dtval ? dtval.dtitem : null,
									tparams: dtval ? dtval.dparams : null
								});
							}
						}
					}
				}
			}
			
			grd_detail_spec.store.loadData(sheetlist);
		}
		
		if (opt && opt.objtype)
		{
			// objtype.setVisible(false);
			_tc["objtype"].setValue(opt.objtype);
			
			if (opt.objtype == "FILTER" && opt.pff1/*filterItems*/)
			{
				var filteritems = me.down("[name=filteritems]"),
					p1 = opt.pff1/*filterItems*/,
					p2 = opt.pff1a/*filteroptions*/,
					p,
					dp = [],
					f_uid;
				
				// detail_view.setVisible(true);
				
				if (p2)
				{
					me.down("[name=f_b_enable]").setValue(p2.showbutton);
					me.down("[name=f_c_size]").setValue(p2.columnsize || 1);
					me.down("[name=f_r_size]").setValue(p2.rowsize || 1);
					me.down("[name=f_viewtype]").setValue(p2.viewtype || "row");
					me.down("[name=f_t_dir]").setValue(p2.f_t_dir || "left");
					me.down("[name=f_b_name]").setValue(p2.buttonname || IRm$/*resources*/.r1("L_BTN_SEARCH"));
					me.down("[name=f_b_desc]").setValue(p2.f_b_desc);
					me.down("[name=f_b_scr]").setValue(p2.f_b_scr);
					me.down("[name=f_b_row]").setValue(p2.brow || 0);
					me.down("[name=f_b_clear]").setValue(p2.f_b_clear == "T");
					me.down("[name=edrill]").setValue(p2.edrill);
					me.down("[name=f_b_evt]").setValue(p2.f_b_evt == "T");
					me.down("[name=f_b_trg]").setValue(p2.f_b_trg == "T");
					me.down("[name=f_b_trg_all]").setValue(p2.f_b_trg_all == "T");
					me.down("[name=f_rotate]").setValue(p2.f_rotate == "T");
					me.down("[name=f_rotate_timer]").setValue(p2.f_rotate_timer);
					me.down("[name=f_rotate_field]").setValue(p2.f_rotate_field);
				}
				
				for (i=0; i < p1.length; i++)
				{
					f_uid = "f_" + (me.f_uid++);
					p = p1[i];
					dp.push({
						title: p.title || p.name,
						name: p.name,
						uid: p.uid,
						objtype: p.objtype,
						objmerge: p.objmerge,
						isnecessary: p.isnecessary,
						showallvalue: p.showallvalue,
						hfilter: p.hfilter,
						aname: p.aname,
						showpopup: p.showpopup,
						tabid: p.tabid,
						operator: p.operator || "EQ",
						f_uid: f_uid,
						cmap_disp: p.cmap_disp,
						cmap_uid: p.cmap_uid
					});
					p.f_uid = f_uid;
				}
				
				filteritems.store.loadData(dp);
			}
			else if (opt.objtype == "RPT_VIEW")
			{
				opt.rptoption = opt.rptoption || {};
				me.down("[name=rpt_name]").setValue(opt.rptoption.name || "");
			}
			else if (opt.objtype == "TEXT")
			{
				tcontent.setValue(Base64.decode(opt.content || ""));
				tcontent.setHTMLValue && tcontent.setHTMLValue(Base64.decode(opt.htmlcontent) || "");
			}
			else if (opt.objtype == "SHEET")
			{
				var p1 = opt.dff1/*detailItems*/,
					p,
					dp = [];
				
				// detail_view.setVisible(true);
				
				for (i=0; i < p1.length; i++)
				{
					p = p1[i];
					dp.push({
						name: p.name,
						uid: p.uid,
						type: p.type,
						nodepath: p.nodepath,
						showintab: p.showintab,
						titem: p.titem,
						tparams: p.tparams
					});
				}
				
				me.down("[name=detailgrid]").store.loadData(dp);
				edrill.setValue(opt ? opt.edrill : false);
			}
			else if (opt.objtype == "PANEL" || opt.objtype == "TAB")
			{
				opt.objtype == "PANEL" && me.down("[name=playout]").setValue(opt.playout || "V");
				
				if (me.dzone)
				{
					docid = opt.docid;
					var dp = [], d, c,
						item = me.dzone._IIb/*getBox*/.call(me.dzone, docid),
						di_item = me.dzone.docitems[docid],
						taboption;
						
					if (opt.sf/*taboption*/)
					{
						taboption = opt.sf/*taboption*/;
					}
					else
					{
						taboption = opt.sf/*taboption*/ = {};
					}
						
					me.down("[name=showtab]").setValue(taboption.showtab == "F" ? false : true);
					
					if (di_item && di_item.children.length)
					{
						_tc["objtype"].setReadOnly(true);
						for (i=0; i < di_item.children.length; i++)
						{
							c = di_item.children[i].lt.ubody;
							d = {
								name: c.title,
								docid: c.docid,
								width: c.width,
								height: c.height,
								position: c.p1/*position*/,
								fw: c.fw,
								fh: c.fh
							};
							dp.push(d);
						}
						me.down("[name=childoption]").store.loadData(dp);
						me.down("[name=subtabs]").store.loadData(dp);
					}
				}
			}
			
			fw.setValue(opt.fw);
			fh.setValue(opt.fh);
		}
		
		if (opt)
		{
			if (me._md/*creatMode*/ != 1)
			{
				docid = opt.objtype == "SHEET" ? opt.layoutinfo.docid : opt.docid;
				docpanel = dzone._IIb/*getBox*/.call(dzone, docid);
				if (docpanel)
				{
					me.down("[name=panelwidth]").setValue(docpanel.width || 100);
					me.down("[name=panelheight]").setValue(docpanel.height || 100);
					// me.down("[name=panelp1]").setValue(docpanel.p1/*position*/);
				}
				
				if (me.sheetindex == 0)
				{
					opt.name = opt.name || "";
					_tc["objtype"].setVisible(false);
				}

				_tc["docid"].setValue(docid);
				reportname.setValue(opt.name);
				
				$.each(me._op/*optionpack*/, function(i, k) {
					var c = me.down("[name=" + k + "]");
					c.setValue(opt[k]);
				});
				
				enablepivot.setValue(opt.enablepivot);
				enablecache.setValue(opt.enablecache);
				objtype.setValue(opt.objtype || me.objtype || "SHEET");
				viewchange.setValue(opt.viewchange == "F" ? false : true);
				toolbutton.setValue(opt.toolbutton == "T" ? true : false);

				tb_prt_ival = (opt.tb_prt_i ? ";" + opt.tb_prt_i + ";" : "");
				tb_prt_sval = (opt.tb_prt_s ? opt.tb_prt_s : "").split(";");
				
				n = 0;

				for (i=0; i < tb_prt_i.store.data.items.length; i++)
				{
					rec = tb_prt_i.store.data.items[i];

					if (tb_prt_ival && tb_prt_ival.indexOf(";" + rec.get("key") + ";") > -1)
					{
						rec.set("style", tb_prt_sval[n]);
						rec.set("showitem", true);
						n++;
					}
					else
					{
						rec.set("showitem", false);
					}
				}
			
				for (i=0; i < _rop.__cs.l.length; i++)
				{
					if (_rop.__cs.l[i].uid == opt.cubeuid)
					{
						me.down("[name=cubeuid]").setValue(opt.cubeuid);
					}
				}
			}
		}
		else
		{
			objtype.setValue(me.objtype || "SHEET");
			
			if (me.objtype == "FILTER")
			{
				me.down("[name=edrill]").setValue(true);
			}
			// me.down("[name=panelp1]").setValue("north");
		}
		
		me._IG1/*changeObjectType*/();
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function(bapply) {
		var me = this,
			tb_prt_i = me._tc["tb_prt_i"],
			docid,
			detailview = me.down("[name=detailgrid]").store, i, row,
			dzone = me.dzone,
			docid,
			docpanel,
			dp,
			filteritems = me.down("[name=filteritems]"),
			grd_detail_spec = me._tc["grd_detail_spec"],
			rec,
			i,
			drilltarget = [],
			pffi, pffirec,
			dockpanel,
			mval,
			_rop = me._ILa/*reportoption*/,
			opt = me._ILb/*sheetoption*/,
			pfitems = {},
			n;
		
		$.each(["viewchange", "toolbutton", "reportname", "objtype", "tcontent", "fw", "fh", "enablepivot", "enablecache", "edrill"], function(n, m) {
			var c = me._tc[m];
			
			if (n < 2)
			{
				me[m] = c.getValue() ? "T" : "F";
			}
			else if (m == "tcontent")
			{
				me[m] = c.getValue();
				
				if (c.getHTMLValue)
				{
					me[m + "_h"] = c.getHTMLValue();
				}
			}
			else
			{
				me[m] = c.getValue();
			}
		});
		
		if (_rop)
		{
			_rop.ploader = me.down("[name=ploader]").getValue() ? 1 : 0;
			_rop.phideloader = me.down("[name=phideloader]").getValue() ? 1 : 0;
		}
		
		if (me._l1/*isnewobject*/)
		{
			if (me.objtype != "SHEET")
			{
				me._ILb/*sheetoption*/ = opt = new IG$/*mainapp*/._IFc/*sheetfiltercomp*/(null);
			}
			else
			{
				me._ILb/*sheetoption*/ = opt = new IG$/*mainapp*/._IEf/*clReport*/(null, _rop.itemtype, false);
			}
		}
		
		if (opt)
		{
			if (grd_detail_spec.store.data.items.length > 0)
			{
				for (i=0; i < grd_detail_spec.store.data.items.length; i++)
				{
					rec = grd_detail_spec.store.data.items[i];
					mval = rec.get("sid") + "^" + (rec.get("usedrill") ? "T" : "F") + "^" + (rec.get("titem") || "") + "^" + (rec.get("tparams") || "");
					
					drilltarget.push(mval);
				}
			}
			
			if (opt.sf/*taboption*/)
			{
				opt.sf/*taboption*/.showtab = me.down("[name=showtab]").getValue() == true ? "T" : "F";
			}
						
			if (opt.pff1/*filterItems*/)
			{
				opt.pff1a/*filteroptions*/ = {
					showbutton: me.down("[name=f_b_enable]").getValue(),
					columnsize: me.down("[name=f_c_size]").getValue(),
					brow: me.down("[name=f_b_row]").getValue() || 0,
					buttonname: (IRm$/*resources*/.r1("L_BTN_SEARCH") == me.down("[name=f_b_name]").getValue() ? "" : me.down("[name=f_b_name]").getValue()),
					f_b_desc: me.down("[name=f_b_desc]").getValue(),
					f_b_scr: me.down("[name=f_b_scr]").getValue(),
					rowsize: me.down("[name=f_r_size]").getValue() || 1,
					viewtype: me.down("[name=f_viewtype]").getValue(),
					f_t_dir: me.down("[name=f_t_dir]").getValue(),
					f_b_clear: me.down("[name=f_b_clear]").getValue() ? "T" : "F",
					drilltarget: drilltarget.join(";"),
					edrill: me.down("[name=edrill]").getValue(),
					f_b_evt: me.down("[name=f_b_evt]").getValue() ? "T" : "F",
					f_b_trg: me.down("[name=f_b_trg]").getValue() ? "T" : "F",
					f_b_trg_all: me.down("[name=f_b_trg_all]").getValue() ? "T" : "F",
					f_rotate: me.down("[name=f_rotate]").getValue() ? "T" : "F",
					f_rotate_timer: me.down("[name=f_rotate_timer]").getValue(),
					f_rotate_field: me.down("[name=f_rotate_field]").getValue()
				};
				
				opt.pff1a/*filteroptions*/.brow = Math.min(opt.pff1a/*filteroptions*/.brow, opt.pff1a/*filteroptions*/.rowsize - 1);
				me.down("[name=f_b_row]").setValue(opt.pff1a/*filteroptions*/.brow);
				
				for (i=0; i < opt.pff1/*filterItems*/.length; i++)
				{
					pffi = opt.pff1/*filterItems*/[i];
					pfitems[pffi.f_uid] = pffi;
				}
				
				opt.pff1/*filterItems*/ = [];
				
				for (i=0; i < filteritems.store.data.items.length; i++)
				{
					pffirec = filteritems.store.data.items[i];
					
					if (pfitems[pffirec.get("f_uid")])
					{
						pffi = pfitems[pffirec.get("f_uid")];
						pffi.title = pffirec.get("title");
						pffi.name = pffirec.get("name");
						pffi.operator = pffirec.get("operator");
						pffi.objmerge = pffirec.get("objmerge");
						pffi.isnecessary = pffirec.get("isnecessary");
						pffi.showallvalue = pffirec.get("showallvalue");
						pffi.showpopup = pffirec.get("showpopup");
						pffi.tabid = pffirec.get("tabid");
						pffi.aname = pffirec.get("aname");
						pffi.hfilter = pffirec.get("hfilter");
						pffi.f_uid = pffirec.get("f_uid");
						pffi.cmap_disp = pffirec.get("cmap_disp");
						pffi.cmap_uid = pffirec.get("cmap_uid");
						
						opt.pff1/*filterItems*/.push(pffi);
					}
				}
			}

			docid = (opt.objtype == "SHEET" ? opt.layoutinfo.docid : opt.docid);
			
			opt.changetype = (opt.objtype != me.objtype ? opt.objtype : null);
			
			opt.objtype = me.objtype;
			if (opt.objtype == "SHEET")
			{
				opt.layoutinfo.docid = docid;
				opt.cubeuid = me.down("[name=cubeuid]").getValue();
			}
			else
			{
				opt.docid = docid;
			}
			opt.name = me.reportname;

			$.each(me._op/*optionpack*/, function(i, k) {
				var c = me.down("[name=" + k + "]");
				
				opt[k] = c.getValue();
			});
			
			opt.drilltarget = drilltarget.join(";");
			opt.edrill = me.edrill;
			opt.enablepivot = me.enablepivot;
			opt.enablecache = me.enablecache;
			opt.viewchange = me.viewchange;
			opt.toolbutton = me.toolbutton;
			opt.content = Base64.encode(me.tcontent);
			opt.htmlcontent = Base64.encode(me.tcontent_h || me.tcontent);
			opt.fw = me.fw;
			opt.fh = me.fh;
			opt.panelwidth = me.down("[name=panelwidth]").getValue();
			opt.panelheight = me.down("[name=panelheight]").getValue();
			opt.tb_prt_i = "";
			opt.tb_prt_s = "";
			
			n = 0;
			
			for (i=0; i < tb_prt_i.store.data.items.length; i++)
			{
				rec = tb_prt_i.store.data.items[i];

				if (rec.get("showitem") == true)
				{
					opt.tb_prt_i += (opt.tb_prt_i ? ";" : "") + rec.get("key");
					opt.tb_prt_s += (n > 0 ? ";" : "") + (rec.get("style") || "");
					n++;
				}
			}

			// opt.p1/*position*/ = me.down("[name=panelp1]").getValue() || "north";
			
			if (opt.objtype == "SHEET")
			{
				opt.dff1/*detailItems*/ = [];
			
				for (i=0; i < detailview.data.items.length; i++)
				{
					row = detailview.data.items[i];
					opt.dff1/*detailItems*/.push({
						uid: row.get("uid"),
						name: row.get("name"),
						nodepath: row.get("nodepath"),
						sheetindex: row.get("sheetindex"),
						sheetname: row.get("sheetname"),
						showintab: row.get("showintab"),
						titem: row.get("titem"),
						tparams: row.get("tparams")
					});
				}
			}

			if (me._md/*creatMode*/ != 1)
			{
				dockpanel = dzone._IIb/*getBox*/.call(dzone, docid);
			}

			if (dockpanel)
			{
				dockpanel.width = opt.panelwidth;
				dockpanel.height = opt.panelheight;
				// dockpanel.p1/*position*/ = opt.p1/*position*/;
				
				var position = dockpanel.p1/*position*/,
					mposition,
					child;
				
				if (dockpanel.parent)
				{
					if (dockpanel.parent.objtype == "TAB" && dockpanel.parent.view)
					{
						dockpanel.parent.view.l3/*validateItems*/.call(dockpanel.parent.view);
					}
					
					for (i=0; i < dockpanel.parent.children.length; i++)
					{
						child = dockpanel.parent.children[i];
						mposition = child.p1/*position*/;
						
						if ((position == mposition) || (position == "east" && mposition == "west") || (position == "west" && mposition == "east"))
						{
							child.height = dockpanel.height;
						}
					}
				}
				
				if (opt.objtype == "PANEL")
				{
					var childoption = me.down("[name=childoption]").store,
						docid, tw, th;
					for (i=0; i < childoption.data.items.length; i++)
					{
						docid = childoption.data.items[i].get("docid");
						tw = childoption.data.items[i].get("width");
						tw = tw == "" ? null : Number(tw);
						th = childoption.data.items[i].get("height");
						th = th == "" ? null : Number(th);
						dp = dzone._IIb/*getBox*/.call(dzone, docid);
						dp.width = tw;
						dp.height = th;
						dp.title = childoption.data.items[i].get("name");
					}
					
					opt.playout = me.down("[name=playout]").getValue();
					dockpanel.playout = opt.playout;
				}
				else if (opt.objtype == "TAB" && dockpanel.view)
				{
					dockpanel.view.l3/*validateItems*/.call(dockpanel.view);
				}
				
				dzone._IM5/*updateDisplay*/.call(dzone);
			}
		}
		
		if (me.callback)
		{
			me.callback.execute(me);
		}
					
		!bapply && me._IG0/*closeDlgProc*/();
	},
	
	_IG1/*changeObjectType*/: function() {
		var me = this,
			__tab = me.down("[name=__tab]"),
			_ac_ = me.down("[name=_ac_]"),
			objtype = me.down("[name=objtype]").getValue(),
			detailview = me._tc["detailview"];
		
		
		// (objtype != "SHEET" || me.sheetindex == 0) && drillreport.setVisible(false);
		
		if (me._md/*creatMode*/ == 1)
		{
			me._IG2/*setTabVisible*/(me._tc["opt_report"], false);
			me._IG2/*setTabVisible*/(me._tc["opt_filter"], true);
			me._IG2/*setTabVisible*/(me._tc["opt_text"], false);
			me._IG2/*setTabVisible*/(me._tc["opt_viewer"], false);
			me._IG2/*setTabVisible*/(detailview, false);
			_ac_.hide();
			me._IG2/*setTabVisible*/(me._tc["opt_panel"], false);
			me._IG2/*setTabVisible*/(me._tc["opt_tab"], false);
			me._IG2/*setTabVisible*/(me._tc["pnldetail"], false);
			me.down("[name=__tab]").getLayout().setActiveItem(me._tc["opt_filter"]);
		}
		else
		{
			me._IG2/*setTabVisible*/(me._tc["opt_report"], objtype == "SHEET");
			me.down("[name=opt_tbar]").setVisible(objtype == "SHEET" || objtype == "FILTER");
			me.down("[name=tb_vch]").setVisible(objtype == "SHEET");
			me.down("[name=tb_prt_grd]").setVisible(objtype == "SHEET");
			me._IG2/*setTabVisible*/(me._tc["opt_filter"], objtype == "FILTER");
			me._IG2/*setTabVisible*/(me._tc["opt_text"], objtype == "TEXT");
			me._IG2/*setTabVisible*/(me._tc["opt_viewer"], objtype == "RPT_VIEW");
			me._IG2/*setTabVisible*/(detailview, objtype == "SHEET");
			objtype == "SHEET" && _ac_.show();
			me._IG2/*setTabVisible*/(me._tc["opt_panel"], objtype == "PANEL");
			me._IG2/*setTabVisible*/(me._tc["opt_tab"], objtype == "TAB");
			me._IG2/*setTabVisible*/(me._tc["pnldetail"], objtype == "SHEET" || objtype == "FILTER");
		}
	},
	
	_IG2/*setTabVisible*/: function(tab, show) {
		tab.tab && tab.tab[show ? "show" : "hide"]();
		!tab.tab && tab.setVisible(show);
	},
	
	_IG3/*configFilterItem*/: function(rowIndex, colIndex) {
		var me = this,
			p1 = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			pitem = me._IG6/*getFilterItem*/(rowIndex);
		
		var dlg = new IG$/*mainapp*/._Ieb/*dynFilterConfig*/({
			pitem: pitem,
			dzone: me.dzone,
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.r_IG3/*configFilterItem*/, [pitem, rowIndex])
		});
		
		dlg.show(me);
	},
	
	r_IG3/*configFilterItem*/: function(params) {
		var me = this,
			pitem = params[0],
			rowIndex = params[1],
			filteritems = me.down("[name=filteritems]"),
			record = filteritems.store.data.items[rowIndex];
		
		$.each(["title", "name", "objtype", "objmerge", "isnecessary", "showallvalue", "aname", "hfilter", "showpopup", "tabid", "cmap_disp", "cmap_uid"], function(n, m) {
			record.set(m, pitem[m]);
		});
	},
	
	_IG4/*removeFilterItem*/: function(rowIndex, colIndex) {
		var me = this,
			p1 = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			filteritems = me.down("[name=filteritems]");
		
		filteritems.store.remove(filteritems.store.data.items[rowIndex]);
		// p1.splice(rowIndex, 1);
	},
	
	_IG5/*addDetailView*/: function() {
		var me = this;
	
		var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
			visibleItems: "workspace;folder;report",
			u5x/*treeOptions*/: {
				cubebrowse: false
			},
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.r_IG5/*addDetailView*/)
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	},
	
	r_IG5/*addDetailView*/: function(item) {
		var me = this,
			mfield = {
				uid: item.uid,
				name: item.name,
				nodepath: item.nodepath,
				type: item.type
			};
		me.down("[name=detailgrid]").store.add(mfield);
	},
	
	_IG6/*getFilterItem*/: function(rowindex) {
		var me = this,
			filteritems = me.down("[name=filteritems]"),
			store = filteritems.getStore(),
			p1 = me._ILb/*sheetoption*/.pff1/*filterItems*/,
			i, nname = store.data.items[rowindex].get("f_uid");
			
		for (i=0; i < p1.length; i++)
		{
			if (p1[i].f_uid == nname)
			{
				return p1[i];
			}
		}
		return null;
	},
	
	L1/*configureDrill*/: function(rec) {
		var me = this,
			sop = me._ILb/*sheetoption*/,
			dlg = new IG$/*mainapp*/.$_m/*drill_config*/({
				sop: sop,
				rec: rec
			});
		
		dlg.show(me);
	},
	
	initComponent : function() {
		var me = this,
			lwidth = 160,
			c_dt = [
				{name: "Equal", value: "EQ"},
				{name: "Not Equal", value: "NE"},
				{name: "In", value: "IN"},
				{name: "Greater or Equal", value: "GTE"},
				{name: "Less or Equal", value: "LTE"},
				{name: "Greater", value: "GT"},
				{name: "Lesser", value: "LT"},
				{name: "Like", value: "LIKE"},
				{name: "Between", value: "BETWEEN"},
				{name: "Not In", value: "NOTIN"}
			],
			i, c_dtm = {},
			c_ds = [],
			bcss = ig$/*appoption*/.button_css;
			
		for (i=0; i < c_dt.length; i++)
		{
			c_dtm[c_dt[i].value] = c_dt[i].name;
		}
		
		if (bcss && bcss.length)
		{
			c_ds.push({name: "Select", value: ""});
			
			for (i=0; i < bcss.length; i++)
			{
				c_ds.push(bcss[i]);
			}
		}
		else
		{
			c_ds = [
			    {name: "Select", value: ""},
			    {name: "pdf_1", value: "exp_pdf_1"},
			    {name: "word_1", value: "exp_word_1"},
			    {name: "word_2", value: "exp_word_2"},
			    {name: "word_3", value: "exp_word_3"},
			    {name: "word_4", value: "exp_word_4"},
			    {name: "word_5", value: "exp_word_5"},
			    {name: "word_6", value: "exp_word_6"},
			    {name: "word_7", value: "exp_word_7"},
			    {name: "ppt_1", value: "exp_ppt_1"},
			    {name: "ppt_2", value: "exp_ppt_2"},
			    {name: "ppt_3", value: "exp_ppt_3"},
			    {name: "ppt_4", value: "exp_ppt_4"},
			    {name: "excel_1", value: "exp_excel_1"},
			    {name: "excel_2", value: "exp_excel_2"},
			    {name: "csv", value: "idv-dk-btn-e-csv"},
			    {name: "office", value: "idv-dk-btn-e-xls"}
			];
		}
			
		me.f_uid = 0;
		
		$s.apply(this, {
			title: IRm$/*resources*/.r1("T_SHEET_OPTION"),
			items: [
				{
					xtype: "tabpanel",
					deferredRender: false,
					autoScroll: false,
					name: "__tab",
					defaults: {
						bodyPadding: 10
					},
					items: [
						{
							xtype: "panel",
							title: IRm$/*resources*/.r1("B_GENERAL"),
							autoScroll: true,
							"layout": "anchor",
							
							bodyBorder: false,
							hidden: me._md/*creatMode*/ == 1,
			
							defaults: {
								labelWidth: lwidth,
								anchor: "100%"
							},
							
							items: [
								{
									name: "docid",
									fieldLabel: "Component ID",
									xtype: "textfield",
									readOnly: true
								},
								{
									name: "reportname",
									fieldLabel: IRm$/*resources*/.r1("B_NAME"),
									xtype: "textfield"
								},
								{
									name: "objtype",
									fieldLabel: IRm$/*resources*/.r1("L_OBJECT_TYPE"),
									xtype: "combobox",
									labelAlign: "left",
									
									valueField: "value",
									displayField: "label",
			
									editable: false,
									queryMode: "local",
									autoSelect: true,
	
									store: {
										fields: [
											"label", "value"
										],
										data: [
											{label: "Sheet", value: "SHEET"},
											// {label: "Navigator", value: "NAVI"},
											{label: "Filter", value: "FILTER"},
											{label: "Textblock", value: "TEXT"},
	 										{label: "Panel", value: "PANEL"},
											{label: "Tab", value: "TAB"},
											{label: "Report Viewer", value: "RPT_VIEW"}
										]
									},
									listeners: {
										change: function(field, newValue, oldValue, eOpts) {
											var me = this;
											me._IG1/*changeObjectType*/();
										},
										scope: this
									}
								},
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("B_OPT_LAYOUT"),
									items: [
										{
											name: "ploader",
											fieldLabel: IRm$/*resources*/.r1("L_PG_LOADER"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											name: "phideloader",
											fieldLabel: IRm$/*resources*/.r1("L_HIDE_LOADER_REF"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											name: "hidetitle",
											fieldLabel: IRm$/*resources*/.r1("L_HIDE_TITLE"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											xtype: "fieldcontainer",
											layout: "hbox",
											items: [
												{
													fieldLabel: IRm$/*resources*/.r1("L_PANEL_W"),
													name: "panelwidth",
													xtype: "numberfield",
													min: 50,
													max: 3000,
													value: 200
												},
												{
													name: "fw",
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("L_FIXED_W"),
													inputValue: "T",
													checked: false
												}
											]
										},
										{
											xtype: "fieldcontainer",
											layout: "hbox",
											items: [
												{
													fieldLabel: IRm$/*resources*/.r1("L_PANEL_H"),
													name: "panelheight",
													xtype: "numberfield",
													min: 50,
													max: 3000,
													value: 200
												},
												{
													name: "fh",
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("L_FIXED_H"),
													inputValue: "T",
													checked: false
												}
											]
										}
									]
								},
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_OPT_TBAR"),
									name: "opt_tbar",
									hidden: true,
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "checkbox",
											name: "tb_vch",
											fieldLabel: IRm$/*resources*/.r1("L_TB_VCH"),
											boxLabel: IRm$/*resources*/.r1("B_ENABLED")
										},
										{
											xtype: "checkbox",
											name: "tb_prt_grd",
											fieldLabel: IRm$/*resources*/.r1("L_TB_PRT_GRD"),
											boxLabel: IRm$/*resources*/.r1("B_ENABLED")
										},
										{
											xtype: "checkbox",
											name: "tb_prt",
											fieldLabel: IRm$/*resources*/.r1("L_TB_PRT"),
											boxLabel: IRm$/*resources*/.r1("B_ENABLED")
										},
										{
											xtype: "gridpanel",
											name: "tb_prt_i",
											title: IRm$/*resources*/.r1("L_TB_PRT_T"),
											height: 200,
											store: {
												xtype: "store",
												fields: [
													"name", "showitem", "key", "style"
												],
												data: [
													// {showitem: false, name: "Excel", key: "excel"},
													// {showitem: false, name: "PDF", key: "pdf"},
													// {showitem: false, name: "CSV", key: "csv"}
												]
											},
											plugins: {
												ptype: "cellediting",
												clicksToEdit: true
											},
											columns: [
												{
													text: IRm$/*resources*/.r1("B_ENABLED"),
													xtype: "checkcolumn",
													dataIndex: "showitem",
													listeners: {
														checkchange: function(tobj, rowindex, checked, eopts) {
															if (checked)
															{
																this.down("[name=tb_prt]").setValue(true);
															}
														},
														scope: this
													}
												},
												{
													text: IRm$/*resources*/.r1("B_NAME"),
													flex: 1,
													dataIndex: "name"
												},
												{
													text: "Style",
													flex: 1,
													dataIndex: "style",
													editor: {
														xtype: "combobox",
														queryMode: "local",
														displayField: "name",
														valueField: "value",
														editable: false,
														autoSelect: true,
														store: {
															xtype: "store",
															fields: ["name", "value"],
															data: c_ds
														}
													}
												}
											]
										}
									]
								}
							]
						},
						{
							xtype: "panel",
							title: IRm$/*resources*/.r1("B_PROPERTY"),
							name: "opt_tab",
							autoScroll: true,
							"layout": "anchor",
							
							bodyBorder: false,
			
							defaults: {
								labelWidth: lwidth,
								anchor: "100%"
							},
							
							items: [
								{
									xtype: "checkbox",
									name: "showtab",
									fieldLabel: IRm$/*resources*/.r1("L_SHOW_TAB_BAR"),
									boxLabel: IRm$/*resources*/.r1("B_ENABLED")
								},
								{
									xtype: "gridpanel",
									name: "subtabs",
									height: 120,
									store: {
										xtype: "store",
										fields: [
											"docid", "position", "width", "height", "fw", "fh", "name"
										]
									},
									columns: [
										{
											xtype: "gridcolumn",
											text: IRm$/*resources*/.r1("B_NAME"),
											dataIndex: "name",
											flex: 1,
											editor: {
												xtype: "textfield",
												allowBlank: true
											}
											
										},
										{
											xtype: "gridcolumn",
											text: "docid",
											dataIndex: "docid"
										}
									]
								}
							]
						},
						{
							xtype: "panel",
							title: IRm$/*resources*/.r1("B_PROPERTY"),
							name: "opt_report",
							autoScroll: true,
							"layout": "anchor",
							bodyPadding: 5,
							bodyBorder: false,
			
							defaults: {
								labelWidth: lwidth,
								anchor: "100%"
							},
							
							items: [
								
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_R_RUN_PROP"),
									defaults: {
										labelWidth: 180
									},
									items: [
										{
											name: "openload",
											fieldLabel: IRm$/*resources*/.r1("L_ONLOAD_RUN"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											name: "autorefresh",
											fieldLabel: IRm$/*resources*/.r1("L_AUTO_REFRESH"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											name: "refresh_timer",
											fieldLabel: IRm$/*resources*/.r1("L_REFRESH_CYCLE"),
											xtype: "numberfield"
										},
										{
											name: "drillreport",
											fieldLabel: IRm$/*resources*/.r1("L_DRILLREPORT"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											name: "isdistinct",
											fieldLabel: IRm$/*resources*/.r1("L_DISTINCT_QUERY"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											name: "enablepivot",
											fieldLabel: IRm$/*resources*/.r1("L_ENABLE_PIVOT"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: true
										},
										{
											name: "enablecache",
											fieldLabel: "Enable Cache",
											xtype: "checkbox",
											hidden: true,
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										}
									]
								},
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_R_ANAL_CUBE"),
									layout: "anchor",
									defaults: {
										anchor: "100%"
									},
									items: [
										{
											fieldLabel: IRm$/*resources*/.r1("L_R_ANAL_CUBE_LBL"),
											name: "cubeuid",
											xtype: "combobox",
											editable: false,
											queryMode: "local",
											valueField: "uid",
											displayField: "name",
											store: {
												fields: ["name", "uid"]
											}
										}
									]
								},
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_OPT_GRID"),
									name: "opt_grid",
									layout: "anchor",
									defaults: {
										anchor: "100%",
										labelWidth: lwidth
									},
									items: [
										{
											name: "columnfill",
											fieldLabel: IRm$/*resources*/.r1("L_R_COLUMN_FIT"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											name: "hidemenu",
											fieldLabel: IRm$/*resources*/.r1("L_GRID_HMENU"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										}
									]
								},
								{
									xtype: "fieldset",
									title: "Dashboard option",
									hidden: true,
									layout: "anchor",
									defaults: {
										anchor: "100%"
									},
									items: [
										{
											name: "viewchange",
											fieldLabel: IRm$/*resources*/.r1("L_SHOW_VIEW_CHANGE"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED")
										},
										{
											name: "toolbutton",
											fieldLabel: IRm$/*resources*/.r1("L_SHOW_TOOL_BUTTON"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED")
										}
									]
								}
							]
						},
						{
							xtype: "panel",
							name: "opt_text",
							title: IRm$/*resources*/.r1("B_PROPERTY"),
							"layout": "fit",
							items: [
								{
									xtype: "htmleditor",
									name: "tcontent",
									enableColors: true,
									enableAlignments: true,
									enableFont: true,
									enableFontSize: true,
									enableFormat: true,
									enableLinks: true,
									enableLists: true,
									enableSourceEdit: true
								}
							]
						},
						{
							xtype: "panel",
							name: "opt_viewer",
							title: IRm$/*resources*/.r1("B_PROPERTY"),
							"layout": {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_RPT_V_OPT"),
									layout: "anchor",
									defaults: {
										anchor: "100%",
										labelWidth: lwidth
									},
									items: [
										{
											xtype: "fieldcontainer",
											fieldLabel: "Report Address",
											layout: {
												type: "hbox",
												align: "stretch"
											},
											items: [
												{
													xtype: "textfield",
													name: "rpt_name",
													flex: 1
												},
												{
													xtype: "button",
													text: "..",
													handler: function() {
														var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
															visibleItems: "workspace;folder;report;",
															callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, 
																function(item) {
																	if (item)
																	{
																		this._ILb/*sheetoption*/.rptoption = item;
																		this.down("[name=rpt_name]").setValue(item.name);
																	}
																}
															)
														});
														IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
													},
													scope: this
												}
											]
										}
									]
								}
							]
						},
						{
							xtype: "panel",
							name: "opt_filter",
							title: IRm$/*resources*/.r1("B_PROPERTY"),
							"layout": {
								type: "anchor",
								anchor: "100%",
								labelWidth: lwidth
							},
							autoScroll: true,
							items: [
								{
									xtype: "fieldset",
									title: "Filter Items",
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "container",
											flex: 1,
											anchor: "100%",
											layout: {
												type: "hbox",
												align: "stretch"
											},
											items: [
												{
													xtype: "gridpanel",
													name: "filteritems",
													flex: 1,
													height: 130,
													stateful: false,
													store: {
														fields: [
															"title", "name", "nodepath", "datasize",
															"datatype", "tablename", "type", "selected", 
															"operator", "objmerge", "isnecessary", "showallvalue",
															"aname", "hfilter", "showpopup", "tabid", "f_uid", "uid",
															"cmap_disp", "cmap_uid"
														]
													},
													plugins: {
														ptype: "cellediting",
														clicksToEdit: false
													},
													selType: "checkboxmodel",
													selModel: {
														checkSelector: ".x-grid-cell",
														mode: "SINGLE"
													},
													columns: [
														{ 
															text: IRm$/*resources*/.r1("B_TITLE"),  
															dataIndex: "title",
															sortable: false,
															hideable: false,
															flex: 1,
															editor: {
																allowBlank: true
															}
														},
														{ 
															text: IRm$/*resources*/.r1("B_NAME"),  
															dataIndex: "name",
															sortable: false,
															hideable: false,
															tdCls: "igc-td-link",
															flex: 1
														},
														{
															text: IRm$/*resources*/.r1("L_OPERATOR"),
															dataIndex: "operator",
															sortable: false,
															hideable: false,
															width: 120,
															editor: {
																xtype: "combobox",
																queryMode: "local",
																displayField: "name",
																valueField: "value",
																editable: false,
																autoSelect: true,
																store: {
																	xtype: "store",
																	fields: ["name", "value"],
																	data: c_dt
																}
															},
															renderer:function(value,metaData,record){
																var r = c_dtm[value];
																return r;
										                    }
														},
														{
															xtype: "actioncolumn",
															width: 45,
															items: [
																{
																	// icon: "./images/plus-circle.png",
																	iconCls: "icon-grid-config",
																	tooltip: "Detail Config",
																	handler: function (grid, rowIndex, colIndex) {
																		me._IG3/*configFilterItem*/.call(me, rowIndex, colIndex);
																	}
																},
																{
																	// icon: "./images/delete.png",
																	iconCls: "icon-grid-delete",
																	tooltip: "Remove",
																	handler: function (grid, rowIndex, colIndex) {
																		me._IG4/*removeFilterItem*/.call(me, rowIndex, colIndex);
																	}
																}
															]
														}
													],
													listeners: {
														cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
															var me = this;
															if (cellIndex == 2)
															{
																me._IG3/*configFilterItem*/.call(me, rowIndex, cellIndex);
															}
														},
														scope: this
													}
												},
												{
													xtype: "container",
													layout: {
														type: "vbox",
														align: "stretch",
														pack: "center"
													},
													items: [
														{
															xtype: "button",
															iconCls: "icon-toolbar-moveup",
															tooltip: "Move Up",
															handler: function() {
																var me = this,
																	grd = me.down("[name=filteritems]"),
																	store = grd.getStore(),
																	selmodel = grd.getSelectionModel(),
																	sel = selmodel.getSelection(),
																	n;
																	
																if (sel && sel.length > 0)
																{
																	n = store.indexOf(sel[0]);
																	if (n > 0)
																	{
																		store.remove(sel[0]);
																		store.insert(n-1, sel[0]);
																	}
																}
															},
															scope: this
														},
														{
															xtype: "button",
															iconCls: "icon-toolbar-movedown",
															tooltip: "Move Down",
															handler: function() {
																var me = this,
																	grd = me.down("[name=filteritems]"),
																	store = grd.getStore(),
																	selmodel = grd.getSelectionModel(),
																	sel = selmodel.getSelection(),
																	n;
																	
																if (sel && sel.length > 0)
																{
																	n = store.indexOf(sel[0]);
																	if (n + 1 < store.data.items.length)
																	{
																		store.remove(sel[0]);
																		store.insert(n+1, sel[0]);
																	}
																}
															},
															scope: this
														}
													]
												}
											]
										},
										{
											xtype: "container",
											layout: {
												type: "hbox",
												align: "stretch"
											},
											items: [
												{
													xtype: "container",
													flex: 1
												},
												{
													xtype: "button",
													text: "Tab Selector",
													hidden: me._md/*creatMode*/ == 1,
													handler: function() {
														var me = this,
															grd = me.down("[name=filteritems]"),
															store = grd.getStore(),
															i,
															gnames = {},
															nname,
															n = 0,
															npf;
															
														for (i=0; i < store.data.items.length; i++)
														{
															gnames[store.data.items[i].get("name")] = 1;
														}
														
														nname = "viewselector_" + n;
														
														while (gnames[nname])
														{
															n++;
															nname = "viewselector_" + (n);
														}
														
														npf = {
															"title": "", 
															"name": nname, 
															"nodepath": "", 
															"datasize": "",
															"datatype": "", 
															"tablename": "", 
															"type": "viewselector", 
															"selected": false, 
															"operator": "EQ", 
															"isnecessary": true, 
															"showallvalue": false,
															"aname": "", 
															"hfilter": "", 
															"showpopup": false,
															"objtype": "combobox",
															"tabid": "",
															"f_uid": "f_" + (me.f_uid++),
															"cmap_disp": "",
															"cmap_uid": ""
														};
														
														npf._p1/*main*/ = me._ILb/*sheetoption*/;
														me._ILb/*sheetoption*/.pff1/*filterItems*/.push(npf);
														
														store.add(npf);
													},
													scope: this
												},
												{
													xtype: "button",
													text: "Prompt",
													handler: function() {
														var me = this,
															grd = me.down("[name=filteritems]"),
															store = grd.getStore(),
															i,
															gnames = {},
															nname,
															n = 0,
															npf;
															
														for (i=0; i < store.data.items.length; i++)
														{
															gnames[store.data.items[i].get("name")] = 1;
														}
														
														nname = "prompt_" + n;
														
														while (gnames[nname])
														{
															n++;
															nname = "prompt_" + (n);
														}
														
														npf = {
															"title": "", 
															"name": nname, 
															"contentfullpath": "", 
															"datasize": "",
															"datatype": "", 
															"tablename": "", 
															"type": "prompt", 
															"selected": false, 
															"operator": "EQ", 
															"isnecessary": "T", 
															"monthselector": "F",
															"yearselector": "F",
															"yearfrom": null,
															"yearto": null,
															"showallvalue": "F",
															"invokejs": null,
															"defaultvalue": null,
															"aname": "", 
															"hfilter": "", 
															"showpopup": "F",
															"objtype": "combobox",
															"tabid": "",
															"startdate": "",
															"enddate": "",
															"f_uid": "f_" + (me.f_uid++)
														};
														
														npf._p1/*main*/ = me._ILb/*sheetoption*/;
														me._ILb/*sheetoption*/.pff1/*filterItems*/.push(npf);
														
														store.add(npf);
													},
													scope: this
												}
											]
										}
									]
								},
								{
									xtype: "fieldset",
									layout: "anchor",
									title: "View Options",
									// defaults: {
										// anchor: "100%"
									//},
									items: [
										{
											xtype: "fieldcontainer",
											fieldLabel: IRm$/*resources*/.r1("L_RUN_BUTTON"),
											layout: {
												type: "hbox"
											},
											items: [
												{
													xtype: "checkbox",
													name: "f_b_enable",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													listeners: {
														change: function(tobj, nvalue, ovalue, eopts) {
															var me = this,
																f_b_evt = me.down("[name=f_b_evt]"),
																f_b_trg = me.down("[name=f_b_trg]"),
																f_b_trg_all = me.down("[name=f_b_trg_all]");
															
															f_b_evt.setDisabled(nvalue);
															f_b_trg.setDisabled(!nvalue);
															f_b_trg_all.setDisabled(!nvalue);
														},
														scope: this
													}
												},
												{
													xtype: "textfield",
													fieldLabel: IRm$/*resources*/.r1("B_TEXT"),
													labelWidth: 50,
													labelAlign: "right",
													name: "f_b_name",
													value: IRm$/*resources*/.r1("L_BTN_SEARCH")
												}
											]
										},
										{
											xtype: "fieldcontainer",
											layout: {
												type: "vbox",
												align: "stretch"
											},
											items: [
												{
													xtype: "checkbox",
													name: "f_b_evt",
													disabled: false,
													fieldLabel: IRm$/*resources*/.r1("L_BTN_EVT"),
													boxLabel: IRm$/*resources*/.r1("B_ENABLED")
												},
												{
													xtype: "displayfield",
													value: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + IRm$/*resources*/.r1("L_BTN_EVTDESC")
												}
											]
										},
										{
											xtype: "fieldcontainer",
											layout: {
												type: "vbox",
												align: "stretch"
											},
											items: [
												{
													xtype: "checkbox",
													name: "f_b_trg",
													disabled: true,
													fieldLabel: IRm$/*resources*/.r1("L_BTN_TRG"),
													boxLabel: IRm$/*resources*/.r1("B_ENABLED")
												},
												{
													xtype: "displayfield",
													value: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + IRm$/*resources*/.r1("L_BTN_TRGDESC")
												}
											]
										},
										{
											xtype: "fieldcontainer",
											layout: {
												type: "vbox",
												align: "stretch"
											},
											items: [
												{
													xtype: "checkbox",
													name: "f_b_trg_all",
													disabled: true,
													fieldLabel: IRm$/*resources*/.r1("L_BTN_TRG_ALL"),
													boxLabel: IRm$/*resources*/.r1("B_ENABLED")
												},
												{
													xtype: "displayfield",
													value: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + IRm$/*resources*/.r1("L_BTN_TRGALLDESC")
												}
											]
										},
										{
											xtype: "textfield",
											name: "f_b_scr",
											fieldLabel: IRm$/*resources*/.r1("L_FLT_VAL_SCR")
										},
										{
											xtype: "checkbox",
											name: "f_b_clear",
											fieldLabel: IRm$/*resources*/.r1("L_CLEAR_FLT"),
											boxLabel: IRm$/*resources*/.r1("B_ENABLED")
										},
										{
											xtype: "textfield",
											fieldLabel: IRm$/*resources*/.r1("B_DESC"),
											// hidden: true,
											name: "f_b_desc"
										},
										{
											xtype: "combobox",
											editable: false,
											fieldLabel: IRm$/*resources*/.r1("L_VIEW_MODE"),
											name: "f_viewtype",
											queryMode: "local",
											valueField: "value",
											displayField: "name",
											store: {
												xtype: "store",
												fields: ["name", "value"],
												data: [
													{name: "Table mode", value: "table"},
													{name: "Row mode", value: "row"}
												]
											},
											listeners: {
												change: function(field, newValue, oldValue, eOpts) {
													var me = this,
														sel = field.getValue();
	
													me.down("[name=f_c_size]").setVisible(sel == "table");
													me.down("[name=f_r_size]").setVisible(sel == "row");
													me.down("[name=f_b_row]").setVisible(sel == "row");
												},
												scope: this
											}
										},
										{
											xtype: "combobox",
											editable: false,
											fieldLabel: IRm$/*resources*/.r1("L_T_DIR"),
											name: "f_t_dir",
											queryMode: "local",
											valueField: "value",
											displayField: "name",
											store: {
												xtype: "store",
												fields: ["name", "value"],
												data: [
													{name: "Top", value: "top"},
													{name: "Left", value: "left"}
												]
											}
										},
										{
											xtype: "numberfield",
											name: "f_c_size",
											hidden: true,
											fieldLabel: IRm$/*resources*/.r1("L_COL_SIZE"),
											minValue: 1,
											maxValue: 10,
											value: 1
										},
										{
											xtype: "numberfield",
											name: "f_r_size",
											hidden: true,
											fieldLabel: IRm$/*resources*/.r1("L_ROW_SIZE"),
											minValue: 1,
											maxValue: 10,
											value: 1
										},
										{
											xtype: "numberfield",
											name: "f_b_row",
											hidden: true,
											fieldLabel: IRm$/*resources*/.r1("L_BTN_ROW_ON"),
											value: 0
										}
									]
								},
								{
									xtype: "fieldset",
									layout: "anchor",
									hidden: true,
									title: "Auto Refresh",
									items: [
										{
											name: "f_rotate",
											fieldLabel: IRm$/*resources*/.r1("L_AUTO_REFRESH"),
											xtype: "checkbox",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											inputValue: "T",
											checked: false
										},
										{
											name: "f_rotate_timer",
											fieldLabel: IRm$/*resources*/.r1("L_REFRESH_CYCLE"),
											xtype: "numberfield"
										},
										{
											name: "f_rotate_field",
											fieldLabel: IRm$/*resources*/.r1("L_ROTATE_FIELD"),
											xtype: "textfield"
										}
									]
								}
							]
						},
						{
							xtype: "panel",
							name: "pnldetail",
							title: IRm$/*resources*/.r1("L_R_OPT_FILTER"),
							autoScroll: true,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "fieldset",
									name: "p_dset",
									title: IRm$/*resources*/.r1("L_R_UPD_TGT"), // "Update target reports",
									flex: 1,
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "gridpanel",
											name: "grd_detail_spec",
											flex: 1,
											$h: 200,
											store: {
												xtype: "store",
												fields: [
													"reportname", "name", "sheetindex", "sid", {name: "usedrill", type: "boolean"}, "titem", "tparams"
												]
											},
											columns: [
												{
													xtype: "checkcolumn",
													text: IRm$/*resources*/.r1("L_R_UT_DRILL"), // "Do Drill",
													dataIndex: "usedrill",
													width: 50,
													listeners: {
														checkchange: function(tobj, rowIndex, checked, eOpts) {
															var me = this,
																grd_detail_spec = me.down("[name=grd_detail_spec]"),
																edrill = me.down("[name=edrill]"),
																bsel = false,
																i, store = grd_detail_spec.store;
																
															for (i=0; i < store.data.items.length; i++)
															{
																if (store.data.items[i].get("usedrill"))
																{
																	bsel = 1;
																	break;
																}
															}
															
															if (bsel)
															{
																edrill.setValue(false);
															}
														},
														scope: this
													}
												},
												{
													text: IRm$/*resources*/.r1("B_NAME"),
													dataIndex: "name",
													flex: 1
												},
												{
													text: IRm$/*resources*/.r1("L_REPORT_NAME"),
													dataIndex: "reportname",
													flex: 1
												},
												{
													text: "Index",
													dataIndex: "sheetindex"
												},
												{
													xtype: "actioncolumn",
													name: "_ac_",
													hidden: true,
													width: 45,
													items: [
														{
															// icon: "./images/plus-circle.png",
															iconCls: "icon-grid-config",
															tooltip: "Detail Config",
															handler: function (grid, rowIndex, colIndex) {
																var rec = grid.store.data.items[rowIndex];
																rec && me.L1/*configureDrill*/.call(me, rec);
															}
														}
													]
												}
											],
											tbar: [
												{
													name: "edrill",
													fieldLabel: IRm$/*resources*/.r1("L_EN_DRILL"),
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
													inputValue: "T",
													checked: false,
													listeners: {
														change: function(cobj) {
															var e = cobj.getValue(),
																grd_detail_spec = this.down("[name=grd_detail_spec]"),
																i, rec;
															
															if (e)
															{
																for (i=0; i < grd_detail_spec.store.data.items.length; i++)
																{
																	rec = grd_detail_spec.store.data.items[i];
																	rec.set("usedrill", e);
																}
															}
														},
														scope: this
													}
												},
												{
													xtype: "displayfield",
													value: IRm$/*resources*/.r1("L_EN_DRILL_DESC")
												}
											],
											bbar: [
												{
													xtype: "displayfield",
													value: IRm$/*resources*/.r1("L_R_UT_DESC") // "Check sheet to detail view when cell or chart click"
												}
											]
										}
									]
								},
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_R_CMENU"), // "Context Menu Drill Setup",
									name: "detailview",
									flex: 1,
									layout: "fit",
									items: [
										{
											xtype: "gridpanel",
											name: "detailgrid",
											minHeight: 300,
											selType: "checkboxmodel",
											selModel: {
												checkSelector: ".x-grid-cell"
											},
											store: {
												xtype: "store",
												fields: [
													"name", "nodepath", "uid", "type", "sheetname", "sheetindex", "showintab", "titem", "tparams"
												]
											},
											plugins: [
												{
													ptype: "cellediting",
													clicksToEdit: false
												}
											],
											columns: [
												{
													xtype: "gridcolumn",
													text: IRm$/*resources*/.r1("B_NAME"),
													dataIndex: "name",
													editor: {
														xtype: "textfield",
														allowBlank: false
													}
												},
												{
													xtype: "checkcolumn",
													text: IRm$/*resources*/.r1("L_R_CM_SHOWTAB"),
													width: 60,
													dataIndex: "showintab"
												},
												{
													xtype: "gridcolumn",
													text: IRm$/*resources*/.r1("B_PATH"),
													dataIndex: "nodepath",
													flex: 1
												},
												{
													xtype: "gridcolumn",
													text: IRm$/*resources*/.r1("B_SHEET_NAME"),
													dataIndex: "sheetname",
													editor: {
														xtype: "combo",
														queryMode: "local"
													}
												},
												{
													xtype: "gridcolumn",
													text: IRm$/*resources*/.r1("L_SHEET_NUM"),
													width: 50,
													hidden: true,
													dataIndex: "sheetindex",
													editor: {
														clickToEdit: false
													}
												},
												{
													xtype: "actioncolumn",
													width: 45,
													items: [
														{
															// icon: "./images/plus-circle.png",
															iconCls: "icon-grid-config",
															tooltip: "Detail Config",
															handler: function (grid, rowIndex, colIndex) {
																var rec = grid.store.data.items[rowIndex];
																rec && me.L1/*configureDrill*/.call(me, rec);
															}
														}
													]
												}
											],
											tbar: [
												{
													xtype: "button",
													text: IRm$/*resources*/.r1("B_ADD"),
													handler: function() {
														this._IG5/*addDetailView*/();
													},
													scope: this
												},
												{
													xtype: "button",
													text: IRm$/*resources*/.r1("B_REMOVE"),
													handler: function() {
														var grd = this.down("[name=detailgrid]"),
															selModel = grd.getSelectionModel(),
															sel = selModel.getSelection(),
															i;
															
														if (sel.length > 0)
														{
															for (i=sel.length-1; i>=0; i--)
															{
																grd.store.remove(sel[i]);
															}
														}
													},
													scope: this
												},
												{
													xtype: "button",
													text: IRm$/*resources*/.r1("B_MOVE_UP"),
													handler: function() {
														var grd = this.down("[name=detailgrid]"),
															store = grd.store,
															selModel = grd.getSelectionModel(),
															sel = selModel.getSelection(),
															s, si,
															i;
															
														if (sel && sel.length == 1)
														{
															s = sel[0];
															si = store.indexOf(s);
															if (si > 0)
															{
																store.removeAt(si);
																store.insert(si-1, si);
															}
														}
													},
													scope: this
												},
												{
													xtype: "button",
													text: IRm$/*resources*/.r1("B_MOVE_DOWN"),
													handler: function() {
														var grd = this.down("[name=detailgrid]"),
															store = grd.store,
															selModel = grd.getSelectionModel(),
															sel = selModel.getSelection(),
															s, si,
															i;
															
														if (sel && sel.length == 1)
														{
															s = sel[0];
															si = store.indexOf(s);
															if (si+1<store.data.items.length)
															{
																store.removeAt(si);
																store.insert(si+1, si);
															}
														}
													},
													scope: this
												}
											]
										}
									]
								}
							]
						},
						{
							xtype: "panel",
							title: IRm$/*resources*/.r1("B_PROPERTY"),
							name: "opt_panel",
							layout: "anchor",
							defaults: {
								labelWidth: lwidth,
								anchor: "100%"
							},
							items: [
								{
									xtype: "combobox",
									name: "playout",
									fieldLabel: IRm$/*resources*/.r1("L_LAYOUT"),
									queryMode: "local",
									displayField: "name",
									valueField: "value",
									editable: false,
									store: {
										fields: ["name", "value"],
										data: [
											{name: IRm$/*resources*/.r1("L_VERTICAL"), value: "V"},
											{name: IRm$/*resources*/.r1("L_HORIZONTAL"), value: "H"},
											{name: IRm$/*resources*/.r1("L_B_LAYOUT"), value: "B"}
										]
									}
								},
								{
									xtype: "gridpanel",
									name: "childoption",
									height: 120,
									store: {
										xtype: "store",
										fields: [
											"docid", "position", "width", "height", "fw", "fh", "name"
										]
									},
									columns: [
										{
											xtype: "gridcolumn",
											text: IRm$/*resources*/.r1("B_NAME"),
											dataIndex: "name",
											flex: 1,
											editor: {
												xtype: "textfield",
												allowBlank: true
											}
											
										},
										{
											xtype: "gridcolumn",
											text: IRm$/*resources*/.r1("B_ID"),
											dataIndex: "docid"
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
					text: IRm$/*resources*/.r1("B_APPLY"),
					hidden: this._l1,
					handler: function() {
						this._IFf/*confirmDialog*/(1);
					},
					scope: this
				},
				"-",
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
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/._If1/*sheetobj*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Iba/*rpc_slice*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	title: "Chart Slicer",
	
	xtype: "panel",
	
	layout: {
		type: "vbox",
		align: "stretch"
	},
	
	_IPb/*maincontainer*/: null,
	
	floating: true,
	toFrontOnShow: true,
	width: 220,
	hidden: true,
	
	_ILb/*sheetoption*/: null,
	bInit: false,
	
	applyChanges: function() {
		var i,
			slicemeasures = this.down("[name=slicemeasures]"),
			value;
		
		this._ILb/*sheetoption*/.chartPivot.measures = [];
			
		for (i=0; i < slicemeasures.store.data.items.length; i++)
		{
			value = slicemeasures.store.data.items[i].data;
			this._ILb/*sheetoption*/.chartPivot.measures.push(value);
		}
		
		this.hide();
		
		this._IPb/*maincontainer*/.updateReport.call(this._IPb/*maincontainer*/);
	},
	
	dropSliceArea: function(item, dropped) {
		var i,
			slicemetrics = this.down("[name=slicemetrics]"),
			slicemeasures = this.down("[name=slicemeasures]");
			
		if (dropped == true)
		{
			for (i=0; i < slicemetrics.store.data.items.length; i++)
			{
				if (slicemetrics.store.data.items[i].data.uid == item.uid)
				{
					slicemetrics.store.remove(slicemetrics.store.data.items[i]);
					break;
				}
			}
		}
		else if (dropped === false)
		{
			slicemetrics.store.add(item);
		}
	},
	
	tools: [
		{
			type: 'minimize',
			qtip: 'Minimize',
			cls: 'x-tool-minimize',
			handler: function(event, toolEl, panel) {
				var p = panel.ownerCt;
				p.hide();
			},
			scope: this
		},
		{
			type: 'gear',
			qtip: 'Close',
			handler: function(event, toolEl, panel) {
				var p = panel.ownerCt;
				p.applyChanges.call(p);
			},
			scope: this
		}
	],
	
	applySheetOption: function() {
		var panel = this;
		
		if (this._ILb/*sheetoption*/ && this.bInit == true)
		{
			var dp = [], 
				dpm=[],
				i,
				eitem = {},
				uid, slicemetrics = this.down("[name=slicemetrics]"),
				slicemeasures = this.down("[name=slicemeasures]");
				
			for (i=0; i < this._ILb/*sheetoption*/.chartPivot.clusters.length; i++)
			{
				uid = this._ILb/*sheetoption*/.chartPivot.clusters[i].uid;
				eitem[uid] = true;
			}
			
			for (i=0; i < this._ILb/*sheetoption*/.chartPivot.rows.length; i++)
			{
				uid = this._ILb/*sheetoption*/.chartPivot.rows[i].uid;
				eitem[uid] = true;
			}
			
			for (i=0; i < this._ILb/*sheetoption*/.chartPivot.measures.length; i++)
			{
				uid = this._ILb/*sheetoption*/.chartPivot.measures[i].uid;
				dpm.push(IG$/*mainapp*/._I1e/*CloneObject*/(this._ILb/*sheetoption*/.chartPivot.measures[i]));
				eitem[uid] = true;
			}
			
			$.each(["rows", "cols", "measures", "queryItems"], function(ind, value) {
				for (i=0; i < panel._ILb/*sheetoption*/[value].length; i++)
				{
					uid = panel._ILb/*sheetoption*/[value][i].uid;
					if (typeof eitem[uid] == 'undefined')
					{
						dp.push(IG$/*mainapp*/._I1e/*CloneObject*/(panel._ILb/*sheetoption*/[value][i]));
					}
				}
			});
			
			slicemetrics.store.loadData(dp, false);
			slicemeasures.store.loadData(dpm, false);
		}
	},
	
	_ic/*initComponent*/: function() {
		var me = this;
		
		IG$/*mainapp*/.apply(this, {
			items: [
				{
					xtype: "gridpanel",
					name: "slicemetrics",
					hideHeaders: true,
					flex: 1,
					enableDragDrop: true,
					enableDD: true,
					useArrows: true,
					ddGroup: 'SliceDDGroup',
										
					store: {
						fields: [
							"name", "type", "nodepath", "uid", "itemtype"
						]
					},
					columns: [
						{
							text: IRm$/*resources*/.r1('B_NAME'),
							flex: 1,
							sortable: false,
							dataIndex: 'name'
						}
					]
				},
				{
					xtype: "displayfield",
					text: "Measures",
					border: false
				},
				{
					xtype: "gridpanel",
					name: "slicemeasures",
					hideHeaders: true,
					flex: 1,
					store: {
						fields: [
							"name", "type", "uid", "nodepath", "itemtype"
						]
					},
					viewConfig: {
						plugins: {
							ptype: 'gridviewdragdrop',
							ddGroup: 'SliceDDGroup'
						},
						listeners: {
							beforedrop: function(node, data, dropRec, dropPosition, dropFunction) {
								var r = true,
									index,
									rc = (data.records && data.records.length > 0) ? data.records[0] : null,
									location = (dropRec) ? dropRec.data.location : null, 
									hasitem = false, 
									typename = rc.get("type") || rc.get("itemtype"),
									i;
									
								data.copy = false;
								
								if (typename !== "Measure")
									r = false;
								
								return r;
							},
							
							drop: function(node, data, dropRec, dropPosition) {
								var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view',
									rc = (data.records && data.records.length > 0) ? data.records[0] : null,
									typename = rc.get("type") || rc.get("itemtype");
									
								if (typename == "Measure")
								{
									return true;
								}
								
								return false;
							}
						}
					},
					columns: [
						{
							text: IRm$/*resources*/.r1('B_NAME'),
							flex: 1,
							sortable: false,
							dataIndex: 'name'
						},
						{
							xtype: 'actioncolumn',
							width: 20,
							items: [
								{
									// icon: './images/delete.png',
									iconCls: "icon-grid-delete",
									tooltip: 'Remove',
									handler: function (grid, rowIndex, colIndex) {
										var slicemetrics = me.down("[name=slicemetrics]");
										var dt = grid.store.data.items[rowIndex].data;
										grid.store.remove(grid.store.data.items[rowIndex]);
										slicemetrics.store.add(dt);
									},
									scope: this
								}
							]
						}
					]
				}
			],
			buttons: [
				{
					xtype: "button",
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						var p = me;
						p.applyChanges.call(p);
					},
					scope: this
				},
				{
					xtype: "button",
					text: IRm$/*resources*/.r1("B_CLOSE"),
					handler: function() {
						var p = me;
						p.hide();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function() {
					this.bInit = true;
					this.applySheetOption();
				}
			}
		});
		
		IG$/*mainapp*/._Iba/*rpc_slice*/.superclass._ic/*initComponent*/.call(this);
	}
});

IG$/*mainapp*/._Ifb_n/*chartplotbandobject*/ = function(bnode) {
	this.valueitems = [
		"enabled", "name", "btype", "value_1", "value_2", "color", "borderwidth", "isxaxis", "rtype", "porder", "showfitexp", "cfitallseries", "cfitshowsum", "cf_lc", "cfitfcs"
	];
	this._1/*parseText*/(bnode);
}

IG$/*mainapp*/._Ifb_n/*chartplotbandobject*/.prototype = {
	_1/*parseText*/: function(bnode) {
		var me = this,
			varr,
			valueitems = me.valueitems,
			i,
			vkey,
			cnodes,
			vval;
			
		me.enabled = true;
		
		if (bnode)
		{
			cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(bnode);
			
			for (i=0; i < cnodes.length; i++)
			{
				vkey = IG$/*mainapp*/._I29/*XGetNodeName*/(cnodes[i]);
				vval = IG$/*mainapp*/._I24/*getTextContent*/(cnodes[i]);
				
				if (vkey == "enabled" || vkey == "showfitexp" || vkey == "cfitallseries" || vkey == "cfitshowsum" || vkey == "isxaxis")
				{
					vval = vval == "T";
				}
				
				me[vkey] = vval;
			}
		}
		
		me.rtype = me.rtype || "linear";
		me.cfitallseries = typeof(me.cfitallseries) == "undefined" ? true : me.cfitallseries;
		me.value_desc = me._gv/*getValueDesc*/();
	},
	_2/*getText*/: function() {
		var me = this,
			varr,
			valueitems = me.valueitems,
			i,
			vkey, vvalue,
			r = "<band>";
			
		for (i=0; i < valueitems.length; i++)
		{
			vkey = valueitems[i];
			vvalue = me[vkey];
			

			if (vkey == "enabled" || vkey == "showfitexp" || vkey == "cfitallseries" || vkey == "cfitshowsum" || vkey == "isxaxis")
			{
				r += "<" + vkey + ">" + (vvalue ? "T" : "F") + "</" + vkey + ">";
			}
			else
			{
				r += "<" + vkey + "><![CDATA[" + (vvalue || "") + "]]></" + vkey + ">";
			}
		}
		
		r += "</band>";
			
		return r;
	},
	_3/*readRecords*/: function(rec) {
		var me = this,
			valueitems = me.valueitems,
			i,
			vkey,
			vval;
			
		for (i=0; i < valueitems.length; i++)
		{
			vkey = valueitems[i];
			vval = rec.get(vkey);
			
			me[vkey] = vval;
		}
		
		me.value_desc = me._gv/*getValueDesc*/();
	},
	
	_4/*updateRecords*/: function(rec) {
		var me = this,
			valueitems = me.valueitems,
			i,
			vkey,
			vval;
			
		for (i=0; i < valueitems.length; i++)
		{
			vkey = valueitems[i];
			vval = me[vkey];
			
			rec.set(vkey, vval);
		}
		me.value_desc = me._gv/*getValueDesc*/();
		rec.set("value_desc", me.value_desc);
	},
	
	_gv/*getValueDesc*/: function() {
		var bp = this,
			r;
		
		if (bp.btype == "curvefit")
		{
			r = "Curve fit (" + (bp.rtype || "") + ")";
		}
		else if (bp.btype == "band")
		{
			r = (bp.value_1 || "No value") + " ~ " + (bp.value_2 || "No value");
		}
		else
		{
			r = bp.value_1 || "No value";
		}
		return r;
	},
	
	_v1: function(v, isxaxis) {
		var me = this,
			r,
			fs,
			n1, n2,
			ms,
			seq,
			i,
			fval,
			i, j, c;
		
		if (me.mresult)
		{
			if (isxaxis)
			{
				fval = Number(v);
				
				if (isNaN(fval))
				{
					for (i=0; i < me.mresult.data.length; i++)
					{
						for (j=0; j < me.mresult.col; j++)
						{
							c = (j == 0) ? me.mresult.data[i][j].text : c + " " + me.mresult.data[i][j].text; 
						}
						
						if (v == c)
						{
							fval = i - 1;
							break;
						}
					}
				}
				
				return fval;
			}
			
			fs = me.mresult.fs_/*statistics*/;
			
			n1 = v.indexOf("{");
			n2 = v.indexOf("}");
			
			while (n1 > -1 && n2 > n1)
			{
				ms = v.substring(n1+1, n2);
				seq = -1;
				
				if (ms.indexOf(":") > -1)
				{
					seq = parseInt(ms.substring(ms.indexOf(":") + 1));
					ms = ms.substring(0, ms.indexOf(":"));
				}
				
				if (seq > -1)
				{
					ms = fs[seq][ms.toLowerCase()];
				}
				else
				{
					ms = ms.toLowerCase();
					fval = null;
					for (i=0; i < fs.length; i++)
					{
						switch(ms)
						{
						case "average":
							fval = (i == 0) ? Number(fs[i].average) : fval + Number(fs[i].average);
							break;
						case "min":
							fval = (i == 0) ? Number(fs[i].min) : Math.min(fval, Number(fs[i].min));
							break;
						case "max":
							fval = (i == 0) ? Number(fs[i].max) : Math.max(fval, Number(fs[i].max));
							break;
						}
					}
					
					if (ms == "average" && fs.length > 0)
					{
						fval = fval / fs.length;
					}
					
					ms = fval;
				}
				
				v = ms + v.substring(n2+1);
				n1 = v.indexOf("{");
				n2 = v.indexOf("}");
			}
		}
		
		if (v.indexOf("/") > -1 || v.indexOf("*") > -1 || v.indexOf("-") > -1 || v.indexOf("+") > -1)
		{
			v = eval(v);
		}
		
		r = Number(v);
		
		return r;
	}
};

IG$/*mainapp*/.__c_/*chartoption*/.chartcateg = [
	{name: "All", value: "all"},
	{name: "General", value: "cartesian"},
	{name: "Pie and dashboard", value: "pie"},
	{name: "Scatter and point chart", value: "point"},
	{name: "Stock and Low High analysis", value: "stock"},
	{name: "Tree map", value: "tree"},
	{name: "Relation finding", value: "relation"},
	{name: "Scientific analysis", value: "scientific"},
	{name: "Statistical data visualization", value: "statistics"},
	{name: "Map and Geographical", value: "map"}
]
IG$/*mainapp*/.__c_/*chartoption*/.charttype = [
	 {label:"Column", charttype:"cartesian", subtype:"column", img: "column", grp: "cartesian"},
	 {label:"Line", charttype:"cartesian", subtype:"line", img: "line", grp: "cartesian"},
	 {label:"Spline", charttype:"cartesian", subtype:"spline", img: "line", grp: "cartesian"},
	 {label:"Area", charttype:"cartesian", subtype:"area", img: "area", grp: "cartesian"},
	 {label:"Spline Area", charttype:"cartesian", subtype:"areaspline", img: "area", grp: "cartesian"},
	 {label:"Bar", charttype:"cartesian", subtype:"bar", img: "bar", grp: "cartesian"},
	 {label:"Pie", charttype:"pie", subtype:"pie", img: "pie", grp: "pie"},
	 {label:"Doughnut", charttype:"pie", subtype:"doughnut", img: "pie", grp: "pie"},
	 {label:"Bubble", charttype:"bubble", subtype:"bubble", img: "bubble", grp: "point"},
	 {label:"Scatter", charttype:"scatter", subtype:"scatter", img: "bubble", grp: "point"},
	 {label:"Treemap", charttype:"treemap", subtype:"treemap", img: "treemap", grp: "tree"},
	 {label:"Waterfall", charttype:"cartesian", subtype:"waterfall", img: "waterfall", grp: "cartesian"},
	 {label:"Synchronized Chart", charttype: "cartesian", subtype: "syncchart", img: "syncchart", grp: "cartesian"},
	 // {label:"Bubble Indicator", charttype:"bindc", subtype:"bindc", img: "bindc"},
	 {label:"Radar", charttype:"radar", subtype:"radar", img: "radar"},
	 {label:"Funnel", charttype: "funnel", subtype: "funnel", img: "funnel"},
	 {label:"Pyramid", charttype: "pyramid", subtype: "pyramid", img: "pyramid"},
	 // {label:"Candlestick", charttype:"candlestick", subtype:"candlestick", img: "candlestick"},
	 // {label:"OHLC", charttype:"candlestick", subtype:"ohlc", img: "hloc"},
	 // {label:"World Map", charttype:"map", subtype:"worldmap"},
	 {label:"Map", charttype:"map", subtype:"map", img: "usmap", grp: "map"},
	 // {label:"Seoul Map", charttype:"map", subtype:"seoulmap"},
	 {label:"Comparision Matrix", charttype:"matrix", subtype:"matrix", img: "compmatrix", grp: "relation"},
	 {label:"Parallel Coordinates", charttype:"parallel", subtype: "parallel", img: "parallel", grp: "scientific"},
	 {label:"Mean & Deviation", charttype:"performancemap", subtype: "performancemap", img: "performancemap", grp: "statistics"},
	 {label:"Box Plot", charttype:"boxplot", subtype: "boxplot", img: "boxplot", grp: "stock"},
	 {label:"Network Diagram(+)", charttype:"networkdiagram_pos", subtype: "networkdiagram_pos", img: "networkdiagram", grp: "relation"},
	 {label:"Network Diagram(-)", charttype:"networkdiagram_neg", subtype: "networkdiagram_neg", img: "networkdiagram", grp: "relation"},
	 {label:"Matrix Diagram", charttype:"matrixdiagram", subtype: "matrixdiagram", img: "matrixdiagram", grp: "relation"},
	 {label:"Force-Directed Layouts", charttype:"forcelayout", subtype: "forcelayout", img: "force", grp: "relation"},
	 {label:"Cluster Chart", charttype: "anderson", subtype: "anderson", img: "cluster", grp: "scientific"},
	 {label:"Chord Chart", charttype: "chord", subtype: "chord", img: "chord", grp: "scientific"},
	 {label:"Sun burst Chart", charttype: "sunburst", subtype: "sunburst", img: "sunburst", grp: "scientific"},
	 {label:"Time series chart", charttype: "nation", subtype: "nation", img: "timeseries", grp: "scientific"},
	 {label:"Bubble map", charttype: "bubblemap", subtype: "bubblemap", img: "bubblemap", grp: "scientific"},
	 // {label:"Radar", charttype: "cartesian", subtype: "radar", img: "radar", grp: "cartesian"},
	 {label:"Fixed Placement", charttype: "cartesian", subtype: "fixedplacement", img: "fixedplacement", grp: "cartesian"}
];

IG$/*mainapp*/.__c_/*chartoption*/.chartcolors = {
	"office_2013": [
		"#5b9bd5", "#ed7d31", "#a5a5a5", "#ffc000", "#4472c4", "#70ad47", "#255e91", "#9e480e", "#636363", "#997300", "#264478", "#43682b"
	],
	"theme 1": [
		"#5b9bd5", "#a5a5a5", "#4472c4", "#255e91", "#636363", "#264478", "#7cafdd", "#b7b7b7", "#698ed0", "#327dc2", "#848484", "#335aa1", "#9dc3e6", "#c9c9c9"
	],
	"theme 2": [
		"#ed7d31", "#ffc000", "#70ad47", "#9e480e", "#997300", "#43682b", "#f1975a", "#ffcd33", "#8cc168", "#d26012", "#cc9a00", "#5a8a39"
	],
	"theme 3": [
		"#70ad47", "#4472c4", "#ffc000", "#43682b", "#264478", "#997300", "#8cc168", "#698ed0", "#ffcd33", "#5a8a39", "#335aa1", "#cc9a00"
	],
	"signika": [
		"#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
	],
	"light-color": [
		"#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
	],
	"dark-color": [
		"#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
	],
	"combo1574": [
		"#7A3E48", "#EECD86", "#E18942", "#B95835", "#3D3242", "#06354F"
	],
	"combo1573": [
		"#7C786A", "#8DCDC1", "#D3E397", "#FFF5C3", "#EB6E44"
	],
	"combo1572": [
		"#6194BC", "#A5D1F3", "#D0EAFF", "#E4001B", "#ECECEC", "#606060"
	]
};

IG$/*mainapp*/.rp$C/*chartViewer*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	Df/*drillFilter*/: [],
	border: false,
	
	_IPb/*maincontainer*/: null,
	
	meB/*drilldepth*/: 0,
	cPm/*chartpanels*/: [],
	showtoolbar: false,
	
	eventowner: null,
	eventhandler: null,
	
	_ILa/*reportoption*/: null,
	_ILb/*sheetoption*/: null,
	
	fC/*selectedChart*/: null,
	
	resized: false,

	_IL0/*initCustomControl*/: function() {
		var me = this,
			w,
			h,
			chart,
			browser = window.bowser;
			
		if (!me.el)
		{
			return;
		}
		
		w = me.getWidth();
		h = me.getHeight();
	
		// me.removeAll();
		
		chart = me.el.dom;
		
		if (me.drillup)
		{
			me.drillup.remove();
		}
		me.drillup = null;
		
		if (browser.msie && w > 0 && h > 0)
		{
			chart[0].style.width = w + "px";
			chart[0].style.height = h + "px";
		}
	},
	
	showSlicePivot: function() {
		var me = this,
			w = me.getWidth() - 20;
		
		me.slicehelper._ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
		me.slicehelper.applySheetOption.call(me.slicehelper);
		me.slicehelper.setSize(220, 350);
		me.slicehelper.setPosition(w - me.slicehelper.width, 0);
		me.slicehelper.show();
	},
	
	applyDropSlice: function(l, rec, dropped) {
		var me = this,
			i,
			item = rec.data,
			data;
		
		data = new IG$/*mainapp*/._IE8/*clItems*/(null);
		data._I1d/*CopyObject*/(data, item);
			
		if (l == "slice")
		{
			if (dropped == true)
			{
				me._ILb/*sheetoption*/.chartPivot.clusters.push(data);
			}
			me.slicehelper.dropSliceArea.call(me.slicehelper, data, dropped);
		}
		else if (l == "xaxis")
		{
			if (dropped == true)
			{
				me._ILb/*sheetoption*/.chartPivot.rows.push(data);
			}
			me.slicehelper.dropSliceArea.call(me.slicehelper, data, dropped);
		}
		
		// me.validateSliceView();
		me.updateReport();
	},
	
	updateReport: function() {
		var me = this;
		
		me._IPb/*maincontainer*/._IP4/*procUpdateReport*/.call(me._IPb/*maincontainer*/);
	},
	
//	validateSliceView: function() {
//		var i,
//			me = this,
//			tdock = me.down("[name=tdock]"),
//			ldock = me.down("[name=ldock]"),
//			cslicemetric = me.cslicemetric;
//		
//		cslicemetric && cslicemetric.setText(me._ILb/*sheetoption*/.chartPivot.clusters.length > 0 ? "" : "Drag Slice Dimension");
//		cslicemetric && cslicemetric.setVisible(me._ILb/*sheetoption*/.chartPivot.clusters.length > 0 ? false : true);
//		
//		if (tdock)
//		{
//			for (i=tdock._IT.length-1; i>=0; i--)
//			{
//				if (tdock._IT[i].uid)
//				{
//					tdock.remove(tdock._IT[i]);
//				}
//			}
//		}
//		
//		if (ldock)
//		{
//			for (i=ldock._IT.length-1; i>=0; i--)
//			{
//				if (ldock._IT[i].uid)
//				{
//					ldock.remove(ldock._IT[i]);
//				}
//			}
//		}
//		
//		if (me._ILb/*sheetoption*/.chartPivot.clusters.length > 0)
//		{
//			$.each(me._ILb/*sheetoption*/.chartPivot.clusters, function(i, cluster) // for (i=0; i < me._ILb/*sheetoption*/.chartPivot.clusters.length; i++)
//			{
//				var btn = new IG$/*mainapp*/.pb({
//					xtype: "splitbutton",
//					text: cluster.name,
//					uid: cluster.uid,
//					isbutton: true,
//					menu: {
//						items: [
//							{
//								text: "Remove",
//								handler: function() {
//									var btn = this,
//										uid = cluster.uid,
//										i;
//									
//									for (i=0; i < me._ILb/*sheetoption*/.chartPivot.clusters.length; i++)
//									{
//										if (uid == me._ILb/*sheetoption*/.chartPivot.clusters[i].uid)
//										{
//											var item = me._ILb/*sheetoption*/.chartPivot.clusters[i];
//											me._ILb/*sheetoption*/.chartPivot.clusters.splice(i, 1);
//											
//											me.applyDropSlice("slice", item, false);
//											
//											me.validateSliceView.call(me);
//											break;
//										}
//									}
//								}
//							},
//							{
//								text: "Move up",
//								handler: function() {
//									var uid = cluster.uid,
//										i,
//										n,
//										item;
//										
//									for (i=0; i < me._ILb/*sheetoption*/.chartPivot.clusters.length; i++)
//									{
//										if (uid == me._ILb/*sheetoption*/.chartPivot.clusters[i].uid)
//										{
//											n = i;
//											break;
//										}
//									}
//									
//									if (n > 0)
//									{
//										item = me._ILb/*sheetoption*/.chartPivot.clusters[n];
//										me._ILb/*sheetoption*/.chartPivot.clusters.splice(n, 1);
//										me._ILb/*sheetoption*/.chartPivot.clusters.splice(n-1, 0, item);
//										me.validateSliceView.call(me);
//										me.updateReport.call(me);
//									}
//								}
//							},
//							{
//								text: "Move down",
//								handler: function() {
//									var uid = cluster.uid,
//										i,
//										n,
//										item;
//										
//									for (i=0; i < me._ILb/*sheetoption*/.chartPivot.clusters.length; i++)
//									{
//										if (uid == me._ILb/*sheetoption*/.chartPivot.clusters[i].uid)
//										{
//											n = i;
//											break;
//										}
//									}
//									
//									if (n + 1 < me._ILb/*sheetoption*/.chartPivot.clusters.length)
//									{
//										item = me._ILb/*sheetoption*/.chartPivot.clusters[n];
//										me._ILb/*sheetoption*/.chartPivot.clusters.splice(n, 1);
//										me._ILb/*sheetoption*/.chartPivot.clusters.splice(n+1, 0, item);
//										me.validateSliceView.call(me);
//										me.updateReport.call(me);
//									}
//								}
//							}
//						]
//					}
//				});
//				
//				tdock.insert(i+1, btn);
//			});
//		}
//		
//		me.cdimension.setText(me._ILb/*sheetoption*/.chartPivot.rows.length > 0 ? "" : "Drag XAxis Dimension");
//		me.cdimension.setVisible(me._ILb/*sheetoption*/.chartPivot.rows.length > 0 ? false : true);
//		
//		if (me._ILb/*sheetoption*/.chartPivot.rows.length > 0)
//		{
//			$.each(me._ILb/*sheetoption*/.chartPivot.rows, function(m, row) // for (i=0; i < me._ILb/*sheetoption*/.chartPivot.rows.length; i++)
//			{
//				var btn = new IG$/*mainapp*/.pb({
//					xtype: "splitbutton",
//					text: row.name,
//					uid: row.uid,
//					isbutton: true,
//					menu: {
//						items: [
//							{
//								text: "Remove",
//								handler: function() {
//									var btn = this,
//										uid = row.uid,
//										i;
//									
//									for (i=0; i < me._ILb/*sheetoption*/.chartPivot.rows.length; i++)
//									{
//										if (uid == me._ILb/*sheetoption*/.chartPivot.rows[i].uid)
//										{
//											var item = me._ILb/*sheetoption*/.chartPivot.rows[i];
//											me.applyDropSlice("xaxis", item, false);
//											me._ILb/*sheetoption*/.chartPivot.rows.splice(i, 1);
//											
//											me.validateSliceView.call(me);
//											break;
//										}
//									}
//								}
//							},
//							{
//								text: "Move up",
//								handler: function() {
//									var uid = row.uid,
//										i,
//										n,
//										item;
//										
//									for (i=0; i < me._ILb/*sheetoption*/.chartPivot.rows.length; i++)
//									{
//										if (uid == me._ILb/*sheetoption*/.chartPivot.rows[i].uid)
//										{
//											n = i;
//											break;
//										}
//									}
//									
//									if (n > 0)
//									{
//										item = me._ILb/*sheetoption*/.chartPivot.rows[n];
//										me._ILb/*sheetoption*/.chartPivot.rows.splice(n, 1);
//										me._ILb/*sheetoption*/.chartPivot.rows.splice(n-1, 0, item);
//										me.validateSliceView.call(me);
//										me.updateReport.call(me);
//									}
//								}
//							},
//							{
//								text: "Move down",
//								handler: function() {
//									var uid = row.uid,
//										i,
//										n,
//										item;
//										
//									for (i=0; i < me._ILb/*sheetoption*/.chartPivot.rows.length; i++)
//									{
//										if (uid == me._ILb/*sheetoption*/.chartPivot.rows[i].uid)
//										{
//											n = i;
//											break;
//										}
//									}
//									
//									if (n + 1 < me._ILb/*sheetoption*/.chartPivot.rows.length)
//									{
//										item = me._ILb/*sheetoption*/.chartPivot.rows[n];
//										me._ILb/*sheetoption*/.chartPivot.rows.splice(n, 1);
//										me._ILb/*sheetoption*/.chartPivot.rows.splice(n+1, 0, item);
//										me.validateSliceView.call(me);
//										me.updateReport.call(me);
//									}
//								}
//							}
//						]
//					}
//				});
//				ldock.insert(i+1, btn);
//			});
//		}
//	},
	
	_IKc/*applyReportResult*/: function(_IK2/*mresults*/, _IK9/*olapset*/, _ILa/*reportoption*/, _ILb/*sheetoption*/, ispageview) {
		var me = this,
			chart = me.body ? me.body.dom : null,
			jdom = chart ? $(chart) : null,
			toolbar = null,
			cw = jdom ? IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom) : 0,
			ch = jdom ? IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom) : 0;
		
		if (cw > 0 && ch > 0)
		{
			clearTimeout(me._xo);
			me._IK2/*mresults*/ = _IK2/*mresults*/;
			me._IK9/*olapset*/ = _IK9/*olapset*/;
			me._ILa/*reportoption*/ = _ILa/*reportoption*/;
			me._ILb/*sheetoption*/ = _ILb/*sheetoption*/;
			
			if (me.resized == true || (cw > 10 && ch > 10))
			{
				me.resized = false;
				me.F2r/*applyReportResultRender*/(me._IK2/*mresults*/, me._IK9/*olapset*/, me._ILa/*reportoption*/, me._ILb/*sheetoption*/, ispageview);
			}
			else
			{
				// me.doComponentLayout.call(me);
				me.rRe/*applyRenderer*/(ispageview);
			}
		}
		else
		{
			clearTimeout(me._xo);
			
			me._xo = setTimeout(function() {
				me._IKc/*applyReportResult*/.call(me, _IK2/*mresults*/, _IK9/*olapset*/, _ILa/*reportoption*/, _ILb/*sheetoption*/, ispageview);
			}, 300);
		}
	},
	
	rRe/*applyRenderer*/: function(ispageview) {
		var me = this;
		
		setTimeout(function() {
			var w = me.el ? me.el.getWidth() : 0,
				h = me.el ? me.el.getHeight() : 0;
				
			if (w > 10 && h > 10)
			{
				me.F2r/*applyReportResultRender*/.call(me, me._IK2/*mresults*/, me._IK9/*olapset*/, me._ILa/*reportoption*/, me._ILb/*sheetoption*/, ispageview);
			}
			else
			{
				me.rRe/*applyRenderer*/.call(me, ispageview);
			}
		}, 100);
	},
	
	cc1/*createPanel*/: function(dmode, clusterindex, mlength, ispageview) {
		var me = this,
			cme,
			opt,
			cpanel;
		
		// dmode == 1 : cluser chart
		// dmode == 2 : drill chart
		// dmode == 0 : normal chart
		
		if (me.cPm/*chartpanels*/.length > clusterindex)
		{
			cpanel = me.cPm/*chartpanel*/[clusterindex];
			
			if (cpanel.dmode != dmode)
			{
				dmode != 1 && cpanel.getHeader().hide();
			}
			
			cpanel.dmode = dmode;
			
			cpanel.a1/*afterinit*/.call(cpanel);
		}
		else
		{
			cpanel = new IG$/*mainapp*/.pbc/*container*/({
				"layout": "fit",
				flex: 1,
				x: 0,
				y: 0,
				width: me.width || 200,
				height: me.height || 200,
				dmode: dmode,
				header: (dmode == 1) ? true : false,
				border: true,
				closable: false,
				collapsible: false,
				collapse: "normal",
							
				tools: [
					{
						type: "minimize",
						qtip: "Minimize",
						cls: "x-tool-minimize",
						handler: function(event, toolEl, pobj) {
							var cpanel = pobj.ownerCt,
								p = this;
							cpanel.collapse = (cpanel.collapse == "normal") ? "collapsed" : "normal";
							me.F6/*doClusterLayout*/.call(me);
						},
						scope: this
					},
					{
						type: "maximize",
						cls: "x-tool-maximize",
						qtip: "Maximize",
						handler: function(event, toolEl, pobj) {
							var cpanel = pobj.ownerCt,
								p = this;
							cpanel.collapse = (cpanel.collapse == "normal") ? "maximize" : "normal";
							me.F6/*doClusterLayout*/.call(me);
						},
						scope: this
					}
				],
				
				a1/*afterinit*/: function() {
					var p = this,
						G2/*chartview*/,
						pw = me.width || me.getWidth(),
						ph = me.height || me.getHeight();
						
					p._a1/*loaded*/ = true;
					
					if (p.dmode == 1)
					{
						if (!p.G2/*chartview*/)
						{
							p.G2/*chartview*/ = me.F3/*createChartCtrl*/.call(me, clusterindex, cpanel.body.dom, pw, ph);
						}
						else
						{
							me.a2/*applyChartOptions*/.call(me, p.G2/*chartview*/, clusterindex);
						}
						
						p.setTitle(p.G2/*chartview*/.mresult.clusterdesc);
						
						me.mlength--;
						
						if (me.mlength < 2)
						{
							me.F6/*doClusterLayout*/.call(me, true);
						}
					}
					else
					{
						if (!p.G2/*chartview*/)
						{
							p.G2/*chartview*/ = me.F3/*createChartCtrl*/.call(me, 0, p.body.dom, pw, ph);
						}
						else
						{
							me.a2/*applyChartOptions*/.call(me, p.G2/*chartview*/, clusterindex);
						}
						
						me.F7/*layoutChartPanels*/.call(me, true, ispageview);
					}
				},
				
				listeners: {
					close: function() {
						me.F8/*clusterChartClosed*/.call(me, me);
					},
					
					collapse: function() {
						me.F8/*clusterChartClosed*/.call(me, me);
					},
					expand: function() {
						me.F8/*clusterChartClosed*/.call(me, me);
					},
					resize: function(pobj, w, h) {
						var p = this;
						
						if (!p.G2/*chartview*/)
						{
							return;
						}
						
						if (p.dmode == 1)
						{
							var jdom = $(p.G2/*chartview*/.P1/*maincontainer*/),
								w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom),
								h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom);
							
							p.G2/*chartview*/.Mm12/*invalidateSize*/.call(p.G2/*chartview*/, w, h);
						}
						else if (p.dmode == 2)
						{
							var jdom = $(p.G2/*chartview*/.container),
								w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom),
								h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom);
							
							if (w > 0 && h > 0)
							{
								p.G2/*chartview*/.Mm12/*invalidateSize*/.call(p.G2/*chartview*/, w, h); // p.chartview, w, h);
							}
						}
						else
						{
							if (w > 0 && h > 0)
							{
								p.G2/*chartview*/.Mm12/*invalidateSize*/.call(p.G2/*chartview*/, w, h);
							}
						}
					},
					afterrender: function(cpanel) {
						cpanel.a1/*afterinit*/.call(cpanel);
					}
				}
			});
			
			me.cPm/*chartpanels*/.push(cpanel);
			me.cpm/*containerpanel*/.add(cpanel);
		}
		
		return cpanel;
	},
	
	F2r/*applyReportResultRender*/: function(_IK2/*mresults*/, _IK9/*olapset*/, _ILa/*reportoption*/, _ILb/*sheetoption*/, ispageview) {
		var me = this,
			chart = me.body.dom,
			toolbar = null,
			cpop = null,
//			tdock = me.down("[name=tdock]"),
//			ldock = me.down("[name=ldock]"),
			cslicemin = me.down("[name=cslicemin]"),
			i;
			
		me.cdrillindex = 0;
		
		me.cpm/*containerpanel*/ = me.cpm/*containerpanel*/ || me.down("[name=cpm]"); 
		
		// if (me.cpm/*containerpanel*/)
		// {
		//     me.cpm/*containerpanel*/.removeAll();
		// }

		if (!me.cslicemetric)
		{
//			me.cslicemetric = me.down("[name=slicemetric]");
//			me.cdimension = me.down("[name=cdimension]");
			me.cslicemin = me.down("[name=cslicemin]");
			
//			var dragZone1 = new Ext.dd.DropZone(tdock.body.dom[0], {
//				ddGroup: "SliceDDGroup",
//				
//				getTargetFromEvent: function (ev) {
//					return ".x-grid-cell";
//				},
//
//				onNodeEnter: function(target, dd, ev, data) {
//					//Ext.fly(target)
//				},
//				onNodeOut: function(target, dd, ev, data) {
//				},
//				onNodeOver: function(target, dd, ev, data) {
//					return Ext.dd.DropZone.prototype.dropAllowed;
//				},
//				onNodeDrop: function(target, dd, ev, data) {
//					var d = data.records[0].data;
//					
//					if (d.itemtype == "Metric" || d.itemtype == "TabDimension")
//					{
//						me.applyDropSlice.call(me, "slice", d, true);
//					}
//					
//					return true;
//				}
//			});

//			tdock.body.dom.droppable({
//				// accept: "SliceDDGroup",
//				activeClass: "ui-state-hover",
//				hoverClass: "ui-state-active",
//				drop: function(event, ui) {
//					var d = $(ui.draggable).data("record"),
//						itemtype = d ? d.get("itemtype") : null;
//					
//					if (d && (itemtype == "Metric" || itemtype == "TabDimension" || itemtype == "CustomMetric"))
//					{
//						me.applyDropSlice.call(me, "slice", d, true);
//					}
//					
//					return true;
//				}
//			});
			
//			var dragZone2 = new Ext.dd.DropZone(ldock.body.dom[0], {
//				ddGroup: "SliceDDGroup",
//				getTargetFromEvent: function (ev) {
//					return ".x-grid-cell";
//				},
//				
//				onNodeEnter: function(target, dd, ev, data) {
//					//Ext.fly(target)
//				},
//				onNodeOver: function(target, dd, ev, data) {
//					return Ext.dd.DropZone.prototype.dropAllowed;
//				},
//				onNodeDrop: function(target, dd, ev, data) {
//					var d = data.records[0].data;
//					
//					if (d.itemtype == "Metric" || d.itemtype == "TabDimension")
//					{
//						me.applyDropSlice.call(me, "xaxis", d, true);
//					}
//					return true;
//				}
//			});

//			ldock.body.dom.droppable({
//				// accept: "SliceDDGroup",
//				activeClass: "ui-state-hover",
//				hoverClass: "ui-state-active",
//				drop: function(event, ui) {
//					var d = $(ui.draggable).data("record"),
//						itemtype = d ? d.get("itemtype") : null;
//					
//					if (d && (itemtype == "Metric" || itemtype == "TabDimension" || itemtype == "CustomMetric"))
//					{
//						me.applyDropSlice.call(me, "xaxis", d, true);
//					}
//					
//					return true;
//				}
//			});
		}
		
		if (IG$/*mainapp*/._Iba/*rpc_slice*/)
		{
			me.slicehelper = new IG$/*mainapp*/._Iba/*rpc_slice*/({
				_IPb/*maincontainer*/: me
			});
			
			me.cpm/*containerpanel*/.add(me.slicehelper);
			me.slicehelper._el.dom.css({
				zIndex: 10
			});
		}
		
		if (me._ILb/*sheetoption*/.bcluster)
		{
//			tdock && tdock.setVisible(true);
//			ldock && ldock.setVisible(true);
			cslicemin && cslicemin.setVisible(true);
//			
//			me.validateSliceView();
			
			me.mlength = me._IK2/*mresults*/.results.length;
			
			var n = me._IK2/*mresults*/.results.length;
			
			for (i=n; i < me.cPm/*chartpanels*/.length; i++)
			{
				me.cpm/*containerpanel*/.remove(me.cPm/*chartpanels*/[i]);
			}
			
			me.cPm/*chartpanels*/.splice(n, me.cPm/*chartpanels*/.length - n);
			
			me.__d1/*drawmode*/ = 1;
			
			// for (i=0; i < me._IK2/*mresults*/.results.length; i++)
			$.each(me._IK2/*mresults*/.results, function(i, item) {
			
				var cpanel = me.cc1/*createPanel*/.call(me, 1, i, undefined, ispageview);
				cpanel.show();
				// me.cPm/*chartpanels*/.push(cpanel);
				// me.cpm/*containerpanel*/.add(cpanel);
			});
		}
		else
		{
//			tdock && tdock.setVisible(false);
//			ldock && ldock.setVisible(false);
			me.down("[name=cslicemin]").setVisible(false);
			
			me.__d1/*drawmode*/ = 0;
			
			for (i=me.cPm/*chartpanels*/.length; i>0; i--)
			{
				me.cpm/*containerpanel*/.remove(me.cPm/*chartpanels*/[i]);
			}
			
			me.cPm/*chartpanels*/.splice(1, me.cPm/*chartpanels*/.length-1);
			
			var cpanel = me.cc1/*createPanel*/.call(me, 0, 0, undefined, ispageview);
			cpanel.show();
			
			me.sd/*selfdrill*/ = false;
			
			if (me._ILb/*sheetoption*/.cco/*chartOption*/.enabledrill == true && me._ILb/*sheetoption*/.rows.length > 1)
			{
				me.sd/*selfdrill*/ = true;
				
				if (!me.charttoolbar)
				{
					me.carea = $("<div class='idv-cht-tb-cont'></div>");
					me.carea.css({position: "absolute", height: 22, right: 0, top: 0});
					me.carea.appendTo(me.body.dom);
					
					me.charttoolbar = $("<div class='mec-chart-toolbar'></div>").appendTo(me.carea);
					me.cpop = $("<div class='idv-cht-pop'></div>").appendTo($(document.body));
				}
				
				toolbar = me.charttoolbar;
				cpop = me.cpop;
				
				if (toolbar)
				{
					toolbar.empty();
					toolbar.show();
					
					// IG$/*mainapp*/._I32/*charttypemenu*/
					
					function hidePop(e) {
						var body = $(document.body),
							off = cpop.offset(), w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(cpop), h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(cpop),
							ex = e && e.pageX, ey = e && e.pageY;
							
						ex = ex || -1;
						ey = ey || -1;
						
						if (off.left < ex && ex < off.left + w && off.top < ey && ey < off.top + h)
						{
							return;
						}
						cpop.hide();
						body.unbind("click", hidePop);
					}
					
					function showPop(btn, menus, e) {
						var me = $(btn),
							off = me.offset(),
							body = $(document.body);
							
						body.unbind("click", hidePop);
						
						e && e.stopPropagation();
						
						cpop.show();
						cpop.empty();
						cpop.css({top: off.top + 20, left: off.left});
						ul = $("<ul></ul>").appendTo(cpop);
						
						$.each(menus, function(i, menu) {
							var li = $("<li></li>").appendTo(ul);
							li.text(menu.text);
							li.bind("click", function() {
								menu.handler.call(menu.scope, menu.opt || null);
								hidePop();
							});
						});
						
						body.bind("click", hidePop);
					}
					
					// for (i=0; i < me._ILb/*sheetoption*/.rows.length; i++)
					$.each(me._ILb/*sheetoption*/.rows, function(i, row)
					{
						var j, tmenu = [],
							btn, mbtn;
						if (i > 0)
						{
							for (j=0; j < IG$/*mainapp*/._I32/*charttypemenu*/.length; j++)
							{
								var menu = {
									text: IG$/*mainapp*/._I32/*charttypemenu*/[j].label,
									opt:  {
										meB/*drilldepth*/: i,
										subtype: IG$/*mainapp*/._I32/*charttypemenu*/[j].subtype
									},
									handler: function(opt) {
										me.F2c/*changeDrillChartType*/.call(me, opt);
									},
									scope: me
								};
								tmenu.push(menu);
							}
							
							btn = $("<div class='idv-cht-btn-d'></div>").appendTo(toolbar);
							btn.text(row.name);
							btn.bind("click", function() {
								me.F5/*processDrillUpIndex*/.call(me, i);
							});
							
							mbtn = $("<div class='idv-cht-btn-m'></div>").appendTo(toolbar);
							mbtn.bind("click", function(e) {
								showPop(btn, tmenu, e);
							});
						}
						else
						{
							btn = $("<div class='idv-cht-btn-d idv-cht-nmarg'></div>").appendTo(toolbar);
							btn.text(row.name);
							btn.bind("click", function() {
								me.F5/*processDrillUpIndex*/.call(me, 0);
							});
						}
					});
					
					var btn = $("<div class='idv-cht-btn-d idv-cht-pad'>Layout<div>").appendTo(toolbar),
						ul,
						cmenu = [
							{
						    	text: IRm$/*resources*/.r1("L_LAYOUT_NORMAL"),
						    	handler: function () {
						    		var p = this;
						    		p._ILb/*sheetoption*/.cco/*chartOption*/.drillviewmode = 0;
						    		p.F7/*layoutChartPanels*/(false);
						    	},
						    	scope: me
						    },
						    {
						    	text: IRm$/*resources*/.r1("L_LAYOUT_POPUP"),
						    	handler: function () {
						    		var p = this;
						    		
						    		p._ILb/*sheetoption*/.cco/*chartOption*/.drillviewmode = 1;
						    		p.F7/*layoutChartPanels*/(false);
						    	},
						    	scope: me
						    },
						    {
						    	text: IRm$/*resources*/.r1("L_LAYOUT_CASCADE"),
						    	handler: function () {
						    		var p = this;
						    		p._ILb/*sheetoption*/.cco/*chartOption*/.drillviewmode = 2;
						    		p.F7/*layoutChartPanels*/(false);
						    	},
						    	scope: me
						    },
						    {
						    	text: IRm$/*resources*/.r1("L_LAYOUT_HORIZONTAL"),
						    	handler: function () {
						    		var p = this;
						    		p._ILb/*sheetoption*/.cco/*chartOption*/.drillviewmode = 3;
						    		p.F7/*layoutChartPanels*/(false);
						    	},
						    	scope: me
						    },
						    {
						    	text: IRm$/*resources*/.r1("L_LAYOUT_VERTICAL"),
						    	handler: function () {
						    		var p = this;
						    		p._ILb/*sheetoption*/.cco/*chartOption*/.drillviewmode = 4;
						    		p.F7/*layoutChartPanels*/(false);
						    	},
						    	scope: me
						    }
						];
					
					btn.bind("click", function(e) {
						showPop(this, cmenu, e);
					});
				}
			}
			else
			{
				toolbar = me.charttoolbar;
				me.meB/*drilldepth*/ = 0;
				if (toolbar)
				{
					toolbar.empty();
					toolbar.hide();
				}
			}
		}
	},
	
	F2c/*changeDrillChartType*/: function(menu) {
		var me = this,
			meB/*drilldepth*/ = menu.meB/*drilldepth*/,
			subtype = menu.subtype,
			ntype,
			G2/*chartview*/ = (me.cPm/*chartpanels*/.length > meB/*drilldepth*/) ? me.cPm/*chartpanels*/[meB/*drilldepth*/].G2/*chartview*/ : null;
			
		if (G2/*chartview*/)
		{
			ntype = G2/*chartview*/._ILb/*sheetoption*/.cco/*chartOption*/.getChartInfoBySubType(subtype).id;
			G2/*chartview*/._ILb/*sheetoption*/.cco/*chartOption*/.drillcharttype[meB/*drilldepth*/-1] = ntype; 
			me.F3a/*drawChartCtrl*/(G2/*chartview*/);
		}
	},
	
	F3/*createChartCtrl*/: function(clusterindex, chart, tw, th) {
		var me = this,
			G2/*chartview*/,
			drawchart;
		
		G2/*chartview*/ = new IG$/*mainapp*/._I95/*olapChartView*/(me, me.uid, chart, tw, th);
		me.a2/*applyChartOptions*/(G2/*chartview*/, clusterindex);
		
		G2/*chartview*/.f4/*onClickEventHandler*/ = me.F4/*chartClickHandler*/;
		G2/*chartview*/.f4a/*onClickEventOwner*/ = me;
		G2/*chartview*/.__sch/*scrollhandler*/ = {
			f: me.__sch/*scrollhandler*/,
			o: me
		};
		
		return G2/*chartview*/;
	},
	
	a2/*applyChartOptions*/: function(G2/*chartview*/, clusterindex) {
		var me = this;
		
		G2/*chartview*/.ddt/*drillDepth*/ = 0;
		if (me._IK2/*mresults*/)
		{
			G2/*chartview*/._IL8/*jobid*/ = me._IK2/*mresults*/._IL8/*jobid*/;
			G2/*chartview*/.mresult = me._IK2/*mresults*/.results[clusterindex];
		}
		G2/*chartview*/._ILa/*reportoption*/ = me._ILa/*reportoption*/;
		G2/*chartview*/._ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
	},
	
	__r1/*requestData*/: function(view, option) {
		var me = this;
		
		me.fireEvent("request_data", me, view, option);
	},
	
	__sch/*scrollhandler*/: function(view, nrow) {
		var me = this,
			scrollX = view.scrollX,
			mresult = view.mresult,
			nrow,
			drawchart;
		
		if (view.mresult.pagestart > 0 || view.mresult.pageend < view.mresult.rows)
		{
			// pagemode : check for request data
			if ((view.mresult.pagestart > 0 && view.mresult.pagestart > scrollX) || view.mresult.pageend  < scrollX + view._dlen)
			{
				me.fireEvent("scroll_request", me, nrow);
				
				return;
			}
			
			if (view.mresult.pagestart > 0)
			{
				// scrollX -= me._tsh * me.__tpstart;
			}
		}
		
		drawchart = view.dcr/*drawChartResult*/.call(view, view.cwidth, view.cheight, true);
		
		view.disposeContent.call(view, view);
		
		view._bN/*bandFormula*/.empty();
		view._bN/*bandFormula*/.hide();
		
		if (view.isHighChart == true)
		{
			$.each(drawchart, function(i, d) {
				var masterChart = new Highcharts.Chart(d),
					n,
					chartoption = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.cco/*chartOption*/ : null,
					charttype = chartoption ? chartoption.subtype : null,
					tnodes; //, function(masterChart) {me.createDetail(masterChart)});
				view._mc/*masterCharts*/.push(masterChart);
				me.__sel_s = null;
				
				if (mresult && mresult.__bands && mresult.__bands.length)
				{
					tnodes = mresult.__bands;
					for (n=0; n < tnodes.length; n++)
	        		{
	        			me.dB/*drawBand*/.call(me, masterChart, tnodes[n], charttype, view);
	        		}
				}
				else if (d.__cf && d.__cf.length)
				{
					me._cf/*curvefit*/.call(me, masterChart, d.__cf, charttype, view);
				}
			});
		}
	},
	
	_cf/*curvefit*/: function(mc, cf, charttype, view) {
		var me = this,
			olapset = me._IK9/*olapset*/,
			chartoption = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.cco/*chartOption*/ : null,
			mb = "<smsg><option charttype='" + ((chartoption ? chartoption.subtype : "") || "") + "'>",
			i;
			
		for (i=0; i < cf.length; i++)
		{
			mb += cf[i]._2/*getText*/();
		}
			
		mb += "</option></smsg>";
			
		if (olapset)
		{
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me,
				{
		            ack: "18",
					payload: "<smsg><item uid='" + olapset.uid + "' jobid='" + olapset._IL8/*jobid*/ + "' option='curvefit'/></smsg>",
					mbody: mb
		        }, me, function(xdoc) {
		        	var me = this,
		        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/results/bands"),
		        		tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
		        		i;
		        		
		        	if (tnodes)
		        	{
		        		for (i=0; i < tnodes.length; i++)
		        		{
		        			me.dB/*drawBand*/(mc, tnodes[i], mb, view);
		        		}
		        	}	
		        }
		    );
			req._l/*request*/();
		}
	},
	
	dB/*drawBand*/: function(mc, tnode, charttype, view) {
		var me = this,
			series = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "series"),
			aseries = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "all_series"),
			bconf = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "config/band"),
			sconf = new IG$/*mainapp*/._Ifb_n/*chartplotbandobject*/(bconf),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(series),
			knodes = aseries ? IG$/*mainapp*/._I26/*getChildNodes*/(aseries) : null,
			fhtml = view._bN/*bandFormula*/,
			showfitexp = sconf.showfitexp;
		
		showfitexp != false && fhtml.show();
		
		$.each([tnodes, knodes], function(k, mnodes) {
			if (mnodes)
			{
				var ul;
				
				ul = $("<ul></ul>").appendTo(fhtml);
				
				// for (i=0; i < mnodes.length; i++)
				$.each(mnodes, function(r, mnode) {
					var i, j,
						xmin,
						xmax,
						cfit,
						rtype,
						formula,
						formula_html,
						params,
						pnode,
						pnodes,
						tval,
						bname,
						sname,
						pdiv,
						rs, rsadj,
						rsdesc = "",
						stnode,
						cseries;
				
					xmin = IG$/*mainapp*/._I1b/*XGetAttr*/(mnode, "xmin"),
					xmax = IG$/*mainapp*/._I1b/*XGetAttr*/(mnode, "xmax");
					
					xmin = xmin ? Number(xmin) : null;
					xmax = xmax ? Number(xmax) : null;
					
					cfit = IG$/*mainapp*/._I18/*XGetNode*/(mnode, "curvefit");
					rtype = IG$/*mainapp*/._I1b/*XGetAttr*/(cfit, "rtype");
					formula = IG$/*mainapp*/._I1a/*getSubNodeText*/(cfit, "formula");
					formula_html = IG$/*mainapp*/._I1a/*getSubNodeText*/(cfit, "formula_html");
					
					stnode = IG$/*mainapp*/._I18/*XGetNode*/(cfit, "statistics");
					
					if (stnode)
					{
						rs = IG$/*mainapp*/._I1a/*getSubNodeText*/(stnode, "r_square");
						rsadj = IG$/*mainapp*/._I1a/*getSubNodeText*/(stnode, "r_square_adj");
					}
					
					if (rs || rsadj)
					{
						rsdesc = (rs ? "<br /><span class='igc-cfit-rst'>R sqaure : </span><span class='igc-cfig-rs'>" + rs + "</span>" : "")
							+ (rsadj ? "<br /><span class='igc-cfit-rst'>R sqaure adj: </span><span class='igc-cfig-rs'>" + rsadj + "</span>" : "");
					}
					
					bname = sconf.name;
					sname = k == 1 ? "(ALL)" : (IG$/*mainapp*/._I1a/*getSubNodeText*/(mnode, "seriename") || "");
					
					pdiv = $("<li class='igc-cfit-leg-item'><span class='igc-cfit-bname'>" + (bname ? bname + ": " : "") + "</span><span class='igc-cfit-seriename'>" + sname + "</span><br /><span class='igc-cfit-fm'>" + (formula_html || formula) + "</span>" + rsdesc + "</li>").appendTo(ul);
					
					params = [];
					
					pnode = IG$/*mainapp*/._I18/*XGetNode*/(cfit, "parameters");
					pnodes = IG$/*mainapp*/._I26/*getChildNodes*/(pnode);
					
					for (j=0; j < pnodes.length; j++)
					{
						tval = IG$/*mainapp*/._I24/*getTextContent*/(pnodes[j]);
						params.push(Number(tval));
					}
					
					cseries = me.dBS/*drawBandSeries*/.call(me, mc, rtype, formula_html || formula, params, charttype, xmin, xmax, sconf);
					
					pdiv.bind("click", function(ev) {
						var m = $(this);
						
						if (me.__sel_s)
						{
							me.__sel_s.pdiv.removeClass("igc-cfit-sel");
							me.__sel_s.series.update({
								lineWidth: 2
							}, true);
						}
						if (cseries)
						{
							m.addClass("igc-cfit-sel");
							
							cseries.update({
								lineWidth: 6
							}, true);
							
							me.__sel_s = {
								pdiv: m,
								series: cseries
							};
						}
					});
				});
			}
		});
	},
	
	dBS/*drawBandSeries*/: function(mc, rtype, formula, params, charttype, xmin, xmax, sconf) {
		var me = this,
			i, j,
			x,
			y,
			ns = {
				name: formula,
				type: "spline",
				allowPointSelect: false,
				showInLegend: false,
				dashStyle: sconf.cf_lc || "Dot",
				lineWidth: 2,
				marker: {
					enabled: false
				},
				data: [
				]
			},
			cfitfcs = sconf.cfitfcs ? Number(sconf.cfitfcs) : 0,
			bx = xmin != null && xmax != null && !isNaN(xmin) && !isNaN(xmax),
			x1, x2, xs = 1,
			taxis,
			ccolor = "#efefef",
			categ,
			cseries;
			
		if (bx)
		{
			x1 = xmin;
			x2 = xmax + bx;
			xs = (xmax - xmin) / 20;
		}
		else
		{
			x1 = 0;
			taxis = mc.xAxis[0];
			cfitfcs = Math.floor(cfitfcs);
			x2 = mc.series[0].data.length + cfitfcs;
		}
		
		switch (rtype)
		{
		case "polynomial":
			for (i=x1; i < x2; i+=xs)
			{
				x = i;
				
				for (j=0; j < params.length; j++)
				{
					y = (j == 0) ? params[j] : y + params[j] * Math.pow(x, j);
				}
				
				ns.data.push({
					x: x,
					y: y
				});
			}
			break;
		case "exponential":
			for (i=x1; i < x2; i+=xs)
			{
				x = i;
				y = Math.exp(params[0] + params[1] * x); // Math.exp(params[1] * i);
				
				ns.data.push({
					x: x,
					y: y
				});
			}
			break;
		case "logarithmic":
			for (i=x1; i < x2; i+=xs)
			{
				x = bx ? i : i + 1;
				y = params[0] + params[1] * Math.log(x);
				
				ns.data.push({
					x: i,
					y: y
				});
			}
			break;
		case "power":
			for (i=x1; i < x2; i+=xs)
			{
				x = bx ? i : i + 1;
				y = Math.exp(params[0] + params[1] * Math.log(x));
				
				ns.data.push({
					x: i,
					y: y
				});
			}
			break;
		}
        
        if (charttype == "bar")
        {
            for (i=0; i < ns.data.length; i++)
            {
                ns.data[i].x_ = ns.data[i].x;
                ns.data[i].x = ns.data[i].y;
                ns.data[i].y = ns.data[i].x_;
                delete ns.data[i]["x_"]; 
            }
            
            taxis = mc.yAxis[0];
        }
        
        if (taxis && cfitfcs > 0)
        {
        	categ = taxis.categories;
        	
        	for (i=0; i < cfitfcs; i++)
        	{
        		categ.push("*" + (i + 1));
        	}
        	
        	ns.zoneAxis = charttype == "bar" ? "y" : "x";
        	ns.zones = [
        		{
        			value: x2 - cfitfcs
        		},
        		{
        			color: "#ff0000"
        		}
        	];
        	
        	taxis.update({
        		categories: categ
        	}, true);
        }
		
		cseries = mc.addSeries(ns);
		
		return cseries;
	},
	
	F3a/*drawChartCtrl*/: function(G2/*chartview*/, ispageview) {
		var me = this,
			jdom = $(G2/*chartview*/.container),
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom),
	    	h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom),
	    	mresult = G2/*chartview*/.mresult,
			drawchart;
			
		G2/*chartview*/.disposeContent.call(G2/*chartview*/, G2/*chartview*/);
			
		drawchart = G2/*chartview*/.dcr/*drawChartResult*/.call(G2/*chartview*/, w, h, undefined, ispageview);
		
		G2/*chartview*/.drawchart = drawchart;
		
		if (window.m$dorC)
		{
			window.m$dorC.call(me, G2/*chartview*/, drawchart);
		}
		
		G2/*chartview*/._bN/*bandFormula*/.empty();
		G2/*chartview*/._bN/*bandFormula*/.hide();
		
		if (G2/*chartview*/.isHighChart == true)
		{
			$.each(drawchart, function(i, d) {
				if (window.echarts)
				{
					var masterChart = echarts.init(d.chart.renderTo, null, {
							// renderer: "svg"
						}),
						n,
						chartoption = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.cco/*chartOption*/ : null,
						charttype = chartoption ? chartoption.subtype : null,
						tnodes;
					
					masterChart.setOption(d);
					
					masterChart.on("pieselectchanged", function(params) {
						
					});
					
					masterChart.on("click", function(params) {
						if (params.componentType == "series")
						{
							G2/*chartview*/.p1/*processClickEvent*/(
								{
									series: {
										name: params.seriesName,
										type: params.seriesType
									}
								}, 
								{
								point: params.data
								}
							);
						}
					});
					
					masterChart.on("brushselected", function(params) {
						
					});
					
					G2/*chartview*/._mc/*masterCharts*/.push(masterChart);
				}
				else
				{
					var masterChart = new Highcharts.Chart(d),
						n,
						chartoption = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.cco/*chartOption*/ : null,
						charttype = chartoption ? chartoption.subtype : null,
						tnodes; //, function(masterChart) {me.createDetail(masterChart)});
					G2/*chartview*/._mc/*masterCharts*/.push(masterChart);
					
					me.__sel_s = null;
					
					if (mresult && mresult.__bands && mresult.__bands.length)
					{
						tnodes = mresult.__bands;
						for (n=0; n < tnodes.length; n++)
		        		{
		        			me.dB/*drawBand*/.call(me, masterChart, tnodes[n], charttype, G2/*chartview*/);
		        		}
					}
					else if (d.__cf && d.__cf.length)
					{
						me._cf/*curvefit*/.call(me, masterChart, d.__cf, charttype, G2/*chartview*/);
					}
				}
			});
		}
	},
	
	F4/*chartClickHandler*/: function(G2/*chartview*/) {
		var me = this,
			mresult = G2/*chartview*/.mresult;
		
		me.fC/*selectedChart*/ = G2/*chartview*/;
		me.selectedData = G2/*chartview*/.selectedData;
		
    	if (me._ILb/*sheetoption*/.cco/*chartOption*/.enabledrill == true && me._ILb/*sheetoption*/.rows.length > G2/*chartview*/.ddt/*drillDepth*/ + 1)
    	{
    		me.meB/*drilldepth*/ = G2/*chartview*/.ddt/*drillDepth*/ + 1;
    		
    		var sel = G2/*chartview*/.selectedData,
    			ddt/*drillDepth*/ = G2/*chartview*/.ddt/*drillDepth*/ + 1,
    			_IL8/*jobid*/ = me._IK9/*olapset*/._IL8/*jobid*/,
    			fcondition,
    			i;
    		
    		var filterxml = "<smsg><Filter source='drill' drilldepth='" + ddt/*drillDepth*/ + "'>",
    			c;
    		
    		if (me.Df/*drillFilter*/.length > ddt/*drillDepth*/ - 1)
    		{
    			me.Df/*drillFilter*/.splice(ddt/*drillDepth*/ - 1, me.Df/*drillFilter*/.length - ddt/*drillDepth*/ + 1);
    		}
    		c = [];
    		c.push(mresult.data[sel[0].r][mresult.colfix-1]);
    		me.Df/*drillFilter*/.push({item: me._ILb/*sheetoption*/.rows[ddt/*drillDepth*/ - 1], data: c});
    		for (i=0; i < me.Df/*drillFilter*/.length; i++)
    		{
    			fcondition = me.Df/*drillFilter*/[i];
    			
    			filterxml += "<Condition name='" + fcondition.item.name + "' operator='EQUAL'>"
						  + "<Field>"
						  + "<item nodepath='" + fcondition.item.nodepath + "' name='" + fcondition.item.name + "' uid='" + fcondition.item.uid + "' type='" + fcondition.item.itemtype + "'/>"
						  + "</Field>"
						  + "<value>";
    			
    			filterxml += "<![CDATA[" + fcondition.data[0].code + "]]>";
    			
    			filterxml += "</value></Condition>";
    		}
    		
    		filterxml += "</Filter></smsg>";
    		
    		var cpanel,
    			G2/*chartview*/;
    		
    		if (me.cPm/*chartpanels*/.length > me.meB/*drilldepth*/)
    		{
    			cpanel = me.cPm/*chartpanels*/[me.meB/*drilldepth*/];
    			// G2/*chartview*/ = cpanel.G2/*chartview*/;
    		}
    		else
    		{
	    		cpanel = me.cc1/*createPanel*/(2, ddt/*drillDepth*/, undefined);

	    		// me.cpm/*containerpanel*/.add(cpanel);
	    		if (!cpanel.G2/*chartview*/)
	    		{
	    			cpanel.G2/*chartview*/ = me.F3/*createChartCtrl*/(0, cpanel.body.dom);
	    		}
	    			// me.cPm/*chartpanels*/.push(cpanel);
    		}
    		
    		G2/*chartview*/ = cpanel.G2/*chartview*/;
    		G2/*chartview*/.ddt/*drillDepth*/ = ddt/*drillDepth*/;
    		me._IK9/*olapset*/._IKb/*requestPivotResult*/.call(me._IK9/*olapset*/, filterxml, G2/*chartview*/, 0);
    		me.F7/*layoutChartPanels*/(false);
    	}
    	
    	if (me.eventhandler && me.eventowner)
    	{
    		me.eventhandler.call(me.eventowner);
    	}
    	else
    	{
    		me.fireEvent("itemclick", me);
    	}
    },
    
    F5/*processDrillUpIndex*/: function(index) {
    	var me = this;
    	
    	me.meB/*drilldepth*/ = index;

    	me.F7/*layoutChartPanels*/(false);
    },
    
	F6/*doClusterLayout*/: function(refreshdata) {
    	var i,
    		me = this,
    		chart = me.body.dom,
    		titems,
    		cols,
    		rows,
    		dwidth,
    		dheight,
    		w = me.getWidth(),
			h = me.getHeight(), //  - 32 - 40,
			collapsedcnt = 0,
			ncnt = 0,
			hasMax = false;
		
    	titems = 0;
    	w = me.cpm.getWidth();
    	h = me.cpm.getHeight();
    	
    	for (i=0; i < me.cPm/*chartpanels*/.length; i++)
    	{
    		if (me.cPm/*chartpanels*/[i].collapse == "maximize")
    		{
    			hasMax = true;
    			// me.cPm/*chartpanels*/[i].setVisible(((hasMax && me.cPm/*chartpanels*/[i].collapse == "maximize") || hasMax == false) ? true : false);
    			me.cslicemin.setVisible(false);
    		}
    	}
    	
    	if (hasMax == false && me.cslicemin)
    	{
    		me.cslicemin.setVisible(true);
    		me.cslicemin.removeAll();
    	}
    	
    	$.each(me.cPm/*chartpanels*/, function(i, itemobj) // for (i=0; i < me.cPm/*chartpanels*/.length; i++)
    	{
    		// var itemobj = me.cPm/*chartpanels*/[i];
    		if (me.cPm/*chartpanels*/[i].collapse == "collapsed")
    		{
    			itemobj.setVisible(false);
    			var btn = new IG$/*mainapp*/.pb({
    				xtype: "button",
    				width: 120,
    				text: itemobj.title,
    				handler: function() {
    					itemobj.collapse = "normal";
    					me.F6/*doClusterLayout*/.call(me);
    				}
    			});
    			me.cslicemin.add(btn);
    			// me.cslicemin.add(itemobj);
    		}
    		else if (me.cPm/*chartpanels*/[i].collapse == "maximize")
    		{
    			itemobj.setVisible(true);
    			me.cpm.add(itemobj);
    			me.cPm/*chartpanels*/[i].setPosition(0, 0);
    			me.cPm/*chartpanels*/[i].setSize(w, h);
    		}
    		else if (me.cPm/*chartpanels*/[i].collapse == "normal")
    		{
    			itemobj.setVisible(hasMax == true ? false : true);
    			me.cpm.add(itemobj);
    			titems++;
    		}
    	});
    	
    	if (hasMax == false)
    	{
			cols = (titems < 3) ? titems : 
				(titems < 6) ? titems / 2 :
				(titems < 12) ? titems / 3 :
				(titems < 20) ? titems / 4 :
				titems / 4;
			
			cols = Math.floor(cols);
			rows = Math.ceil(titems / cols);
			dheight = h / rows;
			
			if (dheight < 200)
			{
				dwidth = (w - 18) / cols;
				dheight = 200;
				me.cpm.setAutoScroll(true);
				// me.cslicecontainer.css({overflowY: "scroll"});
			}
			else
			{
				dwidth = w / cols;
				me.cpm.setAutoScroll(false);
				// me.cslicecontainer.css({overflowY: "hidden"});
			}
			
			for (i=0; i < me.cPm/*chartpanels*/.length; i++)
			{
				if (me.cPm/*chartpanels*/[i].collapse == "normal")
				{
					mc = dwidth * (ncnt % cols);
					mr = dheight * (Math.floor(ncnt / cols) % rows);
					me.cPm/*chartpanels*/[i].setPosition(mc, mr);
					me.cPm/*chartpanels*/[i].setSize(dwidth, dheight);
					ncnt++;
				}
				else
				{
					me.cPm/*chartpanels*/[i].setPosition(collapsedcnt * 100, 4);
					me.cPm/*chartpanels*/[i].setSize(100, 30);
					collapsedcnt++;
				}
				
				if (refreshdata == true)
				{
					var chartview = me.cPm/*chartpanels*/[i].G2/*chartview*/;
					me.F3a/*drawChartCtrl*/(chartview);
				}
			}
		}
    },
    
    F7/*layoutChartPanels*/: function(refreshdata, ispageview) {
    	var i,
			me = this,
			titems,
			dwidth,
			dheight,
			drillviewmode,
			w, h;
			    	
    	if (me.cPm/*chartpanels*/.length == 0)
    		return;
    		
    	w = me.getWidth() || me.width,
		h = me.getHeight() || me.height;
		
    	for (i=me.meB/*drilldepth*/ + 1; i < me.cPm/*chartpanels*/.length; i++)
    	{
    		me.cPm/*chartpanels*/[i].setVisible(false);
    	}
    	
		titems = Math.min(me.cPm/*chartpanels*/.length, me.meB/*drilldepth*/ + 1);
		drillviewmode = me._ILb/*sheetoption*/.cco/*chartOption*/.drillviewmode;
		
		/*public static var LAYOUT_NORMAL:int = 0;
		public static var LAYOUT_POPUP:int = 1;
		public static var LAYOUT_CASCADE:int = 2;
		public static var LAYOUT_HORIZONTAL:int = 3;
		public static var LAYOUT_VERTICAL:int = 4; */
		
		dwidth = (drillviewmode == 3) ? w / titems : w;
		dheight = (drillviewmode == 4) ? h / titems : h;
		
		for (i=0; i < titems; i++)
		{
			mc = (drillviewmode == 3) ? dwidth * i : 0;
			mr = (drillviewmode == 4) ? dheight * i : 0;
			
			var pw = me.cPm/*chartpanels*/[i].pw,
				ph = me.cPm/*chartpanels*/[i].ph,
				px = me.cPm/*chartpanels*/[i].px,
				py = me.cPm/*chartpanels*/[i].py;
			
			me.cPm/*chartpanels*/[i].setVisible((drillviewmode == 0 && i < titems - 1 ? false : true));
			if (pw != dwidth || ph != dheight || px != mc || py != mr)
			{
				me.cPm/*chartpanels*/[i].setPosition(mc, mr);
				me.cPm/*chartpanels*/[i].setSize(dwidth, dheight);
				
				me.cPm/*chartpanels*/[i].pw = dwidth;
				me.cPm/*chartpanels*/[i].ph = dheight;
				me.cPm/*chartpanels*/[i].px = mc;
				me.cPm/*chartpanels*/[i].py = mr;
			}
			
			if (refreshdata == true)
			{
				me.F3a/*drawChartCtrl*/(me.cPm/*chartpanels*/[i].G2/*chartview*/, ispageview);
			}
			else
			{
				if (pw != dwidth || ph != dheight || i > 0)
				{
					me.cPm/*chartpanels*/[i].G2/*chartview*/.Mm12/*invalidateSize*/.call(me.cPm/*chartpanels*/[i].G2/*chartview*/, dwidth, dheight);
				}
			}
		}
    },
    
    F8/*clusterChartClosed*/: function(chart) {
    	var me = this;
    	/*
    	 * Do not delete and relayouting
    	 */
    	//for (i=0;i < me.cPm/*chartpanels*/.length; i++)
    	//{
    	//	if (me.cPm/*chartpanels*/[i] == chart)
    	//	{
    	//		me.cPm/*chartpanels*/.splice(i, 1);
    	//		break;
    	//	}
    	//}
    	me.F6/*doClusterLayout*/();
    },
    
    CLS: {
    	resize: function(mw, mh) {
    		var p = this,
    			w = mw || p.getWidth(),
				h = mh || p.getHeight();
			
			if (w > 10 && h > 10)
			{
				p.width = w;
				p.height = h;
				
				if (p.stimer > -1)
					clearTimeout(p.stimer);
									
				p.stimer = setTimeout(function() {
					p.setPanelSize.call(p, w, h);
				}, 30);
			}
    	}
    },
    
    setPanelSize: function (w, h) {
    	var p = this,
    		me = p;
    	
    	if (p.cpm/*containerpanel*/)
		{	
			p.cpm/*containerpanel*/.setSize(w, h);
		}
		
		// console.log(w, h);
		me.resized = true;
		
    	if (me.__d1/*drawmode*/ == 1)
		{
			p.F6/*doClusterLayout*/();
		}
		else if (p.cPm/*chartpanels*/)
		{
			p.F7/*layoutChartPanels*/(false);
		}
    },
    
    _IB4/*getExportData*/: function(option, startx, starty, docid, d_width, d_height) {
    	var me = this,
    		r = [],
    		i,
    		ix = startx, iy = starty, offset,
    		goffset = $(me.body.dom).offset(),
    		sliceview,
    		chartview, svg, expdata,
    		tw = me.getWidth(),
    		th = me.getHeight(),
    		iw, ih,
    		jdom;
    	
    	if (me.__d1/*drawmode*/ == 1)
    	{
    		for (i=0; i < me.cPm/*chartpanels*/.length; i++)
	    	{
	    		sliceview = me.cPm/*chartpanels*/[i];
	    		if (sliceview.G2/*chartview*/ && (sliceview.collapse == "maximize" || sliceview.collapse == "normal"))
	    		{
		    		offset = sliceview.getPosition();
		    		chartview = sliceview.G2/*chartview*/;
		    		ix = startx + offset[0] - goffset.left;
		    		iy = starty + offset[1] - goffset.top;
		    		jdom = $(chartview.container);
		    		iw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom);
		    		ih = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom);
		    		r.push("<item type='chart' x='" + ix + "' y='" + iy + "' d_width='" + d_width + "' d_height='" + d_height + "' width='" + iw + "' height='" + ih + "' docid='" + docid + "'>");
		    		r.push(chartview._IB4/*getExportData*/.call(chartview));
		    		r.push("</item>");
		    	}
	    	}
    	}
    	else
    	{
	    	for (i=0; i < me.cPm/*chartpanels*/.length; i++)
	    	{
	    		chartview = me.cPm/*chartpanels*/[i].G2/*chartview*/;
	    		offset = $(chartview.container).offset();
	    		ix = startx + offset.left - goffset.left;
	    		iy = starty + offset.top - goffset.top;
	    		jdom = $(chartview.container);
	    		iw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom);
	    		ih = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom);
	    		r.push("<item type='chart' x='" + ix + "' y='" + iy + "' width='" + iw + "' height='" + ih + "' docid='" + docid + "'>");
	    		r.push(chartview._IB4/*getExportData*/.call(chartview));
	    		// expdata = "<ImageData type='svg'><![CDATA[" + Base64.encode(svg) + "]]></ImageData>";
	    		r.push("</item>");
	    	}
		}
		// r.push(activeview._IH7/*chartcontainer*/._IB4/*getExportData*/.call(activeview._IH7/*chartcontainer*/));
		
			
    	// var chart = .masterChart,
    	//	svg = chart.getSVG(),
    	//	expdata;
    	
    	return r.join("");
    },
    
    _IL7/*getDrillXML*/: function(dobj) {
		var me = this,
			sel = me.selectedData,
			sop = me._ILb/*sheetoption*/,
			mresult = me.fC/*selectedChart*/.mresult,
			dinfo = [],
			row, ocell, cell,
			bdobj,
			fcnt = 0,
			i, j;
			
		if (sel && sel.length > 0)
		{
			dinfo.push("<FilterData>");
		    
		    for (i=0; i < sel.length; i++)
		    {
		    	cell = sel[i];
		    	
		    	if (cell.r < mresult.rowfix)
		        	continue;
		        
		        if (dobj && dobj.titem.enabled) 
		        {
		        	bdobj = 0;
		        	
		        	if (cell.position == 1 && sop.rows[cell.index] && dobj.titem.item_map[sop.rows[cell.index].uid])
		        	{
		        		bdobj = 1;
		        	}
		        	else if(cell.position == 3 && sop.measures && sop.measures[cell.index] && dobj.titem.item_map[sop.measures[cell.index].uid])
		        	{
		        		bdobj = 1;
		        	}
		        	else if (cell.position == 2 && sop.cols[cell.index] && dobj.titem.item_map[sop.cols[cell.index].uid])
		        	{
		        		bdobj = 1;
		        	}
		        	
		        	if (bdobj == 0)
		        	{
		        		continue;
		        	}
		        }
		        
		        dinfo.push("<FilterCell>");
		        
		        fcnt++;
		        
		        row = mresult.data[cell.r];
		        
		        for (j=0; j < mresult.colfix; j++)
		        {
		            ocell = row[j];
		            
		            if (ocell.position == 1 && sop.rows[ocell.index])
		            {
		                var frow = "<Row";
		                frow += " name='" + sop.rows[ocell.index].name + "' uid='" + sop.rows[ocell.index].uid + "' type='" + sop.rows[ocell.index].itemtype + "'>";
		                if (ocell.code)
		                {
		                    frow += "<code><![CDATA[" + ocell.code + "]]></code>";
		                }
		                
		                if (ocell.value != null)
		                {
		                    frow += "<value><![CDATA[" + ocell.value + "]]></value>";
		                }
		                
		                frow += "</Row>";
		                
		                dinfo.push(frow);
		            }
		        }
		        
		        for (j=0; j < mresult.rowfix; j++)
		        {
		        	if (cell.c >= mresult.colfix)
		        	{
			            ocell = mresult.data[j][cell.c];
			            if (ocell.position == 2 && sop.cols[ocell.index])
			            {
			                var fcol = "<Column";
			                fcol += " name='" + sop.cols[ocell.index].name + "' uid='" + sop.cols[ocell.index].uid + "' type='" + sop.cols[ocell.index].itemtype + "'>";
			                if (ocell.code)
			                {
			                    fcol += "<code><![CDATA[" + ocell.code + "]]></code>";
			                }
			                
			                if (ocell.value != null)
			                {
			                    fcol += "<value><![CDATA[" + ocell.value + "]]></value>";
			                }
			                
			                fcol += "</Column>";
			                
			                dinfo.push(fcol);
			            }
			        }
		        }
		        
		        dinfo.push("</FilterCell>");
		    }
		    
		    dinfo.push("</FilterData>");
		    dinfo.push("<reportfilter>" + me._ILb/*sheetoption*/.filter.TX/*getXML*/() + "</reportfilter>");
		}
		else
		{
			fcnt = 1;
			dinfo.push("<FilterData>");
			dinfo.push("</FilterData>");
		}
		
		return fcnt > 0 ? dinfo.join("") : null;
	},
	
	_ic/*initComponent*/: function() {
		var me = this;
		
    	me.cPm/*chartpanels*/ = [];
    	
    	me.on("resize", function(g, w, h) {
    		me.CLS.resize.call(me, w, h);
    	});
    	me.on("afterrender", function() {
    		me.CLS.resize.call(me);
    	});
    	
    	IG$/*mainapp*/.apply(this, {
    		layout: {
    			type: "vbox",
    			align: "stretch"
    		},
    		items: [
    			{
    				xtype: "panel",
    				name: "cpm",
    				flex: 1,
    				layout: "absolute",
    				border: false
    			},
    			{
    				xtype: "panel",
    				height: 25,
    				name: "cslicemin",
    				layout: {
    					type: "hbox",
    					align: "top"
    				},
    				border: 0
    			}
    		] //,
//    		dockedItems: [
//    			{
//    				xtype: "toolbar",
//    				name: "tdock",
//    				hidden: true,
//    				dock: "top",
//    				items: [
//    					{
//		    				// html: "<div class='slice-bar'>Drag Slice Dimension</div>",
//		    				xtype: "tbtext",
//		    				flex: 1,
//		    				name: "slicemetric",
//		    				text: "Drag Slice Dimension"
//		    			},
//		    			"->",
//		    			{
//		    				xtype: "button",
//		    				text: "Options",
//		    				width: 70,
//		    				handler: function() {
//		    					this.showSlicePivot();
//		    				},
//		    				scope: this
//		    			}
//    				]
//    			},
//    			{
//    				xtype: "toolbar",
//    				dock: "bottom",
//    				hidden: true,
//    				name: "ldock",
//    				items: [
//    					{
//		    				xtype: "tbtext",
//		    				name: "cdimension",
//		    				text: "Drag XAxis Dimension"
//		    			}
//    				]
//    			}
//    		]
    	});
		
		IG$/*mainapp*/.rp$C/*chartViewer*/.superclass._ic/*initComponent*/.call(this);
	}
});

//IG$/*mainapp*/.rp$C/*chartViewer*/ = Ext.extend(Ext.panel.Panel, {
//	extend: "Ext.panel.Panel",
//	
//    initComponent: function() {
//    	var me = this;
//    	

//		
//		me.addEvents("drillreport", "itemclick", "itemdblclick", "pivotchanged", "scroll_request", "request_data");
//    	    	
//    	Ext.apply(this, 

//    	});
//    	
//    	IG$/*mainapp*/.rp$C/*chartViewer*/.superclass.initComponent.call(this);
//    }
//});

IG$/*mainapp*/.rp$R/*sheetviewer*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	_IFd/*init_f*/: function() {
		var me = this,
			sheet = me.body ? me.body.dom : null,
			w = sheet ? me.getWidth() : 0,
			h = sheet ? me.getHeight() : 0,
			canvas = null,
			i,
			mgrid, gridview;
					
		$(sheet).empty();
		
		gridview = me.G1/*gridview*/ = new IG$/*mainapp*/._I94/*olapReportView*/(me.uid, canvas, sheet, 10);
		gridview._ILa/*reportoption*/ = me._ILa/*reportoption*/;
		gridview._ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
		gridview.sheetobj = me.sheetobj;
		
		mgrid = gridview._0x030/*mgrid*/;
		mgrid._ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
		mgrid.sheetobj = me.sheetobj;
		
		mgrid.ctx.bind({
			selectionchanged: function() {
				if (mgrid.selectedItems.length > 1)
				{
					me.fireEvent("drillreport", me);
				}
			},
			itemclick: function(event, renderer) {
				me.fireEvent("itemclick", me, renderer);
			},
			itemdblclick: function(event, renderer) {
				me.fireEvent("itemdblclick", me, renderer);
			},
			menu: function(event, el) {
				me.fireEvent("menu", me, el);
			},
			pivotchanged: function(event) {
				me.fireEvent("pivotchanged", me);
			},
			scroll_request: function(event, row) {
				me.fireEvent("scroll_request", me, row);
			},
			hierarchy: function(event, cell) {
				me.fireEvent("hierarchy", me, cell);
			}
		});
	},
	_IL0/*initCustomControl*/: function() {
		this.gridcontainer = [];
	},
	
	_IKc/*applyReportResult*/: function(_IK2/*mresults*/, _IK9/*olapset*/, _ILa/*reportoption*/, _ILb/*sheetoption*/, ispageview) {
		var me = this,
			sheet = me.body ? me.body.dom : null,
			w = sheet ? me.getWidth() : 0,
			h = sheet ? me.getHeight() : 0,
			canvas = null,
			browser = window.bowser,
			i,
			mgrid, gridview,
			_is_sc,
			_hcell;
			
		me._IK2/*mresults*/ = _IK2/*mresults*/;
		me._IK9/*olapset*/ = _IK9/*olapset*/;
		me._ILa/*reportoption*/ = _ILa/*reportoption*/;
		me._ILb/*sheetoption*/ = _ILb/*sheetoption*/;
		
		if (!sheet)
			return;
		
		_is_sc = _IK2/*mresults*/ ? _IK2/*mresults*/._is_sc : false;
		_hcell = _IK2/*mresults*/ ? _IK2/*mresults*/._hcell : null;
		
		if (browser.msie && w > 0 && h > 0)
		{
			sheet[0].style.width = w + "px";
			sheet[0].style.height = h + "px";
		}
		
		var cresult;
		
		if (me._IK2/*mresults*/.results.length > 1)
		{
			cresult = new IG$/*mainapp*/._IF4/*clResult*/(null);
			cresult.merge = [];
			cresult.styles = {};
			cresult.data = [];
			
			var rs = me._IK2/*mresults*/.results,
				nrows = 0,
				ncols = 0,
				colfix = 0,
				rowfix = 0,
				j, ccode, cvalue, clusterrow;
				
			for (i=0; i < rs.length; i++)
			{
				if (i == 0)
				{
					rowfix = rs[i].rowfix;
					nrows += rowfix;
					ncols = rs[i].cols;
					colfix = rs[i].colfix;
					cresult.styles = rs[i].styles;
					
					for (j=0; j < rowfix; j++)
					{
						cresult.data.push(rs[i].data[j]);
					}
				}
				else
				{
					nrows += rs[i].rows - rs[i].rowfix + 1;
				}
				
				ccode = rs[i].clustercode;
				cvalue = rs[i].clustervalue;
				
				clusterrow = [];
				
				for (j=0; j < ncols; j++)
				{
					clusterrow.push({
						text: (j<colfix) ? " " : rs[i].clusterdesc || "", 
						mrow:0, 
						mcol:ncols-1, 
						merged: (j==0 || j==colfix) ? 2 : 4, 
						stylename: "cluster_data", 
						chart:null,
						position: -1,
						code: null,
						value: null,
						index: -1
					})
				}
				
				cresult.data.push(clusterrow);
				
				for (j= rs[i].rowfix; j < rs[i].rows; j++)
				{
					cresult.data.push(rs[i].data[j]);
				}
			}
			
			cresult.rows = nrows;
			cresult.cols = ncols;
			cresult.colfix = colfix;
			cresult.rowfix = rowfix;
		}
		else
		{
			cresult = me._IK2/*mresults*/.results[0];
		}

		gridview = me.G1/*gridview*/;
		mgrid = gridview._0x030/*mgrid*/;
		
		gridview.width = (w > 0 ? w : gridview.width);
		gridview.height = (h > 0 ? h : gridview.height);

		
		if (me._IK2/*mresults*/)
		{
			gridview._IL8/*jobid*/ = me._IK2/*mresults*/._IL8/*jobid*/;
			
			if (!_hcell)
			{
				gridview.mresult = cresult;
			}
			
			gridview._ILa/*reportoption*/ = me._ILa/*reportoption*/;
			gridview._ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
			
			mgrid._ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
			
			gridview.dor/*drawOlapResult*/.call(gridview, ispageview, _is_sc, _hcell, cresult);
		}
	},
	CLS: {
		resize: function(w, h) {
			this.setPanelSize(w, h);
		},
		
		afterrender: function(ui) {
			ui._IFd/*init_f*/.call(ui);
		}
	},
	setPanelSize: function(w, h) {
		// console.log("setPanelSize", w, h);
		var me = this;
		if (me.G1/*gridview*/)
		{
			me.G1/*gridview*/._0x030.resize.call(me.G1/*gridview*/._0x030, w, h)
		}
	},
	_IL7/*getDrillXML*/: function(dobj) {
		var me = this,
			sel = me.G1/*gridview*/._tsm/*selectedCells*/.call(me.G1/*gridview*/),
			mgrid = me.G1/*gridview*/._0x030/*mgrid*/,
			mresult = me.G1/*gridview*/.mresult,
			sop = me._ILb/*sheetoption*/,
			dinfo = [],
			cell, ocell, cellparent,
			row,
			i, j,
			s1, s2,
			fcol, frow, fmea,
			br = 0,
			bdobj = 0,
			fcnt = 0;
			
		if (sel && sel.length > 0)
		{
			dinfo.push("<FilterData>");

		    for (i=0; i < sel.length; i++)
		    {
		        cell = sel[i];
		        
		        if (dobj && dobj.titem.enabled) 
		        {
		        	bdobj = 0;
		        	
		        	if (cell.position == 1 && sop.rows[cell.index] && dobj.titem.item_map[sop.rows[cell.index].uid])
		        	{
		        		bdobj = 1;
		        	}
		        	else if(cell.position == 3 && sop.measures && sop.measures[cell.index] && dobj.titem.item_map[sop.measures[cell.index].uid])
		        	{
		        		bdobj = 1;
		        	}
		        	else if (cell.position == 2 && sop.cols[cell.index] && dobj.titem.item_map[sop.cols[cell.index].uid])
		        	{
		        		bdobj = 1;
		        	}
		        	
		        	if (bdobj == 0)
		        	{
		        		continue;
		        	}
		        }
		        
		        if (cell.title == 1)
		        {
		        	fcnt++;
		        	continue;
		        }
		        
		        fcnt++;
		        dinfo.push("<FilterCell>");
				
				if (mgrid.treeCol > -1)
				{
					row = mgrid.treeData[cell.dr];
					cellparent = row[mgrid.treeCol];
					if (cellparent)
					{
						while (cellparent)
						{
							ocell = cellparent;
							
							if (ocell.position == 1 && sop.rows[ocell.index])
				            {
				            	if (!dobj || !dobj.tparams.enabled || (dobj && dobj.tparams.enabled && dobj.tparams.item_map[sop.rows[ocell.index].uid]))
				            	{
					                frow = "<Row";
					                frow += " name='" + sop.rows[ocell.index].name + "' uid='" + sop.rows[ocell.index].uid + "' type='" + sop.rows[ocell.index].itemtype + "'>";
					                if (ocell.code)
					                {
					                    frow += "<code><![CDATA[" + ocell.code + "]]></code>";
					                }
					                
					                if (ocell.value != null)
					                {
					                    frow += "<value><![CDATA[" + ocell.value + "]]></value>";
					                }
					                
					                
					                frow += "</Row>";
					                
					                dinfo.push(frow);
					            }
				            }
				            else if(ocell.position == 3 && sop.measures && sop.measures[ocell.index])
				            {
				            	if (!dobj || !dobj.tparams.enabled || (dobj && dobj.tparams.enabled && dobj.tparams.item_map[sop.measures[ocell.index].uid]))
				            	{
					            	br = 1;
					            	fmea = "<measure";
					                fmea += " name='" + sop.measures[ocell.index].name + "' uid='" + sop.measures[ocell.index].uid + "' type='" + sop.measures[ocell.index].itemtype + "'>";
					                fmea += "</measure>";
					                dinfo.push(fmea);
					            }
				            }
							
							cellparent = ocell.parent;
						}
					}
					else
					{
						ocell = row[mgrid.treeCol];
						
						if (ocell.position == 1 && sop.rows[ocell.index])
			            {
			            	if (!dobj || !dobj.tparams.enabled || (dobj && dobj.tparams.enabled && dobj.tparams.item_map[sop.rows[ocell.index].uid]))
			            	{
				                frow = "<Row";
				                frow += " name='" + sop.rows[ocell.index].name + "' uid='" + sop.rows[ocell.index].uid + "' type='" + sop.rows[ocell.index].itemtype + "'>";
				                if (ocell.code)
				                {
				                    frow += "<code><![CDATA[" + ocell.code + "]]></code>";
				                }
				                
				                if (ocell.value != null)
				                {
				                    frow += "<value><![CDATA[" + ocell.value + "]]></value>";
				                }
				                
				                frow += "</Row>";
				                
				                dinfo.push(frow);
				            }
			            }
			            else if(ocell.position == 3 && sop.measures && sop.measures[ocell.index])
			            {
			            	br = 1;
			            	fmea = "<measure";
			                fmea += " name='" + sop.measures[ocell.index].name + "' uid='" + sop.measures[ocell.index].uid + "' type='" + sop.measures[ocell.index].itemtype + "'>";
			                fmea += "</measure>";
			                dinfo.push(fmea);
			            }
					}
					
					if (!br && sop.measures && sop.measures.length == 1 && cell.c >= mresult.colfix && cell.r >= mresult.rowfix)
			        {
			        	fmea = "<measure";
		                fmea += " name='" + sop.measures[0].name + "' uid='" + sop.measures[0].uid + "' type='" + sop.measures[0].itemtype + "'>";
		                fmea += "</measure>";
		                dinfo.push(fmea);
			        }
				}
				else
				{
			        row = mresult.data[cell.r];
			        s1 = 0;
			        s2 = mresult.colfix;
			        br = 0;
			        
			        if ((!dobj || (dobj && !dobj.tparams.enabled)) && cell.c < mresult.colfix)
			        {
			        	if (dobj && dobj._dall)
			        	{
			        		
			        	}
			        	else
			        	{
				        	s1 = cell.c;
				        	s2 = cell.c+1;
			        	}
			        }
			        
			        for (j=s1; j < s2; j++)
			        {
			            ocell = row[j];
			            
			            if (ocell.position == 1 && sop.rows[ocell.index])
			            {
			            	if (!dobj || !dobj.tparams.enabled || (dobj && dobj.tparams.enabled && dobj.tparams.item_map[sop.rows[ocell.index].uid]))
			            	{
				                frow = "<Row";
				                frow += " name='" + sop.rows[ocell.index].name + "' uid='" + sop.rows[ocell.index].uid + "' type='" + sop.rows[ocell.index].itemtype + "'>";
				                if (ocell.code)
				                {
				                    frow += "<code><![CDATA[" + ocell.code + "]]></code>";
				                }
				                
				                if (ocell.value != null)
				                {
				                    frow += "<value><![CDATA[" + ocell.value + "]]></value>";
				                }
				                
				                frow += "</Row>";
				                dinfo.push(frow);
				            }
			            }
			            else if(ocell.position == 3 && sop.measures && sop.measures[ocell.index])
			            {
			            	if (!dobj || !dobj.tparams.enabled || (dobj && dobj.tparams.enabled && dobj.tparams.item_map[sop.measures[ocell.index].uid]))
			            	{
				            	br = 1;
				            	fmea = "<measure";
				                fmea += " name='" + sop.measures[ocell.index].name + "' uid='" + sop.measures[ocell.index].uid + "' type='" + sop.measures[ocell.index].itemtype + "'>";
				                fmea += "</measure>";
				                dinfo.push(fmea);
				            }
			            }
			        }
			        
			        for (j=0; j < mresult.rowfix; j++)
			        {
			            ocell = mresult.data[j][cell.c];
			            if (ocell.position == 2 && sop.cols[ocell.index])
			            {
			            	if (!dobj || !dobj.tparams.enabled || (dobj && dobj.tparams.enabled && dobj.tparams.item_map[sop.cols[ocell.index].uid]))
			            	{
				                fcol = "<Column";
				                fcol += " name='" + sop.cols[ocell.index].name + "' uid='" + sop.cols[ocell.index].uid + "' type='" + sop.cols[ocell.index].itemtype + "'>";
				                if (ocell.code)
				                {
				                    fcol += "<code><![CDATA[" + ocell.code + "]]></code>";
				                }
				                
				                if (ocell.value != null)
				                {
				                    fcol += "<value><![CDATA[" + ocell.value + "]]></value>";
				                }
				                
				                fcol += "</Column>";
				                dinfo.push(fcol);
				            }
			            }
			            else if(ocell.position == 3 && sop.measures && sop.measures[ocell.index])
			            {
			            	if (!dobj || !dobj.tparams.enabled || (dobj && dobj.tparams.enabled && dobj.tparams.item_map[sop.measures[ocell.index].uid]))
			            	{
				            	br = 1;
				            	fmea = "<measure";
				                fmea += " name='" + sop.measures[ocell.index].name + "' uid='" + sop.measures[ocell.index].uid + "' type='" + sop.measures[ocell.index].itemtype + "'>";
				                fmea += "</measure>";
				                dinfo.push(fmea);
				            }
			            }
			        }
			        
			        if (!br&& sop.measures && sop.measures.length == 1 && cell.c >= mresult.colfix && cell.r >= mresult.rowfix)
			        {
			        	fmea = "<measure";
		                fmea += " name='" + sop.measures[0].name + "' uid='" + sop.measures[0].uid + "' type='" + sop.measures[0].itemtype + "'>";
		                fmea += "</measure>";
		                dinfo.push(fmea);
			        }
		        }
		        
		        dinfo.push("</FilterCell>");
		    }
		    
		    dinfo.push("<reportfilter>" + me._ILb/*sheetoption*/.filter.TX/*getXML*/() + "</reportfilter>");
		    dinfo.push("</FilterData>");
		}
		
		return (fcnt > 0 ? dinfo.join("") : null);
	},
	
	_IP3/*getSelection*/: function() {
		var me = this,
			sel = me.G1/*gridview*/._tsm/*selectedCells*/.call(me.G1/*gridview*/);
		return sel;
	},
	
	_IB4/*getExportData*/: function(option) {
		var me = this,
			r = new Array(),
			rs = new Array(),
		
			i,
			j,
			
			_parser = me.G1/*gridview*/.mresult,
			_delim = (_parser ? _parser.delim : null),
			_sdelim = ";",
			mergeinfo = (_parser ? _parser.merge : null),
			m,
			value,
			scell,
			ns, nt,
			idx = 0,
			mgrid = me.G1/*gridview*/._0x030/*DataWebGrid*/;
			
		if (!_parser)
			return "";
		
		r.push("<instance jobid='" + (me.G1/*gridview*/._IL8/*jobid*/ || "") + "' cols='" + _parser.cols + "' rows='" + _parser.rows + "' delimiter='" + _delim + "' fixedrow='" + _parser.rowfix + "'></instance>");
		
		return r.join("");
	},
	
	_IN0/*applyOptions*/: function(rop, sop) {
		var me = this;
		
		if (rop && sop)
		{
			me._ILa/*reportoption*/ = rop;
			me._ILb/*sheetoption*/ = sop;
		}
		
		me.G1/*gridview*/._IN0/*applyOptions*/(me._ILa/*reportoption*/, me._ILb/*sheetoption*/);
	},
	
	_ic/*initComponent*/: function() {
		var me = this;
		
		me.on("resize", function(p, w, h) {
			me.CLS.resize.call(me, w, h);
		});
		
		me.on("afterrender", function(ui) {
			me.CLS.afterrender.call(me, ui);
		});
		
		IG$/*mainapp*/.rp$R/*sheetviewer*/.superclass._ic/*initComponent*/.call(this);
	}
});

//IG$/*mainapp*/.rp$R/*sheetviewer*/ = Ext.extend(Ext.container.Container, {
//	extend: "Ext.container.Container",
//	gridcontainer: [],
//	sheetobj: null,
//	initComponent: function() {
//		var me = this;
//		
//		me.addEvents("drillreport", "itemclick", "itemdblclick", "menu", "pivotchanged", "scroll_request");
//		
//		me.on("resize", function(p, w, h) {
//			me.CLS.resize.call(me, w, h);
//		});
//		
//		me.on("afterrender", function(ui) {
//			me.CLS.afterrender.call(me, ui);
//		});
//		
//		IG$/*mainapp*/.rp$R/*sheetviewer*/.superclass.initComponent.call(me);
//	}
//});

IG$/*mainapp*/._Ib9/*rprstat_jquery*/ = {
	FmP/*updatePromptControls*/: function() {
		var panel = this,
			sop = panel._ILb/*sheetoption*/,
			rpromptdlg = panel.rpP/*rpromptpanel*/,
			rro = (sop ? sop.rro/*ROption*/ : null),
			s4, promptdef,
			sdom;
		
		rpromptdlg.hide();
		panel.rpp/*rpromptbutton*/.hide();
		
		sdom = $("#promptcontent", panel.rpP/*rpromptpanel*/);
		sdom.empty();
		
		if (rro)
		{
			rro.s4c/*rpromptcontrols*/ = {
				items: []
			};
			s4 = rro.s4/*rprompt*/;
			
			if (s4)
			{
				try
				{
					promptdef = eval("(" + s4 + ")");
				}
				catch (e)
				{
					IG$/*mainapp*/._I52/*ShowError*/("Error on prompt control definition");
					return;
				}
				
				if (promptdef && promptdef.length > 0)
				{
					var tb = $("<table></table>").appendTo(sdom);
					
					$.each(promptdef, function(index, obj) {
						var m = $("<tr></tr>").appendTo(tb);
						var ctrl,
							i;
						var pr = {
							name: obj.name,
							type: obj.type.toLowerCase(),
							ctrl: null
						};
						$("<th>" + (obj.title || "") + "</th>").appendTo(m);
						var tm = $("<td></td>").appendTo(m);
						switch (obj.type.toLowerCase())
						{
						case "combobox":
							ctrl = $("<select></select>").appendTo(tm);
							if (obj.data)
							{
								if (typeof(obj.data) == "object" && obj.data.length > 0)
								{
									for (i=0; i < obj.data.length; i++)
									{
										$("<option value='" + (obj.data[i].value || obj.data[i].name) + "'>" + (obj.data[i].name || obj.data[i].value) + "</option>").appendTo(ctrl);
									}
								}
							}
							break;
						case "textinput":
							ctrl = $("<input type='text'></input>").appendTo(tm);
							ctrl.val(obj.value || obj.data || "");
							break;
						}
						pr.ctrl = ctrl;
						rro.s4c/*rpromptcontrols*/.items.push(pr);
					});
					
					rpromptdlg.show();
					panel.rpp/*rpromptbutton*/.show();
					var mh = $("#prompttable", panel.rpP/*rpromptpanel*/).height() + 25 + 30;
					rpromptdlg.height(Math.min(mh, 300));
				}
			}
		}
	},
	
	F3/*requestR*/: function() {
		var panel = this,
			olapset = panel._IK9/*olapset*/,
			_ILa/*reportoption*/ = panel._ILa/*reportoption*/,
			sheetobj = panel.sheetobj,
			doc;
		if (olapset && olapset._IL8/*jobid*/)
		{
			sheetobj._ILb/*sheetoption*/.panelwidth = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(panel.gp/*rparentdom*/);
			sheetobj._ILb/*sheetoption*/.panelheight = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(panel.gp/*rparentdom*/);
			doc = _ILa/*reportoption*/._IJ1/*getCurrentPivot*/();
			panel.setLoading(true);
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
		            ack: "18",
					payload: '<smsg><item uid="' + _ILa/*reportoption*/.uid + '" jobid="' + olapset._IL8/*jobid*/ + '" option="pivot" active="' + sheetobj.sheetindex + '" pivotresult="F" rstatresult="T"/></smsg>',
					mbody: doc
		        }, panel, panel.rs_F3/*requestR*/);
			req._l/*request*/();
		}
	},
	
	rs_F3/*requestR*/: function(xdoc) {
		var me = this,
			tnode,
			tnodes, i, scripts, s, sr,
			plot,
			rstat = me.rstat, page,
			rstatcontent = me.rstatcontent, // me.down("[name=rstatcontent]"),
			rscript = me.rscript, gdom, ldom, sdom, rcnt = 0;
		gdom = me.gz/*rgraphzone*/;
		ldom = me.cz/*controlzone*/;
		
		sdom = rstatcontent; // $(rstatcontent.el.dom);
			
		// me.setLoading(false);
		sdom.empty();
		gdom.empty();
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/result/execution");
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			scripts = [];
			for (i=0; i < tnodes.length; i++)
			{
				s = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
				s = Base64.decode(s);
				sr = null;
				try
				{
					sr = $.parseJSON(s);
				}
				catch (e)
				{
					rcnt++;
				}
				if (sr)
				{
					if (sr.sc)
					{
						if (/(summary|print)/.test(sr.sc) == true || sr.iserror == true)
						{
							me.a/*appendSummary*/(sr, sdom);
						}
					}
				}
				scripts.push(sr);
			}
		}
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/result/plot");
		if (tnode)
		{
			s = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
			if (s)
			{
				s = Base64.decode(s);
				try
				{
					plot = $.parseJSON(s);
				}
				catch (e)
				{
					plot = null;
				}
				me.p/*plotdata*/ = [];
				
				for (i=0; i < plot.gr.length; i++)
				{
					if (plot.gr[i].c == "pg")
					{
						page = {
							w: plot.w,
							h: plot.h,
							gr: plot.gr[i].data
						}
						
						me.p/*plotdata*/.push(page);
					}
				}
				
				// plotdata = this.p/*plotdata*/
				if (me.p/*plotdata*/.length > 0)
				{
					me.pg = 0;
					if (me.p/*plotdata*/.length > 1)
					{
						ldom.show();
						me.fm1/*updatePageDisplay*/();
					}
					me.F4/*drawPlot*/(gdom, me.p/*plotdata*/[me.pg], true, false);
				}
			}
		}
	},
	
	a/*appendSummary*/: function(sr, sdom, srbase) {
		var i, j,
			dt,
			names, dimnames, dim, dimdt,
			rownames,
			datacont, istable,
			t, tb, tr, tc, tclip,
			v, tname, k, cols, rows,
			rowcount;
		if (sr.iserror == true)
		{
			t = $("<div class='idv-r-stable'></div>").appendTo(sdom);
			cont = sr.cont;
			$("<span>&gt;&gt; " + sr.sc + "</span><br>").appendTo(t);
			$("<span color='red'>" + cont + "</span>").appendTo(t);
		}
		else if (sr.dt)
		{
			dt = sr.dt;
			
			switch (dt)
			{
			case "namedlist":
				if (sr.attr.dt == "namedlist")
				{
					names = sr.attr.cont.names.cont;
					rownames = (sr.attr.cont["row.names"] ? sr.attr.cont["row.names"].cont : null);
					datacont = sr.cont;
					istable = true;
					mlength = -1;
					for (k in datacont)
					{
						if (datacont[k].cont && datacont[k].cont.length)
						{
							if (mlength < 0)
							{
								mlength = datacont[k].cont.length;
							}
							
							if (mlength != datacont[k].cont.length || datacont[k].dt == "lang")
							{
								istable = false;
								break;
							}
						}
					}
					if (names && names.length > 0)
					{
						t = $("<div class='idv-r-stable'></div>").appendTo(sdom);
						tc = $("<div><span style='float: left;'>" + (sr.sc || (srbase ? srbase.sc : "")) + "</span><div>").appendTo(t);
						
						if (istable == true)
						{
							tclip = $("<div class='clipbutton' style='float: left;'>&nbsp;&nbsp;Select All</div>").appendTo(tc);
							tb = $("<table style='clear: both;'></table>").appendTo(t);
							
							tclip.bind("click", function() {
								IG$/*mainapp*/._I47/*selectAll*/(tb);
							});
							
							tr = $("<tr></tr>").appendTo(tb);
							if (rownames && rownames.length > 0)
							{
								$("<th></th>").appendTo(tr);
							}
							for (i=0; i < names.length; i++)
							{
								$("<th>" + names[i] + "</th>").appendTo(tr);
							}
							rowcount = (rownames && rownames.length > 0) ? rownames.length : 0;
							if (datacont && datacont[names[0]])
							{
								rowcount = Math.max(rowcount, datacont[names[0]].cont.length);
							}
							
							for (i=0; i < rowcount; i++)
							{
								tr = $("<tr></tr>").appendTo(tb);
								if (rownames && rownames.length > 0)
								{
									v = (rownames.length > i) ? rownames[i] : "";
									$("<td>" + v + "</td>").appendTo(tr);
								}
								for (j=0; j < names.length; j++)
								{
									tname = names[j];
									v = (datacont[tname] && datacont[tname].cont.length > i) ? datacont[tname].cont[i] : "" ;
									$("<td>" + v + "</td>").appendTo(tr);
								}
							}
						}
						else
						{
							for (k in datacont)
							{
								datacont[k].sc = k;
								this.a/*appendSummary*/(datacont[k], t);
							}
						}
					}
				}
				break;
			case "numeric":
			case "int":
			case "lang":
				if (sr.cont && sr.cont.length > 0)
				{
					t = $("<div class='idv-r-stable'></div>").appendTo(sdom);
					tc = $("<div><span style='float: left;'>" + (sr.sc || (srbase ? srbase.sc : "")) + "</span><div>").appendTo(t);
					tclip = $("<div class='clipbutton' style='float: left;'>&nbsp;&nbsp;Select All</div>").appendTo(tc);
											
					tb = $("<table style='clear: both;'></table>").appendTo(t);
					
					tclip.bind("click", function() {
						IG$/*mainapp*/._I47/*selectAll*/(tb);
					});
					tr = $("<tr></tr>").appendTo(tb);
					if (dt == "lang")
					{
						$("<td>" + sr.cont + "</td>").appendTo(tr);
					}
					else
					{
						for (i=0; i < sr.cont.length; i++)
						{
							v = sr.cont[i];
							$("<td>" + v + "</td>").appendTo(tr);
						}
					}
				}
				break;
			case "factor":
				datacont = sr.cont;
				if (datacont && datacont.length > 0)
				{
					t = $("<div class='idv-r-stable'></div>").appendTo(sdom);
					tc = $("<div><span style='float: left;'>" + (sr.sc || (srbase ? srbase.sc : "")) + "</span><div>").appendTo(t);
					tclip = $("<div class='clipbutton' style='float: left;'>&nbsp;&nbsp;Select All</div>").appendTo(tc);
											
					tb = $("<table style='clear: both;'></table>").appendTo(t);
					
					tclip.bind("click", function() {
						IG$/*mainapp*/._I47/*selectAll*/(tb);
					});
					tr = $("<tr></tr>").appendTo(tb);
					
					$("<td></td>").appendTo(tr);
					
					for (i=0; i < datacont.length; i++)
					{
						v = datacont[i];
						$("<td>" + v + "</td>").appendTo(tr);
					}
					
					if (sr.attr && sr.attr.dt == "namedlist")
					{
						for (k in sr.attr.cont)
						{
							var items = sr.attr.cont[k].cont;
							tr = $("<tr></tr>").appendTo(tb);
							$("<th>" + k + "</th>").appendTo(tr);
							for (i=0; i < items.length; i++)
							{
								v = items[i];
								$("<td>" + v + "</td>").appendTo(tr);
							}
						}
					}
				}
				break;
			case "string":
				datacont = sr.cont;
				cols = datacont.length;
				rows = [];
				rowcount = 1;
				
				if (sr.attr && sr.attr.dt == "namedlist" && sr.attr.cont.names)
				{
					names = sr.attr.cont.names.cont;
				}
				else
				{
					if (sr.attr && sr.attr.cont.dim)
					{
						dim = sr.attr.cont.dim.cont;
						cols = dim[1];
						rowcount = dim[0];
					}
					if (sr.attr && sr.attr.cont.dimnames)
					{
						dimdt = sr.attr.cont.dimnames.dt;
						dimnames = sr.attr.cont.dimnames.cont;
					}
				}
				
				t = $("<div class='idv-r-stable'></div>").appendTo(sdom);
				tc = $("<div><span style='float: left;'>" + (sr.sc || (srbase ? srbase.sc : "")) + "</span><div>").appendTo(t);
				tclip = $("<div class='clipbutton' style='float: left;'>&nbsp;&nbsp;Select All</div>").appendTo(tc);
										
				tb = $("<table style='clear: both;'></table>").appendTo(t);
				
				tclip.bind("click", function() {
					IG$/*mainapp*/._I47/*selectAll*/(tb);
				});
				
				if (names && names.length > 0)
				{
					tr = $("<tr></tr>").appendTo(tb);
					for (i=0; i < names.length; i++)
					{
						v = names[i];
						$("<th>" + v + "</th>").appendTo(tr);
					}
				}
				else if (dim && dimdt == "list" && dimnames && dimnames.length == 2)
				{
					tr = $("<tr></tr>").appendTo(tb);
					$("<th></th>").appendTo(tr);
					
					for (i=0; i < dim[1]; i++)
					{
						v = dimnames[1].cont[i];
						$("<th>" + v + "</th>").appendTo(tr);
					}
				}
				
				for (i=0; i < rowcount; i++)
				{
					tr = $("<tr></tr>").appendTo(tb);
					rows.push(tr);
				}
				for (i=0; i < datacont.length; i++)
				{
					var r = i % rows.length;
					if (i < rows.length && dim && dimdt == "list" && dimnames && dimnames.length == 2)
					{
						$("<td>" + dimnames[0].cont[r] + "</td>").appendTo(rows[r]);
					}
					v = datacont[i];
					$("<td>" + v + "</td>").appendTo(rows[r]);
				}
				break;
			default:
				var tttt = dt;
				break;
			}
		}
	},
	
	F4c/*drawPlotCanvas*/: function(c, plotdata) {
		var me = this,
			cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(c),
			ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(c),
			r, pr,
			i,
			d, rset, e,
			rx = cw / plotdata.w,
			ry = ch / plotdata.h,
			rt, mx, my, tx, ty, box,
			attr, h = false;
			
		r = $("<canvas></canvas>").appendTo(c);
		tx = cw;
		ty = ch;
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(r, tx);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(r, ty);
		
		me.crv = r;
		
		pr = r[0].getContext("2d");
		
		if (pr)
		{
			pr.canvas.width = tx;
			pr.canvas.height = ty;
			pr.lineWidth = 0;
			
			var i, glen, j,
				d, s1, s2,
				e, c, com,
				attr, getXY = "[0-9\\-]+", xy, x1, y1, pstart,
				mx, my, box, color, hasline, lw = 0,
				sp, nclip = {x:0, y:0, w:pr.canvas.width, h: pr.canvas.height},
				pclip = {x: nclip.x, y: nclip.y, w: nclip.w, h: nclip.h};
				
			for (i=0, glen = plotdata.gr.length; i < glen; i++)
			{
				d = plotdata.gr[i];
				e = null;
				attr = {};
				
				if (d.c == "cr")
				{
					nclip = {x:d.x*rx, y:d.y*ry, w:d.w*rx, h:d.h*ry};
					continue;
				}
				else if (d.c == "rc")
				{
					nclip = {x:0, y:0, w:pr.canvas.width, h: pr.canvas.height};
					continue;
				}
				
				pr.save();
				if (d.c != "t" && (pclip.x != nclip.x || pclip.y != nclip.y || pclip.w != nclip.w || pclip.h != nclip.h))
				{
					pr.beginPath();
					pr.rect(nclip.x, nclip.y, nclip.w, nclip.h, false);
					pr.clip();
				}
				
				pclip = {x: nclip.x, y: nclip.y, w: nclip.w, h: nclip.h};
				
				hasline = false;
				
				if (d.lc)
				{
					pr.lineCap = d.lc;
				}
				if (d.lj)
				{
					pr.lineJoin = d.lj;
				}
				if (d.ml)
				{
					pr.miterLimit = Number(d.ml);
				}
				
				if (d.ss)
				{
					lss = d.ss;
					pr.lineWidth = 1;
					hasline = true;
					pr.strokeStyle = lss;
				}
								
				if (d.lw || d.lw == 0)
				{
					lw = Number(d.lw);
				}
				
				if (hasline == true)
				{
					pr.lineWidth = lw;
				}
				
				if (d.fs)
				{
					pr.fillStyle = d.fs;
				}
				
				mx = 0; my = 0;
	
				
				if (d.ftr && d.c != "t")
				{
					pr.ftr(d.ftr[0] + mx, d.ftr[1] + my);
				}
				
				if (d.c == "t")
				{
					box = {width: pr.measureText(d.data).width, height: 10};

					tx = (d.ftr ? d.ftr[0] : 0);
					ty = (d.ftr ? d.ftr[1] : 0);
					
					if (d.fro)
					{
						d.x += me.df*d.data.length/2 - box.width/2;
						//d.y += - box.height/2;
						mx = tx * rx;
						my = ty * ry;
					}
					else
					{
						mx = (d.x + tx) * rx;
						my = (d.y + ty) * ry;
					}

					pr.translate(mx, my);
					pr.scale(1, 1);
					lss = null;
					lw = 0;
				}
				else
				{
					pr.scale(rx, ry);
				}
				
				if (d.fro)
				{
					pr.rotate(d.fro);
				}
	
				switch(d.c)
				{
				case "c":
					pr.beginPath();
					pr.arc(d.cx, d.cy, d.r, 0, 2*Math.PI, false);
					pr.stroke();
					if (d.fs)
					{
						pr.fill();
					}
					break;
				case "l":
					if (lw > 0)
					{
						pr.lineWidth = lw;
						pr.beginPath();
						pr.moveTo(d.x1, d.y1);
						pr.lineTo(d.x2, d.y2);
						pr.stroke();
					}
					break;
				case "t":
					// processing.text(d.data, d.x, d.y);
					if (d.fro)
					{
						pr.fillText(d.data, d.x, d.y);
					}
					else
					{
						pr.fillText(d.data, 0, 0);
					}
					break;
				case "pl":
					if (d.data)
					{
						sp = d.data.split(/[MLZ]+/);
						pstart = false;
						
						for (j=0; j < sp.length; j++)
						{
				            if (sp[j] == "")
				            	continue;
				            
				            xy = sp[j].split(",");
				            x1 = xy[0];
				            y1 = xy[1];
				            
				            if (pstart == false)
				            {
				            	pr.beginPath();
				            	pr.moveTo(x1, y1);
				            }
				            else
				           	{
				           		pr.lineTo(x1, y1);
				           	}
				            pstart = true;
						}
						
						if (hasline == true)
						{
							pr.stroke();
						}
					}
					break;
				case "po":
					if (d.data)
					{
						sp = d.data.split(/[MLZ]+/);
						pstart = false;
						
						for (j=0; j < sp.length; j++)
						{
				            if (sp[j] == "")
				            	continue;
				            
				            xy = sp[j].split(",");
				            x1 = xy[0];
				            y1 = xy[1];
				            
				            if (pstart == false)
				            {
				            	pr.beginPath();
				            	pr.moveTo(x1, y1);
				            }
				            else
				           	{
				           		pr.lineTo(x1, y1);
				           	}
				            pstart = true;
						}
						
						pr.closePath();
						if (d.fs)
						{
							pr.fill();
						}
						if (hasline == true)
						{
							pr.stroke();
						}
					}
					break;
				case "r":
					pr.beginPath();
					pr.rect(d.x + (d.w < 0 ? d.w : 0), d.y + (d.h < 0 ? d.h : 0), Math.abs(d.w), Math.abs(d.h));
					if (d.fs)
					{
						pr.fill();
					}
					if (hasline == true)
					{
						pr.stroke();
					}
					break;
				case "n":
					lss = null;
					lw = 0;
					break;
				default:
					lss = null;
					lw = 0;
					// break;
					break;
				}
				
				pr.restore();
			}
		}
	},
	
	F4s/*drawPlotSVG*/: function(c, plotdata, includeinlayout) {
		var me = this,
			cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(c),
			ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(c),
			r, pr,
			i, glen, n,
			d, rset, e,
			rx = cw / plotdata.w,
			ry = ch / plotdata.h,
			rt, mx, my, tx, ty, box,
			attr, h = false,
			rgba, alpha, p1x, p1y, nclip=[0,0,cw,ch],
			svg = [], svalue, etag, key, htmat, htr, h1, h2, theta, ctheta, stheta;
		
		if (includeinlayout == false)
		{
			svg.push("<svg style='overflow-x:hidden;overflow-y:hidden;position:relative;' height='" + ch + "' version='1.1' width='" + cw + "' xmlns='http://www.w3.org/2000/svg'><desc>Created by INGECEP 2.0.0</desc>");
			// svg.push("<defs style='-webkit-tap-highlight-color: rgba(0, 0, 0, 0); '></defs>");
			
			//for (i=0; i < plotdata.gr.length; i++)
			for (i=0, glen = plotdata.gr.length; i < glen; i++)
			{
				d = plotdata.gr[i];
				e = null;
				attr = {};
				h = false;
				
				svalue = null;
				etag = null;
				
				switch(d.c)
				{
				case "c":
					svalue = "<circle style='stroke-opacity:1;' cx='" + d.cx + "' cy='" + d.cy + "' r='" + d.r + "' ";
					etag = "/>";
					attr["stroke-width"] = 0;
					attr["stroke-opacity"] = 0;
					h = true;
					break;
				case "l":
					// e = r.path("M" + d.x1 + "," + d.y1 + "L" + d.x2 + "," + d.y2);
					svalue = "<path style='stroke-opacity:1;' d='";
					svalue += "M" + d.x1 + "," + d.y1 + "L" + d.x2 + "," + d.y2 + "' ";
					etag = "/>";
					h = true;
					break;
				case "t":
					t1x = 0; t1y = 0;
					if (d.pro)
					{
						t1x = d.x + me.df*d.data.length/2;
						t1y = d.y;
					}
					svalue = "<text style='text-anchor: middle; font-family: Arial; font-size: 10px; font-style: normal; font-variant: normal; font-weight: normal; line-height: normal; '"
							+ " x='" + t1x + "' y='" + t1y + "' text-anchor='middle' font='10px &quot;Arial&quot;'";
					etag = "><tspan>" + d.data + "</tspan></text>";
					break;
				case "pl":
					if (d.data)
					{
						svalue = "<path style='stroke-opacity:1;' d='"
							   + d.data + "'";
						etag = "/>";
						attr["stroke-width"] = 0;
						attr["stroke-opacity"] = 0;
						attr["fill"] = "none";
						h = true;
					}
					break;
				case "po":
					if (d.data)
					{
						svalue = "<path style='stroke-opacity:1;' d='"
							   + d.data + "'";
						etag = "/>";
						attr["stroke-width"] = 0;
						attr["stroke-opacity"] = 0;
						attr["fill"] = "none";
						h = true;
					}
					break;
				case "r":
					svalue = "<path style='stroke-opacity:1;' d='"
							   + "M" + (d.x + (d.w < 0 ? d.w : 0)) + "," + (d.y + (d.h < 0 ? d.h : 0)) 
							   + "L" + (d.x + (d.w < 0 ? d.w : 0) + Math.abs(d.w)) + "," + (d.y + (d.h < 0 ? d.h : 0)) 
							   + "L" + (d.x + (d.w < 0 ? d.w : 0) + Math.abs(d.w)) + "," + (d.y + (d.h < 0 ? d.h : 0) + Math.abs(d.h)) 
							   + "L" + (d.x + (d.w < 0 ? d.w : 0)) + "," + (d.y + (d.h < 0 ? d.h : 0) + Math.abs(d.h)) 
							   + "Z'";
					etag = "/>";
					attr["stroke-opacity"] = 0;
					attr["stroke-width"] = 0;
					attr["fill"] = "none";
					h = true;
					break;
				case "n":
					break;
				default:
					// break;
					break;
				}
		
				if (svalue)
				{
					if (d.lc)
					{
						h = true;
						attr["stroke-linecap"] = d.lc;
					}
					if (d.lj)
					{
						h = true;
						attr["stroke-linejoin"] = d.lj;
					}
					if (d.ml)
					{
						h = true;
						attr["stroke-miterlimit"] = Number(d.ml);
					}
					if (d.lw)
					{
						h = true;
						attr["stroke-width"] = Number(d.lw);
						attr["stroke-opacity"] = (Number(d.lw) > 0 ? 1 : 0);
					}
					if (d.ss)
					{
						attr.stroke = d.ss;
						attr["stroke-width"] = 1;
						attr["stroke-opacity"] = 1;
						h = true;
					}
					if (d.fs)
					{
						if (d.fs.substring(0, 4) == "rgba")
						{
							rgba = d.fs.substring(6, d.fs.length-1).split(",");
							rgba[3] = Number(rgba[3]);
							alpha = 1 - rgba[3];
							for (n=0; n < rgba.length-1; n++)
							{
								rgba[n] = Math.round((rgba[3] * Number(rgba[n])) + (alpha * 255));
							}
							
							attr["fill-opacity"] = alpha;
							rgba.splice(3, 1);
							attr["fill"] = "rgb(" + rgba.join(",") + ")";
						}
						else
						{
							attr.fill = d.fs;
						}
						h = true;
					}
					
					htmat = false;
					htr = "";
					
					if (h == true)
					{
						for (key in attr)
						{
							svalue += " " + key + "='" + attr[key] + "'";
						}
					}
					
					mx = 0; my = 0;
					
					if (d.c == "t")
					{
						tx = (d.ftr ? d.ftr[0] : 0);
						ty = (d.ftr ? d.ftr[1] : 0);
						
						if (d.fro)
						{
							box = IG$/*mainapp*/.measureText(10, d.data);
							mx = (tx) * rx - 5;
							my = (ty) * ry;
						}
						else
						{
							mx = (d.x + tx) * rx;
							my = (d.y + ty) * ry - 5;
						}
	
						htr += " translate(" + (mx.toFixed(4)*1) + "," + (my.toFixed(4)*1) + ")";
						htmat = true;
					}
					else
					{
						htr += " scale(" + rx + "," + ry + ")";
						htmat = true;
					}
					if (d.ftr && d.c != "t")
					{
						htr += " translate(" + (d.ftr[0]) + "," + (d.ftr[0]) + ")";
						htmat = true;
					}
					
					if (d.fro)
					{
						theta = d.fro;
						htr += " rotate(" + ((theta * 180/Math.PI).toFixed(2) * 1) + ")";
						htmat = true;
					}
					
					if (htmat)
					{
						svalue += " transform='" + htr + "'"; 
					}
					
					svalue += etag;
					svg.push(svalue);
				}
			}
		
			svg.push("</svg>");
		}
		else
		{
			r = Raphael(c[0], cw, ch);
			r.setStart();
			
			for (i=0, glen = plotdata.gr.length; i < glen; i++)
			{
				d = plotdata.gr[i];
				e = null;
				attr = {};
				h = false;
				
				switch(d.c)
				{
				case "c":
					e = r.circle(d.cx, d.cy, d.r);
					attr["stroke-width"] = 0;
					attr["stroke-opacity"] = 0;
					h = true;
					break;
				case "l":
					e = r.path("M" + d.x1 + "," + d.y1 + "L" + d.x2 + "," + d.y2);
					break;
				case "t":
					if (d.fro)
					{
						d.x += me.df*d.data.length/2;
						e = r.text(d.x*rx, d.y*ry, d.data);
					}
					else
					{
						e = r.text(0, 0, d.data);
					}
					break;
				case "pl":
					if (d.data)
					{
						e = r.path(d.data);
						attr["stroke-width"] = 0;
						attr["stroke-opacity"] = 0;
						h = true;
					}
					break;
				case "po":
					if (d.data)
					{
						e = r.path(d.data);
						attr["stroke-width"] = 0;
						attr["stroke-opacity"] = 0;
						h = true;
					}
					break;
				case "r":
					e = r.rect(d.x + (d.w < 0 ? d.w : 0), d.y + (d.h < 0 ? d.h : 0), Math.abs(d.w), Math.abs(d.h));
					attr["stroke-opacity"] = 0;
					attr["stroke-width"] = 0;
					h = true;
					break;
				case "cr":
					nclip = [d.x*rx, d.y*ry, d.w*rx, d.h*ry];
					break;
				case "rc":
					nclip = [0, 0, cw, ch];
					break;
				case "n":
					break;
				default:
					// break;
					break;
				}
		
				if (e)
				{
					if (d.c != "t")
					{
						attr["clip-rect"] = nclip.join(",");
					}
					if (d.lc)
					{
						h = true;
						attr["stroke-linecap"] = d.lc;
					}
					if (d.lj)
					{
						h = true;
						attr["stroke-linejoin"] = d.lj;
					}
					if (d.ml)
					{
						h = true;
						attr["stroke-miterlimit"] = Number(d.ml);
					}
					if (d.lw)
					{
						h = true;
						attr["stroke-width"] = Number(d.lw);
						attr["stroke-opacity"] = (Number(d.lw) > 0 ? 1 : 0);
					}
					if (d.ss)
					{
						attr.stroke = d.ss;
						attr["stroke-width"] = 1;
						attr["stroke-opacity"] = 1;
						h = true;
					}
					if (d.fs)
					{
						attr.fill = d.fs;
						h = true;
					}
					
					if (h == true)
					{
						e.attr(attr);
					}
					
					mx = 0; my = 0;
					
					if (d.c == "t")
					{
						tx = (d.ftr ? d.ftr[0] : 0);
						ty = (d.ftr ? d.ftr[1] : 0);
						
						if (d.fro)
						{
							box = e.getBBox();
							mx = (tx) * rx - 5;
							my = (ty) * ry;
							
							e.translate(mx, my);
							e.rotate(d.fro * 180 / Math.PI, 0, 0);
						}
						else
						{
							mx = (d.x + tx) * rx;
							my = (d.y + ty) * ry - 5;
							
							e.translate(mx, my);
						}
					}
					else
					{
						e.scale(rx, ry, rx, ry);
					}
					if (d.ftr && d.c != "t")
					{
						e.translate(d.ftr[0] + mx, d.ftr[1] + my);
					}
					
					if (d.fro && d.c != "t")
					{
						e.rotate(d.fro * 180 / Math.PI);
					}
				}
			}
		
			rset = r.setFinish();
		}

		return svg;
	},
	
	F4/*drawPlot*/: function(c, plotdata, includeinlayout, resized) {
		var me = this,
			gp = me.gp/*rparentdom*/,
			pw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(gp),
			ph = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(gp),
			cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(c),
			ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(c),
			r, pr,
			i,
			d, rset, e,
			rx = cw / plotdata.w,
			ry = ch / plotdata.h,
			rt, mx, my, tx, ty, box,
			attr, h = false,
			svg = [];
			
		// console.log(pw, ph, me.width, me.height);
			
		if (pw == 0 && ph == 0)
		{
			pw = me.width;
			ph = me.height;
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(gp, pw);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._h(gp, ph);
		}
		
		if (cw == 0 && ch == 0)
		{
			cw = me.width;
			ch = me.height;
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(c, cw);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._h(c, ch);
		}
		
		if (Math.abs(plotdata.w - pw) > 5 || Math.abs(plotdata.h - ph) > 5)
		{
			cw = plotdata.w;
			ch = plotdata.h;
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(c, cw);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._h(c, ch);
			
			if (pw < cw || ph < ch)
			{
				gp.css({overflow: "scroll"});
			}
			else
			{
				gp.css({overflow: "hidden"});
			}
		}
		else
		{
			if (resized === false)
			{
				IG$/*mainapp*/.x_10/*jqueryExtension*/._w(c, plotdata.w);
				IG$/*mainapp*/.x_10/*jqueryExtension*/._h(c, plotdata.h);
			}
			gp.css({overflow: "hidden"});
		}

		var dcanvas = false,
			canvassupported = !!window.HTMLCanvasElement;
		
		dcanvas = IG$/*mainapp*/.mcanvas || canvassupported;
		
		if (includeinlayout == false)
		{
			svg = me.F4s/*drawPlotSVG*/(c, plotdata, includeinlayout);
		}
		else if (dcanvas)
		{
			me.F4c/*drawPlotCanvas*/(c, plotdata);
		}
		else
		{
			me.F4s/*drawPlotSVG*/(c, plotdata, includeinlayout);
		}

		return svg;
	},
	
	R1/*render*/: function(eldom) {
		var sender = this;
		sender.gp/*rparentdom*/ = eldom;
		sender.gz/*rgraphzone*/ = $("<div></div>");
		sender.gz/*rgraphzone*/.appendTo(eldom);
		sender.cz/*controlzone*/ = $("<ul class='r-menu'><ul>").hide();
		
		sender.mz/*currentpage*/ = $("<li class='r-disp'></li>").appendTo(sender.cz/*controlzone*/);
		sender.mz/*currentpage*/.text("Page: " + (sender.pg + 1));
		
		$("<li class='r-back' title='Previous page'> </li>").appendTo(sender.cz/*controlzone*/).bind("click", function() {
			if (sender.pgm > -1)
			{
				clearInterval(sender.pgm);
			}
			sender.fm/*moveControlPage*/(-1);
		});
		
		$("<li class='r-stop' title='Stop play'> </li>").appendTo(sender.cz/*controlzone*/).bind("click", function() {
			if (sender.pgm > -1)
			{
				clearInterval(sender.pgm);
				sender.pgm = -1;
			}
		});
		
		$("<li class='r-play' title='Play pages'> </li>").appendTo(sender.cz/*controlzone*/).bind("click", function() {
			if (sender.pgm > -1)
			{
				clearInterval(sender.pgm);
			}
			
			sender.pg = 0;
			
			sender.pgm = setInterval(function() {
				sender.fm/*moveControlPage*/(1);
			}, sender.pgs);
		});
		
		$("<li class='r-slower' title='Slower play'> </li>").appendTo(sender.cz/*controlzone*/).bind("click", function() {
			if (sender.pgm > -1)
			{
				clearInterval(sender.pgm);
			}
			
			sender.pgs += 100;
			sender._ILb/*sheetoption*/.rro/*ROption*/.pgs = sender.pgs;
			
			sender.pgm = setInterval(function() {
				sender.fm/*moveControlPage*/(1);
			}, sender.pgs);
		});
		
		$("<li class='r-faster' title='Fast play'> </li>").appendTo(sender.cz/*controlzone*/).bind("click", function() {
			if (sender.pgm > -1)
			{
				clearInterval(sender.pgm);
			}
			
			if (sender.pgs - 100 > 100)
			{
				sender.pgs -= 100;
				sender._ILb/*sheetoption*/.rro/*ROption*/.pgs = sender.pgs;
			}
			
			sender.pgm = setInterval(function() {
				sender.fm/*moveControlPage*/(1);
			}, sender.pgs);
		});
		
		$("<li class='r-forward' title='Next page'> </li>").appendTo(sender.cz/*controlzone*/).bind("click", function() {
			if (sender.pgm > -1)
			{
				clearInterval(sender.pgm);
			}
			sender.fm/*moveControlPage*/(1);
		});
		
		sender.cz/*controlzone*/.appendTo(eldom);
    	IG$/*mainapp*/._I0a/*drawLicenseTag*/(eldom);
    	
    	sender.rstat = $("<div class='m-r-rstat'></div>").hide();
    	var btncloserstat = $("<div class='m-r-rstat-button'><span id='rstat-title'>Statistics Summary</span><div id='rstat-close'></div></div>").appendTo(sender.rstat);
    	
    	$("#rstat-close", btncloserstat).bind("click", function() {
    		var me = sender;
				
			if (me._ILb/*sheetoption*/)
			{
				me._ILb/*sheetoption*/.rro/*ROption*/.s1/*showsummary*/ = false;
			}
			
			me.rstat.hide();
    	});
    	
    	sender.rstatcontent = $("<div class='m-r-rstatcontent'></div>").appendTo(sender.rstat);
    	sender.rstat.appendTo(eldom);
    	
		sender.rpp/*rpromptbutton*/ = $("<div class='m-r-promptbutton'><div class='icon'></div><span>Prompt</span></div>").hide();
		sender.rpp/*rpromptbutton*/.appendTo(eldom);
		
		sender.rpP/*rpromptpanel*/ = $("<div class='m-r-promptpanel'><table id='prompttable'><tr id='promptcontent'></tr><tr><td><button id='promptrequest'>Request</button></td></tr></table></div>").hide();
		sender.rpP/*rpromptpanel*/.appendTo(eldom);
		
		sdom = $("#promptrequest", sender.rpP/*rpromptpanel*/);
		sdom.bind("click", function() {
			sender.F3/*requestR*/.call(sender);
		});
		
		sender.rpp/*rpromptbutton*/.bind("click", function() {
			sender.rpP/*rpromptpanel*/.toggle();
		});
	},
	
	fm/*moveControlPage*/: function(inc) {
		var me = this,
			p/*plotdata*/ = me.p/*plotdata*/,
			pg = me.pg,
			gdom = me.gz/*rgraphzone*/,
			next = pg + inc;
			
		if (next < p/*plotdata*/.length && next > -1)
		{
			me.pg = next;
			me.fm1/*updatePageDisplay*/();
			gdom.empty();
			me.F4/*drawPlot*/(gdom, p/*plotdata*/[me.pg], true, false);
		}
		else if (me.pgm > -1)
		{
			clearInterval(me.pgm);
		}
	},
	
	fm1/*updatePageDisplay*/: function() {
		var me = this;
		me.mz/*currentpage*/.text("Page: " + (me.pg + 1) + "/" + me.p/*plotdata*/.length);
	},
	
	f5u/*getDataColumns*/: function() {
		var r = [],
			me = this,
			mrs = me._IK2/*mresults*/,
			results = mrs.results,
			result, rowfix, colfix, cols, data,
			i, j, cname;
		
		if (mrs && results && results.length > 0)
		{
			result = results[0];
			rowfix = result.rowfix;
			colfix = result.colfix;
			cols = result.cols;
			data = result.data;
			
			for (i=0; i < cols; i++)
			{
				for (j=0; j < rowfix; j++)
				{
					cname = (j == 0) ? data[j][i].code : cname + "_" + data[j][i].code;
				}
				r.push(
					{
						cindex: i,
						isdata: (i < colfix ? false : true),
						name: cname
					}
				)
			}
		}
		
		return r;
	}
}
if ($s.window)
{
	IG$/*mainapp*/.rp$Rr/*rscripteditor*/ = $s.extend($s.window, {
		name: "rscript",
		title: "Script",
		layout: "fit",
		height: 400,
		width: 500,
		modal: true,
		draggable: true,
		bodyStyle: "padding: 0px",
		resizable: true,
		focusOnToFront: true,
		
		_1/*initApp*/: function() {
			var me = this,
				reditor = me.down("[name=rscript]"),
				rprompt = me.down("[name=rprompt]"),
				minwidth = me.down("[name=minwidth]"),
				minheight = me.down("[name=minheight]"),
				_ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
				
			reditor.setValue(_ILb/*sheetoption*/.rro/*ROption*/.s3/*scriptcontent*/);
			rprompt.setValue(_ILb/*sheetoption*/.rro/*ROption*/.s4/*rprompt*/);
			minwidth.setValue(_ILb/*sheetoption*/.rro/*ROption*/.smw/*minwidth*/);
			minheight.setValue(_ILb/*sheetoption*/.rro/*ROption*/.smh/*minheight*/);
		},
		
		_2/*confirm*/: function() {
			var me = this,
				reditor = me.down("[name=rscript]"),
				rprompt = me.down("[name=rprompt]"),
				minwidth = me.down("[name=minwidth]"),
				minheight = me.down("[name=minheight]");
				
			reditor.setValue(_ILb/*sheetoption*/.rro/*ROption*/.s3/*scriptcontent*/);
			rprompt.setValue(_ILb/*sheetoption*/.rro/*ROption*/.s4/*rprompt*/);
			minwidth.setValue(_ILb/*sheetoption*/.rro/*ROption*/.smw/*minwidth*/);
			minheight.setValue(_ILb/*sheetoption*/.rro/*ROption*/.smh/*minheight*/);
		},
		
		initComponent: function() {
			var me = this;
			
			$s.apply(me, {
				items: [
					{
						xtype: "tabpanel",
						name: "meT",
						activeTab: 0,
						flex: 1,
						headerPosition: "right",
						tabPosition: "top",
						preventHeader: true,
						plain: true,
						"layout": "fit",
						defaults: {
							bodyPadding: 10
						},
						items: [
							{
								xtype: "panel",
								title: "Script",
								layout: "fit",
								border: 0,
								items: [
									{
										xtype: "textarea",
								        grow: false,
								        name: 'rscript',
								        fieldLabel: 'R Script',
								        hideLabel: true,
								        anchor: '100%'
								    }
								],
								dockedItems: 
								[
									{
										xtype: "form",
										dock: "bottom",
										layout: "anchor",
										defaults: {
											anchor: "100%",
											bodyStyle: "padding: 2px"
										},
										items: [
											{
												xtype: "fieldset",
												title: IRm$/*resources*/.r1("L_VIEW_OPTION"),
												defaultType: "textfield",
												items: [
													{
														xtype: "fieldcontainer",
														layout: {
															type: 'hbox',
															align: "stretch"
														},
														bodyPadding: 0,
														items: [
															{
																name: "minwidth",
																fieldLabel: IRm$/*resources*/.r1("L_MIN_WIDTH"),
																xtype: "numberfield",
																labelAlign: "right",
																value: 0,
																minValue: 0,
																maxValue: 5000,
																flex: 1
															},
															{
																name: "minheight",
																fieldLabel: IRm$/*resources*/.r1("L_MIN_HEIGHT"),
																xtype: "numberfield",
																labelAlign: "right",
																value: 0,
																minValue: 0,
																maxValue: 5000,
																flex: 1
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
								xtype: "panel",
								title: "Prompt",
								layout: "fit",
								border: 0,
								items: [
								    {
								    	xtype: "textarea",
								    	grow: false,
								    	name: "rprompt",
								    	fieldLabel: "R Prompt",
								    	hideLabel: true,
								    	anchor: "100%"
								    }
								]
							}
						]
					}
				],
				//constrainHeader: true
				listeners: {
					beforeclose: function(panel, opt) {
						var me = this;
						
						if (me._ILb/*sheetoption*/)
						{
							me._ILb/*sheetoption*/.rro/*ROption*/.s2/*showscript*/ = false;
						}
					},
					afterrender: function() {
						this._1/*initApp*/();
					},
					scope: this
				},
				
				buttons: [
					"->",
					{
						xtype: "button",
						text: "Request",
						handler: function() {
							var me = this,
								reditor = me.down("[name=rscript]"),
								rprompt = me.down("[name=rprompt]"),
								minwidth = me.down("[name=minwidth]"),
								minheight = me.down("[name=minheight]"),
								sop = me._ILb/*sheetoption*/,
								rro = sop.rro/*ROption*/;
							
							rro.s3/*scriptcontent*/ = reditor.getValue();
							rro.s4/*rprompt*/ = rprompt.getValue();
							rro.smw/*minwidth*/ = minwidth.getValue();
							rro.smh/*minheight*/ = minheight.getValue();
							
							me.callback && me.callback.execute();
						},
						scope: this
					},
					{
						xtype: "button",
						text: "Close",
						handler: function() {
							var me = this;
							me.close();
						},
						scope: this
					}
				]
			});
			
			IG$/*mainapp*/.rp$Rr/*rscripteditor*/.superclass.initComponent.call(this);
		}
	});
}

IG$/*mainapp*/.rp$RR/*rstatistics*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	sheetobj: null,
	pg: 0,
	pgm: -1,
	pgs: 2000,
	rt: -1,
	df: 6,
	
	sized: true,
	aftsized: false,
	
	layout: "fit",
	
	_k1/*init*/: false,
	
	_IFd/*init_f*/: function() {
		var panel = this,
			w = panel.getWidth(),
			h = panel.getHeight(),
			sheet = panel.body.dom,
			canvas = null,
			i;
			
		panel._k1/*init*/ = true;
		
		panel.FmP/*updatePromptControls*/();
		
		if (panel._IK2/*mresults*/)
		{
			panel._IKc/*applyReportResult*/(null, null, null, null, true);
		}
	},
	
	_IL0/*initCustomControl*/: function() {
	},
	
	_IKc/*applyReportResult*/: function(_IK2/*mresults*/, _IK9/*olapset*/, _ILa/*reportoption*/, _ILb/*sheetoption*/, lrender) {
		var panel = this,
			w, h,
			rstat = panel.rstat,
			rstatcontent = panel.rstatcontent, //.down("[name=rstatcontent]"),
			i;
		
		if (!lrender)
		{
			panel._IK2/*mresults*/ = _IK2/*mresults*/;
			panel._IK9/*olapset*/ = _IK9/*olapset*/;
			panel._ILa/*reportoption*/ = _ILa/*reportoption*/;
			panel._ILb/*sheetoption*/ = _ILb/*sheetoption*/;
		}
		
		if (!panel._k1/*init*/)
		{
			return;
		}
		
		w = panel.getWidth();
		h = panel.getHeight();
		
		if (panel._ILb/*sheetoption*/.rro/*ROption*/.s1/*showsummary*/)
		{
			rstat.show();
		}
		else
		{
			rstat.hide();
		}
		
		panel.pgs = panel._ILb/*sheetoption*/.rro/*ROption*/.pgs || 2000;
		
		setTimeout(function() {
			if (_IK2/*mresults*/.r_stat)
			{
				panel.rs_F3/*requestR*/.call(panel, _IK2/*mresults*/.r_stat);
			}
			else if (panel.sized == true)
			{
				panel.F3/*requestR*/.call(panel);
			}
			else
			{
				panel.aftsized = true;
			}
		}, 20);
	},
	
	F2a/*updateRScript*/: function() {
		var panel = this,
			_ILb/*sheetoption*/ = panel._ILb/*sheetoption*/;
	},
	
	_IJ8/*controlWindows*/: function(cmd) {
		var me = this,
			rstat = me.rstat,
			svalue,
			dlg;
			
		switch (cmd)
		{
		case "cmd_r_summary":
			svalue = "s1"/*showsummary*/;
			rstat.show();
			break;
		case "cmd_r_script":
			svalue = "s2"/*showscript*/;
			dlg = new IG$/*mainapp*/.rp$Rr/*rscripteditor*/({
				_ILb/*sheetoption*/: me._ILb/*sheetoption*/,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
					var me = this;
					me.FmP/*updatePromptControls*/.call(me);	
					me.F3/*requestR*/();
				})
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
			break;
		}
		
		if (me._ILb/*sheetoption*/ && svalue)
		{
			me._ILb/*sheetoption*/.rro/*ROption*/[svalue] = true;
		}
	},
	
	_IFd/*init_f*/: function() {
		var panel = this,
			w = panel.getWidth(),
			h = panel.getHeight(),
			sheet = panel.body.dom,
			canvas = null,
			i;
			
		panel._k1/*init*/ = true;
		
		panel.FmP/*updatePromptControls*/();
		
		if (panel._IK2/*mresults*/)
		{
			panel._IKc/*applyReportResult*/(null, null, null, null, true);
		}
	},
	
	_IL0/*initCustomControl*/: function() {
	},
	
	_ic/*initComponent*/: function() {
		var panel = this;
		
		IG$/*mainapp*/.apply(panel, {
			items: [
				{
					xtype: "panel",
					name: "rmain",
					layout: "fit",
					items: [
						{
							name: "rgraph",
							xtype: "panel",
							layout: "fit",
							items: [
								{
									name: "rg",
									html: "",
									xtype: "container",
									bodyStyle: "padding: 0px"
								}
							]
						}
					]
				}
			]
		});
		
		panel.on("resize", function(p, w, h) {
			panel.CLS.resize.call(panel, w, h);
		});
		panel.on("afterrender", function() {
			panel.CLS.afterrender.call(panel, panel);
		});
		
		IG$/*mainapp*/.rp$RR/*rstatistics*/.superclass._ic/*initComponent*/.call(panel);
	},
	
	CLS: {
		resize: function(w, h) {
			var me = this,
				rgraph = me.down("[name=rgraph]"),
				rg = me.down("[name=rg]"),
				gz = me.gz/*rgraphzone*/;
			
			if (w > 0 && h > 0)
			{
				rg.setSize(w, h);
				if (gz)
				{
					IG$/*mainapp*/.x_10/*jqueryExtension*/._w(gz, w);
					IG$/*mainapp*/.x_10/*jqueryExtension*/._h(gz, h);
				}
				me.setPanelSize(w, h);
				
				me.sized = true;
				
				if (me.aftsized == true)
				{
					me.aftsized = false;
					me.F3/*requestR*/.call(me);
				}
			}
		},
		afterrender: function(sender) {
			var i,
				rgraph = sender.down("[name=rg]"),
				eldom = $(rgraph.body.dom);
				
			eldom.empty();
				
			sender.R1/*render*/.call(sender, eldom);
			
			this._IFd/*init_f*/();
		}
	},
	
	F3/*requestR*/: IG$/*mainapp*/._Ib9/*rprstat_jquery*/.F3/*requestR*/,
	rs_F3/*requestR*/: IG$/*mainapp*/._Ib9/*rprstat_jquery*/.rs_F3/*requestR*/,
	a/*appendSummary*/: IG$/*mainapp*/._Ib9/*rprstat_jquery*/.a/*appendSummary*/,
	F4c/*drawPlotCanvas*/: IG$/*mainapp*/._Ib9/*rprstat_jquery*/.F4c/*drawPlotCanvas*/,
	F4s/*drawPlotSVG*/: IG$/*mainapp*/._Ib9/*rprstat_jquery*/.F4s/*drawPlotSVG*/,
	F4/*drawPlot*/: IG$/*mainapp*/._Ib9/*rprstat_jquery*/.F4/*drawPlot*/,
	FmP/*updatePromptControls*/: IG$/*mainapp*/._Ib9/*rprstat_jquery*/.FmP/*updatePromptControls*/,
	fm/*moveControlPage*/: IG$/*mainapp*/._Ib9/*rprstat_jquery*/.fm/*moveControlPage*/,
	fm1/*updatePageDisplay*/: IG$/*mainapp*/._Ib9/*rprstat_jquery*/.fm1/*updatePageDisplay*/,
	f5u/*getDataColumns*/: IG$/*mainapp*/._Ib9/*rprstat_jquery*/.f5u/*getDataColumns*/,
	R1/*render*/: IG$/*mainapp*/._Ib9/*rprstat_jquery*/.R1/*render*/,
	
	setPanelSize: function(w, h) {
		var p = this;
		if (p.rt > -1)
		{
			clearTimeout(p.rt);
		}
		
		p.rt = setTimeout(function() {
			var gdom = p.gz/*rgraphzone*/;
			gdom.empty();
			if (p.p/*plotdata*/ && p.p/*plotdata*/.length > 0)
			{
				p.width = w;
				p.height = h;
				
				p.F4/*drawPlot*/(gdom, p.p/*plotdata*/[p.pg], true, true);
			}
		}, 200);
	},
	
	_IL7/*getDrillXML*/: function() {
		var dinfo = '';
		return dinfo;
	},
	
	_IB4/*getExportData*/: function(option, startx, starty, filetype, docid, d_width, d_height) {
		var me = this,
			r = [],
    		i,
    		ix = startx, iy = starty, offset,
    		sliceview,
    		rview, svg, expdata,
    		iw, ih,
    		p = me.p/*plotdata*/,
    		gdom = me.gz/*rgraphzone*/;
    	
    	if (p && p.length > me.pg)
    	{
    		rview = p[me.pg];
    		ix = startx;
    		iy = starty;
    		iw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(gdom);
    		ih = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(gdom);
    		r.push("<item type='chart' x='" + ix + "' y='" + iy + "' d_width='" + d_width + "' d_height='" + d_height + "' width='" + iw + "' height='" + ih + "' docid='" + docid + "'>");
    		if (filetype !== "SVG" && me.crv && me.crv[0] && me.crv[0].toDataURL)
    		{
    			r.push("<ImageData type='png'><![CDATA[" + me.crv[0].toDataURL("image/png") + "]]></ImageData>");
    		}
    		else
    		{
    			r.push("<ImageData type='svg'><![CDATA[" + Base64.encode(me.F4/*drawPlot*/(gdom, rview, false).join("")) + "]]></ImageData>");
    		}
    		r.push("</item>");
    	}
    	
    	return r.join("");
	},
	
	_IN0/*applyOptions*/: function(rop, sop) {
		var me = this;
		
		if (rop && sop)
		{
			me._ILa/*reportoption*/ = rop;
			me._ILb/*sheetoption*/ = sop;
		}
	}
});

//IG$/*mainapp*/.rp$RR/*rstatistics*/ = Ext.extend(Ext.container.Container, {
//	extend: 'Ext.container.Container',
//});

IG$/*mainapp*/.rp$RPa/*python*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	sheetobj: null,
	pg: 0,
	pgm: -1,
	pgs: 2000,
	rt: -1,
	df: 6,
	
	sized: true,
	aftsized: false,
	
	layout: "fit",
	
	_k1/*init*/: false,
	
	_IL0/*initCustomControl*/: function() {
	},
	
	_IKc/*applyReportResult*/: function(_IK2/*mresults*/, _IK9/*olapset*/, _ILa/*reportoption*/, _ILb/*sheetoption*/, lrender) {
		var panel = this,
			w, h,
			i;
		
		if (!lrender)
		{
			panel._IK2/*mresults*/ = _IK2/*mresults*/;
			panel._IK9/*olapset*/ = _IK9/*olapset*/;
			panel._ILa/*reportoption*/ = _ILa/*reportoption*/;
			panel._ILb/*sheetoption*/ = _ILb/*sheetoption*/;
		}
		
		if (!panel._k1/*init*/)
		{
			return;
		}
		
		w = panel.getWidth();
		h = panel.getHeight();
        
		setTimeout(function() {
            if (_IK2/*mresults*/.r_python)
			{
				panel.rs_F3/*requestPython*/.call(panel, _IK2/*mresults*/.r_python);
			}
			else if (panel.sized == true)
			{
				panel.F3/*requestPython*/.call(panel);
			}
        }, 10);
	},
    
    F3/*requestPython*/: function() {
        var panel = this,
			olapset = panel._IK9/*olapset*/,
			_ILa/*reportoption*/ = panel._ILa/*reportoption*/,
			sheetobj = panel.sheetobj,
			doc;
		if (olapset && olapset._IL8/*jobid*/)
		{
			sheetobj._ILb/*sheetoption*/.panelwidth = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(panel.gp/*rparentdom*/);
			sheetobj._ILb/*sheetoption*/.panelheight = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(panel.gp/*rparentdom*/);
			doc = _ILa/*reportoption*/._IJ1/*getCurrentPivot*/();
			panel.setLoading(true);
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
		            ack: "18",
					payload: '<smsg><item uid="' + _ILa/*reportoption*/.uid + '" jobid="' + olapset._IL8/*jobid*/ + '" option="pivot" active="' + sheetobj.sheetindex + '" pivotresult="F" pythonresult="T"/></smsg>',
					mbody: doc
		        }, panel, panel.rs_F3/*requestPython*/);
			req._l/*request*/();
		}
    },
    
    rs_F3/*requestPython*/: function(xdoc) {
		var me = this,
			tnode,
			output,
            rg = me.down("[name=rg]"),
            region = $(".notebook", rg.body.dom);
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/result/output");
        
        region.empty();

		if (tnode)
		{
            output = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
            output = Base64.decode(output);
            $(output).appendTo(region);
		}
	},
	
	
	_IJ8/*controlWindows*/: function(cmd) {
		var me = this;
	},
	
	_IFd/*init_f*/: function() {
		var panel = this,
			w = panel.getWidth(),
			h = panel.getHeight(),
			sheet = panel.body.dom,
			canvas = null,
			i;
			
		panel._k1/*init*/ = true;
		
		if (panel._IK2/*mresults*/)
		{
			panel._IKc/*applyReportResult*/(null, null, null, null, true);
		}
	},
	
	_IL0/*initCustomControl*/: function() {
	},
	
	_ic/*initComponent*/: function() {
		var panel = this;
		
		IG$/*mainapp*/.apply(panel, {
			items: [
				{
					xtype: "panel",
					name: "rmain",
					layout: "fit",
					items: [
						{
							name: "rgraph",
							xtype: "panel",
							layout: "fit",
							items: [
								{
									name: "rg",
									xtype: "container",
                                    autoScroll: true,
									bodyStyle: "padding: 0px"
								}
							]
						},
                        {
                            xtype: "panel",
                            name: "redit",
                            layout: "fit",
                            hidden: true,
                            html: "<div class='r_python'><textarea name='tarea'></textarea></div>"
                        }
					]
				}
			]
		});
		
		panel.on("resize", function(p, w, h) {
			panel.CLS.resize.call(panel, w, h);
		});
		panel.on("afterrender", function() {
			panel.CLS.afterrender.call(panel, panel);
		});
		
		IG$/*mainapp*/.rp$RPa/*python*/.superclass._ic/*initComponent*/.call(panel);
	},
	
	CLS: {
		resize: function(w, h) {
			var me = this;
			
			if (w > 0 && h > 0)
			{
				me.setPanelSize(w, h);
				
				me.sized = true;
				
				if (me.aftsized == true)
				{
					me.aftsized = false;
				}
			}
		},
		afterrender: function(sender) {
			var i,
				rgraph = sender.down("[name=rg]"),
				eldom = $(rgraph.body.dom);
				
			$("<div class='notebook notebook-container'></div>").appendTo(eldom);
			
			this._IFd/*init_f*/();
		}
	},
		
	setPanelSize: function(w, h) {
		var p = this;
		if (p.rt > -1)
		{
			clearTimeout(p.rt);
		}
		
		p.rt = setTimeout(function() {
		}, 20);
	},
	
	_IL7/*getDrillXML*/: function() {
		var dinfo = '';
		return dinfo;
	},
	
	_IB4/*getExportData*/: function(option, startx, starty, filetype, docid, d_width, d_height) {
		var me = this,
			r = [],
    		i,
    		ix = startx, iy = starty, offset,
    		sliceview,
    		rview, svg, expdata,
    		iw, ih,
    		p = me.p/*plotdata*/,
    		gdom = me.gz/*rgraphzone*/;
    	
    	if (p && p.length > me.pg)
    	{
    		rview = p[me.pg];
    		ix = startx;
    		iy = starty;
    		iw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(gdom);
    		ih = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(gdom);
    		r.push("<item type='chart' x='" + ix + "' y='" + iy + "' d_width='" + d_width + "' d_height='" + d_height + "' width='" + iw + "' height='" + ih + "' docid='" + docid + "'>");
    		if (filetype !== "SVG" && me.crv && me.crv[0] && me.crv[0].toDataURL)
    		{
    			r.push("<ImageData type='png'><![CDATA[" + me.crv[0].toDataURL("image/png") + "]]></ImageData>");
    		}
    		else
    		{
    			r.push("<ImageData type='svg'><![CDATA[" + Base64.encode(me.F4/*drawPlot*/(gdom, rview, false).join("")) + "]]></ImageData>");
    		}
    		r.push("</item>");
    	}
    	
    	return r.join("");
	},
	
	_IN0/*applyOptions*/: function(rop, sop) {
		var me = this;
		
		if (rop && sop)
		{
			me._ILa/*reportoption*/ = rop;
			me._ILb/*sheetoption*/ = sop;
		}
	},
    
    _do_edit: function(editmode) {
        var me = this,
            rgraph = me.down("[name=rgraph]"),
            redit = me.down("[name=redit]"),
            teditor,
            sop = me._ILb/*sheetoption*/,
            pro;
        
        rgraph.setVisible(!editmode);
        redit.setVisible(editmode);
        
        if (editmode)
        {
            pro = sop.pro/*pythonOption*/;
            
            teditor = $("[name=tarea]", redit.body.dom);
            teditor.val(pro ? pro.s3/*scriptcontent*/ : "");
        }
        else
        {
            if (me.editmode)
            {
                pro = sop.pro/*pythonOption*/;
            
                teditor = $("[name=tarea]", redit.body.dom);
                
                pro.s3/*scriptcontent*/ = teditor.val();
            }
        }
        
        me.editmode = editmode;
    }
});

