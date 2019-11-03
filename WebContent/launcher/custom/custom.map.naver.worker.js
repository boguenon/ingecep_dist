IG$/*mainapp*/.__c_/*chartoption*/.chartext.navermap_main = function(owner) {
	this.owner = owner;
	
	this._tmpl = function(tmpl, dpoint, gmap) {
		var r = tmpl,
			pdata = dpoint.data,
			k, s, m, c;
		
		for (k in gmap)
		{
			m = "{" + k + "}";
			s = r.indexOf(m);
			if (s > -1)
			{
				c = pdata[gmap[k]];
				r = r.substring(0, s) + (c.text || c.code) + r.substring(s + m.length);
			}
		}
		return r;
	};
	
	this.drawChart = function(owner, results) {
		var me = this,
			container = owner.container,
			jcontainer = $(container),
			cop = owner.cop, // chart option information
			map,
			seriesname,
			markermap = {},
			i, j;
		
		jcontainer.empty();
		var defaultLevel = parseInt(cop.m_zoom_level) || 11;
		
		var mlng = 126.9773356,
			mlat = 37.5675451,
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
			
			mlng = (maxLng + minLng) / 2;
			mlat = (maxLat + minLat) / 2;
		}
		
		var mpoint = new nhn.api.map.LatLng(mlat, mlng);
		
        map = new nhn.api.map.Map(jcontainer[0], { 
			point : mpoint,
			zoom : defaultLevel,
			enableWheelZoom : true,
			enableDragPan : true,
			enableDblClickZoom : false,
			mapMode : 0,
			activateTrafficMap : false,
			activateBicycleMap : false,
			minMaxLevel : [ 1, 14 ]
		});
		me.map = map;
		
		var oSize = new nhn.api.map.Size(28, 37);
        var oOffset = new nhn.api.map.Size(14, 37);
        var oIcon = new nhn.api.map.Icon('http://static.naver.com/maps2/icons/pin_spot2.png', oSize, oOffset);
		
		var colfix = results.colfix,
			rowfix = results.rowfix,
			p,
			d,
			dval,
			dindex = 0,
			nmax, nmin, pt,
			gmap = {}, g;
		
		if (colfix > -1 && colfix < results.cols)
		{
			for (i=0; i < rowfix; i++)
			{
				seriesname = (i==0) ? results.data[i][colfix].code : seriesname + " " + results.data[i][colfix].code;
			}
		}
		
		for (i=0; i < results.cols; i++)
		{
			for (j=0; j < rowfix; j++)
			{
				g = (j == 0) ? results.data[j][i].text : g + " " + results.data[j][i].text;
			}
			gmap[g] = i;
		}
		
		var mapInfoTestWindow = new nhn.api.map.InfoWindow(); // - info window 생성
        mapInfoTestWindow.setVisible(false); // - infowindow 표시 여부 지정.
        map.addOverlay(mapInfoTestWindow);     // - 지도에 추가.     


		var oLabel = new nhn.api.map.MarkerLabel();
		map.addOverlay(oLabel);
		
		map.attach('mouseenter', function(oCustomEvent) {
	        var oTarget = oCustomEvent.target;
	        // 마커위에 마우스 올라간거면
	        if (oTarget instanceof nhn.api.map.Marker) {
                var oMarker = oTarget;
                oLabel.setVisible(true, oMarker); // - 특정 마커를 지정하여 해당 마커의 title을 보여준다.
	        }
		});
		
		map.attach('mouseleave', function(oCustomEvent) {
			var oTarget = oCustomEvent.target;
			// 마커위에서 마우스 나간거면
			if (oTarget instanceof nhn.api.map.Marker) {
				oLabel.setVisible(false);
			}
        });

		map.attach("click", function(e) {
			var pt = e.point,
				target = e.target,
				m_gdata,
				param,
				sender,
				row,
				disp, n, k,
				ni;
			
			var oPoint = e.point;
            var oTarget = e.target;
            mapInfoTestWindow.setVisible(false);

			mapInfoTestWindow.setVisible(false);
			
			if (target instanceof nhn.api.map.Marker || target instanceof nhn.api.map.Circle) 
			{
				if (e.clickCoveredMarker)
				{
					return;
				}
				
				m_gdata = target.m_gdata;
				
				if (m_gdata && m_gdata.length > 0)
				{
					disp = '<DIV style="border-top:1px solid; border-bottom:2px groove black; border-left:1px solid; border-right:2px groove black;margin-bottom:1px;color:black;background-color:white; width:auto; height:auto;">';
					
					for (ni=0; ni < m_gdata.length; ni++)
					{
						var m_g = m_gdata[ni];
						row = results.data[m_g.row];
						sender = {
							name: seriesname
						};
						
						param = {
							point: {
								category: m_g.disp
							}
						};
						
						if (sender.name.charAt(sender.name.length-1) == ' ')
						{
							sender.name = sender.name.substring(0, sender.name.length - 1);
						}
						
	                    disp += '<span style="color: #000000 !important;display: inline-block;font-size: 12px !important;font-weight: bold !important;letter-spacing: -1px !important;white-space: nowrap !important; padding: 2px 2px 2px 2px !important">';
	                    disp += m_g.disp + '</span>';
	                    
	                    disp += '<span style="font-weight: normal">  ';
	                    
	                    for (n=colfix; n<row.length; n++)
	                    {
	                    	var t = "";
	                    	for (k=0; k < rowfix; k++)
	                    	{
	                    		t = (k == 0) ? results.data[k][n].text : t + " " + results.data[k][n].text;
	                    	}
	                    	
	                    	disp += "<br />" + t + ": " + row[n].text;
	                    }
	                    
	                    disp += '<span>';
					}
					
					disp += "</DIV>";
					
					mapInfoTestWindow.setContent(disp);
					if (oTarget.getCenterPoint)
					{
						mapInfoTestWindow.setPoint(oTarget.getCenterPoint());
					}
					else
					{
						mapInfoTestWindow.setPoint(oTarget.getPoint());
					}
                    
                    mapInfoTestWindow.setVisible(true);
                    mapInfoTestWindow.setPosition({right : 15, top : 30});
                    mapInfoTestWindow.autoPosition();
					
					owner.p1/*processClickEvent*/.call(owner, sender, param);
				}
			}
		});

		var oLabel = new nhn.api.map.MarkerLabel(); // - 마커 라벨 선언.
		
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
		
		var n_min = parseInt(cop.m_min) || 1000,
			n_max = parseInt(cop.m_max) || 10000,
			r;
		
		var marker,
			tmpl,
			p;
		
		// testing
//		tmpl = cop.cdata_m_tmpl;
//		if (tmpl)
//		{
//			p = {
//				data: results.data[3]
//			};
//			tmpl = me._tmpl(tmpl, p, gmap);
//			
//			marker = new nhn.api.map.InfoWindow({
//				point: mpoint,
//				content: tmpl
//			});
//			
//			marker.setVisible(true);
//				
//			map.addOverlay(marker);
//		}
		
		for (i=0; i < results.geodata.length; i++)
		{
			p = results.geodata[i];
			mkey = p.lat + "_" + p.lng;
			pt = new nhn.api.map.LatLng(p.lat, p.lng);
			
			if (cop.m_marker == "circle")
			{
				dval = Number(p.data[colfix].code);
				
				if (nmax - nmin > 0)
				{
					r = n_min + (n_max - n_min) * (dval - nmin) / (nmax - nmin);
				}
				else
				{
					r = n_min;
				}
				
				marker = new nhn.api.map.Circle({
					centerPoint: pt,
					fillColor: "#ff0000",
					fillOpacity: 0.3,
					radius: r
				});
				
				marker.m_gdata = [p];
					
				map.addOverlay(marker);
			}
			else if (cop.m_marker == "info")
			{
				tmpl = cop.cdata_m_tmpl;
				if (tmpl)
				{
					tmpl = me._tmpl(tmpl, p, gmap);
					
					marker = new nhn.api.map.InfoWindow({
						point: pt,
						content: tmpl
					});
					
					marker.m_gdata = [p];
					marker.setVisible(true);
					map.addOverlay(marker);
				}
			}
			else
			{
				if (markermap[mkey])
				{
					marker = markermap[mkey];
					marker.m_gdata.push(p);
				}
				else
				{
				 	marker = new nhn.api.map.Marker(oIcon, { title : '마커 : ' + pt.toString() });
				 	markermap[mkey] = marker;
				 	
				 	marker.m_gdata = [p];
				 	marker.setPoint(pt);
					map.addOverlay(marker);
				}
			}
		}

	};

	this.updatedisplay = function(owner, w, h) {
		var me = this,
			map = me.map;
			
		if (map)
		{
			map.setSize.call(map, new naver.maps.Size(w, h));
		}
	};
	
	this.dispose = function() {
		var me = this;
		
		me.owner && me.owner.container && $(me.owner.container).empty();
	};
}