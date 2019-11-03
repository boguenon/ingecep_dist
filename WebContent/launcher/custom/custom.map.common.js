if (!IG$/*mainapp*/.geocoder)
{
	IG$/*mainapp*/.geocoder = {};
}

IG$/*mainapp*/.geocoder["com.ingecep.geo.SGIS"] = {
	getGeoCode: function(mvalue) {
		var r =  {
			lat: null, 
			lng: null
		};
		
		var m = eval('(' + mvalue + ')');
		
		if (m.length > 0)
		{
			r.lat = m[0].posX;
			r.lng = m[0].posY;
		}
		
		return r;
	}
}
