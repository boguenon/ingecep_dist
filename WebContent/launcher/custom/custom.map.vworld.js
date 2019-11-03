IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];

IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label: "VWorld Map",
		charttype: "vworldmap",
		subtype: "vworldmap",
		img: "map.vworld",
		grp: "scientific"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.vworldmap = function(owner) {
	this.drawChart = function(owner, results) {
		var me = this,
			js = [
				"./custom/custom.map.vworld.worker.js"
			];
		
		if (IG$/*mainapp*/.__c_/*chartoption*/.chartext.vworldmap_main)
		{
			if (me.dmain)
			{
				me.dmain.dispose();
				me.dmain = null;
			}
			
			me.dmain = new IG$/*mainapp*/.__c_/*chartoption*/.chartext.vworldmap_main(owner);
			me.dmain.drawChart.call(me.dmain, owner, results);
		}
		else
		{
			if (!IG$/*mainapp*/.__c_/*chartoption*/.chartext.vworldmap._loaded)
			{
				IG$/*mainapp*/.x03/*getScriptCache*/(
					js, 
					new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
						IG$/*mainapp*/.__c_/*chartoption*/.chartext.vworldmap._loaded = 1;
						var dmain = new IG$/*mainapp*/.__c_/*chartoption*/.chartext.vworldmap_main(owner);
						me.dmain = dmain;
						dmain.drawChart.call(dmain, owner, results);
					})
				);
			}
		}
	},
	
	this.updatedisplay = function(owner, w, h) {
		var me = this;
		
		if (me.dmain)
		{
			me.dmain.updatedisplay.call(me.dmain, owner, w, h);
		}
	};
};