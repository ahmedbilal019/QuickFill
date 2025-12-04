import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TemplateProvider } from "./context/TemplateContext";
import AppRoutes from "./routes/AppRoutes";

/**
 * Main App Component
 * Wraps the application with context providers and routing
 */
function App() {
  return (
    <AuthProvider>
      <TemplateProvider>
        <Router>
          <AppRoutes />
        </Router>
      </TemplateProvider>
    </AuthProvider>
  );
}

export default App;
