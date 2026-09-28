/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package resource;

import jakarta.ws.rs.Consumes;
import servlets.DBConnection;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Happy Patel
 */

@Path("/manager")
public class ManagerResource {

@GET
@Path("/{managerId}/dashboard/stats")
@Produces(MediaType.APPLICATION_JSON)
public Response getDashboardStats(
        @PathParam("managerId") int managerId
) {

    try {

        Connection con =
                DBConnection.getConnection();

        String sql =
            "SELECT "
            + "SUM(CASE WHEN status='PENDING' THEN 1 ELSE 0 END) AS pending,"
            + "SUM(CASE WHEN status='APPROVED' THEN 1 ELSE 0 END) AS approved,"
            + "SUM(CASE WHEN status='REJECTED' THEN 1 ELSE 0 END) AS rejected,"
            + "SUM(CASE WHEN status='ON_HOLD' THEN 1 ELSE 0 END) AS onHold,"
            + "SUM(CASE WHEN status='SEND_BACK' THEN 1 ELSE 0 END) AS sendBack,"
            + "SUM(CASE WHEN status='CLOSED' THEN 1 ELSE 0 END) AS closedCount,"
            + "COUNT(*) AS total "
            + "FROM workflow_instances "
            + "WHERE assigned_manager_id=?";

        PreparedStatement ps =
                con.prepareStatement(sql);

        ps.setInt(1, managerId);

        ResultSet rs =
                ps.executeQuery();

        if (rs.next()) {

            String json =
                "{"
                + "\"pending\":" + rs.getInt("pending") + ","
                + "\"approved\":" + rs.getInt("approved") + ","
                + "\"rejected\":" + rs.getInt("rejected") + ","
                + "\"onHold\":" + rs.getInt("onHold") + ","
                + "\"sendBack\":" + rs.getInt("sendBack") + ","
                + "\"closedCount\":" + rs.getInt("closedCount") + ","
                + "\"total\":" + rs.getInt("total")
                + "}";

            return Response.ok(json).build();
        }

        return Response.ok("{}").build();

    } catch (Exception e) {

        e.printStackTrace();

        return Response.serverError()
                .entity("{}")
                .build();
    }
}
    @GET
    @Path("/{managerId}/requests")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPendingRequests(
            @PathParam("managerId") int managerId
    ) {

        StringBuilder json =
                new StringBuilder("[");

        try {

            Connection con =
                    DBConnection.getConnection();

           String sql =
                "SELECT "
                + "wi.instance_id, "
                + "wi.started_by, "
                + "w.workflow_name, "
                + "u.full_name, "
                + "u.email, "
                + "wi.started_at, "
                + "wi.status "
                + "FROM workflow_instances wi "
                + "JOIN workflows w "
                + "ON wi.workflow_id = w.workflow_id "
                + "JOIN users u "
                + "ON wi.started_by = u.user_id "
                + "WHERE wi.assigned_manager_id = ? "
                + "ORDER BY wi.started_at DESC";
            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, managerId);

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

                    .append("\"user_id\":")
                    .append(rs.getInt("started_by"))
                    .append(",")

                    .append("\"employee_name\":\"")
                    .append(rs.getString("full_name"))
                    .append("\",")

                    .append("\"email\":\"")
                    .append(rs.getString("email"))
                    .append("\",")

                    .append("\"started_at\":\"")
                    .append(rs.getTimestamp("started_at"))
                    .append("\",")

                    .append("\"workflow_name\":\"")
                    .append(rs.getString("workflow_name"))
                    .append("\",")

                    .append("\"status\":\"")
                    .append(rs.getString("status"))
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
    @GET
    @Path("/monthly-stats")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMonthlyStats() {

        StringBuilder json =
                new StringBuilder("[");

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT "
                    + "DATE_FORMAT(started_at,'%b') month, "
                    + "COUNT(*) requests "
                    + "FROM workflow_instances "
                    + "GROUP BY MONTH(started_at), "
                    + "DATE_FORMAT(started_at,'%b') "
                    + "ORDER BY MONTH(started_at)";

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
                        .append("\"month\":\"")
                        .append(rs.getString("month"))
                        .append("\",")

                        .append("\"requests\":")
                        .append(rs.getInt("requests"))

                        .append("}");

                first = false;
            }

            json.append("]");

            return Response.ok(
                    json.toString()
            ).build();

        } catch (Exception e) {

            e.printStackTrace();

            return Response.ok("[]")
                    .build();
        }
    }
    @GET
    @Path("/recent-activities")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRecentActivities() {

        StringBuilder json =
                new StringBuilder("[");

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT "
                    + "u.full_name, "
                    + "wal.action, "
                    + "w.workflow_name "
                    + "FROM workflow_action_logs wal "
                    + "JOIN users u "
                    + "ON wal.action_by=u.user_id "
                    + "JOIN workflow_instances wi "
                    + "ON wal.instance_id=wi.instance_id "
                    + "JOIN workflows w "
                    + "ON wi.workflow_id=w.workflow_id "
                    + "ORDER BY wal.action_time DESC "
                    + "LIMIT 10";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs =
                    ps.executeQuery();

            boolean first = true;

            while (rs.next()) {

                if (!first) {
                    json.append(",");
                }

                String activity =
                        rs.getString("full_name")
                        + " "
                        + rs.getString("action")
                        + " "
                        + rs.getString("workflow_name");

                json.append("{")
                        .append("\"activity\":\"")
                        .append(activity)
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

            return Response.ok("[]")
                    .build();
        }
    }
    @GET
    @Path("/workflow-performance")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getWorkflowPerformance() {

        StringBuilder json =
                new StringBuilder("[");

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT "
                    + "w.workflow_name, "
                    + "COUNT(*) count "
                    + "FROM workflow_instances wi "
                    + "JOIN workflows w "
                    + "ON wi.workflow_id=w.workflow_id "
                    + "GROUP BY w.workflow_name "
                    + "ORDER BY count DESC";

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
                        .append("\"workflow\":\"")
                        .append(rs.getString("workflow_name"))
                        .append("\",")

                        .append("\"count\":")
                        .append(rs.getInt("count"))

                        .append("}");

                first = false;
            }

            json.append("]");

            return Response.ok(
                    json.toString()
            ).build();

        } catch (Exception e) {

            e.printStackTrace();

            return Response.ok("[]")
                    .build();
        }
    }
    @GET
    @Path("/request/{instanceId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getRequestDetails(
            @PathParam("instanceId") int instanceId
    ) {

        List<Map<String, Object>> list =
                new ArrayList<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT "
                    + "wv.variable_name, "
                    + "wid.variable_value "
                    + "FROM workflow_instance_data wid "
                    + "JOIN workflow_variables wv "
                    + "ON wid.variable_id = wv.variable_id "
                    + "WHERE wid.instance_id=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, instanceId);

            ResultSet rs =
                    ps.executeQuery();

            while(rs.next()) {

                Map<String,Object> row =
                        new HashMap<>();

                row.put(
                        "field",
                        rs.getString(
                                "variable_name"
                        )
                );

                row.put(
                        "value",
                        rs.getString(
                                "variable_value"
                        )
                );

                list.add(row);
            }

        } catch(Exception e) {

            e.printStackTrace();
        }

        return list;
    }

    @PUT
    @Path("/request/{instanceId}/status")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateRequestStatus(
            @PathParam("instanceId") int instanceId,
            Map<String,Object> body
    ) {

        try {

            Connection con =
                    DBConnection.getConnection();

            String status =
                    body.get("status")
                            .toString();

            String remarks =
                    body.get("remarks") == null
                    ? ""
                    : body.get("remarks").toString();

            String sql =
                    "UPDATE workflow_instances "
                    + "SET status=? "
                    + "WHERE instance_id=?";
            String logSql =
                    "INSERT INTO workflow_action_logs "
                    + "(instance_id,state_id,"
                    + "action_by,action,remarks) "
                    + "VALUES(?,?,?,?,?)";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setString(1, status);
            ps.setInt(2, instanceId);

            ps.executeUpdate();

            if ("APPROVED".equalsIgnoreCase(status)) {

                Integer managerId = null;

                if (body.get("managerId") != null) {
                    managerId =
                        Integer.parseInt(
                            body.get("managerId").toString()
                        );
                }
                WorkflowEngineService engine =
                        new WorkflowEngineService();

                engine.executeWorkflow(
                        instanceId,
                        managerId
                );
            }

            return Response.ok()
                   .entity("{\"message\":\"Status Updated\"}")
                   .build();

        } catch(Exception e) {

            e.printStackTrace();

            return Response.serverError()
                    .entity(
                        "{\"error\":\"Failed\"}"
                    )
                    .build();
        }
    }
    @GET
    @Path("/list")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getManagers() {

        List<Map<String, Object>> list =
                new ArrayList<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT user_id, full_name "
                    + "FROM users "
                    + "WHERE role_id = 3 "
                    + "ORDER BY full_name";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> map =
                        new HashMap<>();

                map.put(
                        "user_id",
                        rs.getInt("user_id")
                );

                map.put(
                        "full_name",
                        rs.getString("full_name")
                );

                list.add(map);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }
}