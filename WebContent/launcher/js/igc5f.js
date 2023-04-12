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
IG$/*mainapp*/.Pg/*pivotgrid*/ = $s.extend($s.gridpanel, {
	initComponent: function() {
		var me = this,
			panel = me.ptr_p;
		
		$s.apply(this, {
			border: 1,
			hideHeaders: true,
			
			store: {
				xtype: "store",
				fields: [
					"name", "nodepath", "li", "activeformula", "itemtype", "memo", "sortorder", "type", "uid", "iupd", "disp_title", "hidecolumn", "timeformat", "aggrfunc", "iconcls", "lname"
				]
			},
			viewConfig: {
				plugins: {
					ptype: "gridviewdragdrop",
					ddGroup: "_I$RD_G_"
				},
				__ing: 1,
				listeners: {
					beforedrop: function(node, data, dropRec, dropPosition, dropFunction) {
						var r = false,
							index,
							rc,
							li = (dropRec) ? dropRec.data.li : -1,
							hasitem = false, 
							location,
							reportmode = panel.reportmode,
							dtype,
							i, n, k,
							is_page = false,
							dobj,
							rdata,
							bcluster = panel.down("[name=bcluster]").getValue(),
							inc = 0,
							cl_items,
							mcl_items,
							cobj, dt,
							dataquerymode = panel.down("[name=dataquerymode]").getValue();
							
						// (this == data.view) ? data.copy = false : data.copy = true;
						data.copy = (data.view.__ing) ? false : true;
						
						location = this.panel.location;
						
						index = (dropRec) ? this.panel.store.indexOf(dropRec) : 0;
						
						if (dropPosition == "after")
						{
							index++;
						}
						
						is_page = (location == "rc" || location == "rm");
						
						if (data.copy == true && !panel.__penabled)
							return false;
							
						for (k=0; k < data.records.length; k++)
						{
							rc = data.records[k];
							
							hasitem = false;
							
							if (is_page)
							{
								cl_items = ["pivotgrid_row", "pivotgrid_rpt_col", "pivotgrid_rpt_mea"];
								$.each(cl_items, function(n, c) {
									var cobj = panel.down("[name=" + c + "]"),
										dt = cobj.store.data.items,
										i;
									for (i=0; i < dt.length; i++)
									{
										trec = dt[i];
										if (trec.get("uid") == rc.get("uid"))
										{
											hasitem = true;
											break;
										}
									}
									
									if (hasitem == true)
									{
										return false;
									}
								});
							}
							else
							{
								if (dataquerymode == "M_DATA")
								{
									cl_items = ["pivotgrid_row"];
									mcl_items = ["pivotgrid_col", "pivotgrid_mea", "pivotgrid_cls"];
								}
								else
								{
									cl_items = ["pivotgrid_row", "pivotgrid_col", "pivotgrid_mea", "pivotgrid_cls"];
								}
								
								$.each(cl_items, function(n, c) {
									var cobj = panel.down("[name=" + c + "]"),
										dt = cobj.store.data.items,
										i;
										
									if (c == "pivotgrid_cls" && !bcluster)
									{
										return;
									}
									
									for (i=0; i < dt.length; i++)
									{
										if (dt[i].get("uid") == rc.get("uid"))
										{
											hasitem = true;
											break;
										}
									}
									
									if (hasitem == true)
									{
										return false;
									}
								});
								
								if (mcl_items)
								{
									for (n=0; n < mcl_items.length; n++)
									{
										cobj = panel.down("[name=" + mcl_items[n] + "]");
										dt = cobj.store.data.items;
											
										for (i=dt.length-1; i>= 0; i--)
										{
											if (dt[i].get("uid") == rc.get("uid"))
											{
												cobj.store.remove(dt[i]);
											}
										}
									}
								}
							}
							
						   	if (rc && hasitem == false)
						   	{
						   		rdata = rc.data;
						   		dobj = {
						   			type: rdata.type,
						   			uid: rdata.uid,
						   			name: rdata.name,
						   			address: rdata.address,
						   			nodepath: rdata.nodepath,
						   			lname: rdata.lname
						   		};
						   		dtype = dobj.type.toLowerCase();
						   		switch (dtype)
						   		{
						   		case "measure":
						   		case "measuregroup":
						   		case "formulameasure":
						   		case "chartmeasure":
						   		case "metric":
						   		case "measuregroupdimension":
						   		case "tabdimension":
						   		case "custommetric":
						   		case "groupfield":
						   		case "hierarchy":
						   			dobj.location = location;
						   			dobj.li = li;
						   			dobj.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(dobj.type.toLowerCase());
				   					this.store.insert(index + (inc++), dobj);
				   					panel._IOb/*afterDropItem*/.call(panel, dobj.location, dobj.li, is_page);
						   			break;
						   		}
						   	}
						   	else if (rc && data.copy == false)
							{
								rdata = rc.data;
								dtype = rdata.type.toLowerCase();
								if (dtype == "datemetric")
								{
									r = false;
								}
								else
								{
									r = true;
								}
								
								panel._IOb/*afterDropItem*/.call(panel, rdata.location, rdata.li, is_page);
							}		   	
						}
								
						return r;
					},
					drop: function(node, data, dropRec, dropPosition) {
						var sc = false,
							me = this;
						
						if (data.copy == false && dropRec)
						{
							var ol = data.records[0].get("li"),
								index = (dropRec) ? me.panel.store.indexOf(dropRec) : 0;
								
							if (dropPosition == "after")
							{
								index++;
							}
							// var ditem = data.records[0].data;
							// this.store.remove(data.records[0]);
							// this.store.insert(index, ditem);
							// panel._IOb/*afterDropItem*/.call(panel, dloc, dl);
							// panel._IOb/*afterDropItem*/.call(panel, oloc, ol);
							sc = false;
						}
							
						return sc;
					}
				}
			},
			columns: [
				{
					text: "",
					dataIndex: "iconcls",
					menuDisabled: true,
					width: 30,
					renderer: function(value, metadata, record, rowindex, colindex, store) {
						return "<div class='igc_g_icon " + value + "' title='" + (record.get("nodepath") || "") + "'></div>";
					}
				},
				{
			    	dataIndex: "name",
			    	flex: 1,
			    	renderer: function(value, metadata, record, rowindex, colindex, store) {
			    		var dtype = record.get("type").toLowerCase(),
			    			aggrfunc = record.get("aggrfunc"),
			    			dataquerymode = panel.down("[name=dataquerymode]").getValue() == "M_DATA",
			    			dmode = (dtype == "metric" || dtype == "custommetric") && (dataquerymode || (me.location == "rm" || me.location == "m") || aggrfunc);
			    		
						return "<div class='igc-pivot-field' style='" + (record.get("hidecolumn") == "T" ? "color:#C7C7C7" : "") + "' title='" + (record.get("nodepath") || "") + "'>" 
							+ (record.get("lname") || record.get("name"))
							+ (dmode ? "<div class='igc-aggr-sel'><div class='sel-icon'></div><span>" + (aggrfunc ? aggrfunc.toLowerCase() : "") + "</span></div>" : "")
							+ "</div>";
					}
				},
				{
					xtype: "actioncolumn",
					width: 40,
					items: [
						{
							// icon: "./images/gears.png",
							iconCls: "icon-grid-config",
							tooltip: "Config Item",
							handler: function (grid, rowIndex, colIndex) {
								var dt = grid.store.data.items[rowIndex];
								
								if (!grid.__loc)
								{
									grid = grid.ownerCt;
								}
								
								if (dt.get("uid"))
								{
									if (dt.get("type") != "Hierarchy" && dt.get("type") != "HierarchyMetric")
									{
										dt.set("iupd", true);
										panel._IOc/*beginItemConfig*/.call(panel, dt, grid.__loc, grid.__loc1);
									}
								}
							},
							scope: this
						},
						{
							// icon: "./images/delete.png",
							iconCls: "icon-grid-delete",
							tooltip: "Remove Item",
							handler: function (grid, rowIndex, colIndex) {
								var dt = grid.store.data.items[rowIndex];
								
								if (!grid.__loc)
								{
									grid = grid.ownerCt;
								}
								
								if (dt.data.uid)
								{
									grid.store.remove(dt);
									panel._IOb/*afterDropItem*/.call(panel, dt.data.location, dt.data.li, grid.__loc1);
								}
							},
							scope: this
						}
					]
				}
			],
			listeners: {
				afterrender: function(tobj) {
					var me = tobj,
						el = $(tobj.el.dom);
						
					el.on("click", ".igc-aggr-sel", function(event) {
						event.stopPropagation();
						var rec = me.getSelectionModel().selected;
						
						if (rec && rec.length)
						{
							panel.sL/*showAggregation*/.call(panel, rec.items[0], el, this);
						}
					});
				},
				scope: this
			}
		});
		
		IG$/*mainapp*/.Pg/*pivotgrid*/.superclass.initComponent.call(this);
	}
});
	
IG$/*mainapp*/._IGeR/*pivot_rpt*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	"layout": "fit",
	
	closable: false,
	resizable: true,
	width: 450,
	
	autoHeight: true,
	
	l1/*initApp*/: function() {
		var me = this,
			_dt = me._dt;
			
		me._f = [
			"name", "measureposition", "measuretitle", "ext_title"
		];
		
		if (_dt)
		{
			$.each(me._f, function(i, f) {
				var mf = me.down("[name=" + (f == "name" ? "t" : "") + f + "]"),
					v;
					
				v = _dt[f];
				
				if (f == "measuretitle")
				{
					v = (v == "T");
				}
				else if (f == "measureposition")
				{
					v = parseInt(v || "0");
				}
				
				mf.setValue(v);
			});
		}
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			callback = me.callback,
			_dt = me._dt;
			
		if (_dt)
		{
			$.each(me._f, function(i, f) {
				var mf = me.down("[name=" + (f == "name" ? "t" : "") + f + "]"),
					v;
					
				v = mf.getValue();
				
				if (f == "measuretitle")
				{
					v = (v ? "T" : "F");
				}
				else if (f == "measureposition")
				{
					v = "" + v;
				}
				
				_dt[f] = v;
			});
		}
			
		callback && callback.execute();
		
		me.close();
	},
	
	initComponent: function() {
		var me = this;
		
		$s.apply(me, {
			title: IRm$/*resources*/.r1("L_P_RPT_C"),
			items: [
				{
					xtype: "panel",
					bodyPadding: 10,
					layout: "anchor",
					defaults: {
						anchor: "100%"
					},
					items: [
						{
							xtype: "textfield",
							name: "tname",
							fieldLabel: IRm$/*resources*/.r1("B_NAME")
						},
						{
							xtype: "numberfield",
							name: "measureposition",
							fieldLabel: IRm$/*resources*/.r1("L_M_POSITION"),
							minValue: 0,
							maxValue: 99,
							value: 0,
							anchor: "60%"
						},
						{
							xtype: "checkbox",
							name: "measuretitle",
							fieldLabel: IRm$/*resources*/.r1("L_M_TITLE"),
							boxLabel: IRm$/*resources*/.r1("B_ENABLED")
						},
						{
							xtype: "textfield",
							name: "ext_title",
							fieldLabel: IRm$/*resources*/.r1("L_M_EXT_TITLE")
						}
					]
				}
			],
			buttons: [
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
		
		IG$/*mainapp*/._IGeR/*pivot_rpt*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj.l1/*initApp*/.call(tobj);
		}
	}
});

IG$/*mainapp*/._IGe/*pivot*/ = $s.extend($s.panel, {
	floatable: false,
	collapseFirst:false,
    bodyBorder: false,
	activeItem: 0,
	margins: "0 0 0 0",
	cmargins: "0 0 0 0",
	browser: null,
	pivotchanged: false,
	autoScroll:false,
	border: 0,
	
	"layout": {
		type: "vbox",
		align: "stretch"
	},
	
	droptarget: null,
	metriclistview: null,
	
	_ILb/*sheetoption*/:null,
	// currentStep: "measure",
	
	// qitem: "4.ExtraItem",
	spl: "5.Splice with",
	
	_i1/*pivotChanged*/: false,
	
	_IL2/*setPivotInfo*/: function(pivot) {
		var me = this;
		me._ILb/*sheetoption*/ = pivot;
		
		if (me.rendered)
		{
			me._IL1/*applyCurrentPivotInfo*/();
		}
	},
	
	_IL1/*applyCurrentPivotInfo*/: function() {
		var items,
			me = this,
			feditor,
			ropt = me._ILa/*reportoption*/,
			sopt = me._ILb/*sheetoption*/;
		
		if (sopt && me.peditor)
		{
			var dataquerymode = me.down("[name=dataquerymode]"),
				pivotgrid_rpt = me.down("[name=pivotgrid_rpt]"),
				pivotgrid_rpt_item = me.down("[name=pivotgrid_rpt_item]"),
				bcluster = me.down("[name=bcluster]"),
				syncrows = me.down("[name=syncrows]"),
				dataquerymode_v,
				i, li,
				optset,
				arr;
			
			dataquerymode_v = sopt.dataquerymode;
			
			optset = [
				{
					aname: "rows",
					bname: "row",
					li: 0
				},
				{
					aname: "cols",
					bname: "col",
					li: 2
				},
				{
					aname: "measures",
					bname: "mea",
					li: 1
				},
				{
					aname: "clusters",
					bname: "cls",
					li: 1
				}
			];
			
			$.each(optset, function(m, bobj) {
				var arr = sopt[bobj.aname],
					i,
					dp = [];
					
				if (arr && arr.length)
				{
					for (i=0; i < arr.length; i++)
					{
						arr[i].li = bobj.li;
						arr[i].iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(arr[i].type.toLowerCase());
						dp.push(arr[i]);
					}
				}
				
				me.down("[name=pivotgrid_" + bobj.bname + "]").store.loadData(dp);
			});
			
			li = 4;
			
			if (sopt.rptitems && sopt.rptitems.length)
			{
				arr = sopt.rptitems;
				me._p/*processRptItems*/(arr, li);
			}
			else
			{
				arr = sopt.rptitems = [
					{
						name: me.pivot_unit,
						itemtype: "unit",
						measures: me.measures,
						cols: me.cols
					}
				];
			}
			
			syncrows.setValue(sopt.syncrows);
			pivotgrid_rpt_item.store.loadData(arr);
			
			me.s2/*updateColor*/(sopt.c1);
			
			dataquerymode.setValue(dataquerymode_v);
			
			bcluster.setValue(sopt.bcluster);
			
			feditor = me.down("[name=feditor]");
		
			feditor._ILa/*reportoption*/ = ropt;
			feditor._ILb/*sheetoption*/ = sopt;
			
			// feditor.cubeuid = (sopt ? sopt.cubeuid : null) || (ropt ? ropt.cubeuid : null);
			
			feditor.in$t.call(feditor);
		}
	},
	
	_m1/*loadReport*/: function() {
		var me = this,
			pivotgrid_rpt_col = me.down("[name=pivotgrid_rpt_col]"),
			pivotgrid_rpt_mea = me.down("[name=pivotgrid_rpt_mea]");
			
		pivotgrid_rpt_col.store.loadData(me._a_rpt.cols || []);
		pivotgrid_rpt_mea.store.loadData(me._a_rpt.measures || {});
		
		me.s2/*updateColor*/(me._a_rpt.c1);
	},
	
	_p/*processRptItems*/: function(arr, li) {
		var i, j,
			me = this,
			pmeasure,
			pcol,
			r,
			a;
		
		for (i=0; i < arr.length; i++)
		{
			a = arr[i];
			a.name = a.name || me.pivot_unit;
			if (a.cols && a.cols.length > 0)
			{
				for (j=0; j < a.cols.length; j++)
				{
					r = a.cols[j];
					r.li = li;
					r.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(r.type.toLowerCase());
				}
			}
			
			if (a.measures && a.measures.length > 0)
			{
				for (j=0; j < a.measures.length; j++)
				{
					r = a.measures[j];
					r.li = li;
					r.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(r.type.toLowerCase());
				}
			}
		}
	},
	
	_IO8/*havePivotItem*/: function(obj) {
		var me = this,
			i,
			r = null,
			reportmode = panel.sop/*sheetoption*/.iscomposite == true ? panel.sop/*sheetoption*/.reportmode : panel.reportmode,
			bcluster = panel.down("[name=bcluster]").getValue();
		
		$.each(["pivotgrid_row", "pivotgrid_col", "pivotgrid_mea", "pivotgrid_cls"], function(n, cp) {
			var pivotgrid = me.down("[name=" + cp + "]").store,
				mrec,
				i;
			
			if (cp == "pivotgrid_cls" && !bcluster)
			{
				return;
			}
			
			for (i=0; i < pivotgrid.data.items.length; i++)
			{
				mrec = pivotgrid.data.items[i];
				if (mrec.get(reportmode == "sql" ? "name" : "uid") == obj[reportmode == "sql" ? "name" : "uid"])
				{
					r = mrec;
					break;
				}
			}
			
			if (r)
			{
				return false;
			}
		});			

		return r;
	},
	
	_IOb/*afterDropItem*/: function (location, li, is_page) {
		var me = this;
		
		if (is_page)
		{
			me.c2/*confirmReportItem*/(me._a_rpt);
		}
	},
	
	c2/*confirmReportItem*/: function(rpt) {
		var me = this,
			fcti = me.fct.split(";");
			
		rpt.cols =[];
		rpt.measures = [];
		
		$.each(["pivotgrid_rpt_col", "pivotgrid_rpt_mea"], function(m, cp) {
			var pivotgrid = me.down("[name=" + cp + "]"),
				i,
				d, di,
				loc;
			
			loc = pivotgrid.location;
			
			for (i=0; i < pivotgrid.store.data.items.length; i++)
			{
				d = pivotgrid.store.data.items[i].data;
				if (d.uid)
				{
					di = new IG$/*mainapp*/._IE8/*clItems*/(null);
					d.itemtype = d.type || d.itemtype;
					IG$/*mainapp*/._I1d/*CopyObject*/(d, di, me.fct);
					d.iupd = false;
					switch (loc)
					{
					case "rc":
						rpt.cols.push(di);
						break;
					case "rm":
						rpt.measures.push(di);
						break;
					}
				}
			}
		});
	},
	
	_IOc/*beginItemConfig*/: function(record, loc, is_page) {
		var itemeditor = new IG$/*mainapp*/._Ic1/*cellconfig*/({
			_ILb/*sheetoption*/: this._ILb/*sheetoption*/,
			item: record.data,
			record: record,
			loc: loc,
			_ILa/*reportoption*/: this._ILa/*reportoption*/,
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
				this.r_IOc/*beginItemConfig*/(record);
				
				if (is_page)
				{
					this._IOb/*afterDropItem*/(null, null, true);
				}
			}, null)
		});
		
		itemeditor.show();
	},
	
	r_IOc/*beginItemConfig*/: function(record) {
		
	},
	
	listeners: {
		afterrender: function() {
			var me = this;
			
			me.peditor = me.down("[name=peditor]");
			
			if (me._ILb/*sheetoption*/)
			{
				me._IL1/*applyCurrentPivotInfo*/();
			}
		}
	},
	
	_mk/*ui_init*/: function() {
		var pme = this,
			me = this,
			c_z = me.down("[name=c_z]"),
			el = $(".igc-p-color", c_z.el.dom),
			bel = $(".igc-p-remove", c_z.el.dom),
			cel = $("span", el);
			
		bel.bind("click", function() {
			pme.s1/*setColor*/.call(pme, null);
		});
		
		cel.bind("click", function() {
		});
			
		me._dz/*dropzone*/ = $s.create($s.dropzone, el[0], {
			ddGroup: '_I$RD_G_',
			
			nodeouttimer: -1,
			
			getTargetFromEvent: function(e) {
				var px = e.browserEvent.pageX || e.browserEvent.clientX,
	        		py = e.browserEvent.pageY || e.browserEvent.clientY;
	        	
	            return c_z;
	        },
			
	        onNodeEnter : function(target, dd, e, data){
	        	var me = this,
	        		dt,
	        		accept = false;
	        		
	        	if (data.records && data.records.length > 0)
	        	{
	        		dt = data.records[0].get("type");
	        		
	        		if (dt == "Measure")
	        		{
        				accept = true;
	        		}
	        	}
	        		        	
	        	me.accept = accept;
	        },
	        onNodeOver : function(target, dd, e, data){
	        	var me = this,
	        		dt,
	        		ret = ((me.accept == true) ? Ext.dd.DropZone.prototype.dropAllowed : Ext.dd.DropZone.prototype.dropNotAllowed);
	        	if (me.accept == true)
	        	{
	        		if (data.records && data.records.length > 0)
	        		{
	        			dt = data.records[0].data;
	        		}
	        	}
	            return ret;
	        },
	        onNodeDrop : function(target, dd, e, data){
	        	var me = this,
	        		di;
	        		
	            if (me.accept == true)
	            {
	            	if (data.records && data.records.length > 0)
	        		{
	        			dt = data.records[0].data;
	        			di = new IG$/*mainapp*/._IE8/*clItems*/(null);
	        			IG$/*mainapp*/._I1d/*CopyObject*/(dt, di, pme.fct);
	        			
	        			pme.s1/*setColor*/.call(pme, di);
	        		}
	            }
	            
	            me.accept = false;
	            return true;
	        }
		});
	},
	
	s1/*setColor*/: function(di) {
		var me = this,
			sop = me._ILb/*sheetoption*/,
			dataquerymode = me.down("[name=dataquerymode]").getValue();
		
		if (dataquerymode == "M_REPORT")
		{
			if (me._a_rpt)
			{
				me._a_rpt.c1 = di;
			}
		}
		else if (dataquerymode == "M_PIVOT")
		{
			sop.c1 = di;
		}
		
		me.s2/*updateColor*/(di);
	},
	
	sL/*showAggregation*/: function(rec, el, tobj) {
		var me = this,
			t = $(tobj),
			tparent = t.parent(),
			offset = t.offset(),
			dw = t.width(),
			dh = t.height(),
			pmenu;
		
		pmenu = new $s.menu({
			margin: "0 0 10 0",
			floating: true,
			items: [
			    {
			    	text: "Count rows",
			    	handler: function() {
			    		rec.set("aggrfunc", "COUNT");
			    	}
			    },
			    {
			    	text: "Distinct Count",
			    	handler: function() {
			    		rec.set("aggrfunc", "COUNT_DISTINCT");
			    	}
			    },
			    {
			    	text: "Sum values",
			    	handler: function() {
			    		rec.set("aggrfunc", "SUM");
			    	}
			    },
			    {
			    	text: "Minimum",
			    	handler: function() {
			    		rec.set("aggrfunc", "MIN");
			    	}
			    },
			    {
			    	text: "Maximum",
			    	handler: function() {
			    		rec.set("aggrfunc", "MAX");
			    	}
			    },
			    "-",
			    {
			    	text: "Clear",
			    	handler: function() {
			    		rec.set("aggrfunc", "");
			    	}
			    }
			]
		});
		pmenu.showAt(offset.left, offset.top + dh);
	},
	
	s2/*updateColor*/: function(di) {
		var me = this,
			c_z = me.down("[name=c_z]"),
			el = c_z.el.dom,
			dom = $(".igc-p-color", el),
			dspan = $("span", dom);
			bdom = $(".igc-p-remove", el);
			
		dspan.empty();
		
		bdom[di ? "show" : "hide"]();
		
		if (di)
		{
			dspan.attr("title", di.nodepath);
			dspan.html(di.name || "");
		}
		else
		{
			dspan.removeAttr("title");
			dspan.html("");
		}
	},
	
	fct: "uid;name;itemtype;type;sortorder;nodepath;memo;pid;description;activeformula;rankcount;aggrfunc;disp_title;hidecolumn;timeformat",
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			sop = me._ILb/*sheetoption*/,
			dataquerymode = me.down("[name=dataquerymode]"),
			pivotgrid_rpt_item = me.down("[name=pivotgrid_rpt_item]"),
			syncrows = me.down("[name=syncrows]"),
			st_pivotgrid_rpt = pivotgrid_rpt_item.store,
			pivoteditor = me,
			i, d,
			c = me._i1/*pivotChanged*/,
			rows = [],
			cols = [],
			measures = [],
			clusters = [],
			queryitems = [],
			fcti = me.fct.split(";"),
			cmp,
			rptitems = me._ILb/*sheetoption*/.rptitems;
			
		c = (sop.dataquerymode != dataquerymode.getValue() ? true : c);
		
		sop.dataquerymode = dataquerymode.getValue();
		sop.bcluster = me.down("[name=bcluster]").getValue();
		sop.syncrows = syncrows.getValue();
		
		cmp = function(a, b) {
			var i,
				c = false;
			
			if (a && b)
			{
				for (i=0; i < fcti.length; i++)
				{
					c = (a[fcti[i]] != b[fcti[i]]) ? true : c;
					if (c == true)
						break;
				}
			}
			else
			{
				c = true;
			}
			
			return c;
		};
		
		$.each(["pivotgrid_row", "pivotgrid_col", "pivotgrid_mea", "pivotgrid_cls"], function(m, cp) {
			var pivotgrid = me.down("[name=" + cp + "]"),
				i,
				d, di,
				loc;
			
			loc = pivotgrid.location;
			
			for (i=0; i < pivotgrid.store.data.items.length; i++)
			{
				d = pivotgrid.store.data.items[i].data;
				if (d.uid)
				{
					di = new IG$/*mainapp*/._IE8/*clItems*/(null);
					d.itemtype = d.type || d.itemtype;
					IG$/*mainapp*/._I1d/*CopyObject*/(d, di, me.fct);
					c = d.iupd ? true : c;
					d.iupd = false;
					switch (loc)
					{
					case "r":
						c = cmp(di, sop.rows[rows.length]) ? true : c;
						rows.push(di);
						break;
					case "c":
						c = cmp(di, sop.cols[cols.length]) ? true : c;
						cols.push(di);
						break;
					case "m":
						c = cmp(di, sop.measures[measures.length]) ? true : c;
						measures.push(di);
						break;
					case "l":
						c = cmp(di, sop.clusters[clusters.length]) ? true : c;
						clusters.push(di);
						break;
					}
				}
			}
		});
		
		// var pivotgrid_rpt = me.down("[name=pivotgrid_rpt]"),
		// 	rnode = pivotgrid_rpt.getRootNode();
		
		if (sop.dataquerymode == "M_REPORT" && me._a_rpt)
		{
			me.c2/*confirmReportItem*/(me._a_rpt);
		}
		
		// me._p2/*confirmRptItems*/(rnode, rptitems, fct);
		c = (sop.rows.length == rows.length) ? c : true;
		c = (sop.cols.length == cols.length) ? c : true;
		c = (sop.measures.length == measures.length) ? c : true;
		
		sop.rows = rows;
		sop.cols = cols;
		sop.measures = measures;
		sop.clusters = clusters;
		sop.queryItems = queryitems;
		// sop.rptitems = rptitems;
		
		for (i=0; i < st_pivotgrid_rpt.data.items.length; i++)
		{
			d = st_pivotgrid_rpt.data.items[i];
			if (rptitems && rptitems.length > i)
			{
				rptitems[i].name = d.get("name");
			}
		}
		
		var feditor = this.down("[name=feditor]");		
		feditor.m1$9/*confirmFilterSetting*/.call(feditor);
		
		return c;
	},
	
	_p2/*confirmRptItems*/: function(rnode, rptitems) {
		var i, j, k,
			di,
			c,
			d,
			rec, ritem, runit,
			rpt;
		
		for (i=0; i < rnode.childNodes.length; i++)
		{
			rpt = {
				cols: [],
				measures: []
			};
			
			runit = rnode.childNodes[i];
			
			for (k=0; k < runit.childNodes.length; k++)
			{
				rec = runit.childNodes[k];
				if (rec.get("itemtype") == "pivot_mea" && rec.childNodes)
				{
					for (j=0; j < rec.childNodes.length; j++)
					{
						ritem = rec.childNodes[j];
						d = ritem.data;
						di = new IG$/*mainapp*/._IE8/*clItems*/(null);
						d.itemtype = d.type || d.itemtype;
						IG$/*mainapp*/._I1d/*CopyObject*/(d, di, me.fct);
						c = d.iupd ? true : c;
						d.iupd = false;
						
						rpt.measures.push(di);
					}
				}
				else if (rec.get("itemtype") == "pivot_col" && rec.childNodes)
				{
					for (j=0; j < rec.childNodes.length; j++)
					{
						ritem = rec.childNodes[j];
						d = ritem.data;
						di = new IG$/*mainapp*/._IE8/*clItems*/(null);
						d.itemtype = d.type || d.itemtype;
						IG$/*mainapp*/._I1d/*CopyObject*/(d, di, me.fct);
						c = d.iupd ? true : c;
						d.iupd = false;
						rpt.cols.push(di);
					}
				}
			}
			
			if (rpt.cols.length + rpt.measures.length > 0)
			{
				rptitems.push(rpt);
			}
		}
	},
	
	_IOd/*validateViewMode*/: function() {
		var me = this,
			dataquerymode = me.down("[name=dataquerymode]"),
			pivotgrid_cls = me.down("[name=pivotgrid_cls]"),
			mv = me.down("[name=mv]"),
			vc = me.down("[name=vc]"),
			vr = me.down("[name=vr]"),
			bcluster = me.down("[name=bcluster]"),
			b_dataquerymode = dataquerymode.getValue(),
			pivotgrid_rpt_item = me.down("[name=pivotgrid_rpt_item]"),
			sopt = me._ILb/*sheetoption*/;
		
		mv.setVisible(b_dataquerymode != "M_DATA");
		bcluster.setVisible(b_dataquerymode == "M_PIVOT");
		vc.setVisible(b_dataquerymode == "M_PIVOT");
		vr.setVisible(b_dataquerymode == "M_REPORT");
		pivotgrid_rpt_item.setVisible(b_dataquerymode == "M_REPORT");
		pivotgrid_cls.setVisible(bcluster.getValue() && b_dataquerymode == "M_PIVOT");
		
		if (b_dataquerymode == "M_REPORT" && sopt)
		{
			pivotgrid_rpt_item.getSelectionModel().select(pivotgrid_rpt_item.store.data.items[0]);
			me._a_rpt = sopt.rptitems[0];
			me._m1/*loadReport*/();
		}
	},
	
	_IOd2/*changeDataViewMode*/: function() {
		var me = this,
			dataquerymode = me.down("[name=dataquerymode]").getValue(),
			pivotgrid_row = me.down("[name=pivotgrid_row]"),
			pivotgrid_mea = me.down("[name=pivotgrid_mea]"),
			i, rec,
			mitems = [],
			pi,
			sts, stt;
		
		if (dataquerymode == "M_DATA")
		{
			sts = pivotgrid_mea.store;
			stt = pivotgrid_row.store;
		}
		else if (dataquerymode == "M_PIVOT")
		{
			sts = pivotgrid_row.store;
			stt = pivotgrid_mea.store;
		}
		
		if (sts && stt)
		{
			pivotgrid_mea.getView().refresh();
			pivotgrid_row.getView().refresh();
			
			for (i=0; i < sts.data.items.length; i++)
			{
				rec = sts.data.items[i];
				
				if (rec.get("type") == "Measure")
				{
					mitems.push(rec);
				}
			}
			
			if (mitems.length)
			{
				pi = stt.data.items.length;
				for (i=mitems.length-1; i>=0; i--)
				{
					sts.remove(mitems[i]);
					stt.insert(pi, mitems[i]);
				}
			}
		}
	},
	
	Uc/*updateCubeSelection*/: function(cubeuid, penabled) {
		var me = this;
		
		me.__penabled = penabled;
	},
	
	_IJd/*updateFilterChange*/: function() {
		this._i1/*pivotChanged*/ = true;
	},
	
	_IO3/*updatePivotContent*/: function() {
		this._i1/*pivotChanged*/ = true;
	},
	
	_IOe/*prepareGridStyles*/: function() {
    	var me = this,
    		i, j, m, bf, stylename,
    		sheetoption = me._ILb/*sheetoption*/,
    		itemstyle, 
    		sheetformula = sheetoption.Xsf/*sheetformula*/ || [],
    		sfmap = {},
    		sfbase = {},
    		rows = sheetoption.rows,
    		cols = sheetoption.cols,
    		measures = sheetoption.measures, styles,
    		__f, rptitem,
    		dataquerymode = me.down("[name=dataquerymode]").getValue(),
    		pp = {};
    		
    	sheetoption.itemstyle = sheetoption.itemstyle == null ? [] : sheetoption.itemstyle;
    	itemstyle = sheetoption.itemstyle;
    	
    	styles = {};
    	
    	if (dataquerymode != "M_REPORT")
    	{
	    	for (i=0; i < sheetformula.length; i++)
	    	{
	    		sfmap[sheetformula[i].baseuid + "_0_" + sheetformula[i].fid] = sheetformula[i];
	    		sfbase[sheetformula[i].baseuid + "_0"] = sfbase[sheetformula[i].baseuid + "_0"] || [];
	    		sfbase[sheetformula[i].baseuid + "_0"].push(sheetformula[i]);
	    	}
	    }
    	
    	for (i=itemstyle.length-1; i>=0; i--)
    	{
    		bf = false;
    		
    		if (itemstyle[i].uid && itemstyle[i].rptseq && itemstyle[i].fid)
    		{
    			stylename = itemstyle[i].uid + "_" + itemstyle[i].rptseq + "_" + itemstyle[i].fid;
    		}
    		else if (itemstyle[i].uid && itemstyle[i].rptseq)
    		{
    			stylename = itemstyle[i].uid + "_" + itemstyle[i].rptseq;
    		}
    		else
    		{
    			stylename = itemstyle[i].name;
    		}
    		
    		if (dataquerymode == "M_REPORT")
    		{
    			for (m=0; m < rows.length; m++)
    			{
    				if (rows[m].name == stylename)
    				{
    					bf = true;
    					break;
    				}
    				else if (stylename == rows[m].uid + "_0")
    				{
    					bf = true;
    					break;
    				}
    			}
    			
    			if (bf == false)
    			{
    				for (m=0; m < sheetoption.rptitems.length; m++)
		    		{
		    			rptitem = sheetoption.rptitems[m];
		    			
		    			$.each([rptitem.cols, rptitem.measures], function(j, value) {
			    			var k;
			    			if (bf == false)
			    			{
				    			for (k=0; k < value.length; k++)
				    			{
				    				if (value[k].name == stylename)
				    				{
				    					bf = true;
				    					break;
				    				}
				    				else if (value[k].uid + "_" + m == stylename)
				    				{
				    					bf = true;
				    					break;
				    				}
				    			}
				    		}
			    		});
			    		
			    		if (bf == true)
			    		{
			    			break;
			    		}
		    		}
    			}
    		}
    		else
    		{
    			if (sfmap[stylename])
    			{
    				bf = true;
    			}
    			else
    			{
		    		$.each([rows, cols, measures], function(j, value) {
		    			var k;
		    			if (bf == false)
		    			{
			    			for (k=0; k < value.length; k++)
			    			{
			    				if (value[k].name == stylename)
			    				{
			    					bf = true;
			    					break;
			    				}
			    				else if (value[k].uid + "_0" == stylename)
			    				{
			    					bf = true;
			    					break;
			    				}
			    			}
			    		}
		    		});
		    	}
    		}
    		
    		if (pp[stylename])
    		{
    			bf = false;
    		}
    		
    		if (bf == false)
    		{
    			itemstyle.splice(i, 1);
    		}
    		else
    		{
    			styles[stylename] = itemstyle[i];
    		}
    		
    		pp[stylename] = 1;
    	}
    	
    	__f = function(i, value) {
    		var j, l,
    			items = value.items,
    			ismeasure = (value.m == 1),
    			isformula = (value.m == 2),
    			k,
    			rptseq = value.rptseq,
    			st;
    			
    		for (j=0; j < items.length; j++)
    		{
    			if (isformula)
    			{
    				k = items[j].baseuid + "_" + rptseq + "_" + items[j].fid;
    			}
    			else
    			{
    				k = items[j].uid + "_" + rptseq;
    				
    				if (sfbase[k])
    				{
    					for (l=0; l < sfbase[k].length; l++)
    					{
    						sfbase[k][l].basename = items[j].name;
    					}
    				}
    			}
    			st = styles[k];
    			
    			if (!st && styles[items[j].name])
    			{
    				st = styles[items[j].name];
    			}
    			
    			if (!st)
    			{
    				st = new IG$/*mainapp*/._IF7/*clReportStyle*/();
    				st.nodename = "item";
    				
    				st.basestylename = null;
    				
    				if (isformula)
    				{
    					st.uid = items[j].baseuid;
    					st.basestylename = "Formula";
    					st.fid = items[j].fid;
    				}
    				else
    				{
    					st.uid = items[j].uid;
    					
	    				switch (items[j].itemtype.toLowerCase())
	    				{
	    				case "metric":
	    				case "custommetric":
	    				case "measuregroupdimension":
	    					st.basestylename = ismeasure || items[j].aggrfunc ? "Measure" : "Dimension";
	    					break;
	    				case "measure":
	    				case "measuregroup":
	    					st.basestylename = "Measure";
	    					break;
	    				case "formulameasure":
	    					st.basestylename = "Formula";
	    					break;
	    				}
	    			}
    				
    				itemstyle.push(st);
    			}
    			
    			if (isformula)
    			{
    				st.name = items[j].basename + " (" + (items[j].title || "") + ")";
    			}
    			else
    			{
    				st.name = items[j].name;
    			}
    			st.rptseq = value.rptseq;
    		}
    	};
    	
    	if (dataquerymode == "M_REPORT")
    	{
    		__f.call(me, 0, {
    			items: rows,
    			m: 0,
    			rptseq: 0
    		});
    		
    		for (i=0; i < sheetoption.rptitems.length; i++)
    		{
    			rptitem = sheetoption.rptitems[i];
    			
    			$.each([
    				{
    					items: rptitem.cols,
    					m: 0,
    					rptseq: i
    				}, 
    				{
    					items: rptitem.measures,
    					m: 1,
    					rptseq: i
    				}], __f);
    		}
    	}
    	else
    	{
	    	$.each([
	    		{
	    			items: rows,
	    			m: 0,
	    			rptseq: 0
	    		}, 
	    		{
	    			items: cols,
	    			m: 0,
	    			rptseq: 0
	    		}, 
	    		{
	    			items: measures,
	    			m: 1,
	    			rptseq: 0
	    		}], __f);
	    		
	    	$.each([
	    		{
	    			items: sheetformula || [],
	    			m: 2,
	    			rptseq: 0
	    		}
	    	], __f);
	    }
    },
    
    _m2/*moveGridSelection*/: function(grid, direction, itemarray) {
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
		
		if (itemarray && itemarray.length)
		{
			mobj = itemarray[oindex];
			itemarray.splice(oindex, 1);
			itemarray.splice(index, 0, mobj);
		}
		
		grid.getStore().remove(record);
		grid.getStore().insert(index, record);
		grid.getSelectionModel().select(record, true);
    },
	
    initComponent: function() {
    	var panel = this,
    		peditor;
    	
    	panel.row = IRm$/*resources*/.r1("L_P_ROW");
		panel.column = IRm$/*resources*/.r1("L_P_COL");
		panel.measure = IRm$/*resources*/.r1("L_P_MEASURE");
		panel.pivot_unit = IRm$/*resources*/.r1("L_P_PIVOT_UNIT");
		panel.cluster = IRm$/*resources*/.r1("L_P_CLUSTER");
		
    	if (panel._i0/*pivotEditorMode*/ != true)
    	{
			panel.browser = new IG$/*mainapp*/._I98/*naviTree*/({
				showtoolbar: false,
				cubebrowse: true,
				collapsible: false,
				floatable: false,
				floating: false,
				ddGroup: "_I$RD_G_",
				"layout": "fit",
				enabledrag: true,
				flex: 1,
				border: 0,
				_search: true,
				_IHb/*customEventOwner*/: panel
			});
		}
		else
		{
			peditor = {
			  	// title: IRm$/*resources*/.r1("L_PIVOT"),
			  	// collapseMode: "mini",
			  	// hidden: true,
			  	name: "peditor",
			  	"layout": "fit",
				floatable: false,
				// region: "south",
				border: 0,
			  	flex: 1,
			  	
			  	items: [
			  		{
				  		xtype: "container",
				  		border: 0,
				  		"layout": {
				  			type: "vbox",
				  			align: "stretch"
				  		},
				  		items: [
				  			{
				  				xtype: "container",
				  				layout: "border",
				  				flex: 1,
				  				border: 0,
				  				padding: 8,
				  				items: [
									{
										xtype: "container",
										flex: 1,
						  				// padding: 4,
						  				region: "center",
						  				layout: {
						  					type: "vbox",
						  					align: "stretch"
						  				},
						  				items: [
											{
												xtype: "gridpanel",
												name: "pivotgrid_rpt_item",
												title: IRm$/*resources*/.r1("L_P_RPT"),
												region: "north",
												height: 140,
												hidden: true,
												hideHeaders: true,
												store: {
													fields: ["name"]
												},
												tbar: [
													{
														// text: IRm$/*resources*/.r1("B_ADD"),
														iconCls: "icon-toolbar-addsheet",
														handler: function() {
															var me = this,
																pitem = {
																name: me.pivot_unit,
																itemtype: "unit",
																measuretitle: "T",
																ext_title: null,
																cols: [],
																measures: []
															},
															pivotgrid_rpt_item = me.down("[name=pivotgrid_rpt_item]"),
															selmodel = pivotgrid_rpt_item.getSelectionModel();
														
														me._ILb/*sheetoption*/.rptitems.push(pitem);
														pivotgrid_rpt_item.store.loadData(me._ILb/*sheetoption*/.rptitems);
														
														selmodel.select(pivotgrid_rpt_item.store.data.items.length - 1);
														
														me._a_rpt = pitem;
														me._m1/*loadReport*/();
														},
														scope: this
													},
													{
														// text: IRm$/*resources*/.r1("B_MOVE_UP"),
														iconCls: "icon-toolbar-moveup",
														handler: function() {
															var me = this;
															me._m2/*moveGridSelection*/(me.down("[name=pivotgrid_rpt_item]"), -1, me._ILb/*sheetoption*/.rptitems);
														},
														scope: this
													},
													{
														// text: IRm$/*resources*/.r1("B_MOVE_DOWN"),
														iconCls: "icon-toolbar-movedown",
														handler: function() {
															var me = this;
															me._m2/*moveGridSelection*/(me.down("[name=pivotgrid_rpt_item]"), 1, me._ILb/*sheetoption*/.rptitems);
														},
														scope: this
													},
													"-",
													{
														xtype: "checkbox",
														boxLabel: "Synchronize Rows",
														name: "syncrows"
													}
												],
												selType: "checkboxmodel",
												selModel: {
													checkSelector: ".x-grid-cell",
													mode: "SINGLE"
												},
												plugins: [
													{
														ptype: "cellediting",
														clicksToEdit: false
													}
												],
												columns: [
													{
														text: IRm$/*resources*/.r1("B_NAME"),
														flex: 1,
														dataIndex: "name",
														editor: {
														allowBlank: true
													}
													},
													{
														xtype: "actioncolumn",
														width: 60,
													items: [
														{
															// icon: "./images/gears.png",
															iconCls: "icon-grid-config",
															tooltip: "Config Item",
															handler: function (grid, rowIndex, colIndex) {
																var me = this,
																	rec = grid.store.data.items[rowIndex],
																	dt = me._ILb/*sheetoption*/.rptitems[rowIndex],
																	dlg;
																	
																if (dt)
																{
																	dlg = new IG$/*mainapp*/._IGeR/*pivot_rpt*/({
																		_dt: dt,
																		callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
																			rec.set("name", dt.name);
																		})
																	});
																	IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
																}
															},
															scope: this
														},
														{
															iconCls: "icon-toolbar-filter",
															tooltip: "Filter",
															handler: function(grid, rowIndex, colIndex) {
																var me = this,
																	rec = grid.store.data.items[rowIndex],
																	dt = me._ILb/*sheetoption*/.rptitems[rowIndex],
																	dlg;
																	
																if (dt)
																{
																	dt.filter = dt.filter || new IG$/*mainapp*/._IEb/*clFilterGroup*/(null);
																	dt.havingfilter = dt.havingfilter || new IG$/*mainapp*/._IEb/*clFilterGroup*/(null);
																	dlg = new IG$/*mainapp*/._Ia1/*filterEditorWindow*/({
																		_ILb/*sheetoption*/: {
																			filter: dt.filter,
																			havingfilter: dt.havingfilter
																		},
																		_ILa/*reportoption*/: {
																			cubeuid: me._ILb/*sheetoption*/.cubeuid || me._ILa/*reportoption*/.cubeuid
																		},
																		callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(sop) {
																			 dt.filter = sop.filter;
																			 dt.havingfilter = sop.havingfilter;
																		})
																	});
																	
																	IG$/*mainapp*/._I_5/*checkLogin*/(me, dlg);
																}
															},
															scope: this
														},
														{
															// icon: "./images/delete.png",
															iconCls: "icon-grid-delete",
															tooltip: "Remove Item",
															handler: function (grid, rowIndex, colIndex) {
																var me = this,
																	dt = grid.store.data.items[rowIndex];
																
																if (grid.store.data.items.length > 1)
																{
																	grid.store.remove(dt);
																	me._ILb/*sheetoption*/.rptitems.splice(rowIndex, 1);
																	
																	grid.getSelectionModel().select(grid.store.data.items[0]);
																	
																	me._a_rpt = me._ILb/*sheetoption*/.rptitems[0];
																	me._m1/*loadReport*/();
																}
															},
															scope: this
														}
													]
													}
												],
												listeners: {
													cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
														
													},
													selectionchange: function(tobj, selected, eopts) {
														var me = this,
															rowIndex = tobj.store.indexOf(selected[0]),
															rpt;
															
														if (rowIndex > -1)
														{
															rpt = me._ILb/*sheetoption*/.rptitems[rowIndex];
															
															if (rpt)
															{
																if (me._a_rpt)
																{
																	me.c2/*confirmReportItem*/(me._a_rpt);
																}
																
																me._a_rpt = rpt;
																me._m1/*loadReport*/();
															}
														}
													},
													scope: this
												}
											},
						  					new IG$/*mainapp*/.Pg/*pivotgrid*/({
						  						name: "pivotgrid_row",
						  						ptr_p: panel,
								  				title: panel.row,
								  				location: "r",
								  				flex: 1,
								  				__loc: "row"
						  					})
						  				]
									},
				  					{
				  						xtype: "container",
				  						layout: {
				  							type: "vbox",
				  							align: "stretch"
				  						},
				  						region: "east",
				  						name: "mv",
				  						flex: 1,
				  						items: [
								  			{
								  				xtype: "container",
								  				flex: 1,
								  				layout: "border",
								  				border: 0,
								  				
								  				name: "vc",
								  				padding: 4,
								  				items: [
								  					new IG$/*mainapp*/.Pg/*pivotgrid*/({
								  						name: "pivotgrid_col",
								  						ptr_p: panel,
								  						flex: 1,
										  				region: "south",
										  				title: panel.column,
										  				location: "c",
										  				__loc: "col"
								  					}),
								  					new IG$/*mainapp*/.Pg/*pivotgrid*/({
								  						name: "pivotgrid_mea",
								  						ptr_p: panel,
								  						flex: 1,
										  				region: "center",
										  				title: panel.measure,
										  				location: "m",
										  				__loc: "mea"
								  					}),
										  			new IG$/*mainapp*/.Pg/*pivotgrid*/({
										  				name: "pivotgrid_cls",
										  				ptr_p: panel,
										  				flex: 1,
										  				region: "south",
										  				title: panel.cluster,
										  				hidden: true,
										  				location: "l",
										  				__loc: "cls"
										  			})
								  				]
								  			},
								  			{
								  				xtype: "container",
								  				flex: 1,
								  				layout: "fit",
								  				border: 0,
								  				region: "east",
								  				name: "vr",
								  				hidden: true,
								  				padding: 4,
								  				items: [
								  					{
										  				xtype: "panel",
										  				name: "pivotgrid_rpt",
										  				border: 1,
										  				flex: 1,
										  				
										  				location: "p",
										  				layout: {
										  					type: "vbox",
										  					align: "stretch"
										  				},
										  				items: [
										  					
										  					new IG$/*mainapp*/.Pg/*pivotgrid*/({
										  						name: "pivotgrid_rpt_mea",
										  						ptr_p: panel,
										  						flex: 1,
												  				region: "center",
												  				title: panel.measure,
												  				location: "rm",
												  				__loc: "mea",
																__loc1: true
										  					}),
												  			new IG$/*mainapp*/.Pg/*pivotgrid*/({
												  				name: "pivotgrid_rpt_col",
												  				ptr_p: panel,
												  				flex: 1,
												  				region: "south",
												  				title: panel.column,
												  				location: "rc",
												  				__loc: "col",
																__loc1: true
												  			})
										  				]
										  			}
								  				]
								  			},
								  			{
								  				xtype: "panel",
								  				border: 1,
								  				region: "south",
								  				height: 30,
								  				layout: {
								  					type: "hbox",
								  					align: "stretch"
								  				},
								  				items: [
								  					{
								  						html: "<div><div class='igc-p-color'><span></span></div><div class='igc-p-color-ic' title='Color Measure'></div><div class='igc-p-remove'></div></div>",
								  						name: "c_z",
								  						flex: 1,
								  						listeners: {
								  							afterrender: function() {
								  								setTimeout(function() {
								  									panel._mk/*ui_init*/.call(panel);
								  								}, 100);
								  							}
								  						}
								  					},
								  					{
								  						html: "<div class='igc-p-color'></div>",
								  						name: "s_z",
								  						hidden: true,
								  						flex: 1,
								  						listeners: {
								  							afterrender: function() {
								  								panel._mk/*ui_init*/.call(panel);
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
				  				xtype: "fieldcontainer",
				  				layout: "hbox",
				  				items: [
						  			{
						  				xtype: "combobox",
						  				fieldLabel: IRm$/*resources*/.r1("L_VIEW_MODE"),
						  				name: "dataquerymode",
						  				labelAlign: "right",
						  				queryMode: "lcoal",
						  				displayField: "name",
						  				valueField: "value",
						  				editable: false,
						  				store: {
						  					xtype: "store",
						  					fields: [
						  						"name", "value"
						  					],
						  					data: [
						  						{name: IRm$/*resources*/.r1("L_VIEW_MODE_LBL"), value: "M_DATA"},
						  						{name: IRm$/*resources*/.r1("L_V_PIVOT"), value: "M_PIVOT"},
						  						{name: IRm$/*resources*/.r1("L_V_RPT"), value: "M_REPORT"}
						  					]
						  				},
						  				hidden: (panel._ILb/*sheetoption*/ && panel._ILb/*sheetoption*/.iscomposite ? true : false),
						  				listeners: {
						  					change: function(tobj, newValue, oldValue, eopts) {
						  						panel._IOd/*validateViewMode*/.call(panel);
						  					},
						  					select: function(tobj, records, eopts) {
						  						panel._IOd2/*changeDataViewMode*/.call(panel);
						  					}
						  				}
						  			},
						  			{
						  				xtype: "displayfield",
						  				value: "..",
						  				listeners: {
						  					afterrender: function(tobj) {
												IG$/*mainapp*/.r___.a/*registertooltip*/(tobj, "data_query_viewer");
											}
						  				}
						  			},
						  			{
						  				xtype: "checkbox",
						  				name: "bcluster",
						  				labelAlign: "right",
						  				fieldLabel: IRm$/*resources*/.r1("L_CLUSTER"),
						  				boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
						  				listeners: {
						  					change: function(tobj) {
						  						var me = this,
						  							pivotgrid_cls = me.down("[name=pivotgrid_cls]"),
						  							dataquerymode = me.down("[name=dataquerymode]");
						  							
						  						pivotgrid_cls.setVisible(tobj.getValue() && dataquerymode.getValue() == "M_PIVOT");
						  					},
						  					scope: this
						  				}
						  			}
						  		]
						  	}
				  		]
					}
				]
			};
		}
		
		panel.items = [];
		
		if (panel.browser)
		{
			panel.items.push({
				xtype: "container",
			  	"layout": "fit",
			  	flex: 1,
			  	region: "center",
			  	autoScroll: false,
			  	items: [
			    	panel.browser
			  	]
		  	});
		}
		
		if (peditor)
		{
			panel.items.push(
				{
					xtype: "panel",
					layout: "card",
					region: panel._i0/*pivotEditorMode*/ > 1 ? "east" : "center",
					name: "p_editor",
					border: 0,
			  		flex: 1,
			  		deferredRender: false,
			  		tbar: [
						{
							type: "button",
							iconCls: "icon-toolbar-pivot",
							name: "btn_pivot",
							pressed: 1,
							$w: 80,
							text: IRm$/*resources*/.r1("L_PIVOT"),
							handler: function() {
								var me = this,
									p_editor = me.down("[name=p_editor]"),
									btn_filter = me.down("[name=btn_filter]"),
									btn_pivot = me.down("[name=btn_pivot]");
								
								p_editor.getLayout().setActiveItem(0);
								btn_pivot.toggle(true);
								btn_filter.toggle(false);
							},
							scope: this
						},
						{
							type: "button",
							iconCls: "icon-toolbar-filter",
							name: "btn_filter",
							$w: 80,
							text: IRm$/*resources*/.r1("L_FILTER"),
							handler: function() {
								var me = this,
									p_editor = me.down("[name=p_editor]"),
									btn_filter = me.down("[name=btn_filter]"),
									btn_pivot = me.down("[name=btn_pivot]");
								
								p_editor.getLayout().setActiveItem(1);
								btn_pivot.toggle(false);
								btn_filter.toggle(true);
							},
							scope: this
						},
						{
							type: "button",
							iconCls: "icon-toolbar-sort",
							$w: 80,
							text: IRm$/*resources*/.r1("L_SORT_OPTION"),
							handler: function() {
								var me = this,
									pop = new IG$/*mainapp*/._If0/*sortOptionDlg*/({
										_ILa/*reportoption*/: me._ILa/*reportoption*/,
										_ILb/*sheetoption*/: me._ILb/*sheetoption*/,
										callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IO3/*updatePivotContent*/)
									});
								IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
							},
							scope: this
						},
						{
							type: "button",
							iconCls: "icon-toolbar-style",
							$w: 80,
							text: IRm$/*resources*/.r1("L_GRID_STYLE"),
							handler: function() {
								var me = this,
									pop;
									
								me._IOe/*prepareGridStyles*/();
								
								pop = new IG$/*mainapp*/._Iff/*globalRepotStyle*/({
									cmode: "report",
									_IJa/*activeSheet*/: me._IJa/*activeSheet*/,
									_ILa/*reportoption*/: me._ILa/*reportoption*/,
									_ILb/*sheetoption*/: me._ILb/*sheetoption*/,
									callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IO3/*updatePivotContent*/)
								});
								IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
							},
							scope: this
						},
						"->",
						{
							type: "button",
							$w: 90,
							text: IRm$/*resources*/.r1("L_ADV_OPTION"),
							handler: function() {
								var dlg = new IG$/*mainapp*/._Ic0/*pivotadvancedoption*/({
									_ILb/*sheetoption*/: this._ILb/*sheetoption*/
								});
								this._i1/*pivotChanged*/ = true;
								IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
							},
							listeners: {
								afterrender: function(tobj) {
									IG$/*mainapp*/.r___.a/*registertooltip*/(tobj, "advanced_pivot");
								}
							},
							scope: this
						}
					],
					items: [
						peditor,
						new IG$/*mainapp*/._Ida/*filterEditorPanel*/({
				    		name: "feditor",
				    		deferredRender: false,
				    		bodyPadding: 10
				    	})
					]
				}
			);
		}
		
        IG$/*mainapp*/._IGe/*pivot*/.superclass.initComponent.call(this);
    }
});




IG$/*mainapp*/._Ibf/*pivotbrowser*/ = $s.extend($s.panel, {
	region:"center",
	"layout": {
		type: "fit",
		align: "stretch"
	},
	
	closable: false,
	resizable:false,
	
	_ILa/*reportoption*/: null,
	
	callback: null,
	
	defaults:{bodyStyle: "padding:0px"},
	
	_IG0/*closeDlgProc*/: function() {
		var me = this;
		me.setVisible(false);
		
		setTimeout(function() {
			me.callback && me.callback.execute();
		}, 100);
	},
	
	_IFf/*confirmDialog*/: function() {
		this._IFf/*confirmDialog*/();		
		this._IG0/*closeDlgProc*/();
	},
	
	_IGc/*reportSelectedHandler*/: function(item) {
		var panel = this;
	},
	
	_IGd/*loadSheetOption*/: function(_ILb/*sheetoption*/, _ILa/*reportoption*/) {
		var me = this,
			pivoteditor = me.down("[name=pivoteditor]"),
			rop,
			__cs,
			cobj, i,
			t_0 = me.down("[name=t_0]"),
			t_1 = me.down("[name=t_1]"),
			t_2 = me.down("[name=t_2]"),
			ls = 0;
		
		me._ILb/*sheetoption*/ = _ILb/*sheetoption*/;
		rop = me._ILa/*reportoption*/ = _ILa/*reportoption*/;
		
		__cs = rop.__cs;
		
		if (me._ILb/*sheetoption*/ && me._ILb/*sheetoption*/.cubeuid)
		{
			cubeuid = me._ILb/*sheetoption*/.cubeuid;
		}
		else
		{
			cubeuid = __cs.d || (__cs.l.length > 0 ? __cs.l[0].uid : null);
		}
		
		me.cubeuid = cubeuid;
				
		if (__cs && __cs.l)
		{
			ls = __cs.l.length > 1;
			
			for (i=0; i < __cs.l.length; i++)
			{
				if (__cs.l[i].uid == cubeuid)
				{
					cobj = __cs.l[i];
					break;
				}
			}
			
			if (!cobj)
			{
				cobj = __cs.l[0];
				cubeuid = cobj.uid;
				if (me._ILb/*sheetoption*/)
				{
					me._ILb/*sheetoption*/.cubeuid = cubeuid;
				}
			}
			
			if (ls)
			{
				t_0.store.loadData(__cs.l);
				t_0.setValue(cubeuid);
			}
			else
			{
				t_1.setValue(cobj ? cobj.name || "" : "");
			}
		}
		
		t_0.setVisible(ls);
		t_1.setVisible(!ls);
		t_2.setVisible(ls);
		
		me.lC/*loadCube*/(cobj);
		
		me._IFe/*initF*/.call(me);
	},
	
	_IH0/*loadFileCubeHeader*/: function(uid) {
		var cpanel=this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(cpanel, 
			{
	            ack: "5",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
	        }, cpanel, cpanel.r_IH0/*loadFileCubeHeader*/, null, null);
		req._l/*request*/();
	},
	
	r_IH0/*loadFileCubeHeader*/: function(xdoc) {
		var pivoteditor = this.down("[name=pivoteditor]"),
			browser = pivoteditor.browser,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/result/Header"),
			child = (tnode) ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			i, measures=[], dimensions=[], item,
			rootnode = browser.getRootNode(), record, records;
		
		if (child)
		{
			for (i=0; i < child.length; i++)
			{
				item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[i]);
				item.type = IG$/*mainapp*/._I34/*isNumericType*/(item.type) ? "Measure" : "Metric";
				item.leaf = true;
				item.checked = false;
				(item.type == "Measure") ? measures.push(item) : dimensions.push(item);
			}
			
			var dt = [];
			
			if (dimensions.length > 0)
			{
				dt.push({
					id: "metric_folder",
					name: "Metric",
					type: "Folder",
					leaf: false
				});
			}
			
			if (measures.length > 0)
			{
				dt.push({
					id: "measure_folder",
					name: "Measure",
					type: "Folder",
					leaf: false
				});
			}
			
			rootnode.appendChild(dt);
			
			var nmetric = browser.store.getNodeById("metric_folder");
			if (nmetric)
			{
				nmetric.appendChild(dimensions);
			}
			var nmeasure = browser.store.getNodeById("measure_folder");
			if (nmeasure)
			{
				nmeasure.appendChild(measures);
			}
		}
	},
	
	_IGf/*loadSQLCubeColumns*/: function() {
		var pivoteditor = this.down("[name=pivoteditor]"),
			browser = pivoteditor.browser,
			i, measures=[], dimensions=[], item,
			rootnode = browser.getRootNode(), record, records,
			ro = this._ILb/*sheetoption*/.sqloption;
			
		if (ro && ro.columns)
		{
			for (i=0; i < ro.columns.length; i++)
			{
				ro.columns[i].itemtype = ro.columns[i].type;
				ro.columns[i].leaf = true;
				ro.columns[i].checked = false;
				ro.columns[i].uid = ro.columns[i].uid || ro.columns[i].fieldname;
				if (ro.columns[i].type == "Measure")
				{
					measures.push(ro.columns[i]);
				}
				else
				{
					dimensions.push(ro.columns[i]);	
				}
			}
			
			var dt = [];
			
			if (dimensions.length > 0)
			{
				dt.push({
					id: "metric_folder",
					name: "Metric",
					type: "Folder",
					leaf: false
				});
			}
			
			if (measures.length > 0)
			{
				dt.push({
					id: "measure_folder",
					name: "Measure",
					type: "Folder",
					leaf: false
				});
			}
			
			rootnode.appendChild(dt);
			
			var nmetric = browser.store.getNodeById("metric_folder");
			if (nmetric)
			{
				nmetric.appendChild(dimensions);
			}
			var nmeasure = browser.store.getNodeById("measure_folder");
			if (nmeasure)
			{
				nmeasure.appendChild(measures);
			}
		}
	},
	
	_IFe/*initF*/: function() {
		var me = this,
			reportmode = this.reportmode;
		
		if (reportmode == "excel")
		{
			var fileuid = this.cubeuid;
			
			this._IH0/*loadFileCubeHeader*/(fileuid);
		}
		else if (reportmode == "sql")
		{
			setTimeout(function() {
				me._IGf/*loadSQLCubeColumns*/.call(me);
			}, 10);
		}
	},
	
	_IFf/*confirmDialog*/: function() {
		var pivoteditor = this.down("[name=pivoteditor]");

		pivoteditor._IFf/*confirmDialog*/.call(pivoteditor);
	},
	
	lC/*loadCube*/: function(cobj) {
		var me = this,
			mp = me.down("[name=mp]"),
			mpl = mp.items,
			p,
			i, l = mp.getLayout(),
			cubeuid = cobj ? cobj.uid : null,
			c, bf = 0;
			
		if (!cubeuid)
			return;
			
		for (i=0; i < mpl.items.length; i++)
		{
			c = mpl.items[i];
			
			if (c.__ckey == cubeuid)
			{
				bf = 1;
				l.setActiveItem(c);
				break;
			}
		}
		
		me.cubeuid = cubeuid;
		
		if (!bf)
		{
			p = new IG$/*mainapp*/._I98/*naviTree*/({
				showtoolbar: false,
				cubebrowse: true,
				collapsible: false,
				floatable: false,
				floating: false,
				ddGroup: "_I$RD_G_",
				
				__ckey: cubeuid,
				
				"layout": "fit",
				enabledrag: true,
				rootuid: "none",
				flex: 1,
				border: 0,
				_search: true,
				_IHb/*customEventOwner*/: me
			});
			
			p.on("afterrender", function(pobj) {
				var values = {};
				values.type = cobj.name;
				values.name = values.type;
				values.nodepath = values.type;
				values.uid = cubeuid || null;
					
				values.leaf = false;
		
				pobj.setRootNode.call(pobj, values);
				
				setTimeout(function() {
					pobj.getRootNode().expand();
				}, 10);
			});
			
			c = mp.add(p);
			l.setActiveItem(c);
		}
		
		me.fireEvent("cube_changed", me);
	},
	
	initComponent : function() {
		var reportmode,
			cubeuid,
			me = this;
		
		me.addEvents("cube_changed");
								
		$s.apply(me, {
			title: IRm$/*resources*/.r1("T_RPT_PIVOT"),
			header: false,
			tools: [
				{
				    type: "refresh",
				    tooltip: "Refresh",
				    handler: function(event, toolEl, panelHeader) {
				    	var me = this,
				    		pivoteditor = me.down("[name=pivoteditor]");
				    		
				    	var values = {};
						values.type = (me.reportmode == "rolap") ? "Cube" : "Metric";
						values.name = values.type;
						values.nodepath = values.type;
						values.uid = me.cubeuid || null;
							
						values.leaf = false;
				
						pivoteditor.browser.setRootNode.call(pivoteditor.browser, values);
						me.acubeuid = me.cubeuid;
						
						pivoteditor.browser.getRootNode().expand();
				    },
				    scope: me
				}
			],
			items: [
				{
					xtype: "panel",
					bodyBorder: false,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					// border: 0,
					items: [
						{
							xtype: "container",
							layout: {
								type: "hbox",
								pack: "center"
							},
							defaults: {
								margin: "4 2 0"
							},
							items: [
								{
									xtype: "combobox",
									name: "t_0",
									queryMode: "local",
									displayField: "name",
									valueField: "uid",
									editable: false,
									autoSelect: true,
									flex: 1,
                                    $w: 150,
									hidden: true,
									store: {
										fields: [
											"name", "uid"
										]
									},
									listeners: {
										change: function(tobj) {
											var me = this,
												rop = me._ILa/*reportoption*/,
												__cs = rop.__cs,
												cval = tobj.getValue(),
												i,
												cobj;
											
											if (!cval)
												return;
											
											for (i=0; i < __cs.l.length; i++)
											{
												if (__cs.l[i].uid == cval)
												{
													cobj = __cs.l[i];
													break;
												}
											}
											
											if (cobj.uid != me.cubeuid)
											{
												me.lC/*loadCube*/(cobj);
											}
										},
										scope: this
									}
								},
								{
									xtype: "displayfield",
									value: "",
									name: "t_1",
									$w: 150
								},
								{
									xtype: "button",
						        	iconCls: "icon-toolbar-addsheet",
						        	tooltip: IRm$/*resources*/.r1("B_ADD"),
						        	handler: function() {
						        		var rptptr = this.rptptr;
						        		rptptr._IB5/*showReportOption*/.call(rptptr, null, this);
						        	},
						        	scope: me
						        },
						        {
									xtype: "button",
									name: "t_2",
									iconCls: "icon-grid-delete",
									hidden: true,
									tooltip: IRm$/*resources*/.r1("B_DELETE"),
									handler: function() {
										var me = this,
											rop = me._ILa/*reportoption*/,
											__cs = rop.__cs,
											t_0 = me.down("[name=t_0]"),
											t_0v = t_0.getValue(),
											i;
											
										if (__cs.m[t_0v])
										{
											for (i=0; i < __cs.l.length; i++)
											{
												if (__cs.l[i].uid == t_0v)
												{
													__cs.l.splice(i, 1);
													break;
												}
											}
											delete __cs.m[t_0v];
											me._IGd/*loadSheetOption*/(me._ILb/*sheetoption*/, rop);
										}
									},
									scope: me
								}
							]
						},
						{
							xtype: "panel",
							layout: "card",
							name: "mp",
							flex: 1
						}
					]
				}
			]
		});
		
		IG$/*mainapp*/._Ibf/*pivotbrowser*/.superclass.initComponent.apply(me, arguments);
	},
	
	listeners: {
		afterrender: function() {
			var panel = this;
			panel._IFe/*initF*/();
		}	
	}
});
IG$/*mainapp*/._Ic0/*pivotadvancedoption*/ = $s.extend($s.window, {
	modal: true,
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 500,
	autoScroll: false,
	height: 550,
	maxHeight: 550,
	bodyPadding: 10,
	bodyStyle: {
		background: "#ffffff"
	},
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		var me = this;
		me.close();
		me.callback && me.callback.execute();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			_ILb/*sheetoption*/ = me._ILb/*sheetoption*/,
			mpos = 0, mval,
			cb_mloc = this.down("[name=cb_mloc]"),
			measureposition = this.down("[name=measureposition]");
			
		if (_ILb/*sheetoption*/)
		{
			mval = cb_mloc.getGroupValue();
			mpos = measureposition.getValue();
			
			if (mval == "row" && _ILb/*sheetoption*/.rows.length < mpos)
			{
				mpos = _ILb/*sheetoption*/.rows.length;
			}
			else if (mval == "column" && _ILb/*sheetoption*/.cols.length < mpos)
			{
				mpos = _ILb/*sheetoption*/.cols.length;
			}
			
			mpos = (mpos < 0) ? 0 : mpos;
			
			$.each(me._f, function(i, f) {
				var mf = me.down("[name=" + f + "]"),
					v;
					
				switch (f)
				{
				case "measurelocation":
					v = mval;
					break;
				case "measureposition":
					v = mpos;
					break;
				case "customfix":
				case "usepaging":
				case "measuretitle":
					v = mf.getValue() ? "T" : "F";
					break;
				default:
					v = mf.getValue();
					break;
				}
				
				_ILb/*sheetoption*/[f] = v;
			});
		}
		
		me._IG0/*closeDlgProc*/();
	},
	
	_IFd/*init_f*/: function() {
		var me = this,
			_ILb/*sheetoption*/ = me._ILb/*sheetoption*/;
		
		me._f = ["measurelocation", "measureposition", "measuretitle", "isdistinct", "fetchall", "treeview", "columntree", "isbigdecimal", "showlnum",
			"customfix", "customfixcols",
			"usepaging", "rowperpage", "pagestyle", "measureformat", "measureformatname"];
		
		if (_ILb/*sheetoption*/)
		{
			_ILb/*sheetoption*/.measureposition = (_ILb/*sheetoption*/.measureposition < 0) ? 0 : _ILb/*sheetoption*/.measureposition;
			
			$.each(me._f, function(i, f) {
				var mf = me.down("[name=" + f + "]"),
					v = _ILb/*sheetoption*/[f];
					
				switch (f)
				{
				case "measurelocation":
					mf.setValue({cb_mloc: [v]});
					break;
				case "customfix":
				case "usepaging":
				case "measuretitle":
					mf.setValue(v == "T");
					f == "customfix" && me.down("[name=customfixcols]").setVisible(v == "T");
					break;
				case "customfixcols":
					mf.setValue(v || 0);
					break;
				case "rowperpage":
					mf.setValue(v || 20);
					break;
				case "pagestyle":
					mf.setValue(v || "normal");
					break;
				default:
					mf.setValue(v);
					break;
				}
			});
		}
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1("L_ADV_OPTION");
		
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					"layout": "anchor",
					autoScroll: true,
					bodyPadding: 5,
					defaults: {
						anchor: "100%"
					},
					fieldDefaults: {
						labelWidth: 100
					},
					items: [
						{
							xtype: "fieldset",
				    		title: IRm$/*resources*/.r1("L_M_POSITION"),
				    		collapsible: false,
				    		defaults: {
				    			anchor: "100%"
				    		},
				    		items: [
				    			{
									name: "measurelocation",
									fieldLabel: IRm$/*resources*/.r1("L_MEASURE_ON"),
									xtype: "radiogroup",
					            	plain: true,
									items: [
										{boxLabel: IRm$/*resources*/.r1("L_P_ROW"), name: "cb_mloc", inputValue: "row"},
										{boxLabel: IRm$/*resources*/.r1("L_P_COL"), name: "cb_mloc", inputValue: "column", checked: true}
									],
									listeners: {
									}
								},
								{
									xtype: "numberfield",
									name: "measureposition",
									fieldLabel: IRm$/*resources*/.r1("L_M_POSITION"),
									minValue: 0,
									maxValue: 99,
									value: 0,
									anchor: "60%"
								},
								{
									xtype: "checkbox",
									name: "measuretitle",
									fieldLabel: IRm$/*resources*/.r1("L_M_TITLE"),
									boxLabel: IRm$/*resources*/.r1("B_ENABLED")
								},
								{
									xtype: "fieldcontainer",
									fieldLabel: IRm$/*resources*/.r1("L_FIX_COLUMN"),
									layout: {
										type: "hbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "checkbox",
											name: "customfix",
											boxLabel: IRm$/*resources*/.r1("L_CUSTOM_FIX"),
											listeners: {
												change: function(tobj, newValue, oldValue, eOpts) {
													var me = this,
														customfixcols = me.down("[name=customfixcols]");
														
													customfixcols.setVisible(newValue);
												},
												scope: this
											}
										},
										{
											xtype: "numberfield",
											name: "customfixcols",
											minValue: 0,
											maxValue: 10,
											value: 0
										}
									]
								}
							]
						},
						{
							xtype: "fieldset",
							layout: "anchor",
							title: IRm$/*resources*/.r1("L_M_FORMAT"),
							items: [
								{
									xtype: "textfield",
									fieldLabel: IRm$/*resources*/.r1("L_M_FORMAT"),
									name: "measureformat"
								},
								{
									xtype: "textfield",
									fieldLabel: IRm$/*resources*/.r1("L_M_NAME"),
									name: "measureformatname"
								},
								{
									xtype:"displayfield",
									value: "* Merge multiple measure in single column"
								}
				    		]
						},
						{
							xtype: "fieldset",
							layout: "anchor",
							title: IRm$/*resources*/.r1("L_PAGING"),
							items: [
								{
									xtype: "checkbox",
									name: "usepaging",
									fieldLabel: IRm$/*resources*/.r1("L_USE_PAGING"),
									boxLabel: IRm$/*resources*/.r1("B_ENABLED")
								},
								{
									xtype: "numberfield",
									name: "rowperpage",
									fieldLabel: IRm$/*resources*/.r1("L_ROW_P_PAGE"),
									minValue: 10,
									maxValue: 1000,
									value: 20
								},
								{
									xtype: "combobox",
									name: "pagestyle",
									fieldLabel: IRm$/*resources*/.r1("L_PAGE_STYLE"),
									queryMode: 'local',
									displayField: 'name',
									valueField: 'value',
									editable: false,
									autoSelect: true,
									store: {
										xtype: "store",
										fields: ["name", "value"],
										data: [
											{name: "Normal", value: "normal"},
											{name: "10 pages", value: "p10"},
											{name: "5 pages", value: "p5"},
											{name: "2 buttons", value: "button2"}
										]
									}
								}
							]
						},
						{
							xtype: "fieldset",
				    		title: IRm$/*resources*/.r1("L_TREE_VIEW"),
				    		collapsible: false,
				    		items: [
				    			{
						  			xtype: "form",
						  			layout: "anchor",
						  			border: 0,
						  			hidden: false,
						  			defaults: {
						  				anchor: "100%"
						  			},
						  			items: [
						  				{
						  					xtype: "checkbox",
						  					boxLabel: IRm$/*resources*/.r1("L_ENABLE_TREE_VIEW"),
						  					name: "treeview",
						  					bodyPadding: "0 10 10 10"
						  				},
						  				{
						  					xtype: "checkbox",
						  					boxLabel: IRm$/*resources*/.r1("L_COL_TREE"),
						  					name: "columntree",
						  					bodyPadding: "0 10 10 10"
						  				}
						  			]
						  		}
				    		]
						},
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1("L_OTHER_OPTION"),
							collapsible: false,
							items: [
								{
									xtype: "checkbox",
									fieldLabel: IRm$/*resources*/.r1("L_DISTINCT"),
									name: "isdistinct",
									boxLabel: IRm$/*resources*/.r1("B_ENABLED")
								},
								{
									xtype: "checkbox",
									fieldLabel: IRm$/*resources*/.r1("L_FETCH_ALL"),
									name: "fetchall",
									boxLabel: IRm$/*resources*/.r1("B_ENABLED")
								},
								{
									xtype: "checkbox",
									fieldLabel: IRm$/*resources*/.r1("L_NUM_PREC"),
									boxLabel: IRm$/*resources*/.r1("L_HIGH_PREC"),
									bodyPadding: "0 10 10 10",
									name: "isbigdecimal"
								},
								{
									xtype: "checkbox",
									fieldLabel: IRm$/*resources*/.r1("L_LINE_NUM"),
									name: "showlnum",
									boxLabel: IRm$/*resources*/.r1("B_ENABLED")
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
		
		IG$/*mainapp*/._Ic0/*pivotadvancedoption*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj._IFd/*init_f*/.call(tobj);
		}
	}
});
IG$/*mainapp*/.dlg_pivot = $s.extend($s.window, {
	modal: false,
	region:'center',
	"layout": {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable: true,
	height: 520,
	
	callback: null,
	
	Uc/*updateCubeSelection*/: function(cubeuid) {
		var me = this,
			sheets = me.report_ptr.sheets;
		
		$.each(sheets, function(i, sheet) {
			sheet.Uc/*updateCubeSelection*/.call(sheet, cubeuid);
		});
	},
	
	init$f: function() {
		var me = this,
			sindex = me.sheetindex,
			sop = me._ILa/*reportoption*/.sheets[sindex],
			pb = me.down("[name=p1]"),
			pe = me.down("[name=pivoteditor]"),
			cubeuid,
			bcube;
		
		me.report_ptr.dlg_pivot = me;

		if (me.objtype == "FILTER")
		{
			pb._IGd/*loadSheetOption*/.call(pb, me._ILa/*reportoption*/.sheets[sindex], me._ILa/*reportoption*/);
		}
		else
		{
			pe._IJa/*activeSheet*/ = sindex,
			pe._ILa/*reportoption*/ = me._ILa/*reportoption*/;
			pe._ILb/*sheetoption*/ = sop;
			
			var basecubeuid = me._ILa/*reportoption*/.__cs && me._ILa/*reportoption*/.__cs.l && me._ILa/*reportoption*/.__cs.l.length ? me._ILa/*reportoption*/.__cs.l[0].uid : null; 
			
			cubeuid = sop ? sop.cubeuid || basecubeuid : basecubeuid;
			
			if (sop && !sop.cubeuid)
			{
				sop.cubeuid = basecubeuid;
			}
			
			if (cubeuid)
			{
				bcube = sop ? sop.Uc/*checkCubeAvailable*/.call(sop, cubeuid) : true;
		
				if (bcube)
				{
					sop.cubeuid = cubeuid;
				}
			}
			
			pe.cubeuid = sop ? sop.cubeuid : null;
		
			pe.Uc/*updateCubeSelection*/.call(pe, cubeuid, bcube);
			
			pb._IGd/*loadSheetOption*/.call(pb, me._ILa/*reportoption*/.sheets[sindex], me._ILa/*reportoption*/);
			
			setTimeout(function() {
				pe._IL1/*applyCurrentPivotInfo*/.call(pe);
				pe._c = 1;
			}, 20);
		}
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			pivot = me.down("[name=pivoteditor]");
		
		if (me.objtype == "FILTER")
		{
			me.close();
			return;
		}
		
		pivot._IFf/*confirmDialog*/.call(pivot);
		
		$.each(me.report_ptr.sheets, function(n, sheet) {
			if (sheet.sheetindex == me.sheetindex)
			{
				sheet._IFf/*confirmDialog*/.call(sheet);
			}
		});
		
		me.close();
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1('L_PIVOT_REPORT');
		
		$s.apply(this, {
			width: me.objtype == "FILTER" ? 210 : 820,
			bodyStyle: 'padding:5px; background: #ffffff',
			border: 0,
			items: [
				{
					xtype: "panel",
					layout: "border",
					items: [
						new IG$/*mainapp*/._Ibf/*pivotbrowser*/({
							name: "p1",
							region: "center",
							flex: 1,
							// height: 400,
							border: 0,
							resizable: true,
							rptptr: me.report_ptr,
							callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IO3/*updatePivotContent*/),
							listeners: {
								"cube_changed": function(tobj, ev) {
									var me = this,
										cubeuid = tobj.cubeuid;
									
									cubeuid && me.Uc/*updateCubeSelection*/(cubeuid);
								},
								scope: this
							}
						}),
						new IG$/*mainapp*/._IGe/*pivot*/({
							name: "pivoteditor",
							flex: 3,
							layoutmode: "panel",
							region: "east",
							hidden: me.objtype == "FILTER",
							split: true,
							resizable: true,
							_i0/*pivotEditorMode*/: true,
							border: 0
						})
					]
				}
			],
			buttons:[
				"->",
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					hidden: me.objtype == "FILTER",
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
				afterrender: function(tobj) {
					this.init$f();
				},
				close: function(tobj) {
					tobj.report_ptr.dlg_pivot = null;
				},
				scope: this
			}
		});
		
		IG$/*mainapp*/.dlg_pivot.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/.mA$_b/*dlgsqlview*/ = $s.extend($s.window, {
	xtype: "window",
	
	modal: true,
	region:'center',
	
	"layout": 'fit',
	
	closable: false,
	resizable:false,
	
	width: 500,
	height: 400,
	
	defaults:{bodyStyle:'padding:10px'},
	
	callback: null,
	_ILa/*reportoption*/: null,
	_ILb/*sheetoption*/: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	sv/*requestSQLResult*/: function() {
		var me = this;
		if (me._ILb/*sheetoption*/ != null && me._ILa/*reportoption*/ != null)
		{
			var pivotxml = me._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(me._ILa/*reportoption*/),
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				
	    	req.init(me, 
				{
		            ack: "18",
		            payload: '<smsg><item uid="' + me.uid + '" option="sql" active="' + me._IJa/*activeSheet*/ + '"/></smsg>',
		            mbody: pivotxml
		        }, me, me.rs_sv/*requestSQLResult*/, null);
			req._l/*request*/();
		}
	},
	
	rs_sv/*requestSQLResult*/: function(xdoc) {
		var me = this,
			sql,
			html = me.down('[name=sqlview]'),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/item/ExecuteQuery');
		
		if (tnode)
		{
			sql = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
			// $(html.body.dom).html(sql);
			html.setValue(sql);
		}
	},
	
	items: [
	    {
	    	xtype: "textarea",
	    	name: 'sqlview',
	    	readOnly: true
	    }
	],
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1('L_VIEW_SQL');
		
		me.buttons = [
			{
				text: IRm$/*resources*/.r1('B_CLOSE'),
				handler: function() {
					this.close();
				},
				scope: this
			}
		];
		
		me.listeners = {
			afterrender: function() {
				this.sv/*requestSQLResult*/();
			}
		};
	
		IG$/*mainapp*/.mA$_b/*dlgsqlview*/.superclass.initComponent.apply(this, arguments);
	}
});

//IG$/*mainapp*/.ltM = [
//	{name: "1 Cell", value: "1C"},
//	{name: "2 Rows", value: "2E"},
//	{name: "2 Columns", value: "2U"},
//	{name: "3 Rows", value: "3E"},
//	{name: "3 Columns", value: "3W"},
//	{name: "3 Cells left split", value: "3J"},
//	{name: "3 Cells low split", value: "3T"},
//	{name: "3 Cells right split", value: "3L"},
//	{name: "3 Cells top split", value: "3U"},
//	{name: "4 Cells low split", value: "4T"},
//	{name: "4 Cells top split", value: "4U"},
//	{name: "4 Cells right split", value: "4C"}
//];

IG$/*mainapp*/.ltW = IG$/*mainapp*/.ltW || [
	{
		name: "jobcategory",
		type: "select",
		categ: "jobcategory",
		shortdesc: "Begin Here",
		title: "Before You Begin",
		items: [
			{
				name: "rdbms",
				title: "Relational Database",
				actiontype: "gotomenu",
				action: "rdbms;cube;report",
				desc: "Follow step for relational database analysis."
			},
//			{
//				name: "molap",
//				title: "Multi-Dimensional Cube",
//				actiontype: "gotomenu",
//				action: "molap;cube;report",
//				desc: "Multi Dimensional cube for large data files."
//			},
			{
				name: "sql",
				title: "Analysis by SQL Query",
				actiontype: "gotomenu",
				action: "sql;cube;report",
				desc: "Advanced SQL Query to analysis."
			},
			{
				name: "excel",
				title: "Excel file analysis",
				actiontype: "gotomenu",
				action: "excel;cube;report",
				desc: "Local file to analysis report."
			},
			{
				name: "nosql",
				title: "Big data analysis",
				actiontype: "gotomenu",
				action: "nosql;report",
				desc: "Big data without boundary."
			},
			{
				name: "browse",
				title: "Browse existing content",
				actiontype: "gotomenu",
				action: "browse;report",
				desc: "Get your analysis report on browser."
			},
			{
				name: "report",
				title: "Make report",
				actiontype: "gotomenu",
				action: "report",
				desc: "Make new report with easy guides."
			},
			{
				name: "rstatistics",
				title: "R Statistics",
				actiontype: "gotomenu",
				action: "report;rstatistics",
				desc: "Powerful statistical engine for your report."
			}
		]
	},
	{
		name: "connectdb",
		categ: "rdbms",
		shortdesc: "Database",
		title: "Connect database.",
		type: "cmd",
		btnname: "New Database Instance",
		desc: "<b>Click [button] to open connect database manager.</b>"
	},
	{
		name: "registertable",
		categ: "rdbms",
		shortdesc: "Register Tables",
		title: "Register Tables.",
		type: "cmd",
		btnname: "Table Register Manager",
		desc: "<b>Click [button] to open register table manager.</b>"
	},
	{
		name: "datamodel",
		categ: "rdbms",
		shortdesc: "Data Modelling",
		title: "Make relations between tables.",
		type: "cmd",
		btnname: "New Relational Model",
		desc : "<b>Click [button] to make new datamodel.</b>"
	},
	{
		name: "codmapping",
		categ: "cube",
		shortdesc: "Code Mapping",
		title: "Define Code Mapping DataSet.",
		type: "cmd",
		btnname: "Define Code Mapping",
		desc : "<b>Click [button] to Code Mapping Manager.</b>"
	},
	{
		name: "variables",
		categ: "cube",
		shortdesc: "Variables",
		title: "Define Mostly Used Variables.",
		type: "cmd",
		btnname: "Define Variables",
		desc : "<b>Click [button] to Variables Manager.</b>"
	},
	{
		name: "rcube",
		categ: "rdbms",
		shortdesc: "Make Cube",
		title: "Make Cube for analysis subject.",
		type: "cmd",
		btnname: "New Relational Cube",
		desc: "<b>Click [button] to make new Cube</b>"
	},
//	{
//		name: "molapcube",
//		categ: "molap",
//		shortdesc: "Load data",
//		title: "Load datafiles for analysis subject.",
//		type: "cmd",
//		btnname: "New Multi Diemension Cube",
//		desc: "<b>Click [button] to create multi dimensional Cube.</b><br>Multi dimensional cube is optimized to analysis 2Gbytes data files with fast and convenient multi dimensional reliable environment."
//	},
	{
		name: "sqlloading",
		categ: "sql",
		shortdesc: "Create SQL Cube",
		title: "Set SQL query to execute.",
		type: "cmd",
		btnname: "New SQL Cube",
		desc: "<b>Click [button] to create SQL to Analysis subject.</b>"
	},
	{
		name: "openexcel",
		categ: "excel",
		enabled: false,
		shortdesc: "Upload Excel or CSV file",
		title: "Upload file and change Metric attribute or options.",
		type: "cmd",
		btnname: "New File Cube",
		desc: "<b>Click [button] to set detailed information on columns</b>"
	},
	{
		name: "prerequirements",
		categ: "nosql",
		shortdesc: "Pre requirements",
		title: "Pre requirements for big data analysis.",
		type: "wizard"
	},
	{
		name: "selectnode",
		categ: "nosql",
		shortdesc: "Select node",
		title: "Select node and data category.",
		type: "wizard"
	},
	{
		name: "beforerstat",
		categ: "rstatistics",
		shortdesc: "Before begin",
		title: "Before begin R statistics",
		type: "html",
		html: "<p>R statistics is available on each report. You can transfer between items with sheet/chart/R statistics on report toolbar menu.</p><p>R runs with script running on server. Make your R script or select one on the templates.</p>"
	},
	
	{
		name: "rscript",
		categ: "rstatistics",
		shortdesc: "R Script",
		title: "Select R script for statistical analysis.",
		type: "wizard"
	},
	
	{
		name: "report",
		categ: "report",
		shortdesc: "Make Report",
		title: "Make Report with Pivot.",
		type: "cmd",
		btnname: "New Report",
		desc: "<b>Click [button] to make new Report</b>"
	},
	
	{
		name: "dashboard",
		categ: "dashboard",
		shortdesc: "Make Dashboard",
		title: "Make Dashboard with multiple reports.",
		type: "cmd", // "html",
		btnname: "New Dashboard",
		desc: "<b>Click [button] to make new Dashboard</b>"
//		html: "<p>Select template to generate on this page</p>" +
//				"<p><select id='layout'></select></p>" +
//				"<p></p>" + 
//				"<p><span>Preview image: </span><br/><img id='preview'></img></p>" +
//				"<p></p>" +
//				"<p><b>Click here to make new dashboard layout</b></p>" + 
//				"<p><div id='btngo' class='idv-st-btn'>Continue</div></p>",
//		post: function(viewer, layout) {
//			var l = $("#layout", layout),
//				img = $("#preview", layout),
//				btngo = $("#btngo", layout),
//				items = [],
//				i;
//			
//			for (i=0; i < IG$/*mainapp*/.ltM.length; i++)
//			{
//				items.push({name: IG$/*mainapp*/.ltM[i].name, value: IG$/*mainapp*/.ltM[i].value});
//			}
//			
//			for (i=0; i < items.length; i++)
//			{
//				$("<option value='" + items[i].value + "'>" + items[i].name + "</option>").appendTo(l);
//			}
//			
//			// img.attr("src", "./images/layout/1C.png");
//			img.addClass("ig-l-base");
//			img.addClass("ig-l-1C");
//			
//			l.bind("change", function() {
//				var v = $("option:selected", l).val();
//				img.addClass("ig-l-" + v);
//				// img.attr("src", "./images/layout/" + v + ".png");
//			});
//			
//			btngo.bind("click", function() {
//				viewer.container.fadeOut(1000);
//				var v = $("option:selected", l).val(),
//					opt = {};
//				if (v)
//				{
//					opt.reportlayout = v;
//				}
//				IG$/*mainapp*/.prM/*smartProcess*/("dashboard", null, opt);
//			});
//		}
	}
];

IG$/*mainapp*/.sMM/*smartwizardbutton*/ = function() {
	
}

IG$/*mainapp*/.sMM/*smartwizardbutton*/.prototype = {
	show: function() {
		this.klink.removeClass("disabled");
		this.klink.addClass("selected");
		this.content.fadeIn();
	},
	hide: function() {
		this.klink.removeClass("selected");
		this.klink.addClass("disabled");
		this.content.hide();
	}
}

IG$/*mainapp*/.prM/*smartProcess*/ = function(cmd, btnid, opt) {
	var mp = IG$/*mainapp*/._I7d/*mainPanel*/ || null;
	
	switch (cmd)
	{
	case "registertable":
		IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_TABLE_REGISTER");
		break;
	case "connectdb":
		IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_CONNECT_DB");
		break;
	case "datamodel":
		mp.m1$7/*navigateApp*/.call(mp, null, "CubeModel".toLowerCase(), "New DataModel", null, null, true);
		break;
	case "rcube":
		mp.m1$7/*navigateApp*/.call(mp, null, "Cube".toLowerCase(), "New Cube", null, null, true);
		break;
	case "report":
		mp.m1$7/*navigateApp*/.call(mp, null, "Report".toLowerCase(), "New Report", null, null, true);
		break;
	case "dashboard":
		mp.m1$7/*navigateApp*/.call(mp, null, "Dashboard".toLowerCase(), "New Dashboard", null, null, true, opt);
		break;
	case "molapcube":
		mp.m1$7/*navigateApp*/.call(mp, null, "MCube".toLowerCase(), "New MCube", null, null, true, opt);
		break;
	case "setmicrocube":
		mp.m1$7/*navigateApp*/.call(mp, null, "DataCube".toLowerCase(), "LocalFileLoader", null, null, true);
		break;
	case "openexcel":
		mp.m1$7/*navigateApp*/.call(mp, null, "DataCube".toLowerCase(), "LocalFileLoader", null, null, true);
		break;
	case "sqlloading":
		mp.m1$7/*navigateApp*/.call(mp, null, "SQLCube".toLowerCase(), "SQL Cube", null, null, true);
		break;
	case "close_wizard":
		IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_HOME");
		break;
	case "codmapping":
		IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_LOOKUP");
		break;
	case "variables":
		IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_VAR");
		break;
	}
}

IG$/*mainapp*/._I80/*smartwizard*/ = function(cobj, categ) {
	var me = this,
		container = $(cobj.dwizard.el.dom),
		cbar_area = $(cobj.dwizard_bar.el.dom);
		
	this.container = container;
	this.cbar_area = cbar_area;
	
	container.empty();
	cbar_area.empty();
	
	var bg = $("<div class='app-wizard-bg'></div>").appendTo(this.container);
	// this.title = $("<div class='app-wizard-title'><span>Step by Step Wizard</span><div class='close' id='btnclosewizard'></div></div>").appendTo(this.container);
	this.html = $("<div class='idv-wz-cntl'></div>").appendTo(this.container);
	
	// $("#btnclosewizard", this.title).bind("click", function() {
	//	me.container.hide();
	// });
	this.categ = categ;
	this.categmap = [];
	
	this.initialize();
}

IG$/*mainapp*/._I80/*smartwizard*/.prototype = {
	initialize: function() {
		var me = this,
			i,
			categ = me.categ;
		
		this.html.empty();
		me.categmap = {};
		me.c_nstep = 0;
		
		for (i=0; i < categ.length; i++)
		{
			me.categmap[categ[i].name] = categ[i];
		}
		
		me.c_step = categ[0];
		
		me.drawStep();
		
		var actionbar = {},
			abtnbox;
		actionbar.bar = $("<div class='idv-st-abar'></div>").appendTo(this.cbar_area);
		// actionbar.msgbox = $("<div class='idv-st-msgbx'></div>").appendTo(actionbar.bar);
		// actionbar.msgcontent = $("<div class='idv-st-msgcnt'></div>").appendTo(actionbar.msgbox);
		// actionbar.msgclose = $("<div class='idv-st-btn-cl'>X</a>").appendTo(actionbar.msgbox);
		//actionbar.remember = $("<input type='checkbox' id='wizard_optn'></input><label for='wizard_optn'>Open on startup.</label>")
		//	.appendTo($("<div class='idv-wz-rmbr'></div>")
		//	.appendTo(actionbar.bar));
		// actionbar.loader = $("<div class='idv-st-ldr'>Loading</div>").appendTo(actionbar.bar);
		actionbar.finish = $("<button class='idv-st-btn idv-st-btn-finish'>Finish</button>").appendTo(actionbar.bar);
		
		abtnbox = $("<div class='idv-st-btn-box'></div>").appendTo(actionbar.bar);
		actionbar.prev = $("<button class='idv-st-btn idv-st-btn-prev'>Previous</button>").appendTo(abtnbox);
		actionbar.next = $("<button class='idv-st-btn idv-st-btn-next'>Next</button>").appendTo(abtnbox);
		
		actionbar.next.addClass("idv-st-btn-disable");
		actionbar.prev.addClass("idv-st-btn-disable");
		
//		actionbar.msgclose.bind("click", function() {
//			me.hidemsg();
//		});
		actionbar.finish.bind("click", function() {
			// me.container.hide();
			IG$/*mainapp*/.prM/*smartProcess*/("close_wizard");
		});
		
		actionbar.next.bind("click", function() {
			me.doStep.call(me, 1);
		});
		actionbar.prev.bind("click", function() {
			me.doStep.call(me, -1);
		});
		
//		var ischecked = $.cookie("wizard");
//		if (ischecked != "F")
//		{
//			actionbar.remember.prop("checked", true);
//		}
//		actionbar.remember.bind("change", function() {
//			var checked = actionbar.remember.attr('checked');
//			if (!checked)
//			{
//				me.showmsg.call(me, "Open later on top right menu.");
//			}
//			else
//			{
//				me.hidemsg.call(me);
//			}
//			
//			$.cookie("wizard", (checked) ? "T" : "F");
//		});
		this.actionbar = actionbar;
	},
	
	drawStep: function() {
		var me = this,
			html = me.html,
			i,
			categ = me.categ;
		
		me.stepcontainer = $("<div class='idv-st-cnter'></div>").appendTo(html);
		me.stepul = $("<ul class='idv-st-anch'></ul>").appendTo(html);
		
		me.stepitems = [];
		
		$.each(categ, function(i, c) {
			var j,
				s = i+1,
				mclass = (i == me.c_nstep) ? "selected" : "disabled",
				mitem = new IG$/*mainapp*/.sMM/*smartwizardbutton*/(), kul, klink, tnode;
				
			mitem.kul = $("<li></li>").appendTo(me.stepul);
			mitem.klink = $("<a href='#' class='" + mclass + "'></a>").appendTo(mitem.kul);
			mitem.item = c;
			mitem.label = $("<label class='idv-st-nbr'>" + s + "</label>").appendTo(mitem.klink);
			// mitem.stepdesc = $("<span class='idv-st-desc'>" + c.shortdesc + "<br><small id='mstep'>Step " + s + "</small></span>").appendTo(mitem.klink);
			mitem.stepdesc = $("<span class='idv-st-desc'>" + c.shortdesc + "</span>").appendTo(mitem.klink);
			mitem.content = $("<div class='idv-st-cnt'></div>").appendTo(me.stepcontainer);
			mitem.ctitle = $("<h2 class='idv-st-stitle'><span id='mstep'>Step" + s + "</span> : " + c.title + "</h2>").appendTo(mitem.content);
			
			switch (c.type)
			{
			case "select":
				var tul = $("<ul class='idv-st-sel'></ul>").appendTo(mitem.content);
				c.divdesc = $("<div class='idv-st-sel-desc'></div>").appendTo(mitem.content);
				$.each(c.items, function(m, cmenu) {
					if (cmenu.enabled != false) 
					{
						var dm = $("<li class='idv-st-sel-item'><a href='#'>" + cmenu.title + "</a></li>").appendTo(tul);
						dm.bind("click", function() {
							switch (cmenu.actiontype)
							{
							case "gotomenu":
								var action = cmenu.action;
								
								if (me.loadedAction == action)
								{
									me.doStep.call(me, 1);
								}
								else
								{
									me.loadActionMenu.call(me, action, c, cmenu);
								}
								break;
							}
						});
					}
				});
				break;
			case "cmd":
				tnode = $("<div class='idv-st-inr'></div>").appendTo(mitem.content);
				$("<div>" + mitem.item.desc + "</div>").appendTo(tnode);
				var cmdbutton = $("<div class='idv-st-btn'>" + (mitem.item.btnname || "Continue") + "</div>").appendTo(tnode);
				cmdbutton.bind("click", function() {
					// me.container.fadeOut(1000);
					IG$/*mainapp*/.prM/*smartProcess*/(mitem.item.name);
				});
				break;
			case "html":
				tnode = $("<div class='idv-st-inr'></div>").appendTo(mitem.content);
				$(mitem.item.html).appendTo(tnode);
				if (mitem.item.buttons && mitem.item.buttons.length > 0)
				{
					$.each(mitem.item.buttons, function(btnsq, btnname) {
						$("#" + btnname, tnode).bind("click", function() {
							IG$/*mainapp*/.prM/*smartProcess*/(mitem.item.name, btnname);
						});
					});
				}
				
				if (mitem.item.post)
				{
					mitem.item.post(me, tnode);
				}
				break;
			}
			
			if (i > 0)
			{
				mitem.kul.hide();
				mitem.content.hide();
			}
			
			mitem.klink.bind("click", function() {
				var m,
					mstep = -1,
					cname = mitem.item.name;
				
				if (cname == me.stepitems[0].item.name)
				{
					mstep = 0;
				}
				else
				{
					for (m=0; m < me.actionsteps.length; m++)
					{
						if (me.actionsteps[m].item.name == cname)
						{
							mstep = m + 1;
							break;
						}
					}
				}
				
				if (mstep > -1)
				{
					me.goStep.call(me, mstep);
				}
			});
			
			me.stepitems.push(mitem);
		});
	},
	
	loadActionMenu: function(action, categ, menu) {
		var i,
			me = this,
			nstep = 1, item,
			pstep = 2;
		me.loadedAction = action;
		me.actionbar.next.removeClass("idv-st-btn-disable");
		action = ";" + action + ";";
		me.actionsteps = [];
		me.c_nstep = 0;
		me.hidemsg();
		categ.divdesc.show();
		categ.divdesc.html(menu.desc);
		for (i=1; i < me.stepitems.length; i++)
		{
			item = me.stepitems[i];
			if (action.indexOf(";" + item.item.categ + ";") > -1)
			{
				item.hide();
				item.label.html("" + pstep);
				item.kul.fadeIn();
				$("#mstep", item.stepdesc).html("Step " + pstep);
				$("#mstep", item.ctitle).html("Step " + pstep);
				nstep++;
				pstep++;
				me.actionsteps.push(item);
			}
			else
			{
				item.kul.hide();
			}
		}
	},
	
	doStep: function(incr) {
		var me = this,
			i, nstep = me.c_nstep + incr;
		if (me.actionsteps && me.actionsteps.length > 0 && nstep > -1 && nstep < me.actionsteps.length + 1)
		{
			me.goStep(nstep);
		}
		else
		{
			var err = "";
			if (!me.actionsteps || (me.actionsteps && me.actionsteps.length == 0))
			{
				err = "Click work category to proceed!";
			}
			me.showmsg(err);
		}
	},
	
	goStep: function(nstep) {
		var me = this,
			i;
		me.hidemsg();
		if (nstep == 0)
		{
			me.stepitems[0].show();
			me.actionbar.next.removeClass("idv-st-btn-disable");
			me.actionbar.prev.addClass("idv-st-btn-disable");
		}
		else
		{
			me.stepitems[0].hide();
			if (me.actionsteps.length == nstep)
			{
				me.actionbar.next.addClass("idv-st-btn-disable");
			}
			else
			{
				me.actionbar.next.removeClass("idv-st-btn-disable");
			}
			
			me.actionbar.prev.removeClass("idv-st-btn-disable");
		}
		
		if (me.actionsteps)
		{
			for (i=0; i < me.actionsteps.length; i++)
			{
				if (i+1 == nstep)
				{
					me.actionsteps[i].show();
				}
				else
				{
					me.actionsteps[i].hide();
				}
			}
		}
		me.c_nstep = nstep;
	},
	
	showmsg: function(msg) {
		// this.actionbar.msgcontent.html(msg);
		// this.actionbar.msgbox.fadeIn(1000);
	},
	
	hidemsg: function() {
		// this.actionbar.msgbox.fadeOut(1000);
	}
}
IG$/*mainapp*/._I7c/*scheduler*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	padding: 10,
	closable: true,
	iconCls: "icon-schedule",
	layout: {
		type: "vbox",
		align: "stretch"
	},
	
	_IFd/*init_f*/: function() {
		var me = this;
		me.l1/*getServerStatus*/();
	},
	
	l1/*getServerStatus*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
                ack: "22",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({action: "checkstatus"}, "action"),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
            }, panel, panel.rs_l1/*getServerStatus*/, null);
        req._l/*request*/();
	},
	
	rs_l1/*getServerStatus*/: function(xdoc) {
		var me = this,
			txtstatus = me.down("[name=txtstatus]"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/status"),
			mnode,
			code,
			msg = "Failed to check status";
			
		if (tnode)
		{
			code = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "code");
			
			if (code == "100")
			{
				msg = "Schedule server is running and normal";
			}
			else if (code == "1")
			{
				msg = "Schedule server is disabled";
			}
			else if (code == "5")
			{
				mnode = IG$/*mainapp*/._I19/*getSubNode*/(tnode, "message");
				msg = "Error while connect schedule server. errorcode: (" + IG$/*mainapp*/._I1b/*XGetAttr*/(mnode, "errcode") + ") " + IG$/*mainapp*/._I24/*getTextContent*/(mnode);
			}
			else if (code = "6")
			{
				msg = "Server result xml is not well formed";
			}
		}
		
		txtstatus.setValue(msg);
		
		me.l2/*getJobList*/();
	},
	
	l2/*getJobList*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
                ack: "22",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({action: "list"}, "action"),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
            }, panel, panel.rs_l2/*getJobList*/, null);
        req._l/*request*/();
	},
	
	rs_l2/*getJobList*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
			i, sc, scs = [],
			grdjoblist = me.down("[name=grdjoblist]"),
			disp_job = me.down("[name=disp_job]"),
			grddetail = me.down("[name=grddetail]"),
			g, desc, pnode, sctype;
			
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				sc = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				desc = "Unknown";
				switch (sc.pstatus)
				{
				case "A":
					desc = "Ready to Pickup";
					break;
				case "C":
					desc = "Completed";
					break;
				case "E":
					desc = "User Cancelled";
					break;
				}
				sc.pstatus_desc = desc;
				sc.crtdate_desc = IG$/*mainapp*/._I40/*formatDate*/(sc.crtdate);
				sc.uptdate_desc = IG$/*mainapp*/._I40/*formatDate*/(sc.uptdate);
				sc.pickdate_desc = sc.pickdate ? IG$/*mainapp*/._I40/*formatDate*/(sc.pickdate) : null;
				sc.enddate_desc = sc.enddate ? IG$/*mainapp*/._I40/*formatDate*/(sc.enddate) : null;
				sctype = IRm$/*resources*/.r1("L_SC_" + sc.sctype);

				sc.sc = sctype + " " + sc.scoption
				
				pnode = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "program");
				
				if (pnode)
				{
					sc.objname = IG$/*mainapp*/._I1b/*XGetAttr*/(pnode, "name");
				}
				
				scs.push(sc);
			}
		}
		
		disp_job.setVisible(true);
		grddetail.setVisible(false);
		
		grdjoblist.store.loadData(scs);
	},
	
	l3/*getJobDetail*/: function(sid) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
                ack: "22",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({sid: sid, action: "joblist"}, "sid;action"),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
            }, panel, panel.rs_l3/*getJobDetail*/, null);
        req._l/*request*/();
	},
	
	rs_l3/*getJobDetail*/: function(xdoc) {
		var me = this,
			disp_job = me.down("[name=disp_job]"),
			grddetail = me.down("[name=grddetail]"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"), 
			i, jobs = [], job, 
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			desc;
		
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				job = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				desc = "Unknown";
				switch (job.pstatus)
				{
				case "I":
					desc = "Running";
					break;
				case "C":
					desc = "Completed";
					break;
				case "Q":
					desc = "Queue Waiting";
					break;
				case "X":
					desc = "Running";
					break;
				case "T":
					desc = "Cancel Queue";
					break;
				case "M":
					desc = "Cancelled";
					break;
				}
				job.pstatusdesc = desc;
				job.crtdate_desc = IG$/*mainapp*/._I40/*formatDate*/(job.crtdate);
				job.uptdate_desc = IG$/*mainapp*/._I40/*formatDate*/(job.uptdate);
				jobs.push(job);
			}
		}
		
		disp_job.setVisible(false);
		grddetail.setVisible(true);
		
		grddetail.store.loadData(jobs);
	},
	
	lr/*registerJob*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "22",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({action: "programs"}, "action"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
	        }, panel, function(xdoc) {
	        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
	        		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
	        		i, j, k, programs = [], v, 
	        		p, pnode, pnodes, snodes;
	        	
	        	if (tnodes && tnodes.length)
	        	{
	        		for (i=0; i < tnodes.length; i++)
	        		{
	        			p = {
	        				name: IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name"),
	        				java_class: IG$/*mainapp*/._I1a/*getSubNodeText*/(tnodes[i], "java_class"),
	        				input_items: []
	        			};
	        			
	        			pnode = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "input_items");
	        			
	        			if (pnode)
	        			{
	        				pnodes = IG$/*mainapp*/._I26/*getChildNodes*/(pnode);
	        				
	        				for (j=0; j < pnodes.length; j++)
	        				{
	        					v = {};
	        					snodes = IG$/*mainapp*/._I26/*getChildNodes*/(pnodes[j]);
	        					
	        					for (k=0; k < snodes.length; k++)
	        					{
	        						v[IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[k], "name")] = IG$/*mainapp*/._I24/*getTextContent*/(snodes[k]);
	        					}
	        					p.input_items.push(v);
	        				}
	        			}
	        			
	        			programs.push(p);
	        		}
	        		
	        		var dlg = new IG$/*mainapp*/.s$mr/*register_schedule*/({
						sid: null,
						uid: null,
						callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.l1/*getServerStatus*/),
						req: null,
						programs: programs
					});
					IG$/*mainapp*/._I_5/*checkLogin*/(panel, dlg);
	        	}
	        });
	    req._l/*request*/();
	},
	
	initComponent: function() {
		var me = this;
		
		me.items = [
			{
				xtype: "fieldset",
				title: "Schedule Server Status",
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
								xtype: "displayfield",
								name: "txtstatus",
								value: "Server status checking...",
								flex: 1
							},
							{
								xtype: "button",
								text: "Refresh",
								handler: function() {
									this.l1/*getServerStatus*/();
								},
								scope: this
							},
							{
								xtype: "button",
								text: "Register Schedule",
								handler: function() {
									this.lr/*registerJob*/();
								},
								scope: this
							}
						]
					}
				]
			},
			{
				xtype: "gridpanel",
				flex: 1,
				name: "grdjoblist",
				store: {
					xtype: "store",
					fields: [
						"sid", "userid", "uuid", "uuname", "objuid", "objname", "objtype", 
						"name", "crtdate", "uptdate", "crtdate_desc", "uptdate_desc", "pstatus", 
						"pstatus_desc", "sctype", "scoption", "a_1", "a_1a", "a_1b", "a_1c", "sc",
						"pickdate_desc", "enddate_desc", "heartbeat_desc"
					]
				},
				columns: [
					{
						text: "Nickname",
						flex: 1,
						dataIndex: "name"
					},
					{
						text: "Object name / Class",
						flex: 1,
						dataIndex: "objname"
					},
					{
						text: "Owner",
						dataIndex: "uuname"
					},
					{
						text: "Status",
						dataIndex: "pstatus_desc"
					},
					{
						text: "Schedule",
						dataIndex: "sc"
					},
					{
						text: "Pickup Time",
						dataIndex: "pickdate_desc"
					},
					{
						text: "End Time",
						dataIndex: "enddate_desc"
					},
					{
						text: "Heartbeat",
						dataIndex: "heartbeat"
					},
					{
						text: "Created date",
						dataIndex: "crtdate_desc"
					},
					{
						text: "Modified date",
						dataIndex: "uptdate_desc"
					}
				],
				listeners: {
					itemclick: function(tobj, record, item, index, e, eopts) {
						this.l3/*getJobDetail*/(record.get("sid"));
					},
					scope: this
				}
			},
			{
				xtype: "fieldset",
				title: "Detailed Status",
				name: "detailpanel",
				flex: 1,
				layout: {
					type: "vbox",
					align: "stretch"
				},
				collapsed: false,
				defaults: {
					anchor: "100%"
				},
				items: [
					{
						xtype: "displayfield",
						name: "disp_job",
						hidden: false,
						value: "Click Schedule for detailed job status"
					},
					{
						xtype: "gridpanel",
						name: "grddetail",
						flex: 1,
						hidden: true,
						store: {
							xtype: "store",
							fields: [
								"sid", "jid", "crtdate", "crtdate_desc", "uptdate", "uptdate_desc", "pstatus", "pstatusdesc"
							]
						},
						columns: [
							{
								xtype: "gridcolumn",
								text: "Updated date",
								dataIndex: "uptdate_desc",
								flex: 1
							},
							{
								xtype: "gridcolumn",
								text: "Started date",
								dataIndex: "crtdate_desc",
								flex: 1
							},
							{
								xtype: "gridcolumn",
								text: "Status",
								dataIndex: "pstatusdesc"
							}
						]
					}
				]
			}
		];
		
		IG$/*mainapp*/._I7c/*scheduler*/.superclass.initComponent.call(this);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj._IFd/*init_f*/();
		}
	}
});

IG$/*mainapp*/.s$mr/*register_schedule*/ = $s.extend($s.window, {
	
	modal: true,
	region:'center',
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 480,
	height: 420,
	autoHeight: false,
	
	parentnodepath: null,
	itemtype: null,
	parentuid: null,
	
	callback: null,
	
	_IFd/*init_f*/: function() {
		var me = this;
		
		me.down("[name=c2_rp]").setValue("M");
		me.down("[name=c2_r1]").setValue("");
		
		if (me.sid)
		{
			me.l1/*loadSID*/();
		}
	},
	
	
	$f3/*processMakeMetaItem*/: function() {
		var me = this,
			mform = me.down("[name=mform]"),
			sctype = me.down("[name=sctype]"),
			sctypeval,
			f_dw = me.down("[name=f_dw]"),
			f_dw_c = f_dw.checkboxCmp,
			fs_dm = me.down("[name=fs_dm]"),
			fs_dm_c = fs_dm.checkboxCmp,
			fs_m = me.down("[name=fs_m]"),
			scp = me.down("[name=scp]"),
			fs_m_c = fs_m.checkboxCmp,
			pload, i, prog, params;
			
		if (mform.getForm().isValid() == true)
		{
			sctype.clearInvalid();
			if (!sctype.getValue())
			{
				sctype.markInvalid();
				return;
			}
			
			scp.clearInvalid();
			
			if (me.programs && !scp.getValue())
			{
				scp.markInvalid();
				return;
			}
			
			if (me.programs && !me.req)
			{
				for (i=0; i < me.programs.length; i++)
				{
					if (me.programs[i].java_class == scp.getValue())
					{
						prog = me.programs[i];
						break;
					}
				}
                
                params = [];
                
                for (i=0; i < prog.input_items.length; i++)
                {
                    if (prog.input_items[i].name)
                    {
                        params.push({
                            name: prog.input_items[i].name,
                            value: prog.input_items[i].__dw.getValue()
                        });
                    }
                }
				 
				me.req = [
					{
						ack: 22,
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({action: "exec_program"}, "action"),
			            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({name: prog.name, java_class: prog.java_class}, null, params)
					}
				]
			}
			
			sctypeval = sctype.getValue();
			var panel = this,
				opt = {sid: me.sid, sctype: sctypeval, action: "register", rid: me.uid, pstatus: me.down("[name=pstatus]").getValue()},
				cnt,
				sreq = me.req,
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
			opt.name = me.down("[name=scname]").getValue();
			opt.a_1 = me.down("[name=a_1]").getValue() ? "T" : "F";
			opt.a_1a = me.down("[name=a_1a]").getValue();
			opt.a_1b = me.down("[name=a_1b]").getValue();
			opt.a_1c = me.down("[name=a_1c]").getValue();
			
			if (sctypeval == "C1")
			{
				opt.hour = me.down("[name=c1_hh]").getValue();
				opt.minute = me.down("[name=c1_mm]").getValue();
				opt.seconds = me.down("[name=c1_ss]").getValue();
			}
			else if (sctypeval == "C2")
			{
				opt.c2_from = IG$/*mainapp*/._I41/*dateFormat*/(me.down("[name=c2_from]").getValue(), "yyyymmdd");
				opt.c2_to = IG$/*mainapp*/._I41/*dateFormat*/(me.down("[name=c2_to]").getValue(), "yyyymmdd");
				opt.c2_hh = me.down("[name=c2_hh]").getValue();
				opt.c2_mm = me.down("[name=c2_mm]").getValue();
				opt.c2_ss = me.down("[name=c2_ss]").getValue();
				opt.c2_r1 = me.down("[name=c2_r1]").getValue() == "R" ? "T" : "F";
				opt.c2_ri = "" + me.down("[name=c2_ri]").getValue();
				opt.c2_rp = me.down("[name=c2_rp]").getValue();
				opt.c2_pt1 = me.g1/*getTime*/(1);
				opt.c2_pt2 = me.g1/*getTime*/(2);
				if (f_dw_c.getValue())
				{
					opt.wd = [];
					
					$.each(["SU", "MO", "TU", "WE", "TH", "FR", "SA"], function(k, m) {
						var p = f_dw.down("[name=c_" + m + "]");
						if (p.getValue())
						{
							opt.wd.push(m);
						}
					});
					
					opt.wd = opt.wd.join(";");
				}
				
				if (fs_dm_c.getValue())
				{
					opt.dm = [];
					for (i=0; i < 31; i++)
					{
						var p = fs_dm.down("[name=f_" + (i) + "]");
						if (p.getValue())
						{
							opt.dm.push("" + i);
						}
					}
					
					if (fs_dm.down("[name=f_lday]").getValue())
					{
						opt.dm.push("lday");
					}
					opt.dm = opt.dm.join(";");
				}
				
				if (fs_m_c.getValue())
				{
					opt.mon = [];
					for (i=0; i < 12; i++)
					{
						var p = fs_m.down("[name=m_" + (i) + "]");
						if (p.getValue())
						{
							opt.mon.push("" + i);
						}
					}
					opt.mon = opt.mon.join(";");
				}
			}
			else if (sctypeval == "C3")
			{
				opt.hour = me.down("[name=c3_hh]").getValue();
				opt.minute = me.down("[name=c3_mm]").getValue();
			}
			
			cnt = "<smsg>";
			
			for (i=0; i < sreq.length; i++)
			{
				cnt += "<job key='" + (sreq[i].jobkey || i) + "'>";
				cnt += "<ack>" + sreq[i].ack + "</ack>";
				cnt += "<mbody><![CDATA[" + Base64.encode(sreq[i].mbody) + "]]></mbody>";
				cnt += "<payload>" + (sreq[i].payload ? "<![CDATA[" + Base64.encode(sreq[i].payload) + "]]>" : "") + "</payload>";
				cnt += "</job>";
			}
			
			cnt += "</smsg>";
			
			pload = "<smsg><item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(opt, "sid;action;sctype;rid;hour;minute;seconds;name;c2_from;c2_to;c2_hh;c2_mm;c2_ss;wd;dm;mon;a_1;a_1a;pstatus;c2_r1;c2_ri;c2_rp;c2_pt1;c2_pt2")
				+ ">"
				+ "<mailcc><![CDATA[" + (opt.a_1b || "") + "]]></mailcc>"
				+ "<message><![CDATA[" + (opt.a_1c || "") + "]]></message>"
				+ "</item></smsg>";
			
			req.init(panel, 
				{
	                ack: "22",
	                payload: pload,
	                mbody: cnt
	            }, panel, panel._IO5/*rs_processMakeMetaItem*/, null);
	        req._l/*request*/();
		}
	},
	
	g1/*getTime*/: function(p) {
		var me = this,
			r = "",
			t;
		
		$.each(["h", "m", "s"], function(i, k) {
			var ctrl = me.down("[name=c2_r" + k + p + "]"),
				mv = ctrl.getValue();
			r += (i > 0 ? ":" : "") + (mv < 10 ? "0" : "") + mv;
		});
		
		return r;
	},
	
	_IO5/*rs_processMakeMetaItem*/: function(xdoc) {
		this.callback && this.callback.execute();

		this.close();
	},
	
	l1/*loadSID*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(panel, 
			{
                ack: "22",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, sid: this.sid, action: "getinfo"}, "uid;sid;action"),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
            }, panel, panel.rs_l1/*loadSID*/, null);
        req._l/*request*/();
	},
	
	rs_l1/*loadSID*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/schedule"),
			pval,
			scoption,
			sctime,
			stemp,
			fcomp, fcomp_ch;

		if (tnode)
		{
			pval = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			me.down("[name=scname]").setValue(pval.name);
			me.down("[name=sctype]").setValue(pval.sctype);
			me.down("[name=pstatus]").setValue(pval.pstatus);
			me.down("[name=a_1]").setValue(pval.a_1 == "T");
			me.down("[name=a_1a]").setValue(pval.a_1a || "");
			me.down("[name=a_1b]").setValue(IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "mailcc"));
			me.down("[name=a_1c]").setValue(IG$/*mainapp*/._I1a/*getSubNodeText*/(tnode, "message"));
			scoption = pval.scoption || "";
			
			if (pval.sctype == "C1")
			{
				scoption = scoption.split(":");
				scoption[0] && me.down("[name=c1_hh]").setValue(Number(scoption[0]));
				scoption[1] && me.down("[name=c1_mm]").setValue(Number(scoption[1]));
				scoption[2] && me.down("[name=c1_ss]").setValue(Number(scoption[2]));
			}
			else if (pval.sctype == "C2")
			{
				scoption = scoption.split("|");
				var pdate = function(value) {
					var n = IG$/*mainapp*/._I0a_/*getDateParse*/(value),
						dt;
					
					if (n.y && n.M && n.d)
					{
						dt = new Date(Number(n.y), Number(n.M)-1, Number(n.d));
					}
					return dt;
				}
				
				sctime = scoption[2] || "";
				sctime = sctime.split(":");
				scoption[0] && me.down("[name=c2_from]").setValue(pdate(scoption[0]));
				scoption[1] && me.down("[name=c2_to]").setValue(pdate(scoption[1]));
				sctime[0] && me.down("[name=c2_hh]").setValue(sctime[0]);
				sctime[1] && me.down("[name=c2_mm]").setValue(sctime[1]);
				sctime[2] && me.down("[name=c2_ss]").setValue(sctime[2]);
				
				// scoption[5] && me.down("[name=c2_ss]").setValue(scoption[4]);
				
				if (scoption[3])
				{
					stemp = ";" + scoption[3] + ";";
					
					fcomp = me.down("[name=f_dw]");
					fcomp_ch = fcomp.checkboxCmp;
					
					fcomp_ch.setValue(true);
					
					$.each(["SU", "MO", "TU", "WE", "TH", "FR", "SA"], function(k, m) {
						var p = fcomp.down("[name=c_" + m + "]");
						if (stemp.indexOf(";" + m + ";") > -1)
						{
							p.setValue(true);
						}
					});
				}
				
				if (scoption[4])
				{
					stemp = ";" + scoption[4] + ";";
					
					fcomp = me.down("[name=fs_dm]");
					fcomp_ch = fcomp.checkboxCmp;
					
					fcomp_ch.setValue(true);
					
					for (i=0; i < 31; i++)
					{
						var p = fcomp.down("[name=f_" + (i) + "]");
						if (stemp.indexOf(";" + i + ";") > -1)
						{
							p.setValue(true);
						}
					}
					
					if (stemp.indexOf(";lday;") > -1)
					{
						fcomp.down("[name=f_lday]").setValue(true);
					}
				}
				
				if (scoption[5])
				{
					stemp = ";" + scoption[4] + ";";
					
					fcomp = me.down("[name=fs_m]");
					fcomp_ch = fcomp.checkboxCmp;
					
					fcomp_ch.setValue(true);
					
					for (i=0; i < 12; i++)
					{
						var p = fcomp.down("[name=m_" + (i) + "]");
						if (stemp.indexOf(";" + i + ";") > -1)
						{
							p.setValue(true);
						}
					}
				}
				
				scoption[6] && me.down("[name=c2_r1]").setValue(scoption[6] == "T" ? "R" : "");
				scoption[7] && me.down("[name=c2_ri]").setValue(scoption[7]);
				scoption[8] && me.down("[name=c2_rp]").setValue(scoption[8]);
				
				if (scoption[9])
				{
					stemp = scoption[9].split(":");
					if (stemp.length == 3)
					{
						me.down("[name=c2_rh1]").setValue(parseInt(stemp[0]));
						me.down("[name=c2_rm1]").setValue(parseInt(stemp[1]));
						me.down("[name=c2_rs1]").setValue(parseInt(stemp[2]));
					}
				}
				
				if (scoption[10])
				{
					stemp = scoption[10].split(":");
					if (stemp.length == 3)
					{
						me.down("[name=c2_rh2]").setValue(parseInt(stemp[0]));
						me.down("[name=c2_rm2]").setValue(parseInt(stemp[1]));
						me.down("[name=c2_rs2]").setValue(parseInt(stemp[2]));
					}
				}
			}
			else if (pval.sctype == "C3")
			{
				scoption = scoption.split(":");
				scoption[0] && me.down("[name=c3_hh]").setValue(Number(scoption[0]));
				scoption[1] && me.down("[name=c3_mm]").setValue(Number(scoption[1]));
			}
		}
	},
    
    _update_parmas: function(nvalue) {
        var me = this,
            programs = me.programs,
            i,
            program,
            _params = me.down("[name=_params]");
            
        // clear params section
        
        _params.removeAll();
            
        for (i=0; i < programs.length; i++)
        {
            if (programs[i].java_class == nvalue)
            {
                program = programs[i];
                break;
            }
        }
        
        if (program && program.input_items)
        {
            // append params section
        	_params.setVisible(true);
            $.each(program.input_items, function(k, item) {
                var ctrl = {};
                
                switch (item.type)
                {
                case "integer":
                    ctrl.xtype = "numberfield";
                    break;
                case "string":
                    ctrl.xtype = "textfield";
                    break;
                case "text":
                    ctrl.xtype = "textarea";
                    break;
                case "boolean":
                    ctrl.xtype = "checkbox";
                    break;
                }
                
                ctrl.fieldLabel = item.label;
                ctrl.name = item.name;
                
                item.__dw = _params.add(ctrl);
            });
        }
        else
        {
        	_params.setVisible(false);
        }
    },
	
	initComponent : function() {
		var me = this,
			cdate = new Date(),
			tdate = new Date(),
			i,
			f_dm = [],
			f_m = [],
			dscp = [];
			
		me.title = IRm$/*resources*/.r1('L_REG_SCH');
		
		tdate.setDate(tdate.getDate() + 7);
		
		for (i=0; i < 31; i++)
		{
			f_dm.push({
				xtype: "checkbox",
				boxLabel: "" + (i+1) + "",
				name: "f_" + i
			});
		}
		
		f_dm.push({
			xtype: "checkbox",
			name: "f_lday",
			boxLabel: "Last day"
		});
		
		for (i=0; i < 12; i++)
		{
			f_m.push({
				xtype: "checkbox",
				boxLabel: "" + (i+1),
				name: "m_" + i
			});
		}
		
		if (me.programs && me.programs.length)
		{
			for (i=0; i < me.programs.length; i++)
			{
				dscp.push({name: me.programs[i].name, value: me.programs[i].java_class});
			}
		}
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				{
					xtype: "form",
					name: "mform",
					layout: "anchor",
					autoScroll: true,
					defaults: {
						anchor: "100%"
					},
					items: [
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1("L_GENERAL_OPTION"),
							layout: "anchor",
							items: [
								{
									xtype: "combobox",
									fieldLabel: "Job type",
									name: "scp",
									store: {
										fields: ["name", "value"],
										data: dscp
									},
									queryMode: "local",
									eidtable: false,
									valueField: "value",
									labelField: "name",
									displayField: "name",
									hidden: me.programs ? false : true,
									emptyText: IRm$/*resources*/.r1("B_REQ"),
                                    listeners: {
                                        change: function(tobj, newValue, oldValue, eopts) {
                                            this._update_parmas(newValue);
                                        },
                                        scope: this
                                    }
								},
								{
									xtype: "textfield",
									fieldLabel: "Job name",
									name: "scname",
									allowBlank: false,
									emptyText: IRm$/*resources*/.r1("B_REQ")
								},
								{
									xtype: "combobox",
									fieldLabel: IRm$/*resources*/.r1("L_JB_STAT"),
									name: "pstatus",
									hidden: (this.sid ? false : true),
									editable: false,
									queryMode: "local",
									store: {
										xtype: "store",
										fields: ["name", "value"],
										data: [
											{name: IRm$/*resources*/.r1("B_ACTIVE"), value: "A", selected: true},
											{name: IRm$/*resources*/.r1("B_INACTIVE"), value: "N"}
										]
									},
									valueField: "value",
									labelField: "name",
									displayField: "name"
								}
							]
						},
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1("L_SC_ACTION"),
							layout: "anchor",
							items: [
								{
									xtype: "checkbox",
									fieldLabel: IRm$/*resources*/.r1("L_NOTI_EMAIL"),
									name: "a_1",
									boxLabel: IRm$/*resources*/.r1("B_ENABLED"),
									listeners: {
										change: function(cobj) {
											var me = this,
												c = cobj.getValue(),
												f_opt_em = me.down("[name=f_opt_em]");
												
											f_opt_em.setVisible(c);
										},
										scope: this
									}
								},
								{
									xtype: "fieldcontainer",
									layout: "anchor",
									name: "f_opt_em",
									hidden: true,
									items: [
										{
											xtype: "combobox",
											fieldLabel: IRm$/*resources*/.r1("L_OUTP_TYPE"),
											name: "a_1a",
											editable: false,
											queryMode: "local",
											store: {
												xtype: "store",
												fields: ["name", "value"],
												data: [
													{name: "Select", value: ""},
													{name: "HTML Link", value: "link"},
													{name: "CSV Data", value: "csv"},
													{name: "Excel File", value: "excel"}
												]
											},
											valueField: "value",
											displayField: "name",
											value: ""
										},
										{
											xtype: "textarea",
											name: "a_1b",
											anchor: "100%",
											fieldLabel: IRm$/*resources*/.r1("L_MAIL_CC")
										},
										{
											xtype: "textarea",
											name: "a_1c",
											anchor: "100%",
											fieldLabel: IRm$/*resources*/.r1("L_MAIL_BD")
										}
									]
								}
							]
						},
                        {
                            xtype: "fieldset",
                            name: "_params",
                            title: IRm$/*resources*/.r1("B_PARAMTERS"),
                            layout: "anchor",
                            items: [],
                            hidden: true
                        },
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1("B_SCHEDULE"),
							layout: "anchor",
							items: [
								{
									xtype: "combobox",
									name: "sctype",
									editable: false,
									queryMode: "local",
									allowBlank: false,
									emptyText: IRm$/*resources*/.r1("B_REQ"),
									fieldLabel: IRm$/*resources*/.r1("L_SC_CT"),
									store: {
										xtype: "store",
										fields: ["name", "value"],
										data: [
											{name: "Select One", value: "", selected: true},
											{name: IRm$/*resources*/.r1("L_SC_C1"), value: "C1"},
											{name: IRm$/*resources*/.r1("L_SC_C3"), value: "C3"},
											{name: IRm$/*resources*/.r1("L_SC_C2"), value: "C2"}
										]
									},
									valueField: "value",
									displayField: "name",
									value: "",
									listeners: {
										change: function(tobj, newValue, oldValue, eopts) {
											var me = this,
												f_runafter = me.down("[name=f_runafter]"),
												f_cron = me.down("[name=f_cron]"),
												f_runat = me.down("[name=f_runat]"),
												c2_r1 = me.down("[name=c2_r1]");
											
											f_runafter.setVisible(newValue == "C1");
											f_cron.setVisible(newValue == "C2");
											f_runat.setVisible(newValue == "C3");
											c2_r1.setVisible(newValue == "C2");
										},
										scope: this
									}
								},
								{
									xtype: "combobox",
									fieldLabel: IRm$/*resources*/.r1("L_SCC_TYPE"),
									name: "c2_r1",
									editable: false,
									queryMode: "local",
									valueField: "value",
									labelField: "name",
									displayField: "name",
									hidden: true,
									store: {
										xtype: "store",
										fields: ["name", "value"],
										data: [
											{name: IRm$/*resources*/.r1("L_SCC_DATE"), value: ""},
											{name: IRm$/*resources*/.r1("L_SCC_REC"), value: "R"}
										]
									},
									listeners: {
										change: function(tobj) {
											var me = this,
												v = tobj.getValue() == "R",
												p_r1 = me.down("[name=p_r1]"),
												p_r2 = me.down("[name=p_r2]");
												
											p_r1.setVisible(!v);
											p_r2.setVisible(v);
										},
										scope: this
									}
								}
							]
						},
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1("L_SC_C1"),
							hidden: true,
							name: "f_runafter",
							layout: "anchor",
							items: [
								{
									xtype: "numberfield",
									name: "c1_hh",
									minValue: 0,
									maxValue: 24,
									fieldLabel: IRm$/*resources*/.r1("B_HOUR"),
									value: 0
								},
								{
									xtype: "numberfield",
									name: "c1_mm",
									minValue: 0,
									maxValue: 59,
									fieldLabel: IRm$/*resources*/.r1("B_MINUTE"),
									value: 20
								},
								{
									xtype: "numberfield",
									name: "c1_ss",
									minValue: 0,
									maxValue: 59,
									fieldLabel: IRm$/*resources*/.r1("B_SECOND"),
									value: 0
								}
							]
						},
						{
							xtype: "fieldset",
							title: IRm$/*resources*/.r1("L_SC_C3"),
							hidden: true,
							name: "f_runat",
							layout: "anchor",
							items: [
								{
									xtype: "numberfield",
									name: "c3_hh",
									minValue: 0,
									maxValue: 24,
									fieldLabel: IRm$/*resources*/.r1("B_HOUR"),
									value: 0
								},
								{
									xtype: "numberfield",
									name: "c3_mm",
									minValue: 0,
									maxValue: 59,
									fieldLabel: IRm$/*resources*/.r1("B_MINUTE"),
									value: 10
								}
							]
						},
						
						{
							xtype: "fieldcontainer",
							layout: {
								type: "vbox",
								align: "stretch"
							},
							hidden: true,
							name: "f_cron",
							items: [
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_SCC_REC"),
									name: "p_r2",
									hidden: true,
									layout: "anchor",
									items: [
										{
											xtype: "fieldcontainer",
											fieldLabel: IRm$/*resources*/.r1("B_EVERY"),
											layout: "hbox",
											items: [
												{
													xtype: "numberfield",
													name: "c2_ri",
													minValue: 1,
													maxValue: 59,
													value: 5,
													width: 130
												},
												{
													xtype: "combobox",
													name: "c2_rp",
													editable: false,
													queryMode: "local",
													width: 120,
													emptyText: IRm$/*resources*/.r1("B_REQ"),
													store: {
														xtype: "store",
														fields: ["name", "value"],
														data: [
															{name: IRm$/*resources*/.r1("B_MINUTE"), value: "M"},
															{name: IRm$/*resources*/.r1("B_HOUR"), value: "H"}
														]
													},
													valueField: "value",
													displayField: "name"
												},
												{
													xtype: "container",
													flex: 1
												}
											]
										},
										{
											xtype: "fieldcontainer",
											fieldLabel: IRm$/*resources*/.r1("B_T_FR"),
											layout: {
												type: "hbox",
												align: "stretch"
											},
											items: [
												{
													xtype: "container",
													width: 40
												},
												{
													xtype: "container",
													flex: 1,
													layout: {
														type: "vbox",
														align: "stretch"
													},
													defaults: {
														labelWidth: 80
													},
													items: [
														{
															xtype: "numberfield",
															name: "c2_rh1",
															minValue: 0,
															maxValue: 23,
															value: 0,
															fieldLabel: IRm$/*resources*/.r1("B_HOUR")
														},
														{
															xtype: "numberfield",
															name: "c2_rm1",
															minValue: 0,
															maxValue: 59,
															value: 0,
															fieldLabel: IRm$/*resources*/.r1("B_MINUTE")
														},
														{
															xtype: "numberfield",
															name: "c2_rs1",
															hidden: true,
															minValue: 0,
															maxValue: 59,
															value: 0
														}
													]
												}
											]
										},
										{
											xtype: "fieldcontainer",
											fieldLabel: IRm$/*resources*/.r1("B_T_TO"),
											layout: {
												type: "hbox",
												align: "stretch"
											},
											items: [
												{
													xtype: "container",
													width: 40
												},
												{
													xtype: "container",
													flex: 1,
													layout: {
														type: "vbox",
														align: "stretch"
													},
													defaults: {
														labelWidth: 80
													},
													items: [
														{
															xtype: "numberfield",
															name: "c2_rh2",
															minValue: 0,
															maxValue: 23,
															value: 23,
															fieldLabel: IRm$/*resources*/.r1("B_HOUR")
														},
														{
															xtype: "numberfield",
															name: "c2_rm2",
															minValue: 0,
															maxValue: 59,
															value: 59,
															fieldLabel: IRm$/*resources*/.r1("B_MINUTE")
														},
														{
															xtype: "numberfield",
															name: "c2_rs2",
															minValue: 0,
															maxValue: 59,
															value: 59,
															hidden: true
														}
													]
												}
											]
										}
									]
								},
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_SCC_DATE"),
									name: "p_r1",
									layout: "anchor",
									items: [
										{
											xtype: "numberfield",
											fieldLabel: IRm$/*resources*/.r1("B_HOUR"),
											name: "c2_hh",
											minValue: 0,
											maxValue: 23,
											value: 23
										},
										{
											xtype: "numberfield",
											fieldLabel: IRm$/*resources*/.r1("B_MINUTE"),
											name: "c2_mm",
											minValue: 0,
											maxValue: 59,
											value: 0
										},
										{
											xtype: "numberfield",
											fieldLabel: IRm$/*resources*/.r1("B_SECOND"),
											name: "c2_ss",
											minValue: 0,
											maxValue: 59,
											value: 0
										}
									]
								},
								{
									xtype: "fieldset",
									title: IRm$/*resources*/.r1("L_SC_PR"),
									name: "f_period",
									layout: "anchor",
									items: [
										{
											xtype: "datefield",
											fieldLabel: IRm$/*resources*/.r1("B_DT_FR"),
											name: "c2_from",
											format: "Y-m-d",
											value: cdate
										},
										{
											xtype: "datefield",
											fieldLabel: IRm$/*resources*/.r1("B_DT_TO"),
											name: "c2_to",
											format: "Y-m-d",
											value: tdate
										}
									]
								},
								{
									xtype: "fieldset",
									title: "Day of Week",
									name: "f_dw",
									checkboxToggle: true,
									collapsed: true,
									layout: {
										type: "vbox",
										align: "stretch"
									},
									items: [
										{
											xtype: "checkbox",
											boxLabel: "Sunday",
											name: "c_SU"
										},
										{
											xtype: "checkbox",
											boxLabel: "Monday",
											name: "c_MO"
										},
										{
											xtype: "checkbox",
											boxLabel: "Tuesday",
											name: "c_TU"
										},
										{
											xtype: "checkbox",
											boxLabel: "Wednesday",
											name: "c_WE"
										},
										{
											xtype: "checkbox",
											boxLabel: "Thursday",
											name: "c_TH"
										},
										{
											xtype: "checkbox",
											boxLabel: "Friday",
											name: "c_FR"
										},
										{
											xtype: "checkbox",
											boxLabel: "Saturday",
											name: "c_SA"
										}
									]
								},
								{
									xtype: "fieldset",
									title: "Day of Month",
									name: "fs_dm",
									checkboxName: "fs_dm_c",
									checkboxToggle: true,
									collapsed: true,
									items: f_dm
								},
								{
									xtype: "fieldset",
									title: "Month",
									name: "fs_m",
									checkboxName: "fs_m_c",
									checkboxToggle: true,
									collapsed: true,
									layout: "anchor",
									items: f_m
								},
								{
									xtype: "fieldset",
									title: "Yearly",
									name: "f_y",
									checkboxName: "f_y_c",
									checkboxToggle: true,
									collapsed: true,
									layout: {
										type: "vbox",
										align: "stretch"
									},
									
									items: [
										{
											xtype: "textfield"
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
			],
			listeners: {
				afterrender: function(ui) {
					var me = this;
					me._IFd/*init_f*/();
				}
			}
		});
		
		IG$/*mainapp*/.s$mr/*register_schedule*/.superclass.initComponent.apply(this, arguments);
	}
	
});


/********************* schedule list ***************************/
IG$/*mainapp*/.s$ml/*schedule_list*/ = $s.extend($s.window, {
	
	modal: false,
	region:'center',
	"layout": "fit",
	closable: false,
	resizable:false,
	width: 650,
	height: 520,
	autoHeight: false,
	
	parentnodepath: null,
	itemtype: null,
	parentuid: null,
	
	callback: null,
	
	_IFd/*init_f*/: function() {
		var me = this;
		
		if (me._ILa/*reportoption*/)
		{
			me.down("[name=b_sc_load]").setValue(me._ILa/*reportoption*/.b_sc_load == "T");
		}
		
		me.l1/*getHistory*/();
	},
	
	l1/*getHistory*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(panel, 
			{
                ack: "22",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, action: "list"}, "uid;action"),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
            }, panel, panel.rs_l1/*getHistory*/, null);
        req._l/*request*/();
	},
	
	rs_l1/*getHistory*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes, i, scs = [], sc,
			scgrid = me.down("[name=scgrid]");
		
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tnodes.length; i++)
			{
				sc = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				switch (sc.pstatus)
				{
				case "A":
					sc.pstatusdesc = "Active";
					break;
				case "N":
					sc.pstatusdesc = "Inactive";
					break;
				default:
					sc.pstatusdesc = "N/A";
					break;
				}
				
				sc.uptdate_desc = IG$/*mainapp*/._I40/*formatDate*/(sc.uptdate);
				sc.crtdate_desc = IG$/*mainapp*/._I40/*formatDate*/(sc.crtdate);
				scs.push(sc);
			}
		}
		
		scgrid.store.loadData(scs);
	},
	
	l2/*loadScheduleJob*/: function(sid) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(panel, 
			{
                ack: "22",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, sid: sid, action: "joblist"}, "uid;sid;action"),
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
            }, panel, panel.rs_l2/*loadScheduleJob*/, null);
        req._l/*request*/();
	},
	
	rs_l2/*loadScheduleJob*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes, i, jobs = [], job,
			jobgrid = me.down("[name=jobgrid]");
		
		if (tnode)
		{
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			for (i=0; i < tnodes.length; i++)
			{
				job = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				switch (job.pstatus)
				{
				case "I":
					job.pstatusdesc = "Running";
					break;
				case "C":
					job.pstatusdesc = "Completed";
					break;
				case "Q":
					job.pstatusdesc = "Queue Waiting";
					break;
				case "X":
					job.pstatusdesc = "Running";
					break;
				case "T":
					job.pstatusdesc = "Cancel Queue";
					break;
				case "M":
					job.pstatusdesc = "Cancelled";
					break;
				default:
					job.pstatusdesc = "N/A";
					break;
				}
				
				job.crtdate_desc = IG$/*mainapp*/._I40/*formatDate*/(job.crtdate);
				job.uptdate_desc = IG$/*mainapp*/._I40/*formatDate*/(job.uptdate);
				jobs.push(job);
			}
		}
		
		jobgrid.store.loadData(jobs);
	},
	
	cf1/*confirmScheduler*/: function() {
		var me = this;
		if (me._ILa/*reportoption*/)
		{
			me._ILa/*reportoption*/.b_sc_load = me.down("[name=b_sc_load]").getValue() ? "T" : "F";
		}
		me.close();
	},
	
	cf3/*openShceuldeResult*/: function(sid, jid) {
		var me = this;
		
		if (me.runner && me.runner._ILd/*doScheduleJob*/) {
			me.runner._ILd/*doScheduleJob*/.call(me.runner, sid, jid);
		}
	},
	
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1('L_LST_SCH');
				
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				{
					xtype: "panel",
					layout: {
						type: "vbox",
						align: "stretch"
					},
					autoScroll: true,
					defaults: {
						anchor: "100%"
					},
					items: [
						{
							xtype: "fieldset",
							layout: {
								type: "vbox",
								align: "stretch"
							},
							height: 160,
							title: "Related Schedules",
							items: [
								{
									xtype: "gridpanel",
									flex: 1,
									name: "scgrid",
									store: {
										xtype: "store",
										fields: [
											"sid", "userid", "objuid", "crtdate", "uptdate", "name", "pstatus", "pstatusdesc",
											"uptdate_desc", "sctype", "scoption", "a_1", "a_1a", "a_1b", "a_1c"
										]
									},
									columns: [
										{
											xtype: "gridcolumn",
											text: "Schedule name",
											dataIndex: "name",
											tdCls: "igc-td-link",
											flex: 1
										},
										{
											xtype: "gridcolumn",
											text: "Status",
											tdCls: "igc-td-link",
											dataIndex: "pstatusdesc",
											width: 50
										},
										{
											xtype: "gridcolumn",
											text: "Updated",
											dataIndex: "uptdate",
											width: 80
										},
										{
											xtype: "actioncolumn",
											width: 60,
											items: [
												{
													// icon: './images/gears.gif',
													iconCls: "icon-grid-config",
													tooltip: IRm$/*resources*/.r1('L_EDIT'),
													handler: function (grid, rowIndex, colIndex) {
														var grd = grid,
															store = grd.store,
															rec = store.getAt(rowIndex);
														var dlg = new IG$/*mainapp*/.s$mr/*register_schedule*/({
															sid: rec.get("sid"),
															uid: this.uid,
															callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.l1/*getHistory*/),
															req: this.req
														});
														IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
													},
													scope: this
											    }
											]
										}
									],
									listeners: {
										cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
											var me = this,
												sid = record.get("sid");
											if (cellIndex == 0)
											{
												var grd = grid,
													store = grd.store,
													rec = store.getAt(rowIndex);
												var dlg = new IG$/*mainapp*/.s$mr/*register_schedule*/({
													sid: rec.get("sid"),
													uid: me.uid,
													callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.l1/*getHistory*/),
													req: me.req
												});
												IG$/*mainapp*/._I_5/*checkLogin*/(me, dlg);
											}
											else if (sid && cellIndex == 1)
											{
												me.l2/*loadScheduleJob*/(sid);
											}
										},
										scope: this
									}
								},
								{
									xtype: "checkbox",
									name: "b_sc_load",
									labelWidth: 200,
									fieldLabel: "Load Schedule on Init",
									boxLabel: IRm$/*resources*/.r1("B_ENABLE")
								}
							]
						},
						{
							xtype: "fieldset",
							layout: "fit",
							height: 240,
							title: "Job History",
							items: [
								{
									xtype: "gridpanel",
									name: "jobgrid",
									store: {
										xtype: "store",
										fields: [
											"sid", "jid", "crtdate", "uptdate", "pstatus", "executeid",
											"uptdate_desc", "crtdate_desc", "pstatusdesc"
										]
									},
									columns: [
										{
											text: "Updated Date",
											flex: 1,
											tdCls: "igc-td-link",
											dataIndex: "uptdate_desc"
										},
										{
											text: "Started At",
											flex: 1,
											dataIndex: "crtdate_desc"
										},
										{
											text: "Status",
											width: 80,
											dataIndex: "pstatusdesc"
										},
										{
											text: "ExID",
											width: 110,
											dataIndex: "executeid"
										}
									],
									listeners: {
										cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
											var grd = grid,
												store = grd.store,
												rec = store.getAt(rowIndex);
											
											if (cellIndex == 0)
											{
												this.cf3/*openShceuldeResult*/(rec.get("sid"), rec.get("jid"));
											}
										},
										scope: this
									}
								}
							]
						}
					]
				}
			],
			buttons:[
				{
					text: "Register",
					handler: function() {
						var dlg = new IG$/*mainapp*/.s$mr/*register_schedule*/({
							uid: this.uid,
							callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.l1/*getHistory*/),
							req: this.req
						});
						IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
					},
					scope: this
				},
				"->",
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.cf1/*confirmScheduler*/();
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
					this._IFd/*init_f*/();
				}
			}
		});
		
		IG$/*mainapp*/.s$ml/*schedule_list*/.superclass.initComponent.apply(this, arguments);
	}
	
});
IG$/*mainapp*/._Idba/*filterEditorPanel*/ = $s.extend($s.panel, {
	_d6/*itemList*/: [],
	selvalues: null,
	
//	P2C/*itemSelectedHandler*/: function(item) {
//		var me = this,
//			titem = new IG$/*mainapp*/._IE8/*clItems*/();
//		titem._I1d/*CopyObject*/(titem, item);
//		me._d6/*itemList*/ = [titem];
//		me.down("[name=itemname]").setValue(me._d6/*itemList*/[0].name);
//	},
	
	sK3/*validateOperatorLayout*/: function() {
		this.setEditorLayout();
	},
	
	_IFd/*init_f*/: function() {
		var me = this,
			fitem = me.m4/*filteritem*/,
			i,
			rbeditortype = me.down("[name=rbeditortype]"),
			valuetype = me.down("[name=rbvaluetype]"),
			delimiter = me.down("[name=delimiter]"),
			prompttype = me.down("[name=prompttype]"),
			v1, v2, v3;
			
		me.m1/*inpnormal*/ = me.down("[name=cnormalvalue]");
		me.m2/*inplong*/ = me.down("[name=clongvalue]");
		me.m3/*inpsecond*/ = me.down("[name=csecondvalue]");
		me.m4a/*fieldeditortype*/ = me.down("[name=fieldeditortype]");
		
		me._d6/*itemList*/ = [];
		me.formula = "";
		me._d7/*isprompt*/ = false;
		me._d8/*iscustom*/ = false;
		me._d9/*issqlvalue*/ = false;
		me.selvalues = null;
		me.l_item = [];
		
		if (fitem)
		{
			if (me.targetitem)
			{
				fitem._d6/*itemList*/ = [me.targetitem];
			}
			
			if (fitem._d6/*itemList*/ && fitem._d6/*itemList*/.length > 0)
			{
				me.down("[name=itemname]").setValue(fitem._d6/*itemList*/[0].name);
				for (i=0; i < fitem._d6/*itemList*/.length; i++)
				{
					me._d6/*itemList*/.push(fitem._d6/*itemList*/[i]);
				}
			}
			
			if (fitem.l_item && fitem.l_item.length)
			{
				me.down("[name=l_item1]").setValue(fitem.l_item[0].name);
				fitem.l_item.length > 1 && me.down("[name=l_item2]").setValue(fitem.l_item[1].name);
				
				for (i=0; i < fitem.l_item.length; i++)
				{
					me.l_item.push(fitem.l_item[i]);
				}
			}
			
			if (fitem.values && fitem.values.length > 0)
			{
				me.selvalues = [];
				for (i=0; i < fitem.values.length; i++)
				{
					me.selvalues.push(fitem.values[i]);
				}
			}
			
			me.down("[name=cop]").setValue(fitem.operator);
			me.down("[name=opisnot]").setValue(fitem.opisnot);
			
			delimiter.setValue(fitem.delimiter);
			prompttype.setValue(fitem.promptEditor);
			
			var ctrl = null;
			
			if (fitem.valuetype == "field")
			{
				valuetype.setValue("field");
			}
			else if (fitem._d7/*isprompt*/)
			{
				valuetype.setValue("prompt");
			}
			else if (fitem._d9/*issqlvalue*/)
			{
				valuetype.setValue("sql");
			}
			else
			{
				valuetype.setValue("normal");
			}
			
			if (fitem._d8/*iscustom*/)
			{
				rbeditortype.setValue("input");
			}
			else 
			{
				rbeditortype.setValue("list");
			}
			
			//myCheckboxGroup.setValue({
			//    cb1: true,
			//    cb3: false,
			//    cbGroup: ["value1", "value3"]
			//});
			
			me.sK3/*validateOperatorLayout*/();
			
			v1 = me.m1/*inpnormal*/.isVisible();
			v2 = me.m2/*inplong*/.isVisible();
			v3 = me.m3/*inpsecond*/.isVisible();
						
			if (v3)
			{
				me.m4/*filteritem*/.values && me.m4/*filteritem*/.values.length > 1 && me.down("[name=secondvalue]").setValue(this.m4/*filteritem*/.values[1].value || this.m4/*filteritem*/.values[1].code);
				me.m4/*filteritem*/.values && me.m4/*filteritem*/.values.length && me.down("[name=" + (v1 ? "normalvalue" : "longvalue") + "]").setValue(this.m4/*filteritem*/.values[0].value || this.m4/*filteritem*/.values[0].code);
			}
			else
			{
				v1 && me.setFilterDesc(me.down("[name=normalvalue]"));
				v2 && me.setFilterDesc(me.down("[name=longvalue]"));
			}
		}
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			fitem = me.m4/*filteritem*/,
			editortype = me.down("[name=rbeditortype]").getGroupValue(),
			valuetype = me.down("[name=rbvaluetype]").getGroupValue(),
			delimiter = me.down("[name=delimiter]").getValue(),
			prompttype = me.down("[name=prompttype]").getValue(),
			fvalue,
			i;
		
		fitem._d6/*itemList*/ = me._d6/*itemList*/;
		fitem.operator = me.down("[name=cop]").getValue();
		fitem.opisnot = me.down("[name=opisnot]").getValue();
		
		fitem.valuetype = valuetype;
		fitem._d7/*isprompt*/ = (valuetype == "prompt") ? true : false;
		fitem._d9/*issqlvalue*/ = (valuetype == "sql") ? true : false;
		fitem._d8/*iscustom*/ = true;
		fitem.delimiter = delimiter || ";";
		fitem.promptEditor = prompttype;
		fitem.l_item = me.l_item;
		
		if (!fitem._d7/*isprompt*/ && !fitem._d9/*issqlvalue*/)
		{
			if (editortype == "input")
			{
				if (me.m1/*inpnormal*/.isVisible())
				{
					fvalue = me.down("[name=normalvalue]").getValue();
					fitem.values = [{code: fvalue, text: fvalue}];
				}
				else if (me.m2/*inplong*/.isVisible())
				{
					fvalue = me.down("[name=longvalue]").getValue();
					if (fitem.operator == 6)
					{
						fvalue = fvalue.split(delimiter);
						fitem.values = [];
						for (i=0; i < fvalue.length; i++)
						{
							if (fvalue[i] != "")
							{
								fitem.values.push({code: fvalue[i], text: fvalue[i]});
							}
						}
					}
					else
					{
						fitem.values = [{code: fvalue, text: fvalue}];
					}
				}
				
				if (fitem.operator == 8)
				{
					var vto = me.down("[name=secondvalue]").getValue();
					fitem.values.push({code: vto, text: vto});
				}
			}
			else
			{
				fitem._d8/*iscustom*/ = false;
				fitem.values = me.selvalues;
			}
		}
		else
		{
			fvalue = me.down("[name=longvalue]").getValue();
			fitem.values = [{code: fvalue, text: null}];
		}
	},
	
	setEditorLayout: function() {
		var me = this,
			editortype = me.down("[name=rbeditortype]").getGroupValue(),
			fieldeditortype = me.down("[name=fieldeditortype]"),
			valuetype = me.down("[name=rbvaluetype]").getGroupValue(),
			op = me.down("[name=cop]").getValue(),
			btnnormalvalue = me.down("[name=btnnormalvalue]"),
			btnlongvalue = me.down("[name=btnlongvalue]"),
			btnsecondvalue = me.down("[name=btnsecondvalue]"),
			delimiter = me.down("[name=delimiter]"),
			normalvalue = me.down("[name=normalvalue]"),
			longvalue = me.down("[name=longvalue]"),
			secondvalue = me.down("[name=secondvalue]"),
			prompttype = me.down("[name=prompttype]"),
			csfield = me.down("[name=csfield]"),
			cs_f2 = me.down("[name=cs_f2]"),
			
			v1=false, v2=false, v3=false;
		
		if (valuetype == "normal") // normal
		{
			fieldeditortype.show();
			prompttype.hide();
			
			switch (op)
			{
			case 1: // equal
			case 2: // ge
			case 3: // gt
			case 4: // le
			case 5: // lt
				switch (editortype)
				{
				case "list":
				case "input":
					v1 = true;
					break;
				case "textarea":
					v2 = true;
					break;
				case "fileload":
					v1 = true;
					break;
				}
				break;
			case 6: // in
			case 9: // not in
				v2 = true;
				break;
			case 7: // like
				v1 = true;
				break;
			case 8: // between
				v1 = true;
				v3 = true;
				break;
			}
			
			if (editortype == "input")
			{
				btnnormalvalue.hide();
				btnlongvalue.hide();
				btnsecondvalue.hide();
				
				normalvalue.setReadOnly(false);
				longvalue.setReadOnly(false);
				secondvalue.setReadOnly(false);
				
				if (v2)
				{
					delimiter.show();
				}
				else
				{
					delimiter.hide();
				}
			}
			else if (editortype == "list")
			{
				btnnormalvalue.show();
				btnlongvalue.show();
				btnsecondvalue.show();
				
				normalvalue.setReadOnly(true);
				longvalue.setReadOnly(true);
				secondvalue.setReadOnly(true);
				
				delimiter.hide();
			}
			csfield.hide();
		}
		else if (valuetype == "field")
		{
			btnnormalvalue.hide();
			btnlongvalue.hide();
			btnsecondvalue.hide();
				
			delimiter.hide();
			fieldeditortype.hide();
			longvalue.setReadOnly(false);
			csfield.show();
			
			cs_f2.setVisible(op == 8);
			prompttype.hide();
		}
		else
		{
			btnnormalvalue.hide();
			btnlongvalue.hide();
			btnsecondvalue.hide();
				
			delimiter.hide();
			fieldeditortype.hide();
			longvalue.setReadOnly(false);
			
			if (valuetype == "prompt")
			{
				prompttype.show();
			}
			else
			{
				prompttype.hide();
			}
			csfield.hide();
			v2 = true;
		}
		
		(v1) ? me.m1/*inpnormal*/.show() : me.m1/*inpnormal*/.hide();
		(v2) ? me.m2/*inplong*/.show() : me.m2/*inplong*/.hide();
		(v3) ? me.m3/*inpsecond*/.show() : me.m3/*inplong*/.hide();
	},
	
	sK4/*showValueEditor*/: function(inp) {
		if (this._d6/*itemList*/.length > 0)
		{
			var pop = new IG$/*mainapp*/._Iac/*valueSelectWindow*/({
				field: this._d6/*itemList*/[0],
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs_sK4/*showValueEditor*/, inp)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
		}
	},
	
	rs_sK4/*showValueEditor*/: function(sel, inp) {
		var ctrl = this.down("[name=" + inp + "]");
		
		if (sel && sel.length > 0)
		{
			this.selvalues = sel;
		}
		
		this.setFilterDesc(ctrl);
	},
	
	setFilterDesc: function(ctrl) {
		var fitem = this.m4/*filteritem*/,
			r = fitem._d2/*getValueDesc*/(this.selvalues);
			
		ctrl.setValue(r);
	},
	
	_m1/*selectItem*/: function(sname, sobj, secondvalue) {
		var me = this,
			cubeuid,
			rop = me._ILa/*reportoption*/;
			
		cubeuid = me.cubeuid || (rop ? rop.cubeuid : "");
		
		var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
			visibleItems: "workspace;folder;metric;measure;formulameasure;custommetric",
			u5x/*treeOptions*/: {
				cubebrowse: true,
				rootuid: cubeuid
			},
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
				var me = this,
					titem = new IG$/*mainapp*/._IE8/*clItems*/();
				titem._I1d/*CopyObject*/(titem, item);
				if (secondvalue)
				{
					me[(sobj || sname)] = me[(sobj || sname)] || [];
					me[(sobj || sname)].push(titem);
				}
				else
				{
					me[(sobj || sname)] = [titem];
				}
				me.down("[name=" + sname + "]").setValue(titem.name);
			})
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	},
	
	initComponent: function() {
		var operatordp = [],
			me = this;
			
		me.addEvents("add_filter");
			
		$.each(IG$/*mainapp*/._IE1/*filteropcodes*/, function(key, value) {
			if (typeof(value) != "function")
			{
				operatordp.push({field: value[0], label: value[1]});
			}
		});
		
		$s.apply(this, {
			"layout": {
				type: (me._cmode == 1 ? "hbox" : "vbox"),
				align: "stretch"
			},
			
			fieldDefaults: {
    			labelWidth: 150,
    			anchor: "100%"
			},
			
			items: [
				{
					xtype: "fieldset",
					defaultType: "textfield",
					"layout": "anchor",
					defaults: {
						anchor: "100%",
						labelAlign: me._cmode == 1 ? "top" : "left"
					},

					items: [
						{
							xtype: "fieldcontainer",
							fieldLabel: IRm$/*resources*/.r1("L_ITEM"),
							"layout": "hbox",
							items: [
								{
									name: "itemname",
									xtype: "textfield",
									allowBlank: false,
									readOnly: true,
									flex: 1
								},
								{
									xtype: "button",
									text: "..",
									width: 20,
									handler: function() {
										this._m1/*selectItem*/("itemname", "_d6"/*itemList*/);
									},
									scope: this
								}
							]
						},
						{
							xtype: "fieldcontainer",
							layout: "hbox",
							items: [
								{
									fieldLabel: IRm$/*resources*/.r1("L_OPERATOR"),
									name: "cop",
									xtype: "combobox",
									queryMode: "local",
									valueField: "field",
									displayField: "label",
									editable: false,
									store: {
										fields: [
											"field", "label"
										],
										data: operatordp
									},
									listeners: {
										select: function() {
											this.sK3/*validateOperatorLayout*/();
										},
										scope: this
									}
								},
								{
									xtype: "checkbox",
									name: "opisnot",
									padding: "0 5 0",
									boxLabel: IRm$/*resources*/.r1("L_OP_NOT"),
									listeners: {
										change: function(tobj) {
											var me = this,
												cop = me.down("[name=cop]"),
												isnot = tobj.getValue(),
												rec,
												i, k,
												dmap = {},
												opcodes = IG$/*mainapp*/._IE1/*filteropcodes*/,
												copval = cop.getValue();
											
											$.each(opcodes, function(k, val) {
												if (typeof(val) != "function")
												{
													dmap[val[0]] = val[4];
												}
											});
											
											for (i=0; i < cop.store.data.items.length; i++)
											{
												rec = cop.store.data.items[i];
												rec.set("label", IRm$/*resources*/.r1(dmap[rec.get("field")] + (isnot ? "_NOT" : "")));
											}
											
											cop.setValue(copval);
										},
										scope: this
									}
								}
							]
						},
						{
							name: "valuetype",
							xtype: "radiogroup",
							fieldLabel: IRm$/*resources*/.r1("L_VALUE_TYPE"),
							vertical: false,
							defaults: {
								width: 70
							},
							items: [
								{
									boxLabel: "Normal", 
									name: "rbvaluetype", inputValue: "normal", checked: true
								},
								{
									boxLabel: "SQL", 
									name: "rbvaluetype", inputValue: "sql"
								},
								{
									boxLabel: "Column",
									name: "rbvaluetype", inputValue: "field"
								},
								{
									boxLabel: "Prompt", 
									hidden: true,
									name: "rbvaluetype", inputValue: "prompt"
								}
							],
							listeners: {
								change: function(field, newvalue, oldvalue, eOpts) {
									this.sK3/*validateOperatorLayout*/();
								},
								scope: this
							}
						}
					]
				},
				{
					xtype: "panel",
					layout: "anchor",
					border: 0,
					autoScroll: true,
					padding: me._cmode == 1 ? "0 5 0" : 0,
					defaults: {
						labelAlign: me._cmode == 1 ? "top" : "left"
					},
					dockedItems: [
						me._cmode == 1 ? {
							dock: "bottom",
							xtype: "toolbar",
							items: [
								"->",
								{
									xtype: "button",
									text: "Add",
									handler: function() {
										this.fireEvent("add_filter", this);
									},
									scope: this
								}
							]
						} : null
					],
					items: [
						{
							fieldLabel: IRm$/*resources*/.r1("L_EDITOR_TYPE"),
							xtype: "fieldcontainer",
							"layout": "anchor",
							name: "fieldeditortype",
							defaults: {
								flex: 1,
								anchor: "100%",
								hideLabel: true
							},
							items: [
								{
									name: "editortype",
									xtype: "radiogroup",
									vertical: false,
									plain: true,
									items: [
										{
											boxLabel: IRm$/*resources*/.r1("L_E_VALUE"), 
											name: "rbeditortype", inputValue: "input", checked: true
										},
										{
											boxLabel: IRm$/*resources*/.r1("L_E_LIST"), 
											name: "rbeditortype", inputValue: "list"
										}
									],
									listeners: {
										change: function () {
											this.setEditorLayout();
										},
										scope: this
									}
								}
							]
						},
						{
							fieldLabel: IRm$/*resources*/.r1("L_VAL_DELIM"),
							xtype: "textfield",
							name: "delimiter",
							width: 120
						},
						{
							fieldLabel: IRm$/*resources*/.r1("L_PROMPT_TYPE"),
							name: "prompttype",
							xtype: "combobox",
							queryMode: "local",
							valueField: "field",
							displayField: "label",
							editable: false,
							hidden: true,
							store: {
								fields: [
									"field", "label"
								],
								data: [
									{field: 1, label: "Text input"},
									{field: 2, label: "Combobox"},
									{field: 3, label: "Date field"},
									{field: 4, label: "Select window"}
								]
							},
							listeners: {
								select: function() {
									this.sK3/*validateOperatorLayout*/();
								},
								scope: this
							}
						},
						{
							xtype: "fieldcontainer",
							name: "cnormalvalue",
							fieldLabel: IRm$/*resources*/.r1("L_F_VALUE"),
							"layout": "hbox",
							items: [
								{
									name: "normalvalue",
									flex: 1,
									xtype: "textfield"
								},
								{
									xtype: "button",
									name: "btnnormalvalue",
									text: "..",
									width: 20,
									handler: function() {
										this.sK4/*showValueEditor*/("normalvalue");
									},
									scope: this
								}
							]
						},
						
						{
							xtype: "fieldcontainer",
							name: "clongvalue",
							fieldLabel: IRm$/*resources*/.r1("L_F_VALUE_LNG"),
							"layout": "hbox",
							hidden: true,
							items: [
								{
									name: "longvalue",
									flex: 1,
									height: 120,
									xtype: "textarea"
								},
								{
									xtype: "button",
									name: "btnlongvalue",
									text: "..",
									width: 20,
									handler: function() {
										this.sK4/*showValueEditor*/("longvalue");
									},
									scope: this
								}
							]
						},
						
						{
							xtype: "fieldcontainer",
							name: "csecondvalue",
							fieldLabel: IRm$/*resources*/.r1("L_F_VALUE_TO"),
							"layout": "hbox",
							hidden: true,
							items: [
								{
									name: "secondvalue",
									flex: 1,
									xtype: "textfield",
									fieldLabel: "~"
								},
								{
									xtype: "button",
									name: "btnsecondvalue",
									text: "..",
									width: 20,
									handler: function() {
										this.sK4/*showValueEditor*/("secondvalue");
									},
									scope: this
								}
							]
						},
						{
							xtype: "fieldcontainer",
							name: "csfield",
							hidden: true,
							layout: "vbox",
							items: [
								{
									xtype: "fieldcontainer",
									name: "cs_f1",
									fieldLabel: IRm$/*resources*/.r1("L_ITEM"),
									"layout": "hbox",
									items: [
										{
											name: "l_item1",
											xtype: "textfield",
											allowBlank: false,
											readOnly: true,
											flex: 1
										},
										{
											xtype: "button",
											text: "..",
											width: 20,
											handler: function() {
												this._m1/*selectItem*/("l_item1", "l_item");
											},
											scope: this
										}
									]
								},
								{
									xtype: "fieldcontainer",
									name: "cs_f2",
									fieldLabel: IRm$/*resources*/.r1("L_ITEM"),
									"layout": "hbox",
									items: [
										{
											name: "l_item2",
											xtype: "textfield",
											allowBlank: false,
											readOnly: true,
											flex: 1
										},
										{
											xtype: "button",
											text: "..",
											width: 20,
											handler: function() {
												this._m1/*selectItem*/("l_item2", "l_item", 1);
											},
											scope: this
										}
									]
								},
							]
						}
					]
				}
			]
		});
		IG$/*mainapp*/._Idba/*filterEditorPanel*/.superclass.initComponent.apply(this, arguments);
	}
});


	
IG$/*mainapp*/._Idb/*filterEditor*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	"layout": "fit",
	
	closable: false,
	resizable:false,
	width: 500,
	height: 450,
	
	_ILa/*reportoption*/: null,
	
	callback: null,
		
	_IFd/*init_f*/: function() {
		var me = this,
			mainpanel = me._IH1/*mainpanel*/;
		mainpanel._IFd/*init_f*/.call(mainpanel);
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			mainpanel = me._IH1/*mainpanel*/;
			
		mainpanel._IFf/*confirmDialog*/.call(mainpanel);
		
		me.callback && me.callback.execute();
		
		me._IG0/*closeDlgProc*/();
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("T_FILTER");
				 
		$s.apply(this, {
			defaults:{bodyStyle: "padding:10px"},
			
			layout: "fit",
			
			items: [
				new IG$/*mainapp*/._Idba/*filterEditorPanel*/({
					m4/*filteritem*/: me.m4/*filteritem*/,
					name: "mainp",
					bodyStyle: "padding: 10px",
					targetitem: me.targetitem,
					cubeuid: me.cubeuid,
					_ILa/*reportoption*/: me._ILa/*reportoption*/
				})
			],
			buttons:[
//				{
//					text: IRm$/*resources*/.r1("B_HELP"),
//					handler: function() {
//						IG$/*mainapp*/._I63/*showHelp*/("P0010");
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
				afterrender: function() {
					var panel = this;
					
					me._IH1/*mainpanel*/ = panel.down("[name=mainp]");
					
					setTimeout(function() {
						panel._IFd/*init_f*/();
					}, 300);
				}
			}
		});
		
		IG$/*mainapp*/._Idb/*filterEditor*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Iee/*dlgValueSelect*/ = $s.extend($s.panel, {
	field: null,
	
	"layout": {
		type: 'hbox',
		align: 'stretch'
	},
	
	_IFd/*init_f*/: function() {
		// this._1/*getValueList*/();
		this.down("[name=_3]").setValue("START");
	},
	
	_1/*getValueList*/: function() {
		if (this.prompt)
		{
			var callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs__1/*getValueList*/, prompt);
			this.prompt.LD/*loadData*/.call(this.prompt, this, callback);
		}
		else if (this.field)
		{
			var panel = this,
				content = '',
				obj,
				req = new IG$/*mainapp*/._I3e/*requestServer*/(),
				keyword = this.down("[name=_4]").getValue(),
				_3 = this.down("[name=_3]").getValue();
			
			this.field.uid = IG$/*mainapp*/._I06/*formatUID*/(this.field.uid);
			content = "<smsg><info option='valuelist'>";
			
			if (keyword != "")
			{
				content += "<Filter operator='LIKE'>";
				switch (_3)
				{
				case "INCLUDE":
					content += "%" + keyword + "%";
					break;
				case "START":
					content += "" + keyword + "%";
					break;
				case "END":
					content += "%" + keyword + "";
					break;
				}
				
				content += "</Filter>";
			}
			
			obj = IG$/*mainapp*/._I2d/*getItemAddress*/({uid: (this.field ? this.field.uid : this.prompt.name), option: "valuelist"}, "uid;option")
			
			content += "</info></smsg>";
			
			req.init(panel, 
				{
	                ack: "18",
	                payload: obj,
	                mbody: content
	            }, panel, panel.rs__1/*getValueList*/, null, (this.field ? this.field.uid : this.prompt.name) );
	        req._l/*request*/();
		}
	},
	
	rs__1/*getValueList*/: function(xdoc, uid) {
    	var result = new IG$/*mainapp*/._ICd/*clValueList*/(xdoc, uid),
    		vgrid = this.down("[name=_1]");
    		
		vgrid.store.loadData(result.data);
	},
	
	_2/*selectItem*/: function(allvalue) {
		var i,
			vgrid = this.down("[name=_1]"),
			vstore = vgrid.store,
			vitems = vstore.data.items,
			sgrid = this.down("[name=_2]"),
			sstore = sgrid.store,
			sitems = sstore.data.items,
			move, d;
		
		if (allvalue == false)
		{
			var selected = vgrid.selModel.selected.items;
			
			if (selected && selected.length > 0)
			{
				for (i=selected.length-1; i >= 0; i--)
				{
					d = selected[i];
					vstore.remove(d);
					sstore.insert(0, d.data);
				}
			}
		}
		else
		{
			for (i=vitems.length-1; i>=0 ; i--)
			{
				d = vitems[i];
				vstore.remove(d);
				sstore.insert(0, d.data);
			}
		}
	},
	
	_3/*removeItem*/: function(allvalue) {
		var i,
			vgrid = this.down("[name=_1]"),
			vstore = vgrid.store,
			vitems = vstore.data.items,
			sgrid = this.down("[name=_2]"),
			sstore = sgrid.store,
			sitems = sstore.data.items,
			move, d;
		
		if (allvalue == false)
		{
			var selected = sgrid.selModel.selected.items;
			
			if (selected && selected.length > 0)
			{
				for (i=selected.length-1; i >= 0; i--)
				{
					d = selected[i];
					sstore.remove(d);
					vstore.insert(0, d.data);
				}
			}
		}
		else
		{
			for (i=sitems.length-1; i>=0; i--)
			{
				d = sitems[i];
				sstore.remove(d);
				vstore.insert(0, d.data);
			}
		}
	},
	
	initComponent: function() {

		this.items = [
			{
				xtype: "container",
				"layout": "anchor",
				flex: 1,
				defaults: {
					anchor: "100%"
				},
				items: [
					{
						xtype: "fieldcontainer",
						"layout": "hbox",
						fieldLabel: IRm$/*resources*/.r1("L_BTN_SEARCH"),
						labelWidth: 35,
						items: [
							{
								xtype: "combobox",
								name: "_3",
								queryMode: 'local',
			    				fieldLabel: '',
			    				displayField: 'name',
			    				valueField: 'value',
			    				editable: false,
								autoSelect: false,
								
								width: 50,
								
								store: {
									fields: [
										"name", "value"
									],
									data: [
										{name: "Include", value: "INCLUDE"},
										{name: "Start", value: "START"},
										{name: "End", value: "END"}
									]
								}
							},
							{
								xtype: "textfield",
								name: "_4",
								width: 100,
								enableKeyEvents: true,
		        				listeners:{
		                            keydown: function(tobj, e, eopts) {
		                            	if (e.keyCode == 13)
			        					{
			        						this._1/*getValueList*/();
			        					}
									},
		                            scope: this
		        				}
							},
							{
								xtype: "button",
								text: "..",
								width: 20,
								handler: function() {
									this._1/*getValueList*/();
								},
								scope: this
							}
						]
					},
					{
						xtype: 'grid',
						name: "_1",
						store: {
							fields: [
								{name: 'code'},
								{name: 'text'}
							]
						},
						stateful: true,
						flex: 1,
						columnLines: true,
						selType: "checkboxmodel",
						selModel: {
							checkSelector: ".x-grid-cell"
						},
						height: 280,
						columns: [
							{
								text: IRm$/*resources*/.r1("B_CODE"),
								flex: 1,
								sortable: true,
								dataIndex: 'code'
							},
							{
								text: IRm$/*resources*/.r1("B_TEXT"),
								flex: 1,
								sortable: true,
								dataIndex: 'text'
							}
						],
						viewConfig: {
							stripeRows: true
						}
					}
				]
			},
			{
				width: 40,
				"layout": {
					type: 'vbox',
					align: 'stretch',
					pack: 'center'
				},
				items: [
					{
						xtype: 'button',
	        			text: '>>',
	        			handler:function() {
							this._2/*selectItem*/(true);
						},
						scope: this
					},
					{
						xtype: 'button',
	        			text: '>',
	        			handler:function() {
							this._2/*selectItem*/(false);
						},
						scope: this
					},
					{
						xtype: 'button',
	        			text: '<',
	        			handler:function() {
							this._3/*removeItem*/(false);
						},
						scope: this
					},
					{
						xtype: 'button',
	        			text: '<<',
	        			handler:function() {
							this._3/*removeItem*/(true);
						},
						scope: this
					}
				]
			},
			{
				xtype: 'grid',
				name: '_2',
				store: {
					fields: [
						{name: 'code'},
						{name: 'text'}
					]
				},
				stateful: true,
				flex: 1,
				columnLines: true,
				selType: "checkboxmodel",
				selModel: {
					checkSelector: ".x-grid-cell"
				},
				columns: [
					{
						text: 'Code',
						flex: 1,
						sortable: false,
						dataIndex: 'code'
					},
					{
						text: 'Text',
						flex: 1,
						sortable: false,
						dataIndex: 'text'
					}
				],
				viewConfig: {
					stripeRows: true
				}
			}
		];
		
		IG$/*mainapp*/._Iee/*dlgValueSelect*/.superclass.initComponent.apply(this);
	},
	
	listeners: {
		afterrender: function() {
			this._IFd/*init_f*/();
		}
	}
});


IG$/*mainapp*/._Iac/*valueSelectWindow*/ = $s.extend($s.window, {
	modal: true,
	region:'center',
	"layout": 'card',
	
	closable: false,
	resizable:false,
	width: 560,
	height: 400,
	
	field: null,
	
	callback: null,
	selmode: 0,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			seldatas = [],
			i;
		
		if (me.selmode == 0)
		{
			var sgrid = this.down("[name=_2]"),
				selected = sgrid.store.data.items
			
			if (selected && selected.length > 0)
			{
				for (i=0; i < selected.length; i++)
				{
					seldatas.push(selected[i].data);
				}
			}
		}
		else if (me.selmode == 1)
		{
			var sinp = me.down("[name=txtselvalues]"),
				sel = sinp.getValue(),
				selected;
				
			if (sel)
			{
				selected = sel.split(";");
				for (i=0; i < selected.length; i++)
				{
					if (selected[i])
					{
						seldatas.push({
							code: selected[i],
							text: selected[i]
						});
					}
				}
			}
			
		}
		
		this.callback && this.callback.execute(seldatas);
		
		this._IG0/*closeDlgProc*/();
	},
	
	sc/*swapSelectionMode*/: function() {
		var me = this,
			p = me.getLayout(),
			btnSelMode = me.down("[name=btnSelMode]"),
			stext;
		
		if (me.selmode == 0)
		{
			me.selmode = 1;
			stext = IRm$/*resources*/.r1("B_COMBO_VAL");
		}
		else
		{
			me.selmode = 0;
			stext = IRm$/*resources*/.r1("B_CUST_VAL");
		}
		btnSelMode.setText(stext);
		p.setActiveItem(me.selmode);
	},
	
	initComponent : function() {
		var _IH1/*mainpanel*/ = new IG$/*mainapp*/._Iee/*dlgValueSelect*/({
			_ILb/*sheetoption*/: this._ILb/*sheetoption*/,
			prompt: this.prompt,
			field: this.field,
			bodyStyle: "padding: 10px"
		});
		
		this.title = IRm$/*resources*/.r1("T_VALUE_SELECT");
				 
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				_IH1/*mainpanel*/,
				{
					xtype: "form",
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "displayfield",
							value: IRm$/*resources*/.r1("L_CVAL_DESC")
						},
						{
							xtype: "textarea",
							fieldLabel: IRm$/*resources*/.r1("B_VALUES"),
							name: "txtselvalues",
							labelAlign: "top",
							flex: 1
						}
					]
				}
			],
			buttons:[
//					{
//						text: IRm$/*resources*/.r1("B_HELP"),
//						handler: function() {
//							IG$/*mainapp*/._I63/*showHelp*/('P0008');
//						},
//						scope: this
//					}, 
				'->',
				{
					text: IRm$/*resources*/.r1("B_CUST_VAL"),
					name: "btnSelMode",
					handler: function() {
						var me = this;
						me.sc/*swapSelectionMode*/();
					},
					scope: this
				},
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
		
		IG$/*mainapp*/._Iac/*valueSelectWindow*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._IacU/*UDGvalueSelectWindow*/ = $s.extend($s.window, {
	modal: true,
	region:'center',
	"layout": 'card',
	
	closable: false,
	resizable:false,
	width: 500,
	height: 400,
	
	field: null,
	
	callback: null,
	selmode: 0,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			seldatas = [],
			i;
		
		if (me.selmode == 0)
		{
			var sgrid = this.down("[name=_2]"),
				selected = sgrid.store.data.items
			
			if (selected && selected.length > 0)
			{
				for (i=0; i < selected.length; i++)
				{
					seldatas.push(selected[i].data);
				}
			}
		}
		else if (me.selmode == 1)
		{
			var sinp = me.down("[name=txtselvalues]"),
				sel = sinp.getValue(),
				selected;
				
			if (sel)
			{
				selected = sel.split(";");
				for (i=0; i < selected.length; i++)
				{
					if (selected[i])
					{
						seldatas.push({
							code: selected[i],
							text: selected[i]
						});
					}
				}
			}
		}
		else if (me.selmode == 2)
		{
		}
		
		this.callback && this.callback.execute({
			selmode: me.selmode,
			syntax: me.down("[name=_s1]").getValue(),
			selection: seldatas
		});
		
		this._IG0/*closeDlgProc*/();
	},
	
	_1/*initApp*/: function() {
		var me = this,
			rec = me.rec,
			smode = 0,
			_s1 = me.down("[name=_s1]");
			
		if (rec)
		{
			if (rec.get("ctype") == "formula")
			{
				smode = 2;
				_s1.setValue(rec.get("syntax"));
			}
		}
		
		me.sc/*swapSelectionMode*/(smode);
	},
	
	sc/*swapSelectionMode*/: function(smode) {
		var me = this,
			_mpanel = me.down("[name=_mpanel]"),
			p = _mpanel.getLayout(),
			stext;
		
		me.selmode = smode;
		p.setActiveItem(me.selmode);
	},
	
	initComponent : function() {
		var _IH1/*mainpanel*/ = new IG$/*mainapp*/._Iee/*dlgValueSelect*/({
			_ILb/*sheetoption*/: this._ILb/*sheetoption*/,
			prompt: this.prompt,
			field: this.field
		});
		
		this.title = IRm$/*resources*/.r1("T_VALUE_SELECT");
				 
		$s.apply(this, {
			defaults:{bodyStyle:'padding:10px'},
			
			items: [
				{
					xtype: "panel",
					layout: "card",
					name: "_mpanel",
					tbar: [
						{
							text: IRm$/*resources*/.r1("B_COMBO_VAL"),
							handler: function() {
								var me = this;
								me.sc/*swapSelectionMode*/(0);
							},
							scope: this
						},
						{
							text: IRm$/*resources*/.r1("B_CUST_VAL"),
							handler: function() {
								var me = this;
								me.sc/*swapSelectionMode*/(1);
							},
							scope: this
						},
						{
							text: IRm$/*resources*/.r1("B_FORMULA"),
							handler: function() {
								var me = this;
								me.sc/*swapSelectionMode*/(2);
							},
							scope: this
						}
					],
					items: [
						_IH1/*mainpanel*/,
						{
							xtype: "form",
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "displayfield",
									value: IRm$/*resources*/.r1("L_CVAL_DESC")
								},
								{
									xtype: "textarea",
									fieldLabel: IRm$/*resources*/.r1("B_VALUES"),
									name: "txtselvalues",
									labelAlign: "top",
									flex: 1
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
									xtype: "textarea",
									flex: 1,
									name: "_s1"
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
		
		IG$/*mainapp*/._Iac/*valueSelectWindow*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj._1/*initApp*/.call(tobj);
		}
	}
});

IG$/*mainapp*/._Id1/*helpWindow*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pbW, {
	modal: true,
	dm/*doctype*/: null,
	"layout": "fit",
	
	closable: true,
	resizable:false,
	
	uid: null,
	
	width: 600,
	height: 400,
	
	t: null,
	c: null,
	
	callback: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	sK2/*loadContent*/: function(itemuid) {
		var panel=this,
			memo = panel.down("[name=memo]"),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		if (panel.dm/*doctype*/ == "report")
		{
			panel.uid = itemuid;
			memo.setValue(itemuid);
			
			req.init(panel, 
				{
		            ack: "16",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({helpuid: itemuid}, "helpuid"),
	                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "get"})
		        }, panel, panel.rs_u4x/*loadContent*/, null);
			req._l/*request*/();
		}
	},
	
	rs_u4x/*loadContent*/: function(xdoc) {
		var me = this,
			helpdoc = this.down("[name=helpdoc]"),
			memo = this.down("[name=memo]"),
			helptitle = this.down("[name=helptitle]"),
			node,
			nodes,
			i, l, tnode, cnode;
			
		me.u5x/*toolbarHandler*/("cmd_cancel");
			
		me.u5m = {i:{}, c:{}};
		node = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		IG$/*mainapp*/._I1f/*XGetInfo*/(me.u5m.i, node, "uid;name;nodepath;memo", "s");
		
		me.uid = me.u5m.i.uid;
		memo.setValue(me.u5m.i.memo);
		
		nodes = IG$/*mainapp*/._I26/*getChildNodes*/(node);
		for (i=0; i < nodes.length; i++)
		{
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(nodes[i], "Title");
			cnode = IG$/*mainapp*/._I18/*XGetNode*/(nodes[i], "Content");
			
			l ={lang: IG$/*mainapp*/._I1b/*XGetAttr*/(nodes[i], "language"), 
				t: IG$/*mainapp*/._I24/*getTextContent*/(tnode), 
				c: IG$/*mainapp*/._I24/*getTextContent*/(cnode)};
			this.u5m.c[l.lang] = l;
		}
		
		var locale = window.useLocale || "en_US";
		
		if (!me.u5m.c["en_US"])
		{
			me.u5m.c["en_US"] = {lang: "en_US", t: "", c: ""};
		}
		if (!me.u5m.c["ko_KR"])
		{
			me.u5m.c["ko_KR"] = {lang: "ko_KR", t: "", c: ""};
		}
		
		if (!me.u5m.c[locale])
		{
			me.u5m.c[locale] = {lang: locale, t: "", c: ""};
		}
		
		me.setTitle(me.u5m.c[locale].t || IRm$/*resources*/.r1("B_HELP"));
		var doc = me.down("[name=helpdoc]"),
			helpdoc = me.down("[name=helpdocedit]"),
			content = Base64.decode(me.u5m.c[locale].c) || "";
		$(doc.body.dom).html(content);
		helpdoc.setValue(content);
		helptitle.setValue(me.u5m.c[locale].t || "");
	},
	
	u5x/*toolbarHandler*/: function(cmd) {
		var me = this,
			win = me.win,
			btnedit = win ? win.down("[name=btnedit]") : null,
			btnsave = win ? win.down("[name=btnsave]") : null,
			btncancel = win ? win.down("[name=btncancel]") : null,
			p = me.down("[name=helpmain]"), active = -1,
			isadmin = IG$/*mainapp*/._I83/*dlgLogin*/.jS2/*isAdmin*/;
			
		switch (cmd)
		{
		case "cmd_edit":
			// btnedit.setVisible(false);
			// btnsave.setVisible(true);
			// btncancel.setVisible(true);
			active = 1;
			break;
		case "cmd_save":
			me.u6x/*saveContent*/();
			break;
		case "cmd_cancel":
			if (btnedit && isadmin)
			{
				btnedit.setVisible(true);
				btnsave.setVisible(false);
			}
			active = 0;
			break;
		}
		
		if (active > -1)
		{
			p.setActiveItem(active);
		}
	},
	
	u7l/*updateContent*/: function() {
		var me = this,
			helpdoc = this.down("[name=helpdocedit]"),
			memo = this.down("[name=memo]"),
			helptitle = this.down("[name=helptitle]"),
			locale = window.useLocale || "en_US",
			doc = (this.u5m/*helpcontent*/) ? this.u5m/*helpcontent*/.c[locale] : null;
		
		me.u5m.i.memo = memo.getValue();
		
		if (doc)
		{
			doc.c = Base64.encode(helpdoc.getValue());
			doc.t = helptitle.getValue();
		}
	},
	
	u6x/*saveContent*/: function() {
		var panel=this,
			address,
			lang, item, c, addr, u5m,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			locale = window.useLocale || "en_US";
				
		if (!panel.u5m/*helpcontent*/)
		{
			u5m = panel.u5m/*helpcontent*/ = {i:{}, c:{}};
			u5m.c["en_US"] = {lang: "en_US", t: "", c: ""};
			u5m.c["ko_KR"] = {lang: "ko_KR", t: "", c: ""};
			
			if (!u5m.c[locale])
			{
				u5m.c[locale] = {lang: locale, t: "", c: ""};
			}
		}
		
		panel.u7l/*updateContent*/();
		
		c = "<smsg><item uid='" + (panel.u5m/*helpcontent*/.i.uid || "") + "'>";
		c += "<objinfo doctype='" + (panel.dm/*doctype*/ || "") + "' memo='" + panel.u5m.i.memo + "'/>";
		for (lang in panel.u5m/*helpcontent*/.c)
		{
			item = panel.u5m/*helpcontent*/.c[lang];
			c += "<HelpContent language='" + item.lang + "'>"
			  + "<Title><![CDATA[" + (item.t || "") + "]]></Title>"
			  + "<Content><![CDATA[" + (item.c || "") + "]]></Content></HelpContent>";
		}
		
		c += "</item></smsg>";

		addr = {
			uid: panel.u5m/*helpcontent*/.i.uid, 
			memo: panel.u5m.i.memo
		};
		if (!addr.uid)
		{
			addr.address = "/SYS_Documents/" + addr.memo;
			addr.name = addr.memo;
			addr.type = "Help";
		}
		address = IG$/*mainapp*/._I2d/*getItemAddress*/(addr, "uid;memo;pid;name;type;address");
		
    	req.init(panel, 
			{
	            ack: "31",
	            payload: address,
	            mbody: c
	        }, panel, panel.rs_u6x/*saveContent*/, null);
		req._l/*request*/();
	},
	
	rs_u6x/*saveContent*/: function(xdoc) {
		var panel = this,
			t = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			uid = (t) ? IG$/*mainapp*/._I1b/*XGetAttr*/(t, "uid") : null;
		
		if (uid)
		{
			panel.u5m/*helpcontent*/.i.uid = uid;
		}
		
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
	},
	
	_ic/*initComponent*/ : function() {
		var panel = this;
		
		IG$/*mainapp*/.apply(this, {
			title: IRm$/*resources*/.r1("B_HELP"),
			items: [
				{
					xtype: "panel",
					layout: "fit",
					padding: 10,
					items: [
						{
							xtype: "panel",
							name: "helpmain",
							"layout": "card",
							items: [
								{
									xtype: "panel",
									name: "helpdoc"
							    },
							    {
							    	xtype: "panel",
							    	name: "helpedit",
							    	"layout": {
							    		type: "vbox",
							    		align: "stretch"
							    	},
							    	items: [
										{
											xtype: "textfield",
											hidden: (panel.dm/*doctype*/ == "report") ? true : false,
											fieldLabel: "DOCID",
											name: "memo"
										},
							    		{
							    			xtype: "textfield",
							    			fieldLabel: "Title",
							    			name: "helptitle"
							    		},
							    		{
							    			xtype: "textarea",
							    			name: "helpdocedit",
							    			flex: 1,
							    			enableColors: true,
							    			enableAlignments: true
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
					text: "Edit",
					hidden: this.dm/*doctype*/ != "report",
					name: "btnedit",
					handler: function() {
						var me = this,
							p = me.down("[name=peditor]");
						me.down("[name=btnsave]").setVisible(true);
						me.u5x/*toolbarHandler*/.call(me, "cmd_edit");
					},
					scope: panel
				},
				{
					text: IRm$/*resources*/.r1("L_SAVE_CONTENT"),
					name: "btnsave",
					hidden: true,
					handler: function() {
						var me = this,
							p = me.down("[name=peditor]");
						me.u5x/*toolbarHandler*/.call(me, "cmd_save");
					},
					scope: panel
				},
				{
					text: IRm$/*resources*/.r1("B_CLOSE"),
					name: "btncancel",
					handler: function() {
						panel.close();
					},
					scope: panel
				}
			],
			listeners: {
				afterrender: function() {
					var me = this;

					if (me.t != null && me.c != null)
					{
						me.setTitle(me.t || IRm$/*resources*/.r1("B_HELP"));
						var doc = this.down("[name=helpdoc]");
						if (doc.body)
							$(doc.body.dom).html(me.c);
					}
					else if (me.uid)
					{
						me.sK2/*loadContent*/(me.uid);
					}
				}
			}
		});
		
		IG$/*mainapp*/._Id1/*helpWindow*/.superclass._ic/*initComponent*/.apply(this, arguments);
	}
});
IG$/*mainapp*/.r___ = {};

IG$/*mainapp*/.r___.a/*registertooltip*/ = function(tobj, tcode) {
	if (!IG$/*mainapp*/.r___.C/*content*/)
	{
		$.ajax({
			type: "GET",
			url: "./data/tip.json" + "?uniquekey=" + IG$/*mainapp*/._I4a/*getUniqueKey*/(), 
			dataType: "json",
			timeout: 10000,
			success: function(data) {
				IG$/*mainapp*/.r___.C/*content*/ = data;
				IG$/*mainapp*/.r___.a/*registertooltip*/(tobj, tcode);
			},
			error: function(e, status, thrown) {
			}
		});
	}
	else
	{
		var tdoc = IG$/*mainapp*/.r___.C/*content*/ ? IG$/*mainapp*/.r___.C/*content*/[tcode] : null;
		
		if (tdoc && window.Ext)
		{
			Ext.tip.QuickTipManager.register({
				target: tobj.getId(), // Target button's ID
				title: tdoc.title,  // QuickTip Header
				text: tdoc.html // Tip content  
			});
		}
	}
};

IG$/*mainapp*/.r___.b/*loadHelp*/ = function(hcode, h) {
	if (!IG$/*mainapp*/.r___.bC/*content*/)
	{
		$.ajax({
			type: "GET",
			url: "./data/manual.json" + "?uniquekey=" + IG$/*mainapp*/._I4a/*getUniqueKey*/(), 
			dataType: "json",
			timeout: 10000,
			success: function(data) {
				IG$/*mainapp*/.r___.bC/*content*/ = data;
				var tdoc = IG$/*mainapp*/.r___.bC/*content*/ ? IG$/*mainapp*/.r___.bC/*content*/[hcode] : null;
				
				if (tdoc)
				{
					h.t = tdoc.t;
					h.c = tdoc.h;
					h.show();
				}
				else
				{
					IG$/*mainapp*/._I54/*alertmsg*/("Error!", "Document for (" + hcode + ") is not prepared yet!", null, null, 1, "error");
				}
			},
			error: function(e, status, thrown) {
			}
		});
	}
	else
	{
		var tdoc = IG$/*mainapp*/.r___.bC/*content*/ ? IG$/*mainapp*/.r___.bC/*content*/[hcode] : null;
		
		if (tdoc)
		{
			h.t = tdoc.t;
			h.c = tdoc.h;
			
			h.show();
		}
		else
		{
			IG$/*mainapp*/._I54/*alertmsg*/("Error!", "Document for (" + hcode + ") is not prepared yet!", null, null, 1, "error");
		}
	}
}
IG$/*mainapp*/._Ib5/*promptdlg*/ = $s.extend($s.panel, {
	
	region:'center',
	
	"layout": "fit",
	
	closable: false,
	resizable:false,
	boder: 0,
	autoHeight: true,
	
	callback: null,
	
	_d6/*itemList*/: [],
	selvalues: null,
	
	prompts: null,
	
	valuetimer: -1,
	
	_IFd/*init_f*/: function() {
		var me = this,
			i,
			panel = this,
			inneritems = [],
			idindex=0, prompteditor,
			container = this._IH1/*mainpanel*/;

//		inneritems.push(
//			{
//				xtype: 'displayfield',
//				value: IRm$/*resources*//resources/.r1('T_PROMPT_MSG')
//			},
//			{
//				xtype: 'displayfield',
//				value: " "
//			}
//		);

		container.removeAll();
		
		if (panel.prompts && panel.prompts.length > 0)
		{
			// for (i=0; i < panel.prompts.length; i++)
			$.each(panel.prompts, function(i, prompt) {
				var uid = "prompt_" + i; // idindex;
				// idindex++;
				
				prompt.uid = uid;
				prompt._ILa/*reportoption*/ = me._ILa/*reportoption*/;
				prompt.sheetindex = me.sheetindex;
				
				prompteditor = {
					fieldLabel: (prompt._d6/*itemList*/ && prompt._d6/*itemList*/.length > 0 ? prompt._d6/*itemList*/[0].name : prompt.name || "Prompt"),
					name: uid
				};
				
				switch(prompt.type)
				{
				case "selection":
					prompt.promptEditor = IG$/*mainapp*/._IE2/*filterpromptenum*/.P_SELECT_WIN;
					break;
				case "combobox":
					prompt.promptEditor = IG$/*mainapp*/._IE2/*filterpromptenum*/.P_COMBOBOX;
					break;
				case "textinput":
					prompt.promptEditor = IG$/*mainapp*/._IE2/*filterpromptenum*/.P_TEXTBOX;
				}
				
				switch (prompt.promptEditor)
				{
				case IG$/*mainapp*/._IE2/*filterpromptenum*/.P_COMBOBOX:
					prompteditor.xtype = "combo";
					prompteditor.queryMode = "local";
					prompteditor.labelAlign = "left";
					prompteditor.valueField = "code";
					prompteditor.labelField = "text";
					prompteditor.editable = false;
					prompteditor.store = {
						fields: [
							"text", "code"
						],
						data: [
						]
					};
					
					prompteditor.listeners = {
						select: function() {
						},
						scope: panel
					};
					break;
				case IG$/*mainapp*/._IE2/*filterpromptenum*/.P_DATE:
					prompteditor.xtype = "datefield";
					break;
				case IG$/*mainapp*/._IE2/*filterpromptenum*/.P_SELECT_WIN:
					prompteditor.xtype = "fieldcontainer";
					prompteditor.combineErrors = false;
					prompteditor.layout = "hbox";
					prompteditor.defaults = {
						hideLabel: true
					},
					
					prompteditor.name = null;
					
					prompteditor.items = [
						{
							name: uid,
							flex: 1,
							xtype: 'textfield',
							editable: false
						},
						{
							xtype: 'button',
							text: '..',
							width: 20,
							handler: function() {
								panel.sK4/*showValueEditor*/(prompt, prompt._d6/*itemList*/, uid);
							},
							scope: panel
						}
					]
					break;
				default:
					prompteditor.xtype = "textfield";
					break;
				}
				
				inneritems.push(prompteditor);
			});
		}
		
		for (i=0; i < inneritems.length; i++)
		{
			container.add(inneritems[i]);
		}
		
		if (this.valuetimer > -1)
		{
			clearTimeout(panel.valuetimer);
		}
		
		this.valuetimer = setTimeout(function() {
			panel._IFdV/*init_f_loadValue*/.call(panel);
		}, 500);
		
		container.doLayout();
		this.doLayout();
	},
	
	_IFdV/*init_f_loadValue*/: function() {
		var panel = this,
			bf = false,
			ctrl, uid,
			callback;
		
		panel.valuetimer = -1;
		
		if (panel.prompts && panel.prompts.length > 0)
		{
			for (i=0; i < panel.prompts.length; i++)
			{
				prompt = panel.prompts[i];
				uid = prompt.uid;
				ctrl = this.down("[name=" + uid + "]");
				
				switch (prompt.promptEditor)
				{
				case IG$/*mainapp*/._IE2/*filterpromptenum*/.P_COMBOBOX:
					prompt.ctrl = ctrl;
					
					if (prompt.dataLoaded !== true)
					{
						callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.r_IFdV/*init_f_loadValue*/, prompt);
						prompt.LD/*loadData*/.call(prompt, panel, callback);
					}
					else
					{
						this.r_IFdV/*init_f_loadValue*/(prompt);
					}
					break;
				}
			}
		}
	},
	
	r_IFdV/*init_f_loadValue*/: function(xdoc, prompt) {
		switch (prompt.promptEditor)
		{
		case IG$/*mainapp*/._IE2/*filterpromptenum*/.P_COMBOBOX:
			if (prompt.ctrl && prompt.result)
			{
				prompt.ctrl.store.loadData(prompt.result.data);
			}
			break;
		}
	},
	
	_IG0/*closeDlgProc*/: function() {
		this.setVisible(false);
	},
	
	_IFf/*confirmDialog*/: function() {
		if (this.prompts && this.prompts.length > 0)
		{
			var i, j,
				prompt,
				uid,
				ctrl,
				value;
				
			for (i=0; i < this.prompts.length; i++)
			{
				prompt = this.prompts[i];
				uid = prompt.uid;
				ctrl = this.down("[name=" + uid + "]");
				
				if (ctrl)
				{
					switch (prompt.promptEditor)
					{
					case IG$/*mainapp*/._IE2/*filterpromptenum*/.P_COMBOBOX:
						value = ctrl.getValue();
						if (value)
						{
							if (prompt.operator == 7)
							{
								value += "%";
							}
						}
						
						prompt.values = [{code: value, text: value}];
						break;
					case IG$/*mainapp*/._IE2/*filterpromptenum*/.P_DATE:
						value = ctrl.getValue();
						if (value)
						{
							value = Ext.Date.format(value, "Ymd");
							if (prompt.operator == 7)
							{
								value += "%";
							}
							prompt.values = [{code: value, text: value}];
						}
						break;
					case IG$/*mainapp*/._IE2/*filterpromptenum*/.P_SELECT_WIN:
						value = ctrl.selvalues;
						
						prompt.values = [];
						
						if (value && value.length > 0)
						{
							for (j=0; j < value.length; j++)
							{
								prompt.values.push({code: value[j].code, text: value[j].value});
							}
						}
						break;
					default:
						value = ctrl.getValue();
						if (prompt.operator == 6)
						{
							value = value.split(",");
							
							prompt.values = [];
							
							for (j=0; j < value.length; j++)
							{
								if (value[j] != "")
								{
									prompt.values.push({code: value[j], text: value[j]});
								}
							}
						}
						else
						{
							prompt.values = [{code: value, text: value}];
						}
						break;
					}
				}
			}
		}
		
		this.callback && this.callback.execute();
		
		// this._IG0/*closeDlgProc*/();
	},
	
	sK4/*showValueEditor*/: function(prompt, _d6/*itemList*/, inp) {
		var pop = new IG$/*mainapp*/._Iac/*valueSelectWindow*/({
			prompt: prompt,
			field: _d6/*itemList*/ && _d6/*itemList*/.length > 0 ? _d6/*itemList*/[0] : null,
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs_sK4/*showValueEditor*/, inp)
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
	},
	
	rs_sK4/*showValueEditor*/: function(sel, inp) {
		var ctrl = this.down("[name=" + inp + "]");
		
		ctrl.selvalues = [];
		
		if (sel && sel.length > 0)
		{
			ctrl.selvalues = sel;
		}
		
		this.setFilterDesc(ctrl, inp);
	},
	
	setFilterDesc: function(ctrl, inp) {
		var fitem = null,
			i;
		
		for (i=0; i < this.prompts.length; i++)
		{
			if (this.prompts[i].uid == inp)
			{
				fitem = this.prompts[i];
				break;
			}
		}
		
		if (fitem)
		{
			var r = fitem._d2/*getValueDesc*/(ctrl.selvalues);
			ctrl.setValue(r);
		}
	},
	
	initComponent : function() {
		this.title = IRm$/*resources*/.r1('T_PROMPT_DLG');
		
		this._IH1/*mainpanel*/ = new $s.panel({
			xtype: "panel",
			// name: "mainpanel",
			autoHeight: true,
			"layout": {
				type: 'anchor',
				align: 'stretch'
			},
			border: false,
			bodyPadding: 3,
			
			fieldDefaults: {
    			labelWidth: 150,
    			anchor: '100%'
			},
			
			items: []
		});
				 
		$s.apply(this, {
			defaults:{
				bodyStyle:'padding: 0px'
			},
			
			items: [
				this._IH1/*mainpanel*/
			],
			buttons:[
				'->',
				{
					text: IRm$/*resources*/.r1('B_EXECUTE'),
					handler: function() {
						this._IFf/*confirmDialog*/();
					},
					scope: this
				}, {
					text: IRm$/*resources*/.r1('B_CLOSE'),
					handler:function() {
						this._IG0/*closeDlgProc*/();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function() {
					var panel = this;
					
					setTimeout(function() {
						// panel._IFd/*init_f*/();
					}, 300);
				}
			}
		});
		
		IG$/*mainapp*/._Ib5/*promptdlg*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._Ie2/*cellwizard*/ = $s.extend($s.window, {
	
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
		var me = this,
			node = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			ctrl, req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			i,
			celloption;
		
		me.item = new IG$/*mainapp*/._IE8/*clItems*/(node);
		celloption = me.item.celloption;
		
		this._ropt = "basedatatype;valuemax;valuemin;cellwidth;cellheight".split(";");
		
		for (i=0; i < me._ropt.length; i++)
		{
			ctrl = me.down("[name=" + me._ropt[i] + "]");
			ctrl.setValue(celloption[me._ropt[i]]);
		}
		
		$.each(["linecolor", "fillcolor"], function(i, k) {
			me.down("[name=" + k + "]").setValue(IG$/*mainapp*/.$gv/*getColorValue*/(celloption[k]));
		});
		
		ctrl = me.down("[name=axismetric]");
		ctrl.store.loadData(celloption.axismetric);
		
		if (celloption.valuemetric)
		{
			ctrl = me.down("[name=valuemetric]");
			me.valuemetric = IG$/*mainapp*/._I1e/*CloneObject*/(celloption.valuemetric);
			ctrl.setValue(celloption.valuemetric ? celloption.valuemetric.name : "");
		}
		
		if (!me.item.cubeuid)
		{
			req.init(me, 
				{
	                ack: "11",
	                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid, parenttype: "Cube;DataCube", read: "F"}, "uid;parenttype;read"),
	                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "parentcontent"})
	            }, me, me.rs_sK5s/*procLoadContent*/, null);
        	req._l/*request*/();
		}
	},
	
	rs_sK5s/*procLoadContent*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
		
		if (tnode)
		{
			me.item.cubeuid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid");
		}
	},	
	
	sK6/*saveContent*/: function() {
		var ctrl,
			me = this,
			meta,
			i,
			celloption = this.item.celloption;
		
		for (i=0; i < this._ropt.length; i++)
		{
			ctrl = this.down("[name=" + this._ropt[i] + "]");
			celloption[this._ropt[i]] = ctrl.getValue();
		}
		
		$.each(["linecolor", "fillcolor"], function(i, k) {
			celloption[k] = IG$/*mainapp*/.$gc/*getColorCode*/(me.down("[name=" + k + "]").getValue());
		});
				
		this.item.celloption.axismetric = [];
		ctrl = this.down("[name=axismetric]");
		
		this.item.celloption.valuemetric = this.valuemetric;
		
		for (i=0; i < ctrl.store.data.items.length; i++)
		{
			var dcell = ctrl.store.data.items[i].data;
			this.item.celloption.axismetric.push(dcell);
		}
			
		meta = "<smsg>" + this.item.C_1/*getItemXML*/() + "</smsg>";
		
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me, 
			{
                ack: "31",
                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: this.uid}),
                mbody: meta
            }, me, me.rs_sK6/*saveContent*/, null, null);
        req._l/*request*/();
	},
	
	rs_sK6/*saveContent*/: function(xdoc) {
		this.callback && this.callback.execute();
			
		this.close();
	},
	
	changeOptionType: function(newvalue) {
		var ctrl = this.down("[name=basedatatype]"),
			dp;
	},
	
	P2C/*valueSelectedHandler*/: function(item) {
		this.valuemetric = item;
		if (this.valuemetric)
		{
			this.down("[name=valuemetric]").setValue(this.valuemetric.name);
		}
	},
	
	initComponent : function() {
		var panel = this;
		
		panel.title = "Cell Chart Options";
		
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					border: 0,
					
					"layout": "anchor",
					
					bodyPadding: 5,
					
					items: [
					    {
					    	xtype: "combobox",
					    	name: "basedatatype",
					    	fieldLabel: 'Draw Type',
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
									{name: "Percent gauge", value: 0},
									// {name: "Balloon", value: 1},
									{name: "Area", value: 2},
									{name: "Line", value: 3},
									{name: "Column", value: 4},
									// {name: "Bar", value: 5},
									// {name: "100% Bar", value: 6},
									{name: "WinLose", value: 7},
									{name: "Pie", value: 8},
									{name: "BoxPlot", value: 9}
								]
							},
							listeners: {
								afterrender: function() {
								},
								change: function(field, newvalue, oldvalue) {
								}
							}
					    },
					    {
					    	xtype: "fieldset",
					    	title: "Y Axis Setting",
					    	"layout": "anchor",
					    	items: [
					    		{
					    			xtype: "numberfield",
					    			name: "valuemin",
					    			fieldLabel: "Minimum",
					    			flex: 1
					    		},
					    		{
					    			xtype: "numberfield",
					    			name: "valuemax",
					    			fieldLabel: "Maximum",
					    			flex: 1
					    		}
					    	]
					    },
					    {
					    	xtype: "fieldset",
					    	title: "Field Selections",
					    	layout: {
					    		type: "vbox",
					    		align: "stretch"
					    	},
					    	items: [
							    {
							    	xtype: 'fieldcontainer',
							    	fieldLabel: "Value Field",
					        		"layout": {
					        			type: 'hbox',
					        			align: "stretch"
					        		},
					        		
					        		items: [
					        			{
					        		    	xtype: "textfield",
							    			name: "valuemetric"
							    		},
					        		    {
						        			xtype: 'button',
						        			text: '..',
						        			handler:function() {
												var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
													visibleItems: 'workspace;folder;metric;measure;formulameasure;custommetric;datemetric',
													u5x/*treeOptions*/: {
														cubebrowse: true,
														rootuid: panel.item.cubeuid
													}
												});
												dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.P2C/*valueSelectedHandler*/);
												IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
											},
											scope: this
					        		    }
					        		]
							    },
							    {
							    	xtype: "container",
							    	layout: {
							    		type: "hbox",
							    		align: "stretch",
							    		pack: "center"
							    	},
							    	items: [
									    {
									    	xtype: "gridpanel",
									    	name: "axismetric",
									    	title: "X-Axis Field",
									    	hideHeaders: true,
									    	stateful: true,
									    	store: {
												fields: [
													"name", "type", "uid", "nodepath"
												]
											},
											flex: 1,
									    	height: 110,
									    	viewConfig: {
												plugins: {
													ptype: 'gridviewdragdrop',
													ddGroup: '_I$RD_G_'
												},
												
												listeners: {
													beforedrop: function(node, data, dropRec, dropPosition, dropFunction) {
														var r = false,
															index,
															i, bexist = false,
															rc = (data.records && data.records.length > 0) ? data.records[0] : null;
															
														(this == data.view) ? data.copy = false : data.copy = true;
														
														index = (dropRec) ? this.panel.store.indexOf(dropRec) : 0;
													        
														if (rc && (rc.data.type == 'Metric' || rc.data.type == 'Measure' || rc.data.type == "CustomMetric" || rc.data.type == "FormulaMeasure" || rc.data.type == "DateMetric"))
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
														var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
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
													text: IRm$/*resources*/.r1('B_TYPE'),
													flex: 1,
													sortable: false,
													dataIndex: 'type'
												},
												{
													xtype: 'actioncolumn',
													width: 30,
													items: [
														{
															iconCls: "icon-grid-delete",
															tooltip: 'Delete item',
															handler: function (grid, rowIndex, colIndex) {
																var store = grid.store,
																	rec = store.getAt(rowIndex);
																store.remove(store.data.items[rowIndex]);
															}
														}
													]
												}
									    	]
									    },
									    {
									    	xtype: "button",
									    	text: "..",
									    	width: 40,
									    	handler: function() {
									    		var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
													visibleItems: 'workspace;folder;metric;measure;formulameasure;custommetric;datemetric',
													u5x/*treeOptions*/: {
														cubebrowse: true,
														rootuid: panel.item.cubeuid
													},
													callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, function(item) {
														var axismetric = this.down("[name=axismetric]"),
															rec,
															store = axismetric.store,
															i, bf = false;
															
														for (i=0; i < store.data.items.length; i++)
														{
															rec = store.data.items[i];
															
															if (rec.get("uid") == item.uid)
															{
																bf = true;
																break;
															}
														}
														
														if (bf == false)
														{
															store.add(item);
														}
													})
												});
												IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
									    	},
									    	scope: this
									    }
									]
								}
							]
						},
					    {
					    	xtype: "fieldset",
					    	title: "Options",
					    	layout: "anchor",
					    	items: [
							    {
									xtype: "fieldcontainer",
									anchor: "100%",
									fieldLabel: "Line Color",
									"layout": "hbox",
									items: [
										{
											xtype: "textfield",
											name: "linecolor",
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
																this.down("[name=linecolor]").setValue("#" + color);
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
									fieldLabel: "Fill Color",
									"layout": "hbox",
									items: [
										{
											xtype: "textfield",
											name: "fillcolor",
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
																this.down("[name=fillcolor]").setValue("#" + color);
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
					    			fieldLabel: "Width",
					    			name: "cellwidth",
					    			minValue: 50,
					    			maxValue: 400
					    		},
					    		{
					    			xtype: "numberfield",
					    			fieldLabel: "Height",
					    			name: "cellheight",
					    			minValue: 20,
					    			maxValue: 300
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
		
		IG$/*mainapp*/._Ie2/*cellwizard*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._IB6/*reportOption*/ = $s.extend($s.window, {
	modal: true,
	region: "center",
	"layout": {
		type: "vbox",
		align: "stretch"
	},
	closable: false,
	resizable:false,
	width: 500,
	height: 400,
		
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	P2C/*cubeSelectedHandler*/: function (item) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
	            ack: "11",
	        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/(item),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "recent", btype: "L", mode: "register"})
	        }, me, function(xdoc) {
	        });
		req._l/*request*/();
	},
	
	_a1/*applyCubeSelection*/: function() {
		var me = this,
			cubeobj = me.cubeobj;
			
		if (cubeobj && cubeobj.uid)
		{
			var reporttype = me.reporttype,
				cubetype = cubeobj.type.toLowerCase(),
				rtype;
			
			me.P2C/*cubeSelectedHandler*/(cubeobj);
			
			rtype = IG$/*mainapp*/.xAM/*getReportType*/(cubetype);
			
			me.p$2D/*setCubeSelectionValue*/(rtype, reporttype);
						
			me.down("[name=fcube]").setValue(cubeobj.name);
		}
	},
	
	p$2D/*setCubeSelectionValue*/: function (value) {
		this.reporttype = value;
	},
	
	p$2E/*getCubeInfo*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
    	req.init(panel, 
			{
	            ack: "11",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.cubeobj.uid}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "translate"})
	        }, panel, panel.rs_p$2E/*getCubeInfo*/, null);
		req._l/*request*/();
	},
	
	rs_p$2E/*getCubeInfo*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			prop;
		
		if (tnode)
		{
			prop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			me.cubeobj.name = prop.name;
			me.cubeobj.nodepath = prop.nodepath;
			me.cubeobj.itemtype = prop.type;
			me.cubeobj.type = prop.type;
			
			me._a1/*applyCubeSelection*/();
		}
	},
	
	a1/*addList*/: function(tnodes, div_container) {
		var me = this;
		
		$.each(tnodes, function(i, m) {
			var p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(m),
				div_item;
			
			p.itemtype = p.type;
			
			div_item = $("<li class='ig-r-clist'><div></div><span title='" + p.nodepath + "'>" + p.name + "</span></li>");
			div_item.bind("click", function() {
				me.cubeobj = p;
				me._a1/*applyCubeSelection*/.call(me);
			});
			div_container.append(div_item);
		});
	},
	
	_d1/*doSearch*/: function() {
		var me = this,
			keyword = me.down("[name=m_k]").getValue(),
			soption = {option: "search", name: keyword, typelist: "Cube;MCube;DataCube;MDBCube;SQLCube;NoSQL", typemode: "1"},
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			obj_recent = me.down("[name=recentitems]"),
			div_recent = $(obj_recent.el.dom),
			div_container = $("<ul></ul>"),
			stitle = $("#search", div_recent),
			searchcontainer = $(".searchcontainer", div_recent);
		
		stitle.hide();
		
		if (soption.name)
		{
			stitle.show();
			
			searchcontainer.empty();
			div_container.appendTo(searchcontainer);
			
			req.init(me, 
				{
		            ack: "11",
		        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/(soption)
		        }, me, function(xdoc) {
		        	var me = this,
		        		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/result"),
						tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null;
						
		        	if (tnodes)
		        	{
		        		me.a1/*addList*/(tnodes, div_container, 1);
		        	}
		        	
		    	}, null, null
		    );
		    
		    req._l/*request*/();
	    }
	},
	
	initComponent : function() {
		var tjian = this,
			isp = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.l3.charAt(0) == "P" ? true : false;
		
		$s.apply(this, {
			defaults:{
				bodyStyle:"padding:10px"
			},
			
			title: IRm$/*resources*/.r1("L_T_CUBE_SEL"),
			
			items: [
				    {
				    	html: IRm$/*resources*/.r1("L_M_CUBE_SEL"),
				    	height: 30,
				    	border: false
				    },
				    {
				    	xtype: "panel",
						region:"center",
						flex: 1,
				        border: 0,
				        "layout": {
							type: "vbox",
							align: "stretch"
						},
				        region:"center",
				        items: [
				        	{
				        		xtype: "fieldcontainer",
				        		"layout": {
				        			type: "hbox",
				        			align: "stretch"
				        		},
				        		fieldLabel: IRm$/*resources*/.r1("L_M_SUBJ"),
				        		items: [
				        		    {
				        		    	xtype: "textfield",
				        		    	width: 160,
										name: "fcube",
										allowBlank: false
				        		    }, 
				        		    {
					        			xtype: "button",
					        			text: "..",
					        			handler:function() {
											var me = this,
												dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
													visibleItems: "workspace;folder;cube;mcube;datacube;nosql;sqlcube;mdbcube",
													callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(item) {
														var me = this;
														me.cubeobj = item;
														me._a1/*applyCubeSelection*/.call(me);
													})
												});
											dlgitemsel.show();
											// IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
										},
										scope: this
				        		    }
				        		]
			        		},
			        		{
			        			xtype: "fieldcontainer",
			        			"layout": {
			        				type: "hbox",
			        				align: "stretch"
			        			},
			        			fieldLabel: IRm$/*resources*/.r1("B_SEARCH"),
			        			items: [
			        				{
			        					xtype: "textfield",
			        					name: "m_k",
			        					width: 160,
			        					enableKeyEvents: true,
							            listeners: {
							        		'keyup': function(item, e) {
							        			if (e.keyCode == 13)
							        			{
							        				this._d1/*doSearch*/();
							        			}
							        		},
							        		scope: this
							        	}
			        				},
			        				{
			        					xtype: "button",
			        					cls: "ig-link-btn",
			        					text: "Search",
			        					handler: function() {
			        						this._d1/*doSearch*/();
			        					},
			        					scope: this
			        				}
			        			]
			        		},
			        		{
			        			xtype: "fieldset",
			        			title: IRm$/*resources*/.r1("L_M_SUBJ_REC"),
			        			flex: 1,
			        			layout: "fit",
			        			border: 1,
			        			items: [
			        				{
					        			xtype: "panel",
					        			border: 0,
					        			flex: 1,
					    		    	html: "<div class='recentcube'><span class='title'>Recent Subject</span><div class='recentcontainer'></div><span id='search' class='title' style='display:none;'>Search Results</span><div class='searchcontainer'></div></div>",
					    		    	name: "recentitems"
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
						var me = this;
						
						me._a1/*applyCubeSelection*/();
						me.callback && me.callback.execute(me);
						me.close();
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
					var me = this,
						rop = this._ILa/*reportoption*/,
						obj_recent = this.down("[name=recentitems]"),
						div_recent = $(obj_recent.el.dom),
						div_container = $("<ul></ul>"),
						recentcontainer = $(".recentcontainer", div_recent),
						req = new IG$/*mainapp*/._I3e/*requestServer*/();
						
					if (rop && rop.reportmode && rop.cubeuid)
					{
						me.cubeobj = {
							uid: rop.cubeuid
						};
						
						me.p$2E/*getCubeInfo*/();
					}
					
					div_container.appendTo(recentcontainer);
					
					req.init(me, 
						{
				            ack: "11",
				        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
				            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "recent", btype: "L"})
				        }, me, function(xdoc) {
				        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
				        		tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null;
				        		
				        	if (tnodes)
				        	{
				        		me.a1/*addList*/(tnodes, div_container);
				        	}
				        }, null, null);
					req._l/*request*/();
				}
			}
		});
		
		IG$/*mainapp*/._IB6/*reportOption*/.superclass.initComponent.apply(this, arguments);
	}
});
IG$/*mainapp*/._I96/*metaSelectDlg*/ = $s.extend($s.window, {
    
    width: 600,
    height: 450,
    "layout": 'fit',
    modal: true,
    u5x/*treeOptions*/: null,
    mode: 'select',
    visibleItems: null,
    xtype: "window",
    
    // my custom
	selectedItem: null,
	selectedPath: null,
    
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	fV11/*openFolderFunc*/: function(node) {
		var item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(node),
			child = IG$/*mainapp*/._I26/*getChildNodes*/(node);
		
		this.fm11/*processItemNodes*/(child, item);
	},
	
	fV10/*openFolderClickHandler*/: function(node) {
		var typename = node.type.toLowerCase();
    	var itemname = node.name;
		var itemaddr = node.nodepath;
		var itemuid = node.uid || node.address;
		
		var bproc = false;
		
		if (/(folder|javapackage|workspace|metrics|root|datemetric)/.test(typename) == true)
		{
			var me = this;
			
			this.selectedPath = {
				uid: itemuid, 
				nodepath: itemaddr,
				name: itemname
			};
			
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(null, 
				{
		            ack: "5",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: itemuid}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
		        }, me, me.rs_fV10/*openFolderClickHandler*/, null);
		    req._l/*request*/();
		    
			bproc = true;
		}
		
		return bproc;
	},
	
	rs_fV10/*openFolderClickHandler*/: function (xdoc) {
		var node = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(node),
			child = IG$/*mainapp*/._I26/*getChildNodes*/(node);
		
		this.fm11/*processItemNodes*/(child, item);
	},
	
	_IQ5/*loadContent*/: IG$/*mainapp*/._IQ5/*loadContent*/,
	
	r_IQ5/*loadContent*/: function(xdoc, ltype) {
		var me = this,
			datagrid = me.down("[name=datagrid]"),
			rname = (ltype == 4 || ltype == 0 || ltype == 5 || ltype == 1) ? "/smsg/item" : (ltype == 6 ? "/smsg/result" : "/smsg"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, rname),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			ctype, cname,
			i,
			d,
			dp = [],
			cpath = null,
			cuid,
			v;
			
		me._m1/*openItem*/ = null;
		
		me.l1/*ltype*/ = ltype;
		
		if (ltype == 0 || ltype == 5 || ltype == 1)
		{
			me._m1/*openItem*/ = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			cname = me._m1/*optionItem*/.name;
			cpath = me._m1/*openItem*/.nodepath;
			cuid = me._m1/*openItem*/.uid;
			ctype = me._m1/*openItem*/.type.toLowerCase();
		}
		
		me._IQ8/*setBreadCrumb*/(cpath, cuid);
		
		for (i=0; i < tnodes.length; i++)
		{
			d = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			d.ltype = d.type.toLowerCase();
			d.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(d.ltype);
			// d.updatedatefm = IG$/*mainapp*/._I40/*formatDate*/(d.updatedate);
			dp.push(d);
		}
		
		IG$/*mainapp*/._I10/*sortMeta*/(dp);
				
		datagrid.store.loadData(dp);
	},
	
	fm11/*processItemNodes*/: function(child, item) {
		var itemnodes = [],
			me = this,
			datagrid = me.down("[name=datagrid]"),
			hidden = false,
			i;
			
		me._IQ8/*setBreadCrumb*/(item.nodepath, item.uid);
			
		for (i=0; i < child.length; i++)
		{
			var obj = IG$/*mainapp*/._I1c/*XGetAttrProp*/(child[i]);
			obj.itemtype = obj.type || obj.itemtype;
			
			hidden = (this.visibleItems == null || (this.visibleItems 
				&& (this.visibleItems + ';').indexOf((obj.type + ';').toLowerCase()) > -1)) ? false : true;
				
			if (hidden == false)
			{
				itemnodes.push(obj);
			}
		}
		
		datagrid.store.clearData();
		datagrid.store.loadData(itemnodes);
	},
	
	_IQ8/*setBreadCrumb*/: function(cpath, cuid) {
		if (!this.__ini)
			return;
			
		var me = this,
			bc = me.down("[name=_bc]"),
			bcbody = $(bc.body.dom),
			cplist,
			cp = [],
			c,
			i, j,
			ul;
			
		bcbody.empty();
		me.bcuid = cuid,
		me._gb/*breadcrumbitems*/ = [];
		
		if (cpath)
		{
			cplist = cpath.split("/");
			for (i=1; i < cplist.length; i++)
			{
				c = {
					name: cplist[i],
					cpath: ""
				};
				
				for (j=1; j < i+1; j++)
				{
					c.cpath += "/" + cplist[j];
				}
				
				cp.push(c);
			}
			
			ul = $("<ul class='ig-navi-breadcrumb'></ul>").appendTo(bcbody);
			
			$.each(cp, function(m, mo) {
				var sp,
					li,
					bl = m < cp.length - 1;
					
				if (m > 0)
				{
					sp = $("<li class='ig-navi-breadcrumb-sep'>&gt;</li>").appendTo(ul);
				}
				
				li = $("<li class='" + (bl ? "qlink" : "") + "'>" + (mo.lname || mo.name) + "</li>").appendTo(ul);
				li.appendTo(ul);
				
				me._gb/*breadcrumbitems*/.push(mo);
				
				if (bl)
				{
					li.bind("click", function() {
						me._IQ5/*loadContent*/.call(me, 0, mo.cpath);
					});
				}
			});
		}
	},
	
	// designer generated
    
    initComponent: function() {
		var me = this,
			u5x/*treeOptions*/ = {
				showtoolbar: false,
				_IH9/*customParseXmlOwner*/: this,
				_IHa/*customParseXmlFunc*/: this.fV11/*openFolderFunc*/,
				_IHb/*customEventOwner*/: this,
				_IHc/*customClickFunc*/: this.fV10/*openFolderClickHandler*/,
				region: "center",
				name: "__mtree",
				flex: 1,
				visibleItems: 'workspace;folder;'
			};
		
		me.title = (me.mode == 'newitem') ? IRm$/*resources*/.r1('T_META_SAVE') : IRm$/*resources*/.r1('T_META_SELECT');
		
		if (me.u5x/*treeOptions*/)
		{
			for (var k in me.u5x/*treeOptions*/)
			{
				u5x/*treeOptions*/[k] = me.u5x/*treeOptions*/[k];
			}
		}
		
		u5x/*treeOptions*/.initpath = me.initpath;
		
		me.tree = new IG$/*mainapp*/._I98/*naviTree*/(u5x/*treeOptions*/);
		
		$s.apply(this, {
        	items: [
	            {
	                xtype: 'container',
	                "layout": "border",
	            	bodyStyle: 'padding: 5px;',
	                items: [
	                    {
	                        xtype: 'container',
	                        width: 180,
	                        region: "west",
	                        split: true,
	                        "layout": {
	                        	type: "vbox",
	                        	align: "stretch"
	                        },
	                        margins: 0,
	                        items: [
	                        	{
	                        		xtype: "panel",
	                        		bodyPadding: 4,
	                        		layout: {
	                        			type: "vbox",
	                        			align: "stretch",
	                        			defaultMargins: {
	                        				top: 4
	                        			}
	                        		},
	                        		defaults: {
	                        			xtype: "button",
	                        			cls: "ig-link-btn",
	                        			textAlign: "left",
	                        			scope: this
	                        		},
	                        		items: [
	                        			{
	                        				text: IRm$/*resources*/.r1("L_C_PR"),
	                        				cls: "ig-link-btn ig_n_p",
	                        				handler: function() {
	                        					this._IQ5/*loadContent*/(1);
	                        				}
	                        			},
	                        			{
	                        				text: IRm$/*resources*/.r1("L_C_AL"),
	                        				cls: "ig-link-btn ig_n_a",
	                        				handler: function() {
	                        					this._IQ5/*loadContent*/(0, "/");
	                        				}
	                        			},
	                        			{
	                        				text: IRm$/*resources*/.r1("L_C_FC"),
	                        				cls: "ig-link-btn ig_n_fav",
	                        				handler: function() {
	                        					this._IQ5/*loadContent*/(2);
	                        				}
	                        			},
	                        			{
	                        				text: IRm$/*resources*/.r1("L_C_MW"),
	                        				cls: "ig-link-btn ig_n_mw",
	                        				handler: function() {
	                        					this._IQ5/*loadContent*/(5, "/");
	                        				}
	                        			},
	                        			{
	                        				text: IRm$/*resources*/.r1("L_C_LC"),
	                        				cls: "ig-link-btn ig_n_rcnt",
	                        				handler: function() {
	                        					this._IQ5/*loadContent*/(3);
	                        				}
	                        			}
	                        		]
	                        	},
	                        	me.tree
	                        ]
	                    },
	                    {
	                        xtype: 'panel',
	                        region: "center",
	                        flex: 2,

	                        
	                        "layout": {
	                    		type: 'vbox',
	                    		align: 'stretch'
	                    	},
	                        
	                        items: [
	                        	{
									xtype: "panel",
									name: "_bc", /*breadcrumb*/
									height: 22,
									border: 0
								},
	                            {
	                            	xtype: "grid",
	                            	name: "datagrid",
									store: {
										xtype: "store",
										fields: [
											"name", "lname", "description", "type", "nodepath", "memo", "uid"
										]
									},
									selModel: {
										mode: (me.multiselect) ? "MULTI" : "SINGLE"
									},
									columns: [
										{
											header: IRm$/*resources*/.r1("B_NAME"), 
											dataIndex: 'name', 
											flex: 1,
											renderer: function(value, metadata, record) {
												return record.get("lname") || record.get("name");
											}
										},
			    						{
			    							header: IRm$/*resources*/.r1("B_TYPE"), 
			    							dataIndex: 'type'
			    						},
			    						{
			    							header: IRm$/*resources*/.r1("B_DESC"), 
			    							dataIndex: 'description'
			    						}
			    					],
									stripeRows: true,
									stateful: true,
									stateId: 'grid',
									flex: 1,
									listeners: {
										itemdblclick: function(view, record, item, index, e) {
											var datagrid = this,
												data = datagrid.store.data.items[index].data;
											
											if (/workspace|folder|datemetric/.test(data.type.toLowerCase()) == true)
											{
												me.fV10/*openFolderClickHandler*/(data);
											}
										},
										itemclick: function(view, record, item, index, e) {
											if (index > -1)
											{
												var datagrid = this,
													data = datagrid.store.data.items[index].data;
						
												if (/workspace|folder/.test(data.type.toLowerCase()) == true)
												{
													me.fV10/*openFolderClickHandler*/(data);
												}
												else
												{
													me.selectedItem = data;
													me.txtItemName.setValue(data.name);
												}
											}
										}
									}
								}
	                        ],
	                        
	                        bbar: [
	                        	{
									hideLabel: false,
									name: "txtItemName",
									fieldLabel: 'Name',
						            xtype: 'textfield',
						            flex: 3
						        },
	                            '-'
	                        ]
	                    }
	                ]
	            }
	        ],
	        buttons: [
	        	{
				    xtype: 'button',
				    text: IRm$/*resources*/.r1('B_CONFIRM'),
				    handler: function() {
				    	var me = this,
				    		selitem = me.selectedItem,
				    		datagrid = me.down("[name=datagrid]"),
				    		sel = datagrid.getSelectionModel().selected,
				    		i,
				    		rec;
				    	
						if (me.mode == 'select')
						{
				    		if (!selitem && me.targetobj != "folder")
				    		{
				    			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('L_SELECT_ITEM'), null, me, 1, "error");
				    			return;
				    		}
				    		else if (me.targetobj == "folder")
				    		{
				    			if (!me.selectedPath)
				    			{
				    				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('L_SELECT_ITEM'), null, me, 1, "error");
				    				return;
				    			}
				    			
				    			selitem = me.selectedPath;
				    		}
				    		
							if (me.multiselect)
							{
								selitem = [];
								
								for (i=0; i < sel.length; i++)
								{
									rec = sel.items[i];
									selitem.push(rec.data);
								}
							}
				    		
				    		if (me.callback)
				    		{
				    			me.callback.execute(selitem);
				    		}
						}
						else if (this.mode == 'newitem')
						{
							var txtinput = this.txtItemName.getValue();
							
							if (txtinput == '')
							{
								IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('L_TYPE_ITEM_NAME'), null, me, 1, "error");
				    			return;
							}
							else if (!me.selectedPath)
							{
								IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('L_SELECT_PATH'), null, me, 1, "error");
				    			return;
							}
							
							me.selectedPath.name = txtinput;
							
							if (me.callback)
				    		{
								me.callback.execute(me.selectedPath);
				    		}
						}
						
						this.close();
					},
					scope: this
				}, 
				{
				    xtype: 'button',
				    text: IRm$/*resources*/.r1('B_CANCEL'),
				    handler: function() {
						this.close();
					},
					scope: this
				}
	        ]
	    });

        IG$/*mainapp*/._I96/*metaSelectDlg*/.superclass.initComponent.call(this);
    },
    listeners: {
    	afterrender: function(obj, eOpt) {
    		var me = obj,
    			m_0 = me.tree.down("[name=m_0]");
    			
    		me.datagrid = me.down("[name=datagrid]");
    		me.txtItemName = me.down("[name=txtItemName]");
    		
    		me.__ini = true;
    		
//    		if (me.initpath)
//			{
//				m_0 && m_0._IHd/*navigateTree*/.call(m_0, me.initpath);
//			}
    	}
    }
});



IG$/*mainapp*/.p_g1/*pageparameter*/ = function(name, defvalue) {
	this.name = name;
	this.value = defvalue;
	this.defvalue = defvalue;
};

IG$/*mainapp*/.p_g1/*pageparameter*/.prototype = {
	set: function(value) {
		this.value = value;
	},
	get: function() {
		return this.value;
	},
	val: function(value) {
		var me = this;
		if (value)
		{
			me.set(value);
		}
		else
		{
			return me.get();
		}
	}
};

IG$/*mainapp*/._ID0/*frameEvents*/ = function(node) {
	var me = this;
	
	me.inherit = IG$/*mainapp*/._ICe/*clEvents*/;
	me.inherit(node);
}

IG$/*mainapp*/._ID0/*frameEvents*/.prototype = new IG$/*mainapp*/._ICe/*clEvents*/();

IG$/*mainapp*/._ID1/*frameControl*/ = function(node, parentctrl, owner) {
	var me = this,
		i, j,
		ctrl,
		tnode,
		tnodes,
		pname, pvalue,
		evnodes,
		snodes;
		
	me.properties = {
		visible: "true",
		border: "0",
		bordercolor: "#e5e5e5",
		backgroundcolor: "#ffffff",
		padding: "2"
	};
	me.parentctrl = parentctrl;
	me.position = {};
	me.layout = [];
	me.pname = (parentctrl && parentctrl.name) ? parentctrl.name : null;
	// me.events = [];
	me.actionlist = {};
	me._f_columns = [];
	
	if (node)
	{
		me.type = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "type");
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "pos");
		IG$/*mainapp*/._I1f/*XGetInfo*/(me.position, tnode, "top;bottom;left;right;width;height;percentwidth;percentheight", "i");
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "Properties");
		tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
	
		for (i=0; i < tnodes.length; i++)
		{
			pname = IG$/*mainapp*/._I29/*XGetNodeName*/(tnodes[i]);
			pvalue = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
			pvalue = IG$/*mainapp*/.trim12(pvalue);
			me.properties[pname] = pvalue;
		}
		
		me.name = me.properties["Name"];
		
		//evnodes = IG$/*mainapp*/._I18/*XGetNode*/(node, "appl/events");
		
		//if (evnodes)
		//{
		//	for (i=0; i < evnodes.length; i++)
		//	{
		//		me.events.push(new IG$/*mainapp*/._ID0/*frameEvents*/(evnodes[i]));
		//	}
		//}
		
		evnodes = IG$/*mainapp*/._I18/*XGetNode*/(node, "appl/actevents");
		
		if (evnodes)
		{
			evnodes = IG$/*mainapp*/._I26/*getChildNodes*/(evnodes);
			
			for (i=0; i < evnodes.length; i++)
			{
				var actionname = IG$/*mainapp*/._I1b/*XGetAttr*/(evnodes[i], "name"),
					hnodes = IG$/*mainapp*/._I26/*getChildNodes*/(evnodes[i]);
				
				me.actionlist[actionname] = [];
				
				for (j=0; j < hnodes.length; j++)
				{
					me.actionlist[actionname].push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(hnodes[j]));
				}
			}
		}

		evnodes = IG$/*mainapp*/._I18/*XGetNode*/(node, "appl/xparam");

		if (evnodes && evnodes.hasChildNodes())
		{
			me._xparam = IG$/*mainapp*/._I17/*getFirstChild*/(evnodes);
		}
		
		evnodes = IG$/*mainapp*/._I18/*XGetNode*/(node, "appl/f_columns");
		
		if (evnodes)
		{
			me._f_columns = [];
			
			evnodes = IG$/*mainapp*/._I26/*getChildNodes*/(evnodes);
			
			for (i=0; i < evnodes.length; i++)
			{
				var p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(evnodes[i]);
				p.hidden = p.hidden == "T";
				p.sortable = p.sortable == "T";
				p.columnwidth = (p.columnwidth ? parseInt(p.columnwidth) : 0);
				me._f_columns.push(p);
			}
		}
		
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, "appl/item");
		
		if (tnode)
		{
			me.item = new IG$/*mainapp*/._IE4/*clMetaItem*/(tnode);
			owner.regReportContent.call(owner, me.item);
		}
		
		snodes = IG$/*mainapp*/._I26/*getChildNodes*/(node, "wgt");
			
		for (i=0; i < snodes.length; i++)
		{
			ctrl = new IG$/*mainapp*/._ID1/*frameControl*/(snodes[i], me, owner);
			ctrl.updatePropertyValue.call(ctrl);
			me.layout.push(ctrl);
			if (owner)
			{
				owner.controls[ctrl.name] = ctrl;
			}
		}
	}
}

IG$/*mainapp*/._ID1/*frameControl*/.prototype = {
	updatePropertyValue: function(fcreate) {
		var me = this,
			i, cprop = {}, key,
			dbase = new IG$/*mainapp*/._ICc/*clControlItem*/(null, null, 1),
			dummy = dbase.getControl(me.type.toLowerCase()),
			position = me.position,
			cs;
		
		for (i=0; i < dummy.p.length; i++)
    	{
    		cprop[dummy.p[i].name] = dummy.p[i];
    	}
    	
    	for (key in me.properties)
    	{
    		if (cprop[key])
    		{
    			value = me.properties[key];
    			
    			switch (cprop[key].datatype)
    			{
    			case "boolean":
    				me.properties[key] = (value == "true") ? true : false;
    				break;
    			case "number":
    				me.properties[key] = Number(value);
    				break;
    			}
    		}
    	}
    	
    	if (fcreate)
    	{
    		cs = IG$/*mainapp*/.getControl(me.type, false, true);
    		position.width = cs.width;
    		position.height = cs.height;
    	}
	},
	
	measurePosition: function(uctrl, prect) {
		var me = this,
			rect = {x:-1, y: -1, w: -1, h: -1},
			p = me.position,
			i;
		
		p.percentwidth = (typeof p.percentwidth == "undefined") ? null : p.percentwidth;
		p.percentheight = (typeof p.percentheight == "undefined") ? null : p.percentheight;
		p.width = (typeof p.width == "undefined") ? null : p.width;
		p.height = (typeof p.height == "undefined") ? null : p.height;
		p.top = (typeof p.top == "undefined") ? null : p.top;
		p.left = (typeof p.left == "undefined") ? null : p.left;
		p.right = (typeof p.right == "undefined") ? null : p.right;
		p.bottom = (typeof p.bottom == "undefined") ? null : p.bottom;
		
		if (p.left != null && p.right != null)
		{
			rect.x = p.left;
			rect.w = prect.w - p.left - p.right;
		}
		else if (p.left != null)
		{
			rect.x = p.left;
			rect.w = (p.percentwidth != null) ? (prect.w - p.left) * p.percentwidth * 0.01 : 
					 (p.width != null) ? p.width : -1;
		}
		else if (p.right != null)
		{
			rect.w = (p.percentwidth != null) ? (prect.w - p.right) * p.percentwidth * 0.01 :
					 (p.width != null) ? p.width : -1;
			rect.x = prect.w - rect.w;
		}
		
		if (p.top != null && p.bottom != null)
		{
			rect.y = p.top;
			rect.h = prect.h - p.top - p.bottom;
		}
		else if (p.top != null)
		{
			rect.y = p.top;
			rect.h = (p.percentheight != null) ? (prect.h - p.top) * p.percentheight * 0.01 : 
					 (p.height != null) ? p.height : -1;
		}
		else if (p.right != null)
		{
			rect.h = (p.percentheight != null) ? (prect.h - p.right) * p.percentheight * 0.01 :
					 (p.height != null) ? p.height : -1;
			rect.y = prect.h - rect.h;
		}
		
		return rect;
	},
	
	getXML: function() {
		var me = this,
			key,
			actionlist = me.actionlist,
			i,
			r = "<wgt type='" + me.type + "'>"
			  + "<pos " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.position, "top;bottom;left;right;width;height;percentwidth;percentheight", "i")
			  + "/>"
			  + "<Properties>";
		
		for (key in me.properties)
		{
			r += "<" + key + "><![CDATA[" + me.properties[key] + "]]></" + key + ">";
		}
	
		r += "</Properties>";
		r += "<appl>";
		if (me.item && me.item.uid)
		{
			r += "<item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.item, "uid;description;memo;name;pid;type;updatedate", "s") + "/>";
		}
		
		//r += "<events>";
		//
		//for (i=0; i < me.events.length; i++)
		//{
		//	r += me.events.getXML();
		//}
		//
		//r += "</events>";
		
		r += "<actevents>";
		for (key in me.actionlist)
		{
			if (me.actionlist[key])
			{
				r += "<act name='" + key + "'>";
				for (i=0; i < me.actionlist[key].length; i++)
				{
					r += "<actitem" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.actionlist[key][i], "name;uid", "s") + "/>";
				}
				r += "</act>";
			}
		}
		r += "</actevents>";
		
		if (me._f_columns)
		{
			r += "<f_columns>";
			for (i=0; i < me._f_columns.length; i++)
			{
				r += "<column" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me._f_columns[i], "name;kname", "s") +
					IG$/*mainapp*/._I20/*XUpdateInfo*/(me._f_columns[i], "hidden;sortable", "b") + 
					IG$/*mainapp*/._I20/*XUpdateInfo*/(me._f_columns[i], "columnwidth", "i") + "/>";
			}
			r += "</f_columns>";
		}
		
		if (me._xparam)
		{
			r += "<xparam>";
			r += IG$/*mainapp*/._I25/*toXMLString*/(me._xparam);
			r += "</xparam>";
		}
		r += "</appl>";
		
		if (me.layout && me.layout.length > 0)
		{
			for (i=0; i < me.layout.length; i++)
			{
				r += me.layout[i].getXML();
			}
		}
		
		r += "</wgt>";
		
		return r;
	}
}

IG$/*mainapp*/.cdxml = function(xdoc) {
	var me = this;
	
	me.xdoc = xdoc;
}

IG$/*mainapp*/.cdxml.prototype = {
	regReportContent: function(item) {
		var me = this,
			i;
			
		for (i=0; i < me.dashboardreport.length; i++)
		{
			if (me.dashboardreport[i].uid == item.uid)
			{
				return;
			}
		}
		
		me.dashboardreport.push(item);
	},
		
	parseContent: function(pobj) {
		var me = this,
			rootnode,
			tnode,
			snodes,
			i, j, bexist, appdata,
			ctrl,
			n, v,
			pvar;
		
		rootnode = IG$/*mainapp*/._I18/*XGetNode*/(me.xdoc, "/smsg/item");
		
		me.tmpl = null;
		
		me.pobj = pobj;
		me.controls = {};
		me.eventseq = 0;
		me.events = {};
		me._l21/*applicationactions*/ = {onload: null, ontimer: null};
		me._l22/*activescript*/ = "";
		me._l23/*functionnames*/ = [];
		me.dashboardreport = [];
		me.page_params = [];
		me.page_param_map = {};
		me.rcs = [];
		
		if (rootnode)
		{
			me.item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(rootnode);
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rootnode, "tmpl");
			
			if (tnode)
			{
				me.tmpl = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			}
			
			me.layout = [];
		
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rootnode, "Layout");
			
			if (tnode != null)
			{
				pvar = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
				me.autowidth = pvar.autowidth == "F" ? false : true;
				me.autoheight = pvar.autoheight == "F" ? false : true;
				me.vscroll = pvar.vscroll == "T";
				me.hscroll = pvar.hscroll == "T";
				me.width = pvar.width ? parseInt(pvar.width) : 800;
				me.height = pvar.height ? parseInt(pvar.height) : 600;
				me.minwidth = pvar.minwidth ? parseInt(pvar.minwidth) : 500;
				me.minheight = pvar.minheight ? parseInt(pvar.minheight) : 500;
				me.cls = pvar.cls || "";
				me.background = pvar.background || "";
				
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode, "wgt");
				
				for (i=0; i < snodes.length; i++)
				{
					ctrl = new IG$/*mainapp*/._ID1/*frameControl*/(snodes[i], null, me);
					ctrl.updatePropertyValue.call(ctrl);
					me.layout.push(ctrl);
					me.controls[ctrl.name] = ctrl;
				}
			}
			
			//tnode = IG$/*mainapp*/._I18/*XGetNode*/(rootnode, "events/OnLoadEvents");
			//
			//if (tnode)
			//{
			//	me.OnLoadEvents = [];
			//	snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			//	for (i=0; i < snodes.length; i++)
			//	{
			//		me.OnLoadEvents.push(new IG$/*mainapp*/._ID0/*frameEvents*/(snodes[i]));
			//	}
			//}
			//
			//tnode = IG$/*mainapp*/._I18/*XGetNode*/(rootnode, "events/TimerEvents");
			//
			//if (tnode)
			//{
			//	me.TimerEvents = [];
			//	snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			//	for (i=0; i < snodes.length; i++)
			//	{
			//		me.TimerEvents.push(new IG$/*mainapp*/._ID0/*frameEvents*/(snodes[i]));
			//	}
			//}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rootnode, "ActiveScript");
			
			if (tnode)
			{
				me._l22/*activescript*/ = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rootnode, "ConditionScript");
			
			if (tnode)
			{
				me._cs/*conditionscript*/ = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
			}
			
			pobj && me._l24/*parseScriptFunction*/();
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rootnode, "page_params");
			
			if (tnode)
			{
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < snodes.length; i++)
				{
					n = IG$/*mainapp*/._I1a/*getSubNodeText*/(snodes[i], "name");
					v = IG$/*mainapp*/._I1a/*getSubNodeText*/(snodes[i], "value");
					
					pvar = new IG$/*mainapp*/.p_g1/*pageparameter*/(n, v);
					pvar.type = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[i], "type") || "var";
					pvar.ctrltype = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[i], "ctrltype");
					me.page_params.push(pvar);
					me.page_param_map[pvar.name] = pvar;
				}
				
				if (me.page_param_map["userid"])
				{
					me.page_param_map["userid"].val(IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.u1/*userid*/);
				}
				else
				{
					pvar = new IG$/*mainapp*/.p_g1/*pageparameter*/("userid", IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.u1/*userid*/);
					pvar.type = "var";
					me.page_params.push(pvar);
					me.page_param_map[pvar.name] = pvar;
				}
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rootnode, "actevents");
			
			if (tnode)
			{
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				var evname,
					evdesc,
					anodes,
					actions,
					mkey;
				
				for (i=0; i < snodes.length; i++)
				{
					evname = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[i], "name");
					evdesc = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[i], "desc");
					
					if (evname.indexOf("_") > -1)
					{
						mkey = evname.substring(evname.indexOf("_") + 1);
						if (mkey != "" && mkey.length > 0)
						{
							me.eventseq = Math.max(me.eventseq, Number(mkey) + 1);
						}
					}
					
					actions = [];
					
					anodes = IG$/*mainapp*/._I26/*getChildNodes*/(snodes[i]);
					
					for (j=0; j < anodes.length; j++)
					{
						actions.push(new IG$/*mainapp*/._ID0/*frameEvents*/(anodes[j]));
					}
					
					me.events[evname] = {name: evname, desc: evdesc, actionlist: actions};
				}
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rootnode, "appl_acts");
			
			if (tnode)
			{
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				
				for (i=0; i < snodes.length; i++)
				{
					var actname = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[i], "name"),
						hnodes = IG$/*mainapp*/._I26/*getChildNodes*/(snodes[i]);
						
					me._l21/*applicationactions*/[actname] = [];
					
					for (j=0; j < hnodes.length; j++)
					{
						me._l21/*applicationactions*/[actname].push(IG$/*mainapp*/._I1c/*XGetAttrProp*/(hnodes[j]));
					}
				}
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rootnode, "applData");
			
			if (tnode)
			{
				me.applicationdata = [];
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				
				for (i=0; i < snodes.length; i++)
				{
					bexist = false;
					appdata = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
					
					for (j=0; j < me.applicationdata.length; j++)
					{
						if (me.applicationdata[j].uid == appdata.uid)
						{
							bexist = true;
							break;
						}
					}
					
					if (bexist == false)
					{
						me.applicationdata.push(appdata);
					}
				}
			}
		}
	},
	
	_l24/*parseScriptFunction*/: function() {
		var me = this,
			uid = me.item.uid,
			txtscript = Base64.decode(me._l22/*activescript*/);
    	
		me.m_d$$mj/*maindynscript*/ = new IG$/*mainapp*/.d$$mj/*dynscript*/('cls_' + uid.replace("-", "_"));
		me.m_d$$mj/*maindynscript*/._l5/*loadScript*/.call(me.m_d$$mj/*maindynscript*/, txtscript);
		me.m_d$$mj/*maindynscript*/._l6/*preparePrototype*/.call(me.m_d$$mj/*maindynscript*/, me.controls, me.pobj);
		
		me._l23/*functionnames*/ = me.m_d$$mj/*maindynscript*/._l8/*getFunctionList*/.call(me.m_d$$mj/*maindynscript*/);
	},
	
	getLayout: function() {
		var me = this,
			i,
			r = ["<Layout"];
		
		r.push(IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "autowidth;autoheight;vscroll;hscroll", "b"));
		r.push(IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "width;height;minwidth;minheight", "i"));
		r.push(IG$/*mainapp*/._I20/*XUpdateInfo*/(me, "cls;background", "s"));
			
		r.push(">");
		if (me.layout && me.layout.length > 0)
		{
			for (i=0; i < me.layout.length; i++)
			{
				r.push(me.layout[i].getXML());
			}
		}
		r.push("</Layout>");
		
		return r.join("");
	},
	
	setLayout: function(value) {
		var me = this,
			xdoc = IG$/*mainapp*/._I13/*loadXML*/(value),
			r = false,
			tnode,
			snodes, i,
			ctrl;
		
		if (xdoc)
		{
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/Layout");
			
			if (tnode)
			{
				r = true;
				snodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode, "wgt");
				me.layout = [];
				me.controls = {};
				
				for (i=0; i < snodes.length; i++)
				{
					ctrl = new IG$/*mainapp*/._ID1/*frameControl*/(snodes[i], null, me);
					ctrl.updatePropertyValue.call(ctrl);
					me.layout.push(ctrl);
					me.controls[ctrl.name] = ctrl;
				}
			}
		}
		
		return r;
	},
	
	getXML: function() {
		var me = this,
			i,
			events = me.events,
			key,
			r = ["<smsg><item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.item, "uid;name;nodepath;type", "s") + ">"];
		
		if (me.tmpl && me.tmpl.uid)
		{
			r.push("<tmpl" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.tmpl, "uid;name;nodepath;type", "s") + "/>");
		}
		
		r.push(me.getLayout());
		
		//r += "<events>";
		//if (me.OnLoadEvents)
		//{
		//	r += "<OnLoadEvents>";
		//	for (i=0; i < me.OnLoadEvents.length; i++)
		//	{
		//		me.OnLoadEvents[i].getXML();
		//	}
		//	r += "</OnLoadEvents>";
		//}
		//if (me.TimerEvents)
		//{
		//	r += "<TimerEvents>";
		//	for (i=0; i < me.TimerEvents.length; i++)
		//	{
		//		me.TimerEvents[i].getXML();
		//	}
		//	r += "</TimerEvents>";
		//}
		//r += "</Events>";
		
		r.push("<ActiveScript><![CDATA[" + me._l22/*activescript*/ + "]]></ActiveScript>");
		
		r.push("<actevents>");
		
		$.each(events, function(index, key) {
			var i,
				actions = events[index];
				
			r.push("<actevent name='" + index + "' desc='" + actions.desc + "'>");
			
			for (i=0; i < actions.actionlist.length; i++)
			{
				r.push(actions.actionlist[i].getXML());
			}
			r.push("</actevent>");
		});
		
		r.push("</actevents>");
		
		r.push("<appl_acts>");
		
		for (key in me._l21/*applicationactions*/)
		{
			if (me._l21/*applicationactions*/[key])
			{
				r.push("<act name='" + key + "'>");
				
				if (me._l21/*applicationactions*/[key])
				{
					for (i=0; i < me._l21/*applicationactions*/[key].length; i++)
					{
						r.push("<actitem" + IG$/*mainapp*/._I20/*XUpdateInfo*/(me._l21/*applicationactions*/[key][i], "name;uid", "s") + "/>");
					}
				}
				
				r.push("</act>");
			}
		}
		
		r.push("</appl_acts>");
		
		r.push("<page_params>");
		
		for (i=0; i < me.page_params.length; i++)
		{
			r.push("<param type='" + (me.page_params[i].type || "") + "' ctrltype='" + (me.page_params[i].ctrltype || "") + "'>");
			r.push("<name><![CDATA[" + me.page_params[i].name + "]]></name>");
			r.push("<value><![CDATA[" + (me.page_params[i].defvalue || "") + "]]></value>");
			r.push("</param>");
		}
		
		r.push("</page_params>");
		
		r.push("<applData>");
		
		if (me.applicationdata)
		{
			for (i=0; i < me.applicationdata.length; i++)
			{
				r.push("<item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(me.applicationdata[i], "nodepath;lastupdatedate;memo;name;type;uid", "s") + "/>");
			}
		}
		
		r.push("</applData>");
		
		r.push("</item></smsg>");
		
		return r.join("");
	}
}

IG$/*mainapp*/._maa/*pluginresults*/ = function(xdoc) {
	this.r1/*resultmap*/ = {};
	if (xdoc)
	{
		this.p1/*parse*/(xdoc);
	}
}

IG$/*mainapp*/._maa/*pluginresults*/.prototype = {
	p1/*parse*/: function(xdoc) {
		var me = this,
			tnode,
			tnodes,
			m,
			i, j, k,
			ismapped,
			dnode, dnodes, dsnode,
			drows, mrow, msrow;
			
		if (xdoc)
		{		
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/output");
			
			tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null);
			
			if (tnodes)
			{
				for (i=0; i < tnodes.length; i++)
				{
					n = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name");
					t = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "type");
					
					if (t == "dataset")
					{
						dnode = IG$/*mainapp*/._I18/*XGetNode*/(tnodes[i], "dataset");
						ismapped = IG$/*mainapp*/._I1b/*XGetAttr*/(dnode, "ismapped");
						ismapped = ismapped == "T";
						v = {
							ismapped: ismapped,
							colcount: Number(IG$/*mainapp*/._I1b/*XGetAttr*/(dnode, "cols")),
							dbcols: Number(IG$/*mainapp*/._I1b/*XGetAttr*/(dnode, "cols")),
							cols: [],
							data: []
						};
						
						dsnode = IG$/*mainapp*/._I18/*XGetNode*/(dnode, "cols");
						dnodes = IG$/*mainapp*/._I26/*getChildNodes*/(dsnode);
						for (j=0; j < dnodes.length; j++)
						{
							v.cols.push({
								name: IG$/*mainapp*/._I1b/*XGetAttr*/(dnodes[j], "name")
							});
						}
						
						dsnode = IG$/*mainapp*/._I18/*XGetNode*/(dnode, "data");
						drows = IG$/*mainapp*/._I24/*getTextContent*/(dsnode).split("\n");
						for (j=0; j < drows.length; j++)
						{
							if (drows[j])
							{
								if (ismapped)
								{
									mrow = {};
									msrow = drows[j].split("\t");
									for (k=0; k < v.cols.length; k++)
									{
										mrow[v.cols[k].name] = msrow[k];
									}
									
									v.data.push(mrow);
								}
								else
								{
									v.data.push(drows[j].split("\t"));
								}
							}
						}
					}
					else
					{
						v = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
					}
					
					me.r1/*resultmap*/[n] = {
						v: v,
						t: t
					};
				}
			}
		}
	}
};
IG$/*mainapp*/._I8f/*prepareCustomMenu*/ = function(record) {
	var me = this,
		menu = this.customMenu,
		data = record.data,
		typename = data.type.toLowerCase(),
		itemname = data.name,
		itemaddr = data.nodepath || "",
		itemuid = data.uid,
		itemtype = data.type,
		writable = (data.writable == "T" || data.manage == "T") ? true : false,
		manageable = (data.manage == "T") ? true : false,
		issubcube = data.issubcube,
		isrfolder = data.isrfolder,
		isbo = data.isbo,
		cubemenu,
		wobj,
		
		mvisible = false;
		
    menu.removeAll();
    
    cubemenu = [
//    	{
//	    	text: IRm$/*resources*/.r1("L_ROLAP_CUBE_MODEL"),
//	    	handler: function() {
//	    		this._I90/*createMetaObject*/.call(this, "CubeModel", itemuid, itemaddr, record);
//   	   		},
//   	   		scope: this
//	    },
	    {
	    	text: IRm$/*resources*/.r1("L_EXCEL_LOADER"),
	    	iconCls: "icon-excel",
	    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_c_lc"],
	    	handler: function() {
	    		this._I90/*createMetaObject*/.call(this, "DataCube", itemuid, itemaddr, record);
   	   		},
   	   		scope: this
	    },
	    "-",
	    {
			text: IRm$/*resources*/.r1("L_MENU_DB_MODEL"),
			iconCls: "icon-cubemodel",
			hidden: ig$/*appoption*/.fm/*features*/["ig_n_dbm"],
			handler: function() {
				this._I90/*createMetaObject*/.call(this, "CubeModel", itemuid, itemaddr, record);
			},
			scope: this
		},
	    {
	    	text: IRm$/*resources*/.r1("L_ROLAP_CUBE"),
	    	iconCls: "icon-cube",
	    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_c_rc"],
	    	handler: function() {
	    		this._I90/*createMetaObject*/.call(this, "Cube", itemuid, itemaddr, record);
   	   		},
   	   		scope: this
	    },
	    "-",
	    {
			text: IRm$/*resources*/.r1("L_NOSQL_CUBE"),
			iconCls: "icon-nosql",
			hidden: ig$/*appoption*/.fm/*features*/["ig_n_c_b"],
	    	handler: function() {
	    		this._I90/*createMetaObject*/.call(this, "NoSQL", itemuid, itemaddr, record);
   	   		},
   	   		scope: this
	    },
	    {
			text: IRm$/*resources*/.r1("L_SQL_CUBE"),
			iconCls: "icon-sqlcube",
			hidden: ig$/*appoption*/.fm/*features*/["ig_n_c_sql"],
	    	handler: function() {
	    		this._I90/*createMetaObject*/.call(this, "SQLCube", itemuid, itemaddr, record);
   	   		},
   	   		scope: this
		},
//		{
//	    	text: IRm$/*resources*/.r1("L_MOLAP_CUBE"),
//	    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_c_m"],
//	    	handler: function() {
//	    		this._I90/*createMetaObject*/.call(this, "MCube", itemuid, itemaddr, record);
//   	   		},
//   	   		scope: this
//	    },
	    {
			text: IRm$/*resources*/.r1("L_MDB_CUBE"),
			iconCls: "icon-mdbcube",
			hidden: ig$/*appoption*/.fm/*features*/["ig_n_c_msa"],
	    	handler: function() {
	    		this._I90/*createMetaObject*/.call(this, "MDBCube", itemuid, itemaddr, record);
   	   		},
   	   		scope: this
		}
   	];
	
    switch (typename)
	{
	case "root":
		wobj = {
	    	text: IRm$/*resources*/.r1("L_WORKSPACE"),
	    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_wks"],
	    	handler: function() {
	   	   		this._I90/*createMetaObject*/.call(this, "Workspace", itemuid, itemaddr, record);
   	   		},
   	   		scope: this
	    };
	    
	    if (!wobj.hidden)
	    {
			menu.add(wobj);
	    	mvisible = true;
	    }
		break;
	case "workspace":
	case "folder":
	case "rfolder":
	case "javapackage":
		if (typename == "javapackage")
		{
			isbo = typename;
		}
		var smenu;
		if (isbo)
		{
			smenu = [
			    {
			    	text: IRm$/*resources*/.r1("B_FOLDER"),
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
			    	handler: function() {
			    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    },
			    {
			    	text: "Make JavaClass",
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_jc"],
			    	handler: function() {
			   	   		this._I90/*createMetaObject*/.call(this, "JavaClass", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    }
			];
		}
		else if (issubcube == null)
		{
			smenu = [
				{
			    	text: IRm$/*resources*/.r1("B_FOLDER"),
			    	iconCls: "icon-folder",
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
			    	handler: function() {
			    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    },
			    {
					text: IRm$/*resources*/.r1("L_MENU_CUBE_WORK"),
					hidden: ig$/*appoption*/.fm/*features*/["ig_n_cb"],
					menu: cubemenu
				},
				{
			    	text: IRm$/*resources*/.r1("L_REPORT"),
			    	iconCls: "icon-report",
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_rpt"],
			    	handler: function() {
			   	   		this._I90/*createMetaObject*/.call(this, "Report", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    },
			    {
			    	text: IRm$/*resources*/.r1("L_UIPAGE"),
			    	hidden: true,
			    	handler: function() {
			   	   		this._I90/*createMetaObject*/.call(this, "UIPage", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    },
			    {
			    	text: IRm$/*resources*/.r1("L_DASHBOARD"),
			    	iconCls: "icon-dashboard",
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_dbd"],
			    	handler: function() {
		   	   	   		this._I90/*createMetaObject*/.call(this, "Dashboard", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    },
//			    {
//					text: IRm$/*resources*/.r1("L_COMPOSITEREPORT"),
//					hidden: ig$/*appoption*/.fm/*features*/["ig_n_crpt"],
//					handler: function() {
//						this._I90/*createMetaObject*/.call(this, "CompositeReport", itemuid, itemaddr, record);
//					},
//					scope: this
//				},
				{
					text: IRm$/*resources*/.r1("L_HD_BPROC"),
					hidden: IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.l4 == true || ig$/*appoption*/.fm/*features*/["ig_n_hb"],
			    	handler: function() {
			    		this._I90/*createMetaObject*/.call(this, "BigData", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
				}
			];
		}
		else if (issubcube == "cube" || issubcube == "mcube" || issubcube == "nosql" || issubcube == "mdbcube" || issubcube == "datacube" || issubcube == "sqlcube")
		{
			smenu = [
			    {
			    	text: IRm$/*resources*/.r1("B_FOLDER"),
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
			    	handler: function() {
			    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    },
			    {
			    	text: IRm$/*resources*/.r1("L_CUSTOM_METRIC"),
			    	// hidden: (issubcube == "mcube") ? true : false,
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_cm"],
			    	handler: function() {
			    		this._I90/*createMetaObject*/.call(this, "CustomMetric", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    }, 
			    {
			    	text: IRm$/*resources*/.r1("L_HIERARCHY"),
			    	// hidden: (issubcube == "mcube") ? true : false,
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_hm"],
			    	handler: function() {
			    		this._I90/*createMetaObject*/.call(this, "Hierarchy", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    },
			    {
			    	text: IRm$/*resources*/.r1("L_DATE_METRIC"),
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_dm"],
			    	// hidden: (issubcube == "mcube") ? true : false,
			    	handler: function() {
			    		this._I90/*createMetaObject*/.call(this, "DateMetric", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    }, 
			    {
			    	text: IRm$/*resources*/.r1("L_MEASURE"),
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_ms"],
			    	handler: function() {
			   	   		this._I90/*createMetaObject*/.call(this, "Measure", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    }, 
			    {
			    	text: IRm$/*resources*/.r1("L_FORMULA"),
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_fm"],
			    	// hidden: (issubcube == "mcube") ? true : false,
			    	handler: function() {
		   	   	   		this._I90/*createMetaObject*/.call(this, "FormulaMeasure", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    },
			    {
			    	text: IRm$/*resources*/.r1("L_CHART_MEASURE"),
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_cms"],
			    	handler: function() {
		   	   	   		this._I90/*createMetaObject*/.call(this, "ChartMeasure", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    },
			    {
			    	text: IRm$/*resources*/.r1("L_UDG"),
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_udg"],
			    	handler: function() {
			   	   		this._I90/*createMetaObject*/.call(this, "GroupField", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    },
			    {
			    	text: IRm$/*resources*/.r1("L_GROUP_MEASURE"),
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_gm"],
			    	hidden: (issubcube == "mcube" ? false : true),
			    	handler: function() {
			   	   		this._I90/*createMetaObject*/.call(this, "MeasureGroup", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    }
			];
		}
		else if (isrfolder)
		{
			smenu = [
			    {
			    	text: IRm$/*resources*/.r1("B_FOLDER"),
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
			    	handler: function() {
			    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    },
			    {
			    	text: "Make RScript",
			    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_r"],
			    	handler: function() {
			   	   		this._I90/*createMetaObject*/.call(this, "RScript", itemuid, itemaddr, record);
		   	   		},
		   	   		scope: this
			    }
			];
		}
		
		if (writable == true)
		{
    		menu.add({
    			text: IRm$/*resources*/.r1("L_MAKEITEM_G"),
    			hidden: ig$/*appoption*/.fm/*features*/["ig_n_f"],
    			menu: smenu,
    			scope: this
    		});
		}
		
		if (IG$/*mainapp*/._I83/*dlgLogin*/.jS2/*isAdmin*/ == true)
		{
			menu.add({
				text: IRm$/*resources*/.r1("L_EXPORT_META"),
				hidden: ig$/*appoption*/.fm/*features*/["ig_n_exp"],
				handler: function() {
					this._I93/*exportMeta*/.call(this, {
    					uid: itemuid,
    					name: itemname,
    					nodepath: itemaddr,
    					type: typename
    				});
				},
				scope: this
			});
		}
		
		if (typename != "folder" && typename != "workspace" && typename != "rfolder" && typename != "javapackage")
		{
    		menu.add({
    			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
    			handler: function() {
	    			if (this.mainPanel)
		    		{
		    			this.mainPanel.m1$7/*navigateApp*/.call(this.mainPanel, itemuid, typename, itemname, itemaddr, true, writable);
		    		}
    			},
    			scope: this
    		});
    		
    		menu.add({
    			text: IRm$/*resources*/.r1("L_COPY_ITEM", itemname),
    			hidden: ig$/*appoption*/.fm/*features*/["ig_n_cp"],
    			handler: function() {
    				IG$/*mainapp*/.cb/*clipboard*/ = {
    					uid: itemuid,
    					name: itemname,
    					nodepath: itemaddr,
    					type: typename
    				};
    			},
    			scope: this
    		});
    	}
    	
    	if (typename == "folder" && (writable == true || manageable == true) && IG$/*mainapp*/.cb/*clipboard*/ != null)
    	{
    		menu.add({
    			text: IRm$/*resources*/.r1("L_PASTE_ITEM"),
    			handler: function() {
    				this._II7/*pasteMetaObject*/(record);
    			},
    			scope: this
    		});
    	}
		mvisible = true;
		break;
	case "cube":
		if (data.leaf == false && (writable == true || manageable == true))
		{
			menu.add({
		    	text: IRm$/*resources*/.r1("B_FOLDER"),
		    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
		    	handler: function() {
		    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
	   	   		},
	   	   		scope: this
		    });
		}
		
		if (data.leaf == true)
		{
    		menu.add({
    			text: IRm$/*resources*/.r1("L_BROWSE_ITEM", itemname),
    			handler: function() {
    				var rc = record;
    				rc.data.leaf = false;
    				rc.dirty = true;
    				rc.expand();
    			},
    			scope: this
    		});
		}
		
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
    			if (this.mainPanel)
	    		{
	    			this.mainPanel.m1$7/*navigateApp*/.call(this.mainPanel, itemuid, typename, itemname, itemaddr, true, writable);
	    		}
			},
			scope: this
		});
		mvisible = true;
		break;
	case "mcube":
		if (data.leaf == false && (writable == true || manageable == true))
		{
			menu.add({
		    	text: IRm$/*resources*/.r1("B_FOLDER"),
		    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
		    	handler: function() {
		    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
	   	   		},
	   	   		scope: this
		    });
		}
		
		if (data.leaf == true)
		{
    		menu.add({
    			text: IRm$/*resources*/.r1("L_BROWSE_ITEM", itemname),
    			handler: function() {
    				var rc = record;
    				rc.data.leaf = false;
    				rc.dirty = true;
    				rc.expand();
    			},
    			scope: this
    		});
		}
		
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
    			if (this.mainPanel)
	    		{
	    			this.mainPanel.m1$7/*navigateApp*/.call(this.mainPanel, itemuid, typename, itemname, itemaddr, true, writable);
	    		}
			},
			scope: this
		});
		mvisible = true;
		break;
	case "datacube":
		if (data.leaf == false && (writable == true || manageable == true))
		{
			menu.add({
		    	text: IRm$/*resources*/.r1("B_FOLDER"),
		    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
		    	handler: function() {
		    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
	   	   		},
	   	   		scope: this
		    });
		}
		
		if (data.leaf == true)
		{
    		menu.add({
    			text: IRm$/*resources*/.r1("L_BROWSE_ITEM", itemname),
    			handler: function() {
    				var rc = record;
    				rc.data.leaf = false;
    				rc.dirty = true;
    				rc.expand();
    			},
    			scope: this
    		});
		}
		
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
    			if (this.mainPanel)
	    		{
	    			this.mainPanel.m1$7/*navigateApp*/.call(this.mainPanel, itemuid, typename, itemname, itemaddr, true, writable);
	    		}
			},
			scope: this
		});
		break;
	case "nosql":
		if (data.leaf == false && (writable == true || manageable == true))
		{
			menu.add({
		    	text: IRm$/*resources*/.r1("B_FOLDER"),
		    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
		    	handler: function() {
		    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
	   	   		},
	   	   		scope: this
		    });
		}
		
		if (data.leaf == true)
		{
    		menu.add({
    			text: IRm$/*resources*/.r1("L_BROWSE_ITEM", itemname),
    			handler: function() {
    				var rc = record;
    				rc.data.leaf = false;
    				rc.dirty = true;
    				rc.expand();
    			},
    			scope: this
    		});
		}
		
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
    			if (this.mainPanel)
	    		{
	    			this.mainPanel.m1$7/*navigateApp*/.call(this.mainPanel, itemuid, typename, itemname, itemaddr, true, writable);
	    		}
			},
			scope: this
		});
		break;
	case "sqlcube":
		if (data.leaf == false && (writable == true || manageable == true))
		{
			menu.add({
		    	text: IRm$/*resources*/.r1("B_FOLDER"),
		    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
		    	handler: function() {
		    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
	   	   		},
	   	   		scope: this
		    });
		}
		
		if (data.leaf == true)
		{
    		menu.add({
    			text: IRm$/*resources*/.r1("L_BROWSE_ITEM", itemname),
    			handler: function() {
    				var rc = record;
    				rc.data.leaf = false;
    				rc.dirty = true;
    				rc.expand();
    			},
    			scope: this
    		});
		}
		
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
    			if (this.mainPanel)
	    		{
	    			this.mainPanel.m1$7/*navigateApp*/.call(this.mainPanel, itemuid, typename, itemname, itemaddr, true, writable);
	    		}
			},
			scope: this
		});
		break;
	case "mdbcube":
		if (data.leaf == false && (writable == true || manageable == true))
		{
			menu.add({
		    	text: IRm$/*resources*/.r1("B_FOLDER"),
		    	hidden: ig$/*appoption*/.fm/*features*/["ig_n_f_f"],
		    	handler: function() {
		    		this._I90/*createMetaObject*/.call(this, "Folder", itemuid, itemaddr, record);
	   	   		},
	   	   		scope: this
		    });
		}
		
		if (data.leaf == true)
		{
    		menu.add({
    			text: IRm$/*resources*/.r1("L_BROWSE_ITEM", itemname),
    			handler: function() {
    				var rc = record;
    				rc.data.leaf = false;
    				rc.dirty = true;
    				rc.expand();
    			},
    			scope: this
    		});
		}
		
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
    			if (this.mainPanel)
	    		{
	    			this.mainPanel.m1$7/*navigateApp*/.call(this.mainPanel, itemuid, typename, itemname, itemaddr, true, writable);
	    		}
			},
			scope: this
		});
		break;
	case "report":
	case "compositereport":
	case "bigdata":
	case "javaclass":
	case "uipage":
	case "cubemodel":
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
    			if (this.mainPanel)
	    		{
	    			this.mainPanel.m1$7/*navigateApp*/.call(this.mainPanel, itemuid, typename, itemname, itemaddr, true, writable);
	    		}
			},
			scope: this
		});
		break;
	case "dashboard":
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
				this.mainPanel.m1$7/*navigateApp*/.call(this.mainPanel, itemuid, (writable ? "dashboardedit" : "dashboard"), itemname, itemaddr, true, true);
			},
			scope: this
		});

		mvisible = true;
		break;
	case "measure":
	case "hierarchy":
	case "measuregroup":
	case "measuregroupdimension":
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
				if (!IG$/*mainapp*/._Ie1/*measureEditor*/)
				{
					IG$/*mainapp*/.x03/*getScriptCache*/(
						ig$/*appoption*/.scmap.igcn, 
						new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
							if (IG$/*mainapp*/._Ie1/*measureEditor*/)
							{
								var pop = new IG$/*mainapp*/._Ie1/*measureEditor*/({
									uid: itemuid, name: itemname
								});
								IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
							}
							else
							{
								IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("L_ERR_L_MOD"));
							}
						})
					);
				}
				else
				{
					var pop = new IG$/*mainapp*/._Ie1/*measureEditor*/({
						uid: itemuid, name: itemname
					});
					IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
				}
			}
		});
		break;
	case "formulameasure":
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
				var pop = new IG$/*mainapp*/._Id8/*formulaEditor*/({
					uid: itemuid, name: itemname
				});
				IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
			}
		});
		break;
	case "chartmeasure":
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
				var pop = new IG$/*mainapp*/._Ie2/*cellwizard*/({
					uid: itemuid, name: itemname
				});
				IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
			}
		});
		break;
	case "datemetric":
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
//				var pop = new IG$/*mainapp*/.M$dam/*datemetric*/({
//					uid: itemuid, 
//					name: itemname
//				});
//				IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
				var typename = record.get("type").toLowerCase(),
	        		itemname = record.get("name"),
	        		itemaddr = record.get("nodepath"),
	        		itemuid = record.get("uid"),
	        		writable = (record.get("writable") == "T" || record.get("manage") == "T") ? true : false,
	        		manageable = (record.get("manage") == "T") ? true : false,
	        		issubcube = record.get("issubcube");
	    		
	    		if (me.mainPanel)
	    		{
	    			me.mainPanel.m1$7/*navigateApp*/.call(me.mainPanel, itemuid, typename, itemname, itemaddr, true, writable);
	    		}
			}
		});
		break;
	case "custommetric":
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
				if (!IG$/*mainapp*/._Ie0/*custommetric*/)
				{
					IG$/*mainapp*/.x03/*getScriptCache*/(
						ig$/*appoption*/.scmap.igcn, 
						new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
							if (IG$/*mainapp*/._Ie0/*custommetric*/)
							{
								var pop = new IG$/*mainapp*/._Ie0/*custommetric*/({
									uid: itemuid, name: itemname
								});
								IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
							}
							else
							{
								IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("L_ERR_L_MOD"));
							}
						})
					);
				}
				else
				{
					var pop = new IG$/*mainapp*/._Ie0/*custommetric*/({
						uid: itemuid, name: itemname
					});
					IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
				}
			}
		});
		break;
	case "groupfield":
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
				if (!IG$/*mainapp*/._Iae/*udgdialog*/)
				{
					IG$/*mainapp*/.x03/*getScriptCache*/(
						ig$/*appoption*/.scmap.igcn, 
						new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
							if (IG$/*mainapp*/._Ie0/*custommetric*/)
							{
								var pop = new IG$/*mainapp*/._Iae/*udgdialog*/({
									uid: itemuid, name: itemname
								});
								IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
							}
							else
							{
								IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("L_ERR_L_MOD"));
							}
						})
					);
				}
				else
				{
					var pop = new IG$/*mainapp*/._Iae/*udgdialog*/({
						uid: itemuid, name: itemname
					});
					IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
				}
			}
		});
	case "metric":
		menu.add({
			text: IRm$/*resources*/.r1((writable == true ? "L_EDIT_ITEM" : "L_VIEW_ITEM"), itemname),
			handler: function() {
				if (!IG$/*mainapp*/._Idf/*metricEditor*/)
				{
					IG$/*mainapp*/.x03/*getScriptCache*/(
						ig$/*appoption*/.scmap.igcn, 
						new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
							if (IG$/*mainapp*/._Idf/*metricEditor*/)
							{
								var pop = new IG$/*mainapp*/._Idf/*metricEditor*/({
									uid: itemuid, name: itemname
								});
								IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
							}
							else
							{
								IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("L_ERR_L_MOD"));
							}
						})
					);
				}
				else
				{
					var pop = new IG$/*mainapp*/._Idf/*metricEditor*/({
						uid: itemuid, name: itemname
					});
					IG$/*mainapp*/._I_5/*checkLogin*/(me, pop);
				}
			}
		});
		break;
	case "qicustom":
		var stype = record.get("stype"),
			pmenu;
		if (stype && window.qicustom_menus.popupmenu && window.qicustom_menus.popupmenu[stype])
		{
			pmenu = window.qicustom_menus.popupmenu[stype];
			if (pmenu.length > 0)
			{
				$.each(pmenu, function(i, pm) {
					menu.add(
						{
							text: pm.text,

							handler: function() {
								if (window.qicustom_menus.popupmenu.handler) {
									var t_m = window.qicustom_menus.menuitems[record.get("uid")];
									window.qicustom_menus.popupmenu.handler.call(window, t_m, pm);
								}
							}
						}
					);
				});
				mvisible = true;
			}
		}
		break;
	default:
		break;
	}
	
    var av = IG$/*mainapp*/._I83/*dlgLogin*/.jS2/*isAdmin*/;
    
    if (typename != "qicustom" && ((writable == true || manageable == true) && ((typename == "workspace" && av == true) || typename != "workspace")))
	{
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
		mvisible = true;
	}
    
    if (typename != "qicustom" && typename != "folder" && typename != "workspace" && (!record.isRoot || (record.isRoot && record.isRoot() == false)))
	{
		menu.add({
			text: IRm$/*resources*/.r1("L_COPY_ITEM", itemname),
			handler: function() {
				IG$/*mainapp*/.cb/*clipboard*/ = {
					uid: itemuid,
					name: itemname,
					nodepath: itemaddr,
					type: typename
				};
			},
			scope: this
		});
		
		mvisible = true;
	}
    
	if (typename != "qicustom" && manageable == true)
	{
		menu.add({
			text: IRm$/*resources*/.r1("L_OBJECT_AUTH"),
			hidden: ig$/*appoption*/.fm/*features*/["ig_n_oauth"],
			handler: function() {
				this._II0/*setObjectAuth*/.call(this, itemuid, itemtype);
			},
			scope: this
		});
		
		menu.add({
			text: IRm$/*resources*/.r1("L_REVISION"),
			hidden: ig$/*appoption*/.fm/*features*/["ig_n_rev"],
			handler: function() {
				IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_REVISION", itemuid);
			},
			scope: this
		});
		mvisible = true;
	}
	
	if (typename != "qicustom" && (typename == "folder" || typename == "workspace" || data.leaf == false))
	{
		menu.add(
			{
				text: IRm$/*resources*/.r1("L_REFRESH"),
				handler: function() {
					this._I92/*refreshNode*/(record);
				},
				scope: this
			}
		);
	}
	
	if (typename != "qicustom" && (manageable  == true && typename == "workspace"))
	{
		menu.add(
			{
				text: IRm$/*resources*/.r1("L_MGR_FD"),
				hidden: ig$/*appoption*/.fm/*features*/["ig_n_mgf"],
				handler: function() {
					this._II8/*mangaeFolder*/(record);
				},
				scope: this
			}
		);
	}
	
	return mvisible;
};

IG$/*mainapp*/._IHf/*deleteMetaObject*/ = function(uid, record) {
	var panel = this;
	IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, "Confirm to delete content?", function(e) {
		if (e == "yes")
		{
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(panel, 
				{
		            ack: "7",
		            payload: "<smsg><item uid='" + uid + "'/></smsg>",
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
		        }, panel, panel.r_IHf/*deleteMetaObject*/, null, record);
			req._l/*request*/();
		}
	}, panel, panel);
}

IG$/*mainapp*/.r_IHf/*deleteMetaObject*/ = function(xdoc, record) {
	var panel = this;
	// this._I92/*refreshNode*/(record);
	if (record)
	{
		// record.store.remove(record);
		panel._I92/*refreshNode*/(record.parentNode);
	}
	// record.remove(); -- sencha version 4.2.3
	panel.selectedNode = [];
	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_DELETED"), null, panel, 0, "success");
}

IG$/*mainapp*/._I90/*createMetaObject*/= function(objecttype, parentuid, parentfullpath, node, callback) {
	var me = this,
		dlgpop = new IG$/*mainapp*/._I6e/*makeItem*/({
			parentnodepath: parentfullpath,
			itemtype: objecttype,
			parentuid: parentuid,
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.r_I90/*createMetaObject*/, [node, callback])
		});
	
	IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgpop);
},

IG$/*mainapp*/.r_I90/*createMetaObject*/ = function(param) {
	var me = this,
		node = param[0],
		callback = param[1];
	
	node && me._I92/*refreshNode*/(node);
	!node && me._IQa/*refreshCurrent*/();
	
	callback && callback.execute();
};

IG$/*mainapp*/._I91/*renameMetaObject*/ = function(itemname, uid, nodepath, node) {
	var dlgpop = new IG$/*mainapp*/._Icd/*makeItemEditor*/(
		{
			itemname: itemname,
			uid: uid,
			nodepath: nodepath,
			itemtype: node.data.itemtype || node.data.type,
			memo: node.data.memo || ""
		}
	);
	dlgpop.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.r_I91/*renameMetaObject*/, node);
	
	IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgpop);
};

IG$/*mainapp*/.r_I91/*renameMetaObject*/ = function(node) {
	node && node.parentNode && this._I92/*refreshNode*/(node.parentNode);
	!node && this._IQa/*refreshCurrent*/();
};

IG$/*mainapp*/._II7/*pasteMetaObject*/ = function(record) {
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
};
    
IG$/*mainapp*/.r_II7/*pasteMetaObject*/ = function(xdoc, record) {
	this._I92/*refreshNode*/(record);
};

IG$/*mainapp*/._IQ5/*loadContent*/ = function(ltype, uid, soption) {
	var me = this,
		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
		vopt,
		cmd = "11",
		soption,
		type;
		
	switch (ltype)
	{
	case 0:
	case 5:
		cmd = "5";
		break;
	case 1:
		cmd = "5";
		uid = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.sid;
		type = "Workspace";
		break;
	case 2:
		vopt = "favorites";
		break;
	case 3:
		vopt = "recent";
		break;
	case 4:
		vopt = "trashbin";
		break;
	case 6:
		break;
	}
	
	req.init(me, 
		{
            ack: cmd,
        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid, type: (uid == "/" ? "Workspace" : type)}),
            mbody: IG$/*mainapp*/._I2e/*getItemOption*/(soption || {option: vopt})
        }, me, me.r_IQ5/*loadContent*/, null, ltype);
	req._l/*request*/();
};
IG$/*mainapp*/._Idd/*explorerTree*/ = $s.extend($s.treepanel, {
	border: 0,
	hideHeaders: true,
	
	gridupdate: null,
	rootuid: null,
	
	enableDragDrop: true,
	enableDD: true,
	useArrows: true,
	ddGroup: "_I$RD_G_1",
	
	viewConfig: {
		plugins: {
			ptype: "gridviewdragdrop",
			dragGroup: "_I$RD_G_1"
		},
		listeners: {
			drop: function(node, data, dropRec, dropPosition) {
				var dropOn = dropRec ? " " + dropPosition + " " + dropRec.get("name") : " on empty view";
			}
		}
	},
	
	_IQ3/*initData*/: function() {
		var me = this,
			root = me.getRootNode(),
			rootuid = root.get("uid");
			
		if (rootuid != "/")
		{
			// update root name
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "11",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: rootuid}),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'translate'})
		        }, me, me.r_IQ3/*initData*/, false);
			req._l/*request*/();
		}
	},
	
	r_IQ3/*initData*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			root = me.getRootNode(),
			citem;
		
		if (tnode)
		{
			citem = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			root.set("name", me.rootname || citem.name);
			root.set("subcube", citem.subcube);
			root.set("nodepath", citem.nodepath);
			root.set("type", citem.type);
			root.set("writable", citem.writable);
			root.set("manage", citem.manage);
			root.set("pnode_type", citem.pnode_type);
			root.set("pnode_uid", citem.pnode_uid);
			root.expand();
		}
	},
	
	i2/*initTree*/: function() {
		var me = this,
			rnode = me.getRootNode();
			
		me.ca/*cacheSet*/ = {};
		
		rnode.dirty = true;
		rnode.data.loaded = false;
		rnode.data.expanded = false;
		
		// rnode.removeAll(true);
		while (rnode.firstChild)
		{
			rnode.removeChild(rnode.firstChild);
		}
		
		rnode.expand();
	},
	
	columns: [
		{
            xtype: "treecolumn", //this is so we know which column will show the tree
            text: IRm$/*resources*/.r1("B_NAME"),
            flex: 2,
            sortable: false,
            dataIndex: "name",
            renderer: function(value, metadata, record) {
				return record.get("lname") || record.get("name");
			}
        }
	],
	
	_I8f/*prepareCustomMenu*/: IG$/*mainapp*/._I8f/*prepareCustomMenu*/,
	_I90/*createMetaObject*/: IG$/*mainapp*/._I90/*createMetaObject*/,
	r_I90/*createMetaObject*/: IG$/*mainapp*/.r_I90/*createMetaObject*/,
	_I91/*renameMetaObject*/: IG$/*mainapp*/._I91/*renameMetaObject*/,
	r_I91/*renameMetaObject*/: IG$/*mainapp*/.r_I91/*renameMetaObject*/,
	
	_IHf/*deleteMetaObject*/: IG$/*mainapp*/._IHf/*deleteMetaObject*/,
	r_IHf/*deleteMetaObject*/: IG$/*mainapp*/.r_IHf/*deleteMetaObject*/,
	
	_II7/*pasteMetaObject*/: IG$/*mainapp*/._II7/*pasteMetaObject*/,
	r_II7/*pasteMetaObject*/: IG$/*mainapp*/.r_II7/*pasteMetaObject*/,
	
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
	
	_I93/*exportMeta*/: function(meta) {
		var me = this;
		me.meta = meta;
		IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("T_EXP_MC"), IRm$/*resources*/.r1("T_EXP_MC_Q"), me.do__I93/*exportMeta*/, me, me);
	},
	
	do__I93/*exportMeta*/: function(dlg) {
		var panel = this,
			meta = panel.meta,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		if (meta && dlg == "yes")
		{
			panel.setLoading(true);
			
			req.init(panel, 
				{
		            ack: "5",
	                payload: "<smsg><item" + IG$/*mainapp*/._I20/*XUpdateInfo*/({
	                	uid: meta.uid, 
	                	nodepath: meta.nodepath, 
	                	name: meta.name, type: meta.type
	                }, "uid;nodepath;name;type", "s") + "/></smsg>",
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
    				{name: "payload", value: fpath},
    				{name: "mbody", value: filename},
    				{name: "_mts_", value: (IG$/*mainapp*/._g$a/*global_mts*/ || "")}
    			], 'POST');
			}
		}
	},
	
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
	
	_II0/*setObjectAuth*/: function(uid, itemtype) {
		var dlgpop;
		dlgpop = new IG$/*mainapp*/._Ic7/*objectAuth*/({uid: uid, itemtype: itemtype});
		dlgpop.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.r_II0/*setObjectAuth*/);
		
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgpop);
	},
	
	r_II0/*setObjectAuth*/: function() {
		
	},
	
	c1/*cellexpand*/: function(record) {
		var me = this,
			ca/*cacheSet*/ = me.ca/*cacheSet*/,
			uid = record.get("uid"),
			ltype = record.get("type").toLowerCase(),
			isfolder = ltype == "root" || IG$/*mainapp*/._I0e/*isFolder*/(ltype) < 5 ? true : false,
			mp,
			vmenus = ig$/*appoption*/.c_menus;
		
		if (ltype == "c_menu") {
    		var m = vmenus && vmenus.menuitems ? vmenus.menuitems[uid] : null;
    		
    		if (m && m.handler)
    		{
    			m.handler.call(window, m);
    		}
    	}
		else if (me._i3/*cellClickHandler*/)
		{
			me._i3/*cellClickHandler*/.execute(record);
		}
		else if (isfolder == false)
		{
			mp = IG$/*mainapp*/._I7d/*mainPanel*/;
			mp.m1$7/*navigateApp*/.call(mp, uid, ltype, record.get("name"), record.get("nodepath"), true, record.get("writable") == "T");
		}
		else if (ca[uid])
		{
			if (me.gridupdate && me.gridupdate.handler)
			{
				me.gridupdate.handler.call(me.gridupdate.scope, ca[uid].datas, ca[uid].item);
			}
		}
		else
		{
			if (!record.isExpanded())
			{
				// tobj.expandNode.call(tobj, record);
				record.expand();
			}
		}
	},
	
	initComponent: function() {
		var me = this,
			treeobj = me,
			uniqueid = 0;
		
		me.customMenu = new $s.menu({
        	items: []
        });
        
        me.mainPanel = IG$/*mainapp*/._I7d/*mainPanel*/;
        
		me.ca/*cacheSet*/ = {};
		
		me.root = {
		    name: IRm$/*resources*/.r1("B_WORKSPACE"),
		    expanded: true,
		    type: "Root",
		    uid: me.rootuid || "/"
		};
		
		ig$/*appoption*/.uiconfig = ig$/*appoption*/.uiconfig || {};
		ig$/*appoption*/.uiconfig.navigator = ig$/*appoption*/.uiconfig.navigator || {};
		
		$s.apply(this, {
			store: {
				xtype: "treestore",
				pobj: me,
				requestMethod: "POST",
				fields: [
					"uid", "nodepath", "description", "manage", "memo", "name", "type", "writable", "citems", "updatedate", "pid", "pnode_type", "pnode_uid", "lname"
				],
				proxy: {
					type: "ajax",
					pobj: me,
					url: ig$/*appoption*/.servlet, 
					extraParams: {
						cacheid:  "",
						refresh: "T",
					    ack: "5",
					    payload: "",
					    mbody: "", // IG$/*mainapp*/._I2e/*getItemOption*/(),
					    uniquekey: "" // IG$/*mainapp*/._I4a/*getUniqueKey*/()
					},
					actionMethods: {
						create: "POST",
						read: "POST",
						update: "POST",
						destroy: "POST"
					},
					processResponse: function(success, operation, request, response, callback, scope){
				        var me = this,
				            reader,
				            result,
				            records,
				            length,
				            mc,
				            record,
				            i;
				            
				        if (success === true) {
				            reader = me.getReader();
				            result = reader.readRecords(me.extractResponseData(response));
				            records = result.records;
				            length = records.length;
				            
				            if (result.success !== false) {
				            	var issubcube = null,
				            		isrfolder = null,
				            		isbo = null,
				            		pnode_type = operation.node ? operation.node.get("pnode_type") : null,
				            		ctype = operation.node ? operation.node.get("type") : null,
				            		dtype = pnode_type ? pnode_type.toLowerCase() : null;
				            	
				            	ctype = ctype ? ctype.toLowerCase() : null;
				            	
				            	if ((/cube|mcube|datacube|nosql|mdbcube|sqlcube/).test(dtype))
			            		{
			            			issubcube = dtype;
			            		}
				            	else if ((/cube|mcube|datacube|nosql|mdbcube|sqlcube/).test(ctype))
			            		{
			            			issubcube = dtype;
			            		}
			            		else if (dtype == "rfolder")
			            		{
			            			isrfolder = dtype;
			            		}
			            		else if (dtype == "javapackage")
			            		{
			            			isbo = dtype;
			            		}
								
								if (window.Ext)
								{
					            	mc = Ext.create("Ext.util.MixedCollection", true, function(r) {return r.getId();});
					                mc.addAll(records);
					            }
				                
				                for (i = 0; i < length; i++) {
				                	records[i].data.issubcube = issubcube;
				                	records[i].data.isrfolder = isrfolder;
				                	records[i].data.isbo = isbo;
				                	
				                	if (window.Ext)
				                	{
					                    record = mc.get(records[i].getId());
					                    
					                    if (record) {
					                        record.beginEdit();
					                        record.set(record.data);
					                        record.endEdit(true);
					                    }
					                }
				                }
				                
				                $s.apply(operation, {
				                    response: response,
				                    resultSet: result
				                });
				                
				                operation.setCompleted();
				                operation.setSuccessful();
				            } else {
				                operation.setException(result.message);
				                me.fireEvent("exception", this, response, operation);
				            }
				        } else {
				            me.setException(operation, response);
				            me.fireEvent("exception", this, response, operation);              
				        }
				
				        if (typeof callback == "function") {
				            callback.call(scope || me, operation);
				        }
				            
				        me.afterRequest(request, success);
				    },
					reader: {
						type: "xml",
						root: "smsg,item",
						pobj: me,
						record: "item",
						show_tree_items: me.show_tree_items,
						getResponseData: function(response) {
							var doc = response.responseText;
					    	var xml = IG$/*mainapp*/._I13/*loadXML*/(doc);
					    	if (!xml) {
					    		Ext.Error.raise({
					    			response: response,
					    			msg: "XML data not found in the response"
					    		});
					    	}
					    	
					    	return xml;
						},
						
						c1/*checkAuth*/: function(auth) {
							var me = this,
								p = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/,
								i,
								r = false;
							
							for (i=0; i < p.auth.length; i++)
							{
								if (auth[p.auth[i].name.toLowerCase()])
								{
									r = true;
									break;
								}
							}
							
							return r;
						},
						
						prS/*processSubFolder*/: function(child, urecord, model) {
							var me = this,
								j,
								c,
								record,
								vmenus = ig$/*appoption*/.c_menus;
								
							for (j=0; j < child.length; j++)
							{
								c = child[j];
								c.type = "c_menu";
								c.itemtype = c.type;
								c.uid = "qc_" + (me.muid++);
								c.leaf = (c.children && c.children.length > 0) ? false : true;
								
								if (c.auth && me.c1/*checkAuth*/(c.auth) == false)
								{
									continue;
								}
								
								vmenus.menuitems[c.uid] = c;
								record = new model(c, uniqueid++); //c.uid);
								record.raw = c;
								record.iconCls = c.iconCls;
								record.data.stype = c.stype;
								urecord.appendChild(record);
								
								if (c.children)
								{
									me.prS/*processSubFolder*/(c.children, record, model);
								}
								
								if (me.implicitIncludes) {
									me.readAssociated(record, c);
								}
							}
						},
						
						readRecords: function (data) {
							var i,
								me = this,
					            success,
					            recordCount,
					            records,
					            root,
					            total,
					            value,
					            model = me.model,
					            message,
					            value,
					            vmenus;
					            
					        me.rawData = data;
				        
							this.xmlData = data.responseXML;
							
							if (data.responseText)
							{
								this.xmlData = IG$/*mainapp*/._I13/*loadXML*/(data.responseText);
							}
							var node = (this.xmlData ? IG$/*mainapp*/._I18/*XGetNode*/(this.xmlData, "/smsg/item") : null),
								errorcode = (this.xmlData ? IG$/*mainapp*/._I27/*getErrorCode*/(this.xmlData) : null);
							
							var isroot = false;
							
							success = true;
				    		recordCount = 0;
				    		records = [];
							
							if (node)
							{
								records = this.extractData(node);
								recordCount = records.length;
								isroot = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "uid") == "/" ? true : false;
							}
							else
							{
								if (errorcode == "0x1300")
								{
									IG$/*mainapp*/._I89/*showLogin*/(null, 2);
								}
								recordCount = 0;
								records = [];
							}
							
							me.muid = 0;
							
							vmenus = ig$/*appoption*/.c_menus;
							
							if (isroot == true && vmenus && vmenus.menus)
							{
								vmenus.menuitems = vmenus.menuitems || {};
								
								for (i=0; i < vmenus.menus.length; i++)
								{
									value = vmenus.menus[i];
									value.type = "c_menu";
									value.uid = "qc_" + (me.muid++);
									
									if (value.auth && me.c1/*checkAuth*/(value.auth) == false)
										continue;
										
									vmenus.menuitems[value.uid] = value;
									record = new model(value, uniqueid++); // value.uid);
									record.raw = value;
									record.hidden = true;
									record.data.stype = value.stype;
									record.dirty = true;
									record.visible = false;
									records.push(record);
									
									if (value.children)
									{
										me.prS/*processSubFolder*/(value.children, record, model);
									}
									
									if (me.implicitIncludes) {
										me.readAssociated(record, value);
									}
								}
							}
							
							if (me.model.prototype.fields && me.lastFieldGeneration !== me.model.prototype.fields.generation) 
							{
					            me.buildExtractors(true);
					        }
							
							if ( this.treepanel && this.treepanel._IH9/*customParseXmlOwner*/ && this.treepanel._IHa/*customParseXmlFunc*/)
							{
								this.treepanel._IHa/*customParseXmlFunc*/.call(this.treepanel._IH9/*customParseXmlOwner*/, node);
							}
							
						    if (me.successProperty) 
						    {
						        value = me.getSuccess(data);
						        if (value === false || value === 'false') 
						        {
						            success = false;
						        }
						    }
				    
					        if (me.messageProperty) 
					        {
					            message = me.getMessage(data);
					        }
				
					        if (window.Ext && (me.readRecordsOnFailure || success)) 
					        {
					            root = typeof(data.length) != "undefined" ? data : me.getRoot(data);
					            
					            if (root) 
					            {
					                total = root.length;
					            }
					
					          if (me.totalProperty) {
					                value = parseInt(me.getTotal(data), 10);
					                if (!isNaN(value)) {
					                    total = value;
					                }
					            }
					
					           if (root) {
					                records = me.extractData(root);
					                recordCount = records.length;
					            }
					        }
					        
					        var rs = {
									total: total || recordCount,
									count: recordCount,
									records: records,
									success: success,
									message: message
								}, ret = (window.Ext) ? new Ext.data.ResultSet(rs) : rs;
				
							return ret;
						},
						
						extractData: function(root) {
							var records = [],
								values = [],
								value,
								id,
								me = this,
				
								Model = me.model,
								nodes = IG$/*mainapp*/._I26/*getChildNodes*/(root),
								i, wmenu,
								ishidden = false,
								isfolder = false,
								ltype,
								rprop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(root);
							
							for (i=0; i < nodes.length; i++)
							{
								value = me.extractValues(nodes[i]);
								// value.updatedatefm = IG$/*mainapp*/._I40/*formatDate*/(value.updatedate);
								values.push(value);
							}
							
							IG$/*mainapp*/._I10/*sortMeta*/(values);
							
							treeobj.ca/*cacheSet*/[rprop.uid] = {
								datas: values,
								item: rprop
							};
							
							if (me.pobj.gridupdate && me.pobj.gridupdate.handler)
							{
								me.pobj.gridupdate.handler.call(me.pobj.gridupdate.scope, values, rprop);
							}
							
							for (i=0; i < values.length; i++)
							{
								value = values[i];
								id = value["uid"];
								ltype = value.type.toLowerCase();
								ishidden = (!me.visibleItems || (me.visibleItems && me.visibleItems.indexOf(ltype + ";") > -1)) ? false : true;
								
								if (ishidden == false)
								{
									isfolder = IG$/*mainapp*/._I0e/*isFolder*/(ltype) < 5 ? true : false;
								}
								
								if (ishidden == false && (isfolder == true || me.show_tree_items == true))
								{
									me.processAttributes(value);
									
									record = new Model(value, uniqueid++); // id);
									record.raw = nodes[i];
									record.hidden = true;
									record.dirty = true;
									record.visible = false;
									records.push(record);
									
									if (me.implicitIncludes) {
										me.readAssociated(record, nodes[i]);
									}
								}
							}
							
							return records;
						},
						
						extractValues: function(node) {
							var values = IG$/*mainapp*/._I1c/*XGetAttrProp*/(node);
							values.ltype = values.type.toLowerCase();
							values.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(values.ltype);
							return values;
						},
						
						processAttributes : function(attr){
							if (!attr.name && !attr.uid)
							{
								attr.text = "Workspace";
							}
							else
							{
								attr.text = attr.name;

								if (attr.type)
								{
							    	var typename = attr.type.toLowerCase();
							    	var memo = attr.memo.toLowerCase(),
							    		isfolder = IG$/*mainapp*/._I0e/*isFolder*/(typename);
							    	
							    	if (isfolder < 5)
							    	{
							    		attr.leaf = false;
							    	}
							    	else if (typename == "help")
							    	{
							    		attr.leaf = true;
							    		var locale = ig$/*appoption*/.useLocale || "en_US",
							    			localetext = attr["title_" + locale];
							    		
							    		if (localetext)
							    		{
							    			attr.name = Base64.decode(localetext) || attr.name;
							    		}
							    	}
							    	else if (/(folder|workspace|datemetric)/.test(typename) == false)
							    	{
							    		attr.leaf = true;
							    		attr.allowDrag = true;
							    	}
							    	
							    	attr.iconCls = (typename == "c_menu" ? attr.iconCls : IG$/*mainapp*/._I11/*getMetaItemClass*/(typename, memo));
							    }
							}
					    }
					}
				},
				listeners: {
		            beforeload : function(store, operation){
		                var addr;
		                var node = operation.node.data,
		                	opt = {},
		                	copt = {
		                		excludeprivate: "T",
		                		subfolder: "T"
		                	};
		                
		            	if (node.root == true)
		            	{
		            		if (this.rootuid)
		            		{
		            			if (!node.uid)
		            			{
		            				operation.node.set("uid", this.rootuid);
		            			}
		            			
		            			opt.uid = this.rootuid;
		            		}
		            		else if (node.uid && node.uid.length > 0)
		            		{
		            			opt.uid = node.uid;
		            			addr = IG$/*mainapp*/._I2d/*getItemAddress*/(opt);
		            		}
		            		else
		            		{
		            			opt.uid = "/"; 
		            			addr = IG$/*mainapp*/._I2d/*getItemAddress*/(opt);
		            		}
		            		
		            		opt.type = opt.uid == "/" ? "Workspace" : null;
		            		addr = IG$/*mainapp*/._I2d/*getItemAddress*/(opt);
		            	}
		            	else
		            	{
		            		opt.uid= node.uid;
		            		addr = IG$/*mainapp*/._I2d/*getItemAddress*/(opt);
		            	}
		            	
		                this.proxy.extraParams = {
		            		cacheid:  "",
		        			refresh: "T",
		        			ack: "5",
		        			payload: addr,
		        			mbody: IG$/*mainapp*/._I2e/*getItemOption*/(copt),
		        			// data: Base64.encode("5") + "|" + Base64.encode(addr),
		        			// content: Base64.encode(IG$/*mainapp*/._I2e/*getItemOption*/(copt)),
		        			_mts_: IG$/*mainapp*/._g$a/*global_mts*/
		                };
		            },
		            load: function(store, node) {
		            	
		            }
		        }
			}
		});
		
		IG$/*mainapp*/._Idd/*explorerTree*/.superclass.initComponent.call(this);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj._IQ3/*initData*/.call(tobj);
		},
		beforeitemcontextmenu: function(view, record, item, index, e) {
			var me = this,
				mvisible = false,
				x = e.pageX,
				y = e.pageY,
				
				t = e.getTarget();
				
			e.stopEvent();
				
			mvisible = me._s1/*showcustommenu*/ ? me._s1/*showcustommenu*/.call(me, record) : me._I8f/*prepareCustomMenu*/(record);
			
			mvisible == true && me.customMenu.showBy(t);

			return false;
			// }
		},
		cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
			this.c1/*cellexpand*/(record);
		},
		celldblclick: function(tobj, td, cellindex, record, tr, rowindex, e, eopts) {
			this.c1/*cellexpand*/(record);
			return false;
		},
		itemexpand: function(node, opts) {
			var me = this;
			if (me._i4/*itemExpandHandler*/)
			{
				me._i4/*itemExpandHandler*/.execute(node, 1);
			}
		}
	}
});
IG$/*mainapp*/._Ide/*explorer_search*/ = $s.extend($s.window, {
	
	modal: true,
	resizable: false,
	width: 400,
	autoHeight: true,
	bodyPadding: 10,
	
	layout: {
		type: "vbox",
		align: "stretch"
	},
	
	_IFd/*init_f*/: function() {
		var me = this,
			sL = me._i0/*searchOption*/,
			fltsetdate = this.down("[name=fltsetdate]"),
			fltfromdate = this.down("[name=fltfromdate]"),
			flttodate = this.down("[name=flttodate]"),
			fltypegrid = this.down("[name=fltypegrid]"),
			tmap = {},
			rec,
			i,
			typelist = [
			    {name: "Workspace", type:"Workspace"},
			    {name: "Folder", type: "Folder"},
			    {name: "Cube", type: "Cube"},
			    {name: "Report", type: "Report"},
			    // ((IG$/*mainapp*/.level == 1) ? {name: "Dashboard", type: "Dashboard"},
			    {name: "Dimension", type: "Dimension"},
			    {name: "Measure", type: "Measure"}
			];
		
		fltypegrid.store.loadData(typelist);
		
		if (sL)
		{
			fltsetdate.setValue(sL.fltsetdate);
			sL.fltfromdate && fltfromdate.setValue(sL.fltfromdate.join("-"));
			sL.flttodate && flttodate.setValue(sL.flttodate.join("-"));
			
			if (sL.typelist && sL.typelist.length > 0)
			{
				for (i=0; i < sL.typelist.length; i++)
				{
					tmap[sL.typelist[i]] = 1;
				}
				
				for (i=0; i < fltypegrid.store.data.items.length; i++)
				{
					rec = fltypegrid.store.data.items[i];
					
					if (tmap[rec.get("type")] == 1)
					{
						rec.set("selected", true);
					}
				}
			}
		}
	},
	
	c1/*confirmDialog*/: function() {
		var me = this,
			sL = me._i0/*searchOption*/,
			fltsetdate = me.down("[name=fltsetdate]").getValue(),
			fltfromdate = me.down("[name=fltfromdate]").getRawValue().split("-"),
			flttodate = me.down("[name=flttodate]").getRawValue().split("-"),
			fltypegrid = me.down("[name=fltypegrid]"),
			i,
			typelist = [];
		
		for (i=0; i < fltypegrid.store.data.items.length; i++)
		{
			if (fltypegrid.store.data.items[i].get("selected") == true)
			{
				typelist.push(fltypegrid.store.data.items[i].get("type"));
			}
		}
		
		sL.fltsetdate = fltsetdate;
		sL.fltfromdate = fltfromdate;
		sL.flttodate = flttodate;
		sL.typelist = typelist;
		
		if (me.callback)
		{
			me.callback.execute();
		}
		me.close();
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1('I_EXP_SCH');
		
		$s.apply(this, {
			defaults:{bodyStyle:'padding:0px'},
			items: [
				{
		    		xtype: "fieldset",
		    		title: "Show only..",
		    		collapsible: false,
		    		autoHeight: true,
		    		collapsed: false,
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
							height: 140,
							scroll: "vertical",
							stateful: false,
							store: {
								fields: [
									"selected", "name", "type", "nodepath", "uid", "iconimg"
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
						}
		    		],
		    		listeners: {
		    			
		    		}
			    },
			    {
			    	xtype: "fieldset",
			    	title: "Date period",
			    	layout: {
			    		type: "vbox",
			    		align: "stretch"
			    	},
			    	items: [
			    		{
							xtype: "checkbox",
							name: "fltsetdate",
							fieldLabel: "",
							boxLabel: "Enable date period",
							listeners: {
								change: function(field, newvalue, oldvalue, eOpt) {
									var checked = field.getValue(),
										fltfromdate = this.down("[name=fltfromdate]"),
										flttodate = this.down("[name=flttodate]");
									
									fltfromdate.setDisabled(!checked);
									flttodate.setDisabled(!checked);
								},
								scope: this
							}
						},
						{
							xtype: "datefield",
							name: "fltfromdate",
							disabled: true,
							labelWidth: 70,
							fieldLabel: "From",
							maxValue: new Date(),
							format: "Y-m-d",
							value: new Date()
						},
						{
							xtype: "datefield",
							name: "flttodate",
							disabled: true,
							labelWidth: 70,
							fieldLabel: "To",
							maxValue: new Date(),
							format: "Y-m-d",
							value: new Date()
						}
			    	]
			    }
			],
			buttons:[
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.c1/*confirmDialog*/();
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
		
		IG$/*mainapp*/._Ide/*explorer_search*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			this._IFd/*init_f*/();
		}
	}
});
IG$/*mainapp*/._I8e/*explorer*/ = $s.extend($s.panel, {
	bodyPadding: "0 0 0 0",
	layout: "border",
	
	_i0/*searchOption*/: {},
	
	_IPe/*deleteContent*/: function(record) {
		var me = this;
		
		IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("B_CD_CHS"), function(dlg) {
			if (dlg == "yes")
			{
				me._IPf/*deleteContent*/.call(me, record);
			}
		});
	},
	
	gs/*getSelected*/: function(mg) {
		var checked = {
				items: [],
				length: 0
			},
			i;
			
		for (i=0; i < mg.store.data.items.length; i++)
		{
			rec = mg.store.data.items[i];
			if (rec.get("selected") == true)
			{
				checked.items.push(rec);
			}
		}
		
		checked.length = checked.items.length;
		
		return checked;
	},
	
	_IPf/*deleteContent*/: function(record) {
		var panel = this,
			mg = panel.down("[name=mg]"),
			address = "<smsg>",
			checked = panel.gs/*getSelected*/(mg), // mg.getSelectionModel().selected,
			rec,
			itemcnt = 0,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		if (checked.length > 0)
		{
			for (i=0; i < checked.length; i++)
			{
				rec = checked.items[i];
				if (rec.get("name") != ".." && (rec.get("manage") == "T" || rec.get("writable") == "T"))
				{
					address += "<item uid='" + rec.get("uid") + "'/>";
					itemcnt++;
				}
				else if (rec.get("name") != "..")
				{
					itemcnt = 0;
					IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("E_PV_L", rec.get("name")), panel);
					break;
				}
			}
			
			address += "</smsg>";
			
			if (itemcnt > 0)
			{
				req.init(panel, 
					{
			            ack: "30",
		                payload: address,
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "delete"})
			        }, panel, panel.r_IPe/*deleteContent*/, null, record);
				req._l/*request*/();
			}
		}
	},
	
	r_IPe/*deleteContent*/: function(xdoc, record) {
		this._IQa/*refreshCurrent*/();
	},
	
	_IHf/*deleteMetaObject*/: function(uid, record) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel, 
			{
	            ack: "7",
                payload: "<smsg><item uid='" + uid + "'/></smsg>",
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
	        }, panel, panel.r_IHf/*deleteMetaObject*/, null, record);
		req._l/*request*/();
	},
	
	r_IHf/*deleteMetaObject*/: function(xdoc, record) {
		var panel = this;
		
		if (record)
		{
			record.store.remove(record);
		}
		
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_DELETED"), null, panel, 0, "success");
	},
	
	_II0/*setObjectAuth*/: function(uid, itemtype) {
		var dlgpop;
		dlgpop = new IG$/*mainapp*/._Ic7/*objectAuth*/({uid: uid, itemtype: itemtype});
		dlgpop.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.r_II0/*setObjectAuth*/);
		
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgpop);
	},
	
	r_II0/*setObjectAuth*/: function() {
		
	},
	
	_IQ0/*processMenu*/: function(cmd, record) {
		var me = this,
			_m1 = me._m1/*openItem*/,
			mp = me.mainPanel,
			i,
			dlg;
		switch (cmd)
		{
		case "cmd_c_workspace":
			IG$/*mainapp*/._I65/*procMenuCommand*/("CMD_MAKE_WORKSPACE");
			break;
		case "cmd_c_folder":
			_m1 && me._I90/*createMetaObject*/("Folder", _m1.uid, _m1.nodepath, record);
			break;
		case "cmd_c_reports":
			_m1 && me._I90/*createMetaObject*/("Report", _m1.uid, _m1.nodepath, record);
			break;
		case "cmd_c_dbd":
			_m1 && me._I90/*createMetaObject*/("Dashboard", _m1.uid, _m1.nodepath, record);
			break;
		case "cmd_c_upload":
			_m1 && me._I90/*createMetaObject*/("DataCube", _m1.uid, _m1.nodepath, record);
			break;
		case "cmd_c_cube":
			_m1 && me._I90/*createMetaObject*/("Cube;SQLCube;NoSQL;MDBCube", _m1.uid, _m1.nodepath, record);
			break;
		case "cmd_c_dbmodel":
			_m1 && me._I90/*createMetaObject*/("CubeModel", _m1.uid, _m1.nodepath, record);
			break;
		case "cmd_c_metrics":
			record && _m1 && me._I90/*createMetaObject*/(record, _m1.uid, _m1.nodepath, record);
			break;
		case "cmd_c_workflow":
			_m1 && me._I90/*createMetaObject*/("BigData", _m1.uid, _m1.nodepath, record);
			break;
		case "cmd_c_java":
			_m1 && me._I90/*createMetaObject*/("JavaClass", _m1.uid, _m1.nodepath, record);
			break;
		case "cmd_up":
			me._gb/*breadcrumbitems*/ && me._gb/*breadcrumbitems*/.length > 1 && me._IQ5/*loadContent*/(0, me._gb/*breadcrumbitems*/[me._gb/*breadcrumbitems*/.length-2].cpath);
			break;
		case "cmd_moveto":
			me._IQ1/*moveTo*/();
			break;
		case "cmd_remove":
			me._IPe/*deleteContent*/(record);
			break;
		case "cmd_open":
			if (_m1 && mp && (/cube|datacube|sqlcube|nosql|mcube|mdbcube/).test(_m1.type.toLowerCase()))
			{
   				mp.m1$7/*navigateApp*/.call(mp, _m1.uid, _m1.type.toLowerCase(), _m1.name, _m1.nodepath, true, _m1.writable);
   			}
   			else
   			{
   				var mg = me.down("[name=mg]"),
   					model = mg.getSelectionModel(),
   					rec,
   					srec;
   					
   				for (i=0; i < mg.store.data.items.length; i++)
   				{
   					rec = mg.store.data.items[i];
   					if (model.isFocused(rec))
   					{
   						srec = rec;
   						break;
   					}
   				}
   				
   				if (srec && (/cube|datacube|sqlcube|nosql|mcube|mdbcube/).test(srec.get("type").toLowerCase()))
   				{
   					mp.m1$7/*navigateApp*/.call(mp, srec.get("uid"), srec.get("type").toLowerCase(), srec.get("name"), srec.get("nodepath"), true, srec.get("writable"));
   				}
   			}
			break;
		case "cmd_edit":
			var mg = me.down("[name=mg]"),
				model = mg.getSelectionModel(),
				rec,
				srec;
				
			for (i=0; i < mg.store.data.items.length; i++)
			{
				rec = mg.store.data.items[i];
				if (model.isFocused(rec))
				{
					srec = rec;
					break;
				}
			}
			
			srec && mp.m1$7/*navigateApp*/.call(mp, srec.get("uid"), srec.get("type").toLowerCase(), srec.get("name"), srec.get("nodepath"), true, srec.get("writable"));
			break;
		case "cmd_recover":
			me._IQ2/*trashbinAction*/(false);
			break;
		case "cmd_delete":
			me._IQ2/*trashbinAction*/(true);
			break;
		case "cmd_detail":
			break;
		}
	},
	
	_IQ1/*moveTo*/: function() {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
			visibleItems: 'workspace;folder',
			targetobj: "folder",
			u5x/*treeOptions*/: {
				cubebrowse: false,
				rootuid: null
			},
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.m__IQ1/*moveTo*/)
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	},
	
	m__IQ1/*moveTo*/: function(item) {
		var me = this;
		if (item)
		{
			IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("B_CD_MHS", item.name), function(dlg) {
				if (dlg == "yes")
				{
					me.r__IQ1/*moveTo*/.call(me, item);
				}
			});
		}
	},
	
	r__IQ1/*moveTo*/: function(item) {
		var me = this,
			mg = me.down("[name=mg]"),
			checked = me.gs/*getSelected*/(mg), // mg.getSelectionModel().selected,
			rec;
				
		if (checked && checked.length > 0)
		{
			var req,
				address = "<smsg>",
				panel = this,
				itemcnt = 0,
				iscopy = false,
				i;
			
			for (i=0; i < checked.length; i++)
			{
				rec = checked.items[i];
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
				req.init(panel, 
					{
			            ack: "11",
		                payload: address,
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: (iscopy == true ? "copy" : "move"), target: item.uid})
			        }, panel, panel.s__IQ1/*moveTo*/, null, null);
				req._l/*request*/();
			}
		}
	},
	
	s__IQ1/*moveTo*/: function(xdoc) {
		this._IQa/*refreshCurrent*/();
	},
	
	_IQ2/*trashbinAction*/: function(remove) {
		var panel=this,
			addr = "<smsg>",
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			cnt = 0,
			mg = panel.down("[name=mg]"),
			mstore = panel.gs/*getSelected*/(mg).items, // panel.down("[name=mg]").getSelectionModel().getSelection(),
			i;

		for (i=0; i < mstore.length; i++)
		{
			addr += "<item" + IG$/*mainapp*/._I20/*XUpdateInfo*/({uid: mstore[i].get("uid")}, "uid", "s") + "/>";
			cnt++;
		}
		addr += "</smsg>";
		
		if (cnt > 0)
		{
			panel.setLoading(true);
			req.init(panel, 
				{
		            ack: "11",
		        	payload: addr,
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: remove ? "remove_trash" : "recover_trash"})
		        }, panel, panel.r_IQ2/*trashbinAction*/, null, null);
			req._l/*request*/()
		};
	},
	
	r_IQ2/*trashbinAction*/: function(xdoc) {
		this._IQa/*refreshCurrent*/();
	},
	
	_IQ3/*initData*/: function() {
		var me = this,
			pl1 = me.down("[name=pl1]"),
			pl1body = $(pl1.body.dom),
			plitems,
			bi,
			ul,
			i, j,
			mitem;
			
		pl1body.empty();
		
		ig$/*appoption*/.fm/*features*/ && ig$/*appoption*/.fm/*features*/["ig_n_lst"] && pl1.hide();
		
		me._i1/*toolbarbuttons*/ = {
			items: [
//				{
//					name: "btn_share"
//				}, 
				{
					name: "btn_refresh"
				}, 
				{
					name: "btn_moveto",
					fcls: "ig_n_mv"
				},
				{
					name: "btn_remove",
					fcls: "ig_n_del"
				},
				{
					name: "btn_recover"
				},
				{
					name: "btn_open"
				},
				{
					name: "btn_up"
				},
				{
					name: "btn_delete"
				},
				{
					name: "btn_edit"
				},
				{
					name: "btn_create",
					cls: "ig_n_f"
				}
			],
			c_menu: [
			]
		};
		
		for (i=0; i < me._i1/*toolbarbuttons*/.items.length; i++)
		{
			bi = me._i1/*toolbarbuttons*/.items[i];
			bi.obj = me.down("[name=" + bi.name + "]");
			bi.obj.setVisible(false);
			bi.ltype = bi.obj.ltype;
			bi.ctype = bi.obj.ctype;
			bi.sroot = bi.obj.sroot;
			bi.fcls = bi.cls;
			
			if (bi.name == "btn_create")
			{
				for (j=0; j < bi.obj.menu.items.length; j++)
				{
					mitem = bi.obj.menu.items.items[j];
					me._i1/*toolbarbuttons*/.c_menu.push({
						obj: mitem,
						name: mitem.name,
						ltype: mitem.ltype,
						mtype: mitem.mtype,
						sroot: mitem.sroot,
						fcls: mitem.fcls
					});
				}
			}
			
			me._i1/*toolbarbuttons*/[bi.name] = bi;
		}
				
		plitems = [
			{
				text: IRm$/*resources*/.r1("L_C_PR"),
				cls: "ig_n_p",
				handler: function() {
					this._IQ5/*loadContent*/(1);
				}
			},
			{
				text: IRm$/*resources*/.r1("L_C_AL"),
				cls: "ig_n_a",
				handler: function() {
					this._IQ5/*loadContent*/(0, "/");
				}
			},
			{
				text: IRm$/*resources*/.r1("L_C_FC"),
				cls: "ig_n_fav",
				handler: function() {
					this._IQ5/*loadContent*/(2);
				}
			},
			{
				text: IRm$/*resources*/.r1("L_C_MW"),
				cls: "ig_n_mw",
				handler: function() {
					this._IQ5/*loadContent*/(5, "/");
				}
			},
			{
				text: IRm$/*resources*/.r1("L_C_LC"),
				cls: "ig_n_rcnt",
				handler: function() {
					this._IQ5/*loadContent*/(3);
				}
			},
			{
				text: IRm$/*resources*/.r1("L_C_CD"),
				cls: "ig_n_del",
				handler: function() {
					this._IQ5/*loadContent*/(4);
				}
			}
		];
		
		ul = $("<ul class='ig-navi-list'></ul>").appendTo(pl1body);
		
		$.each(plitems, function(i, pitem) {
			if (pitem.hidden != true)
			{
				var li = $("<li class='" + (pitem.cls || "") + (pitem.iconCls? " ig-navi-icon " + pitem.iconCls: "") + "'><span>" + pitem.text + "</span></li>").appendTo(ul);
				if (pitem.handler)
				{
					li.bind("click", function() {
						pitem.handler.call(me);
					});
				}
			}
		});
		
		if (me._I2/*compinit*/ && me.rendered)
		{
			me.mtree.i2/*initTree*/.call(me.mtree);
		}
	},
	
	_IQ4/*initComp*/: function() {
		var me = this;
		
		// for initialization
		if (!me._I2/*compinit*/ && me.rendered)
		{
			me.mtree.i2/*initTree*/.call(me.mtree);
			me._I2/*compinit*/ = true;
		}
		else if (!me.rendered)
		{
			me._IQc/*doInit*/ = true;
		}
	},
	
	_IQ5/*loadContent*/: IG$/*mainapp*/._IQ5/*loadContent*/,
	
	_IQ6/*isVisible*/: function(ta, ltype, ctype, cpath) {
		var me = this,
			r = ta.ltype.indexOf(ltype + ";") > -1 ? true : false,
			isroot = me._m1/*openItem*/ && me._m1/*openItem*/.nodepath == "/";
		
		if (r && ta.fcls && ig$/*appoption*/.fm/*features*/[ta.fcls])
		{
			r = false;
		}
		r = (ta.sroot == false && isroot == true) ? false : r;
		
		if (r && ta.ctype && ctype)
		{
			r = (ta.ctype.indexOf(ctype + ";") > -1) ? true : false;
		}
		
		if (r && ta.name == "btn_up" && (!cpath || (cpath && cpath.split("/").length < 2)))
		{
			r = false;
		}
		
		return r;
	},
		
	_IQ7/*isVisibleCreate*/: function(ma, ctype, mtype) {
		var me = this,
			r = ma.ltype.indexOf(ctype + ";") > -1 ? true : false,
			i, c,
			isroot = me._m1/*openItem*/ && me._m1/*openItem*/.nodepath == "/";
		
		r = r && !ig$/*appoption*/.fm/*features*/[ma.fcls] ? true : false;
		r = (isroot == true && ma.sroot == false) ? false : r;
		
		if (r == true && ma.mtype)
		{
			if (ma.mtype == "nvl" && mtype)
			{
				r = false;
			}
			else if (ma.mtype != "nvl" && !mtype)
			{
				r = false;
			}
			else if (mtype)
			{
				i = mtype.indexOf(";");
				c = (i > -1) ? mtype.substring(i+1).toLowerCase() : "formaterror";
				r = (mtype && ma.mtype.indexOf(c + ";") > -1) ? true : false;
			}
		}
		
		if (ma.name == "c_workspace" && isroot && (IG$/*mainapp*/._I83/*dlgLogin*/.jS2/*isAdmin*/ == true || !ig$/*appoption*/.fm/*features*/[ma.fcls]))
		{
			r = true;
		}
		
		return r;
	},
	
	_IHd/*navigateTree*/: function(mobj) {
		var me = this,
			mtree = me.mtree,
			root = mtree.getRootNode();
		
		this.ntritem = mobj;
		this.ntrnode = root;
		this.ntrseq = 1;
		
		this._IHe/*navigateTreeOpen*/();
	},
	
	_IHe/*navigateTreeOpen*/: function() {
		var me = this,
			mtree = me.mtree,
			cpath = this.ntritem.nodepath || this.ntritem,
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
							mtree.getSelectionModel().select(node);
						}
					}
					else
					{
						this.ntrnode = null;
						this.ntrseq = 0;
						
						mtree.getSelectionModel().select(node);
					}
					break;
				}
			}
		}
	},
	
	r_IQ5/*loadContent*/: function(xdoc, ltype) {
		var me = this,
			mg = me.down("[name=" + (me.vmode == "tree" ? "mg_t" : "mg") + "]"),
			rname = (ltype == 4 || ltype == 0 || ltype == 5 || ltype == 1) ? "/smsg/item" : (ltype == 6 ? "/smsg/result" : "/smsg"),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, rname),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			ctype, cname,
			i,
			d,
			dp = [],
			cpath = null,
			cuid,
			ta1 = me._i1/*toolbarbuttons*/.items,
			c_menu = me._i1/*toolbarbuttons*/.c_menu,
			ca/*cacheSet*/ = me.mtree.ca/*cacheSet*/,
			v;
			
		me._m1/*openItem*/ = null;
		
		me.l1/*ltype*/ = ltype;
		
		if (ltype == 0 || ltype == 5 || ltype == 1)
		{
			me._m1/*openItem*/ = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			cname = me._m1/*optionItem*/.name;
			cpath = me._m1/*openItem*/.nodepath;
			cuid = me._m1/*openItem*/.uid;
			ctype = me._m1/*openItem*/.type.toLowerCase();
		}
		
		for (i=0; i < c_menu.length; i++)
		{
			v = me._IQ7/*isVisibleCreate*/(c_menu[i], ctype, (me._m1/*openItem*/ != null ? me._m1/*openItem*/.subcube : null));
			c_menu[i].obj.setVisible(v);
		}
		
		for (i=0; i < ta1.length; i++)
		{
			v = me._IQ6/*isVisible*/(ta1[i], ltype, ctype, cpath);
			ta1[i].obj.setVisible(v);
		}
		
		me._IQ8/*setBreadCrumb*/(cpath, cuid);
		
		for (i=0; i < tnodes.length; i++)
		{
			d = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
			d.ltype = d.type.toLowerCase();
			d.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(d.ltype);
			// d.updatedatefm = IG$/*mainapp*/._I40/*formatDate*/(d.updatedate);
			dp.push(d);
		}
		
		IG$/*mainapp*/._I10/*sortMeta*/(dp);
		
		if (me._m1/*openItem*/)
		{
			ca/*cacheSet*/[me._m1/*openItem*/.uid] = {
				datas: dp,
				item: me._m1/*openItem*/
			};
		}
		
		mg.store.loadData(dp);
	},
	
	_IQ8/*setBreadCrumb*/: function(cpath, cuid) {
		var me = this,
			bc = me.down("[name=bc]"),
			bcbody = $(bc.body.dom),
			cplist,
			cp = [],
			c,
			i, j,
			ul;
			
		bcbody.empty();
		me.bcuid = cuid,
		me._gb/*breadcrumbitems*/ = [];
		
		if (cpath)
		{
			cplist = cpath.split("/");
			for (i=1; i < cplist.length; i++)
			{
				c = {
					name: cplist[i],
					cpath: ""
				};
				
				for (j=1; j < i+1; j++)
				{
					c.cpath += "/" + cplist[j];
				}
				
				cp.push(c);
			}
			
			ul = $("<ul class='ig-navi-breadcrumb'></ul>").appendTo(bcbody);
			
			
			
			$.each(cp, function(m, mo) {
				var sp,
					li,
					bl = m < cp.length - 1;
				
				if (mo.name != "SYS_Config")
				{
					if (me._gb/*breadcrumbitems*/.length)
					{
						sp = $("<li class='ig-navi-breadcrumb-sep'>&gt;</li>").appendTo(ul);
					}
					
					li = $("<li class='" + (bl ? "qlink" : "") + "'>" + mo.name + "</li>").appendTo(ul);
					li.appendTo(ul);
					
					me._gb/*breadcrumbitems*/.push(mo);
					
					if (bl)
					{
						li.bind("click", function() {
							me._IQ5/*loadContent*/.call(me, 0, mo.cpath);
						});
					}
				}
			});
		}
	},
	
	_IQ9/*updateGridContent*/: function(datas, item) {
		var me = this,
			mg = me.down("[name=mg]"),
			cpath = item && item.nodepath ? item.nodepath : null,
			cuid = item && item.uid ? item.uid : null,
			cname, ctype,
			_m1,
			i1 = me._i1/*toolbarbuttons*/,
			ta1 = i1 ? i1.items : null,
			c_menu = i1 ? i1.c_menu : null,
			ltype = 0,
			i;
			
		if (!i1)
			return;
			
		me.l1/*ltype*/ = ltype;
		_m1 = me._m1/*openItem*/ = item;
		
		if (_m1)
		{
			cname = me._m1/*optionItem*/.name;
			ctype = me._m1/*openItem*/.type.toLowerCase();
		}
		
		for (i=0; i < c_menu.length; i++)
		{
			v = me._IQ7/*isVisibleCreate*/(c_menu[i], ctype, (me._m1/*openItem*/ != null ? me._m1/*openItem*/.subcube : null));
			c_menu[i].obj.setVisible(v);
		}
		
		for (i=0; i < ta1.length; i++)
		{
			v = me._IQ6/*isVisible*/(ta1[i], ltype, ctype, cpath);
			ta1[i].obj.setVisible(v);
		}
			
		me._IQ8/*setBreadCrumb*/(cpath, cuid);
				
		mg.store.loadData(datas);
	},
	
	_IQa/*refreshCurrent*/: function(muid) {
		var me = this,
			bcuid = muid || me.bcuid,
			ca/*cacheSet*/ = me.mtree.ca/*cacheSet*/;
			
		if (bcuid)
		{
			if (ca/*cacheSet*/[bcuid])
			{
				delete ca/*cacheSet*/[bcuid];
			}
		}
		
		me._IQ5/*loadContent*/(me.l1/*ltype*/, bcuid);
	},
	
	_I8f/*prepareCustomMenu*/: IG$/*mainapp*/._I8f/*prepareCustomMenu*/,
	_I90/*createMetaObject*/: IG$/*mainapp*/._I90/*createMetaObject*/,
	r_I90/*createMetaObject*/: IG$/*mainapp*/.r_I90/*createMetaObject*/,
	_I91/*renameMetaObject*/: IG$/*mainapp*/._I91/*renameMetaObject*/,
	r_I91/*renameMetaObject*/: IG$/*mainapp*/.r_I91/*renameMetaObject*/,
	
	_II7/*pasteMetaObject*/: IG$/*mainapp*/._II7/*pasteMetaObject*/,
	r_II7/*pasteMetaObject*/: IG$/*mainapp*/.r_II7/*pasteMetaObject*/,
	
	_I92/*refreshNode*/: function(node) {
		var me = this;
		
		me._IQa/*refreshCurrent*/(node.get("uid"));
	},
	
	_IPd/*doSearch*/: function(kval) {
		var me = this,
			kword = me.down("[name=kword]"),
			pl2 = me.down("[name=pl2]"),
			b_csch = me.down("[name=b_csch]"),
			keyword = kword.getValue(),
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			_i0/*searchOption*/ = me._i0/*searchOption*/,
			soption;
		
		if (kval)
		{
			kword.setValue(kval);
			keyword = kval;
		}
		
		if (me.vmode == "tree")
		{
			pl2.getLayout().setActiveItem(kval ? 1 : 0);
			b_csch.setVisible(kval);
		}
		
		if (keyword || _i0/*searchOption*/.fltsetdate == true)
		{
			soption = {option: "search", name: keyword};
			
			if (_i0/*searchOption*/.fltsetdate == true)
			{
				soption.fromdate = _i0/*searchOption*/.fltfromdate.join("") + "000000";
				soption.todate = _i0/*searchOption*/.flttodate.join("") + "240000";
			}
			
			if (_i0/*searchOption*/.typelist && _i0/*searchOption*/.typelist.length > 0)
			{
				soption.typelist = _i0/*searchOption*/.typelist.join(";");
			}
			
			me._IQ5/*loadContent*/(6, null, soption);
		}
	},
	
	_IQb/*showSearchOption*/: function() {
		var me = this,
			dlg;
			
		dlg = new IG$/*mainapp*/._Ide/*explorer_search*/({
			_i0/*searchOption*/: me._i0/*searchOption*/,
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
				this._IPd/*doSearch*/();
			})
		});
		
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
	},
	
	_I93/*exportMeta*/: function(meta) {
		var me = this,
			mtree = me.mtree;
			
		mtree._I93/*exportMeta*/.call(mtree, meta);
	},
	
	initComponent: function() {
		var me = this,
			mtree;
		
		me.mainPanel = IG$/*mainapp*/._I7d/*mainPanel*/;
		
		me.customMenu = new $s.menu({
        	items: []
        });
			
		mtree = new IG$/*mainapp*/._Idd/*explorerTree*/({
			gridupdate: {
				handler: me._IQ9/*updateGridContent*/,
				scope: me
			},
			show_tree_items: me.show_tree_items
		});
		
		me.mtree = mtree;
		
		ig$/*appoption*/.uiconfig = ig$/*appoption*/.uiconfig || {};
		ig$/*appoption*/.uiconfig.navigator = ig$/*appoption*/.uiconfig.navigator || {};
		
		me.items = [
			{
				xtype: "panel",
				region: this.vmode == "tree" ? "center" : "west",
				layout: "border",
				border: 0,
				width: this.vmode == "tree" ? null : 200,
				collapsible: true,
				split: false,
				titleCollapse: false,
				header: false,
				collapseMode: "mini",
				items: [
					{
						xtype: "panel",
						border: 0,
						hidden: ig$/*appoption*/.uiconfig.navigator.list_hidden || this.vmode == "tree" || false,
						region: ig$/*appoption*/.uiconfig.navigator.list_pos || "north",
						name: "pl1",
						height: 180,
						margin: "0 0 0 0",
						title: "List",
						cls: "igc-f-dec"
					},
					{
						xtype: "panel",
						flex: 1,
						border: 0,
						margin: "0 0 0 0",
						bodyPadding: 0,
						region: "center",
						title: IRm$/*resources*/.r1("B_FOLDER"),
						layout: "card",
						cls: "igc-f-dec",
						name: "pl2",
						tools: [
							{
								type: "close",
								name: "b_csch",
								tooltip: "Close",
								hidden: true,
								handler: function(event, toolel, pheader) {
									var me = this;
									me._IPd/*doSearch*/();
								},
								scope: this
							},
							{
								type: "refresh",
								tooltip: "Refresh",
								handler: function(event, toolel, pheader) {
									var me = this;
									me.mtree.i2/*initTree*/.call(me.mtree);
								},
								scope: this
							}
						],
						items: [
							mtree,
							{
								xtype: "grid",
								flex: 1,
								name: "mg_t",
								store: {
									xtype: "store",
									fields: [
										"selected", "uid", "nodepath", "name", "type", "description", "iconcls", "updatedate", "owner", "modifier", "updatedatefm", "writable", "manage"
									]
								},
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
								columns: [
									{
										xtype: "templatecolumn",
										text: IRm$/*resources*/.r1("B_NAME"),
										menuDisabled: true,
										flex: 1,
										minWidth: 160,
										tdCls: "ig-navi-namecol",
										tpl: "<div class='ig-navi-itemicon-p'><div class='ig-navi-itemicon {iconcls}'></div></div><span class='ig-navi-text' title='{name} ({type})'>{name} <br /> {description} </span><br /> <span>{updatedatefm} <br /><br /> " + IRm$/*resources*/.r1("B_OWNER") + " : {owner} <br />" + IRm$/*resources*/.r1("B_MODI") + " : {modifier}</span>"
									},
									{
										xtype: "gridcolumn",
										text: IRm$/*resources*/.r1("B_LOC"),
										minWidth: 200,
										menuDisabled: true,
										flex: 1,
										dataIndex: "nodepath"
									}
								],
								listeners: {
									cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
										var me = this,
											pl2 = me.down("[name=pl2]"),
											ta1 = me._i1/*toolbarbuttons*/,
											v = false,
											v2 = false,
											itemtype = record.get("type").toLowerCase(),
											isfolder = IG$/*mainapp*/._I0e/*isFolder*/(itemtype),
											uid = record.get("uid"),
											ctype = record.get("type"),
											b_csch = me.down("[name=b_csch]"),
											r;
											
										if (cellIndex == 0 && isfolder < 5)
										{
											pl2.getLayout().setActiveItem(0);
											b_csch.hide();
											me._IHd/*navigateTree*/({
												nodepath: record.get("nodepath")
											});
										}
										else if (isfolder > 4)
										{
											IG$/*mainapp*/._n1/*navigateMenu*/(uid);
										}
																																								
										return r;
									},
									beforeitemcontextmenu: function(view, record, item, index, e) {
										e.stopEvent();
										
										var me = this,
											x = e.pageX,
											y = e.pageY,
											
											t = e.getTarget();
											
										var mvisible = this._I8f/*prepareCustomMenu*/(record);
										
										if (mvisible == true && me.l1/*ltype*/ != 4)
										{
											this.customMenu.showBy(t);
										}
										
										return false;
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
				region: this.vmode == "tree" ? "east" : "center",
				hidden: this.vmode == "tree" ? true : false,
				flex: 1,
				border: 0,
				layout: "border",
				items: [
					{
						xtype: "panel",
						border: 0,
						margin: "0 5 0 0",
						region: "north",
						layout: {
							type: "vbox",
							align: "stretch"
						},
						items: [
							{
								xtype: "container",
								hidden: ig$/*appoption*/.uiconfig.navigator.search_hidden || false,
								layout: {
									type: "hbox"
								},
								items: [
									{
										xtype: "textfield",
										name: "kword",
										fieldLabel: IRm$/*resources*/.r1("L_BTN_SEARCH"),
										labelPosition: "right",
										enableKeyEvents: true,
										width: 300,
										labelWidth: 60,
										listeners: {
											keyup: function(tobj, e, eopts) {
												if (e.keyCode == 13)
												{
													this._IPd/*doSearch*/();
												}
											},
											scope: this
										}
									},
									{
										xtype: "button",
										text: "..",
										handler: function() {
											this._IQb/*showSearchOption*/();
										},
										scope: this
									},
									{
										xtype: "button",
										text: IRm$/*resources*/.r1("B_GO"),
										handler: function() {
											this._IPd/*doSearch*/();
										},
										scope: this
									}
								]
							},
							{
								xtype: "panel",
								name: "bc", /*breadcrumb*/
								height: 22
							},
							{
								xtype: "toolbar",
								defaults: {
									xtype: "button",
									scope: this
								},
								items: [
									{
										xtype: "button",
										text: IRm$/*resources*/.r1("B_CR"),
										ltype: "0;1;2;3;5;",
										ctype: "folder;workspace;cube;sqlcube;datacube;javapackage;",
										sroot: true,
										name: "btn_create",
										menu: {
											xtype: "menu",
											defaults: {
												scope: this,
												sroot: false
											},
											items: [
												{
													text: IRm$/*resources*/.r1("B_WORKSPACE"),
													name: "c_workspace",
													fcls: "ig_n_cw",
													sroot: true,
													ltype: ";",
													mtype: "nvl",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_workspace");
													}
												},
												{
													text: IRm$/*resources*/.r1("B_FOLDER"),
													name: "c_folder",
													fcls: "ig_n_f_f",
													ltype: "workspace;folder;cube;sqlcube;datacube;javapackage;",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_folder");
													}
												},
												{
													text: IRm$/*resources*/.r1("L_REPORT"),
													name: "c_report",
													fcls: "ig_n_rpt",
													ltype: "workspace;folder;",
													mtype: "nvl",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_reports");
													}
												},
												{
													text: IRm$/*resources*/.r1("L_DASHBOARD"),
													name: "c_dashboard",
													fcls: "ig_n_dbd",
													ltype: "workspace;folder;",
													mtype: "nvl",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_dbd");
													}
												},
												{
													text: IRm$/*resources*/.r1("L_B_ADC"),
													name: "c_dcube",
													fcls: "ig_n_c_lc",
													ltype: "workspace;folder;",
													mtype: "nvl",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_upload");
													}
													
													
												},
												{
													text: IRm$/*resources*/.r1("L_B_AC"),
													name: "c_cube",
													fcls: "ig_n_cb",
													ltype: "workspace;folder;",
													mtype: "nvl",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_cube");
													}
												},
												{
													text: IRm$/*resources*/.r1("L_MENU_DB_MODEL"),
													name: "c_dbmodel",
													fcls: "ig_n_dbm",
													ltype: "workspace;folder;",
													mtype: "nvl",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_dbmodel");
													}
												},
												{
													text: IRm$/*resources*/.r1("L_B_CM"),
													name: "c_metrics",
													fcls: "ig_n_cm",
													ltype: "cube;sqlcube;datacube;folder;",
													mtype: "cube;sqlcube;datacube;",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_metrics", "CustomMetric");
													}
												},
												{
													text: IRm$/*resources*/.r1("D_MEASURE"),
													name: "c_measure",
													fcls: "ig_n_ms",
													ltype: "cube;sqlcube;datacube;folder;",
													mtype: "cube;sqlcube;datacube;",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_metrics", "Measure");
													}
												},
												{
													text: IRm$/*resources*/.r1("D_FORMULA"),
													name: "c_fmr",
													fcls: "ig_n_fm",
													ltype: "cube;sqlcube;datacube;folder;",
													mtype: "cube;sqlcube;datacube;",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_metrics", "FormulaMeasure");
													}
												},
												{
													text: IRm$/*resources*/.r1("D_DATEMETRIC"),
													name: "c_dmetric",
													fcls: "ig_n_dm",
													ltype: "cube;sqlcube;datacube;folder;",
													mtype: "cube;sqlcube;datacube;",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_metrics", "DateMetric");
													}
												},
												{
													text: IRm$/*resources*/.r1("D_CHARTMEASURE"),
													name: "c_cmeasure",
													fcls: "ig_n_cms",
													ltype: "cube;sqlcube;datacube;folder;",
													mtype: "cube;sqlcube;datacube;",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_metrics", "ChartMeasure");
													}
												},
												{
													text: IRm$/*resources*/.r1("D_UDG"),
													name: "c_udg",
													fcls: "ig_n_udg",
													ltype: "cube;sqlcube;datacube;folder;",
													mtype: "cube;sqlcube;datacube;",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_metrics", "UDG");
													}
												},
												{
													text: IRm$/*resources*/.r1("L_B_BW"),
													name: "c_workflow",
													fcls: "ig_n_hb",
													ltype: "workspace;folder;",
													mtype: "nvl",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_workflow");
													}
												},
												{
													text: IRm$/*resources*/.r1("L_B_JV"),
													name: "c_javaclass",
													fcls: "ig_n_jc",
													ltype: "folder;javapackage;",
													mtype: "nvl",
													handler: function() {
														this._IQ0/*processMenu*/("cmd_c_java");
													}
												}
											]
										}
									},
//									{
//										text: "Share",
//										ltype: "0;1;2;3;5;6;",
//										sroot: false,
//										name: "btn_share",
//										handler: function() {
//											this._IQ0/*processMenu*/("cmd_share");
//										}
//									}, 
									{
										text: IRm$/*resources*/.r1("L_REFRESH"),
										ltype: "0;1;2;3;5;",
										sroot: true,
										name: "btn_refresh",
										handler: function() {
											this._IQa/*refreshCurrent*/();
										}
									},
									"-",
									{
										text: IRm$/*resources*/.r1("L_B_U"),
										ltype: "0;1;2;3;5;",
										sroot: false,
										name: "btn_up",
										handler: function() {
											this._IQ0/*processMenu*/("cmd_up");
										}
									},
									{
										text: IRm$/*resources*/.r1("L_B_MVT"),
										sroot: false,
										ltype: "0;1;2;3;5;6;",
										name: "btn_moveto",
										fcls: "ig_n_mv",
										handler: function() {
											this._IQ0/*processMenu*/("cmd_moveto");
										}
									},
									{
										text: IRm$/*resources*/.r1("L_REMOVE"),
										sroot: true,
										ltype: "0;1;2;3;5;6;",
										name: "btn_remove",
										fcls: "ig_n_del",
										handler: function() {
											this._IQ0/*processMenu*/("cmd_remove");
										}
									},
									{
										name: "btn_recover",
										ltype: "4;",
										sroot: false,
										text: IRm$/*resources*/.r1("L_RECOVER"),
										handler: function() {
											this._IQ0/*processMenu*/("cmd_recover");
										}
									},
									{
										name: "btn_open",
										ltype: "0;1;2;3;5;6;",
										ctype: "cube;sqlcube;datacube;nosql;mcube;mdbcube",
										sroot: false,
										text: IRm$/*resources*/.r1("L_E_CB"),
										handler: function() {
											this._IQ0/*processMenu*/("cmd_open");
										}
									},
									{
										name: "btn_edit",
										ltype: ";",
										sroot: false,
										text: IRm$/*resources*/.r1("L_E_IT"),
										handler: function() {
											this._IQ0/*processMenu*/("cmd_edit");
										}
									},
									{
										name: "btn_delete",
										ltype: "4;",
										sroot: false,
										fcls: "ig_n_del",
										text: IRm$/*resources*/.r1("L_E_DEL"),
										handler: function() {
											this._IQ0/*processMenu*/("cmd_delete");
										}
									},
									"->",
									{
										text: "Show detail",
										sroot: false,
										hidden: true,
										handler: function() {
											this._IQ0/*processMenu*/("cmd_detail");
										}
									}
								]
							}
						]
					},
					{
						xtype: "panel",
						region: "center",
						margin: "0 5 0 0",
						flex: 1,
						border: 0,
						layout: {
							type: "vbox",
							align: "stretch"
						},
						items: [
							{
								xtype: "grid",
								flex: 1,
								name: "mg",
								store: {
									xtype: "store",
									fields: [
										"selected", "uid", "nodepath", "name", "type", "description", "iconcls", "updatedate", "owner", "modifier", "updatedatefm", "writable", "manage"
									]
								},
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
								columns: [
									{
										xtype: "checkcolumn",
										dataIndex: "selected",
										width: 28,
										listeners: {
											checkchange: function(tobj, rowindex, checked, eopts) {
												var me = this,
													mg = me.down("[name=mg]"),
													ta1 = me._i1/*toolbarbuttons*/,
													v = false,
													v2 = false,
													itemtype = record.get("type").toLowerCase(),
													isfolder = IG$/*mainapp*/._I0e/*isFolder*/(itemtype),
													uid = record.get("uid"),
													ctype = record.get("type"),
													r,
													view = mg.getView();
												
												v2 = me._m1/*openItem*/ && (/cube|datacube|sqlcube|nosql|mcube|mdbcube/).test(me._m1/*openItem*/.type.toLowerCase()) ? true : false;
												
												if (me.l1/*ltype*/ == 4)
													return;
												
												if (isfolder > 4)
												{
													v = true;
												}
												else if (isfolder == 2)
												{
													v2 = true;
												}
												
												view.select(rowindex);
												
												ta1.btn_edit.obj.setVisible(v);
												ta1.btn_open.obj.setVisible(v2);
											},
											scope: this
										}
									},
									{
										xtype: "templatecolumn",
										text: IRm$/*resources*/.r1("B_NAME"),
										menuDisabled: true,
										flex: 1,
										minWidth: 160,
										tdCls: "ig-navi-namecol",
										tpl: "<div class='ig-navi-itemicon-p'><div class='ig-navi-itemicon {iconcls}'></div></div><span class='ig-navi-text' title='{name} ({type})'>{name}</span>"
									},
									{
										xtype: "gridcolumn",
										text: IRm$/*resources*/.r1("B_DESC"),
										minWidth: 120,
										menuDisabled: true,
										flex: 1,
										dataIndex: "description"
									},
									{
										xtype: "gridcolumn",
										text: IRm$/*resources*/.r1("B_LOC"),
										minWidth: 200,
										menuDisabled: true,
										flex: 1,
										dataIndex: "nodepath"
									},
									{
										xtype: "gridcolumn",
										text: IRm$/*resources*/.r1("B_LASTUPD"),
										menuDisabled: true,
										width: 100,
										dataIndex: "updatedatefm"
									},
									{
										xtype: "gridcolumn",
										text: IRm$/*resources*/.r1("B_OWNER"),
										menuDisabled: true,
										width: 80,
										dataIndex: "owner"
									},
									{
										xtype: "gridcolumn",
										text: IRm$/*resources*/.r1("B_MODI"),
										menuDisabled: true,
										width: 80,
										dataIndex: "modifier"
									}
								],
								listeners: {
									cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
										var me = this,
											ta1 = me._i1/*toolbarbuttons*/,
											v = false,
											v2 = false,
											itemtype = record.get("type").toLowerCase(),
											isfolder = IG$/*mainapp*/._I0e/*isFolder*/(itemtype),
											uid = record.get("uid"),
											ctype = record.get("type"),
											r;
										
										v2 = me._m1/*openItem*/ && (/cube|datacube|sqlcube|nosql|mcube|mdbcube/).test(me._m1/*openItem*/.type.toLowerCase()) ? true : false;
										
										if (cellIndex == 0)
											return r;
										
										if (me.l1/*ltype*/ == 4)
											return;
										
										if (cellIndex == 1)
										{
											r = false;
											if (isfolder < 5)
											{
												this._IQ5/*loadContent*/(0, uid);
											}
											else
											{
												IG$/*mainapp*/._n1/*navigateMenu*/(uid);
											}
										}
										else
										{
											if (isfolder > 4)
											{
												v = true;
											}
											else if (isfolder == 2)
											{
												v2 = true;
											}
										}
										
										ta1.btn_edit.obj.setVisible(v);
										ta1.btn_open.obj.setVisible(v2);
										
										return r;
									},
									beforeitemcontextmenu: function(view, record, item, index, e) {
										e.stopEvent();
										
										var me = this,
											x = e.pageX,
											y = e.pageY,
											
											t = e.getTarget();
											
										var mvisible = this._I8f/*prepareCustomMenu*/(record);
										
										if (mvisible == true && me.l1/*ltype*/ != 4)
										{
											this.customMenu.showBy(t);
										}
										
										return false;
									},
									scope: this
								}
							}
						]
					},
					{
						xtype: "panel",
						border: 0,
						width: 150,
						layout: "fit",
						title: "Detail",
						region: "east",
						hidden: true
					}
				]
			}
		];
		IG$/*mainapp*/._I8e/*explorer*/.superclass.initComponent.call(this);
	},
	listeners: {
		afterrender: function(tobj) {
			var me = this;
			
			me.rendered = true;
			me._I2/*compinit*/ = true;
			
			tobj._IQ3/*initData*/.call(tobj);
			
			if (me._IQc/*doInit*/ == true)
			{
				me._IQ4/*initComp*/();
			}
		}
	}
});

IG$/*mainapp*/._Id2/*folderManager*/ = $s.extend($s.gridpanel, {
	cpath: null,
	mpath: null,
	
	L1/*loadRoot*/: function(root) {
		var me = this,
			req, meta;
		
		me.root = root;
		me.mpath = [me.root];
		meta = me.root;
		
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me, 
			{
	            ack: "5",
                payload: "<smsg><item" + IG$/*mainapp*/._I20/*XUpdateInfo*/({uid: meta.uid, nodepath: meta.nodepath, name: meta.name, type: meta.type}, "uid;nodepath;name;type", "s") + "/></smsg>",
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
	        }, me, me.rs_L1/*loadRoot*/, null);
		req._l/*request*/();
	},
	
	L2/*topWS*/: function() {
		this.L1/*loadRoot*/({
			uid: "/",
			nodepath: "/",
			name: "Workspace",
			type: "Workspace"
		});
	},
	
	L3/*naviFolder*/: function(record) {
		var me = this,
			type = record.get("type").toLowerCase(),
			req;
		
		if (type == "workspace" || type == "folder" || type == "mcube" || type == "datacube" || type == "cube" || type == "nosql" || type == "mdbcube")
		{
			meta = {
				uid: record.get("uid"),
				type: record.get("type"),
				nodepath: record.get("nodepath"),
				name: record.get("oname") || record.get("name"),
				manage: record.get("manage"),
				writable: record.get("writable")
			};
			
			if (record.get("name") == "..")
			{
				me.mpath.splice(me.mpath.length-1, 1);
			}
			else
			{
				me.mpath.push(meta);
			}
			
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "5",
	                payload: "<smsg><item" + IG$/*mainapp*/._I20/*XUpdateInfo*/({uid: meta.uid, nodepath: meta.nodepath, name: meta.name, type: meta.type}, "uid;nodepath;name;type", "s") + "/></smsg>",
	                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({subfolder: "T"})
		        }, me, me.rs_L1/*loadRoot*/, null);
			req._l/*request*/();
		}
	},
	
	rs_L1/*loadRoot*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			tval = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode),
			snodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
			i, items = [], item, parent, updatedate;
		
		parent = me.mpath.length > 1 ? me.mpath[me.mpath.length-2] : null;
		
		me.cpath = {
			uid: tval.uid,
			name: tval.name,
			nodepath: tval.nodepath,
			type: tval.type,
			writable: tval.writable,
			manage: tval.manage
		};
		
		if (tval.uid != me.root.uid)
		{
			// tval.oname = tval.name;
			// tval.name = "..";
			parent.oname = parent.name;
			parent.name = "..";
			items.push(parent);
		}
		
		if (snodes)
		{
			for (i=0; i < snodes.length; i++)
			{
				item = IG$/*mainapp*/._I1c/*XGetAttrProp*/(snodes[i]);
				updatedate = item.updatedate;
				updatedate = updatedate.substring(0, 4) + "-" + updatedate.substring(4, 6) + "-" + updatedate.substring(6, 8) + " " + updatedate.substring(8, 10) + ":" + updatedate.substring(10, 12);
				item.updatedate = updatedate; 
				item.iconcls = IG$/*mainapp*/._I11/*getMetaItemClass*/(item.type.toLowerCase());
				items.push(item);
			}
			
			var seq = {
				workspace: 1,
				folder: 2,
				cube: 3,
				cubemodel: 4,
				nosql: 5,
				mcube: 6,
				mdbcube: 7,
				metric: 10,
				measure: 11
			};
			
			var seqmemo = {
				"global": 1,
				"public": 2,
				"private": 4
			};
			
			items.sort(function(a, b) {
				var r = 0,
					ta = a.type.toLowerCase(),
					tb = b.type.toLowerCase(),
					na = a.name,
					nb = b.name, sa, sb;
				
				if (ta != tb)
				{
					sa = seq[ta] || 99;
					sb = seq[tb] || 99;
					
					r = sa - sb;
				}
				else
				{
					if (ta == tb && ta == "workspace")
					{
						sa = seqmemo[(a.memo || "global").toLowerCase()] || 99;
						sb = seqmemo[(b.memo || "global").toLowerCase()] || 99;
						
						if (sa != sb)
						{
							r = sa - sb;
						}
						else
						{
							r = na - nb;
						}
					}
					else
					{
						r = na - nb;
					}
				}
				
				return r;
			});
		}
		
		me.store.loadData(items);
	},
	
	L4/*refresh*/: function() {
		var me = this,
			req,
			meta = me.cpath;
		
		req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me, 
			{
	            ack: "5",
                payload: "<smsg><item" + IG$/*mainapp*/._I20/*XUpdateInfo*/({uid: meta.uid, nodepath: meta.nodepath, name: meta.name, type: meta.type}, "uid;nodepath;name;type", "s") + "/></smsg>",
                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
	        }, me, me.rs_L1/*loadRoot*/, null);
		req._l/*request*/();
	},
	
	_I90/*createMetaObject*/: function(objecttype, parentuid, parentfullpath, node) {
		var dlgpop = new IG$/*mainapp*/._I6e/*makeItem*/({
			parentnodepath: parentfullpath,
			itemtype: objecttype,
			parentuid: parentuid
		});
		dlgpop.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.r_I90/*createMetaObject*/, node);
		
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgpop);
	},
	
	r_I90/*createMetaObject*/: function() {
		var me = this;
		me.L4/*refresh*/();
	},
	
	_I91/*renameMetaObject*/: function(itemname, uid, nodepath, nodetype) {
		var dlgpop = new IG$/*mainapp*/._Icd/*makeItemEditor*/(
			{
				itemname: itemname,
				uid: uid,
				nodepath: nodepath,
				itemtype: nodetype
			}
		);
		dlgpop.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.r_I91/*renameMetaObject*/, null);
		
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgpop);
	},
	
	r_I91/*renameMetaObject*/: function() {
		var me = this;
		me.L4/*refresh*/();
	},
	
	_t$/*toolbarHandler*/: function(cmd) {
		var me = this;
		switch (cmd)
		{
		case "cmd_new_folder":
			me._I90/*createMetaObject*/("Folder", me.cpath.uid, me.cpath.nodepath, null);
			break;
		case "cmd_refresh":
			me.L4/*refresh*/();
			break;
		case "cmd_gotop":
			me.L1/*loadRoot*/(me.root);
			break;
		case "cmd_top_ws":
			me.L2/*topWS*/();
			break;
		case "cmd_delete":
			me._IHf/*deleteMetaObject*/();
			break;
		case "cmd_rename":
			var selmodel = me.getSelectionModel(),
				sel;
			if (selmodel.selected.items.length > 0)
			{
				sel = selmodel.selected.items[0];
				if (sel.get("name") != ".." && (sel.get("writable") == "T" || sel.get("manage") == "T"))
				{
					me._I91/*renameMetaObject*/(sel.get("name"), sel.get("uid"), sel.get("nodepath"), sel.get("type"));
				}
			}
			break;
		}
	},
	
	_IHf/*deleteMetaObject*/: function() {
		var me = this,
			i, checked,
			address = "<smsg>",
			itemcnt = 0;
		
		checked = me.L5/*getChecked*/();
		
		if (checked.length > 0)
		{
			for (i=0; i < checked.length; i++)
			{
				if (checked[i].name != ".." && (checked[i].manage == "T" || checked[i].writable == "T"))
				{
					address += "<item uid='" + checked[i].uid + "'/>";
					itemcnt++;
				}
				else if (checked[i].name != "..")
				{
					itemcnt = 0;
					IG$/*mainapp*/._I52/*ShowError*/("Privilege error on content: " + checked[i].name, me);
					break;
				}
			}
			
			if (itemcnt > 0)
			{
				address += "</smsg>";
				
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(me, 
					{
			            ack: "30",
		                payload: address,
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "delete"})
			        }, me, me.r_IHf/*deleteMetaObject*/, null);
				req._l/*request*/();
			}
		}
	},
	
	r_IHf/*deleteMetaObject*/: function(xdoc) {
		var me = this;
		me.L4/*refresh*/();
	},
	
	L5/*getChecked*/: function() {
		var me = this,
			checked=[], i, item;
		for (i=0; i < me.store.data.items.length; i++)
		{
			if (me.store.data.items[i].get("selected"))
			{
				item = me.store.data.items[i];
				checked.push({
					uid: item.get("uid"),
					type: item.get("type"),
					nodepath: item.get("nodepath"),
					name: item.get("name"),
					manage: item.get("manage"),
					writable: item.get("writable")
				});
			}
		}
		
		return checked;
	},
	
	initComponent : function() {
		var me = this;
		
		$s.apply(this, {
			store: {
	    		xtype: "store",
	    		fields: [
	    			"uid", "name", "oname", "nodepath", "type", "writable", "manage", "updatedate", "selected", "iconcls"
	    		]
	    	},
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
	    	    	xtype: "templatecolumn",
	    	    	text: "",
	    	    	tpl: "<div class='{iconcls}' style='width:16px;height:16px'></div>",
	    	    	dataIndex: "iconcls",
	    	    	width: 24
	    	    },
	    	    {
	    	    	text: "Name",
	    	    	dataIndex: "name",
	    	    	flex: 1
	    	    },
	    	    {
	    	    	text: "Type",
	    	    	dataIndex: "type",
	    	    	width: 60
	    	    },
	    	    {
	    	    	text: "Updated",
	    	    	dataIndex: "updatedate",
	    	    	width: 120
	    	    }
	    	],
	    	tbar: [
				{
					xtype: 'splitbutton',
					text: "New",
					menu: [
				        {
				    		text: "Folder",
				    		handler: function() {
				        		this._t$/*toolbarHandler*/("cmd_new_folder");
				        	},
				        	scope: this
				        }
					]
				},
				{
					text: "Rename",
					handler: function() {
						this._t$/*toolbarHandler*/("cmd_rename"); 
					},
					scope: this
				},
				{
					iconCls: "icon-toolbar-remove",
					text: "Delete",
					handler: function() {
						this._t$/*toolbarHandler*/("cmd_delete"); 
					},
					scope: this
				},
				{
					text: "Refresh",
					handler: function() {
						this._t$/*toolbarHandler*/("cmd_refresh"); 
					},
					scope: this
				},
				{
					text: "Go Top",
					handler: function() {
						this._t$/*toolbarHandler*/("cmd_gotop"); 
					},
					scope: this
				},
				{
					text: "Workspace",
					handler: function() {
						this._t$/*toolbarHandler*/("cmd_top_ws");
					},
					scope: this
				}
	    	],
	    	listeners: {
	    		cellclick: function(tobj, td, cellIndex, record, tr, rowIndex, e, eOpts) {
	    			if (cellIndex == 2)
	    			{
	    				me.L3/*naviFolder*/.call(me, record);
	    			}
	    		}
	    	}
		});
		IG$/*mainapp*/._Id2/*folderManager*/.superclass.initComponent.apply(this, arguments);
	}
});

IG$/*mainapp*/._Ic6/*folderManagerWin*/ = $s.extend($s.window, {
	
	modal: true,
	region:"center",
	
	"layout": "fit",
	
	closable: false,
	resizable:false,
	
	width: 950,
	autoHeight: true,
	dbscan: 1,
	
	callback: null,
	
	serverNode: null,
	modelcontent: null,
	
	_IG0/*closeDlgProc*/: function() {
		this.close();
	},
	
	in$t: function() {
		var me = this,
			grd_l = me.grd_l,
			grd_r = me.grd_r;
		
		grd_l.L1/*loadRoot*/.call(grd_l, me.root);
		grd_r.L1/*loadRoot*/.call(grd_r, me.root);
	},
	
	L6/*moveChecked*/: function(isleft, iscopy) {
		var me = this,
			grd_l = me.grd_l,
			grd_r = me.grd_r,
			checked;
		
		checked = (isleft) ? grd_l.L5/*getChecked*/.call(grd_l) : grd_r.L5/*getChecked*/.call(grd_r);
		
		if (grd_l.cpath.uid == grd_r.cpath.uid)
		{
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("E_DUP_FOLDER"), null, null, 1, "error");
			return;
		}
		
		if (checked && checked.length > 0)
		{
			var req,
				address = "<smsg>",
				panel = this,
				itemcnt = 0,
				i;
			
			for (i=0; i < checked.length; i++)
			{
				if (checked[i].name != ".." && (checked[i].writable == "T" || checked[i].manage == "T"))
				{
					address += "<item uid='" + checked[i].uid + "'/>";
					itemcnt++;
				}
			}
			
			address += "</smsg>";
			
			if (itemcnt > 0)
			{
				me.setLoading(true);
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(panel, 
					{
			            ack: "11",
		                payload: address,
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: (iscopy == true ? "copy" : "move"), target: (isleft ? grd_r.cpath.uid : grd_l.cpath.uid)})
			        }, panel, panel.r_II2/*moveSelectedItems*/, null, null);
				req._l/*request*/();
			}
		}
	},
	
	r_II2/*moveSelectedItems*/: function(xdoc) {
		var me = this,
			grd_l = me.grd_l,
			grd_r = me.grd_r;
		
		me.setLoading(false); 
		
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "Moved items successfully", null, me, 0, "success");
		
		grd_l.L4/*refresh*/.call(grd_l);
		grd_r.L4/*refresh*/.call(grd_r);
	},
	
	initComponent : function() {
		var me = this;
		
		me.title = IRm$/*resources*/.r1("T_MGR_FOLDER");
		
		me.grd_l = new IG$/*mainapp*/._Id2/*folderManager*/({
	    	name: "grd_l",
	    	height: 500,
	    	flex: 1
	    	
	    });
		
		me.grd_r = new IG$/*mainapp*/._Id2/*folderManager*/({
	    	name: "grd_r",
	    	height: 500,
	    	flex: 1
	    	
	    });
		
		$s.apply(this, {
			defaults:{bodyStyle:"padding:10px"},
			
			"layout": "fit",
			
			items: [
			    {
			    	xtype: "panel",
			    	layout: {
			    		type: "hbox",
			    		align: "stretch"
			    	},
			    	border: 0,
					items: [
					    me.grd_l,
					    {
					    	width: 60,
							"layout": {
								type: 'vbox',
								align: 'stretch',
								pack: 'center'
							},
							items: [
						        {
						        	xtype: "displayfield",
						        	value: "Move"
						        },
						        {
									xtype: 'button',
				        			text: '>>',
				        			tooltip: "Move items",
				        			handler:function() {
										this.L6/*moveChecked*/(true, false);
									},
									scope: this
								},
								{
									xtype: 'button',
				        			text: '<<',
				        			tooltip: "Move items",
				        			handler:function() {
										this.L6/*moveChecked*/(false, false);
									},
									scope: this
								},
								{
									xtype: "container",
									height: 10
								},
								{
									xtype: "displayfield",
									value: "Copy"
								},
								{
									xtype: 'button',
				        			text: '>',
				        			tooltip: "Copy items",
				        			handler:function() {
										this.L6/*moveChecked*/(true, true);
									},
									scope: this
								},
								{
									xtype: 'button',
				        			text: '<',
				        			tooltip: "Copy items",
				        			handler:function() {
										this.L6/*moveChecked*/(false, true);
									},
									scope: this
								}
							]
					    },
					    me.grd_r
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
		
		IG$/*mainapp*/._Ic6/*folderManagerWin*/.superclass.initComponent.apply(this, arguments);
	}
});

