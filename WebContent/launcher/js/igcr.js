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
IG$/*mainapp*/.CI7_/*dashboardmenustructure*/ = function(xdoc) {
	var me = this;
	
	me.sid = 0;
	
	me._a/*menustructure*/ = {
		map: {},
		root: {
			name: "Menu",
			sid: 99,
			level: -1,
			option: {},
			description: "Top Menu",
			expanded: true,
			children: [
			]
		}
	};
	
	me._a/*menustructure*/.map[99] = me._a/*menustructure*/.root;
	
	xdoc && me._1/*parse*/(xdoc);
}

IG$/*mainapp*/.CI7_/*dashboardmenustructure*/.prototype = {
	_1/*parse*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			snode,
			tnodes, snodes,
			p, i, j, sid, pitems;
		
		if (tnode)
		{
			me.item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			snode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "menustructure");
			snode && me._4/*parseMenuNode*/(me._a/*menustructure*/.root, snode);
			
			snode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "menuitems");
			if (snode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
				for (i=0; i < tnodes.length; i++)
				{
					sid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "sid");
					pitems = me._a/*menustructure*/.map[sid];
					if (pitems)
					{
						snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnodes[i]);
						pitems.items = [];
						for (j=0; j < snodes.length; j++)
						{
							p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[j]);
							pitems.items.push(p);
						}
					}
				}
			}
		}
	},
	
	_2/*getxml*/: function() {
		var me = this,
			r = [],
			m = [];
		
		r.push("<menustructure>");
		r.push(me._3/*getNode*/(me._a/*menustructure*/.root, m));
		r.push("</menustructure>");
		
		r.push("<menuitems>");
		r.push(m.join(""));
		r.push("</menuitems>");
		
		return r.join("");
	},
	
	_3/*getNode*/: function(tnode, m) {
		var me = this,
			i, j,
			p,
			r = "";
		
		r += "<option>";
		for (j in tnode.option)
		{
			r += (tnode.option[j]) ? "<opt name='" + j + "'><![CDATA[" + tnode.option[j] + "]]></opt>" : "";
		}
		r += "</option>";					
				
		if (tnode.children)
		{
			for (i=0; i < tnode.children.length; i++)
			{
				p = tnode.children[i];
				r += "<menu" + IG$/*mainapp*/._I20/*XUpdateInfo*/(p, "sid;name;description") + ">";
				r += me._3/*getNode*/(p, m);
				r += "</menu>";
				
				if (p.items)
				{
					m.push("<menuitem sid='" + p.sid + "'>");
					for (j=0; j < p.items.length; j++)
					{
						m.push("<menu" + IG$/*mainapp*/._I20/*XUpdateInfo*/(p.items[j], "uid;name;type;nodepath") + "/>");
					}
					m.push("</menuitem>");
				}
			}
		}
		
		return r;
	},
	
	_4/*parseMenuNode*/: function(pobj, tnode) {
		var me = this,
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			snodes,
			i, j, p,
			tname;
			
		for (i=0; i < tnodes.length; i++)
		{
			tname = IG$/*mainapp*/._I29/*XGetNodeName*/(tnodes[i]);
			
			if (tname == "menu")
			{
				p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				p.children = [];
				p.option = {};
				p.level = pobj.level + 1;
				me._a/*menustructure*/.map[p.sid] = p;
				me.sid = Math.max(me.sid, parseInt(p.sid)+1);
				pobj.children.push(p);
				
				me._4/*parseMenuNode*/(p, tnodes[i]);
			}
			else if (tname == "option")
			{
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnodes[i]);
				for (j=0; j < snodes.length; j++)
				{
					pobj.option[IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[j], "name")] = IG$/*mainapp*/._I24/*getTextContent*/(snodes[j]);
				}
			}
		}
	}
}

