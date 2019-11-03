IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];

IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label:"Korea map", 
		charttype: "koreamap", 
		subtype: "koreamap", 
		img: "svg.korea", 
		grp: "scientific"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.koreamap = function(owner) {
	this.owner = owner;
	
	this.drawChart = function(owner, results) {
		var container = owner.container,
			svgmap;
		
		this.map = svgmap = new IG$/*mainapp*/.m$sm/*svgloader*/($(container));
		svgmap.load("./data/korea_location_map3.svg");

		svgmap.l5.bind("svgloaded", function() {
			var i; var j;
			var row;
			var colfix, rowfix;
			var cell; var celltext;
			var pt;
			var measureindex;
			var ptval;
			var chartoption = {
				point: {},
				measures: []
			};

			if (results)
			{
				colfix = results.colfix;
				rowfix = results.rowfix;
				for (i=0; i < results.data.length; i++)
				{
					row = results.data[i];

					if (i < rowfix)
					{
						for (j=colfix; j < row.length; j++)
						{
							cell = row[j];
							celltext = cell.text || cell.code;
							if (i == 0)
							{
								chartoption.measures.push({
									text: celltext,
									min: null,
									max: null
								});
							}
							else
							{
								chartoption.measures[j-colfix].text += " " + celltext;
							}
						}
					}
					else
					{
						for (j=0; j < row.length; j++)
						{
							cell = row[j];
							celltext = cell.text || cell.code;
							if (j < colfix)
							{
								// row data area
								if (j == 0)
								{
									pt = chartoption.point[celltext];
									if (!pt)
									{
										pt = {
											mapid: celltext,
											data: []
										};
									}
								}
							}
							else
							{
								// data area
								measureindex = j-colfix;
								ptval = Number(celltext);

								if (isNaN(ptval) == false)
								{
									chartoption.measures[measureindex].min = (chartoption.measures[measureindex].min == null) ? ptval : Math.min(chartoption.measures[measureindex].min, ptval);
									chartoption.measures[measureindex].max = (chartoption.measures[measureindex].max == null) ? ptval : Math.max(chartoption.measures[measureindex].max, ptval);
								}

								if (pt.data.length > measureindex)
								{
									pt.data[measureindex] = ptval;
								}
								else
								{
									pt.data.push(ptval);
								}
							}
						}

						chartoption.point[pt.mapid] = pt;
					}
				}
			}

			svgmap.loadData(chartoption);
		});
	};

	this.updatedisplay = function(owner, w, h) {
		this.map.m1.call(this.map);
	};
};