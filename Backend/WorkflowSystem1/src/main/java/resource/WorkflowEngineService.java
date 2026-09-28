/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package resource;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import servlets.DBConnection;

/**
 *
 * @author Happy Patel
 */
public class WorkflowEngineService {

    public void executeWorkflow(
            int instanceId,
            int actionBy
    ) {

        Connection con = null;

        try {

            con = DBConnection.getConnection();

            // Get Workflow Id

            String workflowSql =
                    "SELECT workflow_id "
                    + "FROM workflow_instances "
                    + "WHERE instance_id=?";

            PreparedStatement wfPs =
                    con.prepareStatement(workflowSql);

            wfPs.setInt(1, instanceId);

            ResultSet wfRs =
                    wfPs.executeQuery();

            if (!wfRs.next()) {
                return;
            }

            int workflowId =
                    wfRs.getInt("workflow_id");

            // Load States

            String stateSql =
                    "SELECT * "
                    + "FROM workflow_states "
                    + "WHERE workflow_id=? "
                    + "ORDER BY sequence_no";

            PreparedStatement statePs =
                    con.prepareStatement(stateSql);

            statePs.setInt(1, workflowId);

            ResultSet stateRs =
                    statePs.executeQuery();

            while (stateRs.next()) {

                int stateId =
                        stateRs.getInt("state_id");

                String stateName =
                        stateRs.getString("state_name");

                String stateType =
                        stateRs.getString("state_type");

                // Update Current State

                String updateState =
                        "UPDATE workflow_instances "
                        + "SET current_state=? "
                        + "WHERE instance_id=?";

                PreparedStatement updatePs =
                        con.prepareStatement(updateState);

                updatePs.setInt(1, stateId);

                updatePs.setInt(2, instanceId);

                updatePs.executeUpdate();

                // Execute Node

                processNode(
                        stateType,
                        stateName
                );

                // Write Log

                insertLog(
                        con,
                        instanceId,
                        stateId,
                        actionBy,
                        stateType,
                        stateName
                );

                Thread.sleep(1000);
            }

            // Mark Completed

            String completeSql =
                "UPDATE workflow_instances "
                + "SET completed_at=NOW() "
                + "WHERE instance_id=?";

            PreparedStatement completePs =
                    con.prepareStatement(completeSql);

            completePs.setInt(
                    1,
                    instanceId
            );

            completePs.executeUpdate();

        } catch (Exception e) {

            e.printStackTrace();

        } finally {

            try {

                if (con != null) {
                    con.close();
                }

            } catch (Exception e) {
            }
        }
    }

    // NODE EXECUTOR

    private void processNode(
            String stateType,
            String stateName
    ) {

        switch (
                stateType.toUpperCase()
        ) {

            case "START":

                System.out.println(
                        "Workflow Started"
                );

                break;

            case "VARIABLE":

                System.out.println(
                        "Variable Node Executed : "
                        + stateName
                );

                break;

            case "ACTION":

                System.out.println(
                        "Action Node Executed : "
                        + stateName
                );

                break;

            case "CONDITION":

                System.out.println(
                        "Condition Node Executed : "
                        + stateName
                );

                break;

            case "END":

                System.out.println(
                        "Workflow Finished"
                );

                break;
        }
    }

    // LOG

    private void insertLog(
            Connection con,
            int instanceId,
            int stateId,
            int actionBy,
            String stateType,
            String stateName
    ) throws Exception {

        String sql =
                "INSERT INTO workflow_action_logs "
                + "("
                + "instance_id,"
                + "state_id,"
                + "action_by,"
                + "action,"
                + "remarks"
                + ") "
                + "VALUES(?,?,?,?,?)";

        PreparedStatement ps =
                con.prepareStatement(sql);

        ps.setInt(1, instanceId);

        ps.setInt(2, stateId);

        ps.setInt(3, actionBy);

        ps.setString(
                4,
                stateType + "_EXECUTED"
        );

        ps.setString(
                5,
                stateName + " executed"
        );

        ps.executeUpdate();
    }
}
