import { useState } from "react";

import { AppLayout } from "./components/layout/AppLayout";
import { Button } from "./components/ui/Button";

import CustomersPage from "./pages/CustomersPage";
import ServicesPage from "./pages/ServicesPage";

type CurrentPage = "customers" | "services";

function App() {

    const [currentPage, setCurrentPage] =
        useState<CurrentPage>("customers");

    return (

        <AppLayout>

            <div className="space-y-6">

                <div className="flex flex-wrap gap-3 border-b border-slate-800 pb-4">

                    <Button
                        variant={
                            currentPage === "customers"
                                ? "primary"
                                : "secondary"
                        }
                        onClick={() => setCurrentPage("customers")}
                    >
                        Clientes
                    </Button>

                    <Button
                        variant={
                            currentPage === "services"
                                ? "primary"
                                : "secondary"
                        }
                        onClick={() => setCurrentPage("services")}
                    >
                        Serviços
                    </Button>

                </div>

                {currentPage === "customers" && <CustomersPage />}

                {currentPage === "services" && <ServicesPage />}

            </div>

        </AppLayout>

    );
}

export default App;