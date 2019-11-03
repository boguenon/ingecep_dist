$.cookie = function(name, value, options) {
	// for android
	
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        
    } else { // only name given, get cookie
        var cookieValue = null;
        // alert(">> " + document.cookie);
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
	    
        return cookieValue;
    }
};

function setLang(lang) {
	var b_loc = $("#b_loc");
	
	window.lang = lang;
	$.cookie("lang", lang);
	
	$("option[value='" + lang + "']", b_loc).attr("selected", "selected");
}

function initMain() {
	var win = $(window),
		body = $("body"),
		doc = $(document),
		header = $("#header"),
		w = win.width(),
		h = win.height(),
		hh = header.height(),
		fscreen = $(".js-fullscreen"),
		jhinted = $(".js-hinted-fullscreen"),
		parallax = $(".js-parallax-image"),
		jsfull = $(".section-photo-fullscreen"),
		pobjs = [],
		pobj,
		i,
		cname = "transform",
		btn_maintop = $("#btn_maintop"),
		rs,
		browser;
	
	rs = function() {
		w = win.width();
		h = win.height();
		
		doc.scrollTop(0);
		
		body.css("paddingTop", h);
		fscreen.css("height", h);
		jsfull.css("height", h);
	};
	
	win.resize(rs);
	
	rs();
	
	setLang($.cookie("lang") || window.__lang || "en_US");
	
	// jhinted.css("height", h-hh);
	
	browser = window.bowser;
	
	if (browser.webkit || browser.safari || browser.opera)
	{
		cname = "-webkit-transform";
	}
	else if (browser.mozilla)
	{
		cname = "-moz-transform";
	}
	else if (browser.msie)
	{
		cname = "-ms-transform";
	}
	
	for (i=0; i < parallax.length; i++)
	{
		pobj = {
			html: $(parallax[i])
		};
		pobj.parent = $(pobj.html.parent());
		pobj.dataOrigin = pobj.html.attr("data-origin");
		pobjs.push(pobj);
	}
	
	btn_maintop.bind("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		doc.scrollTop(0);
	});
	
	$.each([
		{
			name: "btn_item1", 
			url: "mdi"
		},
		{
			name: "btn_item2",
			url: "dashboard"
		}
	], function(i, obj) {
		$("#" + obj.name).bind("click", function(ev) {
			ev.preventDefault();
			ev.stopPropagation();
			
			var b_loc = $("#b_loc"),
				lang = $("option:selected", b_loc).val() || "en_US";
				
			setLang(lang);
			
			window.location.replace("./launcher/login.jsp?lang=" + window.lang + "&app=" + obj.url + "&mts=" + (window.__mts_id || "INGECEP"));
		});
	});
	
	win.scroll(function(e) {
		var t = doc.scrollTop(),
			i,
			pd,
			poff,
			pval;
		
		if (t > (h - hh))
		{
			body.removeClass("nav-light");
			body.addClass("nav-dark");
		}
		else
		{
			body.removeClass("nav-dark");
			body.addClass("nav-light");
		}
		
		for (i=0; i < pobjs.length; i++)
		{
			pd = pobjs[i];
			if (pd.dataOrigin == "0")
			{
				pval = - (t / h) * 90; // (0 - t) * (t / h);
			}
			else
			{
				poff = pd.parent.offset();
				pval = (poff.top - t) / h * 90;
			}
			pd.html.css(cname, "matrix(1, 0, 0, 1, 0, " + (pval) + ")");
		}
	});
}

$(document).ready(function() {
	initMain();
});