if (window.Ext)
{
	IG$/*mainapp*/._I7a_/*dashboardmenuconfig*/ = $s.extend($s.window, {
		modal: true,
		title: "Page Config",
		layout: "fit",
		width: 400,
		autoHeight: true,
		
		_1/*initApp*/: function() {
			var me = this,
				option;
			if (me.item)
			{
				option = me.item.option;
				me.down("[name=ltype]").setValue(option.ltype || "");
				me.down("[name=_h]").setValue(option.html);
				me.down("[name=_t]").setValue(option.tmpl);
				me.down("[name=_ra]").setValue(option.rptl);
				me.rptl_uid = option.rptl_uid;
				me.down("[name=_s]").setValue(option.scrp);
			}
		},
		
		_2/*changeLayout*/: function() {
			var me = this,
				ltype = me.down("[name=ltype]").getValue();
			
			$.each(["_h", "_r", "_t"], function(i, t) {
				me.down("[name=" + t + "]").setVisible(ltype && "_" + ltype.charAt(0) == t ? true : false);
			});
		},
		
		_3/*confirmChanges*/: function() {
			var me = this,
				option;
			if (me.item)
			{
				option = me.item.option;
				option.ltype = me.down("[name=ltype]").getValue();
				option.html = me.down("[name=_h]").getValue();
				option.tmpl = me.down("[name=_t]").getValue();
				option.rptl = me.down("[name=_ra]").getValue();
				option.rptl_uid = me.rptl_uid;
				option.scrp = me.down("[name=_s]").getValue();
			}
			
			this.close();
		},
		
		initComponent: function() {
	    	var me = this;
	    	
	    	$s.apply(this, {
	    		items: [
	    			{
	    				xtype: "panel",
	    				layout: "anchor",
	    				bodyPadding: 10,
	    				defaults: {
	    					anchor: "100%"
	    				},
	    				items: [
	    					{
	    						xtype: "combobox",
	    						fieldLabel: "Load Type",
	    						name: "ltype",
	    						queryMode: "local",
	    						editable: false,
	    						valueField: "value",
	    						displayField: "name",
	    						store: {
	    							xtype: "store",
	    							fields: ["name", "value"],
	    							data: [
	    								{name: "No Action", value: ""},
	    								{name: "Template", value: "template"},
	    								{name: "Load HTML", value: "html"},
	    								{name: "Open Report", value: "report"}
	    							]
	    						},
	    						listeners: {
	    							change: function() {
	    								this._2/*changeLayout*/();
	    							},
	    							scope: this
	    						}
	    					},
	    					{
	    						xtype: "textfield",
	    						name: "_h",
	    						fieldLabel: "Default HTMLPage"
	    					},
	    					{
	    						xtype: "fieldcontainer",
	    						name: "_r",
	    						layout: "hbox",
	    						fieldLabel: "Report",
	    						items: [
	    							{
	    								xtype: "textfield",
	    								name: "_ra",
	    								readOnly: true,
	    								flex: 1
	    							},
	    							{
	    								xtype: "button",
	    								text: "..",
	    								handler: function() {
	    									var me = this,
		    									dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
		    									visibleItems: "workspace;folder;report;dashboard",
		    									u5x/*treeOptions*/: {
		    										cubebrowse: false
		    									},
		    									callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
	    											var _ra = me.down("[name=_ra]");
	    											_ra.setValue(item.name);
	    											me.rptl_uid = item.uid;
	    										})
		    								});
		    								IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	    								},
	    								scope: this
	    							}
	    						]
	    					},
	    					{
	    						xtype: "combobox",
	    						name: "_t",
	    						queryMode: "local",
	    						fieldLabel: "Template Name",
	    						editable: false,
	    						valueField: "value",
	    						displayField: "name",
	    						store: {
	    							xtype: "store",
	    							fields: ["name", "value"]
	    						}
	    					},
	    					{
	    						xtype: "textfield",
	    						fieldLabel: "After Javascript",
	    						name: "_s"
			    			}
	    				]
	    			}
	    		],
	    		buttons: [
	    			{
						text: IRm$/*resources*/.r1("B_CONFIRM"),
						handler: function() {
							var me = this;
							me._3/*confirmChanges*/();
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
	    	
	    	IG$/*mainapp*/._I7a_/*dashboardmenuconfig*/.superclass.initComponent.call(this);
	    },
	    listeners: {
	    	afterrender: function(tobj) {
	    		this._1/*initApp*/();
	    	}
	    }
	});
}

IG$/*mainapp*/._I7_/*dashboardmenu*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	scroll: false,
	initialized: false,
	hideMode: 'offsets',
	"layout": "fit",
	bodyPadding: 5,
	border: 0,
	
	l1/*loadContent*/: function() {
		var me = this,
			req,
			uid = "/SYS_Config/dashboardmenu";
		
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.showerror = false;
		req.init(me, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: ''})
	        }, me, me._l1/*rs_loadContent*/, function(xdoc) {
	        	var r = true,
					req,
					errcode = IG$/*mainapp*/._I27/*getErrorCode*/(xdoc);
				
				if (errcode == "0x1400")
				{
					req = new IG$/*mainapp*/._I3e/*requestServer*/();
					req.init(me, 
						{
				            ack: "31",
				            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: uid, name: "dashboardmenu", type: "PrivateContent"}),
				            mbody: "<smsg></smsg>"
				        }, me, me.l1/*loadContent*/);
					req._l/*request*/();
					r = false;
				}
				
				return r
	        });
		req._l/*request*/();
	},
	
	_l1/*rs_loadContent*/: function(xdoc) {
		var me = this,
			menust = me.down("[name=menust]");
			
		me.c1/*appinfo*/ = new IG$/*mainapp*/.CI7_/*dashboardmenustructure*/(xdoc);
		menust.store.setRootNode(me.c1/*appinfo*/._a/*menustructure*/.root);
	},
	
	_l2/*menusthandler*/: function(act) {
		var me = this,
			menust = me.down("[name=menust]"),
			sel = menust.getSelectionModel().selected,
			appinfo = me.c1/*appinfo*/,
    		m = appinfo._a/*menustructure*/,
    		sobj,
    		suid,
    		srec;
			
		switch (act)
		{
		case 0:
			if (sel && sel.length > 0)
			{
				sobj = {
					name: "New Menu",
					sid: "" + (me.c1/*appinfo*/.sid++)
				};
				m.map[sobj.sid] = sobj;
				
				sel.items[0].appendChild(sobj, false, true);
				sel.items[0].expand();
			}
			break;
		case 1:
			if (sel && sel.length > 0)
			{
				srec = sel.items[0];
				if (!srec.isRoot())
				{
					suid = srec.get("sid");
					delete m.map[suid];
					srec.remove(); // parentNode.remove(srec);
				}
			}
			break;
		case 2:
			me._m3/*moveTreeGridSelection*/(menust, -1, false);
			break;
		case 3:
			me._m3/*moveTreeGridSelection*/(menust, 1, false);
			break;
		case 4:
			me._m3/*moveTreeGridSelection*/(menust, 1, true);
			break;
		}
	},
	
	_l3/*updateContent*/: function() {
		var me = this,
			menust = me.down("[name=menust]"),
			menuroot = menust.store.getRootNode(),
			mobj = {
				children: []
			},
			appinfo = me.c1/*appinfo*/,
			cnt,
			omenu = appinfo._a/*menustructure*/;
		
		me._l8/*updateCurrent*/();
		me._l5/*updatenode*/(omenu, menuroot, mobj);
		omenu.root.children = mobj.children;
	},
	
	_l5/*updatenode*/: function(omenu, mnode, mobj) {
		var i,
			i, pnode,
			mtree = [],
			cobj;
		
		for (i=0; i < mnode.childNodes.length; i++)
		{
			pnode = mnode.childNodes[i];
			cobj = {
				name: pnode.get("name"),
				sid: pnode.get("sid"),
				description: pnode.get("description"),
				items: [],
				children: [],
				level: mobj.level+1, 
				option: {}
			};
			
			if (omenu.map[cobj.sid])
			{
				cobj.items = omenu.map[cobj.sid].items;
				cobj.option = omenu.map[cobj.sid].option;
			}
			
			mobj.children.push(cobj);
			
			if (pnode.hasChildNodes())
			{
				this._l5/*updatenode*/(omenu, pnode, cobj);
			}
		}
	},
	
	l4/*maintoolbar*/: function(cmd) {
		var me = this;
		
		switch(cmd)
		{
		case 0: /*savecontent*/
			me._l3/*updateContent*/();
			me._l6/*saveContent*/();
			break;
		}
	},
	
	_l6/*saveContent*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			appinfo = me.c1/*appinfo*/,
			cnt;
		
		cnt = "<smsg><item>";
		cnt += appinfo._2/*getxml*/.call(appinfo);
		cnt += "</item></smsg>";
			
		req.init(me, 
			{
	            ack: "31",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: appinfo.item.uid}),
	            mbody: cnt
	        }, me, function(xdoc) {
	        	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
	        });
		req._l/*request*/();
	},
	
	_m2/*moveGridSelection*/: function(grid, direction) {
    	var records = grid.getSelectionModel().getSelection(),
    		record = records && records.length ? records[0] : null;
    		
		if (!record) 
		{
			return;
		}
		
		var index = grid.getStore().indexOf(record);
		
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
    
    _m3/*moveTreeGridSelection*/: function(grid, direction, move_left) {
    	var records = grid.getSelectionModel().getSelection(),
    		record = records && records.length ? records[0] : null;
    		
		if (!record) 
		{
			return;
		}
		
		var pnode = record.parentNode,
			index = pnode.indexOf(record),
			ppnode;
		
		if (move_left)
		{
			ppnode = pnode.parentNode;
			
			if (!ppnode)
			{
				return;
			}
			
			pnode.remove(record);
			ppnode.insert(ppnode.childNodes.length, record);
			grid.getSelectionModel().select(record, true);
		}
		else
		{
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
				if (index >= pnode.childNodes.length) 
				{
					return;
				}
			}
			
			pnode.remove(record);
			pnode.insert(index, record);
			grid.getSelectionModel().select(record, true);
		}
    },
	
	_l7/*toolbar_content*/: function(act) {
		var me = this,
			mgrid = me.down("[name=mgrid]"),
			sel, rec,
			appinfo = me.c1/*appinfo*/,
			m = appinfo._a/*menustructure*/,
			i, j, sobj;
		
		switch(act)
		{
		case 0: // add item
			break;
		case 1: // remove item
			sel = mgrid.getSelectionModel().selected;
			for (i=0; i < sel.length; i++)
			{
				rec = sel.items[i];
				mgrid.store.remove(rec);
				
				sobj = m.map[rec.get("sid")];
				
				if (sobj)
				{
					for (j=0; j < sobj.items.length; j++)
					{
						if (sobj.items[j].uid == rec.get("uid"))
						{
							sobj.items.splice(j, 1);
							break;
						}
					}
				}
			}
			break;
		case 2:	// move up
			me._m2/*moveGridSelection*/(mgrid, -1);
			break;
		case 3: // move down
			me._m2/*moveGridSelection*/(mgrid, 1);
			break;
		}
	},
	
	_IQ9/*updateGridContent*/: function(datas, item) {
		var me = this,
			mg = me.down("[name=mg]"),
			i, ndata = [],
			t;
			
		for (i=0; i < datas.length; i++)
		{
			t = datas[i].type.toLowerCase();
			if ((/report|folder/).test(t))
			{
				ndata.push(datas[i]);
			}
		}
											
		mg.store.loadData(ndata);
	},
	
	_l8/*updateCurrent*/: function() {
		var me = this,
			menust = me.down("[name=menust]"),
			sel = menust.getSelectionModel().selected,
			mgrid = me.down("[name=mgrid]"),
			appinfo = me.c1/*appinfo*/,
			m = appinfo._a/*menustructure*/,
			p, i, rec,
			sid;
			
		if (sel && sel.length > 0)
		{
			sid = sel.items[0].get("sid");
			p = m.map[sid];
			p.items = [];
			for (i=0; i < mgrid.store.data.items.length; i++)
			{
				rec = mgrid.store.data.items[i];
				p.items.push({
					uid: rec.get("uid"),
					name: rec.get("name"),
					type: rec.get("type"),
					sid: sid,
					nodepath: rec.get("nodepath")
				});
			}
		}
	},
	
	_1/*configPage*/: function(rec) {
		var me = this,
			cinfo = me.c1/*appinfo*/,
			map = cinfo._a/*menustructure*/.map,
			sid = rec.get("sid");
			
		var dlg = new IG$/*mainapp*/._I7a_/*dashboardmenuconfig*/({
			item: (sid == "") ? cinfo._a/*menustructure*/.root : map[sid]
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	},
	
	initComponent: function(){
    	var me = this;
    	
    	$s.apply(this, {
    		items: [
    			{
    				xtype: "panel",
    				layout: {
    					type: "vbox",
    					align: "stretch"
    				},
    				border: 0,
    				defaults: {
    					anchor: "100%"
    				},
    				items: [
    					{
    						xtype: "panel",
    						border: 0,
    						flex: 1,
    						layout: {
    							type: "border"
    						},
    						tbar: [
    							{
    								text: IRm$/*resources*/.r1("B_SAVE"),
    								handler: function() {
    									this.l4/*maintoolbar*/(0);
    								},
    								scope: this
    							},
    							{
    								text: IRm$/*resources*/.r1("L_REFRESH"),
    								handler: function() {
    									this.l1/*loadContent*/();
    								},
    								scope: this
    							}
    						],
    						items: [
    							{
    								xtype: "panel",
    								region: "center",
    								flex: 2,
    								border: 0,
    								layout: "border",
    								items: [
		    							{
		    								xtype: "treepanel",
		    								region: "center",
		    								flex: 1,
		    								title: "Menu Structures",
		    								name: "menust",
		    								
		    								rootVisible: true,
		    								plugins: [
		    									{
		    										ptype: "cellediting"
		    									}
		    								],
		    								store: {
		    									xtype: "treestore",
		    									proxy: {
													type: "memory"
												},
												fields: [
													"name", "description", "sid"
												]
		    								},
		    								columns: [
		    									{
		    										xtype: "treecolumn",
		    										text: IRm$/*resources*/.r1("B_TITLE"),
		    										dataIndex: "name",
		    										editor: "textfield",
		    										minWidth: 200
		    									},
		    									{
		    										text: IRm$/*resources*/.r1("B_DESC"),
		    										dataIndex: "description",
		    										editor: "textfield",
		    										flex: 1,
		    										minWidth: 200
		    									},
		    									{
		    										xtype: "actioncolumn",
		    										width: 50,
		    										items: [
			    										{
															iconCls: "icon-grid-config",
															tooltip: IRm$/*resources*/.r1("B_CONFIG_ITEM"),
															handler: function (grid, rowIndex, colIndex, item, e, record) {
																this._1/*configPage*/(record);
															},
															scope: this
														}
													]
		    									}
		    								],
		    								listeners: {
		    									beforeselect: function(tobj, record, index, eopts) {
		    										this._l8/*updateCurrent*/();
		    									},
		    									cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		    										var me = this,
		    											sid = record.get("sid"),
		    											mgrid = me.down("[name=mgrid]"),
		    											appinfo = me.c1/*appinfo*/,
		    											m = appinfo._a/*menustructure*/,
		    											dp = [], i;
		    										
		    										if (m.map[sid])
		    										{
		    											dp = m.map[sid].items || [];
		    										}
		    										
		    										for (i=0; i < dp.length; i++)
		    										{
		    											dp[i].sid = sid;
		    										}
		    										
		    										mgrid.store.loadData(dp);
		    									},
		    									scope: this
		    								},
		    								tbar: [	
		    									{
		    										text: IRm$/*resources*/.r1("L_ADD_NEW"),
		    										handler: function() {
		    											me._l2/*menusthandler*/.call(me, 0);
		    										}
		    									},
		    									{
		    										text: IRm$/*resources*/.r1("L_REMOVE_SELECTED"),
		    										handler: function() {
		    											me._l2/*menusthandler*/.call(me, 1);
		    										}
		    									},
		    									{
		    										text: IRm$/*resources*/.r1("B_MOVE_UP"),
		    										handler: function() {
		    											me._l2/*menusthandler*/.call(me, 2);
		    										}
		    									},
		    									{
		    										text: IRm$/*resources*/.r1("B_MOVE_DOWN"),
		    										handler: function() {
		    											me._l2/*menusthandler*/.call(me, 3);
		    										}
		    									},
		    									{
		    										text: "Move Left",
		    										hidden: true,
		    										handler: function() {
		    											me._l2/*menusthandler*/.call(me, 4);
		    										}
		    									}
		    								]
		    							},
		    							
		    							{
		    								xtype: "gridpanel",
		    								region: "south",
		    								name: "mgrid",
		    								selModel: {
		    									selection: "checkboxmodel",
		    									checkSelector: ".x-grid-cell"
		    								},
		    								viewConfig: {
												plugins: [
													{
														ptype: "gridviewdragdrop",
														ddGroup: "_I$RD_G_",
														enableDrop: true,
														enableDrag: false
													}
												]
											},
		    								split: true,
		    								flex: 1,
		    								title: IRm$/*resources*/.r1("L_C_ITEMS"),
		    								tbar: [
		    									{
		    										text: IRm$/*resources*/.r1("L_ADD_NEW"),
		    										hidden: true,
		    										handler: function() {
		    											this._l7/*toolbar_content*/(0);
		    										},
		    										scope: this
		    									},
		    									{
		    										text: IRm$/*resources*/.r1("L_REMOVE_SELECTED"),
		    										handler: function() {
		    											this._l7/*toolbar_content*/(1);
		    										},
		    										scope: this
		    									},
		    									{
		    										text: IRm$/*resources*/.r1("B_MOVE_UP"),
		    										handler: function() {
		    											this._l7/*toolbar_content*/(2);
		    										},
		    										scope: this
		    									},
		    									{
		    										text: IRm$/*resources*/.r1("B_MOVE_DOWN"),
		    										handler: function() {
		    											this._l7/*toolbar_content*/(3);
		    										},
		    										scope: this
		    									}
		    								],
		    								store: {
		    									xtype: "store",
		    									fields: [
		    										"uid", "name", "nodepath", "type", "sid"
		    									]
		    								},
		    								columns: [
		    									{
		    										text: IRm$/*resources*/.r1("B_NAME"),
		    										dataIndex: "name"
		    									},
		    									{
		    										text: IRm$/*resources*/.r1("B_TYPE"),
		    										dataIndex: "type"
		    									},
		    									{
		    										text: IRm$/*resources*/.r1("B_DESC"),
		    										dataIndex: "description"
		    									},
		    									{
		    										text: IRm$/*resources*/.r1("B_LOC"),
		    										dataIndex: "nodepath",
		    										flex: 1
		    									}
		    								]
		    							}
		    						]
		    					},
    							{
    								xtype: "panel",
    								region: "east",
    								split: true,
    								collapsible: true,
    								collapsed: false, // true,
    								flex: 1,
    								title: IRm$/*resources*/.r1("L_NAVIGATOR"),
    								layout: {
    									type: "vbox",
    									align: "stretch"
    								},
    								items: [
    									new IG$/*mainapp*/._Idd/*explorerTree*/({
    										name: "mtree",
    										flex: 1,
											gridupdate: {
												handler: me._IQ9/*updateGridContent*/,
												scope: me
											}
										}),
										{
											xtype: "gridpanel",
											name: "mg",
											viewConfig: {
												plugins: [
													{
														ptype: "gridviewdragdrop",
														ddGroup: "_I$RD_G_",
														enableDrop: false,
														enableDrag: true
													}
												]
											},
											flex: 1,
											store: {
												xtype: "store",
												fields: [
													"uid", "name", "type", "nodepath"
												]
											},
											columns: [
												{
													text: IRm$/*resources*/.r1("B_NAME"),
													dataIndex: "name"
												},
												{
													text: IRm$/*resources*/.r1("B_TYPE"),
													dataIndex: "type"
												},
												{
													text: IRm$/*resources*/.r1("B_LOC"),
													dataIndex: "nodepath"
												}
											]
										}
    								]
    							}
    						]
    					}
    				]
    			}
    		]
    	});
    	
    	IG$/*mainapp*/._I7_/*dashboardmenu*/.superclass.initComponent.call(this);
    },
    listeners: {
    	afterrender: function(tobj) {
    		this.l1/*loadContent*/();
    	}
    }
});

