/*
amplixbi.com on MPLIX project
Copyright(c) 2011 amplixbi.com
http://www.amplixbi.com/
*/
/*
This file is part of INGECEP

Copyright (c) 2011-2013 INGECEP Inc

Contact:  http://www.ingecep.com/contact

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.ingecep.com/contact.

*/
function m$TM(docroot) {
	var me = this;
	
	me.category = null;
	me.cdoc = null;
	me.border = 1;
	me.padding = 2;
	me.ty = 0;
	me.focused = null;
	me.docroot = docroot;
	me.docroot.empty();
	me._IFd/*init_f*/();
}

m$TM.prototype = {
	_IFd/*init_f*/: function() {
	},
	
	loadData: function(data, category) {
		var me = this;
		me.data = data;
		me.category = category;
		me.drawData(me.docroot, data);
	},
	
	drawData: function(doc, data) {
		var me = this,
			w = doc.width(),
			h = doc.height(),
			i,
			category = me.category;
		
		me.ty = 0;
		me.curdata = data;
		
		if (!data.dom)
		{
			me.makeDom(data, 0);
		}
		if (me.cdoc)
		{
			me.cdoc.remove();
		}
		if (category && category.length > 1)
		{
			me.cdoc = $("<div class='mtreemap-caption'></div>");
			doc.append(me.cdoc);
			for (i=0; i < category.length; i++)
			{
				$("<input type='radio' name='category' value='" + i + "'>" + category[i].name + "&nbsp;&nbsp;&nbsp;&nbsp;</input>")
					.attr("checked", category[i].selected)
					.appendTo(me.cdoc)
					.bind("change", function(ev) {
						var v = $(ev.currentTarget).val();
						v = parseInt(v);
						data.dom.trigger("changeCateg", {ti: v});
					});
			}
			
			me.ty = me.cdoc.height();
		}
		doc.append(data.dom);
		me.position(data.dom, 0, me.ty, w, h - me.ty);
		me.layout(data, 0, w, h - me.ty);
	},
	
	makeDom: function(tree, level) {
		var me = this,
			caption = $("<div class='mtreemap-caption'></div>"),
			clsname = 'mtreemap-node mtreemap-level' + Math.min(level, 4),
			dom = $("<div class='" + clsname + "'></div>").css({zIndex: 1});
			
		dom.bind("mousedown", function(e) {
			e.stopPropagation();
			
			if (e.button == 0) {
				if (me.focused && tree == me.focused && me.focused.parent) 
				{
					me.focus.call(me, me.focused.parent);
				}
				else
				{
					me.focus.call(me, tree);
				}	
			}
			
			return true;
		});

  		caption.html(tree.name);
  		dom.append(caption);
  		tree.dom = dom;
  		
  		return dom;
	},
	
	position: function(dom, x, y, width, height) {
		// CSS width/height does not include border.
		var me = this;
		width -= me.border*2;
		height -= me.border*2;
		
		dom.css({
			left: x, 
			top: y, 
			width: Math.max(width, 0), 
			height: Math.max(height, 0)
		});
	},
	
	layout: function(tree, level, width, height) {
  		if (!('children' in tree))
    		return;

  		var me = this,
  			padding = me.padding,
  			total = tree.data['$area'],
  			tmin = tree.data["$min"],
  			tmax = tree.data["$max"];

  		// XXX why do I need an extra -1/-2 here for width/height to look right?
  		var x1 = 0, 
  			y1 = 0, 
  			x2 = width - 1, 
  			y2 = height - 2,
  			pixels_to_units,
  			start,
  			ysplit,
  			space,
  			span,
  			end,
  			rsum,
  			x, y, i,
  			size, frac, tooltip,
  			child,
  			c,
  			depth;
  			
  		x1 += padding; y1 += padding;
  		x2 -= padding; y2 -= padding;
  		y1 += 14;  // XXX get first child height for caption spacing

  		pixels_to_units = Math.sqrt(total / ((x2 - x1) * (y2 - y1)));

  		for (start = 0; child = tree.children[start]; ++start) 
  		{
  			if (x2 - x1 < 30 || y2 - y1 < 20) 
    		{
      			if (child.dom) {
        			child.dom.css({zIndex: 0});
        			me.position(child.dom, -2, -2, 0, 0);
      			}
      			continue;
    		}
			
    		// In theory we can dynamically decide whether to split in x or y based
    		// on aspect ratio.  In practice, changing split direction with this
    		// layout doesn't look very good.
    		var ysplit = ((y2 - y1) > (x2 - x1)) ? false : true;
    		// ysplit = true;

    		// Space available along layout axis.
    		if (ysplit)
      			space = (y2 - y1) * pixels_to_units;
    		else
      			space = (x2 - x1) * pixels_to_units;

    		span = me.selectSpan(tree.children, space, start);
    		end = span[0]; 
    		rsum = span[1];

    		// Now that we've selected a span, lay out rectangles [start,end) in our
    		// available space.
    		x = x1; 
    		y = y1;
    		
    		for (i = start; i < end; ++i) 
    		{
      			child = tree.children[i];
      			if (!child.dom) 
      			{
        			child.parent = tree;
        			child.dom = me.makeDom(child, level + 1);
        			tree.dom.append(child.dom);
      			} 
      			else 
      			{
        			child.dom.css({zIndex: 1});
      			}
      			size = child.data['$area'];
      			tooltip = child.name + "\n" + (child.data["$area"] || "");
      			frac = size / rsum;
      			depth = (tmax - tmin == 0) ? 0 : (size-tmin) / (tmax-tmin);
      			c = IG$/*mainapp*/._I15/*interpolateColor*/("#a7d6ef", "#153a6f", 20, depth * 20);
      			$(child.dom).css({"backgroundColor": c});
      			$(child.dom).attr("title", tooltip);
      			if (ysplit) 
      			{
        			width = rsum / space;
        			height = size / width;
      			} 
      			else 
      			{
        			height = rsum / space;
        			width = size / height;
      			}
      			width /= pixels_to_units;
      			height /= pixels_to_units;
      			width = Math.round(width);
      			height = Math.round(height);
      			
      			me.position(child.dom, x, y, width, height);
      			if ('children' in child) 
      			{
        			me.layout(child, level + 1, width, height);
      			}
      			if (ysplit)
      			{
        			y += height;
        		}
      			else
      			{
        			x += width;
        		}
    		}

    		// Shrink our available space based on the amount we used.
    		if (ysplit)
    		{
      			x1 += Math.round((rsum / space) / pixels_to_units);
      		}
    		else
    		{
      			y1 += Math.round((rsum / space) / pixels_to_units);
      		}

    		// end points one past where we ended, which is where we want to
    		// begin the next iteration, but subtract one to balance the ++ in
    		// the loop.
    		start = end - 1;
  		}
	},
	
	selectSpan: function(nodes, space, start) {
  		// Add rectangle one by one, stopping when aspect ratios begin to go
  		// bad.  Result is [start,end) covering the best run for this span.
  		// http://scholar.google.com/scholar?cluster=5972512107845615474
  		var node = nodes[start],
  			rmin = node.data['$area'],  // Smallest seen child so far.
  			rmax = rmin,                // Largest child.
  			rsum = 0,                   // Sum of children in this span.
  			last_score = 0,             // Best score yet found.
  			end, size, score;
  		for (end = start; node = nodes[end]; ++end) 
  		{
    		size = node.data['$area'];
    		if (size < rmin)
    		{
      			rmin = size;
      		}
    		if (size > rmax)
    		{
      			rmax = size;
      		}
    		rsum += size;

    		// This formula is from the paper, but you can easily prove to
    		// yourself it's taking the larger of the x/y aspect ratio or the
    		// y/x aspect ratio.  The additional magic fudge constant of 5
    		// makes us prefer wider rectangles to taller ones.
    		score = Math.max(5*space*space*rmax / (rsum*rsum),
                         1*rsum*rsum / (space*space*rmin));
    		if (last_score && score > last_score) 
    		{
      			rsum -= size;  // Undo size addition from just above.
      			break;
    		}
    		last_score = score;
  		}
  		
  		return [end, rsum];
	},
	
	
	// event processing
	focus: function (tree) {
		var me = this,
			border = me.border,
			level = 0,
			root = tree,
			sibling,
			i, width, height, t;
		
  		me.focused = tree;

  		// Hide all visible siblings of all our ancestors by lowering them.

  		while (root.parent) 
  		{
    		root = root.parent;
    		level += 1;
    		for (i = 0; sibling = root.children[i]; ++i) 
    		{
      			if (sibling.dom)
      			{
        			sibling.dom.css({zIndex: 0});
        		}
    		}
  		}
  		width = root.dom.width();
  		height = root.dom.height();
  		// Unhide (raise) and maximize us and our ancestors.
  		for (t = tree; t.parent; t = t.parent) 
  		{
    		// Shift off by border so we don't get nested borders.
    		// TODO: actually make nested borders work (need to adjust width/height).
    		me.position(t.dom, -border, -border, width, height);
    		t.dom.css({zIndex: 1});
  		}
  		// And layout into the topmost box.
  		me.layout(tree, level, width, height);
  	},
  	
  	L1/*getSVG*/: function() {
  		var me = this,
  			i,
  			curdata = me.curdata,
  			docroot = me.docroot,
  			r = [];
  		
  		r.push("<svg xmlns='http://www.w3.org/2000/svg' version='1.1'>");
  		
  		me.L1a/*makeSVG*/(curdata, r);
  		
  		r.push("</svg>");
  		
  		return r.join("");
  		
  	},
  	
  	L1a/*makeSVG*/: function(data, r) {
  		var me = this,
  			i,
  			dom = data.dom,
  			p;
  		
  		if (dom && dom.is(':visible'))
  		{
  			p = dom.position();
  			r.push("<text x='" + p.left + "' y='" + p.top + "' fill='black'>" + data.name + "</text>");
	  		r.push("<rect x='" + p.left + "' y='" + p.top + "' width='" + dom.width() + "' height='" + dom.height() + "' style='fill:" + dom.css("backgroundColor") + ";stroke-width:1;stroke:rgb(0,0,0)'/>");
	  		
	  		if (data.children)
	  		{
		  		for (i=0; i < data.children.length; i++)
		  		{
		  			me.L1a/*makeSVG*/(data.children[i], r);
		  		}
		  	}
	  	}
  	}
}
function m$B2/*bubbleElement*/(indicator, value) {
	var me = this;
	me.ind = indicator;
	me.rowdata = value;
	me.ellipses = [];
	me.label = $("<div class='bblabel'></div>");
	me.html = $("<div class='bbbox'></div>");
	
	me.ind.container.append(me.html);
	me.paper = new Raphael(me.html[0]);
	me.html.append(me.label);
	me.invalidate = -1;
	me.validateData.call(me);
	
	// IG$/*mainapp*/._I0b/*tooltip*/(me.html, "");
}

