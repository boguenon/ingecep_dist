<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
    request.setCharacterEncoding("utf-8");
    String _d = request.getParameter("_d");
    String ukey = "?_d=" + _d;
    String lang = request.getParameter("lang");
    lang = (lang == null) ? "en_US" : lang;
    
    String mts = request.getParameter("mts");
    mts = (mts == null) ? "" : mts;
    
    String objid = request.getParameter("objid");
    objid = (objid == null) ? "" : objid;
    
    // theme related variable
    String igc_theme = request.getParameter("igc_theme");
    igc_theme = (igc_theme != null && "".equals(igc_theme) == true) ? null : igc_theme;
    String igc_theme_name = null;
    if (igc_theme != null)
    {
    	igc_theme_name = igc_theme.toLowerCase().replaceAll(" ", "");
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>MPLIX</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
<!--[if lt IE 9]>
    <meta name="svg.render.forceflash" content="true">
<![endif]-->
	<link rel="stylesheet" type="text/css" href="./css/ui-lightness/jquery-ui-1.10.4.custom.css" />
    <link rel="stylesheet" type="text/css" href="./css/prettify.css" />
    
    <link rel="stylesheet" type="text/css" href="./css/igcca2.css" />
<style>
body {
	overflow: hidden;
}

#report_1 {
	position: absolute;
	top: 0px;
	left: 0px;
	bottom: 0px;
	width: 100%;
	height: 100%;
}
</style>
    <!-- link rel="stylesheet" type="text/css" href="./fonts/hangul_nanum.css" / -->
    <!-- link rel="stylesheet" type="text/css" href="./css/customer.css" / -->
<%
	if (igc_theme != null)
	{
		out.println("<link rel=\"stylesheet\" type=\"text/css\" href=\"./css/theme_" + igc_theme_name + ".css\" />");
	}
%>

	<!-- link rel="stylesheet" href="https://js.arcgis.com/3.15/esri/css/esri.css" / -->
    
<script type="text/javascript" src="../mplix.js"></script>
<script type="text/javascript">
var useLocale = "<%=lang%>";
var m$mts = "<%=mts%>";
var m$_d = "";

function getLocale()
{
	var hash = window.location.hash.substring(1).split('&'),
		i, k, v, m;
	
	for (i=0; i < hash.length; i++)
	{
		m = hash[i].indexOf("=");
		if (m > 0)
		{
			k = hash[i].substring(0, m);
			v = hash[i].substring(m+1);
			
			if (k == "lang" && v)
			{
				useLocale = v;
				break;
			}
		}
	}
}

getLocale();

<%
	if (igc_theme != null)
	{
		out.println("ig$.theme_id=\"" + igc_theme + "\";");
	}
%>

</script>

<script type="text/javascript" src="./js/jquery-1.12.0.min.js"></script>
<script type="text/javascript" src="./js/browser.min.js"></script>
<script type="text/javascript" src="./js/jquery-ui-1.10.4.custom.min.js"></script>
<script type="text/javascript" src="./js/jquery.contextMenu.js"></script>
<script type="text/javascript" src="./js/highstock.js"></script>
<script type="text/javascript" src="./js/highcharts-3d.js"></script>
<script type="text/javascript" src="./js/highcharts-more.js"></script>
<script type="text/javascript" src="./js/highcharts.theme.js"></script>
<script type="text/javascript" src="./js/highcharts.exporting.js"></script>

<script type="text/javascript" src="./js/jquery.sparkline.js"></script>
<script type="text/javascript" src="./js/jit.js"></script>
<script type="text/javascript" src="./js/superfish.js"></script>
<script type="text/javascript" src="./js/raphael.js"></script>
<script type="text/javascript" src="./js/g.raphael.js"></script>
<script type="text/javascript" src="./js/g.dot.js"></script>

<!--[if ! lt IE 9]><!-->
<script type="text/javascript" src="./js/d3.js"></script>
<!--<![endif]-->

