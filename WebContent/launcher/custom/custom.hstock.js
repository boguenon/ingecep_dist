IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label: "Stock Chart",
		charttype: "hstock",
		subtype: "hstock",
		img: "hstock",
		grp: "h-stock"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.hstock = function(owner) {
	this.owner = owner;
}

IG$/*mainapp*/.__c_/*chartoption*/.chartext.hstock.prototype = {	
	drawChart: function(owner, results) {
		if (!IG$/*mainapp*/.__c_/*chartoption*/.chartext.hstock._loaded)
		{
			var me = this,
				js = [
					"./custom/custom.hstock.worker.js"
				],
				ltest = 0;
			
			IG$/*mainapp*/.x03/*getScriptCache*/(
				js, 
				new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
					IG$/*mainapp*/.__c_/*chartoption*/.chartext.hstock._loaded = 1;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	updatedisplay: function(owner, w, h) {
	}
};