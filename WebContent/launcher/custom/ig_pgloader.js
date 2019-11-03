IG$._I8b = function() {
	var lform = $('#loginWindow');
	lform.hide();
}

IG$["showLoginProc"] = IG$._I8b;

function _ld_igc() {
	var i,
		copt;
	IG$.lE.rcsloaded = true;
	
    copt = {
		closeText: IRm$.r1("L_C_CLOSE"),
		prevText: IRm$.r1("L_C_PREV"),
		nextText: IRm$.r1("L_C_NEXT"),
		currentText: IRm$.r1("L_C_CUR"),
		monthNames: IRm$.r1("L_C_M_NAMES").split("#"),
		monthNamesShort: IRm$.r1("L_C_M_NAMES_S").split("#"),
		dayNames: IRm$.r1("L_C_D_NAMES").split("#"),
		dayNamesShort: IRm$.r1("L_C_D_NAMES_S").split("#"),
		dayNamesMin: IRm$.r1("L_C_D_NAMES_M").split("#"),
		weekHeader: IRm$.r1("L_C_W_H"),
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: IRm$.r1("L_C_YR_SFX")
	};
	
	$.datepicker.setDefaults(copt);
	
	IG$.r_cl_lc = copt;
    
	var uid = $.cookie("lui") || "";
	var upd = "";
		
	IG$._I88(uid, upd, true);
	IG$._I14();
	
	$('#loading').fadeOut({remove:true});
    $('#loading-mask').fadeOut({remove:true});
    
    var req = new IG$._I3e();
	
	if (window.m$slink && window.m$slink.length)
	{
		req.init(null, 
			{
		        ack: "75",
	            payload: "<smsg><item><slink><![CDATA[" + window.m$slink + "]]></slink></item></smsg>",
	            mbody: IG$._I2e({option: "sch_res"})
		    }, null, 
		    function(xdoc){
		    	var tnode = IG$._I18(xdoc, "/smsg/item"),
		    		tnodes = tnode ? IG$._I26(tnode) : null,
		    		i,
		    		opt = {},
		    		n, v;
		    	
		    	for (i=0; i < tnodes.length; i++)
		    	{
		    		n = IG$._I29(tnodes[i]);
		    		v = IG$._I24(tnodes[i]);
		    		opt[n] = v;
		    	}
		    	IG$.$1(null, {
		    		mode: "sc",
		    		jid: opt.opt_1,
		    		sid: opt.opt_3
		    	});
		    },
		    function(xdoc){
		    	IG$._I89(new IG$._I3d(this, IG$._I8b));
		    	return true;
		    }
		);
	}
	else
	{
		req.init(null, 
			{
		        ack: "11",
	            payload: IG$._I2d({}),
	            mbody: IG$._I2e({option: "ls", mts: (window.m$mts || ""), lang: (window.useLocale || "")})
		    }, null, 
		    function(xdoc){
		    	var tnode = IG$._I18/*XGetNode*/(xdoc, '/smsg'),
		    		islogin = false;
		    	
		    	if (tnode)
		    	{
		    		var uuid = IG$._I1b(tnode, 'uuid');
		    		
		    		if (uuid)
		    		{
		    			islogin = true;
		    			IG$._I83.callback = new IG$._I3d(this, IG$._I8b);
		    			IG$._I83.uuid = uuid; 
		    			IG$._I83.mts = {
		    				sid: IG$._I1b(tnode, "mts"),
		    				name: IG$._I1b(tnode, "mts_name")
		    			};
		    			
		    			IG$._g$a = IG$._I83.mts.sid; 
		    			
		    			if (window.m$mts && IG$._I83.mts.name != window.m$mts && IG$._I83.mts.sid != window.m$mts)
		    			{
		    				IG$._I8a(new IG$._I3d(this, IG$._I8b));
		    				return;
		    			}
		    			
		    			IG$._I83.lastLogin = {
		    				lastaccesstime: IG$._I1b(tnode, "lastaccesstime"),
		    				lastaccesshost: IG$._I1b(tnode, "lastaccesshost"),
		    				lastaccessaddr: IG$._I1b(tnode, "lastaccessaddr"),
		    				accesshost: IG$._I1b(tnode, "accesshost"),
							accessaddr: IG$._I1b(tnode, "accessaddr"),
							accesstime: IG$._I1b(tnode, "accesstime")
		    			};
		    			
		    			IG$._I83.Js4.call(IG$._I83, false);
		    		}
		    	}
		    	
		    	if (islogin == false)
		    	{
		    		IG$._I89(new IG$._I3d(this, IG$._I8b));
		    	}
		    },
		    function(xdoc){
		    	IG$._I89(new IG$._I3d(this, IG$._I8b));
		    	return true;
		    }
		);
	}
	
	req._l();
}

IG$/*mainapp*/._n2/*navigateMenuByUID*/ = function(uid, hashtype, param, bhist)
{
	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
	
	req.init(null, 
		{
            ack: "11",
            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "translate"})
        }, null, function(xdoc) {
        	var node = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
				itemuid = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "uid"),
				typename = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "type").toLowerCase(),
				itemname = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "name"),
				itemaddr = IG$/*mainapp*/._I1b/*XGetAttr*/(node, "nodepath"),
				writable = (IG$/*mainapp*/._I1b/*XGetAttr*/(node, "manage") == 'T' || IG$/*mainapp*/._I1b/*XGetAttr*/(node, "writable") == 'T') ? true : false,
				isexport = false; 
				
			if (typename == "export")
			{
				typename = "report";
			}
			
			var mp = window.__mp,
				opt = {
					header: false
				}, i;
			
			if (param && param.mode == "sc")
		    {
		    	opt.__jid = param.jid;
		    	opt.__sid = param.sid;
		    }
		    
		    var kname = itemuid,
		    	tab;
		    
		    for (i=0; i < mp.items.items.length; i++)
		    {
		    	if (mp.items.items[i].uid == kname)
		    	{
		    		tab = mp.items.items[i];
		    		break;
		    	}
		    }
		    
		    if (tab)
		    {
		    	mp.setActiveItem(tab);
		    }
		    else
		    {
				var p1 = IG$._I61(itemuid, typename, "", "", false, param);
		    	mp.add(p1);
		    	mp.setActiveItem.call(mp, p1);
		    }
        }, null);
	req._l/*request*/();
}

if (window.Ext)
{
	Ext.onReady(function(){
	    Ext.tip.QuickTipManager.init()
	    
	    $("#lpt", "#loading").css("width", "80%");
	    
		IRm$.r2({
			func: function() {
				$("#lpt", "#loading").css("width", "100%");
				
				setTimeout(function() {
					_ld_igc();
				}, 10);
			}
		});
	});
}
else
{
	$(document).ready(function() {
	    $("#lpt", "#loading").css("width", "80%");
	    
	    $(window).on("resize", function() {
	    	var mp = window.__mp,
	    		w, h, rbody;
	    	
	    	if (mp && mp.renderTo)
	    	{
	    		rbody = $(mp.renderTo);
	    		w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(rbody);
	    		h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(rbody);
	    		
	    		if (w > 0 && h > 0)
	    		{
	    			mp.setSize.call(mp, w, h);
	    		}
	    	}
	    });
	    
		IRm$.r2({
			func: function() {
				$("#lpt", "#loading").css("width", "100%");
				
				setTimeout(function() {
					_ld_igc();
				}, 10);
			}
		});
	});
}