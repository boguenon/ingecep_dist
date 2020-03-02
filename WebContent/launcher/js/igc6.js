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
IG$/*mainapp*/._I95/*olapChartView*/.prototype.JJ$4/*drawProtovisChart*/ = function(rct/*rendercharttype*/, mresult) {
	var i,
		j,
		me = this,
		mcr = me._ILb/*sheetoption*/ ? me._ILb/*sheetoption*/.cco/*chartOption*/ : null,
		data = mresult.data,
		fc = mresult.colfix,
		fr = mresult.rowfix,
		tc = (data.length > 0) ? data[0].length : 0,
		title,
		fields = [],
		matrixdata = [],
		row,
		tn,
		relationgroups = me.cop.relationgroups;

	me.drawmode = "protovis";

	me.mresult = mresult;
	me.rct/*rendercharttype*/ = rct/*rendercharttype*/;

	var jdom = $(me.container),
		w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom),
	    h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom);

	switch (rct/*rendercharttype*/)
	{
	case "boxplot":
		var dp = [],
			cols = [],
			cval,
			row,
			mdp = [],
			tmax=0;

		/* Convert from tabular format to array of objects. */
		for (i=fc; i < tc; i++)
		{
			for (j=0; j < fr; j++)
			{
			 	cval = (j==0) ? data[j][i].text : cval + IG$/*mainapp*/.sX/*seperator*/ + data[j][i].text;
			}
			cols.push(cval);
			mdp.push({id: cval, median: 0, uq: 0, lq: 0, max: 0, min: 0});
		}

		for (i=fc; i < tc; i++)
		{
			row = [];

			var min=Number(data[fr][i].code),
				max=min,
				sum=0,
				uq,
				lq,
				val,
				ui = parseInt((data.length - fr) * .8),
				li = parseInt((data.length - fr) * .2),
				mi = parseInt((data.length - fr) * .5);

			for (j=fr; j < data.length; j++)
			{
				//row.push(Number(data[j][i].code));
				val = Number(data[j][i].code);
				min = Math.min(min, val);
				max = Math.max(max, val);
				sum += val;
				row.push(val);
			}

			row = row.sort(function (a, b) { return a-b});
			mdp[i-fc].min = min;
			mdp[i-fc].max = max;
			mdp[i-fc].median = row[mi];
			mdp[i-fc].lq = row[li];
			mdp[i-fc].uq = row[ui];
			tmax = Math.max(tmax, max);
			// dp.push(row);
		}

		// cols.shift();

		var mw = w, mh=h;
		me.vismargin = {top: 0, bottom: 20, right: 20, left: 40};

		w -= me.vismargin.left + me.vismargin.right;
		h -= me.vismargin.top + me.vismargin.bottom;
		var x = pv.Scale.ordinal(mdp, function(e) {return e.id}).splitBanded(0, w, 3/5)
	    	y = pv.Scale.linear(0, tmax).range(0, h)
	    	s = x.range().band / 2;


	    me.vis = new pv.Panel()
	    	.canvas(me.container)
		    .width(w)
		    .height(h)
		    .top(me.vismargin.top)
		    .bottom(me.vismargin.bottom)
		    .left(me.vismargin.left)
		    .right(me.vismargin.right);

		/* Add the y-axis rules */
		me.vis.add(pv.Rule)
		    .data(y.ticks())
		    .bottom(y)
		    .strokeStyle(function(d) {return (d == 0 || d == 1) ? "#000" : "#ccc"})
		  .anchor("left").add(pv.Label)
		    .text(y.tickFormat);

		/* Add a panel for each data point */
		var points = me.vis.add(pv.Panel)
		    .data(mdp)
		    .left(function(d) {return x(d.id)})
		    .width(s * 2);

		/* Add the experiment id label */
		points.anchor("bottom").add(pv.Label)
		    .textBaseline("top")
		    .text(function(d) {return d.id});

		/* Add the range line */
		points.add(pv.Rule)
		    .left(s)
		    .bottom(function(d) {return y(d.min)})
		    .height(function(d) {return y(d.max) - y(d.min)});

		/* Add the min and max indicators */
		points.add(pv.Rule)
		    .data(function(d) {return [d.min, d.max]})
		    .bottom(y)
		    .left(s / 2)
		    .width(s);

		/* Add the upper/lower quartile ranges */
		points.add(pv.Bar)
		    .bottom(function(d) {return y(d.lq)})
		    .height(function(d) {return y(d.uq) - y(d.lq)})
		    .fillStyle(function(d) {return d.median > .5 * (d.uq - d.lq) + d.lq ? "#aec7e8" : "#ffbb78"})
		    .strokeStyle("black")
		    .lineWidth(1)
		    .antialias(false);

		/* Add the median line */
		points.add(pv.Rule)
		    .bottom(function(d) {return y(d.median)});

		me.vis.render();
		break;
	case "performancemap":
		var dp = [],
			cols = ["Name"],
			cval,
			row,
			stext,
			sw = 30,
			sh = 100;

		/* Convert from tabular format to array of objects. */
		for (i=fc; i < tc; i++)
		{
			for (j=0; j < fr; j++)
			{
			 	cval = (j==0) ? data[j][i].text : cval + IG$/*mainapp*/.sX/*seperator*/ + data[j][i].text;
			}
			stext = IG$/*mainapp*/.measureText(12, cval);
			sw = Math.max(stext.width + 10, sw);
			cols.push(cval);
		}

		for (i=fr; i < data.length; i++)
		{
			row = [];
			for (j=0; j < fc; j++)
			{
				cval = (j==0) ? data[i][j].text : cval + IG$/*mainapp*/.sX/*seperator*/ + data[i][j].text;
			}
			stext = IG$/*mainapp*/.measureText(12, cval);
			sh = Math.max(stext.width, sh);

			row.push(cval);

			for (j=fc; j < tc; j++)
			{
				row.push(Number(data[i][j].code) || 0);
			}

			dp.push(row);
		}

		dp = dp.map(function(d) {return pv.dict(cols, function() {return d[this.index]})});
		cols.shift();

		/* The color scale ranges 3 standard deviations in each direction. */
		var x = pv.dict(cols, function(f) {return pv.mean(dp, function(d) {return d[f]})}),
		    s = pv.dict(cols, function(f) {return pv.deviation(dp, function(d) {return d[f]})}),
		 fill = pv.dict(cols, function(f) {return pv.Scale.linear()
		        .domain(-3 * s[f] + x[f], 3 * s[f] + x[f])
		    	.range("white", "steelblue")});

		var cellw = 24, cellh = 13;
		me.vismargin = {top: sw, left: sh, width: cols.length * cellw, height: dp.length * cellh};

		var nchartcontainer = $(me.container),
			twidth = Math.max(me.vismargin.width + me.vismargin.left, w),
			theight = Math.max(me.vismargin.top + me.vismargin.height, h);

		nchartcontainer.css({overflow: "scroll"});

		/* The cell dimensions. */
		me.vis = new pv.Panel()
			.canvas(me.container)
		    .width(me.vismargin.width)
		    .height(me.vismargin.height)
		    .top(sw)
		    .left(sh); //me.vismargin.left);

		me.vis.add(pv.Panel)
		    .data(cols)
		    .left(function() {return this.index * cellw})
		    .width(cellw)
		  .add(pv.Panel)
		    .data(dp)
		    .top(function() {return this.index * cellh})
		    .height(cellh)
		    .fillStyle(function(d, f) {return fill[f](d[f])})
		    .strokeStyle("white")
		    .lineWidth(1)
		    .antialias(false)
		    .title(function(d, f) {return d.Name + "'s " + f + ": " + d[f]});

		me.vis.add(pv.Label)
		    .data(cols)
		    .top(3)
		    .left(function() {return this.index * cellw + cellw / 2})
		    .textAngle(-Math.PI / 2)
		    .textBaseline("middle");

		me.vis.add(pv.Label)
		    .data(dp)
		    .top(function() {return this.index * cellh + cellh / 2})
		    .left(3)
		    .textAlign("right")
		    .textBaseline("middle")
		    .text(function(d) {return d.Name});

		me.vis.render();
		break;
	case "parallel":
		for (i=fc; i < data[0].length; i++)
		{
			title = "";

			for (j=0; j < fr; j++)
			{
				title = (j==0 ? data[i][j].text : title + IG$/*mainapp*/.sX/*seperator*/ + data[i][j].text);
			}
			fields.push(title);
		}

		var cars = [],
			cols = [],
			units = {},
			visible;

		for (i=fc; i < data[0].length; i++)
		{
			title = "";
			for (j=0; j < fr; j++)
			{
				title = (j == 0) ? data[j][i].text : title + IG$/*mainapp*/.sX/*seperator*/ + data[j][i].text;
			}

			units[title] = {name: title, unit: ""};
			cols.push(title);
		}

		var dims = pv.keys(units);

		for (i=fr; i < data.length; i++)
		{
			title = "";
			for (j=0; j < fc; j++)
			{
				title = (j==0) ? data[i][j].text : title + IG$/*mainapp*/.sX/*seperator*/ + data[i][j].text;
			}

			var drow = {};
			drow.name = title;

			for (j=fc; j < data[i].length; j++)
			{
				drow[cols[j-fc]] = Number(data[i][j].code);
			}

			cars.push(drow);
		}

		me.vismargin = {left: 30, right: 30, top: 30, bottom: 40};
		w -= me.vismargin.left + me.vismargin.right;
		h -= me.vismargin.top + me.vismargin.bottom;

		// The units and dimensions to visualize, in order.

		/* Sizing and scales. */
		var fudge = 0.5,
		    x = pv.Scale.ordinal(dims).splitFlush(0, w),
		    y = pv.dict(dims, function(t) {return pv.Scale.linear(
		        cars.filter(function(d) {return !isNaN(d[t])}),
		        function(d) {return Math.floor(d[t])-fudge},
		        function(d) {return Math.ceil(d[t]) +fudge}
		    	).range(0, h)}),
		    c = pv.dict(dims, function(t) {return pv.Scale.linear(
		        cars.filter(function(d) {return !isNaN(d[t])}),
		        function(d) {return Math.floor(d[t])-fudge},
		        function(d) {return Math.ceil(d[t]) +fudge}
		    	).range("steelblue", "brown")});

		/* Interaction state. */
		var filter = pv.dict(dims, function(t) {
		    return {min: y[t].domain()[0], max: y[t].domain()[1]};
		  }), active = dims[0];

		/* The root panel. */
		me.vis = new pv.Panel()
			.canvas(me.container)
		    .width(w)
		    .height(h)
		    .left(me.vismargin.left)
		    .right(me.vismargin.right)
		    .top(me.vismargin.top)
		    .bottom(me.vismargin.bottom);

		// The parallel coordinates display.

		var pcord = me.vis.add(pv.Panel)
		    .data(cars)
		    .visible(
		    	function(d) {
		    		visible = dims.every(
		    			function(t) {
		    				return (d[t] >= filter[t].min) && (d[t] <= filter[t].max);
		    			}
		    		);
		    		return visible;
		    	}
		    );

		pcord.add(pv.Line)
		    .data(dims)
		    .left(function(t, d) {
		    	return x(t);
		    })
		    .bottom(function(t, d) {
		    	return y[t](d[t]);
		    })
		    .strokeStyle("#ddd")
		    .lineWidth(1)
		    .antialias(false);

		// Rule per dimension.
		var rule = me.vis.add(pv.Rule)
		    .data(dims)
		    .left(x);

		// Dimension label
		rule.anchor("top").add(pv.Label)
		    .top(-12)
		    .font("bold 10px sans-serif")
		    .text(function(d) {return units[d].name});

		// The parallel coordinates display.
		var change = me.vis.add(pv.Panel);

		var pnlLine = change.add(pv.Panel)
		    .data(cars)
		    .visible(
		    	function(d) {
		    		visible = dims.every(
		    			function(t) {
		    				return (d[t] >= filter[t].min) && (d[t] <= filter[t].max);
		    			}
		    		);
		    		return visible;
		    	}
		    );

		pnlLine.add(pv.Line)
		    .data(dims)
		    .left(function(t, d) {
		    	return x(t)
		    })
		    .bottom(function(t, d) {
		    	return y[t](d[t])
		    })
		    .strokeStyle(function(t, d) {
		    	return c[active](d[active])
		    })
		    .lineWidth(1);

		// Updater for slider and resizer.
		var update = function(d) {
		  var t = d.dim;
		  filter[t].min = Math.max(y[t].domain()[0], y[t].invert(h - d.y - d.dy));
		  filter[t].max = Math.min(y[t].domain()[1], y[t].invert(h - d.y));
		  active = t;
		  me.Umx/*updateSelection*/.call(me, filter, cols);
		  change.render();
		  return false;
		}

		// Updater for slider and resizer.
		var selectAll = function(d) {
		  if (d.dy < 3) {
		    var t = d.dim;
		    filter[t].min = Math.max(y[t].domain()[0], y[t].invert(0));
		    filter[t].max = Math.min(y[t].domain()[1], y[t].invert(h));
		    d.y = 0; d.dy = h;
		    active = t;
		    me.Umx/*updateSelection*/.call(me, null);
		    change.render();
		  }
		  return false;
		}

		/* Handle select and drag */
		var handle = change.add(pv.Panel)
		    .data(dims.map(function(dim) { return {y:0, dy:h, dim:dim}; }))
		    .left(function(t) {return x(t.dim) - 30})
		    .width(60)
		    .fillStyle("rgba(0,0,0,.001)")
		    .cursor("crosshair")
		    .event("mousedown", pv.Behavior.select())
		    .event("select", update)
		    .event("selectend", selectAll)
		  .add(pv.Bar)
		    .left(25)
		    .top(function(d) {return d.y})
		    .width(10)
		    .height(function(d) {return d.dy})
		    .fillStyle(function(t) {
			    	return t.dim == active
			        	? c[t.dim]((filter[t.dim].max + filter[t.dim].min) / 2)
			    		: "hsla(0,0,50%,.5)"
		    	}
		    )
		    .strokeStyle("white")
		    .cursor("move")
		    .event("mousedown", pv.Behavior.drag())
		    .event("dragstart", update)
		    .event("drag", update);

		handle.anchor("bottom").add(pv.Label)
		    .textBaseline("top")
		    .text(function(d) {return filter[d.dim].min.toFixed(0) + units[d.dim].unit});

		handle.anchor("top").add(pv.Label)
		    .textBaseline("bottom")
		    .text(function(d) {return filter[d.dim].max.toFixed(0) + units[d.dim].unit});

		me.vis.render();

		if (!me.sbx/*selectionButton*/)
		{
			me.sbx/*selectionButton*/ = $("<div class='m-vis-selbutton'>Selected</div>").appendTo(me.P1/*maincontainer*/);
			me.sbx/*selectionButton*/.bind("click", function() {
				me.pj4/*showHideSelection*/.call(me, null);
			});
		}
		break;
	case "networkdiagram_pos":
	case "networkdiagram_neg":
		var rel_range1 = (me.cop.rel_range1 == IG$/*mainapp*/.UNDEFINED || me.cop.rel_range1 == null) ? -1 : me.cop.rel_range1,
			rel_range2 = (me.cop.rel_range2 == IG$/*mainapp*/.UNDEFINED || me.cop.rel_range2 == null) ? 1 : me.cop.rel_range2;

		me.vismargin = {left: 0, right: 0, top: 0, bottom: 90};
		w -= me.vismargin.left + me.vismargin.right;
		h -= me.vismargin.top + me.vismargin.bottom;

		var miserables = me.JJ$1/*getRelationData*/(mresult, (rct/*rendercharttype*/ == "networkdiagram_pos") ? 1 : 0, false, relationgroups, {s: rel_range1, t: rel_range2});

		me.vis = new pv.Panel()
			.canvas(me.container)
		    .width(w)
		    .height(h)
		    .bottom(90);

		var arc = me.vis.add(pv.Layout.Arc)
		    .nodes(miserables.nodes)
		    .links(miserables.links)
		    .sort(function(a, b) {return a.group == b.group
		        ? b.linkDegree - a.linkDegree
		    	: b.group - a.group});

		arc.link.add(pv.Line);

		arc.node.add(pv.Dot)
			.size(function(d) {return d.linkDegree + 4})
			.fillStyle(pv.Colors.category19().by(function(d) {return d.group}))
			.strokeStyle(function() {return this.fillStyle().darker()});

		arc.label.add(pv.Label)

		me.vis.render();

		break;
	case "matrixdiagram":
		var color = pv.Colors.category19().by(function(d) {return d.group}),
			rel_range1 = (me.cop.rel_range1 == IG$/*mainapp*/.UNDEFINED || me.cop.rel_range1 == null) ? -1 : me.cop.rel_range1,
			rel_range2 = (me.cop.rel_range2 == IG$/*mainapp*/.UNDEFINED || me.cop.rel_range2 == null) ? 1 : me.cop.rel_range2;

		me.vismargin = {left: 90, right: 0, top: 90, bottom: 0};
		w -= me.vismargin.left + me.vismargin.right;
		h -= me.vismargin.top + me.vismargin.bottom;

		var miserables = me.JJ$1/*getRelationData*/(mresult, 2, false, relationgroups, {s: rel_range1, t: rel_range2});

		me.vis = new pv.Panel()
			.canvas(me.container)
		    .width(w)
		    .height(h)
		    .top(me.vismargin.top)
		    .left(me.vismargin.left);

		var layout = me.vis.add(pv.Layout.Matrix)
		    .nodes(miserables.nodes)
		    .links(miserables.links)
		    .sort(function(a, b) {return b.group - a.group});

		layout.link.add(pv.Bar)
		    .fillStyle(function(l) {
		    	return l.linkValue ?
		    	((l.targetNode.group == l.sourceNode.group) ? color(l.sourceNode) : "#555")
		    		: "#eee"})
		    .antialias(false)
		    .lineWidth(1);

		layout.label.add(pv.Label)
		    .textStyle(color);

		me.vis.render();
		break;
	case "anderson":
		/* Size parameters. */
		var size = 150,
		    padding = 20;
		var species = [], spmap = {},
			traits = [],
			flowers = [],
			spcol = 0, t, tc = data[0].length, flower, key;

		for (i=fc; i < data[0].length; i++)
		{
			title = "";
			for (j=0; j < fr; j++)
			{
				title = (j==0) ? data[j][i].text : title + "_" + data[j][i].text;
			}
			traits.push(title);
		}

		for (i=0; i < me._ILb/*sheetoption*/.rows.length; i++)
		{
			if (me._ILb/*sheetoption*/.rows[i].name == me.cop.andersonspecies)
			{
				spcol = i;
				break;
			}
		}

		for (i=fr; i < data.length; i++)
		{
			t = data[i][spcol].text;
			if (!spmap[t])
				spmap[t] = t;
			flower = {species: t};
			for (j=fc; j < tc; j++)
			{
				flower[traits[j-fc]] = data[i][j].code;
			}
			flowers.push(flower);
		}

		for (key in spmap)
		{
			species.push(key);
		}

		var nchartcontainer = $(me.container),
			twidth = Math.max((size + padding) * traits.length, w),
			theight = Math.max((size + padding) * traits.length, h) + padding;

		nchartcontainer.css({overflow: "scroll"});

		/* Scales for color and position. */
		var grey = pv.rgb(144, 144, 144, .2),
			color = pv.colors(
		        "rgba(30, 108, 11, 1)",
		        "rgba(0, 72, 140, 1)",
		        "rgba(51, 38, 9, 1)",
		        "rgba(216, 64, 0, 1)",
		        "rgba(67, 76, 67, 1)",
		        "rgba(179, 0, 35, 1)",
		        "rgba(248, 215, 83, 1)",
		        "rgba(92, 151, 70, 1)",
		        "rgba(62, 117, 167, 1)",
		        "rgba(122, 101, 62, 1)",
		        "rgba(225, 102, 42, 1)",
		        "rgba(116, 121, 111, 1)",
		        "rgba(196, 56, 79, 1)",
		        "rgba(255, 248, 163, 1)",
		        "rgba(196, 204, 143, 1)",
		        "rgba(178, 200, 217, 1)",
		        "rgba(190, 163, 122, 1)",
		        "rgba(243, 170, 121, 1)",
		        "rgba(181, 181, 169, 1)",
		        "rgba(230, 165, 164, 1)"),
		    position = pv.dict(traits, function(t) {
		        return pv.Scale.linear(flowers, function(d) {return d[t]})
		    	.range(0, size)});

		me.vismargin = {left: 10, right: 0, top: 5, bottom: 0};
		w -= me.vismargin.left + me.vismargin.right;
		h -= me.vismargin.top + me.vismargin.bottom;
		me.vismargin.width = twidth;
		me.vismargin.height = theight;

		/* Root panel. */
		me.vis = new pv.Panel()
			.canvas(me.container)
		    .width((size + padding) * traits.length)
		    .height((size + padding) * traits.length + padding)
		    .left(me.vismargin.left)
		    .top(me.vismargin.top);

		/* One cell per trait pair. */
		var cell = me.vis.add(pv.Panel)
		    .data(traits)
		    .top(function() {return this.index * (size + padding) + padding / 2})
		    .height(size)
		  .add(pv.Panel)
		    .data(function(y) {return traits.map(function(x) {return ({px:x, py:y})})})
		    .left(function() {return this.index * (size + padding) + padding / 2})
		    .width(size);

		/* Framed dot plots not along the diagonal. */
		var plot = cell.add(pv.Panel)
		    .visible(function(t) {return t.px != t.py})
		    .strokeStyle("#aaa");

		/* X-axis ticks. */
		var xtick = plot.add(pv.Rule)
		    .data(function(t) {return position[t.px].ticks(5)})
		    .left(function(d, t) {return position[t.px](d)})
		    .strokeStyle("#eee");

		/* Bottom label. */
		xtick.anchor("bottom").add(pv.Label)
		    .visible(function() {return (cell.parent.index == traits.length - 1) && !(cell.index & 1)})
		    .text(function(d, t) {return position[t.px].tickFormat(d)});

		/* Top label. */
		xtick.anchor("top").add(pv.Label)
		    .visible(function() {return (cell.parent.index == 0) && (cell.index & 1)})
		    .text(function(d, t) {return position[t.px].tickFormat(d)});

		/* Y-axis ticks. */
		var ytick = plot.add(pv.Rule)
		    .data(function(t) {return position[t.py].ticks(5)})
		    .bottom(function(d, t) {return position[t.py](d)})
		    .strokeStyle("#eee");

		/* Left label. */
		ytick.anchor("left").add(pv.Label)
		    .visible(function() {return (cell.index == 0) && (cell.parent.index & 1)})
		    .text(function(d, t) {return position[t.py].tickFormat(d)});

		/* Right label. */
		ytick.anchor("right").add(pv.Label)
		    .visible(function() {return (cell.index == traits.length - 1) && !(cell.parent.index & 1)})
		    .text(function(d, t) {return position[t.py].tickFormat(d)});

		/* Frame and dot plot. */
		/* plot.add(pv.Dot)
		    .data(flowers)
		    .left(function(d, t) {return position[t.px](d[t.px])})
		    .bottom(function(d, t) {return position[t.py](d[t.py])})
		    .size(10)
		    .strokeStyle(null)
		    .fillStyle(function(d) {return color(d.species)}); */

		/* Frame and dot plot. */
		var dot = plot.add(pv.Dot)
		    .data(flowers)
		    .left(function(d, t) {return position[t.px](d[t.px])})
		    .bottom(function(d, t) {return position[t.py](d[t.py])})
		    .size(10)
		    .strokeStyle(null)
		    .fillStyle(function(d) {return s
		        && ((d[s.px] < s.x1) || (d[s.px] > s.x2)
		        || (d[s.py] < s.y1) || (d[s.py] > s.y2))
		    	? grey : color(d.species)});

		/* Interaction: new selection and display and drag selection */
		var vis = me.vis;

		/* Interaction: update selection. */
		var anderson_update = function (d, t) {
		  // var sy = nchartcontainer.scrollTop() || 0,
		  //	  sx = nchartcontainer.scrollLeft() || 0;
		  // d.y += sy;
		  // d.x += sx;
		  s = d;
		  s.px = t.px;
		  s.py = t.py;
		  s.x1 = position[t.px].invert(d.x);
		  s.x2 = position[t.px].invert(d.x + d.dx);
		  s.y1 = position[t.py].invert(size - d.y - d.dy);
		  s.y2 = position[t.py].invert(size - d.y);
		  dot.context(null, 0, function() {vis.render()});
		  me.Umx/*updateSelection*/.call(me, null, traits, s);
		}

		plot.add(pv.Panel)
		   .data([{x:20, y:20, dx:100, dy:100}])
		   .cursor("crosshair")
		   .events("all")
		   .event("mousedown", pv.Behavior.select())
		   .event("selectstart", function() {
		   		s = null;
		   		return vis;
		   	})
		   .event("select", anderson_update)
		 .add(pv.Bar)
		   .visible(function(d, k, t) {return s && s.px == t.px && s.py == t.py})
		   .left(function(d) {return d.x})
		   .top(function(d) {return d.y})
		   .width(function(d) {return d.dx})
		   .height(function(d) {return d.dy})
		   .fillStyle("rgba(0,0,0,.15)")
		   .strokeStyle("white")
		   .cursor("move")
		   .event("mousedown", pv.Behavior.drag())
		   .event("drag", anderson_update);

		/* Labels along the diagonal. */
		cell.anchor("center").add(pv.Label)
		    .visible(function(t) {return t.px == t.py})
		    .font("bold 14px sans-serif")
		    .text(function(t) {return t.px.replace(/([WL])/, " $1").toLowerCase()});

		/* Legend. */
		me.vis.add(pv.Dot)
		    .data(species)
		    .bottom(10)
		    .left(function() {return 15 + this.index * 65})
		    .size(8)
		    .strokeStyle(null)
		    .fillStyle(color)
		  .anchor("right").add(pv.Label);

		me.vis.render();

		if (!me.sbx/*selectionButton*/)
		{
			me.sbx/*selectionButton*/ = $("<div class='m-vis-selbutton'></div>").appendTo(me.P1/*maincontainer*/);
			me.sbx/*selectionButton*/.bind("click", function() {
				me.pj4/*showHideSelection*/.call(me, null);
			});
		}
		break;
	case "forcelayout":
		me.vismargin = {left: 0, right: 0, top: 0, bottom: 0};
		w -= me.vismargin.left + me.vismargin.right;
		h -= me.vismargin.top + me.vismargin.bottom;

		var colors = pv.Colors.category19(),
			rel_range1 = (me.cop.rel_range1 == IG$/*mainapp*/.UNDEFINED || me.cop.rel_range1 == null) ? -1 : me.cop.rel_range1,
			rel_range2 = (me.cop.rel_range2 == IG$/*mainapp*/.UNDEFINED || me.cop.rel_range2 == null) ? 1 : me.cop.rel_range2;

		var miserables = me.JJ$1/*getRelationData*/(mresult, 2, true, relationgroups, {s: rel_range1, t: rel_range2});

		me.vis = new pv.Panel()
			.canvas(me.container)
		    .width(w)
		    .height(h)
		    .fillStyle("white")
		    .event("mousedown", pv.Behavior.pan())
		    .event("mousewheel", pv.Behavior.zoom());

		var force = me.vis.add(pv.Layout.Force)
		    .nodes(miserables.nodes)
		    .links(miserables.links)
		    .chargeConstant(-9000);

		force.link.add(pv.Line);

		force.node.add(pv.Dot)
		    .size(function(d) {return (d.linkDegree + 4) * Math.pow(this.scale, -1.5)})
		    .fillStyle(function(d) {return d.fix ? "brown" : colors(d.group)})
		    .strokeStyle(function() {return this.fillStyle().darker()})
		    .lineWidth(1)
		    .title(function(d) {return d.nodeName})
		    .event("mousedown", pv.Behavior.drag())
		    .event("drag", force);

		me.vis.render();
		break;
	case "chord":
		// From http://mkweb.bcgsc.ca/circos/guide/tables/
		var chordmatrix = [], row, link, nodenames = [],
			tc = data[0].length,
			chd_method = mcr ? mcr.chd_method || "relations" : "relations",
			range = tc - fc,
			text_sample = [],
			bdraw = 0,
			currentSelectedIndex,
			color = d3.scale.category20c(),
			rel_range1 = (me.cop.rel_range1 == IG$/*mainapp*/.UNDEFINED || me.cop.rel_range1 == null) ? -1 : me.cop.rel_range1,
			rel_range2 = (me.cop.rel_range2 == IG$/*mainapp*/.UNDEFINED || me.cop.rel_range2 == null) ? 1 : me.cop.rel_range2;
			
		if (chd_method == "tablematrix")
		{
			var fitems = {},
				fnames = [],
				s = 0,
				fname,
				oitem,
				v,
				_c, _r;
			
			if (fc > 0)
			{
				for (i=fr; i < data.length; i++)
				{
					fname = data[i][0].code;
					if (!fitems[fname])
					{
						oitem = {
							name: fname,
							seq: s,
							r: i,
							c: -1
						};
						fnames.push(oitem);
						s++;
						fitems[fname] = oitem;
						
						text_sample.push({
							title: fname,
							code: fname
						});
					}
				}
				
				for (i=fc; i < tc; i++)
				{
					fname = data[0][i].code;
					
					if (fitems[fname])
					{
						fitems[fname].c = i;
					}
				}
				
				for (i=0; i < fnames.length; i++)
				{
					row = [];
					_r = fnames[i].r;
					
					for (j=0; j < fnames.length; j++)
					{
						_c = fnames[j].c;
						
						v = 0;
						
						if (_c > -1)
						{
							v = Number(data[_r][_c].code) || 0;
						}
						if (v > 0)
						{
							bdraw = 1;
						}
						row.push(v);
					}
					chordmatrix.push(row);
				}
			}
		}
		else
		{
			var relation = me.JJ$1/*getRelationData*/(mresult, 2, false, relationgroups, {s: rel_range1, t: rel_range2}),
				range = relation.nodes.length,
				fname;

			for (i=0; i < relation.nodes.length; i++)
			{
				row = [];
				fname = relation.nodes[i].nodeName;
				nodenames.push({name: fname});
				for (j=0; j < relation.nodes.length; j++)
				{
					row.push(0);
				}
				text_sample.push({
					title: fname,
					code: fname
				});
				chordmatrix.push(row);
			}
	
			for (i=0; i < relation.links.length; i++)
			{
				link = relation.links[i];
				chordmatrix[link.source][link.target] = (link.value + 1);
				if (link.source != link.target)
				{
					chordmatrix[link.target][link.source] = (link.value + 1);
					bdraw = 1;
				}
			}
		}
		
		if (bdraw == 0)
		{
			return;
		}
			
		var mw = w,
			mh = h,
			c_cset = (mcr ? mcr.colorset : "") || mresult.c_cset,
			chord = d3.layout.chord()
		  		.sortSubgroups(d3.descending)
		  		.matrix(chordmatrix),
		  	innerRadius = Math.min(w, h) * .41,
		  	outerRadius = innerRadius * 1.1,
		  	colors = ["#009CFF", "#FBE105", "#72C936", "#C42AD8", "#2164E9", "#FF9600", "#F02F1B"];
		
		if (IG$/*mainapp*/.__c_/*chartoption*/ && IG$/*mainapp*/.__c_/*chartoption*/.chartcolors && IG$/*mainapp*/.__c_/*chartoption*/.chartcolors[c_cset])
		{
			colors =  IG$/*mainapp*/.__c_/*chartoption*/.chartcolors[c_cset];
		}
		  	
		var fill = d3.scale.ordinal()
		  		.domain(d3.range(colors.length))
		  		.range(colors),
	  		arc = d3.svg.arc()
	  			.innerRadius(innerRadius)
	  			.outerRadius(outerRadius),
	  		chordl = d3.svg.chord().radius(innerRadius);

		me.vis = chord;
		
		function transition(path,selectedD) {
			path.transition()
				.duration(3000)
				.style("stroke", function(d){return fill(selectedD.index);})
				.attr("stroke-dashoffset", '1000')
				.attr("animation", 'dash 5s linear forwards');
		};
		
		function arcTween(chord) {
			return function(d,i) {
				var i = d3.interpolate(chord.groups()[i], d);
				
				return function(t) {
					return arc(i(t));
				};
			}
		};
		
		function chordTween(chord) {
			return function(d,i) {
				var i = d3.interpolate(chord.chords()[i], d);
				
				return function(t) {
					return chordl(i(t));
				};
			};
		}
		
		function groupTicks(d) {
			var k = (d.endAngle - d.startAngle) / d.value;
			return [
				{
					angle: d.value * k / 2 + d.startAngle,
					label: text_sample[d.index].title
				}
			];
		
		};
		
		function fade(opacity) {
			return function(g, i) {
				svg.selectAll(".chord path")
					.transition()
					.ease("linear in ")
					.delay(function(d, i){
						return i * 10;
					})
					.filter(function(d) {return d.source.index != i && d.target.index != i; })
					.style("opacity", opacity);
			};
		};

		var svg = d3.select(me.container).append("svg")
			.attr("width", mw)
			.attr("height", mh)
			.append("g")
			.attr("id", "circle")
			.attr("transform", "translate(" + mw / 2 + "," + mh / 2 + ")");

		var defs = svg.append('defs'),
			cobjs = [],
			cobj;
			
		for (i=0; i < colors.length; i++)
		{
			cobj = defs.append('linearGradient').attr('id','color' + i);
			cobj.append('stop').attr('offset', "0%").attr('stop-color', colors[i]);    
			cobj.append('stop').attr('offset', "100%").attr('stop-color', colors[i]);
			
			cobjs.push(cobj);
		}
		
		svg.append("g").selectAll("path")
		    .data(chord.groups)
		    .enter().append("path")
		    .attr('class','arc')
		    .style("fill", function(d) { return fill(d.index); })
		    .style("stroke", '#FFFFFF')
		    .style("stroke-width", '3.5px')
		    .attr("d", arc)
		    .on('mouseover',  function(d){
	            d3.select(this).transition().duration(100)
	            .style("stroke", 'gold')
	            .style("stroke-width", '2.5px')
	            .style("cursor", 'pointer');
	         })
	         .on('mouseout',  function(d){
	            d3.select(this).transition().duration(100)
	            .style("stroke", '#FFFFFF')
	            .style("stroke-width", '2.5px');
	         })
	         
		    .on("click", function(selectedD,selectedI){ 
		    	currentSelectedIndex = selectedD.index;
		    	svg.selectAll(".chord path")
			    .transition()
			    .ease("linear-in")
			    .style("opacity", function(d, i){
				   if(selectedD.index != d.source.index && selectedD.index != d.target.index){
					   return 0.1;
				   }else{
					   return 1;
				   };
			   })
			    .style("stroke", function(d, i){
				   if(selectedD.index != d.source.index && selectedD.index != d.target.index){ 
					   return '#FFF';
				   }else{ 
					   return '#FFF';
				   };
			   })
			   .style("stroke-width", function(d, i){
				   if(selectedD.index != d.source.index && selectedD.index != d.target.index){
					   return '0px';
				   }else{
					   return '1px';
				   };
			   })
			   .call(transition,selectedD);
		    	
		    	svg.select(".chord")
			     .selectAll("path")
			     .style("fill", function(d, i){
			     	 var r,
			     	 	m;
			     	 
			    	 if(d.source.index == selectedD.index || d.source.subindex == selectedD.index)
			    	 {
			    	 	m = selectedD.index % cobjs.length;
			    	 	if (cobjs[m])
			    	 	{
			    	 		r = "url(#color" + m + ")";
			    	 	}
				     }
				     
				     return r;
				 });
		    });
		function getParseData(direction,index,subindex){
			var s_text = "",
				e_text = "",
				traffic = "";
				
			if(direction == 'S')
			{
				s_text = text_sample[index].title;
				e_text = text_sample[subindex].title;
				traffic = "<span style='color:#C0FF00'>" + chordmatrix[index][subindex] + " "+ "</span>";
			}
			
			return s_text +" " + e_text + "<br><br>" + traffic;
		};
		var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([0, 0])
				.html(function(d) {
					return getParseData('S',d.source.index, d.source.subindex);
				});
			
		svg.call(tip);
			
		var ticks = svg.append("g")
			.attr("class", "ticks")
			.selectAll("g")
		    .data(chord.groups)
			.enter().append("g")
			.attr("class", "group")
			.selectAll("g")
    		.data(groupTicks)
  			.enter().append("g")
  			.attr("class", "neighs")
		    .attr("transform", function(d) {
				return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + outerRadius + ",0)";
		    });

		ticks.append("line")
		    .attr("x1", 1)
		    .attr("y1", 0)
		    .attr("x2", 5)
		    .attr("y2", 0)
		    .style("stroke", "#ffffff");

		ticks.append("text")
		    .attr("x", 8)
		    .attr("dy", ".35em")
		    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
		    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
		    // .style("text-family", "µ¸À½Ã¼")
		    .style("text-weight", "bold")
		    .style("text-size", "13px")
		    .text(function(d) { return d.label; });
		
		var innerPath = svg.append("g")
		    .attr("class", "chord")
		    .selectAll("path")
		    .data(chord.chords)
		    .enter().append("path")
		    .style("opacity",0)
		    .attr("d", chordl)
		    .on('mouseover',tip.show)
			.on('mouseout', tip.hide);
    	
		svg.selectAll(".ticks")
			.selectAll(".group")
			.data(chord.groups)
			.selectAll(".neighs")
			.data(groupTicks)
			.transition()
			.duration(1500)
			.attr("transform", function(d) {
				return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + outerRadius + ",0)";
			});

		svg.selectAll(".arc")
			.data(chord.groups)
			.transition()
			.duration(1500)
			.select("title").text(function(d, i) {
				return neighs[i].name + ": " + formatPercent(d.value) + " of origins";
			});

		svg.select(".chord")
			.selectAll("path")
			.data(chord.chords)
			.style("fill", function(d, i){
				var r,
					m = d.target.index % cobjs.length;
				
				if (cobjs[m])
	    	 	{
	    	 		r = "url(#color" + m + ")";
	    	 	}
	    	 	
	    	 	return r;
			})
			.transition()
			.duration(1500)
			.style("opacity",1)
			.attrTween("d", chordTween(chord));
			
		break;
	case "sunburst":
		if (!window.d3)
			return;
			
		var mw = w,
			mh = h,
			r = Math.min(mw, mh) / 2, mobj, dcol = fc;
			color = d3.scale.category20c(), sundata = {name: "root", children: []},
			tc = data[0].length, pva = [];

		for (i=0; i < fc; i++)
		{
			pva.push({name: null, child: sundata});
		}

		for (i=fr; i < data.length; i++)
		{
			for (j=0; j < fc; j++)
			{
				if (pva[j].name != data[i][j].code)
				{
					if (j == 0)
					{
						mobj = {
							name: data[i][j].code
						};
						sundata.children.push(mobj);
						pva[j].child = mobj;
					}
					else
					{
						mobj = {
							name: data[i][j].code
						};
						pva[j-1].child.children.push(mobj);
						pva[j].child = mobj;
					}

					pva[j].name = mobj.name;

					if (j == fc - 1)
					{
						mobj.size = Number(data[i][dcol].code || 0);
					}
					else
					{
						mobj.children = [];
					}
				}
			}
		}

		// Stash the old values for transition.
		function stash(d) {
			d.x0 = d.x;
			d.dx0 = d.dx;
		}

		// Interpolate the arcs in data space.
		function arcTween(a) {
			var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
			return function(t) {
				var b = i(t);
				a.x0 = b.x;
				a.dx0 = b.dx;
				return arc(b);
			};
		}

		me.vis = d3.select(me.container).append("svg:svg")
			.attr("width", mw)
			.attr("height", mh)
			.append("svg:g")
			.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

		var partition = d3.layout.partition()
			.sort(null)
			.size([2 * Math.PI, r * r])
			.value(function(d) { return d.size; });

		var arc = d3.svg.arc()
			.startAngle(function(d) { return d.x; })
			.endAngle(function(d) { return d.x + d.dx; })
			.innerRadius(function(d) { return Math.sqrt(d.y); })
			.outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });


		var path = me.vis.data([sundata]).selectAll("g")
			.data(partition.nodes)
			.enter().append("svg:g")
			.attr("display", function(d) { return d.depth ? null : "none"; }); // hide inner ring

		path.append("svg:path")
			.attr("d", arc)
			.attr("fill-rule", "evenodd")
			.style("stroke", "#fff")
			.style("fill", function(d) { return color((d.children ? d : d.parent).name); })
			.each(stash);

		path.append("svg:text")
			.attr("transform", function(d) { return "rotate(" + (d.x + d.dx / 2 - Math.PI / 2) / Math.PI * 180 + ")"; })
			.attr("x", function(d) { return Math.sqrt(d.y); })
			.attr("dx", "6") //margin
			.attr("dy", ".35em") // vertical-align
			.text(function(d) {return d.name; });

		d3.select("#size").on("click", function() {
			path
			 	.data(partition.value(function(d) { return d.size; }))
				.transition()
				.duration(1500)
				.attrTween("d", arcTween);

			d3.select("#size").classed("active", true);
			d3.select("#count").classed("active", false);
		});

		d3.select("#count").on("click", function() {
			path
				.data(partition.value(function(d) { return 1; }))
				.transition()
			 	.duration(1500)
			 	.attrTween("d", arcTween);

			d3.select("#size").classed("active", false);
			d3.select("#count").classed("active", true);
		});

		break;
	}
};


