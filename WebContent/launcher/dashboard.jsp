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
    <link rel="stylesheet" type="text/css" href="./css/igcca2.css" />
	<link rel="stylesheet" type="text/css" href="./css/igcca1_wb.css" />
    <link rel="stylesheet" type="text/css" href="./css/igcr.css" />
    <!-- link rel="stylesheet" type="text/css" href="./fonts/hangul_nanum.css" / -->
    <link rel="stylesheet" type="text/css" href="./font-awesome/css/font-awesome.css" />
    
    <!-- link rel="stylesheet" href="https://js.arcgis.com/3.15/esri/css/esri.css" / -->
    
    <!-- link rel="stylesheet" type="text/css" href="./css/customer.css" / -->
<%
	if (igc_theme != null)
	{
		out.println("<link rel=\"stylesheet\" type=\"text/css\" href=\"./css/theme_" + igc_theme_name + ".css\" />");
	}
%>
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

<!-- script type="text/javascript" src="./js/bootstrap.js"></script -->
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
<!-- script type="text/javascript" src="./js/modules/heatmap.js"></script -->
<!-- script type="text/javascript" src="./js/modules/treemap.js"></script -->

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
<!--[if lt IE 9]>
<![endif]-->
<!-- script type="text/javascript" src="./js/jquery.easypiechart.js"></script -->

<!-- script type="text/javascript" src="./js/ace.js"></script -->

<script type="text/javascript">
var useLocale = "<%=lang%>";
var m$mts = "<%=mts%>";
var m$_d = "";
	
//Ext.Loader.setConfig({
//    enabled: true
//});
//
//Ext.Loader.setPath('Ext.ux', './ux/');
//Ext.Loader.setPath('Ext.ux.DataView', './ux/DataView/');
//Ext.Loader.setPath("igc", './controls/');
//
//Ext.require([
//	'Ext.panel.Panel',
//    'Ext.button.Button',
//    'Ext.window.Window',
//    'Ext.ux.statusbar.StatusBar',
//    'Ext.toolbar.TextItem',
//    'Ext.menu.Menu',
//    'Ext.toolbar.Spacer',
//    'Ext.button.Split',
//    'Ext.form.field.TextArea',
//    'Ext.ux.CheckColumn',
//    'Ext.ux.DataView.Animated',
//    'Ext.toolbar.Paging',
//    'Ext.ux.form.SearchField',
//    
//    'Ext.grid.property.Grid'
//]);

</script>
<script type="text/javascript" src="./js/igc8.js"></script>
<script type="text/javascript" src="./js/igc4a_wb.js"></script>
<script type="text/javascript" src="./js/igc4b.js"></script>
<script type="text/javascript" src="./js/igc4c.js"></script>
<script type="text/javascript" src="./js/igc4d.js"></script>
<script type="text/javascript" src="./js/igcr.js"></script>
<!-- dynamically loaded when triggered -->
<!-- script type="text/javascript" src="./js/igcm.js"></script -->
<!-- script type="text/javascript" src="./js/igcn.js"></script -->
<!-- script type="text/javascript" src="./js/igco.js"></script -->
<!-- end of dynamically loaded when triggered -->
<!-- script type="text/javascript" src="./js/igc9.js"></script -->

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

<script type="text/javascript">
	$(document).ready(function() {
		var btn_logout = $("#igc_logout"),
			igc_login_dr = $("#igc_login_dr"),
			m_user = $("#m_user"),
			m_pwd = $("#m_pwd"),
			m_passwd = $("#m_passwd", m_user),
			m_logout = $("#m_logout", m_user),
			m_style = $("#m_style"),
			doc = $(document),
			body = $("body"),
			f = function(e) {
				m_user.hide();
				doc.unbind("click", f);
			},
			f1 = function(e) {
				m_style.hide();
				doc.unbind("click", f1);
			},
			b_back = $("<div class='modal-backdrop fade in'></div>"),
			b_cl1 = $("#b_cl1", m_pwd),
			b_cl2 = $("#b_cl2", m_pwd),
			b_m1 = $("#b_m1", m_pwd),
			b_style = $("#b_style");
			
		b_back.appendTo(body).hide();
		
		btn_logout.bind("click", function() {
			IG$._I8a();
		});
		
		m_logout.bind("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			m_user.hide();
			doc.unbind("click", f);
			
			IG$._I8a();
		});
		
		m_passwd.bind("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			doc.unbind("click", f);
			
			var u1 = $("#u1", m_pwd),
				u2 = $("#u2", m_pwd),
				u3 = $("#u3", m_pwd);
				
			u1.val("");
			u2.val("");
			u3.val("");
			
			m_pwd.show();
			b_back.show();
			
			m_user.hide();
		});
		
		b_cl1.bind("click", function(e) {
			m_pwd.hide();
			b_back.hide();
		});
		
		b_cl2.bind("click", function(e) {
			m_pwd.hide();
			b_back.hide();
		});
		
		b_m1.bind("click", function() {
			var u1 = $("#u1", m_pwd),
				u2 = $("#u2", m_pwd),
				u3 = $("#u3", m_pwd);
				
			IG$._$$1(u1, u2, u3, new IG$._I3d(null, function() {
				m_pwd.hide();
				b_back.hide();
			}));
		});
		
		igc_login_dr.bind("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			
			m_user.css({
				top: 20,
				left: "initial",
				right: 10
			});
			m_user.toggle();
			m_style.hide();
			doc.bind("click", f);
			doc.unbind("click", f1);
		});
		
		b_style.bind("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			
			m_style.css({
				top: 20,
				left: "initial",
				right: 10
			});
			
			m_user.hide();
			doc.unbind("click", f);
			
			m_style.toggle();
			doc.bind("click", f1);
		});
		
		window.app_themes = function(themes) {
			var m_style = $("#m_style");
			
			if (themes && m_style)
			{
				$.each(themes, function(i, theme) {
					var m = $("<li><a class='btn_button'>" + theme.name + "</a></li>").appendTo(m_style);
					
					m.bind("click", function(e) {
						e.preventDefault();
						e.stopPropagation();
						
						window.set_themes(theme.name);
						
						m_style.hide();
						doc.unbind("click", f1);
					});
				});
			}
		};
		
		window.set_themes = function(themename) {
			var vars = {}, 
				hash,
				murl = window.location.href,
				qseq = murl.indexOf("?"),
				url = qseq > 0 ? murl.substring(0, qseq) : null,
		    	hashes = qseq > 0 ? murl.slice(qseq + 1).split('&') : null,
		    	nurl,
		    	i,
		    	nseq = 0;
		    
		    if (hashes)
		    {
			    for(i = 0; i < hashes.length; i++)
			    {
			        hash = hashes[i].split('=');
			        vars[hash[0]] = hash[1];
			    }
		    }
		    
		    vars["igc_theme"] = themename;
		    
		    nurl = url + "?";
		    
		    $.each(vars, function(k, v) {
		    	nurl += (nseq > 0 ? "&" : "") + k + "=" + v;
		    	nseq++;
		    });
		    
		    window.location.replace(nurl);
		};
	});
	
	function _btn_handler(view, key) {
		if (key == "custom1")
		{
			IG$._n2("013138da-01f4ab0a", "report", null, false);
		}
	}
	
	ig$/*appoption*/.dashboard_custom = {
		menu_loaded: function(menus, panel, snav) {
			var item = menus && menus.children ? menus.children[0] : null;
			if (item)
			{
				snav.empty();
				panel.L3/*makeMenu*/.call(panel, snav, item, 0);
			}
		}
	};