m$B2/*bubbleElement*/.prototype = {
	validateData: function() {
		var me = this,
			i,
			ellipses = me.ellipses,
			colorset = me.ind.colorset,
			rowdata = me.rowdata,
			ellipse;
		
		for (i=0; i < ellipses.length; i++)
		{
			ellipses[i].html.remove();
		}
		ellipses = [];
		
		me.label.text(rowdata.name);
		
		for (i=0; i < rowdata.value.length; i++)
		{
			ellipse = {};
			ellipse.color = colorset[i % colorset.length];
			ellipses.push(ellipse);
		}
		
		me.ellipses = ellipses;
		
		me.validateDisplay();
	},
	
	validateDisplay: function() {
		var me = this;
		if (me.invalidate > -1)
		{
			clearTimeout(me.invalidate);
		}
		setTimeout(function() {
			me.updateDisplay.call(me);
		}, 100);
	},
	
	updateDisplay: function() {
		var me = this,
			ind = me.ind,
			html = me.html,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(html),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(html),
			rowdata = me.rowdata,
			ellipses = me.ellipses,
			ellipse,
			vmax = ind.mcalc.max,
			vmin = (ind.mv == null ? ind.mcalc.min : (ind.mv > ind.mcalc.min ? ind.mv : ind.mcalc.min)),
			vgap, mradius, mwall, mvalue, tradius, tsum, i, paper,
			ex, ey, er,
			label = me.label;
		
		if (w > 0 && h > 0)
		{
			paper = me.paper;
			paper.clear();
			paper.setSize(w, h);
			
			if (ellipses && ellipses.length > 0)
			{
                mwall = Math.min(w, h);

                vgap = (vmax == vmin) ? vmax : vmax - vmin;

                for (i=0; i < ellipses.length; i++)
                {
                    tsum = (i == 0 ? rowdata.value[i] : tsum + rowdata.value[i]);
                }

                tradius = (tsum - vmin) / vgap * (mwall * .8) + mwall * .1;

                for (i=0; i < ellipses.length; i++)
                {
                    mvalue = (i == 0 ? rowdata.value[i] : mvalue + rowdata.value[i]);
                    mradius = Math.sqrt(tradius * tradius * mvalue / tsum);
                    ellipse = ellipses[i];
                    ellipse.x = w/2;
                    ellipse.y = h/2;
                    ellipse.radius = mradius/2;
                }
                
                for (i=ellipses.length - 1; i>=0; i--)
                {
                	ellipse = ellipses[i];
                	ex = ellipse.x;
                	ey = ellipse.y;
                	er = ellipse.radius;
                	hue = ellipse.color;
                	ellipse.circle = paper.set(
                		paper.ellipse(ex, ey + er - er / 5, 0, 0)
                			.attr({
                				fill: "rhsb(" + hue + ", 1, .25)-hsb(" + hue + ", 1, .25)", stroke: "none", opacity: 0
                			}).animate({rx: er, ry: er / 2}, 400, "<"),
                		paper.ellipse(ex, ey, 0, 0)
                			.attr({
                				fill: "r(.5,.9)hsb(" + hue + ", 1, .75)-hsb(" + hue + ", .5, .25)", stroke: "none"
                			}).animate({rx: er, ry: er}, 400, "<"),
                		paper.ellipse(ex, ey, 0, 0)
                			.attr({
                				stroke: "none", fill: "r(.5,.1)#ccc-#ccc", opacity: 0
                			}).animate({rx: er - er / 5, ry: er - er / 20}, 400, "<")
                	);
                }
			}
			
			me.label.css({top: (h - label.height() - 4), left: (w - IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.label)) / 2});
		}
	}
};

function m$Bl/*bubbleIndicator*/(parent) {
	this.parent = parent;
	this.mv = null;
	this.colorset = [
	    0.23, 0.4, 0.3
	];
	this.initVariables();
}

m$Bl/*bubbleIndicator*/.prototype = {
	initVariables: function() {
		var me = this;
		me.ex = [];
		me.mx = [];
		me.bubbles = [];
		me.mcalc = {};
		me.container = $("<div class='bbmain'></div>").appendTo(me.parent);
	},
	
	initControl: function() {
		var me = this,
			i,
			bubbles = me.bubbles;
		for (i=0; i < bubbles.length; i++)
		{
			bubbles[i].html.remove();
		}
		bubbles = [];
	},
	
	loadData: function(dp) {
		var me = this,
			ea = me.ea,
			ma = me.ma,
			i, j, ncol,
			dpname,
			sname, nvalue,
			value, msum,
			mcalc = me.mcalc,
			bvalue,
			be;
		
		if (dp && dp.length > 0 && ea && ea.length > 0 && ma && ma.length > 0)
		{
			// initialize
			for (i=0; i < ma.length; i++)
			{
				ma[i].max = 0;
				ma[i].min = 0;
			}
			for (i=0; i < dp.length; i++)
			{
				dpname = "col_" & i;
				sname = "";
				value = []; 
				for (j=0; j < ea.length; j++)
				{
					ncol = ea[j].i;
					sname = (j == 0 ? dp[i][ncol] : sname + " " + dp[i][ncol]);
				}
				for (j=0; j < ma.length; j++)
				{
					ncol = ma[j].i;
                    nvalue = Number(dp[i][ncol]);

                    if (i == 0)
                    {
                        ma[j].min = nvalue;
                        ma[j].max = nvalue;
                    }
                    else
                    {
                        ma[j].min = Math.min(ma[j].min, nvalue);
                        ma[j].max = Math.max(ma[j].max, nvalue);
                    }

                    msum = (j == 0 ? nvalue : msum + nvalue);

                    value.push(nvalue);
				}
				
				if (i == 0)
				{
					mcalc.min = msum;
					mcalc.max = msum;
				}
				else
				{
					mcalc.min = Math.min(mcalc.min, msum);
					mcalc.max = Math.max(mcalc.max, msum);
				}
				
				bvalue = {name: sname, value: value};
				be = new m$B2/*bubbleElement*/(me, bvalue);
				me.bubbles.push(be);
				// me..append(be.html);
			}
			
			me.validateControl();
		}
	},
	
	validateControl: function() {
		var me = this,
			parent = $(me.parent),
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(parent),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(parent),
			bubbles = me.bubbles,
			bubble,
			i, lw, lh, lx;
		
		if (w > 0 && h > 0 && bubbles && bubbles.length > 0)
		{
			lx = 0;
			lw = w / bubbles.length;
			lh = h;
			for (i=0; i < bubbles.length; i++)
			{
				bubble = bubbles[i];
				bubble.html.css({left: lx, top: 0, position: 'absolute'});
				IG$/*mainapp*/.x_10/*jqueryExtension*/._w(bubble.html, lw);
				IG$/*mainapp*/.x_10/*jqueryExtension*/._h(bubble.html, lh);
				bubble.validateDisplay.call(bubble);
				lx += lw;
			}
		}
	}
};
var gJ/*geomap*/ = function(container) {
	var me = this,
		cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container),
		ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container);
	
	me.c/*container*/ = container;
	me.d3_geo_radians = Math.PI / 180;
	
	me.lng0 = null;
	me.n = null;
	me.origin = [-98, 38];
	me.C = null;
	me.p0 = null;
	me.scale = 1000;
	me.translate = [cw/2, ch/2];
	me.parallels = [29.5, 45.5];

	this._IFd/*init_f*/();
}

