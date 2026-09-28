/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/WebServices/GenericResource.java to edit this template
 */
package resource;

import org.json.JSONArray;
import org.json.JSONObject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.PathParam;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import org.json.JSONException;
import servlets.DBConnection;
import org.mindrot.jbcrypt.BCrypt;

/**
 * REST Web Service
 *
 * @author Happy Patel
 */
@Path("/users")
@RequestScoped
public class UserResource {

    // GET ALL USERS
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getUsers() {

        JSONArray users = new JSONArray();

        try {
            Connection con = DBConnection.getConnection();

            String sql = "SELECT u.user_id, u.full_name, u.email, r.role_name, u.role_id " +
             "FROM users u JOIN role_master r ON u.role_id = r.role_id";

            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                JSONObject obj = new JSONObject();
                obj.put("userId", rs.getInt("user_id"));
                obj.put("fullName", rs.getString("full_name"));
                obj.put("email", rs.getString("email"));
                obj.put("roleName", rs.getString("role_name"));
                obj.put("roleId", rs.getInt("role_id")); // 👈 ADD THIS

                users.put(obj);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return users.toString();
    }

    // GET COUNT
    @GET
    @Path("/count")
    @Produces(MediaType.APPLICATION_JSON)
    public String getUserCount() {

        try {
            Connection con = DBConnection.getConnection();

            String sql = "SELECT COUNT(*) FROM users";
            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            int count = 0;
            if (rs.next()) {
                count = rs.getInt(1);
            }

            return "{\"count\": " + count + "}";

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "{\"count\": 0}";
    }

    // CREATE USER
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createUser(String body) {

        try {
            JSONObject data = new JSONObject(body);

            Connection con = DBConnection.getConnection();

            String sql = "INSERT INTO users (full_name, email, password, role_id) VALUES (?, ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, data.getString("fullName"));
            ps.setString(2, data.getString("email"));
            
            

            ps.setString(3, data.getString("password"));
            ps.setInt(4, data.getInt("roleId"));

            ps.executeUpdate();

            return "{\"status\":\"success\"}";

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "{\"status\":\"error\"}";
    }

    // UPDATE USER
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateUser(@PathParam("id") int id, String body) throws JSONException {

        try {

            System.out.println("UPDATE BODY: " + body);

            JSONObject data = new JSONObject(body);

            Connection con = DBConnection.getConnection();

            String sql = "UPDATE users SET full_name=?, email=?, role_id=? WHERE user_id=?";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, data.getString("fullName"));
            ps.setString(2, data.getString("email"));
            ps.setInt(3, data.getInt("roleId"));
            ps.setInt(4, id);

            int rows = ps.executeUpdate();

            JSONObject response = new JSONObject();

            if (rows > 0) {

                response.put("status", "success");
                response.put("message", "User updated");

            } else {

                response.put("status", "error");
                response.put("message", "User not found");
            }

            return response.toString();

        } catch (Exception e) {

            e.printStackTrace();

            JSONObject error = new JSONObject();

            error.put("status", "error");
            error.put("message", e.getMessage());

            return error.toString();
        }
}
    // DELETE USER
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteUser(@PathParam("id") int id) {

        try {
            Connection con = DBConnection.getConnection();

            String sql = "DELETE FROM users WHERE user_id=?";
            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, id);
            ps.executeUpdate();

            return "{\"status\":\"deleted\"}";

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "{\"status\":\"error\"}";
    }
}