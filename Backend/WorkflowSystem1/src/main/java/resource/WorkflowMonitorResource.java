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


@Path("/workflow-monitor")
public class WorkflowMonitorResource {

    // GET APPROVED / REJECTED / COMPLETED
    // WORKFLOW INSTANCES

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getWorkflowInstances() {

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
                    + "u.full_name "
                    + "FROM workflow_instances wi "
                    + "JOIN workflows w "
                    + "ON wi.workflow_id = w.workflow_id "
                    + "JOIN users u "
                    + "ON wi.started_by = u.user_id "
                    + "WHERE wi.status IN "
                    + "('APPROVED','REJECTED','COMPLETED') "
                    + "ORDER BY wi.started_at DESC";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> row =
                        new HashMap<>();

                row.put(
                        "instanceId",
                        rs.getInt("instance_id")
                );

                row.put(
                        "workflowName",
                        rs.getString("workflow_name")
                );

                row.put(
                        "employee",
                        rs.getString("full_name")
                );

                row.put(
                        "status",
                        rs.getString("status")
                );

                list.add(row);
            }

            con.close();

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }

    // GET EXECUTION LOGS

    @GET
    @Path("/{instanceId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getWorkflowLogs(
            @PathParam("instanceId") int instanceId
    ) {

        List<Map<String, Object>> list =
                new ArrayList<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT "
                    + "ws.state_name, "
                    + "ws.state_type, "
                    + "wal.action, "
                    + "wal.action_time "
                    + "FROM workflow_action_logs wal "
                    + "JOIN workflow_states ws "
                    + "ON wal.state_id = ws.state_id "
                    + "WHERE wal.instance_id=? "
                    + "ORDER BY wal.action_time ASC";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, instanceId);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> row =
                        new HashMap<>();

                row.put(
                        "stateName",
                        rs.getString("state_name")
                );

                row.put(
                        "stateType",
                        rs.getString("state_type")
                );

                row.put(
                        "action",
                        rs.getString("action")
                );

                row.put(
                        "actionTime",
                        rs.getTimestamp("action_time")
                );

                list.add(row);
            }

            con.close();

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }

    // GET CURRENT ACTIVE NODE

    @GET
    @Path("/current/{instanceId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getCurrentState(
            @PathParam("instanceId") int instanceId
    ) {

        Map<String, Object> res =
                new HashMap<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT "
                    + "current_state, "
                    + "status "
                    + "FROM workflow_instances "
                    + "WHERE instance_id=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, instanceId);

            ResultSet rs =
                    ps.executeQuery();

            if (rs.next()) {

                res.put(
                        "currentStateId",
                        rs.getInt("current_state")
                );

                res.put(
                        "status",
                        rs.getString("status")
                );
            }

            con.close();

        } catch (Exception e) {

            e.printStackTrace();
        }

        return res;
    }

    // GET ALL STATES OF INSTANCE

    @GET
    @Path("/states/{instanceId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getWorkflowStates(
            @PathParam("instanceId") int instanceId
    ) {

        List<Map<String, Object>> list =
                new ArrayList<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT "
                    + "ws.state_id, "
                    + "ws.state_name, "
                    + "ws.state_type, "
                    + "ws.sequence_no "
                    + "FROM workflow_states ws "
                    + "JOIN workflow_instances wi "
                    + "ON ws.workflow_id = wi.workflow_id "
                    + "WHERE wi.instance_id=? "
                    + "ORDER BY ws.sequence_no ASC";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, instanceId);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> row =
                        new HashMap<>();

                row.put(
                        "stateId",
                        rs.getInt("state_id")
                );

                row.put(
                        "stateName",
                        rs.getString("state_name")
                );

                row.put(
                        "stateType",
                        rs.getString("state_type")
                );

                row.put(
                        "sequenceNo",
                        rs.getInt("sequence_no")
                );

                list.add(row);
            }

            con.close();

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }
}