IG$/*mainapp*/._I95/*olapChartView*/.prototype.JJ$4a/*drawD3CustomChart*/ = function(rct/*rendercharttype*/, mresult) {
	var b,
		me = this;

	me.drawmode = "dcust";
	me.mresult = mresult;
	me.rct/*rendercharttype*/ = rct/*rendercharttype*/;

	var jdom = $(me.container),
		w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom),
	    h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom);

	switch (rct/*rendercharttype*/)
	{
	case "bullet":
		b = new IG$/*mainapp*/._ICa/*BulletChart*/($(me.container));
		b.i2/*loadData*/.call(b, me.mresult);
		me.dcust = b;
		break;
	case "nation":
		b = new IG$/*mainapp*/.qiNul/*NationChart*/($(me.container), me._ILb/*sheetoption*/, me.cop);
		b.i2/*loadData*/.call(b, me.mresult);
		me.dcust = b;
		break;
	}
};

IG$/*mainapp*/._I95/*olapChartView*/.prototype.JJ$1/*getRelationData*/ = function(mresult, positive, adjnegvalue, relationgroups, range) {
	var me = this,
		i, j,
		data = mresult.data,
		fc = mresult.colfix,
		fr = mresult.rowfix,
		title,
		row,
		tn,
		dp = [],
		a, b,
		len, item,
		matrixdata = {nodes: [], links: []},
		cvalue,
		relationgroups = (relationgroups) ? relationgroups.split(",") : null;

	for (i=fc; i < data[0].length; i++)
	{
		title = "";

		for (j=0; j < fr; j++)
		{
			title = (j==0 ? data[j][i].text : title + IG$/*mainapp*/.sX/*seperator*/ + data[j][i].text);
		}
		matrixdata.nodes.push({nodeName: title, group: (relationgroups && relationgroups.length > i - fc && relationgroups[i - fc] != "") ? parseInt(relationgroups[i - fc]) : i});
	}

	len = matrixdata.nodes.length;

	for (i=fr; i < data.length; i++)
	{
		row = [];
		for (j=fc; j < data[i].length; j++)
		{
			tn = Number(data[i][j].code) || 0;
			row.push(tn);
		}
		dp.push(row);
	}

	for (a = 0; a < len; a++)
    {
        for (b = 0; b < a + 1;  b++)
        {
            if(a != b)
            {
            	item = {source: a, target: b};
            	cvalue = me.JJ$2/*correlationCoefficent*/.call(me, dp, a, b);

            	if (range.s <= cvalue && cvalue <= range.t)
            	{
	                item.value = cvalue;
	                item.value = (adjnegvalue == true) ? (cvalue + 1) * 10 : cvalue * 10;
	                if (positive == 1)
	                {
	                	if (cvalue > 0)
	                	{
	                		matrixdata.links.push(item);
	                	}
	                }
	                else if (positive == 0)
	                {
	                	if (cvalue < 0)
	                	{
	                		matrixdata.links.push(item);
	                	}
	                }
	                else
	                {
	                	matrixdata.links.push(item);
	                }
	            }
            }
        }
    }

	return matrixdata;
};

