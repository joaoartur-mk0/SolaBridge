import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import { LoginPage } from "./pages/Auth/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import CustomersPage from "./pages/Customers/CustomersPage";
import ServicesPage from "./pages/Services/ServicesPage";
import { CreateInvoicePage } from "./pages/Invoices/CreateInvoicePage";
import { InvoicePreviewPage } from "./pages/Invoices/InvoicePreviewPage";
import { InvoicesPage } from "./pages/Invoices/InvoicesPage";
import { AccountsPage } from "./pages/Accounts/AccountsPage";
import { JournalEntriesPage } from "./pages/Ledger/JournalEntriesPage";
import { BalanceSheetPage } from "./pages/Reports/BalanceSheetPage";
import { IncomeStatementPage } from "./pages/Reports/IncomeStatementPage";
import { LiquidityPage } from "./pages/Reports/LiquidityPage";
import { AccountLedgerPage } from "./pages/Reports/AccountLedgerPage";
import { SettingsPage } from "./pages/Settings/SettingsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/services" element={<ServicesPage />} />

      <Route path="/invoices/new" element={<CreateInvoicePage />} />
      <Route path="/invoices/preview" element={<InvoicePreviewPage />} />

      <Route path="/invoices" element={<InvoicesPage />} />

      <Route path="/accounts" element={<AccountsPage />} />
      <Route path="/ledger" element={<JournalEntriesPage />} />

      <Route path="/balanco" element={<BalanceSheetPage />} />
      <Route path="/dre" element={<IncomeStatementPage />} />
      <Route path="/liquidez" element={<LiquidityPage />} />
      <Route path="/extrato" element={<AccountLedgerPage />} />

      <Route path="/settings" element={<SettingsPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;