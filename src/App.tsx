import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";

import { Dashboard } from "./pages/Dashboard";
import CustomersPage from "./pages/Customers/CustomersPage";
import ServicesPage from "./pages/Services/ServicesPage";
import { CreateInvoicePage } from "./pages/Invoices/CreateInvoicePage";
import { InvoicePreviewPage } from "./pages/Invoices/InvoicePreviewPage";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="/invoices/new" element={<CreateInvoicePage />} />
        <Route path="/invoices/preview" element={<InvoicePreviewPage />} />

        <Route
          path="/invoices"
        />

        <Route
          path="/finance"
        />

        <Route
          path="/settings"
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;