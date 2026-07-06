import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";

import { Dashboard } from "./pages/Dashboard";
import CustomersPage from "./pages/Customers/CustomersPage";
import ServicesPage from "./pages/Services/ServicesPage";
import { CreateInvoicePage } from "./pages/Invoices/CreateInvoicePage";
import { InvoicePreviewPage } from "./pages/Invoices/InvoicePreviewPage";
import { InvoicesPage } from "./pages/Invoices/InvoicesPage";
import FinancePage from "./pages/Finance/FinancePage";
import { SettingsPage } from "./pages/Settings/SettingsPage";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="/invoices/new" element={<CreateInvoicePage />} />
        <Route path="/invoices/preview" element={<InvoicePreviewPage />} />

        <Route path="/invoices" element={<InvoicesPage />} />

        <Route path="/finance" element={<FinancePage />} />

        <Route path="/settings" element={<SettingsPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;