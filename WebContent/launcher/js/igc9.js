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
IG$/*mainapp*/.BC$hcp/*hadoop_config_items*/ = {};

IG$/*mainapp*/.BC$hcp/*hadoop_config_items*/.hconfig = [
	// "HADOOP_HOME", "JAVA_HOME", "CMD_FS_IMPORT", "HADOOP_CONF"
];

IG$/*mainapp*/.BC$hcp/*hadoop_config_items*/.dconfig = {
	"CURDATE": "DATE;yyyyMMdd",
	"PREVDATE": "DATE;yyyyMMdd;D;-1",
	"PREVMONTH": "DATE;yyyyMMdd;M;-1",
	"PREVYEAR": "DATE;yyyyMMdd;Y;-1",
	"USERNAME": "USERNAME",
	"GROUPNAME": "GROUPNAME",
	"USERID": "USERID",
	"USERNAME": "USERNAME",
	"DEPTNAME": "SQL;IGCBASE;SELECT dname FROM WHERE dname='${GROUPNAME}'"
}

IG$/*mainapp*/._I77/*hadoop_config*/ = $s.extend($s.panel, {
	
	closable: true,
	
	layout: "fit",
	bodyPadding: 10,
	
	iconCls: "icon-ing-docdef",
	
	_uid: "/SYS_Config/systemconfig",
	
	_IFd/*init_f*/: function() {
		var me = this,
			req,
			grdparams = me.down("[name=grdparams]"),
			i,
			uid = me._uid;
		
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: ''})
	        }, me, me._IM9/*rs_loadContent*/, me.rs_F1e/*rs_error*/);
		req._l/*request*/();
	},
	
	_IM9/*rs_loadContent*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			tnodes,
			i, params = [], param;
		
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tnodes.length; i++)
			{
				param = {
					name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
					type: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "type"),
					value: IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i])
				};
				params.push(param);
			}
		}
		
		me.params = params;
		
		me.l1/*loadParam*/();
	},
	
	rs_F1e/*rs_error*/: function(xdoc) {
		var me = this,
			r = true,
			req,
			errcode = IG$/*mainapp*/._I27/*getErrorCode*/(xdoc),
			uid = me._uid;
		
		if (errcode == "0x1400")
		{
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "31",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: uid, name: "systemconfig", type: "PrivateContent"}),
		            mbody: "<smsg></smsg>"
		        }, me, me._IM9/*rs_loadContent*/, me.rs_F1w/*writeConfig*/);
			req._l/*request*/();
			r = false;
		}
		
		return r
	},
	
	rs_F1w/*writeConfig*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		
		me.params = [];
				
		me.l1/*loadParam*/();
	},
	
	l1/*loadParam*/: function() {
		var me = this,
			baseparams = IG$/*mainapp*/.BC$hcp/*hadoop_config_items*/.hconfig,
			dconfig = IG$/*mainapp*/.BC$hcp/*hadoop_config_items*/.dconfig,
			params = [],
			gparams = me.params,
			gp = {},
			grdparams = me.down("[name=grdparams]"),
			i, key;

		for (i=0; i < baseparams.length; i++)
		{
			gp[baseparams[i]] = baseparams[i];
		}
		
		for (i=0; i < gparams.length; i++)
		{
			if (gp[gparams[i].name])
			{
				delete gp[gparams[i].name];
			}
			
			if (dconfig[gparams[i].name])
			{
				delete dconfig[gparams[i].name];
			}
			
			params.push({
				name: gparams[i].name,
				type: gparams[i].type,
				value: gparams[i].value
			});
		}
		
		for (key in gp) {
			params.push({
				name: key,
				type: "SVAR",
				value: ""
			});
		}
		
		for (key in dconfig) {
			params.push({
				type: "DVAR",
				name: key,
				value: dconfig[key]
			});
		}
		
		grdparams.store.loadData(params);
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this,
			grdparams = me.down("[name=grdparams]");
		
		switch (cmd)
		{
		case "cmd_save":
			me.s1/*saveContent*/();
			break;
		case "cmd_refresh":
			me._IFd/*init_f*/();
			break;
		case "cmd_add_param":
			
			var	row = grdparams.store.add({
				name: "",
				value: ""
			});
			
			grdparams.getSelectionModel().select(row);
			
			break;
		case "cmd_rm_param":
			var sel = grdparams.getSelectionModel().selected,
				i,
				rec;
				
			for (i=sel.length-1; i>=0; i--)
			{
				grdparams.store.remove(sel.items[i]);
			}
			break;
		}
	},
	
	s1/*saveContent*/: function() {
		var me = this,
			grdparams = me.down("[name=grdparams]"),
			i, rec,
			req;
		
		cnt = "<smsg><item>";
		for (i=0; i < grdparams.store.data.items.length; i++)
		{
			rec = grdparams.store.data.items[i];
			if (rec.get("name"))
			{
				cnt += "<param type='" + (rec.get("type") || "VAR") + "' name='" + rec.get("name") + "'><![CDATA[" + rec.get("value") + "]]></param>";
			}
		}
		cnt += "</item></smsg>";
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me, 
			{
	            ack: "31",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: me._uid}),
	            mbody: cnt
	        }, me, me.rs_s1/*saveContent*/, null);
		req._l/*request*/();
	},
	
	rs_s1/*saveContent*/: function(xdoc) {
		var panel = this;
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SAVED'), null, panel, 0, "success");
	},

	initComponent: function() {
		var me = this;
		
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
							xtype: "displayfield",
							value: IRm$/*resources*/.r1("L_V_DESC")
						},
						{
							xtype: "gridpanel",
							name: "grdparams",
							store: {
								xtype: "store",
								fields: [
									"name", "value", "type"
								]
							},
							flex: 1,
							selType: "checkboxmodel",
							selModel: {
								checkSelector: ".x-grid-cell"
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
									text: IRm$/*resources*/.r1("B_TYPE"),
									dataIndex: "type",
									width: 80,
									editor: {
										allowBlank: false
									}
								},
								{
									xtype: "gridcolumn",
									text: IRm$/*resources*/.r1("B_NAME"),
									dataIndex: "name",
									width: 200,
									editor: {
										allowBlank: false
									}
								},
								{
									xtype: "gridcolumn",
									text: IRm$/*resources*/.r1("B_VALUE"),
									flex: 1,
									dataIndex: "value",
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
			    	name: "t_save",
	            	tooltip: IRm$/*resources*/.r1("L_SAVE_CONTENT"),
	            	handler: function() {
			    		this._t$/*toolbarHandler*/("cmd_save"); 
			    	},
	            	scope: this
			    },
			    "-",
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
			    	iconCls: "icon-toolbar-add",
			    	text: IRm$/*resources*/.r1("L_ADD_VAR"),
	            	tooltip: IRm$/*resources*/.r1("L_ADD_VAR"),
	            	handler: function() {
			    		this._t$/*toolbarHandler*/("cmd_add_param"); 
			    	},
	            	scope: this
			    },
			    {
			    	iconCls: "icon-grid-delete",
			    	text: IRm$/*resources*/.r1("L_RM_VAR"),
	            	tooltip: IRm$/*resources*/.r1("L_RM_VAR"),
	            	handler: function() {
			    		this._t$/*toolbarHandler*/("cmd_rm_param"); 
			    	},
	            	scope: this
			    }
			]
	    });
	          
		IG$/*mainapp*/._I77/*hadoop_config*/.superclass.initComponent.call(this);
	},
	
	listeners: {
		afterrender: function(tobj) {
			var me = this;
			me._IFd/*init_f*/();
		}
	}
	
});

IG$/*mainapp*/._I9f/*hadoop_config_edititem*/ = $s.extend($s.window, {
	
	modal: true,
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 300,
	autoHeight: true,
	
	callback: null,
	
	_IFd/*init_f*/: function() {
	},
	
	initComponent: function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1('L_MAKEITEM');
		
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
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
							fieldLabel: "Name",
							name: "i_name"
						},
						{
							xtype: "textfield",
							fieldLabel: "Host address",
							name: "l_address"
						}
					]
				}
			],
			buttons:[
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.$f3/*processMakeMetaItem*/();
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
		
		IG$/*mainapp*/._I9f/*hadoop_config_edititem*/.superclass.initComponent.call(this);
	},
	
	listeners: {
		afterrender: function(tobj) {
			var me = this;
			me._IFd/*init_f*/();
		}
	}
});

		
IG$/*mainapp*/.BC$ds/*hadoop_datasource*/ = $s.extend(IG$/*mainapp*/.BC$base/*hadoop_dlg_base*/, {
	
	region:"center",
	"layout": "fit",
	
	autoHeight: true,
		
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			job = me.job;
		
		me.dsmapper = me.down("[name=dsmapper]");
		me.dstype = me.down("[name=dstype]");
		me.dsfname = me.down("[name=dsfname]");
		me.dstname = me.down("[name=dstname]");
		me.dsskipexist = me.down("[name=dsskipexist]");
		
		IG$/*mainapp*/.BC$ds/*hadoop_datasource*/.superclass._IFe/*initF*/.call(this, arguments);
			
		if (job)
		{
			me.dsmapper.setValue(job.dsmapper);
			me.dstype.setValue(job.dstype);
			me.dsfname.setValue(job.dsfname);
			me.dstname.setValue(job.dstname);
			me.dsskipexist.setValue(job.dsskipexist == "T" ? true : false);
		}
	},
	
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			job = me.job;
		
		me.callParent(arguments);

		if (job)
		{
			job.dsmapper = me.dsmapper.getValue();
			job.dsfname = me.dsfname.getValue();
			job.dstname = me.dstname.getValue();
			job.dsskipexist = me.dsskipexist.getValue() ? "T" : "F";
			
			job.dstype = me.dstype.getValue();
		}
		
		me._IG0/*closeDlgProc*/();
	},
	
	initComponent : function() {
		var panel = this,
			lw = 120,
			__m/*mode*/ = panel.__m/*mode*/;
			
		panel.title = IRm$/*resources*/.r1("T_BG_DS");
		
		panel.moption = [
			{
				xtype: "fieldset",
				title: "Advanced Option",
				layout: "anchor",
				defaults: {
					anchor: "100%",
					labelAlign: "top"
				},
				items: [
					{
						xtype: "combobox",
						name: "dstype",
						fieldLabel: "Data Type",
						queryMode: "local",
						displayField: "name",
						valueField: "type",
						editable: false,
						autoSelect: true,
						store: {
							xtype: "store",
							fields: [
								"name", "type"
							],
							data: [
								{name: "File", type: "file", selected: 1},
								{name: "Stream type", type: "stream"},
								{name: "Data Query", type: "sql"}
							]
						},
						listeners: {
							change: function(tobj) {
								var me = this,
									tval = tobj.getValue(),
									f_f1 = me.down("[name=f_f1]"),
									f_f2 = me.down("[name=f_f2]");
								
								f_f1.setVisible(tval != "sql");
								f_f2.setVisible(tval == "sql");
							},
							scope: this
						}
					},
					{
						xtype: "fieldcontainer",
						name: "f_f1",
						layout: "anchor",
						defaults: {
							anchor: "100%",
							labelAlign: "top"
						},
						items: [
							{
								xtype: "textarea",
								name: "dsfname",
								minHeight: 80,
								hidden: !__m/*mode*/,
								fieldLabel: "File/Directory (Server)"
							},
							{
								xtype: "checkbox",
								name: "dsskipexist",
								hidden: __m/*mode*/,
								fieldLabel: "Skip if exist",
								boxLabel: "Enable"
							},
							{
								xtype: "textfield",
								name: "dstname",
								hidden: __m/*mode*/,
								fieldLabel: "HDFS name"
							}
						]
					},
					{
						xtype: "fieldcontainer",
						name: "f_f2",
						hidden: true,
						layout: "anchor",
						defaults: {
							anchor: "100%",
							labelAlign: "top"
						},
						items: [
							{
								xtype: "textfield",
								name: "dbpool",
								fieldLabel: "DataSource"
							},
							{
								xtype: "textarea",
								name: "dbsql",
								fieldLabel: "SQL Query"
							}
						]
					},
					{
						xtype: "fieldcontainer",
						hidden: true,
						fieldLabel: "MapRed",
						layout: {
							type: "hbox",
							align: "stretch"
						},
						items: [
							{
								xtype: "textfield",
								flex: 1,
								name: "dsmapper"
							},
							{
								xtype: "button",
								text: "..",
								handler: function() {
									this.GG1/*getMapClasses*/(this.dsmapper);
								},
								scope: this
							}
						]
					}
				]
			}
		];
		
		IG$/*mainapp*/.BC$ds/*hadoop_datasource*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.BC$hj/*hadoop_hivejob*/ = $s.extend(IG$/*mainapp*/.BC$base/*hadoop_dlg_base*/, {
	
	modal: true,
	isWindow: true,
	region:"center",
	"layout": "fit",
	
	closable: false,
	resizable:false,
	autoHeight: true,
		
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			job = me.job;
		
		me.dsscript = me.down("[name=dsscript]");	
		IG$/*mainapp*/.BC$hj/*hadoop_hivejob*/.superclass._IFe/*initF*/.call(me, arguments);
			
		if (job)
		{
			me.dsscript.setValue(Base64.decode(job.dsscript));
		}
	},
	
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			job = me.job;
		
		me.callParent(arguments);
		
		if (job)
		{
			job.dsscript = Base64.encode(me.dsscript.getValue());
		}
		
		me._IG0/*closeDlgProc*/();
	},
	
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_BG_HIVEJOB");
		
		panel.moption = [
			{
				xtype: "fieldset",
				title: "Advanced Option",
				layout: "anchor",
				defaults: {
					anchor: "100%",
					labelAlign: "top"
				},
				items: [
					{
						xtype: "textarea",
						fieldLabel: "Hive SQL",
						name: "dsscript",
						height: 150
					}
				]
			}
		];
		
		IG$/*mainapp*/.BC$hj/*hadoop_hivejob*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.BC$scD/*hadoop_shellcommand*/ = $s.extend($s.window, {
	
	modal: true,
	isWindow: true,
	region:"center",
	"layout": "fit",
	
	closable: false,
	resizable:false,
	width: 500,
	autoHeight: true,
		
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			msgresult = me.down("[name=msgresult]");
			
		msgresult.setValue(me.msg);
	},
	
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_BG_SCR");
		
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
			
			items: [
				{
					xtype: "form",
					layout: "anchor",
					defaults: {
						anchor: "100%"
					},
					items: [
						{
							xtype: "textarea",
							name: "msgresult",
							height: 200
						}
					]
				}
			],
			buttons:[
				"->",
				{
					text: IRm$/*resources*/.r1("B_CLOSE"),
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
		
		IG$/*mainapp*/.BC$scD/*hadoop_shellcommand*/.superclass.initComponent.apply(this, arguments);
	}
});

BC$sc = $s.extend(IG$/*mainapp*/.BC$base/*hadoop_dlg_base*/, {

	region:"center",
	"layout": "fit",

	autoHeight: true,
		
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			job = me.job;
		
		me.dsscript = me.down("[name=dsscript]");
		
		BC$sc.superclass._IFe/*initF*/.call(me, arguments);
		
		if (job)
		{
			me.dsscript.setValue(Base64.decode(job.dsscript));
		}
	},
	
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			job = me.job;
		
		me.callParent(arguments);
		
		if (job)
		{
			job.dsscript = Base64.encode(me.dsscript.getValue());
		}
		
		me._IG0/*closeDlgProc*/();
	},
	
	ts/*testShellCommand*/: function() {
		var me = this,
			panel = this,
			dsscript = me.dsscript.getValue(),
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		cnt = [];
    	
    	cnt.push("<smsg><item sid='" + (me.job.sid || "") + "'>");
		cnt.push("<command><![CDATA[" + Base64.encode(dsscript) + "]]></command>");
		cnt.push("</item></smsg>");
    	
    	req.init(panel, 
			{
	            ack: "3",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({sid: me.job.sid, option: "command"}, "sid;option"),
	            mbody: cnt.join("")
	        }, panel, panel.rs_ts/*testShellCommand*/, null);
		req._l/*request*/();
	},
	
	rs_ts/*testShellCommand*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			errmsg,
			snode,
			msg, i, tmsg,
			haserr = false;
			
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				snode = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "errormessage");
				
				if (snode)
				{
					msg = IG$/*mainapp*/._I24/*getTextContent*/(snode);
					msg = Base64.decode(msg);
					haserr = true;
				}
				else
				{
					snode = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "message");
					if (snode)
					{
						msg = IG$/*mainapp*/._I24/*getTextContent*/(snode);
						msg = Base64.decode(msg);
					}
				}
				
				tmsg = (tmsg) ? tmsg + "\n" + msg : msg;
			}
			
			var dlg = new IG$/*mainapp*/.BC$scD/*hadoop_shellcommand*/({
				msg: tmsg
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
			
			if (haserr == true)
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "One or more command failed. See log for detail", null, me, null, null, 1, "error");
			}
		}
	},
		
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_BG_SC");
		
		panel.moption = [
			{
				xtype: "fieldset",
				title: "Advanced Option",
				layout: "anchor",
				defaults: {
					anchor: "100%",
					labelAlign: "top"
				},
				items: [
					{
						xtype: "textarea",
						fieldLabel: "Shell Command",
						name: "dsscript",
						height: 150
					},
					{
						xtype: "fieldcontainer",
						layout: {
							type: "hbox",
							align: "stretch"
						},
						items: [
							{
								xtype: "fieldcontainer",
								flex: 1
							},
							{
								xtype: "button",
								text: "Test command",
								handler: function() {
									var me = this;
									me.ts/*testShellCommand*/();
								},
								scope: this
							}
						]
					}
				]
			}
		];
		
		BC$sc.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.BC$op/*hadoop_output*/ = $s.extend(IG$/*mainapp*/.BC$base/*hadoop_dlg_base*/, {
	region:"center",
	"layout": "fit",
	
	autoHeight: true,
		
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			job = me.job;
		
		me.dsfname = me.down("[name=dsfname]");
		me.dscnames = me.down("[name=dscnames]");
		me.dsmname = me.down("[name=dsmname]");
		me.dsruntype = me.down("[name=dsruntype]");
		me.dsdelim = me.down("[name=dsdelim]");
		me.dsdelimval = me.down("[name=dsdelimval]");
		me.dstcube = me.down("[name=dstcube]");
		me.dsmeasuredelim = me.down("[name=dsmeasuredelim]");
		me.dsmeasuredelimval = me.down("[name=dsmeasuredelimval]");
		me.dscsdatause = me.down("[name=dscsdatause]");
		me.dscsdatafile = me.down("[name=dscsdatafile]");
		
		IG$/*mainapp*/.BC$op/*hadoop_output*/.superclass._IFe/*initF*/.call(me, arguments);
		
		if (job)
		{
			me.dsfname.setValue(job.dsfname);
			me.dscnames.setValue(job.dscnames);
			me.dsmname.setValue(job.dsmname);
			me.dsruntype.setValue(job.dsruntype);
			me.dsdelim.setValue(job.dsdelim);
			me.dsdelimval.setValue(job.dsdelimval);
			me.dstcube.setValue(job.dstcube);
			me.dstcubeuid = job.dstcubeuid;
			me.dsmeasuredelim.setValue(job.dsmeasuredelim);
			me.dsmeasuredelimval.setValue(job.dsmeasuredelimval);
			me.dscsdatause.setValue(job.dscsdatause == "T");
			me.dscsdatafile.setValue(job.dscsdatafile);
			
			me.dscsdatafile.setVisible(job.dscsdatause == "T");
		}
	},
	
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			job = me.job;
		
		me.callParent(arguments);
		
		if (job)
		{
			job.dsfname = me.dsfname.getValue();
			job.dscnames = me.dscnames.getValue();
			job.dsmname = me.dsmname.getValue();
			job.dsruntype = me.dsruntype.getValue();
			job.dsdelim = me.dsdelim.getValue();
			job.dsdelimval = me.dsdelimval.getValue();
			job.dstcube = me.dstcube.getValue();
			job.dstcubeuid = me.dstcubeuid;
			job.dsmeasuredelim = me.dsmeasuredelim.getValue();
			job.dsmeasuredelimval = me.dsmeasuredelimval.getValue();
			job.dscsdatause = me.dscsdatause.getValue() == true ? "T" : "F";
			job.dscsdatafile = me.dscsdatafile.getValue();
		}
		
		me._IG0/*closeDlgProc*/();
	},
	
	m1/*loadCubeSelection*/: function() {
		var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
    		mode: "newitem"
    	});
		dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs_m1/*loadCubeSelection*/);
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	},
	
	rs_m1/*loadCubeSelection*/: function(item) {
		var panel = this,
    		cnt = "<smsg><item></item></smsg>",
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	
		req.init(panel, 
			{
                ack: "31",
	            payload: "<smsg><item address='" + item.nodepath + "/" + item.name + "' name='" + item.name + "' type='" + "MCube" + "' pid='" + item.uid + "' description=''/></smsg>",
	            mbody: cnt
            }, panel, panel.rs_m1b/*loadCubeSelection*/, panel.rs_m1a/*loadCubeSelection*/, [item.name, item.nodepath, item.uid, cnt]);
        req.showerror = false;
	    req._l/*request*/();
	},
	
	rs_m1a/*loadCubeSelection*/: function(xdoc, opt) {
		var panel = this,
    		itemname = opt[0],
    		nodepath = opt[1],
    		pitemuid = opt[2],
    		cnt = opt[3],
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
				            payload: "<smsg><item address='" + nodepath + "/" + itemname + "' name='" + itemname + "' type='" + "MCube" + "' pid='" + pitemuid + "' description='' overwrite='T'/></smsg>",
				            mbody: cnt
			            }, panel, panel.rs_m1b/*loadCubeSelection*/, null, [itemname, nodepath]);
				    req._l/*request*/();
    			}
    		}, panel, panel);
    	}
    	else
    	{
    		IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, panel);
    	}
	},
	
	rs_m1b/*loadCubeSelection*/: function(xdoc, prop) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			p = (tnode ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode) : null);
			
		if (p)
		{
			me.dstcube.setValue(p.nodepath || p.name);
			me.dstcubeuid = p.uid;
		}
	},
		
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_BG_OP");
		
		panel.moption = [
			{
				xtype: "fieldset",
				title: "Advanced Option",
				layout: "anchor",
				defaults: {
					anchor: "100%",
					labelAlign: "top"
				},
				items: [
					{
						xtype: "textfield",
						fieldLabel: "Data name",
						name: "dsfname"
					},
					{
						xtype: "combobox",
						name: "dsruntype",
						fieldLabel: "Run type",
						queryMode: "local",
						displayField: "name",
						valueField: "value",
						editable: false,
						autoSelect: true,
						store: {
							xtype: "store",
							fields: [
								"name", "value",
							],
							data: [
								// {name: "View in Report", value: "R_REPORT"},
								{name: "Load in database", value: "R_LOAD_DB"},
								{name: "Create M-Cube", value: "R_M_CUBE"}
							]
						},
						listeners: {
							change: function() {
								var me = this,
									dsruntype = me.dsruntype;
									
								me.down("[name=opt_cube]").setVisible(dsruntype.getValue() == "R_M_CUBE");
							},
							scope: this
						}
					},
					{
						xtype: "fieldcontainer",
						fieldLabel: "Custom datafile",
						layout: {
							type: "hbox",
							align: "stretch"
						},
						items: [
							{
								xtype: "checkbox",
								boxLabel: "Enable",
								name: "dscsdatause",
								listeners: {
									change: function() {
										var me = this,
											dscsdatafile = me.dscsdatafile,
											dscsdatause = me.dscsdatause;
											
										dscsdatafile.setVisible(dscsdatause.getValue() == true);
									},
									scope: this
								}
							},
							{
								xtype: "textfield",
								flex: 1,
								name: "dscsdatafile"
							}
						]
					},
					{
						xtype: "textarea",
						name: "dscnames",
						fieldLabel: "Extra column names",
						height: 50
					},
					{
						xtype: "textfield",
						name: "dsmname",
						fieldLabel: "Measure column"
					},
					{
						xtype: "fieldcontainer",
						layout: {
							type: "hbox",
							align: "stretch"
						},
						items: [
							{
								xtype: "combobox",
								name: "dsdelim",
								fieldLabel: "Field delimiter",
								queryMode: "local",
								valueField: "value",
								displayField: "name",
								editable: false,
								autoSelect: true,
								labelAlign: "top",
								store: {
									xtype: "store",
									fields: [
										"name", "value"
									],
									data: [
										{name: "Comma", value: "comma"},
										
										{name: "Custom value", value: ""},
										
										{name: "Tab", value: "tab"},
										{name: "New line", value: "newline"}
									]
								},
								listeners: {
									change: function() {
										var me = this,
											dsdelim = me.dsdelim,
											dsdelimval = me.dsdelimval;
											
										dsdelimval.setVisible(dsdelim.getValue() == "");
									},
									scope: this
								}
							},
							{
								xtype: "textfield",
								hidden: true,
								flex: 1,
								name: "dsdelimval",
								fieldLabel: ""
							}
						]
					},
					{
						xtype: "fieldcontainer",
						layout: {
							type: "hbox",
							align: "stretch",
							labelAlign: "top"
						},
						items: [
							{
								xtype: "combobox",
								name: "dsmeasuredelim",
								fieldLabel: "Measure delimiter",
								queryMode: "local",
								valueField: "value",
								displayField: "name",
								editable: false,
								autoSelect: true,
								store: {
									xtype: "store",
									fields: [
										"name", "value"
									],
									data: [
										{name: "Comma", value: "comma"},
										
										{name: "Custom value", value: ""},
										
										{name: "Tab", value: "tab"},
										{name: "New line", value: "newline"}
									]
								},
								listeners: {
									change: function() {
										var me = this,
											dsmeasuredelim = me.dsmeasuredelim,
											dsmeasuredelimval = me.dsmeasuredelimval;
											
										dsmeasuredelimval.setVisible(dsmeasuredelim.getValue() == "");
									},
									scope: this
								}
							},
							{
								xtype: "textfield",
								hidden: true,
								flex: 1,
								name: "dsmeasuredelimval",
								fieldLabel: ""
							}
						]
					},
					{
						xtype: "fieldcontainer",
						name: "opt_cube",
						fieldLabel: "Cube",
						labelAlign: "top",
						layout: {
							type: "hbox",
							align: "stretch"
						},
						items: [
							{
								xtype: "textfield",
								name: "dstcube",
								flex: 1
							},
							{
								xtype: "button",
								name: "btn_cube",
								text: "Create Cube",
								handler: function() {
									var me = this;
									me.m1/*loadCubeSelection*/();
								},
								scope: this
							}
						]
					}
				]
			}
		];
		
		
		IG$/*mainapp*/.BC$op/*hadoop_output*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.BC$mr/*hadoop_mapreduce*/ = $s.extend(IG$/*mainapp*/.BC$base/*hadoop_dlg_base*/, {
	region:"center",
	"layout": "fit",
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			job = me.job,
			grdparams, i, data=[],
			param, n,
			hinput = false, houtput = false;
		
		me.dsmapper = me.down("[name=dsmapper]");
		me.grdparams = me.down("[name=grdparams]");
		
		IG$/*mainapp*/.BC$mr/*hadoop_mapreduce*/.superclass._IFe/*initF*/.call(me, arguments);
		
		if (job)
		{
			me.dsmapper.setValue(job.dsmapper);
			grdparams = (job.confparams ? job.confparams.split("|") : null);
			
			if (grdparams)
			{
				for (i=0; i < grdparams.length; i++)
				{
					param = {};
					n = grdparams[i].indexOf("=");
					param.name = n > -1 ? grdparams[i].substring(0, n) : "";
					param.value = n > -1 ? grdparams[i].substring(n+1) : "";
					
					if (param.name)
					{
						if (param.name == "input")
						{
							hinput = true;
						}
						else if (param.name == "output")
						{
							houtput = true;
						}
						data.push(param);
					}
				}
			}
			
			if (!hinput)
			{
				data.push({
					"name": "input",
					"value": ""
				});
			}
			
			if (!houtput)
			{
				data.push({
					"name": "output",
					"value": ""
				});
			}
			
			me.grdparams.store.loadData(data);
		}
	},
	
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			job = me.job,
			grdparams = me.grdparams, 
			p, confparams = [],
			param, i;
		
		me.callParent(arguments);
		
		if (job)
		{
			job.dsmapper = me.dsmapper.getValue();
			
			for (i=0; i < grdparams.store.data.items.length; i++)
			{
				p = grdparams.store.data.items[i];
				if (p.get("name")) 
				{
					confparams.push(p.get("name") + "=" + p.get("value"));
				}
			}
			
			job.confparams = confparams.join("|");
		}
		
		me._IG0/*closeDlgProc*/();
	},
		
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_BG_MR");
		
		panel.moption = [
			{
				xtype: "fieldset",
				title: "Advanced Option",
				layout: "anchor",
				defaults: {
					anchor: "100%",
					labelAlign: "top"
				},
				items: [
					{
						xtype: "fieldcontainer",
						fieldLabel: "MapRed",
						layout: {
							type: "hbox",
							align: "stretch"
						},
						items: [
							{
								xtype: "textfield",
								name: "dsmapper",
								flex: 1
							},
							{
								xtype: "button",
								text: "..",
								handler: function() {
									this.GG1/*getMapClasses*/(this.dsmapper);
								},
								scope: this
							}
						]
					},
					{
						xtype: "displayfield",
						value: "Configuration Parameters"
					},
					{
						xtype: "gridpanel",
						name: "grdparams",
						height: 120,
						store: {
							xtype: "store",
							fields: [
								"name", "value"
							]
						},
						selType: "checkboxmodel",
						selModel: {
							checkSelector: ".x-grid-cell"
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
								text: "Name",
								width: 200,
								dataIndex: "name",
								editor: {
									allowBlank: false
								}
							},
							{
								xtype: "gridcolumn",
								text: "Value",
								dataIndex: "value",
								flex: 1,
								editor: {
									allowBlank: true
								}
							}
						],
						tbar: [
							{
								xtype: "button",
								text: "Add param",
								handler: function() {
									var grd = this.grdparams;
									grd.store.add({
										name: "",
										value: ""
									});
								},
								scope: this
							},
							{
								xtype: "button",
								text: "Remove selected",
								handler: function() {
									var grd = this.grdparams,
										selection = grd.getSelectionModel().getSelection();
										
									for (i=selection.length-1; i>=0; i--)
									{
										grd.store.remove(selection[i]);
									}
								},
								scope: this
							}
						]
					}
				]
			}
		];
		
		IG$/*mainapp*/.BC$mr/*hadoop_mapreduce*/.superclass.initComponent.apply(this, arguments);
	}
});





