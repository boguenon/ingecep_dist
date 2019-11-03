IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];

IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label:"Image Viewer",
		charttype: "imgviewer",
		subtype: "imgviewer",
		img: "imgviewer",
		grp: "scientific"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.imgviewer = function(owner) {
	this.owner = owner;
}

IG$/*mainapp*/.__c_/*chartoption*/.chartext.imgviewer.prototype = {
	drawChart: function(owner, results) {
		if (!IG$/*mainapp*/.__c_/*chartoption*/.chartext.imgviewer._loaded)
		{
			var me = this,
				js = [
					"./custom/custom.imageviewer.worker.js"
				],
				ltest = 0;
			
			IG$/*mainapp*/.x03/*getScriptCache*/(
				js, 
				new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
					IG$/*mainapp*/.__c_/*chartoption*/.chartext.imgviewer._loaded = true;
					me.drawChart.call(me, owner, results);
				})
			);
		}
	},
	
	updatedisplay: function(owner, w, h) {
	}
};