import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import { DashboardView } from '../pages/Dashboard';
import { TransactionsView } from '../pages/Transactions';
import { BudgetsView } from '../pages/Budgets';
import { AnalyticsView } from '../pages/Analytics';
import { RecurringView } from '../pages/Recurring';
import { ReportsView } from '../pages/Reports';
import { NotificationsView } from '../pages/Notifications';
import { SecurityView } from '../pages/Security';
import { SettingsView } from '../pages/Settings';
import { SupportView } from '../pages/Support';
import { LoginView } from '../pages/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/transactions" element={<TransactionsView />} />
          <Route path="/budgets" element={<BudgetsView />} />
          <Route path="/analytics" element={<AnalyticsView />} />
          <Route path="/recurring" element={<RecurringView />} />
          <Route path="/reports" element={<ReportsView />} />
          <Route path="/notifications" element={<NotificationsView />} />
          <Route path="/security" element={<SecurityView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/support" element={<SupportView />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
