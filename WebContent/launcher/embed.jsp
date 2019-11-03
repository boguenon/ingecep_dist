<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
    request.setCharacterEncoding("utf-8");
    
    String ukey = "";
%>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>MPLIX</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="stylesheet" type="text/css" href="./css/embed.css" />

<script type="text/javascript" src="./js/jquery-1.12.0.min.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/browser.min.js"></script>
    
<script type="text/javascript">
// function used to access iframe object and load another page which is already loaded
function loadPage(mtype, uid, eparam) {
	var mwindow = $("#mainIfrm")[0].contentWindow,
		btn_sel = $("#btn_sel").val(),
		param = {
			_report_prompt: [
				{
					name: "param1", 
					values: [
						{
							code: btn_sel,
							value: btn_sel
						}
					]
				}
			]
		};
	mwindow.loadReport(uid, param, mtype);
}

function _resize_monitor(e) {
	var doc = $(document),
		body = $("body"),
		bw = body.width(),
		bh = body.height();
		
	if (bw != window._mon_w || bh != window._mon_h) {
		var mainIfrm = $("#mainIfrm"),
			offset = mainIfrm.offset();
			
		mainIfrm.height(bh - offset.top).width(bw);
			
		window._mon_w = bw;
		window._mon_h = bh;
	}
}

$(document).ready(function() {
    // sub menubar background
    $("#nav > ul, #slide_menu").mouseover(function() {
        $("#slide_menu").slideDown(300);
    });
    $("#mainIfrm").mouseover(function() {
        $("#slide_menu").slideUp(500);
        $("#nav > ul > li > ul").hide();
    });
    
    // global prompt filter
    $("#btn_jsparam").bind("click", function(ev) {
		ev.stopPropagation();
		ev.preventDefault();
		
		loadPage("report", "01313881-011a69d4", {
		});
	});
	
    // show sub menubar
    $("#nav > ul > li > a").mouseover(function() {
        $("#nav > ul > li > ul").hide();
        $(this).parent("li").children("ul").show(300).siblings().children("ul").hide();
    });
    // set title & action
    $("#nav li a").click(function(event) {
    	event.preventDefault();
        event.stopPropagation();
        
    	var objid,
    		objtype = "report",
	    	m,
	    	s,
	    	mtext = $(this).text(),
	    	helpFrm = $("#helpFrm"),
			mainIfrm = $("#mainIfrm");
        
        if (mtext == 'Dashboard') {
            $("#title_area > h1").text("MPLIX DEMO");
            
            // default itemid
            objtype = "dashboard";
            objid = "f7f1c96e-54374ebc";
        } 	
        else if	($(this).attr("href") == "load_help") {
			// help content
			mainIfrm.hide();
			helpFrm.show();
		}
        else if ($(this).attr("href") != "#") {
        	m = $(this).attr("href");
        	if (m.substring(0, 5) == "objid") 
        	{
        		s = m.split("=");
        		objid = s[1];
        	}
            $("#title_area > h1").text($(this).text());
        }
        
        if (objid)
        {
        	mainIfrm.show();
			helpFrm.hide();
			
            loadPage(objtype, objid, {});
        }
    });
    
    _resize_monitor();
    
    $(window).on("resize", _resize_monitor);
});
</script>
</head>
<body scroll="no">
	<div id="slide_menu"></div>
		<div id="header"> 
			<div id="nav">
				<span class="f_left"><a href="./"><!-- img src="./images/logo.png" width="300" height="38" alt="logo"/ --></a></span>
				<ul>
					<li><a href="#">Dashboard</a></li>
					<li><a href="#">Features</a>
						<ul>
							<li><a href="objid=01349323-01480be2">Drill Through</a></li>
							<li><a href="objid=01349476-01c926a6">Sub Total</a></li>
							<li><a href="objid=01349488-01f48979">Ranking</a></li>
							<li><a href="objid=013496a8-01a48bc5">Top Sales</a></li>
						</ul>
					</li>
					<li>
						<a href="#" class="nav_lev2">DataVisual</a>
							<ul>
								<li><a href="objid=013494bd-011cbe3b">Normal Chart</a></li>
								<li><a href="objid=013497c3-01685374">Micro Chart</a></li>
								<li><a href="objid=01349724-01a91b17">Comparison</a></li>
								<li><a href="objid=013497bf-016bf226">Chart Slice</a></li>
								<li><a href="objid=0135578e-012ea066">Tree Map</a></li>
							</ul>
					</li>
					<li class="f_right"><a href="load_help">Help</a></li>
					<li style="float:right">
						<div style="margin-top:16px;margin-right:10px;">
							<span>YEAR</span>
							<select id="btn_sel">
							<option value="1997">1997</option>
							<option value="1998">1998</option>
							<option value="1999">1999</option>
							</select>
						</div>
					</li>
				</ul>
			</div>
		</div>
		
		<div id="wrap">
			<div id="content">
				<div id="title_area">
					<h1>MPLIX DASHBOARD</h1>
				</div>
				<iframe src="viewer.jsp?lang=en_US&mts=INGECEP&_d=<%=ukey%>&objid=f7f1c96e-54374ebc"
					style="overflow:hidden;" width="100%" height="100%" name="mainIfrm" id="mainIfrm"></iframe>
					
				<iframe src="./help.html" style="overflow-x:hidden;display:none;" width="100%" height="100%" id="helpFrm"></iframe>
			</div>
		</div>
</body>
</html>
