var m$dor = function(reqolap, mresults) {
	// uid 값은 브라우저 주소창에서 잘라다 붙일수 있음.
	// 신계약분석 2.보험별EV 및 EC - 1.EV 세부 - 계획
	if (reqolap.uid == "cda012c2-e6e34fba" && reqolap.panel.sheetindex == 0 && mresults.results && mresults.results.length > 0)
	{
		var res = mresults.results[0],
			i, j,
			cols = res.cols,
			rows = res.rows,
			rowfix = res.rowfix,
			colfix = res.colfix,
			data = res.data,
			cell, tcell, tcell2, mcell, sval;
			
		if (cols > 0 && rows > 0 && data)
		{
			var tcolumn = 1; // 수식이 있는 컬럼 인덱스
			for (i=rowfix; i < data.length; i++)
			{
				cell = data[i][tcolumn];
				if (cell.position == 4) // none: 0, row: 1, col: 2, measure: 3, formula: 4, microchart: 5
				{
					var total = NaN;
					var spval = NaN; // 특약계
					
					for (j=colfix; j < cols; j++)
					{
						tcell = data[0][j];			// 헤더부분 0번째 로우의 값을 읽어온다.
						tcell2 = data[1][j];
						
						mcell = data[i][j];		// 텍스트가 sales 이고 수식인 행
						
						if (tcell.code == "Total" || tcell.text == "Total")
						{
							total = Number(mcell.code);
						}
						else if (tcell.code == "특약計" || tcell.text == "특약計")
						{
							spval = Number(mcell.code);
						}
						else if (tcell2.code == "占(%)" || tcell2.text == "占(%)")  // 텍스트가 "占(%)" 인 항목을 제거하는 역할
						{
							mcell.text = "";		// 값을 지워준다.
							mcell.code = "";
							
							if (isNaN(total) == false && isNaN(spval) == false && spval != 0) // 계산후 값을 다시 적용해 준다.
							{
								sval = ( spval / total ) * 100;
								mcell.code = "" + sval;
								mcell.text = Number(sval).format("#,##0.00");
							}
							break;
						}
					}
				}
			}
		}
	}
	
	// 신계약분석 2.보험별EV 및 EC - 2.EV 세부 - 실적
	if (reqolap.uid == "f27584ca-0d7e4cea" && reqolap.panel.sheetindex == 0 && mresults.results && mresults.results.length > 0)
	{
		var res = mresults.results[0],
			i, j,
			cols = res.cols,
			rows = res.rows,
			rowfix = res.rowfix,
			colfix = res.colfix,
			data = res.data,
			cell, tcell, tcell2, mcell, sval;
			
		if (cols > 0 && rows > 0 && data)
		{
			var tcolumn = 1; // 수식이 있는 컬럼 인덱스
			for (i=rowfix; i < data.length; i++)
			{
				cell = data[i][tcolumn];
				if (cell.position == 4) // none: 0, row: 1, col: 2, measure: 3, formula: 4, microchart: 5
				{
					var total = NaN;
					var spval = NaN; // 특약계
					
					for (j=colfix; j < cols; j++)
					{
						tcell = data[0][j];			// 헤더부분 0번째 로우의 값을 읽어온다.
						tcell2 = data[1][j];
						
						mcell = data[i][j];		// 텍스트가 sales 이고 수식인 행
						
						if (tcell.code == "Total" || tcell.text == "Total")
						{
							total = Number(mcell.code);
						}
						else if (tcell.code == "특약計" || tcell.text == "특약計")
						{
							spval = Number(mcell.code);
						}
						else if (tcell2.code == "占(%)" || tcell2.text == "占(%)")  // 텍스트가 "占(%)" 인 항목을 제거하는 역할
						{
							mcell.text = "";		// 값을 지워준다.
							mcell.code = "";
							
							if (isNaN(total) == false && isNaN(spval) == false && spval != 0) // 계산후 값을 다시 적용해 준다.
							{
								sval = ( spval / total ) * 100;
								mcell.code = "" + sval;
								mcell.text = Number(sval).format("#,##0.00");
							}
							break;
						}
					}
				}
			}
		}
	}
}
