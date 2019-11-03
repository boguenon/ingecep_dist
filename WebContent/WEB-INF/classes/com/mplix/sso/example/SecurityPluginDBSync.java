package com.mplix.sso.example;

import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Properties;

import com.mplix.sso.SSOPlugin;

public class SecurityPluginDBSync
	extends SSOPlugin
{
	@Override
	public String beforeLogin(String userid, String password, HashMap<String, Object> iprop, HashMap<String, String> secfilter)
	{
		Connection con = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		String uid = null;
		System.out.println("tryLogin Extra");
		
		String mts = "0122483f-0155fb46";
		
		try
		{
			Driver driver = (Driver) 
            	Class.forName("org.gjt.mm.mysql.Driver").newInstance();
			DriverManager.registerDriver(driver);
			
			Properties prop = new Properties();
        	prop.setProperty("user", "root");
        	prop.setProperty("password", "password");
        	
            con = DriverManager.getConnection("jdbc:mysql://localhost/usersync", prop);
        
			String sql = "SELECT id, name, username, dept, email, password from __users where name=?";
			pstmt = con.prepareStatement(sql);
			pstmt.setString(1, userid);
			rs = pstmt.executeQuery();
			
			if (rs.next())
			{
				String dbpwd = rs.getString("password");
				
				if (dbpwd != null && dbpwd.equals(password) == true)
				{
					String username = rs.getString("username");
					String useremail = rs.getString("email");
					String gid = this.getGroupID(mts, rs.getString("dept"));
					
					uid = getRegisteredUserUUID(mts, userid);
					
					// logic to create user if user is not registered (automatic add user)
	            	if (uid == null)
	            	{
	            		uid = registerUserUID(mts, userid, password, gid, userid, useremail);
	            	}
				}
				
				System.err.println(">> check value : " + uid);
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try
			{
				if (rs != null)
				{
					rs.close();
				}
				rs = null;
				
				if (pstmt != null)
				{
					pstmt.close();
				}
				pstmt = null;
				
				if (con != null)
				{
					con.close();
				}
			}
			catch (Exception e)
			{
				con = null;
			}
		}
		
		return uid;
	}
	
	@Override
	public String tryLogin(String userid, String password, HashMap<String, Object> iprop, HashMap<String, String> secfilter)
	{
		// secfilter.put("sec_test", "aaa");
		// secfilter.put("sec_test2", "bbb");
		return "0122483f-0155fb46";
	}
	
	@Override
	public void dispose()
	{
		super.dispose();
	}
}