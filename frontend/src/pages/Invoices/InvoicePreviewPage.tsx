import { useEffect, useRef, useState } from "react";

import { downloadDanfsePdf } from "../../services/nfsePreviewService";
import { DanfsePreview } from "../../components/nfse/DanfsePreview";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

import type { DanfseData } from "../../types/danfse";
import { getDanfsePreview } from "../../services/nfsePreviewService";
import { Link, useLocation } from "react-router-dom";

export function InvoicePreviewPage() {
  const location = useLocation();

  const [danfse, setDanfse] = useState<DanfseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const danfseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPreview() {
      try {
        const emittedDanfse = (location.state as { danfse?: DanfseData } | null)?.danfse;
        const data = emittedDanfse ?? (await getDanfsePreview());
        setDanfse(data);
      } finally {
        setIsLoading(false);
      }
    }

    loadPreview();
  }, [location.state]);

  function handlePrintDanfse() {
    window.print();
  }

  async function handleDownloadPdf() {
    if (!danfse) {
      return;
    }

    try {
      setIsGeneratingPdf(true);

      await downloadDanfsePdf(danfse.number);
    } catch (error) {
      console.error("Erro ao baixar PDF do DANFSe:", error);
      alert("Não foi possível baixar o PDF do DANFSe.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="no-print">
        <PageHeader
          title="Pré-visualização do DANFSe"
          description="Documento auxiliar da NFS-e preparado para receber os dados emitidos pelo backend."
          action={
            <div className="flex flex-wrap gap-3">
              <Badge variant="info">Ambiente de homologação</Badge>

              <Link to="/invoices/new">
                <Button variant="secondary">Voltar para edição</Button>
              </Link>

              <Button variant="secondary" onClick={handleDownloadPdf}>
                {isGeneratingPdf ? "Gerando PDF..." : "Baixar PDF"}
              </Button>

              <Button onClick={handlePrintDanfse}>
                Imprimir DANFSe
              </Button>
            </div>
          }
        />

        <div className="mt-8 rounded-2xl border border-brand/20 bg-brand/5 p-4">
          <p className="text-sm font-medium text-brand-light">
            Preview baseado na Nota Técnica Nº 008 — DANFSe
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Ao emitir pela tela de emissão, este preview já reflete os dados preenchidos no
            formulário. Acessando esta página diretamente, exibimos um exemplo mockado. A
            integração com o backend substituirá ambos os fluxos por uma chamada real à API.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
          Carregando pré-visualização do DANFSe...
        </div>
      )}

      {!isLoading && danfse && (
        <div ref={danfseRef} className="danfse-print-area">
          <DanfsePreview data={danfse} />
        </div>
      )}

      {!isLoading && !danfse && (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-6 text-sm text-danger">
          Não foi possível carregar a pré-visualização do DANFSe.
        </div>
      )}
    </div>
  );
}