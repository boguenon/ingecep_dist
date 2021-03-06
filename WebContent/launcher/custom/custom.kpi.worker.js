IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];

IG$/*mainapp*/.kpi_2/*cindicator*/ = function(node) {
	var me = this;
	
	me.boxconfig = [];
	me.boxcnt = "{cols}";
	me.boxlayout = "";
	
	if (node)
	{
		var xdoc = IG$/*mainapp*/._I13/*loadXML*/(node),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "boxconfig");
		if (tnode)
		{
			me.p1/*parseNode*/(tnode);
		}
	}
}

IG$/*mainapp*/.kpi_2/*cindicator*/.prototype = {
	p1/*parseNode*/: function(tnode) {
		var me = this,
			i,
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			snode, mnode;
			
		me.boxcnt = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "boxcnt");
		me.boxlayout = IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "boxlayout");
		me.boxconfig = [];
		
		if (tnodes && tnodes.length)
		{
			for (i=0; i < tnodes.length; i++)
			{
				mnode = IG$/*mainapp*/._I18/*XGetNode*/(tnodes[i], "name");
				snode = IG$/*mainapp*/._I18/*XGetNode*/(tnodes[i], "syntax");
				me.boxconfig.push({
					name: IG$/*mainapp*/._I24/*getTextContent*/(mnode),
					syntax: Base64.decode(IG$/*mainapp*/._I24/*getTextContent*/(snode))
				});
			}
		}
	},
	p2/*getXML*/: function() {
		var me = this,
			r = "",
			i;
		r += "<boxconfig boxcnt='" + (me.boxcnt || "") + "' boxlayout='" + (me.boxlayout || "") + "'>";
		for (i=0; i < me.boxconfig.length; i++)
		{
			r += "<boxitem>";
			r += "<name><![CDATA[" + me.boxconfig[i].name + "]]></name>";
			r += "<syntax><![CDATA[" + Base64.encode(me.boxconfig[i].syntax || "") + "]]></syntax>";
			r += "</boxitem>";
		}
		r += "</boxconfig>";
		r += "";
		return r;
	}
};

