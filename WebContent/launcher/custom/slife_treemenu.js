function c_menu_handler(menu, title, url) {
	var userid = IG$._I83/*dlgLogin*/ ? IG$._I83/*dlgLogin*/.jS1/*loginInfo*/.u1 : null;
	
	userid = userid ? Base64.encode(userid) : null;
	
	if (userid)
	{
		var maintab = IG$/*mainapp*/._I7d/*mainPanel*/, 
			mypanel,
			popt,
			uid = menu.uid || menu.stype || menu.name;
		
		url += "?userid=" + userid;
		
		popt = {
			title: title,
			closable: true,
			layout: "fit",
			id: uid,
			items: [
				{
					// 아이프레임으로 외부 링크 사용 가능
					html: "<iframe width='100%' height='100%' src='" + url + "' style='position: absolute'></iframe>"
				}
			]
		};
		
		if (window.Ext)
		{
			// 개발 화면인 경우
			mypanel = Ext.create(Ext.panel.Panel, popt);
		}
		else
		{
			// 데시보드 인 경우
			popt.xtype = "panel";
			popt.items[0].xtype = "panel";
			mypanel = new IG$/*mainapp*/.pb(popt);
		}
		
		maintab.customAddTab(uid, mypanel);
	}
}

ig$/*appoption*/.c_menus = {
	menus: [
// 1-st menu	
		{
			name: "EV 자동화 시스템" , // 아이콘 버튼 이름 / itemicon.css라는 파일에 정의된 아이콘을 사용하고 있음.
			stype: "menu01",
			url: "test",
			iconCls: "icon-custom-sample", // 아이콘 class
			auth: {
				"admins": 1 ,
				"ev_group": 1
			},
			handler: function(menu) {
				//alert(menu.stype + menu.url);
			}	,
			children: [ 

// TEV 관리 화면
				{
					name: "계리-EV산출", 
					stype: "menu01a",
					iconCls: "icon-javapackage",
					auth: {
						"admins": 1 ,
						"ev_group": 1
					},
					handler: function(menu) {
						c_menu_handler(menu, "계리-EV산출", "http://ap1.t.evmsys.samsunglife.kr:8080/ev/listRunJob.ec");
					}
				}	
			]  // end of TEV children..
	  },
	// 2-st menu
		{
			name: "EC 자동화 시스템", // 아이콘 버튼 이름 / itemicon.css라는 파일에 정의된 아이콘을 사용하고 있음.
			stype: "menu02",
			url: "test",
			iconCls: "icon-custom-sample", // 아이콘 class
			auth: {
				"admins": 1 ,
				"rm_group": 1,
				"prd_group": 1
			},
			handler: function(menu) {
				//alert(menu.stype + menu.url);
			},
			children: [  // children을 사용해서 하위 폴더나 아이콘을 만들 수 있음

// 보유계약 관리 화면
				{
					name: "보유계약-EC산출", 
					stype: "menu02a",
					iconCls: "icon-javapackage",
					auth: {
						"admins": 1 ,
						"rm_group": 1
					},

					handler: function(menu) {
						c_menu_handler(menu, "보유계약-EC산출", "http://ap1.t.evmsys.samsunglife.kr:8080/ib/listRunJob.ec");
					}
				},
// 신계약 관리 화면
				{
					name: "신계약-EC산출", 
					stype: "menu02b",
					iconCls: "icon-javapackage",
					auth: {
						"admins": 1 ,
						"rm_group": 1,
						"prd_group": 1
					},

					handler: function(menu) {
						c_menu_handler(menu, "신계약-EC산출", "http://ap1.t.evmsys.samsunglife.kr:8080/nb/listRunJob.ec");
					}
				},
// 외부 Monitoring 업로드
				{
					name: "외부 파일관리", 
					stype: "menu02c",
					iconCls: "icon-javapackage",
					auth: {
						"admins": 1 ,
						"rm_group": 1
					},

					handler: function(menu) {
						// Open windows
						//window.open("http://www.samsunglife.co.kr/");
						c_menu_handler(menu, "외부 파일관리", "http://ap1.t.evmsys.samsunglife.kr:8080/mntr/listMainJob.ec");
					}
				}
// end of Children [main]			
			]
		}
	]
};