gJ/*geomap*/.prototype = {
	_IFd/*init_f*/: function() {
		// initvariables
		var me = this,
			d3_geo_radians = me.d3_geo_radians,
	    	canvas = me.c/*container*/, paper, label,
	    	cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(canvas),
	    	ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(canvas);
	    
	    paper = me.paper = new Raphael(canvas[0], cw, ch);
	    me.attr = {
	    	fill: "white",
	    	stroke: "#666",
	    	"stroke-width": 0.5,
	    	"stroke-linejoin": "round"
	    };
	    
	    me.legend = $("<ul class='map-legend'></ul>").appendTo(canvas);
	},
	
	getAlbers: function(conf) {
		var me = this,
			d3_geo_radians = me.d3_geo_radians,
			phi1 = d3_geo_radians * conf.parallels[0],
	    	phi2 = d3_geo_radians * conf.parallels[1],
	    	lat0 = d3_geo_radians * conf.origin[1],
	    	s = Math.sin(phi1),
	    	c = Math.cos(phi1),
	    	r = {};
	    
	    r.lng0 = d3_geo_radians * conf.origin[0];
	    r.n = .5 * (s + Math.sin(phi2));
	    r.C = c * c + 2 * r.n * s;
	    r.p0 = Math.sqrt(r.C - 2 * r.n * Math.sin(lat0)) / r.n;
	    r.parallels = conf.parallels;
	    r.scale = conf.scale || 1;
	    r.translate = conf.translate;
	    
	    return r;
	},
	
	drawMap: function(map, config) {
		var me = this,
			i, r,
			attr = me.attr,
			paper = me.paper,
			label,
			d3_geo_radians = me.d3_geo_radians,
			g, gobj,
			container = me.c/*container*/,
			cw = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container),
			ch = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container),
			m;
		
		me.mode = config ? (config.mode || "albers") : "albers";
		if (config)
		{
			me.azmode = config.azmode || null;
			me.scale = config.scale ? config.scale : me.scale;
			me.mapdp = config.mapdp;
			me.mapseries = config.mapseries;
		}
		
		m = Math.min(cw / 480, ch / 250);
		me.scale = m * me.scale;
		
		switch (me.mode)
		{
		case "albers":
			// for albers
		    r = me.getAlbers({
		    	origin: me.origin,
		    	parallels: me.parallels,
		    	scale: 1
		    });
		    
		    me.lng0 = r.lng0;
		    me.n = r.n;
		    me.C = r.C;
		    me.p0 = r.p0;
	    	break;
	    case "azimuthal":
		    // for azimuthal
		    me.x0 = me.origin[0] * d3_geo_radians;
		    me.y0 = me.origin[1] * d3_geo_radians;
		    me.cy0 = Math.cos(me.y0);
		    me.sy0 = Math.sin(me.y0);
	    	break;
	    case "bonne":
		    // for bonne
	    	me.x0 = me.origin[0] * d3_geo_radians;
	    	me.y0 = me.origin[1] * d3_geo_radians;
	    	me.c1 = 1 / Math.tan(me.y1 = 45 * d3_geo_radians);
	    	break;
		}
		
		if (config.maptype != me.maptype)
		{
			me.paper.clear();
			me.data = {};
			
			// me.label = label = paper.set();
			me.label = label = "";
			/*
		    label.push(paper.text(60, 12, "line1").attr({
			    	font: '10px Helvetica, Arial', 
			    	fill: "#fff"
			    })
		    ).show();
		    */
		    
			me.frame = paper.popup(100, 100, label, "right").attr({fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .7}).hide();
			
			if (map.pathes)
			{
				var w = parseFloat(map.width),
					h = parseFloat(map.height),
					paper = me.paper,
					k,
					p,
					path,
					tx = 0, ty = 0;
					
				m = Math.min(cw / w, ch / h);
				tx = (cw - w * m);
				ty = (ch - h * m);
				
				for (k in map.pathes)
				{
					p = map.pathes[k];
					g = paper.set();
					path = paper.path(p.path).attr(attr);
					path.color = Raphael.getColor();
					g.push(path);
					g[0].scale(m, m, m, m);
					g[0].translate(tx, ty);
					gobj = {
						id: k,
						name: p.name || k,
						data: [],
						set: g
					};
					me.addEvent(g, gobj);
					me.data[k] = gobj;
				}
			}
			else
			{
				for (i=0; i < map.features.length; i++)
				{
					me.drawFeature(map.features[i]);
				}
			}
		}
		else
		{
			for (k in me.data)
			{
				me.data[k].set.attr(attr);
			}
		}
		
		me.maptype = config.maptype;
		
		me.Y1/*prepareLegend*/();
		me.y1/*selectedLegend*/ = 0;
		
		me.applyColor(0);
	},
	
	mouseUp: function(obj) {
		var me = this;
		
		if (me.clickHandler)
		{
			me.clickHandler.f.call(me.clickHandler.o, obj);
		}
	},
	
	Y1/*prepareLegend*/: function() {
		var me = this,
			legend = me.legend,
			mapseries = me.mapseries;
			
		legend.empty();
		me.legidx = 0;
		if (mapseries && mapseries.length > 0)
		{
			$.each(mapseries, function(i, map) 
			{
				$("<li class='map-legend-item'>" + map.name + "</li>")
					.appendTo(legend)
					.bind("click", function() {
						me.legidx = i;
						me.applyColor.call(me, i);
					});
			});
		}
	},
	
	applyColor: function(sindex) {
		var me = this,
			data = me.data,
			mapdp = me.mapdp,
			paper = me.paper,
			mapseries = me.mapseries,
			key, depth,
			tmax, tmin,
			c, series,
			d, i,
			gobj,
			label = me.label,
			mvalue,
			lbl,
			legend = me.legend,
			legenditems;
		
		/*
		for (i=label.length-1; i>0; i--)
		{
			lbl = label.pop();
			lbl.remove();
			lbl = null;
		}
		*/
		
		if (mapdp && mapseries && mapseries.length > sindex)
		{
			legenditems = legend.children("li");
			
			if (legenditems && legenditems.length > 0)
			{
				for (i=0; i < legenditems.length; i++)
				{
					$(legenditems[i]).removeClass("map-legend-selected");
					if (i == sindex)
					{
						$(legenditems[i]).addClass("map-legend-selected");
					}
				}
			}
			
			for (i=0; i < mapseries.length; i++)
			{
				/*
				label.push(
					paper.text(60, 27 + 14*i, "line" + (i+2)).attr({
				    	font: '10px Helvetica, Arial', 
				    	fill: "#fff"
			    	})
			     ).show();
			     */
			}
			series = mapseries[sindex];
			tmax = series.maxvalue;
			tmin = series.minvalue;
			
			for (key in data)
			{
				c = "#ffffff";
				d = [];
				mvalue = mapdp[key] || (data[key].name ? mapdp[data[key].name.toLowerCase()] : null);
				if (mvalue)
				{
					depth = (tmax - tmin == 0) ? 1 : ((mvalue[sindex] - tmin) / (tmax - tmin));
					c = IG$/*mainapp*/._I15/*interpolateColor*/("#ffffff", "#153a6f", 100, depth * 100);
					for (i=0; i < mapseries.length; i++)
					{
						d.push(mapseries[i].name + ": " + mvalue[i]);
					}
				}
				data[key].set.attr({fill: c});
				data[key].data = d;
			}
		}
	},
	
	albers: function(coordinates, r) {
		var me = this,
			d3_geo_radians = me.d3_geo_radians,
			scale = (r && r.scale) ? me.scale * r.scale : me.scale,
			n = (r) ? r.n : me.n,
			lng0 = (r) ? r.lng0 : me.lng0,
			C = (r) ? r.C : me.C,
			p0 = (r) ? r.p0 : me.p0;
			
			t = n * (d3_geo_radians * coordinates[0] - lng0),
	    	p = Math.sqrt(C - 2 * n * Math.sin(d3_geo_radians * coordinates[1])) / n,
	    	translate = [me.translate[0], me.translate[1]];
	    	
	    if (r && r.translate && r.translate.length == 2)
	    {
	    	var dz = 1,
		        dx = translate[0],
		        dy = translate[1];
	        
	        translate = [dx + r.translate[0] * translate[0] * dz, dy + r.translate[1] * translate[1] * dz];
	    }
	    
		return [
	  		scale * p * Math.sin(t) + translate[0],
	  		scale * (p * Math.cos(t) - p0) + translate[1]
		];
	},
	
	azimuthal: function(coordinates) {
		var me = this,
			d3_geo_radians = me.d3_geo_radians,
			x0 = me.x0,
			sy0 = me.sy0,
			cy0 = me.cy0,
			scale = me.scale,
			x1 = coordinates[0] * d3_geo_radians - x0,
	        y1 = coordinates[1] * d3_geo_radians,
	        cx1 = Math.cos(x1),
	        sx1 = Math.sin(x1),
	        cy1 = Math.cos(y1),
	        sy1 = Math.sin(y1),
	        mode = me.azmode,
	        cc = mode !== "orthographic" ? sy0 * sy1 + cy0 * cy1 * cx1 : null,
	        c,
	        k = mode === "stereographic" ? 1 / (1 + cc)
	          : mode === "gnomonic" ? 1 / cc
	          : mode === "equidistant" ? (c = Math.acos(cc), c ? c / Math.sin(c) : 0)
	          : mode === "equalarea" ? Math.sqrt(2 / (1 + cc))
	          : 1,
	        x = k * cy1 * sx1,
	        y = k * (sy0 * cy1 * cx1 - cy0 * sy1);
	    return [
	      scale * x + me.translate[0],
	      scale * y + me.translate[1]
	    ];
	},
	
	bonne: function(coordinates) {
		var me = this,
			d3_geo_radians = me.d3_geo_radians,
			x0 = me.x0,
			y0 = me.y0,
			y1 = me.y1,
			c1 = me.c1,
			scale = me.scale,
			x = coordinates[0] * d3_geo_radians - x0,
	        y = coordinates[1] * d3_geo_radians - y0;
	        
	    if (y1) 
	    {
	      var p = c1 + y1 - y, E = x * Math.cos(y) / p;
	      x = p * Math.sin(E);
	      y = p * Math.cos(E) - c1;
	    } 
	    else 
	    {
	      x *= Math.cos(y);
	      y *= -1;
	    }
	    
	    return [
	      scale * x + me.translate[0],
	      scale * y + me.translate[1]
	    ];
	},
	
	drawPolygon: function(coord, r) {
		var me = this,
			paper = me.paper,
			i,
			attr = me.attr,
			ispath = coord[0].length == 2 && typeof(coord[0][0]) == "number",
			path, paths = [], c,
			lon, lat;
		
		if (ispath == true)
		{
			paths = [];
			for (i=0; i < coord.length; i++)
			{
				c = coord[i];
				c = me[me.mode](c, r);
				lon = c[0];
				lat = c[1];
				paths.push((i == 0 ? "M" : "L") + lon + " " + lat);
			}
			paths.push("Z");
			path = paper.path(paths.join("")).attr(attr);
			path.color = Raphael.getColor();
		}
		else
		{
			for (i=0; i < coord.length; i++)
			{
				me.drawPolygon(coord[i], r);
			}
		}
	},
	
	drawGeom: function(geom, gobj) {
		var me = this,
			coordinates,
			paper = me.paper,
			g,
			paths = [],
			i,
			op = null,
			r,
			polygon = [];
		
		if (geom.parallels || geom.origin)
		{
			r = me.getAlbers({
			    	origin: geom.origin,
			    	parallels: geom.parallels,
			    	translate: geom.translate,
			    	scale: geom.scale
			    });
		}
		
		switch (geom.type)
		{
		case "Polygon":
			coordinates = geom.coordinates;
			paper.setStart();
			me.drawPolygon(coordinates, r);
			g = paper.setFinish();
			break;
		case "MultiPolygon":
			coordinates = geom.coordinates;
			paper.setStart();
			me.drawPolygon(coordinates, r);
			g = paper.setFinish();
			break;
		}
		
		if (g)
		{
			me.addEvent(g, gobj);
		}
		
		return g;
	},
	
	addEvent: function(g, gobj) {
		var me = this;
		(function(gr, gobj, owner) {
			// gr[0].style.cursor = "pointer";
			gr.mouseover(function() {
				gr.animate({stroke: "#FF0000", "stroke-width": 2}, 500);
				gr.toFront();
				owner.paper.safari();
				owner.current = gr;
			}, owner);
			
			gr.mouseup(function() {
				owner.mouseUp.call(owner, gobj);
			}, owner);
			
			gr.mouseout(function() {
				gr.animate({stroke: "#666", "stroke-width": 0.5}, 500);
				gr.toFront();
				owner.paper.safari();
			}, owner);
			
			gr.hover(function(event) {
				var offset = me.c/*container*/.offset(),
					x = event.pageX - offset.left,
					y = event.pageY - offset.top - 10,
					i,
					label = me.label,
					frame = me.frame,
					paper = me.paper,
					side = "up",
					ppp = null,
					lx, ly,
					anim;
				
				clearTimeout(me.leave_timer);
				
				label = gobj.name + "\n";
				for (i=0; i < gobj.data.length; i++)
				{
					label += gobj.data[i] + "\n";
				}
				
				if (me.ppp)
				{
					me.ppp.remove();
				}
				
				me.ppp = owner.paper.popup(x, y, label, side);
				/*
				anim = Raphael.animation({
					path: ppp.path,
					transform: ["t", ppp.dx, ppp.dy]
				}, 200);
				
				lx = label[0].transform()[0][1] + ppp.dx;
                ly = label[0].transform()[0][2] + ppp.dy;
				
				label[0].attr({text: gobj.name}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200);

				for (i=0; i < label.length-1; i++)
				{
                	label[i+1].attr({text: (gobj.data.length > i ? gobj.data[i] : "-")}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200);
                }
				
				frame.show().stop().animate(anim);
				
				frame.toFront();
			    label[0].toFront();
			    for (i=0; i < gobj.data.length; i++)
			    {
			    	label[i+1].toFront();
			    }
			    
			    me.leave_timer = setTimeout(function () {
			    	var i;
                    frame.hide();
                    for (i=0; i < label.length; i++)
                    {
                    	label[i].hide();
                    }
                }, 3000);
                */
			});
		})(g, gobj, me);
	},
	
	drawFeature: function(feature) {
		var me = this,
			g, gobj;
		switch (feature.type)
		{
		case "Feature":
			gobj = {
				id: (feature.usps || feature.id).toLowerCase(),
				value: (feature.usps || feature.id),
				name: feature.properties.name || feature.usps || feature.id,
				data: []
			};
			g = me.drawGeom(feature.geometry, gobj);
			gobj.set = g;
			me.data[gobj.id] = gobj;
			break;
		default:
			// other
			break;
		}
	}
};
IG$/*mainapp*/.c$s20/*ComparisonItem*/ = function()
{
	/**
	 * One attribute of the data set captured by this ComparisonItem.
	 */
	this.p1/*xField*/ = null;
	this.p1n/*xFieldName*/ = null;
	
	/**
	 * The other attribute of the data set captured by this ComparisonItem.
	 */
	this.p2/*yField*/ = null;
	this.p2n/*yFieldName*/ = null;
	
	/**
	 * The numerical relationship between the xField and the yField. When used in the
	 * default implementation of the ComparisonMatrix, this value is the correlation
	 * coefficent.
	 */
	this.p3/*comparisonValue*/;
	
	/**
	 * The dataProvider of the ComparisonMatrix that created this ComparisonItem.
	 */
	this.m1$5/*dataProvider*/ = null;
	
	this.toString = function()
	{
		return this.p1n/*xFieldName*/ + ", " + this.p2n/*yFieldName*/ + " : " + this.p3/*comparisonValue*/;
	}
}