IG$/*mainapp*/.kpi_3/*dlg_vsyntax*/ = $s.extend($s.window, {
	title: "Indicator Syntax",
	modal: true,
	region:'center',
	"layout": {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	
	callback: null,	
	
	width: 600,
	autoHeight: true,
	
	sK2/*confirmDialog*/: function() {
		var me = this,
			tsyntax = me.down("[name=tsyntax]");
			
		me.rec.set("syntax", tsyntax.getValue());
			
		this.close();
	},
	
	initApp: function() {
		var ttype = this.down("[name=ttype]"),
			tsyntax = this.down("[name=tsyntax]");
			
		ttype.setValue("");
		tsyntax.setValue(this.rec.get("syntax"));
	},
	
	initComponent: function() {
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
							xtype: "combobox",
							name: "ttype",
							fieldLabel: "Template Type",
							queryMode: 'local',
							displayField: 'name',
							valueField: 'value',
							editable: false,
							autoSelect: true,
							store: {
								xtype: 'store',
								fields: [
									"name", "value", "syntax"
								],
								data: [
									{
										name: "Select",
										value: "",
										syntax: ""
									},
									{
										name: "Template 1",
										value: "tmpl_1",
										syntax: ""
											+ "##define(c, $n * 2 + 1)##\n"
											+ "##define(_pval, [2,$c]) ##\n"
											+ "##define(_cval, [3,$c]) ##\n"
											+ "##define(_gap, $_pval - $_cval) ##\n"
											+ "##define(_plbl, [0, $c]) ##\n"
											+ "##define(_mlbl, [2, 0]) ##\n"
											+ "<div class='idc-kpi-box'>\n"
											+ "	<table class='idc-kpi-table'>\n"
											+ "		<tr>\n"
											+ "			<td class='idc-kpi-tb-l0' style='background-color:#29663D; text-align:center; vertical-align:middle;'>\n"
											+ "				<span style='font-family: fontawesome; font-size: 80px;color:white'>&#xf001;</span>\n"
											+ "			</td>\n"
											+ "			<td class='idc-kpi-tb-l1' style='background-color: #52CC7A; line-height: 18px'>\n"
											+ "				<h2>\n"
											+ "					<span style='##{$_gap > 0 ? \"color:red\" : \"color:green\"}##'>##{$_gap}##</span> \n"
											+ "					<span style='font-family: fontawesome'>##{$_gap > 0 ? \"&#xf062;\" : \"&#xf063;\"}##</span>\n"
											+ "				</h2>\n"
											+ "				<div  style='font-size:28px; line-height: 28px'>##{$_plbl}##</div>\n"
											+ "				<div style='font-size: 15px; color: '>##{$_mlbl}## : <span style='color: red'>##{$_pval}##</span></div>\n"
											+ "				<div class='igc-kpi-micro-chart' style='height: 60px'>##CHART(0)##</div></div>\n"
											+ "			</td>\n"
											+ "		</tr>\n"
											+ "	</table>\n"
											+ "</div>\n"
									},
									{
										name: "Template 2",
										value: "tmpl_2",
										syntax: ""
											+ "##define(c, $n * 2 + 1)##\n"
											+ "##define(_pval, [2,$c]) ##\n"
											+ "##define(_cval, [3,$c]) ##\n"
											+ "##define(_gap, $_pval - $_cval) ##\n"
											+ "##define(_plbl, [0, $c]) ##\n"
											+ "##define(_mlbl, [2, 0]) ##\n"
											+ "<div class='idc-kpi-box'>\n"
											+ "	<table class='idc-kpi-table'>\n"
											+ "		<tr>\n"
											+ "			<td class='idc-kpi-tb-l0' style='background-color:#293D66; text-align:center; vertical-align:middle;'>\n"
											+ "				<span style='font-family: fontawesome; font-size: 80px;color:white'>&#xf0a0;</span>\n"
											+ "			</td>\n"
											+ "			<td class='idc-kpi-tb-l1' style='background-color: #6699ff; line-height: 18px'>\n"
											+ "				<h2>\n"
											+ "					<span style='##{$_gap > 0 ? \"color:red\" : \"color:green\"}##'>##{$_gap}##</span> \n"
											+ "					<span style='font-family: fontawesome'>##{$_gap > 0 ? \"&#xf062;\" : \"&#xf063;\"}##</span>\n"
											+ "				</h2>\n"
											+ "				<div  style='font-size:28px; line-height: 28px'>##{$_plbl}##</div>\n"
											+ "				<div style='font-size: 15px; color: '>##{$_mlbl}## : <span style='color: red'>##{$_pval}##</span></div>\n"
											+ "				<div class='igc-kpi-micro-chart' style='height: 60px'>##CHART(0)##</div></div>\n"
											+ "			</td>\n"
											+ "		</tr>\n"
											+ "	</table>\n"
											+ "</div>\n"
									},
									{
										name: "Template 3",
										value: "tmpl_3",
										syntax: ""
											+ "##define(c, $n * 2 + 1)##\n"
											+ "##define(_pval, [2,$c]) ##\n"
											+ "##define(_cval, [3,$c]) ##\n"
											+ "##define(_gap, $_pval - $_cval) ##\n"
											+ "##define(_plbl, [0, $c]) ##\n"
											+ "##define(_mlbl, [2, 0]) ##\n"
											+ "<div class='idc-kpi-box'>\n"
											+ "	<table class='idc-kpi-table'>\n"
											+ "		<tr>\n"
											+ "			<td class='idc-kpi-tb-l0' style='background-color:#7A5C00; text-align:center; vertical-align:middle;'>\n"
											+ "				<span style='font-family: fontawesome; font-size: 80px;color:white'>&#xf099;</span>\n"
											+ "			</td>\n"
											+ "			<td class='idc-kpi-tb-l1' style='background-color: #CC9900; line-height: 18px'>\n"
											+ "				<h2>\n"
											+ "					<span style='##{$_gap > 0 ? \"color:red\" : \"color:green\"}##'>##{$_gap}##</span> \n"
											+ "					<span style='font-family: fontawesome'>##{$_gap > 0 ? \"&#xf062;\" : \"&#xf063;\"}##</span>\n"
											+ "				</h2>\n"
											+ "				<div  style='font-size:28px; line-height: 28px'>##{$_plbl}##</div>\n"
											+ "				<div style='font-size: 15px; color: '>##{$_mlbl}## : <span style='color: red'>##{$_pval}##</span></div>\n"
											+ "				<div class='igc-kpi-micro-chart' style='height: 60px'>##CHART(0)##</div></div>\n"
											+ "			</td>\n"
											+ "		</tr>\n"
											+ "	</table>\n"
											+ "</div>\n"
									},
									{
										name: "Template 4",
										value: "tmpl_4",
										syntax: ""
											+ "##define(c, $n * 2 + 1)##\n"
											+ "##define(_pval, [2,$c]) ##\n"
											+ "##define(_cval, [3,$c]) ##\n"
											+ "##define(_gap, $_pval - $_cval) ##\n"
											+ "##define(_plbl, [0, $c]) ##\n"
											+ "##define(_mlbl, [2, 0]) ##\n"
											+ "<div class='idc-kpi-box'>\n"
											+ "	<table class='idc-kpi-table'>\n"
											+ "		<tr>\n"
											+ "			<td class='idc-kpi-tb-l0' style='text-align:center; vertical-align:middle;'>\n"
											+ "				<span style='font-size:14px;line-height:1.42857;float:right!important;'>9,214</span>\n"
											+ "				<span style='font-size:14px;line-height:1.42857;'>Chrome</span>\n"
											+ "			</td>\n"
											+ "		</tr>\n"
											+ "		<tr>\n"
											+ "			<td class='idc-kpi-tb-l0' style='text-align:center; vertical-align:middle;'>\n"
											+ "				<div style='height:6px;overflow:hidden;background-color:#E6E9ED;border-radius:2px;margin-bottom:20px;'>\n"
											+ "					<div style='box-shadow:none;text-align:right;float:left;height:100%;font-size:12px;line-height:20px;background-color:#48CFAD;width:85%'></div>\n"
											+ "				</div>\n"
											+ "			</td>\n"
											+ "		</tr>\n"
											+ "	</table>\n"
											+ "</div>\n"
									},
									{
										name: "Gauge 1",
										value: "gauge_1",
										syntax: ""
											+ "##define(_mval, [1, 1]) ##\n"
											+ "<div class='idc-kpi-box'>\n"
											+ "	<table class='idc-kpi-table'>\n"
											+ "		<tr>\n"
											+ "			<td width='100%' style='text-align:center; vertical-align:middle;'>\n"
											+ "             <div id='chart01' style='width:100%;height:100%'></div>\n"
											+ "			</td>\n"
											+ "		</tr>\n"
											+ "	</table>\n"
											+ "</div>\n"
											+ "##define_data:highcharts:data01:chart01##\n"
											+ "{\n"
											+ "    chart: {\n"
											+ "        type: 'gauge',\n"
											+ "        plotBackgroundColor: null,\n"
											+ "        plotBackgroundImage: null,\n"
											+ "        plotBorderWidth: 0,\n"
											+ "        plotShadow: false\n"
											+ "    },\n"
											+ "    title: {\n"
											+ "        text: 'Speedometer'\n"
											+ "    },\n"
											+ "    pane: {\n"
											+ "        startAngle: -150,\n"
											+ "        endAngle: 150,\n"
											+ "        background: [{\n"
											+ "            backgroundColor: {\n"
											+ "                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },\n"
											+ "                stops: [\n"
											+ "                    [0, '#FFF'],\n"
											+ "                    [1, '#333']\n"
											+ "                ]\n"
											+ "            },\n"
											+ "            borderWidth: 0,\n"
											+ "            outerRadius: '109%'\n"
											+ "        }, {\n"
											+ "            backgroundColor: {\n"
											+ "                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },\n"
											+ "                stops: [\n"
											+ "                    [0, '#333'],\n"
											+ "                    [1, '#FFF']\n"
											+ "                ]\n"
											+ "            },\n"
											+ "            borderWidth: 1,\n"
											+ "            outerRadius: '107%'\n"
											+ "        }, {\n"
											+ "            // default background\n"
											+ "        }, {\n"
											+ "            backgroundColor: '#DDD',\n"
											+ "            borderWidth: 0,\n"
											+ "            outerRadius: '105%',\n"
											+ "            innerRadius: '103%'\n"
											+ "        }]\n"
											+ "    },\n"
											+ "    // the value axis\n"
											+ "    yAxis: {\n"
											+ "        min: 0,\n"
											+ "        max: 200,\n"
											+ "        minorTickInterval: 'auto',\n"
											+ "        minorTickWidth: 1,\n"
											+ "        minorTickLength: 10,\n"
											+ "        minorTickPosition: 'inside',\n"
											+ "        minorTickColor: '#666',\n"
											+ "        tickPixelInterval: 30,\n"
											+ "        tickWidth: 2,\n"
											+ "        tickPosition: 'inside',\n"
											+ "        tickLength: 10,\n"
											+ "        tickColor: '#666',\n"
											+ "        labels: {\n"
											+ "            step: 2,\n"
											+ "            rotation: 'auto'\n"
											+ "        },\n"
											+ "        title: {\n"
											+ "            text: 'km/h'\n"
											+ "        },\n"
											+ "        plotBands: [{\n"
											+ "            from: 0,\n"
											+ "            to: 120,\n"
											+ "            color: '#55BF3B' // green\n"
											+ "        }, {\n"
											+ "            from: 120,\n"
											+ "            to: 160,\n"
											+ "            color: '#DDDF0D' // yellow\n"
											+ "        }, {\n"
											+ "            from: 160,\n"
											+ "            to: 200,\n"
											+ "            color: '#DF5353' // red\n"
											+ "        }]\n"
											+ "    },\n"
											+ "    series: [{\n"
											+ "        name: 'Speed',\n"
											+ "        data: [##{$_mval}##],\n"
											+ "        tooltip: {\n"
											+ "            valueSuffix: ' km/h'\n"
											+ "        }\n"
											+ "    }]\n"
											+ "}\n"
											+ "##define_end_data:data01##\n"
									},
									{
										name: "Gauge 2",
										value: "gauge_2",
										syntax: ""
											+ "##define(_mval, [1, 1]) ##\n"
											+ "<div class='idc-kpi-box'>\n"
											+ "	<table class='idc-kpi-table'>\n"
											+ "		<tr>\n"
											+ "			<td width='100%' style='text-align:center; vertical-align:middle;'>\n"
											+ "             <div id='chart01' style='width:100%;height:100%'></div>\n"
											+ "			</td>\n"
											+ "		</tr>\n"
											+ "	</table>\n"
											+ "</div>\n"
											+ "##define_data:highcharts:data02:chart01##\n"
											+ "{\n"
											+ "    chart: {\n"
											+ "        type: 'gauge',\n"
											+ "        alignTicks: false,\n"
											+ "        plotBackgroundColor: null,\n"
											+ "        plotBackgroundImage: null,\n"
											+ "        plotBorderWidth: 0,\n"
											+ "        plotShadow: false\n"
											+ "    },\n"
											+ "    title: {\n"
											+ "        text: 'Speedometer with dual axes'\n"
											+ "    },\n"
											+ "    pane: {\n"
											+ "        startAngle: -150,\n"
											+ "        endAngle: 150\n"
											+ "    },\n"
											+ "    yAxis: [{\n"
											+ "        min: 0,\n"
											+ "        max: 200,\n"
											+ "        lineColor: '#339',\n"
											+ "        tickColor: '#339',\n"
											+ "        minorTickColor: '#339',\n"
											+ "        offset: -25,\n"
											+ "        lineWidth: 2,\n"
											+ "        labels: {\n"
											+ "            distance: -20,\n"
											+ "            rotation: 'auto'\n"
											+ "        },\n"
											+ "        tickLength: 5,\n"
											+ "        minorTickLength: 5,\n"
											+ "        endOnTick: false\n"
											+ "    }, {\n"
											+ "        min: 0,\n"
											+ "        max: 124,\n"
											+ "        tickPosition: 'outside',\n"
											+ "        lineColor: '#933',\n"
											+ "        lineWidth: 2,\n"
											+ "        minorTickPosition: 'outside',\n"
											+ "        tickColor: '#933',\n"
											+ "        minorTickColor: '#933',\n"
											+ "        tickLength: 5,\n"
											+ "        minorTickLength: 5,\n"
											+ "        labels: {\n"
											+ "            distance: 12,\n"
											+ "            rotation: 'auto'\n"
											+ "        },\n"
											+ "        offset: -20,\n"
											+ "        endOnTick: false\n"
											+ "    }],\n"
											+ "\n"
											+ "    series: [{\n"
											+ "        name: 'Speed',\n"
											+ "        data: [##{$_mval}##],\n"
											+ "        dataLabels: {\n"
											+ "            formatter: function () {\n"
											+ "                var kmh = this.y,\n"
											+ "                    mph = Math.round(kmh * 0.621);\n"
											+ "                return '<span style=\"color:#339\">' + kmh + ' km/h</span><br/>' +\n"
											+ "                    '<span style=\"color:#933\">' + mph + ' mph</span>';\n"
											+ "            },\n"
											+ "            backgroundColor: {\n"
											+ "                linearGradient: {\n"
											+ "                    x1: 0,\n"
											+ "                    y1: 0,\n"
											+ "                    x2: 0,\n"
											+ "                    y2: 1\n"
											+ "                },\n"
											+ "                stops: [\n"
											+ "                    [0, '#DDD'],\n"
											+ "                    [1, '#FFF']\n"
											+ "                ]\n"
											+ "            }\n"
											+ "        },\n"
											+ "        tooltip: {\n"
											+ "            valueSuffix: ' km/h'\n"
											+ "        }\n"
											+ "    }]\n"
											+ "}\n"
											+ "##define_end_data:data02##\n"
									},
									{
										name: "Gauge 3",
										value: "gauge_3",
										syntax: ""
											+ "##define(_mval, [1, 1]) ##\n"
											+ "<div class='idc-kpi-box'>\n"
											+ "	<table class='idc-kpi-table'>\n"
											+ "		<tr>\n"
											+ "			<td width='100%' style='text-align:center; vertical-align:middle;'>\n"
											+ "             <div id='chart01' style='width:100%;height:100%'></div>\n"
											+ "			</td>\n"
											+ "		</tr>\n"
											+ "	</table>\n"
											+ "</div>\n"
											+ "##define_data:highcharts:data03:chart01##\n"
											+ "{\n"
											+ "    chart: {\n"
											+ "        type: 'gauge',\n"
											+ "        plotBorderWidth: 1,\n"
											+ "        plotBackgroundColor: {\n"
											+ "            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },\n"
											+ "            stops: [\n"
											+ "                [0, '#FFF4C6'],\n"
											+ "                [0.3, '#FFFFFF'],\n"
											+ "                [1, '#FFF4C6']\n"
											+ "            ]\n"
											+ "        },\n"
											+ "        plotBackgroundImage: null,\n"
											+ "        height: 200\n"
											+ "    },\n"
											+ "\n"
											+ "    title: {\n"
											+ "        text: 'VU meter'\n"
											+ "    },\n"
											+ "\n"
											+ "    pane: [{\n"
											+ "        startAngle: -45,\n"
											+ "        endAngle: 45,\n"
											+ "        background: null,\n"
											+ "        center: ['25%', '145%'],\n"
											+ "        size: 300\n"
											+ "    }, {\n"
											+ "        startAngle: -45,\n"
											+ "        endAngle: 45,\n"
											+ "        background: null,\n"
											+ "        center: ['75%', '145%'],\n"
											+ "        size: 300\n"
											+ "    }],\n"
											+ "\n"
											+ "    tooltip: {\n"
											+ "        enabled: false\n"
											+ "    },\n"
											+ "\n"
											+ "    yAxis: [{\n"
											+ "        min: -20,\n"
											+ "        max: 6,\n"
											+ "        minorTickPosition: 'outside',\n"
											+ "        tickPosition: 'outside',\n"
											+ "        labels: {\n"
											+ "            rotation: 'auto',\n"
											+ "            distance: 20\n"
											+ "        },\n"
											+ "        plotBands: [{\n"
											+ "            from: 0,\n"
											+ "            to: 6,\n"
											+ "            color: '#C02316',\n"
											+ "            innerRadius: '100%',\n"
											+ "            outerRadius: '105%'\n"
											+ "        }],\n"
											+ "        pane: 0,\n"
											+ "        title: {\n"
											+ "            text: 'VU<br/><span style=\"font-size:8px\">Channel A</span>',\n"
											+ "            y: -40\n"
											+ "        }\n"
											+ "    }, {\n"
											+ "        min: -20,\n"
											+ "        max: 6,\n"
											+ "        minorTickPosition: 'outside',\n"
											+ "        tickPosition: 'outside',\n"
											+ "        labels: {\n"
											+ "            rotation: 'auto',\n"
											+ "            distance: 20\n"
											+ "        },\n"
											+ "        plotBands: [{\n"
											+ "            from: 0,\n"
											+ "            to: 6,\n"
											+ "            color: '#C02316',\n"
											+ "            innerRadius: '100%',\n"
											+ "            outerRadius: '105%'\n"
											+ "        }],\n"
											+ "        pane: 1,\n"
											+ "        title: {\n"
											+ "            text: 'VU<br/><span style=\"font-size:8px\">Channel B</span>',\n"
											+ "            y: -40\n"
											+ "        }\n"
											+ "    }],\n"
											+ "\n"
											+ "    plotOptions: {\n"
											+ "        gauge: {\n"
											+ "            dataLabels: {\n"
											+ "                enabled: false\n"
											+ "            },\n"
											+ "            dial: {\n"
											+ "                radius: '100%'\n"
											+ "            }\n"
											+ "        }\n"
											+ "    },\n"
											+ "\n"
											+ "\n"
											+ "    series: [{\n"
											+ "        name: 'Channel A',\n"
											+ "        data: [##{$_mval}##],\n"
											+ "        yAxis: 0\n"
											+ "    }, {\n"
											+ "        name: 'Channel B',\n"
											+ "        data: [##{$_mval}##],\n"
											+ "        yAxis: 1\n"
											+ "    }]\n"
											+ "}\n"
											+ "##define_end_data:data03##\n"
									},
									{
										name: "Gauge 4",
										value: "gauge_4",
										syntax: ""
											+ "##define(_mval, [1, 1]) ##\n"
											+ "##define(_mdesc, [1, 1]c) ##\n"
											+ "<div class='idc-kpi-box'>\n"
											+ "	<table class='idc-kpi-table'>\n"
											+ "		<tr>\n"
											+ "			<td width='100%' style='text-align:center; vertical-align:middle;'>\n"
											+ "             <div id='chart01' style='width:100%;height:100%'></div>\n"
											+ "			</td>\n"
											+ "		</tr>\n"
											+ "	</table>\n"
											+ "</div>\n"
											+ "##define_data:highcharts:data04:chart01##\n"
											+ "{\n"
											+ "    chart: {\n"
											+ "        type: 'solidgauge'\n"
											+ "    },\n"
											+ "\n"
											+ "    title: null,\n"
											+ "\n"
											+ "    pane: {\n"
											+ "        center: ['50%', '85%'],\n"
											+ "        size: '80%',\n"
											+ "        startAngle: -90,\n"
											+ "        endAngle: 90,\n"
											+ "        background: {\n"
											+ "            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',\n"
											+ "            innerRadius: '60%',\n"
											+ "            outerRadius: '100%',\n"
											+ "            shape: 'arc'\n"
											+ "        }\n"
											+ "    },\n"
											+ "\n"
											+ "    tooltip: {\n"
											+ "        enabled: false\n"
											+ "    },\n"
											+ "\n"
											+ "    // the value axis\n"
											+ "    yAxis: {\n"
											+ "        stops: [\n"
											+ "            [0.1, '#55BF3B'], // green\n"
											+ "            [0.5, '#DDDF0D'], // yellow\n"
											+ "            [0.9, '#DF5353'] // red\n"
											+ "        ],\n"
											+ "        lineWidth: 0,\n"
											+ "        minorTickInterval: null,\n"
											+ "        tickPixelInterval: 400,\n"
											+ "        tickWidth: 0,\n"
											+ "        title: {\n"
											+ "            y: -70\n"
											+ "        },\n"
											+ "        min: 0,\n"
											+ "        max: 200,\n"
											+ "        title: {\n"
											+ "            text: 'Speed'\n"
											+ "        },\n"
											+ "        labels: {\n"
											+ "            y: 16\n"
											+ "        }\n"
											+ "    },\n"
											+ "\n"
											+ "    plotOptions: {\n"
											+ "        solidgauge: {\n"
											+ "            dataLabels: {\n"
											+ "                y: 5,\n"
											+ "                borderWidth: 0,\n"
											+ "                useHTML: true\n"
											+ "            }\n"
											+ "        }\n"
											+ "    },\n"
											+ "    \n"
											+ "    series: [{\n"
											+ "        name: 'Speed',\n"
											+ "        data: [##{$_mval}##],\n"
											+ "        dataLabels: {\n"
											+ "            format: '<div style=\"text-align:center\"><span style=\"font-size:25px;color:' +\n"
											+ "                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '\">##{c$_mdesc}##</span><br/>' +\n"
											+ "                   '<span style=\"font-size:12px;color:silver\">km/h</span></div>'\n"
											+ "        },\n"
											+ "        tooltip: {\n"
											+ "            valueSuffix: ' km/h'\n"
											+ "        }\n"
											+ "    }]\n"
											+ "}\n"
											+ "##define_end_data:data04##\n"
									}
								]
							},
							listeners: {
								change: function(tobj, newvalue, oldvalue, eopts) {
									var tsyntax = this.down("[name=tsyntax]"),
										r, i;
									
									for (i=0; i < tobj.store.data.items.length; i++)
									{
										if (tobj.store.data.items[i].get("value") == newvalue)
										{
											r = tobj.store.data.items[i];
										}	
									}
									
									tsyntax.setValue(r ? r.get("syntax") : "");
								},
								scope: this
							}
						},
						{
							xtype: "textarea",
							name: "tsyntax",
							value: this.rec.get("syntax"),
							height: 400
						}
					]
				}
			],
			buttons: [
				'->',
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.sK2/*confirmDialog*/();
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
		IG$/*mainapp*/.kpi_3/*dlg_vsyntax*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj.initApp.call(tobj);
		}
	}
});

IG$/*mainapp*/.kpi_1/*dlg_vindicator*/ = $s.extend($s.window, {
	title: "Indicator Wizard",
	modal: true,
	region:'center',
	"layout": {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	
	callback: null,	
	
	width: 600,
	autoHeight: true,
	
	in1/*initApp*/: function() {
		var me = this,
			copt = me.cindicator,
			i,
			dp,
			colconfig = me.down("[name=colconfig]");
			
		if (copt)
		{
			me.down("[name=boxcnt]").setValue(copt.boxcnt);
			me.down("[name=boxlayout]").setValue(copt.boxlayout || "");
			colconfig.store.loadData(copt.boxconfig);
		}
	},
	
	sK2/*confirmDialog*/: function() {
		var me = this,
			copt = me.cindicator,
			colconfig = me.down("[name=colconfig]"),
			colconfig_store = colconfig.store,
			rec, i, cc;
			
		if (copt)
		{
			copt.boxcnt = me.down("[name=boxcnt]").getValue();
			copt.boxlayout = me.down("[name=boxlayout]").getValue();
			copt.boxconfig = [];
			
			for (i=0; i < colconfig_store.data.items.length; i++)
			{
				rec = colconfig_store.data.items[i];
				cc = {
					name: rec.get("name"),
					syntax: rec.get("syntax")
				}
				copt.boxconfig.push(cc);
			}
			
			me.cop.cindicator = copt.p2/*getXML*/();
		}
		this.close();
	},
	
	initComponent: function() {
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					bodyPadding: 5,
					layout: "anchor",
					defaults: {
						labelAlign: "left"
					},
					items: [
						{
							xtype: "textfield",
							fieldLabel: "Box Counts",
							name: "boxcnt"
						},
						{
							xtype: "displayfield",
							anchor: "100%",
							value: "* {rows} for sheet results rows or {cols} for sheet result columns"
						},
						{
							xtype: "combobox",
							fieldLabel: "Layout Mode",
							name: "boxlayout",
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
									{name: "Horizontal Fit", value: ""},
									{name: "Horizontal Scroll", value: "hscr"},
									{name: "Vertical Fit", value: "vfit"},
									{name: "Vertical Scroll", value: "vscr"}
								]
							}
						},
						{
							xtype: "gridpanel",
							title: "Template",
							name: "colconfig",
							store: {
								xtype: "store",
								fields: [
									"name", "syntax"
								]
							},
							height: 300,
							selModel: {
								mode: "MULTI"
							},
							plugins: [
								{
									ptype: "cellediting",
									clicksToEdit: false
								}
							],
							tbar: [
								{
									xtype: "button",
									text: "Add Row",
									handler: function() {
										var me = this,
											grd = me.down("[name=colconfig]");
											
										grd.store.add({
											name: "",
											syntax: ""
										});
									},
									scope: this
								},
								{
									xtype: "button",
									text: "Remove Checked",
									handler: function() {
										var me = this,
											grd = me.down("[name=colconfig]"),
											sel = grd.getSelectionModel().selected,
											i;
											
										for (i=sel.length-1; i>=0; i--)
										{
											grd.store.remove(sel.items[i]);
										}
									},
									scope: this
								},
								{
									xtype: "button",
									text: "Move Up",
									handler: function() {
										var me = this,
											grd = me.down("[name=colconfig]"),
											sm = grd.getSelectionModel(),
											sel = grd.getSelectionModel().selected,
											i, idx,
											rec,
											msel = [];
											
										for (i=0; i < sel.length; i++)
										{
											msel.push(sel.items[i]);
										}
											
										for (i=sel.length-1; i>=0; i--)
										{
											idx = grd.store.indexOf(sel.items[i]);
											rec = sel.items[i];
											if (idx > 0)
											{
												grd.store.remove(rec);
												grd.store.insert(idx-1, rec);
											}
										}
										
										sm.select(msel);
									},
									scope: this
								},
								{
									xtype: "button",
									text: "Move Down",
									handler: function() {
										var me = this,
											grd = me.down("[name=colconfig]"),
											sm = grd.getSelectionModel(),
											sel = grd.getSelectionModel().selected,
											i, idx,
											rec,
											msel = [],
											tcount = grd.store.data.items.length;
											
										for (i=0; i < sel.length; i++)
										{
											msel.push(sel.items[i]);
										}
											
										for (i=sel.length-1; i>=0; i--)
										{
											idx = grd.store.indexOf(sel.items[i]);
											rec = sel.items[i];
											if (idx + 1 < tcount )
											{
												grd.store.remove(rec);
												grd.store.insert(idx+1, rec);
											}
										}
										
										sm.select(msel);
									},
									scope: this
								}
							],
							columns: [
								{
									text: "Title",
									width: 100,
									dataIndex: "name",
									editor: {
							    		allowBlank: false
							    	}
								},
								{
									text: "Syntax",
									flex: 1,
									dataIndex: "syntax"
								},
								{
									xtype: "actioncolumn",
									width: 50,
									items: [
										{
											iconCls: "icon-grid-config",
											handler: function (grid, rowIndex, colIndex) {
												var dlg = new IG$/*mainapp*/.kpi_3/*dlg_vsyntax*/({
													rec: grid.store.getAt(rowIndex)
												});
												dlg.show();
											}
										}
									]
								}
							]
						}
					]
				}
			],
			buttons: [
				'->',
				{
					text: IRm$/*resources*/.r1('B_CONFIRM'),
					handler: function() {
						this.sK2/*confirmDialog*/();
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
		IG$/*mainapp*/.kpi_1/*dlg_vindicator*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj.in1/*initApp*/.call(tobj);
		}
	}
});

