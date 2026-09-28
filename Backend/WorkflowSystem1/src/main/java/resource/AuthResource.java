/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package resource;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;
import org.mindrot.jbcrypt.BCrypt;
import servlets.DBConnection;

/**
 *
 * @author Happy Patel
 */


@Path("/auth")
public class AuthResource {

    // LOGIN
    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> login(
            Map<String, Object> data
    ) {

        Map<String, Object> response =
                new HashMap<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT "
                    + "u.user_id, "
                    + "u.full_name, "
                    + "u.email, "
                    + "u.role_id, "
                    + "r.role_name "
                    + "FROM users u "
                    + "JOIN role_master r "
                    + "ON u.role_id = r.role_id "
                    + "WHERE u.email=? "
                    + "AND u.password=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setString(
                    1,
                    data.get("email").toString()
            );

            ps.setString(
                    2,
                    data.get("password").toString()
            );

            ResultSet rs =
                    ps.executeQuery();

            if (rs.next()) {

                response.put(
                        "status",
                        "success"
                );

                response.put(
                        "userId",
                        rs.getInt("user_id")
                );

                response.put(
                        "fullName",
                        rs.getString("full_name")
                );

                response.put(
                        "email",
                        rs.getString("email")
                );

                response.put(
                        "roleId",
                        rs.getInt("role_id")
                );

                response.put(
                        "roleName",
                        rs.getString("role_name")
                );

                response.put(
                        "message",
                        "Login Successful"
                );

            } else {

                response.put(
                        "status",
                        "error"
                );

                response.put(
                        "message",
                        "Invalid Email or Password"
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

            response.put(
                    "status",
                    "error"
            );

            response.put(
                    "message",
                    e.getMessage()
            );
        }

        return response;
    }

    // REGISTER

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> register(
            Map<String, Object> data
    ) {

        Map<String, Object> response =
                new HashMap<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            // CHECK EMAIL EXISTS

            String checkSql =
                    "SELECT * FROM users "
                    + "WHERE email=?";

            PreparedStatement checkPs =
                    con.prepareStatement(checkSql);

            checkPs.setString(
                    1,
                    data.get("email").toString()
            );

            ResultSet checkRs =
                    checkPs.executeQuery();

            if (checkRs.next()) {

                response.put(
                        "status",
                        "error"
                );

                response.put(
                        "message",
                        "Email already exists"
                );

                return response;
            }

            // INSERT USER
            String sql =
                    "INSERT INTO users "
                    + "(full_name, email, password, role_id) "
                    + "VALUES (?, ?, ?, ?)";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setString(
                    1,
                    data.get("fullName").toString()
            );

            ps.setString(
                    2,
                    data.get("email").toString()
            );

        
           ps.setString( 3, data.get("password").toString() );

            ps.setInt(
                    4,
                    Integer.parseInt(
                            data.get("roleId").toString()
                    )
            );

            int rows =
                    ps.executeUpdate();

            if (rows > 0) {

                response.put(
                        "status",
                        "success"
                );

                response.put(
                        "message",
                        "Registration Successful"
                );

            } else {

                response.put(
                        "status",
                        "error"
                );

                response.put(
                        "message",
                        "Registration Failed"
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

            response.put(
                    "status",
                    "error"
            );

            response.put(
                    "message",
                    e.getMessage()
            );
        }

        return response;
    }
}