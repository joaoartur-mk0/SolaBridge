import { useState } from "react";

import { finances } from "../../mocks";

import { PageHeader } from "../../components/shared/PageHeader";

import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "../../components/ui/Table";

export default function FinancePage() {

    const [search, setSearch] = useState("");

    const filteredFinances = finances.filter((finance) =>
        finance.description.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <main className="space-y-8">

            <PageHeader
                title="Financeiro"
                description="Controle as receitas e despesas da empresa."
                action={
                    <Button>
                        Nova Movimentação
                    </Button>
                }
            />

            <Input
                placeholder="Pesquisar movimentação..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <Table>

                <TableHeader>

                    <TableRow>

                        <TableHead>
                            Descrição
                        </TableHead>

                        <TableHead>
                            Categoria
                        </TableHead>

                        <TableHead>
                            Tipo
                        </TableHead>

                        <TableHead>
                            Valor
                        </TableHead>

                        <TableHead>
                            Data
                        </TableHead>

                        <TableHead>
                            Status
                        </TableHead>

                        <TableHead>
                            Ações
                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {filteredFinances.map((finance) => (

                        <TableRow key={finance.id}>

                            <TableCell>
                                {finance.description}
                            </TableCell>

                            <TableCell>
                                {finance.category}
                            </TableCell>

                            <TableCell>
                                {finance.type}
                            </TableCell>

                            <TableCell>

                                {finance.value.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}

                            </TableCell>

                            <TableCell>
                                {finance.date}
                            </TableCell>

                            <TableCell>

                                {finance.status}

                            </TableCell>

                            <TableCell>

                                <div className="flex gap-2">

                                    <Button>
                                        Editar
                                    </Button>

                                    <Button>
                                        Excluir
                                    </Button>

                                </div>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </main>

    );

}