IG$/*mainapp*/.c$s21/*ComparisionMatrixPlotCell*/ = function()
{
	var i,
		o,
		browser = window.bowser,
		hasSVG = (window && window.SVGAngle) || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
		
	this.hasCanvas = (!hasSVG && !browser.msie) ? true : false;
	
	this.p4/*comparisonItem*/;
	this.p5/*xMin*/;
	this.p6/*xMax*/;
	this.p7/*yMin*/;
	this.p8/*yMax*/;
	this.p9/*xRange*/;
	this.a1/*yRange*/;
	
	this.cr1 = 0;
	this.cr2 = 0;
	
	this.selected;
	
	this.width;
	this.height;
	
	this.html = $('<div class="matrixchart"></div>');
	
	if (this.hasCanvas == true)
	{
		this.canvas = $('<canvas></canvas>');
		this.canvas.appendTo(this.html);
	}
	
	this.ux/*updateExtremes*/ = function()
	{
		if(this.p4/*comparisonItem*/ && this.p4/*comparisonItem*/.m1$5/*dataProvider*/)
		{
			this.p5/*xMin*/ = Number.MAX_VALUE;
			this.p7/*yMin*/ = Number.MAX_VALUE;
			this.p6/*xMax*/ = Number.MIN_VALUE;
			this.p8/*yMax*/ = Number.MIN_VALUE;
			for (i=0; i < this.p4/*comparisonItem*/.m1$5/*dataProvider*/.length; i++)
			{
				o = this.p4/*comparisonItem*/.m1$5/*dataProvider*/[i];
				
				this.p5/*xMin*/ = Math.min(this.p5/*xMin*/,o[this.p4/*comparisonItem*/.p1/*xField*/]);
				this.p7/*yMin*/ = Math.min(this.p7/*yMin*/,o[this.p4/*comparisonItem*/.p2/*yField*/]);
				this.p6/*xMax*/ = Math.max(this.p6/*xMax*/,o[this.p4/*comparisonItem*/.p1/*xField*/]);
				this.p8/*yMax*/ = Math.max(this.p8/*yMax*/,o[this.p4/*comparisonItem*/.p2/*yField*/]);
			}
			this.p9/*xRange*/ = this.p6/*xMax*/ - this.p5/*xMin*/;
			this.a1/*yRange*/ = this.p8/*yMax*/ - this.p7/*yMin*/;
		}
	}
	
	this.c1/*computeX*/ = function(o) {
		var xFieldValue = o[this.p4/*comparisonItem*/.p1/*xField*/],
			xPercent = 1 - (this.p6/*xMax*/ - xFieldValue) / this.p9/*xRange*/;
		return xPercent;
	}
	
	this.c2/*computeY*/ = function(o) {
		var yFieldValue = o[this.p4/*comparisonItem*/.p2/*yField*/],
			yPercent = 1 - (this.p8/*yMax*/ - yFieldValue) / this.a1/*yRange*/;
		return yPercent;
	}
	
	this.c3/*updatePlot*/ = function() {
		var i,
			o,
			plotPointX,
			plotPointY;
		
		this.pd/*plotData*/ = [];
		
		for (i=0; i < this.p4/*comparisonItem*/.m1$5/*dataProvider*/.length; i++)
		{
			o = this.p4/*comparisonItem*/.m1$5/*dataProvider*/[i];
			plotPointX = this.c1/*computeX*/(o);
			plotPointY = this.c2/*computeY*/(o);

			this.pd/*plotData*/.push([plotPointX, plotPointY]);
		}
		
		this.d4/*drawPlot*/();
	}
	
	this.d4/*drawPlot*/ = function() {
		this.width = this.html.innerWidth();
		this.height = this.html.innerHeight();
		
		var gap = 3,
			color,
			dcache = {};
			
		color = this.p4/*comparisonItem*/.p3/*comparisonValue*/ > this.cr2 ? "rgba(0,0,255," : 
				this.p4/*comparisonItem*/.p3/*comparisonValue*/ > this.cr1 ? "rgba(150,150,150," :
				"rgba(255,0,0,";
		
		if (this.hasCanvas == true)
		{
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			
			this.ctx = this.canvas[0].getContext('2d');
			this.ctx.scale(1, 1);
			this.ctx.fillStyle = "rgb(255,255,255)";
			this.ctx.fillRect (0, 0, this.width, this.height);
			this.ctx.strokeStyle = "#5F5F5F";
			this.ctx.lineWidth = 1;
			
			this.ctx.fillStyle = color + '.5)';
		}
		else
		{
			if (!this.paper)
			{
				this.paper = Raphael(this.html[0], 0, 0, this.width, this.height);
			}
			else
			{
				this.paper.clear();
			}
		}
		
		for (i=0; i < this.pd/*plotData*/.length; i++)
		{
			var o = this.pd/*plotData*/[i],
				cx = (isNaN(o[0]) == false ? o[0] * this.width : 0),
				cy = (isNaN(o[1]) == false ? (1-o[1]) * this.height : this.height),
				tx = Math.floor(cx),
				ty = Math.floor(cy),
				key,
				radius = 2;
			
			tx = tx - tx % 5;
			ty = ty - ty % 5;
			
			key = '' + tx + ',' + ty;
			
			if (!dcache[key])
			{
				if (this.hasCanvas == true)
				{
					this.ctx.beginPath();
					this.ctx.arc(cx, cy, 1, 0, Math.PI*2, true);
					this.ctx.closePath();
					this.ctx.fill();
					dcache[key] = {obj: true, mbody: 0};
				}
				else
				{
					dcache[key] = {obj: this.paper.circle(cx, cy, radius), mbody: 0};
					dcache[key].obj.attr("fill", color + '0.5)');
				}
			}
		}
		
		dcache = null;
	}
	
	this.c9/*updateDisplayList*/ = function(w, h) {
		this.d4/*drawPlot*/();
	}

	this.m1$1/*commitProperties*/ = function() {
		this.ux/*updateExtremes*/();
		this.c3/*updatePlot*/();
	}
}

