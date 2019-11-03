<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
    request.setCharacterEncoding("utf-8");
    String _d = request.getParameter("_d");
    String ukey = "?_d=" + _d;
    String lang = request.getParameter("lang");
    lang = (lang == null) ? "ko_KR" : lang;
    
    String mts = request.getParameter("mts");
    mts = (mts == null) ? "" : mts;
    
    String objid = request.getParameter("objid");
    objid = (objid == null) ? "" : objid;
	
	/**************************************** sso ****************************************/
	// sso related function
    // case : hide security information on session variable and use in sso module
    // javax.servlet.http.HttpSession session = request.getSession(true);
    // exaple key - value transfer to sso java class
	
    session.setAttribute("__sso_info", "sso_sim_b6118e61573e4aaa_key_map:admin"); // 세션에 키값과, 유저아이디 탑제
    session.setAttribute("__sso_val_svr", "111"); // 세션에 필요한 다른 값 탑제
	
    // end of sso related function
	/**************************************** sso ****************************************/
	
%>

<!DOCTYPE html>
<html lang="en">
<head>
	<title>INGECEP</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="chrome=IE8">
	<!--[if lt IE 9]>
		<meta name="svg.render.forceflash" content="true">
	<![endif]-->
	

	<link rel="stylesheet" type="text/css" href="./css/ui-lightness/jquery-ui-1.10.4.custom.css" />

   <link rel="stylesheet" type="text/css" href="./css/igcca1.css" />
   <link rel="stylesheet" type="text/css" href="./css/igcca1_wb.css" />
   <link rel="stylesheet" type="text/css" href="./css/igcca2.css" />
	<link rel="stylesheet" type="text/css" href="./css/custom_light.css" />

    <!-- link rel="stylesheet" type="text/css" href="./fonts/hangul_nanum.css" / -->
    <!-- link rel="stylesheet" type="text/css" href="./css/customer.css" / -->
	<script type="text/javascript" src="../mplix.js"></script>
	<script type="text/javascript">
		var useLocale = "<%=lang%>";
		var m$mts = "<%=mts%>";
		var m$_d = "";
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
	
	<script type="text/javascript" src="./js/modules/heatmap.js"></script>
	<script type="text/javascript" src="./js/modules/treemap.js"></script>

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

	<!--[if lt IE 9]>
	<script type="text/javascript" src="./js/protovis-d3.3.js"></script>
	<![endif]-->
	<!--[if ! lt IE 9]><!-->
	<script type="text/javascript" src="./js/protovis-d3.2.js"></script>
	<!--<![endif]-->

	<!--[if lt IE 9]>
	<script type="text/javascript" src="./js/excanvas.js"></script>
	<![endif]-->
	
	<script type="text/javascript" src="./js/igc8.js"></script>
	<script type="text/javascript" src="./js/igc4a_wb.js"></script>
	<script type="text/javascript" src="./js/igc4b.js"></script>
	<script type="text/javascript" src="./js/igc4c.js"></script>
	<script type="text/javascript" src="./js/igc4d_wb.js"></script>
	
	<script type="text/javascript" src="./custom/customdatahandler.js"></script>
	<script type="text/javascript" src="./custom/custom.chart.options.js"></script>
	<script type="text/javascript" src="./custom/custom.hstock.js"></script>
	<script type="text/javascript" src="./custom/custom.kpi.js"></script>
	<script type="text/javascript" src="./custom/custom.heatmap.js"></script>

	<!-- script type="text/javascript" src="./custom/custom.map.naver.js"></script -->
	<!-- script type="text/javascript" src="http://openapi.map.naver.com/openapi/naverMap.naver?ver=2.0&key=9283b12ba5aa086eb5fa4f97c119648d"></script -->

	<script type="text/javascript" src="./custom/custom_date.js"></script>
	
	<script type="text/javascript">
	// after login layout items
	// http://127.0.0.1:8780/ingecep/launcher/embed_1.jsp?mts=INGECEP&objid=013138fa-0112004f 처럼 쿼리스트링을 통해 값 전달 필수값은 mts와 objid

	var objid = '<%=objid%>';

	IG$.$1 = function(tmpl, mopt) {
		setTimeout(function(){
			
			var report_1 = $("#report_1"),
				w_1 = report_1.width(),
				h_1 = report_1.height(),
				mp;
			
			mp = new $s.viewport({
				layout: "card",
				padding: '0 0 0 0',
				header: false,
				renderTo: report_1[0]
			});
			
			mp.setSize(w_1, h_1);
			
			mp.doLayout();
			
			window.__mp = mp;
			
			if (objid || mopt)
			{
				IG$._n2(objid, "report", mopt, false);
			}
		}, 10);
	};

	// 페이지 이동 관련
	function _btn_handler(view, key) {
		if (key == "custom1")
		{
			IG$._n2("013498a9-013aab9f", "report", null, false);
		}
	}
	/*
	function _btn_handler(view, key) {
		if (key == "custom1")
		{
			IG$._n2("013138da-01f4ab0a", "report", null, false);
		}
		else if (key == "custom2")
		{
			IG$._n2(objid, "report", null, false);
		}
	}
	*/
	   IG$/*mainapp*/.__c_/*chartoption*/.chartcolors.custom1 = [
		  "#8348DE", "#56C0DA", "#A4D91F", "#6E7C96", "#EE7D33", "#7992BF", "#A9DC8E"
	   ];
	   IG$/*mainapp*/.__c_/*chartoption*/.chartcolors.custom2 = [
		  "#65D1B9", "#EB6666", "#358FCE", "#566278", "#6C7B95", "#C3CDDD", "#ED8490", "#9BE1E1", "#66C2EB"
	   ];
	   IG$/*mainapp*/.__c_/*chartoption*/.chartcolors.custom3 = [
		  "#6D7D92", "#E752C4", "# F3A936"
	   ];  
	</script>


	<script type="text/javascript" src="./custom/ig_pgloader.js"></script>
	<!-- sso related function -->
	<script type="text/javascript" src="./custom/sso_client.js"></script> <!-- sso 요청 스크립트 -->


<style>
.content {
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	overflow: hidden;
}

.report_container {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.report { 
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	overflow: hidden;
}

</style>
</head>

<script type="text/javascript">
ig$/*appoption*/._fix_split = 1;
</script>

<body scroll="no">
	<div id="loading-mask" style=""></div>
	<!-- div id="loading">
  		<div class="loading-indicator"><img src="./images/extanim32.gif" width="32" height="32" style="margin-right:8px;" align="absmiddle"/>Loading...</div>
	</div -->
	
	<div class="content">
		<div class="report_container">
			<div id="report_1" class="report">
				
			</div>
		</div>
	</div>
	
</body>
</html>
