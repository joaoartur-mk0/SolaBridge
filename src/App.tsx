import { AppLayout } from "./components/layout/AppLayout";
import { PageHeader } from "./components/shared/PageHeader";
import { StatusBadge } from "./components/shared/StatusBadge";
import { Button } from "./components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/Card";
import { Input } from "./components/ui/Input";

function App() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Visão geral da gestão contábil e fiscal da empresa."
          action={<Button>Nova NFS-e</Button>}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Receita do mês</CardTitle>
              <CardDescription>Total faturado em junho</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-50">R$ 12.450,00</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notas emitidas</CardTitle>
              <CardDescription>NFS-e emitidas no mês</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-50">18</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Situação da última nota</CardDescription>
            </CardHeader>
            <CardContent>
              <StatusBadge status="issued" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
              <CardDescription>Exemplo de input</CardDescription>
            </CardHeader>
            <CardContent>
              <Input placeholder="Nome do cliente" />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export default App;