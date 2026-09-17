import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import type { Supplier } from "../../types/supplier";
import type { Product } from "../../types/product";
import { ApiError } from "../../services/apiClient";
import { listSuppliers } from "../../services/suppliersService";
import { listProdutos } from "../../services/produtosService";
import {
  createCompra,
  type CreateCompraInput,
  type PaymentMethod,
} from "../../services/comprasService";

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
  supplierId: "",
  productId: "",
  quantity: "",
  unitCost: "",
  paymentMethod: "A_VISTA" as PaymentMethod,
  purchaseDate: today(),
};

type CompraForm = typeof emptyForm;

export function CompraFormPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsError, setProductsError] = useState("");
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState<CompraForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReferences() {
      const [suppliersResult, productsResult] = await Promise.allSettled([
        listSuppliers({ status: "active" }),
        listProdutos(),
      ]);

      if (!active) {
        return;
      }

      if (suppliersResult.status === "fulfilled") {
        setSuppliers(suppliersResult.value);
      } else {
        setLoadError(
          suppliersResult.reason instanceof ApiError
            ? suppliersResult.reason.message
            : "Não foi possível carregar os fornecedores."
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

  const total = useMemo(() => {
    const quantity = Number(form.quantity);
    const unitCost = Number(form.unitCost);

    if (!quantity || !unitCost || quantity <= 0 || unitCost <= 0) {
      return 0;
    }

    return quantity * unitCost;
  }, [form.quantity, form.unitCost]);

  function handleChange(field: keyof CompraForm) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  async function handleSubmit() {
    setFormError("");
    setSuccessMessage("");

    if (!form.supplierId) {
      setFormError("Selecione um fornecedor.");
      return;
    }

    if (!form.productId) {
      setFormError("Selecione um produto.");
      return;
    }

    const quantity = Number(form.quantity);
    const unitCost = Number(form.unitCost);

    if (!quantity || quantity <= 0) {
      setFormError("Informe uma quantidade maior que zero.");
      return;
    }

    if (!unitCost || unitCost <= 0) {
      setFormError("Informe um custo unitário maior que zero.");
      return;
    }

    if (!form.purchaseDate) {
      setFormError("Informe a data da compra.");
      return;
    }

    const input: CreateCompraInput = {
      supplierId: form.supplierId,
      productId: form.productId,
      quantity,
      unitCost,
      paymentMethod: form.paymentMethod,
      purchaseDate: form.purchaseDate,
    };

    setIsSaving(true);

    try {
      const compra = await createCompra(input);

      setSuccessMessage(
        `Compra registrada (título #${compra.tituloId}, ${compra.status}). Entrada de estoque e lançamento contábil gerados — total ${formatCurrency(
          compra.total
        )}.`
      );

      setForm((current) => ({
        ...current,
        productId: "",
        quantity: "",
        unitCost: "",
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.firstFieldError ?? error.message);
      } else {
        setFormError("Não foi possível registrar a compra.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const canSubmit = suppliers.length > 0 && products.length > 0 && !isSaving;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Registrar Compra"
        description="Entrada de mercadoria: gera movimentação de estoque, título a pagar e lançamento contábil."
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
            title="Dados da compra"
            description="Uma compra registra a entrada de um produto por vez."
          />
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 md:grid-cols-2">
            <Select
              label="Fornecedor"
              value={form.supplierId}
              onChange={handleChange("supplierId")}
            >
              <option value="">Selecione um fornecedor…</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} — {supplier.document}
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
              label="Custo unitário"
              type="number"
              min="0"
              step="0.01"
              value={form.unitCost}
              onChange={handleChange("unitCost")}
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
              label="Data da compra"
              type="date"
              value={form.purchaseDate}
              onChange={handleChange("purchaseDate")}
            />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
            <div className="text-sm text-slate-400">
              Total da compra:{" "}
              <span className="text-base font-semibold text-slate-100">
                {formatCurrency(total)}
              </span>
            </div>

            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {isSaving ? "Registrando…" : "Registrar compra"}
            </Button>
          </div>

          {formError && <p className="mt-4 text-sm text-danger">{formError}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
