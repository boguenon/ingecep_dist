IG$/*mainapp*/.__c_/*chartoption*/.chartext.demo_edu.prototype.drawChart = function(owner, results) {
	var me = this,
		container = $(owner.container),
		sop = owner._ILb,
		cop = owner.cop,
		usedualaxis = cop.usedualaxis,
		dualaxisitem = cop.dualaxisitem;
	
	me.owner = owner;
	me.container = container;
	
	container.empty();
	
	if (results)
	{
		var colfix,
			rowfix,
			rows,
			cols,
			i, j, k,
			chart,
			chartdiv,
			tw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container),
			th = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container),
			px = 0, py = 0, pw,
			gtype,
			series = [],
			data,
			dtcol = 0, dt,
			s, sname,
			dr,
			df,
			v, y, m, d, h, mm, ss,
			yaxis = [
				{
					labels: {
						align: "right",
						x: -3
					},
					title: {
						text: null
					}
				}
			];
		
		cols = results.cols;
		rows = results.data.length;
		colfix = results.colfix;
		rowfix = results.rowfix;
		data = results.data;
		
		container.empty();
		me.dataIndex = 0;
		me.results = results;
		
		if (cop.s_t_f)
		{
			for (i=0; i < sop.rows.length; i++)
			{
				if (sop.rows[i].uid == cop.s_t_f)
				{
					dtcol = i;
					break;
				}
			}
		}
		
		var copt = {
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie',
	            renderTo: container[0]
	        },
	        title: {
	            text: 'Browser market shares January, 2015 to May, 2015'
	        },
	        tooltip: {
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    }
	                }
	            }
	        },
	        series: [{
	            name: "Brands",
	            colorByPoint: true,
	            data: [{
	                name: "Microsoft Internet Explorer",
	                y: 56.33
	            }, {
	                name: "Chrome",
	                y: 24.03,
	                sliced: true,
	                selected: true
	            }, {
	                name: "Firefox",
	                y: 10.38
	            }, {
	                name: "Safari",
	                y: 4.77
	            }, {
	                name: "Opera",
	                y: 0.91
	            }, {
	                name: "Proprietary or Undetectable",
	                y: 0.2
	            }]
	        }]
	    };
		
		me.hchart = new Highcharts.Chart(copt);
	}
};
	
IG$/*mainapp*/.__c_/*chartoption*/.chartext.demo_edu.prototype.updatedisplay = function(owner, w, h) {
	var me = this;
	me.hchart && me.hchart.setSize(w, h);
};