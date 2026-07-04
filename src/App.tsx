import { useState } from "react";

import { AppLayout } from "./components/layout/AppLayout";
import { Button } from "./components/ui/Button";

import { Dashboard } from "./pages/Dashboard";
import { CreateInvoicePage } from "./pages/Invoices/CreateInvoicePage";
import { InvoicePreviewPage } from "./pages/Invoices/InvoicePreviewPage";

type CurrentPage = "dashboard" | "create-invoice" | "preview-invoice";

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>("dashboard");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 border-b border-slate-800 pb-4">
          <Button
            variant={currentPage === "dashboard" ? "primary" : "secondary"}
            onClick={() => setCurrentPage("dashboard")}
          >
            Dashboard
          </Button>

          <Button
            variant={currentPage === "create-invoice" ? "primary" : "secondary"}
            onClick={() => setCurrentPage("create-invoice")}
          >
            Emitir NFS-e
          </Button>

          <Button
            variant={currentPage === "preview-invoice" ? "primary" : "secondary"}
            onClick={() => setCurrentPage("preview-invoice")}
          >
            Pré-visualização
          </Button>
        </div>

        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "create-invoice" && <CreateInvoicePage />}
        {currentPage === "preview-invoice" && <InvoicePreviewPage />}
      </div>
    </AppLayout>
  );
}

export default App;