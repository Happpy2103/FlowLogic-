/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/WebServices/GenericResource.java to edit this template
 */
package resource;

import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import jakarta.ws.rs.DELETE;        
import java.util.Map;
import servlets.DBConnection;

import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author Happy Patel
 */
@Path("/workflows")
public class WorkflowResource {

    // GET ALL WORKFLOWS
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getAllWorkflows() {

        List<Map<String, Object>> list = new ArrayList<>();

        try {

            Connection con = DBConnection.getConnection();

            String sql = "SELECT * FROM workflows "
                    + "ORDER BY workflow_id DESC";

            PreparedStatement ps = con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> wf = new HashMap<>();

                wf.put("workflowId", rs.getInt("workflow_id"));
                wf.put("workflowName", rs.getString("workflow_name"));
                wf.put("description", rs.getString("description"));
                wf.put("createdBy", rs.getInt("created_by"));
                wf.put("isActive", rs.getBoolean("is_active"));
                wf.put("createdAt", rs.getTimestamp("created_at"));

                list.add(wf);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    // GET WORKFLOWS BY ADMIN
    @GET
    @Path("/admin/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getWorkflowsByAdmin(
            @PathParam("userId") int userId
    ) {

        List<Map<String, Object>> list = new ArrayList<>();

        try {

            Connection con = DBConnection.getConnection();

            String sql = "SELECT * FROM workflows "
                    + "WHERE created_by = ? "
                    + "ORDER BY workflow_id DESC";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, userId);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> wf = new HashMap<>();

                wf.put("workflowId", rs.getInt("workflow_id"));
                wf.put("workflowName", rs.getString("workflow_name"));
                wf.put("description", rs.getString("description"));
                wf.put("createdBy", rs.getInt("created_by"));
                wf.put("isActive", rs.getBoolean("is_active"));
                wf.put(
                    "workflowStatus",
                    rs.getString("workflow_status")
                );
                wf.put("createdAt", rs.getTimestamp("created_at"));

                list.add(wf);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    // GET WORKFLOW BY ID
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getWorkflowById(
            @PathParam("id") int id
    ) {

        Map<String, Object> wf = new HashMap<>();

        try {

            Connection con = DBConnection.getConnection();

            String sql = "SELECT * FROM workflows "
                    + "WHERE workflow_id = ?";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, id);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {

                wf.put("workflowId", rs.getInt("workflow_id"));
                wf.put("workflowName", rs.getString("workflow_name"));
                wf.put("description", rs.getString("description"));
                wf.put("createdBy", rs.getInt("created_by"));
                wf.put("isActive", rs.getBoolean("is_active"));
                wf.put(
                    "workflowStatus",
                    rs.getString("workflow_status")
                );
                wf.put("createdAt", rs.getTimestamp("created_at"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return wf;
    }

    // CREATE WORKFLOW
    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> createWorkflow(
            Map<String, Object> data
    ) {

        Map<String, Object> res = new HashMap<>();

        try {

            Connection con = DBConnection.getConnection();

           String sql =
                "INSERT INTO workflows "
                + "(workflow_name, description, created_by, is_active, workflow_status) "
                + "VALUES (?, ?, ?, ?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(
                    1,
                    data.get("workflowName").toString()
            );

            ps.setString(
                    2,
                    data.get("description") != null
                    ? data.get("description").toString()
                    : ""
            );

            ps.setInt(
                    3,
                    Integer.parseInt(
                            data.get("createdBy").toString()
                    )
            );

            ps.setBoolean(4, true);
            ps.setString(5, "DRAFT");
            int rows = ps.executeUpdate();

            if (rows > 0) {

                res.put("status", "success");
                res.put("message", "Workflow created successfully");

            } else {

                res.put("status", "error");
                res.put("message", "Failed to create workflow");
            }

        } catch (Exception e) {

            e.printStackTrace();

            res.put("status", "error");
            res.put("message", e.getMessage());
        }

        return res;
    }

    // UPDATE WORKFLOW

    @PUT
    @Path("/update/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> updateWorkflow(
            @PathParam("id") int id,
            Map<String, Object> data
    ) {

        Map<String, Object> res =
                new HashMap<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "UPDATE workflows "
                    + "SET workflow_name=?, "
                    + "description=? "
                    + "WHERE workflow_id=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setString(
                    1,
                    data.get("workflowName")
                            .toString()
            );

            ps.setString(
                    2,
                    data.get("description")
                            .toString()
            );

            ps.setInt(3, id);

            ps.executeUpdate();

            res.put("status", "success");

            res.put(
                    "message",
                    "Workflow updated successfully"
            );

        } catch (Exception e) {

            e.printStackTrace();

            res.put("status", "error");

            res.put("message", e.getMessage());
        }

        return res;
    }

    // DELETE WORKFLOW
    @DELETE
    @Path("/{workflowId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteWorkflow(
            @PathParam("workflowId") int workflowId
    ) {

        Connection con = null;

        try {

            con = DBConnection.getConnection();

            con.setAutoCommit(false);

            // 1. Delete action logs

            String deleteLogs =
                "DELETE wal FROM workflow_action_logs wal "
                + "JOIN workflow_instances wi "
                + "ON wal.instance_id = wi.instance_id "
                + "WHERE wi.workflow_id=?";

            PreparedStatement ps1 =
                con.prepareStatement(deleteLogs);

            ps1.setInt(1, workflowId);
            ps1.executeUpdate();

            // 2. Delete instance data

            String deleteData =
                "DELETE wid FROM workflow_instance_data wid "
                + "JOIN workflow_instances wi "
                + "ON wid.instance_id = wi.instance_id "
                + "WHERE wi.workflow_id=?";

            PreparedStatement ps2 =
                con.prepareStatement(deleteData);

            ps2.setInt(1, workflowId);
            ps2.executeUpdate();

            // 3. Delete workflow instances

            String deleteInstances =
                "DELETE FROM workflow_instances "
                + "WHERE workflow_id=?";

            PreparedStatement ps3 =
                con.prepareStatement(deleteInstances);

            ps3.setInt(1, workflowId);
            ps3.executeUpdate();

            // 4. Delete workflow variables

            String deleteVariables =
                "DELETE FROM workflow_variables "
                + "WHERE workflow_id=?";

            PreparedStatement ps4 =
                con.prepareStatement(deleteVariables);

                ps4.setInt(1, workflowId);
                ps4.executeUpdate();

                 // DELETE STATE TOOLS
                String deleteStateTools =
                    "DELETE st FROM state_tools st "
                    + "JOIN workflow_states ws "
                    + "ON st.state_id = ws.state_id "
                    + "WHERE ws.workflow_id=?";

                PreparedStatement psTools =
                    con.prepareStatement(deleteStateTools);

                psTools.setInt(1, workflowId);

                psTools.executeUpdate();

                // DELETE TRANSITIONS
                String deleteTransitions =
                    "DELETE FROM workflow_transitions "
                    + "WHERE workflow_id=?";

                PreparedStatement psTransition =
                    con.prepareStatement(deleteTransitions);

                psTransition.setInt(1, workflowId);

                psTransition.executeUpdate();

                    String deleteStates =
                        "DELETE FROM workflow_states "
                        + "WHERE workflow_id=?";

                    PreparedStatement psState =
                        con.prepareStatement(deleteStates);

                    psState.setInt(1, workflowId);

                    psState.executeUpdate();


            // 5. Delete workflow

            String deleteWorkflow =
                "DELETE FROM workflows "
                + "WHERE workflow_id=?";

            PreparedStatement ps5 =
                con.prepareStatement(deleteWorkflow);

            ps5.setInt(1, workflowId);
            ps5.executeUpdate();

            con.commit();

            return Response.ok(
                "{\"message\":\"Workflow Deleted Successfully\"}"
            ).build();

        } catch (Exception e) {

            try {
                if (con != null) {
                    con.rollback();
                }
            } catch (Exception ex) {}

            e.printStackTrace();

            return Response.serverError()
                .entity(
                    "{\"error\":\"Delete Failed\"}"
                )
                .build();

        } finally {

            try {
                if (con != null) {
                    con.close();
                }
            } catch (Exception e) {}
        }
}

    // TOTAL WORKFLOW COUNT
    @GET
    @Path("/count")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getWorkflowCount() {

        Map<String, Object> res = new HashMap<>();

        try {

            Connection con = DBConnection.getConnection();

            String sql = "SELECT COUNT(*) FROM workflows";

            PreparedStatement ps = con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            int count = 0;

            if (rs.next()) {
                count = rs.getInt(1);
            }

            res.put("count", count);

        } catch (Exception e) {

            e.printStackTrace();

            res.put("count", 0);
        }

        return res;
    }
    
    // TOGGLE WORKFLOW STATUS
    @PUT
    @Path("/toggle-status/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> toggleWorkflowStatus(
            @PathParam("id") int id
    ) {

        Map<String, Object> res = new HashMap<>();

        try {

            Connection con = DBConnection.getConnection();

            // GET CURRENT STATUS
            String checkSql =
                    "SELECT is_active "
                    + "FROM workflows "
                    + "WHERE workflow_id = ?";

            PreparedStatement checkPs =
                    con.prepareStatement(checkSql);

            checkPs.setInt(1, id);

            ResultSet rs = checkPs.executeQuery();

            boolean currentStatus = true;

            if (rs.next()) {

                currentStatus =
                        rs.getBoolean("is_active");

            } else {

                res.put("status", "error");
                res.put("message", "Workflow not found");

                return res;
            }

            // TOGGLE STATUS
            String updateSql =
                    "UPDATE workflows "
                    + "SET is_active = ? "
                    + "WHERE workflow_id = ?";

            PreparedStatement updatePs =
                    con.prepareStatement(updateSql);

            updatePs.setBoolean(1, !currentStatus);

            updatePs.setInt(2, id);

            int rows = updatePs.executeUpdate();

            if (rows > 0) {

                res.put("status", "success");

                res.put(
                        "message",
                        !currentStatus
                        ? "Workflow activated"
                        : "Workflow deactivated"
                );

                res.put("isActive", !currentStatus);

            } else {

                res.put("status", "error");

                res.put("message", "Update failed");
            }

        } catch (Exception e) {

            e.printStackTrace();

            res.put("status", "error");

            res.put("message", e.getMessage());
        }

        return res;
    }
    // SAVE WORKFLOW DESIGN
    // =========================================
    @POST
    @Path("/save-design")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> saveDesign(
            Map<String, Object> data
    ) {

        Map<String, Object> res =
                new HashMap<>();

        try {

            res.put("status", "success");

            res.put(
                    "message",
                    "Workflow design saved"
            );

        } catch (Exception e) {

            e.printStackTrace();

            res.put("status", "error");

            res.put("message", e.getMessage());
        }

        return res;
    }
// GET WORKFLOW VARIABLES
    @GET
    @Path("/{id}/fields")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getFields(
            @PathParam("id") int workflowId
    ) {

        List<Map<String, Object>> list =
                new ArrayList<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT * FROM workflow_variables "
                    + "WHERE workflow_id=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, workflowId);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> map =
                        new HashMap<>();

                map.put(
                        "variableId",
                        rs.getInt("variable_id")
                );

                map.put(
                        "variableName",
                        rs.getString("variable_name")
                );

                map.put(
                        "dataType",
                        rs.getString("data_type")
                );

                list.add(map);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }
    //ADD
    @POST
    @Path("/{id}/fields")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> addField(
            @PathParam("id") int workflowId,
            Map<String, Object> data
    ) {

        Map<String, Object> res =
                new HashMap<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "INSERT INTO workflow_variables "
                    + "(workflow_id, variable_name, data_type) "
                    + "VALUES (?, ?, ?)";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, workflowId);

            ps.setString(
                    2,
                    data.get("variableName").toString()
            );

            ps.setString(
                    3,
                    data.get("dataType").toString()
            );

            ps.executeUpdate();

            res.put("status", "success");

        } catch (Exception e) {

            e.printStackTrace();

            res.put("status", "error");
        }

        return res;
    }   
    //delet
    @DELETE
    @Path("/fields/{fieldId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> deleteField(
            @PathParam("fieldId") int fieldId
    ) {

        Map<String, Object> res =
                new HashMap<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "DELETE FROM workflow_variables "
                    + "WHERE variable_id=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, fieldId);

            ps.executeUpdate();

            res.put("status", "success");

        } catch (Exception e) {

            e.printStackTrace();

            res.put("status", "error");
        }

        return res;
    }

