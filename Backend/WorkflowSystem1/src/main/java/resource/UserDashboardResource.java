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

@Path("/user-dashboard")
public class UserDashboardResource {

    // USER DASHBOARD SUMMARY

    @GET
    @Path("/summary/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getUserDashboard(
            @PathParam("userId") int userId
    ) {

        Map<String, Object> res =
                new HashMap<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            // Total Requests

            PreparedStatement totalPs =
                    con.prepareStatement(
                            "SELECT COUNT(*) "
                            + "FROM workflow_instances "
                            + "WHERE started_by=?"
                    );

            totalPs.setInt(1, userId);

            ResultSet totalRs =
                    totalPs.executeQuery();

            int total = 0;

            if (totalRs.next()) {
                total = totalRs.getInt(1);
            }

            // Pending

            PreparedStatement pendingPs =
                    con.prepareStatement(
                            "SELECT COUNT(*) "
                            + "FROM workflow_instances "
                            + "WHERE started_by=? "
                            + "AND status='PENDING'"
                    );

            pendingPs.setInt(1, userId);

            ResultSet pendingRs =
                    pendingPs.executeQuery();

            int pending = 0;

            if (pendingRs.next()) {
                pending = pendingRs.getInt(1);
            }

            // Approved

            PreparedStatement approvedPs =
                    con.prepareStatement(
                            "SELECT COUNT(*) "
                            + "FROM workflow_instances "
                            + "WHERE started_by=? "
                            + "AND status='APPROVED'"
                    );

            approvedPs.setInt(1, userId);

            ResultSet approvedRs =
                    approvedPs.executeQuery();

            int approved = 0;

            if (approvedRs.next()) {
                approved = approvedRs.getInt(1);
            }

            // Rejected

            PreparedStatement rejectedPs =
                    con.prepareStatement(
                            "SELECT COUNT(*) "
                            + "FROM workflow_instances "
                            + "WHERE started_by=? "
                            + "AND status='REJECTED'"
                    );

            rejectedPs.setInt(1, userId);

            ResultSet rejectedRs =
                    rejectedPs.executeQuery();

            int rejected = 0;

            if (rejectedRs.next()) {
                rejected = rejectedRs.getInt(1);
            }

            // Completion %

            int completed =
                    approved + rejected;

            int completion = 0;

            if (total > 0) {

                completion =
                        (int) Math.round(
                                (completed * 100.0)
                                / total
                        );
            }

            res.put("total", total);
            res.put("pending", pending);
            res.put("approved", approved);
            res.put("rejected", rejected);
            res.put("completion", completion);

        } catch (Exception e) {

            e.printStackTrace();

            res.put("total", 0);
            res.put("pending", 0);
            res.put("approved", 0);
            res.put("rejected", 0);
            res.put("completion", 0);
        }

        return res;
    }

    // MONTHLY ACTIVITY

    @GET
    @Path("/monthly/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getMonthlyActivity(
            @PathParam("userId") int userId
    ) {

        List<Map<String, Object>> list =
                new ArrayList<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT "
                    + "DATE_FORMAT(started_at,'%b') month, "
                    + "COUNT(*) workflows "
                    + "FROM workflow_instances "
                    + "WHERE started_by=? "
                    + "GROUP BY MONTH(started_at), "
                    + "DATE_FORMAT(started_at,'%b') "
                    + "ORDER BY MONTH(started_at)";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, userId);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> map =
                        new HashMap<>();

                map.put(
                        "month",
                        rs.getString("month")
                );

                map.put(
                        "workflows",
                        rs.getInt("workflows")
                );

                list.add(map);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }
    @GET
    @Path("/recent/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getRecentActivity(
            @PathParam("userId") int userId
    ) {

        List<Map<String, Object>> list =
                new ArrayList<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT w.workflow_name, "
                    + "wi.status, "
                    + "wi.started_at "
                    + "FROM workflow_instances wi "
                    + "JOIN workflows w "
                    + "ON wi.workflow_id = w.workflow_id "
                    + "WHERE wi.started_by=? "
                    + "ORDER BY wi.started_at DESC "
                    + "LIMIT 5";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, userId);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> map =
                        new HashMap<>();

                map.put(
                        "workflow",
                        rs.getString("workflow_name")
                );

                map.put(
                        "status",
                        rs.getString("status")
                );

                map.put(
                        "date",
                        rs.getString("started_at")
                );

                list.add(map);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }
}