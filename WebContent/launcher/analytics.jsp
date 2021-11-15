<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
    request.setCharacterEncoding("utf-8");
    String _d = request.getParameter("_d");
    String ukey = "?_d=" + _d;
    String lang = request.getParameter("lang");
    lang = (lang == null) ? "en_US" : lang;
	String mts = request.getParameter("mts");
	mts = (mts == null) ? "" : mts;
	String tmp = request.getParameter("tmp");
    tmp = (tmp == null) ? "" : tmp;
%>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>AMPLIX</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
<!--[if lt IE 9]>
    <meta name="svg.render.forceflash" content="true">
<![endif]-->
	<link rel="stylesheet" type="text/css" href="./css/ui-lightness/jquery-ui-1.10.4.custom.css" />
    
	<link rel="stylesheet" type="text/css" href="./css/igcca2.css" />
    <link rel="stylesheet" type="text/css" href="./css/igcca1_wb.css" />
    <link rel="stylesheet" type="text/css" href="./fonts/hangul_nanum.css" />
    <link rel="stylesheet" type="text/css" href="./font-awesome/css/font-awesome.css" />
    
<!--[if lt IE 9]>    
	<link rel="stylesheet" type="text/css" href="./css/igcr-ie.css" />
<![endif]-->    
    <!-- link rel="stylesheet" href="https://js.arcgis.com/3.15/esri/css/esri.css" / -->
    
    
    <!-- link rel="stylesheet" type="text/css" href="./css/customer.css" / -->
<script type="text/javascript" src="../mplix.js"></script>
<script type="text/javascript">
var useLocale = "<%=lang%>";
var m$mts = "<%=mts%>";
var m$_d = "";
var use_session_key = true;

// default theme
// ig$/*appoption*/.theme_id = "DarkBrown";

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

<script type="text/javascript" src="./js/webix.js"></script>

<script type="text/javascript" src="./js/jquery-1.12.0.min.js"></script>
<script type="text/javascript" src="./js/browser.min.js"></script>
<script type="text/javascript" src="./js/jquery-ui-1.10.4.custom.min.js"></script>
<script type="text/javascript" src="./js/jquery.contextMenu.js"></script>
<script type="text/javascript" src="./js/highstock.js"></script>
<script type="text/javascript" src="./js/highcharts-3d.js"></script>
<script type="text/javascript" src="./js/highcharts-more.js"></script>
<script type="text/javascript" src="./js/highcharts.theme.js"></script>
<script type="text/javascript" src="./js/highcharts.exporting.js"></script>
<script type="text/javascript" src="./js/modules/funnel.js"></script>
<!-- script type="text/javascript" src="./js/modules/heatmap.js"></script -->
<!-- script type="text/javascript" src="./js/modules/treemap.js"></script -->

<script type="text/javascript" src="./js/jquery.sparkline.js"></script>
<script type="text/javascript" src="./js/jit.js"></script>
<script type="text/javascript" src="./js/superfish.js"></script>
<script type="text/javascript" src="./js/raphael.js"></script>
<script type="text/javascript" src="./js/g.raphael.js"></script>
<script type="text/javascript" src="./js/g.dot.js"></script>
<script type="text/javascript" src="./js/raphael.export.js"></script>

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
<!-- script type="text/javascript" src="./js/jquery.easypiechart.js"></script -->
<!-- script type="text/javascript" src="./js/ace.js"></script -->

<script type="text/javascript">
window.IG$/*mainapp*/ = window.IG$/*mainapp*/ || {};
window.IG$/*mainapp*/.__ep_ = "<%=tmp%>";
</script>

<script type="text/javascript" src="./js/igc8.js"></script>
<script type="text/javascript" src="./js/igc5a_wb.js"></script>
<script type="text/javascript" src="./js/igc5b.js"></script>
<script type="text/javascript" src="./js/igc5c.js"></script>
<script type="text/javascript" src="./js/igc5d.js"></script>
<script type="text/javascript" src="./js/igc5e.js"></script>
<script type="text/javascript" src="./js/igc5f.js"></script>
<script type="text/javascript" src="./js/igcp_wb.js"></script>

<script type="text/javascript" src="./js/menustructure.js"></script>
<!-- dynamically loaded when triggered -->
<!-- script type="text/javascript" src="./js/igcm.js"></script -->
<!-- script type="text/javascript" src="./js/igcn.js"></script -->
<!-- script type="text/javascript" src="./js/igc6.js"></script -->
<!-- script type="text/javascript" src="./js/igco.js"></script -->
<!-- end of dynamically loaded when triggered -->
<!-- script type="text/javascript" src="./js/igc9.js"></script -->

<!-- script type="text/javascript" src="https://js.arcgis.com/3.15/"></script -->

<!-- script type="text/javascript" src="./custom/customdatahandler.js"></script -->
<script type="text/javascript" src="./custom/custom.chart.options.js"></script>
<script type="text/javascript" src="./custom/custom.hstock.js"></script>
<script type="text/javascript" src="./custom/custom.heatmap.js"></script>
<script type="text/javascript" src="./custom/custom.kpi.js"></script>
<script type="text/javascript" src="./custom/custom.sankey.js"></script>
<script type="text/javascript" src="./custom/custom.imageviewer.js"></script>
<!-- script type="text/javascript" src="./custom/custom.map.esri.js"></script -->

<!-- script type="text/javascript" src="./custom/custom.export.jasper.js"></script -->

<!-- script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?&sensor=false"></script -->
<!-- script type="text/javascript" src="http://openapi.map.naver.com/openapi/naverMap.naver?ver=2.0&key=87c2769e8274549f344934253d0004d6"></script -->

</head>
<body scroll="no">
	<div id="loading-mask" style=""></div>
	<div id="loading">
		<div class="cmsg">
			<div class="msg">Loading AMPLIX</div>
			<div class="lpb">
				<div id="lpt" style="width: 10%;"></div>
			</div>
		</div>
	</div>

	<div id="mainview"></div>
	
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