<!--[if lt IE 9]>
<script type="text/javascript">
var d3 = {};
</script>
<![endif]-->

<!--[if lt IE 9]>
<script type="text/javascript" src="./js/svg.js" data-path="./js/"></script>
<![endif]-->

<!-- for us map -->
<!--[if lt IE 9]>
<script type="text/javascript" src="./js/protovis-d3.3.js"></script>
<![endif]-->
<!--[if ! lt IE 9]><!-->
<script type="text/javascript" src="./js/protovis-d3.2.js"></script>
<!--<![endif]-->

<!--[if lt IE 9]>
<script type="text/javascript" src="./js/excanvas.js"></script>
<![endif]-->
<script type="text/javascript" src="./js/jquery.easypiechart.js"></script>
<script type="text/javascript" src="./js/ace.js"></script>

<script type="text/javascript" src="./js/igc8.js"></script>
<script type="text/javascript" src="./js/igc4a.js"></script>
<script type="text/javascript" src="./js/igc4b.js"></script>
<script type="text/javascript" src="./js/igc4c.js"></script>
<script type="text/javascript" src="./js/igc4d.js"></script>

<script type="text/javascript" src="./custom/ig_pgloader.js"></script>
<!-- script type="text/javascript" src="./js/igc9.js"></script -->
<!-- dynamically loaded when triggered -->
<!-- script type="text/javascript" src="./js/igcm.js"></script -->
<!-- script type="text/javascript" src="./js/igcn.js"></script -->
<!-- script type="text/javascript" src="./js/igc6.js"></script -->
<!-- script type="text/javascript" src="./js/igco.js"></script -->
<!-- end of dynamically loaded when triggered -->
<!-- script type="text/javascript" src="./js/igc9.js"></script -->

<script type="text/javascript">

IG$/*mainapp*/.__ep_ = "sys_noframe";
IG$/*mainapp*/.__ep_l = "<%=objid%>";

var _report_prompt = [];
<%
String param_names = request.getParameter("param_names");
String[] params = (param_names != null) ? param_names.split(";") : null;
java.util.Map<String, String> param_map = new java.util.HashMap<String, String>();
if (params != null)
{
    for (int i=0; i < params.length; i++)
    {
        String pname = params[i];
        String pvalue = request.getParameter(pname);
        
        if (pvalue != null && pvalue.equals("") == false)
        {
        	param_map.put(pname, pvalue);
        
        	out.println("_report_prompt.push({name: \"" + pname + "\", values: [{code: \"" + pvalue + "\", value: \"" + pvalue + "\"}]});\n");
        }
    }
} 
%>

function loadParameter(param) {
	// initialize parameters
	window._report_prompt = [];
	var i;
	for (i=0; i < param._report_prompt.length; i++)
	{
		window._report_prompt.push(param._report_prompt[i]);
	}
	
	if (window.__rpt)
	{
		window.__rpt._t$.call(window.__rpt, "cmd_run");
	}
}

function loadReport(muid, param, mtype) {
	IG$._n2(muid, mtype || "report", null, false);
}

IG$.$1 = function(tmpl, mopt) {
	setTimeout(function(){
        $("#loading").fadeOut({remove:true});
        $('#loading-mask').fadeOut({remove:true});
        
        var report_1 = $("#report_1"),
        	w_1 = report_1.width(),
        	h_1 = report_1.height(),
        	mp,
        	muid = "<%=objid%>";
        
        mp = new IG$/*mainapp*/.pb({
	    	xtype: "panel",
	    	layout: "card",
	    	renderTo: report_1[0],
	    	m1$7/*navigateApp*/: function(uid, type, name, node, read, write, opt, popt) {
	    		IG$._n2(uid, type, opt, false);
	    	}
	    });
	    
	    mp.setSize(w_1, h_1);
	    
	    window.__mp = mp;
	    IG$/*mainapp*/._I7d/*mainPanel*/ = mp;
	    
	    if (muid || mopt)
	    {
	    	IG$._n2(muid, "report", mopt, false);
	    }
    }, 10);
};

