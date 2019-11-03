FusionCharts.setCurrentRenderer('javascript');

IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];

IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label: "Gauge",
		charttype: "gauge",
		subtype: "gauge",
		img: "chart.gauge",
		grp: "scientific"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.gauge = function(owner) {
	this.owner = owner;
	
	this.drawChart = function(owner, results) {
		var me = this,
			container = $(owner.container),
			cop = owner.cop;
		
		me.owner = owner;
		me.container = container;
		
		if (results)
		{
			var colfix,
				rowfix,
				rows,
				cols,
				i,
				chart,
				chartdiv,
				tw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container),
				th = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container),
				px = 0, py = 0, pw,
				gtype;
			
			cols = results.cols;
			rows = results.data.length;
			colfix = results.colfix;
			rowfix = results.rowfix;
			
			container.empty();
			me.dataIndex = 0;
			me.charts = [];
			me.results = results;
			
			switch (cop.f_gauge_type)
			{
			case "cylinder":
				gtype = "Cylinder";
				break;
			case "hlinear":
				gtype = "HLinearGauge";
				break;
			default:
				gtype = "AngularGauge";
				break;
			}
			
			if (cols > colfix)
			{
				pw = tw / (cols - colfix); 
				for (i=colfix; i < cols; i++)
				{
					chart = new FusionCharts(
					{
						type: gtype, 
						debugMode: false
					});
					
					chartdiv = $("<div class='idv-gauge-cntr'></div>").appendTo(container);
					
					chartdiv.css({
						top: py + "px",
						left: px + "px",
						width: pw + "px",
						height: th + "px"
					});
					
					px += pw;
					
					chart.render(chartdiv[0]);
					
					me.charts.push({
						chart: chart,
						chartdiv: chartdiv
					});
				}
				
				if (rows > rowfix)
				{
					this.playData();
				}
			}
		}
	};
	
	this.playData = function() {
		var me = this,
			i,
			owner = me.owner,
			results = me.results,
			cols = results.cols,
			rows = results.data.length,
			colfix = results.colfix,
			rowfix = results.rowfix,
			chart,
			chartdiv,
			container = me.container,
			tw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container),
			th = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container),
			px = 0, py = 0, pw,
			cop = owner.cop,
			row, mr,
			rtime,
			title;
			
		var chartoption = {
		    "chart": {
		        "manageresize": "1",
		        "origw": "350",
		        "origh": "200",
		        "palette": cop.f_palette || "2",
		        "lowerlimit": "0",
		        "upperlimit": "100",
		        "numbersuffix": "%",
		        "showborder": "0",
		        "charttopmargin": "0",
		        "chartbottommargin": "0",
		        "tooltipbgcolor": "009999",
		        "gaugefillmix": "{dark-10},{light-70},{dark-10}",
		        "gaugefillratio": "3",
		        "pivotradius": "8",
		        "gaugeouterradius": "120",
		        "gaugeinnerradius": "70%",
		        "gaugeoriginx": "175",
		        "gaugeoriginy": "170",
		        "trendvaluedistance": "5",
		        "tickvaluedistance": "3",
		        "managevalueoverlapping": "1",
		        "autoaligntickvalues": "1"
		    },
		    "colorrange": {
		        "color": [
		            {
		                "minvalue": "0",
		                "maxvalue": "45",
		                "code": "FF654F"
		            },
		            {
		                "minvalue": "45",
		                "maxvalue": "80",
		                "code": "F6BD0F"
		            },
		            {
		                "minvalue": "80",
		                "maxvalue": "100",
		                "code": "8BBA00"
		            }
		        ]
		    },
		    "dials": {
		        "dial": [
		            {
		                "value": "0",
		                "rearextension": "10",
		                "basewidth": "10"
		            }
		        ]
		    }
		    /*,
		    "trendpoints": {
		        "point": [
		            {
		                "startvalue": "62",
		                "displayvalue": "Average",
		                "usemarker": "1",
		                "markerradius": "8",
		                "dashed": "1",
		                "dashlen": "2",
		                "dashgap": "2"
		            }
		        ]
		    }
		    */
		};
		
		pw = tw / me.charts.length; 
		mr = me.dataIndex + rowfix;
		if (mr > rows)
		{
			mr = rowfix;
		}
		row = results.data[mr];
		
		for (i=0; i < colfix; i++)
		{
			title = (i == 0) ? row[i].text : title + " " + row[i].text;
		}
		
		for (i=colfix; i < cols; i++)
		{
			chart = me.charts[i-colfix].chart;
			chartdiv = me.charts[i-colfix].chartdiv;
			chartdiv.css({
				top: py + "px",
				left: px + "px",
				width: pw + "px",
				height: th + "px"
			});
			
			px += pw;
			
			chartoption.chart.caption = title;
			switch (cop.f_gauge_type)
			{
			case "cylinder":
			case "hlinear":
				chartoption.value = row[i].code;
				break;
			default:
				chartoption.dials.dial[0].value = row[i].code;
				break;
			}
			
			chart.setJSONData(chartoption);
		}
		
		me.dataIndex ++;
		if (me.dataIndex + rowfix >= rows)
		{
			me.dataIndex = 0;
		}
		
		rtime = parseInt(cop.f_gauge_refresh || "2") || 2;
		rtime = rtime * 1000;
		
		if (rows > rowfix && rowfix + 1 > rows)
		{
			setTimeout(function() {
				me.playData.call(me);
			}, rtime);
		}
	},

	this.updatedisplay = function(owner, w, h) {
		// this.map.m1.call(this.map);
		var me = this;
		me.playData.call(me);
	};
}