IG$/*mainapp*/.c$s22/*ComparisionMatrix*/ = function(parent, config)
{
	this.ci/*_comparisonItems*/ = null;
	this.cells = [];
	this.parent = parent;
	this.config = config;
	this.textFields = [];
	this.showLabels = config.showLabels || true;
	
	this.cr1 = (config.cr1 == null || typeof config.cr1 == 'undefined') ? 0 : config.cr1;
	this.cr2 = (config.cr2 == null || typeof config.cr2 == 'undefined') ? 0 : config.cr2;
	
	this.container = $('<div class="matrixcontainer"></div>');
	this.container.appendTo(this.parent);
	
	this.labelhtml = $('<div class="matrixlabel"></div>');
	this.labelhtml.css({position: 'absolute', top: '0px', left: '0px', width: '0px', height: '0px'});
	this.labelhtml.appendTo(this.parent);
	this.idd/*isDirtyData*/ = false;
	
	this.detailviewer = $('<div class="detailviewer"></div>');
	this.detailviewer.css({
			position: 'absolute',
			top: 10,
			left: 10,
			width: 100,
			height: 100,
			margin: 0,
			padding: 0,
			backgroundColor: '#ececec',
			borderColor: '#222222',
			display: 'none'
		}
	);
	this.detailviewer.appendTo(this.parent);
	this.detailviewer.bind('click', function() {
		$(this).fadeOut();
	});
	
	this.m1$2/*detailcontainer*/ = $('<div class="detailmatrixplot"></div>');
	this.m1$2/*detailcontainer*/.css({
			position: 'absolute',
			margin: '20 0 0 0',
			padding: 0,
			top: 0, left: 0, right: 0, bottom: 0
		}
	);
	
	this.uid = 0;
	
	this.m1$2/*detailcontainer*/.appendTo(this.detailviewer);
	
	var closebtn = $('<div class="detailmatrixclosebtn"></div>'),
		detailviewer = this.detailviewer;
	closebtn.css({
		position: 'absolute',
		top: 2, width: 16, height: 16, right: 2
	});
	this.detailviewer.append(closebtn);
	closebtn.bind({
		click: function() {
			detailviewer.fadeOut();
		}
	});
	
    /**
     * Evaluates the correlation coefficent between the xField and yField properties
     * on the Objects in the collection.
     */
    this.c1/*correlationCoefficent*/ = function(collection, p1/*xField*/, p2/*yField*/)
    {
        var len = collection.length,
        	xTotal = 0,
        	yTotal = 0,
        	xSquaredTotal = 0,
        	ySquaredTotal = 0,
        	xYTotal = 0,
        	o,
        	i;
        	
        for (i=0; i < collection.length; i++)
        {
        	o = collection[i];
            var xValue = o[p1/*xField*/];
            var yValue = o[p2/*yField*/];
            xTotal += xValue;
            yTotal += yValue;
            xSquaredTotal += Math.pow(xValue,2);
            ySquaredTotal += Math.pow(yValue,2);
            xYTotal += xValue * yValue;
        }
        var top = (len * xYTotal) - (xTotal * yTotal);
        var bottomLeft = Math.sqrt( (len * xSquaredTotal) - Math.pow(xTotal,2) );
        var bottomRight = Math.sqrt( (len * ySquaredTotal) - Math.pow(yTotal,2) );
        return top/(bottomLeft * bottomRight);
    }
	
	this.c2/*comparisonFunction*/ = this.c1/*correlationCoefficent*/;

    /**
     * Evaluate the relationship between each pair of attributes in the fields Array
     * using the comparisonFunction. 
     */
    this.c3/*generateComparisonStatistics*/ = function()
    {
        this.ci/*_comparisonItems*/ = [];
        
        if(this.fields.length == 0 || this.m1$5/*dataProvider*/ == null || this.m1$5/*dataProvider*/.length == 0)
            return;
        
        var len = this.fields.length;
        var index = 0;
        for (var a = 0; a < len; a++)
        {
            for (var b = 0; b < a + 1;  b++)
            {
                if(a != b)
                {
                    var item = new IG$/*mainapp*/.c$s20/*ComparisonItem*/();
                    item.p1n/*xFieldName*/ = this.fields[a];
                    item.p1/*xField*/ = a;
                    item.p2n/*yFieldName*/ = this.fields[b];
                    item.p2/*yField*/ = b;
                    item.p3/*comparisonValue*/ = this.c2/*comparisonFunction*/.call(this, this.m1$5/*dataProvider*/, item.p1/*xField*/, item.p2/*yField*/);
                    this.ci/*_comparisonItems*/.push(item);
                    index++;
                }
            }
        }
    }
    
    this.c4/*createOrRemoveCells*/ = function() {
    	var me = this,
    		len = this.ci/*_comparisonItems*/.length, cid;
    	
    	this.m1$3/*matrixitems*/ = {};
    	
		while(this.cells.length < len)
		{
			var cellToAdd = new IG$/*mainapp*/.c$s21/*ComparisionMatrixPlotCell*/();
			cellToAdd.html.css({border: '1px solid #a5a5a5', width: 200, height: 200, position: 'absolute', padding: 0});
			// cellToAdd.addEventListener(MouseEvent.CLICK, handleCellClick, false, 0, true);
			cellToAdd.html.appendTo(this.container);
			cid = 'matrixplot' + this.uid;
			cellToAdd.html[0].id = cid
			this.uid++;
			
			cellToAdd.html.bind({
				click: function() {
					me.m1$6/*drawDetailPlot*/.call(me, this);
				}
			});
			this.cells.push(cellToAdd);
			this.m1$3/*matrixitems*/[cid] = cellToAdd;
		}
		
		while(len < this.cells.length)
		{
			var cellToRemove = this.cells.pop();
			cellToRemove.remove();
		}
    }
    
    this.c5/*updateTextFields*/ = function() {
    	var len = this.fields.length,
    		a,
    		textField,
    		textFieldToAdd;
    	
		for(a = 0; a < len; a++)
		{
			if(this.textFields.length < a + 1)
			{
				textFieldToAdd = $('<div class="matrixtextfield"></div>');
				textFieldToAdd.css({fontSize: '0.8em', padding: '0 0 0 3', margin: 0, position: 'absolute', width: 130});
				this.textFields.push(textFieldToAdd);
				textFieldToAdd.appendTo(this.labelhtml);
			}
			textField = this.textFields[a];
			textField[0].innerText = this.fields[a];
			
			// var metrics:TextLineMetrics = textField.getLineMetrics(0);
			// textField.width = metrics.width + 4;
			// textField.height = metrics.height + 2;
		}
		while(len < this.textFields.length)
		{
			var textFieldToRemove = textFields.pop();
			this.textFieldToRemove.remove();
		}
    }
    
    /**
	 * Position the textFields along the edges of the matrix.
	 */
	this.c6/*layoutTextFields*/ = function() {
		var len = this.textFields.length,
			firstTextField,
			startY,
			a,
			textField,
			px,
			py;
		if(len > 0)
		{
			firstTextField = this.textFields[0];
			startY = firstTextField.height();
			
			for(a = 0; a < len; a++)
			{
				textField = this.textFields[a];
				px = a * this.m1$4/*actualCellSize*/ + 1;
				if(a == 0)
				{
					py = 0;
				}
				else
				{
					py = (a - 1) * this.m1$4/*actualCellSize*/ + startY;
				}
				textField.css({left: px, top: py}); 
				// textField.visible = true;
				
			}
		}
	}

    /**
     * Arrange the cells in a stair-step fashion.
     */
    this.c7/*layoutCells*/ = function()
    {
        var startY = 0;
        if(this.showLabels && this.textFields.length > 0)
        {
            var firstTextField = this.textFields[0];
            startY = firstTextField.position().top + firstTextField.height();
        }
        
        var len = this.fields.length;
        var index = 0;
        for(var a = 0; a < len; a++)
        {
            for(var b = 0; b < a + 1;  b++)
            {
                if(a != b)
                {
                    var item = this.ci/*_comparisonItems*/[index];
                    
                    var cell = this.cells[index];
                    item.m1$5/*dataProvider*/ = this.m1$5/*dataProvider*/;
                    cell.p4/*comparisonItem*/ = item;
                    cell.selected = (item == this.selectedItem);
                    
                    // toolTip isn't a part of IUIComponent, interesting, eh?
                    var tt = "";
                    tt = item.p1/*xField*/ + "\n" + item.p2/*yField*/ + "\n" + item.p3/*comparisonValue*/;
                    cell.toolTip = tt;
                    
                    var cellX = b * this.m1$4/*actualCellSize*/;
                    var cellY = (a - 1) * this.m1$4/*actualCellSize*/ + startY;
                    cell.html.css({left: cellX, top: cellY, width: this.m1$4/*actualCellSize*/, height: this.m1$4/*actualCellSize*/});
                    
                    cell.cr1 = this.cr1;
                    cell.cr2 = this.cr2;
                    
                    if (this.idd/*isDirtyData*/ == true)
                    {
                    	cell.m1$1/*commitProperties*/.call(cell);
                    }
                    else
                    {
                    	cell.c9/*updateDisplayList*/.call(cell);
                    }
                    
                    index++;
                }
            }
        }
    }
     
    this.c8/*computeCellSize*/ = function(width, height)
	{
		var availableWidthForCells = width;
		var availableHeightForCells = height;
		
		if(this.showLabels == true && this.textFields.length > 0)
		{
			availableWidthForCells = width - this.textFields[this.textFields.length - 1].width();
			availableHeightForCells = height - this.textFields[0].height();
		}
		else
		{
			availableWidthForCells = width;
			availableHeightForCells = height;
		}
		var measuredCellSize = Math.min(availableWidthForCells,availableHeightForCells) / (this.fields.length - 1);
		return measuredCellSize;
	}
    
    this.c9/*updateDisplayList*/ = function() {
    	var p = $(this.parent);
    	var w = p.innerWidth(),
    		h = p.innerHeight();
    		
    	this.container.css({width: w, height: h});
    	
    	this.m1$4/*actualCellSize*/ = this.c8/*computeCellSize*/(w, h);
    	if (this.showLabels && this.textFields.length > 0)
    	{
    		this.c6/*layoutTextFields*/();
    	}
    	this.c7/*layoutCells*/();
    }
    
    this.c10/*commitProperty*/ = function() {
    	this.idd/*isDirtyData*/ = true;
    	this.c3/*generateComparisonStatistics*/();
    	this.c4/*createOrRemoveCells*/();
    	this.c5/*updateTextFields*/();
    	this.c9/*updateDisplayList*/();
    	this.idd/*isDirtyData*/ = false;
	}    
}

