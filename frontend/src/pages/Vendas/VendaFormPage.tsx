import { useEffect, useState, type ChangeEvent } from "react";

import type { Customer } from "../../types/customer";
import type { Product } from "../../types/product";
import { ApiError } from "../../services/apiClient";
import { listCustomers } from "../../services/customersService";
import { listProdutos } from "../../services/produtosService";
import {
  createVenda,
  type CreateVendaInput,
} from "../../services/vendasService";
import type { PaymentMethod } from "../../services/comprasService";

import { PageHeader } from "../../components/shared/PageHeader";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const emptyForm = {
  customerId: "",
  productId: "",
  quantity: "",
  totalAmount: "",
  paymentMethod: "A_VISTA" as PaymentMethod,
  saleDate: today(),
};

type VendaForm = typeof emptyForm;

export function VendaFormPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsError, setProductsError] = useState("");
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState<VendaForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReferences() {
      const [customersResult, productsResult] = await Promise.allSettled([
        listCustomers({ status: "active" }),
        listProdutos(),
      ]);

      if (!active) {
        return;
      }

      if (customersResult.status === "fulfilled") {
        setCustomers(customersResult.value);
      } else {
        setLoadError(
          customersResult.reason instanceof ApiError
            ? customersResult.reason.message
            : "Não foi possível carregar os clientes."
        );
      }

      if (productsResult.status === "fulfilled") {
        setProducts(productsResult.value);
        setProductsError("");
      } else {
        // GET /produtos ainda depende da tarefa B1 do backend.
        setProductsError(
          "A listagem de produtos ainda não está disponível no backend (tarefa B1). O cadastro de produtos precisa expor GET /produtos para habilitar este campo."
        );
      }
    }

    loadReferences();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(field: keyof VendaForm) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  async function handleSubmit() {
    setFormError("");
    setSuccessMessage("");

    if (!form.customerId) {
      setFormError("Selecione um cliente.");
      return;
    }

    if (!form.productId) {
      setFormError("Selecione um produto.");
      return;
    }

    const quantity = Number(form.quantity);
    const totalAmount = Number(form.totalAmount);

    if (!quantity || quantity <= 0) {
      setFormError("Informe uma quantidade maior que zero.");
      return;
    }

    if (!totalAmount || totalAmount <= 0) {
      setFormError("Informe o valor total da venda.");
      return;
    }

    if (!form.saleDate) {
      setFormError("Informe a data da venda.");
      return;
    }

    const input: CreateVendaInput = {
      customerId: form.customerId,
      productId: form.productId,
      quantity,
      totalAmount,
      paymentMethod: form.paymentMethod,
      saleDate: form.saleDate,
    };

    setIsSaving(true);

    try {
      const venda = await createVenda(input);

      setSuccessMessage(
        `Venda registrada (título #${venda.tituloId}, ${venda.status}). Saída de estoque, receita e CMV lançados — total ${formatCurrency(
          venda.total
        )}.`
      );

      setForm((current) => ({
        ...current,
        productId: "",
        quantity: "",
        totalAmount: "",
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.firstFieldError ?? error.message);
      } else {
        setFormError("Não foi possível registrar a venda.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const canSubmit = customers.length > 0 && products.length > 0 && !isSaving;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Registrar Venda"
        description="Saída de mercadoria: gera movimentação de estoque, título a receber, receita e CMV."
      />

      {loadError && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {loadError}
        </p>
      )}

      {productsError && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          {productsError}
        </p>
      )}

      {successMessage && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </p>
      )}

      <Card>
        <CardHeader>
          <SectionHeader
            title="Dados da venda"
            description="Uma venda registra a saída de um produto por vez. O valor informado é o total da venda."
          />
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 md:grid-cols-2">
            <Select
              label="Cliente"
              value={form.customerId}
              onChange={handleChange("customerId")}
            >
              <option value="">Selecione um cliente…</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} — {customer.document}
                </option>
              ))}
            </Select>

            <Select
              label="Produto"
              value={form.productId}
              onChange={handleChange("productId")}
              disabled={products.length === 0}
            >
              <option value="">
                {products.length === 0
                  ? "Nenhum produto disponível"
                  : "Selecione um produto…"}
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.description}
                  {product.sku ? ` (${product.sku})` : ""}
                </option>
              ))}
            </Select>

            <Input
              label="Quantidade"
              type="number"
              min="0"
              step="0.001"
              value={form.quantity}
              onChange={handleChange("quantity")}
            />

            <Input
              label="Valor total da venda"
              type="number"
              min="0"
              step="0.01"
              value={form.totalAmount}
              onChange={handleChange("totalAmount")}
            />

            <Select
              label="Forma de pagamento"
              value={form.paymentMethod}
              onChange={handleChange("paymentMethod")}
            >
              <option value="A_VISTA">À vista</option>
              <option value="PRAZO">A prazo</option>
            </Select>

            <Input
              label="Data da venda"
              type="date"
              value={form.saleDate}
              onChange={handleChange("saleDate")}
            />
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-800 pt-5">
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {isSaving ? "Registrando…" : "Registrar venda"}
            </Button>
          </div>

          {formError && <p className="mt-4 text-sm text-danger">{formError}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