IG$/*mainapp*/.BC$mr1/*mongo_mapreduce*/ = $s.extend(IG$/*mainapp*/.BC$base/*hadoop_dlg_base*/, {
	region:"center",
	"layout": "fit",

	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			job = me.job,
			grdparams, i, data=[],
			param, n,
			pval, aval;
		
		me.grdparams = me.down("[name=grdparams]");
		me.rowregex = me.down("[name=rowregex]");
		me.rowsample = me.down("[name=rowsample]");
		me.mrtype = me.down("[name=mrtype]");
		
		IG$/*mainapp*/.BC$mr1/*mongo_mapreduce*/.superclass._IFe/*initF*/.call(me, arguments);
		
		if (job)
		{
			me.mrtype.setValue(job.mrtype || "regex");
			me.rowregex.setValue(job.rowregex);
			me.rowsample.setValue(job.rowsample);
			
			grdparams = (job.cfields ? job.cfields.split("|") : null);
			
			if (grdparams)
			{
				for (i=0; i < grdparams.length; i++)
				{
					param = {};
					n = grdparams[i].indexOf("=");
					param.name = n > -1 ? grdparams[i].substring(0, n) : "";
					pval = n > -1 ? grdparams[i].substring(n+1) : "";
					
					if (pval.indexOf("^") > -1)
					{
						aval = pval.split("^");
						param.value = aval[0];
						if (aval.length > 1)
						{
							param.isdate = aval[1] == "T";
						}
						if (aval.length > 2)
						{
							param.dformat = aval[2];
						}
					}
					else
					{
						param.value = pval;
					}
					
					if (param.name)
					{
						data.push(param);
					}
				}
			}
			
			me.grdparams.store.loadData(data);
		}
	},
	
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			job = me.job,
			grdparams = me.grdparams, 
			p, cfields = [],
			param, i;
		
		me.callParent(arguments);
		
		if (job)
		{
			job.mrtype = me.mrtype.getValue();
			job.rowregex = me.rowregex.getValue();
			job.rowsample = me.rowsample.getValue();
			
			for (i=0; i < grdparams.store.data.items.length; i++)
			{
				p = grdparams.store.data.items[i];
				if (p.get("name")) 
				{
					cfields.push(p.get("name") + "=" + p.get("value") + "^" + (p.get("isdate") ? "T" : "F") + "^" + (p.get("dformat") || ""));
				}
			}
			
			job.cfields = cfields.join("|");
		}
		
		me._IG0/*closeDlgProc*/();
	},
	
	_g1/*getSampleData*/: function() {
		var me = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		cnt;
		
		cnt = "<smsg><info mrtype='" + me.mrtype.getValue() + "' option='regex'>";
		
		cnt += "<params>";
		cnt += "<param name='rowregex'><![CDATA[" + me.rowregex.getValue() + "]]></param>";
		cnt += "<param name='rowsample'><![CDATA[" + me.rowsample.getValue() + "]]></param>";
		cnt += "</params>"
		
		cnt += "</info></smsg>";
		
		req.init(me, 
			{
                ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
	            mbody: cnt
            }, me, function(xdoc) {
            	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/results/fields"),
            		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
            		i, dp = [], p, pval,
            		grdparams = me.grdparams;
            		
            	for (i=0; i < tnodes.length; i++)
            	{
            		pval = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
            		dp.push({name: pval, value: pval});
            	}
            		
            	grdparams.store.loadData(dp);
            });
	    req._l/*request*/();
	},
	
	_g2/*getDateFormat*/: function(rec) {
		var me = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		cnt = "<smsg><info option='date_format'><date><![CDATA[" + rec.get("value") + "]]></date></info></smsg>";
		
		req.init(me, 
			{
                ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
	            mbody: cnt
            }, me, function(xdoc) {
            	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/results"),
            		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
            		i, dp = [], p, pval;
            		
            	for (i=0; i < tnodes.length; i++)
            	{
            		pval = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
            		dp.push(pval);
            	}
            	
            	if (dp.length)
            	{
            		rec.set("dformat", dp[0]);
            	}
            });
	    req._l/*request*/();
	},
		
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_BG_MR");
		
		panel.moption = [
			{
				xtype: "fieldset",
				title: "Advanced Option",
				layout: "anchor",
				defaults: {
					anchor: "100%",
					labelAlign: "top"
				},
				items: [
					{
						xtype: "combobox",
						name: "mrtype",
						fieldLabel: "Data Processor Type",
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
								{name: "RegEx", value: "regex", selected: 1},
								{name: "Delimiter", value: "delimiter"}
							]
						},
						listeners: {
							change: function(tobj) {
								var me = this,
									tval = tobj.getValue(),
									f_f1 = me.down("[name=f_f1]"),
									f_f2 = me.down("[name=f_f2]");
								
								f_f1.setVisible(tval == "regex");
								f_f2.setVisible(tval != "regex");
							},
							scope: this
						}
					},
					{
						xtype: "fieldcontainer",
						layout: "anchor",
						name: "f_f1",
						hidden: true,
						defaults: {
							anchor: "100%",
							labelAlign: "top"
						},
						items: [
							{
								xtype: "textarea",
								name: "rowregex",
								height: 80,
								fieldLabel: "Data Row RegEx"
							},
							{
								xtype: "displayfield",
								value: "Ex: ^(\\\\S+) (\\\\S+) (\\\\S+) \\\\[(.*?)\\\\] \\\"(.*?)\\\" (\\\\S+) (\\\\S+)( \\\"(.*?)\" \\\"(.*?)\\\")?"
							}
						]
					},
					{
						xtype: "fieldcontainer",
						layout: "anchor",
						name: "f_f2",
						hidden: true,
						defaults: {
							anchor: "100%",
							labelAlign: "top"
						},
						items: [
							{
								xtype: "textfield",
								name: "m_delim",
								fieldLabel: "Delimiter"
							}
						]
					},
					{
						xtype: "textarea",
						name: "rowsample",
						height: 80,
						fieldLabel: "Sample Text"
					},
					{
						xtype: "fieldcontainer",
						layout: {
							type: "hbox",
							pack: "right"
						},
						items: [
							{
								xtype: "button",
								text: "Get",
								handler: function() {
									this._g1/*getSampleData*/();
								},
								scope: this
							}
						]
					},
					{
						xtype: "displayfield",
						value: "Output Fields"
					},
					{
						xtype: "gridpanel",
						name: "grdparams",
						height: 250,
						store: {
							xtype: "store",
							fields: [
								"name", "value", "isdate", "dformat"
							]
						},
						selType: "checkboxmodel",
						selModel: {
							checkSelector: ".x-grid-cell"
						},
						plugins: [
							{
								ptype: "cellediting",
								clicksToEdit: false
							}
						],
						columns: [
							{
								text: "Name",
								minWidth: 120,
								dataIndex: "name",
								editor: {
									allowBlank: false
								}
							},
							{
								text: "Value",
								dataIndex: "value",
								minWidth: 120,
								editor: {
									allowBlank: true
								}
							},
							{
								xtype: "checkcolumn",
								text: "Date",
								dataIndex: "isdate",
								width: 30,
								minWidth: 30,
								listeners: {
									checkchange: function(tobj, rowindex, checked, eopts) {
										var me = this,
											rec = me.grdparams.store.data.items[rowindex];
										if (checked && rec && !rec.get("dformat") && rec.get("value"))
										{
											me._g2/*getDateFormat*/(rec);
										}
									},
									scope: this
								}
							},
							{
								text: "Format",
								minWidth: 70,
								dataIndex: "dformat",
								editor: {
									allowBlank: true,
									listeners: {
										edit: function(editor, context, eopts) {
											
										},
										scope: this
									}
								}
							}
						],
						tbar: [
							{
								xtype: "button",
								text: "Add param",
								handler: function() {
									var grd = this.grdparams;
									grd.store.add({
										name: "",
										value: ""
									});
								},
								scope: this
							},
							{
								xtype: "button",
								text: "Remove selected",
								handler: function() {
									var grd = this.grdparams,
										selection = grd.getSelectionModel().getSelection();
										
									for (i=selection.length-1; i>=0; i--)
									{
										grd.store.remove(selection[i]);
									}
								},
								scope: this
							}
						]
					}
				]
			}
		];
		
		IG$/*mainapp*/.BC$mr1/*mongo_mapreduce*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.BC$mr2/*mongo_document*/ = $s.extend(IG$/*mainapp*/.BC$base/*hadoop_dlg_base*/, {
	region:"center",
	"layout": "fit",
	
	autoHeight: true,
		
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			job = me.job,
			grdparams, i, data=[],
			param, n;
		
		me.grdparams = me.down("[name=grdparams]");
		me.doctmpl = me.down("[name=doctmpl]");
		me.mrnode = me.down("[name=mrnode]");
		me.mrdb = me.down("[name=mrdb]");
		me.mrcol = me.down("[name=mrcol]");
		me.mrdocname = me.down("[name=mrdocname]");
		me.mrsmode = me.down("[name=mrsmode]");
		
		IG$/*mainapp*/.BC$mr2/*mongo_document*/.superclass._IFe/*initF*/.call(me, arguments);
		
		if (job)
		{
			me.doctmpl.setValue(job.doctmpl);
			me.mrdb.setValue(job.mrdb);
			me.mrcol.setValue(job.mrcol);
			me.mrdocname.setValue(job.mrdocname);
			me.mrsmode.setValue(job.mrsmode || "");
			
			grdparams = (job.confparams ? job.confparams.split("|") : null);
			
			if (grdparams)
			{
				for (i=0; i < grdparams.length; i++)
				{
					param = {};
					n = grdparams[i].indexOf("=");
					param.name = n > -1 ? grdparams[i].substring(0, n) : "";
					param.value = n > -1 ? grdparams[i].substring(n+1) : "";
					
					if (param.name)
					{
						data.push(param);
					}
				}
			}
			
			me.grdparams.store.loadData(data);
			
			me.l1/*loadMongoDB*/();
		}
	},
	
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			job = me.job,
			grdparams = me.grdparams, 
			p, confparams = [],
			param, i;
		
		me.callParent(arguments);
		
		if (job)
		{
			job.mrnode = me.mrnode.getValue();
			job.doctmpl = me.doctmpl.getValue();
			job.mrdb = me.mrdb.getValue();
			job.mrcol = me.mrcol.getValue();
			job.mrdocname = me.mrdocname.getValue();
			job.mrsmode = me.mrsmode.getValue();
			
			for (i=0; i < grdparams.store.data.items.length; i++)
			{
				p = grdparams.store.data.items[i];
				if (p.get("name")) 
				{
					confparams.push(p.get("name") + "=" + p.get("value"));
				}
			}
			
			job.confparams = confparams.join("|");
		}
		
		me._IG0/*closeDlgProc*/();
	},
	
	l1/*loadMongoDB*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			mrnode = me.mrnode;
		
		req.init(me, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, dbtype: "mongodb", option: "nosqldb_node"}, "uid;dbtype;option"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
	        }, me, function(xdoc) {
	        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
	        		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
	        		i, dp = [{name: "Select", nodename: ""}], p;
	        		
	        	for (i=0; i < tnodes.length; i++)
	        	{
	        		p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
	        		p.nodename = p.nodename || p.name;
	        		dp.push(p);
	        	}
	        	
	        	mrnode.store.loadData(dp);
	        	mrnode.setValue(me.job.mrnode || "");
	        }, null);
		req._l/*request*/();
	},
	
	m1/*getProcessing*/: function() {
		var me = this,
			p = me._p/*editor*/,
			mitems,
			cfields,
			mfields = [],
			i, j, n, v, av, mp,
			mval,
			doctmpl = me.down("[name=doctmpl]");
			
		mitems = p.m2/*getParents*/.call(p, me, "mongoreduce");
		
		if (mitems && mitems.length)
		{
			cfields = mitems[0].cfields;
			
			if (cfields)
			{
				cfields = cfields.split("|");
				
				for (i=0; i < cfields.length; i++)
				{
					n = cfields[i];
					j = n.indexOf("=");
					
					if (j > 0)
					{
						v = n.substring(j+1);
						n = n.substring(0, j);
						
						av = n.split("^");
						
						mp = {
							name: n,
							value: av[0]
						};
						
						if (av.length > 1)
						{
							mp.is_date = av[1] == "T";
						}
						
						if (av.length > 2)
						{
							mp.dateformat = av[2];
						}
						
						mfields.push(mp);
					}
				}
				
				mval = "";
				
				for (i=0; i < mfields.length; i++)
				{
					mval = (i == 0) ? mfields[i].name : mval + "\n" + mfields[i].name;
				}
				
				mval && doctmpl.setValue(mval);
			}
		}
	},
		
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_BG_MR");
		
		panel.moption = [
			{
				xtype: "fieldset",
				title: "Advanced Option",
				layout: "anchor",
				defaults: {
					anchor: "100%",
					labelAlign: "top"
				},
				items: [
				    {
						xtype: "combobox",
						name: "mrnode",
						fieldLabel: "MongoData",
						queryMode: "local",
						displayField: "name",
						valueField: "nodename",
						editable: false,
						autoSelect: true,
						store: {
							xtype: "store",
							fields: [
								"name", "nodename", "type"
							]
						},
						listeners: {
							change: function(tobj) {
								
							},
							scope: this
						}
					},
					{
						xtype: "textfield",
						fieldLabel: "DB Name",
						name: "mrdb"
					},
					{
						xtype: "textfield",
						fieldLabel: "Collection Name",
						name: "mrcol"
					},
					{
						xtype: "textfield",
						fieldLabel: "Document Name",
						name: "mrdocname"
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
					    		value: "Document",
					    		flex: 1
					    	},
					    	{
					    		xtype: "button",
					    		text: "..",
					    		handler: function() {
					    			this.m1/*getProcessing*/();
					    		},
					    		scope: this
					    	}
				    	]
				    },
					{
						xtype: "textarea",
						name: "doctmpl",
						height: 200
					},
					{
						xtype: "combobox",
						name: "mrsmode",
						fieldLabel: "Synchronous Write Policy",
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
								{name: "Disabled", value: ""},
								{name: "Cache-Flush", value: "cf"},
								{name: "Direct-Write", value: "dw"},
								{name: "Direct-Write-With-Cache", value: "dwc"}
							]
						}
					},
					{
						xtype: "gridpanel",
						name: "grdparams",
						height: 120,
						store: {
							xtype: "store",
							fields: [
								"name", "value"
							]
						},
						selType: "checkboxmodel",
						selModel: {
							checkSelector: ".x-grid-cell"
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
								text: "Name",
								width: 200,
								dataIndex: "name",
								editor: {
									allowBlank: false
								}
							},
							{
								xtype: "gridcolumn",
								text: "Value",
								dataIndex: "value",
								flex: 1,
								editor: {
									allowBlank: true
								}
							}
						],
						tbar: [
							{
								xtype: "button",
								text: "Add param",
								handler: function() {
									var grd = this.grdparams;
									grd.store.add({
										name: "",
										value: ""
									});
								},
								scope: this
							},
							{
								xtype: "button",
								text: "Remove selected",
								handler: function() {
									var grd = this.grdparams,
										selection = grd.getSelectionModel().getSelection();
										
									for (i=selection.length-1; i>=0; i--)
									{
										grd.store.remove(selection[i]);
									}
								},
								scope: this
							}
						]
					}
				]
			}
		];
		
		IG$/*mainapp*/.BC$mr2/*mongo_document*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Ia0/*hadoop_logviewer*/ = $s.extend($s.window, {
	
	modal: false,
	isWindow: true,
	region:"center",
	"layout": "fit",
	
	closable: false,
	resizable:false,
	width: 500,
	autoHeight: true,
		
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this;
		
		if (me.uid)
		{
			me.rL/*refreshLog*/();
		}
	},
	
	
	_IFf/*confirmDialog*/: function() {
		var me = this;
		
		me._IG0/*closeDlgProc*/();
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.callback && this.callback.execute(this.job);
		
		this.close();
	},
	
	rL/*refreshLog*/: function() {
		var me = this;
		
		if (me.uid)
		{
			var me = this,
				lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
			lreq.init(me, 
				{
		            ack: "10",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid}, "uid"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "loghistory"})
				}, me, me.rs_rL/*refreshLog*/, false);
				
			lreq._l/*request*/();
		}
	},
	
	rs_rL/*refreshLog*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
			i, logs = [], l,
			grdloghist = me.down("[name=grdloghist]"),
			pdesc,
			duration, m, s, ms;
			
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				l = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				l.pstatus = parseInt(l.pstatus);
				l.created_desc = IG$/*mainapp*/._I40/*formatDate*/(l.created);
				l.updated_desc = IG$/*mainapp*/._I40/*formatDate*/(l.updated);
				duration = Number(l.duration);
				duration = isNaN(duration) ? null : duration;
				l.duration = me.gg2/*getDuration*/(duration);
				
				pdesc = me.gg1/*getStatusDesc*/(l.pstatus);
				
				l.pstatus_desc = pdesc;
				logs.push(l);
			}
		}
		
		grdloghist.store.loadData(logs);
	},
	
	gg1/*getStatusDesc*/: function(s) {
		var pdesc = "Unknown";
		switch (s)
		{
		case 1:
			pdesc = "Running";
			break;
		case 10:
			pdesc = "Completed";
			break;
		case 20:
			pdesc = "Error: No result";
			break;
		case 21:
			pdesc = "Error: Dataformat mismatch";
			break;
		case 29:
			pdesc = "Error: Execution failed";
			break;
		}
		
		return pdesc;
	},
	
	gg2/*getDuration*/: function(duration) {
		var r = null,
			m, s, ms;
		
		if (duration != null)
		{
			m = Math.floor(duration / (60*1000));
			duration -= m * (60*1000);
			s = Math.floor(duration / (1000));
			duration -= s * (1000);
			ms = duration;
			r = (m>0 ? m + "m " : "") + (s>0 ? s + "s " : "") + (ms>-1 ? ms + "ms" : "");
		}
		
		return r;
	},
	
	g1/*getLogDetail*/: function(sid) {
		var me = this,
			lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
		lreq.init(me, 
			{
	            ack: "10",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({sid: sid}, "sid"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "logjoblist"})
			}, me, me.rs_g1/*getLogDetail*/, false);
			
		lreq._l/*request*/();
	},
	
	rs_g1/*getLogDetail*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
			i, dp = [],
			grdjobhist = me.down("[name=grdjobhist]"),
			l, pdesc, duration;
			
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				l = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				l.pstatus = parseInt(l.pstatus);
				l.created_desc = IG$/*mainapp*/._I40/*formatDate*/(l.created);
				l.updated_desc = IG$/*mainapp*/._I40/*formatDate*/(l.updated);
				pdesc = me.gg1/*getStatusDesc*/(l.pstatus);
				duration = Number(l.duration);
				duration = isNaN(duration) ? null : duration;
				l.duration = me.gg2/*getDuration*/(duration);
				
				l.pstatus_desc = pdesc;
				
				dp.push(l);
			}
		}
		
		grdjobhist.store.loadData(dp);
	},
		
	initComponent : function() {
		var panel = this,
			i;
			
		panel.title = IRm$/*resources*/.r1("L_LOG_VIEW");
		
		
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
			
			items: [
				{
					xtype: "panel",
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "fieldset",
							title: "Execution History",
							layout: "fit",
							items: [
								{
									xtype: "gridpanel",
									name: "grdloghist",
									store: {
										type: "store",
										fields: [
											"created", "updated", "sid", "duration", "pstatus", "created_desc", "updated_desc", "pstatus_desc"
										]
									},
									height: 120,
									columns: [
										{
											xtype: "gridcolumn",
											text: "Started time",
											dataIndex: "created_desc",
											flex: 1
										},
										{
											xtype: "gridcolumn",
											text: "End time",
											dataIndex: "updated_desc",
											flex: 1
										},
										{
											xtype: "gridcolumn",
											text: "Status",
											dataIndex: "pstatus_desc",
											width: 120
										}
									],
									listeners: {
										itemclick: function(view, record, item, index, e) {
											var sid = record.get("sid");
											
											if (sid)
											{
												this.g1/*getLogDetail*/(sid);
											}
										},
										scope: this
									}
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Log detail",
							layout: "fit",
							items: [
								{
									xtype: "gridpanel",
									name: "grdjobhist",
									height: 240,
									store: {
										xtype: "store",
										fields: [
											"sid", "duration", "jobtype", "pstatus", "created", "updated",
											"pstatus_desc",
											"created_desc", "updated_desc"
										]
									},
									columns: [
										{
											xtype: "gridcolumn",
											text: "Job type",
											dataIndex: "jobtype",
											flex: 1
										},
										{
											xtype: "gridcolumn",
											text: "Duration",
											width: 50,
											dataIndex: "duration"
										},
										{
											xtype: "gridcolumn",
											text: "Started time",
											dataIndex: "created_desc",
											width: 80
										},
										{
											xtype: "gridcolumn",
											text: "End time",
											dataIndex: "updated_desc",
											width: 80
										},
										{
											xtype: "gridcolumn",
											text: "Status",
											dataIndex: "pstatus_desc",
											width: 80
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
//						IG$/*mainapp*/._I63/*showHelp*/("P0022");
//					},
//					scope: this
//				}, 
				"->",
				{
					text: IRm$/*resources*/.r1("B_CLOSE"),
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
		
		IG$/*mainapp*/._Ia0/*hadoop_logviewer*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._I9e/*mr_javaclass*/ = function(xdoc) {
	this.xdoc = xdoc;
	this.P1/*parseContent*/();
}

IG$/*mainapp*/._I9e/*mr_javaclass*/.prototype = {
	P1/*parseContent*/: function() {
		var me = this,
			xdoc = me.xdoc,
			tnode;
		
		if (me.xdoc)
		{
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
			
			if (tnode)
			{
				me.iteminfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/SourceCode");
			
			if (tnode)
			{
				me.javasource = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
				me.javasource = Base64.decode(me.javasource);
			}
		}
	},
	
	P2/*getDefaultScript*/: function() {
		var me = this,
			r = "",
			pname = me.iteminfo.nodepath.split("/");
		
		pname.splice(0, 2);
		pname.splice(pname.length-1, 1);
		
		r += "package " + pname.join(".") + ";\n\n";
		r += "public class " + me.iteminfo.name + "\n";
		r += "{ \n";
		r += "} \n";
		
		return r;
	},
	
	l2/*toXMLString*/: function() {
		var me = this,
			r = [];
		
		r.push("<smsg><item uid='" + me.iteminfo.uid + "'>");
		r.push("<SourceCode><![CDATA[" + Base64.encode(me.javasource) + "]]></SourceCode>");
		r.push("</item></smsg>");
		
		return r.join("");
	}
}

IG$/*mainapp*/._I9d/*mr_javaeditor*/ = $s.extend($s.panel, {
	
	closable: true,
	
	layout: "border",
	bodyPadding: 0,
	
	_IFd/*init_f*/: function() {
		var me = this;
		
		me.a2/*loadItemContent*/();
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
			item = new IG$/*mainapp*/._I9e/*mr_javaclass*/(xdoc),
			jdom,
			jdomeditor,
			jview,
			w, h;
			
		me.item = item;
		jdom = $(me.down("[name=javasrc]").el.dom);
		// setValue(me.item.javasource || me.item.P2/*getDefaultScript*/());
		jdomeditor = $(".idv-jcl-edtr", jdom);
		jdomeditor.empty();
		
		w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom);
		h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom);
		
		jview = $("<div class='idv-jcl-view'></div>").appendTo(jdomeditor);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jview, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jview, h);
		
		if (!window.ace)
		{
			IG$/*mainapp*/.x03/*getScriptCache*/(ig$/*appoption*/.scmap.igcg, new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
				var editor = ace.edit(jview[0]);
				editor.getSession().setMode("ace/mode/java");
				
				editor.setValue(me.item.javasource || me.item.P2/*getDefaultScript*/());
				
				me.scriptview = jview;
				me.scripteditor = editor;
			}));
		}
		else
		{
			var editor = ace.edit(jview[0]);
			editor.getSession().setMode("ace/mode/java");
			
			editor.setValue(me.item.javasource || me.item.P2/*getDefaultScript*/());
			
			me.scriptview = jview;
			me.scripteditor = editor;
		}
	},
	
	a3/*saveMetaContent*/: function(smode) {
		var panel = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		cnt;
    	
    	panel.item.javasource = panel.scripteditor.getValue(); // panel.down("[name=javasrc]").getValue();
    	
    	cnt = panel.item.l2/*toXMLString*/.call(panel.item);
    	
    	req.init(panel, 
			{
	            ack: "31",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
	            mbody: cnt
	        }, panel, panel.rs_a3/*saveMetaContent*/, null, smode);
		req._l/*request*/();
	},
	
	rs_a3/*saveMetaContent*/: function(xdoc, smode) {
		var me = this;
		
		if (smode == "compile")
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
    	
    	cnt = panel.item.l2/*toXMLString*/.call(panel.item);
    	
    	req.init(panel, 
			{
	            ack: "3",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid, option: "compile"}, "uid;option"),
	            mbody: cnt
	        }, panel, panel.rs_a4/*doCompile*/, null);
		req._l/*request*/();
	},
	
	rs_a4/*doCompile*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/result/errormessage"),
			errmsg;
			
		if (tnode)
		{
			errmsg = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
			errmsg = Base64.decode(errmsg);
			me.down("[name=compileres]").setValue(errmsg);
		}
		else
		{
			me.down("[name=compileres]").setValue("Compiled Successfully");
		}
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this;
		
		switch (cmd)
		{
		case "cmd_save":
			me.a3/*saveMetaContent*/();
			break;
		case "cmd_compile":
			me.a3/*saveMetaContent*/("compile");
			break;
		}
	},

	initComponent: function() {
		var me = this;
		
		$s.apply(this, {
			items: [
				{
					name: "javasrc",
					region: "center",
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
					height: 120,
					region: "south",
					split: true,
					layout: "fit",
					title: "Compile result",
					items: [
						{
							xtype: "textarea",
							name: "compileres",
							height: 120,
							region: "south"
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
		        }
			]
	    });
	          
		IG$/*mainapp*/._I9d/*mr_javaeditor*/.superclass.initComponent.call(this);
	},
	
	listeners: {
		afterrender: function(tobj) {
			var me = this;
						
			me._IFd/*init_f*/();
		}
	}
	
});
IG$/*mainapp*/._baN/*bflowNode*/ = function(tnode) {
	if (tnode)
	{
		this.p1/*parseXML*/(tnode);
	}
}

IG$/*mainapp*/._baN/*bflowNode*/.prototype = {
	p1/*parseXML*/: function(tnode) {
		var node = this,
			j, lnode,
			pnodes,
			lname, lvalue;
		
		IG$/*mainapp*/._I1f/*XGetInfo*/(node, tnode, "name;shape;sid;type;role", "s");
		IG$/*mainapp*/._I1f/*XGetInfo*/(node, tnode, "x;y;w;h", "i");
		lnode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "label");
		node.text = (lnode) ? IG$/*mainapp*/._I24/*getTextContent*/(lnode) : node.name;
		lnode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "property");
		if (lnode)
		{
			IG$/*mainapp*/._I1f/*XGetInfo*/(node, lnode, "dsname;dsignoreerror", "s");
			pnodes = IG$/*mainapp*/._I26/*getChildNodes*/(lnode);
			for (j=0; j < pnodes.length; j++)
			{
				node[IG$/*mainapp*/._I29/*XGetNodeName*/(pnodes[j])] = IG$/*mainapp*/._I24/*getTextContent*/(pnodes[j]);
			}
		}
		
		lnode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "comment");
		
		if (lnode)
		{
			node.comment = IG$/*mainapp*/._I24/*getTextContent*/(lnode);
		}
		
		lnode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "additional_properties");
		if (lnode)
		{
			node.additional_properties = [];
			pnodes = IG$/*mainapp*/._I26/*getChildNodes*/(lnode);
			
			for (j=0; j < pnodes.length; j++)
			{
				node.additional_properties.push({
					name: IG$/*mainapp*/._I1b/*XGetAttr*/(pnodes[j], "name"),
					value: IG$/*mainapp*/._I1b/*XGetAttr*/(pnodes[j], "value")
				});
			}
		}
		lnode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "states");
		if (lnode)
		{
			node.states = [];
			pnodes = IG$/*mainapp*/._I26/*getChildNodes*/(lnode);
			
			for (j=0; j < pnodes.length; j++)
			{
				node.states.push({
					name: IG$/*mainapp*/._I1b/*XGetAttr*/(pnodes[j], "name")
				});
			}
		}
		lnode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "precision");
		if (lnode)
		{
			node.precision = IG$/*mainapp*/._I24/*getTextContent*/(lnode);
		}
		lnode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "unit");
		if (lnode)
		{
			node.unit = {};
			pnodes = IG$/*mainapp*/._I26/*getChildNodes*/(lnode);
			
			for (j=0; j < pnodes.length; j++)
			{
				lname = IG$/*mainapp*/._I1b/*XGetAttr*/(pnodes[j], "name");
				lvalue = IG$/*mainapp*/._I24/*getTextContent*/(pnodes[j]);
				node.unit[lname] = lvalue;
			}
		}
	},
	
	c1/*clone*/: function(tobj) {
		var me = this,
			p = "name;shape;x;y;w;h;text;dsname;dsignoreerror;comment".split(";"),
			i, l;
		
		for (i=0; i < p.length; i++)
		{
			me[p[i]] = tobj[p[i]];
		}
		
		if (tobj._cs)
		{
			me._cs = [];
			for (i=0; i < tobj._cs.length; i++)
			{
				me._cs.push(tobj._cs[i]);
			}
		}
		
		if (tobj.additional_properties)
		{
			l = tobj.additional_properties;
			me.additional_properties = [];
			for (i=0; i < l.length; i++)
			{
				me.additional_properties.push({
					name: l[i].name,
					value: l[i].value
				});
			}
		}
		
		if (tobj.states)
		{
			l = tobj.states;
			
			me.states = [];
			
			for (i=0; i < l.length; i++)
			{
				me.states.push({
					name: l[i].name
				});
			}
		}
		
		me.precision = tobj.precision;
		
		if (tobj.unit)
		{
			me.unit = {};
			
			for (l in tobj.unit)
			{
				me.unit[l] = tobj.unit[l];
			}
		}
	},
	
	paint: function(g, emode) {
		var me = this,
			box = me.box,
			dg = $(".idv-flw-grp", box),
			dul,
			visualstates = g ? g.visualstates : null,
			mw = 102;
			
		dg.hide();
		dg.empty();
		
		if (visualstates && emode == 1)
		{
			box.width(150);
			dg.show();
			
			dul = $("<ul class='idv-visual-lst'></ul>").appendTo(dg);
			
			$.each(visualstates, function(n, states) {
				var values = states.values,
					i,
					statview,
					sviewarea,
					sname,
					sgraph;
				
				statview = $("<li class='idv-visual-states'></li>").appendTo(dul);
				sviewarea = $("<div class='idv-visual-area'></div>").appendTo(statview);
				sname = $("<div class='idv-visual-statname'><span id='statname'></span></div>").appendTo(sviewarea);
				
				$("#statname", sname).text(states.name);

				if (values && values.length)
				{
					$.each(values, function(i, value) {
						var sgraph = $("<div class='idv-visual-graph'><div class='idv-visual-graphval'><span>-</span></div></div>").appendTo(sviewarea),
							gval,
							n = "" + value.barlength;
							
						if (n.indexOf(".") > -1)
						{
							n = n.substring(0, n.indexOf(".") + 3);
						}
						
						gval = $(".idv-visual-graphval", sgraph).css({width: Number(value.barlength) + "%"});
						
						$("span", gval).text(n + " %");
						
						gval.attr("title", n + " %");
						
						sgraph.bind("click", function() {
							me.visualStateClick.call(me, g, {
								states: states,
								value: value
							});
						});
					});
				}
			});
		}
		else
		{
			box.width(100);
		}
	},
	
	visualStateClick: function(g, value) {
		var me = this;
		me._bf.container.trigger("visual_state_click", {
			graphic: g,
			state: value
		});
	}
}

