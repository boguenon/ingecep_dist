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
			showlnum = sop ? sop.showlnum : false,
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
			        s1 = showlnum ? 1 : 0;
			        s2 = mresult.colfix + (showlnum ? 1 : 0);
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
IG$/*mainapp*/._IPc/*SheetView*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	uid: null,
	name: "sheet",
	"layout": "card",
	autoScroll:false,
	bodyBorder: false,
	scroll: false,
	
	_IK2/*mresults*/: null,
	_ILa/*reportoption*/: null,
	_ILb/*sheetoption*/: null,
	
	activeView: -1,
	_IL5/*directrun*/: false,
	layoutcomplete: false,
	border: 0,
	
	m1/*undo*/: null,
	
	_IFf/*confirmDialog*/: function(norun) {
//		if (!this._IH9/*pivotEditor*/)
//		{
//			return;
//		}
//		
		var me = this,
//			pivot = me._IH9/*pivotEditor*/.down("[name=pivoteditor]"),
//			c = false,
			sop = me._ILb/*sheetoption*/,
			prompts,
			activeview = me,
			reloadprompt = true;
//			
//		c = pivot._IFf/*confirmDialog*/.call(pivot);
//		
//		if (c)
//		{
			prompts = sop.needPrompt.call(sop);
			
			if (prompts && prompts.length > 0)
			{
				activeview._IKd/*promptpanel*/ && activeview._IKd/*promptpanel*/.setVisible(true);
				activeview.showPrompt.call(activeview, prompts);
			}
			else if (reloadprompt == true)
			{
				activeview._IKd/*promptpanel*/ && activeview._IKd/*promptpanel*/.setVisible(false);
			}
			
			!norun && me._IK2/*mresults*/ && me._IJ2/*procRunReport*/();
//		}
	},
	
	_l1/*scroll_request*/: function(row) {
		var me = this;
		
		clearTimeout(me.__s1);
		
		me.__s1 = setTimeout(function() {
			var r = row < 20 ? 0 : row - 20;
			me._IP7/*goPageView*/.call(me, r, r+200, true);
		}, 100);
	},
	
	Uc/*updateCubeSelection*/: function(cubeuid) {
		var me = this,
			sop = me._ILb/*sheetoption*/,
			bcube;
			// pivoteditor = me._IH9/*pivotEditor*/,
			// pc = pivoteditor ? me._IH9/*pivotEditor*/.down("[name=pivoteditor]") : null;
		
//		if (pc)
//		{
//			pc._IFf/*confirmDialog*/.call(pc);
//		}
		
		bcube = sop ? sop.Uc/*checkCubeAvailable*/.call(sop, cubeuid) : true;
		
		if (bcube)
		{
			sop.cubeuid = cubeuid;
		}
		
//		if (pc)
//		{
//			pc.Uc/*updateCubeSelection*/.call(pc, cubeuid, bcube);
//		}
	},
	
	__r1/*requestData*/: function(view, cview, option) {
		var me = this,
			doc, req,
			jobid,
			addr,
			sop = me._ILb/*sheetoption*/,
			h,
			cell = option ? option.cell : null,
			row = option ? option.row : null,
			i, j, fc,
			cparent,
			result = me._IK2/*mresults*/ && me._IK2/*mresults*/.results.length ? me._IK2/*mresults*/.results[0] : null,
			data = result ? result.data : null,
			dc, dk, mk;
		
		me._IIf/*customLoad*/(true, true);
		
		me._IJf/*invalidateChart*/ = true;
		me._IK1/*invalidateRstat*/ = true;
        me._IK1a/*invalidatePython*/ = true;
		
		if (me._IK9/*olapset*/ && me._IK9/*olapset*/._IL8/*jobid*/)
		{
			jobid = me._IK9/*olapset*/._IL8/*jobid*/;
			
			addr = "<smsg><item uid='" + (me.uid || "") + "' option='pivot' active='" + me.sheetindex + "' pivotresult='T'" + " jobid='" + (jobid || "") + "'>";
			addr += "<option source='" + (option.source || "map") + "' zoom='" + option.zoom + "'>";
			if (option.bound)
			{
				addr += "<bound x1='" + option.bound.x1 + "' y1='" + option.bound.y1 + "' x2='" + option.bound.x2 + "' y2='" + option.bound.y2 + "'/>";
			}
			else if (option.source == "hierarchy")
			{
				if (cell.position == 1)
				{
					h = sop.rows[cell.index];
				}
				addr += "<hierarchy uid='" + h.uid + "' depth='" + cell.celltree.depth + "'>";
				
				if (result)
				{
					addr += "<headers n='" + result.rowfix + "' c='" + (result.cols - result.colfix) + "'>";
					for (i=result.colfix; i < result.cols; i++)
					{
						addr += "<col n='" + (i-result.colfix) + "'>";
						dk = "";
						for (j=0; j < result.rowfix; j++)
						{
							dc = result.data[j][i];
							mk = (dc.code || "") + "_" + (dc.index) + "_" + dc.position;;
							dk = (j == 0) ? mk : dk + ":" + mk;
						}
						addr += "<![CDATA[" + dk + "]]>";
						addr += "</col>";
					}
					addr += "</headers>";
				}
				addr += "<values>";
				addr += "<value type='D' depth='" + cell.celltree.depth + "'>";
				addr += "<code><![CDATA[" + cell.code + "]]></code>";
				addr += "<text><![CDATA[" + cell.text + "]]></text>";
				addr += "</value>";
				
				cparent = cell.celltree.parent;
				
				while (cparent)
				{
					addr += "<value type='D' depth='" + cparent.celltree.depth + "'>";
					addr += "<code><![CDATA[" + cparent.code + "]]></code>";
					addr += "<text><![CDATA[" + cparent.text + "]]></text>";
					addr += "</value>";
					
					cparent = cparent.celltree.parent;
				}
				
				if (cell.index > 0)
				{
					for (i=0; i < cell.index; i++)
					{
						for (j=0; j < row.length; j++)
						{
							if (row[j].position == 1 && row[j].index == i)
							{
								fc = row[j];
								
								addr += "<value type='C' uid='" + sop.rows[i].uid + "'>";
								addr += "<code><![CDATA[" + fc.code + "]]></code>";
								addr += "<text><![CDATA[" + fc.text + "]]></text>";
								addr += "</value>";
							}
						}
					}
				}
				addr += "</values>";
				addr += "</hierarchy>";
			}
			addr += "</option>";
			addr += "</item></smsg>";
			
			doc = "<smsg></smsg>";
			
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(me, 
				{
		            ack: "18",
					payload: addr,
					mbody: doc
		        }, me, function(xdoc) {
		        	me._IK9/*olapset*/.r_IKb/*requestPivotResult*/.call(me._IK9/*olapset*/, xdoc, [null, me.sheetindex, null, null, null, null, null, cell]);
		        });
			req._l/*request*/();
		}
	},
	
	CLS: {
		afterrender: function() {
			var me = this;
			me.layoutcomplete = true;
			me._IFd/*init_f*/();
		},

		resize: function(comp, adjWidth, adjHeight, eOpts) {
			var me = this,
				w = comp.getWidth(),
				h = comp.getHeight();
			
			if (w ==0 || h == 0)
			{
				var el = $(comp.body.dom);
				w = comp.width;
				h = comp.height;
				
				if (el)
				{
					IG$/*mainapp*/.x_10/*jqueryExtension*/._w(el, w);
					IG$/*mainapp*/.x_10/*jqueryExtension*/._h(el, h);
				}
			}
			
			if (w > 0 && h > 0)
			{
				if (me.loadMask && me.rendermask)
				{
					me._IIf/*customLoad*/(true);
				}
				else if (me.loadMask)
				{
					me.setLoading(true);
				}
				// comp.rzone.setSize.call(comp.rzone, w, h);
				// comp.a3/*noresultpanel*/.setSize.call(comp.a3/*noresultpanel*/, w, h);
			}
		}
	},
	
	_IFd/*init_f*/: function() {
		var me = this,
			drawtype;
		
		if (me.rst)
		{
			drawtype = me._ILb/*sheetoption*/.viewmode;
			me._d/*drawResults*/(drawtype, me.rst);
			
			if (IG$/*mainapp*/.__ep)
			{
				if (drawtype == "grid")
				{
					
				}
			}
		}
		else if (me._IL5/*directrun*/ == true)
		{
			me._IJ2/*procRunReport*/();
		}
	},
	
	_d/*drawResults*/: function(viewmode, _IK2/*mresults*/) {
		this._IJe/*procLoadResult*/(_IK2/*mresults*/);
	},
	
	_IOf/*undolist*/: function() {
		var me = this,
			r = false,
			redo, ditem;
		
		if (me.m1/*undo*/ && me.m1/*undo*/.length > 0)
		{
			redo = me.m1/*undo*/.pop();
			switch (redo.type)
			{
			case "remove":
				redo.target.splice(redo.index, 0, redo.item);
				break;
			case "add":
				if (redo.item)
				{
					me._IP1/*removePivotItem*/(redo.item);
				}
				break;
			case "measurelocation":
				me._ILb/*sheetoption*/.measureposition = redo.measureposition;
				me._ILb/*sheetoption*/.measurelocation = redo.measurelocation;
				break;
			case "move":
				if (redo.item && redo.plocation && redo.pindex > -1)
				{
					ditem = me._IP1/*removePivotItem*/(redo.item);
					if (ditem)
					{
						redo.plocation.splice(redo.pindex, 0, ditem);
					}
				}
				break;
			case "property":
				redo.item[redo.name] = redo.value;
				break;
			}
			r = true;
		}
		
		return r;
	},
	
	_II9/*updateViewMode*/: function(viewmode) {
		var me = this,
			n;
		
		switch (viewmode)
		{
		case "chart":
			n = 1;
			break;
		case "r":
			n = 2;
			break;
		case "d":
			n = 3;
			break;
        case "python":
            n = 4;
            break;
		default:
			n = 0;
			break;
		}
		
		if (n == 3)
		{
			// if (me._IH9/*pivotEditor*/)
			// {
			// 	me._IH9/*pivotEditor*/.down("[name=pivoteditor]")._i1/*pivotChanged*/ = false;
			// }
			
			// me.rzone.show();
    		// me.a3/*noresultpanel*/.hide();
			// me.getLayout().setActiveItem(0);
			
			me.setActiveItem(0);
		}
		
		me._ILb/*sheetoption*/.viewmode = (n == 3 ? me._ILb/*sheetoption*/.viewmode : viewmode);
		// me.setActiveItem(n);
		me._cv/*changeView*/(n);
	},
	
	_IP0/*getClipboardContent*/: function() {
		var r = "";
		
		return r;
	},
	
	_IP1/*removePivotItem*/: function(item) {
		var me = this,
			i,
			sop = me._ILb/*sheetoption*/,
			bf = false,
			targetitem = null;
			
		for (i=0; i < sop.rows.length; i++)
		{
			if (sop.rows[i].uid == item.uid)
			{
				bf = true;
				targetitem = sop.rows[i];
				sop.rows.splice(i, 1);
				break;
			}
		}
		
		if (bf == false)
		{
			for (i=0; i < sop.cols.length; i++)
			{
				if (sop.cols[i].uid == item.uid)
				{
					bf = true;
					targetitem = sop.cols[i];
					sop.cols.splice(i, 1);
					break;
				}
			}
		}
		
		if (bf == false)
		{
			for (i=0; i < sop.measures.length; i++)
			{
				if (sop.measures[i].uid == item.uid)
				{
					bf = true;
					targetitem = sop.measures[i];
					sop.measures.splice(i, 1);
					break;
				}
			}
		}
		
		return targetitem;
	},
	
	_IP2/*registerUndo*/: function(redo) {
		var me = this;
		me.m1/*undo*/ = (me.m1/*undo*/ == null) ? [] : me.m1/*undo*/;
		me.m1/*undo*/.push(redo);
	},
	
	_IL7/*getDrillXML*/: function(dobj) {
		var me = this,
			r = '';
		if (me.activeView == 0)
		{
			r = me._IH6/*gridcontainer*/._IL7/*getDrillXML*/.call(me._IH6/*gridcontainer*/, dobj);
		}
		else if (me.activeView == 1)
		{
			r = me._IH7/*chartcontainer*/._IL7/*getDrillXML*/.call(me._IH7/*chartcontainer*/, dobj);
		}
		else if (me.activeView == 2)
		{
			r = me._IH8/*rcontainer*/._IL7/*getDrillXML*/.call(me._IH8/*rcontainer*/, dobj);
		}
		else if (me.activeView == 3)
		{
            r = me._IH8a/*pythoncontainer*/._IL7/*getDrillXML*/.call(me._IH8a/*pythoncontainer*/, dobj);
		}

		return r;
	},
	
	_IP3/*getSelection*/: function() {
		var me = this,
			r = null;
		if (me.activeView == 0)
		{
			r = me._IH6/*gridcontainer*/._IP3/*getSelection*/.call(me._IH6/*gridcontainer*/);
		}
		return r;
	},
	
	_IP4/*procUpdateReport*/: function(startpage, endpage, is_scroll) {
		var me = this,
			doc;
			
		if (me.activeView == 3)
			return;
		
		me._IIf/*customLoad*/(true, true);
		
		me._IJf/*invalidateChart*/ = true;
		me._IK1/*invalidateRstat*/ = true;
        me._IK1a/*invalidatePython*/ = true;
		
		if (me._job && me._job.sid && me._job.jid)
		{
			if (!me._IK9/*olapset*/)
			{
				me._IK9/*olapset*/ = new IG$/*mainapp*/._IKa/*reqolap*/();
				me._IK9/*olapset*/.ctrlsource = 'report';
				me._IK9/*olapset*/.panel = me;
				me._IK9/*olapset*/.uid = me.uid;
				me._IK9/*olapset*/.sheet = null;
				me._IK9/*olapset*/.chart = null;
			}
			
			me._IK9/*olapset*/._ILa/*reportoption*/ = me._ILa/*reportoption*/;
			// me._IK9/*olapset*/._IL8/*jobid*/ = me._job.jobid;
		}
		
		if (me._IK9/*olapset*/ && (me._IK9/*olapset*/._IL8/*jobid*/ || me._job))
		{
			doc = me._ILa/*reportoption*/._IJ1/*getCurrentPivot*/();
			me._IK9/*olapset*/._IKb/*requestPivotResult*/.call(me._IK9/*olapset*/, doc, null, me.sheetindex, null, startpage, endpage, null, me._job, is_scroll);
		}
		else
		{
			me._IJ2/*procRunReport*/();
		}
	},
	
	_IIf/*customLoad*/: function(visible) {
		if (visible == true)
		{
			var me = this,
				btn,
				dom,
				lm,
				ld,
				rop = me._ILa/*reportoption*/;
			
			if (rop && rop.ploader)
			{
				me.fireEvent("_ld_", me);
			}
			else
			{
				lm = {
					msg: IRm$/*resources*/.r1("B_PROC") + " <button id='m-mec-loader'>" + IRm$/*resources*/.r1("B_PROC_CANCEL") + "</button>"
				};
				
				ld = me.setLoading(lm);
				
				dom = $(me.rendermask);
				// dom.width(me.getWidth()).height(me.getHeight());
				
				btn = $("#m-mec-loader", dom).bind("click", function() {
					me._IP5/*cancelQuery*/.call(me);
				});
			}
		}
	},
	
	_IP5/*cancelQuery*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		if (panel.jobid)
		{
			req.init(panel, 
				{
		            ack: "18",
					payload: "<smsg><item jobid='" + panel.jobid + "' option='cancel'/></smsg>",
					mbody: "<smsg></smsg>"
		        }, panel, panel.r_IP5/*cancelQuery*/, null);
			req.showerror = false;
			req._l/*request*/();
		}
	},
	
	r_IP5/*cancelQuery*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tstatus = tnode ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "status") : null;
			
		if (tstatus == "S")
		{
			me.setLoading(false);
		}
	},
	
	getResultSet: function() {
		return this._IK2/*mresults*/ && this._IK2/*mresults*/.results ? this._IK2/*mresults*/.results : null;
	},
	
	_IJe/*procLoadResult*/: function(_IK2/*mresults*/) {
		var me = this,
			sop = me._ILb/*sheetoption*/,
			drawtype = sop ? sop.viewmode : "grid";
		
		me._job = _IK2/*mresults*/._job;
		
		if (me._ILa/*reportoption*/ && me._ILa/*reportoption*/.iscomposite == true)
		{
			viewmode = 'grid';
			me._ILa/*reportoption*/._IK2/*mresults*/ = _IK2/*mresults*/;
		}
		else
		{
			viewmode = me._ILb/*sheetoption*/.viewmode;
			sop._IK2/*mresults*/ = _IK2/*mresults*/;
		}
		
		me._IK2/*mresults*/ = _IK2/*mresults*/;
		
		var active = me.activeView;
		
		me._IJf/*invalidateChart*/ = true;
		me._IK0/*invalidateGrid*/ = true;
		me._IK1/*invalidateRstat*/ = true;
        me._IK1a/*invalidatePython*/ = true;
		
		if (viewmode == "grid")
		{
			if (active != 0 && active !=3 && me._cv/*changeView*/) // me.setActiveItem)
			{
				if (me._IK3/*reportpanel*/ && me._IK3/*reportpanel*/._IK4/*hideChartToolbar*/)
				{
					me._IK3/*reportpanel*/._IK4/*hideChartToolbar*/.call(me._IK3/*reportpanel*/);
				}
				// me.setActiveItem.call(me, 0);
				me._cv/*changeView*/.call(me, 0);
			}
			else
			{
				me._IK5/*updateSheetUI*/(me, me.sheetindex);
			}
		}
		else if (viewmode == "chart")
		{
			if (active != 1 && active !=3 && me._cv/*changeView*/) // me.setActiveItem)
			{
				if (me._IK3/*reportpanel*/ && me._IK3/*reportpanel*/._IK6/*showChartToolbar*/)
				{
					me._IK3/*reportpanel*/._IK6/*showChartToolbar*/.call(me._IK3/*reportpanel*/);
				}
				// me.setActiveItem(1);
				me._cv/*changeView*/(1);
			}
			else
			{
				me._IP8/*updateChartUI*/(me, me.sheetindex);
			}
		}
		else if (viewmode == "r")
		{
			if (active != 2 && active !=3 && me._cv/*changeView*/) // me.setActiveItem)
			{
				if (me._IK3/*reportpanel*/)
				{
					me._IK3/*reportpanel*/._IK4/*hideChartToolbar*/.call(me._IK3/*reportpanel*/);
					me._IK3/*reportpanel*/._IK7/*setRToolbar*/.call(me._IK3/*reportpanel*/, true);
				}
				// me.setActiveItem(2);
				me._cv/*changeView*/(2);
			}
			else
			{
				me._IK8/*updateRstat*/(me, me.sheetindex);
			}
		}
        else if (viewmode == "python")
        {
            if (active != 3 && me._cv/*changeView*/)
            {
                if (me._IK3/*reportpanel*/)
                {
                    me._IK3/*reportpanel*/._IK4/*hideChartToolbar*/.call(me._IK3/*reportpanel*/);
                }
                
                me._cv/*changeView*/(4);
            }
            else
            {
                me._IK8a/*updatePython*/(me, me.sheetindex);
            }
        }
		
		me.fireEvent("result_loaded", me);
		
		me._refresh_timer && clearTimeout(me._refresh_timer);
		
		if (me._ILb/*sheetoption*/ && me._ILb/*sheetoption*/.autorefresh && me._ILb/*sheetoption*/.refresh_timer > 1)
		{
			me._refresh_timer = setTimeout(function() {
				me._IJ2/*procRunReport*/(null, null, 1);
			}, me._ILb/*sheetoption*/.refresh_timer * 1000);
		}
	},
    
    _b1/*beforeRun*/: function() {
        var me = this;
        
        if (me._ILb/*sheetoption*/ && me._ILb/*sheetoption*/.viewmode == "python")
        {
            if (me._IH8a/*pythoncontainer*/)
            {
                me._IH8a/*pythoncontainer*/._do_edit(0);
            }
        }
    },
	
	_IJ2/*procRunReport*/: function(jobid, setprompt, is_timer) {
    	var me = this,
    		config,
    		doc,
    		drawtype,
    		sop,
    		prompts,
    		w, h,
    		loader = 0;
    	
    	delete me.btabrun;
    	
    	clearTimeout(me._refresh_timer);
    	
    	me.__el/*executioncode*/ = 1;
    	
    	if (!is_timer || (is_timer && me._ILa/*reportoption*/ && !me._ILa/*reportoption*/.phideloader))
    	{
    		loader = 1;
    		me._IIf/*customLoad*/(true, true);
    	}    	
    	
    	// w = me.body.getWidth();
		// h = me.body.getHeight();
		
		w = me.getWidth();
		h = me.getHeight();
		
		me._IJf/*invalidateChart*/ = true;
		me._IK1/*invalidateRstat*/ = true;
        me._IK1a/*invalidatePython*/ = true;
		
		if (!me._IK9/*olapset*/)
		{
			me._IK9/*olapset*/ = new IG$/*mainapp*/._IKa/*reqolap*/();
			me._IK9/*olapset*/.ctrlsource = 'report';
			me._IK9/*olapset*/.panel = me;
			me._IK9/*olapset*/.uid = me.uid;
			me._IK9/*olapset*/.sheet = null;
			me._IK9/*olapset*/.chart = null;
		}
		
		me._IK9/*olapset*/._IL8/*jobid*/ = (jobid) ? jobid : null;
		
		if (me._ILa/*reportoption*/)
		{
			me._ILa/*reportoption*/._dfilter = me._dfilter;
			me._IK9/*olapset*/._ILa/*reportoption*/ = me._ILa/*reportoption*/;
			
			if (me._ILa/*reportoption*/.iscomposite == false)
			{
				sop = me._ILa/*reportoption*/.sheets[me.sheetindex];
				prompts = sop.needPrompt.call(sop);
			}
			
			if (setprompt !== true && prompts && prompts.length > 0)
			{
				me.setLoading(false);
//				var promptwin = new IG$/*mainapp*/._Ib5/*promptdlg*/({
//					prompts: prompts,
//					callback: new R$2d/callBackObj/(me, me.rs_showPrompt)
//				});
//				promptwin.show();
				
				me.showPrompt(prompts);
			}
			else
			{
				doc = me._ILa/*reportoption*/._IJ1/*getCurrentPivot*/();
				drawtype = me._ILb/*sheetoption*/.viewmode;
				
				if (me._IK9/*olapset*/ && me._IK9/*olapset*/._IL8/*jobid*/)
				{
			    	me._IK9/*olapset*/._IKb/*requestPivotResult*/.call(me._IK9/*olapset*/, doc, null, me.sheetindex);
			    }
			    else if (me._IK9/*olapset*/)
			    {
			    	me._IK9/*olapset*/._IJ0/*requestUpdateReport*/.call(me._IK9/*olapset*/, doc, drawtype, me.sheetindex, me, null, !loader);
			    }
			}
		}
		else
		{
			me.setLoading(false);
			// panel.addListener('show', panel._IB5/*showReportOption*/, panel);
			/*
			setTimeout(function() {
				panel.ownerCt.sr/showReportOption/.call(panel.ownerCt);
			}, 1200);
			*/
		}
    },
    
    showPrompt: function(prompts) {
    	var me = this;
    	
    	me._IKd/*promptpanel*/.sheetindex = "" + me.sheetindex;
    	me._IKd/*promptpanel*/._ILa/*reportoption*/ = me._ILa/*reportoption*/;
    	me._IKd/*promptpanel*/.prompts = prompts;
    	me._IKd/*promptpanel*/._IFd/*init_f*/.call(me._IKd/*promptpanel*/);
		me._IKd/*promptpanel*/.setVisible(true);
    },
    
    rs_showPrompt: function() {
    	this._IJ2/*procRunReport*/(null, true);
    },
    
    _IK5/*updateSheetUI*/: function(panel, activesheet) {
    	var me = this,
    		tw,
    		th,
    		cw, ch,
    		gridview,
			ispageview;
			
		me.a1/*updateNoData*/();
			
    	if (me._IH6/*gridcontainer*/ && me._IK0/*invalidateGrid*/ == true && me._IK2/*mresults*/)
		{
			ispageview = me._IKe/*updatePageView*/();
			
			me._IK0/*invalidateGrid*/ = false;
			
			me._IH6/*gridcontainer*/._IL0/*initCustomControl*/.call(me._IH6/*gridcontainer*/);
			me._IH6/*gridcontainer*/._IKc/*applyReportResult*/.call(me._IH6/*gridcontainer*/, panel._IK2/*mresults*/, panel._IK9/*olapset*/, panel._ILa/*reportoption*/, panel._ILb/*sheetoption*/, ispageview);
			
			if (IG$/*mainapp*/.__ep)
			{
				gridview = me._IH6/*gridcontainer*/.G1/*gridview*/._0x030/*mgrid*/;
				tw = gridview.twidth + gridview.fixedColWidth;
				th = gridview.theight + gridview.fixedRowHeight;
				cw = gridview.cwidth;
				ch = gridview.cheight;
				
				if (tw > 0 && th > 0 && (tw > cw || th > ch))
				{
					me.fireEvent("cresized", me, {
						tw: tw, 
						th: th, 
						cw: cw, 
						ch: ch
					});
				}
			}
		}
    },
    
    _IKe/*updatePageView*/: function() {
    	var me = this,
    		pageview = false,
			sop = me._ILb/*sheetoption*/,
			pagepanel = me.down("[name=pagepanel]"),
			mr;
		if (sop.usepaging == "T" && me._IK2/*mresults*/ && me._IK2/*mresults*/.results && me._IK2/*mresults*/.results.length == 1)
		{
			mr = me._IK2/*mresults*/.results[0];
			if (mr.pagestart > 0 || mr.pageend < mr.rows)
			{
				pageview = true;
			}
		}
		
		if (pageview == true)
		{
			me._IKf/*setPageView*/();
		}
		else
		{
			pagepanel.setVisible(false);
		}
		
		return pageview;
    },
    
    exportSheet: function(filetype) {
    	var me = this;
    	
    	me.fireEvent("export_sheet", me, {
    		filetype: filetype
    	});
    },
    
    _IP6/*downloadAllCSV*/: function() {
    	var me = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		fname = me._ILa/*reportoption*/.name + " " + (me._ILb/*sheetoption*/.title || "sheet"),
    		filetype = "csv",
    		jobid = me._IK9/*olapset*/ ? me._IK9/*olapset*/._IL8/*jobid*/ : "";
    	
    	fname = fname.replace(/\./g, "_");
    	fname = fname.replace(/ /g, "");
    	
    	fname = fname + ".csv";
    	
    	if (jobid)
    	{
	    	me.setLoading(true);
	    	
			req.init(me, 
	    			{
		                ack: "20",
			            payload: "<smsg><item uid='" + me.uid + "' jobid='" + jobid + "' type='" + filetype + "' filename='" + fname + "' option='instanceload'/></smsg>",
			            mbody: "<smsg></smsg>"
		            }, me, me.r_IB3/*exportToFile*/, null, fname);
		    req._l/*request*/();
		}
    },
    
    _Ip7/*ml_learn*/: function() {
    	var me = this,
			jobid = me._IK9/*olapset*/ ? me._IK9/*olapset*/._IL8/*jobid*/ : "",
			scripts;
    	
    	if (jobid)
    	{
    		if (IG$/*mainapp*/.bA_2/*learning_dialog*/)
    		{
    			me._Ip7A/*ml_learn*/.call(me, jobid);
    		}
    		else
    		{
	    		scripts = ig$/*appoption*/.scmap["igc9"];
				
				IG$/*mainapp*/.x03/*getScriptCache*/(
					scripts, 
					new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
						if (IG$/*mainapp*/.bA_2/*learning_dialog*/)
						{
							me._Ip7A/*ml_learn*/.call(me, jobid);
						}
						else
						{
							IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("L_ERR_L_MOD"));
						}
					})
				);
    		}
    	}
    },
    
    _Ip7A/*ml_learn*/: function(jobid) {
    	var me = this,
    		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
    		dlg;
    	
    	dlg = new IG$/*mainapp*/.bA_2/*learning_dialog*/({
    		jobid: jobid,
    		fname: me._ILa/*reportoption*/.name + " " + (me._ILb/*sheetoption*/.title || "sheet")
    	});
    	dlg.show();
    },
    
    r_IB3/*exportToFile*/: function(xdoc, fname) {
    	var me = this,
    		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/info'),
    		fileuid,
    		fname;
    		
    	me.setLoading(false);
    	
    	if (IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'status') == 'complete')
    	{
    		fileuid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'downloadurl');
    		fname = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'filename') || fname;
    		
    		$.download(ig$/*appoption*/.servlet, [
    			{name: "ack", value: "35"},
    			{name: "_mts_", value: IG$/*mainapp*/._g$a/*global_mts*/ || ""},
				{name: "payload", value: fileuid},
				{name: "mbody", value: fname}], 'POST');
    	}
    },
    
    _IKf/*setPageView*/: function() {
    	var me = this,
    		pagepanel = me.down("[name=pagepanel]"),
    		mdiv = $("#idv-pgview", pagepanel.body.dom),
    		result = me._IK2/*mresults*/.results[0],
    		i, pgcount,
    		ntotal,
    		sop = me._ILb/*sheetoption*/,
    		rowperpage = sop.rowperpage,
    		pagestyle = sop.pagestyle || "p10",
    		pgnum, pgstart, pgend, pga,
    		pagestart = result.pagestart,
    		mul, ppg = 10,
    		pgn = [], mdivp,
    		mcsv;
    		
    	mdiv.empty();
    	
    	if (pagestyle == "p10")
    	{
    		ppg = 10;
    	}
    	else if (pagestyle == "p5")
    	{
    		ppg = 5;
    	}
    	
    	mdivp = $("<div class='idv-pglist'></div>").appendTo(mdiv);
    	mul = $("<ul></ul>").appendTo(mdivp);
    	
    	ntotal = result.rows - result.rowfix;
    	pgcount = Math.ceil(ntotal/rowperpage);
    	
    	if (pgcount > 1 && sop.usepaging == "T")
    	{
    		pagepanel.setVisible(true);
    		
    		pgstart = Math.floor(pagestart / rowperpage);
    		
			mcsv = $("<div class='idv-pg-dwn-csv' title='Download data in CSV'></div>").appendTo(mdiv);
			
			mcsv.bind("click", function() {
				me._IP6/*downloadAllCSV*/.call(me);
			});
			    		
    		if (pagestyle == "button2")
    		{
    			if (pgstart > 0)
	    		{
	    			var bprev = $("<li><span>&lt;&lt;</span></li>").appendTo(mul);
	    			bprev.bind("click", function() {
	    				var n = (pgstart-1) * rowperpage;
	    				me._IP7/*goPageView*/.call(me, n);
	    			});
	    		}
	    		
	    		$("<li><span>" + (pgstart+1) + " / " + pgcount + " pages</span></li>").appendTo(mul);
	    		
	    		if (pgstart + 1 < pgcount)
	    		{
	    			var bnext = $("<li><span>&gt;&gt;</span></li>").appendTo(mul);
	    			bnext.bind("click", function() {
	    				var n = (pgstart + 1) * rowperpage;
	    				me._IP7/*goPageView*/.call(me, n);
	    			});
	    		}
    		}
    		else
    		{
    			pga = Math.floor(pgstart / ppg) * ppg;
    			
	    		pgend = pga + ppg;
	    		pgend = Math.min(pgcount, pgend);
	    		
	    		if (pga > 0)
	    		{
	    			var bprev = $("<li><span>&lt;&lt;</span></li>").appendTo(mul);
	    			bprev.bind("click", function() {
	    				var n = (pga-1) * rowperpage;
	    				me._IP7/*goPageView*/.call(me, n);
	    			});
	    		}
	    		
	    		for (i=pga; i < pgend; i++)
	    		{
	    			pgn.push(i);
	    		}
	    		
	    		$.each(pgn, function(i, npg) {
	    			var pgnum = (npg+1);
	    			var btn = $("<li" + (npg == pgstart ? " class='active'" : "") + "><span>" + pgnum + "</span></li>").appendTo(mul);
	    			
	    			if (npg != pgstart)
	    			{
		    			btn.bind("click", function() {
		    				var n = npg * rowperpage;
		    				me._IP7/*goPageView*/.call(me, n);
		    			});
		    		}
	    			
	    		});
	    		
	    		if (pgend < pgcount)
	    		{
	    			var bnext = $("<li><span>&gt;&gt;</span></li>").appendTo(mul);
	    			bnext.bind("click", function() {
	    				var n = pgend * rowperpage;
	    				me._IP7/*goPageView*/.call(me, n);
	    			});
	    		}
	    	}
    	}
    	else
    	{
    		pagepanel.setVisible(false);
    	}
    },
    
    _IP7/*goPageView*/: function(pgnum, pgend, is_scroll) {
    	var me = this,
    		req;
    	
    	me._IP4/*procUpdateReport*/(pgnum, pgend, is_scroll);
    },
    
    r_ILd/*doScheduleJob*/: function(xdoc, params) {
    	
    },
    
    _IP8/*updateChartUI*/: function(panel, activesheet) {
    	var me = this,
    		i,
    		w,
    		h,
    		toolbaritems = [],
			ispageview;
			
		me.a1/*updateNoData*/();
    	
    	if (me._IJf/*invalidateChart*/ == true)
		{
			ispageview = me._IKe/*updatePageView*/();
			
			me._IJf/*invalidateChart*/ = false;
			
			if (me._IH7/*chartcontainer*/)
			{
				me._IH7/*chartcontainer*/._IL0/*initCustomControl*/.call(me._IH7/*chartcontainer*/);
				//panel.chartcontainer.tbar.removeAll();
				
				me._IH7/*chartcontainer*/._IKc/*applyReportResult*/.call(me._IH7/*chartcontainer*/, panel._IK2/*mresults*/, panel._IK9/*olapset*/, panel._ILa/*reportoption*/, panel._ILb/*sheetoption*/, ispageview);
			}
			// me.chartcontainer.doLayout();
		}
    },
    
    _IK8/*updateRstat*/: function(panel, activesheet) {
    	// todo Rstat
    	var me = this;
    	
    	if (me._IK1/*invalidateRstat*/ == true)
    	{
    		me._IKe/*updatePageView*/();
    		me._IK1/*invalidateRstat*/ = false;
    		me.a1/*updateNoData*/(true);
    		me._IH8/*rcontainer*/._IKc/*applyReportResult*/.call(me._IH8/*rcontainer*/, panel._IK2/*mresults*/, panel._IK9/*olapset*/, panel._ILa/*reportoption*/, panel._ILb/*sheetoption*/);
    	}
    	else
    	{
    		me.a1/*updateNoData*/();
    	}
    },
    
    _IK8a/*updatePython*/: function(panel, activesheet) {
        var me = this;
        
        if (me._IK1a/*invalidatePython*/)
        {
            me._IKe/*updatePageView*/();
            me._IK1a/*invalidatePython*/ = false;
            me.a1/*updateNoData*/(true);
            me._IH8a/*pythoncontainer*/._IKc/*applyReportResult*/.call(me._IH8a/*pythoncontainer*/, panel._IK2/*mresults*/, panel._IK9/*olapset*/, panel._ILa/*reportoption*/, panel._ILb/*sheetoption*/);
        }
        else
        {
            me.a1/*updateNoData*/();
        }
    },
    
    a1/*updateNoData*/: function(b_force) {
    	var me = this,
    		haveresults = b_force ? true : false,
    		sheet = me._ILb/*sheetoption*/,
    		gfilter;
    	
    	if (!haveresults && me._IK2/*mresults*/ && me._IK2/*mresults*/.results.length > 0 && 
    		((me._IK2/*mresults*/.results.length == 1 && me._IK2/*mresults*/.results[0].m1/*havenoresult*/ == false) || me._IK2/*mresults*/.results.length > 1))
    	{
    		haveresults = true;
    	}
    	else if (sheet && sheet.mdf && me._IK2/*mresults*/ && me._IK2/*mresults*/.results.length > 0)
    	{
    		for (var key in sheet.mdf)
			{
				gfilter = sheet.mdf[key];
				if (gfilter && gfilter.op)
				{
					haveresults = true;
					break;
				}
			}
    	}
    	
 		me.setActiveItem(haveresults || me.activeView == 3 ? 0 : 1);
    },
    
    _cv/*changeView*//*setActiveItem*/: function (index) {
    	var me = this,
    		reportarea = me.a2_,
    		w = reportarea.getWidth(),
    		h = reportarea.getHeight();
    		
    	me.activeView = index;
    	
    	me.a1/*updateNoData*/();
    	
    	switch (index)
    	{
    	case 0:
    		if (!me._IH6/*gridcontainer*/)
    		{
	    		me._IH6/*gridcontainer*/ = new IG$/*mainapp*/.rp$R/*sheetviewer*/({
					"layout": 'fit',
					sheetobj: this,
					width: w,
					height: h,
					flex: 1,
					html: '',
					_ILa/*reportoption*/: me._ILa/*reportoption*/,
					_ILb/*sheetoption*/: me._ILb/*sheetoption*/,
					listeners: {
						drillreport: function(view) {
							var me = this;
							me.fireEvent("drillreport", me);
						},
						itemclick: function(view, renderer) {
							var me = this;
							me.fireEvent("itemclick", me, renderer);
						},
						itemdblclick: function(view, renderer) {
							var me = this;
							me.fireEvent("itemdblclick", me, renderer);
						},
						menu: function(view, el) {
							var me = this;
							me.fireEvent("menu", me, el);
						},
						pivotchanged: function(view) {
							var me = this;
							me.fireEvent("pivotchanged", me);
						},
						scroll_request: function(view, row) {
							var me = this,
								r = row;
							r = (r - 50) > 0 ? r - 50 : r;
							me._l1/*scroll_request*/.call(me, r);
						},
						request_data: function(view, cview, option) {
							var me = this;
							me.__r1/*requestData*/.call(me, view, cview, option);
						},
						hierarchy: function(view, opt) {
							var me = this,
								option = {
									source: "hierarchy",
									cell: opt.cell,
									row: opt.row
								};
							
							me.__r1/*requestData*/.call(me, view, null, option);
						},
						scope: this
					}
				});
				
				reportarea.add(me._IH6/*gridcontainer*/);
			}
    		break;
    	case 1:
    		if (!me._IH7/*chartcontainer*/)
    		{
	    		me._IH7/*chartcontainer*/ = new IG$/*mainapp*/.rp$C/*chartViewer*/({
					"layout": 'fit',
					flex: 1,
					html: '',
					width: w,
					height: h,
					frame: false,
					margins: '0 0 0 0',
					cmargins: '0 0 0 0',
					_IPb/*maincontainer*/: this,
					showtoolbar: true,
					listeners: {
						drillreport: function(view) {
							var me = this;
							me.fireEvent("drillreport", me);
						},
						itemclick: function(view, renderer) {
							var me = this;
							me.fireEvent("itemclick", me, renderer);
						},
						itemdblclick: function(view, renderer) {
							var me = this;
							me.fireEvent("itemdblclick", me, renderer);
						},
						menu: function(view, el) {
							var me = this;
							me.fireEvent("menu", me, el);
						},
						pivotchanged: function(view) {
							var me = this;
							me.fireEvent("pivotchanged", me);
						},
						scroll_request: function(view, row) {
							var me = this;
							me._l1/*scroll_request*/.call(me, row);
						},
						request_data: function(view, cview, option) {
							var me = this;
							me.__r1/*requestData*/.call(me, view, cview, option);
						},
						hierarchy: function(view, cell) {
							var me = this;
							me.__r1/*requestData*/.call(me, view, cview, option);
						},
						scope: this
					}
				});
				
				reportarea.add(me._IH7/*chartcontainer*/);
			}
			break;
    	case 2:
    		if (!me._IH8/*rcontainer*/)
    		{
    			me._IH8/*rcontainer*/ = new IG$/*mainapp*/.rp$RR/*rstatistics*/({
					layout: "fit",
					flex: 1,
					width: w,
					height: h,
					sheetobj: this,
					_ILa/*reportoption*/: me._ILa/*reportoption*/,
					_ILb/*sheetoption*/: me._ILb/*sheetoption*/
				});
				
				reportarea.add(me._IH8/*rcontainer*/);
    		}
    		break;
    	case 3:
			if (!me._IH9/*pivotEditor*/)
			{
				me._IH9a/*pivotEditorDIV*/ = new IG$/*mainapp*/.pb({
					bodycls: "igc-peditor"
//					layout: "fit",
//					listeners: {
//						resize: function(tobj) {
//							me._IH9/*pivotEditor*/ && me._IH9/*pivotEditor*/.setSize(tobj.getWidth(), tobj.getHeight());
//						},
//						scope: this
//					}
				});
				
				reportarea.add(me._IH9a/*pivotEditorDIV*/);
			}
//				
//				me._IH9/*pivotEditor*/ = Ext.create(Ext.panel.Panel, {
//					layout: "fit",
//					renderTo: me._IH9a/*pivotEditorDIV*/.body.dom[0],
//					width: w,
//					height: h,
//					autoScroll: true,
//					border: 0,
//					items: [
//						new IG$/*mainapp*/._IGe/*pivot*/({
//							name: "pivoteditor",
//							layoutmode: "panel",
//							_i0/*pivotEditorMode*/: true,
//							border: 0,
//							minWidth: 300,
//							minHeight: 420,
//							_IJa/*activeSheet*/: this.sheetindex,
//							_ILa/*reportoption*/: this._ILa/*reportoption*/,
//							_ILb/*sheetoption*/: this._ILb/*sheetoption*/,
//							reportmode: this.reportmode,
//							cubeuid: this.cubeuid
//						})
//					]
//				});
//			};
			break;
        case 4:
            if (!me._IH8a/*pythoncontainer*/)
            {
                me._IH8a/*pythoncontainer*/ = new IG$/*mainapp*/.rp$RPa/*python*/({
					layout: "fit",
					flex: 1,
					width: w,
					height: h,
					sheetobj: this,
					_ILa/*reportoption*/: me._ILa/*reportoption*/,
					_ILb/*sheetoption*/: me._ILb/*sheetoption*/
				});
				
				reportarea.add(me._IH8a/*pythoncontainer*/);
            }
            break;
    	}
    	
    	me._IH6/*gridcontainer*/ && me._IH6/*gridcontainer*/.setVisible(index == 0 ? true : false);
		me._IH7/*chartcontainer*/ && me._IH7/*chartcontainer*/.setVisible(index == 1 ? true : false);
		me._IH8/*rcontainer*/ && me._IH8/*rcontainer*/.setVisible(index == 2 ? true : false);
		me._IH9a/*pivotEditorDIV*/ && me._IH9a/*pivotEditorDIV*/.setVisible(index == 3 ? true : false);
        me._IH8a/*pythoncontainer*/ && me._IH8a/*pythoncontainer*/.setVisible(index == 4 ? true : false);
    	
    	if (me.activeView == 0)
    	{
   			me._IK0/*invalidateGrid*/ == true && me._IK5/*updateSheetUI*/(me);
    	}
    	else if (me.activeView == 1)
    	{
			me._IJf/*invalidateChart*/ == true && me._IP8/*updateChartUI*/(me);
    	}
    	else if (me.activeView == 2)
    	{
			me._IK1/*invalidateRstat*/ == true && me._IK8/*updateRstat*/(me);
    	}
        else if (me.activeView == 4)
        {
            me._IK1a/*invalidatePython*/ == true && me._IK8a/*updatePython*/(me);
        }
    },
    
    _IP9/*setSheetOption*/: function(rop, sop) {
    	var me = this;
    	me._ILa/*reportoption*/ = rop;
    	me._ILb/*sheetoption*/ = sop;
    	me._IH6/*gridcontainer*/._IP9/*setSheetOption*/(rop, sop);
    	me._IH7/*chartcontainer*/._IP9/*setSheetOption*/(rop, sop);
    },
    
    _IN0/*applyOptions*/: function() {
    	var me = this,
    		gc = me._IH6/*gridcontainer*/,
    		rc = me._IH8/*rcontainer*/,
            pc = me._IH8a/*pythoncontainer*/;
    	gc && gc._IN0/*applyOptions*/.call(gc, me._ILa/*reportoption*/, me._ILb/*sheetoption*/);
    	rc && rc._IN0/*applyOptions*/.call(rc, me._ILa/*reportoption*/, me._ILb/*sheetoption*/);
        pc && pc._IN0/*applyOptions*/.call(pc, me._ILa/*reportoption*/, me._ILb/*sheetoption*/);
    },
    
    _ILd/*updateFilterContent*/: function(finfo) {
	},
	
	_ILc/*getFilterInfo*/: function(finfo) {
		var me = this,
			fdoc,
			fname,
			fvalue,
			fnode, fsnode,
			flist, fslist,
			i, j, f, fvalue,
			fprop,
			auxfilter = (me._ILb/*sheetoption*/) ? me._ILb/*sheetoption*/._IL9/*auxfilter*/ : null;
			filter = (me._ILb/*sheetoption*/) ? me._ILb/*sheetoption*/.filter : null;
			
		if (auxfilter)
		{
			for (fname in auxfilter)
			{
				fvalue = auxfilter[fname];
				fdoc = IG$/*mainapp*/._I13/*loadXML*/(fvalue);
				fnode = IG$/*mainapp*/._I18/*XGetNode*/(fdoc, "/FilterData");
				if (fnode)
				{
					flist = IG$/*mainapp*/._I26/*getChildNodes*/(fnode);
					
					for (i=0; i < flist.length; i++)
					{
						fslist = IG$/*mainapp*/._I26/*getChildNodes*/(flist[i]);
						for (j=0; j < fslist.length; j++)
						{
							fprop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(fslist[j]);
							
							f = finfo[fprop.name] = finfo[fprop.name] || {data: [], p: {}};
							// fvalue = fprop.value || fprop.code || "";
							fvalue = IG$/*mainapp*/._I1a/*getSubNodeText*/(fslist[j], "value") || IG$/*mainapp*/._I1a/*getSubNodeText*/(fslist[j], "code") || "";
							if (fvalue != "" && !f.p[fvalue])
							{
								f.data.push(fvalue);
								f.p[fvalue] = 1;
							}
						}
					}
				}
			}
		}
		
		if (filter)
		{
			me._IPa/*getSheetFilter*/(filter, finfo);
		}
	},
	
	_IPa/*getSheetFilter*/: function(filter, finfo) {
		var me = this,
			i, j,
			sfilter,
			condition,
			fname,
			f, fvalue;
		
		if (filter && filter.subConditions && filter.subConditions.length > 0)
		{
			for (i=0; i < filter.subConditions.length; i++)
			{
				condition = filter.subConditions[i];
				if (condition && condition._d6/*itemList*/ && condition._d6/*itemList*/.length > 0)
				{
					fname = condition._d6/*itemList*/[0].name;
					f = finfo[fname] = finfo[fname] || {data: [], p: {}};
					if (condition.values)
					{
						for (j=0; j < condition.values.length; j++)
						{
							fvalue = condition.values[j].text || condition.values[j].code || "";
							if (fvalue != "" && !f.p[fvalue])
							{
								f.data.push(fvalue);
								f.p[fvalue] = 1;
							}
						}
					}
				}
			}
		}
		
		if (filter && filter.subGroups && filter.subGroups.length > 0)
		{
			for (i=0; i < filter.subGroups.length; i++)
			{
				sfilter = filter.subGroups[i];
				me._IPa/*getSheetFilter*/(sfilter, finfo);
			}
		}
	},
	
	_IIe/*clearResult*/: function() {
		var panel = this;
		panel._IK0/*invalidateGrid*/ = true;
		panel._IJf/*invalidateChart*/ = true;
		panel._IK1/*invalidateRstat*/ = true;
        panel._IK1a/*invalidatePython*/ = true;
		
		panel.activeView = -1;
		panel._IH6/*gridcontainer*/ && panel._IH6/*gridcontainer*/.setVisible(false);
		panel._IH7/*chartcontainer*/ && panel._IH7/*chartcontainer*/.setVisible(false);
		panel._IH8/*rcontainer*/ && panel._IH8/*rcontainer*/.setVisible(false);
		panel._IH9a/*pivotEditorDIV*/ && panel._IH9a/*pivotEditorDIV*/.setVisible(false);
        panel._IH8a/*pythoncontainer*/ && panel._IH8a/*pythoncontainer*/.setVisible(false);
	},
	
	_ic/*initComponent*/: function() {
		var me = this;
		
//		if (IG$/*mainapp*/._Ib5/*promptdlg*/ && window.Ext)
//		{		
//			me._IKd/*promptpanel*/ = Ext.create(IG$/*mainapp*/._Ib5/*promptdlg*/, {
//				region: 'north',
//				_ILa/*reportoption*/: me._ILa/*reportoption*/,
//				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.rs_showPrompt),
//				hidden: true
//			});
//		}
				
		me.on("afterrender", function() {
			me.CLS.afterrender.call(me);
			var w = me.getWidth(),
				h = me.getHeight();
			
			me.rzone = me.down("[name=rzone]");
			me.a2_ = me.down("[name=a2_]");
			me.a3/*noresultpanel*/ = me.down("[name=noresultpanel]");
			
			// me.getLayout().setActiveItem(1);
			me.setActiveItem(1);
		});
		
		IG$/*mainapp*/.apply(this, {
			items: [
			    {
			    	xtype: "container",
			    	name: "rzone",
			    	deferredRender: false,
			    	layout: "fit", // "border",
			    	items: [
			    	    // me._IKd/*promptpanel*/,
			    	    {
			    	    	xtype: "container",
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
							    {
							    	xtype: "container",
							    	flex: 1,
							    	name: "a2_",
							    	layout: "fit",
							    	border: 0
							    },
							    {
							    	xtype: "container",
							    	name: "pagepanel",
							    	html: "<div id='idv-pgview' class='idv-pgview'>Page view</div>",
							    	hidden: true,
							    	height: 25
							    }
							],
				            region: 'center',
				            flex: 1
						}
			    	]
			    },
			    {
			    	xtype: "container",
			    	name: "noresultpanel",
			    	deferredRender: false,
			    	html: "<div class='igc-no-results'><div class='no-result-msg'>" + (IRm$/*resources*/.r1("B_NO_DATA") || "No Results") + "</div></div>"
			    }
			]
		});
		
		IG$/*mainapp*/._IPc/*SheetView*/.superclass._ic/*initComponent*/.call(this);
	}
});

//IG$/*mainapp*/._IPc/*SheetView*/ = Ext.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
//	initComponent: function() {
//		var panel = this;
//		
//		panel.addEvents("drillreport", "itemclick", "itemdblclick", "menu", "pivotchanged", "cresized", "result_loaded", "export_sheet");
//		

//		

//		

//		
//		panel.on("resize", function(comp, adjWidth, adjHeight, eOpts) {
//			panel.CLS.resize.call(panel, comp, adjWidth, adjHeight, eOpts);
//		});
//		
//		IG$/*mainapp*/._IPc/*SheetView*/.superclass.initComponent.call(this);
//	}
//});


IG$/*mainapp*/._Ibb/*reportbase_jquery*/ = IG$/*mainapp*/._Ibb/*reportbase_jquery*/ || {};

$s.apply(IG$/*mainapp*/._Ibb/*reportbase_jquery*/, {
	_INf/*doDrillReport*/: function(view) {
		var me = this,
			sheetview = view,
			sheetindex = sheetview.sheetindex,
			r;
		
		me._IO0/*updateFormula*/(sheetview);
		
		if (sheetview._ILb/*sheetoption*/.isdrillreport == true)
			return false;
			
		me._ine_t && clearTimeout(me._ine_t);
			
		me._ine_t = setTimeout(function() {
			me._IL6/*executeDrillReport*/.call(me, sheetindex, sheetview);
		}, 500);
		
		return r;
	},

	F/*doLink*/: function(view, m, cl) {
		var me = this;
		
		me._ine_t && clearTimeout(me._ine_t);
		
		me._ine_t = setTimeout(function() {
			var	drillfilter,
				dobj = {
					titem: {
						enabled: false,
						item_map: {},
						items: []
					},
					tparams: {
						enabled: false,
						item_map: {},
						items: []
					},
					_dall: true
				},
				paux,
				auxfilter = {},
				req,
				exportdata;
			
			drillfilter = view._IL7/*getDrillXML*/.call(view, dobj);
			
			if (drillfilter)
			{
				paux = view._ILb/*sheetoption*/._IL9/*auxfilter*/;
				
				if (paux)
				{
					for (var k in paux)
					{
						auxfilter[k] = paux[k];
					}
				}
				
				auxfilter["report_" + view.sheetindex] = drillfilter;
				
				exportdata = ["<smsg><item><auxfilter>"];
				for (var key in auxfilter)
				{
					exportdata.push(auxfilter[key]);
				}
				exportdata.push("</auxfilter></item></smsg>");
				
				view.setLoading.call(view, true, false);
				
				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				
				req.init(me, 
					{
						ack: "20",
						payload: "<smsg><item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(m, "uid;type", "s") + " option='LINK_FIELD'/>" + "</smsg>",
						mbody: exportdata.join("")
					}, me, function(xdoc) {
						view.setLoading.call(view, false);
						
						var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
							act = (tnode ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "action") : null),
							dnode,
							fileuid,
							fileext,
							fname,
							dview,
							durl;
						
						if (act == "DOC")
						{
							dnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "info");
							
							if (dnode)
							{
								fileuid = IG$/*mainapp*/._I1b/*XGetAttr*/(dnode, "downloadurl");
								fileext = IG$/*mainapp*/._I1b/*XGetAttr*/(dnode, "fileext");
								fname = IG$/*mainapp*/._I1b/*XGetAttr*/(dnode, "filename");
								fname = (fname ? fname : m.name) + "." + fileext;
								$.download(ig$/*appoption*/.servlet, [
									{name: "ack", value: "35"},
									{name: "payload", value: fileuid},
									{name: "_mts_", value: IG$/*mainapp*/._g$a/*global_mts*/ || ""},
									{name: "mbody", value: fname}], 'POST');
							}
						}
						else if (act == "DRILL")
						{
							dnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "target");
							
							if (dnode)
							{
								dview = IG$/*mainapp*/._I1c/*XGetAttrProp*/(dnode);
								me._INd/*showDetailView*/(view, dview, drillfilter);
							}
						}
						else if (act == "EXTERNAL")
						{
							dnode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "url");
							
							if (dnode)
							{
								dview = IG$/*mainapp*/._I1b/*XGetAttr*/(dnode, "target"); 
								durl = IG$/*mainapp*/._I24/*getTextContent*/(dnode);
								
								if (durl)
								{
									if (durl.substring(0, "javascript:".length) == "javascript:")
									{
										try
										{
											durl = durl.substring("javascript:".length);
											eval(durl);
										}
										catch (e)
										{
											IG$/*mainapp*/._I52/*ShowError*/("ERROR on External Call." + durl + e, me);
										}
									}
									else
									{
										var ownd = null,
											MSG_POPUPS_BLOCKED = window.popups_blocked || "A window was blocked by pop-up blocker.\n"
												+ "To run Administrator, pop-up windows must be allowed.\n"
												+ "Please configure your blocker software to allow pop-ups for this site.";
										
										ownd = window.open(durl);
										
										if (ownd == null || typeof(ownd) == "undefined")
										{
											alert(MSG_POPUPS_BLOCKED);
										}
									}
								}
							}
						}
						
					}, function(xdoc) {
						view.setLoading.call(view, false);
					});
				req._l/*request*/();
			}
		}, 500);
	},

	J3/*updateAllFilters*/: function(filterview, f_b_trg_all) {
		var me = this,
			r = 1,
			i, dzone = me.dzone,
			view,
			docid = filterview ? filterview._ILb/*sheetoption*/.docid : null,
			m,
			vopt, foptions,
			dbox,
			tab_changes = [];
		
		for (i=0; i < dzone.items.length; i++)
		{
			dbox = dzone.items[i];
			view = dzone.items[i].view;
			
			if ((f_b_trg_all || dbox.visible !== false) && view && view._ILb/*sheetoption*/)
			{
				vopt = view._ILb/*sheetoption*/;
				foptions = vopt.pff1a/*filteroptions*/;
				
				if (vopt.objtype == "FILTER" && dbox.docid != docid && !foptions.showbutton && foptions.f_b_evt == "T")
				{
					m = view.l5m/*checkFilterValues*/.call(view, 1, tab_changes);
					
					if (!m)
					{
						r = 0;
					}
					else if (r)
					{
						me._IO1/*onFilterUpdate*/(view, 1);
						
						$.each(tab_changes, function(j, tab_c) {
							view.cc1/*changeActiveTab*/.call(view, tab_c, undefined);
						});
					}
				}
				else if (vopt.objtype == "RPT_VIEW")
				{
					if (view.irpt && view.irpt.dzone)
					{
						m = view.irpt.J3/*updateAllFilters*/.call(view.irpt, null, f_b_trg_all);
						
						if (!m)
						{
							r = 0;
						}
					}
				}
			}
		}
		
		return r;
	},

	_IL6/*executeDrillReport*/: function(sheetindex, sheetview) {
		var me = this,
			i,
			sheet,
			jobid = (me.sheets[sheetindex]._IK9/*olapset*/) ? me.sheets[sheetindex]._IK9/*olapset*/._IL8/*jobid*/ : null,
			auxfilter,
			isbase = false,
			fname,
			_t = sheetview._ILb/*sheetoption*/,
			edrill = _t ? _t.edrill : false,
			dtarget = (_t && _t.drilltarget ? _t.drilltarget : null),
			mtarget = new IG$/*mainapp*/._dpca/*drilltarget*/(dtarget),
			dobj,
			paux,
			dzone = me.dzone,
			dbox,
			dboxview,
			dname, titem, tparams,
			dval,
			drillfilter,
			brun = false,
			docitems = me.dzone.docitems || {},
			ditem, dview,
			bf = false,
			T0;
		
		// if (jobid)
		// {
			isbase = false; //(sheetindex == 0) ? true : false;
			
			for (i=0; i < me.sheets.length; i++)
			{
				sheet = me.sheets[i];
				
				dobj = mtarget._2/*isDrillTarget*/("sheet_" + i);

				T0 = sheet._ILb/*sheetoption*/;
				
				if ((T0.drillreport == true || edrill || (dobj && dobj.isdrill)) && sheet.sheetindex != sheetindex)
				{
					if (!edrill && mtarget._e && (!dobj || (dobj && !dobj.isdrill)))
					{
						// skip to filtering
						continue;
					}
					
					auxfilter = T0._IL9/*auxfilter*/;
					if (isbase == true)
					{
						for (fname in auxfilter)
						{
							if (fname.indexOf("report_") > -1)
							{
								delete auxfilter[fname];
							}
						}
					}
					
					paux = T0._IL9/*auxfilter*/;
					
					if (paux)
					{
						for (var k in paux)
						{
							auxfilter[k] = paux[k];
						}
					}
					
					drillfilter = sheetview._IL7/*getDrillXML*/.call(sheetview, dobj);
					
					if (drillfilter && drillfilter.length > 0)
					{
						bf = true;
						
						auxfilter['report_' + sheetindex] = drillfilter;
					
						dbox = dzone._IIb/*getBox*/.call(dzone, sheet.renderBox);
						brun = true;
						if (dbox && dbox.parent && dbox.parent.objtype == "TAB")
						{
							dboxview = dbox.parent.view;
							brun = dboxview.active == sheet.renderBox;
						}
						if (brun == true)
						{
							sheet._IJ2/*procRunReport*/.call(sheet, null); //jobid);
						}
						else
						{
							sheet.btabrun = true;
						}
					}
				}
			}
			
			for (k in docitems)
			{
				ditem = docitems[k].lt.ubody;
				dview = ditem.view;
				if (ditem.objtype == "RPT_VIEW")
				{
					if (dview)
					{
						if (dview.irpt)
						{
							for (i=0; i < dview.irpt.sheets.length; i++)
							{
								sheet = dview.irpt.sheets[i];
								rop = sheet._ILa/*reportoption*/;
								sop = sheet._ILb/*sheetoption*/;
								
								dobj = rop ? mtarget._2/*isDrillTarget*/(rop.uid + "_" + "sheet_" + i) : null;
								
								// if (edrill || (mtarget._e && rop && !drobj.isdrill))
								if ((sop.drillreport == true || edrill || (dobj && dobj.isdrill)))
								{
									if (!edrill && mtarget._e && (!dobj || (dobj && !dobj.isdrill)))
									{
										continue;
									}
									
									auxfilter = sop._IL9/*auxfilter*/;
									
									if (isbase == true)
									{
										for (fname in auxfilter)
										{
											if (fname.indexOf("report_") > -1)
											{
												delete auxfilter[fname];
											}
										}
									}
									
									paux = _t._IL9/*auxfilter*/;
									
									if (paux)
									{
										for (var k in paux)
										{
											auxfilter[k] = paux[k];
										}
									}
									
									drillfilter = sheetview._IL7/*getDrillXML*/.call(sheetview, dobj);
									
									if (drillfilter && drillfilter.length > 0)
									{
										bf = true;
										
										auxfilter['report_' + sheetindex] = drillfilter;
									
										dbox = dzone._IIb/*getBox*/.call(dzone, sheet.renderBox);
										brun = true;
										if (dbox && dbox.parent && dbox.parent.objtype == "TAB")
										{
											dboxview = dbox.parent.view;
											brun = dboxview.active == sheet.renderBox;
										}
										if (brun == true)
										{
											sheet._IJ2/*procRunReport*/.call(sheet, null); //jobid);
										}
										else
										{
											sheet.btabrun = true;
										}
										
										if (ditem.visible && !me._i0/*pivotvisible*/)
										{
											dview._vf/*f_run*/ = false;
										}
									}
								}
							}
						}
						else
						{
							// console.write("error");
						}
					}
				}
			}
			
			me._IJ4/*broadCastFilter*/();
		// }
		
		return bf;
	},

	_IIa2/*updateDashboardFilterInfo*/: function(dfilter) {
		var me = this,
			i;
		for (i=0; i < me.sheets.length; i++)
		{
			me.sheets[i]._dfilter = dfilter;
		}
	},

	_IIa/*updateFilterInfo*/: function(filter) {
		var me = this,
			fg, fgs, f, item, fi,
			i, j, v;
		
		if (filter && filter.length > 0)
		{	
			fg = new IG$/*mainapp*/._IEb/*clFilterGroup*/(null);
			fg.name = "____systemfilter____";
			
			fgs = new IG$/*mainapp*/._IEb/*clFilterGroup*/(null);
			fg.subGroups.push(fgs);
			
			for (i=0; i < filter.length; i++)
			{
				item = filter[i];
				f = new IG$/*mainapp*/._IE9/*clFilter*/(null);
				
				f.operator = IG$/*mainapp*/._IE1/*filteropcodes*/._d3/*getOperator*/(item.operator);
				fi = new IG$/*mainapp*/._IE8/*clItems*/();
				fi.uid = item.uid;
				fi.type = item.type;
				fi.nodepath = item.nodepath;
				fi.name = item.name;
				
				f._d6/*itemList*/.push(fi);
				f.delimiter = "$%^";
				for (j=0; j < item.value.length; j++)
				{
					v = {
						code: item.value[j].code || item.value[j],
						text: item.value[j].text || item.value[j].code || item.value[j]
					};
					
					f.values.push(v);
				}
				fgs.subConditions.push(f);
			}
		}
		
		if (fg)
		{
			for (i=0; i < me.sheets.length; i++)
			{
				var bproc = false,
					tgroup = me.sheets[i]._ILb/*sheetoption*/.filter,
					lgroup;
				
				while (tgroup && tgroup.subGroups.length > 0)
				{
					tgroup = tgroup.subGroups[0];
				}
				
				if (tgroup)
				{
					tgroup.subGroups.push(fg);
				}
			}
		}
	},

	_IB3/*exportToFile*/: function(filetype, isinstance, sheetview) {
		var me = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			fname = me._ILa/*reportoption*/.name,
			exportdata,
			expoption = me._ILa/*reportoption*/.exportOption,
			dzone = me.dzone,
			n,
			dobj,
			dname,
			schedule_load = me._cld/*schedule_load*/,
			schedule_load_param = me._cld_p/*schedule_load_param*/,
			payload;
		
		if (sheetview && sheetview._ILb/*sheetoption*/ && sheetview._ILb/*sheetoption*/.name)
		{
			dobj = dzone.docitems[sheetview.renderBox];
			dname = dobj.lt.ubody.getTitle();
			if (dname)
			{
				fname = fname + "_" + dname;
			}
		}
		
		fname = fname.replace(/\./g, "_");
		fname = fname.replace(/ /g, "");
		
		if (filetype.substring(0, "JASPER_".length) == "JASPER_")
		{
			filetype = filetype.substring("JASPER_".length).toLowerCase();
			me._t$/*toolbarHandler*/.call(me, "cmd_export_jasper", filetype);
			
			return;
		}
		else if (filetype.substring(0, "OFFICE_".length) == "OFFICE_")
		{
			n = Number(filetype.substring("OFFICE_".length));
			if (isNaN(n) == false && n > -1 && expoption && expoption.otmpl[n])
			{
				me._t$/*toolbarHandler*/.call(me, "cmd_export_office", expoption.otmpl[n]);
			}
			
			return;
		}
		
		switch (filetype)
		{
		case "EXCEL":
			fname += ".xls";
			break;
		case "PNG":
			fname += ".png";
			break;
		case "PDF":
			fname += ".pdf";
			break;
		case "SVG":
			fname += ".svg";
			break;
		case "HTML":
			fname += ".html";
			break;
		case "ODT":
		case "ODS":
		case "ODP":
			fname += "." + filetype.toLowerCase();
			break;
		case "TMPL":
			fname += "." + filetype.toLowerCase();
			break;
		}
		
		me.setLoading(true);
		
		exportdata = me._IB4/*getExportData*/(expoption, filetype, isinstance, false, null, sheetview);
		
		payload = [
			"<smsg><item uid='" + me.uid + "' type='" + filetype + "' filename='" + fname + "' ",
			"fonttype='" + (expoption && expoption.fonttype ? expoption.fonttype : "") + "' ",
			(schedule_load && !isinstance ? ("sc_jid='" + schedule_load_param.jid + "' sc_sid='" + schedule_load_param.sid + "' ") : ""),
			"isinstance='" + (isinstance ? "T" : "F") + "'/></smsg>"
		];
		
		req.init(me, 
			{
				ack: "20",
				payload: payload.join(""),
				mbody: exportdata
			}, me, function(xdoc) {
				me.r_IB3/*exportToFile*/.call(me, xdoc, fname, filetype);
			}, null);
		req._l/*request*/();
	},

	r_IB3/*exportToFile*/: function (xdoc, fname, filetype) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, '/smsg/info'),
			fileuid,
			isinstance,
			fname;
			
		me.setLoading(false);
		
		if (IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'status') == 'complete')
		{
			fileuid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'downloadurl');
			isinstance = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'isinstance') == "T";
			fname = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, 'filename') || fname;
			
			if (!isinstance)
			{
				if (filetype == "HTML")
				{
					var mts_id = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.mts_name,
						url = "./htmlview.jsp?mts=" + (mts_id || "") + "&p1=export&p2=" + fileuid,
						newwindow = window.open(url,'name','height=500,width=800');
						
					if (window.focus) {
						newwindow.focus();
					}
				}
				else
				{
					$.download(ig$/*appoption*/.servlet, [
						{name: "ack", value: "35"},
						{name: "payload", value: fileuid},
						{name: "_mts_", value: IG$/*mainapp*/._g$a/*global_mts*/ || ""},
						{name: "mbody", value: fname}], 'POST');
				}
			}
			else
			{
				var mts_id = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.mts_name,
					url = "./print.jsp?mts=" + (mts_id || "") + "#p1=export&p2=" + fileuid,
					newwindow = window.open(url,'name','height=500,width=800');
					
				if (window.focus) {
					newwindow.focus();
				}
			}
		}
	},


	_IB4/*getExportData*/: function(option, filetype, isinstance, isdashboard, dboardname, sheetview) {
		var me = this,
			r = [], i, j,
			dzone = me.dzone,
			dbox,
			docid,
			exportdata,
			sheets = me.sheets,
			activeview, // = me.sheets[me._IJa/*activeSheet*/],
			pdoc,
			sx = 0, sy = 0, ty = 0,
			d_width, d_height,
			fview, k,
			rptparams = {},
			rst, fdesc,
			T0, T1;

		T0 = function(val) {
			r.push(val);
		};
		
		if (isinstance)
		{
			T0("<smsg><item>");
			T0("<export filetype='" + filetype + "'>");
			T0(option.TX/*getXML*/.call(option));
			T0("<sheets>");
			for (i=0; i < dzone.items.length; i++)
			{
				dbox = dzone.items[i];
				
				if (dbox.objtype == "SHEET")
				{
					activeview = dbox.view;
					docid = activeview.renderBox;
					
					if (activeview.jobid)
					{
						T0("<sheet docid='" + docid + "' jobid='" + activeview.jobid + "'>");
						T0("</sheet>");
					}
				}
			}
			T0("</sheets>");
			T0("</export>");
			T0("</item>");
			T0("</smsg>");
		}
		else
		{
			if (isdashboard)
			{
				T0("<report uid='" + me.uid + "' name='" + dboardname + "'><options>");
			}
			else
			{
				T0("<smsg><Export layout='" + (option.layout || "portrait") + "'>");
				
				T0("<options>");
				T0(option.TX/*getXML*/.call(option));
			}
			T0("<sheets>");
			
			if (sheetview)
			{
				docid = sheetview.renderBox;
						
				if (sheetview.jobid)
				{
					T0("<sheet docid='" + docid + "' jobid='" + sheetview.jobid + "'>");
					T0("</sheet>");
				}
			}
			else
			{
				for (i=0; i < dzone.items.length; i++)
				{
					dbox = dzone.items[i];
					
					if (dbox.objtype == "SHEET")
					{
						activeview = dbox.view;
						docid = activeview.renderBox;
						
						T0("<sheet docid='" + docid + "' jobid='" + (activeview.jobid || "") + "'>");
						T0("<title><![CDATA[" + (dbox.title || "") + "]]></title>");
						T0("</sheet>");
						
						rptparams["SHEET_" + i] = dbox.title || "";
					}
					else if (dbox.objtype == "FILTER" && dbox.view)
					{
						fview = dbox.view;
						fview._uu1/*updateFilterPrompt*/.call(fview, rptparams);
					}
				}
			}
			T0("</sheets>");
			T0("<LayoutInfo type='bubble'><![CDATA[" + (dzone.l10a/*getLayout*/.call(dzone) || "") + "]]></LayoutInfo>");
			T0("<params>");
			T0("<param name='REPORT_NAME'><![CDATA[" + (me._ILa/*reportoption*/.name || "") + "]]></param>");
			
			for (k in rptparams)
			{
				T0("<param name='" + k + "'><![CDATA[" + (rptparams[k] || "") + "]]></param>");
			}
			
			T0("</params>");
			T0("</options>");
			
			if (me._ILa/*reportoption*/.name)
			{
				T0("<item type='label' x='" + sx + "' y='" + sy + "' sheet_title='T'>");
				T0("<text><![CDATA[" + me._ILa/*reportoption*/.name + "]]></text>");
				T0("</item>");
				ty = 30;
				sy += ty;
			}
		
			// for (i=0; i < sheets.length; i++)
			for (i=0; i < dzone.items.length; i++)
			{
				dbox = dzone.items[i];
				
				d_width = "0";
				d_height = "0";
				
				activeview = null;
				
				if (dbox)
				{
					if (!sheetview)
					{
						sx = dbox.lt.x;
						sy = dbox.lt.y + ty;
					}
					
					d_width = dbox.lt.w;
					d_height = dbox.lt.h;
					
					if (dbox.visible == false)
					{
						continue;
					}
				}
				
				if (dbox.objtype == "SHEET")
				{
					activeview = dbox.view;
					
					if (sheetview && sheetview != activeview)
					{
						continue;
					}
					
					if (activeview && activeview._ILb/*sheetoption*/)
					{
						docid = activeview.renderBox;
						
						if (!sheetview && activeview._ILb/*sheetoption*/.name)
						{
							T0("<item type='label' x='" + sx + "' y='" + sy + "' d_width='" + d_width + "' d_height='" + d_height + "' docid='" + dbox.docid + "' doc_title='T'>");
							T0("<text><![CDATA[" + activeview._ILb/*sheetoption*/.name + "]]></text>");
							T0("</item>");
							
							sy += 20;
						}
						
						if (option.filterdesc && activeview._IK2/*mresults*/ && activeview._IK2/*mresults*/.results)
						{
							rst = activeview._IK2/*mresults*/.results;
							
							fdesc = rst && rst.length ? rst[0].f_/*filterdesc*/ : null;
							
							if (fdesc)
							{
								T0("<item type='label' x='" + sx + "' y='" + sy + "' sheet_title='T'>");
								T0("<text><![CDATA[" + fdesc + "]]></text>");
								T0("</item>");
								ty = 30;
								sy += ty;
								d_height = d_height > 30 ? d_height - 30 : d_height;
							}
						}
						
						if (activeview.activeView == 0)
						{
							pdoc = activeview._IH6/*gridcontainer*/ && activeview._IH6/*gridcontainer*/._IB4/*getExportData*/.call(activeview._IH6/*gridcontainer*/, option);
							if (pdoc)
							{
								T0("<item type='datagrid' x='" + sx + "' y='" + (sy + 20) + "' d_width='" + d_width + "' d_height='" + d_height + "' docid='" + dbox.docid + "' sheetindex='" + activeview.sheetindex + "'>");
								T0(pdoc);
								T0("</item>");
							}
						}
						else if (activeview.activeView == 1)
						{
							pdoc = activeview._IH7/*chartcontainer*/ && activeview._IH7/*chartcontainer*/._IB4/*getExportData*/.call(activeview._IH7/*chartcontainer*/, option, sx, sy + 20, dbox.docid, d_width, d_height);
							if (pdoc)
							{
								T0(pdoc);
							}
							
							if (filetype == "EXCEL" && activeview._ILb/*sheetoption*/ && activeview._ILb/*sheetoption*/.tb_prt_grd)
							{
								sy += (activeview.__h || 300) + 20;
								var _parser = activeview._IK2/*mresults*/,
									dresult = _parser.results[0],
									_delim = (dresult ? dresult.delim : null),
									gdoc = "<instance jobid='" + (_parser._IL8/*jobid*/ || "") + "' cols='" + dresult.cols + "' rows='" + dresult.rows + "' delimiter='" + _delim + "' fixedrow='" + dresult.rowfix + "'></instance>";
								
								T0("<item type='datagrid' x='" + sx + "' y='" + (sy + 20) + "' d_width='" + d_width + "' d_height='" + d_height + "' docid='" + dbox.docid + "' sheetindex='" + activeview.sheetindex + "'>");
								T0(gdoc);
								T0("</item>");
							}
						}
						else if (activeview.activeView == 2)
						{
							pdoc = activeview._IH8/*rcontainer*/ && activeview._IH8/*rcontainer*/._IB4/*getExportData*/.call(activeview._IH8/*rcontainer*/, option, sx, sy + 20, filetype, dbox.docid, d_width, d_height);
							if (pdoc)
							{
								T0(pdoc);
							}
						}
						else
						{
							pdoc = activeview._IH6/*gridcontainer*/ && activeview._IH6/*gridcontainer*/._IB4/*getExportData*/.call(activeview._IH6/*gridcontainer*/, option);
							if (pdoc)
							{
								T0("<item type='datagrid' x='" + sx + "' y='" + (sy + 20) + "' d_width='" + d_width + "' d_height='" + d_height + "'  docid='" + dbox.docid + "'>");
								T0(pdoc);
								T0("</item>");
							}
							pdoc = activeview._IH7/*chartcontainer*/ && activeview._IH7/*chartcontainer*/._IB4/*getExportData*/.call(activeview._IH7/*chartcontainer*/);
							if (pdoc)
							{
								T0("<item type='chart' x='" + sx + "' y='" + (sy + 20) + "' d_width='" + d_width + "' d_height='" + d_height + "' width='" + activeview._IH7/*chartcontainer*/.body.getWidth() + "' height='" + activeview._IH7/*chartcontainer*/.body.getHeight() + "' docid='" + dbox.docid + "'>");
								T0(pdoc);
								T0("</item>");
							}
						}
					}
				}
				else if (dbox.objtype == "FILTER" && !sheetview)
				{
					activeview = dbox.view;  //sheets[i];
					pdoc = activeview._IB4/*getExportData*/ && activeview._IB4/*getExportData*/.call(activeview, sx, sy, dbox.docid, d_width, d_height);
					if (pdoc)
					{
						T0(pdoc);
					}
				}
			}
			
			if (isdashboard)
			{
				T0("</report>");
			}
			else
			{
				T0("</Export></smsg>");
			}
		}
		
		exportdata = r.join('');
		
		return exportdata;
	},

	_IJ4/*broadCastFilter*/: function() {
		var i,
			me = this,
			sheets = me.sheets,
			dzone = me.dzone,
			view,
			filter = {},
			dzoneitems = dzone.items;
		
		for (i=0; i < dzoneitems.length; i++)
		{
			view = dzoneitems[i].view;
			if (view && view._ILc/*getFilterInfo*/)
			{
				view._ILc/*getFilterInfo*/.call(view, filter);
			}
		}
		
		for (i=0; i < dzoneitems.length; i++)
		{
			view = dzoneitems[i].view;
			if (view && view._ILd/*updateFilterContent*/)
			{
				view._ILd/*updateFilterContent*/.call(view, filter);
			}
		}
	},

	_INe/*doCellClick*/: function(view, renderer) {
		var me = this,
			sheetindex = view.sheetindex,
			_ILb/*sheetoption*/ = view._ILb/*sheetoption*/,
			idx, pos,
			cl = renderer ? renderer.cl : null,
			m,
			t;
		
		if (cl)
		{
			t = cl.title;
			
			if (_ILb/*sheetoption*/ && t == 9)
			{
				idx = cl.index;
				pos = cl.position;
				
				m = _ILb/*sheetoption*/.g1/*getItem*/(idx, pos);
				
				if (m)
				{
					me.F/*doLink*/.call(me, view, m, cl);
				}
			}
			else if (t > 2)
			{
				me._INf/*doDrillReport*/.call(me, view);
			}
		}
	},

	_INc/*procMenu*/: function(view, el) {
		var me = this,
			sop = view._ILb/*sheetoption*/,
			cell = el.menu.cell, i, p,
			tgt, t, reload = false,
			sheetformula, sortmethod, sortcount, sortuid, 
			sortoption = (sop) ? sop.sortoption : null,
			mdf,
			redo,
			T0;
		
		if (sop)
		{
			mdf = sop.mdf = sop.mdf || {};
		}
		
		if (cell)
		{
			T0 = cell.position;
			if (T0 == 1)
			{
				tgt = sop.rows;
			}
			else if (T0 == 2)
			{
				tgt = sop.cols;
			}
			else if (T0 == 3)
			{
				tgt = sop.measures;
			}
			
			t = (tgt && tgt.length > cell.index) ? tgt[cell.index] : null;
		}
		
		switch (el.cmd)
		{
		case "CMD_REMOVE":
			if (cell.position == 4)
			{
				sheetformula = sop.Xsf/*sheetformula*/;
				if (sheetformula)
				{
					for (i=0; i < sheetformula.length; i++)
					{
						if (sheetformula[i].fid == "formula_" + cell.index)
						{
							p = sheetformula.splice(i, 1);
							redo = {
								type: "remove",
								item: p[0],
								index: i,
								target: sheetformula
							};
							view._IP2/*registerUndo*/(redo);
							reload = true;
							break;
						}
					}
				}
			}
			else if (tgt && sop.rows.length + sop.cols.length + sop.measures.length > 1)
			{
				p = tgt.splice(cell.index, 1);
				redo = {
					type: "remove",
					item: p[0],
					index: cell.index,
					target: tgt
				};
				view._IP2/*registerUndo*/(redo);
				reload = true;
			}
			break;
		case "CMD_FILTER":
			me._t$/*toolbarHandler*/("cmd_filter", t);
			break;
		case "CMD_ASC":
			if (t.sortorder != "asc")
			{
				p = t.sortorder;
				t.sortorder = "asc";
				reload = true;
				redo = {
					type: "property",
					item: t,
					name: "sortorder",
					value: p
				};
				view._IP2/*registerUndo*/(redo);
			}
			break;
		case "CMD_DESC":
			if (t.sortorder != "desc")
			{
				p = t.sortorder;
				t.sortorder = "desc";
				reload = true;
				redo = {
					type: "property",
					item: t,
					name: "sortorder",
					value: p
				};
				view._IP2/*registerUndo*/(redo);
			}
			break;
		case "CMD_TOP5":
			sortmethod = "top";
			sortcount = 5;
			sortuid = t.uid;
			break;
		case "CMD_TOP10":
			sortmethod = "top";
			sortcount = 10;
			sortuid = t.uid;
			break;
		case "CMD_BTM5":
			sortmethod = "bottom";
			sortcount = 5;
			sortuid = t.uid;
			break;
		case "CMD_BTM10":
			sortmethod = "bottom";
			sortcount = 10;
			sortuid = t.uid;
			break;
		case "CMD_SHOWALL":
			sortmethod = "normal";
			sortcount = 0;
			sortuid = null;
			break;
		case "CMD_UNDO":
			reload = view._IOf/*undolist*/.call(view);
			break;
		case "CMD_CLIPBOARD":
			var clip = view._IP0/*getClipboardContent*/();
			IG$/*mainapp*/._I49/*clipboardcopy*/(clip);
			break;
		case "CMD_RUN_FILTER":
			if (mdf)
			{
				reload = true;
				if (el.menu.mdf)
				{
					mdf[cell.c] = el.menu.mdf;
				}
				else
				{
					delete mdf[cell.c];
				}
			}
			break;
		case "T_SUM":
		case "T_AVG":
		case "T_MIN":
		case "T_MAX":
		case "T_RANK":
		case "T_POT":
		case "T_CUMUL":
		case "T_INCR":
		case "T_DIFF":
		case "CL_FM":
		case "R_FMT":
			if (mdf)
			{
				me._IN2/*formulaHandler*/(view, t, el.cmd);
			}
			break;
		default:
			if (el.cmd.substring(0, 7) == "detail:")
			{
				var duid = el.cmd.substring(7),
					dview,
					dobj,
					titem,
					tparams;
					
				for (i=0; i < sop.dff1/*drillitems*/.length; i++)
				{
					if (sop.dff1/*drillitems*/[i].uid == duid)
					{
						dview = sop.dff1/*drillitems*/[i];
						break;
					}
				}
				
				if (dview)
				{
					dobj = {
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
					
					titem = dobj.titem;
					tparams = dobj.tparams;
					
					if (dview.titem)
					{
						titem.items = dview.titem.split("_");
						for (i=0; i < titem.items.length; i++)
						{
							if (titem.items[i])
							{
								titem.item_map[titem.items[i]] = 1;
							}
						}
						
						if (titem.items.length)
						{
							titem.enabled = true;
						}
					}
					
					if (dview.tparams)
					{
						tparams.items = dview.tparams.split("_");
						for (i=0; i < tparams.items.length; i++)
						{
							if (tparams.items[i])
							{
								tparams.item_map[tparams.items[i]] = 1;
							}
						}
						
						if (tparams.items.length)
						{
							tparams.enabled = true;
						}
					}
					
					var drillfilter = view._IL7/*getDrillXML*/.call(view, dobj);
					if (drillfilter && drillfilter.length > 0)
					{
						me._INd/*showDetailView*/(view, dview, drillfilter);
					}
				}
			}
			break;
		}
		
		if (sortmethod != sortoption.sortmethod || sortcount != sortoption.sortcount || sortuid != sortoption.sortmeasure)
		{
			reload = true;
			sortoption.sortmethod = sortmethod;
			sortoption.sortcount = sortcount;
			sortoption.sortmeasure = sortuid;
		}
		
		if (reload == true)
		{
			me._ILb_/*contentchanged*/ = true;
			view._IP4/*procUpdateReport*/.call(view);
		}
	},

	_ILf/*makeTempReportXML*/: function(config) {
		var co,
			r = "<smsg><item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(config, "type", "s") + ">";
		
		r += "<objinfo/>";
		
		if (config && config.cubeobj)
		{
			co = config.cubeobj; 
		
			r += "<sel_cube default='" + co.uid + "'>";
			r += "<item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(co, "uid;name;type;nodepath;requirepwd", "s") + "/>";
			r += "</sel_cube>";
		}
		
		r += "</item></smsg>";

		var	xdoc = IG$/*mainapp*/._I13/*loadXML*/(r);
		return xdoc;
	},

	_IG7/*continueReportOption*/: function(dlg, pivotwnd) {
		var me = this,
			i,
			cubeobj = dlg.cubeobj,
			cubeuid = cubeobj ? cubeobj.uid : null,
			reporttype = dlg.reporttype,
			itemtype,
			pb = pivotwnd,
			_ILb/*sheetoption*/,
			_ILa/*reportoption*/ = me._ILa/*reportoption*/,
			ubody, sheetview,
			dzone = me.dzone,
			sheets = me.sheets,
			first_sheet,
			__cs,
			_isnew = 0,
			p, _nc;
		
		if (!me._ILa/*reportoption*/)
		{
			_isnew = 1;
			itemtype = me.itemtype || "Report";
			xdoc = me._ILf/*makeTempReportXML*/({type: itemtype, cubeobj: cubeobj, cubeuid: cubeuid, reportmode: reporttype});
			me._IM9/*rs_loadContent*/(xdoc, false);
			
			_ILa/*reportoption*/ = me._ILa/*reportoption*/;
		}
		
		if (me.reportlayout)
		{
			// me._IN8/*makeLayout*/(me.reportlayout);
			me.reportlayout = null;
		}
		
		__cs = _ILa/*reportoption*/.__cs;
		
		if (cubeuid && (!__cs.m[cubeuid] || _isnew))
		{
			if (!__cs.m[cubeuid])
			{
				p = {
					uid: cubeuid,
					name: cubeobj.name,
					nodepath: cubeobj.nodepath,
					type: cubeobj.type
				};
				
				__cs.m[cubeuid] = p;
				__cs.l.push(p);
			}
			
			if (_ILa/*reportoption*/.sheets.length == 0)
			{
				_ILb/*sheetoption*/ = new IG$/*mainapp*/._IEf/*clReport*/(null, _ILa/*reportoption*/.itemtype, false);
				_ILb/*sheetoption*/.cubeuid = __cs.d;
				_ILa/*reportoption*/.sheets.push(_ILb/*sheetoption*/);
				
				if (!sheets.length)
				{
					ubody = me.aB/*appendBox*/();
									
					dzone._IIc/*setActive*/.call(dzone, ubody);
					sheetview = me._IMd/*createSheet*/(0, _ILb/*sheetoption*/, ubody);
					_ILb/*sheetoption*/.layoutinfo.docid = ubody.docid;

					ubody.setTitle.call(ubody, _ILb/*sheetoption*/.name || "");
					ubody.view = sheetview;
					ubody.objtype = "SHEET";

					ubody.m1/*validateProperty*/.call(ubody);

					ubody.setReportOption.call(ubody, _ILb/*sheetoption*/);

					me.sheets.push(sheetview);
				}
				
				first_sheet = me.sheets[0];
				
				first_sheet._ILa/*reportoption*/ = _ILa/*reportoption*/;
				first_sheet._ILb/*sheetoption*/ = _ILb/*sheetoption*/;
				first_sheet._IN0/*applyOptions*/.call(first_sheet);
				
				dzone._IM5/*updateDisplay*/.call(dzone);
			}
			
			if (pb)
			{
				pb._IGd/*loadSheetOption*/.call(pb, me._ILa/*reportoption*/.sheets[me._IJa/*activeSheet*/], me._ILa/*reportoption*/);
			}
			
			me._IGb/*updateCubePath*/();
			
			me._IN3/*updateToolBar*/();
		}
	},

	_II9/*updateViewMode*/: function(viewmode) {
		var me = this,
			activeview = me.sheets[me._IJa/*activeSheet*/];
		
		me._i0/*pivotvisible*/ && me._aa/*confirmPivot*/(false);
		
		viewmode == "chart" && me._IK6/*showChartToolbar*/(); 
		viewmode != "chart" && me._IK4/*hideChartToolbar*/();
		
		me._IK7/*setRToolbar*/(viewmode == "r");
        me._IK7p/*setPythonToolbar*/(viewmode == "python");
		me._IL3/*updateChartToolbarItems*/(viewmode == "chart" ? false : true);
		me._IL4/*updateRToolbarItems*/(viewmode == "r" ? false : true);
		
		activeview._II9/*updateViewMode*/.call(activeview, viewmode);
	},

	_t$/*toolbarHandler*/: function(cmd, target, filter, dfilter, bload) {
		var me = this,
			dzone = me.dzone,
			ubody, view,
			activeview = me.sheets[me._IJa/*activeSheet*/],
			tbsch = me.down("[name=tbsch]"),
			pop,
			msop;
			
		switch (cmd)
		{
		case "cmd_sheetview":
			me._II9/*updateViewMode*/("grid");
			break;
		case "cmd_chartview":
			me._II9/*updateViewMode*/("chart");
			break;
		case "cmd_rview":
			if (IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.l3 == "L1")
			{
				IG$/*mainapp*/._I52/*ShowError*/("R Viewer is not allowed for license limitation. Please contact ingecep.com for Enterprise license.", me);
			}
			else
			{
				me._II9/*updateViewMode*/("r");
			}
			break;
        case "cmd_pythonview":
            if (IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.l3 == "L1")
			{
				IG$/*mainapp*/._I52/*ShowError*/("Python Viewer is not allowed for license limitation. Please contact ingecep.com for Enterprise license.", me);
			}
			else
			{
				me._II9/*updateViewMode*/("python");
			}
            break;
		case "cmd_run":
			if (me._cld/*schedule_load*/)
			{
				IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("L_C_SCH"), function(e) {
					if (e == "yes")
					{
						tbsch && tbsch.hide();
						me._cld/*schedule_load*/ = 0;
						me._t$/*toolbarHandler*/.call(me, cmd, target, filter, dfilter, bload);
					}
				});
			}
			else
			{
				me._i0/*pivotvisible*/ && me._ab/*updatePivot*/();
				
				if (filter)
				{
					me._IIa/*updateFilterInfo*/(filter);
				}
				
				if (dfilter)
				{
					me._IIa2/*updateDashboardFilterInfo*/(dfilter);
				}
				
				me._i0/*pivotvisible*/ && me._aa/*confirmPivot*/(false);
				me._IJa/*activeSheet*/ = 0;
				activeview = me.sheets[me._IJa/*activeSheet*/];
				if (activeview)
				{
					ubody = dzone._IIb/*getBox*/.call(dzone, activeview._ILb/*sheetoption*/ ? activeview._ILb/*sheetoption*/.layoutinfo.docid : null);
					dzone._IIc/*setActive*/.call(dzone, ubody);
				}
				
				me._IId/*clearAuxFilter*/();
				me._params = null;
				me._K/*refreshParameters*/();
				
				var docfilters = [],
					refinit,
					afterInit,
					afterInitCount = 0,
					dtarget = {};
				
				refinit = function(runall, dtarget) {
					var i,
						me = this,
						view,
						pivotxml,
						msop,
						run = false,
						dzone = me.dzone,
						docitems = me.dzone.docitems || {},
						ditem,
						k, dobj, sheet, sop, auxfilter, f_b_clear = true, pivotxml;
					
					for (i=0; i < me.sheets.length; i++)
					{
						view = me.sheets[i];
						view.__el/*executioncode*/ = 0;
						view._IIe/*clearResult*/ && view._IIe/*clearResult*/.call(view);
                        
                        view._b1/*beforeRun*/.call(view);
						
						msop = view._ILb/*sheetoption*/;
						
						if (msop && (!bload || msop.openload == true))
						{
							run = runall == 1 ? true : ((dtarget && dtarget[i] == 1) ? true : false);
							
							if (run)
							{
								view._IIf/*customLoad*/.call(view, true, true);
								if (view._IK9/*olapset*/)
								{
									view._IK9/*olapset*/._ILa/*reportoption*/._dfilter = view._dfilter;
									pivotxml = view._IK9/*olapset*/._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(view._IK9/*olapset*/._ILa/*reportoption*/);
									view._IK9/*olapset*/._IJ0/*requestUpdateReport*/(pivotxml, "mode", view.sheetindex, view);
								}
								else
								{
									view._IJ2/*procRunReport*/.call(view);
								}
							}
						}
					}
					
					for (k in docitems)
					{
						dobj = docitems[k];
						ditem = dobj.lt.ubody;
						
						if (ditem.objtype == "RPT_VIEW")
						{
							if (dobj.parent && dobj.parent.loc == "inner" && dobj.parent.node && dobj.parent.node.objtype == "TAB")
							{
								if (dobj.parent.node.active != ditem.docid)
								{
									ditem.visible = false;
								}
								else
								{
									ditem.visible = true;
								}
							}
							else
							{
								ditem.visible = true;
							}
							
							if (ditem.visible == true && ditem.view && !ditem.view._v1d/*validated*/)
							{
								ditem.view._df1/*directfilter*/ = ditem.view._df1/*directfilter*/ || {};
								ditem.view._v2/*validateFilter*/ = true;
								
								if (f_b_clear)
								{
									auxfilter = ditem.view._df1/*directfilter*/;
									for (fname in auxfilter)
									{
										if (fname.indexOf("report_") > -1 || fname.indexOf("filter_") > -1)
										{
											delete auxfilter[fname];
										}
									}
								}
								
								ditem.view.l3/*validateItems*/.call(ditem.view, runall == 1);
								continue;
							}
							
							if (ditem.view)
							{
								if (ditem.view.irpt)
								{
									for (i=0; i < ditem.view.irpt.sheets.length; i++)
									{
										sheet = ditem.view.irpt.sheets[i];
										sop = sheet._ILb/*sheetoption*/;
										
										if (f_b_clear)
										{
											auxfilter = sop._IL9/*auxfilter*/;
											for (fname in auxfilter)
											{
												if (fname.indexOf("report_") > -1 || fname.indexOf("filter_") > -1)
												{
													delete auxfilter[fname];
												}
											}
										}
										
										if (ditem.visible == true && runall == 1)
										{
                                            sheet._b1/*beforeRun*/.call(sheet);
                                            
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
										else
										{
											ditem.view._v2/*validateFilter*/ = true;
										}
									}
								}
								else
								{
									ditem.view._df1/*directfilter*/ = ditem.view._df1/*directfilter*/ || {};
									ditem.view._v2/*validateFilter*/ = true;
									
									if (f_b_clear)
									{
										auxfilter = ditem.view._df1/*directfilter*/;
										for (fname in auxfilter)
										{
											if (fname.indexOf("report_") > -1 || fname.indexOf("filter_") > -1)
											{
												delete auxfilter[fname];
											}
										}
									}
								}
							}
						}
					}
				};
				
				for (i=0; i < dzone.items.length; i++)
				{
					view = dzone.items[i].view;
					if (view && view._IJ3/*initFilter*/)
					{
						view._i10/*afterInit*/ = null;
						docfilters.push(view);
					}
				}
				
				if (docfilters.length > 0)
				{
					afterInit = function(view, result) {
						afterInitCount++;
						
						var me = this,
							sfilter = view.l7/*getFilter*/.call(view),
							i, sheets = me.sheets,
							showbutton = view._ILb/*sheetoption*/.pff1a/*filteroptions*/.showbutton,
							edrill = view._ILb/*sheetoption*/.pff1a.edrill,
							drilltarget = view._ILb/*sheetoption*/.pff1a.drilltarget,
							mtarget = new IG$/*mainapp*/._dpca/*drilltarget*/(drilltarget),
							docitems = me.dzone.docitems || {},
							filtername = "filter_" + me.dzone._dzid + "_" + view._ILb/*sheetoption*/.docid,
							r,
							dobj,
							tab_changes = [];
						
						r = view.l5m/*checkFilterValues*/.call(view, 1, tab_changes);
						
						if (!showbutton)
						{
							for (i=0; i < sheets.length; i++)
							{
								sheet = sheets[i];
								sop = sheet._ILb/*sheetoption*/;
								docid = (sop.layoutinfo ? sop.layoutinfo.docid : null);
								ditem = docitems[docid];
								dobj = mtarget._2/*isDrillTarget*/("sheet_" + i);
								if (!edrill && mtarget._e && !dobj)
									continue;
								
								sop._IL9/*auxfilter*/[filtername] = sfilter;
								
								if (ditem && ditem.visible == false)
									continue;
								
								dtarget[i] = typeof(dtarget[i]) == "undefined" ? 1 : dtarget[i];
								dtarget[i] = (r && dtarget[i] == 1) ? 1 : 0;
							}
						}
						
						view._i10/*afterInit*/ = null;
						
						if (afterInitCount == docfilters.length)
						{
							refinit.call(me, 2, dtarget);
						}
					};
					
					$.each(docfilters, function(n, view) {
						view._i10/*afterInit*/ = {
							p: me,
							f: afterInit
						};
						view._IJ3/*initFilter*/.call(view, null, 1);
					});
				}
				else
				{
					refinit.call(me, 1);
				}
				
				me._IJ4/*broadCastFilter*/();
			}
			break;
		case "cmd_save":
			me._i0/*pivotvisible*/ && me._ab/*updatePivot*/();
			
			if (me._ILa/*reportoption*/)
			{
				me._i0/*pivotvisible*/ && me._aa/*confirmPivot*/(false);
				
				var r = IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IJ7/*preSaveContent*/.call(me),
					uid = r.uid;

				if (!uid)
				{
					me._IJ5/*saveAsPivotContent*/(false);
				}
				else
				{
					var pivotxml = me._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(me._ILa/*reportoption*/);
					me._IJ6/*savePivotContent*/(uid, pivotxml, target);
				}
			}
			break;
		case "cmd_saveas":
			me._i0/*pivotvisible*/ && me._ab/*updatePivot*/();
			
			IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IJ7/*preSaveContent*/.call(me);
			me._IJ5/*saveAsPivotContent*/(false);
			break;
		case "cmd_showpivot":
			me._i0/*pivotvisible*/ = me._i0/*pivotvisible*/ || false;
			me._aa/*confirmPivot*/(!me._i0/*pivotvisible*/);
			break;
		case "cmd_chartwizard":
			pop = new IG$/*mainapp*/._Ia3/*chartwizard*/({
				_ILa/*reportoption*/: me._ILa/*reportoption*/, 
				_ILb/*sheetoption*/: me._ILa/*reportoption*/.sheets[me._IJa/*activeSheet*/],
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IJ9/*updateChartOption*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
			break;
		case "cmd_r_summary":
		case "cmd_r_script":
			activeview._IH8/*rcontainer*/._IJ8/*controlWindows*/.call(activeview._IH8/*rcontainer*/, cmd);
			break;
		case "cmd_r_simage_png":
			me._IB3/*exportToFile*/("PNG");
			break;
		case "cmd_r_simage_svg":
			me._IB3/*exportToFile*/("SVG");
			break;
		case "cmd_r_wizard":
			pop = new IG$/*mainapp*/._If3/*r_wizard_u*/({
				dc: activeview._IH8/*rcontainer*/.f5u/*getDataColumns*/.call(activeview._IH8/*rcontainer*/),
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._INa/*closeRWizard*/)
			});
			pop.show(me);
			break;
        case "cmd_py_edit":
            var pview = activeview._IH8a/*pythoncontainer*/;
            pview && pview._do_edit.call(pview, true);
            break;
		case "cmd_export_excel":
			me._IB3/*exportToFile*/("EXCEL");
			break;
		case "cmd_export_html":
			me._IB3/*exportToFile*/("HTML");
			break;
		case "cmd_export_pdf":
			me._IB3/*exportToFile*/("PDF");
			break;
		case "cmd_export_csv":
			activeview._IP6/*downloadAllCSV*/.call(activeview);
			break;
		case "cmd_export_tmpl":
			me._IB3/*exportToFile*/("TMPL");
			break;
		case "cmd_export_prt":
			me._IB3/*exportToFile*/("PDF", true);
			break;
		case "cmd_clipboard":
			me._IB2/*clipboardCopy*/();
			break;
		case "cmd_export_office":
			var rop = me._ILa/*reportoption*/,
				expoption = rop.exportOption,
				fname = rop.name,
				req = new IG$/*mainapp*/._I3e/*requestServer*/(),
				exportdata,
				tname = target.name,
				text,
				n,
				stype = "TMPL_OC",
				filetype = "TMPL",
				outputformat;
				
			fname = fname.replace(/\./g, "_");
			fname = fname.replace(/ /g, "");
			
			n = tname.lastIndexOf(".");
			
			if (n > 0)
			{
				text = tname.substring(n+1);
				
				if (text == "docx" || text == "doc")
				{
					stype = "TMPL_T";
					
					if (target.export_type)
					{
						outputformat = target.export_type;
						fname += "." + (outputformat == "field" ? "fields.xml" : outputformat);
					}
					else
					{
						fname += "." + text;
					}
				}
			}
				
			exportdata = me._IB4/*getExportData*/(expoption, "office");
			
			me.setLoading(true);
			
			req.init(me, 
				{
					ack: "20",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({
						uid: me.uid,
						type: stype,
						filename: fname,
						utemplate: "T",
						tmpluid : target.uid,
						tmplname: target.name,
						tmpltype: target.type,
						outputformat: outputformat
					}, "uid;type;filename;fonttype;utemplate;tmpluid;tmplname;tmpltype;outputformat"),
					mbody: exportdata
				}, me, me.r_IB3/*exportToFile*/, null, fname);
			req._l/*request*/();
			break;
		case "cmd_export_jasper":
			var rop = me._ILa/*reportoption*/,
				expoption = rop.exportOption,
				fname = rop.name,
				req = new IG$/*mainapp*/._I3e/*requestServer*/(),
				exportdata,
				filetype = "TMPL";
				
			fname = fname.replace(/\./g, "_");
			fname = fname.replace(/ /g, "");
			
			fname += "." + (target.toLowerCase() == "excel" ? "xls" : target);
				
			exportdata = me._IB4/*getExportData*/(expoption, "jasper");
			
			me.setLoading(true);
			
			req.init(me, 
				{
					ack: "20",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({
						uid: me.uid,
						type: filetype,
						filename: fname,
						fonttype: (expoption && expoption.fonttype ? expoption.fonttype : ""),
						utemplate: "T",
						tmplpage: expoption.jasper && expoption.jasper.jasper_template,
						tmpluid : expoption.jasper && expoption.jasper.jasper_tmpl_uid,
						jasper_filetype: target
					}, "uid;type;filename;fonttype;utemplate;tmplpage;tmpluid;jasper_filetype"),
					mbody: exportdata
				}, me, me.r_IB3/*exportToFile*/, null, fname);
			req._l/*request*/();
			break;
		case "cmd_export_option":
			pop = new IG$/*mainapp*/._Ia2/*exportWizard*/({
				_ILa/*reportoption*/: me._ILa/*reportoption*/,
				_ILb/*sheetoption*/: activeview ? activeview._ILb/*sheetoption*/ : null,
				dzone: me.dzone,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IJb/*updateExportOption*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
			break;
		case "cmd_filter":
			pop = new IG$/*mainapp*/._Ia1/*filterEditorWindow*/({
				_ILa/*reportoption*/: me._ILa/*reportoption*/,
				_ILb/*sheetoption*/: activeview._ILb/*sheetoption*/,
				targetitem: target,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IJd/*updateFilterChange*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
			break;
		case "cmd_edit_data":
			pop = new IG$/*mainapp*/._If7/*dateMetric*/({
				_ILa/*reportoption*/: me._ILa/*reportoption*/,
				_ILb/*sheetoption*/: activeview._ILb/*sheetoption*/,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IJc/*updateDataChange*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
			break;
		case "cmd_prompt":
			var sop = activeview._ILb/*sheetoption*/,
				prompts = sop.needPrompt.call(sop);
			activeview.showPrompt.call(activeview, prompts);
			break;
		case "cmd_view_sql":
			if (activeview)
			{
				pop = new IG$/*mainapp*/.mA$_b/*dlgsqlview*/({
					_ILa/*reportoption*/: me._ILa/*reportoption*/,
					_ILb/*sheetoption*/: activeview._ILb/*sheetoption*/,
					uid: me.uid,
					_IJa/*activeSheet*/: me._IJa/*activeSheet*/
				});
				IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
			}
			break;
		case "cmd_change_type":
			me._IB5/*showReportOption*/();
			break;
		case "cmd_add_sheet":
			pop = new IG$/*mainapp*/._If1/*sheetobj*/({
				dzone: me.dzone,
				sheets: me.sheets,
				_ILa/*reportoption*/: me._ILa/*reportoption*/,
				_l1/*isnewobject*/: true,
				objtype: target || "SHEET",
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.addSheet)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
			break;
		case "cmd_dock_panel":
			me.dzone.editmode = me.dzone.editmode ? false : true;
			me.dzone._IM5/*updateDisplay*/.call(me.dzone);
			break;
		case "cmd_edit_sql":
			pop = new IG$/*mainapp*/._Ib1/*sqlcube_wizard*/({
				_ILa/*reportoption*/: me._ILa/*reportoption*/,
				_ILb/*sheetoption*/: activeview._ILb/*sheetoption*/,
				uid: me.uid,
				_IJa/*activeSheet*/: me._IJa/*activeSheet*/,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IN7/*postEditSql*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
			break;
		case "cmd_sort_option":
			pop = new IG$/*mainapp*/._If0/*sortOptionDlg*/({
				_ILa/*reportoption*/: me._ILa/*reportoption*/,
				_ILb/*sheetoption*/: activeview._ILb/*sheetoption*/,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IO3/*updatePivotContent*/)
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
			break;
		case "cmd_statistics":
			pop = new IG$/*mainapp*/._Ief/*statistics*/({
				_IK2/*mresults*/: activeview._IK2/*mresults*/
			});
			pop.show(me);
			break;
		case "cmd_layout":
			pop = new IG$/*mainapp*/._Ibd/*dashboardLayoutTemplate*/({
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IN8/*makeLayout*/, false)
			});
			pop.show(me);
			break;
		case "cmd_loption":
			me._IM7/*configDockNotify*/();
			break;
		case "cmd_schedule":
			if (me.uid)
			{
				var mreq = me._IN6/*getRequests*/();
				
				IG$/*mainapp*/._I50/*showScheduler*/(me, me.uid, me.itemtype, mreq, me._ILa/*reportoption*/);
			}
			break;
		case "cmd_favorites":
			if (me.uid)
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
			break;
		case "cmd_share":
			if (me.uid)
			{
				me._s1/*showShare*/();
			}
			break;
		}
	},

	_s1/*showShare*/: function() {
		var me = this,
			igc_msr = $("#igc_msr"),
			igc_msr_s = $("#igc_msr_s", igc_msr),
			m_done = $("#m_done", igc_msr_s),
			m_close = $("#m_close", igc_msr_s),
			m_lnk = $("#m_lnk", igc_msr_s),
			m_msg = $("#m_msg", igc_msr_s),
			close_dlg = function() {
				igc_msr_s.hide();
				igc_msr.fadeOut();
			},
			l_url = ig$/*appoption*/.applink || "",
			objid = "{objid}",
			n,
			m_em = $("#m_em", igc_msr_s);
		
		if (igc_msr && igc_msr.length)
		{
			igc_msr_s.show();
			igc_msr.show();
			
			n = l_url.indexOf(objid);
			if (n > -1)
			{
				l_url = l_url.substr(0, n) + me.uid + l_url.substr(n + objid.length);
			}
			
			m_lnk.val(l_url);
			m_msg.val("");
			
			m_done.unbind("click");
			m_done.bind("click", function() {
				var email = m_em.val(),
					msg = m_msg.val();
				
				if (email)
				{
					var req = new IG$/*mainapp*/._I3e/*requestServer*/(),
						addr = "<smsg><item><recipient><![CDATA[" + email + "]]></recipient><params><param name='message'><![CDATA[" + msg + "]]></param><param name='uid'><![CDATA[" + (me.uid || "") + "]]></param><param name='linkurl'><![CDATA[" + l_url + "]]></param></params></item></smsg>";
					req.init(me, 
						{
							ack: "76",
							payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: me.uid, mtype: "share_item"}, "uid;mtype"),
							mbody: addr
						}, me, function(xdoc) {
							close_dlg();
						});
					req._l/*request*/();
				}
				else
				{
					close_dlg();
				}
			});
			
			m_close.unbind("click");
			m_close.bind("click", function() {
				close_dlg();
			});
		}
	},

	_IJ7/*preSaveContent*/: function() {
		var me = this,
			uid,
			i,
			sheet,
			dzone = me.dzone,
			r;
			
		if (me.sheets.length > 1)
		{
			for (i=0; i < me.sheets.length; i++)
			{
				sheet = me.sheets[i];
				sheet._ILb/*sheetoption*/.layoutinfo = {
					docid: sheet.renderBox,
					collapsed: sheet.collapsed, 
					headerposition: sheet.headerPosition,
					region: sheet.region,
					width : sheet.getWidth(),
					height: sheet.getHeight()
				};
			}
		}
		
		uid = me._ILa/*reportoption*/.uid;
		// me._ILa/*reportoption*/.layoutinfo = dzone.l10a/*getLayout*/.call(dzone);
		me._ILa/*reportoption*/.savelayoutinfo = dzone.l10a/*getLayout*/.call(dzone);
		
		r = {
			uid: uid
		};
		
		return r;
	},

	_INd/*showDetailView*/: function(view, dview, dfilter) {
		var me = this;
		
		var auxfilter = {},
			vfilter = view._ILb/*sheetoption*/._IL9/*auxfilter*/,
			key, vkey,
			mkey;
		
		for (key in vfilter)
		{
			vkey = key.replace(/report/, "pageRPT");
			vkey = vkey.replace(/filter/, "pageFLT");
			
			mkey = dview.uid + "_" + vkey;
			
			if (key == "report_" + view.sheetindex)
			{
				auxfilter[mkey] = dfilter;
			}
			else
			{
				auxfilter[mkey] = vfilter[key]
			}
		}
		
		auxfilter[dview.uid + "_" + "pageRPT_" + view.sheetindex] = dfilter;
		
		if (dview.showintab && IG$/*mainapp*/._I7d/*mainPanel*/)
		{
			var mainpanel = IG$/*mainapp*/._I7d/*mainPanel*/,
				option = {
					auxfilter: auxfilter
				};
			// uid, itemtype, itemname, itemaddr, baddhistory, writable, option, toption
			mainpanel.m1$7/*navigateApp*/.call(mainpanel, dview.uid, dview.type || "report", dview.name, dview.nodepath, true, null, null, option);
		}
		else
		{
			var dlg = new IG$/*mainapp*/._Ibc/*detailDrillWin*/({
				viewinfo: dview,
				auxfilter: auxfilter
			});
			IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
		}
	},

	_IJ5/*saveAsPivotContent*/: function(afterclose) {
		var me = this,
			dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
				mode: "newitem",
				initpath: me.nodepath
			});
		dlgitemsel.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IO4/*saveNewPivotContent*/, afterclose);
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	},

	_IO4/*saveNewPivotContent*/: function(item, afterclose) {
		var me = this,
			reportoption = me._ILa/*reportoption*/,
			pivotxml = reportoption._IJ1/*getCurrentPivot*/.call(reportoption),
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		req.init(me, 
			{
				ack: "31",
				payload: "<smsg><item address='" + item.nodepath + "/" + item.name + "' name='" + item.name + "' type='" + (me.itemtype ? me.itemtype : 'Report') + "' pid='" + item.uid + "' description=''/></smsg>",
				mbody: pivotxml //IG$/*mainapp*/._I2e/*getItemOption*/()
			}, me, me._IO5/*rs_processMakeMetaItem*/, me._IO6/*rs_processMakeMetaItem*/, [item.name, afterclose, item.nodepath, item.uid, pivotxml]);
		req.showerror = false;
		req._l/*request*/();
		//me._IJ6/*savePivotContent*/(dlg.uid, me.pivot);
	},

	_IO6/*rs_processMakeMetaItem*/: function(xdoc, opt) {
		var me = this,
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
					req.init(me, 
						{
							ack: "31",
							payload: "<smsg><item address='" + nodepath + "/" + itemname + "' name='" + itemname + "' type='" + (me.itemtype ? me.itemtype : 'Report') + "' pid='" + pitemuid + "' description='' overwrite='T'/></smsg>",
							mbody: pivotxml //IG$/*mainapp*/._I2e/*getItemOption*/()
						}, me, me._IO5/*rs_processMakeMetaItem*/, null, [itemname, afterclose, nodepath]);
					req._l/*request*/();
				}
			}, me, me);
		}
		else
		{
			IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, me);
		}
	},

	_IO5/*rs_processMakeMetaItem*/: function(xdoc, opt) {
		var me = this,
			i,
			itemname = opt[0],
			afterclose = opt[1],
			reportoption = me._ILa/*reportoption*/,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			name = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "name");
			
		if (afterclose == true)
		{
			me.ignoreclose = true;
			me.close();
			return;
		}
		
		me._ILb_/*contentchanged*/ = false;
		me.uid = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "uid");
		
		for (i=0; i < me.sheets.length; i++)
		{
			if (me.sheets[i]._IK9/*olapset*/) 
			{
				me.sheets[i]._IK9/*olapset*/.uid = me.uid;
			}
		}
		reportoption.uid = me.uid;
		reportoption.name = name;
		me.setTitle(name);
		
		// var pivotxml = me._IK9/*olapset*/._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(me._IK9/*olapset*/._ILa/*reportoption*/);
		// me._IJ6/*savePivotContent*/(me.uid, pivotxml);
	},

	_IO3/*updatePivotContent*/: function() {
		this._t$/*toolbarHandler*/("cmd_run");
	},

	_IId/*clearAuxFilter*/: function() {
		var me = this,
			i, sheet,
			sheets = me.sheets;
		if (sheets && sheets.length > 0)
		{
			for (i=0; i < sheets.length; i++)
			{
				sheet = sheets[i];
				
				// if (sheet._ILb/*sheetoption*/.drillreport == true)
				// {
					auxfilter = sheet._ILb/*sheetoption*/._IL9/*auxfilter*/;
					for (fname in auxfilter)
					{
						if (fname.indexOf("report_") > -1 || fname.indexOf("filter_") > -1)
						{
							delete auxfilter[fname];
						}
					}
				// }
			}
		}
	},

	_IGa/*updateReportCount*/: function(afterload) {
		var me = this,
			n = me._IJa/*activeSheet*/,
			activesheet = n > -1 ? me.sheets[n] : null,
			tbrescount = me.down("[name=tbrescount]"),
			tbcache = me.down("[name=tbcache]"),
			disp = "",
			bcache = 0,
			cdate = "",
			isrunning = false,
			sheets = me.sheets,
			i;

		if (activesheet)
		{
			if (activesheet._IK2/*mresults*/ && activesheet._IK2/*mresults*/.results && activesheet._IK2/*mresults*/.results.length > 0)
			{
				disp = "(Row: " + activesheet._IK2/*mresults*/.results[0].rows + ", Cols: " + activesheet._IK2/*mresults*/.results[0].cols + ")";
				bcache = activesheet._IK2/*mresults*/.results[0].cache;
				cdate = activesheet._IK2/*mresults*/.results[0].u_cache_time;
			}
		}

		if (afterload)
		{
			for (i=0; i < sheets.length; i++)
			{
				if (sheets[i].__el/*executioncode*/ == 1)
				{
					isrunning = true;
					break;
				}
			}

			if (!isrunning)
			{
				me._d1/*doDashboardExit*/.call(me);
			}
		}

		tbrescount && tbrescount.setText(disp);
		if (tbcache)
		{
			tbcache.setVisible(bcache);
			tbcache.setTooltip("DATA ON : " + cdate + "\nClick to refresh data!");
		}
	},

	_IGb/*updateCubePath*/: function() {
		var me = this,
			tbcubepath = me.down("[name=tbcubepath]"),
			activeview = me.sheets[me._IJa/*activeSheet*/],
			__cs = me._ILa/*reportoption*/.__cs,
			cubeuid = activeview ? activeview._ILb/*sheetoption*/.cubeuid : null,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			citem,
			i;

		tbcubepath.setText("");
		tbcubepath.hide();
		
		__cs.m[cubeuid] && me._IMf/*updateCubeInfo*/(__cs.m[cubeuid]); 
	},

	aB/*appendBox*/: function(objtype) {
		var me = this,
			ubody,
			dzone = me.dzone,
			_root = dzone._root,
			_nc = {
				objtype: "SHEET",
				docid: null,
				_direction: 0,
				parent: _root,
				width: 100,
				height: 100
			};
		
		_root.children.push(_nc);
		
		ubody = dzone._IMc/*appendBox*/.call(dzone, null, {
			width: (_nc.width ? parseInt(_nc.width) : null), 
			height: (_nc.height ? parseInt(_nc.height) : null),
			draggable: dzone.draggable
		}, objtype || "SHEET");
		
		_nc.docid = ubody.docid;
		ubody.objtype = _nc.objtype;
		
		_nc.lt = {
			pos: {
				x: 0,
				y: 0,
				w: 0,
				h: 0
			},
			ubody: ubody
		};
		
		ubody._pc = _nc;
		
		ubody.m1/*validateProperty*/.call(ubody);
		
		return ubody;
	},

	_ILf_/*updateLayout*/: function(firstrender) {
		var me = this,
			i,
			sheetview,
			sheet,
			sop,
			sheets = me.sheets,
			borderpanel = me._3/*borderpanel*/,
			doc = $(borderpanel.body),
			dzone = me.dzone,
			_root = dzone._root,
			pb = me._IM4/*pivotBrowser*/,
			ubody, _nc;

		if (!firstrender)
		{
			for (i=0; i < me._ILa/*reportoption*/.sheets.length; i++)
			{
				sop = me._ILa/*reportoption*/.sheets[i];

				if (sheets.length > i)
				{
					sheet = sheets[i];
					ubody = dzone._IIb/*getBox*/.call(dzone, sop.layoutinfo.docid);
				}
				else
				{
					ubody = me.aB/*appendBox*/();
					
					sop.layoutinfo.docid = ubody.docid;
					sheet = me._IMd/*createSheet*/(i, me._ILb/*sheetoption*/, ubody);
					sheet._ILa/*reportoption*/ = me._ILa/*reportoption*/;

					ubody.view = sheet;
					ubody.objtype = "SHEET";
					ubody.m1/*validateProperty*/.call(ubody);

					ubody.setReportOption.call(ubody, sop);

					me.sheets.push(sheet);
					
					if (me._i0/*pivotvisible*/ && pb)
					{
						setTimeout(function() {
							sheet._II9/*updateViewMode*/.call(sheet, "d");
							sheet.Uc/*updateCubeSelection*/.call(sheet, pb.cubeuid);
						}, 100);
					}
				}

				if (ubody)
				{
					ubody.setTitle.call(ubody, sop.name || "");
					ubody.showTitle.call(ubody, !sop.hidetitle);
				}
				sheets[i]._ILb/*sheetoption*/ = sop;
				sheets[i]._IN0/*applyOptions*/.call(sheets[i]);
			}
		}
		else
		{
			for (i=0; i < me.sheets.length; i++)
			{
				// mlayout.items.push(me.sheets[i]);
				sop = me._ILa/*reportoption*/.sheets[i];
				sheets[i]._ILb/*sheetoption*/ = sop;
				sheets[i]._IN0/*applyOptions*/.call(sheets[i]);
			}
		}
	},

	_IJb/*updateExportOption*/: function() {
		var me = this,
			rop = me._ILa/*reportoption*/,
			expoption = rop.exportOption || {},
			jopt = expoption ? expoption["jasper"] : null,
			titem = me.down("[name=jasper]"),
			oitem = me.down("[name=office]"),
			r = false,
			n = 0;

		if (!me._2/*toolbar*/)
			return;
		
		$.each(["xls", "pdf", "html", "csv"], function(i, n) {
			var c = me.down("[name=ig_r_" + n + "]");
			c && c.setVisible(expoption["u_" + (n == "xls" ? "excel" : n)] && !ig$/*appoption*/.fm/*features*/["ig_r_" + n]);
		});
		
		if (expoption.u_office && expoption.otmpl && expoption.otmpl.length)
		{
			oitem.show();
			oitem.menu.removeAll();
			
			$.each(expoption.otmpl, function(i, p) {
				oitem.menu.add({
					xtype: "menuitem",
					text: p.description || p.name,
					handler: function() {
						me._t$/*toolbarHandler*/.call(me, "cmd_export_office", p);
					}
				});
			});
		}
		else
		{
			oitem.hide();
		}
		
		if (jopt && jopt.jasper_template && expoption.u_jasper)
		{
			r = true;

			titem.menu.removeAll();

			me.dft_jasp_exp = null;

			$.each(["pdf", "rtf", "ppt", "csv", "excel", "xlsx", "docx", "html", "xml"], function(i, k) {
				if (jopt[k + "_output"] == "T")
				{
					if (n == 0)
					{
						me.dft_jasp_exp = k;
					}
					titem.menu.add({
						xtype: "menuitem",
						text: jopt[k + "_label"] || k,
						handler: function() {
							// IExport["jasper"].exportReport(report, k);
							me._t$/*toolbarHandler*/.call(me, "cmd_export_jasper", k);
						}
					});
					n++;
				}
			});
		}

		me.down("[name=jasper]").setVisible(r && expoption.u_jasper && !ig$/*appoption*/.fm/*features*/["ig_r_jasper"]);

		if (window.IExport)
		{
			var me = this,
				k,
				ticon,
				v = false,
				tb = me._2/*toolbar*/;

			for (k in window.IExport)
			{
				if (window.IExport[k].toolbar)
				{
					ticon = tb.down("[name=" + window.IExport[k].name + "]");
					v = window.IExport[k].toolbarShow(me);
					ticon.setVisible(v);
				}
			}
		}
	},

	_IN2/*formulaHandler*/: function(view, uitem, formula) {
		var me = this,
			i,
			index, position, subformula, nformula,
			sop = view._ILb/*sheetoption*/,
			formulas = sop.Xsf/*sheetformula*/,
			t, expr, tobj,
			b_update = 0,
			dlg;

		if (uitem)
		{
			subformula = [];
			
			if (formula.toLowerCase() == "cl_fm")
			{
				for (i=formulas.length-1; i>= 0; i--)
				{
					if (formulas[i].baseuid == uitem.uid)
					{
						formulas.splice(i, 1);
						b_update = 1;
					}
				}
			}
			else if (formula.toLowerCase() == "r_fmt")
			{
				dlg = new IG$/*mainapp*/._IEF/*dlgFormulaSelector*/({
					pR: me,
					pS: view,
					pF: formulas,
					pI: uitem,
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(sel) {
						var i,
							f = formulas;
						
						for (i=f.length-1; i>=0; i--)
						{
							if (f[i].baseuid == uitem.uid)
							{
								f.splice(i, 1);
							}
						}
						
						for (i=0; i < sel.length; i++)
						{
							f.push(sel[i]);
						}
						
						me._ILb_/*contentchanged*/ = true;
						me._IO2/*updatePivotContent*/.call(me, me._IJa/*activeSheet*/);
					})
				});
				dlg.show();
			}
			else
			{
				for (i=0; i < formulas.length; i++)
				{
					if (formulas[i].baseuid == uitem.uid)
					{
						if (formulas[i].expression == formula.toUpperCase())
							return;
						subformula.push(formulas[i]);
					}
				}
				
				if (subformula.length > 0)
				{
					nformula = subformula[0];
				}
				else
				{
					nformula = new IG$/*mainapp*/._IF0/*clSheetFormula*/(null);
					formulas.push(nformula);
				}
				
				b_update = 1;
				
				nformula.baseuid = uitem.uid;
				nformula.direction = "vertical";
				nformula.formatstring = "";
				nformula.stylename = null;
				nformula.type = null;
				nformula.separatecolumn = true;
				nformula.subtotalbase = null;
				nformula.usecolumnformat = true;
				nformula.showtoprow = "F";
				nformula.groupresults = "F";
				nformula.fid = "formula_" + sop.si;
				sop.si++;
				
				tobj = IG$/*mainapp*/._IEFc/*formulas*/[formula.toLowerCase()];
				
				if (tobj)
				{
					t = tobj.title;
					expr = tobj.expr;
					
					if (typeof(tobj.usecolumnformat) != "undefined")
					{
						nformula.usecolumnformat = tobj.usecolumnformat;
					}
					
					if (typeof(tobj.formatstring) != "undefined")
					{
						nformula.formatstring = tobj.formatstring;
					}
					
					nformula.title = t;
					nformula.expression = expr;
				}
			}
			
			if (b_update)
			{
				me._ILb_/*contentchanged*/ = true;
				me._IO2/*updatePivotContent*/(me._IJa/*activeSheet*/);
			}
		}
	},

	_IN6/*getRequests*/: function() {
		var me = this,
			r = [],
			i,
			dzone = me.dzone,
			view;
		var cnt, obj, cmd, pwd, rop, op;

		for (i=0; i < dzone.items.length; i++)
		{
			view = dzone.items[i].view;
			if (view && view._IIe/*clearResult*/)
			{
				rop = view._ILa/*reportoption*/;

				if (rop && rop.poolname && IG$/*mainapp*/.dbp[rop.poolname])
				{
					pwd = IG$/*mainapp*/.dbp[rop.poolname];
				}
				cmd = "18";

				op = rop.reportmode == "rolap" ? "run" :
					rop.reportmode == "sql" ? "sqlrun" : "run",

				obj = "<smsg><item " +
					IG$/*mainapp*/._I21/*XUpdateInfo*/({
						uid: this.uid,
						option: op,
						active: "" + view.sheetindex,
						pivotresult: "T",
						pwd: (pwd ? pwd : null)
					}) + "/></smsg>";
				
				cnt = r.length == 0 ? view._ILa/*reportoption*/._IJ1/*getCurrentPivot*/() : "";

				r.push({
					ack: cmd,
					payload: obj,
					mbody: cnt,
					jobkey: "" + view.sheetindex
				});
			}
		}

		return r;
	},

	_INb/*createControl*/: function(sop, ubody) {
		var me = this,
			dzone = me.dzone,
			sheet,
			_root = dzone._root,
			_nc;

		_root.children = _root.children || [];
		
		if (!ubody)
		{
			_nc = {
				objtype: sop.objtype,
				docid: null,
				_direction: 0,
				parent: _root,
				width: 100,
				height: 100
			};
			
			_root.children.push(_nc);
			
			ubody = dzone._IMc/*appendBox*/.call(dzone, null, {
				width: (_nc.width ? parseInt(_nc.width) : null), 
				height: (_nc.height ? parseInt(_nc.height) : null),
				draggable: dzone.draggable
			}, sop.objtype);
			
			_nc.docid = ubody.docid;
			ubody.objtype = _nc.objtype;
			
			_nc.lt = {
				pos: {
					x: 0,
					y: 0,
					w: 0,
					h: 0
				},
				ubody: ubody
			};
			
			ubody._pc = _nc;
			
			ubody.m1/*validateProperty*/.call(ubody);
		}

		sop.docid = ubody.docid;

		switch (sop.objtype)
		{
		case "NAVI":
			sheet = new IG$/*mainapp*/._IA3/*rfNavi*/(ubody.b3/*boxcontent*/, sop, me._ILa/*reportoption*/, me);
			break;
		case "FILTER":
			sheet = new IG$/*mainapp*/._Ied/*dynFilterView*/(ubody.b3/*boxcontent*/, sop, me);
			sheet.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._IO1/*onFilterUpdate*/);
			break;
		case "TEXT":
			sheet = new IG$/*mainapp*/._IA2/*rfText*/(ubody.b3/*boxcontent*/, sop);
			break;
		case "PANEL":
			sheet = new IG$/*mainapp*/._IA4/*rfBlankPanel*/(ubody.b3/*boxcontent*/, sop);
			break;
		case "TAB":
			sheet = new IG$/*mainapp*/._IA5/*rfTabPanel*/(ubody.b3/*boxcontent*/, sop, me.dzone);
			break;
		case "RPT_VIEW":
			sheet = new IG$/*mainapp*/._IA5r/*rfReportViewer*/(ubody.b3/*boxcontent*/, sop, me);
			break;
		}

		ubody.view = sheet;
		ubody.objtype = sop.objtype;
		ubody.m1/*validateProperty*/.call(ubody);

		ubody.setReportOption.call(ubody, sop);
		
		if (sop.objtype == "FILTER" && sheet._IFd/*init_f*/)
		{
			setTimeout(function() {
				sheet._IFd/*init_f*/.call(sheet);
			}, 100);
		}

		return ubody;
	},

	__l1/*boxresized*/: function(sheet, sz) {
		var me = this,
			items = me.dzone.items,
			i,
			sop = sheet._ILb/*sheetoption*/,
			docid = (sop.layoutinfo ? sop.layoutinfo.docid : null),
			ditem,
			cw,
			ch,
			b1, b2, gw, gh;

		for (i=0; i < items.length; i++)
		{
			if (items[i].docid == docid)
			{
				ditem = items[i];
				break;
			}
		}

		if (ditem)
		{
			b1 = ditem.b1/*box*/.offset();
			b2 = ditem.b3/*boxcontent*/.offset();
			gw = b2.left - b1.left;
			gh = b2.top - b1.top;
			cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(ditem.b3/*boxcontent*/);
			ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(ditem.b3/*boxcontent*/);
			cw = Math.max(cw, sz.cw);
			ch = Math.max(ch, sz.ch);
			ditem.fw/*fixedwidth*/ = (sz.tw > cw);
			ditem.fh/*fixedheight*/ = (sz.th > ch);
			ditem.width = (ditem.fw/*fixedwidth*/) ? sz.tw + gw : ditem.width;
			ditem.height = (ditem.fh/*fixedheight*/) ? sz.th + gh : ditem.height;

			me.dzone._IM5/*updateDisplay*/.call(me.dzone, true);
		}
	},

	_K/*refreshParameters*/: function(view) {
		var me = this,
			mresults = view ? view._IK2/*mresults*/ : null,
			params,
			dzone = me.dzone,
			docitems = me.dzone.docitems,
			p,
			r,
			i,
			k, ditem, dview;
		
		params = me._params = me._params || {};
		
		if (mresults && mresults.results)
		{
			for (i=0; i < mresults.results.length; i++)
			{
				r = mresults.results[i];
				p = r._params;
				if (p)
				{
					for (k in p)
					{
						params[k] = p[k];
					}
				}
			}
		}
		
		for (k in docitems)
		{
			ditem = docitems[k].lt.ubody;
			dview = ditem.view;
			
			ditem._param = params;
			ditem.applyFlt.call(ditem);
		}
	},

	_IMd/*createSheet*/: function(sheetindex, sitem, ubody, rst) {
		var panel = this,
			sheet, sheetobj,
			renderto = $("<div class='igc-sheet-cntbox'></div>").appendTo(ubody.b3/*boxcontent*/),
			rendermask = $("<div></div>").appendTo(ubody.b3/*boxcontent*/),
			rendertitle = ubody.b2/*boxtitle*/,
			bw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(ubody.b3/*boxcontent*/),
			bh = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(ubody.b3/*boxcontent*/);

		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(renderto, bw);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(renderto, bh);

		rendermask.css({position: "absolute", top: 0, left: 0, bottom: 0, right: 0, width: "100%", height: "100%", overflow: "hidden"}).hide();
		// rendermask.width(ubody.b3/*boxcontent*/.width()).height(ubody.b3/*boxcontent*/.height());

		sheet = new IG$/*mainapp*/._IPc/*SheetView*/({
			// collapsed: (sheetindex == 0 || (sitem && sitem.layoutinfo && sitem.layoutinfo.collapsed === false)) ? false : true,
			width: (sitem && sitem.layoutinfo) ? (sitem.layoutinfo.width || IG$/*mainapp*/.x_10/*jqueryExtension*/._w(renderto)) : null,
			height: (sitem && sitem.layoutinfo) ? (sitem.layoutinfo.height || IG$/*mainapp*/.x_10/*jqueryExtension*/._h(renderto)) : null,
			renderTo: renderto[0],
			rendermask: rendermask,
			renderBox: ubody.docid,
			_ILa/*reportoption*/: panel._ILa/*reportoption*/,
			_ILb/*sheetoption*/: sitem,
			uid: panel.uid,
			sheetindex: sheetindex,
			region: (sheetindex == 0) ? "center" : ((sitem) ? sitem.region : null) || "east",
			collapsible: false, // (sheetindex == 0) ? false : true,
			minSize: 100,
			_IK3/*reportpanel*/: panel,
			floatable: false, //(sheetindex == 0) ? false : true,
			bindheaderevent: false,
			rst: rst,

			rX/*removeObj*/: function() {
				this.removeAll();
				rendertitle.unbind("click");
			},

			// tools: this.rs_gt/*getTools*/(sheetindex),
			listeners: {
				drillreport: function(view) {
					panel._INf/*doDrillReport*/.call(panel, view);
				},
				itemclick: function(view, renderer) {
					panel._ILc/*setActiveSheet*/.call(panel, ubody);
					if (view.activeView == 0)
					{
						panel._INe/*doCellClick*/.call(panel, view, renderer);
					}
					else if (view._ILb/*sheetoption*/.isdrillreport !== true)
					{
						panel._INf/*doDrillReport*/.call(panel, view);
					}
				},
				itemdblclick: function(view, renderer) {
					var ret = panel._INf/*doDrillReport*/.call(panel, view);
					panel._ILc/*setActiveSheet*/.call(panel, ubody);
					return;
				},
				menu: function(view, el) {
					panel._INc/*procMenu*/.call(panel, view, el);
				},
				pivotchanged: function(view) {
					panel._ILb_/*contentchanged*/ = true;
				},
				cresized: function(view, sz) {
					panel.__l1/*boxresized*/.call(panel, view, sz);
				},
				result_loaded: function(view) {
					view.__el/*executioncode*/ = 0;
					panel._K/*refreshParameters*/.call(panel, view);
					panel._IGa/*updateReportCount*/.call(panel, true);
				},
				export_sheet: function(view, opt) {
					panel._IB3/*exportToFile*/.call(panel, opt.filetype.toUpperCase(), false, view);
				},
				destroy: function(view, opt) {
					view.__dx = true;
				},
				afterrender: function(tobj) {
					ubody.view = tobj;
					
					var v = $(tobj.body.dom);
					
					v.bind("click", function() {
						panel._ILc/*setActiveSheet*/.call(panel, ubody);
					});
					
					setTimeout(function() {
						ubody.b3/*boxcontent*/.trigger("i_ready");
					}, 10);
				},
				_ld_: function(view) {
					panel.dzone._IIf/*customLoad*/.call(panel.dzone, true, view);
				},
				_ldx_: function(view) {
					panel.dzone._slx/*setLoading*/.call(panel.dzone, view);
				},
				scope: this
			}
		});
		
		rendertitle.bind("click", function() {
			panel._ILc/*setActiveSheet*/.call(panel, ubody);
		});

	//	renderto.bind("resize", function() {
	//		var me = $(this),
	//			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me, undefined, 1),
	//			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me, undefined, 1);
	//
	//		if (w > 0 && h > 0)
	//		{
	//			sheet.setSize(w, h);
	//		}
	//	});

		sheet.setSize(IG$/*mainapp*/.x_10/*jqueryExtension*/._w(renderto), IG$/*mainapp*/.x_10/*jqueryExtension*/._h(renderto));
		
		return sheet;
	},

	applyOption: function(option) {
		var panel = this,
			auxfilter = option.auxfilter,
			key, i, sop,
			brun = false;

		if (auxfilter)
		{
			for (i=0; i < panel._ILa/*reportoption*/.sheets.length; i++)
			{
				sop = panel._ILa/*reportoption*/.sheets[i];
				for (key in sop._IL9/*auxfilter*/)
				{
					delete sop._IL9/*auxfilter*/[key];
				}

				for (key in auxfilter)
				{
					sop._IL9/*auxfilter*/[key] = auxfilter[key];
				}
			}

			brun = true;
		}

		if (brun)
		{
			this._t$/*toolbarHandler*/("cmd_run");
		}
	},

	_IO0/*updateFormula*/: function(view) {
		var me = this,
			sheetview = view,
			sheetindex = sheetview.sheetindex,
			tbresult = me.down("[name=tbresult]"),
			sel = sheetview._IP3/*getSelection*/.call(sheetview),
			mtext = "", i, sum = 0;

		if (sel && sel.length > 1)
		{
			for (i=0; i < sel.length; i++)
			{
				if (sel[i].position == 3)
				{
					sum = sum + parseFloat(sel[i].code);
				}
			}

			if (IG$/*mainapp*/._I37/*isNumber*/(sum))
			{
				mtext = "SUM: " + sum.format("0,000.00");
			}
		}
		tbresult && tbresult.setText(mtext);
	},

	_IO1/*onFilterUpdate*/: function(view, donot_run) {
		var me = this,
			sheets = me.sheets,
			sheet, sop, rop,
			pivotxml, i, sfilter,
			docid,
			filtername = "filter_" + me.dzone._dzid + "_" + view._ILb/*sheetoption*/.docid,
			docitems = me.dzone.docitems || {},
			ditem,
			drilltarget = view._ILb/*sheetoption*/.pff1a.drilltarget,
			edrill = view._ILb/*sheetoption*/.pff1a.edrill == "T",
			mtarget = new IG$/*mainapp*/._dpca/*drilltarget*/(drilltarget),
			f_b_clear = view._ILb/*sheetoption*/.pff1a.f_b_clear == "T",
			k,
			_fr = view._fr,
			auxfilter,
			dview,
			drobj,
			__dloaded = view.__dloaded,
			tbsch = me.down("[name=tbsch]");
			
		if (me._cld/*schedule_load*/)
		{
			IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("L_C_SCH"), function(e) {
				if (e == "yes")
				{
					tbsch && tbsch.hide();
					me._cld/*schedule_load*/ = 0;
					me._IO1/*onFilterUpdate*/.call(me, view);
				}
			});
			
			return;
		}
		
		me._params = null;
		me._K/*refreshParameters*/();

		// view.setLoading.call(view, true, true);
		sfilter = view.l7/*getFilter*/.call(view);

		for (i=0; i < sheets.length; i++)
		{
			sheet = sheets[i];
			sop = sheet._ILb/*sheetoption*/;
			docid = (sop.layoutinfo ? sop.layoutinfo.docid : null);
			ditem = docitems[docid];
			
			drobj = mtarget._2/*isDrillTarget*/("sheet_" + i);
			
			if (!edrill && (mtarget._e && (!drobj || (drobj && !drobj.isdrill))))
			{
				if (_fr && sop && sop.openload)
				{
					delete sheet.btabrun;
					if (sheet._IK9/*olapset*/)
					{
						pivotxml = sheet._IK9/*olapset*/._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(sheet._IK9/*olapset*/._ILa/*reportoption*/);
						!donot_run && sheet._IK9/*olapset*/._IJ0/*requestUpdateReport*/(pivotxml, "mode", i, sheet);
					}
					else if (sop)
					{
						!donot_run && sheet._IJ2/*procRunReport*/.call(sheet);
					}
				}
				continue;
			}
			
			if (f_b_clear)
			{
				auxfilter = sop._IL9/*auxfilter*/;
				for (fname in auxfilter)
				{
					if (fname.indexOf("report_") > -1 || fname.indexOf("filter_") > -1)
					{
						delete auxfilter[fname];
					}
				}
			}

			sop._IL9/*auxfilter*/[filtername] = sfilter;

			if (ditem && ditem.lt && ditem.lt.ubody && !ditem.lt.ubody.visible)
			{
				sheet.btabrun = true;
				continue;
			}
			
			if (_fr && sop && !sop.openload)
			{
				sheet.btabrun = true;
				continue;
			}
			
			if (!me._i0/*pivotvisible*/)
			{
				delete sheet.btabrun;
				if (sheet._IK9/*olapset*/)
				{
					pivotxml = sheet._IK9/*olapset*/._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(sheet._IK9/*olapset*/._ILa/*reportoption*/);
					!donot_run && sheet._IK9/*olapset*/._IJ0/*requestUpdateReport*/(pivotxml, "mode", i, sheet);
				}
				else if (sop)
				{
					!donot_run && sheet._IJ2/*procRunReport*/.call(sheet);
				}
			}
		}

		for (k in docitems)
		{
			ditem = docitems[k].lt.ubody;
			dview = ditem.view;
			if (ditem.objtype == "RPT_VIEW")
			{
				if (dview)
				{
					if (dview.irpt)
					{
						for (i=0; i < dview.irpt.sheets.length; i++)
						{
							sheet = dview.irpt.sheets[i];
							rop = sheet._ILa/*reportoption*/;
							sop = sheet._ILb/*sheetoption*/;
							
							drobj = rop ? mtarget._2/*isDrillTarget*/(rop.uid + "_" + "sheet_" + i) : null;
							// if (edrill || (mtarget._e && rop && !drobj.isdrill))
							if (!edrill && (mtarget._e && (!drobj || (drobj && !drobj.isdrill))))
							{
								if (_fr && sop && sop.openload)
								{
									delete sheet.btabrun;
									if (sheet._IK9/*olapset*/)
									{
										pivotxml = sheet._IK9/*olapset*/._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(sheet._IK9/*olapset*/._ILa/*reportoption*/);
										!donot_run && sheet._IK9/*olapset*/._IJ0/*requestUpdateReport*/(pivotxml, "mode", i, sheet);
									}
									else if (sop)
									{
										!donot_run && sheet._IJ2/*procRunReport*/.call(sheet);
									}
								}
								continue;
							}

							if (f_b_clear)
							{
								auxfilter = sop._IL9/*auxfilter*/;
								for (fname in auxfilter)
								{
									if (fname.indexOf("report_") > -1 || fname.indexOf("filter_") > -1)
									{
										delete auxfilter[fname];
									}
								}
							}

							sop._IL9/*auxfilter*/[filtername] = sfilter;

							if (ditem.visible && !me._i0/*pivotvisible*/)
							{
								dview._v2/*validateFilter*/ = false;
								
								if (_fr && sop && !sop.openload)
								{
									continue;
								}

								if (sheet._IK9/*olapset*/)
								{
									pivotxml = sheet._IK9/*olapset*/._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(sheet._IK9/*olapset*/._ILa/*reportoption*/);
									!donot_run && sheet._IK9/*olapset*/._IJ0/*requestUpdateReport*/(pivotxml, "mode", i, sheet);
								}
								else if (sop)
								{
									!donot_run && sheet._IJ2/*procRunReport*/.call(sheet);
								}
							}
							else
							{
								dview._v2/*validateFilter*/ = true;
							}
						}
						
						if (ditem.visible && !me._i0/*pivotvisible*/)
						{
							dview._vf/*f_run*/ = false;
						}
					}
					else
					{
						// console.write("error");
					}
				}
			}
		}

		me._IJ4/*broadCastFilter*/();
	},

	_IO2/*updatePivotContent*/: function(sheetindex) {
		var me = this,
			sheets = me.sheets,
			sheet = sheets[sheetindex],
			sop,
			pivotxml;

		sheet.setLoading.call(sheet, true, true);

		sop = sheet._ILb/*sheetoption*/;

		if (sheet._IK9/*olapset*/)
		{
			pivotxml = sheet._IK9/*olapset*/._ILa/*reportoption*/._IJ1/*getCurrentPivot*/.call(sheet._IK9/*olapset*/._ILa/*reportoption*/);
			sheet._IK9/*olapset*/._IJ0/*requestUpdateReport*/(pivotxml, "mode", sheetindex, sheet);
		}
		else if (sop)
		{
			sheet._IJ2/*procRunReport*/.call(sheet);
		}

		me._IJ4/*broadCastFilter*/();
	},

	rs_showPrompt: function() {
		this._t$/*toolbarHandler*/("cmd_run");
	},

	_IJd/*updateFilterChange*/: function() {
		var me = this;
		me._ILe_/*updatePromptToolbar*/(true);
		me._t$/*toolbarHandler*/("cmd_run");
	},

	_IJc/*updateDataChange*/: function() {
		this._t$/*toolbarHandler*/("cmd_run");
	},

	_aa/*confirmPivot*/: function(pivotvisible) {
		var me = this,
			pb = me._IM4/*pivotBrowser*/,
			pe = me.down("[name=pivoteditor]"),
			t_pivot = me._a/*toolbarcache*/["t_pivot"],
			b_edpanel = me.b_edpanel,
			sop;

		if (!b_edpanel)
		{
			b_edpanel = me.b_edpanel = me.down("[name=b_edpanel]");
		}

		t_pivot.toggle(pivotvisible);
		me.dzone.editmode = pivotvisible;
		b_edpanel.toggle(me.dzone.editmode);
		// me.dzone._IM5/*updateDisplay*/.call(me.dzone);

		me._i0/*pivotvisible*/ = pivotvisible;
		pb.setVisible.call(pb, me._i0/*pivotvisible*/);
		
		pe && pe.setVisible(me._i0/*pivotvisible*/);
		
		if (me._i0/*pivotvisible*/ && me.loadPivotOption)
		{
			me.loadPivotOption(me._IJa/*activeSheet*/, pb.cubeuid);
		}
		else if (!me._i0/*pivotvisible*/ && me.confirmPivotOption)
		{
			me.confirmPivotOption();
		}
		
		me._i0/*pivotvisible*/ && pb._IGd/*loadSheetOption*/.call(pb, me._ILa/*reportoption*/.sheets[me._IJa/*activeSheet*/], me._ILa/*reportoption*/);
		
		$.each(this.sheets, function(n, sheet) {
			sheet._II9/*updateViewMode*/.call(sheet, (me._i0/*pivotvisible*/ ? "d" : sheet._ILb/*sheetoption*/.viewmode));

			if (!me._i0/*pivotvisible*/)
			{
				sheet._IFf/*confirmDialog*/.call(sheet);
			}
		});
	},

	_ab/*updatePivot*/: function() {
		var me = this;
		
		$.each(this.sheets, function(n, sheet) {
			sheet._IFf/*confirmDialog*/.call(sheet, 1);
		});
	},

	_IB2/*clipboardCopy*/: function() {
		var panel = this,
			activeview = panel.sheets[panel._IJa/*activeSheet*/],
			mresult = (activeview && activeview._IH6/*gridcontainer*/) ? activeview._IH6/*gridcontainer*/.G1/*gridview*/.mresult : null;

		if (mresult)
		{
			var dlge = new IG$/*mainapp*/._IA7/*clipboard*/({
				sheetview: activeview,
				mresult: mresult
			});
			dlge.show(panel);
		}
	},

	_IB5/*showReportOption*/: function(pcubeuid, pivotwnd) {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
			
		// panel.removeListener('show', panel._IB5/*showReportOption*/, panel);
		
		if (pcubeuid)
		{
			req.init(panel,
				{
					ack: "11",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: pcubeuid}),
					mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'translate'})
				}, panel, function(xdoc) {
					var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
						citem,
						reporttype;
						
					if (tnode)
					{
						citem = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
						reporttype = IG$/*mainapp*/.xAM/*getReportType*/(citem.type);
						
						panel._IG7/*continueReportOption*/({
							cubeobj: citem,
							reporttype: reporttype
						});
					}
				}, false);
			req._l/*request*/();
		}
		else
		{
			if (IG$/*mainapp*/._IB6/*reportOption*/)
			{
				var dlg = new IG$/*mainapp*/._IB6/*reportOption*/({
					modal: true,
					_ILa/*reportoption*/: panel._ILa/*reportoption*/,
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, function(dlg) {
						panel._IG7/*continueReportOption*/(dlg, pivotwnd);
					})
				});
				dlg.show();
			}
		}
	},

	_IJ9/*updateChartOption*/: function() {
		var me = this,
			panel = me.sheets[me._IJa/*activeSheet*/],
			i,
			_IK2/*mresults*/ = panel._IK2/*mresults*/;
			
		if (_IK2/*mresults*/ && _IK2/*mresults*/.results)
		{
			for (i=0; i < _IK2/*mresults*/.results.length; i++)
			{
				_IK2/*mresults*/.results[i].__bands = null;
			}
		}

		panel._IJf/*invalidateChart*/ = true;
		panel._IP8/*updateChartUI*/.call(panel, panel);
	},

	_ai/*afterinit*/: function(panelbody) {
		var me = this,
			gw, gh,
			_par = me._par;
		
		me.dzone = new IG$/*mainapp*/.dz/*dropZone*/(panelbody, me),
		me.dzone.cmode = me.cmode || 0;
		if (_par)
		{
			_par._dzseq = _par._dzseq || 0; 
		}
		
		me._dzid = _par ? _par._dzid + "_" + (_par._dzseq++) : "root";
		me.dzone._dzid = me._dzid;
		
		me.dzone._IM6/*closeDockNotify*/ = {f: me._IM6/*closeDockNotify*/, s: me};
		// me.dzone._IM7/*configDockNotify*/ = {f: me._IM7/*configDockNotify*/, s: me};
		
		me.dzone.b1/*box*/.bind({
			config_doc: function(ev, docid) {
				me._IM7/*configDockNotify*/.call(me, docid);
			},
			config_pivot: function(ev, docid) {
				me._IM7a/*configPivotNotify*/.call(me, docid);
			} 
		});

		if (IG$/*mainapp*/.__ep)
		{
			me.dzone.b1/*box*/.bind("boxresized", function() {
				var ow = me.getWidth(),
					oh = me.getHeight(),
					cw = borderpanel.getWidth(),
					ch = borderpanel.getHeight(),
					doff = me.dzone.b1/*box*/.offset(),
					mw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.dzone.b1/*box*/),
					mh = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.dzone.b1/*box*/),
					gw, gh;

				if (cw < mw || ch < mh)
				{
					gw = ow - cw;
					gh = oh - ch;

					me.setSize(Math.max(mw+gw, ow), Math.max(mh+gh, oh));
				}
			});
		}

		me._IFd/*init_f*/(me.vmode == 1 ? true : null);
	},

	_IFd/*init_f*/: function(norun) {
		var panel = this,
			req,
			uid = panel.uid;

		panel._IN1/*initToolBar*/();

		if (uid && uid.length > 0)
		{
			panel.issheet = (panel.itemtype == "Sheet") ? true : false;
			panel._IJa/*activeSheet*/ = 0;

			if (panel.isnewitem)
			{
			}
			else if (panel.pivot)
			{
				setTimeout(function() {
					var doc = IG$/*mainapp*/._I13/*loadXML*/(panel.pivot);
					panel.pivot = null;
					panel._IM9/*rs_loadContent*/(doc);
				}, 10);
			}
			else
			{
				if (panel.writable)
				{
					IG$/*mainapp*/._I56/*checkLock*/(panel, function(cmd) {
						if (cmd != "unlock")
						{
							panel.writable = false;
							panel.down("[name=t_save]").hide();
						}
					});
				}

				req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(panel,
					{
						ack: "5",
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid, revision: panel.revision}),
						mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: panel.hiddentoolbar ? "" : "diagnostics"})
					}, panel, panel._IM9/*rs_loadContent*/, false, norun);
				req._l/*request*/();
			}
		}
		else if (panel.__jid && panel.__sid)
		{
			panel._ILd/*doScheduleJob*/.call(panel, panel.__sid, panel.__jid);
		}
		else
		{
			panel.setLoading(false);

			panel._d1/*doDashboardExit*/.call(panel);

			if (panel.vmode != 1)
			{
				setTimeout(function() {
					panel._IB5/*showReportOption*/.call(panel, panel.cubeuid);
				}, 400);
			}
		}
	},

	_d1/*doDashboardExit*/: function(iserror) {
		var callback = this.execallback;
		callback && callback.execute(iserror);
	},

	_IM9/*rs_loadContent*/: function(xdoc, norun) {
		var panel = this,
			auxfilter = panel.auxfilter,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
			i, key, sop, p, rnode, rnodes, gnode,
			results = {};

		p = (tnode ) ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode) : null;

		if (p && p.type == "Export")
		{
			rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/export/report_content/reportxml");
			panel._ILa/*reportoption*/ = new IG$/*mainapp*/._IEe/*clReports*/(rnode);

			rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/export/sheets");
			if (rnode)
			{
				rnodes = IG$/*mainapp*/._I26/*getChildNodes*/(rnode);
				for (i=0; i < rnodes.length; i++)
				{
					gnode = IG$/*mainapp*/._I18/*XGetNode*/(rnodes[i], "gridresult");

					if (gnode)
					{
						results[IG$/*mainapp*/._I1b/*XGetAttr*/(rnodes[i], "docid")] = new IG$/*mainapp*/._IF2/*clResults*/(null, gnode);
					}
				}
			}

			panel._IMb/*applyReportContent*/(results);
			panel.fireEvent("_lc0", panel);
		}
		else
		{
			panel._ILa/*reportoption*/ = new IG$/*mainapp*/._IEe/*clReports*/(xdoc);

			panel._IMb/*applyReportContent*/(null, norun);

			if (auxfilter)
			{
				for (i=0; i < panel._ILa/*reportoption*/.sheets.length; i++)
				{
					sop = panel._ILa/*reportoption*/.sheets[i];
					for (key in auxfilter)
					{
						sop._IL9/*auxfilter*/[key] = auxfilter[key];
					}
				}
			}

			panel.fireEvent("_lc0", panel);
		}
	},

	cL/*clearResult*/: function() {
	},

	_IMf/*updateCubeInfo*/: function(cinfo) {
		var me = this,
			tbcubepath = me.down("[name=tbcubepath]"),
			activeview = me.sheets[me._IJa/*activeSheet*/],
			rop = me._ILa/*reportoption*/;

		tbcubepath.show();
		tbcubepath.setText(cinfo.name);

		if (activeview && activeview._ILb/*sheetoption*/.cubeuid == cinfo.uid)
		{
			activeview._ILb/*sheetoption*/.cubeitem = cinfo;
		}

		if (rop.cubeuid == cinfo.uid)
		{
			rop.cubeitem = cinfo;
		}

		tbcubepath.setTooltip("Goto: " + cinfo.nodepath);
	},

	_ILc/*setActiveSheet*/: function(sheetpanel, eforce) {
		var me = this,
			si = sheetpanel.view.sheetindex,
			pb = me._IM4/*pivotBrowser*/,
			tbreportname = me.down("[name=tbreportname]"),
			dzone = me.dzone,
			activesheet,
			ubody,
			viewmode,
			__t1,
			__t2;

		if (eforce || si != me._IJa/*activeSheet*/)
		{
			// me._ILe/*updateFormulaToolbar*/();
			__t1 = me._IJa/*activeSheet*/ = (me.itemtype == "Sheet") ? 0 : si;
			activesheet = me.sheets[__t1];
			viewmode = (activesheet && activesheet._ILb/*sheetoption*/ ? activesheet._ILb/*sheetoption*/.viewmode : null);

			if (me._2/*toolbar*/)
			{
				var t_grid = me.down("[name=t_grid]"),
					t_chart = me.down("[name=t_chart]"),
					t_r = me.down("[name=t_r]"),
                    t_python = me.down("[name=t_python]"),
					mt = 0;
				
				switch (viewmode)
				{
				case "chart":
					mt = 1;
					break;
				case "r":
					mt = 2;
					break;
				case "python":
					mt = 3;
					break;
				}
				
				t_grid.toggle(mt == 0, mt == 0);
				t_chart.toggle(mt == 1, mt == 1);
				t_r.toggle(mt == 2, mt == 2);
                t_python.toggle(mt == 3, mt == 3);
				
				mt == 1 && me._IK6/*showChartToolbar*/();
				mt != 1 && me._IK4/*hideChartToolbar*/();
				me._IK7/*setRToolbar*/(mt == 2);
				me._IL3/*updateChartToolbarItems*/(mt != 1);
				me._IL4/*updateRToolbarItems*/(mt != 2);
                me._IK7p/*setPythonToolbar*/(mt == 3);
				
				// switch (viewmode)
				// {
				// case "chart":
					// t_grid.toggle(false, false);
					// t_chart.toggle(true, true);
					// t_r.toggle(false, false);
					// me._IK6/*showChartToolbar*/();
					// me._IK7/*setRToolbar*/(false);
					// me._IL3/*updateChartToolbarItems*/(false);
					// me._IL4/*updateRToolbarItems*/(true);
					// break;
				// case "r":
					// t_grid.toggle(false, false);
					// t_chart.toggle(false, false);
					// t_r.toggle(true, true);
					// if (IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.l3 == "L1")
					// {
						// do nothing
					// }
					// else
					// {
						// me._IK7/*setRToolbar*/(true);
						// me._IK4/*hideChartToolbar*/();
						// me._IL3/*updateChartToolbarItems*/(true);
						// me._IL4/*updateRToolbarItems*/(false);
					// }
					// break;
				// default:
					// t_grid.toggle(true, true);
					// t_chart.toggle(false, false);
					// t_r.toggle(false, false);
					// me._IK4/*hideChartToolbar*/();
					// me._IK7/*setRToolbar*/(false);
					// me._IL3/*updateChartToolbarItems*/(true);
					// me._IL4/*updateRToolbarItems*/(true);
					// break;
				// }
			}

			ubody = dzone._IIb/*getBox*/.call(dzone, activesheet._ILb/*sheetoption*/.layoutinfo.docid);
			ubody.setTitle.call(ubody, activesheet._ILb/*sheetoption*/.name || "");
			dzone._IIc/*setActive*/.call(dzone, ubody);
			me._ILe_/*updatePromptToolbar*/(false);

			// tbreportname.setText((me._ILa/*reportoption*/.name || "") + " [Active : " + si + "." + (activesheet._ILb/*sheetoption*/.name || "") + "]");

			if (tbreportname)
			{
				tbreportname.setText(me._ILa/*reportoption*/.name || "");
				me._IGb/*updateCubePath*/();
				me._IN4/*updateToolBar*/();
			}
			me._IGa/*updateReportCount*/(false);
			
			if (me._i0/*pivotvisible*/)
			{
				if (pb)
				{
					pb._IGd/*loadSheetOption*/.call(pb, me._ILa/*reportoption*/.sheets[__t1], me._ILa/*reportoption*/);
				}
				
				__t2 = me.loadPivotOption;
				__t2 && __t2.call(me, __t1, pb ? pb.cubeuid : null);
			}
		}
	},

	_IMb/*applyReportContent*/: function(results, norun) {
		var i,
			sheet,
			sheetview,
			panel = this,
			me = panel,
			tbreportname = panel.down("[name=tbreportname]"),
			dzone = panel.dzone,
			layoutinfo,
			view, runreport = (norun ? false : true),
			issheet = panel.issheet,
			_ILa/*reportoption*/ = panel._ILa/*reportoption*/,
			sheets = _ILa/*reportoption*/.sheets,
			sheetview,
			docid,
			rst,
			dbox,
			sh,
			zitems,
			zitem,
			slayoutinfo,
			T0, T1;

		panel._IJb/*updateExportOption*/();

		dzone._IN9/*clearAll*/.call(dzone);

		panel.sheets = [];

		layoutinfo = _ILa/*reportoption*/.layoutinfo;
		panel.ctrls = _ILa/*reportoption*/.ctrls;

		panel._IN3/*updateToolBar*/();

		tbreportname && tbreportname.setText(_ILa/*reportoption*/.name || "");

		if (!issheet)
		{
			if (layoutinfo.type == "bubble")
			{
				layoutinfo = dzone.tLayout(layoutinfo);
			}
			else if (layoutinfo.type == "mondrian")
			{
				
			}
			dzone.m1/*makeLayout*/.call(dzone, panel, layoutinfo, panel.ctrls);
		}

		if (_ILa/*reportoption*/.requirepwd && !IG$/*mainapp*/.dbp[_ILa/*reportoption*/.poolname])
		{
			runreport = false;
			var pwdpop = new IG$/*mainapp*/._Ice/*userDbPassword*/({
				poolname: _ILa/*reportoption*/.poolname,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, panel.r_IMa/*pwdset*/, _ILa/*reportoption*/.poolname)
			});

			IG$/*mainapp*/._I_5/*checkLogin*/(this, pwdpop);
		}

		if (sheets.length > 0)
		{
			sheet = sheets[0];
			slayoutinfo = sheet.layoutinfo;
			if (issheet && panel.sheetindex != 0)
			{
				// don't make sheet
			}
			else
			{
				docid = slayoutinfo.docid;
				if (!docid)
				{
					zitems = dzone.items;
					for (i=0; i < zitems.length; i++)
					{
						zitem = zitems[i];
						if (zitem.objtype == "SHEET" && !zitem.view)
						{
							docid = slayoutinfo.docid = zitem.docid;
							break;
						}
					}
				}

				ubody = dzone._IIb/*getBox*/.call(dzone, docid);

				if (ubody == null && !docid)
				{
					ubody = me.aB/*appendBox*/();
					
					docid = slayoutinfo.docid = ubody.docid;
				}

				if (ubody)
				{
					ubody.setTitle.call(ubody, sheet.name || "");

					dzone._IIc/*setActive*/.call(dzone, ubody);

					rst = results ? results[docid] : null;

					sheetview = panel._IMd/*createSheet*/(0, sheet, ubody, rst);
					ubody.view = sheetview;
					ubody.objtype = "SHEET";
					ubody.m1/*validateProperty*/.call(ubody);

					ubody.setReportOption.call(ubody, sheet);

					panel.sheets.push(sheetview);
					sh = panel.sheets[0];
					sh.sheetindex = 0;
					sh._ILb/*sheetoption*/ = sheet;
					sh._ILa/*reportoption*/ = _ILa/*reportoption*/;
					sh._IN0/*applyOptions*/.call(sh);
				}
			}
		}
		
		T0 = dzone.items;
		
		if (runreport && T0)
		{
			$.each(T0, function(i, ubody) {
				if (ubody.objtype == "FILTER")
				{
					runreport = false;
				}
			});
		}
		
		if (_ILa/*reportoption*/.b_sc_load == "T")
		{
			runreport = false;
			dzone.cmode = 1;
			panel._cld/*schedule_load*/ = 1;
		}
		
		if (sheets.length > 1)
		{
			for (i=sheets.length-1; i >= 0; i--)
			{
				sop = sheets[i];
				slayoutinfo = sop.layoutinfo;
				docid = slayoutinfo.docid;
				ubody = dzone._IIb/*getBox*/.call(dzone, docid);

				if (!ubody)
				{
					if (issheet)
					{
						if (panel.sheetindex == i)
						{
							ubody = me.aB/*appendBox*/(sop.objtype);
							slayoutinfo.docid = ubody.docid;
						}
					}
					else
					{
						sheets.splice(i, 1);
						panel.sheets.splice(i, i);
					}
				}
			}

			for (i=1; i < sheets.length; i++)
			{
				sheet = sheets[i];
				slayoutinfo = sheet.layoutinfo;
				
				if (issheet && panel.sheetindex != i)
				{
					continue;
				}

				docid = slayoutinfo.docid;
				ubody = dzone._IIb/*getBox*/.call(dzone, docid);

				if (ubody)
				{
					rst = results ? results[docid] : null;

					sheetview = panel._IMd/*createSheet*/(i, sheet, ubody, rst);
					ubody.view = sheetview;
					ubody.objtype = "SHEET";

					ubody.setReportOption.call(ubody, sheet);
					ubody.m1/*validateProperty*/.call(ubody);

					panel.sheets.push(sheetview);

					if (sheet.openload)
					{
						sheetview.sheetindex = i;
						sheetview._ILb/*sheetoption*/ = sheet;
						sheetview._ILa/*reportoption*/ = _ILa/*reportoption*/;
						sheetview._IN0/*applyOptions*/.call(sheetview);

						runreport = true;
					}

					ubody.setTitle.call(ubody, sheet.name || "");
				}
			}
		}

		// if (!IG$/*mainapp*/.__ep)
		// {
			if (!IG$/*mainapp*/.__ep && _ILa/*reportoption*/.__cs.l.length == 0)
			{
				if (panel.vmode != 1)
				{
					setTimeout(function() {
						panel._IB5/*showReportOption*/.call(panel);
					}, 200);
				}
			}
			// else if (runreport)
			// {
				// panel._t$/*toolbarHandler*/("cmd_run");
			// }
		// }

		if (!IG$/*mainapp*/.__ep)
		{
			dbox = sheets.length > 0 ? dzone._IIb/*getBox*/.call(dzone, sheets[0].layoutinfo.docid) : null;
			dbox && panel._ILc/*setActiveSheet*/(dbox, true);

			if (panel._2/*toolbar*/)
			{
				panel._IGb/*updateCubePath*/();
			}

			panel._IJ4/*broadCastFilter*/();

			panel._ILe_/*updatePromptToolbar*/(true);
		}

		panel._ILf_/*updateLayout*/(true);

		if (!runreport)
		{
			panel._d1/*doDashboardExit*/();
		}
		
		panel.__ld/*loaded*/ = true;
		
		panel.__d_c/*dashboard_callback*/ && panel.__d_c/*dashboard_callback*/.execute();
		
		if (typeof window.callPhantom === "function") {
			window.callPhantom({
				_proc: "S"
			});
		}
		
		if (_ILa/*reportoption*/.b_sc_load == "T")
		{
			setTimeout(function() {
				var req = new IG$/*mainapp*/._I3e/*requestServer*/();
				
				req.init(panel,
					{
						ack: "22",
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid, action: "latestjob"}, "uid;action"),
						mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
					}, panel, function(xdoc) {
						var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/job"),
							panel = this,
							p;
						if (tnode)
						{
							p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
							
							p.sid && p.jid && panel._ILd/*doScheduleJob*/.call(panel, p.sid, p.jid);
						}
						else
						{
							panel._cld/*schedule_load*/ = 0;
							me._load_run();
						}
					}, null);
				req._l/*request*/();
			}, 10);
		}
	},
	
	_load_run: function() {
		var me = this,
			dzone = me.dzone,
			ctrls = dzone.ctrls,
			hasfilter = [];
		
		$.each(dzone.items, function(i, ubody) {
			switch (ubody.objtype)
			{
			case "FILTER":
				hasfilter.push(ubody);
				break;
			default:
				break;
			}
		});
		
		if (hasfilter.length)
		{
			if (hasfilter.length == 1)
			{
				f = hasfilter[0];
				f.view && f.view.l5/*updateFilterValues*/.call(f.view, true, true);
			}
			else
			{
				$.each(hasfilter, function(m, mf) {
					var v = mf.view,
						filteroptions,
						showbutton,
						f_b_trg,
						f_b_trg_all;
						
					if (v)
					{
						filteroptions = v._ILb/*sheetoption*/.pff1a/*filteroptions*/;
						showbutton = filteroptions ? filteroptions.showbutton : false;
						f_b_trg = (showbutton && filteroptions.f_b_trg == "T") ? 1 : 0;
						f_b_trg_all = f_b_trg && filteroptions.f_b_trg_all == "T" ? 1 : 0;
						
						if (f_b_trg)
						{
							f = mf;
						}
					}
				});
				
				if (!f)
				{
					f = hasfilter[hasfilter.length-1];
				}
				
				f.view && f.view.l5/*updateFilterValues*/.call(f.view, true, true);
			}
		}
		else
		{
			me.cobj._t$/*toolbarHandler*/.call(me.cobj, "cmd_run", null, null, null, 1);
		}
	},

	r_IMa/*pwdset*/: function(npwd, poolname) {
		var me = this,
			sheets = me.sheets;

		IG$/*mainapp*/.dbp[poolname] = npwd;

		if (sheets && sheets.length > 0)
		{
			sheets[0]._IJ2/*procRunReport*/.call(sheets[0]);
		}
	},

	regbody: function(docid, fobj) {
		var me = this;

		me.__dreg = me.__dreg || {};
		me.__dreg[docid] = {
			b_init: false,
			docid: docid,
			fobj: fobj
		};
	},

	cCC/*clearCache*/: function() {
		var panel = this,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			uid = panel.uid;
		
		if (uid)
		{
			req.init(panel,
				{
					ack: "11",
					payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}, "uid"),
					mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "clear_cache"})
				}, panel, function(xdoc) {
					var me = this,
						tbcache = me.down("[name=tbcache]");
					if (tbcache)
					{
						tbcache.hide();
					}
				});
			req._l/*request*/();
		}
	}
});




IG$/*mainapp*/._ILd/*doScheduleJob*/ = function(sid, jid) {
	var me = this,
		req = new IG$/*mainapp*/._I3e/*requestServer*/(),
		p;

	if (jid)
	{
		me.setLoading(true);
		
		p = {sid: sid, jid: jid, action: "jobresult"};
		
		me._cld_p/*schedule_load_param*/ = p;

		req.init(me,
			{
				ack: "22",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/(p, "sid;jid;action"),
				mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
			}, me, me.r_ILd/*doScheduleJob*/, null, p);
		req._l/*request*/();
	}
}

IG$/*mainapp*/.r_ILd/*doScheduleJob*/ = function(xdoc, param) {
	var me = this,
		tbsch = me.down("[name=tbsch]"),
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
		jobs = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
		i, 
		_IK2/*mresults*/,
		rnode,
		results = [],
		jobseq,
		jobkey,
		jobindex,
		crdate,
		srdate,
		crdate_fmt,
		srdate_fmt,
		result,
		t, t1,
		sheets = me.sheets;

	me.setLoading(false);

	if (jobs)
	{
		for (i=0; i < jobs.length; i++)
		{
			t1 = jobs[i];
			jobseq = parseInt(IG$/*mainapp*/._I1b/*XGetAttr*/(t1, "jobseq"));
			jobkey = IG$/*mainapp*/._I1b/*XGetAttr*/(t1, "key");
			crdate = IG$/*mainapp*/._I1b/*XGetAttr*/(t1, "crdate");
			srdate = IG$/*mainapp*/._I1b/*XGetAttr*/(t1, "srdate");
			jobindex = (jobkey ? parseInt(jobkey) : jobseq);
			
			rnode = IG$/*mainapp*/._I19/*getSubNode*/(t1, "info");
			if (rnode)
			{
				crdate_fmt = IG$/*mainapp*/._I1a/*getSubNodeText*/(rnode, "crdate");
				srdate_fmt = IG$/*mainapp*/._I1a/*getSubNodeText*/(rnode, "srdate");
			}
			
			rnode = IG$/*mainapp*/._I19/*getSubNode*/(t1, "resultxml");

			if (rnode)
			{
				t = IG$/*mainapp*/._I25/*toXMLString*/(rnode);
				t = t ? IG$/*mainapp*/._I13/*loadXML*/(t) : null;
				
				result = {
					jobseq: jobindex,
					crdate: crdate,
					srdate: srdate,
					crdate_fmt: crdate_fmt,
					srdate_fmt: srdate_fmt,
					content: t
				};

				results.push(result);
			}
		}

		if (results.length)
		{
			for (i=0; i < results.length; i++)
			{
				jobres = results[i];
				jobseq = jobres.jobseq;
				crdate = jobres.crdate;
				crdate_fmt = jobres.crdate_fmt;
				srdate = jobres.srdate;
				srdate_fmt = jobres.srdate_fmt;
				
				if (jobres.content)
				{
					_IK2/*mresults*/ = new IG$/*mainapp*/._IF2/*clResults*/(jobres.content);
					_IK2/*mresults*/.srdate = srdate;
					_IK2/*mresults*/.crdate = crdate;
					_IK2/*mresults*/.srdate_fmt = srdate_fmt;
					_IK2/*mresults*/.crdate_fmt = crdate_fmt;
					
					if (param)
					{
						_IK2/*mresults*/._job = {
							sid: param.sid,
							jid: param.jid,
							jobid: _IK2/*mresults*/._IL8/*jobid*/
						};
					}
					
					if (sheets[jobseq])
					{
						sheets[jobseq]._IJe/*procLoadResult*/.call(sheets[jobseq], _IK2/*mresults*/);
					}
				}
			}
			
			if (tbsch)
			{
				tbsch.show();
				tbsch.setText(srdate_fmt || "-");
			}
		}
	}
}
IG$/*mainapp*/._IBe/*ReportView*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	uid: null,

	"layout": "fit",
	closable: true,

	sheets: [],
	ctrls: {},

	_IJa/*activeSheet*/: 0,

	_IM0/*chartToolBarItems*/: [],
	_IM1/*rToolBarItems*/: [],

	_ILb_/*contentchanged*/: false,
	isnewitem: false,
	ignoreclose: false,
	_IM2/*cubePathInfo*/: {},
	hiddentoolbar: true,
	
	_ic/*initComponent*/: function() {
		var me = this,
			items;

		items = [
			{
				xtype: "panel",
				border: 0,
				layout: "fit",
				items: [
					{
						xtype: "panel",
						name: "mainpanel",
						"layout": "fit",
						items: [
							{
								xtype: "panel",
								name: "_3", //"borderpanel",
								"layout": "fit"
							}
						],
						listeners: {
							resize: function(panel, adjWidth, adjHeight, eopts) {
								var me = this,
									dzone = me.dzone;

								if (dzone)
								{
									IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dzone.b0/*basecontainer*/, adjWidth);
									IG$/*mainapp*/.x_10/*jqueryExtension*/._h(dzone.b0/*basecontainer*/, adjHeight);
									dzone._IM5/*updateDisplay*/.call(dzone, true);
								}
							},
							scope: me
						}
					}
				]
			}
		];

		IG$/*mainapp*/.apply(me, {
			items: items
		});

		IG$/*mainapp*/._IBe/*ReportView*/.superclass._ic/*initComponent*/.call(this);
	},

	listeners: {
		afterrender: function() {
			var me = this,
				borderpanel = me.down("[name=_3]"),
				panelbody = $(borderpanel.body.dom);
			
			me.__loaded = 1;
			me._IM4/*pivotBrowser*/ = me.down("[name=p1]");
			me._3/*borderpanel*/ = borderpanel;
			panelbody.empty();
			
			me._ai/*afterinit*/(panelbody);
		},
		resize: function(panel, adjWidth, adjHeight, eOpts) {
			var me = this,
				dzone = me.dzone;

			if (adjWidth > 0 && adjHeight > 0)
			{
				dzone._IM5/*updateDisplay*/.call(dzone, true);
			}
		},

		close: function(panel, opts) {
			var me = this,
				sheets = me.sheets,
				dzone = me.dzone,
				i;

			if (sheets && sheets.length)
			{
				for (i=0; i < sheets.length; i++)
				{
					sheets[i].close();
				}

				me.sheets = null;
			}

			if (dzone && dzone.items && dzone.items.length)
			{
				for (i=0; i < dzone.items.length; i++)
				{
					if (dzone.items[i].objtype != "SHEET" && dzone.items[i].view)
					{
						dzone.items[i].view.__dx = true;
					}
				}
			}
		},

		beforeclose: function(panel, opts) {
			var me = this,
				r = true,
				rcs = [],
				i,
				sheets = me.sheets;

			for (i=0; i < sheets.length; i++)
			{
				if (sheets[i].jobid)
				{
					rcs.push(sheets[i].jobid);
				}
			}

			if (panel.ignoreclose)
			{
				r = true;
			}
			else if (panel._ILb_/*contentchanged*/ && (me.writable || !me.uid))
			{
				IG$/*mainapp*/._I55/*confirmMessages*/(null, null, panel._IM8/*doClose*/, panel, panel);
				r = false;
			}
			else if (me.writable && me.uid)
			{
				var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
				lreq.init(panel,
					{
						ack: "11",
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
						mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'lock', detail: "close", rcs: rcs.join(";")})
					}, panel, function(xdoc) {

					}, false);

				lreq._l/*request*/();
			}
			else if (rcs.length > 0)
			{
				var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
				lreq.init(panel,
					{
						ack: "18",
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
						mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'clearjob', rcs: rcs.join(";")})
					}, panel, function(xdoc) {

					}, false);

				lreq._l/*request*/();
			}

			return r;
		}
	},
	
	

	_IM8/*doClose*/: function(btn) {
		var panel = this;

		if (btn == "no")
		{
			if (panel.uid)
			{
				var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
				lreq.init(panel,
					{
						ack: "11",
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
						mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'lock', detail: "close"})
					}, panel, function(xdoc) {
						panel.ignoreclose = true;
						panel.close();
					}, false);

				lreq._l/*request*/();
			}
			else
			{
				panel.ignoreclose = true;
				panel.close();
			}
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
					panel._t$/*toolbarHandler*/('cmd_save', true);
				}, false);

			lreq._l/*request*/();
		}
	},

	_IM6/*closeDockNotify*/: function(docid) {
		var me = this,
			dzone = me.dzone,
			rop = me._ILa/*reportoption*/,
			item = dzone._IIb/*getBox*/.call(dzone, docid),

			view = (item ? item.view : null),
			i, j, sheets = me.sheets,
			sheet, r = false;

		me._ILb_/*contentchanged*/ = true;

		if (view)
		{
			switch (item.objtype)
			{
			case "SHEET":
				for (i=0; i < sheets.length; i++)
				{
					sheet = sheets[i];
					if (sheet == view)
					{
						sheets.splice(i, 1);
						if (sheet._ILb/*sheetoption*/ && sheet._ILb/*sheetoption*/.objtype == "SHEET" && rop.sheets.length > i)
						{
							rop.sheets.splice(i, 1);
						}
						r = true;
						break;
					}
				}
				break;
			default:
				if (me.ctrls[docid])
				{
					view.__dx = true;
					delete me.ctrls[docid];
				}
				r = true;
				break;
			}
		}

		return r;
	},

	_IM7/*configDockNotify*/: function(docid) {
		var me = this,
			dzone = me.dzone,
			item = (docid ? dzone._IIb/*getBox*/.call(dzone, docid) : null),
			view = (item ? item.view : null),
			i, sheets = me.sheets,
			sheet, r = false, sheetindex;

		if (view)
		{
			sheetindex = view.sheetindex;
			me._IG9/*showSheetOption*/.call(me, sheetindex, view);
		}
	},
	
	_IM7a/*configPivotNotify*/: function(docid) {
		
	},

/*
 * Initialize routine
 */
	r_IMa/*pwdset*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.r_IMa/*pwdset*/,
	regbody: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.regbody,
	
	_IMb/*applyReportContent*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IMb/*applyReportContent*/,

/*
 * Schedule Processing
 */

 	_ILd/*doScheduleJob*/: IG$/*mainapp*/._ILd/*doScheduleJob*/,
	r_ILd/*doScheduleJob*/: IG$/*mainapp*/.r_ILd/*doScheduleJob*/,

/*
 * Drill Down
 */
	_IL6/*executeDrillReport*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IL6/*executeDrillReport*/,

/*
 * Share Reports
 */
	_s1/*showShare*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._s1/*showShare*/,
	_K/*refreshParameters*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._K/*refreshParameters*/,
	
/*
 * Supporting Options for UI
 */
 	_ILc/*setActiveSheet*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._ILc/*setActiveSheet*/,

	_IGa/*updateReportCount*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IGa/*updateReportCount*/,
	
	aB/*appendBox*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.aB/*appendBox*/,

 	_IG9/*showSheetOption*/: function(sheetindex, sheetview) {
		sheetview.sheetindex = sheetindex;

		var me = this,
			pop = new IG$/*mainapp*/._If1/*sheetobj*/({
				dzone: me.dzone,
				sheets: me.sheets,
				_ILb/*sheetoption*/: sheetview._ILb/*sheetoption*/,
				sheetindex: sheetindex,
				_ILa/*reportoption*/: me._ILa/*reportoption*/,
				callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, me.r_IG9/*showSheetOption*/, sheetview)
			});

		IG$/*mainapp*/._I_5/*checkLogin*/(this, pop);
	},

	r_IG9/*showSheetOption*/: function(dlg, sheetview) {
		var me = this,
			sheets = me._ILa/*reportoption*/.sheets,
			rop = me._ILa/*reportoption*/,
			sop = sheetview._ILb/*sheetoption*/,
			dzone = me.dzone,
			docid, sheet, msheetview,
			sheetindex = sheetview.sheetindex,
			ubody, i, nsop,
			rsheets;

		docid = (sop.objtype == "SHEET") ? sop.layoutinfo.docid : sop.docid;
		ubody = dzone._IIb/*getBox*/.call(dzone, docid);

		if (ubody)
		{
			me._ILb_/*contentchanged*/ = true;
			
			rsheets = rop.sheets;

			if (sop.changetype)
			{
				me._IJa/*activeSheet*/ = 0;
				if (sop.changetype == "SHEET")
				{
					for (i=0; i < rsheets.length; i++)
					{
						if (rsheets[i] == sop)
						{
							rsheets.splice(i, 1);
							break;
						}
					}

					for (i=0; i < me.sheets.length; i++)
					{
						if (me.sheets[i] == sheetview)
						{
							me.sheets.splice(i, 1);
							break;
						}
					}

					for (i=0; i < me.sheets.length; i++)
					{
						me.sheets[i].sheetindex = i;
					}
				}

				if (ubody.view)
				{
					ubody.view.rX/*removeObj*/.call(ubody.view);
					ubody.b3/*boxcontent*/.empty();
				}

				if (sop.objtype == "SHEET")
				{
					sheet = new IG$/*mainapp*/._IEf/*clReport*/(null, me.itemtype, false);
					sheet.layoutinfo.docid = docid;
					rsheets.push(sheet);
					msheetview = me._IMd/*createSheet*/(sheetindex, sheet, ubody);
					ubody.view = msheetview;
					me.sheets.push(msheetview);
					msheetview.sheetindex = me.sheets.length - 1;
				}
				else
				{
					if (sop.changetype == "SHEET")
					{
						nsop = new IG$/*mainapp*/._IFc/*sheetfiltercomp*/(null);
						nsop.objtype = sop.objtype;
						nsop.close = sop.close;
						nsop.name = sop.name;
					}
					me._INb/*createControl*/(sop, ubody);
					sheet = ubody.view;

					if (sop.changetype == "SHEET")
					{
						me.ctrls[ubody.docid] = nsop;
					}

					var w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(sheet.container),
						h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(sheet.container);
					sheet.setSize(w, h);
				}

				me._ILf_/*updateLayout*/(false);
			}

			if (sop.objtype == "FILTER" || sop.objtype == "TEXT" || sop.objtype == "NAVI" || sop.objtype == "RPT_VIEW")
			{
				ubody.view.l3/*validateItems*/.call(ubody.view);
			}
			ubody.setTitle.call(ubody, sop.name);
			ubody.showTitle.call(ubody, !sop.hidetitle);
			ubody.fw = sop.fw;
			ubody.fh = sop.fh;

			ubody.setReportOption.call(ubody, sop);

			ubody.m1/*validateProperty*/.call(ubody);
		}

		dzone._IM5/*updateDisplay*/.call(dzone, true);
	},
	
	_IGb/*updateCubePath*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IGb/*updateCubePath*/,
	r_IMe/*updateCubePath*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.r_IMe/*updateCubePath*/,

	_IMf/*updateCubeInfo*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IMf/*updateCubeInfo*/,

	_ILf_/*updateLayout*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._ILf_/*updateLayout*/,

	_IJb/*updateExportOption*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IJb/*updateExportOption*/,

	_IN1/*initToolBar*/: function() {
	},

	_IN2/*formulaHandler*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IN2/*formulaHandler*/,

	_b/*cachetoolbar*/: function() {
	},

	_IN3/*updateToolBar*/: function() {
	},

	_IN4/*updateToolBar*/: function() {
	},

	_ILe/*updateFormulaToolbar*/: function(item) {
	},

	_ILe_/*updatePromptToolbar*/: function(reloadprompt) {
	},

	_IK6/*showChartToolbar*/: function() {
	},

	_IK4/*hideChartToolbar*/: function() {
	},

	_IK7/*setRToolbar*/: function(visible) {
	},

	_IN5/*changeChartType*/: function(menu) {
		var me = this,
			charttype = menu.charttype,
			subtype = menu.subtype,
			sheet = me.sheets[me._IJa/*activeSheet*/],
			_ILb/*sheetoption*/ = sheet ? sheet._ILb/*sheetoption*/ : null,
			cco/*chartOption*/;

		if (_ILb/*sheetoption*/)
		{
			cco/*chartOption*/ = _ILb/*sheetoption*/.cco/*chartOption*/;
			cco/*chartOption*/.charttype = charttype;
			cco/*chartOption*/.subtype = subtype;

			me._IJ9/*updateChartOption*/();
		}
	},

	_IL3/*updateChartToolbarItems*/: function(remove) {
	},

	_IL4/*updateRToolbarItems*/: function(remove) {
	},

	_IIa/*updateFilterInfo*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IIa/*updateFilterInfo*/,
	_IIa2/*updateDashboardFilterInfo*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IIa2/*updateDashboardFilterInfo*/,

	_II9/*updateViewMode*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._II9/*updateViewMode*/,

	_t$/*toolbarHandler*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._t$/*toolbarHandler*/,

	rs_i1_2/*regFavorites*/: function(xdoc) {
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED_FAV"), null, null, 0, "success");
	},

	_IN6/*getRequests*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IN6/*getRequests*/,

	_IN7/*postEditSql*/: function() {
		var me = this;
		me._ILe_/*updatePromptToolbar*/(true);
	},

	_IId/*clearAuxFilter*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IId/*clearAuxFilter*/,

	_INa/*closeRWizard*/: function(m) {
		var me = this,
			activeview = me.sheets[me._IJa/*activeSheet*/],
			_IH8/*rcontainer*/ = activeview._IH8/*rcontainer*/;

		if (m)
		{
			activeview._ILb/*sheetoption*/.rro/*ROption*/.s3/*scriptcontent*/ = m.vcontent;
			_IH8/*rcontainer*/.F2a/*updateRScript*/.call(_IH8/*rcontainer*/);
			_IH8/*rcontainer*/.F3/*requestR*/.call(_IH8/*rcontainer*/);
		}
	},

	addSheet: function(dlg) {
		var me = this,
			sheet = (dlg.objtype == "SHEET") ? new IG$/*mainapp*/._IEf/*clReport*/(null, me._ILa/*reportoption*/.itemtype, false) : new IG$/*mainapp*/._IFc/*sheetfiltercomp*/(null),
			sheetindex = me.sheets.length,
			panel = this,
			ubody;

		sheet.objtype = dlg.objtype;
		sheet.drillreport = dlg.drillreport;
		sheet.drilltarget = dlg.drilltarget;
		sheet.close = dlg.closable;
		sheet.hidetitle = dlg.hidetitle;
		sheet.isdistinct = dlg.isdistinct;
		sheet.name = dlg.reportname;
		sheet.openload = dlg.openload;
		sheet.columnfill = dlg.columnfill;

		switch (dlg.objtype)
		{
		case "SHEET":
			panel._ILa/*reportoption*/.sheets.push(sheet);
			break;
		default:
			ubody = panel._INb/*createControl*/(sheet);
			panel.ctrls[ubody.docid] = sheet;

			ubody.setReportOption.call(ubody, sheet);
			break;
		}

		panel._ILf_/*updateLayout*/(false);
	},

	_INb/*createControl*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._INb/*createControl*/,
	__l1/*boxresized*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.__l1/*boxresized*/,
	_IMd/*createSheet*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IMd/*createSheet*/,

	_INc/*procMenu*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._INc/*procMenu*/,

	_INd/*showDetailView*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._INd/*showDetailView*/,

	applyOption: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.applyOption,

	_INe/*doCellClick*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._INe/*doCellClick*/,

	_INf/*doDrillReport*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._INf/*doDrillReport*/,

	_IJ4/*broadCastFilter*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IJ4/*broadCastFilter*/,

	_IO0/*updateFormula*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IO0/*updateFormula*/,
	_IO2/*updatePivotContent*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IO2/*updatePivotContent*/,
	_IO1/*onFilterUpdate*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IO1/*onFilterUpdate*/,
	
	rs_showPrompt: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.rs_showPrompt,
	_IJd/*updateFilterChange*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IJd/*updateFilterChange*/,
	_IJc/*updateDataChange*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IJc/*updateDataChange*/,
	_aa/*confirmPivot*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._aa/*confirmPivot*/,
	_ab/*updatePivot*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._ab/*updatePivot*/,

	_IO3/*updatePivotContent*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IO3/*updatePivotContent*/,

	_IJ9/*updateChartOption*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IJ9/*updateChartOption*/,
	F/*doLink*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.F/*doLink*/,
	J3/*updateAllFilters*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.J3/*updateAllFilters*/,

	/* save reoprt content */
	_IJ6/*savePivotContent*/: function(uid, pivot, afterclose) {
		var panel = this;
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(panel,
			{
				ack: "31",
				payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
				mbody: pivot
			}, panel, panel.r_IJ6/*savePivotContent*/, null, [afterclose]);
		req._l/*request*/();
	},

	r_IJ6/*savePivotContent*/: function(xdoc, opt) {
		var me = this,
			afterclose = (opt ? opt[0] : false);
		if (afterclose)
		{
			me.ignoreclose = true;
			me.close();
		}
		else
		{
			me._ILb_/*contentchanged*/ = false;
			IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1("M_SAVED"), null, null, 0, "success");
		}
	},

	_IJ5/*saveAsPivotContent*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IJ5/*saveAsPivotContent*/,
	_IO4/*saveNewPivotContent*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IO4/*saveNewPivotContent*/,
	_IO6/*rs_processMakeMetaItem*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IO6/*rs_processMakeMetaItem*/,
	_IO5/*rs_processMakeMetaItem*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IO5/*rs_processMakeMetaItem*/,

	/* save reoprt content */

/* export */
	_IB2/*clipboardCopy*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IB2/*clipboardCopy*/,

	_IB3/*exportToFile*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IB3/*exportToFile*/,

	_IB4/*getExportData*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IB4/*getExportData*/,

	r_IB3/*exportToFile*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.r_IB3/*exportToFile*/,
/* export */

	_IB5/*showReportOption*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IB5/*showReportOption*/,

	_ILf/*makeTempReportXML*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._ILf/*makeTempReportXML*/,

	_IG7/*continueReportOption*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IG7/*continueReportOption*/,
	_ai/*afterinit*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._ai/*afterinit*/,
	_IFd/*init_f*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IFd/*init_f*/,
	_d1/*doDashboardExit*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._d1/*doDashboardExit*/,
	
	_IM9/*rs_loadContent*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/._IM9/*rs_loadContent*/,
	
	cL/*clearResult*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.cL/*clearResult*/
});

IG$/*mainapp*/._Ibc/*detailDrillWin*/ = $s.extend($s.window, {
	xtype: "window",
	modal: true,
	region:'center',
	layout: "fit",
	closable: true,
	resizable:true,
	maximizable: true,
	width: 700,
	height: 500,
	
	callback: null,
	poolname: null,
	
	defaults:{bodyStyle:'padding:10px'},
	
	c1/*confirm*/: function() {
		var me = this;
	},
	
	initComponent : function() {
		var me = this,
			i,
			pitem,
			rtype,
			doc = $(document),
			w = doc.width() || 700,
			h = doc.height() || 600;
		
		
		
		$s.apply(me, {
			width: w - 80,
			height: h - 80,
			title: IRm$/*resources*/.r1("L_DET_VIEW") + " (" + (me.viewinfo.title || me.viewinfo.name) + ")",
			items: [
			    {
			    	xtype: "container",
			    	layout: {
			    		type: "vbox",
			    		align: "stretch"
			    	},
			    	items: [
//						{
//							xtype: "displayfield",
//							value: me.viewinfo.title || me.viewinfo.name
//						},
						{
							xtype: "panel",
							flex: 1,
							name: "mpanel",
							border: 0,
							layout: "fit",
							items: [
							    // pitem
							]
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
				
		IG$/*mainapp*/._Ibc/*detailDrillWin*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			var me = this,
				mpanel = me.down("[name=mpanel]"),
				rtype,
				pitem;
			
			if (me.viewinfo)
			{
				rtype = "report";
				pitem = IG$/*mainapp*/._I61/*createAppPanel*/(
					me.viewinfo.uid,
					rtype, 
					me.viewinfo.name,
					me.viewinfo.nodepath, 
					false,
					{
						closable: false, 
						hiddentoolbar: true,
						auxfilter: me.auxfilter,
						header: false
					}
				);
				
				mpanel.add(pitem);
			};
		}
	}
});
IG$/*mainapp*/.cM4/*dummyControl*/ = function(layout, pctrl) {
	var me = this;
	me.html = $("<div class='dummyctrl'></div>");
	me.layout = layout;
	me.pctrl = pctrl;
	me._1/*createControl*/();
}

IG$/*mainapp*/.cM4/*dummyControl*/.prototype = {
	appendTo: function(pnode) {
		this.html.appendTo(pnode);
	},
	
	_1/*createControl*/: function() {
		var me = this,
			ctrl;
		me.html.bind("click", function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			
			me._2/*raiseEvent*/.call(me, "click");
		});
		
		me.html.resizable({
			resize: function(e, ui) {
				var p = ui.position,
					s = ui.size,
					layout = me.layout;
				layout.position.width = s.width;
				layout.position.height = s.height;
				
				me._2/*raiseEvent*/.call(me, "resize");
			}
		});
		
		me.html.draggable({
			stop: function(e, ui) {
				var p = ui.position,
					layout = me.layout;
				
				layout.position.top = p.top;
				layout.position.left = p.left;
				
				me._2/*raiseEvent*/.call(me, "resize");
			}
		});
		
		
		ctrl = IG$/*mainapp*/.getControl.call(me, me.layout.type);
				
		me.ctrl = ctrl;
	},
	
	_2/*raiseEvent*/: function(ev) {
		var me = this;
		me.html.trigger("e_" + ev);
	}
}
IG$/*mainapp*/.__global = IG$/*mainapp*/.__global || {};

IG$/*mainapp*/.$d = {
	applyOption: function(opt) {
		var me = this,
			btx;
		if (opt.bt) {
			btx = IG$/*mainapp*/._I13/*loadXML*/(opt.bt.content);
			me.rs_M1/*procRunDashboard*/(btx);
		}
		else if (opt._ipcnt) {
			me.iC/*applyParameters*/();
			me.M7a/*executeAction*/(me._9/*framecontent*/._l21/*applicationactions*/["onload"]); //P1/*OnLoadEvents*/);
		}
		
		me.bt = null;
	},
	
	M1/*procRunDashboard*/: function() {
    	var me = this,
    		uid = me.uid,
			cntarea = $(".dashboard_cnt", me.body.dom),
    		viewarea = $(".dashboardview", me.body.dom),
    		w, h, req,
    		browser = window.bowser;
    		
    	if (uid && uid.length > 0)
    	{
    		w = me._emode ? me.getWidth() : me.body.getWidth();
    		h = me._emode ? me.getHeight() : me.body.getHeight();
    		
    		me.initialized = true;
    		
    		$(viewarea).empty();
    		
    		if (browser.msie && w > 0 && h > 0)
    		{
    			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(viewarea, w);
    			IG$/*mainapp*/.x_10/*jqueryExtension*/._h(viewarea, h);
    		}
    		
    		if (me.bt && me.bt.content)
    		{
    			me.applyOption({
    				bt: me.bt
    			});
    		}
    		else
    		{
	    		req = new IG$/*mainapp*/._I3e/*requestServer*/();
	    		req.init(me, 
	    			{
		                ack: "5",
		                payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
		                mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
		            }, me, me.rs_M1/*procRunDashboard*/, null);
		        req._l/*request*/();
		    }
    	}
    },
    
    rs_M1/*procRunDashboard*/: function(xdoc) {
    	var me = this,
			item,
			ipcnt, i, tnode, tnodes, vname, v,
			pmap;
    	
    	me.setLoading(false);
    	
    	me._9/*framecontent*/ = new IG$/*mainapp*/.cdxml(xdoc);
		me._9/*framecontent*/.parseContent.call(me._9/*framecontent*/, me);
		
		item = me._9/*framecontent*/.item;
		
		if (item && item.uid)
		{
			me.uid = item.uid;
		}
    	
		me.M2/*parseEvents*/(xdoc);
		me.M3/*layoutControls*/();
		
		me.M3a/*parseScript*/(xdoc);
		
		me.iC/*applyParameters*/();
		
		me.M7a/*executeAction*/(me._9/*framecontent*/._l21/*applicationactions*/["onload"]); //P1/*OnLoadEvents*/);
	},
	
	showDummyInfo: function(ctrl) {
		var me = this,
			ditems = [
				{
					name: "Name",
					value: ctrl.name
				},
				{
					name: "Type",
					value: ctrl.type
				}
			],
			info = $("<ul class='dm-info'></ul>"),
			i;
			
		me.dummyInfo.empty();
		
		if (ctrl.item)
		{
			ditems.push({
				name: "Bind",
				value: ctrl.item.name
			});
		}
		
		for (i=0; i < ditems.length; i++)
		{
			info.append($("<li><span class='dm-title'>" + ditems[i].name + ": </span><span>" + ditems[i].value + "</span></li>"));
		}
				
		//me.dummyInfo.append(info);
		
		var o1 = ctrl.dummy.html.offset(),
			dom  = $(me.body.dom),
			o2 = dom.offset();
		
		me.dummyInfo.css({left: (o1.left - o2.left + 5), top: (o1.top - o2.top + 5)});
		me.dummyInfo.show();
	},
	
    
	
	iC/*applyParameters*/: function() {
		var me = this,
			ipcnt, tnode, pmap, tnodes, i, vname, v;
			
		if (me._ipcnt)
		{
			ipcnt = IG$/*mainapp*/._I13/*loadXML*/(me._ipcnt);
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(ipcnt, "/smsg/params");
			if (tnode)
			{
				pmap = me._9/*framecontent*/.page_param_map;
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < tnodes.length; i++)
				{
					vname = IG$/*mainapp*/._I1b/*XGetAttr*/(tnodes[i], "name");
					v = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
					
					if (pmap[vname])
					{
						pmap[vname].set(v);
					}
				}
			}
		}
		
		me._ipcnt = null;
	}, 
	
	M2/*parseEvents*/: function (xdoc) {
		var me = this,
			i, j, 
			snodes, evname,
			tnodes,
			actions, devent,
			rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/actevents");
			
		me.P1/*ActionEvents*/ = {};
		me.P1a/*ApplicationActions*/ = {onload: null, ontimer: null};
		
		
		
		if (rnode != null && rnode.hasChildNodes() == true)
		{
			// OnLoadEvents
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(rnode);
			for (i=0; i < snodes.length; i++)
			{
				evname = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[i], "name");
				tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(snodes[i]);
				actions = [];
				
				for (j=0; j < tnodes.length; j++)
				{
					devent = new IG$/*mainapp*/._ICe/*clEvents*/(tnodes[j]);
					actions.push(devent);
				}
				me.P1/*ActionEvents*/[evname] = actions;
			}
		}
		
		rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/appl_acts");
		
		if (rnode)
		{
			snodes = IG$/*mainapp*/._I26/*getChildNodes*/(rnode);
			for (i=0; i < snodes.length; i++)
			{
				var actname = IG$/*mainapp*/._I1b/*XGetAttr*/(snodes[i], "name");
				me.P1a/*ApplicationActions*/[actname] = IG$/*mainapp*/._I24/*getTextContent*/(snodes[i]);
			}
		}
    },
    M3/*layoutControls*/: function (framecontent) {
    	var me = this,
			cntarea = $(".dashboard_cnt", me.body.dom),
    		viewarea = $(".dashboardview", me.body.dom),
    		rnode, mbox,
    		dom = viewarea,
    		fc,
			cw, ch, w, h;
    		
    	if (framecontent)
    	{
    		me._9/*framecontent*/ = framecontent;
    	}
    	
    	fc = me._9/*framecontent*/;
    	
    	if (me.P3/*ControlItems*/)
    	{
	    	$.each(me.P3/*ControlItems*/, function(i, ctrl) {
				var pctrl = ctrl.P9/*control*/;
				if (pctrl && pctrl.destroy)
				{
					pctrl.destroy.call(pctrl);
				}
			});
		}
    		
    	me.P3/*ControlItems*/ = [];
    	me.P2/*ControlDict*/ = {};
    	me.P3r/*RootControlItems*/ = [];
    	
    	viewarea.empty();
    	
    	if (me.dsmode)
    	{
	    	me.dummyInfo = $("<div class='dummyinfo'></div>");
			me.dummyInfo.appendTo(dom);
			me.dummyInfo.hide();

			me.dummyInfo.bind("click", function() {
				me.dummyInfo.fadeOut(1000);
			});
		}
		
		cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(cntarea); // clientWidth;
		ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(cntarea); // clientHeight;
		
    	mbox = {x:0, y:0, w: cw, h: ch};
    	me.M4/*parseLayout*/(fc.layout, viewarea, mbox, null, me.P3r/*RootControlItems*/);
    	
    	if (!me.dsmode)
    	{
    		$.each(me.P3/*ControlItems*/, function(i, ctrl) {
    			var pctrl = ctrl.P9/*control*/;
    			if (pctrl)
    			{
    				pctrl.__ivp_ = 1;
    				pctrl.__ivp && pctrl.__ivp.call(pctrl);
    			}
    		});
    	}
    	
    	me.Mm11/*validateSize*/("", mbox.w, mbox.h, null);
    },
    
    cL/*changeLayout*/: function(ctrl) {
    	var me = this,
    		mbox = ctrl.P10/*me.measuredRect*/;
    	
    	me.Mmlla/*validateSubSize*/(ctrl, ctrl.layouts, mbox.x, mbox.y, mbox.w, mbox.h);
    },
    
    M3a/*parseScript*/: function(xdoc) {
    	var me = this,
    		rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/ActiveScript"),
    		txtscript, controls={}, i;
    	
    	for (i=0; i < me.P3/*ControlItems*/.length; i++)
    	{
    		controls[me.P3/*ControlItems*/[i].P6/*ctrlname*/] = me.P3/*ControlItems*/[i].P9/*control*/;
    	}
    	
    	me.m_d$$mj/*maindynscript*/ = me._9/*framecontent*/.m_d$$mj/*maindynscript*/;
    	me.m_d$$mj/*maindynscript*/._l6/*preparePrototype*/.call(me.m_d$$mj/*maindynscript*/, controls, me);
    	
//    	if (rnode)
//    	{
//    		txtscript = $.trim(IG$/*mainapp*/._I24/*getTextContent*/(rnode));
//    		if (txtscript != "")
//    		{
//    			txtscript = Base64.decode(txtscript);
//    			me.m_d$$mj/*maindynscript*/ = new IG$/*mainapp*/.d$$mj/*dynscript*/("cls_" + me.uid.replace("-", "_"));
//    			me.m_d$$mj/*maindynscript*/._l5/*loadScript*/.call(me.m_d$$mj/*maindynscript*/, txtscript);
//    			me.m_d$$mj/*maindynscript*/._l6/*preparePrototype*/.call(me.m_d$$mj/*maindynscript*/, controls, me);
//    		}
//    	}
    	
    	rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item/ConditionScript");
    	
    	if (rnode)
    	{
    		txtscript = $.trim(IG$/*mainapp*/._I24/*getTextContent*/(rnode));
    		if (txtscript != "")
    		{
    			txtscript = Base64.decode(txtscript);
    			me.c_d$$mj/*conditiondynscript*/ = new IG$/*mainapp*/.d$$mj/*dynscript*/("clc_" + me.uid.replace("-", "_"));
    			me.c_d$$mj/*conditiondynscript*/._l5/*loadScript*/.call(me.c_d$$mj/*conditiondynscript*/, txtscript);
    			me.c_d$$mj/*conditiondynscript*/._l6/*preparePrototype*/.call(me.c_d$$mj/*conditiondynscript*/, controls);
    		}
    	}
    },
    
    M4/*parseLayout*/: function(rlayout, view, mbox, uctrl, uchild) {
    	var me = this,
    		i;
    	if (rlayout && rlayout.length)
    	{
    		for (i=0; i < rlayout.length; i++)
    		{
				var uview = me.M5/*appendControl*/(rlayout[i], view, mbox, uctrl);
				uview.layouts = [];
				if (rlayout[i].layout.length)
				{
					me.M4/*parseLayout*/(rlayout[i].layout, uview.P9/*control*/.html, uview.P10/*measuredRect*/, uview, uview.layouts);
					// me.M4/*parseLayout*/(rlayout[i].layout, view, uview.P10/*measuredRect*/, uview, uview.layouts);
				}
				uchild.push(uview);
    		}
    	}
    },

    M5/*appendControl*/: function (node, view, mbox, uctrl) {
    	var me = this,
    		ctrl = new IG$/*mainapp*/._ICc/*clControlItem*/(node, uctrl, me.dsmode),
    		i, key, cprop = {}, value,
    		html;
    		
    	ctrl.dashboard = me;
    	ctrl.P1/*parentcontrol*/ = me;
    	
    	me.P3/*ControlItems*/.push(ctrl);
    	me.P2/*ControlDict*/[ctrl.P6/*ctrlname*/.toLowerCase()] = ctrl;
    	
    	ctrl.P11/*measurePosition*/(uctrl, mbox.x, mbox.y, mbox.w, mbox.h);
    	
    	var cstr = $("<div id='" + ctrl.P6/*ctrlname*/ + "'>");
    	
    	for (i=0; i < ctrl.P9/*control*/.p.length; i++)
    	{
    		cprop[ctrl.P9/*control*/.p[i].name] = ctrl.P9/*control*/.p[i];
    	}
    	
    	for (key in ctrl.P7/*property*/)
    	{
    		if (cprop[key])
    		{
    			value = ctrl.P7/*property*/[key];
    			
    			switch (cprop[key].datatype)
    			{
    			case "boolean":
    				ctrl.P7/*property*/[key] = (value == "true" || value == true) ? true : false;
    				break;
    			case "number":
    				ctrl.P7/*property*/[key] = Number(value);
    				break;
    			}
    		}
    	}
    	
    	var $ctrl = ctrl.P9/*control*/.html;
			 //, top: ctrl.P10/*measuredRect*/.y, left: ctrl.P10/*measuredRect*/.x, height: ctrl.P10/*measuredRect*/.h, width: ctrl.P10/*measuredRect*/.w });
			
		$ctrl.appendTo(view)
			.css({ position: "absolute"});
			
    	if (ctrl.P9/*control*/ != null && ctrl.P9/*control*/.html != null)
    	{
            ctrl.P9/*control*/.layout = node;
    		ctrl.P9/*control*/.initDrawing();
    	}
    	
		if (ctrl.P9/*control*/)
		{
			ctrl.P9/*control*/.pe/*processEvent*/ = me.M6/*processEventHandler*/;
			ctrl.P9/*control*/.invalidate.call(ctrl.P9/*control*/);
		}
		
		if (me.dsmode)
		{
			html = ctrl.i9/*initDesignerMode*/.call(ctrl, node);
			html && html.bind({
				"e_resize": function(e) {
					e.stopPropagation();
					e.stopImmediatePropagation();
					
					me._dE/*dashboardEditor*/._1/*dummyResized*/.call(me._dE/*dashboardEditor*/, node);
				},
				"e_click": function(e) {
					e.stopPropagation();
					e.stopImmediatePropagation();
					
					me._dE/*dashboardEditor*/._2/*dummyFocused*/.call(me._dE/*dashboardEditor*/, node);
				}
			});
		}
		
		return ctrl;
    },
    
    M6/*processEventHandler*/: function(evttype, sender) {
    	var me = this,
    		owner = me.ctrl.dashboard,
    		rect;
    	
    	switch (evttype)
    	{
    	case "magnifire":
    		var ctrl = sender.ctrl,
    			pw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(ctrl.P9/*me.control*/.html),
    			ph = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(ctrl.P9/*me.control*/.html);
    			
    		rect = ctrl.P10/*me.measuredRect*/;
    		
    		if (rect.w == pw && rect.h == ph)
    		{
    			var viewarea = $(".dashboardview", owner.body.dom);
    			ctrl.P9/*me.control*/.html.css({
    				top: 0, 
    				left: 0, 
    				width: viewarea.clientWidth, 
    				height: viewarea.clientHeight, 
    				zIndex: 99
    			});
    			var iobj = ctrl.P9/*me.control*/;
    			iobj.zoom = true;
    			iobj.invalidate.call(iobj);
    		}
    		else
    		{
    			ctrl.P9/*me.control*/.html.css({ 
    				position: "absolute", 
    				top: rect.y + rect._py, 
    				left: rect.x + rect._py, 
    				height: rect.h, 
    				width: rect.w, 
    				zIndex: "" 
    			})
    			ctrl.P9/*me.control*/.zoom = false;
    			ctrl.P9/*me.control*/.invalidate.call(ctrl.P9/*me.control*/);
    		}
    		break;
    	}
    },
    
    M7a/*executeAction*/: function(actions) {
    	var me = this,
    		events = [],
    		a, ai,
    		i, j,
    		es,
			arg = arguments;
    	
    	if (me.P1/*ActionEvents*/ && actions && actions.length > 0) 
        {
    		for (i=0; i < actions.length; i++)
    		{
    			a = actions[i];
    			
    			if (me.P1/*ActionEvents*/[a.uid])
    			{
    				ai = me.P1/*ActionEvents*/[a.uid];
    				for (j=0; j < ai.length; j++)
    				{
    					es = ai[j];
    					events.push(es);
    				}
	    		}
	    	}
			
			arg = Array.prototype.slice.call(arg, 1);
			arg.unshift(events);
	    	
	    	me.M7/*processRunEvents*/.apply(me, arg);
    	}
    },
    
    M7/*processRunEvents*/: function(events) {
    	var me = this,
			arg = arguments;
    	
		arg = Array.prototype.slice.call(arg, 1);
		
    	if (me.executeEvents && me.executeEvents.length > 0)
    	{
    		IG$/*mainapp*/._I52/*ShowError*/("Currently processing another job. Please wait while complete!");
    		return;
    	}
    	
    	me._IIf/*customLoad*/(true);
    	
    	clearTimeout(me.eX/*executionTimer*/);
    	
		me.eX/*executionTimer*/ = setTimeout(function() {
			me.executeEvents = [];
	    	
			for (i=0; i < events.length; i++)
			{
				events[i].args = arg;
				me.executeEvents.push(events[i]);
			}
			
			$.each(me.P2/*ControlDict*/, function(k, ctrl) {
				if (ctrl && ctrl.P9/*control*/ && ctrl.P9/*control*/._c1/*commit*/)
				{
					ctrl.P9/*control*/._c1/*commit*/.call(ctrl.P9/*control*/);
				}
			});
			
			me.M8/*contEventProc*/.call(me, me);
		}, 100);
    },
    
    _IIf/*customLoad*/: function(visible) {
    	var me = this,
			btn,
			dom,
			lm,
			ld;
			
		if (visible == true)
		{
			// me.renderDiv.css({position: "absolute"});
			// me.renderDiv.width(me.getWidth()).height(me.getHeight());
			
			lm = {
				msg: IRm$/*resources*/.r1("B_PROC") + " <button id='m-mec-loader'>" + IRm$/*resources*/.r1("B_PROC_CANCEL") + "</button>"
			};
			
			ld = me.setLoading(lm);
			
			dom = $(me.rendermask);
			// dom.width(me.getWidth()).height(me.getHeight());
			
			btn = $("#m-mec-loader", dom).bind("click", function() {
				me._IP5/*cancelQuery*/.call(me);
			});
		}
		else
		{
			me.setLoading(false);
		}
	},
	
	_IP5/*cancelQuery*/: function() {
		var me = this;
		me.executeEvents = null;
		me.setLoading(false);
	},
    
    M8/*contEventProc*/: function(me) {
    	if (me.executeEvents.length > 0)
    	{
    		var event = me.executeEvents.shift();
            try
            {
    			me.M10/*processEvents*/.call(me, event);
    		}
    		catch (e)
    		{
    			IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("E_D_EVNT", event.name));
    			setTimeout(function() {
                    me.executeEvents = null;
	    			me._IIf/*customLoad*/.call(me, false);
	    			me.setLoading(false);
	    		}, 10);
    		}
    	}
    	else
    	{
    		setTimeout(function() {
    			me._IIf/*customLoad*/.call(me, false);
    			me.setLoading(false);
    		}, 10);
    	}
    },
    
    M9/*updateEventValue*/: function(filter) {
    	var me = this,
    		valuemode,
    		ctlvalue,
    		i,
    		c,
    		pmap = me._9/*framecontent*/.page_param_map;
    		
    	filter.filtervalue = null;
    	
    	if (filter.operator)
    	{
    		valuemode = filter.valuemode;
    		if (valuemode == "control")
    		{
    			var valuectrl = me.P2/*ControlDict*/[filter.valuefield.toLowerCase()];
    			
    			if (valuectrl)
    			{
    				ctlvalue = valuectrl.P12/*getSelectionData*/.call(valuectrl, filter.valuefield);
    				
    				if (ctlvalue != null)
    				{
    					filter.filtervalue = ctlvalue;
    				}
    			}
    		}
    		else if (valuemode == "value")
    		{
    			ctlvalue = [
    				{code: filter.valuetext}
    			];
    			filter.filtervalue = ctlvalue;
    		}
    		
    		if (ctlvalue && ctlvalue.length > 0)
    		{
    			for (i=0; i < ctlvalue.length; i++)
    			{
    				c = ctlvalue[i].code;
    				
    				if (c && c.charAt(0) == "{" && c.charAt(c.length-1) == "}")
    				{
    					c = c.substring(1, c.length - 1);
    					if (pmap[c])
    					{
    						c = pmap[c].get();
    						
    						ctlvalue[i].code = c;
    					}
    				}
    			}
    		}
    	}
    },
	
	_g1/*procParamValue*/: function(param, isget, results) {
		var r = null,
			me = this,
			_9/*framecontent*/ = me._9/*framecontent*/,
			ctrl, pval,
			rmap = results ? results.r1/*resultmap*/ : null,
			rval = rmap ? rmap[param.name] : null;
		
		if (param.map_type == "var")
		{
			ctrl = _9/*framecontent*/.page_param_map[param.map_param];
			if (isget)
			{
				r = (ctrl ? ctrl.get() : null);
			}
			else
			{
				if (rval)
				{
					ctrl.set(rval.t == "dataset" ? rval : rval.v);
				}
			}
		}
		else if (param.map_type == "ctrl")
		{
			ctrl = me.P2/*ControlDict*/[param.map_param.toLowerCase()];
			
			if (isget)
			{
				// ctrl && ctrl.P9/*control*/ && ctrl.P9/*control*/._c1/*commit*/ && ctrl.P9/*control*/._c1/*commit*/.call(ctrl.P9/*control*/);
				// r = (ctrl && ctrl.P9/*control*/ ? ctrl.P9/*control*/.get("text") : null);
//				if (ctrl && ctrl.P9/*control*/ && ctrl.P9/*control*/._c1/*commit*/)
//				{
//					ctrl.P9/*control*/._c1/*commit*/.call(ctrl.P9/*control*/);
//				}
				
				if (ctrl && ctrl.P9/*control*/ && ctrl.P9/*control*/.P12/*getSelectionData*/)
				{
					pval = ctrl.P9/*control*/.P12/*getSelectionData*/.call(ctrl.P9/*control*/, param);
					if (pval && pval.length > 0)
					{
						r = pval[0].code;
					}
				}
				else if (ctrl && ctrl.P9/*control*/)
				{
					r = ctrl.P9/*control*/.get("text");
				}
			}
			else
			{
				if (rval)
				{
					if (rval.t == "dataset")
					{
						ctrl.P9/*control*/._ds/*applyDataSet*/ && ctrl.P9/*control*/._ds/*applyDataSet*/.call(ctrl.P9/*control*/, rval);
					}
					else
					{
						ctrl.P9/*control*/.set("text", rval.v);
					}
				}
			}
		}
		
		return r;
	},
	
	_a/*getInputParams*/: function(event) {
		var cnt = "<params>",
			k,
			me = this;
			
		for (k in event.iparams)
		{
			cnt += "<param name='" + k + "'><![CDATA[";
			r = me._g1/*procParamValue*/(event.iparams[k], true);
			cnt += (r || "");
			cnt += "]]></param>";
		}
		cnt += "</params>";
		
		return cnt;
	},
    
    M10/*processEvents*/: function (event) {
    	var me = this,
    		i,
    		async = false,
    		iserror = -1,
    		errmsg,
			args = event.args;
    	
    	switch (event.purpose.toLowerCase())
    	{
    	case "onlinereport":
    		var ctrl, 
    			t,
    			reportuid = (event.item ? event.item.uid : null) || null,
    			cback;
    		
    		for (i=0; i < me.P3/*ControlItems*/.length; i++)
    		{
    			t = me.P3/*ControlItems*/[i];
    			if (t.P3/*applicationItem*/ && t.P6/*ctrlname*/ == reportuid)
    			{
    				ctrl = t;
    				break;
    			}
    		}
    		
    		var filterxml = "<smsg><filters source='dashboard'>";
    		
    		filterxml += "<Filter>";
    		filterxml += event.__sfilter.TX/*getXML*/.call(event.__sfilter);
    		filterxml += "</Filter>";
    		
    		filterxml += "<HavingFilter>";
    		filterxml += event.__shavingfilter.TX/*getXML*/.call(event.__shavingfilter);
    		filterxml += "</HavingFilter>";
    		
    		filterxml += "</filters>";
    		
    		filterxml += me._a/*getInputParams*/(event);
    		
    		filterxml += "</smsg>";
    		
    		if (ctrl)
    		{
				var pc = ctrl.P9/*control*/,
					pp = ctrl.P7/*property*/;
										
				async = false;
				
				cback = new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(xdoc, iserror) {
					var me = this;
					if (iserror != true)
					{
						// me.M8/*contEventProc*/(me);
					}
				});
				
				pc.eRun && pc.eRun.call(pc, cback, filterxml);
    		}
    		else
    		{
    			iserror = 1;
    		}
    		break;
    	case "valuelist":
//    		var ctrl = null;
    		
//    		for (i=0; i < me.P3/*ControlItems*/.length; i++)
//    		{
//    			if (me.P3/*ControlItems*/[i].P6/*ctrlname*/ == event.P13/*controlid*/)
//    			{
//    				ctrl = me.P3/*ControlItems*/[i];
//    				break;
//    			}
//    		}
    		
    		// if (ctrl != null && ctrl.P3/*applicationItem*/ != null)
    		if (event.item && event.item.uid)
    		{
    			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(me, 
					{
			            ack: "18",
						payload: "<smsg><item uid='" + event.item.uid + "' option='valuelist'/></smsg>",
						mbody: "<smsg></smsg>"
			        }, me, function(xdoc) {
			        	var me = this,
				    		result = new IG$/*mainapp*/._ICd/*clValueList*/(xdoc, event.item.uid);
				    	
				    	$.each(event.oparams, function(k, param) {
				    		if (param.map_type == "ctrl" && param.map_param)
				    		{
				    			var ctrl = me._9/*framecontent*/.controls[param.map_param.toLowerCase()];
				    				rctrl = me.P2/*ControlDict*/[param.map_param.toLowerCase()];
				    				
								rctrl = (rctrl ? rctrl.P9/*control*/ : null);
								
					    		if (ctrl && rctrl)
					    		{
					    			rctrl.loadData && rctrl.loadData.call(rctrl, result);
					    		}
					    	}
				    	});
				    	
				    	me.M8/*contEventProc*/(me);
			        }, null);
				req._l/*request*/();
				return;
    		}
    		else
    		{
    			iserror = 1;
    		}
    		break;
    	case "execute_script":
    		if (me.m_d$$mj/*maindynscript*/)
    		{
	    		if (event.script)
	    		{
					args.unshift(event.script);
					
	    			var s = me.m_d$$mj/*maindynscript*/._l7/*executeScript*/.apply(me.m_d$$mj/*maindynscript*/, args);
	    			
	    			if (me.m_d$$mj/*maindynscript*/.lastError)
	    			{
	    				IG$/*mainapp*/._I52/*ShowError*/(me.m_d$$mj/*maindynscript*/.lastError);
	    				iserror = 3;
	    			}
	    			else if (s === 2)
	    			{
	    				async = true;
	    			}
	    			else if (s == false)
	    			{
	    				me.executeEvents = null;
	    				me._IIf/*customLoad*/.call(me, false);
    					me.setLoading(false);
    					
    					async = true;
	    			}
	    		}
	    	}
	    	else
	    	{
	    		iserror = 2;
	    	}
    		break;
    	case "export":
    		if (event.exp_tmpl && event.exp_out)
    		{
    			var exportdata = me._m/*getExportData*/();
				
				var fname = me._9/*framecontent*/.item ? me._9/*framecontent*/.item.name : "",
					req = new IG$/*mainapp*/._I3e/*requestServer*/(),
					filetype,
					filetype = "TMPL",
					fileext;
					
				switch (event.exp_out)
				{
				case "excel":
					fileext = "xls";
					break;
				case "word":
					fileext = "doc";
					break;
				default:
					fileext = event.exp_out;
					break;
				}
				
				fname = fname || "unnamed";
				fname = fname.replace(/\./g, "_");
				fname = fname.replace(/ /g, "");
				
				fname += "." + fileext;
					
				req.init(me, 
					{
			            ack: "20",
			            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({
			            	uid: me.uid,
			            	type: filetype,
			            	filename: fname,
			            	fonttype: "",
			            	utemplate: "T",
			            	tmplpage: event.exp_tmpl,
			            	jasper_filetype: event.exp_out
			            }, "uid;type;filename;fonttype;utemplate;tmplpage;jasper_filetype"),
			            mbody: exportdata
			        }, me, me.r_IB3/*exportToFile*/, null, fname);
			    req._l/*request*/();
	    	}
	    	else
	    	{
	    		iserror = 2;
	    	}
    		break;
    	case "servercall":
    		if (event.jmodule && event.jmethod)
    		{
    			async = true;
    			var req = new IG$/*mainapp*/._I3e/*requestServer*/(),
					cnt = "<smsg>",
					k,
					r;
					
				cnt += me._a/*getInputParams*/(event);
					
				cnt += "</smsg>";
				
				req.init(me, 
					{
			            ack: "73",
						payload: "<smsg><item" + IG$/*mainapp*/._I21/*XUpdateInfo*/({uid: me.uid, option: "exec", jmodule: event.jmodule, jmethod: event.jmethod}) + "/></smsg>",
						mbody: cnt
			        }, me, function(xdoc) {
						var me = this,
							k,
							cresult;
							
						cresult = new IG$/*mainapp*/._maa/*pluginresults*/(xdoc);
						
						for (k in event.oparams)
						{
							me._g1/*procParamValue*/(event.oparams[k], false, cresult);
						}
						
						me._1_p(xdoc, ctrl);
					}, function() {
						this.executeEvents = null;
						me._IIf/*customLoad*/(false);
					}, ctrl);
				req._l/*request*/();
    		}
    		else
    		{
    			iserror = 4;
    		}
    		break;
		case "open_win":
			var duid = event.item && event.item.uid,
				target_window,
				ipcnt = "<smsg>";
			
			target_window = event.iparams && event.iparams["target_window"] ? event.iparams["target_window"] : null;
			
			if (target_window && target_window.map_param && target_window.map_type)
			{
				duid = me._g1/*procParamValue*/(event.iparams["target_window"], true);
			}
			
			if (duid)
			{
				async = true;
				
				ipcnt += me._a/*getInputParams*/(event);
				ipcnt += "</smsg>";
				
				var req = new IG$/*mainapp*/._I3e/*requestServer*/();
				req.init(me, 
					{
						ack: "11",
						payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: duid}),
						mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "translate"})
					}, me, function(xdoc) {
						var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
							p = tnode ? IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode) : null;
						
						if (p.type == "Dashboard" && event.ispopup == true)
						{
							var req_dashboard = new IG$/*mainapp*/._I3e/*requestServer*/();
							req_dashboard.init(me, 
								{
									ack: "5",
									payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: event.item.uid}),
									mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "diagnostics"})
								}, me, function(xdoc) {
									var _9/*framecontent*/ = new IG$/*mainapp*/.cdxml(xdoc),
										dmain = new IG$/*mainapp*/._IBf/*DashboardView*/({
											bt: {
												content: IG$/*mainapp*/._I25/*toXMLString*/(xdoc)
											},
											uid: event.item.uid,
											closable: true,
											header: false,
											_ipcnt: ipcnt,
											border: 0
										});
										
									_9/*framecontent*/.parseContent.call(_9/*framecontent*/, null);
									
									var dlg = new IG$/*mainapp*/._IBF/*DashboardViewDlg*/({
										uid: event.item.uid,
										dmain: dmain,
										title: _9/*framecontent*/.item.name,
										width: _9/*framecontent*/.width,
										height: _9/*framecontent*/.height,
										callback: new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(dlg) {
											me._1_p(null, null);
										})
									});
									
									dmain.on("close_win", function() {
										dlg.close();
									});
									IG$/*mainapp*/._I_5/*checkLogin*/(this, dlg);
								}, false);
							req_dashboard._l/*request*/();
						}
						else
						{
							var mp = IG$/*mainapp*/._I7d/*mainPanel*/;
							mp && mp.m1$7/*navigateApp*/.call(mp, p.uid, p.type.toLowerCase(), p.name, p.nodepath, false, p.writable, null, {
								_ipcnt: ipcnt
							});
							me._1_p.call(me);
						}
					}, false);
				req._l/*request*/();
			}
			else
			{
				iserror = 5;
			}
			break;
		case "open_dlg":
			async = true;
			switch (event.btntype)
			{
			case "yesno":
				IG$/*mainapp*/._I55/*confirmMessages*/(event.dlgtitle, event.dlgmsg, function(dlg) {
					me._1_p.call(me);
				}, null, null, 6);
				break;
			case "yesnocancel":
				IG$/*mainapp*/._I55/*confirmMessages*/(event.dlgtitle, event.dlgmsg, function(dlg) {
					me._1_p.call(me);
				}, null, null, 14);
				break;
			default:
				IG$/*mainapp*/._I54/*alertmsg*/(event.dlgtitle, event.dlgmsg, function() {
					me._1_p.call(me);
				}, null, 2);
				break;
			}
			break;
		case "close":
			this.fireEvent("close_win");
			break;
		case "update_params":
			break;
		case "upload_file":
			break;
		case "sql":
			if (event.dsource && event.sqlsyntax)
			{
				async = true;
				var req = new IG$/*mainapp*/._I3e/*requestServer*/(),
					cnt = "<smsg>",
					k,
					r;
					
				cnt += me._a/*getInputParams*/(event);
				
				cnt += event.getXML();
				cnt += "</smsg>";
				req.init(me, 
					{
			            ack: "73",
						payload: "<smsg><item" + IG$/*mainapp*/._I21/*XUpdateInfo*/({uid: me.uid, option: "run_sql"}) + "/></smsg>",
						mbody: cnt
			        }, me, function(xdoc) {
						var me = this,
							k,
							cresult,
							tnode,
							resultid;
						
						if (event.rmode == "list")
						{
							tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item");
							resultid = (tnode ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "resultid") : null);
							
							if (resultid)
							{
								var n = 0;
								
								for (k in event.oparams)
								{
									n++;
								}
								
								if (n > 0)
								{
									$.each(event.oparams, function(k, op) {
										var sreq = new IG$/*mainapp*/._I3e/*requestServer*/(),
											ctrl, rctrl,
											bs = true;
										
										if (op.map_type == "ctrl")
										{
											ctrl = me._9/*framecontent*/.controls[op.map_param.toLowerCase()];
											rctrl = me.P2/*ControlDict*/[op.map_param.toLowerCase()];
											rctrl = (rctrl ? rctrl.P9/*control*/ : null);
											
											if (ctrl && rctrl)
											{
												sreq.init(me, 
													{
														ack: "73",
														payload: "<smsg><item" + IG$/*mainapp*/._I21/*XUpdateInfo*/({uid: me.uid, option: "gridresult", resultid: resultid}) + "/></smsg>",
														mbody: "<smsg>" + ctrl.getXML() + "</smsg>"
													}, me, 
													function(xdoc) {
														var result = new IG$/*mainapp*/._IF2/*clResults*/(xdoc);
														
														rctrl.loadData && rctrl.loadData.call(rctrl, result);
														
														n--;
														if (n == 0)
														{
															me._1_p.call(me, xdoc, ctrl);
														}
													}, 
													function(xdoc) {
														me.executeEvents = null;
														me._IIf/*customLoad*/(false);
													}
												);
												sreq._l/*request*/();
												
												bs = false;
											}
										}
										
										if (bs == true)
										{
											n--;
											if (n == 0)
											{
												me._1_p.call(me, xdoc, ctrl);
											}
										}
									});
								}
								else
								{
									me._1_p(xdoc, ctrl);
								}
							}
							else
							{
								me._1_p(xdoc, ctrl);
							}
						}
						else
						{
							cresult = new IG$/*mainapp*/._maa/*pluginresults*/(xdoc);
							
							for (k in event.oparams)
							{
								me._g1/*procParamValue*/(event.oparams[k], false, cresult);
							}
							
							me._1_p(xdoc, ctrl);
						}
					}, null, ctrl);
				req._l/*request*/();
			}
			else
			{
				iserror = 5;
			}
			break;
    	}
    	
    	if (async == false && iserror < 0)
    	{
    		me.M8/*contEventProc*/(me);
    	}
    	else if (iserror > -1)
    	{
    		switch (iserror)
    		{
    		case 1:
    			errmsg = "Item not found";
    			break;
    		case 2:
    			errmsg = "Script not loaded";
    			break;
    		case 3:
    			errmsg = "Error on script execution";
    			break;
    		case 4:
    			errmsg = "Service not found";
    			break;
			case 5:
				errmsg = "Service parameter not configured correctly";
				break;
    		}
			
			me.executeEvents = null;
			me._IIf/*customLoad*/.call(me, false);
    		me.setLoading(false);
    		
    		if (errmsg)
    		{
    			IG$/*mainapp*/._I52/*ShowError*/(errmsg);
    		}
    	}
    },
    
    
    
    _1_p: function(xdoc, ctrl) {
    	var me = this;
    	me.M8/*contEventProc*/(me);
    },
    
    M8_/*stopEventProc*/: function() {
    	var me = this;
    	me.executeEvents = null;
		me._IIf/*customLoad*/.call(me, false);
		me.setLoading(false);
    },

    _m/*getExportData*/: function() {
        var me = this,
            exportdata = "<smsg><dashboard>";

        $.each(me.P3/*ControlItems*/, function(i, ctrl) {
            var pctrl = ctrl.P9/*control*/,
                expoption = {},
                ctrlname;
            if (pctrl)
            {
            	ctrlname = pctrl.ctrl.P6/*ctrlname*/ || "";
            	
                switch (pctrl.type)
                {
                case "olapreport":
                    if (pctrl.viewer) // && pctrl.html.is(":visible"))
                    {
                        exportdata += pctrl.viewer._IB4/*getExportData*/.call(pctrl.viewer, expoption, "jasper", false, true, ctrlname);
                    }
                    break;
                case "dashboard":
                    if (pctrl.viewer) // && pctrl.html.is(":visible"))
                    {
                        exportdata += "<dashboard name='" + ctrlname + "'>" + pctrl.viewer._m/*getExportData*/.call(pctrl.viewer) + "</dashboard>";
                    }
                    break;
                case "label":
                	exportdata += "<text name='" + ctrlname + "'><![CDATA[" + (pctrl.get("text") || "") + "]]></text>";
                	break;
                }
            }
        });

        exportdata += "</dashboard></smsg>";

        return exportdata;
    },
    
    Mm11/*validateSize*/: function(orientation, w, h, pctrl) {
    	var me = this,
    		i,
			cntarea = $(".dashboard_cnt", me.body.dom),
    		view = $(".dashboardview", me.body.dom),
			cw,
			ch,
			w, h,
			fc = me._9/*framecontent*/;
		
		cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(cntarea);
		ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(cntarea);
		
		if (fc)
		{
			w = (fc.autowidth == false && fc.width > 0) ? fc.width : (fc.minwidth > cw) ? fc.minwidth : cw;
			h = (fc.autoheight == false && fc.height > 0) ? fc.height : (fc.minheight > ch) ? fc.minheight : ch;
		}
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(view, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(view, h);
		
		cntarea.css({
			"overflowX": fc && fc.hscroll ? "auto" : "hidden", 
			"overflowY": fc && fc.vscroll ? "auto" : "hidden"
		});
		
    	me.Mmlla/*validateSubSize*/(null, me.P3r/*RootControlItems*/, 0, 0, w, h);
    },
    
    Mmlla/*validateSubSize*/: function(pctrl, items, cx, cy, cw, ch) {
    	var i,
    		me = this,
    		psub = {t: 0, b: 0, l: 0, r: 0},
            _tth = 0,
            b = {}, my = 0,
            ctrl,
            _tth, pval, rect;
    	
    	if (pctrl != null && pctrl.P4/*ctrltype*/ == "panel")
    	{
    		pval = pctrl.P7/*property*/.padding || 0;
    		psub = {t: pval, b: pval, l: pval, r: pval};
    	}
    	
    	cw = cw - psub.l - psub.r;
    	ch = ch - psub.t - psub.b;
    	
    	if (pctrl != null && pctrl.P4/*ctrltype*/ == "panel" && pctrl.P7/*property*/.layout == "border")
    	{
    		for (i=0; i < items.length; i++)
    		{
    			ctrl = items[i];
    			b[ctrl.P7/*property*/.region] = ctrl;
    			ctrl.P11/*measurePosition*/(pctrl, cx, cy, cw, ch);
    		}
    		
	    	my = 0;
    		
    		$.each(["north", "south", "east", "west", "center"], function(index, key) {
    			var lctrl = b[key],
    				lrect,
    				cstr,
    				$ctrl,
    				plw, plh, plx, ply;
    			
    			if (lctrl)
    			{
    				lrect = lctrl.P10/*measuredRect*/;
    				
    				switch (key)
    				{
    				case "north":
    					lrect.x = 0;
    					lrect.y = my;
    					lrect.w = cw;
    					lrect.h -= my;
    					break;
    				case "south":
    					lrect.x = 0;
    					lrect.y = ch - my - lrect.h;
    					lrect.w = cw;
    					lrect.h -= my;
    					break;
    				case "east":
    					lrect.x = cw - lrect.w;
    					lrect.y = my;
    					lrect.h = ch - my;
    					if (b["north"])
    					{
    						lrect.y = my + b["north"].P10/*measuredRect*/.h;
    						lrect.h -= b["north"].P10/*measuredRect*/.h;
    					}
    					if (b["south"])
    					{
    						lrect.h -= b["south"].P10/*measuredRect*/.h;
    					}
    					break;
    				case "west":
    					lrect.x = 0;
    					lrect.y = my;
    					lrect.h = ch - my;
    					if (b["north"])
    					{
    						lrect.y = my + b["north"].P10/*measuredRect*/.h;
    						lrect.h -= b["north"].P10/*measuredRect*/.h;
    					}
    					if (b["south"])
    					{
    						lrect.h -= b["south"].P10/*measuredRect*/.h;
    					}
    					break;
    				case "center":	
    					lrect.x = 0;
    					lrect.y = my;
    					lrect.w = cw;
    					lrect.h = ch - my;
    					if (b["north"])
    					{
    						lrect.y = my + b["north"].P10/*measuredRect*/.h;
    						lrect.h -= b["north"].P10/*measuredRect*/.h;
    					}
    					if (b["south"])
    					{
    						lrect.h -= b["south"].P10/*measuredRect*/.h;
    					}
    					if (b["west"])
    					{
    						lrect.x = b["west"].P10/*measuredRect*/.w;
    						lrect.w -= b["west"].P10/*measuredRect*/.w;
    					}
    					if (b["east"])
    					{
    						lrect.w -= b["east"].P10/*measuredRect*/.w;
    					}
    					break;
    				}
    				
    				cstr = lctrl.P9/*control*/.html;
		    	
			    	$ctrl = cstr
						.css({ 
							position: "absolute", 
							top: lrect.y + psub.t, 
							left: lrect.x + psub.l, 
							height: lrect.h - psub.t - psub.b, 
							width: lrect.w - psub.l - psub.r
						});
						
					if (lctrl.P9/*control*/ != null)
					{
						lctrl.P9/*control*/.invalidate.call(lctrl.P9/*control*/);
					}
					
					if (lctrl.layouts && lctrl.layouts.length > 0)
					{
						plx = lctrl.P10/*measuredRect*/.x;
						ply = lctrl.P10/*measuredRect*/.y;
						plw = lctrl.P10/*measuredRect*/.w;
						plh = lctrl.P10/*measuredRect*/.h;
						
						if (lctrl.P4/*ctrltype*/ == "panel")
						{
							plh -= lctrl.P9/*control*/.titleheight;
						}
						me.Mmlla/*validateSubSize*/.call(me, lctrl, lctrl.layouts, plx, ply, plw, plh);
					}
    			}
    		});
    	}
    	else if (pctrl != null && pctrl.P4/*ctrltype*/ == "panel" && (pctrl.P7/*property*/.layout == "hbox" || pctrl.P7/*property*/.layout == "vbox"))
    	{
    		var direction = pctrl.P7/*property*/.layout,
    			ps = 0, pw=0, ph=0, tw=0; th=0;
    		
    		for (i=0; i < items.length; i++)
			{
				ctrl = items[i];
				p = ctrl.P5/*position*/;
					
    			ctrl.P11/*measurePosition*/(pctrl, cx, cy, cw, ch);
    			
				if (p.percentwidth != null)
				{
					pw += p.percentwidth;
				}
				else if (p.width != null)
				{
					tw += p.width;
				}
				
				if (p.percentheight != null)
				{
					ph += p.percentheight;
				}
				else if (p.height != null)
				{
					th += p.height;
				}
			}
			
    		for (i=0; i < items.length; i++)
    		{
    			ctrl = items[i];
    			p = ctrl.P5/*position*/;
    			rect = ctrl.P10/*measuredRect*/;
    			if (direction == "hbox")
    			{
    				rect.x = ps;
					rect.y = 0;
					rect.w = (p.width != null) ? p.width : 
							  (p.percentwidth != null) ? (cw - tw) * p.percentwidth / pw :
							  rect.w;
					ps += rect.w;
				}
				else if (direction == "vbox")
				{
					rect.x = 0;
					rect.y = ps;
					rect.h = (p.height != null) ? p.height :
							  (p.percentheight != null) ? (ch - th) * p.percentheight / ph : 
							  rect.h;
					ps += rect.h;
				}
				
    			if (pctrl != null && pctrl.P4/*ctrltype*/ == "panel")
		    	{ 
		    		rect.y += pctrl.P9/*control*/.titleheight;
		    	}
		    	
    			cstr = ctrl.P9/*control*/.html;
		    	
		    	$ctrl = cstr
					.css({ 
						position: "absolute", 
						top: rect.y + psub.t, 
						left: rect.x + psub.l, 
						height: rect.h - psub.t - psub.b, 
						width: rect.w - psub.l - psub.r
					});
					
				if (ctrl.P9/*control*/ != null)
				{
					ctrl.P9/*control*/.invalidate.call(ctrl.P9/*control*/);
				}
				
				if (ctrl.layouts && ctrl.layouts.length > 0)
				{
					plx = rect.x;
					ply = rect.y;
					plw = rect.w;
					plh = rect.h;
						
					if (ctrl != null && ctrl.P4/*ctrltype*/ == "panel")
					{
						plh -= ctrl.P9/*control*/.titleheight;
					}
					me.Mmlla/*validateSubSize*/(ctrl, ctrl.layouts, plx, ply, plw, plh);
				}
    		}
    	}
        else if (pctrl != null && pctrl.P4/*ctrltype*/ == "tabpanel")
        {
            pctrl.P9/*control*/.loadHeader.call(pctrl.P9/*control*/, items);
            _tth = pctrl.P9/*controls*/.getTabHeight.call(pctrl.P9/*controls*/);

            for (i=0; i < items.length; i++)
            {
                var ctrl = items[i];
                
                ctrl.P10/*measuredRect*/ = {
                    x: 0,
                    y: 0,
                    w: cw,
                    h: ch,
                    _px: cx,
                    _py: cy
                };
                
                rect = ctrl.P10/*measuredRect*/;
                rect.y += _tth;
                rect.h -= _tth;
                
                cstr = ctrl.P9/*control*/.html;
                
                $ctrl = cstr
                    .css({ 
                        position: "absolute", 
                        top: rect.y + psub.t, 
                        left: rect.x + psub.l, 
                        height: rect.h - psub.t - psub.b, 
                        width: rect.w - psub.l - psub.r
                    });

                if (ctrl.P9/*control*/ != null)
                {
                    ctrl.P9/*control*/.invalidate.call(ctrl.P9/*control*/);
                }
                
                if (ctrl.layouts && ctrl.layouts.length > 0)
                {
                	plx = rect.x;
                	ply = rect.y;
                    plw = rect.w;
                    plh = rect.h;
                        
                    me.Mmlla/*validateSubSize*/(ctrl, ctrl.layouts, plx, ply, plw, plh);
                }

                if (i == pctrl.P9/*control*/.activeIndex)
                {
                    ctrl.P9/*controls*/.html.show();
                }
                else
                {
                    ctrl.P9/*controls*/.html.hide();
                }
            }
        }
    	else
    	{
	    	for (i=0; i < items.length; i++)
	    	{
	    		ctrl = items[i];
		    	
		    	ctrl.P11/*measurePosition*/(pctrl, cx, cy, cw, ch);
		    	
		    	if (pctrl != null && pctrl.P4/*ctrltype*/ == "panel")
		    	{ 
		    		ctrl.P10/*measuredRect*/.y += pctrl.P9/*control*/.titleheight;
		    	}
		    	
		    	cstr = ctrl.P9/*control*/.html;
		    	
		    	rect = ctrl.P10/*measuredRect*/;
		    	
		    	$ctrl = cstr
					.css({ 
						position: "absolute", 
						top: rect.y + psub.t, 
						left: rect.x + psub.l, 
						height: rect.h - psub.t - psub.b, 
						width: rect.w - psub.l - psub.r
					});
					
				if (ctrl.P9/*control*/ != null)
				{
					ctrl.P9/*control*/.invalidate.call(ctrl.P9/*control*/);
				}
				
				if (ctrl.layouts && ctrl.layouts.length > 0)
				{
					plx = rect.x;
					ply = rect.y;
					plw = rect.w;
					plh = rect.h;
						
					if (ctrl != null && ctrl.P4/*ctrltype*/ == "panel")
					{
						plh -= ctrl.P9/*control*/.titleheight;
					}
					me.Mmlla/*validateSubSize*/(ctrl, ctrl.layouts, plx, ply, plw, plh);
				}
	    	}
	    }
    },
    
    disposeContent: function(ui) {
    	var viewarea = $(".dashboardview", ui.body.dom);
    	
    	if (ui.P3/*ControlItems*/)
    	{
    		for (var i=ui.P3/*ControlItems*/.length - 1; i>=0; i--)
    		{
    			if (ui.P3/*ControlItems*/[i])
    			{
    				ui.P3/*ControlItems*/[i].disposeContent(ui.P3/*ControlItems*/[i]);
    				delete ui.P3/*ControlItems*/[i];
    			}
    		}
    		
    		ui.P3/*ControlItems*/ = null;
    	}
    	
    	if (viewarea) {
    		$(viewarea).empty();
    	}
    },
    
    afterrender: function (ui) {
		var me = ui;
		if (me.initialized == false && me.uid && me.uid.length > 0)
		{
			me.M1/*procRunDashboard*/();
		}
	},
	resize: function(ui, adjWidth, adjHeight, rawWidth, rawHeight) {
		ui.Mm11/*validateSize*/.call(ui, adjWidth, adjHeight, null);
	}
};



if (window.Ext)
{
	IG$/*mainapp*/._IBf/*DashboardView*/ = $s.extend(IG$/*mainapp*/._I57/*IngPanel*/, {
	    iconCls: "icon-dashboard",
	    
	    "layout": {
	        type: "vbox",
	        align: "stretch"
	    },
	    
	    defaults: {
	        flex: 1
	    },
	    
	    entryLogin: function(thisobj)
		{
			thisobj.M1/*procRunDashboard*/.call(thisobj);
		},
		
		commitCode: function() {
			var me = this;
			return true;
		},
		
		refreshCode: function() {
			var me = this;
			me._dE/*dashboardEditor*/.refreshControl.call(me._dE/*dashboardEditor*/);
			me.M3/*layoutControls*/();
		},
		    
	    initComponent: function(){
	    	var panel = this;
			panel.hiddenPkgs = [];
			panel.addEvents("close_win");
			$s.apply(this, {
				P1/*ActionEvents*/: {},
			    P2/*ControlDict*/: {},
			    P3/*ControlItems*/: [],
			    P3r/*RootControlItems*/: [],
			    initialized: false,
			    refreshmode: "F",
			    closable: true,
			    autoScroll:true,
			    collapseFirst:false,
				items: [
					{
					html: "<div class='dashboard_cnt'><div class='dashboardview'></div></div>"
					}
				]
			});
			
			IG$/*mainapp*/._IBf/*DashboardView*/.superclass.initComponent.call(this);
		},
	    
		applyOption: IG$/*mainapp*/.$d.applyOption,
		M1/*procRunDashboard*/: IG$/*mainapp*/.$d.M1/*procRunDashboard*/,
		rs_M1/*procRunDashboard*/: IG$/*mainapp*/.$d.rs_M1/*procRunDashboard*/,
		showDummyInfo: IG$/*mainapp*/.$d.showDummyInfo,
		iC/*applyParameters*/: IG$/*mainapp*/.$d.iC/*applyParameters*/,
		M2/*parseEvents*/: IG$/*mainapp*/.$d.M2/*parseEvents*/,
		M3/*layoutControls*/: IG$/*mainapp*/.$d.M3/*layoutControls*/,
		cL/*changeLayout*/: IG$/*mainapp*/.$d.cL/*changeLayout*/,
		M3a/*parseScript*/: IG$/*mainapp*/.$d.M3a/*parseScript*/,
		M4/*parseLayout*/: IG$/*mainapp*/.$d.M4/*parseLayout*/,
		M5/*appendControl*/: IG$/*mainapp*/.$d.M5/*appendControl*/,
		M6/*processEventHandler*/: IG$/*mainapp*/.$d.M6/*processEventHandler*/,
		M7a/*executeAction*/: IG$/*mainapp*/.$d.M7a/*executeAction*/,
		M7/*processRunEvents*/: IG$/*mainapp*/.$d.M7/*processRunEvents*/,
		_IIf/*customLoad*/: IG$/*mainapp*/.$d._IIf/*customLoad*/,
		_IP5/*cancelQuery*/: IG$/*mainapp*/.$d._IP5/*cancelQuery*/,
		M8/*contEventProc*/: IG$/*mainapp*/.$d.M8/*contEventProc*/,
		M9/*updateEventValue*/: IG$/*mainapp*/.$d.M9/*updateEventValue*/,
		_g1/*procParamValue*/: IG$/*mainapp*/.$d._g1/*procParamValue*/,
		_a/*getInputParams*/: IG$/*mainapp*/.$d._a/*getInputParams*/,
		M10/*processEvents*/: IG$/*mainapp*/.$d.M10/*processEvents*/,
		r_IB3/*exportToFile*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.r_IB3/*exportToFile*/,
		_1_p: IG$/*mainapp*/.$d._1_p,
		M8_/*stopEventProc*/: IG$/*mainapp*/.$d.M8_/*stopEventProc*/,
		_m/*getExportData*/: IG$/*mainapp*/.$d._m/*getExportData*/,
		Mm11/*validateSize*/: IG$/*mainapp*/.$d.Mm11/*validateSize*/,
		Mmlla/*validateSubSize*/: IG$/*mainapp*/.$d.Mmlla/*validateSubSize*/,
		disposeContent: IG$/*mainapp*/.$d.disposeContent,
		
		
	    
	    listeners: {
	    	afterrender: IG$/*mainapp*/.$d.afterrender,
	    	resize: IG$/*mainapp*/.$d.resize
	    }
	});
}
else
{
	IG$/*mainapp*/._IBf/*DashboardView*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	    "layout": "fit",
	    
	    entryLogin: function(thisobj)
		{
			thisobj.M1/*procRunDashboard*/.call(thisobj);
		},
		
		commitCode: function() {
			var me = this;
			return true;
		},
		
		refreshCode: function() {
			var me = this;
			me._dE/*dashboardEditor*/.refreshControl.call(me._dE/*dashboardEditor*/);
			me.M3/*layoutControls*/();
		},
		    
	    _ic/*initComponent*/: function(){
	    	var panel = this;
			panel.hiddenPkgs = [];
			panel._emode = 1;
			IG$/*mainapp*/.apply(this, {
				P1/*ActionEvents*/: {},
			    P2/*ControlDict*/: {},
			    P3/*ControlItems*/: [],
			    P3r/*RootControlItems*/: [],
			    initialized: false,
			    refreshmode: "F",
			    closable: true,
			    autoScroll:true,
			    collapseFirst:false,
				items: [
					{
						xtype: "container",
						html: "<div class='dashboard_cnt'><div class='dashboardview'></div></div>"
					}
				]
			});
			
			IG$/*mainapp*/._IBf/*DashboardView*/.superclass._ic/*initComponent*/.call(this);
		},
	    
		applyOption: IG$/*mainapp*/.$d.applyOption,
		M1/*procRunDashboard*/: IG$/*mainapp*/.$d.M1/*procRunDashboard*/,
		rs_M1/*procRunDashboard*/: IG$/*mainapp*/.$d.rs_M1/*procRunDashboard*/,
		showDummyInfo: IG$/*mainapp*/.$d.showDummyInfo,
		iC/*applyParameters*/: IG$/*mainapp*/.$d.iC/*applyParameters*/,
		M2/*parseEvents*/: IG$/*mainapp*/.$d.M2/*parseEvents*/,
		M3/*layoutControls*/: IG$/*mainapp*/.$d.M3/*layoutControls*/,
		cL/*changeLayout*/: IG$/*mainapp*/.$d.cL/*changeLayout*/,
		M3a/*parseScript*/: IG$/*mainapp*/.$d.M3a/*parseScript*/,
		M4/*parseLayout*/: IG$/*mainapp*/.$d.M4/*parseLayout*/,
		M5/*appendControl*/: IG$/*mainapp*/.$d.M5/*appendControl*/,
		M6/*processEventHandler*/: IG$/*mainapp*/.$d.M6/*processEventHandler*/,
		M7a/*executeAction*/: IG$/*mainapp*/.$d.M7a/*executeAction*/,
		M7/*processRunEvents*/: IG$/*mainapp*/.$d.M7/*processRunEvents*/,
		_IIf/*customLoad*/: IG$/*mainapp*/.$d._IIf/*customLoad*/,
		_IP5/*cancelQuery*/: IG$/*mainapp*/.$d._IP5/*cancelQuery*/,
		M8/*contEventProc*/: IG$/*mainapp*/.$d.M8/*contEventProc*/,
		M9/*updateEventValue*/: IG$/*mainapp*/.$d.M9/*updateEventValue*/,
		_g1/*procParamValue*/: IG$/*mainapp*/.$d._g1/*procParamValue*/,
		_a/*getInputParams*/: IG$/*mainapp*/.$d._a/*getInputParams*/,
		M10/*processEvents*/: IG$/*mainapp*/.$d.M10/*processEvents*/,
		r_IB3/*exportToFile*/: IG$/*mainapp*/._Ibb/*reportbase_jquery*/.r_IB3/*exportToFile*/,
		_1_p: IG$/*mainapp*/.$d._1_p,
		M8_/*stopEventProc*/: IG$/*mainapp*/.$d.M8_/*stopEventProc*/,
		_m/*getExportData*/: IG$/*mainapp*/.$d._m/*getExportData*/,
		Mm11/*validateSize*/: IG$/*mainapp*/.$d.Mm11/*validateSize*/,
		Mmlla/*validateSubSize*/: IG$/*mainapp*/.$d.Mmlla/*validateSubSize*/,
		
		
	    
	    listeners: {
	    	afterrender: IG$/*mainapp*/.$d.afterrender,
	    	resize: IG$/*mainapp*/.$d.resize
	    }
	});
}

if (window.Ext)
{
	IG$/*mainapp*/._IBF/*DashboardViewDlg*/ = $s.extend($s.window, {
		modal: true,
		
		"layout": {
			type: "fit",
			align: "stretch"
		},
		
		closable: true,
		resizable:false,
		width: 600,
		height: 500,
		
		m1$9/*confirmSetting*/: function() {
			var me = this;
			me.callback && me.callback.execute(["ok", me]);
			me.close();
		},
		
		initComponent : function() {
			var me = this;
			
			$s.apply(this, {
				items: [
					me.dmain
				]
			});
			IG$/*mainapp*/._IBF/*DashboardViewDlg*/.superclass.initComponent.apply(this, arguments);
		}
	});
}
else
{
	IG$/*mainapp*/._IBF/*DashboardViewDlg*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pbW, {
		modal: true,
		
		"layout": "fit",
		
		closable: true,
		resizable:false,
		width: 600,
		height: 500,
		
		m1$9/*confirmSetting*/: function() {
			var me = this;
			me.callback && me.callback.execute(["ok", me]);
			me.close();
		},
		
		_ic/*initComponent*/ : function() {
			var me = this;
			
			IG$/*mainapp*/.apply(this, {
				items: [
					me.dmain
				]
			});
			IG$/*mainapp*/._IBF/*DashboardViewDlg*/.superclass._ic/*initComponent*/.apply(this, arguments);
		}
	});
}
/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
* Licensed under the MIT License (LICENSE.txt).
*
* Version: 3.1.11
*
* Requires: jQuery 1.2.2+
*/

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.11',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $parent = $(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10);
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            offsetX = 0,
            offsetY = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail' in orgEvent ) { deltaY = orgEvent.detail * -1; }
        if ( 'wheelDelta' in orgEvent ) { deltaY = orgEvent.wheelDelta; }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY; }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        // * deltaMode 0 is by pixels, nothing to do
        // * deltaMode 1 is by lines
        // * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta = Math[ delta >= 1 ? 'floor' : 'ceil' ](delta / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));
window.IG$/*mainapp*/ = window.IG$/*mainapp*/ || {};

function RBar(owner) 
{
	this.D_/*createComponent*/(owner);
}

RBar.prototype = {
	D_/*createComponent*/: function(owner) {
		var me = this;
		me.owner = owner;
		me.html = $("<div class='m-datagrid-rhandle'></div>")
			.appendTo(owner.ctx)
			.bind("mousedown", function(ev) {
				me.ms = {x: ev.pageX, y: ev.pageY};
				me.sp = me.html.offset();
				me.spo = me.owner.ctx.offset();
				me.owner.resizeCol = true;
				me.regG.call(me, ev);
			});
		me.col = -1;
	},
	
	regG: function(ev) {
		var me = this,
			win = $("body");
		function mouseMove(ev) {
			var rhdlh = me.html[0],
				tx = {x: ev.pageX, y: ev.pageY},
				ms = me.ms,
				rx = (me.sp.left-me.spo.left) + (tx.x - ms.x);
			
			rhdlh.style["left"] = "" + (rx - 2) + "px";
		}
		function mouseUp(ev) {
			me.unRegG.call(me);
			me.ts = {x: ev.pageX, y: ev.pageY};
			me.moveCol.call(me, me.ts.x - me.ms.x, me.ts.y - me.ms.y);
			me.ms = null;
			me.owner.resizeCol = false;
		}
		me.mouseMove = mouseMove;
		me.mouseUp = mouseUp;
		
		win.bind("mousemove", mouseMove);
		win.bind("mouseup", mouseUp);
	},
	
	moveCol: function(mx, my) {
		var me = this,
			grd = me.owner;
		if (me.col > -1)
		{
			grd.moveCol.call(grd, me.col, mx, my);
		}
	},
	
	unRegG: function() {
		var me = this,
			win = $("body");
		win.unbind("mousemove", me.mouseMove);
		win.unbind("mouseup", me.mouseUp);
	}
}

IG$/*mainapp*/._IE3/*fontStyle*/ = {
	P_NONE: 0,
	P_BOLD: 1,
	P_ITALIC: 2,
	P_UNDERLINE: 4
};

IG$/*mainapp*/.cMa/*DataGridView*/ = function(config)
{
	var me = this,
		_ccache;
		
	me._browser = me.browser();
	_ccache = IG$/*mainapp*/._ccache = IG$/*mainapp*/._ccache || {};
	
	_ccache.colorcode = _ccache.colorcode || {};
	_ccache.tmeasure = _ccache.tmeasure || {};
	
	me.D_/*createComponent*/(config);
}

IG$/*mainapp*/.cMa/*DataGridView*/.prototype = {
	merge: function(_r, _default) {
		var k;
		
		for (k in _default) {
			_r[k] = _default[k];
		}
	},
	
	D_/*createComponent*/: function(config) {
		var me = this;
	
//		me.canvas = null;
//		me.owner = null;
//		me.ctx = null;
//		me.styles = null;
//		me.oY/*app_dataProvider*/ = null;
		me.mv = false; // check for thumb mouse down and thumb roller mouse action
		
		me._1/*scrollX*/ = 0;
		me._2/*scrollY*/ = 0;
		
		me._3/*fixedRow*/ = 0;
		me._4/*fixedCol*/ = 0;
		me._5/*treeCol*/ = -1;
		me._6/*treeRow*/ = -1;
//		me.treeData = null;
		
		me._7/*fixedRowHeight*/ = 0;
		me._8/*fixedRowWidth*/ = 0;
		
//		me.pad = null;
//		me.rows = null;
//		me.cols = null;
		
		me._9/*rowcount*/ = 0;
		me._a/*colcount*/ = 0;
		
		me._b/*twidth*/ = 0;
		me._c/*theight*/ = 0;
		
		me._d/*cwidth*/ = 0;
		me._e/*cheight*/ = 0;
		
		me.timer = 0;
		me.interval = 10;
	    me.delay = 250;
//	    me.preventDefault = true;
//	    me.stopDefault = false;
	    
	    me.styles = {};
	    me.cellcharts = [];
	    me._n/*freecellcharts*/ = [];
	    me.U_/*renderers*/ = [];
	    me.V_/*trenderers*/ = [];
	    
	    me.font = "sans";
		me.size = 13;
//		me.measurediv = null;
//		
//		me.I_/*regdata*/ = null;
//		me._G/*reghscroll*/ = null;
//		me._F/*regvscroll*/ = null;
		me.regv = false;
		me.regh = false;
//		me._Gt/*reghscrollthumb*/ = null;
//		me._Ft/*regvscrollthumb*/ = null;
		me._v/*scrollsize*/ = 13;
		me.selcolor = "#f8a084";
		
		me.mmax = 0;
		
		me.width = 0;
		me.height = 0;
		
		me.selectedItems = [];
		me.selectedRows = [];
		
		me._w/*haveGlobalEvent*/ = false;
		
		me._x/*isScrolling*/ = false;
		
		me._y/*isDragging*/ = false;
		
		me._f/*thumbbuttondown*/ = false;
		me._g/*thumbmouseStartX*/ = -1;
		me._h/*thumbmouseStartY*/ = -1;
		me._i/*thumbTimer*/ = -1;
		me._nh/*nhidden*/ = 0;
		
		me.buttondown = false;
		me._j/*mouseStartX*/ = -1;
		me._k/*mouseStartY*/ = -1;
		me._l/*scrollStartX*/ = 0;
		me._m/*scrollStartY*/ = 0;
		
		me._o/*mouseDownTimer*/ = -1;
		me._p/*mouseUpTimer*/ = -1;
// 		me.mouseUpRenderer = null;
		me.mouseAction = 0;
		me.mouseMode = 'select';
//		me.startRenderer = null;
//		me.prevRenderer = null;
		me.columnfill = false;
		me.treeIndent = 20;
		me.dtm = -1;
		me._z/*editable*/ = false;
		me._q/*enablecontextlmenu*/ = true;
//		me.columns = null;
		me.selectionmode = "cell";
		me._L/*loadingtimer*/ = -1;
//		me.template = null;
		me._Z/*invdata*/ = true;
		
		me._r/*columnresize*/ = true;
		
		me._s/*rendered*/ = false;
		me._t/*cs_x*/ = 1;
		me._u/*cs_y*/ = 1;
		
		if (config)
		{
			me.merge(me, config);
		}
	},
	
	onRender: function() {
		var me = this;
		// me._s/*rendered*/ = me.check_s/*rendered*/(me.owner[0]);
	},
	
	_d1/*doFilter*/: function() {
		var me = this,
			el = {
				menu: me.context
			},
			mdf = me._dfc.__af,
			cell = me.context.cell,
			fs = 0;
		
		if (me._dfc.f_opt.val() == "between")
		{
			if (me._dfc.sval1.val())
			{
				 me._dfc.sval2.focus();
			}
			else
			{
				fs = 1;
			}
		}
		else
		{
			if (me._dfc.sval1.val())
			{
				fs = 1;
			}
		}
		
		if (fs)
		{
			mdf[cell.c] = {
				op: me._dfc.f_opt.val(),
				val1: me._dfc.sval1.val(),
				val2: me._dfc.sval2.val()
			};
		}
		else
		{
			delete mdf[cell.c];
		}
		
		el.cmd = "cmd_run_filter".toUpperCase();
		el.menu.mdf = mdf[cell.c];
		
		me.l_/*fireEvent*/.call(me, "menu", el);
		me._df.hide();
	},
	
	initialize: function(owner) {
		var me = this,
			hscroll,
			vscroll,
			hend,
			vend,
			region,
			dmain;
		
		clearTimeout(me.timer);
		
		me.rhdls/*resizehandles*/ = [];
		
		me.owner = owner;
		
		if (me.ctx == null)
		{
			me.ctx = $('<div class="m-datagrid-container"></div>')
				.appendTo(owner);
			
			me.H_/*regdata_og*/ = $('<div class="m-datagrid-data"></div>')
				.appendTo(me.ctx);
			me.H_/*regdata_og*/[0].uid = 'H_/*regdata_og*/';
			
			me.I_/*regdata*/ = $('<div class="m-datagrid-data-bg"></div>')
				.appendTo(me.H_/*regdata_og*/);
			me.I_/*regdata*/[0].uid = 'I_/*regdata*/';
			

			me._G/*reghscroll*/ = $('<div class="m-datagrid-scroll m-datagrid-hscroll"></div>')
				.css({height: me._v/*scrollsize*/})
				.hide()
				.appendTo(me.ctx);
				
			hscroll = $('<div class="m-datagrid-track m-datagrid-track-h"></div>').appendTo(me._G/*reghscroll*/);

			me._Gt/*reghscrollthumb*/ = $('<div class="m-datagrid-scrollthumb m-datagrid-scrollthumb-h"></div>')
				.css({height: (me._v/*scrollsize*/), width: 20})
				.appendTo(hscroll);
				
			hend = $('<div class="m-datagrid-end m-datagrid-end-h">')
				.css({height: (me._v/*scrollsize*/), width: 5})
				.appendTo(me._Gt/*reghscrollthumb*/);
				
			me._F/*regvscroll*/ = $('<div class="m-datagrid-scroll m-datagrid-vscroll"></div>')
				.hide()
				.appendTo(me.ctx);
			
			vscroll = $('<div class="m-datagrid-track m-datagrid-track-v"></div>')
				.css({width: me._v/*scrollsize*/})
				.appendTo(me._F/*regvscroll*/);
			
			me._Ft/*regvscrollthumb*/ = $('<div class="m-datagrid-scrollthumb m-datagrid-scrollthumb-v"></div>')
				.css({width: (me._v/*scrollsize*/), height: 20})
				.appendTo(vscroll);
				
			vend = $('<div class="m-datagrid-end m-datagrid-end-v">')
				.css({width: (me._v/*scrollsize*/), height: 5})
				.appendTo(me._Ft/*regvscrollthumb*/);
			
			
			me.measurediv = $('<div class="m-datagrid-cell-measure"></div>')
				.appendTo($("body"));
			
			me.editor = $("<div class='m-datagrid-editor'></div>")
				.appendTo(me.ctx).hide();
//				
//			me.initializeDragDrop(me.ctx[0]);
			
			me.contextmenu = $("<ul class='contextMenu'></ul>")
				.appendTo(me.ctx);
			me.context = {
				menu: me.contextmenu	
			};
			
			if ($(owner).contextMenu && me.enablecontextmenu != false)
			{
				$(owner).contextMenu(me.context, new IG$/*mainapp*/._I3d/*callBackObj*/(me, me._X/*menuproc*/));
			}
		}
		
		if (!me._M/*loadingLayer*/)
		{
			me._M/*loadingLayer*/ = $("<div class='m-datagrid-loading-mask'><div class='m-datagrid-loading'><div class='m-datagrid-loading-indicator'></div></div></div>").appendTo(me.ctx).hide();
		}
		
		me._s/*rendered*/ = me.is_s/*rendered*/(me.owner);
		
		var nwidth, nheight;
		
		if (me._s/*rendered*/ == false)
		{
			var clone = $(me.owner).clone();
		    clone.css({
		        visibility:'hidden',
		        width : '',
		        height: '',
		        maxWidth : '',
		        maxHeight: ''
		    });
		    $('body').append(clone);
		    nwidth = clone.outerWidth();
		    nheight = clone.outerHeight();
		    clone.remove();
		}
		else
		{
			nwidth = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.ctx); // me.ctx.width();
			nheight = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.ctx); // me.ctx.height();
		}
		
		if (nwidth > 0 && nheight > 0)
		{
			me._d/*cwidth*/ = nwidth;
			me._e/*cheight*/ = nheight;
		}
		
		// console.log(me._d/*cwidth*/, me._e/*cheight*/);
		
		// me.ctx.lineWidth = 2;
	
		me._1/*scrollX*/ = 0;
		me._2/*scrollY*/ = 0;
		me.rows = [];
		me.cols = [];
		me.W_/*trenderers*/ = 0;
		me.X_/*canvasheight*/ = 0;
		
		if (!me.U_/*renderers*/)
		{
			me.U_/*renderers*/ = [];
		}
		
		me.pad = new IG$/*mainapp*/.cMa/*DataGridView*/.padding(2);
				
		me.cellcharts = [];
		me._n/*freecellcharts*/ = [];
		
		me.ctx.bind({
			touchstart: function(ev) {
				var dgrid = me;
				dgrid._A/*ontouchstart*/.call(dgrid, me, ev);
				return false;
			},
			touchend: function(ev) {
				var dgrid = me;
				dgrid._B/*ontouchend*/.call(dgrid, me, ev);
				return false;
			},
			touchmove: function(ev) {
				var dgrid = me;
				dgrid._C/*ontouchmove*/.call(dgrid, me, ev);
				return false;
			},
			mousedown: function(ev) {
				var dgrid = me;
				return dgrid.e_/*onmousedown*/.call(dgrid, me, ev);
			},
			dblclick: function(ev) {
				var dgrid = me;
				return dgrid._D/*onmousedblclick*/.call(dgrid, me, ev);
			},
			mousewheel: function(ev, delta) {
				ev.stopPropagation();
				ev.preventDefault();
				var dgrid = me;
				return dgrid._E/*mousewheel*/.call(dgrid, me, ev, delta);
			},
			selectstart: function() {
				return false;
			}
		});
		

		me._F/*regvscroll*/.bind({
			click: function(ev) {
				var dgrid = me;
				if (dgrid.mv == false)
				{
					dgrid._J/*onscrollmouseclick*/.call(dgrid, me, ev, "v");
				}
				return false;
			}
		});
		
		me._G/*reghscroll*/.bind({
			click: function(ev) {
				var dgrid = me;
				if (dgrid.mv == false)
				{
					dgrid._J/*onscrollmouseclick*/.call(dgrid, me, ev, "h");
				}
				return false;
			}
		});
		
		me._Ft/*regvscrollthumb*/[0].eventtarget = 'vertical';
		me._Ft/*regvscrollthumb*/.bind({
			mousedown: function(ev) {
				var dgrid = me;
				dgrid.mv = true;
				ev.stopPropagation();
				dgrid._H/*onthumbmousedown*/.call(dgrid, this, ev, "v");
				return false;
			},
			mouseup: function(ev) {
				var dgrid = me;
				// ev.stopPropagation();
				dgrid._I/*onthumbmouseup*/.call(dgrid, this, ev, "v");
				return;
			}
		});

		me._Gt/*reghscrollthumb*/[0].eventtarget = 'horizontal';
		
		me._Gt/*reghscrollthumb*/.bind({
			mousedown: function(ev) {
				var dgrid = me;
				dgrid.mv = true;
				dgrid._H/*onthumbmousedown*/.call(dgrid, this, ev, "h");
			},
			mouseup: function(ev) {
				var dgrid = me;
				dgrid._I/*onthumbmouseup*/.call(dgrid, this, ev, "h");
			}
		});
		
		me._df = "<div class='igc-dfilter-m'><div class='igc-dfilter-bg'></div>"
				+ "<div class='igc-dfilter'>"
				+ "<div class='flt-line flt-sep' id='cmd_filter'>" + IRm$/*resources*/.r1("B_SET_FILTER") + "</div>"
				+ "<div class='flt-line' id='cmd_asc'>" + IRm$/*resources*/.r1("B_ORDER_ASC") + "</div>"
				+ "<div class='flt-line' id='cmd_desc'>" + IRm$/*resources*/.r1("B_ORDER_DSC") + "</div>"
				+ "<div class='flt-line flt-sep' id='cmd_sort'>" + IRm$/*resources*/.r1("L_SORT_OPTION") + "</div>";
				
		
		if (window.ig$/*appoption*/ && window.ig$/*appoption*/.features && window.ig$/*appoption*/.features.gfilter)
		{
			me._df += "<div class='flt-line' id='b_filter'><span>" + IRm$/*resources*/.r1("L_FILTER_OPTION") + "</span><div class='flt-expand'></div></div>"
					+ "<div class='flt-block' id='d_filter'>"
					+ "<div class='flt-line-g'><span id='cl_flt'>Clear Filter</span><span id='r_flt'>Apply</span></div>"
					+ "<div class='flt-line' id='c_filter'></div>"
					+ "</div>";
		}
		
		me._df += "<div class='flt-line' id='b_fm'><span>" + IRm$/*resources*/.r1('L_FORMULA') + "</span><div class='flt-expand'></div></div>"
			+ "<div class='flt-block' id='d_fm'>"
			+ "<div class='flt-line-g'><span id='cl_fm'>Clear Formula</span><span id='r_fmt'>More</span></div>"
			+ "<div id='c_fm'>"
			+ "<ul>"
			+ "<li class='flt-line' id='t_sum'>" + IRm$/*resources*/.r1("F_STOT") + "</li>"
			+ "<li class='flt-line' id='t_avg'>" + IRm$/*resources*/.r1("F_AVG") + "</li>"
			+ "<li class='flt-line' id='t_min'>" + IRm$/*resources*/.r1("F_MIN") + "</li>"
			+ "<li class='flt-line' id='t_max'>" + IRm$/*resources*/.r1("F_MAX") + "</li>"
			+ "<li class='flt-line' id='t_rank'>" + IRm$/*resources*/.r1("F_RNK") + "</li>"
			+ "<li class='flt-line' id='t_pot'>" + IRm$/*resources*/.r1("F_P_TOT") + "</li>"
			+ "<li class='flt-line' id='t_cumul'>" + IRm$/*resources*/.r1("F_P_CUM") + "</li>"
			+ "<li class='flt-line' id='t_incr'>" + IRm$/*resources*/.r1("F_INC") + "</li>"
			+ "<li class='flt-line' id='t_diff'>" + IRm$/*resources*/.r1("F_DIFF") + "</li>"
			+ "</ul>"
			+ "</div>"
			+ "</div>";
				
		me._df += "<div class='flt-line' id='b_rank'><span>" + IRm$/*resources*/.r1("L_RANK_OPTION") + "</span><div class='flt-expand'></div></div>"
				+ "<div class='flt-block' id='d_rank'>"
				+ "<div class='flt-line' id='cmd_showall'>" + IRm$/*resources*/.r1("B_SHOW_ALL") + "</div>"
				+ "<div class='flt-line' id='cmd_top5'>" + (IRm$/*resources*/.r1("B_TOP") + " 5") + "</div>"
				+ "<div class='flt-line' id='cmd_top10'>" + (IRm$/*resources*/.r1("B_TOP") + " 10") + "</div>"
				+ "<div class='flt-line' id='cmd_btm5'>" + (IRm$/*resources*/.r1("B_BOTTOM") + " 5") + "</div>"
				+ "<div class='flt-line' id='cmd_btm10'>" + (IRm$/*resources*/.r1("B_BOTTOM") + " 10") + "</div>"
				+ "</div>"
				+ "<div class='flt-line flt-sep-top' id='cmd_remove'>" + IRm$/*resources*/.r1("B_REMOVE_PIVOT") + "</div>"
				+ "</div></div>";
		
		me._df = $(me._df)
			.appendTo(me.ctx).hide();
		
		dmain = $(".igc-dfilter", me._df);
		
		me._dfc = {
			dmain: dmain,
			t_sum: $("#t_sum", dmain),
			t_avg: $("#t_avg", dmain),
			t_min: $("#t_min", dmain),
			t_max: $("#t_max", dmain),
			t_rank: $("#t_rank", dmain),
			t_pot: $("#t_pot", dmain),
			t_cumul: $("#t_cumul", dmain),
			t_incr: $("#t_incr", dmain),
			t_diff: $("#t_diff", dmain),
			b_rank: $("#b_rank", dmain),
			d_rank: $("#d_rank", dmain),
			b_filter: $("#b_filter", dmain),
			d_filter: $("#d_filter", dmain),
			c_filter: $("#c_filter", dmain),
			cmd_filter: $("#cmd_filter", dmain),
			cmd_asc: $("#cmd_asc", dmain),
			cmd_desc: $("#cmd_desc", dmain),
			cmd_sort: $("#cmd_sort", dmain),
			cmd_top5: $("#cmd_top5", dmain),
			cmd_top10: $("#cmd_top10", dmain),
			cmd_btm5: $("#cmd_btm5", dmain),
			cmd_btm10: $("#cmd_btm10", dmain),
			cmd_showall: $("#cmd_showall", dmain),
			cmd_remove: $("#cmd_remove", dmain),
			r_flt: $("#r_flt", dmain),
			cl_flt: $("#cl_flt", dmain),
			cl_fm: $("#cl_fm", dmain),
			b_fm: $("#b_fm", dmain),
			d_fm: $("#d_fm", dmain),
			r_fmt: $("#r_fmt", dmain)
		};
		
		var m = $("<div><div class='igc-c-filter-op'><select id='f_opt'><option value='_like_'>" + IRm$/*resources*/.r1("L_F_LIKE") + "</option><option value='between'>" + IRm$/*resources*/.r1("L_F_BETWEEN") + "</option><option value='gt'>" + IRm$/*resources*/.r1("L_F_GT") + "</option><option value='lt'>" + IRm$/*resources*/.r1("L_F_LT") + "</option></select></div><div class='igc-c-filter-inp'><input type='text' name='sval1'></input><input type='text' name='sval2' style='display: none;'></input></div></div>").appendTo(me._dfc.c_filter);
		
		if (!window.Ext)
		{
			me._dfc.cmd_filter.hide();
		}
		
		me._dfc.f_opt = $("#f_opt", dmain);
		me._dfc.sval1 = $("[name=sval1]", dmain);
		me._dfc.sval2 = $("[name=sval2]", dmain);
		me._dfc.d_fm.hide();
		
		me._dfc.f_opt = $("#f_opt", dmain).bind("change", function(e) {
			var f = $(this).val();
			
			me._dfc.sval2[f == "between" ? "show" : "hide"]();
		});
		
		me._dfc.sval1.bind("keyup", function(e) {
			var keycode = e.which;
			
			if (keycode == 13)
			{
				me._d1/*doFilter*/.call(me);
			}
		});
		
		me._dfc.sval2.bind("keyup", function(e) {
			var keycode = e.which;
			
			if (keycode == 13)
			{
				me._d1/*doFilter*/.call(me);
			}
		});
		
		$.each(["cmd_asc", "cmd_desc", "cmd_sort", "cmd_top5", "cmd_top10", "cmd_btm5", "cmd_btm10", "cmd_showall", "cmd_remove", "cmd_filter", "r_flt", "cl_flt",
		        "cl_fm", "r_fmt", "t_sum", "t_avg", "t_min", "t_max", "t_rank", "t_pot", "t_cumul", "t_incr", "t_diff"], function(k, m) {
			me._dfc[m] && me._dfc[m].length && me._dfc[m].bind("click", function() {
				var el = {
						cmd: m.toUpperCase(),
						menu: me.context
					},
					mdf = me._dfc.__af,
					cell = me.context.cell,
					fs = 1;
				
				if (m == "r_flt")
				{
					if (me._dfc.f_opt.val() == "between")
					{
						if (!me._dfc.sval1.val() || !me._dfc.sval2.val())
						{
							fs = 0;
						}
					}
					else
					{
						if (!me._dfc.sval1.val())
						{
							fs = 0;
						}
					}
					
					if (fs)
					{
						mdf[cell.c] = {
							op: me._dfc.f_opt.val(),
							val1: me._dfc.sval1.val(),
							val2: me._dfc.sval2.val()
						};
					}
					else
					{
						return;
					}
					
					el.cmd = "cmd_run_filter".toUpperCase();
				}
				else if (m == "cl_flt")
				{
					delete mdf[cell.c];
					el.cmd = "cmd_run_filter".toUpperCase();
				}
				
				el.menu.mdf = mdf[cell.c];
				
				me.l_/*fireEvent*/.call(me, "menu", el);
				me._df.hide();
			});
		});
		
		me._dfc.b_filter.bind("click", function() {
			me._dfc.d_filter.toggle();
		});
		
		me._dfc.b_rank.bind("click", function() {
			me._dfc.d_rank.toggle();
		});
		
		me._dfc.b_fm.bind("click", function() {
			me._dfc.d_fm.toggle();
		});
		
		me._dfc.dmain.bind({
			"click": function(e) {
				e.stopPropagation();
			},
			"mousedown": function(e) {
				e.stopPropagation();
			},
			"mouseup": function(e) {
				e.stopPropagation();
			}
		});
		
		me._df.bind({
			"click": function(e) {
				e.stopPropagation();
				$(this).hide();
			},
			"mousedown": function(e) {
				e.stopPropagation();
				$(this).hide();
			},
			"mouseup": function(e) {
				e.stopPropagation();
				$(this).hide();
			}
		});
	},
	
	moveCol: function(colindex, dx, dy) {
		var me = this,
			col = me.cols[colindex];
			
		col.width = Math.max(col.width + dx, 50);
		
		me.redraw();
	},
	
	setLoading: function(visible) {
		var me = this;
		
		if (me._L/*loadingtimer*/ > -1)
		{
			clearTimeout(me._L/*loadingtimer*/);
			me._L/*loadingtimer*/ = -1;
		}
		if (visible == true)
		{
			me._M/*loadingLayer*/.show();
		}
		else
		{
			me._L/*loadingtimer*/ = setTimeout(function() {
				me._M/*loadingLayer*/.fadeOut();
			}, 500);
		}
	},
	
	_N/*endEdit*/: function(reason) {
	},
	
	initializeDragDrop: function(el) {
	},

	_O/*registerGlobalEvent*/: function(direction) {
		var owner = this;
		
		var __P/*globalMouseDown*/ = function(ev) {
			owner._P/*globalMouseDown*/.call(owner, ev, direction);
			return false;
		};
		
		var __Q/*globalMouseMove*/ = function(ev) {
			ev.stopPropagation();
			owner.mv = true;
			owner._Q/*globalMouseMove*/.call(owner, ev, direction);
			return false;
		};
		
		var __R/*globalMouseUp*/ = function(ev) {
			ev.stopPropagation();
			owner.mv = true;
			
			owner._R/*globalMouseUp*/.call(owner, ev, direction);
			$(document).unbind({
				mousedown: __P/*globalMouseDown*/,
				mousemove: __Q/*globalMouseMove*/,
				mouseup: __R/*globalMouseUp*/
			});
			return false;
		};
		
		this.ge = {
			mousedown: __P/*globalMouseDown*/,
			mousemove: __Q/*globalMouseMove*/,
			mouseup: __R/*globalMouseUp*/
		};
		
		$(document).bind({
			mousedown: __P/*globalMouseDown*/,
			mousemove: __Q/*globalMouseMove*/,
			mouseup: __R/*globalMouseUp*/
		});
	},
	
	_P/*globalMouseDown*/: function(ev, direction) {
	},
	
	_Q/*globalMouseMove*/: function(ev, direction) {
		var owner = this;
		ev.preventDefault();
		ev.stopImmediatePropagation();
		
		if (owner)
		{
			owner._S/*scrollHandler*/.call(owner, {x: ev.pageX, y: ev.pageY}, direction);
		}
	},
	
	_R/*globalMouseUp*/: function(ev, direction) {
		var owner = this;
		owner._x/*isScrolling*/ = false;
		owner._y/*isDragging*/ = false;
		
		owner.ge = null;
		
		setTimeout(function(){
			owner.mv = false;
		}, 50);
	},
	
	_S/*scrollHandler*/: function(pt, direction) {
		var owner = this,
			me = this,
			_F/*regvscroll*/ = me._F/*regvscroll*/,
			_G/*reghscroll*/ = me._G/*reghscroll*/,
			_Ft/*regvscrollthumb*/ = me._Ft/*regvscrollthumb*/,
			_Gt/*reghscrollthumb*/ = me._Gt/*reghscrollthumb*/,
			mx = pt.x - owner._g/*thumbmouseStartX*/,
			my = pt.y - owner._h/*thumbmouseStartY*/,
			nsx = owner._1/*scrollX*/, nsy = owner._2/*scrollY*/,
			rh = (owner._c/*theight*/ - owner._e/*cheight*/) / (owner._e/*cheight*/ - owner._7/*fixedRowHeight*/),
			rw = (owner._b/*twidth*/ - owner._d/*cwidth*/) / (owner._d/*cwidth*/ - owner._8/*fixedRowWidth*/),
			__tw, __th;
			
		if (me.__scr)
			return;
		
		if (direction == 'v')
		{
			__th = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(_F/*regvscroll*/);
			nsy = Math.min(__th - me.thumbvheight, Math.max(0, owner.sy + my));
		}
		else
		{
			__tw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(_G/*reghscroll*/);
			nsx = Math.min(__tw - me.thumbhwidth, Math.max(0, owner.sx + mx));
		}
		
		if (owner._1/*scrollX*/ != nsx || owner._2/*scrollY*/ != nsy)
		{
			owner._1/*scrollX*/ = nsx;
			owner._2/*scrollY*/ = nsy;
			
			owner.t_/*updateThumbPosition*/.call(owner);
			
			if (owner._i/*thumbTimer*/ > -1)
			{
				clearTimeout(owner._i/*thumbTimer*/);
			}
			
			owner._i/*thumbTimer*/ = setTimeout(function() {
				owner.on_i/*thumbTimer*/.call(owner);
			}, 30);
		}
	},
	
	cR/*calculateTreeHeight*/: function() {
		var i, 
			tparent, 
			tcell, 
			me = this, r,
			visible;
			
		if (this._5/*treeCol*/ > -1)
		{
			if (this._5/*treeCol*/ > -1)
			{
				me._c/*theight*/ = 0;
				for (i=0; i < me.treeData.length; i++)
				{
					tcell = me.treeData[i][me._5/*treeCol*/];
					tparent = tcell.parent;
					r = me.rows[i];
					visible = true;
					while (tparent)
					{
						if (tparent.treeinfo && tparent.treeinfo.opened !== true)
						{
							visible = false;
							break;
						}
						tparent = tparent.parent;
					}
					if (visible == true)
					{
						me._c/*theight*/ += r.height + me._u/*cs_y*/;
					}
				}
			}
			
			if (this._6/*treeRow*/ > -1)
			{
				
			}
			
			me.H_/*regdata_og*/.css({height: me._e/*cheight*/});
		}
	},
	
	_T/*addCellChart*/: function(value, mx, my, w, h, renderer) {
		var me = this,
			c = $('<div></div>')
				.appendTo(renderer)
				.css({ 
					position: 'absolute', 
					margin:0, 
					padding:0, 
					left:0, 
					top: 0, 
					width: w, 
					height: h
				})
				.show();
		
		var opt = {defaultPixelsPerValue: parseInt(w / value.chartData.elementdata.length)},
			chartData = value.chartData,
			series = chartData.seriesdata;
			
		if (series && series.length > 0 && series[0].data.length > 0)
		{
//			{name: "Percent gauge", value: 0},
//			{name: "Balloon", value: 1},
//			{name: "Area", value: 2},
//			{name: "Line", value: 3},
//			{name: "Column", value: 4},
//			{name: "Bar", value: 5},
//			{name: "100% Bar", value: 6},
//			{name: "WinLose", value: 7},
//			{name: "Pie", value: 8}
			
			opt.type = "line"; // "bar", "tristate", "discrete", "bullet", "pie", "box"
			
			IG$/*mainapp*/.D_1/*microcharttype*/(chartData, opt);
			
			opt.defaultPixelsPerValue = parseInt(w / (series[0].data.length));
			
			if (opt.defaultPixelsPerValue - series[0].data.length > 2)
			{
				opt.barWidth = opt.defaultPixelsPerValue - series[0].data.length;
			}
			
			opt.width = parseInt(w);
			opt.height = parseInt(h); 
			opt.tooltipFormat = '{{offset:offset}} {{y:val}}'; //{{value}}';
			opt.tooltipValueLookups = {
				offset: series[0].element
			};
			opt.xvalues = chartData.element;
		}
		
		c.sparkline((series && series.length > 0) ? series[0].data : [], opt);
	
		me.cellcharts.push(c);
		
		return c;
	},
	
	_U/*clearCellChart*/: function() {
		var i, 
			me = this, 
			cellcharts = me.cellcharts,
			cell;
		
		for (i=cellcharts.length-1; i>=0; i--)
		{
			cell = cellcharts.pop();
			cell.hide();
			me._n/*freecellcharts*/.push(cell);
		}
	},
	
//	_V/*getMenus*/: function(cell) {
//		var r = null;
//		if (cell.title == 1)
//		{
//			if (cell.position == 4)
//			{
//				r = [];
//			}
//			else if (cell.position == 1 || cell.position == 2)
//			{
//				r = [
//				    {
//				    	disp: IRm$/*resources*/.r1("B_SET_FILTER"),
//				    	name: "CMD_FILTER"
//				    },
//				    {
//				    	disp: IRm$/*resources*/.r1("B_ORDER_ASC"),
//				    	name: "CMD_ASC",
//				    	"class": "separator"
//				    },
//				    {
//				    	disp: IRm$/*resources*/.r1("B_ORDER_DSC"),
//				    	name: "CMD_DESC"
//				    }
//				];
//				
//				if (!window.Ext)
//				{
//					r.splice(0, 1);
//				}
//			}
//			else
//			{
//				r = [];
//			}
//			
//			if (cell.position == 3)
//			{
//				r.push({
//					disp: IRm$/*resources*/.r1("B_TOP") + " 5",
//					name: "CMD_TOP5",
//					"class": "separator"
//				});
//				r.push({
//					disp: IRm$/*resources*/.r1("B_TOP") + " 10",
//					name: "CMD_TOP10"
//				});
//				r.push({
//					disp: IRm$/*resources*/.r1("B_BOTTOM") + " 5",
//					name: "CMD_BTM5"
//				});
//				r.push({
//					disp: IRm$/*resources*/.r1("B_BOTTOM") + " 10",
//					name: "CMD_BTM10"
//				});
//				r.push({
//					disp: IRm$/*resources*/.r1("B_SHOW_ALL"),
//					name: "CMD_SHOWALL"
//				});
//			}
//			r.push({
//		    	disp: IRm$/*resources*/.r1("B_REMOVE_PIVOT"),
//		    	name: "CMD_REMOVE",
//		    	"class": "separator"
//		    });
//		}
//		return r;
//	},
	
	_V/*getMenus*/: function(cell) {
		var active = 0,
			mitems = {};
			
		if (cell.title == 1)
		{
			if (cell.position == 1 || cell.position == 2)
			{
				if (window.Ext)
				{
					mitems["cmd_filter"] = 1;
				}
				mitems["cmd_asc"] = 1;
				mitems["cmd_desc"] = 1;
				mitems["cmd_sort"] = 1;
				mitems["b_filter"] = 1;
				active = 1;
			}
			
			if (cell.position == 3)
			{
				mitems["b_rank"] = 1;
				mitems["b_filter"] = 2;
				active = 1;
			}
			
			mitems["cmd_remove"] = 1;
		}
		
		
		return {
			active: active,
			items: mitems
		};
	},
	
	_W/*prepMenu*/: function(menus) {
		var me = this,
			i,
			contextmenu = me.contextmenu;
		
		contextmenu.html("");
		for (i=0; i < menus.length; i++)
		{
			contextmenu.append($("<li" + (menus[i]["class"] ? " class='" + menus[i]["class"] + "'": "") + "><a href='#" + menus[i].name + "'>" + menus[i].disp + "</a></li>"));
		}
	},
	
	_X/*menuproc*/: function(el) {
		var me = this;
		me.l_/*fireEvent*/('menu', el);
	},
	
	setDataProvider: function(value, refresh, hidden_columns) {
		var i,
			j,
			text,
			s,
			cell = null,
			pwidth,
			pheight,
			trsize,
			ptext,
			me = this,
			sw, sh, cellstyle,
			vs, brow, k, kval,
			row,
			n1, n2, n;
		
		me._Y/*dataProvider*/ = value;
		
		if (me.__tpstart == 0)
		{
			me._1/*scrollX*/ = 0;
			me._2/*scrollY*/ = 0;
		}
		else
		{
			vs = false;
		}
		me._Z/*invdata*/ = true;
		
		me._N/*endEdit*/();
		
		me.oY/*app_dataProvider*/ = me._Y/*dataProvider*/;
		
		if (this._5/*treeCol*/ > -1 || this._6/*treeRow*/ > -1)
		{
			me.stT/*refreshTree*/();
			me._9/*rowcount*/ = me.treeData.length;
		}
		else
		{
			me._9/*rowcount*/ = me.oY/*app_dataProvider*/.length;
		}
		
		if (me._9/*rowcount*/ > 0)
		{
			me._a/*colcount*/ = me.oY/*app_dataProvider*/[0].length;
		}
		
		if (me._9/*rowcount*/ < me.rows.length)
		{
			me.rows.splice(me._9/*rowcount*/, me.rows.length - me._9/*rowcount*/);
			for (i=0; i < me.rows.length; i++)
			{
				me.rows[i].init();
			}
		}
		else
		{
			for (i=0; i < me.rows.length; i++)
			{
				me.rows[i].init();
			}
			for (i=me.rows.length; i < me._9/*rowcount*/; i++)
			{
				me.rows.push(new IG$/*mainapp*/.cMa/*DataGridView*/.DimInfo(i));
			}
		}
		
		if (me._a/*colcount*/ < me.cols.length)
		{
			me.cols.splice(me._a/*colcount*/, me.cols.length - me._a/*colcount*/);
			for (i=0; i < me.cols.length; i++)
			{
				me.cols[i].init();
			}
		}
		else
		{
			if (me.cols.length == me._a/*colcount*/ && vs === false)
			{
				// scrolling... ignore action
			}
			else
			{
				for (i=0; i < me.cols.length; i++)
				{
					me.cols[i].init();
				}
				
				for (i=me.cols.length; i < me._a/*colcount*/; i++)
				{
					me.cols.push(new IG$/*mainapp*/.cMa/*DataGridView*/.DimInfo(i));
				}
			}
		}
		
		me.hidden_columns = hidden_columns;
		me._nh/*nhidden*/ = 0;
		
		if (hidden_columns && hidden_columns.length)
		{
			for (i=0; i < hidden_columns.length; i++)
			{
				if (me.cols[hidden_columns[i]])
				{
					if (hidden_columns[i] < me._4/*fixedCol*/)
					{
						me._nh/*nhidden*/++;
					}
					me.cols[hidden_columns[i]].visible = false;
				}
			}
		}
		
		me._7/*fixedRowHeight*/ = 0;
		me._c/*theight*/ = 0;
				
		pwidth = me.pad.paddingLeft + me.pad.paddingRight;
		pheight = me.pad.paddingTop + me.pad.paddingBottom;
		
		trsize = {};
		var gdatarow;
		for (i=0; i < me._9/*rowcount*/; i++)
		{
			if (me._5/*treeCol*/ > -1 || me._6/*treeRow*/ > -1)
			{
				gdatarow = me.treeData[i];
			}
			else
			{
				gdatarow = me.oY/*app_dataProvider*/[i];
			}
			gdatarow && gdatarow.length && me.J_/*validateRowSize*/(me.rows[i], gdatarow, trsize);
		}
		
		trsize = null;
		
		if (refresh !== false)
		{
			me.t_/*updateThumbPosition*/.call(me);
			me.redraw(vs);
		}
		me.__scr = 0;
	},
	
	J_/*validateRowSize*/: function(grows, gdatarow, trsize) {
		var me = this,
			j, cell, sw, sh, s, cellstyle, pwidth, pheight,
			treeinfo;
			
		for (j=0; j < me._a/*colcount*/; j++)
		{
			cell = gdatarow[j];
			if (!cell)
				continue;
			cell.menus = me._V/*getMenus*/(cell);
			text = cell.text;
			if (cell.chart && cell.chart.chartData)
			{
				s = {width: cell.chart.chartData.w || 40, height: cell.chart.chartData.h || 30};
				sw = s.width; sh = s.height;
			}
			else
			{
				cellstyle = (cell.stylename ? me.styles[cell.stylename] : null);
				
				if (cell.position != 9 && trsize[text])
				{
					s = trsize[text];
				}
				else
				{
					s =  me.u_/*measureTextSize*/(me.font, me.size, text, cellstyle);
					s.width = Math.max(s.width, cell.position == 9 ? 20 : 80);
					trsize[text] = {width: s.width, height: s.height};
				}
				
				sw = s.width; sh = s.height;
				if (!s.fw)
				{
					treeinfo = cell.treeinfo;
					
					if (me._5/*treeCol*/ > -1 && j == me._5/*treeCol*/)
					{
						// cell.children && cell.children > 0
						sw += 16 + (treeinfo && treeinfo.depth && !treeinfo.nd ? treeinfo.depth * me.treeIndent : 0);
					}
					else if (me._6/*treeRow*/ > -1 && cell.haschild === true)
					{
						sw += 16;
					}
					else if (treeinfo)
					{
						treeinfo.depth = treeinfo.depth || 0;
						sw += 16 + (treeinfo.nd ? 0 : treeinfo.depth * me.treeIndent);
					}
				}
			}
			
			if (!s.fw && cell.menus && cell.menus.active)
			{
				sw += 16;
			}
			
			if (cellstyle)
			{
				pwidth = cellstyle.padleft + cellstyle.padright;
				pheight = cellstyle.padtop + cellstyle.padbottom;
			}
			else
			{
				pwidth = me.pad.paddingLeft + me.pad.paddingRight;
				pheight = me.pad.paddingTop + me.pad.paddingBottom;
			}

			cell.tex_b/*twidth*/ = sw;
			cell.tex_c/*theight*/ = sh;
			// s.width += pwidth;
			// s.height += pheight; 
			me.cols[j].width = s.fw ? s.fw_ : (me.cols[j].fw ? me.cols[j].width : Math.max(me.cols[j].width, sw + pwidth));
			me.cols[j].fw = (s.fw) ? 1 : me.cols[j].fw;
			grows.height = Math.max(grows.height, sh + pheight);
		}
	},
	
	K_/*refreshData*/: function() {
		var me = this,
			_1/*scrollX*/ = me._1/*scrollX*/,
			_2/*scrollY*/ = me._2/*scrollY*/;
		me.setDataProvider(me._Y/*dataProvider*/, false, me.hidden_columns);
		me._1/*scrollX*/ = _1/*scrollX*/;
		me._2/*scrollY*/ = _2/*scrollY*/;
		me.redraw(false);
	},
	
	redraw: function(vscroll) {
		var me = this,
			i,
			sch,
			__tw, __th;
		
		if (me.__tpstart > 0 || me.__trow > me._9/*rowcount*/)
		{
			for (i=0; i < me._3/*fixedRow*/; i++)
			{
				me._7/*fixedRowHeight*/ += me.rows[i].height;
				me._c/*theight*/ += me.rows[i].height + me._u/*cs_y*/;
			}
			
			me._tsh = (me.rows.length > me._3/*fixedRow*/) ? me.rows[me._3/*fixedRow*/].height + me._u/*cs_y*/ : 21;
			sch = (me._tsh) * (me.__trow - me._3/*fixedRow*/);
			me._c/*theight*/ += sch;
		}
		else
		{
			for (i=0; i < me._9/*rowcount*/; i++)
			{
				if (i < me._3/*fixedRow*/)
				{
					me._7/*fixedRowHeight*/ += me.rows[i].height;
				}
				
				if (me.rows[i].vcr != false)
				{
					me._c/*theight*/ += me.rows[i].height + me._u/*cs_y*/;
					if (me.template && me.oY/*app_dataProvider*/[i][0].expanded == true && me.oY/*app_dataProvider*/[i][0].template)
					{
						__th = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.oY/*app_dataProvider*/[i][0].template);
						me._c/*theight*/ += __th;
					}
				}
			}
		}
		
		if (vscroll !== false)
		{
			me._F/*regvscroll*/.hide();
			me._G/*reghscroll*/.hide();
			me.regv = false;
			me.regh = false;
		}
		
		me.N_/*calculateTSize*/();
		
		me.cR/*calculateTreeHeight*/();
		
		me.L_/*initDraw*/(vscroll === false ? true : undefined);
		me.draw();
	},
	
	plog: function(msg, start) {
		var m = start ? new Date().getTime() : this.m_t,
			e = new Date().getTime();
		this.m_t = start ? m : this.m_t;
		
		console.log(msg + ">> " + (e-m));
	},
	
	L_/*initDraw*/: function(showvertical) {
		var thumbsize, // adjust scroll visibilitity;
			fw = 0,
			fh = 0,
			me = this,
			i,
			agap = 0,
			c = 0;
			
		me.sh = 1,
		me.sv = 1;
		
		if (me._browser < 8 && me._d/*cwidth*/ > 0 && me._e/*cheight*/ > 0)
		{
			me.ctx.width(me._d/*cwidth*/).height(me._e/*cheight*/);
		}
		
		for (i=0; i < me.cols.length; i++)
		{
			if (me.cols[i].visible !== false)
			{
				c++;
			}
		}
		
		if (me._b/*twidth*/ < me._d/*cwidth*/ && me.columnfill == true && c > 0)
		{
			if (me.showlnum)
			{
				if (c > 1)
				{
					agap = (me._d/*cwidth*/ - me._b/*twidth*/ - (showvertical == true ? me._v/*scrollsize*/ : 0)) / (c - 1);
				}
			}
			else
			{
				agap = (me._d/*cwidth*/ - me._b/*twidth*/ - (showvertical == true ? me._v/*scrollsize*/ : 0)) / c;
			}
			
			for (i=0; i < me._a/*colcount*/; i++)
			{
				if (me.showlnum && i == 0)
				{
				}
				else
				{
					me.cols[i]._d/*cwidth*/ = agap;
				}
			}
		}
		else
		{
			for (i=0; i < me._a/*colcount*/; i++)
			{
				me.cols[i]._d/*cwidth*/ = 0;
			}
		}
		
		for (i=0; i < Math.min(me._4/*fixedCol*/, me._a/*colcount*/); i++)
		{
			if (me.cols[i].visible !== false)
			{
				fw += me.cols[i].width + me.cols[i]._d/*cwidth*/ + 2;
			}
		}
		
		for (i=0; i < me._3/*fixedRow*/; i++)
		{
			fh += me.rows[i].height + 1;
		}
		
		me._7/*fixedRowHeight*/ = fh;
		me._8/*fixedRowWidth*/ = fw;
		if (fw > me._d/*cwidth*/)
		{
			me._8/*fixedRowWidth*/ = fw = 0;
			me._4/*fixedCol*/ = 0;
		}
		
		me.M_/*updateRegion*/();
	},
	
	M_/*updateRegion*/: function() {
		var me = this;
		me.H_/*regdata_og*/.css({left: 0, top: 0, width: me._d/*cwidth*/, height: me._e/*cheight*/});
	},
	
	resize: function(w, h) {
		var me = this;
		
		if (w > 0 && h > 0)
		{
			me._d/*cwidth*/ = w;
			me._e/*cheight*/ = h;
			
			me._F/*regvscroll*/.hide();
			me.regv = false;
			me.L_/*initDraw*/(false);
		
			me.draw();
		}
	},
	
	draw: function() {
		var me = this,
			qc;
		
		if (me.dtm > -1)
		{
			clearTimeout(me.dtm);
		}
		
		me.P_/*calcContentArea*/();
		qc = me.Qc/*check_request*/();
		
		me.__scr = (qc.r == 2 ? 1 : 0);
				
		me.dtm = setTimeout(function() {
			me.dtm = -1;
			me.Q_/*draw_async*/.call(me, qc);
			
		}, 5);
	},
	
	cS/*countSubNode*/: function(row, dpindex) {
		var me = this,
			tc = me._5/*treeCol*/,
			tr = me._6/*treeRow*/,
			i,
			r = 1, n, hchild = false;
		
		n = me.treeData.length;
		
		for (i=0; i < row.length; i++)
		{
			row[i].dr = n;
		}
		
		me.treeData.push(row);

		if (row[tc].children && row[tc].children.length > 0)
		{
			for (i=0; i < row[tc].children.length; i++)
			{
				r += me.cS/*countSubNode*/(row[tc].children[i], dpindex);
			}
		}
		
		return r;
	},
	
	stT/*refreshTree*/: function() {
		var me = this,
			_9/*rowcount*/,
			i, 
			j;
		
		if (this._5/*treeCol*/ > -1 || this._6/*treeRow*/ > -1)
		{
			_9/*rowcount*/ = 0;
			me.treeData = [];
			
			if (me.oY/*app_dataProvider*/)
			{
				for (i=0; i < me.oY/*app_dataProvider*/.length; i++)
				{
					_9/*rowcount*/ += me.cS/*countSubNode*/(me.oY/*app_dataProvider*/[i], i);
				}
			}
		}
	},
	
	N_/*calculateTSize*/: function() {
		var me = this,
			i;
		
		me._b/*twidth*/ = 0;
		me._8/*fixedRowWidth*/ = 0;
		
		for (i=0; i < me._a/*colcount*/; i++)
		{
			if (me.cols[i].visible !== false)
			{
				if (i < me._4/*fixedCol*/)
				{
					me._8/*fixedRowWidth*/ += me.cols[i].width + me.cols[i]._d/*cwidth*/ + 2;
				}
				
				me._b/*twidth*/ += me.cols[i].width + me._t/*cs_x*/ + 2; // + me.cols[i]._d/*cwidth*/;
			}
		}
	},
	
	O_/*updatetreeColumn*/: function() {
		var me = this,
			i, j,
			_4/*fixedCol*/ = me._4/*fixedCol*/,
			_3/*fixedRow*/ = me._3/*fixedRow*/,
			row, collapsed, pcell;
		
		row = me.treeData[me._3/*fixedRow*/ - 1];
		
		for (i=1; i < _3/*fixedRow*/; i++)
		{
			me.rows[i].visible = false;
		}
		
		for (j=_4/*fixedCol*/; j < me._a/*colcount*/; j++)
		{
			collapsed = false;
			
			//if (row[j].haschild !== true)
			//{
				pcell = row[j].parent;
				
				while (pcell)
				{
					if (pcell.treeinfo.opened !== true)
					{
						collapsed = true;
						break;
					}
					pcell = pcell.parent;
				}
			//}
			if (row[j].haschild === true && row[j].depth > -1 && row[j].treeinfo.opened === true && row[j].depth < me._3/*fixedRow*/ && collapsed == false)
			{
				me.rows[row[j].depth+1].visible = true;
			}
			me.cols[j].visible = !collapsed;
		}
		
		var fw = 0,
			fh = 0;
		
		me.sh = 1;
		me.sv = 1;
		
		me.N_/*calculateTSize*/();
		
		for (i=0; i < me._3/*fixedRow*/; i++)
		{
			if (me.rows[i].visible !== false)
			{
				fh += me.rows[i].height;
			}
		}
		
		if (fh != me._7/*fixedRowHeight*/)
		{
			me._c/*theight*/ = me._c/*theight*/ - me._7/*fixedRowHeight*/ + fh;
			me._7/*fixedRowHeight*/ = fh;
		}
		
		fw = me._8/*fixedRowWidth*/;
		
		if (fw > me._d/*cwidth*/)
		{
			me._8/*fixedRowWidth*/ = fw = 0;
			me._4/*fixedCol*/ = 0;
		}
		
		// me.I_/*regdata*/.css({left: 0, top: 0, width: me._d/*cwidth*/, height: me._c/*theight*/});
		me.M_/*updateRegion*/();
		
		me.P_/*calcContentArea*/();
		
		_2/*scrollY*/ = me._2/*scrollY*/ / me.sv;
		_1/*scrollX*/ = me._1/*scrollX*/ / me.sh;
	},
	
	P_/*calcContentArea*/: function() {
		var me = this,
			i, _b/*twidth*/=0, _8/*fixedRowWidth*/=0, _d/*cwidth*/=0,
			mr;
		
		for (i=0; i < me._a/*colcount*/; i++)
		{
			if (me.cols[i].visible !== false)
			{
				if (i < me._4/*fixedCol*/)
				{
					_8/*fixedRowWidth*/ += me.cols[i].width + me.cols[i]._d/*cwidth*/ + 2;
				}
				
				_b/*twidth*/ += me.cols[i].width + me.cols[i]._d/*cwidth*/ + 2;
				_d/*cwidth*/ += me.cols[i]._d/*cwidth*/;
			}
		}
		
		mr = (me._meas_rect) ? me._meas_rect.call(me, _d/*cwidth*/, me._c/*theight*/) : false;
		
		if (mr)
		{
			return;
		}
		
		me.sh = _d/*cwidth*/ > 0 ? 1 : (me._d/*cwidth*/ - _8/*fixedRowWidth*/) / (_b/*twidth*/ - _8/*fixedRowWidth*/);
		me.sv = (me._e/*cheight*/ - me._7/*fixedRowHeight*/) / (me._c/*theight*/ - me._7/*fixedRowHeight*/);
		
		if (me.sh < 1)
		{
			me.sv = (me._e/*cheight*/ - me._7/*fixedRowHeight*/ - me._v/*scrollsize*/) / (me._c/*theight*/ - me._7/*fixedRowHeight*/);
		}
		if (me.sv < 1)
		{
			me.sh = (me._d/*cwidth*/ - _8/*fixedRowWidth*/ - (_d/*cwidth*/ - me._v/*scrollsize*/ > 0 ? 0 : me._v/*scrollsize*/)) / (_b/*twidth*/ - _8/*fixedRowWidth*/);
		}
	},
	
	Qc/*check_request*/: function() {
		var me = this,
			r = 0,
			ts3,
			nrow,
			_2/*scrollY*/ = me._2/*scrollY*/ / me.sv;
			
		if (me.__tpstart > 0 || me.__trow > me._9/*rowcount*/)
		{
			if (me.__tpstart > 0 && me.__scr && me.__scr_a)
			{
				_2/*scrollY*/ = me.__scr_a._2/*scrollY*/;
			}
			
			// pagemode : check for request data
			nrow = Math.ceil(_2/*scrollY*/ / me._tsh);
			ts3 = nrow + Math.ceil((me._e/*cheight*/ - me._7/*fixedRowHeight*/) / me._tsh);
			if ((me.__tpstart > 0 && me.__tpstart > nrow) 
				|| (me.__trow > me.__tpend && me.__tpend < ts3))
			{
				if (me.__tpstart < me.__tpend || (me.__scr_a && me.__scr_a.nrow != nrow))
				{
					r = 2;
				}
				else
				{
					r = 1;
				}
			}
		}
		
		return {
			r: r,
			nrow: nrow
		};
	},
		
	Q_/*draw_async*/: function(qc) {
		var i,
			j,
			dx,
			dy,
		
			skipx,
			skipy,
		
			gapx,
			gapy,
			mgapx = 0,
			mgapy = 0,
			bdrawRow,
			rh,
			firstRow = -1,
			firstCol = -1,
			di = 0,
			dj = 0,
			mmrh,
			mmcw,
			bmaxwidth,
			skiprowcnt,
			tstyle, s,
			currentrow, _9/*rowcount*/, temprow, pheight, cell,
			me = this, _2/*scrollY*/, _1/*scrollX*/, cellparent,
			renderer, cmi, cmo, cmop,
			thumbcalc,
			nvisible,
			fvisible,
			flborder,
			__tw, __th,
			ts1, ts2, ts3,
			nrow = qc.nrow,
			dc = 0;
		
		// me.plog("--- start", true);
		
		for (i in me.styles)
		{
			j = me.styles[i];
			
			j.bordertop = Number(j.bordertop);
			j.borderbottom = Number(j.borderbottom);
			j.borderleft = Number(j.borderleft);
			j.borderright = Number(j.borderright);
			
			j.borderouttop = Number(j.borderouttop);
			j.borderoutbottom = Number(j.borderoutbottom);
			j.borderoutleft = Number(j.borderoutleft);
			j.borderoutright = Number(j.borderoutright);
		}
		
		me.R_/*validateRowHidden*/();
		
		// me.plog("pre_1");
				
		_2/*scrollY*/ = me._2/*scrollY*/ / me.sv;
		_1/*scrollX*/ = me._1/*scrollX*/ / me.sh;
		
		me.W_/*trenderers*/ = me.X_/*canvasheight*/ = 0;
		
		me.measurediv.show();
		
		me._U/*clearCellChart*/();
		
		me.c_/*drawBackground*/();
		
		if (qc.r == 2)
		{
			me.__scr_a = {
				nrow: nrow,
				_2/*scrollY*/: _2/*scrollY*/
			};
			me.l_/*fireEvent*/("scroll_request", nrow);
			
			return;
		}
		
		if (me.__tpstart > 0)
		{
			_2/*scrollY*/ -= me._tsh * me.__tpstart;
		}

		// me.plog("pre_2");
		
		dx = 0;
		dy = 0;
		skipy = 0;
		gapx = 0;
		gapy = 0;
		skiprowcnt = 0;
		
		// me.ctx.textBaseline = "top";
		
		if (me._6/*treeRow*/ > -1)
		{
			me.O_/*updatetreeColumn*/();
		}
		
		me.mmax = 0;
		
		for (i=0; i < me.V_/*trenderers*/.length; i++)
		{
			me.V_/*trenderers*/[i].hide();
		}
				
		_9/*rowcount*/ = me._9/*rowcount*/;
		
		if (me._5/*treeCol*/ > -1)
		{
			_9/*rowcount*/ = me.treeData.length;
		}
		
		pheight = me.pad.paddingTop + me.pad.paddingBottom;
		
		// me.plog("pre_3");
		
		for (i=0; i < _9/*rowcount*/; i++)
		{
			dx = 0;
			skipx = 0;
			gapx = 0;
			mgapx = 0;
			
			if (me._5/*treeCol*/ > -1)
			{
				currentrow = me.treeData[i];
			}
			else
			{
				currentrow = me.oY/*app_dataProvider*/[i];
			}
			
			if (i < me._3/*fixedRow*/)
			{
				bdrawRow = true;
				if (me.rows[i].visible === false)
				{
					bdrawRow = false;
				}
				else
				{
					rh = me.rows[i].height;
				}
			}
			else
			{
				bdrawRow = true;
				
				if (me._5/*treeCol*/ > -1)
				{
					me.rows[i]._5a/*treeCollapse*/ = false;
					cell = currentrow[me._5/*treeCol*/];
					cellparent = cell.parent
					while (cellparent)
					{
						if (cellparent.treeinfo && cellparent.treeinfo.opened !== true)
						{
							bdrawRow = false;
							break;
						}
						cellparent = cellparent.parent;
					}
					me.rows[i]._5a/*treeCollapse*/ = !bdrawRow;
				}
				
				if (currentrow && currentrow.length && currentrow[0].mcelltree && currentrow[0].mcelltree.length > 0)
				{
					for (cmi=0; cmi < currentrow[0].mcelltree.length; cmi++)
					{
						cmo = currentrow[0].mcelltree[cmi];
						if (currentrow[cmo].celltree && currentrow[cmo].celltree.parent)
						{
							cmop = currentrow[cmo].celltree.parent;
							while (cmop && bdrawRow == true)
							{
								if (cmop.celltree.opened == false)
								{
									bdrawRow = false;
								}
								cmop = cmop.celltree.parent;
							}
						}
						
						if (bdrawRow == false)
							break;
					}
				}
				
				if (bdrawRow == true && _2/*scrollY*/ > 0 && skipy + me.rows[i].height + me._u/*cs_y*/ < _2/*scrollY*/)
				{
					bdrawRow = false;
					skipy += me.rows[i].height + me._u/*cs_y*/;
					rh = 0;
					skiprowcnt ++;
				}
				else if (bdrawRow == true && _2/*scrollY*/ > 0 && skipy < _2/*scrollY*/)
				{
					gapy = (me.rows[i].height - (_2/*scrollY*/ - skipy));
					skipy += me.rows[i].height;
					rh = gapy;
					if (rh > 0)
					{
						bdrawRow = true;
					}
					else
					{
						bdrawRow = false;
						skiprowcnt++;
					}
				}
				else if (bdrawRow == true)
				{
					bdrawRow = true;
					rh = me.rows[i].height;
				}
			}
			
			if (bdrawRow == true)
			{
				if (firstRow < 0 || firstRow < me._3/*fixedRow*/)
					firstRow = me._3/*fixedRow*/;
					
				firstCol = -1;
				di = 0;
				dc = 0;
				
				dy += me._u/*cs_y*/;
								
				for (j=0; j < me._a/*colcount*/; j++)
				{
					if (!currentrow[j])
						continue;
					
					if (me.cols[j].visible === false)
					{
						dc++;
						continue;
					}
						
					var merge = currentrow[dc].merged;
					
					if (_1/*scrollX*/ > 0 && skipx < _1/*scrollX*/ && (firstCol < 0 || firstCol < (me._4/*fixedCol*/ - me._nh/*nhidden*/)))
					{
						firstCol = dc;
					}
					
					if (i > me._3/*fixedRow*/ && (i - skiprowcnt) == firstRow && (merge & 8))
						merge |= 1;
					else if ((dc == 0 || (dc - me._4/*fixedCol*/ + me._nh/*nhidden*/ > 0 && (dc - me._4/*fixedCol*/ + me._nh/*nhidden*/) == firstCol)) && (merge & 4))
						merge |= 2;
						
					mmrh = me.rows[i].height;
					mmcw = me.cols[dc].width + me.cols[dc]._d/*cwidth*/ + me._t/*cs_x*/;
					
					mgapy = gapy;
					
					bmaxwidth = false;
					fvisible = currentrow[dc].fvisible;
					flborder = currentrow[dc].flborder;
					
					if (merge & 1)
					{
						for (k=i + 1; k < _9/*rowcount*/; k++)
						{
							temprow = me[(me._5/*treeCol*/ > -1 || me._6/*treeRow*/ > -1) ? "treeData" : "_Y"/*dataProvider*/][k];
							if (!(temprow[dc].merged & 8))
							{
								break;
							}
							else if (me.rows[k].vcr == true)
							{
								if (temprow.length > dc+1)
								{
									temprow[dc+1].flborder = (merge & 2) ? true : false;
								}
								mmrh += me.rows[k].height + me._u/*cs_y*/;
								if (mgapy > 0)
								{
									mgapy += me.rows[k].height + me._u/*cs_y*/;
								}
							}
							
							if (mmrh + dy > me._e/*cheight*/)
							{
								break;
							}
						}
						
						if (merge & 2)
						{
							for (k=dc+1; k < me._a/*colcount*/; k++)
							{
								if (!(currentrow[k].merged & 4))
									break;
								else
								{
									currentrow[k].text = "";
									currentrow[k].fvisible = true;
								}
							}
						}
						// mmrh = Math.min(mmrh, me._e/*cheight*/ - dy);
						
					}
					else if (merge & 2)
					{
						for (k=dc+1; k < me._a/*colcount*/; k++)
						{
							if (!(currentrow[k].merged & 4))
								break;
							else if (me.cols[k].visible !== false)
								mmcw += me.cols[k].width + me.cols[k]._d/*cwidth*/ + me._t/*cs_x*/ + 1;
						}
						// mmcw -= 1;
						// mmcw = Math.min(mmcw, me._d/*cwidth*/ - dx);
						
						if (mmcw > me._d/*cwidth*/ - dx)
						{
							mmcw = me._d/*cwidth*/ - dx;
							bmaxwidth = true;
						}
						else
						{
							bmaxwidth = false;
						}
					}
					
					if (dc < me._4/*fixedCol*/)
					{
						if (merge == 0 || (merge & 1) || (merge & 2))
						{
							me.b_/*drawCell*/(dx, dy, i, dc, mgapx, mgapy, mmrh, mmcw, di, dj, currentrow, true, merge, flborder);
							di++;
						}
						else
						{
							me.b_/*drawCell*/(dx, dy, i, dc, mgapx, mgapy, mmrh, mmcw, di, dj, currentrow, false, merge, flborder);
							di++;
						}
						dx += me.cols[dc].width + me.cols[dc]._d/*cwidth*/ + me._t/*cs_x*/ + 1;
					}
					else
					{
						if (_1/*scrollX*/ > 0 && skipx + me.cols[dc].width + me.cols[dc]._d/*cwidth*/ < _1/*scrollX*/)
						{
							skipx += me.cols[dc].width + me.cols[dc]._d/*cwidth*/;
							firstCol = -1;
						}
						else if (_1/*scrollX*/ > 0 && skipx < _1/*scrollX*/)
						{
							gapx = (me.cols[dc].width + me.cols[dc]._d/*cwidth*/ - (_1/*scrollX*/ - skipx));
							if (bmaxwidth == false)
							{
								mgapx = (mmcw - (_1/*scrollX*/ - skipx));
							}
							else if (merge & 2)
							{
								mgapx = 0;
							}
							
							if (merge == 0 || (merge & 1) || (merge & 2) || fvisible == true)
							{
								me.b_/*drawCell*/(dx, dy, i, dc, mgapx, mgapy, mmrh, mmcw, di, dj, currentrow, true, merge, flborder);
								di++;
							}
							else
							{
								me.b_/*drawCell*/(dx, dy, i, dc, mgapx, mgapy, mmrh, mmcw, di, dj, currentrow, false, merge, flborder);
								di++;
							}
							
							skipx += me.cols[dc].width + me.cols[dc]._d/*cwidth*/ + me._t/*cs_x*/ + 1;
							dx += gapx;
							
							gapx = 0;
							mgapx = 0;
						}
						else
						{
							if (merge == 0 || (merge & 1) || (merge & 2) || fvisible == true)
							{
								me.b_/*drawCell*/(dx, dy, i, dc, 0, mgapy, mmrh, mmcw, di, dj, currentrow, true, merge, flborder);
								di++;
							}
							else
							{
								me.b_/*drawCell*/(dx, dy, i, dc, 0, mgapy, mmrh, mmcw, di, dj, currentrow, false, merge, flborder);
								di++;
							}
							dx += me.cols[dc].width + me.cols[dc]._d/*cwidth*/ + me._t/*cs_x*/ + 1;
						}
					}
					
					dc++;
					
					if (dx > me._d/*cwidth*/)
						break;
				}
				
				gapy = 0;
				dy += rh;
				
				if (me.template && currentrow[0].expanded == true && currentrow[0].template)
				{
					currentrow[0].template.css({top: dy});
					currentrow[0].template.show();
					dy += IG$/*mainapp*/.x_10/*jqueryExtension*/._h(currentrow[0].template); // .height();
				}
				
				if (me.U_/*renderers*/.length > dj && me.U_/*renderers*/[dj])
				{
					for (j=di; j < me.U_/*renderers*/[dj].length; j++)
					{
						if (me.U_/*renderers*/[dj][j].v !== false)
						{
							me.U_/*renderers*/[dj][j].hide();
							me.U_/*renderers*/[dj][j].v = false;
						}
					}
				}
				
				dj++;
				
				if (dy > me._e/*cheight*/)
					break;
			}
		}
		
		// me.plog("pre_4");
		
		for (i=dj; i < me.U_/*renderers*/.length; i++)
		{
			for (j=0; j < me.U_/*renderers*/[i].length; j++)
			{
				if (me.U_/*renderers*/[i][j].v !== false)
				{
					me.U_/*renderers*/[i][j].hide();
					me.U_/*renderers*/[i][j].v = false;
				}
			}
		}
		
		// me.plog("pre_5");
		
		// tstyle = {zIndex: me.mmax + 10, left: me._8/*fixedRowWidth*/};
		// tstyle.opacity = 0.4;
		if (me.sh < 1)
		{
			tstyle = {left: me._8/*fixedRowWidth*/};
			tstyle.width = me._d/*cwidth*/ - me._8/*fixedRowWidth*/ - (me.sv < 1 ? me._v/*scrollsize*/ : 0);
			me.thumbhwidth = tstyle.width * me.sh;

			thumbcalc = Math.max(30, tstyle.width * me.sh);
			me._G/*reghscroll*/.css(tstyle);
			me._G/*reghscroll*/.show();
			
			__tw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me._G/*reghscroll*/);
			me._Gt/*reghscrollthumb*/.css({left: Math.min(me._1/*scrollX*/, __tw - thumbcalc), width: thumbcalc});
			me.regh = true;
		}
		else
		{
			me.regh = false;
			me._G/*reghscroll*/.hide();
		}
		// tstyle = {zIndex: me.mmax + 11, top: me._7/*fixedRowHeight*/};
		
		// tstyle.opacity = 0.4;
		
		// me.plog("pre_6");

		if (me.sv < 1)
		{
			tstyle = {top: me._7/*fixedRowHeight*/};
			tstyle.height = me._e/*cheight*/ - me._7/*fixedRowHeight*/ - (me.sh < 1 ? me._v/*scrollsize*/ : 0);
			me.thumbvheight = tstyle.height * me.sv;

			thumbcalc = Math.max(30, tstyle.height * me.sv);
			__th = tstyle.height; // IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me._F/*regvscroll*/);
			me._Ft/*regvscrollthumb*/.css({top: Math.min(me._2/*scrollY*/, __th - thumbcalc), height: thumbcalc});

			me._F/*regvscroll*/.css(tstyle);
			if (!me.regv && me._b/*twidth*/ < me._d/*cwidth*/ && me.columnfill == true && me.cols.length > 0)
			{
				me._F/*regvscroll*/.show();
				me.regv = true;
				me.L_/*initDraw*/(true);
				me.draw();
				return;
			}
			else
			{
				me._F/*regvscroll*/.show();
				me.regv = true;
			}
		}
		else
		{
			if (me.regv && me._b/*twidth*/ < me._d/*cwidth*/ && me.columnfill == true && me.cols.length > 0)
			{
				me.regv = false;
				me._F/*regvscroll*/.hide();
				me.L_/*initDraw*/(false);
				me.draw();
				return;
			}
			else
			{
				me.regv = false;
				me._F/*regvscroll*/.hide();
			}
		}
		// me._Gt/*reghscrollthumb*/.css({zIndex: me.mmax + 12});
		// me._Ft/*regvscrollthumb*/.css({zIndex: me.mmax + 13});
		
		// me.plog("pre_7");
		
		me.measurediv.hide();
		
		me.I_/*regdata*/.width(me.W_/*trenderers*/+me._t/*cs_x*/).height(me.X_/*canvasheight*/+me._u/*cs_y*/);
		
		// create _r/*columnresize*/
		var rhdl,
			rhdls/*resizehandles*/ = me.rhdls/*resizehandles*/;
		if (me._r/*columnresize*/ == true && me._3/*fixedRow*/ > 0 && me.U_/*renderers*/.length > me._3/*fixedRow*/-1)
		{
			var	rhdlh, p, pbox,
				tx = me._3/*fixedRow*/ - 1,
				fheight = me._7/*fixedRowHeight*/,
				n = me.cols.length, // me.U_/*renderers*/[tx].length,
				rx = 0,
				ry = 0;
			
			for (i=0; i < n; i++)
			{
				if(!me.U_/*renderers*/[tx][i])
					continue;
				
				p = me.U_/*renderers*/[tx][i].p;
				if (rhdls/*resizehandles*/.length > i)
				{
					rhdl = rhdls/*resizehandles*/[i];
					rhdlh = rhdl.html[0];
				}
				else
				{
					rhdl = new RBar(me);
					rhdls/*resizehandles*/.push(rhdl);
					rhdlh = rhdl.html[0];
				}
				
				rhdl.col = i;
				
				rx = p[2];
				ry = 0;
				
				if (me._3/*fixedRow*/ > 1)
				{
					ry = 0;
					for (j=0; j < me._3/*fixedRow*/-1; j++)
					{
						if (me.U_/*renderers*/[j][i].v === false || me.U_/*renderers*/[j][i].cl.merged == 2)
						{
							pbox = me.U_/*renderers*/[j][i].p;
							ry += pbox[3] - pbox[1];
						}
					}
				}
				
				rhdlh.style["left"] = "" + (rx - 2) + "px";
				rhdlh.style["top"] = "" + ry + "px";
				rhdlh.style["height"] = "" + (fheight - ry) + "px";
				rhdl.html.show();
			}
			
			if (n < rhdls/*resizehandles*/.length)
			{
				for (i=n; i < rhdls/*resizehandles*/.length; i++)
				{
					rhdls/*resizehandles*/[i].html.hide();
				}
			}
		}
		else if (rhdls/*resizehandles*/ && rhdls/*resizehandles*/.length > 0)
		{
			for (i=0; i < rhdls/*resizehandles*/.length; i++)
			{
				rhdls/*resizehandles*/[i].html.hide();
			}
		}
		
		// me.plog("pre_9");
	},
	
	R_/*validateRowHidden*/: function() {
		var me = this,
			dp, r,
			i, j,
			v;
		
		if (me._Z/*invdata*/ == false)
		{
			return;
		}
		
		if (me._5/*treeCol*/ > -1)
		{
			dp = me.treeData;
		}
		else
		{
			dp = me.oY/*app_dataProvider*/;
		}
		
		if (dp)
		{
			for (i=0; i < dp.length; i++)
			{
				r = dp[i];
				
				if (i < me._3/*fixedRow*/)
				{
					v = true;
				}
				else
				{
					v = true;
					if (r && r.length > 0 && r[0].mcelltree && r[0].mcelltree.length > 0)
					{
						for (cmi=0; cmi < r[0].mcelltree.length; cmi++)
						{
							cmo = r[0].mcelltree[cmi];
							if (r[cmo].celltree && r[cmo].celltree.parent)
							{
								cmop = r[cmo].celltree.parent;
								while (cmop && v == true)
								{
									if (cmop.celltree.opened == false)
									{
										v = false;
									}
									cmop = cmop.celltree.parent;
								}
							}
						}
					}
				}
				
				me.rows[i].vcr = v;
			}
			me._Z/*invdata*/ = false;
		}
	},
	
	a_/*refreshSelection*/: function() {
		var i,
			j,
			renderer,
			bgc, bg,
			me = this,
			cl, cbg,
			selected;
			
		for (i=0; i < me.U_/*renderers*/.length; i++)
		{
			for (j=0; j < me.U_/*renderers*/[i].length; j++)
			{
				renderer = me.U_/*renderers*/[i][j];
				cl = renderer.cl;
				selected = cl/*cell*/.selected;
				if (me.selectionmode == "row" && me.rows[renderer.rowIndex].selected == true)
				{
					selected = true;
				}
				if (selected == true)
				{
					renderer.cssobj.background = this.selcolor;
					renderer.css({background: this.selcolor});
					renderer.addClass("m-datagrid-cell-selected");
				}
				else
				{
					cbg = renderer.cbg;
					bgc = (cbg/*cssobject*/) ? cbg/*cssobject*/ : 'rgb(255, 255, 255)';
					renderer.cssobj.background = bgc;
					renderer.css({background: bgc});
					renderer.removeClass("m-datagrid-cell-selected");
				}
			}
		}
	},
	
	b_/*drawCell*/: function(dx, dy, i, j, gapx, gapy, rowheight, colwidth, di, dj, currentrow, visible, merge, flborder) {
		var me = this,
			cell_t = i > 0 && me.oY/*app_dataProvider*/[i-1] ? me.oY/*app_dataProvider*/[i-1][j] : null,
			cell_b = me.oY/*app_dataProvider*/[i+1] ? me.oY/*app_dataProvider*/[i+1][j] : null,
			cell_l = j > 0 ? currentrow[j-1] : null,
			cell_r = currentrow[j+1],
			cell = currentrow[j],
			pcl,
			text = cell.text,
			stname = cell.stylename,
			tex_b/*twidth*/ = cell.tex_b/*twidth*/,
			tex_c/*theight*/ = cell.tex_c/*theight*/,
			cellstyle = me.styles[stname],
		
			cssobj = {},
			pcss = {},
			pcsskey,
			txtcss = {},
			
			tx = dx,
			ty = dy,
			rx = 0, ry=0,
			cellwidth = colwidth,
			cellheight = rowheight,
			h = (gapy > 0) ? gapy : rowheight,
			w = (gapx > 0) ? gapx : colwidth,
			scy = (gapy > 0) ? rowheight - gapy : 0,
			scx = (gapx > 0) ? colwidth - gapx : 0,
			renderer = null,
			trenderer = null,
			tcss,
			mcss,
			menu, 
			ficon,
			bg,
			istree = ((me._3/*fixedRow*/ < i + 1 && me._5/*treeCol*/ > -1 && j == me._5/*treeCol*/ && cell.treeinfo) || (me._3/*fixedRow*/ > i && me._6/*treeRow*/ > -1 && cell.haschild === true)) ? true : false,
			haschildren = (istree == true && ((cell.children && cell.children.length > 0) || cell.haschild === true)) ? true : false,
			treeicon = null, isopen,
			treediv = null,
			treetext = null,
			celltype,
			isdirty = cell.isdirty,
			textalign,
			tl,
			ni, rname,
			selected,
			_cn,
			bgr = (i - me._3/*fixedRow*/) % 2 == 1;
		
		cell.r = i; cell.c = j;
		txtcss.paddingLeft = me.pad.paddingLeft;
		txtcss.paddingTop = me.pad.paddingTop;
		
		// me.ctx.save();
		// me.ctx.beginPath();
		// me.ctx.rect(dx, dy, w, h);
		// me.ctx.clip();
		

		nparent = me.I_/*regdata*/;
		
		if (me.U_/*renderers*/.length > dj)
		{
			if (me.U_/*renderers*/[dj].length > di)
			{
				renderer = me.U_/*renderers*/[dj][di];
			}
			else
			{
				renderer = $('<div class="m-datagrid-cell"></div>')
					.appendTo(nparent);
				me.U_/*renderers*/[dj].push(renderer);
			}
		}
		else
		{
			renderer = $('<div class="m-datagrid-cell"></div>')
				.appendTo(nparent);
			me.U_/*renderers*/.push([]);
			me.U_/*renderers*/[dj] = [];
			me.U_/*renderers*/[dj].push(renderer);
		}
		
		renderer.rowIndex = i;
		renderer.colIndex = j;
		pcl = renderer.cl; ///*cell*/;
		renderer.cl = cell;
		renderer.p = [tx, ty, tx + w, ty + h];
		
		celltype = (cell.type || me.cols[j].type);
		
		if (visible == false)
		{
			renderer.hide();
			renderer.v = false;
		}
		else if (renderer.v !== true)
		{
			renderer.show();
			renderer.v = true;
		}
		
		renderer._cn && renderer.removeClass(renderer._cn);

		// renderer.show();
		// renderer.children().remove();
		
		if (!pcl || (pcl && pcl.celltype != celltype))
		{
			renderer.dobj = null;
			renderer.html("");
		}
		
		txtcss.paddingRight = me.pad.paddingRight;
		txtcss.paddingLeft = (cellstyle ? cellstyle.padleft : me.pad.paddingLeft) + (istree == true ? me.treeIndent * ((!cell.treeinfo.nd ? cell.treeinfo.depth : 0) || 0) : 0);
		txtcss.paddingLeft += (cell.celltree && !cell.celltree.nd ? me.treeIndent * cell.celltree.depth : 0);
		
		renderer._cn = null;
		cssobj.borderWidth = "0px";
		cssobj.borderLeftWidth = "0px";
		cssobj.borderRightWidth = "0px";
		cssobj.borderTopWidth = "0px";
		cssobj.borderBottomWidth = "0px";
		
		if (cellstyle != null)
		{
			_cn = cellstyle.cssname;
			textalign = parseInt(cellstyle.textalign);
			switch (textalign)
			{
			case 1: // left top
			case 4: // left center
			case 7: // left bottom
				// cssobj.paddingLeft = -scx;
				cssobj.textAlign = 'left';
				break;
			case 2: // center top
			case 5: // center center
			case 8: // center bottom
				// cssobj.paddingLeft = ((cellwidth - tex_b/*twidth*/) / 2) - scx;
				cssobj.textAlign = 'center';
				// talign = "center";
				break;
			case 3: // right top
			case 6: // right center
			case 9: // right bottom
				// cssobj.paddingLeft = (cellwidth - tex_b/*twidth*/ - me.pad.paddingRight) - scx;
				// talign = "right";
				cssobj.textAlign = 'right';
				txtcss.paddingLeft = 0;
				// w -= cssobj.paddingRight;
				break;
			}
			
			switch (textalign)
			{
			case 1:
			case 2:
			case 3:
				txtcss.paddingTop = -scy;
				break;
			case 4:
			case 5:
			case 6:
				txtcss.paddingTop = ((cellheight - tex_c/*theight*/) / 2) - scy;
				break;
			case 7:
			case 8:
			case 9:
				txtcss.paddingTop += (cellheight - tex_c/*theight*/ - me.pad.paddingBottom) - scy;
				break;
			}
			
			bg = "#f1f1f1";
			
			if ((!bgr && cellstyle.backcolor1) || (bgr && cellstyle.str_backcolor1))
			{
				bg = me.x_/*getColorCode*/(bgr && cellstyle.str_backcolor1 ? Number(cellstyle.str_backcolor1) : Number(cellstyle.backcolor1));
			}
			else if (cellstyle.backcolor1)
			{
				bg = me.x_/*getColorCode*/(Number(cellstyle.backcolor1));
			}

			cssobj.background = bg;
			cssobj.fontSize = Number(cellstyle.fontsize) + "px";
			
			if (cellstyle.color && cellstyle.color != "")
			{
				bg = me.x_/*getColorCode*/(Number(cellstyle.color));
				cssobj.color = bg;
			}
			else
			{
				cssobj.color = 0;
			}
			
			/*
			if (cellstyle.bordercolor)
			{
				bg = me.x_(Number(cellstyle.bordercolor));
				cssobj.borderColor = bg;
				cssobj.borderStyle = "solid";
				
				if (cell_t && cell_t.stylename == stname)
				{
					// cssobj.borderTopWidth = cellstyle.bordertop + "px";
				}
				else
				{
					cssobj.borderTopWidth = "" + cellstyle.borderouttop + "px";
				}
				
				if (cell_b && cell_b.stylename == stname)
				{
					if (cellstyle.borderbottom == 0 && cellstyle.bordertop == 0)
					{
						h += 1;
					}
					else
					{
						h += 1;
						cssobj.borderBottomWidth = "" + Math.max(cellstyle.borderbottom, cellstyle.bordertop) + "px";
					}
				}
				else
				{
					if (cellstyle.borderoutbottom == 0)
					{
						h += 1;
					}
					else
					{
						cssobj.borderBottomWidth = "" + cellstyle.borderoutbottom + "px";
					}
				}
				
				if (cell_r && cell_r.stylename == stname)
				{
					// cssobj.borderRightWidth = "" + cellstyle.borderright + "px";
				}
				else
				{
					cssobj.borderRightWidth = "" + cellstyle.borderoutright + "px";
				}
				
				if (cell_l && cell_l.stylename == stname)
				{
					if (cellstyle.borderleft == 0 && cellstyle.borderright == 0)
					{
						w += 1;
					}
					else
					{
						cssobj.borderLeftWidth = "" + Math.max(cellstyle.borderleft, cellstyle.borderright) + "px";
					}
				}
				else
				{
					if (cellstyle.borderoutleft == 0)
					{
						w += 1;
					}
					else
					{
						w += 1;
						cssobj.borderLeftWidth = "" + cellstyle.borderoutleft + "px";
					}
				}
			}
			*/
			
			cellstyle.fontstyle = Number(cellstyle.fontstyle);
			
			cssobj.fontWeight = "normal";
			cssobj.fontStyle = "normal";
			cssobj.textDecoration = "none";
			
			if (isNaN(cellstyle.fontstyle) == false)
			{
				cssobj.fontWeight = (cellstyle.fontstyle & IG$/*mainapp*/._IE3/*fontStyle*/.P_BOLD) ? "bold" : "normal";
				cssobj.fontStyle = (cellstyle.fontstyle & IG$/*mainapp*/._IE3/*fontStyle*/.P_ITALIC) ? "italic" : "normal";
				cssobj.textDecoration = (cellstyle.fontstyle & IG$/*mainapp*/._IE3/*fontStyle*/.P_UNDERLINE) ? "underline" : "none";
			}
		}
		
		cssobj.left = (tx - rx) + "px";
		cssobj.top = (ty - ry) + "px";
		cssobj.width = w;
		cssobj.height = h;
		
		if (me._browser > 0 && me._browser < 8)
		{
			// cssobj.width -= (txtcss.paddingLeft + txtcss.paddingRight + 1);
			cssobj.width -= 1;
			// cssobj.height -= ((txtcss.paddingTop || 0) + (txtcss.paddingBottom || 0) + 1);
			cssobj.height -= 1;
		}
		
		cssobj.width += "px";
		cssobj.height += "px";
		
		if (treeicon)
		{
			// txtcss.paddingLeft += 16;
		}
		else if (istree == true)
		{
			// txtcss.paddingLeft += 16;
		}
		else if (cell.celltree)
		{
			// txtcss.paddingLeft += 16;
		}

		// me.mmax = Math.max(me.mmax, cssobj.zIndex);
		
		if (currentrow[j].chart != null)
		{
			me._T/*addCellChart*/(currentrow[j].chart, dx, dy, colwidth, rowheight, renderer);
		}
		else
		{
			switch (celltype)
			{
			case "checkbox":
			case "boolean":
				if (renderer.dobj)
				{
					trenderer = renderer.dobj;
				}
				else
				{
					if (text == "true" || text == "false")
					{
						cell.checked = (text == "true") ? true : false;
						cell.text = text = "";
					}

					trenderer = renderer.dobj = $("<input type='checkbox' value='" + (text || "&nbsp") + "'>" + (text || "&nbsp") + "</input>");
					renderer.append(trenderer);
				}

				trenderer.attr("checked", cell.checked);
				trenderer.bind("click", function(e) {
					e.stopPropagation();
					cell.checked = trenderer.attr("checked");
				});
				break;
			case "radio":
				if (renderer.dobj)
				{
					trenderer = renderer.dobj;
				}
				else
				{
					trenderer = renderer.dobj = $("<input type='radio' value='" + (text || "&nbsp") + "'>" + (text || "&nbsp") + "</input>");
					renderer.append(trenderer);
				}
				trenderer.attr("checked", cell.checked);
				break;
			case "action":
				if (me.columns && me.columns[j].items)
				{
					for (ni=0; ni < me.columns[j].items.length; ni++)
					{
						me.b_a/*drawCellAction*/(me.columns[j].items[ni], renderer);
					}
				}
				break;
			default:
				
				if (renderer.dobj)
				{
					trenderer = renderer.dobj;
					tcss = trenderer.tcss;
				}
				else
				{
					trenderer = renderer.dobj = trenderer = $("<div class='m-cell-text'></div>");
					renderer.append(trenderer);
				}
				
				tl = txtcss.paddingLeft || 0;
				if ((istree == true && haschildren == true) || (cell.celltree && cell.celltree.haschild == true))
				{
					txtcss.paddingLeft = 0;
				}
				mcss = {marginLeft: (txtcss.paddingLeft || 0) + "px", marginTop: (txtcss.paddingTop || 0) + "px", marginRight: (txtcss.paddingRight || 0) + "px", marginBottom: (txtcss.paddingBottom || 0) + "px"};
				
				if (text && text.charAt(0) == "<" && text.charAt(text.length - 1) == ">")
				{
				}
				else
				{
					text = (text ? text : "").replace(" ", "&nbsp;");
				}
				_cn = _cn ? _cn.replace("${value}", text) : null;
				
				trenderer.html(text || " ");
				trenderer.tcss = mcss;
				 
				for (tcss in mcss)
				{
					trenderer[0].style[tcss] = mcss[tcss];
				}
				break;
			}
		}
		
		if (_cn)
		{
			renderer._cn = _cn;
			renderer.addClass(_cn);
		}
		
		if (cell.title == 3 || cell.title == 5)
		{
			renderer.addClass("igc-i-link");
			renderer._3/*is_link*/ = 1;
		}
		else if (renderer._3/*is_link*/)
		{
			renderer.removeClass("igc-i-link");
			renderer._3/*is_link*/ = 0;
		}
		
		if (cell.title == 4 || cell.title == 5)
		{
			menu = renderer._drm;
			
			if (!menu)
			{
				menu = $("<div class='igc-dgs-drill'></div>").appendTo(renderer);
				renderer._drm = menu;
			}
			menu.css({position: "absolute", left: cssobj.textAlign == "right" ? 0 : "initial", right: cssobj.textAlign == "right" ? "initial" : 0});
			menu.unbind("mouseover");
			menu.unbind("mouseout");
			menu.unbind("mousedown");
			menu.unbind("mouseup");
			
			menu.bind({
				mousedown: function(event) {
				},
				mouseup: function(event) {
				}
			});
		}
		else if (renderer._drm)
		{
			renderer._drm.remove();
			renderer._drm = null;
		}
		
		if ((istree == true && haschildren == true) || (cell.celltree && cell.celltree.haschild == true))
		{
			if (renderer.treeicon)
			{
				treediv = renderer.treeicon;
				treetext = $("#treetext", treediv);
				treeicon = $("#treeicon", treediv);
			}
			else
			{
				renderer.treeicon = treediv = $("<div class='m-datagrid-tree-box'><div id='treeicon' class='m-datagrid-tree-icon'></div><div id='treetext' class='m-datagrid-tree-text'></div></div>");
				treeicon = $("#treeicon", renderer.treeicon);
				treetext = $("#treetext", renderer.treeicon);
				renderer.append(treediv);
			}
			
			treetext.html(trenderer.html());
			trenderer.hide();
		}
		else if (renderer.treeicon)
		{
			renderer.treeicon.remove();
			renderer.treeicon = null;
			trenderer.show();
		}
		
		if ((istree == true && haschildren == true) || (cell.celltree && cell.celltree.haschild == true))
		{
			if (cell.celltree)
			{
				isopen = (cell.celltree.opened === true) ? true : false;
				
				treediv.css({left: me.pad.paddingLeft + (cell.celltree.nd ? 0 : me.treeIndent * cell.celltree.depth), top: me.pad.paddingTop});
				treeicon.unbind("click");
				treeicon.bind("click", function() {
					cell.celltree.opened = !cell.celltree.opened;
					me._Z/*invdata*/ = true;
					me.R_/*validateRowHidden*/();
					me._c/*theight*/ = 0;
					me.redraw.call(me);
					
					if (cell.celltree.opened && cell.celltree.h)
					{
						me.l_/*fireEvent*/("hierarchy", {
							cell: cell,
							row: currentrow
						});
					}
					return false;
				});
			}
			else
			{
				isopen = (cell.treeinfo.opened === true) ? true : false;
				
				treediv.css({left: me.pad.paddingLeft + me.treeIndent * (cell.treeinfo.nd ? 0 : cell.treeinfo.depth), top: me.pad.paddingTop});
				treeicon.unbind("click");
				treeicon.bind("click", function() {
					cell.treeinfo.opened = !cell.treeinfo.opened;
					me.cR/*calculateTreeHeight*/();
					me._Z/*invdata*/ = true;
					me.draw.call(me);
					return false;
				});
			}
			
			treeicon.removeClass("m-datagrid-treeplus")
				.removeClass("m-datagrid-treeminus")
				.addClass((isopen == false) ? "m-datagrid-treeplus" : "m-datagrid-treeminus");
		}
		
		if (cell.menus && cell.menus.active && !me.hidemenu)
		{
			if (!renderer.menuobj)
			{
				menu = $("<div class='m-datagrid-menu'></div>").appendTo(renderer);
				renderer.menuobj = menu;
				menu.css({position: "absolute", right: txtcss.paddingRight, top: txtcss.paddingTop});
			}
			else
			{
				menu = renderer.menuobj;
				menu.unbind("mouseover");
				menu.unbind("mouseout");
				menu.unbind("mousedown");
				menu.unbind("mouseup");
			}
			
			menu.bind({
				mouseover: function(event) {
					var me = $(this);
					me.addClass("m-datagrid-menu-focus");
					return false;
				},
				mouseout: function(event) {
					var me = $(this);
					me.removeClass("m-datagrid-menu-focus");
					return false;
				},
				mousedown: function(event) {
					event.stopPropagation();
					return false;
				},
				mouseup: function(event) {
					var owner = me.owner,
						offset = $(this).offset(),
						toffset = $(owner).offset(),
						_df = me._df,
						_dfc = me._dfc,
						x = offset.left - toffset.left,
						y = offset.top - toffset.top + $(this).height(),
						mdf, mc;
						
					mdf = _dfc.__af = _dfc.__af || {};
						
					if (me.enablecontextmenu == false)
						return false;
						
					event.stopPropagation();
					
					$.each(["cmd_asc", "cmd_desc", "cmd_sort", "b_rank", "b_filter", "cmd_remove", "cmd_filter"], function(k, m) {
						var v = 0;
						
						if (cell.menus.items[m])
						{
							v = 1;
						}
						
						_dfc[m][v ? "show" : "hide"]();
					});
					
					_dfc.d_rank.hide();
					
					if (mdf[cell.c])
					{
						_dfc.d_filter.show();
					}
					else
					{
						_dfc.d_filter.hide();
					}
					
					mc = mdf[cell.c] = mdf[cell.c] || {};
					
					_dfc.f_opt && _dfc.f_opt.val(mc.op || (cell.position == 3 ? "between" : "_like_"));
					_dfc.sval1 && _dfc.sval1.val(mc.val1 || "");
					_dfc.sval2 && _dfc.sval2.val(mc.val2 || "");
					
					_dfc.sval2[_dfc.f_opt.val() == "between" ? "show" : "hide"]();
					
					$.each(["t_sum", "t_avg", "t_min", "t_max", "t_rank", "t_pot", "t_cumul", "t_incr", "t_diff"], function(i, t) {
						var c = _dfc[t];
						
						if (cell.position == 1 || cell.position == 2)
						{
							c[/(t_sum|t_avg|t_min|t_max)/.test(t) ? "show" : "hide"]();
						}
						else if (cell.position == 3)
						{
							c[/(t_min|t_max)/.test(t) ? "hide" : "show"]();
						}
					});
					
					_df.show();
					
					if (x + _dfc.dmain.width() > $(owner).width())
					{
						x = $(owner).width() - _dfc.dmain.width();
					}
					
					me.context.cell = cell;
					
					_dfc.dmain.css({
						top: y,
						left: x
					});
					
//					var owner = me.owner,
//						offset = $(this).offset(),
//						toffset = $(owner).offset(),
//						x = offset.left - toffset.left,
//						y = offset.top - toffset.top + $(this).height();
//					
//					if (me.enablecontextmenu == false)
//						return false;
//						
//					event.stopPropagation();
//					
//					me._W/*prepMenu*/.call(me, cell.menus);
//					me.context.cell = cell;
//					if (x + me.context.menuel.width() > $(owner).width())
//					{
//						x = $(owner).width() - me.context.menuel.width();
//					}
//					$(owner).showContextMenu.call($(owner), me.context, x, y);
					return false;
				}
			});
		}
		else if (renderer.menuobj)
		{
			renderer.menuobj.remove();
			renderer.menuobj = null;
		}
		
		if (i == (me._3/*fixedRow*/ -1) && me.__gflt && me.__gflt[j])
		{
			if (!renderer.ficon)
			{
				ficon = $("<div class='m-datagrid-filter'></div>").appendTo(renderer);
				renderer.ficon = ficon;
				ficon.css({position: "absolute", right: txtcss.paddingRight + (renderer.menuobj ? 16 : 0), top: txtcss.paddingTop});
			}
			else
			{
				ficon = renderer.ficon;
			}
		}
		else if (renderer.ficon)
		{
			renderer.ficon.remove();
			renderer.ficon = null;
		}
		
		renderer.cbg = cssobj.background;
		
		if (me.selectionmode == "row" && me.rows[i].selected == true)
		{
			selected = true;
		}
		else
		{
			selected = cell.selected;
		}
		if (selected == true)
		{
			cssobj.background = me.selcolor;
		}
		
		pcss  = renderer.cssobj;

		renderer.cssobj = cssobj;
		// renderer.css(cssobj);
		
		for (tcss in cssobj)
		{
			renderer[0].style[tcss] = cssobj[tcss];
		}
		
//		if (me._z/*editable*/ && isdirty)
//		{
//			if (!renderer.dmark)
//			{
//				renderer.dmark = $("<div class='m-datagrid-dirty-cell'></div>").appendTo(renderer);
//			}
//		}
//		else if (renderer.dmark)
//		{
//			renderer.dmark.remove();
//			renderer.dmark = null;
//		}
		
		me.W_/*trenderers*/ = Math.max(me.W_/*trenderers*/, tx + w);
		me.X_/*canvasheight*/ = Math.max(me.X_/*canvasheight*/, ty + h);
		
		return renderer;
	},
	
	b_a/*drawCellAction*/: function(item, renderer) {
		var me = this,
			trenderer;
		switch (item.type)
		{
		default:
			trenderer = $("<button>" + item.name + "</button>")
				.appendTo(renderer)
				.bind("click", function() {
					if (item.action)
					{
						item.action(me, renderer);
					}
					return false;
				});
			break;
		}
	},
	
	c_/*drawBackground*/: function() {
		//me.mx_03/name ctx/.scale(1, 1);
		//me.ctx.fillStyle = "rgb(255,255,255)";
		//me.ctx.fillRect (0, 0, me._d/*cwidth*/, me._e/*cheight*/);
		//me.ctx.fillStyle = "rgb(0,0,0)";
	},
	
	d_/*getRendererByPoint*/: function(px, py) {
		var i,
			j,
			k,
			me = this,
			renderer,
			focused = null,
			position = me.ctx.offset(),
			cx = px - position.left, cy = py - position.top, mcol = (me.cols.length > (me._4/*fixedCol*/ - me._nh/*nhidden*/) ? (me._4/*fixedCol*/ - me._nh/*nhidden*/): 0),
			rp, y1, y2, x1, x2,
			sv = me._2/*scrollY*/ / me.sv,
			sh = me._1/*scrollX*/ / me.sh,
			bf = null,
			be = false;
		
		if (me.U_/*renderers*/.length > 0)
		{
			for (i=0; i < me.U_/*renderers*/.length; i++)
			{
				if (me.U_/*renderers*/[i].length > mcol && mcol > -1)
				{
					renderer = me.U_/*renderers*/[i][mcol];
						
					rp = renderer.p;
					y1 = rp[1]; y2 = rp[3];

					if (renderer && renderer.v !== false && y1 > -1 && y1 < cy && cy < y2)
					{
						for (j=0; j < me.U_/*renderers*/[i].length; j++)
						{
							renderer = me.U_/*renderers*/[i][j];
							rp = renderer.p;
							x1 = rp[0]; x2 = rp[2];

							if (x1 > -1 && x1 < cx && cx < x2)
							{
								be = true;
								
								if (!renderer.v && renderer.cl.merged == 8)
								{
									for (k=i; k >= me._3/*fixedRow*/; k--)
									{
										if (me.U_/*renderers*/[k][j] && (me.U_/*renderers*/[k][j].cl.merged == 0 || me.U_/*renderers*/[k][j].cl.merged == 1))
										{
											bf = me.U_/*renderers*/[k][j];
											break;
										}
									}
								}
								else if (renderer.v !== false)
								{
									bf = renderer;
								}
								break;
							}
						}
					}
				}
				
				if (bf || be)
				{
					break;
				}
			}
		}
		
		return bf;
	},
	
	_A/*ontouchstart*/: function(elem, ev) {
		//ev.preventDefault();
		var owner = this,
			orig_ev = ev.originalEvent,
			touch;
		
		if (ev)
		{
			ev.stopPropagation();
			
			if (orig_ev.touches.length == 2 && (owner.regv || owner.regh))
			{
				touch = orig_ev.touches[0];
				owner._f/*thumbbuttondown*/ = true;
				owner.sx = owner._1/*scrollX*/;
				owner.sy = owner._2/*scrollY*/;
				owner._x/*isScrolling*/ = true;				
				owner._g/*thumbmouseStartX*/ = touch.pageX;
				owner._h/*thumbmouseStartY*/ = touch.pageY;
			}
			else if (orig_ev.touches.length > 0)
			{
				touch = orig_ev.touches[0];
				owner._f/*thumbbuttondown*/ = false;
				owner.h_/*mousedownhandler*/.call(owner, touch.pageX, touch.pageY);
			}
			else
			{
				owner._f/*thumbbuttondown*/ = false;
				owner.j_/*mouseuphandler*/.call(owner, ev.pageX, ev.pageY, false, false);
			}
		}
	},
	
	_B/*ontouchend*/: function(elem, ev) {
		//ev.preventDefault();
		var owner = this;
		if (ev)
		{
			ev.stopPropagation();
			
			if (!owner._f/*thumbbuttondown*/)
			{
				owner.j_/*mouseuphandler*/.call(owner, ev.pageX, ev.pageY, false, false);
			}
			owner._f/*thumbbuttondown*/ = false;
		}
	},
	
	_C/*ontouchmove*/: function (elem, ev) {
		//ev.preventDefault();
		
		var owner = this,
			orig_ev = ev.originalEvent,
			touch,
			pt_s, pt_e, mx, my, d;
		
		if (orig_ev && orig_ev.touches.length > 0) 
		{
			ev.stopPropagation();
			touch = orig_ev.touches[0];
			
			if (owner._f/*thumbbuttondown*/ && owner._g/*thumbmouseStartX*/ > -1 && owner._h/*thumbmouseStartY*/ > -1)
			{
				pt_s = {
					x: owner._g/*thumbmouseStartX*/,
					y: owner._h/*thumbmouseStartY*/
				};
				
				pt_e = {
					x: touch.pageX,
					y: touch.pageY
				};
				
				if (owner.regv && owner.regh)
				{
					mx = Math.abs(pt_e.x - pt_s.x);
					my = Math.abs(pt_e.y - pt_s.y);
					
					if (mx > my)
					{
						d = "h";
					}
					else
					{
						d = "v";
					}
				}
				else if (owner.regv)
				{
					d = "v";
				}
				else if (owner.regh)
				{
					d = "h";
				}
				
				owner._S/*scrollHandler*/.call(owner, pt_e, d);
			}
			else
			{
				owner.i_/*mousemovehandler*/.call(owner, touch.pageX, touch.pageY);
			}
		}
	},
	
	e_/*onmousedown*/: function(elem, ev) {
		var me = this,
			owner = me.owner,
			x, y, dmenus, i,
			renderer,
			r = false;
		
		if (ev && !me.resizeCol)
		{
			var locked = (window.Ext && Ext.dd.DragDropManager.dragCurrent && Ext.dd.DragDropManager.dragCurrent.dragging == true) ? true : false;
			
			if (me._x/*isScrolling*/ == false && me._y/*isDragging*/ == false && locked !== true)
			{
				if(ev.which == 1) // left button pressed
				{
					// left button
					if (me.editing)
					{
						renderer = me.d_/*getRendererByPoint*/(ev.pageX, ev.pageY);
						if (renderer == me.editing)
						{
							r = true;
						}
						else
						{
							ev.stopPropagation();
						}
					}
					else
					{
						ev.stopPropagation();
					}
					me.h_/*mousedownhandler*/.call(me, ev.pageX, ev.pageY);
					
					function __doMouseMove(event) {
						me.f_/*onmousemove*/.call(me, elem, event);
						return false;
					}
					
					function __doMouseUp(event) {
						me.g_/*onmouseup*/.call(me, elem, event);
						
						$(document).unbind("mousemove", __doMouseMove).unbind("mouseup", __doMouseUp);
						return false;
					}
					
					$(document)
						.bind("mousemove", __doMouseMove)
						.bind("mouseup", __doMouseUp);
				}
				else if (ev.which == 3) // right button pressed
				{
					if (me.enablecontextmenu == false)
						return;
						
					// right button
					var offset = $(owner).offset();
					ev.stopPropagation();
					
					x = ev.pageX - offset.left; y = ev.pageY - offset.top;
					dmenus = [];
					
					if (me.selectedItems && me.selectedItems.length <2)
					{
						renderer = me.d_/*getRendererByPoint*/(ev.pageX, ev.pageY);
						
						if (renderer)
						{
							me.p_/*removeAllSelection*/();
							cl = renderer.cl;
							cl.selected = true;
							me.rows[renderer.rowIndex].selected = true;
							me.selectedRows.push(me.rows[renderer.rowIndex]);
							me.selectedItems.push(cl);
							
							me.a_/*refreshSelection*/();
						}
					}
					
					if (me.selectedItems && me.selectedItems.length > 0)
					{
						if ((me._browser > 0 && me._browser < 8) || $.zclip)
						{
							dmenus.push({
								disp: IRm$/*resources*/.r1("B_CLIPBOARD"),
								name: "CMD_CLIPBOARD",
								"class": (dmenus.length > 0 ? "separator" : null)
							});
						}
						
						if (me._ILb/*sheetoption*/ && me._ILb/*sheetoption*/.dff1/*drillitems*/.length > 0) //renderer && renderer.cl)
						{
							renderer = me.d_/*getRendererByPoint*/(ev.pageX, ev.pageY);
							if (renderer)
							{
								for (i=0; i < me._ILb/*sheetoption*/.dff1/*drillitems*/.length; i++)
								{
									if (me._ILb/*sheetoption*/.mL/*isdrill*/(me._ILb/*sheetoption*/.dff1/*drillitems*/[i], renderer))
									{
										dmenus.push({
											disp: me._ILb/*sheetoption*/.dff1/*drillitems*/[i].name,
											name: "detail:" + me._ILb/*sheetoption*/.dff1/*drillitems*/[i].uid
										});
									}
								}
							}
						}
					}
					
					/*
					dmenus.push({
		     	    	disp: IRm$.r1("B_UNDO"),
		     	    	name: "CMD_UNDO"
		     	    });
					*/
					
					if (dmenus.length > 0)
					{
						me._W/*prepMenu*/(dmenus);
						me.context.cell = null;
						if ($(owner).showContextMenu)
						{
							$(owner).showContextMenu.call($(owner), me.context, x, y);
						}
					}
				}
			}
		}
		
		return r;
	},
	
	f_/*onmousemove*/: function(elem, ev) {
		var owner = this;
		if (ev && !owner.resizeCol)
		{
			var locked = (window.Ext && Ext.dd.DragDropManager.dragCurrent && Ext.dd.DragDropManager.dragCurrent.dragging == true) ? true : false;
			
			if (owner._x/*isScrolling*/ == false && owner._y/*isDragging*/ == false && locked !== true)
			{
				ev.stopPropagation();
				owner.i_/*mousemovehandler*/.call(owner, ev.pageX, ev.pageY);
			}
		}
	},
	
	g_/*onmouseup*/: function(elem, ev) {
		var owner = this;
		if (ev && !owner.resizeCol)
		{
			owner.j_/*mouseuphandler*/.call(owner, ev.pageX, ev.pageY, ev.which, ev.ctrlKey, ev.shiftKey);
		}
	},
	
	_D/*onmousedblclick*/: function(elem, ev) {
		var owner = this;
		if (ev && !owner.resizeCol)
		{
			owner.k_/*mousedblclickhandler*/.call(owner, ev.pageX, ev.pageY, ev.which, ev.ctrlKey, ev.shiftKey);
		}
	},
	
	
	h_/*mousedownhandler*/: function(px, py) {
		var me = this;
		
		if (me._x/*isScrolling*/ == true)
			return;
			
		if (me._y/*isDragging*/ == true)
			return;
			
		if (me.resizeCol == true)
			return;
			
		me._l/*scrollStartX*/ = me._1/*scrollX*/;
		me._m/*scrollStartY*/ = me._2/*scrollY*/;
		
		me.buttondown = true;
		me._j/*mouseStartX*/ = px;
		me._k/*mouseStartY*/ = py;
		
		me.prevRenderer = me.d_/*getRendererByPoint*/(px, py);
		me.startRenderer = me.prevRenderer;
		
		me.mouseAction = 0;
		
		var c = new Date().getTime();
		
		me.doubletap = false;
		
		if (me._o/*mouseDownTimer*/ && c - me._o/*mouseDownTimer*/ < 800)
		{
			me.doubletap = true;
		}
		me._o/*mouseDownTimer*/ = c;
	},
	
	i_/*mousemovehandler*/: function(px, py) {
		var mx,
			my,
			me = this,
			selectionChanged = false, i, j,
			startRenderer = me.startRenderer,
			cl;
			
		if (me._x/*isScrolling*/ == true)
			return;
			
		if (me._y/*isDragging*/ == true)
		{
			return;
		}
		
		if (me.mouseMode == 'scroll')
		{
			if (me.mouseAction == 0 && me.buttondown == true && (me._b/*twidth*/ > me._d/*cwidth*/ || me._c/*theight*/ > me._e/*cheight*/))
			{
				mx = px - me._j/*mouseStartX*/;
				my = py - me._k/*mouseStartY*/;
				
				me.v_/*setOffSet*/(me, mx, my, px, py);
			}
		}
		else if (me.mouseMode == 'select' && (Math.abs(me._j/*mouseStartX*/ - px) > 5 || Math.abs(me._k/*mouseStartY*/ - py) > 5))
		{
			if (me.mouseAction == 0 && me.buttondown == true)
			{
				renderer = me.d_/*getRendererByPoint*/(px, py);
				
				if (renderer != null && startRenderer != null)
				{
					cl = renderer.cl;
					if (renderer == startRenderer && (me.selectedItems.length != 1 || 
														   (me.selectedItems.length == 1 && me.selectedItems[0] != cl)))
					{
						me.p_/*removeAllSelection*/();
						cl.selected = true;
						me.rows[renderer.rowIndex].selected = true;
						me.selectedRows.push(me.rows[renderer.rowIndex]);
						me.selectedItems.push(cl);
						selectionChanged = true;
					}
					else if (me.prevRenderer != renderer)
					{
						// ranged selection
						var sr = Math.min(startRenderer.rowIndex, renderer.rowIndex),
							sc = Math.min(startRenderer.colIndex, renderer.colIndex), 
							tr = Math.max(startRenderer.rowIndex, renderer.rowIndex), 
							tc = Math.max(startRenderer.colIndex, renderer.colIndex);
						
						me.p_/*removeAllSelection*/();
						
						for (i=sr; i <= tr; i++)
						{
							if (me.rows[i].visible !== false && me.rows[i]._5a/*treeCollapse*/ !== true)
							{
								for (j=sc; j <= tc; j++)
								{
									if (me.cols[j].visible !== false)
									{
										me[(this._5/*treeCol*/ > -1 || this._6/*treeRow*/ > -1) ? "treeData" : "_Y"/*dataProvider*/][i][j].selected = true;
										me.selectedItems.push(me[(this._5/*treeCol*/ > -1 || this._6/*treeRow*/ > -1) ? "treeData" : "_Y"/*dataProvider*/][i][j]);
									}
								}
								
								me.selectedRows.push(me.rows[i]);
							}
						}
						
						selectionChanged = true;
					}
					
					if (selectionChanged == true)
					{
						me.a_/*refreshSelection*/();
					}
					
					me.prevRenderer = renderer;
				}
			}
		}
	},
	
	j_/*mouseuphandler*/: function(px, py, w, ctrlKey, shiftKey) {
		var c = new Date().getTime(),
			renderer,
			doubleclick = 0,
			me = this,
			i,
			cl;
			
		if (me._x/*isScrolling*/ == true)
			return;
			
		if (me._y/*isDragging*/ == true)
			return;
		
		if (me.mouseMode == 'scroll')
		{
			if (me.mouseAction == 0 && (c - me._o/*mouseDownTimer*/) < 500 && Math.abs(me._j/*mouseStartX*/ - px) < 10 && Math.abs(me._k/*mouseStartY*/ - py) < 10) {
				// selection
				renderer = me.d_/*getRendererByPoint*/(px, py);
				if (renderer)
				{
					cl = renderer.cl;
					me.p_/*removeAllSelection*/();
					cl/*cell*/.selected = true;
					me.selectedItems.push(cl/*cell*/);
					me.rows[renderer.rowIndex].selected = true;
					me.selectedRows.push(me.rows[renderer.rowIndex]);
					me.a_/*refreshSelection*/();
				}
			}
		}
		else if (me.mouseMode == 'select')
		{
			renderer = me.d_/*getRendererByPoint*/(px, py);
			
			if (renderer)
			{
				if (me.editing != renderer)
				{
					me._N/*endEdit*/.call(me);
				}
				
				if (w == 3) // right button mouse click
				{
					
				}
				else
				{
					if (me._p/*mouseUpTimer*/ > -1 && c - me._p/*mouseUpTimer*/ < 500 && me.mouseUpRenderer && me.mouseUpRenderer == renderer)
					{
						// doubleclick = 2;
						// if (me.m_/*itemDblClick*/(renderer) !== false)
						// {
						//	me.l_/*fireEvent*/('itemdblclick', renderer);
						// }
					}
					else if (c - me._o/*mouseDownTimer*/ < 500)
					{
						// single click;
						doubleclick = 1;
						if (me.itemClick(renderer) !== false)
						{
							me.l_/*fireEvent*/('itemclick', renderer);
						}
					}
					
					cl = renderer.cl;
					
					if (ctrlKey && doubleclick == 1)
					{
						cl/*cell*/.selected = !cl/*cell*/.selected;
						me.rows[renderer.rowIndex].selected = ! me.rows[renderer.rowIndex].selected;
						if (cl/*cell*/.selected == true)
						{
							me.selectedItems.push(cl/*cell*/);
							me.selectedRows.push(me.rows[renderer.rowIndex]);
						}
						else
						{
							for (i=0; i < me.selectedItems.length; i++)
							{
								if (me.selectedItems[i] == cl/*cell*/)
								{
									me.selectedItems.splice(i, 1);
									break;
								}
							}
							
							if (me.selectionmode == "row")
							{
								for (i=0; i < me.selectedRows.length; i++)
								{
									if (me.selectedRows[i] == me.rows[renderer.rowIndex])
									{
										me.selectedRows.splice(i, 1);
										break;
									}
								}
							}
						}
						
						me.a_/*refreshSelection*/();
					}
					
					if (doubleclick > 0)
					{
						if (doubleclick > 1 || !ctrlKey)
						{
							me.p_/*removeAllSelection*/();
						}
						cl/*cell*/.selected = true;
						me.selectedItems.push(cl/*cell*/);
						me.rows[renderer.rowIndex].selected = true;
						me.selectedRows.push(me.rows[renderer.rowIndex]);
						
						me.a_/*refreshSelection*/();
					}
					else if (me.selectedItems.length > 0)
					{
						me.l_/*fireEvent*/('selectionchanged');
					}
				}
			}
			else
			{
				me._N/*endEdit*/.call(me);
			}
			
			me.mouseUpRenderer = renderer;
			me._p/*mouseUpTimer*/ = c;
		}
		
		me.buttondown = false;
		me._j/*mouseStartX*/ = -1;
		me._k/*mouseStartY*/ = -1;
	},
	
	k_/*mousedblclickhandler*/: function(px, py, w, ctrlKey, shiftKey) {
		var me = this,
			renderer = me.d_/*getRendererByPoint*/(px, py);
		me._p/*mouseUpTimer*/ = -1;
		if (me.m_/*itemDblClick*/(renderer) !== false)
		{
			me.l_/*fireEvent*/('itemdblclick', renderer);
		}
	},
	
	l_/*fireEvent*/: function(eventname, param) {
		this.ctx.trigger(eventname, [param]);
	},
	
	_E/*mousewheel*/: function(elem, ev, delta) {
		if (typeof(delta) == "undefined")
		{
			delta = ev.originalEvent ? ev.originalEvent.deltaY * -0.1 : 0;
		}
		
		var me = this,
			sx = me._1/*scrollX*/,
			sy = me._2/*scrollY*/,
			dir = delta > 0 ? 'Up' : 'Down',
	        vel = Math.abs(delta);
	        
	    if (me.__scr)
	    	return;
		
		vel = (vel > 15) ? vel * 1.5 : 18 + 1;
		vel = (delta > 0) ? -vel : vel;
		
		me._N/*endEdit*/.call(me);
		
		if (me._c/*theight*/ > me._e/*cheight*/)
		{
			me.v_/*setOffSet*/(me, 0, undefined, 0, 0, vel > 0 ? 10 : -10);
		}
	},
	
	m_/*itemDblClick*/: function(renderer) {
		var me = this;
		
		if (me._z/*editable*/ && me.cols[renderer.colIndex]._z/*editable*/ !== false)
		{
			me.n_/*beginEdit*/(renderer);
		}
	},
	
	n_/*beginEdit*/: function(renderer) {
//		var me = this,
//			cl,
//			offset = me.ctx.offset(),
//			roffset;
//			
//		roffset = renderer.offset();
//		cl = renderer.cl;
//		me.editing = renderer;
//		me.editor.empty();
//		me.editor.css({left: (roffset.left - offset.left), top: (roffset.top - offset.top), overflow: "visible"});
//		me.editor.ceditor = me.o_/*createEditor*/();
//		me.editor.append(me.editor.ceditor);
//		me.editor.ceditor.width(renderer.width()).height(renderer.height());
//		me.editor.ceditor.attr("value", cl.code || cl.text);
//		me.editor.width(renderer.width()).height(renderer.height());
//		me.editor.show();
//		me.editor.ceditor.select();
	},
	
	o_/*createEditor*/: function() {
//		var me = this,
//			editoritem = $("<input type='text'></input>");
//		editoritem.bind("keyup", function(e) {
//			if (e.keyCode == 13)
//			{
//				me._N/*endEdit*/.call(me, "enter");
//			}
//			return false;
//		});
//		
//		return editoritem;
	},
	
	itemClick: function(renderer) {
	},
	
	p_/*removeAllSelection*/: function() {
		var i,
			me = this,
			selectedItems = me.selectedItems,
			selectedRows = me.selectedRows;
			
		for (i=selectedItems.length-1; i >=0 ; i--)
		{
			selectedItems[i].selected = false;
		}
		
		for (i=selectedRows.length-1; i>=0; i--)
		{
			selectedRows[i].selected = false;
		}
		
		me.selectedItems = selectedItems = [];
		me.selectedRows = [];
	},
	
	_H/*onthumbmousedown*/: function(elem, ev, direction) {
		var owner = this;
		
		if (ev)
		{
			ev.preventDefault();
			ev.stopImmediatePropagation();
			
			owner.dt1 = new Date().getTime();
			owner._f/*thumbbuttondown*/ = true;
			owner._g/*thumbmouseStartX*/ = ev.pageX;
			owner._h/*thumbmouseStartY*/ = ev.pageY;
			owner.sx = owner._1/*scrollX*/;
			owner.sy = owner._2/*scrollY*/;
			owner._x/*isScrolling*/ = true;
			owner.scrolltarget = elem.eventtarget;
			
			owner._O/*registerGlobalEvent*/(direction);
		}
		
		return false;
	},
	
	_I/*onthumbmouseup*/: function(elem, ev, direction) {
		var me = this,
			owner = me,
			cdt = new Date().getTime();
		
		if (ev && me.dt1 && me.dt1 > -1 && cdt - me.dt1 < 200)
		{
			var je = $(elem),
				offset = je.offset(),
				px = ev.pageX - offset.left,
				py = ev.pageY - offset.top,
				pw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(je), // je.width(),
				ph = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(je), // je.height(),
				nsx = me._1/*scrollX*/,
				nsy = me._2/*scrollY*/,
				step, inc;
			
			me.dt1 = -1;
			
			event.stopPropagation();
			
			if (me.ge)
			{
				$(document).unbind(me.ge);
				me.ge = null;
			}
			
			me._R/*globalMouseUp*/.call(me, ev, direction);
			
			owner._f/*thumbbuttondown*/ = false;
			owner._g/*thumbmouseStartX*/ = -1;
			owner._h/*thumbmouseStartY*/ = -1;
			
			if (direction == "v")
			{
				inc = (py > ph / 2) ? 0.1 : -0.1;
				step = Math.min(owner._c/*theight*/ - owner._e/*cheight*/, (owner._e/*cheight*/ - owner._7/*fixedRowHeight*/) * 0.1);
				nsy = nsy + step * inc;
				nsy = (nsy < 0) ? 0 : Math.min(nsy, owner._c/*theight*/ - owner._e/*cheight*/);
			}
			else if (direction == "h")
			{
				inc = (px > pw / 2) ? 0.1 : -0.1;
				step = step = Math.min(owner._b/*twidth*/ - owner._d/*cwidth*/, (owner._d/*cwidth*/ - owner._8/*fixedRowWidth*/) * 0.1);
				nsx = nsx + step * inc;
				nsx = (nsx < 0) ? 0 : Math.min(nsx, owner._b/*twidth*/ - owner._d/*cwidth*/);
			}
			
			if (owner._1/*scrollX*/ != nsx || owner._2/*scrollY*/ != nsy)
			{
				owner._1/*scrollX*/ = nsx;
				owner._2/*scrollY*/ = nsy;
				
				owner.t_/*updateThumbPosition*/.call(owner);
				
				// this._Gt/*reghscrollthumb*/.css({left: owner._1/*scrollX*/ )
				
				if (owner._i/*thumbTimer*/ > -1)
				{
					clearTimeout(owner._i/*thumbTimer*/);
				}
				
				owner._i/*thumbTimer*/ = setTimeout(function() {
					owner.on_i/*thumbTimer*/.call(owner);
				}, 50);
			}
		}
	},
	
	q_/*setScrollTop*/: function(value) {
		var me = this;
		
		me._N/*endEdit*/();
				
		me.on_i/*thumbTimer*/.call(me);
	},
	
	r_/*setScrollRow*/: function(rindex) {
		var me = this,
			i,
			n = Math.min(rindex + me._3/*fixedRow*/, me.rows.length),
			ch = 0;
			
		for (i=me._3/*fixedRow*/; i < n; i++)
		{
			ch += me.rows[i].height;
		}
		
		me.q_/*setScrollTop*/(ch * me.sv);
	},
	
	s_/*setScrollBottom*/: function() {
		var me = this,
			_2/*scrollY*/ = (me._c/*theight*/ - me._7/*fixedRowHeight*/ - me._e/*cheight*/) * me.sv + 1;
		me.q_/*setScrollTop*/(_2/*scrollY*/);
	},
	
	_K/*onhtmlscroll*/: function(elem, ev, direction) {
		var me = this,
			area,
			svalue;
		ev.stopPropagation();
		
		if (direction == "v")
		{
			svalue = $(elem).scrollTop();
			svalue = svalue * me.sv;
			me._2/*scrollY*/ = svalue;
		}
		else if (direction == "h")
		{
			svalue = $(elem).scrollLeft();
			svalue = svalue * me.sh;
			me._1/*scrollX*/ = svalue;
		}
		
		if (me._i/*thumbTimer*/ > -1)
		{
			clearTimeout(me._i/*thumbTimer*/);
		}
		
		me._N/*endEdit*/();
		
		me._i/*thumbTimer*/ = setTimeout(function() {
			me.on_i/*thumbTimer*/.call(me);
		}, 10);
	},
	
	_J/*onscrollmouseclick*/: function(elem, ev, direction) {
		var owner = this;
		
		ev.stopPropagation();
		
		owner._N/*endEdit*/.call(owner);
		
		var nsx = owner._1/*scrollX*/,
			nsy = owner._2/*scrollY*/,
			inc = 0,
			step,
			__tw, __th,
			offset = (direction == "v") ? 
				owner._Ft/*regvscrollthumb*/.offset() : 
				owner._Gt/*reghscrollthumb*/.offset();
		
		if (direction == "v")
		{
			inc = (offset.top > ev.pageY) ? -1 : 1;
			step = owner.thumbvheight;
			nsy += step * inc;
			__th = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(owner._F/*regvscroll*/);
			nsy = Math.min(__th - owner.thumbvheight, Math.max(0, nsy));
			if (owner._2/*scrollY*/ == nsy)
				return;
			owner._2/*scrollY*/ = nsy;
		}
		else
		{
			inc = (offset.left > ev.pageX) ? -1 : 1;
			step = owner.thumbhwidth;
			nsx += step * inc;
			__tw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(owner._G/*reghscroll*/);
			nsx = Math.min(__tw - owner.thumbhwidth, Math.max(0, nsx));
			if (owner._1/*scrollX*/ == nsx)
				return;
			owner._1/*scrollX*/ = nsx;
		}
		
		owner.t_/*updateThumbPosition*/.call(owner);
		
		if (owner._i/*thumbTimer*/ > -1)
		{
			clearTimeout(owner._i/*thumbTimer*/);
		}
		
		owner._i/*thumbTimer*/ = setTimeout(function() {
			owner.on_i/*thumbTimer*/.call(owner);
		}, 10);
	},
	
	on_i/*thumbTimer*/: function() {
		this._i/*thumbTimer*/ = -1;
		var me = this,
			sm = me._2/*scrollY*/ / me.sv;
		if (sm > (me._c/*theight*/ - me._7/*fixedRowHeight*/ - me._e/*cheight*/))
		{
			me.l_/*fireEvent*/("scrollend", null);
		}
		
		this.draw();
	},
	
	t_/*updateThumbPosition*/: function() {
		var me = this,
			thumbsize = 30,
			__tw, __th, __tw1, __th1;
		
		__tw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me._G/*reghscroll*/);
		__th = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me._F/*regvscroll*/);
		__tw1 = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me._Gt/*reghscrollthumb*/);
		__th1 = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me._Ft/*regvscrollthumb*/);
		
		me._Gt/*reghscrollthumb*/.css({left: Math.min(me._1/*scrollX*/, __tw - __tw1)});
		me._Ft/*regvscrollthumb*/.css({top: Math.min(me._2/*scrollY*/, __th - __th1)});
	},
	
	v_/*setOffSet*/: function(owner, mx, my, pgX, pgY, scr) {
		var me = this,
			nsx = owner._1/*scrollX*/,
			nsy = owner._2/*scrollY*/,
			__tw, __th,
			_F/*regvscroll*/ = me._F/*regvscroll*/,
			__vh,
			__nsy,
			_nsx = nsx, _nsy = nsy;
		
		if (owner.sh < 1 && Math.abs(mx) > 5)
		{
			__tw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(owner._G/*reghscroll*/);
			_nsx = Math.min(__tw - owner.thumbhwidth, Math.max(0, nsx + mx));
		}
		
		if (owner._c/*theight*/ > owner._e/*cheight*/ && typeof(my) == "undefined")
		{
			__vh = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(_F/*regvscroll*/);
			__nsy = __vh - me.thumbvheight;
			__th = scr * owner.sv * 21;
			_nsy = Math.min(__nsy, owner._2/*scrollY*/ + __th);
			
			if (_nsy < 0)
			{
				_nsy = 0;
			}
		}
		else if (owner._c/*theight*/ > owner._e/*cheight*/ && Math.abs(my) > 5)
		{
			__th = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(owner._F/*regvscroll*/);
			_nsy = Math.min(__th - owner.thumbvheight, Math.max(0, nsy + my));
		}
				
		if (_nsx != nsx || _nsy != nsy)
		{
			owner._1/*scrollX*/ = _nsx;
			owner._2/*scrollY*/ = _nsy;
			owner.t_/*updateThumbPosition*/.call(owner);
			owner.draw();
		}
	},
	
	/** utiltity **/
	u_/*measureTextSize*/: function(font, size, text, cellstyle) {
		var me = this,
			s = new IG$/*mainapp*/.cMa/*DataGridView*/.CSize(0, 0),
			browser = window.bowser,
			cobj = {},
			fw,
			_ccache = IG$/*mainapp*/._ccache.tmeasure,
			k, ifw = 0;
		
		/*
		backalpha1: "1.0"
		backalpha2: "1.0"
		backcolor1: "16777215"
		backcolor2: "-1"
		bordercolor: "16053492"
		borderthickness: "1"
		color: "0"
		fontsize: "10.0"
		fontstyle: "0"
		formatstring: ""
		gradient: "0"
		name: "Col01_data"
		nullvalue: ""
		padbottom: 2
		padleft: 2
		padright: 2
		padtop: 2
		textalign: "6"
		*/
		
		text = text || "&nbsp;";
		
		if (cellstyle)
		{
			cobj.fontSize = Number(cellstyle.fontsize);
			if (cellstyle.autowidth == "F" && cellstyle.columnwidth)
			{
				fw = Number(cellstyle.columnwidth);
				ifw = isNaN(fw) ? 0 : 1;
			}
		}
		else
		{
			cobj.fontSize = size;
		}
		
		k = text + ":" + cobj.fontSize + ":" + (ifw ? fw : "");
		
		if (_ccache[k])
		{
			return _ccache[k];
		}
		
//		if (browser && browser.msie && Number(browser.version) < 10)
//		{
//			cobj.top = 0;
//			cobj.left = 0;
//		}
		
		me.measurediv.show();
		me.measurediv.css(cobj);
		me.measurediv.html(text);
		
		s.height = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.measurediv); // .height();
		s.width = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.measurediv); // .width() + 2;
		
		if (ifw)
		{
			s.fw = 1;
			s.fw_ = fw;
		}
		else if (cellstyle)
		{
			s.width += cellstyle.padright + cellstyle.padleft + 8;
		}
		
		_ccache[k] = s;
		
		return s;
	},
	
	w_/*getHexCode*/: function(dec) {
		var hexArray = new Array( "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F" ),
	
	    	code1 = Math.floor(dec / 16),
	    	code2 = dec - code1 * 16,
	
	    	decToHex = hexArray[code2];
	
		return decToHex; // code2;
	},
	
	x_/*getColorCode*/: function(dec) {
		var me = this,
			hexCode= new Array(),
			i=0,
			v,
			_ccache = IG$/*mainapp*/._ccache.colorcode;
			
		if (_ccache[dec])
		{
			return _ccache[dec];
		}
		
		if (dec < 16)
		{
			fcolor = "#00000" + me.w_/*getHexCode*/(dec); // "rgb(0,0," + dec + ")";
		}
		else
		{
			while(dec > 15)
			{
				hexCode[i] = me.w_/*getHexCode*/(dec);
				
			    dec = Math.floor(dec / 16);
			    i+=1;
			}
			
			hexCode[i] = me.w_/*getHexCode*/(dec);
			
			// var fcolor = "rgb(255, 255, 255)";
			// var b = hexCode[1] * 16 + hexCode[0];
			// var g = hexCode[3] * 16 + hexCode[2];
			// var r = ((hexCode[5]) ? hexCode[5] * 16 : 0) + hexCode[4];
			
			// fcolor = "rgb(" + (isNaN(r) ? 0 : r) + "," + (isNaN(g) ? 0 : g) + "," + (isNaN(b) ? 0 : b) + ")";
			
			fcolor = "#";
			
			for (i=0; i < 6; i++)
			{
				v = hexCode[5-i];
				fcolor += (v ? v : "0");
			}
		}
		
		_ccache[dec] = fcolor;
		
		return fcolor;
	},
	
	y_/*getCellValue*/: function(row, col) {
		var me = this,
			r = null,
			oY/*app_dataProvider*/ = me.oY/*app_dataProvider*/;
		
		if (oY/*app_dataProvider*/ && oY/*app_dataProvider*/.length > row && oY/*app_dataProvider*/[row].length > col)
		{
			r = oY/*app_dataProvider*/[row][col];
		}
		
		return r;
	},
	
	z_/*setCellValue*/: function(row, col, value) {
		var me = this,
			oY/*app_dataProvider*/ = me.oY/*app_dataProvider*/;
			
		if (oY/*app_dataProvider*/ && oY/*app_dataProvider*/.length > row && oY/*app_dataProvider*/[row].length > col)
		{
			oY/*app_dataProvider*/[row][col].text = value;
		}
	},
	
	S_/*addRow*/: function() {
		var me = this,
			dp = me.oY/*app_dataProvider*/,
			row, drow = [], mrow =[],
			r = dp.length,
			i, trsize = {};
			
		me._N/*endEdit*/();
		me._Z/*invdata*/ = true;
		me._c/*theight*/ = 0;
		row = new IG$/*mainapp*/.cMa/*DataGridView*/.DimInfo(r);
		me.rows.push(row);
		for (i=0; i < me._a/*colcount*/; i++)
		{
			drow.push("");
		}
		me.T_/*getRowDataProc*/(drow, mrow);
		dp.push(mrow);
		
		me.J_/*validateRowSize*/(row, mrow, trsize);
		
		this._9/*rowcount*/ = dp.length;
		
		me.t_/*updateThumbPosition*/.call(me);
		me.redraw();
	},
	
	A_/*removeRow*/: function(r) {
		var me = this,
			dp = me.oY/*app_dataProvider*/;
			
		me._N/*endEdit*/();	
		me._Z/*invdata*/ = true;
		
		dp.splice(r, 1);
		me.rows.splice(r, 1);
			
		this._9/*rowcount*/ = dp.length;
		me.t_/*updateThumbPosition*/.call(me);
		me.redraw();
	},
	
	T_/*getRowDataProc*/: function(rawdata, row) {
		var me = this,
			columns = me.columns,
			i, j;
			
		for (j=0; j < columns.length; j++)
		{
			cell = {
				text: rawdata[columns[j].field] || null, 
				mrow:0, 
				mcol:0, 
				merged:0, 
				stylename: columns[j].stylename || "normal", 
				chart:null,
				position: -1,
				code: null,
				value: null,
				index: -1,
				title: -1,
				pindex: -1
			};
			
			if (cell.stylename && me.styles[cell.stylename])
			{
				st = me.styles[cell.stylename];
				if (columns[j].type == "numeric" && st.formatstring)
				{
					cell.code = cell.text;
					cell.text = me.formatString(cell.code, st.formatstring);
				}
			}
			
			row.push(cell);
		}
	},
	
	C_/*getRowData*/: function(data, dp) {
		var me = this,
			columns = me.columns,
			i, j;
			
		for (i=0; i < data.length; i++)
		{
			row = [];
			me.T_/*getRowDataProc*/(data[i], row);
			dp.push(row);
		}
	},
	
	is_s/*rendered*/: function(domObj) {
		var jdom = $(domObj)[0];
	    if ((jdom.nodeType != 1) || (jdom == document.body)) 
	    {
	        return true;
	    }
	    if (jdom.currentStyle && jdom.currentStyle["display"] != "none" && jdom.currentStyle["visibility"] != "hidden") 
	    {
	        return this.is_s/*rendered*/(jdom.parentNode);
	    } else if (window.getComputedStyle) {
	        var cs = document.defaultView.getComputedStyle(jdom, null);
	        if (cs.getPropertyValue("display") != "none" && cs.getPropertyValue("visibility") != "hidden") 
	        {
	            return this.is_s/*rendered*/(jdom.parentNode);
	        }
	    }
	    return false;
	},
	
	check_s/*rendered*/: function(domObj) {
		var jdom = $(domObj)[0];
		var obj = domObj;
	    if ((jdom.nodeType != 1) || (jdom == document.body)) 
	    {
	        return null;
	    }
	    if (jdom.currentStyle && (jdom.currentStyle["display"] == "none" || jdom.currentStyle["visibility"] == "hidden"))
	    {
	        return obj;
	    } 
	    else if (window.getComputedStyle) 
	    {
	        var cs = document.defaultView.getComputedStyle(jdom, null);
	        if (cs.getPropertyValue("display") == "none" || cs.getPropertyValue("visibility") == "hidden") 
	        {
	            return obj;
	        }
	    }
	    else
	    {
	    	obj = this.check_s/*rendered*/(jdom.parentNode);
	    	if (obj)
	    	{
	    		return obj;
	    	}
	    }
	    return obj;
	},
	
	browser: function() {
		var rv = -1; // Return value assumes failure.

	    if (navigator.appName == 'Microsoft Internet Explorer')
	    {
	        var ua = navigator.userAgent;
	        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	        if (re.exec(ua) != null)
	            rv = parseFloat( RegExp.$1 );
	    }
	
	    return rv;
	}
};

IG$/*mainapp*/.cMa/*DataGridView*/.padding = function(dist) {
	var me = this;
	me.paddingTop = dist;
	me.paddingBottom = dist;
	me.paddingLeft = dist;
	me.paddingRight = dist;
};

IG$/*mainapp*/.cMa/*DataGridView*/.DimInfo = function(index) {
	var me = this;
	
	me.index = index;
	me.width = 0;
	me.height = 0;
	me._d/*cwidth*/ = 0;
};

IG$/*mainapp*/.cMa/*DataGridView*/.DimInfo.prototype = {
	w: function() {
		var me = this;
		return me.width + (me._d/*cwidth*/ ? me._d/*cwidth*/ : 0);
	},
	h: function() {
		var me = this;
		return me.height + (me._e/*cheight*/ ? me._e/*cheight*/ : 0);
	},
	init: function() {
		var me = this;
		me._d/*cwidth*/ = 0;
		me._e/*cheight*/ = 0;
		me.width = 0;
		me.height = 0;
		me.visible = true;
		me.fw = undefined;
		me.fw_ = undefined;
	}
}

IG$/*mainapp*/.cMa/*DataGridView*/.CSize= function (width, height) {
	var me = this;
	me.width = width;
	me.height = height;
};

if (window.Ext)
{
	IG$/*mainapp*/.DmU/*datawebgridext*/ = Ext.extend(Ext.dd.DragZone, {
	
	    dtimer: -1,
	    spoint: null,
	
	    constructor : function(el, config){
	          this.callParent([el, config]);
	//        if (this.containerScroll) {
	//            Ext.dd.ScrollManager.register(this.el);
	//        }
	    },
	    
	//    handleMouseDown: function(e) {
	//        if (this.dragging) {
	//            return;
	//        }
	//	    
	//	    var me = this,
	//	    	f_move, f_up,
	//	    	doc = $(document);
	//	    	
	//	    if (me.owner && me.owner.resizeCol)
	//	    	return;
	//	    
	//	    me.f_move = f_move = function (event) {
	//	    	me.handleMouseMove.call(me, event);
	//	    	return false;
	//	    };
	//	    
	//	    me.f_up = f_up = function(event) {
	//	       	me.handleMouseUp.call(me, event);
	//	       	return false;
	//	    };
	//	    
	//	    me.de = e;
	//	    me.spoint = e.getPoint();
	//	    
	//	    doc.bind("mousemove", f_move)
	//	       .bind("mouseup", f_up);
	//
	//	    
	//		me.dtimer = setTimeout(function() {
	//			me._doDrag.call(me);
	//		}, 300);
	//	    return;
	//    },
	//    
	//    handleMouseUp: function(e) {
	//    	var me = this;
	//    	
	//    	me.unDocH();
	//    },
	    
	//    handleMouseMove: function(e) {
	//    	var me = this,
	//    		pt;
	//    	
	//    	if (me.dtimer > -1 && me.de && me.spoint && me.dragging == false)
	//    	{
	//    		pt = {x: Math.abs(e.pageX - me.spoint.x), y: Math.abs(e.pageY - me.spoint.y)};
	//    		
	//    		if (pt.x > 10 || pt.y > 10)
	//    		{
	//    			me.unDocH();
	//    		}
	//    	}
	//    },
	//    
	//    unDocH: function() {
	//    	var me = this,
	//    		doc = $(document);
	//    	
	//    	if (me.dtimer > -1)
	//    	{
	//    		clearTimeout(me.dtimer);
	//    	}
	//    	
	//    	me.dtimer = -1;
	//    	me.spoint = null;
	//    	
	//    	doc.unbind("mousemove", me.f_move)
	//    	   .unbind("mouseup", me.f_up);
	//    },
	//    
	//    _doDrag: function() {
	//    	var me = this,
	//    		method = me.handleMouseDown,
	//    		parentClass = method.$owner.superclass, 
	//    		methodName = method.$name;
	//    	
	//    	me.unDocH();
	//    	
	//    	parentClass[methodName].apply(this, [this.de, this]);
	//    	
	//    	me.dtimer = -1;
	//    	me.spoint = null;
	//    },
	
	    destroy : function(){
	        this.callParent();
	//        if (this.containerScroll) {
	//            Ext.dd.ScrollManager.unregister(this.el);
	//        }
	    }
	});
}

IG$/*mainapp*/.cMa/*DataGridView*/.prototype.initializeDragDrop = function(el) {
	var grid = this;
	
	this.DF/*dropFeedback*/ = $('<div class="m-datagrid-feedback"></div>');
	this.DF/*dropFeedback*/.appendTo(this.owner);
	this.DF/*dropFeedback*/.hide();
	
//	this.dragZone = Ext.create(IG$/*mainapp*/.DmU/*datawebgridext*/, el, {
//		owner: grid,
//		
//		ddGroup: '_I$RD_G_',
//		
//        getDragData: function(e) {
//        	var px = e.browserEvent.pageX || e.browserEvent.clientX,
//        		py = e.browserEvent.pageY || e.browserEvent.clientY,
//        		renderer = grid.getRendererByPoint(px, py),
//        		cell,
//        		d, srcel;
//        		
//            if (renderer) {
//            	cell = renderer.cl/*name cell*/;
//            	if (cell.position == 1 || cell.position == 2 || (cell.position == 3 && cell.title == 1))
//            	{
//            		grid.isDragging = true;
//            		srcel = renderer[0];
//            		d = srcel.cloneNode(true);
//	                d.id = Ext.id();
//	                return grid.dragData = {
//	                    sourceEl: srcel,
//	                    repairXY: Ext.fly(srcel).getXY(),
//	                    ddel: d,
//	                    cellData: cell
//	                };
//            	}
//            }
//        },
//        
//        afterInvalidDrop: function(e) { 
//        	grid.isDragging = false;
//        	
//        	if (this.dragData && this.dragData.cellData && grid._ILb/*sheetoption*/)
//        	{
//        		var sop = grid._ILb/*sheetoption*/,
//        			cell = this.dragData.cellData,
//        			tgt;
//        		
//        		if (cell.position == 1)
//        		{
//        			tgt = sop.rows;
//        		}
//        		else if (cell.position == 2)
//        		{
//        			tgt = sop.cols;
//        		}
//        		else if (cell.position == 3)
//        		{
//        			tgt = sop.measures;
//        		}
//        		
//        		if (tgt)
//        		{
//        			grid.fireEvent.call(grid, 'pivotchanged');
//        			tgt.splice(cell.index, 1);
//        			grid.sheetobj._IP4/*procUpdateReport*/.call(grid.sheetobj);
//        		}
//        	}
//        },
//
////      Provide coordinates for the proxy to slide back to on failed drag.
////      This is the original XY coordinates of the draggable element.
//        getRepairXY: function() {
//        	grid.isDragging = false;
//            return this.dragData.repairXY;
//        },
//        
//    	b4Drag: function(e) {
//    		this.setDragElPos(e.getPageX(), e.getPageY());
//    	},
//    	
//    	onStartDrag: function(data, e) {
//    		grid.isDragging = true;
//    	},
//    	
//    	onBeforeDrag: function(data, e){
//            return this.callParent(arguments);
//        },
//        
//        onEndDrag: function(data, e) {
//        	grid.isDragging = false;
//        }
//    });
//    
//	this.dropZone = Ext.create('Ext.dd.DropZone', el, {
//		ddGroup: '_I$RD_G_',
//		
//		nodeouttimer: -1,
//		
//		getTargetFromEvent: function(e) {
//			var px = e.browserEvent.pageX || e.browserEvent.clientX,
//        		py = e.browserEvent.pageY || e.browserEvent.clientY,
//        		p = Ext.dd.Registry.getTargetFromEvent(e) || e.getTarget(),
//        		renderer = grid.getRendererByPoint(px, py); // (p ? grid.getRendererByPoint(px, py) : null);
//        	
//        	if (renderer == null)
//        	{
//        		renderer = el;
//        	}
//        	
//            return renderer;
//        },
//        
//        notifyOut : function(dd, e, data){
//	        if(this.lastOverNode){
//	            this.onNodeOut(this.lastOverNode, dd, e, data);
//	            this.lastOverNode = null;
//	        }
//	        
//	        grid.isDragging = false;
//        	grid.hideDropFeedback.call(grid, e);
//        	
//        	if (this.accept == true && this.pivotmove == true)
//        	{
//        		if (grid.sheetobj)
//        		{
//        			if (this.nodeouttimer > -1)
//	        		{
//	        			clearTimeout(this.nodeouttimer);
//	        		}
//        			
//        			this.nodeouttimer = setTimeout(function() {
//        				grid.hideDropFeedback.call(grid, e);
//        			}, 300);
//        			// grid.sheetobj._IP4/*procUpdateReport*/.call(grid.sheetobj);
//        		}
//        	}
//	    },
//	    
//        onNodeEnter : function(target, dd, e, data){
//        	grid.isDragging = true;
//        	
//        	var i,
//        		dt, dttype,
//        		sop = grid._ILb/*sheetoption*/,
//        		hasitem = false,
//        		accept = false,
//        		pivotmove = false;
//        		
//        	if (data.records && data.records.length > 0 && sop)
//        	{
//        		dt = data.records[0].data;
//        		dttype = dt.type.toLowerCase();
//        		
//        		if (dt && grid.getTypeName(dttype) != "")
//        		{
//        			$.each([sop.rows, sop.cols, sop.measures], function(index, key) {
//        				for (i=0; i < key.length; i++)
//        				{
//        					if (key[i].uid == dt.uid)
//        					{
//        						hasitem = true;
//        						return false;
//        					}
//        				}
//        			});
//        			
//        			if (hasitem == false)
//        			{
//        				accept = true;
//        			}
//        		}
//        	}
//        	else if (data.cellData)
//        	{
//        		dt = data.cellData;
//        		accept = true;
//        		pivotmove = true;
//        	}
//        	
//        	if (grid._ILb/*sheetoption*/ && grid._ILb/*sheetoption*/.enablepivot == false)
//        	{
//        		accept = false;
//        		pivotmove = false;
//        	}
//        		
//        	if (accept == true)
//        	{
//        		grid.showDropHelper.call(grid, pivotmove, dt);
//        	}
//        	
//        	this.pivotmove = pivotmove;
//        	this.accept = accept;
//        },
//        onNodeOut : function(target, dd, e, data){
//        	grid.isDragging = false;
//        	grid.hideDropFeedback.call(grid, e);
//        },
//        onNodeOver : function(target, dd, e, data){
//        	var dt,
//        		ret = ((this.accept == true) ? Ext.dd.DropZone.prototype.dropAllowed : Ext.dd.DropZone.prototype.dropNotAllowed);
//        	if (this.accept == true)
//        	{
//        		if (data.records && data.records.length > 0)
//        		{
//        			dt = data.records[0].data;
//        		}
//        		else
//        		{
//        			dt = data.cellData;
//        		}
//        		
//        		grid.showDropFeedback.call(grid, e, this.pivotmove, dt);
//        	}
//            return ret;
//        },
//        onNodeDrop : function(target, dd, e, data){
//        	grid.hideDropFeedback.call(grid, e);
//        	
//            if (this.accept == true)
//            {
//            	if (data.records && data.records.length > 0)
//        		{
//        			dt = data.records[0].data;
//        		}
//        		else
//        		{
//        			dt = data.cellData;
//        		}
//        		
//        		grid.isDragging = false;
//        		grid.onDropPivot.call(grid, e, this.pivotmove, dt);
//            }
//            
//            this.accept = false;
//            return true;
//        }
//	});
};

IG$/*mainapp*/.cMa/*DataGridView*/.prototype.isAllowedType = function(dttype) {
	var r = false,
		dtypename = this.getTypeName(dttype);
	if (dtypename == "d" || dtypename == "m")
	{
		r = true;
	}
	return r;
}

IG$/*mainapp*/.cMa/*DataGridView*/.prototype.getTypeName = function(dttype) {
	var r = "";
	if (dttype == "measure" || dttype == "formulameasure" || dttype == "measuregroup")
	{
		r = "m";
	}
	else if (dttype == "metric" || dttype == "custommetric" || dttype == "tabdimension" || dttype == "measuregroupdimension")
	{
		r = "d";
	}
	return r;
};

//IG$/*mainapp*/.cMa/*DataGridView*/.prototype.addFeedbackLine = function(x1, y1, x2, y2, color) {
//	var dv = $("<div class='m-datagrid-feedline'></div>");
//	this.DF/*dropFeedback*/.append(dv);
//	dv.css({top: y1, left: x1, width: (x2-x1), height: (y2 - y1), backgroundColor: color});
//	return dv;
//};

//IG$/*mainapp*/.cMa/*DataGridView*/.prototype.showDropHelper = function(pivotmove, dt) {
//	var me = this,
//		i,
//		itemtype = "d",
//		sop = this._ILb/*sheetoption*/;
//	
//	me.DF/*dropFeedback*/.empty();
//	me.DF/*dropFeedback*/.show();
//	// me.DF/*dropFeedback*/.css({zIndex: this.mmax + 14});
//	
//	me.helpers = [];
//	
//	if (pivotmove == true)
//	{
//		if (dt.position == 3)
//		{
//			itemtype = "m";
//		}
//	}
//	else
//	{
//		itemtype = dt.type.toLowerCase();
//		itemtype = this.getTypeName(itemtype);
//	}
//	
//	var w = (me.canvaswidth > 0) ? Math.min(me.canvaswidth, me.DF/*dropFeedback*/.width() - 8) : me.DF/*dropFeedback*/.width() - 8,
//		h = (me.canvasheight > 0) ? Math.min(me.canvasheight, me.DF/*dropFeedback*/.height() - 8) : me.DF/*dropFeedback*/.height() - 8,
//		frow = [],
//		fcol = [],
//		frwidth = 0,
//		frheight = 0;
//		t = 0;
//	
//	frow.push(0);
//	
//	for (i=0; i < me.fixedCol; i++)
//	{
//		t += me.cols[i].w();
//		frow.push(t);
//	}
//	
//	frwidth = t;
//	
//	t = 0;
//	fcol.push(0);
//	
//	for (i=0; i < me.fixedRow; i++)
//	{
//		t += me.rows[i].height;
//		fcol.push(t);
//	}
//	
//	frheight = t;
//	
//	var dv,
//		x1=0, x2, y1=frheight, y2=h, thickness=3, margin=4,
//		color="#5A5A5A";
//	
//	if (!(itemtype == "m" && pivotmove == false))
//	{
//		y1 += margin;
//		y2 -= margin;
//		for (i=0; i < frow.length; i++)
//		{
//			x1 = Math.min(frow[i], w);
//			x2 = x1 + thickness;
//			dv = me.addFeedbackLine(x1, y1, x2, y2, color);
//		}
//		
//		x1 = frwidth + margin;
//		x2 = w - margin;
//		y1 = 0;
//		
//		for (i=0; i < fcol.length; i++)
//		{
//			y1 = Math.min(fcol[i], h);
//			y2 = y1 + thickness;
//			dv = me.addFeedbackLine(x1, y1, x2, y2, color);
//		}
//	}
//	
//	if (itemtype == "m" && me.rows.length > 0 && me.cols.length > 0 && ((me._ILb/*sheetoption*/.measures.length > 1 && pivotmove == true) || (pivotmove == false)))
//	{
//		var measurelocation = me._ILb/*sheetoption*/.measurelocation,
//			measureposition = me._ILb/*sheetoption*/.measureposition,
//			measureindex,
//			measurerow,
//			fbetween = [];
//		
//		if (measurelocation == "column")
//		{
//			measureindex = me._ILb/*sheetoption*/.cols.length - measureposition;
//			measurerow = me.renderers[measureindex];
//			t = frwidth;
//			fbetween.push(t);
//			
//			for (i=me.fixedCol; i < me.cols.length; i++)
//			{
//				if (measurerow && measurerow[i] && measurerow[i].cl/*name cell*/.merged < 3)
//				{
//					t += (me.renderers[measureindex][i].p[2] - me.renderers[measureindex][i].p[0]);
//					fbetween.push(t);
//				}
//			}
//			x1 = frwidth;
//			t = 0;
//			y1 = 0;
//			for (i=0; i < measureindex; i++)
//			{
//				y1 += me.rows[i].height;
//				t += me.rows[i].height;
//			}
//			y1 += margin;
//			y2 = y1 + me.rows[measureindex].height - margin;
//			
//			for (i=0; i < fbetween.length; i++)
//			{
//				x1 = Math.min(fbetween[i], w);
//				x2 = x1 + thickness;
//				dv = me.addFeedbackLine(x1, y1, x2, y2, color);
//			}
//		}
//		else if (measurelocation == "row")
//		{
//			measureindex = me._ILb/*sheetoption*/.rows.length - measureposition;
//			t = frheight;
//			fbetween.push(t);
//			for (i=me.fixedRow; i < me.rows.length; i++)
//			{
//				if (me.renderers.length > i && me.renderers[i][measureindex].cl/*name cell*/.merged < 3)
//				{
//					// t += this.rows[i].height;
//					t += (me.renderers[i][measureindex].p[3] - me.renderers[i][measureindex].p[1]);
//					fbetween.push(t);
//				}
//			}
//			y1 = frheight;
//			t = 0;
//			x1 = 0;
//			for (i=0; i < measureindex; i++)
//			{
//				x1 += me.cols[i].w();
//				t += me.cols[i].w();
//			}
//			
//			x1 += margin;
//			x2 = x1 + me.cols[measureindex].w() - margin;
//			
//			for (i=0; i < fbetween.length; i++)
//			{
//				y1 = Math.min(fbetween[i], h);
//				y2 = y1 + thickness;
//				dv = me.addFeedbackLine(x1, y1, x2, y2, color);
//			}
//		}
//	}
//};

//IG$/*mainapp*/.cMa/*DataGridView*/.prototype.onDropPivot = function(ev, pivotmove, dt) {
//	var me = this,
//		pivotchanged = false,
//		sop = me._ILb/*sheetoption*/,
//		px = ev.browserEvent.pageX || ev.browserEvent.clientX,
//		py = ev.browserEvent.pageY || ev.browserEvent.clientY,
//		renderer = me.getRendererByPoint(px, py),
//		cell, i, 
//		dtype,
//		pivotitem,
//		sop = me._ILb/*sheetoption*/,
//		position = me.ctx.offset(),
//		dropindicator = me.dropindicator,
//		dropcase, redo = {
//			type: "none",
//			item: null,
//			index: -1,
//			target: null
//		};
//	
//	if (!dropindicator || dropindicator.dropcase == -1)
//	{
//		me.dropindicator = null;
//		return;
//	}
//	
//	dropcase = dropindicator.dropcase;
//	
//	var w = me.DF/*dropFeedback*/.width(),
//		h = me.DF/*dropFeedback*/.height(),
//		ri = (renderer) ? renderer.rowIndex : -1,
//		ci = (renderer) ? renderer.colIndex : -1,
//		measurelocation = sop.measurelocation,
//		measureposition = sop.measureposition,
//		tlocation, slocation,
//		measureindex = (sop.measurelocation == "row") ? sop.rows.length - measureposition : 
//			sop.cols.length - measureposition,
//		pindex, mindex,
//		dtindex = -1,
//		drindex = -1,
//		rindex;
//	
//	if (renderer)
//	{
//		var p = renderer.p,
//    		locx = "right",
//    		locy = "bottom";
//    	
//    	px = px - position.left;
//    	py = py - position.top;
//    	
//    	if (px < p[0] + (p[2] - p[0]) / 2)
//    	{
//    		locx = "left";
//    	}
//    	if (py < p[1] + (p[3] - p[1]) / 2)
//    	{
//    		locy = "top";
//    	}
//    	
//    	cell = renderer.cl/*name cell*/;
//	}
//	
//	if (pivotmove == false)
//	{
//		pivotitem = new IG$/*mainapp*/._IE8/*clItems*/(null);
//		pivotitem.uid = dt.uid;
//		pivotitem.nodepath = dt.nodepath;
//		pivotitem.name = dt.name;
//		pivotitem.itemtype = dt.type;
//		pivotitem.memo = dt.memo;
//		
//		dtype = dt.type.toLowerCase();
//		dtype = me.getTypeName(dtype);
//		
//		redo.type = "add";
//		redo.item = pivotitem;
//	}
//	else 
//	{
//    	if (dt.position == 1)
//		{
//			dtype = "d";
//			dtindex = dt.index;
//			drindex = dtindex;
//			if (measurelocation == "row" && measureindex <= drindex)
//			{
//				drindex++;
//			}
//			slocation = sop.rows;
//			pivotitem = sop.rows[dtindex];
//		}
//		else if (dt.position == 2)
//		{
//			dtype = "d";
//			dtindex = dt.index;
//			drindex = dtindex;
//			if (measurelocation == "column" && measureindex <= drindex)
//			{
//				drindex++;
//			}
//			slocation = sop.cols;
//			pivotitem = sop.cols[dtindex];
//		}
//		else if (dt.position == 3)
//		{
//			dtype = "m";
//			dtindex = dt.index;
//			slocation = sop.measures;
//			pivotitem = sop.measures[dtindex];
//		}
//    	
//    	if (!pivotitem)
//    		return;
//    		
//    	redo.type = "move";
//		redo.item = pivotitem;
//	}
//		
//	switch (dropcase)
//	{
//	case 99:	// append in no items
//		if (dtype == "m")
//		{
//			sop.measures.push(pivotitem);
//		}
//		else if (dtype == "d")
//		{
//			sop.rows.push(pivotitem);
//		}
//		pivotchanged = true;
//		break;
//	case 0:		// append dimension on row
//	case 2: 	// append dimension on row measure location
//		rindex = dropindicator.ci;
//		if (drindex != rindex || dt.position != cell.position)
//		{
//			if (slocation)
//			{
//				if (measurelocation == "row" && measureindex < drindex)
//				{
//					measureposition--;
//				}
//				slocation.splice(dtindex, 1);
//				redo.plocation = slocation;
//				redo.pindex = dtindex;
//			}
//			if (measurelocation == "row" && measureindex < rindex)
//			{
//				measureposition++;
//			}
//			sop.rows.splice(rindex, 0, pivotitem);
//			sop.measureposition = measureposition;
//			pivotchanged = true;
//		}
//		break;
//	case 1:		// append dimension on column
//	case 3: 	// append dimension on column measure location
//		rindex = dropindicator.ri;
//		if (drindex != rindex || dt.position != cell.position)
//		{
//			if (slocation)
//			{
//				if (measurelocation == "column" && measureindex < drindex)
//				{
//					measureposition--;
//				}
//				slocation.splice(dtindex, 1);
//				redo.plocation = slocation;
//				redo.pindex = dtindex;
//			}
//			if (measurelocation == "column" && measureindex < rindex)
//			{
//				measureposition++;
//			}
//			sop.cols.splice(rindex, 0, pivotitem);
//			sop.measureposition = measureposition;
//			pivotchanged = true;
//		}
//		break;
//	case 10:	// move measurelocation row
//		rindex = dropindicator.ci;
//		if (sop.measurelocation == "row" && measureindex < rindex && rindex > 0)
//		{
//			rindex--;
//		}
//		if (sop.measureposition != sop.rows.length - rindex || sop.measurelocation == "column")
//		{
//			redo.type = "measurelocation";
//			redo.measureposition = sop.measureposition;
//			redo.measurelocation = sop.measurelocation;
//			
//			sop.measureposition = sop.rows.length - rindex;
//			sop.measurelocation = "row";
//			pivotchanged = true;
//			
//			redo.item = null;
//		}
//		break;
//	case 11:	// move measurelocation column
//		rindex = dropindicator.ri;
//		if (sop.measurelocation == "column" && measureindex < rindex && rindex > 0)
//		{
//			rindex--;
//		}
//		if (sop.measureposition != sop.cols.length - rindex || sop.measurelocation == "row")
//		{
//			redo.type = "measurelocation";
//			redo.measureposition = sop.measureposition;
//			redo.measurelocation = sop.measurelocation;
//			
//			sop.measureposition = sop.cols.length - rindex;
//			sop.measurelocation = "column";
//			pivotchanged = true;
//		}
//		break;
//	case 12:	// move measure on measure
//		rindex = dropindicator.di;
//		if (dtindex != rindex)
//		{
//			if (slocation)
//			{
//				if (rindex > dtindex && rindex > 0)
//				{
//					rindex--;
//				}
//				slocation.splice(dtindex, 1);
//				redo.plocation = slocation;
//				redo.pindex = dtindex;
//			}
//			sop.measures.splice(rindex, 0, pivotitem);
//			redo.type = "move";
//			redo.item = pivotitem;
//			redo.position = dtindex;
//			pivotchanged = true;
//		}
//		break;
//	}
//	
//	if (pivotchanged == true && me.sheetobj)
//	{
//		me.fireEvent.call(me, 'pivotchanged');
//		me.sheetobj._IP2/*registerUndo*/.call(me.sheetobj, redo);
//		me.sheetobj._IP4/*procUpdateReport*/.call(me.sheetobj);
//	}
//};

//IG$/*mainapp*/.cMa/*DataGridView*/.prototype.showDropFeedback = function(ev, pivotmove, dt) {
//	var me = this,
//		px = ev.browserEvent.pageX || ev.browserEvent.clientX,
//		py = ev.browserEvent.pageY || ev.browserEvent.clientY,
//		renderer = this.getRendererByPoint(px, py),
//		cell, i,
//		dropindicator,
//		sop = me._ILb/*sheetoption*/,
//		measureposition = sop.measureposition,
//		measureindex = (sop.measurelocation == "row") ? sop.rows.length - measureposition : 
//			sop.cols.length - measureposition,
//		position = this.ctx.offset();
//	
//	me.dropindicator = dropindicator = {
//		dropcase: -1
//	}; 
//	
//    if (renderer) 
//    {
//    	var p = renderer.p,
//    		locx = "right",
//    		locy = "bottom";
//    	
//    	px = px - position.left;
//    	py = py - position.top;
//    	
//    	if (px < p[0] + (p[2] - p[0]) / 2)
//    	{
//    		locx = "left";
//    	}
//    	if (py < p[1] + (p[3] - p[1]) / 2)
//    	{
//    		locy = "top";
//    	}
//    	
//    	cell = renderer.cl/*name cell*/;
//    }
//    
//	if (this.feedline)
//	{
//		this.feedline.remove();
//	}
//	
//	var w = (this.canvaswidth > 10) ? Math.min(this.canvaswidth - 8, this.DF/*dropFeedback*/.width() - 8) : this.DF/*dropFeedback*/.width() - 8,
//		h = (this.canvasheight > 10) ? Math.min(this.canvasheight - 8, this.DF/*dropFeedback*/.height() - 8) : this.DF/*dropFeedback*/.height() - 8,
//		thickness = 4,
//		frheight = 0,
//		frwidth = 0,
//		x1, x2, y1, y2,
//		color = "#ff0000",
//		ri = (renderer ? renderer.rowIndex : -1),
//		ci = (renderer ? renderer.colIndex : -1),
//		di = (cell ? cell.index : -1),
//		cp = (cell ? cell.position : -1),
//		dtype,
//		sop = this._ILb/*sheetoption*/,
//		measurelocation = sop.measurelocation,
//		measureposition = sop.measureposition,
//		dropcase = -1,
//		margin = 4;
//		
//	if (this.treeCol > -1 || this.treeRow > -1)
//	{
//		if (ri < this.fixedRow)
//		{
//			ri = (di > -1) ? di : ri;
//		}
//		if (ci < this.fixedCol)
//		{
//			ci = (di > -1) ? di : ci;
//		}
//	}
//		
//	if (pivotmove == false)
//	{
//		dtype = (pivotmove == false && dt) ? dt.type.toLowerCase() : "";
//		dtype = this.getTypeName(dtype);
//	}
//	else
//	{
//		if (dt.position == 1 || dt.position == 2)
//		{
//			dtype = "d";
//		}
//		else if (dt.position == 3)
//		{
//			dtype = "m";
//		}
//	}
//	
//	for (i=0; i < this.fixedRow; i++)
//	{
//		frheight += this.rows[i].height;
//	}
//	
//	for (i=0; i < this.fixedCol; i++)
//	{
//		frwidth += this.cols[i].w();
//	}
//	
//	if (sop.rows.length + sop.cols.length + sop.measures.length == 0)
//	{
//		dropcase = 99; // append in no items
//	}
//	else if (dtype == "d")
//	{
//		switch (cp)
//		{
//		case 1:
//			dropcase = 0;	// append dimension on row
//			break;
//		case 2:
//			dropcase = 1;	// append dimension on column
//			break;
//		case 3:
//			if (cell && cell.title == 1)
//			{
//				dropcase = (measurelocation == "row") ? 2 // append dimension on row measure location
//					: 3; // append dimension on column measure location
//			}
//			break;
//		}
//	}
//	else if (dtype == "m")
//	{
//		switch (cp)
//		{
//		case 1:
//			if (pivotmove == true)
//			{
//				dropcase = 10;	// move measurelocation row
//			}
//			else
//			{
//				dropcase = 99;
//			}
//			break;
//		case 2:
//			if (pivotmove == true)
//			{
//				dropcase = 11;	// move measurelocation column
//			}
//			else
//			{
//				dropcase = 99;
//			}
//			break;
//		case 3:
//			if (cell && cell.title == 1)
//			{
//				dropcase = 12;		// move measure on measure
//				if (pivotmove == true && sop.measures.length < 2)
//				{
//					dropcase = -1;
//				}
//			}
//			else if (pivotmove == false)
//			{
//				dropcase = 99;
//			}
//			else
//			{
//				if (sop.cols.length == 0 && measurelocation == "row")
//				{
//					dropcase = 11; // move measurelocation column
//					locy = "top";
//					ri = 0;
//				}
//				else if (sop.rows.length == 0 && measurelocation == "column")
//				{
//					dropcase = 10; // move measurelocation row
//					locx = "left";
//					ci = 0;
//				}
//			}
//			break;
//		}
//	}
//	
//	dropindicator.dropcase = dropcase;
//	
//	switch (dropcase)
//	{
//	case 99: 	// append in no items
//		if (dtype == "m" && sop.measures.length > 0)
//		{
//			if (measurelocation == "column")
//			{
//				x1 = w;
//				y1 = frheight + margin;
//				x2 = x1 + thickness;
//				y2 = h;
//			}
//			else
//			{
//				x1 = frwidth + margin;
//				y1 = h;
//				x2 = w;
//				y2 = y1 + thickness;
//			}
//		}
//		else
//		{
//			x1 = 0;
//    		y1 = margin;
//    		x2 = x1 + thickness;
//    		y2 = h;
//		}
//		this.feedline = this.addFeedbackLine(x1, y1, x2, y2, color);
//		break;
//	case 0:		// append dimension on row
//	case 2: 	// append dimension on row measure location
//		x1 = 0;
//		y1 = frheight + margin;
//		y2 = h;
//		ci = (locx == "left") ? ci : ci + 1;
//		
//		if (this.treeCol > -1)
//		{
//			x1 += this.cols[0].w();
//		}
//		else
//		{
//			for (i=0; i < ci; i++)
//			{
//				x1 += this.cols[i].w();
//			}
//		}
//		
//		x1 = Math.min(x1, w);
//		x2 = x1 + thickness;
//		dropindicator.ci = ci;
//		dropindicator.ri = ri;
//		
//		this.feedline = this.addFeedbackLine(x1, y1, x2, y2, color);
//		break;
//	case 1:		// append dimension on column
//	case 3: 	// append dimension on column measure location
//		x1 = frwidth + margin;
//		y1 = 0;
//		x2 = w;
//		ri = (locy == "top") ? ri : ri + 1;
//		
//		for (i=0; i < ri; i++)
//		{
//			y1 += this.rows[i].h();
//		}
//		
//		y1 = Math.min(y1, h);
//		y2 = y1 + thickness;
//		dropindicator.ci = ci;
//		dropindicator.ri = ri;
//		
//		this.feedline = this.addFeedbackLine(x1, y1, x2, y2, color);
//		break;
//	case 10:	// move measurelocation row
//		x1 = 0;
//		y1 = frheight + margin;
//		y2 = h;
//		ci = (locx == "left") ? ci : ci + 1;
//		
//		for (i=0; i < ci; i++)
//		{
//			x1 += this.cols[i].w();
//		}
//		
//		x2 = x1 + thickness;
//		dropindicator.ci = ci;
//		dropindicator.ri = ri;
//		
//		this.feedline = this.addFeedbackLine(x1, y1, x2, y2, color);
//		break;
//	case 11:	// move measurelocation column
//		x1 = frwidth + margin;
//		y1 = 0;
//		x2 = w;
//		
//		ri = (locy == "top") ? ri : ri + 1;
//		
//		for (i=0; i < ri; i++)
//		{
//			y1 += this.rows[i].h();
//		}
//		
//		dropindicator.ci = ci;
//		dropindicator.ri = ri;
//		
//		y2 = y1 + thickness;
//		this.feedline = this.addFeedbackLine(x1, y1, x2, y2, color);
//		break;
//	case 12:	// move measure on measure
//		if (measurelocation == "row")
//		{
//			x1 = margin;
//    		y1 = 0;
//    		ri = (locy == "top") ? ri : ri + 1;
//    		di = (locy == "top") ? di : di + 1;
//    		for (i=0; i < ci; i++)
//    		{
//    			x1 += this.cols[i].w();
//    		}
//    		
//    		x2 = x1 + this.cols[ci].w() - margin * 2;
//    		
//    		for (i=0; i < ri; i++)
//    		{
//    			y1 += this.rows[i].h();
//    		}
//    		y2 = y1 + thickness;
//    		dropindicator.ci = ci;
//			dropindicator.ri = ri;
//			dropindicator.di = di;
//    		this.feedline = this.addFeedbackLine(x1, y1, x2, y2, color);
//		}
//		else if (measurelocation == "column")
//		{
//			x1 = 0;
//    		y1 = margin;
//    		x2 = 0;
//    		
//    		ci = (locx == "left") ? ci : ci + 1;
//    		di = (locx == "left") ? di : di + 1;
//    		
//    		for (i=0; i < ri; i++)
//    		{
//    			y1 += this.rows[i].h();
//    		}
//    		
//    		y2 = y1 + this.rows[ri].h() - margin * 2;
//    		
//    		for (i=0; i < ci; i++)
//    		{
//    			x1 += this.cols[i].w();
//    		}
//    		x2 = x1 + thickness;
//    		dropindicator.ci = ci;
//			dropindicator.ri = ri;
//			dropindicator.di = di;
//    		this.feedline = this.addFeedbackLine(x1, y1, x2, y2, color);
//		}
//		break;
//	case 13:
//		break;
//	}
//}

//IG$/*mainapp*/.cMa/*DataGridView*/.prototype.hideDropFeedback = function(ev) {
//	this.DF/*dropFeedback*/.hide();
//}

if (!window.Ext)
{
	window.Ext = null;
}

qigridview.prototype = new IG$/*mainapp*/.cMa/*DataGridView*/();
qigridview.prototype.constructor = qigridview;
qigridview.prototype.parent = IG$/*mainapp*/.cMa/*DataGridView*/.prototype;

function qigridview(option) {
	this.createComponent();
	
	this.editable = true;
	this.enablecontextmenu = false;	
	this.scrollbar = "image";
	this.drawmode = (option ? option.drawmode || "req" : "req");
	this.columnfill = (option && option.columnfill == true ? true : false);
	
	this.processRowFunction = option ? option.processRowFunction : null;
	
	this.initStyles();
	
	if (option)
	{
		this.merge(option);
	}
}

qigridview.prototype.initStyles = function() {
	var mstyle;
	this.styles = {
		"normal": {
			name: "normal",
			fontsize: 11,
			color: 0x000000,
			backcolor1: 0xffffff,
			padtop: 4,
			padbottom: 4,
			padright: 2,
			padleft: 2,
			formatstring: null,
			textalign: "4"
		}
	};
	
	mstyle = this.addStyle("fixedrow");
	mstyle.padtop = 2;
	mstyle.padbottom = 2;
	mstyle.textalign = "5";
	mstyle.backcolor1 = 0x0d5995;
	mstyle.color = 0xffffff;
	
	mstyle = this.addStyle("fixedcolumn");
	
	mstyle = this.addStyle("numeric");
	mstyle.formatstring = "#,###";
	mstyle.textalign = "6";
	
	mstyle = this.addStyle("boolean");
	mstyle.textalign = "5";
	
	mstyle = this.addStyle("grandtotal", "numeric");
	mstyle.backcolor1 = 0xfdfebe;
	
	mstyle = this.addStyle("subtotal", "numeric");
	mstyle.backcolor1 = 0xfdfebe;
	
	mstyle = this.addStyle("grandtotallabel");
	mstyle.backcolor1 = 0xfdfebe;
	
	mstyle = this.addStyle("subtotallabel");
	mstyle.backcolor1 = 0xfdfebe;
}

qigridview.prototype.addStyle = function(stylename, basestyle) {
	var me = this,
		base = me.styles[basestyle],
		s, key;
	
	if (!base)
	{
		base = me.styles["normal"];
	}
		
	s = {
		name: stylename
	};
	
	for (key in base)
	{
		if (key != "name")
		{
			s[key] = base[key];
		}
	}
	
	me.styles[s.name] = s;
	
	return s;
}

qigridview.prototype.merge = function(option) {
	var key,
		me = this,
		value = option;
		
	for (key in value)
	{
		if(typeof(me[key]) != "undefined")
		{
			me[key] = value[key];
		}
	}
}

qigridview.prototype.setColumns = function(columns, subtotal, template) {
	var me = this,
		i, j,
		dp = [], cols = [], depth, row,
		subinfo;
	
	me.subtotal = subtotal;
	me.template = template;
	
	if (columns)
	{
		me.columns = columns;
		
		subinfo = me.calculateDepth(columns, cols, 0, 0, null);
		depth = subinfo.depth;
		
		for (i=0; i < depth+1; i++)
		{
			row = [];
			for (j=0; j < cols.length; j++)
			{
				row.push(null);
			}
			dp.push(row);
		}
		
		me.makeHeaderData(dp, columns, 0, 0);
		
		me.colcount = (dp && dp.length > 0) ? dp[0].length : 0;
		me.rowcount = dp.length;
		me.fixedRow = dp.length;
		me.setDataProvider(dp);
	}
	
	me.columns = cols;
	return cols;
}

qigridview.prototype.calculateDepth = function(columns, cols, depth, start, defaults) {
	var i,
		st,
		key,
		ret = {
			depth: 0,
			cols: 0
		},
		subinfo, ncols=0;
	
	for (i=0; i < columns.length; i++)
	{
		if (columns[i].columns && columns[i].columns.length > 0)
		{
			subinfo = this.calculateDepth(columns[i].columns, cols, depth+1, i, columns[i].defaults || defaults);
			depth = subinfo.depth;
			ret.cols += subinfo.cols;
			ncols += subinfo.cols;
			start += subinfo.cols;
		}
		else
		{
			if (defaults)
			{
				for (key in defaults)
				{
					columns[i][key] = defaults[key];
				}
			}
			if (columns[i].type == "numeric")
			{
				columns[i].stylename = columns[i].stylename || "numeric";
			}
			else if (columns[i].type == "boolean")
			{
				columns[i].stylename = columns[i].stylename || "boolean";
			}
			
			if (columns[i].formatstring)
			{
				st = this.addStyle("column_" + (i + start), (columns[i].stylename || "normal"));
				st.formatstring = columns[i].formatstring;
				columns[i].stylename = st.name;
			}
			
			cols.push(columns[i]);
			ret.cols++;
			ncols++;
		}
	}
	
	ret.depth = depth;
	
	return ret;
}

qigridview.prototype.makeHeaderData = function(dp, columns, depth, startcol) {
	var me = this,
		i, j,
		cell,
		r = 0,
		subcnt;
	
	for (i=0; i < columns.length; i++)
	{
		cell = {
			text: columns[i].name || columns[i].field, 
			mrow:0, 
			mcol:0, 
			merged:0, 
			stylename: columns[i].headerstyle || "fixedrow", 
			chart:null,
			position: -1,
			code: null,
			value: null,
			index: -1,
			title: -1,
			pindex: -1
		};
			
		if (columns[i].columns && columns[i].columns.length > 0)
		{
			for (j=0; j < columns[i].columns.length; j++)
			{
				cell = me.ocopy(cell);
				cell.merged = (j == 0) ? 2 : 4;
				dp[depth][r+j+startcol] = cell;
			}
			
			subcnt = me.makeHeaderData(dp, columns[i].columns, depth+1, r);
			r += subcnt;
		}
		else
		{
			for (j=depth; j < dp.length; j++)
			{
				cell = me.ocopy(cell);
				cell.merged = (j == depth) ? 1 : 3;
				cell.type = "string";
				dp[j][r+startcol] = cell;
			}
			
			r++;
		}
	}
	
	return r;
}

qigridview.prototype.ocopy = function(obj) {
	var nobj = {},
		key;
	
	for (key in obj)
	{
		nobj[key] = obj[key];
	}
	
	return nobj;
}

qigridview.prototype.setDataProvider = function(value, xredraw) {
	if (!value)
		return;
	
	var me = this,
		columns = me.columns,
		i;
	
	qigridview.prototype.parent.setDataProvider.call(me, value, false);
	
	for (i=0; i < columns.length; i++)
	{
		if (columns[i].minwidth)
		{
			me.cols[i].width = Math.max(me.cols[i].width, columns[i].minwidth);
		}
		
		if (columns[i].maxwidth)
		{
			me.cols[i].width = Math.min(me.cols[i].width, columns[i].maxwidth);
		}
		
		me.cols[i].type = columns[i].type;
	}
	
	if (xredraw !== false)
	{
		me.redraw();
	}
}

qigridview.prototype.loadData = function(data) {
	var me = this,
		dp = me.dataProvider,
		i, j, cell, 
		columns = me.columns, 
		row, st, ndp;
		
	if (dp.length > me.fixedRow)
	{
		dp.splice(me.fixedRow, dp.length - me.fixedRow);
	}
	
	if (data)
	{
		me.getRowData(data, dp);
		ndp = me.updateSubtotal(dp);
		dp = (ndp ? ndp : dp);
		me.updateMerge(dp);
	}
	
	me.setDataProvider(dp);
}

qigridview.prototype.formatString = function(value, format) {
	value = this.format(Number(value), format);
	return value;
}

qigridview.prototype.format = function(value, format) {
	if (typeof(format) != 'string') 
		return ''; // sanity check

	var hasComma = -1 < format.indexOf(','),
		psplit = this.j5(format).split('.'),
		that = value;

	// compute precision
	if (1 < psplit.length) {
		// fix number precision
		that = that.toFixed(psplit[1].length);
	}
	// error: too many periods
	else if (2 < psplit.length) {
		throw('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
	}
	// remove precision
	else {
		that = that.toFixed(0);
	}

	// get the string now that precision is correct
	var fnum = that.toString();

	// format has comma, then compute commas
	if (hasComma) {
		// remove precision for computation
		psplit = fnum.split('.');
		
		var cnum = psplit[0],
			parr = [],
			j = cnum.length,
			m = Math.floor(j / 3),
			n = cnum.length % 3 || 3; // n cannot be ZERO or causes infinite loop

		// break the number into chunks of 3 digits; first chunk may be less than 3
		for (var i = 0; i < j; i += n) {
			if (i != 0) {n = 3;}
			parr[parr.length] = cnum.substr(i, n);
			m -= 1;
		}

		// put chunks back together, separated by comma
		fnum = parr.join(',');

		// add the precision back in
		if (psplit[1]) {fnum += '.' + psplit[1];}
	}

	// replace the number portion of the format with fnum
	return format.replace(/[\d,?,#\.?,#]+/, fnum);
};

qigridview.prototype.j5 = function(str) {
  str += '';
  var rgx = /^\d|\.|\#|-$/;
  var out = '';
  for( var i = 0; i < str.length; i++ )
  {
    if( rgx.test( str.charAt(i) ) ){
      if( !( ( str.charAt(i) == '.' && out.indexOf( '.' ) != -1 ) ||
             ( str.charAt(i) == '-' && out.length != 0 ) ) ){
        out += str.charAt(i);
      }
    }
  }
  return out;
}

qigridview.prototype.loadAjaxData = function(option) {
	var me = this;
	if (option)
	{
		option.datatype = option.datatype || "json";
		
		me.setLoading(true);
		
		$.ajax({
			type: option.method || "GET",
			url: option.url, 
			dataType: option.datatype || "json",
			data: option.data,
			timeout: 10000,
			success: function(data) {
				if (option.success)
				{
					option.success.call(option.scope || me, data);
				}
				me.processAjaxData.call(me, option, data, "load");
			},
			error: function(e, status, thrown) {
				me.setLoading(false);
			}
		});
	}
}

qigridview.prototype.appendAjaxData = function(option) {
	var me = this;
	if (option)
	{
		option.datatype = option.datatype || "json";
		
		me.setLoading(true);
		
		$.ajax({
			type: option.method || "GET",
			url: option.url, 
			dataType: option.datatype || "json",
			data: option.data,
			timeout: 10000,
			success: function(data) {
				me.processAjaxData.call(me, option, data, "append");
			},
			error: function(e, status, thrown) {
				me.setLoading(false);
			}
		});
	}
}

qigridview.prototype.processAjaxData = function(option, value, mode) {
	var me = this;
	
	me.setLoading(false);
	
	var i, j,
		dp = [],
		dataprovider = me.dataProvider;
	
	if (option.datatype == "xml")
	{
		var tnode = me.L7(value, option.rootnode),
			tnodes,
			row, ndp,
			tinfo;
			
		if (tnode)
		{
			tnodes = me.L14(tnode);
			
			for (i=0; i < tnodes.length; i++)
			{
				if (me.processRowFunction)
				{
					row = me.processRowFunction.call(me, me, tnodes[i]);
				}
				else
				{
					row = me.L10(tnodes[i]);
				}
				
				if (row)
				{
					dp.push(row);
					if (tnodes[i].hasChildNodes() == true)
					{
						tinfo = this.L14(tnodes[i]);
						for (j=0; j < tinfo.length; j++)
						{
							row[this.L17(tinfo[j])] = this.L12(tinfo[j]);
						}
					}
				}
			}
		}
	}
	else if (option.datatype == "json")
	{
		var rootnode = option.rootnode.split("/"),
			tnode,
			tnodes,
			row, ndp;
			
		if (rootnode.length > 0)
		{
			for (i=0; i < rootnode.length; i++)
			{
				if (i == 0)
				{
					tnode = value;
				}
				else
				{
					tnode = tnode[rootnode[i]];
				}
				
				if (!tnode)
				{
					// error with no data
				}
			}
			
			if (tnode)
			{
				tnodes = tnode;
				
				for (i=0; i < tnodes.length; i++)
				{
					if (me.processRowFunction)
					{
						row = me.processRowFunction.call(me, me, tnodes[i]);
					}
					else
					{
						row = tnodes[i];
					}
					
					if (row)
					{
						dp.push(row);
					}
				}
			}
		}
	}
	
	if (mode == "load")
	{
		me.dataFullLoaded = false;
		me.loadData(dp);
	}
	else if (mode == "append")
	{
		if (dp.length == 0)
		{
			me.dataFullLoaded = true;
		}
		else
		{
			me.getRowData(dp, dataprovider);
			ndp = me.updateSubtotal(dataprovider);
			me.dataProvider = dataprovider = ndp ? ndp : dataprovider;
			me.updateMerge(dataprovider);
			me.refreshData();
		}
	}
}

qigridview.prototype.updateSubtotal = function(dpdata) {
	var me = this,
		columns = me.columns,
		i, j, k,
		havesubtotal = false,
		dp = dpdata || me.dataProvider,
		subtotal,
		f, fval,
		fields = {},
		toplocate;
	
	for (i=0; i < columns.length; i++)
	{
		fields[columns[i].field] = i;
	}
	
	if (me.subtotal && me.subtotal.length > 0)
	{
		for (i=0; i < me.subtotal.length; i++)
		{
			f = me.subtotal[i];
			f.colindex = -1;
			
			if (f.field && typeof(fields[f.field]) != "undefined" && f.datafields && f.datafields.length > 0)
			{
				f.colindex = fields[f.field];
				f.pvalue = null;
				f.fcalc = [];
				f.topposition = -1;
				for (j=0; j < f.datafields.length; j++)
				{
					if (typeof(fields[f.datafields[j]]) != "undefined")
					{
						f.fcalc.push({
							field: f.datafields[j],
							colindex: fields[f.datafields[j]],
							sum: null,
							mbody: null
						});
					}
				}
			}
		}
		
		// remove subtotals
		for (i=dp.length-1; i >= me.fixedRow; i--)
		{
			if (dp[i][0].issubtotal == true)
			{
				dp.splice(i, 1);
			}
		}
		
		// calculate subtotals
		var ndp = [],
			crow, frow,
			nvalue;
			
		for (i=0; i < me.fixedRow; i++)
		{
			ndp.push(dp[i]);
		}
		
		for (i=me.fixedRow; i < dp.length; i++)
		{
			crow = dp[i];
			ndp.push(crow);
			
			for (j=0; j < me.subtotal.length; j++)
			{
				f = me.subtotal[j];
				
				if (f.colindex > -1)
				{
					toplocate = f.toplocate || false;
					
					for (k=0; k < f.fcalc.length; k++)
					{
						fval = Number(crow[f.fcalc[k].colindex].code || crow[f.fcalc[k].colindex].text);
						
						if (isNaN(fval) == false)
						{
							f.fcalc[k].sum = (f.fcalc[k].sum == null) ? fval : f.fcalc[k].sum + fval;
						}
					}
						
					if (f.isgrandtotal == true)
					{
						if (toplocate != true && i == dp.length - 1)
						{
							frow = me.addSubTotalRow(f, null);
							ndp.push(frow);
						}
						else if (toplocate == true && i == me.fixedRow)
						{
							frow = me.addSubTotalRow(f, null);
							f.srow = frow;
							ndp.splice(ndp.length-1, 0, frow);
						}
						else if (toplocate == true && i == dp.length - 1)
						{
							me.updateSubTotalRow(f, null);
						}
					}
					else
					{
						nvalue = (i+1 < dp.length ? dp[i+1][f.colindex].text : null);
						if (dp[i][f.colindex].text != nvalue)
						{
							frow = me.addSubTotalRow(f, crow[f.colindex]);
							if (toplocate == true)
							{
								if (f.topposition < 0)
								{
									f.topposition = me.fixedRow;
								}
								ndp.splice(f.topposition, 0, frow);
								f.srow = frow;
								me.updateSubTotalRow(f, crow[f.colindex]);
								f.topposition = ndp.length;
							}
							else
							{
								ndp.push(frow);
							}
							for (k=0; k < f.fcalc.length; k++)
							{
								f.fcalc[k].sum = null;
								f.fcalc[k].cnt = null;
							}
						}
					}
					f.pvalue = dp[i][f.colindex].text;
				}
			}
		}
		
		return ndp;
	}
	
	return null;
}

qigridview.prototype.addSubTotalRow = function(f, lcell) {
	var i,	
		me = this,
		columns = me.columns,
		nrow = [], col,
		cindex,
		cell, formatstring;
	
	for (i=0; i < columns.length; i++)
	{
		cell = {
			text: null, 
			mrow:0, 
			mcol:0, 
			merged:0, 
			stylename: null, 
			chart:null,
			position: -1,
			code: null,
			value: null,
			index: -1,
			title: -1,
			pindex: -1,
			issubtotal: true,
			type: "string"
		};
		
		if (i == f.colindex)
		{
			cell.text = (f.isgrandtotal == true) ? f.name : lcell.text;
			cell.stylename = f.labelstylename || (f.isgrandtotal ? "grandtotallabel" : "subtotallabel");
		}
		else if (f.isgrandtotal != true && i == f.colindex + 1)
		{
			cell.text = f.name;
			cell.stylename = f.labelstylename || (f.isgrandtotal ? "grandtotallabel" : "subtotallabel");
		}
		
		nrow.push(cell);
	}
	
	for (i=0; i < f.fcalc.length; i++)
	{
		cindex = f.fcalc[i].colindex;
		col = columns[cindex];
		cell = nrow[cindex];
		cell.code = f.fcalc[i].sum;
		cell.text = cell.code;
		
		cell.stylename = f.stylename || (f.isgrandtotal == true ? "grandtotal" : "subtotal");
		if (f.stylename && me.styles[f.stylename])
		{
			st = me.styles[f.stylename];
			formatstring = st.formatstring;
		}
		else if (col.stylename && me.styles[col.stylename])
		{
			st = me.styles[col.stylename];
			formatstring = st.formatstring;
		}
		
		if (formatstring)
		{
			cell.text = me.formatString(cell.code, formatstring);
		}
	}
	
	return nrow;
}

qigridview.prototype.updateSubTotalRow = function(f, lcell) {
	var i,	
		me = this,
		columns = me.columns,
		nrow = [], col,
		cindex,
		cell, formatstring,
		nrow = f.srow;
	
	if (nrow)
	{
		for (i=0; i < f.fcalc.length; i++)
		{
			cindex = f.fcalc[i].colindex;
			col = columns[cindex];
			cell = nrow[cindex];
			cell.code = f.fcalc[i].sum;
			cell.text = cell.code;
			
			cell.stylename = f.stylename || (f.isgrandtotal == true ? "grandtotal" : "subtotal");
			if (f.stylename && me.styles[f.stylename])
			{
				st = me.styles[f.stylename];
				formatstring = st.formatstring;
			}
			else if (col.stylename && me.styles[col.stylename])
			{
				st = me.styles[col.stylename];
				formatstring = st.formatstring;
			}
			
			if (formatstring)
			{
				cell.text = me.formatString(cell.code, formatstring);
			}
		}
	}
	
	return nrow;
}

qigridview.prototype.updateMerge = function(dpdata) {
	var me = this,
		columns = me.columns,
		mergedcols = [],
		mergedvalues = [],
		i, j,
		havemerge = false,
		row,
		prow,
		nrow,
		pcol,
		ccol,
		ncol, nvalue, pvalue, cvalue,
		dp = dpdata || me.dataProvider,
		pmerged,
		prmerged;
		
	for (i=0; i < columns.length; i++)
	{
		if (columns[i].merged == 1)
		{
			havemerge = true;
			mergedcols.push(i);
			mergedvalues.push(null);
		}
	}
	
	if (havemerge == true)
	{
		for (i=me.fixedRow; i < dp.length; i++)
		{
			row = dp[i];
			prow = (i > me.fixedRow) ? dp[i-1] : null;
			nrow = (i+1 < dp.length) ? dp[i+1] : null;
			
			// 1 or 3
			for (j=0; j < mergedcols.length; j++)
			{
				ccol = mergedcols[j];
				pcol = (j > 0 && mergedcols[j-1] == ccol - 1) ? mergedcols[j-1] : -1;
				ncol = (j+1 < mergedcols.length && mergedcols[j+1] == ccol + 1) ? mergedcols[j+1] : -1;
				
				nvalue = (nrow) ? nrow[ccol].text : null;
				cvalue = row[ccol].text;
				pvalue = (prow) ? prow[ccol].text : null;
				prmerged = (prow) ? prow[ccol].merged : 0;
				pmerged = (pcol > -1) ? row[pcol].merged : 3;
				
				if (pvalue != cvalue && nvalue == cvalue)
				{
					row[ccol].merged = 1;
				}
				else if (pvalue == cvalue && pmerged > 1)
				{
					row[ccol].merged = 3;
				}
				else if (nvalue == cvalue)
				{
					row[ccol].merged = (pmerged > 1 && prmerged > 0) ? 3 : 1;
				}
			}
		}
	}
}

qigridview.prototype.L7 = function(doc, path) {
	var root = null;
	
	var plist = path.split("/");
	var n = 0;
	
	var unode = doc;
	
	if (plist[0] == "")
	{
		unode = doc.getElementsByTagName(plist[1])[0];
		n = 2;
	}
	
	var nd = null;
	
	for (i=n; i < plist.length; i++)
	{
		unode = this.L8(unode, plist[i]);
		if (unode == null || unode == undefined)
			break;
	}
	
	nd = unode;
	
	return nd;
}

qigridview.prototype.L8 = function(unode, pname) {
	var nd = null,
		snode = null,
		i;
	
	if (unode != null && unode.hasChildNodes() == true)
	{
		snode = this.L14(unode);
		
		for (i=0; i < snode.length; i++)
		{
			if (snode[i].nodeName == pname)
			{
				nd = snode[i];
				break;
			}
		}
	}
	
	return nd;
}

qigridview.prototype.L9 = function(node, name) {
	var value = "";
	
	value = node.getAttribute(name);
	
	return value;
}

qigridview.prototype.L10 = function(node) {
	var obj = {},
		browser = window.bowser;
		
	for (var i=0; i < node.attributes.length; i++)
	{
		obj[(browser.msie ? node.attributes[i].nodeName : node.attributes[i].localName)] = node.attributes[i].value;
	}
	
	return obj;
}

qigridview.prototype.L14 = function(node, nodename) {
	var nodes = [];
	
	if (node != null && node.hasChildNodes() == true)
	{
		for (var i=0; i < node.childNodes.length; i++)
		{
			if (node.childNodes[i].nodeType == '1') {
				if (!(nodename && nodename != this.L17(node.childNodes[i])))
				{
					nodes.push(node.childNodes[i]);
				}
			}
		}
	}
	
	return nodes;
}

qigridview.prototype.L12 = function(node) {
	var browser = window.bowser;
	
	if (browser.msie)
	{
		if (node)
		{
			return node.text || node.textContent || "";
		}
	}
	else if (node != null && typeof node.textContent != 'undefined')
		return node.textContent;
	return "";
}

qigridview.prototype.L17 = function(node) {
	return node.nodeName;
}

qigridview.prototype.expandTemplate = function(rowIndex, expand) {
	var me = this,
		row = this.dataProvider[rowIndex],
		isnew = false;
	
	if (me.template)
	{
		row[0].expanded = expand;
		
		if (!row[0].template)
		{
			row[0].template = $("<div></div>")
				.css({position: "absolute"})
				.appendTo(me.regdata);
			row[0].template.append($(me.template));
			me.trenderers.push(row[0].template);
			isnew = true;
		}
		
		if (expand)
		{
			me.theight += row[0].template.height();
			row[0].template.fadeIn(500);
		}
		else
		{
			if (isnew == false)
			{
				me.theight -= row[0].template.height();
			}
			row[0].template.fadeOut(500);
		}
		
		me.refreshData();
	}
}

qigridview.prototype.createEditor = function(colinfo) {
	var me = this,
		renderer,
		i, code, disp, item;
		
	if (colinfo && colinfo.editor)
	{
		switch (colinfo.editor.type)
		{
		case "select":
		case "combobox":
			renderer = $("<select></select>");
			if (colinfo.editor.data)
			{
				for (i=0; i < colinfo.editor.data.length; i++)
				{
					item = colinfo.editor.data[i];
					code = item[colinfo.editor.codename || "value"];
					disp = item[colinfo.editor.displayname || "label"] || code;
					$("<option value='" + code + "'>" + disp + "</option>").appendTo(renderer);
				}
			}
			break;
		default:
			renderer = $("<input type='text'></input>");
			renderer.bind("keyup", function(e) {
				if (e.keyCode == 13)
				{
					me.endEdit.call(me, "enter");
				}
				return false;
			});
			break;
		}
	}
	else
	{
		renderer = qigridview.prototype.parent.createEditor.call(me);
	}
	return renderer;
}

qigridview.prototype.beginEdit = function(renderer) {
	var me = this,
		offset = me.ctx.offset(),
		roffset,
		poffset,
		uoffset,
		columns = me.columns,
		col = me.cols[renderer.colIndex],
		mcol = columns[renderer.colIndex],
		editrenderer,
		cl, proc = false;
		
	if (me.editable == true && me.cols[renderer.colIndex].editable !== false)
	{
		roffset = renderer.offset();
		poffset = {left: 0, top: 0};
		if (false == true && me.drawmode == "dom")
		{
			if (renderer.rname == "fixcolumn")
			{
				poffset = me.regfixcolumn.offset();
				uoffset = me.regfixcolumn.region.offset();
			}
			else if (renderer.rname == "fixheader")
			{
				poffset = me.regfixheader.offset();
				uoffset = me.regfixheader.region.offset();
			}
			else if (renderer.rname == "data")
			{
				poffset = me.regdata.offset();
				uoffset = me.regdata.region.offset();
			}
		}
		cl = renderer.cl;
		me.editing = renderer;
		
		me.editor.empty();
		
		if (mcol.editor && mcol.editor.type)
		{
			switch (mcol.editor.type)
			{
			case "combobox":
			case "select":
				editrenderer = mcol.editrenderer = me.createEditor(mcol);
				me.editor.append(editrenderer);
				
				me.editor.css({left: (roffset.left - offset.left), top: (roffset.top - offset.top), overflow: "visible"});
				me.editor.ceditor = editrenderer;
				
				editrenderer.width(renderer.width());
				me.editor.width(renderer.width()).height(renderer.height());
				me.editor.show();
			
				proc = true;
				break;
			}
		}
		
		if (proc == false)
		{
			qigridview.prototype.parent.beginEdit.call(me, renderer);
		}
	}
}

var qigridinstances = {
	instance: 0
};

function qigridpages(option) {
	this.container = option.container;
	this.template = option.template || "totalcounter";
	this.totalcount = option.totalcount;
	this.pagecount = option.pagecount;
	this.datagrid = option.datagrid;
	
	this.prevlabel = option.prevlabel || "Previous";
	this.nextlabel = option.nextlabel || "Next";
	
	this.instance = qigridinstances.instance;
	qigridinstances.instance++;
	
	this.init();
}

qigridpages.prototype = {
	init: function() {
		var me = this,
			disp,
			t;
		me.pageindex = 0;
		me.container.empty();
		
		switch (me.template)
		{
		case "totalcounter":
			disp = "<div class='m-datagrid-totalcounter'><div class='m-datagrid-pageinfo-1'><span><b>{START_LABEL}</b> - <b>{END_LABEL}</b> of <b>{TOTAL_LABEL}</b><span></div><div class='m-datagrid-page-btngrp'>{BUTTON_PREV}{BUTTON_NEXT}</div></div>";
			break;
		case "pageindex":
			disp = "<div class='m-datagrid-pageindex'><div class='m-datagrid-pageinfo-2'><div class='m-datagrid-page-btn-prev10'>{BUTTON_PREV10}</div><div class='m-datagrid-page-indexlist'>{PAGE_INDEX_10}</div><div class='m-datagrid-page-btn-next10'>{BUTTON_NEXT10}</div></div></div>";
			break;
		}
		
		me.tmpl = disp;
	},
	
	updatePage: function(pgindex) {
		var i, 
			me = this,
			tmpl = me.tmpl,
			pagecount = me.pagecount,
			start = pgindex * pagecount,
			end = (pgindex + 1) * pagecount,
			stindex = Math.floor(pgindex / 10) * 10,
			edindex = Math.ceil(me.totalcount / me.pagecount),
			pgstr = "",
			jtmpl,
			pgitems,
			instance;
		
		me.pageindex = pgindex;
		me.container.empty();
		
		if (tmpl)
		{
			instance = me.instance;
			end = Math.min(end, me.totalcount);
			tmpl = tmpl.replace("{START_LABEL}", start + 1);
			tmpl = tmpl.replace("{END_LABEL}", end + 1);
			tmpl = tmpl.replace("{TOTAL_LABEL}", qigridview.prototype.formatString(me.totalcount, "#,###"));
			
			tmpl = tmpl.replace("{BUTTON_PREV}", "<div class='m-datagrid-prevpage" + (pgindex == 0 ? " m-datagrid-page-disabled" : "") + "' id='qipages_btn_prev_" + instance + "'>" + (me.prevlabel || "") + "</div>");
			tmpl = tmpl.replace("{BUTTON_NEXT}", "<div class='m-datagrid-nextpage" + (pgindex == Math.ceil(me.totalcount / me.pagecount) ? " m-datagrid-page-disabled" : "") + "' id='qipages_btn_next_" + instance + "'>" + (me.nextlabel || "") + "</div>");
			
			tmpl = tmpl.replace("{BUTTON_PREV10}", "<div class='m-datagrid-prevpage" + (stindex == 0 ? " m-datagrid-page-disabled" : "") + "' id='qipages_btn_prev10_" + instance + "'>" + (me.prevlabel || "") + "</div>");
			tmpl = tmpl.replace("{BUTTON_NEXT10}", "<div class='m-datagrid-nextpage" + (stindex + 10 >= edindex ? " m-datagrid-page-disabled" : "") + "' id='qipages_btn_next10_" + instance + "'>" + (me.nextlabel || "") + "</div>");
			
			for (i=stindex; i < Math.min(stindex + 10, edindex); i++)
			{
				pgstr += "<div class='m-datagrid-jumppage" + (i == pgindex ? " m-datagrid-currentpage" : "") + "' name='qipages_btn_jump_" + instance + "'>" + (i+1) + "</div>";
			}
			
			tmpl = tmpl.replace("{PAGE_INDEX_10}", pgstr);
			
			
			jtmpl = $(tmpl);
			me.container.append(jtmpl);
			
			$("#qipages_btn_next_" + instance).bind("click", function() {
				me.changePage.call(me, ++me.pageindex);
			});
			
			$("#qipages_btn_prev_" + instance).bind("click", function() {
				if (me.pageindex > 0)
				{
					me.changePage.call(me, --me.pageindex);
				}
			});
			
			$("#qipages_btn_next10_" + instance).bind("click", function() {
				if (edindex > stindex + 10)
				{
					me.changePage.call(me, stindex + 10);
				}
			});
			
			$("#qipages_btn_prev10_" + instance).bind("click", function() {
				if (stindex> 0)
				{
					me.changePage.call(me, stindex - 1);
				}
			});
			
			pgitems = jtmpl.find("[name='qipages_btn_jump_" + instance + "']");
			pgitems.bind("click", function(ev) {
				var value = $(ev.target).text();
				if (value)
				{
					value = parseInt(value);
					if (value - 1 != me.pageindex)
					{
						me.changePage.call(me, value - 1);
					}
				}
			});
		}
	},
	
	changePage: function(pgindex) {
		var me = this,
			container = me.container;
			
		container.trigger("changepage", [me, pgindex]);
	}
}
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

