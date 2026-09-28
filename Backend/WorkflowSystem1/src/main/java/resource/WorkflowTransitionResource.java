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
@Path("/workflow-transitions")
public class WorkflowTransitionResource {

    // GET TRANSITIONS
    @GET
    @Path("/workflow/{workflowId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, Object>> getTransitions(
            @PathParam("workflowId") int workflowId
    ) {

        List<Map<String, Object>> list = new ArrayList<>();

        try {

            Connection con = DBConnection.getConnection();

            String sql = "SELECT * FROM workflow_transitions "
                    + "WHERE workflow_id = ?";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, workflowId);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                Map<String, Object> tr = new HashMap<>();

                tr.put("transitionId", rs.getInt("transition_id"));
                tr.put("fromState", rs.getInt("from_state"));
                tr.put("toState", rs.getInt("to_state"));
               tr.put("condition", rs.getString("transition_condition"));

                list.add(tr);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    // CREATE TRANSITION
    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> createTransition(
            Map<String, Object> data
    ) {

        Map<String, Object> res = new HashMap<>();

        try {

            Connection con = DBConnection.getConnection();

            String sql =
            "INSERT INTO workflow_transitions "
            + "(workflow_id, from_state, to_state, transition_condition) "
            + "VALUES (?, ?, ?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(
                    1,
                    Integer.parseInt(data.get("workflowId").toString())
            );

            ps.setInt(
                    2,
                    Integer.parseInt(data.get("fromState").toString())
            );

            ps.setInt(
                    3,
                    Integer.parseInt(data.get("toState").toString())
            );

            ps.setString(
                    4,
                    data.get("condition").toString()
            );

            ps.executeUpdate();

            res.put("status", "success");
            res.put("message", "Transition created successfully");

        } catch (Exception e) {

            e.printStackTrace();

            res.put("status", "error");
            res.put("message", e.getMessage());
        }

        return res;
    }
}