IG$/*mainapp*/._I99/*bflowoption*/ = {
	hoverPaintStyle: { strokeStyle:"#7ec3d9" }
};

IG$/*mainapp*/._I9a/*flowDiagram*/ = function(container) {
	this.container = container;
}

IG$/*mainapp*/._I9a/*flowDiagram*/.prototype = {
	init: function() {
		var me = this,
			container = me.container,
			doc = $(document),
			mainarea;
		
		me.mwidth = 0;
		me.mheight = 0;
		
		container.empty();
		
		me.sid = 0;
		me.a_boxes = [];
		me.m_boxes = {};
		
		me.mainarea = mainarea = $("<div class='idv-flw-mreg'></div>").appendTo(container);
		
		me.render = $("<div id='render'></div>").appendTo(mainarea);
		
		me.plumb = jsPlumb.getInstance({
			Endpoint: ["Dot", {radius: 5}],
			HoverPaintStyle: {strokeStyle: "#42a62c", lineWidth: 2},
			ConnectionOverlays: [
				["Arrow", {
					location: 1,
					id: "arrow",
					length: 14,
					foldback: 0.8
				}],
				["Label", {label: "", id: "label"}]
			]
		});
		
		me.plumb.bind("connection", function(info, e) {
			var lnk = info.connection,
				src = lnk.source,
				tgt = lnk.target;
            
            src = me.getBoxObject.call(me, src);
            tgt = me.getBoxObject.call(me, tgt);
            
            if (src && tgt && e) 
            {
            	me.container.trigger("flow_changed", {
    				item: {
    					src: src.sid,
    					tgt: tgt.sid
    				},
    				source: "link_node"
    			});
            }
		});
		
		me.plumb.bind("connectionDetached", function(info, e) {
			var lnk = info.connection,
				src = lnk.source,
				tgt = lnk.target;
	        
	        src = me.getBoxObject.call(me, src);
	        tgt = me.getBoxObject.call(me, tgt);
	        
	        if (src && tgt && e) 
	        {
	        	me.container.trigger("flow_changed", {
					item: {
						src: src.sid,
						tgt: tgt.sid
					},
					source: "link_detach"
				});
	        }
		});
		
		me.plumb.bind("connectionMoved", function(info, e) {
			var s1 = info.originalSourceId,
				s2 = info.newSourceId,
				t1 = info.originalTargetId,
				t2 = info.newTargetId;
			
			s1 = me.getBoxObject.call(me, s1);
			s2 = me.getBoxObject.call(me, s2);
			t1 = me.getBoxObject.call(me, t1);
			t2 = me.getBoxObject.call(me, t2);
			
			if (s1 && s2 && t1 && t2 && e)
			{
				me.container.trigger("flow_changed", {
					item: {
						source_0: s1.sid,
						source_1: s2.sid,
						target_0: t1.sid,
						target_1: t2.sid
					},
					source: "move_link"
				});
			}
		});
				
		var gpt;
		
		var gf_mousemove = function(e) {
			if (gpt)
			{
				var mpt = {
					x: e.pageX,
					y: e.pageY
				}, tx = 0, ty = 0,
				tw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.container),
				th = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.container),
				mw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.mainarea),
				mh = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.mainarea),
				om = gpt.om,
				ot = me.container.offset(),
				gx = om.left - ot.left,
				gy = om.top - ot.top,
				sx, sy;
				
				if (mw > tw || mh > th)
				{
					tx = mpt.x - gpt.x;
					ty = mpt.y - gpt.y;
					
					sy = gy + ty;
					sx = gx + tx;
										
					if (sy < (th - mh))
					{
						sy = th - mh;
					}
					else if (sy > 0)
					{
						sy = 0;
					}
					
					if (sx < (tw - mw))
					{
						sx = tw - mw;
					}
					else if (sx > 0)
					{
						sx = 0;
					}
					
					me.mainarea.css({top: sy, left: sx});
				}
			}
		};
		
		var gf_mouseup = function(e) {
			doc.unbind("mousemove", gf_mousemove);
			doc.unbind("mouseup", gf_mouseup);
		};
		
		mainarea.bind({
			mousedown: function(e) {
				if (e.srcElement && e.srcElement == mainarea[0])
				{
					gpt = {
						x: e.pageX,
						y: e.pageY,
						om: me.mainarea.offset()
					};
					doc.bind("mousemove", gf_mousemove);
					doc.bind("mouseup", gf_mouseup);
				}
			},
			mouseup: function(e) {
				doc.unbind("mousemove", gf_mousemove);
				doc.unbind("mouseup", gf_mouseup);
			}
		});
	},
	
	getID: function(sid) {
		var me = this;
		
		if (!sid)
		{
			sid = "uid_" + me.sid++;
		}
		
		while (me.m_boxes[sid]) {
			sid = "uid_" + me.sid++;
		}
		
		return sid;
	},
	
	s1/*setStatus*/: function(stat) {
		var me = this,
			item = me.m_boxes[stat.lid];
			
		if (item && item.statdv)
		{
			item.statdv.removeClass("idv-flw-shp mec-stat-saved");
			item.statdv.removeClass("idv-flw-shp mec-stat-on");
			item.statdv.removeClass("idv-flw-shp mec-stat-err");
			
			switch (stat.status)
			{
			case 1:
				item.statdv.addClass("idv-flw-shp mec-stat-on");
				break;
			case 10:
				item.statdv.addClass("idv-flw-shp mec-stat-saved");
				break;
			default:
				item.statdv.addClass("idv-flw-shp mec-stat-err");
				break;
			}
		}
	},
	
	s2/*clearStatus*/: function() {
		var me = this,
			a_boxes = me.a_boxes,
			i;
			
		for (i=0; i < a_boxes.length; i++)
		{
			if (a_boxes[i].statdv)
			{
				a_boxes[i].statdv.removeClass("idv-flw-shp mec-stat-saved");
				a_boxes[i].statdv.removeClass("idv-flw-shp mec-stat-on");
				a_boxes[i].statdv.removeClass("idv-flw-shp mec-stat-err");
			}
		}
	},
	
	addBox: function(item, p, isnew) {
		var me = this;
		me.a_boxes.push(item);
		
		if (IG$/*mainapp*/._I07/*checkUID*/(item.sid) == false)
		{
			var me = this,
				lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
			lreq.init(me, 
				{
		            ack: "11",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "newid"})
				}, me, function(xdoc) {
					var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
						suid = (tnode ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid") : null);
					
					if (suid)
					{
						item.sid = suid;
						me.rs_addBox.call(me, item, p, isnew);
					}
				}, false);
				
			lreq._l/*request*/();
		}
		else
		{
			this.rs_addBox(item, p, isnew);
		}
	},
	
	rs_addBox: function(item, p, isnew) {
		var me = this,
			dv, dvc, ep, title, dp, i,
			dg;
		
		dv = $("<div class='idv-flw-shp'></div>").appendTo(me.mainarea);
		dv.css({left: p.left, top: p.top});
		if (p.w && p.h)
		{
			dv.width(p.w);
			// dv.height(p.h);
		}
		
		if (item._cs && item._cs.length)
		{
			for (i=0; i < item._cs.length; i++)
			{
				dv.addClass(item._cs[i]);
			}
		}
		
		bg = $("#bgimg", dv);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(bg, IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dv));
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(bg, IG$/*mainapp*/.x_10/*jqueryExtension*/._h(dv));
		item.box = dv;
		item._bf = me;
		item.dv_dsname = $("<div class='idv-bd-dsnm'>" + (item.dsname || "") + "</div>").appendTo(dv);
		
		dvc = $("<div class='ba_m_title_c'></div>").appendTo(dv);
		title = $("<span class='ba_m_title' title='" + item.text + "'>" + item.text + "</span>").appendTo(dvc);
		$("<div class='mec-ep'></div>").appendTo(dv);
		dp = $("<div class='mec-rp'></div>").appendTo(dv);
		
		item.statdv = $("<div class='mec-stat'></div>").appendTo(dv);
		item.sid = item.sid || me.getID();
		
		item.__tL/*titleArea*/ = title;
		
		title.bind("click", function() {
			me.container.trigger("boxClicked", item);
		});
		
		dg = $("<div class='idv-flw-grp'></div>").appendTo(dv).hide();
		
		me.plumb.draggable(dv);
		
		me.plumb.makeSource(dv, {
			filter: ".mec-ep",
			anchor: "Continuous",
			connector: ["StateMachine", {curviness: 20}],
			connectorStyle: {strokeStyle: "#efefef", lineWidth: 2},
			maxConnections: 30,
			onMaxConnections: function(info, e) {
			}
		});
		
		me.plumb.makeTarget(dv, {
			dropOptions: {hoverClass: "dragHover"},
			anchor: "Continuous",
			allowLoopback: false
		});
		
		me.m_boxes[item.sid] = item;
		
		dp.bind("click", function() {
			me.removeBox.call(me, item, true);
		});
		
		if (isnew)
		{
			me.container.trigger("flow_changed", {
				item: item,
				source: "box_add"
			});
		}
		
		me.u1/*updateSize*/();
	},
	
	s4/*setTitle*/: function(item, txt) {
		var me = this,
			titlearea = item.__tL/*titleArea*/;
		
		titlearea.text(txt);
		titlearea.attr("title", txt);
	},
	
	removeBox: function(item, bconfirm) {
		var me = this;
			
		if (bconfirm == true)
		{
			IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, "Confirm to delete node!", function(e) {
				if (e == "yes")
				{
					me.rs_removeBox.call(me, item);
				}
			});
		}
		else
		{
			me.rs_removeBox.call(me, item);
		}
	},
	
	rs_removeBox: function(item) {
		var me = this,
			i;
			
		me.plumb.detachAllConnections(item.box);
		item.box.remove();
		
		for (i=0; i < me.a_boxes.length; i++)
		{
			if (me.a_boxes[i].sid == item.sid)
			{
				me.a_boxes.splice(i, 1);
				break;
			}
		}
		delete me.m_boxes[item.sid];
		
		me.u1/*updateSize*/();
	},
	
	u1/*updateSize*/: function() {
		var me = this, 
			mwidth = 0,
			mheight = 0,
			twidth = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.container),
			theight = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.container),
			i, boxes = me.a_boxes;
			
		for (i=0; i < boxes.length; i++)
		{
			mwidth = Math.max(mwidth, boxes[i].x + boxes[i].w);
			mheight = Math.max(mheight, boxes[i].y + boxes[i].h);
		}
		
		mwidth = Math.max(mwidth+20, twidth);
		mheight = Math.max(mheight+20, theight);
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.mainarea, mwidth);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.mainarea, mheight);
	},
	
	addLink: function(lnk) {
		var me = this,
            did1 = me.m_boxes[lnk.from] ? me.m_boxes[lnk.from].box : null,
            did2 = me.m_boxes[lnk.to] ? me.m_boxes[lnk.to].box : null,
            stroke = "rgb(189,11,11)";
            
        if (!did1 || !did2)
        	return;
            
        var mlink = me.plumb.connect(
            {
                source: did1, 
                target: did2, 
                paintStyle:{ 
                    lineWidth:8,
                    strokeStyle: stroke,
                    outlineColor:"#666",
                    outlineWidth:1,
                    dashstyle: null
                },
                detachable: true,
                hoverPaintStyle: IG$/*mainapp*/._I99/*bflowoption*/.hoverPaintStyle, 
                anchors:[ [ 0.3 , 1, 0, 1 ], "TopCenter" ], 
                overlays: [
                    ["DoubleLine", { fillStyle: "#09098e", width: 15, length: 15 } ]
//                     [
//                     	"Custom", {
//                     		create: function(component) {
//                     			return $("<div><div class='ba-single-line'></div></div>");
//                     		},
//                     		location: 0.5
//                     	}
//                    ]
                ],
                endpoint: [
                	"Dot",
	                {
	                	radius: 5
	                }
                ],
                endpointStyles: {fillStyle: "#456"}
            }
        );
        mlink.ptr_link = lnk;
	},
	
	L1/*loadOption*/: function(itemobj) {
		var me = this,
			node, lnk,
			i;
			
		me.itemobj = itemobj;
		
		me.init();
		
		$.each(itemobj.nodes, function(i, node) {
			me.addBox(node, {
				left: node.x,
				top: node.y,
				w: node.w,
				h: node.h
			});
		});
		
		for (i=0; i < itemobj.links.length; i++)
		{
			lnk = itemobj.links[i];
			me.addLink(lnk);
		}
	},
	
	m1/*appProperty*/: function(r, box, params) {
		var i,
			pnames = params.split(";");
		
		for (i=0; i < pnames.length; i++)
		{
			if (box[pnames[i]])
			{
				r.push("<" + pnames[i] + "><![CDATA[" + (box[pnames[i]] || "") + "]]></" + pnames[i] + ">");
			}
		}
	},
	
	l2/*exportContent*/: function(mtype, mtypename) {
		var me = this,
			r = [],
			i, j, l, o, box, ab, lnk, ptr_link,
			toffset = me.mainarea.offset();
		
		r.push("<nodes");
		
		if (mtype && mtypename)
		{
			r.push(" type='" + mtype + "' typename='" + mtypename + "'");
		}
		
		r.push(">");
		
		for (i=0; i < me.a_boxes.length; i++)
		{
			ab = me.a_boxes[i];
			o = ab.box.offset();
            box = {
                name: ab.name,
                shape: ab.shape || "",
                x: o.left - toffset.left,
                y: o.top - toffset.top,
                w: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(ab.box),
                h: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(ab.box),
                sid: ab.sid,
                text: ab.text,
                dsname: ab.dsname,
                dsdesc: ab.dsdesc,
                dstype: ab.dstype,
                dsignoreerror: ab.dsignoreerror,
                dsmapper: ab.dsmapper,
                dsreducer: ab.dsreducer,
                dstname: ab.dstname,
                dsscript: ab.dsscript,
                dsfname: ab.dsfname,
                dsskipexist: ab.dsskipexist,
                doctmpl: ab.doctmpl,
                type: ab.type,
                role: ab.role,
                additional_properties: ab.additional_properties,
                states: ab.states,
                precision: ab.precision,
                unit: ab.unit,
                comment: ab.comment
            };
            
            r.push("<node" + IG$/*mainapp*/._I20/*XUpdateInfo*/(box, "name;shape;sid;x;y;w;h;type;role", "s") + ">");
            r.push("<label><![CDATA[" + box.text + "]]></label>");
            
            if (box.comment)
            {
            	r.push("<comment><![CDATA[" + box.comment + "]]></comment>");
            }
            
            r.push("<property");
            r.push(IG$/*mainapp*/._I20/*XUpdateInfo*/(ab, "dsname;dsignoreerror", "s"));
            r.push(">");
            
            switch (box.name)
            {
            case "datasource":
            	me.m1/*appProperty*/(r, ab, "dsdesc;dstype;dsmapper;dsreducer;dsfname;dstname;dsskipexist");
            	break;
            case "shell":
            	me.m1/*appProperty*/(r, ab, "dsdesc;dsscript");
            	break;
            case "hive":
            	me.m1/*appProperty*/(r, ab, "dsdesc;dsscript");
            	break;
            case "mongoreduce":
            	me.m1/*appProperty*/(r, ab, "dsdesc;rowregex;rowsample;mrtype;m_delim;cfields");
            	break;
            case "mongodoc":
            	me.m1/*appProperty*/(r, ab, "dsdesc;doctmpl;mrnode;mrdb;mrcol;mrdocname;mrsmode");
            	break;
            case "mapreduce":
            	me.m1/*appProperty*/(r, ab, "dsdesc;dsmapper;dsreducer;confparams");
            	break;
            case "output":
            	me.m1/*appProperty*/(r, ab, "dsdesc;dsfname;dscnames;dsruntype;dsdelim;dsdelimval;dstcube;dstcubeuid;dsmeasuredelim;dsmeasuredelimval;dsmname;dscsdatause;dscsdatafile");
            	break;
            default:
            	me.m1/*appProperty*/(r, ab, "dsdesc");
            	break;
            }
            r.push("</property>");
            
            l = box.additional_properties;
		
			if (l && l.length)
			{
				r.push("<additional_properties>");
				
				for (j=0; j < l.length; j++)
				{
					r.push("<property name='" + l[j].name + "' value='" + l[j].value + "'/>");
				}
				
				r.push("</additional_properties>");
			}
			
			l = box.states;
			
			if (l && l.length)
			{
				r.push("<states>");
				
				for (j=0; j < l.length; j++)
				{
					r.push("<state name='" + l[j].name + "'/>");
				}
				
				r.push("</states>");
			}
			
			if (box.precision)
			{
				r.push("<precision>" + box.precision + "</precision>");
			}
			
			if (box.unit)
			{
				r.push("<unit>");
				
				for (j in box.unit)
				{
					r.push("<property name='" + j + "'><![CDATA[" + box.unit[j] + "]]></property>");
				}
				
				r.push("</unit>");
			}
            
            r.push("</node>");
		}
		r.push("</nodes>");
		
		var cons = me.plumb.getConnections(),
			src, tgt;
		r.push("<links>");
		if (cons && cons.length)
		{
			for (i=0; i < cons.length; i++)
			{
				lnk = cons[i];
				ptr_link = lnk.ptr_link;
				src = lnk.source;
                tgt = lnk.target;
                
                src = me.getBoxObject(src);
                tgt = me.getBoxObject(tgt);
                
                if (src && tgt) {
                    var p = lnk.getPaintStyle();
                    r.push("<link");
                    
                    r.push(IG$/*mainapp*/._I20/*XUpdateInfo*/({
                        from: src.sid, 
                        to: tgt.sid,
                        dashstyle: (p.dashstyle) ? true : false,
                        directed: ptr_link ? ptr_link.directed : "T"
                    }, "from;to;dashstyle;directed", "s"));
                    r.push(">");
                    
                    if (ptr_link && ptr_link.potential)
                    {
                    	r.push(ptr_link.potential.p2/*toXMLString*/());
                    }
                    
                    if (ptr_link && ptr_link.revealing_condition)
                    {
                    	r.push("<revealing_condition>");
                    	
                    	if (ptr_link.revealing_condition.states)
                    	{
                    		r.push("<states>");
                    		for (j=0; j < ptr_link.revealing_condition.states.length; j++)
                    		{
                    			r.push("<state name='" + ptr_link.revealing_condition.states[j].name + "'></state>");
                    		}
                    		r.push("</states>");
                    	}
                    	
                    	r.push("</revealing_condition>");
                    }
                    
                    r.push("</link>");
                }
			}
		}
		r.push("</links>");
		
		return r.join("");
	},
	
	getBoxObject: function(elem) {
		var me = this,
            i, r,
            boxes = me.a_boxes,
            t = typeof(elem) == "string" ? 0 : 1,
            elem_id = t ? $(elem).attr("id") : null,
            box_id;
		
        for (i=0; i < boxes.length; i++) 
        {
            if (!t && boxes[i].sid == elem) 
            {
                r = boxes[i];
                break;
            }
            else if (t) 
            {
            	box_id = boxes[i].box.attr("id");
            	if (box_id == elem_id)
            	{
	                r = boxes[i];
	                break;
            	}
            }
        }
        
        return r;
	}
}
IG$/*mainapp*/._IB7/*bpeditor*/ = $s.extend($s.window, {
	modal: true,
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 500,
	height: 500,
	
	callback: null,
	
	_IFd/*init_f*/: function() {
	},
	
	L1/*runProcess*/: function() {
		var me = this,
			panel = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		cnt = [];
    	
    	cnt.push("<smsg><item uid='" + (me.uid || "") + "'>");
		cnt.push("<command><![CDATA[" + Base64.encode(me.down("[name=txtcommand]").getValue()) + "]]></command>");
		cnt.push("</item></smsg>");
    	
    	req.init(panel, 
			{
	            ack: "3",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid, option: "command"}, "uid;option"),
	            mbody: cnt.join("")
	        }, panel, panel.rs_L1/*runProcess*/, null);
		req._l/*request*/();
	},
	
	rs_L1/*runProcess*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/errormessage"),
			errmsg,
			msg;
			
		if (tnode)
		{
			errmsg = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
			errmsg = Base64.decode(errmsg);
			me.down("[name=txtconsole]").setValue(errmsg);
		}
		else
		{
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/message");
			if (tnode)
			{
				msg = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
				msg = Base64.decode(msg);
				me.down("[name=txtconsole]").setValue(msg);
			}
		}
	},
	
	initComponent: function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1('L_MAKEITEM');
		
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
			items: [
				{
					xtype: "panel",
					layout: "border",
					autoHeight: true,
					defaults: {
						anchor: "100%"
					},
					items: [
						{
							xtype: "textarea",
							height: 300,
							region: "center",
							name: "txtcommand"
						},
						{
							xtype: "panel",
							height: 200,
							region: "south",
							title: "Console Output",
							layout: "fit",
							items: [
								{
									xtype: "textarea",
									name: "txtconsole"
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
						this.L1/*runProcess*/();
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
		
		IG$/*mainapp*/._IB7/*bpeditor*/.superclass.initComponent.call(this);
	},
	
	listeners: {
		afterrender: function(tobj) {
			var me = this;
			me._IFd/*init_f*/();
		}
	}
	
});	