    @GET
    @Path("/active")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getActiveWorkflows() {

        List<Map<String, Object>> list =
                new ArrayList<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                "SELECT * FROM workflows "
                + "WHERE is_active = 1 "
                + "AND workflow_status = 'READY' "
                + "ORDER BY workflow_id DESC";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> wf =
                        new HashMap<>();

                wf.put(
                        "workflowId",
                        rs.getInt("workflow_id")
                );

                wf.put(
                        "workflowName",
                        rs.getString("workflow_name")
                );

                wf.put(
                        "description",
                        rs.getString("description")
                );

                wf.put(
                        "createdBy",
                        rs.getInt("created_by")
                );

                wf.put(
                        "isActive",
                        rs.getBoolean("is_active")
                );
                wf.put(
                        "workflowStatus",
                        rs.getString("workflow_status")
                    );
                                    wf.put(
                        "createdAt",
                        rs.getTimestamp("created_at")
                );

                list.add(wf);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }
    @POST
    @Path("/submit/{workflowId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response submitWorkflow(
            @PathParam("workflowId") int workflowId,
            Map<String, Object> values
        ) {

        try {

            Connection con =
                    DBConnection.getConnection();

            con.setAutoCommit(false);

            // GET LOGGED USER

            int userId =
                    Integer.parseInt(
                            values.get("userId").toString()
                    );

            // CREATE INSTANCE

            String instanceSql =
                    "INSERT INTO workflow_instances "
                    + "(workflow_id, started_by, status) "
                    + "VALUES (?, ?, ?)";

            PreparedStatement ps =
                    con.prepareStatement(
                            instanceSql,
                            Statement.RETURN_GENERATED_KEYS
                    );

            ps.setInt(1, workflowId);
            ps.setInt(2, userId);
            ps.setString(3, "PENDING");

            ps.executeUpdate();

            ResultSet rs =
                    ps.getGeneratedKeys();

            int instanceId = 0;

            if (rs.next()) {

                instanceId =
                        rs.getInt(1);
            }

            // GET VARIABLES

            String variableSql =
                    "SELECT variable_id, variable_name "
                    + "FROM workflow_variables "
                    + "WHERE workflow_id=?";

            PreparedStatement varPs =
                    con.prepareStatement(
                            variableSql
                    );

            varPs.setInt(
                    1,
                    workflowId
            );

            ResultSet varRs =
                    varPs.executeQuery();

            while (varRs.next()) {

                int variableId =
                        varRs.getInt(
                                "variable_id"
                        );

                String variableName =
                        varRs.getString(
                                "variable_name"
                        );

                Object value =
                        values.get(
                                variableName
                        );

                String insertDataSql =
                        "INSERT INTO workflow_instance_data "
                        + "(instance_id, variable_id, variable_value) "
                        + "VALUES (?, ?, ?)";

                PreparedStatement dataPs =
                        con.prepareStatement(
                                insertDataSql
                        );

                dataPs.setInt(
                        1,
                        instanceId
                );

                dataPs.setInt(
                        2,
                        variableId
                );

                dataPs.setString(
                        3,
                        value == null
                                ? ""
                                : value.toString()
                );

                dataPs.executeUpdate();
            }

            con.commit();

            Map<String, Object> res =
                    new HashMap<>();

            res.put(
                    "success",
                    true
            );

            res.put(
                    "instanceId",
                    instanceId
            );

            return Response.ok(
                    res
            ).build();

        } catch (Exception e) {

            e.printStackTrace();

            return Response.serverError()
                    .entity(
                            "Submission Failed"
                    )
                    .build();
        }
    }
    @GET
    @Path("/manager-mapping")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getWorkflowManagerMapping() {

        List<Map<String, Object>> list =
                new ArrayList<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            String sql =
                    "SELECT "
                    + "w.workflow_id, "
                    + "w.workflow_name, "
                    + "w.manager_id, "
                    + "u.full_name AS manager_name "
                    + "FROM workflows w "
                    + "LEFT JOIN users u "
                    + "ON w.manager_id = u.user_id "
                    + "ORDER BY w.workflow_name";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> map =
                        new HashMap<>();

                map.put(
                        "workflow_id",
                        rs.getInt("workflow_id")
                );

                map.put(
                        "workflow_name",
                        rs.getString("workflow_name")
                );

                map.put(
                        "manager_id",
                        rs.getObject("manager_id")
                );

                map.put(
                        "manager_name",
                        rs.getString("manager_name")
                );

                list.add(map);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }

    @PUT
    @Path("/assign-manager")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response assignManager(
            Map<String, Object> body
    ) {

        try {

            int workflowId =
                    Integer.parseInt(
                            body.get("workflowId")
                                    .toString()
                    );

            int managerId =
                    Integer.parseInt(
                            body.get("managerId")
                                    .toString()
                    );

            Connection con =
                    DBConnection.getConnection();

            PreparedStatement checkPs =
                    con.prepareStatement(
                            "SELECT user_id "
                            + "FROM users "
                            + "WHERE user_id=? "
                            + "AND role_id=3"
                    );

            checkPs.setInt(
                    1,
                    managerId
            );

            ResultSet checkRs =
                    checkPs.executeQuery();

            if (!checkRs.next()) {

                return Response
                        .status(400)
                        .entity(
                                "{\"error\":\"Selected user is not a manager\"}"
                        )
                        .build();
            }

            String sql =
                    "UPDATE workflows "
                    + "SET manager_id=? "
                    + "WHERE workflow_id=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(
                    1,
                    managerId
            );

            ps.setInt(
                    2,
                    workflowId
            );

            ps.executeUpdate();

            return Response.ok(
                    "{\"message\":\"Manager Assigned Successfully\"}"
            ).build();

        } catch (Exception e) {

            e.printStackTrace();

            return Response
                    .serverError()
                    .entity(
                            "{\"error\":\"Assignment Failed\"}"
                    )
                    .build();
        }
    }
    @PUT
    @Path("/publish/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> publishWorkflow(
            @PathParam("id") int workflowId
    ) {

        Map<String, Object> res =
                new HashMap<>();

        try {

            Connection con =
                    DBConnection.getConnection();

            // CHECK FIELDS

            String fieldSql =
                    "SELECT COUNT(*) "
                    + "FROM workflow_variables "
                    + "WHERE workflow_id=?";

            PreparedStatement fieldPs =
                    con.prepareStatement(fieldSql);

            fieldPs.setInt(1, workflowId);

            ResultSet fieldRs =
                    fieldPs.executeQuery();

            fieldRs.next();

            int fieldCount =
                    fieldRs.getInt(1);



            // VALIDATION

            if (fieldCount == 0) {

                res.put("status", "error");

                res.put(
                        "message",
                        "Please add form fields first"
                );

                return res;
            }


            // UPDATE STATUS

            String updateSql =
                    "UPDATE workflows "
                    + "SET workflow_status='READY' "
                    + "WHERE workflow_id=?";

            PreparedStatement updatePs =
                    con.prepareStatement(updateSql);

            updatePs.setInt(1, workflowId);

            updatePs.executeUpdate();

            res.put("status", "success");

            res.put(
                    "message",
                    "Workflow Published Successfully"
            );

        } catch (Exception e) {

            e.printStackTrace();

            res.put("status", "error");

            res.put("message", e.getMessage());
        }

        return res;
    }
    

}