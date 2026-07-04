import { dashboard } from "../mocks";
import { StatCard } from "../components/ui/StatCard";

export default function DashboardPage(){

    return (

        <main className="max-w-7xl mx-auto p-6 space-y-8">  

            {/* Cabecalho */}

            <section className="space-y-2">   

                <h1 className="text-3x1 font-bold text-gray-900">  
                    Dashboard
                </h1>   
                
                <p className="text-gray-600">
                    Acompanhe os principais indicadores da empresa
                </p>

            </section>

            {/* Cards */}

             <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                <StatCard
                    title="Receita do mês"
                    value={dashboard.monthlyRevenue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                />

                <StatCard
                    title="Despesas"
                    value={dashboard.monthlyExpenses.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                />

                <StatCard
                    title="Saldo"
                    value={dashboard.balance.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                />

                <StatCard
                    title="Impostos"
                    value={dashboard.estimatedTaxes.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                />

                <StatCard
                    title="Notas Emitidas"
                    value={dashboard.invoicesIssued.toString()}
                />

                <StatCard
                    title="Notas Pendentes"
                    value={dashboard.pendingInvoices.toString()}
                />

            </section>

        </main>
    )
}