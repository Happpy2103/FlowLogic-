/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package resource;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import servlets.DBConnection;

/**
 *
 * @author Happy Patel
 */

@Path("/workflow-submissions")
public class WorkflowSubmissionResource {

    // GET USER APPLICATIONS

    @GET
    @Path("/user/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>>
    getUserApplications(
            @PathParam("userId") int userId
    ) {

        List<Map<String, Object>> list =
                new ArrayList<>();

        try {

            Connection con =
                    DBConnection.getConnection();

           String sql =
            "SELECT "
            + "wi.instance_id, "
            + "w.workflow_name, "
            + "wi.status, "
            + "wi.started_at, "
            + "m.full_name AS manager_name, "
            + "( "
            + "SELECT wal.remarks "
            + "FROM workflow_action_logs wal "
            + "WHERE wal.instance_id = wi.instance_id "
            + "ORDER BY wal.log_id DESC "
            + "LIMIT 1 "
            + ") AS remarks "
            + "FROM workflow_instances wi "
            + "JOIN workflows w "
            + "ON wi.workflow_id = w.workflow_id "
            + "LEFT JOIN users m "
            + "ON wi.assigned_manager_id = m.user_id "
            + "WHERE wi.started_by=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, userId);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> map =
                        new HashMap<>();

                map.put(
                    "instance_id",
                    rs.getInt("instance_id")
                );

                map.put(
                    "workflow_name",
                    rs.getString("workflow_name")
                );

                map.put(
                    "status",
                    rs.getString("status")
                );

                map.put(
                    "started_at",
                    rs.getString("started_at")
                );

                map.put(
                    "manager_name",
                    rs.getString("manager_name")
                );

                map.put(
                    "remarks",
                    rs.getString("remarks")
                );

                list.add(map);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }
    
    @GET
    @Path("/count")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getSubmissionCount() {

        Map<String, Object> res = new HashMap<>();

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "SELECT COUNT(*) FROM workflow_instances";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            int count = 0;

            if(rs.next()){
                count = rs.getInt(1);
            }

            res.put("count", count);

        } catch(Exception e){

            e.printStackTrace();

            res.put("count", 0);
        }

         return res;
    }
    @GET
    @Path("/pending-count")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getPendingCount() {

        Map<String, Object> res = new HashMap<>();

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "SELECT COUNT(*) FROM workflow_instances\n" +
                    "WHERE status='PENDING'";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            int count = 0;

            if(rs.next()){
                count = rs.getInt(1);
            }

            res.put("count", count);

        } catch(Exception e){

            e.printStackTrace();

            res.put("count", 0);
        }

        return res;
    }
}