IG$/*mainapp*/._I95/*olapChartView*/.prototype.JJ$2/*correlationCoefficent*/ = function(collection, a, b) {
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
        var xValue = o[a];
        var yValue = o[b];
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
};

IG$/*mainapp*/._I95/*olapChartView*/.prototype.JJ$3/*drawMatrixChart*/ = function(mresult) {
	var i,
		j,
		data = mresult.data,
		fc = mresult.colfix,
		fr = mresult.rowfix,
		title,
		fields = [],
		matrixdata = [],
		row,
		tn,
		me = this;

	me.drawmode = "qavis";

	for (i=fc; i < data[0].length; i++)
	{
		title = "";

		for (j=0; j < fr; j++)
		{
			title = (j==0 ? data[j][i].text : title + IG$/*mainapp*/.sX/*seperator*/ + data[j][i].text);
		}
		fields.push(title);
	}

	for (i=fr; i < data.length; i++)
	{
		row = [];
		for (j=fc; j < data[i].length; j++)
		{
			tn = Number(data[i][j].code);
			row.push(tn);
		}
		matrixdata.push(row);
	}

	me.qavis = new IG$/*mainapp*/.c$s22/*ComparisionMatrix*/(me.container, {
		cr1: me.cop.comp_range0,
		cr2: me.cop.comp_range1
	});
	me.qavis.m1$5/*dataProvider*/ = matrixdata;
	me.qavis.fields = fields;
	me.qavis.c10/*commitProperty*/();
};

