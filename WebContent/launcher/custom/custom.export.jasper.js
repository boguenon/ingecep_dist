window.IExport = window.IExport || {};

IExport["jasper"] = {
	name: "jasper",
	params: [
		"jasper_template", "pdf_output", "pdf_label", "rtf_output", "rtf_label", "ppt_output", "ppt_label", "excel_label", "excel_output",
		"xlsx_label", "xlsx_output", "html_output", "html_label", "docx_output", "docx_label", "xml_output", "xml_label"
	],
	toolbar: {
		xtype: "splitbutton",
		iconCls: 'icon-toolbar-export',
    	name: "jasper",
    	hidden: true,
    	tooltip: IRm$/*resources*/.r1('L_EXPORT'),
    	menu: {
    		xtype: "menu",
    		items: [
			]
    	},
    	handler: function() {
    		if (this.dft_jasp_exp)
    		{
    			IExport["jasper"].exportReport(this, this.dft_jasp_exp);
    		}
    	}
	},
	
	exportReport: function(panel, jaspfiletype) {
		var rop = panel._ILa/*reportoption*/,
			expoption = rop.exportOption,
			fname = rop.name,
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			exportdata,
			filetype = "TMPL";
			
		fname = fname.replace(/\./g, "_");
		fname = fname.replace(/ /g, "");
		
		fname += "." + jaspfiletype;
			
		exportdata = panel._IB4/*getExportData*/(expoption, "jasper");
		
		req.init(panel, 
			{
	            ack: "20",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({
	            	uid: panel.uid,
	            	type: filetype,
	            	filename: fname,
	            	fonttype: (expoption && expoption.fonttype ? expoption.fonttype : ""),
	            	utemplate: "T",
	            	tmplpage: expoption.jasper && expoption.jasper.jasper_template,
	            	jasper_filetype: jaspfiletype
	            }, "uid;type;filename;fonttype;utemplate;tmplpage;jasper_filetype"),
	            mbody: exportdata
	        }, panel, panel.r_IB3/*exportToFile*/, null, fname);
	    req._l/*request*/();
	},
	
	toolbarShow: function(report) {
		var rop = report._ILa/*reportoption*/,
			expoption = rop.exportOption,
			jopt = expoption ? expoption["jasper"] : null,
			titem = report.down("[name=jasper]"),
			r = false,
			n = 0;
		
		if (jopt && jopt.jasper_template)
		{
			r = true;
			
			titem.menu.removeAll();
			
			report.dft_jasp_exp = null;
			
			$.each(["pdf", "rtf", "ppt", "excel", "xlsx", "docx", "html", "xml"], function(i, k) {
				if (jopt[k + "_output"] == "T") 
				{
					if (n == 0)
					{
						report.dft_jasp_exp = k;
					}
					titem.menu.add({
						xtype: "menuitem",
						text: k,
						handler: function() {
				    		IExport["jasper"].exportReport(report, k);
				    	}
					});
					n++;
				}
			});
		}
		
		return r;
	},
		
	configPanel: {
		xtype: "panel",
		title: "Jasper Report",
		layout: "anchor",
		defaults: {
			anchor: "100%"
		},
		items: [
			{
				fieldLabel: "Template",
				name: "jasper_template",
				xtype: "combobox",
				queryMode: 'local',
				valueField: "value",
				displayField: "name",
				editable: false,
				store: {
					xtype: "store",
					fields: [
						"name", "value"
					]
				}
			},
			{
				xtype: "fieldset",
				title: "Output Format",
				layout: "anchor",
				defaults: {
					anchor: "100%",
					
					layout: {
						type: "hbox",
						anchor: "100%"
					}
				},
				items: [
					{
						xtype: "fieldcontainer",
						defaults: {
							flex: 1,
							labelWidth: 60
						},
						items: [
							{
								xtype: "checkbox",
								fieldLabel: "PDF",
								name: "pdf_output",
								labelAlign: "right"
							},
							{
								xtype: "textfield",
								fieldLabel: "Label",
								name: "pdf_label",
								labelAlign: "right"
							}
						]
					},
					{
						xtype: "fieldcontainer",
						defaults: {
							flex: 1,
							labelWidth: 60
						},
						items: [
							{
								xtype: "checkbox",
								fieldLabel: "RTF",
								name: "rtf_output",
								labelAlign: "right"
							},
							{
								xtype: "textfield",
								fieldLabel: "Label",
								name: "rtf_label",
								labelAlign: "right"
							}
						]
					},
					{
						xtype: "fieldcontainer",
						defaults: {
							flex: 1,
							labelWidth: 60
						},
						items: [
							{
								xtype: "checkbox",
								fieldLabel: "PPT",
								name: "ppt_output",
								labelAlign: "right"
							},
							{
								xtype: "textfield",
								fieldLabel: "Label",
								name: "ppt_label",
								labelAlign: "right"
							}
						]
					},
					{
						xtype: "fieldcontainer",
						defaults: {
							flex: 1,
							labelWidth: 60
						},
						items: [
							{
								xtype: "checkbox",
								fieldLabel: "Excel",
								name: "excel_output",
								labelAlign: "right"
							},
							{
								xtype: "textfield",
								fieldLabel: "Label",
								name: "excel_label",
								labelAlign: "right"
							}
						]
					},
					{
						xtype: "fieldcontainer",
						defaults: {
							flex: 1,
							labelWidth: 60
						},
						items: [
							{
								xtype: "checkbox",
								fieldLabel: "Excel",
								name: "xlsx_output",
								labelAlign: "right"
							},
							{
								xtype: "textfield",
								fieldLabel: "Label",
								name: "xlsx_label",
								labelAlign: "right"
							}
						]
					},
					{
						xtype: "fieldcontainer",
						defaults: {
							flex: 1,
							labelWidth: 60
						},
						items: [
							{
								xtype: "checkbox",
								fieldLabel: "Word docx",
								name: "docx_output",
								labelAlign: "right"
							},
							{
								xtype: "textfield",
								fieldLabel: "Label",
								name: "docx_label",
								labelAlign: "right"
							}
						]
					},
					{
						xtype: "fieldcontainer",
						defaults: {
							flex: 1,
							labelWidth: 60
						},
						items: [
							{
								xtype: "checkbox",
								fieldLabel: "HTML",
								name: "html_output",
								labelAlign: "right"
							},
							{
								xtype: "textfield",
								fieldLabel: "Label",
								name: "html_label",
								labelAlign: "right"
							}
						]
					},
					{
						xtype: "fieldcontainer",
						defaults: {
							flex: 1,
							labelWidth: 60
						},
						items: [
							{
								xtype: "checkbox",
								fieldLabel: "XML",
								name: "xml_output",
								labelAlign: "right"
							},
							{
								xtype: "textfield",
								fieldLabel: "Label",
								name: "xml_label",
								labelAlign: "right"
							}
						]
					}
				]
			}
		],
		listeners: {
			afterrender: function(tobj) {
				var panel = tobj.pt_p,
					ep = tobj.ep,
					opt = tobj.opt,
					lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
			
				lreq.init(panel, 
					{
			            ack: "11",
			            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
			            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "jasper"})
					}, panel,  function(xdoc) {
						var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
							tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
							i, p, dp = [],
							c, val;
						
						dp.push({name: IRm$/*resources*/.r1("B_SEL"), value: ""});
						for (i=0; i < tnodes.length; i++)
						{
							p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
							p.value = p.name;
							dp.push(p);
						}
						
						tobj.down("[name=jasper_template]").store.loadData(dp);
						
						for (i=0; i < ep.params.length; i++)
						{
							c = tobj.down("[name=" + ep.params[i] + "]");
							if (c && opt[ep.name])
							{
								val = opt[ep.name][ep.params[i]] || "";
								val = (val == "T" || val == "F") ? (val == "T" ? true : false) : val;
								c.setValue(val);
							}
						}
					}, false);
				
				lreq._l/*request*/();
			}
		}
	}
}