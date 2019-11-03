IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];

IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label:"Google map",
		charttype: "googlemap",
		subtype: "googlemap",
		img: "map.google",
		grp: "scientific"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.googlemap = function(owner) {
	this.owner = owner;
};

// https://maps.googleapis.com/maps/api/js?&sensor=false

IG$/*mainapp*/.__c_/*chartoption*/.chartext.googlemap.prototype = {
	drawChart: function(owner, results) {
		if (!IG$/*mainapp*/.__c_/*chartoption*/.chartext.googlemap._loaded)
		{
			var me = this,
				js = [
					"./custom/custom.map.google.worker.js",
					"./custom/custom.map.google.clustermarker.js"
				],
				ltest = 0;
			
			IG$/*mainapp*/.x03/*getScriptCache*/(
				js, 
				new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
					IG$/*mainapp*/.__c_/*chartoption*/.chartext.googlemap._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},

	updatedisplay: function(owner, w, h) {
		var me = this,
			map = me.map;
			
		if (map)
		{
			google.maps.event.trigger(map, "resize");
		}
	}
};
