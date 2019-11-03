<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
    request.setCharacterEncoding("utf-8");
    String _d = request.getParameter("_d");
    String ukey = "?_d=" + _d;
    String lang = request.getParameter("lang");
    lang = (lang == null) ? "en_US" : lang;
	
	String mts = request.getParameter("mts");
    mts = (mts == null) ? "" : mts;
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
	
	<link rel="stylesheet" type="text/css" href="./css/export.css<%=ukey%>" />
	
	<!-- link rel="stylesheet" href="https://js.arcgis.com/3.15/esri/css/esri.css" / -->
	
<script type="text/javascript" src="../mplix.js<%=ukey%>"></script>
<script type="text/javascript">

var useLocale = "<%=lang%>";
var m$mts = "<%=mts%>";

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

<script type="text/javascript" src="./js/bootstrap.js"></script>

<script type="text/javascript" src="./js/jquery-1.12.0.min.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/browser.min.js"></script>
<script type="text/javascript" src="./js/jquery-ui-1.10.4.custom.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/jquery.contextMenu.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/highstock.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/highcharts-3d.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/highcharts-more.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/highcharts.theme.js<%=ukey%>"></script>
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

<script type="text/javascript">
Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath('Ext.ux', './ux/');
Ext.Loader.setPath('Ext.ux.DataView', './ux/DataView/');
Ext.Loader.setPath("igc", './controls/');

Ext.require([
    'Ext.ux.statusbar.StatusBar'
]);

var IG$/*mainapp*/ = window.IG$/*mainapp*/ || {};
IG$/*mainapp*/.__ep = true;

</script>
<script type="text/javascript" src="./js/igc8.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/igc5.js<%=ukey%>"></script>
<script type="text/javascript" src="./js/igc9.js<%=ukey%>"></script>

<!-- script type="text/javascript" src="https://js.arcgis.com/3.15/"></script -->

<script type="text/javascript" src="./custom/customdatahandler.js<%=ukey%>"></script>
<script type="text/javascript" src="./custom/custom.chart.options.js<%=ukey%>"></script>
<script type="text/javascript" src="./custom/custom.hstock.js<%=ukey%>"></script>
<!-- script type="text/javascript" src="./custom/custom.map.esri.js<%=ukey%>"></script -->



<script type="text/javascript" src="./custom/custom.export.jasper.js<%=ukey%>"></script>

</head>
<body scroll="auto">
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

 	<div id="main"></div>
</body>
</html>