IG$/*mainapp*/.c$s22/*ComparisionMatrix*/.prototype.m1$6/*drawDetailPlot*/ = function(matrixowner) {
	var matrix = this.m1$3/*matrixitems*/[matrixowner.id],
		color = matrix.p4/*comparisonItem*/.p3/*comparisonValue*/ > this.cr2 ? "rgba(0,0,255,.5)" : 
				matrix.p4/*comparisonItem*/.p3/*comparisonValue*/ > this.cr1 ? "rgba(150,150,150,.5)" :
				"rgba(255,0,0,0.5)";
	
	if (matrix)
	{
		var plotoption = {
			chart: {
			 	renderTo: this.m1$2/*detailcontainer*/[0], 
			 	defaultSeriesType: 'scatter',
			 	zoomType: 'xy'
			},
			title: {
			 	text: matrix.p4/*comparisonItem*/.p1n/*xFieldName*/ + " vs. " + matrix.p4/*comparisonItem*/.p2n/*yFieldName*/
			},
			xAxis: {
			 	title: {
			    	enabled: true,
			    	text: matrix.p4/*comparisonItem*/.p1n/*xFieldName*/
			 	},
			 	startOnTick: true,
			 	endOnTick: true,
			 	showLastLabel: true,
			 	min: 0,
			 	max: 1
			},
			yAxis: {
			 	title: {
			    	text: matrix.p4/*comparisonItem*/.p2n/*yFieldName*/
			 	},
			 	min: 0,
			 	max: 1
			},
			tooltip: {
			 	formatter: function() {
			           return ''+
			       this.x +', '+ this.y +'';
			 	}
			},
			legend: {
				enabled: false,
			 	"layout": 'vertical',
			 	align: 'left',
			 	verticalAlign: 'top',
			 	floating: true,
			 	backgroundColor: '#FFFFFF',
			 	borderWidth: 1
			},
			plotOptions: {
				scatter: {
					marker: {
				   		radius: 5,
				   		states: {
				      		hover: {
				         		enabled: true,
				         		lineColor: 'rgb(100,100,100)'
				      		}
				   		}
					},
					states: {
				   		hover: {
				      		marker: {
				         		enabled: false
				      		}
				   		}
					}
				}
			},
			
			series: [{
	         	name: 'comparison',
	         	color: color,
	         	data: matrix.pd/*plotData*/
	        }]
		}
	
		// this.detailviewer.css({width: 400, height: 300});
		var parent = $(this.parent),
			pw = parent.width(),
			ph = parent.height(),
			vs = Math.min(ph, pw) * 0.85;
			
		this.detailviewer.css({left: (pw - vs - 10), top: 5, width: vs, height: vs});
		this.detailviewer.show();
		this.plotdetail = new Highcharts.Chart(plotoption);
	}
}
/*
// sample dataset

[
	{
		"name":"Angola","region":"Sub-Saharan Africa",
		"bbdata1":
			[
				[1800,359.93],
				[1820,359.93],
				[1913,556.12],
				[1950,3363.02],
				[1951,3440.9],
				[1952,3520.61]
			],
		"bbdata2":
			[
				[1820,2689000],
				[1870,3776000],
				[1913,5497000],
				[1950,8892718],
				[1951,9073304],
				[1952,9279525]
			],
		"bbdata3":
			[
				[1800,28.8],
				[1923,28.82],
				[1933,31.22],
				[1941,33.72],
				[1943,33.72]
			]
	}
]
*/

/*

// necessary style definition

#chart {
  margin-left: -40px;
  height: 506px;
}

text {
  font: 10px sans-serif;
}

.d3-nation-dot {
  stroke: #000;
}

.d3-nation-axis path, .d3-nation-axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.d3-nation-label {
  fill: #777;
}

.d3-nation-year.d3-nation-label {
  font: 500 196px "Helvetica Neue";
  fill: #ddd;
}

.d3-nation-year.d3-nation-label.d3-nation-active {
  fill: #aaa;
}

.d3-nation-overlay {
  fill: none;
  pointer-events: all;
  cursor: ew-resize;
}
*/

IG$/*mainapp*/.qiNul/*NationChart*/ = function(owner, _ILb/*sheetoption*/, cop) {
	this.owner = owner;
	this._ILb/*sheetoption*/ = _ILb/*sheetoption*/;
	this.cop = cop;
	this.i1/*Initialize*/();
}

