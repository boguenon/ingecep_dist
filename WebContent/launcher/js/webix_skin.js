webix.skin.compact = {
	topLayout:"clean",
	//bar in accordion
	barHeight:28,			//!!!Set the same in skin.less!!!
	tabbarHeight: 28,
	rowHeight:24,
	toolbarHeight:32,
	listItemHeight:24,		//list, grouplist, dataview, etc.
	inputHeight:28,
	buttonHeight: 28,
	inputPadding: 3,
	menuHeight: 26,
	labelTopHeight: 20,

	//margin - distance between cells
	layoutMargin:{ space:0, wide:15, clean:0, head:0, line:-1, toolbar:1, form:8, accordion: 10  },
	//padding - distance insede cell between cell border and cell content
	layoutPadding:{ space:0, wide:0, clean:0, head:0, line:0, toolbar:0, form:8, accordion: 0  },
	//space between tabs in tabbar
	tabMargin:2,
	tabOffset:0,
	tabBottomOffset: 10,

	calendarHeight: 70,
	padding:0,

	optionHeight: 20
};

webix.skin.set('compact')