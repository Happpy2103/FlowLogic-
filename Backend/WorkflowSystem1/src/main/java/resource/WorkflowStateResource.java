/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package resource;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
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


@Path("/workflow-states")
public class WorkflowStateResource {

    // GET WORKFLOW STATES

    @GET
    @Path("/workflow/{workflowId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getWorkflowStates(
            @PathParam("workflowId") int workflowId
    ) {

        List<Map<String, Object>> list =
                new ArrayList<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT * FROM workflow_states "
                    + "WHERE workflow_id=? "
                    + "ORDER BY sequence_no ASC";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, workflowId);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> node =
                        new HashMap<>();

                // NODE ID

                node.put(
                        "id",
                        rs.getInt("state_id") + ""
                );

                // NODE TYPE

                node.put(
                        "type",
                        rs.getString("state_type")
                );

                // NODE DATA

                Map<String, Object> data =
                        new HashMap<>();

                data.put(
                        "label",
                        rs.getString("state_name")
                );

                data.put(
                        "description",
                        rs.getString("description")
                );

                node.put("data", data);

                // NODE POSITION

                Map<String, Object> position =
                        new HashMap<>();

                position.put(
                        "x",
                        rs.getInt("position_x")
                );

                position.put(
                        "y",
                        rs.getInt("position_y")
                );

                node.put(
                        "position",
                        position
                );

                list.add(node);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }

    // SAVE WORKFLOW STATES

    @POST
    @Path("/save")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> saveWorkflow(
            Map<String, Object> data
    ) {

        Map<String, Object> res =
                new HashMap<>();

        Connection con = null;

        try {

            con = DBConnection.getConnection();

            // GET WORKFLOW ID

            int workflowId =
                    Integer.parseInt(
                            data.get("workflowId")
                                    .toString()
                    );

         
            // DELETE OLD STATES

            String deleteSql =
                    "DELETE FROM workflow_states "
                    + "WHERE workflow_id=?";

            PreparedStatement deletePs =
                    con.prepareStatement(deleteSql);

            deletePs.setInt(1, workflowId);

            deletePs.executeUpdate();

            String deleteTransitions =
            "DELETE FROM workflow_transitions WHERE workflow_id=?";

            PreparedStatement deleteTrPs =
                    con.prepareStatement(deleteTransitions);

            deleteTrPs.setInt(1, workflowId);

            deleteTrPs.executeUpdate();
            // GET NODES

            List<Map<String, Object>> nodes =
                    (List<Map<String, Object>>)
                            data.get("nodes");
            List<Map<String, Object>> edges = (List<Map<String, Object>>) data.get("edges");
            // INSERT SQL

            String insertSql =
                "INSERT INTO workflow_states ("
                + "workflow_id, "
                + "state_name, "
                + "state_type, "
                + "description, "
                + "sequence_no, "
                + "position_x, "
                + "position_y, "
                + "assigned_role_id"
                + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement ps =
            con.prepareStatement(
                insertSql,
                PreparedStatement.RETURN_GENERATED_KEYS
            );

            int seq = 1;

            // LOOP NODES
            
            Map<String, Integer> nodeIdMap =
            new HashMap<>();

            for (Map<String, Object> node : nodes) {

                // NODE DATA

                Map<String, Object> nodeData =
                        (Map<String, Object>)
                                node.get("data");

                Map<String, Object> position =
                        (Map<String, Object>)
                                node.get("position");

                // NODE TYPE CONVERSION

                String nodeType =
                        node.get("type")
                                .toString();

                String dbType =
                        nodeType
                                .replaceAll("(?i)node", "")
                                .toUpperCase();

                // POSITION

                Number posX =
                        (Number) position.get("x");

                Number posY =
                        (Number) position.get("y");

                // =================================
                // INSERT VALUES
                // =================================

                ps.setInt(1, workflowId);

                ps.setString(
                    2,
                    nodeData.get("label").toString()
                );

                ps.setString(
                    3,
                    dbType
                );

                ps.setString(
                    4,
                    nodeData.get("description") != null
                        ? nodeData.get("description").toString()
                        : ""
                );

                ps.setInt(
                    5,
                    seq++
                );

                ps.setInt(
                    6,
                    posX.intValue()
                );

                ps.setInt(
                    7,
                    posY.intValue()
                );

                ps.setInt(
                    8,
                    1
                );

                ps.executeUpdate();

                ResultSet generatedKeys =
            ps.getGeneratedKeys();

    if (generatedKeys.next()) {

        int stateId =
                generatedKeys.getInt(1);

        nodeIdMap.put(
                node.get("id").toString(),
                stateId
        );
    }

            }

            // SUCCESS RESPONSE

            res.put("status", "success");

        // SAVE TRANSITIONS

        if (edges != null) {

            String transitionSql =
                "INSERT INTO workflow_transitions "
              + "(workflow_id, from_state, to_state, transition_condition) "
              + "VALUES (?, ?, ?, ?)";

            PreparedStatement trPs =
                    con.prepareStatement(transitionSql);

            for (Map<String, Object> edge : edges) {

                String source =
                        edge.get("source").toString();

                String target =
                        edge.get("target").toString();

                Integer fromState =
                        nodeIdMap.get(source);

                Integer toState =
                        nodeIdMap.get(target);

                if (fromState == null || toState == null) {
                    continue;
                }

                trPs.setInt(1, workflowId);
                trPs.setInt(2, fromState);
                trPs.setInt(3, toState);
                trPs.setString(4, "");

                trPs.executeUpdate();
            }
    }
        
        res.put(
                "message",
                "Workflow saved successfully"
        );

    } catch (Exception e) {

        e.printStackTrace();

        res.put("status", "error");

        res.put(
                "message",
                e.getMessage()
        );
    }

    return res;
}
}