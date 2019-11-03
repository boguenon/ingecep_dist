IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];

IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label: "Naver Map",
		charttype: "navermap",
		subtype: "navermap",
		img: "map.naver",
		grp: "scientific"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.navermap = function(owner) {
	this.drawChart = function(owner, results) {
		var me = this,
			js = [
				"./custom/custom.map.naver.worker.js"
			];
		
		if (IG$/*mainapp*/.__c_/*chartoption*/.chartext.navermap_main)
		{
			if (me.dmain)
			{
				me.dmain.dispose();
				me.dmain = null;
			}
			
			me.dmain = new IG$/*mainapp*/.__c_/*chartoption*/.chartext.navermap_main(owner);
			me.dmain.drawChart.call(me.dmain, owner, results);
		}
		else
		{
			if (!IG$/*mainapp*/.__c_/*chartoption*/.chartext.navermap._loaded)
			{
				IG$/*mainapp*/.x03/*getScriptCache*/(
					js, 
					new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
						IG$/*mainapp*/.__c_/*chartoption*/.chartext.navermap._loaded = 1;
						var dmain = new IG$/*mainapp*/.__c_/*chartoption*/.chartext.navermap_main(owner);
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