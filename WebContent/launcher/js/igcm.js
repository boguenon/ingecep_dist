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
IG$/*mainapp*/.__C/*classmodule*/ = $s.extend($s.panel, {
	closable: true,
	
	layout: "border",
	bodyPadding: 0,
	
	_IFd/*init_f*/: function() {
		var me = this;
		
		me.L1/*loadDataSource*/();
	},
	
	L1/*loadDataSource*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		// me.setLoading(true);
		
		req.init(me, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'standard'})
	        }, me, function(xdoc) {
	        	var me = this,
					dp = [],
					i, cnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"), 
					snodes, p,
					isadmin,
					t_ds = me.down("[name=t_ds]");				
				
				dp.push({name:"Select Database Instance", poolname:""}); 
				
				if (cnode)
				{
					snodes = IG$/*mainapp*/._I26/*getChildNodes*/(cnode);
					isadmin = IG$/*mainapp*/._I83/*dlgLogin*/.jS2/*isAdmin*/;
					
					for (i=0; i < snodes.length; i++)
					{
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
						if (isadmin == true || (isadmin == false && p.name.toUpperCase() != "IGCBASE"))
						{
							dp.push({
								name:p.disp, 
								poolname: p.name,
								uid: p.uid || "",
								isuserdb: (p.isuserdb == "T" ? true : false),
								savepwd: (p.isuserdb == "T" && p.savepwd == "F" ? false : true)
							});
						}
					}
				}
				
				t_ds.store.loadData(dp);
				t_ds.setValue("");
				
				me.a2/*loadItemContent*/();
	        }, function() {
	        	me.a2/*loadItemContent*/();
	        });
		req._l/*request*/();
	},
	
	a2/*loadItemContent*/: function() {
		var panel = this,
			req;
			
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'standard'})
	        }, panel, panel.rs_a2/*loadItemContent*/, false);
		req._l/*request*/();
	},
	
	rs_a2/*loadItemContent*/: function(xdoc) {
		var me = this,
			item = new IG$/*mainapp*/.ifg/*classmodule*/(xdoc),
			jdom,
			jdomeditor,
			jview,
			w, h, i,
			dp = [],
			editor,
			t_ds = me.down("[name=t_ds]");
			
		me.item = item;
		t_ds.setValue(item.objinfo.ds || "");
		
		if (!window.ace)
		{
			IG$/*mainapp*/.x03/*getScriptCache*/(ig$/*appoption*/.scmap.igcg, new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
				this.rs_a2/*loadItemContent*/(xdoc);
			}));
			
			return;
		}

		jdom = $(me.down("[name=javasrc]").el.dom);
		jdomeditor = $(".idv-jcl-edtr", jdom);
		jdomeditor.empty();
		
		w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom);
		h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom);
		
		jview = $("<div class='idv-jcl-view'></div>").appendTo(jdomeditor);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jview, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jview, h);
		
		editor = ace.edit(jview[0]);
	    editor.getSession().setMode("ace/mode/java");
	    
	    me.scripteditor = editor;
	    me.scriptview = jview;
		
		me.scriptview = jview;
		me.scripteditor = editor;
		
		jdom = $(me.down("[name=javasrc_all]").el.dom);
		jdomeditor = $(".idv-jcl-edtr", jdom);
		jdomeditor.empty();
		
		w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom);
		h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom);
		
		jview = $("<div class='idv-jcl-view'></div>").appendTo(jdomeditor);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jview, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jview, h);
		
		editor = ace.edit(jview[0]);
		editor.getSession().setMode("ace/mode/java");
		
		me.scriptview_all = jview;
		me.scripteditor_all = editor;
		
		for (i=0; i < item.modules.length; i++)
		{
			dp.push({
				name: item.modules[i].name,
				description: item.modules[i].description
			});
		}
		
		me.down("[name=g_m]").store.loadData(dp);
	},
	
	a3/*saveMetaContent*/: function(smode) {
		var me = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		cnt,
			ack = "31",
			t_ds = me.down("[name=t_ds]");
			
		me._c1/*commitModule*/();
    	
    	me.item.objinfo.ds = t_ds.getValue();
    	cnt = me.item.p2/*getXML*/();
		
		if (smode == "source")
		{
			ack = "73";
		}
    	
    	req.init(me, 
			{
	            ack: ack,
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, option: (smode == "source" ? smode : null)}, "uid;option"),
	            mbody: cnt
	        }, me, me.rs_a3/*saveMetaContent*/, null, smode);
		req._l/*request*/();
	},
	
	rs_a3/*saveMetaContent*/: function(xdoc, smode) {
		var me = this,
			tnode,
			scode;
		
		if (smode == "source")
		{
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/source");
			scode = (tnode ? IG$/*mainapp*/._I24/*getTextContent*/(tnode) : "");
			me.scripteditor_all.setValue(scode);
		}
		else if (smode == "compile")
		{
			me.a4/*doCompile*/();
		}
		else
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
		}
	},
	
	a4/*doCompile*/: function() {
		var panel = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		cnt;
    	
    	cnt = panel.item.p2/*getXML*/();
    	
    	req.init(panel, 
			{
	            ack: "73",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid, option: "compile"}, "uid;option"),
	            mbody: cnt
	        }, panel, panel.rs_a4/*doCompile*/, null);
		req._l/*request*/();
	},
	
	rs_a4/*doCompile*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/errormessage"),
			errmsg;
			
		if (tnode)
		{
			errmsg = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
			errmsg = Base64.decode(errmsg);
			me.down("[name=compileres]").setValue(errmsg);
			
			me._m1/*setViewMode*/(1);
		}
		else
		{
			me.down("[name=compileres]").setValue("");
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Compiled Successfully", null, null, 0, "success");
		}
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this,
			g_m = me.down("[name=g_m]"),
			sel, rec, module,
			i;
		
		switch (cmd)
		{
		case "cmd_save":
			me.a3/*saveMetaContent*/();
			break;
		case "cmd_compile":
			me.a3/*saveMetaContent*/("compile");
			break;
		case "cmd_source":
			me.a3/*saveMetaContent*/("source");
			break;
		case "cmd_rename":
		case "cmd_delete":
			sel = g_m.getSelectionModel().selected;
			if (sel && sel.length > 0)
			{
				rec = sel.items[0];
			}
			
			if (rec && rec.get("name"))
			{
				for (i=0; i < me.item.modules.length; i++)
				{
					if (me.item.modules[i].name == rec.get("name"))
					{
						if (cmd == "cmd_delete")
						{
							me.item.modules.splice(i, 1);
						}
						else
						{
							module = me.item.modules[i];
						}
						break;
					}
				}
				
				if (cmd == "cmd_delete")
				{
					g_m.store.remove(rec);
					me._module = null;
					me.scripteditor.setValue("");
				}
				else
				{
					var dlg = new IG$/*mainapp*/._Icd/*makeItemEditor*/({
						itemtype: "Module",
						itemname: module.name,
						description: module.description,
						$f3/*processMakeMetaItem*/: function() {
							var _m = this,
								citemname = _m.down("[name=fitemname]"),
								itemname = _m.down("[name=fitemname]").getValue(),
								desc = _m.down("[name=fdesc]").getValue(),
								fhelpuid = _m.down("[name=fhelpuid]").getValue() || null,
								selitemtype = _m.down("[name=selitemtype]"),
								r;
								
							citemname.clearInvalid();
							
							if (!itemname)
							{
								citemname.markInvalid([citemname.blankText]);
								return;
							}
							
							if (itemname.indexOf(" ") > -1)
							{
								citemname.markInvalid(["Space not allowed"]);
								return;
							}
							
							rec.set("name", itemname);
							rec.set("description", desc);
							module.name = itemname;
							module.description = desc;
							
							_m.close();
						}
					});
					IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
				}
			}
			break;
		}
	},
	
	_c1/*commitModule*/: function() {
		var me = this;
		
		if (me._module)
		{
			me._module.script = me.scripteditor.getValue();
			me._module.iparams = [];
			me._module.oparams = [];
			
			$.each(["iparams", "oparams"], function(i, k) {
				var g = me.down("[name=g_" + k + "]"),
					i,
					rec,
					p = me._module[k];
					
				for (i=0; i < g.store.data.items.length; i++)
				{
					rec = g.store.data.items[i];
					if (rec.get("name"))
					{
						p.push({
							name: rec.get("name")
						});
					}
				}
			});
		}
	},
	
	_e1/*editModule*/: function(rec) {
		var me = this,
			ename = rec.get("name"),
			i, item = me.item,
			module;
			
		if (me._module)
		{
			me._c1/*commitModule*/();
		}
			
		for (i=0; i < item.modules.length; i++)
		{
			if (item.modules[i].name == ename)
			{
				module = item.modules[i];
				break;
			}
		}
		
		if (module)
		{
			me.down("[name=m_s]").show();
			me.scripteditor.setValue(module.script || "");
			me._module = module;
			
			$.each(["iparams", "oparams"], function(i, k) {
				var g = me.down("[name=g_" + k + "]"),
					i,
					dp = [],
					p = me._module[k];
					
				if (p)
				{
					for (i=0; i < p.length; i++)
					{
						dp.push({
							name: p[i].name
						});
					}
				}
				
				g.store.loadData(dp);
			});
		}
	},
	
	_a1/*addModule*/: function(itemname, desc) {
		var me = this,
			g_m = me.down("[name=g_m]"),
			r = true,
			i;
		
		if (me._module)
		{
			me._c1/*commitModule*/();
		}
		
		for (i=0; i < me.item.modules.length; i++)
		{
			if (me.item.modules[i].name == itemname)
			{
				r = false;
				break;
			}
		}
		
		if (r == true)
		{
			g_m.store.add({
				name: itemname,
				description: desc
			});
			
			me.item.modules.push({
				name: itemname,
				description: desc,
				script: null,
				iparams: [],
				oparams: []
			});
		}
		
		return r;
	},
	
	_m1/*setViewMode*/: function(mode) {
		var me = this,
			mcard = me.down("[name=mcard]"),
			t_source = me.down("[name=t_source]");
		
		if (mode > -1)
		{
			me.vcard = mode;
		}
		else
		{
			me.vcard = (me.vcard == 0) ? 1 : 0;
		}
		
		if (me.vcard == 0)
		{
			mcard.getLayout().setActiveItem(0);
			t_source.setText("View Source");
		}
		else
		{
			mcard.getLayout().setActiveItem(1);
			t_source.setText("Edit Code");
			me._t$/*toolbarHandler*/('cmd_source'); 
		}
	},

	initComponent: function() {
		var me = this;
		
		me.vcard = 0;
		
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					layout: "card",
					region: "center",
					flex: 1,
					name: "mcard",
					items: [
						{
							xtype: "panel",
							layout: "border",
							items: [
								{
									xtype: "panel",
									title: "Module Functions",
									region: "west",
									layout: "fit",
									split: true,
									collapsible: true,
									collapseMode: "mini",
									width: 300,
									tbar: [
										{
											text: "New",
											handler: function() {
												var dlg = new IG$/*mainapp*/._I6e/*makeItem*/({
													itemtype: "Module",
													$f3/*processMakeMetaItem*/: function() {
														var _m = this,
															citemname = _m.down("[name=fitemname]"),
															itemname = _m.down("[name=fitemname]").getValue(),
															desc = _m.down("[name=fdesc]").getValue(),
															fhelpuid = _m.down("[name=fhelpuid]").getValue() || null,
															selitemtype = _m.down("[name=selitemtype]"),
															r;
															
														citemname.clearInvalid();
														
														if (!itemname)
														{
															citemname.markInvalid([citemname.blankText]);
															return;
														}
														
														if (itemname.indexOf(" ") > -1)
														{
															citemname.markInvalid(["Space not allowed"]);
															return;
														}
														
														r = me._a1/*addModule*/.call(me, itemname, desc);
														
														if (r == true)
														{
															_m.close();
														}
													}
												});
												IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
											},
											scope: this
										},
										{
											text: "Rename",
											handler: function() {
												this._t$/*toolbarHandler*/("cmd_rename");
											},
											scope: this
										},
										{
											text: "Delete",
											handler: function() {
												this._t$/*toolbarHandler*/("cmd_delete");
											},
											scope: this
										}
									],
									items: [
										{
											xtype: "gridpanel",
											name: "g_m",
											store: {
												xtype: "store",
												fields: [
													"name", "description"
												]
											},
											columns: [
												{
													text: IRm$/*resources*/.r1("B_NAME"),
													flex: 1,
													dataIndex: "name"
												},
												{
													text: IRm$/*resources*/.r1("B_DESC"),
													flex: 1,
													dataIndex: "description"
												},
												{
													xtype: "actioncolumn",
													width: 30,
													menuDisabled: true,
													items: [
														{
															iconCls: "icon-grid-config",
															tooltip: IRm$/*resources*/.r1('L_EDIT'),
															handler: function (grid, rowIndex, colIndex) {
																var grd = grid,
																	store = grd.store,
																	rec = store.getAt(rowIndex);
																	
																this._e1/*editModule*/(rec);
															},
															scope: this
														}
													]
												}
											],
											listeners: {
												cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eopts) {
													if (cellIndex != 2)
													{
														this._e1/*editModule*/(record);
													}
												},
												scope: this
											}
										}
									]
								},
								{
									region: "center",
									xtype: "panel",
									flex: 1,
									title: "Module Sources",
									layout: "fit",
									items: [
										{
											xtype: "panel",
											border: 0,
											layout: "border",
											name: "m_s",
											hidden: true,
											items: [
												{
													name: "javasrc",
													region: "center",
													flex: 1,
													html: "<div class='idv-jcl-edtr'></div>",
													split: true,
													listeners: {
														resize: function(tobj, w, h, ow, oh, opts) {
															if (me.scriptview && me.scripteditor)
															{
																IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.scriptview, w);
																IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.scriptview, h);
																me.scripteditor.resize(true);
															}
														}
													}
												},
												{
													xtype: "panel",
													region: "east",
													width: 200,
													layout: {
														type: "vbox",
														align: "stretch"
													},
													items: [
														{
															xtype: "gridpanel",
															name: "g_iparams",
															title: "Input Parameters",
															flex: 1,
															store: {
																xtype: "store",
																fields: [
																	"name"
																]
															},
															selType: "checkboxmodel",
															selModel: {
																checkSelector: ".x-grid-cell",
																mode: "MULTI"
															},
															plugins: [
																{
																	ptype: "cellediting",
																	clicksToEdit: 1
																}
															],
															columns: [
																{
																	text: IRm$/*resources*/.r1("B_NAME"),
																	flex: 1,
																	dataIndex: "name",
																	editor: {
																		xtype: "textfield",
																		allowBlank: false
																	}
																}
															],
															tbar: [
																{
																	xtype: "button",
																	text: IRm$/*resources*/.r1("B_ADD"),
																	handler: function() {
																		var me = this,
																			g_iparams;
																		
																		g_iparams = me.down("[name=g_iparams]");
																		g_iparams.store.add({
																			name: "",
																			value: ""
																		});
																	},
																	scope: this
																},
																{
																	xtype: "button",
																	text: IRm$/*resources*/.r1("B_REMOVE"),
																	handler: function() {
																		var me = this,
																			g_iparams = me.down("[name=g_iparams]"),
																			g_iparams_st = g_iparams.store,
																			sel = g_iparams.getSelectionModel().selected,
																			i;
																		
																		for (i=sel.length-1; i >= 0; i--)
																		{
																			g_iparams_st.remove(sel.items[i]);
																		}
																	},
																	scope: this
																}
															]
														},
														{
															xtype: "gridpanel",
															title: "Output Parameters",
															name: "g_oparams",
															flex: 1,
															store: {
																xtype: "store",
																fields: [
																	"name"
																]
															},
															selType: "checkboxmodel",
															selModel: {
																checkSelector: ".x-grid-cell",
																mode: "MULTI"
															},
															plugins: [
																{
																	ptype: "cellediting",
																	clicksToEdit: 1
																}
															],
															columns: [
																{
																	text: IRm$/*resources*/.r1("B_NAME"),
																	flex: 1,
																	dataIndex: "name",
																	editor: {
																		xtype: "textfield",
																		allowBlank: false
																	}
																}
															],
															tbar: [
																{
																	xtype: "button",
																	text: IRm$/*resources*/.r1("B_ADD"),
																	handler: function() {
																		var me = this,
																			g_oparams;
																		
																		g_oparams = me.down("[name=g_oparams]");
																		g_oparams.store.add({
																			name: "",
																			value: ""
																		});
																	},
																	scope: this
																},
																{
																	xtype: "button",
																	text: IRm$/*resources*/.r1("B_REMOVE"),
																	handler: function() {
																		var me = this,
																			g_oparams = me.down("[name=g_oparams]"),
																			g_oparams_st = g_oparams.store,
																			sel = g_oparams.getSelectionModel().selected,
																			i;
																		
																		for (i=sel.length-1; i >= 0; i--)
																		{
																			g_oparams_st.remove(sel.items[i]);
																		}
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
							]
						},
						{
							xtype: "panel",
							title: "Source View (ReadOnly)",
							layout: "border",
							items: [
								{
									name: "javasrc_all",
									flex: 1,
									region: "center",
									html: "<div class='idv-jcl-edtr'></div>",
									split: true,
									listeners: {
										resize: function(tobj, w, h, ow, oh, opts) {
											if (me.scriptview_all && me.scripteditor_all)
											{
												IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.scriptview_all, w);
												IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.scriptview_all, h);
												me.scripteditor_all.resize(true);
											}
										}
									}
								},
								{
									xtype: "panel",
									title: "Compile Messages",
									height: 200,
									region: "south",
									layout: "fit",
									items: [
										{
											xtype: "textarea",
											name: "compileres"
										}
									]
								}
							]
						}
					]
				}
			],
			tbar: [
				{
			    	iconCls: 'icon-toolbar-save',
			    	name: "t_save",
	            	tooltip: IRm$/*resources*/.r1('L_SAVE_CONTENT'),
	            	handler: function() {
			    		this._t$/*toolbarHandler*/('cmd_save'); 
			    	},
	            	scope: this
			    },
			    {
		        	iconCls: 'icon-toolbar-saveas',
		        	name: "t_save_as",
		        	tooltip: IRm$/*resources*/.r1('L_SAVE_CONTENT_AS'),
		        	handler: function() {
			    		this._t$/*toolbarHandler*/('cmd_compile'); 
			    	},
		        	scope: this
		        },
		        {
		        	xtype: "combobox",
		        	name: "t_ds",
		        	tooltip: IRm$/*resources*/.r1('L_DATA_SOURCE'),
		        	fieldLabel: IRm$/*resources*/.r1("L_DATA_SOURCE"),
		        	labelPosition: "right",
					queryMode: 'local',
					displayField: 'name',
					valueField: 'poolname',
					editable: false,
					autoSelect: true,
					store: {
						xtype: 'store',
						fields: [
							"name", "uid", "poolname", "isuserdb", "savepwd"
						]
					}
		        },
		        {
		        	text: "Package Lists",
		        	handler: function() {
		        		var me = this,
		        			dlg = new IG$/*mainapp*/.__C_/*classmodule_clsimport*/({
		        				litem: me.item
		        			});
		        		dlg.show();
		        	},
		        	scope: this
		        },
				"->",
				{
					name: "t_source",
					text: "View Source",
					handler: function() {
						this._m1/*setViewMode*/(-1);
					},
					scope: this
				}
			]
	    });
	          
		IG$/*mainapp*/.__C/*classmodule*/.superclass.initComponent.call(this);
	},
	
	listeners: {
		afterrender: function(tobj) {
			var me = this;
			me._IFd/*init_f*/();
		}
	}
});

IG$/*mainapp*/.__C_/*classmodule_clsimport*/ = $s.extend($s.window, {
	width: 300,
	height: 200,
	modal: true,
	"layout": "fit",
	closable: false,
	resizable:false,
	title: "Package Lists",
	
	_i1/*init*/: function() {
		var me = this,
			ltx = me.down("[name=ltx]"),
			litem = me.litem;
		if (litem)
		{
			ltx.setValue(litem.cls || "");
		}
	},
	_IFf/*confirmDialog*/: function() {
		var me = this,
			ltx = me.down("[name=ltx]"),
			litem = me.litem;
			
		if (litem)
		{
			litem.cls = ltx.getValue();
		}
		
		me.close();
	},
	items: [
		{
			xtype: "panel",
			layout: {
				type: "vbox",
				align: "stretch"
			},
			items: [
				{
					xtype: "textarea",
					name: "ltx",
					flex: 1
				},
				{
					xtype: "displayfield",
					value: "* Add class lists with Java : import java.util.*;"
				}
			]
		}
	],
	initComponent: function() {
		$s.apply(this, {
			buttons:[
				'->',
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this._IFf/*confirmDialog*/();
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
		IG$/*mainapp*/.__C_/*classmodule_clsimport*/.superclass.initComponent.call(this);
	},
	
	listeners: {
		afterrender: function(tobj) {
			tobj._i1/*init*/();
		}
	}
});
/**!
 * easyPieChart
 * Lightweight plugin to render simple, animated and retina optimized pie charts
 *
 * @license 
 * @author Robert Fleischmann <rendro87@gmail.com> (http://robert-fleischmann.de)
 * @version 2.1.5
 **/

(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    }
    else if(typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else {
        factory(root.jQuery);
    }
}(this, function($) {

/**
 * Renderer to render the chart on a canvas object
 * @param {DOMElement} el      DOM element to host the canvas (root of the plugin)
 * @param {object}     options options object of the plugin
 */
var CanvasRenderer = function(el, options) {
	var cachedBackground;
	var canvas = document.createElement('canvas');

	el.appendChild(canvas);

	if (typeof(G_vmlCanvasManager) !== 'undefined') {
		G_vmlCanvasManager.initElement(canvas);
	}

	var ctx = canvas.getContext('2d');

	canvas.width = canvas.height = options.size;

	// canvas on retina devices
	var scaleBy = 1;
	if (window.devicePixelRatio > 1) {
		scaleBy = window.devicePixelRatio;
		canvas.style.width = canvas.style.height = [options.size, 'px'].join('');
		canvas.width = canvas.height = options.size * scaleBy;
		ctx.scale(scaleBy, scaleBy);
	}

	// move 0,0 coordinates to the center
	ctx.translate(options.size / 2, options.size / 2);

	// rotate canvas -90deg
	ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI);

	var radius = (options.size - options.lineWidth) / 2;
	if (options.scaleColor && options.scaleLength) {
		radius -= options.scaleLength + 2; // 2 is the distance between scale and bar
	}

	// IE polyfill for Date
	Date.now = Date.now || function() {
		return +(new Date());
	};

	/**
	 * Draw a circle around the center of the canvas
	 * @param {strong} color     Valid CSS color string
	 * @param {number} lineWidth Width of the line in px
	 * @param {number} percent   Percentage to draw (float between -1 and 1)
	 */
	var drawCircle = function(color, lineWidth, percent) {
		percent = Math.min(Math.max(-1, percent || 0), 1);
		var isNegative = percent <= 0 ? true : false;

		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, isNegative);

		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;

		ctx.stroke();
	};

	/**
	 * Draw the scale of the chart
	 */
	var drawScale = function() {
		var offset;
		var length;

		ctx.lineWidth = 1;
		ctx.fillStyle = options.scaleColor;

		ctx.save();
		for (var i = 24; i > 0; --i) {
			if (i % 6 === 0) {
				length = options.scaleLength;
				offset = 0;
			} else {
				length = options.scaleLength * 0.6;
				offset = options.scaleLength - length;
			}
			ctx.fillRect(-options.size/2 + offset, 0, length, 1);
			ctx.rotate(Math.PI / 12);
		}
		ctx.restore();
	};

	/**
	 * Request animation frame wrapper with polyfill
	 * @return {function} Request animation frame method or timeout fallback
	 */
	var reqAnimationFrame = (function() {
		return  window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
	}());

	/**
	 * Draw the background of the plugin including the scale and the track
	 */
	var drawBackground = function() {
		if(options.scaleColor) drawScale();
		if(options.trackColor) drawCircle(options.trackColor, options.lineWidth, 1);
	};

  /**
    * Canvas accessor
   */
  this.getCanvas = function() {
    return canvas;
  };
  
  /**
    * Canvas 2D context 'ctx' accessor
   */
  this.getCtx = function() {
    return ctx;
  };

	/**
	 * Clear the complete canvas
	 */
	this.clear = function() {
		ctx.clearRect(options.size / -2, options.size / -2, options.size, options.size);
	};

	/**
	 * Draw the complete chart
	 * @param {number} percent Percent shown by the chart between -100 and 100
	 */
	this.draw = function(percent) {
		// do we need to render a background
		if (!!options.scaleColor || !!options.trackColor) {
			// getImageData and putImageData are supported
			if (ctx.getImageData && ctx.putImageData) {
				if (!cachedBackground) {
					drawBackground();
					cachedBackground = ctx.getImageData(0, 0, options.size * scaleBy, options.size * scaleBy);
				} else {
					ctx.putImageData(cachedBackground, 0, 0);
				}
			} else {
				this.clear();
				drawBackground();
			}
		} else {
			this.clear();
		}

		ctx.lineCap = options.lineCap;

		// if barcolor is a function execute it and pass the percent as a value
		var color;
		if (typeof(options.barColor) === 'function') {
			color = options.barColor(percent);
		} else {
			color = options.barColor;
		}

		// draw bar
		drawCircle(color, options.lineWidth, percent / 100);
	}.bind(this);

	/**
	 * Animate from some percent to some other percentage
	 * @param {number} from Starting percentage
	 * @param {number} to   Final percentage
	 */
	this.animate = function(from, to) {
		var startTime = Date.now();
		options.onStart(from, to);
		var animation = function() {
			var process = Math.min(Date.now() - startTime, options.animate.duration);
			var currentValue = options.easing(this, process, from, to - from, options.animate.duration);
			this.draw(currentValue);
			options.onStep(from, to, currentValue);
			if (process >= options.animate.duration) {
				options.onStop(from, to);
			} else {
				reqAnimationFrame(animation);
			}
		}.bind(this);

		reqAnimationFrame(animation);
	}.bind(this);
};

var EasyPieChart = function(el, opts) {
	var defaultOptions = {
		barColor: '#ef1e25',
		trackColor: '#f9f9f9',
		scaleColor: '#dfe0e0',
		scaleLength: 5,
		lineCap: 'round',
		lineWidth: 3,
		size: 110,
		rotate: 0,
		animate: {
			duration: 1000,
			enabled: true
		},
		easing: function (x, t, b, c, d) { // more can be found here: http://gsgd.co.uk/sandbox/jquery/easing/
			t = t / (d/2);
			if (t < 1) {
				return c / 2 * t * t + b;
			}
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		onStart: function(from, to) {
			return;
		},
		onStep: function(from, to, currentValue) {
			return;
		},
		onStop: function(from, to) {
			return;
		}
	};

	// detect present renderer
	if (typeof(CanvasRenderer) !== 'undefined') {
		defaultOptions.renderer = CanvasRenderer;
	} else if (typeof(SVGRenderer) !== 'undefined') {
		defaultOptions.renderer = SVGRenderer;
	} else {
		throw new Error('Please load either the SVG- or the CanvasRenderer');
	}

	var options = {};
	var currentValue = 0;

	/**
	 * Initialize the plugin by creating the options object and initialize rendering
	 */
	var init = function() {
		this.el = el;
		this.options = options;

		// merge user options into default options
		for (var i in defaultOptions) {
			if (defaultOptions.hasOwnProperty(i)) {
				options[i] = opts && typeof(opts[i]) !== 'undefined' ? opts[i] : defaultOptions[i];
				if (typeof(options[i]) === 'function') {
					options[i] = options[i].bind(this);
				}
			}
		}

		// check for jQuery easing
		if (typeof(options.easing) === 'string' && typeof(jQuery) !== 'undefined' && jQuery.isFunction(jQuery.easing[options.easing])) {
			options.easing = jQuery.easing[options.easing];
		} else {
			options.easing = defaultOptions.easing;
		}

		// process earlier animate option to avoid bc breaks
		if (typeof(options.animate) === 'number') {
			options.animate = {
				duration: options.animate,
				enabled: true
			};
		}

		if (typeof(options.animate) === 'boolean' && !options.animate) {
			options.animate = {
				duration: 1000,
				enabled: options.animate
			};
		}

		// create renderer
		this.renderer = new options.renderer(el, options);

		// initial draw
		this.renderer.draw(currentValue);

		// initial update
		if (el.dataset && el.dataset.percent) {
			this.update(parseFloat(el.dataset.percent));
		} else if (el.getAttribute && el.getAttribute('data-percent')) {
			this.update(parseFloat(el.getAttribute('data-percent')));
		}
	}.bind(this);

	/**
	 * Update the value of the chart
	 * @param  {number} newValue Number between 0 and 100
	 * @return {object}          Instance of the plugin for method chaining
	 */
	this.update = function(newValue) {
		newValue = parseFloat(newValue);
		if (options.animate.enabled) {
			this.renderer.animate(currentValue, newValue);
		} else {
			this.renderer.draw(newValue);
		}
		currentValue = newValue;
		return this;
	}.bind(this);

	/**
	 * Disable animation
	 * @return {object} Instance of the plugin for method chaining
	 */
	this.disableAnimation = function() {
		options.animate.enabled = false;
		return this;
	};

	/**
	 * Enable animation
	 * @return {object} Instance of the plugin for method chaining
	 */
	this.enableAnimation = function() {
		options.animate.enabled = true;
		return this;
	};

	init();
};

$.fn.easyPieChart = function(options) {
	return this.each(function() {
		var instanceOptions;

		if (!$.data(this, 'easyPieChart')) {
			instanceOptions = $.extend({}, options, $(this).data());
			$.data(this, 'easyPieChart', new EasyPieChart(this, instanceOptions));
		}
	});
};


}));

IG$/*mainapp*/._I72/*relationMgr*/ = $s.extend($s.window, {
	modal: true,
	closable: false,
	resizable:true,
	layout: "fit",
	width: 600,
	autoHeight: true,
	
    "layout": {
		type: 'fit'
	},
	
	bodyPadding: 0,
	
	_1/*loadRelation*/: function(uid, grd) {
		var me = this,
			lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		lreq.init(me, 
			{
	            ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid || me.uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "relations", isdown: (me.isdown ? "T" : "F"), detail: "info"})
			}, me, function(xdoc) {
				var me = this,
					grd_rel = me.down("[name=" + (grd || "grd_rel") + "]"),
					tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
					i, d, dm,
					txtrel = me.down("[name=txtrel]"),
					dp = [];
				
				if (!uid)
				{
					dm = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
					txtrel.setValue("Relations : " + dm.name + "(" + dm.nodepath + ")");
				}
				for (i=0; i < tnodes.length; i++)
				{
					d = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
					d.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(d.type.toLowerCase());
					dp.push(d);
				}
				
				grd_rel.store.loadData(dp);
			}, false);
			
		lreq._l/*request*/();
	},
	
    initComponent: function(){
    	var me = this;
    	
    	$s.apply(this, {
    		title: IRm$/*resources*/.r1("T_Resources"),
			items: [
				{
					xtype: "panel",
					bodyPadding: 10,
					minHeight: 500,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "displayfield",
							name: "txtrel",
							value: "Relations"
						},
						{
							xtype: "gridpanel",
							name: "grd_rel",
							flex: 1,
							store: {
								xtype: "store",
								fields: [
									"name", "nodepath", "uid", "type", "iconcls"
								]
							},
							columns: [
								{
									xtype: "templatecolumn",
									text: IRm$/*resources*/.r1("B_NAME"),
									menuDisabled: true,
									flex: 1,
									minWidth: 160,
									tdCls: "ig-navi-namecol",
									tpl: "<div class='ig-navi-itemicon {iconcls}'></div><span title='{name} ({type})'>{name}</span>"
								},
								{
									text: "Location",
									flex: 1,
									minWidth: 200,
									dataIndex: "nodepath"
								}
							],
							listeners: {
								cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
									var me = this,
										png_rel_sub = me.down("[name=png_rel_sub]"),
										uid = record.get("uid");
									
									if (cellIndex == 0)
									{
										png_rel_sub.show();
										me._1/*loadRelation*/(uid, "grd_rel_sub");
									}
								},
								scope: this
							}
						},
						{
							xtype: "panel",
							name: "png_rel_sub",
							flex: 1,
							hidden: true,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "displayfield",
									value: "Sub relations"
								},
								{
									xtype: "gridpanel",
									flex: 1,
									name: "grd_rel_sub",
									store: {
										xtype: "store",
										fields: [
											"name", "nodepath", "uid", "type", "iconcls"
										]
									},
									columns: [
										{
											xtype: "templatecolumn",
											text: IRm$/*resources*/.r1("B_NAME"),
											menuDisabled: true,
											flex: 1,
											minWidth: 160,
											tdCls: "ig-navi-namecol",
											tpl: "<div class='ig-navi-itemicon {iconcls}'></div><span title='{name} ({type})'>{name}</span>"
										},
										{
											text: "Location",
											flex: 1,
											minWidth: 200,
											dataIndex: "nodepath"
										}
									]
								}
							]
						}
					]
				}
			],
			buttons: [
			    {
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler:function() {
						this.close();
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1("B_CLOSE"),
					handler:function() {
						this.close();
					},
					scope: this
				}
			]
		});
		
        IG$/*mainapp*/._I72/*relationMgr*/.superclass.initComponent.call(this);
    },
    
    listeners: {
    	afterrender: function(tobj) {
    		tobj._1/*loadRelation*/();
    	}
    }
});
IG$/*mainapp*/._I76a/*mgrFeatures*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	scroll: false,
	closable: true,
	"layout": "border",
	
	userinfo: null,
	groupinfo: null,
	
	iconCls: "icon-group",
	
	_1/*loadAuth*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/Auth"}, "address"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'select'})
	        }, panel, panel._r1/*loadAuth*/, false);
		req._l/*request*/();
	},
	
	_r1/*loadAuth*/: function(xdoc) {
		var i,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			cnodes,
			duties = [], 
			duty,
			gridduty = this.down("[name=gridduty]"),
			smodel = gridduty.getSelectionModel(),
			dn;
		
		if (tnode)
		{
			cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < cnodes.length; i++)
			{
				duty = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[i]);
				duty.active = duty.status == "1" ? "Active" : "Disabled";
				switch (duty.dutytype)
				{
				case "A":
					dn = "Default";
					break;
				case "G":
					dn = "Group";
					break;
				case "C":
					dn = "Custom";
					break;
				case "U":
					dn = "User";
					break;
				default:
					dn = duty.dutytype;
					break;
				}
				duty.dutytype_d = dn;
				duties.push(duty);
			}
		}
		
		gridduty.store.loadData(duties);
		
		this._2/*loadFeatures*/();
	},
	
	_2/*loadFeatures*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/Features"}, "address"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'get'})
	        }, panel, panel._r2/*loadFeatures*/, false);
		req._l/*request*/();
	},
	
	_r2/*loadFeatures*/: function(xdoc) {
		var me = this,
			tf = me.down("[name=tf]"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			tval = tnode ? IG$/*mainapp*/._I24/*getTextContent*/(tnode) : null,
			mroot;
			
		if (tval)
		{
			tval = Base64.decode(tval);
			tval = eval("(" + tval + ")");
			
			if (tval.menus)
			{
				mroot = {
					name: "Root",
					children: []
				};
				this._r3/*formatData*/(tval, mroot, "");
				tf.store.setRootNode(mroot);
				tf.store.getRootNode().expand(true);
				
				me._7/*recordmap*/ = [];
				
				me._8/*getRecordMap*/(tf.store.getRootNode());
			}
		}
	},
	
	_r3/*formatData*/: function(mp, mr, mpath) {
		if (mp.menus)
		{
			mr.children = mr.children || [];
			var i,
				m,
				sr;
			mr.leaf = false;
			
			for (i=0; i < mp.menus.length; i++)
			{
				m = mp.menus[i];
				m.clspath = (mpath ? mpath + "-" + m.cls : m.cls);
				sr = {
					name: m.name,
					mcls: m.cls,
					clspath: m.clspath,
					leaf: true
				};
				mr.children.push(sr);
				this._r3/*formatData*/(mp.menus[i], sr, mp.menus[i].clspath);
			}
		}
	},
	
	_4/*saveFeatures*/: function() {
		var me = this,
			gridduty = me.down("[name=gridduty]"),
			sel = gridduty.getSelectionModel().selected,
			tf = me.down("[name=tf]"),
			troot = tf.store.getRootNode(),
			feature = [],
			i,
			sid;
		
		if (sel && sel.length > 0)
		{
			sid = sel.items[0].get("sid");
			feature.push("<smsg><item uid='" + sid + "'><features>");
			me._5/*updateFeature*/(troot, feature);
			feature.push("</features></item></smsg>");
			
			var panel = this,
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
		            ack: "31",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: sid, type: "feature"}),
		            mbody: feature.join("")
		        }, panel, panel._r4/*saveFeatures*/, false);
			req._l/*request*/();
		}
	},
	
	_r4/*saveFeatures*/: function(xdoc) {
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
	},
	
	_5/*updateFeature*/: function(tparent, feature) {
		if (tparent.childNodes)
		{
			var me = this,
				i,
				rec;
			for (i=0; i < tparent.childNodes.length; i++)
			{
				rec = tparent.childNodes[i];
				if (rec.get("mshow"))
				{
					feature.push("<feat cls='" + rec.get("mcls") + "' clspath='" + rec.get("clspath") + "' show='" + (rec.get("mshow") ? "T" : "F") + "'/>");
				}
				me._5/*updateFeature*/(rec, feature);
			}
		}
	},
	
	_6/*loadFeature*/: function() {
		var me = this,
			dfn = me.down("[name=dfn]"),
			btn_save = me.down("[name=btn_save]"),
			gridduty = me.down("[name=gridduty]"),
			sel = gridduty.getSelectionModel().selected,
			sid;
			
		if (sel.length > 0)
		{
			me.setLoading(true);
			
			sid = sel.items[0].get("sid");
			dfn.setValue("Duty: " + sel.items[0].get("name"));
			btn_save.setDisabled(false);
			var panel = this,
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
		            ack: "28",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/Features", sid: sid}, "address;sid"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'content'})
		        }, panel, panel._r6/*loadFeature*/, false);
			req._l/*request*/();
		}
	},
	
	_r6/*loadFeature*/: function(xdoc) {
		var me = this,
			recmap = me._7/*recordmap*/,
			tf = me.down("[name=tf]"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/features"),
			tnodes = (tnode) ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			i, p, rec, pmap = {},
			ps, ph;
			
		me.setLoading(false);
		
		if (tnodes)
		{	
			for (i=0; i < tnodes.length; i++)
			{
				p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				pmap[p.clspath] = p;
			}
		}
		
		tf.suspendLayouts();
		tf.suspendEvents(false);
		tf.store.suspendEvents(false);
		
		for (i=0; i < recmap.length; i++)
		{
			rec = recmap[i];
			p = pmap[rec.get("clspath")];
			ps = p ? p.show == "T" : false;
			rec.get("mshow") != ps && rec.set("mshow", ps);
		}
		tf.store.resumeEvents();
		tf.resumeEvents();
		tf.resumeLayouts();
	},
	
	_8/*getRecordMap*/: function(trec) {
		if (trec.childNodes)
		{
			var i,
				me = this,
				rec;
			
			for (i=0; i < trec.childNodes.length; i++)
			{
				rec = trec.childNodes[i];
				me._7/*recordmap*/.push(rec);
				
				me._8/*getRecordMap*/(rec);
			}
		}
	},
	
	initComponent: function(){
		var me = this;
		
		me.title = IRm$/*resources*/.r1('T_FEATURES');
		
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					width: 270,
					region: "west",
					title: "Duties",
					layout: "fit",
					items: [
						{
							xtype: "grid",
							name: "gridduty",
							// hideHeaders: true,
							selType: "checkboxmodel",
							selModel: {
								checkSelector: ".x-grid-cell",
								mode: "SINGLE"
							},
							store: {
								xtype: "store",
								fields: [
									"sid", "name", "active", "status", "dutytype", "dutytype_d"
								]
							},
							columns: [
								{
									dataIndex: "dutytype_d",
									text: "Type",
									width: 60
								},
								{
									dataIndex: "name",
									text: "Name",
									flex: 1
								},
								{
									dataIndex: "active",
									width: 80,
									text: "Status"
								}
							],
							tbar: [
								{
									text: "Load Auth",
									handler: function() {
										this._1/*loadAuth*/();
									},
									scope: this
								},
								{
									text: "Refresh",
									handler: function() {
										this._2/*loadFeatures*/();
									},
									scope: this
								}
							],
							listeners: {
								selectionchange: function(tobj, selected, eOpts) {
									this._6/*loadFeature*/();
								},
								scope: this
							}
						}
					]
				},
				{
					xtype: "panel",
					region: "center",
					flex: 1,
					title: "Features",
					layout: "fit",
					items: [
						{
							xtype: "treepanel",
							name: "tf",
							// hidden: true,
							store: {
								xtype: "treestore",
								fields: [
									"name", "mcls", "clspath", "mshow"
								]
							},
							columns: [
								{
									xtype: "treecolumn",
									text: "Name",
									dataIndex: "name",
									flex: 1
								},
								{
									xtype: "gridcolumn",
									dataIndex: "mcls"
								},
								{
									xtype: "checkcolumn",
									dataIndex: "mshow",
									text: "Show",
									width: 80
								}
							],
							tbar: [
								{
									xtype: "displayfield",
									name: "dfn",
									value: "Click Duty to set features"
								},
								"-",
								{
									text: "Save",
									name: "btn_save",
									xtype: "button",
									disabled: true,
									iconCls: 'icon-toolbar-save',
									handler: function() {
										this._4/*saveFeatures*/();
									},
									scope: this
								}
							]
						}
					]
				}
			]
		});
		
		IG$/*mainapp*/._I76a/*mgrFeatures*/.superclass.initComponent.call(this);
	},
	listeners: {
		afterrender: function() {
			this._1/*loadAuth*/();
		}
	}
});
IG$/*mainapp*/._I76b/*mgrRevision*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	scroll: false,
	closable: true,
	"layout": "border",
	
	iconCls: "icon-group",
	
	_1/*loadUID*/: function(uid) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		me.setLoading(true);
		
		req.init(me, 
			{
	            ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'translate'})
			}, me, function(xdoc) {
				me.setLoading(false);
				
				var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
				
				if (tnode)
				{
					me._a/*metaobj*/ = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
					me._2/*applyMetaObj*/.call(me);
				}
			}, false);
			
		req._l/*request*/();
	},
	
	_2/*applyMetaObj*/: function() {
		var me = this,
			metaobj = me._a/*metaobj*/,
			typename = metaobj.type.toLowerCase(),
			f_1 = me.down("[name=f_1]"),
			f_2 = me.down("[name=f_2]"),
			_f1 = me.down("[name=_f1]"),
			isfolder;
		
		isfolder = me._6/*checkfoldertype*/(typename);
		me._k/*folderhierarchy*/ = [];
		
		f_1.setVisible(isfolder != 0);
		
		if (isfolder != 0)
		{
			me._k/*folderhierarchy*/.push(metaobj);
			_f1.setValue(metaobj.name);
			f_2.store.loadData([]);
			isfolder == 2 && me.down("[name=_f3]").show();
			
			this._5/*loadFolderContent*/();
		}
		else
		{
			me._3/*loadRevision*/(metaobj.uid);
		}
	},
	
	_3/*loadRevision*/: function(uid) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		me.setLoading(true);
		
		me.__m/*loadedUID*/ = uid;
			
		req.init(me, 
			{
	            ack: "72",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'get'})
			}, me, function(xdoc) {
				me.setLoading(false);
				
				var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					tnodes,
					minfo,
					f_3 = me.down("[name=f_3]"),
					f_4 = me.down("[name=f_4]"),
					f_5 = me.down("[name=f_5]"),
					f_6 = me.down("[name=f_6]"),
					f_7 = me.down("[name=f_7]"),
					dt = [], d,
					i;
				
				if (tnode)
				{
					minfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
					f_4.setValue(minfo.name);
					f_5.setValue(minfo.nodepath);
					f_6.setValue(minfo.description);
					f_7.setValue(minfo.rev);
					
					tnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "hist");
					
					if (tnode)
					{
						tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
						for (i=0; i < tnodes.length; i++)
						{
							d = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
							d.uid = minfo.uid;
							d.description = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
							d.iscurrent = (minfo.rev == d.revision) ? "YES" : "";
							d.writable = minfo.writable;
							dt.push(d);
						}
					}
					minfo.rh/*history*/ = dt;
					me._c/*minfo*/ = minfo;
					f_3.store.loadData(dt);
				}
			}, false);
			
		req._l/*request*/();
	},
	
	_4/*updateRevision*/: function() {
		var me = this,
			minfo = me._c/*minfo*/,
			f_7 = me.down("[name=f_7]"),
			nrev,
			bf = false,
			i,
			req,
			uid = me._c/*minfo*/.uid;
		
		f_7.clearInvalid();
		
		if (minfo)
		{
			nrev = "" + f_7.getValue();
			for (i=0; i < minfo.rh/*history*/.length; i++)
			{
				if (minfo.rh/*history*/[i].revision == nrev)
				{
					bf = true;
					break;
				}
			}
			
			if (bf == false)
			{
				f_7.markInvalid("Not valid revision");
				return;
			}
			
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
			me.setLoading(true);
			
			req.init(me, 
				{
		            ack: "72",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid, revision: nrev}, "uid;revision"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'setrevision'})
				}, me, function(xdoc) {
					me.setLoading(false);
					me._3/*loadRevision*/.call(me, uid);
					IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
				}, false);
				
			req._l/*request*/();
		}
	},
	
	_5/*loadFolderContent*/: function() {
		var me = this,
			metaobj = me._a/*metaobj*/,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			_f1 = me.down("[name=_f1]");
		
		me.setLoading(true);
		_f1.setValue(metaobj.name);
		
		req.init(me, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: metaobj.uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
			}, me, function(xdoc) {
				me.setLoading(false);
				var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
					folderhierarchy = me._k/*folderhierarchy*/,
					i,
					dp = [], p,
					f_2 = me.down("[name=f_2]");

				if (tnodes)
				{
					for (i=0; i < tnodes.length; i++)
					{
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						dp.push(p);
					}
				}
				
				f_2.store.loadData(dp);
					
			}, false);
			
		req._l/*request*/();
	},
	
	_6/*checkfoldertype*/: function(typename) {
		var r = 0;
		
		if (typename == "cubemodel")
		{
			r = 0;
		}
		else if ((/folder|workspace|javapackage/).test(typename))
		{
			r = 1;
		}
		else if ((/datacube|cube|metrics|mcube|nosql|sqlcube|mdbcube/).test(typename))
		{
			r = 2;
		}
		
		return r;
	},
	
	_7/*updaterevisiondesc*/: function(rec) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(me, 
			{
	            ack: "72",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: rec.get("uid"), revision: rec.get("revision")}, "uid;revision"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "updatedesc"}, null, {name: "desc", value:rec.get("description")})
			}, me, function(xdoc) {
			}, false);
			
		req._l/*request*/();
	},
	
	_8/*openRevision*/: function(row, col) {
		var me = this,
			f_3 = me.down("[name=f_3]"),
			minfo = me._c/*minfo*/,
			rec = f_3.store.data.items[row],
			mp = IG$/*mainapp*/._I7d/*mainPanel*/;
			
		if (mp && minfo && rec && rec.get("uid"))
		{
			mp.m1$7/*navigateApp*/.call(mp, minfo.uid, minfo.type.toLowerCase(), 
				minfo.name, minfo.nodepath, true, minfo.writable, 
				{revision: rec.get("revision")}
			);
		}
	},
	
	mm3/*removeItem*/: function(row, col) {
		var me = this,
			f_3 = me.down("[name=f_3]"),
			rec = f_3.store.ata.items[row],
			req;
			
		if (rec && rec.get("uid"))
		{
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
			req.init(me, 
				{
		            ack: "72",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: rec.get("uid"), revision: rec.get("revision")}, "uid;revision"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "clear_rev"}, null, {})
				}, me, function(xdoc) {
					if (me.__m/*loadedUID*/)
		    		{
		    			me._3/*loadRevision*/(me.__m/*loadedUID*/);
		    		}
				}, false);
				
			req._l/*request*/();
		}
	},
	
	initComponent: function(){
		var me = this;
		
		me.title = IRm$/*resources*/.r1('T_REVISION');
		
		$s.apply(this, {
			border: 0,
			bodyPadding: 5,
			
			items: [
				{
					xtype: "panel",
					title: "List of Items",
					region: "west",
					width: 420,
					
					name: "f_1",
					layout: {
						type: "vbox",
						align: "stretch"
					},
					hidden: true,
					split: true,
					collapseMode: "mini",
					collapsible: true,
					items: [
						{
							xtype: "fieldset",
							title: "Folder Info",
							layout: {
								type: "hbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "textfield",
									flex: 1,
									fieldLabel: null,
									readOnly: true,
									name: "_f1"
								},
								{
									xtype: "button",
									text: "Up",
									hidden: true,
									name: "_f2",
									handler: function() {
										var me = this,
											folderhierarchy = me._k/*folderhierarchy*/,
											_f2 = me.down("[name=_f2]"),
											_f3 = me.down("[name=_f3]"),
											isfolder;
											
										folderhierarchy.splice(folderhierarchy.length - 1, 1);
										me._a/*metaobj*/ = folderhierarchy[folderhierarchy.length - 1];
										
										isfolder = me._6/*checkfoldertype*/(me._a/*metaobj*/.type.toLowerCase());
										
										_f2.setVisible(folderhierarchy.length > 1);
										_f3.setVisible(isfolder == 2);
										
										me._5/*loadFolderContent*/();
										(isfolder == 2) && me._3/*loadRevision*/(me._a/*metaobj*/.uid);
									},
									scope: this
								},
								{
									xtype: "button",
									text: "->",
									hidden: true,
									name: "_f3",
									handler: function() {
										var me = this,
											minfo = me._k/*folderhierarchy*/[me._k/*folderhierarchy*/.length - 1];
											
										minfo && me._3/*loadRevision*/(minfo.uid);
									},
									scope: this
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Search",
							hidden: true,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							defaults: {
								labelWidth: 70
							},
							items: [
								{
									xtype: "textfield",
									fieldLabel: "Keyword"
								},
								{
									xtype: "combobox",
									queryMode: "local",
									displayField: "name",
									valueField: "value",
									editable: false,
									fieldLabel: "Last Modified",
									value: "",
									store: {
										xtype: "store",
										fields: ["name", "value"],
										data: [
											{name: "Select", value: ""},
											{name: "1 Day", value: "1d"},
											{name: "2 Day", value: "2d"},
											{name: "3 Day", value: "3d"},
											{name: "1 Week", value: "1w"}
										]
									}
								},
								{
									xtype: "fieldcontainer",
									layout: "hbox",
									items: [
										{
											xtype: "container",
											flex: 1
										},
										{
											xtype: "button",
											text: "Run",
											handler: function() {
												this._5/*loadFolderContent*/();
											},
											scope: this
										}
									]
								}
							]
						},
						{
							xtype: "gridpanel",
							name: "f_2",
							store: {
								xtype: "store",
								fields: [
									"name", "nodepath", "revision", "updatedate", "updatedatefm", "uid", "type"
								]
							},
							flex: 1,
							selType: "checkboxmodel",
							selModel: {
								checkSelector: ".x-grid-cell",
								mode: "SINGLE"
							},
							$v: {
								scrollX: true
							},
							columns: [
								{
									text: "Name",
									dataIndex: "name",
									minWidth: 120
								},
								{
									text: "Revision",
									dataIndex: "revision",
									minWidth: 80
								},
								{
									text: "Path",
									dataIndex: "nodepath",
									flex: 1,
									minWidth: 300
								},
								{
									text: "Last Updated",
									dataIndex: "updatedatefm",
									minWidth: 160
								}
							],
							listeners: {
								cellclick: function(tobj, td, cellindex, record, tr, rowindex, e, eopts) {
									var me = this,
										uid = record.get("uid"),
										typename = record.get("type"),
										isfolder,
										_f2 = me.down("[name=_f2]"),
										_f3 = me.down("[name=_f3]");
									
									isfolder = me._6/*checkfoldertype*/(typename.toLowerCase());
									
									if (isfolder == 0)
									{
										me._3/*loadRevision*/(uid);
									}
									else
									{
										me._a/*metaobj*/ = {
											uid: uid,
											name: record.get("name"),
											type: typename,
											nodepath: record.get("nodepath")
										};
										me._k/*folderhierarchy*/.push(me._a/*metaobj*/);
										_f2.setVisible(me._k/*folderhierarchy*/.length > 1);
										_f3.setVisible(isfolder == 2);
										me._5/*loadFolderContent*/();
										(isfolder == 2) && me._3/*loadRevision*/(uid);
									}
								},
								scope: this
							}
						}
					]
				},
				{
					xtype: "panel",
					region: "center",
					title: "Revision Management",
					flex: 1,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "fieldset",
							title: "Information",
							layout: {
								type: "hbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "panel",
									layout: "anchor",
									flex: 1,
									border: 1,
									padding: "0 5 0",
									bodyPadding: 4,
									defaults: {
										labelAlign: "right"
									},
									items: [
										{
											xtype: "textfield",
											fieldLabel: "Name",
											readOnly: true,
											name: "f_4"
										},
										{
											xtype: "textfield",
											anchor: "100%",
											fieldLabel: "Location",
											readOnly: true,
											name: "f_5"
										},
										{
											xtype: "textarea",
											anchor: "100%",
											height: 120,
											fieldLabel: "Description",
											readOnly: true,
											name: "f_6"
										}
									]
								},
								{
									xtype: "panel",
									layout: {
										type: "vbox",
										align: "stretch"
									},
									width: 240,
									flex: 1,
									border: 1,
									padding: "0 5 0",
									bodyPadding: 4,
									defaults: {
										labelAlign: "right"
									},
									items: [
										{
											xtype: "fieldcontainer",
											fieldLabel: "Current Revision",
											anchor: "100%",
											layout: "anchor",
											items: [
												{
													xtype: "numberfield",
													width: 60,
													maxWidth: 80,
													minValue: 0,
													name: "f_7"
												},
												{
													xtype: "fieldcontainer",
													layout: "hbox",
													fieldLabel: null,
													items: [
														{
															xtype: "button",
															text: "Change Revision",
															handler: function() {
																this._4/*updateRevision*/();
															},
															scope: this
														}
													]
												}
											]
										},
										{
											xtype: "container",
											flex: 1
										}
									]
								}
							]
						},
						{
							xtype: "fieldcontainer",
							layout: {
								type: "hbox"
							},
							items: [
							    {
							    	xtype: "button",
							    	text: "Refresh",
							    	width: 80,
							    	margin: "0 4 0",
							    	handler: function() {
							    		var me = this;
							    		if (me.__m/*loadedUID*/)
							    		{
							    			me._3/*loadRevision*/(me.__m/*loadedUID*/);
							    		}
							    	},
							    	scope: this
							    },
								{
									xtype: "button",
									text: "Clear",
									width: 80,
									handler: function() {
										var me = this,
											req;
										
										if (me.__m/*loadedUID*/)
										{
											req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
											req.init(me, 
												{
										            ack: "72",
										            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.__m/*loadedUID*/}, "uid;revision"),
										            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "clear_hist"}, null, {})
												}, me, function(xdoc) {
													if (me.__m/*loadedUID*/)
										    		{
										    			me._3/*loadRevision*/(me.__m/*loadedUID*/);
										    		}
												}, false);
												
											req._l/*request*/();
										}
									},
									scope: this
								},
								{
									xtype: "displayfield",
									flex: 1,
									value: "Clear previous revision history",
									padding: "0 5 0"
								}
							]
						},
						{
							xtype: "gridpanel",
							name: "f_3",
							selType: "checkboxmodel",
							selModel: {
								checkSelector: ".x-grid-cell"
							},
							store: {
								xtype: "store",
								fields: [
									"uid", "revision", "updatedate", "updatedatefm", "description", "username", "userid", "iscurrent", "writable"
								]
							},
							defaults: {
								menuDisabled: true
							},
							plugins: [
						        {
						        	ptype: "cellediting",
						            clicksToEdit: 1
						        }
						    ],
							columns: [
								{
									text: "Revision",
									dataIndex: "revision"
								},
								{
									text: "Updated Date",
									dataIndex: "updatedatefm",
									width: 150
								},
								{
									text: "Modified By",
									dataIndex: "username"
								},
								{
									text: "Description",
									dataIndex: "description",
									flex: 1,
									editor: {
										xtype: "textfield",
										allowBlank: true
									}
								},
								{
									text: "Current",
									dataIndex: "iscurrent"
								},
								{
									xtype: "actioncolumn",
									width: 50,
									menuDisabled: true,
									items: [
										{
											// icon: "./images/delete.png",
											iconCls: "icon-grid-add",
											tooltip: "Open This Revision",
											handler: function (grid, rowIndex, colIndex) {
												me._8/*openRevision*/.call(me, rowIndex, colIndex);
											}
										},
										{
											// icon: "./images/delete.png",
											iconCls: "icon-grid-delete",
											tooltip: "Remove History",
											handler: function (grid, rowIndex, colIndex) {
												// var rec = store.getAt(rowIndex);
												me.mm3/*removeItem*/.call(me, rowIndex, colIndex);
											}
										}
									]
								}
							],
							listeners: {
								edit: function(editor, e, eopts) {
									var me = this,
										rec = e.record;
									
									me._7/*updaterevisiondesc*/(rec);
								},
								scope: this
							}
						}
					]
				}
			]
		});
		
		IG$/*mainapp*/._I76b/*mgrRevision*/.superclass.initComponent.call(this);
	},
	listeners: {
		afterrender: function(tobj) {
			var me = this;
			me._1/*loadUID*/(me.uid);
		}
	}
});
IG$/*mainapp*/._Id3/*userDBTemplate*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	layout: "fit",
	closable: false,
	resizable:false,
	width: 300,
	autoHeight: true,
	
	callback: null,
	
	c1/*confirm*/: function(){
		var panel = this,
			fielditems = panel.fielditems,
			fname, fvalue,
			i;
		
		for (i=0; i < fielditems.length; i++)
		{
			fname = fielditems[i].fname;
			fvalue = panel.down("[name=" + fname + "]").getValue();
			
			fielditems[i].uvalue = fvalue;
			
			if (fielditems[i].optional != true)
			{
				if (!fvalue)
				{
					IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('T_DB_BLANK'), null, panel, null, null, 1, "error");
					return;
				}
			}
		}
		
		var nvalue = panel.c3/*applyValue*/();
			
		if (panel.callback)
		{
			panel.callback.execute(nvalue);
			panel.close();
		}
	},
	
	c3/*applyValue*/: function() {
		var me = this,
			fieldvalue = me.fieldvalue,
			fielditems = me.fielditems,
			fname, fvalue, i,
			fieldmap = {},
			rvalue;
		
		for (i=0; i < fielditems.length; i++)
		{
			fieldmap[fielditems[i].fname] = fielditems[i].uvalue;
		}
		
		rvalue = me.c3a/*processValue*/(fieldvalue, fieldmap, false);
		
		return rvalue;
	},
	
	c3a/*processValue*/: function(fieldvalue, fieldmap, isblock) {
		var me = this,
			rvalue = [],
			i,
			c,
			inblock = false,
			inoptblock = false,
			mval,
			mbval, 
			hasvalue = false;
		
		for (i=0; i < fieldvalue.length; i++)
		{
			c = fieldvalue[i];
			switch (c)
			{
			case "<":
				if (inoptblock == true)
				{
					mbval += c;
				}
				else
				{
					inblock = true;
					mval = "";
				}
				break;
			case "[":
				inoptblock = true;
				inblock = false;
				mbval = "";
				break;
			case ">":
				if (inoptblock == false && inblock == true)
				{
					if (fieldmap[mval])
					{
						rvalue.push(fieldmap[mval]);
						hasvalue = true;
					}
					inblock = false;
				}
				else if (inoptblock == true)
				{
					mbval += c;
				}
				break;
			case "]":
				inoptblock = false;
				var optproc = me.c3a/*processValue*/(mbval, fieldmap, true);
				rvalue.push(optproc);
				break;
			default:
				if (inoptblock == true)
				{
					mbval += c;
				}
				else if (inblock == true)
				{
					mval += c;
				}
				else
				{
					rvalue.push(c);
				}
				break;
			}
		}
		
		if (hasvalue == false && isblock == true)
		{
			return "";
		}
		
		return rvalue.join("");
	},
	
	c2/*parseValue*/: function(value) {
		var fielditems = [],
			i, c, item, mval, isoptional = false, inblock = false;
		
		for (i=0; i < value.length; i++)
		{
			c = value[i];
			switch (c)
			{
			case "<":
				inblock = true;
				mval = c;
				break;
			case "[":
				isoptional = true;
				break;
			case ">":
				if (inblock == true)
				{
					inblock = false;
					mval += c;
					fielditems.push({
						field: mval,
						fname: mval.substring(1, mval.length-1),
						optional: isoptional
					});
				}
				break;
			case "]":
				isoptional = false;
				break;
			default:
				if (inblock == true)
				{
					mval += c;
				}
				break;
			}
		}
		
		return fielditems;
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	initComponent : function() {
		var me = this,
			items = [],
			fieldvalue = me.fieldvalue,
			fielditems,
			i;
			
		me.title = IRm$/*resources*/.r1('T_DB_TMPL');
		
		me.fielditems = fielditems = me.c2/*parseValue*/(fieldvalue);
		
		for (i=0; i < fielditems.length; i++)
		{
			items.push({
				fieldLabel: fielditems[i].fname,
	            name: fielditems[i].fname,
	            value: '',
	            allowBlank: fielditems[i].optional,
	            blankText: 'Item name is required!'
			});
		}
		
		var inputpanel = new IG$/*mainapp*/._I57/*IngPanel*/({
			region:'center',
			flex: 3,
	        border:true,
	        region:'center',
	        id: 'dlgmakemetaform',
	        defaultType: 'textfield',
	        layout: 'anchor',
	        defaults: {
	        	anchor: '100%',
	        	labelWidth: 80
	        },
	        items: items
	    });
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
			    inputpanel
			],
			buttons:[
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.c1/*confirm*/();
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
		
		IG$/*mainapp*/._Id3/*userDBTemplate*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Id4/*dbObject*/ = function() {
	
}

IG$/*mainapp*/._Id4/*dbObject*/.prototype = {
	pX/*parseXML*/: function(xdoc) {
		var me = this,
			i,
			m;
			
		me.dbtype = "";
		me.jdbcurl = "";
		me.driver = "";
		me.username = "";
		me.passwd = "";
		me.name = "";
		me.savepwd = false;
		me.schemaname = "";
		me.charset_out = "";
		me.charset_db = "";
		me.userowlimit = 0;
		me.mongodb_hosts = "";
		me.c_rule = "min";
		me.cache = false;
		me.c_int = 5;
		me.query_timeout = 0;
		me.schedule_query_timeout = 0;
		me.max_pool_size = 0;
		me.c_dbmon = false;
		
		if (xdoc) 
		{
			var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"), 
				tnodes, n, v;
			
			me.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid");
			me.name = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "name");
			me.memo = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "memo");
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/connection");
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < tnodes.length; i++)
			{
				n = IG$/*mainapp*/._I29/*XGetNodeName*/(tnodes[i]);
				v = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
				if (n == "savepwd")
				{
					v = (v == "T") ? true : false;
				}
				else if (n == "userowlimit")
				{
					v = parseInt(v);
				}
				else if (n == "cache")
				{
					v = (v == "T") ? true : false;
				}
				else if (n == "c_int")
				{
					v = parseInt(v) || 5;
				}
				else if (n == "c_dbmon")
				{
					v = (v == "T") ? true : false;
				}
				else if (n == "max_pool_size" || n == "schedule_query_timeout" || n == "query_timeout")
				{
					v = parseInt(v) || 0;
				}
				me[n] = v;
			}
		}
	},
	gX/*getXML*/: function(incpasswd) {
		var r = [],
			me = this,
			i,
			mongodb_hosts = me.mongodb_hosts;
			
		r.push("<smsg><item uid='" + me.uid + "'><connection>");
		r.push("<dbtype>" + me.dbtype + "</dbtype>");
		r.push("<jdbcurl><![CDATA[" + me.jdbcurl + "]]></jdbcurl>");
		r.push("<driver><![CDATA[" + me.driver + "]]></driver>");
		r.push("<username>" + me.username + "</username>");
		r.push("<savepwd>" + (me.savepwd ? "T" : "F") + "</savepwd>");
		r.push("<schemaname>" + (me.schemaname || "") + "</schemaname>");
		r.push("<charset_out>" + (me.charset_out || "") + "</charset_out>");
		r.push("<charset_db>" + (me.charset_db || "") + "</charset_db>");
		r.push("<userowlimit>" + (me.userowlimit || "0") + "</userowlimit>");
		if (incpasswd == false || me.savepwd == true)
		{
			r.push("<passwd>" + me.passwd + "</passwd>");
		}
		r.push("<mongodb_hosts><![CDATA[" + (me.mongodb_hosts || "") + "]]></mongodb_hosts>");
		r.push("<validateSql><![CDATA[" + (me.validateSql || "") + "]]></validateSql>");
		r.push("<cache>" + (me.cache ? "T" : "F") + "</cache>");
		r.push("<c_rule>" + (me.c_rule || "min") + "</c_rule>");
		r.push("<c_int>" + (me.c_int || "5") + "</c_int>");
		r.push("<query_timeout>" + (me.query_timeout || "0") + "</query_timeout>");
		r.push("<schedule_query_timeout>" + (me.schedule_query_timeout || "0") + "</schedule_query_timeout>");
		r.push("<max_pool_size>" + (me.max_pool_size || "0") + "</max_pool_size>");
		r.push("<c_dbmon>" + (me.c_dbmon ? "T" : "F") + "</c_dbmon>");
		r.push("</connection></item></smsg>");
		return r.join("");
	}
};

IG$/*mainapp*/._I74/*mgrdb_config*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	scroll: false,
	initialized: false,
	closable: true,
	hideMode: 'offsets',
	"layout": "fit",
	bodyPadding: 5,
	iconCls: "icon-ing-docdef",
	
	_IFd/*init_f*/: function() {
		if (window.dbtypelist)
		{
			var panel = this,
				db, db1, i, dbinfo = [];
				
			for (i=0; i < window.dbtypelist.length; i++) {
				db = window.dbtypelist[i];
				db1 = {};
				IG$/*mainapp*/._I1d/*CopyObject*/(db, db1, "id;desc;driver;url");
				dbinfo.push(db1);
			}
			
			panel.dblist = dbinfo;
			panel.ld2/*loadUserDBList*/();
		}
		else
		{
			var panel = this,
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
		            ack: "11",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'dblist'})
		        }, panel, panel.rs_ld1/*loadDBList*/, false);
			req._l/*request*/();
		}
	},
	
	rs_ld1/*loadDBList*/: function(xdoc) {
		var panel = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"), 
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			i, dbinfo = [],
			db, db1;
		
		window.dbtypelist = [];
		
		for (i=0; i < tnodes.length; i++)
		{
			db = {
				id: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
				desc: IG$/*mainapp*/._I24/*getTextContent*/(IG$/*mainapp*/._I18/*XGetNode*/(tnodes[i], "desc")),
				driver: IG$/*mainapp*/._I24/*getTextContent*/(IG$/*mainapp*/._I18/*XGetNode*/(tnodes[i], "driver")),
				url: IG$/*mainapp*/._I24/*getTextContent*/(IG$/*mainapp*/._I18/*XGetNode*/(tnodes[i], "url"))
			};
			db1 = {};
			IG$/*mainapp*/._I1d/*CopyObject*/(db, db1, "id;desc;driver;url");
			window.dbtypelist.push(db1);
			dbinfo.push(db);
		}
		
		panel.dblist = dbinfo;
		panel.ld2/*loadUserDBList*/();
	},
	
	ld2/*loadUserDBList*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "29",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({"address": "/Connections", option: "list"}, "address;option"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
	        }, panel, panel.rs_ld2/*loadUserDBList*/, false);
		req._l/*request*/();
	},
	
	rs_ld2/*loadUserDBList*/: function(xdoc) {
		var me = this,
			dbgrid = me.down("[name=dbgrid]"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			tnodes, items = [], item, i;
		
		if (tnode)
		{
			me.rootnode = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid");
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tnodes.length; i++)
			{
				item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				items.push(item);
			}
			dbgrid.store.loadData(items);
		}
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var panel = this;
		switch (cmd)
		{
		case "cmd_add_db":
			var paneludetail;
				
			paneludetail = new IG$/*mainapp*/.AkX/*mgrdb_editor*/({
				dbinfo: null,
				dblist: panel.dblist,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_MM/*afterEdit*/)
			});
			
			paneludetail.show();
			break;
		}
	},
	
	ld4/*loadDBDetail*/: function(uid) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({"address": uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
	        }, panel, panel.rs_ld4/*loadDBDetail*/, false);
		req._l/*request*/();
	},
	
	rs_ld4/*loadDBDetail*/: function(xdoc) {
		var panel = this,
			paneludetail,
			dbinfo;
			
		dbinfo = new IG$/*mainapp*/._Id4/*dbObject*/();
		dbinfo.pX/*parseXML*/(xdoc);
		
		paneludetail = new IG$/*mainapp*/.AkX/*mgrdb_editor*/({
			dbinfo: dbinfo,
			dblist: panel.dblist,
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs_MM/*afterEdit*/)
		});
		
		paneludetail.show();
	},
	
	rs_MM/*afterEdit*/: function(mode) {
		var panel = this;
		panel.dbinfo = null;
		panel.ld2/*loadUserDBList*/();
		
		mode == "saved" && IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SAVED'), null, null, 0, "success");
		mode == "deleted" && IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_DELETED'), null, null, 0, "success");
	},
	
    initComponent: function(){
    	var me = this;
    	
		me.items = [
            {
    			xtype: "panel",
				region: "center",
				"layout": {
					type: "vbox",
					align: "stretch"
				},
				
				bodyPadding: 4,
				
				items: [
					{
						xtype: "panel",
						flex: 1,
						border: false,
						"layout": { 
							type: "vbox",
							align: "stretch"
						},
						items: [
							{
								xtype: "gridpanel",
								name: "dbgrid",
								flex: 1,
								store: {
									xtype: "store",
									fields: [
										"name", "uid", "memo", "writable", "manage", "type", "owner", "modifier", "updatedate"
									]
								},
								columns: [
									{
										text: IRm$/*resources*/.r1("B_TYPE"),
										width: 80,
										sortable: false,
										hideable: false,
										dataIndex: "type"
									},
									{
										text: IRm$/*resources*/.r1("B_NAME"),
										flex: 1,
										sortable: false,
										hideable: false,
										dataIndex: "memo"
									},
									{
										text: IRm$/*resources*/.r1("B_OWNER"),
										width: 120,
										dataIndex: "owner"
									},
									{
										text: IRm$/*resources*/.r1("B_MODI"),
										width: 120,
										dataIndex: "modifier"
									}
								],
								listeners: {
									itemclick: function(view, record, item, index, e, eOpts) {
										var sid = record.get("uid");
										this.ld4/*loadDBDetail*/(sid);
									},
									scope: this
								}
							}
						],
						tbar: [
					       	{
					       		iconCls: "icon-toolbar-add",
					        	text: IRm$/*resources*/.r1("L_ADD_DB_INST"),
					        	handler: function() {
					        		this._t$/*toolbarHandler*/('cmd_add_db'); 
					        	},
					        	scope: this
					       	}
						]
					}
				]
            }
		];
		
		this.listeners = {
			afterrender: function(tobj) {
				tobj._IFd/*init_f*/.call(tobj);
			}
		}

		IG$/*mainapp*/._I74/*mgrdb_config*/.superclass.initComponent.call(this);
    }
});

IG$/*mainapp*/.AkX/*mgrdb_editor*/ = $s.extend($s.window, {
	name: "paneludetail",
	width: 500,
	height: 520,
	"layout": "fit",
	
	defaults: {
		anchor: "100%"
	},
	
	in$t: function() {
		var me = this,
			tdbtype = me.down("[name=tdbtype]"),
			dblist = me.dblist;
			
		tdbtype.store.loadData(dblist);
		
		me.ld5/*updateDBDetail*/();
	},
	
	ld5/*updateDBDetail*/: function() {
		var p = this,
			u = p.dbinfo,
			l = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/,
			tname = p.down("[name=tname]"),
			tdbtype = p.down("[name=tdbtype]"),
			tdriver = p.down("[name=tdriver]"),
			updatedate = IRm$/*resources*/.r1("L_LAST_UPD"),
			turl = p.down("[name=turl]"),
			tuname = p.down("[name=tuname]"),
			tpwd = p.down("[name=tpwd]"),
			tusave = p.down("[name=tusave]"),
			tudate = p.down("[name=tudate]"),
			// schemaname = p.down("[name=schemaname]"),
			charset_out = p.down("[name=charset_out]"),
			charset_db = p.down("[name=charset_db]"),
			userowlimit = p.down("[name=userowlimit]"),
			c_rule = p.down("[name=c_rule]"),
			cache = p.down("[name=cache]"),
			c_int = p.down("[name=c_int]"),
			gm1 = p.down("[name=gm1]"),
			qt1 = p.down("[name=qt1]"),
			qt2 = p.down("[name=qt2]"),
			qt3 = p.down("[name=qt3]"),
			c_dbmon = p.down("[name=c_dbmon]"),
			validateSql = p.down("[name=validateSql]");
	
		tname.setReadOnly((u) ? true : false);
		tname.setValue(u ? u.memo || "" : "");
		tdbtype.setValue(u ? u.dbtype || "" : "");
		tdriver.setValue(u ? u.driver || "" : "");
		turl.setValue(u ? u.jdbcurl || "" : "");
		tuname.setValue(u ? u.username || "" : "");
		tpwd.setValue(u ? u.passwd || "" : "");
		tusave.setValue(u ? u.savepwd : false);
		cache.setValue(u ? u.cache : false);
		c_int.setValue(u ? u.c_int || 5 : 5);
		qt1.setValue(u ? u.query_timeout || 0 : 0);
		qt2.setValue(u ? u.schedule_query_timeout || 0 : 0);
		qt3.setValue(u ? u.max_pool_size || 0 : 0);
		validateSql.setValue(u ? u.validateSql || "" : "");
		c_dbmon.setValue(u ? u.c_dbmon : false);
		
		// schemaname.setValue(u ? u.schemaname || "" : "");
		charset_out.setValue(u ? u.charset_out || "" : "");
		charset_db.setValue(u ? u.charset_db || "" : "");
		userowlimit.setValue(u ? u.userowlimit || 0 : 0);
		c_rule.setValue(u ? u.c_rule || "min" : "min");
		
		updatedate = (u && u.updatedate) ? updatedate + IG$/*mainapp*/._I40/*formatDate*/(u.updatedate) : updatedate;
		tudate.setValue(updatedate);
		gm1.setValue(u && u.mongodb_hosts ? u.mongodb_hosts : "");
	},
	
	cH/*changeDriverHeler*/: function() {
		var i,
			me = this,
			dbtypelist = window.dbtypelist,
			dbtype,
			tdbtype = me.down("[name=tdbtype]"),
			tdriver = me.down("[name=tdriver]"),
			turl = me.down("[name=turl]"),
			nval;
		
		if (me.changelock == true)
			return;
		
		nval = tdbtype.getValue();
		
		for (i=0; i < dbtypelist.length; i++)
		{
			if (dbtypelist[i].id == nval) 
			{
				dbtype = dbtypelist[i];
				break;
			}
		}
		
		tdriver.setValue(dbtype ? dbtype.driver : "");
		turl.setValue(dbtype ? dbtype.url : "");
	},
	
	cH1/*testConnection*/: function() {
		var panel = this,
			dbo;
		
		dbo = new IG$/*mainapp*/._Id4/*dbObject*/();
		dbo.pX/*parseXML*/(null);
		
		panel.lda/*updateInfo*/(dbo);
		
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "29",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({"address": "/Connections", option: "testcon"}, "address;option"),
	            mbody: dbo.gX/*getXML*/(false)
	        }, panel, panel.rs_cH1/*testConnection*/, false);
		req._l/*request*/();
	},
	
	rs_cH1/*testConnection*/: function(xdoc) {
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SUC_DBCON'), null, null, 0, "success");
	},
	
	cH2/*setParameter*/: function(field) {
		var me = this,
			mfield = me.down("[name=" + field + "]"),
			mvalue = mfield.getValue(),
			dlg;
		
		dlg = new IG$/*mainapp*/._Id3/*userDBTemplate*/({
			fieldvalue: mvalue,
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs_cH2/*setParameter*/, field)
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	},
	
	rs_cH2/*setParameter*/: function(nvalue, field) {
		var me = this,
			mfield = me.down("[name=" + field + "]");
		
		mfield.setValue(nvalue);
	},
	
	ld6/*confirmChanges*/: function(cmd) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			purpose,
			address,
			content,
			dbo = panel.dbinfo,
			tname = panel.down("[name=tname]"),
			desc = "",
			itemname;
		
		if (cmd == "confirm")
		{
			itemname = tname.getValue();
			purpose = "31";
			address = IG$/*mainapp*/._I2d/*getItemAddress*/({
        		address: (dbo ? dbo.uid : "/Connections/" + itemname),
        		name: itemname,
        		type: "UserDB",
        		pid: panel.rootnode,
        		memo: tname.getValue(),
        		description: desc
        	}, "address;name;type;pid;description;memo");
			
			if (!dbo)
			{
				dbo = new IG$/*mainapp*/._Id4/*dbObject*/();
				dbo.pX/*parseXML*/(null);
			}
			
			panel.lda/*updateInfo*/(dbo);
			
			content = dbo.gX/*getXML*/(true);
			
			req.init(panel, 
				{
		            ack: purpose,
		            payload: address,
		            mbody: content
		        }, panel, panel.rs_ld6a/*saveContent*/, false);
			req._l/*request*/();
		}
		else if (cmd == "delete")
		{
			IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("B_C_DELETE"), function(btn) {
				if (btn == "yes")
				{
					if (!dbo)
					{
						return;
					}
					purpose = "7";
					address = IG$/*mainapp*/._I2d/*getItemAddress*/({
		        		address: dbo.uid,
		        		name: itemname,
		        		type: "UserDB",
		        		description: desc
		        	}, "address;name;type;pid;description;memo");
					content = IG$/*mainapp*/._I2e/*getItemOption*/({});
					
					req.init(panel, 
						{
				            ack: purpose,
				            payload: address,
				            mbody: content
				        }, panel, panel.rs_ld6b/*deleteContent*/, false);
					req._l/*request*/();
				}
			}, this, this);
		}
	},
	
	rs_ld6b/*deleteContent*/: function(xdoc) {
		var panel = this;
		panel.callback && panel.callback.execute("saved");
		panel.close();
	},
	
	rs_ld6a/*saveContent*/: function(xdoc) {
		var panel = this;
		panel.callback && panel.callback.execute("saved");
		panel.close();
	},
	
	lda/*updateInfo*/: function(dbo) {
		var panel = this,
			tdbtype = panel.down("[name=tdbtype]"),
			tdriver = panel.down("[name=tdriver]"),
			turl = panel.down("[name=turl]"),
			tuname = panel.down("[name=tuname]"),
			tpwd = panel.down("[name=tpwd]"),
			tusave = panel.down("[name=tusave]"),
			// schemaname = panel.down("[name=schemaname]"),
			charset_out = panel.down("[name=charset_out]"),
			charset_db = panel.down("[name=charset_db]"),
			userowlimit = panel.down("[name=userowlimit]"),
			gm1 = panel.down("[name=gm1]"),
			c_rule = panel.down("[name=c_rule]"),
			cache = panel.down("[name=cache]"),
			c_int = panel.down("[name=c_int]"),
			qt1 = panel.down("[name=qt1]"),
			qt2 = panel.down("[name=qt2]"),
			qt3 = panel.down("[name=qt3]"),
			validateSql = panel.down("[name=validateSql]"),
			c_dbmon = panel.down("[name=c_dbmon]"),
			rec,
			i;
		
		dbo.dbtype = tdbtype.getValue();
		dbo.jdbcurl = turl.getValue();
		dbo.driver = tdriver.getValue();
		dbo.username = tuname.getValue();
		dbo.passwd = tpwd.getValue();
		dbo.savepwd = true; // tusave.getValue() ? true : false;
		// dbo.schemaname = schemaname.getValue();
		dbo.charset_out = charset_out.getValue();
		dbo.charset_db = charset_db.getValue();
		dbo.userowlimit = userowlimit.getValue();
		dbo.mongodb_hosts = gm1.getValue();
		
		dbo.c_rule = c_rule.getValue();
		dbo.cache = cache.getValue();
		dbo.c_int = c_int.getValue();
		dbo.c_dbmon = c_dbmon.getValue();
		
		dbo.query_timeout = qt1.getValue();
		dbo.schedule_query_timeout = qt2.getValue();
		dbo.max_pool_size = qt3.getValue();
		dbo.validateSql = validateSql.getValue();
	},
	
	m1/*changeLayout*/: function() {
		var me = this,
			tdbtype = me.down("[name=tdbtype]").getValue(),
			m1 = me.down("[name=m1]"),
			m2 = me.down("[name=m2]"),
			m_a1 = me.down("[name=m_a1]");
			
		m1.setVisible(tdbtype != "mongodb");
		m2.setVisible(tdbtype == "mongodb");
		m_a1.setVisible(tdbtype != "mongodb");
	},
	
	initComponent: function(){
		var me = this;
		
		$s.apply(me, {
			title: IRm$/*resources*/.r1("T_DB_CON"),
			items: [
				{
					xtype: "panel",
					layout: "anchor",
					bodyPadding: 10,
					autoScroll: true,
					items: [
						{
							xtype: "textfield",
							fieldLabel: IRm$/*resources*/.r1("L_DB_NAME"),
							name: "tname"
						},
						
						{
							xtype: "fieldcontainer",
							fieldLabel: IRm$/*resources*/.r1("L_DB_TYPE"),
							layout: "hbox",
							items: [
								{
									xtype: "combobox",
									labelField: "desc",
									valueField: "gid",
									name: "tdbtype",
									queryMode: 'local',
									displayField: 'desc',
									valueField: 'id',
									editable: false,
									autoSelect: true,
									store: {
										fields: [
											"id", "desc", "driver", "url"
										]
									},
									listeners: {
										change: function(cb, newValue, oldValue, eOpts) {
											this.m1/*changeLayout*/();
										},
										scope: this
									}
								},
								{
									xtype: "button",
									name: "m_a1",
									text: IRm$/*resources*/.r1("L_APPLY_TMPL"),
									handler: function() {
										var me = this;
										me.cH/*changeDriverHeler*/.call(me);
									},
									scope: this
								}
							]
						},
						{
							xtype: "fieldcontainer",
							layout: "anchor",
							hidden: true,
							name: "m1",
							defaults: {
								anchor: "100%"
							},
							items: [
								{
									xtype: "textfield",
									fieldLabel: IRm$/*resources*/.r1("L_JDBC_DRV"),
									name: "tdriver"
								},
								{
									xtype: "fieldcontainer",
									fieldLabel: IRm$/*resources*/.r1("L_JDBC_URL"),
									layout: "hbox",
									items: [
										{
											xtype: "textfield",
											fieldLabel: "",
											name: "turl",
											width: 280
										},
										{
											xtype: "button",
											text: "Set",
											handler: function() {
												var turl = this.down("[name=turl]");
												
												if (turl.getValue() != "")
												{
													this.cH2/*setParameter*/("turl");
												}
											},
											scope: this
										}
									]
								},
								{
									xtype: "textfield",
									fieldLabel: IRm$/*resources*/.r1("L_DB_UNAME"),
									name: "tuname"
								},
								{
									xtype: "fieldcontainer",
									fieldLabel: IRm$/*resources*/.r1("L_DB_PWD"),
									layout: "hbox",
									items: [
								
										{
											xtype: "textfield",
											fieldLabel: "",
											inputType: "password",
											name: "tpwd",
											width: 220
										},
										{
											xtype: "button",
											text: "Test",
											handler: function() {
												var me = this;
												me.cH1/*testConnection*/.call(me);
											},
											scope: this
										}
									]
								},
								{
									xtype: "checkbox",
									fieldLabel: "Save password",
									hidden: true,
									name: "tusave"
								},
								{
									xtype: "displayfield",
									value: IRm$/*resources*/.r1("L_LAST_UPD"),
									name: "tudate"
								},
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_ADV_OPTION"),
									layout: "anchor",
									items: [
										{
											xtype: "textarea",
											height: 80,
											fieldLabel: IRm$/*resources*/.r1("L_DB_VAL"),
											name: "validateSql"
										},
										{
											xtype: "numberfield",
											name: "qt3",
											fieldLabel: "Max pool size",
											minValue: 0,
											maxValue: 1000
										},
										{
											xtype: "numberfield",
											name: "qt1",
											fieldLabel: IRm$/*resources*/.r1("L_DB_QUERYTIMEOUT"),
											minValue: 0,
											maxValue: 100000
										},
										{
											xtype: "numberfield",
											name: "qt2",
											fieldLabel: IRm$/*resources*/.r1("L_DB_SCHEDULE_QUERYTIMEOUT"),
											minValue: 0,
											maxValue: 100000
										},
										{
											xtype: "combobox",
											labelField: "name",
											valueField: "value",
											name: "charset_db",
											queryMode: 'local',
											displayField: 'name',
											editable: false,
											autoSelect: true,
											fieldLabel: IRm$/*resources*/.r1("L_DB_CHARSET"),
											store: {
												xtype: "store",
												
												fields: [
													"name", "value"
												],
												
												data: [
													{name: "Not use", value: ""},
													{name: "UTF-8", value: "utf-8"},
													{name: "ksc5601", value: "ksc5601"},
													{name: "x-windows-949", value: "x-windows-949"},
													{name: "iso-8859-1", value: "iso-8859-1"},
													{name: "euc-kr", value: "euc-kr"}
												]
											}
										},
										{
											xtype: "combobox",
											labelField: "name",
											valueField: "value",
											name: "charset_out",
											queryMode: 'local',
											displayField: 'name',
											editable: false,
											autoSelect: true,
											fieldLabel: IRm$/*resources*/.r1("L_OUTPUT_CHARSET"),
											store: {
												xtype: "store",
												
												fields: [
													"name", "value"
												],
												
												data: [
													{name: "Not use", value: ""},
													{name: "UTF-8", value: "utf-8"},
													{name: "ksc5601", value: "ksc5601"},
													{name: "x-windows-949", value: "x-windows-949"},
													{name: "iso-8859-1", value: "iso-8859-1"},
													{name: "euc-kr", value: "euc-kr"}
												]
											}
										},
										{
											xtype: "numberfield",
											name: "userowlimit",
											anchor: "50%",
											fieldLabel: IRm$/*resources*/.r1("L_ROW_LIMIT_COUNT"),
											minValue: 0,
											maxValue: 10000000
										},
										{
											xtype: "checkbox",
											fieldLabel: IRm$/*resources*/.r1("L_USE_CACHE"),
											name: "cache",
											boxLabel: IRm$/*resources*/.r1("B_ENABLED")
										},
										{
											xtype: "combobox",
											fieldLabel: IRm$/*resources*/.r1("L_CACHE_RULE"),
											name: "c_rule",
											displayField: "name",
											valueField: "value",
											queryMode: 'local',
											editable: false,
											autoSelect: true,
											store: {
												xtype: "store",
												
												fields: [
													"name", "value"
												],
												
												data: [
													{name: IRm$/*resources*/.r1("L_EV_MIN"), value: "min"},
													{name: IRm$/*resources*/.r1("L_EV_HOUR"), value: "hour"},
													{name: IRm$/*resources*/.r1("L_EV_DAY"), value: "day"}
												]
											},
											listeners: {
												change: function(tobj) {
													var me = this,
														c_int = me.down("[name=c_int]"),
														tval = tobj.getValue();
													
													c_int.setFieldLabel(tval == "day" ? IRm$/*resources*/.r1("L_CLC_HOUR") : IRm$/*resources*/.r1("L_CLC_PERI"));
												},
												scope: this
											}
										},
										{
											xtype: "numberfield",
											fieldLabel: IRm$/*resources*/.r1("L_CACHE_PERI"),
											name: "c_int",
											value: 5,
											minValue: 1,
											maxValue: 1000
										},
										{
											xtype: "checkbox",
											fieldLabel: IRm$/*resources*/.r1("L_DB_MON"),
											boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
											name: "c_dbmon"
										}
									]
								}
							]
						},
						{
							xtype: "fieldcontainer",
							layout: "fit",
							height: 280,
							hidden: true,
							name: "m2",
							items: [
								{
									xtype: "textarea",
									name: "gm1",
									flex: 1,
									fieldLabel: "Connection String"
								}
							]
						},
						{
							xtype: "fieldcontainer",
							hidden: (me.dbinfo ? false : true),
							items: [
								{
									xtype: "button",
									text: "Remove Connection",
									handler: function() {
										this.ld6/*confirmChanges*/("delete");
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
						this.ld6/*confirmChanges*/("confirm");
					},
					scope: this
				},
				{
					xtype: "button",
					text: IRm$/*resources*/.r1("B_CANCEL"),
					handler: function() {
						// var paneludetail = this.down("[name=paneludetail]");
						// paneludetail.setVisible(false);
						this.close();
					},
					scope: this
				}
			]
		});
		
		IG$/*mainapp*/.AkX/*mgrdb_editor*/.superclass.initComponent.call(this);
	},
	
	listeners: {
		afterrender: function(tobj) {
			tobj.in$t();
		}
	}
});

/**
 * Password for database connection
 */
IG$/*mainapp*/._Ice/*userDbPassword*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	layout: "fit",
	closable: false,
	resizable:false,
	width: 300,
	autoHeight: true,
	
	callback: null,
	poolname: null,
	
	c1/*confirm*/: function() {
		var me = this,
			tpwd = me.down("[name=tpwd]"),
			nvalue = tpwd.getValue();
		
		if (!nvalue)
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('T_DB_BLANK'), null, me, null, null, 1, "error");
			return;
		}
		
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: me.poolname, pwd: nvalue}, "address;pwd"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'standard'})
	        }, panel, panel.rs_c1/*confirm*/);
		req._l/*request*/();
	},
	
	rs_c1/*confirm*/: function(xdoc) {
		var me = this,
			tpwd = me.down("[name=tpwd]"),
			nvalue = tpwd.getValue();
		
		if (me.callback)
		{
			me.callback.execute(nvalue);
			me.close();
		}
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1('T_DB_PWD');
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
			    {
			    	xtype: "form",
			    	layout: "anchor",
			    	defaults: {
						anchor: "100%"
					},
			    	items: [
			    	    {
			    	    	xtype: "textfield",
							fieldLabel: "Password",
							inputType: "password",
							enableKeyEvents: true,
							name: "tpwd",
							allowBlank: false,
							listeners: {
			    	    		keyup: function(item, e, eOpts) {
			    	    			if (e.keyCode == 13)
			    	    			{
			    	    				me.c1/*confirm*/.call(me);
			    	    			}
			    	    		}
			    	    	}
			    	    }
			    	]
			    }
			],
			buttons:[
			    {
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.c1/*confirm*/();
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
		IG$/*mainapp*/._Ice/*userDbPassword*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.Idm/*dataManager*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	closable: true,
	hideMode: 'offsets',
	"layout": "fit",
	bodyPadding: 0,
	iconCls: "icon-ing-docdef",
	
	_b1/*buildLayout*/: function() {
		var me = this,
			_m4 = me.down("[name=_m4]"),
			_m4_el = _m4.body.dom,
			m_fileupload,
			fileupload,
			dropzone,
			d_progress,
			i;
			
		fileupload = $("#fileupload", _m4_el);
		dropzone = $("#dropzone", _m4_el);
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
	        },
	 
	        dropZone: dropzone
	    }).bind('fileuploadsubmit', function (e, data) {
	    });
	    
	    fileupload.fileupload("option", "url", ig$/*appoption*/.servlet);
	},
	
	_l1/*loadDataSet*/: function(dp) {
		var me = this,
			_m5 = me.down("[name=_m5]"),
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
				
				// me._l2/*loadFileSet*/.call(me, k, tdata);
			}
		}
		
		_m5.store.loadData(dp);
	},
	
	_l2/*loadFileSet*/: function(kobj, tdata) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			delimiter = null,
			regfile = null,
			file_encoding = null;
			
		me.setLoading(true, true);
				
		// store content in separate uid
		req.init(me, 
			{
				ack: "27",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({
					uid: kobj.uid, 
					delimiter: delimiter, 
					uploadmode: "F", 
					deletemode: "F", 
					regfile: regfile, 
					rowlimit: 100,
					file_encoding: file_encoding
				}, "uid;delimiter;uploadmode;deletemode;regfile;file_encoding;rowlimit"),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "previewdatacontent"})
			}, me, function(xdoc) {
				var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
					tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
					i, j,
					td = $("td", tdata),
					sheets = [],
					sinfo,
					hd, hds, ht,
					sc;
				
				td.empty();
				
				for (i=0; i < tnodes.length; i++)
				{
					sinfo = $("<div class='sh-info'><div class='sh-summary'></div><div class='sh-columns'></div></div>").appendTo(td);
					
					sc = $(".sh-columns", sinfo);
					
					hd = IG$/*mainapp*/._I18/*XGetNode*/(tnodes[i], "Header");
					
					hds = IG$/*mainapp*/._I26/*getChildNodes*/(hd);
					
					ht = "";
					
					for (j=0; j < hds.length; j++)
					{
						ht += (j > 0 ? ", " : "") + IG$/*mainapp*/._I1b/*XGetAttr*/(hds[j], "name");
					}
					
					sc.text(ht);
				}
			}
		);
		
		req._l/*request*/();
	},
	
	_l3/*loadTables*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		me.setLoading(true, true);
		
		req.init(me, 
			{
				ack: "11",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}, ""),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "ftables"})
			}, me, function(xdoc) {
				var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
					m1 = me.down("[name=m1]"),
					dp = [],
					p,
					i;
				
				if (tnodes)
				{
					for (i=0; i < tnodes.length; i++)
					{
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						dp.push(p);
					}
				}
				
				m1.store.loadData(dp);
			}
		);
		
		req._l/*request*/();
	},
	
	_l4/*loadColumnInfo*/: function(rec) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			prop = {
				uid: rec.get("uid"),
				option: "StoredContent"
			};
		
		me._sb1 = rec;
		
		req.init(me, 
			{
		        ack: "25",
		        payload: IG$/*mainapp*/._I2d/*getItemAddress*/(prop, "uid;option"),
		        mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: prop.option})
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
					m3 = me.down("[name=m3]"),
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
				
				me._ltb = {
					item: IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode),
					fields: dp
				};
				
				m3.store.loadData(dp);
				_mt.setValue(tcol.join("\t"));
				me._l6/*loadHistory*/(prop.uid);
		    }, false);
		req._l/*request*/();
	},
	
	_l6/*loadHistory*/: function(uid) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
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
				
				m2.store.loadData(dp);
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
				if (me._sb1)
				{
					me._l4/*loadColumnInfo*/(me._sb1);
				}
			}
		);
		
		req._l/*request*/();
	},
	
	_l7/*loadFileToTable*/: function(rec) {
		var me = this,
			_ltb = me._ltb,
			_m5 = me.down("[name=_m5]"),
			_m5_sel = _m5.getSelectionModel().selected,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			delimiter = null,
			regfile = null,
			file_encoding = null,
			fuid = [],
			i;
			
		me.setLoading(true, true);
		
		if (rec)
		{
			fuid.push(rec.get("uid"));
		}
		else
		{
			for (i=0; i < _m5_sel.length; i++)
			{
				fuid.push(_m5_sel.items[i].get("uid"));
			}
		}
		
		if (fuid.length == 0)
			return;
				
		// store content in separate uid
		req.init(me, 
			{
				ack: "27",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({
					tuid: _ltb.item.uid,
					uid: fuid.join(";")
				}, "uid;tuid"),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "loaddatacontent"})
			}, me, function(xdoc) {
				_m5.store.loadData([]);
				
				if (me._sb1)
				{
					me._l4/*loadColumnInfo*/(me._sb1);
				}
			}
		);
		
		req._l/*request*/();
	},

	initComponent: function() {
		var me = this;
		
		$s.apply(me, {
			layout: "border",
			tbar: [
				{
					iconCls: 'icon-refresh',
					tooltip: "Refresh",
					handler: function() {
						var me = this;
						me._l3/*loadTables*/.call(me);
					},
					scope: this
				}
			],
			items: [
				{
					xtype: "gridpanel",
					name: "m1",
					title: "Table List",
					region: "center",
					flex: 1,
					store: {
						xtype: "store",
						fields: [
							"type", "name", "uid"
						]
					},
					columns: [
						{
							text: "Type",
							dataIndex: "type",
							width: 80
						},
						{
							text: "Name",
							dataIndex: "name",
							tdCls: "igc-td-link",
							flex: 1
						},
						{
							xtype: "actioncolumn",
							width: 30,
							items: [
								{
									iconCls: "icon-grid-config",
									tooltip: "Config item",
									handler: function (grid, rowIndex, colIndex) {
										var me = this,
											rec = grid.store.getAt(rowIndex);
											
										me._l4/*loadColumnInfo*/.call(me, rec);
									},
									scope: this
								}
							]
						}
					],
					listeners: {
						cellclick: function(tobj, td, cellIndex, rec, tr, rowIndex, e, eOpts) {
							var me = this;
							
							if (cellIndex == 1)
							{
								me._l4/*loadColumnInfo*/.call(me, rec);
							}
						},
						scope: this
					}
				},
				{
					xtype: "panel",
					region: "south",
					flex: 1,
					flex: 1,
					layout: {
						type: "hbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "panel",
							flex: 1,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "gridpanel",
									title: "Uploaded File",
									flex: 1,
									name: "_m5",
									store: {
										fields: ["filename", "uid"]
									},
									selType: "checkboxmodel",
									selModel: {
										mode: "MULTI"
									},
									tbar: [
										{
											iconCls: 'icon-refresh',
											tooltip: "Load File",
											handler: function() {
												var me = this;
												me._l7/*loadFileToTable*/();
											},
											scope: this
										}	
									],
									columns: [
										{
											text: "Name",
											flex: 1,
											dataIndex: "filename",
											tdCls: "igc-td-link"
										},
										{
											xtype: "actioncolumn",
											width: 30,
											items: [
												{
													iconCls: "icon-grid-config",
													tooltip: "Config item",
													handler: function (grid, rowIndex, colIndex) {
														var me = this,
															rec = grid.store.getAt(rowIndex);
															
														me._l7/*loadFileToTable*/.call(me, rec);
													},
													scope: this
												}
											]
										}
									]
								},
								{
									html: "<div class='igc-o-dzone' id='_tb_f'>"
										+ "<input type='file' id='fileupload' name='files[]' data-url='upload' multiple></input>"
										+ "<div class='filedropzone fade well' id='dropzone'>Drop files here</div>"
										+ "<div class='file-progress' id='d_progress'><div class='bar' style='width: 0%;'></div></div>"
										+ "</div>",
									name: "_m4",
									height: 150
								}
							]
						},
						
						{
							xtype: "gridpanel",
							title: "File History",
							name: "m2",
							flex: 1,
							store: {
								xtype: "store",
								fields: [
									"tuid", "cdate", "mdate", "cdate_user", "mdate_user", "cname", "uname", "fname", "uid", "type", "rowcount"
								]
							},
							columns: [
								{
									text: "Name",
									dataIndex: "fname",
									flex: 1
								},
								{
									text: "Updated",
									dataIndex: "mdate_user",
									width: 150
								},
								{
									text: "Rows",
									dataIndex: "rowcount",
									width: 80
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
												me.d1/*deleteHistory*/.call(me, rec, grid);
											}
										}
									]
								}
							]
						},
								
						
						{
							xtype: "panel",
							title: "Column Fields",
							flex: 1,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "gridpanel",
									name: "m3",
									flex: 1,
									store: {
										xtype: "store",
										fields: [
											"seq", "name", "datatype", "datasize", "alias", "decimaldigits", "iskey", "nodepath", "tablename", "type"
										]
									},
									columns: [
										{
											text: "No",
											dataIndex: "seq",
											width: 40
										},
										{
											text: "Key",
											dataIndex: "iskey",
											width: 40
										},
										{
											text: "Name",
											dataIndex: "name",
											minWidth: 120,
											flex: 1
										},
										{
											text: "DataType",
											dataIndex: "datatype",
											width: 80
										},
										{
											text: "Size",
											width: 60,
											dataIndex: "datasize"
										}
									]
								},
								{
									xtype: "textarea",
									fieldLabel: "Field Template",
									name: "_mt",
									height: 100
								}
							]
						}
					]
				}
			]
		});

		IG$/*mainapp*/.Idm/*dataManager*/.superclass.initComponent.call(this);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj._b1/*buildLayout*/.call(tobj);
			tobj._l3/*loadTables*/.call(tobj);
		}
	}
});

IG$/*mainapp*/._Icb/*userDutyMgr*/ = $s.extend($s.window, {
	modal: true,
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 500,
	autoHeight: true,
	bodyPadding: 10,
	bodyStyle: {
		background: "#ffffff"
	},
	
	callback: null,
	sel: null,
		
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	mm1/*confirmDialog*/: function() {
		if (this.callback)
		{
			var gridduty_sel = this.down("[name=gridduty_sel]"),
				i,
				sel = []; // gridduty.getSelectionModel().getSelection();
				
			for (i=0; i < gridduty_sel.store.data.length; i++)
			{
				sel.push(gridduty_sel.store.data.items[i]);
			}
			this.callback.execute(sel);
		}
		this.close();
	},
	
	mm2/*loadDutyList*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/Auth"}, "address"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'select'})
	        }, panel, panel.rs_mm2/*loadDutyList*/, false);
		req._l/*request*/();
	},
	
	rs_mm2/*loadDutyList*/: function(xdoc) {
		var i,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			cnodes,
			duties = [], 
			duties_sel = [],
			rec,
			duty,
			gridduty = this.down("[name=gridduty]"),
			gridduty_sel = this.down("[name=gridduty_sel]"),
			sel = {};
			// smodel = gridduty.getSelectionModel();
		
		if (this.sel)
		{
			for (i=0; i < this.sel.length; i++)
			{
				sel[this.sel[i].sid] = this.sel[i];
			}
		}
		if (tnode)
		{
			cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < cnodes.length; i++)
			{
				duty = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[i]);
				if (sel[duty.sid])
				{
					duties_sel.push(duty);
				}
				else
				{
					duties.push(duty);
				}
			}
		}
		
		gridduty.store.loadData(duties);
		gridduty_sel.store.loadData(duties_sel);
//		
//		for (i=0; i < gridduty.store.data.items.length; i++)
//		{
//			rec = gridduty.store.data.items[i];
//			
//			if (sel[rec.get("sid")])
//			{
//				smodel.select(rec, true, true);
//			}
//		}
	},
	
//	mm3/*createDuty*/: function() {
//		var panel = this,
//			dlg = new IG$/*mainapp*/._I6e/*makeItem*/({
//			itemtype: "Auth",
//			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_mm3/*createDuty*/)
//		});
//		
//		dlg.show(panel);
//	},
//	
//	rs_mm3/*createDuty*/: function(xdoc) {
//		this.mm2/*loadDutyList*/();
//	},


	m1/*moveDuty*/: function(select) {
		var me = this,
			i,
			grd_source = me.down("[name=gridduty" + (select == false ? "_sel" : "") + "]"),
			grd_target = me.down("[name=gridduty" + (select == true ? "_sel" : "") + "]"),
			sel = grd_source.getSelectionModel().getSelection();
			
		if (sel.length > 0)
		{
			for (i=0; i < sel.length; i++)
			{
				grd_source.store.remove(sel[i]);
				grd_target.store.add(sel[i]);
			}
		}
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1("L_MGR_UD");
		
		var items = [
	        {
	        	xtype: "form",
	        	"layout": "anchor",
	        	defaults: {
	        		anchor: "100%"
	        	},
	        	border: 0,
	        	items: [
	        	    {
	        	    	xtype: "displayfield",
	        	    	value: IRm$/*resources*/.r1("L_UD_DESC")
	        	    },
	        	    {
	        	    	xtype: "panel",
	        	    	layout: {
	        	    		type: "hbox",
	        	    		align: "stretch"
	        	    	},
	        	    	items: [
			        	    {
			        	    	xtype: "gridpanel",
			        	    	name: "gridduty",
			        	    	flex: 1,
			        	    	height: 300,
			        	    	selType: "checkboxmodel",
			        	    	selModel: {
			        	    		checkSelector: ".x-grid-cell",
									mode: "MULTI"
								},
			        	    	multiSelect: true,
			        	    	store: {
			        	    		fields: [
			        	    			"name", "dutytype", "sid", "status", "type"
			        	    		]
			        	    	},
			        	    	columns: [
			        	    	    {
			        	    	    	header: IRm$/*resources*/.r1("B_NAME"),
			        	    	    	dataIndex: "name",
										flex: 1,
										sortable: true,
										hideable: false        	    	    	
			        	    	    },
			        	    	    {
			        	    	    	header: IRm$/*resources*/.r1("B_TYPE"),
			        	    	    	dataIndex: "type",
										flex: 1,
										sortable: true,
										hideable: false        	    	    	
			        	    	    }
			        	    	]
			        	    },
			        	    {
			        	    	xtype: "container",
			        	    	bodyPadding: "0 4 0 4",
			        	    	border: 0,
			        	    	layout: {
			        	    		type: "vbox",
			        	    		align: "stretch"
			        	    	},
			        	    	items: [
			        	    		{
			        	    			xtype: "container",
			        	    			flex: 1
			        	    		},
			        	    		{
			        	    			xtype: "button",
			        	    			text: ">>",
			        	    			handler: function() {
			        	    				this.m1/*moveDuty*/(true);
			        	    			},
			        	    			scope: this
			        	    		},
			        	    		{
			        	    			xtype: "button",
			        	    			text: "<<",
			        	    			handler: function() {
			        	    				this.m1/*moveDuty*/(false);
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
			        	    	xtype: "gridpanel",
			        	    	name: "gridduty_sel",
			        	    	flex: 1,
			        	    	height: 300,
			        	    	selType: "checkboxmodel",
			        	    	selModel: {
			        	    		checkSelector: ".x-grid-cell",
									mode: "MULTI"
								},
			        	    	multiSelect: true,
			        	    	store: {
			        	    		fields: [
			        	    			"name", "dutytype", "sid", "status", "type"
			        	    		]
			        	    	},
			        	    	columns: [
			        	    	    {
			        	    	    	header: IRm$/*resources*/.r1("B_NAME"),
			        	    	    	dataIndex: "name",
										flex: 1,
										sortable: true,
										hideable: false        	    	    	
			        	    	    },
			        	    	    {
			        	    	    	header: IRm$/*resources*/.r1("B_TYPE"),
			        	    	    	dataIndex: "type",
										flex: 1,
										sortable: true,
										hideable: false        	    	    	
			        	    	    }
			        	    	]
			        	    }
			       		]
			       	}
//	        	    {
//	        	    	xtype: "button",
//	        	    	text: "Create new duty",
//	        	    	handler: function() {
//	        	    		this.mm3/*createDuty*/();
//	        	    	},
//	        	    	scope: this,
//	        	    	width: 100
//	        	    }
	        	]
	        }
		];
		
		var buttons = [
		    {
				text: IRm$/*resources*/.r1('B_CONFIRM'),
				handler: function() {
					this.mm1/*confirmDialog*/();
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
		];
		
		$s.apply(this, {
			items: items,
			buttons: buttons
		});
		
		IG$/*mainapp*/._Icb/*userDutyMgr*/.superclass.initComponent.apply(this, arguments);
	},
	
	listeners: {
		afterrender: function(ui) {
			this.mm2/*loadDutyList*/();
		}
	}
});

IG$/*mainapp*/._Icc/*groupPrivSetting*/ = $s.extend($s.window, {
	title: "Group Privilege Setting",
	modal: true,
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 400,
	autoHeight: true,
	plain: true,
	bodyPadding: 10,
	bodyStyle: {
		background: "#ffffff"
	},
	
	callback: null,
		
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	mm1/*confirmDialog*/: function() {
		this.close();
	},
	
	mm2_/*loadPrivilege*/: function(gid) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: 28,
	            payload: {address: "/usergroup", gid: gid, action: "privilege"},
	            mbody: {option: 'standard'}
	        }, panel, panel.rs_mm2_/*loadPrivilege*/, false);
		req._l/*request*/();
	},
	
	rs_mm2_/*loadPrivilege*/: function(xdoc) {
	},
	
	mm2/*setGroupActive*/: function(status) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			groupname = this.groupname,
			gid = this.gid;
		
		req.init(panel, 
			{
	            ack: 28,
	            payload: {address: "/usergroup", action: status},
	            mbody: {gid: gid}
	        }, panel, panel.rs_mm2/*setGroupActive*/, false, [status]);
		req._l/*request*/();
	},
	
	rs_mm2/*setGroupActive*/: function(xdoc, param) {
		var me = this,
			status = param[0],
			ugroup = me.ugroup,
			btn_erase = me.down("[name=btn_erase]");
		
		switch (status)
		{
		case "activate":
			ugroup.set("status", "Active");
			ugroup.set("active", "1");
			btn_erase.setVisible(false);
			break;
		case "delete":
			ugroup.set("status", "Blocked");
			ugroup.set("active", "0");
			btn_erase.setVisible(true);
			break;
		case "erase":
			ugroup.remove();
			me.close();
			break;
		}
	},
	
	initComponent : function() {
		$s.apply(this, {
			items: [
				{
		        	xtype: "form",
		        	"layout": "anchor",
		        	defaults: {
		        		anchor: "100%"
		        	},
		        	border: 0,
		        	items: [
		        	    {
		        	    	xtype: "displayfield",
		        	    	value: "Check to allow each priviege."
		        	    },
		        	    {
		        	    	xtype: "textfield",
		        	    	readOnly: true,
		        	    	fieldLabel: "Group name",
		        	    	name: "groupname"
		        	    },
		        	    {
		        	    	xtype: "fieldset",
		        	    	title: "Options",
		        	    	collapsible: false,
		    	    		autoHeight: true,
		    	    		defaults: {
		    	    			labelWidth: 80,
		    	    			anchor: "100%",
		    	    			"layout": {
		    	    				type: "hbox",
		    	    				defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
		    	    			}
		    	    		},
		    	    		
		    	    		items: [
								{
									xtype: "checkbox",
									boxLabel: "Save data to file"
								},
								{
									xtype: "checkbox",
									boxLabel: "Add/edit user defined group"
								},
								{
									xtype: "checkbox",
									boxLabel: "Show chart"
								},
								{
									xtype: "checkbox",
									boxLabel: "Use dashboard"
								}
		    	    		]
		        	    },
		        	    {
		        	    	xtype: "fieldset",
		        	    	title: "Enable/Disable",
		        	    	name: "p_activate",
		        	    	hidden: false,
		        	    	layout: {
		        	    		type: "hbox",
		        	    		align: "stretch"
		        	    	},
		        	    	items: [
		        	    		{
		        	    			xtype: "button",
		        	    			iconCls: 'icon-toolbar-activate',
		        	    			flex: 1,
		        	    			text: "Activate",
		        	    			handler: function() {
		        	    				this.mm2/*setGroupActive*/("activate");
		        	    			},
		        	    			scope: this
		        	    		},
		        	    		{
		        	    			xtype: "container",
		        	    			width: 10
		        	    		},
		        	    		{
		        	    			xtype: "button",
		        	    			iconCls: 'icon-toolbar-deprivation',
		        	    			flex: 1,
		        	    			text: "Deprivate",
		        	    			handler: function() {
		        	    				this.mm2/*setGroupActive*/("delete");
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
					text: "Erase Group",
					name: "btn_erase",
					hidden: this.ugroup.get("active") == "1" ? true : false,
					handler: function() {
						this.mm2/*setGroupActive*/("erase");
					},
					scope: this
				},
				"->",
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.mm1/*confirmDialog*/();
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
					if (this.gid)
					{
						this.mm2_/*loadPrivilege*/(this.gid);
						var groupname = this.down("[name=groupname]");
						groupname.setValue(this.groupname || "");
					}
				}
			}
		});
		
		IG$/*mainapp*/._Icc/*groupPrivSetting*/.superclass.initComponent.apply(this, arguments);
	}
});


IG$/*mainapp*/._IcT/*TenantSetting*/ = $s.extend($s.window, {
	title: "Tenant Setting",
	modal: true,
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 400,
	autoHeight: true,
	plain: true,
	bodyPadding: 10,
	bodyStyle: {
		background: "#ffffff"
	},
	
	callback: null,
		
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	mm1/*confirmDialog*/: function() {
		this.close();
	},
		
	mm2/*setTenantActive*/: function(status) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			content,
			tenantname = this.down("[name=tenantname]"),
			gid = panel.gid,
			mts = panel.mts;
		
		content = "<smsg><tenant mts='" + mts.get("uid") + "'" + (status == "rename" && tenantname.getValue() ? " name='" + tenantname.getValue() + "'" : "") + " a1='" + this.down("[name=a1]").getValue() + "' a2='" + this.down("[name=a2]").getValue() + "'/></smsg>";
		
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/tenants/" + mts.get("name"), action: status}, "address;action"),
	            mbody: content
	        }, panel, function(xdoc, param) {
	        	if (status == "rename")
	        	{
	        		mts.set("a1", this.down("[name=a1]").getValue());
	        		mts.set("a2", this.down("[name=a2]").getValue());
	        		mts.set("name", tenantname.getValue());
	        	}
	        	panel.rs_mm2/*setTenantActive*/(xdoc, param);
	    	}, false, [status]);
		req._l/*request*/();
	},
	
	rs_mm2/*setTenantActive*/: function(xdoc, param) {
		var me = this,
			status = param[0],
			ugroup = me.mts,
			btn_erase = me.down("[name=btn_erase]");
		
		switch (status)
		{
		case "activate":
			ugroup.set("pstatname", "Active");
			ugroup.set("pstatus", "1");
			btn_erase.setVisible(false);
			break;
		case "delete":
			ugroup.set("pstatname", "Blocked");
			ugroup.set("pstatus", "0");
			btn_erase.setVisible(true);
			break;
		case "erase":
			ugroup.remove();
			me.close();
			break;
		case "rename":
			me.close();
			break;
		}
	},
	
	_l1/*loadTemplates*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel, 
			{
                ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "timezone"})
            }, panel, function(xdoc) {
            	var me = this,
					tnode,
					tnodes,
					i, dp_tmpl = [], dp_theme = [],
					p,
					a1 = me.down("[name=a1]"),
					a2 = me.down("[name=a2]");
					
				tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/app_tmpl");
				
				dp_tmpl.push({name: "Select", value: ""});
				if (tnode)
				{
					tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
					
					for (i=0; i < tnodes.length; i++)
					{
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						p.value = p.name;
						dp_tmpl.push(p);
					}
				}
				
				a1.store.loadData(dp_tmpl);
				a1.setValue(me.mts ? me.mts.get("a1") || "" : "");
				
				tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/themes");
				
				dp_theme.push({name: "Select", value: ""});
				if (tnode)
				{
					tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
					
					for (i=0; i < tnodes.length; i++)
					{
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						p.value = p.name;
						dp_theme.push(p);
					}
				}
				
				a2.store.loadData(dp_theme);
				a2.setValue(me.mts ? me.mts.get("a2") || "" : "");
            });
		req._l/*request*/();
	},
	
	initComponent : function() {
		$s.apply(this, {
			items: [
				{
		        	xtype: "form",
		        	"layout": "anchor",
		        	defaults: {
		        		anchor: "100%"
		        	},
		        	border: 0,
		        	items: [
		        	    {
		        	    	xtype: "textfield",
		        	    	readOnly: this.mts && this.mts.get("pstatus") == "A",
		        	    	fieldLabel: "Tenant name",
		        	    	name: "tenantname"
		        	    },
		        	    {
		        	    	xtype: "combobox",
		        	    	fieldLabel: "Templates",
		        	    	name: "a1",
		        	    	editable: false,
		        	    	queryMode: "local",
		        	    	valueField: "value",
		        	    	displayField: "name",
		        	    	store: {
		        	    		xtype: "store",
		        	    		fields: [
		        	    			"name", "value"
		        	    		]
		        	    	}
		        	    },
		        	    {
		        	    	xtype: "combobox",
		        	    	fieldLabel: "Themes",
		        	    	name: "a2",
		        	    	editable: false,
		        	    	queryMode: "local",
		        	    	valueField: "value",
		        	    	displayField: "name",
		        	    	store: {
		        	    		xtype: "store",
		        	    		fields: [
		        	    			"name", "value"
		        	    		]
		        	    	}
		        	    },
		        	    {
		        	    	xtype: "fieldset",
		        	    	title: "Enable/Disable",
		        	    	name: "p_activate",
		        	    	hidden: this.mts && this.mts.get("pstatus") == "A",
		        	    	layout: {
		        	    		type: "hbox",
		        	    		align: "stretch"
		        	    	},
		        	    	items: [
		        	    		{
		        	    			xtype: "button",
		        	    			iconCls: 'icon-toolbar-activate',
		        	    			flex: 1,
		        	    			text: "Activate",
		        	    			handler: function() {
		        	    				this.mm2/*setTenantActive*/("activate");
		        	    			},
		        	    			scope: this
		        	    		},
		        	    		{
		        	    			xtype: "container",
		        	    			width: 10
		        	    		},
		        	    		{
		        	    			xtype: "button",
		        	    			iconCls: 'icon-toolbar-deprivation',
		        	    			flex: 1,
		        	    			text: "Deprivate",
		        	    			handler: function() {
		        	    				this.mm2/*setTenantActive*/("delete");
		        	    			},
		        	    			scope: this
		        	    		}
		        	    	]
		        	    },
		        	    {
		        	    	xtype: "textfield",
		        	    	name: "turl",
		        	    	fieldLabel: "URL",
		        	    	readOnly: true
		        	    }
		        	]
		        }
			],
			buttons: [
				{
					text: "Erase Tenant",
					name: "btn_erase",
					hidden: this.mts.get("pstatus") == "1" || this.mts.get("pstatus") == "A" ? true : false,
					handler: function() {
						this.mm2/*setTenantActive*/("erase");
					},
					scope: this
				},
				"->",
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						var tenantname = this.down("[name=tenantname]");
						
						this.mm2/*setTenantActive*/("rename");
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
					var me = this;
					if (me.mts)
					{
						var tenantname = me.down("[name=tenantname]"),
							turl = me.down("[name=turl]"),
							uname = me.mts.get("name");
							
						uname = uname.split(" ");
						uname = uname.join("%20");
						tenantname.setValue(me.mts.get("name") || "");
						turl.setValue("http://hostname.com/ingecep/?lang=en_US&mts=" + uname);
						
						me._l1/*loadTemplates*/();
					}
				}
			}
		});
		
		IG$/*mainapp*/._IcT/*TenantSetting*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._Ica/*mgrusereditor*/ = $s.extend($s.window, {
	modal: true,
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 480,
	autoHeight: true,
	plain: true,
	bodyPadding: 10,
	bodyStyle: {
		background: "#ffffff"
	},
	
	callback: null,
	
	i$/*initapp*/: function() {
		var panel = this,
			groupcombo = panel.down("[name=pusergroup]");
			
		groupcombo.store.loadData(this.groupinfo);
		
		panel.u1/*buildCustomForm*/();
		panel.ld5/*updateUserDetail*/();
		
		panel._l1/*loadTemplates*/();
	},
	
	u1/*buildCustomForm*/: function() {
		var me = this,
			c_area = me.down("[name=c_area]"),
			uform = IG$/*mainapp*/.uform,
			i, uf, mf;
			
		for (i=0; i < uform.length; i++)
		{
			uf = uform[i];
			
			mf = {
				xtype: uf.type,
				fieldLabel: uf.displayname,
				name: uf.fieldname
			};
			
			c_area.add(mf);
		}
	},
	
	ld5/*updateUserDetail*/: function() {
		var p = this,
			u = p.userinfo,
			l = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/,
			puserid = p.down("[name=puserid]"),
			pusername = p.down("[name=pusername]"),
			puseremail = p.down("[name=puseremail]"),
			puserpasswd = p.down("[name=puserpasswd]"),
			pusergroup = p.down("[name=pusergroup]"),
			pupdatedate = p.down("[name=pupdatedate]"),
			updatedate = IRm$/*resources*/.r1("L_LAST_UPD"),
			pdutygrid = p.down("[name=pdutygrid]"),
			auth = (u && u.auth) ? u.auth : [],
			btnaddduty = p.down("[name=btnaddduty]"),
			fieldstatus = p.down("[name=fieldstatus]"),
			i, uf, ufname;

		btnaddduty.setVisible((u && l.userid == u.id) ? false : true);
		puserid.setReadOnly((u) ? true : false);
		puserid.setValue(u ? u.id || "" : "");
		pusername.setValue(u ? u.name || "" : "");
		puserpasswd.setValue(u ? "" : IG$/*mainapp*/._I45/*generateUniqueTest*/(10));
		puseremail.setValue(u ? u.email || "" : "");
		pusergroup.setValue(u ? u.gid || "" : (p.Ld3/*currentGroup*/ || ""));
		fieldstatus.setVisible(u ? true : false);
		updatedate = (u && u.updatedate) ? updatedate + u.updatedatefm : updatedate;
		pupdatedate.setValue(updatedate);
		pdutygrid.store.loadData(auth);
		
		if (IG$/*mainapp*/.uform)
		{
			for (i=0; i < IG$/*mainapp*/.uform.length; i++)
			{
				ufname = IG$/*mainapp*/.uform[i];
				
				uf = p.down("[name=" + ufname.fieldname + "]");
				
				if (uf)
				{
					uf.setValue(u ? u[ufname.fieldname] : "");
				}
			}
		}
	},
	
	ld6/*confirmChanges*/: function(cmd) {
		var me = this,
			purpose,
			address,
			content,
			iserror = false,
			p = this,
			l = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/, mduty,
			puserid = p.down("[name=puserid]"),
			pusername = p.down("[name=pusername]"),
			puseremail = p.down("[name=puseremail]"),
			puserpasswd = p.down("[name=puserpasswd]"),
			pusergroup = p.down("[name=pusergroup]"),
			pdutygrid = p.down("[name=pdutygrid]"),
			i, fname, fobj,
			pwd = puserpasswd.getValue(),
			isfailed = false,
			uf;
			
		if (cmd == "confirm")
		{
			if (!IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/)
			{
				var panel = this,
					req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(panel, 
					{
			            ack: "23",
			            payload: "<smsg></smsg>",
			            mbody: "<smsg></smsg>"
			        }, panel, function(xdoc) {
			        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			        		p1 = (tnode ? IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "p1") : null),
			        		p2 = (tnode ? IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "p2") : null);
			        	if (p1 && p2)
			        	{
			        		IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/ = p1;
			        		IG$/*mainapp*/._I3b/*rsaPpublicKeyExponent*/ = p2;
			        		this.ld6/*confirmChanges*/("confirm");
			        	}
			        }, null);
				req._l/*request*/();
				return;
			}
			purpose = "28";
			address = IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/user/" + puserid.getValue(), updatemode: "change"}, "address;updatemode");
			content = "<smsg><user";
			
			$.each([puserid, pusername, pusergroup], function(i, pobj) {
				pobj.clearInvalid();
				
				if (!pobj.getValue())
				{
					pobj.markInvalid("Required");
					isfailed = true;
				}
			});
			
			if (isfailed)
			{
				return;
			}
			
			if (pwd)
			{
				pwd = IG$/*mainapp*/._I3c/*encryptkey*/([pwd])[0];
			}
			
			content += IG$/*mainapp*/._I20/*XUpdateInfo*/({
				sid: (this.userinfo ? this.userinfo.sid : ""),
				wid: (this.userinfo ? this.userinfo.wid : ""),
				id: puserid.getValue(),
				name: pusername.getValue(),
				password: pwd,
				email: puseremail.getValue(),
				gid: pusergroup.getValue(),
				a1: this.down("[name=a1]").getValue()
			}, "sid;wid;id;name;password;email;gid;a1", "s") + "";
			
			if (IG$/*mainapp*/.uform)
			{
				for (i=0; i < IG$/*mainapp*/.uform.length; i++)
				{
					uf = IG$/*mainapp*/.uform[i];
					fname = uf.fieldname;
					fobj = me.down("[name=" + fname + "]");
					
					if (fobj)
					{
						if (uf.optional == "F")
						{
							fobj.clearInvalid();
							
							if (!fobj.getValue())
							{
								fobj.markInvalid("Required");
								
								return;
							}
						}
						content += " " + fname + "='" + fobj.getValue() + "'";
					}
				}
			}
			
			content += ">";
			
			for (i=0; i < pdutygrid.store.data.items.length; i++)
			{
				mduty = pdutygrid.store.data.items[i];
				
				content += "<auth" + IG$/*mainapp*/._I20/*XUpdateInfo*/({
					dutytype: mduty.get("dutytype"),
					name: mduty.get("name"),
					sid: mduty.get("sid"),
					status: mduty.get("status")
				}, "dutytype;name;sid;status") + "/>";
			}
			
			content += "</user></smsg>";
		}
		else if (cmd == "delete")
		{
			if (puserid.getValue() == l.userid)
			{
				IG$/*mainapp*/._I52/*ShowError*/("You cannot remove yourself.", p);
				return;
			}
			
			purpose = "28";
			address = IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/user/" + puserid.getValue(), updatemode: "delete"}, "address;updatemode");
			content = "<smsg><user sid='" + (this.userinfo ? this.userinfo.sid : "") + "'";
			content += ">";
			content += "</user></smsg>";
		}
		else
		{
			return;
		}
		
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		panel.setLoading(true);
		
		req.init(panel, 
			{
	            ack: purpose,
	            payload: address,
	            mbody: content
	        }, panel, panel.rs_ld6/*confirmChanges*/, null);
		req._l/*request*/();
	},
	
	rs_ld6/*confirmChanges*/: function(xdoc) {
		var panel = this;
		
		panel.setLoading(false);
		
		if (panel.callback)
		{
			panel.callback.execute();
		}
		
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SAVED'), null, null, 0, "success");
		
		panel.close();
	},
	
	mm2b/*setUserActive*/: function(user, status) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			content;
		
		if (status != "activate" && (user.name == "admin"))
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_NA'), null, null, 0, "error");
			return;
		}
		
		content = IG$/*mainapp*/._I2e/*getItemOption*/({option: "changestatus", status: status, uid: user.sid}, "option;status;uid");
		
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/user/" + user.name}, "address;action"),
	            mbody: content
	        }, panel, panel.rs_mm2b/*setUserActive*/, false, status);
		req._l/*request*/();
	},
	
	rs_mm2b/*setUserActive*/: function(xdoc, status) {
		if (this.drow)
		{
			this.drow.set("status", (status == "1" ? "Active" : "Blocked"));
		}
		
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var panel = this,
			user,
			dlg;
		
		switch (cmd)
		{
		case "cmd_activate_user":
			user = this.userinfo;
			if (user)
			{
				this.mm2b/*setUserActive*/(user, "1");
			}
			break;
		case "cmd_deprivate_user":
			user = this.userinfo;
			if (user)
			{
				this.mm2b/*setUserActive*/(user, "2");
			}
			break;
		case "cmd_add_duty":
			var dp = [],
				rec,
				pdutygrid = this.down("[name=pdutygrid]").store.data.items,
				i;
			
			for (i=0; i < pdutygrid.length; i++)
			{
				rec = pdutygrid[i];
				dp.push({
					dutytype: rec.get("dutytype"),
					name: rec.get("name"),
					sid: rec.get("sid"),
					type: rec.get("type"),
					status: rec.get("status")
				});
			}
			dlg = new IG$/*mainapp*/._Icb/*userDutyMgr*/({
				sel: dp,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_mm3/*addDuty*/)
			});
			dlg.show(panel);
			break;
		}
	},
	
	rs_mm3/*addDuty*/: function(sel) {
		var pdutygrid = this.down("[name=pdutygrid]"),
			dp = [],
			rec,
			i;
		
		for (i=0; i < sel.length; i++)
		{
			rec = sel[i];
			dp.push({
				dutytype: rec.get("dutytype"),
				name: rec.get("name"),
				sid: rec.get("sid"),
				type: rec.get("type"),
				status: rec.get("status")
			});
		}
		pdutygrid.store.loadData(dp);
	},
	
	_l1/*loadTemplates*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel, 
			{
                ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "timezone"})
            }, panel, function(xdoc) {
            	var me = this,
					tnode,
					tnodes,
					i, dp_tmpl = [],
					p,
					a1 = me.down("[name=a1]");
					
				tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/app_tmpl");
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				
				dp_tmpl.push({name: "Select", value: ""});
				
				for (i=0; i < tnodes.length; i++)
				{
					p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
					p.value = p.name;
					dp_tmpl.push(p);
				}
				
				a1.store.loadData(dp_tmpl);
				a1.setValue(me.userinfo ? me.userinfo.a1 || "" : "");
            });
		req._l/*request*/();
	},
	
	initComponent: function(){
		this.title = IRm$/*resources*/.r1("T_REG_USER");
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					"layout": "anchor",
					bodyPadding: 4,
					autoScroll: false,
					
					defaults: {
						anchor: "100%"
					},
					items: [
						{
							xtype: "textfield",
							fieldLabel: IRm$/*resources*/.r1("L_USERID"),
							name: "puserid"
						},
						{
							xtype: "textfield",
							fieldLabel: IRm$/*resources*/.r1("L_USERNAME"),
							name: "pusername"
						},
						{
							xtype: "textfield",
							fieldLabel: IRm$/*resources*/.r1("L_EMAIL"),
							name: "puseremail"
						},
						{
							xtype: "fieldcontainer",
							fieldLabel: IRm$/*resources*/.r1("L_INPUT_PASSWORD"),
							"layout": "hbox",
							items: [
								{
									xtype: "textfield",
									name: "puserpasswd",
									readOnly: false,
									flex: 1
								},
								{
									xtype: "button",
									name: "pgetpwd",
									text: "Generate",
									width: 70,
									handler: function() {
										var me = this,
											puserpasswd = me.down("[name=puserpasswd]"),
											temppwd = IG$/*mainapp*/._I45/*generateUniqueTest*/(10);
										
										puserpasswd.setValue(temppwd);
									},
									scope: this
								}
							]
						},
						{
							xtype: "combobox",
							fieldLabel: IRm$/*resources*/.r1("L_GROUP_NAME"),
							labelField: "name",
							valueField: "gid",
							name: "pusergroup",
							queryMode: 'local',
							displayField: 'name',
							valueField: 'gid',
							editable: false,
							autoSelect: true,
							store: {
								
								fields: [
								    "name", "gid"
								]
							}
						},
						{
							xtype: "container",
							name: "c_area",
							layout: {
								type: "vbox",
								align: "stretch"
							}
						},
						{
							xtype: "combobox",
							name: "a1",
							fieldLabel: IRm$/*resources*/.r1("L_APPL_TMPL"),
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
							xtype: "displayfield",
							value: IRm$/*resources*/.r1("L_LAST_UPD"),
							name: "pupdatedate"
						},
						{
							xtype: "fieldcontainer",
							fieldLabel: IRm$/*resources*/.r1("L_USER_DUTY"),
							"layout": "hbox",
							items: [
								{
									xtype: "gridpanel",
									fieldLabel: "User Duty",
									flex: 1,
									height: 160,
									hideLabel: true,
									name: "pdutygrid",
									store: {
										xtype: "store",
										fields: [
											"dutytype", "name", "sid", "status"
										]
									},
									columns: [
										{
											header: IRm$/*resources*/.r1("B_NAME"),
											flex: 1,
											sortable: false,
											hideable: false,
											dataIndex: "name"
										}
									]
								},
								{
									xtype: "button",
									iconCls: 'icon-toolbar-add',
						        	tooltip: "Add Duty",
						        	name: "btnaddduty",
						        	hidden: true,
						        	handler: function() {
						        		this._t$/*toolbarHandler*/('cmd_add_duty'); 
						        	},
						        	scope: this
								}
							]
						},
						{
							xtype: "fieldcontainer",
							fieldLabel: IRm$/*resources*/.r1("B_STATUS"),
							name: "fieldstatus",
							hidden: true,
							layout: "hbox",
							items: [
							    {
							    	xtype: "button",
							    	text: IRm$/*resources*/.r1("L_ACTIVATE"),
							    	name: "btnactuser",
							    	handler: function() {
							    		this._t$/*toolbarHandler*/('cmd_activate_user');
							    	},
							    	scope: this
							    },
							    {
							    	xtype: "button",
							    	text: IRm$/*resources*/.r1("L_DEPRIVATE"),
							    	name: "btndeprivuser",
							    	handler: function() {
							    		this._t$/*toolbarHandler*/('cmd_deprivate_user');
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
					text: IRm$/*resources*/.r1("L_E_DEL"),
					handler: function() {
						this.ld6/*confirmChanges*/("delete");
					},
					scope: this
				},
				"->",
				{
					xtype: "button",
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						this.ld6/*confirmChanges*/("confirm");
					},
					scope: this
				},
				{
					xtype: "button",
					text: IRm$/*resources*/.r1("B_CANCEL"),
					handler: function() {
						this.close();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function(tobj) {
					this.i$/*initapp*/();
				}
			}
		});
		
		IG$/*mainapp*/._Ica/*mgrusereditor*/.superclass.initComponent.call(this);
	}
});
IG$/*mainapp*/._I76/*mgrUser*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	scroll: false,
	closable: true,
	"layout": "border",
	
	userinfo: null,
	groupinfo: null,
	
	iconCls: "icon-group",
	
	Ld3/*currentGroup*/: null,
	
	_IFd/*init_f*/: function() {
		this.ld1/*loadCustomForm*/();
	},
	
	/***** start: server request *****/
	ld1/*loadCustomForm*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/userform"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "standard"})
	        }, panel, function(xdoc) {
				var me = this,
					tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
					p = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/,
					i,
					uform = [], uf;
					
				if (tnodes)
				{
					for (i=0; i < tnodes.length; i++)
					{
						uf = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						if (uf.type == "textinput")
						{
							uf.type = "textfield";
						}
						uform.push(uf);
					}
				}
				
				IG$/*mainapp*/.uform = uform;
				
				if (p.jS1/*hasDuty*/("admins", "A") == true)
				{
					me.down("[name=mtsgrd]").show();
				}
				
				me.ldM/*loadMTS*/();
				me.ldG/*loadDuties*/();
				me.ld2/*loadUserGroup*/("", null);
			}, false);
		req._l/*request*/();
	},
	
	ldM/*loadMTS*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/tenants", action: "get"}, "address;action"),
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
	    				switch (mts.pstatus)
	    				{
	    				case "A":
	    					mts.pstatname = "App";
	    					break;
	    				case "1":
	    					mts.pstatname = "Active";
	    					break;
	    				default:
	    					mts.pstatname = "Disabled";
	    					break;
	    				}
	    				mtslist.push(mts);
	    			}
	    		}
	    		
	    		this.down("[name=mtsgrd]").store.loadData(mtslist);
	        }, false);
		req._l/*request*/();
	},
	
	ldG/*loadDuties*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/Auth"}, "address"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "select"})
	        }, panel, function(xdoc) {
				var i,
					tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					cnodes,
					duties = [], 
					duty,
					gridduty = this.down("[name=gridduty]"),
					smodel = gridduty.getSelectionModel();
				
				if (tnode)
				{
					cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
					
					for (i=0; i < cnodes.length; i++)
					{
						duty = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[i]);
						duty.active = duty.status == "1" ? "Active" : "Disabled";
						duties.push(duty);
					}
				}
				
				gridduty.store.loadData(duties);
			}, false);
		req._l/*request*/();
	},
	
	mm3/*createDuty*/: function() {
		var panel = this,
			dlg = new IG$/*mainapp*/._I6e/*makeItem*/({
				itemtype: "Auth",
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_mm3/*createDuty*/)
			});
		
		dlg.show(panel);
	},
	
	rs_mm3/*createDuty*/: function(xdoc) {
		this.ldG/*loadDuties*/();
	},
	
	mm4/*createMTS*/: function() {
		var panel = this,
			dlg = new IG$/*mainapp*/._I6e/*makeItem*/({
			itemtype: "tenant",
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, function(xdoc) {
				this.ldM/*loadMTS*/();
			})
		});
		
		dlg.show(panel);
	},
	
	l1G/*loadDutyUsers*/: function(sid) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/user"}, "address"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "get", sid: sid})
	        }, panel, panel.rs_ld3/*loadUserList*/, null, true);
		req._l/*request*/();
	},
	
	ld2/*loadUserGroup*/: function(pid, unode) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			p = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/;
		if (p.jS1/*hasDuty*/("admins", "A") == false && p.jS1/*hasDuty*/("LocalAdmin", "A") == true)
		{
			pid = auth.gid;
		} 
		
		this.groupinfo = [];
		
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/usergroup", action: "get", pid: pid}, "address;action;pid"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "standard"})
	        }, panel, panel.rs_ld2/*loadUserGroup*/, null, [pid, unode]);
		req._l/*request*/();
	},
	
	rs_ld2/*loadUserGroup*/: function(xdoc, param) {
		var panel = this,
			pid = param[0],
			unode = param[1],
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			i,
			grouptree = this.down("[name=grouptree]"),
			// groupcombo = panel.down("[name=pusergroup]"),
			cnodes,
			gitem,
			sitem,
			citem;
		
		if (tnode)
		{
			gitem = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			this.groupinfo.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode));
			gitem.children = [];
			
			cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			this.ld2a/*parseUserGroup*/(cnodes, gitem, 1);
			
			if (unode == null)
			{
				grouptree.store.setRootNode(gitem);
				// groupcombo.store.loadData(this.groupinfo);
			}
		}
	},
	
	ld2a/*parseUserGroup*/: function(cnodes, parray, depth) {
		var i,
			sitem,
			citem,
			snodes, j;
		
		for (i=0; i < cnodes.length; i++)
		{
			sitem = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[i]);
			sitem.loadData = false;
			citem = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[i]);
			
			for (j=0; j < depth; j++)
			{
				citem.name = (j == 0 ? ". " : "  ") + citem.name;
			}
			this.groupinfo.push(citem);
			
			parray.children.push(sitem);
			
			switch (sitem.active)
			{
			case "1":
				sitem.status = "Active";
				break;
			case "2":
				sitem.status = "Blocked";
				break;
			default:
				sitem.status = "Error";
				break;
			}
			
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(cnodes[i]);
			
			if (snodes && snodes.length > 0)
			{
				sitem.children = [];
				this.ld2a/*parseUserGroup*/(snodes, sitem, depth + 1);
			}
		}
	},
	
	ld3/*loadUserList*/: function(gid) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/user"}, "address"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "get", gid: gid})
	        }, panel, panel.rs_ld3/*loadUserList*/, null);
		req._l/*request*/();
	},
	
	rs_ld3/*loadUserList*/: function(xdoc, isdutyuser) {
		var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			i, cnodes, 
			user,
			users = [],
			usergrid = this.down("[name=usergrid]");
	
		if (tnode)
		{
			cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < cnodes.length; i++)
			{
				user = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[i]);
				
				switch (user.active)
				{
				case "1":
					user.status = "Active";
					user.change = "Block user";
					break;
				case "3":
					user.status = "Email Valid";
					user.change = "Activate user";
					break;
				case "4":
					user.status = "Email Process";
					user.change = "Deprivate";
					break;
				default:
					user.status = "Blocked";
					user.change = "Activate";
					break;
				}
				
				users.push(user);
			}
		}
		
		usergrid.store.loadData(users);
	},
	
	ld4/*loadUserDetail*/: function(userid, record) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "28",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/user"}, "address"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "detail", uid: userid})
	        }, panel, function(xdoc, record) {
				var panel = this,
					tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
				
				if (tnode)
				{
					var userinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode),
						anode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "d"),
						anodes = IG$/*mainapp*/._I26/*getChildNodes*/(anode),
						i;
						// paneludetail = this.down("[name=paneludetail]");
						
					userinfo.auth = [];
					
					for (i=0; i < anodes.length; i++)
					{
						userinfo.auth.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(anodes[i]));
					}
					
					var dlg = new IG$/*mainapp*/._Ica/*mgrusereditor*/({
						groupinfo: this.groupinfo,
						userinfo: userinfo,
						drow: record,
						Ld3/*currentGroup*/: this.Ld3/*currentGroup*/,
						callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_um3/*userModify*/)
					});
					// this.userinfo = userinfo;
					
					// this.ld5/*updateUserDetail*/();
					// paneludetail.setVisible(true);
					IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
				}
			}, null, record);
		req._l/*request*/();
	},
	
	/***** end: server request *****/
	
	sKK/*getSelection*/: function() {
		var grouptree = this.down("[name=grouptree]"),
			selmodel = grouptree.getSelectionModel();
		
		if (selmodel && selmodel.selected && selmodel.selected.items && selmodel.selected.items.length > 0)
		{
			return selmodel.selected.items[0];
		}
		
		return null;
	},
	
	/***** start: toolbar related proc *****/
	_t$/*toolbarHandler*/: function(cmd) {
		var panel = this,
			ugroup,
			user,
			dlg;
		
		switch (cmd)
		{
		case "cmd_add_group":
			ugroup = panel.sKK/*getSelection*/();
			if (ugroup)
			{
				dlg = new IG$/*mainapp*/._I6e/*makeItem*/({
					itemtype: "Group",
					parentuid: ugroup.get("gid"),
					parentnodepath: "",
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_mm1/*addGroup*/, ugroup)
				});
				dlg.show(panel);
			}
			break;
		case "cmd_edit_group":
			ugroup = panel.sKK/*getSelection*/();
			if (ugroup)
			{
				if (!ugroup.isRoot())
				{
					dlg = new IG$/*mainapp*/._Icd/*makeItemEditor*/({
						uid: ugroup.get("gid"),
						itemname: ugroup.get("name"),
						itemtype: "Group",
						groupid: ugroup.get("groupid"),
						callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_mm1/*addGroup*/, ugroup)
					});
					dlg.show(panel);
				}
				else
				{
					IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("M_NOT_EDITABLE"), this);
				}
			}
			else
			{
				IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("M_SEL_ITEM"), this);
			}
			break;
		case "cmd_priv_group":
			ugroup = panel.sKK/*getSelection*/();
			if (ugroup)
			{
				if (!ugroup.isRoot())
				{
					dlg = new IG$/*mainapp*/._Icc/*groupPrivSetting*/({gid: ugroup.get("gid"), groupname: ugroup.get("name"), ugroup: ugroup});
					dlg.show(panel);
				}
				else
				{
					IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("M_NOT_EDITABLE"), this);
				}
			}
			else
			{
				IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("M_SEL_ITEM"), this);
			}
			break;
//		case "cmd_activate_group":
//			ugroup = panel.sKK/*getSelection*/();
//			if (ugroup)
//			{
//				this.mm2/*setGroupActive*/(ugroup, "activate");
//			}
//			break;
//		case "cmd_deactivate_group":
//			ugroup = panel.sKK/*getSelection*/();
//			if (ugroup)
//			{
//				this.mm2/*setGroupActive*/(ugroup, "delete");
//			}
//			break;
//		case "cmd_activate_user":
//			user = this.userinfo;
//			if (user)
//			{
//				this.mm2b/*setUserActive*/(user, "1");
//			}
//			break;
//		case "cmd_deprivate_user":
//			user = this.userinfo;
//			if (user)
//			{
//				this.mm2b/*setUserActive*/(user, "2");
//			}
//			break;
//		case "cmd_remove_group":
//			ugroup = panel.sKK/*getSelection*/();
//			if (ugroup)
//			{
//				this.mm2/*setGroupActive*/(ugroup, "erase");
//			}
//			break;
		case "cmd_add_user":
			ugroup = panel.sKK/*getSelection*/();
			// var paneludetail = panel.down("[name=paneludetail]");
			dlg = new IG$/*mainapp*/._Ica/*mgrusereditor*/({
				groupinfo: panel.groupinfo,
				userinfo: null,
				Ld3/*currentGroup*/: panel.Ld3/*currentGroup*/,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_um3/*userModify*/)
			});
			// panel.ld5/*updateUserDetail*/();
			// paneludetail.setVisible(true);
			IG$/*mainapp*/._I_5/*checkLogin*/(panel, dlg);
			break;
		case "cmd_sync_user":
			IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_SYNC_USER");
			break;
		case "cmd_new_duty":
			this.mm3/*createDuty*/();
			break;
		case "cmd_add_mts":
			this.mm4/*createMTS*/();
			break;
		case "cmd_edit_mts":
			var mtsgrd = this.down("[name=mtsgrd]"),
				sel = mtsgrd.getSelectionModel().selected;
				
			if (sel && sel.length > 0)
			{
//				if (sel.items[0].get("pstatus") == "A")
//				{
//					IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("M_NOT_EDITABLE"), this);
//				}
//				else
//				{
					dlg = new IG$/*mainapp*/._IcT/*TenantSetting*/({
						mts: sel.items[0],
						callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, function() {
							this.ldM/*loadMTS*/();
						})
					});
					// panel.ld5/*updateUserDetail*/();
					// paneludetail.setVisible(true);
					IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
//				}
			}
			else
			{
				IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("M_SEL_ITEM"), this);
			}
			break;
//		case "cmd_add_duty":
//			var dp = [],
//				rec,
//				pdutygrid = this.down("[name=pdutygrid]").store.data.items,
//				i;
//			
//			for (i=0; i < pdutygrid.length; i++)
//			{
//				rec = pdutygrid[i];
//				dp.push({
//					dutytype: rec.get("dutytype"),
//					name: rec.get("name"),
//					sid: rec.get("sid"),
//					type: rec.get("type"),
//					status: rec.get("status")
//				});
//			}
//			dlg = new IG$/*mainapp*/._Icb/*userDutyMgr*/({
//				sel: dp,
//				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_mm3/*addDuty*/)
//			});
//			dlg.show(panel);
//			break;
//		case "cmd_remove_duty":
//			break;
		}
	},
	
	rs_um3/*userModify*/: function() {
		var me = this;
		me.Ld3/*currentGroup*/ && me.ld3/*loadUserList*/(me.Ld3/*currentGroup*/);
	},
	
//	rs_mm3/*addDuty*/: function(sel) {
//		var pdutygrid = this.down("[name=pdutygrid]"),
//			dp = [],
//			i;
//		
//		for (i=0; i < sel.length; i++)
//		{
//			dp.push({
//				dutytype: sel[i].get("dutytype"),
//				name: sel[i].get("name"),
//				sid: sel[i].get("sid"),
//				type: sel[i].get("type"),
//				status: sel[i].get("status")
//			});
//		}
//		pdutygrid.store.loadData(dp);
//	},
	
	rs_mm1/*addGroup*/: function(xdoc, ugroup) {
		this.ld2/*loadUserGroup*/("", null);
	},
	
//	mm2/*setGroupActive*/: function(ugroup, status) {
//		var panel = this,
//			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
//			content;
//		
//		if (status != "activate" && (ugroup.get("name") == "AdminGroup" || ugroup.get("name") == "RootGroup"))
//		{
//			return;
//		}
//		
//		content = "<smsg><usergroup gid="" + ugroup.get("gid") + ""/></smsg>";
//		
//		req.init(panel, 
//			{
//	            ack: "28",
//	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/usergroup", action: status}, "address;action"),
//	            mbody: content
//	        }, panel, panel.rs_mm2/*setGroupActive*/, false, [ugroup, status]);
//		req._l/*request*/();
//	},
//	
//	rs_mm2/*setGroupActive*/: function(xdoc, param) {
//		var ugroup = param[0],
//			status = param[1];
//		
//		switch (status)
//		{
//		case "activate":
//			ugroup.set("status", "Active");
//			break;
//		case "delete":
//			ugroup.set("status", "Blocked");
//			break;
//		case "erase":
//			ugroup.remove();
//			break;
//		}
//	},
	
//	mm2b/*setUserActive*/: function(user, status) {
//		var panel = this,
//			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
//			content;
//		
//		if (status != "activate" && (user.name == "admin"))
//		{
//			return;
//		}
//		
//		content = IG$/*mainapp*/._I2e/*getItemOption*/({option: "changestatus", status: status, uid: user.sid}, "option;status;uid");
//		
//		req.init(panel, 
//			{
//	            ack: "28",
//	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/user/" + user.name}, "address;action"),
//	            mbody: content
//	        }, panel, panel.rs_mm2b/*setUserActive*/, false);
//		req._l/*request*/();
//	},
//	
//	rs_mm2b/*setUserActive*/: function(xdoc) {
//		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
//	},
	
	/***** end: toolbar related proc *****/
	
	/***** start: component drawing *****/
    initComponent: function(){
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					border: 0,
					layout: "accordion",
					region: "west",
					split: true,
					width: 240,
					collapsible: false,
					hideHeaders: true,
					items: [
						{
							xtype: "treepanel",
							border: 0,
							name: "grouptree",
							"layout": "fit",
							title: IRm$/*resources*/.r1("T_USER_GROUP"),
							rootVisible: true,
							store: {
								xtype: "store",
								fields: [
									"name", "active", "description", "gid", "updatedate", "loadData", "status", "groupid"
								],
								data: []
							},
							columns: [
							    {
							    	xtype: "treecolumn", //this is so we know which column will show the tree
							    	text: IRm$/*resources*/.r1("B_NAME"),
							    	flex: 1,
							    	sortable: false,
							    	dataIndex: "name"
							    },
							    {
							    	text: "GroupID",
							    	width: 60,
							    	sortable: false,
							    	dataIndex: "groupid"
							    },
							    {
							    	text: IRm$/*resources*/.r1("B_STATUS"),
							    	width: 60,
							    	sortable: false,
									dataIndex: "status"
							    }
							],
							dockedItems: [
							    {
							    	xtype: "toolbar",
							    	dock: "top",
							    	items: [
							    	    {
							    	    	iconCls: "icon-toolbar-add",
							    	    	text: IRm$/*resources*/.r1("L_ADD_GROUP"),
							    	    	tooltip: "Add",
							    	    	handler: function() {
							    	    		this._t$/*toolbarHandler*/("cmd_add_group"); 
							    	    	},
							    	    	scope: this
							    	    },
							    	    {
							    	    	iconCls: "icon-toolbar-edit",
							    	    	tooltip: IRm$/*resources*/.r1("L_EDIT"),
							    	    	handler: function() {
							    	    		this._t$/*toolbarHandler*/("cmd_edit_group"); 
							    	    	},
							    	    	scope: this
							    	    },
							    	    {
							    	    	iconCls: "icon-toolbar-grouppriv",
							    	    	tooltip: IRm$/*resources*/.r1("L_PRIVILEGE"),
							    	    	handler: function() {
							    	    		this._t$/*toolbarHandler*/("cmd_priv_group"); 
							    	    	},
							    	    	scope: this
							    	    }
							    	    // ,
				//			    	    {
				//			    	    	iconCls: "icon-toolbar-activate",
				//			    	    	tooltip: "Activate",
				//			    	    	handler: function() {
				//			    	    		this._t$/*toolbarHandler*/("cmd_activate_group"); 
				//			    	    	},
				//			    	    	scope: this
				//			    	    },
				//			    	    {
				//			    	    	iconCls: "icon-toolbar-deprivation",
				//			    	    	tooltip: "Deprivation",
				//			    	    	handler: function() {
				//			    	    		this._t$/*toolbarHandler*/("cmd_deactivate_group"); 
				//			    	    	},
				//			    	    	scope: this
				//			    	    },
				//			    	    {
				//			    	    	iconCls: "icon-toolbar-remove",
				//			    	    	tooltip: "Remove",
				//			    	    	handler: function() {
				//			    	    		this._t$/*toolbarHandler*/("cmd_remove_group"); 
				//			    	    	},
				//			    	    	scope: this
				//			    	    }
							    	]
							    }
							],
							listeners: {
								itemclick: function(view, record, item, index, e, eOpts) {
									var gid = record.get("gid");
									this.Ld3/*currentGroup*/ = gid;
									this.ld3/*loadUserList*/(gid);
								},
								beforeitemexpand: function(node, eOpts) {
									if (node.hasChildNodes() == false && node.get("loadData") == false)
									{
										// var pid = node.get("gid");
										// this.ld2/*loadUserGroup*/(pid, node);
									}
								},
								scope: this
							}
						},
						{
							xtype: "gridpanel",
							title: IRm$/*resources*/.r1("T_DUTY_LIST"),
							name: "gridduty",
							hideHeaders: true,
							layout: "fit",
							border: 0,
							store: {
								xtype: "store",
								fields: [
									"sid", "name", "dutytype", "status", "type", "active"
								]
							},
							tbar: [
								{
									iconCls: "icon-toolbar-add",
									text: IRm$/*resources*/.r1("L_ADD_DUTY"),
									tooltip: "Add duty",
									handler: function() {
										this._t$/*toolbarHandler*/("cmd_new_duty"); 
									},
									scope: this
								},
								{
									iconCls: "icon-toolbar-remove",
									tooltip: "Remove",
									name: "btn_r_duty",
									hidden: true,
									handler: function() {
										this._t$/*toolbarHandler*/("cmd_remove_duty"); 
									},
									scope: this
								},
								{
									xtype: "button",
						       		text: IRm$/*resources*/.r1("B_SHOW_ALL"),
						       		menu: {
						       			xtype: "menu",
						       			items: [
						       				{
						       					text: IRm$/*resources*/.r1("B_SHOW_ALL"),
						       					handler: function() {
						       						var grd = this.down("[name=gridduty]");
						       						grd.store.clearFilter();
						       					},
						       					scope: this
						       				},
						       				{
						       					text: "Pre defined",
						       					handler: function() {
						       						var grd = this.down("[name=gridduty]");
						       						grd.store.filter("dutytype", "A");
						       					},
						       					scope: this
						       				},
						       				{
						       					text: "Custom duty",
						       					handler: function() {
						       						var grd = this.down("[name=gridduty]");
						       						grd.store.filter("dutytype", "C");
						       					},
						       					scope: this
						       				},
						       				{
						       					text: "Group duty",
						       					handler: function() {
						       						var grd = this.down("[name=gridduty]");
						       						grd.store.filter("dutytype", "G");
						       					},
						       					scope: this
						       				},
						       				{
						       					text: "User duty",
						       					handler: function() {
						       						var grd = this.down("[name=gridduty]");
						       						grd.store.filter("dutytype", "U");
						       					},
						       					scope: this
						       				}
						       			]
						       		}
								}
							],
							columns: [
								{
									xtype: "gridcolumn",
									text: "Duty name",
									dataIndex: "name",
									flex: 1
								},
								{
									xtype: "gridcolumn",
									text: IRm$/*resources*/.r1("B_STATUS"),
									dataIndex: "active",
									width: 50
								}
							],
							listeners: {
								cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
									if (record.get("sid"))
									{
										var dutytype = record.get("dutytype"),
											type = record.get("type"),
											btn_r_duty = this.down("[name=btn_r_duty]");
										
										btn_r_duty.setVisible(false);
										
										if (type != "PreDefined")
										{
											btn_r_duty.setVisible(true);
										}
										
										this.l1G/*loadDutyUsers*/(record.get("sid"));
									}
								},
								scope: this
							}
						},
						{
					    	xtype: "gridpanel",
					    	border: 0,
					    	title: IRm$/*resources*/.r1("T_M_TENANT"),
					    	name: "mtsgrd",
					    	hidden: true,
					    	hideHeaders: true,
					    	store: {
					    		xtype: "store",
					    		fields: [
					    		    "name", "pstatus", "uid", "pstatname", "a1", "a2"
					    		]
					    	},
					    	columns: [
					    	    {
					    	    	text: IRm$/*resources*/.r1("B_NAME"),
					    	    	dataIndex: "name",
					    	    	flex: 1
					    	    },
					    	    {
					    	    	text: IRm$/*resources*/.r1("B_STATUS"),
					    	    	width: 60,
					    	    	dataIndex: "pstatname"
					    	    }
					    	],
					    	dockedItems: [
							    {
							    	xtype: "toolbar",
							    	dock: "top",
							    	items: [
							    	    {
							    	    	iconCls: "icon-toolbar-add",
							    	    	text: IRm$/*resources*/.r1("L_ADD_TENANT"),
							    	    	tooltip: "Add",
							    	    	handler: function() {
							    	    		this._t$/*toolbarHandler*/("cmd_add_mts"); 
							    	    	},
							    	    	scope: this
							    	    },
							    	    {
									    	iconCls: "icon-toolbar-edit",
							    	    	tooltip: IRm$/*resources*/.r1("L_EDIT"),
							    	    	handler: function() {
							    	    		this._t$/*toolbarHandler*/("cmd_edit_mts"); 
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
					region: "center",
					"layout": "fit",
					bodyPadding: 2,
					items: [
						{
							xtype: "panel",
							flex: 1,
							border: false,
							"layout": { 
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "gridpanel",
									title: "Users",
									name: "usergrid",
									border: 0,
									flex: 1,
									store: {
										xtype: "store",
										fields: [
											"name", "active", "gid", "groupname", "id", "sid", "updatedate", "status", "email"
										]
									},
									columns: [
										{
											text: "ID",
											flex: 1,
											sortable: true,
											hideable: false,
											dataIndex: "id"
										},
										{
											text: IRm$/*resources*/.r1("B_NAME"),
											flex: 1,
											sortable: true,
											hideable: false,
											dataIndex: "name"
										},
										{
											text: IRm$/*resources*/.r1("L_GROUP_NAME"),
											flex: 1,
											sortable: true,
											hideable: false,
											dataIndex: "groupname"
										},
										{
											text: "Email",
											flex: 1,
											sortable: true,
											hideable: false,
											dataIndex: "email"
										},
										{
											text: IRm$/*resources*/.r1("B_STATUS"),
											flex: 1,
											sortable: true,
											hideable: false,
											dataIndex: "status"
										}
									],
									listeners: {
										itemclick: function(view, record, item, index, e, eOpts) {
											var sid = record.get("sid");
											this.ld4/*loadUserDetail*/(sid, record);
										},
										scope: this
									},
									tbar: [
								       	{
								        	text: IRm$/*resources*/.r1("L_ADD_USER"),
								        	iconCls: "icon-toolbar-add",
								        	handler: function() {
								        		this._t$/*toolbarHandler*/("cmd_add_user"); 
								        	},
								        	scope: this
								       	},
								       	{
								       		xtype: "button",
								       		name: "t_1",
								       		text: IRm$/*resources*/.r1("B_SHOW_ALL"),
								       		menu: {
								       			xtype: "menu",
								       			items: [
								       				{
								       					text: IRm$/*resources*/.r1("B_SHOW_ALL"),
								       					handler: function() {
								       						var me = this,
								       							grd = me.down("[name=usergrid]");
						       								grd.store.clearFilter();
						       								me.down("[name=t_1]").setText(IRm$/*resources*/.r1("B_SHOW_ALL"));
								       					},
								       					scope: this
								       				},
								       				{
								       					text: IRm$/*resources*/.r1("L_A_USR"),
								       					handler: function() {
								       						var me = this,
								       							grd = me.down("[name=usergrid]");
						       								grd.store.filter("active", "1");
						       								me.down("[name=t_1]").setText(IRm$/*resources*/.r1("L_A_USR"));
								       					},
								       					scope: this
								       				},
								       				{
								       					text: IRm$/*resources*/.r1("L_B_USR"),
								       					handler: function() {
								       						var me = this,
								       							grd = me.down("[name=usergrid]");
								       							
						       								grd.store.filterBy(function(record, id){
															    if (record.get("active") != "1")
															    {
															      return true;
															    }    
															    return false;
															}, this);
															me.down("[name=t_1]").setText(IRm$/*resources*/.r1("L_B_USR"));
								       					},
								       					scope: this
								       				}
								       			]
								       		}
								       	},
								       	"->",
								       	{
								       		xtype: "button",
								       		text: "SyncUser",
								       		handler: function() {
								       			this._t$/*toolbarHandler*/("cmd_sync_user"); 
								       		},
								       		scope: this
								       	}
									]
								}
							]
						}
					]
				}
			],
			listeners: {
				afterrender: function() {
					this._IFd/*init_f*/();
				},
				scope: this
			}
		});
		
        IG$/*mainapp*/._I76/*mgrUser*/.superclass.initComponent.call(this);
    }
	/***** end: component drawing *****/
});
IG$/*mainapp*/._I76n/*sync_user*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	layout: "fit",
	iconCls: "icon-group",
	closable: true,
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this,
			mbody = null,
			req;
		
		switch (cmd)
		{
		case "cmd_save":
			IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("W_SYNC_SAVE"), function(dlg) {
				if (dlg == "yes")
				{
					me._3/*saveContent*/.call(me);
				}
			}, me, me);
			break;
		case "cmd_s_group":
			IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("W_SYNC_GRP"), function(dlg) {
				if (dlg == "yes")
				{
					me._3/*saveContent*/.call(me, "group");
				}
			}, me, me);
			break;
		case "cmd_s_user":
			IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("W_SYNC_USER"), function(dlg) {
				if (dlg == "yes")
				{
					me._3/*saveContent*/.call(me, "user");
				}
			}, me, me);
			break;
		}
	},
	
	_a/*loadPool*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		// me.setLoading(true);
		
		req.init(me, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'standard'})
	        }, me, function(xdoc) {
	        	var me = this,
					dp = [],
					i, cnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"), 
					snodes, p,
					isadmin = false;
				
				dp.push({name:"Select Database Instance", poolname:""}); 
				
				if (cnode)
				{
					snodes = IG$/*mainapp*/._I26/*getChildNodes*/(cnode);
					isadmin = IG$/*mainapp*/._I83/*dlgLogin*/.jS2/*isAdmin*/;
					
					for (i=0; i < snodes.length; i++)
					{
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
						if (isadmin == true || (isadmin == false && p.name.toUpperCase() != "IGCBASE"))
						{
							dp.push({
								name:p.disp, 
								poolname: p.name,
								uid: p.uid || "",
								isuserdb: (p.isuserdb == "T" ? true : false),
								savepwd: (p.isuserdb == "T" && p.savepwd == "F" ? false : true)
							});
						}
					}
				}
				
				me.down("[name=dsource]").store.loadData(dp);
				
				me._1/*loadApp*/();
	        }, false);
		req._l/*request*/();
	},
	
	_1/*loadApp*/: function() {
		var me = this,
			mtree,
			m_navi = this.down("[name=m_navi]"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: "/SYS_Config/syncuser"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: ""})
	        }, me, 
	        function(xdoc) {
	        	me._2/*loadContent*/(xdoc);
	        }, 
	        function(xdoc) {
	        	me._2/*loadContent*/(null);
//	        	var me = this,
//					r = true,
//					req,
//					errcode = IG$/*mainapp*/._I27/*getErrorCode*/(xdoc),
//					uid = "/SYS_Config/syncuser";
//				
//				if (errcode == "0x1400")
//				{
//					req = new IG$/*mainapp*/._I3e/*requestServer*/();
//					req.init(me, 
//						{
//				            ack: "31",
//				            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: uid, name: "syncuser", type: "PrivateContent"}),
//				            mbody: "<smsg></smsg>"
//				        }, me, function(xdoc) {
//				        	me._2/*loadContent*/(xdoc);
//				        });
//					req._l/*request*/();
//					r = false;
//				}
	        });
	    req.showerror = false;
		req._l/*request*/();
	},
	
	_2/*loadContent*/: function(xdoc) {
		var me = this,
			tnode = xdoc ? IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item") : null,
			snode;
		
		me.mobj = {
			grp: {},
			usr: {}
		};
		
		if (tnode)
		{
			me.mobj = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			me.mobj.grp = {};
			me.mobj.usr = {};
			snode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "grp");
			
			if (snode)
			{
				me.mobj.dsource = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "dsource");
				me.mobj.grp.eclear = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "eclear") == "T";
				me.mobj.grp.ename = IG$/*mainapp*/._I1a/*getSubNodeText*/(snode, "ename");
				me.mobj.grp.esql = IG$/*mainapp*/._I1a/*getSubNodeText*/(snode, "esql");
			}
			
			snode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "usr");
			
			if (snode)
			{
				me.mobj.usr.eclear = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "eclear") == "T";
				me.mobj.usr.ename = IG$/*mainapp*/._I1a/*getSubNodeText*/(snode, "ename");
				me.mobj.usr.esql = IG$/*mainapp*/._I1a/*getSubNodeText*/(snode, "esql");
			}
			
			me.down("[name=dsource]").setValue(me.mobj.dsource);
			me.down("[name=eclear_grp]").setValue(me.mobj.grp.eclear);
			me.down("[name=ename_grp]").setValue(me.mobj.grp.ename);
			me.down("[name=esql_grp]").setValue(me.mobj.grp.esql);
			me.down("[name=eclear_usr]").setValue(me.mobj.usr.eclear);
			me.down("[name=ename_usr]").setValue(me.mobj.usr.ename);
			me.down("[name=esql_usr]").setValue(me.mobj.usr.esql);
		}
	},
	
	_3/*saveContent*/: function(aftercmd) {
		var me = this,
			mbody,
			req;
		
		if (me.mobj)
		{
			me.mobj.dsource = me.down("[name=dsource]").getValue();
			me.mobj.grp.eclear = me.down("[name=eclear_grp]").getValue();
			me.mobj.grp.ename = me.down("[name=ename_grp]").getValue();
			me.mobj.grp.esql = me.down("[name=esql_grp]").getValue();
			me.mobj.usr.eclear = me.down("[name=eclear_usr]").getValue();
			me.mobj.usr.ename = me.down("[name=ename_usr]").getValue();
			me.mobj.usr.esql = me.down("[name=esql_usr]").getValue();
			
			mbody = "<smsg><item uid='/SYS_Config/syncuser'>"
				+ "<grp dsource='" + (me.mobj.dsource || "") + "' eclear='" + (me.mobj.grp.eclear ? "T" : "F") + "'>"
				+ "<ename><![CDATA[" + (me.mobj.grp.ename || "") + "]]></ename>"
				+ "<esql><![CDATA[" + (me.mobj.grp.esql || "") + "]]></esql>"
				+ "</grp>"
				+ "<usr eclear='" + (me.mobj.usr.eclear ? "T" : "F") + "'>"
				+ "<ename><![CDATA[" + (me.mobj.usr.ename || "") + "]]></ename>"
				+ "<esql><![CDATA[" + (me.mobj.usr.esql || "") + "]]></esql>"
				+ "</usr>"
				+ "</item></smsg>";
			
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
			req.init(me, 
				{
		            ack: "31",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: "/SYS_Config/syncuser"}),
		            mbody: mbody
		        }, me, function(xdoc) {
		        	if (!aftercmd)
		        	{
		        		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
		        	}
		        	else
		        	{
		        		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		        		
		        		req.init(me, 
							{
					            ack: "74",
					            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: "/SYS_Config/syncuser", option: aftercmd}, "uid;option"),
					            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
					        }, me, function(xdoc) {
				        		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
					        }, false);
						req._l/*request*/();
		        	}
		        }, false);
			req._l/*request*/();
		}
	},
	
	initComponent: function(){
		var me = this;
		
		$s.apply(me, {
			title: IRm$/*resources*/.r1("T_SYNC_USER"),
			bodyPadding: 0,
			items: [
				{
					xtype: "panel",
					border: 0,
					bodyPadding: 10,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					tbar: [
						{
					    	iconCls: 'icon-toolbar-save',
					    	name: "t_save",
			            	tooltip: IRm$/*resources*/.r1('L_SAVE'),
			            	handler: function() {
					    		this._t$/*toolbarHandler*/('cmd_save'); 
					    	},
			            	scope: this
					    }
					],
					items: [
						{
							xtype: "fieldcontainer",
							layout: {
								type: "hbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "combobox",
									fieldLabel: "Data Source",
									name: "dsource",
									fieldLabel: "Database Instances",
			            	    	valueField: "poolname",
			            	    	displayField: "name",
			            	    	queryMode: "local",
			            	    	editable: false,
			            	    	store: {
			            	    		fields: [
			            	    			"name", "poolname", "uid", "isuserdb", "savepwd"
			            	    		]
			            	    	}
								}
							]
						},
						{
							xtype: "container",
							flex: 2,
							layout: {
								type: "hbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "fieldset",
									flex: 1,
									title: "Group Syncronization",
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "container",
											layout: {
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
															xtype: "container",
															flex: 1
														},
														{
															xtype: "button",
															text: "Execute",
															handler: function() {
																this._t$/*toolbarHandler*/('cmd_s_group'); 
															},
															scope: this
														}
													]
												},
												{
													xtype: "checkbox",
													name: "eclear_grp",
													boxLabel: "Clear Groups"
												},
												{
													xtype: "textarea",
													height: 40,
													name: "ename_grp",
													fieldLabel: "Exclude names"
												}
											]
										},
										{
											xtype: "container",
											layout: "fit",
											height: 30,
											items: [
												{
													xtype: "displayfield",
													fieldLabel: "Format",
													value: "SELECT dept_id, dept_name, parent_dept_id, description FROM DEPT"
												}
											]
										},
										{
											xtype: "textarea",
											flex: 1,
											fieldLabel: "Group SQL",
											name: "esql_grp"
										}
									]
								},
								{
									xtype: "container",
									width: 10
								},
								{
									xtype: "fieldset",
									flex: 1,
									title: "User Syncronization",
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "container",
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
															xtype: "container",
															flex: 1
														},
														{
															xtype: "button",
															text: "Execute",
															handler: function() {
																this._t$/*toolbarHandler*/('cmd_s_user'); 
															},
															scope: this
														}
													]
												},
												{
													xtype: "checkbox",
													name: "eclear_usr",
													boxLabel: "Clear Groups"
												},
												{
													xtype: "textarea",
													height: 40,
													name: "ename_usr",
													fieldLabel: "Exclude names"
												}
											]
										},
										{
											xtype: "container",
											layout: "fit",
											height: 30,
											items: [
												{
													xtype: "displayfield",
													fieldLabel: "Format",
													value: "SELECT userid, passwd, fullname, email, dept_id FROM USER"
												}
											]
										},
										{
											xtype: "textarea",
											flex: 2,
											name: "esql_usr",
											fieldLabel: "Group SQL"
										}
									]
								}
							]
						},
						{
							xtype: "fieldset",
							flex: 1,
							title: "Execution Logs",
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "gridpanel",
									flex: 1,
									store: {
										fields: ["d_seq"]
									},
									columns: [
										{
											dataIndex: "d_seq"
										}
									]
								}
							]
						}
					]
				}
			]
		});
		
		IG$/*mainapp*/._I76n/*sync_user*/.superclass.initComponent.call(this);
	},
	listeners: {
		afterrender: function(tobj) {
			this._a/*loadPool*/();
		}
	}
});
IG$/*mainapp*/._I6f/*helpManage*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	scroll: false,
	closable: true,
	
	iconCls: "icon-helpmgr",
	
	"layout":{
		type: 'hbox',
		align: 'stretch'
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this;
		switch (cmd)
		{
		case 'cmd_save':
			this.sk1/*saveContent*/();
			break;
		case 'cmd_saveas':
			break;
		case "cmd_refresh":
			var d_t = me.down("[name=d_t]");
			d_t._II5/*refreshTopNode*/.call(d_t);
			break;
		case 'cmd_locale_enUS':
			this.u7l/*updateCurrentLang*/();
			this.u6m/*clang*/ = 'en_US';
			this.u6l/*setCurrentDocument*/();
			break;
		case 'cmd_locale_koKR':
			this.u7l/*updateCurrentLang*/();
			this.u6m/*clang*/ = 'ko_KR';
			this.u6l/*setCurrentDocument*/();
			break;
		case 'cmd_preview':
			if (this.u5m/*helpcontent*/)
			{
				var helpdoc = this.down('[name=helpdoc]'),
					popup = new IG$/*mainapp*/._Id1/*helpWindow*/({
						uid: this.u5m/*helpcontent*/.i.uid,
						u6m/*clang*/: this.u6m/*clang*/,
						t: '',
						c: helpdoc.getValue()
					});
				
				IG$/*mainapp*/._I_5/*checkLogin*/(this, popup);
			}
			break;
		}
	},
	
	sk1/*saveContent*/: function() {
		if (this.u5m/*helpcontent*/)
		{
			this.u7l/*updateCurrentLang*/();
			var lang,
				c, item;
			
			c = "<smsg><item uid='" + this.u5m/*helpcontent*/.i.uid + "'>";
			for (lang in this.u5m/*helpcontent*/.c)
			{
				item = this.u5m/*helpcontent*/.c[lang];
				c += '<HelpContent language="' + item.lang + '">'
				  + '<Title><![CDATA['
				  + (item.t || '')
				  + ']]></Title>'
				  + '<Content><![CDATA['
				  + (item.c || '')
				  + ']]></Content></HelpContent>';
			}
			
			c += '</item></smsg>';
			
			var panel=this,
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
	    	req.init(panel, 
				{
		            ack: "31",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.u5m/*helpcontent*/.i.uid}),
		            mbody: c
		        }, panel, panel.rs_fV6/*saveContent*/, null);
			req._l/*request*/();
		}
	},
	
	rs_fV6/*saveContent*/: function() {
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SAVED'), null, null, 0, "success");
	},
	
	u5m/*helpcontent*/: null,
	u6m/*clang*/: 'en_US',
    		
	_IHc/*customClickFunc*/: function(data) {
		var typename = data.type.toLowerCase(),
			itemaddr = data.nodepath,
	        itemuid = data.uid,
	        req, panel=this;
		
		if (typename == 'help')
		{
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
		            ack: "16",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: itemuid}),
	                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "get"})
		        }, panel, panel.rs_u4x/*loadContent*/, null);
			req._l/*request*/();
		}
		
		return true;
	},
	
	rs_u4x/*loadContent*/: function(xdoc) {
		var helpdoc = this.down('[name=helpdoc]'),
			node,
			nodes,
			i, l, tnode, cnode, helpitem = this.down("[name=helpitem]");
			
		this.u5m/*helpcontent*/ = {i:{}, c:{}};
		node = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item');
		IG$/*mainapp*/._I1f/*XGetInfo*/(this.u5m/*helpcontent*/.i, node, 'uid;name;nodepath;memo', 's');
		helpitem.setText(this.u5m/*helpcontent*/.i.name + " (" + (this.u5m/*helpcontent*/.i.memo || "") + ")");
		
		nodes = IG$/*mainapp*/._I26/*getChildNodes*/(node);
		for (i=0; i < nodes.length; i++)
		{
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(nodes[i], 'Title');
			cnode = IG$/*mainapp*/._I18/*XGetNode*/(nodes[i], 'Content');
			
			l ={lang: IG$/*mainapp*/._I1b/*XGetAttr*/(nodes[i], 'language'), 
				t: IG$/*mainapp*/._I24/*getTextContent*/(tnode), 
				c: IG$/*mainapp*/._I24/*getTextContent*/(cnode)};
			this.u5m/*helpcontent*/.c[l.lang] = l;
		}
		
		if (!this.u5m/*helpcontent*/.c['en_US'])
		{
			this.u5m/*helpcontent*/.c['en_US'] = {lang: 'en_US', t: '', c: ''};
		}
		if (!this.u5m/*helpcontent*/.c['ko_KR'])
		{
			this.u5m/*helpcontent*/.c['ko_KR'] = {lang: 'ko_KR', t: '', c: ''};
		}
		
		this.u6l/*setCurrentDocument*/();
	},
	
	u6l/*setCurrentDocument*/: function() {
		if (this.u5m/*helpcontent*/ && this.u6m/*clang*/)
		{
			var i,
				doc = this.u5m/*helpcontent*/.c[this.u6m/*clang*/],
			
				helpdoc = this.down('[name=helpdoc]');
			
			helpdoc.setValue((doc && doc.c ? Base64.decode(doc.c) : ''));
		}
	},
	
	u7l/*updateCurrentLang*/: function() {
		var helpdoc = this.down('[name=helpdoc]'),
			doc = (this.u5m/*helpcontent*/) ? this.u5m/*helpcontent*/.c[this.u6m/*clang*/] : null;
			
		if (doc)
		{
			doc.c = Base64.encode(helpdoc.getValue());
		}
	},
	
    initComponent: function(){
    	
    	var tree = new IG$/*mainapp*/._Ic5/*naviTreeHelpDoc*/({
    		width: 180,
    		rootuid: '/SYS_Documents',
    		name: "d_t",
    		documentviewer: true,
    		root: {
    			text: 'Document',
    			name: 'Document',
    			itemtype: 'Workspace',
    			type: 'Workspace',
    			nodepath: '/SYS_Documents',
    			uid: '/SYS_Documents'
    		},
    		_IHb/*customEventOwner*/: this,
    		_IHc/*customClickFunc*/: this._IHc/*customClickFunc*/
    	});
    	
    	this.tbar = [
			{
				iconCls: 'icon-toolbar-save',
    			tooltip: IRm$/*resources*/.r1('L_SAVE_CONTENT'),
    			handler: function() {this._t$/*toolbarHandler*/('cmd_save'); },
    			scope: this
			},
			"-",
			{
				iconCls: 'icon-refresh',
    			tooltip: IRm$/*resources*/.r1('L_REFRESH'),
    			handler: function() {this._t$/*toolbarHandler*/('cmd_refresh'); },
    			scope: this
			},
			"-",
			{
				xtype: 'splitbutton',
				text: IRm$/*resources*/.r1('L_SELECT_LOCALE'),
				menu: [
	        	    {
	        	    	text: IRm$/*resources*/.r1('L_ENGLISH'),
	        	    	handler: function() {
	        	    		this._t$/*toolbarHandler*/('cmd_locale_enUS');
	        	    	},
	        	    	scope: this
	        	    },
	        	    {
	        	    	text: IRm$/*resources*/.r1('L_KOREAN'),
	        	    	handler: function() {
	        	    		this._t$/*toolbarHandler*/('cmd_locale_koKR');
	        	    	},
	        	    	scope: this
	        	    }
	        	]
			},
			{
				text: IRm$/*resources*/.r1('L_PREVIEW'),
    			tooltip: IRm$/*resources*/.r1('L_PREVIEW'),
    			handler: function() {
    				this._t$/*toolbarHandler*/('cmd_preview');
    			},
    			scope: this
			}, 
			"->",
			{
				text: "",
				name: "helpitem"
			}
		];
    	this.items = [
    		tree,
    		{
    			xtype: 'panel',
    			"layout": 'fit',
    			flex: 2,
				
				items: [
					{
						xtype: 'htmleditor',
						name: 'helpdoc'
					}
				]
    		}
    	];
    	
        IG$/*mainapp*/._I6f/*helpManage*/.superclass.initComponent.call(this);
    }
});
IG$/*mainapp*/.mA$_s/*makestyle*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 320,
	autoHeight: true,
	
	parentnodepath: null,
	
	callback: null,
	
	fV9/*processMakeStyleItem*/: function(){
		var panel = this,
			i,
			m_theme = panel.m_theme,
			fitemname = panel.down("[name=fitemname]"),
			fitemname_v = fitemname.getValue(),
			basetypeselect = panel.down("[name=basetypeselect]"),
			basetypeselect_v = basetypeselect.getValue();
			
		fitemname.clearInvalid();
		basetypeselect.clearInvalid();
		
		if (!fitemname_v)
		{
			fitemname.setInvalid("Required Field");
			return;
		}
			
		if (!m_theme && !basetypeselect_v)
			return;
		
		if (m_theme && panel.themes[fitemname_v])
		{
			fitemname.setInvalid("Duplicated");
			return;
		}
		else if (!m_theme)
		{
			for (i=0; i < panel.styleinfo.length; i++)
			{
				if (panel.styleinfo[i].name == fitemname_v)
				{
					basetypeselect.setInvalid("Duplicated");
					return false;
				}
			}
		}
		
		panel.callback.execute([fitemname_v, basetypeselect_v]);
		
		panel._IG0/*closeDlgProc*/();
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFd/*init_f*/: function() {
		var me = this,
			i,
			dp = [],
			m_theme = me.m_theme,
			basetypeselect = me.down("[name=basetypeselect]");
		
		if (!m_theme)
		{
			for (i=0; i < me.styleinfo.length; i++)
			{
				if (me.styleinfo[i].custom == false)
				{
					dp.push({name: me.styleinfo[i].name});
				}
			}
			
			basetypeselect.store.loadData(dp);
		}
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1('L_MAKESTYLE');
		var me = this;
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				    {
				    	html: IRm$/*resources*/.r1('L_MAKESTYLE'),
				    	flex: 1,
				    	border: 0
				    },
				    {
				    	xtype: "panel",
						region:'center',
						flex: 3,
				        border:true,
				        region:'center',
				        height: 120,
				        defaultType: 'textfield',
				        "layout": 'anchor',
				        defaults: {
				        	anchor: '100%'
				        },
				        items: [
					        {
					            fieldLabel: IRm$/*resources*/.r1('L_STYLENAME'),
					            labelWidth: 130,
					            name: 'fitemname',
					            value: '',
					            allowBlank: false,
					            blankText: 'Style name is required!',
					            enableKeyEvents: true,
					            listeners: {
					        		'keyup': function(item, e) {
					        			if (e.keyCode == 13)
					        			{
					        				this.fV9/*processMakeStyleItem*/.call(this);
					        			}
					        		},
					        		scope: this
					        	}
					        },
					        {
								xtype: "combobox",
								name: "basetypeselect",
								hidden: me.m_theme ? true : false,
								fieldLabel: "Inherit Style from",
								labelWidth: 130,
								store: {
									fields: [
										{name: 'name'}
									]
								},
					            displayField: "name",
					            valueField: "name",
					            editable: false,
					            queryMode: "local",
					            selectOnTab: false
							}
					    ],
					    listeners: {
					    	afterrender: function() {
					    		this._IFd/*init_f*/();
					    	},
					    	scope: this
					    }
				    }
				],
			buttons:[
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.fV9/*processMakeStyleItem*/();
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
		
		IG$/*mainapp*/.mA$_s/*makestyle*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._I78/*styleWizard*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	"layout": "border",
	closable: true,
	iconCls: "icon-style",
	_ILa/*reportoption*/: null,
	callback: null,

	Mb_1/*loadGlobalStyle*/: function() {
		var panel = this,
			p_h = panel.down("[name=p_h]").getLayout(),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		p_h.setActiveItem(0);
		
		req.init(panel, 
    			{
	                ack: "1",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "ReportStyle"}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
	            }, panel, panel.rs_Mb_1/*loadGlobalStyle*/, null);
	    req._l/*request*/();
	},
	
	rs_Mb_1/*loadGlobalStyle*/: function(xdoc) {
		var me = this,
			knode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item/themes'),
			knodes,
			tnode,
			t, tname,
			c_themes = me.down("[name=c_themes]"),
			stylelist = me.down("[name=stylelist]"),
			mnode, cs, cstree,
			unode, child, i, j, bs,
			c_cset,
			lthemes = [],
			theme,
			ltree = [],
			ltree_map = {},
			custom_items = {},
			scustom = {},
			scustom_a = [];
		
		me.themes = {};
		
		if (knode)
		{
			unode = {name: 'Default', leaf: false, expanded: true, children: []};
			ltree_map[unode.name] = unode;
			ltree.push(unode);
			
			unode = {name: 'Custom', leaf: false, expanded: true, children: []};
			ltree_map[unode.name] = unode;
			ltree.push(unode);
			
			knodes = IG$/*mainapp*/._I26/*getChildNodes*/(knode);
			for (t=0; t < knodes.length; t++)
			{
				tnode = knodes[t];
				tname = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "name");
				c_cset = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "c_cset");
				
				theme = {
					name: tname,
					c_cset: c_cset,
					gs_enable: IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "gs_enable") == "T",
					gs_col: Number(IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "gs_col")) || 0,
					gs_opa: IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "gs_opa") || 0.6,
					styleinfo: []
				};
				
				lthemes.push({
					name: theme.name, 
					value: theme.name
				});
				
				me.themes[theme.name] = theme;
				
				$.each([
				    {
				    	name: "Default",
				    	custom: false
				    },
				    {
				    	name: "Custom",
				    	custom: true
				    }
				], function(m, k) {
					var mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, k.name),
						i,
						unode,
						child,
						cs,
						cstree,
						key,
						kcs;
					
					if (mnode)
					{
						unode = ltree_map[k.name];
						child = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
						for (i=0; i < child.length; i++)
						{
							cs = new IG$/*mainapp*/._IF7/*clReportStyle*/(child[i], k.name.toLowerCase(), k.custom);
							cstree = {name: cs.name, leaf: true, custom: k.custom};
							theme.styleinfo.push(cs);
							
							key = k.name.toLowerCase() + "_" + cs.name;
							if (!custom_items[key])
							{
								unode.children.push(cstree);
								custom_items[key] = cstree;
								
								if (k.custom && !scustom[cs.name])
								{
									scustom[cs.name] = child[i];
									scustom_a.push({
										name: cs.name,
										kname: k.name,
										custom: k.custom,
										node: child[i]
									});
								}
							}
						}
					}
				});
			}
			
			$.each(me.themes, function(k, theme) {
				var i, j,
					cs, bs, bf = 0, mcs;
				
				for (i=0; i < scustom_a.length; i++)
				{
					cs = scustom_a[i];
					
					bf = 0;
					
					for (j=0; j < theme.styleinfo.length; j++)
					{
						bs = theme.styleinfo[j];
						
						if (bs.custom && bs.name == cs.name)
						{
							bf = 1;
							break;
						}
					}
					
					if (bf == 0)
					{
						mcs = new IG$/*mainapp*/._IF7/*clReportStyle*/(cs.node, cs.kname.toLowerCase(), cs.custom);
						theme.styleinfo.push(mcs);
					}
				}
				
				for (i=0; i < theme.styleinfo.length; i++)
				{
					cs = theme.styleinfo[i];
					
					if (cs.custom == true && cs.basestylename)
					{
						for (j=0; j < theme.styleinfo.length; j++)
						{
							if (theme.styleinfo[j].name == cs.basestylename)
							{
								bs = theme.styleinfo[j];
								cs._IFb/*applyBaseStyle*/.call(cs, bs);
								break;
							}
						}
					}
				}
			});
		}
		
		stylelist.store.setRootNode({
			expanded: true,
			text: "Style",
			name: "Style",
			children: ltree
		});
		
		c_themes.store.loadData(lthemes);
		c_themes.setValue(lthemes.length ? lthemes[0].value : null);
		
//		stylelist.store.setRootNode({
//			expanded: true,
//			text: "Style",
//			name: "Style",
//			children: ltree
//		});
		//me.down("[name=c_cset]").setValue(c_cset || "");
	},
	
	_m1/*loadStyle*/: function() {
		var me = this,
			c_themes = me.down("[name=c_themes]"),
			dval = c_themes.getValue(),
			themes = me.themes,
			theme = themes[dval],
			unode,
			c_cset = me.down("[name=c_cset]"),
			gs_enable = me.down("[name=gs_enable]"),
			gs_col = me.down("[name=gs_col]"),
			gs_opa = me.down("[name=gs_opa]"),
			p_h = me.down("[name=p_h]"),
			b_r = me.down("[name=b_r]");
			
		if  (me.__cth)
		{
			me.__cth.c_cset = c_cset.getValue();
			me.__cth.gs_enable = gs_enable.getValue();
			me.__cth.gs_col = IG$/*mainapp*/.$gc/*getColorCode*/(gs_col.getValue());
			me.__cth.gs_opa = gs_opa.getValue();
			me.Mb_4/*commitStyleItem*/();
		}
		
		if (theme)
		{
			me.__cth = theme;
			c_cset.setValue(theme.c_cset || "");
			gs_enable.setValue(theme.gs_enable);
			gs_col.setValue(IG$/*mainapp*/.$gv/*getColorValue*/(theme.gs_col));
			gs_opa.setValue(theme.gs_opa);
			
			p_h.getLayout().setActiveItem(0);
			b_r.setVisible(false);
		}
	},
	
	
	Mb_3/*editStyleItem*/: function(stylename) {
		var me = this,
			__cth = me.__cth,
			i,
			form_header = me.down("[name=form_header]"),
			form_data = me.down("[name=form_data]");
		
		if (__cth)
		{	
			me.Mb_4/*commitStyleItem*/();
			
			for (i=0; i < __cth.styleinfo.length; i++)
			{
				if (__cth.styleinfo[i].name == stylename)
				{
					form_header.Mb_6/*loadStyleData*/.call(form_header, __cth.styleinfo[i].hs/*headerstyle*/);
					form_data.Mb_6/*loadStyleData*/.call(form_data, __cth.styleinfo[i].ds/*datastyle*/);
					break;
				}
			}
		}
	},
	
	Mb_4/*commitStyleItem*/: function() {
		var me = this,
			__cth = me.__cth,
			form_header = me.down("[name=form_header]"),
			form_data = me.down("[name=form_data]");
		
		form_data.Mb_7/*updateStyleData*/.call(form_data);
		form_header.Mb_7/*updateStyleData*/.call(form_header);
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.callback && this.callback.execute();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			c_cset = me.down("[name=c_cset]"),
			gs_enable = me.down("[name=gs_enable]"),
			gs_col = me.down("[name=gs_col]"),
			gs_opa = me.down("[name=gs_opa]");
		
		if (me.__cth)
		{
			me.__cth.c_cset = c_cset.getValue();
			me.__cth.gs_enable = gs_enable.getValue();
			me.__cth.gs_col = IG$/*mainapp*/.$gc/*getColorCode*/(gs_col.getValue());
			me.__cth.gs_opa = gs_opa.getValue();
		}
		
		me.Mb_4/*commitStyleItem*/();
		
		me.Mb_5/*saveStyleItem*/();
	},
	
	Mb_5/*saveStyleItem*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			content = [],
			themes = panel.themes,
			i;
		
		content.push("<smsg><item nodepath='ReportStyle' name='ReportStyle' type='AppOption' uid='ReportStyle'><themes>");
		
		$.each(themes, function(k, theme) {
			var i,
				styles = {},
				bs
			
			for (i=0; i < theme.styleinfo.length; i++)
			{
				styles[theme.styleinfo[i].name] = theme.styleinfo[i];
			}
			
			content.push("<Styles name='" + theme.name + "' c_cset='" + (theme.c_cset || "") + "'");
			content.push(" gs_enable='" + (theme.gs_enable ? "T" : "F") + "' gs_opa='" + (theme.gs_opa || 0.6) + "' gs_col='" + (theme.gs_col || "") + "'>");
			content.push("<Default name='Default'>");
			for (i=0; i < theme.styleinfo.length; i++)
			{
				if (theme.styleinfo[i].custom == false)
				{
					content.push(theme.styleinfo[i].tx/*getXML*/.call(theme.styleinfo[i]));
				}
			}
			content.push("</Default>");
			content.push("<Custom name='Custom'>");
			for (i=0; i < theme.styleinfo.length; i++)
			{
				if (theme.styleinfo[i].custom == true)
				{
					bs = styles[theme.styleinfo[i].basestylename];
					content.push(theme.styleinfo[i].tx/*getXML*/.call(theme.styleinfo[i], bs));
				}
			}
			content.push("</Custom>");
			content.push("</Styles>");
		});
		
		content.push("</themes></item></smsg>");
		
		req.init(panel, 
    			{
	                ack: "1",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "ReportStyle", option: "updatecontent"}, "address;option"),
		            mbody: content.join("")
	            }, panel, panel.rs_Mb_5/*saveStyleItem*/, null);
	    req._l/*request*/();
	},
	
	rs_Mb_5/*saveStyleItem*/: function(xdoc) {
		// this._IG0/*closeDlgProc*/();
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
	},
	
	c1/*copyThemes*/: function(src, tgt) {
		var i,
			cs,
			dcs;
		
		for (i=0; i < src.styleinfo.length; i++)
		{
			cs = src.styleinfo[i];
			dcs = new IG$/*mainapp*/._IF7/*clReportStyle*/(null, cs.itemtype, cs.custom);
			dcs.name = cs.name;
			dcs.nodename = cs.nodename;
			dcs.basestylename = cs.basestylename;
			dcs.hs/*headerstyle*/ = new IG$/*mainapp*/._IF8/*clReportItemStyle*/(null, "Header");
			dcs.ds/*datastyle*/ = new IG$/*mainapp*/._IF8/*clReportItemStyle*/(null, "Data");
			
			dcs._IFb/*applyBaseStyle*/.call(dcs, cs);
			
			tgt.styleinfo.push(dcs);
		}
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this,
			i,
			stylelist = me.down("[name=stylelist]"),
			styleinfo = me.styleinfo,
			rec;
			
		switch (cmd)
		{
		case "cmd_refresh":
			me.Mb_1/*loadGlobalStyle*/();
			break;
		case "cmd_add_custom":
			var dlg = new IG$/*mainapp*/.mA$_s/*makestyle*/({
				styleinfo: me.__cth.styleinfo,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs__sK3a/*appendCustomStyle*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(me, dlg);
			break;
		case "cmd_add_theme":
			var dlg = new IG$/*mainapp*/.mA$_s/*makestyle*/({
				m_theme: 1,
				themes: me.themes,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(params) {
					var me = this,
						stylename = params[0],
						basestylename = params[1],
						theme,
						c_themes = me.down("[name=c_themes]");
						
					if (stylename)
					{
						theme = {
							name: stylename,
							c_cset: null,
							gs_enable: false,
							gs_col: 0,
							gs_opa: 0.6,
							styleinfo: []
						};
						
						me.c1/*copyThemes*/(me.__cth, theme);
						
						me.themes[theme.name] = theme;
						
						c_themes.store.add({
							name: stylename,
							value: stylename
						});
					}
				})
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(me, dlg);
			break;
		case "cmd_remove_theme":
			IG$/*mainapp*/._I55/*confirmMessages*/(null, null, function(btn) {
				if (btn == "yes")
				{
					var i,
						c_themes = me.down("[name=c_themes]"),
						rec,
						srec;
					
					if (me.__cth && c_themes.store.data.items.length > 1)
					{
						for (i=0; i < c_themes.store.data.items.length; i++)
						{
							rec = c_themes.store.data.items[i];
							
							if (rec.get("name") == me.__cth.name)
							{
								c_themes.store.remove(rec);
								break;
							}
						}
						
						delete me.themes[me.__cth.name];
						me.__cth = null;
						
						c_themes.setValue(c_themes.store.data.items[0].get("value"));
					}
				}
			}, me, me);
			break;
		case "cmd_remove":
			var b_r = me.down("[name=b_r]").setVisible(false);
			rec = stylelist.getSelectionModel().getSelection();
			rec = rec && rec.length > 0 ? rec[0] : null;
			if (rec && rec.get("custom") == true)
			{
				stylename = rec.get("name");
				
				$.each(me.themes, function(n, theme) {
					var i,
						styleinfo = theme.styleinfo;
					
					for (i=0; i < styleinfo.length; i++)
					{
						if (styleinfo[i].custom && styleinfo[i].name == stylename)
						{
							styleinfo.splice(i, 1);
							break;
						}
					}
				});
				rec.remove();
			}
			break;
		}
	},
	
	rs__sK3a/*appendCustomStyle*/: function(params) {
		var me = this,
			stylename = params[0], 
			basestylename = params[1],
			i;
			
		if (basestylename && stylename)
		{
			$.each(me.themes, function(k, theme) {
				var i,
					basestyle,
					styleinfo = theme.styleinfo,
					cs;
				
				for (i=0; i < styleinfo.length; i++)
				{
					if (styleinfo[i].name == basestylename)
					{
						basestyle = styleinfo[i];
						break;
					}
				}
				
				if (basestyle)
				{
					cs = new IG$/*mainapp*/._IF7/*clReportStyle*/(null, "item", true);
					cs.name = stylename;
					cs.nodename = "ItemStyle";
					cs.basestylename = basestylename;
					cs.hs/*headerstyle*/ = new IG$/*mainapp*/._IF8/*clReportItemStyle*/(null, "Header");
					cs.ds/*datastyle*/ = new IG$/*mainapp*/._IF8/*clReportItemStyle*/(null, "Data");
					styleinfo.push(cs);
					
					cs._IFb/*applyBaseStyle*/.call(cs, basestyle);
				}
			});
			
			var stylelist = me.down("[name=stylelist]"),
				// proxy = stylelist.store.getProxy(),
				// reader = proxy.getReader(),
				robj, urecord, rootnode = stylelist.store.getRootNode();
			
			for (i=0; i < rootnode.childNodes.length; i++)
			{
				if (rootnode.childNodes[i].data.name == "Custom")
				{
					urecord = rootnode.childNodes[i];
					break;
				}
			}
			
			robj = {name: stylename, leaf: true, custom: true};
			
			// var nrecord = reader.extractData.call(reader, [robj], true);
			// stylelist.store.fillNode.call(stylelist.store, urecord, nrecord);
			urecord.appendChild(robj);
		}
	},
	
	initComponent : function() {
		var panel = this,
			formHeader = new IG$/*mainapp*/._Id0/*styleEditor*/({
				title: IRm$/*resources*/.r1('L_STYLE_TITLE'), 
				name: "form_header", 
				htype: "hd",
				flex: 1
			}),
			formData = new IG$/*mainapp*/._Id0/*styleEditor*/({
				title: IRm$/*resources*/.r1('L_STYLE_DATA'), 
				name: "form_data", 
				htype: "dt",
				flex: 1
			}),
			dp = [{name: "Select", value: ""}],
			copt = IG$/*mainapp*/.__c_/*chartoption*/.chartcolors,
			k;
			
		for (k in copt)
		{
			dp.push({name: k, value: k});
		}
			
		panel.title = IRm$/*resources*/.r1('T_STYLE_WIZARD');
		
			
		$s.apply(this, {
			defaults:{bodyStyle:'padding:3px'},
			dockedItems: [
				{
				    xtype: 'toolbar',
				    dock: 'top',
				    plain: true,
				    items: [
				    	{
				    		iconCls: 'icon-toolbar-save',
			            	tooltip: IRm$/*resources*/.r1('L_SAVE_CONTENT'),
			            	handler: function() {
			            		this._IFf/*confirmDialog*/();
			            	},
			            	scope: this
				    	},
				        "-",
				        {
				        	xtype: "combobox",
				        	fieldLabel: "Themes",
				        	name: "c_themes",
							displayField: "name",
							labelWidth: 60,
							labelAlign: "right",
							valueField: "value",
							editable: false,
							queryMode: "local",
				        	store: {
				        		fields: [
				        			"name", "value"
				        		]
				        	},
				        	listeners: {
				        		change: function(tobj, newvalue, oldvalue, eopts) {
				        			this._m1/*loadStyle*/();
				        		},
				        		scope: this
				        	}
				        },
				        { 
				        	iconCls: 'icon-toolbar-add',
				        	tooltip: "Add Theme",
				        	text: "Add Theme",
				        	handler: function() {
				        		this._t$/*toolbarHandler*/('cmd_add_theme'); 
				        	},
				        	scope: this
				        },
				        {
				        	iconCls: "icon-toolbar-remove",
				        	tooltip: "Remove Theme",
				        	handler: function() {
				        		this._t$/*toolbarHandler*/('cmd_remove_theme'); 
				        	},
				        	scope: this
				        }
				    ]
				}
			],
			
			items: [
				{
					xtype: "panel",
					width: 270,
					border: 1,
					// split: true,
					region: "west",
					layout: "anchor",
					tbar: [
						{
							xtype: "displayfield",
							value: "Basic Options"
						}
					],
					items: [
						{
				        	xtype: "combobox",
				        	fieldLabel: "Chart Style",
				        	name: "c_cset",
							displayField: "name",
							labelAlign: "right",
							labelWidth: 60,
							valueField: "value",
							editable: false,
							queryMode: "local",
				        	store: {
				        		fields: [
				        			"name", "value"
				        		],
				        		data: dp
				        	}
				        },
				        {
				        	xtype: "fieldset",
				        	title: "Grid stripe",
				        	anchor: "100%",
				        	layout: "anchor",
				        	items: [
				        		{
				        			xtype: "checkbox",
				        			fieldLabel: IRm$/*resources*/.r1("L_GS_ENABLED"),
				        			name: "gs_enable",
				        			boxLabel: IRm$/*resources*/.r1("B_ENABLED")
				        		},
						        {
									xtype: "fieldcontainer",
									anchor: "100%",
									fieldLabel: IRm$/*resources*/.r1('L_ALT_COLOR'),
									"layout": "hbox",
									items: [
										{
											xtype: "textfield",
											name: "gs_col",
											width: 60
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
																var forecolor = this.down("[name=gs_col]");
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
									xtype: "numberfield",
									fieldLabel: "Opacity",
									name: "gs_opa",
									width: 200,
									minValue: 0,
									maxValue: 1,
									step: 0.1,
									value: 0.4
								}
							]
						},
						{
							xtype: "container",
							flex: 1
						}
					]
				},
				{
					xtype: "treepanel",
					title: "Style",
					name: "stylelist",
					preventHeader: true,
					region: "west",
					width: 220,
					split: true,
					border: 1,
					rootVisible: false,
					hideHeaders: true,
					autoScroll: true,
					store: {
						xtype: "treestore",
						fields: [
							"name", "text", "custom"
						],
						root: {
							expanded: true,
							name: "Style",
							children: []
						},
						folderSort: false
					},
					
					columns: [
						{
							xtype: "treecolumn",
							text: "text",
							flex: 1,
							sortable: false,
							dataIndex: "name"
						}
					],
					listeners: {
						itemclick: function(view, record, item, index, e) {
							var me = this,
								stylename = record.get("name"),
								b_r = panel.down("[name=b_r]"),
								p_h = panel.down("[name=p_h]"),
								p_d = panel.down("[name=p_d]"),
								i,
								styleinfo = panel.__cth ? panel.__cth.styleinfo : null,
								hasstyle = false,
								bf = false;
							
							if (styleinfo)
							{
								for (i=0; i < styleinfo.length; i++)
								{
									if (styleinfo[i].name == stylename)
									{
										hasstyle = true;
										break;
									}
								}
								
								if (hasstyle)
								{
									if (record.get("custom") == true)
									{
										bf = true;
									}
									
									p_d.setTitle("Edit : " + stylename);
									panel.Mb_3/*editStyleItem*/.call(panel, stylename);
								}
								
								p_h.getLayout().setActiveItem(hasstyle ? 1 : 0);
								b_r.setVisible(bf);
							}
						}
					},
					tbar: [
						{
				    		iconCls: "icon-refresh",
				    		tooltip: IRm$/*resources*/.r1('L_REFRESH'),
				    		handler: function() {
				        		this._t$/*toolbarHandler*/('cmd_refresh'); 
				        	},
				        	scope: this
				    	},
				    	"-",
				        { 
				        	iconCls: 'icon-toolbar-add',
				        	tooltip: "Add Custom Style",
				        	text: "Add Style",
				        	handler: function() {
				        		this._t$/*toolbarHandler*/('cmd_add_custom'); 
				        	},
				        	scope: this
				        },
				        {
				        	iconCls: "icon-toolbar-remove",
				        	tooltip: "Remove Style",
				        	name: "b_r",
				        	hidden: true,
				        	handler: function() {
				        		this._t$/*toolbarHandler*/('cmd_remove'); 
				        	},
				        	scope: this
				        }
					]
				},
				{
					xtype: "panel",
					region: "center",
					"layout": "card",
					name: "p_h",
					items: [
						{
							html: "Click stylename to edit"
						},
						{
							xtype: "tabpanel",
							title: "Edit :",
							name: "p_d",
							layout: {
								type: "fit",
								align: "stretch"
							},
							items: [
					    		formData,
					    		formHeader
							]
						}
					]
				}
			],
			
			listeners: {
				afterrender: function() {
					if (this.styletype == 'g')
					{
						this.Mb_1/*loadGlobalStyle*/();
					}
				}
			}
		});
		
		IG$/*mainapp*/._I78/*styleWizard*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._I9c/*cubeStyle*/ = $s.extend($s.window, {
	
	modal: true,
	"layout": "border",
	closable: false,
	resizable: true,
	width: 650,
	height: 500,
	
	_ILa/*reportoption*/: null,
	
	callback: null,
	globalstyle: null,
	globalstylemap: null,
	styleinfo: null,
	
	Mb_1/*loadGlobalStyle*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(panel, 
    			{
	                ack: "1",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "ReportStyle"}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
	            }, panel, panel.rs_Mb_1/*loadGlobalStyle*/, null);
	    req._l/*request*/();
	},
	
	rs_Mb_1/*loadGlobalStyle*/: function(xdoc) {
		var tnode1 = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item/themes'),
			tnodes1,
			mnode, cs, key,
			bsds = [{
				name: "Select Item",
				value: ""
			}],
			tnode,
			theme_id = ig$/*appoption*/.theme_id,
			unode, child, i, j, bs, nodenames = ["Global", "Default", "Custom", "Item"];
			
		this.globalstyle = [];
		this.globalstylemap = {};
		
		if (tnode1)
		{
			tnodes1 = IG$/*mainapp*/._I26/*getChildNodes*/(tnode1);
			
			if (!theme_id)
			{
				tnode = tnodes1[0];
			}
			else
			{
				for (i=0; i < tnodes1.length; i++)
				{
					if (IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes1[i], "name") == tnodes1)
					{
						tnode = tnodes1[i];
						break;
					}
				}
				
				if (!tnode)
				{
					tnode = tnodes1[0];
				}
			}
		}
		
		if (tnode)
		{
			for (i=0; i < nodenames.length; i++) {
				key = nodenames[i];
				
				mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, key);
				if (mnode)
				{
					child = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
					for (j=0; j < child.length; j++)
					{
						cs = new IG$/*mainapp*/._IF7/*clReportStyle*/(child[j], "global", false);
						this.globalstyle.push(cs);
						bsds.push({
							name: cs.name,
							value: cs.name
						});
						this.globalstylemap[cs.name] = cs;
					}
				}
			}
			
			for (key in this.globalstylemap)
			{
				cs = this.globalstylemap[key];
				
				if (cs.custom == true && cs.basestylename && this.globalstylemap[cs.basestylename])
				{
					bs = this.globalstylemap[cs.basestylename];
					cs._IFb/*applyBaseStyle*/.call(cs, bs);
				}
			}
		}
		
		this.down("[name=base_style]").store.loadData(bsds);
		this.Mb_2/*loadLocalStyle*/();
	},
	
	Mb_2/*loadLocalStyle*/: function() {
		var me = this,
			i, stylename,
			cs, bs,
			stylelist = me.down("[name=stylelist]"),
			ltree = [], cstree, unode;
			
		me.down("[name=c_cset]").setValue(me.c_cset || "");
			
		if (me.styleinfo) {
			unode = {name: 'LocalStyle', leaf: false, children: []};
			ltree.push(unode);
			
			for (i=0; i < me.styleinfo.length; i++) {
				cs = me.styleinfo[i];
				cstree = {name: cs.name, leaf: true, custom: false};
				
				if (cs.basestylename && me.globalstylemap[cs.basestylename])
				{
					bs = me.globalstylemap[cs.basestylename];
					cs._IFb/*applyBaseStyle*/.call(cs, bs);
				}
				
				unode.children.push(cstree);
			}
			
			stylelist.store.setRootNode({
				expanded: true,
				text: "Style",
				name: "Style",
				title: "Style",
				children: ltree
			});
		}
	},
	
	Mb_3/*editStyleItem*/: function(stylename) {
		var i,
			me = this,
			form_header = me.down("[name=form_header]"),
			form_data = me.down("[name=form_data]");
					
		me.Mb_4/*commitStyleItem*/();
		
		for (i=0; i < me.styleinfo.length; i++)
		{
			if (me.styleinfo[i].name == stylename)
			{
				me.__e1/*editingitem*/ = me.styleinfo[i];
				me.__e2/*validateform*/ = 1;
				me.down("[name=base_style]").setValue(me.styleinfo[i].basestylename || "");
				form_header.Mb_6/*loadStyleData*/.call(form_header, me.styleinfo[i].hs/*headerstyle*/);
				form_data.Mb_6/*loadStyleData*/.call(form_data, me.styleinfo[i].ds/*datastyle*/);
				me.__e2/*validateform*/ = 0;
				break;
			}
		}
	},
	
	Mb_4/*commitStyleItem*/: function() {
		var me = this,
			form_header = me.down("[name=form_header]"),
			form_data = me.down("[name=form_data]"),
			nvalue = me.down("[name=base_style]").getValue();
			
		if (me.__e1/*editingitem*/ && nvalue)
		{
			me.__e1/*editingitem*/.basestylename = nvalue;
			form_data.Mb_7/*updateStyleData*/.call(form_data);
			form_header.Mb_7/*updateStyleData*/.call(form_header);
		}
	},
	
	_IG0/*closeDlgProc*/: function() {
		var me = this;
		me.callback && me.callback.execute(me);
		me.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			i,
			base,
			cs;
			
		me.Mb_4/*commitStyleItem*/();
		
		for (i=0; i < me.styleinfo.length; i++)
		{
			cs = me.styleinfo[i];
			
			if (cs.basestylename && me.globalstylemap[cs.basestylename])
			{
				base = me.globalstylemap[cs.basestylename];
				cs.Mb_16/*removeBaseStyle*/(base);
			}
		}
		
		me.c_cset = me.down("[name=c_cset]").getValue();
		me._IG0/*closeDlgProc*/();
	},

	_t$/*toolbarHandler*/: function(cmd) {
		var me = this;
		
		switch (cmd)
		{
		case "cmd_add_custom":
			var dlg = new IG$/*mainapp*/.mA$_s/*makestyle*/({
				styleinfo: this.globalstyle,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs__sK3a/*appendCustomStyle*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
			break;
		case "cmd_delete":
			var i,
				stylelist = this.down("[name=stylelist]"),
				rec = stylelist.getSelectionModel().selected,
				srec = rec && rec.length > 0 ? rec.items[0] : null;
			
			if (srec)
			{
				for (i=0; i < me.styleinfo.length; i++)
				{
					if (srec.get("name") == me.styleinfo[i].name)
					{
						me.styleinfo.splice(i, 1);
						srec.remove();
						break;
					}
				}
			}
			break;
		}
	},
	
	rs__sK3a/*appendCustomStyle*/: function(params) {
		var stylename = params[0], 
			basestylename = params[1];
			
		if (basestylename && stylename)
		{
			var i,
				basestyle;
			
			basestyle = this.globalstylemap[basestylename];
			
			if (basestyle)
			{
				var stylelist = this.down("[name=stylelist]"),
					proxy = stylelist.store.getProxy(),
					reader = proxy.getReader(), cs,
					robj, urecord, rootnode = stylelist.store.getRootNode();
					
				urecord = rootnode.childNodes[rootnode.childNodes.length - 1];
				
				robj = {name: stylename, leaf: true, custom: true};
				cs = new IG$/*mainapp*/._IF7/*clReportStyle*/(null, "item", true);
				cs.name = stylename;
				cs.nodename = "ItemStyle";
				cs.basestylename = basestylename;
				cs.hs/*headerstyle*/ = new IG$/*mainapp*/._IF8/*clReportItemStyle*/(null, "Header");
				cs.ds/*datastyle*/ = new IG$/*mainapp*/._IF8/*clReportItemStyle*/(null, "Data");
				this.styleinfo.push(cs);
				
				cs._IFb/*applyBaseStyle*/.call(cs, basestyle);
				
				var nrecord = reader.extractData.call(reader, [robj], true);
				stylelist.store.fillNode.call(stylelist.store, urecord, nrecord);
			}
		}
	},
	
	initComponent : function() {
		var panel = this,
			formHeader = new IG$/*mainapp*/._Id0/*styleEditor*/({title: IRm$/*resources*/.r1('L_STYLE_TITLE'), name: "form_header", htype: "hd"}),
			formData = new IG$/*mainapp*/._Id0/*styleEditor*/({title: IRm$/*resources*/.r1('L_STYLE_DATA'), name: "form_data", htype: "dt"}),
			dp = [{name: "Default", value: ""}],
			copt = IG$/*mainapp*/.__c_/*chartoption*/.chartcolors,
			k;
			
		for (k in copt)
		{
			dp.push({name: k, value: k});
		};
		
		panel.title = IRm$/*resources*/.r1('T_STYLE_WIZARD');
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:3px'},
			
			items: [
				{
					xtype: "treepanel",
					title: "Style",
					name: "stylelist",
					preventHeader: true,
					region: "west",
					width: 160,
					split: true,
					border: false,
					rootVisible: false,
					hideHeaders: true,
					autoScroll: true,
					store: {
						xtype: "treestore",
						fields: [
							"name", "text", "type", "pname", "region", "custom"
						],
						root: {
							expanded: true,
							name: "Style",
							children: []
						},
						folderSort: false
					},
					
					useArrows: true,
					
					dockedItems: [
						{
						    xtype: 'toolbar',
						    dock: 'top',
						    plain: true,
						    items: [
						        { 
						        	iconCls: 'icon-toolbar-add',
						        	tooltip: "Add Custom Style",
						        	text: "Add New",
						        	handler: function() {
						        		this._t$/*toolbarHandler*/('cmd_add_custom'); 
						        	},
						        	scope: this
						        },
						        {
						        	iconCls: "icon-grid-delete",
						        	tooltip: "Delete",
						        	handler: function() {
						        		this._t$/*toolbarHandler*/('cmd_delete'); 
						        	},
						        	scope: this
						        }
						    ]
						}
					],
					
					columns: [
						{
							xtype: "treecolumn",
							text: "text",
							flex: 2,
							sortable: false,
							dataIndex: "name"
						},
						{
							xtype: 'actioncolumn',
							width: 26,
							items: [
								{
									// icon: './images/delete.png',
									iconCls: "icon-grid-delete",
									tooltip: 'Delete item',
									handler: function (grid, rowIndex, colIndex) {
										var rec = grid.store.getAt(rowIndex);
									},
									getClass: function(v, metadata, r, rowIndex, colIndex, store) {
										if (rowIndex == 0 || r.isLeaf() == false || (r.data && r.data.custom == false))
										{
											return "idv-hd-val";
										}
										return "";
									}
								}
							]
						}
					],
					listeners: {
						afterrender: function() {
							var ctrl = this;
						},
						itemclick: function(view, record, item, index, e) {
							var stylename = record.get("name");
							
							if (record.isRoot() == false && stylename)
							{
								panel.Mb_3/*editStyleItem*/.call(panel, stylename);
							}
						}
					}
					
				},
				{
					xtype: "form",
					region: "center",
					"layout": {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: "combobox",
							fieldLabel: "Inherit",
							name: "base_style",
							displayField: "name",
							valueField: "value",
							editable: false,
							queryMode: "local",
							store: {
								fields: ["name", "value"]
							},
							listeners: {
								change: function(tobj, newvalue, oldvalue) {
									var me = this,
										basestylename = me.down("[name=base_style]").getValue(),
										bs,
										form_header = me.down("[name=form_header]"),
										form_data = me.down("[name=form_data]");
									
									if (me.__e2/*validateform*/)
										return;
										
									if (basestylename)
									{
										bs = me.globalstylemap[basestylename];
										
										if (bs)
										{
											form_header.Mb_6/*loadStyleData*/.call(form_header, bs.hs/*headerstyle*/);
											form_data.Mb_6/*loadStyleData*/.call(form_data, bs.ds/*datastyle*/);
										}
									}
								},
								scope: this
							}
						},
						{
							xtype: 'tabpanel',
							plain: true,
							flex: 1,
							items: [
					    		formData,
					    		formHeader
							],
							bbar: [
								{
									xtype: "toolbar",
									items: [
										{
								        	xtype: "combobox",
								        	fieldLabel: "Chart Style",
								        	name: "c_cset",
											displayField: "name",
											valueField: "value",
											editable: false,
											queryMode: "local",
								        	store: {
								        		fields: [
								        			"name", "value"
								        		],
								        		data: dp
								        	}
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
				afterrender: function() {
					this.Mb_1/*loadGlobalStyle*/();
				}
			}
		});
		
		IG$/*mainapp*/._I9c/*cubeStyle*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._IC0/*MetaEditorPanel*/ = $s.extend($s.panel, {
	autoScroll:false,
    collapseFirst:false,
    "layout": "fit",
    
    closable: true,
    autoScroll:true,
    
    initComponent : function(){
        $s.apply(this,{
            tbar: [
                {
                	text: "Save Content",
                	handler: function() {
                		this.l1/*saveContent*/();
                	},
                	scope: this
                }
            ]
        });
        
        IG$/*mainapp*/._IC0/*MetaEditorPanel*/.superclass.initComponent.call(this);
    },

    items: [
        {
        	xtype: "textarea",
        	name: "metaview"
        }
	],
	
	listeners: {
		render: function(ui) {
    		var panel = ui;
    		
    		if (panel.uid && panel.uid.length > 0)
    		{
    			this.Mmk/*loadMetaContent*/(panel.uid, panel.itemtype);
    		}
    	},
    	resize: function(ui, adjWidth, adjHeight, rawWidth, rawHeight) {
    		ui.Mm11/*validateSize*/.call(ui, adjWidth, adjHeight);
    	}
	},
	
	l1/*saveContent*/: function() {
		var panel = this;
		
		panel.setLoading(true);
		
		var metaview = panel.down("[name=metaview]"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			pt = "31",
			opt = metaview.getValue();
		
		req.init(panel, 
			{
                ack: pt,
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
                mbody: opt
            }, panel, panel.rs_l1/*saveContent*/(), null);	            
		req._l/*request*/();
	},
	
	rs_l1/*saveContent*/: function(xdoc) {
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SAVED'), null, null, 0, "success");
	},
	
	Mmk/*loadMetaContent*/: function(uid, itemtype) {
		var panel = this;
		panel.uid = uid;
		panel.setLoading(true);
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			iscube = (itemtype == 'cube') ? true : false,
			pt = (iscube) ? '6' : '5',
			opt = (iscube) ? '<smsg><info option="CubeContent"/></smsg>' : '<smsg></smsg>';
		if (itemtype == "datacube")
		{
			pt = "5";
			opt = "<smsg><info option='content'/></smsg>";
		}
		req.init(panel, 
			{
                ack: pt,
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
                mbody: opt
            }, panel, panel.rs_Mmk/*loadMetaContent*/, null);	            
		req._l/*request*/();
	},
	
	rs_Mmk/*loadMetaContent*/: function(xdoc) {
		var panel = this
			doc = IG$/*mainapp*/._I25/*toXMLString*/(xdoc),
			content = IG$/*mainapp*/._I16/*stripXMLContent*/(doc),
			metaview = this.down("[name=metaview]");
		
		metaview.setValue(content);
	},
	
	Mm11/*validateSize*/: function(panel, adjWidth, adjHeight) {
		
	}
});


IG$/*mainapp*/.ApM$m/*MetaEditorMainPanel*/ = function(){
	IG$/*mainapp*/.ApM$m/*MetaEditorMainPanel*/.superclass.constructor.call(this, {
        id:'doc-body',
        region:'center',
        margins:'0 5 5 0',
        resizeTabs: true,
        minTabWidth: 135,
        tabWidth: 135,
        enableTabScroll: true,
        activeTab: 0,
        
        "layout": "fit",

        items: [
        	{
	            id:'welcome-panel',
	            title: 'MetaEditor',
	            autoLoad: {url: './html/metaeditor.html', callback: null, scope: this},
	            iconCls:'icon-docs',
	            autoScroll: true
        	}
        ]
    });
};

IG$/*mainapp*/.ApM$m/*MetaEditorMainPanel*/ = $s.extend($s.tabpanel, {
	initEvents : function(){
		IG$/*mainapp*/.ApM$m/*MetaEditorMainPanel*/.superclass.initEvents.call(this);
	    this.body.on('click', this.onClick, this);
	},
	
	m1$7/*navigateApp*/: function(uid, itemtype, itemname, itemaddr) {
    	var tab = this.getComponent(itemaddr);
    	
    	if (tab)
    	{
    		this.setActiveTab(tab);
    	}
    	else
    	{
    		var pitem = IG$/*mainapp*/._I61/*createAppPanel*/(uid, 'metaeditor', itemname, itemaddr, null);
    		if (pitem != null)
    		{
    			pitem.uid = uid;
    			pitem.address = itemaddr;
    			pitem.itemtype = itemtype;
    			pitem.title = itemname;
    			
    			var p = this.add(pitem);
    			this.setActiveTab(p);
    		}
    	}
    }
});

IG$/*mainapp*/._I7a/*sysmon*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	title: "System Logs",
	region:'center',
	
	"layout": 'fit',
	
	closable: true,
	resizable:false,
	
	autoHeight: true,
	
	callback: null,
	
	bodyPadding: 10,
	
	iconCls: "icon-ing-docdef",
	
	in$t: function() {
		var me = this,
			status = me.down("[name=status]");
		
		status.setValue("");
		me.down("[name=e_stat]").setValue("F");
	},
	
	l1/*loadJobList*/: function(tsec, vopt) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			status = panel.down("[name=status]"),
			ellapsetime = panel.down("[name=ellapsetime]"),
			bufsize = panel.down("[name=bufsize]");
			
		req.init(panel, 
			{
	            ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({vopt: (vopt || "1")}, "vopt"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'sysmon', "ellapsetime": ellapsetime.getValue(), bufsize: bufsize.getValue(), "status": status.getValue()})
	        }, panel, panel.rs_l1/*loadJobList*/, false, [tsec, vopt]);
		req._l/*request*/();
	},
	
	rs_l1/*loadJobList*/: function(xdoc, param) {
		var me = this,
			tsec = param[0],
			vopt = param[1],
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes, snodes, i, j, datas = [], data, dname,
			grdjoblist = me.down("[name=grdjoblist]"),
			grd_sql = me.down("[name=grd_sql]"),
			grd_esql = me.down("[name=grd_esql]");
		
		if (vopt == "2")
		{
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/sql");
			if (tnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < tnodes.length; i++)
				{
					snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnodes[i]);
					data = {};
					for (j=0; j < snodes.length; j++)
					{
						dname = IG$/*mainapp*/._I29/*XGetNodeName*/(snodes[j]);
						data[dname] = IG$/*mainapp*/._I24/*getTextContent*/(snodes[j]);
					}
					datas.push(data);
				}
			}
			
			grd_sql.store.loadData(datas);
			datas = [];
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/sqlexec");
			if (tnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < tnodes.length; i++)
				{
					snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnodes[i]);
					data = {};
					for (j=0; j < snodes.length; j++)
					{
						dname = IG$/*mainapp*/._I29/*XGetNodeName*/(snodes[j]);
						data[dname] = IG$/*mainapp*/._I24/*getTextContent*/(snodes[j]);
					}
					datas.push(data);
				}
			}
			
			grd_esql.store.loadData(datas);
		}
		else
		{
			if (tnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < tnodes.length; i++)
				{
					data = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
					datas.push(data);
				}
			}
			
			grdjoblist.store.loadData(datas);
		}
		
		if (tsec && tsec > 0)
		{
			me.rtimer = setTimeout(function() {
				me.l1/*loadJobList*/.call(me, tsec, vopt);
			}, tsec);
		}
	},
	
	l2/*getJobDetail*/: function(jobid) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(panel, 
			{
	            ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({jobid: jobid}, "jobid"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'jobdetail'})
	        }, panel, panel.rs_l2/*getJobDetail*/, false);
		req._l/*request*/();
	},
	
	rs_l2/*getJobDetail*/: function(xdoc) {
		var me = this,
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/Job"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/Job/process"),
			tnodes, i, datas = [], data,
			grdjobdetail = this.down("[name=grdjobdetail]");
		
		me.jobdetail = (mnode) ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(mnode) : null;
		
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tnodes.length; i++)
			{
				data = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				datas.push(data);
			}
		}
		
		grdjobdetail.store.loadData(datas);
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	dQ/*cancelQuery*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		if (panel.jobdetail && panel.jobdetail.uid)
		{
			req.init(panel, 
				{
		            ack: "18",
					payload: "<smsg><item jobid='" + panel.jobdetail.uid + "' option='cancel'/></smsg>",
					mbody: "<smsg></smsg>"
		        }, panel, panel.r_IP5/*cancelQuery*/, null);
			req.showerror = false;
			req._l/*request*/();
		}
	},
	
	r_IP5/*cancelQuery*/: function() {
		var me = this;
		
		if (me.jobdetail && me.jobdetail.uid)
		{
			me.l2/*getJobDetail*/(me.jobdetail.uid);
		}
	},
	
	sc/*RefreshControl*/: function(en, vopt) {
		var me = this,
			btn_start = me.down("[name=btn_start]"),
			btn_stop = me.down("[name=btn_stop]"),
			btn_refresh = me.down("[name=btn_refresh]"),
			rsec = me.down("[name=rsec]"),
			tsec = rsec.getValue() * 1000;
			
		btn_stop.setDisabled(en ? false : true);
		btn_start.setDisabled(en);
		btn_refresh.setDisabled(en);
		rsec.setDisabled(en);
		
		clearTimeout(me.rtimer);
		me.rtimer = -1;
		
		if (en == true)
		{
			me.rtimer = setTimeout(function() {
				me.l1/*loadJobList*/.call(me, tsec, vopt);
			}, tsec);
		}
	},
	
	eM2/*emailstatus*/: {
		"A": "Waiting",
		"F": "Failed",
		"S": "Success",
		"P": "Processing"
	},
	
	eM1/*getEmailContent*/: function() {
		var me = this,
			grd_email = me.down("[name=grd_email]"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
	            ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({stat: me.down("[name=e_stat]").getValue()}, "stat"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'mail_stat'})
	        }, me, function(xdoc) {
	        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
	        		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
	        		i,
	        		datas = [],
	        		mstat = me.eM2/*emailstatus*/,
	        		data;
    			for (i=0; i < tnodes.length; i++)
    			{
    				data = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
    				data.subject = IG$/*mainapp*/._I1a/*getSubNodeText*/(tnodes[i], "subject");
    				data.stat = mstat[data.mstat] || "Unknown";   
    				datas.push(data);
    			}
    			
    			grd_email.store.loadData(datas);
	        }, false);
		req._l/*request*/();
	},
	
	s1/*showMailDetail*/: function(sid) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
	            ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({sid: sid}, "sid"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'mail_content'})
	        }, me, function(xdoc) {
	        	var me = this,
	        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/mail"),
	        		datas = [],
	        		mstat = me.eM2/*emailstatus*/,
	        		data = {},
	        		m_d1 = me.down("[name=m_d1]"),
	        		m_d2 = me.down("[name=m_d2]"),
	        		ig_mail = $("#ig_mail", m_d2.body.dom);
	        	
	        	if (tnode)
	        	{
	    			data = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
	    			data.subject = IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "subject");
	    			data.content = IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "content");
	    			data.stat = mstat[data.mstat] || "Unknown";
				}
				
				ig_mail.contents().find('html').html(data ? data.content : "");
				
				m_d1.show();
	        }, false);
		req._l/*request*/();
	},
	
	initComponent : function() {
		var me = this;
		
		$s.apply(this, {
			
			items: [
				{
					xtype: "tabpanel",
					items: [
					    {
					    	xtype: "container",
					    	title: "Report Logs",
					    	layout: {
					    		type: "vbox",
					    		align: "stretch"
					    	},
					    	items: [
								{
									xtype: "fieldset",
									title: "System Monitoring and Control",
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "fieldcontainer",
											layout: {
												type: "hbox",
												align: "stretch",
												defaultMargins: {
													top: 0,
													left: 0,
													right: 10,
													bottom: 0
												}
											},
											items: [
												{
													xtype: "numberfield",
													labelAlign: "right",
													name: "rsec",
													fieldLabel: "Auto Refresh (sec)",
													value: 60
												},
												{
													xtype: "button",
													name: "btn_start",
													text: "Start",
													handler: function() {
														var me = this,
															rsec = me.down("[name=rsec]");
															
														if (rsec.getValue() > 0)
														{
															this.sc/*RefreshControl*/(true);
														}
													},
													scope: this
												},
												{
													xtype: "button",
													name: "btn_stop",
													text: "Stop",
													disabled: true,
													handler: function() {
														this.sc/*RefreshControl*/(false);
													},
													scope: this
												},
												{
													xtype: "container",
													flex: 1
												},
												{
													xtype: "button",
													text: "Refresh",
													name: "btn_refresh",
													handler: function() {
														this.l1/*loadJobList*/();
													},
													scope: this
												}
											]
										},
										{
											xtype: "fieldcontainer",
											layout: {
												type: "hbox",
												defaultMargins: {
													top: 0,
													left: 0,
													right: 10,
													bottom: 0
												}
											},
											items: [
												{
													xtype: "combobox",
													queryMode: "local",
													fieldLabel: "Conditions",
													name: "status",
													labelAlign: "right",
													displayField: "name",
													valueField: "value",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: ["name", "value"],
														data: [
															{"name": "All", "value": ""},
															{"name": "STAT_START", "value": "STAT_START"},
															{"name": "STAT_FAILED_ERROR", "value": "STAT_FAILED_ERROR"},
															{"name": "STAT_PREPARE_STATEMENT", "value": "STAT_PREPARE_STATEMENT"},
															{"name": "STAT_BEFORE_EXECUTE_QRY", "value": "STAT_BEFORE_EXECUTE_QRY"},
															{"name": "STAT_END_QUERY_EXECUTION", "value": "STAT_END_QUERY_EXECUTION"},
															{"name": "STAT_CANCELED", "value": "STAT_CANCELED"},
															{"name": "STAT_FINISHED_WITH_ERROR", "value": "STAT_FINISHED_WITH_ERROR"},
															{"name": "STAT_FINISHED", "value": "STAT_FINISHED"}
														]
													}
												},
												{
													xtype: "numberfield",
													name: "ellapsetime",
													labelAlign: "right",
													fieldLabel: "Ellapsed more then (second)",
													labelWidth: 180,
													value: 60
												},
												{
													xtype: "numberfield",
													name: "bufsize",
													labelAlign: "right",
													fieldLabel: "Buffer Size",
													minValue: 10,
													maxValue: 1000,
													value: 100
												}
											]
										}
									]
								},
								{
									xtype: "gridpanel",
									name: "grdjoblist",
									flex: 1,
									store: {
										xtype: "store",
										fields: [
										    "uid", "userid", "status", "statuscode", "totalellapsed", "haserror", "errormsg", "starttime", "endtime", "objectname", "objectpath", "objectuid"
										]
									},
									columns: [
										{
											xtype: "gridcolumn",
											text: "UserID",
											dataIndex: "userid",
											flex: 1
										},
										{
											xtype: "gridcolumn",
											text: "Status",
											dataIndex: "status",
											width: 120
										},
										{
											xtype: "gridcolumn",
											text: "Name",
											dataIndex: "objectname",
											width: 120
										},
										{
											xtype: "gridcolumn",
											text: "Path",
											dataIndex: "objectpath",
											width: 200
										},
										{
											xtype: "gridcolumn",
											text: "JobID",
											hidden: true,
											dataIndex: "uid",
											width: 80
										},
										{
											xtype: "gridcolumn",
											text: "Ellapsed",
											width: 60,
											dataIndex: "totalellapsed"
										},
										{
											xtype: "gridcolumn",
											text: "Start",
											width: 80,
											dataIndex: "starttime"
										},
										{
											xtype: "gridcolumn",
											text: "End",
											width: 80,
											dataIndex: "endtime"
										},
										{
											xtype: "gridcolumn",
											text: "Error",
											width: 40,
											dataIndex: "haserror"
										}
									],
									listeners: {
										itemclick: function(tobj, record, item, index, e, eOpts) {
											var jobid = record.get("uid");
											this.l2/*getJobDetail*/(jobid);
										},
										scope: this
									}
								},
								{
									xtype: "fieldset",
									collapsible: false,
									flex: 1,
									layout: "fit",
									title: "Action Detail",
									
									items: [
										{
											xtype: "gridpanel",
											name: "grdjobdetail",
		
											store: {
												xtype: "store",
												fields: [
												    "status", "statuscode", "ellapsed"
												]
											},
											buttons: [
												{
													xtype: "button",
													text: "Cancel Job",
													handler: function() {
														this.dQ/*cancelQuery*/();
													},
													scope: this
												},
												{
													xtype: "button",
													text: "Open in folder",
													handler: function() {
														if (IG$/*mainapp*/._I7d/*mainPanel*/ && window.api && this.jobdetail && this.jobdetail.objectpath)
											    		{
											    			api._IHd/*navigateTree*/.call(api, {
											    				name: this.jobdetail.objectname,
											    				nodepath: this.jobdetail.objectpath,
											    				uid: this.jobdetail.objectuid
											    			});
											    		}
													},
													scope: this
												}
											],
											columns: [
												{
													xtype: "gridcolumn",
													flex: 1,
													text: "Action type",
													dataIndex: "status"
												},
												{
													xtype: "gridcolumn",
													text: "Ellapsed time",
													dataIndex: "ellapsed"
												}
											]
										}
									]
								}
					    	]
						},
						{
							xtype: "container",
							title: "JDBC Monitoring",
							layout: "border",
							items: [
								{
									xtype: "panel",
									region: "north",
									layout: "vbox",
									items: [
										{
											xtype: "button",
											text: "Refresh",
											handler: function() {
												this.l1/*loadJobList*/(null, "2");
											},
											scope: this
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
									region: "center",
									items: [
										{
											xtype: "gridpanel",
											flex: 1,
											title: "SQL Details",
											name: "grd_sql",
											store: {
												xtype: "store",
												fields: [
												    "c0", "c1", "c2", "c4", "c5"
												]
											},
											columns: [
												{
													text: "No.",
													dataIndex: "c0",
													width: 40
												},
												{
													text: "Date",
													dataIndex: "c1"
												},
												{
													text: "ExecTime",
													dataIndex: "c2",
													width: 50
												},
												{
													text: "SQL",
													dataIndex: "c4",
													flex: 1
												},
												{
													text: "Error",
													dataIndex: "c5",
													flex: 1
												}
											]
										},
										{
											xtype: "gridpanel",
											flex: 1,
											title: "Exec SQL",
											name: "grd_esql",
											store: {
												xtype: "store",
												fields: [
												    "c0", "c1", "c2", "c4"
												]
											},
											columns: [
												{
													text: "No.",
													dataIndex: "c0",
													width: 40
												},
												{
													text: "Date",
													dataIndex: "c1"
												},
												{
													text: "ExecTime",
													dataIndex: "c2",
													width: 50
												},
												{
													text: "SQL",
													dataIndex: "c4",
													flex: 1
												}
											]
										}
									]
								},
								{
									xtype: "container",
									region: "east",
									flex: 1,
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "panel",
											flex: 1,
											title: "Request Count"
										},
										{
											xtype: "panel",
											flex: 1,
											title: "Running"
										}
									]
								}
							]
						},
						{
							xtype: "container",
							title: "Email Sender Logs",
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
							    {
							    	xtype: "fieldset",
							    	layout: "hbox",
							    	items: [
							    	    {
							    	    	xtype: "fieldcontainer",
							    	    	flex: 1,
							    	    	layout: "hbox",
							    	    	items: [
							    	    	    {
							    	    	    	xtype: "combobox",
							    	    	    	queryMode: "local",
													fieldLabel: "Status",
													name: "e_stat",
													labelAlign: "right",
													displayField: "name",
													valueField: "value",
													editable: false,
													autoSelect: true,
													store: {
														xtype: "store",
														fields: ["name", "value"],
														data: [
															{"name": "Failed", "value": "F"},
															{"name": "Sending", "value": "P"},
															{"name": "Waiting", "value": "A"},
															{"name": "Success", "value": "S"},
															{"name": "All", "value": ""}
														]
													}
							    	    	    }
							    	    	]
							    	    },
							    	    {
							    	    	xtype: "button",
							    	    	text: "Run",
							    	    	handler: function() {
							    	    		this.eM1/*getEmailContent*/();
							    	    	},
							    	    	scope: this
							    	    }
							    	]
							    },
								{
									xtype: "gridpanel",
									flex: 1,
									title: "Email Logs",
									name: "grd_email",
									store: {
										xtype: "store",
										fields: [
										    "sid", "iuid", "snder", "email", "cdate", "mdate", "mstat", "stat", "msgtype", "subject"
										]
									},
									columns: [
									    {
									    	text: "Sender",
									    	dataIndex: "snder",
									    	width: 120
									    },
										{
											text: "Email",
											dataIndex: "email",
											width: 120
										},
										{
											text: "Modified Date",
											dataIndex: "mdate",
											width: 50
										},
										{
											text: "Created Date",
											dataIndex: "cdate",
											width: 50
										},
										{
											text: "Subject",
											dataIndex: "subject",
											tdCls: "igc-td-link",
											flex: 1
										},
										{
											text: "Status",
											dataIndex: "stat",
											width: 80
										}
									],
									listeners: {
										cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
											var me = this;
											
											if (cellIndex == 4)
											{
												me.s1/*showMailDetail*/(record.get("sid"));
											}
										},
										scope: this
									}
								},
								{
									xtype: "panel",
									layout: "fit",
									hidden: true,
									flex: 1,
									name: "m_d1",
									items: [
										{
											name: "m_d2",
											html: "<div class='igc-mail-detail'><iframe id='ig_mail' class='igc-mail-detail-if'></iframe></div>"
										}
									]
								}
							]
						}
					]
				}
			],
			// buttons:[{
			// 	text: IRm$/*resources*/.r1('B_CLOSE'),
			// 	handler: function() {
			// 		this.close();
			// 	},
			// 	scope: this
			// }],
			
			listeners: {
				afterrender: function(ui) {
					this.in$t();
				}
			}
		});
		
		IG$/*mainapp*/._I7a/*sysmon*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._I7b/*sys_resource*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	region:'center',
	
	"layout": 'fit',
	
	closable: true,
	resizable:false,
	
	autoHeight: true,
	
	callback: null,
	
	bodyPadding: 10,
	
	iconCls: "icon-ing-docdef",
	
	in$t: function() {
		this.l1/*loadResources*/();
	},
	
	l1b/*loadResources*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
						
		req.init(me, 
			{
	            ack: "12",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/resources"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "getrs"})
	        }, me, me.rs_l1/*loadResources*/, false);
		req._l/*request*/();
	},
	
	l1/*loadServerInfo*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
						
		req.init(me, 
			{
	            ack: "12",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/serverinfo"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "getrs"})
	        }, me, me.rs_l1a/*loadServerInfo*/, false);
		req._l/*request*/();
	},
	
	rs_l1a/*loadServerInfo*/: function(xdoc) {
		var me = this,
			tnode, tnodes,
			i;
			
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/info");
		me.licinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/info/access_ip");
		
		if (tnode)
		{
			me.licinfo.access_ip = [];
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tnodes.length; i++)
			{
				me.licinfo.access_ip.push(IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]));
			}
		}
		
		me.l1b/*loadResources*/();
	},
	
	rs_l1/*loadResources*/: function(xdoc) {
		var me = this,
			tnode;
			
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/results/meminfo");
		me.s1/*setMemory*/(tnode);
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/results/diskinfo");
		me.s2/*setDisk*/(tnode);
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/results/osinfo");
		me.s3/*setOS*/(tnode);
	},
	
	m1/*memoryFormat*/: function(v) {
		var unit = "b",
			d = 1,
			mv = v;
		
		if (mv > 1000)
		{
			unit = "M";
			mv = mv / 1000;
			
			if (mv > 1000)
			{
				unit = "G";
				mv = mv / 1000;
			}
		}
		
		return mv.format("#,###") + " " + unit;
	},
	
	s1/*setMemory*/: function(tnode) {
		var me = this,
			m_charts,
			prop,
			g_mem = me.down("[name=g_mem]"),
			dp = [],
			k;
			
		if (!me.m_charts)
		{
			var p = me.down("[name=p_mem]"),
				el = $(".idv-rcs-mem", p.el.dom),
				pbox = [
					{
						name: "free",
						title: "Free Memory"
					},
					{
						name: "allocated",
						title: "Allocated"
					},
					{
						name: "appfree",
						title: "Application Free"
					},
					{
						name: "max",
						title: "Max Memory",
						chart: false
					},
					{
						name: "totalfree",
						title: "Free Total",
						chart: false
					}
				];
				
			el.empty();
			
			me.clen = 0;
			
			$.each(pbox, function(i, pb) {
				if (pb.chart != false)
				{
					var mel = $("<div class='idv-rcs-pnl'><div class='idv-rcs-title'>" + pb.title + "</div><div class='idv-rcs-chart'></div></div>").appendTo(el);
					pb.el = mel;
					pb.dc = $('.idv-rcs-chart', pb.el);
					pb.clabel = $("<div class='idv-rcs-label'></div>").appendTo(pb.dc);
					pb.chart = pb.dc.easyPieChart({
				        //your configuration goes here
				        size: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(pb.dc)
				    });
				    me.clen ++;
				}
			});
			
			me.m_charts = pbox;
			
			me.s1s/*resizeMemoryCharts*/();
		}
		
		m_charts = me.m_charts;
		
		if (tnode)
		{
			prop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			
			var tfree = Number(prop["totalfree"]),
				tmax = Number(prop["max"]);
			
			$.each(m_charts, function(i, pb) {
				var v = Number(prop[pb.name]),
					lbl;
				
				dp.push({
					name: pb.title,
					value: v
				});
				
				switch (pb.name)
				{
				case "free":
				case "appfree":
					pb.value = 100 * v / tfree;
					lbl = me.m1/*memoryFormat*/(v) + "<br>" + me.m1/*memoryFormat*/(tfree)
					break;
				case "allocated":
					pb.value = 100 * v / tmax;
					lbl = me.m1/*memoryFormat*/(v) + "<br>" + me.m1/*memoryFormat*/(tmax)
					break;
				}
				
				if (pb.chart)
				{
					pb.chart.data('easyPieChart').update(pb.value);
					pb.clabel.html(lbl);
				}
			});
		}
		
		g_mem.store.loadData(dp);
	},
	
	s1s/*resizeMemoryCharts*/: function() {
		var me = this,
			p_mem = me.down("[name=p_mem]"),
			p_el = $(p_mem.body.dom),
			rmem = $(".idv-rcs-mem", p_el),
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(p_el),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(p_el),
			m_charts = me.m_charts,
			i, n,
			x = 0,
			pb;
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(rmem, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(rmem, h);
		
		if (m_charts)
		{
			n = w / me.clen;
			
			for (i=0; i < m_charts.length; i++)
			{
				pb = m_charts[i];
				
				if (pb.chart)
				{
					IG$/*mainapp*/.x_10/*jqueryExtension*/._w(pb.el, n);
					IG$/*mainapp*/.x_10/*jqueryExtension*/._h(pb.el, h);
					pb.el.css("left", x);
					pb.dc.css({
						left: (n - 90) / 2,
						top: (h - 90) / 2 + 20
					});
					x += n;
				}
			}
		}
	},
	
	s2/*setDisk*/: function(tnode) {
		var me = this,
			g_disk = me.down("[name=g_disk]"),
			tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			dp = [],
			p_dsk = me.down("[name=p_dsk]"),
			el = $(".idv-rcs-dsk", p_dsk.el.dom),
			mel, pb,
			i, v;
		
		me.dlen = 0;
		me.m_dsks = [];
		me.h_dsks = me.h_dsks || {};
		
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				
				if (me.h_dsks[p.name])
				{
					pb = me.h_dsks[p.name];
				}
				else
				{
					mel = $("<div class='idv-rcs-pnl-dsk'><div class='idv-rcs-title'>" + p.name + "</div><div class='idv-rcs-chart'></div></div>").appendTo(el);
					pb = {
						el: mel,
						dc: $('.idv-rcs-chart', mel)
					};
					pb.clabel = $("<div class='idv-rcs-label'></div>").appendTo(pb.dc);
					pb.chart = pb.dc.easyPieChart({
				        //your configuration goes here
				        size: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(pb.dc)
				    });
				    
				    me.h_dsks[p.name] = pb;
			    }
			    v = Number(p.total) - Number(p.usable);
			    v = (Number(p.total) > 0 ? v * 100 / Number(p.total) : 0);
			    pb.chart.data('easyPieChart').update(v);
			    pb.clabel.text(p.name + " : " + v.format("###") + "%");
			    me.dlen ++;
				
				dp.push(p);
				me.m_dsks.push(pb);
			}
			
			me.s2s/*resizeDiskCharts*/();
		}
		
		g_disk.store.loadData(dp);
	},
	
	s2s/*resizeDiskCharts*/: function() {
		var me = this,
			p_dsk = me.down("[name=p_dsk]"),
			p_el = $(p_dsk.body.dom),
			rdsk = $(".idv-rcs-dsk", p_el),
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(p_el),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(p_el),
			m_dsks = me.m_dsks,
			i, n,
			y = 0,
			pb;
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(rdsk, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(rdsk, h);
		
		if (m_dsks)
		{
			for (i=0; i < m_dsks.length; i++)
			{
				pb = m_dsks[i];
				
				if (pb.chart)
				{
					IG$/*mainapp*/.x_10/*jqueryExtension*/._w(pb.el, w);
					n = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(pb.el);
					pb.dc.css({
						left: (w - 90) / 2,
						top: (n - 90) / 2 + 20
					});
				}
			}
		}
	},
	
	s3/*setOS*/: function(tnode) {
		var me = this,
			p_os = me.down("[name=p_os]"),
			el = $(".idv-os-pnl", p_os.el.dom),
			tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			ui, li, ap,
			p,
			i,
			licinfo = me.licinfo;
		
		el.empty();
		
		if (tnodes)
		{
			ul = $("<ul class='idv-os-ul'></ul>").appendTo(el);
			
			for (i=0; i < tnodes.length; i++)
			{
				p = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name");
				
				li = $("<li><span class='idv-os-type'>" + p + "</span> : <span class='idv-os-val'>" + IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]) + "</span></li>");
				ul.append(li);
			}
			
			ul = $("<div class='idv-lic-dv'><span>License Information</span></div>").appendTo(el);
			ul = $("<ul class='idv-lic-ul'></ul>").appendTo(ul);
			
			if (licinfo)
			{
				for (p in licinfo)
				{
					if (p != "access_ip")
					{
						li = $("<li><span class='idv-os-type'>" + p + "</span> : <span class='idv-os-val'>" + licinfo[p] + "</span></li>");
						ul.append(li);
					}
				}
				
				if (licinfo.access_ip)
				{
					ul = $("<div class='idv-lic-dv'><span>Accessed IP</span></div>").appendTo(el);
					
					for (i=0; i < licinfo.access_ip.length; i++)
					{
						li = $("<li><span class='idv-os-val'>" + licinfo.access_ip[i] + "</span></li>"); 
						ul.append(li);
					}
				}
			}
		}
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("T_SYS_RES");
		
		$s.apply(this, {
			tbar: [
				{
					xtype: "button",
					iconCls: "icon-refresh",
					tooltip: IRm$/*resources*/.r1("L_REFRESH"),
					handler: function() {
						this.l1/*loadResources*/();
					},
					scope: this
				}
			],
			items: [
			    {
			    	xtype: "panel",
			    	layout: "border",
			    	border: 0,
			    	items: [
			    		{
			    			xtype: "panel",
			    			region: "north",
			    			height: 200,
			    			border: 0,
			    			layout: {
			    				type: "hbox",
			    				align: "stretch"
			    			},
			    			items: [
			    				
			    				{
			    					xtype: "panel",
			    					name: "p_mem",
			    					title: "Memory Resources",
			    					layout: "fit",
			    					flex: 1,
			    					html: "<div class='idv-rcs-mem'></div>",
			    					listeners: {
			    						resize: function() {
			    							this.s1s/*resizeMemoryCharts*/();
			    						},
			    						scope: this
			    					}
			    				}
			    			]
			    		},
			    		{
			    			xtype: "panel",
			    			region: "center",
			    			border: 0,
			    			layout: {
			    				type: "hbox",
			    				align: "stretch"
			    			},
			    			flex: 1,
			    			items: [
								{
	    							xtype: "panel",
	    							flex: 1,
	    							layout: {
	    								type: "vbox",
	    								align: "stretch"
	    							},
	    							items: [
			    						{
			    							xtype: "gridpanel",
			    							title: "Memory",
			    							name: "g_mem",
			    							flex: 1,
			    							store: {
			    								xtype: "store",
			    								fields: ["name", "value"]
			    							},
			    							columns: [
			    								{
			    									xtype: "gridcolumn",
			    									text: "Name",
			    									flex: 1,
			    									dataIndex: "name"
			    								},
			    								{
			    									xtype: "gridcolumn",
			    									text: "Value",
			    									dataIndex: "value",
			    									flex: 1
			    								}
			    							]
			    						},
			    						{
			    							xtype: "gridpanel",
			    							title: "Disk",
			    							name: "g_disk",
			    							flex: 1,
			    							store: {
			    								xtype: "store",
			    								fields: ["name", "total", "free", "usable"]
			    							},
			    							columns: [
			    								{
			    									xtype: "gridcolumn",
			    									text: "Name",
			    									flex: 1,
			    									dataIndex: "name"
			    								},
			    								{
			    									xtype: "gridcolumn",
			    									text: "Total",
			    									dataIndex: "total",
			    									flex: 1
			    								},
			    								{
			    									xtype: "gridcolumn",
			    									text: "Free",
			    									dataIndex: "free",
			    									flex: 1
			    								},
			    								{
			    									xtype: "gridcolumn",
			    									text: "usable",
			    									dataIndex: "usable",
			    									flex: 1
			    								}
			    							]
			    						}
	    							]
			    				},
			    				{
			    					xtype: "panel",
			    					name: "p_dsk",
			    					flex: 1,
			    					layout: "fit",
			    					html: "<div class='idv-rcs-dsk'></div>",
			    					listeners: {
			    						resize: function() {
			    							this.s2s/*resizeDiskCharts*/();
			    						},
			    						scope: this
			    					}
			    				},
			    				{
			    					xtype: "panel",
			    					title: "System Info",
			    					name: "p_os",
			    					layout: "fit",
			    					flex: 1,
			    					html: "<div class='idv-os-pnl'></div>"
			    				}
			    			]
			    		}
			    	]
			    }
			],
			
			listeners: {
				afterrender: function(ui) {
					this.in$t();
				}
			}
		});
		
		IG$/*mainapp*/._I7b/*sys_resource*/.superclass.initComponent.apply(this, arguments);
	}
});
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

IG$/*mainapp*/._dRp/*dashboard_rcsmgr_preview*/ = $s.extend($s.window, {
	title: IRm$/*resources*/.r1("L_PRV_DATA"),
	modal: true,
	width: 400,
	height: 350,
	layout: "fit",
	
	_1/*loadContent*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/()
			
		req.init(me, 
			{ 
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: ""})
	        }, me, function(xdoc) {
	        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
	        	
	        }, false);
		req._l/*request*/();
	},
	
	initComponent: function() {
		var me = this;
		
		$s.apply(this, {
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
							html: "<div style='height: 200px;overflow: auto;'><img src='" + ig$/*appoption*/.servlet + "?sreq=resource&_rcs_=" + me.uid + "&_mts_=" + IG$/*mainapp*/._g$a/*global_mts*/ + "'></img></div>",
							name: "img_prev"
						}
					]
				}
			],
			buttons: [
				{
					text: IRm$/*resources*/.r1('B_CLOSE'),
					handler:function() {
						this.close();
					},
					scope: this
				}
			]
		});
		IG$/*mainapp*/._dRp/*dashboard_rcsmgr_preview*/.superclass.initComponent.call(this);
	},
	listeners: {
		afterrender: function(tobj) {
			if (tobj.uid)
			{
				tobj._1/*loadContent*/.call(tobj);
			}
		}
	}
});

IG$/*mainapp*/._dR/*dashboard_rcsmgr*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	"layout": "fit",
	_9/*framecontent*/: null,
	
	m1$9/*confirmSetting*/: function() {
		if (this.m1$12/*updateSetting*/() == true)
		{
			this.callback && this.callback.execute();
			
			this._IG0/*closeDlgProc*/();
		}
	},
	
	_IFe1/*initF*/: function() {
	},
	
	commitCode: function() {
		var me = this,
			r = true,
			_9/*framecontent*/ = me._9/*framecontent*/,
			rcs = _9/*framecontent*/ ? _9/*framecontent*/.rcs : null,
			i,
			dgrid = me.down("[name=dgrid]"),
			p, rec;
		
		if (_9/*framecontent*/)
		{
			if (rcs.length)
			{	
				rcs.splice(0, rcs.length);
			}
			
			for (i=0; i < dgrid.store.data.items.length; i++)
			{
				rec = dgrid.store.data.items[i];
				
				p = {
					uid: rec.get("uid"),
					name: rec.get("name")
				};
				
				rcs.push(p);
			}
		}
		
		return r;
	},
	
	refreshCode: function() {
	},
		
	_IFe/*initF*/: function() {
		var me = this;
		me._m3/*loadResources*/(9);
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this;
		
		switch (cmd)
		{
		case "cmd_import":
			me.down("[name=d_file]").show();
			break;
		case "cmd_reload":
			me._m3/*loadResources*/();
			break;
		case "cmd_mgr_rcs":
			break;
		case "cmd_c_files":
			me._m2/*registerFiles*/();
			break;
		}
	},
	
	_m1/*initApp*/: function() {
		var me = this,
			d_file = me.down("[name=d_file]"),
			d_file_el = d_file.el.dom,
			m_fileupload = $(".m_fileupload", d_file_el),
			d_upfiles = me.down("[name=d_upfiles]"),
			fileupload, dropzone, d_progress;
			
		m_fileupload.empty();
		
		fileupload = $("<input type='file' name='files[]' data-url='upload' multiple></input>").appendTo(m_fileupload);
		dropzone = $("<div class='filedropzone fade well'>Drop files here</div>").appendTo(m_fileupload);
		d_progress = $("<div class='file-progress'><div class='bar' style='width: 0%;'></div></div>").appendTo(m_fileupload);
		
		fileupload.fileupload({
			url: ig$/*appoption*/.servlet,
	        dataType: "text",
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
				
				if (dp && dp.length)
				{
					d_upfiles.show();
					
					for (i=0; i < dp.length; i++)
					{
						d_upfiles.store.add(dp[i]);
					}
				}
	        },
	        progressall: function (e, data) {
	            var progress = parseInt(data.loaded / data.total * 100, 10),
	            	bar = $(".bar", d_progress);
	            bar.css(
	                "width",
	                progress + "%"
	            );
	            bar.text("Loaded " + data.loaded + " / " + data.total);
	        },
	 
	        dropZone: dropzone
	    }).bind('fileuploadsubmit', function (e, data) {
	    });
	    
	    fileupload.fileupload("option", "url", ig$/*appoption*/.servlet);
	    
	    me._m3/*loadResources*/();
	},
	
	_m2/*registerFiles*/: function() {
		var me = this,
			i,
			d_upfiles = me.down("[name=d_upfiles]"),
			dgrid = me.down("[name=dgrid]"),
			store = d_upfiles.store,
			rec, addr = [],
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			ds = dgrid.store,
			dmap = {};
		
		for (i=0; i < ds.data.items.length; i++)
		{
			rec = ds.data.items[i];
			dmap[rec.get("name")] = rec.get("uid");
		}
		
		for (i=0; i < store.data.items.length; i++)
		{
			rec = store.data.items[i];
			addr.push("<item uid='" + rec.get("uid") + "' name='" + rec.get("filename") + "'" + (dmap[rec.get("filename")] ? " ouid='" + dmap[rec.get("filename")] + "'" : "") + "/>");
		}
		
		if (addr.length)
		{
			addr = "<smsg>" + addr.join("") + "</smsg>";
			
			req.init(me, 
				{
		            ack: "11",
		            payload: addr,
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'reg_rcs', buid: me.uid})
		        }, me, function(xdoc) {
		        	me._m3/*loadResources*/(1);
		        }, false);
			req._l/*request*/();
		}
	},
	
	_m3/*loadResources*/: function(bmode) {
		var me = this,
			dgrid = me.down("[name=dgrid]"),
			req_g = new IG$/*mainapp*/._I3e/*requestServer*/(),
			mname = "DashboardResources";
		
		if (bmode == 1)
		{
			d_upfiles = me.down("[name=d_upfiles]");
			d_upfiles.store.removeAll();
			d_upfiles.hide();
			me.down("[name=d_file]").hide();
		}
		
		if (!me.gobj)
		{
			req_g.init(me, 
				{ 
		            ack: "11",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: "/" + mname, name: mname, type: "Workspace", post: "create", duty: "everyone", mode: "s"}, "uid;type;name;post;duty;mode"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'translate'})
		        }, me, function(xdoc) {
		        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		        	
		        	if (tnode)
		        	{
		        		me.gobj = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
		        		
		        		me._m3a/*loadResource*/(me.gobj.uid, bmode, "global", new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
							var me = this;
							if (me.uid && me.cmode == "page")
							{
								me._m3a/*loadResource*/(me.gobj.uid, bmode, "page");
							}
						}));
			    	}
		        }, false);
			req_g._l/*request*/();
		}
		else
		{
			me._m3a/*loadResource*/(me.gobj.uid, bmode, "global", new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
				var me = this;
				if (me.uid && me.cmode == "page")
				{
					me._m3a/*loadResource*/(me.gobj.uid, bmode, "page");
				}
			}));
		}
	},
	
	_m3a/*loadResource*/: function(muid, bmode, ctype, callback) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			dgrid = me.down("[name=dgrid]");
			
		req.init(me, 
			{ 
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: muid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'folder'})
	        }, me, function(xdoc) {
	        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
	        		tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
	        		i, dp = [], p, rec;
	        	
	        	if (tnodes)
	        	{
		        	for (i=0; i < tnodes.length; i++)
		        	{
		        		p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
		        		p.btype = ctype;
		        		if (p.name.indexOf(".") > -1)
		        		{
		        			p.fileext = p.name.substring(p.name.lastIndexOf(".") + 1);
		        		}
		        		dp.push(p);
		        	}
	        	}
	        	
	        	for (i=dgrid.store.data.items.length-1; i>=0; i--)
	        	{
	        		rec = dgrid.store.data.items[i];
	        		
	        		if (rec.get("btype") == ctype)
	        		{
	        			dgrid.store.remove(rec);
	        		}
	        	}
	        	
	        	for (i=0; i < dp.length; i++)
	        	{
	        		dgrid.store.add(dp[i]);
	        	}
	        	
	        	if (bmode == 9)
				{
					me.commitCode();
				}
				
				callback && callback.execute();
	        	
	        }, false);
		req._l/*request*/();
	},
	
	_l2/*removeItem*/: function(rec) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			address = "<smsg><item uid='" + rec.get("uid") + "'/></smsg>",
			dgrid = me.down("[name=dgrid]");
			
		req.init(me, 
			{
	            ack: "30",
                payload: address,
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "delete"})
	        }, me, function(xdoc) {
	        	dgrid.store.remove(rec);
	        }, null);
		req._l/*request*/();
	},
		
	initComponent : function() {
		var me = this;
		
		$s.apply(this, {
			tbar: [
				{
	            	iconCls: "icon-toolbar-import",
	            	tooltip: IRm$/*resources*/.r1("L_IMPORT_FILE"),
	            	text: IRm$/*resources*/.r1("L_IMPORT_FILE"),
	            	handler: function() {this._t$/*toolbarHandler*/("cmd_import"); },
	            	scope: this
	            },
				{
		        	iconCls: "icon-refresh",
		        	tooltip: "Reload",
		        	handler: function() {
		        		this._t$/*toolbarHandler*/("cmd_reload"); 
		        	},
		        	scope: this
		        },
		        "-",
		        {
		        	iconCls: "icon-toolbar-runreport",
		        	tooltip: "Open Dashboard Resources",
		        	handler: function() {
		        		this._t$/*toolbarHandler*/("cmd_mgr_rcs"); 
		        	},
		        	scope: this
		        }
			],
			items: [
				
				{
					xtype: "container",
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							html: "<div class='m_fileupload'></div>",
							name: "d_file",
							height: 120,
							hidden: true,
							bodyPadding: 10
						},
						{
							name: "d_upfiles",
							xtype: "gridpanel",
							height: 120,
							hidden: true,
							selType: "checkboxmodel",
							selModel:  {
								mode: "MULTI"
							},
							store: {
								fields: [
									"uid", "filename", "fileext"
								]
							},
							columns: [
								{
									text: IRm$/*resources*/.r1("L_FILENAME"),
									dataIndex: "filename",
									flex: 1
								},
								{
									text: IRm$/*resources*/.r1("L_FILEEXT"),
									dataIndex: "fileext",
									flex: 1
								},
								{
									xtype: 'actioncolumn',
									width: 20,
									items: [
										{
											iconCls: "icon-grid-delete",
											tooltip: 'Delete item',
											handler: function (grid, rowIndex, colIndex) {
												var rec = grid.store.getAt(rowIndex);
												
												grid.store.remove(rec);
											}
										}
									]
								}
							],
							fbar: [
								"->",
								{
									xtype: "button",
									text: "Commit All Files",
									handler: function() {
										this._t$/*toolbarHandler*/("cmd_c_files");
									},
									scope: this
								},
								{
									xtype: "button",
									text: "Cancel All Files",
									handler: function() {
										var me = this,
											d_upfiles = me.down("[name=d_upfiles]");
											
										d_upfiles.store.removeAll();
										d_upfiles.hide();
										
										me.down("[name=d_file]").hide();
									},
									scope: this
								}
							]
						},
						{
							xtype: "gridpanel",
							name: "dgrid",
							flex: 1,
							selType: "checkboxmodel",
							selModel:  {
								mode: "MULTI"
							},
							store: {
								fields: [
									"uid", "name", "type", "filename", "btype", "memo", "imgwidth", "imgheight", "fileext"
								]
							},
							columns: [
								{
									text: IRm$/*resources*/.r1("B_TYPE"),
									width: 100,
									dataIndex: "btype"
								},
								{
									text: IRm$/*resources*/.r1("B_NAME"),
									flex: 1,
									dataIndex: "name"
								},
								{
									text: IRm$/*resources*/.r1("L_FILENAME"),
									flex: 1,
									dataIndex: "memo"
								},
								{
									text: IRm$/*resources*/.r1("L_FILEEXT"),
									width: 120,
									dataIndex: "fileext"
								},
//								{
//									text: IRm$/*resources*/.r1("L_PRV_DATA"),
//									menuDisabled: true,
//									width: 120,
//									renderer: function(value, data, record) {
//										return "<div class='ig-navi-itemicon' style='height:80px'><img src='" + ig$/*appoption*/.servlet + "?sreq=resource&_rcs_=" + record.get("uid") + "&_mts_=" + IG$/*mainapp*/._g$a/*global_mts*/ + "'></img></div>";
//									}
//								},
								{
									text: IRm$/*resources*/.r1("B_WIDTH"),
									dataIndex: "imgwidth",
									width: 80
								},
								{
									text: IRm$/*resources*/.r1("B_HEIGHT"),
									dataIndex: "imgheight",
									width: 80
								},
								{
									xtype: 'actioncolumn',
									width: 40,
									items: [
									    
										{
											iconCls: "icon-grid-delete",
											tooltip: 'Delete item',
											handler: function (grid, rowIndex, colIndex) {
												var me = this,
													rec = grid.store.getAt(rowIndex);
												IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("B_CD_MHS", rec.get("name")), function(dlg) {
													if (dlg == "yes")
													{
														rec && me._l2/*removeItem*/(rec);
													}
												});
											},
											scope: this
										}
									]
								}
							],
							listeners: {
								cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
									var me = this,
										fext = record.get("fileext"),
										ftype = (/png|gif|jpg|jpeg/).test(fext);
									
									if (cellIndex == 2 && ftype)
									{
										var dlg = new IG$/*mainapp*/._dRp/*dashboard_rcsmgr_preview*/({
											uid: record.get("uid")
										});
										IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
									}
								},
								scope: this
							}
						}
					]
				}
			]
		});
		
		IG$/*mainapp*/._dR/*dashboard_rcsmgr*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj._m1/*initApp*/();
		}
	}
});

IG$/*mainapp*/._xA/*mgr_dashboard*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	scroll: false,
	initialized: false,
	closable: true,
	"layout": "fit",
	bodyPadding: 5,
	iconCls: "icon-ing-docdef",
	
	curnode: null,
	cursop: null,
	
	_1/*init*/: function() {
		var me = this;
		
		if (me._cmode == 2)
		{
			me._IFd/*init_f*/("BusinessLogic", 0);
		}
		else
		{
			me._IFd/*init_f*/("BusinessProcess", 0);
			me._IFd/*init_f*/("DashboardResources", 1);
		}
	},
	
	_IFd/*init_f*/: function(mname, ptype) {
		var me = this,
			mtree,
			m_navi = this.down("[name=m_navi]"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
	            ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: "/" + mname, name: mname, type: "Workspace", post: "create", duty: "everyone", mode: "s"}, "uid;type;name;post;duty;mode"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "translate"})
	        }, me, function(xdoc) {
	        	var me = this,
	        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
	        		tuid = tnode ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid") : null,
	        		m_1;
	        		
	        	if (tuid)
	        	{
	        		if (ptype == 0)
	        		{
			        	mtree = new IG$/*mainapp*/._Idd/*explorerTree*/({
							name: "mtree",
							rootuid: tuid,
							_s1/*showcustommenu*/: function(rec) {
								var me = this,
									menu = this.customMenu,
									typename = rec.get("type").toLowerCase(),
									itemname = rec.get("name"),
									itemaddr = rec.get("nodepath"),
									itemuid = rec.get("uid"),
									itemtype = rec.get("type"),
									writable = (rec.get("writable") == "T" || rec.get("manage") == "T") ? true : false,
									manageable = (rec.get("manage") == "T") ? true : false,
									r = false;
									
								menu.removeAll();
								        						
								if (writable || manageable)
								{
									r = true;
									menu.add(
										{
									    	text: IRm$/*resources*/.r1("B_FOLDER"),
									    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
									    	handler: function() {
									    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, rec);
								   	   		},
								   	   		scope: this
									    }
									);
									
									if (typename == "folder")
									{
										menu.add(
											{
										    	text: IRm$/*resources*/.r1("L_REMOVE"),
										    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
										    	handler: function() {
										    		this._IHf/*deleteMetaObject*/.call(this, itemuid, rec);
									   	   		},
									   	   		scope: this
										    }
										);
									}
								}
								
								return r;
							},
							_i4/*itemExpandHandler*/: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs__i3/*cellClickHandler*/),
							_i3/*cellClickHandler*/: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs__i3/*cellClickHandler*/)
						});
					
						m_navi.add(mtree);
					}
					else if (ptype == 1)
					{
						m_1 = me.down("[name=m_1]");
						m_1.uid = tuid;
						m_1._IFe/*initF*/.call(m_1);
					}
				}
				
	        });
		req._l/*request*/();
	},
	
	rs__i3/*cellClickHandler*/: function(node) {
		var me = this,
			t_btn = me.down("[name=t_btn]");
					
		t_btn.setDisabled(true);
		
		me._s1 = node;
		
		if (node.get("writable") == "T" || node.get("manageable") == "T")
		{
			t_btn.setDisabled(false);
		}
		
		me.l1/*loadContent*/(node);
	},
	
	l1/*loadContent*/: function(node) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: node.get("uid")}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: ''})
	        }, panel, function(xdoc) {
	        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					tnodes = (tnode) ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
					dp = [],
					g1 = this.down("[name=g1]"),
					i, p;
				
				if (tnodes)
				{
					for (i=0; i < tnodes.length; i++)
					{
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						
						if ((panel._cmode == 2 && p.type == "JavaClass") || (panel._cmode !=2 && p.type == "ClassModule"))
						{
							dp.push(p);
						}
					}
				}
				g1.store.loadData(dp);
	        }, false);
		req._l/*request*/();
	},
	
	_d/*createItem*/: function(itemtype) {
		var me = this,
			mtree = me.down("[name=mtree]");
		
		if (me._s1)
		{
			mtree._I90/*createMetaObject*/.call(mtree, itemtype, me._s1.get("uid"), me._s1.get("nodepath"), me._s1);
		}
	},
	
    initComponent: function(){
    	var me = this;
		
		me.title = IRm$/*resources*/.r1("I_MGR_DBD");
		
		me.items = [
			{
				xtype: "panel",
				layout: "card",
				border: 0,
				defaults: {
					deferredRender: false
				},
				name: "n_c",
				dockedItems: [
					{
						xtype: "toolbar",
						dock: "top",
						hidden: me._cmode == 2,
						items: [
							{
								xtype: "displayfield",
								value: IRm$/*resources*/.r1("L_SEL_MODE")
							},
							"-",
							{
								xtype: "button",
								text: IRm$/*resources*/.r1("L_CLASS_MOD"),
								name: "b_0",
								pressed: 1,
								handler: function() {
									var me = this,
										l = me.down("[name=n_c]").getLayout();
									me.down("[name=b_0]").toggle(true);
									me.down("[name=b_1]").toggle(false);
									me.down("[name=b_2]").toggle(false);
									l.setActiveItem(0);
								},
								scope: this
							},
							{
								xtype: "button",
								name: "b_1",
								text: IRm$/*resources*/.r1("L_RESOURCE"),
								handler: function() {
									var me = this,
										l = me.down("[name=n_c]").getLayout();
									me.down("[name=b_0]").toggle(false);
									me.down("[name=b_1]").toggle(true);
									me.down("[name=b_2]").toggle(false);
									l.setActiveItem(1);
								},
								scope: this
							},
							{
								xtype: "button",
								name: "b_2",
								text: IRm$/*resources*/.r1("L_MENU"),
								handler: function() {
									var me = this,
										l = me.down("[name=n_c]").getLayout();
									me.down("[name=b_0]").toggle(false);
									me.down("[name=b_1]").toggle(false);
									me.down("[name=b_2]").toggle(true);
									l.setActiveItem(2);
								},
								scope: this
							}
						]
					}
				],
				items: [
		            {
		            	xtype: "panel",
		            	"layout": "border",
		            	name: "m_0",
		            	border: false,
		            	title: IRm$/*resources*/.r1("L_CLASS_MOD"),
		            	items: [
							{
			            		xtype: "panel",
			            		layout: "fit",
			            		region: "west",
								collapsed: false,
			            		width: 200,
			            		title: IRm$/*resources*/.r1("L_NAVIGATOR"),
			            		name: "m_navi",
			            		tbar: [
			            			{
			            				xtype: "button",
			            				name: "t_btn",
			            				text: IRm$/*resources*/.r1("L_CREATE_ITEM"),
			            				disabled: true,
			            				menu: {
			            					xtype: "menu",
									        items: 
										        me._cmode == 2 ? 
										        [
										        	{
										            	text: IRm$/*resources*/.r1("D_JAVAPACKAGE"),
										            	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"], 
										            	handler: function() {
										            		this._d/*createItem*/("JavaPackage");
										            	},
										            	scope: this
										            },
										            "-",
										            {
										            	text: IRm$/*resources*/.r1("D_JAVACLASS"),
										            	hidden: ig$/*appoption*/.fm/*features*/["ig_n_jcm"], 
										            	handler: function() {
										            		this._d/*createItem*/("JavaClass");
										            	},
										            	scope: this
										            }
										        ]
										        :
										        [
										            {
										            	text: IRm$/*resources*/.r1("B_FOLDER"),
										            	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"], 
										            	handler: function() {
										            		this._d/*createItem*/("Folder");
										            	},
										            	scope: this
										            },
										            "-",
										            {
										            	text: IRm$/*resources*/.r1("D_CLASSMODULE"),
										            	hidden: ig$/*appoption*/.fm/*features*/["ig_n_jcm"], 
										            	handler: function() {
										            		this._d/*createItem*/("ClassModule");
										            	},
										            	scope: this
										            }
										        ]
									    }
			            			},
			            			{
			            				xtype: "button",
			            				iconCls: "icon-refresh",
			            				tooltip: IRm$/*resources*/.r1("L_REFRESH"),
						            	handler: function() {
						            		var me = this,
						            			mtree = me.down("[name=mtree]"),
						            			tnode = mtree.getRootNode();
						            			
						            		mtree._I92/*refreshNode*/.call(mtree, tnode);
						            	},
						            	scope: this
			            			}
			            		],
			            		items: [
			        				
			            		]
			            	},
			            	{
			            		xtype: "panel",
			            		region: "center",
			            		flex: 1,
			            		layout: "fit",
			            		tbar: [
			            			{
			            				text: "Compile",
			            				handler: function() {
			            					var panel = this,
												g1 = panel.down("[name=g1]"),
												address = "<smsg>",
												checked = g1.getSelectionModel().selected,
												rec,
												itemcnt = 0,
												req = new IG$/*mainapp*/._I3e/*requestServer*/();
											
											IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, "Confirm to compile selected content?", function(e) {
												if (e == "yes")
												{
													if (checked.length > 0)
													{
														for (i=0; i < checked.length; i++)
														{
															rec = checked.items[i];
															address += "<item uid='" + rec.get("uid") + "' option='compile'/>";
															itemcnt++;
														}
														
														address += "</smsg>";
														
														if (itemcnt > 0)
														{
															panel.setLoading(true);
															
															req.init(panel, 
																{
														            ack: "73",
													                payload: address,
													                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "compile"})
														        }, panel, function(xdoc) {
														        	var i, j,
														        		g1 = panel.down("[name=g1]"),
														        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
														        		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
														        		rec, uid, st;
														        	
														        	for (i=0; i < tnodes.length; i++)
														        	{
														        		uid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "uid");
														        		st = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "status");
														        		rec = null;
														        		for (j=0; j < g1.store.data.items.length; j++)
														        		{
														        			if (g1.store.data.items[j].get("uid") == uid)
														        			{
														        				rec = g1.store.data.items[j];
														        				break;
														        			}
														        		}
														        		
														        		if (rec)
														        		{
														        			rec.set("msg", st == "S" ? "Success" : "Error");
														        		}
														        	}
														        }, null);
															req._l/*request*/();
														}
													}
												}
											});
			            				},
			            				scope: this
									},
			            			{
										text: IRm$/*resources*/.r1("B_REMOVE"),
										handler: function() {
											var panel = this,
												g1 = panel.down("[name=g1]"),
												address = "<smsg>",
												checked = g1.getSelectionModel().selected,
												rec,
												itemcnt = 0,
												req = new IG$/*mainapp*/._I3e/*requestServer*/();
											
											IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, "Confirm to delete content?", function(e) {
												if (e == "yes")
												{
													if (checked.length > 0)
													{
														for (i=0; i < checked.length; i++)
														{
															rec = checked.items[i];
															address += "<item uid='" + rec.get("uid") + "'/>";
															itemcnt++;
														}
														
														address += "</smsg>";
														
														if (itemcnt > 0)
														{
															panel.setLoading(true);
															
															req.init(panel, 
																{
														            ack: "30",
													                payload: address,
													                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "delete"})
														        }, panel, function(xdoc) {
														        	var i;
														        	for (i=checked.length-1; i>=0; i--)
														        	{
														        		g1.store.remove(checked.items[i]);
														        	}
														        }, null);
															req._l/*request*/();
														}
													}
												}
											});
										},
										scope: this
									}
			            		],
			            		items: [
			            			{
			            				xtype: "gridpanel",
										name: "g1",
										selType: "checkboxmodel",
										selModel: {
											checkSelector: ".x-grid-cell",
											mode: "MULTI"
										},
			            				store: {
			            					xtype: "store",
			            					fields: [
			            						"uid", "name", "description", "nodepath", "type", "writable", "msg"
			            					]
			            				},
			            				columns: [
			            					{
			            						text: IRm$/*resources*/.r1("B_NAME"),
			            						dataIndex: "name",
			            						width: 250
			            					},
			            					{
			            						text: IRm$/*resources*/.r1("B_DESC"),
			            						dataIndex: "description",
			            						flex: 1
			            					},
			            					{
			            						text: "Message",
			            						dataIndex: "msg",
			            						width: 80
			            					},
			            					{
			            						xtype: "actioncolumn",
			            						width: 30,
												menuDisabled: true,
												items: [
													{
														iconCls: "icon-grid-config",
														tooltip: IRm$/*resources*/.r1('L_EDIT'),
														handler: function (grid, rowIndex, colIndex) {
															var grd = grid,
																store = grd.store,
																rec = store.getAt(rowIndex),
																mp = IG$/*mainapp*/._I7d/*mainPanel*/;
																
															if (mp)
															{
																mp.m1$7/*navigateApp*/.call(mp, rec.get("uid"), rec.get("type").toLowerCase(), rec.get("name"), rec.get("nodepath"), true, rec.get("writable") == "T");
															}
														},
														scope: this
													}
												]
			            					}
			            				],
			            				listeners: {
			            					cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eopts) {
			            						if (cellIndex == 3)
			            						{
			            							var grd = grid,
														store = grd.store,
														rec = store.getAt(rowIndex),
														mp = IG$/*mainapp*/._I7d/*mainPanel*/;
														
													if (mp)
													{
														mp.m1$7/*navigateApp*/.call(mp, rec.get("uid"), rec.get("type").toLowerCase(), rec.get("name"), rec.get("nodepath"), true, rec.get("writable") == "T");
													}
			            						}
			            					},
			            					scope: this
			            				}
			            			}
			            		]
			            	}
		            	]
		            },
		            new IG$/*mainapp*/._dR/*dashboard_rcsmgr*/({
		            	cmode: "global",
		            	title: IRm$/*resources*/.r1("L_RESOURCE"),
		            	name: "m_1"
		            }),
		            new IG$/*mainapp*/._I7_/*dashboardmenu*/({
		            	title : IRm$/*resources*/.r1("L_MENU"),
		            	name: "m_2"
		            })
				]
			}
		];
		
		this.listeners = {
			afterrender: function(tobj) {
				tobj._1/*init*/.call(tobj);
			}
		}

		IG$/*mainapp*/._xA/*mgr_dashboard*/.superclass.initComponent.call(this);
    }
});

IG$/*mainapp*/._I7k/*systemlookup*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	scroll: false,
	initialized: false,
	closable: true,
	"layout": "fit",
	bodyPadding: 5,
	iconCls: "icon-ing-docdef",
	
	curnode: null,
	cursop: null,
	
	_IFd/*init_f*/: function() {
		var me = this,
			mtree,
			m_navi = this.down("[name=m_navi]"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
	            ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: "/SYS_Lookup", name: "SYS_Lookup", type: "Workspace", post: "create", duty: "everyone", mode: "s"}, "uid;type;name;post;duty;mode"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "translate"})
	        }, me, function(xdoc) {
	        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
	        		tuid = tnode ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid") : null;
	        		
	        	if (tuid)
	        	{
	        		me.tuid = tuid;
	        		
		        	mtree = new IG$/*mainapp*/._Idd/*explorerTree*/({
						name: "mtree",
						rootuid: tuid,
						rootname: "Code Mapping",
						_s1/*showcustommenu*/: function(rec) {
							var me = this,
								menu = this.customMenu,
								typename = rec.get("type").toLowerCase(),
								itemname = rec.get("name"),
								itemaddr = rec.get("nodepath"),
								itemuid = rec.get("uid"),
								itemtype = rec.get("type"),
								writable = (rec.get("writable") == "T" || rec.get("manage") == "T") ? true : false,
								manageable = (rec.get("manage") == "T") ? true : false,
								r = false;
								
							menu.removeAll();
							        						
							if (writable || manageable)
							{
								r = true;
								menu.add({
							    	text: IRm$/*resources*/.r1("B_FOLDER"),
							    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
							    	handler: function() {
							    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, rec);
						   	   		},
						   	   		scope: this
							    });
								
								menu.add({
							    	text: IRm$/*resources*/.r1("L_RENAME_ITEM", itemname),
							    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_ren"],
							    	handler: function() {
							    		this._I91/*renameMetaObject*/.call(this, itemname, itemuid, itemaddr, record);
						   	   		},
						   	   		scope: this
							    });
							}
							
							return r;
						},
						_i4/*itemExpandHandler*/: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs__i3/*cellClickHandler*/),
						_i3/*cellClickHandler*/: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs__i3/*cellClickHandler*/)
					});
				
					m_navi.add(mtree);
				}
				
	        });
		req._l/*request*/();
	},
	
	rs__i3/*cellClickHandler*/: function(node) {
		var me = this,
			t_btn = me.down("[name=t_btn]");
					
		t_btn.setDisabled(true);
		
		me._s1 = node;
		
		if (node.get("writable") == "T" || node.get("manageable") == "T")
		{
			t_btn.setDisabled(false);
		}
		
		me.l1/*loadContent*/(node);
	},
	
	l1/*loadContent*/: function(node) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: node.get("uid")}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: ''})
	        }, panel, function(xdoc) {
	        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					tnodes = (tnode) ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
					dp = [],
					g1 = this.down("[name=g1]"),
					i, p;
				
				if (tnodes)
				{
					for (i=0; i < tnodes.length; i++)
					{
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						
						if (p.type == "CodeMap")
						{
							dp.push(p);
						}
					}
				}
				g1.store.loadData(dp);
	        }, false);
		req._l/*request*/();
	},
	
	_d/*createItem*/: function(itemtype) {
		var me = this,
			mtree = me.down("[name=mtree]");
		
		if (me._s1)
		{
			mtree._I90/*createMetaObject*/.call(mtree, itemtype, me._s1.get("uid"), me._s1.get("nodepath"), me._s1);
		}
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this,
			g1,
			sel, rec,
			itemcnt = 0,
			iscopy = false;
			
		switch (cmd)
		{
		case "cmd_rename":
			g1 = me.down("[name=g1]");
			sel = g1.getSelectionModel().selected;
			
			if (sel && sel.length > 0)
			{
				rec = sel.items[0];
				
				var dlgpop = new IG$/*mainapp*/._Icd/*makeItemEditor*/(
					{
						itemname: rec.get("name"),
						uid: rec.get("uid"),
						nodepath: rec.get("nodepath"),
						itemtype: rec.get("type"),
						memo: rec.get("memo") || "",
						callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
							
						})
					}
				);
				
				IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgpop);
			}
			break;
		case "cmd_move":
			g1 = me.down("[name=g1]");
			sel = g1.getSelectionModel().selected;
			
			if (sel && sel.length > 0)
			{
				var me = this,
					dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
						visibleItems: 'workspace;folder',
						targetobj: "folder",
						u5x/*treeOptions*/: {
							cubebrowse: false,
							rootuid: me.tuid
						},
						callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
							if (item)
							{
								IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("B_CD_MHS", item.name), function(dlg) {
									if (dlg == "yes")
									{
										address = "<smsg>";
										itemcnt = 0;
										
										for (i=0; i < sel.length; i++)
										{
											rec = sel.items[i];
											if (rec.get("writable") == "T" || rec.get("manage") == "T")
											{
												address += "<item uid='" + rec.get("uid") + "'/>";
												itemcnt++;
											}
										}
										
										address += "</smsg>";
										
										if (itemcnt > 0)
										{
											me.setLoading(true);
											req = new IG$/*mainapp*/._I3e/*requestServer*/();
											req.init(me, 
												{
										            ack: "11",
									                payload: address,
									                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: (iscopy == true ? "copy" : "move"), target: item.uid})
										        }, me, function(xdoc) {
										        	var me = this,
								            			mtree = me.down("[name=mtree]"),
								            			tnode = mtree.getRootNode();
								            			
								            		mtree._I92/*refreshNode*/.call(mtree, tnode);
										        }, null, null);
											req._l/*request*/();
										}
									}
								});
							}
						})
					});
				IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
			}
			break;
		case "cmd_delete":
			g1 = me.down("[name=g1]");
			sel = g1.getSelectionModel().selected;
			
			if (sel && sel.length > 0)
			{
				rec = sel.items[0];
				
				IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, "Confirm to delete content?", function(e) {
					if (e == "yes")
					{
						var req = new IG$/*mainapp*/._I3e/*requestServer*/();
						req.init(me, 
							{
								ack: "7",
								payload: "<smsg><item uid='" + rec.get("uid") + "'/></smsg>",
								mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
							}, me, function(xdoc) {
								g1.store.remove(rec);
							}, null);
						req._l/*request*/();
					}
				});
			}
			break;
		case "cmd_export_meta":
			IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("T_EXP_MC"), IRm$/*resources*/.r1("T_EXP_MC_Q"), function(dlg) {
				var panel = me,
					meta,
					req = new IG$/*mainapp*/._I3e/*requestServer*/(),
					i, rec,
					payload;
				
				meta = {
					uid: panel.tuid,
					name: "SYS_Lookup",
					type: "Workspace",
					nodepath: "/SYS_Lookup"
				};
					
				if (meta && meta.uid && dlg == "yes")
				{
					payload = "<smsg>";
					payload += "<item" + IG$/*mainapp*/._I20/*XUpdateInfo*/(meta, "uid;nodepath;name;type", "s") + "/>";
					payload += "</smsg>";
					req.init(panel, 
						{
				            ack: "5",
			                payload: payload,
			                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({output: "file"})
				        }, panel, function(xdoc) {
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
					    				{name: "payload", value: fpath},
					    				{name: "mbody", value: filename},
					    				{name: "_mts_", value: (IG$/*mainapp*/._g$a/*global_mts*/ || "")}
					    			], 'POST');
								}
							}
				        }, null);
					req._l/*request*/();
				}
			}, me, me);
			break;
		}
	},
	
    initComponent: function(){
    	var me = this;
		
		me.items = [
            {
            	xtype: "panel",
            	"layout": "border",
            	border: false,
            	items: [
					{
	            		xtype: "panel",
	            		layout: "fit",
	            		region: "west",
						collapsed: false,
	            		width: 200,
	            		title: "Navigator",
	            		name: "m_navi",
	            		tbar: [
	            			{
	            				xtype: "button",
	            				name: "t_btn",
	            				text: IRm$/*resources*/.r1("B_CR"),
	            				disabled: true,
	            				menu: {
	            					xtype: "menu",
							        items: [
							            {
							            	text: IRm$/*resources*/.r1("B_FOLDER"),
							            	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"], 
							            	handler: function() {
							            		this._d/*createItem*/("Folder");
							            	},
							            	scope: this
							            },
							            "-",
							            {
							            	text: IRm$/*resources*/.r1("L_CODEMAPPING"),
							            	hidden: ig$/*appoption*/.fm/*features*/["ig_n_lk"], 
							            	handler: function() {
							            		this._d/*createItem*/("CodeMap");
							            	},
							            	scope: this
							            }
							        ]
							    }
	            			},
	            			{
	            				xtype: "button",
	            				iconCls: "icon-refresh",
	            				tooltip: IRm$/*resources*/.r1("L_REFRESH"),
				            	handler: function() {
				            		var me = this,
				            			mtree = me.down("[name=mtree]"),
				            			tnode = mtree.getRootNode();
				            			
				            		mtree._I92/*refreshNode*/.call(mtree, tnode);
				            	},
				            	scope: this
	            			}
	            		],
	            		items: [
	        				
	            		]
	            	},
	            	{
	            		xtype: "panel",
	            		region: "center",
	            		flex: 1,
	            		layout: "fit",
						tbar: [
							{
								xtype: "button",
								text: IRm$/*resources*/.r1("L_RENAME"),
								handler: function() {
									this._t$/*toolbarHandler*/("cmd_rename");
								},
								scope: this
							},
							{
								xtype: "button",
								text: IRm$/*resources*/.r1("L_MOVE"),
								handler: function() {
									this._t$/*toolbarHandler*/("cmd_move");
								},
								scope: this
							},
							{
								xtype: "button",
								text: IRm$/*resources*/.r1("L_REMOVE"),
								handler: function() {
									this._t$/*toolbarHandler*/("cmd_delete");
								},
								scope: this
							},
							"->",
							{
								text: IRm$/*resources*/.r1("L_EXPORT_META"),
								handler: function() {
									this._t$/*toolbarHandler*/("cmd_export_meta");
								},
								scope: this
							}
						],
	            		items: [
	            			{
	            				xtype: "gridpanel",
								name: "g1",
	            				store: {
	            					xtype: "store",
	            					fields: [
	            						"uid", "name", "description", "nodepath", "type", "writable"
	            					]
	            				},
	            				selType: "checkboxmodel",
								selModel: {
									checkSelector: ".x-grid-cell",
									mode: "SINGLE"
								},
	            				columns: [
	            					{
	            						text: IRm$/*resources*/.r1("B_NAME"),
	            						dataIndex: "name",
	            						tdCls: "igc-td-link"
	            					},
	            					{
	            						text: IRm$/*resources*/.r1("B_DESC"),
	            						dataIndex: "description",
	            						flex: 1
	            					},
	            					{
	            						xtype: "actioncolumn",
	            						width: 30,
										menuDisabled: true,
										items: [
											{
												iconCls: "icon-grid-config",
												tooltip: IRm$/*resources*/.r1('L_EDIT'),
												handler: function (grid, rowIndex, colIndex) {
													var grd = grid,
														store = grd.store,
														rec = store.getAt(rowIndex),
														mp = IG$/*mainapp*/._I7d/*mainPanel*/;
														
													if (mp)
													{
														mp.m1$7/*navigateApp*/.call(mp, rec.get("uid"), rec.get("type").toLowerCase(), rec.get("name"), rec.get("nodepath"), false, rec.get("writable") == "T");
													}
												},
												scope: this
											}
										]
	            					}
	            				],
	            				listeners: {
	            					cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eopts) {
	            						if (cellIndex == 1)
	            						{
	            							var grd = tobj,
												store = grd.store,
												rec = store.getAt(rowIndex),
												mp = IG$/*mainapp*/._I7d/*mainPanel*/;
												
											if (mp)
											{
												mp.m1$7/*navigateApp*/.call(mp, rec.get("uid"), rec.get("type").toLowerCase(), rec.get("name"), rec.get("nodepath"), false, rec.get("writable") == "T");
											}
	            						}
	            					},
	            					scope: this
	            				}
	            			}
	            		]
	            	}
            	]
            }
		];
		
		this.listeners = {
			afterrender: function(tobj) {
				tobj._IFd/*init_f*/.call(tobj);
			}
		}

		IG$/*mainapp*/._I7k/*systemlookup*/.superclass.initComponent.call(this);
    }
});

IG$/*mainapp*/._I70/*resourcemgr*/ = $s.extend($s.panel, {
	
	closable: true,
	iconCls: "icon-ing-docdef",
	
	layout: "fit",
	bodyPadding: 10,
	
	_IFd/*init_f*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.showerror = false;
		req.init(me, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.pp/*parentfullpath*/}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: ""})
	        }, me, me.rs_l1/*loadLocales*/, me.rs_l1/*loadLocales*/);
		req._l/*request*/();
	},
	
	rs_l1/*loadLocales*/: function(xdoc) {
		var me = this,
			tnode = xdoc ? IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item") : null,
			tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			c_loc = me.down("[name=c_loc]"),
			c_loc2 = me.down("[name=c_loc2]"),
			i,
			locale,
			locales = [
				{
					name: "Select locale",
					value: ""
				}
			];
		
		if (tnodes && tnodes.length)
		{
			for (i=0; i < tnodes.length; i++)
			{
				locale = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				locales.push({
					name: locale.name,
					value: locale.uid
				});
			}
		}
		
		c_loc.store.loadData(locales);
		c_loc.setValue("");
		
		c_loc2.store.loadData(locales);
		c_loc2.setValue("");
	},
	
	c1/*changeLocale*/: function(bsecond) {
		var me = this,
			c_loc = me.down("[name=c_loc" + (bsecond ? "2" : "") + "]"),
			grdrcs = me.down("[name=grdrcs]"),
			vcol1 = me.down("[name=vcol1]"),
			vcol2 = me.down("[name=vcol2]"),
			i,
			cval = c_loc.getValue();
			
		if (cval)
		{
			me.F1/*loadContent*/(cval, bsecond);
		}
		else
		{
			if (bsecond)
			{
				vcol2.setText("-");
				for (i=0; i < grdrcs.store.data.items.length; i++)
				{
					grdrcs.store.data.items[i].set("value2", "");
				}
				
				for (i=0; i < grdrcs.__dp.length; i++)
				{
					grdrcs.__dp[i].value2 = "";
				}
			}
			else
			{
				vcol1.setText("-");
				vcol2.setText("-");
				me._gl/*loadGrid*/([]);
			}
		}
	},
	
	_gl/*loadGrid*/: function(dp) {
		var me = this,
			grdrcs = me.down("[name=grdrcs]"),
			_pb_d = me.down("[name=_pb_d]"),
			_pb_c = me.down("[name=_pb_c]"),
			pc = 100,
			mc = Math.ceil(dp.length / pc),
			ndp = [], i;
		
		grdrcs.__dp = dp;
		grdrcs.__p = 0;
		
		for (i=0; i < mc; i++)
		{
			ndp.push({name: "" + (i+1), value: i});
		}
		
		_pb_c.store.loadData(ndp);
		_pb_c.setValue(0);
		
		_pb_c.setDisabled(mc > 1 ? false : true);
		_pb_d.setValue("Count : " + dp.length);
		
		me._g2/*refreshPage*/();
	},
	
	_g2/*refreshPage*/: function(inc) {
		var me = this,
			grdrcs = me.down("[name=grdrcs]"),
			_pb_c = me.down("[name=_pb_c]"),
			_pb_p = me.down("[name=_pb_p]"),
			_pb_d = me.down("[name=_pb_d]"),
			_pb_n = me.down("[name=_pb_n]"),
			sdp = grdrcs.__dp,
			p = grdrcs.__p,
			ndp = [], i,
			pc = 100,
			mp = Math.ceil(sdp.length / pc);
		
		if (inc == 2)
		{
			grdrcs.__p = p = p+1;
		}
		else if (inc == 1 && p > 0)
		{
			grdrcs.__p = p = p-1;
		}
		
		if (inc == 3)
		{
			_pb_d.setValue("Count : " + sdp.length);
		}
		
		if (p * pc > sdp.length)
		{
			grdrcs.__p = p = mp;
		}
		
		_pb_c.setValue(grdrcs.__p);
		
		for (i=p*pc; i < Math.min(sdp.length, (p+1)*pc); i++)
		{
			ndp.push(sdp[i]);
		}
		
		_pb_p.setDisabled(p > 0 ? false : true);
		_pb_n.setDisabled(mp > 0 && mp > p ? false : true);
		
		grdrcs.store.loadData(ndp);
	},
		
	F1/*loadContent*/: function(locale, bsecond) {
		var me = this,
			req;
		
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: locale}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: ""})
	        }, me, me._IM9/*rs_loadContent*/, null, bsecond);
		req._l/*request*/();
	},
	
	_IM9/*rs_loadContent*/: function(xdoc, bsecond) {
		var me = this,
			grdrcs = me.down("[name=grdrcs]"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			tnodes,
			uid, uname,
			vcol1 = me.down("[name=vcol1]"),
			vcol2 = me.down("[name=vcol2]"),
			pmap = {}, rec,
			i, rcs = [], param;
		
		if (tnode)
		{
			uid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid");
			uname = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "name");
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tnodes.length; i++)
			{
				param = {
					locale: uname,
					name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
					group: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "group"),
					value: IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i])
				};
				rcs.push(param);
			}
		}
		
		if (bsecond)
		{
			for (i=0; i < grdrcs.__dp.length; i++)
			{
				rec = grdrcs.__dp[i];
				pmap[rec.name] = rec;
			}
			
			for (i=0; i < grdrcs.store.data.length; i++)
			{
				rec = grdrcs.__dp[i];
				pmap[rec.name] = rec;
			}
			
			for (i=0; i < rcs.length; i++)
			{
				rec = pmap[rcs[i].name];
				if (rec)
				{
					rec.value2 = rcs[i].value;
				}
			}
			
			me._g2/*refreshPage*/();
			
			vcol2.setText(uname);
		}
		else
		{
			vcol1.setText(uname);
			vcol2.setText("-");
			// grdrcs.store.loadData(rcs);
			me._gl/*loadGrid*/(rcs);
		}
	},
		
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this;
		
		switch (cmd)
		{
		case "cmd_save":
			me.s1/*saveContent*/();
			break;
		case "cmd_refresh":
			me._IFd/*init_f*/();
			break;
		case "cmd_delete":
			var grdrcs = me.down("[name=grdrcs]"),
				sel = grdrcs.getSelectionModel().selected,
				rec,
				__dp = grdrcs.__dp,
				sp = grdrcs.__p * 100,
				i, r;
			
			for (i=0; i < sel.length; i++)
			{
				rec = sel.items[i];
				r = grdrcs.store.indexOf(rec);
				grdrcs.store.remove(rec);
				__dp.splice(r, 1);
			}
			
			me._g2/*refreshPage*/(3);
			break;
		case "cmd_add_lcs":
			var grdrcs = me.down("[name=grdrcs]"),
				__dp = grdrcs.__dp;
			
			__dp.splice(0, 0, {
				name: "",
				value: ""
			});
			
			grdrcs.__p = 0;
			me._g2/*refreshPage*/(3);
			break;
		case "cmd_add_lang":
			var dlgpop = new IG$/*mainapp*/._I6e/*makeItem*/({
				parentnodepath: me.pp/*parentfullpath*/,
				itemtype: "PrivateContent",
				parentuid: me.pp/*parentfullpath*/
			});
			dlgpop.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.r_I90/*createMetaObject*/);
			
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgpop);
			break;
		case "cmd_import":
			var pimp = me.down("[name=pimp]");
			pimp.setVisible(true);
			break;
		case "cmd_export":
			var pimp = me.down("[name=pimp]");
			pimp.setVisible(true);
			
			me.x1/*exportConten*/();
			break;
		}
	},
	
	r_I90/*createMetaObject*/: function(xdoc) {
		this._IFd/*init_f*/();
	},
	
	s1/*saveContent*/: function() {
		var me = this,
			c_loc = me.down("[name=c_loc]").getValue();
			
		this.ss1/*saveRcsContent*/(c_loc, true);
	},
	
	ss1/*saveRcsContent*/: function(clang, prime) {
		var me = this,
			grdrcs = me.down("[name=grdrcs]"),
			i, rec, mval, mname,
			req;
		
		if (clang)
		{
			cnt = "<smsg><item>";
			for (i=0; i < grdrcs.__dp.length; i++)
			{
				rec = grdrcs.__dp[i];
				mname = rec.name;
				mval = (prime ? rec.value : rec.value2);
				
				if (mname && mval)
				{
					cnt += "<li name='" + mname + "' group='" + (rec.group || "") + "'><![CDATA[" + mval + "]]></li>";
				}
			}
			cnt += "</item></smsg>";
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "31",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: clang, is_locale: "T"}, "uid;is_locale"),
		            mbody: cnt
		        }, me, me.rs_s1/*saveContent*/, null, prime);
			req._l/*request*/();
		}
		else
		{
			prime && IG$/*mainapp*/._I54/*alertmsg*/(null, IRm$/*resources*/.r1("E_LM_SEL"), null, null, 1, "error");
		}
	},
	
	rs_s1/*saveContent*/: function(xdoc, prime) {
		var me = this;
		
		if (prime)
		{
			var c_loc2 = me.down("[name=c_loc2]").getValue();
			
			if (c_loc2)
			{
				me.ss1/*saveRcsContent*/(c_loc2, false);
				return;
			}
		}
		
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, me, 0, "success");
	},
	
	ca/*importContent*/: function() {
		var me = this,
			timp = me.down("[name=timp]").getValue(),
			grdrcs = me.down("[name=grdrcs]"),
			tval,
			mval,
			v, vv, vn,
			i,
			gname,
			ukey = {},
			rcs = [];
		
		gname = "group";
		tval = timp.split("\n");
		
		for (i=0; i < tval.length; i++)
		{
			mval = tval[i];
			if (mval)
			{
				if (mval.charAt(0) == ';')
				{
					gname = mval.replace(/;/g, "");
					gname = IG$/*mainapp*/.trim12(gname);
				}
				else
				{
					v = mval.split("\t");
					if (v.length > 1)
					{
						vv = IG$/*mainapp*/.trim12(v[1]);
						vn = IG$/*mainapp*/.trim12(v[0]);
						
						if (!ukey[vn])
						{
							if (vv.charAt(0) == '\"' && vv.charAt(vv.length-1) == '\"')
							{
								vv = vv.substring(1, vv.length-1);
							}
							rcs.push({
								group: gname,
								name: vn,
								value: vv
							});
							
							ukey[vn] = 1;
						}
					}
				}
			}
		}
		
		me._gl/*loadGrid*/(rcs);
	},
	
	x1/*exportConten*/: function() {
		var me = this,
			timp = me.down("[name=timp]"),
			grdrcs = me.down("[name=grdrcs]"),
			tval,
			rec,
			v, vv, vn,
			i,
			gname,
			rcs = [],
			t = [];
		
		for (i=0; i < grdrcs.__dp.length; i++)
		{
			rec = grdrcs.__dp[i];
			rcs.push({
				group: rec.group,
				value: rec.name + "\t" + rec.value
			})
		}
		
		rcs.sort(function(a, b) {
			var c = 0;
			
			if (a.group != b.group)
			{
				c = a.group > b.group ? -1 : 1;
			}
			
			return c;
		});
		
		gname = null;
		
		for (i=0; i < rcs.length; i++)
		{
			if (rcs[i].group != gname)
			{
				t.push(";;; " + rcs[i].group);
				gname = rcs[i].group;
			}
			
			t.push(rcs[i].value);
		}
		
		timp.setValue(t.join("\n"));
	},
	
	a1/*appendLocale*/: function(data) {
		var me = this,
			i,
			rec,
			grdrcs = me.down("[name=grdrcs]"),
			gstore = grdrcs.store,
			tmap = [],
			titems = [];
		
		for (i=0; i < data.records.length; i++)
		{
			rec = data.records[i];
			
			titems.push({
				uid: rec.get("uid"),
				name: rec.get("name"),
				type: rec.get("type")
			});
		}
		
		for (i=0; i < gstore.data.items.length; i++)
		{
			rec = gstore.data.items[i];
			tmap[rec.get("name")] = 1;
		}
		
		me.a3/*loadItem*/(titems, tmap);
	},
	
	a3/*loadItem*/: function(titems, tmap) {
		var me = this,
			litems = [];
		
		$.each(titems, function(i, titem) {
			var mf = me.a2/*is_folder*/(titem),
				req;
			
			if (!tmap[titem.name])
			{
				litems.push({
					name: titem.name,
					value: ""
				});
				
				tmap[titem.name] = 1;
			}
			
			if (mf)
			{
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				
				req.init(me, 
					{
			            ack: "5",
		                payload: "<smsg><item" + IG$/*mainapp*/._I20/*XUpdateInfo*/({
		                	uid: titem.uid,  
		                	name: titem.name, type: titem.type
		                }, "uid;nodepath;name;type", "s") + "/></smsg>",
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "metrics"})
			        }, me, function(xdoc) {
			        	var sitems = [],
			        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			        		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			        		p,
			        		i;
			        	
			        	for (i=0; i < tnodes.length; i++)
			        	{
			        		p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			        		sitems.push(p);
			        	}
			        	
			        	if (sitems.length)
			        	{
			        		me.a3/*loadItem*/(sitems, tmap);
			        	}
			        }, null);
				req._l/*request*/();
			}
		});
		
		if (litems.length)
		{
			var grdrcs = me.down("[name=grdrcs]"),
				__dp = grdrcs.__dp,
				i;
			
			for (i=0; i < litems.length; i++)
			{
				__dp.splice(0, 0, litems[i]);
			}
			
			grdrcs.__p = 0;
			me._g2/*refreshPage*/(3);
		}
	},
	
	a2/*is_folder*/: function(t) {
		var tname = t.type.toLowerCase(),
			r = 0;
		
		if ((/workspace|folder|cube|sqlcube|datacube/).test(tname))
		{
			r = 1;
		}
		
		return r;
	},

	initComponent: function() {
		var me = this;
		
		me.pp/*parentfullpath*/ = "/SYS_Config/" + (me.dicmode ? "dictionary" : "locale"),
		
		$s.apply(this, {
			items: [
				{
					xtype: "form",
					layout: {
						type: "vbox",
						align: "stretch"
					},
					border: 0,
					items: [
						{
							xtype: "fieldset",
							name: "pimp",
							title: "Copy-paste your locale document here",
							hidden: true,
							flex: 2,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "textarea",
									name: "timp",
									flex: 1
								},
								{
									xtype: "fieldcontainer",
									layout: {
										type: "hbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "button",
											text: "Import",
											handler: function() {
												this.ca/*importContent*/();
											},
											scope: this
										},
										{
											xtype: "button",
											text: "Close",
											handler: function() {
												var me = this,
													pimp = me.down("[name=pimp]");
													
												pimp.setVisible(false);
											},
											scope: this
										},
										{
											xtype: "container",
											flex: 1
										}
									]
								}
							]
						},
						{
							xtype: "gridpanel",
							name: "grdrcs",
							store: {
								xtype: "store",
								fields: [
									"name", "value", "value2", "locale", "group"
								]
							},
							selType: "checkboxmodel",
							selModel: {
								checkSelector: ".x-grid-cell"
							},
							flex: 3,
							plugins: [
								{
									ptype: "cellediting",
									clicksToEdit: false,
									listeners: {
										edit: function(editor, e, eopts) {
											var me = this,
												rec = e.record,
												field = e.field,
												value = e.value,
												grdrcs = me.down("[name=grdrcs]"),
												r = grdrcs.store.indexOf(rec),
												__dp = grdrcs.__dp,
												__p = grdrcs.__p,
												n = 100,
												rec;
											
											rec = __dp[n*__p + r];
											rec[field] = value;
										},
										scope: this
									}
								}
							],
							viewConfig: me.dicmode ? {
								plugins: {
									ptype: "gridviewdragdrop",
									ddGroup: "_I$RD_G_1"
								},
								__ing: 1,
								listeners: {
									beforedrop: function(node, data, dropRec, dropPosition, dropFunction) {
										var r = false,
											index,
											rc,
											c_loc = me.down("[name=c_loc]");
										
										data.copy = true;
										
										if (c_loc.getValue())
										{
											me.a1/*appendLocale*/.call(me, data);
										}
												
										return r;
									},
									drop: function(node, data, dropRec, dropPosition) {
										var sc = false,
											me = this;
										
										return sc;
									}
								}
							} : null,
							bbar: {
						        xtype: "toolbar",
						        name: "_pb_",
						        items: [
						            {
						            	xtype: "button",
						            	name: "_pb_p",
						            	disabled: true,
						            	iconCls: "x-tbar-page-prev",
						            	handler: function() {
						            		this._g2/*refreshPage*/(1);
						            	},
						            	scope: this
						            },
						            "-",
						            {
										xtype: "combobox",
										name: "_pb_c",
										fieldLabel: "Page",
										labelWidth: 50,
										width: 120,
										queryMode: "local",
										displayField: "name",
										labelField: "name",
										valueField: "value",
										editable: false,
										autoSelect: true,
										disabled: true,
										store: {
											fields: [
												"name", "value"
											]
										},
										listeners: {
											select: function(tobj, newValue, oldValue, eOpts) {
												var me = this,
													grdrcs = me.down("[name=grdrcs]");
												
												grdrcs.__p = Number(tobj.getValue());
												
												me._g2/*refreshPage*/();
											},
											scope: this
										}
									},
						            "-",
						            {
						            	xtype: "button",
						            	name: "_pb_n",
						            	disabled: true,
						            	iconCls: "x-tbar-page-next",
						            	handler: function() {
						            		this._g2/*refreshPage*/(2);
						            	},
						            	scope: this
						            },
						            "->",
						            {
						            	xtype: "displayfield",
						            	name: "_pb_d",
						            	value: "No data to display"
						            }
						        ]
						    },
							columns: [
								{
									xtype: "gridcolumn",
									text: "Group",
									dataIndex: "group",
									width: 200,
									editor: {
										allowBlank: true
									}
								},
								{
									xtype: "gridcolumn",
									text: "Name",
									dataIndex: "name",
									width: 200,
									editor: {
										allowBlank: false
									}
								},
								{
									xtype: "gridcolumn",
									text: "Value",
									name: "vcol1",
									flex: 1,
									dataIndex: "value",
									editor: {
										allowBlank: true
									}
								},
								{
									xtype: "gridcolumn",
									text: "Value",
									name: "vcol2",
									flex: 1,
									dataIndex: "value2",
									editor: {
										allowBlank: true
									}
								}
							]
						}
					]
				}
			],
			tbar: [
				{
					iconCls: "icon-toolbar-save",
					tooltip: IRm$/*resources*/.r1("L_SAVE_CONTENT"),
					handler: function() {
						this._t$/*toolbarHandler*/("cmd_save"); 
					},
					scope: this
				},
				"-",
				{
			    	iconCls: "icon-toolbar-add",
	            	tooltip: IRm$/*resources*/.r1("L_LM_ADD"),
	            	handler: function() {
			    		this._t$/*toolbarHandler*/("cmd_add_lang"); 
			    	},
	            	scope: this
			    },
				{
					xtype: "combobox",
					name: "c_loc",
					fieldLabel: "Base Language",
					labelWidth: 100,
					queryMode: "local",
					displayField: "name",
					labelField: "name",
					valueField: "value",
					editable: false,
					autoSelect: true,
					store: {
						fields: [
							"name", "value"
						]
					},
					listeners: {
						change: function(tobj, newValue, oldValue, eOpts) {
							this.c1/*changeLocale*/();
						},
						scope: this
					}
				},
				{
			    	iconCls: "icon-refresh",
	            	tooltip: IRm$/*resources*/.r1("L_REFRESH"),
	            	handler: function() {
			    		this._t$/*toolbarHandler*/("cmd_refresh"); 
			    	},
	            	scope: this
			    },
			    {
			    	iconCls: "icon-toolbar-remove",
	            	tooltip: IRm$/*resources*/.r1("B_DELETE_ITEM"),
	            	handler: function() {
			    		this._t$/*toolbarHandler*/("cmd_delete"); 
			    	},
	            	scope: this
			    },
			    "-",
			    {
			    	iconCls: "icon-toolbar-add",
	            	tooltip: IRm$/*resources*/.r1("L_LM_LCS"),
	            	handler: function() {
			    		this._t$/*toolbarHandler*/("cmd_add_lcs"); 
			    	},
	            	scope: this
			    },
			    "-",
			    {
			    	iconCls: "icon-ing-dwn",
	            	tooltip: IRm$/*resources*/.r1("L_LM_IMP"),
	            	handler: function() {
			    		this._t$/*toolbarHandler*/("cmd_import"); 
			    	},
	            	scope: this
			    },
			    {
			    	iconCls: "icon-ing-upl",
	            	tooltip: IRm$/*resources*/.r1("L_LM_EXP"),
	            	handler: function() {
			    		this._t$/*toolbarHandler*/("cmd_export"); 
			    	},
	            	scope: this
			    },
			    "-",
			    {
					xtype: "combobox",
					name: "c_loc2",
					fieldLabel: "Second Language",
					labelWidth: 100,
					queryMode: "local",
					displayField: "name",
					labelField: "name",
					valueField: "value",
					editable: false,
					autoSelect: true,
					store: {
						fields: [
							"name", "value"
						]
					},
					listeners: {
						change: function(tobj, newValue, oldValue, eOpts) {
							this.c1/*changeLocale*/(true);
						},
						scope: this
					}
				},
			]
	    });
	          
		IG$/*mainapp*/._I70/*resourcemgr*/.superclass.initComponent.call(this);
	},
	
	listeners: {
		afterrender: function(tobj) {
			var me = this;
			
			me._IFd/*init_f*/();
		}
	}
});

IG$/*mainapp*/._Ia5/*uipage*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	padding: 0,
	closable: true,
	layout: "fit",
	
	_IFd/*init_f*/: function() {
		var me = this,
			req,
			t_save = me.down("[name=t_save]"),
			t_save_as = me.down("[name=t_save_as]");
		
		if (this.writable == true || this.uid == '')
		{
			t_save.setVisible(true);
		}
		
		t_save_as.setVisible(true);
		
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'standard'})
	        }, me, me._IM9/*rs_loadContent*/, false);
		req._l/*request*/();
	},
	
	_IM9/*rs_loadContent*/: function(xdoc) {
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this;
		
		switch (cmd)
		{
		case "cmd_save":
			var uid = this.uid;
			if (!uid)
			{
				this._IJ5/*saveAsPivotContent*/(false);
			}
			else
			{
				var content = null;
				this.fV6/*saveContent*/(uid, content, target);
			}
			break;
		case "cmd_saveas":
			this.$f1/*saveAsContent*/(false);
			break;
		}
	},
	
	/* save content */
    fV6/*saveContent*/: function(uid, content, afterclose) {
    	var panel = this;
    	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	req.init(panel, 
			{
	            ack: "31",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
	            mbody: content
	        }, panel, panel.rs_fV6/*saveContent*/, null, [afterclose]);
		req._l/*request*/();
    },
    
    r_IJ6/*savePivotContent*/: function(xdoc, opt) {
    	var afterclose = (opt ? opt[0] : false);
    	if (afterclose == true)
    	{
    		this._IM8/*doClose*/();
    	}
    	else
    	{
    		this._ILb_/*contentchanged*/ = false;
    		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
    	}
    },
	
	$f1/*saveAsContent*/: function(afterclose) {
		var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
    		mode: "newitem",
    		initpath: this.nodepath
    	});
		dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.$f2/*saveNewContent*/, afterclose);
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	},
	
	$f2/*saveNewContent*/: function(item, afterclose) {
    	var panel = this,
    		pivotxml = this._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(this._ILa/*reportoption*/),
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	
		req.init(panel, 
			{
                ack: "31",
	            payload: "<smsg><item address='" + item.nodepath + "/" + item.name + "' name='" + item.name + "' type='" + (this.itemtype ? this.itemtype : 'Report') + "' pid='" + item.uid + "' description=''/></smsg>",
	            mbody: pivotxml //IG$/*mainapp*/._I2e/*getItemOption*/()
            }, panel, panel._IO5/*rs_processMakeMetaItem*/, panel._IO6/*rs_processMakeMetaItem*/, [item.name, afterclose, item.nodepath, item.uid, pivotxml]);
       	req.showerror = false;
	    req._l/*request*/();
    },
    
    _IO6/*rs_processMakeMetaItem*/: function(xdoc, opt) {
    	var panel = this,
    		itemname = opt[0],
    		afterclose = opt[1],
    		nodepath = opt[2],
    		pitemuid = opt[3],
    		pivotxml = opt[4],
    		errcode = IG$/*mainapp*/._I27/*getErrorCode*/(xdoc);
    	
    	if (errcode == "0x12e0")
    	{
    		IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, itemname + " already exist on the server. Would you overwrite existing item with this copy?", function(e) {
    			if (e == "yes")
    			{
    				var req = new IG$/*mainapp*/._I3e/*requestServer*/();
    				req.init(panel, 
						{
			                ack: "31",
				            payload: "<smsg><item address='" + nodepath + "/" + itemname + "' name='" + itemname + "' type='" + (this.itemtype ? this.itemtype : 'UIPage') + "' pid='" + pitemuid + "' description='' overwrite='T'/></smsg>",
				            mbody: pivotxml //IG$/*mainapp*/._I2e/*getItemOption*/()
			            }, panel, panel._IO5/*rs_processMakeMetaItem*/, null, [itemname, afterclose, nodepath]);
				    req._l/*request*/();
    			}
    		}, panel, panel);
    	}
    	else
    	{
    		IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, panel);
    	}
    },
    
    _IO5/*rs_processMakeMetaItem*/: function(xdoc, opt) {
    	var i,
    		itemname = opt[0],
    		afterclose = opt[1],
    		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
    		name = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "name");
    		
    	if (afterclose == true)
    	{
    		this._IM8/*doClose*/();
    		return;
    	}
    	
    	this._ILb_/*contentchanged*/ = false;
    	this.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid");
    	
    	this.uid = this.uid;
    	this.setTitle(name);
    },
    
    _IM8/*doClose*/: function(btn) {
		var panel = this;
		
		if (btn == "no")
		{
			var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
			lreq.init(panel, 
				{
		            ack: "11",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'lock', detail: "close"})
				}, panel, function(xdoc) {
					this._IM8/*doClose*/();
				}, false);
				
			lreq._l/*request*/();
		}
		else if (btn == "yes")
		{
			var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
			lreq.init(panel, 
				{
		            ack: "11",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'lock', detail: "close"})
				}, panel, function(xdoc) {
					this._t$/*toolbarHandler*/('cmd_save', true); 
				}, false);
				
			lreq._l/*request*/();
		}
	},
	
	initComponent: function() {
		var me = this,
			selectionType = [
			];
		
		me.items = [
			{
				xtype: "panel",
				padding: 10,
				layout: {
					type: "vbox",
					align: "stretch"
				},
				border: 0,
				items: [
					{
						xtype: "fieldset",
						title: "Global Filter",
						layout: {
							type: "vbox",
							align: "none"
						},
						items: [
							{
								xtype: "fieldcontainer",
								fieldLabel: "Filter Item",
								layout: {
									type: "hbox",
									align: "stretch"
								},
								items: [
									{
										xtype: "textfield",
										name: "gfilter"
									},
									{
										xtype: "button",
										text: ".."
									}
								]
							},
							{
								xtype: "combobox",
								fieldLabel: "Selection type",
								labelField: "disp",
								valueField: "type",
								store: {
									xtype: "store",
									fields: [
										"disp", "type"
									],
									data: selectionType
								}
							}
						]
					},
					{
						xtype: "fieldset",
						title: "Dashboard Items",
						layout: "fit",
						flex: 1,
						items: [
							{
								xtype: "gridpanel",
								store: {
									xtype: "store",
									fields: [
										"title", "type", "dispoption", "nodepath", "uid", "name"
									]
								},
								selType: "checkboxmodel",
								selModel: {
									checkSelector: ".x-grid-cell"
								},
								columns: [
									{
										xtype: "gridcolumn",
										text: "Title"
									},
									{
										xtype: "gridcolumn",
										text: "Display type"
									},
									{
										xtype: "gridcolumn",
										text: "Display Option"
									},
									{
										xtype: "gridcolumn",
										text: "Bind report",
										flex: 1
									}
								],
								tbar: [
									{
										xtype: "button",
										text: "Add View",
										handler: function() {
											var dlg = new IG$/*mainapp*/._Ia8/*uipage_option*/({});
											IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
										},
										scope: this
									},
									{
										xtype: "button",
										text: "Add Filter",
										handler: function() {
											var dlg = new IG$/*mainapp*/._Ia7/*uipage_filter*/({});
											IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
										},
										scope: this
									},
									{
										xtype: "button",
										text: "Edit",
										handler: function() {
											var dlg = new IG$/*mainapp*/._Ia8/*uipage_option*/({});
											IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
										},
										scope: this
									}
								]
							}
						]
					},
					{
						xtype: "textarea",
						name: "layouthtml",
						fieldLabel: "Layout HTML",
						height: 200
					}
				]
			}
		];
		
		me.tbar = [
			{
		    	iconCls: 'icon-toolbar-save',
		    	name: "t_save",
            	tooltip: IRm$/*resources*/.r1('L_SAVE_CONTENT'),
            	hidden: true,
            	handler: function() {
		    		this._t$/*toolbarHandler*/('cmd_save'); 
		    	},
            	scope: this
		    },
		    {
	        	iconCls: 'icon-toolbar-saveas',
	        	name: "t_save_as",
	        	tooltip: IRm$/*resources*/.r1('L_SAVE_REPORT_AS'),
	        	hidden: true,
	        	handler: function() {
		    		this._t$/*toolbarHandler*/('cmd_saveas'); 
		    	},
	        	scope: this
	        }
		];
		
		IG$/*mainapp*/._Ia5/*uipage*/.superclass.initComponent.call(this);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj._IFd/*init_f*/();
		}
	}
});


IG$/*mainapp*/._Ia8/*uipage_option*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 360,
	height: 400,
	autoHeight: false,
	
	parentnodepath: null,
	itemtype: null,
	parentuid: null,
	
	callback: null,
	
	fV9/*confirm*/: function() {
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1('L_MAKEITEM');
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				{
					xtype: "form",
					layout: "anchor",
					autoScroll: true,
					defaults: {
						anchor: "100%"
					},
					items: [
						{
							xtype: "fieldset",
							title: "Basic Option",
							layout: "anchor",
							defaults: {
								anchor: "100%"
							},
							items: [
								{
									xtype: "combobox",
									fieldLabel: "View type",
									labelField: "label",
									displayField: "label",
									valueField: "value",
									editable: false,
									store: {
										xtype: "store",
										fields: [
											"label", "value"
										],
										data: [
											{label: "Chart", value: "chart"},
											{label: "Report", value: "report"},
											{label: "As saved", value: "saved"},
											{label: "R statistics", value: "R"},
											{label: "Filter", value: "filter"}
										]
									}
								},
								{
									xtype: "fieldcontainer",
									fieldLabel: "Report Item",
									layout: {
										type: "hbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "textfield"
										},
										{
											xtype: "button",
											text: ".."
										}
									]
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Size option",
							layout: "anchor",
							defaults: {
								anchor: "100%"
							},
							items: [
								{
									xtype: "numberfield",
									fieldLabel: "Height",
									minValue: 50
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
						this.fV9/*confirm*/();
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
		
		IG$/*mainapp*/._Ia8/*uipage_option*/.superclass.initComponent.apply(this, arguments);
	}
	
});

IG$/*mainapp*/._Ia6/*uipage_filter_viewer*/ = function(container) {
	this.container = container;
	this.table = $("<table></table>").appendTo(container);
}

IG$/*mainapp*/._Ia6/*uipage_filter_viewer*/.prototype = {
};

IG$/*mainapp*/._Ia7/*uipage_filter*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 400,
	autoHeight: true,
	
	callback: null,
	
	fV9/*confirm*/: function() {
	},
	
	r1/*refreshData*/: function() {
		var me = this,
			filterarea,
			container,
			filterview = me.R1/*filterview*/;
		if (!filterview)
		{
			filterarea = me.down("[name=filterarea]");
			container = $("[name=filterdiv]", filterarea.el.dom);
			filterview = me.R1/*filterview*/ = new IG$/*mainapp*/._Ia6/*uipage_filter_viewer*/(container);
		}
		
		filterview.table.empty();
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1('L_MAKEITEM');
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				{
					xtype: "form",
					layout: "anchor",
					autoScroll: true,
					defaults: {
						anchor: "100%"
					},
					items: [
						{
							xtype: "fieldset",
							title: "Basic Option",
							layout: "anchor",
							defaults: {
								anchor: "100%"
							},
							items: [
								{
									xtype: "combobox",
									fieldLabel: "View type",
									labelField: "label",
									displayField: "label",
									valueField: "value",
									editable: false,
									store: {
										xtype: "store",
										fields: [
											"label", "value"
										],
										data: [
											{label: "Chart", value: "chart"},
											{label: "Report", value: "report"},
											{label: "As saved", value: "saved"},
											{label: "R statistics", value: "R"},
											{label: "Filter", value: "filter"}
										]
									}
								},
								{
									html: "<div name='filterdiv'></div>",
									name: "filterarea",
									height: 300
								},
								{
									xtype: "fieldcontainer",
									fieldLabel: "Report Item",
									layout: {
										type: "hbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "textfield"
										},
										{
											xtype: "button",
											text: ".."
										}
									]
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Size option",
							layout: "anchor",
							defaults: {
								anchor: "100%"
							},
							items: [
								{
									xtype: "numberfield",
									fieldLabel: "Height",
									minValue: 50
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
						this.fV9/*confirm*/();
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
					var me = this;
					me.r1/*refreshData*/();
				}
			}
		});
		
		IG$/*mainapp*/._Ia7/*uipage_filter*/.superclass.initComponent.apply(this, arguments);
	}
	
});
IG$/*mainapp*/._I71/*metaImport*/ = $s.extend($s.panel, {
	bodyStyle: 'padding:5px',
	closable: true,
	
	iconCls: "icon-ing-docdef",
	
	"layout": {
		type: "vbox",
		align: "stretch"
	},
	defaults: {
		anchor: "100%"
	},
	
	ul1/*uploadFile*/: function() {
		var mform = this.down('[name=mform]');

		if (mform.getForm().isValid()) {
			mform.getForm().submit({
				url: ig$/*appoption*/.servlet,
				waitMsg: 'Uploading your data file',
				success: function(fp, o) {
					var node = IG$/*mainapp*/._I18/*XGetNode*/(fp.errorReader.xmlData, "/smsg/result");
					var uid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "uid");
					
					mform.customowner.sKK1/*processUploadedFile*/.call(mform.customowner, uid);
				},
				failure: function(fp, o) {
				}
			})
		}
	},
	
	sKK1/*processUploadedFile*/: function(uid) {
		var panel = this,
			uploadset = this.down("[name=uploadset]"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		uploadset.setVisible(false);
		
		panel.uid = uid;
		panel.setLoading(true, true);
		
		req.init(panel, 
			{
	            ack: "27",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}, "uid"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "meta_imp"})
	        }, panel, panel.rs_sK3b/*processUploadedFile*/, null);
    	
    	req._l/*request*/();
	},
	
	rs_sK3b/*processUploadedFile*/: function(xdoc) {
		var panel = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			nodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			i,
			metadata = panel.down("[name=metadata]"),
			metastore = metadata.store,
			metaroot = metastore.getRootNode(),
			roots = [], d, rmap = {},
			p, pnode, pnodes,
			typename;
		
		for (i=0; i < nodes.length; i++)
		{
			d = IG$/*mainapp*/._I1c/*XGetAttrProp*/(nodes[i]);
			typename = d.type.toLowerCase();
			d.iconCls = IG$/*mainapp*/._I11/*getMetaItemClass*/(typename, null);
			d.checked = false;
			
			if (/(cube|mcube|metrics|folder|datacube|rfolder|datemetric|nosql|mdbcube|sqlcube|javapackage)/.test(typename) == true && typename != "cubemodel")
	    	{
	    		d.leaf = false;
	    	}
	    	else if (/(folder|workspace|datemetric|table|schema|pool)/.test(typename) == false)
	    	{
	    		d.leaf = true;
	    	}
			
			rmap[d.nodepath] = d;
			
			if (i == 0)
			{
				roots.push(d);
			}
			else
			{
				if (typename == "localdata")
				{
					p = rmap["_data_contents_"];
					
					if (!p)
					{
						p = {
							uid: "",
							type: "data_contents_",
							name: "_data_contents_",
							leaf: false,
							checked: false
						};
						
						rmap[p.name] = p;
						roots.push(p);
					}
				}
				else
				{
					pnodes = d.nodepath.split("/");
					pnodes.splice(pnodes.length-1, 1);
					pnode = pnodes.join("/");
					p = rmap[pnode];
				}
				
				if (p)
				{
					if (p.children)
					{
						p.children.push(d);
					}
					else
					{
						p.children = [d];
					}
				}
				else if (pnodes.length == 1)
				{
					roots.push(d);
				}
			}
		}
		
		// metaroot.removeAll();
		while (metaroot.firstChild)
		{
			metaroot.removeChild(metaroot.firstChild);
		}
		
		for (i=0; i < roots.length; i++)
		{
			metaroot.appendChild(roots[i]);
		}
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var panel = this,
			me = panel;
		
		switch (cmd)
		{
		case "cmd_imp":
			if (panel.uid)
			{
				IG$/*mainapp*/._I55/*confirmMessages*/("ImportMeta", "Would you include meta to server?", me.do_mEp/*importMeta*/, me, me);
			}
			break;
		}
	},
	
	append_node: function(tnode, sel) {
		var me = this;
		
		if (tnode.childNodes)
		{
			$.each(tnode.childNodes, function(i, c) {
				sel.push(c);
				
				me.append_node(c, sel);
			});
		}
	},
	
	do_mEp/*importMeta*/: function(dlg) {
		if (dlg == "yes")
		{
			var panel = this,
				i,
				items = [],
				metadata = panel.down("[name=metadata]"),
				store = metadata.store,
				root = store.getRootNode(),
				selvalues = [], // metadata.getView().getChecked(),
				ucontents = {},
				item, d,
				req = new IG$/*mainapp*/._I3e/*requestServer*/(), content = [];
			
			panel.append_node(root.childNodes[0], selvalues);
			
			if (selvalues && selvalues.length > 0)
			{
				panel.setLoading(true, true);
				
				content.push("<smsg>");
				content.push("<info" + IG$/*mainapp*/._I20/*XUpdateInfo*/({option: "imp_load"}, "option", "s") + ">");
				for (i=0; i < selvalues.length; i++)
				{
					d = selvalues[i];
					ucontents[d.get("uid")] = d;
					item = {name: d.get("name"),
						uid: d.get("uid"),
						nodepath: d.get("nodepath"),
						type: d.get("type")
					};
					content.push("<item" + IG$/*mainapp*/._I20/*XUpdateInfo*/(item, "name;uid;type", "s") + "/>");
					items.push(item);
				}
				content.push("</info>");
				content.push("</smsg>");
				req.init(panel, 
					{
			            ack: "27",
			            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}, "uid"),
			            mbody: content.join("")
			        }, panel, panel.rs_mEp/*importMeta*/, null, ucontents);
		    	
		    	req._l/*request*/();
			}
		}
	},
	
	rs_mEp/*importMeta*/: function(xdoc, ucontents) {
		var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			i, t, record, msg,
			errcnt = 0, errcode;
			
		for (i=0; i < tnodes.length; i++)
		{
			t = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			
			record = ucontents[t.uid];
			if (record)
			{
				errcode = parseInt(t.status);
				switch (errcode)
				{
				case 0:
					msg = "Not processed";
					break;
				case 1:
					msg = "Success";
					break;
				case 5:
					msg = "STAT_CONTENT_MISSING";
					break;
				case 6:
					msg = "STAT_FAILE_PARENT";
					break;
				case 7:
					msg = "STAT_UPPER_NODE_MISSING";
					break;
				case 8:
					msg = "STAT_NO_PARENT";
					break;
				default:
					msg = "Unknown " + t.status;
					break;
				}
				
				if (errcode != 1)
				{
					errcnt++;
				}
				
				record.set("logresult", msg);
			}
		}
		
		if (errcnt > 0)
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "" + errcnt + " item failed to import!", null, null, 1, "error");
		}
		else
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SAVED'), null, null, 0, "success");
		}
	},
	
	uX/*updateCheckStatus*/: function(node, checked) {
		var i,
			tnode;
		
		for (i=0; i < node.childNodes.length; i++)
		{
			tnode = node.childNodes[i];
			tnode.set("checked", checked);
			
			this.uX/*updateCheckStatus*/(tnode, checked);
		}
	},
	
	initComponent: function() {
		var panel = this
		
	    this.items = [
	    	{
	    		xtype: "fieldset",
	    		title: "Load File",
	    		region: "north",
	    		name: "uploadset",
	    		layout: "anchor",
	    		collapsible: true,
	    		items: [
	    			{
		    			xtype: 'form',
				    	name: 'mform',
				    	border: 0,
				    	customowner: this,
				    	layout: {
				    		type: "hbox",
				    		align: "stretch"
				    	},
		    			items: [
		    				{
		    					xtype: "hiddenfield",
		    					name: "_mts_",
		    					value: IG$/*mainapp*/._g$a/*global_mts*/
		    				},
		    				{
			    				xtype: 'fileuploadfield',
			    				name: 'photo',
			    				flex: 1,
		  	    	            fieldLabel: 'Data',
		  	    	            // labelWidth: 100,
		  	    	            msgTarget: 'side',
		  	    	            allowBlank: false,
		  	    	            anchor: '100%',
		  	    	            // width: 320,
		  	    	            buttonText: IRm$/*resources*/.r1("L_SELECT_FILE"),
		  	    	            buttonConfig: {
		  	    	            	margin: "0 2 0"
		  	    	            }
			    			},
			    			{
			    				xtype: "button",
			    				text: "Upload file",
			    				handler: function() {
			    					panel.ul1/*uploadFile*/.call(panel);
			    				}
			    			}
			    		]
		    		}
	    		]
	    	},
	    	{
	    		xtype: "form",
	    		layout: {
	    			type: "vbox",
	    			align: "stretch"
	    		},
	    		flex: 1,
	    		border: 0,
	    		defaults: {
	    			anchor: "100%"
	    		},
	    		items: [
	    			{
	    				xtype: "fieldcontainer",
	    				border: 0,
	    				layout: {
	    					type: "hbox",
	    					align: "stretch"
	    				},
	    				items: [
	    					{
			    				xtype: "displayfield",
			    				value: "Items on file",
			    				flex: 1
			    			},
			    			{
								xtype: 'button', 
						  		plain: true,
						  		text: 'Import Selected',
						  		handler: function() {
						  			this._t$/*toolbarHandler*/('cmd_imp'); 
						  		},
						  		scope: this 
							}
	    				]
	    			},
	    			{
	    				xtype: "treepanel",
	    				flex: 1,
	    				name: "metadata",
	    				resizable: false,
						collapsible: false,
						rootVisible: false,
						useArrows: true,
						store: {
							type: "treestore",
							root: {
								expanded: true
							},
							fields: [
								"name", "uid", "type", "nodepath", "exist", "existname", "checked", "logresult", "iconCls"
							]
						},
						tbar: [
						    {
						    	xtype: "button",
						    	text: "Select All",
						    	handler: function() {
						    		var grid = this.down("[name=metadata]"),
						    			rnode = grid.getRootNode(),
						    			i;
						    		
						    		for (i=0; i < rnode.childNodes.length; i++)
						    		{
						    			rnode.childNodes[i].set("checked", true);
						    		}
						    	},
						    	scope: this
						    }
						],
	    				columns: [
	    					{
						    	xtype: "treecolumn",
						    	flex: 1,
						    	width: 120,
						    	text: "Data name",
						    	dataIndex: "name",
						    	editor: {
									allowBlank: false
								}
						    },
	    					{
						    	xtype: "gridcolumn",
						    	width: 40,
						    	text: "Exist",
						    	dataIndex: "exist",
						    	editor: {
									allowBlank: false
								}
						    },
						    {
						    	xtype: "gridcolumn",
						    	flex: 1,
						    	text: "Type",
						    	dataIndex: "type",
						    	width: 80,
						    	editor: {
									allowBlank: false
								}
						    },
						    {
						    	xtype: "gridcolumn",
						    	flex: 1,
						    	text: "Path",
						    	dataIndex: "nodepath",
						    	editor: {
									allowBlank: false
								}
						    },
						    {
						    	xtype: "gridcolumn",
						    	flex: 1,
						    	text: "Log Result",
						    	dataIndex: "logresult"
						    }
	    				],
	    				listeners: {
	    					checkchange: function(node, checked, eOpts ) {
	    						node.expand();
	    						this.uX/*updateCheckStatus*/(node, checked);
	    					},
	    					scope: this
	    				}
	    			}
	    		]
	    	}
		]
		
		IG$/*mainapp*/._I71/*metaImport*/.superclass.initComponent.apply(this, arguments);
	},
	
	listeners: {
		afterrender: function() {
			var panel = this,
				mform = panel.down("[name=mform]");
			mform.getForm().errorReader = new IG$/*mainapp*/.m2ER();
			mform.customowner = panel;
		}
	}
});

IG$/*mainapp*/.cMb3p/*metaImportPanel*/ = $s.extend($s.window, {
	
	
	width: 400,
	autoHeight: true,
	
	"layout": 'fit',
		
	initComponent: function() {
		this.title = IRm$/*resources*/.r1('T_META_IMP');
		
		this.items = [
			new IG$/*mainapp*/._I71/*metaImport*/()
		];
		
		this.buttons = [
			{
				text: IRm$/*resources*/.r1('B_CLOSE'),
				handler: function() {
					this.close();
				},
				scope: this
			}
		];
		
		IG$/*mainapp*/.cMb3p/*metaImportPanel*/.superclass.initComponent.apply(this, arguments);
	}
});