IG$/*mainapp*/._IB8/*bpobject*/ = function(xdoc, bf) {
	var me = this;
	me.bf = bf;
	xdoc && me.L1/*parseContent*/(xdoc);
}

IG$/*mainapp*/._IB8/*bpobject*/.prototype = {
	L1/*parseContent*/: function(xdoc) {
		var me = this,
			pnode,
			tnode, tnodes, i, j, pnodes, node, lnode, lnk;
		
		me.nodes = [];
		me.links = [];
		
		pnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		
		if (pnode)
		{
			me.item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(pnode);
			
			tnode = IG$/*mainapp*/._I19/*getSubNode*/(pnode, "nodes");
			if (tnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < tnodes.length; i++)
				{
					node = new IG$/*mainapp*/._baN/*bflowNode*/(tnodes[i]);
					me.nodes.push(node);
				}
			}
			
			tnode = IG$/*mainapp*/._I19/*getSubNode*/(pnode, "links");
			if (tnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < tnodes.length; i++)
				{
					lnk = {};
					IG$/*mainapp*/._I1f/*XGetInfo*/(lnk, tnodes[i], "from;to;dashstyle", "s");
					
					me.links.push(lnk);
				}
			}
		}
		
		me.bf.L1/*loadOption*/.call(me.bf, me);
	},
	
	L2/*getContent*/: function() {
		var me = this,
			r = [];
		
		r.push("<smsg><item");
		
		me.item && r.push(IG$/*mainapp*/._I20/*XUpdateInfo*/(me.item, "uid;nodepath;name", "s"));
		r.push(">");
		
		r.push(me.bf.l2/*exportContent*/.call(me.bf));
		
		r.push("</item></smsg>");
		
		return r.join("");
	}
}
	

/**********
 * Main panel : flow editor
 */