IG$/*mainapp*/.__c_/*chartoption*/.chartext.kpi.prototype.replaceCellValue = function(pval, results, _bc, n, tmplvars) {
	var r = "",
		n,
		n0, c, cm, cr, cro,
		b_eval = 1,
		iscode = 0;
		
	$.each(tmplvars, function(k, v) {
		var kn = "$" + k,
			ki;
		
		ki = pval.indexOf(kn);
		
		while (ki > -1)
		{
			pval = pval.substring(0, ki) + v + pval.substring(ki+ kn.length);
			ki = pval.indexOf(kn, ki + 1);
		}
	});
	
	n = pval.indexOf("[");
	
	if (n > -1)
	{
		while (n > -1)
		{
			n0 = pval.indexOf("]", n + 1);
			
			if (n0 > -1)
			{
				r += pval.substring(0, n);
				c = pval.substring(n+1, n0);
				
				cr = "";
				
				if (c.indexOf(",") > -1)
				{
					if (pval[n0+1] == "c")
					{
						iscode = 1;
						b_eval = 0;
						n0++;
					}
					
					cm = c.split(",");
					if (cm[0] == "n")
					{
						cm[0] = n;
					}
					if (cm[1] == "n")
					{
						cm[1] = n;
					}
					
					cm[0] = parseInt(cm[0]);
					cm[1] = parseInt(cm[1]);
					
					if (results.data.length > cm[0] && results.data[cm[0]].length > cm[1])
					{
						cro = results.data[cm[0]][cm[1]];
						cr = iscode ? cro.text : cro.code;
					}
				}
				
				r += cr;
				
				pval = pval.substring(n0+1);
				n = pval.indexOf("[");
				
				if (n == -1)
				{
					r += pval;
				}
			}
			else
			{
				r += pval;
				break;
			}
		}
	}
	else
	{
		r = pval;
	}
	
	return {
		r: r,
		b_eval: b_eval
	};
};
	
