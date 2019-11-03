IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];

IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label:"Heat map",
		charttype: "heatmap",
		subtype: "heatmap",
		img: "heatmap",
		grp: "scientific"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.heatmap = function(owner) {
	this.owner = owner;
}

IG$/*mainapp*/.__c_/*chartoption*/.chartext.heatmap.prototype = {
	drawChart: function(owner, results) {
		if (!IG$/*mainapp*/.__c_/*chartoption*/.chartext.heatmap._loaded)
		{
			var me = this,
				js = [
					"./js/modules/heatmap.js",
					"./custom/custom.heatmap.worker.js"
				],
				ltest = 0;
			
			IG$/*mainapp*/.x03/*getScriptCache*/(
				js, 
				new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
					IG$/*mainapp*/.__c_/*chartoption*/.chartext.heatmap._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	
	updatedisplay: function(owner, w, h) {
	}
};