IG$/*mainapp*/._IB9/*flowEditor*/ = $s.extend($s.panel, {
	closable: true,
	
	layout: {
		type: "vbox",
		align: "stretch"
	},
	bodyPadding: 0,
	sgap: 1000,
	
	_IFd/*init_f*/: function() {
		var me = this,
			topmenu = me.topmenu,
			mainarea = me.mainarea,
			fmenu,
			farea,
			bf,
			dt = [],
			__m/*mode*/ = me.__m/*mode*/,
			bccall;
			
		dt = [
			{
				shape: "rect",
				name: "datasource",
				text: "Data source"
			},
			{
				shape: "ellipse",
				name: "mapreduce",
				text: "Map/Reduce",
				hidden: __m/*mode*/
			},
			{
				shape: "ellipse",
				name: "mongoreduce",
				text: "Data Processing",
				hidden: !__m/*mode*/
			},
			{
				shape: "ellipse",
				name: "mongodoc",
				text: "Update Document",
				hidden: !__m/*mode*/
			},
			{
				shape: "ellipse",
				name: "hive",
				text: "Hive Job",
				hidden: __m/*mode*/
			},
			{
				shape: "triangle",
				name: "shell",
				text: "Shell Command",
				hidden: __m/*mode*/
			},
			{
				shape: "triangle",
				name: "dataprocess",
				text: "Data processing",
				hidden: __m/*mode*/
			},
			{
				shape: "diamond",
				name: "output",
				text: "Output"
			}
		];
		
		farea = me.farea = $("<div class='idv-flw-reg'></div>").appendTo(mainarea);
		
		bf = me.bf = new IG$/*mainapp*/._I9a/*flowDiagram*/(farea);
		bf.init.call(bf);
			
		topmenu.empty();
		fmenu = $("<div class='idv-flw-mnu'></div>").appendTo(topmenu);
		
		me.l1/*initFlowMenu*/(fmenu, dt);
		
		bccall = new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.l4/*onBoxUpdate*/);
		
		bf.container.bind("boxClicked", function(ev, data) {
			var dlg,
				moption = me.down("[name=moption]");
				
			moption.removeAll();
			
			switch (data.name)
			{
			case "datasource":
				dlg = new IG$/*mainapp*/.BC$ds/*hadoop_datasource*/({
					job: data,
					_p/*editor*/: me,
					__m/*mode*/: __m/*mode*/,
					callback: bccall
				});
				break;
			case "mapreduce":
				dlg = new IG$/*mainapp*/.BC$mr/*hadoop_mapreduce*/({
					job: data,
					_p/*editor*/: me,
					__m/*mode*/: __m/*mode*/,
					callback: bccall
				});
				break;
			case "mongoreduce":
				dlg = new IG$/*mainapp*/.BC$mr1/*mongo_mapreduce*/({
					job: data,
					_p/*editor*/: me,
					__m/*mode*/: __m/*mode*/,
					callback: bccall
				});
				break;
			case "mongodoc":
				dlg = new IG$/*mainapp*/.BC$mr2/*mongo_document*/({
					job: data,
					_p/*editor*/: me,
					__m/*mode*/: __m/*mode*/,
					callback: bccall
				});
				break;
			case "shell":
				dlg = new BC$sc({
					job: data,
					_p/*editor*/: me,
					__m/*mode*/: __m/*mode*/,
					callback: bccall
				});
				break;
			case "hive":
				dlg = new IG$/*mainapp*/.BC$hj/*hadoop_hivejob*/({
					job: data,
					_p/*editor*/: me,
					__m/*mode*/: __m/*mode*/,
					callback: bccall
				});
				break;
			case "output":
				dlg = new IG$/*mainapp*/.BC$op/*hadoop_output*/({
					job: data,
					_p/*editor*/: me,
					__m/*mode*/: __m/*mode*/,
					callback: bccall
				});
				break;
			}
			
			if (dlg)
			{
				moption.expand();
				moption.add(dlg);
				
				dlg.on("close_dlg", function(m) {
					moption.remove(dlg);
					moption.collapse();
				});
				// IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
			}
		});
		
		if (me.uid)
		{
			me.M1/*loadContent*/();
		}
		else
		{
			me.rs_M1/*rs_loadContent*/(null);
		}
	},
	
	l4/*onBoxUpdate*/: function(job) {
		job.dv_dsname.text(job.dsname);
	},
	
	M1/*loadContent*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		if (me.uid)
		{	
			req.init(me, 
				{
		            ack: "5",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'diagnostics'})
		        }, me, me.rs_M1/*rs_loadContent*/, false);
			req._l/*request*/();
		}
		else
		{
			me.itemobj = new IG$/*mainapp*/._IB8/*bpobject*/(null, me.bf);
		}
	},
	
	rs_M1/*rs_loadContent*/: function(xdoc) {
		var me = this;
		
		me.itemobj = new IG$/*mainapp*/._IB8/*bpobject*/(xdoc, me.bf);
	},
	
	m2/*getParents*/: function(mobj, pname) {
		var me = this,
			bf = me.bf,
			a_boxes = bf.a_boxes,
			i,
			cobj,
			cons = bf.plumb.getConnections(),
			src, tgt,
			connections = [],
			prev = [];
			
		for (i=0; i < a_boxes.length; i++)
		{
			if (a_boxes[i].sid == mobj.job.sid)
			{
				cobj = a_boxes[i];
				break;
			}
		}
		
		if (cons && cons.length)
		{
			for (i=0; i < cons.length; i++)
			{
				src = cons[i].source;
	            tgt = cons[i].target;
	            
	            src = bf.getBoxObject.call(bf, src);
	            tgt = bf.getBoxObject.call(bf, tgt);
	            
	            connections.push({
	            	src: src,
	            	tgt: tgt
	            });
	            
	            if (tgt && tgt.sid == cobj.sid)
	            {
	            	if (src && (pname && src.name == pname || !pname))
	            	{
	            		prev.push(src);
	            	}
	            }
	        }
		}
		
		return prev;
	},
	
	l1/*initFlowMenu*/: function(fmenu, dt) {
		var me = this,
			i,
			mul,
			gap = 10,
			sx = gap,
			bf = me.bf;
			
		fmenu.empty();
		
		$.each(dt, function(n, item) {
			var dv,
				bg;
			
			if (!item.hidden)
			{
				var nitem = new IG$/*mainapp*/._baN/*bflowNode*/();
				nitem.c1/*clone*/.call(nitem, item);
				dv = $("<div class='idv-flw-shp-a'><div>" + nitem.text + "</div></div>").appendTo(fmenu);
				dv.css({left: sx});
				nitem.div = dv;
				sx += gap + (IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dv) || 120);
				dv.draggable({
					opacity: 0.7, 
					helper: "clone",
					stop: function(event, ui) {
						var p = ui.position,
							farea = me.farea,
							mp = $(farea.parent()).offset(),
							mposition = farea.offset(),
							mw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(farea),
							mh = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(farea);
							
						mposition.top -= mp.top;
						mposition.left -= mp.left;
						
						if (mposition.left < p.left && p.left < mposition.left + mw 
							&& mposition.top < p.top && p.top < mposition.top + mh)
						{
							bf.addBox.call(bf, nitem, p);
						}
					}
				});
			}
		});
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this;
		
		switch (cmd)
		{
		case "cmd_save":
			if (!me.uid)
			{
				me.fV7/*saveAsMetaContent*/(false);
			}
			else
			{
				me.fV6/*saveMetaContent*/(false);
			}
			break;
		case "cmd_saveas":
			me.fV7/*saveAsMetaContent*/(false);
			break;
		case "cmd_run":
			me.lll/*runBusiness*/();
			break;
		case "cmd_favorites":
			if (this.uid)
    		{
    			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
    			req.init(me, 
					{
			            ack: "11",
			        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid}),
			            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'addfavorites'})
			        }, me, me.rs_i1_2/*regFavorites*/, null, null);
				req._l/*request*/();
    		}
    		else
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_ERR_NSAVE'), null, me, 1, "error");
			}
			break;
		case "cmd_schedule":
			if (me.uid)
			{
				var mreq = [
					{
						ack: "3",
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, option: "execute"}, "uid;option"),
						mbody: me.itemobj.L2/*getContent*/.call(me.itemobj),
						jobkey: "0"
					}
				]; 
				
				IG$/*mainapp*/._I50/*showScheduler*/(me, me.uid, me.itemtype, mreq, null);
			}
			break;
		case "cmd_log_view":
			if (this.uid)
			{
				var dlg = new IG$/*mainapp*/._Ia0/*hadoop_logviewer*/({
					uid: me.uid
				});
				
				IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
			}
			else
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_ERR_NSAVE'), null, me, 1, "error");
			}
			break;
		}
	},
	
	rs_i1_2/*regFavorites*/: function(xdoc) {
    	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED_FAV"), null, null, 0, "success");
    },
    
    lll/*runBusiness*/: function() {
    	var panel = this,
    		me = panel,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		contentxml = panel.itemobj.L2/*getContent*/.call(panel.itemobj);
    	req.showerror = false;
    	req.init(panel, 
			{
	            ack: "3",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, option: "execute", type: me.itemtype}, "uid;option;type"),
	            mbody: contentxml
	        }, panel, panel.rs_lll/*runBusiness*/, panel.rs_lllE/*runBusinessError*/);
		req._l/*request*/();
    },
    
    rs_lll/*runBusiness*/: function(xdoc) {
    	var me = this,
    		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/result");
    	
    	if (tnode)
    	{
    		me.sid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "sid");
    		
    		me.ll4/*getStatus*/();
    	}
    },
    
    ll4/*getStatus*/: function() {
    	var me = this;
    	
    	if (me.stimer)
		{
			clearTimeout(me.stimer);
		}
		
		me.stimer = setTimeout(function() {
			me.ll3/*getRunStatus*/.call(me);
		}, me.sgap);
    },
    
    rs_lllE/*runBusinessError*/: function(xdoc) {
    	var panel = this,
    		r = true,
    		errcode = IG$/*mainapp*/._I27/*getErrorCode*/(xdoc);
    	
    	if(errcode == "0x28a0")
    	{
    		r = false;
    		
    		var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
    			sid = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
    			
    		if (sid)
    		{
    			IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, "Already workflow is running on server. Would you like to stop service?", function(e) {
	    			if (e == "yes")
	    			{
	    				var req = new IG$/*mainapp*/._I3e/*requestServer*/();
	    				req.init(panel, 
							{
				                ack: "3",
					            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid, sid: sid, option: "cancelWorkflow"}, "uid;sid;option"),
					            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
				            }, panel, panel.rs_ll2/*cancelWorkflow*/, null);
					    req._l/*request*/();
	    			}
	    		}, panel, panel);
    		}
    	}
    	
    	return r;
    },
    
    rs_ll2/*cancelWorkflow*/: function(xdoc) {
    	var me = this;
    	me.lll/*runBusiness*/();
    },
	
	fV6/*saveMetaContent*/: function(afterclose) {
		var panel = this,
			contentxml = panel.itemobj.L2/*getContent*/.call(panel.itemobj);
    	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	req.init(panel, 
			{
	            ack: "31",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
	            mbody: contentxml
	        }, panel, panel.rs_fV6/*saveMetaContent*/, null, [afterclose]);
		req._l/*request*/();
	},
	
	rs_fV6/*saveMetaContent*/: function(xdoc, opt) {
		var me = this,
			afterclose = (opt ? opt[0] : false);
    	if (afterclose == true)
    	{
    		me.close();
    	}
    	else
    	{
    		me._ILb_/*contentchanged*/ = false;
    		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
    	}
	},
	
	fV7/*saveAsMetaContent*/: function(afterclose) {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
	    		mode: "newitem",
	    		initpath: me.nodepath,
	    		callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.fV8/*saveNewMetaContent*/, afterclose)
	    	});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlgitemsel);
	},
	
	fV8/*saveNewMetaContent*/: function(item, afterclose) {
		var panel = this,
    		contentxml = panel.itemobj.L2/*getContent*/.call(panel.itemobj),
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	
		req.init(panel, 
			{
                ack: "31",
	            payload: "<smsg><item address='" + item.nodepath + "/" + item.name + "' name='" + item.name + "' type='" + (this.itemtype ? this.itemtype : 'BigData') + "' pid='" + item.uid + "' description=''/></smsg>",
	            mbody: contentxml
            }, panel, panel._IO5/*rs_processMakeMetaItem*/, panel._IO6/*rs_processMakeMetaItem*/, [item.name, afterclose, item.nodepath, item.uid, contentxml]);
       	req.showerror = false;
	    req._l/*request*/();
	},
	
	_IO5/*rs_processMakeMetaItem*/: function(xdoc, opt) {
		var me = this,
			itemobj = me.itemobj,
			pnode;
			
		pnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		
		if (pnode)
		{
			itemobj.item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(pnode);
			me.setTitle(itemobj.item.name);
			me.uid = itemobj.item.uid;
		}
	},
	
	_IO6/*rs_processMakeMetaItem*/: function(xdoc, opt) {
    	var panel = this,
    		itemname = opt[0],
    		afterclose = opt[1],
    		nodepath = opt[2],
    		pitemuid = opt[3],
    		contentxml = opt[4],
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
				            payload: "<smsg><item address='" + nodepath + "/" + itemname + "' name='" + itemname + "' type='" + (this.itemtype ? this.itemtype : 'Report') + "' pid='" + pitemuid + "' description='' overwrite='T'/></smsg>",
				            mbody: contentxml
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
    
    ll3/*getRunStatus*/: function() {
    	var panel = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
                ack: "3",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid, sid: panel.sid, option: "jobstatus"}, "uid;sid;option"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
            }, panel, panel.rs_ll3/*getRunStatus*/, null);
	    req._l/*request*/();
    },
    
    rs_ll3/*getRunStatus*/: function(xdoc) {
    	var me = this,
    		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
    		tnodes,
    		i,
    		mstatus, stats={}, stat;
    	if (tnode)
    	{
    		mstatus = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "status");
    		mstatus = parseInt(mstatus);
    		
    		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
    		
    		for (i=0; i < tnodes.length; i++)
    		{
    			stat = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
    			stat.status = parseInt(stat.status);
    			stats[stat.lid] = stat;
    			
    			me.bf.s1/*setStatus*/.call(me.bf, stat);
    		}
    		
    		if (mstatus == 1)
    		{
    			me.ll4/*getStatus*/();
    		}
    	}
    },
	
	initComponent: function() {
		var me = this;
		
		me.__m/*mode*/ = me.itemtype == "BigData" ? 0 : 1;
		
		$s.apply(this, {
			items: [
				{
					xtype: "container",
					name: "topmenu",
					height: 40,
					border: 1,
					style: {
					    borderColor: '#efefef',
					    borderStyle: 'solid'
					}
				},
				{
					xtype: "container",
					flex: 1,
					layout: "border",
					items: [
						{
							xtype: "container",
							name: "mainarea",
							region: "center",
							flex: 1
						},
						{
							xtype: "panel",
							name: "moption",
							title: "Properties",
							split: true,
							collapsible: true,
							collapsed: true,
							collapseMode: "mini",
							region: "east",
							width: 420,
							layout: "fit",
							items: [
								{
									xtype: "displayfield",
									value: "Click Item to set properties"
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
		        	tooltip: IRm$/*resources*/.r1('L_SAVE_CONTENTAS'),
		        	handler: function() {
			    		this._t$/*toolbarHandler*/('cmd_saveas'); 
			    	},
		        	scope: this
		        },
		        {
		        	iconCls: 'icon-toolbar-runreport',
		        	name: "t_run",
		        	tooltip: IRm$/*resources*/.r1('L_RUN'),
		        	handler: function() {
		        		this._t$/*toolbarHandler*/('cmd_run'); 
		        	},
		        	scope: this
		        },
		        {
		        	iconCls: "icon-toolbar-logview",
		        	name: "t_log",
		        	tooltip: IRm$/*resources*/.r1('L_LOG_VIEW'),
		        	handler: function() {
		        		this._t$/*toolbarHandler*/('cmd_log_view'); 
		        	},
		        	scope: this
		        },
		        "->",
		        {
					iconCls: "icon-toolbar-schedule",
					cls: "ig_r_sch",
					tooltip: IRm$/*resources*/.r1('B_SCHEDULE'),
					hidden: ig$/*appoption*/.features && !ig$/*appoption*/.features.enable_scheduler ? true : false,
					handler: function() {
						this._t$/*toolbarHandler*/.call(this, 'cmd_schedule');
					},
					scope: this
				},
		        {
		        	iconCls: "icon-toolbar-favorites",
		        	tooltip: IRm$/*resources*/.r1('B_FAVORITES'),
		        	handler: function() {
		        		this._t$/*toolbarHandler*/.call(this, 'cmd_favorites');
		        	},
		        	scope: this
		        }
			]
	    });
	          
		IG$/*mainapp*/._IB9/*flowEditor*/.superclass.initComponent.call(this);
	},
	
	listeners: {
		afterrender: function(tobj) {
			var me = this;
			
			me.topmenu = $(me.down("[name=topmenu]").el.dom);
			me.mainarea = $(me.down("[name=mainarea]").el.dom);
			
			me._IFd/*init_f*/();
		}
	}
	
});
IG$/*mainapp*/.bA_5/*tornado_spider*/ = $s.extend($s.window, {
	modal: true,
	isWindow: true,
	"layout": "fit",
	
	closable: false,
	resizable:true,
	width: 600,
	height: 550,
	
	_r: {},
	
	_IFe/*initF*/: function() {
		var me = this,
			result_xml = me.result_xml,
			tnode = result_xml ? IG$/*mainapp*/._I18/*XGetNode*/(result_xml, "/smsg/cost_effectiveness_results") : null,
			tnodes;
		
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			$.each(tnodes, function(i, node) {
				me.d1/*drawChart*/.call(me, node);
			});
		}
	},
	
	d1/*drawChart*/: function(rnode) {
		var me = this,
			cname = IG$/*mainapp*/._I29/*XGetNodeName*/(rnode),
			cnode;
		
		switch(cname)
		{
		case "tornado_spider":
			cnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "tornado");
			cnode && me.d2/*drawTornado*/(cnode);

			cnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "spider_chart");
			
			if (me._r["p_spider"] == 0)
			{
				cnode && me.d3/*drawSpider*/(cnode, "p_spider");
			}
			else
			{
				me._r["p_spider"] = cnode;
			}
			break;
		case "plot":
			cnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "plot_chart");
			if (cnode)
			{
				if (me._r["p_plot"] == 0)
				{
					cnode && me.d3/*drawSpider*/(cnode, "p_plot");
				}
				else
				{
					me._r["p_plot"] = cnode;
				}
			}
			break;
		}
	},
	
	d2/*drawTornado*/: function(rnode) {
		var me = this,
			p_tornado = me.down("[name=p_tornado]"),
			p_tornado_doc = $(p_tornado.el.dom),
			tchart,
			categories = [],
			mc, chart = {
				chart: {
					type: "bar"
				},
				title: {
					text: "Tornado"
				},
				xAxis: [
					{
						reversed: false
					},
					{
						opposite: true,
						reversed: false,
						linkedTo: 0,
						labels: {
							step: 1
						}
					}
				],
				yAxis: {
					labels: {
						formatter: function() {
							return Math.abs(this.value);
						}
					}
				},
				plotOptions: {
					series: {
						stacking: "normal"
					}
				},
				series: []
			},
			bnode,
			bnodes,
			i, minvalues = [], maxvalues = [],
			s, e,
			rval;
		
		p_tornado_doc.empty();
		
		tchart = $("<div></div>").appendTo(p_tornado_doc);
		tchart.css({
			width: p_tornado_doc.width(),
			height: p_tornado_doc.height()
		});
		
		categories = IG$/*mainapp*/._I1a/*getSubNodeText*/(rnode, "category_key");
		
		categories = categories ? categories.split("\t") : [];
		
		chart.xAxis[0].categories = categories;
		chart.xAxis[1].categories = categories;
		
		chart.chart.renderTo = tchart[0];
		
		bnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "reference_markers/reference");
		rval = IG$/*mainapp*/._I1b/*XGetAttr*/(bnode, "value");
		rval = Number(rval);
		
		bnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "bars");
		bnodes = IG$/*mainapp*/._I26/*getChildNodes*/(bnode);
		
		for (i=0; i < bnodes.length; i++)
		{
			s = IG$/*mainapp*/._I1b/*XGetAttr*/(bnodes[i], "starts");
			e = IG$/*mainapp*/._I1b/*XGetAttr*/(bnodes[i], "ends");
			
			minvalues.push(Number(s) - rval);
			maxvalues.push(Number(e) - rval);
		}
		
		chart.series.push({
			name: "Starts",
			data: minvalues
		});
		
		chart.series.push({
			name: "Ends",
			data: maxvalues
		});
		
		mc = new Highcharts.Chart(chart);
	},
	
	d3/*drawSpider*/: function(rnode, pname) {
		var me = this,
			p_spider = me.down("[name=" + pname + "]"),
			p_spider_doc = $(p_spider.el.dom),
			tchart,
			categories = [],
			mc, chart = {
				chart: {
					type: "line"
				},
				title: {
					text: "Spider"
				},
				xAxis: {
				},
				yAxis: {
					labels: {
						formatter: function() {
							return Math.abs(this.value);
						}
					}
				},
				legend: {
					layout: "vertical",
					align: "right",
					verticalAlign: "middle",
					borderWidth: 0
				},
				series: []
			},
			bnode,
			bnodes,
			i,
			s, x, y;
		
		p_spider_doc.empty();
		
		tchart = $("<div></div>").appendTo(p_spider_doc);
		tchart.css({
			width: p_spider_doc.width(),
			height: p_spider_doc.height()
		});
		
		bnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "series");
		
		if (bnode)
		{
			bnodes = IG$/*mainapp*/._I26/*getChildNodes*/(bnode);
			
			for (i=0; i < bnodes.length; i++)
			{
				s = {
					name: IG$/*mainapp*/._I1b/*XGetAttr*/(bnodes[i], "name"),
					data: []
				};
				
				if (i == 0)
				{
					x = IG$/*mainapp*/._I1a/*getSubNodeText*/(bnodes[i], "xvalues");
					categories = x.split("\t");
				}
				
				y = IG$/*mainapp*/._I1a/*getSubNodeText*/(bnodes[i], "yvalues");
				s.data = y.split("\t");
				
				for (j=0; j < s.data.length; j++)
				{
					s.data[j] = Number(s.data[j]);
				}
				
				chart.series.push(s);
			}
		}
		
		chart.xAxis.categories = categories;
		chart.chart.renderTo = tchart[0];
		
		bnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "reference_markers/reference");
		if (bnode)
		{
			rval = IG$/*mainapp*/._I1b/*XGetAttr*/(bnode, "value");
			rval = Number(rval);
		}
		
		mc = new Highcharts.Chart(chart);
	},
	
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_TORSP_RS");
		
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					bodyPadding: 10,
					layout: "fit",
					items: [
					    {
					    	xtype: "tabpanel",
					    	defaults: {
					    		deferredRender: false
					    	},
					    	flex: 1,
					    	items: [
						    	{
						    		xtype: "panel",
						    		title: "Tornado",
						    		layout: "fit",
						    		name: "p_tornado"
						    	},
						    	{
						    		xtype: "panel",
						    		title: "Spider",
						    		layout: "fit",
						    		name: "p_spider",
						    		listeners: {
						    			afterrender: function(tobj) {
						    				if (panel._r["p_spider"])
						    				{
												panel.d3/*drawSpider*/.call(panel, panel._r["p_spider"], "p_spider");
						    				}
						    				panel._r["p_spider"] = 0;
						    			}
						    		}
						    	},
						    	{
						    		xtype: "panel",
						    		title: "Plot",
						    		layout: "fit",
						    		name: "p_plot",
						    		listeners: {
						    			afterrender: function(tobj) {
						    				if (panel._r["p_plot"])
						    				{
												panel.d3/*drawSpider*/.call(panel, panel._r["p_plot"], "p_plot");
						    				}
						    				panel._r["p_plot"] = 0;
						    			}
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
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/.bA_5/*tornado_spider*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.bA_4/*cost_effectiveness*/ = $s.extend($s.window, {
	modal: true,
	isWindow: true,
	region:"center",
	"layout": {
		type: "fit",
		align: "stretch"
	},
	
	closable: false,
	resizable:false,
	width: 600,
	height: 550,
	
	callback: null,
	atype: 0, // 0: sensitivity analysis, 1: determistic analysis
	
	_IFe/*initF*/: function() {
		var me = this,
			params = ig$/*appoption*/.b$Am,
			deterministic_axis_variation_type = params.deterministic_axis_variation_type,
			p3 = me.down("[name=p3]");
		
		p3.store.loadData(params.analysis_types);
		me.down("[name=p4]").store.loadData(deterministic_axis_variation_type);
		me.down("[name=p5]").store.loadData(deterministic_axis_variation_type);
		me.down("[name=p6]").store.loadData(params.scope_types);
		
		p3.setValue("TORNADO_SPIDER");
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			itemobj = me.itemobj,
			atype = me.atype,
			mreq = new IG$/*mainapp*/._I3e/*requestServer*/(),
			horizontalAxisParam = me.down("[name=p4]"),
			mbody = ["<smsg><info"];
		
		mbody.push(" analysis_type='" + me.down("[name=p3]").getValue() + "'");
		if (atype == 1)
		{
			mbody.push(" scope_type='" + me.down("[name=pb]").getValue() + "'");
			mbody.push(" decision='" + me.down("[name=pc]").getValue() + "'");
		}
		else
		{
			mbody.push(" scope_type='" + me.down("[name=p6]").getValue() + "'");
			mbody.push(" decision='" + me.down("[name=p7]").getValue() + "'");
		}
		
		mbody.push(">");
		
		mbody.push("<axis>");
		mbody.push("<horizontal_axis_parameter axitype='" + horizontalAxisParam.getValue() + "'>");
		mbody.push("</horizontal_axis_parameter>");
		mbody.push("</axis>");
		
		mbody.push("</info></smsg>");
		
		mreq.init(me, 
			{
				ack: "77",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, instanceid: itemobj.instanceid, action: "cost_effectiveness", method: (atype == 0 ? "sensitivity" : "determistic")}, "uid;action;instanceid;method"),
				mbody: mbody.join("") 
			}, me, function(xdoc) {
				var dlg = new IG$/*mainapp*/.bA_5/*tornado_spider*/({
					result_xml: xdoc
				});
				dlg.show();
	        }
		); 
		mreq._l/*request*/();
	},
	
	s1/*setAnalysisType*/: function(t) {
		var me = this,
			p1 = me.down("[name=p1]"),
			p6 = me.down("[name=p6]"),
			horizontalAxisParam = me.down("[name=p4]"),
			haxis = "POPP";
			decision = me.down("[name=p7]"),
			p1v = false,
			decisionV = false;
		
		switch (t)
		{
		case "TORNADO_SPIDER":
			p6.setValue("GLOBAL");
			break;
		case "MAP":
			p1v = true;
			decisionV = true;
			break;
		case "PLOT":
			decisionV = true;
			break;
		}
		p1.setVisible(p1v);
		decision.setVisible(decisionV);
		horizontalAxisParam.setValue(haxis);
	},
			
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_COST_EFF");
		
		// this.datagrid = Ext.create("Ext.grid.Panel", );
		
		// this._IH1/*mainpanel*/ = Ext.create("Ext.form.Panel", );
				 
		$s.apply(this, {
			defaults:{bodyStyle:"padding:0px"},
			
			items: [
				{
					xtype: "panel",
					"layout": "fit",
					border: 0,
					defaults: {
						bodyPadding: 5
					},
					items: [
						{
							xtype: "panel",
							layout: "anchor",
							autoScroll: true,
							hidden: panel.atype != 0,
							items: [
								{
									xtype: "fieldcontainer",
									layout: "anchor",
									items: [
										{
											xtype: "combobox",
											fieldLabel: "Analysis type",
											queryMode: 'local',
											name: "p3",
											displayField: 'name',
											valueField: 'value',
											editable: false,
											autoSelect: true,
											store: {
												xtype: 'store',
												fields: [
													"name", "value"
												]
											},
											listeners: {
												change: function(tobj) {
													var tval = tobj.getValue();
													
													this.s1/*setAnalysisType*/(tval);
												},
												scope: this
											}
										},
										{
											xtype: "fieldcontainer",
											fieldLabel: "Points per parameter",
											name: "p2",
											items: [
												{
													xtype: "numberfield",
													width: 40
												}
											]
										}
									]
								},
								{
									xtype: "panel",
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
									    {
									    	xtype: "fieldset",
									    	title: "Parameters",
									    	height: 200,
									    	layout: {
									    		type: "hbox",
									    		align: "stretch"
									    	},
									    	items: [
												{
													xtype: "gridpanel",
													name: "p0",
													flex: 1,
													columns: [
													    {
													    	text: "Name",
													    	flex: 1
													    }
													]
												},
												{
													xtype: "gridpanel",
													name: "p1",
													hidden: true,
													flex: 1,
													columns: [
													    {
													    	text: "Name",
													    	flex: 1
													    }
													]
												}
									    	]
									    },
										{
											xtype: "fieldset",
											title: "Options",
											layout: "anchor",
											flex: 1,
											bodyPadding: 5,
											items: [
												{
													xtype: "fieldcontainer",
													fieldLabel: "Horizontal axis parameter",
													layout: "hbox",
													items: [
														{
															xtype: "combobox",
															queryMode: 'local',
															name: "p4",
															displayField: 'name',
															valueField: 'value',
															editable: false,
															autoSelect: true,
															store: {
																xtype: 'store',
																fields: [
																	"name", "value"
																]
															}
														},
														{
															xtype: "numberfield",
															width: 60,
															name: "p4a",
															labelWidth: 20,
															fieldLabel: "%"
														}
													]
												},
												{
													xtype: "fieldcontainer",
													fieldLabel: "Vertical axis parameter",
													layout: "hbox",
													items: [
														{
															xtype: "combobox",
															queryMode: 'local',
															name: "p5",
															displayField: 'name',
															valueField: 'value',
															editable: false,
															autoSelect: true,
															store: {
																xtype: 'store',
																fields: [
																	"name", "value"
																]
															}
														},
														{
															xtype: "numberfield",
															width: 60,
															name: "p5a",
															labelWidth: 20,
															fieldLabel: "%"
														}
													]
												},
												{
													xtype: "combobox",
													queryMode: 'local',
													fieldLabel: "Scope",
													name: "p6",
													displayField: 'name',
													valueField: 'value',
													editable: false,
													autoSelect: true,
													store: {
														xtype: 'store',
														fields: [
															"name", "value"
														]
													}
												},
												{
													xtype: "combobox",
													queryMode: 'local',
													fieldLabel: "Decision",
													name: "p7",
													hidden: true,
													displayField: 'name',
													valueField: 'value',
													editable: false,
													autoSelect: true,
													store: {
														xtype: 'store',
														fields: [
															"name", "value"
														],
														data: [
															{name: "Percentage of the 2nd order probability"},
															{name: "Percentage over reference value"},
															{name: "Ratio over reference value"},
															{name: "User defined interval"}
														]
													}
												},
												{
													xtype: "combobox",
													queryMode: 'local',
													name: "p8",
													fieldLabel: "When a probability parameter is above 1",
													labelWidth: 220,
													displayField: 'name',
													valueField: 'value',
													editable: false,
													autoSelect: true,
													store: {
														xtype: 'store',
														fields: [
															"name", "value"
														],
														data: [
															{name: "Ignore case"},
															{name: "Throw error message", value: "dbc"}
														]
													}
												}
											]
										},
										{
											xtype: "fieldset",
											title: "Scenario",
											layout: "anchor",
											items: [
												{
													xtype: "combobox",
													queryMode: 'local',
													fieldLabel: "Do test?",
													name: "p9",
													displayField: 'name',
													valueField: 'value',
													editable: false,
													autoSelect: true,
													store: {
														xtype: 'store',
														fields: [
															"name", "value"
														],
														data: [
															{name: "Yes"},
															{name: "No", value: "dbc"}
														]
													}
												},
												{
													xtype: "combobox",
													queryMode: 'local',
													name: "pa",
													fieldLabel: "Result of test",
													displayField: 'name',
													valueField: 'value',
													editable: false,
													autoSelect: true,
													store: {
														xtype: 'store',
														fields: [
															"name", "value"
														],
														data: [
															{name: "not done"},
															{name: "done"}
														]
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
							layout: "anchor",
							hidden: panel.atype != 1,
							items: [
								{
									xtype: "combobox",
									queryMode: 'local',
									name: "pb",
									fieldLabel: "Scope",
									displayField: 'name',
									valueField: 'value',
									editable: false,
									autoSelect: true,
									store: {
										xtype: 'store',
										fields: [
											"name", "value"
										],
										data: [
											{name: "Global"},
											{name: "One decision"}
										]
									}
								},
								{
									xtype: "combobox",
									queryMode: 'local',
									name: "pc",
									fieldLabel: "Decision",
									displayField: 'name',
									valueField: 'value',
									editable: false,
									autoSelect: true,
									store: {
										xtype: 'store',
										fields: [
											"name", "value"
										],
										data: [
											{name: "Therapy"},
											{name: "Percentage over reference value"},
											{name: "Ratio over reference value"},
											{name: "User defined interval"}
										]
									}
								},
								{
									xtype: "fieldset",
									layout: "anchor",
									title: "Scenario",
									items: [
										{
											xtype: "combobox",
											queryMode: 'local',
											name: "pd",
											fieldLabel: "Do test?",
											displayField: 'name',
											valueField: 'value',
											editable: false,
											autoSelect: true,
											store: {
												xtype: 'store',
												fields: [
													"name", "value"
												],
												data: [
													{name: "yes"},
													{name: "no"}
												]
											}
										},
										{
											xtype: "combobox",
											queryMode: 'local',
											name: "pe",
											fieldLabel: "Result of test",
											displayField: 'name',
											valueField: 'value',
											editable: false,
											autoSelect: true,
											store: {
												xtype: 'store',
												fields: [
													"name", "value"
												],
												data: [
													{name: "not done"},
													{name: "no"}
												]
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
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/.bA_4/*cost_effectiveness*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.bA_3/*db_generator*/ = $s.extend($s.window, {
	modal: true,
	isWindow: true,
	region:"center",
	"layout": {
		type: "fit",
		align: "stretch"
	},
	
	closable: false,
	resizable:false,
	width: 400,
	autoHeight: true,
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this;
		me.down("[name=filetype]").setValue("csv");
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			num_cases = me.down("[name=num_cases]"),
			filetype = me.down("[name=filetype]");
			
		me.callback && me.callback.execute({
			num_cases: num_cases.getValue(),
			filetype: filetype.getValue()
		});
		
		me.close();
	},
			
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_DB_GEN");
		// this.datagrid = Ext.create("Ext.grid.Panel", );
		
		// this._IH1/*mainpanel*/ = Ext.create("Ext.form.Panel", );
				 
		$s.apply(this, {
			defaults:{bodyStyle:"padding:0px"},
			
			items: [
				{
					xtype: "panel",
					"layout": "fit",
					border: 0,
					defaults: {
						bodyPadding: 10
					},
					items: [
						{
							xtype: "panel",
							layout: "anchor",
							items: [
								{
									xtype: "combobox",
									fieldLabel: "File Type",
									queryMode: 'local',
									name: "filetype",
									displayField: 'name',
									valueField: 'value',
									editable: false,
									autoSelect: true,
									store: {
										xtype: 'store',
										fields: [
											"name", "value"
										],
										data: [
											{name: "CSV File", value: "csv"},
											{name: "Elvira DB File", value: "dbc"},
											{name: "Excel File", value: "xls"},
											{name: "Weka DB File", value: "arff"}
										]
									}
								},
								{
									xtype: "numberfield",
									name: "num_cases",
									fieldLabel: "Number of cases",
									minValue: 100,
									maxValue: 100000,
									value: 5000,
									step: 10
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
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/.bA_3/*db_generator*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.bA_2/*learning_dialog*/ = $s.extend($s.window, {
	modal: true,
	isWindow: true,
	region:"center",
	"layout": {
		type: "fit",
		align: "stretch"
	},
	
	closable: false,
	resizable:false,
	width: 500,
	height: 450,
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			jobid = me.jobid,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		me.lP/*loadParams*/();
					
		if (jobid)
		{
			me.setLoading(true);
			
			req.init(me, 
				{
					ack: "20",
		            payload: "<smsg><item uid='" + me.uid + "' jobid='" + jobid + "' type='csv' option='instanceload' appuse='T'/></smsg>",
		            mbody: "<smsg></smsg>"
		        }, me, function(xdoc) {
		        	var mnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/info"),
		        		hnode = mnode ? IG$/*mainapp*/._I18/*XGetNode*/(mnode, "headers") : null,
		        		hnodes,
		        		sheader = me.down("[name=sheader]"),
		        		smodel = sheader.getSelectionModel(),
		        		i, dp = [], p;
		        	
		        	if (mnode)
		        	{
		        		me.__pfile = IG$/*mainapp*/._I1b/*XGetAttr*/(mnode, "downloadurl");
		        	}
		        	
		        	if (hnode)
		        	{
		        		hnodes = IG$/*mainapp*/._I26/*getChildNodes*/(hnode);
		        		
		        		for (i=0; i < hnodes.length; i++)
		        		{
		        			p = {
		        				name: IG$/*mainapp*/._I24/*getTextContent*/(hnodes[i]),
		        				selected: true
		        			};
		        			dp.push(p);
		        		}
		        	}
		        	
		        	sheader.store.loadData(dp);
		        }
			);
			
			req._l/*request*/();
		}
	},
	
	lP/*loadParams*/: function() {
		var me = this,
			req;
		
		if (!ig$/*appoption*/.b$Am)
		{
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "77",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({action: "get_var"}, "action"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
		        }, me, function(xdoc) {
		        	var me = this,
		        		data = {},
		        		tnode,
		        		tnodes,
		        		snodes,
		        		tname,
		        		tdata,
		        		titem,
		        		i, j;
		        		
		        	tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg");
		        	
		        	if (tnode)
		        	{
		        		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
		        		
		        		for (i=0; i < tnodes.length; i++)
		        		{
		        			tname = IG$/*mainapp*/._I29/*XGetNodeName*/(tnodes[i]);
		        			tdata = data[tname] = [];
		        			
		        			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnodes[i]);
		        			for (j=0; j < snodes.length; j++)
		        			{
		        				titem = {
		        					value: IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[j], "value")
		        				};
		        				titem.name = titem.name || titem.value;
		        				tdata.push(titem);
		        			}
		        		}
		        		
		        		ig$/*appoption*/.b$Am = data;
		        	}
		        	
		        	me._a1/*loadInit*/();
		        }, false);
			req._l/*request*/();
		}
		else
		{
			me._a1/*loadInit*/();
		}
	},
	
	_a1/*loadInit*/: function() {
		var me = this,
			params = ig$/*appoption*/.b$Am,
			algorithm = me.down("[name=algorithm]"),
			tmissing = me.down("[name=tmissing]");
			
		algorithm.store.loadData(params.learn_algorithms);
		algorithm.setValue(params.learn_algorithms[0].value);
		
		tmissing.store.loadData(params.missing_names);
		tmissing.setValue(params.missing_names[0].value);
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			sheader = me.down("[name=sheader]"),
			sheader_store = sheader.store,
			rec,
			i,
			modelnet_gr = me.down("[name=modelnet_gr]"),
			modelnet = modelnet_gr.getValue().modelnet,
			muid = null,
			btype = "BayesNet",
			mp = IG$/*mainapp*/._I7d/*mainPanel*/,
			__learn_opt;
		
		if (!me.__pfile)
		{
			return;
		}
		
		if (modelnet != "new_model")
		{
			
		}
		
		__learn_opt = me.__learn_opt = {
			pfile: me.__pfile,
			algorithm: me.down("[name=algorithm]").getValue(),
			alg_ind_test: me.down("[name=m_pc1]").getValue(),
			alg_metric: me.down("[name=m_pc2]").getValue(),
			alg_sig_level: me.down("[name=m_pc3]").getValue(),
			alg_alpha: me.down("[name=m_pc4]").getValue(),
			learn_mode: me.down("[name=learn_mode_gr]").getValue().learn_mode,
			model_net: modelnet,
			use_model_net: me.down("[name=use_model_net]").getValue() ? "T" : "F",
			use_start_learn: me.down("[name=use_start_learn]").getValue() ? "T" : "F",
			allow_link_addition: me.down("[name=_a1]").getValue() ? "T" : "F",
			allow_link_removal: me.down("[name=_a2]").getValue() ? "T" : "F",
			allow_link_inversion: me.down("[name=_a3]").getValue() ? "T" : "F",
			descretize: me.down("[name=_a4]").getValue(),
			treat_missing_val: me.down("[name=tmissing]").getValue(),
			use_same_num_interval: me.down("[name=_a5]").getValue() ? "T" : "F",
			same_num_interval: me.down("[name=_a6]").getValue(),
			variable_use: me.down("[name=var_use_gr]").getValue().var_use,
			selected_header: []
		};
		
		for (i=0; i < sheader_store.data.items.length; i++)
		{
			rec = sheader_store.data.items[i];
			__learn_opt.selected_header.push({
				selected: rec.get("selected") ? "T" : "F",
				name: rec.get("name"),
				missing_value: rec.get("missing_values"),
				discretization: rec.get("discretization"),
				num_of_interval: rec.get("num_of_interval")
			});
		}
		
		mp && mp.m1$7/*navigateApp*/.call(mp, muid, btype.toLowerCase(), btype, null, null, true, null, {
			__learn_opt: __learn_opt
		});
		
		me.callback && me.callback.execute(__learn_opt);
		me.close();
	},
				
	initComponent : function() {
		var me = this,
			fmode = me.jobid ? true : false;
		
		me.title = IRm$/*resources*/.r1("T_ML_LEARN");
		// this.datagrid = Ext.create("Ext.grid.Panel", );
		
		// this._IH1/*mainpanel*/ = Ext.create("Ext.form.Panel", );
				 
		Ext.apply(this, {
			defaults:{bodyStyle:"padding:0px"},
			
			items: [
				{
					xtype: "panel",
					"layout": "fit",
					border: 0,
					defaults: {
						bodyPadding: 5
					},
					items: [
						{
							xtype: "tabpanel",
							deferredRender: false,
							items: [
								{
									xtype: "panel",
									title: "General",
									layout: "anchor",
									autoScroll: true,
									items: [
										{
											xtype: "fieldset",
											title: "Database",
											layout: "anchor",
											items: [
											    {
											    	xtype: "fieldcontainer",
											    	fieldLabel: "Database",
											    	layout: "anchor",
											    	items: [
													    {
													    	xtype: "form",
													    	anchor: "100%",
													    	name: "mform",
													    	border: 0,
													    	layout: "hbox",
													    	items: [
																{
																	xtype: 'filefield',
																	name: 'photo',
																	hidden: fmode,
																	allowBlank: false,
																	msgTarget: 'side',
																	width: 220,
																	buttonText: 'Select File...'
																},
																{
																	xtype: "textfield",
																	hidden: !fmode,
																	disabled: true,
																	name: "db_file",
																	value: me.fname || ""
																},
																{
																  	xtype: 'button',
																  	text: 'Upload',
																  	hidden: fmode,
																  	handler: function() {
																  		var me = this,
																  			mform = me.down("[name=mform]");
																  		
																  		if (mform.getForm().isValid()) {
																			mform.getForm().submit({
																				url: ig$/*appoption*/.servlet,
																				waitMsg: 'Uploading your data file',
																				success: function(fp, o) {
																					IG$/*mainapp*/._I54/*alertmsg*/('Success', 'Processed file on the server', null, null, 0, "success");
																					var node = IG$/*mainapp*/._I18/*XGetNode*/(fp.errorReader.xmlData, "/smsg/Result"),
																						uid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "uid");
																						
																					me.__pfile = uid;
																				}
																			})
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
											xtype: "fieldset",
											title: "Algorithm",
											layout: "anchor",
											items: [
												{
													xtype: "combobox",
													fieldLabel: "Algorithm",
													name: "algorithm",
													queryMode: 'local',
													displayField: 'name',
													valueField: 'value',
													editable: false,
													autoSelect: true,
													store: {
														xtype: 'store',
														fields: [
															"name", "value"
														]
													},
													listeners: {
														change: function(tobj, nvalue, ovalue, eopt) {
															var me = this,
																m_p1 = me.down("[name=m_p1]"),
																m_pc1 = me.down("[name=m_pc1]"),
																m_pc2 = me.down("[name=m_pc2]"),
																m_pc3 = me.down("[name=m_pc1]"),
																c = nvalue == "PC";
																
															m_p1.setTitle(nvalue + " algorithm: Options");
															m_p1.show();
															
															m_pc1.setVisible(c);
															m_pc2.setVisible(!c);
															m_pc3.setVisible(c);
														},
														scope: this
													}
												},
												{
													xtype: "textarea",
													anchor: "100%",
													height: 60
												},
												{
													xtype: "fieldset",
													name: "m_p1",
													title: "Algorithm: Options",
													layout: "anchor",
													items: [
														{
															xtype: "combobox",
															fieldLabel: "Independence test",
															name: "m_pc1",
															hidden: true,
															queryMode: 'local',
															displayField: 'name',
															valueField: 'value',
															editable: false,
															autoSelect: true,
															store: {
																xtype: 'store',
																fields: [
																	"name", "value"
																],
																data: [
																	{name: "Cross entropy", value: ""}
																]
															}
														},
														{
															xtype: "combobox",
															fieldLabel: "Metric",
															name: "m_pc2",
															hidden: true,
															queryMode: 'local',
															displayField: 'name',
															valueField: 'value',
															editable: false,
															autoSelect: true,
															store: {
																xtype: 'store',
																fields: [
																	"name", "value"
																],
																data: [
																	{name: "K2", value: ""},
																	{name: "Bayesian", value: ""},
																	{name: "BD", value: ""},
																	{name: "MDLM", value: ""},
																	{name: "Entropy", value: ""},
																	{name: "ALC", value: ""}
																]
															}
														},
														{
															xtype: "numberfield",
															name: "m_pc3",
															hidden: true,
															fieldLabel: "Significance level"
														},
														{
															xtype: "numberfield",
															name: "m_pc4",
															fieldLabel: "Alpha parameter"
														},
														{
															xtype: "displayfield",
															value: "(Laplace-like correction)"
														}
													]
												}
											]
										},
										{
											xtype: "fieldset",
											title: "Learning type",
											items: [
											    {
											    	xtype: "radiogroup",
											    	columns: 1,
											    	name: "learn_mode_gr",
											    	vertical: true,
											    	items: [
										    	        {
										    	        	boxLabel: "Interactive learning",
										    	        	name: "learn_mode",
										    	        	inputValue: "interactive"
										    	        },
										    	        {
										    	        	boxLabel: "Automatic Learning",
										    	        	name: "learn_mode",
										    	        	inputValue: "automatic",
										    	        	checked: true
										    	        }
											    	]
											    }
											]
										}
									]
								},
								{
									xtype: "panel",
									title: "Model network",
									layout: "anchor",
									items: [
										{
											xtype: "fieldset",
											title: "Choose Model Net",
											items: [
											    {
											    	xtype: "radiogroup",
											    	name: "modelnet_gr",
											    	columns: 1,
											    	vertical: true,
											    	items: [
														{
															boxLabel: "Make new model network",
															name: "modelnet",
															checked: true,
															inputValue: "new_model"
														},
														{
															boxLabel: "Select model network",
															name: "modelnet",
															inputValue: "modelnet"
														}
											    	]
											    }
											]
										},
										{
											xtype: "fieldset",
											title: "Model network use",
											items: [
												{
													xtype: "checkbox",
													name: "use_model_net",
													boxLabel: "Use the information of the nodes"
												},
												{
													xtype: "checkbox",
													name: "use_start_learn",
													boxLabel: "Start learning from model network"
												},
												{
													xtype: "fieldcontainer",
													padding: "0 0 0 20",
													items: [
														{
															xtype: "checkbox",
															name: "_a1",
															boxLabel: "Allow link addition"
														},
														{
															xtype: "checkbox",
															name: "_a2",
															boxLabel: "Allow link removal"
														},
														{
															xtype: "checkbox",
															name: "_a3",
															boxLabel: "Allow link inversion"
														}
													]
												}
											]
										}
									]
								},
								{
									xtype: "panel",
									title: "Preprocessing",
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "combobox",
											fieldLabel: "Discretize",
											name: "_a4",
											queryMode: 'local',
											displayField: 'name',
											valueField: 'value',
											editable: false,
											autoSelect: true,
											store: {
												xtype: 'store',
												fields: [
													"name", "value"
												],
												data: [
													{name: "Specify for each variable"},
													{name: "Do not discretize"},
													{name: "Equal frequency intervals"},
													{name: "Equal with intervals"}
												]
											}
										},
										{
											xtype: "combobox",
											fieldLabel: "Treat missing values",
											queryMode: 'local',
											name: "tmissing",
											displayField: 'name',
											valueField: 'value',
											editable: false,
											autoSelect: true,
											store: {
												xtype: 'store',
												fields: [
													"name", "value"
												]
											}
										},
										{
											xtype: "fieldcontainer",
											fieldLabel: "Same number of intervals",
											layout: "hbox",
											items: [
												{
													xtype: "checkbox",
													name: "_a5",
												},
												{
													xtype: "numberfield",
													name: "_a6",
													labelWidth: 120,
													labelAlign: "right",
													width: 160,
													fieldLabel: "Number of intervals"
												}
											]
										},
										{
											xtype: "radiogroup",
											vertical: true,
											name: "var_use_gr",
											columns: 1,
											items: [
												{
													boxLabel: "Use all variables", name: "var_use", inputValue: "all", checked: true
												},
												{
													boxLabel: "Use only the variables in the model network", name: "var_use", inputValue: "model"
												},
												{
													boxLabel: "Use selected variables", name: "var_use", inputValue: "selection"
												}
											]
										},
										{
											xtype: "gridpanel",
											name: "sheader",
											store: {
												xtype: "store",
												fields: ["name", "selected", "missing_values", "discretization", "num_of_interval"]
											},
											flex: 1,
											plugins: [
												{
													ptype: "cellediting",
													clicksToEdit: 1
												}
											],
											columns: [
												{
													xtype: "checkcolumn",
													dataIndex: "selected",
													width: 30
												},
												{
													text: "Preprocessing",
													dataIndex: "name",
													flex: 1
												},
												{
													text: "Missing values",
													dataIndex: "missing_values",
													flex: 1,
													editor: {
														xtype: "combobox",
														queryMode: 'local',
														displayField: 'name',
														valueField: 'value',
														editable: false,
														autoSelect: true,
														store: {
															xtype: 'store',
															fields: [
																"name", "value"
															],
															data: [
																{name: "Specify for each variable"},
																{name: "Keep records with missing values"},
																{name: "Erase records with missing values"}
															]
														}
													}
												},
												{
													text: "Discretization",
													dataIndex: "discretization",
													flex: 1,
													editor: {
														xtype: "combobox",
														queryMode: 'local',
														displayField: 'name',
														valueField: 'value',
														editable: false,
														autoSelect: true,
														store: {
															xtype: 'store',
															fields: [
																"name", "value"
															],
															data: [
																{name: "Specify for each variable"},
																{name: "Keep records with missing values"},
																{name: "Erase records with missing values"}
															]
														}
													}
												},
												{
													text: "Number of intervals",
													dataIndex: "num_of_interval",
													width: 40,
													editor: {
														xtype: "numberfield"
													}
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
					var me = this,
						mform = me.down("[name=mform]");
					
					mform.getForm().errorReader = new IG$/*mainapp*/.m2ER();
					
					me._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/.bA_2/*learning_dialog*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.bA_1/*network_properties_dialog*/ = $s.extend($s.window, {
	modal: true,
	isWindow: true,
	region:"center",
	"layout": {
		type: "fit",
		align: "stretch"
	},
	
	closable: false,
	resizable:false,
	width: 500,
	height: 450,
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			tdata = ig$/*appoption*/.b$Am,
			network_types = tdata.network_types,
			variable_types = tdata.variable_types,
			net_type = me.down("[name=net_type]"),
			var_type = me.down("[name=var_type]");
			
		if (network_types)
		{
			net_type.store.loadData(network_types);
		}
		
		if (variable_types)
		{
			var_type.store.loadData(variable_types);
		}
		
		if (me.itemobj)
		{
			net_type.setValue(me.itemobj.mtype || "");
			var_type.setValue(me.itemobj.variable_types || "");
		}
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			net_type = me.down("[name=net_type]"),
			itemobj = me.itemobj;
		
		net_type.clearInvalid();
		
		if (!net_type.getValue())
		{
			net_type.markInvalid("Empty");
			return;
		}
		
		me.itemobj.mtype = net_type.getValue();
		me.itemobj.mtypename = net_type.getValue();
		
		me.callback && me.callback.execute();
		
		me.close();
	},
	
	_IG0/*closeDlgProc*/: function(param) {
		var me = this;
		
		me.close();
	},
		
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_NET_PROP");
		// this.datagrid = Ext.create("Ext.grid.Panel", );
		
		// this._IH1/*mainpanel*/ = Ext.create("Ext.form.Panel", );
				 
		$s.apply(this, {
			defaults:{bodyStyle:"padding:0px"},
			
			items: [
				{
					xtype: "panel",
					"layout": "fit",
					border: 0,
					defaults: {
						bodyPadding: 5
					},
					items: [
						{
							xtype: "tabpanel",
							items: [
								{
									xtype: "panel",
									title: "Definition",
									layout: "anchor",
									items: [
										{
											xtype: "combobox",
											fieldLabel: "Network Type",
											name: "net_type",
											queryMode: 'local',
											displayField: 'name',
											valueField: 'value',
											editable: false,
											autoSelect: true,
											store: {
												xtype: 'store',
												fields: [
													"name", "value"
												]
											}
										},
										{
											xtype: "checkbox",
											disabled: true,
											fieldLabel: "Is Object Oriented"
										}
									]
								},
								{
									xtype: "panel",
									title: "Variables",
									layout: "anchor",
									items: [
										{
											xtype: "combobox",
											fieldLabel: "Variable Type",
											name: "var_type",
											queryMode: 'local',
											displayField: 'name',
											valueField: 'value',
											editable: false,
											autoSelect: true,
											store: {
												xtype: 'store',
												fields: [
													"name", "value"
												]
											}
										},
										{
											xtype: "combobox",
											fieldLabel: "Default States",
											queryMode: 'local',
											displayField: 'name',
											valueField: 'value',
											editable: false,
											autoSelect: true,
											store: {
												xtype: 'store',
												fields: [
													"name", "value"
												],
												data: [
													{name: "Absent - Present"},
													{name: "No - Yes"},
													{name: "Negative - Positive"},
													{name: "Absent - Mild - Moderate - Severe"},
													{name: "Low - Medium - High"}
												]
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
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/.bA_1/*network_properties_dialog*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.BY_1/*ByayesChance*/ = $s.extend(IG$/*mainapp*/.BC$base/*hadoop_dlg_base*/, {
	
	region:"center",
	"layout": "fit",
	
	autoHeight: true,
		
	callback: null,
	
	hide_ierr: 1,
	s_hist: 0,
	
	_IFe/*initF*/: function() {
		var me = this,
			job = me.job,
			tdata = ig$/*appoption*/.b$Am,
			variable_types = tdata.variable_types,
			purpose_types = tdata.purpose_types,
			potential_types = tdata.potential_types,
			_p/*editor*/ = me._p/*editor*/,
			itemobj = _p/*editor*/.itemobj,
			instanceid = itemobj.instanceid,
			req;
		
		// declare control to variable
		
		me.down("[name=variable_type]").store.loadData(variable_types || []);
		me.down("[name=purpose]").store.loadData(purpose_types || []);
		me.down("[name=potential_type]").store.loadData(potential_types || []);
		
		IG$/*mainapp*/.BY_1/*ByayesChance*/.superclass._IFe/*initF*/.call(me, arguments);
		
		me._instanceid = instanceid;
			
		if (job && instanceid)
		{
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
			me.setLoading(true);
			
			req.init(me, 
				{
		            ack: "77",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({instanceid: instanceid, action: "get_property"}, "action;instanceid"),
		        	mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "node", name: job.text}, "option;name")
		        }, me, function(xdoc) {
		        	var me = this,
		        		rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
		        		tnode,
		        		p, c, dnode, dnodes, data, header,
		        		potential_type,
		        		p_data,
		        		i, row, crow, cols, rows,
		        		j, store, columns, fields, h, column,
		        		g_p1 = me.down("[name=g_p1]"),
		        		uncertain_columns, ucols;
		        	
		        	if (rnode)
		        	{
		        		p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(rnode);
		        		me.down("[name=dsname]").setValue(p.name);
		        		
		        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "node_definition");
		        		
		        		if (tnode)
	        			{
		        			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
		        			me.down("[name=relavance]").setValue(p.relavance);
		        			me.down("[name=purpose]").setValue(p.purpose);
		        			
		        			c = IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "comment");
		        			me.down("[name=dsdesc]").setValue(c);
		        			
		        			c = IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "decision");
		        			me.down("[name=decision]").setValue(c);
	        			}
		        		
		        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "domain_values_table");
		        		
		        		data = [];
		        		
		        		if (tnode)
		        		{
		        			// precision, unit, variable_type
		        			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
		        			me.down("[name=variable_type]").setValue(p.variable_type);
		        			
		        			dnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "states");
		        			
		        			data = me.g1/*getTableData*/(dnode, "name".split(";"))
		        		}
		        		
		        		me.down("[name=domain_table]").store.loadData(data);
		        		
		        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "node_parents");
		        		
	        			data = me.g1/*getTableData*/(tnode, "key;name".split(";"));
		        		me.down("[name=node_parent]").store.loadData(data);
		        		
		        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "probability");
		        		
		        		if (tnode)
		        		{
		        			potential_type = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "potential_type");
		        			me.down("[name=potential_type]").setValue(potential_type);
		        			
		        			switch(potential_type)
		        			{
		        			case "TABLE":
		        				fields = [];
		        				p_data = [];
		        				columns = [];
		        				
		        				dnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "table_data");
		        				
		        				if (dnode)
	        					{
		        					cols = Number(IG$/*mainapp*/._I1b/*XGetAttr*/(dnode, "cols"));
		        					rows = Number(IG$/*mainapp*/._I1b/*XGetAttr*/(dnode, "rows"));
		        					h = Number(IG$/*mainapp*/._I1b/*XGetAttr*/(dnode, "hc"));
		        					uncertain_columns = IG$/*mainapp*/._I1b/*XGetAttr*/(dnode, "uncertain_columns");
		        					
		        					uncertain_columns = uncertain_columns ? uncertain_columns.split(",") : [];
		        					
		        					ucols = {};
		        					
		        					for (i=0; i < uncertain_columns.length; i++)
	        						{
		        						ucols[Number(uncertain_columns[i])] = 1;
	        						}
		        					
		        					dnodes = IG$/*mainapp*/._I26/*getChildNodes*/(dnode);
		        					
		        					for (i=0; i < dnodes.length; i++)
		        					{
		        						row = IG$/*mainapp*/._I24/*getTextContent*/(dnodes[i]).split("\t");
		        						
		        						if (i < h)
		        						{
	        								for (j=0; j < row.length; j++)
	        								{
	        									if (i == 0)
	        									{
	        										column = {
	        											xtype: "gridcolumn",
	        											width: 150,
	        											header: row[j],
	        											dataIndex: "c" + j,
	        											menuDisabled: true
	        										};
	        										
	        										column._lastcolumn = column;
	        										
	        										columns.push(column);
	        										fields.push("c" + j);
	        									}
	        									else
	        									{
	        										delete columns[j]._lastcolumn["dataIndex"];
	        										delete columns[j]._lastcolumn["width"];
	        										columns[j]._lastcolumn.columns = columns[j]._lastcolumn.columns || [];
	        										
	        										column = {
	        											header: row[j],
	        											dataIndex: "c" + j,
	        											menuDisabled: true
	        										};
	        										
	        										columns[j]._lastcolumn.columns.push(column);
	        										columns[j]._lastcolumn = column;
	        									}
	        								}
		        						}
		        						else
		        						{
		        							crow = {};
			        						for (j=0; j < row.length; j++)
			        						{
			        							crow["c" + j] = row[j];
			        						}
			        						
		        							p_data.push(crow);
		        						}
		        					}
		        					
		        					if (columns.length)
			        				{
		        						store = Ext.create("Ext.data.ArrayStore", {
		        							fields: fields
		        						});
		        						g_p1.reconfigure(store, columns);
				        				g_p1.store.loadData(p_data);
			        				}
	        					}
		        				break;
		        			}
		        		}
		        	}
		        }, false);
			req._l/*request*/();
		}
	},
	
	g1/*getTableData*/: function(dnode, dnames) {
		var i, j,
			data = [],
			dnodes, r, rd;
		
		if (dnode)
		{
			dnodes = IG$/*mainapp*/._I26/*getChildNodes*/(dnode);
			
			for (i=0; i < dnodes.length; i++)
			{
				r = IG$/*mainapp*/._I24/*getTextContent*/(dnodes[i]).split("\t");
				rd = {};
				for (j=0; j < dnames.length; j++)
				{
					rd[dnames[j]] = r[j];
				}
				data.push(rd);
			}
		}
		
		return data;
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			job = me.job;
		
		if (job)
		{
			
		}
		
		me.callParent(arguments);
	},
	
	_IG0/*closeDlgProc*/: function() {
		var me = this,
			job = me.job,
			req,
			mbody = "<smsg><item name='" + job.text + "' cname='" + job.dsname + "'>",
			variable_type = me.down("[name=variable_type]").getValue();
			
		mbody += "<node_definition relavance='" + me.down("[name=relavance]").getValue() + "' purpose='" + me.down("[name=purpose]").getValue() + "'>"
		mbody += "<comment><![CDATA[" + (job.dsdesc || "") + "]]></comment>";
		mbody += "<decision><![CDATA[" + (me.down("[name=decision]").getValue() || "") + "]]></decision>";
		mbody += "</node_definition>";
		
		mbody += "<domain_values_table precision='" + me.down("[name=precision]").getValue() + "' unit='" + me.down("[name=unit]").getValue() + "' variable_type='" + variable_type + "'>";
		switch (variable_type)
		{
		case "finitStates":
			break;
		case "numeric":
		case "descritized":
			break;
		}
		mbody += "</domain_values_table>";
		
		mbody += "</item></smsg>";
		
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
	            ack: "77",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({instanceid: me._instanceid, action: "set_property", target: "node"}, "action;instanceid;target"),
	        	mbody: mbody
	        }, me, function(xdoc) {
	        	me.callback && me.callback.execute(me.job);
	        	me.fireEvent("close_dlg", me);
	        }
	    );
		
		req._l/*request*/();
	},
	
	_v1/*variable_type_changed*/: function(tval) {
		var me = this,
			domain_table = me.down("[name=domain_table]"),
			state_num = me.down("[name=state_num]");
		
		domain_table.hide();
		state_num.hide();
		
		switch (tval)
		{
		case "finitStates":
			domain_table.show();
			break;
		case "descritized":
		case "numeric":
			state_num.show();
			break;
		}
	},
	
	initComponent : function() {
		var panel = this,
			lw = 120,
			__m/*mode*/ = panel.__m/*mode*/;
			
		panel._job_name = IRm$/*resources*/.r1("T_BA_1");
		
		panel.moption = [
			{
				xtype: "fieldset",
				title: "Definition",
				layout: "anchor",
				defaults: {
					anchor: "100%"
				},
				items: [
					{
						xtype: "fieldcontainer",
						layout: "hbox",
						items: [
							{
								xtype: "combobox",
								fieldLabel: "Purpose",
								name: "purpose",
								labelWidth: 60,
								width: 180,
								queryMode: 'local',
								displayField: 'name',
								valueField: 'value',
								editable: false,
								autoSelect: true,
								store: {
									xtype: 'store',
									fields: [
										"name", "value"
									]
								}
							},
							{
								xtype: "numberfield",
								labelWidth: 50,
								width: 160,
								name: "relavance",
								fieldLabel: "Relevance"
							}
						]
					},
					{
						xtype: "combobox",
						fieldLabel: "Decision criterion",
						name: "decision",
						queryMode: 'local',
						displayField: 'name',
						valueField: 'value',
						editable: false,
						autoSelect: true,
						store: {
							xtype: 'store',
							fields: [
								"name", "value"
							]
						}
					}
				]
			},
			{
				xtype: "fieldset",
				title: "Domain",
				layout: "anchor",
				items: [
					{
						xtype: "combobox",
						fieldLabel: "Variable type",
						name: "variable_type",
						queryMode: 'local',
						displayField: 'name',
						valueField: 'value',
						editable: false,
						autoSelect: true,
						store: {
							xtype: 'store',
							fields: [
								"name", "value"
							]
						},
						listeners: {
							change: function(tobj) {
								this._v1/*variable_type_changed*/(tobj.getValue());
							},
							scope: this
						}
					},
					{
						xtype: "gridpanel",
						hideHeaders: true,
						name: "domain_table",
						hidden: true,
						height: 150,
						tbar: [
							{
								text: "Stanard domains"
							},
							{
								text: "Add"
							},
							{
								text: "Delete"
							},
							{
								text: "Up"
							},
							{
								text: "Down"
							}
						],
						store: {
							fields: ["name"]
						},
						columns: [
							{
								text: "Name",
								flex: 1,
								dataIndex: "name"
							}
						]
					},
					{
						xtype: "container",
						layout: "anchor",
						hidden: true,
						name: "state_num",
						items: [
							{
								xtype: "fieldcontainer",
								fieldLabel: "Precision",
								layout: "hbox",
								items: [
									{
										xtype: "numberfield",
										name: "precision",
										width: 60
									},
									{
										xtype: "textfield",
										fieldLabel: "Unit",
										name: "unit",
										labelAlign: "right",
										labelWidth: 60,
										width: 120
									}
								]
							},
							{
								xtype: "gridpanel",
								hideHeaders: true,
								height: 140,
								tbar: [
									{
										text: "Add"
									},
									{
										text: "Delete"
									}
								],
								columns: [
									{
										text: "Name",
										flex: 1
									},
									{
										text: "Lower",
										width: 25
									},
									{
										text: "Value",
										width: 50
									},
									{
										text: "Higher",
										width: 25
									},
									{
										text: "Value",
										width: 50
									}
								]
							}
						]
					}
				]
			},
			{
				xtype: "fieldset",
				title: "Parents",
				layout: "anchor",
				items: [
					{
						xtype: "gridpanel",
						hideHeaders: true,
						name: "node_parent",
						height: 100,
						tbar: [
							{
								text: "Add"
							},
							{
								text: "Delete"
							}
						],
						store: {
							fields: ["name"]
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
			},
			{
				xtype: "fieldset",
				layout: "anchor",
				title: "Other properties",
				tbar: [
					{
						text: "Add"
					},
					{
						text: "Delete"
					},
					{
						text: "Up"
					},
					{
						text: "Down"
					}
				]
			}
		];
		
		IG$/*mainapp*/.BY_1/*ByayesChance*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._IB8r/*BayesBranchObject*/ = function(tnode) {
	if (tnode)
	{
		this.p1/*parseNode*/(tnode);
	}
}

IG$/*mainapp*/._IB8r/*BayesBranchObject*/.prototype = {
	p1/*parseNode*/: function(tnode) {
		var me = this,
			i, vnode, vnodes;
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "thresholds");
		if (vnode)
		{
			me.thresholds = [];
			
			vnodes = IG$/*mainapp*/._I26/*getChildNodes*/(vnode);
			
			for (i=0; i < vnodes.length; i++)
			{
				me.thresholds.push({
					value: IG$/*mainapp*/._I1b/*XGetAttr*/(vnodes[i], "value"),
					belongs_to: IG$/*mainapp*/._I1b/*XGetAttr*/(vnodes[i], "belongs_to")
				});
			}
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "states");
		if (vnode)
		{
			me.states = [];
			
			vnodes = IG$/*mainapp*/._I26/*getChildNodes*/(vnode);
			
			for (i=0; i < vnodes.length; i++)
			{
				me.states.push({
					name: IG$/*mainapp*/._I1b/*XGetAttr*/(vnodes[i], "name")
				});
			}
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "label");
		
		if (vnode)
		{
			me.label = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "reference");
		
		if (vnode)
		{
			me.reference = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "potential");
		
		if (vnode)
		{
			me.potential = new IG$/*mainapp*/._IB8p/*BayesPotentialObject*/(vnode); 
		}
	},
	p2/*toXMLString*/: function() {
		var me = this,
			r = "<branch>",
			i;
		
		if (me.thresholds && me.thresholds.length)
		{
			r += "<thresholds>";
			
			for (i=0; i < me.thresholds.length; i++)
			{
				r += "<threshold value='" + me.thresholds[i].value + "' belongs_to='" + me.thresholds[i].belongs_to + "'></threshold>";
			}
			
			r += "</thresholds>";
		}
		
		if (me.states && me.states.length)
		{
			r += "<states>";
			
			for (i=0; i < me.states.length; i++)
			{
				r += "<state name='" + me.states[i].name + "'></state>";
			}
			
			r += "</states>";
		}
		
		if (me.label)
		{
			r += "<label>" + me.label + "</label>";
		}
		
		if (me.reference)
		{
			r += "<reference>" + me.reference + "</reference>";
		}
		
		if (me.potential)
		{
			r += me.potential.p2/*toXMLString*/();
		}
		
		r += "</branch>";
		
		return r;
	}
}

IG$/*mainapp*/._IB8p/*BayesPotentialObject*/ = function(tnode) {
	if (tnode)
	{
		this.p1/*parseNode*/(tnode);
	}
}

IG$/*mainapp*/._IB8p/*BayesPotentialObject*/.prototype = {
	p1/*parseNode*/: function(tnode) {
		var me = this,
			i, vnode, vnodes,
			uval;
		
		me.type = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "type");
		me.role = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "role");
		
		me.variables = [];
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "variables");
		if (vnode)
		{
			vnodes = IG$/*mainapp*/._I26/*getChildNodes*/(vnode);
			
			for (i=0; i < vnodes.length; i++)
			{
				me.variables.push({
					name: IG$/*mainapp*/._I1b/*XGetAttr*/(vnodes[i], "name")
				});
			}
		}
		me.values = IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "values");
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "uncertain_values");
		
		if (vnode)
		{
			me.uncertain_values = [];
			
			vnodes = IG$/*mainapp*/._I26/*getChildNodes*/(vnode);
			
			for (i=0; i < vnodes.length; i++)
			{
				uval = IG$/*mainapp*/._I1c/*XGetAttrProp*/(vnodes[i]);
				uval.value = IG$/*mainapp*/._I24/*getTextContent*/(vnodes[i]);
				
				me.uncertain_values.push(uval);
			}
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "utility_variable");
		
		if (vnode)
		{
			me.utility_variable = {
				name: IG$/*mainapp*/._I1b/*XGetAttr*/(vnode, "name")
			};
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "top_variable");
		
		if (vnode)
		{
			me.top_variable = {
				name: IG$/*mainapp*/._I1b/*XGetAttr*/(vnode, "name"),
				timeslice: IG$/*mainapp*/._I1b/*XGetAttr*/(vnode, "timeslice")
			};
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "branches");
		
		if (vnode)
		{
			me.branches = [];
			
			vnodes = IG$/*mainapp*/._I26/*getChildNodes*/(vnode);
			
			for (i=0; i < vnodes.length; i++)
			{
				me.branches.push(new IG$/*mainapp*/._IB8r/*BayesBranchObject*/(vnodes[i]));
			}
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "model");
		
		if (vnode)
		{
			me.model = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "subpotentials");
		
		if (vnode)
		{
			me.subpotentials = [];
			
			vnodes = IG$/*mainapp*/._I26/*getChildNodes*/(vnode);
			
			for (i=0; i < vnodes.length; i++)
			{
				me.subpotentials.push(new IG$/*mainapp*/._IB8p/*BayesPotentialObject*/(vnodes[i]));
			}
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "time_variable");
		
		if (vnode)
		{
			me.time_variable = {
				name: IG$/*mainapp*/._I1b/*XGetAttr*/(vnode, "name"),
				timeslice: IG$/*mainapp*/._I1b/*XGetAttr*/(vnode, "timeslice")
			};
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "coefficients");
		
		if (vnode)
		{
			me.coefficients = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "covariates");
		
		if (vnode)
		{
			me.covariates = [];
			
			vnodes = IG$/*mainapp*/._I26/*getChildNodes*/(vnode);
			
			for (i=0; i < vnodes.length; i++)
			{
				me.covariates.push(IG$/*mainapp*/._I24/*getTextContent*/(vnodes[i]));
			}
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "covariance_matrix");
		
		if (vnode)
		{
			me.covariance_matrix = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "cholesky_decomposition");
		
		if (vnode)
		{
			me.cholesky_decomposition = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "numeric_value");
		
		if (vnode)
		{
			me.numeric_value = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
		}
		
		vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "state");
		
		if (vnode)
		{
			me.state = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
		}
	},
	
	p2/*toXMLString*/: function() {
		var me = this,
			r = "<potential type='" + (me.type || "") + "' role='" + (me.role || "") + "'>",
			i, 
			variables = me.variables,
			uncertain_values = me.uncertain_values;
		
		if (variables)
		{
			r += "<variables>";
			for (i=0; i < variables.length; i++)
			{
				r += "<variable name='" + variables[i].name + "'/>";
			}
			r += "</variables>";
		}
		r += "<values>" + (me.values || "") + "</values>";
		
		if (uncertain_values && uncertain_values.length)
		{
			r += "<uncertain_values>";
			
			for (i=0; i < uncertain_values.length; i++)
			{
				r += "<value " 
				  + (uncertain_values[i].distribution ? " distribution='" + uncertain_values[i].distribution + "'" : "")
				  + (uncertain_values[i].name ? " name='" + uncertain_values[i].name + "'" : "")
				  + ">" + (uncertain_values[i].value || "") + "</value>";
			}
			
			r += "</uncertain_values>";
		}
		
		if (me.utility_variable && me.utility_variable.name)
		{
			r += "<utility_variable name='" + me.utility_variable.name + "'></utility_variable>";
		}
		
		if (me.top_variable && me.top_variable.name)
		{
			r += "<top_variable name='" + me.top_variable.name + "'" + (me.top_variable.timeslice ? " timeslice='" + me.top_variable.timeslice + "'" : "") + "></top_variable>";
		}
		
		if (me.time_variable && me.time_variable.name)
		{
			r += "<time_variable name='" + me.time_variable.name + "'" + (me.time_variable.timeslice ? " timeslice='" + me.time_variable.timeslice + "'" : "") + "></time_variable>";
		}
		
		if (me.branches && me.branches.length)
		{
			r += "<branches>";
			
			for (i=0; i < me.branches.length; i++)
			{
				r += me.branches[i].p2/*toXMLString*/();
			}
			
			r += "</branches>";
		}
		
		if (me.subpotentials && me.subpotentials.length)
		{
			r += "<subpotentials>";
			
			for (i=0; i < me.subpotentials.length; i++)
			{
				r += me.subpotentials[i].p2/*toXMLString*/();
			}
			
			r += "</subpotentials>";
		}
		
		if (me.model)
		{
			r += "<model>" + me.model + "</model>";
		}
		
		if (me.coefficients)
		{
			r += "<coefficients>" + me.coefficients + "</coefficients>";
		}
		
		if (me.covariates && me.covariates.length)
		{
			r += "<covariates>";
			
			for (i=0; i < me.covariates.length; i++)
			{
				r += "<covariate>" + me.covariates[i] + "</covariates>";
			}
			
			r += "</covariates>";
		}
		
		if (me.covariance_matrix)
		{
			r += "<covariance_matrix>" + me.covariance_matrix + "</covariance_matrix>";
		}
		
		if (me.cholesky_decomposition)
		{
			r += "<cholesky_decomposition>" + me.cholesky_decomposition + "</cholesky_decomposition>";
		}
		
		if (me.numeric_value)
		{
			r += "<numeric_value>" + me.numeric_value + "</numeric_value>";
		}
		
		if (me.state)
		{
			r += "<state>" + me.state + "</state>";
		}
		
		r += "</potential>";
		return r;
	}
};

IG$/*mainapp*/._IB8b/*BayesObject*/ = function(xdoc, bf) {
	var me = this;
	me.bf = bf;
	
	me.nodes = [];
	me.links = [];
	me.potentials = [];
	
	xdoc && me.L1/*parseContent*/(xdoc);
}

IG$/*mainapp*/._IB8b/*BayesObject*/.prototype = {
	L1/*parseContent*/: function(xdoc) {
		var me = this,
			pnode,
			tnode, tnodes, i, j, pnodes, node, lnode, lnk,
			uid, snode, potential, mnode,
			instanceid,
			creterion,
			arr1 = [], arr2 = [];
		
		me.nodes = [];
		me.links = [];
		me.potentials = [];
		me.decision_criteria = [];
		me.interactive_learning = null;
		
		pnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		
		if (pnode)
		{
			uid = IG$/*mainapp*/._I1b/*XGetAttr*/(pnode, "uid");
			
			if (uid)
			{
				me.item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(pnode);
			}
			
			instanceid = IG$/*mainapp*/._I1b/*XGetAttr*/(pnode, "instanceid");
			
			if (instanceid)
			{
				me.instanceid = instanceid;
			}
			
			tnode = IG$/*mainapp*/._I19/*getSubNode*/(pnode, "probnet");
			me.additional_properties = [];
			
			if (tnode)
			{
				snode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "comment");
				
				if (snode)
				{
					me.comment = IG$/*mainapp*/._I24/*getTextContent*/(snode);
				}
				
				snode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "additional_properties");
				
				if (snode)
				{
					tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
					
					for (i=0; i < tnodes.length; i++)
					{
						me.additional_properties.push({
							name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
							value: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "value")
						});
					}
				}
			}
			
			tnode = IG$/*mainapp*/._I19/*getSubNode*/(pnode, "nodes");
			if (tnode)
			{
				me.mtype = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "type");
				me.mtypename = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "typename");
				
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				
				for (i=0; i < tnodes.length; i++)
				{
					node = new IG$/*mainapp*/._baN/*bflowNode*/(tnodes[i]);
					node.w = 100;
					node.h = 28;
					node._cs = ["ba_base", "ba_" + node.shape];
					me.nodes.push(node);
				}
			}
			
			tnode = IG$/*mainapp*/._I19/*getSubNode*/(pnode, "links");
			if (tnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < tnodes.length; i++)
				{
					lnk = {};
					IG$/*mainapp*/._I1f/*XGetInfo*/(lnk, tnodes[i], "from;to;dashstyle;directed", "s");
					
					snode = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "potential");
					
					if (snode)
					{
						lnk.potential = new IG$/*mainapp*/._IB8p/*BayesPotentialObject*/(snode);
					}
					
					snode = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "revealing_condition");
					
					if (snode)
					{
						lnk.revealing_condition = {};
						
						mnode = IG$/*mainapp*/._I19/*getSubNode*/(snode, "states");
						
						if (mnode)
						{
							lnk.revealing_condition.states = [];
							
							snodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
							for (j=0; j < snodes.length; j++)
							{
								lnk.revealing_condition.states.push({
									name: IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[j], "name")
								});
							}
						}
					}
					
					me.links.push(lnk);
				}
			}
			
			tnode = IG$/*mainapp*/._I19/*getSubNode*/(pnode, "potentials");
			if (tnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < tnodes.length; i++)
				{
					potential = new IG$/*mainapp*/._IB8p/*BayesPotentialObject*/(tnodes[i]);
					me.potentials.push(potential);
				}
			}
			
			tnode = IG$/*mainapp*/._I19/*getSubNode*/(pnode, "decision_criteria");
			if (tnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < tnodes.length; i++)
				{
					criterion = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
					
					snode = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "additional_properties");
					
					if (snode)
					{
						snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
						for (j=0; j < snodes.length; j++)
						{
							criterion[IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[j], "name")] = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[j], "value");
						}
					}
					
					me.decision_criteria.push(criterion);
				}
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(pnode, "interactive_learning");
			
			if (tnode)
			{
				$.each([
				    {
				    	name: "showable_edit_proposals",
				    	arr: arr1
				    },
				    {
				    	name: "blocked_edit_proposals",
				    	arr: arr2
				    }
				], function(n, kobj) {
					var knode,
						i, j, vnodes, vrow,
						arr = kobj.arr;
					
					knode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, kobj.name);
					
					if (knode)
					{
						vnodes = IG$/*mainapp*/._I26/*getChildNodes*/(knode);
						
						for (i=0; i < vnodes.length; i++)
						{
							vrow = {};
							
							knodes = IG$/*mainapp*/._I26/*getChildNodes*/(vnodes[i]);
							
							for (j=0; j < knodes.length; j++)
							{
								vname = IG$/*mainapp*/._I29/*XGetNodeName*/(knodes[j]);
								vrow[vname] = IG$/*mainapp*/._I24/*getTextContent*/(knodes[j]);
							}
							
							arr.push(vrow);
						}
					}
				});
				
				if (arr1.length + arr2.length > 0)
				{
					me.interactive_learning = {
						showable_edit_proposals: arr1,
						blocked_edit_proposals: arr2
					};
				}
			}
		}
	},
	
	L2/*getContent*/: function() {
		var me = this,
			r = [],
			l,
			potentials = me.potentials,
			decision_criteria = me.decision_criteria;
		
		r.push("<smsg><item");
		
		me.item && r.push(IG$/*mainapp*/._I20/*XUpdateInfo*/(me.item, "uid;nodepath;name", "s"));
		r.push(">");
		
		r.push("<probnet>");
		
		if (me.comment)
		{
			r.push("<comment><![CDATA[" + me.comment + "]]></comment>");
		}
	
		l = me.additional_properties;
		
		if (l && l.length)
		{
			r.push("<additional_properties>");
			
			for (i=0; i < l.length; i++)
			{
				r.push("<property name='" + l[i].name + "' value='" + l[i].value + "'/>");
			}
			
			r.push("</additional_properties>");
		}
		
		r.push("</probnet>");
		
		r.push(me.bf.l2/*exportContent*/.call(me.bf, me.mtype, me.mtypename));
		
		if (potentials && potentials.length)
		{
			r.push("<potentials>");
			for (i=0; i < potentials.length; i++)
			{
				r.push(potentials[i].p2/*getXMLString*/());
			}
			r.push("</potentials>");
		}
		
		if (decision_criteria && decision_criteria.length)
		{
			r.push("<decision_criteria>");
			
			for (i=0; i < decision_criteria.length; i++)
			{
				r.push("<criterion name='" + decision_criteria[i].name + "'>");
				r.push("<additional_properties>");
				$.each(decision_criteria[i], function(m, val) {
					if (m && m != "name")
					{
						r.push("<property name='" + m + "' value='" + val + "'></property>");
					}
				});
				r.push("</additional_properties>");
				r.push("</criterion>");
			}
			
			r.push("</decision_criteria>");
		}
		
		r.push("</item></smsg>");
		
		return r.join("");
	}
}
IG$/*mainapp*/._IB9b/*ml_bayes*/ = $s.extend($s.panel, {
	closable: true,
	
	layout: "fit",
	bodyPadding: 0,
	sgap: 1000,
	
	_IFd/*init_f*/: function() {
		var me = this,
			topmenu = me.topmenu,
			mainarea = me.mainarea,
			fmenu,
			farea,
			bf,
			dt = [],
			bccall,
			req;
			
		dt = [
			{
				shape: "circle",
				name: "chance",
				_cs: ["ba_base", "ba_circle"],
				text: IRm$/*resources*/.r1("L_ML_C1")
			},
			{
				shape: "rect",
				name: "decision",
				_cs: ["ba_base", "ba_rect"],
				text: IRm$/*resources*/.r1("L_ML_C2")
			},
			{
				shape: "rhombus",
				name: "utility",
				_cs: ["ba_base", "ba_rhombus"],
				text: IRm$/*resources*/.r1("L_ML_C3")
			}
		];
		
		farea = me.farea = $("<div class='idv-flw-reg'></div>").appendTo(mainarea);
		
		bf = me.bf = new IG$/*mainapp*/._I9a/*flowDiagram*/(farea);
		bf.init.call(bf);
			
		topmenu.empty();
		fmenu = $("<div class='idv-flw-mnu'></div>").appendTo(topmenu);
		
		me.l1/*initFlowMenu*/(fmenu, dt);
		
		bccall = new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.l4/*onBoxUpdate*/);
		
		bf.container.bind("boxClicked", function(ev, data) {
			var dlg,
				moption = me.down("[name=moption]");
				
			// moption.removeAll();
			
			dlg = me.__dlg;
			
			if (!dlg)
			{
				me.__dlg = dlg = new IG$/*mainapp*/.BY_1/*ByayesChance*/({
					job: data,
					_sustain: 1,
					_vmode: data.name,
					_p/*editor*/: me,
					callback: bccall
				});
				
				moption.add(dlg);
				
				dlg.on("close_dlg", function(m) {
					// moption.remove(dlg);
					moption.collapse();
				});
			}
			else
			{
				dlg.job = data;
				dlg._vmode = data.name,
				dlg._IFe/*initF*/.call(dlg);
			}
			
			if (dlg)
			{
				moption.expand();
				// IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
			}
		});
		
		bf.container.bind("flow_changed", function(ev, data) {
			switch(data.source)
			{
			case "box_add":
			case "link_node":
			case "move_link":
			case "link_detach":
				me.updateNetwork.call(me, data.source, data);
				break;
			}
		});
		
		bf.container.bind("visual_state_click", function(ev, data) {
			me.setNewFinding.call(me, data);
		});
		
		if (!ig$/*appoption*/.b$Am)
		{
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "77",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({action: "get_var"}, "action"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
		        }, me, function(xdoc) {
		        	var me = this,
		        		data = {},
		        		tnode,
		        		tnodes,
		        		snodes,
		        		tname,
		        		tdata,
		        		titem,
		        		i, j;
		        		
		        	tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg");
		        	
		        	if (tnode)
		        	{
		        		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
		        		
		        		for (i=0; i < tnodes.length; i++)
		        		{
		        			tname = IG$/*mainapp*/._I29/*XGetNodeName*/(tnodes[i]);
		        			tdata = data[tname] = [];
		        			
		        			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnodes[i]);
		        			for (j=0; j < snodes.length; j++)
		        			{
		        				titem = {
		        					value: IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[j], "value")
		        				};
		        				titem.name = titem.name || titem.value;
		        				tdata.push(titem);
		        			}
		        		}
		        		
		        		ig$/*appoption*/.b$Am = data;
		        	}
		        	
		        	me._a1/*loadInit*/();
		        }, false);
			req._l/*request*/();
		}
		else
		{
			me._a1/*loadInit*/();
		}
	},
	
	_a1/*loadInit*/: function() {
		var me = this;
		
		if (me.uid)
		{
			me.M1/*loadContent*/();
		}
		else
		{
			me.rs_M1/*rs_loadContent*/(null);
		}
	},
	
	l4/*onBoxUpdate*/: function(job) {
		var me = this,
			bf = me.bf;
		
		job.text = job.dsname;
		
		bf.s4/*setTitle*/(job, job.dsname);
	},
	
	M1/*loadContent*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		if (me.uid)
		{
			me.setLoading(true);
			req.init(me, 
				{
		            ack: "5",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'diagnostics'})
		        }, me, me.rs_M1/*rs_loadContent*/, false);
			req._l/*request*/();
		}
		else
		{
			me.rs_M1/*rs_loadContent*/(null);
		}
	},
	
	rs_M1/*rs_loadContent*/: function(xdoc, is_learn) {
		var me = this,
			bf = me.bf,
			dlg;
		
		if (!me.itemobj)
		{
			me.itemobj = new IG$/*mainapp*/._IB8b/*BayesObject*/(xdoc, bf);
		}
		else
		{
			me.itemobj.L1/*parseContent*/(xdoc);
		}
		
		if (me.__learn_opt && me.bfirst)
		{
			me.do1/*doLearn*/(me.__learn_opt);
		}
		
		if (is_learn && me.itemobj.interactive_learning)
		{
			dlg = new IG$/*mainapp*/.bA_6/*interactive_learning*/({
				itemobj: me.itemobj,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(c) {
					me.do1/*doLearn*/(null, {
						interactive_run: true
					});
				})
			});
			dlg.show();
		}
		
		me.A1/*refreshUI*/();
	},
	
	A1/*refreshUI*/: function() {
		var me = this,
			bf = me.bf,
			itemobj = me.itemobj,
			mtype = itemobj.mtype;
			
		bf.L1/*loadOption*/.call(bf, itemobj);
		
		if (!mtype)
		{
			me.np/*network_properties*/(!me.bfirst);
		}
		else
		{
			if (!me.bfirst)
			{
				var itemobj = me.itemobj,
					instanceid = itemobj.instanceid,
					uid = itemobj.uid,
					req = new IG$/*mainapp*/._I3e/*requestServer*/();
					
				req.init(me, 
					{
			            ack: "77",
			            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid, instanceid: instanceid, action: "restore_pgmx"}, "uid;action;instanceid"),
			            mbody: itemobj.L2/*getContent*/()
			        }, me, function(xdoc) {
			        	var txtpgmx = me.down("[name=txtpgmx]"),
			        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/data"),
			        		tval;
			        		
			        	me.bfirst = 1;
			        	
			        	if (tnode)
			        	{
			        		itemobj.instanceid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "instanceid");
			        		
			        		if (me.__learn_opt)
			        		{
			        			me.do1/*doLearn*/(me.__learn_opt);
			        		}
			        	}
			        }, false);
				req._l/*request*/();
			}
		}
		
		switch (mtype)
		{
		case "":
			break;
		}
	},
	
	m2/*getParents*/: function(mobj, pname) {
		var me = this,
			bf = me.bf,
			a_boxes = bf.a_boxes,
			i,
			cobj,
			cons = bf.plumb.getConnections(),
			src, tgt,
			connections = [],
			prev = [];
			
		for (i=0; i < a_boxes.length; i++)
		{
			if (a_boxes[i].sid == mobj.job.sid)
			{
				cobj = a_boxes[i];
				break;
			}
		}
		
		if (cons && cons.length)
		{
			for (i=0; i < cons.length; i++)
			{
				src = cons[i].source;
	            tgt = cons[i].target;
	            
	            src = bf.getBoxObject.call(bf, src);
	            tgt = bf.getBoxObject.call(bf, tgt);
	            
	            connections.push({
	            	src: src,
	            	tgt: tgt
	            });
	            
	            if (tgt && tgt.sid == cobj.sid)
	            {
	            	if (src && (pname && src.name == pname || !pname))
	            	{
	            		prev.push(src);
	            	}
	            }
	        }
		}
		
		return prev;
	},
	
	l1/*initFlowMenu*/: function(fmenu, dt) {
		var me = this,
			i,
			mul,
			gap = 10,
			sx = gap,
			bf = me.bf;
			
		fmenu.empty();
		
		$.each(dt, function(n, item) {
			var dv,
				bg,
				i;
			
			if (!item.hidden)
			{
				dv = $("<div class='idv-flw-shp-a'><div>" + item.text + "</div></div>").appendTo(fmenu);
				dv.css({left: sx});
				
				if (item._cs && item._cs.length)
				{
					for (i=0; i < item._cs.length; i++)
					{
						dv.addClass(item._cs[i]);
					}
				}
				
				sx += gap + (IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dv) || 120);
				dv.draggable({
					opacity: 0.7, 
					helper: "clone",
					stop: function(event, ui) {
						var p = ui.position,
							farea = me.farea,
							mp = $(farea.parent()).offset(),
							mposition = farea.offset(),
							mw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(farea),
							mh = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(farea);
						
						var nitem = new IG$/*mainapp*/._baN/*bflowNode*/();
						nitem.c1/*clone*/.call(nitem, item);
						nitem.w = 100;
						nitem.h = 28;
						
						mposition.top -= mp.top;
						mposition.left -= mp.left;
						
						p.w = nitem.w;
						p.h = nitem.h;
						
						if (mposition.left < p.left && p.left < mposition.left + mw 
							&& mposition.top < p.top && p.top < mposition.top + mh)
						{
							bf.addBox.call(bf, nitem, p, true);
						}
					}
				});
			}
		});
	},
	
	m1/*loadPGMX*/: function(c) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		me.lv/*changeviewmode*/(0);
		
		req.init(me, 
			{
	            ack: "77",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, action: "load_pgmx"}, "uid;action"),
	            mbody: c
	        }, me, function(xdoc) {
	        	this.rs_M1/*rs_loadContent*/(xdoc);
	        }, false);
		req._l/*request*/();
	},
	
	np/*network_properties*/: function(b_first) {
		var me = this,
			dlg = new IG$/*mainapp*/.bA_1/*network_properties_dialog*/({
				itemobj: me.itemobj,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(c) {
					me.updateNetwork("net_prop", null, b_first);
				})
			});
		
		dlg.show();
	},
	
	updateNetwork: function(ptype, data, b_first) {
		var me = this,
			itemobj = me.itemobj,
			instanceid = itemobj.instanceid,
			uid = itemobj.uid,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			payload,
			p2 = "uid;action;instanceid;actiontype",
			p1 = {
				uid: uid, 
				instanceid: instanceid, 
				action: "update_network", 
				actiontype: ptype
			};
			
		switch (ptype)
		{
		case "box_add":
			p2 += ";sid";
			p1.sid = data.item.sid;
			break;
		case "link_node":
			p2 += ";src;tgt";
			p1.src = data.item.src;
			p1.tgt = data.item.tgt;
			break;
		case "move_link":
			p2 += ";source_0;source_1;target_0;target_1";
			p1.source_0 = data.item.source_0;
			p1.source_1 = data.item.source_1;
			p1.target_0 = data.item.target_0;
			p1.target_1 = data.item.target_1;
			break;
		case "link_detach":
			p2 += ";src;tgt";
			p1.src = data.item.src;
			p1.tgt = data.item.tgt;
			break;
		}
			
		payload = IG$/*mainapp*/._I2d/*getItemAddress*/(p1, p2);
		
		req.init(me, 
			{
	            ack: "77",
	            payload: payload,
	            mbody: itemobj.L2/*getContent*/()
	        }, me, function(xdoc) {
	        	if (!instanceid)
        		{
	        		var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/data"),
	        			new_inst = (tnode) ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "instanceid") : null;
	        			
	        		if (new_inst)
	        		{
	        			itemobj.instanceid = new_inst;
	        		}
	        		
	        		if (me.__learn_opt && b_first)
	        		{
	        			me.do1/*doLearn*/(me.__learn_opt);
	        		}
        		}
	        }, false);
		req._l/*request*/();
	},
	
	setNewFinding: function(item) {
		var me = this,
			itemobj = me.itemobj,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
	            ack: "77",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({
	            	uid: me.uid, 
	            	action: "set_new_finding", 
	            	instanceid: itemobj.instanceid
	            }, "uid;action;instanceid"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({
	            	target: item.graphic.name,
	            	state: item.state.states.name
	            }) 
	        }, me, function(xdoc) {
	        	var me = this,
	        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/graphics");
	        		
	        	if (tnode)
	        	{
	        		me.paint(tnode, me.emode);
	        	}
	        }, false);
		req._l/*request*/();
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this,
			itemobj = me.itemobj,
			dlg;
		
		switch (cmd)
		{
		case "cmd_save":
			if (!me.uid)
			{
				me.fV7/*saveAsMetaContent*/(false);
			}
			else
			{
				me.fV6/*saveMetaContent*/(false);
			}
			break;
		case "cmd_saveas":
			me.fV7/*saveAsMetaContent*/(false);
			break;
		case "cmd_load_pgmx":
			dlg = new IG$/*mainapp*/._IB9c/*ml_bayes_pgmx*/({
				itemobj: me.itemobj,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(c) {
					me.m1/*loadPGMX*/(c);
				})
			});
			dlg.show();
			break;
		case "cmd_net_prop":
			me.np/*network_properties*/();
			break;
		case "cmd_favorites":
			if (this.uid)
    		{
    			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
    			req.init(me, 
					{
			            ack: "11",
			        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid}),
			            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'addfavorites'})
			        }, me, me.rs_i1_2/*regFavorites*/, null, null);
				req._l/*request*/();
    		}
    		else
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_ERR_NSAVE'), null, me, 1, "error");
			}
			break;
		case "cmd_schedule":
			if (me.uid)
			{
				var mreq = [
					{
						ack: "3",
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, option: "execute"}, "uid;option"),
						mbody: me.itemobj.L2/*getContent*/.call(me.itemobj),
						jobkey: "0"
					}
				]; 
				
				IG$/*mainapp*/._I50/*showScheduler*/(me, me.uid, me.itemtype, mreq, null);
			}
			break;
		case "cmd_net_mode":
			me.setNewWorkingMode();
			break;
		case "cmd_decision_tree":
			me.toggleDecisionTree();
			break;
		case "cmd_learn":
			var dlg = new IG$/*mainapp*/.bA_2/*learning_dialog*/({
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(__learn_opt) {
					me.do1/*doLearn*/(__learn_opt);
				})
			});
			dlg.show();
			break;
		case "cmd_db_generator":
			var dlg = new IG$/*mainapp*/.bA_3/*db_generator*/({
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(param) {
					var mreq = new IG$/*mainapp*/._I3e/*requestServer*/();
	    			mreq.init(me, 
						{
							ack: "77",
							payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, instanceid: itemobj.instanceid, action: "db_gen"}, "uid;action;instanceid"),
							mbody: IG$/*mainapp*/._I2e/*getItemOption*/(param) 
						}, me, function(xdoc) {
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
				        }
					); 
					mreq._l/*request*/();
				})
			});
			dlg.show();
			break;
		case "cmd_cost_effct_sen":
		case "cmd_cost_effct_det":
			var atype = (cmd == "cmd_cost_effct_sen" ? 0 : 1), 
				dlg = new IG$/*mainapp*/.bA_4/*cost_effectiveness*/({
				atype: atype, 
				uid: me.uid,
				itemobj: itemobj,
				width: atype == 0 ? 600 : 320,
				height: atype == 0 ? 550 : 300,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(param) {
					
				})
			});
			dlg.show();
			break;
		}
	},
	
	do1/*doLearn*/: function(learn_opt, interactive_opt) {
		var me = this,
			itemobj = me.itemobj,
			mreq = new IG$/*mainapp*/._I3e/*requestServer*/(),
			s_learn_opt = "<smsg>",
			k, oval, i;
		
		if (interactive_opt && interactive_opt.interactive_run)
		{
			s_learn_opt += "<learn_option interactive_do='T'>";
		}
		else
		{
			s_learn_opt += "<learn_option>";
			
			for (k in learn_opt)
			{
				oval = learn_opt[k];
				
				if (k == "selected_header")
				{
					s_learn_opt += "<option name='selected_header'>";
					
					for (i=0; i < oval.length; i++)
					{
						s_learn_opt += "<header>";
						s_learn_opt += "<selected>" + oval[i].selected + "</selected>";
						s_learn_opt += "<name><![CDATA[" + oval[i].name + "]]></name>";
						s_learn_opt += "<missing_value>" + (oval[i].missing_value || "") + "</missing_value>";
						s_learn_opt += "<discretization>" + (oval[i].discretization || "") + "</discretization>";
						s_learn_opt += "<num_of_interval>" + (oval[i].num_of_interval || "") + "</num_of_interval>";
						s_learn_opt += "</header>";
					}
					
					s_learn_opt += "</option>";
				}
				else
				{
					if (oval)
					{
						s_learn_opt += "<option name='" + k + "'>" + oval + "</option>";
					}
				}
			}
		}
		
		s_learn_opt += "</learn_option></smsg>";
			
		me.setLoading();
		
		mreq.init(me, 
			{
				ack: "77",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, instanceid: itemobj.instanceid, action: "learn_network", pfile: (learn_opt ? learn_opt.pfile : null)}, "uid;action;instanceid;pfile"),
				mbody: s_learn_opt
			}, me, function(xdoc) {
				me.__learn_opt = null;
				me.rs_M1/*rs_loadContent*/(xdoc, 1);
	        }
		); 
		mreq._l/*request*/();
	},
	
	toggleDecisionTree: function() {
		// INFERENCE_WORKING_MODE, EDITION_WORKING_MODE
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			itemobj = me.itemobj;
		
		if (itemobj && itemobj.instanceid)
		{
			me.lv/*changeviewmode*/(1);
			req.init(me, 
				{
		            ack: "77",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, action: "set_decision_tree", instanceid: itemobj.instanceid}, "uid;action;instanceid"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/() 
		        }, me, function(xdoc) {
		        	var me = this,
		        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/decision_tree");
		        		
		        	if (tnode)
		        	{
		        		me.paint_decision_tree(tnode);
		        	}
		        }, false);
			req._l/*request*/();
		}
	},
	
	paint_decision_tree: function(tnode) {
		var me = this,
			m_decision_tree = me.down("[name=m_decision_tree]"),
			eldom,
			mdom,
			dnd_viewer = me.dnd_viewer,
			tdata = {};
		
		if (!dnd_viewer)
		{
			eldom = $(m_decision_tree.el.dom);
			mdom = $("<div class='ba-decision-viewer'></div>").appendTo(eldom);
			mdom.width(eldom.width()).height(eldom.height());
			dnd_viewer = new node_tree_viewer(mdom);
			me.dnd_viewer = dnd_viewer;
		}
		
		tdata = me.build_decision_data(tnode);
		
		if (tdata && tdata.length > 0)
		{
			dnd_viewer.loadTreeData(tdata[0]);
		}
	},
	
	build_decision_data: function(tnode) {
		var me = this,
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			snode, snodes,
			i, j, p,
			ndname,
			tdata = [],
			tobj = {};
			
		for (i=0; i < tnodes.length; i++)
		{
			ndname = IG$/*mainapp*/._I29/*XGetNodeName*/(tnodes[i]);
			
			switch (ndname)
			{
			case "decision_branch":
			case "decision_treenode":
				tobj = {};
				snode = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "property");
				if (snode)
				{
					snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
					for (j=0; j < snodes.length; j++)
					{
						p = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[j], "name");
						tobj[p] = IG$/*mainapp*/._I24/*getTextContent*/(snodes[j]);
					}
					
					if (ndname == "decision_branch")
					{
						tobj.name = tobj.branch_state || "top";
					}
					else
					{
						tobj.name = tobj.nodename;
					}
				}
				snode = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "children");
				if (snode)
				{
					tobj.children = me.build_decision_data(snode);
				}
				tdata.push(tobj);
				break;
			}
		}
		
		return tdata;
	},
	
	setNewWorkingMode: function() {
		// INFERENCE_WORKING_MODE, EDITION_WORKING_MODE
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			itemobj = me.itemobj,
			emode = me.emode ? 0 : 1;
			
		me.emode = emode;
		
		if (itemobj && itemobj.instanceid)
		{
			me.lv/*changeviewmode*/(0);
			
			if (me.emode)
			{
				req.init(me, 
					{
			            ack: "77",
			            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, action: "set_working_mode", instanceid: itemobj.instanceid}, "uid;action;instanceid"),
			            mbody: IG$/*mainapp*/._I2e/*getItemOption*/() 
			        }, me, function(xdoc) {
			        	var me = this,
			        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/graphics");
			        		
			        	if (tnode)
			        	{
			        		me.paint(tnode, me.emode);
			        	}
			        }, false);
				req._l/*request*/();
			}
			else
			{
				me.paint(null, me.emode);
			}
		}
	},
	
	paint: function(gnode, emode) {
		var me = this,
			tnode = gnode ? IG$/*mainapp*/._I18/*XGetNode*/(gnode, "visualnodes") : null,
			tnodes,
			p, pn, vn, nd,
			g = {},
			i, j, k, vns, vstat, v1, v2, v3, v4,
			itemobj = me.itemobj;
			
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < tnodes.length; i++)
			{
				pn = tnodes[i];
				p = {
					name: IG$/*mainapp*/._I1b/*XGetAttr*/(pn, "name"),
					visualstates: []
				};
				
				vn = IG$/*mainapp*/._I18/*XGetNode*/(pn, "innerbox/visualstates");
				
				if (vn)
				{
					vns = IG$/*mainapp*/._I26/*getChildNodes*/(vn);
					
					for (j=0; j < vns.length; j++)
					{
						v1 = vns[j];
						vstat = IG$/*mainapp*/._I1c/*XGetAttrProp*/(v1);
						vstat.position = parseInt(vstat.position);
						vstat.ispropagationactive = vstat.ispropagationactive == "T";
						vstat.values = [];
						
						v2 = IG$/*mainapp*/._I18/*XGetNode*/(v1, "values");
						
						if (v2)
						{
							v3 = IG$/*mainapp*/._I26/*getChildNodes*/(v2);
							
							for (k=0; k < v3.length; k++)
							{
								v4 = v3[k];
								
								vstat.values.push({
									barlength: IG$/*mainapp*/._I1a/*getSubNodeText*/(v4, "barlength"),
									formatvalue: IG$/*mainapp*/._I1a/*getSubNodeText*/(v4, "formatvalue")
								});
							}
						}
						
						p.visualstates.push(vstat);
					}
				}
				
				g[p.name] = p;
			}
		}
		
		$.each(itemobj.nodes, function(i, nd) {
			nd.paint.call(nd, g[nd.text], emode);
		});
		
		me.bf.plumb.repaintEverything();
	},
	
	rs_i1_2/*regFavorites*/: function(xdoc) {
    	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED_FAV"), null, null, 0, "success");
    },
    
    ll4/*getStatus*/: function() {
    	var me = this;
    	
    	if (me.stimer)
		{
			clearTimeout(me.stimer);
		}
		
		me.stimer = setTimeout(function() {
			me.ll3/*getRunStatus*/.call(me);
		}, me.sgap);
    },
    
    rs_lllE/*runBusinessError*/: function(xdoc) {
    	var panel = this,
    		r = true,
    		errcode = IG$/*mainapp*/._I27/*getErrorCode*/(xdoc);
    	
    	if(errcode == "0x28a0")
    	{
    		r = false;
    		
    		var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
    			sid = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
    			
    		if (sid)
    		{
    			IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, "Already workflow is running on server. Would you like to stop service?", function(e) {
	    			if (e == "yes")
	    			{
	    				var req = new IG$/*mainapp*/._I3e/*requestServer*/();
	    				req.init(panel, 
							{
				                ack: "3",
					            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid, sid: sid, option: "cancelWorkflow"}, "uid;sid;option"),
					            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
				            }, panel, panel.rs_ll2/*cancelWorkflow*/, null);
					    req._l/*request*/();
	    			}
	    		}, panel, panel);
    		}
    	}
    	
    	return r;
    },
    
    rs_ll2/*cancelWorkflow*/: function(xdoc) {
    	var me = this;
    	me.lll/*runBusiness*/();
    },
	
	fV6/*saveMetaContent*/: function(afterclose) {
		var panel = this,
			contentxml = panel.itemobj.L2/*getContent*/.call(panel.itemobj);
    	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	req.init(panel, 
			{
	            ack: "31",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
	            mbody: contentxml
	        }, panel, panel.rs_fV6/*saveMetaContent*/, null, [afterclose]);
		req._l/*request*/();
	},
	
	rs_fV6/*saveMetaContent*/: function(xdoc, opt) {
		var me = this,
			afterclose = (opt ? opt[0] : false);
    	if (afterclose == true)
    	{
    		me.close();
    	}
    	else
    	{
    		me._ILb_/*contentchanged*/ = false;
    		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
    	}
	},
	
	fV7/*saveAsMetaContent*/: function(afterclose) {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
	    		mode: "newitem",
	    		initpath: me.nodepath,
	    		callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.fV8/*saveNewMetaContent*/, afterclose)
	    	});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlgitemsel);
	},
	
	fV8/*saveNewMetaContent*/: function(item, afterclose) {
		var panel = this,
    		contentxml = panel.itemobj.L2/*getContent*/.call(panel.itemobj),
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	
		req.init(panel, 
			{
                ack: "31",
	            payload: "<smsg><item address='" + item.nodepath + "/" + item.name + "' name='" + item.name + "' type='" + (this.itemtype) + "' pid='" + item.uid + "' description=''/></smsg>",
	            mbody: contentxml
            }, panel, panel._IO5/*rs_processMakeMetaItem*/, panel._IO6/*rs_processMakeMetaItem*/, [item.name, afterclose, item.nodepath, item.uid, contentxml]);
       	req.showerror = false;
	    req._l/*request*/();
	},
	
	_IO5/*rs_processMakeMetaItem*/: function(xdoc, opt) {
		var me = this,
			itemobj = me.itemobj,
			pnode;
			
		pnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		
		if (pnode)
		{
			itemobj.item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(pnode);
			me.setTitle(itemobj.item.name);
			me.uid = itemobj.item.uid;
		}
	},
	
	_IO6/*rs_processMakeMetaItem*/: function(xdoc, opt) {
    	var panel = this,
    		itemname = opt[0],
    		afterclose = opt[1],
    		nodepath = opt[2],
    		pitemuid = opt[3],
    		contentxml = opt[4],
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
				            payload: "<smsg><item address='" + nodepath + "/" + itemname + "' name='" + itemname + "' type='" + (this.itemtype ? this.itemtype : 'Report') + "' pid='" + pitemuid + "' description='' overwrite='T'/></smsg>",
				            mbody: contentxml
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
    
    lv/*changeviewmode*/: function(mode) {
    	var me = this,
    		m_main_card = me.m_main_card;
    		
    	m_main_card.getLayout().setActiveItem(mode);
    },
	
	initComponent: function() {
		var me = this;
		
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					layout: "card",
					name: "m_main_card",
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
									name: "topmenu",
									height: 40,
									border: 1,
									style: {
									    borderColor: '#efefef',
									    borderStyle: 'solid'
									}
								},
								{
									xtype: "container",
									flex: 1,
									layout: "border",
									items: [
										{
											xtype: "container",
											name: "mainarea",
											region: "center",
											flex: 1
										},
										{
											xtype: "panel",
											name: "moption",
											title: "Properties",
											split: true,
											collapsible: true,
											collapsed: true,
											collapseMode: "mini",
											region: "east",
											width: 420,
											layout: "fit",
											items: [
												{
													xtype: "displayfield",
													value: "Click Item to set properties"
												}
											]
										}
									]
								}
							]
						},
						{
							xtype: "container",
							name: "m_decision_tree",
							listeners: {
								resize: function(tobj, w, h) {
									var me = this,
										dnd_viewer = me.dnd_viewer;
										
									if (dnd_viewer)
									{
										dnd_viewer.setSize.call(dnd_viewer, w, h);
									}
								},
								scope: this
							}
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
		        	tooltip: IRm$/*resources*/.r1('L_SAVE_CONTENTAS'),
		        	handler: function() {
			    		this._t$/*toolbarHandler*/('cmd_saveas'); 
			    	},
		        	scope: this
		        },
		        {
		        	text: "NetProp",
		        	handler: function() {
		        		this._t$/*toolbarHandler*/("cmd_net_prop");
		        	},
		        	scope: this
		        },
		        {
		        	text: IRm$/*resources*/.r1("L_ML_C7"),
		        	handler: function() {
		        		this._t$/*toolbarHandler*/('cmd_load_pgmx'); 
		        	},
		        	scope: this
		        },
		        "-",
		        {
		        	text: IRm$/*resources*/.r1("L_ML_C4a"),
		        	handler: function() {
		        		this._t$/*toolbarHandler*/('cmd_net_mode'); 
		        	},
		        	scope: this
		        },
		        {
		        	text: IRm$/*resources*/.r1("L_ML_C5"),
		        	handler: function() {
		        		this._t$/*toolbarHandler*/('cmd_decision_tree'); 
		        	},
		        	scope: this
		        },
		        "-",
		        {
		        	text: IRm$/*resources*/.r1("L_ML_C6"),
		        	handler: function() {
		        		this._t$/*toolbarHandler*/('cmd_cases'); 
		        	},
		        	scope: this
		        },
		        {
		        	text: IRm$/*resources*/.r1("L_ML_C6a"),
		        	handler: function() {
		        		this._t$/*toolbarHandler*/('cmd_cases_new'); 
		        	},
		        	scope: this
		        },
		        {
		        	text: IRm$/*resources*/.r1("L_ML_C6b"),
		        	handler: function() {
		        		this._t$/*toolbarHandler*/('cmd_cases_rm'); 
		        	},
		        	scope: this
		        },
		        "-",
		        {
		        	text: IRm$/*resources*/.r1("L_ML_LEARN"),
		        	handler: function() {
		        		this._t$/*toolbarHandler*/('cmd_learn'); 
		        	},
		        	scope: this
		        },
		        {
		        	text: "Tools",
		        	menu: {
		        		xtype: "menu",
						items: [
							{
								text: "Database generator",
								handler: function() {
									this._t$/*toolbarHandler*/('cmd_db_generator'); 
								},
								scope: this
							},
							{
					        	text: IRm$/*resources*/.r1("L_ML_CEFF_S"),
					        	handler: function() {
					        		this._t$/*toolbarHandler*/('cmd_cost_effct_sen'); 
					        	},
					        	scope: this
					        },
					        {
					        	text: IRm$/*resources*/.r1("L_ML_CEFF_D"),
					        	handler: function() {
					        		this._t$/*toolbarHandler*/('cmd_cost_effct_det'); 
					        	},
					        	scope: this
					        }
						]
					}
		        },
		        "->",
		        {
					iconCls: "icon-toolbar-schedule",
					cls: "ig_r_sch",
					tooltip: IRm$/*resources*/.r1('B_SCHEDULE'),
					hidden: ig$/*appoption*/.features && !ig$/*appoption*/.features.enable_scheduler ? true : false,
					handler: function() {
						this._t$/*toolbarHandler*/.call(this, 'cmd_schedule');
					},
					scope: this
				},
		        {
		        	iconCls: "icon-toolbar-favorites",
		        	tooltip: IRm$/*resources*/.r1('B_FAVORITES'),
		        	handler: function() {
		        		this._t$/*toolbarHandler*/.call(this, 'cmd_favorites');
		        	},
		        	scope: this
		        }
			]
	    });
	          
		IG$/*mainapp*/._IB9b/*ml_bayes*/.superclass.initComponent.call(this);
	},
	
	listeners: {
		afterrender: function(tobj) {
			var me = this;
			
			me.m_main_card = me.down("[name=m_main_card]");
			
			me.topmenu = $(me.down("[name=topmenu]").el.dom);
			me.mainarea = $(me.down("[name=mainarea]").el.dom);
			
			me._IFd/*init_f*/();
		},
		beforeclose: function(panel, opts) {
			if (panel.itemobj && panel.itemobj.instanceid)
			{
				var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
				lreq.init(panel,
					{
						ack: "77",
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid, action: "ref_down", instanceid: panel.itemobj.instanceid}, "uid;action;instanceid"),
						mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
					}, panel, function(xdoc) {
	
					}, false);
	
				lreq._l/*request*/();
			}
		}
	}
});



