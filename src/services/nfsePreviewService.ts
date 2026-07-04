import { danfseMock } from "../mocks/danfse";
import type { DanfseData } from "../types/danfse";

export async function getDanfsePreview(): Promise<DanfseData> {
  return danfseMock;
}

export async function downloadDanfsePdf(invoiceId: string) {
  const response = await fetch(`/api/nfse/${invoiceId}/danfse.pdf`, {
    method: "GET",
    headers: {
      Accept: "application/pdf",
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível baixar o PDF do DANFSe.");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `danfse-${invoiceId}.pdf`;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}