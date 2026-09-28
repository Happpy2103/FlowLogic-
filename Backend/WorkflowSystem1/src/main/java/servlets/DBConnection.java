/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package servlets;
import java.sql.Connection;
import java.sql.DriverManager;
/**
 *
 * @author Happy Patel
 */
public class DBConnection {
    public static Connection getConnection()
    {
        Connection con = null;
       try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            return DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/workflow_db"
                + "?useSSL=false"
                + "&allowPublicKeyRetrieval=true"
                + "&serverTimezone=UTC",
                "root",
                "2103"   
            );

        } 
       catch(Exception e)
        {
            e.printStackTrace();
           
        }
        
        return con;
    }
}
