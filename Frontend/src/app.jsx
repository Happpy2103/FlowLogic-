import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import UserDashboard from "./pages/user/UserDashboard";

import ManagerDashboard from "./pages/manager/ManagerDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import WorkflowBuilder from "./pages/admin/WorkflowBuilder";
import ManageWorkflows from "./pages/admin/ManageWorkflows";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageWorkflowFields from "./pages/admin/ManageWorkflowFields";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Website */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/workflowmanage" element={<ManageWorkflows />} />
        <Route path="/manageusers" element={<ManageUsers />} />

        <Route
          path="/builder/:id"
          element={
            <ReactFlowProvider>
              <WorkflowBuilder />
            </ReactFlowProvider>
          }
        />

        <Route
          path="/admin/workflow-fields/:id"
          element={<ManageWorkflowFields />}
        />

        {/* User */}
        <Route path="/user" element={<UserDashboard />} />

        {/* Manager */}
        <Route path="/manager" element={<ManagerDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;