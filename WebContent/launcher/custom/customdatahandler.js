var m$dor = function(reqolap, mresults) {
	// uid ���� ������ �ּ�â���� �߶�� ���ϼ� ����.
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
			var tcolumn = 1; // ������ �ִ� �÷� �ε���
			for (i=rowfix; i < data.length; i++)
			{
				cell = data[i][tcolumn];
				if (cell.position == 4) // none: 0, row: 1, col: 2, measure: 3, formula: 4, microchart: 5
				{
					for (j=colfix; j < cols; j++)
					{
						tcell = data[0][j];			// ����κ� 0��° �ο��� ���� �о�´�.
						
						if (tcell.code == "sales")  // �ؽ�Ʈ�� sales �� �׸��� �����ϴ� ����
						{
							mcell = data[i][j];		// �ؽ�Ʈ�� sales �̰� ������ ��
							mcell.text = "";		// ���� �����ش�.
							mcell.code = "";
						}
					}
				}
			}
		}
	}
}