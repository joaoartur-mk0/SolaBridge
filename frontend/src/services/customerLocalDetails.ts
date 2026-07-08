import type { Address } from "../types/address";

// O backend só tem `codigo_ibge` (município), não um endereço completo.
// Guardamos rua/número/bairro/CEP só neste navegador até o back ganhar essas
// colunas — por isso são "informações complementares" no formulário.
const STORAGE_KEY = "solabridge:customer-local-addresses";

type LocalAddressMap = Record<string, Address>;

function readAll(): LocalAddressMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalAddressMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: LocalAddressMap) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getLocalAddress(customerId: string): Address | null {
  return readAll()[customerId] ?? null;
}

export function saveLocalAddress(customerId: string, address: Address) {
  const all = readAll();
  all[customerId] = address;
  writeAll(all);
}

export function removeLocalAddress(customerId: string) {
  const all = readAll();
  delete all[customerId];
  writeAll(all);
}