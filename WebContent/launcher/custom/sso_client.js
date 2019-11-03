IG$._I89 = function(callback, rs) // show login screen
{
	$("#idv-mnu-pnl").hide();
	
	if (IG$._I83)
	{
		IG$._I83.callback = new IG$._I3d(this, function() {
			IG$._I83.tl = -1;
			IG$._I8b(); // hide login screen
		});
	}
	
	if (window.hist)
	{
		window.hist.addHistory("");
	}
	
	var lform = $("#loginWindow"),
		mc,
		progress = $("#login-progress", lform),
		lf, sform,
		browser = window.bowser;
		
	lf = "<div class='login-smc'>"
		+ "<div class='login-ic'>"
		+ "<img class='login-logo' src='./images/logo_7186.png'>"
		+ "<div class='login-sso-msg'><span>" + 
			(useLocale == "ko_KR" ? "잠시만 기다려 주십시오." : "") + 
			(useLocale == "en_US" ? "Please Wait a minutes." : "")
			+ "<span></div>"
			+ "<div id='license'>Licensed to: INGECEP</div>";
		lf += "</div></div>";
	  	
	sform = $(".login-smc", lform);
	
	if (!sform.length)
	{
		sform = $(lf).appendTo(lform).hide();
	}
	
	mc = $(".login-mc", lform);
	
	lform.css({zIndex: 99});
	if (browser.msie)
	{
		lform.css({position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", margin: 0, padding: 0});
	}
	lform.show();
	
	// rs: 0 (first page load)
	// rs: 1 (logout button clicked)
	// rs: 2 (session expired)
	// rs: 3 (print page login)
	if (rs != 1) 
	{
		sform.show();
		mc.hide();
		progress.show();
		// request automatic login
		setTimeout(function() {
			var fkey = "sso_sim_b6118e61573e4aaa_key_map:";
			if (IG$._I83)
			{
				IG$._I83.rm1$8.call(IG$._I83, fkey, "", progress, window.m$mts, 
					// login error handler
					new IG$._I3d(this, function(xdoc) {
						// move to portal login page if necessary
						sform.fadeOut();
						progress.hide();
						mc.fadeIn();
					})
				);
			}
			else
			{
				IG$._I85(fkey, "", progress, null, new IG$._I3d(this, function(xdoc) {
					// move to portal login page if necessary
					sform.fadeOut();
					progress.hide();
					mc.fadeIn();
				}));
			}
		}, 10);
	}
	else
	{
		sform.hide();
		mc.show();
		progress.hide();
	}
}