IG$/*mainapp*/.qiNul/*NationChart*/.prototype = {
	i1/*Initialize*/: function() {
		var me = this,
			owner = me.owner,
			vctrl = $("<div></div>").appendTo(owner),
			tp;
		
		me.margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5};
		me.width = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(owner);
		me.height = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(owner);
	},
	
	i2/*loadData*/: function(mresult) {
		var me = this,
			owner = me.owner,
			width = me.width,
			height = me.height,
			margin = me.margin,
			vparent = $("<div><div>").appendTo(me.owner),
			chart = me.bb,
			data = mresult.data,
			fc = mresult.colfix,
			fr = mresult.rowfix,
			tc = (data.length > 0) ? data[0].length : 0,
			dt = [], dtmap = {}, key,
			dobj,
			i, j, 
			ctag = fc - 1,
			ccol = (ctag-1 > -1) ? ctag - 1 : ctag,
			cseg = (ccol-1 > -1) ? ccol - 1 : ccol,
			f1 = fc,
			f2 = (tc > fc+1) ? fc+1 : f1,
			f3 = (tc > f1+1) ? f1+1 : f1,
			dnation,
			segnames = {}, segindex, segname, segcnt=0, stemp,
			seglists = [], fs=[{m:0, M:0},{m:0, M:0},{m:0, M:0}],
			tvalue;
			
		stemp = me.m1/*findColumns*/(me.cop.nat_timefield, fc);
		cseg = (stemp > -1) ? stemp : cseg;
		
		stemp = me.m1/*findColumns*/(me.cop.nat_datafield, fc);
		ctag = (stemp > -1) ? stemp : ctag;
		
		stemp = me.m1/*findColumns*/(me.cop.nat_groupfield, fc);
		ccol = (stemp > -1) ? stemp : ccol;
		
		stemp = me.m1/*findColumns*/(me.cop.nat_xdata, fc);
		f1 = (stemp > -1) ? stemp : f1;
		
		stemp = me.m1/*findColumns*/(me.cop.nat_ydata, fc);
		f2 = (stemp > -1) ? stemp : f2;
		
		stemp = me.m1/*findColumns*/(me.cop.nat_vdata, fc);
		f3 = (stemp > -1) ? stemp : f3;
		
		if (fc > 0)
		{
			for (i=fr; i < data.length; i++)
			{
				segname = data[i][cseg].code || "";
				if (!segnames[segname])
				{
					seglists.push(segname);
					segnames[segname] = 1;
				}
			}
			
			segcnt = seglists.length;
			seglists = seglists.sort();
			segnames = {};
			for (i=0; i < seglists.length; i++)
			{
				segnames[seglists[i]] = i;
			}
			
			for (i=fr; i < data.length; i++)
			{
				key = data[i][ctag].code;
				if (dtmap[key])
				{
					dnation = dtmap[key];
				}
				else
				{
					dnation = {
						name: data[i][ctag].code,
						region: data[i][ccol].code,
						bbdata1: [],
						bbdata2: [],
						bbdata3: []
					}
					for (j=0; j < seglists.length; j++)
					{
						dnation.bbdata1.push([j, 0]);
						dnation.bbdata2.push([j, 0]);
						dnation.bbdata3.push([j, 0]);
					}
					dtmap[key] = dnation;
					dt.push(dnation);
				}
				
				segname = data[i][cseg].code || "";
				segindex = -1;
				if (typeof (segnames[segname]) != "undefined")
				{
					segindex = segnames[segname];
				}
				
				tvalue = Number(data[i][f1].code) || 0;
				tvalue = isNaN(tvalue) ? 0 : tvalue;
				dnation.bbdata1[segindex][1] = tvalue;
				
				fs[0].m = Math.min(tvalue, fs[0].m);
				fs[0].M = Math.max(tvalue, fs[0].M);
				
				tvalue = Number(data[i][f2].code) || 0;
				tvalue = isNaN(tvalue) ? 0 : tvalue;
				dnation.bbdata2[segindex][1] = tvalue;
				
				fs[1].m = Math.min(tvalue, fs[1].m);
				fs[1].M = Math.max(tvalue, fs[1].M);
				
				tvalue = Number(data[i][f3].code) || 0;
				tvalue = isNaN(tvalue) ? 0 : tvalue;
				dnation.bbdata3[segindex][1] = tvalue;
				
				fs[2].m = Math.min(tvalue, fs[2].m);
				fs[2].M = Math.max(tvalue, fs[2].M);
			}
		}
		
		if (fs)
		{
			for (i=0; i < fs.length; i++)
			{
				if (fs[i].m == fs[i].M)
				{
					fs[i].M = fs[i].m + 10;
				}
			}
		}
		me.segnames = segnames;
		me.seglists = seglists;
		me.segmax = segcnt;
		me.fs = fs;
		me.dt = dt;
		me.i3/*drawChart*/();
	},
	
	i3/*drawChart*/: function() {
		var me = this,
			owner = me.owner,
			vparent,
			nations = me.dt,
			fs = me.fs;
		
		me.owner.empty();
		vparent = $("<div><div>").appendTo(me.owner);
		
		// Various accessors that specify the four dimensions of data to visualize.
		function x(d) { 
			return d.bbdata1; 
		}
		function y(d) { 
			return d.bbdata2; 
		}
		function radius(d) { 
			return d.bbdata3; 
		}
		function color(d) { 
			return d.region; 
		}
		function key(d) { 
			return d.name; 
		}
		
		// Chart dimensions.
		var margin = me.margin,
		    width = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.owner) - margin.right - margin.left,
		    height = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.owner) - margin.top - margin.bottom;
		
		// Various scales. These domains make assumptions of data, naturally.
		var xScale = d3.scale.linear().domain([fs[0].m, fs[0].M]).range([0, width]),
		    yScale = d3.scale.linear().domain([fs[1].m, fs[1].M]).range([height, 0]),
		    radiusScale = d3.scale.sqrt().domain([fs[2].m, fs[2].M]).range([0, 40]),
		    colorScale = d3.scale.category10();
		
		// The x & y axes.
		var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")),
		    yAxis = d3.svg.axis().scale(yScale).orient("left");
		
		// Create the SVG container and set the origin.
		var svg;
		
		svg = this.vis = d3.select(vparent[0]).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// Add the x-axis.
		svg.append("g")
		    .attr("class", "d3-nation-x d3-nation-axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis);
		
		// Add the y-axis.
		svg.append("g")
		    .attr("class", "d3-nation-y d3-nation-axis")
		    .call(yAxis);
		
		// Add an x-axis label.
		svg.append("text")
		    .attr("class", "d3-nation-x d3-nation-label")
		    .attr("text-anchor", "end")
		    .attr("x", width)
		    .attr("y", height - 6);
		    // .text("income per capita, inflation-adjusted (dollars)");
		
		// Add a y-axis label.
		svg.append("text")
		    .attr("class", "d3-nation-y d3-nation-label")
		    .attr("text-anchor", "end")
		    .attr("y", 6)
		    .attr("dy", ".75em")
		    .attr("transform", "rotate(-90)");
		    // .text("life expectancy (years)");
		
		// Add the year label; the value is set on transition.
		var label = svg.append("text")
		    .attr("class", "d3-nation-year d3-nation-label")
		    .attr("text-anchor", "end")
		    .attr("y", height - 24)
		    .attr("x", width);
		
		// Load the data.
		//d3.json("nations.json", function(nations) {
		
		  // A bisector since many nation's data is sparsely-defined.
		  var bisect = d3.bisector(function(d) { return d[0]; });
		
		  // Add a dot per nation. Initialize the data at 1800, and set the colors.
		  var dotlabel, dot, dotgr = svg.append("g")
		      .attr("class", "d3-nation-dots")
		    .selectAll(".dot")
		      .data(interpolateData(0))
		    .enter();
		  
		  dot = dotgr.append("circle")
		      .attr("class", "d3-nation-dot")
		      .style("fill", function(d) { return colorScale(color(d)); })
		      .call(position)
		      .sort(order);
		
		  // Add a title.
		  dot.append("title")
		      .text(function(d) { 
		    	  return d.name; 
		      });
		  
		  dotlabel = dotgr.append("text")
		  	.text(function(d) {
		  		return d.name;
		  	})
		  	.call(labelposition);
		
		  // Start a transition that interpolates the data based on year.
		  svg.transition()
		      .duration(800 * me.segmax)
		      .ease("linear")
		      .tween("year", tweenYear)
		      .each("end", enableInteraction);
		
		  // Positions the dots based on data.
		  function position(dot) {
		    dot .attr("cx", function(d) { 
		    		var cx = xScale(x(d));
		    		cx = (cx < 0 ? 0 : cx);
		    		return cx; 
		    	})
		        .attr("cy", function(d) { 
		        	var cy = yScale(y(d));
		        	cy = (cy < 0 ? 0 : cy);
		        	return cy; 
		        })
		        .attr("r", function(d) { 
		        	var r = radiusScale(radius(d));
		        	r = (r < 0 ? 0 : r);
		        	return r; 
		        });
		  }
		  
		  function labelposition(dot) {
			dot.attr("x", function(d) { 
		    		var r, 
		    			cx = xScale(x(d));
		    		cx = (cx < 0 ? 0 : cx);
		    		r = radiusScale(radius(d));
		        	r = (r < 0 ? 0 : r);
		    		return cx - r; 
		    	})
		        .attr("y", function(d) { 
		        	var cy = yScale(y(d));
		        	cy = (cy < 0 ? 0 : cy);
		        	return cy; 
		        })
		  }
		
		  // Defines a sort order so that the smallest dots are drawn on top.
		  function order(a, b) {
		    return radius(b) - radius(a);
		  }
		
		  // After the transition finishes, you can mouseover to change the year.
		  function enableInteraction() {
		    var box = label.node().getBBox();
		
		    var yearScale = d3.scale.linear()
		        .domain([0, me.segmax])
		        .range([box.x + 10, box.x + box.width - 10])
		        .clamp(true);
		
		    svg.append("rect")
		        .attr("class", "d3-nation-overlay")
		        .attr("x", box.x)
		        .attr("y", box.y)
		        .attr("width", box.width)
		        .attr("height", box.height)
		        .on("mouseover", mouseover)
		        .on("mouseout", mouseout)
		        .on("mousemove", mousemove)
		        .on("touchmove", mousemove);
		
		    
		    function mouseover() {
		    	label.classed("active", true);
		    }
		
		    function mouseout() {
		    	label.classed("active", false);
		    }
		
		    function mousemove() {
		      displayYear(yearScale.invert(d3.mouse(this)[0]));
		    }
		  }
		
		  // Tweens the entire chart by first tweening the year, and then the data.
		  // For the interpolated data, the dots and label are redrawn.
		  function tweenYear() {
		    var year = d3.interpolateNumber(0, me.segmax-1);
		    return function(t) { displayYear(year(t)); };
		  }
		
		  // Updates the display to show the specified year.
		  function displayYear(year) {
		    dot.data(interpolateData(year), key).call(position).sort(order);
		    dotlabel.data(interpolateData(year), key).call(labelposition).sort(order);
		    label.text(me.seglists[Math.floor(year)]);
		  }
		
		  // Interpolates the dataset for the given (fractional) year.
		  function interpolateData(year) {
		    return nations.map(function(d) {
		      return {
		        name: d.name,
		        region: d.region,
		        bbdata1: interpolateValues(d.bbdata1, year),
		        bbdata2: interpolateValues(d.bbdata2, year),
		        bbdata3: interpolateValues(d.bbdata3, year)
		      };
		    });
		  }
		
		  // Finds (and possibly interpolates) the value for the specified year.
		  function interpolateValues(values, year) {
		    var i = bisect.left(values, year, 0, values.length - 1),
		        a = values[i];
		    if (i > 0) {
		      var b = values[i - 1],
		          t = (year - a[0]) / (b[0] - a[0]);
		      return a[1] * (1 - t) + b[1] * t;
		    }
		    return a[1];
		  }
		// });
	},
	
	m1/*findColumns*/: function(colname, fc) {
		var i,
			me = this,
			_ILb/*sheetoption*/ = me._ILb/*sheetoption*/,
			spcol = -1;
			
		for (i=0; i < _ILb/*sheetoption*/.rows.length; i++)
		{
			if (_ILb/*sheetoption*/.rows[i].name == colname)
			{
				spcol = i;
				break;
			}
		}
		
		if (spcol == -1 && _ILb/*sheetoption*/.measures.length > 0)
		{
			for (i=0; i < _ILb/*sheetoption*/.measures.length; i++)
			{
				if (_ILb/*sheetoption*/.measures[i].name == colname)
				{
					spcol = i + fc;
					break;
				}
			}
		}
		
		return spcol;
	}
}
IG$/*mainapp*/._ICa/*BulletChart*/ = function(owner) {
	this.owner = owner;
	this.bb = null;
	
	this.i1/*Initialize*/();
};