IG$/*mainapp*/.__c_/*chartoption*/.chartext.kpi.prototype.getParamValue = function(pval, results, _bc, n, tmplvars) {
	var r = "-",
		c,
		b_eval = 1;
	
	if (pval.charAt(0) == "{" && pval.charAt(pval.length-1) == "}")
	{
		if (pval.charAt(1) == "c")
		{
			b_eval = 0;
		}
		
		pval = pval.substring(b_eval == 0 ? 2 : 1, pval.length-1);
		pval = this.replaceCellValue(pval, results, _bc, n, tmplvars);
		
		if (pval.b_eval && b_eval)
		{
			try
			{
				r = eval(pval.r);
			}
			catch (e)
			{
				r = pval.r;
			}
		}
		else
		{
			r = pval.r;
		}
	}
	else if (pval.substring(0, "define".length) == "define")
	{
		r = "";
		var m = pval.indexOf("("),
			pname,
			peval,
			pr;
		if (m > -1)
		{
			pval = pval.substring(m+1);
			m = pval.indexOf(")");
			
			if (m > -1)
			{
				pval = pval.substring(0, m);
			}
			
			m = pval.indexOf(",");
			if (m > -1)
			{
				pname = pval.substring(0, m);
				peval = pval.substring(m+1);
				
				if (pname)
				{
					peval = this.replaceCellValue(peval, results, _bc, n, tmplvars);
					
					if (peval.b_eval)
					{
						try
						{
							pr = eval(peval.r);
						}
						catch (e)
						{
							pr = peval.r;
						}
					}
					else
					{
						pr = peval.r;
					}
					
					tmplvars[pname] = pr;
				}
			}
		}
	}
	else if (pval.substring(0, "CHART".length) == "CHART")
	{
		var m = pval.indexOf("(");
		
		if (m > -1)
		{
			pval = pval.substring(m+1);
			
			m = pval.indexOf(")");
			
			if (m > -1)
			{
				pval = pval.substring(0, m);
			}
			
			pval = parseInt(pval);
			
			if (results.microcharts && results.microcharts.length > pval)
			{
				c = results.microcharts[pval];
			}
		}
	}
	else
	{
		switch (pval)
		{
		case "NAME":
			r = _bc.name;
			break;
		default:
			r = pval;
			break;
		}
	}
	
	return {
		t: r,
		c: c
	};
}
	