IG$/*mainapp*/._I95/*olapChartView*/.prototype.centroid = function(pts) {
   var nPts = pts.length;
   var lng=0; var lat=0;
   var f;
   var j=nPts-1;
   var p1; var p2;

   for (var i=0;i<nPts;j=i++) {
      p1=pts[i]; p2=pts[j];
      f=p1.lng*p2.lat-p2.lng*p1.lat;
      lng+=(p1.lng+p2.lng)*f;
      lat+=(p1.lat+p2.lat)*f;
   }

   f=this.area(pts)*6;
   return {lng:lng/f, lat:lat/f};
};

IG$/*mainapp*/._I95/*olapChartView*/.prototype.l3/*drawMapChart*/ = function(mresult) {
	var latlng,
		mapid,
		geomaptype = "d3ext",
		me = this;

	if (geomaptype == "google")
	{
		mapid = "map__US"
		if (typeof(IG$/*mainapp*/._I5f/*geoDatas*/[mapid]) == "undefined")
		{
			me.l2/*loadMapData*/("US", "", mapid, "ploc", me);
			return;
		}

		var mapdata = IG$/*mainapp*/._I5f/*geoDatas*/[mapid];

		latlng = new google.maps.LatLng(37.09024, -95.712891);

		var myOptions = {
	      zoom: 4,
	      center: latlng,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    };

	    var map = new google.maps.Map(me.container, myOptions);

		if (typeof(mapdata) != "undefined")
		{
			var i,
				j,
				radmax = 180000,
				radmin = 3000;

			var mdata = {};
			var tmax = NaN;
			var tmin = NaN;

    		for (i=mresult.rowfix; i < mresult.data.length; i++)
    		{
    			var mcode = mresult.data[i][0].text;

    			if (typeof(mapdata.data[mcode]) != "undefined")
    			{
    				var svalue = 0;
    				var mvalue;
    				for (j=mresult.colfix; j < mresult.cols; j++)
    				{
    					mvalue = mresult.data[i][j].code;
    					svalue += Number(mvalue);
    				}

    				if (typeof(mdata[mcode]) == "undefined")
    				{
    					mdata[mcode] = {};
    					mdata[mcode].lat = mapdata.data[mcode].lat;
    					mdata[mcode].lng = mapdata.data[mcode].lng;

    					mdata[mcode].value = svalue;

    					tmax = (isNaN(tmax) == true) ? svalue : Math.max(tmax, svalue);
    					tmin = (isNaN(tmin) == true) ? svalue : Math.min(tmin, svalue);
    				}
    				else
    				{
    					mdata[mcode].value += svalue;
    					tmax = Math.max(tmax, mdata[mcode].value);
    					tmin = Math.min(tmin, mdata[mcode].value);
    				}
    			}
    		}

    		for (var key in mdata)
    		{
    			latlng = new google.maps.LatLng(mdata[key].lat, mdata[key].lng);
    			var depth = (tmax - tmin == 0) ? 1 : ((mdata[key].value - tmin) / (tmax - tmin));
    			var cradius = (radmax - radmin) * depth;
    			var ccolor = IG$/*mainapp*/._I15/*interpolateColor*/("153a6f", "a7d6ef", 10, depth * 10);
    			var circleOption = {
    				center: latlng,
    				radius: cradius,
    				strokeColor: "#efefef",
			    	strokeOpacity: .5,
			    	strokeWeight: 1,
			    	fillColor: ccolor,
			    	fillOpacity: .6
    			};

    			var circle = new google.maps.Circle(circleOption);
    			circle.setMap(map);
    		}
    	}
	}
	else if (geomaptype == "protovis")
	{
		me.l4/*drawProtoVisMapChart*/(mresult);
	}
	else if (geomaptype == "d3")
	{
		me.l5/*drawD3MapChart*/(mresult);
	}
	else if (geomaptype == "gsapi")
	{
		// google.load("visualization", "1", {packages: ["geochart"]});
		// google.setOnLoadCallback(me.drawGSAPIMapChart);
		me.l6/*drawGSAPIMapChart*/();
	}
	else if (geomaptype == "d3ext")
	{
		me.l5a/*drawD3ExtMapChart*/(mresult);
	}
};

