import { useState } from "react";
import { services } from "../../mocks";

export default function ServicesPage() {

    const [search, setSearch] = useState("");

    const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="max-w-7xl mx-auto p-6 space-y-8">

            {/* Cabeçalho */}

            <section className="space-y-2">

                <h1 className="text-3xl font-bold text-gray-900">
                    Serviços
                </h1>

                <p className="text-gray-600">
                    Cadastre, edite e visualize os serviços oferecidos.
                </p>

            </section>

            {/* Barra de ações */}

            <section className="flex items-center justify-between gap-4">

                <div className="flex-1">

                    <input
                        type="text"
                        placeholder="Pesquisar serviço..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                </div>

                <button
                    type="button"
                    className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
                >
                    Novo Serviço
                </button>

            </section>

            {/* Tabela */}

            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Serviço
                            </th>

                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Descrição
                            </th>

                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Preço
                            </th>

                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                Ações
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredServices.map((service) => (

                            <tr
                                key={service.id}
                                className="border-t border-gray-200 transition-colors hover:bg-gray-50"
                            >

                                <td className="px-6 py-4">
                                    {service.name}
                                </td>

                                <td className="px-6 py-4">
                                    {service.description}
                                </td>

                                <td className="px-6 py-4">
                                    {service.price.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}
                                </td>

                                <td className="px-6 py-4">

                                    <div className="flex justify-center gap-2">

                                        <button
                                            type="button"
                                            className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white transition-colors hover:bg-indigo-700"
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