IG$/*mainapp*/._ICa/*BulletChart*/.prototype = {
	i1/*Initialize*/: function() {
		var me = this,
			owner = me.owner,
			vctrl = $("<div></div>").appendTo(owner),
			tp;
			
		me.width = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(owner);
		me.height = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(owner);
		me.margin = {top: 5, right: 40, bottom: 20, left: 120};
		
		if (!me.bb)
		{
			me.bb = IG$/*mainapp*/._ICb/*bulletChart*/();
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.bb, me.width - me.margin.right - me.margin.left);
    		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.bb, me.height - me.margin.top - me.margin.bottom);
		}
		
		tp = $("<ul></ul>").appendTo(vctrl);
		me.gtp = tp;
		
		tp = $("<li></li>").appendTo(me.gtp);
		$("<div>Ranges</div>").appendTo(tp);
		me.ranges = $("<combobox></combobox>").appendTo(tp);
		
		tp = $("<li></li>").appendTo(me.gtp);
		$("<div>Measures</div>").appendTo(tp);
		me.measures = $("<combobox></combobox>").appendTo(tp);
		
		tp = $("<li></li>").appendTo(me.gtp);
		$("<div>Markers</div>").appendTo(tp);
		me.markers = $("<combobox></combobox>").appendTo(tp);
	},
	
	i2/*loadData*/: function(mresult) {
		var me = this,
			owner = me.owner,
			width = me.width,
			height = me.height,
			margin = me.margin,
			vparent = $("<div><div>").appendTo(me.owner),
			vis = d3.select(vparent[0]).selectAll("svg"),
			chart = me.bb,
			dt;
			
		dt = me.pD/*getData*/();
		
	    vis.data(dt)
	    	.enter().append("svg")
	      		.attr("class", "bullet")
	      		.attr("width", width)
	      		.attr("height", height)
	    	.append("g")
	      		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	      	.call(chart);
	
	  	var title = vis.append("g")
	      	.attr("text-anchor", "end")
	      	.attr("transform", "translate(-6," + (height - margin.top - margin.bottom) / 2 + ")");
	
	  	title.append("text")
	      	.attr("class", "title")
	      	.text(function(d) { return d.title; });
	
	  	title.append("text")
	    	.attr("class", "subtitle")
	      	.attr("dy", "1em")
	      	.text(function(d) { return d.subtitle; });
	      	
	   	me.vis = vis;
	   	me.title = title;
	
	  	chart.duration(1000);
	},
	
	i3/*drawChart*/: function() {
		var me = this,
			chart = me.bb;
		vis.datum(randomize).call(chart);
	},
	
	pD/*getData*/: function() {
		var me = this,
			r = [],
			data = mresult.data,
			fc = mresult.colfix,
			fr = mresult.rowfix,
			tc = (data.length > 0) ? data[0].length : 0,
			measurecol = {},
			markercol = {},
			i, j, mi=0, row, val, mmax, mmin, mrange, memin, memax;
			
		for (i=fc; i < tc; i++)
		{
		}
			
		for (i=fr; i < data.length; i++)
		{
			row = {
				title: null,
				ranges: [],
				measures: [],
				markers: []
			};
			
			memin = null; memax = null;
			
			for (j=0; j < tc; j++)
			{
				if (j < fc)
				{
					val = data[i][j].text || data[i][j].code;
					row.title = (i == 0) ? val : row.title + " " + val;
				}
				else
				{
					val = Number(data[i][j].code);
					mmax = (j == fc) ? val : Math.max(mmax, val);
					mmin = (j == fc) ? val : Math.min(mmin, val);
					
					if (measurecol[j] == true)
					{
						if (memin == null)
						{
							memin = val;
							memax = val;
						}
						else
						{
							memin = Math.min(memin, val);
							memax = Math.max(memax, val);
						}
					}
					if (markercol[j] == true)
					{
						row.markers.push(val);
					}
				}
			}
			
			row.ranges = [mmin, mrange, mmax];
			row.measures = [memin, memax];
			
			r.push(row);
		}
			
		return r;
	}
};


function randomize(d) {
  if (!d.randomizer) d.randomizer = randomizer(d);
  d.ranges = d.ranges.map(d.randomizer);
  d.markers = d.markers.map(d.randomizer);
  d.measures = d.measures.map(d.randomizer);
  return d;
}

function randomizer(d) {
  var k = d3.max(d.ranges) * .2;
  return function(d) {
    return Math.max(0, d + k * (Math.random() - .5));
  };
}

// Chart design based on the recommendations of Stephen Few. Implementation
// based on the work of Clint Ivy, Jamie Love, and Jason Davies.
// http://projects.instantcognition.com/protovis/bulletchart/
IG$/*mainapp*/._ICb/*bulletChart*/ = function() {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 0,
      ranges = bulletRanges,
      markers = bulletMarkers,
      measures = bulletMeasures,
      width = 380,
      height = 30,
      tickFormat = null;

  // For each small multiple¡¦
  function bullet(g) {
    g.each(function(d, i) {
      var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
          markerz = markers.call(this, d, i).slice().sort(d3.descending),
          measurez = measures.call(this, d, i).slice().sort(d3.descending),
          g = d3.select(this);

      // Compute the new x-scale.
      var x1 = d3.scale.linear()
          .domain([0, Math.max(rangez[0], markerz[0], measurez[0])])
          .range(reverse ? [width, 0] : [0, width]);

      // Retrieve the old x-scale, if this is an update.
      var x0 = this.__chart__ || d3.scale.linear()
          .domain([0, Infinity])
          .range(x1.range());

      // Stash the new scale.
      this.__chart__ = x1;

      // Derive width-scales from the x-scales.
      var w0 = bulletWidth(x0),
          w1 = bulletWidth(x1);

      // Update the range rects.
      var range = g.selectAll("rect.range")
          .data(rangez);

      range.enter().append("svg:rect")
          .attr("class", function(d, i) { return "range s" + i; })
          .attr("width", w0)
          .attr("height", height)
          .attr("x", reverse ? x0 : 0)
        .transition()
          .duration(duration)
          .attr("width", w1)
          .attr("x", reverse ? x1 : 0);

      range.transition()
          .duration(duration)
          .attr("x", reverse ? x1 : 0)
          .attr("width", w1)
          .attr("height", height);

      // Update the measure rects.
      var measure = g.selectAll("rect.measure")
          .data(measurez);

      measure.enter().append("svg:rect")
          .attr("class", function(d, i) { return "measure s" + i; })
          .attr("width", w0)
          .attr("height", height / 3)
          .attr("x", reverse ? x0 : 0)
          .attr("y", height / 3)
        .transition()
          .duration(duration)
          .attr("width", w1)
          .attr("x", reverse ? x1 : 0);

      measure.transition()
          .duration(duration)
          .attr("width", w1)
          .attr("height", height / 3)
          .attr("x", reverse ? x1 : 0)
          .attr("y", height / 3);

      // Update the marker lines.
      var marker = g.selectAll("line.marker")
          .data(markerz);

      marker.enter().append("svg:line")
          .attr("class", "marker")
          .attr("x1", x0)
          .attr("x2", x0)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6)
        .transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1);

      marker.transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6);

      // Compute the tick format.
      var format = tickFormat || x1.tickFormat(8);

      // Update the tick groups.
      var tick = g.selectAll("g.tick")
          .data(x1.ticks(8), function(d) {
            return this.textContent || format(d);
          });

      // Initialize the ticks with the old scale, x0.
      var tickEnter = tick.enter().append("svg:g")
          .attr("class", "tick")
          .attr("transform", bulletTranslate(x0))
          .style("opacity", 1e-6);

      tickEnter.append("svg:line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickEnter.append("svg:text")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr("y", height * 7 / 6)
          .text(format);

      // Transition the entering ticks to the new scale, x1.
      tickEnter.transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1);

      // Transition the updating ticks to the new scale, x1.
      var tickUpdate = tick.transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1);

      tickUpdate.select("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickUpdate.select("text")
          .attr("y", height * 7 / 6);

      // Transition the exiting ticks to the new scale, x1.
      tick.exit().transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1e-6)
          .remove();
    });
    d3.timer.flush();
  }

  // left, right, top, bottom
  bullet.orient = function(x) {
    if (!arguments.length) return orient;
    orient = x;
    reverse = orient == "right" || orient == "bottom";
    return bullet;
  };

  // ranges (bad, satisfactory, good)
  bullet.ranges = function(x) {
    if (!arguments.length) return ranges;
    ranges = x;
    return bullet;
  };

  // markers (previous, goal)
  bullet.markers = function(x) {
    if (!arguments.length) return markers;
    markers = x;
    return bullet;
  };

  // measures (actual, forecast)
  bullet.measures = function(x) {
    if (!arguments.length) return measures;
    measures = x;
    return bullet;
  };

  bullet.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return bullet;
  };

  bullet.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return bullet;
  };

  bullet.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return bullet;
  };

  bullet.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return bullet;
  };

  return bullet;
};

function bulletRanges(d) {
  return d.ranges;
}

function bulletMarkers(d) {
  return d.markers;
}

function bulletMeasures(d) {
  return d.measures;
}

function bulletTranslate(x) {
  return function(d) {
    return "translate(" + x(d) + ",0)";
  };
}

function bulletWidth(x) {
  var x0 = x(0);
  return function(d) {
    return Math.abs(x(d) - x0);
  };
}