IG$/*mainapp*/._I95/*olapChartView*/.prototype.l4/*drawProtoVisMapChart*/ = function(mresult) {
	var me = this;
	var col = function(v) {
	  if (v < 17) return "#008038";
	  if (v < 20) return "#A3D396";
	  if (v < 23) return "#FDD2AA";
	  if (v < 26) return "#F7976B";
	  if (v < 29) return "#F26123";
	  if (v < 32) return "#E12816";
	  return "#B7161E";
	};

	us_lowres.forEach(function(c) {
	  c.code = c.code.toUpperCase();
	  c.centLatLon = me.centroid(c.borders[0]);
	});

	var us_stats = [];

	for (i=mresult.rowfix; i < mresult.data.length; i++)
	{
		var mcode = mresult.data[i][0].text;
		var svalue = 0;
		var mvalue;
		for (j=mresult.colfix; j < mresult.cols; j++)
		{
			mvalue = mresult.data[i][j].code;
			svalue += Number(mvalue);
		}
		us_stats[mcode] = svalue;
	}

	// Add the main panel
	var jdom = $(me.container),
		w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(jdom),
		h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(jdom);

	var scale = pv.Geo.scale()
    	.domain({lng: -128, lat: 24}, {lng: -64, lat: 50})
    	.range({x: 0, y: 0}, {x: w, y: h});

    me.vismargin = {top: 30, bottom: 20}
	me.vis = new pv.Panel()
		.canvas(me.container)
	    .width(w)
	    .height(h - me.vismargin.top - me.vismargin.bottom)
	    .top(30)
	    .bottom(20);

	// Add the ticks and labels for the year slider
	/*
	me.vis.add(pv.Rule)
	    .data(pv.range(us_stats.minYear, us_stats.maxYear + .1))
	    .left(yearsScale)
	    .height(4)
	    .top(-20)
	  .anchor("bottom").add(pv.Label);
	*/
	// Add a panel for each state
	var state = me.vis.add(pv.Panel)
	    .data(us_lowres);

	// Add a panel for each state land mass
	state.add(pv.Panel)
	    .data(function(c) {return c.borders})
	  .add(pv.Line)
	    .data(function(l) {return l})
	    .left(scale.x)
	    .top(scale.y)
	    .fillStyle(function(d, l, c) {return col(us_stats[c.code])})
	    .lineWidth(1)
	    .strokeStyle("white")
	    .antialias(false);

	// Add a label with the state code in the middle of every state
	me.vis.add(pv.Label)
	    .data(us_lowres)
	    .left(function(c) {return scale(c.centLatLon).x})
	    .top(function(c) {return scale(c.centLatLon).y})
	    .text(function(c) {return c.code})
	    .textAlign("center")
	    .textBaseline("middle");

	// Add the color bars for the color legend
	me.vis.add(pv.Bar)
	    .data(pv.range(14, 32.1, 3))
	    .bottom(function(d) {return this.index * 12})
	    .height(10)
	    .width(10)
	    .left(5)
	    .fillStyle(function(d) {return col(14 + 3 * this.index)})
	    .lineWidth(null)
	  .anchor("right").add(pv.Label)
	    .textAlign("left")
	    .text(function(d) {return d + " - " + (d + 3) + "%"});

	me.vis.render();
};

