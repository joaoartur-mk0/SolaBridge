import { useState } from "react";
import { customers } from "../../mocks";

export default function CustomersPage() {
    const [search, setSearch] = useState("");

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="max-w-7xl mx-auto p-6 space-y-8">

            {/* Cabecalho */}

            <section className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                    Clientes
                </h1>

                <p className="text-gray-600">
                    Cadastre, edite e visualize seus clientes.
                </p>

            </section>

            {/*Barra de ações */}

            <section className="flex items-center justify-between gap-4">
                <div className="flex-1">

                    <input
                        type="text"
                        placeholder="Pesquisar cliente..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>

                    <button
                        type="button"
                        className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
                    >
                        Novo Cliente
                    </button>

                </div>

            </section>

            {/* Tabela */}

            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Nome
                            </th>

                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Documento
                            </th>

                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Email
                            </th>

                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Telefone
                            </th>

                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Cidade
                            </th>

                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Ações
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredCustomers.map((customer) => (

                            <tr
                                key={customer.id}
                                className="border-t border-gray-200 transition-colors hover:bg-gray-50"
                            >

                                <td className="px-6 py-4">
                                    {customer.name}
                                </td>

                                <td className="px-6 py-4">
                                    {customer.document}
                                </td>

                                <td className="px-6 py-4">
                                    {customer.email}
                                </td>

                                <td className="px-6 py-4">
                                    {customer.phone}
                                </td>

                                <td className="px-6 py-4">
                                    {customer.address.city}
                                </td>

                                <td className="px-6 py-4">

                                    <div className="flex gap-2">

                                        <button
                                            type="button"
                                            className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
                                        >
                                            Excluir
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </section>

        </main>
    );
}