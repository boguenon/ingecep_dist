FusionCharts.setCurrentRenderer("javascript");

IG$/*mainapp*/.j3 = function(subtype) {
	var stype = 'Column';
	
	switch (subtype)
	{
	case "column":
		stype = "Column";
		break;
	case "line":
		stype = "Line";
		break;
	case "spline":
		stype = "Spline";
		break;
	case "area":
		stype = "Area";
		break;
	case "bar":
		stype = "Bar";
		break;
	case "pie":
		stype = "Pie";
		break;
	case "doughnut":
		stype = "Pie";
		break;
	case "bubble":
		stype = "Bubble";
		break;
	case "scatter":
		stype = "Scatter";
		break;
	case "parallel":
		stype = "Parallel";
		break;
	}
	
	return stype;
}

function _fc_l(p) {
	var ps = p.split("|");
	var inst = parseInt(ps[0]), 
		series = ps[1], 
		point = ps[2], 
		value = ps[3];
		
	var fcinst = window.f_inst[inst];
	var series = {
		name: series
	};
	var param = {
		point: {
			category: point
		}
	};
	
	fcinst.p1/*processClickEvent*/.call(fcinst, series, param);
}

IG$/*mainapp*/._I95/*olapChartView*/.prototype.JJ$5 = function(mresult, w, h) {
	var i,
		j,
		data = mresult.data,
		fc = mresult.colfix,
		fr = mresult.rowfix,
		hasdualaxis,
		me = this,
		
		xticks = [],
		n = 1,
		ename,
		series = [],
		ci,
		labels = [],
		bpointchart = false,
		bpolarchart = false,
		bscatter = false,
		fcharttype;
		
	var mcr = me._ILb/*sheetoption*/.cco/*chartOption*/,
		swapaxis = mcr.swapaxis,
		useformula = mcr.useformula,
		maxchartresult = mcr.maxchartresult,
		timeseriesfield = mcr.timeseriesfield,
		defaultrenderas;
	
	var tc = (data && data.length > 0) ? data[0].length : 0;
	var tr = (data ? data.length : 0);
	
	// line, spline, area, areaspline, column, bar, pie and scatter
	var rcs/*rendersubtype*/ = me.rcs/*rendersubtype*/;

	me.drawmode = "custom";
	me.isHighChart = false;
	
	if (rcs/*rendersubtype*/ == "radar")
	{
		bpolarchart = true;
	}
	
	switch (rcs/*rendersubtype*/)
	{
	case "scatter":
		fcharttype = "Scatter";
		break;
	case "bubble":
		fcharttype = "Bubble";
		break;
	case "pie":
		fcharttype = "Pie3D";
		break;
	case "doughnut":
		fcharttype = "Doughnut2D";
		break;
	case "radar":
		fcharttype = "Radar";
		break;
	default:
		fcharttype = "MSCombiDY2D";
		switch (rcs/*rendersubtype*/)
		{
		case "line":
			defaultrenderas = "Line";
			break;
		case "area":
			defaultrenderas = "Area";
			break;
		}
		break;
	}
	
	if (!window.f_inst)
	{
		window.f_inst = [];
	}
	
	var finstance = window.f_inst.length;
	
	window.f_inst.push(me);
	
	if (fc+1 < tc && (rcs/*rendersubtype*/ == "scatter" || rcs/*rendersubtype*/ == "bubble"))
	{
		var s,
			pvalue,
			pmax = null,
			pmin = null,
			prange = null,
			zvalue;
		
		bpointchart = true;
		
		if (rcs/*rendersubtype*/ == "bubble")
		{
			if (!swapaxis && fc+2 < tc)
			{
				bscatter = true;
				
				for (i=fr; i < data.length; i++)
				{
					zvalue = Number(data[i][fc+2].code) || 0;
					pmax = (i == fr) ? zvalue : Math.max(pmax, zvalue);
					pmin = (i == fr) ? zvalue : Math.min(pmin, zvalue);
				}
				
				prange = 30 / (pmax - pmin);
			}
			else if (swapaxis && fr+2 < tr)
			{
				bscatter = true;
				
				for (i=fc; i < tc; i++)
				{
					zvalue = Number(data[fr+2][i].code) || 0;
					pmax = (i == fc) ? zvalue : Math.max(pmax, zvalue);
					pmin = (i == fc) ? zvalue : Math.min(pmin, zvalue);
				}
				
				prange = 30 / (pmax - pmin);
			}
		}
		
		if (swapaxis)
		{
			for (i=fc; i < Math.min(tc, (maxchartresult > 0 ? maxchartresult : tc)); i++)
			{
				var val = {x: Number(data[fr][i].code), y: Number(data[fr+1][i].code)};
				
				if (bscatter == true && fr+2  < tr)
				{
					zvalue = Number(data[fr+2][i].code);
					zvalue = (zvalue - pmin) * prange + 2;
					
					val.marker = {
						radius: zvalue
					}
					val.z = zvalue;
				}
				
				var sname;
				for (j=0; j < fr; j++)
				{
					sname = (j == 0) ? data[j][i].text : sname + " " + data[j][i].text;
				}
				
				val.name = sname;
				val.datarow = j;
				
				cvalue = data[0][j].text;
				
				if (cvalue != pvalue)
				{
					s = new Object();
					s.name = cvalue;
					s.data = [val];
					series.push(s);
				}
				else if (s)
				{
					s.data.push(val);
				}
				
				pvalue = cvalue;
			}
		}
		else
		{
			for (i=fr; i < Math.min(data.length, (maxchartresult > 0 ? maxchartresult : data.length)); i++)
			{
				var val = {x: Number(data[i][fc].code), y: Number(data[i][fc+1].code)};
				
				if (bscatter == true && fc+2  < tc)
				{
					zvalue = Number(data[i][fc+2].code);
					zvalue = (zvalue - pmin) * prange + 2;
					
					val.marker = {
						radius: zvalue
					};
					val.z = zvalue;
				}
				
				var sname;
				for (j=0; j < fc; j++)
				{
					sname = (j == 0) ? data[i][j].text : sname + " " + data[i][j].text;
				}
				
				val.name = sname;
				val.datarow = i;
				
				cvalue = data[i][0].text;
				
				if (cvalue != pvalue)
				{
					s = new Object();
					s.name = cvalue;
					s.data = [val];
					series.push(s);
				}
				else if (s)
				{
					s.data.push(val);
				}
				
				pvalue = cvalue;
			}
		}
	}
	else
	{
		if (swapaxis == true)
		{
			for (i=fr; i < tr; i++)
			{
				var lbl;
				for (j=0; j < fc; j++)
				{
					lbl = (j==0) ? data[i][j].text : lbl + data[i][j].text;
				}
				var s = new Object();
				s.seriesname = lbl;
				s.data = [];
				series.push(s);
			}
		}
		else
		{
			for (i=fc; i < tc; i++)
			{
				var lbl;
				for (j=0; j < fr; j++)
				{
					lbl = (j==0) ? data[j][i].text : lbl + data[j][i].text;
				}
				var s = new Object();
				s.seriesname = lbl;
				s.data = [];
				series.push(s);
			}
		}
		
		var m = Math.max((swapaxis == true ? tc : data.length), 20),
			bformula = false;
		
		if (swapaxis == true)
		{
			for (i=fc; i < Math.min(tc, (maxchartresult > 0 ? maxchartresult : tc)); i++)
			{
				bformula = false;
				
				for (j=0; j < fr; j++)
				{
					ename = (j == 0) ? data[j][i].text : ename + "|" + data[j][i].text;
					if (data[j][i].position == 4)
					{
						bformula = true;
						break;
					}
				}
				if (bformula == false || useformula == true)
				{
					ci = 0;
					for (j=fr; j < tr; j++)
					{
						var f = Number(data[j][i].code);
						if (isNaN(f) == true)
						{
							series[ci].data.push(null);
						}
						else
						{
							if (bpolarchart == true)
							{
								series[ci].data.push({
									label: ename,
									value: f
								});
							}
							else
							{
								series[ci].data.push({
									label: ename, 
									value: f
								});
							}
						}
						ci++;
					}
					
					xticks.push({
						label: ename
					});
					n++;
				}
			}
		}
		else
		{
			for (i=fr; i < Math.min(data.length, (maxchartresult > 0 ? maxchartresult : data.length)); i++)
			{
				bformula = false;
				
				for (j=0; j < fc; j++)
				{
					ename = (j == 0) ? data[i][j].text : ename + "|" + data[i][j].text;
					if (data[i][j].position == 4)
					{
						bformula = true;
						break;
					}
				}
				if (bformula == false || useformula == true)
				{
					ci = 0;
					for (j=fc; j < tc; j++)
					{
						var f = Number(data[i][j].code);
						if (isNaN(f) == true)
						{
							series[ci].data.push(null);
						}
						else
						{
							if (bpolarchart == true)
							{
								series[ci].data.push({
									label: ename,
									value: f,
									link: "j-_fc_l-" + finstance + "|" + series[ci].seriesname + "|" + ename + "|" + f,
									displayValue: data[i][j].text
								});
							}
							else
							{
								series[ci].data.push( // [ename, f]
									{
										label: ename,
										value: f,
										link: "j-_fc_l-" + finstance + "|" + series[ci].seriesname + "|" + ename + "|" + f,
										displayValue: data[i][j].text
									}
								);
							}
						}
						ci++;
					}
					
					xticks.push(
						{
							label: ename
						}
					);
					n++;
				}
			}
		}
	}
	
	var coption = {};
	coption.chart = {
		animation: false,
		defaultSeriesType: "area",
		reflow: false,
		alignTicks: true,
		borderWidth: 0,
		palette: mcr.f_palette || "1",
		showvalues: (mcr.f_showvalues == "T" ? 1 : 0)
	};
	
	if (bpolarchart)
	{
		coption.chart.polar = true;
		coption.pane = {
			size: "80%"
		};
	}
	
	if (mcr.showtitle == true)
	{
		coption.chart.caption = mcr.title;
	}
	else
	{
		coption.chart.caption = "";
	}
	
	coption.chart.defaultSeriesType = IG$/*mainapp*/._I36/*getSeriesType*/(rcs);
	
	// coption.subtitle = {text: "Source:"};
	if (bpointchart == false)
	{
		if (mcr.enablezoom == true)
		{
			coption.chart.zoomType = "xy";
		}
		var xlabels = {
			labels: { 
				formatter: function() {
					var s = (this.value.split ? this.value.split("|") : [this.value]);
					return s.join("<br>"); 
				}
			} //, rotation: 320
		};
		coption.xAxis = {
			showLastTickLabel: true,
			align: "left"
		};
		
		coption.categories = [
			{
				category: xticks
			}
		];
	}
	else
	{
		coption.chart.zoomType = "xy";
		
		coption.xAxis = {
			startOnTick: true,
			endOnTick: true,
			showLastLabel: true
		};
	}
	
	var eventowner = this;
	var ylabels = {formatter: function() { return Highcharts.numberFormat(this.value, 0); }};
	var ytitle = {text: null}
	coption.yAxis = {title: ytitle, labels: ylabels};
	
	if (mcr.yaxismax != "" && IG$/*mainapp*/._I37/*isNumber*/(mcr.yaxismax) == true)
	{
		coption.yAxis.max = Number(mcr.yaxismax);
	}
	
	if (mcr.yaxismin != "" && IG$/*mainapp*/._I37/*isNumber*/(mcr.yaxismin) == true)
	{
		coption.yAxis.min = Number(mcr.yaxismin);
	}
	
	if (bpolarchart == true)
	{
		coption.yAxis.gridLineInterpolation = "polygon";
		coption.yAxis.lineWidth = 0;
	}

	
	var marker = {enabled: false, symbol:"circle", radius: 2, states: {hover: {enabled: true}}};
	if (me.rcs/*rendersubtype*/ == "pie" || me.rcs/*rendersubtype*/ == "doughnut")
	{
		coption.tooltip = {
			formatter: function() { 
				return this.point.name + "<br>" + Highcharts.numberFormat(this.y, 0) + " (" + Highcharts.numberFormat(this.percentage, 1) + " %)"; 
			}
		};
		
		coption.plotOptions = {
			pie: {
				allowPointSelect: true,
				cursor: "pointer",
				innerSize: (me.rcs/*rendersubtype*/ == "doughnut" ? 60 : (mcr.pieinnerradius || 0)),
				dataLabels: {
					enabled: true,
					// color: Highcharts.theme.textColor || "#000000",
					distance: mcr.pielabeldist,
					// connectColor: Highcharts.theme.textColor || "#000000",
					formatter: function () {
						return "<b>"+ this.point.name +"</b>: "+ Highcharts.numberFormat(this.percentage, 1) +" %";
					}
				},
				events: {
					click: function(param) {
						eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
					}
				}
			}
		};
		
		if (series && series.length > 1)
		{
			series.splice(1, series.length - 1);
		}
	}
	else
	{
		for (i=0; i < series.length; i++)
		{
			if (mcr.renderas && mcr.renderas.length > i && mcr.renderas[i] != null && mcr.renderas[i] != "")
			{
				series[i].renderas = IG$/*mainapp*/._I36/*getSeriesType*/(mcr.renderas[i]);
			}
			else if (defaultrenderas)
			{
				series[i].renderas = defaultrenderas;
			}
		}
		
		if (mcr.usedualaxis == true && mcr.dualaxisitem && mcr.dualaxisitem.length > -1 && series.length > 1)
		{
			for (i=0; i < series.length; i++)
			{
				if (mcr.dualaxisitem.length > i && mcr.dualaxisitem[i] == true)
				{
					hasdualaxis = true;
					break;
				}
			}
			
			if (hasdualaxis == true)
			{
				coption.yAxis = [coption.yAxis];
				coption.yAxis.push({
					title: {
						text: "", 
						enabled: false
					},
					opposite: true
				});
				
				for (i=0; i < mcr.dualaxisitem.length; i++)
				{
					if (series.length > i && mcr.dualaxisitem[i] == true)
					{
						series[i].parentyaxis = "S";
					}
				}
			}
		}
		
		
		
		coption.tooltip = {
			formatter: function() { 
				return this.series.name + "-" + this.x + "<br>" + Highcharts.numberFormat(this.y, 0); 
			}
		};
		
		coption.plotOptions = {};
		coption.plotOptions.column = {
			events: {
				click: function(param) {
					eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
				}
			}
		};
		
		coption.plotOptions.area = {
			marker: marker, 
			events: {
				click: function(param) {
					eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
				}
			}
		};
		
		coption.plotOptions.line = {
			events: {
				click: function(param) {
					eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
				}
			}
		};
		
		coption.plotOptions.bar = {
			events: {
				click: function(param) {
					eventowner.p1/*processClickEvent*/.call(eventowner, this, param);
				}
			}
		};
		
		if (bscatter == true)
		{
			coption.plotOptions.scatter = {
				marker: {
					symbol: "circle",
					radius: 5,
					states: {
						hover: {
							enabled: true
						}
					}
				},
				states: {
					hover: {
						marker: {
							enabled: false
						}
					}
				}
			}
		}
		
		if (mcr.stack == true)
		{
			switch (this.rcs/*rendersubtype*/)
			{
			case "area":
				coption.plotOptions.area.stacking = "normal";
				break;
			default:
				if (coption.plotOptions.series == null || typeof coption.plotOptions.series == "undefined")
				{
					coption.plotOptions.series = {};
				}
				coption.plotOptions.series.stacking = "normal";
				break;
			}
		}
		
		if (coption.renderas && coption.renderas.length > 0)
		{
			for (i=0; i < coption.renderas.length; i++)
			{
				if (coption.renderas[i] != "" && series.length > i)
				{
					var rtype = IG$/*mainapp*/._I36/*getSeriesType*/(coption.renderas[i])
					series[i].type = rtype;
				}
			}
		}
	}
	coption.dataset = series;
	coption.legend = {};
	if (mcr.showlegend == true)
	{
		coption.chart.showlegend = 1;
		coption.chart.legendPosition = mcr.legendposition;
	}
	else
	{
		coption.chart.showlegend = 0;
	}
	
	if (window.m$dorC)
	{
		window.m$dorC.call(me, this, coption);
	}
	
	me.customchart = new IG$/*mainapp*/.mA$_a/*fusioncharts*/(me.container, fcharttype, coption, w, h);
	
	return coption;
}

IG$/*mainapp*/.mA$_a/*fusioncharts*/ = function(container, fcharttype, coption, w, h) {
	var me = this,
		fchart = new FusionCharts({
		type: fcharttype, 
		width: w,
		height: h
	});
	
	fchart.setJSONData(coption);
	fchart.render(container);

	me.fchart = fchart;	
}

IG$/*mainapp*/.mA$_a/*fusioncharts*/.prototype = {
	updatedisplay: function(view, w, h) {
		var me = this;
		
		setTimeout(function() {
			if (me.fchart)
			{
				me.fchart.resizeTo( w, h);
			}
		}, 100);
	},
	
	getSVG: function() {
		var r;
		if (this.fchart)
		{
			r = this.fchart.ref.getSVGString();
		}
		
		return r;
	}
}