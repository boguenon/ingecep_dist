IG$/*mainapp*/.__c_/*chartoption*/.charttype = IG$/*mainapp*/.__c_/*chartoption*/.charttype || [];

IG$/*mainapp*/.__c_/*chartoption*/.charttype.push(
	{
		label: "SGIS Map",
		charttype: "sgismap",
		subtype: "sgismap",
		img: "map.sgis",
		grp: "scientific"
	}
);

IG$/*mainapp*/.__c_/*chartoption*/.chartext.sgismap = function(owner) {
	this.owner = owner;
	
	this.drawChart = function(owner, results) {
		var me = this,
			container = owner.container,
			i, j;
		
		/* 1. sgismap영역에 map생성 */
		$(container).empty();
		mapCreate(container);
		me.sgismap = sgismap;
		/* 2. 지도 크기변경	 */
		// document.getElementById("sgismap").style.width = "650px";
		// document.getElementById("sgismap").style.height  = "400px";								
		/* 3. 지도 레벨로 설정.*/
		var zoomLevel = (4);			
							
		/* 4. 중심점 설정(x,y) */
		var mlon = 197752.5,
			mlat = 451441,
			minLng, maxLng, minLat, maxLat;
			
		if (results && results.geodata.length > 0)
		{
			for (i=0; i < results.geodata.length; i++)
			{
				minLng = (i == 0) ? Number(results.geodata[i].lng) : Math.min(minLng, Number(results.geodata[i].lng));
				maxLng = (i == 0) ? Number(results.geodata[i].lng) : Math.max(maxLng, Number(results.geodata[i].lng));
				minLat = (i == 0) ? Number(results.geodata[i].lat) : Math.min(minLat, Number(results.geodata[i].lat));
				maxLat = (i == 0) ? Number(results.geodata[i].lat) : Math.max(maxLat, Number(results.geodata[i].lat));
			}
			
			mlon = (maxLng - minLng) / 2;
			mlat = (maxLat - minLat) / 2;
		}
		
		addControl("zoomInIcon");
		addControl("zoomOutIcon");
			
		var lonLat = new OpenLayers.LonLat(mlon, mlat);								
		/* 5. 설정한 좌표의 중심으로 지도를 이동 */
		sgismap.setCenter(lonLat, zoomLevel);
		
		setLegendLevel("15");
		setLegendColor("green");
		var p, t=20, r, rmin = 1000, rmax=5000, px, py,
			colfix = results.colfix,
			nmax, nmin,
			dindex = 0,
			dval,
			kml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><kml xmlns=\"http://www.opengis.net/kml/2.2\">";
		kml += "<Document>";
		
		for (i=0; i < results.geodata.length; i++)
		{
			p = results.geodata[i];
			p.lat = Number(p.lat);
			p.lng = Number(p.lng);
			d = results.data[p.row];
			p.data = d;
			for (j=0; j < colfix; j++)
			{
				p.disp = (j==0) ? d[j].text : p.disp + " " + d[j].text;
			}
			
			dval = Number(p.data[colfix + dindex].code);
			if (isNaN(dval) == false)
			{
				nmax = isNaN(nmax) ? dval : Math.max(nmax, dval);
				nmin = isNaN(nmin) ? dval : Math.min(nmin, dval);
			}
			p.dval = dval;
		}
		
		for (i=0; i < results.geodata.length; i++)
		{
			p = results.geodata[i];
			kml += "<Placemark><name>" + p.disp + "</name><description>" + p.disp + "</description><MultiGeometry>"
			
			kml += "<Polygon><outerBoundaryIs><LinearRing><coordinates>";
			
			for (j=0; j < t; j++)
			{
				r = rmin + (rmax - rmin) * (p.dval / (nmax - nmin));
				theta = j * (2*3.14) / t;
				py = p.lng + Math.cos(theta) * r;
				px = p.lat + Math.sin(theta) * r;
				kml += (j == 0) ? px + "," + py : " " + px + "," + py;
			}
			kml += "</coordinates></LinearRing></outerBoundaryIs></Polygon>";
			
			kml += "</MultiGeometry></Placemark>";
		}
		kml += "</Document></kml>";
		
		var data = {
		"item_name":"(n)",
		"item_code":"in_age_001",
		"max": nmax,"min": nmin,
		"unit":"(n)"
		};
		
		for (i=0; i < results.geodata.length; i++)
		{
			p = results.geodata[i];
			data[p.disp] = {
				"item_value": p.dval,
				"rank": i
			};
		}
		getStatisticsValue(data, kml);
	};

	this.updatedisplay = function(owner, w, h) {
		this.map.m1.call(this.map);
	};
}