IG$/*mainapp*/.__c_/*chartoption*/.chartext.kpi.prototype.procTemplate = function(tmpl, results, _bc, nseq, charts, dataobj) {
	var me = this,
		i = 0,
		n = tmpl.indexOf("##"),
		n2 = 0,
		otmpl = "",
		in_block = 0,
		block_str = "",
		block_nm = "",
		block_type = "",
		block_region = "",
		b,
		cid,
		tmplvars = {n : nseq};
		
	if (n < 0)
	{
		otmpl = tmpl;
	}
	
	me._cindex = 0;
	
	while (n > -1)
	{
		n2 = tmpl.indexOf("##", n+2);
		
		if (n2 > -1)
		{
			if (in_block)
			{
				block_str += tmpl.substring(0, n);
			}
			else
			{
				otmpl += tmpl.substring(0, n);
			}
			
			pname = tmpl.substring(n+2, n2);
			
			if (pname.substring(0, "define_data".length) == "define_data")
			{
				in_block = 1;
				block_str = "";
				b = pname.split(":");
				block_type = b[1];
				block_nm = b[2];
				block_region = b[3];
			}
			else if (pname.substring(0, "define_end_data".length) == "define_end_data")
			{
				in_block = 0;
				dataobj.push({
					type: block_type,
					name: block_nm,
					region: block_region,
					data: block_str
				});
			}
			else
			{
				var pval = me.getParamValue(pname, results, _bc, n, tmplvars);
				
				if (pval.c)
				{
					cid = "mchart_" + (me._cindex++)
					otmpl += "<div id='" + cid + "' class='igc-kpi-mco'></div>";
					charts.push({
						cid: cid,
						c: pval.c
					});
				}
				else
				{
					if (in_block)
					{
						block_str += pval.t;
					}
					else
					{
						otmpl += pval.t;
					}
				}
			}
			
			tmpl = tmpl.substring(n2+2);
			n = tmpl.indexOf("##");
				
			if (n == -1)
			{
				if (in_block)
				{
					block_str += tmpl;
				}
				else
				{
					otmpl += tmpl;
				}
			}
		}
		else
		{
			if (in_block)
			{
				block_str += tmpl;
			}
			else
			{
				otmpl += tmpl;
			}
			n = -1;
			break;
		}
	}
	
	return otmpl;
};

