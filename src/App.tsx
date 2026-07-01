import { AppLayout } from "./components/layout/AppLayout";
import { PageHeader } from "./components/shared/PageHeader";
import { SectionHeader } from "./components/shared/SectionHeader";
import { StatusBadge } from "./components/shared/StatusBadge";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Select } from "./components/ui/Select";
import { StatCard } from "./components/ui/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/Table";

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
          <StatCard
            title="Receita do mês"
            value="R$ 12.450,00"
            description="Total faturado em junho"
          />

          <StatCard
            title="Notas emitidas"
            value="18"
            description="NFS-e emitidas no mês"
          />

          <StatCard
            title="Impostos estimados"
            value="R$ 622,50"
            description="Estimativa com base nas notas"
          />

          <StatCard
            title="Pendências"
            value="3"
            description="Notas aguardando processamento"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Input label="Cliente" placeholder="Nome do cliente" />

          <Select label="Status">
            <option>Todos</option>
            <option>Emitida</option>
            <option>Pendente</option>
            <option>Rejeitada</option>
          </Select>
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Últimas notas fiscais"
            description="Notas emitidas recentemente no sistema."
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>NFSE-000123</TableCell>
                <TableCell>Tech Serviços LTDA</TableCell>
                <TableCell>R$ 1.250,00</TableCell>
                <TableCell>
                  <StatusBadge status="issued" />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>NFSE-000124</TableCell>
                <TableCell>Maria Souza</TableCell>
                <TableCell>R$ 850,00</TableCell>
                <TableCell>
                  <StatusBadge status="pending" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}

export default App;