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
if (window.Ext)
{
	IG$/*mainapp*/._IA0/*dashboardFilter*/ = $s.extend($s.window, {
		title: IRm$/*resources*/.r1('T_FILTER'),
	
		modal: true,
	
		"layout": {
			type: 'fit',
			align: 'stretch'
		},
		
		closable: false,
		resizable:false,
		width: 400,
		height: 420,
		
		fitem: null,
		_9/*framecontent*/: null,
		
		callback: null,
		
		_IFe/*initF*/: function() {
			var panel = this,
				key,
				operatordp = [], op, opctrl = this.down("[name=operator]"),
				filterdim = this.down("[name=filterdim]"),
				
				ctrlvalue = this.down("[name=ctrlvalue]"),
				ctrldp = [],
				
				valuetype = this.down("[name=valuetype]"),
				valuedp,
				
				valuetext = this.down("[name=valuetext]");
				
			for (key in IG$/*mainapp*/._IE1/*filteropcodes*/) {
				op = IG$/*mainapp*/._IE1/*filteropcodes*/[key];
				operatordp.push({value: op[3], label: op[1]});
			}
			
			opctrl.store.loadData(operatordp);
			
			for (key in this._9/*framecontent*/.controls)
			{
				ctrldp.push({name: key, type: this._9/*framecontent*/.controls[key].type});
			}
			
			ctrlvalue.store.loadData(ctrldp);
			
			valuedp = [
				{name: "control", value: "control"},
				{name: "value", value: "value"}
			];
			valuetype.store.loadData(valuedp);
				
			if (this.fitem)
			{
				filterdim.setValue(this.fitem.itemname || "");
				ctrlvalue.setValue(this.fitem.valuefield || "");
				valuetype.setValue(this.fitem.valuemode || "control");
				opctrl.setValue(this.fitem.operator || "IN");
				valuetext.setValue(this.fitem.valuetext || "");
			}
			
			this.sK3/*validateLayout*/();
		},
		
		P2C/*itemSelectedHandler*/: function(item) {
			var filterdim = this.down("[name=filterdim]");
			
			this.fitem.nodepath = item.nodepath;
			this.fitem.itemuid = item.uid;
			this.fitem.itemtype = item.type;
			this.fitem.itemname = item.name;
			
			filterdim.setValue(this.fitem.itemname);
		},
		
		_IG0/*closeDlgProc*/: function() {
			this.close();
		},
		
		_IFf/*confirmDialog*/: function() {
			if (this.updateDashboardFilter() == true)
			{
				this.callback && this.callback.execute(this.fitem);
				this._IG0/*closeDlgProc*/();
			}
		},
		
		updateDashboardFilter: function() {
			var me = this,
				r = true;
				opctrl = me.down("[name=operator]"),
				filterdim = me.down("[name=filterdim]"),
				ctrlvalue = me.down("[name=ctrlvalue]"),
				valuetype = me.down("[name=valuetype]"),
				valuetext = me.down("[name=valuetext]"),
				fitem = me.fitem;
			
			if (fitem)
			{
				fitem.operator = opctrl.getValue();
				fitem.valuefield = ctrlvalue.getValue() || "";
				fitem.valuemode = valuetype.getValue() || "";
				fitem.valuetext = valuetext.getValue() || "";
			}
			
			return r;
		},
		
		sK3/*validateLayout*/: function() {
			var me = this,
				opctrl = me.down("[name=operator]"),
				filterdim = me.down("[name=filterdim]"),
				filterdimpanel = me.down("[name=filterdimpanel]"),
				filtertype = me.down("[name=filtertype]"),
				rbfiltertype = me.down("[name=rbfiltertype]").getGroupValue(),
				filterdim = me.down("[name=filterdim]"),
				ctrlvalue = me.down("[name=ctrlvalue]"),
				valuetype = me.down("[name=valuetype]"),
				valuetext = me.down("[name=valuetext]"),
				operator = me.down("[name=operator]");
				
			switch (rbfiltertype)
			{
			case "metric":
				operator.show();
				filterdimpanel.show();
				valuetype.show();
				
				switch (valuetype.getValue())
				{
				case "control":
					valuetext.hide();
					ctrlvalue.show();
					break;
				case "value":
					valuetext.show();
					ctrlvalue.hide();
					break;
				}
				break;
			case "control":
				filterdimpanel.hide();
				operator.hide();
				valuetype.hide();
				ctrlvalue.show();
				break;
			}
			
		},
		
		initComponent : function() {
			var operatordp = [],
				me = this,
				key,
				op,
				_vtstore,
				_opstore;
				
			_vtstore = {
				fields: [
					{name: 'name'},
					{name: 'value'}
				]
			};
			
			_opstore = {
				fields: [
					{name: 'name'},
					{name: 'label'},
					{name: 'value'}
				]
			};
			
			_ctstore = {
				fields: [
					{name: 'name'},
					{name: 'type'}
				]
			};
			
			var _IH1/*mainpanel*/ = new $s.formpanel({
				xtype: "form",
				
				plain: true,
				border: 0,
				bodyPadding: 5,
				
				fieldDefaults: {
		            labelWidth: 100,
		            anchor: '100%'
		        },
		        
		        "layout": {
		            type: 'vbox',
		            align: 'stretch'  // Child items are stretched to full width
		        },
		        
		        items: [
		        	{
		        		xtype: "radiogroup",
		        		vertical: false,
						fieldLabel: "Filter Type",
						name: "filtertype",
						plain: true,
						items: [
							{
								boxLabel: 'Select item', 
								name: 'rbfiltertype', 
								inputValue: "metric", 
								checked: true
							},
							{
								boxLabel: 'Control', 
								name: 'rbfiltertype', 
								inputValue: "control"
							}
						],
						listeners: {
							change: function(field, newvalue, oldvalue, eOpts) {
								this.sK3/*validateLayout*/();
							},
							scope: this
						}
		        	},
		        	{
		        		xtype: 'fieldcontainer',
		        		name: "filterdimpanel",
						fieldLabel: IRm$/*resources*/.r1('L_ITEM'),
						combineErrors: false,
						"layout": 'hbox',
						defaults: {
							hideLabel: true
						},
						items: [
				        	{
				        		xtype: "textfield",
				        		name: "filterdim",
				        		readOnly: true
				        	},
				        	{
								xtype: 'button',
								text: '..',
								width: 20,
								handler: function() {
									var me = this,
										cubeuid = me.fitem.cubeuid;
									
									if (!cubeuid)
										return;
										
									var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
										visibleItems: 'workspace;folder;metric;measure',
										u5x/*treeOptions*/: {
											cubebrowse: true,
											rootuid: cubeuid
										}
									});
									dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.P2C/*itemSelectedHandler*/);
									IG$/*mainapp*/._I_5/*checkLogin*/(me, dlgitemsel);
								},
								scope: this
							}
						]
					},
		        	{
		        		xtype: "combo",
		        		
		        		fieldLabel: "Operator",
		        		name: "operator",
		        		
						store: _opstore,
			            displayField: "label",
			            valueField: "value",
			            
			            editable: false,
			            queryMode: "local",
			            selectOnTab: false
		        	},
		        	{
		        		xtype: "combo",
		        		
		        		fieldLabel: "Value type",
		        		name: "valuetype",
		        		
						store: _vtstore,
						
			            displayField: "name",
			            valueField: "value",
			            
			            editable: false,
			            queryMode: "local",
			            selectOnTab: false,
			            
			            listeners: {
			            	select: function() {
								this.sK3/*validateLayout*/();
							},
							scope: this
			            }
		        	},
		        	{
		        		xtype: "textfield",
		        		fieldLabel: "Value text",
		        		name: "valuetext"
		        	},
		        	{
		        		xtype: "combo",
		        		fieldLabel: "Control value",
		        		name: "ctrlvalue",
		        		
						store: _ctstore,
						
			            displayField: "name",
			            valueField: "name",
			            
			            editable: false,
			            queryMode: "local",
			            selectOnTab: false
		        	}
		        ],
		        listeners: {
		        	afterrender: function(ui) {
		        		var panel = this;
						panel._IFe/*initF*/();
		        	},
		        	scope: this
		        }
			});
					 
			$s.apply(this, {
				
				defaults:{bodyStyle:'padding:10px'},
				
				items: [
					_IH1/*mainpanel*/
				],
				
				buttons:[
//					{
//						text: IRm$/*resources*/.r1('B_HELP'),
//						handler: function() {
//							IG$/*mainapp*/._I63/*showHelp*/('P0007');
//						},
//						scope: this
//					}, 
					'->',
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
			
			IG$/*mainapp*/._IA0/*dashboardFilter*/.superclass.initComponent.apply(this, arguments);
		}
	});
}
if (window.Ext)
{
	IG$/*mainapp*/._IAe/*scriptWizard*/ = $s.extend($s.panel, {
	
		modal: true,
	
		"layout": {
			type: "fit",
			align: "stretch"
		},
		
		
		_9/*framecontent*/: null,
		
		callback: null,
		
		_IG0/*closeDlgProc*/: function() {
			this.close();
		},
		
		m1$9/*confirmSetting*/: function() {
			if (this.m1$12/*updateSetting*/() == true)
			{
				this.callback && this.callback.execute();
				
				this._IG0/*closeDlgProc*/();
			}
		},
		
		_IFe1/*initF*/: function() {
			var me = this,
				scriptctrl = me.down("[name=script]"),
				scriptdoc = $(".idv-jcl-edtr", scriptctrl.el.dom),
				editor;
				
			scriptdoc.empty();
			
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(scriptdoc);
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(scriptdoc);
			
			jview = $("<div class='idv-jcl-view'></div>").appendTo(scriptdoc);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jview, w);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jview, h);
			
			if (!window.ace)
			{
				IG$/*mainapp*/.x03/*getScriptCache*/(ig$/*appoption*/.scmap.igcg, new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
					var me = this,
						editor;
					
					editor = ace.edit(jview[0]);
				    editor.getSession().setMode("ace/mode/java");
				    
				    me.scripteditor = editor;
				    me.scriptview = jview;
				}));
			}
			else
			{
				editor = ace.edit(jview[0]);
			    editor.getSession().setMode("ace/mode/java");
			    
			    me.scripteditor = editor;
			    me.scriptview = jview;
			}
		},
		
		commitCode: function() {
			var me = this,
				r;
			
			r = me.m1$12/*updateSetting*/();
			
			return r;
		},
		
		refreshCode: function() {
			var me = this,
				scripteditor = me.scripteditor,
				script;
				
			script = Base64.decode(this._9/*framecontent*/._l22/*activescript*/);
			scripteditor.setValue(script);
		},
		
		_IFe/*initF*/: function() {
			var me = this,
				// controls = this._9/*framecontent*/.controls,
				// ctrllist = this.down("[name=ctrllist]"),
				editor = me.scripteditor;
				// dp = [], w, h, jview;
			
	//		$.each(controls, function(index, key) {
	//			var ctrl = controls[index];
	//			
	//			dp.push({name: ctrl.name, type: ctrl.type});
	//		});
			
			var script = Base64.decode(this._9/*framecontent*/._l22/*activescript*/);
			editor.setValue(script);
			// ctrllist.store.loadData(dp);
		},
		
		m1$12/*updateSetting*/: function() {
			var me = this,
				scriptdoc = me.scripteditor,
				script = Base64.encode(scriptdoc.getValue()),
				_9/*framecontent*/ = me._9/*framecontent*/;
			
			_9/*framecontent*/._l22/*activescript*/ = script;
			_9/*framecontent*/._l24/*parseScriptFunction*/.call(_9/*framecontent*/);
			
			return true;
		},
		
		initComponent : function() {
			var me = this;
			
			$s.apply(this, {
				// title: IRm$/*resources*/.r1('L_SCRIPT_WIZARD'),
				
				items: [
					{
						xtype: "panel",
						"layout": "border",
					
						items: [
							{
								xtype: "panel",
								region: "center",
								"layout": "fit",
								title: "Script content",
								border: 0,
								items: [
									{
										name: "script",
										html: "<div class='idv-jcl-edtr'></div>",
										listeners: {
											afterrender: function(tobj) {
												me._IFe1/*initF*/.call(me);
											},
											resize: function(tobj, w, h, ow, oh, opts) {
												if (me.scriptview && me.scripteditor)
												{
													IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.scriptview, w);
													IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.scriptview, h);
													me.scripteditor.resize(true);
												}
											}
										}
									}
								]
							}
						]
					}
				]
			});
			
			IG$/*mainapp*/._IAe/*scriptWizard*/.superclass.initComponent.apply(this, arguments);
		}
	});
}