IG$._I8b = function() {
	var lform = $('#loginWindow');
	lform.hide();
}

IG$["showLoginProc"] = IG$._I8b;

function _btn_handler(view, key) {
	if (key == "custom1")
	{
		IG$._n2("013138da-01f4ab0a", "report", null, false);
	}
	else if (key == "custom2")
	{
		IG$._n2("<%=objid%>", "report", null, false);
	}
}
</script>

<!-- script type="text/javascript" src="https://js.arcgis.com/3.15/"></script -->

<script type="text/javascript" src="./custom/customdatahandler.js"></script>
<script type="text/javascript" src="./custom/custom.chart.options.js"></script>
<script type="text/javascript" src="./custom/custom.hstock.js"></script>
<script type="text/javascript" src="./custom/custom.heatmap.js"></script>
<script type="text/javascript" src="./custom/custom.kpi.js"></script>
<script type="text/javascript" src="./custom/custom.sankey.js"></script>
<script type="text/javascript" src="./custom/custom.imageviewer.js"></script>
<!-- script type="text/javascript" src="./custom/custom.map.esri.js"></script -->

<!-- script type="text/javascript" src="./custom/custom.export.jasper.js"></script -->

<!-- script type="text/javascript" src="http://sgis.kostat.go.kr/OpenAPI2/resource/js/OpenLayers.js"></script>
<script type="text/javascript" src="http://sgis.kostat.go.kr/OpenAPI2/getMapControl.do?apikey=ESGA2013100216229470"></script>
<script type="text/javascript" src="http://openapi.map.naver.com/openapi/naverMap.naver?ver=2.0&key=87c2769e8274549f344934253d0004d6"></script>
<script type="text/javascript" src="http://apis.daum.net/maps/maps3.js?apikey=e09ae80c0d927b74dba49a6106ef0eedb95fe2b8" charset="utf-8"></script> -->

<!-- script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?&sensor=false"></script -->
</head>
<body scroll="no">
	<div id="loading-mask" style=""></div>
	<!-- div id="loading">
  		<div class="loading-indicator"><img src="./images/extanim32.gif" width="32" height="32" style="margin-right:8px;" align="absmiddle"/>Loading...</div>
	</div -->
	
	<div id="loading">
		<div class="cmsg">
			<div class="msg">Loading MPLIX</div>
			<div class="lpb">
				<div id="lpt" style="width: 10%;"></div>
			</div>
		</div>
	</div>

 	<div id="mainview"></div>
 	<div id="report_1"></div>
 	
 	<div id="igc_msr" class="igc-popup-main" style="display:none;">
 		<div class="igc-popup-bg"></div>
 		<div id="igc_msr_s" class="igc_msr_box">
 			<table width="100%">
 				<tr>
 					<td><div class="igc-msr-title">Sharing Setting</div></td>
 				</tr>
 				<tr>
 					<td><div class="igc-msr-fl">Link to share</div></td>
 				</tr>
 				<tr>
 					<td><div class="igc-msr-inp"><input type="text" id="m_lnk"></input></div></td>
 				</tr>
 				<tr>
 					<td><div class="igc-msr-fl">People</div></td>
 				</tr>
 				<tr>
 					<td><div class="igc-msr-inp"><input id="m_em" type="text" placeholder="Enter names or email addresses..."></input></div></td>
 				</tr>
 				<tr>
 					<td><div class="igc-msr-inp"><textarea id="m_msg" placeholder="Messages..." style="height: 80px"></textarea></div></td>
 				</tr>
 				<tr>
 					<td><div style="height: 14px;"></div></td>
 				</tr>
 				<tr>
 					<td style="textalign:right;"><div class="igc-msr-btn" id="m_done">DONE</div><div class="igc-msr-btn" id="m_close" style="display: none;">CLOSE</div></td>
 				</tr>
 			</table>
 		</div>
 	</div>
</body>
</html>
