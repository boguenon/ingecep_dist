IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];

IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label:"Sankey Diagram",
		charttype: "sankey",
		subtype: "sankey",
		img: "sankey",
		grp: "scientific"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.sankey = function(owner) {
	this.owner = owner;
};

// https://maps.googleapis.com/maps/api/js?&sensor=false

IG$/*mainapp*/.__c_/*chartoption*/.chartext.sankey.prototype = {
	drawChart: function(owner, results) {
		if (!IG$/*mainapp*/.__c_/*chartoption*/.chartext.sankey._loaded)
		{
			var me = this,
				js = [
					"./custom/custom.sankey.worker.js",
					"./custom/sankey.js"
				],
				ltest = 0;
			
			IG$/*mainapp*/.x03/*getScriptCache*/(
				js, 
				new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
					IG$/*mainapp*/.__c_/*chartoption*/.chartext.sankey._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},

	updatedisplay: function(owner, w, h) {
		var me = this;
		
		if (me._owner && me._results)
		{
			me.drawChart.call(me, me._owner, me._results);
		}
	},
	
	destroy: function() {
		var me = this;
	}
};

