import { useEffect, useRef, useState } from "react";

import { downloadDanfsePdf } from "../../services/nfsePreviewService";
import { DanfsePreview } from "../../components/nfse/DanfsePreview";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

import type { DanfseData } from "../../types/danfse";
import { getDanfsePreview } from "../../services/nfsePreviewService";
import { Link } from "react-router-dom";

export function InvoicePreviewPage() {
  const [danfse, setDanfse] = useState<DanfseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const danfseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPreview() {
      try {
        const data = await getDanfsePreview();
        setDanfse(data);
      } finally {
        setIsLoading(false);
      }
    }

    loadPreview();
  }, []);

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

        <div className="mt-8 rounded-2xl border border-lime-400/20 bg-lime-400/5 p-4">
          <p className="text-sm font-medium text-lime-300">
            Preview baseado na Nota Técnica Nº 008 — DANFSe
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Esta tela já está estruturada para trocar o mock por um payload vindo do Laravel.
            O backend deve retornar os dados normalizados da NFS-e/XML, e o frontend apenas renderiza o DANFSe.
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
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-sm text-red-300">
          Não foi possível carregar a pré-visualização do DANFSe.
        </div>
      )}
    </div>
  );
}