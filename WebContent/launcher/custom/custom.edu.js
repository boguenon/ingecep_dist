IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label: "데모 실습용",
		charttype: "demo_edu",
		subtype: "demo_edu",
		img: "demo_edu",
		grp: "cartesian"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.demo_edu = function(owner) {
	this.owner = owner;
}

IG$/*mainapp*/.__c_/*chartoption*/.chartext.demo_edu.prototype = {	
	drawChart: function(owner, results) {
		if (!IG$/*mainapp*/.__c_/*chartoption*/.chartext.hstock._loaded)
		{
			var me = this,
				js = [
					"./custom/custom.edu.worker.js"
				],
				ltest = 0;
			
			IG$/*mainapp*/.x03/*getScriptCache*/(
				js, 
				new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	updatedisplay: function(owner, w, h) {
	}
};