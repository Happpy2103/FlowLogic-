/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package resource;

import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.Map;

import servlets.DBConnection;

/**
 *
 * @author Happy Patel
 */
@Path("/admin")
public class AdminResource {
    @GET
    @Path("/requests")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRequests() {

        StringBuilder json =
                new StringBuilder("[");

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT "
                    + "wi.instance_id, "
                    + "wi.status, "
                    + "wi.started_at, "
                    + "u.user_id, "
                    + "u.full_name, "
                    + "u.email, "
                    + "w.workflow_name, "
                    + "m.user_id manager_id, "
                    + "m.full_name manager_name "
                    + "FROM workflow_instances wi "
                    + "JOIN users u "
                    + "ON wi.started_by = u.user_id "
                    + "JOIN workflows w "
                    + "ON wi.workflow_id = w.workflow_id "
                    + "LEFT JOIN users m "
                    + "ON wi.assigned_manager_id = m.user_id "
                    + "ORDER BY wi.started_at DESC";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs =
                    ps.executeQuery();

            boolean first = true;

            while (rs.next()) {

                if (!first) {
                    json.append(",");
                }

                json.append("{")

                    .append("\"instance_id\":")
                    .append(rs.getInt("instance_id"))
                    .append(",")

                    .append("\"workflow_name\":\"")
                    .append(rs.getString("workflow_name"))
                    .append("\",")

                    .append("\"employee_name\":\"")
                    .append(rs.getString("full_name"))
                    .append("\",")

                    .append("\"email\":\"")
                    .append(rs.getString("email"))
                    .append("\",")

                    .append("\"status\":\"")
                    .append(rs.getString("status"))
                    .append("\",")

                    .append("\"manager_id\":")
                    .append(rs.getObject("manager_id") == null
                            ? "null"
                            : rs.getInt("manager_id"))
                    .append(",")

                    .append("\"manager_name\":\"")
                    .append(
                            rs.getString("manager_name") == null
                            ? ""
                            : rs.getString("manager_name")
                    )
                    .append("\"")

                    .append("}");

                first = false;
            }

            json.append("]");

            return Response.ok(
                    json.toString()
            ).build();

        } catch (Exception e) {

            e.printStackTrace();

            return Response.serverError()
                    .entity("[]")
                    .build();
        }
    }

    @PUT
    @Path("/request/{instanceId}/assign-manager")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response assignManager(
            @PathParam("instanceId") int instanceId,
            Map<String,Object> body
    ) {

        try {

            Connection con =
                    DBConnection.getConnection();

            int managerId =
                    Integer.parseInt(
                            body.get("managerId")
                                    .toString()
                    );

            String sql =
                    "UPDATE workflow_instances "
                    + "SET assigned_manager_id=? "
                    + "WHERE instance_id=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, managerId);
            ps.setInt(2, instanceId);

            ps.executeUpdate();

            return Response.ok(
                    "{\"message\":\"Manager Assigned\"}"
            ).build();

        } catch(Exception e) {

            e.printStackTrace();

            return Response.serverError()
                    .entity("{\"error\":\"Failed\"}")
                    .build();
        }
    }

}