</script>

</head>
<body scroll="no">
	<div id="loading-mask" style=""></div>
	<div id="loading">
		<div class="cmsg">
			<div class="msg">Loading MPLIX</div>
			<div class="lpb">
				<div id="lpt" style="width: 10%;"></div>
			</div>
		</div>
	</div>

 	<div id="main"></div>
 	
 	<div id="navbar" class="navbar">
 		<div class="navbar-header">
 			<a class="navbar-brand">
 				MPLIX
 			</a>
 		</div>
 		<div class="navbar-top-menu">
 		</div>
 		<div class="navbar-btns-cnt">
 			<ul class="navbar-btns">
 				<!-- li id="nav_mgrmenu" class="grey">
 					<span>A</span>
 				</li -->
 				<li class="light-blue">
 					<span class="user-info">
 						<span class="fa fa-tasks" style="font-size:14px;" id="b_style"></span><span class="igc-uname" id="igc_login_dr"><span id="igc_login_user"></span><b class="caret"></b></span> <span id="igc_logout" class="igc-logout fa-sign-out"></span>
 					</span>
 				</li>
 			</ul>
 		</div>
 	</div>
 	
 	<div id="sidebar-shortcuts" class="sidebar-shortcuts">
 		<div class="sidebar-btn sidebar-btn-d-menu">
 		</div>
 		<div class="sidebar-btn sidebar-btn-n-menu">
 		</div>
 	</div>
 	<div id="sidebar" class="sidebar">
 		<div class="side-nav">
 		</div>
 	</div>
 	
 	<div id="sidebar_fav" class="sidebar">
 		<div class="side-nav">
 		</div>
 	</div>
 	
 	<div id="breadcrumbs" class="breadcrumbs">
 		<ul class="breadcrumb">
 			<!-- li><span class="link">Home</span></li -->
 		</ul>
 		<div class="nav-search" style="display:none;">
 			<span class="input-icon">
 				<input type="text" placeholder="Search ..." class="nav-search-input" autocomplete="off"></input>
 				<i class="nav-search-icon">M</i>
 			</span>
 		</div>
 	</div>
 	
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
 	
 	<ul id="m_user" class="dropdown-menu animated fadeInRight m-t-xs">
        <li><a class="btn_button" id="m_passwd">Password</a></li>
        <li class="divider"></li>
        <li><a class="btn_button" id="m_logout">Logout</a></li>
    </ul>
    
    <ul id="m_style" class="dropdown-menu animated fadeInRight m-t-xs">
    </ul>
    
    <div class="modal inmodal fade" id="m_pwd" style="width:360px;margin-left:auto;margin-right:auto">
        <div class="modal-dialog modal-sm" style="top:120px">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" id="b_cl1"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">Change Password</h4>
                </div>
                <div class="modal-body">
                    <p><strong>For secure data</strong> Change password for every 1 month is recommended.</p>
                	<input type="password" class="form-control" placeholder="Old Password" id="u1"></input>
                	<input type="password" class="form-control" placeholder="New Password" id="u2"></input>
                	<input type="password" class="form-control" placeholder="Password Confirm" id="u3"></input>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-white" data-dismiss="modal" id="b_cl2">Close</button>
                    <button type="button" class="btn btn-primary" id="b_m1">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
