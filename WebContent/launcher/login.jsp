<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
    request.setCharacterEncoding("utf-8");
	
	String mts = request.getParameter("mts");
	mts = (mts == null) ? "" : mts;
%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>MPLIX</title>

<style type="text/css">
body {
	width: 100%;
	height: 100%;
}

body, div {
	margin: 0px;
	padding: 0px;
	overflow: hidden;
}
</style>
<link rel="stylesheet" href="./css/igcca1.css" type="text/css">
<link rel="stylesheet" href="./css/igcca2.css" type="text/css">
<link rel="stylesheet" type="text/css" href="./fonts/hangul_nanum.css" />

<script type="text/javascript" src="./js/jquery-1.12.0.min.js"></script>
<script type="text/javascript" src="./js/browser.min.js"></script>
<script type="text/javascript" src="../mplix.js"></script>
<script type="text/javascript" src="./js/igc8.js"></script>
<script type="text/javascript" src="./js/igcd.js"></script>

<script type="text/javascript" src="./custom/no_sec.js"></script>

<script type="text/javascript">
var useLocale = "en_US";
var loadingApp;

function parseLocation() {
	var hash = window.location.hash.substring(1);
	
	if (hash == "" && window.location.search && window.location.search != "")
	{
		hash = window.location.search.substring(1).split('&');
	}
	else
	{
		hash = hash.split('&');
	}
	
	for (var i=0; i < hash.length; i++)
	{
		if (hash[i].length > 0 && hash[i].indexOf('=') > -1)
		{
			var hname = hash[i].substring(0, hash[i].indexOf('=')),
				hvalue = hash[i].substring(hash[i].indexOf('=') + 1);
			
			switch (hname)
			{
			case 'lang':
				useLocale = hvalue;
				break;
			case 'app':
				loadingApp = hvalue;
				break;
			}
		}
	}
}

function initPage() {
	var uid = $.cookie("lui") || "",
		upd = "",
		mts = "<%=mts%>"
	
	IG$/*mainapp*/._I88/*createLoginPanel*/(uid, upd, false);

	var bg = $("div.login-progress").hide();

	$("#b_loc").bind("change", function(e) {
		var b_loc = $("#b_loc"),
			selvalue = $("option:selected", b_loc).val(),
			redirect = $(location).attr('href'),
			p, hv, h = {},
			k, v,
			i, s = false;
			
		if (selvalue && selvalue != window.useLocale)
		{
			if (redirect.indexOf("?") > -1)
			{
				p = redirect.substring(0, redirect.indexOf("?"));
				hv = redirect.substring(redirect.indexOf("?") + 1);
				h = hv.split("&");
				
				for (i=0; i < h.length; i++)
				{
					if (h[i].substring(0, 5) == "lang=")
					{
						h[i] = h[i].substring(0, 5) + selvalue;
						s = true;
						break;
					}
				}
				
				hv = h.join("&");
				
				redirect = p + "?" + hv;
			}
			
			if (s == true)
			{
				bg.show();
				
				setTimeout(function() {
					window.location.replace(redirect);
				}, 100);
			}
		}
	});
		
	$('#login_btn').bind('click', function() {
		var userid = $('#userid').val(),
			passwd = $('#userpassword').val();
		IG$/*mainapp*/._I85/*processLogin*/(userid, passwd, bg, mts);
		return false;
	});
	$('#userpassword').bind('keypress', function(e) {
		if (e.keyCode == 13)
		{
			var userid = $('#userid')[0].value,
				passwd = $('#userpassword')[0].value;
			
			IG$/*mainapp*/._I85/*processLogin*/(userid, passwd, bg, mts);
			
			return false;
		}
		
		return true;
	});

	IG$/*mainapp*/._I84/*checkLogin*/(null, function() {
		IG$/*mainapp*/._I87/*checkServerInfo*/(function() {
			$('#loginWindow').show();
		});
	});
}

$(document).ready(function() {
	parseLocation();
	
	IG$/*mainapp*/._I02/*androidcookiebug*/(initPage);
});
</script>
</head>
<body scroll="no">
</body>
</html>