IG$/*mainapp*/._I95/*olapChartView*/.prototype.l5/*drawD3MapChart*/ = function(mresult) {
	var me = this;
	var col = function(v) {
	  if (v < 17) return "#008038";
	  if (v < 20) return "#A3D396";
	  if (v < 23) return "#FDD2AA";
	  if (v < 26) return "#F7976B";
	  if (v < 29) return "#F26123";
	  if (v < 32) return "#E12816";
	  return "#B7161E";
	};

	var path = d3.geo.path();

	var svg = d3.select(me.container)
	  .append("svg");

	var counties = svg.append("g")
	    .attr("id", "counties")
	    .attr("class", "Blues");

	var states = svg.append("g")
	    .attr("id", "states");

	d3.json("./data/us-counties.json", function(json) {
	  counties.selectAll("path")
	      .data(json.features)
	    .enter().append("path")
	      .attr("class", data ? quantize : null)
	      .attr("d", path);
	});

	d3.json("./data/us-states.json", function(json) {
	  states.selectAll("path")
	      .data(json.features)
	    .enter().append("path")
	      .attr("d", path);
	});

	var us_stats = [];

	for (i=mresult.rowfix; i < mresult.data.length; i++)
	{
		var mcode = mresult.data[i][0].text;
		var svalue = 0;
		var mvalue;
		for (j=mresult.colfix; j < mresult.cols; j++)
		{
			mvalue = mresult.data[i][j].code;
			svalue += Number(mvalue);
		}
		us_stats[mcode] = svalue;
	}

  	counties.selectAll("path")
      .attr("class", quantize);

	function quantize(d) {
	  return "q" + Math.min(8, ~~(us_stats[d.id] * 9 / 12)) + "-9";
	}
};

