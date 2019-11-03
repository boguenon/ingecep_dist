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
	<link rel="stylesheet" type="text/css" href="./css/ui-lightness/jquery-ui-1.10.4.custom.css<%=ukey%>" />
	<link rel="stylesheet" type="text/css" href="./css/ma1.css<%=ukey%>" />
    <link rel="stylesheet" type="text/css" href="./css/prettify.css<%=ukey%>" />
    
    <link rel="stylesheet" type="text/css" href="./css/igcca.css<%=ukey%>" />
    <!-- link rel="stylesheet" type="text/css" href="./fonts/hangul_nanum.css<%=ukey%>" / -->
    <!-- link rel="stylesheet" type="text/css" href="./css/customer.css<%=ukey%>" / -->
<script type="text/javascript" src="../mplix.js<%=ukey%>"></script>
<script type="text/javascript">
var useLocale = "<%=lang%>";
var m$mts = "<%=mts%>";
var m$_d = "<%=ukey%>";

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
</script>

<script type="text/javascript" src="./js/jquery-1.12.0.min.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/browser.min.js"></script>
<script type="text/javascript" src="./js/jquery-ui-1.10.4.custom.min.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/jquery.contextMenu.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/highstock.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/highcharts-3d.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/highcharts-more.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/highcharts.theme.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/highcharts.exporting.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/modules/heatmap.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/modules/treemap.js<%=ukey%>"></script>

<script type="text/javascript" src="./js/jquery.sparkline.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/jit.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/superfish.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/raphael.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/g.raphael.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/g.dot.js<%=ukey%>"></script>

<!--[if ! lt IE 9]><!-->
<script type="text/javascript" src="./js/d3.js<%=ukey%>"></script>
<!--<![endif]-->

<!--[if lt IE 9]>
<script type="text/javascript">
var d3 = {};
</script>
<![endif]-->

<!--[if lt IE 9]>
<script type="text/javascript" src="./js/svg.js<%=ukey%>" data-path="./js/"></script>
<![endif]-->

<!-- for us map -->
<!--[if lt IE 9]>
<script type="text/javascript" src="./js/protovis-d3.3.js<%=ukey%>"></script>
<![endif]-->
<!--[if ! lt IE 9]><!-->
<script type="text/javascript" src="./js/protovis-d3.2.js<%=ukey%>"></script>
<!--<![endif]-->

<!--[if lt IE 9]>
<script type="text/javascript" src="./js/excanvas.js<%=ukey%>"></script>
<![endif]-->
<script type="text/javascript" src="./js/jquery.easypiechart.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/ace.js<%=ukey%>"></script>

<script type="text/javascript" src="./js/igc8.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/igc4.js<%=ukey%>"></script>

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
</script>

<script type="text/javascript" src="./custom/customdatahandler.js<%=ukey%>"></script>
<script type="text/javascript" src="./custom/custom.chart.options.js<%=ukey%>"></script>
<script type="text/javascript" src="./custom/custom.hstock.js<%=ukey%>"></script>

<style>
body {
	position: relative;
	overflow: auto;
}

#report_1 {
	position: relative;
	width: 800px;
	margin: 20px;
	height: 500px;
}

#report_2 {
	position: relative;
	width: 800px;
	margin: 20px;
	height: 500px;
}
</style>
<script type="text/javascript">
// after login layout items
IG$.$1 = function(tmpl) {
	setTimeout(function(){
        var report_1 = $("#report_1"),
        	w_1 = report_1.width(),
        	h_1 = report_1.height();
        	
        var report_2 = $("#report_2"),
        	w_2 = report_2.width(),
        	h_2 = report_2.height();
        	
        var p1 = IG$._I61("01313881-011a69d4", "report", "", "", false, {
        	renderTo: report_1[0],
        	header: false
        });
        
        p1.setSize(w_1, h_1);
        
        var p2 = IG$._I61("01313881-011a69d4", "report", "", "", false, {
        	renderTo: report_2[0],
        	width: w_2,
        	height: h_2,
        	header: false
        });
        
        p2.setSize(w_2, h_2);
    }, 10);
};
</script>
<script type="text/javascript" src="./custom/ig_pgloader.js<%=ukey%>"></script>
<script type="text/javascript" src="./custom/sso_client.js<%=ukey%>"></script>
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
	
	<h2>Report 1 start bellow:</h2>
 	<div id="report_1"></div>
 	<br /><br /><br />
 	<h2>Report 2 start bellow:</h2>
 	<div id="report_2"></div>
</body>
</html>
