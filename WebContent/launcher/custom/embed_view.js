IG$/*mainapp*/.$1/*loadApp*/ = function(tmpl) {
	setTimeout(function(){
        Ext.get('loading') && Ext.get('loading').fadeOut({remove:true});
        Ext.get('loading-mask') && Ext.get('loading-mask').fadeOut({remove:true});
        
        var report_1 = $("#report_1"),
        	w_1 = report_1.width(),
        	h_1 = report_1.height();
        	
        var report_2 = $("#report_2"),
        	w_2 = report_2.width(),
        	h_2 = report_2.height();
        	
        var p1 = IG$/*mainapp*/._I61/*createAppPanel*/("01313881-011a69d4", "report", "", "", false, {
        	renderTo: report_1[0],
        	width: w_1,
        	height: h_1,
        	header: false
        });
        
        var p2 = IG$/*mainapp*/._I61/*createAppPanel*/("01313881-011a69d4", "report", "", "", false, {
        	renderTo: report_2[0],
        	width: w_2,
        	height: h_2,
        	header: false
        });
    }, 550);
};