IG$/*mainapp*/._I95/*olapChartView*/.prototype.l5a/*drawD3ExtMapChart*/ = function() {
	var me = this,
		url, i, j, cell, row,
		mresult = me.mresult,
		fc = mresult.colfix,
		fr = mresult.rowfix,
		data = mresult.data,
		tc = (data.length > 0) ? data[0].length : 0,
		container = me.container,
		cop = me.cop,
		sop = me._ILb/*sheetoption*/,
		mapcategory = cop.mapcategory,
		categindex = -1,
		mapdata = (IG$/*mainapp*/.mLU ? IG$/*mainapp*/.mLU.maptype : null),
		mapinfo = null,
		mapdp = {},
		dimname, n, c,
		mapelement,
		name,
		mapseries = [],
		col = function(v) {
		  if (v < 17) return "#008038";
		  if (v < 20) return "#A3D396";
		  if (v < 23) return "#FDD2AA";
		  if (v < 26) return "#F7976B";
		  if (v < 29) return "#F26123";
		  if (v < 32) return "#E12816";
		  return "#B7161E";
		};

	if (mapdata)
	{
		for (i=0; i < mapdata.length; i++)
		{
			if (mapdata[i].subtype == cop.maptype)
			{
				mapinfo = mapdata[i];
				break;
			}
		}
	}

	if (sop)
	{
		for (i=0; i < sop.rows.length; i++)
		{
			if (sop.rows[i].uid == mapcategory)
			{
				categindex = i;
				break;
			}
		}
		if (categindex < 0 && sop.rows.length > 0)
		{
			categindex = 0;
		}
	}

	if (mapinfo == null)
	{
		return;
	}

	for (i=fc; i < tc; i++)
	{
		name = "";

		for (j=0; j < fr; j++)
		{
			cell = data[j][i];
			name += (cell.text || cell.code) + IG$/*mainapp*/.sX/*seperator*/;
		}

		mapseries.push({
			cindex: i,
			c: i-fc,
			name: name,
			maxvalue: null,
			minvalue: null,
			sumvalue: 0
		});
	}

	for (i=fr; i < data.length; i++)
	{
		dimname = ((categindex > -1) ? data[i][categindex].code : "NO_REGION");
		dimname = dimname ? dimname.toLowerCase() : "";

		if (mapdp[dimname])
		{
			mapelement = mapdp[dimname];
		}
		else
		{
			mapdp[dimname] = mapelement = [];
			for (j=0; j < mapseries.length; j++)
			{
				mapelement.push(0);
			}
		}

		for (j=fc; j < tc; j++)
		{
			c = j - fc;
			cell = data[i][j];
			n = (cell.code && cell.code != "") ? parseFloat(cell.code) : 0;
			mapelement[c] += n;
			mapseries[c].maxvalue = (mapseries[c].maxvalue == null) ? mapelement[c] : Math.max(mapseries[c].maxvalue, mapelement[c]);
			mapseries[c].minvalue = (mapseries[c].minvalue == null) ? mapelement[c] : Math.min(mapseries[c].minvalue, mapelement[c]);
			mapseries[c].sumvalue += n;
		}
	}

	url = "./data/" + mapinfo.filename;

	var callback = function(json) {
			var canvas = $(container),
				map = new gJ/*geomap*/(canvas);
			/*
			map1.drawMap.call(map1, world_countries, {
				mode: "azimuthal",
				scale: 200,
				azmode: "stereographic"
			});
			*/
			map.color = col;
			map.clickHandler = {
				o: me,
				f: function(data) {
					var sender = {
							name: map.mapseries[map.legidx || 0].name
						},
						param = {
							point: {
								category: data.value
							}
						};
					if (sender.name.charAt(sender.name.length-1) == ' ')
					{
						sender.name = sender.name.substring(0, sender.name.length - 1);
					}
					// seriesname = (sender.series) ? sender.series.name : sender.name,
					// categname = (param.point) ? param.point.category || param.point.name : "",
					me.p1/*processClickEvent*/.call(me, sender, param);
				}
			};
			map.drawMap.call(map, json, {
				scale: mapinfo.scale,
				maptype: mapinfo.subtype,
				mapseries: mapseries,
				mapdp: mapdp
			});
		};

		// eventowner.p1/*processClickEvent*/.call(eventowner, this, param);

	$.getJSON(url, callback)
};

