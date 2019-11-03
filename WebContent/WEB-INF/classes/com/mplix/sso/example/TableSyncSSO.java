package com.mplix.sso.example;

import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.*;

import com.mplix.sso.SSOPlugin;

/*********
 * 
 * @author ING
 * Login backdoor process for system integration.
 */

public class TableSyncSSO
	extends SSOPlugin
{
	@Override
	public String beforeLogin(String userid, String password, HashMap<String, Object> iprop, HashMap<String, String> secfilter)
	{
		Connection meta_db_con = this.__con;
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		String mts = "0122483f-0155fb46";
		String uid = null;
		System.out.println("tryLogin Extra");
		
		try
		{
			// userid values from userid input (used to distinguish normal login and systemical try login)
            if (userid != null && userid.startsWith("sso_sim_b6118e61573e4aaa_key_map:") == true)
            {
            	HttpServletRequest request = (HttpServletRequest) iprop.get("request");
	        	HttpSession session = request.getSession(true);
	        	
	        	Object s_info = session.getAttribute("__sso_info");
	        	Object s_val_svr = session.getAttribute("__sso_val_svr");
	        	
	        	String __sso_info = (s_info != null) ? s_info.toString() : null;
	        	String __sso_val_svr = (s_val_svr != null) ? s_val_svr.toString() : null;
	        	
	        	System.out.println(__sso_info);
	        	System.out.println(__sso_val_svr);
	        	
	        	if (__sso_info != null)
	        	{
	            	String muserid = __sso_info.substring(__sso_info.indexOf(":") + 1);
	            	
	            	System.out.println(">> user id : " + muserid);
	            	
	            	// query to get session variable to user detail information
	            	String sql = "SELECT userid, uname FROM igcusers WHERE userid=?";
	            	pstmt = meta_db_con.prepareStatement(sql);
	            	pstmt.setString(1, muserid);
	            	
	            	boolean session_valid = false;
	            	
	            	rs = pstmt.executeQuery();
	            	
	            	if (rs.next())
	            	{
	            		System.out.println("** user id : " + muserid + " session validated");
	            		session_valid = true;
	            	}
	            	
	            	// Get registered group uid in user manager (ON meta table)
	            	/*
	            	 * @INPUT: groupname
	            	 */
	            	// String gid = this.getGroupID(mts, "guestusergroup");
	            	
	            	// OPTIONAL: Create group if it is not exist on server
	            	// if (gid == null)
	            	// {
	            	// 	gid = this.registerGroup(mts, "guestusergroup");
	            	// }
	            	
	            	if (session_valid == true)
	            	{
		            	// Processes registering for new user information.
		            	/*
		            	 * @INPUT: userid (actual userid)
		            	 * @INPUT: password (password)
		            	 * @INPUT: username (registeration name)
		            	 * @INPUT: useremail (email information for registration)
		            	 * @INPUT: gid (group id, this is registered group name on user manager)
		            	 * @INPUT: true (if not exist force add new user), false (if no user then skip)
		            	 */
		            	String useremail = null;
		            	uid = getRegisteredUserUUID(mts, muserid);
		            	
		            	// logic to create user if user is not registered (automatic add user)
		            	// OPTIONAL : Automatic register user
		            	if (uid == null)
		            	{
		            		// uid = registerUserUID(mts, muserid, password, gid, muserid, useremail);
		            	}
	            	}
	            }
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
			}
			catch (Exception e)
			{
			}
		}
		
		return uid;
	}
}
