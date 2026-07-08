import { QRCodeSVG } from "qrcode.react";
import type { DanfseData, DanfseParty } from "../../types/danfse";

type DanfsePreviewProps = {
  data: DanfseData;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function empty(value: string | number | undefined | null) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  return String(value);
}

function getStatusLabel(status: DanfseData["status"]) {
  const labels: Record<DanfseData["status"], string> = {
    draft: "Rascunho",
    authorized: "Autorizada",
    cancelled: "Cancelada",
    replaced: "Substituída",
    rejected: "Rejeitada",
  };

  return labels[status];
}

function PartyRows({ party }: { party?: DanfseParty }) {
  if (!party) {
    return (
      <div className="col-span-4 border-t border-black px-1 py-1 text-center text-[7px] font-bold uppercase">
        Tomador/Adquirente da operação não identificado na NFS-e
      </div>
    );
  }

  return (
    <>
      <Field label="CNPJ / CPF / NIF" value={party.document} />
      <Field label="Indicador Municipal" value={party.municipalRegistration} />
      <Field label="Telefone" value={party.phone} />
      <Field label="Nome / Nome Empresarial" value={party.name} wide />
      <Field label="Município / Sigla UF" value={`${party.city} / ${party.state}`} />
      <Field label="Código IBGE / CEP" value={`${empty(party.ibgeCode)} / ${empty(party.zipCode)}`} />
      <Field label="Endereço" value={party.address} wide />
      <Field label="E-mail" value={party.email} wide />
    </>
  );
}

function Field({
  label,
  value,
  wide = false,
  highlight = false,
}: {
  label: string;
  value?: string | number;
  wide?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
    className={[
        "min-h-[24px] border-t border-black px-1 py-0.5",
        wide ? "col-span-2" : "",
    ].join(" ")}
    style={highlight ? { backgroundColor: "#f5f5f5" } : undefined}
    >
      <p className="font-bold leading-tight">{label}</p>
      <p className="truncate leading-tight">{empty(value)}</p>
    </div>
  );
}

function BlockTitle({ children }: { children: string }) {
  return (
    <div
      className="col-span-4 border-t border-black px-1 py-0.5 text-[7px] font-bold uppercase"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      {children}
    </div>
  );
}

function Watermark({ status }: { status: DanfseData["status"] }) {
  if (status !== "cancelled" && status !== "replaced") {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span
        className="-rotate-45 text-[64px] uppercase"
        style={{ color: "rgba(0, 0, 0, 0.25)" }}
      >
        {status === "cancelled" ? "Cancelada" : "Substituída"}
      </span>
    </div>
  );
}