IG$/*mainapp*/.__c_/*chartoption*/.chartext.kpi.prototype.drawChart = function(owner, results) {
	var me = this,
		container = $(owner.container),
		cop = owner.cop,
		cindopt;
	
	me.owner = owner;
	me.container = container;
	
	if (!me.plotarea)
	{
		me.plotarea = $("<div class='igc-kpi-cnt'></div>").appendTo(container);
		me.plotarea.width(container.width()).height(container.height());
	}
	
	me.cindopt = cindopt = new IG$/*mainapp*/.kpi_2/*cindicator*/(cop.cindicator);
	
	if (!me.btn_cfg)
	{
		me.btn_cfg = $("<div class='igc-kpi-cfg'></div>").appendTo(container);
		me.btn_cfg.bind("click", function() {
			var dlg = new IG$/*mainapp*/.kpi_1/*dlg_vindicator*/({
				cop: cop,
				cindicator: cindopt
			});
			dlg.show();
		});
	}
	
	me.plotarea.empty();
	
	if (results)
	{
		var colfix,
			rowfix,
			rows,
			cols,
			i, j, k, kname,
			chart,
			chartdiv,
			tw = container.width(),
			th = container.height(),
			px = 0, py = 0, pw, ph,
			gtype,
			sname,
			sdata = [],
			nchart = 0,
			f_ind_svalue_n = -1,
			ncnt,
			boxlayout = cindopt.boxlayout;
		
		cols = results.cols;
		rows = results.data.length;
		colfix = results.colfix;
		rowfix = results.rowfix;
		
		me.dataIndex = 0;
		me.charts = [];
		me.results = results;
		
		switch (cindopt.boxcnt)
		{
		case "{cols}":
			ncnt = cols;
			break;
		case "{rows}":
			ncnt = rows - rowfix;
			break;
		default:
			ncnt = parseInt(cindopt.boxcnt);
			break;
		}
		
		ncnt = ncnt || 1;
		
		var cobj = [];
		
		for (i=0; i < ncnt; i++)
		{
			cobj.push({
				seq: i
			});
		}
		
		$.each(cobj, function(i, c) {
			var charts = [],
				dataobj = [],
				hcharts = [],
				hc;
				
			var _bc = cindopt.boxconfig.length > i ? cindopt.boxconfig[i] : null;
			
			if (!_bc && cindopt.boxconfig.length)
			{
				_bc = cindopt.boxconfig[i % cindopt.boxconfig.length];
			}
			
			var chartdiv = $("<div class='igc-kpi-blk'></div>").appendTo(me.plotarea);
			
			var tmpl = "<div class='pind-box'><div class='pind-title'>"
				+ "<span class='pind-title-text'>" + (_bc ? _bc.name : "") + "</span>"
				+ "</div>"
				+ "<div class='pind-content'>"
				+ "<h1 class='pind-value'></h1><div class='pind-s-text'></div><small></small></div></div>";
				
			if (_bc && _bc.syntax)
			{
				tmpl = _bc.syntax;
			}
			
			var tout = me.procTemplate(tmpl, results, _bc, i, charts, dataobj);
			
			var o = $(tout).appendTo(chartdiv);
			
			if (charts.length)
			{
				setTimeout(function() {
					me.drawCharts.call(me, charts, chartdiv);
				}, 100);
			}
			
			if (dataobj)
			{
				$.each(dataobj, function(i, m) {
					var rg;
					
					switch (m.type)
					{
					case "highcharts":
						rg = $("#" + m.region, o);
						var copt = eval("(" + m.data + ")");
						copt.chart.renderTo = rg[0];
						hc = new Highcharts.Chart(copt);
						hcharts.push(hc);
						break;
					}
				});
			}
			
			if (hcharts.length)
			{
				chartdiv.bind("cresize", function() {
					var i,
						mdiv = $(this),
						mw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(mdiv),
						mh = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(mdiv);
						
					for (i=0; i < hcharts.length; i++)
					{
						var mchart = hcharts[i],
							dom = $(mchart.renderTo),
							w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(dom),
							h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(dom);
						
						w = Math.min(w, mw);
						h = Math.min(h, mh);
						
						if (w > 0 && h > 0)
						{
							mchart.setSize.call(mchart, w, h, doAnimation = true);
							dom.hide().show(0);
						}
					}
				});
				
				if (window.bowser && window.bowser.msie && Number(window.bowser.version) < 10)
				{
					setTimeout(function() {
						chartdiv.trigger("cresize");
					}, 10);
				}
			}
			
			me.charts.push({
				chart: chart,
				chartdiv: chartdiv,
				mcharts: charts
			});
			
			nchart++;
		});
		
		setTimeout(function() { 
			me.updateLayout.call(me);
		}, 10);
	}
};

