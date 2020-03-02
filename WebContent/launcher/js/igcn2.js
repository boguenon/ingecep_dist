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
// IG$/*mainapp*/.a3n1/*nosqldblistmodel*/ = $s.extend(Ext.data.Model, {
//	fields: ["name", "alias", "nodename"]
// });

IG$/*mainapp*/._Ic2/*nosql_option*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	
	"layout": "fit",
	
	closable: false,
	resizable:false,
	
	width: 360,
	autoHeight: true,
	dbscan: 1,
	
	callback: null,
	
	serverNode: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var panel = this,
			nosqldb = panel.down("[name=nosqldb]"),
			dbgroups = panel.down("[name=dbgroups]"),
			selvalue = dbgroups.getSelectionModel().selected,
			dbtype,
			nosqldbval = nosqldb.getValue(),
			i, rec, p;
		
		if (!nosqldbval)
		{
			return;	
		}
		
		for (i=0; i < nosqldb.store.data.items.length; i++)
		{
			rec = nosqldb.store.data.items[i];
			if (rec.get("poolname") == nosqldbval)
			{
				dbtype = rec.get("dbtype");
				break;
			}
		}
		
		if (dbtype)
		{
			var mval = {dbtype: dbtype, dbname: nosqldbval, scan: 0, dbnodes: []};
			
			if (selvalue && selvalue.length)
			{
				for (i=0; i < selvalue.length; i++)
				{
					p = selvalue.items[i];
					mval.dbnodes.push({name: p.get("name"), uid: p.get("uid")});
				}
			}
			
			panel.callback && panel.callback.execute(mval);
			panel.close();
		}
	},
	
	in$t: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(me, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/", dbtype: "57"}, "address;dbtype"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'standard'})
	        }, me, function(xdoc) {
	        	var me = this,
	        		cnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"), 
	        		i, snodes, p,
	        		dp = [],
	        		nosqldb = me.down("[name=nosqldb]");
	        		
	        	dp.push({name:"Select Database Instance", poolname:""}); 
	        	
	        	if (cnode)
	        	{
	        		snodes = IG$/*mainapp*/._I26/*getChildNodes*/(cnode);
	        		
	        		for (i=0; i < snodes.length; i++)
					{
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
						if (p.dbtype == "57")
						{
							dp.push({
								name:p.disp, 
								poolname: p.name,
								uid: p.uid || "",
								dbtype: p.dbtype,
								isuserdb: (p.isuserdb == "T" ? true : false),
								savepwd: (p.isuserdb == "T" && p.savepwd == "F" ? false : true)
							});
						}
					}
					
					nosqldb.store.loadData(dp);
					nosqldb.setValue(me.dbname || "");
	        	}
	        }, false);
		req._l/*request*/();
	},
	
	l1/*loadDBGroup*/: function() {
		var me = this,
			nosqldb = me.down("[name=nosqldb]"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			opt = {address: "/" + nosqldb.getValue(), option: "StoredContent"};
		
		if (nosqldb.getValue())
		{
			req.init(me, 
				{
		            ack: "25",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/(opt, "address;option;pwd"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/(opt)
		        }, me, function(xdoc) {
		        	var me = this,
		        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
		        		dp = [], node,
		        		dbgroups = me.down("[name=dbgroups]"),
		        		i;
		        		
		        	if (tnode)
					{
						snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
						
						for (i=0; i < snodes.length; i++)
						{
							node = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
							dp.push(node);
						}
					}
					
					dbgroups.store.loadData(dp);
		        });
			req._l/*request*/();
		}
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("T_NOSQLDATA_TITLE");
				
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
			
			"layout": "fit",
			
			items: [
			    {
			    	xtype: "panel",
			    	layout: {
			    		type: "vbox",
			    		align: "stretch"
			    	},
			    	border: 0,
					items: [
						{
							xtype: "combobox",
							name: "nosqldb",
							fieldLabel: "Database",
							queryMode: 'local',
							displayField: 'name',
							valueField: 'poolname',
							editable: false,
							autoSelect: true,
							store: {
								xtype: 'store',
								fields: [
									"name", "poolname", "dbtype"
								]
							},
							listeners: {
								change: function(tobj) {
									var me = this,
										dbgroups = me.down("[name=dbgroups]");
									dbgroups.store.loadData([]);
									me.l1/*loadDBGroup*/();
								},
								scope: this
							}
						},
						{
							xtype: "gridpanel",
							name: "dbgroups",
							height: 180,
							store: {
								fields: ["name", "uid"]
							},
							selType: "checkboxmodel",
							selModel: {
								selMode: "MULTI"
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
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						this._IFf/*confirmDialog*/();
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1("B_CANCEL"),
					handler: function() {
						this.close();
					},
					scope: this
				}
			],
			
			listeners: {
				afterrender: function(ui) {
					var me = this;
					me.in$t();
				}
			}
		});
		
		IG$/*mainapp*/._Ic2/*nosql_option*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._IC9/*nosqlcube*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	ReportUID: "",
	scroll: false,
	initialized: false,
	closable: true,
	
	autoScroll:false,
    bodyBorder: false,
    "layout": "fit",
	autoHeight: true,
	groupmeasures: null,
	
	dbscan: 100,
	
	rx/*removeColumn*/: function(rowIndex) {
		var panel = this,
			storecolumn = this.columnview.store, 
			rec = storecolumn.data.items[rowIndex],
			i;
		storecolumn.remove(rec);
		/*
		for (i=0; i < panel.dataview.length; i++)
		{
			panel.dataview[i].columns.splice(rowIndex, 1);
			panel.dataview[i].getView().refresh(true);
		}
		*/
		// panel.dataview.reconfigure(this.dataview.store, panel.dataview.columns);
	},
	
	cx/*configColumn*/: function(rowIndex) {
		var panel = this,
			storecolumn = this.columnview.store,
			rec = storecolumn.data.items[rowIndex],
			data = {};
		
		IG$/*mainapp*/._I1d/*CopyObject*/(rec.data, data);
		
		var config = new IG$/*mainapp*/._Ic4/*metricSetting*/({
			item: data,
			styles: panel.styles
		});
		config.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_cx/*configColumn*/, rec)
		config.show();
	},
	
	rs_cx/*configColumn*/: function(item, record) {
		var i,
			f = ["text", "datatype", "fieldname", "sortorder", "sorttype", "itemstyle", "groupmeasure", "removeblank", "isdatetype", "datefield", "dateformat", "type", "dateitems", "datecustom", "aggregate"],
			key;
		for (i=0; i < f.length; i++)
		{
			key = f[i];
			record.set(key, item[key]);
		}
		var sortdesc,
			sortorder = record.get("sortorder"),
			sorttype = record.get("sorttype"),
			removeblank = record.get("removeblank"),
			isdatetype = record.get("isdatetype"),
			dateformat = record.get("dateformat"),
			dateitems = record.get("dateitems"),
			datecustom = record.get("datecustom"),
			aggregate = record.get("aggregate");
		
		sortdesc = sortorder || "";
		sortdesc = (sortdesc == "asc") ? "▲" : (sortdesc == "desc") ? "▼" : "";
		sortdesc = (sortdesc != "" && sorttype == "NUMBER") ? sortdesc + "(Numeric)" : sortdesc;
		
		record.set("sortdesc", sortdesc);
	},
	
	setFieldType: function(ftype) {
		var ctrl = this.down("[name=columnview]"),
			i;
			
		for (i=0; i < ctrl.store.data.items.length; i++)
		{
			if (ctrl.store.data.items[i].data.checked == true)
			{
				ctrl.store.data.items[i].set("datatype", ftype);
			}
		}
	},
	
    initComponent: function(){
    	var panel = this,
			
			customMenus = new $s.menu({
	        	items: [
		        	{
				    	text: "Set as Number Field",
				    	handler: function() {
				    		this.setFieldType("number");
				    	},
			   	   		scope: this
				    },
				    {
				    	text: "Set as Text Field",
				    	handler: function() {
				    		this.setFieldType("string");
				    	},
				    	scope: this
				    }
	        	]
	        });
    	
    	panel.styles = [];
    	panel.columnobj = [];
    	panel.columninfo = [];
		
        $s.apply(this, {
            tbar:[ " ",
				{
	            	iconCls: "icon-toolbar-save",
	            	tooltip: IRm$/*resources*/.r1("L_SAVE_EXCEL"),
	            	handler: function() {this._t$/*toolbarHandler*/("cmd_save"); },
	            	scope: this
	            },
	            {
	            	iconCls: "icon-toolbar-option",
	            	tooltip: "Options",
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_option");
	            	},
	            	scope: this
	            },
	            {
	            	iconCls: "icon-toolbar-style",
	            	tooltip: "Style",
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_style");
	            	},
	            	scope: this
	            }
//	            ,
//	            "->",
//	            {
//	            	iconCls: "icon-toolbar-help",
//	            	tooltip: IRm$/*resources*/.r1("B_HELP"),
//	            	handler: function() {
//	            		IG$/*mainapp*/._I63/*showHelp*/("P0044");
//	            	}
//	            }
            ],
            
            items: [
	            {
	            	xtype: "form",
	                "layout": "anchor",
	                bodyPadding: 4,
	                defaults: {
	            		anchor: "100%"
	            	},
	                items: [
                        {
                        	xtype: "displayfield",
                        	value: "Options and Loaded data list"
                        },
                        {
                        	xtype: "panel",
                        	border: 0,
                        	"layout": {
                        		type: "hbox",
                        		padding: 5
                        	},
                        	items: [
								{
									xtype: "gridpanel",
									plain: true,
									name: "datainfo",
									flex: 1,
									height: 120,
									split: true,
									resizable: false,
									collapsible: false,
									"layout": "fit",
									collapsed: false,
									stateful: true,
									columnLines: true,
									store: {
										fields: [
											"name", "uid", "type", "nodepath"
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
									    	flex: 1,
									    	text: "Data name",
									    	dataIndex: "name",
									    	editor: {
												allowBlank: false
											}
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
												}
											]
										}
									]
								}
							]
                        },
                        {
                        	xtype: "displayfield",
                        	value: "Metric Items"
                        },
	                	{
	                		xtype: "gridpanel",
	                		name: "columnview",
	                		region: "center",
	                		collapsible: false,
							stateful: true,
							columnLines: true,
							selType: "checkboxmodel",
							selModel: {
								checkSelector: ".x-grid-cell"
							},
							store: {
								fields: ["name", "alias", "nodename"],
								data: []
							},
							split: false,
							scroll: "vertical",
							initialized: false,
							autoHeight: true,
							flex: 1,
							/*
							verticalScroller: {
					            xtype: "paginggridscroller",
					            activePrefetch: false
					        },
					        invalidateScrollerOnRefresh: false,
					        */
							autoScroll: true,
							plugins: [
								{
									ptype: "cellediting",
									clicksToEdit: false
								}
							],
							dockedItems: [
								{
									xtype: "toolbar",
									dock: "top",
									items: [
										{
											iconCls: "icon-toolbar-groupmeasure",
											text: IRm$/*resources*/.r1("L_GROUP_MEASURE"),
							            	tooltip: IRm$/*resources*/.r1("L_GROUP_MEASURE"),
							            	handler: function() {this._t$/*toolbarHandler*/("cmd_group_measure"); },
							            	scope: this
										},
										{
											iconCls: "icon-toolbar-moveup",
											text: IRm$/*resources*/.r1("B_MOVE_UP"),
							            	tooltip: IRm$/*resources*/.r1("B_MOVE_UP"),
							            	handler: function() {this._t$/*toolbarHandler*/("cmd_move_up"); },
							            	scope: this
										},
										{
											iconCls: "icon-toolbar-movedown",
											text: IRm$/*resources*/.r1("B_MOVE_DOWN"),
							            	tooltip: IRm$/*resources*/.r1("B_MOVE_DOWN"),
							            	handler: function() {this._t$/*toolbarHandler*/("cmd_move_down"); },
							            	scope: this
										},
									]
								}
							],
							columns: [
							    {
							    	xtype: "gridcolumn",
									text: "Colmn name",
									dataIndex: "text",
									flex: 2,
									editor: {
										allowBlank: false
									}
							    },
							    {
							    	xtype: "gridcolumn",
									text: "Location",
									dataIndex: "nodepath",
									flex: 2
							    },
							    
							    {
							    	xtype: "gridcolumn",
									text: "GroupInfo",
									dataIndex: "groupmeasure",
									flex: 2
							    },
							    
							    {
							    	xtype: "gridcolumn",
							    	width: 120,
							    	text: "Data type",
							    	dataIndex: "datatype",
							    	field: {
										xtype: "combobox",
										queryMode: "local",
										displayField: "name",
										valueField: "value",
										editable: false,
										autoSelect: true,
										triggerAction: "all",
										selectOnTab: true,
										store: {
											xtype: "store",
											fields: ["name", "value"],
											data: [
												{name: "String", value: "string"},
												{name: "Numeric", value: "number"}
											]
										},
										lazyRender: true,
										listClass: "x-combo-list-small"
									}
							    },
							    
							    {
							    	xtype: "gridcolumn",
							    	width: 120,
							    	text: "Aggregation",
							    	dataIndex: "aggregate",
							    	field: {
							    		xtype: "combobox",
							    		queryMode: "local",
							    		displayField: "name",
							    		valueField: "value",
							    		editable: false,
							    		autoSelect: true,
							    		triggerAction: "all",
							    		selectOnTab: true,
							    		store: {
							    			xtype: "store",
							    			fields: [
					    			            "name", "value"
							    			],
							    			data: [
							    			    {name: "Average", value: "avg"},
							    			    {name: "Sum", value: "sum"},
							    			    {name: "Minimum", value: "min"},
							    			    {name: "Maximum", value: "max"}
							    			]
							    		}
							    	}
							    },
							    
							    {
							    	xtype: "gridcolumn",
							    	width: 80,
							    	text: "Sort",
							    	dataIndex: "sortdesc"
							    },
							    {
							    	xtype: "gridcolumn",
							    	width: 100,
							    	text: "Style",
							    	dataIndex: "itemstyle"
							    },
						    	{
									xtype: "actioncolumn",
									width: 50,
									items: [
										{
											// icon: "./images/gears.png",
											iconCls: "icon-grid-config",
											tooltip: IRm$/*resources*/.r1("B_CONFIG_ITEM"),
											handler: function (grid, rowIndex, colIndex) {
												panel.cx/*configColumn*/(rowIndex);
											},
											scope: panel
										},
										{
											// icon: "./images/delete.png",
											iconCls: "icon-grid-delete",
											tooltip: IRm$/*resources*/.r1("B_DELETE_ITEM"),
											handler: function (grid, rowIndex, colIndex) {
												panel.rx/*removeColumn*/(rowIndex);
											},
											scope: panel
										}
									]
								}
							],
							viewConfig: {
								stripeRows: false,
								trackOver: false
							},
							listeners: {
								selectionchange: function(view, records) {
								},
								afterrender: function(view) {
									this.initialized = true;
								},
								beforeitemcontextmenu: function(view, record, item, index, e) {
									e.stopEvent();
			
									// if (this.customMenu)
									//{
									var x = e.pageX,
										y = e.pageY,
										
										t = e.getTarget();
										
									customMenus.showBy(t);
									
									return false;
								},
								itemclick: function(view, record, item, index, e, epots) {
									panel.s1/*selectedRow*/ = record;
								}
							}
	                	}
	                ]
	    		}
			]
        });
        
        IG$/*mainapp*/._IC9/*nosqlcube*/.superclass.initComponent.call(this);
    },
    
    _t$/*toolbarHandler*/: function(cmd) {
    	var panel = this;
    	
    	switch(cmd)
    	{
    	case "cmd_save":
    		this.sK4a/*saveMetricContent*/();
    		break;
    	case "cmd_style":
    		var dlg = new IG$/*mainapp*/._I9c/*cubeStyle*/({
    			styleinfo: this.styles
    		});
    		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
    		break;
    	case "cmd_option":
    		var dlg = new IG$/*mainapp*/._Ic2/*nosql_option*/({
    			dbscan: panel.dbscan,
    			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_changeOption)
    		});
    		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
    		break;
    	case "cmd_group_measure":
    		panel.u1/*groupMeasureItem*/();
    		break;
    	case "cmd_move_up":
    		panel.u2/*moveRow*/(-1);
    		break;
    	case "cmd_move_down":
    		panel.u2/*moveRow*/(1);
    		break;
    	}
    },
    
    rs_changeOption: function(mval) {
    	var panel = this;
    	
    	if (mval)
    	{
    		this.dbnode = mval.dbnode;
    		this.dbtype = mval.dbtype;
    		this.dbname = mval.dbname;
    		this.dbscan = mval.scan;
    		this.loadTableContent();
    	}
    },
    
    loadTableContent: function() {
    	var panel = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	
    	panel.setLoading(true);
    	
    	req.init(panel, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, dbtype: panel.dbtype, dbname: panel.dbname, nodename: panel.dbnode, option: "nosqldb"}, "uid;dbtype;option;dbname;nodename"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "standard"})
	        }, panel, panel.rs_loadTableContent, null);
		req._l/*request*/();
    },
    
    rs_loadTableContent: function(xdoc) {
    	var panel = this,
    		datainfo = panel.down("[name=datainfo]"),
    		dp = [],
    		tnode, tnodes,
    		i, columnname;
    	
    	tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg");
    	panel.setLoading(false);
    	
    	if (tnode)
    	{
    		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tnodes.length; i++)
			{
				columnname = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name");
				dp.push({name: columnname, alias: columnname, aggregate: "avg"});
			}
    	}
    	
    	datainfo.store.loadData(dp);
    },
    
    u2/*moveRow*/: function(direction) {
    	var me = this,
    		selrow = me.s1/*selectedRow*/,
    		columnview = me.down("[name=columnview]"),
    		columnviewstore = columnview.store,
    		rows = columnviewstore.data.items.length,
    		rindex, nindex,
    		selmodel = columnview.getSelectionModel();
    		
    	if (selrow)
    	{
    		rindex = columnviewstore.indexOf(selrow);
    		nindex = rindex + direction;
    		
    		if (nindex > -1 && nindex < rows)
    		{
    			columnviewstore.removeAt(rindex);
    			columnviewstore.insert(nindex, selrow);
    			
    			selmodel.select(selrow);
    		}
    	}
    },
    
    u1/*groupMeasureItem*/: function() {
    	var panel = this,
    		header = panel.header,
    		columnview = panel.columnview,
    		columnviewstore = columnview.store,
    		selmodel = columnview.getSelectionModel(),
    		selvalue, sel, err,
    		i;
    		
		selvalue = selmodel ? selmodel.getSelection() : null;
		
		if (selvalue && selvalue.length > 1)
		{
			for (i=0; i < selvalue.length; i++)
			{
				sel = selvalue[i].data;
				if (sel.datatype != "numeric" && sel.datatype != "number")
				{
					err = sel.text + " is not a numeric value.\nSelection allows numeric value only.";
					break;
				}
			}
			
			// 
		}
		else
		{
			err = "Check items to group measure. \nNeed 2 or more items selected.";
		}
		
		if (err)
		{
			IG$/*mainapp*/._I54/*alertmsg*/("Selection Error", err, null, panel, null, null, 1, "error");
		}
		else
		{
			var dlg = new IG$/*mainapp*/._Ic3/*groupmeasure*/({
    			sel: selvalue,
    			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_u1/*groupMeasureItem*/, selvalue)
    		});
    		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
		}
    },
    
    rs_u1/*groupMeasureItem*/: function(opt, sel) {
    	var me = this,
    		groupmeasures = me.groupmeasures,
    		selmeasure = null,
    		row,
    		i;
    		
    	if (groupmeasures)
    	{
    		for (i=0; i < groupmeasures.length; i++)
    		{
    			if (groupmeasures[i].name == opt.name)
    			{
    				selmeasure = groupmeasures[i];
    				break;
    			}
    		}
    	}
    	
    	if (!selmeasure)
    	{
    		selmeasure = opt;
    		me.groupmeasures = me.groupmeasures || [];
    		me.groupmeasures.push(opt);
    	}
    	
    	for (i=0; i < sel.length; i++)
    	{
    		row = sel[i];
    		row.set("groupmeasure", selmeasure.name);
    	}
    },
    
	sK4a/*saveMetricContent*/: function() {
		var panel = this,
			i, d, c = [],
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			metatype;
		    	
    	panel.setLoading(true, true);
    	
    	c.push("<smsg><info option='updatecolumnuid' baseuid='" + this.uid + "'>");
    	
    	// for (i=0; i < this.columnview.store.totalCount; i++)
    	for (i=0; i < this.columnview.store.data.items.length; i++)
    	{
    		d = this.columnview.store.data.items[i].data;
    		d.uid = (d.uid || "");
    		d.uid = (d.uid.indexOf("-") > 0) ? d.uid : "";
    		d.fieldid = "column_" + i;
    		metatype = (IG$/*mainapp*/._I34/*isNumericType*/(d.datatype) ? "Measure" : "Metric");
    		if (d.isdatetype == true)
    		{
    			metatype = "DateMetric";
    		}
    		c.push("<column name='" + d.text + "'"
    			+ " datatype='" + d.datatype + "'"
    			+ " fieldname='" + d.fieldname + "'"
    			+ " type='" + metatype + "'"
    			+ ((d.sortorder) ? " sortorder='" + d.sortorder + "'" : "")
    			+ ((d.sorttype) ? " sorttype='" + d.sorttype + "'" : "")
    			+ ((d.itemstyle) ? " itemstyle='" + d.itemstyle + "'" : "")
    			+ " removeblank='" + (d.removeblank == true ? "T" : "F") + "'"
    			+ " fieldid='" + d.fieldid + "'"
    			+ " groupmeasure='" + (d.groupmeasure || "") + "'"
    			+ " isdatetype='" + (d.isdatetype == true ? "T" : "F") + "'"
    			+ " dateitems='" + (d.dateitems || "") + "'"
    			+ " datecustom='" + (d.datecustom || "") + "'"
    			+ " dateformat='" + (d.dateformat || "") + "'"
    			+ " nodename='" + (d.nodename || panel.dbnode || "") + "'"
    			+ " aggregate='" + (d.aggregate || "") + "'"
    			+ " uid='" + d.uid + "'/>");
    	}
    	
    	c.push("<GroupMeasures>");
    	if (this.groupmeasures)
    	{
    		for (i=0; i < this.groupmeasures.length; i++)
    		{
    			c.push("<GroupMeasure" + IG$/*mainapp*/._I20/*XUpdateInfo*/(this.groupmeasures[i], "uid;name;nodepath", "s") + "/>");
    		}
    	}
    	c.push("</GroupMeasures>");
    	c.push("</info>");
    	c.push("</smsg>");
    	
    	req.init(panel, 
			{
	            ack: "31",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid}),
	            mbody: c.join("")
	        }, panel, panel.rs_sK4a/*saveMetricContent*/, null);
		req._l/*request*/();
	},
	
	rs_sK4a/*saveMetricContent*/: function(xdoc) {
		var panel=this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			records = this.columnview.store.data.items,
			nodename,
			i, n=0, j, p;
		
		panel.setLoading(true, true);
		
		for (i=0; i < tnodes.length; i++)
		{
			nodename = IG$/*mainapp*/._I29/*XGetNodeName*/(tnodes[i]);
			if (nodename == "column")
			{
				records[n].set("uid", IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "uid"));
				records[n].set("nodepath", IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "nodepath"));
				n++;
			}
			else if (nodename == "measuregroup")
			{
				p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				if (this.groupmeasures)
		    	{
		    		for (j=0; j < this.groupmeasures.length; j++)
		    		{
		    			if (this.groupmeasures[j].name == p.name)
		    			{
		    				this.groupmeasures[j].uid = p.uid;
		    				this.groupmeasures[j].dim_uid = p.dim_uid;
		    				break;
		    			}
		    		}
		    	}
			}
		}
		
		this.sK4/*saveMetaContent*/();
	},
    
    sK4/*saveMetaContent*/: function() {
    	var panel = this,
    		content = "", c=[],
    		i,
    		j, ind=[], d, r, tuples=[], key,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(), delimiter="%^;",
    		datainfo = this.down("[name=datainfo]");
    		
    	panel.setLoading(true, true);
    	
    	c.push("<smsg><item uid='" + this.uid + "'>");
    	// c.push("<result codefield='' cols='" + this.columnview.store.totalCount + "' delimiter='" + delimiter + "' resultlimit='0' resulttype='external'>");
    	c.push("<result cols='" + this.columnview.store.data.items.length + "' resultlimit='0' resulttype='external'");
    	c.push(" dbtype='" + this.dbtype + "' dbname='" + this.dbname + "' tablename='" + this.tablename + "'");
    	c.push(" dbnode='" + this.dbnode + "'");
    	c.push(" dbscan='" + this.dbscan + "'");
    	c.push(">");
    	c.push("<Header>");
    	
    	// for (i=0; i < this.columnview.store.totalCount; i++)
    	for (i=0; i < this.columnview.store.data.items.length; i++)
    	{
    		// d = this.columnview.store.prefetchData.items[i].data;
    		d = this.columnview.store.data.items[i].data;
    		d.uid = (d.uid || "");
    		d.uid = (d.uid.indexOf("-") > 0) ? d.uid : "";
    		d.fieldid = "column_" + i;
    		c.push("<column name='" + d.text + "'"
    			+ " type='" + d.datatype + "'"
    			+ " fieldname='" + d.fieldname + "'"
    			+ " fieldid='" + d.fieldid + "'"
    			+ ((d.sortorder) ? " sortorder='" + d.sortorder + "'" : "")
    			+ ((d.sorttype) ? " sorttype='" + d.sorttype + "'" : "")
    			+ ((d.itemstyle) ? " itemstyle='" + d.itemstyle + "'" : "")
    			+ " removeblank='" + (d.removeblank == true ? "T" : "F") + "'"
    			+ " isdatetype='" + (d.isdatetype == true ? "T" : "F") + "'"
    			+ " dateitems='" + (d.dateitems || "") + "'"
    			+ " datecustom='" + (d.datecustom || "") + "'"
    			+ " dateformat='" + (d.dateformat || "") + "'"
    			+ " groupmeasure='" + (d.groupmeasure || "") + "'"
    			+ " aggregate='" + (d.aggregate || "") + "'"
    			+ " dbnode='" + (d.nodename || this.dbnode || "") + "'"
    			+ " uid='" + d.uid + "'/>");
    			
    		ind.push(d.dataIndex);
    		tuples.push({index: i, name: d.text, uid: d.uid, tuple: {}});
    	}
    	c.push("</Header>");
    	c.push("<DataObjects>");
    	
    	for (i=0; i < datainfo.store.data.items.length; i++)
    	{
    		c.push("<data uid='" + datainfo.store.data.items[i].get("uid") + "' name='" + datainfo.store.data.items[i].get("name") + "'/>");
    	}
    	c.push("</DataObjects>");
    	
    	if (this.tabdimension && this.down("[name=cbtabdim]").getValue() == true)
    	{
    		c.push("<TabDimension" + IG$/*mainapp*/._I20/*XUpdateInfo*/(this.tabdimension, "uid;name", "s") + "/>");
    	}
    	
    	if (this.groupmeasures && this.groupmeasures.length > 0)
    	{
    		c.push("<GroupMeasures>");
    		for (i=0; i < this.groupmeasures.length; i++)
    		{
    			c.push("<GroupMeasure" + IG$/*mainapp*/._I20/*XUpdateInfo*/(this.groupmeasures[i], "uid;name;nodepath", "s") + "/>");
    		}
    		c.push("</GroupMeasures>");
    	}
    	
    	c.push("<Styles>");
    	for (i=0; i < this.styles.length; i++)
    	{
    		// this.styles[i].Mb_16/*removeBaseStyle*/(base);
    		c.push(this.styles[i].tx/*getXML*/()); // new IG$/*mainapp*/._IF7/*clReportStyle*/(tchild[i], "appstyle", false);
    	}
    	c.push("</Styles>");
    	c.push("</result></item></smsg>");
    	
    	content = c.join("");
    	
    	req.init(panel, 
			{
	            ack: "31",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid}),
	            mbody: content
	        }, panel, panel.rs_sK4/*saveMetaContent*/, null);
		req._l/*request*/();
    },
    
    rs_sK4/*saveMetaContent*/: function(xdoc) {
    	var panel=this;
    	
    	panel.setLoading(false);
    	
    	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
    },
    
    sk4/*createTabDimension*/: function() {
    	var panel = this,
    		txttabdim = this.down("[name=txttabdim]").getValue();
    	
    	if (txttabdim == "")
    		return;
    	
    	var req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			purpose = "31",
			address = IG$/*mainapp*/._I2d/*getItemAddress*/(
            	{
            		address: this.nodepath + "/" + txttabdim,
            		name: txttabdim,
            		type: "TabDimension",
            		pid: this.uid,
            		description: ""
            	}, "address;name;type;pid;description;memo"),
	        	content = IG$/*mainapp*/._I2e/*getItemOption*/();
		
		req.init(panel, {
	        ack: purpose,
	        payload: address,
	        mbody: content
	    }, panel, panel.rs_sk4/*createTabDimension*/, null);
	    req._l/*request*/();
    },
    
    rs_sk4/*createTabDimension*/: function(xdoc) {
    	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
    	
    	if (tnode)
    	{
    		this.tabdimension = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
    	}
    },
    
    entryLogin: function(thisobj) {
    	if (demos.Login.success == true)
		{
			var panel = this;
			panel.sK5/*procLoadContent*/(panel);
		}
		else
		{
			history.back(-1);
		}
    },
    
    sK5/*procLoadContent*/: function() {
    	var panel = this,
    		datainfo = this.down("[name=datainfo]");
    		// tabpanel = this.down("[name=datatabpanel]");
    	panel.setLoading(true, true);
    	
    	this.header = [];
    	this.headermap = {};
		this.dataset = [];
		
		datainfo.store.loadData([]);
		// tabpanel.removeAll();
		
    	
    	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	req.init(panel, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "content"}, "option")
	        }, panel, panel.rs_sK5/*procLoadContent*/, null);
		req._l/*request*/();
    },
    
    rs_sK5/*procLoadContent*/: function(xdoc) {
    	var i,
    		panel = this,
    		rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
    		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Result");
    	
    	if (rnode != null)
    	{
    		this.nodepath = IG$/*mainapp*/._I1b/*XGetAttr*/(rnode, "nodepath");
    	}
    	
    	if (tnode != null)
    	{
    		this.delimiter = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "delimiter");
    		this.dbnode = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbnode");
    		this.dbscan = parseInt(IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbscan") || "100");
    		this.parseResultData(tnode);
    		
   			this.drawDataView();
    	}
    },
    
    drawDataView: function() {
    	var panel = this,
    		cols = this.columnobj, cvdata = this.columninfo,
    		col, records, md, sortdesc,
    		columnviewstore = this.columnview.store,
    		i;
    	
		for (i=0; i < this.header.length; i++)
		{
			col = {
				xtype: "gridcolumn",
				text: this.header[i].code,
				dataIndex: i,
				editor: {
					allowBlank: false
				}
			};
			
			sortdesc = this.header[i].sortorder || "";
			sortdesc = (sortdesc == "asc") ? "▲" : (sortdesc == "desc") ? "▼" : "";
			sortdesc = (sortdesc != "" && this.header[i].sorttype == "NUMBER") ? sortdesc + "(" + this.header[i].sorttype + ")" : sortdesc;
			
			cvdata.push({
				text: this.header[i].code,
				uid: this.header[i].uid || null,
				datatype: this.header[i].datatype || "string",
				fieldname: this.header[i].fieldname || this.header[i].code,
				sortorder: this.header[i].sortorder,
				sorttype: this.header[i].sorttype,
				itemstyle: this.header[i].itemstyle || "",
				sortdesc: sortdesc,
				nodepath: this.header[i].nodepath || "",
				groupmeasure: this.header[i].groupmeasure || "",
				removeblank: this.header[i].removeblank, 
				isdatetype: this.header[i].isdatetype || false,
				dateformat: this.header[i].dateformat || "",
				dateitems: this.header[i].dateitems || null,
				datecustom: this.header[i].datecustom || null,
				nodename: this.header[i].nodename || null,
				aggregate: this.header[i].aggregate || null,
				dataIndex: i
			});
			cols.push(col);
		}
		
		columnviewstore.loadData(cvdata);
    },
    
    cxc/*loadDataSet*/: function(rowIndex) {
    	var panel = this,
			storecolumn = this.down("[name=datainfo]").store, 
			rec = storecolumn.data.items[rowIndex],
			tablename = rec.get("name");
    	
    	this.tablename = tablename;
    	
    	var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
    	panel.setLoading(true, true);
		
		req.init(panel, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, dbtype: panel.dbtype, nodename: panel.dbnode, dbname: panel.dbname, tablename: panel.tablename, option: "nosqldb", dbscan: (panel.dbscan || 1)}, "uid;dbtype;option;dbname;tablename;dbscan;nodename"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "standard"})
	        }, panel, panel.rs_cxc/*loadDataSet*/, null);
		req._l/*request*/();
    },
    
    rs_cxc/*loadDataSet*/: function(xdoc) {
    	var panel = this,
    		dp = {}, d,
    		i, cname, datatype,
    		tnode, tnodes;
    	
    	tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg");
    	
    	if (tnode)
    	{
    		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
    		
    		for (i=0; i < tnodes.length; i++)
    		{
    			cname = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name");
    			datatype = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "type");
    			dp[cname] = 1;
    			if (!this.headermap[cname])
    			{
    				d = {
    					uid: null,
    					code: cname,
    					datatype: datatype,
    					fieldname: cname
    				}
    				
    				this.headermap[cname] = d;
    				this.header.push(d);
    			}
    		}
    		
    		for (i=this.header.length-1; i>= 0; i--)
    		{
    			cname = this.header[i].fieldname;
    			if (!dp[cname])
    			{
    				this.header.splice(i, 1);
    				delete this.headermap[cname];
    			}
    		}
    		
    		this.columninfo = [];
    		this.drawDataView();
    	}
    },
    
    parseResultData: function(tnode) {
		var hnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "Header");
		this.cols = parseInt(IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "cols"));
		this.dbtype = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbtype");
		this.dbname = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbname");
		this.tablename = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "tablename");
		
		if (this.dbtype && this.dbname)
		{
			this.loadTableContent();
		}
		
		var child = IG$/*mainapp*/._I26/*getChildNodes*/(hnode);
		
		var i,
			j,
			cell,
			mnodes;
		
		for (i=0; i < child.length; i++)
		{
			cell = {};
			cell.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "uid") || null;
			cell.code = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "name");
			cell.datatype = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "type") || "string";
			cell.fieldname = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "fieldname") || cell.code;
			cell.sortorder = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "sortorder");
			cell.sorttype = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "sorttype");
			cell.itemstyle = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "itemstyle");
			cell.groupmeasure = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "groupmeasure") || "";
			cell.removeblank = (IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "removeblank") == "T" ? true : false);
			cell.isdatetype = (IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "isdatetype") == "T" ? true : false);
			cell.dateformat = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "dateformat");
			cell.dateitems = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "dateitems");
			cell.datecustom = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "datecustom");
			cell.aggregate = IG$/*mainapp*/._I1b/*XGetAttr*/(child[i], "aggregate") || "avg";
			
			this.header.push(cell);
			this.headermap[cell.fieldname] = cell; 
		}
		
		var dstyle = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "Styles"),
			styleitem;
		if (dstyle)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(dstyle);
			for (i=0; i < child.length; i++)
			{
				styleitem = new IG$/*mainapp*/._IF7/*clReportStyle*/(child[i], "appstyle", true);
				this.styles.push(styleitem);
			}
		}
		
		var dnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "DataObjects"),
			dchild;
		
		if (dnode)
		{
			dchild = IG$/*mainapp*/._I26/*getChildNodes*/(dnode);
			for (i=0; i < dchild.length; i++)
			{
				this.dataset.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(dchild[i]));
			}
		}
		
		dnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "TabDimension");
		
		if (dnode)
		{
			this.tabdimension = IG$/*mainapp*/._I1c/*XGetAttrProp*/(dnode);
			
			if (this.tabdimension.uid && this.tabdimension.name)
			{
				this.down("[name=cbtabdim]").setValue(true);
				this.down("[name=txttabdim]").setValue(this.tabdimension.name);
			}
		}
		
		dnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "GroupMeasures");
		
		if (dnode)
		{
			this.groupmeasures = [];
			dchild = IG$/*mainapp*/._I26/*getChildNodes*/(dnode);
			for (i=0; i < dchild.length; i++)
			{
				this.groupmeasures.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(dchild[i]));
			}
		}
    },
    
    l99/*setGridSize*/: function() {
    	var grid = this.down("[name=columnview]"),
    		o1 = $(grid.el.dom).offset(),
    		o2 = $(this.body.dom).offset();
    	
    	h = 100;
    	h = $(this.body.dom).height() - o1.top + o2.top - 5;
    	
    	grid.setHeight(h);
    },
    
    listeners: {
    	afterrender: function(ui) {
    		var panel = ui,
    			// dview = panel.down("[name=dataview]"),
				columnview = panel.down("[name=columnview]");
			
    		panel.l99/*setGridSize*/.call(panel);
			// panel.dataview = dataview;
			panel.columnview = columnview;
				
    		if (panel.initialized == false)
    		{
    			panel.sK5/*procLoadContent*/();
    			panel.initialized = true;
    		}
    	},
    	deactivate: function(ui) {
    		var panel = ui;
    		panel.disposeContent(panel);
    	},
    	resize: function() {
    		this.l99/*setGridSize*/();
    	}
    },
    disposeContent: function(ui) {
    }
});
IG$/*mainapp*/._Id9/*securityFilter*/ = $s.extend($s.window, {
	title: "Security Filter Management",
	modal: true,
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 300,
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
			var i,
				gridduty = this.down("[name=gridduty]"),
				seq, seqids = {};
			
			for (i=0; i < gridduty.store.data.items.length; i++)
			{
				seq = gridduty.store.data.items[i].get("index");
				seqids[seq] = true;
			}
			
			for (i=panel.securityfilter.length - 1; i>=0; i--)
			{
				seq = panel.securityfilter[i].index;
				if (!seqids[seq])
				{
					panel.securityfilter.splice(i, 1);
				}
			}
			
			this.callback.execute();
		}
		this.close();
	},
	
	mm2/*loadSecurityFilter*/: function() {
		var panel = this,
			dp = [],
			gridduty = this.down("[name=gridduty]"),
			i;
		
		if (panel.securityfilter)
		{
			for (i=0; i < panel.securityfilter.length; i++)
			{
				panel.securityfilter[i].index = i;
				dp.push({
					authname: panel.securityfilter[i].authname,
					active: panel.securityfilter[i].active,
					index: i
				});
			}
		}
		
		gridduty.store.loadData(dp);
	},
	
	CM1/*authSet*/: function(rec, cmd) {
		var panel = this,
			gridduty = panel.down("[name=gridduty]"),
			rowIndex;
		
		if (cmd == "remove")
		{
			rowIndex = gridduty.store.indexOf(rec);
			this.securityfilter.splice(rowIndex, 1);
			gridduty.store.remove(rec);
		}
		else
		{
			var i, mindex,
				seq = rec.get("index"),
				item;
			
			for (i=0; i < this.securityfilter.length; i++)
			{
				if (this.securityfilter[i].index == seq)
				{
					item = this.securityfilter[i];
					mindex = i;
					break;
				}
			}
			var opanel = new IG$/*mainapp*/._Ia1/*filterEditorWindow*/({
				_ILb/*sheetoption*/: {
					filter: item
				},
				_ILa/*reportoption*/: {
					cubeuid: this.uid
				},
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, function(sop) {
					this.securityfilter[mindex] = sop.filter;
	    		})
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, opanel);
		}
	},
	
	initComponent : function() {
		var panel = this;
		
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
	        	    	value: "Select user duty from list"
	        	    },
	        	    {
	        	    	xtype: "gridpanel",
	        	    	name: "gridduty",
	        	    	height: 150,
	        	    	selType: "checkboxmodel",
	        	    	selModel: {
	        	    		checkSelector: ".x-grid-cell",
							mode: "MULTI"
	        	    	},
	        	    	multiSelect: true,
	        	    	store: {
	        	    		fields: [
	        	    			"authname", "active", "index"
	        	    		]
	        	    	},
	        	    	columns: [
	        	    	    {
	        	    	    	header: "Auth Name",
	        	    	    	dataIndex: "authname",
								flex: 1,
								sortable: false,
								hideable: false        	    	    	
	        	    	    },
	        	    	    {
	        	    	    	xtype: 'actioncolumn',
	        					width: 50,
	        					items: [
	        						{
	        							// icon: './images/plus-circle.png',
	        							iconCls: "icon-grid-add",
	        							tooltip: 'Edit',
	        							handler: function (grid, rowIndex, colIndex) {
	        								var rec = grid.store.getAt(rowIndex);
	        								panel.CM1/*authSet*/.call(panel, rec, "edit");
	        							}
	        						},
	        						{
	        							// icon: './images/delete.png',
	        							iconCls: "icon-grid-delete",
	        							tooltip: 'Remove Filtering',
	        							handler: function (grid, rowIndex, colIndex) {
	        								var rec = grid.store.getAt(rowIndex);
	        								panel.CM1/*authSet*/.call(panel, rec, "remove");
	        							}
	        						}
	        					]     	    	    	
	        	    	    }
	        	    	]
	        	    }
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
		
		IG$/*mainapp*/._Id9/*securityFilter*/.superclass.initComponent.apply(this, arguments);
	},
	
	listeners: {
		afterrender: function(ui) {
			this.mm2/*loadSecurityFilter*/();
		}
	}
});

IG$/*mainapp*/._If2/*selectPool*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": "fit",
	
	closable: false,
	resizable:false,
	width: 450,
	autoHeight: true,
	
	_s1/*selectedPool*/: null,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.callback && this.callback.execute(this);
		
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			i, item,
			grdschema = me.down("[name=grdschema]"),
			grdschemastore = grdschema.store,
			grdschemasel = grdschema.getSelectionModel(),
			selvalue = grdschemasel ? grdschemasel.getSelection() : null,
			sel;
			
		me._s1/*selectedPool*/ = [];
		
		if (selvalue && selvalue.length > 0)
		{
			for (i=0; i < selvalue.length; i++)
			{
				sel = selvalue[i];
				me._s1/*selectedPool*/.push({name: sel.get("name"), uid: sel.get("uid")});
			}
		}
		
		if (me._s1/*selectedPool*/.length == 0)
		{
			return false;
		}
		
		me._IG0/*closeDlgProc*/();
	},
	
	i1/*loadTableContent*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		panel.setLoading(true);
		req.init(panel, 
			{
                ack: "25",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/"}, "address"),
                mbody: "<smsg></smsg>"
            }, panel, panel.rs_i1/*loadTableContent*/, null);
        req._l/*request*/();
	},
	
	rs_i1/*loadTableContent*/: function(xdoc) {
		var me = this,
			d,
			i, tnodes, tnode, address, req;
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		
		me.setLoading(false);
		
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			address = "<smsg>";
			for (i=0; i < tnodes.length; i++)
			{
				d = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				address += "<item address='/" + d.name + "' option='StoredContent'/>";
			}
			address += "</smsg>";
			
			me.setLoading(true);
			
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
	                ack: "25",
	                payload: address,
	                mbody: "<smsg></smsg>"
	            }, me, me.rs_i1a/*loadPoolContent*/, null);
	        req._l/*request*/();
			// grdschemastore.loadData(dp);
		}
	},
	
	rs_i1a/*loadPoolContent*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"), tnodes,
			dp = [], i, d,
			grdschema = me.down("[name=grdschema]"),
			grdschemastore = grdschema.store;
		
		me.setLoading(false);
		
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tnodes.length; i++)
			{
				d = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				d.dispname = d.name;
				d.dispname = IG$/*mainapp*/._I08/*formatName*/(d.dispname);
				dp.push(d);
			}
			
			grdschemastore.loadData(dp);
		}
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1('T_SELECT_POOL');
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				{
					xtype: "panel",
					layout: "anchor",
					defaults: {
						anchor: "100%"
					},
					items: [
						{
							xtype: "displayfield",
							value: "* Select database connection pool to use in this model"
						},
						{
							xtype: "gridpanel",
							name: "grdschema",
							height: 300,
							selType: "checkboxmodel",
							selModel: {
								checkSelector: ".x-grid-cell"
							},
							store: {
								xtype: "store",
								fields: [
									"name", "uid", "memo", "dispname"
								]
							},
							columns: [
								{
									header: "Name",
									name: "name",
									dataIndex: "dispname",
									sortable: false,
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
			],
			listeners: {
				afterrender: function(ui, opt) {
					var me = this;
					setTimeout(function() {
						me.i1/*loadTableContent*/.call(me);
					}, 10);
				}
			}
		});
		
		IG$/*mainapp*/._If2/*selectPool*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.mm$99/*cubemodelst*/ = function(xdoc) {
	var me = this,
		t, i, j, snodes, fnodes,
		tnode = (xdoc ? IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item") : null),
		onode,
		table, relation, field;
	
	me.pools = [];
	me.pooluids = [];
	me.zoom = 1.0;
	me.groupview = false;
	me.tables = [];
	me.relations = [];
	me.cAM/*fixKeyMode*/ = false;
	
	if (tnode)
	{
		me.item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
		
		onode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "objinfo");
		
		if (onode)
		{
			me.pools = IG$/*mainapp*/._I1b/*XGetAttr*/(onode, "pool").split(";");
			me.pooluids = IG$/*mainapp*/._I1b/*XGetAttr*/(onode, "pooluid").split(";");
			t = IG$/*mainapp*/._I1b/*XGetAttr*/(onode, "zoomfactor");
			if (t)
			{
				me.zoom = Number(t);
			}
			t = IG$/*mainapp*/._I1b/*XGetAttr*/(onode, "groupview");
			me.groupview = (t == "T") ? true : false;
			t = IG$/*mainapp*/._I1b/*XGetAttr*/(onode, "fixjoin");
			me.cAM/*fixKeyMode*/ = (t == "T") ? true : false;
		}
		
		onode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "Tables");
		
		if (onode)
		{
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(onode);
			
			for (i=0; i < snodes.length; i++)
			{
				table = new IG$/*mainapp*/.mm$98/*tableobject*/(snodes[i]);
				table.cAM/*fixKeyMode*/ = me.cAM/*fixKeyMode*/;
				table.fields = [];
				
				fnodes = IG$/*mainapp*/._I26/*getChildNodes*/(snodes[i]);
				for (j=0; j < fnodes.length; j++)
				{
					field = IG$/*mainapp*/._I1c/*XGetAttrProp*/(fnodes[j]);
					field.selected = (field.selected == "T") ? true : false;
					field.seq = table.seq;
					field.iskey = (field.iskey == "T") ? true : false;
					table.fields.push(field);
				}
				me.tables.push(table);
			}
		}
		
		onode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "Relation");
		
		if (onode)
		{
			var tsrc, ttgt;
			
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(onode);
			
			for (i=0; i < snodes.length; i++)
			{
				t = snodes[i];
				
				relation = IG$/*mainapp*/._I1c/*XGetAttrProp*/(t);
				relation.p1dist = relation.p1dist ? parseInt(relation.p1dist) : null;
				
				tsrc = IG$/*mainapp*/._I18/*XGetNode*/(t, "source");
				ttgt = IG$/*mainapp*/._I18/*XGetNode*/(t, "target");
				
				relation.source = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tsrc);
				relation.source.seq = (relation.source.seq ? parseInt(relation.source.seq) : 0) || 0;
				relation.source.formula = IG$/*mainapp*/._I1a/*getSubNodeText*/(tsrc, "formula");
				relation.target = IG$/*mainapp*/._I1c/*XGetAttrProp*/(ttgt);
				relation.target.seq = (relation.target.seq ? parseInt(relation.target.seq) : 0) || 0;
				relation.target.formula = IG$/*mainapp*/._I1a/*getSubNodeText*/(ttgt, "formula");

				me.relations.push(relation);
			}
		}
	}
}

IG$/*mainapp*/.mm$98/*tableobject*/ = function(onode) {
	var me = this,
		tbinfo;
	
	me.ranged = false;
	
	if (onode != null)
	{
		tbinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(onode);
		tbinfo.cpM = tbinfo.cpM == "T";
		tbinfo.vr = tbinfo.vr == "T";
		IG$/*mainapp*/._I1d/*CopyObject*/(tbinfo, me, null);
	}
	
	if (me.seq)
	{
		me.seq = parseInt(me.seq);
	}
	else
	{
		me.seq = 0;
	}
}

IG$/*mainapp*/.mm$98/*tableobject*/.prototype = {
	s1/*stageX*/: function() {
		var me = this,
			r = 0,
			bbox = me.bbox,
			mdom;
		
		if (me.box)
		{
			//if (!bbox)
			{
				me.bbox = {
					left: me.box.pobj.o5/*scrollpanel*/.offset().left,
					top: me.box.pobj.o5/*scrollpanel*/.offset().top
				};
				bbox = me.bbox;
			}
			// r = me.box.o4/*innerbox*/.offset().left - bbox.left;
			mdom = $(me.box.o3/*innergrid*/.body.dom);
			r = mdom.offset().left - bbox.left;
		}
		
		return r;
	},
	s2/*stageY*/: function(fieldname) {
		var me = this,
			r = 0,
			bbox = me.bbox,
			i,
			bdom,
			sobj, skey;
			
		if (me.box)
		{
			//if (!bbox)
			{
				me.bbox = {
					left: me.box.pobj.o5/*scrollpanel*/.offset().left,
					top: me.box.pobj.o5/*scrollpanel*/.offset().top
				};
				bbox = me.bbox;
			}
			
			// r = me.box.o4/*innerbox*/.offset().top - bbox.top;
			bdom = $(me.box.o3/*innergrid*/.body.dom);
			sobj = me.box.o3/*innergrid*/.down("[name=skey]");
			skey = sobj && sobj.body ? $(sobj.body.dom) : null;
			
			r = bdom.offset().top - bbox.top + (skey ? skey.height() || 0 : 0);
			
			if (fieldname != null)
			{
				var grid = me.box.o3/*innergrid*/,
					hnode = null,
					m;
				
				m = grid.l2/*getHeight*/.call(grid, fieldname);
				
				r += m.d;
				me.ranged = m.ranged;
			}
		}
		
		return r;
	},
	s3/*bodyWidth*/: function() {
		var me = this,
			r = 0;
		
		if (me.box)
		{
			// r = me.box.o1/*outerbox*/.width();
			r = me.box.o3/*innergrid*/.getWidth();
		}
		
		return r;
	},
	s4/*bodyHeight*/: function() {
		var me = this,
			r = 0;
		
		if (me.box)
		{
			// r = (me.box.cpM/*collapseMode*/ == true) ? me.box.theight : me.box.o1/*outerbox*/.height();
			r = (me.box.cpM/*collapseMode*/ == true) ? me.box.theight : me.box.o3/*innergrid*/.getHeight();
		}
		
		return r;
	}
}

IG$/*mainapp*/.mm$99/*cubemodelst*/.prototype = {
	l1/*getXML*/: function() {
		var i, j, me = this,
			f, tb,
			r = "<smsg>";
		
		r += "<item" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.item, "uid;name;type", "s") + ">";
		r += "<objinfo" + IG$/*mainapp*/._I20/*XUpdateInfo*/({
				pool: me.pools.join(";"), 
				pooluid: me.pooluids.join(";"),
				zoomfactor: me.zoomfactor
			}, "pool;pooluid;zoomfactor", "s") + IG$/*mainapp*/._I20/*XUpdateInfo*/({
				groupview: me.groupview,
				fixjoin: me.cAM/*fixKeyMode*/
			}, "groupview;fixjoin", "b") + "/>";
		
		r += "<Tables>";
		for (i=0; i < me.tables.length; i++)
		{
			tb = me.tables[i];
			tb.vr = true;
			r += "<Table" + IG$/*mainapp*/._I20/*XUpdateInfo*/(tb, "uid;name;memo;type;schemaname;nodepath", "s")
						  + IG$/*mainapp*/._I20/*XUpdateInfo*/(tb, "x;y;width;height;seq;theight", "i")
						  + IG$/*mainapp*/._I20/*XUpdateInfo*/(tb, "cpM;vr", "b") + ">";
			
			for (j=0; j < tb.fields.length; j++)
			{
				f = tb.fields[j];
				f.tableuid = f.tableuid || tb.uid;
				
				if (f.iskey || f.hasjoin)
				{
					r += "<Field" + IG$/*mainapp*/._I20/*XUpdateInfo*/(f, "uid;alias;name;nodepath;datatype;tablename;type;tableuid", "s")
								  + IG$/*mainapp*/._I20/*XUpdateInfo*/(f, "datasize;iskey", "i")
								  + IG$/*mainapp*/._I20/*XUpdateInfo*/(f, "selected", "b") + "/>";
				}
			}
			
			r += "</Table>";
		}
		r += "</Tables>";
		
		r += "<Relation>";
		for (i=0; i < me.relations.length; i++)
		{
			r += "<Link" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.relations[i], "join;operator", "s") 
				+ IG$/*mainapp*/._I20/*XUpdateInfo*/(me.relations[i], "p1dist", "i") 
				+ ">";
			r += "<source" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.relations[i].source, "uid;nodepath;datatype;name;tablename;type;tableuid", "s") + " seq='" + (me.relations[i].source.seq || 0) + "'>";
			r += "<formula><![CDATA[" + (me.relations[i].source.formula || "") + "]]></formula>";
			r += "</source>";
			r += "<target" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.relations[i].target, "uid;nodepath;datatype;name;tablename;type;tableuid", "s") + " seq='" + (me.relations[i].target.seq || 0) + "'>";
			r += "<formula><![CDATA[" + (me.relations[i].target.formula || "") + "]]></formula>";
			r += "</target>";
			r += "</Link>";
		}
		r += "</Relation>";
		
		r += "<AuthFilter>";
		
		r += "</AuthFilter>";
		
		r += "</item>";
		
		r += "</smsg>";
		
		return r;
	}
}
IG$/*mainapp*/.m92/*cubemodelviewer*/ = function(viewer, sobj) {
	var me = this;
	me.sobj = sobj;
	me.viewer = viewer;
	me.dialog = [];
	me.links = [];
	me.Z1/*zoomRatio*/ = 1;
	me.lm/*lineMode*/ = "2";
}

IG$/*mainapp*/.m92/*cubemodelviewer*/.prototype = {
	init: function() {
		var me = this;
		
		me.mpt/*mouseactionpoint*/ = null;
		
		me.o6/*container*/ = $("<div></div>").css({position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#ffffff", overflow: "auto"}).appendTo(me.viewer);
		me.paint = $("<div></div>");
		me.paint.appendTo(me.o6/*container*/);
		
		me.o5/*scrollpanel*/ = $("<div></div>").css({
			position: "absolute", 
			top: 0, 
			bottom: 0, 
			width: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.o6/*container*/), 
			height: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.o6/*container*/), 
			backgroundColor: "none"
		}).appendTo(me.o6/*container*/);
		me.sb/*appendScrollBar*/();
		me.o6/*container*/.droppable({
			drop: function( event, ui ) {
				
			}
		});
		
		me.l1/*allowDrop*/(me.o5/*scrollpanel*/[0]);
		
		me.o6/*container*/.bind("resize", function(ev) {
			me.s5/*validateSize*/.call(me);
		});
	},
	
	z1/*zoom*/: function(level) {
		var me = this;
		me.Z1/*zoomRatio*/ += level;
		
		$(me.viewer).animate({'zoom': me.Z1/*zoomRatio*/}, 400);
	},
	
	l1/*allowDrop*/: function(el) {
		var grid = this,
			me = this;
		
		me.dropZone = $s.create($s.dropzone, el, {
			ddGroup: 'CubeModelDDGroup',
			
			nodeouttimer: -1,
			
			getTargetFromEvent: function(e) {
				var px = e.browserEvent.pageX || e.browserEvent.clientX,
	        		py = e.browserEvent.pageY || e.browserEvent.clientY,
	        		renderer = grid.getRendererByPoint(px, py);
	        	
	        	if (renderer == null)
	        	{
	        		renderer = el;
	        	}
	        	
	            return renderer;
	        },
	        
	        notifyOut : function(dd, e, data){
	        	var me = this;
		        if(me.lastOverNode){
		            me.onNodeOut(me.lastOverNode, dd, e, data);
		            me.lastOverNode = null;
		        }
		        
		        grid.isDragging = false;
		        if (!grid.hideDropFeedback)
		        	return;
		        
	        	grid.hideDropFeedback.call(grid, e);
	        	
	        	if (me.accept == true && me.pivotmove == true)
	        	{
	        		if (grid.sheetobj)
	        		{
	        			if (me.nodeouttimer > -1)
		        		{
		        			clearTimeout(me.nodeouttimer);
		        		}
	        			
	        			me.nodeouttimer = setTimeout(function() {
	        				grid.hideDropFeedback.call(grid, e);
	        			}, 100);
	        			// grid.sheetobj._IP4/*procUpdateReport*/.call(grid.sheetobj);
	        		}
	        	}
		    },
		    
	        onNodeEnter : function(target, dd, e, data){
	        	grid.isDragging = true;
	        	
	        	var me = this,
	        		i,
	        		dt, dttype,
	        		hasitem = false,
	        		accept = false;
	        		
	        	if (data.records && data.records.length > 0)
	        	{
	        		dt = data.records[0].get("type");
	        		
	        		if (dt == "Table" || dt == "InlineView")
	        		{
        				accept = true;
	        		}
	        	}
	        	else if (data.cellData)
	        	{
	        		dt = data.cellData;
	        		accept = true;
	        	}
	        		        	
	        	me.accept = accept;
	        },
	        onNodeOut : function(target, dd, e, data){
	        	
	        },
	        onNodeOver : function(target, dd, e, data){
	        	var me = this,
	        		dt,
	        		ret;
	        	
	        	if (window.Ext)
	        	{	
	        	 	ret = ((me.accept == true) ? Ext.dd.DropZone.prototype.dropAllowed : Ext.dd.DropZone.prototype.dropNotAllowed);
	        	}
	        	else
	        	{
	        		ret =me.accept;
	        	}
	        	
	        	if (me.accept == true)
	        	{
	        		if (data.records && data.records.length > 0)
	        		{
	        			dt = data.records[0].data;
	        		}
	        		else
	        		{
	        			dt = data.cellData;
	        		}
	        	}
	            return ret;
	        },
	        onNodeDrop : function(target, dd, e, data){
	        	var me = this;
	            if (me.accept == true)
	            {
	            	if (data.records && data.records.length > 0)
	        		{
	        			dt = data.records[0].data;
	        			grid.sobj.d3/*onDropTable*/.call(grid.sobj, e, dt);
	        		}
	        		else
	        		{
	        			dt = data.cellData;
	        		}
	            }
	            
	            me.accept = false;
	            return true;
	        }
		});
	},
    
    _f1/*focusTable*/: function(tb) {
        var me = this,
            container = me.o6/*container*/,
            box = tb.box.o3/*innergrid*/,
            viewer = me.viewer,
            boff, doff, dom;
            
        if (box)
        {
            doff = container.offset();
            if (box.$ex)
            {
                // for webix
                if (me._psel && me._psel.box)
                {
                    $(me._psel.box.o3/*innergrid*/.$ex.$view).removeClass("igc-f-table");
                }
            
                dom = $(box.$ex.$view);
                
                boff = dom.offset();
                dom.addClass("igc-f-table");
                container.animate({
                    scrollTop: Math.max(boff.top - doff.top + container.scrollTop() - (viewer.height() - dom.height()) / 2, 0),
                    scrollLeft: Math.max(boff.left - doff.left + container.scrollLeft() - (viewer.width() - dom.width()) / 2, 0)
                }, 200);
            }
            else if (box.el && box.el.dom)
            {
                // for sencha
                if (me._psel && me._psel.box)
                {
                    $(me._psel.box.o3/*innergrid*/.el.dom).removeClass("igc-f-table");
                }
                
                dom = $(box.el.dom);
                
                boff = dom.offset();
                dom.addClass("igc-f-table");
                container.animate({
                    scrollTop: Math.max(boff.top - doff.top + container.scrollTop() - (viewer.height() - dom.height()) / 2, 0),
                    scrollLeft: Math.max(boff.left - doff.left + container.scrollLeft() - (viewer.width() - dom.width()) / 2, 0)
                }, 200);
            }
            me._psel = tb;
        }
    },
	
	getRendererByPoint: function() {
		return null;
	},
	
	sb/*appendScrollBar*/: function() {
		var me = this,
			viewer = this;
		
//		function __doDrag(event) {
//			viewer.sc/*scrollhandler*/("move", event);
//		}
//		
//		function __endDrag(event) {
//			viewer.sc/*scrollhandler*/("up", event);
//			$(document).unbind("mousemove", __doDrag)
//					   .unbind("mouseup", __endDrag);
//		}
//		
		me.o7/*scrollbar*/ = $("<div></div>").css({
			position: "absolute", 
			top: 0, bottom: 0, 
			width: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.o6/*container*/), 
			height: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.o6/*container*/), 
			backgroundColor: "none"
		}).appendTo(me.o5/*scrollpanel*/);
//		me.o7/*scrollbar*/.bind("mousedown", function(ev) {
//			viewer.sc/*scrollhandler*/("down", ev);
//			
//			$(document)
//				.bind("mousemove", __doDrag)
//				.bind("mouseup", __endDrag);
//		});
		/*
		me.scrollbar.bind("mouseup", function(ev) {
			viewer.sc("up", ev);
		});
		me.scrollbar.bind("mousemove", function(ev) {
			viewer.sc("move", ev);
		});
		*/
		me.rcanvas = Raphael(me.o7/*scrollbar*/[0], 0, 0, "100%", "100%");
		me._ca = [];
	},
	
	sc/*scrollhandler*/: function(ctype, ev) {
		var me = this;
		
		switch (ctype)
		{
		case "down":
			me.mpt/*mouseactionpoint*/ = {x: ev.pageX, y:ev.pageY};
			break;
		case "up":
			me.mpt/*mouseactionpoint*/ = null;
			break;
		case "move":
			var w_o6 = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(o6/*container*/),
				w_o5 = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(o5/*scrollpanel*/),
				h_o6 = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(o6/*container*/),
				h_o5 = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(o5/*scrollpanel*/);
				
			if (me.mpt/*mouseactionpoint*/ != null && (w_o6 < w_o5 || h_o6/*container*/ < h_o5/*scrollpanel*/))
			{
				var paint = me.paint,
					scrollpanel = me.o5/*scrollpanel*/,
					scrollbar = me.o7/*scrollbar*/,
					m = me.o6/*container*/.offset(),
					offset = scrollpanel.offset(),
					dx = ev.pageX - me.mpt/*mouseactionpoint*/.x,
					dy = ev.pageY - me.mpt/*mouseactionpoint*/.y,
					a;
				
				// offset.top -= m.top;
				// offset.left -= m.left;
				
				a = {top: offset.top + dy, left: offset.left + dx};
				
				me.mpt/*mouseactionpoint*/ = {x: ev.pageX, y: ev.pageY};
				
				if (a.top < h_o6 - h_o5 || a.left < w_o6 - w_o5 || a.top - m.top> 0 || a.left - m.left> 0)
					return;
				scrollbar.offset(a);
				scrollpanel.offset(a);
				paint.offset(a);
			}
			break;
		}
	},
	
	clearAll: function() {
		var me = this;
		
		me.dialog = [];
		me.links = [];
		me.rcanvas.clear();
		$.each(me._ca, function(i, c) {
			c.remove();
		});
		me._ca = [];
		me.o5/*scrollpanel*/.empty();
		me.sb/*appendScrollBar*/();
	},
	
	s5t/*validateTimer*/: -1,
	
	s5/*validateSize*/: function() {
		var me = this;
		
		if (me.s5t/*validateTimer*/)
		{
			clearTimeout(me.s5t/*validateTimer*/);
		}
		
		me.s5t/*validateTimer*/ = setTimeout(function() {
			me.s5m/*validateSizeTimer*/.call(me);
		}, 100);
	},
	
	s5m/*validateSizeTimer*/: function() {
		var viewer = this,
			o = viewer.o6/*container*/.offset(),
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(viewer.o6/*container*/),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(viewer.o6/*container*/),
			i;
		
		for (i=0; i < viewer.dialog.length; i++)
		{
			w = Math.max(w, viewer.dialog[i].table.s1/*stageX*/() + viewer.dialog[i].table.s3/*bodyWidth*/() + 100);
			h = Math.max(h, viewer.dialog[i].table.s2/*stageY*/() + viewer.dialog[i].table.s4/*bodyHeight*/() + 100);
		}
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(viewer.o5/*scrollpanel*/, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(viewer.o5/*scrollpanel*/, h);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(viewer.o7/*scrollbar*/, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(viewer.o7/*scrollbar*/, h);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(viewer.paint, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(viewer.paint, h);
		viewer.rcanvas.setSize(w, h);
		
		viewer.s6/*validateLinks*/();
	},
	
	s6/*validateLinks*/: function() {
		var me = this,
			i;
		
		me.rcanvas.clear();
		
		$.each(me._ca, function(i, c) {
			c.remove();
		});
		me._ca = [];
		
		for (i=0; i < me.links.length; i++)
		{
			me.links[i].refresh.call(me.links[i], i, me.sobj.c1/*cubemodel*/.groupview == true);
		}
	},
	
	s7/*addBox*/: function(x, y, width, height, tb, main) {
		var me = this,
			b = new IG$/*mainapp*/.m93/*tablebox*/(me, x, y, width, height, tb);
		b.main = main;
		b.cp/*collapsePanel*/.call(b, tb.cpM/*collapseMode*/);
		b.o3/*innergrid*/.cAM/*fixKeyMode*/.call(b.o3/*innergrid*/, tb.cAM/*fixKeyMode*/);
		me.dialog.push(b);
		return b;
	},
	
	s8/*addLink*/: function(fobj, tobj, link, relations) {
		var me = this,
			i,
			b,
			l;
		
		me.relations = relations;
		
		for (i=0; i < me.links.length; i++)
		{
			l = me.links[i];
			
			if (!l)
				continue;
			
			if ((l.o10/*fromobj*/.uid == fobj.uid && l.o11/*toobj*/.uid == tobj.uid && l.o10/*fromobj*/.seq == fobj.seq && l.o11/*toobj*/.seq == tobj.seq) || 
			    (l.o10/*fromobj*/.uid == tobj.uid && l.o11/*toobj*/.uid == fobj.uid && l.o10/*fromobj*/.seq == tobj.seq && l.o11/*toobj*/.seq == fobj.seq))
			{
				b = l;
				break;
			}
		}
		
		if (b)
		{
			b.links.push(link);
		}
		else
		{
			b = new IG$/*mainapp*/.m94/*linkfield*/(me, fobj, tobj, link, relations);
			me.links.push(b);
		}
		return b;
	},
	
	s9/*removeTable*/: function(tobj) {
		var me = this,
			sobj = me.sobj,
			c1 = sobj.c1/*cubemodel*/,
			i, j,
			dialog = me.dialog,
			links = me.links,
			r;
		
		for (i=0; i < c1.tables.length; i++)
		{
			if (tobj.table == c1.tables[i])
			{
				c1.tables.splice(i, 1);
				break;
			}
		}
		
		for (i=0; i < dialog.length; i++)
		{
			if (dialog[i] == tobj)
			{
				dialog.splice(i, 1);
				// tobj.o1/*outerbox*/.remove();
				break;
			}
		}
		
		for (i=links.length-1; i >=0; i--) 
		{
			if (links[i].o10/*fromobj*/ == tobj.table || links[i].o11/*toobj*/ == tobj.table)
			{
				r = links[i];
				for (j=c1.relations.length-1; j>=0; j--)
				{
					if (c1.relations[j].bl == r)
					{
						c1.relations.splice(j, 1);
					}
				}
				links.splice(i, 1);
			}
		}
		
        sobj.l5a/*updateUsedTable*/.call(sobj);
		sobj.d1/*validateTables*/.call(sobj);
		sobj.d2/*validateJoins*/.call(sobj);
	}
};

IG$/*mainapp*/.m93/*tablebox*/ = function(pobj, x, y, width, height, table) {
	var tbbox = this,
		me = this,
		owner = pobj,
		ibox, 
		dval = table.name;
	
	me.pobj = pobj;
	me.table = table;
	
	table.theight = table.theight || height;
	
	if (table.seq && table.seq > 0)
	{
		dval += "(" + table.seq + ")";
	}
	
//	height = (table.cpM/*collapseMode*/ == false && table.theight) ? table.theight : height;
	
//	me.o1/*outerbox*/ = $("<div></div>").css({position: "absolute", top: y, left: x, width: width, height: height, backgroundColor: "blue", zIndex: 3}).appendTo(me.pobj.o5/*scrollpanel*/);
//	me.o2/*handle*/ = $("<div class='cubemodel-table-handle'></div>").css({position: "absolute", top: 2, left: 2, right: 2, height: 16, backgroundColor: "white"}).appendTo(me.o1/*outerbox*/);
//	me.o2/*handle*/.text(dval);
//	var btnbar = $("<div class='cubemodel-table-btnbar'></div>").appendTo(me.o2/*handle*/);
//	
//	var mobj = $("<div class='cubemodel-table-collapse'></div>").appendTo(btnbar);
//	mobj.bind("click", function() {
//		tbbox.cp/*collapsePanel*/.call(tbbox, !tbbox.table.cpM/*collapseMode*/);
//	});
//	
//	var robj = $("<div class='cubemodel-table-remove'></div>").appendTo(btnbar);
//	robj.bind("click", function() {
//		owner.s9/*removeTable*/.call(owner, tbbox);
//	});
	
	
	me.table.cpM/*collapseMode*/ = me.table.cpM/*collapseMode*/ || false;
	
	
	
//	this.o1/*outerbox*/.draggable({
//		handle: this.o2/*handle*/,
//		stop: function(ui, event) {
//			var mainoff = owner.o5/*scrollpanel*/.offset(),
//				ioff = tbbox.o1/*outerbox*/.offset();
//			
//			tbbox.table.x = ioff.left - mainoff.left;
//			tbbox.table.y = ioff.top - mainoff.top;
//			owner.s5/*validateSize*/.call(owner);
//			owner.s6/*validateLinks*/.call(owner);
//		}
//	}).resizable({
//		start: function(event, ui) {
//			tbbox.o3/*innergrid*/.setVisible(false);
//		},
//		stop: function(event, ui) {
//			owner.s5/*validateSize*/.call(owner);
//			owner.s6/*validateLinks*/.call(owner);
//			var w = tbbox.o4/*innerbox*/.width(),
//				h = tbbox.o4/*innerbox*/.height();
//			
//			tbbox.o3/*innergrid*/.setVisible(true);
//			tbbox.o3/*innergrid*/.setSize(w, h);
//			tbbox.table.width = w;
//			tbbox.table.height = h;
//		}
//	});
//	ibox = $("<div></div>").css({position: "absolute", top: 20, left: 2, right: 2, bottom: 2, backgroundColor: "#efefef"}).appendTo(this.o1/*outerbox*/);
//	this.o4/*innerbox*/ = ibox;

	me.o3/*innergrid*/ = new $s.panel({
		renderTo: this.pobj.o5/*scrollpanel*/[0], //ibox[0],
		table: table,
		autoScroll: false,
		stateful: false,
		resizable: true,
		draggable: true,
		floating: true,
		baseCls: $s.baseCSSPrefix + 'window',
		plain: false,
		minimizable: false,
		alwaysFramed: true,
		closable: true,
		cpa: owner,
		title: dval,
		x: x,
		border: 1,
		y: y,
		width: width,
		height: table.theight, //ibox.height(),
		viewmode: "physical",
		cam/*fixKeyValue*/: false,
		cAM/*fixKeyMode*/: function(status) {
			var me = this;
			me.cam/*fixKeyValue*/ = status;
			me.g_key.setVisible(status);
			
			me.l1/*loadData*/();
		},
		layout: {
			type: "vbox",
			align: "stretch"
		},
		l1/*loadData*/: function() {
			var me = this,
				gfields = [],
				gkeys = [],
				i;
			
			if (me.table.fields)
			{
				for (i=0; i < me.table.fields.length; i++)
				{
					if (me.cam/*fixKeyValue*/ && (me.table.fields[i].iskey == true || me.table.fields[i].hasjoin == true))
					{
						gkeys.push(me.table.fields[i]);
					}
					else
					{
						gfields.push(me.table.fields[i]);
					}
				}
			}
			
			me.g_key.store.loadData(gkeys);
			me.g_fields.store.loadData(gfields);
			
			me.l3/*adjustHeight*/();
		},
		l2/*getHeight*/: function(fieldname) {
			var me = this,
				r = {
					d: 0,
					ranged: false
				}, i, hnode,
				ranged = false,
				grid, bf = false,
				m, gh;
			
			if (me.cam/*fixKeyValue*/)
			{
				grid = me.g_key;
				
				gh = grid.getHeight();
				
				for (i=0; i < grid.store.data.items.length; i++)
				{
					if (grid.store.data.items[i].get("name") == fieldname)
					{
						hnode = grid.getView().getNode(i);
						break;
					}
				}
				
				if (hnode)
				{
					bf = true;
					
					m = $(hnode).offset().top - $(grid.el.dom).offset().top + $(hnode).height() / 2;
					if (m > -1 && m < gh)
					{
						ranged = true;
					}
					else
					{
						m = (m < 0) ? 0 : m;
						m = Math.min(m, gh);
					}
				}
			}
			
			if (bf == false)
			{
				grid = me.g_fields;
				gh = grid.getHeight();
				
				for (i=0; i < grid.store.data.items.length; i++)
				{
					if (grid.store.data.items[i].get("name") == fieldname)
					{
						hnode = grid.getView().getNode(i);
						break;
					}
				}
				
				if (hnode)
				{
					m = $(hnode).offset().top - $(grid.el.dom).offset().top + $(hnode).height() / 2;
					if (m > -1 && m < gh)
					{
						ranged = true;
					}
					else
					{
						m = (m < 0) ? 0 : m;
						m = Math.min(m, gh);
					}
				}
			}
			
			if (m)
			{
				r.d = m;
			}
			r.ranged = ranged;
			
			return r;
		},
		l3/*adjustHeight*/: function() {
			var me = this,
				n, th = 22, mh,
				height = me.getHeight();
			
			if (me.cam/*fixKeyValue*/)
			{
				n = me.g_key.store.data.items.length;
				if (n == 0)
				{
					me.g_key.setVisible(false);
				}
				else
				{
					me.g_key.setVisible(true);
					mh = Math.min(th * n+2, height * 0.4);
					me.g_key.setHeight(mh);
				}
				
				me.cpa.s6/*validateLinks*/.call(me.cpa);
			}
		},
		
		_s1/*search_field*/: function() {
			var me = this;
			
			me.__s && clearTimeout(me.__s);
			
			me.__s = setTimeout(function() {
				me._s1a/*search_filter*/.call(me);
			}, 40);
		},
		
		_s1a/*search_filter*/: function() {
			var me = this,
				g_fields = me.down("[name=g_fields]"),
				gs = g_fields.store,
				skey = me.down("[name=skey]").getValue();
			
			if (skey)
			{
				skey = skey.toLowerCase();
				gs.clearFilter(true);
				gs.filterBy(function(record) {
					var r = true,
						gname = record.get("name").toLowerCase(),
						alias = record.get("alias") || "";
					
					alias = alias.toLowerCase();
					r = gname.indexOf(skey) > -1 || alias.indexOf(skey) > -1;
					
					return r;
				});
			}
			else
			{
				gs.clearFilter(false);
			}
		},
		
		items: [
			{
				xtype: "textfield",
				name: "skey",
				emptyText: "Search Items",
				enableKeyEvents: true,
				listeners: {
					keyup: function(tobj, e, eOpts) {
						tobj.ownerCt._s1/*search_field*/.call(tobj.ownerCt);
					}
				}
			},
			{
				xtype: "gridpanel",
				name: "g_key",
				border: 0,
				scroll: "vertical",
				autoScroll: true,
				enableDragDrop: true,
		    	enableDD: true,
		    	useArrows: true,
		    	header: false,
		    	hideHeaders: true,
		    	hidden: true,
		    	cpa: owner,
		    	ddGroup: "CubeModelFieldDDGroup",
		    	viewConfig: {
		    		emptyText: IRm$/*resources*/.r1("L_P_RELOAD"),
					plugins: {
						ptype: "gridviewdragdrop",
						ddGroup: "CubeModelFieldDDGroup"
					},
					listeners: {
						beforedrop: function(node, data, dropRec, dropPosition) {
							var ffield = data.records[0],
								tfield = dropRec;
							
							if (ffield && tfield)
							{
								owner.sobj.d4/*onDropField*/.call(owner.sobj, ffield, tfield);
							}
							
							return false;
						},
						
						drop: function(node, data, dropRec, dropPosition) {
							var dropOn = dropRec ? " " + dropPosition + " " + dropRec.get("name") : " on empty view";
						}
					}
				},
				store: {
					fields: [
						"name", "nodepath", "datasize", "datatype", "tablename", "type", "selected", "seq", "alias", "tableuid"
					]
				},
				afterScroll: function() {
					this.cpa.s6/*validateLinks*/.call(this.cpa);
				},
				columns: [
				    {
						xtype: "checkcolumn",
						dataIndex: "selected",
						enableColumnHide: false,
						checkedAll: false,
						width: 30,
						editor: {
							xtype: "checkbox",
							cls: "x-grid-checkheader-editor"
						},
						listeners: {
							checkchange: function(column, rowIndex, checked, eOpts) {
								var me = this,
									grid = tbbox.o3/*innergrid*/.g_fields,
									data = grid.store.data.items[rowIndex],
									nodepath = data.get("nodepath"),
									table = tbbox.table, i;
								
								for (i=0; i < table.fields.length; i++)
								{
									if (table.fields[i].nodepath == nodepath)
									{
										table.fields[i].selected = checked;
										break;
									}
								}
							},
							headerclick: function(ct, column, e, t, eOpts) {
								var i,
									grd = ct.ownerCt,
									table = tbbox.table;
								if (column.xtype == "checkcolumn")
								{
									column.checkedAll = ! column.checkedAll;
									for (i=0; i < grd.store.data.items.length; i++)
									{
										grd.store.data.items[i].set("selected", column.checkedAll);
									}
									
									for (i=0; i < table.fields.length; i++)
									{
										table.fields[i].selected = column.checkedAll;
									}
								}
							}
						}
				    },
				    { 
				    	header: "Name",  
				    	dataIndex: "name",
				    	sortable: true,
				        hideable: false,
				        flex: 1
				    },
				    {
				    	header: "Alias",
				    	dataIndex: "alias",
				    	sortable: true,
				    	hideable: false,
				    	hidden: true,
				    	flex: 1
				    }
				],
				listeners: {
					afterrender: function(ui) {
						var view = this.getView();
						view.on("bodyscroll", this.afterScroll, this);
					},
					scrollershow: function(scroller, orientation, eOpts ) {
						// scroller.on("bodyscroll", this.afterScroll, this);
					}
				}
			},
			{
				xtype: "gridpanel",
				name: "g_fields",
				border: 0,
				scroll: "vertical",
				autoScroll: true,
				enableDragDrop: true,
		    	enableDD: true,
		    	useArrows: true,
		    	header: false,
		    	hideHeaders: true,
		    	flex: 1,
		    	cpa: owner,
		    	ddGroup: "CubeModelFieldDDGroup",
		    	viewConfig: {
		    		emptyText: IRm$/*resources*/.r1("L_P_RELOAD"),
					plugins: {
						ptype: "gridviewdragdrop",
						ddGroup: "CubeModelFieldDDGroup"
					},
					listeners: {
						beforedrop: function(node, data, dropRec, dropPosition) {
							var ffield = data.records[0],
								tfield = dropRec;
							
							if (ffield && tfield)
							{
								owner.sobj.d4/*onDropField*/.call(owner.sobj, ffield, tfield);
							}
							
							return false;
						},
						
						drop: function(node, data, dropRec, dropPosition) {
							var dropOn = dropRec ? " " + dropPosition + " " + dropRec.get("name") : " on empty view";
						}
					}
				},
				
				store: {
					fields: [
						"name", "nodepath", "datasize", "datatype", "tablename", "type", "selected", "seq", "alias", "tableuid"
					]
				},
				afterScroll: function() {
					this.cpa.s6/*validateLinks*/.call(this.cpa);
				},
				columns: [
				    {
						xtype: "checkcolumn",
						dataIndex: "selected",
						enableColumnHide: false,
						checkedAll: false,
						width: 30,
						editor: {
							xtype: "checkbox",
							cls: "x-grid-checkheader-editor"
						},
						listeners: {
							checkchange: function(column, rowIndex, checked, eOpts) {
								var me = this,
									grid = tbbox.o3/*innergrid*/.g_fields,
									data = grid.store.data.items[rowIndex],
									nodepath = data.get("nodepath"),
									table = tbbox.table, i;
								
								for (i=0; i < table.fields.length; i++)
								{
									if (table.fields[i].nodepath == nodepath)
									{
										table.fields[i].selected = checked;
										break;
									}
								}
							},
							headerclick: function(ct, column, e, t, eOpts) {
								var i,
									grd = ct.ownerCt,
									table = tbbox.table;
								if (column.xtype == "checkcolumn")
								{
									column.checkedAll = ! column.checkedAll;
									for (i=0; i < grd.store.data.items.length; i++)
									{
										grd.store.data.items[i].set("selected", column.checkedAll);
									}
									
									for (i=0; i < table.fields.length; i++)
									{
										table.fields[i].selected = column.checkedAll;
									}
								}
							}
						}
				    },
				    { 
				    	header: "Name",  
				    	dataIndex: "name",
				    	sortable: true,
				        hideable: false,
				        flex: 1
				    },
				    {
				    	header: "Alias",
				    	dataIndex: "alias",
				    	sortable: true,
				    	hideable: false,
				    	hidden: true,
				    	flex: 1
				    }
				],
				listeners: {
					afterrender: function(ui) {
						var view = this.getView();
						view.on("bodyscroll", this.afterScroll, this);
					},
					scrollershow: function(scroller, orientation, eOpts ) {
						// scroller.on("bodyscroll", this.afterScroll, this);
					}
				}
			}
		],
		bbar: [
	        {
				xtype: "button",
				iconCls: "icon-tb-alias",
				tooltip: "Alias",
				handler: function() {
					var me = this.o3/*innergrid*/,
						grid1 = this.o3/*innergrid*/.g_key,
						grid = this.o3/*innergrid*/.g_fields,
						c = grid.columns,
						c1 = grid1.columns;
					
					if (me.viewmode == "physical")
					{
						me.viewmode = "logical";
					}
					else if (me.viewmode == "logical")
					{
						me.viewmode = "both";
					}
					else 
					{
						me.viewmode = "physical";
					}
					
					switch (me.viewmode)
					{
					case "physical":
						c[1].show();
						c[2].hide();
						c1[1].show();
						c1[2].hide();
						break;
					case "logical":
						c[1].hide();
						c[2].show();
						c1[1].hide();
						c1[2].show();
						break;
					default:
						c[1].show();
						c[2].show();
						c1[1].show();
						c1[2].show();
						break;
					}
				},
				scope: tbbox
	        },
	       	{
	    	   	xtype: "button",
				iconCls: "icon-tb-refresh",
				tooltip: "Refresh",
				handler: function() {
					var me = this,
						grid = me.o3/*innergrid*/.g_fields;
					me.main.l5/*loadTableContent*/.call(me.main, me.table);
				},
	       	   scope: tbbox
	       	},
	       	{
	       		xtype: "button",
	       		iconCls: "icon-tb-preview",
	       		tooltip: "Preview",
	       		handler: function() {
	       			this.main.l5m/*previewSQL*/.call(this.main, this.table);
	       		},
	       		scope: tbbox
	    	},
	    	{
	    		xtype: "displayfield",
	    		value: "",
	    		name: "m_disp"
	    	}
		],
		listeners: {
			afterrender: function(ui) {
				var me = this;
				me.cam/*fixKeyValue*/ = me.cpa.sobj.cAM/*fixKeyMode*/;
				me.g_key = me.down("[name=g_key]");
				me.g_fields = me.down("[name=g_fields]");
				me.m_disp = me.down("[name=m_disp]");
				
				me.l1/*loadData*/();
			},
			scrollershow: function(scroller, orientation, eOpts ) {
				// scroller.on("bodyscroll", this.afterScroll, this);
			},
			resize: function(tobj, width, height, owidth, oheight, eopts) {
				tobj.l3/*adjustHeight*/();
				pobj.s5/*validateSize*/.call(pobj);
			},
			move: function(tobj, x, y, eOpts) {
				if (x < 0 || y < 0)
				{
					this.setPosition(x < 0 ? 0 : x, y < 0 ? 0 : y);
				}
				pobj.s5/*validateSize*/.call(pobj);
			},
			close: function(panel, eOpts) {
				owner.s9/*removeTable*/.call(owner, tbbox);
			}
		}
	});
	
	// this.pobj.o5/*scrollpanel*/[0]
	// this.o3/*innergrid*/.show(this.pobj.o5/*scrollpanel*/[0]);
}

IG$/*mainapp*/.m93/*tablebox*/.prototype = {
	cAM/*fixKeyMode*/: function(status) {
		if (this.table.cAM/*fixKeyMode*/ == status)
			return;
			
		this.table.cAM/*fixKeyMode*/ = status;
		
		this.o3/*innergrid*/.cAM/*fixKeyMode*/.call(this.o3/*innergrid*/, status);
	},
	
	cp/*collapsePanel*/: function(status) {
		var me = this,
			owner = me.pobj,
			bom, bel,
			h;
			
		if (me.table.cpM/*collapseMode*/ == status)
			return;
			
		me.table.cpM/*collapseMode*/ = status;
		me.o3/*innergrid*/.cpM/*collapseMode*/ = status;
		
		if (status == true)
		{
			bom = $(me.o3/*innergrid*/.body.dom);
			bem = $(me.o3/*innergrid*/.el.dom);
			h = Math.abs(bem.height() - bom.height() + 5);
			h = Math.max(h, 40);
			me.table.theight = me.o3/*innergrid*/.getHeight();
			// me.o3/*innergrid*/.setVisible(false);
			me.o3/*innergrid*/.setHeight(h);
			// me.o1/*outerbox*/.resizable("destroy");
			// mobj.addClass("idv-cm-tb-exp");
		}
		else
		{
			me.o3/*innergrid*/.setHeight(me.table.theight);
			
			var w = me.table.twidth, // tbbox.o4/*innerbox*/.width(),
				h = me.table.theight; // tbbox.o4/*innerbox*/.height();
					
			// tbbox.o3/*innergrid*/.setVisible(true);
			// tbbox.o3/*innergrid*/.setSize(w, h);
			
			// tbbox.table.width = w;
			// tbbox.table.height = h;

			me.o3/*innergrid*/.setWidth(w);
			me.o3/*innergrid*/.setHeight(h);
			
//			me.o1/*outerbox*/.resizable({
//				start: function(event, ui) {
//					tbbox.o3/*innergrid*/.setVisible(false);
//				},
//				stop: function(event, ui) {
//					owner.s5/*validateSize*/.call(owner);
//					owner.s6/*validateLinks*/.call(owner);
//					var w = tbbox.o4/*innerbox*/.width(),
//						h = tbbox.o4/*innerbox*/.height();
//					
//					tbbox.o3/*innergrid*/.setVisible(true);
//					tbbox.o3/*innergrid*/.setSize(w, h);
//					tbbox.table.width = w;
//					tbbox.table.height = h;
//				}
//			});
			// mobj.removeClass("idv-cm-tb-exp");
		}
		
		owner.s5/*validateSize*/.call(owner);
		owner.s6/*validateLinks*/.call(owner);
	}
};

IG$/*mainapp*/.m94/*linkfield*/ = function(pobj, fromobj, toobj, link, relations) {
	var me = this;
	
	me.pobj = pobj;
	me.o10/*fromobj*/ = fromobj;
	me.o11/*toobj*/ = toobj;
	me.links = [link];
	me.relations = relations;
	
	me.o8/*fromDirection*/ = "";
	me.o9/*toDirection*/ = "";
	
	me.lm/*lineMode*/ = pobj.lm/*lineMode*/;
}

IG$/*mainapp*/.m94/*linkfield*/.prototype = {
	validateDirection: function() {
		var fo = $(this.o10/*fromobj*/.box.o3/*innergrid*/.body.dom), //this.o10/*fromobj*/.box.o1/*outerbox*/,
			f = fo.offset(),
			to = $(this.o11/*toobj*/.box.o3/*innergrid*/.body.dom), // this.o11/*toobj*/.box.o1/*outerbox*/,
			t = to.offset(),
			fow = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(fo),
			tow = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(to);
		
		if (f.left + fow < t.left)
		{
			this.o8/*fromDirection*/ = "right";
			this.o9/*toDirection*/ = "left";
		}
		else
		{
			if (t.left + tow < f.left)
			{
				this.o8/*fromDirection*/ = "left";
				this.o9/*toDirection*/ = "right";
			}
			else
			{
				if (f.left > t.left)
				{
					this.o8/*fromDirection*/ = "right";  // "left"
					this.o9/*toDirection*/ = "right";
				}
				else
				{
					this.o8/*fromDirection*/ = "right";
					this.o9/*toDirection*/ = "right";
				}
			}
		}
	},
	l2/*showLinkEditor*/: function(link, links) {
		var dlg = new IG$/*mainapp*/.m$93/*linkeditor*/({
			pobj: this.pobj,
			link: link,
			links: links,
			relations: this.relations,
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs_l2/*showLinkEditor*/)
		});
		
		dlg.show(null); // this.pobj.sobj);
	},
	rs_l2/*showLinkEditor*/: function(params) {
		var me = this,
			links = params[0],
			mode = params[1],
			i;
		switch (mode)
		{
		case "remove":
			this.pobj.sobj.d1m/*updateJoinFields*/.call(this.pobj.sobj);
			this.pobj.sobj.s6/*validateLinks*/.call(this.pobj.sobj);
			this.pobj.s6/*validateLinks*/.call(this.pobj);
			break;
		case "confirm":
			for (i=0; i < me.links.length; i++)
			{
				if (me.links[i] != links[0])
				{
					me.links[i].join = links[0].join;
				}
			}
			this.pobj.s6/*validateLinks*/.call(this.pobj);
			break;
		}
	},
	
	refresh: function(_i, groupview) {
		var i,
			owner = this,
			thickness = 1,
			p1, p2, p3, p4,
			fromobj = owner.o10/*fromobj*/,
			toobj = owner.o11/*toobj*/,
			links = owner.links,
			cgap = 10, lp1, lp2, _cp,
			lgap = 5,
			cdist = 10, // + _i * 3,
			g = owner.pobj.rcanvas,
			ltype = {stroke: "#8d8d8d", "stroke-width": 1, fill: "none", opacity: 1},
			btype = {stroke: "#8d8d8d", fill: "#8d8d8d", opacity: 1},
			_index = 0,
			pvalue, link,
			ranged, nlinks = [],
			lm/*lineMode*/ = "0", // owner.lm/*lineMode*/,
			_ca,
			_cpx;
			
		if (owner.links && owner.links.length > 1 && groupview == true)
		{
			thickness = owner.links.length * 1.5;
		}
		
		owner.validateDirection();
		
		nlinks = (groupview == true && links.length > 0) ? [links[0]] : links;
		
		$.each(nlinks, function(i, link) {
			var pt;
			
			if (!link)
				return;
			
			var fromdirection = owner.o8/*fromDirection*/,
				todirection = owner.o9/*toDirection*/;
			
			link.p1dist = (typeof(link.p1dist) == "undefined") ? null : link.p1dist;
			// cdist += i * 2;
			
			if (link.source.tablename == toobj.name && link.target.tablename == fromobj.name && link.source.seq == toobj.seq && link.target.seq == fromobj.seq)
			{
				fromobj = owner.o11/*toobj*/;
				toobj = owner.o10/*fromobj*/;
				if (fromdirection != todirection)
				{
					if (fromdirection == "right")
						fromdirection = "left";
					else
						fromdirection = "right";
					if (todirection == "right")
						todirection = "left";
					else
						todirection = "right";
				}
			}
			else
			{
				fromobj = owner.o10/*fromobj*/;
				toobj = owner.o11/*toobj*/;
			}
			
			pvalue = (links.length == 1 || groupview == false) ? links[i].source.name : null;
			p1 = {x: fromobj.s1/*stageX*/(), y: fromobj.s2/*stageY*/(pvalue)};
			pvalue = (links.length == 1 || groupview == false) ? links[i].target.name : null;
			p4 = {x: toobj.s1/*stageX*/(), y: toobj.s2/*stageY*/(pvalue)};
			
			if (fromobj.ranged == true && toobj.ranged == true)
			{
				ranged = true;
				ltype.stroke = "#000000";
				ltype["stroke-width"] = thickness;
				btype.stroke = "#000000";
				btype.fill = "#000000";
			}
			else if (thickness > 1)
			{
				ranged = false;
				ltype.stroke = "#000000";
				ltype["stroke-width"] = thickness;
				btype.stroke = "#000000";
				btype.fill = "#000000";
			}
			else
			{
				ranged = false;
			}
			
			if (fromdirection == "right")
			{
				p1.x += fromobj.s3/*bodyWidth*/();
				p2 = {x: p1.x + cdist, y: p1.y};
			}
			else if (fromdirection == "left")
			{
				p2 = {x: p1.x - cdist, y: p1.y};
			}
			
			if (todirection == "right")
			{
				p4.x += toobj.s3/*bodyWidth*/();
				p3 = {x: p4.x + cdist, y: p4.y};
			}
			else if (todirection == "left")
			{
				p3 = {x: p4.x - cdist, y: p4.y};
			}
			
			if (lm/*lineMode*/ == "2")
			{
				if (fromdirection == todirection && todirection == "right")
				{
					p2 = {x: Math.max(p1.x, p4.x) + cdist, y: p1.y};
					p3 = {x: Math.max(p1.x, p4.x) + cdist, y: p4.y};
					
					if (link.p1dist != null)
					{
						pt = p1.x + link.p1dist;
						if (pt < Math.max(p1.x, p4.x) + cdist)
						{
							link.p1dist = null;
						}
					}
				}
				else if (fromdirection == todirection && todirection == "left")
				{
					p2 = {x: Math.min(p1.x, p4.x) - cdist, y: p1.y};
					p3 = {x: Math.min(p1.x, p4.x) - cdist, y: p4.y};
					
					if (link.p1dist != null)
					{
						pt = p1.x + link.p1dist;
						if (pt > Math.min(p1.x, p4.x) - cdist)
						{
							link.p1dist = null;
						}
					}
				}
				else
				{
					_cpx = (p1.x + p4.x) / 2;
					p2 = {x: _cpx, y: p1.y};
					p3 = {x: _cpx, y: p4.y};
					
					if (link.p1dist != null)
					{
						pt = p1.x + link.p1dist;
						
						if (fromdirection == "right")
						{
							if (pt < p1.x + cdist || pt > p4.x - cdist)
							{
								link.p1dist = null;
							}
						}
						else
						{
							if (pt > p1.x - cdist || pt < p4.x + cdist)
							{
								link.p1dist = null;
							}
						}
					}
				}
				
				if (link.p1dist != null)
				{
					p2.x = p1.x + link.p1dist;
					p3.x = p2.x;
				}
			}
			
			_cp = IG$/*mainapp*/._I44/*lineInterpolate*/(p2, p3, 3);
			_cp = _cp.length > 0 ? _cp[1] : null;
			
			if (links && links.length > 0 && links[0].join == "right outer")
			{
				if (todirection == "right")
				{
					g.path("M" + p4.x + " " + (p4.y + cgap) + 
						   "L" + (p4.x + cgap) + " " + p4.y + 
						   "L" + p4.x + " " + (p4.y - cgap)).attr(ltype);
				}
				else
				{
					g.path("M" + p4.x + " " + (p4.y + cgap) + 
						   "L" + (p4.x - cgap) + " " + p4.y + 
						   "L" + p4.x + " " + (p4.y - cgap)).attr(ltype);
				}
			}
			else if (links && links.length > 0 && links[0].join == "left outer")
			{
				// n:1
				if (fromdirection == "right")
				{
					g.path("M" + p1.x + " " + (p1.y + cgap) + 
						   "L" + (p1.x + cgap) + " " + p1.y + 
						   "L" + p1.x + " " + (p1.y - cgap)).attr(ltype);
				}
				else
				{
					g.path("M" + (p1.x) + " " + (p1.y + cgap) + 
						   "L" + (p1.x-cgap) + " " + p1.y + 
						   "L" + (p1.x) + " " + (p1.y - cgap)).attr(ltype);
				}
			}
			
			g.path("M" + p1.x + " " + p1.y + 
				   "L" + p2.x + " " + p2.y + 
				   "L" + p3.x + " " + p3.y +
				   "L" + p4.x + " " + p4.y).attr(ltype);
			
			var bobj = (links.length == 1 || groupview == true) ? links : [links[i]];
			var c = $("<div class='igc-cm-join'><span></span></div>").appendTo(owner.pobj.o7/*scrollbar*/),
				ldesc = "",
				cspan = $("span", c),
				gap;
			
			if (groupview == true)
			{
				for (i=0; i < links.length; i++)
				{
					if (i > 0)
					{
						ldesc += "\n";
					}
					ldesc += links[i].source.name;
					if (links[i].source.name != links[i].target.name)
					{
						ldesc += " - " + links[i].target.name;
					}
				}
			}
			else
			{
				ldesc = link.source.name + " - " + link.target.name;
			}
			
			cspan.html(ldesc);
			c.attr("title", ldesc);
			
			gap = Math.min(cspan.width() / 2 || 30, 20)
				
			c.css({left: _cp.x - gap, top: _cp.y});
			c.bind("click", function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				owner.l2/*showLinkEditor*/.call(owner, bobj, links);
			});
			
			
			
			owner.pobj._ca.push(c);
//			var c = g.circle(_cp.x, _cp.y, 4).attr(btype).data("owner", owner).data("link", bobj).click(
//				function() {
//					owner.l2/*showLinkEditor*/.call(owner, bobj, links);
//				}
//			);
			
			if (lm/*lineMode*/ == "2")
			{
				var lx = 0,
					ly = 0,
					ox = 0,
					oy = 0,
					cx = 0,
					sx = _cp.x,
					sy = _cp.y;
					
				var mv = function(dx, dy) {
					var me = this;
					lx = dx + ox;
					cx = _cp.x + lx;
					ly = 0;
					
					if (fromdirection == todirection && fromdirection == "right")
					{
						if (cx < Math.max(p1.x, p4.x) + cgap)
						{
							lx = Math.max(p1.x, p4.x) + cgap - _cp.x;
							return;
						}
						else if (cx > Math.max(p1.x, p4.x) + 500)
						{
							lx = Math.max(p1.x, p4.x) + 500 - _cp.x;
							return;
						}
					}
					else
					{
						if (fromdirection == "right")
						{
							if (cx < p1.x + cgap)
							{
								lx = p1.x + cgap - _cp.x;
								return;
							}
						}
						else
						{
							if (cx > p1.x - cgap)
							{
								lx = p1.x - cgap - _cp.x;
								return;
							}
						}
						
						if (todirection == "left")
						{
							if (cx > p4.x - cgap)
							{
								lx = p4.x - cgap - _cp.x;
								return;
							}
						}
						else
						{
							if (cx < p4.x + cgap)
							{
								lx = p4.x + cgap - _cp.x;
								return;
							}
						}
					}
					
					me.transform('t' + lx + ',' + ly);
				};
				
				var st = function(e) {
				};
				
				var ed = function(e) {
					// e.stopPropagation();
					ox = lx;
					oy = ly;
					if (Math.abs(lx) < 2 && Math.abs(ly) < 2)
					{
						owner.l2/*showLinkEditor*/.call(owner, bobj, links);
					}
					else
					{
						link.p1dist = _cp.x + lx - p1.x;
						owner.pobj.s6/*validateLinks*/.call(owner.pobj);
					}
				};
				
				c.drag(mv, st, ed);
			}
		});
	}
};

IG$/*mainapp*/.m$93f/*linkfieldeditor*/ = $s.extend($s.window, {
	title: "Join (Relation) Custom Field",
	modal: true,
	region:'center',
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 420,

	l1/*initApp*/: function() {
		var me = this,
			target = me._t1/*target*/;

		if (target)
		{
			me.down("[name=t_disp]").setValue(target.name);
			me.down("[name=t_value]").setValue(target.formula);
		}
	},

	l99/*closeWindow*/: function() {
		var me = this,
			target = me._t1/*target*/;

		if (target)
		{
			target.formula = me.down("[name=t_value]").getValue();
		}

		me.callback && me.callback.execute();
		me.close();
	},

	initComponent : function() {
		var me = this;

		$s.apply(this, {
			defaults:{
				bodyStyle:'padding:10px'
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
							xtype: "displayfield",
							name: "t_disp"
						},
						{
							xtype: "textarea",
							name: "t_value",
							height: 120
						},
						{
							xtype: "displayfield",
							value: "Field in formula, Use {FIELD}. Ex: SUBSTR({FIELD}, 1, 6)"
						}
					]
				}
			],

			buttons:[
			    {
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.l99/*closeWindow*/();
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
					this.l1/*initApp*/();
				}
			}
		});
		
		IG$/*mainapp*/.m$93f/*linkfieldeditor*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/.m$93/*linkeditor*/ = $s.extend($s.window, {
	title: "Join (Relation) Editor",
	modal: true,
	region:'center',
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 420,
	autoHeight: true,
	
	callback: null,
	l98/*curLink*/: null,
	
	l1/*initApp*/: function() {
		this.l98/*curLink*/ = null;
		
		if (this.link && this.link.length > 0)
		{
			var selR = this.down("[name=selR]"),
				btn_upd = this.down("[name=btn_upd]"), 
				dp = [], i, svalue,
				l;
				
			if (this.link.length > 1)
			{
				selR.setVisible(true);
				btn_upd.setVisible(true);
				for (i=0; i < this.link.length; i++)
				{
					l = this.link[i];
					dp.push({
						name: l.source.tablename + "." + l.source.name + " - " + l.target.tablename + "." + l.target.name,
						__i: i
					});
				}
				
				selR.store.loadData(dp);
				selR.setValue(0);
			}
			
			this.l1a/*setFieldValue*/(this.link[0]);
		}
	},
	
	l1a/*setFieldValue*/: function(link) {
		var me = this,
			sfield = me.down("[name=sfield]"),
			tfield = me.down("[name=tfield]"),
			oprel = me.down("[name=oprel]"),
			opcon = me.down("[name=opcon]");
		
		if (link)
		{
			me.l98/*curLink*/ = link;
			
			sfield.setValue(me.ma/*getDispName*/(link.source));
			tfield.setValue(me.ma/*getDispName*/(link.target));
			// tfield.setValue(link.target.tablename + "." + link.target.name);
			
			oprel.setValue(link.join);
			opcon.setValue(link.operator);
		}
	},

	ma/*getDispName*/: function(m) {
		var r = "";
		if (m.formula)
		{
			r = m.formula;
			r = r.replace("{FIELD}", m.name);
		}
		else
		{
			r = m.tablename + "." + m.name
		}

		return r;
	},
	
	l97a/*removeLink*/: function() {
		var i, j, bfound = false, mfound,
			selR = this.down("[name=selR]");
		
		if (this.link.length > 1)
		{
			for (i=0; i < this.relations.length; i++)
			{
				if (this.relations[i] == this.l98/*curLink*/)
				{
					this.relations.splice(i, 1);
					break;
				}
			}
			
			for (i=0; i < this.link.length; i++)
			{
				if (this.link[i] == this.l98/*curLink*/)
				{
					this.link.splice(i, 1);
					bfound = true;
					break;
				}
			}
			
			for (i=0; i < this.pobj.links.length; i++)
			{
				mfound = false;
				for (j=0; j < this.pobj.links[i].links.length; j++)
				{
					if (this.pobj.links[i].links[j] == this.l98/*curLink*/)
					{
						// this.pobj.links.splice(i, 1);
						this.pobj.links[i].links.splice(j, 1);
						mfound = true;
						break;
					}
				}
				
				if (mfound == true)
				{
					if (this.pobj.links[i].length == 0)
					{
						this.pobj.links.splice(i, 1);
					}
					break;
				}
			}
			
			if (bfound == true)
			{
				var t = selR.getValue();
				for (i=0; i < selR.store.data.items.length; i++)
				{
					if (selR.store.data.items[i].get("__i") == t)
					{
						selR.store.removeAt(i);
						break;
					}
				}
				
				if (selR.store.data.items.length == 1)
				{
					selR.hide();
				}
				
				if (selR.store.data.items.length > 0)
				{
					selR.setValue(selR.store.data.items[0].get("__i"));
				}
			}
			
			for (i=0; i < selR.store.data.items.length; i++)
			{
				selR.store.data.items[i].set("__i", i);
			}
			
			this.callback && this.callback.execute([this.link, "remove"]);
		}
		else
		{
			for (i=0; i < this.relations.length; i++)
			{
				if (this.relations[i] == this.l98/*curLink*/)
				{
					this.relations.splice(i, 1);
					break;
				}
			}
			
			for (i=0; i < this.pobj.links.length; i++)
			{
				bfound = false;
				for (j=0; j < this.pobj.links[i].links.length; j++)
				{
					if (this.pobj.links[i].links[j] == this.l98/*curLink*/)
					{
						// this.pobj.links.splice(i, 1);
						this.pobj.links[i].links.splice(j, 1);
						bfound = true;
						break;
					}
				}
				
				if (bfound == true)
				{
					if (this.pobj.links[i].length == 0)
					{
						this.pobj.links.splice(i, 1);
					}
					break;
				}
			}
			
			this.callback && this.callback.execute([this.link, "remove"]);
			
			this.close();
		}
	},
	
	l97/*confirmChanges*/: function() {
		var oprel = this.down("[name=oprel]"),
			opcon = this.down("[name=opcon]");
		
		if (this.l98/*curLink*/)
		{
			this.l98/*curLink*/.join = oprel.getValue();
			this.l98/*curLink*/.operator = opcon.getValue();
		}
	},
	
	l99/*closeWindow*/: function() {
		this.l97/*confirmChanges*/();
		
		this.callback && this.callback.execute([this.link, "confirm"]);

		this.close();
	},

	_m1/*editField*/: function(issource) {
		var me = this,
			l = me.l98/*curLink*/,
			ffield = me.down("[name=" + (issource ? "s" : "t") + "field]"),
			field = issource ? l.source : l.target,
			dlg;

		if (field)
		{
			dlg = new IG$/*mainapp*/.m$93f/*linkfieldeditor*/({
				_t1/*target*/: field,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
					ffield.setValue(this.ma/*getDispName*/(field));
				})
			});

			IG$/*mainapp*/._I_5/*checkLogin*/(me, dlg);
		}
	},
	
	initComponent : function() {
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
			    {
			    	xtype: "form",
			    	layout: {
			    		type: "vbox",
			    		align: "stretch"
			    	},
			    	items: [
			    	    {
			    	    	xtype: "combobox",
			    	    	fieldLabel: "Relation",
			    	    	name: "selR",
			    	    	hidden: true,
			    	    	queryMode: "local",
	            	    	autoSelect: true,
	            	    	autoScroll: true,
	            	    	editable: false,
	            	    	labelField: "name",
	            	    	displayField: "name",
	            	    	valueField: "__i",
	            	    	store: {
	            	    		fields: [
	            	    			"name", "__i"
	            	    		]
	            	    	},
	            	    	listeners: {
	            	    		change: function(field, newValue, oldValue, eOpts) {
	            	    			var p = field.getValue();
	            	    			this.l1a/*setFieldValue*/(this.link[p]);
	            	    		},
	            	    		scope: this
	            	    	}
			    	    },
			    	    {
			    	    	xtype: "fieldcontainer",
			    	    	layout: {
			    	    		type: "hbox",
			    	    		align: "stretch"
			    	    	},
			    	    	name: "sfield_cnt",
			    	    	items: [
			    	    		{
					    	    	xtype: "textfield",
					    	    	name: "sfield",
					    	    	fieldLabel: "Source field",
					    	    	readOnly: true,
					    	    	flex: 1
					    	    },
					    	    {
					    	    	xtype: "button",
					    	    	text: "..",
					    	    	handler: function() {
					    	    		this._m1/*editField*/(true);
					    	    	},
					    	    	scope: this
					    	    }
					    	]
					    },
			    	    {
			    	    	xtype: "fieldcontainer",
			    	    	layout: {
			    	    		type: "hbox",
			    	    		align: "stretch"
			    	    	},
			    	    	name: "tfield_cnt",
			    	    	items: [
			    	    		{
					    	    	xtype: "textfield",
					    	    	name: "tfield",
					    	    	fieldLabel: "Target field",
					    	    	readOnly: true,
					    	    	flex: 1
					    	    },
					    	    {
					    	    	xtype: "button",
					    	    	text: "..",
					    	    	handler: function() {
					    	    		this._m1/*editField*/(false);
					    	    	},
					    	    	scope: this
					    	    }
			    	    	]
			    	    },
			    	    {
			    	    	xtype: "fieldset",
			    	    	layout: {
			    	    		type: "vbox",
			    	    		align: "stretch"
			    	    	},
			    	    	defaults: {
			    	    		labelWidth: 150
			    	    	},
			    	    	title: "Options",
			    	    	items: [
								{
									xtype: "combobox",
									name: "oprel",
									fieldLabel: "Source to Target data is",
									queryMode: 'local',
									autoSelect: true,
									editable: false,
									valueField: "op",
									displayField: "name",
									labelField: "name",
									$w: 390,
									store: {
										fields: [
										    "name", "op", "desc"
										],
										data: [
										    {name: "Inner equal", op: "inner", desc: "Show only match values"},
										    {name: "Left outer", op: "left outer", desc: "Show all source values even not match"},
										    {name: "Right outer", op: "right outer", desc: "Show all target values even not match"},
										    {name: "Auto natural", op: "natural", desc: "Automatic join with column foreign key"},
										    {name: "Full outer", op: "full outer", desc: "Show all source and target values"}
										]
									},
									listeners: {
										change: function(cobj) {
											var rec,
												i,
												r,
												cval = cobj.getValue(),
												op_desc = this.down("[name=op_desc]");
												
											for (i=0; i < cobj.store.data.items.length; i++)
											{
												r = cobj.store.data.items[i];
												
												if (r.get("op") == cval)
												{
													rec = r;
													break;
												}
											}
											
											if (rec)
											{
												op_desc.setValue("* " + rec.get("desc"));
											}
										},
										scope: this
									}
								},
								{
									xtype: "displayfield",
									name: "op_desc"
								},
								{
									xtype: "combobox",
									name: "opcon",
									fieldLabel: "With Condition",
									queryMode: 'local',
									autoSelect: true,
									editable: false,
									valueField: "op",
									displayField: "name",
									labelField: "name",
									hidden: false,
									store: {
										fields: [
										    "name", "op"
										],
										data: [
										    {name: "=", op: "="},
										    {name: ">", op: ">"},
										    {name: "<", op: "<"},
										    {name: ">=", op: ">="},
										    {name: "<=", op: "<="}
										]
									}
								}
			    	    	]
			    	    },
			    	    {
			    	    	xtype: "container",
			    	    	"layout": {
			    	    		type: "hbox",
			    	    		align: "right"
			    	    	},
			    	    	items: [
			    	    	    {
			    	    	    	xtype: "button",
			    	    	    	name: "btn_upd",
			    	    	    	text: "Confirm current",
			    	    	    	hidden: true,
			    	    	    	handler: function() {
			    	    	    		this.l97/*confirmChanges*/();
			    	    	    	},
			    	    	    	scope: this
			    	    	    },
			    	    	    {
			    	    	    	xtype: "button",
			    	    	    	text: "Remove Relation",
			    	    	    	handler: function() {
			    	    	    		this.l97a/*removeLink*/();
			    	    	    	},
			    	    	    	scope: this
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
						this.l99/*closeWindow*/();
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
					this.l1/*initApp*/();
				}
			}
		});
		
		IG$/*mainapp*/.m$93/*linkeditor*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._IC7/*CubeModel*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	collapseFirst:false,
    bodyBorder: false,
    "layout": "border",
	defaults: {
		collapsible: false,
		split: false,
		animFloat: false,
		autoHide: false,
		useSplitTips: true
	},
	initialized: false,
	closable: true,
	m: null,
	overflowX: "hidden",
	overflowY: "hidden",
	
	cpM/*collapseMode*/: false,
	
	_IFd/*init_f*/: function() {
		var me = this,
			container = me.down("[name=mcontainer]");
		me.m = new IG$/*mainapp*/.m92/*cubemodelviewer*/($(container.body.dom), me);
	 	me.m.init();
	 	
	 	if (me.uid)
	 	{
	 		me.l1/*loadContent*/();
	 		
	 		if (me.writable)
			{
				IG$/*mainapp*/._I56/*checkLock*/(me, function(cmd) {
					if (cmd != "unlock")
					{
						me.writable = false;
						me.down("[name=t_save]").hide();
					}
				});
			}
	 	}
	 	else if (me._c$)
	 	{
	 		me.rs_l1/*loadContent*/(me._c$);
	 	}
	 	else
	 	{
	 		me.c1/*cubemodel*/ = new IG$/*mainapp*/.mm$99/*cubemodelst*/(null);
			me.l2/*loadPool*/();
	 	}
	},
	
	l1/*loadContent*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		panel.setLoading(true);
		
		req.init(panel, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: panel.uid}, "address"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "diagnostics"})
	        }, panel, panel.rs_l1/*loadContent*/, null);
		req._l/*request*/();
	},
	
	rs_l1/*loadContent*/: function(xdoc) {
		var me = this;
		me.c1/*cubemodel*/ = new IG$/*mainapp*/.mm$99/*cubemodelst*/(xdoc);
		me.l2/*loadPool*/();
	},
	
	l2/*loadPool*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			address = "",
			i;
		
		if (panel.c1/*cubemodel*/.pooluids.length == 0)
		{
			panel._t$/*toolbarHandler*/("cmd_add_schema");
			return;
		}
		
		address = "<smsg>";
		for (i=0; i < panel.c1/*cubemodel*/.pooluids.length; i++)
		{
			address += "<item" + IG$/*mainapp*/._I30/*getXMLAttr*/({address: panel.c1/*cubemodel*/.pooluids[i], option: "StoredContent"}) + "/>";
		}
		address += "</smsg>";
		
		panel.setLoading(true);
		
		req.init(panel, 
			{
	            ack: "25",
	            payload: address,
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
	        }, panel, panel.rs_l2/*loadPool*/, null);
		req._l/*request*/();
	},
	
	rs_l2/*loadPool*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			snodes,
			sc_lst = me.down("[name=sc_lst]"),
			// mgrid_schema = me.down("[name=mgrid_schema]"),
			i, 
			dp = [
				{name: "SELECT", value: ""}
			];
		
		if (tnode)
		{
			me.l2aT/*updatePoolInfo*/(tnode, dp);
			sc_lst.store.loadData(dp);
			sc_lst.setValue(dp.length > 1 ? dp[1].value : "");
		}
		
		me.down("[name=b_rs]").setVisible(dp.length > 2);
		me.d1/*validateTables*/(1);
		me.d2/*validateJoins*/();
	},
	
	l2aT/*updatePoolInfo*/: function(tnode, tarr) {
		var snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			i, j,
			item,
			mnodes,
			db;
		for (i=0; i < snodes.length; i++)
		{
			db = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
			db.dispname = db.name;
			if (db.dispname.length > 17 && db.dispname.charAt(17) == "_")
			{
				db.dispname = db.dispname.substring(18);
			}
			
			// tarr.push(item);
			
			if (snodes[i].hasChildNodes())
			{
				// item.expanded = true;
				// item.children = [];
				mnodes = IG$/*mainapp*/._I26/*getChildNodes*/(snodes[i]);
				
				for (j=0; j < mnodes.length; j++)
				{
				 	item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(mnodes[j]);
				 	tarr.push({
				 		value: item.uid,
				 		name: db.dispname + "-" + item.name
				 	});
				}
			}
			else
			{
				tarr.push({
			 		value: "",
			 		name: db.dispname + "-ERROR(No Schema)"
			 	});
			}
		}
	},
	
	l4/*loadDatabaseTable*/: function(node, option) {
		var panel = this,
			// nodepath = node.get("nodepath"),
			sc_lst = panel.down("[name=sc_lst]"),
			f_kwd = panel.down("[name=f_kwd]"),
			nodepath = sc_lst.getValue(),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		if (nodepath)
		{
			panel.setLoading(true);
			
			req.init(panel, 
				{
		            ack: "25",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: nodepath, option: option, search: f_kwd.getValue()}, "uid;option;search"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
		        }, panel, panel.rs_l4/*loadDatabaseTable*/, false, [node, option]);
			req._l/*request*/();
		}
	},
	
	rs_l4/*loadDatabaseTable*/: function(xdoc, param) {
		var me = this,
			node = param[0],
			option = param[1],
			mgrid_schema = me.down("[name=mgrid_schema]"),
            c1/*cubemodel*/ = me.c1/*cubemodel*/,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			snodes, i, tb, tables = [],
            tbnames = {};
	
		me.setLoading(false);
		
		if (tnode)
		{
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
            
            for (i=0; i < c1/*cubemodel*/.tables.length; i++)
            {
                tbnames[c1/*cubemodel*/.tables[i].uid] = 1;
            }
			
			for (i=0; i < snodes.length; i++)
			{
				tb = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
				if (!option)
				{
					tb.checked = false;
				}
                
                if (tbnames[tb.uid])
                {
                    tb.used = "*";
                }
				tb.leaf = true;
				tb.allowDrag = true;
				tb.dispname = tb.name;
				tables.push(tb);
			}
			
			// tables.length > 0 && node.appendChild(tables);
		}
		
		mgrid_schema.store.loadData(tables);
	},
    
    l5a/*updateUsedTable*/: function() {
        var me = this,
            mgrid_schema = me.down("[name=mgrid_schema]"),
            i, store = mgrid_schema.store,
            c1/*cubemodel*/ = me.c1/*cubemodel*/,
            tbnames = {};
            
        if (store.data.items.length)
        {
            for (i=0; i < c1/*cubemodel*/.tables.length; i++)
            {
                tbnames[c1/*cubemodel*/.tables[i].uid] = 1;
            }
            
            for (i=0; i < store.data.items.length; i++)
            {
                store.data.items[i].set("used", tbnames[store.data.items[i].get("uid")] ? "*" : "");
            }
        }
    },
	
	l5/*loadTableContent*/: function(table, b_onload, b_last) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		panel.setLoading(true);
		
		req.init(panel, 
			{
	            ack: "25",
	        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: table.uid, nodepath: table.nodepath, name: table.name, option: "StoredContent"}, "uid;name;nodepath;option"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
	        }, panel, function(xdoc, tb) {
				var m = this,
					tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"), tnodes,
					fields = [], field,
					i;
				
				if (tnode)
				{
					tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode, "Field");
					
					for (i=0; i < tnodes.length; i++)
					{
						field = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						field.tablename = tb.name || field.tablename;
						field.alias = field.alias || field.name;
						field.iskey = field.iskey == "T";
						field.leaf = true;
						field.dispname = field.name;
						field.allowDrag = true;
						field.seq = tb.seq;
						field.tableuid = tb.uid;
						fields.push(field);
					}
				}
				
				tb.fields = fields;
				
				if (!b_onload || (b_onload && b_last))
				{
					m.d1/*validateTables*/();
					m.d2/*validateJoins*/();
				}
			}, null, table);
		req._l/*request*/();
	},
	
	l5m/*previewSQL*/: function(table) {
		var dlg = new IG$/*mainapp*/.DM2a/*loadPrview*/({
			table: table
		});
		
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	},
	
	d1m/*updateJoinFields*/: function() {
		var me = this,
			cubemodel = me.c1/*cubemodel*/,
			i, o, t, n, nsname, ntname, nfield;
		
		for (i=0; i < cubemodel.tables.length; i++)
		{
			t = cubemodel.tables[i]; // cubemodel.tables[i];
			tname = t.name + "_" + t.seq;
			
			for (o=0; o < t.fields.length; o++)
			{
				t.fields[o].hasjoin = false;
			}
			
			for (n=0; n < cubemodel.relations.length; n++)
			{
				r = cubemodel.relations[n];
				nsname = r.source.tablename + "_" + r.source.seq;
				ntname = r.target.tablename + "_" + r.target.seq;
				nfield = (nsname == tname) ? r.source.name : ((ntname == tname) ? r.target.name : null);
				if (nfield)
				{
					for (o=0; o < t.fields.length; o++)
					{
						if (t.fields[o].name == nfield)
						{
							t.fields[o].hasjoin = true;
							break;
						}
					}
				}
			}
			
			if (t.box && t.cAM/*fixKeyMode*/)
			{
				t.box.o3/*innergrid*/.l1/*loadData*/.call(t.box.o3/*innergrid*/);
			}
		}
	},
	
	/* drawing functions */
	d1/*validateTables*/: function(b_onload) {
		var me = this,
			i,
			cubemodel = me.c1/*cubemodel*/,
			t, mbox,
			m = me.m, px, py, pw, ph, pth, cpM/*collapseMode*/;
		
		me.tablemap = me.tablemap || {};
		me.d1m/*updateJoinFields*/();
		
		// for (i=0; i < cubemodel.tables.length; i++)
		$.each(cubemodel.tables, function(i, table)
		{
			var n, o, r,
				nsname,
				ntname,
				tname,
				nfield;

			px = table.x = Number(table.x);
			py = table.y = Number(table.y);
			pw = table.width = Number(table.width);
			ph = table.height = Number(table.height);
			pth = table.theight = Number(table.theight) || table.height;
			cpM/*collapseMode*/ = table.cpM/*collapseMode*/;
			tname = table.uid + "_" + table.seq;
			
			if (table.box)
			{
				table.box.o3/*innergrid*/.l1/*loadData*/.call(table.box.o3/*innergrid*/);
			}
			else
			{
				mbox = m.s7/*addBox*/.call(m, px, py, pw, ph, table, me);
				table.box = mbox;
				
				if (b_onload)
				{
					me.l5/*loadTableContent*/.call(me, table, b_onload, i == cubemodel.tables.length-1);
				}
			}
			
			me.tablemap[tname] = table;
		});
		
		m.s5/*validateSize*/.call(m);
	},
	
	d2/*validateJoins*/: function() {
		var me = this,
			i,
			r, fobj, tobj,
			cubemodel = me.c1/*cubemodel*/,
			m = me.m,
			bl;
		
		for (i=cubemodel.relations.length-1; i>=0; i--)
		{
			r = cubemodel.relations[i];
			fobj = me.tablemap[r.source.tableuid + "_" + r.source.seq];
			tobj = me.tablemap[r.target.tableuid + "_" + r.target.seq];
			
			if (!fobj || !tobj)
			{
				cubemodel.relations.splice(i, 1);
			}
			else
			{
				if (!r.bl)
				{
					r.bl = m.s8/*addLink*/.call(m, fobj, tobj, r, cubemodel.relations);
				}
			}
		}
		
		me.d1m/*updateJoinFields*/();
		me.s6/*validateLinks*/();
		m.s6/*validateLinks*/.call(m);
	},
    
    s6/*validateLinks*/: function() {
        // update join relation grid
        var me = this,
            mRel = me.down("[name=mRel]"),
            dp = [],
            m = me.m,
            i,
            links = m.relations || [],
            link, s, t;
        
        // generates data
        for (i=0; i < links.length; i++)
        {
            link = links[i];
            
            s = link.source;
            t = link.target;
            
            if (s && t)
            {
                dp.push({
                    s0: s.tablename,
                    t0: t.tablename,
                    s1: s.seq,
                    t1: t.seq,
                    s2: s.name,
                    t2: t.name,
                    r0: link.join,
                    sdesc: s.tablename + "." + s.name,
                    tdesc: t.tablename + "." + t.name,
                    l: link
                });
            }
        }
        
        // update data
        mRel.store.loadData(dp);
    },
	/* end drawing functions */
	
	d3/*onDropTable*/: function(ev, et) {
		var m = this,
			tb = et,
			table,
			cubemodel = m.c1/*cubemodel*/,
			offset = m.m.viewer.offset(), 
			i;
		
		table = new IG$/*mainapp*/.mm$98/*tableobject*/(null);
		IG$/*mainapp*/._I1d/*CopyObject*/(tb, table, "nodepath;name;type;uid;memo;schemaname;alias");
		table.x = ev.getX() - offset.left;
		table.y = ev.getY() - offset.top;
		table.width = 180;
		table.height = 200;
		table.seq = 0;
		
		table.fields = [];
		
		for (i=0; i < cubemodel.tables.length; i++)
		{
			if (cubemodel.tables[i].uid == table.uid)
			{
				table.seq = Math.max(table.seq, cubemodel.tables[i].seq+1);
			}
		}
		
		cubemodel.tables.push(table);
        
        m.l5a/*updateUsedTable*/();
		
		m.l5/*loadTableContent*/(table);
	},
	
	d5a/*updateModel*/: function() {
		var me = this,
			m = me.m,
			i, table, bbox, tboffset,
			bdom,
			mainoffset = m.o5/*scrollpanel*/.offset(),
			cubemodel = me.c1/*cubemodel*/;
		
		for (i=0; i < cubemodel.tables.length; i++)
		{
			table = cubemodel.tables[i];
			bbox = table.box.o3/*innergrid*/; //o1/*outerbox*/;
			bdom = $(bbox.el.dom);
			
			tboffset = bdom.offset();
			table.x = tboffset.left - mainoffset.left;
			table.y = tboffset.top - mainoffset.top;
			table.width = bbox.getWidth();
			table.height = bbox.getHeight();
			
			if (!table.cpM/*collapseMode*/)
			{
				table.theight = table.height;
			}
		}
	},
	
	d5/*saveContent*/: function(newitem) {
		var panel = this;
		
		panel.d5a/*updateModel*/();
		
		var	i, cubemodel = panel.c1/*cubemodel*/,
			content = cubemodel.l1/*getXML*/.call(cubemodel),
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			obj;
		
		panel.setLoading(true);
		
		if (newitem)
		{
			obj = IG$/*mainapp*/._I2d/*getItemAddress*/({pid: cubemodel.item.pid, address: cubemodel.item.address, name: cubemodel.item.name, type: "CubeModel"}, "address;uid;name;nodepath;option;type");
		}
		else
		{
			obj = IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}, "uid;name;nodepath;option");
		}
		
		req.init(panel, 
			{
	            ack: "31",
	        	payload: obj,
	            mbody: content
	        }, panel, panel.rs_d5/*saveContent*/, null);
		req._l/*request*/();
	},
	
	rs_d5/*saveContent*/: function(xdoc) {
		var panel = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			name;
		
		if (tnode)
		{
			panel.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid");
			name = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "name");
			panel.setTitle(name);
			
			panel.down("[name=b_b_cube]").show();
		}
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
	},
	
	d4/*onDropField*/: function(fnode, tnode) {
		var me = this,
			cubemodel = me.c1/*cubemodel*/,
			m = me.m,
			r = {join: "inner", operator: "="},
			src, tgt;
		
		r.source = {
			nodepath: fnode.get("nodepath"),
			datasize: fnode.get("datasize"),
			datatype: fnode.get("datatype"),
			name: fnode.get("name"),
			tablename: fnode.get("tablename"),
			type: fnode.get("type"),
			seq: fnode.get("seq"),
			tableuid: fnode.get("tableuid")
		};
		
		r.target = {
			nodepath: tnode.get("nodepath"),
			datasize: tnode.get("datasize"),
			datatype: tnode.get("datatype"),
			name: tnode.get("name"),
			tablename: tnode.get("tablename"),
			type: tnode.get("type"),
			seq: tnode.get("seq"),
			tableuid: tnode.get("tableuid")
		};
		cubemodel.relations.push(r);
		me.d1m/*updateJoinFields*/();
		src = me.tablemap[r.source.tableuid + "_" + r.source.seq];
		tgt = me.tablemap[r.target.tableuid + "_" + r.target.seq];
		
		if (src && tgt)
		{
			r.bl = m.s8/*addLink*/.call(m, src, tgt, r, cubemodel.relations);
            me.s6/*validateLinks*/();
			m.s6/*validateLinks*/.call(m);
		}
	},
	
	d6/*addSchema*/: function() {
		var me = this,
			dlg = new IG$/*mainapp*/._If2/*selectPool*/({
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_d6/*addSchema*/)
			});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlg);
	},
	
	rs_d6/*addSchema*/: function(dlg) {
		var me = this,
			i, j, bfound,
			s1 = dlg._s1/*selectedPool*/,
			reqitems = [];
			
		if (s1 && s1.length > 0)
		{
			for (i=0; i < s1.length; i++)
			{
				bfound = false;
				for (j=0; j < me.c1/*cubemodel*/.pooluids.length; j++)
				{
					if (me.c1/*cubemodel*/.pooluids[j] == s1[i].uid)
					{
						bfound = true;
						break;
					}
				}
				
				if (!bfound)
				{
					me.c1/*cubemodel*/.pooluids.push(s1[i].uid);
					me.c1/*cubemodel*/.pools.push(s1[i].name);
				}
			}
			
			me.l2/*loadPool*/();
		}
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var panel = this,
			m = panel.m,
			i;
		
		switch (cmd)
		{
		case "cmd_save":
			if (!panel.uid)
			{
				panel.$f1/*saveAsContent*/(false);
			}
			else
			{
				panel.d5/*saveContent*/();
			}
			break;
		case "cmd_saveas":
			panel.$f1/*saveAsContent*/(false);
			break;
		case "cmd_simple_view":
			panel.c1/*cubemodel*/.groupview = !panel.c1/*cubemodel*/.groupview;
			m.s6/*validateLinks*/.call(m);
			break;
		case "cmd_c_a": // collapse or expand all
			var cubemodel = panel.c1/*cubemodel*/;
			panel.cpM/*collapseMode*/ = !panel.cpM/*collapseMode*/;
			for (i=0; i < cubemodel.tables.length; i++)
			{
				if (cubemodel.tables[i].box.table.cpM/*collapseMode*/ != panel.cpM/*collapseMode*/)
				{
					cubemodel.tables[i].box.cp/*collapsePanel*/.call(cubemodel.tables[i].box, panel.cpM/*collapseMode*/);
				}
			}
			break;
		case "cmd_fix_key":
			var cubemodel = panel.c1/*cubemodel*/;
			cubemodel.cAM/*fixKeyMode*/ = !cubemodel.cAM/*fixKeyMode*/;
			for (i=0; i < cubemodel.tables.length; i++)
			{
				cubemodel.tables[i].box.cAM/*fixKeyMode*/.call(cubemodel.tables[i].box, cubemodel.cAM/*fixKeyMode*/);
			}
			break;
		case "cmd_add_schema":
			panel.d6/*addSchema*/();
			break;
		case "cmd_table_order":
			var dlg = new IG$/*mainapp*/._IA9/*tableOrder*/({
				c1/*cubemodel*/: panel.c1/*cubemodel*/
			});
			dlg.show(panel);
			break;
		case "cmd_zoomin":
			m.z1/*zoom*/.call(m, 0.2);
			break;
		case "cmd_zoomout":
			m.z1/*zoom*/.call(m, -0.2);
			break;
		case "cmd_b_cube":
			IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("B_B_CUBE"), function(dlg) {
				if (dlg == "yes")
				{
					panel.b1/*buildCube*/.call(panel);
				}
			});
			
			break;
		}
	},
	
	b1/*buildCube*/: function() {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
	    		mode: "newitem",
	    		initpath: me.nodepath,
	    		callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
			        var me = this,
			        	req = new IG$/*mainapp*/._I3e/*requestServer*/();
			        	
			        req.init(me, {
			            ack: "31",
			            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({
			            	address: item.nodepath + "/" + item.name,
			            	name: item.name,
			            	type: "Cube",
			            	pid: item.uid
			            }, "address;name;type;pid"),
			            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
			        }, me, function(xdoc) {
			        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			        		p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode),
			        		mp = IG$/*mainapp*/._I7d/*mainPanel*/;
			        		
				    	mp && mp.m1$7/*navigateApp*/.call(mp, p.uid, "cube".toLowerCase(), p.name || item.name, null, false, true, {
				    		cube_model_uid: me.uid,
				    		build_cube: 1
				    	});
			        }, null);
				    req._l/*request*/();
	    		})
	    	});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlgitemsel);
	},
	
	$f1/*saveAsContent*/: function(afterclose) {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
	    		mode: "newitem",
	    		initpath: me.nodepath,
	    		callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.$f2/*saveNewContent*/, afterclose)
	    	});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlgitemsel);
	},
	
	$f2/*saveNewContent*/: function(item, afterclose) {
		var panel = this;
		panel.c1/*cubemodel*/.item = {
			name: item.name,
			address: item.nodepath + "/" + item.name,
			pid: item.uid
		};
		// panel.uid = item.uid;
		panel.d5/*saveContent*/(true);
	},
    
    _r_join: function(l) {
        var me = this,
            i,
            cmodel = me.c1/*cubemodel*/,
            m = me.m,
            rels = cmodel.relations,
            bfound;
        for (i=0; i < rels.length; i++)
        {
            if (rels[i] == l)
            {
                rels.splice(i, 1);
                break;
            }
        }
        
        for (i=0; i < m.links.length; i++)
        {
            bfound = false;
            for (j=0; j < m.links[i].links.length; j++)
            {
                if (m.links[i].links[j] == l)
                {
                    m.links[i].links.splice(j, 1);
                    bfound = true;
                    break;
                }
            }
            
            if (bfound == true)
            {
                if (m.links[i].length == 0)
                {
                    m.links.splice(i, 1);
                }
                break;
            }
        }
        
        me.d1m/*updateJoinFields*/();
		me.s6/*validateLinks*/();
		m.s6/*validateLinks*/.call(m);
    },
    
    _s2/*search_relationship*/: function() {
        var me = this,
            txt_rel = me.down("[name=txt_rel]").getValue(),
            mRel = me.down("[name=mRel]"),
            store = mRel.store;
            
        store.clearFilter();
        
        if (txt_rel)
        {
            txt_rel = txt_rel.toLowerCase();
            store.filterBy(function(val) {
                var dt = [val.get("s0"), val.get("s2"), val.get("t0"), val.get("t2")],
                    b = false, i;
                
                for (i=0; i < dt.length; i++)
                {
                    if (dt[i] && dt[i].toLowerCase().indexOf(txt_rel) > -1)
                    {
                        b = true;
                        break;
                    }
                }
                
                return b;
            });
        }
    },
	
    initComponent: function(){
    	var me = this;
    	
    	$s.apply(this, {
    		items: [
    			{
    				xtype: "panel",
    				region: "west",
			    	width: 250,
			    	split: true,
			    	collapsible: true,
					hideHeaders: true,
			    	title: "Table Lists",
			    	layout: {
			    		type: "vbox",
			    		align: "stretch"
			    	},
			    	items: [
			    		{
			    			xtype: "fieldset",
			    			layout: "anchor",
			    			defaults: {
			    				anchor: "100%",
			    				labelWidth: 60
			    			},
			    			items: [
			    				{
			    					xtype: "fieldcontainer",
			    					fieldLabel: "Schema",
			    					layout: {
			    						type: "hbox",
			    						align: "stretch"
			    					},
			    					items: [
							    		{
							    			xtype: "combobox",
							    			editable: false,
							    			flex: 1,
							    			queryMode: "local",
							    			name: "sc_lst",
							    			displayField: "name",
							    			valueField: "value",
							    			store: {
							    				xtype: "store",
							    				fields: [
							    					"name", "value"
							    				]
							    			}
							    		},
							    		{
							    			xtype: "button",
											iconCls: "icon-toolbar-add-schema",
											tooltip: "Add Schema",
											handler: function() {this._t$/*toolbarHandler*/("cmd_add_schema"); },
											scope: this
										},
										{
											xtype: "button",
											hidden: true,
											name: "b_rs",
											iconCls: "icon-toolbar-remove",
											tooltip: "Remove Schema",
											handler: function() {
												var me = this,
													pooluids = me.c1/*cubemodel*/ ? me.c1/*cubemodel*/.pooluids : null,
													sc_lst = me.down("[name=sc_lst]"),
													st = sc_lst.store,
													stval = sc_lst.getValue(),
													i,
													rec;
													
												if (pooluids.length > 1)
												{
													for (i=0; i < pooluids.length; i++)
													{
														if (pooluids[i] == stval)
														{
															pooluids.splice(i, 1);
															break;
														}
													}
													
													for (i=0; i < st.data.items.length; i++)
													{
														rec = st.data.items[i];
														
														if (rec.get("value") == stval)
														{
															st.remove(rec);
															break;
														}
													}
													
													sc_lst.setValue(st.data.items[1].get("value"));
													me.down("[name=b_rs]").setVisible(st.data.items.length > 2);
												}
											},
											scope: this
										}
									]
								},
					    		{
					    			xtype: "fieldcontainer",
					    			layout: {
					    				type: "hbox",
					    				align: "stretch"
					    			},
					    			fieldLabel: "Field",
						    		items: [
							    		{
							    			xtype: "textfield",
							    			name: "f_kwd",
							    			flex: 1,
							    			enableKeyEvents: true,
							    			listeners: {
							    				keyup: function(tobj, e, eopts) {
							    					e.keyCode == 13 && this.l4/*loadDatabaseTable*/(null, "StoredContent");
							    				},
							    				scope: this
							    			}
							    		},
							    		{
							    			xtype: "button",
							    			text: "..",
							    			handler: function() {
							    				this.l4/*loadDatabaseTable*/(null, "StoredContent");
							    			},
							    			scope: this
							    		}
							    	]
							    }
					    	]
					    },
						{
					    	xtype: "gridpanel",
					    	name: "mgrid_schema",
					    	enableDragDrop: true,
					    	enableDD: true,
					    	useArrows: true,
					    	
					    	flex: 1,
					    	
					    	ddGroup: "CubeModelDDGroup",
					    	viewConfig: {
								plugins: {
									ptype: "gridviewdragdrop",
									dragGroup: "CubeModelDDGroup"
								},
								listeners: {
									drop: function(node, data, dropRec, dropPosition) {
										var dropOn = dropRec ? " " + dropPosition + " " + dropRec.get("name") : " on empty view";
									}
								}
							},
					    	store: {
						    	xtype: "store",
					    		showcheckselect: true,
					    		fields: [
					    			"name", "type", "nodepath", "dispname", "uid", "used"
					    		]
					    	},
					    	columns: [
                                {
                                    text: "",
                                    width: 20,
                                    dataIndex: "used"
                                },
			    	    	    {
			    	    	    	text: IRm$/*resources*/.r1("B_NAME"),
			    	    	    	flex: 1,
			    	    	    	hideable: false,
			    	    	    	dataIndex: "dispname"
			    	    	    }
			    	    	],
			    	    	bbar: [
				    	       {
				    	    	   xtype: "displayfield",
				    	    	   value: "Drag table to content area"
				    	       }
			    	    	],
                            listeners: {
                                cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
									var me = this,
										rec = grid.store.getAt(rowIndex),
                                        c1/*cubemodel*/ = me.c1/*cubemodel*/,
                                        i, tb;
                                        
                                    if (rec.get("used") == "*")
                                    {
                                        for (i=0; i < c1/*cubemodel*/.tables.length; i++)
                                        {
                                            if (c1/*cubemodel*/.tables[i].uid == rec.get("uid"))
                                            {
                                                tb = c1/*cubemodel*/.tables[i];
                                                break;
                                            }
                                        }
                                        
                                        tb && me.m._f1/*focusTable*/(tb);
                                    }
                                },
                                scope: this
                            }
					    }
			    	]
    			},
			    {
			    	type: "panel",
			    	html: "",
			    	overflowX: "hidden",
			    	overflowY: "hidden",
			    	name: "mcontainer",
			    	region: "center",
			    	title: "Model Contents"
			    },
                {
                    xtype: "panel",
                    title: "Relations",
                    region: "east",
                    width: 320,
                    layout: {
                        type: "vbox",
                        align: "stretch"
                    },
                    items: [
                        {
                            xtype: "fieldcontainer",
                            layout: {
                                type: "hbox",
                                align: "stretch"
                            },
                            items: [
                                {
                                    xtype: "textfield",
                                    fieldLabel: "Search",
                                    name: "txt_rel",
                                    labelWidth: 40,
                                    labelAlign: "right",
                                    flex: 1,
                                    enableKeyEvents: !0,
                                    listeners: {
                                        keyup: function(obj, e, eopt) {
                                            if (e.keyCode == 13)
                                            {
                                                me._s2/*search_relationship*/();
                                            }
                                        },
                                        scope: this
                                    }
                                },
                                {
                                    xtype: "button",
                                    text: "..",
                                    handler: function() {
                                        me._s2/*search_relationship*/();
                                    }
                                }
                            ]
                        },
                        {
                            xtype: "gridpanel",
                            name: "mRel",
                            flex: 1,
                            store: {
                                fields: ["s0", "s1", "s2", "t0", "t1", "t2", "r0", "sdesc", "tdesc", "l"]
                            },
                            columns: [
                                {
                                    text: "From",
                                    flex: 1,
                                    dataIndex: "sdesc"
                                },
                                {
                                    text: "To",
                                    flex: 1,
                                    dataIndex: "tdesc"
                                },
                                {
                                    xtype: "actioncolumn",
                                    width: 45,
                                    items: [
                                        {
                                            iconCls: "icon-grid-config",
                                            tooltip: "Config item",
                                            handler: function(grid, rowIndex, colIndex) {
                                                var rec = grid.store.getAt(rowIndex),
                                                    rel = rec.get("l"),
                                                    link;
                                                    
                                                if (rel && rel.bl)
                                                {
                                                	link = rel.bl;
                                                    link.l2/*showLinkEditor*/.call(link, [link.links[0]], link.links);
                                                }
                                            }
                                        },
                                        {
                                            iconCls: "icon-grid-delete",
                                            tooltip: "Delete item",
                                            handler: function (grid, rowIndex, colIndex) {
                                                var rec = grid.store.getAt(rowIndex);
                                                
                                                me._r_join(rec.get("l"));
                                            }
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
					iconCls: "icon-toolbar-save",
					name: "t_save",
					tooltip: "Save table",
					handler: function() {this._t$/*toolbarHandler*/("cmd_save"); },
					scope: this
				},
				{
		        	iconCls: "icon-toolbar-saveas",
		        	name: "t_save_as",
		        	tooltip: IRm$/*resources*/.r1("L_SAVE_REPORT_AS"),
		        	handler: function() {
			    		this._t$/*toolbarHandler*/("cmd_saveas"); 
			    	},
		        	scope: this
		        },
				{
					iconCls: "icon-toolbar-simple-view",
					tooltip: "Simple Relation View",
					handler: function() {this._t$/*toolbarHandler*/("cmd_simple_view"); },
					scope: this
				},
				{
					iconCls: "icon-toolbar-c_a",
					tooltip: "Collapse/Expand all tables",
					hidden: window.Ext ? false : true,
					handler: function() {this._t$/*toolbarHandler*/("cmd_c_a"); },
					scope: this
				},
				{
					iconCls: "icon-toolbar-table-order",
					tooltip: "Table order",
					handler: function() {
						this._t$/*toolbarHandler*/("cmd_table_order");
					},
					scope: this
				},
				{
					iconCls: "icon-toolbar-fixkey",
					text: "Fix key",
					tooltip: "Fix Key columns",
					handler: function() {
						this._t$/*toolbarHandler*/("cmd_fix_key");
					},
					scope: this
				},
				{
					iconCls: "icon-toolbar-export",
					tooltip: "Print",
					handler: function() {
						this._t$/*toolbarHandler*/("cmd_print");
					},
					scope: this
				},
				"->",
//		        {
//		        	iconCls: "icon-toolbar-help",
//		        	tooltip: IRm$/*resources*/.r1("B_HELP"),
//		        	handler: function() {
//		        		IG$/*mainapp*/._I63/*showHelp*/("P0020");
//		        	}
//		        },
		        {
		        	iconCls: "icon-cube",
		        	name: "b_b_cube",
		        	text: IRm$/*resources*/.r1("L_BUILD_CUBE"),
		        	tooltip: IRm$/*resources*/.r1("B_BUILD"),
		        	hidden: !this.uid,
		        	handler: function() {
		        		this._t$/*toolbarHandler*/("cmd_b_cube");
		        	},
		        	scope: this
		        }
			],
			listeners: {
				afterrender: function(ui) {
					this._IFd/*init_f*/();
				},
				resize: function(ui) {
					this.m.s5/*validateSize*/.call(this.m);
				},
				beforeclose: function(panel, opt) {
					var r = true;
					
					if (this.writable && this.uid)
					{
						var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
						lreq.init(panel, 
							{
					            ack: "11",
					            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
					            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "lock", detail: "close"})
							}, panel, function(xdoc) {
								
							}, false);
							
						lreq._l/*request*/();
					}
					
					return r;
				}
			}
    	});

        IG$/*mainapp*/._IC7/*CubeModel*/.superclass.initComponent.call(this);
    }
});


IG$/*mainapp*/._IA9/*tableOrder*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	
	"layout": "fit",
	
	closable: true,
	resizable: true,
	
	width: 500,
	height: 610,
	
	callback: null,
	
	_IFd/*init_f*/: function() {
		var me = this,
			c1/*cubemodel*/ = me.c1/*cubemodel*/,
			i, data = [],
			grd_tables = me.down("[name=grd_tables]"),
			p;
			
		for (i=0; i < c1.tables.length; i++)
		{
			p = {
				uid: c1.tables[i].uid,
				name: c1.tables[i].name,
				seq: c1.tables[i].seq
			};
			
			p.disp = (p.seq) ? p.name + "(" + p.seq + ")" : p.name;
			data.push(p);
		}
		
		grd_tables.store.loadData(data);
	},
	
	CC1/*confirmChanges*/: function() {
		var me = this,
			c1/*cubemodel*/ = me.c1/*cubemodel*/,
			seq = {},
			i,
			grd_tables = me.down("[name=grd_tables]"),
			rec, k;
			
		for (i=0; i < grd_tables.store.data.items.length; i++)
		{
			rec = grd_tables.store.data.items[i];
			seq[rec.get("uid") + "_" + rec.get("seq")] = i;
		}
		
		for (i=0; i < c1.tables.length; i++)
		{
			k = c1.tables[i].uid + "_" + c1.tables[i].seq;
			c1.tables[i].sortindex = seq[k];
		}
		
		c1.tables.sort(function(a, b) {
			return a.sortindex - b.sortindex;
		});
			
		me.close();
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("L_TBL_ORD");
		
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
			items: [
				{
					xtype: "panel",
					layout: {
						type: "hbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "gridpanel",
							flex: 1,
							$h: 540,
							name: "grd_tables",
							store: {
								xtype: "store",
								fields: [
									"name", "uid", "seq", "disp"
								]
							},
							columns: [
								{
									xtype: "gridcolumn",
									flex: 1,
									text: IRm$/*resources*/.r1("B_NAME"),
									dataIndex: "name"
								} //,
//								{
//									xtype: "gridcolumn",
//									width: 50,
//									text: "Index",
//									dataIndex: "seq"
//								}
							]
						},
						{
							xtype: "container",
							padding: "0 0 0 5",
							layout: {
								type: "vbox",
								pack: "center",
								align: "stretch"
							},
							items: [
								{
									xtype: "button",
									iconCls: "ig-btn-up",
									handler: function() {
										var grd_tables = this.down("[name=grd_tables]"),
											i,
											sm = grd_tables.getSelectionModel(),
											sel = sm.getSelection(),
											si;
										
										if (sel.length == 1)
										{
											si = grd_tables.store.indexOf(sel[0]);
											if (si > 0)
											{
												grd_tables.store.remove(sel[0]);
												grd_tables.store.insert(si-1, sel[0]);
												sm.select(sel[0]);
											}
										}	
									},
									scope: this
								},
								{
									xtype: "container",
									height: 10
								},
								{
									xtype: "button",
									iconCls: "ig-btn-down",
									handler: function() {
										var grd_tables = this.down("[name=grd_tables]"),
											i,
											sm = grd_tables.getSelectionModel(),
											sel = sm.getSelection(),
											si;
										
										if (sel.length == 1)
										{
											si = grd_tables.store.indexOf(sel[0]);
											if (si+1 < grd_tables.store.data.items.length)
											{
												grd_tables.store.remove(sel[0]);
												grd_tables.store.insert(si+1, sel[0]);
												sm.select(sel[0]);
											}
										}	
									},
									scope: this
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
						this.CC1/*confirmChanges*/();
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1("B_CLOSE"),
					handler: function() {
						this.close();
					},
					scope: this
				}
			]
		});
		
		IG$/*mainapp*/._IA9/*tableOrder*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj._IFd/*init_f*/.call(tobj);
		}
	}
});

IG$/*mainapp*/.DM2a/*loadPrview*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	
	"layout": "fit",
	
	closable: true,
	resizable: true,
	
	width: 500,
	autoHeight: true,
	
	callback: null,
	
	in$t: function() {
		var me = this;
		
		if (me.table)
		{
			me.l1/*loadContent*/();
		}
	},
	
	l1/*loadContent*/: function(passwd) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		panel.setLoading(true);
		
		req.init(panel, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.table.uid, type: panel.table.type, passwd: passwd, option: "preview"}, "uid;type;option;passwd"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "preview"})
	        }, panel, panel.rs_l1/*loadContent*/, panel.err_l1/*loadContent*/);
		req._l/*request*/();
	},
	
	_IMa/*pwdset*/: function(poolname) {
		var me = this,
			pwd = IG$/*mainapp*/.dbp[poolname];
		if (!pwd)
		{
			var pwdpop = new IG$/*mainapp*/._Ice/*userDbPassword*/({
				poolname: poolname,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.r_IMa/*pwdset*/, poolname)
			});
			
			IG$/*mainapp*/._I_5/*checkLogin*/(me, pwdpop);
		}
		else
		{
			me.l1/*loadContent*/(pwd);
		}
	},
	
	r_IMa/*pwdset*/: function(npwd, poolname) {
		IG$/*mainapp*/.dbp[poolname] = npwd;
		this.l1/*loadContent*/(npwd);
	},
	
	rs_l1/*loadContent*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/result"),
			hnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/result/headers"),
			dnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/result/data"),
			i, darray, hnodes, row, data = [], cols = [], delimiter, cname, dkey, c,
			fields=[], store,
			dataview = me.down("[name=dataview]"),
			table = me.table;
			umap = {};
		
		me.setLoading(false);
		
		if (hnode && dnode)
		{
			for (i=0; i < table.fields.length; i++)
			{
				umap[table.fields[i].name] = table.fields[i].alias;
			}
			
			delimiter = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "delimiter");
			hnodes = IG$/*mainapp*/._I26/*getChildNodes*/(hnode);
			for (i=0; i < hnodes.length; i++)
			{
				cname = IG$/*mainapp*/._I1b/*XGetAttr*/(hnodes[i], "name");
				if (umap[cname] && umap[cname] != cname)
				{
					cname = umap[cname] + " - " + cname;
				}
				dkey = "col_" + i;
				cols.push({
					xtype: "gridcolumn",
					width: 150,
					text: cname,
					dataIndex: dkey
				});
				
				fields.push({name: dkey, mapping: dkey});
			}
			
			c = cols.length;
			
			darray = IG$/*mainapp*/._I24/*getTextContent*/(dnode);
			darray = darray.split(delimiter);
			
			row = {};
			
			if (c > 1)
			{
				for (i=0; i < darray.length; i++)
				{
					dkey = "col_" + (i % c);
					
					if (i > 0 && i % c == 0)
					{
						data.push(row);
						row = {};
						row[dkey] = darray[i];
					}
					else
					{
						row[dkey] = darray[i];
					}
				}
			}
			else
			{
				dkey = "col_0";
				for (i=0; i < darray.length-1; i++)
				{
					row[dkey] = darray[i];
					data.push(row);
				}
			}
		}
		
		store = {
			// buffered: true,
			// pageSize: 50,
			// purgePageCount: 0,
			store: "array",
			fields: fields,
//			proxy: {
//				type: "memory"
//			},
			data: data
		};
		
		dataview.reconfigure(store, cols);
		// dataview.store.loadData(data);
	},
	
	err_l1/*loadContent*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			errcode = (tnode ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "errorcode") : null),
			errmsg = (tnode ? IG$/*mainapp*/._I24/*getTextContent*/(tnode) : null);
		
		if (errcode == "0x4090")
		{
			me._IMa/*pwdset*/(errmsg);
			
			return false;
		}
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("L_PRV_DATA");
		
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
			
			"layout": "fit",
			
			items: [
			    {
			    	xtype: "panel",
			    	layout: {
			    		type: "vbox",
			    		align: "stretch"
			    	},
			    	items: [
		    	        {
		    	        	xtype: "displayfield",
		    	        	value: "Table data preview"
		    	        },
		    	        {
		    	        	xtype: "gridpanel",
		    	        	name: "dataview",
		    	        	height: 400,
		    	        	columns: [
		    	        	]
		    	        }
			    	]
			    }
			],
			
			buttons:[
				{
					text: IRm$/*resources*/.r1("B_CLOSE"),
					handler: function() {
						this.close();
					},
					scope: this
				}
			],
			
			listeners: {
				afterrender: function(ui) {
					var me = this;
					me.in$t();
				}
			}
		});
		
		IG$/*mainapp*/.DM2a/*loadPrview*/.superclass.initComponent.apply(this, arguments);
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

/* file: codemapping.js */

IG$/*mainapp*/._IMm/*codemapping*/ = $s.extend($s.window, {
	
	modal: true,
	"layout": "fit",
	
	closable: false,
	resizable:false,
	width: 540,
	height: 480,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			grd_data = me.down("[name=grd_data]"),
			i_cset_g = me.down("[name=i_cset_g]"),
			displabel_c = me.down("[name=displabel_c]"),
			p_1a = me.down("[name=p_1a]"),
			i,
			rec,
			req,
			pitem = me.pitem;
		
		if (pitem)
		{
			pitem.ditem.name = me.down("[name=p_1]").getValue();
			pitem.ditem.description = me.down("[name=p_2]").getValue();
			pitem.dtype = me.down("[name=p_3]").getValue();
			pitem.dsql = me.down("[name=p_4]").getValue();
			pitem.dvalues = [];
			pitem.ds = me.down("[name=cbdatasource]").getValue();
			
			pitem.i_cdata = [];
			
			if (pitem.dtype == "static")
			{
				pitem.i_cset = me.down("[name=i_cset_s]").getValue();
			}
			else
			{
				pitem.i_cset = me.down("[name=i_cset]").checkboxCmp.getValue();
			}
			
			for (i=0; i < grd_data.store.data.items.length; i++)
			{
				rec = grd_data.store.data.items[i];
				
				if (rec.get("value"))
				{
					pitem.dvalues.push({
						code: rec.get("code"),
						value: rec.get("value")
					});
					
					if (pitem.dtype == "static" && rec.get("color"))
					{
						pitem.i_cdata.push({value: rec.get("code"), color: rec.get("color")});
					}
				}
			}
			
			if (pitem.dtype != "static")
			{
				for (i=0; i < i_cset_g.store.data.items.length; i++)
				{
					rec = i_cset_g.store.data.items[i];
					
					if (rec.get("color"))
					{
						pitem.i_cdata.push({value: rec.get("value"), color: rec.get("color")});
					}
				}
			}
			
			p_1a._IFf/*confirmDialog*/.call(p_1a);
			
			if (pitem.dtype == "static" || pitem.dtype == "sql")
			{
				pitem.displabel = displabel_c.getValue();
			}
			
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
					ack: "31",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.pitem.ditem.uid}),
					mbody: me.pitem.p2/*getXML*/.call(me.pitem)
				}, me, function(xdoc) {
					var me = this;
					me.callback && me.callback.execute(me.item);
					me._IG0/*closeDlgProc*/();
				}, null);
			req._l/*request*/();
		}
	},
	
	_IFd/*init_f*/: function() {
		this.l1/*loadDBPool*/();
	},
	
	r1/*requestContent*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
				ack: "5",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, revision: me.revision}),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "diagnostics"})
			}, me, function(xdoc) {
				var me = this;
				me.pitem = new IG$/*mainapp*/.iff/*clCodeMapping*/(xdoc);
				me._l1/*loadContent*/();
			}, false);
		req._l/*request*/();
	},
	
	l1/*loadDBPool*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		// me.setLoading(true);
		
		req.init(me, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "standard"})
	        }, me, function(xdoc) {
	        	var me = this,
					d,
					i, tnodes, tnode, address, req;
				tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
				
				me.setLoading(false);
				
				if (tnode)
				{
					tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
					address = "<smsg>";
					for (i=0; i < tnodes.length; i++)
					{
						d = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						address += "<item address='/" + d.name + "' option='StoredContent'/>";
					}
					address += "</smsg>";
					
					me.setLoading(true);
					
					req = new IG$/*mainapp*/._I3e/*requestServer*/();
					req.init(me, 
						{
			                ack: "25",
			                payload: address,
			                mbody: "<smsg></smsg>"
			            }, me, me.rs_l1/*loadDBPool*/, null);
			        req._l/*request*/();
				}
	        }, false);
		req._l/*request*/();
	},
	
	rs_l1/*loadDBPool*/: function(xdoc) {
		var me = this,
			dp = [],
			i, cnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"), 
			snodes, p,
			isadmin = false,
			cbdatasource = me.down("[name=cbdatasource]");
		
		// me.setLoading(false);
		
		dp.push({dispname:"-- Select Pool --", uid:""}); 
		
		if (cnode)
		{
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(cnode);
			isadmin = IG$/*mainapp*/._I83/*dlgLogin*/.jS2/*isAdmin*/;
			
			for (i=0; i < snodes.length; i++)
			{
				p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
				if (isadmin == true || (isadmin == false && p.name.toUpperCase() != "INGECEP"))
				{
					p.dispname = p.name;
					p.dispname = IG$/*mainapp*/._I08/*formatName*/(p.dispname);
					
					dp.push(p);
				}
			}
		}
		
		cbdatasource.store.loadData(dp);
		cbdatasource.setValue("");
		
		me.r1/*requestContent*/();
	},
	
	_l1/*loadContent*/: function() {
		var me = this,
			pitem = me.pitem,
			p_1a = me.down("[name=p_1a]"),
			values;
			
		if (pitem)
		{
			values = [
				{
					c: "p_1",
					v: pitem.ditem.name
				},
				{
					c: "p_2",
					v: pitem.ditem.description
				},
				{
					c: "p_3",
					v: pitem.dtype
				},
				{
					c: "p_4",
					v: pitem.dsql
				},
				{
					c: "cbdatasource",
					v: pitem.ds
				},
				{
					c: "i_cset_s",
					v: pitem.i_cset
				}
			];
			
			me.down("[name=p_1a]").rec = pitem;
			if (pitem.dtype == "sqljoin")
			{
				p_1a.pooluid = pitem.ds;
				p_1a.sK3/*loadContent*/.call(p_1a);
			}
			
			me._l2/*applyValue*/(values);
			me.down("[name=grd_data]").store.loadData(pitem.dvalues);
			me.down("[name=i_cset_g]").store.loadData(pitem.i_cdata);
			me.down("[name=displabel_c]").setValue(pitem.displabel || "");
			
			if (pitem.i_cset)
			{
				me.down("[name=i_cset]").expand();
			}
		}
	},
	
	_l2/*applyValue*/: function(values) {
		var me = this,
			c, i;
			
		for (i=0; i < values.length; i++)
		{
			c = me.down("[name=" + values[i].c + "]");
			c.setValue(values[i].v || "");
		}
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
	
	initComponent : function() {
		var i, 
			me = this,
			customstyles = [];
			
		me.title = IRm$/*resources*/.r1("T_CODE_MAPPING");
				
		$s.apply(me, {
			
			bodyStyle: "padding:5px; background: #ffffff",
			
			items: [
				{
					xtype: "panel",
					padding: "5 5",
					border: 0,
					autoScroll: true,
					
					layout: {
						type: "vbox",
						align: "stretch"
					},
					
					items: [
						{
							xtype: "textfield",
							fieldLabel: IRm$/*resources*/.r1("B_NAME"),
							name: "p_1"
						},
						{
							xtype: "textarea",
							fieldLabel: IRm$/*resources*/.r1("B_DESC"),
							name: "p_2",
							height: 60
						},
						{
							xtype: "combobox",
							fieldLabel: "Mapping Type",
							name: "p_3",
							store: {
								xtype: "store",
								fields: [
									"name", "value"
								],
								data: [
									{name: "Select", value: ""},
									{name: "Static Values", value: "static"},
									{name: "SQL Query", value: "sql"},
									{name: "SQL Join", value: "sqljoin"}
								]
							},
							queryMode: "local",
							valueField: "value",
							displayField: "name",
							editable: false,
							listeners: {
								change: function(field, newvalue, oldvalue) {
									if (newvalue)
									{
										var me = this;
										
										me.down("[name=cbdatasource]").setVisible(newvalue != "static");
										me.down("[name=lt_0]").setVisible(newvalue == "static");
										me.down("[name=lt_1]").setVisible(newvalue == "sql");
										me.down("[name=lt_2]").setVisible(newvalue == "sqljoin");
										me.down("[name=i_cset]").setVisible(newvalue != "static");
										me.down("[name=displabel_c]").setVisible(newvalue != "sqljoin");
									}
								},
								scope: this
							}
						},
						{
			    			xtype: "fieldset",
			    			title: "Static Data Values",
			    			name: "lt_0",
			    			flex: 1,
			    			hidden: true,
			    			layout: {
			    				type: "vbox",
			    				align: "stretch"
			    			},
			    			items: [
			    				{
			    					xtype: "checkbox",
			    					name: "i_cset_s",
			    					fieldLabel: "Use ColorSet",
			    					boxLabel: IRm$/*resources*/.r1("B_ENABLE"),
			    					listeners: {
			    						change: function(tobj) {
			    							var t = tobj.getValue(),
			    								grd_data = this.down("[name=grd_data]");
			    								
			    							
			    							grd_data.columns[2].setVisible(t);
			    							grd_data.columns[3].setVisible(t);
			    						},
			    						scope: this
			    					}
			    				},
			    				{
			    					xtype: "gridpanel",
			    					name: "grd_data",
			    					tbar: [
			    						{
					    					xtype: "toolbar",
					    					hidden: this.mdlgmode ? true : false,
					    					items: [
					    						{
					    							text: "Add Row",
					    							xtype: "button",
					    							handler: function() {
					    								var grd_data = this.down("[name=grd_data]");
					    								grd_data.store.add({});
					    							},
					    							scope: this
					    						},
					    						{
					    							text: "Delete Selected",
					    							xtype: "button",
					    							handler: function() {
					    								var grd_data = this.down("[name=grd_data]"),
					    									sel = grd_data.getSelectionModel().selected,
					    									i;
					    								
					    								for (i=sel.length-1; i>=0; i--)
					    								{
					    									grd_data.store.remove(sel.items[i]);
					    								}
					    							},
					    							scope: this
					    						},
					    						"-",
					    						{
					    							xtype: "button",
					    							text: "Up",
					    							handler: function() {
					    								var me = this,
					    									grd_data = me.down("[name=grd_data]");
					    									
					    								me._m2/*moveGridSelection*/(grd_data, -1);
					    							},
					    							scope: this
					    						},
					    						{
					    							xtype: "button",
					    							text: "Down",
					    							handler: function() {
					    								var me = this,
					    									grd_data = me.down("[name=grd_data]");
					    									
					    								me._m2/*moveGridSelection*/(grd_data, 1);
					    							},
					    							scope: this
					    						}
					    					]
					    				}
			    					],
			    					flex: 1,
			    					store: {
			    						xtype: "store",
			    						fields: ["code", "value", "color"]
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
			    							text: IRm$/*resources*/.r1("B_CODE"),
			    							dataIndex: "code",
			    							flex: 1,
			    							editor: {
												xtype: "textfield",
												allowBlack: true
											}
			    						},
			    						{
			    							text: IRm$/*resources*/.r1("B_TEXT"),
			    							dataIndex: "value",
			    							flex: 1,
			    							editor: {
												xtype: "textfield",
												allowBlack: false
											}
			    						},
			    						{
			    							xtype: "templatecolumn",
			    							text: IRm$/*resources*/.r1("B_COLOR"),
			    							dataIndex: "color",
			    							width: 60,
			    							hidden: true,
			    							tpl: "<div style='width: 60px; height: 20px; background-color: {color}'></div>"
			    						},
			    						{
			    							xtype: "actioncolumn",
			    							hidden: true,
			    							width: 20,
			    							items: [
			    								{
			    									iconCls: "icon-grid-config",
			    									handler: function (grid, rowIndex, colIndex) {
			    										var m = new $s.menu({
			    											items: [
			    												{
			    													xtype: "colorpicker",
			    													text: "Color",
			    													listeners: {
																		select: function(cp, color) {
																			grid.store.data.items[rowIndex].set("color", "#" + color);
																			cp.hide();
																		}
																	}
			    												}
			    											]
			    										});
			    										
			    										m.show();
			    									}
			    								}
			    							]
			    						}
			    					]
			    				}
			    			]
			    		},
			    		{
	    					xtype: "combobox",
			    			name: "cbdatasource",
			    			queryMode: "local",
			    			fieldLabel: "Data Source",
			    			displayField: "dispname",
			    			valueField: "uid",
			    			editable: false,
							autoSelect: false,
							store: {
								xtype: "store",
								fields: [
									"name", "dispname", "uid", "isuserdb", "savepwd"
								]
							},
							listeners: {
								select: function(tobj) {
									var me = this,
										nvalue = tobj.getValue(),
										p_1a = me.down("[name=p_1a]"),
										p_3 = me.down("[name=p_3]");
									
									if (p_3.getValue() == "sqljoin")
									{
										p_1a.pooluid = nvalue;
										p_1a.sK3/*loadContent*/.call(p_1a);
									}
								},
								scope: this
							}
	    				},
			    		{
			    			xtype: "fieldset",
			    			title: "SQL Data Values",
			    			name: "lt_1",
			    			minHeight: 230,
			    			flex: 1,
			    			hidden: true,
			    			layout: {
								type: "vbox",
								align: "stretch"
							},
			    			items: [
			    				{
			    					xtype: "textarea",
									name: "p_4",
			    					flex: 1
			    				}
			    			]
			    		},
			    		{
			    			xtype: "container",
			    			title: "SQL Table Join",
			    			name: "lt_2",
			    			flex: 1,
			    			hidden: true,
			    			minHeight: 600,
			    			layout: "anchor",
			    			items: [
			    				new IG$/*mainapp*/._IA8a/*codemapping_panel*/({
							    	name: "p_1a",
							    	border: 0,
							    	anchor: "100%",
							    	d_m: "cmap"
							    })
			    			]
			    		},
			    		{
			    			xtype: "combobox",
			    			fieldLabel: "Label Value",
			    			name: "displabel_c",
			    			queryMode: "local",
			    			hidden: true,
			    			editable: true,
			    			valueField: "value",
			    			displayField: "name",
			    			store: {
			    				xtype: "store",
			    				fields: [
			    					"name", "value"
			    				],
			    				data: [
			    					{name: "Mapped values", value: ""},
			    					{name: "{CODE} {VALUE}", value: "{CODE} {VALUE}"},
			    					{name: "{CODE} {SORT} {VALUE}", value: "{CODE} {SORT} {VALUE}"}
			    				]
			    			}
			    		},
			    		{
			    			xtype: "fieldset",
			    			title: "ColorSet",
			    			name: "i_cset",
			    			checkboxToggle:true,
			    			collapsed: true,
			    			height: 200,
			    			layout: "fit",
			    			items: [
			    				{
			    					xtype: "gridpanel",
			    					name: "i_cset_g",
			    					selType: "checkboxmodel",
			    					selModel: {
			    						checkSelector: ".x-grid-cell",
			    						mode: "MULTI"
			    					},
			    					store: {
			    						xtype: "store",
			    						fields: ["value", "color"]
			    					},
			    					columns: [
			    						{
			    							text: "Value",
			    							dataIndex: "value",
			    							flex: 1
			    						},
			    						{
			    							text: "Color",
			    							dataIndex: "color",
			    							flex: 1
			    						}
			    					]
			    				}
			    			]
			    		}
					]
				}
			],
			
			buttons:[
//				{
//					text: IRm$/*resources*/.r1("B_HELP"),
//					handler: function() {
//						IG$/*mainapp*/._I63/*showHelp*/("P0042");
//					},
//					scope: this
//				}, 
				"->",
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
				afterrender: function() {
					this._IFd/*init_f*/();
				}
			}
		});
		
		IG$/*mainapp*/._IMm/*codemapping*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Ic9/*multiMeasure*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	
	"layout": "fit",
	
	defaults:{
		bodyStyle:"padding:10px"
	},
	
	bodyPadding: 4,
	
	closable: false,
	resizable:false,
	
	width: 400,
	autoHeight: true,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this;
		
		if (me.callback)
		{
			var r = [],
				i,
				measureview = this.down("[name=measureview]"),
				clocation = this.down("[name=clocation]"),
				item, cobj;
			
			for (i=0; i < measureview.store.data.items.length; i++)
			{
				item = measureview.store.data.items[i];
				cobj = {
					nodepath: item.get("nodepath"),
					formula: item.get("formula"),
					type: item.get("type"),
					name: item.get("name"),
					uid: item.get("uid"),
					datatype: item.get("datatype"),
					measurename: item.get("measurename"),
					ctype: item.get("ctype"),
					clocation: item.get("clocation")
				};
				
				r.push(cobj);
			}
			
			me.callback.execute({
				items: r, 
				clocation: clocation.getValue(), 
				dialog: me, 
				vmode: me.vmode,
				tmpl: me.tmpl
			});
		}
		
		me._IG0/*closeDlgProc*/();
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1("T_M_MEASURE");
		
		$s.apply(this, {
			items: [
			    {
			    	xtype:"fieldset",
	    			title: "MultiMeasure",
	    			"layout": "anchor",
	    			bodyPadding: 4,
	    			defaults: {
	    				anchor: "100%"
	    			},
			    	items: [
			    		{
			    			xtype: "textfield",
			    			fieldLabel: "Location",
			    			hidden: this.vmode == 1,
			    			name: "clocation"
			    		},
			    		{
			    			xtype: "fieldcontainer",
			    			layout: "hbox",
			    			fieldLabel: "Measure Name",
			    			items: [
					    		{
					    			xtype: "textfield",
					    			name: "t_format",
					    			value: "[field]"
					    		},
					    		{
					    			xtype: "button",
					    			text: "Apply",
					    			handler: function() {
					    				var i,
					    					me = this,
					    					measureview = me.down("[name=measureview]"),
					    					rec,
					    					t_format = me.down("[name=t_format]").getValue(),
					    					store = measureview.getSelectionModel().selected,
					    					mname,
					    					n = t_format ? t_format.indexOf("[field]") : -1;
					    				
					    				if (n > -1)
					    				{
						    				for (i=0; i < store.length; i++)
						    				{
						    					rec = store.items[i];
						    					mname = rec.get("name");
						    					mname = t_format.substring(0, n) + mname + t_format.substring(n+"[field]".length);
						    					
						    					rec.set("measurename", mname);
						    				}
						    			}
					    			},
					    			scope: this
					    		}
					    	]
					    },
			    		{
			    			xtype: "gridpanel",
	                		name: "measureview",
	                		collapsible: false,
							stateful: true,
							columnLines: true,
							selType: "checkboxmodel",
							selModel: {
								checkSelector: ".x-grid-cell"
							},
							store: {
								fields: [
									"name", "uid", "nodepath", "type", "datatype", "measurename", "formula", "ctype", "clocation"
								]
							},
							flex: 2,
							height: 300,
							initialized: false,
							"layout": "fit",
							plugins: [
								{
									ptype: "cellediting",
									clicksToEdit: 1
								}
							],
							columns: [
							    {
							    	xtype: "gridcolumn",
									text: "Measure name",
									dataIndex: "measurename",
									flex: 3,
									editor: {
										allowBlank: false
									}
							    },
							    {
							    	xtype: "gridcolumn",
									text: "Fact name",
									dataIndex: "name",
									flex: 3,
									editor: {
										allowBlank: false
									}
							    },
							    {
							    	xtype: "gridcolumn",
							    	width: 120,
							    	text: "Measure Type",
							    	dataIndex: "formula",
							    	editor: {
										xtype: "combobox",
										queryMode: "local",
										displayField: "name",
										valueField: "value",
										editable: false,
										autoSelect: true,
										triggerAction: "all",
										selectOnTab: true,
										store: {
											xtype: "store",
											fields: ["name", "value"],
											data: [
												{name: "Distinct Count", value: "COUNT DISTINCT"},
												{name: "Count", value: "COUNT"},
												{name: "Sum", value: "SUM"},
												{name: "Average", value: "AVG"},
												{name: "Max", value: "MAX"},
												{name: "Min", value: "MIN"},
												{name: "Template", value: "TMPL"}
											]
										},
										lazyRender: true,
										listClass: "x-combo-list-small"
									}
							    }
							],
							viewConfig: {
								stripeRows: true
							},
							fbar: [
								{
									xtype: "toolbar",
									items: [
									    {
									    	xtype: "button",
									    	text: "Remove Selected",
									    	handler: function() {
									    		var me = this,
									    			measureview = me.down("[name=measureview]"),
									    			store = measureview.store,
									    			sel = measureview.getSelectionModel().selected,
									    			i;
									    		
									    		for (i=sel.length-1; i >=0; i--)
									    		{
									    			store.remove(sel.items[i]);
									    		}
									    	},
									    	scope: this
									    },
										"->",
										{
											xtype: "button",
											text: "Template",
											handler: function() {
												var me = this,
													dlg = new IG$/*mainapp*/._Ie1/*measureEditor*/({
														dmode: 1,
														cubeuid: me.pcube.uid,
														clItem: me.tmpl || new IG$/*mainapp*/.c$s18/*clMeasure*/(),
														callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(param) {
															me.tmpl = param ? param.citem : null;
															var i,
																measureview = me.down("[name=measureview]"),
																sel = measureview.getSelectionModel().selected;
															
															for (i=0; i < sel.length; i++)
															{
																sel.items[i].set("formula", "TMPL");
															}
														})
													}),
													pcube = me.pcube,
													customstyle = pcube ? pcube.customstyle : null,
													i;
												
												dlg.clItem.cubeinfo.styles = [];
												
												if (customstyle)
												{
													for (i=0; i < customstyle.length; i++)
													{
														dlg.clItem.cubeinfo.styles.push(customstyle[i]);
													}
												}
												
												dlg.clItem.expressiontype = dlg.clItem.expressiontype || "SUM([field])";
												dlg.clItem.expression = dlg.clItem.expression || "SUM([field])";
												dlg.show();
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
			
			buttons:[
//				{
//					text: IRm$/*resources*/.r1("B_HELP"),
//					handler: function() {
//						IG$/*mainapp*/._I63/*showHelp*/("P0043");
//					},
//					scope: this
//				}, 
				"->",
				{
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						this._IFf/*confirmDialog*/();
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1("B_CLOSE"),
					handler: function() {
						this.close();
					},
					scope: this
				}
			],
			
			listeners: {
				afterrender: function() {
					var measureview = this.down("[name=measureview]"),
						clocation = this.down("[name=clocation]");
					
					clocation.setValue(this.mfolder == null ? "{parent}/measures" : this.mfolder);
					
					if (this.metaitems)
					{
						measureview.store.loadData(this.metaitems);
					}
				}
			}
		});
		
		IG$/*mainapp*/._Ic9/*multiMeasure*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Ibe/*querytool*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	
	"layout": 'fit',
	
	closable: false,
	resizable:false,
	
	width: 700,
	autoHeight: true,
	autoScroll: true,
	
	callback: null,
	
	_ILa/*reportoption*/: null,
	_ILb/*sheetoption*/: null,
	uid: null,
	_IJa/*activeSheet*/: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	updateChanges: function() {
		var ctrl = this.down("[name=ctrlpool]"),
			i,
			columngrid = this.down("[name=columngrid]"),
			rec, p;
			
		this._ILb/*sheetoption*/.sqloption.dbpool = ctrl.getValue();
		ctrl = this.down("[name=sqlquery]");
		this._ILb/*sheetoption*/.sqloption.sql = ctrl.getValue();
		this._ILb/*sheetoption*/.sqloption.sqlquery = this._ILb/*sheetoption*/.sqloption.sql;
		
		this._ILb/*sheetoption*/.sqloption.columns = [];
		
		for (i=0; i < columngrid.store.data.items.length; i++)
		{
			rec = columngrid.store.data.items[i];
			p = rec.data;
			p.dataoption = {};
			p.dataoption.data = rec.get("dataoption_data");
			p.dataoption.datadelimiter = rec.get("dataoption_datadelimiter");
			p.dataoption.coldelimiter = rec.get("dataoption_coldelimiter");
			p.dataoption.valuetype = rec.get("dataoption_valuetype");
			
			this._ILb/*sheetoption*/.sqloption.columns.push(p);
		}
	},
	
	confirmDialig: function() {
		this.updateChanges();
		
		this.callback && this.callback.execute();
		
		this.close();
	},
	
	sK3/*loadPool*/: function() {
		var me = this,
			panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			promptmap, cinfo,
			columnmap,
			i;
			
		if (!this._ILb/*sheetoption*/.sqloption)
		{
			this._ILb/*sheetoption*/.sqloption = {};
		}
		
		this.down("[name=sqlquery]").setValue(this._ILb/*sheetoption*/.sqloption.sql || this._ILb/*sheetoption*/.sqloption.sqlquery || "");
		
		req.init(panel, 
			{
                ack: "25",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: ""}, "address"),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
            }, panel, panel.rs_sK3/*loadPool*/, null);
        req._l/*request*/();
	},
	
	rs_sK3/*loadPool*/: function(xdoc) {
		var i,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			ctrlpool = this.down("[name=ctrlpool]"),
			ctrlquerytype = this.down("[name=ctrlquerytype]"),
			items = [], item;
		
		for (i=0; i < tnodes.length; i++)
		{
			item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			item.select = (this._ILb/*sheetoption*/.sqloption.dbpool == item.name) ? true : false;
			if (item.name != "MECBASE") 
				items.push(item);
		}
		
		ctrlpool.store.loadData(items);
		ctrlpool.setValue(this._ILb/*sheetoption*/.sqloption.dbpool);
		ctrlquerytype.setValue("stmt");
	},
	
	sK4/*getMetaInfo*/: function() {
		var me = this,
			panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			pgrid = panel.down("[name=promptgrid]"),
			content, i;
			
		this.updateChanges();
		
		content = "<smsg><ExecuteSQL dbpool='" + panel.down("[name=ctrlpool]").getValue() + "' method='" + panel.down("[name=ctrlquerytype]").getValue() + "'>";
		content += "<SQL><![CDATA[" + panel.down("[name=sqlquery]").getValue() + "]]></SQL>";
		content += '<prompts>'
		content += '</prompts>'
		content += "</ExecuteSQL></smsg>";
		
		panel.setLoading(true);
		
		req.init(panel, 
			{
                ack: "18",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, option: "sqlcubedata"}, "uid;option;active"),
                mbody: content
            }, panel, panel.rs_sK4/*getMetaInfo*/, null);
        req._l/*request*/();
	},
	
	rs_sK4/*getMetaInfo*/: function(xdoc) {
		var me = this,
			i,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/columns"),
			tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/result"),
			cols=[], col,
			gcols = [],
			fields = [],
			data = [], row,
			results,
			columngrid = this.down("[name=columngrid]"),
			cname, delim, n;
			
		me.setLoading(false);
		
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				col = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				cols.push(col);
				
	    		fields.push("c" + i);
	    		
	    		gcols.push({
			    	xtype: "gridcolumn",
			    	flex: 1,
			    	text: col.fieldname,
			    	minWidth: 120,
			    	dataIndex: "c" + i
			    });
			}
			
			if (rnode)
			{
				delim = IG$/*mainapp*/._I1b/*XGetAttr*/(rnode, "delimiter");
				results = IG$/*mainapp*/._I24/*getTextContent*/(rnode);
				results = results.split(delim);
				
				row = {};
				
				for (i=0; i < results.length; i++)
				{
					n = i % cols.length;
					if (i > 0 && n == 0)
					{
						data.push(row);
						row = {};
						
						if (data.length > 100)
							break;
					}
					
					row["c" + n] = results[i];
				}
			}
		}
		
		var storecolumn = Ext.create("Ext.data.ArrayStore", {
			fields: fields
		})
			
		columngrid.reconfigure(storecolumn, gcols);
		columngrid.store.loadData(data);
	},
	
	sK5/*toolbarHandler*/: function(cmd) {
		switch (cmd)
		{
		case "cmd_getmeta":
			this.sK4/*getMetaInfo*/();
			break;
		}
	},
	
	initComponent : function() {
		var panel=this,
			doc = $(document);
		
		panel.maxHeight = doc.height() - 20;
		panel.title = IRm$/*resources*/.r1('I_SQLCUBE');
		
		panel.title = IRm$/*resources*/.r1('I_QRY_TOOL');
		
		var lpanel = {
	    	xtype: "panel",
	    	layout: {
				type: "vbox",
				align: "stretch"
			},
			padding: 5,

	    	tbar: [
	    		{
    				xtype: 'combobox',
    				name: "ctrlpool",
					queryMode: 'local',
					displayField: 'disp',
					valueField: 'name',
					fieldLabel: "Database Source",
					editable: false,
					autoSelect: true,
					store: {
						fields: [
							"name", "disp"
						]
					}
				},
				{
    				xtype: 'combobox',
    				name: "ctrlquerytype",
					queryMode: 'local',
					displayField: 'disp',
					valueField: 'name',
					fieldLabel: "Query Type",
					editable: false,
					autoSelect: true,
					store: {
						fields: [
							"name", "disp"
						],
						data: [
							{disp: "Statement", name: "stmt", selected: 1},
							{disp: "PreparedStatement", name: "pstmt"}
						]
					}
				}
	    	],
	    	
	    	items: [
	    		{
	    			xtype: "textarea",
	    			name: "sqlquery",
	    			fieldLabel: "SQL Query",
	    			height: 160
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
				        	text: IRm$/*resources*/.r1('L_RUN_REPORT'),
				        	width: 120,
				        	handler: function() {
				        		this.sK5/*toolbarHandler*/('cmd_getmeta'); 
				        	},
				        	scope: this
			    		},
			    		{
			    			xtype: "fieldcontainer",
			    			width: 10
			    		},
		    			{
		    				xtype: "displayfield",
		    				value: " Click button to get result",
		    				flex: 1
		    			}
			    	]
		    	},
		    	{
	    			xtype: "grid",
	    			title: "Data Results",
	    			name: "columngrid",
	    			height: 250,
	    			stateful: true,
					columnLines: true,
					store: {
						xtype: "store",
						fields: [
							"name", "fieldname", "type", "datatype", "tablename", "dataoption_data", "dataoption_valuetype", "dataoption_datadelimiter", "dataoption_coldelimiter", "uid", "mapto"
						]
					},
					initialized: false,
					"layout": 'fit',
	    			columns: [
	    			]
			    }
	    	]
	    };
	    
		Ext.apply(this, {
			defaults:{bodyStyle:'padding:0px'},
			autoScroll: true,
			
			items: [
			    lpanel
			],
			
			buttons:[
//				{
//					text: IRm$/*resources*/.r1('B_HELP'),
//					handler: function() {
//						IG$/*mainapp*/._I63/*showHelp*/('P0016');
//					},
//					scope: this
//				}, 
				"->",
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.confirmDialig();
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
			],
			
			listeners: {
				afterrender: function(ui) {
					this.sK3/*loadPool*/();
				}
			}
		});
		
		IG$/*mainapp*/._Ibe/*querytool*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Ib2/*sql_cube*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	
	"layout": 'fit',
	
	closable: false,
	resizable:true,
	
	width: 600,
	autoHeight: true,
	
	callback: null,
	
	defaults:{bodyStyle:'padding:0px'},
	autoScroll: true,
	
	L1/*confirmDialig*/: function() {
		var me = this,
			fitem = me.fitem;
		
		if (fitem)
		{
			me.fitem.dataoption = {};
			me.fitem.dataoption.data = me.down("[name=sql]").getValue();
			me.fitem.dataoption.valuetype = me.down("[name=valuetype]").getValue();
			me.fitem.dataoption.datadelimiter = me.down("[name=datadelimiter]").getValue();
			me.fitem.dataoption.coldelimiter = me.down("[name=coldelimiter]").getValue();
		}
		
		if (me.callback)
		{
			me.callback.execute(me.fitem);
		}
		
		me.close();
	},
	
	L2/*initValues*/: function() {
		var me = this,
			fitem = me.fitem;
		
		if (fitem)
		{
			fitem.dataoption = fitem.dataoption || {};
			me.down("[name=valuetype]").setValue(fitem.dataoption.valuetype || "");
			me.down("[name=datadelimiter]").setValue(fitem.dataoption.datadelimiter || "");
			me.down("[name=coldelimiter]").setValue(fitem.dataoption.coldelimiter || "");
			me.down("[name=sql]").setValue(fitem.dataoption.data || "");
		}
	},
	
	initComponent: function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1('I_SQLCUBE');
		
		me.items = [
			{
				xtype: "panel",
				layout: "fit",
				border: 0,
				items: [
				    {
				    	xtype: "form",
				    	layout: "anchor",
				    	padding: 10,
				    	border: 0,
				    	defaults: {
				    		anchor: "100%"
				    	},
				    	items: [
				    		{
				    			xtype: "displayfield",
				    			value: "Edit column for (" + me.fitem.name + ")"
				    		},
				    		{
				    			xtype: "combobox",
				    			name: "valuetype",
				    			fieldLabel: "Value type",
				    			editable: false,
				    			queryMode: "local",
				    			labelField: "label",
				    			valueField: "value",
				    			displayField: "label",
				    			store: {
				    				xtype: "store",
				    				fields: [
				    					"label", "value"
				    				],
				    				data: [
				    					{label: "SQL Query", value: "sql"},
				    					{label: "List data", value: "listdata"}
				    				]
				    			}
				    		},
				    		{
				    			xtype: "combobox",
				    			name: "datadelimiter",
				    			fieldLabel: "Delimiter",
				    			editable: false,
				    			queryMode: "local",
				    			labelField: "label",
				    			valueField: "value",
				    			displayField: "label",
				    			store: {
				    				xtype: "store",
				    				fields: [
				    					"label", "value"
				    				],
				    				data: [
				    					{label: "newline", value: "newline"},
				    					{label: "comma", value: "comma"},
				    					{label: "tab", value: "tab"}
				    				]
				    			}
				    		},
				    		{
				    			xtype: "combobox",
				    			name: "coldelimiter",
				    			fieldLabel: "Column Delimiter",
				    			editable: false,
				    			queryMode: "local",
				    			labelField: "label",
				    			valueField: "value",
				    			displayField: "label",
				    			store: {
				    				xtype: "store",
				    				fields: [
				    					"label", "value"
				    				],
				    				data: [
				    					{label: "No value field", value: ""},
				    					{label: "newline", value: "newline"},
				    					{label: "comma", value: "comma"},
				    					{label: "tab", value: "tab"}
				    				]
				    			}
				    		},
				    		{
				    			xtype: "textarea",
				    			name: "sql",
				    			height: 150,
				    			fieldLabel: "Value data"
				    		}
				    	]
				    }
				]
			}
		];
		
		me.buttons = [
			"->",
			{
				text: IRm$/*resources*/.r1('B_CONFIRM'),
				handler: function() {
					this.L1/*confirmDialig*/();
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
		];
		
		me.listeners = {
			afterrender: function(ui) {
				ui.L2/*initValues*/();
			}
		};
		
		IG$/*mainapp*/._Ib2/*sql_cube*/.superclass.initComponent.apply(this, arguments);
	}
});	





/*edit prompt option window */
IG$/*mainapp*/._Ib3/*sql_cube_prompt*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	
	"layout": 'fit',
	
	closable: false,
	resizable:true,
	
	width: 600,
	autoHeight: true,
	
	callback: null,
	
	L1/*confirmDialig*/: function() {
		var me = this;
		me.prompt.defaultvalue = me.down("[name=defaultvalue]").getValue();
		me.prompt.datatype = me.down("[name=datatype]").getValue();
		me.prompt.type = me.down("[name=prompttype]").getValue();
		me.prompt.allownullvalue = me.down("[name=allownullvalue]").getValue() ? "T" : "F";
		me.prompt.sql = me.down("[name=sql]").getValue();
		me.prompt.valuetype = me.down("[name=valuetype]").getValue();
		me.prompt.datadelimiter = me.down("[name=datadelimiter]").getValue();
		me.prompt.coldelimiter = me.down("[name=coldelimiter]").getValue();
		
		me.prompt.L2/*updatePromptEditor*/.call(me.prompt);
		
		me.record.set("defaultvalue", me.prompt.defaultvalue);
		me.record.set("datatype", me.prompt.datatype);
		me.record.set("type", me.prompt.type);
		me.record.set("allownullvalue", me.prompt.allownullvalue);
		me.record.set("valuetype", me.prompt.valuetype);
		me.record.set("datadelimiter", me.prompt.datadelimiter);
		me.record.set("coldelimiter", me.prompt.coldelimiter);
		
		me.close();
	},
	
	L2/*initValues*/: function() {
		var me = this;
		
		if (me.prompt)
		{
			me.down("[name=defaultvalue]").setValue(me.prompt.defaultvalue || "");
			me.down("[name=datatype]").setValue(me.prompt.datatype || "string");
			me.down("[name=prompttype]").setValue(me.prompt.type || "textinput");
			me.down("[name=valuetype]").setValue(me.prompt.valuetype || "listdata");
			me.down("[name=datadelimiter]").setValue(me.prompt.datadelimiter || "newline");
			// me.down("[name=coldelimiter]").setValue(me.prompt.coldelimiter || "");
			me.down("[name=allownullvalue]").setValue(me.prompt.allownullvalue == "T" ? true : false);
			me.down("[name=sql]").setValue(me.prompt.sql || "");
		}
	},
	
	initComponent: function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1('I_SQLCUBE');
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:0px'},
			autoScroll: true,
			
			items: [
				{
					xtype: "panel",
					border: 0,
					layout: "fit",
					items: [
					    {
					    	xtype: "form",
					    	layout: "anchor",
					    	padding: 10,
					    	plain: true,
					    	border: 0,
					    	defaults: {
					    		anchor: "100%"
					    	},
					    	items: [
					    		{
					    			xtype: "displayfield",
					    			value: "Edit prompt for (" + me.prompt.name + ")"
					    		},
					    		{
					    			xtype: "textfield",
					    			name: "defaultvalue",
					    			fieldLabel: "Default value"
					    		},
					    		{
					    			xtype: "combobox",
					    			name: "datatype",
					    			fieldLabel: "Data type",
					    			editable: false,
					    			queryMode: "local",
					    			labelField: "label",
					    			valueField: "value",
					    			displayField: "label",
					    			store: {
					    				xtype: "store",
					    				fields: [
					    					"label", "value"
					    				],
					    				data: [
					    					{label: "Numeric", value: "numeric"},
					    					{label: "string", value: "string"}
					    				]
					    			}
					    		},
					    		{
					    			xtype: "combobox",
					    			name: "prompttype",
					    			fieldLabel: "Prompt type",
					    			editable: false,
					    			queryMode: "local",
					    			labelField: "label",
					    			valueField: "value",
					    			displayField: "label",
					    			store: {
					    				xtype: "store",
					    				fields: [
					    					"label", "value"
					    				],
					    				data: [
					    					{label: "Textinput", value: "textinput"},
					    					{label: "Selection", value: "selection"},
					    					{label: "Combobox", value: "combobox"}
					    				]
					    			}
					    		},
					    		{
					    			xtype: "combobox",
					    			name: "valuetype",
					    			fieldLabel: "Value type",
					    			editable: false,
					    			queryMode: "local",
					    			labelField: "label",
					    			valueField: "value",
					    			displayField: "label",
					    			store: {
					    				xtype: "store",
					    				fields: [
					    					"label", "value"
					    				],
					    				data: [
					    					{label: "SQL Query", value: "sql"},
					    					{label: "List data", value: "listdata"}
					    				]
					    			}
					    		},
					    		{
					    			xtype: "combobox",
					    			name: "datadelimiter",
					    			fieldLabel: "Delimiter",
					    			editable: false,
					    			queryMode: "local",
					    			labelField: "label",
					    			valueField: "value",
					    			displayField: "label",
					    			store: {
					    				xtype: "store",
					    				fields: [
					    					"label", "value"
					    				],
					    				data: [
					    					{label: "newline", value: "newline"},
					    					{label: "comma", value: "comma"},
					    					{label: "tab", value: "tab"}
					    				]
					    			}
					    		},
					    		{
					    			xtype: "checkbox",
					    			name: "allownullvalue",
					    			fieldLabel: "Allow null"
					    		},
					    		{
					    			xtype: "textarea",
					    			name: "sql",
					    			height: 150,
					    			fieldLabel: "Value data"
					    		}
					    	]
					    }
					]
				}
			],
			
			buttons:[
				"->",
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.L1/*confirmDialig*/();
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
			],
			
			listeners: {
				afterrender: function(ui) {
					ui.L2/*initValues*/();
				}
			}
		});
		
		IG$/*mainapp*/._Ib3/*sql_cube_prompt*/.superclass.initComponent.apply(this, arguments);
	}
});	


IG$/*mainapp*/._g5/*columnEditor*/ = $s.extend($s.window, {
	modal: true,
	region: "center",
	xtype: "window",
	
	"layout": "fit",
	
	closable: false,
	resizable:true,
	
	width: 520,
	height: 400,
	
	_c1/*commit*/: function() {
		var me = this,
			i,
			feditor = me.down("[name=feditor]"),
			rec,
			rn;
			
		for (i=0; i < feditor.store.data.items.length; i++)
		{
			rec = feditor.store.data.items[i];
			rn = rec.get("rownum");
			me.fields[rn].col = rec.get("col");
			me.fields[rn].syntax = rec.get("syntax");
			me.fields[rn].alias = rec.get("alias");
			me.fields[rn].seq = rec.get("seq");
		}
		
		me.callback && me.callback.execute();
		
		me.close();
	},
	
	_c2/*init*/: function() {
		var me = this,
			feditor = me.down("[name=feditor]"),
			i;
		
		if (me.fields)
		{
			for (i=0; i < me.fields.length; i++)
			{
				me.fields[i].rownum = i;
			}
			feditor.store.loadData(me.fields);
		}
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("I_SQLCUBE_CW");
		
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
							xtype: "displayfield",
							value: IRm$/*resources*/.r1("I_SQLCUBE_CMSG")
						},
						{
							xtype: "gridpanel",
							name: "feditor",
							flex: 1,
							
							store: {
								xtype: "store",
								fields: [
									"row", "col", "seq", "syntax", "alias", "rownum"
								]
							},
							plugins: [
								{
									ptype: "cellediting",
									clicksToEdit: 1
								}
							],
							selType: "checkboxmodel",
							selModel: {
								checkSelector: ".x-grid-cell",
								mode: "MULTI"
							},
							
							tbar: [
								{
									xtype: "button",
									text: "Remove Selected",
									handler: function() {
										var me = this,
											feditor = me.down("[name=feditor]"),
											sel = feditor.getSelectionModel().selected,
											i,
											rec,
											rn;
											
										for (i=sel.length-1; i>=0; i--)
										{
											rec = sel.items[i];
											rn = rec.get("rownum");
											me.fields[rn].removed = true;
											
											feditor.store.remove(rec);
										}
									},
									scope: this
								}
							],
							columns: [
								{
									text: "Row",
									dataIndex: "row",
									width: 80
								},
								{
									text: "Type",
									dataIndex: "col",
									width: 100,
									editor: {
										xtype: "combobox",
										queryMode: "local",
										displayField: "name",
										valueField: "value",
										allowBlank: false,
										editable: false,
										autoSelect: true,
										selectOnTab: true,
										triggerAction: "all",
										store: {
											xtype: "store",
											fields: [
												"name", "value"
											],
											data: [
												{name: "Column", value: "@COL"},
												{name: "Aggregated", value: "@AGG"}
											]
										},
										lazyRender: true
									}
								},
								{
									text: "Block No",
									dataIndex: "seq",
									editor: {
										xtype: "numberfield",
										minValue: 0,
										maxValue: 10,
										allowBlank: false
									}
								},
								{
									text: "Syntax",
									dataIndex: "syntax",
									minWidth: 120,
									editor: {
										allowBlank: false
									}
								},
								{
									text: "Alias",
									dataIndex: "alias",
									minWidth: 120,
									editor: {
										allowBlank: false
									}
								}
							]
						}
					]
				}
			],
			buttons: [
				{
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						var me = this;
						me._c1/*commit*/();
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1("B_CLOSE"),
					handler: function() {
						this.close();
					},
					scope: this
				}
			]
		});
		IG$/*mainapp*/._g5/*columnEditor*/.superclass.initComponent.apply(this, arguments);
	},
	
	listeners: {
		afterrender: function(tobj) {
			this._c2/*init*/();
		}
	}
});

IG$/*mainapp*/._Ib1/*sqlcube_wizard*/ = $s.extend($s.window, {
	
	modal: true,
	region: "center",
	
	"layout": "fit",
	
	closable: false,
	resizable:true,
	
	width: 650,
	height: 500,
	autoScroll: false,
	
	callback: null,
	
	_ILa/*reportoption*/: null,
	_ILb/*sheetoption*/: null,
	uid: null,
	_IJa/*activeSheet*/: null,
	
	defaults:{
		bodyStyle:"padding:0px"
	},
	bodyPadding: 0,
	plain: true,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	updateChanges: function() {
		var me = this,
			ctrl = me.down("[name=ctrlpool]"),
			i,
			columngrid = me.down("[name=columngrid]"),
			promptgrid = me.down("[name=promptgrid]"),
			promptmap = me.promptmap,
			viewname = me.down("[name=viewname]"),
			rec, p,
			pname,
			colmap = {};
			
		me._ILb/*sheetoption*/.sqloption.dbpool = ctrl.getValue();
		ctrl = me.down("[name=sqlquery]");
		me._ILb/*sheetoption*/.sqloption.sql = ctrl.getValue();
		me._ILb/*sheetoption*/.sqloption.sqlquery = me._ILb/*sheetoption*/.sqloption.sql;
		me._ILb/*sheetoption*/.viewname = viewname.getValue();
		
		if (me.wmode == "inlineview" && !me._ILb/*sheetoption*/.viewname)
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Check view name to continue!", null, null, 1, "alert");
			return false;
		}
		
		me._ILb/*sheetoption*/.sqloption.columns = [];
		
		if (me.columns)
		{	
			for (i=0; i < me.columns.length; i++)
			{
				colmap[me.columns[i].name] = me.columns[i];
			}
		}
		
		for (i=0; i < columngrid.store.data.items.length; i++)
		{
			rec = columngrid.store.data.items[i];
			p = rec.data;
			if (p.mapto == "-" && p.uid)
			{
				p.uid = null;
			}
			else if (p.mapto && colmap[p.mapto])
			{
				p.uid = colmap[p.mapto].uid;
			}
			p.dataoption = {};
			p.dataoption.data = rec.get("dataoption_data");
			p.dataoption.datadelimiter = rec.get("dataoption_datadelimiter");
			p.dataoption.coldelimiter = rec.get("dataoption_coldelimiter");
			p.dataoption.valuetype = rec.get("dataoption_valuetype");
			
			me._ILb/*sheetoption*/.sqloption.columns.push(p);
		}
		
		me._ILb/*sheetoption*/.sqloption.prompts = [];
		
		for (i=0; i < promptgrid.store.data.items.length; i++)
		{
			pname = promptgrid.store.data.items[i].get("name");
			
			if (promptmap[pname])
			{
				me._ILb/*sheetoption*/.sqloption.prompts.push(promptmap[pname]);
			}
		}
		
		return true;
	},
	
	_c/*confirmDialog*/: function() {
		this._m2/*toolbarHandler*/("c_getcols", 1); 
	},
	
	_m3/*loadPool*/: function() {
		var me = this,
			panel = me,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			columngrid = me.down("[name=columngrid]"),
			promptgrid = me.down("[name=promptgrid]"),
			promptmap, cinfo,
			columnmap,
			cnames = [],
			i,
			cdata = [],
			pdata = [],
			citem;
			
		columnmap = me.columnmap = {};
		promptmap = me.promptmap = {};
		
		if (panel.columns)
		{
			cnames.push({
				fieldname: "",
				name: "-",
				uid: ""
			});
			
			for (i=0; i < panel.columns.length; i++)
			{
				cnames.push(panel.columns[i]);
			}
			panel.maptocombo.store.loadData(cnames);
		}
		
		if (!me._ILb/*sheetoption*/.sqloption)
		{
			me._ILb/*sheetoption*/.sqloption = {};
		}
		
		me.down("[name=viewname]").setValue(me._ILb/*sheetoption*/.viewname || "");
		me.down("[name=sqlquery]").setValue(me._ILb/*sheetoption*/.sqloption.sql || me._ILb/*sheetoption*/.sqloption.sqlquery || "");
				
		if (me._ILb/*sheetoption*/.sqloption.columns)
		{
			for (i=0; i < me._ILb/*sheetoption*/.sqloption.columns.length; i++)
			{
				citem = {};
				cinfo = me._ILb/*sheetoption*/.sqloption.columns[i];
				me._ILb/*sheetoption*/.sqloption.columns[i].type = me._ILb/*sheetoption*/.sqloption.columns[i].type || me._ILb/*sheetoption*/.sqloption.columns[i].itemtype;
				IG$/*mainapp*/._I1d/*CopyObject*/(cinfo, citem, "uid;fieldname;sqlfield;name;type;datatype;size;tablename;alias");
				citem.dataoption_data = (cinfo.dataoption ? cinfo.dataoption.data : "");
				citem.dataoption_valuetype = (cinfo.dataoption ? cinfo.dataoption.valuetype : "");
				citem.dataoption_datadelimiter = (cinfo.dataoption ? cinfo.dataoption.datadelimiter : "");
				citem.dataoption_coldelimiter = (cinfo.dataoption ? cinfo.dataoption.coldelimiter : "");
				columnmap[citem.name] = citem;
				cdata.push(citem);
			}
			columngrid.store.loadData(cdata);
		}
		
		if (me._ILb/*sheetoption*/.sqloption.prompts)
		{
			for (i=0; i < me._ILb/*sheetoption*/.sqloption.prompts.length; i++)
			{
				var citem = {};
				IG$/*mainapp*/._I1d/*CopyObject*/(me._ILb/*sheetoption*/.sqloption.prompts[i], citem, "name;type;datatype;defaultvalue;allownullvalue;datadelimiter;coldelimiter;valuetype");
				promptmap[citem.name] = me._ILb/*sheetoption*/.sqloption.prompts[i];
				pdata.push(citem);
			}
			promptgrid.store.loadData(pdata);
		}
    		
		req.init(panel, 
			{
                ack: "25",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: ""}, "address"),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
            }, panel, panel.rs__m3/*loadPool*/, null);
        req._l/*request*/();
	},
	
	rs__m3/*loadPool*/: function(xdoc) {
		var me = this,
			i,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			ctrlpool = me.down("[name=ctrlpool]"),
			items = [], item;
		
		for (i=0; i < tnodes.length; i++)
		{
			item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			item.select = (me._ILb/*sheetoption*/.sqloption.dbpool == item.name) ? true : false;
			if (item.name != "IGCBASE") 
				items.push(item);
		}
		
		ctrlpool.store.loadData(items);
		ctrlpool.setValue(me._ILb/*sheetoption*/.sqloption.dbpool);
	},
	
	_g0/*tokenize*/: function(m, tok) {
		var r = [],
			s,
			i;
		
		for (i=0; i < m.length; i++)
		{
			if (tok && m[i] == tok)
			{
				if (s)
				{
					s.t = m[i];
					r.push(s);
					s = null;
				}
			}
			else if (!tok && (m[i] == "\n" || m[i] == " "))
			{
				if (s)
				{
					s.t = m[i];
					r.push(s);
					s = null;
				}
			}
			else
			{
				s = s || {s: "", t: null};
				s.s += m[i];
			}
		}
		
		if (s)
		{
			s.t = s.t || "";
			r.push(s);
		}
		
		return r;
	},
	
	_g1/*getFieldInfo*/: function() {
		var me = this,
			sqlquery = me.down("[name=sqlquery]"),
			nsql = sqlquery.getValue(),
			psql = [],
			_q,
			fields = [],
			iserror = false,
			i = 0, j, l, line,
			pval,
			seq = 0,
			lseq = -1,
			r,
			sindex = -1, tindex = -1;
			
		if (nsql)
		{
			nsql = me._g0/*tokenize*/(nsql);
			
			while (i < nsql.length)
			{
				pval = nsql[i].s.toUpperCase();
				
				if (pval.substring(0, 4) == "@COL" || pval.substring(0, 4) == "@AGG")
				{
					iserror = true;
					IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("E_SQL_P1"), null, null, 1, "error");
					break;
				}
				
				switch (pval)
				{
				case "SELECT":
					psql.push(nsql[i]);
					sindex = i+1;
					break;
				case "FROM":
					tindex = i-1;
					if (sindex > -1)
					{
						r = me._g2/*parseSelectClause*/(seq, nsql, psql, sindex, tindex, fields);
						if (r == false)
						{
							iserror == true;
							for (j=sindex; j < tindex; j++)
							{
								psql.push(nsql[i]);
							}
						}
						else
						{
							psql.push({s: "\n\t{COLUMNS," + seq +"}", t: "\n"});
							lseq = seq;
							seq++;
						}
					}
					tindex = -1; sindex = -1;
					psql.push(nsql[i]);
					break;
				case "GROUP":
					if (nsql[i+1] && nsql[i+1].s.toUpperCase() == "BY" && lseq > -1)
					{
						psql.push({s: "\n\t{GROUPBY_COLUMNS," + lseq + "}", t: "\n"});
						i++;
					}
					break;
				default:
					if (sindex == -1)
					{
						psql.push(nsql[i]);
					}
					break;
				}
				
				i++;
			}
		}
		else
		{
			iserror = true;
		}
		
		if (iserror == false)
		{
			_q = "";
			for (i=0; i < fields.length; i++)
			{
				_q += fields[i] + "\n";
			}
			_q += "\n";
			_q += me._g3/*join*/(psql);
			sqlquery.setValue(_q);
		}
	},
	
	_g2/*parseSelectClause*/: function(seq, nsql, psql, sindex, tindex, fields) {
		var me = this,
			i,
			pval,
			f = "",
			delim = "@^",
			fvar,
			mval = [],
			mtype,
			inblock = false,
			c, finfo,
			r = true;
		
		for (i=sindex; i < tindex + 1; i++)
		{
			pval = nsql[i];
			f += pval.s + pval.t;
		}
		
		fvar = f.split(",");
		
		for (i=0; i < fvar.length; i++)
		{
			if (fvar[i].indexOf("(") > -1 && fvar[i].indexOf(")") > -1)
			{
				mval.push(fvar[i]);
				inblock = false;
			}
			else if (fvar[i].indexOf("(") > -1)
			{
				inblock = true;
				mval.push(fvar[i]);
			}
			else if (fvar[i].indexOf(")") > -1)
			{
				mval[mval.length - 1] = mval[mval.length-1] + fvar[i];
			}
			else
			{
				if (inblock)
				{
					mval[mval.length-1] = mval[mval.length-1] + fvar[i];
				}
				else
				{
					mval.push(fvar[i]);
				}
			}
		}
		
		for (i=0; i < mval.length; i++)
		{
			finfo = me._g5/*parseField*/(mval[i], i);
			mtype = finfo.aggregate ? "AGG" : "COL";
			
			c = "@" + mtype + delim + seq;
			c += delim + finfo.field + delim + finfo.alias;
			fields.push(c);
		}
		
		return r;
	},
	
	
	
	_g3/*join*/: function(m) {
		var r = [],
			i;
			
		for (i=0; i < m.length; i++)
		{
			r.push(m[i].s + m[i].t);
		}
		
		return r.join("");
	},
	
	_g4/*showColumnEditor*/: function() {
		var me = this,
			sqlquery = me.down("[name=sqlquery]"),
			nsql = sqlquery.getValue(),
			fields = [],
			f,
			i = 0,
			delim = "@^",
			n, pval, pcol,
			pop;
			
		if (nsql)
		{
			nsql = me._g0/*tokenize*/(nsql, "\n");
			
			while (i < nsql.length)
			{
				pval = nsql[i].s.toUpperCase();
				
				if (pval.substring(0, 4) == "@COL" || pval.substring(0, 4) == "@AGG")
				{
					pcol = nsql[i];
					pcol.row = i;
					pcol.cols = nsql[i].s.split(delim);
					fields.push({
						row: i,
						col: pcol.cols[0],
						seq: pcol.cols[1],
						syntax: pcol.cols[2],
						alias: pcol.cols[3]
					});
				}
				
				i++;
			}
			
			if (fields.length > 0)
			{
				pop = new IG$/*mainapp*/._g5/*columnEditor*/({
					fields: fields,
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
						var i,
							r,
							nval;
						for (i=0; i < fields.length; i++)
						{
							r = fields[i];
							nsql[r.row].s = r.col + delim 
								+ r.seq + delim 
								+ r.syntax + delim 
								+ r.alias;
						}
						
						for (i=fields.length-1; i>=0; i--)
						{
							r = fields[i];
							if (r.removed)
							{
								nsql.splice(r.row, 1);
							}
						}
						
						nval = this._g3/*join*/(nsql);
						sqlquery.setValue(nval);
					})
				});
				
				IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
			}
			else
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("E_SQL_P0"), null, null, 1, "error");
			}
		}
	},
	
	_g5/*parseField*/: function(f, seq) {
		f = f.split("\n").join("");
		f = IG$/*mainapp*/.trim12(f);
		
		var m = f.toUpperCase(),
			r = {
				aggregate: false,
				field: null,
				alias: null
			},
			m_p,
			n, i;
		
		if (/(SUM|MIN|MAX|AVG)/.test(m))
		{
			r.aggregate = true;
		}
		
		n = m.indexOf(" AS ");
		
		if (n < 0 && m.lastIndexOf(" ") > -1)
		{
			m_p = [];
			
			m_p.push(m.substring(0, m.lastIndexOf(" ")));
			m_p.push(m.substring(m.lastIndexOf(" ") + 1));
			
			m_p[0] = IG$/*mainapp*/.trim12(m_p[0]);
			m_p[1] = IG$/*mainapp*/.trim12(m_p[1]);
			
			if ((m_p[1].indexOf(" ") == -1 || (m_p[1].charAt(0) == "'" && m_p[1].charAt(m_p[1].length-1) == "'")))
			{
				r.field = m_p[0];
				r.alias = m_p[1];
			}
		}
		
		if (!r.field)
		{
			if (n > -1)
			{
				r.field = f.substring(0, n);
				r.alias = f.substring(n + " AS ".length);
			}
			else
			{
				if (r.aggregate)
				{
					r.field = f;
					r.alias = "column_" + seq;
				}
				else if (f.indexOf("(") < 0 && f.indexOf(" ") < 0)
				{
					r.field = f;
					r.alias = f;
				}
				else
				{
					r.field = f;
					r.alias = "column_" + seq;
				}
			}
		}
		
		r.field = IG$/*mainapp*/.trim12(r.field);
		r.alias = IG$/*mainapp*/.trim12(r.alias);
		
		return r;
	},
	
	_m1/*getMetaInfo*/: function(bclose) {
		var me = this,
			panel = me,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			pgrid = panel.down("[name=promptgrid]"),
			content, i,
			r;
			
		r = this.updateChanges();
		
		if (r == false)
			return;
		
		if (me.wmode == "sqlcube" || me.wmode == "inlineview")
		{
			content = "<smsg><ExecuteSQL dbpool='" + panel.down("[name=ctrlpool]").getValue() + "'>";
			content += "<SQL><![CDATA[" + panel.down("[name=sqlquery]").getValue() + "]]></SQL>";
			content += "<prompts>"
			for (i=0; i < me._ILb/*sheetoption*/.sqloption.prompts.length; i++)
			{
				content += me._ILb/*sheetoption*/.sqloption.prompts[i].L1/*getXML*/();
			}
			content += "</prompts>"
			content += "</ExecuteSQL></smsg>";
			
			req.init(panel, 
				{
	                ack: "18",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, option: "sqlcubemeta"}, "uid;option;active"),
	                mbody: content
	            }, panel, panel.rs__m1/*getMetaInfo*/, null, {bclose: bclose});
	        req._l/*request*/();
		}
		else
		{
			content = this._ILa/*reportoption*/._IJ1/*getCurrentPivot*/();
			
			req.init(panel, 
				{
	                ack: "18",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, option: "metainfo", active: this._IJa/*activeSheet*/}, "uid;option;active"),
	                mbody: content
	            }, panel, panel.rs__m1/*getMetaInfo*/, null, {bclose: bclose});
	        req._l/*request*/();

		}
	},
	
	rs__m1/*getMetaInfo*/: function(xdoc, opt) {
		var me = this,
			i,
			bclose = opt ? opt.bclose : false,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/columns"),
			tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			cols=[], col,
			prompts = [], prompt,
			columngrid = me.down("[name=columngrid]"),
			promptgrid = me.down("[name=promptgrid]"),
			promptmap = me.promptmap,
			columnmap = me.columnmap,
			colmap = {},
			cname;
		
		if (me.columns)
		{	
			for (i=0; i < me.columns.length; i++)
			{
				colmap[me.columns[i].fieldname] = me.columns[i];
			}
		}
				
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				col = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				col.fieldinfo = col.uid;
				col.uid = null;
				col.name = col.alias || col.fieldname;
				// col.name = col.name.replace(/\(/g, "");
				// col.name = col.name.replace(/\)/g, "");
				// col.name = col.name.replace(/\//g, "");
				// col.fieldname = col.fieldinfo;
				col.sqlfield = col.name;
				if (!col.name)
				{
					col.name = "column_" + (i+1);
				}
				
				cname = col.fieldname; // "column_" + (i+1);
				
				if (colmap[cname])
				{
					col.mapto = colmap[cname].name;
					col.uid = colmap[cname].uid;
					col.name = colmap[cname].name;
				}

				// col.type = IG$/*mainapp*/._I34/*isNumericType*/(col.datatype) == true ? "Measure" : "Metric";
				col.type = "Metric";
				
				if (columnmap && columnmap[col.name])
				{
					col.dataoption_data = columnmap[col.name].dataoption_data;
					col.dataoption_datadelimiter = columnmap[col.name].dataoption_datadelimiter;
					col.dataoption_coldelimiter = columnmap[col.name].dataoption_coldelimiter;
					col.dataoption_valuetype = columnmap[col.name].dataoption_valuetype;
				}
				
				cols.push(col);
			}
		}
		
		columngrid.store.loadData(cols);
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/prompts");
		tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null);
		
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				prompt = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				if (!promptmap[prompt.name])
				{
					var p = new IG$/*mainapp*/._Ib4/*prompt*/(null);
					p.name = prompt.name;
					promptmap[p.name] = p;
					prompts.push(prompt);
				}
				else
				{
					var p = promptmap[prompt.name];
					prompts.push({
						name: p.name,
						datatype: p.datatype,
						type: p.type,
						allownullvalue: p.allownullvalue,
						defaultvalue: p.defaultvalue,
						datadelimiter: p.datadelimiter,
						coldelimiter: p.coldelimiter,
						valuetype: p.valuetype
					});
				}
			}
		}
		
		promptgrid.store.loadData(prompts);
		
		if (bclose)
		{
			me.callback && me.callback.execute(me);
			me.close();
		}
		else
		{
			me.m8/*navTo*/(1);
		}
	},
	
	_m2/*toolbarHandler*/: function(cmd, bclose) {
		var me = this;
		
		switch (cmd)
		{
		case "c_getcols":
			me._m1/*getMetaInfo*/(bclose);
			break;
		case "cmd_field":
			me._g1/*getFieldInfo*/();
			break;
		case "cmd_col_editor":
			me._g4/*showColumnEditor*/();
			break;
		}
	},
	
	
	m1$20/*editPrompt*/: function(record) {
		var pname = record.get("name"),
			promptmap = this.promptmap,
			dlg;
			
		if (promptmap[pname])
		{
			dlg = new IG$/*mainapp*/._Ib3/*sql_cube_prompt*/({
				prompt: promptmap[pname],
				record: record
			});
			
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
		}
	},
	
	_i2/*editColumnOption*/: function(record) {
		var pname = record.get("name")
			dlg = new IG$/*mainapp*/._Ib2/*sql_cube*/({
				record: record
			});
		
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	},
	
	m8/*navTo*/: function(index) {
		var me = this,
			p = me.down("[name=mainpanel]"),
			l = p.getLayout();
			
		l.setActiveItem(index);
	},
	
	initComponent : function() {
		var panel=this,
			doc = $(document);
		
		panel.height = Math.min(panel.height, doc.height() - 20);
		panel.title = IRm$/*resources*/.r1("I_SQLCUBE");
		
		var copt = {
				xtype: "combobox",
				name: "maptocombo",
				queryMode: "local",
				displayField: "name",
				labelField: "name",
				valueField: "name",
				editable: false,
				autoSelect: true,
				triggerAction: "all",
				selectOnTab: true,
				hidden: false,
				store: {
					xtype: "store",
					fields: [
						"name", "uid"
					],
					data: [
						
					]
				},
				lazyRender: true,
				listClass: "x-combo-list-small"
			},
			maptocombo = $s.create($s.combobox, copt);
		
		panel.maptocombo = maptocombo;
		
		$s.apply(this, {
			items: [
				{
			    	xtype: "panel",
			    	name: "mainpanel",
			    	layout: "card",
					flex: 1,
					autoScroll: false,
			    	items: [
			    		{
			    			xtype: "panel",
			    			border: 0,
			    			layout: {
			    				type: "vbox",
			    				align: "stretch"
			    			},
			    			items: [
			    				{
				    				xtype: "combobox",
				    				name: "ctrlpool",
									queryMode: "local",
									hidden: (this.wmode == "inlineview" ? true : false),
									displayField: "disp",
									valueField: "name",
									fieldLabel: "Database Source",
									editable: false,
									autoSelect: true,
									store: {
										fields: [
											"name", "disp"
										]
									}
								},
								{
									xtype: "textfield",
									fieldLabel: "View name",
									name: "viewname",
									hidden: (this.wmode == "inlineview" ? false : true)
								},
					    		{
					    			xtype: "textarea",
					    			name: "sqlquery",
					    			fieldLabel: "SQL Query",
					    			height: 340
					    		},
					    		{
					    			xtype: "fieldcontainer",
					    			fieldLabel: "Query Tools",
					    			layout: {
					    				type: "hbox"
					    			},
					    			hidden: (this.wmode == "inlineview" ? true : false),
					    			items: [
					    				{
						    				xtype: "button",
						    				text: "Field Extract",
						    				handler: function() {
						    					this._m2/*toolbarHandler*/("cmd_field"); 
						    				},
						    				scope: this
						    			},
						    			{
						    				xtype: "container",
						    				width: 5
						    			},
						    			{
						    				xtype: "button",
						    				text: "Column Editor",
						    				handler: function() {
						    					this._m2/*toolbarHandler*/("cmd_col_editor"); 
						    				},
						    				scope: this
						    			}
					    			]
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
								        	text: IRm$/*resources*/.r1("L_RUN_REPORT"),
								        	width: 120,
								        	handler: function() {
								        		this._m2/*toolbarHandler*/("c_getcols"); 
								        	},
								        	scope: this
							    		},
							    		{
							    			xtype: "fieldcontainer",
							    			width: 10
							    		},
						    			{
						    				xtype: "displayfield",
						    				value: " Click button to query database or skip to view column."
						    			},
						    			{
						    				xtype: "fieldcontainer",
						    				width: 60
						    			},
						    			{
						    				xtype: "button",
						    				text: "View Column Mapping",
						    				handler: function() {
						    					this.m8/*navTo*/(1);
						    				},
						    				scope: this
						    			}
							    	]
						    	}
						    ]
						},
				    	{
				    		xtype: "panel",
				    		// title: "Result",
				    		border: 0,
				    		layout: {
				    			type: "vbox",
				    			align: "stretch"
				    		},
				    		items: [
				    			{
					    			xtype: "grid",
					    			name: "columngrid",
									columnLines: true,
									flex: 1,
									selType: "checkboxmodel",
									selModel: {
										checkSelector: ".x-grid-cell"
									},
									store: {
										xtype: "store",
										fields: [
											"name", "fieldname", "sqlfield", "type", "datatype", "tablename", "dataoption_data", "dataoption_valuetype", "dataoption_datadelimiter", "dataoption_coldelimiter", "uid", "mapto", "alias"
										]
									},
									initialized: false,
									"layout": "fit",
									plugins: [
										{
											ptype: "cellediting",
											clicksToEdit: 1
										}
									],
									viewConfig: {
										plugins: [
											{
												ptype: "gridviewdragdrop",
												dragText: "Drag and drop to filter area",
												enableDrop: false,
												enableDrag: true,
												ddGroup: "_I$RD_G_"
											}
										]
									},
					    			columns: [
					    				{
											text: "Metric Name",
											dataIndex: "name",
											flex: 1,
											editor: {
												allowBlank: false
											}
					    				},
					    				{
											text: "Column Name",
											dataIndex: "fieldname",
											flex: 1,
											editor: {
												allowBlank: false
											}
					    				},
					    				{
											text: "Alias Name",
											dataIndex: "alias",
											flex: 1,
											editor: {
												allowBlank: false
											}
					    				},
					    				{
											text: "Data Type",
											dataIndex: "datatype",
											width: 60
					    				},
					    				{
			    			    	    	text: "Map to",
			    			    	    	dataIndex: "mapto",
			    			    	    	editor: maptocombo,
			    			    	    	hidden: (this.wmode != "sqlcube")
			    			    	    },
			    			    	    {
			    			    	    	text: "UID",
			    			    	    	dataIndex: "uid",
			    			    	    	hidden: true
			    			    	    },
					    				{
					    					xtype: "actioncolumn",
					    					width: 40,
											items: [
												{
													// icon: "./images/gears.gif",
													iconCls: "icon-grid-config",
													tooltip: IRm$/*resources*/.r1("L_EDIT"),
													handler: function (grid, rowIndex, colIndex) {
														var grd = this.down("[name=columngrid]"),
															store = grd.store,
															rec = store.getAt(rowIndex);
														this._i2/*editColumnOption*/(rec);
													},
													scope: this
											    }
											]
					    				}
					    			]
					    		},
					    		{
					    			xtype: "grid",
					    			title: "Prompts",
					    			name: "promptgrid",
					    			stateful: true,
									columnLines: true,
									hidden: true,
									selType: "checkboxmodel",
									selModel: {
										checkSelector: ".x-grid-cell"
									},
									store: {
										xtype: "store",
										fields: [
											"name", "defaultvalue", "type", "datatype", "allownullvalue", "valuetype", "datadelimiter", "coldelimiter"
										]
									},
									initialized: false,
									"layout": "fit",
									plugins: [
										{
											ptype: "cellediting",
											clicksToEdit: 1
										}
									],
					    			columns: [
					    				{
											text: "Name",
											dataIndex: "name",
											flex: 1,
											editor: {
												allowBlank: false
											}
					    				},
					    				{
											text: "Default value",
											dataIndex: "defaultvalue",
											flex: 1
					    				},
					    				{
											text: "Data Type",
											dataIndex: "datatype",
											width: 60
					    				},
					    				{
											text: "Value Type",
											dataIndex: "type",
											width: 60
					    				},
					    				{
					    					xtype: "actioncolumn",
					    					width: 50,
											items: [
												{
													// icon: "./images/delete.png",
													iconCls: "icon-grid-delete",
													tooltip: "Delete item",
													handler: function (grid, rowIndex, colIndex) {
														var grd = this.down("[name=promptgrid]"),
															rec = grd.store.getAt(rowIndex),
															pname = rec.get("name");
														
														if (this.promptmap[pname])
														{
															delete this.promptmap[pname];
														}
														grd.store.removeAt(rowIndex);
													},
													scope: this
												},
												{
													// icon: "./images/gears.gif",
													iconCls: "icon-grid-config",
													tooltip: IRm$/*resources*/.r1("L_EDIT"),
													handler: function (grid, rowIndex, colIndex) {
														var grd = this.down("[name=promptgrid]"),
															store = grd.store,
															rec = store.getAt(rowIndex);
														this.m1$20/*editPrompt*/(rec);
													},
													scope: this
											    }
											]
					    				}
					    			]
					    		},
					    		{
					    			xtype: "fieldcontainer",
					    			layout: {
					    				type: "hbox",
					    				align: "stretch"
					    			},
						    		items: [
						    			{
						    				xtype: "displayfield",
						    				value: " Click button to view query"
						    			},
						    			{
						    				xtype: "fieldcontainer",
						    				width: 250
						    			},
						    			{
						    				xtype: "button",
						    				text: "View SQL Query",
						    				handler: function() {
						    					this.m8/*navTo*/(0);
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
			
			buttons: [
				"->",
				{
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						this._c/*confirmDialog*/();
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1("B_CLOSE"),
					handler: function() {
						this.close();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function(ui) {
					this._m3/*loadPool*/();
				}
			}
		});
	    		
		IG$/*mainapp*/._Ib1/*sqlcube_wizard*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._Id5/*measureGroupEditor*/ = $s.extend($s.window, {
		
	modal: false,
	
	"layout": "fit",
	
	resizable:false,
	
	isWindow: true,
	
	closeAction: "destroy",
	
	width: 500,
	autoHeight: true,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		this.sK6/*saveContent*/();
	},
	
	_IFd/*init_f*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(panel, 
			{
                ack: "5",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid}),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'diagnostics'})
            }, panel, panel.rs_sK5/*procLoadContent*/, null);
        req._l/*request*/();
	},
	
	rs_sK5/*procLoadContent*/: function(xdoc) {
		var node = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/objinfo"),
			tnodes,
			i,
			iteminfo;
		
		iteminfo = me.iteminfo = {
			objectinfo: {},
			measureitems: []
		};
		
		if (tnode)
		{
			iteminfo.objectinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/MeasureItems");
		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
		for (i=0; i < tnodes.length; i++)
		{
			iteminfo.measureitems.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]));
		}
		
		me.down("[name=dimension_name]").setValue(iteminfo.objectinfo.dimension_name || "");
		me.down("[name=measure_name]").setValue(iteminfo.objectinfo.measure_name || "");
		
		me.down("[name=measureitems]").store.loadData(iteminfo.measureitems);
	},
	
	sK6/*saveContent*/: function() {
		var me = this,
			ctrl,
			panel = this,
			meta,
			i,
			measureitems = me.down("[name=measureitems]"),
			t, r;
		
		meta = "<smsg><item>"
			+ "<objinfo " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.iteminfo.objectinfo, "dimension_uid;measure_uid;cubeuid", "s") + "/>";
		meta += "<MeasureItems>";
		for (i=0; i < measureitems.store.data.items.length; i++)
		{
			r = measureitems.store.data.items[i];
			t = {
				uid: r.get("uid"),
				nodepath: r.get("nodepath"),
				name: r.get("name"),
				type: r.get("type")
			};
			meta += "<Measure " + IG$/*mainapp*/._I20/*XUpdateInfo*/(t, "name;uid;nodepath;type", "s") + "/>";
		}
		meta += "</MeasureItems>";
		meta += "</item></smsg>";
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
                ack: "31",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid}),
                mbody: meta
            }, panel, panel.rs_sK6/*saveContent*/, null, null);
        req._l/*request*/();
	},
	
	rs_sK6/*saveContent*/: function(xdoc) {
		this.callback && this.callback.execute();
			
		this.close();
	},
	
	P2C/*valueSelectedHandler*/: function(item) {
		var me = this,
			measureitems = me.down("[name=measureitems]");
			
		measureitems.store.add(item);
	},
	
		
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1('L_GROUP_MEASURE');
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:5px'},
			
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
							fieldLabel: "Name Dimension",
							name: "dimension_name"
						},
						{
							xtype: "textfield",
							fieldLabel: "Gropu Measure",
							name: "measure_name"
						},
						{
							xtype: "gridpanel",
							name: "measureitems",
							height: 300,
							store: {
								xtype: "store",
								fields: [
									"uid", "nodepath", "name", "type"
								]
							},
							selType: "checkboxmodel",
							selModel: {
								checkSelector: ".x-grid-cell"
							},
							columns: [
								{
									xtype: "gridcolumn",
									text: "Name",
									dataIndex: "name",
									flex: 1
								},
								{
									xtype: "gridcolumn",
									text: "Location",
									dataIndex: "nodepath",
									flex: 1
								}
							],
							tbar: [
								{
									xtype: "button",
									text: "Add Measure",
									handler: function() {
										var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
											visibleItems: 'workspace;folder;measure',
											u5x/*treeOptions*/: {
												cubebrowse: true,
												rootuid: panel.iteminfo.objectinfo.cubeuid
											}
										});
										dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.P2C/*valueSelectedHandler*/);
										IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
									},
									scope: this
								},
								{
									xtype: "button",
									text: "Delete Selected",
									handler: function() {
										var me = this,
											i,
											measureitems = me.down("[name=measureitems]"),
											sel = measureitems.getSelectionModel().getSelection();
											
										for (i=sel.length-1; i>=0; i--)
										{
											// sel[i].remove();
											measureitems.store.remove(sel[i]);
										}
									},
									scope: this
								}
							]
						}
					]
				}
			],
			
			buttons:[
//				{
//					text: IRm$/*resources*/.r1('B_HELP'),
//					handler: function() {
//						IG$/*mainapp*/._I63/*showHelp*/('P0041');
//					},
//					scope: this
//				}, 
				"->",
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this._IFf/*confirmDialog*/();
					},
					scope: this
				},
				{
					text: IRm$/*resources*/.r1('B_CLOSE'),
					handler: function() {
						this._IG0/*closeDlgProc*/();
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
		
		IG$/*mainapp*/._Id5/*measureGroupEditor*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.A$Navi = function() {
	IG$/*mainapp*/.A$Navi.superclass.constructor.call(this, {
        region:'west',
        split:true,
        header: false,
        width: 200,
        minSize: 175,
        maxSize: 400,
        collapsible: true,
        margins:'0 0 5 5',
        cmargins:'0 0 0 0',
        rootVisible:true,
        lines:false,
        autoScroll:true,
        animCollapse:false,
        animate: true,
        collapseMode:'mini',
		
		store: new IG$/*mainapp*/.blM/*browserStore*/({
			cubeuid: null,
			cubeaddress: null,
			cubebrowse: true
		}),
		
		root: {
	    	id: 'root',
	        text: 'Root',
	        address: '/',
	        type: 'root'
        },
		
        collapseFirst:false,
        
        listeners: {
        	itemclick: function(view, record, item, index, e) {
        
	        	var typename;
	        	var itemname;
	        	var itemaddr;
	        	var itemuid;
	        	
	        	var data = record.data;
	        	
	        	if (record.isLeaf() == false)
	        	{
	        		typename = 'mcube';
	        		itemname = '';
	        		itemaddr = this.cubeaddress;
	        		itemuid = this.cubeuid;
	        	}
	        	else
	        	{
	        		typename = data.type.toLowerCase();
	        		itemname = data.name;
	        		itemaddr = data.nodepath;
	        		itemuid = data.uid;
	        	}
	    		
	    		// e.stopEvent();
	        	
		    	if (record.isLeaf()) {
		    		this.editMetaObject.call(this, itemuid, itemname, itemaddr, typename);
		    	}
		    	
		    	var menu = this.customMenu;
		    	menu.removeAll();
		    	// menu.initItems();
		    	var panel = this;
		    	
		    	switch (typename)
		    	{
		    	case 'mcube':
		    	case 'metrics':
		    		menu.add({
		    			text: 'Make item',
		    			menu: [
		    			   {
		    				   text: 'Folder',
		    				   handler: function() {
		    				       panel._I90/*createMetaObject*/.call(panel, 'Metrics', itemuid, itemaddr, record);
		    			   	   }
		    			   }, {
		    				   text: 'Dimension',
		    				   handler: function() {
		    				   		panel._I90/*createMetaObject*/.call(panel, 'Metric', itemuid, itemaddr, record);
		    			   	   }
		    			   }, {
		    				   text: 'Measure',
		    				   handler: function() {
		    				   		panel._I90/*createMetaObject*/.call(panel, 'Measure', itemuid, itemaddr, record);
		    			   	   }
		    			   }
		    			],
		    			scope: this}
		    		);
		    		if (typename != 'mcube')
		    		{
			    		menu.add({
			    			text: 'Remove' + itemname,
			    			handler: function() {
			    				panel.removeMetaObject.call(panel, itemuid);
			    			}
			    		});
		    		}
		    		break;
		    	case 'report':
		    		menu.add({text: 'test'});
		    		break;
		    	case 'metric':
		    		menu.add({
		    				text: 'Edit metric ' + itemname,
		    				handler: function() {
		    					panel.editMetaObject.call(panel, itemuid, itemname, itemaddr, typename);
		    				}
		    			}
		    		);
		    		break;
		    	case 'measure':
		    		menu.add({
		    			text: 'Edit measure ' + itemname,
		    			handler: function() {
		    				panel.editMetaObject.call(panel, itemuid, itemname, itemaddr, typename);
		    			}
		    		});
		    	}
        	}
	    }
    });
    
    // this.render('tree');
    // root.expand(false, false);
    // this.getSelectionModel().select(this.getRootNode());
    // this.enter.defer(100, this);
    // no longer needed!
    //new Ext.tree.TreeSorter(this, {folderSort:true,leafAttr:'isClass'});

    this.getSelectionModel().on('beforeselect', function(sm, node){
        return node.isLeaf();
    });
};

IG$/*mainapp*/.A$Navi = $s.extend($s.treepanel, {
	customMenu: null,
	_I90/*createMetaObject*/: function(objecttype, parentuid, parentfullpath) {
		var dlgpop = new IG$/*mainapp*/._I6e/*makeItem*/({
			parentnodepath: parentfullpath,
			itemtype: objectype,
			parentuid: parentuid,
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.r_I90/*createMetaObject*/, node)
		});
		
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgpop);
	},
	
	r_I90/*createMetaObject*/: function(node) {
		if (node)
		{
			this.refreshNode(node);
		}
	},
	
	editMetaObject: function(itemuid, itemname, itemaddr, typename) {
		switch (typename)
		{
		case 'multimetric':
			var panel = this.ownerCt;
			panel.a$tab.m1$7/*navigateApp*/.call(panel.a$tab, itemuid, typename, itemname, itemaddr);
			// var dlgpop = new IG$/*mainapp*/._IC3/*multimetric*/();
			// dlgpop.uid = itemuid;
			// dlgpop.refreshContent.call(dlgpop);
			// IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgpop);
			break;
		case 'multimeasure':
			var panel = this.ownerCt;
			panel.a$tab.m1$7/*navigateApp*/.call(panel.a$tab, itemuid, typename, itemname, itemaddr);
			break;
		}
	},
	removeMetaObject: function(itemuid) {
		var panel = this;
		panel.setLoading(true, true);
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "7",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: itemuid}),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
	        }, panel, panel.rs_removeMetaObject, null);
		req._l/*request*/();
	},
	
	rs_removeMetaObject: function(xdoc) {
		var snode = XGetNode(xdoc, "/smsg/item");
		panel.setLoading(false);
	},
	
	refreshNode: function(node) {
		var unode = node;
		if (node.isLeaf() == true)
		{
			unode = node.parentNode;
		}
		
		// unode.removeAll(false);
		while (unode.firstChild)
		{
			unode.removeChild(unode.firstChild);
		}
		
		unode.expand(false);
	},
	
    initComponent: function(){
        this.hiddenPkgs = [];
        this.customMenu = new Ext.menu.Menu({
        	items: []
        });
        $s.apply(this, {
            tbar:[ 
            	' ',
	            {
	            	text: 'Search',
	            	menu: {
		            	items: [
		            		new Ext.form.TextField({
		        				width: 200,
		        				emptyText:'Search keyword',
		                        enableKeyEvents: true,
		        				listeners:{
		        					render: function(f){
		                            	this.filter = new Ext.tree.TreeFilter(this, {
		                            		clearBlank: true,
		                            		autoClear: true
		                            	});
		        					},
		                            keydown: {
		                                fn: this.filterTree,
		                                buffer: 350,
		                                scope: this
		                            },
		                            scope: this
		        				}
		        			}), 
		        			' ', 
		        			' '
		            	]
	            	}
	            },
	            /*
				{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ this.root.expand(true); },
	                scope: this
	            }, '-', {
	                iconCls: 'icon-collapse-all',
	                tooltip: 'Collapse All',
	                handler: function(){ this.root.collapse(true); },
	                scope: this
	            }, */ '-', 
	            {
	            	iconCls: 'icon-refresh',
	            	tooltip: 'Refresh',
	            	handler: function() {
	            		var rnode = this.getRootNode();
	            		// rnode.removeAll();
	            		while (rnode.firstChild)
	            		{
	            			rnode.removeChild(rnode.firstChild);
	            		}
	            		this.store.load();
	            	},
	            	scope: this
	            }, 
	            '-', 
	            {
	            	text: 'Menu',
	            	menu: this.customMenu
	            }
//	            , 
//	            '->',
//		        {
//		           	iconCls: 'icon-toolbar-help',
//	            	tooltip: IRm$/*resources*/.r1('B_HELP'),
//	            	handler: function() {
//	            		IG$/*mainapp*/._I63/*showHelp*/('P0019');
//	            	}
//	            }
            ]
        });
        
        /*
        , {
        	text: 'Menu',
        	menu: {
            	items: [
            	]
        	}
        }
        */
        IG$/*mainapp*/.A$Navi.superclass.initComponent.call(this);
    },
	filterTree: function(t, e){
		var text = t.getValue();
		Ext.each(this.hiddenPkgs, function(n){
			n.ui.show();
		});
		if(!text){
			this.filter.clear();
			return;
		}
		this.expandAll();
		
		var re = new RegExp('^' + Ext.escapeRe(text), 'i');
		this.filter.filterBy(function(n){
			return !n.attributes.isClass || re.test(n.text);
		});
		
		// hide empty packages that weren't filtered
		this.hiddenPkgs = [];
                var me = this;
		this.root.cascade(function(n){
			if(n.ui.ctNode.offsetHeight < 3){
				n.ui.hide();
				me.hiddenPkgs.push(n);
			}
		});
	}
});


IG$/*mainapp*/.A$TB = function(){
	
	IG$/*mainapp*/.A$TB.superclass.constructor.call(this, {
        region:'center',
        margins:'0 5 5 0',
        resizeTabs: true,
        minTabWidth: 135,
        tabWidth: 135,
        // plugins: new Ext.ux.TabCloseMenu(),
        enableTabScroll: true,
        activeTab: 0,
        
        requestCubeCommand: function(cmd) {
			var panel = this;
			var action = "";
			var content = '<smsg></smsg>';
			
			switch (cmd)
			{
			case 'CMD_BUILD_CUBE':
				action = 'BuildCube';
				break;
			case 'CMD_IMPORT':
				var dlgfile = new IG$/*mainapp*/.MmD$m({cubeuid: panel.uid});
				dlgfile.show();
				return;
				break;
			}
			
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
		            ack: "17",
	                payload: '<smsg><item cubeuid=\'' + panel.uid + '\' action="' + action + '"/></smsg>',
	                mbody: content
		        }, panel, panel.rs_requestCubeCommand, null);
			req._l/*request*/();
		},
		
		rs_requestCubeCommand: function(xdoc) {
			var snode = XGetNode(xdoc, "/smsg/item");
			var childs = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
		},		

        items: {
            title: 'About M-Cube',
            autoLoad: {url: './html/mcube_intro.html', callback: this.initSearch, scope: this},
            iconCls:'icon-docs',
            autoScroll: true,
			tbar: [
				{
				    iconCls: 'icon-expand-all',
					tooltip: 'Build Cube',
				    handler: function(){
						this.requestCubeCommand.call(this, 'CMD_BUILD_CUBE');
					},
				    scope: this
				}, {
				    iconCls: 'icon-expand-all',
					tooltip: 'Import Data',
				    handler: function(){
						this.requestCubeCommand.call(this, 'CMD_IMPORT');
					},
				    scope: this
				}
            ]
        }
    });
};

IG$/*mainapp*/.A$TB = $s.extend($s.tabpanel, {
    m1$7/*navigateApp*/: function(uid, itemtype, itemname, itemaddr) {
    	var tab = this.getComponent(uid);
    	
    	if (tab)
    	{
    		this.setActiveTab(tab);
    	}
    	else
    	{
    		var pitem = IG$/*mainapp*/._I61/*createAppPanel*/(uid, itemtype, itemname, itemaddr, null);
    		if (pitem != null)
    		{
    			pitem.id = uid;
    			pitem.cubeuid = this.ownerCt.uid;
    			pitem.address = itemaddr;
    			pitem.title = itemname;
    			
    			var p = this.add(pitem);
    			this.setActiveTab(p);
    			
    			/*
    			switch (itemtype)
    			{
    			case 'metric':
    				pitem.refreshContent.call(pitem);
    				break;
    			case 'measure':
    				pitem.cubeuid = this.ownerCt.uid;
    				pitem.refreshContent.call(pitem);
    				break;
    			}
    			*/
    		}
    	}
    },
    
    initSearch : function(){
    }
});

IG$/*mainapp*/.mA$_c/*mcube_sql*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	
	"layout": 'fit',
	
	closable: false,
	resizable:true,
	
	width: 500,
	height: 450,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			dbpools = me.down("[name=dbpools]"),
			columnlist = me.down("[name=columnlist]"),
			i, c, s,
			buildcube = me.down("[name=buildcube]").getValue(),
			opt = {
				dbpool: dbpools.getValue(),
				columns: [],
				sql: me.down("[name=sqlquery]").getValue(),
				buildcube: buildcube
			};
		
		if (!opt.dbpool)
		{
			return;
		}
		
		
		for (i=0; i < columnlist.store.data.items.length; i++)
		{
			s = columnlist.store.data.items[i];
			c = {
				name: s.get("name"),
				datatype: s.get("datatype"),
				selected: s.get("include"),
				uid: s.get("uid")
			};
			opt.columns.push(c);
		}
		
		if (opt.columns.length == 0)
		{
			return;
		}
		
		if (me.callback)
		{
			me.callback.execute(opt);
		}
		
		me.close();
	},
	
	Jo0/*initApp*/: function() {
		var me = this;
		this.Jo1/*loadTable*/();
		if (this.sqldata)
		{
			me.down("[name=sqlquery]").setValue(me.sqldata.sql || "");
		}
		me.maptocombo.store.loadData(me.columns);
	},
	
	Jo1/*loadTable*/: function() {
		var panel = this;

		// panel.setLoading(true, true);
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
				ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/"}, "address"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "standard"})
	        }, panel, panel.rs_Jo1/*loadTable*/, null);
		req._l/*request*/();
	},
	
	rs_Jo1/*loadTable*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
			i, j, dbs = [],
			dbpools = me.down("[name=dbpools]"),
			cnodes, unode, db;
		
		dbs.push({
			disp: "Select database",
			name: ""
		});
		
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				db = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				db.type = "pool";
				dbs.push(db);
			}
		}
		
		dbpools.store.loadData(dbs);
		dbpools.setValue(me.sqldata ? me.sqldata.dbpool : "");
	},
	
	Jo3/*scanData*/: function() {
		var me = this,
			dbpools = me.down("[name=dbpools]"),
			delimiter = me.down("[name=delimiter]"),
			scancount = me.down("[name=scancount]"),
			sqlquery = me.down("[name=sqlquery]"),
			option = {
				dbpool: dbpools.getValue(),
				scancount: scancount.getValue()
			},
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		if (!option.dbpool)
		{
			return;
		}
		
		req.init(me, 
			{
	            ack: "25",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, option: "sqlpreview", dbpool: option.dbpool, scancount: option.scancount, scanheader: "T"}, "uid;option;dbpool;scancount;scanheader"),
                mbody: "<smsg><SQL><![CDATA[" + sqlquery.getValue() + "]]></SQL></smsg>"
	        }, me, me.rs_Jo3/*scanData*/, null);
		req._l/*request*/();
	},
	
	rs_Jo3/*scanData*/: function(xdoc) {
		var me = this,
			columnlist = me.down("[name=columnlist]"),
			grdresult = me.down("[name=grdresult]"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Result/headers"),
			tnodes = (tnode) ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			items = [],
			item, i,
			cmap = {};
		
		for (i=0; i < me.columns.length; i++)
		{
			cmap[me.columns[i].name] = me.columns[i];
		}
		
		for (i=0; i < tnodes.length; i++)
		{
			item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			item.include = true;
			if (cmap[item.name]) {
				item.mapto = item.name;
				item.uid = cmap[item.name].uid;
			}
			items.push(item);
		}
		
		columnlist.store.loadData(items);
	},
	
	initComponent : function() {
		var me = this,
			maptocombo = Ext.create(Ext.form.field.ComboBox, {
			xtype: "combobox",
			name: "maptocombo",
			queryMode: "local",
			displayField: "name",
			labelField: "name",
			valueField: "name",
			editable: false,
			autoSelect: true,
			triggerAction: "all",
			selectOnTab: true,
			store: {
				xtype: "store",
				fields: [
					"name", "uid"
				],
				data: [
					
				]
			},
			lazyRender: true,
			listClass: "x-combo-list-small"
		});
		this.maptocombo = maptocombo;
		me.title = IRm$/*resources*/.r1('T_DATA_UPLOAD');
		Ext.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			"layout": 'fit',
			
			items: [
			    {
			    	xtype: 'panel',
			    	name: 'mform',
			    	autoScroll: true,
			    	layout: {
			    		type: "vbox",
			    		align: "stretch"
			    	},

			    	items: [
	  	                {
	  	                	xtype: "combobox",
	  	                	name: "dbpools",
	  	                	fieldLabel: "DataSource",
	  	                	queryMode: 'local',
		  	      			displayField: 'disp',
		  	      			valueField: 'name',
		  	      			editable: false,
		  	      			autoSelect: true,
		  	      			store: {
	  	                		xtype: "store",
	  	                		fields: [
									"name", "type", "disp", "status", "productname", "productversion", "catalogname", "isuserdb"
	  	                		]
	  	                	}
	  	                },
	  	                {
	  	                	xtype: "textarea",
	  	                	fieldLabel: "SQL Query",
	  	                	name: "sqlquery",
	  	                	height: 150
	  	                },
	  	                {
	  	                	xtype: "fieldcontainer",
	  	                	fieldLabel: "Preview",
	  	                	layout: "hbox",
	  	                	items: [
	  	                	    {
	  	                	    	xtype: "numberfield",
	  	                	    	name: "scancount",
	  	                	    	value: 100,
	  	                	    	minValue: 1,
	  	                	    	maxValue: 10000
	  	                	    },
	  	                	    {
	  	                	    	xtype: "button",
	  	                	    	text: "Preview",
	  	                	    	handler: function() {
	  	                	    		this.Jo3/*scanData*/();
	  	                	    	},
	  	                	    	scope: this
	  	                	    }
	  	                	]
	  	                },
	  	                {
	  	                	xtype: "gridpanel",
	  	                	name: "columnlist",
	  	                	height: 200,
	  	                	selModel: Ext.create(Ext.selection.CheckboxModel, {
	  	                		checkSelector: ".x-grid-cell"
	  	                	}),
	  	                	plugins: [
								Ext.create('Ext.grid.plugin.CellEditing', {
									clicksToEdit: false,
									listeners: {
										edit: function(editor, e, opts) {
											if (e.field == "mapto")
											{
												var ri = e.rowIdx,
													grd = e.grid,
													r = e.record,
													i;
												
												r.set("uid", "");
												
												for (i=0; i < me.columns.length; i++)
												{
													if (me.columns[i].name == e.value)
													{
														r.set("uid", me.columns[i].uid);
													}
												}
											}
										}
									}
								})
					    	],
					    	store: {
					    		xtype: "store",
					    		fields: [
					    			"name", "datatype", "include", "uid", "mapto"
					    		]
					    	},
	  	                	columns: [
	  	                		{
	  	                			xtype: "gridcolumn",
	  	                			text: "Name",
	  	                			dataIndex: "name",
	  	                			flex: 1,
	  	                			editor: {
	  	                				xtype: 'textfield',
										allowBlank: false
	  	                			}
	  	                		},
	  	                		{
	  	                			xtype: "gridcolumn",
	  	                			text: "DataType",
	  	                			dataIndex: "datatype",
	  	                			field: {
										xtype: "combobox",
										queryMode: "local",
										displayField: "name",
										valueField: "value",
										editable: false,
										autoSelect: true,
										triggerAction: "all",
										selectOnTab: true,
										store: {
											xtype: "store",
											fields: ["name", "value"],
											data: [
												{name: "String", value: "string"},
												{name: "Numeric", value: "number"}
											]
										},
										lazyRender: true,
										listClass: "x-combo-list-small"
									}
	  	                		},
	  	                		{
	  	                			xtype: "gridcolumn",
	  	                			text: "Map to",
	  	                			dataIndex: "mapto",
	  	                			editor: maptocombo
	  	                		},
	  	                		{
	  	                			xtype: "gridcolumn",
	  	                			text: "Map to uid",
	  	                			dataIndex: "uid",
	  	                			hidden: true
	  	                		},
	  	                		{
	  	                			xtype: "checkcolumn",
	  	                			text: "Include",
	  	                			dataIndex: "include",
	  	                			width: 60
	  	                		}
	  	                	],
	  	                	tbar: [
	  	                		{
	  	                			xtype: "button",
	  	                			iconCls: "icon-grid-delete",
	  	                			text: "Delete",
	  	                			handler: function() {
	  	                				var grd = this.down("[name=grdcols]"),
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
	  	                		"->",
	  	                		{
			  	                	xtype: "checkbox",
			  	                	name: "buildcube",
			  	                	fieldLabel: "",
			  	                	boxLabel: "Build Cube",
			  	                	checked: true
			  	                }
	  	                	]
	  	                },
	  	                {
	  	                	xtype: "fieldset",
	  	                	layout: "fit",
	  	                	title: "Result",
	  	                	hidden: true,
	  	                	collapsible: true,
	  	                	collapsed: true,
	  	                	items: [
	  	                		{
	  	                			xtype: "gridpanel",
	  	                			name: "grdresult",
	  	                			height: 300,
	  	                			store: {
	  	                				xtype: "store",
	  	                				fields: []
	  	                			},
	  	                			columns: [
	  	                				{
	  	                					xtype: "gridcolumn",
	  	                					text: "Result"
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
				},
				{
					text: IRm$/*resources*/.r1('B_CANCEL'),
					handler: function() {
						this.close();
					},
					scope: this
				}
			],
			
			listeners: {
				afterrender: function(panel) {
					panel.Jo0/*initApp*/.call(panel);
				}
			}
		});
		
		IG$/*mainapp*/.mA$_c/*mcube_sql*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._IC1/*mcubepanel*/ = function (config) {
	$s.apply(this, config);
	
	IG$/*mainapp*/._IC1/*mcubepanel*/.superclass.constructor.call(this, {
        autoScroll:false,
        collapseFirst:true,
        bodyBorder: false,
        "layout": {
			type: "border"
		}
    });
};

function j$sP/*CMOLAPCubeMeta*/(uid, xdoc) 
{
	this.uid = uid;
	
	if (xdoc)
	{
		this.m1/*readContent*/(xdoc);
	}
}

j$sP/*CMOLAPCubeMeta*/.prototype = {
	m1/*readContent*/: function(xdoc) {
		var me = this,
			snode, tnode,
			child, item,
			cs, i,
			pname, pvalue;
		
		me.items = [];
		me.itemmap = {};
		me.styles = [];
		me.sqldata = {};
		me.dataloader = {
			option: {}
		};
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/MetricItems");
		
		if (tnode)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
    		for (i=0; i < child.length; i++)
    		{
    			item = {};
    			IG$/*mainapp*/._I1f/*XGetInfo*/(item, child[i], "uid;nodepath;name;metrictype;stylename;type;sequence;uniquekey;fieldname", "s");
    			me.items.push(item);
    			me.itemmap[item.uid] = item;
    		}
		}
		
		var dstyle = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Styles"),
			styleitem;
		if (dstyle)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(dstyle);
			for (i=0; i < child.length; i++)
			{
				styleitem = new IG$/*mainapp*/._IF7/*clReportStyle*/(child[i], "appstyle", true);
				me.styles.push(styleitem);
			}
		}
		
		var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/SQLData/item"),
			snode,
			snodes;
		if (tnode)
		{
			me.sqldata.dbpool = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbpool");
			snode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "sqlquery");
			if (snode)
			{
				me.sqldata.sql = IG$/*mainapp*/._I24/*getTextContent*/(snode);
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/DataLoader/Option");
		
		if (tnode)
		{
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < snodes.length; i++)
			{
				pname = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[i], "name");
				pvalue = IG$/*mainapp*/._I24/*getTextContent*/(snodes[i]);
				me.dataloader.option[pname] = pvalue;
			}
		}
	},
	
	m2/*getXMLString*/: function() {
		var me = this,
			r, i;
			
		r = "<smsg><item uid='" + me.uid + "'>"
    	  + "<objinfo version='1.1'/>";
    	  
    	r += "<MetricItems>";
    	for (i=0; i < me.items.length; i++)
    	{
    		r += "<item" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.items[i], "uid;nodepath;name;metrictype;stylename;type;sequence;uniquekey;fieldname", "s") + "/>";
    	}
    	r += "</MetricItems>";
    	
    	r += "<SQLData>";
    	if (me.sqldata && me.sqldata.dbpool && me.sqldata.columns)
    	{
    		r += "<item dbpool='" + (me.sqldata.dbpool || "") + "'>"
    		r += "<columns>";
    		for (i=0; i < me.sqldata.columns.length; i++)
    		{
    			r += "<column name='" + me.sqldata.columns[i].name + "' datatype='" + me.sqldata.columns[i].datatype + "' mappto='" + (me.sqldata.columns[i].mapto || "") + "'/>";
    		}
    		r += "</columns>";
    		r += "<sqlquery><![CDATA[" + (me.sqldata.sql || "") + "]]></sqlquery>";
    		r += "</item>";
    	}
    	r += "</SQLData>";
    	
    	r += "<DataLoader>";
    	r += "<Option>";
    	if (me.dataloader.option)
    	{
    		for (var k in me.dataloader.option)
    		{
    			r += "<prop name='" + k + "'><![CDATA[" + me.dataloader.option[k] + "]]></prop>";
    		}
    	}
    	r += "</Option>";
    	r += "</DataLoader>";
    	  
    	r += "<Styles>";
    	

    	for (i=0; i < this.styles.length; i++)
    	{
    		r += this.styles[i].tx/*getXML*/();
    	}

		r += "</Styles></item></smsg>";
		
		return r;
	}
}

IG$/*mainapp*/._IC1/*mcubepanel*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	uid: "",
	scroll: false,
	initialized: false,
	refreshmode: "F",
	closable: true,
	cubeaddress: null,
	nindex: 0,
	nameprefix: "Dimension_",
	ditems: [],
	header: false,
	
    initComponent: function(){
    	var panel = this;
    	
		var st = Ext.create("Ext.data.ArrayStore", {
			sorters: ["name"],
			groupField: "relpath",
			fields: [
				"name", "nodepath", "uid", "datasize", "datatype", "fieldfullpath", "fieldinfo", "fieldname", "relpath", "selected",
				"tablename", "tableuid", "type", "metrictype", "stylename", "sequence", "uniquekey", "isnew"
			],
			data: []
		});
		
		var groupFeature = Ext.create("Ext.grid.feature.Grouping", {
			groupHeaderTpl: "Folder: {name} ({rows.length} items)"
		});
		
		var rowEditing = Ext.create("Ext.grid.plugin.CellEditing", {
			clicksToMoveEditor: 1,
			autoCancel: false
		});
		
		this.dataview = Ext.create("Ext.grid.Panel", {
			collapsible: false,
			iconCls: "icon-grid",
			frame: false,
			store: st,
			header: false,
			
			features: [groupFeature],
			plugins: [
				rowEditing
			],
			
			columns: [
			    {
			    	xtype: "checkcolumn",
			    	dataIndex: "selected",
			    	menuDisabled: true,
			    	width: 30,
			    	editor: {
			    		xtype: "checkbox",
			    		cls: "x-grid-checkheader-editor"
			    	}
			    },
			    {
			    	text: IRm$/*resources*/.r1("B_NAME"),
			    	dataIndex: "name",
			    	menuDisabled: true,
			    	flex: 2,
			    	editor: {
			    		allowBlank: false
			    	}
				},
				{
			    	text: "Metric type",
			    	dataIndex: "metrictype",
			    	menuDisabled: true,
			    	width: 80/*,
			    	field: {
						xtype: "combobox",
						queryMode: "local",
						displayField: "name",
						valueField: "value",
						editable: false,
						autoSelect: true,
						triggerAction: "all",
						selectOnTab: true,
						store: {
							model: "M$MXd",
							data: [
								{name: "metric", value: "metric"},
								{name: "measure", value: "measure"},
								{name: "data", value: "data"}
							]
						},
						lazyRender: true,
						listClass: "x-combo-list-small"
					}
					*/
				},
				{
					xtype: "actioncolumn",
					width: 50,
					menuDisabled: true,
					items: [
						{
							// icon: "./images/plus-circle.png",
							iconCls: "icon-grid-add",
							tooltip: "Edit Data",
							handler: function (grid, rowIndex, colIndex) {
								panel.mm4/*editItemData*/.call(panel, rowIndex, colIndex);
							}
						},
						{
							// icon: "./images/delete.png",
							iconCls: "icon-grid-delete",
							tooltip: "Remove",
							handler: function (grid, rowIndex, colIndex) {
								// var rec = store.getAt(rowIndex);
								panel.mm3/*removeItem*/.call(panel, rowIndex, colIndex);
							}
						}
					]
				}
			]
		});
		
		$s.apply(this, {
        	// bbar: this.statusbar,
        	header: false,
            tbar:[ 
            	" ",
				{
	            	iconCls: "icon-toolbar-save",
	            	tooltip: IRm$/*resources*/.r1("L_SAVE_CUBE"),
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_save"); 
	            	},
	            	scope: this
	            },
	            {
	            	iconCls: "icon-refresh",
	            	tooltip: IRm$/*resources*/.r1("L_REFRESH"),
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_refresh"); 
	            	},
	            	scope: this
	            },
	            "-",
	            {
	            	iconCls: "icon-toolbar-mcubefile",
	            	text: IRm$/*resources*/.r1("L_LD_FILE"),
	            	tooltip: IRm$/*resources*/.r1("L_LD_FILE"),
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_ld_file"); 
	            	},
	            	scope: this
	            },
	            {
	            	iconCls: "icon-toolbar-mcubedb",
	            	tooltip: IRm$/*resources*/.r1("L_LD_SQL_D"),
	            	text: IRm$/*resources*/.r1("L_LD_SQL"),
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_sql");
	            	},
	            	scope: this
	            },
	            {
	            	iconCls: "icon-toolbar-buildcube",
	            	text: IRm$/*resources*/.r1("L_BUILD_MCUBE"),
	            	tooltip: IRm$/*resources*/.r1("L_BUILD_MCUBE"),
	            	hidden: true,
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_buildcube"); 
	            	},
	            	scope: this
	            },
	            {
	            	iconCls: "icon-toolbar-addmetric",
	            	tooltip: IRm$/*resources*/.r1("L_ADD_METRIC"),
	            	hidden: true,
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_add_metric"); 
	            	},
	            	scope: this
	            },
	            
	            "-",
	            {
	            	iconCls: "icon-toolbar-style",
	            	text: IRm$/*resources*/.r1("L_LD_ST"),
	            	tooltip: IRm$/*resources*/.r1("L_LD_ST"),
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_style");
	            	},
	            	scope: this
	            },
	            {
	            	iconCls: "icon-toolbar-remove",
	            	tooltip: IRm$/*resources*/.r1("L_DELETE_CHECKED"),
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_delete");
	            	},
	            	scope: this
	            },
	            "-",
	            {
	            	iconCls: "icon-toolbar-db-unload",
	            	tooltip: IRm$/*resources*/.r1("L_LD_UL"),
	            	text: IRm$/*resources*/.r1("L_LD_UL"),
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_db_unload");
	            	},
	            	scope: this
	            },
	            {
	            	iconCls: "icon-toolbar-db-load",
	            	tooltip: IRm$/*resources*/.r1("L_LD_LK"),
	            	text: IRm$/*resources*/.r1("L_LD_LK"),
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_db_load");
	            	},
	            	scope: this
	            },
	            "-",
	            {
	            	iconCls: "icon-toolbar-db-destroy",
	            	text: IRm$/*resources*/.r1("L_LD_INI"),
	            	title: IRm$/*resources*/.r1("L_LD_INI"),
	            	handler: function() {
	            		this._t$/*toolbarHandler*/("cmd_db_destroy");
	            	},
	            	scope: this
	            }
//	            ,
//				
//	            "->",
//	            {
//	            	iconCls: "icon-toolbar-help",
//	            	tooltip: IRm$/*resources*/.r1("B_HELP"),
//	            	handler: function() {
//	            		IG$/*mainapp*/._I63/*showHelp*/("P0005");
//	            	}
//	            }
            ],
            items: [
	            {
	                "layout": "fit",
	                items: [this.dataview],
	                region: "center",
	                collapsible: false
	    		}
			]
        });
		
        IG$/*mainapp*/._IC1/*mcubepanel*/.superclass.initComponent.call(this);
    },
    
    entryLogin: function(thisobj) {
    	if (demos.Login.success == true)
		{
			var panel = demos.IG$/*mainapp*/._IC1/*mcubepanel*/;
			panel.sK5/*procLoadContent*/.call(panel);
		}
		else
		{
			history.back(-1);
		}
    },
    
    sK5/*procLoadContent*/: function() {
    	var panel = this;
    	
    	
    	var w = panel.body.getWidth();
		var h = panel.body.getHeight();
		
		if (panel.uid && panel.uid.length > 0)
		{
			panel.setLoading(true, true);
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
		            ack: "5",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
	                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "content"})
		        }, panel, panel.rs_sK5/*procLoadContent*/, null);
			req._l/*request*/();
			
			panel.refreshmode = "F";
		}
    },
    
    rs_sK5/*procLoadContent*/: function(xdoc) {
    	var panel = this;
    	var snode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		panel.cubeaddress = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "nodepath");
		
		panel.MM1/*cubemeta*/ = new j$sP/*CMOLAPCubeMeta*/(panel.uid, xdoc);
		
		panel.sqldata = panel.MM1/*cubemeta*/.sqldata;
		
		panel.mr1/*loadSubList*/();
    },
    
    mr1/*loadSubList*/: function() {
    	var panel = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "5",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "metrics"})
	        }, panel, panel.rs_mr1/*loadSubList*/, null);
		req._l/*request*/();
    },
    
    rs_mr1/*loadSubList*/: function(xdoc) {
    	var panel = this,
    		i, n,
    		tnode, tnodes,
    		dp = [], item,
    		dataview = panel.dataview,
    		cubeaddress = panel.cubeaddress,
    		pval,
    		cubemeta = panel.MM1/*cubemeta*/,
    		cleng = (cubeaddress) ? cubeaddress.length : 0;
    		
    	panel.setLoading(false);
    	tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
    	panel.nindex = 0;
    	panel.ditems = [];
    	
    	if (tnode)
    	{
    		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
    		for (i=0; i < tnodes.length; i++)
    		{
    			item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
    			if (item.type == "Folder")
    			{
    				if (tnodes[i].hasChildNodes() == false)
    				{
    					item.type = "blank";
    					item.name = "No items defined";
    					item.relpath = item.nodepath.substring(cleng);
    					dp.push(item);
    				}
    			}
    			else
    			{
    				n = item.nodepath.lastIndexOf("/");
    				item.relpath = item.nodepath.substring(0, n).substring(cleng);
    				if (item.name.substring(0, panel.nameprefix.length) == panel.nameprefix)
    				{
    					pval = Number(item.name.substring(panel.nameprefix.length));
    					if (isNaN(pval) == false)
    					{
    						panel.nindex = Math.max(panel.nindex, pval+1);
    					}
    				}
    				if (cubemeta.itemmap[item.uid])
    				{
    					item.stylename = cubemeta.itemmap[item.uid].stylename;
    					item.metrictype = cubemeta.itemmap[item.uid].metrictype || "metric";
    				}
    				dp.push(item);
    			}
    		}
    	}
    	
    	dataview.store.loadData(panel.MM1/*cubemeta*/.items);
    },
    
    listeners: {
    	render: function(ui) {
    		var panel = ui;
        	panel.sK5/*procLoadContent*/.call(panel);
        	panel.initialized = true;
    	},
    	deactivate: function(ui) {
    		var panel = ui;
    		panel.disposeContent(panel);
    	},
    	resize: function(ui, adjWidth, adjHeight, rawWidth, rawHeight) {
    		ui.Mm11/*validateSize*/.call(ui, adjWidth, adjHeight);
    	},
    	scope: this
    },
    
    refreshContent: function() {
    	this.refreshmode = "T";
    	this._IJ2/*procRunReport*/(this);
    },
    Mm11/*validateSize*/: function(orientation, w, h) {
    	
    },
    disposeContent: function(ui) {
    },
    
    d1/*showSaveContent*/: function(cmd) {
    	var panel = this;
    	if (!panel.uid)
    	{
    		var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
	    		mode: "newitem",
	    		initpath: this.nodepath
	    	});
			dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs_d1/*showSaveContent*/, cmd);
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
    		return false;
    	}
    	
    	return true;
    },
    
    rs_d1/*showSaveContent*/: function(item, cmd) {
    	if (item && item.nodepath && item.name)
    	{
	    	var panel = this,
				pivotxml = IG$/*mainapp*/._I2e/*getItemOption*/(),
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
			req.init(panel, 
				{
		            ack: "31",
		            payload: "<smsg><item address='" + item.nodepath + "/" + item.name + "' name='" + item.name + "' type='" + "DataCube" + "' pid='" + item.uid + "' description=''/></smsg>",
		            mbody: "<smsg><item address='" + item.nodepath + "'/></smsg>"
		        }, panel, function() {
		        	this._t$/*toolbarHandler*/(cmd);
		        }, null);
		   	req.showerror = false;
		    req._l/*request*/();
	    }
    },
    
    _t$/*toolbarHandler*/: function(cmd) {
    	var panel = this,
    		me = this,
    		req;
    	
    	switch (cmd)
    	{
    	case "cmd_save":
    		if (panel.d1/*showSaveContent*/() == true)
    		{
    			panel.mm5/*saveCubeMetrics*/();
    		}
    		break;
    	case "cmd_refresh":
    		panel.sK5/*procLoadContent*/();
    		break;
    	case "cmd_ld_file":
    		if (panel.d1/*showSaveContent*/() == true)
    		{
    			panel.mD1/*loadDataSource*/();
    		}
    		break;
    	case "cmd_buildcube":
    		panel.mm1/*buildCube*/();
    		break;
    	case "cmd_add_metric":
   			panel.mm2/*appendNewMetric*/();
    		break;
    	case "cmd_style":
    		var dlg = new IG$/*mainapp*/._I9c/*cubeStyle*/({
    			styleinfo: panel.MM1/*cubemeta*/.styles
    		});
    		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
    		break;
    	case "cmd_sql":
    		if (panel.d1/*showSaveContent*/() == true)
    		{
    			panel.mD2/*loadSQLSource*/();
    		}
    		break;
    	case "cmd_db_unload":
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
    		req.init(me, 
				{
		            ack: "17",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({cubeuid: me.uid, action: "unlockcube"}, "cubeuid;action"),
	                mbody: "<smsg></smsg>"
		        }, me, function() {
		        	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('B_SUCCESS'), null, panel, 0, "success");
		        }, null);
			req._l/*request*/();
    		break;
    	case "cmd_db_load":
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
    		req.init(me, 
				{
		            ack: "17",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({cubeuid: me.uid, action: "loadcube"}, "cubeuid;action"),
	                mbody: "<smsg></smsg>"
		        }, me, function() {
		        	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('B_SUCCESS'), null, panel, 0, "success");
		        }, null);
			req._l/*request*/();
    		break;
    	case "cmd_db_destroy":
    		IG$/*mainapp*/._I55/*confirmMessages*/("Confirm delete DB?", "Click ok button to delete molap db content.", me.lm1/*doDeleteDB*/, me, me);
    		break;
    	case "cmd_delete":
    		me.sk5m/*deleteSelected*/();
    		break;
    	}
    },
    
    sk5m/*deleteSelected*/: function() {
    	var i,
    		d,
    		c,
    		o, panel=this;
    		
    	c = "";
    	o = "<smsg><Info option='delete'/></smsg>";
    	for (i=this.dataview.store.data.items.length-1; i>=0; i--)
    	{
    		d = this.dataview.store.data.items[i].data;
    		if (d.selected == true && d.uid)
    		{
    			c += "<item uid='" + d.uid + "' name='" + d.name + "' type='" + d.type + "'/>";
    		}
    		else if (d.selected)
    		{
    			this.dataview.store.remove(this.dataview.store.data.items[i]);
    		}
    	}
    	
    	if (c != "")
    	{
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
	    	req.init(panel, 
				{
		            ack: "30",
		            payload: "<smsg>" + c + "</smsg>",
		            mbody: o
		        }, panel, panel.rs_sK4Ld/*deleteCubeMetrics*/, null);
			req._l/*request*/();
    	}
	},
	
	rs_sK4Ld/*deleteCubeMetrics*/: function(xdoc) {
		var i,
			d;
			
		for (i=this.dataview.store.data.items.length-1; i>=0; i--)
		{
			d = this.dataview.store.data.items[i].data;
			if (d.selected == true)
			{
				this.dataview.store.remove(this.dataview.store.data.items[i]);
			}
		}
	},
    
    lm1/*doDeleteDB*/: function(btn) {
    	var me = this,
    		req;
    	if (btn == "yes")
    	{
	    	req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "17",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({cubeuid: me.uid, action: "51"}, "cubeuid;action"),
	                mbody: "<smsg></smsg>"
		        }, me, function() {
		        	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('B_SUCCESS'), null, me, 0, "success");
		        }, null);
			req._l/*request*/();
		}
    },
    
    mD2/*loadSQLSource*/: function() {
    	var me = this,
    		dataview = this.dataview,
    		items = [],
    		item, i,
    		r;
    		
    	for (i=0; i < dataview.store.data.items.length; i++)
    	{
    		r = dataview.store.data.items[i];
    		item = {
    			name: r.get("name"),
    			uid: r.get("uid")
    		};
    		items.push(item);
    	}
    	var dlg = new IG$/*mainapp*/.mA$_c/*mcube_sql*/({
    		uid: me.uid,
    		columns: items,
    		sqldata: me.sqldata,
    		callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, this.rs_mD2/*loadSQLSource*/)
    	});
    	IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
    },
    
    rs_mD2/*loadSQLSource*/: function(option) {
    	var me = this,
    		i, columns,
    		dataview = me.dataview,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(), 
    		measeq = 0, dimseq = 1,
    		
    		item, key, items = {}, obj,
    		cubemeta = me.MM1/*cubemeta*/;
    		
    	me.sqldata = {
    		dbpool: option.dbpool,
    		columns: option.columns,
    		sql: option.sql
    	};
    	
    	cubemeta.sqldata = me.sqldata;
    	
    	columns = me.sqldata.columns;
    	
    	if (option.buildcube == true)
    	{
    		me.setLoading(true);
    		
	    	cnt = "<smsg>";
	    	
	    	for (i=0; i < option.columns.length; i++)
	    	{
	    		cnt += "<column uid='" + (option.columns[i].uid || "") + "' name='" + option.columns[i].name + "' datatype='" + option.columns[i].datatype + "' isuse='" + (option.columns[i].selected == true ? "T" : "F") + "'/>";
	    	}
	    	
	    	cnt += "</smsg>"
	    	
	    	obj = "<smsg><item uid='" + me.uid + "' action='sqlcube' dbpool='" + option.dbpool + "'>";
	    	obj += "<SQL><![CDATA[" + option.sql + "]]></SQL>";
	    	obj += "</item></smsg>";
	    	
	    	req.init(me, 
				{
		            ack: "17",
	                payload: obj,
	                mbody: cnt
		        }, me, me.rs_mD2a/*loadSQLSource*/, null);
			req._l/*request*/();
    	}
    },
    
    rs_mD2a/*loadSQLSource*/: function(xdoc) {
    	var me = this,
    		i,
    		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
    		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
    		dataview = me.dataview,
    		prop, items = {}, key,
    		item,
    		cpath = me.cubeaddress,
    		cleng = (cpath) ? cpath.length : 0;
    		
    	for (i=0; i < dataview.store.data.items.length; i++)
		{
			key = dataview.store.data.items[i].get("uid");
			items[key] = dataview.store.data.items[i];
		}
    		
    	for (i=0; i < tnodes.length; i++)
    	{
    		item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
    		item.type = (item.datatype == "number") ? "Measure" : "Metric";
    		item.datatype = (item.datatype == "number") ? "numeric" : "string";
    		item.metrictype = item.type;
    		item.fieldname = item.name;
    		item.sequence = item.sequence;
    		item.uniquekey = item.uniquekey; // (item.datatype == "numeric") ? measeq++ : -1;
    		item.isnew = items[key] ? false : true;

    		item.parentnodepath = cpath;
    		item.relpath = cpath.substring(cleng);
	    	item.nodepath = item.parentnodepath + "/" + item.name;
	    	
	    	key = item.uid;
	    	
	    	if (items[key])
	    	{
	    		items[key].set("type", item.type);
	    		items[key].set("datatype", item.datatype);
	    		items[key].set("metrictype", item.metrictype);
	    		items[key].set("fieldname", item.fieldname);
	    		items[key].set("uniquekey", item.uniquekey);
	    		items[key].set("sequence", item.sequence);
	    	}
	    	else
	    	{
	    		dataview.store.add(item);
	    	}
    	}
    },
    
    mD1/*loadDataSource*/: function() {
    	var me = this,
    		dataview = this.dataview,
    		i, r, item, items=[];
    	
    	for (i=0; i < dataview.store.data.items.length; i++)
    	{
    		r = dataview.store.data.items[i];
    		item = {
    			name: r.get("name"),
    			uid: r.get("uid")
    		};
    		items.push(item);
    	}
    	
    	var dlg = new IG$/*mainapp*/.M$d10/*mcubefileloader*/({
    		uid: me.uid,
    		columns: items,
    		mm: me.MM1/*cubemeta*/,
    		callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, this.rs_mD1/*loadDataSource*/)
    	});
    	IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
    },
    
    rs_mD1/*loadDataSource*/: function(option) {
    	var me = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(), 
    		cnt, i,
    		buildcube = option.buildcube;
    	
    	if (!buildcube)
    	{
    		me.rs_mD1b/*applyCubeData*/(option.columns);
    	}
    	else
    	{
    		me.setLoading(true);
    		
	    	cnt = "<smsg>";
	    	
	    	for (i=0; i < option.columns.length; i++)
	    	{
	    		cnt += "<column uid='" + option.columns[i].uid + "' name='" + option.columns[i].name + "' datatype='" + option.columns[i].datatype + "' isuse='" + (option.columns[i].selected == true ? "T" : "F") + "' ismeasure='" + (option.columns[i].ismeasure == true ? "T" : "F") + "'/>";
	    	}
	    	
	    	cnt += "</smsg>"
	    	
	    	req.init(me, 
				{
		            ack: "17",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, action: "38", datafile: option.datafile, delimiter: option.delimiter, datatransformer: option.datatransformer}, "uid;action;datafile;delimiter;datatransformer"),
	                mbody: cnt
		        }, me, me.rs_mD1a/*loadDataFile*/, null);
			req._l/*request*/();
		}
    },
    
    rs_mD1b/*applyCubeData*/: function(columns) {
    	var me = this,
			i, items = {}, item, key, ukey,
			dataview = me.dataview,
			cpath = me.cubeaddress,
			cleng = (cpath) ? cpath.length : 0,
			dimseq = 1, measeq = 0;
		
		
		for (i=0; i < dataview.store.data.items.length; i++)
		{
			key = dataview.store.data.items[i].get("name");
			items[key] = dataview.store.data.items[i];
		}
		
    	for (i=0; i < columns.length; i++)
    	{
    		item = columns[i];
    		item.type = (item.datatype == "number") ? "Measure" : "Metric";
    		item.datatype = (item.datatype == "number") ? "numeric" : "string";
    		item.metrictype = item.type;
    		item.fieldname = item.name;
    		item.sequence = (item.datatype == "numeric") ? 0 : dimseq++;
    		item.uniquekey = (item.datatype == "numeric") ? measeq++ : -1;
    		item.isnew = true;
    		item.parentnodepath = cpath;
    		item.relpath = cpath.substring(cleng);
	    	item.nodepath = item.parentnodepath + "/" + item.name;
	    	
	    	if (item.ismeasure == "T")
	    		continue;
	    	
	    	key = item.name;
	    	
	    	if (items[key])
	    	{
	    		items[key].set("type", item.type);
	    		items[key].set("datatype", item.datatype);
	    		items[key].set("metrictype", item.metrictype);
	    		items[key].set("fieldname", item.fieldname);
	    		items[key].set("uniquekey", item.uniquekey);
	    		items[key].set("sequence", item.sequence);
	    	}
	    	else
	    	{
	    		dataview.store.add(item);
	    	}
    	}
    },
    
    rs_mD1a/*loadDataFile*/: function(xdoc) {
    	var me = this,
    		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
			i, items = {}, item, key, ukey,
			dataview = me.dataview,
			cpath = me.cubeaddress || "",
			cleng = (cpath) ? cpath.length : 0;
    	
    	me.setLoading(false);
    	
    	if (tnodes)
    	{
    		for (i=0; i < dataview.store.data.items.length; i++)
    		{
    			key = dataview.store.data.items[i].get("uid"); // + "_" + (ukey ? ukey : "");
    			items[key] = dataview.store.data.items[i];
    		}
    		
	    	for (i=0; i < tnodes.length; i++)
	    	{
	    		item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
	    		item.type = (item.ismeausre == "T") ? "Measure" : "Metric";
	    		item.datatype = (item.ismeasure == "T") ? "numeric" : "string";
	    		item.metrictype = item.type;
	    		item.fieldname = item.name;
	    		item.sequence = item.sequence;
	    		item.uniquekey = item.uniquekey;
	    		item.isnew = true;
	    		item.parentnodepath = cpath;
	    		item.relpath = cpath.substring(cleng);
		    	item.nodepath = item.parentnodepath + "/" + item.name;
		    	
		    	if (item.ismeasure == "T")
		    		continue;
		    	
		    	key = item.uid;
		    	
		    	if (items[key])
		    	{
		    		items[key].set("type", item.type);
		    		items[key].set("datatype", item.datatype);
		    		items[key].set("metrictype", item.metrictype);
		    		items[key].set("fieldname", item.fieldname);
		    		items[key].set("uniquekey", item.uniquekey);
		    		items[key].set("sequence", item.sequence);
		    	}
		    	else
		    	{
		    		dataview.store.add(item);
		    	}
	    	}
    	}
    },
    
    mm1/*buildCube*/: function() {
    	var panel = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		dataview = panel.dataview,
    		store = dataview.store,
    		item,
    		i,
    		haserror = false;
    		
    	for (i=0; i < store.data.items.length; i++)
    	{
    		item = store.data.items[i];
    		if (item.get("type") == "Metric" && !item.get("uid"))
    		{
    			haserror = true;
    			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Save Cube before build multi dimensional database", null, null, 0, "success");
    			break;
    		}
    	}
    	
    	if (haserror == false)
    	{
			req.init(panel, 
				{
		            ack: "17",
	                payload: "<smsg><item cubeuid='" + panel.uid + "' action='BuildCube'/></smsg>",
	                mbody: "<smsg></smsg>"
		        }, panel, panel.rs_mm1/*buildCube*/, null);
			req._l/*request*/();
		}
    },
    
    rs_mm1/*buildCube*/: function(xdoc) {
    	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
    },
    
    mm2/*appendNewMetric*/: function() {
    	var panel = this,
    		dataview = panel.dataview,
    		selmodel = dataview.getSelectionModel(),
    		cubeaddress = panel.cubeaddress,
    		cleng = (cubeaddress) ? cubeaddress.length : 0,
    		cpath, sel, item,
    		blanknode;
    	
    	cpath = cubeaddress;
    	
    	if (selmodel.selected.items.length > 0)
    	{
    		sel = selmodel.selected.items[0];
    		if (sel.get("type") == "blank")
    		{
	    		cpath = sel.get("nodepath");
	    		blanknode = sel;
	    	}
	    	else
	    	{
	    		cpath = sel.get("nodepath");
	    		cpath = cpath.substring(0, cpath.lastIndexOf("/"));
	    	}
    	}
    	
    	item = {
    		isnew: true,
    		name: panel.nameprefix + (panel.nindex++),
    		uid: null,
    		parentnodepath: cpath,
    		relpath: cpath.substring(cleng),
    		type: "Metric"
    	};
    	
    	item.nodepath = item.parentnodepath + "/" + item.name;
    	
    	dataview.store.add(item);
    	
    	if (blanknode)
    	{
    		dataview.store.remove(blanknode);
    	}
    },
    
    mm3/*removeItem*/: function(rowindex, colindex) {
    	var panel = this,
    		dataview = panel.dataview,
    		i, item, titem, bexist = false;
    	
    	item = dataview.store.getAt(rowindex);
    	
    	if (item.get("type") == "Metric")
    	{
	    	dataview.store.removeAt(rowindex);
	    	if (item.get("uid"))
	    	{
		    	panel.ditems.push({
		    		uid: item.get("uid"),
		    		name: item.get("name"),
		    		nodepath: item.get("nodepath"),
		    		type: item.get("type")
		    	});
		    }
	    	// if there's no content
	    	if (item.get("relpath") != "")
	    	{
		    	for (i=0; i < dataview.store.data.items.length; i++)
		    	{
		    		titem = dataview.store.data.items[i];
		    		if (titem.get("relpath") == item.get("relpath"))
		    		{
		    			bexist = true;
		    			break;
		    		}
		    	}
		    	
		    	if (bexist == false)
		    	{
		    		titem = {
		    			type: "blank",
		    			name: "No items defined",
		    			relpath: item.get("relpath"),
		    			nodepath: item.get("nodepath")
		    		};
		    		
		    		dataview.store.add(titem);
		    	}
		    }
	    }
    },
    
    mm4/*editItemData*/: function(row, col) {
    	var panel = this,
    		dataview = panel.dataview,
    		i, item,
    		uid;
    		
    	item = dataview.store.getAt(row);
    	uid = item.get("uid");
    	
    	if (item.get("type") == "Metric" || item.get("type") == "Measure")
    	{
    		if (uid)
    		{
	    		var pop = new IG$/*mainapp*/._IC2/*multimeasureeditor*/({
	    			uid: uid,
	    			sequence: item.get("sequence"),
	    			uniquekey: item.get("uniquekey"),
	    			itemtype: item.get("type")
	    		});
	    		IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
	    	}
	    	else
	    	{
	    		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("L_ERR_SAVE"), null, null, 1, "error");
	    	}
    	}
    },
    
    mm5/*saveCubeMetrics*/: function() {
    	var panel = this,
    		dataview = panel.dataview,
    		store = dataview.store,
    		i, item,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		ditems = panel.ditems,
    		addr = "<smsg>", content = "<smsg>",
    		ncnt = 0,
    		cpath;
    		
    	for (i=0; i < store.data.items.length; i++)
    	{
    		item = store.data.items[i];
    		if (item.get("type") == "Metric" || item.get("type") == "Measure")
    		{
	    		cpath = item.get("nodepath");
	    		cpath = cpath.substring(0, cpath.lastIndexOf("/"));
	    		cpath = cpath + "/" + item.get("name");
	    		addr += "<item nodepath='" + cpath + "' name='" + item.get("name") + "' type='" + item.get("type") + "'";
	    		if (item.get("isnew") == true)
	    		{
	    			addr += " pid='" + this.uid + "' uid='" + cpath + "' reserved_uid='" + item.get("uid") + "'";
	    		}
	    		else
	    		{
	    			addr += " uid='" + (item.get("uid") ? item.get("uid") : cpath) + "'";
	    		}
	    		addr += "/>";
	    		content += "<item><objinfo cubeuid='" + panel.uid + "' sequence='" + item.get("sequence") + "'";
	    		if (item.get("uniquekey"))
	    		{
	    			content += " uniquekey='" + item.get("uniquekey") + "'";
	    		}
	    		content += "/></item>";
	    		ncnt++;
	    	}
    	}
    	
    	for (i=0; i < ditems.length; i++)
    	{
    		item = ditems[i];
    		addr += "<item option='delete' uid='" + item.uid + "'/>";
    		content += "<item/>";
    		ncnt++;
    	}
    	
    	addr += "</smsg>";
    	content += "</smsg>";
    	
    	if (ncnt > 0)
    	{
    		panel.setLoading(true);
    		
			req.init(panel, 
				{
		            ack: "30",
	                payload: addr,
	                mbody: content
		        }, panel, panel.rs_mm5/*saveCubeMetrics*/, null);
			req._l/*request*/();
		}
    },
    
    rs_mm5/*saveCubeMetrics*/: function(xdoc) {
    	var panel = this,
    		dataview = panel.dataview,
    		store = dataview.store,
    		item,
    		troot = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
    		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(troot),
    		nproc = 0,
    		i;
    		
    	if (tnodes && tnodes.length > 0)
    	{
    		for (i=0; i < store.data.items.length; i++)
    		{
    			item = store.data.items[i];
    			if (item.get("type") == "Metric" || item.get("type") == "Measure")
    			{
    				if (!item.get("uid"))
    				{
    					item.set("uid", IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[nproc], "uid"));
    				}
    				nproc++;
    			}
    		}
    	}
    	panel.ditems = [];
    	
    	panel.mm6/*saveCubeMeta*/();
    },
    
    mm6/*saveCubeMeta*/: function() {
    	var panel = this,
    		content,
    		cubemeta = panel.MM1/*cubemeta*/,
    		i,
    		dataview = panel.dataview,
    		store = dataview.store, item;
    	
    	cubemeta.items = [];
    	
    	for (i=0; i < store.data.items.length; i++)
		{
			item = store.data.items[i];
			if (item.get("type") == "Metric" || item.get("type") == "Measure")
			{
				cubemeta.items.push({
					name: item.get("name"),
					type: item.get("type"),
					nodepath: item.get("nodepath"),
					uid: item.get("uid"),
					metrictype: item.get("metrictype") || "",
					stylename: item.get("stylename") || "",
					sequence: item.get("sequence") || "",
					uniquekey: item.get("uniquekey") || "",
					fieldname: item.get("fieldname") || ""
				});
			}
		}
		
    	content = cubemeta.m2/*getXMLString*/.call(cubemeta);
    	
    	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	req.init(panel, 
			{
	            ack: "31",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
	            mbody: content
	        }, panel, panel.rs_mm6/*saveCubeMeta*/, null);
		req._l/*request*/();
    },
    
    rs_mm6/*saveCubeMeta*/: function(xdoc) {
    	this.setLoading(false);
    	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
    }
});
IG$/*mainapp*/.M$d10/*mcubefileloader*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	
	"layout": 'fit',
	
	closable: false,
	resizable:true,
	
	width: 450,
	height: 400,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			datafiles = me.down("[name=datafiles]"),
			delimiter = me.down("[name=delimiter]"),
			columnlist = me.down("[name=columnlist]"),
			datatransformer = me.down("[name=datatransformer]"),
			i, c, s,
			buildcube = me.down("[name=buildcube]").getValue(),
			opt = {
				datafile: datafiles.getValue(),
				delimiter: delimiter.getValue(),
				columns: [],
				buildcube: buildcube,
				datatransformer: datatransformer.getValue()
			};
		
		if (!opt.datafile)
		{
			return;
		}
		
		if (me.mm && me.mm.dataloader && me.mm.dataloader.option)
		{
			me.mm.dataloader.option.datafile = opt.datafile;
			me.mm.dataloader.option.delimiter = opt.delimiter;
			me.mm.dataloader.option.datatransformer = opt.datatransformer;
		}
		
		for (i=0; i < columnlist.store.data.items.length; i++)
		{
			s = columnlist.store.data.items[i];
			c = {
				name: s.get("name"),
				datatype: s.get("datatype"),
				selected: s.get("selected"),
				mcuid: s.get("mcuid"),
				ismeasure: s.get("ismeasure")
			};
			opt.columns.push(c);
		}
		
		if (opt.columns.length == 0)
		{
			return;
		}
		
		if (me.callback)
		{
			me.callback.execute(opt);
		}
		
		me.close();
	},
	
	Jo0/*initApp*/: function() {
		var me = this,
			delimiter = me.down("[name=delimiter]"),
			scancount = me.down("[name=scancount]"),
			datatransformer = me.down("[name=datatransformer]");
			
		if (me.mm && me.mm.dataloader && me.mm.dataloader.option)
		{
			delimiter.setValue(me.mm.dataloader.option.delimiter || ",");
			scancount.setValue(me.mm.dataloader.option.scancount || 100);
			datatransformer.setValue(me.mm.dataloader.option.datatransformer);
		}
		this.Jo1/*loadTable*/();
	},
	
	Jo1/*loadTable*/: function() {
		var panel = this;

		// panel.setLoading(true, true);
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
				ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, option: "datafiles"}, "uid;option"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
	        }, panel, panel.rs_Jo1/*loadTable*/, null);
		req._l/*request*/();
	},
	
	rs_Jo1/*loadTable*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
			i, j, dbs = [],
			datafiles = me.down("[name=datafiles]"),
			cnodes, unode, col;
		
		dbs.push({
			name: "Select File",
			value: ""
		});
		
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				dbs.push({
					name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
					value: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name")
				});
			}
		}
		
		datafiles.store.loadData(dbs);
		datafiles.setValue("");
	},
	
	Jo3/*scanData*/: function() {
		var me = this,
			datafiles = me.down("[name=datafiles]"),
			delimiter = me.down("[name=delimiter]"),
			scancount = me.down("[name=scancount]"),
			datatransformer = me.down("[name=datatransformer]"),
			option = {
				datafile: datafiles.getValue(),
				delimiter: delimiter.getValue(),
				scancount: scancount.getValue(),
				datatransformer: datatransformer.getValue()
			},
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		if (!option.datafile)
		{
			return;
		}
		
		req.init(me, 
			{
	            ack: "17",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, action: "37", datafile: option.datafile, delimiter: option.delimiter, scancount: option.scancount, scanheader: "T", datatransformer: option.datatransformer}, "uid;action;datafile;delimiter;scancount;scanheader;datatransformer"),
                mbody: "<smsg></smsg>"
	        }, me, me.rs_Jo3/*scanData*/, null);
		req._l/*request*/();
	},
	
	rs_Jo3/*scanData*/: function(xdoc) {
		var me = this,
			columnlist = me.down("[name=columnlist]"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = (tnode) ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			items = [],
			item, i,
			cmap = {};
			
			
		for (i=0; i < me.columns.length; i++)
		{
			cmap[me.columns[i].name] = me.columns[i];
		}
			
		for (i=0; i < tnodes.length; i++)
		{
			item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			item.selected = true;
			
			if (cmap[item.name]) 
			{
				item.mapto = item.name;
				item.mcuid = cmap[item.name].mcuid;
			}
			items.push(item);
		}
		
		columnlist.store.loadData(items);
	},
	
	initComponent : function() {
		var me = this,
			maptocombo;
			
		me.title = IRm$/*resources*/.r1('T_DATA_UPLOAD');
		
		maptocombo = Ext.create(Ext.form.field.ComboBox, {
			xtype: "combobox",
			name: "maptocombo",
			queryMode: "local",
			displayField: "name",
			labelField: "name",
			valueField: "mcuid",
			editable: false,
			autoSelect: true,
			triggerAction: "all",
			selectOnTab: true,
			store: {
				xtype: "store",
				fields: [
					"name", "mcuid"
				],
				data: me.columns
			},
			lazyRender: true,
			listClass: "x-combo-list-small"
		});
		
		me.maptocombo = maptocombo;
		
		Ext.apply(this, {
			"layout": {
				type: "vbox",
				align: "stretch"
			},
			
			bodyStyle: "padding:10px",
			border: 1,
			
			items: [
			    {
			    	xtype: 'form',
			    	name: 'mform',
			    	customowner: this,
			    	layout: "anchor",
			    	border: 0,
			    	defaults: {
			    		anchor: "100%"
			    		
			    	},
			    	items: [
	  	                {
	  	                	xtype: "combobox",
	  	                	fieldLabel: "Delimiter",
			    	    	name: "delimiter",
			    	    	queryMode: "local",
	            	    	autoSelect: true,
	            	    	autoScroll: true,
	            	    	editable: false,
	            	    	labelField: "name",
	            	    	displayField: "name",
	            	    	valueField: "value",
	            	    	store: {
	            	    		fields: [
	            	    			"name", "value"
	            	    		],
	            	    		data: [
	            	    		    {name: ",", value: ","},
	            	    		    {name: "Tab", value: "tab"},
	            	    		    {name: "space", value: "space"},
	            	    		    {name: "|", value: "|"}
	            	    		]
	            	    	}
	  	                },
	  	                {
	  	                	xtype: "combobox",
	  	                	name: "datafiles",
	  	                	fieldLabel: "DataFiles",
	  	                	queryMode: 'local',
		  	      			displayField: 'name',
		  	      			valueField: 'value',
		  	      			editable: false,
		  	      			autoSelect: true,
		  	      			store: {
	  	                		xtype: "store",
	  	                		fields: [
									"name", "value"
	  	                		]
	  	                	}
	  	                },
	  	                {
	  	                	xtype: "fieldcontainer",
	  	                	fieldLabel: "Scan",
	  	                	layout: "hbox",
	  	                	items: [
	  	                	    {
	  	                	    	xtype: "numberfield",
	  	                	    	name: "scancount",
	  	                	    	value: 100,
	  	                	    	minValue: 0,
	  	                	    	maxValue: 10000,
	  	                	    	flex: 1
	  	                	    },
	  	                	    {
	  	                	    	xtype: "button",
	  	                	    	text: "Scan",
	  	                	    	handler: function() {
	  	                	    		this.Jo3/*scanData*/();
	  	                	    	},
	  	                	    	scope: this
	  	                	    }
	  	                	]
	  	                },
	  	                {
					    	xtype: "textfield",
					    	name: "datatransformer",
					    	fieldLabel: "Data transform class"
					    },
	  	                {
	  	                	xtype: "checkbox",
	  	                	name: "buildcube",
	  	                	fieldLabel: "Build Cube",
	  	                	boxLabel: "buildcube",
	  	                	checked: true
	  	                }
			    	]
			    },
			    {
                	xtype: "gridpanel",
                	name: "columnlist",
                	flex: 1,
                	store: {
                		xtype: "store",
                		fields: [
                			"name", "datatype", "ismeasure", "selected", "mapto", "uid", "mcuid"
                		]
                	},
                	plugins: [
						Ext.create("Ext.grid.plugin.CellEditing", {
							clicksToEdit: 0,
							listeners: {
								edit: function(editor, e, opts) {
									if (e.field == "mapto")
									{
										var ri = e.rowIdx,
											grd = e.grid,
											r = e.record,
											i;
										
										r.set("mcuid", "");
										
										for (i=0; i < me.columns.length; i++)
										{
											if (me.columns[i].name == e.value)
											{
												r.set("mcuid", me.columns[i].uid);
											}
										}
									}
								}
							}
						})
                	],
                	columns: [
						{
							xtype: "gridcolumn",
							text: "Name",
							dataIndex: "name",
							flex: 2,
							editor: {
								xtype: "textfield"
							}
						},
						{
							xtype: "gridcolumn",
							dataIndex: "datatype",
							width: 120,
							text: "DataType",
							field: {
								xtype: "combobox",
								queryMode: "local",
								displayField: "name",
								valueField: "value",
								editable: false,
								autoSelect: true,
								triggerAction: "all",
								selectOnTab: true,
								store: {
									xtype: "store",
									fields: ["name", "value"],
									data: [
										{name: "String", value: "string"},
										{name: "Numeric", value: "number"}
									]
								},
								lazyRender: true,
								listClass: "x-combo-list-small"
							}
						},
						{
							xtype: "checkcolumn",
							dataIndex: "ismeasure",
							width: 120,
							text: "Measure"
						},
						{
							xtype: "gridcolumn",
							dataIndex: "mapto",
							flex: 1,
							text: "Map to",
							editor: maptocombo
						},
						{
							xtype: "gridcolumn",
							dataIndex: "uid",
							hidden: true
						},
						{
							xtype: "checkcolumn",
							dataIndex: "selected",
							width: 40,
							text: "Use"
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
				},
				{
					text: IRm$/*resources*/.r1('B_CANCEL'),
					handler: function() {
						this.close();
					},
					scope: this
				}
			],
			
			listeners: {
				afterrender: function(panel) {
					var delimiter = this.down("[name=delimiter]");
					delimiter.setValue(",");
					
					panel.Jo0/*initApp*/.call(panel);
				}
			}
		});
		
		IG$/*mainapp*/.M$d10/*mcubefileloader*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._IC3/*multimetric*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {

	layout: "fit",
	
	uid: null,
	
	parentnodepath: null,
	itemtype: null,
	parentuid: null,
	
	callback: null,
	objinfo: null,
	seq: 0,
	bodyPadding: 10,
	
	initComponent : function() {
		var panel = this;
		
		$s.apply(this, {
			items: [
				{
					xtype: "gridpanel",
					name: "elemtree",
					store: {
						xtype: "store",
						fields: ["name", "ukey"]
					},

					selModel: Ext.create(Ext.selection.CheckboxModel, {
						checkSelector: ".x-grid-cell"
					}),
					
					tbar: [
						{
						    iconCls: 'icon-toolbar-save',
							tooltip: 'Save Content',
						    handler: function(){
								this.U1/*storeContent*/.call(this, null);
							},
						    scope: this
						}, 
						'-', 
						{
						    iconCls: 'icon-toolbar-add',
							tooltip: 'Add Node',
							hidden: true,
						    handler: function(){
								var me = this;
								me.Mex/*appendSelection*/.call(me);
							},
						    scope: this
						}, 
						{
							iconCls: 'icon-toolbar-remove',
							tooltip: 'Delete Node',
							hidden: true,
							handler: function() {
								var me = this;
								me.Mrx/*removeSelection*/.call(me);
							},
							scope: this
						}
					],
					plugins: [
						Ext.create("Ext.grid.plugin.CellEditing", {
							clicksToEdit: false
						})
					],
					columns: [
						{
							xtype: "gridcolumn",
							text: "Element name",
							dataIndex: "name",
							flex: 1,
							editor: {
								allowBlank: false
							}
						},
						{
							xtype: "gridcolumn",
							text: "Unique value",
							dataIndex: "ukey",
							
							width: 80,
							editor: {
								allowBlank: false
							}
						},
						
						{
							xtype: "actioncolumn",
							hidden: true,
							width: 80,
							items: [
								{
									// icon: "./images/gears.png",
									iconCls: "icon-grid-config",
									tooltip: IRm$/*resources*/.r1("B_CONFIG_ITEM"),
									handler: function (grid, rowIndex, colIndex, item, e, record) {
										panel.Mkx/*updateValues*/(rowIndex, record, "edit");
									},
									scope: panel
								},
								{
									// icon: "./images/delete.png",
									iconCls: "icon-grid-delete",
									tooltip: IRm$/*resources*/.r1("B_DELETE_ITEM"),
									handler: function (grid, rowIndex, colIndex, item, e, record) {
										panel.Mkx/*updateValues*/(rowIndex, record, "delete");
									},
									scope: panel
								}
							]
						}
					],
					listeners: {
						checkchange: function(node, checked) {
							node.set("chekced", checked);
						}
					}
				}
			],
		
			U1/*storeContent*/: function(bclose) {
				var panel = this,
					xdoc = "<item uid='" + this.uid + "'>",
					elemtree = panel.down("[name=elemtree]"),
					store = elemtree.store,
					root = store.getRootNode(),
					mdata;
				
				panel.setLoading(true);
				mdata = panel.U3/*getElementContent*/(root, null);
				
				xdoc += "<objinfo" + IG$/*mainapp*/._I20/*XUpdateInfo*/(panel.objinfo, "cubeuid", "s") + "/>";
				xdoc += "<Elements lseq='" + panel.seq + "'><![CDATA[" + mdata + "]]></Elements>";
				xdoc += "</item>";
				
				var req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(panel, 
					{
		                ack: "31",
			            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
			            mbody: '<smsg>' + xdoc + '</smsg>'
		            }, panel, panel.rs_U1/*storeContent*/, null, bclose);
				req._l/*request*/();
			},
			
			rs_U1/*storeContent*/: function(xdoc, bclose) {
				this.U1m/*buildCube*/(bclose);
			},
			
			U1m/*buildCube*/: function(bclose) {
				var panel = this,
					req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(panel, 
					{
			            ack: "17",
		                payload: "<smsg><item uid='" + panel.uid + "' cubeuid='" + panel.objinfo.cubeuid + "' action='UpdateMetric'/></smsg>",
		                mbody: "<smsg></smsg>"
			        }, panel, panel.rs_U1m/*buildCube*/, null, bclose);
				req._l/*request*/();
			},
			
			rs_U1m/*buildCube*/: function(xdoc, bclose) {
				var panel = this;
				panel.setLoading(false);
				
				if (bclose)
				{
					bclose.close();
				}
				else
				{
					IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SAVED'), null, null, 0, "success");
				}
			},
			
			U3/*getElementContent*/: function(pnode, ppnode) {
				var me = this,
					i,
					datanode = "",
					enode,
					seq;
				
				for (i=0; i < pnode.childNodes.length; i++)
				{
					enode = pnode.childNodes[i];
					
					seq = enode.get("seq");
					
					datanode += "" + seq + "," + (ppnode ? ppnode.get("seq") : "") + "," + enode.get("name") + "|";
					
					if (enode.childNodes && enode.childNodes.length > 0)
					{
						datanode += this.U3/*getElementContent*/(enode, enode);
					}
				}
				return datanode; 
			},
			
			U2/*refreshContent*/: function() {
				var panel = this;
				// this.mtree.selectedNode = [];
				
				var req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(panel, 
					{
			            ack: "5",
		                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'diagnostics'})
			        }, panel, panel.rs_U2/*refreshContent*/, null);
				req._l/*request*/();
			},
			
			rs_U2/*refreshContent*/: function(xdoc) {
				var panel = this,
					snode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					onode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/objinfo"),
					lseq,
					mitems = [], mitem,
					i, s;
				
				if (onode)
				{
					panel.objinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(onode);
				}
				
				if (panel.objinfo && panel.objinfo.sequence)
				{
					panel.m1$a/*updateTreeNode*/(mitems);
				}
			},
			
			U4/*appendElementTree*/: function(childs, unode) {
				for (var i=0; i < childs.length; i++)
				{
					var nodeid = IG$/*mainapp*/._I1b/*XGetAttr*/(childs[i], "id");
					var nodetext = IG$/*mainapp*/._I1b/*XGetAttr*/(childs[i], "text");
					var snode = this.mtree.appendNodeElement.call(this.mtree, unode, nodeid, nodetext);
					
					var subchilds = IG$/*mainapp*/._I26/*getChildNodes*/(childs[i]);
					if (subchilds && subchilds.length > 0)
					{
						this.U4/*appendElementTree*/(subchilds, snode);
					}
				}
			},
			
			Mkx/*updateValues*/: function(rowindex, record, cmd) {
				var me = this,
					elemtree = me.down("[name=elemtree]"),
					store = elemtree.store;
					
				if (cmd == "delete")
				{
					if (record.get("root") !== true)
					{
						record.remove();
					}
				}
			},
			
			m1$a/*updateTreeNode*/: function(data) {
				var me = this,
					panel = me,
					item = this.clItem,
					items, objinfo = me.objinfo;
				
				panel.setLoading(true);
				
				var req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(panel, 
					{
			            ack: "17",
		                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid, sequence: objinfo.sequence, action: "55"}, "uid;sequence;action"),
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'standard'})
			        }, panel, panel.rs_m1$a/*updateTreeNode*/, null);
				req._l/*request*/();
			},
			
			rs_m1$a/*updateTreeNode*/: function(xdoc) {
				var me = this,
					tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
					items = [], item,
					elemtree = me.down("[name=elemtree]"),
					i;
				
				me.setLoading(false);
				
				for (i=0; i < tnodes.length; i++)
				{
					item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
					item.name = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
					items.push(item);
				}
				
				elemtree.store.loadData(items);
			},
			
			mm/*rebuildTree*/: function(data) {
				var r = [],
					ks = {},
					p;
					
				for (i=0; i < data.length; i++)
				{
					ks[data[i].seq] = data[i];
					if (data[i].pnode != null && ks[data[i].pnode])
					{
						p = ks[data[i].pnode];
						p.leaf = false;
						delete p.checked;
						data[i].leaf = true;
						data[i].checked = false;
						p.children = p.children || [];
						p.children.push(data[i]);
					}
					else
					{
						data[i].leaf = true;
						data[i].checked = false;
						r.push(data[i]);
					}
				}
				return r;
			},
			
			Mex/*appendSelection*/: function() {
				var me = this,
					elemtree = me.down("[name=elemtree]"),
					store = elemtree.store,
					selmodel = elemtree.getSelectionModel(),
					pvaluedesc, pvalues,
					sel, ncell, i, nname, nmax = 0, cname;
				
				if (selmodel.selected.items.length > 0)
				{
					sel = selmodel.selected.items[0];
				}
				else
				{
					sel = elemtree.getRootNode();
				}
				
				pvaluedesc = sel.get("valuedesc");
				pvalues = sel.get("values");
				
				sel.set("valuedesc", "");
				sel.set("values", "");
				sel.set("leaf", false);
				
				nname = "new item ";
				
				for (i=0; i < sel.childNodes.length; i++)
				{
					cname = sel.childNodes[i].get("name");
					if (cname.substring(0, nname.length) == nname)
					{
						cname = cname.substring(nname.length);
						cname = Number(cname);
						if (isNaN(cname) == false)
						{
							nmax = Math.max(nmax, Number(cname) + 1);
						}
					}
				}
				
				nmax = Math.max(nmax, me.seq+1);
				me.seq = nmax;
				nname += nmax;
				
				ncell = {
					seq: nmax,
					name: nname,
					values: pvalues || "",
					valuedesc: pvaluedesc || "",
					leaf: true,
					checked: false
				};
				sel.appendChild(ncell);
				sel.expand();
			},
			
			Mrx/*removeSelection*/: function() {
				var me = this,
					elemtree = me.down("[name=elemtree]"),
					store = elemtree.store,
					root = store.getRootNode(),
					i;
					
				me.mrx/*removeSelectedRow*/(root);
			},
			
			mrx/*removeSelectedRow*/: function(root) {
				var me = this,
					i,
					node;
				
				for (i=root.childNodes.length-1; i>=0; i--)
				{
					node = root.childNodes[i];
					if (node.get("checked") == true)
					{
						root.removeChild(node);
					}
					else if (node.childNodes && node.childNodes.length > 0)
					{
						me.mrx/*removeSelectedRow*/(node);
					}
				}
			},
			
			listeners: {
				afterrender: function(ui) {
					this.U2/*refreshContent*/();
				}
			}
		});
		
		IG$/*mainapp*/._IC3/*multimetric*/.superclass.initComponent.apply(this);
	}
});

IG$/*mainapp*/._IC2/*multimeasureeditor*/ = $s.extend($s.window, {
	
	modal: true,
	
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
		var me = this;
		
		me.title = IRm$/*resources*/.r1('L_MC_ELEM_EDT');
		me.edt = new IG$/*mainapp*/._IC3/*multimetric*/({
			uid: me.uid
		});
		$s.apply(this, {
			defaults:{
				bodyStyle:'padding:0px'
			},
			
			"layout": 'fit',
			
			items: [
		    	this.edt
			],
			
			buttons:[
				{
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						var me = this,
							edt = this.edt;
						edt.U1/*storeContent*/.call(edt, this);
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
		
		IG$/*mainapp*/._IC2/*multimeasureeditor*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._IC4/*multimeasure*/ = function (config) {
	$s.apply(this, config);
	
	IG$/*mainapp*/._IC4/*multimeasure*/.superclass.constructor.call(this, {
        autoScroll:true,
        collapseFirst:false,
        closable: true,
        items: [
                {
                	html: "<div class='elementeditor'></div>"
                }
    	    ]
    });
};

function CMolapMeasure(node) {
	this.measuretype = 'COUNT';
	this.uid = null;
	this.name = null;
	this.nodepath = null;
	this.baseItem = null;
	
	this.parseMeasure = function(xdoc) {
		var snode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		this.name = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "name");
		this.nodepath = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "nodepath");
		this.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "uid");
		this.isDisinct = true;
		
		snode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/objinfo");
		if (snode)
		{
			this.measuretype = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, 'measuretype');
		}
		snode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/BaseItem");
		if (snode)
		{
			this.baseItem = {};
			this.baseItem.name = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, 'name');
			this.baseItem.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, 'uid');
			this.baseItem.nodepath = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, 'nodepath');
			this.baseItem.itemtype = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, 'type');
		}
		snode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Options");
		if (snode && snode.hasChildNodes() == true)
		{
			var child = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
			
			for (i=0; i < child.length; i++)
			{
				var tnode = child[i];
				var nodevalue = IG$/*mainapp*/._I24/*getTextContent*/(child[i]);
				switch (IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'name'))
				{
				case 'isDistinct':
					this.isDisinct = (nodevalue == 'F') ? false : true;
					break;
				}
			}
		}
	}
	
	this.getMeasureXML = function() {
		var r = '<smsg><item uid="' + this.uid + 
			'" name="' + this.name + 
			'" nodepath="' + this.nodepath + '">' + 
			'<objinfo measuretype="' + this.measuretype + '"/>';
		
		switch (this.measuretype)
		{
		case 'COUNT':
			r += '<BaseItem uid="' + this.baseItem.uid + '" nodepath="' + this.baseItem.nodepath + '" name="' + this.baseItem.name + '" type="' + this.baseItem.itemtype + '"/>';
			r += '<Options>';
			r += '<Property name="isDistinct">' + (this.isDistinct == true ? 'T' : 'F') + '</Property>';
			r += '</Options>';
			break;
		case 'SUM':
			break;
		case 'MAX':
			break;
		case 'DATE':
			break;
		}
		r += '</item></smsg>';
		
		return r;
	}
	
	if (node)
	{
		this.parseMeasure(node);
	}
}

IG$/*mainapp*/._IC4/*multimeasure*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	title: 'Make item',
	modal: true,
	region:'center',
	"layout": 'vbox',
	layoutConfig: {
		align: 'stretch'
	},
	closable: true,
	resizable:false,
	width: 400,
	height: 500,
	uid: null,
	cubeuid: null,
	
	parentnodepath: null,
	itemtype: null,
	parentuid: null,
	
	measureObj: null,
	selectCombo: null,
	
	defaults:{autoHeight:true, bodyStyle:'padding:10px'},
	
	pivotSelectionChangedHandler: function(selvalue) {
		this.measureObj.measuretype = selvalue;
		this.resetMeasureUI();
	},
	
	metricSelectedHandler: function(item) {
		this.measureObj.baseItem = item;
		this.baseItemField1.setValue(this.measureObj.baseItem.nodepath);
	},
	
	initComponent : function() {
		var panel = this;
		this.baseItemField1 = new Ext.form.TextField({
			name: 'fmetric',
			allowBlank: false
		});
		
		this.stabcontainer = new Ext.Container({
                flex: 3,
                "layout": 'card',
                items: [
                    {
                    	"layout": 'fit',
                    	layoutConfig: {
                    		align: 'stretch'
                    	},
                    	items: [{
        	        		xtype: 'fieldcontainer',
        	        		fieldLabel: 'Metric',
        	        		items: [this.baseItemField1, {
        	        			xtype: 'button',
        	        			text: '..',
        	        			handler:function() {
        							var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
        								u5x/*treeOptions*/: {
        									cubebrowse: true,
        									rootuid: panel.cubeuid
        								}
        							});
        							dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.metricSelectedHandler);
        							IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
        						},
        						scope: this
        	        		}]
                    	}],
                    	hidden: false
                    },
                    {
                    	html: 'Sum of measure type',
                    	hidden: true
                    },
                    {
                    	html: 'Max of measure type',
                    	hidden: true
                    },
                    {
                    	html: 'Date of measure type',
                    	hidden: true
                    }
                ]
        });

		$s.apply(this, {
			items: [
			    {
	                flex: 1,
	                height: 40,
	                items: [
	                    {
	                        html: '<div class="pivotSelect">Measure type:</div>',
	                        border: false,
	                        listeners: {
	    			    		afterlayout: function(ui) {
	    			    			ui.addPivotSelectHandler.call(ui);
	    			    		}
	    			    	},
	    			    	selectBoxAdded: false,
	    			    	addPivotSelectHandler: function() {
	    			    		if (this.selectBoxAdded == false)
	    			    		{
	    			    			var container = $(".pivotSelect", panel.body.dom),
	    			    				select = $('<select name="pivotSelect">'
	    			    							+ '<option value="COUNT">Count Metric</option>'
	    			    							+ '<option value="SUM">Sum data</option>'
	    			    							+ '<option value="MAX">Max data</option>'
	    			    							+ '<option value="DATE">Date Measure</option></select>');
	    			    							
	    			    			select.change(function() {
	    			    				panel.pivotSelectionChangedHandler.call(panel, this.value);
	    			    			});
	    			    		
	    			    			select.appendTo(container);
	    			    			this.selectBoxAdded = true;
	    			    			panel.selectCombo = select;
	    			    		}
	    			    	}
	                    }
	                ]
	            }, this.stabcontainer
			],
			tbar: [
				{
				    iconCls: 'icon-expand-all',
					tooltip: 'Save Content',
				    handler: function(){
						this.storeContent.call(this);
					},
				    scope: this
				}
			],
		
			storeContent: function() {
				var panel = this;
				var xdoc = panel.measureObj.getMeasureXML();
				
				var req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(panel, 
					{
			            ack: "31",
		                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
		                mbody: xdoc
			        }, panel, panel.rs_storeContent, null);
		        req._l/*request*/();
			},
			
			rs_storeContent: function (xdoc) {
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SAVED'), null, null, 0, "success");
			},
			
			refreshContent: function() {
				var panel = this;
				
				var req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(panel, 
					{
			            ack: "5",
		                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
			        }, panel, panel.rs_refreshContent, null);
			    req._l/*request*/();
			},
			
			rs_refreshContent: function (xdoc) {
				panel.measureObj = new CMolapMeasure(xdoc);
				panel.resetMeasureUI.call(panel);
			},
			
			resetMeasureUI: function() {
				this.selectCombo[0].value = this.measureObj.measuretype;
				var selvalue = this.measureObj.measuretype;
				var tindex = 0;
				switch (selvalue)
				{
				case 'COUNT':
					tindex = 0;
					if (this.measureObj.baseItem)
					{
						this.baseItemField1.setValue(this.measureObj.baseItem.nodepath);
					}
					break;
				case 'SUM':
					tindex = 1;
					break;
				case 'MAX':
					tindex = 2;
					break;
				case 'DATE':
					tindex = 3;
					break;
				}
				
				var stab = this.stabcontainer;
				for (i=0; i < stab.items.items.length; i++)
				{
					stab.items.items[i].setVisible((i == tindex ? true : false));
				}
			}
		});
		
		IG$/*mainapp*/._IC4/*multimeasure*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.MmD$m = function(config) {
	$s.apply(this, config);
	
	IG$/*mainapp*/.MmD$m.superclass.constructor.call(this, {});
}

$s.extend(IG$/*mainapp*/.MmD$m, $s.window, {
	title: 'Import datafile',
	modal: true,
	region:'center',
	"layout": { 
		type: 'vbox',
		align: 'stretch'
	},
	closable: false,
	resizable:false,
	width: 600,
	height: 500,
	uid: null,
	cubeuid: null,
	
	parentnodepath: null,
	itemtype: null,
	parentuid: null,
	
	defaults:{autoHeight:false, bodyStyle:'padding:4px'},
	
	mform: null,
	
	filekey: null,
	msgtitle: 'Cube DataLoader',
	m1C/*metricmapping*/: null,
	
	P1C/*processCubeDataMapping*/: function() {
		var panel = this;
		var filekey = panel.filekey;
		
		if (!this.cubeuid || this.cubeuid == '')
		{
			IG$/*mainapp*/._I54/*alertmsg*/(this.msgtitle, 'Select cube to continue', null, null, 0, "alert");
			return;
		}
		
		if (!this.m1C/*metricmapping*/ || this.m1C/*metricmapping*/.length == 0)
		{
			IG$/*mainapp*/._I54/*alertmsg*/(this.msgtitle, 'Select matric mapping to continue', null, null, 0, "alert");
			return;
		}
		
		var content = '<smsg><Info type="fileupload" key="' + filekey + '">';
		for (i=0; i < this.m1C/*metricmapping*/.length; i++)
		{
			if (this.m1C/*metricmapping*/[i].data.uid && this.m1C/*metricmapping*/[i].data.uid.length > 0)
			{
				content += '<Dimension uid="' + this.m1C/*metricmapping*/[i].data.uid 
					+ '" nodepath="' + this.m1C/*metricmapping*/[i].data.nodepath 
					+ '" column="' + this.m1C/*metricmapping*/[i].data.columnIndex 
					+ '"/>';
			}
		}
		content += '</Info></smsg>'; 
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "17",
                payload: '<smsg><item cubeuid="' + panel.cubeuid + '" action="ProcData"/></smsg>',
                mbody: content
	        }, panel, panel.rs_P1C/*processCubeDataMapping*/, null);
		req._l/*request*/();
	},
	
	rs_P1C/*processCubeDataMapping*/: function(xdoc) {
	},
	
	sKK1/*processUploadedFile*/: function(filekey) {
		var panel = this;
		panel.filekey = filekey;
		// panel.setLoading(true, true);
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "27",
                payload: '<smsg><item uid="' + filekey + '" rowlimit="100"/></smsg>',
            	mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "readexcelcontent"})
	        }, panel, panel.rs_sKK1/*processUploadedFile*/, null);
		req._l/*request*/();
	},
	
	rs_sKK1/*processUploadedFile*/: function(xdoc) {
		var panel = this,
			owner = $(".dataview", panel.body.dom),
			mresult = new IG$/*mainapp*/._IF1/*clSheetResult*/(xdoc, 100),
			mgrid = panel._0x030/*mgrid*/;
			
		mgrid.width = owner.clientWidth;
		mgrid.height = owner.clientHeight;
		mgrid.size = 10;
		mgrid.initialize(null, owner);
		mgrid.styles = mresult.styles;
		mgrid.fixedCol = mresult.colfix;
		mgrid.fixedRow = mresult.rowfix;
		mgrid.setDataProvider(mresult.data);
		
		panel.datastore.clearData();
		for (i=0; i < mresult.data[0].length; i++)
		{
			panel.m1C/*metricmapping*/.push({nodepath:null, uid: null, name: '', columnIndex: i});
		}
		panel.datastore.loadData(panel.m1C/*metricmapping*/);
	},
	
	P2C/*cubeSelectedHandler*/: function (item) {
		var tjian = this,
			editingRowIndex = tjian.editingRowIndex;
		editingRowIndex.data.uid = item.uid;
		editingRowIndex.data.nodepath = item.nodepath;
		editingRowIndex.data.name = item.name;
		
		tjian.datastore.loadData(tjian.m1C/*metricmapping*/);
	},
	
	P3C/*setColumnMapping*/: function(cindex, item) {
		var tjian = this;
		tjian.metricmapping[cindex].data.uid = item.uid;
		tjian.metricmapping[cindex].data.nodepath = item.nodepath;
		tjian.metricmapping[cindex].data.name = item.name;
		
		tjian.datastore.loadData(tjian.m1C/*metricmapping*/);
	},
	
	initComponent : function() {
		this._0x030/*mgrid*/ = new IG$/*mainapp*/.cMa/*DataGridView*/();
		var tjian = this;
		this.m1C/*metricmapping*/ = [];
		
		var fields = [
			"nodepath", "name", "columnIndex", "uid"
  		];
  		
  		this.datastore = $s.create('Ext.data.ArrayStore', {
  			fields: fields
  		});
		
  		this.mform = new Ext.form.Panel({
  	        width: 400,
  	        bodyPadding: 5,
  	        customowner: this,
  	        frame: true,
  	        border: false,
  	        items: [{
  	            xtype: 'fieldcontainer',
  	            "layout": 'hbox',
  	            border: false,
  	            items: [
  	                {
  	                	xtype: 'fileuploadfield',
  	    	            name: 'photo',
  	    	            fieldLabel: 'Data',
  	    	            labelWidth: 50,
  	    	            msgTarget: 'side',
  	    	            allowBlank: false,
  	    	            width: 280,
  	    	            buttonText: 'Select File...'
  	                },
  	                {
  	                	xtype: 'button',
  	                	text: 'Upload',
  	                	handler: function() {
  	                		if (this.mform.getForm().isValid()) {
								this.mform.getForm().submit({
									url: ig$/*appoption*/.servlet,
									waitMsg: 'Uploading your data file',
									success: function(fp, o) {
										IG$/*mainapp*/._I54/*alertmsg*/('Success', 'Processed file on the server', null, null, 0, "success");
										var node = IG$/*mainapp*/._I18/*XGetNode*/(fp.errorReader.xmlData, "/smsg/Result"),
											uid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "uid");
										
										fp.customowner.sKK1/*processUploadedFile*/.call(fp.customowner, uid);
									}
								})
							}
						},
						scope: this
  	                }
  	            ]
  	        }]
  		});
  		
  		var tree = Ext.create(IG$/*mainapp*/._I98/*naviTree*/, {
  			cubebrowse: true,
  			rootuid: tjian.cubeuid,
  			enableDragDrop: true,
  			enabledrag: true,
			useArrows: true,
			ddGroup: '_I$RD_G_'
  		});
  		
  		this.G1/*gridview*/ = Ext.create('Ext.grid.Panel', {
			flex: 2,
			multiSelect: false,
			reserveScrollOffset: true,
			store: tjian.datastore,
			border: 1,
			panel: this,
			
			columns: [
			    {
			    	text: 'Column Index',
			    	header: 'Column Index',
			    	width: 90,
			    	dataIndex: 'columnIndex'
			    }, {
			    	text: 'Metric Item',
			    	header: 'Metric Item',
			    	flex: 1,
			    	dataIndex: 'name'
			    }
			],
			listeners: {
				itemdblclick: function(view, record, item, index, e) {
					tjian.editingRowIndex = tjian.m1C/*metricmapping*/[index];
					var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
						u5x/*treeOptions*/: {
							cubebrowse: true,
							rootuid: tjian.cubeuid
						}
					});
					dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(tjian, tjian.P2C/*cubeSelectedHandler*/);
					IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
				},
				render: function(view) {
					var grid = this;
					
					grid.dropZone = Ext.create('Ext.grid.ViewDropZone', {
						view: grid,
						
						ddGroup: '_I$RD_G_',
						
						getTargetFromEvent: function(e) {
							var node = e.getTarget(this.view.view.getItemSelector()),
					            mouseY, nodeList, testNode, i, len, box;
		
					        if (!node) {
					            mouseY = e.getPageY();
					            for (i = 0, nodeList = this.view.view.getNodes(), len = nodeList.length; i < len; i++) {
					                testNode = nodeList[i];
					                box = Ext.fly(testNode).getBox();
					                if (mouseY <= box.bottom) {
					                    return testNode;
					                }
					            }
					        }
					        return node;
						},
						
						onNodeEnter: function(target, dd, e, data) {
							
						},
						onNodeOut: function(target, dd, e, data) {
							
						},
						
						onNodeOver: function(target, dd, e, data) {
							return Ext.dd.DropZone.prototype.dropAllowed;
						}, 
						
						onNodeDrop: function(node, dragZone, e, data) {
							var i,
								item = data.records[0].data;
							var view = this.view,
					            store = view.getStore(),
					            index, records, i, len;
							var h = view.view.getRecord(node);
							var cindex = h.data.columnIndex;
							
							view.panel.P3C/*setColumnMapping*/.call(view.panel, cindex, item);
						}
					});
				}
			}
		});

		$s.apply(this, {
			items: [
				{
					html: 'Step 1: Upload Datafile',
					flex: 1,
					border: false
				},
				{
					xtype: 'container',
					border: true,
					flex: 8,
					"layout": {
						type: 'hbox',
						align: 'stretch'
					},
					items: [
					    {
					    	xtype: 'container',
					    	border: true,
					    	flex: 2,
					    	"layout": 'fit',
					    	items: [
					    	    tree
					    	]
					    },
					    {
							xtype: 'container',
							border: true,
							flex: 5,
							"layout": {
								type: 'vbox',
								align: 'stretch'
							},
							items: [
								this.mform,
								{
									html: '<div class="dataview"></div>',
									flex: 2,
									height: 200,
									border: false
								},
								this.G1/*gridview*/
							]}
						]
					}
				],
			
				buttons:[{
					text: 'Confirm',
					handler: function() {
						this.P1C/*processCubeDataMapping*/.call(this);
					},
					scope: this
				}, {
					text:'Close',
					handler:function() {
						this.close();
					},
					scope: this
				}],
			
				_IG0/*closeDlgProc*/: function() {
					this.close();
				},
				listeners: {
					afterrender: function(panel) {
						panel.mform.getForm().errorReader = new IG$/*mainapp*/.m2ER();
					}
				}
			}
		);
		
		IG$/*mainapp*/.MmD$m.superclass.initComponent.apply(this, arguments);
	}
});

