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
/*
This file is part of INGECEP

Copyright (c) 2011-2013 INGECEP Inc

Contact:  http://www.ingecep.com/contact

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.ingecep.com/contact.

*/
IG$/*mainapp*/.M$dao/*datemetricobj*/ = function(xdoc) {
	var me = this,
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
		metainfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode),
		onode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/objinfo"),
		objinfo = (onode) ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(onode) : null;
		
	me.metainfo = metainfo || {};
	me.objinfo = objinfo || {};
	me.dateitems = [];
	me.datecustom = "";
};

IG$/*mainapp*/.M$dao/*datemetricobj*/.prototype = {
	gx/*getXML*/: function() {
		var me = this,
			r = "<smsg><item ";
		
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me.objinfo, "memo;name;type;uid", "s") +">";
		r += "<objinfo ";
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me.objinfo, "cubeuid;dateformat;fieldid;fieldname;dbtype", "s");
		r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me.objinfo, "issql;isdatetype;removeblank", "b");
		r += "/>";
		
		r += "</item></smsg>";
			
		return r;
	}
}

IG$/*mainapp*/.M$dam/*datemetric*/ = $s.extend($s.window, {
	
	modal: false,
	isWindow: true,
	region:'center',
	"layout": "fit",
	
	closable: false,
	resizable:false,
	width: 520,
	autoHeight: true,
	
	callback: null,
	
	_IFd/*init_f*/: function() {
		var me = this;
		me.setTitle(IRm$/*resources*/.r1('T_DM') + (me.name ? " (" + me.name + ")" : ""));
		
		if (me.uid)
		{
			me.sK5/*procLoadContent*/();
		}
	},
	
	sK5/*procLoadContent*/: function() {
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
		var me = this,
			objinfo,
			cbox;
		
		me.mobj = new IG$/*mainapp*/.M$dao/*datemetricobj*/(xdoc);
		objinfo = me.mobj.objinfo;
		objinfo.issql = objinfo.issql == "T" ? true : false;
		
		cbox = me.down("[name=rg_dateformatting]");
		cbox.setValue({dateformatting: (objinfo.issql ? "sqlfunc" : "formatting")});
		// me.down("[name=dbtype]").setValue(objinfo.dbtype || "auto");
		me.down("[name=dateformat]").setValue(objinfo.dateformat || "");
		me.down("[name=fieldname]").setValue(objinfo.fieldname || "");
		
		if (!objinfo.cubeuid)
		{
			me.k2/*getCubeInfo*/();
		}
		else
		{
			me.k1/*loadSubContent*/();
		}
	},
	
	k2/*getCubeInfo*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel,
			{
				ack: "11",
	            payload: '<smsg><item uid=\'' + this.uid + '\' parenttype="Cube;MCube;DataCube;SQLCube" read="F"/></smsg>',
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "parentcontent"})
			}, panel, panel.rs_k2/*getCubeInfo*/, null
		);
		
		req._l/*request*/();
	},
	
	rs_k2/*getCubeInfo*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			tinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
		
		me.mobj.objinfo.cubeuid = tinfo.uid;
		
		me.k1/*loadSubContent*/();
	},
	
	k1/*loadSubContent*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(panel, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({subfolder: "T", itemtype: "CustomMetric", readcontent: "T"})
	        }, panel, panel.rs_k1/*loadSubContent*/, null);
	    req._l/*request*/();
	},
	
	rs_k1/*loadSubContent*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			i,
			sitem, smeta,
			objinfo = me.mobj.objinfo,
			cnode, cinfo, custominfo = {},
			subitems = {},
			k, v;
		
		for (i=0; i < tnodes.length; i++)
		{
			smeta = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			sitem = IG$/*mainapp*/._I18/*XGetNode*/(tnodes[i], "Fields/item");
			if (sitem)
			{
				sitem = IG$/*mainapp*/._I1c/*XGetAttrProp*/(sitem);
				//if (sitem.uid == objinfo.fieldid)
				// {
					cnode = IG$/*mainapp*/._I18/*XGetNode*/(tnodes[i], "CustomMetricInfo");
					if (cnode)
					{
						cinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnode);
						cinfo.uid = smeta.uid;
						cinfo.name = smeta.name;
						cinfo.nodepath = smeta.nodepath;
						custominfo[cinfo.datedivision] = cinfo;
						
						if (cinfo.datedivision == "CUSTOM")
						{
							me.down("[name=customdatetype]").setValue(cinfo.customdatetype);
						}
					}
				// }
			}
		}
		
		me.custominfo = custominfo;
		
		for (k in custominfo)
		{
			me.down("[name=datediv_" + k + "]").setValue(true);
		}
	},
	
	l1/*layoutFormItems*/: function() {
		var me = this,
			mval = me.down("[name=dateformatting]").getGroupValue(),
			issql = (mval == "sqlfunc" ? true : false),
			ex_format1 = me.down("[name=ex_format1]"),
			ex_format2 = me.down("[name=ex_format2]"),
			i, item;
		
		// me.down("[name=btn_search]").setVisible(issql ? true : false);
		// me.down("[name=dbtype]").setVisible(issql ? true : false);
		for (i=0; i < ex_format1.menu.items.length; i++)
		{
			item = ex_format1.menu.items.items[i]; 
			item.setVisible(!item.issql || (item.issql == true && issql == true));
		}
		
		for (i=0; i < ex_format2.menu.items.length; i++)
		{
			item = ex_format2.menu.items.items[i]; 
			item.setVisible(!item.issql || (item.issql == true && issql == true));
		}
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
		
		this.callback && this.callback.execute();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			fieldname = me.down("[name=fieldname]");
		
		fieldname.clearInvalid();
		
		if (!me.mobj)
		{
			return;
		}
		
		if (!fieldname.getValue())
		{
			fieldname.markInvalid(IRm$/*resources*/.r1("B_REQUIRED"));
			return;
		}
		
		var i,
			dateformat = me.down("[name=dateformat]"),
			datemap = {},
			ndateitems = [],
			ditems,
			ditem,
			dateformatting = me.down("[name=dateformatting]"),
			mval = dateformatting.getGroupValue(),
			issql = (mval == "sqlfunc" ? true : false),
			mobj = me.mobj,
			objinfo = mobj.objinfo,
			dbtype = me.down("[name=dbtype]");
		
		objinfo.issql = issql; 
		objinfo.dateformat = dateformat.getValue();
		objinfo.dbtype = "auto"; // dbtype.getValue();
		
		// dbtype.clearInvalid();
		dateformatting.clearInvalid();
		
//		if (issql && !objinfo.dbtype)
//		{
//			dbtype.markInvalid(IRm$/*resources*/.r1("B_REQUIRED"));
//			return;
//		}
//		else 
		
		if (!objinfo.dateformat)
		{
			dateformatting.markInvalid(IRm$/*resources*/.r1("B_REQUIRED"));
			return;
		}
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		me.setLoading(true);
		
		req.init(me, 
			{
	            ack: "31",
	            payload: "<smsg><item uid='" + mobj.metainfo.uid + "' name='" + mobj.metainfo.name + "' type='" + mobj.metainfo.type + "' memo='" + objinfo.cubeuid + "' description=''/></smsg>",
	            mbody: mobj.gx/*getXML*/.call(mobj)
	        }, me, me.rs_f1/*writeContent*/);
	    req._l/*request*/();
	},
	
	rs_f1/*writeContent*/: function(xdoc) {
		var me = this,
			datenames = IG$/*mainapp*/._I4c/*majordateformat*/,
			dateformat = this.down("[name=dateformat]"),
			dname, dispname, iname,
			i,
			addr = [],
			cnt = [],
			n = 0,
			item,
			mobj = me.mobj,
			custominfo = me.custominfo,
			mval = me.down("[name=dateformatting]").getGroupValue(),
			issql = (mval == "sqlfunc" ? true : false);
			
		for (i=0; i < datenames.length; i++)
		{
			datenames[i].rname = datenames[i].rname || datenames[i].name;
			datenames[i].dname = IRm$/*resources*/.r1('B_' + datenames[i].rname);
		}
		
		addr.push("<smsg>");
		cnt.push("<smsg>");
		for (i=0; i < datenames.length; i++)
		{
			dname = datenames[i].name;
			dispname = datenames[i].dname || dname;
			cdatetype = "";
			if (me.down("[name=datediv_" + dname + "]").getValue() == true)
			{
				item = custominfo[dname];
				dispname = item ? item.name || dispname : dispname;
				
				if (dname == "CUSTOM")
				{
					cdatetype = me.down("[name=customdatetype]").getValue();
				}
				
				addr.push("<item " + IG$/*mainapp*/._I30/*getXMLAttr*/({
					uid: (item && item.uid ? item.uid : mobj.metainfo.nodepath + "/" + dispname),
					pid: me.uid,
					name: dispname,
					type: "CustomMetric"
				}) + "/>");
				
				cnt.push("<item " + IG$/*mainapp*/._I30/*getXMLAttr*/({
					uid: (item && item.uid ? item.uid : mobj.metainfo.nodepath + "/" + dispname),
					pid: me.uid,
					name: dispname,
					type: "CustomMetric"
				}) + ">");
				
				cnt.push("<Fields>");
				if (mobj.objinfo && mobj.objinfo.fieldid)
				{
					cnt.push("<item " + IG$/*mainapp*/._I30/*getXMLAttr*/({
						uid: mobj.objinfo.fieldid,
						name: mobj.objinfo.fieldname,
						nodepath: mobj.objinfo.fieldpath || "",
						type: "Metric"
					}) + "></item>");
					
				}
				else
				{
					cnt.push("<item " + IG$/*mainapp*/._I30/*getXMLAttr*/({
						uid: mobj.metainfo.uid,
						name: mobj.metainfo.name,
						nodepath: mobj.metainfo.nodepath,
						type: mobj.metainfo.type
					}) + "></item>");
				}
				cnt.push("</Fields>");
				cnt.push("<CustomMetricInfo " + IG$/*mainapp*/._I30/*getXMLAttr*/({
					datedivision: dname.toUpperCase(),
					dateformat: mobj.objinfo.dateformat,
					predefinetype: (issql == true ? "DATE" : ""),
					type: (issql == true ? "CUSTOM_FIELD" : "PREDEFINED_FIELD"),
					customdatetype: cdatetype
				}) + "></CustomMetricInfo>");
				cnt.push("<Expression>");
				cnt.push((issql == true ? me.gg/*getCustomExpression*/(dname) : "")); 
				cnt.push("</Expression>");
				
				cnt.push("</item>");
				
				n++;
			}
			else if (custominfo[dname])
			{
				item = custominfo[dname];
				addr.push("<item " + IG$/*mainapp*/._I30/*getXMLAttr*/({
					uid: item.uid,
					name: item.name,
					nodepath: item.nodepath
				}) + "/>");	
				cnt.push("<info " + IG$/*mainapp*/._I30/*getXMLAttr*/({
					option: "delete"
				}) + "/>");	
				n++;
			}
		}
		addr.push("</smsg>");
		cnt.push("</smsg>");
		
		if (n > 0)
		{
			var panel = this,
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
			req.init(panel, 
				{
		            ack: "30",
		            payload: addr.join(""),
		            mbody: cnt.join("")
		        }, panel, panel.rs_f2/*updateDateContent*/);
		    req._l/*request*/();
		}
		else
		{
			this.setLoading(false);
		}
	},
	
	rs_f2/*updateDateContent*/: function(xdoc) {
		var me = this;
		
		me.setLoading(false);
		
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
		
		me.sK5/*procLoadContent*/();
	},
	
	gg/*getCustomExpression*/: function(div) {
		var me = this,
			r = "",
			dbtype = "auto", // me.mobj.objinfo.dbtype,
			dname = div.toLowerCase(),
			dbformat = IG$/*mainapp*/._I4d/*sqldateformat*/[dbtype.toLowerCase()],
			dateformat = this.down("[name=dateformat]").getValue(),
			dfield = "";
		
		if (dbformat && dbformat[dname])
		{
			r = dbformat[dname];
			
			dfield = "[" + me.mobj.objinfo.fieldname + "]";
			
			if (dateformat == "EPOCH")
			{
				dfield = "FROM_UNIXTIME(" + dfield + ")";
			}
			
			r = r.replace(/_date_/g, dfield);
		}
		
		return r;
	},
	
	s1/*selectField*/: function() {
		var me = this,
			objinfo = me.mobj.objinfo;
		
		var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
			visibleItems: 'workspace;folder;metric;custommetric;measuregroupdimension',
			u5x/*treeOptions*/: {
				cubebrowse: true,
				rootuid: objinfo.cubeuid
			}
		});
		dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.P2C/*cubeSelectedHandler*/);
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	},
	
	P2C/*cubeSelectedHandler*/: function(item) {
		var me = this,
			objinfo = me.mobj.objinfo;
		
		objinfo.fieldid = item.uid;
		objinfo.fieldname = item.name;
		
		me.down("[name=fieldname]").setValue(objinfo.fieldname);
	},
	
	initComponent : function() {
		var me = this,
			panel = me;
			
		me.title = IRm$/*resources*/.r1('T_DM');
		
		$s.apply(this, {
			items: [
			    {
			    	xtype: "panel",
			    	bodyStyle: "padding:10px",
			    	border: 0,
			    	layout: {
			    		type: "vbox",
			    		align: "stretch"
			    	},
			    	items: [
		    	        {
	        	        	xtype: "fieldset",
	        	        	title: "Date Type",
	        	        	layout: {
	        	        		type: "vbox",
	        	        		align: "stretch"
	        	        	},
	        	        	items: [
	        	        		{
	        	        			xtype: "radiogroup",
	        	        			name: "rg_dateformatting",
	        	        			fieldLabel: "",
	        	        			vertical: true,
	        	        			items: [
	        	        				{
    	        	        				boxLabel: "Date Formatting",
    	        	        				name: "dateformatting",
    	        	        				inputValue: "formatting"
    	        	        			},
    	        	        			{
    	        	        				boxLabel: "SQL Functions",
    	        	        				name: "dateformatting",
    	        	        				inputValue: "sqlfunc"
    	        	        			}
	        	        			],
	        	        			listeners: {
	        	        				change: function() {
	        	        					this.l1/*layoutFormItems*/();
	        	        				},
	        	        				scope: this
	        	        			}
	        	        		}
	        	        	]
		    	        },
						{
					    	xtype: "fieldset",
					    	layout: "vbox",
					    	title: "Input Format",
					    	items: [
								{
						        	xtype: "fieldcontainer",
						        	layout: "hbox",
						        	fieldLabel: "Date Metric",
						        	items: [
						        	    {
						        	    	xtype: "textfield",
						        	    	name: "fieldname",
						        	    	readOnly: true
						        	    },
						        	    {
						        	    	xtype: "button",
						        	    	name: "btn_search",
						        	    	text: "..",
						        	    	handler: function() {
						        	    		this.s1/*selectField*/();
						        	    	},
						        	    	scope: this
						        	    }
						        	]
						        },
						        {
									xtype: "combobox",
									name: "dbtype",
									hidden: true,
									fieldLabel: "Database type",
									valueField: 'value',
									displayField: 'label',
									queryMode: "local",
									editable: false,
									store: {
										xtype: "store",
										fields: [
										     {name: "label"}, 
										     {name: "value"}
										],
										data: [
										    {label: "Select", value: ""},
										    {label: "Auto", value: "auto"},
										    {label: "MySQL", value: "mysql"},
										    {label: "Oracle", value: "oracle"}
										]
									}
								},
				    	        {
									xtype: "fieldcontainer",
									fieldLabel: "Date format",
									layout: {
										type: "hbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "textfield",
											name: "dateformat"
											// fieldLabel: "Date format"
										},
										{
											xtype: "button",
											text: "Example",
											name: "ex_format1",
											menu: {
												items: [
													{
														text: "2001.07.04 AM 12:08:56", 
														value: "yyyy.MM.dd a HH:mm:ss",
														handler: function() {
															var dateformat = panel.down("[name=dateformat]");
															dateformat.setValue(this.value);
														}
													},
													{
														text: "2001-07-04 AM 12:08:56", 
														value: "yyyy-MM-dd a HH:mm:ss",
														handler: function() {
															var dateformat = panel.down("[name=dateformat]");
															dateformat.setValue(this.value);
														}
													},
													{
														text: "Wed, Jul 4, '01", 
														value: "EEE, MMM d, ''yy",
														handler: function() {
															var dateformat = panel.down("[name=dateformat]");
															dateformat.setValue(this.value);
														}
													},
													{
														text: "20010704120856", 
														value: "yyyyMMddHHmmss",
														handler: function() {
															var dateformat = panel.down("[name=dateformat]");
															dateformat.setValue(this.value);
														}
													},
													{
												    	text: "DATE",
												    	value: "DATE",
												    	issql: true,
												    	hidden: true,
												    	handler: function() {
												    		var dateformat = panel.down("[name=dateformat]");
												    		dateformat.setValue(this.value);
												    	}
											        },
											        {
												    	text: "DATETIME",
												    	value: "DATETIME",
												    	issql: true,
												    	hidden: true,
												    	handler: function() {
												    		var dateformat = panel.down("[name=dateformat]");
												    		dateformat.setValue(this.value);
												    	}
											        },
											        {
												    	text: "TIMESTAMP",
												    	value: "TIMESTAMP",
												    	issql: true,
												    	hidden: true,
												    	handler: function() {
												    		var dateformat = panel.down("[name=dateformat]");
												    		dateformat.setValue(this.value);
												    	}
											        },
											        {
												    	text: "EPOCH time value",
												    	value: "EPOCH",
												    	issql: true,
												    	hidden: true,
												    	handler: function() {
												    		var dateformat = panel.down("[name=dateformat]");
												    		dateformat.setValue(this.value);
												    	}
											        }
												]
											}
										}
									]
				    	        },
							    {
							    	xtype: "fieldcontainer",
							    	fieldLabel: IRm$/*resources*/.r1('L_GROUP_LEVEL'),
									name: "datedivision",
									layout: {
										type: "vbox",
										align: "stretch"
									},
									defaults: {
										border: 0
									},
									border: 0,
									items: [
										{
											xtpe: "fieldcontainer",
											layout: {
												type: "hbox",
												align: "stretch"
											},
											defaults: {
												width: 120
											},
											items: [
												{
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1('B_YEAR'), 
													name: 'datediv_YYYY', 
													inputValue: 'YYYY'
												},
												{
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1('B_QUARTER'), 
													name: 'datediv_QUARTER', 
													inputValue: 'QUARTER'
												},
												{
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1('B_MONTH'), 
													name: 'datediv_MM', 
													inputValue: 'MM'
												}
											]
										},
										{
											xtpe: "fieldcontainer",
											layout: {
												type: "hbox",
												align: "stretch"
											},
											defaults: {
												width: 120
											},
											items: [
												{
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1('B_DAY'), 
													name: 'datediv_DD', 
													inputValue: 'DD'
												},
												{
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1('B_WEEKMONTH'), 
													name: 'datediv_WM', 
													inputValue: 'WM'
												},
												{
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1('B_WEEK'), 
													name: 'datediv_WEEK', 
													inputValue: 'WEEK'
												}
											]
										},
										{
											xtpe: "fieldcontainer",
											layout: {
												type: "hbox",
												align: "stretch"
											},
											defaults: {
												width: 120
											},
											items: [
												{
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1('B_AMPM'), 
													name: 'datediv_AMPM', 
													inputValue: 'AMPM'
												},
												{
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1('B_HOUR'), 
													name: 'datediv_HH', 
													inputValue: 'HH'
												},
												{
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1('B_MINUTE'), 
													name: 'datediv_MI', 
													inputValue: 'MI'
												}
											]
										},
										{
											xtpe: "fieldcontainer",
											layout: {
												type: "hbox",
												align: "stretch"
											},
											defaults: {
												width: 120
											},
											items: [
												{
													xtype: "checkbox",
													boxLabel: IRm$/*resources*/.r1('B_CUSTOM'), 
													name: 'datediv_CUSTOM', 
													inputValue: 'CUSTOM',
													
													listeners: {
														change: function(field, nvalue, ovalue, eOpt) {
															var datediv = field.getValue(),
																customdatetype = this.down("[name=customdatetypecontainer]");
															
															customdatetype.setVisible((datediv == true ? true : false));
														},
														scope: this
													}
												}
											]
										}
									]
							    },
							    {
									xtype: "fieldcontainer",
									fieldLabel: IRm$/*resources*/.r1('B_CUSTOM'),
									name: "customdatetypecontainer",
									layout: {
										type: "hbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "textfield",
											name: "customdatetype"
											// fieldLabel: "Date format"
										},
										{
											xtype: "button",
											text: "Example",
											name: "ex_format2",
											menu: {
												items: [
													{
														text: "2001.07.04 AM 12:08:56", 
														value: "yyyy.MM.dd a HH:mm:ss",
														handler: function() {
															var dateformat = panel.down("[name=customdatetype]");
															dateformat.setValue(this.value);
														}
													},
													{
														text: "2001-07-04 AM 12:08:56", 
														value: "yyyy-MM-dd a HH:mm:ss",
														handler: function() {
															var dateformat = panel.down("[name=customdatetype]");
															dateformat.setValue(this.value);
														}
													},
													{
														text: "Wed, Jul 4, '01", 
														value: "EEE, MMM d, ''yy",
														handler: function() {
															var dateformat = panel.down("[name=customdatetype]");
															dateformat.setValue(this.value);
														}
													},
													{
														text: "20010704120856", 
														value: "yyyyMMddHHmmss",
														handler: function() {
															var dateformat = panel.down("[name=customdatetype]");
															dateformat.setValue(this.value);
														}
													}
													
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
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this._IFf/*confirmDialog*/();
					},
					scope: this
				}, {
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
				},
				scope: this
			}
		});
		
		IG$/*mainapp*/.M$dam/*datemetric*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._If8/*clCustomMetric*/ = function() {
}

IG$/*mainapp*/._If8/*clCustomMetric*/.prototype = {
	m1$17/*parseContent*/: function(xdoc) {
		var me = this,
			rnode,
			fnode,
			enode,
			i, j,
			child,
			tnode,
			snode,
			mnode,
			tnodes;
		
		me.group = {
			groupmin: 0,
			groupmax: 0,
			stepinterval: 10,
			groupminlabel: "Under %MIN",
			groupmaxlabel: "Over %MAX",
			grouplabel: "%MIN - %MAX",
			groupformat: "#,###"
		};
		
		me.lnk = {
			l_tp: "DRILL",
			l_nm: null,
			l_elnk: null,
			l_elnk_tgt: null,
			l_rpt_name: null,
			l_rpt_uid: null,
			l_rpt_tmpl: null
		};
		
		me.objectinfo = {};
		me.cubeinfo = {
			styles: []	
		};
	
		rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		me.iteminfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(rnode);
		
		fnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/objinfo");
		
		if (fnode)
		{
			// cubeuid;fieldid;itemstyle
			me.objectinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(fnode);
		}
		
		fnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Fields");
		
		me.fields = [];
		
		child = IG$/*mainapp*/._I26/*getChildNodes*/(fnode);
		for (i=0; i < child.length; i++)
		{
			me.fields.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[i]));
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/cubeinfo");
		
		if (tnode)
		{
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "AppStyle/Default");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "appbase"
					});
				}
			}
			
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "AppStyle/Custom");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "appcustom"
					});
				}
			}
			
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "CubeStyle/Custom");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "cubestyle"
					});
				}
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "CustomMetricInfo");
		me.groupfilter = [];
		
		if (tnode)
		{
			me.metrictype = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "type");
			
			me.predefinetype = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "predefinetype");
			me.dateformat = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dateformat");
			me.datedivision = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "datedivision");
			me.customdatetype = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "customdatetype");
			
			var gnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "Filters");
			if (gnode)
			{
				var gchild = IG$/*mainapp*/._I26/*getChildNodes*/(gnode);
				for (i=0; i < gchild.length; i++)
				{
					var filter = {};
					filter.name = IG$/*mainapp*/._I1b/*XGetAttr*/(gchild[i], "title");
					filter.operator = IG$/*mainapp*/._I1b/*XGetAttr*/(gchild[i], "operator");
					filter.values = [];
					filter.value = "";
					var vnode = IG$/*mainapp*/._I18/*XGetNode*/(gchild[i], "Values");
					if (vnode)
					{
						var vchild = IG$/*mainapp*/._I26/*getChildNodes*/(vnode);
						
						for (j=0; j < vchild.length; j++)
						{
							var v = {code: null, value: null};
							
							var cnode = IG$/*mainapp*/._I18/*XGetNode*/(vchild[j], "code");
							
							if (cnode)
							{
								v.code = IG$/*mainapp*/._I24/*getTextContent*/(cnode);
							}
							
							cnode = IG$/*mainapp*/._I18/*XGetNode*/(vchild[j], "text");
							
							if (cnode)
							{
								v.text = IG$/*mainapp*/._I24/*getTextContent*/(cnode);
							}
							
							if (j == 0)
							{
								filter.value = v.text || v.code;
							}
							else
							{
								filter.value += "," + (v.text || v.code);
							}
							filter.values.push(v);
						}
					}
					me.groupfilter.push(filter);
				}
			}
			
			gnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "OtherGroupValue");
			me.othergroupvalue = IG$/*mainapp*/._I24/*getTextContent*/(gnode);
			
			var cnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "Expression");
			me.expression = IG$/*mainapp*/._I24/*getTextContent*/(cnode);
			
			gnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "geocode");
			
			if (gnode)
			{
				snode = IG$/*mainapp*/._I18/*XGetNode*/(gnode, "geolat");
				me.geolat = snode ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(snode) : null;
				
				snode = IG$/*mainapp*/._I18/*XGetNode*/(gnode, "geolng");
				me.geolng = snode ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(snode) : null;
			}
			
			gnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "grouping");
			
			if (gnode)
			{
				IG$/*mainapp*/._I1f/*XGetInfo*/(me.group, gnode, "groupmin;groupmax;stepinterval", "i");
				IG$/*mainapp*/._I1f/*XGetInfo*/(me.group, gnode, "groupminlabel;groupmaxlabel;grouplabel;groupformat", "s");
			}
			
			gnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "link");
			
			if (gnode)
			{
				me.lnk.l_tp = IG$/*mainapp*/._I1b/*XGetAttr*/(gnode, "type") || "DRILL";
				
				$.each(["l_nm", "l_rpt_tmpl", "l_elnk", "l_elnk_tgt", "l_rpt_name", "l_rpt_uid"], function(i, k) {
					me.lnk[k] = IG$/*mainapp*/._I1a/*getSubNodeText*/(gnode, k);
				});
			}
		}
	},
	
	TX/*getXML*/: function() {
		var me = this,
			i, j, gf, r;
		
		r = "<smsg><item uid='" + me.iteminfo.uid + "' name='" + me.iteminfo.name + "' type='" + me.iteminfo.type + "'>";
		if (me.objectinfo)
		{
			r += "<objinfo" + IG$/*mainapp*/._I21/*XUpdateInfo*/(me.objectinfo) + "/>";
		}
	 	r += "<Fields>";
			for (i=0; i < me.fields.length; i++)
			{
				r += "<item name='" + me.fields[i].name + "' uid='" + me.fields[i].uid + "' type='" + me.fields[i].type + "' nodepath='" + me.fields[i].nodepath + "'/>";
			}
			
			r += "</Fields>";
			r += "<CustomMetricInfo type='" + (me.metrictype || "") + "'";
			r += " predefinetype='" + (me.predefinetype || "") + "'";
			r += " dateformat='" + (me.dateformat || "") + "'";
			r += " datedivision='" + (me.datedivision || "") + "'";
			r += " customdatetype='" + (me.customdatetype || "") + "'";
			r += ">";
			if (me.groupfilter && me.groupfilter.length > 0)
			{
				r += "<Filters>";
				for (i=0; i < me.groupfilter.length; i++)
				{
					gf = me.groupfilter[i];
					r += "<Filter title='" + gf.name + "' operator='" + gf.operator + "'>";
					r += "<Values>";
					for (j=0; j < gf.values.length; j++)
					{
						if (gf.values[j].code || gf.values[j].text)
						{
							r += "<Value>";
							if (gf.values[j].code)
							{
								r += "<code><![CDATA[" + gf.values[j].code + "]]></code>";
							}
							if (gf.values[j].text)
							{
								r += "<text><![CDATA[" + gf.values[j].text + "]]></text>";
							}
							r += "</Value>";
						}
					}
					r += "</Values>";
					r += "</Filter>";
				}
				r += "</Filters>";
			}
			r += "<OtherGroupValue>" + (me.othergroupvalue || "") + "</OtherGroupValue>";
			
			r += "<geocode>";
			
			if (me.geolat && me.geolat.uid)
			{
				r += "<geolat" + IG$/*mainapp*/._I21/*XUpdateInfo*/(me.geolat, "uid;type;name") + "/>";
			}
			
			if (me.geolng && me.geolng.uid)
			{
				r += "<geolng" + IG$/*mainapp*/._I21/*XUpdateInfo*/(me.geolng, "uid;type;name") + "/>";
			}
			
			r += "</geocode>";
			
			if (me.group)
			{
				r += "<grouping ";
				r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me.group, "groupmin;groupmax;stepinterval", "i");
				r += IG$/*mainapp*/._I20/*XUpdateInfo*/(me.group, "groupminlabel;groupmaxlabel;grouplabel;groupformat", "s");
				r += "></grouping>";
			}
			
			if (me.lnk)
			{
				r += "<link type='" + (me.lnk.l_tp || "DRILL") + "'>";
				
				$.each(["l_nm", "l_rpt_tmpl", "l_elnk", "l_elnk_tgt", "l_rpt_name", "l_rpt_uid"], function(i, k) {
					if (me.lnk[k])
					{
						r += "<" + k + "><![CDATA[" + me.lnk[k] + "]]></" + k + ">";
					}
				});
				
				r += "</link>";
			}
			
			r += "</CustomMetricInfo>"; 
			r += "<Expression><![CDATA[" + (me.expression || "") + "]]></Expression>";
			
			r += "</item></smsg>";
				
		return r;
	}
}

IG$/*mainapp*/._Ifa/*custommetricinner*/ = $s.extend($s.formpanel, {
	uid: this.uid,
	
	bodyBorder: false,
	
	"layout": "fit",
		
	lX/*loadedItem*/: {},
	
	_ILa/*reportoption*/: this._ILa/*reportoption*/,
	
	cdt/*changeDateFormat*/: function() {
		var me = this,
			optdateformat = me.down("[name=optdateformat]"),
			dateformat = me.down("[name=dateformat]"),
			dt = optdateformat.getValue();
			
		dateformat.setValue(dt);
	},
	
	_IFe/*initF*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			optdateformat = panel.down("[name=optdateformat]"),
			metrictype = panel.down("[name=metrictype]");
			
		optdateformat.on("change", 
			function(field, newvalue, oldvalue, opts) {
				panel.cdt/*changeDateFormat*/.call(panel);
			}
		);
		
		metrictype.setValue("CUSTOM_FIELD");
		
		metrictype.on("change", function(field, newvalue, oldvalue) {
			var tabpanel = panel.ownerCt.down("[name=meT]"),
				metrictype = panel.down("[name=metrictype]"),
				sel = metrictype.getValue();
				
			if (tabpanel && sel)
			{
				switch (sel)
				{
				case "CUSTOM_FIELD":
					tabpanel.getLayout().setActiveItem(0);
					break;
				case "GROUP_FIELD":
					tabpanel.getLayout().setActiveItem(1);
					break;
				case "PREDEFINED_FIELD":
					tabpanel.getLayout().setActiveItem(2);
					panel.mu$10/*updateDateFormat*/();
					break;
				case "GEO_FIELD":
					tabpanel.getLayout().setActiveItem(3);
					break;
				case "RANGE_FIELD":
					tabpanel.getLayout().setActiveItem(4);
					break;
				case "LINK_FIELD":
					tabpanel.getLayout().setActiveItem(5);
					break;
				}
			}
		});
		
		req.init(panel, 
			{
                ack: "5",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid}),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "diagnostics"})
            }, panel, panel.rs_sK5/*procLoadContent*/, null);
        req._l/*request*/();
	},
	
	rs_sK5/*procLoadContent*/: function(xdoc) {
		var me = this,
			dp = [],
			i, item,
			optstyle = me.down("[name=optstyle]");
		
		item = me.clItem = new IG$/*mainapp*/._If8/*clCustomMetric*/();
		me.clItem.m1$17/*parseContent*/(xdoc);
		
		dp.push({disp: "--- select ---", name: "", type: ""});
		
		for (i=0; i < item.cubeinfo.styles.length; i++)
		{
			dp.push({disp: item.cubeinfo.styles[i].name, name: item.cubeinfo.styles[i].name, type: item.cubeinfo.styles[i].type});
		}
		optstyle.store.loadData(dp);
		optstyle.setValue(item.objectinfo.itemstyle || "");
		
		me.m1$18/*getParentCube*/();
		
		if (item.lnk.l_rpt_uid)
		{
			me.rL/*loadTemplate*/(item.lnk.l_rpt_uid);
		}
	},
	
	rL/*loadTemplate*/: function(uid) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
                ack: "5",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "diagnostics"})
            }, me, function(xdoc) {
            	var me = this,
            		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
            		enode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/ExportOption/otmpl"),
            		enodes, i, p,
            		l_rpt_tmpl = me.down("[name=l_rpt_tmpl]"),
            		dp = [{disp: "Select Item", seq: ""}];
            	
            	if (enode)
            	{
            		enodes = IG$/*mainapp*/._I26/*getChildNodes*/(enode);
            		
            		for (i=0; i < enodes.length; i++)
            		{
            			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(enodes[i]);
            			p.disp = p.name + (p.description ? "-" + p.description + " " : " ") + (p.export_type ? "(" + p.export_type + ")" : "");
            			p.seq = "" + i;
            			dp.push(p);
            		}
            	}
            	
            	l_rpt_tmpl.store.loadData(dp);
            	l_rpt_tmpl.setValue(me.clItem && me.clItem.lnk ? me.clItem.lnk.l_rpt_tmpl || "" : "");
            	
            }, null);
        req._l/*request*/();
	},
	
	mu$10/*updateDateFormat*/: function() {
		var me = this,
			panel = me,
			fields = (me.clItem) ? me.clItem.fields : null,
			metrictype = me.down("[name=metrictype]"),
			sel = metrictype.getValue(),
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			i;
			
		if (fields && fields.length > 0 && sel && sel == "PREDEFINED_FIELD")
		{
			if (me.lX/*loadedItem*/ && me.lX/*loadedItem*/[fields[0].uid])
			{
				me.mU$10/*applyDateFormat*/(me.lX/*loadedItem*/[fields[0].uid]);
			}
			else
			{
				req.init(panel, 
					{
		                ack: "5",
		                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: fields[0].uid, type: fields[0].type, nodepath: fields[0].nodepath}),
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
		            }, panel, panel.rs_mu$10/*updateDateFormat*/, null);
		        req._l/*request*/();
		    }
		}
	},
	
	rs_mu$10/*updateDateFormat*/: function(xdoc) {
		var me = this,
			t = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			objectinfo = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/objinfo"),
			dateformat,
			uid;
		
		if (objectinfo)
		{
			uid = IG$/*mainapp*/._I1b/*XGetAttr*/(t, "uid");
			dateformat = IG$/*mainapp*/._I1b/*XGetAttr*/(objectinfo, "dateformat");
			me.lX/*loadedItem*/[uid] = {uid: uid, dateformat: dateformat};
			
			me.mU$10/*applyDateFormat*/(me.lX/*loadedItem*/[uid]);
		}
	},
	
	mU$10/*applyDateFormat*/: function(df)
	{
		var me = this,
			dateformat = me.down("[name=dateformat]"),
			mdf = dateformat.getValue();
		
		if (df.dateformat != "" && (mdf == "" || mdf != df.dateformat))
		{
			dateformat.setValue(df.dateformat);
		}
	},
	
	m1$18/*getParentCube*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel,
			{
				ack: "11",
                payload: "<smsg><item uid='" + this.uid + "' parenttype='Cube;MCube;DataCube;SQLCube' read='F'/></smsg>",
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "parentcontent"})
			}, panel, panel.rs_getParentcube, null
		);
		
		req._l/*request*/();
	},
	
	rs_getParentcube: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			cnode;
		
		if (tnode)
		{
			cnode = IG$/*mainapp*/._I17/*getFirstChild*/(tnode);
			
			if (cnode)
			{
				me.cubeuid = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, "uid");
			}
		}
		
		switch (me.clItem.metrictype)
		{
		case "CUSTOM_FIELD":
			me.down("[name=metrictype]").setValue("CUSTOM_FIELD");
			break;
		case "GROUP_FIELD":
			me.down("[name=metrictype]").setValue("GROUP_FIELD");
			break;
		case "PREDEFINED_FIELD":
			me.down("[name=metrictype]").setValue("PREDEFINED_FIELD");
			break;
		case "GEO_FIELD":
			me.down("[name=metrictype]").setValue("GEO_FIELD");
			break;
		case "RANGE_FIELD":
			me.down("[name=metrictype]").setValue("RANGE_FIELD");
			break;
		case "LINK_FIELD":
			me.down("[name=metrictype]").setValue("LINK_FIELD");
			break;
		}
		
		IG$/*mainapp*/._I2c/*setFieldValue*/(me, "expression", "s", me.clItem.expression || "");
		IG$/*mainapp*/._I2c/*setFieldValue*/(me, "datagrid", "dg", me.clItem.fields);
		IG$/*mainapp*/._I2c/*setFieldValue*/(me, "groupdatagrid", "dg", me.clItem.groupfilter);
		IG$/*mainapp*/._I2c/*setFieldValue*/(me, "groupfielditem", "s", (me.clItem.fields.length > 0) ? me.clItem.fields[0].name : "");
		IG$/*mainapp*/._I2c/*setFieldValue*/(me, "predefinefield", "s", (me.clItem.fields.length > 0) ? me.clItem.fields[0].name : "");
		IG$/*mainapp*/._I2c/*setFieldValue*/(me, "rangefield", "s", (me.clItem.fields.length > 0) ? me.clItem.fields[0].name : "");
		
		var sortorder = me.clItem.objectinfo.sortorder || "",
			sorttype = me.clItem.objectinfo.sorttype || "",
			optsortdir = me.down("[name=optsortdir]"),
			optsorttype = me.down("[name=optsorttype]");
		
		optsortdir.setValue({cb_sortdir: [sortorder]});
		optsorttype.setValue({cb_sorttype: [sorttype]});
		
		var dateformat = me.down("[name=dateformat]"),
			optdateformat = me.down("[name=optdateformat]"),
			datedivision = me.down("[name=datedivision]"),
			customdatetype = me.down("[name=customdatetype]"),
			othergroupvalue = me.down("[name=othergroupvalue]");
		
		optdateformat.setValue(me.clItem.dateformat || "");
		dateformat.setValue(me.clItem.dateformat || "");
		datedivision.setValue({datediv: me.clItem.datedivision});
		customdatetype.setValue(me.clItem.customdatetype || "");
		othergroupvalue.setValue(me.clItem.othergroupvalue);
		me.down("[name=geolat]").setValue(me.clItem.geolat ? me.clItem.geolat.name : "");
		me.down("[name=geolng]").setValue(me.clItem.geolng ? me.clItem.geolng.name : "");
		me.down("[name=cmap_disp]").setValue(me.clItem.objectinfo.cmap_disp || "");
		
		me.f_ = "groupmin;groupmax;stepinterval;groupminlabel;groupmaxlabel;grouplabel;groupformat".split(";");
		
		$.each(me.f_, function(i, k) {
			var ctrl = me.down("[name=" + k + "]");
			ctrl.setValue(me.clItem.group[k]);
		});
		
		if (me.clItem.lnk)
		{
			$.each(["l_tp", "l_nm", "l_rpt_tmpl", "l_elnk", "l_elnk_tgt", "l_rpt_name", "l_rpt_uid"], function(i, k) {
				var ctrl = me.down("[name=" + k + "]");
				ctrl.setValue(me.clItem.lnk[k]);
			});
		}
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			clItem = me.clItem,
			optsortdir = me.down("[name=cb_sortdir]"),
			sortorder = optsortdir.getGroupValue(),
			cb_sorttype = me.down("[name=cb_sorttype]"),
			sorttype = me.down("[name=cb_sorttype]").getGroupValue(),
			xdoc, i, groupdatagrid = me.down("[name=groupdatagrid]"),
			datagrid = me.down("[name=datagrid]"),
			groupfilterstore = groupdatagrid.store, 
			storeitem, gfilter, operator, key,
			d, field;
		
		clItem.objectinfo.sortorder = (sortorder == "") ? null : sortorder;
		clItem.objectinfo.sorttype = (sorttype == "") ? null : sorttype;
		clItem.expression = me.down("[name=expression]").getValue();
		clItem.metrictype = me.down("[name=metrictype]").getValue();
		clItem.dateformat = me.down("[name=dateformat]").getValue();
		clItem.datedivision = me.down("[name=datedivision]").getValue().datediv;
		clItem.othergroupvalue = me.down("[name=othergroupvalue]").getValue();
		clItem.customdatetype = me.down("[name=customdatetype]").getValue();
		clItem.objectinfo.itemstyle = me.down("[name=optstyle]").getValue();
		
		clItem.groupfilter = [];
		
		for (i=0; i < groupfilterstore.data.items.length; i++)
		{
			storeitem = groupfilterstore.data.items[i];
			gfilter = {name: storeitem.get("name"), values: []};
			gfilter.operator = storeitem.get("operator");
			gfilter.values = storeitem.data.values;
			clItem.groupfilter.push(gfilter);
		}
		
		if (clItem.metrictype == "CUSTOM_FIELD")
		{
			me.clItem.fields = [];
			for (i=0; i < datagrid.store.data.items.length; i++)
			{
				d = datagrid.store.data.items[i].data;
				field = {uid: d.uid, name: d.name, nodepath: d.nodepath, memo: d.memo, type: d.type};
				me.clItem.fields.push(field);
			}
		}
		
		$.each(me.f_, function(i, k) {
			var ctrl = me.down("[name=" + k + "]");
			me.clItem.group[k] = ctrl.getValue();
		});
		
		me.clItem.lnk = me.clItem.lnk || {};
		
		$.each(["l_tp", "l_nm", "l_rpt_tmpl", "l_elnk", "l_elnk_tgt", "l_rpt_name", "l_rpt_uid"], function(i, k) {
			var ctrl = me.down("[name=" + k + "]");
			me.clItem.lnk[k] = ctrl.getValue();
		});
		
		xdoc = me.clItem.TX/*getXML*/();
		
		me.sK6/*saveContent*/(me.uid, xdoc);
	},
	
	sK6/*saveContent*/: function(uid, doc) {
    	var panel = this;
    	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	req.init(panel, 
			{
	            ack: "31",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
	            mbody: doc
	        }, panel, panel.rs_sK6/*saveContent*/, null);
		req._l/*request*/();
    },
	
	rs_sK6/*saveContent*/: function(xdoc) {
		var panel = this;
		
    	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
    	
    	panel.wd._IG0/*closeDlgProc*/.call(panel.wd);
    },
	
	selectItem: function(fieldname) {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
				multiselect: fieldname == "customfield" ? 1 : 0,
				visibleItems: fieldname == "codemap" ? "workspace;folder;codemap" : "workspace;folder;metric;tabdimension;measuregroupdimension;custommetric",
				u5x/*treeOptions*/: {
					cubebrowse: true,
					rootuid: fieldname == "codemap" ? "/SYS_Lookup" : me.cubeuid
				},
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.P2C/*cubeSelectedHandler*/, fieldname)
			});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlgitemsel);
	},
	
	s2/*selectReport*/: function(fieldname) {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
				multiselect: 0,
				visibleItems: "workspace;folder;report",
				u5x/*treeOptions*/: {
					rootuid: null
				},
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
					var me = this;
					
					if (fieldname == "l_rpt")
					{
						me.down("[name=l_rpt_uid]").setValue(item.uid);
						me.down("[name=l_rpt_name]").setValue(item.name);
						
						me.rL/*loadTemplate*/(item.uid);
					}
				})
			});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlgitemsel);
	},
	
	P2C/*cubeSelectedHandler*/: function(items, fieldname) {
		var me = this,
			item = (fieldname == "customfield" ? null : items);
		
		if (fieldname == "geolat" || fieldname == "geolng")
		{
			if (fieldname == "geolat")
			{
				me.clItem.geolat = {
					uid: item.uid,
					name: item.name
				};
				me.down("[name=geolat]").setValue(item.name);
			}
			else if (fieldname == "geolng")
			{
				me.clItem.geolng = {
					uid: item.uid,
					name: item.name
				};
				me.down("[name=geolng]").setValue(item.name);
			}
		}
		else if (fieldname == "customfield")
		{
			var datagrid = me.down("[name=datagrid]"),
				i,
				rec,
				bexist = false;
			
			$.each(items, function(k, item) {
				var i,
					rec,
					bexist = false;
				
				for (i=0; i < datagrid.store.data.items.length; i++)
				{
					rec = datagrid.store.data.items[i];
					if (rec.get("uid") == item.uid)
					{
						bexist = true;
						break;
					}
				}
				
				if (bexist == false)
				{
					datagrid.store.add(item);
				}
			});
		}
		else if (fieldname == "codemap")
		{
			me.clItem.objectinfo.cmap_uid = item.uid;
			me.clItem.objectinfo.cmap_disp = item.name;
			me.down("[name=cmap_disp]").setValue(item.name);
		}
		else
		{
			if (me.clItem.fields.length > 0)
				me.clItem.fields[0] = item;
			else
				me.clItem.fields.push(item);
				
			IG$/*mainapp*/._I2c/*setFieldValue*/(me, fieldname, "s", item.name);
			
			me.mu$10/*updateDateFormat*/();
		}
	},
	
	m1$19/*addBlankCondition*/: function() {
		var me = this,
			dfilter = {},
			groupdatagrid = me.down("[name=groupdatagrid]"),
			groupdatagridstore = groupdatagrid.store;
		groupdatagridstore.add(dfilter);
	},
	
	m1$20/*editFilter*/: function(filter, record) {
		var me = this;
		
		if (me.clItem.fields.length > 0)
		{
			var field = me.clItem.fields[0];
			var vs = new IG$/*mainapp*/._Iac/*valueSelectWindow*/({
				field: field,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_m1$20/*editFilter*/, [filter, record])
			});
			
			vs.show();
		}
	},
	
	rs_m1$20/*editFilter*/: function(selvalues, param) {
		var filter = param[0],
			record = param[1],
			value = "",
			i;
		
		filter.values = selvalues;
		
		for (i=0; i < selvalues.length; i++)
		{
			value += (i==0) ? (selvalues[i].text || selvalues[i].code) : ", " + (selvalues[i].text || selvalues[i].code);  
		}
		
		record.set("value", value);
	},
	
	mU$1/*editorItemName*/: function(itemname) {
		var me = this,
			expression = me.down("[name=expression]"),
			el = expression.inputEl.dom,
			v = expression.getRawValue(),
			s1 = -1,
			s2 = -1, sel, i;
			
		itemname = "[" + itemname + "]";
		
		if (v.length > 0)
		{
			var sm1 = -1,
				sm2 = -1;
					
			sel = $(el).getSelection();
			if (sel.length == 0)
			{
				// check if inside block and replace
				for (i=sel.start; i >= 0; i--)
				{
					if (v.charAt(i) == "[")
					{
						sm1 = i;
						break;
					}
					else if (v.charAt(i) == "]" || v.charAt(i) == ")" || v.charAt(i) == "(")
					{
						break;
					}
				}
				
				if (sm1 > -1)
				{
					for (i=sel.end; i < v.length; i++)
					{
						if (v.charAt(i) == "]")
						{
							sm2 = i+1;
							break;
						}
						else if (v.charAt(i) == "[" || v.charAt(i) == ")" || v.charAt(i) == "(")
						{
							break;
						}
					}
				}
			}
			else if (sel.start - 1 > -1 && sel.end < v.length && v.charAt(sel.start-1) == "[" && v.charAt(sel.end) == "]")
			{
				sel.start -= 1;
				sel.end += 1;
			}
			
			if (sm1 == -1 || sm2 == -1)
			{
				sm1 = sel.start;
				sm2 = sel.end;
			}
			
			// replace selection
			v = v.substring(0, sm1) + itemname + v.substring(sm2, v.length);
			s1 = sm1;
			s2 = sm1 + itemname.length;
		}
		else
		{
			v = itemname;
			s1 = 0;
			s2 = v.length;
		}
		
		expression.setValue(v);
		
		if (s1 > -1 && s2 > s1)
		{
			expression.selectText(s1, s2);
		}
	},
	
	initComponent: function() {
		this.items = [
			{
				xtype: "tabpanel",
				items: [
					{
						xtype: "form",
						"layout": {
							type: "vbox",
							align: "stretch"
						},
						title: "General Options",
						bodyStyle: "padding: 5px",
						
						items: [
							{
								name: "metrictype",
								xtype: "combobox",
								fieldLabel: "Metric Type",
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
										{name: IRm$/*resources*/.r1("L_CUSTOM_FIELD"), value: "CUSTOM_FIELD"},
										{name: IRm$/*resources*/.r1("L_GROUP_FIELD"), value: "GROUP_FIELD"},
										{name: IRm$/*resources*/.r1("L_PREDEFINED_FIELD"), value: "PREDEFINED_FIELD"},
										{name: IRm$/*resources*/.r1("L_GEO_FIELD"), value: "GEO_FIELD"},
										{name: IRm$/*resources*/.r1("L_RANGE_FIELD"), value: "RANGE_FIELD"},
										{name: IRm$/*resources*/.r1("L_LINK_FIELD"), value: "LINK_FIELD"}
									]
								}
							},
							{
								xtype: "panel",
								name: "meT",
								activeTab: 0,
								flex: 1,
								headerPosition: "right",
								tabPosition: "bottom",
								preventHeader: true,
								plain: true,
								"layout": "card",
								activeItem: 0,
								
								defaults: {
									bodyPadding: 10
								},
								items: [
									{
										xtype: "panel",
										border: false,
										// title: IRm$/*resources*/.r1("L_CUSTOM_FIELD"),
										defaultType: "textfield",
										"layout": {
											type: "vbox",
											align: "stretch"
										},
										defaults: {
											anchor: "100%"
										},
										fieldDefaults: {
											labelWidth: 60
										},
										items: [
											{
												name: "expression",
												labelWidth: 60,
												fieldLabel: IRm$/*resources*/.r1("L_SYNTAX"),
												xtype: "textarea"
											},
											{
												xtype: "displayfield",
												value: IRm$/*resources*/.r1("L_CM_DISP_1")
											},
											{
												xtype: "gridpanel",
												flex: 1,
												store: {
													fields: [
														{name: "name"},
														{name: "type"},
														{name: "delete"},
														{name: "nodepath"},
														{name: "uid"},
														{name: "memo"}
													]
												},
												name: "datagrid",
												stateful: true,
												height: 120,
												columns: [
													{
														text: IRm$/*resources*/.r1("B_NAME"),
														flex: 1,
														sortable: false,
														dataIndex: "name"
													},
													{
														text: IRm$/*resources*/.r1("B_TYPE"),
														flex: 1,
														sortable: false,
														dataIndex: "type"
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
																	var store = grid.store,
																		rec = store.getAt(rowIndex);
																	store.removeAt(rowIndex);
																}
															}
														]
													}
												],
												viewConfig: {
													stripeRows: true,
													plugins: {
														ptype: "gridviewdragdrop",
														ddGroup: "_I$RD_G_"
													},
													listeners: {
														beforedrop: function(node, data, dropRec, dropPosition, dropFunction) {
															var r = false,
																index,
																i, bexist = false,
																rc = (data.records && data.records.length > 0) ? data.records[0] : null,
																typename = (rc) ? rc.get("type") : null, 
																item;
																
															(this == data.view) ? data.copy = false : data.copy = true;
															
															index = (dropRec) ? this.panel.store.indexOf(dropRec) : 0;
																
															if (typename == "Metric")
															{
																for (i=0; i < this.store.data.items.length; i++)
																{
																	item = this.store.data.items[i];
																	if (item.get("uid") == rc.data.uid)
																	{
																		bexist = true;
																		break;
																	}
																}
																
																if (bexist == false)
																{
																	this.store.add(rc.data);
																}
															}
																
															return r;
														},
														
														drop: function(node, data, dropRec, dropPosition) {
															var dropOn = dropRec ? " " + dropPosition + " " + dropRec.get("name") : " on empty view";
															return false;
														}
													}
												},
												
												listeners: {
													itemdblclick: function(view, record, item, index, event, Option) {
														this.mU$1/*editorItemName*/(record.data.name);
													},
													scope: this
												}
											},
											{
												xtype: "container",
												layout: {
													type: "hbox"
												},
												items: [
													{
														xtype: "displayfield",
														flex: 1,
														value: IRm$/*resources*/.r1("L_CD_DISP_2")
													},
													{
														xtype: "button",
														text: "Add",
														handler: function() {
															this.selectItem("customfield");
														},
														scope: this
													}
												]
											}
										]
									}, 
									{
										xtype: "panel",
										border: false,
										// title: IRm$/*resources*/.r1("L_GROUP_FIELD"),
										"layout": {
											type: "vbox",
											align: "stretch"
										},
										items: [
											{
												xtype: "fieldcontainer",
												"layout": {
													type: "hbox",
													align: "stretch"
												},
												fieldLabel: IRm$/*resources*/.r1("L_BASE_METRIC"),
												items: [
													{
														xtype: "textfield",
														hideLabel: true,
														flex: 1,
														name: "groupfielditem",
														allowBlack: false
													},
													{
														xtype: "button",
														text: "..",
														handler:function() {
															this.selectItem("groupfielditem");
														},
														scope: this
													}
												]
												
											},
											{
												xtype: "container",
												flex: 1,
												layout: {
													type: "hbox",
													align: "stretch"
												},
												items: [
													{
														xtype: "grid",
														flex: 1,
														store: {
															fields: [
																{name: "name"},
																{name: "operator"},
																{name: "opname"},
																{name: "value"},
																{name: "values"},
																{name: "delete"}
															]
														},
														name: "groupdatagrid",
														stateful: true,
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
																sortable: false,
																dataIndex: "name",
																field: {
																	allowBlank: false
																}
															},
															{
																text: IRm$/*resources*/.r1("L_CONDITION"),
																flex: 1,
																sortable: false,
																dataIndex: "operator",
																field: {
																	xtype: "combobox",
																	queryMode: "local",
																	displayField: "name",
																	labelField: "name",
																	valueField: "value",
																	editable: false,
																	autoSelect: true,
																	store: {
																		fields: [
																			"name", "value"
																		],
																		data: [
																			{name: "Like", value: "like"},
																			{name: "=", value: "eq"},
																			{name: ">", value: "gt"},
																			{name: "<", value: "lt"},
																			{name: ">=", value: "gte"},
																			{name: "<=", value: "lte"},
																			{name: "In", value: "in"},
																			{name: "Except", value: "except"}
																		]
																	}
																}
															},
															{
																text: IRm$/*resources*/.r1("B_VALUE"),
																flex: 1,
																sortable: false,
																dataIndex: "value",
																editor: {
																	clickToEdit: false,
																	isvalue: true
																}
															},
															{
																xtype: "actioncolumn",
																width: 50,
																items: [
																	{
																		// icon: "./images/delete.png",
																		iconCls: "icon-grid-delete",
																		tooltip: IRm$/*resources*/.r1("L_REMOVE"),
																		handler: function (grid, rowIndex, colIndex) {
																			var store = grid.store,
																				rec = store.getAt(rowIndex);
																			store.removeAt(rowIndex);
																		},
																		scope: this
																	},
																	{
																		// icon: "./images/gears.gif",
																		iconCls: "icon-grid-config",
																		tooltip: IRm$/*resources*/.r1("L_EDIT"),
																		handler: function (grid, rowIndex, colIndex) {
																			var store = grid.store,
																				rec = store.getAt(rowIndex);
																			this.m1$20/*editFilter*/(rec.data, rec);
																		},
																		scope: this
																	}
																]
															}
														],
														viewConfig: {
															stripeRows: true
														},
														listeners: {
															itemdblclick: function(view, record, item, index, ev) {
																var filter = record.data,
																	op = record.get("operator");
																
																if (filter && (op == "in" || op == "except"))
																{
																	this.m1$20/*editFilter*/(filter, record);
																}
															},
															edit: function(editor, e) {
																var grd = editor.grid,
																	record = grd.store.data.items[e.rowIdx],
																	i, t, evalue;
																
																if (e.colIdx == 2)
																{
																	record.data.values = [];
																	evalue = e.value.split(",");
																	for (i=0; i < evalue.length; i++)
																	{
																		t = IG$/*mainapp*/.trim12(evalue[i]);
																		if (t)
																		{
																			record.data.values.push({code: t, text: t});
																		}
																	}
																}
															},
															scope: this
														}
													},
													{
														xtype: "fieldcontainer",
														"layout": {
															type: "vbox",
															pack: "center"
														},
														items: [
															{
																xtype: "button",
																iconCls: "icon-toolbar-add",
																tooltip: IRm$/*resources*/.r1("L_ADD_CONDITION"),
																handler: function() {
																	this.m1$19/*addBlankCondition*/();
																},
																scope: this
															},
															{
																xtype: "button",
																iconCls: "icon-toolbar-moveup",
																tooltip: "Move Up",
																handler: function() {
																	var groupdatagrid = this.down("[name=groupdatagrid]"),
																		sel = groupdatagrid.getSelectionModel().getSelection(),
																		rec, ri;
																	
																	if (sel && sel.length == 1)
																	{
																		rec = sel[0];
																		ri = groupdatagrid.store.indexOf(rec);
																		if (ri > 0)
																		{
																			groupdatagrid.store.remove(rec);
																			groupdatagrid.store.insert(ri-1, rec);
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
																	var groupdatagrid = this.down("[name=groupdatagrid]"),
																		sel = groupdatagrid.getSelectionModel().getSelection(),
																		rec, ri;
																	
																	if (sel && sel.length == 1)
																	{
																		rec = sel[0];
																		ri = groupdatagrid.store.indexOf(rec);
																		if (ri+1 < groupdatagrid.store.data.items.length)
																		{
																			groupdatagrid.store.remove(rec);
																			groupdatagrid.store.insert(ri+1, rec);
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
												xtype: "textfield",
												name: "othergroupvalue",
												fieldLabel: IRm$/*resources*/.r1("L_OTHER_VALUE")
											}
										]
									}, 
									{
										xtype: "panel",
										border: false,
										// title: IRm$/*resources*/.r1("L_PREDEFINED_FIELD"),
										defaultType: "textfield",
										"layout": "anchor",
										defaults: {
											anchor: "100%"
										},
										items: [
											{
												xtype: "fieldcontainer",
												"layout": {
													type: "hbox"
												},
												fieldLabel: IRm$/*resources*/.r1("L_BASE_METRIC"),
												items: [
													{
														xtype: "textfield",
														hideLabel: true,
														name: "predefinefield",
														allowBlack: false
													}, 
													{
														xtype: "button",
														text: "..",
														handler:function() {
															this.selectItem("predefinefield");
														},
														scope: this
													}
												]
											},
											{
												xtype: "fieldcontainer",
												title: IRm$/*resources*/.r1("L_DATE_OPTION"),
												defaultType: "textfield",
												"layout": "anchor",
												defaults: {
													anchor: "100%"
												},
								
												items: [
													{
														xtype: "combobox",
														name: "optdateformat",
														fieldLabel: "Date format example",
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
																{name: "Select", value: ""},
																{name: "2001.07.04 AM 12:08:56", value: "yyyy.MM.dd a HH:mm:ss"},
																{name: "2001-07-04 12:08:56", value: "yyyy-MM-dd HH:mm:ss"},
																{name: "2001-07-04 AM 12:08", value: "yyyy-MM-dd a HH:mm"},
																{name: "Wed, Jul 4, '01", value: "EEE, MMM d, ''yy"},
																{name: "20010704120856", value: "yyyyMMddHHmmss"}
															]
														}
													},
													{
														name: "dateformat",
														fieldLabel: IRm$/*resources*/.r1("L_DATE_FORMAT"),
														xtype: "textfield",
														value: ""
													},
													{
														fieldLabel: IRm$/*resources*/.r1("L_GROUP_LEVEL"),
														name: "datedivision",
														xtype: "radiogroup",
														columns: 3,
														$h: 120,
														plain: true,
														items: [
															{
																boxLabel: IRm$/*resources*/.r1("B_YEAR"), name: "datediv", inputValue: "YYYY", checked: true
															},
															{
																boxLabel: IRm$/*resources*/.r1("B_QUARTER"), name: "datediv", inputValue: "QUARTER"
															},
															{
																boxLabel: IRm$/*resources*/.r1("B_MONTH"), name: "datediv", inputValue: "MM"
															},
															{
																boxLabel: IRm$/*resources*/.r1("B_DAY"), name: "datediv", inputValue: "DD"
															},
															{
																boxLabel: IRm$/*resources*/.r1("B_WEEKMONTH"), name: "datediv", inputValue: "WM"
															},
															{
																boxLabel: IRm$/*resources*/.r1("B_WEEK"), name: "datediv", inputValue: "WEEK"
															},
															{
																boxLabel: IRm$/*resources*/.r1("B_AMPM"), name: "datediv", inputValue: "AMPM"
															},
															{
																boxLabel: IRm$/*resources*/.r1("B_HOUR"), name: "datediv", inputValue: "HH"
															},
															{
																boxLabel: IRm$/*resources*/.r1("B_MINUTE"), name: "datediv", inputValue: "MI"
															},
															{
																boxLabel: IRm$/*resources*/.r1("B_CUSTOM"), name: "datediv", inputValue: "CUSTOM"
															}
														],
														listeners: {
															change: function(field, nvalue, ovalue, eOpt) {
																var datediv = field.getValue().datediv,
																	customdatetype = this.down("[name=customdatetype]");
																
																customdatetype.setVisible((datediv == "CUSTOM" ? true : false));
															},
															scope: this
														}
													},
													{
														fieldLabel: IRm$/*resources*/.r1("B_CUSTOM"),
														name: "customdatetype",
														xtype: "textfield",
														hidden: true
													}
												]
											}
										]
									},
									{
										xtype: "panel",
										border: false,
										// title: IRm$/*resources*/.r1("L_GEO_FIELD"),
										defaultType: "textfield",
										"layout": "anchor",
										defaults: {
											anchor: "100%"
										},
										items: [
											{
												xtype: "fieldcontainer",
												fieldLabel: IRm$/*resources*/.r1("L_LATITUDE"),
												layout: {
													type: "hbox",
													align: "stretch"
												},
												items: [
													{
														xtype: "textfield",
														flex: 1,
														name: "geolat"
													},
													{
														xtype: "button",
														text: "..",
														handler: function() {
															this.selectItem("geolat");
														},
														scope: this
													}
												]
											},
											{
												xtype: "fieldcontainer",
												fieldLabel: IRm$/*resources*/.r1("L_LONGITUDE"),
												layout: {
													type: "hbox",
													align: "stretch"
												},
												items: [
													{
														xtype: "textfield",
														flex: 1,
														name: "geolng"
													},
													{
														xtype: "button",
														text: "..",
														handler: function() {
															this.selectItem("geolng");
														},
														scope: this
													}
												]
											}
										]
									},
									{
										xtype: "panel",
										"layout": "anchor",
										// title: IRm$/*resources*/.r1("L_RANGE_FIELD"),
										autoScroll: true,
										defaults: {
											anchor: "100%"
										},
										items: [
											{
												xtype: "fieldcontainer",
												"layout": {
													type: "hbox"
												},
												fieldLabel: IRm$/*resources*/.r1("L_BASE_METRIC"),
												items: [
													{
														xtype: "textfield",
														hideLabel: true,
														name: "rangefield",
														allowBlack: false
													}, 
													{
														xtype: "button",
														text: "..",
														handler:function() {
															this.selectItem("rangefield");
														},
														scope: this
													}
												]
											},
											{
												xtype: "fieldset",
												title: "Grouping",
												"layout": "anchor",
												padding: "3 5",
												items: [
													{
														name: "groupmin",
														fieldLabel: "Start minimum",
														xtype: "numberfield",
														value: -1,
														minValue: -1,
														maxValue: 100000000,
														allowDecimals: true,
														decimalPrecision: 2,
														step: 1
													},
													{
														name: "groupmax",
														fieldLabel: "End Maximum",
														xtype: "numberfield",
														value: -1,
														minValue: -1,
														maxValue: 100000000,
														allowDecimals: true,
														decimalPrecision: 2,
														step: 1
													},
													{
														name: "stepinterval",
														fieldLabel: "Step Interval",
														xtype: "numberfield",
														value: -1,
														minValue: -1,
														maxValue: 10,
														allowDecimals: true,
														decimalPrecision: 2,
														step: 1
													},
													{
														name: "groupminlabel",
														fieldLabel: "Under minimum",
														xtype: "textfield"
													},
													{
														name: "groupmaxlabel",
														fieldLabel: "Over maximum",
														xtype: "textfield"
													},
													{
														name: "grouplabel",
														fieldLabel: "Label text",
														xtype: "textfield"
													},
													{
														xtype: "displayfield",
														value: "Use keyword %MIN %MAX for range labeling"
													},
													{
														xtype: "textfield",
														name: "groupformat",
														fieldLabel: "Numeric Format"
													}
												]
											}
										]
									},
									{
										xtype: "panel",
										layout: "anchor",
										autoScroll: true,
										items: [
											{
												xtype: "combobox",
												name: "l_tp",
												fieldLabel: IRm$/*resources*/.r1("L_LNK_TP"),
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
													    {name: IRm$/*resources*/.r1("L_LNK_DRILL"), value: "DRILL"},
													    {name: IRm$/*resources*/.r1("L_LNK_DOC"), value: "DOC"},
													    {name: IRm$/*resources*/.r1("L_LNK_EXT"), value: "EXTERNAL"}
													]
												},
												listeners: {
													change: function(tobj) {
														var me = this,
															l_nm = me.down("[name=l_nm]"),
															l_tr = me.down("[name=l_tr]"),
															l_elnk = me.down("[name=l_elnk]"),
															l_elnk_tgt = me.down("[name=l_elnk_tgt]"),
															l_rpt_tmpl = me.down("[name=l_rpt_tmpl]"),
															tval = tobj.getValue(),
															bext = tval == "EXTERNAL";
														
														l_tr.setVisible(!bext);
														l_rpt_tmpl.setVisible(tval == "DOC");
														l_elnk.setVisible(bext);
														l_elnk_tgt.setVisible(bext);
													},
													scope: this
												}
											},
											{
												xtype: "textfield",
												name: "l_nm",
												fieldLabel: "Display Name"
											},
											{
												xtype: "fieldcontainer",
												fieldLabel: "Target Report",
												name: "l_tr",
												hidden: true,
												layout: {
													type: "hbox",
													align: "stretch"
												},
												items: [
													{
														xtype: "textfield",
														hidden: true,
														name: "l_rpt_uid"
													},
													{
														xtype: "textfield",
														name: "l_rpt_name",
														flex: 1
													},
													{
														xtype: "button",
														name: "..",
														handler: function() {
															this.s2/*selectReport*/("l_rpt");
														},
														scope: this
													}
												]
											},
											{
												xtype: "combobox",
												name: "l_rpt_tmpl",
												fieldLabel: IRm$/*resources*/.r1("L_LNK_TMPL"),
												queryMode: 'local',
												displayField: 'disp',
												valueField: 'seq',
												editable: false,
												autoSelect: true,
												store: {
													xtype: 'store',
													fields: [
														"disp", "seq"
													]
												}
											},
											{
												xtype: "textfield",
												name: "l_elnk_tgt",
												fieldLabel: IRm$/*resources*/.r1("L_LNK_TGT"),
												hidden: true
											},
											{
												xtype: "textarea",
												fieldLabel: IRm$/*resources*/.r1("L_LNK_URL"),
												anchor: "100%",
												hidden: true,
												name: "l_elnk"
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
					        	fieldLabel: IRm$/*resources*/.r1("L_CODE_FIELD"),
					        	items: [
					        	    {
					        	    	xtype: "textfield",
					        	    	name: "cmap_disp",
					        	    	readOnly: true,
					        	    	flex: 1
					        	    },
					        	    {
					        	    	xtype: "button",
					        	    	text: "..",
					        	    	handler: function() {
					        	    		this.selectItem("codemap");
					        	    	},
					        	    	scope: this
					        	    },
					        	    {
					        	    	xtype: "button",
					        	    	text: IRm$/*resources*/.r1("B_CLEAR"),
					        	    	handler: function() {
					        	    		var me = this;
					        	    		me.down("[name=cmap_disp]").setValue("");
					        	    		me.clItem.objectinfo.cmap_disp = "";
					        	    		me.clItem.objectinfo.cmap_uid = "";
					        	    	},
					        	    	scope: this
					        	    }
					        	]
					        },
					        {
								xtype: "fieldset",
								title: IRm$/*resources*/.r1("L_STYLE_OPTION"),
								"layout": "anchor",
								padding: "3 5",
								items: [
									{
										xtype: "combobox",
										name: "optstyle",
										fieldLabel: IRm$/*resources*/.r1("L_BASE_STYLE"),
										queryMode: 'local',
										displayField: 'disp',
										valueField: 'name',
										editable: false,
										autoSelect: true,
										store: {
											xtype: 'store',
											fields: [
												"disp", "name", "type"
											]
										}
									}
								]
							}
						]
					},
					{
						xtype: "panel",
						title: IRm$/*resources*/.r1("L_OTHER_OPTION"),
						bodyStyle: "padding: 5px",
						layout: "anchor",
						defaults: {
							anchor: "100%"
						},
						items: [
							{
								xtype: "fieldset",
								title: IRm$/*resources*/.r1("L_SORT_SEL"),
								"layout": "anchor",
								padding: "0 5",
								defaults: {
									anchor: "100%"
								},
								items: [
									{
										xtype: "radiogroup",
								    	name: "optsortdir",
								    	fieldLabel: IRm$/*resources*/.r1("L_SORT_ORD"),
								    	padding: "0 5",
						            	plain: true,
										items: [
											{boxLabel: IRm$/*resources*/.r1("B_DEFAULT"), name: "cb_sortdir", inputValue: "", checked: true},
											{boxLabel: IRm$/*resources*/.r1("B_ASC"), name: "cb_sortdir", inputValue: "asc"},
											{boxLabel: IRm$/*resources*/.r1("B_DSC"), name: "cb_sortdir", inputValue: "desc"}
										]
									},
									{
										xtype: "radiogroup",
										name: "optsorttype",
										fieldLabel: IRm$/*resources*/.r1("L_SORT_TP"),
										padding: "0 5",
										plain: true,
										items: [
											{boxLabel: IRm$/*resources*/.r1("B_DEFAULT"), name: "cb_sorttype", inputValue: "", checked: true},
											{boxLabel: IRm$/*resources*/.r1("B_STRING"), name: "cb_sorttype", inputValue: "VARCHAR"},
											{boxLabel: IRm$/*resources*/.r1("B_NUMERIC"), name: "cb_sorttype", inputValue: "NUMBER"}
										]
									},
									{
										xtype: "fieldcontainer",
										name: "optdispitem",
										fieldLabel: IRm$/*resources*/.r1("L_F_DISP"),
										hidden: true,
										layout: {
											type: "hbox",
											align: "stretch"
										},
										items: [
											{
												xtype: "textfield",
												name: "optdispitemname",
												flex: 1
											},
											{
												xtype: "button",
												text: "..",
												handler: function() {
													this.P2C/*cubeSelectedHandler*/("optdispitemname");
												},
												scope: this
											},
											{
												xtype: "button",
												text: IRm$/*resources*/.r1("B_CLEAR"),
												handler: function() {
													var me = this;
													me.optdispitemname = null;
													me.optdispitemuid = null;
													me.down("[name=optdispitemname]").setValue("");
												},
												scope: this
											}
										]
									},
									{
										xtype: "fieldcontainer",
										name: "optsortitem",
										fieldLabel: IRm$/*resources*/.r1("L_F_SORT"),
										hidden: true,
										layout: {
											type: "hbox",
											align: "stretch"
										},
										items: [
											{
												xtype: "textfield",
												name: "optsortitemname",
												flex: 1
											},
											{
												xtype: "button",
												text: "..",
												handler: function() {
													this.P2C/*cubeSelectedHandler*/("optsortitemname");
												},
												scope: this
											},
											{
												xtype: "button",
												text: IRm$/*resources*/.r1("B_CLEAR"),
												handler: function() {
													var me = this;
													me.optsortitemname = null;
													me.optsortitemuid = null;
													me.down("[name=optsortitemname]").setValue("");
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
		];
		
		IG$/*mainapp*/._Ifa/*custommetricinner*/.superclass.initComponent.apply(this);
	},
	
	listeners: {
		afterrender: function(ui) {
			var panel = this;
			
			setTimeout(function() {
				panel._IFe/*initF*/.call(panel);
			}, 100);
		}
	}
});

IG$/*mainapp*/._Ie0/*custommetric*/ = $s.extend($s.window, {
	
	modal: false,
	isWindow: true,
	region:"center",
	"layout": {
		type: "fit",
		align: "stretch"
	},
	
	closable: false,
	resizable:false,
	width: 500,
	height: 480,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
		
		this.callback && this.callback.execute();
	},
	
	_IFf/*confirmDialog*/: function() {
		this._IH1/*mainpanel*/._IFf/*confirmDialog*/.call(this._IH1/*mainpanel*/);
					
		this._IG0/*closeDlgProc*/();
	},
	
	initComponent : function() {
		this._IH1/*mainpanel*/ = new IG$/*mainapp*/._Ifa/*custommetricinner*/({
			uid: this.uid,
			writable: this.writable,
			wd: this
		});
		
		this.title = IRm$/*resources*/.r1("T_CUSTOM_METRIC");
				 
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
			
			items: [
				this._IH1/*mainpanel*/
			],
			buttons:[
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
			]
		});
		
		IG$/*mainapp*/._Ie0/*custommetric*/.superclass.initComponent.apply(this, arguments);
	}
});


IG$/*mainapp*/._I73/*tableManager*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	scroll: false,
	initialized: false,
	closable: true,
	"layout": "fit",
	bodyPadding: 5,
	iconCls: "icon-ing-docdef",
	
	curnode: null,
	cursop: null,
	
	_IFd/*init_f*/: function() {
		var me = this;
		me._m2/*aliasMap*/ = {};
		me._m1/*aliasLoaded*/ = false;
		me.curnode = null;
		me.cursop = null;
		me.l1/*loadDBPool*/();
	},
	
	l1/*loadDBPool*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		// me.setLoading(true);
		
		req.init(me, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/"}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'standard'})
	        }, me, me.rs_l1/*loadDBPool*/, false);
		req._l/*request*/();
	},
	
	rs_l1/*loadDBPool*/: function(xdoc) {
		var me = this,
			dp = [],
			i, cnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"), 
			snodes, p,
			isadmin = false,
			fpool = me.down("[name=fpool]"),
			fschema = me.down("[name=fschema]"),
			fschema_st = me.down("[name=fschema_st]");
		
		// me.setLoading(false);
		
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
						dbtype: p.dbtype,
						isuserdb: (p.isuserdb == "T" ? true : false),
						savepwd: (p.isuserdb == "T" && p.savepwd == "F" ? false : true)
					});
				}
			}
		}
		
		fpool.store.loadData(dp);
		fpool.setValue("");
		
		fschema.store.loadData([{name: "Select Item", uid: ""}]);
		fschema.setValue("");
		
		fschema_st.store.loadData([{name: "Select Item", uid: ""}]);
		fschema_st.setValue("");
		me.fschema_st_ = null;
	},
	
	l2/*loadDatabaseSchema*/: function(poolname, uid) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			obj = {address: "/" + poolname};
		
		if (uid)
		{
			obj.uid = uid;
			if (IG$/*mainapp*/.dbp && IG$/*mainapp*/.dbp[poolname])
			{
				obj.pwd = IG$/*mainapp*/.dbp[poolname];
			}
		}
		me.setLoading(true);
		
		req.init(me, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/(obj, "uid;address;pwd"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'standard'})
	        }, me, me.rs_l2/*loadDatabaseSchema*/, false, poolname);
		req._l/*request*/();
	},
	
	rs_l2/*loadDatabaseSchema*/: function(xdoc, poolname) {
		var me = this,
			tnode =  IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			// grid_sc = me.down("[name=grid_sc]"), 
			fschema = me.down("[name=fschema]"),
			snodes, i, node,
			dp = [];
		
		// me.setLoading(false);
		
		if (tnode)
		{
//			root = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
//			root.dispname = root.name;
//			root.dispname = IG$/*mainapp*/._I08/*formatName*/(root.dispname);
//			root.children = [];
//			root.expanded = true;
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < snodes.length; i++)
			{
				node = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
				node.uid = node.name;
				// node.nodepath = "/" + poolname + "/" + node.name;
				dp.push(node);
			}
			
			// grid_sc.setRootNode(root);
			fschema.store.loadData(dp);
			fschema.setValue("");
		}
		
		me.l3/*loadRegisteredSchema*/(poolname);
	},
	
	l3/*loadRegisteredSchema*/: function(poolname) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			opt = {address: "/" + poolname, option: "StoredContent"};
		
		me.curnode = null;
		me.cursop = null;
		
		me.l99/*hideDetailPanel*/();
		
		if (IG$/*mainapp*/.dbp[poolname])
		{
			opt.pwd = IG$/*mainapp*/.dbp[poolname];
		}
		
		req.init(me, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/(opt, "address;option;pwd"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/(opt)
	        }, me, me.rs_l3/*loadDatabaseSchema*/, false, poolname);
		req._l/*request*/();
	},
	
	rs_l3/*loadRegisteredSchema*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			fschema_st = me.down("[name=fschema_st]"), 
			snodes, i,
			dp = [{name: "Select Item", uid: ""}], node;
		
		// me.setLoading(false);
		
		me.down("[name=btn_sname]").setDisabled(true);
		
		if (tnode)
		{
//			root = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
//			root.dispname = root.name;
//			root.dispname = IG$/*mainapp*/._I08/*formatName*/(root.dispname);
//			root.children = [];
//			root.expanded = true;
			me.fschema_st_ = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < snodes.length; i++)
			{
				node = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
//				node.dispname = node.name;
//				node.dispname = IG$/*mainapp*/._I08/*formatName*/(node.dispname);
//				node.checked = false;
				dp.push(node);
			}
			
			// grid_st.setRootNode(root);
		}
		
		fschema_st.store.loadData(dp);
		fschema_st.setValue("");
	},
	
	l4/*loadDatabaseTable*/: function(node, option, keyword) {
		var me = this,
			nodepath = node.get("nodepath"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			cpath = nodepath.split("/"),
			opt = {address: nodepath, option: option, search: keyword};
		
		if (cpath.length > 1 && IG$/*mainapp*/.dbp[cpath[1]])
		{
			opt.pwd = IG$/*mainapp*/.dbp[cpath[1]];
		}
		
		me.setLoading(true);
		
		req.init(me, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/(opt, "address;option;pwd;search"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/(opt)
	        }, me, me.rs_l4/*loadDatabaseTable*/, false, [node, option]);
		req._l/*request*/();
	},
	
	rs_l4/*loadDatabaseTable*/: function(xdoc, param) {
		var me = this,
			node = param[0],
			option = param[1],
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			snodes, i, tb, tables = [],
			grid = (option == null ? me.down("[name=grid_sc]") : me.down("[name=grid_st]"));
		
		me.setLoading(false);
		
		if (tnode)
		{
			// node.removeAll(true);
//			while (node.firstChild)
//			{
//				node.removeChild(node.firstChild);
//			}
			
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < snodes.length; i++)
			{
				tb = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
				tb.uid = tb.uid || ("" + i);
				tb.allow_insert = tb.objinfo && tb.objinfo.indexOf("allow_insert=T") > -1;
				tb.allow_insert_desc = tb.allow_insert ? "Yes" : "";
				// if (option == null)
				// {
					// tb.checked = checked;
				// }
				// tb.leaf = true;
				// tb.dispname = tb.name;
				tables.push(tb);
				// node.appendChild(tb);
			}
			// node.appendChild(tables);
		}
		
		grid.store.loadData(tables);
	},
	
	l5/*loadTableContent*/: function(node, option, refresh) {
		var me = this,
			pnldetail = me.down("[name=pnldetail]"),
			uid = node.get("uid"),
			nodepath = node.get("nodepath"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			cpath = (nodepath ? nodepath.split("/") : null),
			opt = {address: uid, option: option},
			palias = {},
			i, rec;
		
		pnldetail.setVisible(true);
		
		uid = (option == null) ? nodepath : uid;
		opt.address = uid;
		
		if (cpath && cpath.length > 1 && IG$/*mainapp*/.dbp[cpath[1]])
		{
			opt.pwd = IG$/*mainapp*/.dbp[cpath[1]];
		}
		
		if (refresh)
		{
			for (i=0; i < pnldetail.store.data.items.length; i++)
			{
				rec = pnldetail.store.data.items[i];
				if (rec.get("alias"))
				{
					palias[rec.get("name")] = rec.get("alias");
				}
			}
		}
		
		req.init(me, 
			{
		        ack: "25",
		        payload: IG$/*mainapp*/._I2d/*getItemAddress*/(opt, "address;option;pwd"),
		        mbody: IG$/*mainapp*/._I2e/*getItemOption*/(opt)
		    }, me, me.rs_l5/*loadTableContent*/, false, [node, palias, refresh]);
		req._l/*request*/();
	},
	
	rs_l5/*loadTableContent*/: function(xdoc, param) {
		var me = this,
			node = param[0],
			palias = param[1],
			refresh = param[2],
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			tobjinfo = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/objinfo"),
			objinfo,
			snodes, i, fields = [], field,
			pnldetail = me.down("[name=pnldetail]"),
			cpath = node.get("nodepath"),
			tprop, enode, sqnode,
			sop,
			allow_insert = me.down("[name=allow_insert]"),
			file_field = me.down("[name=file_field]"),
			seq_field = me.down("[name=seq_field]"),
			df = [{
				name: "Select Field",
				value: ""
			}];
		
		if (cpath && cpath.indexOf("/") > -1)
		{
			cpath = cpath.substring(cpath.lastIndexOf("/") + 1);
		}
		
		me.setLoading(false);
		
		if (tobjinfo)
		{
			objinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tobjinfo);
		}
		
		pnldetail.setTitle("Field Info [" + cpath + "]");
		
		me.curnode = null;
		me.cursop = null;
		
		if (tnode)
		{
			me.curnode = node;
			tprop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			me.down("[name=edit_sql]").setVisible(tprop.type == "InlineView");
			
			if (tprop.type == "InlineView")
			{
				sop = new IG$/*mainapp*/._Icf/*cube*/();
	    		sop.sqloption = {
	    			columns: [],
	    			prompts: []
	    		};
	    		sop.uid = tprop.uid;
	    		sop.viewname = tprop.name;
	    		enode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "ExecuteSQL");
	    		if (enode)
	    		{
		    		sop.sqloption.dbpool = IG$/*mainapp*/._I1b/*XGetAttr*/(enode, "dbpool");
		    		sqnode = IG$/*mainapp*/._I19/*getSubNode*/(enode, "SQL");
		    		if (sqnode)
		    		{
		    			sop.sqloption.sql = IG$/*mainapp*/._I24/*getTextContent*/(sqnode);
		    		}
		    	}
	    		me.cursop = sop;
			}

			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode, "Field");
			
			for (i=0; i < snodes.length; i++)
			{
				field = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
				field.dispname = field.name;
				if (refresh && palias && palias[field.name])
				{
					field.alias = palias[field.name];
				}
				field.iskey = field.iskey == "T" ? true : false;
				// if (me._m2/*aliasMap*/[field.name])
				// {
				// 	field.alias = me._m2/*aliasMap*/[field.name]; 
				// }
				
				df.push({
					name: field.name,
					value: field.name
				});
				fields.push(field);
				sop && sop.sqloption && sop.sqloption.columns.push(field);
			}
			
			me.curnode.set("fields", fields);
			pnldetail.store.loadData(fields);
			
			allow_insert.setValue(tprop.type != "Table" ? false : tprop.objinfo && tprop.objinfo.indexOf("allow_insert=T") > -1);
			allow_insert.setDisabled(tprop.type != "Table");
			
			file_field.store.loadData(df);
			file_field.setValue(objinfo ? objinfo.file_field : "");
			
			seq_field.store.loadData(df);
			seq_field.setValue(objinfo ? objinfo.seq_field : "");
		}
	},
	
/*
 * register / unregister functions
 */
	
	l6/*registerSelectedTable*/: function() {
		var me = this,
			grid_sc = me.down("[name=grid_sc]"), 
			address = "<smsg><item option='register'>",
			i, sel, name,
			alias = me._m2/*aliasMap*/,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			nsel = 0,
			fschema_st = me.down("[name=fschema_st]"),
			pid = fschema_st.getValue();
		
		me.l99/*hideDetailPanel*/();
		
		sel = grid_sc.getSelectionModel().selected;
		
		fschema_st.clearInvalid();
		
		if (!pid)
		{
			fschema_st.markInvalid("Select Item");
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Select target schema name to register to.", null, null, 0, "error");
			return;
		}
		
		if (sel.length == 0)
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Search and check table to register.", null, null, 0, "error");
			return;
		}
		
		for (i=0; i < sel.length; i++)
		{
			name = sel.items[i].get("name");
			
			address += "<item pid='" + pid + "' name='" + name + "' option='register'";
			// if (alias[name])
			// {
			// 	address += " memo='" + alias[name] + "'";
			// }
			address += "/>";
		}
		
		address += "</item>";
		
		if (me._m2/*aliasMap*/)
		{
			address += "<alias>";
			$.each(me._m2/*aliasMap*/, function(k, kval) {
				address += "<n name='" + k + "'><![CDATA[" + kval + "]]></n>";
			});
			address += "</alias>";
		}
				
		address += "</smsg>";
		
		me.setLoading(true);
		
		req.init(me, 
			{
		        ack: "25",
		        payload: address,
		        mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
		    }, me, function(xdoc) {
		    	this._t$/*toolbarHandler*/("cmd_refresh_table");
		    	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
		    }, false);
		req._l/*request*/();
	},
	
	_s1/*searchTable*/: function() {
		var me = this,
			src_keyword = me.down("[name=src_keyword]"),
			fschema = me.down("[name=fschema]"),
			sname = fschema.getValue(),
			i,
			node;
		
		if (!me._c1/*checkSourceSelection*/())
		{
			return;
		}
		
		for (i=0; i < fschema.store.data.items.length; i++)
		{
			if (fschema.store.data.items[i].get("uid") == sname)
			{
				node = fschema.store.data.items[i];
			}
		}
		
		me.l4/*loadDatabaseTable*/(node, null, src_keyword.getValue());
	},
	
	l7/*unregisterSelectedTable*/: function() {
		var me = this,
			address = "<smsg>", sel,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			grid_st = me.down("[name=grid_st]"),
			sel = grid_st.getSelectionModel().selected,
			i, nsel = 0;
		
		me.l99/*hideDetailPanel*/();
		
		if (sel && sel.length > 0)
		{
			for (i=0; i < sel.length; i++)
			{
				if (sel.items[i].get("type") == "Table" || sel.items[i].get("type") == "InlineView")
				{
					address += "<item address='" + sel.items[i].get("uid") + "' option='Clear'/>";
					nsel ++;
				}
			}
		
			address += "</smsg>";
			
			if (nsel > 0)
			{
				me.setLoading(true);
				req.init(me, 
					{
				        ack: "25",
				        payload: address,
				        mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
				    }, me, function(xdoc) {
				    	var i;
				    	
				    	for (i=sel.length-1; i>=0; i--)
				    	{
				    		grid_st.store.remove(sel.items[i]);
				    	}
				    	
				    	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
				    }, false);
				req._l/*request*/();
			}
		}
	},
	
	l8/*saveRegisterTable*/: function(isfield) {
		var me = this,
			uid,
			content = me.l98/*updateContent*/(),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		if (!me.curnode)
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Click table item to continue.", null, null, 1, "alert");
			return;
		}	
		req.init(me, 
			{
		        ack: "25",
		        payload: IG$/*mainapp*/._I2d/*getItemAddress*/({
		        	address: me.curnode.get("uid"), 
		        	option: "UpdateContent"
		        }, "address;option"),
		        mbody: content
		    }, me, me.rs_l8/*saveRegisterTable*/, false, isfield);
		req._l/*request*/();
	},
	
	rs_l8/*saveRegisterTable*/: function(xdoc, isfield) {
		if (!isfield)
		{
			this._t$/*toolbarHandler*/("cmd_refresh_table");
		}
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
	},
	
	l98/*updateContent*/: function() {
		var me = this,
			i, 
			st = me.down("[name=pnldetail]").store,
			allow_insert = me.down("[name=allow_insert]").getValue(),
			file_field = me.down("[name=file_field]").getValue(),
			seq_field = me.down("[name=seq_field]").getValue(),
			r = "<smsg><item uid='" + me.curnode.get("uid") + "'>";
			
		r += "<objinfo allow_insert='" + (allow_insert ? "T" : "F") + "' file_field='" + (file_field || "") + "' seq_field='" + (seq_field || "") + "'/>";
			
		for (i=0; i < st.data.items.length; i++)
		{
			r += "<Field " + IG$/*mainapp*/._I22/*NodeUpdateInfo*/(st.data.items[i], "nodepath;datasize;datatype;decimaldigits;name;alias;tablename;type")
				+ " iskey='" + (st.data.items[i].get("iskey") == true ? "T" : "F") + "'"
				+ "/>";
		}
		// <Field nodepath="/MECBASE/MECBASE/MECELOG/LID1" datasize="10" datatype="INT" decimaldigits="0" name="LID1" tablename="MECELOG" type="Field"/>
		r += "</item></smsg>";
		return r;
	},
	
	l99/*hideDetailPanel*/: function() {
		var me = this,
			pnldetail = me.down("[name=pnldetail]");
		pnldetail.setVisible(false);
	},
	
	_c1/*checkSourceSelection*/: function(foolonly) {
		var me = this,
			fpool = me.down("[name=fpool]"),
			fschema = me.down("[name=fschema]")
			
		fpool.clearInvalid();
		fschema.clearInvalid();
		
		if (!fpool.getValue())
		{
			fpool.markInvalid("Select Item");
			return 0;
		}
		
		if (!foolonly && !fschema.getValue())
		{
			fschema.markInvalid("Select Item");
			return 0;
		}
		
		return 1;
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this,
			sop,
			dlg,
			fpool, grid_st,
			rnode, node,
			dlg,
			sop,
			fpool_name,
			i, rnodes,
			fschema_st,
			rec;
		
		switch (cmd)
		{
		case "cmd_add_sc":
			if (!me._c1/*checkSourceSelection*/())
			{
				return;
			}
			
			if (me.fschema_st_)
			{
				pop = new IG$/*mainapp*/._I6e/*makeItem*/({
					itemtype: "Schema",
					parentnodepath: me.fschema_st_.nodepath,
					parentuid: me.fschema_st_.uid,
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
						me._t$/*toolbarHandler*/.call(me, "cmd_refresh");
					})
				});
				IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
			}
			break;
		case "cmd_remove_sc":
			fschema_st = me.down("[name=fschema_st]");
			
			if (fschema_st.getValue())
			{
				IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("B_CD_CHS"), function(dlg) {
					if (dlg == "yes")
					{
						var req = new IG$/*mainapp*/._I3e/*requestServer*/();
						req.init(me, 
							{
					            ack: "30",
				                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({
				                	uid: fschema_st.getValue()
				                }, "uid"),
				                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "delete"})
					        }, me, function(xdoc) {
					        	var me = this;
					        	me._t$/*toolbarHandler*/.call(me, "cmd_refresh");
					        }, null);
						req._l/*request*/();
					}
				});
			}
			break;
		case "cmd_save":
			break;
		case "cmd_save_field":
			me.l8/*saveRegisterTable*/(cmd == "cmd_save_field");
			break;
		case "cmd_refresh_field":
			if (me.curnode)
			{
				me.l5/*loadTableContent*/(me.curnode, null, 1);
			}
			break;
		case "cmd_refresh_table":
			grid_st = me.down("[name=grid_st]");
			fschema_st = me.down("[name=fschema_st]");
			
			grid_st.store.loadData([]);
			me.down("[name=btn_sname]").setDisabled(true);
			
			var newvalue = fschema_st.getValue();
			
			if (newvalue)
			{
				for (i=0; i < fschema_st.store.data.items.length; i++)
				{
					if (fschema_st.store.data.items[i].get("uid") == newvalue)
					{
						node = fschema_st.store.data.items[i];
						break;
					}
				}
				
				if (node)
				{
					me.down("[name=btn_sname]").setDisabled(false);
					me.l4/*loadDatabaseTable*/(node, "StoredContent");
				}
			}
			break;
		case "cmd_refresh":
			var poolname = me.down("[name=fpool]").getValue();
			if (poolname)
			{
				me.l3/*loadRegisteredSchema*/(poolname);
			}
			break;
		case "cmd_alias":
			var dlg = new IG$/*mainapp*/.A2Tw/*tableAlias*/({
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(alias) {
					me._m2/*aliasMap*/ = alias;
					me._m1/*aliasLoaded*/ = true;
					me.down("[name=m2]").show();
				})
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
			break;
		case "cmd_change_schema":
			var fschema_st = me.down("[name=fschema_st]"),
				sel = fschema_st.getValue(),
				rec,
				rtype,
				pop,
				i;
			
			if (sel)
			{
				for (i=0; i < fschema_st.store.data.items.length; i++)
				{
					if (fschema_st.store.data.items[i].get("uid") == sel)
					{
						rec = fschema_st.store.data.items[i];
						break;
					}
				}
				
				if (rec)
				{
					pop = new IG$/*mainapp*/._Icd/*makeItemEditor*/({
						itemname: rec.get("name"),
						uid: rec.get("uid"),
						itemtype: rec.get("type"),
						_IO5/*rs_processMakeMetaItem*/: function(xdoc) {
							var panel = this,
								itemname = this.down("[name=fitemname]").getValue();
					
							panel._IG0/*closeDlgProc*/.call(panel);
							
							if (panel.callback)
							{
								panel.callback.execute({
									name: itemname
								});
							}
						},
						callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
							if (item && item.name)
							{
								var nodepath = rec.get("nodepath");
								nodepath = nodepath.substring(0, nodepath.lastIndexOf("/"));
								rec.set("name", item.name);
								rec.set("nodepath", nodepath + "/" + item.name);
								
								fschema_st.setValue(rec.get("uid"));
							}
							else
							{
								me._t$/*toolbarHandler*/.call(me, "cmd_refresh");
							}
						})
					});
					IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
				}
			}
			break;
		case "cmd_config":
			break;
		case "cmd_inlineview":
			fpool = me.down("[name=fpool]");
			grid_st = me.down("[name=grid_st]");
			fpool_name = fpool.getValue();
			fschema_st = me.down("[name=fschema_st]");
			
			var fval = fschema_st.getValue();
			
			if (fval)
			{
				for (i=0; i < fschema_st.store.data.items.length; i++)
				{
					if (fschema_st.store.data.items[i].get("uid") == fval)
					{
						rec = fschema_st.store.data.items[i];
						break;
					}
				}
			}
			
			if (fpool_name && rec)
			{
				sop = new IG$/*mainapp*/._Icf/*cube*/();
	    		sop.sqloption = {
	    			prompts: []
	    		};
	    		sop.sqloption.dbpool = fpool_name;
	    		sop.sqloption.schemauid = rec.get("uid");
	    		sop.sqloption.schemaname = rec.get("name");
	    		
	    		dlg = new IG$/*mainapp*/._Ib1/*sqlcube_wizard*/({
	    			wmode: "inlineview",
	    			uid: null,
	    			_ILb/*sheetoption*/: sop,
	    			columns: [],
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_SOp/*setOption*/)
				});
				IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
			}
			break;
		case "cmd_edit_sql":
			if (me.curnode && me.cursop)
			{
				sop = me.cursop;
				dlg = new IG$/*mainapp*/._Ib1/*sqlcube_wizard*/({
	    			wmode: "inlineview",
	    			uid: me.curnode.get("uid"),
	    			_ILb/*sheetoption*/: sop,
	    			columns: [],
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_SOp/*setOption*/)
				});
				IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
			}
			break;
		case "cmd_rel_field":
			dlg = new IG$/*mainapp*/._I72/*relationMgr*/({
				uid: me.curnode.get("uid"),
				isdown: true
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
			break;
		case "cmd_ref_alias":
			var pnldetail = me.down("[name=pnldetail]"),
				i,
				rec,
				fname;
			if (!me._m1/*aliasLoaded*/)
				return;

			for (i=0; i < pnldetail.store.data.items.length; i++)
			{
				rec = pnldetail.store.data.items[i];
				fname = rec.get("name");

				if (!rec.get("alias") && me._m2/*aliasMap*/[fname])
				{
				 	rec.set("alias", me._m2/*aliasMap*/[fname]); 
				}
			}
			break;
		case "cmd_build_model":
			me._b1/*buildModel*/();
			break;
		case "cmd_export_meta":
			if (!me._c1/*checkSourceSelection*/(true))
			{
				return;
			}

			IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("T_EXP_MC"), IRm$/*resources*/.r1("T_EXP_MC_Q"), function(dlg) {
				var panel = me,
					meta = [],
					fschema_st = panel.down("[name=fschema_st]"),
					req = new IG$/*mainapp*/._I3e/*requestServer*/(),
					i, rec,
					payload;
				
				for (i=0; i < fschema_st.store.data.items.length; i++)
				{
					rec = fschema_st.store.data.items[i];
					
					if (rec.get("uid"))
					{
						meta.push({
							uid: rec.get("uid"),
							name: rec.get("name"),
							nodepath: rec.get("nodepath"),
							type: rec.get("type")
						});
					}
				}
					
				if (meta && meta.length && dlg == "yes")
				{
					payload = "<smsg>";
					for (i=0; i < meta.length; i++)
					{
						payload += "<item" + IG$/*mainapp*/._I20/*XUpdateInfo*/(meta[i], "uid;nodepath;name;type", "s") + "/>";
					}
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
	
	_b1/*buildmodel*/: function() {
		var me = this,
			grid_st = me.down("[name=grid_st]"),
			sel = grid_st.getSelectionModel().selected,
			req, rec, i,
			mbody;
		
		if (!me._c1/*checkSourceSelection*/(true))
		{
			return;
		}
			
		if (sel && sel.length)
		{
			mbody = "<smsg><info option='build_model'>";
			mbody += "<tables>";
			for (i=0; i < sel.length; i++)
			{
				rec = sel.items[i];
				mbody += "<table name='" + rec.get("name") + "' uid='" + rec.get("uid") + "'/>";
			}
			mbody += "</tables>";
			mbody += "</info></smsg>";
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
			        ack: "6",
			        payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
			        mbody: mbody
			    }, me, function(xdoc) {
			    	var mp = IG$/*mainapp*/._I7d/*mainPanel*/;
			    	mp && mp.m1$7/*navigateApp*/.call(mp, null, "cubemodel".toLowerCase(), "new model", null, false, true, {
			    		_c$: xdoc
			    	});
			    }, false);
			req._l/*request*/();
		}
	},
	
	rs_SOp/*setOption*/: function(dlg) {
		var me = this,
			sop = dlg._ILb/*sheetoption*/,
			sqloption = sop.sqloption,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			nodepath,
			content = "<smsg><item",
			address = "<smsg>",
			i, col,
			uid = dlg.uid,
			option = "UpdateContent",
			pid;
		
		if (!uid)
		{
			option = "UpdateView";
			pid = sop.sqloption.schemauid;
		}
		
		nodepath = "/" + sop.sqloption.dbpool + "/" + sop.sqloption.schemaname + "/" + sop.viewname;
		
		content += " name='" + sop.viewname + "'>";
		
		if (sqloption.sql && sqloption.columns.length > 0)
		{
			me.l99/*hideDetailPanel*/();
			
			content += "<ExecuteSQL dbpool='" + (sqloption.dbpool || "") + "'>";
			content += "<SQL><![CDATA[" + (sqloption.sqlquery || "") + "]]></SQL>";
			content += "</ExecuteSQL>";
			
			for (i=0; i < sqloption.columns.length; i++)
			{
				col = sqloption.columns[i];
				col.nodepath = nodepath + "/" + col.sqlfield;
				content += "<Field " + IG$/*mainapp*/._I20/*XUpdateInfo*/(col, "fieldname;nodepath;datasize;datatype;decimaldigits;name;alias;tablename;type", "s") + "/>";
			}
			
			content += "</item></smsg>";
			
			req.init(me, 
				{
			        ack: "25",
			        payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: dlg.uid || nodepath, option: option, pid: pid, name: sop.viewname}, "address;option;pid;name"),
			        mbody: content
			    }, me, me.rs_l8/*saveRegisterTable*/, false);
			req._l/*request*/();
		}
	},
	
	r_IMa/*pwdset*/: function(npwd, params) {
		var me = this,
			p = params[0],
			uid = params[1];
		
		IG$/*mainapp*/.dbp[p] = npwd;
		me.l2/*loadDatabaseSchema*/(p, uid);
	},
	
    initComponent: function(){
    	var me = this;
		
		me.items = [
            {
            	xtype: "panel",
            	"layout": {
            		type: "vbox",
            		align: "stretch"
            	},
            	border: false,
            	items: [
            		{
            			xtype: "container",
            			layout: {
            				type: "vbox"
            			},
            			defaults: {
            				labelWidth: 120
            			},
            			items: [
		            	    {
		            	    	xtype: "combobox",
		            	    	name: "fpool",
		            	    	fieldLabel: "Database Instances",
		            	    	valueField: "poolname",
		            	    	displayField: "name",
		            	    	queryMode: "local",
		            	    	editable: false,
		            	    	store: {
		            	    		fields: [
		            	    			"name", "poolname", "uid", "isuserdb", "savepwd", "dbtype"
		            	    		]
		            	    	},
		            	    	listeners: {
		            	    		change: function(field, newValue, oldValue, eOpts) {
		            	    			var me = this,
		            	    				p = field.getValue();
		            	    			
		            	    			if (p)
		            	    			{
		            	    				var store = field.store,
		            	    					uid,
		            	    					savepwd,
		            	    					i,
		            	    					rec,
		            	    					vmodel;
		            	    					
		            	    				for (i=0; i < store.data.items.length; i++)
		            	    				{
		            	    					rec = store.data.items[i];
		            	    					if (rec.get("poolname") == p)
		            	    					{
		            	    						uid = rec.get("uid");
		            	    						savepwd = rec.get("savepwd");
		            	    						vmodel = rec;
		            	    						break;
		            	    					}
		            	    				}
		            	    				
		            	    				me.__dL/*dbtype*/ = vmodel && vmodel.get("dbtype") == "57" ? 1 : 0;
		            	    				
		            	    				me.down("[name=b_m1]").setVisible(me.__dL/*dbtype*/ == 0);
		            	    				me.down("[name=b_m2]").setVisible(me.__dL/*dbtype*/ == 0);
		            	    				me.down("[name=allow_insert]").setVisible(me.__dL/*dbtype*/ == 0);
		            	    				if (savepwd == false)
		            	    				{
		            	    					if (!IG$/*mainapp*/.dbp[p])
		            	    					{
		            	    						var pwdpop = new IG$/*mainapp*/._Ice/*userDbPassword*/({
		            	    							poolname: p,
		                	    						callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.r_IMa/*pwdset*/, [p, uid])
		                	    					});
		                	    					
		                	    					IG$/*mainapp*/._I_5/*checkLogin*/(this, pwdpop);
		            	    					}
		            	    					else
		            	    					{
		            	    						me.l2/*loadDatabaseSchema*/(p, uid);
		            	    					}
		            	    				}
		            	    				else
		            	    				{
		            	    					me.l2/*loadDatabaseSchema*/(p, uid);
		            	    				}
		            	    			}
		            	    			else
		            	    			{
		            	    				// clear//
		            	    				me.__dL/*dbtype*/ = 0;
		            	    				me.l99/*hideDetailPanel*/();
		            	    				me.curnode = null;
		            	    				var grid_sc = me.down("[name=grid_sc]"),
		            	    					grid_st = me.down("[name=grid_st]"),
		            	    					fschema = me.down("[name=fschema]"),
		            	    					fschema_st = me.down("[name=fschema_st]");
		            	    				
		            	    				grid_sc.store.loadData([]);
		            	    				grid_st.store.loadData([]);
		            	    				
		            	    				fschema.store.loadData([{name: "Select Item", uid: ""}]);
											fschema.setValue("");
											
											fschema_st.store.loadData([{name: "Select Item", uid: ""}]);
											fschema_st.setValue("");
											me.fschema_st_ = null;
		            	    				// if (grid_st.getRootNode())
		            	    				// {
		            	    					// grid_st.getRootNode().removeAll();
		            	    					// grid_st.store.load();
		            	    				// }
		            	    			}
		            	    		},
		            	    		scope: this
		            	    	}
		            	    },
		            	    {
		            	    	xtype: "combobox",
		            	    	queryMode: "local",
		            	    	fieldLabel: "Schema",
		            	    	name: "fschema",
		            	    	displayField: "name",
		            	    	valueField: "uid",
		            	    	emptyText: "Select Item",
		            	    	typeAhead: true,
				    			forceSelection: false,
				    			autoSelect: true,
				    			autoScroll: true,
				    			// editable: false,
		            	    	store: {
		            	    		fields: ["name", "uid", "nodepath", "type"]
		            	    	}
		            	    }
		           		]
		           	},
            	    {
            	    	xtype: "panel",
            	    	flex: 1,
            	    	border: false,
            	    	"layout": {
            	    		type: "hbox",
            	    		align: "stretch"
            	    	},
            	    	items: [
            	    	    {
            	    	    	xtype: "gridpanel",
            	    	    	name: "grid_sc",
            	    	    	flex: 1,
            	    	    	title: "Database table content",
            	    	    	emptyText: IRm$/*resources*/.r1("M_S_S1"),
            	    	    	selType: "checkboxmodel",
            	    	    	selModel: {
            	    	    		checkSelector: ".x-grid-cell",
            	    	    		mode: "MULTI"
            	    	    	},
            	    	    	store: {
    	    	    	    		fields: [
    	    	    	    			"name", "type", "nodepath", "uid", "schemaname", "dispname", "checked"
    	    	    	    		]
    	    	    	    	},
    	    	    	    	tbar: [
    	    	    	    		{
    	    	    	    			xtype: "textfield",
    	    	    	    			name: "src_keyword",
    	    	    	    			fieldLabel: "Search",
    	    	    	    			labelWidth: 60,
    	    	    	    			width: 160,
    	    	    	    			enableKeyEvents: true,
    	    	    	    			listeners: {
						    	    		keyup: function(item, e, eOpts) {
						    	    			if (e.keyCode == 13)
						    	    			{
						    	    				this._s1/*searchTable*/();
						    	    			}
						    	    		},
						    	    		scope: this
						    	    	}
    	    	    	    		},
    	    	    	    		{
    	    	    	    			xtype: "button",
    	    	    	    			text: "..",
    	    	    	    			handler: function() {
    	    	    	    				this._s1/*searchTable*/();
    	    	    	    			},
    	    	    	    			scope: this
    	    	    	    		},
    	    	    	    		"->",
    	    	    	    		{
            	    	    	    	xtype: "button",
            	    	    	    	text: "Register",
            	    	    	    	handler: function() {
            	    	    	    		this.l6/*registerSelectedTable*/();
            	    	    	    	},
            	    	    	    	scope: this
            	    	    	    }
    	    	    	    	],
            	    	    	columns: [
            	    	    	    {
            	    	    	    	text: IRm$/*resources*/.r1("B_NAME"),
            	    	    	    	flex: 1,
            	    	    	    	sortable: true,
            	    	    	    	dataIndex: "name"
            	    	    	    }
            	    	    	]
            	    	    },
            	    	    {
    	    	    	    	xtype: "container",
    	    	    	    	width: 10
    	    	    	    },
            	    	    {
            	    	    	xtype: "panel",
            	    	    	flex: 2,
            	    	    	border: false,
            	    	    	lselect: false,
            	    	    	"layout": {
            	    	    		type: "vbox",
            	    	    		align: "stretch"
            	    	    	},
            	    	    	
            	    	    	items: [
            	    	    	    {
            	    	    	    	xtype: "gridpanel",
            	    	    	    	name: "grid_st",
            	    	    	    	flex: 1,
            	    	    	    	title: "Registered Table",
            	    	    	    	showcheckselect: true,
            	    	    	    	emptyText: IRm$/*resources*/.r1("M_S_S2"),
            	    	    	    	plain: true,
            	    	    	    	store: {
            	    	    	    		showcheckselect: true,
            	    	    	    		fields: [
            	    	    	    			"name", "type", "uid", "nodepath", "dispname", "checked", "allow_insert", "allow_insert_desc"
            	    	    	    		]
            	    	    	    	},
            	    	    	    	selType: "checkboxmodel",
            	    	    	    	selModel: {
            	    	    	    		mode: "MULTI"
            	    	    	    	},
            	    	    	    	columns: [
    	            	    	    	    {
    	            	    	    	    	text: IRm$/*resources*/.r1("B_NAME"),
    	            	    	    	    	flex: 2,
    	            	    	    	    	sortable: false,
    	            	    	    	    	dataIndex: "name",
    	            	    	    	    	tdCls: "igc-td-link"
    	            	    	    	    },
    	            	    	    	    {
    	            	    	    	    	text: "Allow Insert",
    	            	    	    	    	dataIndex: "allow_insert_desc",
    	            	    	    	    	width: 80
    	            	    	    	    },
    	            	    	    	    {
    	            	    	    	    	text: "Alias",
    	            	    	    	    	flex: 1,
    	            	    	    	    	sortable: false,
    	            	    	    	    	dataIndex: "alias"
    	            	    	    	    }
    	            	    	    	],
    	            	    	    	listeners: {
	    	                	    		itemclick: function(grid, node, item, index, e, eOpts) {
	    	                	    			var me = this,
	    	                	    				ltype = node.get("type"),
	    	                	    				btn_sname = me.down("[name=btn_sname]");
	    	                	    			
	    	                	    			me.curnode = null;
	    	                	    			
	    	                	    			if (ltype == "Table" || ltype == "InlineView")
	    	                	    			{
	    	                	    				me.l5/*loadTableContent*/(node, "StoredContent");
	    	                	    			}
	    	                	    		},
	    	                	    		scope: this
            	    	    	    	},
            	    	    	    	dockedItems: [
            	    	    	    	    {
            	    	    	    	    	xtype: "toolbar",
            	    	    	    	    	dock: "top",
            	    	    	    	    	items: [
		           									/*{
		           										iconCls: 'icon-toolbar-save',
		           										tooltip: "Save table",
		           										handler: function() {this.sK3/toolbarHandler/('cmd_save'); },
		           										scope: this
		           									}, 
		           									{
		           										iconCls: 'icon-toolbar-save',
		           										tooltip: "Database characteristics",
		           										handler: function() {this.sK3/toolbarHandler/('cmd_config'); },
		           										scope: this
		           									},*/
		           									{
		           										iconCls: 'icon-toolbar-alias',
		           										tooltip: "Load alias information",
		           										handler: function() {
		           											this._t$/*toolbarHandler*/('cmd_alias'); 
		           										},
		           										scope: this
		           									},
		           									"-",
		           									{
								            	    	xtype: "combobox",
								            	    	queryMode: "local",
								            	    	fieldLabel: "Schema",
								            	    	labelAlign: "right",
								            	    	labelWidth: 50,
								            	    	name: "fschema_st",
								            	    	editable: false,
								            	    	displayField: "name",
								            	    	valueField: "uid",
								            	    	store: {
								            	    		fields: ["name", "uid", "nodepath", "type"],
								            	    		data: [
								            	    			{name: "Select Item", uid: ""}
								            	    		]
								            	    	},
								            	    	listeners: {
								            	    		change: function(field, newvalue, oldvalue, eopts) {
								            	    			this._t$/*toolbarHandler*/("cmd_refresh_table");
								            	    		},
								            	    		scope: this
								            	    	}
								            	    },
								            	    {
		           										iconCls: "icon-grid-add",
		           										tooltip: "Add",
		           										handler: function() {
		           											this._t$/*toolbarHandler*/('cmd_add_sc'); 
		           										},
		           										scope: this
		           									},
		           									{
		           										text: IRm$/*resources*/.r1("L_REN_SCH"),
		           										name: "btn_sname",
		           										disabled: true,
		           										handler: function() {
		           											this._t$/*toolbarHandler*/('cmd_change_schema');
		           										},
		           										scope: this
		           									},
		           									{
		           										iconCls: "icon-grid-delete",
		           										tooltip: "Remove Schema",
		           										handler: function() {
		           											this._t$/*toolbarHandler*/('cmd_remove_sc'); 
		           										},
		           										scope: this
		           									},
		           									{
		           										iconCls: 'icon-refresh',
		           										tooltip: "Refresh",
		           										handler: function() {
		           											this._t$/*toolbarHandler*/('cmd_refresh'); 
		           										},
		           										scope: this
		           									}
		           								]
            	    	    	    	    },
           									{
            	    	    	    	    	xtype: "toolbar",
            	    	    	    	    	dock: "top",
            	    	    	    	    	items: [
													{
														xtype: "button",
														text: "Unregister",
														handler: function() {
															var me = this;
															IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("B_CD_CHS"), function(dlg) {
																if (dlg == "yes")
																{
																	me.l7/*unregisterSelectedTable*/.call(me);
																}
															});
														},
														scope: this
													},
													"-",
													{
		           										text: "Inline view",
		           										name: "b_m2",
		           										handler: function() {
		           											this._t$/*toolbarHandler*/("cmd_inlineview"); 
		           										},
		           										listeners: {
															afterrender: function(tobj) {
																IG$/*mainapp*/.r___.a/*registertooltip*/(tobj, "inline_view");
															}
														},
		           										scope: this
		           									},
		           									{
		           										iconCls: 'icon-refresh',
		           										tooltip: "Refresh",
		           										handler: function() {
		           											this._t$/*toolbarHandler*/("cmd_refresh_table");
		           										},
		           										scope: this
		           									},
		           									"->",
		           									{
		           										text: IRm$/*resources*/.r1("L_BUILD_MODEL"),
		           										name: "b_m1",
		           										handler: function() {
		           											this._t$/*toolbarHandler*/("cmd_build_model");
		           										},
		           										scope: this
		           									},
		           									{
		           										text: IRm$/*resources*/.r1("L_EXPORT_META"),
		           										handler: function() {
		           											this._t$/*toolbarHandler*/("cmd_export_meta");
		           										},
		           										scope: this
		           									}
            	    	    	    	    	]
           									}
                       	    	    	]
            	    	    	    },
            	    	    	    {
            	    	    	    	xtype: "gridpanel",
            	    	    	    	name: "pnldetail",
            	    	    	    	hidden: true,
            	    	    	    	flex: 1,
            	    	    	    	title: "Field Info",
            	    	    	    	store: {
            	    	    	    		fields: [
            	    	    	    			"name", "datatype", "datasize", "alias", "decimaldigits", "tablename", "type", "iskey"
            	    	    	    		]
            	    	    	    	},
            	    	    	    	plugins: [
											{
												ptype: "cellediting",
												clicksToEdit: false,
												listeners: {
													beforeedit: function(editor, e, eopts) {
														var me = this,
															enabled = me.__dL/*dbtype*/ == 1,
															r = true,
															colIdx = e.colIdx;
															
														if (colIdx == 0 && !enabled)
														{
															r = false;
														}
														
														return r;
													},
													edit: function(editor, e, eopts) {
														var me = this,
															grd = e.grid,
															store = grd.store,
															rec = e.record,
															colIdx = e.colIdx,
															rowIdx = e.rowIdx,
															ovalue = e.originalValue,
															nvalue = e.value,
															i,
															bf = 0,
															r,
															cvalue;
															
														if (colIdx == 0)
														{
															for (i=0; i < store.data.items.length; i++)
															{
																if (i != rowIdx)
																{
																	r = store.data.items[i];
																	cvalue = r.get("name");
																	
																	if (cvalue.indexOf(ovalue) > -1)
																	{
																		bf = 1;
																		break;
																	}
																}
															}
															
															if (bf)
															{
																IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("L_TB_BN"), function(dlg) {
																	if (dlg == "yes")
																	{
																		var i,
																			r,
																			n;
																			
																		for (i=0; i < store.data.items.length; i++)
																		{
																			if (i != rowIdx)
																			{
																				r = store.data.items[i];
																				cvalue = r.get("name");
																				
																				n = cvalue.indexOf(ovalue);
																				if (n > -1)
																				{
																					cvalue = cvalue.substring(0, n) + nvalue + cvalue.substring(n + ovalue.length);
																					r.set("name", cvalue);
																				}
																			}
																		}
																	}
																});
															}
														}
													},
													scope: this
												}
											}
            	    	    	    	],
            	    	    	    	defaults: {
            	    	    	    		sortable: false,
        								    hideable: false
            	    	    	    	},
            	    	    	    	columns: [
            	    	    	    	    {
            	    	    	    	    	header: "Name",  
        								    	dataIndex: "name",
        								    	editor: {
        								    		allowBlank: false
        								    	},
        								        flex: 1
            	    	    	    	    },
            	    	    	    	    {
            	    	    	    	    	header: "Alias",  
        								    	dataIndex: "alias",
        								    	
        								        flex: 1,
        								        editor: {
        											allowBlank: true
        										}
            	    	    	    	    },
            	    	    	    	    {
            	    	    	    	    	header: "Key",
            	    	    	    	    	xtype: "checkcolumn",
            	    	    	    	    	dataIndex: "iskey",
            	    	    	    	    	
            	    	    	    	    	width: 40
            	    	    	    	    },
            	    	    	    	    {
            	    	    	    	    	header: "DataType",  
        								    	dataIndex: "datatype",
        								    	
        								        width: 80
            	    	    	    	    },
            	    	    	    	    {
            	    	    	    	    	header: "Size",  
        								    	dataIndex: "datasize",
        								    	
        								        width: 80
            	    	    	    	    }
            	    	    	    	],
            	    	    	    	dockedItems: [
            	    	    	    	    {
            	    	    	    	    	xtype: "toolbar",
            	    	    	    	    	dock: "top",
            	    	    	    	    	items: [
            	    	    	    	    	    {
														iconCls: 'icon-toolbar-save',
														tooltip: "Save and close field",
														handler: function() {
															this._t$/*toolbarHandler*/('cmd_save_field'); 
														},
														scope: this
													},
													{
														iconCls: 'icon-refresh',
														tooltip: "Refresh",
														handler: function() {
															this._t$/*toolbarHandler*/('cmd_refresh_field'); 
														},
														scope: this
													},
													{
														text: "Edit SQL",
														name: "edit_sql",
														hidden: true,
														handler: function() {
															this._t$/*toolbarHandler*/('cmd_edit_sql'); 
														},
														scope: this
													},
													{
														xtype: "checkbox",
														fieldLabel: "Allow Insert",
														name: "allow_insert",
														labelAlign: "right",
														boxLabel: IRm$/*resources*/.r1("B_ENABLE"),
														disabled: true,
														listeners: {
															change: function(tobj) {
																var me = this,
																	t2 = me.down("[name=t2]"); 
																
																t2.setVisible(tobj.getValue());
															},
															scope: this
														}
													},
													"->",
													{
														text: "Relations",
														handler: function() {
															this._t$/*toolbarHandler*/('cmd_rel_field'); 
														},
														scope: this
													},
													{
														text: "Update Alias",
														name: "m2",
														hidden: true,
														handler: function() {
															this._t$/*toolbarHandler*/('cmd_ref_alias'); 
														},
														scope: this
													}
            	    	    	    	    	]
            	    	    	    	    },
            	    	    	    	    {
            	    	    	    	    	xtype: "toolbar",
            	    	    	    	    	dock: "top",
            	    	    	    	    	name: "t2",
            	    	    	    	    	hidden: true,
            	    	    	    	    	items: [
													{
														xtype: "combobox",
														name: "file_field",
														labelAlign: "right",
														fieldLabel: "File Field",
														valueField: "value",
														displayField: "name",
														queryMode: "local",
														editable: false,
														store: {
															fields: [
																"name", "value"
															]
														}
													},
													{
														xtype: "combobox",
														name: "seq_field",
														labelAlign: "right",
														fieldLabel: "Unique Field",
														valueField: "value",
														displayField: "name",
														queryMode: "local",
														editable: false,
														store: {
															fields: [
																"name", "value"
															]
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
            	]
            }
		];
		
		this.listeners = {
			afterrender: function(tobj) {
				tobj._IFd/*init_f*/.call(tobj);
			}
		}

		IG$/*mainapp*/._I73/*tableManager*/.superclass.initComponent.call(this);
    }
});

IG$/*mainapp*/.A2Tw/*tableAlias*/ = $s.extend($s.window, {
	title: "Alias Loader",
	modal: true,
	region:'center',
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 500,
	autoHeight: true,
	
	plain: true,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	l1/*loadAliasFile*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
	            ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: ""}, "uid;dbtype;option"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "aliaslist"})
	        }, me, me.rs_l1/*loadAliasFile*/, null);
		req._l/*request*/();
	},
	
	rs_l1/*loadAliasFile*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			i, items = [], item,
			grdalias = me.down("[name=grdalias]");
		
		for (i=0; i < tnodes.length; i++)
		{
			item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			items.push(item);
		}
		
		grdalias.store.loadData(items);
	},
	
	l2/*loadAliasContent*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			grdalias = me.down("[name=grdalias]"),
			selmodel = grdalias.getSelectionModel(),
			sels = selmodel.getSelection(),
			files = [],
			alias,
			m, v, r,
			i,
			v_1;
		
		if (me._md)
		{
			alias = {};
			
			v_1 = me.down("[name=v_1]").getValue();
			v_1 = v_1.split("\n");
			for (i=0; i < v_1.length; i++)
			{
				r = v_1[i].indexOf(",");
				if (v_1[i] && r > -1)
				{
					m = v_1[i].substring(0, r);
					v = v_1[i].substring(r+1);
					
					if (m && v)
					{
						alias[m] = v;
					}
				}
			}
			
			if (me.callback)
			{
				me.callback.execute(alias);
				this.close();
			}
		}
		else
		{
			if (sels && sels.length > 0)
			{
				for (i=0; i < sels.length; i++)
				{
					files.push(sels[i].get("name"));
				}
				req.init(me, 
					{
			            ack: "11",
			            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({filenames: files.join("")}, "filenames"),
			            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "aliasnames"})
			        }, me, me.rs_l2/*loadAliasContent*/, null);
				req._l/*request*/();
			}
			else
			{
				if (me.callback)
				{
					me.callback.execute({});
					this.close();
				}
			}
		}
	},
	
	rs_l2/*loadAliasContent*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			i,
			alias = {},
			name, value;
		
		for (i=0; i < tnodes.length; i++)
		{
			name = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name");
			value = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
			alias[name] = value;
		}
		
		if (me.callback)
		{
			me.callback.execute(alias);
			this.close();
		}
	},
	
	c1/*changeMode*/: function(md) {
		var me = this;
		
		me._md = md;
		me.down("[name=b_1]").setText(md ? "Select File" : "Input Values");
		me.down("[name=m_1]").getLayout().setActiveItem(md);
	},
	
	initComponent : function() {
		var me = this;
		$s.apply(this, {
			
			border: 0,
			items: [
		        {
		        	xtype: "panel",
		        	border: 0,
		        	name: "m_1",
		        	layout: "card",
		        	bodyPadding: 10,
		        	height: 300,
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
									layout: "anchor",
									defaults: {
										anchor: "100%"
									},
									items: [
								        {
								        	xtype: "displayfield",
								        	value: "Select alias file"
								        }
									]
								},
								{
									xtype: "gridpanel",
									flex: 1,
									name: "grdalias",
									selType: "checkboxmodel",
									selModel: {
										checkSelector: ".x-grid-cell"
									},
									store: {
										xtype: "store",
										fields: [
										    "name"
										]
									},
									columns: [
								        {
								        	xtype: "gridcolumn",
								        	text: "Name",
								        	dataIndex: "name",
								        	flex: 1
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
									xtype: "container",
									layout: "anchor",
									defaults: {
										anchor: "100%"
									},
									items: [
								        {
								        	xtype: "displayfield",
								        	value: "Type values with ColumnName,AliasName"
								        }
									]
								},
								{
									xtype: "textarea",
									flex: 1,
									name: "v_1"
								}
							]
						}
		        	]
		        }
		        
			],
			buttons:[
				{
					text: "Input Values",
					name: "b_1",
					handler: function() {
						me.c1/*changeMode*/(me._md ? 0 : 1);
					},
					scope: this
				},
				"->",
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						me.l2/*loadAliasContent*/();
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
					me.l1/*loadAliasFile*/();
				}
			}
		});
		
		IG$/*mainapp*/.A2Tw/*tableAlias*/.superclass.initComponent.apply(this, arguments);
	}
});
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
IG$/*mainapp*/.c$sm7/*udg*/ = function() {
	
}

IG$/*mainapp*/.c$sm7/*udg*/.prototype = {
	m1$17/*parseContent*/: function(xdoc) {
		var me = this,
			rnode,
			i, j,
			fnode, child,
			tnode;
		
		rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item');
		me.iteminfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(rnode);
		me.fields = null;
		
		me.option = {};
		
		fnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item/options');
		if (fnode)
		{
			me.option.usesum = IG$/*mainapp*/._I1b/*XGetAttr*/(fnode, "usesum");
			me.option.expandall = IG$/*mainapp*/._I1b/*XGetAttr*/(fnode, "expandall");
		}
		
		fnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item/Fields');
		child = IG$/*mainapp*/._I26/*getChildNodes*/(fnode);
		
		if (child && child.length > 0)
		{
			me.fields = IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[0]);
		}
		
		fnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item/Data');
		
		me.data = [];
		me.storedata = [];
		
		if (fnode)
		{
			me.m1$a/*getSubDataHierarchy*/(fnode, me.data, me.storedata);
		}
	},
	
	m1$a/*getSubDataHierarchy*/: function(fnode, arr, sarr) {
		var child,
			i, j,
			cell, scell,
			valuenode,
			cnode,
			vmode, vnodes,
			ctype;
		
		child = IG$/*mainapp*/._I26/*getChildNodes*/(fnode);
		
		if (child && child.length > 0)
		{
			for (i=0; i < child.length; i++)
			{
				cell = IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[i]);
				valuenode = IG$/*mainapp*/._I19/*getSubNode*/(child[i], "values");
				vmode = valuenode ? IG$/*mainapp*/._I1b/*XGetAttr*/(valuenode, "mode") : null;
				ctype = cell.ctype;
				
				if (ctype == "formula")
				{
					cell.values = [];
					cell.syntax = IG$/*mainapp*/._I1a/*getSubNodeText*/(child[i], "syntax");
				}
				else
				{
					if (vmode == "1")
					{
						cell.values = [];
						
						vnodes = IG$/*mainapp*/._I26/*getChildNodes*/(valuenode);
						for (j=0; j < vnodes.length; j++)
						{
							cell.values.push(IG$/*mainapp*/._I24/*getTextContent*/(vnodes[j]));
						}
					}
					else
					{
						cell.values = IG$/*mainapp*/._I24/*getTextContent*/(valuenode).split(";");
					}
				}
				
				cnode = IG$/*mainapp*/._I19/*getSubNode*/(child[i], "children");
				arr.push(cell);
				scell = {
					leaf: true,
					gname: cell.gname,
					ctype: cell.ctype,
					values: cell.values.join("$^"),
					valuedesc: ctype == "formula" ? cell.syntax : cell.values.join(","),
					syntax: cell.syntax,
					checked: false
				};
				sarr.push(scell);
				if (cnode && cnode.hasChildNodes() == true)
				{
					cell.children = [];
					scell.children = [];
					scell.leaf = false;
					delete scell["checked"];
					this.m1$a/*getSubDataHierarchy*/(cnode, cell.children, scell.children);
				}
			}
		}
	},
	
	tmx/*getSubChild*/: function(arr, r) {
		var me = this,
			i, j, 
			gf;
			
		for (i=0; i < arr.length; i++)
		{
			r.push("<child");
			gf = arr[i];
			r.push(" gname='" + gf.gname + "'");
			r.push(" ctype='" + (gf.ctype || "") + "'>");
			if (gf.ctype == "formula")
			{
				r.push("<syntax><![CDATA[" + (gf.syntax || "") + "]]></syntax>");
			}
			else
			{
				r.push("<values mode='1'>");
				for (j=0; j < gf.values.length; j++)
				{
					r.push("<v><![CDATA[" + gf.values[j] + "]]></v>");
				}
				// <![CDATA[" + gf.values.join(";") + "]]>
				r.push("</values>");
			}
			if (gf.children && gf.children.length > 0)
			{
				r.push("<children>");
				me.tmx/*getSubChild*/(gf.children, r);
				r.push("</children>");
			}
			r.push("</child>");
		}
	},
	
	TX/*getXML*/: function() {
		var me = this,
			i, j, gf, r = [],
			iteminfo = me.iteminfo,
			fields = me.fields,
			data = me.data;
		
		r.push('<smsg><item uid="' + iteminfo.uid + '" name="' + iteminfo.name + '" type="' + iteminfo.type + '">');
		r.push("<options");
		r.push(" usesum='" + (me.option.usesum || "T") + "'");
		r.push(" expandall='" + (me.option.expandall || "F") + "'");
		r.push(">");
		r.push("</options>");
		r.push('<Fields>');
		if (fields)
		{
			r.push('<item name="' + fields.name + '" uid="' + fields.uid + '" type="' + fields.type + '" nodepath="' + fields.nodepath + '"/>');
		}
			
		r.push('</Fields>');
		r.push('<Data>');
		if (data && data.length > 0)
		{
			me.tmx/*getSubChild*/(data, r);
		}
		r.push("</Data>");
		r.push('</item></smsg>');
				
		return r.join("");
	}
}

IG$/*mainapp*/._Iab/*udgpanel*/ = $s.extend($s.panel, {
	uid: this.uid,
	
	bodyBorder: false,
	
	"layout": 'fit',
	
	fieldDefaults: {
		labelWidth: 160
	},
	
	lX/*loadedItem*/: {},
	
	_IFe/*initF*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(panel, 
			{
                ack: "5",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid}),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
            }, panel, panel.rs_sK5/*procLoadContent*/, null);
        req._l/*request*/();
	},
	
	rs_sK5/*procLoadContent*/: function(xdoc) {
		var me = this;
		me.clItem = new IG$/*mainapp*/.c$sm7/*udg*/();
		me.clItem.m1$17/*parseContent*/(xdoc);
		
		var targetitem = me.down("[name=targetitem]"),
			udgtree = me.down("[name=udgtree]"),
			usesum = me.down("[name=usesum]"),
			expandall = me.down("[name=expandall]");
			
		targetitem.setValue(me.clItem && me.clItem.fields ? me.clItem.fields.name : "");
		usesum.setValue(me.clItem && me.clItem.option && me.clItem.option.usesum == "F" ? false : true);
		expandall.setValue(me.clItem && me.clItem.option && me.clItem.option.expandall == "T" ? true : false);
		me.m1$a/*updateTreeNode*/(me.clItem.storedata);
		me.m1$18/*getParentCube*/();
	},
	
	m1$a/*updateTreeNode*/: function(data) {
		var me = this,
			item = this.clItem,
			udgtree = this.down("[name=udgtree]"),
			treedata = {
				gname: "User defined group",
				expanded: true,
				leaf: false,
				children: (data || [])
			};
			
		udgtree.store.setRootNode(treedata);
	},
	
	m1$18/*getParentCube*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel,
			{
				ack: "11",
                payload: '<smsg><item uid=\'' + this.uid + '\' parenttype="Cube;MCube;DataCube;SQLCube" read="F"/></smsg>',
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "parentcontent"})
			}, panel, panel.rs_getParentcube, null
		);
		
		req._l/*request*/();
	},
	
	rs_getParentcube: function(xdoc) {
		var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg'),
			cnode;
		
		if (tnode)
		{
			cnode = IG$/*mainapp*/._I17/*getFirstChild*/(tnode);
			
			if (cnode)
			{
				this.cubeuid = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, 'uid');
			}
		}
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			clItem = me.clItem,
			xdoc, i,
			udgtree = me.down("[name=udgtree]"),
			usesum = me.down("[name=usesum]"),
			expandall = me.down("[name=expandall]"),
			store = udgtree.store,
			root = store.getRootNode(),
			item;
		
		clItem.data = [];
		clItem.option.usesum = (usesum.getValue()) ? "T" : "F";
		clItem.option.expandall = (expandall.getValue()) ? "T" : "F";
		me.skm/*updateStoreTree*/(root, clItem.data);
		
		xdoc = me.clItem.TX/*getXML*/();
		
		me.sK6/*saveContent*/(me.uid, xdoc);
	},
	
	skm/*updateStoreTree*/: function(unode, arr) {
		var me = this,
			i,
			node,
			cell,
			mvalue;
		
		for (i=0; i < unode.childNodes.length; i++)
		{
			node = unode.childNodes[i];
			mvalue = node.get("values").split("$^");
			cell = {
				gname: node.get("gname"),
				ctype: node.get("ctype"),
				syntax: node.get("syntax"),
				values: mvalue
			};
			arr.push(cell);
			if (node.childNodes && node.childNodes.length > 0)
			{
				cell.children = [];
				me.skm/*updateStoreTree*/(node, cell.children);
			}
		}
	},
	
	sK6/*saveContent*/: function(uid, doc) {
    	var panel = this;
    	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	req.init(panel, 
			{
	            ack: "31",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
	            mbody: doc
	        }, panel, panel.rs_sK6/*saveContent*/, null);
		req._l/*request*/();
    },
	
	rs_sK6/*saveContent*/: function(xdoc) {
    	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SAVED'), null, null, 0, "success");
    	
    	this.wd._IG0/*closeDlgProc*/.call(this.wd);
    },
	
	selectItem: function(fieldname) {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
				visibleItems: 'workspace;folder;metric;tabdimension;measuregroupdimension',
				u5x/*treeOptions*/: {
					cubebrowse: true,
					rootuid: me.cubeuid
				},
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.P2C/*cubeSelectedHandler*/, fieldname)
			});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlgitemsel);
	},
	
	P2C/*cubeSelectedHandler*/: function(item, fieldname) {
		var me = this;
		
		me.clItem.fields = item;
			
		IG$/*mainapp*/._I2c/*setFieldValue*/(me, fieldname, 's', item.name);
	},
	
	Mex/*appendSelection*/: function() {
		var me = this,
			udgtree = me.down("[name=udgtree]"),
			store = udgtree.store,
			selmodel = udgtree.getSelectionModel(),
			pvaluedesc, pvalues,
			sel, ncell, i, nname, nmax = 0, cname;
		
		if (selmodel.selected.items.length > 0)
		{
			sel = selmodel.selected.items[0];
		}
		else
		{
			sel = udgtree.getRootNode();
		}
		
		pvaluedesc = sel.get("valuedesc");
		pvalues = sel.get("values");
		
		sel.set("valuedesc", "");
		sel.set("values", "");
		sel.set("leaf", false);
		
		nname = "new item ";
		
		for (i=0; i < sel.childNodes.length; i++)
		{
			cname = sel.childNodes[i].get("gname");
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
		
		nname += nmax;
		
		ncell = {
			gname: nname,
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
			udgtree = me.down("[name=udgtree]"),
			store = udgtree.store,
			root = store.getRootNode(),
			i;
			
		me.mrx/*removeSelectedRow*/(root);
	},
	
	mrx/*removeSelectedRow*/: function(root) {
		var me = this,
			i,
			node, pnode, gname, m;
		
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
		
		if (root.isRoot() == false && root.hasChildNodes() == false)
		{
			pnode = root.parentNode;
			gname = root.get("gname");
			m = 0;
			for (i=0; i < pnode.childNodes.length; i++)
			{
				if (pnode.childNodes[i] == root)
				{
					m = i;
					break;
				}
			}
			pnode.insertChild(m, {
				gname: gname,
				values: "",
				valuedesc: "",
				leaf: true,
				checked: false
			});
			pnode.removeChild(root, false, false, false);
		}
	},
	
	Mkx/*updateValues*/: function(rowindex, record) {
		var me = this,
			udgtree = me.down("[name=udgtree]"),
			store = udgtree.store;
			
		if (me.clItem && me.clItem.fields)
		{
			if (record.isRoot() == false) //  && record.childNodes.length == 0)
			{
				var field = me.clItem.fields;
				var vs = new IG$/*mainapp*/._IacU/*UDGvalueSelectWindow*/({
					field: field,
					rec: record,
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_m1$20/*editFilter*/, [record])
				});
				
				vs.show();
			}
		}
		else
		{
			IG$/*mainapp*/._I52/*ShowError*/("Select target item before change data items.", this);
		}
	},
	
	rs_m1$20/*editFilter*/: function(val, param) {
		var record = param[0],
			value = "",
			valuedesc = "",
			v,
			selvalues = val.selection,
			selmode = val.selmode,
			syntax = val.syntax,
			i;
		
		if (selmode == 2)
		{
			record.set("ctype", "formula");
			record.set("syntax", syntax);
			record.set("valuedesc", syntax);
		}
		else
		{
			record.set("ctype", "");
			
			for (i=0; i < selvalues.length; i++)
			{
				v = selvalues[i].code || selvalues[i].text;
				value += (i==0) ? v : "$^" + v;  
				valuedesc += (i==0) ? v : "," + v;
			}
			
			record.set("values", value);
			record.set("valuedesc", valuedesc);
		}
	},
	
	lx/*loadExternal*/: function() {
		var me = this;
		if (me.clItem && me.clItem.fields)
		{
		}
		else
		{
			IG$/*mainapp*/._I52/*ShowError*/("Select target item before loading external data files.", this);
		}
	},
	
	initComponent: function() {
		var panel = this;
		
		$s.apply(this, {
			items: [
				{
					xtype: 'panel',
					"layout": {
						type: "vbox",
						align: "stretch"
					},
					
					bodyStyle: 'padding: 5px',
					
					items: [
						{
							xtype: "fieldset",
							title: "Target options",
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
											name: "targetitem",
											fieldLabel: "Target Metric Item"
										},
										{
											xtype: "button",
											text: "..",
											handler:function() {
												this.selectItem('targetitem');
											},
											scope: this
										}
									]
								},
								{
									xtype: "button",
									text: "Import from excel file",
									hidden: true,
									handler: function() {
										this.lx/*loadExternal*/();
									},
									scope: this
								},
								{
									xtype: "checkbox",
									fieldLabel: "Use SUM on folder",
									name: "usesum",
									boxLabel: "Enable"
								},
								{
									xtype: "checkbox",
									fieldLabel: "Expand All",
									name: "expandall",
									boxLabel: "Enable"
								}
							]
						},
						{
							xtype: "treepanel",
							name: "udgtree",
							store: {
								xtype: "treestore",
								fields: [
					    			"gname", "values", "valuedesc", "ctype", "syntax"
								],
								folderSort: false
							},
							hideHeaders: true,
							rootVisible: true,
							useArrows: true,
							multiSelect: true,
							singleExpand: false,
							flex: 1,
							selModel: "SINGLE",
							tbar: [
								{
									xtype: "button", 
									text: "Add",
									handler: function() {
										var me = this;
										me.Mex/*appendSelection*/.call(me);
									},
									scope: this
								},
								{
									xtype: "button",
									text: "Remove",
									handler: function() {
										var me = this;
										me.Mrx/*removeSelection*/.call(me);
									},
									scope: this
								}
							],
							plugins: [
								{
									ptype: "cellediting",
									clicksToEdit: false
								}
							],
							columns: [
								{
									xtype: "treecolumn",
									text: "Group name",
									dataIndex: "gname",
									flex: 1,
									editor: {
										allowBlank: false
									}
								},
								{
									text: "Values",
									flex: 1,
									dataIndex: "valuedesc"
								},
								{
									xtype: "actioncolumn",
									width: 50,
									items: [
										{
											// icon: "./images/gears.png",
											iconCls: "icon-grid-config",
											tooltip: IRm$/*resources*/.r1("B_CONFIG_ITEM"),
											handler: function (grid, rowIndex, colIndex, item, e, record) {
												panel.Mkx/*updateValues*/(rowIndex, record);
											},
											scope: panel
										}
									]
								}
							],
							listeners: {
								checkchange: function(node, checked) {
									node.set("chekced", checked);
								},
								celldblclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
									var me = this;
									if (record.isRoot() == false && record.hasChildNodes() == true)
									{
										var dlg = new IG$/*mainapp*/._Iad/*udg_groupname*/({
											gname: record.get("gname"),
											callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, function(gname) {
												record.set("gname", gname);
											})
										});
										dlg.show(this);
										return false;
									}
								},
								scope: this
							}
						}
					]
				}
			]
		})
		
		IG$/*mainapp*/._Iab/*udgpanel*/.superclass.initComponent.apply(this);
	},
	
	listeners: {
		afterrender: function(ui) {
			var panel = this;
			
			setTimeout(function() {
				panel._IFe/*initF*/.call(panel);
			}, 100);
		}
	}
});

IG$/*mainapp*/._Iae/*udgdialog*/ = $s.extend($s.window, {
	
	modal: false,
	isWindow: true,
	region:'center',
	"layout": {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	width: 500,
	height: 400,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
		
		this.callback && this.callback.execute();
	},
	
	_IFf/*confirmDialog*/: function() {
		if (this.writable == true)
		{
			this._IH1/*mainpanel*/._IFf/*confirmDialog*/.call(this._IH1/*mainpanel*/);
		}
					
		this._IG0/*closeDlgProc*/();
	},
	
	initComponent : function() {
		this._IH1/*mainpanel*/ = new IG$/*mainapp*/._Iab/*udgpanel*/({
			uid: this.uid,
			writable: this.writable,
			wd: this
		});
		
		this.title = IRm$/*resources*/.r1('T_UDG');
				 
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
			    this._IH1/*mainpanel*/
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
			]
		});
		
		IG$/*mainapp*/._Iae/*udgdialog*/.superclass.initComponent.apply(this, arguments);
	}
});


IG$/*mainapp*/._Iad/*udg_groupname*/ = $s.extend($s.window, {
	
	isWindow: true,
	region:'center',
	"layout": {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	width: 230,
	autoHeight: true,
	modal: true,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var gname = this.down("[name=gname]").getValue();
		
		if (!gname)
			return;
		
		this.callback && this.callback.execute(gname);
					
		this._IG0/*closeDlgProc*/();
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1('T_UDG');
		
		this._IH1/*mainpanel*/ = new IG$/*mainapp*/._Iab/*udgpanel*/({
			uid: this.uid,
			writable: this.writable,
			wd: this
		});
				 
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
	        	        	fieldLabel: "Group name",
	        	        	allowBlank: false,
	        	        	name: "gname"
	        	        },
	        	        {
	        	        	xtype: "displayfield",
	        	        	value: "Set group name for this subject"
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
				afterrender: function(ui) {
					this.down("[name=gname]").setValue(this.gname || "");
				},
				scope: this
			}
		});
		
		IG$/*mainapp*/._Iad/*udg_groupname*/.superclass.initComponent.apply(this, arguments);
	}
});


IG$/*mainapp*/.c$s18/*clMeasure*/ = function() {
	var me = this;
	
	me.iteminfo;
	me.fields;
	me.expressiontype;
	me.expression;
	me.calcmode = false;
	
	me.cubeinfo = {
		styles: []
	};
	
	me.objinfo = {};
	me.fields = [];
}

IG$/*mainapp*/.c$s18/*clMeasure*/.prototype = {
	m1$17/*parseContent*/: function(xdoc) {
		var me = this,
			rnode,
			tnode,
			fnode,
			enode,
			mnode,
			gnode,
			objinfo,
			i,
			child;
		
		rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		me.iteminfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(rnode);
		
		objinfo = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/objinfo");
		fnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Fields");
		enode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Expression");
		mnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/mfilter");
		// gnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Grouping");
		
		me.fields = [];
		
		if (objinfo)
		{
			me.objinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(objinfo);
		}
		else
		{
			me.objinfo = {};
		}
		
		if (fnode)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(fnode);
			for (i=0; i < child.length; i++)
			{
				me.fields.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[i]));
			}
		}
		
		if (enode)
		{
			me.expressiontype = IG$/*mainapp*/._I1b/*XGetAttr*/(enode, "type");
			me.calcmode = IG$/*mainapp*/._I1b/*XGetAttr*/(enode, "calcmode") == "T";
			me.expression = IG$/*mainapp*/._I24/*getTextContent*/(enode);
		}
		
		me.mfilter = mnode ? IG$/*mainapp*/._I24/*getTextContent*/(mnode) : null;
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/cubeinfo");
		
		if (tnode)
		{
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "AppStyle/Default");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "appbase"
					});
				}
			}
			
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "AppStyle/Custom");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "appcustom"
					});
				}
			}
			
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "CubeStyle/Custom");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "cubestyle"
					});
				}
			}
		}
	},
	TX/*getXML*/: function() {
		var me = this,
			i, key,
			r = "<smsg><item uid='" + me.iteminfo.uid + "' name='" + me.iteminfo.name + "' type='" + me.iteminfo.type + "'>";
		
		if (me.objinfo)
		{
			r += "<objinfo";
			
			for (key in me.objinfo)
			{
				r += " " + key + "='" + me.objinfo[key] + "'";
			}
			
			r += "></objinfo>";
		}
		
		r += "<Fields>";
		for (i=0; i < me.fields.length; i++)
		{
			me.fields[i].type = me.fields[i].type || me.fields[i].itemtype;
			r += "<item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.fields[i], "name;uid;type;nodepath;memo", "s") + "/>";
		}
		
		r += "</Fields>";
		r += "<Expression type='" + me.expressiontype + "' calcmode='" + (me.calcmode == true ? "T" : "F") + "'><![CDATA[" + me.expression + "]]></Expression>";
		r += "<mfilter><![CDATA[" + (me.mfilter || "") + "]]></mfilter>";
		r += "</item></smsg>";
			
		return r;
	},
	
	cl/*copy*/: function() {
		var me = this,
			r = new IG$/*mainapp*/.c$s18/*clMeasure*/(),
			i;
			
		r.objinfo = me.objinfo;
		r.fields = [];
		
		for (i=0; i < me.fields.length; i++)
		{
			r.fields.push(me.fields[i]);
		}
		r.expressiontype = me.expressiontype;
		r.expression = me.expression;
		r.mfilter = me.mfilter;
		r.calcmode = me.calcmode;
	}
};

IG$/*mainapp*/._Ie1/*measureEditor*/ = $s.extend($s.window, {
	
	modal: false,
	isWindow: true,
	region:"center",
	"layout": "fit",
	
	closable: false,
	resizable:false,
	width: 500,
	height: 530,
	
	_ILa/*reportoption*/: null,
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var panel = this,
			dmode = panel.dmode,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			exptype = panel.down("[name=expressiontype]");
			
		exptype.setValue("([field])");
		
		if (dmode)
		{
			panel.rs_sK5s/*procLoadContent*/();
		}
		else
		{
			req.init(panel, 
				{
	                ack: "5",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
	                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "diagnostics"})
	            }, panel, panel.rs_sK5/*procLoadContent*/, null);
	        req._l/*request*/();
	    }
	},
	
	expressionChange: function(field, newvalue, oldvalue) {
		if (newvalue)
		{
			this.down("[name=expression]").setValue(newvalue);
		}
	},
	
	rs_sK5/*procLoadContent*/: function(xdoc) {
		var me = this;
			
		me.clItem = new IG$/*mainapp*/.c$s18/*clMeasure*/();
		me.clItem.m1$17/*parseContent*/(xdoc);
		
		me.rs_sK5s/*procLoadContent*/();
	},
	
	rs_sK5s/*procLoadContent*/: function() {
		var me = this,
			i,
			cpath,
			mpath, j,
			dp = [],
			item,
			optstyle = me.down("[name=optstyle]");
			
		cpath = me.clItem.iteminfo && me.clItem.iteminfo.nodepath ? me.clItem.iteminfo.nodepath.split("/") : null;
		
		if (cpath)
		{
			for (i=0; i < me.clItem.fields.length; i++)
			{
				mpath = me.clItem.fields[i].nodepath;
				mpath = (mpath ? mpath.split("/") : null);
				
				if (mpath)
				{
					for (j=mpath.length-1; j>=0; j--)
					{
						if (mpath[j] == cpath[j])
						{
							mpath.splice(j, 1);
						}
					}
					
					me.clItem.fields[i].cpath = mpath.join("/");
				}
			}
		}
		
		item = me.clItem;
		
		dp.push({disp: "--- select ---", name: ""});
		
		for (i=0; i < item.cubeinfo.styles.length; i++)
		{
			dp.push({disp: item.cubeinfo.styles[i].name, name: item.cubeinfo.styles[i].name, type: item.cubeinfo.styles[i].type});
		}
		optstyle.store.loadData(dp);
		optstyle.setValue(item.objinfo.itemstyle || "");
				
		me.datagrid.store.loadData(me.clItem.fields);
		me.down("[name=expression]").setValue(me.clItem.expression);
		me.down("[name=mfilter]").setValue(me.clItem.mfilter);
		
		var exptype = me.down("[name=expressiontype]");
		me.clItem.expressiontype = (me.clItem.expressiontype == "COUNT") ? "COUNT_DISTINCT" : me.clItem.expressiontype;
		exptype.setValue(me.clItem.expressiontype);
		exptype.on("change", me.expressionChange, me); 
		
		me.down("[name=calcmode]").setValue(me.clItem.calcmode);
		IG$/*mainapp*/.r___.a/*registertooltip*/(me.down("[name=calcmode]"), "calcmode");
		
		if (!me.dmode)
		{
			me.m1$18/*getParentCube*/();
		}
	},
	
	m1$18/*getParentCube*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel,
			{
				ack: "11",
                payload: "<smsg><item uid='" + panel.uid + "' parenttype='Cube;MCube;DataCube;SQLCube' read='F'/></smsg>",
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "parentcontent"})
			}, panel, panel.rs_getParentcube, null
		);
		
		req._l/*request*/();
	},
	
	rs_getParentcube: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			cnode;
		
		if (tnode)
		{
			cnode = IG$/*mainapp*/._I17/*getFirstChild*/(tnode);
			
			if (cnode)
			{
				me.cubeuid = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, "uid");
				me.cubepath = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, "nodepath");
			}
		}
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			t,
			meta, field, d, ctrl, panel = me,
			i, datagrid = me.down("[name=datagrid]");
		
		t = me.down("[name=expression]").getValue();
		me.clItem.expression = t;
		ctrl = me.down("[name=expressiontype]");
		t = ctrl.getValue();
		for (i=0; i < ctrl.store.data.items.length; i++)
		{
			if (ctrl.store.data.items[i].data.value == t)
			{
				me.clItem.expressiontype = ctrl.store.data.items[i].data.name;
			}
		}
		
		me.clItem.mfilter = me.down("[name=mfilter]").getValue();
		me.clItem.fields = [];
		for (i=0; i < datagrid.store.data.items.length; i++)
		{
			d = datagrid.store.data.items[i].data;
			field = {uid: d.uid, name: d.name, nodepath: d.nodepath, memo: d.memo, type: d.type};
			me.clItem.fields.push(field);
		}
		
		me.clItem.calcmode = me.down("[name=calcmode]").getValue();
		
		me.clItem.objinfo.itemstyle = me.down("[name=optstyle]").getValue();
		
		if (me.dmode)
		{
			me._IG0/*closeDlgProc*/({meta: meta, citem: me.clItem});
		}
		else
		{
			meta = me.clItem.TX/*getXML*/();
			
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
	                ack: "31",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid}),
	                mbody: meta
	            }, panel, panel.rs_sK6/*saveContent*/, null, null);
	        req._l/*request*/();
	    }
	},
	
	rs_sK6/*saveContent*/: function(xdoc) {
		this._IG0/*closeDlgProc*/();
	},
	
	_IG0/*closeDlgProc*/: function(param) {
		var me = this;
		
		me.callback && me.callback.execute(param);
		
		me.close();
	},
		
	mU$1/*editorItemName*/: function(itemname) {
		var expression = this.down("[name=expression]"),
			el = expression.inputEl.dom,
			v = expression.getRawValue(),
			s1 = -1,
			s2 = -1, sel, i;
			
		itemname = "[" + itemname + "]";
		
		if (v.length > 0)
		{
			var sm1 = -1,
				sm2 = -1;
					
			sel = $(el).getSelection();
			if (sel.length == 0)
			{
				// check if inside block and replace
				for (i=sel.start; i >= 0; i--)
				{
					if (v.charAt(i) == "[")
					{
						sm1 = i;
						break;
					}
					else if (v.charAt(i) == "]" || v.charAt(i) == ")" || v.charAt(i) == "(")
					{
						break;
					}
				}
				
				if (sm1 > -1)
				{
					for (i=sel.end; i < v.length; i++)
					{
						if (v.charAt(i) == "]")
						{
							sm2 = i+1;
							break;
						}
						else if (v.charAt(i) == "[" || v.charAt(i) == ")" || v.charAt(i) == "(")
						{
							break;
						}
					}
				}
			}
			else if (sel.start - 1 > -1 && sel.end < v.length && v.charAt(sel.start-1) == "[" && v.charAt(sel.end) == "]")
			{
				sel.start -= 1;
				sel.end += 1;
			}
			
			if (sm1 == -1 || sm2 == -1)
			{
				sm1 = sel.start;
				sm2 = sel.end;
			}
			
			// replace selection
			v = v.substring(0, sm1) + itemname + v.substring(sm2, v.length);
			s1 = sm1;
			s2 = sm1 + itemname.length;
		}
		else
		{
			v = itemname;
			s1 = 0;
			s2 = v.length;
		}
		
		expression.setValue(v);
		
		if (s1 > -1 && s2 > s1)
		{
			expression.selectText(s1, s2);
		}
	},
	
	selectItem: function(fieldname) {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
			visibleItems: "workspace;folder;metric;custommetric;tabdimension;measuregroupdimension;measure",
			u5x/*treeOptions*/: {
				cubebrowse: true,
				rootuid: me.cubeuid
			}
		});
		dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.P2C/*cubeSelectedHandler*/, fieldname);
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	},
	
	P2C/*cubeSelectedHandler*/: function(item, fieldname) {
		var me = this;
		
		if (fieldname == "grid")
		{
			var datagrid = me.down("[name=datagrid]"),
				i,
				rec,
				bexist = false;
			for (i=0; i < datagrid.store.data.items.length; i++)
			{
				rec = datagrid.store.data.items[i];
				if (rec.get("uid") == item.uid)
				{
					bexist = true;
					break;
				}
			}
			
			if (bexist == false)
			{
				if (me.cubepath)
				{
					item.cpath = item.nodepath.replace(me.cubepath, "");
				}
				else
				{
					item.cpath = item.nodepath;
				}
				datagrid.store.add(item);
			}
		}
	},
	
	initComponent : function() {
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_MEASURE");
		
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
							xtype: "form",
							border: 0,
							"layout": {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_SYNTAX"),
									flex: 1,
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
													name: "expressiontype",
													fieldLabel: IRm$/*resources*/.r1("L_TYPE"),
													xtype: "combobox",
													labelAlign: "left",
													labelWidth: 100,
													
													valueField: "value",
													displayField: "label",
													value: "",
													editable: false,
								
													store: {
														xtype: "store",
														fields: [
															"value", "label", "name"
														],
														data: [
															{label:"Custom", name: "CUSTOM", value:"([field])"},
							                                {label:"Distinct count", name: "COUNT_DISTINCT", value:"COUNT(DISTINCT [field])"},
							                                {label:"All count", name: "COUNT_ALL", value:"COUNT([field])"},
							                                {label:"Sum", name: "SUM", value:"SUM([field])"},
							                                {label:"Average", name: "AVERAGE", value:"AVG([field])"},
							                                {label:"Max", name: "MAX", value:"MAX([field])"},
							                                {label:"Min", name: "MIN", value:"MIN([field])"}
														]
													}
												},
												{
											    	name: "calcmode",
											    	boxLabel: "Calculate In Result",
											    	xtype: "checkbox",
											    	padding: "0 5 0"
											    }
											]
										},
										{
											name: "expression",
											xtype: "textarea",
											fieldLabel: IRm$/*resources*/.r1("L_SYNTAX"),
											labelWidth: 100
										},
										{
											name: "mfilter",
											xtype: "textarea",
											fieldLabel: IRm$/*resources*/.r1("L_M_FILTER"),
											labelWidth: 100
										},
										{
											xtype: "gridpanel",
											name: "datagrid",
											store: {
												xtype: "store",
												fields: [
													"name", "type", "delete", "uid", "nodepath", "memo", "cpath"
												]
											},
											stateful: true,
											flex: 1,
											
											viewConfig: {
												plugins: [
													{
														ptype: "gridviewdragdrop",
														ddGroup: "_I$RD_G_",
														enableDrop: true,
														enableDrag: false
													}
												],
												listeners: {
													beforedrop: function(node, data, dropRec, dropPosition, dropFunction, opts) {
														var r = false,
															index,
															i, bexist = false,
															rc = (data.records && data.records.length > 0) ? data.records[0] : null;
															
														(this == data.view) ? data.copy = false : data.copy = true;
														
														index = (dropRec) ? this.panel.store.indexOf(dropRec) : 0;
													        
														if (rc && rc.data.type == "Metric")
														{
															for (i=0; i < this.store.data.items.length; i++)
															{
																if (this.store.data.items[i].data.uid == rc.data.uid)
																{
																	bexist = true;
																	break;
																}
															}
															
															if (bexist == false)
															{
																this.store.add(rc.data);
															}
														}
															
														return r;
													},
													
													drop: function(node, data, dropRec, dropPosition, opts) {
														var dropOn = dropRec ? " " + dropPosition + " " + dropRec.get("name") : " on empty view";
														return false;
													}
												}
											},
											
											columns: [
												{
													text: "Name",
													flex: 1,
													sortable: false,
													dataIndex: "name"
												},
												{
													text: "Type",
													flex: 1,
													sortable: false,
													dataIndex: "type"
												},
												{
													text: "Path",
													flex: 1,
													sortable: false,
													dataIndex: "cpath"
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
												itemdblclick: function(view, record, item, index, event, Option) {
													this.mU$1/*editorItemName*/(record.data.name);
												},
												scope: this
											}
										},
										{
											xtype: "container",
											layout: {
												type: "hbox"
											},
											items: [
												{
													xtype: "displayfield",
													flex: 1,
													value: IRm$/*resources*/.r1("L_ME_DISP1")
												},
												{
													xtype: "button",
													text: "Add",
													handler: function() {
														this.selectItem("grid");
													},
													scope: this
												}
											]
										}
									]
								},
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_STYLE_OPTION"),
									"layout": "anchor",
									padding: "3 5",
									items: [
										{
											xtype: "combobox",
											name: "optstyle",
											fieldLabel: IRm$/*resources*/.r1("L_BASE_STYLE"),
											queryMode: 'local',
											displayField: 'disp',
											valueField: 'name',
											editable: false,
											autoSelect: true,
											store: {
												xtype: 'store',
												fields: [
													"name", "type", "disp"
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
//				{
//					text: IRm$/*resources*/.r1("B_HELP"),
//					handler: function() {
//						IG$/*mainapp*/._I63/*showHelp*/("P0022");
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
					panel.datagrid = panel.down("[name=datagrid]");
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/._Ie1/*measureEditor*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._IeNa/*clHierarchy*/ = function() {
	var me = this;
	
	me.iteminfo;
	me.fields;
	me.disptype;
	
	me.cubeinfo = {
		styles: []
	};
	
	me.objinfo = {};
	me.fields = [];
}

IG$/*mainapp*/._IeNa/*clHierarchy*/.prototype = {
	m1$17/*parseContent*/: function(xdoc) {
		var me = this,
			rnode,
			tnode,
			fnode,
			enode,
			gnode,
			objinfo,
			i,
			child;
		
		rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		me.iteminfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(rnode);
		
		objinfo = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/objinfo");
		fnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Fields");
		enode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/option");
		// gnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Grouping");
		
		me.fields = [];
		
		if (objinfo)
		{
			me.objinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(objinfo);
		}
		else
		{
			me.objinfo = {};
		}
		
		if (fnode)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(fnode);
			for (i=0; i < child.length; i++)
			{
				me.fields.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[i]));
			}
		}
		
		if (enode)
		{
			me.disptype = IG$/*mainapp*/._I1b/*XGetAttr*/(enode, "type");
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/cubeinfo");
		
		if (tnode)
		{
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "AppStyle/Default");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "appbase"
					});
				}
			}
			
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "AppStyle/Custom");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "appcustom"
					});
				}
			}
			
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "CubeStyle/Custom");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "cubestyle"
					});
				}
			}
		}
	},
	TX/*getXML*/: function() {
		var me = this,
			i, key,
			r = "<smsg><item uid='" + me.iteminfo.uid + "' name='" + me.iteminfo.name + "' type='" + me.iteminfo.type + "'>";
		
		if (me.objinfo)
		{
			r += "<objinfo";
			
			for (key in me.objinfo)
			{
				r += " " + key + "='" + me.objinfo[key] + "'";
			}
			
			r += "></objinfo>";
		}
		
		r += "<Fields>";
		for (i=0; i < me.fields.length; i++)
		{
			me.fields[i].type = me.fields[i].type || me.fields[i].itemtype;
			r += "<item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.fields[i], "name;uid;type;nodepath;memo", "s") + "/>";
		}
		
		r += "</Fields>";
		r += "<option type='" + me.disptype + "'></option>";
		r += "</item></smsg>";
			
		return r;
	},
	
	cl/*copy*/: function() {
		var me = this,
			r = new IG$/*mainapp*/.c$s18/*clMeasure*/(),
			i;
			
		r.objinfo = me.objinfo;
		r.fields = [];
		
		for (i=0; i < me.fields.length; i++)
		{
			r.fields.push(me.fields[i]);
		}
		r.disptype = me.disptype;
	}
};

IG$/*mainapp*/._IeN/*HierarchyEditor*/ = $s.extend($s.window, {
	
	modal: false,
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
	
	_ILa/*reportoption*/: null,
	
	callback: null,
	
	_IFe/*initF*/: function() {
		var panel = this,
			dmode = panel.dmode,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			disptype = panel.down("[name=disptype]");
			
		disptype.setValue("single");
		
		if (dmode)
		{
			panel.rs_sK5s/*procLoadContent*/();
		}
		else
		{
			req.init(panel, 
				{
	                ack: "5",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
	                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "diagnostics"})
	            }, panel, panel.rs_sK5/*procLoadContent*/, null);
	        req._l/*request*/();
	    }
	},
	
	rs_sK5/*procLoadContent*/: function(xdoc) {
		var me = this;
			
		me.clItem = new IG$/*mainapp*/._IeNa/*clHierarchy*/();
		me.clItem.m1$17/*parseContent*/(xdoc);
		
		me.rs_sK5s/*procLoadContent*/();
	},
	
	rs_sK5s/*procLoadContent*/: function() {
		var me = this,
			i,
			cpath,
			mpath, j,
			dp = [],
			disptype,
			item;
			
		cpath = me.clItem.iteminfo && me.clItem.iteminfo.nodepath ? me.clItem.iteminfo.nodepath.split("/") : null;
		
		if (cpath)
		{
			for (i=0; i < me.clItem.fields.length; i++)
			{
				mpath = me.clItem.fields[i].nodepath;
				mpath = (mpath ? mpath.split("/") : null);
				
				if (mpath)
				{
					for (j=mpath.length-1; j>=0; j--)
					{
						if (mpath[j] == cpath[j])
						{
							mpath.splice(j, 1);
						}
					}
					
					me.clItem.fields[i].cpath = mpath.join("/");
				}
			}
		}
		
		item = me.clItem;
				
		me.datagrid.store.loadData(me.clItem.fields);
		
		disptype = me.down("[name=disptype]");
		disptype.setValue(me.clItem.disptype || "single"); 
		
		if (!me.dmode)
		{
			me.m1$18/*getParentCube*/();
		}
	},
	
	m1$18/*getParentCube*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel,
			{
				ack: "11",
                payload: "<smsg><item uid='" + panel.uid + "' parenttype='Cube;MCube;DataCube;SQLCube' read='F'/></smsg>",
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "parentcontent"})
			}, panel, panel.rs_getParentcube, null
		);
		
		req._l/*request*/();
	},
	
	rs_getParentcube: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			cnode;
		
		if (tnode)
		{
			cnode = IG$/*mainapp*/._I17/*getFirstChild*/(tnode);
			
			if (cnode)
			{
				me.cubeuid = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, "uid");
				me.cubepath = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, "nodepath");
			}
		}
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			t,
			meta, field, d, ctrl, panel = me,
			i, datagrid = me.down("[name=datagrid]");
		
		ctrl = me.down("[name=disptype]");
		me.clItem.disptype = ctrl.getValue();
		
		me.clItem.fields = [];
		for (i=0; i < datagrid.store.data.items.length; i++)
		{
			d = datagrid.store.data.items[i].data;
			field = {uid: d.uid, name: d.name, nodepath: d.nodepath, memo: d.memo, type: d.type};
			me.clItem.fields.push(field);
		}
		
		if (me.dmode)
		{
			me._IG0/*closeDlgProc*/({meta: meta, citem: me.clItem});
		}
		else
		{
			meta = me.clItem.TX/*getXML*/();
			
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
	                ack: "31",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid}),
	                mbody: meta
	            }, panel, panel.rs_sK6/*saveContent*/, null, null);
	        req._l/*request*/();
	    }
	},
	
	rs_sK6/*saveContent*/: function(xdoc) {
		this._IG0/*closeDlgProc*/();
	},
	
	_IG0/*closeDlgProc*/: function(param) {
		var me = this;
		
		me.callback && me.callback.execute(param);
		
		me.close();
	},
		
	selectItem: function(fieldname) {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
				visibleItems: "workspace;folder;metric;custommetric;tabdimension;measuregroupdimension;measure",
				multiselect: 1,
				u5x/*treeOptions*/: {
					cubebrowse: true,
					rootuid: me.cubeuid
				},
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.P2C/*cubeSelectedHandler*/, fieldname)
			});
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	},
	
	P2C/*cubeSelectedHandler*/: function(items, fieldname) {
		var me = this;
		
		if (fieldname == "grid")
		{
			$.each(items, function(k, item) {
				var datagrid = me.down("[name=datagrid]"),
					i,
					rec,
					bexist = false;
				for (i=0; i < datagrid.store.data.items.length; i++)
				{
					rec = datagrid.store.data.items[i];
					if (rec.get("uid") == item.uid)
					{
						bexist = true;
						break;
					}
				}
				
				if (bexist == false)
				{
					if (me.cubepath)
					{
						item.cpath = item.nodepath.replace(me.cubepath, "");
					}
					else
					{
						item.cpath = item.nodepath;
					}
					datagrid.store.add(item);
				}
			});
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
		var panel = this;
		
		panel.title = IRm$/*resources*/.r1("T_MEASURE");
		
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
							xtype: "form",
							border: 0,
							"layout": {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_METRIC_ITEMS"),
									flex: 1,
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "fieldcontainer",
											layout: "hbox",
											items: [
												{
													name: "disptype",
													fieldLabel: IRm$/*resources*/.r1("L_TYPE"),
													xtype: "combobox",
													labelAlign: "left",
													labelWidth: 100,
													
													valueField: "value",
													displayField: "name",
													editable: false,
								
													store: {
														xtype: "store",
														fields: [
															"value", "name"
														],
														data: [
															{name: "Compact Layout", value: "single"},
															{name: "Outline Layout", value: "multi"}
														]
													}
												}
											]
										}
									]
								},
								{
									xtype: "gridpanel",
									name: "datagrid",
									store: {
										xtype: "store",
										fields: [
											"name", "type", "delete", "uid", "nodepath", "memo", "cpath"
										]
									},
									stateful: true,
									flex: 1,
									tbar: [
										{
											xtype: "toolbar",
											items: [
												{
													xtype: "button",
													text: "Up",
													handler: function() {
														var me = this,
															grd_data = me.down("[name=datagrid]");
															
														me._m2/*moveGridSelection*/(grd_data, -1);
													},
													scope: this
												},
												{
													xtype: "button",
													text: "Down",
													handler: function() {
														var me = this,
															grd_data = me.down("[name=datagrid]");
															
														me._m2/*moveGridSelection*/(grd_data, 1);
													},
													scope: this
												}
											]
										}
									],
									viewConfig: {
										plugins: [
											{
												ptype: "gridviewdragdrop",
												ddGroup: "_I$RD_G_",
												enableDrop: true,
												enableDrag: false
											}
										],
										listeners: {
											beforedrop: function(node, data, dropRec, dropPosition, dropFunction, opts) {
												var r = false,
													index,
													i, bexist = false,
													rc = (data.records && data.records.length > 0) ? data.records[0] : null;
													
												(this == data.view) ? data.copy = false : data.copy = true;
												
												index = (dropRec) ? this.panel.store.indexOf(dropRec) : 0;
											        
												if (rc && rc.data.type == "Metric")
												{
													for (i=0; i < this.store.data.items.length; i++)
													{
														if (this.store.data.items[i].data.uid == rc.data.uid)
														{
															bexist = true;
															break;
														}
													}
													
													if (bexist == false)
													{
														this.store.add(rc.data);
													}
												}
													
												return r;
											},
											
											drop: function(node, data, dropRec, dropPosition, opts) {
												var dropOn = dropRec ? " " + dropPosition + " " + dropRec.get("name") : " on empty view";
												return false;
											}
										}
									},
									
									columns: [
										{
											text: "Name",
											flex: 1,
											sortable: false,
											dataIndex: "name"
										},
										{
											text: "Type",
											flex: 1,
											sortable: false,
											dataIndex: "type"
										},
										{
											text: "Path",
											flex: 1,
											sortable: false,
											dataIndex: "cpath"
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
										itemdblclick: function(view, record, item, index, event, Option) {
											this.mU$1/*editorItemName*/(record.data.name);
										},
										scope: this
									}
								},
								{
									xtype: "container",
									layout: {
										type: "hbox"
									},
									items: [
										{
											xtype: "displayfield",
											flex: 1,
											value: IRm$/*resources*/.r1("L_ME_DISP1")
										},
										{
											xtype: "button",
											text: "Add",
											handler: function() {
												this.selectItem("grid");
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
					panel.datagrid = panel.down("[name=datagrid]");
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/._IeN/*HierarchyEditor*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Id8/*formulaEditor*/ = $s.extend($s.window, {
	
	modal: false,

	region:"center",
	
	isWindow: true,
	
	closeAction: "destroy",
	
	"layout": {
		type: "fit",
		align: "stretch"
	},
	
	closable: true,
	resizable:false,
	
	width: 500,
	height: 450,
	
	_ILa/*reportoption*/: null,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.callback && this.callback.execute();
		
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			t,
			item = me.clItem,
			meta, field, d, ctrl,
			i, datagrid = this.down("[name=datagrid]");
		
		t = me.down("[name=expression]").getValue();
		item.expression = t;

		item.fields = [];
		for (i=0; i < datagrid.store.data.items.length; i++)
		{
			d = datagrid.store.data.items[i].data;
			field = {uid: d.uid, name: d.name, nodepath: d.nodepath, memo: d.memo, type: d.type};
			item.fields.push(field);
		}
		
		item.objinfo.itemstyle = me.down("[name=optstyle]").getValue();
		
		meta = item.TX/*getXML*/();
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me, 
			{
                ack: "31",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid}),
                mbody: meta
            }, me, me.r_IFf/*confirmDialog*/, null);
        req._l/*request*/();
	},
	
	r_IFf/*confirmDialog*/: function(xdoc) {
		if (this.callback)
		{
			this.callback.execute();
		}
		
		this.close();
	},
	
	selectItem: function(fieldname) {
		var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
			visibleItems: "workspace;folder;metric;tabdimension;measuregroupdimension;measure;formulameasure",
			u5x/*treeOptions*/: {
				cubebrowse: true,
				rootuid: this.cubeuid
			}
		});
		dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.P2C/*cubeSelectedHandler*/, fieldname);
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	},
	
	P2C/*cubeSelectedHandler*/: function(item, fieldname) {
		var me = this;
		
		if (fieldname == "measure")
		{
			var datagrid = me.down("[name=datagrid]"),
				i,
				rec,
				bexist = false;
			for (i=0; i < datagrid.store.data.items.length; i++)
			{
				rec = datagrid.store.data.items[i];
				if (rec.get("uid") == item.uid)
				{
					bexist = true;
					break;
				}
			}
			
			if (bexist == false)
			{
				datagrid.store.add(item);
			}
		}
		
	},
	
	mU$1/*editorItemName*/: function(itemname) {
		var expression = this.down("[name=expression]"),
			el = expression.inputEl.dom,
			v = expression.getRawValue(),
			s1 = -1,
			s2 = -1, sel, i;
			
		itemname = "[" + itemname + "]";
		
		if (v.length > 0)
		{
			var sm1 = -1,
				sm2 = -1;
			
			$(el).focus();
			sel = $(el).getSelection();
			if (sel.length == 0)
			{
				sm1 = v.length;
				sm2 = v.length;
			}
			else if (sel.start - 1 > -1 && sel.end < v.length && v[sel.start-1] == "[" && v[sel.end] == "]")
			{
				sel.start -= 1;
				sel.end += 1;
			}
			
			if (sm1 == -1 || sm2 == -1)
			{
				sm1 = sel.start;
				sm2 = sel.end;
			}
			
			// replace selection
			v = v.substring(0, sm1) + itemname + v.substring(sm2, v.length);
			s1 = sm1;
			s2 = sm1 + itemname.length;
		}
		else
		{
			v = itemname;
			s1 = 0;
			s2 = v.length;
		}
		
		expression.setValue(v);
		
		if (s1 > -1 && s2 > s1)
		{
			expression.selectText(s1, s2);
		}
	},
	
	_IFd/*init_f*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(panel, 
			{
                ack: "5",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid}),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "diagnostics"})
            }, panel, panel.rs_sK5/*procLoadContent*/, null);
        req._l/*request*/();
	},
	
	rs_sK5/*procLoadContent*/: function(xdoc) {
		var me = this,
			datagrid = me.down("[name=datagrid]"),
			optstyle = me.down("[name=optstyle]"),
			dp = [],
			item;
			
		item = me.clItem = new IG$/*mainapp*/.c$s18/*clMeasure*/();
		me.clItem.m1$17/*parseContent*/(xdoc);
		
		datagrid.store.loadData(me.clItem.fields);
		me.down("[name=expression]").setValue(me.clItem.expression);
		
		dp.push({disp: "--- select ---", name: ""});
		
		for (i=0; i < item.cubeinfo.styles.length; i++)
		{
			dp.push({disp: item.cubeinfo.styles[i].name, name: item.cubeinfo.styles[i].name, type: item.cubeinfo.styles[i].type});
		}
		optstyle.store.loadData(dp);
		optstyle.setValue(item.objinfo.itemstyle || "");
		
		me.m1$18/*getParentCube*/();
	},
	
	m1$18/*getParentCube*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		req.init(panel,
			{
				ack: "11",
                payload: "<smsg><item uid='" + this.uid + "' parenttype='Cube;MCube;DataCube;SQLCube' read='F'/></smsg>",
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "parentcontent"})
			}, panel, panel.rs_getParentcube, null
		);
		
		req._l/*request*/();
	},
	
	rs_getParentcube: function(xdoc) {
		var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			cnode;
		
		if (tnode)
		{
			cnode = IG$/*mainapp*/._I17/*getFirstChild*/(tnode);
			
			if (cnode)
			{
				this.cubeuid = IG$/*mainapp*/._I1b/*XGetAttr*/(cnode, "uid");
			}
		}
	},
	
	initComponent : function() {
		var me = this;
		
		$s.apply(this, {
			title: IRm$/*resources*/.r1("T_FORMULA_MEASURE"),
			
			buttons: [
//				{
//					text: IRm$/*resources*/.r1("B_HELP"),
//					handler: function() {
//						IG$/*mainapp*/._I63/*showHelp*/("P0021");
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
						this._IG0/*closeDlgProc*/();
					},
					scope: this
				}
			],
			
			items: [
				{
					xtype: "container",
					padding: 5,
					bodyPadding: "5 5",
					"layout": {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1("L_SYNTAX_FORMULA"),
							defaultType: "textfield",
							layout: {
								type: "vbox",
								align: "stretch"
							},
							defaults: {
								labelWidth: 130
							},
							items: [
								{
									name: "expression",
									xtype: "textarea"
								},
								{
									xtype: "displayfield",
									value: IRm$/*resources*/.r1("L_FM_DISP1")
								}
							]
						},
						{
							xtype: "gridpanel",
							name: "datagrid",
							store: {
								fields: [
									"name", "type", "delete", "uid", "nodepath", "memo"
								]
							},
							stateful: true,
							height: 160,
							viewConfig: {
								stripeRows: true,
								
								plugins: {
									ptype: "gridviewdragdrop",
									ddGroup: "_I$RD_G_"
								},
								
								listeners: {
									beforedrop: function(node, data, dropRec, dropPosition, dropFunction) {
										var r = false,
											index,
											i, bexist = false,
											rc = (data.records && data.records.length > 0) ? data.records[0] : null;
											
										(this == data.view) ? data.copy = false : data.copy = true;
										
										index = (dropRec) ? this.panel.store.indexOf(dropRec) : 0;
									        
										if (rc && (rc.data.type == "Measure" || rc.data.type == "Metric" || rc.data.type == "MeasureGroup"  || rc.data.type == "TabDimension"))
										{
											for (i=0; i < this.store.data.items.length; i++)
											{
												if (this.store.data.items[i].data.uid == rc.data.uid)
												{
													bexist = true;
													break;
												}
											}
											
											if (bexist == false)
											{
												this.store.add(rc.data);
											}
										}
											
										return r;
									},
									
									drop: function(node, data, dropRec, dropPosition) {
										var dropOn = dropRec ? " " + dropPosition + " " + dropRec.get("name") : " on empty view";
										return false;
									}
								}
							},
							columns: [
								{
									text: IRm$/*resources*/.r1("B_NAME"),
									flex: 1,
									sortable: false,
									dataIndex: "name"
								},
								{
									text: IRm$/*resources*/.r1("B_TYPE"),
									flex: 1,
									sortable: false,
									dataIndex: "type"
								},
								{
									xtype: "actioncolumn",
									width: 50,
									items: [{
										// icon: "./images/delete.png",
										iconCls: "icon-grid-delete",
										tooltip: "Delete item",
										handler: function (grid, rowIndex, colIndex) {
											var store = grid.store,
												rec = store.getAt(rowIndex);
											store.remove(store.data.items[rowIndex]);
										}
									}]
								}
							],
							listeners: {
								itemdblclick: function(view, record, item, index, ev, options) {
									var name = record.data.name || "";
									
									if (name)
									{
										this.mU$1/*editorItemName*/(name);
									}
								},
								scope: this
							}
						},
						{
							xtype: "container",
							layout: {
								type: "hbox"
							},
							items: [
								{
									xtype: "displayfield",
									flex: 1,
									value: IRm$/*resources*/.r1("L_FM_DISP2")
								},
								{
									xtype: "button",
									text: "Add",
									handler: function() {
										this.selectItem("measure");
									},
									scope: this
								}
							]
						},
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1("L_STYLE_OPTION"),
							"layout": "anchor",
							padding: "3 5",
							items: [
								{
									xtype: "combobox",
									name: "optstyle",
									fieldLabel: IRm$/*resources*/.r1("L_BASE_STYLE"),
									queryMode: 'local',
									displayField: 'disp',
									valueField: 'name',
									editable: false,
									autoSelect: true,
									store: {
										xtype: 'store',
										fields: [
											"name", "type", "disp"
										]
									}
								}
							]
						}
					]
				}
			],
			listeners: {
				afterrender: function() {
					this._IFd/*init_f*/();
				}
			}
		});
		
		IG$/*mainapp*/._Id8/*formulaEditor*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._If7/*dateMetric*/ = $s.extend($s.window, {
	
	modal: true,
	
	"layout": 'fit',
	
	closable: false,
	resizable:false,
	
	width: 600,
	height: 400,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	editgrid: null,
	
	U1/*initControl*/: function() {
		var me = this,
			editgrid,
			egridbody = me.down("[name=editgrid]"),
			rop = me._ILa/*reportoption*/;
		
		if (!this.editgrid)
		{
			this.editgrid = new qigridview({
				columnfill: true
			});
		}
		
		editgrid = this.editgrid;
		editgrid.initialize.call(editgrid, null, $(egridbody.el.dom));
		
		if (rop.cubeuid && rop.cubeuid.length > 0)
		{
			me.cubeuid = rop.cubeuid;
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "5",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: rop.cubeuid}),
	                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "content"})
		        }, me, me.rs_U1/*initControl*/, null);
			req._l/*request*/();
		}
	},
	
	rs_U1/*initControl*/: function(xdoc) {
		var panel = this,
    		snode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
    		measurelist = panel.down("[name=measurelist]"),
    		i, measures = [], cols = [], measurecols,
    		cubemeta, item,
    		editgrid = this.editgrid;
    		
		panel.cubeaddress = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "nodepath");
		panel.MM1/*cubemeta*/ = new j$sP/*CMOLAPCubeMeta*/(panel.uid, xdoc);
		cubemeta = panel.MM1/*cubemeta*/;
		
		cols.push({
			type: "boolean",
			name: "Select",
			field: "select",
			width: 40
		});
		
		panel.dimensions = [];
		panel.measures = [];
		
		for (i=0; i < cubemeta.items.length; i++)
		{
			item = cubemeta.items[i];
			if (item.metrictype == "measure")
			{
				measures.push({
					name: item.name,
					uid: item.uid
				});
				
				panel.measures.push({
					name: item.name,
					uid: item.uid
				});
			}
			else
			{
				cols.push({
					type: "string",
					name: item.name,
					field: item.uid
				});
				
				panel.dimensions.push({
					name: item.name,
					uid: item.uid
				});
			}
		}
		
		measurecols = {
			name: "Measures",
			defaults: {
				minwidth: 80
			},
			columns: []
		};
		cols.push(measurecols);
		
		for (i=0; i < measures.length; i++)
		{
			measurecols.columns.push({
				name: measures[i].name,
				type: "numeric",
				field: measures[i].uid,
				formatstring: "#,###.##"
			});
		}
		
		measurelist.store.loadData(measures);
		editgrid.setColumns.call(editgrid, cols);
		editgrid.redraw.call(editgrid);
		panel.dataset = [];
	},
	
	U2/*processToolBar*/: function(cmd) {
		var panel = this,
			dataset = panel.dataset,
			editgrid = panel.editgrid,
			item = {},
			dimensions = panel.dimensions,
			measures = panel.measures,
			columns = editgrid.columns,
			i, j, value;
		
		switch (cmd)
		{
		case "cmd_addrow":
			editgrid.addRow.call(editgrid);
			break;
		case "cmd_remove_row":
			for (i=editgrid.rowcount - 1; i >=editgrid.fixedRow; i--)
			{
				cell = editgrid.getCellValue.call(editgrid, i, 0);
				if (cell.checked == true)
				{
					editgrid.removeRow.call(editgrid, i);
				}
			}
			break;
		case "cmd_apply_changes":
			var datainfo = "";
			for (i=editgrid.fixedRow; i<editgrid.rowcount; i++)
			{
				for (j=1; j < editgrid.colcount; j++)
				{
					cell = editgrid.getCellValue.call(editgrid, i, j);
					value = cell.code || cell.text || "";
					datainfo += columns[j].field + ":" + value + ",";
				}
				datainfo += "|";
			}
			
			if (datainfo != "")
			{
				panel.U3/*appendData*/(datainfo, false);
			}
			break;
		case "cmd_import":
			break;
		}
	},
	
	U3/*appendData*/: function(data, bclose) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "17",
                payload: "<smsg><item cubeuid='" + panel.cubeuid + "' action='AppendData'/></smsg>",
                mbody: "<smsg><Data><![CDATA[" + data + "]]></Data></List>"
	        }, panel, panel.rs_U3/*appendData*/, null, bclose);
		req._l/*request*/();
	},
	
	rs_U3/*appendData*/: function(xdoc, bclose) {
		if (bclose == false)
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SAVED'), null, null, 0, "success");
		}
		else
		{
			this.close();
		}
	},
	
	initComponent : function() {
		var me = this;
		me.title = IRm$/*resources*/.r1('L_MC_DATA_EDT');
		me.edt = new IG$/*mainapp*/._IC3/*multimetric*/({
			uid: me.uid
		});
		$s.apply(this, {
			defaults:{
				bodyStyle:'padding:0px'
			},
			
			"layout": 'fit',
			
			items: [
				{
					xtype: "container",
					layout: "border",
					items: [
						{
							xtype: "form",
							region: "north",
							hidden: true,
							layout: {
								type: "vbox"
							},
							items: [
								{
									xtype: "combobox",
									name: "measurelist",
									fieldLabel: "Measure",
									queryMode: "local",
									displayField: "name",
									valueField: "uid",
									editable: false,
									autoSelect: true,
									store: {
				        	    		fields: [
				        	    		    "name", "uid"
				        	    		]
				        	    	}
								}
							]
						},
						{
				    		name: "editgrid",
				    		region: "center",
				    		flex: 1,
				    		xtype: "container",
				    		listeners: {
								render: function() {
									me.U1/*initControl*/.call(me);
								}
							}
				    	}
					]
				}
			],
			
			dockedItems: [
				{
					xtype: "toolbar",
					dock: "top",
					items: [
						{
							xtype: "button",
							text: "Add row",
							handler: function() {
								me.U2/*processToolBar*/.call(me, "cmd_addrow");
							}
						},
						{
							xtype: "button",
							text: "Remove selected",
							handler: function() {
								me.U2/*processToolBar*/.call(me, "cmd_remove_row");
							}
						},
						"-",
						{
							xtype: "button",
							text: "Update on server",
							handler: function() {
								me.U2/*processToolBar*/.call(me, "cmd_apply_changes");
							}
						},
						"-",
						{
							xtype: "button",
							text: "Import from file",
							handler: function() {
								me.U2/*processToolBar*/.call(me, "cmd_import");
							}
						}
					]
				}
			],
			
			buttons:[
				{
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						var me = this;
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
		
		IG$/*mainapp*/._If7/*dateMetric*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._IA8a/*codemapping_panel*/ = $s.extend($s.panel, {
	region:"center",
	
	"layout": "anchor",
	defaults: {
		anchor: "100%"
	},
	
	callback: null,
	pitem: null,
	
	_IFf/*confirmDialog*/: function(cmd) {
		var me = this,
			cbschemas = me.down("[name=cbschemas]"),
			cbtable = me.down("[name=cbtable]"),
			cbfield = me.down("[name=cbfield]"),
			cbcodefield = me.down("[name=cbcodefield]"),
			cbsortfield = me.down("[name=cbsortfield]"),
			c_viewmode = me.down("[name=viewmode]"),
			c_displabel = me.down("[name=displabel]"),
			
			rftb1 = me.down("[name=rftb1]"),
			rftxt1 = me.down("[name=rftxt1]"),
			rftb2 = me.down("[name=rftb2]"),
			rftxt2 = me.down("[name=rftxt2]"),
			rftb3 = me.down("[name=rftb3]"),
			rftxt3 = me.down("[name=rftxt3]"),
			rftc1 = me.down("[name=rftc1]"),
			rftc2 = me.down("[name=rftc2]"),
			rftc3 = me.down("[name=rftc3]"),
			rfilter1, rfilter2, rfilter3,
			
			scname = cbschemas.getValue(),
			tname = cbtable.getValue(),
			fname = cbfield.getValue(),
			fcname = cbcodefield.getValue(),
			fsname = cbsortfield.getValue(),
			mfields = [
				"codeschema", "codetable", "codetableuid", 
				"codefield", "valuefield", "sortfield", 
				"codefilter1", "codefilter2", "codefilter3", 
				"codemapping", "viewmode", "displabel"
			];
		
		function getSel(obj, uid)
		{
			var i,
				item;
			for (i=0; i < obj.store.data.items.length; i++)
			{
				item = obj.store.data.items[i];
				if (item.get("uid") == uid)
				{
					return item;
				}
			}
			
			return null;
		}
		
		scname = getSel(cbschemas, scname);
		tname = getSel(cbtable, tname);
		fname = getSel(cbfield, fname);
		fcname = getSel(cbfield, fcname);
		fsname = getSel(cbfield, fsname);
		
		rftb1 = getSel(rftb1, rftb1.getValue());
		rftb2 = getSel(rftb2, rftb2.getValue());
		rftb3 = getSel(rftb3, rftb3.getValue());
		
		rftb1 = (rftb1 ? rftb1.get("nodepath") : null);
		rftb2 = (rftb2 ? rftb2.get("nodepath") : null);
		rftb3 = (rftb3 ? rftb3.get("nodepath") : null);
		
		rfilter1 = rftb1 && rftxt1.getValue() ? rftb1 + "|" + rftxt1.getValue() + "|" + rftc1.getValue() : null;
		rfilter2 = rftb2 && rftxt2.getValue() ? rftb2 + "|" + rftxt2.getValue() + "|" + rftc2.getValue() : null;
		rfilter3 = rftb3 && rftxt3.getValue() ? rftb3 + "|" + rftxt3.getValue() + "|" + rftc3.getValue() : null;
		
		var mname = "";
		
		if (fname && fname.get("nodepath"))
		{
			me.rec.set("edited", true);
			me.rec.set("codeschema", scname.get("uid"));
			me.rec.set("codetable", tname.get("nodepath"));
			me.rec.set("codetableuid", tname.get("uid"));
			me.rec.set("codefield", fcname.get("nodepath"));
			me.rec.set("valuefield", fname.get("nodepath"));
			if (fsname)
			{
				me.rec.set("sortfield", fsname.get("nodepath"));
			}
			me.rec.set("codefilter1", rfilter1);
			me.rec.set("codefilter2", rfilter2);
			me.rec.set("codefilter3", rfilter3);
			
			mname = tname.get("name") + "." + fname.get("name");
		}
		else
		{
			me.rec.set("edited", true);
			
			$.each(mfields, function(i, k) {
				me.rec.set(k, "");
			});
		}
		
		me.rec.set("codemapping", mname);
		me.rec.set("viewmode", c_viewmode.getValue());
		me.rec.set("displabel", c_displabel.getValue());
		
		if (me.pitem)
		{
			me.pitem.edited = true;
			
			$.each(mfields, function(i, k) {
				me.pitem[k] = me.rec.get(k);
			});
		}
	},
	
	sK3/*loadContent*/: function() {
		if (this.pooluid)
		{
			var panel=this,
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
		            ack: "25",
		        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.pooluid, option: "StoredContent"}, "uid;option"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
		        }, panel, panel.rs_sK3/*loadContent*/, null, null);
			req._l/*request*/();
		}
	},
	
	rs_sK3/*loadContent*/: function(xdoc) {
		var i, 
			tnode, tnodes,
			schema,
			schemas=[],
			ctrlschema=this.down("[name=cbschemas]");
			
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < tnodes.length; i++)
			{
				schema = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				schema.tables = [];
				schemas.push(schema);
			}
			
			ctrlschema.store.loadData(schemas, true);
			ctrlschema.setValue(this.rec.get("codeschema"));
		}
	},
	
	sK5/*loadTable*/: function(schema) {
		var panel=this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: schema.data.uid, option: "StoredContent"}, "uid;option"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
	        }, panel, panel.rs_sK5/*loadTable*/, null, schema);
		req._l/*request*/();
	},
	
	rs_sK5/*loadTable*/: function(xdoc, schema) {
		var i,
			tnode, tnodes,
			table,
			ctrltable=this.down("[name=cbtable]"),
			msel,
			rsel = this.rec.get("codetable");
			
		schema.data.tables = [];
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < tnodes.length; i++)
			{
				table = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				table.fields = [];
				schema.data.tables.push(table);
				if (table.nodepath == rsel)
				{
					msel = table.uid;
				}
			}
		}
		
		ctrltable.store.loadData(schema.data.tables, false);
		ctrltable.setValue(msel);
	},
	
	sK4/*loadField*/: function(table) {
		var panel=this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: table.data.uid, option: "StoredContent"}, "uid;option"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
	        }, panel, panel.rs_sK4/*loadField*/, null, table);
		req._l/*request*/();
	},
	
	rs_sK4/*loadField*/: function(xdoc, table) {
		var me = this,
			i, j,
			tnode, tnodes,
			field,
			ctrlfield = me.down("[name=cbfield]"),
			ctrlcodefield = me.down("[name=cbcodefield]"),
			ctrlsortfield = me.down("[name=cbsortfield]"),
			c_displabel = me.down("[name=displabel]"),
			c_viewmode = me.down("[name=viewmode]"),
			
			cf = me.rec.get("codefield"),
			cv = me.rec.get("valuefield"),
			cs = me.rec.get("sortfield"),
			viewmode = me.rec.get("viewmode"),
			displabel = me.rec.get("displabel"),
			
			cf1, cv1, cs1;
			
		table.data.fields = [];
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			for (i=0; i < tnodes.length; i++)
			{
				field = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				field.uid = field.uid || i;
				table.data.fields.push(field);
				
				if (field.nodepath == cf)
				{
					cf1 = field.uid;
				}
				if (field.nodepath == cv)
				{
					cv1 = field.uid;
				}
				if (field.nodepath == cs)
				{
					cs1 = field.uid;
				}
			}
		}
		
		ctrlfield.store.loadData(table.data.fields, false);
		ctrlcodefield.store.loadData(table.data.fields, false);
		ctrlcodefield.setValue(cf1);
		ctrlfield.setValue(cv1);
		
		ctrlsortfield.store.loadData(table.data.fields, false);
		ctrlsortfield.setValue(cs1);
		
		c_viewmode.setValue(viewmode || "");
		c_displabel.setValue(displabel || "");
		
		me.down("[name=rftb1]").store.loadData(table.data.fields, false);
		me.down("[name=rftb2]").store.loadData(table.data.fields, false);
		me.down("[name=rftb3]").store.loadData(table.data.fields, false);
		
		var mcval,
			f,
			fval, fpath, fop, ival, iop;
		
		for (i=1; i < 4; i++)
		{
			mcval = me.rec.get("codefilter" + i);
			if (mcval)
			{
				f = me.down("[name=rftb" + i + "]");
				fval = me.down("[name=rftxt" + i + "]");
				fop = me.down("[name=rftc" + i + "]");
				if (mcval.indexOf("|") > -1)
				{
					me.down("[name=rfilter" + i + "]").expand();
					fpath = mcval.substring(0, mcval.indexOf("|"));
					ival = mcval.substring(mcval.indexOf("|")+1);
					iop = "1";
					if (ival.indexOf("|") > -1)
					{
						iop = ival.substring(ival.indexOf("|")+1);
						ival = ival.substring(0, ival.indexOf("|"));
					}
					fval.setValue(ival);
					fop.setValue(parseInt(iop));
					
					for (j=0; j < table.data.fields.length; j++)
					{
						if (table.data.fields[j].nodepath == fpath)
						{
							f.setValue(table.data.fields[j].uid);
							break;
						}
					}
				}
			}
		}
	},
		
	initComponent : function() {
		var operatordp = [];
		
		$.each(IG$/*mainapp*/._IE1/*filteropcodes*/, function(key, value) {
			operatordp.push({value: value[0], name: value[1]});
		});
		
		$s.apply(this, {
			items: [
			    {
			    	xtype:"fieldset",
	    			checkboxToggle: this.d_m == "cmap" ? false : true,
	    			title: IRm$/*resources*/.r1("L_LOOKUP"),
	    			collapsed: false,
	    			"layout": "anchor",
	    			defaults: {
	    				anchor: "100%"
	    			},
			    	items: [
			    		{
			    			xtype: "combobox",
			    			name: "cbschemas",
			    			queryMode: "local",
			    			fieldLabel: IRm$/*resources*/.r1("L_SCHEMA"),
			    			displayField: "name",
			    			valueField: "uid",
			    			editable: false,
							autoSelect: false,
							store: {
								fields: [
									"name", "memo", "uid", "type", "nodepath"
								]
							},
							listeners: {
								change: function(field, newvalue, oldvalue) {
									if (newvalue)
									{
										var ctrlschema = this.down("[name=cbschemas]"),
											ctrltable = this.down("[name=cbtable]"),
											i, record;
											
										for (i=0; i < ctrlschema.store.data.items.length; i++)
										{
											record = ctrlschema.store.data.items[i];
											if (record.data.uid == newvalue)
											{
												if (record.data.tables && record.data.tables.length > 0)
												{
													ctrltable.store.loadData(record.data.tables, false);
												}
												else
												{
													this.sK5/*loadTable*/(record);
												}
												break;
											}
										}
									}
								},
								scope: this
							}
			    		},
			    		{
			    			xtype: "combobox",
			    			name: "cbtable",
			    			queryMode: "local",
			    			fieldLabel: "Table",
			    			displayField: "name",
			    			valueField: "uid",
			    			editable: false,
							autoSelect: false,
							store: {
								fields: [
									"name", "memo", "uid", "type", "nodepath"
								]
							},
							listeners: {
								change: function(field, newvalue, oldvalue) {
									if (newvalue)
									{
										var me = this,
											ctrltable = me.down("[name=cbtable]"),
											ctrlfield = me.down("[name=cbfield]"),
											ctrlcodefield = me.down("[name=cbcodefield]"),
											ctrlsortfield = me.down("[name=cbsortfield]"),
											i, record;
											
										for (i=0; i < ctrltable.store.data.items.length; i++)
										{
											record = ctrltable.store.data.items[i];
											if (record.data.uid == newvalue)
											{
												if (record.data.fields && record.data.fields.length > 0)
												{
													ctrlfield.store.loadData(record.data.fields, false);
													ctrlcodefield.store.loadData(record.data.fields, false);
													ctrlsortfield.store.loadData(record.data.fields, false);
													me.down("[name=rftb1]").store.loadData(record.data.fields, false);
													me.down("[name=rftb2]").store.loadData(record.data.fields, false);
													me.down("[name=rftb3]").store.loadData(record.data.fields, false);
												}
												else
												{
													this.sK4/*loadField*/(record);
												}
												break;
											}
										}
									}
								},
								scope: this
							}
			    		},
			    		{
			    			xtype: "combobox",
			    			name: "cbcodefield",
			    			queryMode: "local",
			    			fieldLabel: "Code Field",
			    			displayField: "name",
			    			valueField: "uid",
			    			editable: false,
			    			autoSelect: true,
			    			store: {
								fields: [
									"name", "memo", "uid", "type", "nodepath"
								]
							}
			    		},
			    		{
			    			xtype: "combobox",
			    			name: "cbfield",
			    			queryMode: "local",
			    			fieldLabel: "Value Field",
			    			displayField: "name",
			    			valueField: "uid",
			    			editable: false,
			    			autoSelect: true,
			    			store: {
								fields: [
									"name", "memo", "uid", "type", "nodepath"
								]
							}
			    		},
			    		{
			    			xtype: "combobox",
			    			name: "cbsortfield",
			    			queryMode: "local",
			    			fieldLabel: "Sort Field",
			    			displayField: "name",
			    			valueField: "uid",
			    			editable: false,
			    			autoSelect: true,
			    			store: {
								fields: [
									"name", "memo", "uid", "type", "nodepath"
								]
							}
			    		}
			    	]
			    },
			    {
			    	xtype: "fieldset",
			    	title: IRm$/*resources*/.r1("L_ADV_OPTION"),
			    	collapsed: false,
			    	layout: "anchor",
			    	defaults: {
			    		anchor: "100%"
			    	},
			    	items: [
			    		{
			    			xtype: "combobox",
			    			fieldLabel: "Data View",
			    			name: "viewmode",
			    			queryMode: "local",
			    			editable: false,
			    			valueField: "value",
			    			displayField: "name",
			    			store: {
			    				xtype: "store",
			    				fields: [
			    					"name", "value"
			    				],
			    				data: [
			    					{name: "Matching Values", value: ""},
			    					{name: "Show All Codes", value: "code"},
			    					{name: "Show All Values", value: "value"}
			    				]
			    			}
			    		},
			    		{
			    			xtype: "combobox",
			    			fieldLabel: "Label Value",
			    			name: "displabel",
			    			queryMode: "local",
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
			    		}
			    	]
			    },
			    {
			    	xtype:"fieldset",
			    	name: "rfilter1",
	    			checkboxToggle:true,
	    			title: "Range Filter 1st",
	    			collapsed: true,
	    			"layout": "anchor",
	    			defaults: {
	    				anchor: "100%"
	    			},
	    			items: [
	    				{
	    					xtype: "combobox",
	    					name: "rftb1",
	    					fieldLabel: "Filter Field",
	    					queryMode: "local",
	    					displayField: "name",
			    			valueField: "uid",
			    			editable: false,
			    			autoSelect: true,
			    			store: {
								fields: [
									"name", "memo", "uid", "type", "nodepath"
								]
							}
	    				},
	    				{
	    					xtype: "combobox",
	    					name: "rftc1",
	    					fieldLabel: IRm$/*resources*/.r1("L_OPERATOR"),
	    					queryMode: "local",
	    					displayField: "name",
	    					valueField: "value",
	    					editable: false,
	    					autoSelect: true,
	    					store: {
	    						fields: [
	    							"name", "value"
	    						],
	    						data: operatordp
	    					}
	    				},
	    				{
	    					xtype: "textfield",
	    					name: "rftxt1",
	    					fieldLabel: "Filter Value"
	    				}
	    			],
	    			listeners: {
	    				collapse: function(f, eOpts) {
	    					this.down("[name=rftb1]").setValue("");
	    					this.down("[name=rftxt1]").setValue("");
	    				}
	    			}
			    },
			    {
			    	xtype:"fieldset",
			    	name: "rfilter2",
	    			checkboxToggle:true,
	    			title: "Range Filter 2nd",
	    			collapsed: true,
	    			"layout": "anchor",
	    			defaults: {
	    				anchor: "100%"
	    			},
	    			items: [
	    				{
	    					xtype: "combobox",
	    					name: "rftb2",
	    					fieldLabel: "Filter Field",
	    					queryMode: "local",
	    					displayField: "name",
			    			valueField: "uid",
			    			editable: false,
			    			autoSelect: true,
			    			store: {
								fields: [
									"name", "memo", "uid", "type", "nodepath"
								]
							}
	    				},
	    				{
	    					xtype: "combobox",
	    					name: "rftc2",
	    					fieldLabel: IRm$/*resources*/.r1("L_OPERATOR"),
	    					queryMode: "local",
	    					displayField: "name",
	    					valueField: "value",
	    					editable: false,
	    					autoSelect: true,
	    					store: {
	    						fields: [
	    							"name", "value"
	    						],
	    						data: operatordp
	    					}
	    				},
	    				{
	    					xtype: "textfield",
	    					name: "rftxt2",
	    					fieldLabel: "Filter Value"
	    				}
	    			],
	    			listeners: {
	    				collapse: function(f, eOpts) {
	    					this.down("[name=rftb2]").setValue("");
	    					this.down("[name=rftxt2]").setValue("");
	    				}
	    			}
			    },
			    {
			    	xtype:"fieldset",
			    	name: "rfilter3",
	    			checkboxToggle:true,
	    			title: "Range Filter 3rd",
	    			collapsed: true,
	    			"layout": "anchor",
	    			defaults: {
	    				anchor: "100%"
	    			},
	    			items: [
	    				{
	    					xtype: "combobox",
	    					name: "rftb3",
	    					fieldLabel: "Filter Field",
	    					queryMode: "local",
	    					displayField: "name",
			    			valueField: "uid",
			    			editable: false,
			    			autoSelect: true,
			    			store: {
								fields: [
									"name", "memo", "uid", "type", "nodepath"
								]
							}
	    				},
	    				{
	    					xtype: "combobox",
	    					name: "rftc3",
	    					fieldLabel: IRm$/*resources*/.r1("L_OPERATOR"),
	    					queryMode: "local",
	    					displayField: "name",
	    					valueField: "value",
	    					editable: false,
	    					autoSelect: true,
	    					store: {
	    						fields: [
	    							"name", "value"
	    						],
	    						data: operatordp
	    					}
	    				},
	    				{
	    					xtype: "textfield",
	    					name: "rftxt3",
	    					fieldLabel: "Filter Value"
	    				}
	    			],
	    			listeners: {
	    				collapse: function(f, eOpts) {
	    					this.down("[name=rftb3]").setValue("");
	    					this.down("[name=rftxt3]").setValue("");
	    				}
	    			}
			    }
			]
		});
		
		IG$/*mainapp*/._IA8a/*codemapping_panel*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._IA8/*codemapping*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	
	"layout": "fit",
	
	closable: false,
	resizable:false,
	
	width: 400,
	height: 550,
	
	callback: null,
	pitem: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function(cmd) {
		var me = this;
		
		if (cmd == "clear")
		{
			if (me.callback)
			{
				me.callback.execute("clear");
				me._IG0/*closeDlgProc*/();
			}
		}
		else
		{
			me.p_1._IFf/*confirmDialog*/.call(me.p_1);
			
			me.callback && me.callback.execute();
			me._IG0/*closeDlgProc*/();
		}
	},
	
	sK3/*loadContent*/: function() {
		var me = this,
			p_1 = me.p_1 || me.down("[name=p_1]");
		
		me.p_1 = p_1;
		p_1.pooluid = me.pooluid;
		p_1.rec = me.rec;
		p_1.sK3/*loadContent*/.call(p_1);
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1("L_T_LOOKUP");
		
		$s.apply(this, {
			items: [
				{
					xtype: "container",
					layout: {
						type: "vbox",
						align: "stretch"
					},
					padding: 10,
					autoScroll: true,
					items: [
					    new IG$/*mainapp*/._IA8a/*codemapping_panel*/({
					    	name: "p_1",
					    	d_m: "cube"
					    })
					]
				}
			],
			
			buttons:[
//				{
//					text: IRm$/*resources*/.r1("B_HELP"),
//					handler: function() {
//						IG$/*mainapp*/._I63/*showHelp*/("P0004");
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
					text: IRm$/*resources*/.r1("L_CLEAR_LOOKUP"),
					handler: function() {
						this._IFf/*confirmDialog*/("clear");
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
					this.sK3/*loadContent*/();
				}
			}
		});
		
		IG$/*mainapp*/._IA8/*codemapping*/.superclass.initComponent.apply(this, arguments);
	}
});
/* file: dlgmetric.js */

IG$/*mainapp*/.c$bb/*metricInfo*/ = function() {
	var me = this;
	
	me.item = {};
	me.objectinfo = {};
	me.metric = null;
	me.geocode = {
		enable: false,
		geolat: null,
		geolng: null
	};
	me.cubeinfo = {
		styles: []
	};
}

IG$/*mainapp*/.c$bb/*metricInfo*/.prototype = {
	l1/*parseXML*/: function(xdoc) {
		var me = this,
			tnode, tnodes, mnode, vnode,
			i, tval, rfilter,
			codetable,
			geocode = me.geocode;
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		me.item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/objinfo");
		
		if (tnode)
		{
			// cubeuid;fieldid;itemstyle
			me.objectinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Metric");
		
		if (tnode)
		{
			me.metric = {
				name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "name"),
				fields: [
				]
			};
			
			tnode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "FieldInfo");
			
			if (tnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < tnodes.length; i++)
				{
					tval = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
					me.metric.fields.push(tval);
				}
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Metric/CodeTable");
		if (tnode)
		{
			codetable = me.codetable = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			codetable.rangefilter = [];
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "RangeFilter");
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					rfilter = {
						rangefield: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "rangefield"),
						value: ""
					};
					vnode = IG$/*mainapp*/._I18/*XGetNode*/(tnodes[i], "value");
					if (vnode)
					{
						rfilter.value = IG$/*mainapp*/._I24/*getTextContent*/(vnode) || "";
					}
					codetable.rangefilter.push(rfilter);
				}
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Metric/geocode");
		
		if (tnode)
		{
			geocode.enable = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "enable");
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "geolat");
			if (mnode)
			{
				geocode.geolat = IG$/*mainapp*/._I1c/*XGetAttrProp*/(mnode);
			}
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "geolng");
			if (mnode)
			{
				geocode.geolng = IG$/*mainapp*/._I1c/*XGetAttrProp*/(mnode);
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/mask");
		
		if (tnode)
		{
			me.masktype = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "type");
			me.maskpattern = IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "pattern");
			me.pattern_replace = IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "pattern_replace");
			me.aes_pp = IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "aes_pp");
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/cubeinfo");
		
		if (tnode)
		{
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "AppStyle/Default");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "appbase"
					});
				}
			}
			
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "AppStyle/Custom");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "appcustom"
					});
				}
			}
			
			mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "CubeStyle/Custom");
			
			if (mnode)
			{
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(mnode);
				for (i=0; i < tnodes.length; i++)
				{
					me.cubeinfo.styles.push({
						name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
						type: "cubestyle"
					});
				}
			}
		}
	},
	
	l2/*toXMLString*/: function() {
		var me = this,
			r = [],
			i,
			geocode = me.geocode;
		
		r.push("<smsg><item uid='" + me.item.uid + "'>");
		if (me.objectinfo)
		{
			r.push("<objinfo" + IG$/*mainapp*/._I21/*XUpdateInfo*/(me.objectinfo) + "/>");
		}
		if (me.metric)
		{
			r.push("<Metric name='" + (me.metric.name || "") + "'>");
			r.push("<FieldInfo>");
			for (i=0; i < me.metric.fields.length; i++)
			{
				r.push("<Field" + IG$/*mainapp*/._I21/*XUpdateInfo*/(me.metric.fields[i]) + "/>");
			}
			r.push("</FieldInfo>");
			
			if (me.codetable)
			{
				r.push("<CodeTable" + IG$/*mainapp*/._I21/*XUpdateInfo*/(me.codetable) + ">");
				r.push("<RangeFilter>");
				for (i=0; i < me.codetable.rangefilter.length; i++)
				{
					r.push("<Filter rangefield='" + me.codetable.rangefilter[i].rangefield + "'>");
					r.push("<value><![CDATA[" + me.codetable.rangefilter[i].value + "]]></value>");
					r.push("</Filter>");
				}
				r.push("</RangeFilter>");
				r.push("</CodeTable>");
			}
			
			if (geocode)
			{
				r.push("<geocode enable='" + (geocode.enable || "F") + "'>");
				if (geocode.geolat && geocode.geolat.uid)
				{
					r.push("<geolat uid='" + (geocode.geolat.uid || "") + "' name='" + geocode.geolat.name + "'/>");
				}
				if (geocode.geolng && geocode.geolng.uid)
				{
					r.push("<geolng uid='" + (geocode.geolng.uid || "") + "' name='" + geocode.geolng.name + "'/>");
				}
				r.push("</geocode>");
			}
			
			r.push("</Metric>");
			
			r.push("<mask type='" + (me.masktype || "") + "'>");
			r.push("<pattern><![CDATA[" + (me.maskpattern || "") + "]]></pattern>");
			r.push("<pattern_replace><![CDATA[" + (me.pattern_replace || "") + "]]></pattern_replace>");
			r.push("<aes_pp><![CDATA[" + (me.aes_pp || "") + "]]></aes_pp>");
			r.push("</mask>");
		}
		r.push("</item></smsg>");		
		
		return r.join("");
	}
};

IG$/*mainapp*/._Idf/*metricEditor*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable: true,
	width: 480,
	height: 520,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			item = me.item;
		
		if (item)
		{
			var i,
				optsortdir = me.down("[name=cb_sortdir]"),
				sortorder = optsortdir.getGroupValue(),
				cb_sorttype = me.down("[name=cb_sorttype]"),
				sorttype = me.down("[name=cb_sorttype]").getGroupValue(),
				optstyle = me.down("[name=optstyle]"),
				optremoveblank = me.down("[name=optremoveblank]"),
				isdatetype = me.down("[name=isdatetype]"),
				dateformat = me.down("[name=dateformat]"),
				usegeocode = me.down("[name=usegeocode]"),
				fname = me.down("[name=fname]"),
				datenames = IG$/*mainapp*/._I4c/*majordateformat*/,
				datemap = {},
				ndateitems = "",
				ditems,
				ditem,
				objectinfo = item.objectinfo,
				fields = item.metric ? item.metric.fields : null,
				geocode = item.geocode,
				nodepath;
			
			objectinfo.sortorder = (sortorder == "") ? null : sortorder;
			objectinfo.sorttype = (sorttype == "") ? null : sorttype;
			objectinfo.removeblank = optremoveblank.getValue();
			objectinfo.itemstyle = optstyle.getValue();
			objectinfo.isdatetype = (isdatetype.getValue() ? "T" : "F");
			objectinfo.dateformat = dateformat.getValue();
			objectinfo.optsortitemuid = me.optsortitemuid;
			objectinfo.optsortitemname = me.optsortitemname;
			objectinfo.optdispitemname = me.optdispitemname;
			objectinfo.optdispitemuid = me.optdispitemuid;
			geocode.enable = usegeocode.getValue() == true ? "T" : "F";
			
			item.masktype = me.down("[name=masktype]").getValue();
			item.maskpattern = me.down("[name=mpattern]").getValue();
			item.pattern_replace = me.down("[name=mpattern_rep]").getValue();
			item.aes_pp = me.down("[name=aes_passph]").getValue();
			
			if (fields && fields.length && fname.getValue())
			{
				fields[0].name = fname.getValue();
				nodepath = fields[0].nodepath;
				nodepath = nodepath.substring(0, nodepath.lastIndexOf("/")) + "/" + fields[0].name;
				fields[0].nodepath = nodepath;
			}
			
			if (me.geolatuid && me.geolatname)
			{
				geocode.geolat = {
					uid: me.geolatuid,
					name: me.geolatname
				};
			}
			if (me.geolnguid && me.geolngname)
			{
				geocode.geolng = {
					uid: me.geolnguid,
					name: me.geolngname
				};
			}
			
			objectinfo.dateitems = "CUSTOM"; // ndateitems;
			objectinfo.datecustom = me.down("[name=t_dateformat]").getValue();
		}
		
		if (me.callback)
		{
			me.callback.execute(item);
			
			me._IG0/*closeDlgProc*/();
		}
		else
		{
			var panel = this,
	    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
	    		cnt = item.l2/*toXMLString*/.call(item);
	    		
	    	req.init(panel, 
				{
		            ack: "31",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
		            mbody: cnt
		        }, panel, panel.rs_fV6/*saveContent*/, null);
			req._l/*request*/();
		}
	},
	
	rs_fV6/*saveContent*/: function(xdoc) {
    	this._IG0/*closeDlgProc*/();
    },
	
	_IFd/*init_f*/: function() {
		var panel = this;
		
		panel.formulas = [];
		
		if (panel.uid)
		{
			panel.a2/*loadItemContent*/();
		}
	},
	
	a1/*applyItemInfo*/: function() {
		var me = this,
			item = me.item,
			objectinfo = item.objectinfo,
			i,
			sortorder = objectinfo.sortorder || "",
			optsortdir = me.down("[name=optsortdir]"),
			sorttype = objectinfo.sorttype || "",
			optsorttype = me.down("[name=optsorttype]"),
			optstyle = me.down("[name=optstyle]"),
			optremoveblank = me.down("[name=optremoveblank]"),
			optsortitemname = me.down("[name=optsortitemname]"),
			optdispitemname = me.down("[name=optdispitemname]"),
			isdatetype = me.down("[name=isdatetype]"),
			dateformat = me.down("[name=dateformat]"),
			usegeocode = me.down("[name=usegeocode]"),
			cmap_disp = me.down("[name=cmap_disp]"),
			fname = me.down("[name=fname]"),
			masktype = me.down("[name=masktype]"),
			datenames = IG$/*mainapp*/._I4c/*majordateformat*/,
			ditems, dp = [],
			geocode = item.geocode,
			fields = item.metric ? item.metric.fields : null;
		
		optsortdir.setValue({cb_sortdir: [sortorder]});
		optsorttype.setValue({cb_sorttype: [sorttype]});
		optremoveblank.setValue(objectinfo.removeblank || false);
		isdatetype.setValue(objectinfo.isdatetype == "T" || false);
		dateformat.setValue(objectinfo.dateformat || "");
		usegeocode.setValue(geocode.enable == "T");
		cmap_disp.setValue(objectinfo.cmap_disp || "");
		fname.setValue(fields && fields.length ? fields[0].name : "");
		masktype.setValue(objectinfo.masktype || "");
		
		me.geolnguid = geocode.geolng ? geocode.geolng.uid : null;
		me.geolngname = geocode.geolng ? geocode.geolng.name : null;
		me.geolatuid = geocode.geolat ? geocode.geolat.uid : null;
		me.geolatname = geocode.geolat ? geocode.geolat.name : null;
		
		me.down("[name=geolat]").setValue(me.geolatname);
		me.down("[name=geolng]").setValue(me.geolngname);
		
		if (objectinfo.optsortitemuid)
		{
			optsortitemname.setValue(objectinfo.optsortitemname);
			me.optsortitemuid = objectinfo.optsortitemuid;
			me.optsortitemname = objectinfo.optsortitemname;
		}
		
		if (objectinfo.optdispitemuid)
		{
			optdispitemname.setValue(objectinfo.optdispitemname);
			me.optdispitemuid = objectinfo.optdispitemuid;
			me.optdispitemname = objectinfo.optdispitemname;
		}
		
		me.down("[name=masktype]").setValue(item.masktype || "");
		me.down("[name=mpattern]").setValue(item.maskpattern || "");
		me.down("[name=mpattern_rep]").setValue(item.pattern_replace || "");
		me.down("[name=aes_passph]").setValue(item.aes_pp || "");
		
		me.down("[name=optsortitem]").setVisible(objectinfo.cubetype == "SQLCube" || objectinfo.cubetype == "Cube");
		me.down("[name=optdispitem]").setVisible(objectinfo.cubetype == "SQLCube" || objectinfo.cubetype == "Cube");
		
		dp.push({disp: "--- select ---", name: "", type: ""});
		
		for (i=0; i < item.cubeinfo.styles.length; i++)
		{
			dp.push({disp: item.cubeinfo.styles[i].name, name: item.cubeinfo.styles[i].name, type: item.cubeinfo.styles[i].type});
		}
		optstyle.store.loadData(dp);
		
		optstyle.setValue(objectinfo.itemstyle || "");
		
//		if (objectinfo.dateitems)
//		{
//			ditems = objectinfo.dateitems.split(";");
//			for (i=0; i < ditems.length; i++)
//			{
//				me.down("[name=datediv_" + ditems[i] + "]").setValue(true);
//			}
//		}
		
		me.down("[name=t_dateformat]").setValue(objectinfo.datecustom || "");
	},
	
	a2/*loadItemContent*/: function() {
		var panel = this,
			req;
			
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            cacheid: "",
			    refresh: "",
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'diagnostics'})
	        }, panel, panel.rs_a2/*loadItemContent*/, false);
		req._l/*request*/();
	},
	
	rs_a2/*loadItemContent*/: function(xdoc) {
		var me = this,
			item = new IG$/*mainapp*/.c$bb/*metricInfo*/();
			
		item.l1/*parseXML*/.call(item, xdoc);
		me.item = item;
		
		me.a1/*applyItemInfo*/();
	},
	
	cdt/*changeDateFormat*/: function() {
		var me = this,
			dateformat = me.down("[name=dateformat]"),
			dt = ""; // optdateformat.getValue();
			
		dateformat.setValue(dt);
	},
	
	P2C/*cubeSelectedHandler*/: function(fname) {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
			visibleItems: fname == "codemap" ? "workspace;folder;codemap" : "workspace;folder;metric;tabdimension;measuregroupdimension",
			u5x/*treeOptions*/: {
				cubebrowse: true,
				rootuid: fname == "codemap" ? "/SYS_Lookup" : me.item.objectinfo.cubeuid
			},
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_P2C/*cubeSelectedHandler*/, fname)
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlgitemsel);
	},
	
	rs_P2C/*cubeSelectedHandler*/: function(sitem, fname) {
		var me = this,
			item = me.item,
			objectinfo = item.objectinfo;
		
		if (fname == "codemap")
		{
			item.objectinfo.cmap_uid = sitem.uid;
			item.objectinfo.cmap_disp = sitem.name;
			me.down("[name=cmap_disp]").setValue(sitem.name);
		}
		else if (fname == "optsortitemname")
		{
			me.optsortitemuid = sitem.uid;
			me.optsortitemname = sitem.name;
			me.down("[name=optsortitemname]").setValue(sitem.name);
		}
		else if (fname == "optdispitemname")
		{
			me.optdispitemuid = sitem.uid;
			me.optdispitemname = sitem.name;
			me.down("[name=optdispitemname]").setValue(sitem.name);
		}
		else if (fname == "geolat")
		{
			me.geolatuid = sitem.uid;
			me.geolatname = sitem.name;
			me.down("[name=geolat]").setValue(sitem.name);
		}
		else if (fname == "geolng")
		{
			me.geolnguid = sitem.uid;
			me.geolngname = sitem.name;
			me.down("[name=geolng]").setValue(sitem.name);
		}
	},
	
	initComponent : function() {
		var i, 
			panel=this,
			customstyles = [],
			styles = panel.styles,
			pitmes = [
				{
					text: "Email",
					handler: function() {
						var me = this,
							mpattern = me.down("[name=mpattern]"),
							mpattern_rep = me.down("[name=mpattern_rep]");
						mpattern.setValue("(^[^@]{3}|(?!^)\\G)[^@]");
						mpattern_rep.setValue("$1*");
						
					},
					scope: this
				}
			],
			patterns = ig$/*appoption*/.patterns;
		
		if (patterns)
		{
			$.each(patterns, function(i, pt) {
				pitems.push({
					text: pt.name,
					handler: function() {
						var me = this,
							mpattern = me.down("[name=mpattern]"),
							mpattern_rep = me.down("[name=mpattern_rep]");
						
						mpattern.setValue(pt.value);
						pt.replace && mpattern_rep.setValue(pt.replace);
					},
					scope: this
				});
			});
		}
		
		panel.title = IRm$/*resources*/.r1("T_METRIC_SETTING");
		customstyles.push({name: "-Item Default-", value: ""});
		
		if (styles && styles.length > 0)
		{
			for (i=0; i < styles.length; i++)
			{
				customstyles.push({name: styles[i].name, value: styles[i].name});
			}
		}
		
		$s.apply(panel, {
			bodyStyle: 'padding:5px; background: #ffffff',
			border: 0,
			items: [
				{
					xtype: "panel",
					"layout": "fit",
					padding: "5 5",
					items: [
						{
							xtype: "tabpanel",
							items: [
								{
									xtype: "panel",
									layout: "anchor",
									autoScroll: true,
									bodyPadding: "5 5",
									title: "General Options",
									defaults: {
										anchor: "100%"
									},	
									items: [
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_SORT_SEL"),
											"layout": "anchor",
											padding: "0 5",
											defaults: {
												anchor: "100%"
											},
											items: [
												{
													xtype: "radiogroup",
											    	name: "optsortdir",
											    	fieldLabel: IRm$/*resources*/.r1("L_SORT_ORD"),
											    	padding: "0 5",
									            	plain: true,
													items: [
														{boxLabel: IRm$/*resources*/.r1("B_DEFAULT"), name: "cb_sortdir", inputValue: "", checked: true},
														{boxLabel: IRm$/*resources*/.r1("B_ASC"), name: "cb_sortdir", inputValue: "asc"},
														{boxLabel: IRm$/*resources*/.r1("B_DSC"), name: "cb_sortdir", inputValue: "desc"}
													]
												},
												{
													xtype: "radiogroup",
													name: "optsorttype",
													fieldLabel: IRm$/*resources*/.r1("L_SORT_TP"),
													padding: "0 5",
													plain: true,
													items: [
														{boxLabel: IRm$/*resources*/.r1("B_DEFAULT"), name: "cb_sorttype", inputValue: "", checked: true},
														{boxLabel: IRm$/*resources*/.r1("B_STRING"), name: "cb_sorttype", inputValue: "VARCHAR"},
														{boxLabel: IRm$/*resources*/.r1("B_NUMERIC"), name: "cb_sorttype", inputValue: "NUMBER"}
													]
												},
												{
													xtype: "fieldcontainer",
													name: "optdispitem",
													fieldLabel: IRm$/*resources*/.r1("L_F_DISP"),
													hidden: true,
													layout: {
														type: "hbox",
														align: "stretch"
													},
													items: [
														{
															xtype: "textfield",
															name: "optdispitemname",
															flex: 1
														},
														{
															xtype: "button",
															text: "..",
															handler: function() {
																this.P2C/*cubeSelectedHandler*/("optdispitemname");
															},
															scope: this
														},
														{
															xtype: "button",
															text: IRm$/*resources*/.r1("B_CLEAR"),
															handler: function() {
																var me = this;
																me.optdispitemname = null;
																me.optdispitemuid = null;
																me.down("[name=optdispitemname]").setValue("");
															},
															scope: this
														}
													]
												},
												{
													xtype: "fieldcontainer",
													name: "optsortitem",
													fieldLabel: IRm$/*resources*/.r1("L_F_SORT"),
													hidden: true,
													layout: {
														type: "hbox",
														align: "stretch"
													},
													items: [
														{
															xtype: "textfield",
															name: "optsortitemname",
															flex: 1
														},
														{
															xtype: "button",
															text: "..",
															handler: function() {
																this.P2C/*cubeSelectedHandler*/("optsortitemname");
															},
															scope: this
														},
														{
															xtype: "button",
															text: IRm$/*resources*/.r1("B_CLEAR"),
															handler: function() {
																var me = this;
																me.optsortitemname = null;
																me.optsortitemuid = null;
																me.down("[name=optsortitemname]").setValue("");
															},
															scope: this
														}
													]
												}
												
											]
										},
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_STYLE_OPTION"),
											"layout": "anchor",
											padding: "3 5",
											items: [
												{
													xtype: "combobox",
													name: "optstyle",
													fieldLabel: IRm$/*resources*/.r1("L_BASE_STYLE"),
													queryMode: 'local',
													displayField: 'disp',
													valueField: 'name',
													editable: false,
													autoSelect: true,
													store: {
														xtype: 'store',
														fields: [
															"name", "type", "disp"
														]
													}
												}
											]
										},
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_OTHER_OPTION"),
											layout: "anchor",
											padding: "3 5",
											defaults: {
												anchor: "100%"
											},
											items: [
												{
													xtype: "checkbox",
													name: "optremoveblank",
													boxLabel: IRm$/*resources*/.r1("L_REM_BLK")
												},
												{
													xtype: "checkbox",
													name: "isdatetype",
													boxLabel: IRm$/*resources*/.r1("L_DATE_TYPE"),
													// hidden: true,
													listeners: {
														change: function(field, nvalue, ovalue, eOpts) {
															var me = this,
																isdatetype = field.getValue(),
																t_format = me.down("[name=t_format]"),
																d_format = me.down("[name=d_format]"),
																customdatetypecontainer = me.down("[name=customdatetypecontainer]");
																// datediv_CUSTOM = me.down("[name=datediv_CUSTOM]");
																
															t_format.setVisible(isdatetype);
															d_format.setVisible(isdatetype);
														},
														scope: this
													}
												},
												{
													xtype: "fieldcontainer",
													fieldLabel: IRm$/*resources*/.r1("L_DATE_FORMAT_SRC"),
													name: "d_format",
													labelWidth: 130,
													hidden: true,
													layout: {
														type: "hbox",
														align: "stretch"
													},
													items: [
														{
															xtype: "textfield",
															name: "dateformat",
															flex: 1
															// fieldLabel: "Date format"
														},
														{
															xtype: "button",
															text: "Example",
															menu: {
																items: [
																	{
																		text: "2001.07.04 AM 12:08:56", 
																		value: "yyyy.MM.dd a HH:mm:ss",
																		handler: function() {
																			var dateformat = panel.down("[name=dateformat]");
																			dateformat.setValue(this.value);
																		}
																	},
																	{
																		text: "2001-07-04 AM 12:08:56", 
																		value: "yyyy-MM-dd a HH:mm:ss",
																		handler: function() {
																			var dateformat = panel.down("[name=dateformat]");
																			dateformat.setValue(this.value);
																		}
																	},
																	{
																		text: "Wed, Jul 4, '01", 
																		value: "EEE, MMM d, ''yy",
																		handler: function() {
																			var dateformat = panel.down("[name=dateformat]");
																			dateformat.setValue(this.value);
																		}
																	},
																	{
																		text: "20010704120856", 
																		value: "yyyyMMddHHmmss",
																		handler: function() {
																			var dateformat = panel.down("[name=dateformat]");
																			dateformat.setValue(this.value);
																		}
																	}
																]
															}
														}
														
													]
												},
												{
													xtype: "fieldcontainer",
													fieldLabel: IRm$/*resources*/.r1("L_DATE_FORMAT_TGT"),
													name: "t_format",
													labelWidth: 130,
													hidden: true,
													layout: {
														type: "hbox",
														align: "stretch"
													},
													items: [
														{
															xtype: "textfield",
															name: "t_dateformat",
															flex: 1
															// fieldLabel: "Date format"
														},
														{
															xtype: "button",
															text: "Example",
															menu: {
																items: [
																	{
																		text: "2001.07.04 AM 12:08:56", 
																		value: "yyyy.MM.dd a HH:mm:ss",
																		handler: function() {
																			var dateformat = panel.down("[name=t_dateformat]");
																			dateformat.setValue(this.value);
																		}
																	},
																	{
																		text: "2001-07-04 AM 12:08:56", 
																		value: "yyyy-MM-dd a HH:mm:ss",
																		handler: function() {
																			var dateformat = panel.down("[name=t_dateformat]");
																			dateformat.setValue(this.value);
																		}
																	},
																	{
																		text: "Wed, Jul 4, '01", 
																		value: "EEE, MMM d, ''yy",
																		handler: function() {
																			var dateformat = panel.down("[name=t_dateformat]");
																			dateformat.setValue(this.value);
																		}
																	},
																	{
																		text: "20010704120856", 
																		value: "yyyyMMddHHmmss",
																		handler: function() {
																			var dateformat = panel.down("[name=t_dateformat]");
																			dateformat.setValue(this.value);
																		}
																	}
																]
															}
														}
														
													]
												}
											]
										},
										{
											xtype: "fieldset",
											title: IRm$/*resources*/.r1("L_CODE_FIELD"),
											layout: "anchor",
											defaults: {
												anchor: "100%"
											},
											items: [
										        {
										        	xtype: "fieldcontainer",
										        	layout: {
										        		type: "hbox",
										        		align: "stretch"
										        	},
										        	fieldLabel: IRm$/*resources*/.r1("L_CODE_FIELD"),
										        	items: [
										        	    {
										        	    	xtype: "textfield",
										        	    	name: "cmap_disp",
										        	    	readOnly: true,
										        	    	flex: 1
										        	    },
										        	    {
										        	    	xtype: "button",
										        	    	text: "..",
										        	    	handler: function() {
										        	    		this.P2C/*cubeSelectedHandler*/("codemap");
										        	    	},
										        	    	scope: this
										        	    },
										        	    {
										        	    	xtype: "button",
										        	    	text: IRm$/*resources*/.r1("B_CLEAR"),
										        	    	handler: function() {
										        	    		var me = this,
										        	    			item = me.item,
										        	    			objectinfo = item.objectinfo;
										        	    			
										        	    		me.down("[name=cmap_disp]").setValue("");
										        	    		objectinfo.cmap_disp = "";
										        	    		objectinfo.cmap_uid = "";
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
									title: "Advanced Options",
									layout: "anchor",
									bodyPadding: "5 5",
									autoScroll: true,
									defaults: {
										anchor: "100%"
									},
									items: [
										{
											xtype: "textfield",
											fieldLabel: "Field name",
											name: "fname"
										},
										{
											xtype: "fieldset",
											title: "Mask Text",
											layout: "anchor",
											items: [
											    {
													xtype: "combobox",
													name: "masktype",
													fieldLabel: "Mask type",
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
															{name: "No Mask", value: ""},
															{name: "RegExp Pattern", value: "pattern"},
															{name: "Base64 Encoding", value: "base64"},
															{name: "SHA-1", value: "sha1"},
															{name: "AES", value: "aes"}
														]
													},
													listeners: {
														change: function(tobj) {
															var me = this,
																tval = tobj.getValue(),
																pb1 = me.down("[name=pb1]"),
																mpattern_rep = me.down("[name=mpattern_rep]"),
																aes_passph = me.down("[name=aes_passph]");
															
															pb1[tval == "pattern" ? "show" : "hide"]();
															mpattern_rep[tval == "pattern" ? "show" : "hide"]();
															aes_passph[tval == "aes" ? "show" : "hide"]();
														},
														scope: this
													}
												},
												{
													xtype: "fieldcontainer",
													fieldLabel: "Mask Pattern",
													hidden: true,
													name: "pb1",
													layout: "hbox",
													items: [
														{
															xtype: "textfield",
															name: "mpattern"
														},
														{
															xtype: "button",
															text: "Example",
															menu: {
																xtype: "menu",
																items: pitmes
															}
														}
													]
												},
												{
													xtype: "textfield",
													name: "mpattern_rep",
													hidden: true,
													fieldLabel: "Replace With"
												},
												{
													xtype: "textfield",
													name: "aes_passph",
													hidden: true,
													fieldLabel: "AES Pass Phrase (For decryption)"
												}
											]
										},
										{
											xtype: "fieldset",
											title: "Geo Code",
											layout: "anchor",
											items: [
												{
													xtype: "checkbox",
													fieldLabel: "Use geocode",
													name: "usegeocode",
													boxLabel: "Enable"
												},
												{
													xtype: "fieldcontainer",
													fieldLabel: "Latitude",
													layout: {
														type: "hbox",
														align: "stretch"
													},
													items: [
														{
															xtype: "textfield",
															flex: 1,
															name: "geolat"
														},
														{
															xtype: "button",
															text: "..",
															handler: function() {
																this.P2C/*cubeSelectedHandler*/("geolat");
															},
															scope: this
														}
													]
												},
												{
													xtype: "fieldcontainer",
													fieldLabel: "Longitude",
													layout: {
														type: "hbox",
														align: "stretch"
													},
													items: [
														{
															xtype: "textfield",
															flex: 1,
															name: "geolng"
														},
														{
															xtype: "button",
															text: "..",
															handler: function() {
																this.P2C/*cubeSelectedHandler*/("geolng");
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
															xtype: "fieldcontainer",
															flex: 1
														},
														{
															xtype: "button",
															text: "GeoMapping",
															handler: function() {
																var dlg = new IG$/*mainapp*/._Id7/*geoMapping*/({
																	uid: this.uid
																});
																
																IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
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
				}
			],
			
			buttons:[
				"->",
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
				afterrender: function() {
					this._IFd/*init_f*/();
				}
			}
		});
		
		IG$/*mainapp*/._Idf/*metricEditor*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Id7/*geoMapping*/ = $s.extend($s.window, {
	title: 'Geo Mapping',
	modal: true,
	region:'center',
	"layout": 'fit',
	
	closable: false,
	resizable:false,
	width: 500,
	autoHeight: true,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			seldatas = [],
			i;
		
		this.callback && this.callback.execute(seldatas);
		
		this._IG0/*closeDlgProc*/();
	},
	
	in$t: function() {
		var me = this;
		
		var georeqtype = me.down("[name=georeqtype]");
		
		if (ig$/*appoption*/.geo_encoding && ig$/*appoption*/.geo_encoding.length > 0)
		{
			georeqtype.store.loadData(ig$/*appoption*/.geo_encoding);
		}
		
		me.g1/*getValueList*/();
	},
	
	g1/*getValueList*/: function() {
		if (this.uid)
		{
			var panel = this,
				content = '',
				obj,
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				
			content = "<smsg>";
			
			obj = IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, option: "valuelist"}, "uid;option")
			
			content += "</smsg>";
			
			req.init(panel, 
				{
	                ack: "18",
	                payload: obj,
	                mbody: content
	            }, panel, panel.rs_g1/*getValueList*/, null);
	        req._l/*request*/();
		}
	},
	
	rs_g1/*getValueList*/: function(xdoc) {
    	var uid = this.uid,
    		result = new IG$/*mainapp*/._ICd/*clValueList*/(xdoc, uid),
    		grd_data = this.down("[name=grd_data]");
    		
    	this.pool = result.pool;
    		
		grd_data.store.loadData(result.data);
	},
	
	g2/*geoEncode*/: function() {
		var me = this,
			georeqtype = me.down("[name=georeqtype]").getValue();
			
		if (georeqtype)
		{
			var panel = this,
				content = '',
				obj,
				req = new IG$/*mainapp*/._I3e/*requestServer*/(),
				i,
				grd_data = me.down("[name=grd_data]"),
				row;
				
			obj = IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, action: "geoencode", georeqtype: georeqtype}, "uid;action;georeqtype")
				
			content = "<smsg><items>";
			
			for (i=0; i < grd_data.store.data.items.length; i++)
			{
				row = grd_data.store.data.items[i];
				if (!row.get("lat") || !row.get("lng"))
				{
					content += "<item>";
					content += "<address><![CDATA[" + row.get("code") + "]]></address>";
					content += "</item>";
				}
			}
			
			content += "</items></smsg>";
			
			req.init(panel, 
				{
	                ack: "8",
	                payload: obj,
	                mbody: content
	            }, panel, panel.rs_g2/*geoEncode*/, null);
	        req._l/*request*/();
		}
	},
	
	rs_g2/*geoEncode*/: function(xdoc) {
		var me = this,
			georeqtype = me.down("[name=georeqtype]").getValue(),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/results"),
			tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
			grd_data = me.down("[name=grd_data]"),
			i, dt = {},
			addr, record,
			res, geo, g;
			
		if (tnodes)
		{
			geo = (IG$/*mainapp*/.geocoder && IG$/*mainapp*/.geocoder[georeqtype]) ? IG$/*mainapp*/.geocoder[georeqtype] : null;
			
			if (geo)
			{
				for (i=0; i < tnodes.length; i++)
				{
					addr = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "code");
					addr = IG$/*mainapp*/._I24/*getTextContent*/(addr);
					res = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "result");
					res = IG$/*mainapp*/._I24/*getTextContent*/(res);
					res = Base64.decode(res);
					
					g = geo.getGeoCode(res);
					
					if (g.lat && g.lng)
					{
						dt[addr] = g;
					}
				}
			}
			
			for (i=0; i < grd_data.store.data.items.length; i++)
			{
				record = grd_data.store.data.items[i];
				g = dt[record.get("code")];
				if (g)
				{
					record.set("lat", g.lat);
					record.set("lng", g.lng);
				}
			}
		}
	},
	
	g3/*updateGeoData*/: function() {
		var me = this,
			geosql = me.down("[name=geosql]").getValue();
			
		if (me.uid && geosql && me.pool)
		{
			var panel = this,
				content = '',
				obj,
				req = new IG$/*mainapp*/._I3e/*requestServer*/(),
				i,
				grd_data = me.down("[name=grd_data]"),
				row;
				
			obj = IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, action: "geoupdate", pool: this.pool}, "uid;action;pool")
				
			content = "<List>";
			
			content += "<SQL><![CDATA[" + geosql + "]]></SQL>";
			content += "<items>";
			
			for (i=0; i < grd_data.store.data.items.length; i++)
			{
				row = grd_data.store.data.items[i];
				if (row.get("lat") && row.get("lng"))
				{
					content += "<address lat='" + row.get("lat") + "' lng='" + row.get("lng") + "'><![CDATA[" + row.get("code") + "]]></address>";
				}
			}
			
			content += "</items></List>";
			
			req.init(panel, 
				{
	                ack: "8",
	                payload: obj,
	                mbody: content
	            }, panel, panel.rs_g2/*geoEncode*/, null);
	        req._l/*request*/();
		}
	},
	
	rs_g3/*updateGeoData*/: function(xdoc) {
	},
	
	initComponent : function() {
		var me = this;
				 
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
							xtype: "displayfield",
							value: "Address to geo axis values"
							
						},
						{
							xtype: "gridpanel",
							name: "grd_data",
							height: 250,
							store: {
								xtype: "store",
								fields: [
									"code", "lat", "lng"
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
									text: "Address",
									dataIndex: "code",
									flex: 1
								},
								{
									xtype: "gridcolumn",
									text: "Latitude",
									dataIndex: "lat",
									editor: {
										allowBlank: false
									}
								},
								{
									xtype: "gridcolumn",
									text: "Longitude",
									dataIndex: "lng",
									editor: {
										allowBlank: false
									}
								}
							]
						},
						{
							xtype: "fieldset",
							title: "Get GeoEncode",
							layout: "anchor",
							defaults: {
								anchor: "100%"
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
											xtype: "combobox",
											fieldLabel: 'Geo Request Type',
											flex: 1,
											name: "georeqtype",
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
											xtype: "button",
											text: "Update GeoCode",
											handler: function() {
												var me = this;
												
												me.g2/*geoEncode*/();
											},
											scope: this
										}
									]
								},
								{
									xtype: "textarea",
									name: "geosql",
									fieldLabel: "Apply Database"
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
											text: "Run SQL",
											handler: function() {
												var me = this;
												
												me.g3/*updateGeoData*/();
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
				'->',
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
					this.in$t();
				}
			}
		});
		
		IG$/*mainapp*/._Id7/*geoMapping*/.superclass.initComponent.apply(this, arguments);
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

IG$/*mainapp*/._Icf/*cube*/ = function() {
}

IG$/*mainapp*/._IC5/*cubeeditor*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	scroll: false,
	initialized: false,
	closable: true,
	autoScroll:false,
	collapseFirst:true,
	bodyBorder: false,
	"layout": {
		type: "border"
	},
	
	dbscan: 100,
	
	_i0/*refreshDataSet*/: function(pid, cpath, forced) {
		var me = this,
			metricdatas = me.metricdatas,
			dp = [], i;
			
		pid = (pid) ? pid : me._gp;
		cpath = (cpath) ? cpath : me._gpp;
			
		if (!pid || (me._gp == pid && !forced))
			return;
			
		me._gp = pid;
		me._gpp = cpath;
	},
	
	_i1/*findDataSet*/: function(srow, remove) {
		var me = this,
			metricdatas = me.metricdatas,
			metricmap = me.metricmap,
			i,
			r,
			__uid = srow.get ? srow.get("__uid") : srow.__uid,
			suid = srow.get ? srow.get("uid") : srow.uid,
			sname = srow.get ? srow.get("name") : srow.name,
			stype = srow.get ? srow.get("type") : srow.type,
			dt;
			
		for (i=0; i < metricdatas.length; i++)
		{
			m = metricdatas[i];
			
			if (m.__uid == __uid)
			{
				if (remove == true)
				{
					if (metricmap[m.relpath])
					{
						delete metricmap[m.relpath][m.name];
					}
					metricdatas.splice(i, 1);
				}
				else
				{
					r = metricdatas[i];
				}
				
				break;
			}
		}
		
		return r;
	},
	
	_i2/*editColumnOption*/: function(record) {
		var me = this, 
			fname = record.get("fieldname"),
			falias = record.get("alias"),
			sqloption = me.sqloption,
			i,
			cols = sqloption ? sqloption.columns : null,
			col, dlg;
		
		if (cols)
		{
			for (i=0; i < cols.length; i++)
			{
				if (cols[i].fieldname == fname || cols[i].alias == falias)
				{
					col = cols[i];
					break;
				}
			}
		}
		
		if (col)
		{
			dlg = new IG$/*mainapp*/._Ib2/*sql_cube*/({
				fitem: col,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
				})
			});
			
			IG$/*mainapp*/._I_5/*checkLogin*/(me, dlg);
		}
		else
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("E_NO_MATCH_FLD"), null, me, 1, "error");
		}
	},
	
	rs__i3/*cellClickHandler*/: function(node, isexpand, isclick) {
		var me = this,
			t_btn = me.down("[name=t_btn]"),
			mtree = me.down("[name=mtree]"),
			itemaddr = node.get("nodepath"),
			itemuid = node.get("uid"),
			writable = (node.get("writable") == "T" || node.get("manage") == "T") ? true : false,
			manageable = (node.get("manage") == "T") ? true : false;
		
		if (!node.isExpanded() && !isexpand && !isclick)
		{
			node.expand();
		}
		
		t_btn.setDisabled(true);
		
		me._s1 = node;
		
		if (writable || manageable)
		{
			t_btn.setDisabled(false);
		}
		
		me.sK7/*loadCubeMetrics*/(itemuid);
		me._i0/*refreshDataSet*/(itemuid, itemaddr);
	},
	
	_c/*commitItems*/: function(cback) {
		var me = this;
		
		me._i0/*refreshDataSet*/.call(me, null, null, true);
		
		if (!me.uid)
		{
			me.$f1/*saveAsContent*/.call(me, false);
		}
		else
		{
			me.sK4L/*saveCubeMetrics*/.call(me, true, cback);
		}
	},
	
	_d/*createItem*/: function(itemtype) {
		var me = this,
			mtree = me.down("[name=mtree]");
		
		if (me._s1)
		{
			me.__luid = null;
			mtree._I90/*createMetaObject*/.call(mtree, itemtype, me._s1.get("uid"), me._s1.get("nodepath"), me._s1);
		}
	},
	
/* dataview functions */
	_2/*getDropField*/: function(d, upath, rp, tableuid, tablename, tableseq) {
		var me = this,
			map,
			u, 
			o,
			map,
			itemtype = me.itemtype,
			os;
			
		o = {};
				
		IG$/*mainapp*/._I1d/*CopyObject*/(d, o, "nodepath;datasize;datatype;tablename;fieldname;sqlfield;alias;sequence;uniquekey;mcuid;fieldid");
		o.name = d.alias || d.name;
		if (itemtype == "NoSQL")
		{
			os = o.name.split("/");
			o.name = os.join(".");
		}
		map = me.metricmap[rp];
		if (map && map[o.name])
		{
			u = 1;
			while(true)
			{
				if (map[o.name + "(" + u + ")"])
				{
					u++;
				}
				else
				{
					o.name += "(" + u + ")";
					break;
				}
			}
		}
		
		o.fieldfullpath = d.nodepath;
		
		o.tableuid = tableuid;
		o.tablename = tablename;
		o.tableseq = tableseq;
		if (upath)
		{
			o.nodepath = upath + o.name;
			o.relpath = me.sK8/*getRelativePath*/(o.nodepath, o.name);
		}

		o.fieldname = d.fieldname || d.name;
		o.fieldinfo = itemtype == "SQLCube" || itemtype == "DataCube" || itemtype == "NoSQL" ? o.fieldname : o.tablename + (o.tableseq != "0" ? "#" + o.tableseq : "") + "." + o.fieldname;
		
		o.codemapping = (o.valuefield && o.valuefield) ? o.codetable + "." + o.valuefield : "";
		o.__uid = o.__uid || "s_" + (me.__uid++);
		
		IG$/*mainapp*/._I1d/*CopyObject*/(d, o, "codefield;sortfield;codeschema;codetable;codetableuid;valuefield;codefilter1;codefilter2;codefilter3;viewmode;displabel;uid;pid;alias;sequence;uniquekey;mcuid");
		
		return o;
	},
	
	_3/*processFieldDrop*/: function(data, dropIndex, tableuid, tablename, tableseq) {
		var panel = this,
			upath, 
			rp,
			mp,
			o,
			map = panel.metricmap,
			metricdatas = panel.metricdatas,
			titem;
		
		panel._gpp = panel._gpp || "";
		
		rp = panel.sK8/*getRelativePath*/.call(panel, panel._gpp) + "/";
		mp = rp.substring(1);
		
		if (panel.nodepath)
		{
			upath = panel.nodepath + rp;
		}
		
		if (!map[rp])
		{
			map[rp] = {};
		}
		
		map = map[rp];
		data.pid = panel._gp;
		
		o = panel._2/*getDropField*/(data, upath, rp, tableuid, tablename, tableseq);
		o.folder = mp;
		o.type = "Metric";
		o.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/("metric");
		map[o.name] = o;
		o.__uid = o.__uid || "s_" + (this.__uid++);
		
		// me.store.add([o]);
		panel.dataview.store.add([o]);
		panel.metricdatas.push(o);
		
		panel._c/*commitItems*/.call(panel);
		
		panel._i0/*refreshDataSet*/.call(panel, null, null, true);
	},
	
	_1/*processTableDrop*/: function(data, datum, dropIndex, cback) {
		var panel = this,
			i,
			d,
			o, fields = [],
			upath, t, j, u, 
			map = panel.metricmap, rp, mp,
			titem;
		
		rp = panel.sK8/*getRelativePath*/.call(panel, panel._gpp || "") + "/";
		mp = rp.substring(1);
						
		if (panel.nodepath)
		{
			upath = panel.nodepath + rp;
		}
		else
		{
			upath = "*" + rp;
		}
		
		if (!map[rp])
		{
			map[rp] = {};
		}
		map = map[rp];
		
		for (i=0; i < datum.length; i++)
		{
			d = datum[i].data;
			if (d.checked)
			{
				d.pid = panel._gp;
				o = panel._2/*getDropField*/(d, upath, rp, data.uid, data.name, data.seq);
				o.folder = mp;
				o.type = "Metric";
				o.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/("metric");
				map[o.name] = o;
				fields.push(o); 
				panel.dataview.store.add([o]);
			}
		}
		
		panel.metricdatas = panel.metricdatas || [];
		
		for (i=0; i < fields.length; i++)
		{
			panel.metricdatas.push(fields[i]);
		}
		
		// panel._i0/*refreshDataSet*/.call(panel, null, null, true);
		
		panel._c/*commitItems*/.call(panel, cback);
	},
/* end of dataview functions */


	_s5/*updateDataSet*/: function(dt, rec) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(panel, 
    			{
	                ack: "31",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/(
	                    {
	                    	uid: rec.get("uid"), 
	                    	name: rec.get("name"), 
	                    	itemtype: rec.get("type"), 
	                    	description: rec.get("description"),
	                    	memo: rec.get("memo")
	                	 }, "uid;name;itemtype;pid;description;memo"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "rename"})
	            }, panel, function(xdoc) {
	            	var map = panel.metricmap,
	            		mmap = map[rec.get("relpath")],
	            		k,
	            		iuid = rec.get("uid"),
	            		__iuid = rec.get("__uid"),
	            		pobj;
	            		
	            	if (mmap)
	            	{
	            		for (k in mmap)
	            		{
	            			if ((mmap[k].uid && mmap[k].uid == iuid) || (!mmap[k].uid && mmap[k].__uid == __iuid))
	            			{
	            				pobj = mmap[k];
	            				pobj.name = rec.get("name");
	            				delete mmap[k];
	            				mmap[pobj.name] = pobj;
	            				break;
	            			}
	            		}
	            	}
	            		
	            	rec.set("edited", false);
	            }, null);
	    req._l/*request*/();
	},
	
	_5/*setCodeMapping*/: function(rec, cmd) {
		var panel = this,
			p = panel._i1/*findDataSet*/(rec, false),
			pl, i, pop;
		if (cmd == "set")
		{
			pop = new IG$/*mainapp*/._IA8/*codemapping*/({
				pooluid: panel.pooluid,
				rec: rec,
				pitem: p,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, function(cmd) {
					var panel = this;
					if (cmd == "clear")
					{
						panel._5/*setCodeMapping*/(rec, "unset");
					}
					// panel._s5/*updateDataSet*/(p, rec);
				})
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(panel, pop);
		}
		else
		{
			pl = "codefield;sortfield;codeschema;codetable;codetableuid;valuefield;codefilter1;codefilter2;codefilter3;viewmode;displabel".split(";");
			
			rec.set("edited", true);
			
			for (i=0; i < pl.length; i++)
			{
				rec.set(pl[i], "");
				p[pl[i]] = "";
			}
			
			rec.set("codemapping", "");
		}
	},
	
	_6/*showSecurityFilter*/: function() {
		var me = this,
			securityfilter = me.securityfilter,
			pop;
			
		if (securityfilter && securityfilter.length > 0)
		{
			pop = new IG$/*mainapp*/._Id9/*securityFilter*/({
				uid: me.uid,
				securityfilter: securityfilter
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
		}
		else
		{
			pop = new IG$/*mainapp*/._Icb/*userDutyMgr*/({
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(sel) {
					var _userAuth = [],
						i,
						item, authnames = "", authuid = "";
					for (i=0; i < sel.length; i++)
					{
						var x = {
							sid: sel[i].get("sid"),
							name: sel[i].get("name")
						};
						_userAuth.push(x);
					}
				
					if (_userAuth.length > 0)
					{
						item = new IG$/*mainapp*/._IEb/*clFilterGroup*/(null);
					
						for (i=0; i < _userAuth.length; i++)
						{
							authnames += (i > 0 ? ";" : "") + _userAuth[i].name;
							authuid += (i > 0 ? ";" : "") + _userAuth[i].sid;
						}
					
						item.authname = authnames;
						item.authuid = authuid;
						item.active = true;
					
						me._7/*showSecurityFilterEditor*/(item, true);
					}
				})
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
		}
	},
	
	_7/*showSecurityFilterEditor*/: function(item, isnewitem) {
		var me = this,
			opanel = new IG$/*mainapp*/._Ia1/*filterEditorWindow*/({
				_ILb/*sheetoption*/: {
					filter: item
				},
				_ILa/*reportoption*/: {
					cubeuid: me.uid
				},
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(sop) {
					if (isnewitem == true)
					{
						var fitem = sop.filter; 
						me.securityfilter.push(fitem);
					}
				})
			});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, opanel);
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this,
			p,
			mp,
			columns = [],
			dataview = me.dataview,
			rec,
			sop,
			sqlopt, msqlopt;
		
		switch (cmd)
		{
		case "cmd_save":
			if (!me.uid)
			{
				me.$f1/*saveAsContent*/(false);
			}
			else
			{
				me.sK4L/*saveCubeMetrics*/();
			}
			break;
		case "cmd_saveas":
			me.$f1/*saveAsContent*/(false);
			break;
		case "cmd_model":
			me.sK5_m1a/*changeModel*/();
			break;
		case "cmd_model_new":
			mp = IG$/*mainapp*/._I7d/*mainPanel*/ || null;
			mp.m1$7/*navigateApp*/.call(mp, null, "CubeModel".toLowerCase(), "New DataModel", null, null, true);
			break;
		case "cmd_model_edit":
			if (me.modeluid)
			{
				IG$/*mainapp*/._n1/*navigateMenu*/(me.modeluid);
			}
			break;
		case "cr"/*cmd_refresh*/:
			me.__luid = null;
			me.sK5/*procLoadContent*/();
			break;
		case "cmd_delete":
			IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("B_CD_CHS"), function(dlg) {
				if (dlg == "yes")
				{
					me.sk5m/*deleteSelected*/.call(me);
				}
			}, me, me);
			break;
		case "cmd_regmeasures":
			me.sk5n/*regmeasures*/();
			break;
		case "cmd_style":
			me.sk5o/*setCubeStyle*/();
			break;
		case "cmd_sec_filter":
			me._6/*showSecurityFilter*/();
			break;
		case "cmd_hl_option":
			p = new IG$/*mainapp*/._Ie7/*highlightWin*/({
				_piobj: me,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {})
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(me, p);
			break;
		case "cmd_pre_proc":
			p = new IG$/*mainapp*/.MwPP/*preprocessor*/({
				cube: me,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_OP/*setPreprocOption*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(me, p);
			break;
		case "cmd_mdb_option":
			p = new IG$/*mainapp*/.MwPo/*mdb_cube_option*/({
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_Op/*setOption*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(me, p);
			break;
		case "cmd_nosql_option":
			p = new IG$/*mainapp*/._Ic2/*nosql_option*/({
    			dbtype: me.dbtype,
    			dbnodes: me.dbnodes,
    			dbname: me.dbname,
    			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(mval) {
    				var me = this;
    				if (mval)
			    	{
			    		me.dbnodes = mval.dbnodes;
			    		me.dbtype = mval.dbtype;
			    		me.dbname = mval.dbname;
			    		me.mC1/*loadNoSQLTable*/();
			    	}
    			})
    		});
    		IG$/*mainapp*/._I_5/*checkLogin*/(me, p);
			break;
		case "cmd_join_add":
			p = new IG$/*mainapp*/.DM2/*joinConfig*/({
				modelcontent: me.modelcontent,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs__9/*addJoin*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(me, p);
			break;
		case "cmd_join_delete":
			me._8/*deleteJoin*/();
			break;
		case "cmd_sql_input":
			sop = new IG$/*mainapp*/._Icf/*cube*/();
			sop.sqloption = me.sqloption;
			
			p = new IG$/*mainapp*/._Ib1/*sqlcube_wizard*/({
				wmode: "sqlcube",
				uid: me.uid,
				_ILb/*sheetoption*/: sop,
				columns: sop.sqloption.columns,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_SOp/*setOption*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(me, p);
			break;
		case "cmd_query_tool":
			sop = new IG$/*mainapp*/._Icf/*cube*/();
			sqlopt = sop.sqloption = {};
			msqlopt = me.sqloption;
			
			if (msqlopt)
			{
				sqlopt.sql = msqlopt.sql || msqlopt.sqlquery;
				sqlopt.columns = [];
				sqlopt.dbpool = msqlopt.dbpool;
			}
			
			p = new IG$/*mainapp*/._Ibe/*querytool*/({
				_ILb/*sheetoption*/: sop
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(me, p);
			break;
		case "cmd_report":
			var mainpanel = IG$/*mainapp*/._I7d/*mainPanel*/;
			mainpanel && mainpanel.m1$7/*navigateApp*/.call(mainpanel, 
				null, "report", "New Report", null, true, true, null, {
					cubeuid: me.uid
				}
			);
			break;
// datacube related command //
		case "cmd_import":
			me.sK3a/*importLocalFile*/();
			break;
			
// mcube related command //
		case "cmd_ld_file":
			if (me.d1/*showSaveContent*/() == true)
			{
				me.MmD1/*mcube_loadDataSource*/();
			}
			break;
		case "cmd_buildcube":
			me.Mmm1/*mcube_buildCube*/();
			break;
		case "cmd_add_metric":
   			me.Mmm2/*mcube_appendNewMetric*/();
			break;
		case "cmd_sql":
			if (me.d1/*showSaveContent*/() == true)
			{
				me.MmD2/*mcube_loadSQLSource*/();
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
					IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('B_SUCCESS'), null, me, 0, "success");
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
					IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('B_SUCCESS'), null, me, 0, "success");
				}, null);
			req._l/*request*/();
			break;
		case "cmd_db_destroy":
			IG$/*mainapp*/._I55/*confirmMessages*/("Confirm delete DB?", "Click ok button to delete molap db content.", me.Mlm1/*mcube_doDeleteDB*/, me, me);
			break;
// end of mcube related command //
		}
	},
	
	sK3a/*importLocalFile*/: function() {
		var me = this,
			ufiles = [],
			i,
			datainfo = me.down("[name=datainfo]"),
			dataset = me.dataset,
			selmodel,
			selvalue,
			regfile,
			uid,
			rec,
			lbl;
		
		for (i=0; i < datainfo.store.data.items.length; i++)
		{
			rec = datainfo.store.data.items[i];
			lbl = rec.get("name");
			uid = rec.get("uid");
			ufiles.push({name: lbl, uid: uid, selected: false});
		}
		
		var fwin = new IG$/*mainapp*/._Idc/*ExcelFileUploader*/({
			ufiles: ufiles,
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(dlgwindow) {
				var panel=this,
					uid = dlgwindow.fileuid,
					req = new IG$/*mainapp*/._I3e/*requestServer*/(),
					datalabel = dlgwindow.datalabel,
					uploadmode = dlgwindow.uploadmode,
					delimiter = dlgwindow.delimiter,
					deletemode = dlgwindow.deletemode,
					targetsheet = dlgwindow.targetsheet,
					file_encoding = dlgwindow.file_encoding,
					datainfo = panel.down("[name=datainfo]"), 
					dataset = panel.dataset,
					regfile,
					selvalue,
					selmodel,
					lbl,
					rec,
					i,
					datainfo_store = datainfo.store,
					ditems = datainfo_store.data.items;
				
				if (ditems.length > 0)
				{
					if (uploadmode == false)
					{
						sitemcount = 0;
						
						for (i=0; i < ditems.length; i++)
						{
							rec = ditems[i];
							lbl = rec.get("name");
							
							if (lbl.substring(0, datalabel.length) == datalabel)
							{
								if (lbl == datalabel)
								{
									sitemcount = Math.max(sitemcount, 1);
								}
								else
								{
									lbl = lbl.substring(datalabel.length);
									lbl = lbl.replace(/[^0-9]/g, '');
									sitemcount = Math.max(sitemcount, parseInt(lbl)+1);
								}
							}
						}
						
						if (sitemcount > 0)
						{
							datalabel += "(" + sitemcount + ")";
						}
					}
					else
					{
						regfile = targetsheet;
						
						if (!regfile)
						{
							// to prevent undefined error
							regfile = null;
							
							for (i=0; i < ditems.length; i++)
							{
								rec = ditems[i];
								lbl = rec.get("name");
								
								if (lbl == datalabel)
								{
									regfile = rec.get("uid");
									break;
								}
							}
						}
					}
				}
				
				panel.setLoading(true, true);
				
				// store content in separate uid
				req.init(panel, 
					{
						ack: "27",
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid, delimiter: delimiter, uploadmode: (uploadmode == true ? "T" : "F"), deletemode: (deletemode == true ? "T" : "F"), regfile: regfile, file_encoding: file_encoding}, "uid;delimiter;uploadmode;deletemode;regfile;file_encoding"),
						mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "storedatacontent"})
					}, panel, panel.rs_sK3b/*processUploadedFile*/, null, [100, datalabel, uploadmode, deletemode, regfile]);
				
				req._l/*request*/();
			})
		});
   		IG$/*mainapp*/._I_5/*checkLogin*/(me, fwin);
	},
	
	// get upload content
	rs_sK3b/*processUploadedFile*/: function(xdoc, params) {
		var panel = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
			datauid = (tnode) ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid") : null,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			cnt = params[0],
			datalabel = params[1],
			uploadmode = params[2],
			deletemode = params[3],
			regfile = params[4];
			
		cnt = (cnt == null || typeof(cnt) == "undefined") ? 100 : cnt;
		
		if (datauid)
		{
			params.push(datauid);
			
			req.init(panel, 
				{
					ack: "5",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: datauid}),
					mbody: IG$/*mainapp*/._I2e/*getItemOption*/({limit: cnt})
				}, panel, panel.rs_sK3b_nn/*processUploadedFile*/, null, params);
			
			setTimeout(function() {
				req._l/*request*/.call(req);
			}, 300);
		}
		else
		{
			panel.setLoading(false);
		}
	},
	
	cxc/*loadDataSet*/: function(rowIndex) {
		var panel = this,
			storecolumn = panel.down("[name=datainfo]").store, 
			rec = storecolumn.data.items[rowIndex],
			dlg;
		
		dlg = new IG$/*mainapp*/._Ie9/*excelPreview*/({
			uid: rec.get("uid")
		});
		
		dlg.show(panel);
	},
	
	rs_sK3b_nn/*processUploadedFile*/: function(xdoc, params) {
		var mresult = new IG$/*mainapp*/._IF1/*clSheetResult*/(xdoc),
			i, j, header, column, me=this, row, isnumeric,
			setuid,
			cnt = params[0],
			datalabel = params[1],
			uploadmode = params[2],
			deletemode = params[3],
			regfile = params[4],
			datauid = params[5],
			sortdesc,
			headermap = me.headermap,
			appendcolumn = false, cinfo = {}, cell,
			dataset = me.dataset,
			datainfo = me.down("[name=datainfo]"),
			rec, dbl, headermap,
			h;
			
		me.setLoading(false);
		
		if (mresult.data.length > 0)
		{
			header = mresult.header;
			headermap = me.headermap;
			
			for (i=0; i < header.length; i++)
			{
				h = header[i];
				isnumeric = (h.type == "numeric" ? true : false);
				setuid = null;
				
				if (!headermap[h.name])
				{
					cell = {
						name: h.name,
						datatype: h.type,
						fieldname: h.name,
						fieldid: "column_" + (me._dcolumns.length + 1)
					};
					
					me._dcolumns.push(cell);
					headermap[cell.fieldname] = cell;
				}
				else
				{
					headermap[h.name].datatype = h.type;
					headermap[h.name].name = h.name;
				}
			}
			
			if (uploadmode == true && regfile)
			{
				for (i=0; i < datainfo.store.data.items.length; i++)
				{
					rec = datainfo.store.data.items[i];
					if (rec.get("uid") == regfile)
					{
						rec.set("uid", datauid);
						break;
					}
				}
			}
			else
			{
				datainfo.store.insert(0, {name: datalabel, uid: datauid});
			}
			
			me.sK4L/*saveCubeMetrics*/(true);
		
			me.C_/*loadSQLTable*/();
			me._i0/*refreshDataSet*/(null, null, true);
		}
		else
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("L_NO_DATA"), null, null, 1, "error");
		}
	},
	
	_8/*deleteJoin*/: function() {
		var me = this,
			grd = me.down("[name=grd_join]"),
			grd_store = grd.store,
			i, j, srcname, tgtname,
			rec;
		
		for (i=grd_store.data.items.length-1; i>=0; i--)
		{
			rec = grd_store.data.items[i];
			if (rec.get("selected") == true)
			{
				srcname = rec.get("joinfrom");
				tgtname = rec.get("jointo");
				
				for (j=me.relations.length-1; j>=0; j--)
				{
					if (me.relations[j].joinfrom == srcname && me.relations[j].jointo == tgtname)
					{
						me.relations.splice(j, 1);
					}
				}
				grd_store.removeAt(i);
			}
		}
	},
	
	rs__9/*addJoin*/: function(value) {
		var me = this,
			c = new IG$/*mainapp*/._IEa/*relations*/(null),
			grd_join = me.down("[name=grd_join]");
		
		c.source = value.source;
		c.target = value.target;
		
		c.MX/*makeInfo*/();
		me.relations.push(c);
		
		grd_join.store.add({
			joinfrom: c.joinfrom,
			jointo: c.jointo,
			joincondition: c.joincondition
		});
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
		var me = this,
			content = IG$/*mainapp*/._I2e/*getItemOption*/(),
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			itemtype = me.itemtype;
		
		req.init(me, 
			{
				ack: "31",
				payload: "<smsg><item address='" + item.nodepath + "/" + item.name + "' name='" + item.name + "' type='" + (itemtype ? itemtype : "Cube") + "' pid='" + item.uid + "' description='' source_uid='" + (me.uid || "") + "'/></smsg>",
				mbody: content //IG$/*mainapp*/._I2e/*getItemOption*/()
			}, me, me._IO5/*rs_processMakeMetaItem*/, null, [item.name, afterclose, item.nodepath, item.uid, content]);
	   	req.showerror = true;
		req._l/*request*/();
	},
	
	_IO5/*rs_processMakeMetaItem*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			name;
		
		if (tnode)
		{
			me.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid");
			me.nodepath = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "nodepath");
			name = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "name");
			me.setTitle(name);
		}
		me.sK4L/*saveCubeMetrics*/();
	},
	
	
	
	sk5n/*regmeasures*/: function() {
		var me = this,
			i, rec, item, items=[], ds,
			st = me.dataview.store.data.items;
		
		for (i=0; i < st.length; i++)
		{
			rec = st[i];
			
			if (rec.get("selected") == true && rec.get("uid"))
			{
				item = {};
				rec.set("type", rec.get("type") || rec.get("itemtype"));
				rec.set("type", rec.get("type") == "Field" ? "Metric" : rec.get("type"));
				IG$/*mainapp*/._I1d/*CopyObject*/(rec.data, item, "uid;name;type;memo;nodepath", "s");
				item.measurename = rec.get("name");
				item.formula = IG$/*mainapp*/._I34/*isNumericType*/(rec.get("datatype")) ? "SUM" : "COUNT DISTINCT";
				items.push(item);
			}
		}
		
		if (items.length > 0)
		{
			var pop = new IG$/*mainapp*/._Ic9/*multiMeasure*/({
				metaitems: items,
				mfolder: me.mfolder,
				pcube: me,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_sk5n/*regmeasures*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
		}
	},
	
	rs_sk5n/*regmeasures*/: function(opt) {
		var i, j,
			panel = this,
			address = "<smsg>",
			content = "<smsg>",
			m_f,
			item,
			_r, _c,
			vmode = opt.vmode,
			items = opt.items,
			clocation = opt.clocation,
			cloc,
			dlg = opt.dialog,
			_parentpath = panel.nodepath, req,
			tmpl = opt.tmpl,
			n1, n2,
			mname, pp;
		
		panel.mfolder = clocation;
		
		for (i=0; i < items.length; i++)
		{
			item = items[i];
			
			if (opt.vmode)
			{
				cloc = item.clocation + "/";
			}
			else
			{
				if (clocation.substring(0, "{parent}".length) == "{parent}")
				{
					pp = item.nodepath.substring(0, item.nodepath.lastIndexOf("/"));
					cloc = pp + clocation.substring("{parent}".length) + "/";
				}
				else
				{
					cloc = _parentpath + "/" + (clocation ? (clocation + "/") : "");
				}
			}
			
			item.cloc = cloc;
			
			mname = item.measurename;
			
			if (mname.indexOf("/") > -1)
			{
				mname = mname.split("/");
				mname = mname.join("&#x2044;");
			}

			_r = "<item name='" + mname + "'";
			_r += " uid='" + cloc + mname + "' type='" + (item.ctype || "Measure") + "' createstructure='T'";
			_r += "/>";
			address += _r;
			
			if (item.ctype == "DateMetric")
			{
				_c = "<item ><objinfo  ";
				_c += IG$/*mainapp*/._I20/*XUpdateInfo*/({
					cubeuid: panel.uid,
					dateformat: "DATE",
					fieldid: item.uid,
					fieldname: mname,
					dbtype: "auto",
					issql: "T"
				}, "cubeuid;dateformat;fieldid;fieldname;dbtype;issql", "s");
				_c += "/></item>";
			}
			else
			{
				switch (item.formula)
				{
//				case "SUM":
//				case "AVG":
//				case "COUNT":
//				case "MIN":
//				case "MAX":
					
				case "COUNT DISTINCT":
					m_f = "COUNT(DISTINCT [" + item.name + "])";
					break;
				case "TMPL":
					break;
				default:
					m_f = item.formula + "([" + item.name + "])";
					break;
				}
				
				if (item.formula == "TMPL" && tmpl)
				{
					m_f = tmpl.expression;
					
					n1 = m_f.indexOf("[field]");
					
					while (n1 > -1)
					{
						m_f = m_f.substring(0, n1) + "[" + item.name + "]" + m_f.substring(n1 + "[field]".length);
						n1 = m_f.indexOf("[field]");
					}
					
					_c = "<item name='" + item.measurename + "'";
					_c += ">";
					_c += "<Expression type='" + tmpl.expressiontype + "' calcmode='" + (tmpl.calcmode ? "T" : "F") + "'>";
					_c += "<" + "!" + "[CDATA[" + m_f + "]" + "]" + ">"; 
					_c += "</Expression>";
					_c += "<Fields>";
					_c += "<item name='" + item.name + "' uid='" + item.uid + "' nodepath='" + item.nodepath + "' type='" + item.type + "' datatype='" + item.datatype + "'/>";
					for (j=0; j < tmpl.fields.length; j++)
					{
						tmpl.fields[j].type = tmpl.fields[j].type || tmpl.fields[j].itemtype;
						_c += "<item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(tmpl.fields[j], "name;uid;type;nodepath;memo", "s") + "/>";
					}
					_c += "</Fields>";
					_c += "</item>";
				}
				else
				{
					_c = "<item name='" + item.measurename + "'";
					_c += ">";
					_c += "<Expression type='" + item.formula + "'>";
					_c += "<" + "!" + "[CDATA[" + m_f + "]" + "]" + ">"; 
					_c += "</Expression>";
					_c += "<Fields>";
					_c += "<item name='" + item.name + "' uid='" + item.uid + "' nodepath='" + item.nodepath + "' type='" + item.type + "' datatype='" + item.datatype + "'/>";
					_c += "</Fields>";
					_c += "</item>";
				}
			}
			content += _c;
		}
		
		address += "</smsg>";
		content += "</smsg>";
		
		panel.setLoading(true);
		
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
				ack: "30",
				payload: address,
				mbody: content
			}, panel, panel.rs_sk5n2/*saveregmeasures*/, null, [dlg, items]);
		req._l/*request*/();
	},
	
	rs_sk5n2/*saveregmeasures*/: function(xdoc, param) {
		var me = this,
			req,
			dlg = param[0],
			items = param[1],
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			address,
			content,
			cname, cdiv,
			i,
			ditems = [],
			t;
			
		me.setLoading(false);
		
		for (i=0; i < items.length; i++)
		{
			t = items[i];
			if (t.ctype == "DateMetric" && tnodes[i])
			{
				t.cuid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "uid");
				ditems.push(t);
			}
		}
		
		if (ditems.length)
		{
			address = "<smsg>";
			content = "<smsg>";
			
			for (i=0; i < ditems.length; i++)
			{
				$.each([
					{name: "YYYY", rname: "YEAR"}, 
					{name: "QUARTER"}, 
					{name: "MM"}, 
					{name: "DD", rname: "DAY"}, 
					{name: "WM", rname: "WEEKMONTH"}, 
					{name: "WEEK"}], function(j, p) {
						cname = IRm$/*resources*/.r1('B_' + p.rname + '');
						cdiv = p.name;
						address += "<item  uid='" + items[i].cloc + "/" + ditems[i].measurename + "/" + cname + "' pid='" + ditems[i].cuid + "' name='" + cname + "' type='CustomMetric'/>";
						content += "<item  uid='" + items[i].cloc + "/" + ditems[i].measurename + "/" + cname + "' pid='" + ditems[i].cuid + "' name='" + cname + "' type='CustomMetric'>";
						content += "<Fields><item  uid='" + ditems[i].uid + "' name='" + ditems[i].uid + "' nodepath='' type='Metric'>";
						content += "</item></Fields><CustomMetricInfo  datedivision='" + cdiv + "' dateformat='DATE' predefinetype='DATE' type='CUSTOM_FIELD' customdatetype=''></CustomMetricInfo>";
						content += "<Expression><$DATE_YYYY([" + ditems[i].name + "])$</Expression></item>";
				});
			}
			
			address += "</smsg>";
			content += "</smsg>";
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
					ack: "30",
					payload: address,
					mbody: content
				}, me, function(xdoc) {
					IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
				});
			req._l/*request*/();
		}
		else
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
		}
	},
	
	sk5o/*setCubeStyle*/: function() {
		var me = this,
			pop = new IG$/*mainapp*/._I9c/*cubeStyle*/({
				styleinfo: me.customstyle,
				c_cset: me.c_cset,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(dlg) {
					me.c_cset = dlg.c_cset;
				})
			});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
	},
	
	sk5m/*deleteSelected*/: function() {
		var i,
			d,
			c,
			o, panel=this, map,
			st = panel.dataview.store.data.items;
			
		c = "";
		o = "<smsg><info option='delete'/></smsg>";
		for (i=st.length-1; i>=0; i--)
		{
			d = st[i].data;
			if (d.selected == true && d.uid)
			{
				c += "<item uid='" + d.uid + "' name='" + d.name + "' type='" + d.type + "'/>";
			}
			else if (d.selected)
			{
				panel._i1/*findDataSet*/(st[i], true);
			}
		}
		
		if (c)
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
		else
		{
			panel._i0/*refreshDataSet*/(null, null, true);
		}
	},
	
	rs_sK4Ld/*deleteCubeMetrics*/: function(xdoc) {
		var me = this,
			i,
			rec,
			store = me.dataview.store,
			map = me.metricmap,
			rp, rpath;
			
		for (i=store.data.items.length-1; i>=0; i--)
		{
			rec = store.data.items[i];
			if (rec.get("selected"))
			{
				rpath = rec.get("relpath");
				if (rpath && map[rpath])
				{
					delete map[rpath][rec.get("name")];
				}
				store.remove(rec);
			}
		}
	},
	
	sK4L/*saveCubeMetrics*/: function(istemp, cback) {
		var panel = this;
		
		panel.sK4L_/*saveCubeMetrics*/(istemp, cback);
	},
	
	sK4L_/*saveCubeMetrics*/: function(istemp, cback) {
		var me = this,
			i,
			d, ditem, panel = this, rcontent = [], req, titems={}, titem,
			dataview = me.dataview,
			dvar = "name;fieldfullpath;datatype;tablename;fieldname;datasize;nodepath;relpath;folder;tableuid;tableseq;update;codetable;codefield;codetableuid;valuefield;sortfield;codeschema;ukey;uid;codefilter1;codefilter2;codefilter3;viewmode;displabel;pid;type;alias;uniquekey;sequence;mcuid;fieldid",
			keymap = {};
		
		me.setLoading(true);
		me.titemmap = {};
		
		for (i=0; i < me.dataview.store.data.items.length; i++)
		{
			titem = me.dataview.store.data.items[i].data;
			me.titemmap["key_" + i] = titem;
			titem.ukey = "key_" + i;
			
			if (!titem.uid || titem.edited)
			{
				titems[titem.ukey] = {
					tobj: titem
				};
				
				keymap[titem.__uid] = titem;
				titem.update = "T";
				rcontent.push("<" + titem.type + "" + IG$/*mainapp*/._I20/*XUpdateInfo*/(titem, dvar, "s") + "></" + titem.type + ">");
			}
		}
		
		if (rcontent)
		{
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
					ack: "6",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, trid: me.trid}, "uid;trid"),
					mbody: "<smsg>" + rcontent.join("") + "</smsg>"
				}, panel, function(xdoc, titems) {
					var me = this,
						i,
						tnode = (xdoc) ? IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg") : null,
						tnodes = (tnode) ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
						tobj,
						k;
						
					if (tnodes)
					{
						for (i=0; i < tnodes.length; i++)
						{
							tobj = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
							if (tobj.ukey && titems && titems[tobj.ukey])
							{
								titems[tobj.ukey].tobj.uid = tobj.uid;
							}
							if (tobj.ukey && me.titemmap[tobj.ukey])
							{
								me.titemmap[tobj.ukey].uid = tobj.uid;
							}
						}
						
						for (i=0; i < dataview.store.data.items.length; i++)
						{
							rec = dataview.store.data.items[i];
							k = rec.get("__uid") ? keymap[rec.get("__uid")] : null;
							if (k)
							{
								rec.set("uid", k.uid);
							}
						}
					}
					
					if (!istemp)
					{
						var req = new IG$/*mainapp*/._I3e/*requestServer*/();
				
						req.init(panel, 
							{
								ack: "11",
								payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
								mbody: IG$/*mainapp*/._I2e/*getItemOption*/({act: "c", option: "trid", trid: panel.trid})
							}, panel, function(xdoc) {
								panel.rs_sK4L/*saveCubeMetrics*/(null);
							}, null);
						req._l/*request*/();
					}
					
					cback && cback.execute();
				}, null, titems);
			req._l/*request*/();
		}
		else
		{
			cback && cback.execute();
		}
	},
	
	rs_sK4L/*saveCubeMetrics*/: function(xdoc, titems) {
		var me = this,
			i,
			tobj, 
			datainfo,
			rec,
			content = ["<smsg><item uid='" + me.uid + "'>"
					+ "<objinfo model='" + (me.modeluid ? me.modeluid : "") + "' mfolder='" + (me.mfolder || "") + "' version='1.1'/>"],
			itemtype = me.itemtype,
			__cp,
			t;
			
		__cp = function(val) {
			content.push(val);
		};
		
		if (itemtype == "MCube")
		{
			me._omc.items = [];
			
			var tabletree = me.tree,
				root = tabletree.getRootNode(),
				fnode = root.firstChild,
				item;
		
			if (fnode && fnode.childNodes)
			{
				for (i=0; i < fnode.childNodes.length; i++)
				{
					r = fnode.childNodes[i];
					item = {
						name: r.get("name"),
						type: r.get("type"),
						mcuid: r.get("mcuid"),
						metrictype: r.get("metrictype") || "",
						stylename: r.get("stylename") || "",
						sequence: r.get("sequence") || "",
						uniquekey: r.get("uniquekey") || "",
						fieldname: r.get("fieldname") || ""
					};
					me._omc.items.push(item);
				}
			}
		}
		
		__cp("<Styles c_cset='" + (me.c_cset || "") + "'>");

		t = me.defaultstyle;
		if (t && t.length > 0)
		{
			__cp("<Default>");
			for (i=0; i < t.length; i++)
			{
				__cp(t[i].tx/*getXML*/());
			}
			__cp("</Default>");
		}

		t = me.customstyle;
		if (t && t.length > 0)
		{
			__cp("<Custom>");
			for (i=0; i < t.length; i++)
			{
				__cp(t[i].tx/*getXML*/());
			}
			__cp("</Custom>");
		}
		__cp("</Styles>");
		
		if (itemtype == "MCube")
		{
			t = me._omc.items;
			__cp("<MetricItems>");
			for (i=0; i < t.length; i++)
			{
				__cp("<item" + IG$/*mainapp*/._I20/*XUpdateInfo*/(t[i], "uid;nodepath;name;metrictype;stylename;type;sequence;uniquekey;fieldname;mcuid", "s") + "/>");
			}
			__cp("</MetricItems>");
			
			t = me._omc.sqldata;
			__cp("<SQLData>");
			if (t.dbpool && t.columns)
			{
				__cp("<item dbpool='" + (t.dbpool || "") + "'><columns>");
				for (i=0; i < t.columns.length; i++)
				{
					__cp("<column name='" + t.columns[i].name + "' datatype='" + t.columns[i].datatype + "' mappto='" + (me.sqldata.columns[i].mapto || "") + "'/>");
				}
				__cp("</columns><sqlquery><![CDATA[" + (t.sql || "") + "]]></sqlquery></item>");
			}
			__cp("</SQLData><DataLoader><Option>");

			t = me._omc.dataloader.option;
			if (t)
			{
				for (var k in t)
				{
					__cp("<prop name='" + k + "'><![CDATA[" + t[k] + "]]></prop>");
				}
			}
			__cp("</Option></DataLoader>");
		}
		
		__cp("<SecurityFilter>");
		t = me.securityfilter;
		if (t && t.length > 0)
		{
			for (i=0; i < t.length; i++)
			{
				__cp(t[i].TX/*getXML*/());
			}
		}
		__cp("</SecurityFilter>");

		t = me.relations;
		if (itemtype == "MDBCube" && t)
		{
			__cp("<Relation>");
			for (i=0; i < t.length; i++)
			{
				__cp(t[i].TX/*getXML*/());
			}
			__cp("</Relation>");
		}
		
		t = me.hloption;
		__cp("<hloption>");
		if (t)
		{
			for (i=0; i < t.length; i++)
			{
				__cp(t[i].TX/*getXML*/.call(t[i]));
			}
		}
		__cp("</hloption>");
		
		__cp("<sqlsyntax><![CDATA[" + (me.sqlsyntax || "") + "]]></sqlsyntax>");
		
		t = me.sqloption;
		if (itemtype == "SQLCube" && t)
		{
			__cp("<ExecuteSQL dbpool='" + (t.dbpool || "") + "'><SQL><![CDATA[" + (t.sqlquery || "") + "]]></SQL><columns>" + IG$/*mainapp*/._I4e/*ColumnsToString*/(t.columns, "column") + "</columns>");
			
			__cp("<prompts>");
			for (i=0; i < t.prompts.length; i++)
			{
				__cp(t.prompts[i].L1/*getXML*/());
			}
			__cp("</prompts></ExecuteSQL>");
		}
		else if (itemtype == "DataCube")
		{
			__cp("<result><DataObjects>");
			datainfo = me.down("[name=datainfo]");
			t = datainfo.store.data.items;
			for (i=0; i < t.length; i++)
			{
				rec = t[i];
				__cp("<data uid='" + rec.get("uid") + "' name='" + rec.get("name") + "'/>");
			}
			__cp("</DataObjects>");

			__cp("<Header>");
			t = me._dcolumns;
			for (i=0; i < t.length; i++)
			{
				__cp("<item" + IG$/*mainapp*/._I20/*XUpdateInfo*/(t[i], "datatype;fieldname;name;fieldid", "s") + "/>");
			}
			__cp("</Header></result>");
		}
		else if (itemtype == "NoSQL")
		{
			__cp("<nosql" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "dbtype;dbname;tablename;dbnode", "s") + IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "dbscan", "i") + "><dbnodes>");
			t = me.dbnodes;
	    	if (t)
	    	{
	    		for (i=0; i < t.length; i++)
	    		{
	    			__cp("<dbnode name='" + t[i].name + "' uid='" + t[i].uid + "'/>");
	    		}
	    	}
	    	__cp("</dbnodes></nosql>");
		}
		
		__cp("</item></smsg>");
		
		me.sK4/*saveMetaContent*/(me.uid, content.join(""));
	},
	
	sK4/*saveMetaContent*/: function(uid, content) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
				ack: "31",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
				mbody: content
			}, panel, panel.rs_sK4/*saveMetaContent*/, null);
		req._l/*request*/();
	},
	
	rs_sK4/*saveMetaContent*/: function(xdoc) {
		var me = this;
		me.setLoading(false);
		me.down("[name=b_m1]").show();
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
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
	sK5/*procLoadContent*/: function(b_loading) {
		var panel = this,
			itemtype = panel.itemtype,
			req;
		
		panel.metricmap = {};
		panel.metricdatas = [];
		panel.defaultstyle = [];
		panel.customstyle = [];
		panel.securityfilter = [];
		panel.relations = [];
		panel._dcolumns = [];
		panel.headermap = {};
		panel.dataset = [];
		
		panel.sqloption = {
			dbpool: null,
			sqlquery: null,
			columns: [],
			prompts: []
		};
		
		panel.__cl/*contentloaded*/ = false;
		
		if (!panel.uid)
		{
			if (!panel.modeluid && itemtype != "SQLCube" && itemtype != "DataCube" && itemtype != "NoSQL")
			{
				setTimeout(function() {
					IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SEL_MODEL"), function() {
						if (itemtype == "MDBCube")
						{
							var dlg = new IG$/*mainapp*/.MwPo/*mdb_cube_option*/({
								callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.rs_Op/*setOption*/)
							});
							IG$/*mainapp*/._I_5/*checkLogin*/(panel, dlg);
						}
						else
						{
							panel.sK5_m1a/*changeModel*/.call(panel);
						}
					}, null, 1, "warning");
				}, 100);
			}
		}
		else
		{
			panel.setLoading(true, true);
			
			if (panel.writable == true)
			{
				IG$/*mainapp*/._I56/*checkLock*/(panel, function(cmd) {
					var me = this;
					if (cmd != "unlock")
					{
						me.writable = false;
						me.down("[name=t_save]").hide();
					}
				});
			}
			
			panel.down("[name=b_m1]").show();
			
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
					ack: "6",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: panel.uid, type: "cube"}),
					mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "CubeContent", trid: panel.trid})
				}, panel, panel.rs_sK5/*procLoadContent*/, null, [b_loading]);
			req._l/*request*/();
		}
	},
	
	rs_sK5/*procLoadContent*/: function(xdoc, params) {
		var tnode,
			child,
			i, cs,
			me = this,
			snode, snodes,
			b_loading = params[0],
			j,
			grd_join = me.down("[name=grd_join]"),
			joins = [],
			item,
			itemtype = me.itemtype,
			dnode, dchild,
			bf,
			_nm = "/smsg/item";
		
		me.metricmap = {};
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm);
		me.nodepath = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "nodepath");
		
		me.modeluid = null;
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/objinfo");
		
		if (tnode)
		{
			me.modeluid = IG$/*mainapp*/._I06/*formatUID*/(IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "model"));
		}
		
		me.defaultstyle = [];
		me.customstyle = [];
		me._omc = {
			items: [],
			itemmap: {},
			sqldata: {},
			dataloader: {
				option: {}
			}
		};
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/MetricItems");
		
		if (tnode)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < child.length; i++)
			{
				item = {};
				IG$/*mainapp*/._I1f/*XGetInfo*/(item, child[i], "uid;nodepath;name;metrictype;stylename;type;sequence;uniquekey;fieldname;mcuid", "s");
				me._omc.items.push(item);
				me._omc.itemmap[item.uid] = item;
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/SQLData/item");

		if (tnode)
		{
			me._omc.sqldata.dbpool = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbpool");
			snode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "sqlquery");
			if (snode)
			{
				me._omc.sqldata.sql = IG$/*mainapp*/._I24/*getTextContent*/(snode);
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/DataLoader/Option");
		
		if (tnode)
		{
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < snodes.length; i++)
			{
				pname = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[i], "name");
				pvalue = IG$/*mainapp*/._I24/*getTextContent*/(snodes[i]);
				me._omc.dataloader.option[pname] = pvalue;
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/Styles");
		
		if (tnode)
		{
			me.c_cset = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "c_cset");
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/Styles/Default");
		
		if (tnode)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < child.length; i++)
			{
				cs = new IG$/*mainapp*/._IF7/*clReportStyle*/(child[i]);
				me.defaultstyle.push(cs);
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/Styles/Custom");
		
		if (tnode)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < child.length; i++)
			{
				cs = new IG$/*mainapp*/._IF7/*clReportStyle*/(child[i]);
				me.customstyle.push(cs);
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/SecurityFilter");
		
		me.securityfilter = [];
		
		if (tnode)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < child.length; i++)
			{
				cs = new IG$/*mainapp*/._IEb/*clFilterGroup*/(child[i]);
				me.securityfilter.push(cs);
			}
		}
		
		me._dcolumns = [];
		me.headermap = {};
		
		if (itemtype == "DataCube")
		{
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/result/Header");
			
			if (tnode)
			{
				child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < child.length; i++)
				{
					cs = IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[i]);
					cs.fieldid = cs.fieldid || "column_" + i;
					me._dcolumns.push(cs);
					me.headermap[cs.name] = cs;
				}
			}
			
			dnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/result/DataObjects");
			
			if (dnode)
			{
				dchild = IG$/*mainapp*/._I26/*getChildNodes*/(dnode);
				for (i=0; i < dchild.length; i++)
				{
					me.dataset.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(dchild[i]));
				}
			}
			
			me.down("[name=datainfo]").store.loadData(me.dataset);
		}
		else if (itemtype == "NoSQL")
		{
    		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/nosql");
	    	
	    	if (tnode)
	    	{
	    		me.dbnode = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbnode");
	    		me.dbscan = parseInt(IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbscan") || "100");
	    		
				me.dbtype = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbtype");
				me.dbname = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbname");
				me.tablename = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "tablename");
				
				me.dbnodes = [];
				
				dnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "dbnodes");
				
				if (dnode)
				{
					dchild = IG$/*mainapp*/._I26/*getChildNodes*/(dnode);
					for (i=0; i < dchild.length; i++)
					{
						me.dbnodes.push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(dchild[i]));
					}
				}
				
				if (me.dbtype)
				{
					me.mC1/*loadNoSQLTable*/();
				}
	    	}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/Relation");
		
		me.relations = [];
		
		if (tnode)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < child.length; i++)
			{
				cs = new IG$/*mainapp*/._IEa/*relations*/(child[i]);
				cs.MX/*makeInfo*/();
				joins.push({
					joinfrom: cs.joinfrom,
					jointo: cs.jointo,
					joincondition: cs.joincondition || "="
				});
				me.relations.push(cs);
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/hloption");
		
		me.hloption = [];
		
		if (tnode)
		{
			child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < child.length; i++)
			{
				cs = new IG$/*mainapp*/._Ie4/*highlight*/(child[i]);
				me.hloption.push(cs);
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/sqlsyntax");
		
		me.sqlsyntax = (tnode ? IG$/*mainapp*/._I24/*getTextContent*/(tnode) : "");
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, _nm + "/ExecuteSQL");
		
		if (tnode)
		{
			me.sqloption.dbpool = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "dbpool");
			snode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "SQL");
			if (snode)
			{
				me.sqloption.sqlquery = IG$/*mainapp*/._I24/*getTextContent*/(snode);
			}
			snode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "columns");
			if (snode)
			{
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
				for (i=0; i < snodes.length; i++)
				{
					var column = IG$/*mainapp*/._I4f/*parseColumn*/(snodes[i]);
					me.sqloption.columns.push(column);
				}
			}
			
			snode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "prompts");
			if (snode)
			{
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(snode);
				for (i=0; i < snodes.length; i++)
				{
					var prompt = new IG$/*mainapp*/._Ib4/*prompt*/(snodes[i]);
					me.sqloption.prompts.push(prompt);
				}
			}
		}
				
		grd_join.store.loadData(joins);
		
		if (b_loading && me.build_cube)
		{
			me.modeluid = me.modeluid || [];
			if (me.cube_model_uid)
			{
				bf = 0;
				
				for (i=0; i < me.modeluid.length; i++)
				{
					if (me.modeluid[i] == me.cube_model_uid)
					{
						bf = 1;
						break;
					}
				}
				
				!bf && me.modeluid.push(me.cube_model_uid);
			}		
		}
		
		if (me.modeluid && me.modeluid.length > 0)
		{
			if (itemtype == "MDBCube")
			{
				me.D_/*loadMDBTable*/();
			}
			else
			{
				me.sK6/*loadModelContent*/(b_loading);
			}
		}
		else if (itemtype == "SQLCube")
		{
			if (me.uid)
			{
				me.C_/*loadSQLTable*/();
				me.sK7/*loadCubeMetrics*/();
			}
		}
		else if (itemtype == "DataCube")
		{
			if (me.uid)
			{
				me.C_/*loadSQLTable*/();
				me.sK7/*loadCubeMetrics*/();
			}
		}
		else if (itemtype == "MCube")
		{
			if (me.uid)
			{
				me.MC_/*mcube_loadTable*/();
				me.sK7/*loadCubeMetrics*/();
			}
		}
		else if (itemtype == "NoSQL")
		{
			if (me.uid)
			{
				me.sK7/*loadCubeMetrics*/();
			}
		}
		else
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SEL_MODEL"), function() {
				if (itemtype == "MDBCube")
				{
					var dlg = new IG$/*mainapp*/.MwPo/*mdb_cube_option*/({
						callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_Op/*setOption*/)
					});
					IG$/*mainapp*/._I_5/*checkLogin*/(me, dlg);
				}
				else
				{
					me.sK5_m1a/*changeModel*/.call(me);
				}
			}, null, 1, "warning");
		}
		
		me.__cl/*contentloaded*/ = true;
		
		if (me.dataview.store.data.items.length)
		{
			var erritems = me.sK7_d/*diagnosticsCube*/();
			
			if (erritems.length > 0)
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("L_ERR_CUBE_ITEMS"), null, me, 1, "error");
			}
		}
	},
	
	rs_SOp/*setOption*/: function(mval) {
		// sql options
		var me = this,
			i,
			o, rec,
			records = {},
			metricdatas = me.metricdatas,
			dataview = me.dataview,
			d_ = "dataoption_",
			dn, t;
		
		// for (i=0; i < dataview.store.data.items.length; i++)
		for (i=0; i < metricdatas.length; i++)
		{
			// rec = dataview.store.data.items[i];
			t = metricdatas[i];
			if (t.ltype == "metric" && t.alias)
			{
				records[t.alias] = t; // rec;
			}
		}
		
		t = me.sqloption.columns;
		for (i=0; i < t.length; i++)
		{
			o = t[i];
			dn = o.dataoption;
			if (dn)
			{
				o[d_ + "valuetype"] = dn.valuetype; 
				o[d_ + "data"] = dn.data;
				o[d_ + "datadelimiter"] = dn.datadelimiter;
				o[d_ + "coldelimiter"] = dn.coldelimiter;
			}
			
			if (o.alias && records[o.alias])
			{
				rec = records[o.alias];
				rec.fieldname = o.fieldname;
				rec.alias = o.alias;
				rec.fieldinfo = o.fieldname;
				rec.dispname = o.dispname;
				rec.type = o.type;
				rec.ltype = o.type.toLowerCase();
				rec.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(rec.ltype);
				rec.edited = true;
				
				if (dn)
				{
					rec[d_ + "valuetype"] = dn.valuetype; 
					rec[d_ + "data"] = dn.data;
					rec[d_ + "datadelimiter"] = dn.datadelimiter;
					rec[d_ + "coldelimiter"] = dn.coldelimiter;
				}
				
				rec.edited = true;
				rec.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(rec.ltype);
			}
			else
			{
				o.pid = me._gp;
				// me.metricdatas.push(o);
			}
		}
		
		me.sK4L/*saveCubeMetrics*/(true);
		
		me.C_/*loadSQLTable*/();
		me._i0/*refreshDataSet*/(null, null, true);
	},
	
	rs_OP/*setPreprocOption*/: function(mval) {
		this.sqlsyntax = mval || "";
	},
	
	rs_Op/*setOption*/: function(mval) {
		var me = this;
		me.modeluid = IG$/*mainapp*/._I06/*formatUID*/(mval.dbname);
		me.D_/*loadMDBTable*/();
	},
	
	C_/*loadSQLTable*/: function() {
		var me = this,
			tabletree = me.tree,
			root = tabletree.getRootNode(),
			rnode = tabletree.store.getRootNode(),
			model = tabletree.store.model,
			i,
			itemtype = me.itemtype,
			columns = (itemtype == "DataCube") ? me._dcolumns : me.sqloption.columns,
			table,
			unode,
			col;
		
		// root.removeAll(true, false);
		// root.removeAll(true);
		while (root.firstChild)
		{
			root.removeChild(root.firstChild);
		}
		
		root.set("disp", itemtype == "DataCube" ? "Data Headers" : "Query Tables");
		
		me.modelcontent = {};
		
		table = {
			name: itemtype == "DataCube" ? "Headers" : "QueryTable",
			type: "Table"
		};
		table.uid = table.name;
		table.leaf = false;
		table.selected = true;
		table.checked = false;
		table.fields = [];
		table.disp = table.alias || table.name;
		
		me.modelcontent[table.uid] = table;
		
		unode = tabletree.appendNodeElement(root, table);
				
		for (i=0; i < columns.length; i++)
		{
			col = IG$/*mainapp*/._I1d/*CopyObject*/(columns[i]);
			col.leaf = true;
			col.type = "Field";
			col.checked = true;
			col.tableuid = table.uid; // table.uid;
			col.tableseq = table.seq; // table.seq;
			col.disp = col.alias || col.name;
			col.fieldid = columns[i].fieldid;
			table.fields.push(col);
			
			tabletree.appendNodeElement(unode, col);
		}
		
		root.expand();
	},
	
	D_/*loadMDBTable*/: function() {
		var panel = this;

		panel.setLoading(true, true);
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
				ack: "25",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid, option: "mdbfiles", method: "gettable", dbname: panel.modeluid}, "uid;dbname;method;option"),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "standard", trid: panel.trid})
			}, panel, panel.rs_D_/*loadMDBTable*/, null);
		req._l/*request*/();
	},
	
	rs_D_/*loadMDBTable*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/Tables"),
			tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
			i, j, tables = [], table,
			tabletree = me.tree,
			root = tabletree.getRootNode(),
			rnode = tabletree.store.getRootNode(),
			cnodes, unode, col;
		
		var Model = tabletree.store.model;
		me.modelcontent = {};
		rnode.removeAll();
		
		root.removeAll(true, false);
		
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				table = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				table.uid = table.name;
				table.leaf = false;
				table.selected = true;
				table.checked = false;
				table.fields = [];
				table.disp = table.alias || table.name;
				tables.push(table);
				
				me.modelcontent[table.uid] = table;
				
				cnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnodes[i]);

				unode = tabletree.appendNodeElement(root, table); // rnode.appendChild(record, true);
				
				for (j=0; j < cnodes.length; j++)
				{
					col = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cnodes[j]);
					col.leaf = true;
					col.checked = false;
					col.tableuid = table.uid;
					col.tableseq = table.seq;
					col.disp = col.alias || col.name;
					table.fields.push(col);
					// unode.appendChild(col);
					tabletree.appendNodeElement(unode, col);
				}
			}
		}
		
		if (me.uid)
		{
			me.sK7/*loadCubeMetrics*/();
		}
	},
	
	sK5_m1a/*changeModel*/: function() {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
				visibleItems: "workspace;folder;cubemodel;"
			});
		dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.sK5_m1/*changeCubeModelHandler*/);
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlgitemsel);
	},
	
	sK5_m1/*changeCubeModelHandler*/: function(item) {
		var me = this;
		
		if (item)
		{
			me.modeluid = IG$/*mainapp*/._I06/*formatUID*/(item.uid);
			
			me.sK6/*loadModelContent*/();
		}
	},
	
	sK6/*loadModelContent*/: function(b_loading) {
		var me = this;
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me, 
			{
				ack: "5",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: me.modeluid, type:"CubeModel"}),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({trid: me.trid})
			}, me, me.rs_sK6/*loadModelContent*/, null, [b_loading]);
		req._l/*request*/();
	},
	
	rs_sK6/*loadModelContent*/: function(xdoc, params) {
		var me = this,
			tree = me.tree,
			root = tree.getRootNode(),
			b_loading = params ? params[0] : 0,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/Tables"),
			child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			i, j,
			tableitem,
			fielditem,
			unode, schild,
			onode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/objinfo");
		
		me.modelcontent = {};
		
		// root.removeAll(true, false);
		while (root.firstChild)
		{
			root.removeChild(root.firstChild);
		}
		
		if (onode)
		{
			me.pooluid = IG$/*mainapp*/._I1b/*XGetAttr*/(onode, "pooluid");
			me.mfolder = IG$/*mainapp*/._I1b/*XGetAttr*/(onode, "mfolder");
		}
		
		for (i=0; i < child.length; i++)
		{
			tableitem = IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[i]); 
			tableitem.uid = IG$/*mainapp*/._I06/*formatUID*/(tableitem.uid);
			tableitem.leaf = false;
			tableitem.fields = [];
			tableitem.checked = false;
			tableitem.disp = tableitem.alias || tableitem.name;
			if (!tableitem.seq)
			{
				tableitem.seq = 0;
			}
			
			if (tableitem.seq && tableitem.seq > 0)
			{
				tableitem.disp += "#" + tableitem.seq;
			}
			
			me.modelcontent[tableitem.uid + "#" + tableitem.seq] = tableitem;

			unode = tree.appendNodeElement(root, tableitem);
			
			tree.appendNodeElement(unode, {
				disp: "Wait while loading",
				type: "ml_tb",
				uid: tableitem.uid,
				leaf: true
			});
		}
		
		root.expand();
		
		if (me.uid)
		{
			me.sK7/*loadCubeMetrics*/(undefined, b_loading);
		}
	},
	
	sK7/*loadCubeMetrics*/: function(uid, b_loading) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			luid = uid || me.uid;
		
		if (luid == me.__luid)
		{
			if (b_loading && me.build_cube)
			{
				me._b1/*build_cube*/();
			}
			return;
		}
			
		me.__luid = luid;	
		
		me.metricdatas = [];
		req.init(me, 
			{
				ack: "6",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: luid, type: "Cube"}),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "CubeMetrics", trid: me.trid})
			}, me, me.rs_sK7/*loadCubeMetrics*/, null, [b_loading]);
		req._l/*request*/();
	},
	
	rs_sK7/*loadCubeMetrics*/: function(xdoc, params) {
		var me = this,
			b_loading = params ? params[0] : 0,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			child = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			metricdatas = [],
			i, j,
			t, f, finfo, metric, field,
			sqlmap = {}, cmnode, cm, cmdisp,
			rf, vnode, rfs,
			itype,
			ldx;
			
		me.metricmap = {};
		
		me.metricdatas = metricdatas;
		
		if (me.sqloption && me.sqloption.columns)
		{
			for (i=0; i < me.sqloption.columns.length; i++)
			{
				me.sqloption.columns[i].uid = null;
				sqlmap[me.sqloption.columns[i].fieldname] = me.sqloption.columns[i];
			}
		}
		
		for (i=0; i < child.length; i++)
		{
			t = child[i];
			metric = {}, field = {};
			metric = IG$/*mainapp*/._I1c/*XGetAttrProp*/(t);
			itype = metric.type.toLowerCase();
			
			if (itype == "folder")
			{
				continue;
			}
			
			metric.relpath = me.sK8/*getRelativePath*/(metric.nodepath, metric.name);
			metric.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(itype);
			
			if (itype == "metric")
			{
				f = IG$/*mainapp*/._I17/*getFirstChild*/(t);
				finfo = IG$/*mainapp*/._I18/*XGetNode*/(child[i], "objinfo");
				
				if (finfo)
				{
					metric.fieldid = IG$/*mainapp*/._I1b/*XGetAttr*/(finfo, "fieldid");
				}
				
				finfo = IG$/*mainapp*/._I18/*XGetNode*/(child[i], "Metric/FieldInfo");
				if (finfo)
				{
					finfo = IG$/*mainapp*/._I17/*getFirstChild*/(finfo);
				}
			
				if (finfo)
				{
					IG$/*mainapp*/._I1f/*XGetInfo*/(field, finfo, "datasize;datatype;name;tableuid;tablename;tableseq;nodepath;codefield;codetable;sortfield;codeschema;codefilter1;codefilter2;codefilter3;viewmode;displabel;alias", "s");
					field.tableuid = IG$/*mainapp*/._I06/*formatUID*/(field.tableuid);
					if (!field.tableseq)
					{
						field.tableseq = "0";
					}
				}
			
				IG$/*mainapp*/._I1d/*CopyObject*/(field, metric, "datasize;datatype;tablename;tableuid;tableseq;alias");
				metric.fieldname = field.name;
				metric.fieldinfo = metric.tablename + "." + metric.fieldname;
				metric.fieldfullpath = field.nodepath;
				
				cmnode = IG$/*mainapp*/._I18/*XGetNode*/(child[i], "Metric/CodeTable");
				
				if (cmnode)
				{
					cm = IG$/*mainapp*/._I1c/*XGetAttrProp*/(cmnode);
					metric.codefield = cm.codefield;
					metric.codetable = cm.tablefield;
					metric.codetableuid = cm.tableuid;
					metric.valuefield = cm.valuefield;
					metric.sortfield = cm.sortfield;
					metric.codeschema = cm.codeschema;
					metric.viewmode = cm.viewmode;
					metric.displabel = cm.displabel;
					cmdisp = "";
					if (metric.codetable && metric.codefield && metric.valuefield)
					{
						ldx = metric.codetable.lastIndexOf("/");
						cmdisp = (ldx > -1) ? metric.codetable.substring(ldx+1) + "." : "";
						ldx = metric.codefield.lastIndexOf("/");
						cmdisp += (ldx > -1) ? metric.codefield.substring(ldx+1) + " - " : " - ";
						ldx = metric.valuefield.lastIndexOf("/");
						cmdisp += (ldx > -1) ? metric.valuefield.substring(ldx+1) : "";
						
						if (cmdisp == "")
						{
							cmdisp = "Error on codemapping";
						}
					}
					metric.codemapping = cmdisp;
					rf = IG$/*mainapp*/._I19/*getSubNode*/(cmnode, "RangeFilter");
					if (rf)
					{
						rfs = IG$/*mainapp*/._I26/*getChildNodes*/(rf);
						for (j=0; j < rfs.length; j++)
						{
							vnode = IG$/*mainapp*/._I19/*getSubNode*/(rfs[j], "value");
							metric["codefilter" + (j+1)] = IG$/*mainapp*/._I1b/*XGetAttr*/(rfs[j], "rangefield") + "|" + IG$/*mainapp*/._I24/*getTextContent*/(vnode);
						}
					}
				}
			}
			
			metric.selected = false;
			
			if (sqlmap && sqlmap[metric.fieldname])
			{
				t = sqlmap[metric.fieldname].dataoption;
				
				if (t)
				{
					metric.dataoption_data = t.data;
					metric.dataoption_valuetype = t.valuetype;
					metric.dataoption_datadelimiter = t.datadelimiter;
					metric.dataoption_coldelimiter = t.coldelimiter;
				}
				
				// if (!sqlmap[metric.fieldname].uid)
				// {
				// 	sqlmap[metric.fieldname].uid = metric.uid;
				// }
			}
			
			if (!me.metricmap[metric.relpath])
				me.metricmap[metric.relpath] = {};
				
			me.metricmap[metric.relpath][metric.name] = metric;
			metric.__uid = metric.__uid || "s_" + (me.__uid++);
			metricdatas.push(metric);
		}
		
		me.dataview.store.loadData(metricdatas);
		
		if (me.__cl/*contentloaded*/)
		{
			var erritems = me.sK7_d/*diagnosticsCube*/();
			
			if (erritems.length > 0)
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("L_ERR_CUBE_ITEMS"), null, me, 1, "error");
			}
		}
		
		if (b_loading && me.build_cube)
		{
			me._b1/*build_cube*/();
		}
	},
	
	_b1/*build_cube*/: function() {
		var me = this,
			dlg = new IG$/*mainapp*/._$1c/*process_cube_build*/({
				p_1: me
			});
			
		dlg.show();
	},
	
	sK7_d/*diagnosticsCube*/: function() {
		var me = this,
			modelcontent = me.modelcontent,
			i, j, sd, bmatch, erritems = [],
			sdkey, k,
			columns = me.sqloption ? me.sqloption.columns : null,
			cmap = {},
			cmap1 = {},
			itemtype = me.itemtype;
		
		if (itemtype == "DataCube")
		{
			columns = me._dcolumns;
		}
		
		if (columns && itemtype == "SQLCube")
		{
			for (i=0; i < columns.length; i++)
			{
				cmap["column_" + (i+1)] = columns[i];
				
				if (columns[i].fieldname)
				{
					cmap1[columns[i].fieldname] = columns[i];
				}
			}
		}
		else if (columns && itemtype == "DataCube")
		{
			for (i=0; i < columns.length; i++)
			{
				cmap[columns[i].fieldname] = columns[i];
			}
		}
		else if (columns && itemtype == "NoSQL")
		{
		}
			
		for (i=0; i < me.dataview.store.data.items.length; i++)
		{
			sd = me.dataview.store.data.items[i].data;
			
			if (sd.type == "Metric")
			{
				if (itemtype == "SQLCube")
				{
					sd.status = "";
					
					if (!sd.alias)
					{
						sd.status += "no_alias";
						
						if (cmap[sd.fieldname] && cmap[sd.fieldname].alias)
						{
							sd.alias = cmap[sd.fieldname].alias;
							sd.edited = true;
						}
					}
					else
					{
						if (cmap[sd.fieldname] && cmap[sd.fieldname].alias != sd.alias)
						{
							sd.status += "no_alias";
							sd.alias = cmap[sd.fieldname].alias;
							sd.edited = true;
						}
						else if (cmap1[sd.fieldname] && cmap1[sd.fieldname].alias != sd.alias)
						{
							sd.status += "no_alias";
							sd.alias = cmap1[sd.fieldname].alias;
							sd.edited = true;
						}
					}
				}
				else if (itemtype == "DataCube")
				{
					sd.status = "";
				}
				else if (itemtype == "NoSQL")
				{
					sd.status = "";
				}
				else
				{
					sdkey = sd.tableuid + "#" + sd.tableseq;
					if (!modelcontent)
					{
						sd.status = "";
					}
					else if (modelcontent)
					{
						sd.status = "";
						
						if (modelcontent[sdkey])
						{
							if (modelcontent[sdkey].name != sd.tablename)
							{
								sd.status += "tablenamemismatch";
								sd.tablename = modelcontent[sdkey].name;
								sd.fieldinfo = sd.tablename + (sd.tableseq != "0" ? "#" + sd.tableseq : "") + "." + sd.fieldname;
								sd.edited = true;
							}
							
							if (bmatch == false)
							{
								sd.status += ";fieldnotexist";
								sd.edited = true;
							}
						}
						else
						{
							for (k in modelcontent)
							{
								if (modelcontent[k].name == sd.tablename)
								{
									sd.tableuid = modelcontent[k].uid;
									sd.status += ";tablechanged";
									sd.edited = true;
									break;
								}
							}
						}
					}
					else
					{
						sd.status = "notexisttable";
					}
				}
				
				if (sd.status != "")
				{
					erritems.push(sd);
				}
			}
		}
		
		return erritems;
	},
	
	sK8/*getRelativePath*/: function(cpath, name) {
		var me = this,
			r = "",
			fpath = me.nodepath || "*";
		
		if (cpath.indexOf(fpath) == 0)
		{
			if (name)
			{
				r = cpath.substring(fpath.length, cpath.length - name.length);
			}
			else
			{
				r = cpath.substring(fpath.length);
			}
		}
		
		return r;
	},
	
	_m1/*getTransID*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
				ack: "11",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({act: "b", option: "trid"})
			}, me, function(xdoc) {
				var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
				if (tnode)
				{
					me.trid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "trid");
				}
				me.sK5/*procLoadContent*/(1);
			}, null);
		req._l/*request*/();
	},
	
	// mcube related functions //
	
	d1/*showSaveContent*/: function(cmd) {
		var me = this;
		if (!me.uid)
		{
			var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
				mode: "newitem",
				initpath: me.nodepath
			});
			dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_d1/*showSaveContent*/, cmd);
			IG$/*mainapp*/._I_5/*checkLogin*/(me, dlgitemsel);
			return false;
		}
		
		return true;
	},
	
	rs_d1/*showSaveContent*/: function(item, cmd) {
		if (item && item.nodepath && item.name)
		{
			var me = this,
				pivotxml = IG$/*mainapp*/._I2e/*getItemOption*/(),
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
			req.init(me, 
				{
					ack: "31",
					payload: "<smsg><item address='" + item.nodepath + "/" + item.name + "' name='" + item.name + "' type='" + "DataCube" + "' pid='" + item.uid + "' description=''/></smsg>",
					mbody: "<smsg><item address='" + item.nodepath + "'/></smsg>"
				}, me, function() {
					me._t$/*toolbarHandler*/(cmd);
				}, null);
		   	req.showerror = false;
			req._l/*request*/();
		}
	},
	
	MC_/*mcube_loadTable*/: function() {
		var me = this,
			tabletree = me.tree,
			root = tabletree.getRootNode(),
			rnode = tabletree.store.getRootNode(),
			model = tabletree.store.model,
			i,
			columns = me._omc.items,
			table,
			unode,
			col;
		
		while (root.firstChild)
		{
			root.removeChild(root.firstChild);
		}
		
		root.set("disp", "Field Items");
		
		table = {
			name: "Loaded Field",
			type: "Table"
		};
		table.uid = table.name;
		table.leaf = false;
		table.selected = true;
		table.checked = false;
		table.fields = [];
		table.disp = table.alias || table.name;
		
		unode = tabletree.appendNodeElement(root, table);
				
		for (i=0; i < columns.length; i++)
		{
			col = IG$/*mainapp*/._I1d/*CopyObject*/(columns[i]);
			col.leaf = true;
			col.type = "Field";
			col.checked = true;
			col.disp = col.name;
			table.fields.push(col);
			
			tabletree.appendNodeElement(unode, col);
		}
		
		root.expand();
	},
	
	MmD1/*mcube_loadDataSource*/: function() {
		var me = this,
			tabletree = me.tree,
			root = tabletree.getRootNode(),
			fnode = root.firstChild,
			i, r, item, items=[];
		
		if (fnode && fnode.childNodes)
		{
			for (i=0; i < fnode.childNodes.length; i++)
			{
				r = fnode.childNodes[i];
				item = {
					name: r.get("name"),
					mcuid: r.get("mcuid")
				};
				items.push(item);
			}
		}
		
		var dlg = new IG$/*mainapp*/.M$d10/*mcubefileloader*/({
			uid: me.uid,
			columns: items,
			mm: me._omc,
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_MmD1/*mcube_loadDataSource*/)
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlg);
	},
	
	rs_MmD1/*mcube_loadDataSource*/: function(option) {
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
			
			cnt = ["<smsg>"];
			
			for (i=0; i < option.columns.length; i++)
			{
				cnt.push("<column mcuid='" + option.columns[i].mcuid + "' name='" + option.columns[i].name + "' datatype='" + option.columns[i].datatype + "' isuse='" + (option.columns[i].selected == true ? "T" : "F") + "' ismeasure='" + (option.columns[i].ismeasure == true ? "T" : "F") + "'/>");
			}
			
			cnt.push("</smsg>");
			
			req.init(me, 
				{
					ack: "17",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, action: "38", datafile: option.datafile, delimiter: option.delimiter, datatransformer: option.datatransformer}, "uid;action;datafile;delimiter;datatransformer"),
					mbody: cnt.join("")
				}, me, me.rs_mD1a/*loadDataFile*/, null);
			req._l/*request*/();
		}
	},
	
	rs_mD1b/*applyCubeData*/: function(columns) {
		var me = this,
			i, items = {}, item, key, ukey,
			tabletree = me.tree,
			root = tabletree.getRootNode(),
			fnode = root.firstChild,
			dimseq = 1, measeq = 0,
			t;
		
		t = fnode ? fnode.childNodes : null;
		if (t)
		{
			for (i=0; i < t.length; i++)
			{
				r = t[i];
				key = r.get("name");
				items[key] = r;
			}
		}
		
		for (i=0; i < columns.length; i++)
		{
			item = columns[i];
			item.type = "Metric"; // (item.datatype == "number") ? "Measure" : "Metric";
			item.datatype = (item.datatype == "number") ? "numeric" : "string";
			item.metrictype = item.type;
			item.fieldname = item.name;
			item.sequence = (item.datatype == "numeric") ? 0 : dimseq++;
			item.uniquekey = (item.datatype == "numeric") ? measeq++ : -1;
	   		item.disp = item.name;
	   		item.leaf = true;
	   		item.checked = true;
	   		
			key = item.name;
			
			t = items[key];
			if (t)
			{
				t.set("type", item.type);
				t.set("datatype", item.datatype);
				t.set("metrictype", item.metrictype);
				t.set("fieldname", item.fieldname);
				t.set("uniquekey", item.uniquekey);
				t.set("sequence", item.sequence);
				t.set("mcuid", item.mcuid);
			}
			else
			{
				tabletree.appendNodeElement(fnode, item);
			}
		}
	},
	
	rs_mD1a/*loadDataFile*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
			i, items = {}, item, key, ukey,
			tabletree = me.tree,
			root = tabletree.getRootNode(),
			fnode = root.firstChild,
			t;
		
		me.setLoading(false);
		
		if (tnodes)
		{
			if (fnode && fnode.childNodes)
			{
				for (i=0; i < fnode.childNodes.length; i++)
				{
					r = fnode.childNodes[i];
					key = r.get("mcuid");
					items[key] = r;
				}
			}
			
			for (i=0; i < tnodes.length; i++)
			{
				item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				item.type = "Field"; // (item.ismeausre == "T") ? "Measure" : "Metric";
				item.datatype = (item.ismeasure == "T") ? "numeric" : "string";
				item.metrictype = item.type;
				item.fieldname = item.name;
				item.sequence = item.sequence;
				item.uniquekey = item.uniquekey;
				item.leaf = true;
				item.disp = item.name;
				item.checked = true;
				
				key = item.mcuid;
				
				t = items[key];
				if (t)
				{
					t.set("type", item.type);
					t.set("datatype", item.datatype);
					t.set("metrictype", item.metrictype);
					t.set("fieldname", item.fieldname);
					t.set("uniquekey", item.uniquekey);
					t.set("sequence", item.sequence);
				}
				else
				{
					tabletree.appendNodeElement(fnode, item); // dataview.store.add(item);
				}
			}
		}
	},
	
	Mmm1/*mcube_buildCube*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			dataview = me.dataview,
			store = dataview.store,
			item,
			i,
			haserror = false,
			t;
		
		t = store.data.items;
		for (i=0; i < t.length; i++)
		{
			item = t[i];
			if (item.get("type") == "Metric" && !item.get("uid"))
			{
				haserror = true;
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Save Cube before build multi dimensional database", null, null, 0, "success");
				break;
			}
		}
		
		if (haserror == false)
		{
			req.init(me, 
				{
					ack: "17",
					payload: "<smsg><item cubeuid='" + me.uid + "' action='BuildCube'/></smsg>",
					mbody: "<smsg></smsg>"
				}, me, me.rs_Mmm1/*mcube_buildCube*/, null);
			req._l/*request*/();
		}
	},
	
	rs_Mmm1/*mcube_buildCube*/: function(xdoc) {
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
	},
	
	Mmm2/*mcube_appendNewMetric*/: function() {
		var me = this,
			dataview = me.dataview,
			selmodel = dataview.getSelectionModel(),
			cubeaddress = me.cubeaddress,
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
			name: me.nameprefix + (me.nindex++),
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
	
	MmD2/*mcube_loadSQLSource*/: function() {
		var me = this,
			dataview = me.dataview,
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
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_MmD2/*mcube_loadSQLSource*/)
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(me, dlg);
	},
	
	rs_MmD2/*mcube_loadSQLSource*/: function(option) {
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
			
			cnt = ["<smsg>"];
			
			for (i=0; i < option.columns.length; i++)
			{
				cnt.push("<column uid='" + (option.columns[i].uid || "") + "' name='" + option.columns[i].name + "' datatype='" + option.columns[i].datatype + "' isuse='" + (option.columns[i].selected == true ? "T" : "F") + "'/>");
			}
			
			cnt.push("</smsg>");
			
			obj = ["<smsg><item uid='" + me.uid + "' action='sqlcube' dbpool='" + option.dbpool + "'>"];
			obj.push("<SQL><![CDATA[" + option.sql + "]]></SQL>");
			obj.push("</item></smsg>");
			
			req.init(me, 
				{
					ack: "17",
					payload: obj.join(""),
					mbody: cnt.join("")
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
	
	Mlm1/*mcube_doDeleteDB*/: function(btn) {
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
	
	// mcube related functions //
	
	_d1/*do_step*/: function(seq) {
		var me = this,
			tree = me.tree,
			mtree = me.down("[name=mtree]"),
			gnode, rec,
			mnode, cnames,
			i, j, srec, k, n,
			address, content,
			cname, cnameseq,
			_parentpath, _c, _r, req;
		
		if (seq == 0)
		{
			// expand all tree node
			gnode = me.tree.getRootNode();
			
			for (i=0; i < gnode.childNodes.length; i++)
			{
				rec = gnode.childNodes[i];
				rec.expand();
			}
			
			mnode = mtree.getRootNode();
			
			mtree._I92/*refreshNode*/.call(mtree, mnode);
			
			me._d2/*check_expanded*/(gnode, mnode);
		}
		else if (seq == 1)
		{
			// create folder if not exist
			gnode = me.tree.getRootNode();
			cnames = {};
			for (i=0; i < gnode.childNodes.length; i++)
			{
				rec = gnode.childNodes[i];
				cname = rec.get("name");
				
				if (cnames[cname])
				{
					cnameseq = 1;
					
					while (cnames[cname + "_" + cnameseq])
					{
						cnameseq++;
					}
					
					cname = cname + "_" + cnameseq;
				}
				
				rec.set("fname", cname);
				cnames[cname] = 1;
			}
			mnode = mtree.getRootNode();
			for (i=0; i < mnode.childNodes.length; i++)
			{
				rec = mnode.childNodes[i];
				if (cnames[rec.get("name")])
				{
					delete cnames[rec.get("name")];
				}
			}
			
			_parentpath = me.nodepath;
			
			address = ["<smsg>"];
			content = ["<smsg>"];
			n=0;
			for (k in cnames)
			{
				_r = "<item name='" + k + "'"
				   + " uid='" + _parentpath + "/" + k + "' type='Folder' createstructure='T' pid='" + me.uid + "'"
				   + "/>";
				   
				_c = "<item name='" + k + "'></item>";
				
				content.push(_c);
				address.push(_r);
				n++;
			}
			
			address.push("</smsg>");
			content.push("</smsg>");
			
			if (n > 0)
			{
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(me, 
					{
						ack: "30",
						payload: address.join(""),
						mbody: content.join("")
					}, me, function(xdoc) {
						mtree._I92/*refreshNode*/.call(mtree, mnode);
						me._d2/*check_expanded*/(gnode, mnode);
					});
				req._l/*request*/();
			}
			else
			{
				me.fireEvent("_bb_comp");
			}
		}
		else if (seq == 2)
		{
			// drop node to create metric item
			gnode = me.tree.getRootNode();
			cnames = {};

			for (i=0; i < gnode.childNodes.length; i++)
			{
				rec = gnode.childNodes[i];
				k = 0;
				for (j=0; j < rec.childNodes.length; j++)
				{
					if (rec.childNodes[j].get("checked"))
					{
						k = 1;
						break;
					}
				}
				
				if (k == 0)
				{
					for (j=0; j < rec.childNodes.length; j++)
					{
						rec.childNodes[j].set("checked", true);
					}
				}
			}
			
			mnode = mtree.getRootNode();
			
			me.__grec = [];
			me.__rrec = [];
			
			for (i=0; i < gnode.childNodes.length; i++)
			{
				rec = gnode.childNodes[i];
				me.__grec.push(rec);
			}
			
			me._p1/*processrecords*/();
		}
		else if (seq == 3)
		{
			// create measure and custom metric
			if (me.__rrec.length)
			{
				var pop = new IG$/*mainapp*/._Ic9/*multiMeasure*/({
					metaitems: me.__rrec,
					vmode: 1,
					pcube: me,
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_sk5n/*regmeasures*/)
				});
				IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
			}
			me.fireEvent("_bb_comp");
		}
		else
		{
			// save content and refresh content
			me.sK4L/*saveCubeMetrics*/();
			me.fireEvent("_bb_comp");
		}
	},
	
	_p1/*processrecords*/: function() {
		var me = this,
			j,
			mtree = me.down("[name=mtree]"),
			mnode = mtree.getRootNode(),
			rec = me.__grec[0],
			srec;
			
		if (rec)
		{
			me.__grec.splice(0, 1);
			
			for (j=0; j < mnode.childNodes.length; j++)
			{
				if (rec.get("fname") == mnode.childNodes[j].get("name"))
				{
					srec = mnode.childNodes[j];
					break;
				}
			}
			
			if (!srec)
			{
				for (j=0; j < mnode.childNodes.length; j++)
				{
					if (rec.get("name") == mnode.childNodes[j].get("name"))
					{
						srec = mnode.childNodes[j];
						break;
					}
				}
			}
			
			if (srec)
			{
				me._gp = srec.get("uid");
				me._gpp = srec.get("nodepath");
				me._1/*processTableDrop*/.call(me, rec.data, rec.childNodes, 0, new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
					me._a1/*make_recommand*/.call(me);
				}));
			}
		}
	},
	
	_a1/*make_recommand*/: function() {
		var me = this,
			i,
			dataview = me.dataview,
			rec, item,
			datatype,
			dname, dpath, ctype,
			lname,
			b;
		
		for (i=0; i < dataview.store.data.items.length; i++)
		{
			rec = dataview.store.data.items[i];
			if (rec.get("uid"))
			{
				datatype = rec.get("datatype");
				dname = rec.get("name").toLowerCase();
				datatype = datatype ? datatype.toLowerCase() : null;
				dpath = rec.get("nodepath");
				dpath = dpath.substring(0, dpath.lastIndexOf("/"));
				
				b = 0;
				
				if (datatype && /(number|numeric|decimal|float|double|int)/.test(datatype))
				{
					b = 1;
					dpath = dpath + "/" + IRm$/*resources*/.r1("L_MEASURE");
					ctype = "Measure";
					lname = IRm$/*resources*/.r1("L_C_TOTAL", rec.get("name"));
				}
				else if (/(date|time|datetime|timestamp)/.test(datatype))
				{
					b = 3;
					dpath = dpath + "/" + IRm$/*resources*/.r1("L_B_CM");
					ctype = "DateMetric";
					lname = IRm$/*resources*/.r1("L_C_DATE", rec.get("name"));
				}
				else if (dname.indexOf("_id") > -1)
				{
					b = 2;
					dpath = dpath + "/" + IRm$/*resources*/.r1("L_MEASURE");
					ctype = "Measure";
					lname = IRm$/*resources*/.r1("L_C_DCOUNT", rec.get("name"));
				}
				
				if (b)
				{
					item = {};
					IG$/*mainapp*/._I1d/*CopyObject*/(rec.data, item, "uid;name;type;memo;nodepath", "s");
					item.measurename = lname; // item.name + " Total";
					item.formula = b == 1 ? "SUM" : (b == 2 ? "COUNT DISTINCT" : "");
					item.clocation = dpath;
					item.ctype = ctype;
					me.__rrec.push(item);
				}
			}
		}
		
		me.dataview.store.loadData([]);
		
		if (me.__grec.length)
		{
			setTimeout(function() {
				me._p1/*processrecords*/.call(me);
			}, 20);
		}
		else
		{
			me.fireEvent("_bb_comp");
		}
	},
	
	_d2/*check_expanded*/: function(groot, mroot) {
		var me = this,
			bf = 1,
			rec,
			i;
			
		for (i=0; i < groot.childNodes.length; i++)
		{
			rec = groot.childNodes[i];
			if (rec.childNodes && rec.childNodes.length && rec.childNodes[0].get("type") == "ml_tb")
			{
				bf = 0;
				break;
			}
		}
		
		if (bf)
		{
			for (i=0; i < mroot.childNodes.length; i++)
			{
				rec = mroot.childNodes[i];
				if (rec.childNodes && rec.childNodes.length && rec.childNodes[0].get("type") == "load")
				{
					bf = 0;
					break;
				}
			}
		}
			
		if (bf)
		{
			me.fireEvent("_bb_comp");
		}
		else
		{
			setTimeout(function() {
				me._d2/*check_expanded*/.call(me, groot, mroot);
			}, 500);
		}
	},
	
	// nosql related functions 
	
	mC1/*loadNoSQLTable*/: function() {
		var me = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	
    	if (!(me.dbnodes && me.dbnodes.length))
    	{
    		return;
    	}
    	
    	me.setLoading(true);
    	
    	req.init(me, 
			{
	            ack: "25",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({address: "/" + me.dbname, option: "StoredContent"}, "address;option"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
	        }, me, function(xdoc) {
	        	var me = this,
					tabletree = me.tree,
					root = tabletree.getRootNode(),
					rnode = tabletree.store.getRootNode(),
					model = tabletree.store.model,
					i, j,
					itemtype = me.itemtype,
					table,
					unode,
					snodes,
					colls = [],
					col,
					berr = 0;
				
				while (root.firstChild)
				{
					root.removeChild(root.firstChild);
				}
				
				root.set("disp", "Documents");
		    	me.modelcontent = {};
		    	
		    	
		    	tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		    	
		    	if (tnode)
		    	{
		    		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
		    		
		    		for (i=0; i < tnodes.length; i++)
		    		{
		    			table = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
		    			colls.push(table);
		    		}
		    		
		    		if (colls.length)
		    		{
		    			$.each(colls, function(i, c) {
		    				var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
			    			lreq.init(me, 
							{
					            ack: "25",
					            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: c.uid, option: "StoredContent"}, "uid;option"),
					            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
					        }, me, function(xdoc) {
					        	me.setLoading(false);
					        	
					        	var i,
					        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					        		tnodes,
					        		table;
					        	
					        	if (tnode)
						    	{
						    		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
									for (i=0; i < tnodes.length; i++)
									{
										table = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
										table.type = "Table";
										table.uid = table.uid;
										table.seq = 0;
										table.selected = false;
										table.checked = false;
										table.fields = [];
										table.leaf = false;
										table.disp = table.name;
										
										me.modelcontent[table.uid] = table;
										unode = tabletree.appendNodeElement(root, table);
										
										tabletree.appendNodeElement(unode, {
											disp: "Wait while loading",
											type: "ml_tb",
											uid: table.uid,
											leaf: true
										});
									}
								}
					    	});
					    	lreq._l/*request*/();
					    });
		    		}
		    		else
		    		{
		    			berr = 1;
		    		}
		    	}
		    	else
		    	{
		    		berr = 1;
		    	}
		    	
		    	berr == 1 && me.setLoading(false);
		    	root.expand();
		    	
	        }, null);
		req._l/*request*/();
	},
	
	// end of nosql related functions
	
	initComponent: function(){
		var panel = this,
			me = this,
			bhidden = false,
			mhidden = true,
			dhidden = true,
			itemtype = me.itemtype;
			
		me.__uid = 0;
		
		me.pl = [
			"name", "nodepath", "uid", "datasize", "datatype", "fieldfullpath", "fieldinfo", "fieldname", "relpath",
			"selected", "tablename", "tableuid", "tableseq", "type", "codetable", "codefield", "codeschema", "codemapping",
			"codetableuid", "valuefield", "sortfield", "codefilter1", "codefilter2", "codefilter3", "ukey", "folder", "viewmode", "displabel",
			"dataoption_data", "dataoption_datadelimiter", "dataoption_coldelimiter", "dataoption_valuetype", "dispname",
			"edited", "pid", "__uid", "iconcls", "writable", "alias", "metrictype", "sequence", "uniquekey", "mcuid", "fieldid", "fname"
		];
		
		// for tree view
		me.tree = new IG$/*mainapp*/._Ib0/*tabletree*/({
			border: 0,
			flex: 1,
			cmode: 1
		});
		// end of tree view
		
		bhidden = (/MDBCube|SQLCube|MCube|DataCube|NoSQL/).test(itemtype);
		mhidden = itemtype != "MCube";
		dhidden = itemtype != "DataCube";
		
		me.addEvents("_bb_comp");
		
		$s.apply(me, {
			dockedItems: [
				{
					xtype: "toolbar",
					dock: "top",
					hidden: IG$/*mainapp*/.__ep,
					items: [ 
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
							iconCls: "icon-toolbar-saveas",
							tooltip: IRm$/*resources*/.r1("L_SAVE_CUBE"),
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_saveas"); 
							},
							scope: this
						},
						{
							xtype: "tbseparator",
							hidden: !mhidden || bhidden ? true : false
						},
						{
							iconCls: "icon-toolbar-import",
							tooltip: IRm$/*resources*/.r1("L_IMPORT_FILE"),
							text: "Upload File",
							hidden: dhidden,
							handler: function() { this._t$/*toolbarHandler*/("cmd_import"); },
							scope: this
						}, 
						{
							iconCls: "icon-toolbar-mcubefile",
							text: IRm$/*resources*/.r1("L_LD_FILE"),
							tooltip: IRm$/*resources*/.r1("L_LD_FILE"),
							hidden: mhidden,
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_ld_file"); 
							},
							scope: this
						},
						{
							iconCls: "icon-toolbar-mcubedb",
							tooltip: IRm$/*resources*/.r1("L_LD_SQL_D"),
							text: IRm$/*resources*/.r1("L_LD_SQL"),
							hidden: true, // mhidden,
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
						
						{
							xtype: "tbseparator",
							hidden: mhidden
						},
						{
							iconCls: "icon-toolbar-db-unload",
							tooltip: IRm$/*resources*/.r1("L_LD_UL"),
							text: IRm$/*resources*/.r1("L_LD_UL"),
							hidden: true, // mhidden,
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_db_unload");
							},
							scope: this
						},
						{
							iconCls: "icon-toolbar-db-load",
							tooltip: IRm$/*resources*/.r1("L_LD_LK"),
							text: IRm$/*resources*/.r1("L_LD_LK"),
							hidden: true, // mhidden,
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_db_load");
							},
							scope: this
						},
						{
							xtype: "tbseparator",
							hidden: true // mhidden
						},
						{
							iconCls: "icon-toolbar-db-destroy",
							text: IRm$/*resources*/.r1("L_LD_INI"),
							title: IRm$/*resources*/.r1("L_LD_INI"),
							hidden: mhidden,
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_db_destroy");
							},
							scope: this
						},
						
						
						{
							iconCls: "icon-toolbar-model_new",
							tooltip: IRm$/*resources*/.r1("L_MODEL_CREATE"),
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_model_new"); 
							},
							hidden: bhidden,
							scope: this
						},
						{
							iconCls: "icon-toolbar-model",
							tooltip: IRm$/*resources*/.r1("L_MODEL_SELECT"),
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_model"); 
							},
							hidden: bhidden,
							scope: this
						},
						{
							iconCls: "icon-toolbar-model_edit",
							tooltip: IRm$/*resources*/.r1("L_MODEL_EDIT"),
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_model_edit"); 
							},
							hidden: bhidden,
							scope: this
						},
						{
							xtype: "tbseparator",
							hidden: bhidden
						},
						{
							iconCls: "icon-toolbar-option",
							tooltip: "MDB Options",
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_mdb_option");
							},
							hidden: itemtype == "MDBCube" ? false : true,
							scope: this
						},
						{
							iconCls: "icon-toolbar-option",
							tooltip: "NoSQL Options",
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_nosql_option");
							},
							hidden: itemtype == "NoSQL" ? false : true,
							scope: this
						},
						{
							iconCls: "icon-toolbar-sql",
							text: "SQL",
							tooltip: "SQL Input",
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_sql_input");
							},
							hidden: itemtype == "SQLCube" ? false : true,
							scope: this
						},
						{
							iconCls: "icon-refresh",
							tooltip: IRm$/*resources*/.r1("L_REFRESH"),
							handler: function() {
								this._t$/*toolbarHandler*/("cr"/*cmd_refresh*/); 
							},
							scope: this
						},
						{
							iconCls: "icon-measure",
							tooltip: IRm$/*resources*/.r1("L_REG_MEASURES"),
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_regmeasures"); 
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
						{
							iconCls: "icon-toolbar-style",
							tooltip: "Style",
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_style");
							},
							scope: this
						},
						{
							iconCls: "icon-toolbar-filter",
							tooltip: "Security Filter",
							hidden: (itemtype == "SQLCube" || itemtype == "DataCube" ? true : false),
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_sec_filter");
							},
							scope: this
						},
						{
							iconCls: "icon-toolbar-hl",
							tooltip: IRm$/*resources*/.r1('L_TB_HL'),
							handler: function() {
								this._ILb_/*contentchanged*/ = true;
								this._t$/*toolbarHandler*/('cmd_hl_option');
							},
							scope: this
						},
						{
							iconCls: "icon-toolbar-sql",
							text: "QueryTool",
							tooltip: "QueryTool",
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_query_tool");
							},
							hidden: itemtype == "SQLCube" ? false : true,
							scope: this
						},
						{
							iconCls: "icon-toolbar-preproc",
							text: IRm$/*resources*/.r1("L_SQL_PRE"),
							tooltip: IRm$/*resources*/.r1("L_SQL_PRE"),
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_pre_proc");
							},
							hidden: itemtype == "SQLCube" || itemtype == "DataCube" || itemtype == "NoSQL" ? true : false,
							scope: this
						},
						"->",
						{
							iconCls: "icon-report",
							text: IRm$/*resources*/.r1("M_REPORT"),
							name: "b_m1",
							hidden: true,
							handler: function() {
								this._t$/*toolbarHandler*/("cmd_report");
							},
							scope: this
						}
//						,
//						"-",
//						{
//							iconCls: "icon-toolbar-help",
//							tooltip: IRm$/*resources*/.r1("B_HELP"),
//							handler: function() {
//								IG$/*mainapp*/._I63/*showHelp*/("P0005");
//							}
//						}
					]
				}
			],
			
			items: [
				{
					xtype: "panel",
					layout: "fit",
					region: "west",
					collapsed: false,
					width: 200,
					collapsible: true,
					split: true,
					useSplitTips: true,
					title: IRm$/*resources*/.r1("L_NAVIGATOR"),
					tbar: [
						{
							xtype: "button",
							name: "t_btn",
							text: IRm$/*resources*/.r1("L_CREATE_ITEM"),
							disabled: true,
							menu: {
								xtype: "menu",
								items: [
									{
										text: IRm$/*resources*/.r1("D_FOLDER"),
										hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"], 
										handler: function() {
											this._d/*createItem*/("Folder");
										},
										scope: this
									},
									"-",
									{
										text: IRm$/*resources*/.r1("D_CUSTOMMETRIC"),
										hidden: ig$/*appoption*/.fm/*features*/["ig_n_cm"], 
										handler: function() {
											this._d/*createItem*/("CustomMetric");
										},
										scope: this
									},
									{
										text: IRm$/*resources*/.r1("D_MEASURE"),
										hidden: ig$/*appoption*/.fm/*features*/["ig_n_ms"], 
										handler: function() {
											this._d/*createItem*/("Measure");
										},
										scope: this
									},
									{
										text: IRm$/*resources*/.r1("D_FORMULA"),
										hidden: ig$/*appoption*/.fm/*features*/["ig_n_fm"], 
										handler: function() {
											this._d/*createItem*/("FormulaMeasure");
										},
										scope: this
									},
									
									"-",
									{
										text: IRm$/*resources*/.r1("D_DATEMETRIC"),
										hidden: ig$/*appoption*/.fm/*features*/["ig_n_dm"], 
										handler: function() {
											this._d/*createItem*/("DateMetric");
										},
										scope: this
									},
									{
										text: IRm$/*resources*/.r1("D_CHARTMEASURE"),
										hidden: ig$/*appoption*/.fm/*features*/["ig_n_cms"], 
										handler: function() {
											this._d/*createItem*/("ChartMeasure");
										},
										scope: this
									},
									{
										text: IRm$/*resources*/.r1("D_UDG"),
										hidden: ig$/*appoption*/.fm/*features*/["ig_n_udg"], 
										handler: function() {
											this._d/*createItem*/("GroupField");
										},
										scope: this
									},
									{
										text: IRm$/*resources*/.r1("D_HIERARCHY"),
										hidden: ig$/*appoption*/.fm/*features*/["ig_n_hm"], 
										handler: function() {
											this._d/*createItem*/("Hierarchy");
										},
										scope: this
									},
									{
										xtype: "menuseparator",
										hidden: itemtype != "DataCube"
									},
									{
										text: IRm$/*resources*/.r1("D_TABDIMENSION"),
										hidden: itemtype != "DataCube" || ig$/*appoption*/.fm/*features*/["ig_n_tabdim"], 
										handler: function() {
											this._d/*createItem*/("TabDimension");
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
						new IG$/*mainapp*/._Idd/*explorerTree*/({
							name: "mtree",
							rootuid: this.uid,
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
									
									if (typename == "folder")
									{
										menu.add({
											text: IRm$/*resources*/.r1("B_FOLDER"),
											hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
											handler: function() {
												this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, rec);
								   	   		},
								   	   		scope: this
										});
									}
									
									menu.add({
										text: IRm$/*resources*/.r1("L_RENAME_ITEM", itemname),
										hidden: ig$/*appoption*/.fm/*features*/["ig_n_ren"],
										handler: function() {
											this._I91/*renameMetaObject*/.call(this, itemname, itemuid, itemaddr, record);
										},
										scope: this
									});
									
									menu.add({
										text: IRm$/*resources*/.r1("L_DELETE_ITEM", itemname),
										hidden: ig$/*appoption*/.fm/*features*/["ig_n_del"],
										handler: function() {
											this._IHf/*deleteMetaObject*/.call(this, itemuid, record);
										},
										scope: this
									});
								}
								
								return r;
							},
							_i4/*itemExpandHandler*/: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(node, isexpand) {
								this.rs__i3/*cellClickHandler*/(node, 1, 0);
							}),
							_i3/*cellClickHandler*/: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(node, isexpand) {
								this.rs__i3/*cellClickHandler*/(node, 0, 1);
							})
						})
					]
				},
				{
					title: IRm$/*resources*/.r1("L_TABLES"),
					region: "east",
					floatable: false,
					"layout": {
						type: "vbox",
						align: "stretch"
					},
					collapsed: false,
										
					items: [
						me.tree,
						{
							xtype: "displayfield",
							value: IRm$/*resources*/.r1("L_TABLE_DROP") // "Drag column or table and drop on table list"
						},
						{
							xtype: "gridpanel",
							plain: true,
							hidden: itemtype != "DataCube",
							name: "datainfo",
							title: IRm$/*resources*/.r1("L_LD_FLS"),
							height: 200,
							resizable: false,
							"layout": "fit",
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
							fbar: [
								{
			  						xtype: "checkbox",
			  						name: "cbloadlastonly",
			  						fieldLabel: "",
			  						hideLabel: false,
			  						boxLabel: IRm$/*resources*/.r1("L_L_TAB")
			  					}
							],
							columns: [
								{
									xtype: "gridcolumn",
									flex: 1,
									text: IRm$/*resources*/.r1("B_NAME"),
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
												me.cxc/*loadDataSet*/(rowIndex);
											},
											scope: me
										},
										{
											// icon: "./images/delete.png",
											iconCls: "icon-grid-delete",
											tooltip: IRm$/*resources*/.r1("B_DELETE_ITEM"),
											handler: function (grid, rowIndex, colIndex) {
												var me = this;
												IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("L_C_DEL_ITEM"), function(dlg) {
													if (dlg == "yes")
													{
														var rec = grid.store.getAt(rowIndex);
														grid.store.remove(rec);
													}
												}, me, me);
											},
											scope: me
										}
									]
								}
							]
						}
					],
					
					width: 230,
					
					listeners: {
						beforecollapse: function() {
							
						},
						beforeexpand: function() {
						},
						scope: this
					}
				}, 
				{
					"layout": "border",
					items: [
						{
							xtype: "panel",
							layout: "fit",
							title: IRm$/*resources*/.r1("L_FOLDER_ITEMS"),
							region: "center",
							flex: 1,
							items: [
								{
									xtype: "gridpanel",
									name: "dataview",
									collapsible: false,
									iconCls: "icon-grid",
									frame: false,
									emptyText: IRm$/*resources*/.r1("L_EMPTY_DATA"),
									store: {
										xtype: "store",
										sorters: ["name"],
										groupField: "relpath",
										fields: me.pl,
										data: []
									},
									
									header: false,
									
									// features: [groupFeature],
									
									plugins: [
										{
											ptype: "cellediting",
											clicksToMoveEditor: 1,
											autoCancel: false,
											listeners: {
												edit: function(editor, context, eopts) {
													var me = this,
														rec = context.record,
														p;
														
													rec.set("edited", true);
													me._s5/*updateDataSet*/(p, rec);
												},
												scope: this
											}
										}
									],
									
									viewConfig: {
										plugins: {
											ptype: "gridviewdragdrop",
											ddGroup: "cubeDDGroup"
										},
										listeners: {
											beforedrop: function(node, data, dropRec, dropPosition, dropFunction, eopts) {
												var r = true,
													index,
													me = this,
													rc = (data.records && data.records.length > 0) ? data.records[0] : null,
													// dc = $(node).text(),
													changefield = false,
													rctype = rc ? rc.data.type : null,
													rcptype = rc && rc.parentNode ? rc.parentNode.data.type : null;
																			
												(this == data.view) ? data.copy = false : data.copy = true;
												
												index = (dropRec) ? me.panel.store.indexOf(dropRec) : 0;
													
												if (rc && (rctype == "Table" || rctype == "InlineView"))
												{
													panel._1/*processTableDrop*/.call(panel, rc.data, rc.childNodes, index);
													r = false;
												}
												else if (rc && (rctype == "Field" || (rcptype == "InlineView" && (rctype == "Metric" || rctype == "Measure"))))
												{
													panel._3/*processFieldDrop*/.call(panel, rc.data, index, rc.parentNode.data.uid, rc.parentNode.data.name, rc.parentNode.data.seq);
													r = false;
												}
													
												return r;
											},
											
											drop: function(node, data, dropRec, dropPosition) {
												var dropOn = dropRec ? " " + dropPosition + " " + dropRec.get("name") : " on empty view";
												return false;
											}
										}
									},
									
									columns: [
										{
											xtype: "checkcolumn",
											dataIndex: "selected",
											width: 30,
											menuDisabled: true,
											editor: {
												xtype: "checkbox",
												cls: "x-grid-checkheader-editor"
											}
										},
										{
											text: "",
											dataIndex: "iconcls",
											menuDisabled: true,
											width: 30,
											renderer: function(value) {
												return "<div class='igc_g_icon " + value + "'></div>";
											}
										},
										{
											text: IRm$/*resources*/.r1("B_NAME"),
											dataIndex: "name",
											flex: 2,
											tdCls: "igc-td-link",
											editor: {
												allowBlank: false
											}
										},
										{
											text: IRm$/*resources*/.r1("B_DISP_NAME"),
											dataIndex: "dispname",
											flex: 1
										},
										{
											text: IRm$/*resources*/.r1("L_TABLE_FIELD"),
											dataIndex: "fieldinfo",
											hidden: (itemtype == "MCube" || itemtype == "DataCube"),
											menuDisabled: true,
											flex: 1
										},
										{
											text: IRm$/*resources*/.r1("L_CODE_FIELD"),
											dataIndex: "codemapping",
											menuDisabled: true,
											hidden: (itemtype == "SQLCube" || itemtype == "MCube" || itemtype == "DataCube" || itemtype == "NoSQL" ? true : false),
											width: 80,
											flex: 1
										},
										{
											xtype: "actioncolumn",
											width: 50,
											menuDisabled: true,
											hidden: true,
											items: [
												{
													// icon: "./images/plus-circle.png",
													iconCls: "icon-grid-add",
													tooltip: "Set CodeMapping",
													handler: function (grid, rowIndex, colIndex) {
														var rec = me.dataview.store.getAt(rowIndex);
														me._5/*setCodeMapping*/.call(me, rec, "set");
													}
												},
												{
													// icon: "./images/delete.png",
													iconCls: "icon-grid-delete",
													tooltip: "Remove CodeMapping",
													handler: function (grid, rowIndex, colIndex) {
														var rec = me.dataview.store.getAt(rowIndex);
														me._5/*setCodeMapping*/.call(me, rec, "remove");
													}
												}
											]
										},
										{
											xtype: "actioncolumn",
											width: 50,
											menuDisabled: true,
											items: [
												{
													// icon: './images/gears.gif',
													iconCls: "icon-toolbar-popt",
													hidden: itemtype != "SQLCube",
													tooltip: IRm$/*resources*/.r1('L_EDIT'),
													handler: function (grid, rowIndex, colIndex) {
														var grd = grid,
															store = grd.store,
															rec = store.getAt(rowIndex);
														if (itemtype == "SQLCube" && rec.get("type") == "Metric")
														{
															this._i2/*editColumnOption*/(rec);
														}
													},
													scope: this
												},
												{
													// icon: './images/gears.gif',
													iconCls: "icon-grid-config",
													tooltip: IRm$/*resources*/.r1('L_EDIT'),
													handler: function (grid, rowIndex, colIndex) {
														var grd = grid,
															store = grd.store,
															rec = store.getAt(rowIndex);
														var mp = IG$/*mainapp*/._I7d/*mainPanel*/;
														
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
										celldblclick: function(tobj, td, cellIndex, rec, tr, rowIndex, e, eOpts) {
											if (cellIndex == 5 && itemtype != "SQLCube" && rec.get("type") == "Metric")
											{
												e.stopPropagation();
												e.preventDefault();
												me._5/*setCodeMapping*/.call(me, rec, "set");
												
												return false;
											}
										},
										cellclick: function(tobj, td, cellIndex, rec, tr, rowIndex, e, eOpts) {
											if (cellIndex == 1 || cellIndex == 2)
											{
												var mp = IG$/*mainapp*/._I7d/*mainPanel*/;
												
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
						},
						{
							xtype: "gridpanel",
							region: "south",
							hidden: itemtype == "MDBCube" ? false : true,
							height: 250,
							title: IRm$/*resources*/.r1("L_JOIN"),
							name: "grd_join",
							store: {
								xtype: "store",
								fields: [
									"selected", "joinfrom", "jointo", "joincondition"
								]
							},
							tbar: [
								{
									iconCls: "icon-toolbar-add",
									tooltip: IRm$/*resources*/.r1("L_ADD_JOIN"),
									handler: function() {
										this._t$/*toolbarHandler*/("cmd_join_add"); 
									},
									scope: this
								},
								{
									iconCls: "icon-toolbar-remove",
									tooltip: IRm$/*resources*/.r1("L_DELETE_CHECKED"),
									handler: function() {
										this._t$/*toolbarHandler*/("cmd_join_delete"); 
									},
									scope: this
								}
							],
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
									text: "Join From",
									dataIndex: "joinfrom",
									flex: 2
								},
								{
									text: "Condition",
									dataIndex: "condition",
									flex: 2,
									hidden: true
								},
								{
									text: "Join To",
									dataIndex: "jointo",
									flex: 2
								}
							]
						}
					],
					region: "center",
					collapsible: false
				}
			]
		});
		
		IG$/*mainapp*/._IC5/*cubeeditor*/.superclass.initComponent.call(this);
	},
	
	listeners: {
		afterrender: function(ui) {
			var me = ui;
			me.dataview = me.down("[name=dataview]");
			me._m1/*getTransID*/();
		},
		deactivate: function(ui) {
			var me = ui;
			me.disposeContent(me);
		},
		scope: this
	},
	disposeContent: function(ui) {
	}
});

//mdb cube option dialog
IG$/*mainapp*/.MwPo/*mdb_cube_option*/ = $s.extend($s.window, {
	
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
		var me = this,
			mdbfiles = me.down("[name=mdbfiles]").getValue();
		
		var mval = {dbname: mdbfiles};
		
		this.callback && this.callback.execute(mval);
		
		this.close();
	},
	
	A_/*getNodeList*/: function() {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
				ack: "25",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, option: "mdbfiles"}, "uid;dbtype;option"),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "standard"})
			}, me, me.rs_A_/*getNodeList*/, null);
		req._l/*request*/();
	},
	
	rs_A_/*getNodeList*/: function(xdoc) {
		var mdbfiles = this.down("[name=mdbfiles]"),
			data = [],
			tnode, tnodes,
			i, dbname;
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg");
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tnodes.length; i++)
			{
				dbname = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name");
				data.push({name: dbname, value:dbname});
			}
		}
		mdbfiles.store.loadData(data);
	},
	
	B_/*getDatabaseList*/: function(nodename) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
				ack: "25",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, option: "mdbfiles", method: "gettable", dbname: nodename}, "uid;dbname;method;option"),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "standard"})
			}, me, me.rs_B_/*getDatabaseList*/, null);
		req._l/*request*/();
	},
	
	rs_B_/*getDatabaseList*/: function(xdoc) {
		var columnview = this.down("[name=columnview]"),
			data = [],
			tnode, tnodes,
			i, dbname;
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/tables");
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tnodes.length; i++)
			{
				dbname = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name");
				data.push({name: dbname, alias: dbname});
			}
		}
		columnview.store.loadData(data);
	},
	
	in$t: function() {
		var me = this;
		me.A_/*getNodeList*/();
	},
	
	km1/*uploadFile*/: function() {
		var me = this,
			mform = me.down("[name=mform]"),
			txtfilename = me.down("[name=txtfilename]");
		
		if (txtfilename.getValue())
		{
			mform.getForm().submit({
				url: ig$/*appoption*/.servlet,
				waitMsg: 'Uploading your data file',
				success: function(fp, o) {
					IG$/*mainapp*/._I54/*alertmsg*/('Success', 'Processed file on the server', null, me, 0, "success");
					var node = IG$/*mainapp*/._I18/*XGetNode*/(fp.errorReader.xmlData, "/smsg/result"),
						uid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "uid");
					
					me.A_/*getNodeList*/.call(me);
				}
			})
		}
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("L_MDB_OPTION");
		
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
							xtype: "form",
							name: "maform",
							
							items: [
			  					{
			  						xtype: "combobox",
			  						name: "mdbfiles",
			  						fieldLabel: IRm$/*resources*/.r1("L_MDB_DATAFILES"),
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
			  						},
			  						listeners: {
			  							change: function(tobj, nvalue, ovalue, opt) {
			  								me.B_/*getDatabaseList*/.call(me, nvalue);
			  							}
			  						}
			  					}
							]
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
								store: "array",
								buffered: true,
								pageSize: 50,
								purgePageCount: 0,
								model: "nosqldblistmodel",
								data: [],
								proxy: {
									type: "memory"
								}
							},
							split: false,
							scroll: "vertical",
							initialized: false,
							minHeight: 160,
							height: 160,
							flex: 1,
							
							autoScroll: true,
							plugins: [
								{
									ptype: "cellediting",
									clicksToEdit: false
								}
							],
							columns: [
								{
									xtype: "gridcolumn",
									text: IRm$/*resources*/.r1("L_TABLE_NAME"),
									dataIndex: "name",
									flex: 2
								},
								{
									xtype: "gridcolumn",
									text: IRm$/*resources*/.r1("L_ALIAS"),
									dataIndex: "alias",
									hidden: true,
									flex: 2,
									editor: {
										allowBlank: false
									}	
								}
							]
						},
						
						{
							xtype: "form",
							name: "mform",
							
							items: [
								{
									xtype: "fieldset",
									layout: "anchor",
									title: IRm$/*resources*/.r1("L_UPLOAD_MDB_FILE"),
									items: [
										{
										  	xtype: "fieldcontainer",
										  	fieldLabel: "MDB Upload",
										  	layout: "vbox",
										  	items: [
												{
													xtype: "fileuploadfield",
													name: "fileupload",
													buttonText: IRm$/*resources*/.r1("L_SELECT_FILE"),
													buttonConfig: {
							  							margin: "-10 2 0"
							  						},
													hideLabel: true,
													listeners: {
														change: function(tobj, value, eopt) {
															var fname = "",
																dval = "\\",
																txtfilename = me.down("[name=txtfilename]");
															if (value)
															{
																if (value.indexOf("/") > -1)
																{
																	dval = "/";
																}
																value = value.split(dval);
																if (value.length > 0)
																{
																	fname = value[value.length - 1];
																}
															}
															txtfilename.setValue(fname);
														}
													}
												},
												{
													xtype: "hiddenfield",
													name: "txtfilename"
												},
												{
													xtype: "hiddenfield",
													name: "targetfolder",
													value: "msaccess"
												},
												{
													xtype: "hiddenfield",
													name: "filenamemode",
													value: "original"
												}
										  	]
										},
										{
											xtype: "button",
											text: IRm$/*resources*/.r1("L_UPLOAD"),
											handler: function() {
												me.km1/*uploadFile*/.call(me);
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
					var me = this,
						mform = panel.down('[name=mform]');
						
					mform.getForm().errorReader = new IG$/*mainapp*/.m2ER();
					me.in$t();
				}
			}
		});
		
		IG$/*mainapp*/.MwPo/*mdb_cube_option*/.superclass.initComponent.apply(this, arguments);
	}
});



//Preprocessor description
IG$/*mainapp*/.MwPP/*preprocessor*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	
	"layout": "fit",
	
	closable: false,
	resizable:false,
	
	width: 360,
	autoHeight: true,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			syntax = me.down("[name=syntax]").getValue();
		
		var mval = syntax;
		
		this.callback && this.callback.execute(mval);
		
		this.close();
	},
	
	in$t: function() {
		var me = this,
			syntax = me.down("[name=syntax]");
			
		syntax.setValue(me.cube.sqlsyntax || "");
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("L_SQL_PRE_PROC");
		
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
			
			"layout": "fit",
			
			items: [
				{
					xtype: "panel",
					border: 0,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					border: 0,
					items: [
						{
							xtype: "form",
							name: "maform",
							layout: "fit",
							border: 0,
							items: [
			  					{
			  						xtype: "textarea",
			  						name: "syntax",
			  						height: 120,
			  						labelWidth: 40,
			  						fieldLabel: IRm$/*resources*/.r1("L_SYNTAX")
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
		
		IG$/*mainapp*/.MwPP/*preprocessor*/.superclass.initComponent.apply(this, arguments);
	}
});


IG$/*mainapp*/.DM2/*joinConfig*/ = $s.extend($s.window, {
	
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
	modelcontent: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			columnfrom = me.down("[name=columnfrom]").getValue(),
			tablefrom = me.down("[name=tablefrom]").getValue(),
			columnto = me.down("[name=columnto]").getValue(),
			tableto = me.down("[name=tableto]").getValue();
		
		if (!tablefrom || !tableto || !columnfrom || !columnto)
			return;
		
		var mval = {
			source: {
				name: columnfrom,
				tablename: tablefrom
			},
			target: {
				name: columnto,
				tablename: tableto
			}
		};
		
		me.callback && me.callback.execute(mval);
		
		me.close();
	},
	
	in$t: function() {
		var me = this,
			modelcontent = me.modelcontent,
			tablefrom = me.down("[name=tablefrom]"),
			tableto = me.down("[name=tableto]"),
			tables = [],
			name, tb;
		
		if (modelcontent)
		{
			for (name in modelcontent)
			{
				tb = modelcontent[name];
				tables.push(tb);
			}
			
			tablefrom.store.loadData(tables);
			tableto.store.loadData(tables);
		}
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("L_ADD_JOIN");
		
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
							xtype: "form",
							name: "mform",
							
							items: [
			  					{
			  						xtype: "combobox",
			  						name: "tablefrom",
			  						fieldLabel: IRm$/*resources*/.r1("L_FR_TABLE"),
			  						queryMode: 'local',
				  		  			displayField: 'name',
				  		  			valueField: 'name',
				  		  			editable: false,
				  		  			autoSelect: true,
				  		  			store: {
			  							xtype: "store",
			  							fields: [
			  								"name", "value"
			  							]
			  						},
			  						listeners: {
			  							change: function(tobj, nval, oval, opt) {
			  								var me = this,
			  									tbname = nval,
			  									columns = [],
			  									columnfrom = me.down("[name=columnfrom]");
			  								
			  								if (me.modelcontent && me.modelcontent[tbname])
			  								{
			  									columns = me.modelcontent[tbname].fields;
			  								}
			  								columnfrom.store.loadData(columns);
			  							},
			  							scope: this
			  						}
			  					},
			  					{
			  						xtype: "combobox",
			  						name: "columnfrom",
			  						fieldLabel: IRm$/*resources*/.r1("L_FR_COLUMN"),
			  						queryMode: 'local',
				  		  			displayField: 'name',
				  		  			valueField: 'name',
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
			  						xtype: "combobox",
			  						name: "tableto",
			  						fieldLabel: IRm$/*resources*/.r1("L_TO_TABLE"),
			  						queryMode: 'local',
				  		  			displayField: 'name',
				  		  			valueField: 'name',
				  		  			editable: false,
				  		  			autoSelect: true,
				  		  			store: {
			  							xtype: "store",
			  							fields: [
											"name", "value"
			  							]
			  						},
			  						listeners: {
			  							change: function(tobj, nval, oval, opt) {
			  								var me = this,
			  									tbname = nval,
			  									columns = [],
			  									columnto = me.down("[name=columnto]");
			  								
			  								if (me.modelcontent && me.modelcontent[tbname])
			  								{
			  									columns = me.modelcontent[tbname].fields;
			  								}
			  								columnto.store.loadData(columns);
			  							},
			  							scope: this
			  						}
			  					},
			  					{
			  						xtype: "combobox",
			  						name: "columnto",
			  						fieldLabel: IRm$/*resources*/.r1("L_TO_COLUMN"),
			  						queryMode: 'local',
				  		  			displayField: 'name',
				  		  			valueField: 'name',
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
			  						xtype: "combobox",
			  						name: "condition",
			  						fieldLabel: IRm$/*resources*/.r1("L_JOIN_COND"),
			  						queryMode: 'local',
				  		  			displayField: 'name',
				  		  			valueField: 'name',
				  		  			editable: false,
				  		  			autoSelect: true,
				  		  			hidden: true,
				  		  			store: {
			  							xtype: "store",
			  							fields: [
											"name", "value"
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
				},
				beforeclose: function() {
					var me = this,
						r = true;
			
					if (me.writable && me.uid)
					{
						var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
						lreq.init(panel, 
							{
								ack: "11",
								payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
								mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'lock', detail: "close"})
							}, panel, function(xdoc) {
								
							}, false);
							
						lreq._l/*request*/();
					}
					
					return r;
				}
			}
		});
		
		IG$/*mainapp*/.DM2/*joinConfig*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._$1c/*process_cube_build*/ = $s.extend($s.window, {
	modal: true,
	region:"center",
	
	"layout": "fit",
	
	closable: false,
	resizable:false,
	
	width: 360,
	autoHeight: true,
	
	callback: null,
	
	serverNode: null,
	modelcontent: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	in$t: function() {
		var me = this;
		setTimeout(function() {
			me.d1/*do_proc*/.call(me);
		}, 100);
	},
	
	d1/*do_proc*/: function() {
		var me = this,
			p_1 = me.p_1;
		
		me._cstep = 0;
		
		p_1.on("_bb_comp", function() {
			me._cstep++;
			
			if (me._cstep > 4)
			{
				me.close();
			}
			else
			{
				setTimeout(function() {
					p_1._d1/*do_step*/.call(p_1, me._cstep);
				}, 100);
			}
		});
		
		p_1._d1/*do_step*/.call(p_1, me._cstep);
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("L_B_CUBE");
		
		$s.apply(this, {
			"layout": "fit",
			items: [
				{
					xtype: "panel",
					bodyPadding: 10,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					border: 0,
					items: [
						{
							xtype: "displayfield",
							name: "l_step_1",
							value: IRm$/*resources*/.r1("L_BB_STEP_1")
						},
						{
							xtype: "displayfield",
							name: "l_step_2",
							value: IRm$/*resources*/.r1("L_BB_STEP_2")
						},
						{
							xtype: "displayfield",
							name: "l_step_3",
							value: IRm$/*resources*/.r1("L_BB_STEP_3")
						}
					]
				}
			],
			
			listeners: {
				afterrender: function(ui) {
					var me = this;
					me.in$t();
				}
			}
		});
		
		IG$/*mainapp*/._$1c/*process_cube_build*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Idc/*ExcelFileUploader*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	
	"layout": 'fit',
	
	closable: false,
	resizable:false,
	
	ufiles: null,
	
	width: 360,
	autoHeight: true,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	datalabel: "",
	uploadmode: false,
	deletemode: false,
	
	sKK1/*processUploadedFile*/: function(uid) {
		var panel = this,
			fieldvalue = this.down("[name=fieldvalue]"),
			uploadmode = this.down("[name=uploadmode]"),
			delimiter = this.down("[name=delimiter]"),
			deletemode = this.down("[name=deletemode]"),
			targetsheet = this.down("[name=targetsheet]"),
			file_encoding = this.down("[name=file_encoding]");
		
		panel.datalabel = fieldvalue.getValue();
		panel.uploadmode = uploadmode.getValue();
		panel.deletemode = deletemode.getValue();
		panel.delimiter = delimiter.getValue();
		panel.targetsheet = targetsheet.getValue();
		panel.file_encoding = file_encoding.getValue();
		panel.fileuid = uid;
		
		if (fieldvalue.getValue() == "" && panel.uploadmode == false)
		{
			IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("L_MSG_TABNAME"), panel);
			return;
		}
		
		this.callback && this.callback.execute(panel);
		
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var mform = this.down('[name=mform]'),
			orig_filename = this.down("[name=orig_filename]"),
			photo = this.down("[name=photo]"),
			file_encoding = this.down("[name=file_encoding]");

		if (mform.getForm().isValid()) {
			var f = mform.getForm();
			// $(f).attr("accept-charset", "UTF-8");
			document.charset = "UTF-8";
			var fname = photo.getRawValue();
			if (fname.indexOf("\\") > -1)
			{
				fname = fname.substring(fname.lastIndexOf("\\")+1);
			}
			
			orig_filename.setValue(fname);
			
			mform.submit({
				url: ig$/*appoption*/.servlet,
				waitMsg: 'Uploading your data file',
				success: function(fp, o) {
					var node = IG$/*mainapp*/._I18/*XGetNode*/(fp.errorReader.xmlData, "/smsg/result");
					var uid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "uid");
					
					mform.customowner.sKK1/*processUploadedFile*/.call(mform.customowner, uid);
				}
			})
		}
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1('T_DATA_UPLOAD');
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			"layout": 'fit',
			
			items: [
			    {
			    	xtype: "form",
			    	name: 'mform',
			    	customowner: this,
					layout: "anchor",
			    	items: [
			    		{
	    					xtype: "hiddenfield",
	    					name: "_mts_",
	    					value: IG$/*mainapp*/._g$a/*global_mts*/
			    		},
			    	    {
							xtype: "textfield",
							name: "orig_filename",
							hidden: true,
							fieldLabel: "Original name"
						},
			    		{
	  	                	xtype: 'fileuploadfield',
	  	    	            name: 'photo',
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
	  	                	xtype: "textfield",
	  	                	name: "fieldvalue",
	  	                	fieldLabel: "Field Value",
	  	                	// labelWidth: 100,
	  	                	allowBlank: false
	  	                },
	  	                {
	  	                	xtype: "combobox",
	  	                	name: "file_encoding",
	  	                	hidden: window.ig$/*appoption*/.file_encoding && window.ig$/*appoption*/.file_encoding.length > 0 ? false : true,
			    			fieldLabel: "Encoding",
			    			editable: false,
			    			queryMode: "local",
			    			labelField: "name",
			    			valueField: "value",
			    			displayField: "name",
			    			store: {
			    				xtype: "store",
			    				fields: [
			    					"name", "value"
			    				],
			    				data: window.ig$/*appoption*/.file_encoding || []
			    			},
			    			listeners: {
			    				afterrender: function(ui) {
			    					if (window.ig$/*appoption*/.file_encoding && window.ig$/*appoption*/.file_encoding.length > 0)
			    					{
			    						ui.select(window.ig$/*appoption*/.file_encoding[0].value);
			    					}
			    				}
			    			}
	  	                },
	  	                {
	  	                	xtype: "fieldset",
	  	                	title: "Replace Data Options",
	  	                	hidden: (this.ufiles && this.ufiles.length > 0 ? false : true),
	  	                	layout: "anchor",
	  	                	defaults: {
	  	                		anchor: "100%"
	  	                	},
	  	                	items: [
	  	                		{
			  	                	xtype: "checkbox",
			  	                	name: "uploadmode",
			  	                	hidden: (this.ufiles && this.ufiles.length > 0 ? false : true),
			  	                	hideLabel: true,
			  	                	boxLabel: IRm$/*resources*/.r1("L_FILE_APPEND"),
			  	                	listeners: {
			  	                		change: function(field, newvalue, oldvalue, eOpts) {
			  	                			var p = this,
			  	                				ctrl = field,
			  	                				deletectrl = this.down("[name=deletemode]"),
			  	                				targetsheet = this.down("[name=targetsheet]"),
			  	                				fieldvalue = this.down("[name=fieldvalue]"),
			  	                				checked = ctrl.getValue();
			  	                			
			  	                			fieldvalue.allowBlank = checked;
			  	                			targetsheet.setVisible(checked);
			  	                			deletectrl.setVisible(checked);
			  	                		},
			  	                		scope: this
			  	                	}
			  	                },
			  	                {
			  	                	xtype: "combobox",
			  	                	fieldLabel: "Data File",
					    	    	name: "targetsheet",
					    	    	queryMode: "local",
					    	    	hidden: true,
			            	    	autoSelect: true,
			            	    	autoScroll: true,
			            	    	editable: false,
			            	    	labelField: "name",
			            	    	displayField: "name",
			            	    	valueField: "uid",
			            	    	store: {
			            	    		fields: [
			            	    			"name", "uid", "type", "nodepath"
			            	    		],
			            	    		data: this.ufiles
			            	    	}
			  	                },
			  	                {
			  	                	xtype: "checkbox",
			  	                	name: "deletemode",
			  	                	hidden: true,
			  	                	fieldLabel: " ",
			  	                	hideLabel: true,
			  	                	boxLabel: IRm$/*resources*/.r1("L_FILE_DELETE")
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
					var delimiter = this.down("[name=delimiter]"),
						targetsheet = this.down("[name=targetsheet]"),
						ufiles = this.ufiles,
						i, selindex = 0;
					delimiter.setValue(",");
					
					if (ufiles && ufiles.length > 0)
					{
						for (i=0; i < ufiles.length; i++)
						{
							if (ufiles[i].selected == true)
							{
								selindex = i;
								break;
							}
						}
						
						targetsheet.setValue(ufiles[selindex].uid);
					}
					
					var mform = panel.down('[name=mform]');
					mform.getForm().errorReader = new IG$/*mainapp*/.m2ER();
					mform.customowner = panel;
				}
			}
		});
		
		IG$/*mainapp*/._Idc/*ExcelFileUploader*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Ic3/*groupmeasure*/ = $s.extend($s.window, {
	
	modal: true,
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 300,
	autoHeight: true,
	
	itemtype: null,
	parentuid: null,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	$f3/*processMakeMetaItem*/: function() {
		var me = this,
			fitemname = this.down("[name=fitemname]"),
			fdesc = this.down("[name=fdesc]");
			
		if (me.callback)
		{
			me.callback.execute({name: fitemname.getValue(), desc: fitemname.getValue()});
		}
		
		this.close();
	},
	
	
	listeners: {
		show: function(ui) {
			this.down("[name=fitemname]").focus();
		}
	},
	
	initComponent : function() {
		var me = this;
		me.title = IRm$/*resources*/.r1('L_GROUP_MEASURE');
		me.items = [
			{
				xtype: "panel",
				layout: "anchor",
				bodyStyle: 'padding:10px',
				defaults: {
		        	anchor: '100%'
		        },
		        items: [
			        {
			            fieldLabel: IRm$/*resources*/.r1('L_ITEMNAME'),
			            xtype: "textfield",
			            labelWidth: 80,
			            name: 'fitemname',
			            value: '',
			            allowBlank: false,
			            blankText: 'Item name is required!',
			            enableKeyEvents: true,
			            listeners: {
			        		'keyup': function(item, e) {
			        			if (e.keyCode == 13)
			        			{
			        				this.$f3/*processMakeMetaItem*/.call(this);
			        			}
			        		},
			        		scope: this
			        	}
			        },
			        {
			        	fieldLabel: IRm$/*resources*/.r1('L_DESCRIPTION'),
			        	xtype: 'textarea',
			        	labelWidth: 80,
			        	border: false,
			        	height: 50,
			        	name: 'fdesc',
			        	value: ''
			        }
			    ]
			}
		]
		
		me.buttons = [
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
		];
		IG$/*mainapp*/._Ic3/*groupmeasure*/.superclass.initComponent.apply(this, arguments);
	}
});

/* 
 * exceldataviewer.js 
 * 
 */
 
IG$/*mainapp*/._Ie9/*excelPreview*/ = $s.extend($s.window, {
	title: "Uploaded Data Content",
	modal: true,
	region:'center',
	
	"layout": 'fit',
	
	closable: false,
	resizable:false,
	
	width: 500,
	height: 400,
	uid: null,
	
	callback: null,
	
	limit: 100,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	reqDataContent: function(uid, page) {
    	var panel = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	req.init(panel, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({start: page, limit: this.limit}, "start;limit")
	        }, panel, panel.rs_reqDataContent, null);
		req._l/*request*/();
    },
    
    rs_reqDataContent: function(xdoc) {
    	var panel = this,
    		cols = [],
    		dataview = this.down("[name=dataview]"),
    		storecolumn,
    		tb_rowcount = this.down("[name=tb_rowcount]"),
    		tb_rows = this.down("[name=tb_rows]");
    	
    	var mresult = new IG$/*mainapp*/._IF1/*clSheetResult*/(xdoc),
			i, j, header, columns=[], column, panel=this, row, cvdata=[], isnumeric,
			setuid,
			rowcount = mresult.rows,
			startrow = mresult.srow,
			data = [], dp = [], fields = [];
			
		panel.mresult = mresult;
    	
    	if (rowcount > panel.limit)
    	{
    		tb_rows.setVisible(true);
    		
    		for (i=0; i < Math.ceil(rowcount / panel.limit); i++)
    		{
    			dp.push({label: "" + (i+1), index: i});
    		}
    		
    		if (dp.length != tb_rows.store.data.length)
    		{
	    		tb_rows.store.loadData(dp);
	    		tb_rows.setValue(0);
	    	}
    	}
    	else
    	{
    		tb_rows.setVisible(false);
    	}
    	tb_rowcount.setText("Total Rows: " + Number(rowcount).format("0,000") + " (Display: " + Number(mresult.data.length).format("0,000") + ")");
    	
    	for (i=0; i < mresult.header.length; i++)
    	{
    		fields.push("c" + i);
    		
    		cols.push({
		    	xtype: "gridcolumn",
		    	flex: 1,
		    	minWidth: 50,
		    	text: mresult.header[i].name,
		    	dataIndex: "c" + i
		    });
    	}
			
		if (mresult.data.length > 0)
		{
			for (i=0; i < mresult.data.length; i++)
			{
				row = {};
				for (j=0; j < mresult.cols; j++)
				{
					row["c" + j] = mresult.data[i][j].text;
				}
				data.push(row);
			}
		}
		
		storecolumn = {
			fields: fields
		};
			
		dataview.reconfigure(storecolumn, cols);
		storecolumn.loadData(data);
		
		panel.setLoading(false);
    },
    
    cp/*changeDataPage*/: function(index) {
    	var panel = this;
    	
    	panel.setLoading(true);
    	panel.reqDataContent(panel.uid, index * panel.limit);
    },
	
	initComponent : function() {
    	var me = this;
		
		$s.apply(this, {
			defaults:{bodyStyle: "padding: 0px;"},
			
			items: [
			    {
			    	xtype: "gridpanel",
			    	name: "dataview",
			    	columnLines: true,
			    	store: {
		    			type: "array",
						fields: [],
						data: []
					},
					"layout": "fit",
					autoScroll: true,
					
			        columns: [],
			        viewConfig: {
						stripeRows: false
						// trackOver: false
					}
			    }
			],
			
			tbar: [
			    {
			    	name: "tb_rowcount",
			    	xtype: "tbtext",
			    	text: "Reading data..."
			    },
			    {
			    	xtype: "combobox",
			    	name: "tb_rows",
			    	hidden: true,
			    	fieldLabel: "Go to",
			    	labelWidth: 50,
			    	
			    	queryMode: "local",
        	    	autoSelect: true,
        	    	autoScroll: true,
        	    	editable: false,
        	    	labelField: "label",
        	    	displayField: "label",
        	    	valueField: "index",
        	    	store: {
        	    		fields: [
        	    		    "label", "index"
        	    		]
        	    	},
        	    	listeners: {
        	    		change: function(field, newValue, oldValue, eOpts) {
        	    			var p = field.getValue();
        	    			if (me._pg != p)
        	    			{
        	    				me._pg = p;
        	    				me.cp/*changeDataPage*/.call(me, p);
        	    			}
        	    			// this.l1a/*setFieldValue*/(this.link[p]);
        	    		},
        	    		scope: this
        	    	}
			    }
			],
			
			buttons:[{
				text: IRm$/*resources*/.r1('B_CLOSE'),
				handler: function() {
					this.close();
				},
				scope: this
			}],
			
			listeners: {
				afterrender: function(ui) {
					if (this.uid)
					{
						var p = this;
						
						p.setLoading(true);
						
						setTimeout(function() {
							p._pg = 0;
							p.setLoading(true);
							p.reqDataContent.call(p, p.uid, 0);
						}, 80);
					}
				}
			}
		});
		
		IG$/*mainapp*/._Ie9/*excelPreview*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Ie3/*excelLoaderOption*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	
	"layout": 'fit',
	
	closable: false,
	resizable:false,
	
	width: 360,
	autoHeight: true,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var mform = this.down('[name=mform]');

		if (mform.getForm().isValid()) {
			mform.getForm().submit({
				url: ig$/*appoption*/.servlet,
				waitMsg: 'Uploading your data file',
				success: function(fp, o) {
					var node = IG$/*mainapp*/._I18/*XGetNode*/(fp.errorReader.xmlData, "/smsg/result");
					var uid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "uid");
					
					fp.customowner.sKK1/*processUploadedFile*/.call(fp.customowner, uid);
				}
			})
		}
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1('T_LDATA_TITLE');
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			"layout": 'fit',
			
			items: [
			    {
			    	xtype: 'form',
			    	name: 'mform',
			    	
			    	items: [
	  	                {
	  	                	xtype: "checkbox",
	  	                	name: "cbtabdim",
	  	                	fieldLabel: "Tab dimension",
	  	                	boxLabel: "Enable",
	  	                	labelWidth: 100,
	  	                	listeners: {
	  	                		change: function(ctrl) {
	  	                			var selected = ctrl.getValue(),
	  	                				txttabdim = this.down("[name=txttabdim]");
	  	                			txttabdim.setVisible(selected);
	  	                		},
	  	                		scope: this
	  	                	}
	  	                },
	  	                {
	  	                	xtype: "textfield",
	  	                	name: "txttabdim",
	  	                	hidden: true,
	  	                	fieldLabel: "Name"
	  	                },
	  	                {
	  	                	xtype: "displayfield",
	  	                	fieldLabel: "Options"
	  	                },
	  	                {
	  	                	xtype: "checkbox",
	  	                	name: "cbloadlastonly",
	  	                	hideLabel: true,
	  	                	boxLabel: "Load last tab only"
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
			]
		});
		
		IG$/*mainapp*/._Ie3/*excelLoaderOption*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._Ie6/*excelLoader*/ = $s.extend($s.window, {
	layout: "fit",
	modal: true,
	region:'center',
	
	"layout": 'fit',
	title: "Config Uploads",
	
	closable: false,
	resizable:false,
	
	width: 400,
	autoHeight: true,
	
	in$t: function() {
		var me = this,
			opn = me.opn,
			datainfo = this.down("[name=datainfo]");
			
		if (opn.tabdimension && opn.tabdimension.uid && opn.tabdimension.name)
		{
			me.down("[name=cbtabdim]").setValue(true);
			me.down("[name=txttabdim]").setValue(opn.tabdimension.name);
		}
		
		datainfo.store.loadData(opn.dataset);
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
	
	cxc/*loadDataSet*/: function(rowIndex) {
    	var panel = this,
			storecolumn = this.down("[name=datainfo]").store, 
			rec = storecolumn.data.items[rowIndex];
    	
    	var dlg = new IG$/*mainapp*/._Ie9/*excelPreview*/({
    		uid: rec.get("uid")
    	});
    	
    	dlg.show(panel);
    },
	
	c1/*confirmDialog*/: function() {
		var me = this,
			opn = me.opn;
			
		if (me.down("[name=cbtabdim]").getValue() == false)
		{
			opn.tabdimension = null;
		}
	},
	
	rxc/*removeDataSet*/: function(rowIndex) {
		var panel = this,
			opn = this.opn,
			storecolumn = this.down("[name=datainfo]").store, 
			rec = storecolumn.data.items[rowIndex],
			i,
			bs = false;
		
		for (i=0; i < opn.dataset.length; i++)
		{
			if (opn.dataset.uid == rec.get("uid"))
			{
				opn.dataset.splice(i, 1);
				bs = true;
				break;
			}
		}
		
		if (bs == true)
		{
			storecolumn.remove(rec);
		}
		else
		{
			IG$/*mainapp*/._I54/*alertmsg*/("Selection Error", "Can't find object in original documents", null, panel, 1, "error");
		}
	},
	
	initComponent : function() {
    	var me = this;
		
		$s.apply(this, {
			defaults:{bodyStyle: "padding: 0px;"},
			
			items: [
			    {
			    	xtype: "form",
			    	layout: "anchor",
			    	defaults: {
			    		anchor: "100%"
			    	},
			    	items: [
			    		{
                        	xtype: "panel",
                        	border: 0,
                        	"layout": {
                        		type: "vbox",
                        		align: "stretch",
                        		padding: 5
                        	},
                        	items: [
                    	        {
                    	        	xtype: "fieldset",
                    	        	title: "Use file list as metric",
                    	        	layout: "anchor",
                    	        	defaults: {
                    	        		anchor: "100%"
                    	        	},
                    	        	bodyPadding: 2,
                    	        	items: [
                    	        	    {
					  	                	xtype: "checkbox",
					  	                	name: "cbtabdim",
					  	                	fieldLabel: "Tab dimension",
					  	                	boxLabel: "Enable",
					  	                	labelWidth: 100,
					  	                	listeners: {
					  	                		change: function(ctrl) {
					  	                			var selected = ctrl.getValue(),
					  	                				fdtabdim = this.down("[name=fdtabdim]");
					  	                			fdtabdim.setDisabled(!selected);
					  	                		},
					  	                		scope: this
					  	                	}
					  	                },
					  	                {
					  	                	xtype: "fieldcontainer",
					  	                	fieldLabel: "Name",
					  	                	name: "fdtabdim",
					  	                	disabled: true,
					  	                	"layout": "hbox",
					  	                	items: [
												{
												  	xtype: "textfield",
												  	name: "txttabdim",
												  	flex: 1
												},
												{
													xtype: "button",
													width: 80,
													text: "Make Item",
													tooltip: "Create",
													handler: function() {
														this.sk4/*createTabDimension*/();
													},
													scope: this
												},
												{
													xtype: "button",
													text: "..",
													tooltip: "Select",
													handler: function() {
													},
													scope: this
												}
					  	                	]
					  	                }
                    	        	]
                    	        },
								{
									xtype: "gridpanel",
									plain: true,
									name: "datainfo",
									height: 200,
									resizable: false,
									"layout": "fit",
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
											clicksToEdit: 1
										}
									],
									fbar: [
										{
					  	                	xtype: "checkbox",
					  	                	name: "cbloadlastonly",
					  	                	fieldLabel: "",
					  	                	hideLabel: false,
					  	                	boxLabel: "Load last tab only"
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
														me.cxc/*loadDataSet*/(rowIndex);
													},
													scope: me
												},
												{
													// icon: "./images/delete.png",
													iconCls: "icon-grid-delete",
													tooltip: IRm$/*resources*/.r1("B_DELETE_ITEM"),
													handler: function (grid, rowIndex, colIndex) {
														me.rxc/*removeDataSet*/(rowIndex);
													},
													scope: me
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
						this.close();
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
					this.in$t();
				}
			}
		});
		
		IG$/*mainapp*/._Ie6/*excelLoader*/.superclass.initComponent.apply(this, arguments);
	}
});


