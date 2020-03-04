/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.ux.TabCloseMenu=Ext.extend(Object,{closeTabText:"Close Tab",closeOtherTabsText:"Close Other Tabs",showCloseAll:true,closeAllTabsText:"Close All Tabs",constructor:function(a){Ext.apply(this,a||{})},init:function(a){this.tabs=a;a.on=a.on;a.on({scope:this,contextmenu:this.onContextMenu,destroy:this.destroy})},destroy:function(){Ext.destroy(this.menu);delete this.menu;delete this.tabs;delete this.active},onContextMenu:function(b,c,g){this.active=c;var a=this.createMenu(),d=true,h=true,f=a.getComponent("closeall");a.getComponent("close").setDisabled(!c.closable);b.items.each(function(){if(this.closable){d=false;if(this!=c){h=false;return false}}});a.getComponent("closeothers").setDisabled(h);if(f){f.setDisabled(d)}g.stopEvent();a.showAt(g.getPoint())},createMenu:function(){if(!this.menu){var a=[{itemId:"close",text:this.closeTabText,scope:this,handler:this.onClose}];if(this.showCloseAll){a.push("-")}a.push({itemId:"closeothers",text:this.closeOtherTabsText,scope:this,handler:this.onCloseOthers});if(this.showCloseAll){a.push({itemId:"closeall",text:this.closeAllTabsText,scope:this,handler:this.onCloseAll})}this.menu=new Ext.menu.Menu({items:a})}return this.menu},onClose:function(){this.tabs.remove(this.active)},onCloseOthers:function(){this.doClose(true)},onCloseAll:function(){this.doClose(false)},doClose:function(b){var a=[];this.tabs.items.each(function(c){if(c.closable){if(!b||c!=this.active){a.push(c)}}},this);Ext.each(a,function(c){this.tabs.remove(c)},this)}});Ext.preg("tabclosemenu",Ext.ux.TabCloseMenu);IG$._N12=$s.extend($s.panel,{margin:"0 0 0 0",resizeTabs:true,minTabWidth:100,plugins:new Ext.ux.TabCloseMenu(),enableTabScroll:true,activeTab:0,layout:{type:"card",deferredRender:false},deferredRender:false,itemCls:Ext.baseCSSPrefix+"tabpanel-child",tabPosition:"top",removePanelHeader:true,plain:false,minTabWidth:undefined,maxTabWidth:undefined,customAddTab:function(b,a){var d=this,c=d.getComponent(b);if(c){IG$._I7e(2);d.setActiveTab(c)}else{IG$._I7e(2);a.id=b;c=d.add(a);d.setActiveTab(c)}},m1$7:function(j,f,k,e,a,l,h,g){var m,d=this.getComponent(f+"_"+j);if(d){IG$._I7e(2);this.setActiveTab(d);if(g&&d.applyOption){d.applyOption.call(d,g)}else{if(f=="dashboard"){var i=this.getComponent("dashboardedit_"+j);if(i){if(d.uid&&d.uid.length>0){d.M1.call(d)}}}}}else{var n=new IG$._I3d(this,function(){this.m1$7(j,f,k,e,a,l,h,g)}),c=IG$._I61(j,f,k,e,l,g||null,n);if(c){c.address=e;c.title=IG$._I28(k);if(h){for(m in h){c[m]=h[m]}}if(c.isWindow==true){a=false;c.title=IG$._I28(k)+" ("+IRm$.r1("D_"+f.toUpperCase())+")";if(!IG$.ps[c.address]){IG$.ps[c.address]=c;c.on("close",function(){delete IG$.ps[c.address]});c.show()}}else{IG$._I7e(2);c.id=f+"_"+j;var b=this.add(c);this.setActiveTab(b)}}else{a=false}}if(a==true&&j&&f){lastHist="&p1="+f+"&p2="+j;setTimeout(function(){hist.addHistory(lastHist)},10)}},i1:function(){var c=this,b=$("#mbutton1"),e=$("#idv_recitems"),d=$("#welcome"),a;c.mviewer={mode:"recent",mrecenttext:b.text()};b.unbind("click");b.bind("click",function(){c.i1_1.call(c)});a=[{html:$("#main-getting-started",d),handler:function(){IG$._I65("CMD_APP_WIZARD")}},{html:$("#main-navigator",d),handler:function(){IG$._I7e(1)}},{html:$("#main-features",d),handler:function(){}}];$.each(a,function(f,g){if(g.html&&g.html.length>0&&g.handler){g.html.bind("click",function(){g.handler()})}});c.iLL();c.i1_1()},ii1:function(){var h=IG$._n26,c=h.body.dom,f=$(".ig-mgr-body",c),j=$(".ig-mgr-panel-close",c),d=ig$.mainmenu.mainmenu,b,e,k,a,g;j.bind("click",function(){IG$._I65("CMD_HOME")});f.empty();if(!d){return}$.each(d,function(l,m){g=$("<ul class='ig-mgr-group'></ul>").appendTo(f);m.tul=g;m.tul.hide();m.menus&&$.each(m.menus,function(o,n){var i=$("<li class='ig-mgr-group-item "+(n.acls||"")+"'><h3>"+(IRm$.r1(n.rcs)||n.text)+"</h3><ul class='ig-mgr-menu'></ul></li>").appendTo(g),p=$(".ig-mgr-menu",i);$.each(n.items,function(r,q){var s=$("<li class='ig-mgr-menu-item "+(q.acls||"")+"'>"+(IRm$.r1(q.rcs)||q.text)+"</li>").appendTo(p);s.bind("click",function(){if(q.handler){q.handler.call(this)}else{if(q.cmd=="logout"){IG$._I8a(new IG$._I3d(this,IG$._I8b))}else{if(q.cmd){IG$._I65(q.cmd)}}}})})})})},iLL:function(){var i=$("#last_login"),h,a,e=IG$.__1,d=IG$._I83?IG$._I83.jS1:null,j,g,c,f,b;if(i&&i.length>0&&d&&IG$._I83.lastLogin){f=$(".last_login_time",i);b=$(".last_login_host",i);c=$(".cur_login_host",i);j=$(".cur_login_user_id",i);g=$(".cur_login_user_nm",i);h=IG$._I83.lastLogin.lastaccesstime;j.text(d.u1);g.text(d.username);if(h){a=IG$._I40(h);f.text(a);b.text(IG$._I83.lastLogin.lastaccessaddr+", "+IG$._I83.lastLogin.lastaccesshost);c.text(IG$._I83.lastLogin.accessaddr+", "+IG$._I83.lastLogin.accesshost)}}},i1_1:function(){var a=this,c=$("#idv_recitems"),b=new IG$._I3e();b.init(a,{ack:"11",payload:IG$._I2d({}),mbody:IG$._I2e({option:"bookmarks"})},a,a.rs_sK3,null,null);b._l()},rs_sK3:function(h){var a=this,m=$("#idv_recitems"),f,b=IG$._I18(h,"/smsg"),k=(b)?IG$._I26(b):null,l=[],o,d=3,e=[],n={},j;m.empty();if(k&&k.length>0&&m){for(f=0;f<d;f++){j=$("<div class='recent-columns'></div>").appendTo(m);j.css({width:(100/d)+"%","float":"left"});e.push({div:j,di:false})}for(f=0;f<k.length;f++){o=IG$._I1c(k[f]);if(n[o.uid]){n[o.uid].fatype=o.fatype=="F"?o.fatype:n[o.uid].fatype}else{n[o.uid]=o;l.push(o)}}l.sort(function(p,i){var q=0;if(p.type!=i.type){q=(p.type>i.type)?1:-1}return q});a.shortcuts={};var c=0,g;$.each(l,function(t,u){var r,s,q;if(t==0){r=e[0];s=r.div;$("<div class='recent-itemtype'><span>"+IRm$.r1("D_"+u.type.toUpperCase())+"</span></div>").appendTo(s)}else{if(g&&g!=u.type){c=(c+1)%e.length;r=e[c];s=r.div;q=$("<div class='recent-itemtype'><span>"+IRm$.r1("D_"+u.type.toUpperCase())+"</span></div>").appendTo(s);if(r.di){q.css({marginTop:"20px"})}}else{r=e[c];s=r.div}}r.di=true;var p=$("<div class='recent-row' title='"+u.nodepath+"'></div>");var v=$("<span "+(u.fatype=="F"?"class='ig-fa-mark'":"")+">"+u.name+"</span>");v.bind("click",function(){IG$._n1(u.uid)});p.append(v);s.append(p);g=u.type})}},deferredRender:true,onAdd:function(b,a){Ext.tab.Panel.prototype.onAdd.call(this,b,a)},initComponent:function(){var d=this,c=[].concat(d.dockedItems||[]),a=d.activeTab||(d.activeTab=0),b=d.tabPosition,e;d.layout={owner:d,type:"card",deferredRender:d.deferredRender,itemCls:d.itemCls,activeItem:a};IG$._n12t=new Ext.tab.Bar({ui:d.ui,dock:"top",id:"ig-tabbar",cls:"ig-main-tabbar",flex:1,orientation:"horizontal",plain:true,cardLayout:d.layout,tabPanel:d,padding:0,margin:0,bodyPadding:0,listeners:{}});d.tabBar=IG$._n12t;d.callParent(arguments);d.setActiveTab=function(f){IG$._I7e(2);Ext.tab.Panel.prototype.setActiveTab.call(d,f)};d.getActiveTab=Ext.tab.Panel.prototype.getActiveTab;d.getTabBar=Ext.tab.Panel.prototype.getTabBar;d.onItemEnable=Ext.tab.Panel.prototype.onItemEnable;d.onItemDisable=Ext.tab.Panel.prototype.onItemDisable;d.onItemBeforeShow=Ext.tab.Panel.prototype.onItemBeforeShow;d.onItemIconChange=Ext.tab.Panel.prototype.onItemIconChange;d.onItemIconClsChange=Ext.tab.Panel.prototype.onItemIconClsChange;d.onItemTitleChange=Ext.tab.Panel.prototype.onItemTitleChange;d.doRemove=Ext.tab.Panel.prototype.doRemove;d.onRemove=function(h,i){Ext.tab.Panel.prototype.onRemove.call(d,h,i);var f=d.items.length;if(f==0){var g=IG$._IM3;IG$._I7e(IG$.__atab)}};a=d.activeTab=d.getComponent(a);if(a){d.tabBar.setActiveTab(a.tab,true)}},listeners:{beforeadd:function(b,c,d,g){var f=this,e=f.getTabBar(),h=ig$.maxtapcount||0,a;if(h>0&&f.items.length>=h){a=f.items.items[0];f.remove(a)}}}});IG$._I67=function(){this.addHistory=function(a){unFocus.History.addHistory(a)};this.hasMenu=function(){var f=unFocus.History.getCurrent();if(f&&f!=""){var a=f.split("&"),h,g,d,c,b,j,e;for(d=0;d<a.length;d++){e=a[d];j=e.indexOf("=");if(j>0){c=e.substring(0,j);b=e.substring(j+1);switch(c){case"lang":break;case"p1":h=b;break;case"p2":g=b;break}}}if(h&&g){return true}}return false};this.historyListener=function(){var a=unFocus.History.getCurrent();if(a!=null&&a!=""&&IG$._I83.jS1){IG$._n1(a)}return a};unFocus.History.addEventListener("historyChange",this.historyListener)};IG$._n1=function(f){if(f&&f.length>0&&lastHist!=f){if(IG$._I07(f)){g=f}else{var a=f.split("&"),h,g,d,c,b,j,e;for(d=0;d<a.length;d++){e=a[d];j=e.indexOf("=");if(j>0){c=e.substring(0,j);b=e.substring(j+1);switch(c){case"lang":break;case"p1":h=b;break;case"p2":g=b;break}}}}if(g){IG$._n2(g,h)}}};IG$._n2=function(c,b,e,a){var d=new IG$._I3e();d.init(null,{ack:"11",payload:IG$._I2d({uid:c}),mbody:IG$._I2e({option:"translate"})},null,function(m){var f=IG$._I18(m,"/smsg/item"),p=IG$._I1b(f,"uid"),k=IG$._I1b(f,"type").toLowerCase(),n=IG$._I1b(f,"name"),g=IG$._I1b(f,"nodepath"),o=(IG$._I1b(f,"manage")=="T"||IG$._I1b(f,"writable")=="T")?true:false,h=false;if(k=="dashboard"&&b=="dashboardedit"){k=b}else{if(k=="export"){h=true;k="report"}}if(h==true){var q=$(document),j=$("#main"),i={renderTo:j[0],minHeight:q.height(),address:g,closable:false,_ts_:false,hiddenstatusbar:true,hiddentoolbar:true,header:false,title:IG$._I28(n)},l=null;pitem=IG$._I61(p,k,n,g,o,i);pitem.on({_lc0:function(){},_lc1:function(){var r=pitem.calcSize.call(pitem);pitem.setSize(r.width,r.height)},resize:function(v,w,r,s,y,u){var x=$(document.body);IG$.x_10._w(j,w);IG$.x_10._h(j,r);IG$.x_10._w(x,w);IG$.x_10._h(x,r)}});pitem.updateLayout();pitem.setSize(q.width(),q.height());j.css({minHeight:(q.height()+"px")})}else{IG$._I7d.m1$7.call(IG$._I7d,p,k,n,g,(typeof(a)=="undefined"?true:a),o,null,e)}},null);d._l()};var hist,lastHist;IG$._I7e=function(h,a){var k=IG$.appsel,e=k.getLayout(),f=ig$.mainmenu.mainmenu,g,b,j,d=h;switch(h){case 2:for(g=0;g<k.items.items.length;g++){if(k.items.items[g].name=="_I7d"){d=g;break}}break}e.setActiveItem(d);j=e.getActiveItem();if(h==1&&a){j=j.down("[name=mexplorer]");j._IPd.call(j,a)}if(h!=2){IG$.__atab=h}j._IQ4&&j._IQ4.call(j);if(h==4&&a){for(g=0;g<f.length;g++){b=f[g];b.tul&&b.tul[b.acls==a?"show":"hide"]()}}};IG$.$1=function(k){var j=IG$.__1,c,b,d,m,f,g,l,a=0,h=ig$.mainmenu.mainmenu,e;if(IG$.__1m||IG$.__ep==true){setTimeout(function(){$("#loading").fadeOut({complete:function(){$(this).remove()}});$("#loading-mask").fadeOut({complete:function(){$(this).remove()}})},(IG$.__ep?0:100));return}k=k||{};k.mainview=b=k.mainview||{},b.appmenu=d=b.appmenu||{};b.navitab=m=b.navitab||{},b.navitree=f=b.navitree||{};b.intropanel=mintro=b.intropanel||{};m.tabhidden=m.tabhidden||"F";m.hidden=m.hidden||"F";f.hidden=f.hidden||"T";d.bodyCls=typeof(d.bodyCls)=="undefined"?"idv-side-bar":d.bodyCls;d.explorer=d.explorer=="F"?false:true;if(typeof(d.html)=="undefined"){d.html="<div class='mainHeader'><div id='innerLogo' class='innerLogo'><span class='ig-c-text'>$APP_NAME</span><div class='ig-c-button'></div></div><ul class='mainNav' id='mainNav'></ul><div class='searchForm' id='searchForm'><input type='text' id='tsearch' placeholder='Search' class='searchKeyword' maxlength='1000' autocomplete='off'></input><span class='searchGo'></span></div></div><ul class='mainFooter' id='mainFooter'><li class='last'>$APP_COPY</li></ul>"}IG$.__ep=b.appmenu.printmode=="T";IG$.__ep_m=b.appmenu.runmode?parseInt(b.appmenu.runmode):0;if(!d.explorer&&h){for(e=0;e<h.length;e++){if(h[e].acls=="ig_mnav"){h.splice(e,1);break}}}if(IG$.__ep_m<1){g=[{xtype:"button",border:0,hidden:m.hidden=="T",margin:"0",cls:"ig-top-button",overCls:"ig-top-button-over",focusCls:"ig-top-button-click",text:IRm$.r1("S_HOME"),handler:function(){IG$._I7e(0)}},{xtype:"button",border:0,hidden:m.hidden=="T",text:IRm$.r1("S_NAVI"),cls:"ig-top-button",overCls:"ig-top-button-over",focusCls:"ig-top-button-click",margin:"0 5 0 0",handler:function(){IG$._I7e(1)}}]}l=[{id:"welcome-panel",cls:mintro.cls||"",header:false,title:null,autoLoad:{url:"./html/"+(ig$.intropage||"navi_intro")+"_"+(window.useLocale||"en_US")+".html",callback:IG$._I7d.i1,scope:IG$._I7d},iconCls:"icon-welcome",autoScroll:true},{xtype:"container",layout:"fit",items:IG$._I8e?[new IG$._I8e({name:"mexplorer",show_tree_items:ig$.uiconfig&&ig$.uiconfig.navigator?ig$.uiconfig.navigator.show_tree_items:false})]:null},IG$._I7d,{xtype:"panel",layout:"fit",bodyPadding:20,items:[{xtype:"panel",layout:{type:"vbox",align:"stretch"},items:[{xtype:"container",layout:"fit",flex:1,name:"dwizard",autoScroll:true},{xtype:"container",layout:"fit",height:40,name:"dwizard_bar"}]}]},{xtype:"panel",layout:"fit",bodyPadding:0,items:[{xtype:"panel",name:"dmgr",layout:"fit",autoScroll:true,autoLoad:{url:"./html/adm_menu_"+(window.useLocale||"en_US")+".html",callback:IG$._I7d.ii1,scope:IG$._I7d}}]}];if(m.items&&m.items.length>0){$.each(m.items,function(q,p){var n,o;if(p.mtype=="navitab"){if(p.type=="Dashboard"||p.type=="Report"){n=IG$._I61(p.uid,p.type.toLowerCase(),p.name,null,false,{closable:false,header:false});l.push(n);o=l.length-1;if(a==0){a=o}if(IG$.__ep_m<1){g.push({xtype:"button",border:0,text:p.name,cls:"ig-top-button",overCls:"ig-top-button-over",focusCls:"ig-top-button-click",margin:"0 5 0 0",handler:function(){IG$._I7e(o)},scope:this})}}}})}if(IG$.__ep_m>0){l.splice(0,2);a=0}if(IG$.__ep_m<1){g.push(IG$._n12t)}IG$.__atab=a;c=new $s.panel({layout:"border",padding:"0 0 0 0",items:[{xtype:"panel",width:d.width||223,ig_width_o:Number(d.o_width)||223,ig_width_c:Number(d.c_width)||30,height:d.height||null,region:d.region||"west",name:"appmenu",collapsible:false,collapsed:false,titleCollapse:false,hidden:d.hidden=="T",header:false,border:false,margins:"0 0 0 0",collapseMode:"mini",bodyCls:d.bodyCls||"",html:d.html,listeners:{afterrender:function(i){var q=$(i.body.dom),p=$("#mainFooter",q),o=$(".searchGo",q),n=$("#tsearch",q);p.css("position","absolute");n.bind("keyup",function(u){if(u.keyCode==13){var r=IG$.__1m,t,s=$(this).val();if(f.hidden=="F"){t=r.down("[name=mexplorer]");if(t){t._IPd.call(t,s)}}else{IG$._I7e(1,s)}}});o.bind("click",function(){var r=IG$.__1m,t,s=$(n).val();if(f.hidden=="F"){t=r.down("[name=mexplorer]");if(t){t._IPd.call(t,s)}}else{IG$._I7e(1,s)}})},resize:function(p,n,w,q,v,t){var r=(n<120)?true:false,o=$(this.body.dom),u=$("#mainFooter",o),y=$("#innerLogo",o),i=$("#searchForm",o),x=r?"hide":"show";u[x]();$(".ig-c-text",y)[x]();i[x]()}}},{xtype:"panel",region:"west",width:200,border:0,hidden:f.hidden=="T",border:false,margins:"0 0 0 0",collapseMode:"mini",split:true,header:false,collapsible:true,titleCollapse:false,layout:"fit",items:f.hidden=="F"?[new IG$._I8e({name:"mexplorer",vmode:"tree",flex:1,show_tree_items:true})]:null},{xtype:"container",region:"center",border:0,layout:"border",items:[{xtype:"container",region:"north",height:28,hidden:m.tabhidden=="T",padding:"2 2 2 2",layout:{type:"hbox",align:"stretch"},items:g},{xtype:"container",layout:"card",name:"appsel",region:"center",minTabWidth:40,deferredRender:false,activeItem:a,items:l}]}]});j.add(c);IG$._IM3=j.down("[name=mexplorer]");c.doLayout();IG$.__1m=c;IG$._I8d=c.down("[name=appmenu]");IG$.appsel=c.down("[name=appsel]");IG$._n25={dwizard:c.down("[name=dwizard]"),dwizard_bar:c.down("[name=dwizard_bar]")};IG$._n26=c.down("[name=dmgr]");setTimeout(function(){$("#loading").fadeOut({complete:function(){$(this).remove()}});$("#loading-mask").fadeOut({complete:function(){$(this).remove()}});if(IG$.__ep_l){IG$._n2(IG$.__ep_l,undefined,undefined,false)}},(IG$.__ep?0:50))};$s.ready(function(){$("#lpt","#loading").css("width","80%");if(ig$.timer_ping&&ig$.timer_ping>100){setInterval(function(){var a=new IG$._I3e();a.init(null,{ack:"34",payload:IG$._I2d({}),mbody:IG$._I2e({})},null,function(b){},false);a._l()},ig$.timer_ping)}IRm$.r2({func:function(){$("#lpt","#loading").css("width","100%");setTimeout(function(){var d,c;IG$.lE.rcsloaded=true;IG$._I7d=new IG$._N12({name:"_I7d"});IG$._I7d.on("tabchange",function(h,g){});c={closeText:IRm$.r1("L_C_CLOSE"),prevText:IRm$.r1("L_C_PREV"),nextText:IRm$.r1("L_C_NEXT"),currentText:IRm$.r1("L_C_CUR"),monthNames:IRm$.r1("L_C_M_NAMES").split("#"),monthNamesShort:IRm$.r1("L_C_M_NAMES_S").split("#"),dayNames:IRm$.r1("L_C_D_NAMES").split("#"),dayNamesShort:IRm$.r1("L_C_D_NAMES_S").split("#"),dayNamesMin:IRm$.r1("L_C_D_NAMES_M").split("#"),weekHeader:IRm$.r1("L_C_W_H"),firstDay:0,isRTL:false,showMonthAfterYear:true,yearSuffix:IRm$.r1("L_C_YR_SFX")};$.datepicker.setDefaults(c);IG$.r_cl_lc=c;IG$._IM3=null;$.each(IG$.lE.items,function(g,h){IG$.extend(h.name,h.base,h.option)});$.each(IG$._IE1,function(h,j){var g=j[4];j[1]=IRm$.r1(g)});var a=new $s.viewport({layout:"fit",id:"mainview"});a.doLayout();IG$.__1=a;var b=$.cookie("lui")||"";var f="";IG$._I88(b,f,true);IG$._I14();var e=new IG$._I3e();e.init(null,{ack:"11",payload:IG$._I2d({}),mbody:IG$._I2e({option:"ls",mts:(window.m$mts||""),lang:(window.useLocale||"")})},null,function(g){var j=IG$._I18(g,"/smsg"),i=false;if(j){var h=IG$._I1b(j,"uuid");if(h){i=true;IG$._I83.callback=new IG$._I3d(this,IG$._I8b);IG$._I83.uuid=h;IG$._I83.mts={sid:IG$._I1b(j,"mts"),name:IG$._I1b(j,"mts_name")};IG$._g$a=IG$._I83.mts.sid;if(window.m$mts&&IG$._I83.mts.name!=window.m$mts&&IG$._I83.mts.sid!=window.m$mts){IG$._I8a(new IG$._I3d(this,IG$._I8b));return}IG$._I83.lastLogin={lastaccesstime:IG$._I1b(j,"lastaccesstime"),lastaccesshost:IG$._I1b(j,"lastaccesshost"),lastaccessaddr:IG$._I1b(j,"lastaccessaddr"),accesshost:IG$._I1b(j,"accesshost"),accessaddr:IG$._I1b(j,"accessaddr"),accesstime:IG$._I1b(j,"accesstime")};if(IG$._I7d){IG$._I7d.iLL.call(IG$._I7d)}IG$._I83.Js4.call(IG$._I83,false);hist=new IG$._I67();hist.historyListener();if(typeof window.callPhantom==="function"){window.callPhantom({_proc:"C"})}}}if(i==false){IG$._I89(new IG$._I3d(this,IG$._I8b),0)}},function(g){IG$._I89(new IG$._I3d(this,IG$._I8b),0);return true});e._l()},(IG$.__ep?10:30))}})});IG$._n5=function(){var c=ig$.session,b=ig$.session_expire*60,a=false,d=-1;if(c){$(document).bind("mousemove",function(){c.count=0;if(a==false){if(d>-1){clearTimeout(d);d=-1}d=setTimeout(function(){a=true;var e=new IG$._I3e();e.init(null,{ack:"11",payload:"<smsg><item mode='write'/></smsg>",mbody:"<smsg><info option='wake'></info></smsg>"},null,function(f){a=false;c.count=0},null);e._l()},2000)}});c.timer=setInterval(function(){var g=b-c.count,f="",h=0,e;if(g>60){h=Math.floor(g/60);e=g-(h*60)}else{e=g}if(h>0){f=h+" min "+e+" sec"}else{f=e+" sec"}if(g<300){c.text.addClass("warn-sess-timer")}else{c.text.removeClass("warn-sess-timer")}c.text.html(f);if(g<0){clearInterval(c.timer);IG$._I8a(new IG$._I3d(this,IG$._I8b))}c.count+=1},1000)}};IG$.sPPL=function(){var a=new IG$._I3e();a.init(null,{ack:"11",payload:IG$._I2f({mode:"read"}),mbody:IG$._I2e({option:"rsn",readmode:0})},null,IG$.rs_sPPL,function(b){return true});a.showerror=false;a._l()};IG$.rs_sPPL=function(b){var d,e,h,a,g=$("#chatsublist"),f=IG$._I18(b,"/smsg"),c=IG$._I26(f);if(c&&c.length>0&&IG$.L_SPPL){h=IG$._I1c(c[0]);if(h.msgid==IG$.L_SPPL){return}}g.empty();g.append($("<li class='view'><span><a href='javascript:f$7(\"CMD_RSN\")'>Write Message</a></span></li>"));if(c&&c.length>0){a=Math.min(5,c.length);if(IG$.L_SPPL){$("#alertstext").text("Messages (New)")}for(d=0;d<a;d++){h=IG$._I1c(c[d]);if(d==0){IG$.L_SPPL=h.msgid}e="<li><a href='#' class='delete'>X</a><p><span style='color:#0000ff;'>"+(h.username||"")+": </span><br>"+IG$._I24(c[d])+" <br><span style='color:#4d4d4d; font-size: 9px; float: right'>("+(IG$._I43(h.updatedate,true)||"")+")</span></p></li>";g.append($(e))}}};IG$._I8c=function(){if(!IG$._I8d){return}var e=IG$._I8d,a=$(e.body.dom),h=$("#mainFooter",a),c=$("#mainNav",a),j=$("#innerLogo",a),f=ig$.mainmenu,g,b=ig$.fm,d=$(".ig-c-button",j);d.unbind("click");d.bind("click",function(){var i=e.getWidth();if(i<150){a.removeClass("igc-t-collapsed");e.setWidth(e.ig_width_o)}else{a.addClass("igc-t-collapsed");e.setWidth(e.ig_width_c)}});if(f){if(f.footmenu){for(g=0;g<f.footmenu.length;g++){if(f.footmenu[g].html){f.footmenu[g].html.remove();f.footmenu[g].html=null}}$.each(f.footmenu,function(n,k){var l=$("<li"+(k.acls?" class='"+k.acls+"'":"")+"><span>"+(k.rcs?IRm$.r1(k.rcs):k.text)+"</span></li>");h.prepend(l);l.bind("click",function(){if(k.handler){k.handler.call(this)}else{if(k.cmd=="logout"){IG$._I8a(new IG$._I3d(this,IG$._I8b))}else{if(k.cmd){IG$._I65(k.cmd)}}}});k.html=l})}if(f.mainmenu&&b){for(g=0;g<f.mainmenu.length;g++){if(f.mainmenu[g].html){f.mainmenu[g].html.remove();f.mainmenu[g].html=null}}$.each(f.mainmenu,function(q,k){var u;if(k.acls&&b[k.acls]==true){return}var l=$("<li class='"+(k.acls||"")+"'></li>").appendTo(c),r=$("<span class='parent'>"+(k.rcs?IRm$.r1(k.rcs):k.text)+"</span>").appendTo(l),p;if(b[k.acls]===false){l.show()}if(k.cmd){IG$._I65(cmd)}else{if(k.handler){p=function(n){var t={x:n.pageX,y:n.pageY},m=$(".flyout"),i=false;$.each(f.mainmenu,function(x,v){var w=v.html,z,y;if(w&&i==false){z=w.offset();y={x:z.left,y:z.top,w:IG$.x_10._w(w),h:IG$.x_10._h(w)};if(y.x<t.x&&t.x<y.x+y.w&&y.y<t.y&&t.y<y.y+y.h){i=true}}});if(i==false){$.each(f.mainmenu,function(w,v){v.sv=0})}m.hide();$(document).unbind("mouseup",p)};r.bind("click",function(t){var m=$(".flyout",l),n=1,i;if(m&&m.length>0){i=k.sv;$(".flyout").hide();$.each(f.mainmenu,function(w,v){if(v!=k){v.sv=0}});if(i){k.sv=0;n=1}else{k.sv=1;m.show();$(document).bind("mouseup",p);n=0}}if(n==1){k.handler()}})}}k.html=l;if(k.menus){if(k.type=="column"){var o=$("<div class='flyout'><h3><span class='rightRaquoBlue'>"+(k.rcs?IRm$.r1(k.rcs):k.text)+"</span></h3></div>").appendTo(l),s=$("<div class='colwrapper'>").appendTo(o);$.each(k.menus,function(n,w){var v=$("<div class='column"+(w.acls?" "+w.acls:"")+"'><h6>"+(w.rcs?IRm$.r1(w.rcs):w.text)+"</h6></div>").appendTo(s);if(w.type=="list"){var i=$("<ul class='"+(w.acls||"")+"'></ul>").appendTo(v);$.each(w.items,function(x,y){$("<li class='chevronLink"+(y.acls?" "+y.acls:"")+"'><span>"+(y.rcs?IRm$.r1(y.rcs):y.text)+"</span></li>").appendTo(i).bind("click",function(){if(y.cmd){IG$._I65(y.cmd)}})})}else{if(w.type=="image"){var t,m;t=w.src&&$("<img src='"+w.src+"'></img>").appendTo(v);m=w.desc&&$("<h3>"+w.desc+"</h3>").appendTo(v);if(w.cmd){t.bind("click",function(){IG$._I65(w.cmd)});m.bind("click",function(){IG$._I65(w.cmd)})}}}})}}})}if(f.afterrender){f.afterrender.call(this,f)}}};IG$._I8b=function(){var b=$("#loginWindow"),a=$("#userid");b.hide();IG$._IM3&&IG$._IM3._IQ3.call(IG$._IM3);lastHist=null;if(!hist){hist=new IG$._I67()}hist.historyListener();if(a&&a.length>0){a[0].value=IG$._I83.jS1.u1}if(!IG$.__ep){IG$._I8c();IG$._I7d.i1.call(IG$._I7d)}};IG$.showLoginProc=IG$._I8b;$.fn.adjustPanel=function(){$(this).find("ul, .subpanel").css({height:"auto"});var d=$(window).height();var c=$(this).find(".subpanel").height();var a=d-100;var b=a-25;if(c>=a){$(this).find(".subpanel").css({height:a});$(this).find("ul").css({height:b})}else{if(c<a){$(this).find("ul").css({height:"auto"})}}};function loadFooterCtrl(){$("#chatpanel").adjustPanel();$("#alertpanel").adjustPanel();$(window).resize(function(){$("#chatpanel").adjustPanel();$("#alertpanel").adjustPanel()});$("#chatpanel a:first, #alertpanel a:first").click(function(){if($(this).next(".subpanel").is(":visible")){$(this).next(".subpanel").hide();$("#idv-mnu-pnl li a").removeClass("active");$("#alertstext").text("Messages")}else{$(".subpanel").hide();$(this).next(".subpanel").toggle();$("#idv-mnu-pnl li a").removeClass("active");$(this).toggleClass("active")}return false});$(document).click(function(){$(".subpanel").hide();$("#idv-mnu-pnl li a").removeClass("active")});$(".subpanel ul").click(function(a){a.stopPropagation()});$("#alertpanel li").hover(function(){$(this).find("a.delete").css({visibility:"visible"})},function(){$(this).find("a.delete").css({visibility:"hidden"})})};