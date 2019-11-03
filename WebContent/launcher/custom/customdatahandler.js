var m$dor = function(reqolap, mresults) {
	// uid 값은 브라우저 주소창에서 잘라다 붙일수 있음.
	if (reqolap.uid == "10312016-36044a80" && reqolap.panel.sheetindex == 0 && mresults.results && mresults.results.length > 0)
	{
		var res = mresults.results[0],
			i, j,
			cols = res.cols,
			rows = res.rows,
			rowfix = res.rowfix,
			colfix = res.colfix,
			data = res.data,
			cell, tcell, mcell;
			
		if (cols > 0 && rows > 0 && data)
		{
			var tcolumn = 1; // 수식이 있는 컬럼 인덱스
			for (i=rowfix; i < data.length; i++)
			{
				cell = data[i][tcolumn];
				if (cell.position == 4) // none: 0, row: 1, col: 2, measure: 3, formula: 4, microchart: 5
				{
					for (j=colfix; j < cols; j++)
					{
						tcell = data[0][j];			// 헤더부분 0번째 로우의 값을 읽어온다.
						
						if (tcell.code == "sales")  // 텍스트가 sales 인 항목을 제거하는 역할
						{
							mcell = data[i][j];		// 텍스트가 sales 이고 수식인 행
							mcell.text = "";		// 값을 지워준다.
							mcell.code = "";
						}
					}
				}
			}
		}
	}
}