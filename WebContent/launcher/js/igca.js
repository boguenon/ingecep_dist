/*
amplixbi.com on MPLIX project
Copyright(c) 2011 amplixbi.com
http://www.amplixbi.com/
*/
/*
This file is part of INGECEP

Copyright (c) 2011-2013 INGECEP Inc

Contact:  http://www.ingecep.com/contact

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.ingecep.com/contact.

*/
var api;
var demowin;

mecapp = null;

$s.ready(function(){
	var uid = $.cookie("lui") || "";
	var upd = "";
	
	f$8a(uid, upd, true);
	
	$('#loginWindow').hide();
	
	var req = new R$1d();
	req.init(null, 
		{
	        ack: "11",
            payload: IG$/*mainapp*/.c({}),
            mbody: IG$/*mainapp*/.d({option: "ls"})
	    }, null, 
	    function(xdoc){
	    	//check out server login proc
	    	var tnode = IG$/*mainapp*/.L7(xdoc, '/smsg');
	    	IG$/*mainapp*/.mjk.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/);
	    	IG$/*mainapp*/.mjk.uuid = IG$/*mainapp*/.L9(tnode, 'uuid');
	    	IG$/*mainapp*/.mjk.Js4.call(IG$/*mainapp*/.mjk, false);
	    },
	    function(){
	    	// show login window
	    	// f$4(new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/));
	    	// automatic login
	    	IG$/*mainapp*/.mjk.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, IG$/*mainapp*/._I8b/*showLoginProc*/);
	    	IG$/*mainapp*/.mjk.m1$8.call(IG$/*mainapp*/.mjk, "", "");
	    	return true;
	    });
	
	req._l/*request*/();
});

IG$/*mainapp*/._I8b/*showLoginProc*/ = function() {
	var lform = $('#loginWindow'),
		uid = $("#userid");
	lform.hide();
	
	setTimeout(function(){
        $('#loading').remove();
        $('#loading-mask').remove();
    }, 150);
	
	demowin = Ext.create('widget.window', {
        title: "",
        closable: true,
        closeAction: 'hide',
        width: 600,
        height: 350,
        "layout": 'fit',
        bodyStyle: 'padding: 5px;',
        items: [
       	],
       	navigateByAddress: function(uid) {
       		var panel = this,
       			req = new R$1d();
	
			req.init(null, 
				{
		            ack: "11",
		            payload: IG$/*mainapp*/.c({uid: uid}),
		            mbody: IG$/*mainapp*/.d({option: "translate"})
		        }, null, function(xdoc) {
		        	var node = IG$/*mainapp*/.L7(xdoc, "/smsg/item"),
						itemuid = IG$/*mainapp*/.L9(node, "uid"),
						typename = IG$/*mainapp*/.L9(node, "type").toLowerCase(),
						itemname = IG$/*mainapp*/.L9(node, "name"),
						itemaddr = IG$/*mainapp*/.L9(node, "nodepath"),
						writable = (IG$/*mainapp*/.L9(node, "manage") == 'T' || IG$/*mainapp*/.L9(node, "writable") == 'T') ? true : false; 
						
						this.uid = itemuid;
					panel.m1$7.call(panel, itemuid, typename, itemname, itemaddr, writable);
		        }, null);
			req._l/*request*/();
       	},
       	
       	m1$7: function(uid, typename, itemname, itemaddr, writable) {
       		var popt = {closable: false, title: null},
       			pitem = f$2(uid, typename, itemname, itemaddr, writable, popt);
    		
    		if (pitem != null)
    		{
    			this.removeAll();
    			this.add(pitem);
    			pitem.address = itemaddr;
    		}
       	}
    });
        
	if (uid && uid.length > 0)
		uid[0].value = IG$/*mainapp*/.mjk.jS1.u1/*userid*/;
		
	$("#sample01").bind("click", function() {
		sPPl("/Scientific Demo/2.Reports/ 1.Reporting/ 4.SubTotal", "SubTotal Demo");
	});
	
	$("#sample02").bind("click", function() {
		sPPl("/Scientific Demo/2.Reports/ 3.AdvancedVisual/ 9.ParallelView", "ParallelView");
	});
}

function sPPl(contentid, title) {
   	demowin.setTitle(title);
   	demowin.navigateByAddress.call(demowin, contentid);
    demowin.show();
}