IG$/*mainapp*/.__c_/*chartoption*/.chartext.kpi.prototype.updateLayout = function(resized) {
	var me = this,
		cindopt = me.cindopt,
		container = me.container,
		charts = me.charts,
		tw = container ? container.width() : 0,
		th = container ? container.height() : 0,
		px = 0, py = 0, pw, ph,
		i,
		boxlayout, box, chartdiv,
		plotarea = me.plotarea,
		ncnt, ox = "hidden", oy = "hidden";

	if (cindopt && charts && charts.length)
	{
		ncnt = charts.length;
		
		boxlayout = cindopt.boxlayout;
		
		switch (boxlayout)
		{
		case "vfit":
			pw = tw;
			ph = th / ncnt;
			break;
		case "vscr":
			pw = tw;
			ph = 0;
			oy = "auto";
			break;
		case "hscr":
			pw = 0;
			ph = th;
			ox = "auto";
			break;
		default:
			pw = tw / ncnt;
			ph = th;
			break;
		}
		
		plotarea.css({overflowX: ox, overflowY: oy});
		
		for (i=0; i < charts.length; i++)
		{
			chartdiv = charts[i].chartdiv;
			
			if (!chartdiv)
				continue;

			box = {};
			
			box.top = py + "px";
			box.left = px + "px";
			
			if (pw > 0)
			{
				box.width = pw + "px";
			}
			if (ph > 0)
			{
				box.height = ph + "px";
			}

			charts[i].chartdiv.css(box);
			
			if (!pw)
			{
				pw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(chartdiv);
			}
			
			if (!ph)
			{
				ph = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(chartdiv);
			}

			switch (boxlayout)
			{
			case "vfit":
				py += ph;
				break;
			case "vscr":
				py += ph;
				break;
			case "hscr":
				px += ph;
				break;
			default:
				px += pw;
				break;
			}
			
			chartdiv.trigger("cresize");
		}
	}
}

