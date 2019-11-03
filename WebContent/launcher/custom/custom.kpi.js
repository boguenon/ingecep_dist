IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];

IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label:"KPI Indicator",
		charttype: "kpi",
		subtype: "kpi",
		img: "kpi",
		grp: "scientific"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.kpi = function(owner) {
	this.owner = owner;
}

IG$/*mainapp*/.__c_/*chartoption*/.chartext.kpi.prototype = {
	drawChart: function(owner, results) {
		if (!IG$/*mainapp*/.__c_/*chartoption*/.chartext.kpi._loaded)
		{
			var me = this,
				js = [
					"./custom/custom.kpi.worker.js",
					"./js/modules/funnel.js",
					"./js/modules/solid-gauge.js"
				],
				ltest = 0;
			
			IG$/*mainapp*/.x03/*getScriptCache*/(
				js, 
				new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
					IG$/*mainapp*/.__c_/*chartoption*/.chartext.kpi._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	
	updatedisplay: function(owner, w, h) {
	}
};