IG$/*mainapp*/._I7e/*changeApp*/ = function() {
}

IG$/*mainapp*/._N12/*MainPanel*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	layout: "card",
	
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
    		tab = this.getComponent(itemtype + "_" + uid),
    		pitem,
    		breadcrumbs = IG$/*mainapp*/.breadcrumbs,
			breadcrumb = $(".breadcrumb", breadcrumbs.body.dom);
    		
    	if (tab)
    	{
    		IG$/*mainapp*/._I7e/*changeApp*/(2);
    		
    		this.setActiveTab(tab);
    		
    		breadcrumb.empty();
			$("<li><span class='link'>" + (tab.title || itemname) + "</span></li>").appendTo(breadcrumb);
    		
    		if (toption && tab.applyOption)
    		{
    			tab.applyOption.call(tab, toption);
    		}
    		
    		if (itemtype == "dashboard")
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
    		toption = toption || {};
    		toption.header = false;
    		toption._iv/*igcviewmode*/ = "dashboard";
    		
    		pitem = IG$/*mainapp*/._I61/*createAppPanel*/(uid, itemtype, itemname, itemaddr, writable, toption);
    		
    		if (pitem)
    		{
    			pitem.address = itemaddr;
    			pitem.title = itemname; // IG$/*mainapp*/._I28/*getTabTitle*/(itemname);
    			
    			breadcrumb.empty();
    			$("<li><span class='link'>" + itemname + "</span></li>").appendTo(breadcrumb);
    			
    			if (option)
    			{
    				for (key in option)
    				{
    					pitem[key] = option[key];
    				}
    			}
    			
    			if (pitem.isWindow == true)
    			{
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
    	
    	if (baddhistory == true)
    	{
    		lastHist = 'lang=' + useLocale + '&p1=' + itemtype + '&p2=' + uid;
    		hist.addHistory(lastHist);
    	}
    },
	
	i1/*initRecentVisit*/ : function(){
		// when login user changed
	},
	
	iLL/*updateLoginInfo*/: function() {
		// when get userdetail finished
		var viewport = IG$/*mainapp*/.__1/*viewport*/,
			llogin = $("#igc_login_user"),
			ltime,
			lmsg,
			logininfo;
		
		if (IG$/*mainapp*/._I83/*dlgLogin*/ && IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/)
		{
			logininfo = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/;
			lmsg = logininfo.username;
			llogin.html(lmsg);
			
			if (!viewport._1/*loadInit*/)
			{
				viewport._1/*loadInit*/ = true;
				this.L1/*loadInit*/(viewport);
			}
			
			IG$/*mainapp*/.$1/*loadApp*/(logininfo.tmpl);
			
			if (!IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.__bdmenu)
			{
				IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.__bdmenu = 1;
				llogin.bind("click", function() {
					
				});
			}
		}
	},
	
	L1/*loadInit*/: function(viewport) {
		var me = this,
			navbar = viewport.down("[name=navbar]"),
			sidebar_sc = viewport.down("[name=sidebar_sc]"),
			sidebar = viewport.down("[name=sidebar]"),
			dnavbar = $(navbar.body.dom),
			
			isadmin = IG$/*mainapp*/._I83/*dlgLogin*/.jS2/*isAdmin*/,
			btn;
		
		btn = $("#nav_mgrmenu", dnavbar)[isadmin ? "show" : "hide"]();
		btn.bind("click", function() {
			IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_D_MENU");
		});
		
		btn = $(".sidebar-btn-d-menu", sidebar_sc.body.dom);
		btn.bind("click", function() {
			sidebar.getLayout().setActiveItem(0);
		});
		
		btn = $(".sidebar-btn-n-menu", sidebar_sc.body.dom);
		btn.bind("click", function() {
			if (!me.floaded)
			{
				me._1/*loadFavorites*/.call(me);
			}
			sidebar.getLayout().setActiveItem(1);
		});
		
		me.L2/*loadMenu*/(viewport, dnavbar);
	},
	
	L2/*loadMenu*/: function(viewport, dnavbar) {
		var me = this,
			sidebar_m0 = viewport.down("[name=sidebar_m0]"),
			sarea = $("#sidebar", sidebar_m0.body.dom),
			darea = $(".navbar-top-menu", dnavbar),
			nbase = $(".navbar-brand", dnavbar),
			req, snav;
		
		darea.empty();
		
		snav = $("<ul class='igc-smenu-main'></ul>").appendTo(sarea);
		
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.showerror = false;
		req.init(me, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: "/SYS_Config/dashboardmenu"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: ''})
	        }, me, function(xdoc) {
	        	var appinfo = new IG$/*mainapp*/.CI7_/*dashboardmenustructure*/(xdoc),
	        		root = appinfo._a/*menustructure*/.root,
	        		unav = $("<ul class='igc-tmenu-main'></ul>").appendTo(darea),
	        		vmenus;
	        		
	        	root.option && me._2/*loadPage*/.call(me, root);
	        	
	        	nbase.bind("click", function() {
	        		root.option && me._2/*loadPage*/.call(me, root);
	        	});
	        	
	        	$.each(root.children, function(n, item) {
	        		var li = $("<li><span class='igc-tnav-item'>" + item.name + "</span></li>").appendTo(unav);
	        		li.bind("click", function() {
	        			snav.empty();
	        			me.L3/*makeMenu*/(snav, item, 0);
	        		});
	        	});
	        	
	        	if (ig$/*appoption*/.dashboard_custom && ig$/*appoption*/.dashboard_custom.menu_loaded)
	        	{
	        		ig$/*appoption*/.dashboard_custom.menu_loaded.call(me, root, me, snav);
	        	}
	        	
	        	vmenus = ig$/*appoption*/.c_menus;
	        	
	        	if (vmenus && vmenus.menus)
	        	{
	        		$.each(vmenus.menus, function(n, item) {
	        			var li = $("<li><span class='igc-tnav-item igc-tnav-citem " + (item.css || "") + "'>" + item.name + "</span></li>").appendTo(unav);
		        		li.bind("click", function() {
		        			snav.empty();
		        			me.L3/*makeMenu*/(snav, item, 0, 1);
		        		});
	        		});
	        	}
	        	//this.L3/*makeMenu*/(unav, root, 0);
	        });
		req._l/*request*/();
	},
	
	L3/*makeMenu*/: function(darea, tnode, level, c_item) {
		var me = this;
		
		$.each([tnode.children, tnode.items], function(n, arr) {
			arr && $.each(arr, function(t, node) {
				var li = $("<li><div class='indicator'></div></li>").appendTo(darea),
					btn = $("<div class='igc-nav-item'>" + node.name + "</div>").appendTo(li),
					smenu, i,
					sexp,
					hassub = false;
					
				btn.hover(function() {
						$(".indicator", li).addClass("igc-hover");
					},
					function() {
						$(".indicator", li).removeClass("igc-hover");
					}
				);
				
				hassub = (!c_item && node.children && node.children.length > 0) || node.type == "Folder" || (node.items && node.items.length > 0) ? true : false;
				
				if (hassub)
				{
					sexp = $("<div class='igc-submenu-expand'>&gt;</div>").appendTo(li);
					smenu = $("<ul class='submenu'></ul>").appendTo(li);
					smenu.hide();
					
					var mfunc = function(e) {
						e.stopPropagation();
						if (!node.loaded && node.type == "Folder")
						{
							var req = new IG$/*mainapp*/._I3e/*requestServer*/();
							req.showerror = false;
							req.init(me, 
								{
						            ack: "5",
						            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: node.uid}),
						            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: ''})
						        }, me, function(xdoc) {
						        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
						        		tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
						        		i,
						        		p;
						        	
						        	node.items = [];
						        	node.loaded = true;
						        		
						        	if (tnodes)
						        	{
						        		for (i=0; i < tnodes.length; i++)
						        		{
						        			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						        			if ((/Report|Folder|Dashboard/).test(p.type))
						        			{
						        				node.items.push(p);
						        			}
						        		}
						        		IG$/*mainapp*/._I10/*sortMeta*/(node.items);
						        		me.L3/*makeMenu*/.call(me, smenu, node, level+1);
						        		smenu.show();
						        	}
						        });
							req._l/*request*/();
						}
						else
						{
							smenu.toggle();
						}
					};
					
					sexp.bind("click", mfunc);
					btn.bind("click", mfunc);
					me.L3/*makeMenu*/.call(me, smenu, node, level+1);
				}
				else
				{
					if (c_item)
					{
						btn.bind("click", function(e) {
							if (node.handler)
							{
								node.handler.call(this, node);
							}
						});
					}
					else if (node.uid)
					{
						btn.bind("click", function(e) {
							me.m1$7/*navigateApp*/.call(me, node.uid, node.type.toLowerCase(), node.name, node.nodepath, false, false);
						});
					}
				}
			});
		});
	},
	
	setActiveTab: function(tb) {
		this.setActiveItem(tb);
	},
	
	_1/*loadFavorites*/: function() {
		var panel=this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(panel, 
			{
	            ack: "11",
	        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'favorites'})
	        }, panel, panel.rs__1/*loadFavorites*/, null, null);
		req._l/*request*/();
	},
	
	rs__1/*loadFavorites*/: function(xdoc) {
		var me = this,
			i,
			viewport = IG$/*mainapp*/.__1/*viewport*/,
			sidebar_m1 = viewport.down("[name=sidebar_m1]"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = (tnode) ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			d = [],
			el;
			
		me.floaded = true;
		
		if (tnodes)
		{
			el = $("#sidebar_fav", sidebar_m1.el.dom);
			el = $(".navbar-top-menu", el),
			el.empty();
			
			for (i=0; i < tnodes.length; i++)
			{
				d.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]));
			}
			
			me.L3/*makeMenu*/(el, {
					children: null,
					items: d
				}, 0);
		}
	},
	
	_2/*loadPage*/: function(item) {
		var me = this,
			opt = item.option,
			ltype = opt.ltype,
			url,
			req, citem;
			
		switch (ltype)
		{
		case "html":
			url = opt.html;
			url && me._3/*loadHTML*/(item, opt, url);
			break;
		case "report":
			if (opt.rptl_uid)
			{
				if (opt.rptl_item)
				{
					citem = opt.rptl_item;
					me.m1$7/*navigateApp*/.call(me, citem.uid, citem.type.toLowerCase(), citem.name, citem.nodepath, false, false);
				}
				else
				{
					req = new IG$/*mainapp*/._I3e/*requestServer*/();
					req.init(me,
						{
				            ack: "11",
				            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: opt.rptl_uid}),
				            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'translate'})
				        }, me, function(xdoc) {
				        	var me = this,
								tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
								citem;
		
							if (tnode)
							{
								citem = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
								opt.rptl_item = citem;
								me.m1$7/*navigateApp*/.call(me, citem.uid, citem.type.toLowerCase(), citem.name, citem.nodepath, false, false);
							}
				        }, false);
					req._l/*request*/();
				}
			}
			break;
		}
	},
	
	_3/*loadHTML*/: function(item, opt, url) {
		var me = this,
			tid = "tpage_" + item.sid,
			p = this.getComponent(tid);
		
		IG$/*mainapp*/._I7e/*changeApp*/(2);
		
		if (p)
		{
			this.setActiveTab(p);
		}
		else
		{
			p = Ext.create(Ext.panel.Panel, {
				layout: "fit",
				name: tid,
				id: tid,
				autoScroll: true,
				autoLoad: {
	            	url: url, 
	            	callback: function() {
	            		if (opt.scrp && window[opt.scrp])
	            		{
	            			var m = this.down("[name=" + tid + "]");
	            			window[opt.scrp].call(me, item, m);
	            		}
	            	}, 
	            	scope: this
	            }
			});
			
			this.add(p);
			this.setActiveTab(p);
		}
	},
	
	//inherit docs
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    },
    listeners: {
    	beforeadd: function(tobj, component, index, eOpts) {
    		component.closable = false;
    		component.setTitle(null);
    	}
    }
});

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
			
			IG$/*mainapp*/._I7d/*mainPanel*/.m1$7/*navigateApp*/.call(IG$/*mainapp*/._I7d/*mainPanel*/, itemuid, typename, itemname, itemaddr, (typeof(bhist) == "undefined" ? true : bhist), writable, null, param);
        }, null);
	req._l/*request*/();
};
IG$/*mainapp*/._I8b/*showLoginProc*/ = function() {
	var lform = $('#loginWindow'),
		uid = $("#userid");
	lform.hide();
}

