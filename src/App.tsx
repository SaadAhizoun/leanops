import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import PublicLayout from "@/components/PublicLayout";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AuthCallback from "./pages/auth/AuthCallback";
import Dashboard from "./pages/app/Dashboard";
import KnowledgeHub from "./pages/app/KnowledgeHub";
import KnowledgeTopic from "./pages/app/KnowledgeTopic";
import Toolkits from "./pages/app/Toolkits";
import ToolkitDetail from "./pages/app/ToolkitDetail";
import Problems from "./pages/app/Problems";
import NewCase from "./pages/app/NewCase";
import CaseDetail from "./pages/app/CaseDetail";
import MyWork from "./pages/app/MyWork";
import Projects from "./pages/app/Projects";
import ProjectDetail from "./pages/app/ProjectDetail";
import ActionPlans from "./pages/app/ActionPlans";
import Assessments from "./pages/app/Assessments";
import AssessmentDetail from "./pages/app/AssessmentDetail";
import Favorites from "./pages/app/Favorites";
import Notifications from "./pages/app/Notifications";
import Profile from "./pages/app/Profile";
import AppSettings from "./pages/app/AppSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminSystem from "./pages/admin/AdminSystem";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout><Index /></PublicLayout>} path="/" />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
            <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            {/* App */}
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="problems" element={<Problems />} />
              <Route path="problems/new" element={<NewCase />} />
              <Route path="problems/:id" element={<CaseDetail />} />
              <Route path="my-work" element={<MyWork />} />
              <Route path="knowledge" element={<KnowledgeHub />} />
              <Route path="knowledge/:slug" element={<KnowledgeTopic />} />
              <Route path="toolkits" element={<Toolkits />} />
              <Route path="toolkits/:slug" element={<ToolkitDetail />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="action-plans" element={<ActionPlans />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="assessments/:id" element={<AssessmentDetail />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<AppSettings />} />
            </Route>
            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AppLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="system" element={<AdminSystem />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
