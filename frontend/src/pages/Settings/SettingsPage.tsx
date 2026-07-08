import { useState, type ChangeEvent } from "react";

import { company } from "../../mocks";

import { PageHeader } from "../../components/shared/PageHeader";
import { SectionHeader } from "../../components/shared/SectionHeader";

import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function SettingsPage() {
  const [form, setForm] = useState({
    name: company.name,
    cnpj: company.cnpj,
    municipalRegistration: company.municipalRegistration,
    email: company.email,
    phone: company.phone,
    street: company.address.street,
    number: company.address.number,
    neighborhood: company.address.neighborhood,
    city: company.address.city,
    state: company.address.state,
    zipCode: company.address.zipCode,
  });

  function handleChange(field: keyof typeof form) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Configurações"
        description="Dados cadastrais da empresa usados na emissão de notas fiscais."
        action={<Button>Salvar alterações</Button>}
      />

      <Card>
        <CardHeader>
          <SectionHeader
            title="Dados da empresa"
            description="Essas informações aparecem no cabeçalho das NFS-e emitidas."
          />
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Razão social"
              value={form.name}
              onChange={handleChange("name")}
            />

            <Input
              label="CNPJ"
              value={form.cnpj}
              onChange={handleChange("cnpj")}
            />

            <Input
              label="Inscrição municipal"
              value={form.municipalRegistration}
              onChange={handleChange("municipalRegistration")}
            />

            <Input
              label="E-mail"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
            />

            <Input
              label="Telefone"
              value={form.phone}
              onChange={handleChange("phone")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader
            title="Endereço"
            description="Endereço fiscal da empresa."
          />
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Input
              label="Rua"
              value={form.street}
              onChange={handleChange("street")}
            />

            <Input
              label="Número"
              value={form.number}
              onChange={handleChange("number")}
            />

            <Input
              label="Bairro"
              value={form.neighborhood}
              onChange={handleChange("neighborhood")}
            />

            <Input
              label="Cidade"
              value={form.city}
              onChange={handleChange("city")}
            />

            <Input
              label="Estado"
              value={form.state}
              onChange={handleChange("state")}
            />

            <Input
              label="CEP"
              value={form.zipCode}
              onChange={handleChange("zipCode")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