if (window.Ext)
{
	IG$/*mainapp*/.cm1/*view_source*/ = $s.extend($s.panel, {
	
		modal: true,
	
		"layout": {
			type: "fit",
			align: "stretch"
		},
		
		
		_9/*framecontent*/: null,
		
		callback: null,
		
		_IG0/*closeDlgProc*/: function() {
			this.close();
		},
		
		m1$9/*confirmSetting*/: function() {
			if (this.m1$12/*updateSetting*/() == true)
			{
				this.callback && this.callback.execute();
				
				this._IG0/*closeDlgProc*/();
			}
		},
		
		commitCode: function() {
			var r = this.m1$12/*updateSetting*/();
			
			return r;
		},
		
		refreshCode: function() {
			var me = this,
				layout,
				editor = me.scripteditor;
			
			layout = me._9/*framecontent*/.getLayout();
			layout = me.formatXml(layout);
			editor.setValue(layout);
		},
		
		formatXml: function (xml) {
	        var reg = /(>)(<)(\/*)/g,
	        	wsexp = / *(.*) +\n/g,
	        	contexp = /(<.+>)(.+\n)/g,
	        	pad = 0,
	        	formatted = "",
	        	lines,
	        	indent = 0,
	        	lastType = "other",
	        	transitions = {
		            'single->single': 0,
		            'single->closing': -1,
		            'single->opening': 0,
		            'single->other': 0,
		            'closing->single': 0,
		            'closing->closing': -1,
		            'closing->opening': 0,
		            'closing->other': 0,
		            'opening->single': 1,
		            'opening->closing': 0,
		            'opening->opening': 1,
		            'opening->other': 1,
		            'other->single': 0,
		            'other->closing': -1,
		            'other->opening': 0,
		            'other->other': 0
		        },
		        i, j,
		        ln,
		        single,
		        closing,
		        opening,
		        type,
		        fromTo,
		        padding;
	        	
	        xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
			lines = xml.split('\n');
	        
	        // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions 
	
	        for (var i = 0; i < lines.length; i++) 
	        {
	            ln = lines[i];
	            single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
	            closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
	            opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
	            type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
	            fromTo = lastType + '->' + type;
	            lastType = type;
	            padding = '';
	
	            indent += transitions[fromTo];
	            for (j = 0; j < indent; j++) 
	            {
	                padding += '\t';
	            }
	            
	            if (fromTo == 'opening->closing') 
	            {
	                formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
	            }
	            else
	            {
	                formatted += padding + ln + '\n';
	            }
	        }
	
	        return formatted;
	    },
		
		_IFe1/*initF*/: function() {
			var me = this,
				scriptctrl = me.down("[name=script]"),
				scriptdoc = $(".idv-jcl-edtr", scriptctrl.el.dom),
				editor;
				
			scriptdoc.empty();
			
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(scriptdoc);
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(scriptdoc);
			
			jview = $("<div class='idv-jcl-view'></div>").appendTo(scriptdoc);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jview, w);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jview, h);
			
			editor = ace.edit(jview[0]);
		    editor.setTheme("ace/theme/textmate");
		    editor.getSession().setMode("ace/mode/java");
		    
		    this.scripteditor = editor;
			this.scriptview = jview;
		},
		
		_IFe/*initF*/: function() {
			var me = this,
				editor = me.scripteditor,
				layout;
			
			layout = this._9/*framecontent*/.getLayout();
			layout = this.formatXml(layout);
			editor.setValue(layout);
		},
		
		m1$12/*updateSetting*/: function() {
			var me = this,
				scriptdoc = me.scripteditor,
				script = scriptdoc.getValue();
			
			r = me._9/*framecontent*/.setLayout(script);
			
			return r;
		},
		
		initComponent : function() {
			var me = this;
			
			$s.apply(this, {
				items: [
					{
						xtype: "panel",
						"layout": "border",
					
						items: [
							{
								xtype: "panel",
								region: "center",
								"layout": "fit",
								border: 0,
								items: [
									{
										name: "script",
										html: "<div class='idv-jcl-edtr'></div>",
										listeners: {
											afterrender: function(tobj) {
												me._IFe1/*initF*/.call(me);
											},
											resize: function(tobj, w, h, ow, oh, opts) {
												if (me.scriptview && me.scripteditor)
												{
													IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.scriptview, w);
													IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.scriptview, h);
													me.scripteditor.resize(true);
												}
											}
										}
									}
								]
							}
						]
					}
				]
			});
			
			IG$/*mainapp*/.cm1/*view_source*/.superclass.initComponent.apply(this, arguments);
		}
	});	
}
if (window.Ext)
{
	IG$/*mainapp*/.D_/*dashboard_var*/ = $s.extend($s.window, {
		modal: true,
		closable: false,
		resizable:true,
		layout: "fit",
		autoHeight: true,
		width: 400,
		
		i1/*loadVariables*/: function() {
		},
		
		initComponent : function() {
			var me = this;
			
			$s.apply(this, {
				title: IRm$/*resources*/.r1("T_DBD_VAR"),
				
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
								xtype: "displayfield",
								value: "Variables"
							},
							{
								xtype: "gridpanel",
								flex: 1,
								minHeight: 400,
								store: {
									xtype: "store",
									fields: [
										"name", "uid", "nodepath", "type"
									]
								},
								columns: [
									{
										text: "",
										width: 25
									},
									{
										text: "Name",
										flex: 1
									},
									{
										text: "Bind Control",
										flex: 1
									},
									{
										xtype: "actioncolumn",
										width: 50,
										items: [
											{
												iconCls: "icon-grid-delete",
												tooltip: "Delete variable",
												handler: function (grid, rowIndex, colIndex) {
													var rec = grid.store.getAt(rowIndex);
													grid.store.removeAt(rowIndex);
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
				],
				listeners: {
					afterrender: function(ui, opt) {
						var me = this;
						setTimeout(function() {
							me.i1/*loadVariables*/.call(me);
						}, 10);
					}
				}
			});
			
			IG$/*mainapp*/.D_/*dashboard_var*/.superclass.initComponent.apply(this, arguments);
		}
	});
}
if (window.Ext)
{
	IG$/*mainapp*/._IAa/*eventWizard*/ = $s.extend($s.window, {
		modal: true,
		region:"center",
		"layout": {
			type: "fit",
			align: "stretch"
		},
		
		closable: false,
		resizable:true,
		width: 500,
		height: 400,
		
		_9/*framecontent*/: null,
		
		callback: null,
		
		caction: null,
		
		_IG0/*closeDlgProc*/: function() {
			this.close();
		},
		
		m1$9/*confirmSetting*/: function() {
			var me = this,
				_IH1/*mainpanel*/ = me._IH1/*mainpanel*/;
			
			if (_IH1/*mainpanel*/.m1$12/*updateSetting*/.call(_IH1/*mainpanel*/) == true)
			{
				me.callback && me.callback.execute();
				
				me._IG0/*closeDlgProc*/();
			}
		},
		
		m1$9a/*cancelAppendAction*/: function() {
			this.cardNav(0);
		},
		
		m1$9b/*confirmAppendAction*/: function() {
			var me = this,
				actionname = me.down("[name=actionname]"),
				evdesc = actionname.getValue(),
				_9/*framecontent*/ = me._9/*framecontent*/,
				actionid = me.caction.name;
			
			if (evdesc == "")
			{
				return;
			}
			
			me.caction.desc = evdesc;
			_9/*framecontent*/.events[actionid] = me.caction;
			
			me._l13/*updateActionList*/();
			me.cardNav(0);
		},
		
		m1$9m/*removeAction*/: function() {
			var me = this,
				actionname = me.down("[name=actionname]"),
				evdesc = actionname.getValue(),
				_9/*framecontent*/ = me._9/*framecontent*/,
				actionid = me.caction.name;
			
			if (evdesc == "")
			{
				return;
			}
			
			delete _9/*framecontent*/.events[actionid];
			
			me._l13/*updateActionList*/();
			
			me.caction = null;
			
			me.cardNav(0);
		},
		
		m1$9c/*confirmMapping*/: function() {
			var me = this,
				controllist = me.down("[name=controllist]").store.data,
				i, j,
				dt, _9/*framecontent*/ = me._9/*framecontent*/,
				ctrlname, ctrl, evname;
				
			for (i=0; i < controllist.items.length; i++)
			{
				dt = controllist.items[i].data;
				
				if (/(onloadevents|timerevents)/.test(dt.type) == true)
				{
					_9/*framecontent*/._l21/*applicationactions*/[dt.event] = dt.action || "";
				}
				else
				{
					ctrlname = dt.name;
					evname = dt.event;
					ctrl = _9/*framecontent*/.controls[ctrlname];
					
					ctrl.actionlist[evname] = dt.action || "";
				}
			}
			
			me.cardNav(0);
		},
		
		m1$9d/*cancelMapping*/: function() {
			this.cardNav(0);
		},
		
		cardNav: function(indx) {
			var p = this._IH1/*mainpanel*/,
				l = p.getLayout(); //this.getLayout(),
				// i = l.activeItem.id.split("card-")[1],
				//next = parseInt(i, 10) + incr;
				
			l.setActiveItem(indx);
		},
		
		_l10/*goactionstep*/: function(step) {
			// step: 0 = guide
			// step: 1 = new action
			// step: 2 = modify action
			// step: 3 = map action
			
			var npage = step,
				me = this;
			
			switch (step)
			{
			case 0:
				me.cardNav(0);
				break;
			case 1:
				var _9/*framecontent*/ = me._9/*framecontent*/,
					actionid;
				
				actionid = "action_" + _9/*framecontent*/.eventseq;
				_9/*framecontent*/.eventseq++;
				
				me.caction = {name: actionid, desc: "", actionlist: []};
				
				me._l11/*editActionList*/();
				break;
			case 2:
				// me._l14/*updateActionCombo*/();
				me.cardNav(2);
				break;
			}
		},
		
		_l11/*editActionList*/: function() {
			var me = this,
				dp = [],
				caction = me.caction,
				actionname = me.down("[name=actionname]");
							
			actionname.setValue(me.caction.desc || me.caction.name);
			
			me._l16/*validateActionEvent*/();
			
			me.cardNav(1);
		},
		
		_l12/*initActionWizard*/: function() {
			var panel = this,
				wizard_step = $("#action_wizard_step"),
				step1 = $("<li class='m-link'><b><span>Create new action.</span></b></li>"),
				step2 = $("<li class='m-link'><span>Bind action to control.</span></li>")
	
			wizard_step.append(step1);
			wizard_step.append(step2);
					
			step1.bind("click", function() {
				panel._l10/*goactionstep*/.call(panel, 1);
			});
			
			step2.bind("click", function() {
				if (panel._9/*framecontent*/.events)
				{
					var key,
						n = 0;
						
					for (key in panel._9/*framecontent*/.events)
					{
						n++;
					}
					
					if (n == 0)
					{
						return;
					}
				}
				panel._l10/*goactionstep*/.call(panel, 2);
			});
			
			panel._l13/*updateActionList*/();
		},
		
		_l13/*updateActionList*/: function() {
			var panel = this,
				key,
				_9/*framecontent*/ = panel._9/*framecontent*/,
				act,
				unode = $("#m-action-list");
			
			unode.empty();
			
			for (key in _9/*framecontent*/.events)
			{
				act = _9/*framecontent*/.events[key];
				
				var anode = $("<li id='" + key + "' class='m-link'><img src='./images/s.gif' class='item-icon icon-pkg'/><span>" + act.desc + "</span></li>");
				anode.bind("click", function() {
					var citem = this,
						cid = citem.id;
					
					if (panel._9/*framecontent*/.events[cid])
					{
						panel.caction = panel._9/*framecontent*/.events[cid];
						panel._l11/*editActionList*/.call(panel);
					}
				});
				anode.appendTo(unode);
			}
		},
		
		_l14/*updateActionCombo*/: function() {
			var panel = this,
				key,
				act,
				dp = [];
				
			for (key in panel._9/*framecontent*/.events)
			{
				act = panel._9/*framecontent*/.events[key];
				
				dp.push({name: act.desc, value: key});
			} 
			
			panel._l20/*_actcombo*/.loadData(dp);
		},
		
		_l15/*appendActionEvent*/: function() {
			var me = this,
				purpose = me.down("[name=purpose]").getValue();
			
			if (!purpose || purpose == "")
			{
				return;
			}
			
			var ev = new IG$/*mainapp*/._ID0/*frameEvents*/(null);
			ev.type = purpose;
			ev.purpose = purpose;
			
			me.caction.actionlist.push(ev);
			
			me._l18/*setHandlerDetail*/(ev);
		},
		
		_l16/*validateActionEvent*/: function() {
			var me = this,
				dp = [],
				i, j,
				item,
				evt,
				cactionlist = me.down("[name=cactionlist]"),
				caction = me.caction;
				
			for (i=0; i < caction.actionlist.length; i++)
			{
				evt = caction.actionlist[i];
				evt.uid = "action_" + i;
				item = {
					name: me._l17/*getActionLabel*/(evt.purpose), 
					type: evt.purpose,
					uid: evt.uid
				};
				
				switch (item.type)
				{
				case "onlinereport":
					item.desc = "";
					if (evt.item && evt.item.uid)
					{
						for (j=0; j < me._9/*framecontent*/.dashboardreport.length; j++)
						{
							if (me._9/*framecontent*/.dashboardreport[j].uid == evt.item.uid)
							{
								item.desc = me._9/*framecontent*/.dashboardreport[j].name;
								break;
							}
						}
					}
					break;
				case "valuelist":
					item.desc = "";
					break;
				case "execute_script":
					item.desc = evt.script;
					break;
				case "servercall":
					item.desc = evt.jmethod + "(" + evt.jmodule_name + ")";
					break;
				case "sql":
					break;
				}
				dp.push(item);
			}
			
			cactionlist.store.loadData(dp);
		},
		
		_l17/*getActionLabel*/: function(purpose) {
			var me = this,
				i,
				r = "";
			
			for (i=0; i < me.eventdata.length; i++)
			{
				if (me.eventdata[i].purpose == purpose)
				{
					r = me.eventdata[i].desc;
					break;
				}
			}
			
			return r;
		},
		
		_l18/*setHandlerDetail*/: function(ritem) {
			var me = this,
				dlg = null,
				_9/*framecontent*/ = me._9/*framecontent*/,
				uitem = null,
				i;
				
			for (i=0; i < me.caction.actionlist.length; i++)
			{
				if (me.caction.actionlist[i].uid == ritem.uid)
				{
					uitem = me.caction.actionlist[i];
					break;
				}
			}
			
			dlg = new IG$/*mainapp*/._IAc/*actionWizard*/({
				_9/*framecontent*/: _9/*framecontent*/, 
				ritem: uitem,
				qmode: ritem.purpose,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.fV5/*updateHandlerDetail*/)
			});
			
			IG$/*mainapp*/._I_5/*checkLogin*/(me, dlg);
		},
		
		fV5/*updateHandlerDetail*/: function() {
			this._l16/*validateActionEvent*/();
		},
		
		_l19/*removeMappedEvent*/: function(ctrlname, evname) {
			var _9/*framecontent*/ = this._9/*framecontent*/,
				ctrl = _9/*framecontent*/.controls[ctrlname];
			
			if (ctrl)
			{
				ctrl.actionlist[evname] = null;
			}
		},
		
		initComponent : function() {
			var panel = this;
			
			panel.title = IRm$/*resources*/.r1('L_EVENT_WIZARD');
					
			panel.eventdata = IG$/*mainapp*/.iU0/*eventdata*/;
	        
			panel._IH1/*mainpanel*/ = new $s.panel({
				"layout": "card",
				activeItem: 0,
				
				_9/*framecontent*/: panel._9/*framecontent*/,
							
				_IFe/*initF*/: function() {
					var me = this,
						i,
						j,
						_9/*framecontent*/ = me._9/*framecontent*/,
						dp = [],
						controllist = me.down("[name=controllist]"),
						event,
						actname,
						evtname,
						actdesc,
						key;
					
					var onloadaction = {name: "OnLoad Action", type: "onloadevents", event: "onload", action: "", actiondesc: ""},
						timeraction = {name: "Timer Action", type: "timerevents", event: "ontimer", action: "", actiondesc: ""};
									
					actname = _9/*framecontent*/._l21/*applicationactions*/.onload;
					onloadaction.action = (_9/*framecontent*/.events[actname] && _9/*framecontent*/.events[actname] != "") ? actname : "";
					onloadaction.actiondesc = (_9/*framecontent*/.events[actname] && _9/*framecontent*/.events[actname] != "") ? _9/*framecontent*/.events[actname].desc : "";
					
					actname = _9/*framecontent*/._l21/*applicationactions*/.ontimer;
					timeraction.action = (_9/*framecontent*/.events[actname] && _9/*framecontent*/.events[actname] != "") ? actname : "";
					timeraction.actiondesc = (_9/*framecontent*/.events[actname] && _9/*framecontent*/.events[actname] != "") ? _9/*framecontent*/.events[actname].desc : "";
	
					dp.push(onloadaction);
					dp.push(timeraction);
									
					if (_9/*framecontent*/)
					{
						for (key in _9/*framecontent*/.controls)
						{
							var aguide,
								ctrl = _9/*framecontent*/.controls[key];
								
							if (ctrl && IG$/*mainapp*/._IE0/*controls*/[ctrl.type] && IG$/*mainapp*/._IE0/*controls*/[ctrl.type].p)
							{
								var p = IG$/*mainapp*/._IE0/*controls*/[ctrl.type].p,
									dip = [];
								
								for (j=0; j < p.length; j++)
								{
									if (p[j].type == "event")
									{
										var lobj = {name: ctrl.name, type: ctrl.type, event: p[j].name, action: ""};
										actname = p[j].name;
										evtname = ctrl.actionlist[actname];
										if (evtname && _9/*framecontent*/.events[evtname])
										{
											lobj.action = evtname;
											lobj.actiondesc = _9/*framecontent*/.events[evtname].desc;
										}
										dip.push(lobj);
									}
								}
								
								for (j=0; j < dip.length; j++)
								{
									dp.push(dip[j]);
								}
							}
						}
					}
					
					controllist.store.loadData(dp);
				},
				
				m1$12/*updateSetting*/: function() {
					
					return true;
				},
				
				items: [
					{
						id: "card-0",
						xtype: "panel",
						border: false,
						autoLoad: {url: './html/action_wizard.html', callback: this._l12/*initActionWizard*/, scope: this},
						autoScroll: true
					},
					{
						id: "card-1",
						xtype: "form",
						plain: true,
	        			border: 0,
	        			bodyPadding: 5,
	        			fieldDefaults: {
				            labelWidth: 100,
				            anchor: '100%'
				        },
				        "layout": {
				            type: 'vbox',
				            align: 'stretch'  // Child items are stretched to full width
				        },
	        
						items: [
							{
								xtype: "textfield",
								fieldLabel: "Action name",
								name: "actionname"
							},
							{
								xtype: 'fieldcontainer',
	                    		fieldLabel: 'Add Action',
	                    		labelStyle: 'font-weight:bold',
	                    		"layout": 'hbox',
	                    		defaultType: 'textfield',
	                    		items: [
									{
										xtype: "combo",
										
										store: {
							                fields: [
							                	{name: 'purpose', 		mapping: "purpose", type: 'String'},
							                	{name: 'desc', 			mapping: "desc", type: 'String'}
							                ],
							                data: this.eventdata
							            },
							            displayField: "desc",
							            valueField: "purpose",
							            editable: false,
							            queryMode: "local",
							            selectOnTab: false,
							            name: "purpose"
									},
									{
										xtype: "button",
										text: "Append",
										handler: function() {
											this._l15/*appendActionEvent*/();
										},
										scope: this
									}
								]
							},
							{
								xtype: "grid",
								height: 210,
								store: {
									fields: [
										{name: 'name'},
										{name: 'type'},
										{name: 'uid'},
										{name: 'desc'},
										{name: 'delete'}
									]
								},
								name: "cactionlist",
								columns: [
									{
										text: IRm$/*resources*/.r1('B_NAME'),
										flex: 1,
										sortable: false,
										dataIndex: 'name'
									},
									{
										text: IRm$/*resources*/.r1('B_DESC'),
										flex: 1,
										sortable: false,
										dataIndex: 'desc'
									},
									{
										xtype: 'actioncolumn',
										width: 50,
										items: [
											{
												// icon: './images/brick.png',
												iconCls: "icon-grid-config",
												tooltip: 'Edit',
												handler: function (grid, rowIndex, colIndex) {
													var rec = grid.store.getAt(rowIndex),
														ritem = panel.caction.actionlist[rowIndex];
													
													panel._l18/*setHandlerDetail*/.call(panel, ritem);
												}
											},
											{
												// icon: './images/delete.png',
												iconCls: "icon-grid-delete",
												tooltip: 'Delete item',
												handler: function (grid, rowIndex, colIndex) {
													var rec = grid.store.getAt(rowIndex);
													panel.caction.actionlist.splice(rowIndex, 1);
													grid.store.remove(rec);
												}
											}
										]
									}
								],
								viewConfig: {
									stripeRows: true
								},
								listeners: {
									itemdblclick: function(grid, record, item, index, e, eOpts) {
										var rec = grid.store.getAt(index),
											ritem = panel.caction.actionlist[index];
										
										panel._l18/*setHandlerDetail*/.call(panel, ritem);
									}
								}
							}
						],
						buttons:[
							{
								text: "Remove Action",
								handler: function() {
									this.m1$9m/*removeAction*/();
								},
								scope: this
							}, "->",
							{
								text: IRm$/*resources*/.r1("B_CONFIRM"),
								handler: function() {
									this.m1$9b/*confirmAppendAction*/();
								},
								scope: this
							}, 
							{
								text: IRm$/*resources*/.r1("B_CANCEL"),
								handler:function() {
									this.m1$9a/*cancelAppendAction*/();
								},
								scope: this
							}
						]
					},
					{
						id: "card-2",
						xtype: "panel",
						"layout": "fit",
						items: [
							{
								xtype: 'grid',
								store: {
									fields: [
										{name: 'name'},
										{name: 'type'},
										{name: 'event'},
										{name: 'action'},
										{name: 'actiondesc'}
									]
								},
								name: 'controllist',
								stateful: true,
								height: 120,
								plugins: [
									{
										ptype: "cellediting",
										clicksToEdit: 1
									}
								],
								columns: [
									{
										text: IRm$/*resources*/.r1('B_NAME'),
										flex: 1,
										sortable: false,
										dataIndex: 'name',
										editable: false
									},
									{
										text: IRm$/*resources*/.r1('B_TYPE'),
										flex: 1,
										sortable: false,
										dataIndex: 'type',
										editable: false
									},
									{
										text: IRm$/*resources*/.r1('B_TYPE'),
										flex: 1,
										sortable: false,
										dataIndex: 'event',
										editable: false
									},
									{
								    	xtype: 'gridcolumn',
								    	width: 120,
								    	text: 'Action',
								    	dataIndex: 'action',
								    	editable: true,
								    	editor: {
											xtype: 'combobox',
											queryMode: 'local',
											displayField: 'name',
											valueField: 'value',
											editable: false,
											autoSelect: true,
											triggerAction: 'all',
											selectOnTab: true,
											store: {
												fields: [
													"name", "value"
												]
											},
											lazyRender: true,
											listClass: 'x-combo-list-small',
											listeners: {
												afterrender: function(view) {
													panel._l20/*_actcombo*/ = view.store;
													panel._l14/*updateActionCombo*/.call(panel);
												}
											}
										}
								    },
									{
										xtype: 'actioncolumn',
										width: 50,
										editable: false,
										items: [
											{
												// icon: './images/delete.png',
												iconCls: "icon-grid-delete",
												tooltip: 'Delete item',
												handler: function (grid, rowIndex, colIndex) {
													var rec = grid.store.getAt(rowIndex),
														ctrlname = rec.get("name"),
														evname = rec.get("event");
													
													panel._l19/*removeMappedEvent*/.call(panel, ctrlname, evname);
													rec.set("action", "");
												}
											}
										]
									}
								],
								viewConfig: {
									stripeRows: true
								}
							}
						],
						buttons: [
							{
								text: IRm$/*resources*/.r1("B_CONFIRM"),
								handler: function() {
									this.m1$9c/*confirmMapping*/();
								},
								scope: this
							}, 
							{
								text: IRm$/*resources*/.r1("B_CANCEL"),
								handler:function() {
									this.m1$9d/*cancelMapping*/();
								},
								scope: this
							}
						]
					},
					{
						id: "card-3",
						xtype: "panel",
						border: false,
						autoScroll: true,
						"layout": {
							type: "vbox",
							align: "stretch"
						},
						
						items: [
						]
					}
				],
				
				listeners: {
					afterrender: function(ui) {
						var panel = this;
						
						panel._IFe/*initF*/();
					},
					
					cardswitch: function() {
						
					}
				}
			});
			
			$s.apply(this, {
				defaults:{bodyStyle:"padding:10px"},
				
				items: [
					    this._IH1/*mainpanel*/
					],
				buttons:[
					{
						id: "card-prev",
						text: "Guide",
						handler: function() {
							this.cardNav(0);
						},
						scope: this
					}, "->",
					{
						text: IRm$/*resources*/.r1("B_CONFIRM"),
						handler: function() {
							this.m1$9/*confirmSetting*/();
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
			
			IG$/*mainapp*/._IAa/*eventWizard*/.superclass.initComponent.apply(this, arguments);
		}
	});
}
if (window.Ext)
{
	IG$/*mainapp*/._m2a/*columnstroe*/ = $s.extend($s.window, {
	
		modal: false,
		isWindow: true,
		region:"center",
		"layout": {
			type: "fit",
			align: "stretch"
		},
		
		closable: false,
		resizable:false,
		width: 560,
		height: 400,
		
		_9/*framecontent*/: null,
		
		callback: null,
		
		_IG0/*closeDlgProc*/: function() {
			this.close();
		},
		
		_IFf/*confirmDialog*/: function() {
			var me = this,
				r = true,
				fctrl = me.fctrl,
				i,
				rec,
				g_store = me.down("[name=g_store]");
				
			if (fctrl)
			{
				fctrl._f_columns = [];
				
				for (i=0; i < g_store.store.data.items.length; i++)
				{
					rec = g_store.store.data.items[i];
					fctrl._f_columns.push({
						name: rec.get("name"),
						title: rec.get("title"),
						hidden: rec.get("hidden"),
						sortable: rec.get("sortable"),
						kname: rec.get("kname"),
						cstyle: rec.get("cstyle"),
						columnwidth: rec.get("columnwidth")
					});
				}
			}
				
			if (r == true)
			{
				me.callback && me.callback.execute();
				
				me._IG0/*closeDlgProc*/();
			}
		},
		
		_IFe1/*initF*/: function() {
			var me = this,
				_9/*framecontent*/ = me._9/*framecontent*/,
				events = _9/*framecontent*/.events,
				k,
				dp = [],
				g_store = me.down("[name=g_store]");
				
			g_store.store.loadData(me.fctrl._f_columns);
				
			$.each(events, function(k, val) {
				var i,
					action;
				
				for (i=0; i < val.actionlist.length; i++)
				{
					if (val.actionlist[i].purpose == "sql")
					{
						action = val.actionlist[i];
						dp.push({
							actiongroup: k,
							purpose: action.purpose,
							seq: action.seq,
							uid: action.uid,
							name: action.name,
							description: action.description
						});
					}
				}
			});
			
			me.down("[name=g_actions]").store.loadData(dp);
		},
		
		i1/*importColumn*/: function(rec) {
			var me = this,
				_9/*framecontent*/ = me._9/*framecontent*/,
				events = _9/*framecontent*/.events,
				action,
				agroup,
				i,
				dp;
				
			agroup = events[rec.get("actiongroup")];
			
			if (agroup)
			{
				for (i=0; i < agroup.actionlist.length; i++)
				{
					if (agroup.actionlist[i].seq == rec.get("seq"))
					{
						action = agroup.actionlist[i];
					}
				}
			}
			
			if (action)
			{
				dp = [];
				
				if (action.purpose == "sql" && action.columns)
				{
					for (i=0; i < action.columns.length; i++)
					{
						dp.push({
							name: action.columns[i].name,
							kname: action.columns[i].kname
						});
					}
				}
				
				me.down("[name=g_store]").store.loadData(dp);
			}
		},
		
		initComponent : function() {
			var me = this;
			
			me.title = "Grid Store Configuration",
			
			$s.apply(this, {
				items: [
					{
						xtype: "panel",
						"layout": "card",
						name: "mcard",
						bodyPadding: 10,
						items: [
							{
								xtype: "gridpanel",
								name: "g_store",
								flex: 1,
								selType: "checkboxmodel",
								selModel: {
									checkSelector: ".x-grid-cell",
									mode: "MULTI"
								},
								store: {
									xtype: "store",
									fields: [
										"name", "title", "hidden", "sortable", "kname", "cstyle", "columnwidth"
									]
								},
								columns: [
									{
										text: "Name",
										dataIndex: "name",
										flex: 1,
										minWidth: 120
									},
									{
										text: "Title",
										dataIndex: "title",
										flex: 1,
										minWidth: 120
									},
									{
										text: "Hidden",
										xtype: "checkcolumn",
										width: 60,
										dataIndex: "hidden"
									},
									{
										text: "Sortable",
										xtype: "checkcolumn",
										width: 60,
										dataIndex: "sortable"
									},
									{
										text: "Column Style",
										flex: 1,
										minWidth: 120,
										dataIndex: "cstyle"
									},
									{
										text: "Column Width",
										width: 80,
										dataIndex: "columnwidth"
									}
								],
								tbar: [
									{
										text: "Move Up",
										handler: function() {
										},
										scope: this
									},
									{
										text: "Move Down",
										handler: function() {
										},
										scope: this
									},
									"->",
									{
										text: "Import from Action",
										handler: function() {
											this.down("[name=mcard]").getLayout().setActiveItem(1);
										},
										scope: this
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
										xtype: "gridpanel",
										name: "g_actions",
										flex: 1,
										selType: "checkboxmodel",
										selModel: {
											checkSelector: ".x-grid-cell",
											mode: "SINGLE"
										},
										store: {
											xtype: "store",
											fields: [
												"actiongroup", "purpose", "eventtype", "uid", "name", "description", "seq"
											]
										},
										columns: [
											{
												text: "Group",
												dataIndex: "actiongroup"
											},
											{
												text: "Type",
												dataIndex: "eventtype"
											},
											{
												text: "Name",
												dataIndex: "name"
											},
											{
												text: "Description",
												dataIndex: "description",
												flex: 1
											}
										]
									},
									{
										xtype: "toolbar",
										layout: {
											type: "hbox",
											align: "stretch"
										},
										items: [
											"->",
											{
												text: "Import Columns",
												handler: function() {
													var me = this,
														sel = me.down("[name=g_actions]").getSelectionModel().selected,
														rec;
													if (sel && sel.length > 0)
													{
														rec = sel.items[0];
														me.i1/*importColumn*/(rec);
													}
													me.down("[name=mcard]").getLayout().setActiveItem(0);
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
//					{
//						text: IRm$/*resources*/.r1("B_HELP"),
//						handler: function() {
//							IG$/*mainapp*/._I63/*showHelp*/("P0022");
//						},
//						scope: this
//					}, 
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
					afterrender: function(tobj) {
						me._IFe1/*initF*/.call(me);
					}
				}
			});
			
			IG$/*mainapp*/._m2a/*columnstroe*/.superclass.initComponent.apply(this, arguments);
		}
	});
}

if (window.Ext)
{
	IG$/*mainapp*/._IAc/*actionWizard*/ = $s.extend($s.window, {
		modal: true,
		
		"layout": {
			type: "fit",
			align: "stretch"
		},
		
		closable: false,
		resizable:false,
		width: 600,
		height: 500,
		
		_9/*framecontent*/: null,
		ritem: null,
		
		callback: null,
		qmode: null,
		
		_l15/*appendFilterCondition*/: function() {
			var me = this,
				trpt = me.down("[name=trpt_ol]").getValue(), 
				i, cubeuid = null,
				_9/*framecontent*/ = me._9/*framecontent*/,
				ctrl,
				pop,
				sheetoption;
			
			ctrl = _9/*framecontent*/.controls[trpt];
			
			if (ctrl && ctrl.item)
			{
				for (i=0; i < me._9/*framecontent*/.dashboardreport.length; i++)
				{
					if (me._9/*framecontent*/.dashboardreport[i].uid == ctrl.item.uid)
					{
						cubeuid = me._9/*framecontent*/.dashboardreport[i].cubeuid;
						break;
					}
				}
			}
			
			if (!cubeuid)
			{
				IG$/*mainapp*/._I52/*ShowError*/("Control have no valid cube information!");
				return;
			}
			
			sheetoption = new IG$/*mainapp*/._IEf/*clReport*/(null, "Report", false);
			sheetoption.filter = me.ritem.__sfilter;
			sheetoption.havingfilter = me.ritem.__shavingfilter;
			
			pop = new IG$/*mainapp*/._Ia1/*filterEditorWindow*/({
				_ILb/*sheetoption*/: sheetoption,
				cubeuid: cubeuid,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
					var me = this,
						p1 = [],
						p2 = [],
						pmap = {},
						p = [],
						i,
						filterlist = me.down("[name=filterlist]"),
						iparams = {};
						
					me.ritem.__sfilter = sheetoption.filter;
					me.ritem.__shavingfilter = sheetoption.havingfilter;
					
					p1 = me.a1/*getFilterPrompt*/(me.ritem.__sfilter);
					p2 = me.a1/*getFilterPrompt*/(me.ritem.__shavingfilter);
					
					for (i=0; i < filterlist.store.data.items.length; i++)
					{
						rec = filterlist.store.data.items[i];
						iparams[rec.get("name")] = {
							map_param: rec.get("map_param"),
							map_type: rec.get("map_type")
						};
					}
					
					$.each([p1, p2], function(m, pvar) {
						var i;
						
						for (i=0; i < pvar.length; i++)
						{
							if (!pmap[pvar[i]])
							{
								pmap[pvar[i]] = 1;
								
								if (iparams[pvar[i]])
								{
									p.push({
										name: pvar[i],
										map_param: iparams[pvar[i]].map_param,
										map_type: iparams[pvar[i]].map_type
									});
								}
								else
								{
									p.push({
										name: pvar[i],
										map_param: "",
										map_type: ""
									});
								}
							}
						}
					});
					
					me.down("[name=filterlist]").store.loadData(p);
				})
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
		},
		
		a1/*getFilterPrompt*/: function(filter) {
			var me = this,
				r = [];
				
			$.each(filter.subGroups, function(n, group) {
				var p = me.a1/*getFilterPrompt*/.call(me, group),
					i;
				
				for (i=0; i < p.length; i++)
				{
					r.push(p[i]);
				}
			});
			
			$.each(filter.subConditions, function(n, condition) {
				var i,
					cvalue,
					n = 0,
					pname,
					c;
				
				if (condition.values && condition.values.length > 0)
				{
					for (i=0; i < condition.values.length; i++)
					{
						cvalue = condition.values[i].code;
						
						if (cvalue)
						{
							n = cvalue.indexOf("${");
							
							while (n > -1)
							{
								c = cvalue.indexOf("}", n+1);
								if (c > -1)
								{
									pname = cvalue.substring(n+2, c);
									r.push(pname);
								}
								else
								{
									break;
								}
								n = cvalue.indexOf("${", n + 1);
							}
						}
					}
				}
			});
			
			return r;
		},
		
	//	editFilter: function(filter) {
	//		var me = this,
	//			feditor = new IG$/*mainapp*/._IA0/*dashboardFilter*/({_9/*framecontent*/: me._9/*framecontent*/, fitem: filter});
	//		feditor.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.fV5/*updateFilterValue*/);
	//		feditor.show();
	//	},	
	//	
	//	fV5/*updateFilterValue*/: function() {
	//		var me = this;
	//		
	//		me.updateFilterList();
	//	},
		
		_IG0/*closeDlgProc*/: function() {
			this.close();
		},
		
		_l1a/*selectDashboard*/: function() {
			var me = this,
				dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
					visibleItems: 'workspace;folder;dashboard',
					u5x/*treeOptions*/: {
						cubebrowse: false,
						rootuid: null
					}
				});
			
			dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
				var t_dlgitem = this.down("[name=t_dlgitem]");
				
				me.ritem.item = {
					uid: item.uid,
					name: item.name,
					nodepath: item.nodepath,
					type: item.type
				};
				
				t_dlgitem.setValue(me.ritem.item.name);
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
		},
		
		_l16/*selectDimension*/: function() {
			var me = this;
				// trpt = me.down("[name=trpt_ol]").getValue(), 
				// i, cubeuid = null;
			
	//		for (i=0; i < me._9/*framecontent*/.dashboardreport.length; i++)
	//		{
	//			if (me._9/*framecontent*/.dashboardreport[i].uid == trpt)
	//			{
	//				cubeuid = me._9/*framecontent*/.dashboardreport[i].cubeuid;
	//				break;
	//			}
	//		}
	//		
	//		if (cubeuid == null)
	//		{
	//			return;
	//		}
			
			var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
				visibleItems: 'workspace;folder;codemap;',
				u5x/*treeOptions*/: {
					cubebrowse: false,
					rootuid: "/SYS_Lookup"
				}
			});
			dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs__l16/*selectDimension*/);
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
		},
		
		rs__l16/*selectDimension*/: function(item) {
			var me = this,
				dimension = me.down("[name=dimension]");
			
			me.sel_cmap = item;
			
	//		me.ritem.item = {
	//			cubeuid: cubeuid,
	//			uid: item.uid,
	//			name: item.name,
	//			nodepath: item.nodepath,
	//			type: item.type
	//		};
			
			dimension.setValue(item.name);
		},
		
		j_1/*jasperInit*/: function() {
			var panel = this,
				lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
		
			lreq.init(panel, 
				{
		            ack: "11",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "jasper"})
				}, panel,  function(xdoc) {
					var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
						tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
						i, p, dp = [],
						c, val,
						exp_tmpl = panel.down("[name=exp_tmpl]");
					
					dp.push({name: IRm$/*resources*/.r1("B_SEL"), value: ""});
					for (i=0; i < tnodes.length; i++)
					{
						p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						p.value = p.name;
						dp.push(p);
					}
					
					exp_tmpl.store.loadData(dp);
					exp_tmpl.setValue(panel.ritem ? panel.ritem.exp_tmpl || "" : "");
				}, false);
			
			lreq._l/*request*/();
		},
		
		_IFe/*initF*/: function() {
			var me = this,
				i,
				dp = [],
				_9/*framecontent*/ = me._9/*framecontent*/,
				scriptname,
				ctrl,
				trpt, dimension,
				qmode = me.qmode,
				k;
			
			me.down("[name=e_name]").setValue(me.ritem.name || "");
			me.down("[name=e_desc]").setValue(me.ritem.description || "");
			
			me.j_1/*jasperInit*/();
			
			switch (qmode)
			{
			case "onlinereport":
				trpt = me.down("[name=trpt_ol]");
				
				dp.push({name: "Select Control", uid: ""});
				
				for (i in _9/*framecontent*/.controls)
				{
					ctrl = _9/*framecontent*/.controls[i];
					
					if (ctrl.type == "olapreport")
					{
						dp.push(
							{
								name: ctrl.name,
								uid: ctrl.name
							}
						);
					}
				}
				
				trpt.store.loadData(dp);
				
				trpt.setValue(me.ritem.item ? me.ritem.item.uid : "");
				
				var oparams = [];
				
				if (me.ritem.s_iparams)
				{
					for (i=0; i < me.ritem.s_iparams.length; i++)
					{
						oparams.push(me.ritem.s_iparams[i]);
					}
					
					me.down("[name=filterlist]").store.loadData(oparams);
				}
				break;
			case "valuelist":
				// trpt = me.down("[name=trpt_vl]"),
				dimension = me.down("[name=dimension]");
				me.ritem.item && dimension.setValue(me.ritem.item.name);
				
	//			for (i=0; i < _9/*framecontent*/.dashboardreport.length; i++)
	//			{
	//				dp.push({
	//					name: _9/*framecontent*/.dashboardreport[i].name,
	//					nodepath: _9/*framecontent*/.dashboardreport[i].nodepath,
	//					type: _9/*framecontent*/.dashboardreport[i].type,
	//					uid: _9/*framecontent*/.dashboardreport[i].uid
	//				});
	//			}
	//			
	//			trpt.store.loadData(dp);
				
	//			if (me.ritem.item && me.ritem.item.cubeuid)
	//			{
	//				var cubeuid = me.ritem.item.cubeuid,
	//					selreport = null;
	//				for (i=0; i < _9/*framecontent*/.dashboardreport.length; i++)
	//				{
	//					if (_9/*framecontent*/.dashboardreport[i].cubeuid == cubeuid)
	//					{
	//						selreport = _9/*framecontent*/.dashboardreport[i].uid;
	//						break;
	//					}
	//				}
	//				
	//				setTimeout(function() {
	//					trpt.setValue(selreport);
	//				}, 100);
	//				dimension.setValue(me.ritem.item.name);
	//			}
				break;
			case "sql":
				me.down("[name=sqlsyntax]").setValue(me.ritem.sqlsyntax);
				me.down("[name=dsource]").setValue(me.ritem.dsource);
				me.down("[name=rmode]").setValue(me.ritem.rmode || "");
				var iparams = [],
					oparams = [],
					columns = [],
					prompts = [],
					k, i;
				if (me.ritem.s_oparams)
				{
					for (i=0; i < me.ritem.s_oparams.length; i++)
					{
						k = me.ritem.s_oparams[i];
						oparams.push({
							name: k.name,
							kname: k.kname || k.name
						});
					}
				}
				
				if (me.ritem.s_iparams)
				{
					for (i=0; i < me.ritem.s_iparams.length; i++)
					{
						k = me.ritem.s_iparams[i];
						oparams.push({
							name: k.name,
							kname: k.kname || k.name
						});
					}
				}
				
				if (me.ritem.columns)
				{
					for (i=0; i < me.ritem.columns.length; i++)
					{
						columns.push(me.ritem.columns[i]);
					}
				}
				
				if (me.ritem.prompts)
				{
					for (i=0; i < me.ritem.prompts.length; i++)
					{
						prompts.push(me.ritem.prompts[i]);
					}
				}
				me.down("[name=s_iparams]").store.loadData(iparams);
				me.down("[name=s_oparams]").store.loadData(oparams);
				me.down("[name=columngrid]").store.loadData(columns);
				me.down("[name=promptgrid]").store.loadData(prompts);
				me._l2/*loadDataSource*/(me.ritem.dsource);
				break;
			case "execute_script":
				scriptname = this.down("[name=scriptname]");
				for (i=0; i < _9/*framecontent*/._l23/*functionnames*/.length; i++)
				{
					dp.push({name: _9/*framecontent*/._l23/*functionnames*/[i]});
				}
				
				scriptname.store.loadData(dp);
				scriptname.setValue(this.ritem.script);
				break;
			case "export":
				me.down("[name=exp_out]").setValue(me.ritem.exp_out || "");
				break;
			case "open_win":
				me.down("[name=ispopup]").setValue(me.ritem.ispopup);
				me.down("[name=t_dlgitem]").setValue(me.ritem.item ? me.ritem.item.name : "");
				break;
			case "open_dlg":
				dp.push({name: "Select", value: ""});
				for (i=0; i < _9/*framecontent*/._l23/*functionnames*/.length; i++)
				{
					dp.push({
						name: _9/*framecontent*/._l23/*functionnames*/[i],
						value: _9/*framecontent*/._l23/*functionnames*/[i]
					});
				}
				
				me.down("[name=btnclose]").store.loadData(dp);
				IG$/*mainapp*/.x02/*fillFormValues*/(me, me.ritem, "btntype;dlgtitle;dlgmsg".split(";"));
				me.down("[name=btnclose]").setValue(me.ritem.btnclose || "");
				break;
			case "servercall":
				me._l1/*loadModule*/();
				
				break;
			}
		},
		
		_l2/*loadDataSource*/: function(dvalue) {
			var me = this,
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
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
						isadmin = false,
						dsource = me.down("[name=dsource]");
					
					dp.push({name:"-- Select Pool --", poolname:""}); 
					
					if (cnode)
					{
						snodes = IG$/*mainapp*/._I26/*getChildNodes*/(cnode);
						isadmin = IG$/*mainapp*/._I83/*dlgLogin*/.jS2/*isAdmin*/;
						
						for (i=0; i < snodes.length; i++)
						{
							p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
							if (isadmin == true || (isadmin == false && p.name.toUpperCase() != "MECBASE"))
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
					
					dsource.store.loadData(dp);
					dsource.setValue(dvalue || "");
				}, false);
			req._l/*request*/();
		},
		
		_l1/*loadModule*/: function() {
			var me = this,
				mod_uid = me.ritem._jmodule || me.ritem.jmodule,
				req;
			
			if (mod_uid)
			{
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(me, 
					{
						ack: "5",
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: mod_uid}),
						mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'standard'})
					}, me, function(xdoc) {
						var minfo = new IG$/*mainapp*/.ifg/*classmodule*/(xdoc),
							dp = [{name: "Select Method", value: ""}],
							i,
							np;
							
						for (i=0; i < minfo.modules.length; i++)
						{
							dp.push({name: minfo.modules[i].name, value: minfo.modules[i].name});
						}
						
						np = minfo.ditem.nodepath.split("/");
						np.splice(0, 1);
						np.splice(0, 1);
						np = np.join(".");
						
						me.ritem._jmodule_name = np;
						
						me.down("[name=jmodule]").setValue(minfo.ditem.name);
						me.down("[name=jmethod]").store.loadData(dp);
						me.down("[name=jmethod]").setValue(me.ritem.jmethod);
					}, false);
				req._l/*request*/();
			}
		},
		
		m1$9/*confirmSetting*/: function() {
			var me = this,
				trpt,
				valid,
				ritem = this.ritem,
				i, rpt, selrpt = null,
				trpt,
				qmode = me.qmode,
				e_name = me.down("[name=e_name]"),
				filterlist,
				rec,
				k;
			
			e_name.clearInvalid();
			
			me.ritem.name = e_name.getValue();
			me.ritem.description = me.down("[name=e_desc]").getValue();
			
			if (!me.ritem.name)
			{
				e_name.markInvalid("Required Value");
				return false;
			}
			
			switch (qmode)
			{
			case "onlinereport":
				trpt = me.down("[name=trpt_ol]").getValue();
				me.ritem.item = null;
				if (trpt)
				{
					me.ritem.item = {
						uid: trpt
					};
				}
				
				filterlist = me.down("[name=filterlist]");
				me.ritem.s_iparams = me.ritem.s_iparams || [];
				
				me.ritem.s_iparams.length && me.ritem.s_iparams.splice(0, me.ritem.s_iparams.length);
				
				for (i=0; i < filterlist.store.data.items.length; i++)
				{
					rec = filterlist.store.data.items[i];
					
					me.ritem.s_iparams.push({
						name: rec.get("name")
					});
				}			
				break;
			case "sql":
				me.ritem.sqlsyntax = me.down("[name=sqlsyntax]").getValue();
				me.ritem.dsource = me.down("[name=dsource]").getValue();
				me.ritem.rmode = me.down("[name=rmode]").getValue();
				
				me.ritem.columns = [];
				me.ritem.prompts = [];
				me.ritem.s_iparams = [];
				me.ritem.s_oparams = [];
				
				var columngrid = me.down("[name=columngrid]"),
					promptgrid = me.down("[name=promptgrid]"),
					s_iparams = me.down("[name=s_iparams]"),
					s_oparams = me.down("[name=s_oparams]"),
					rec;
					
				for (i=0; i < columngrid.store.data.items.length; i++)
				{
					me.ritem.columns.push(columngrid.store.data.items[i].data);
				}
				
				for (i=0; i < promptgrid.store.data.items.length; i++)
				{
					me.ritem.prompts.push(promptgrid.store.data.items[i].data);
				}
				
				for (i=0; i < s_iparams.store.data.items.length; i++)
				{
					rec = s_iparams.store.data.items[i];
					if (rec.get("name"))
					{
						me.ritem.s_iparams.push({
							name: rec.get("name"),
							kname: rec.get("kname")
						});
					}
				}
				
				for (i=0; i < s_oparams.store.data.items.length; i++)
				{
					rec = s_oparams.store.data.items[i];
					if (rec.get("name"))
					{
						me.ritem.s_oparams.push({
							name: rec.get("name"),
							kname: rec.get("kname")
						});
					}
				}
				
				break;
			case "valuelist":
	//			trpt = me.down("[name=trpt_vl]").getValue();
	//			if (!trpt || trpt == "")
	//				return;
				
	//			for (i=0; i < me._9/*framecontent*/.dashboardreport.length; i++)
	//			{
	//				rpt = me._9/*framecontent*/.dashboardreport[i];
	//				if (rpt.uid == trpt)
	//				{
	//					selrpt = rpt;
	//					break;
	//				}
	//			}
				
				if (me.sel_cmap)
				{
					me.ritem.item = {
						name: me.sel_cmap.name,
						nodepath: me.sel_cmap.nodepath,
						uid: me.sel_cmap.uid,
						type: me.sel_cmap.type
					};
				}
				break;
			case "execute_script":
				valid = IG$/*mainapp*/.x01/*checkValues*/(this, "scriptname".split(";"));
				if (!valid.b)
					return;
				ritem.script = valid.v["scriptname"];
				break;
			case "export":
				valid = IG$/*mainapp*/.x01/*checkValues*/(this, "exp_tmpl;exp_out".split(";"));
				if (!valid.b)
					return;
				ritem.exp_tmpl = valid.v["exp_tmpl"];
				ritem.exp_out = valid.v["exp_out"];
				break;
			case "servercall":
				valid = IG$/*mainapp*/.x01/*checkValues*/(this, "jmethod".split(";"));
				
				if (!valid.b)
					return;
				
				ritem.jmodule = ritem._jmodule || ritem.jmodule;
				ritem.jmodule_name = ritem._jmodule_name || ritem.jmodule_name;
				ritem.jmethod = valid.v["jmethod"];
				break;
			case "open_win":
				if (!ritem.s_iparams || (ritem && ritem.s_iparams.length == 0))
				{
					ritem.s_iparams = [
						{
							name: "target_window"
						}
					];
				}
				ritem.ispopup = me.down("[name=ispopup]").getValue();
				break;
			case "open_dlg":
				valid = IG$/*mainapp*/.x01/*checkValues*/(this, "btntype;dlgtitle;dlgmsg".split(";"));
				if (!valid.b)
					return;
				
				ritem.btntype = valid.v["btntype"];
				ritem.dlgtitle = valid.v["dlgtitle"];
				ritem.dlgmsg = valid.v["dlgmsg"];
				ritem.btnclose = me.down("[name=btnclose]").getValue();
				break;
			}
			
			me.callback && me.callback.execute();
			
			me._IG0/*closeDlgProc*/();
		},
		
		_t1/*testQuery*/: function() {
			var me = this,
				req = new IG$/*mainapp*/._I3e/*requestServer*/(),
				content, i,
				r;
				
			content = "<smsg><ExecuteSQL dbpool='" + me.down("[name=dsource]").getValue() + "' runmode='" + me.down("[name=rmode]").getValue() + "'>";
			content += "<SQL><![CDATA[" + me.down("[name=sqlsyntax]").getValue() + "]]></SQL>";
			content += '<prompts>'
			content += '</prompts>'
			content += "</ExecuteSQL></smsg>";
			
			req.init(me, 
				{
					ack: "18",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, option: "sqlcubemeta"}, "uid;option;active"),
					mbody: content
				}, me, function(xdoc) {
					var me = this,
						i,
						tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/columns"),
						tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
						cols=[], col,
						prompts = [], prompt,
						columngrid = me.down("[name=columngrid]"),
						promptgrid = me.down("[name=promptgrid]"),
						promptmap = {},
						cname;
											
					if (tnodes)
					{
						for (i=0; i < tnodes.length; i++)
						{
							col = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
							col.fieldinfo = col.uid;
							col.uid = null;
							col.name = col.fieldname;
							col.name = col.name.replace(/\(/g, "");
							col.name = col.name.replace(/\)/g, "");
							col.name = col.name.replace(/\//g, "");
							col.fieldname = col.fieldinfo;
							col.sqlfield = col.name;
							if (!col.name)
							{
								col.name = "column_" + (i+1);
							}
							cname = "column_" + (i+1);
							col.kname = cname;
							col.type = IG$/*mainapp*/._I34/*isNumericType*/(col.datatype) == true ? "Measure" : "Metric";
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
					
					var psql_c = me.down("[name=psql_c]");
					psql_c.getLayout().setActiveItem(2);
				}, null);
			req._l/*request*/();
		},
		
		u1/*updateParameter*/: function() {
			var me = this,
				columngrid = me.down("[name=columngrid]"),
				promptgrid = me.down("[name=promptgrid]"),
				s_iparams = me.down("[name=s_iparams]"),
				s_oparams = me.down("[name=s_oparams]"),
				i,
				rec,
				psql_c = me.down("[name=psql_c]"),
				iparams = [],
				oparams = [],
				rmode =me.down("[name=rmode]").getValue();
			
			if (rmode == "map")
			{
				for (i=0; i < columngrid.store.data.items.length; i++)
				{
					rec = columngrid.store.data.items[i];
					oparams.push({
						name: rec.get("name"),
						kname: rec.get("kname")
					});
				}
			}
			else if (rmode == "list")
			{
				for (i=0; i < 5; i++)
				{
					oparams.push({
						name: "output_control_" + (i+1),
						kname: "output_control_" + (i+1)
					});
				}
			}
			
			for (i=0; i < promptgrid.store.data.items.length; i++)
			{
				rec = promptgrid.store.data.items[i];
				
				iparams.push({
					name: rec.get("name")
				});
			}
			
			s_iparams.store.loadData(iparams);
			s_oparams.store.loadData(oparams);
			psql_c.getLayout().setActiveItem(1);
		},
		
		initComponent : function() {
			var panel = this;
			
			panel.title = IRm$/*resources*/.r1('L_EVENT_WIZARD');
			
			panel.opdata = [
				{name: "Equal", value: "=", dt_num: true, dt_str: true},
				{name: "Greater then", value: ">", dt_num: true, dt_str: false},
				{name: "Less then", value: "<", dt_num: true, dt_str: false},
				{name: "Greater or Equal", value: ">=", dt_num: true, dt_str: false},
				{name: "Less or Equal", value: "<=", dt_num: true, dt_str: false},
				{name: "Like compare", value: "LIKE", dt_num: false, dt_str: true},
				{name: "Between", value: "BETWEEN", dt_num: true, dt_str: false}
			];
			
			$s.apply(this, {
				defaults:{bodyStyle:"padding:10px"},
				
				items: [
					{
						xtype: "panel",
						border: 0,
						bodyPadding: 5,
						fieldDefaults: {
				            labelWidth: 140,
				            anchor: '100%'
				        },
				        layout: {
				        	type: "vbox",
				        	align: "stretch"
				        },
				        items: [
							{
								xtype: "fieldset",
								title: "General Info",
								layout: "anchor",
								defaults: {
									anchor: "100%"
								},
								items: [
									{
										xtype: "textfield",
										fieldLabel: "Name",
										name: "e_name"
									},
									{
										xtype: "textarea",
										name: "e_desc",
										height: 50,
										fieldLabel: "Description"
									}
								]
							},
				        	{
								xtype: "form",
								hidden: this.qmode != "onlinereport",
								border: 0,
								bodyPadding: 5,
								flex: 1,
								fieldDefaults: {
						            labelWidth: 100,
						            anchor: '100%'
						        },
						        "layout": {
						            type: 'vbox',
						            align: 'stretch'  // Child items are stretched to full width
						        },
						        items: [
						        	{
						        		xtype: "combobox",
						        		name: "trpt_ol",
						        		queryMode: "local",
						        		store: {
						        			fields: ["name", "uid"]
						        		},
						        		displayField: "name",
						        		valueField: "uid",
						        		fieldLabel: "Target Control"
						        	},
						        	{
										xtype: 'fieldcontainer',
					            		"layout": {
					            			type: "hbox",
					            			align: "middle"
					            		},
					            		defaultType: 'textfield',
					            		items: [
											{
								        		xtype: "displayfield",
								        		value: "Filter conditions"
								        	},
											{
												xtype: "button",
												margin: "0 0 0 5",
												text: "Edit Filter Condition",
												handler: function() {
													this._l15/*appendFilterCondition*/();
												},
												scope: this
											}
										]
									},
						        	{
						        		xtype: "grid",
						        		flex: 1,
						        		title: "Filter Input Params",
										store: {
											fields: [
												"name", "map_param", "map_type"
											]
										},
										name: "filterlist",
										columns: [
											{
												text: IRm$/*resources*/.r1('B_NAME'),
												flex: 1,
												sortable: false,
												dataIndex: 'name'
											},
											{
												text: IRm$/*resources*/.r1('B_VALUE'),
												flex: 1,
												sortable: false,
												dataIndex: 'map_param'
											}//,
	//										{
	//											xtype: 'actioncolumn',
	//											width: 50,
	//											items: [
	//												{
	//													iconCls: "icon-grid-config",
	//													tooltip: 'Edit',
	//													handler: function (grid, rowIndex, colIndex) {
	//														var rec = grid.store.getAt(rowIndex),
	//															filter = panel.ritem.filters[rowIndex];
	//														
	//														panel.editFilter.call(panel, filter);
	//													}
	//												},
	//												{
	//													// icon: './images/delete.png',
	//													iconCls: "icon-grid-delete",
	//													tooltip: 'Delete item',
	//													handler: function (grid, rowIndex, colIndex) {
	//														var rec = grid.store.getAt(rowIndex);
	//														panel.ritem.filters.splice(rowIndex, 1);
	//														grid.store.remove(rec);
	//													}
	//												}
	//											]
	//										}
										],
										viewConfig: {
											stripeRows: true
										}
						        	}
						        ]
							},
							{
								xtype: "panel",
								border: 0,
								hidden: this.qmode != "open_win",
								flex: 1,
								layout: {
									type: "vbox",
									align: "stretch"
								},
								items: [
									{
										xtype: "checkbox",
										boxLabel: "Popup Dialog",
										name: "ispopup"
									},
									{
										xtype: "fieldcontainer",
										layout: {
											type: "hbox"
										},
										fieldLabel: "Open Dialog Item",
										items: [
											{
												xtype: "textfield",
												readOnly: true,
												name: "t_dlgitem",
												flex: 1
											},
											{
												xtype: "button",
												text: "..",
												handler: function() {
													this._l1a/*selectDashboard*/();
												},
												scope: this
											}
										]
									}
								]
							},
							{
								xtype: "panel",
								border: 0,
								hidden: (this.qmode != "open_dlg"),
								flex: 1,
								layout: {
									type: "vbox",
									align: "stretch"
								},
								items: [
									{
										xtype: "combobox",
										fieldLabel: "Button Type",
										name: "btntype",
										store: {
											xtype: "store",
											fields: [
												"name", "value"
											],
											data: [
												{name: "1 Buttons", value: "close"},
												{name: "2 Buttons", value: "yesno"},
												{name: "3 Buttons", value: "yesnocancel"}
											]
										},
										displayField: "name",
										valueField: "value",
										editable: false,
										queryMode: "local",
										selectOnTab: true
									},
									{
										xtype: "textfield",
										fieldLabel: "Title",
										name: "dlgtitle"
									},
									{
										xtype: "textarea",
										name: "dlgmsg",
										fieldLabel: "Message"
									},
									{
										xtype: "combobox",
										fieldLabel: "Close Action",
										name: "btnclose",
										store: {
											xtype: "store",
											fields: [
												"name", "value"
											]
										},
										displayField: "name",
										valueField: "value",
										editable: false,
										queryMode: "local",
										selectOnTab: true
									}
								]
							},
						    {
						        xtype: "panel",
						        border: 0,
						        hidden: this.qmode != "valuelist",
						        flex: 1,
						        "layout": {
						            type: 'vbox',
						            align: 'stretch'  // Child items are stretched to full width
						        },
						        items: [
	//					        	{
	//					        		xtype: "displayfield",
	//									value: "Select Base Report"
	//					        	},
	//					        	{
	//					        		xtype: "combo",
	//					        		
	//					        		fieldLabel: "Target report",
	//					        		name: "trpt_vl",
	//									store: {
	//										fields: [
	//											{name: 'name'},
	//											{name: 'nodepath'},
	//											{name: 'type'},
	//											{name: 'uid'}
	//										]
	//									},
	//						            displayField: "name",
	//						            valueField: "uid",
	//						            editable: false,
	//						            queryMode: "local",
	//						            selectOnTab: false
	//					        	},
						        	{
						        		xtype: "displayfield",
										value: "Select CodeMap for patch data"
						        	},
						        	{
						        		xtype: 'fieldcontainer',
					            		fieldLabel: "CodeMap name",
					            		labelStyle: 'font-weight:bold',
					            		"layout": 'hbox',
					            		defaultType: 'textfield',
					            		items: [
								        	{
								        		xtype: "textfield",
								        		name: "dimension"
								        	},
								        	{
												xtype: "button",
												text: "Select",
												handler: function() {
													this._l16/*selectDimension*/();
												},
												scope: this
											}
								        ]
								    }
						        ]
							},
							{
								xtype: "panel",
								border: 0,
								name: "psql_c",
								hidden: this.qmode != "sql",
								flex: 1,
								layout: "card",
								deferredRender: false,
								dockedItems: [
									{
										xtype: "toolbar",
										dock: "top",
										items: [
											{
												xtype: "button",
												text: "Query View",
												handler: function() {
													var psql_c = this.down("[name=psql_c]");
													
													psql_c.getLayout().setActiveItem(0);
												},
												scope: this
											},
											{
												xtype: "button",
												text: "Parameter View",
												handler: function() {
													var psql_c = this.down("[name=psql_c]");
													
													psql_c.getLayout().setActiveItem(1);
												},
												scope: this
											},
											{
												xtype: "button",
												text: "Column View",
												handler: function() {
													var psql_c = this.down("[name=psql_c]");
													
													psql_c.getLayout().setActiveItem(2);
												},
												scope: this
											},
											"->",
											{
												xtype: "button",
												text: "Test Query",
												handler: function() {
													this._t1/*testQuery*/();
												},
												scope: this
											}
										]
									}
								],
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
												name: "rmode",
												fieldLabel: "Run Mode",
												queryMode: "local",
												editable: false,
												displayField: "name",
												valueField: "value",
												store: {
													fields: ["name", "value"],
													data: [
														{name: "Select", value: ""},
														{name: "Single Line Query", value: "map"},
														{name: "Data Grid", value: "list"},
														{name: "Insert / Update", value: "update"}
													]
												}
											},
											{
												xtype: "combobox",
												name: "dsource",
												fieldLabel: "Source",
												queryMode: "local",
												editable: false,
												displayField: "name",
												valueField: "poolname",
												store: {
													fields: ["name", "uid", "poolname"]
												}
											},
											{
												xtype: "textarea",
												flex: 1,
												name: "sqlsyntax",
												fieldLabel: "SQL Syntax"
											}
										]
									},
									{
										xtype: "panel",
										border: 0,
										layout: {
											type: "vbox",
											align: "stretch"
										},
										
										items: [
											{
												xtype: "gridpanel",
												title: "Input Parameter",
												name: "s_iparams",
												store: {
													xtype: "store",
													fields: [
														"name"
													]
												},
												flex: 1,
												tbar: [
													{
														xtype: "button",
														text: "Add",
														handler: function() {
														},
														scope: this
													},
													{
														xtype: "button",
														text: "Remove",
														handler: function() {
														},
														scope: this
													},
													{
														xtype: "button",
														text: "Generate Parameter",
														handler: function() {
														},
														scope: this
													}
												],
												columns: [
													{
														text: "Name",
														dataIndex: "name",
														flex: 1
													}
												]
											},
											{
												xtype: "gridpanel",
												flex: 1,
												title: "Output Parameter",
												name: "s_oparams",
												store: {
													xtype: "store",
													fields: [
														"name", "kname"
													]
												},
												tbar: [
													{
														xtype: "button",
														text: "Add",
														handler: function() {
														},
														scope: this
													},
													{
														xtype: "button",
														text: "Remove",
														handler: function() {
														},
														scope: this
													},
													{
														xtype: "button",
														text: "Generate Parameter",
														handler: function() {
														},
														scope: this
													}
												],
												columns: [
													{
														text: "Name",
														dataIndex: "name",
														flex: 1
													},
													{
														text: "Key name",
														dataIndex: "kname",
														flex: 1
													}
												]
											}
										]
									},
									{
										xtype: "panel",
										border: 0,
										layout: {
											type: "vbox",
											align: "stretch"
										},
										items: [
											{
												xtype: "grid",
												title: "Column Outputs",
												name: "columngrid",
												stateful: true,
												columnLines: true,
												flex: 1,
												selType: "checkboxmodel",
												selModel: {
													checkSelector: ".x-grid-cell"
												},
												store: {
													xtype: "store",
													fields: [
														"name", "fieldname", "sqlfield", "type", "datatype", "tablename", "dataoption_data", "dataoption_valuetype", "dataoption_datadelimiter", "dataoption_coldelimiter", "uid", "mapto", "kname"
													]
												},
												initialized: false,
												"layout": 'fit',
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
														xtype: 'gridcolumn',
														text: 'Metric Name',
														dataIndex: 'name',
														flex: 1,
														editor: {
															allowBlank: false
														}
													},
													{
														xtype: 'gridcolumn',
														text: 'Column Name',
														dataIndex: 'fieldname',
														flex: 1
													},
													{
														xtype: 'gridcolumn',
														text: 'Data Type',
														dataIndex: 'type',
														width: 60,
														field: {
															xtype: 'combobox',
															queryMode: 'local',
															displayField: 'name',
															valueField: 'value',
															editable: false,
															autoSelect: true,
															triggerAction: 'all',
															selectOnTab: true,
															store: {
																fields: [
																	"name", "value"
																],
																data: [
																	{name: "Metric", value: "Metric"},
																	{name: "Measure", value: "Measure"}
																]
															},
															lazyRender: true,
															listClass: 'x-combo-list-small'
														}
													}
												]
											},
											{
												xtype: "grid",
												title: "Prompts",
												name: "promptgrid",
												flex: 1,
												stateful: true,
												columnLines: true,
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
												"layout": 'fit',
												plugins: window.Ext ? [
													{
														ptype: "cellediting",
														clicksToEdit: 1
													}
												] : null,
												columns: [
													{
														xtype: 'gridcolumn',
														text: 'Name',
														dataIndex: 'name',
														flex: 1,
														editor: {
															allowBlank: false
														}
													},
													{
														xtype: 'gridcolumn',
														text: 'Default value',
														dataIndex: 'defaultvalue',
														flex: 1
													},
													{
														xtype: 'gridcolumn',
														text: 'Data Type',
														dataIndex: 'datatype',
														width: 60
													},
													{
														xtype: 'gridcolumn',
														text: 'Value Type',
														dataIndex: 'type',
														width: 60
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
														flex: 1
													},
													{
														xtype: "button",
														text: "Update parameter",
														handler: function() {
															this.u1/*updateParameter*/();
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
								xtype: "form",
								border: 0,
								bodyPadding: 5,
								hidden: this.qmode != "execute_script",
								fieldDefaults: {
						            labelWidth: 100,
						            anchor: '100%'
						        },
						        "layout": {
						            type: 'vbox',
						            align: 'stretch'  // Child items are stretched to full width
						        },
						        items: [
						        	{
						        		xtype: "displayfield",
						        		value: "Select script function to execute"
						        	},
						        	{
						        		xtype: "combo",
						        		
						        		fieldLabel: "Script Function",
						        		name: "scriptname",
										store: {
											fields: [
												"name"
											]
										},
							            displayField: "name",
							            valueField: "name",
							            editable: false,
							            queryMode: "local",
							            selectOnTab: false
						        	}
						        ]
							},
							{
								xtype: "form",
								border: 0,
								bodyPadding: 5,
								hidden: this.qmode != "export",
								fieldDefaults: {
						            labelWidth: 100,
						            anchor: '100%'
						        },
						        "layout": {
						            type: 'vbox',
						            align: 'stretch'  // Child items are stretched to full width
						        },
						        items: [
						        	{
						        		xtype: "displayfield",
						        		value: "Select Jasper Report"
						        	},
						        	{
						        		xtype: "combo",
						        		
						        		fieldLabel: "Templates",
						        		name: "exp_tmpl",
										store: {
											fields: [
												"name"
											]
										},
							            displayField: "name",
							            valueField: "name",
							            editable: false,
							            queryMode: "local"
						        	},
						        	{
						        		xtype: "combo",
						        		fieldLabel: "Output Type",
						        		name: "exp_out",
						        		store: {
						        			fields: [
						        				"name", "value"
						        			],
						        			data: [
						        			    {name: IRm$/*resources*/.r1('L_EXPORT_EXCEL'), value: "excel"},
						        			    {name: IRm$/*resources*/.r1('L_EXPORT_PDF'), value: "pdf"},
						        			    {name: IRm$/*resources*/.r1('L_EXPORT_DOCX'), value: "word"},
						        			    {name: IRm$/*resources*/.r1('L_EXPORT_RTF'), value: "rtf"},
						        			    {name: IRm$/*resources*/.r1('L_EXPORT_PPT'), value: "ppt"},
						        			    {name: IRm$/*resources*/.r1('L_EXPORT_HTML'), value: "html"},
						        			    {name: IRm$/*resources*/.r1('L_EXPORT_XML'), value: "xml"}
						        			]
						        		},
						        		displayField: "name",
						        		valueField: "value",
						        		editable: false,
						        		queryMode: "local"
						        	},
						        	{
						        		xtype: "gridpanel",
						        		minHeight: 200,
						        		name: "exp_target",
						        		selType: "checkboxmodel",
						        		selModel: {
						        			mode: "MULTI",
						        			checkSelector: ".x-grid-cell"
						        		},
						        		columns: [
						        			{
						        				text: "Name",
						        				flex: 1
						        			},
						        			{
						        				text: "Sequence",
						        				flex: 1,
						        				editor: {
						        					xtype: "textfield"
						        				}
						        			}
						        		]
						        	}
						        ]
							},
							{
								xtype: "panel",
								border: 0,
								bodyPadding: 5,
								hidden: this.qmode != "servercall",
						        "layout": {
						            type: 'vbox',
						            align: 'stretch'  // Child items are stretched to full width
						        },
						        items: [
						        	{
						        		xtype: "fieldset",
						        		title: "Call function",
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
												fieldLabel: "Class Module",
												items: [
													{
														xtype: "textfield",
														flex: 1,
														readOnly: true,
														name: "jmodule"
													},
													{
														xtype: "button",
														text: "..",
														handler: function() {
															var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
																visibleItems: "workspace;folder;classmodule",
																u5x/*treeOptions*/: {
																	cubebrowse: true,
																	rootuid: "/BusinessProcess"
																},
																callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, function(item) {
																	if (item)
																	{
																		this.down("[name=jmodule]").setValue(item.name);
																		this.ritem._jmodule = item.uid;
																		this._l1/*loadModule*/();
																	}
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
								        		flex: 1,
								        		editable: false,
								        		fieldLabel: "Method",
								        		name: "jmethod",
								        		flex: 1,
								        		queryMode: "local",
								        		store: {
								        			xtype: "store",
								        			fields: ["name", "value"]
								        		},
								        		valueField: "value",
								        		displayField: "name"
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
		        	},
		        	scope: this
				}
			});
			
			IG$/*mainapp*/._IAc/*actionWizard*/.superclass.initComponent.apply(this, arguments);
		}
	});
}
IG$/*mainapp*/.iU0/*eventdata*/ = null;

if (window.Ext)
{
	IG$/*mainapp*/.__Ifd0/*dlg_select_action*/ = $s.extend($s.window, {
		
		modal: true,
		region:"center",
		"layout": "fit",
		closable: false,
		resizable:true,
		width: 550,
		height: 450,
		
		_1/*initApp*/: function() {
			var k,
				me = this,
				_9/*framecontent*/ = me._9/*framecontent*/,
				act,
				dp = [], sdp = [],
				grd_src = me.down("[name=grd_src]"),
				grd_tgt = me.down("[name=grd_tgt]"),
				ctrl = me.ctrl,
				actionlist = me.actionlist,
				t, i,
				muid = {};
				
			
				
			for (k in _9/*framecontent*/.events)
			{
				act = _9/*framecontent*/.events[k];
				t = {
					name: act.desc,
					uid: k,
					type: "action"
				};
				
				muid[k] = t;
				
				dp.push(t);
			}
			
			if (actionlist)
			{
				for (i=0; i < actionlist.length; i++)
				{
					if (muid[actionlist[i].uid])
					{
						sdp.push(muid[actionlist[i].uid]);
					}
				}
			}
			
			grd_src.store.loadData(dp);
			grd_tgt.store.loadData(sdp);
			grd_tgt.frc = null;
		},
		
		m1$9b/*confirmAppendAction*/: function() {
			var me = this,
				actionlist = me.actionlist,
				grd_tgt = me.down("[name=grd_tgt]"),
				i,
				rec;
				
			actionlist.splice(0, actionlist.length);
			
			for (i=0; i < grd_tgt.store.data.items.length; i++)
			{
				rec = grd_tgt.store.data.items[i];
				actionlist.push({
					name: rec.get("name"),
					uid: rec.get("uid")
				});
			}
			
			me.callback && me.callback.execute(me);
			
			me.close();
		},
		
		initComponent: function() {
			var me = this;
			
			me.title = IRm$/*resources*/.r1('L_EVENT_WIZARD');
			
			$s.apply(me, {
			
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
								xtype: "panel",
								flex: 1,
								border: 0,
								layout: {
									type: "hbox",
									align: "stretch"
								},
								items: [
									{
										xtype: "gridpanel",
										name: "grd_src",
										title: "All Actions",
										flex: 1,
										selType: "checkboxmodel",
										selModel: {
											checkSelector: ".x-grid-cell",
											mode: "MULTI"
										},
										store: {
											xtype: "store",
											fields: [
												"name", "description", "uid"
											]
										},
										columns: [
											{
												text: "Actin Name",
												dataIndex: "name",
												flex: 1
											},
											{
												text: "Description",
												dataIndex: "description",
												flex: 1
											}
										],
										tbar: [
											{
												xtype: "displayfield",
												value: "Check actions and register",
												height: 22
											}
										]
									},
									{
										xtype: "fieldcontainer",
										padding: 5,
										layout: {
											type: "vbox",
											pack: "center",
											padding: 5
										},
										items: [
											{
												xtype: "button",
												text: ">",
												handler: function() {
													var me = this,
														grd_src = me.down("[name=grd_src]"),
														grd_tgt = me.down("[name=grd_tgt]"),
														sel = grd_src.getSelectionModel().selected,
														i, rec;
														
													for (i=0; i < sel.length; i++)
													{
														rec = sel.items[i];
														grd_tgt.store.add(rec.data);
													}	
												},
												scope: this
											},
											{
												xtype: "container",
												height: 5
											},
											{
												xtype: "button",
												text: "<",
												handler: function() {
													var me = this,
														grd_src = me.down("[name=grd_src]"),
														grd_tgt = me.down("[name=grd_tgt]"),
														sel = grd_tgt.getSelectionModel().selected,
														i, rec;
														
													for (i=sel.length-1; i >=0; i--)
													{
														rec = sel.items[i];
														grd_tgt.store.remove(rec);
														if (grd_tgt.frc == rec)
														{
															grd_tgt.frc = null;
														}
													}	
												},
												scope: this
											}
										]
									},
									{
										xtype: "gridpanel",
										name: "grd_tgt",
										title: "Selected Actions",
										flex: 1,
										store: {
											xtype: "store",
											fields: [
												"name", "description", "uid"
											]
										},
										selType: "checkboxmodel",
										selModel: {
											checkSelector: ".x-grid-cell",
											mode: "MULTI"
										},
										columns: [
											{
												text: "Actin Name",
												dataIndex: "name",
												flex: 1
											},
											{
												text: "Description",
												dataIndex: "description",
												flex: 1
											}
										],
										listeners: {
											cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eopts) {
												var me = this,
													grd_tgt = me.down("[name=grd_tgt]");
												grd_tgt.frc = record;
											},
											scope: this
										},
										tbar: [
											{
												xtype: "button",
												text: "Go Up",
												handler: function() {
													var me = this,
														grd_tgt = me.down("[name=grd_tgt]"),
														i,
														n;
														
													if (grd_tgt.frc)
													{
														n = grd_tgt.store.indexOf(grd_tgt.frc);
														
														if (n > 0)
														{
															grd_tgt.store.remove(grd_tgt.frc);
															grd_tgt.store.insert(n-1, grd_tgt.frc);
														}
													}
												},
												scope: this
											},
											{
												xtype: "button",
												text: "Go Down",
												handler: function() {
													var me = this,
														grd_tgt = me.down("[name=grd_tgt]"),
														i,
														n;
														
													if (grd_tgt.frc)
													{
														n = grd_tgt.store.indexOf(grd_tgt.frc);
														
														if (n > -1 && n < grd_tgt.store.data.items.length - 1)
														{
															grd_tgt.store.remove(grd_tgt.frc);
															grd_tgt.store.insert(n+1, grd_tgt.frc);
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
					}
				],
				buttons:[
					"->",
					{
						text: IRm$/*resources*/.r1("B_CONFIRM"),
						handler: function() {
							this.m1$9b/*confirmAppendAction*/();
						},
						scope: me
					}, 
					{
						text: IRm$/*resources*/.r1("B_CANCEL"),
						handler:function() {
							this.close();
						},
						scope: me
					}
				]
			});
			
			IG$/*mainapp*/.__Ifd0/*dlg_select_action*/.superclass.initComponent.apply(this, arguments);
		},
		listeners: {
			afterrender: function(tobj) {
				this._1/*initApp*/();
			}
		}
	});
}

IG$/*mainapp*/.$Ifd/*dashboard_shared*/ = IG$/*mainapp*/.$Ifd/*dashboard_shared*/ || {};

IG$/*mainapp*/.$Ifd/*dashboard_shared*/._l17/*getActionLabel*/ = function(evt) {
	var i, j,
		me = this,
		r = "",
		m = "",
		desc = "",
		purpose = evt.purpose,
		eventdata = IG$/*mainapp*/.iU0/*eventdata*/;
	
	for (i=0; i < eventdata.length; i++)
	{
		if (eventdata[i].purpose == purpose)
		{
			m = eventdata[i].desc;
			break;
		}
	}
	
	r = "(" + evt.name + ":" + m + ")";
	
	switch (purpose)
	{
	case "onlinereport":
		if (evt.item && evt.item.uid)
		{
			for (j=0; j < me._9/*framecontent*/.dashboardreport.length; j++)
			{
				if (me._9/*framecontent*/.dashboardreport[j].uid == evt.item.uid)
				{
					desc = me._9/*framecontent*/.dashboardreport[j].name;
					break;
				}
			}
		}
		break;
	case "export":
		break;
	case "valuelist":
		desc = "";
		break;
	case "execute_script":
		desc = evt.script;
		break;
	case "servercall":
		desc = evt.jmethod + ":" + evt.jmodule_name + ")";
		break;
	}
	
	if (desc)
	{
		r = "*" + desc + " " + r;
	}
	
	return r;
}

if (window.Ext)
{
	IG$/*mainapp*/.__Ifd/*dlg_new_action*/ = $s.extend($s.window, {
		
		modal: true,
		region:"center",
		"layout": "fit",
		closable: false,
		resizable:true,
		width: 600,
		height: 500,
		
		_l11/*editActionList*/: function() {
			var me = this,
				dp = [],
				caction = me.caction,
				actionname = me.down("[name=actionname]");
							
			actionname.setValue(me.caction.desc || me.caction.name);
			
			me._l16/*validateActionEvent*/();
		},
		
		_l15/*appendActionEvent*/: function() {
			var me = this,
				purpose = me.down("[name=purpose]").getValue();
			
			if (!purpose || purpose == "")
			{
				return;
			}
			
			var ev = new IG$/*mainapp*/._ID0/*frameEvents*/(null);
			ev.type = purpose;
			ev.purpose = purpose;
			
			me.caction.actionlist.push(ev);
			
			me._l18/*setHandlerDetail*/(ev);
		},
		
		_l18/*setHandlerDetail*/: function(ritem) {
			var me = this,
				dlg,
				_9/*framecontent*/ = me._9/*framecontent*/,
				uitem = null,
				i;
				
			me.citem = null;
				
			for (i=0; i < me.caction.actionlist.length; i++)
			{
				if (me.caction.actionlist[i].uid == ritem.uid)
				{
					uitem = me.caction.actionlist[i];
					break;
				}
			}
			
			dlg = new IG$/*mainapp*/._IAc/*actionWizard*/({
				_9/*framecontent*/: _9/*framecontent*/, 
				ritem: uitem,
				qmode: ritem.purpose,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.fV5/*updateHandlerDetail*/)
			});
			
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
		},
		
		fV5/*updateHandlerDetail*/: function() {
			var me = this;
			me._l16/*validateActionEvent*/();
		},
		
		_l17/*getActionLabel*/: IG$/*mainapp*/.$Ifd/*dashboard_shared*/._l17/*getActionLabel*/,
		
		_l16/*validateActionEvent*/: function() {
			var me = this,
				dp = [],
				i, j,
				item,
				evt,
				cactionlist = me.down("[name=cactionlist]");
				
			for (i=0; i < me.caction.actionlist.length; i++)
			{
				evt = me.caction.actionlist[i];
				evt.uid = "action_" + i;
				item = {
					name: evt.name,
					aname: me._l17/*getActionLabel*/(evt), 
					type: evt.purpose,
					uid: evt.uid
				};
				
				item.name = item.name || item.aname;
	
				dp.push(item);
			}
			
			cactionlist.store.loadData(dp);
	
			if (me.citem)
			{
				me._l18/*setHandlerDetail*/.call(me, me.citem);
			}
		},
		
		m1$9b/*confirmAppendAction*/: function() {
			var me = this,
				actionname = me.down("[name=actionname]"),
				evdesc = actionname.getValue(),
				_9/*framecontent*/ = me._9/*framecontent*/,
				actionid = me.caction.name,
				cactionlist = me.down("[name=cactionlist]"),
				citems = {},
				i,
				rec;
			
			if (evdesc == "")
			{
				return;
			}
			
			for (i=0; i < me.caction.actionlist.length; i++)
			{
				citems[me.caction.actionlist[i].uid] = me.caction.actionlist[i];
			}
			
			me.caction.actionlist = [];
			
			for (i=0; i < cactionlist.store.data.items.length; i++)
			{
				rec = cactionlist.store.data.items[i];
				
				if (citems[rec.get("uid")])
				{
					me.caction.actionlist.push(citems[rec.get("uid")]);
				}
			}
			
			me.caction.desc = evdesc;
			_9/*framecontent*/.events[actionid] = me.caction;
			
			me.callback && me.callback.execute();
			
			me.close();
		},
		
		m1/*moveGridItem*/: function(inc) {
			var me = this,
				cactionlist = me.down("[name=cactionlist]"),
				sel = cactionlist.getSelectionModel().selected,
				rec,
				si;
				
			if (sel && sel.length > 0)
			{
				rec = sel.items[0];
				si = cactionlist.store.indexOf(rec);
				if (inc == -1 && si > 0)
				{
					cactionlist.store.remove(rec);
					cactionlist.store.insert(si-1, rec);
				}
				else if (inc == 1 && si+1 < cactionlist.store.data.items.length)
				{
					cactionlist.store.remove(rec);
					cactionlist.store.insert(si+1, rec);
				}
			}
		},
		
		initComponent: function() {
			var me = this;
	
			me.title = IRm$/*resources*/.r1('L_EVENT_WIZARD');
			
			$s.apply(me, {
			
				items: [
					{
						xtype: "form",
						border: 0,
						bodyPadding: 5,
						fieldDefaults: {
					        labelWidth: 100,
					        anchor: '100%'
					    },
					    "layout": {
					        type: 'vbox',
					        align: 'stretch'  // Child items are stretched to full width
					    },
					
						items: [
							{
								xtype: "textfield",
								fieldLabel: "Action name",
								name: "actionname"
							},
							{
								xtype: 'fieldcontainer',
					    		fieldLabel: 'Add Action',
					    		labelStyle: 'font-weight:bold',
					    		"layout": 'hbox',
					    		defaultType: 'textfield',
					    		items: [
									{
										xtype: "combo",
										name: "purpose",
										store: {
											xtype: "store",
							                fields: [
							                	"purpose", "desc"
							                ],
							                data: IG$/*mainapp*/.iU0/*eventdata*/
							            },
							            displayField: "desc",
							            valueField: "purpose",
							            editable: false,
							            queryMode: "local",
							            selectOnTab: false
									},
									{
										xtype: "button",
										text: "Append",
										handler: function() {
											this._l15/*appendActionEvent*/();
										},
										scope: me
									}
								]
							},
							{
								xtype: "grid",
								flex: 1,
								tbar: [
									{
										xtype: "button",
										text: "Up",
										handler: function() {
											this.m1/*moveGridItem*/(-1);
										},
										scope: this
									},
									{
										xtype: "button",
										text: "Down",
										handler: function() {
											this.m1/*moveGridItem*/(1);
										},
										scope: this
									}
								],
								store: {
									fields: [
										"name", "type", "uid", "desc", "delete", "aname"
									]
								},
								name: "cactionlist",
								columns: [
									{
										text: IRm$/*resources*/.r1('B_NAME'),
										width: 120,
										sortable: false,
										dataIndex: 'name'
									},
									{
										text: "Action type",
										sortable: false,
										dataIndex: "aname",
										flex: 1
									},
	//								{
	//									text: IRm$/*resources*/.r1('B_DESC'),
	//									flex: 1,
	//									sortable: false,
	//									dataIndex: 'desc'
	//								},
									{
										xtype: 'actioncolumn',
										width: 50,
										items: [
											{
												// icon: './images/brick.png',
												iconCls: "icon-grid-config",
												tooltip: 'Edit',
												handler: function (grid, rowIndex, colIndex) {
													var rec = grid.store.getAt(rowIndex),
														ritem = me.caction.actionlist[rowIndex];
													
													me._l18/*setHandlerDetail*/.call(me, ritem);
												}
											},
											{
												// icon: './images/delete.png',
												iconCls: "icon-grid-delete",
												tooltip: 'Delete item',
												handler: function (grid, rowIndex, colIndex) {
													var rec = grid.store.getAt(rowIndex);
													me.caction.actionlist.splice(rowIndex, 1);
													grid.store.remove(rec);
												}
											}
										]
									}
								],
								viewConfig: {
									stripeRows: true
								},
								listeners: {
									itemdblclick: function(grid, record, item, index, e, eOpts) {
										var rec = grid.store.getAt(index),
											ritem = me.caction.actionlist[index];
										
										me._l18/*setHandlerDetail*/.call(me, ritem);
									}
								}
							}
						]
					}
				],
				buttons:[
					"->",
					{
						text: IRm$/*resources*/.r1("B_CONFIRM"),
						handler: function() {
							this.m1$9b/*confirmAppendAction*/();
						},
						scope: me
					}, 
					{
						text: IRm$/*resources*/.r1("B_CANCEL"),
						handler:function() {
							this.close();
						},
						scope: me
					}
				]
			});
			
			IG$/*mainapp*/.__Ifd/*dlg_new_action*/.superclass.initComponent.apply(this, arguments);
		},
		listeners: {
			afterrender: function(tobj) {
				this._l11/*editActionList*/();
			}
		}
	});
}

if (window.Ext)
{
	IG$/*mainapp*/._Ifd/*layoutWizard*/ = $s.extend($s.panel, {
		layout: "fit",
		border: 0,
		
		_l19/*removeMappedEvent*/: function(ctrlname, evname) {
			var me = this,
				_9/*framecontent*/ = me._9/*framecontent*/,
				ctrl;
				
			if (evname == "onload" || evname == "ontimer")
			{
				ctrl = _9/*framecontent*/._l21/*applicationactions*/;
				
				ctrl[evname] = null;
			}
			else
			{
				ctrl = _9/*framecontent*/.controls[ctrlname];
				
				if (ctrl)
				{
					ctrl.actionlist[evname] = null;
				}
			}
		},
		
		_gl/*updateAction*/: function(p, actionlist) {
			var me = this,
				_9/*framecontent*/ = me._9/*framecontent*/,
				i,
				ev;
				
			for (i=0; i < actionlist.length; i++)
			{
				ev = _9/*framecontent*/.events[actionlist[i].uid];
				if (ev)
				{
					p.action = (i == 0) ? ev.name : p.action + "," + ev.name;
					p.actiondesc = (i == 0) ? ev.desc : p.actiondesc + "," + ev.desc;
				}
			}
		},
		
		_l17/*getActionLabel*/: IG$/*mainapp*/.$Ifd/*dashboard_shared*/._l17/*getActionLabel*/,
		
		_e1/*editActionItem*/: function(citem) {
			var me = this,
				p_grd_inp = me.down("[name=p_grd_inp]"),
				p_grd_out = me.down("[name=p_grd_out]"),
				i, n,
				iparams = [],
				oparams = [];
			
			me._c1/*commitParams*/();
			
			p_grd_inp.store.loadData([]);
			p_grd_out.store.loadData([]);
			
			if (citem.purpose == "servercall" || citem.purpose == "open_win")
			{
				me._e2/*loadServerCall*/(citem);
			}
			else
			{
				if (citem.s_iparams)
				{
					for (i=0; i < citem.s_iparams.length; i++)
					{
						n = citem.s_iparams[i].name;
						iparams.push({
							name: n,
							map_param: citem.iparams && citem.iparams[n] ? citem.iparams[n].map_param : null,
							map_type: citem.iparams && citem.iparams[n] ? citem.iparams[n].map_type : null
						});
					}
				}
				
				if (citem.s_oparams)
				{
					for (i=0; i < citem.s_oparams.length; i++)
					{
						n = citem.s_oparams[i].name;
						oparams.push({
							name: n,
							map_param: citem.oparams && citem.oparams[n] ? citem.oparams[n].map_param : null,
							map_type: citem.oparams && citem.oparams[n] ? citem.oparams[n].map_type : null
						});
					}
				}
				
				p_grd_inp.store.loadData(iparams);
				p_grd_out.store.loadData(oparams);
			}
			
			me._c1d/*commitData*/ = citem;
		},
		
		_c1/*commitParams*/: function() {
			var me = this,
				citem = me._c1d/*commitData*/,
				p_grd_inp = me.down("[name=p_grd_inp]"),
				p_grd_out = me.down("[name=p_grd_out]"),
				rec,
				i;
			
			if (citem)
			{
				citem.iparams = {};
				citem.oparams = {};
				
				citem.s_iparams = [];
				citem.s_oparams = [];
				
				for (i=0; i < p_grd_inp.store.data.items.length; i++)
				{
					rec = p_grd_inp.store.data.items[i];
					
					if (rec.get("map_param"))
					{
						citem.iparams[rec.get("name")] = {
							name: rec.get("name"),
							map_param: rec.get("map_param"),
							map_type: rec.get("map_type")
						};
					}
					
					if (rec.get("name"))
					{
						citem.s_iparams.push({
							name: rec.get("name"),
							type: rec.get("type")
						});
					}
				}
				
				for (i=0; i < p_grd_out.store.data.items.length; i++)
				{
					rec = p_grd_out.store.data.items[i];
					
					if (rec.get("map_param"))
					{
						citem.oparams[rec.get("name")] = {
							name: rec.get("name"),
							map_param: rec.get("map_param"),
							map_type: rec.get("map_type")
						};
					}
					
					if (rec.get("name"))
					{
						citem.s_oparams.push({
							name: rec.get("name"),
							type: rec.get("type")
						});
					}
				}
				
				me._c1d/*commitData*/ = null;
			}
		},
		
		_e2/*loadServerCall*/: function(citem) {
			var me = this,
				req,
				p_grd_inp = me.down("[name=p_grd_inp]"),
				p_grd_out = me.down("[name=p_grd_out]"),
				purpose = citem.purpose,
				_servercall = "servercall",
				_open_win = "open_win",
				ruid = (purpose == _servercall) ? citem.jmodule : citem.item.uid;
			
			me._c1/*commitParams*/();
			
			p_grd_inp.store.loadData([]);
			p_grd_out.store.loadData([]);
			
			if (!ruid)
			{
				return;
			}
				
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "5",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: ruid}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'standard'})
		        }, me, function(xdoc) {
					var cmodule = (purpose == _servercall ? new IG$/*mainapp*/.ifg/*classmodule*/(xdoc) : null),
						i,
						m,
						iparams = [],
						oparams = [],
						n,
						tnode, tnodes, ct;
					
					if (purpose == _servercall)
					{
						for (i=0; i < cmodule.modules.length; i++)
						{
							if (cmodule.modules[i].name == citem.jmethod)
							{
								m = cmodule.modules[i];
								break;
							}
						}
						
						if (m != null)
						{
							for (i=0; i < m.iparams.length; i++)
							{
								n = m.iparams[i].name;
								iparams.push({
									name: n,
									map_param: citem.iparams && citem.iparams[n] ? citem.iparams[n].map_param : null,
									map_type: citem.iparams && citem.iparams[n] ? citem.iparams[n].map_type : null
								});
							}
							
							for (i=0; i < m.oparams.length; i++)
							{
								n = m.oparams[i].name;
								oparams.push({
									name: n,
									map_param: citem.oparams && citem.oparams[n] ? citem.oparams[n].map_param : null,
									map_type: citem.oparams && citem.oparams[n] ? citem.oparams[n].map_type : null
								});
							}
							
							me._c1d/*commitData*/ = citem;
						}
					}
					else
					{
						tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/page_params");
						tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null;
						
						if (tnodes)
						{
							for (i=0; i < tnodes.length; i++)
							{
								ct = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "type");
								if (ct == "var")
								{
									n = IG$/*mainapp*/._I1a/*getSubNodeText*/(tnodes[i], "name");
									iparams.push({
										name: n,
										map_param: citem.iparams && citem.iparams[n] ? citem.iparams[n].map_param : null,
										map_type: citem.iparams && citem.iparams[n] ? citem.iparams[n].map_type : null
									});
									
									oparams.push({
										name: n,
										map_param: citem.oparams && citem.oparams[n] ? citem.oparams[n].map_param : null,
										map_type: citem.oparams && citem.oparams[n] ? citem.oparams[n].map_type : null
									});
								}
							}
						}
					}
					
					p_grd_inp.store.loadData(iparams);
					p_grd_out.store.loadData(oparams);
				}, false);
			req._l/*request*/();
		},
		
		_IFe/*initF*/: function() {
			var me = this,
				_9/*framecontent*/ = me._9/*framecontent*/,
				events = _9/*framecontent*/.events,
				g_actions = me.down("[name=g_actions]"),
				controllist = me.down("[name=controllist]"),
				
				k, n, t,
				dp = [],
				mdp = [],
				ai, act,
				r, j, lobj, actname, evtname,
				aguide, ctrl,
				p, dip;
				
			for (k in _9/*framecontent*/.events)
			{
				act = _9/*framecontent*/.events[k];
				t = {
					name: act.desc,
					uid: k,
					leaf: false,
					type: "action",
					
					children: []
				};
				
				dp.push(t);
				
				for (n=0; n < act.actionlist.length; n++)
				{
					ai = act.actionlist[n];
					ai.seq = n;
					t.children.push({
						name: me._l17/*getActionLabel*/(ai),
						type: "actionitem",
						uid: k,
						seq: n,
						leaf: true
					});
				}
			}
			
			r = {
				name: "Actions",
				children: dp,
				expanded: true
			};
			
			g_actions.store.setRootNode(r);
			
			me.s1/*setParamEnable*/(false);
			
			var onloadaction = {name: "OnLoad Action", type: "onloadevents", event: "onload", action: "", actiondesc: ""},
				timeraction = {name: "Timer Action", type: "timerevents", event: "ontimer", action: "", actiondesc: ""};
			
			_9/*framecontent*/._l21/*applicationactions*/.onload = _9/*framecontent*/._l21/*applicationactions*/.onload || [];
			_9/*framecontent*/._l21/*applicationactions*/.ontimer = _9/*framecontent*/._l21/*applicationactions*/.ontimer || [];
					
			actname = _9/*framecontent*/._l21/*applicationactions*/.onload;
			me._gl/*updateAction*/(onloadaction, actname);
			
			actname = _9/*framecontent*/._l21/*applicationactions*/.ontimer;
			me._gl/*updateAction*/(timeraction, actname);
	
			mdp.push(onloadaction);
			mdp.push(timeraction);
			
			for (k in _9/*framecontent*/.controls)
			{
				ctrl = _9/*framecontent*/.controls[k];
					
				if (ctrl && IG$/*mainapp*/._IE0/*controls*/[ctrl.type] && IG$/*mainapp*/._IE0/*controls*/[ctrl.type].p)
				{
					p = IG$/*mainapp*/._IE0/*controls*/[ctrl.type].p;
					dip = [];
					
					for (j=0; j < p.length; j++)
					{
						if (p[j].type == "event")
						{
							lobj = {name: ctrl.name, type: ctrl.type, event: p[j].name, action: ""};
							actname = p[j].name;
							ctrl.actionlist[actname] = ctrl.actionlist[actname] || [];
							evtname = ctrl.actionlist[actname];
							me._gl/*updateAction*/(lobj, evtname);
							dip.push(lobj);
						}
					}
					
					for (j=0; j < dip.length; j++)
					{
						mdp.push(dip[j]);
					}
				}
			}
			
			controllist.store.loadData(mdp);
			
			me.u/*updatePageParam*/();
		},
		
		u/*updatePageParam*/: function() {
			var me = this,
				grd_pparam = me.down("[name=grd_pparam]"),
				dp = [],
				_9/*framecontent*/ = me._9/*framecontent*/,
				pparam = _9/*framecontent*/.page_params,
				i,
				ctrl;
			
			for (i=0; i < pparam.length; i++)
			{
				if (pparam[i].type == "var")
				{
					dp.push({
						name: pparam[i].name,
						defvalue: pparam[i].defvalue,
						type: pparam[i].type || "var",
						ctrltype: pparam[i].ctrltype
					});
				}
			}
			
			for (k in _9/*framecontent*/.controls)
			{
				ctrl = _9/*framecontent*/.controls[k];
				dp.push({
					name: k,
					type: "ctrl",
					defvalue: "",
					ctrltype: ctrl.type
				});
			}
			grd_pparam.store.loadData(dp);
		},
		
		commitCode: function() {
			return true;
		},
		
		refreshCode: function() {
			var me = this;
			
			me._IFe/*initF*/();
		},
		
		_l14/*updateActionCombo*/: function() {
			var me = this,
				key,
				act,
				dp = [];
				
			for (key in me._9/*framecontent*/.events)
			{
				act = me._9/*framecontent*/.events[key];
				
				dp.push({name: act.desc, value: key});
			} 
			
			me._l20/*_actcombo*/ && me._l20/*_actcombo*/.loadData(dp);
		},
		
		_f1/*commitChanges*/: function() {
			var me = this,
				_9/*framecontent*/ = me._9/*framecontent*/,
				grd_pparam = me.down("[name=grd_pparam]"),
				i,
				pvar,
				rec;
			
			_9/*framecontent*/.page_params = [];
			_9/*framecontent*/.page_param_map = {};
			
			for (i=0; i < grd_pparam.store.data.items.length; i++)
			{
				rec = grd_pparam.store.data.items[i];
				
				if (rec.get("name"))
				{
					pvar = new IG$/*mainapp*/.p_g1/*pageparameter*/(rec.get("name"), rec.get("defvalue"));
					pvar.type = rec.get("type") || "var";
					pvar.ctrltype = rec.get("ctrltype");
					
					_9/*framecontent*/.page_params.push(pvar);
					_9/*framecontent*/.page_param_map[pvar.name] = pvar;
				}
			}
			
			this._c1/*commitParams*/();
		},
		
		_t$/*toolbarHandler*/: function(cmd) {
			var me = this,
				_9/*framecontent*/ = me._9/*framecontent*/,
				actionid,
				dlg,
				grd_pparam;
			
			switch (cmd)
			{
			case "cmd_new_action":
				actionid = "action_" + _9/*framecontent*/.eventseq;
				_9/*framecontent*/.eventseq++;
				dlg = new IG$/*mainapp*/.__Ifd/*dlg_new_action*/({
					_9/*framecontent*/: _9/*framecontent*/,
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
						var me = this;
						me._IFe/*initF*/();
						me._l14/*updateActionCombo*/();
					}),
					caction: {
						name: actionid, 
						desc: "", actionlist: []
					}
				});
				IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
				break;
			case "cmd_new_param":
				grd_pparam = me.down("[name=grd_pparam]");
				grd_pparam.store.add({
					name: "",
					value: "",
					type: "var"
				});
				break;
			}
		},
		
		_g1/*showActionSelect*/: function(rec, ctrlname, evname) {
			var me = this,
				pop,
				_9/*framecontent*/ = me._9/*framecontent*/,
				ctrls = _9/*framecontent*/.controls,
				ctrl,
				actionlist;
			
			if (evname == "onload" || evname == "ontimer")
			{
				ctrl = _9/*framecontent*/._l21/*applicationactions*/;
				ctrl[evname] = ctrl[evname] || [];
				actionlist = ctrl[evname];
			}
			else
			{
				ctrl = ctrls[ctrlname];
				ctrl.actionlist[evname] = ctrl.actionlist[evname] || [];
				actionlist = ctrl.actionlist[evname];
			}
			
			pop = new IG$/*mainapp*/.__Ifd0/*dlg_select_action*/({
				_9/*framecontent*/: me._9/*framecontent*/,
				ctrl: ctrl, 
				actionlist: actionlist,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(dlg) {
					var aval = ""
						adesc = "",
						i;
					for (i=0; i < actionlist.length; i++)
					{
						aval = (i == 0) ? actionlist[i].uid : aval + "," + actionlist[i].uid;
						adesc = (i == 0) ? actionlist[i].name : adesc + "," + actionlist[i].name;
					}
					rec.set("action", aval);
					rec.set("actiondesc", adesc);
				})
			});
			
			IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
		},
		
		s1/*setParamEnable*/: function(enable) {
			var me = this,
				p_param = me.down("[name=p_param]"),
				p_grd_inp = me.down("[name=p_grd_inp]"),
				p_grd_out = me.down("[name=p_grd_out]");
				
			p_param.setDisabled(!enable);
			
			if (!enable)
			{
				p_grd_inp.store.loadData([]);
				p_grd_out.store.loadData([]);
			}
		},
		
		initComponent : function() {
			var me = this,
				f_bdrop,
				f_drop;
				
			if (!IG$/*mainapp*/.iU0/*eventdata*/)
			{
				IG$/*mainapp*/.iU0/*eventdata*/ = [
				    {purpose: "onlinereport", desc: IRm$/*resources*/.r1('L_P_onlinereport')},
				    {purpose: "valuelist", desc: IRm$/*resources*/.r1('L_P_valuelist')},
				    {purpose: "sql", desc: IRm$/*resources*/.r1('L_P_sql')},
				    {purpose: "execute_script", desc: IRm$/*resources*/.r1('L_P_execute_script')},
				    {purpose: "open_win", desc: IRm$/*resources*/.r1('L_P_open_win')},
				    {purpose: "open_dlg", desc: IRm$/*resources*/.r1('L_P_open_dlg')},
				    {purpose: "export", desc: IRm$/*resources*/.r1('L_P_export')},
				    {purpose: "servercall", desc: IRm$/*resources*/.r1('L_P_inv_svc')},
				    {purpose: "close", desc: IRm$/*resources*/.r1('L_P_cls')}
				];
			}
			
			f_bdrop = function(node, data, dropRec, dropPosition, dropFunction) {
				var r = false,
					rc,
					i, k,
					vname,
					rec = data.records && data.records.length > 0 ? data.records[0] : null;
					
				// (this == data.view) ? data.copy = false : data.copy = true;
				vname = data.view.ownerCt.name;
				
				if (vname == "grd_pparam" && rec && dropRec)
				{
					dropRec.set("map_param", rec.get("name"));
					dropRec.set("map_type", rec.get("type"));
				}
				
				return r;
			};
			
			f_drop = function(node, data, dropRec, dropPosition) {
				var sc = false;				
				return sc;
			};
			
			$s.apply(me, {
				items: [
					{
						xtype: "panel",
						layout: "border",
						border: 0,
						tbar: [
							{
								xtype: "button",
								text: "New Action",
								handler: function() {
									this._t$/*toolbarHandler*/("cmd_new_action");
								},
								scope: me
							},
							{
								xtype: "button",
								text: "New Parameter",
								handler: function() {
									this._t$/*toolbarHandler*/("cmd_new_param");
								},
								scope: me
							}
						],
						items: [
							{
								xtype: "treepanel",
								region: "center",
								name: "g_actions",
								title: "Actions",
								flex: 1,
								store: {
									xtype: 'treestore',
									fields: [
										"name", "uid", "type", "seq"
									]
								},
								
								columns: [
									{
										xtype: "treecolumn",
										flex: 1,
										text: "Name",
										dataIndex: "name"
									},
									{
										xtype: "actioncolumn",
										width: 50,
										items: [
											{
												iconCls: "icon-grid-config",
												tooltip: "Edit Action",
												handler: function (grid, rowIndex, colIndex) {
													var me = this,
														rec = grid.store.getAt(rowIndex),
														caction = me._9/*framecontent*/.events[rec.get("uid")],
														dlg,
														citem, seq, i;
													
													var seq = rec.get("seq"),
														citem,
														i;
													
													if (rec.get("type") == "actionitem")
													{
														seq = rec.get("seq");
														for (i=0; i < caction.actionlist.length; i++)
														{
															if (caction.actionlist[i].seq == seq)
															{
																citem = caction.actionlist[i];
																break;
															}
														}
													}
	
													// if (rec.get("type") == "action")
													// {
													dlg = new IG$/*mainapp*/.__Ifd/*dlg_new_action*/({
														_9/*framecontent*/: me._9/*framecontent*/,
														callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
															var me = this;
															me._IFe/*initF*/();
															me._l14/*updateActionCombo*/();
														}),
														caction: caction,
														citem: citem
													});
													
													IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
													// }
	
													// else if (rec.get("type") == "actionitem")
													// {
													// 	var seq = rec.get("seq"),
													// 		citem,
													// 		i;
														
													// 	for (i=0; i < caction.actionlist.length; i++)
													// 	{
													// 		if (caction.actionlist[i].seq == seq)
													// 		{
													// 			citem = caction.actionlist[i];
													// 			break;
													// 		}
													// 	}
														
													// 	if (citem)
													// 	{
													// 		me._e1/*editActionItem*/(citem);
													// 	}
													// }
												},
												scope: me
											},
											{
												iconCls: "icon-grid-delete",
												tooltip: "Delete Action",
												handler: function (grid, rowIndex, colIndex) {
													var me = this,
														rec = grid.store.getAt(rowIndex),
														k = rec.get("uid"),
														act;
													
													if (rec.get("type") == "action")
													{
														me.s1/*setParamEnable*/(false);
														IG$/*mainapp*/._I55/*confirmMessages*/(null, null, function(dlg){
															if (dlg == "yes")
															{
																grid.store.removeAt(rowIndex);
																delete me._9/*framecontent*/.events[k];
																me._l14/*updateActionCombo*/.call(me);
															}
														}, me, me);
													}
													else if (rec.get("type") == "actionitem")
													{
														me.s1/*setParamEnable*/(true);
														grid.store.removeAt(rowIndex);
														act = me._9/*framecontent*/.events[k];
														act.actionlist.splice(rec.get("seq"), 1);	
													}
												},
												scope: this
											}
										]
									}
								],
								listeners: {
									// cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
									itemclick: function(tobj, record, item, rowIndex, e, eOpts) {
										var me = this,
											caction;
										
										caction = me._9/*framecontent*/.events[record.get("uid")];
	
										if (record.get("type") == "action")
										{
											record.expand();
											
											if (caction)
											{
												dlg = new IG$/*mainapp*/.__Ifd/*dlg_new_action*/({
													_9/*framecontent*/: me._9/*framecontent*/,
													callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
														var me = this;
														me._IFe/*initF*/();
														me._l14/*updateActionCombo*/();
													}),
													caction: caction
												});
												
												IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
											}
										}
										else if (record.get("type") == "actionitem")
										{
											me.s1/*setParamEnable*/(true);
	
											if (caction)
											{
												var seq = record.get("seq"),
													citem,
													i;
												
												for (i=0; i < caction.actionlist.length; i++)
												{
													if (caction.actionlist[i].seq == seq)
													{
														citem = caction.actionlist[i];
														break;
													}
												}
												
												if (citem)
												{
													me._e1/*editActionItem*/(citem);
												}
											}
										}
									},
									scope: me
								}
							},
							{
								xtype: "gridpanel",
								region: "east",
								title: "Binded Controls",
								name: "controllist",
								flex: 1,
								store: {
									fields: [
										"name", "type", "event", "action", "actiondesc"
									]
								},
								stateful: true,
								height: 120,
								plugins: [
									{
										ptype: "cellediting",
										clicksToEdit: 1
									}
								],
								viewConfig: {
									stripeRows: true
								},
								columns: [
									{
										text: IRm$/*resources*/.r1('B_NAME'),
										flex: 1,
										sortable: false,
										dataIndex: 'name',
										editable: false,
										minWidth: 120
									},
									{
										text: IRm$/*resources*/.r1('B_TYPE'),
										flex: 1,
										sortable: false,
										dataIndex: 'type',
										editable: false,
										minWidth: 80
									},
									{
										text: IRm$/*resources*/.r1('B_TYPE'),
										flex: 1,
										sortable: false,
										dataIndex: 'event',
										editable: false,
										minWidth: 80
									},
									{
								    	xtype: 'gridcolumn',
								    	width: 120,
								    	text: 'Action',
								    	dataIndex: 'actiondesc'
								    },
									{
										xtype: 'actioncolumn',
										width: 50,
										editable: false,
										items: [
											{
												iconCls: "icon-grid-config",
												tooltip: 'Bind Event',
												handler: function (grid, rowIndex, colIndex) {
													var rec = grid.store.getAt(rowIndex),
														ctrlname = rec.get("name"),
														evname = rec.get("event");
														
													me._g1/*showActionSelect*/(rec, ctrlname, evname);
												}
											},
											{
												// icon: './images/delete.png',
												iconCls: "icon-grid-delete",
												tooltip: 'Delete item',
												handler: function (grid, rowIndex, colIndex) {
													var rec = grid.store.getAt(rowIndex),
														ctrlname = rec.get("name"),
														evname = rec.get("event");
													
													me._l19/*removeMappedEvent*/.call(me, ctrlname, evname);
													rec.set("action", "");
													rec.set("actiondesc", "");
												}
											}
										]
									}
								],
								listeners: {
									cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eopts) {
										if (cellIndex == 2)
										{
											var me = this,
												rec = record,
												ctrlname = rec.get("name"),
												evname = rec.get("event");
												
											me._g1/*showActionSelect*/(rec, ctrlname, evname);
										}
									},
									scope: this
								}
							},
							{
								xtype: "panel",
								region: "south",
								flex: 1,
								collapsible: false,
								collapseMode: "mini",
								hideCollapseTool: true,
								header: 0,
								layout: {
									type: "hbox",
									align: "stretch"
								},
								items: [
									{
										xtype: "gridpanel",
										name: "grd_pparam",
										title: "Page Parameters",
										
										flex: 1,
										selType: "checkboxmodel",
										selModel: {
											checkSelector: ".x-grid-cell",
											mode: "MULTIPLE"
										},
										store: {
											xtype: "store",
											fields: ["name", "defvalue", "type", "ctrltype"]
										},
										enableDD: true,
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
													dragGroup: "_I$RD_G_"
												}
											],
											listeners: {
												beforedrop: f_bdrop,
												drop: f_drop
											}
									    },
										columns: [
											{
												text: "Type",
												dataIndex: "type",
												width: 50
											},
											{
												text: "Name",
												flex: 1,
												dataIndex: "name",
												editor: {
													xtype: "textfield",
													allowBlank: false
												}
											},
											{
												text: "Default Value",
												flex: 1,
												dataIndex: "defvalue",
												editor: {
													xtype: "textfield",
													allowBlank: true
												}
											},
											{
												xtype: "actioncolumn",
												width: 30,
												items: [
													{
														iconCls: "icon-grid-delete",
														tooltip: "Delete Action",
														handler: function (grid, rowIndex, colIndex) {
															var me = this,
																rec = grid.store.getAt(rowIndex);
																
															if (rec.get("type") == "var")
															{
																grid.store.removeAt(rowIndex);
															}
														},
														scope: this
													}
												]
											}
										]
									},
									{
										xtype: "panel",
										name: "p_param",
										disabled: true,
										flex: 1,
										layout: {
											type: "vbox",
											align: "stretch"
										},
										items: [
											{
												xtype: "gridpanel",
												name: "p_grd_inp",
												title: "Input parameter",
												emptyText: "No Action Item selected or no Input parameter",
												flex: 1,
												selType: "checkboxmodel",
												selModel: {
													checkSelector: ".x-grid-cell",
													mode: "MULTIPLE"
												},
												store: {
													xtype: "store",
													fields: ["name", "map_param", "map_type", "type"]
												},
												tbar: [
											    	{
											    		text: "Add",
											    		handler: function() {
											    			var grd = this.down("[name=p_grd_inp]");
											    			
											    			grd.store.add({
											    				name: "",
											    				map_param: "",
											    				map_type: "",
											    				type: "custom"
											    			});
											    		},
											    		scope: this
											    	},
											    	{
											    		text: "Remove",
											    		handler: function() {
											    		},
											    		scope: this
											    	}
											    ],
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
															ddGroup: "_I$RD_G_"
														}
													],
													listeners: {
														beforedrop: f_bdrop,
														drop: f_drop
													}
													
											    },
												columns: [
													{
														text: "Name",
														flex: 1,
														dataIndex: "name",
														editor: {
															xtype: "textfield",
															allowBlank: false
														}
													},
													{
														text: "Value",
														flex: 1,
														dataIndex: "map_param"
													},
													{
														xtype: "actioncolumn",
														width: 30,
														items: [
															{
																iconCls: "icon-grid-delete",
																tooltip: "Delete Action",
																handler: function (grid, rowIndex, colIndex) {
																	var me = this,
																		rec = grid.store.getAt(rowIndex);
																	rec.set("map_param", "");
																	rec.set("map_type", "");
																},
																scope: this
															}
														]
													}
												]
											},
											{
												xtype: "gridpanel",
												name: "p_grd_out",
												title: "Output parameter",
												emptyText: "No Action Item selected or no Output parameter",
												flex: 1,
												selType: "checkboxmodel",
												selModel: {
													checkSelector: ".x-grid-cell",
													mode: "MULTIPLE"
												},
												viewConfig: {
											    	plugins: [
												    	{
															ptype: "gridviewdragdrop",
															ddGroup: "_I$RD_G_"
														}
													],
													listeners: {
														beforedrop: f_bdrop,
														drop: f_drop
													}
											    },
											    tbar: [
											    	{
											    		text: "Add",
											    		handler: function() {
											    			var grd = this.down("[name=p_grd_out]");
											    			
											    			grd.store.add({
											    				name: "",
											    				map_param: "",
											    				map_type: "",
											    				type: "custom"
											    			});
											    		},
											    		scope: this
											    	},
											    	{
											    		text: "Remove",
											    		handler: function() {
											    		},
											    		scope: this
											    	}
											    ],
											    plugins: [
											        {
											        	ptype: "cellediting",
											            clicksToEdit: 1
											        }
											    ],
												store: {
													xtype: "store",
													fields: ["name", "map_param", "map_type", "type"]
												},
												columns: [
													{
														text: "Name",
														flex: 1,
														dataIndex: "name",
														editor: {
															xtype: "textfield",
															allowBlank: false
														}
													},
													{
														text: "Value",
														flex: 1,
														dataIndex: "map_param"
													},
													{
														xtype: "actioncolumn",
														width: 30,
														items: [
															{
																iconCls: "icon-grid-delete",
																tooltip: "Delete Action",
																handler: function (grid, rowIndex, colIndex) {
																	var me = this,
																		rec = grid.store.getAt(rowIndex);
																	rec.set("map_param", "");
																	rec.set("map_type", "");
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
				]
			});
			
			IG$/*mainapp*/._Ifd/*layoutWizard*/.superclass.initComponent.apply(this, arguments);
		},
		listeners: {
			afterrender: function() {
			}
		}
	});
}
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

IG$/*mainapp*/.Y$1/*dashboardposition*/ = function(panel, html) {
	var ctrl = this;
	
	this.panel = panel;
	this.html = html;
	
//	$(this.html).bind("resize", function() {
//		if (ctrl.t1 && ctrl.t2)
//		{
//			ctrl.validatePosition.call(ctrl);
//		}
//	});
}

IG$/*mainapp*/.Y$1/*dashboardposition*/.prototype = {
	initDrawing: function() {
		var panel = this,
			l = 5,
			main = $(this.html),
			html = $("<div></div>"),
			ttable = $("<table class='idv-dpm'><tr><td>Width</td><td class='mec-wfm'></td></tr><tr><td>Height</td><td class='mec-wfm'></td></tr></table>"),
			vtext = "<input type='checkbox' class='idv-poic'/>",
			itext = "<input type='text' class='idv-poi'/>",
			dv;
		this.hbox = $("<div></div>");
		
		this.chelp = $("<div></div>");
			
		main.append(ttable);
		var t = ttable.find(".mec-wfm");
		
		html.css({position: "absolute", top: 40, right: 0, bottom: 0, left: 0});
		main.append(html);
		
		this.hbox.css({position: "absolute", background: "#cecece"});
		html.append(this.hbox);
		
		this.chelp.css({position: "relative", background: "#ffffff", padding: 0, margin: 0, width: 100, height: 70, display: "none"});
		this.hbox.append(this.chelp);
		
		dv = $("<table class='idv-dp-tb'><tr><td><input id='tw' type='checkbox' class='cbox'/><span>Width</span></td><td><input type='text' id='tw_value' class='idv-poiw' value=''></td></tr><tr><td><input id='th' type='checkbox' class='cbox'/><span>Height</span></td><td><input type='text' id='th_value' class='idv-poiw' value=''></td></tr></table>");
		main.prepend(dv);
		this.tw = $("#tw", dv);
		this.tw_value = $("#tw_value", dv);
		
		this.th = $("#th", dv);
		this.th_value = $("#th_value", dv);
		
		$.each(["tw", "th"], function(index, key) {
			panel[key].bind("change", function() {
				var sender = this;
				panel.checkChanged.call(panel, sender);
			});
		});
		
		$.each(["tw_value", "th_value"], function(index, key) {
			panel[key].bind("blur", function() {
				var sender = this;
				panel.valueChanged.call(panel, sender);
			});
			panel[key].bind("keydown", function(ev) {
				if (ev.keyCode == 13)
				{
					var sender = this;
					panel.valueChanged.call(panel, sender);
				}
			});
		});
		
		$.each(["t1", "t2", "t3", "l1", "l2", "l3"], function(index, key) {
			panel[key] = $(vtext, main);
			panel[key][0].name = key;
			panel[key + "_value"] = $(itext);
			panel[key + "_value"][0].name = key + "_value";
			
			panel[key].css({position: "absolute", top: l, left: l, display: (key == "t2" || key == "l2") ? "none" : "inline"});
			panel[key + "_value"].css({position: "absolute", top: l, left: l});
			html.append(panel[key]);
			html.append(panel[key + "_value"]);
			
			panel[key].bind("change", function() {
				var sender = this;
				
				panel.checkChanged.call(panel, sender);
			});
			
			panel[key + "_value"].bind("blur", function() {
				var sender = this;
				
				panel.valueChanged.call(panel, sender);
			});
			
			panel[key + "_value"].bind("keydown", function(ev) {
				if (ev.keyCode == 13)
				{
					var sender = this;
					panel.valueChanged.call(panel, sender);
				}
			});
		});
		
		this.validatePosition();
	},
	
	valueChanged: function(sender) {
		var sname = sender.name,
			pos = this.pos,
			tvalue = sender.value;
			
		switch (sname)
		{
		case "t1_value":
			pos.left = tvalue;
			break;
		case "t2_value":
			pos.center = tvalue;
			break;
		case "t3_value":
			pos.right = tvalue;
			break;
		case "l1_value":
			pos.top = tvalue;
			break;
		case "l2_value":
			pos.middle = tvalue;
			break;
		case "l3_value":
			pos.bottom = tvalue;
			break;
		case "tw_value":
			pos.width = tvalue;
			break;
		case "th_value":
			pos.height = tvalue;
			break;
		}
		
		this.updateValues();
	},
	
	updateValues: function() {
		var panel = this;
		
		$.each([{l: "t1", v: "left"},
				{l: "t2", v: "center"},
				{l: "t3", v: "right"},
				{l: "l1", v: "top"},
				{l: "l2", v: "middle"},
				{l: "l3", v: "bottom"},
				{l: "tw", v: "width"},
				{l: "th", v: "height"}], 
			function(index, key) {
				if (panel[key.l][0].checked == true)
				{
					var tvalue = panel[key.l + "_value"][0].value,
						tkey = key.v;
					
					if (key.l == "tw" || key.l == "th")
					{
						if (tvalue.indexOf("%") > -1)
						{
							var tpercent = tvalue.split("%")[0];
							tvalue = tpercent;
							panel.pos[tkey] = null;
							tkey = "percent" + tkey;
							tvalue = Number(tvalue);
							tvalue = Math.round(tvalue * 100) / 100;
							panel.pos[tkey] = tvalue;
						}
						else
						{
							tvalue = Number(tvalue);
							tvalue = Math.round(tvalue * 100) / 100;
							panel.pos[tkey] = tvalue;
							panel.pos["percent" + tkey] = null;
						}
					}
					else
					{
						tvalue = Number(tvalue);
						tvalue = Math.round(tvalue * 100) / 100;
						panel.pos[tkey] = tvalue;
					}
				}
			}
		);
		
		this.updatePreviewer();
		
		if (this.panel.positionchanged)
		{
			this.panel.positionchanged.call(this.panel);
		}
	},
	
	updateBoxValue: function(upos) {
		var panel = this,
			pos = this.pos;
			
		var r = {x: 10, y: 10, width: null, height: null, percentwidth: null, percentheight: null, x1: 10, y1: 10};
		
		r.x = (pos.left != null) ? pos.left : 
			  (pos.right != null && pos.width != null) ? upos.width - pos.right - pos.width :
			  (pos.right != null && pos.percentwidth != null) ? upos.width - pos.right - (upos.width - pos.right) * 0.01 * pos.percentwidth :
			  -1;
			  
		r.y = (pos.top != null) ? pos.top : 
			  (pos.bottom != null && pos.height != null) ? upos.height - pos.bottom - pos.height :
			  (pos.bottom != null && pos.percentheight != null) ? upos.height - pos.bottom - (upos.height - pos.bottom) * 0.01 * pos.percentheight :
			  -1;
		
		if (pos.percentwidth != null)
		{
			r.percentwidth = pos.percentwidth;
			r.width = (pos.left != null) ? pos.percentwidth * 0.01 * (upos.width - pos.left) :
					  (pos.right != null) ? pos.percentwidth * 0.01 * (upos.width - pos.right) :
					  -1; 
		}
		else
		{
			r.width = (pos.width != null) ? pos.width : 
					  (pos.left != null && pos.right != null) ? upos.width - pos.left - pos.right : 
					  -1;
		}
		
		if (pos.percentheight != null)
		{
			r.percentheight = pos.percentheight;
			r.height = (pos.top != null) ? pos.percentheight * 0.01 * (upos.height - pos.top) :
					   (pos.bottom != null) ? pos.percentheight * 0.01 * (upos.height - pos.bottom) :
					   -1;
		}
		else
		{
			r.height = (pos.height != null) ? pos.height :
					   (pos.top != null && pos.bottom != null) ? upos.height - pos.bottom -pos.top :
					   -1;
		}
		
		r.width = (r.width != -1) ? Math.abs(r.width) : -1;
		r.height = (r.height != -1) ? Math.abs(r.height) : -1; 
		r.x = (r.x != -1) ? Math.abs(r.x) : -1;
		
		r.x1 = upos.width - (r.x + r.width);
		r.y1 = upos.height - (r.y + r.height);
		
		return r;
	},
	
	checkChanged: function(sender) {
		var sname = sender.name,
			checked = sender.checked,
			pos = this.pos,
			upos = this.upos,
			box;
			
		box = this.updateBoxValue(this.upos);
		
		switch (sname)
		{
		case "t1":
			if (checked == true)
			{
				pos.left = box.x;
//				if (pos.right != null && (pos.width != null || pos.percentwidth != null))
//				{
//					pos.right = null;
//				}
			}
			else
			{
				pos.left = null;
				if (pos.right == null)
				{
					pos.right = box.x1;
				}
				
				if (pos.width == null && pos.percentwidth == null)
				{
					pos.width = box.width;
				}
			}
			break;
		case "t2":
			break;
		case "t3":
			if (checked == true)
			{
				pos.right = box.x1;
//				if (pos.left != null && (pos.width != null || pos.percentwidth != null))
//				{
//					pos.left = null;
//				}
			}
			else
			{
				pos.right = null;
				if (pos.left == null)
				{
					pos.left = box.x;
				}
				
				if (pos.width == null && pos.percentwidth == null)
				{
					pos.width = box.width;
				}
			}
			break;
		case "l1":
			if (checked == true)
			{
				pos.top = box.y;
//				if (pos.bottom != null && (pos.height != null || pos.percentheight != null))
//				{
//					pos.bottom = null;
//				}
			}
			else
			{
				pos.top = null;
				if (pos.bottom == null)
				{
					pos.bottom = box.y1;
				}
				
				if (pos.height == null && pos.percentheight == null)
				{
					pos.height = box.height;
				}
			}
			break;
		case "l2":
			break;
		case "l3":
			if (checked == true)
			{
				pos.bottom = box.y1;
//				if (pos.top != null && (pos.height != null || pos.percentheight != null))
//				{
//					pos.top = null;
//				}
			}
			else
			{
				pos.bottom = null;
				if (pos.top == null)
				{
					pos.top = box.y;
				}
				if (pos.height == null && pos.percentheight == null)
				{
					pos.height = box.height;
				}
			}
			break;
		case "tw":
			if (checked == true)
			{
				pos.width = box.width;
				if (pos.left != null && pos.right != null)
				{
					pos.right = null;
				}
			}
			else
			{
				pos.width = null;
				pos.percentwidth = null;
				if (pos.left == null || pos.right == null)
				{
					pos.left = box.x;
					pos.right = box.x1;
				}
			}
			break;
		case "th":
			if (checked == true)
			{
				pos.height = box.height;
				
				if (pos.top != null && pos.bottom != null)
				{
					pos.bottom = null;
				}
			}
			else
			{
				pos.height = null;
				pos.percentheight = null;
				if (pos.top == null || pos.bottom == null)
				{
					pos.top = box.y;
					pos.bottom = box.y1;
				}
			}
			break;
		}
		
		this.setControlInput();
	},
	
	validatePosition: function() {
		var html = $(this.html),
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(html) - 40,
			lw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w($(this.t1)),
			lh = IG$/*mainapp*/.x_10/*jqueryExtension*/._h($(this.t1)),
			cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w($(this.t1_value)),
			ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h($(this.t1_value)),
			l = 10;
		
		this.hbox.css({left: lw+l, right: cw+l, top: lh+l, bottom: ch+l});
		
		var bbox = {x: lw+l, y: lh + l, w: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(this.hbox), h: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(this.hbox)};
		bbox.x1 = bbox.w + bbox.x;
		bbox.y1 = bbox.h + bbox.y;
		
		this.t1.css({left: bbox.x});
		this.t2.css({left: bbox.x + (bbox.w-lw) / 2});
		this.t3.css({left: bbox.x1 - lw});
		
		this.t1_value.css({top: bbox.y1, left: bbox.x});
		this.t2_value.css({top: bbox.y1, left: bbox.x + (bbox.w - cw) / 2});
		this.t3_value.css({top: bbox.y1, left: (w - cw - l)});
		
		this.l1.css({top: bbox.y});
		this.l2.css({top: bbox.y + (bbox.h - lh) / 2});
		this.l3.css({top: bbox.y1 - lh});
		
		this.l1_value.css({left: bbox.x1, top: bbox.y});
		this.l2_value.css({left: bbox.x1, top: bbox.y + (bbox.w - ch) / 2});
		this.l3_value.css({left: bbox.x1, top: bbox.y1 - ch});
	},
	
	setControlPosition: function(pos, upos) {
		this.pos = pos;
		this.upos = upos;
		this.setControlInput();
	},
	
	setControlInput: function() {
		var panel = this,
			pos = panel.pos,
			upos = panel.upos;
		
		pos.left = (typeof pos.left == 'undefined') ? null : pos.left;
		pos.right = (typeof pos.right == 'undefined') ? null : pos.right;
		pos.center = (typeof pos.center == 'undefined') ? null : pos.center;
		
		pos.top = (typeof pos.top == 'undefined') ? null : pos.top;
		pos.middle = (typeof pos.middle == 'undefined') ? null : pos.middle;
		pos.bottom = (typeof pos.bottom == 'undefined') ? null : pos.bottom;
		
		pos.width = (typeof pos.width == 'undefined') ? null : pos.width;
		pos.height = (typeof pos.height == 'undefined') ? null : pos.height;
		
		pos.percentwidth = (typeof pos.percentwidth == 'undefined') ? null : pos.percentwidth;
		pos.percentheight = (typeof pos.percentheight == 'undefined') ? null : pos.percentheight;
		
		if (pos.left == null && pos.right == null && pos.width == null)
		{
			pos.left = 10;
			pos.width = pos.percentwidth == null ? 50 : null;
		}
		
		if (pos.top == null && pos.bottom == null && pos.height == null)
		{
			pos.top = 10;
			pos.height = pos.percentheight == null ? 50 : null;
		}
		
		if (pos.left != null && pos.right != null)
		{
			pos.width = null;
			pos.percentwidth = null;
		}
		if (pos.top != null && pos.bottom != null)
		{
			pos.height = null;
			pos.percentheight = null;
		}
		
		if (pos.left != null && (pos.width != null || pos.percentwidth != null))
		{
			pos.right = null;
		}
		
		if (pos.right != null && (pos.width != null || pos.percentwidth != null))
		{
			pos.left = null;
		}
		
		if (pos.top != null && (pos.height != null || pos.percentheight != null))
		{
			pos.bottom = null;
		}
		
		if (pos.bottom != null && (pos.height != null || pos.percentheight != null))
		{
			pos.top = null;
		}
		
		this.updatePreviewer();
		
		this.setSelection("tw", (pos.width != null) ? pos.width : (pos.percentwidth != null) ? pos.percentwidth + "%" : -1);
		this.setSelection("th", (pos.height != null) ? pos.height : (pos.percentheight != null) ? pos.percentheight + "%" : -1);
		this.setSelection("t1", (pos.left != null) ? pos.left : -1);
		this.setSelection("t3", (pos.right != null) ? pos.right : -1);
		this.setSelection("l1", (pos.top != null) ? pos.top : -1);
		this.setSelection("l3", (pos.bottom != null) ? pos.bottom : -1);
	},
	
	updatePreviewer: function() {
		var w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(this.hbox),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(this.hbox),
			bbox = this.updateBoxValue({width: w, height: h});
		
		this.chelp.css({left: bbox.x, top: bbox.y, width: bbox.width, height: bbox.height});
		this.chelp.show();
	},
	
	setSelection: function(ctrl, value) {
		if (value == -1)
		{
			this[ctrl][0].checked = false;
			
			if (this[ctrl + "_value"])
			{
				this[ctrl + "_value"].css({display: "none"});
			}
		}
		else
		{
			this[ctrl][0].checked = true;
			if (this[ctrl + "_value"])
			{
				this[ctrl + "_value"].css({display: "inline"});
				this[ctrl + "_value"][0].value = value;
			}
		}
	}
}
IG$/*mainapp*/.cM9/*initDragDrop*/ = function(el, panel) {
	var owner = panel,
		grid = panel;
	
	this.panel = panel;
	this.el = el;
	
	this.dragZone = Ext.create('Ext.dd.DragZone', el, {
		ddGroup: '_I$RD_G_',
		
        getDragData: function(e) {
        	var px = e.browserEvent.pageX,
        		py = e.browserEvent.pageY,
        		renderer = owner.getRendererByPoint(px, py),
        		cell,
        		d, srcel;
        		
            if (renderer) {
            	cell = renderer.cl/*name cell*/;
            	if (cell.position == 1 || cell.position == 2 || (cell.position == 3 && cell.title == 1))
            	{
            		grid.isDragging = true;
            		srcel = renderer[0];
            		d = srcel.cloneNode(true);
	                d.id = Ext.id();
	                return grid.dragData = {
	                    sourceEl: srcel,
	                    repairXY: Ext.fly(srcel).getXY(),
	                    ddel: d,
	                    cellData: cell
	                };
            	}
            }
        },
        
        afterInvalidDrop: function(e) { 
        	if (this.dragData && this.dragData.cellData && grid._ILb/*sheetoption*/)
        	{
        		
        	}
        },

//      Provide coordinates for the proxy to slide back to on failed drag.
//      This is the original XY coordinates of the draggable element.
        getRepairXY: function() {
        	grid.isDragging = false;
            return this.dragData.repairXY;
        }
    });
    
	this.dropZone = Ext.create('Ext.dd.DropZone', el, {
		ddGroup: '_I$RD_G_',
		
		nodeouttimer: -1,
		
		getTargetFromEvent: function(e) {
			var px = e.browserEvent.pageX,
        		py = e.browserEvent.pageY,
        		renderer = grid.getRendererByPoint(px, py);
        	
        	if (renderer == null)
        	{
        		renderer = el;
        	}
        	
            return renderer;
        },
        
        notifyOut : function(dd, e, data){
	        if(this.lastOverNode){
	            this.onNodeOut(this.lastOverNode, dd, e, data);
	            this.lastOverNode = null;
	        }
	        
	        grid.isDragging = false;
        	grid.hideDropFeedback.call(grid, e);
        	
        	if (this.accept == true)
        	{
        		if (grid.sheetobj)
        		{
        			if (this.nodeouttimer > -1)
	        		{
	        			clearTimeout(this.nodeouttimer);
	        		}
        			
        			this.nodeouttimer = setTimeout(function() {
        				grid.hideDropFeedback.call(grid, e);
        			}, 100);
        			// grid.sheetobj._IP4/*procUpdateReport*/.call(grid.sheetobj);
        		}
        	}
	    },
	    
        onNodeEnter : function(target, dd, e, data){
        	grid.isDragging = true;
        	
        	var i,
        		dt, dttype,
        		accept = false;
        		
        	if (data.records && data.records.length > 0)
        	{
        		dt = data.records[0].data;
        		dttype = dt.type.toLowerCase();
        		
        		accept = true;
        	}
        	
        	if (accept == true)
        	{
        		grid.showDropHelper.call(grid, dt);
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
        		
        		grid.showDropFeedback.call(grid, e, dt);
        	}
            return ret;
        },
        onNodeDrop : function(target, dd, e, data){
        	grid.hideDropFeedback.call(grid, e);
        	
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
        		
        		grid.onDropWidget.call(grid, e, dt);
            }
            
            this.accept = false;
            return true;
        }
	});
}
if (window.Ext)
{
	IG$/*mainapp*/._IC8/*DashboardEdit*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
		closable: true,
		
		ecname: null,
		
		"layout": "fit",
		iconCls: "icon-dashboard",
		
		listeners: {
			afterrender: function(ui) {
				var me = this;
				me._IFd/*init_f*/();
			}
		},
			
		_IFd/*init_f*/: function() {
			var me = this,
				pnl_position = me.down("[name=pnl_position]"),
				pot = new IG$/*mainapp*/.Y$1/*dashboardposition*/(me, pnl_position.body.dom);
			
			me.in$d();
			
			me.pot = pot;
			pot.initDrawing();
			
			if (me.uid && me.uid.length > 0)
			{
				me.F1/*loadContent*/();
			}
			else
			{
				me.setLoading(false);
			}
		},
		
		in$d: function() {
			var me = this,
				layout_preview = me.down("[name=layout_preview]"),
				viewarea = layout_preview.body.dom;
						
	   		me.dd = new IG$/*mainapp*/.cM9/*initDragDrop*/(viewarea, me);
		},
		
		getRendererByPoint: function() {
			return null;
		},
		
		hideDropFeedback: function() {
		},
		
		showDropHelper: function() {
		},
		
		showDropFeedback: function() {
		},
		
		onDropWidget: function(e, dt) {
			var me = this,
				layout_preview = me.down("[name=layout_preview]"),
				r1 = new IG$/*mainapp*/._ID1/*frameControl*/(null, null),
				ppanel;
				
			r1.type = dt.type;
			r1.name = r1.type + "_" + me.F9/*getUniqueControlIndex*/(dt.type);
			r1.position = {top: e.browserEvent.offsetY, left: e.browserEvent.offsetX, width: 100, height: 100};
			
			$.each(me._9/*framecontent*/.layout, function(i, ctrl) {
				if (ctrl.type == "panel" || ctrl.type == "tabpanel")
				{
					var pinner = ctrl.position;
					
					if (pinner.top < r1.position.top && r1.position.top < pinner.top + pinner.height &&
						pinner.left < r1.position.left && r1.position.left < pinner.left + pinner.width)
					{
						ppanel = ctrl;
					}
				}
			});
			
			r1.properties.Name = r1.name; // dt.type + "_name";
			
			r1.updatePropertyValue.call(r1, true);
			
			if (ppanel)
			{
				r1.position.top -= ppanel.position.top;
				r1.position.left -= ppanel.position.left;
				
				ppanel.layout.push(r1);
			}
			else
			{
				me._9/*framecontent*/.layout.push(r1);
			}
			layout_preview.M3/*layoutControls*/.call(layout_preview);
			me.F5/*updateFrameContentControls*/(null, me._9/*framecontent*/.layout);
			
			me.refreshControl();
		},
		
		refreshControl: function() {
			var me = this,
				ctrl_layout = me.down("[name=ctrl_layout]"),
				layout_preview = me.down("[name=layout_preview]"),
				dom  = $(layout_preview.body.dom),
				rect = {x: 0, y: 0, w: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dom), h: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(dom)},
				padding = {t:0,b:0,l:0,r:0};
				
			// dom.empty();
			
			me.rootctrl = [];
			me.F3/*updateRootLayout*/(null, me._9/*framecontent*/.layout, me.rootctrl);
			
			ctrl_layout.store.setRootNode({
				expanded: true,
				text: "Root Layout",
				name: "Root Layout",
				children: me.rootctrl
			});
			
			if (me.dummyInfo)
			{
				me.dummyInfo.remove();
			}
										
			me.F2/*validateLayoutControls*/(null, me._9/*framecontent*/.layout, dom, rect, padding);
			
			me.dummyInfo = $("<div class='dummyinfo'></div>");
			me.dummyInfo.appendTo(dom);
			me.dummyInfo.hide();
		},
		
		positionchanged: function() {
			var me = this,
				layout_preview = me.down("[name=layout_preview]");
			
			if (me._9/*framecontent*/ && me._9/*framecontent*/.layout)
			{
				var dom = $(layout_preview.body.dom),
					rect = {x: 0, y: 0, w: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dom), h: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(dom)},
					padding = {t:0,b:0,l:0,r:0};
				
				// me.F2/*validateLayoutControls*/(null, me._9/*framecontent*/.layout, dom, rect, padding);
				layout_preview.M3/*layoutControls*/.call(layout_preview);
			}
		},
		
		F1/*loadContent*/: function() {
			var me = this,
				req;
				
			me.setLoading(true);
				
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "5",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
		        }, me, me._IM9/*rs_loadContent*/, false);
			req._l/*request*/();
		},
		
		_IM9/*rs_loadContent*/: function(xdoc) {
			var me = this,
				ctrl_layout = me.down("[name=ctrl_layout]"),
				layout_preview = me.down("[name=layout_preview]");
			
			me.setLoading(false);
			
			me._9/*framecontent*/ = new IG$/*mainapp*/.cdxml(xdoc);
			me._9/*framecontent*/.parseContent.call(me._9/*framecontent*/, me);
			
			me.down("[name=b_tmpl_name]").setValue(me._9/*framecontent*/.tmpl ? me._9/*framecontent*/.tmpl.name : "");
			
			me.updateCubeUID();
			me.updateScript();
			
			me.rootctrl = [];
			me.F3/*updateRootLayout*/(null, me._9/*framecontent*/.layout, me.rootctrl);
			
			ctrl_layout.store.setRootNode({
				expanded: true,
				text: "Root Layout",
				name: "Root Layout",
				children: me.rootctrl
			});
			
			layout_preview.M3/*layoutControls*/.call(layout_preview, me._9/*framecontent*/);
		},
		
		updateCubeUID: function() {
			var me = this,
				req, addr = [], addrcnt = 0, i, rpt;
				
			if (me._9/*framecontent*/.dashboardreport.length > 0)
			{
				addr.push("<smsg><item uid='" + me.uid + "'>");
				for (i=0; i < me._9/*framecontent*/.dashboardreport.length; i++)
				{
					rpt = me._9/*framecontent*/.dashboardreport[i];
					
					if (!rpt.detail)
					{
						addr.push("<Report" + IG$/*mainapp*/._I20/*XUpdateInfo*/(rpt, "uid;name;nodepath;type") + "/>");
						addrcnt++;
					}
				}
				addr.push("</item></smsg>");
			}
			
			if (addrcnt > 0)
			{
				me.setLoading(true);
				
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(me, 
					{
			            cacheid: '',
					    refresh: '',
			            ack: "11",
			            payload: addr.join(""),
			            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "reportdetail"})
			        }, me, me.rs_updateCubeUID, false);
				req._l/*request*/();
			}
		},
		
		rs_updateCubeUID: function(xdoc) {
			var me = this,
				_9/*framecontent*/ = me._9/*framecontent*/,
				dashboardreport = _9/*framecontent*/.dashboardreport,
				i, j, tnode, tnodes, detail;
			
			me.setLoading(false);
			
			if (dashboardreport.length > 0)
			{
				tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
				
				if (tnode)
				{
					tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
					
					for (i=0; i < tnodes.length; i++)
					{
						detail = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
						
						for (j=0; j < dashboardreport.length; j++)
						{
							if (dashboardreport[j].uid == detail.uid)
							{
								dashboardreport[j].name = detail.name;
								dashboardreport[j].nodepath = detail.nodepath;
								dashboardreport[j].cubeuid = detail.cubeuid;
								dashboardreport[j].detail = detail;
								break;
							}
						}
					}
				}
			}
		},
		
		updateScript: function() {
			var me = this,
				m_code = me.down("[name=m_code]"),
				l_code = me.down("[name=l_code]"),
				m_code_ = me.down("[name=m_code_]"),
				l_3 = me.down("[name=l_3]");
				
			m_code._9/*framecontent*/ = me._9/*framecontent*/;
			m_code._IFe/*initF*/.call(m_code);
			
			l_code._9/*framecontent*/ = me._9/*framecontent*/;
			l_code._IFe/*initF*/.call(l_code);
			
			m_code_._9/*framecontent*/ = me._9/*framecontent*/;
			m_code_._IFe/*initF*/.call(m_code_);
			
			l_3._9/*framecontent*/ = me._9/*framecontent*/;
			l_3.uid = me.uid;
			l_3._IFe/*initF*/.call(l_3);
		},
		
		_f1/*commitChanges*/: function() {
			var me = this,
				m_code_ = me.down("[name=m_code_]"),
				m_code = me.down("[name=m_code]");
			
			m_code.commitCode.call(m_code);
			m_code_._f1/*commitChanges*/.call(m_code_);
		},
		
		F2/*validateLayoutControls*/: function(p, layout, dom, rect, padding) {
			var me = this,
				layout_preview = me.down("[name=layout_preview]"),
				viewarea = $(".dashboardview", layout_preview.body.dom),
				l_code = me.down("[name=l_code]");
			layout_preview.Mm11/*validateSize*/.call(layout_preview, "", IG$/*mainapp*/.x_10/*jqueryExtension*/._w(viewarea), IG$/*mainapp*/.x_10/*jqueryExtension*/._h(viewarea), null);
			
			l_code.refreshCode.call(l_code);
		},
		
	
		
		F3/*updateRootLayout*/: function(pctrl, layout, unode) {
			var i, j,
				obj,
				typename, 
				ptypename = (pctrl) ? pctrl.type.toLowerCase() : "",
				playoutmode = (pctrl) ? pctrl.properties.layout : "fit",
				clayout;
			
			for (i=0; i < layout.length; i++)
			{
				clayout = layout[i];
				
				obj = {name: clayout.name, type: clayout.type, pname: clayout.pname};
				typename = obj.type.toLowerCase();
				if (typename == "panel")
				{
					obj.children = [];
					obj.leaf = false;
					var layoutmode = clayout.properties.layout || "fit";
					switch (layoutmode)
					{
					case "border":
						var slayout = {center: {name: "Center", type: "blank", pname: obj.name, region: "center"}, 
									   north: {name: "North", type: "blank", pname: obj.name, region: "north"}, 
									   south: {name: "South", type: "blank", pname: obj.name, region: "south"}, 
									   east: {name: "East", type: "blank", pname: obj.name, region: "east"}, 
									   west: {name: "West", type: "blank", pname: obj.name, region: "west"}};
											
						if (clayout.layout && clayout.layout.length > 0)
						{
							var hasCenter = false;
							
							for (j=0; j < clayout.layout.length; j++)
							{
								if (clayout.layout[j].properties.region == 'center')
								{
									hasCenter = true;
									break;
								}
							}
							
							if (hasCenter == false)
							{
								clayout.layout[0].properties.region = "center";
								slayout["center"].name = clayout.layout[0].name;
								slayout["center"].type = clayout.layout[0].type;
							}
							
							for (j=0; j < clayout.layout.length; j++)
							{
								var tl = clayout.layout[j].properties.region;
								if (tl)
								{
									slayout[tl].layout = clayout.layout[j];
									slayout[tl].name = clayout.layout[j].name;
									slayout[tl].type = clayout.layout[j].type;
									
									if (clayout.layout[j].layout && clayout.layout[j].layout.length > 0)
									{
										slayout[tl].children = [];
										this.F3/*updateRootLayout*/(clayout, clayout.layout[j].layout, slayout[tl].children);
									}
								}
							}
						}
						
						$.each(["center", "north", "east", "south", "west"], function(index, key) {
							var lobj = slayout[key];
								
							if (lobj)
							{
								obj.children.push(lobj);
							}
						});
						break;
					case "portal":
						for (j=0; j < clayout.layout.length; j++)
						{
							var tl = clayout.layout[j];
							var sobj = {name: tl.name, type: tl.type};
							
							if (tl.layout && tl.layout.length > 0)
							{
								sobj.children = [];
								this.F3/*updateRootLayout*/(tl, tl.layout, sobj.children);
							}
						}
						break;
					default:
						if (clayout.layout && clayout.layout.length > 0)
						{
							this.F3/*updateRootLayout*/(clayout, clayout.layout, obj.children);
						}
						break;
					}
				}
				else if (typename == "tabpanel")
				{
					// tabpanel logic
					obj.leaf = false;
					obj.children = [];
					this.F3/*updateRootLayout*/(clayout, clayout.layout, obj.children);
				}
				else if (clayout.layout && clayout.layout.length > 0)
				{
					obj.children = [];
					this.F3/*updateRootLayout*/(clayout, clayout.layout, obj.children);
				}
				else if (typename != "panel")
				{
					obj.leaf = true;
				}
				unode.push(obj);
			}
		},
		
		_t$/*toolbarHandler*/: function(cmd) {
	    	var me = this,
	    		content,
	    		dlg, ctrl,
	    		ecname,
	    		bcube,
	    		_9/*framecontent*/ = me._9/*framecontent*/,
	    		b_itemname,
	    		b_tmpl_name;
	    	
	    	switch(cmd)
	    	{
	    	case "cmd_save":
	    		me._f1/*commitChanges*/();
	    		content = _9/*framecontent*/.getXML();
	    		me.fV6/*saveContent*/(me.uid, content);
	    		break;
	    	case "cmd_reload":
	    		me._IFd/*init_f*/();
	    		break;
	    	case "cmd_run":
	    		me._f1/*commitChanges*/();
	    		if (me.uid)
	    		{
	    			IG$/*mainapp*/._I7d/*mainPanel*/.m1$7/*navigateApp*/.call(IG$/*mainapp*/._I7d/*mainPanel*/, 
	    				me.uid, _9/*framecontent*/.item.type.toLowerCase(), _9/*framecontent*/.item.name, _9/*framecontent*/.item.nodepath, false, false, null, {
	    					bt: {
	    						content: _9/*framecontent*/.getXML()
	    					}
	    				}
	    			);
	    		}
	    		break;
	    	case "cmd_saveas":
	    		me.$f1/*saveAsContent*/();
	    		break;
	    	case "cmd_wizard":
	    		dlg = new IG$/*mainapp*/._Ifd/*layoutWizard*/({
	    			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.fV5/*updateDashboardWizard*/)
	    		});
	    		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	    		break;
	    	case "cmd_event":
	    		dlg = new IG$/*mainapp*/._IAa/*eventWizard*/({
	    			_9/*framecontent*/: me._9/*framecontent*/,
	    			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.fV5a/*updateEventWizard*/)
	    		});
	    		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	    		break;
	    	case "cmd_scripting":
	    		dlg = new IG$/*mainapp*/._IAe/*scriptWizard*/({
					_9/*framecontent*/: me._9/*framecontent*/,
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.fV5b/*updateScriptContent*/)
				});
	    		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	    		break;
	    	case "cmd_map":
	    		ecname = me.ecname;
	    		ctrl = me._9/*framecontent*/.controls[ecname];
	    		bcube = ctrl.type == "olapreport" || ctrl.type == "dashboard" ? false : true;
	    		b_itemname = me.down("[name=b_itemname]");
	    		dlg = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
					visibleItems: "workspace;folder" + (bcube ? ";metric" : ";report") + (ctrl.type == "dashboard" ? ";dashboard" : ""),
					u5x/*treeOptions*/: {
						cubebrowse: bcube
					},
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
						if (ctrl.type != "dashoard")
						{
							me._9/*framecontent*/.regReportContent.call(me._9/*framecontent*/, item);
						}
						ctrl.item = item;
						b_itemname.setValue(item.name);
					})
				});
				IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	    		break;
	//    	case "cmd_map_code":
	//    		ecname = me.ecname;
	//    		ctrl = me._9/*framecontent*/.controls[ecname];
	//    		b_itemname = me.down("[name=t_codemap]");
	//    		dlg = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
	//				visibleItems: "workspace;folder;codemap",
	//				u5x/*treeOptions*/: {
	//					cubebrowse: false,
	//					rootuid: "/SYS_Lookup"
	//				},
	//				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
	//					ctrl.item = item;
	//					b_itemname.setValue(item.name);
	//				})
	//			});
	//			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	//    		break;
	    	case "cmd_map_tmpl":
	    		b_tmpl_name = me.down("[name=b_tmpl_name]");
	    		dlg = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
					visibleItems: "workspace;folder;dashboard",
					u5x/*treeOptions*/: {
						cubebrowse: false
					},
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
						me._9/*framecontent*/.tmpl = item;
						b_tmpl_name.setValue(item.name);
					})
				});
				IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	    		break;
			case "cmd_cstore":
				ecname = me.ecname;
				ctrl = me._9/*framecontent*/.controls[ecname];
				dlg = new IG$/*mainapp*/._m2a/*columnstroe*/({
					_9/*framecontent*/: me._9/*framecontent*/,
					fctrl: ctrl,
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
						
					})
				});
	    		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
				break;
	    	case "cmd_var":
	    		dlg = new IG$/*mainapp*/.D_/*dashboard_var*/({
	    			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
						
					})
	    		});
	    		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	    		break;
	    	}
	    },
	    
	    fV5b/*updateScriptContent*/: function() {
	    	var _9/*framecontent*/ = this._9/*framecontent*/;
	    	_9/*framecontent*/._l24/*parseScriptFunction*/.call(_9/*framecontent*/);
	    },
	    
	    fV5a/*updateEventWizard*/: function(wizard) {
	    },
	    
	    fV5/*updateDashboardWizard*/: function(wizard) {
	    	var opt = wizard,
	    		ctrl_title;
	    	
	    	if (opt)
	    	{
	    		var ctrl_layout = this.down("[name=ctrl_layout]"),
	    			layout_preview = this.down("[name=layout_preview]");
	    		var nlayout = [];
	    		ctrl_title = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
	    		ctrl_title.type = "titlelabel";
	    		ctrl_title.name = "title_1";
	    		ctrl_title.position = {top: 5, left: 5, width: 100, height: 22};
	    		ctrl_title.properties.Name = "title_1";
	    		
	    		ctrl_title.updatePropertyValue.call(ctrl_title);
	    		
	    		switch (opt.layouttype)
	    		{
	    		case "absolute":
	    			nlayout = [
	    				ctrl_title
	    			];
	    			break;
	    		case "2row":
	    			var lmain = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		lmain.type = "panel";
		    		lmain.name = "panel_main";
		    		lmain.position = {top: 30, left: 5, right: 5, bottom: 5};
		    		lmain.properties.Name = "panel_main";
		    		lmain.properties.layout = "vertical";
		    		
		    		lmain.updatePropertyValue.call(lmain);
		    		
		    		var r1 = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		r1.type = "panel";
		    		r1.name = "panel_top";
		    		r1.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
		    		r1.properties.Name = "panel_top";
		    		r1.properties.layout = "fit";
		    		
		    		r1.updatePropertyValue.call(r1);
		    		
		    		var r2 = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		r2.type = "panel";
		    		r2.name = "panel_bottom";
		    		r2.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
		    		r2.properties.Name = "panel_bottom";
		    		r2.properties.layout = "fit";
		    		
		    		r2.updatePropertyValue.call(r2);
			    	
			    	lmain.layout.push(r1);
			    	lmain.layout.push(r2);
			    	
	    			nlayout = [
	    				ctrl_title,
	    				lmain
	    			];
	    			break;
	    		case "2by1table":
	    			var lmain = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		lmain.type = "panel";
		    		lmain.name = "panel_main";
		    		lmain.position = {top: 30, left: 5, right: 5, bottom: 5};
		    		lmain.properties.Name = "panel_main";
		    		lmain.properties.layout = "vertical";
		    		
		    		lmain.updatePropertyValue.call(lmain);
		    		
		    		var r1 = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		r1.type = "panel";
		    		r1.name = "panel_top";
		    		r1.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
		    		r1.properties.Name = "panel_top";
		    		r1.properties.layout = "horizontal";
		    		
		    		r1.updatePropertyValue.call(r1);
		    		
		    		var r1_left = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		r1_left.type = "panel";
		    		r1_left.name = "panel_top_left";
		    		r1_left.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
		    		r1_left.properties.Name = "panel_top_left";
		    		r1_left.properties.layout = "fit";
		    		
		    		r1_left.updatePropertyValue.call(r1_left);
		    		
		    		var r1_right = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		r1_right.type = "panel";
		    		r1_right.name = "panel_top_right";
		    		r1_right.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
		    		r1_right.properties.Name = "panel_top_right";
		    		r1_right.properties.layout = "fit";
		    		
		    		r1_right.updatePropertyValue.call(r1_right);
		    		
		    		r1.layout.push(r1_left);
		    		r1.layout.push(r1_right);
		    		
		    		var r2 = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		r2.type = "panel";
		    		r2.name = "panel_bottom";
		    		r2.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
		    		r2.properties.Name = "panel_bottom";
		    		r2.properties.layout = "fit";
		    		
		    		r2.updatePropertyValue.call(r2);
			    	
			    	lmain.layout.push(r1);
			    	lmain.layout.push(r2);
			    	
	    			nlayout = [
	    				ctrl_title,
	    				lmain
	    			];
	    			break;
	    		case "collapseborder":
	    			var lmain = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		lmain.type = "panel";
		    		lmain.name = "panel_main";
		    		lmain.position = {top: 30, left: 5, right: 5, bottom: 5};
		    		lmain.properties.Name = "panel_main";
		    		lmain.properties.layout = "border";
		    		
		    		lmain.updatePropertyValue.call(lmain);
		    		
		    		nlayout = [
		    			ctrl_title,
		    			lmain
		    		]
	    			break;
	    		case "portal":
	    			var lmain = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		lmain.type = "panel";
		    		lmain.name = "panel_main";
		    		lmain.position = {top: 30, left: 5, right: 5, bottom: 5};
		    		lmain.properties.Name = "panel_main";
		    		lmain.properties.layout = "portal";
		    		
		    		lmain.updatePropertyValue.call(lmain);
		    		
		    		nlayout = [
		    			ctrl_title,
		    			lmain
		    		]
	    			break;
	    		case "3by1table":
	    			var lmain = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		lmain.type = "panel";
		    		lmain.name = "panel_main";
		    		lmain.position = {top: 30, left: 5, right: 5, bottom: 5};
		    		lmain.properties.Name = "panel_main";
		    		lmain.properties.layout = "vertical";
		    		
		    		lmain.updatePropertyValue.call(lmain);
		    		
		    		var r1 = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		r1.type = "panel";
		    		r1.name = "panel_top";
		    		r1.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
		    		r1.properties.Name = "panel_top";
		    		r1.properties.layout = "vertical";
		    		
		    		r1.updatePropertyValue.call(r1);
		    		
		    		var r1_top = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		r1_top.type = "panel";
		    		r1_top.name = "panel_1";
		    		r1_top.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
		    		r1_top.properties.Name = "panel_1";
		    		r1_top.properties.layout = "fit";
		    		
		    		r1_top.updatePropertyValue.call(r1_top);
		    		
		    		var r1_middle = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		r1_middle.type = "panel";
		    		r1_middle.name = "panel_2";
		    		r1_middle.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
		    		r1_middle.properties.Name = "panel_2";
		    		r1_middle.properties.layout = "fit";
		    		
		    		r1_middle.updatePropertyValue.call(r1_middle);
		    		
		    		var r1_bottom = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		r1_bottom.type = "panel";
		    		r1_bottom.name = "panel_3";
		    		r1_bottom.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
		    		r1_bottom.properties.Name = "panel_3";
		    		r1_bottom.properties.layout = "fit";
		    		
		    		r1_bottom.updatePropertyValue.call(r1_bottom);
		    		
		    		r1.layout.push(r1_top);
		    		r1.layout.push(r1_middle);
		    		r1.layout.push(r1_bottom);
		    		
		    		var r2 = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
		    		r2.type = "panel";
		    		r2.name = "panel_bottom";
		    		r2.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
		    		r2.properties.Name = "panel_bottom";
		    		r2.properties.layout = "fit";
		    		
		    		r2.updatePropertyValue.call(r2);
			    	
			    	lmain.layout.push(r1);
			    	
	    			nlayout = [
	    				ctrl_title,
	    				lmain
	    			];
	    			break;
	    		}
	    		
				this._9/*framecontent*/.controls = {};
	
	    		this._9/*framecontent*/.layout = nlayout;
	    		layout_preview.M3/*layoutControls*/.call(layout_preview);
	    		this.F5/*updateFrameContentControls*/(null, this._9/*framecontent*/.layout);
	    		
	    		this.rootctrl = [];
	    		this.F3/*updateRootLayout*/(null, this._9/*framecontent*/.layout, this.rootctrl);
	    		
	    		ctrl_layout.store.setRootNode({
					expanded: true,
					text: "Root Layout",
					name: "Root Layout",
					children: this.rootctrl
				});
				
				var dom  = $(layout_preview.body.dom),
					rect = {x: 0, y: 0, w: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dom), h: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(dom)},
					padding = {t:0,b:0,l:0,r:0};
				dom.empty();
				
				if (this.dummyInfo)
				{
					this.dummyInfo.remove();
				}
											
				this.F2/*validateLayoutControls*/(null, this._9/*framecontent*/.layout, dom, rect, padding);
				
				this.dummyInfo = $("<div class='dummyinfo'></div>");
				this.dummyInfo.appendTo(dom);
				this.dummyInfo.hide();
	    	}
	    },
	    
	    _l2/*removeControl*/: function(ctrlname, rec) {
	    	var i,
	    		ret = false,
	    		panel = this,
	    		rctrl = this._l4/*getLayoutItem*/(ctrlname, this._9/*framecontent*/.layout),
	    		ct;
	    	
	    	if (rctrl != null)
	    	{
	    		for (i=0; i < rctrl.length; i++)
	    		{
	    			if (rctrl[i].name == ctrlname)
	    			{
	    				ct = rctrl[i];
	    				ct.dummy.html.remove();
	    				this._l3/*deleteSubControl*/(ct);
	    				rctrl.splice(i, 1);
	    				delete this._9/*framecontent*/.controls[ctrlname];
	    				
	    				var pctrl = this.F8/*getControlByName*/(ct.pname);
	    				
	    				if (pctrl != null && pctrl.type == "panel" && pctrl.properties.layout == "border")
	    				{
	    					var region = ct.properties.region,
	    						regionname;
	    						
	    					switch (region)
	    					{
	    					case "center":
	    						regionname = "Center";
	    						break;
	    					case "north":
	    						regionname = "North";
	    						break;
	    					case "south":
	    						regionname = "South";
	    						break;
	    					case "east":
	    						regionname = "East";
	    						break;
	    					case "west":
	    						regionname = "West";
	    						break;
	    					}
	    					rec.set("type", "blank");
	    					rec.set("region", "region");
	    					rec.set("name", regionname);
	    					rec.removeAll();
	    					ret = false;
	    				}
	    				else
	    				{
	    					ret = true;
	    				}
	    				break;
	    			}
	    		}
	    	}
	    	
	    	var layout_preview = panel.down("[name=layout_preview]"),
				dom  = $(layout_preview.body.dom),
				rect = {x: 0, y: 0, w: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dom), h: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(dom)},
				padding = {t:0,b:0,l:0,r:0};
			
			
			panel.F2/*validateLayoutControls*/.call(panel, null, panel._9/*framecontent*/.layout, dom, rect, padding);
	    			
	    	return ret;
	    },
	    
	    _l3/*deleteSubControl*/: function(ctrl) {
	    	var i, mitem;
	    	
	    	if (ctrl && ctrl.layout && ctrl.layout.length > 0)
	    	{
	    		for (i=ctrl.layout.length-1; i>=0; i--)
	    		{
	    			mitem = this._9/*framecontent*/.controls[ctrl.layout[i].name];
	    			mitem.dummy.html.remove(); 
	    			delete this._9/*framecontent*/.controls[ctrl.layout[i].name];
	    			if (ctrl.layout[i].layout && ctrl.layout[i].layout.length > 0)
	    			{
	    				this._l3/*deleteSubControl*/(ctrl.layout[i]);
	    			}
	    			ctrl.layout.splice(i, 1);
	    		}
	    	}
	    },
	    
	    _l4/*getLayoutItem*/: function(ctrlname, layout) {
	    	var r = null,
	    		i;
	    	
	    	for (i=0; i < layout.length; i++)
	    	{
	    		if (layout[i].name == ctrlname)
	    		{
	    			r = layout;
	    		}
	    		else if (layout[i].layout && layout[i].layout.length > 0)
	    		{
	    			r = this._l4/*getLayoutItem*/(ctrlname, layout[i].layout);
	    		}
	    		
	    		if (r != null)
				{
					break;
				}
	    	}
	    	
	    	return r;
	    },
	    
	    F5/*updateFrameContentControls*/: function(pctrl, layout) {
	    	var i;
	    	for (i=0; i < layout.length; i++)
	    	{
	    		layout[i].pname = (pctrl) ? pctrl.name : null;
	    		
	    		this._9/*framecontent*/.controls[layout[i].name] = layout[i];
	    		
	    		if (layout[i].layout && layout[i].layout.length > 0)
	    		{
	    			this.F5/*updateFrameContentControls*/(layout[i], layout[i].layout);
	    		}
	    	}
	    },
	    
	/* save content */
	    fV6/*saveContent*/: function(uid, content) {
	    	var panel = this;
	    	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
	    	req.init(panel, 
				{
		            ack: "31",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
		            mbody: content
		        }, panel, panel.rs_fV6/*saveContent*/, null);
			req._l/*request*/();
	    },
	    
	    rs_fV6/*saveContent*/: function(xdoc) {
	    	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_SAVED'), null, null, 0, "success");
	    },
	    
	    $f1/*saveAsContent*/: function() {
	    	var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({mode: 'newitem'});
			dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.$f2/*saveNewContent*/);
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	    },
	    
	    $f2/*saveNewContent*/: function(item) {
	    	var panel = this,
	    		contentxml = this._9/*framecontent*/.getXML(),
	    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
	    		
			req.init(panel, 
				{
	                ack: "31",
		            payload: "<smsg><item address='" + item.nodepath + "/" + item.name + "' name='" + item.name + "' type='" + (this.itemtype ? this.itemtype : 'Dashboard') + "' pid='" + item.uid + "' description=''/></smsg>",
		            mbody: contentxml //IG$/*mainapp*/._I2e/*getItemOption*/()
	            }, panel, panel._IO5/*rs_processMakeMetaItem*/, item.name);
		    req._l/*request*/();
	    },
	    
	    _IO5/*rs_processMakeMetaItem*/: function(xdoc, itemname) {
	    	var i,
	    		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item'),
	    		name = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'name');
	    		
	    	this.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'uid');
	    	this.setTitle(name);
	    },
	/* endof save content */
	
		F6/*layoutControlSelectedHandler*/: function(data) {
			var me = this,
				propgrid = me.down("[name=propgrid]"),
				ctrlname,
				key,
				ctrl,
				propsource = {},
				propconfig = {},
				layout_preview = me.down("[name=layout_preview]"),
				// _2 = me.down("[name=_2]"),
				b_report = me.down("[name=b_report]"),
				b_tmpl = me.down("[name=b_tmpl]"),
				b_grid = me.down("[name=b_grid]"),
				b_itemname = me.down("[name=b_itemname]"),
				dom = $(layout_preview.body.dom),
				pconf,
				tpos = {width: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dom), height: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(dom)};
			
	        if (me.ecname != null)
	        {
	        	me.F7a/*setControlProp*/(me.ecname);
	        }
	        
	        // _2.hide();
	        b_report.hide();
	        b_tmpl.hide();
			b_grid.hide();
			
	        b_itemname.setValue("");
	        
			// for (key in me._9/*framecontent*/.controls) {
				// me._9/*framecontent*/.controls[key].dummy.html.css({border: "1px solid #99BBE8", backgroundColor: "#ffffff"});
			// }
	        
	
	        if (data.root == false)
	        {
	        	ctrlname = data.name;
	        	
	        	ctrl = me._9/*framecontent*/.controls[ctrlname];
	        	
	        	if (ctrl)
	        	{
					switch (ctrl.type)
					{
					case "olapreport":
					case "compositereport":
						b_report.setFieldLabel(IRm$/*resources*/.r1("L_SEL_RPT"));
						b_report.show();
						break;
					case "dashboard":
						b_report.setFieldLabel(IRm$/*resources*/.r1("L_SEL_DBD"));
						b_report.show();
						break;
					case "intgrid":
						b_grid.show();
						break;
					case "combobox":
						// me.down("[name=t_codemap]").setValue(ctrl.item ? ctrl.item.name : "");
						break;
					case "picture":
					case "image":
						break;
					case "sheetfilter":
						break;
					}
	
	        		// ctrl.dummy.html.css({border: "2px solid #e14c68", backgroundColor: "#d9e4cd"});
	        		layout_preview.showDummyInfo.call(layout_preview, ctrl);
	        		pconf = me.F7/*getControlProp*/(ctrl.type, ctrl.properties);
	        		propsource = pconf.prop; 
	        		propconfig = pconf.conf;
	        		ctrl.item && b_itemname.setValue(ctrl.item.name);
	        		me.pot.setControlPosition.call(me.pot, ctrl.position, (ctrl.parentctrl) ? ctrl.parentctrl.position : tpos);
	        	}
	        	
	        	me.ecname = ctrlname;
	        }
	        else
	        {
	        	b_tmpl.show();
	        	
	        	propsource = {
					minwidth: me._9/*framecontent*/.minwidth || 500,
					minheight: me._9/*framecontent*/.minheight || 500,
					autowidth: typeof(me._9/*framecontent*/.autowidth) == "undefined" ? true : me._9/*framecontent*/.autowidth,
					autoheight: typeof(me._9/*framecontent*/.autoheight) == "undefined" ? true : me._9/*framecontent*/.autoheight,
					vscroll: typeof(me._9/*framecontent*/.vscroll) == "undefined" ? true : me._9/*framecontent*/.vscroll,
					hscroll: typeof(me._9/*framecontent*/.hscroll) == "undefined" ? true : me._9/*framecontent*/.hscroll,
					width: me._9/*framecontent*/.width || 800,
					height: me._9/*framecontent*/.height || 600,
					background: me._9/*framecontent*/.background || "",
					cls: me._9/*framecontent*/.cls || ""
				};
	        	me.ecname = "__dashboard__";
	        }
	        
	    	propgrid.setSource(propsource, propconfig);
		},
		
		F7a/*setControlProp*/: function(ctrlname) {
			var me = this,
				propgrid = me.down("[name=propgrid]"),
				prop = propgrid.getSource(),
				ctrl = (ctrlname == "__dashboard__") ? null : me._9/*framecontent*/.controls[ctrlname];
			
			if (ctrl)
			{
				$.each(prop, function(index, key) {
					ctrl.properties[index] = prop[index] ;
				});
				
				ctrl.dummy && ctrl.dummy.__pcinit.call(ctrl.dummy);
			}
			else if (ctrlname == "__dashboard__")
			{
				$.each(prop, function(index, key) {
					me._9/*framecontent*/[index] = prop[index];
				})
			}
		},
		
		F7/*getControlProp*/: function(ctrltype, baseprop) {
			var prop = {},
				conf = {},
				dbase = new IG$/*mainapp*/._ICc/*clControlItem*/(null, null),
				dummy = dbase.getControl(ctrltype.toLowerCase()),
				i, pobj, j,
				_9/*framecontent*/ = this._9/*framecontent*/,
				pname, pvalue, ptype,
				dp;
			
			// base property setting
			prop.Name = baseprop.Name;
			
			baseprop.visible = (typeof(baseprop.visible) == "undefined" || baseprop.visible == null) ? true : baseprop.visible;
			baseprop.border = (typeof(baseprop.border) == "undefined" || baseprop.border == null) ? 1 : baseprop.border;
			baseprop.bordercolor = (typeof(baseprop.bordercolor) == "undefined" || baseprop.bordercolor == null) ? "#e5e5e5" : baseprop.bordercolor;
			baseprop.backgroundcolor = (typeof(baseprop.backgroundcolor) == "undefined" || baseprop.backgroundcolor == null) ? "#ffffff" : baseprop.backgroundcolor;
			baseprop.padding = (typeof(baseprop.padding) == "undefined" || baseprop.padding == null) ? 2 : baseprop.padding;
			
			if (dummy && dummy.p)
			{
				for (i=0; i < dummy.p.length; i++)
				{
					pobj = dummy.p[i];
					if (pobj.type == "property")
					{
						pname = pobj.name;
						ptype = pobj.datatype;
						
						pvalue = dummy[pname];
						
						if (baseprop[pname] != null && typeof baseprop[pname] != 'undefined')
						{
							pvalue = baseprop[pname];
						}
						
						switch (ptype)
						{
						case "string":
							pvalue = (pvalue) ? pvalue : "";
							if (pobj["enum"])
							{
								if (pobj["enum"] == "resources")
								{
									dp = [];
									
									for (j=0; j < _9/*framecontent*/.rcs.length; j++)
									{
										dp.push({
											name: _9/*framecontent*/.rcs[j].name,
											value: _9/*framecontent*/.rcs[j].uid
										});
									}
									
									conf[pname] = {
										editor: {
											xtype: "combobox",
											displayField: "name",
											valueField: "value",
											queryMode: "local",
											editable: false,
											store: {
												fields: [
													{name: "name", mapping: "name"},
													{name: "value", mapping: "value"}
												],
												data: dp
											}
										}
									}
								}
								else if (pobj["enum"].length > 0)
								{
									conf[pname] = {
										editor: {
											xtype: "combobox",
											displayField: "name",
											valueField: "value",
											queryMode: "local",
											editable: false,
											store: {
												fields: ["name", "value"],
												data: pobj["enum"]
											}
										}
									}
								}
							}
							break;
						case "number":
							pvalue = (pvalue != null && typeof pvalue != 'undefined') ? Number(pvalue) : Number.NaN;
							break;
						case "boolean":
							pvalue = (pvalue != null && typeof pvalue != 'undefined' && pvalue == true) ? true : false; 
							break;
						}
						
						prop[pname] = pvalue;
					}
				}
			}
			
			return {
				prop: prop,
				conf: conf
			};
		},
		
		F8/*getControlByName*/: function(ctrlname) {
			var ctrl = null,
				controls = this._9/*framecontent*/.controls;
				
			$.each(controls, function(index, key) {
				if (controls[index].name == ctrlname)
				{
					ctrl = controls[index];
					return false;
				}
			});
			
			return ctrl;
		},
		
		F9/*getUniqueControlIndex*/: function(ctrltype) {
			var i,
				seq = 0,
				ctrlname,
				controls = this._9/*framecontent*/.controls;
			
			$.each(controls, function(index, key) {
				if (controls[index].type == ctrltype || controls[index].name.substring(0, ctrltype.length) == ctrltype)
				{
					ctrlname = controls[index].name;
					if (ctrlname.indexOf("_") > -1)
					{
						ctrlname = ctrlname.substring(ctrlname.indexOf("_") + 1);
						if (ctrlname != "" && IG$/*mainapp*/._I37/*isNumber*/(ctrlname) == true)
						{
							seq = Math.max(Number(ctrlname)+1, seq);
						}
					}
				}
			});
			
			return seq;
		},
		
		_1/*dummyResized*/: function(l) {
			var me = this,
				data = {
					root: false,
					name: l.name
				};
			
			me.F6/*layoutControlSelectedHandler*/(data);
		},
		
		_2/*dummyFocused*/: function(l) {
			var me = this,
				data = {
					root: false,
					name: l.name
				};
			
			me.F6/*layoutControlSelectedHandler*/(data);
		},
		
		initComponent: function() {
			var panel = this;
			
			var ctrl_data = {
				"children":
				[
					{
						text: "Static Widget",
						iconCls: "task-folder",
						expanded: false,
						children: [
							{
								text: "Picture",
								type: "image",
								leaf: true
							},
							{
								text: "Label",
								type: "label",
								leaf: true
							},
							{
								text: "Title",
								type: "titlelabel",
								leaf: true
							}
							
						]
					},
					{
						text: "Form Widget",
						expanded: false,
						children: [
							{
								text: "Text input",
								type: "textbox",
								leaf: true
							},
							{
								text: "Text area",
								type: "textarea",
								leaf: true
							},
							{
								text: "Combobox",
								type: "combobox",
								leaf: true
							},
							{
								text: "Checkbox",
								type: "checkbox",
								leaf: true
							},
							{
								text: "Date chooser",
								type: "datechooser",
								leaf: true
							},
							{
								text: "Month chooser",
								type: "monthchooser",
								leaf: true
							},
							{
								text: "Button",
								type: "button",
								leaf: true
							}
						]
					},
					{
						text: "Data Viewers",
						expanded: false,
						children: [
							{
								text: "Report view",
								type: "olapreport",
								leaf: true
							},
							{
								text: "Dashboard",
								type: "dashboard",
								leaf: true
							},
							{
								text: "Filter view",
								type: "sheetfilter",
								leaf: true
							},
							{
								text: "Prompt Filters",
								type: "promptfilter",
								leaf: true
							},
							{
								text: "Interactive Grid",
								type: "grid",
							 	leaf: true
							},
							{
								text: "Pivot Filter",
								type: "pivotfilter",
							 	leaf: true
							},
							{
								text: "Pivot Design",
								type: "pivotdesign",
								leaf: true
							}
						]
					},
					{
						text: "Container",
						expanded: false,
						children: [
							{
								text: "Panel",
								type: "panel",
								leaf: true
							},
							{
								text: "TabPanel",
								type: "tabpanel",
								leaf: true
							},
							{
							 	text: "Browser",
							 	type: "browser",
							 	leaf: true
							}
						]
					}
				]
			};
			
	        $s.apply(this, {
				tbar: [
					{
		            	iconCls: "icon-toolbar-save",
		            	tooltip: IRm$/*resources*/.r1("L_SAVE_REPORT"),
		            	hidden: this.writable == true || this.uid == "" ? false : true,
		            	handler: function() {
		            		this._t$/*toolbarHandler*/("cmd_save"); 
		            	},
		            	scope: this
		            },
					
					{
			        	iconCls: "icon-toolbar-saveas",
			        	tooltip: IRm$/*resources*/.r1("L_SAVE_REPORT_AS"),
			        	handler: function() {
			        		this._t$/*toolbarHandler*/("cmd_saveas"); 
			        	},
			        	scope: this
			        },
			        "-",
			        {
			        	iconCls: "icon-refresh",
			        	tooltip: "Reload",
			        	hidden: false,
			        	handler: function() {
			        		this._t$/*toolbarHandler*/("cmd_reload"); 
			        	},
			        	scope: this
			        },
			        
			        
			        
			        {
			        	iconCls: "icon-toolbar-runreport",
			        	tooltip: "Test",
			        	hidden: false,
			        	handler: function() {
			        		this._t$/*toolbarHandler*/("cmd_run"); 
			        	},
			        	scope: this
			        }
			        
	//		        "-",
			        
	//		        {
	//		        	iconCls: 'icon-toolbar-event',
	//		        	text: IRm$/*resources*/.r1('L_EVENT_WIZARD'),
	//		        	tooltip: IRm$/*resources*/.r1('L_EVENT_WIZARD'),
	//		        	hidden: true,
	//		        	handler: function() {
	//		        		this._t$/*toolbarHandler*/("cmd_event"); 
	//		        	},
	//		        	scope: this
	//		        },
			        
			        
	//		        {
	//		        	// iconCls: 'icon-toolbar-script',
	//		        	name: "_2",
	//		        	hidden: true,
	//		        	text: IRm$/*resources*/.r1('L_MAP_ITEM'),
	//		        	tooltip: IRm$/*resources*/.r1('L_MAP_ITEM'),
	//		        	handler: function() {
	//		        		this._t$/*toolbarHandler*/("cmd_map"); 
	//		        	},
	//		        	scope: this
	//		        },
			        
	//		        {
	//		        	text: IRm$/*resources*/.r1('L_DBD_MAP'),
	//		        	tooltip: IRm$/*resources*/.r1('L_DBD_MAP'),
	//		        	handler: function() {
	//		        		this._t$/*toolbarHandler*/("cmd_var"); 
	//		        	},
	//		        	scope: this
	//		        },
			        
//			        "->",
//			        {
//			        	iconCls: "icon-toolbar-help",
//			        	tooltip: IRm$/*resources*/.r1("B_HELP"),
//			        	handler: function() {
//			        		IG$/*mainapp*/._I63/*showHelp*/("P0006");
//			        	}
//			        }
				],
				items: [
					{
						"layout": "border",
						border: 0,
						items: [
							{
								"layout": "border",
								region: "west",
								split: true,
								collapsible: true,
								border: true,
								title: "Widgets",
								width: 180,
								items: [
									{
										xtype: "treepanel",
										title: "Widget",
										preventHeader: true,
										region: "north",
										split: true,
										border: false,
										flex: 1,
										rootVisible: false,
										hideHeaders: true,
										autoScroll: true,
										store: {
											xtype: "treestore",
											fields: [
												"name", "text", "type", "pname", "region", "custom"
											],
											proxy: {
												type: "memory",
												reader: {
													type: "json",
													root: "children"
												}
											},
											root: {
												expanded: true,
												text: "Controls",
												children: ctrl_data.children
											},
											folderSort: true
										},
										enableDragDrop: true,
										enableDD: true,
										useArrows: true,
										ddGroup: "_I$RD_G_",
										viewConfig: {
											plugins: {
												ptype: 'gridviewdragdrop',
												ddGroup: '_I$RD_G_'
											},
											listeners: {
												beforedrop: function(node, data, dropRec, dropPosition, dropFunction) {
												},
												drop: function(node, data, dropRec, dropPosition) {
												}
											}
										},
										columns: [
											{
												xtype: "treecolumn",
												text: "text",
												flex: 2,
												sortable: false,
												dataIndex: "text"
											}
										]
									},
									{
										xtype: "treepanel",
										name: "ctrl_layout",
										title: "Layout",
										region: "center",
										split: true,
										flex: 1,
										rootVisible: true,
										autoScroll: true,
										hideHeaders: true,
										enableDragDrop: true,
										enableDD: true,
										useArrows: true,
										ddGroup: "_I$RD_G_",
										store: {
											xtype: "treestore",
											fields: [
												"name", "text", "type", "pname", "region", "custom"
											],
											proxy: {
												type: "memory",
												reader: {
													type: "json",
													root: "children"
												}
											},
											root: {
												expanded: true,
												text: "Controls",
												children: []
											},
											folderSort: false
										},
										columns: [
											{
												xtype: "treecolumn",
												text: "Name",
												flex: 1,
												sortable: false,
												dataIndex: "name"
											},
											{
												xtype: 'actioncolumn',
												width: 20,
												items: [
													{
														// icon: './images/delete.png',
														iconCls: "icon-grid-delete",
														tooltip: 'Delete item',
														handler: function (grid, rowIndex, colIndex) {
															var rec = grid.store.getAt(rowIndex),
																dt,
																ctrl,
																pctrl = null;
															
															if (rec)
															{
																dt = rec.data;
																ctrl = panel.F8/*getControlByName*/.call(panel, dt.name);
																												
																if (panel._l2/*removeControl*/.call(panel, dt.name, rec) == true)
																{
																	rec.remove();
																}
															}
														}
				//										getClass: function(v, metadata, r, rowIndex, colIndex, store) {
				//											if (rowIndex == 0 || (r.data && r.data.type == "blank"))
				//											{
				//												return "idv-hd-val";
				//											}
				//											return "";
				//										}
													}
												]
											}
										],
										viewConfig: {
											plugins: {
												ptype: "gridviewdragdrop",
												ddGroup: "_I$RD_G_"
											},
											listeners: {
												beforedrop: function(node, data, dropRec, dropPosition, dropFunction) {
													var r = false,
														ctrl_layout = panel.down("[name=ctrl_layout]"),
														rc = data.records[0],
														ds = rc.data,
														dt = dropRec.data,
														i, bexist = false, ret = false, isblank = false, 
														robj, nobjname, npanel = null, nobj,
														urecord, 
														proxy = ctrl_layout.store.getProxy(),
														reader = proxy.getReader(),
														appendmode = 0,
														insertposition = 0,
														dragctrl = panel.F8/*getControlByName*/.call(panel, ds.name),
														dropctrl = panel.F8/*getControlByName*/.call(panel, dropRec.get("name")),
														doref = false;
														
													if (!reader)
														reader = proxy.getReader();
														
													(this == data.view) ? data.copy = false : data.copy = true;
													
													if ((ds.type == "Report" || ds.type == "CompositeReport") &&
														(dt.type == "chart" || dt.type == "olapreport"))
													{
														dropctrl.item = {
															name: ds.name,
															uid: ds.uid,
															updatedate: ds.updatedate,
															nodepath: ds.nodepath,
															cubeuid: null
														};
														
														panel._9/*framecontent*/.regReportContent.call(panel._9/*framecontent*/, dropctrl.item);
														panel.updateCubeUID.call(panel);
													}
													else if (dt.type == "blank" && data.copy == false)
													{
														ret = false;
													}
													else if (dt.type == "blank" && data.copy == true)
													{
														isblank = true;
														npanel = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
														npanel.type = "panel";
														npanel.name = "panel_" + panel.F9/*getUniqueControlIndex*/.call(panel, "panel");
														npanel.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
														switch (data.region)
														{
														case "east":
															npanel.position.percentwidth = null;
															npanel.position.width = 100;
															break;
														case "west":
															npanel.position.percentwidth = null;
															npanel.position.width = 100;
															break;
														case "north":
															npanel.position.percentheight = null;
															npanel.position.height = 100;
															break;
														case "south":
															npanel.position.percentheight = null;
															npanel.position.height = 100;
															break;
														case "center":
															break;
														}
														npanel.properties.Name = npanel.name;
														npanel.properties.region = dt.region;
														
														npanel.updatePropertyValue.call(npanel);
														
														dropRec.set("type", "panel");
														dropRec.set("name", npanel.name);
														
														var pctrl = panel.F8/*getControlByName*/.call(panel, dropRec.get("pname"));
														
														if (pctrl)
														{
															npanel.pname = pctrl.name;
															panel._9/*framecontent*/.controls[npanel.name] = npanel;
															pctrl.layout.push(npanel);
														}
														
														urecord = dropRec;
														
														if (ds.type != "panel" && ds.type != "tabpanel")
														{
															appendmode = 1;
															insertposition = 0;
														}
														ret = false;
													}
													else if (data.copy == true)
													{
														if ((dropctrl.type == "panel" || dropctrl.type == "tabpanel") && (dropRec.isExpanded() == true || dropRec.hasChildNodes() == false) && dropPosition == "after")
														{
															urecord = dropRec;
														}
														else 
														{
															urecord = dropRec.parentNode;
														}
														
														npanel = (urecord.data.root == true) ? panel._9/*framecontent*/ : panel.F8/*getControlByName*/.call(panel, urecord.get("name"));
														
														appendmode = 1;
														ret = false;
													}
													else if (data.copy == false)
													{
														// move node
														if (ds.root == false)
														{
															insertposition = 0;
															if ((dropctrl.type == "panel" || dropctrl.type == "tabpanel") && (dropRec.isExpanded() == true || dropRec.hasChildNodes() == false) && dropPosition == "after")
															{
																urecord = dropRec;
																insertposition = 0;
															}
															else 
															{
																urecord = dropRec.parentNode;
																insertposition = urecord.indexOf(dropRec);
																
																if (dropPosition == "after")
																{
																	insertposition++;
																}
															}
															
															var pctrl = panel.F8/*getControlByName*/.call(panel, dragctrl.pname);
															if (!pctrl && (dragctrl.pname == null || dragctrl.pname == ""))
															{
																pctrl = panel._9/*framecontent*/;
															}
															
															npanel = (urecord.data.root == true) ? panel._9/*framecontent*/ : panel.F8/*getControlByName*/.call(panel, urecord.get("name"));
															
															for (i=0; i < pctrl.layout.length; i++)
															{
																if (pctrl.layout[i].name == dragctrl.name)
																{
																	pctrl.layout.splice(i, 1);
																	break;
																}
															}
															
															dragctrl.pname = (urecord.data.root == true) ? null : npanel.name;
															npanel.layout.splice(insertposition, 0, dragctrl);
															
															rc.remove();
															urecord.insertChild(insertposition, rc);
															
															doref = true;
														}
														
														ret = false;
													}
													
													if (appendmode == 1)
													{
														// if drop on panel and has layout
														var urecctrl = (urecord.data.root == true) ? null : panel.F8/*getControlByName*/.call(panel, urecord.get("name"));
														
														if (urecctrl != null && (urecctrl.type == "panel" || urecctrl.type == "tabpanel"))
														{
															switch (urecctrl.properties.layout)
															{
															case "portal":
																break;
															case "border":
																break;
															case "fit":
																// panel.removeAllControls.call(panel, urecord);
																break;
															}
														}
	
														nobjname = ds.type + "_" + panel.F9/*getUniqueControlIndex*/.call(panel, ds.type);
														robj = {name: nobjname, type: ds.type, pname: (urecctrl != null) ? npanel.name : "", leaf: (ds.type == "panel" || ds.type == "tabpanel" ? false : true)};
	
														nobj = new IG$/*mainapp*/._ID1/*frameControl*/(null, null);
														nobj.type = robj.type;
														nobj.name = nobjname;
														nobj.position = {top: 0, left: 0, percentwidth: 100, percentheight: 100};
														nobj.properties.Name = nobj.name;
														
														nobj.updatePropertyValue.call(nobj);
														
														nobj.pname = robj.pname;
														panel._9/*framecontent*/.controls[nobj.name] = nobj;
														npanel.layout.push(nobj);
														
														var nrecord = reader.extractData.call(reader, [robj], true);
														ctrl_layout.store.fillNode.call(ctrl_layout.store, urecord, nrecord);
														
														doref = true;
													}
													
													if (doref == true)
													{
														var layout_preview = panel.down("[name=layout_preview]"),
															dom  = $(layout_preview.body.dom),
															rect = {x: 0, y: 0, w: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dom), h: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(dom)},
															padding = {t:0,b:0,l:0,r:0};
														
														panel.F2/*validateLayoutControls*/.call(panel, null, panel._9/*framecontent*/.layout, dom, rect, padding);
													}
													
													return ret;
												},
												drop: function(node, data, dropRec, dropPosition) {
													var sc = false,
														dt = data.records[0].data;
														
													return sc;
												}
											}
										},
										listeners: {
											itemclick: function(view, record, item, index, e) {
												var me = this,
													data = record.data;
												me.F6/*layoutControlSelectedHandler*/.call(me, data);
											},
											scope: this
										}
									}
								]
							},
							{
								region: "center",
								border: 0,
								name: "m_mview",
								"layout": {
									type: "card",
									deferredRender: false
								},
								items: [
									{
										name: "l_1",
										sl: "layout_preview",
										border: 0,
										layout: {
											type: "card",
											deferredRender: false
										},
										items: [
											new IG$/*mainapp*/._IBf/*DashboardView*/({
												name: "layout_preview",
												_dE/*dashboardEditor*/: this,
												dsmode: 1,
												border: 0,
												header: false,
												sm: 0
											}),
											new IG$/*mainapp*/.cm1/*view_source*/({
												name: "l_code",
												sm: 1
											})
										]
									},
									{
										name: "l_2",
										sl: "m_code",
										layout: {
											type: "card",
											deferredRender: false
										},
										items: [
											new IG$/*mainapp*/._Ifd/*layoutWizard*/({
												name: "m_code_",
												sm: 0
											}),
											new IG$/*mainapp*/._IAe/*scriptWizard*/({
												name: "m_code",
												sm: 1
											})
										]
									},
									new IG$/*mainapp*/._dR/*dashboard_rcsmgr*/({
										name: "l_3",
										sl: "m_res",
										cmode: "page"
									})
								],
								tbar: [
									{
										text: IRm$/*resources*/.r1("L_DESIGN"),
										name: "t_m1",
										pressed: 1,
										handler: function() {
											var me = panel,
												m_mview = me.down("[name=m_mview]"),
												l = m_mview.getLayout(),
												sid,
												r,
												t_c1 = panel.down("[name=t_c1]"),
												t_c2 = panel.down("[name=t_c2]"),
												lname = l.getActiveItem().name;
												
											if (lname != "l_1")
											{
												if (lname == "l_3")
												{
													r = l.getActiveItem().commitCode();
												}
												else
												{
													r = l.getActiveItem().getLayout().getActiveItem().commitCode();
												}
												
												if (r)
												{
													this.toggle(true);
													panel.down("[name=t_m2]").toggle(false);
													panel.down("[name=t_m3]").toggle(false);
													l.setActiveItem(0);
													m_mview.sl = "l_1";
													sid = panel.down("[name=" + m_mview.sl + "]").getLayout().getActiveItem().sm;
													t_c1.setVisible(true);
													t_c2.setVisible(true);
													t_c1.toggle(sid == 0 ? true : false);
													t_c2.toggle(sid == 1 ? true : false);
													
													l.getActiveItem().getLayout().getActiveItem().refreshCode();
												}
											}
										}
									},
									{
										text: IRm$/*resources*/.r1("L_CONTROLLER"),
										name: "t_m2",
										handler: function() {
											var m_mview = panel.down("[name=m_mview]"),
												l = m_mview.getLayout(),
												sid,
												r,
												t_c1 = panel.down("[name=t_c1]"),
												t_c2 = panel.down("[name=t_c2]"),
												lname = l.getActiveItem().name;
											
											if (lname != "l_2")
											{
												if (lname == "l_3")
												{
													r = l.getActiveItem().commitCode();
												}
												else
												{
													r = l.getActiveItem().getLayout().getActiveItem().commitCode();
												}
												
												if (r)
												{
													this.toggle(true);
													panel.down("[name=t_m1]").toggle(false);
													panel.down("[name=t_m3]").toggle(false);
													
													l.setActiveItem(1);
													m_mview.sl = "l_2";
													sid = panel.down("[name=" + m_mview.sl + "]").getLayout().getActiveItem().sm;
													t_c1.setVisible(true);
													t_c2.setVisible(true);
													t_c1.toggle(sid == 0 ? true : false);
													t_c2.toggle(sid == 1 ? true : false);
													
													l.getActiveItem().getLayout().getActiveItem().refreshCode();
												}
											}
										}
									},
									{
										text: IRm$/*resources*/.r1("L_RESOURCES"),
										name: "t_m3",
										handler: function() {
											var m_mview = panel.down("[name=m_mview]"),
												l = m_mview.getLayout(),
												sid,
												r;
											
											if (l.getActiveItem().name != "l_3")
											{
												r = l.getActiveItem().getLayout().getActiveItem().commitCode();
												
												if (r)
												{
													this.toggle(true);
													panel.down("[name=t_m1]").toggle(false);
													panel.down("[name=t_m2]").toggle(false);
													
													l.setActiveItem(2);
													m_mview.sl = "l_3";
													panel.down("[name=t_c1]").setVisible(false);
													panel.down("[name=t_c2]").setVisible(false);
													l.getActiveItem().refreshCode();
												}
											}
										}
									},
									"->",
									{
										text: "Design",
										name: "t_c1",
										pressed: true,
										handler: function() {
											var m_mview = panel.down("[name=m_mview]"),
												l = m_mview.getLayout(),
												aview = l.getActiveItem(),
												s_view_l,
												r;
											
											s_view_l = aview.getLayout();
												
											if (s_view_l.getActiveItem().sm != 0)
											{
												r = s_view_l.getActiveItem().commitCode();
												
												if (r)
												{
													this.toggle(true);
													
													panel.down("[name=t_c2]").toggle(false);
													s_view_l.setActiveItem(0);
													s_view_l.getActiveItem().refreshCode();
												}
											}
										}
									},
									{
										text: "Code",
										name: "t_c2",
										handler: function() {
											var m_mview = panel.down("[name=m_mview]"),
												l = m_mview.getLayout(),
												aview = l.getActiveItem(),
												s_view_l,
												r;
											
											s_view_l = aview.getLayout();
												
											if (s_view_l.getActiveItem().sm != 1)
											{
												r = s_view_l.getActiveItem().commitCode();
												
												if (r)
												{
													this.toggle(true);
													panel.down("[name=t_c1]").toggle(false);
													s_view_l.setActiveItem(1);
													s_view_l.getActiveItem().refreshCode();
												}
											}
										}
									}
								]
							}, 
							{
								region: "east",
								name: "panelProp",
								border: false,
								split: true,
								collapsible: true,
								minSize: 100,
								width: 220,
								title: "Config",
								layout: {
									type: "vbox",
									align: "stretch"
								},
								items: [
									{
										title: "Property",
										xtype: "propertygrid",
										name: "propgrid",
										flex: 1,
										preventHeader: true,
										propertyNames: {
											tested: 'QA',
											borderWidth: 'Border Width'
										},
										source: {},
										listeners: {
											propertychange: function(source, recordId, value, oldValue, eOpts) {
												if (this.ecname != null)
												{
													this.F7a/*setControlProp*/(this.ecname);
												}
											},
											scope: this
										}
									},
									{
										xtype: "fieldcontainer",
										fieldLabel: "Bind Report",
										padding: "0 2 0 2",
										name: "b_report",
										hidden: true,
										labelWidth: 60,
										layout: {
											type: "hbox",
											align: "stretch"
										},
										items: [
											{
												xtype: "textfield",
												readOnly: true,
												name: "b_itemname",
												flex: 1
											},
											{
												xtype: "button",
												text: "..",
												handler: function() {
									        		this._t$/*toolbarHandler*/("cmd_map"); 
									        	},
									        	scope: this
											}
										]
									},
									{
										xtype: "fieldcontainer",
										fieldLabel: "Template",
										padding: "0 2 0 2",
										name: "b_tmpl",
										hidden: true,
										labelWidth: 60,
										layout: {
											type: "hbox",
											align: "stretch"
										},
										items: [
											{
												xtype: "textfield",
												readOnly: true,
												name: "b_tmpl_name",
												flex: 1
											},
											{
												xtype: "button",
												text: "..",
												handler: function() {
									        		this._t$/*toolbarHandler*/("cmd_map_tmpl"); 
									        	},
									        	scope: this
											}
										]
									},
									{
										xtype: "fieldcontainer",
										fieldLabel: "Setting",
										padding: "0 2 0 2",
										name: "b_grid",
										hidden: true,
										labelWidth: 60,
										layout: {
											type: "hbox",
											align: "stretch"
										},
										items: [
											{
												xtype: "button",
												text: "Column Store",
												handler: function() {
									        		this._t$/*toolbarHandler*/("cmd_cstore"); 
									        	},
									        	scope: this
											}
										]
									},
	//								{
	//									xtype: "container",
	//									name: "b_codemap",
	//									hidden: true,
	//									layout: {
	//										type: "vbox",
	//										align: "stretch"
	//									},
	//									items: [
	//										{
	//											xtype: "fieldcontainer",
	//											fieldLabel: "CodeMap",
	//											padding: "0 2 0 2",
	//											labelWidth: 60,
	//											layout: {
	//												type: "hbox",
	//												align: "stretch"
	//											},
	//											items: [
	//												{
	//													xtype: "textfield",
	//													readOnly: true,
	//													name: "t_codemap",
	//													flex: 1
	//												},
	//												{
	//													xtype: "button",
	//													text: "..",
	//													handler: function() {
	//														this._t$/*toolbarHandler*/("cmd_map_code"); 
	//													},
	//													scope: this
	//												}
	//											]
	//										}
	//									]
	//								},
									{
										title: "Position",
										name: "pnl_position",
										height: 240,
										listeners: {
											resize: function(tobj) {
												if (panel.pot)
												{
													panel.pot.validatePosition.call(panel.pot);
												}
											},
											scope: this
										}
									}
								]
							}
						]
					}
				]
	        });
			
			IG$/*mainapp*/._IC8/*DashboardEdit*/.superclass.initComponent.call(this);
		}
	});
}

