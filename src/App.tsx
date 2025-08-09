import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AppLayout from "./components/layout/AppLayout";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import DashboardPage from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Trends from "./pages/Trends";
import SignalCenter from "./pages/SignalCenter";
import TradeJournal from "./pages/TradeJournal";
import AICoach from "./pages/AICoach";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PaperTrading from "./pages/PaperTrading";
import PaymentSuccess from "./pages/PaymentSuccess";
import Admin from "./pages/Admin";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/signals" element={<SignalCenter />} />
            <Route path="/signal-center" element={<SignalCenter />} />
            <Route path="/journal" element={<TradeJournal />} />
            <Route path="/coach" element={<AICoach />} />
            <Route path="/ai-coach" element={<AICoach />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/paper" element={<PaperTrading />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
        <Toaster />
      </Router>
    </HelmetProvider>
  );
}

export default App;