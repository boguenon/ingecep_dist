	// make custom chart wizard panels

IG$/*mainapp*/.__c_/*chartoption*/.chartcateg.push({name: "Time based Stock Chart", value: "h-stock"});

IG$/*mainapp*/.cSET/*chartOptionSet*/ = "f_palette;f_showvalues;m_zoom_level;f_gauge_type;f_gauge_refresh;m_marker;m_min;m_max;s_t_f;s_t_fo;e3d_en;e3d_al;e3d_be;e3d_de;e3d_vd;edu_val1;cdata_m_tmpl;m_xypos";

IG$/*mainapp*/.makeCustomChartOption = function(wizard, panel) {
	var cpanels = [],
		chartoption = (wizard._ILb/*sheetoption*/ && wizard._ILb/*sheetoption*/.cco ? wizard._ILb/*sheetoption*/.cco : null);
	
	// for fusion chart extension	
	var p1 = $s.create($s.formpanel, {
		layout: "anchor",
		border: 0,
		title: "Styles",
		autoScroll: true,
		defaults: {
			anchor: "100%"
		},
		initData: function() {
			var me = this,
				option = chartoption;
			
			if (option)
			{
				me.down("[name=f_palette]").setValue(option.f_palette);
				me.down("[name=f_showvalues]").setValue(option.f_showvalues == "T" ? true : false);
				me.down("[name=f_gauge_type]").setValue(option.f_gauge_type);
				me.down("[name=f_gauge_refresh]").setValue(option.f_gauge_refresh);
				me.down("[name=e3d_en]").setValue(option.e3d_en == "T");
				me.down("[name=e3d_al]").setValue(option.e3d_al || 5);
				me.down("[name=e3d_be]").setValue(option.e3d_be || 7);
				me.down("[name=e3d_de]").setValue(option.e3d_de || 10);
				me.down("[name=e3d_vd]").setValue(option.e3d_vd || 5);
			}
		},
		updateOptionValues: function() {
			var me = this,
				option = chartoption;
			
			if (option)
			{
				option.f_palette = me.down("[name=f_palette]").getValue();
				option.f_showvalues = me.down("[name=f_showvalues]").getValue() == true ? "T" : "F";
				option.f_gauge_type = me.down("[name=f_gauge_type]").getValue();
				option.f_gauge_refresh = me.down("[name=f_gauge_refresh]").getValue();
				
				option.e3d_en = me.down("[name=e3d_en]").getValue() ? "T" : "F";
				option.e3d_al = "" + me.down("[name=e3d_al]").getValue();
				option.e3d_be = "" + me.down("[name=e3d_be]").getValue();
				option.e3d_de = "" + me.down("[name=e3d_de]").getValue();
				option.e3d_vd = "" + me.down("[name=e3d_vd]").getValue();
			}
		},
		invalidateFields: function(opt) {
			var me = this,
				subtype = opt.subtype;
			
			me.down("[name=pa01]").setVisible(subtype == "gauge");
		},
		items: [
			{
				xtype: "fieldset",
				title: "Style options (Fusion Charts)",
				hidden: true,
				layout: "anchor",
				
				items: [
					{
						xtype: "combobox",
						name: "f_palette",
						queryMode: "local",
						displayField: "name",
						valueField: "value",
						editable: false,
						autoSelect: true,
						fieldLabel: "Palette",
						store: {
							xtype: "store",
							fields: ["name", "value"],
							data: [
								{name: "Set 1", value: "1"},
								{name: "Set 2", value: "2"},
								{name: "Set 3", value: "3"},
								{name: "Set 4", value: "4"},
								{name: "Set 5", value: "5"},
								{name: "Set 6", value: "6"}
							]
						}
					},
					{
						xtype: "checkbox",
						name: "f_showvalues",
						fieldLabel: "Show values",
						boxLabel: "Enable"
					}
				]
			},
			{
				xtype: "fieldset",
				title: "3D Options",
				layout: "anchor",
				items: [
					{
						xtype: "displayfield",
						value: "Apply only if 3D is available on chart type"
					},
					{
						xtype: "checkbox",
						name: "e3d_en",
						fieldLabel: "Enable 3D",
						boxLabel: "Enable"
					},
					{
						xtype: "numberfield",
						name: "e3d_al",
						minValue: 0,
						maxValue: 45,
						fieldLabel: "Alpha Angle",
						value: 10
					},
					{
						xtype: "numberfield",
						name: "e3d_be",
						minValue: 0,
						maxValue: 45,
						fieldLabel: "Beta Angle",
						value: 25
					},
					{
						xtype: "numberfield",
						name: "e3d_de",
						minValue: 0,
						maxValue: 100,
						fieldLabel: "Depth",
						value: 70
					},
					{
						xtype: "numberfield",
						name: "e3d_vd",
						minValue: 0,
						maxValue: 100,
						fieldLabel: "View Distance",
						value: 25
					}
				]
			},
			{
				xtype: "fieldset",
				title: "Gauge options",
				name: "pa01",
				layout: "anchor",
				hidden: true,
				items: [
					{
						xtype: "combobox",
						name: "f_gauge_type",
						queryMode: "local",
						displayField: "name",
						valueField: "value",
						editable: false,
						autoSelect: true,
						fieldLabel: "Gauge Type",
						store: {
							xtype: "store",
							fields: ["name", "value"],
							data: [
								{name: "Angular gauge", value: "angular"},
								{name: "Cylinder", value: "cylinder"},
								{name: "Linear gauge", value: "hlinear"}
							]
						}
					},
					{
						xtype: "numberfield",
						name: "f_gauge_refresh",
						fieldLabel: "Refresh second",
						value: 2,
						minValue: 1,
						maxValue: 1000
					}
				]
			}
		],
		listeners: {
			afterrender: function(p) {
				p.initData.call(p);
			}
		}
	});
	
	panel.add(p1);
	cpanels.push(p1);
	
	// for map chart extension	
	var p2 = $s.create($s.formpanel, {
		layout: "anchor",
		border: 0,
		title: "Extra Options",
		defaults: {
			anchor: "100%"
		},
		initData: function() {
			var me = this,
				option = chartoption;
			
			if (option)
			{
				me.down("[name=m_zoom_level]").setValue(option.m_zoom_level || "8");
				me.down("[name=m_marker]").setValue(option.m_marker || "");
				me.down("[name=m_min]").setValue(option.m_min || "1000");
				me.down("[name=m_max]").setValue(option.m_max || "10000");
				me.down("[name=cdata_m_tmpl]").setValue(option.cdata_m_tmpl);
				me.down("[name=m_xypos]").setValue(option.m_xypos || "");
			}
		},
		
		updateOptionValues: function() {
			var me = this,
				option = chartoption;
			
			if (option)
			{
				option.m_zoom_level = "" + me.down("[name=m_zoom_level]").getValue();
				option.m_marker = me.down("[name=m_marker]").getValue();
				option.m_min = "" + me.down("[name=m_min]").getValue();
				option.m_max = "" + me.down("[name=m_max]").getValue();
				option.cdata_m_tmpl = me.down("[name=cdata_m_tmpl]").getValue();
				option.m_xypos = me.down("[name=m_xypos]").getValue();
			}
		},
		invalidateFields: function(opt) {
			var me = this,
				subtype = opt.subtype;
			
			me.down("[name=pb01]").setVisible(subtype == "googlemap" || subtype == "navermap" || subtype == "vworldmap");
			me.down("[name=m_xypos]").setVisible(subtype == "vworldmap");
			me.down("[name=pb02]").setVisible(subtype == "kpi");
		},
		items: [
			{
				xtype: "container",
				layout: "anchor",
				name: "pb01",
				hidden: true,
				items: [
					{
						xtype: "fieldset",
						title: "Map options",
						layout: "anchor",
						
						items: [
							{
								xtype: "numberfield",
								name: "m_zoom_level",
								fieldLabel: "Zoom Level",
								minValue: 1,
								maxValue: 10
							}
						]
					},
					{
						xtype: "fieldset",
						title: "Map Draw options",
						layout: "anchor",
						items: [
							{
								xtype: "combobox",
								name: "m_marker",
								queryMode: "local",
								displayField: "name",
								valueField: "value",
								editable: false,
								autoSelect: true,
								fieldLabel: "Palette",
								store: {
									xtype: "store",
									fields: ["name", "value"],
									data: [
										{name: "Marker", value: ""},
										{name: "Circle", value: "circle"},
										{name: "Info", value: "info"}
									]
								},
								listeners: {
									change: function(tobj) {
										var me = this,
											sval = tobj.getValue();
											
										panel.down("[name=cdata_m_tmpl]").setVisible(sval == "info");
									},
									scope: this
								}
							},
							{
								xtype: "numberfield",
								fieldLabel: "Min radius",
								name: "m_min",
								minValue: 100,
								maxValue: 1000000
							},
							{
								xtype: "numberfield",
								fieldLabel: "Max radius",
								name: "m_max",
								minValue: 100,
								maxValue: 10000000
							},
							{
								xtype: "textarea",
								anchor: "100%",
								fieldLabel: "Template",
								name: "cdata_m_tmpl",
								hidden: true
							},
							{
								xtype: "combobox",
								name: "m_xypos",
								queryMode: "local",
								displayField: "name",
								valueField: "value",
								editable: false,
								autoSelect: true,
								hidden: true,
								fieldLabel: "GeoCode",
								store: {
									xtype: "store",
									fields: ["name", "value"],
									data: [
										{name: "Unknown", value: ""},
										{name: "EPSG:4326", value: "EPSG:4326"},
										{name: "EPSG:3857", value: "EPSG:3857"}
									]
								}
							}
						]
					}
				]
			},
			{
				xtype: "fieldset",
				title: "KPI Indicator",
				layout: "anchor",
				hidden: true,
				name: "pb02",
				items: [
					{
						xtype: "button",
						text: "Indicator Wizard",
						handler: function() {
							if (chartoption)
							{
								if (!IG$/*mainapp*/.kpi_1/*dlg_vindicator*/)
								{
									var me = this,
										js = [
											"./custom/custom.kpi.worker.js"
										],
										ltest = 0;
									
									IG$/*mainapp*/.x03/*getScriptCache*/(
										js, 
										new IG$/*mainapp*/._I3d/*callBackObj*/(me, function() {
											if (IG$/*mainapp*/.kpi_1/*dlg_vindicator*/)
											{
												var cindopt = new IG$/*mainapp*/.kpi_2/*cindicator*/(chartoption.cindicator);
												var dlg = new IG$/*mainapp*/.kpi_1/*dlg_vindicator*/({
													cop: chartoption,
													cindicator: cindopt
												});
												dlg.show();
											}
										})
									);
								}
								else
								{
									var cindopt = new IG$/*mainapp*/.kpi_2/*cindicator*/(chartoption.cindicator);
									var dlg = new IG$/*mainapp*/.kpi_1/*dlg_vindicator*/({
										cop: chartoption,
										cindicator: cindopt
									});
									dlg.show();
								}
							}
						},
						scope: this
					}
				]
			}
		],
		listeners: {
			afterrender: function(p) {
				p.initData.call(p);
			}
		}
	});
	
	panel.add(p2);
	cpanels.push(p2);
	
	// for map chart extension	
	var p3 = $s.create($s.formpanel, {
		id: "card-8",
		layout: "anchor",
		border: 0,
		title: "Stock Options",
		defaults: {
			anchor: "100%"
		},
		initData: function() {
			var me = this,
				option = chartoption,
				rows = wizard._ILb/*sheetoption*/.rows,
				s_t_f = me.down("[name=s_t_f]"),
				s_t_fo = me.down("[name=s_t_fo]"),
				rdp = [
					{name: "Select Item", uid: ""}
				];
			
			if (option)
			{
				for (i=0; i < rows.length; i++)
				{
					rdp.push({
						name: rows[i].name,
						uid: rows[i].uid
					});
				}
				
				s_t_f.store.loadData(rdp);
				s_t_f.setValue(option.s_t_f || "");
				s_t_fo.setValue(option.s_t_fo);
			}
		},
		
		updateOptionValues: function() {
			var me = this,
				option = chartoption,
				s_t_f = me.down("[name=s_t_f]");
			
			if (option)
			{
				option.s_t_f = s_t_f.getValue();
				option.s_t_fo = me.down("[name=s_t_fo]").getValue();
			}
		},
		items: [
			{
				xtype: "fieldset",
				title: "Time Field",
				layout: "anchor",
				items: [
					{
						xtype: "combobox",
						name: "s_t_f",
						fieldLabel: "Field Column",
						queryMode: "local",
						valueField: "uid",
						displayField: "name",
						editable: false,
						store: {
							xtype: "store",
							fields: ["name", "uid"]
						}
					},
					{
						xtype: "textfield",
						name: "s_t_fo",
						fieldLabel: "Date Format"
					}
				]
			}
		],
		listeners: {
			afterrender: function(p) {
				p.initData.call(p);
			}
		}
	});
	
	panel.add(p3);
	cpanels.push(p3);
	
	return cpanels;
}