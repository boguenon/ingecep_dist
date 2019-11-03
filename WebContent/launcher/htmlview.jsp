<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import = "com.mplix.O.eA" %>
<%@ page import = "java.io.FileInputStream" %>
<%@ page import = "java.io.ByteArrayOutputStream" %>
<%@ page import = "java.io.DataOutputStream" %>
<%@ page import = "java.net.URLEncoder" %>
<%
    request.setCharacterEncoding("utf-8");
    String _d = request.getParameter("_d");
    String ukey = "?_d=" + _d;
    String lang = request.getParameter("lang");
    lang = (lang == null) ? "en_US" : lang;
	
	String mts = request.getParameter("mts");
    mts = (mts == null) ? "" : mts;
    
    String p2 = request.getParameter("p2");
    
    if (p2 != null && p2.equals("") == false)
    {
    	String fname = null;
    	
    	if (eA.B != null && eA.B.C != null)
		{
			fname = eA.B.C + "/repository/" + p2;
		}
		 
		FileInputStream fis = new FileInputStream(fname);
		ByteArrayOutputStream bos = new ByteArrayOutputStream();  
		DataOutputStream dos = new DataOutputStream(bos);
			
		int len;
		byte[] buf = new byte[1024];
			
		while ((len = fis.read(buf)) > 0) {
            dos.write(buf, 0, len);
        }
			
		// String f_encname = URLEncoder.encode(p_content, "UTF-8");
			
		byte[] bytes = bos.toByteArray();
		// res.setHeader("Content-Disposition", "attachment; filename=\"" + f_encname + "\"");
		
		// ServletOutputStream outstream = response.getOutputStream();
		// outstream.write(bytes);
		// outstream.flush();
		out.print(new String(bytes, "UTF-8"));
    }
%>