IG$/*mainapp*/._I95/*olapChartView*/.prototype.l6/*drawGSAPIMapChart*/ = function() {
	var me = this,
		container = me.container,
		geochart = new google.visualization.GeoChart(container),
		options= {region: "840"},
		data = new google.visualization.DataTable();
	data.addColumn("string", "State");
	data.addColumn("number", "Data");
	geochart.draw(data, options);
};


IG$/*mainapp*/._I95/*olapChartView*/.prototype.l3a/*drawTreeMapChart*/ = function(mresult) {
	var me = this,
		i,
		j,
		data = mresult.data,
		fc = mresult.colfix,
		fr = mresult.rowfix,
		mcr = me._ILb/*sheetoption*/.cco/*chartOption*/,
		tm_l_cl = mcr.tm_l_cl,
		cols = (mresult.data.length > 0 ? mresult.data[0].length : 0),
		points = [],
		colmap = [],
		row,
		headers = [],
		h,
		pt,
		ppt,
		copt = {},
		cdoc,
		dval,
		container = $(me.container),
		treemap = {
			ty: 0
		},
		colors,
		ccnt = 0;

	container.empty();
	
	if (IG$/*mainapp*/.__c_/*chartoption*/ && IG$/*mainapp*/.__c_/*chartoption*/.chartcolors && IG$/*mainapp*/.__c_/*chartoption*/.chartcolors[mcr.colorset])
	{
		colors =  IG$/*mainapp*/.__c_/*chartoption*/.chartcolors[mcr.colorset];
	}
	else
	{
		colors = Highcharts.getOptions().colors;
	}

	for (i=0; i < fc; i++)
	{
		colmap.push({
			value: null,
			seq: 0,
			point: null
		});
	}

	for (i=fc; i < cols; i++)
	{
		h = "";
		for (j=0; j < fr; j++)
		{
			h = (j == 0) ? data[j][i].text : h + IG$/*mainapp*/.sX/*seperator*/ + data[j][i].text;
		}
		headers.push({
			name: h,
			selected: (i - fc == me.ti ? true : false)
		});
	}

	if (headers && headers.length > 1)
	{
		cdoc = $("<div class='mtreemap-caption'></div>");
		container.append(cdoc);
		// for (i=0; i < headers.length; i++)
		$.each(headers, function(i, dobj) {
			$("<input type='radio' name='category' value='" + i + "'>" + dobj.name + "&nbsp;&nbsp;&nbsp;&nbsp;</input>")
				.prop("checked", dobj.selected)
				.appendTo(cdoc)
				.bind("change", function(ev) {
					me.ti = i;
					me.l3a/*drawTreeMapChart*/.call(me, me.mresult);
				});
		});

		treemap.ty = cdoc.height();
	}

	for (i=fr; i < data.length; i++)
	{
		row = data[i];

		for (j=0; j < fc; j++)
		{
			val = row[j].text;
			if (colmap[j].value != val)
			{
				if (j == 0)
				{
					pt = {
						id: "id_" + colmap[j].seq,
						name: val,
						// color: Highcharts.getOptions().colors[colmap[j].seq],
						value: 0
					};
					
					if (tm_l_cl)
					{
						pt.colorValue = 0;
					}
					else
					{
						pt.color = colors[ccnt % colors.length];
					}
					colmap[j].seq++;
					colmap[j].point = pt;
					points.push(pt);
					ccnt++;
				}
				else
				{
					ppt = colmap[j-1].point;
					pt = {
						id: ppt.id + "_" + colmap[j].seq,
						name: val,
						parent: ppt.id,
						value: 0
					};
					
					if (tm_l_cl)
					{
						pt.colorValue = 0;
					}
					colmap[j].seq++;
					colmap[j].point = pt;
					points.push(pt);
				}
			}
			colmap[j].value = val;
			
			if (tm_l_cl)
			{
				colmap[j].colorValue = val;
			}
		}

		if (row.length > me.ti + fc)
		{
			dval = row[me.ti + fc];
			ppt = colmap[fc - 1].point;
			pt = {
				id: ppt.id + "_" + (me.ti + fc),
				name: headers[me.ti].name,
				parent: ppt.id,
				value: Number(dval.code)
			};
			
			if (tm_l_cl)
			{
				pt.colorValue = Number(dval.code);
			}

			points.push(pt);

			for (k=0; k < colmap.length; k++)
			{
				val = Number(dval.code);
				if (val)
				{
					colmap[k].point.value += val;
					
					if (tm_l_cl)
					{
						colmap[k].point.colorValue = colmap[k].point.value;
					}
				}
			}
		}
	}

	var w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container),
		h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container),
		coption = new Object();

	me.drawmode = "treemap";

	treemap.box = $("<div></div>").appendTo(container);
	treemap.box.css({
		position: "absolute",
		width: w,
		height: h - treemap.ty,
		top: treemap.ty,
		left: 0
	});

	coption.chart = {
		animation: false,
		renderTo: treemap.box[0],
		reflow: false,
		alignTicks: true,
		borderWidth: 0
	};
	
	coption.colors = colors;

	if (mcr.showtitle == true)
	{
		var tvalue = mcr.title || "";

		coption.title = {text: tvalue};

		switch (mcr.titleposition)
		{
		case "BOTTOM_LEFT":
			coption.title.align = "left";
			// coption.title.verticalAlign = "bottom";
			coption.title.floating = true;
			coption.chart.marginBottom  = 50;
			coption.title.y = h - 20;
			break;
		case "BOTTOM_CENTER":
			coption.title.align = "center";
			// coption.title.verticalAlign = "bottom";
			coption.title.floating = true;
			coption.chart.marginBottom  = 50;
			coption.title.y = h - 20;
			break;
		case "BOTTOM_RIGHT":
			coption.title.align = "right";
			// coption.title.verticalAlign = "bottom";
			coption.title.floating = true;
			coption.chart.marginBottom  = 50;
			coption.title.y = h - 20;
			break;
		case "TOP_LEFT":
			coption.title.align = "left";
			coption.title.verticalAlign = "top";
			break;
		case "TOP_CENTER":
			// coption.title.align = "center";
			// coption.title.verticalAlign = "top";
			break;
		case "TOP_RIGHT":
			coption.title.align = "right";
			coption.title.verticalAlign = "top";
			break;
		}
	}
	else
	{
		coption.title = {text: ""};
	}
	
	if (tm_l_cl)
	{
		coption.colorAxis = {
	        minColor: '#FFFFFF',
	        maxColor: Highcharts.getOptions().colors[0]
	    };
	}

	coption.series = [
	    {
	    	type: "treemap",
	    	layoutAlgorithm: mcr.tm_l_alg || "squarified",
	    	allowDrillToNode: true,
			dataLabels: {
				enabled: false
			},
			levelIsConstant: false,
			levels: [
			    {
			    	level: 1,
			    	colorByPoint: false,
			    	dataLabels: {
			    		enabled: true
			    	},
			    	borderWidth: 2
			    }
			],
            drillUpButton: {
            	text: "< " + IRm$/*resources*/.r1("B_BACK"),
                relativeTo: 'plotBox',
                position: {
                    y: 0,
                    x: 0
                }
            },
			data: points
	    }
	];

	treemap.map = new Highcharts.Chart(coption);

	me.treemap = treemap;
}


