IG$._I86 = function(userid, passwd, bg, mts)
{
	var il_err = $("#il_err");

	il_err.hide();
	
	$.ajax({
		url: ig$.servlet,
		type: "POST",
		data: {
			ack: "13",
			payload: "<smsg ptoken='' encrypt='no' uuid=''><userid><![CDATA[" + userid + "]]></userid><passwd><![CDATA[" + passwd + "]]></passwd></smsg>",
			mbody: "<smsg><option lang='" + useLocale + "' app='" + loadingApp + "' session_expire='" + (ig$.session_expire || "0") + "' mts='" + (mts || "") + "'/></smsg>",
			uniquekey: IG$._I4a()
		},
		dataType: "text",
		timeout: 300000,
		beforeSend: function(xhr, settings) {
		},
		cache: false,
		crossDomain: false,
		processData: true,
		error: function() {
			if (bg)
				bg.hide();
			alert("Error while connecting server");
		},
		success: function(doc) {
			var xdoc = IG$._I13(doc),
				root = IG$._I18(xdoc, "/smsg"),
				item = IG$._I18(xdoc, "/smsg/item"),
				ltoken,
				nuid,
				errcode = root ? IG$._I1b(root, "errorcode") : null,
				redirect;
			
			if (bg)
			{
				bg.hide();
			}
			
			if (item)
			{
				ltoken = IG$._I1b(item, "token");
				nuid = IG$._I1b(item, "uid");
				
				redirect = IG$._I1b(item, "redirect");
					
				if (redirect && redirect.length > 0)
				{
					window.location.replace(redirect);
				}
				else
				{
					alert("System Error:: Application is not defined on config.xml");
				}
			}
			else if (errcode)
			{
				var msg = IG$._I1b(root, "errormsg");
					
				if (errcode == "0x6d00")
            	{
            		il_err.unbind("click");
            		il_err.bind("click", function() {
            			il_err.hide();
            		});
            		il_err.show();
            		$(".igc-errorinfo-msg", il_err).html(msg);
            	}
            	else
            	{
            		IG$._I51(xdoc, null);
            	}
			}
		}
	});
};

if (IG$._I81)
{
	IG$._I81.prototype.m1$8 = function(userid, passwd, bg, mts, callback) {
		var panel = this, 
			req = new IG$._I3e();
		
		var useenc = userid.length < 20 && passwd.length < 20,
			encpwd = useenc ? IG$._I3c([userid, passwd]) : [userid, passwd];

		req.init(panel, 
			{
	            ack: "13",
	            payload: "<smsg ptoken=\'\' uuid=\'\'" + (useenc ? "" : " encrypt='no'") + "><userid><![CDATA[" + encpwd[0] + "]]></userid><passwd><![CDATA[" + encpwd[1] + "]]></passwd></smsg>",
	            mbody: "<smsg><option lang='" + useLocale + "' mts='" + (mts || "") + "' app='' session_expire='" + (ig$.session_expire || "0") + "'/></smsg>"
	        }, panel, panel.r_I85, function(xdoc) {
	        	callback && callback.execute(xdoc);
	        	
	        	if (bg)
	        	{
	        		bg.hide();
	        	}
	        }, bg);
		req._l();
	}
}