IG$/*mainapp*/.__c_/*chartoption*/.chartext.kpi.prototype.drawCharts = function(charts, chartdiv) {
	var j;
	$.each(charts, function(j, chart) {
		var value = charts[j].c, 
			jdiv = $("#" + charts[j].cid + "", chartdiv),
			w = jdiv.width(),
			h = jdiv.height(),
			c = $('<div></div>')
				.appendTo(jdiv)
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
		
		var opt = {defaultPixelsPerValue: w / value.chartData.elementdata.length},
			chartData = value.chartData,
			series = chartData.seriesdata;
			
		IG$/*mainapp*/.D_1/*microcharttype*/(chartData, opt);
		
		if (series && series.length > 0 && series[0].data.length > 0)
		{
			opt.defaultPixelsPerValue = w / (series[0].data.length);
			opt.height = h; 
			opt.tooltipFormat = '{{offset:offset}} {{y:val}}'; //{{value}}';
			opt.tooltipValueLookups = {
				offset: series[0].element
			};
		}
		
		chartdiv.bind("cresize", function() {
			jdiv.empty();
			
			var w = jdiv.width(),
				h = jdiv.height(),
				c = $('<div></div>')
					.appendTo(jdiv)
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
					
			var chartData = value.chartData,
				opt = {defaultPixelsPerValue: chartData.elementdata && chartData.elementdata.length ? w / chartData.elementdata.length : w},
				series = chartData.seriesdata;
				
			IG$/*mainapp*/.D_1/*microcharttype*/(chartData, opt);
			
			if (series && series.length > 0 && series[0].data.length > 0)
			{
				opt.defaultPixelsPerValue = w / (series[0].data.length);
				opt.height = h; 
				opt.tooltipFormat = '{{offset:offset}} {{y:val}}'; //{{value}}';
				opt.tooltipValueLookups = {
					offset: series[0].element
				};
			}
			
			c.sparkline((series && series.length > 0) ? series[0].data : [], opt);
		});
		
		c.sparkline((series && series.length > 0) ? series[0].data : [], opt);
	});
};

IG$/*mainapp*/.__c_/*chartoption*/.chartext.kpi.prototype.updatedisplay = function(owner, w, h) {
	// this.map.m1.call(this.map);
	var me = this,
		i,
		px = 0, py = 0, pw, ph = h;
	
	if (me.plotarea)
	{	
		me.plotarea.width(w).height(h);
	}
	
	if (me.charts && me.charts.length > 0)
	{
		setTimeout(function() {
			me.updateLayout.call(me, 1);
		}, 10);
	}
}
