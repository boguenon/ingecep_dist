IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];


IG$/*mainapp*/.__c_/*chartoption*/.chartext.heatmap.prototype.drawChart = function(owner, results) {
	var me = this,
		container = $(owner.container),
		cop = owner.cop;
	
	me.owner = owner;
	me.container = container;
	
	me.container.empty();
		
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
			px = 0, py = 0, pw,
			gtype,
			sname,
			sdata = [],
			nchart = 0,
			f_ind_svalue_n = -1,
			ncnt,
			hoption,
			xaxis = [],
			yaxis = [],
			chartdata = [],
			data = results.data,
			tval,
			mval,
			cop = owner.cop;
		
		cols = results.cols;
		rows = results.data.length;
		colfix = results.colfix;
		rowfix = results.rowfix;
		
		for (i=colfix; i < cols; i++)
		{
			for (j=0; j < rowfix; j++)
			{
				tval = (j == 0) ? data[j][i].text : tval + " " + data[j][i].text;
			}
			
			xaxis.push(tval);
		}
		
		for (i=rowfix; i < rows; i++)
		{
			for (j=0; j < colfix; j++)
			{
				tval = (j == 0) ? data[i][j].text : tval + " " + data[i][j].text;
			}
			
			yaxis.push(tval);
		}
		
		for (i=rowfix; i < rows; i++)
		{
			for (j=colfix; j < cols; j++)
			{
				mval = [
					j - colfix, 
					i - rowfix,
					(Number(data[i][j].code) || 0)
				];
				
				chartdata.push(mval);
			}
		}
		
		var c_cset = cop.colorset,
			colorlist;

		if (IG$/*mainapp*/.__c_/*chartoption*/ && IG$/*mainapp*/.__c_/*chartoption*/.chartcolors && IG$/*mainapp*/.__c_/*chartoption*/.chartcolors[c_cset])
		{
			colorlist =  IG$/*mainapp*/.__c_/*chartoption*/.chartcolors[c_cset];
		}
		
		hoption = {
			chart: {
				type: 'heatmap',
				marginTop: 40,
				marginBottom: 80,
				plotBorderWidth: 1,
				renderTo: me.container[0]
			},
			
			xAxis: {
				categories: xaxis
			},
			
			yAxis: {
				categories: yaxis,
				title: {
					text: cop.yaxistitle || null,
					enabled: cop.yaxistitle ? true : false
				}
			},
			
			colorAxis: {
				min: 0,
				minColor: '#FFFFFF',
				maxColor: colorlist && colorlist.length ? colorlist[0] : Highcharts.getOptions().colors[0]
			},
			
			legend: {
				align: 'right',
				layout: 'vertical',
				margin: 0,
				verticalAlign: 'top',
				y: 25,
				symbolHeight: 280
			},
			
			tooltip: {
				formatter: function () {
					return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
						this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
				}
			},
			
			series: [
				{
					name: 'Sales per employee',
					borderWidth: 1,
					data: chartdata,
					dataLabels: {
						enabled: true,
						color: '#000000'
					}
				}
			]
		};
		
		if (cop.showtitle)
		{
			hoption.title = {
				text: cop.title || ""
			};
		}
		else
		{
			hoption.title = {
				text: ""
			};
		}
		
		var masterChart = new Highcharts.Chart(hoption);
	}
};

IG$/*mainapp*/.__c_/*chartoption*/.chartext.heatmap.prototype.updatedisplay = function(owner, w, h) {
	// this.map.m1.call(this.map);
	var me = this,
		i,
		px = 0, py = 0, pw, ph = h;
}