export function DanfsePreview({ data }: DanfsePreviewProps) {
  const qrCodeUrl = `https://www.nfse.gov.br/ConsultaPublica/?tpc=1&chave=${data.accessKey}`;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-4 print:bg-white print:p-0 print:border-0 print:rounded-none">
        <div
            className="danfse-print-paper danfse-a4-page mx-auto w-[794px] p-3 shadow-2xl print:w-[210mm] print:p-0 print:shadow-none"
            style={{
                backgroundColor: "#ffffff",
                color: "#000000",
            }}
        >
        <article className="relative min-h-[1123px] border border-black font-[Arial] text-[7px] leading-tight print:min-h-[297mm]">
          <Watermark status={data.status} />

          <section
            className="grid grid-cols-[1fr_2.2fr_1.1fr] border-b border-black"
            style={{ backgroundColor: "#f5f5f5" }}
          >
            <div className="text-2xl font-bold" style={{ color: "#15803d" }}>
                NFS-e
            </div>

            <div className="flex flex-col items-center justify-center border-l border-black px-2 py-2 text-center">
              <strong className="text-[9px]">DANFSe v2.0</strong>
              <strong className="text-[9px]">Documento Auxiliar da NFS-e</strong>

              {data.environmentType === "homologation" && (
                <strong className="mt-1 text-[9px]" style={{ color: "#dc2626" }}>
                    NFS-e SEM VALIDADE JURÍDICA
                </strong>
              )}
            </div>

            <div className="border-l border-black px-2 py-1">
              <p>
                <strong>Município:</strong> {data.cityName}
              </p>
              <p>
                <strong>Ambiente:</strong> {data.generatorEnvironment}
              </p>
              <p>
                <strong>Tipo de Ambiente:</strong>{" "}
                {data.environmentType === "production" ? "Produção" : "Homologação"}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-4">
            <BlockTitle>Dados da NFS-e</BlockTitle>

            <div className="col-span-3 border-t border-black px-1 py-1">
              <p className="font-bold uppercase">Chave de acesso da NFS-e</p>
              <p className="tracking-[0.12em]">{data.accessKey}</p>
            </div>

            <div className="row-span-4 flex flex-col items-center justify-center border-l border-t border-black p-1 text-center">
              <div className="flex h-[64px] w-[64px] items-center justify-center bg-white">
                <QRCodeSVG
                    value={qrCodeUrl}
                    size={58}
                    level="M"
                    includeMargin={false}
                />
                </div>

              <p className="mt-1 text-[6px] leading-tight">
                A autenticidade desta NFS-e pode ser verificada pela leitura deste código QR ou pela consulta da chave de acesso no portal nacional da NFS-e.
              </p>

              <p className="mt-1 break-all text-[5px]">{qrCodeUrl}</p>
            </div>

            <Field label="Número da NFS-e" value={data.number} />
            <Field label="Competência da NFS-e" value={data.competenceDate} />
            <Field label="Data e Hora da Emissão da NFS-e" value={data.issueDateTime} />

            <Field label="Número da DPS" value={data.dpsNumber} />
            <Field label="Série da DPS" value={data.dpsSeries} />
            <Field label="Data e Hora da Emissão da DPS" value={data.dpsIssueDateTime} />

            <Field label="Emitente da NFS-e" value={data.issuer} highlight />
            <Field label="Situação da NFS-e" value={getStatusLabel(data.status)} />
            <Field label="Finalidade" value={data.purpose} />

            <BlockTitle>Prestador / Fornecedor</BlockTitle>
            <PartyRows party={data.provider} />

            <BlockTitle>Tomador / Adquirente</BlockTitle>
            <PartyRows party={data.customer} />

            <BlockTitle>Destinatário da Operação</BlockTitle>
            {data.recipientIsCustomer ? (
              <div className="col-span-4 border-t border-black px-1 py-1 text-center text-[7px] font-bold uppercase">
                O destinatário é o próprio tomador/adquirente da operação
              </div>
            ) : (
              <PartyRows party={data.recipient} />
            )}

            <BlockTitle>Intermediário da Operação</BlockTitle>
            {data.intermediary ? (
              <PartyRows party={data.intermediary} />
            ) : (
              <div className="col-span-4 border-t border-black px-1 py-1 text-center text-[7px] font-bold uppercase">
                Intermediário da operação não identificado na NFS-e
              </div>
            )}

            <BlockTitle>Serviço Prestado</BlockTitle>
            <Field
              label="Código de Tributação Nacional / Municipal"
              value={`${data.service.nationalTaxCode} / ${empty(data.service.municipalTaxCode)}`}
            />
            <Field label="Código da NBS" value={data.service.nbsCode} />
            <Field
              label="Local da Prestação / Sigla UF / País"
              value={`${data.service.location} / ${data.service.locationState} / ${data.service.country}`}
              wide
            />

            <div className="col-span-4 border-t border-black px-1 py-1">
              <p>{data.service.taxDescription}</p>
              <p className="mt-1 min-h-[72px]">{data.service.description}</p>
            </div>

            <BlockTitle>Tributação Municipal (ISSQN)</BlockTitle>
            <Field label="Tipo de Tributação do ISSQN" value={data.municipalTax.taxationType} />
            <Field label="Município / UF / País de Incidência" value={data.municipalTax.incidenceLocation} wide />
            <Field label="Regime Especial de Tributação" value={data.municipalTax.specialRegime} />
            <Field label="Tipo de Imunidade" value={data.municipalTax.immunityType} />
            <Field label="Suspensão da Exigibilidade" value={data.municipalTax.suspendedEnforceability} />
            <Field label="Número Processo Suspensão" value={data.municipalTax.suspensionProcess} />
            <Field label="Benefício Municipal" value={data.municipalTax.municipalBenefit} />
            <Field label="Total Deduções/Reduções" value={formatCurrency(data.municipalTax.deductions)} />
            <Field label="Desconto Incondicionado" value={formatCurrency(data.municipalTax.unconditionalDiscount)} />
            <Field label="BC ISSQN" value={formatCurrency(data.municipalTax.calculationBase)} />
            <Field label="Alíquota Aplicada" value={`${data.municipalTax.rate.toFixed(2)}%`} />
            <Field label="Retenção do ISSQN" value={data.municipalTax.retention} />
            <Field label="ISSQN Apurado" value={formatCurrency(data.municipalTax.issqnAmount)} />

            <BlockTitle>Tributação Federal (Exceto CBS)</BlockTitle>
            <Field label="IRRF" value={formatCurrency(data.federalTax.irrf)} />
            <Field label="Contribuição Previdenciária - Retida" value={formatCurrency(data.federalTax.socialSecurity)} />
            <Field label="Contribuições Sociais - Retidas" value={formatCurrency(data.federalTax.socialContributions)} />
            <Field label="PIS - Débito Apuração Própria" value={formatCurrency(data.federalTax.pis)} />
            <Field label="COFINS - Débito Apuração Própria" value={formatCurrency(data.federalTax.cofins)} />
            <Field label="Descrição Contrib. Sociais - Retidas" value={data.federalTax.retentionDescription} wide />

            <BlockTitle>Tributação IBS / CBS</BlockTitle>
            <Field label="CST / cClassTrib" value={`${data.ibsCbsTax.cst} / ${data.ibsCbsTax.taxClass}`} />
            <Field
              label="Indicador / Código IBGE / Município / UF"
              value={`${data.ibsCbsTax.operationIndicator} / ${data.ibsCbsTax.incidenceCityCode} / ${data.ibsCbsTax.incidenceCity} / ${data.ibsCbsTax.incidenceState}`}
              wide
            />
            <Field label="Base de Cálculo" value={formatCurrency(data.ibsCbsTax.calculationBase)} />
            <Field label="Alíquota IBS UF / IBS Mun" value={`${data.ibsCbsTax.ibsStateRate}% / ${data.ibsCbsTax.ibsCityRate}%`} />
            <Field label="Valor Apurado Municipal - IBS" value={formatCurrency(data.ibsCbsTax.ibsCityAmount)} />
            <Field label="Valor Apurado Estadual - IBS" value={formatCurrency(data.ibsCbsTax.ibsStateAmount)} />
            <Field label="Valor Total Apurado - IBS" value={formatCurrency(data.ibsCbsTax.ibsTotalAmount)} />
            <Field label="Alíquota CBS" value={`${data.ibsCbsTax.cbsRate}%`} />
            <Field label="Valor Total Apurado - CBS" value={formatCurrency(data.ibsCbsTax.cbsAmount)} />

            <BlockTitle>Valor Total da NFS-e</BlockTitle>
            <Field label="Valor da Operação / Serviço" value={formatCurrency(data.totals.serviceAmount)} />
            <Field label="Desconto Incondicionado" value={formatCurrency(data.totals.unconditionalDiscount)} />
            <Field label="Desconto Condicionado" value={formatCurrency(data.totals.conditionalDiscount)} />
            <Field label="Total das Retenções" value={formatCurrency(data.totals.totalRetentions)} />
            <Field label="Valor Líquido da NFS-e" value={formatCurrency(data.totals.netAmount)} />
            <Field label="Total do IBS/CBS" value={formatCurrency(data.totals.ibsCbsTotal)} />
            <Field
              label="Valor Líquido da NFS-e + IBS/CBS"
              value={formatCurrency(data.totals.netAmountWithIbsCbs)}
              highlight
            />

            <BlockTitle>Informações Complementares</BlockTitle>
            <div className="col-span-4 min-h-[92px] border-t border-black px-1 py-1">
              <p>
                {empty(data.complementaryInfo.text)}
              </p>

              <p className="mt-2">
                Totais Aproximados dos Tributos cfe. Lei nº 12.741/2012:
                Federais: {formatCurrency(data.complementaryInfo.approximateTaxes.federal)} ;
                Estaduais: {formatCurrency(data.complementaryInfo.approximateTaxes.state)} ;
                Municipais: {formatCurrency(data.complementaryInfo.approximateTaxes.municipal)}
              </p>
            </div>

            <BlockTitle>Canhoto</BlockTitle>
            <Field label="Data Cientificação" value="-" />
            <Field label="Identificação e Assinatura" value="-" />
            <Field label="Nº NFS-e / Chave NFS-e" value={`${data.number} / ${data.accessKey}`} wide />
          </section>
        </article>
      </div>
    </div>
  );
}