IG$/*mainapp*/.$1/*loadApp*/ = function(tmpl) {
	
};

IG$/*mainapp*/._$$1/*changePassword*/ = function(u1, u2, u3, callback) {
	var panel = null;
		
	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
	req.init(panel, 
		{
            ack: "23",
            payload: '<smsg></smsg>',
            mbody: '<smsg></smsg>'
        }, panel, function(xdoc) {
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
					var panel = this,
						opasswd = u1.val(),
						npass1 = u2.val(),
						npass2 = u3.val(),
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
			            }, panel, function(xdoc) {
			            	callback && callback.execute();
			            }, null);
				    req._l/*request*/();
				}
			}
        }, null);
    req._l/*request*/();
};

$(document).ready(function() {
    $("#lpt", "#loading").css("width", "80%");
    
	IRm$/*resources*/.r2/*loadResources*/({
		func: function() {
			$("#lpt", "#loading").css("width", "100%");
			
			setTimeout(function() {
				var i,
					copt;
					
	    		IG$/*mainapp*/.lE/*loadExtend*/.rcsloaded = true;
	    		
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
	    		
	    		IG$/*mainapp*/._I7d/*mainPanel*/ = new IG$/*mainapp*/._N12/*MainPanel*/({
	    		});
	    		
			    var doc = $(document),
			    	bd = $("body"),
			    	viewport = new IG$/*mainapp*/.pb({
				        "layout": {
				        	type: "vbox",
				        	align: "stretch"
				        },
				        renderTo: $("body"),
				        items:[ 
				        	{
				        		xtype: "container",
				        		region: "north",
				        		name: "navbar",
				        		contentEl: "#navbar",
				        		height: 45
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
						        		region: "west",
						        		name: "sidebarpanel",
						        		media: {
						        			minWidth: 768
						        		},
						        		width: 190,
						        		layout: {
						        			type: "vbox",
						        			align: "stretch"
						        		},
						        		items: [
						        			{
								        		xtype: "container",
								        		height: 40,
								        		name: "sidebar_sc",
								        		contentEl: "#sidebar-shortcuts",
								        		hidden: true
								        	},
								        	{
								        		xtype: "container",
								        		flex: 1,
								        		name: "sidebar",
								        		layout: "card",
								        		items: [
								        			{
								        				xtype: "container",
								        				name: "sidebar_m0",
								        				contentEl: "#sidebar"
								        			},
								        			{
								        				xtype: "container",
								        				name: "sidebar_m1",
								        				contentEl: "#sidebar_fav"
								        			},
								        			{
								        				xtype: "container",
								        				name: "sidebar_m2"
								        			}
								        		]
								        	}
								        ]
								    },
						        	{
						        		xtype: "container",
						        		flex: 1,
						        		layout: {
						        			type: "vbox",
						        			align: "stretch"
						        		},
						        		items: [
						        			{
						        				xtype: "container",
						        				name: "breadcrumbs",
						        				contentEl: "#breadcrumbs",
						        				height: 30
						        			},
						        			{
						        				xtype: "container",
						        				name: "maintab",
						        				border: 1,
						        				flex: 1,
						        				layout: "fit",
						        				items: [
						        					IG$/*mainapp*/._I7d/*mainPanel*/
						        				]
						        			}
						        		]
						        	}
						        ]
						    }
						],
						listeners: {
							afterrender: function(tobj) {
								var navbar_dmenu = $("#navbar_dmenu", tobj.body.dom),
									sidebarpanel = tobj.down("[name=sidebarpanel]");
								
								if (navbar_dmenu)
								{
									navbar_dmenu.bind("click", function() {
										var eldom = $(sidebarpanel._el.dom);
										eldom.toggle();
										
										eldom.css({zIndex: 2000});
									});
								}
							}
						}
				    });
			    
			    viewport.setSize(bd.width(), bd.height());
			    
			    var w_timer = -1;
			    
			    $(window).resize(function() {
			    	if (w_timer)
			    	{
			    		clearTimeout(w_timer);
			    	}
			    	w_timer = setTimeout(function() {
			    		viewport.setSize(bd.width(), bd.height());
			    	}, 10);
			    });
			    
			    IG$/*mainapp*/.__1/*viewport*/ = viewport;
			    IG$/*mainapp*/.breadcrumbs = viewport.down("[name=breadcrumbs]");
			    			    
				setTimeout(function(){
			        $('#loading').fadeOut({remove:true});
			        $('#loading-mask').fadeOut({remove:true});
			    }, 150);
	    		
	    		var uid = $.cookie("lui") || "";
				var upd = "";
					
				IG$/*mainapp*/._I88/*createLoginPanel*/(uid, upd, true);
				IG$/*mainapp*/._I14/*loadMapData*/();
				
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
				    		}
				    	}
				    	
				    	if (islogin == false)
				    	{
				    		IG$/*mainapp*/._I89/*showLogin*/(new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/), 0);
				    	}
				    },
				    function(){
				    	IG$/*mainapp*/._I89/*showLogin*/(new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/), 0);
				    	return true;
				    });
				
				req._l/*request*/();
				
				
			}, 300);
		}
	});
});

