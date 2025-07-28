import type { Despesa } from "@/store/slices/despesaSlice";
import type { Empenho } from "@/store/slices/empenhoSlice";
import type { Pagamento } from "@/store/slices/pagamentoSlice";

export function calculateDespesaStatus(
  despesa: Despesa,
  empenhos: Empenho[],
  pagamentos: Pagamento[]
): string {
  const despesaEmpenhos = empenhos.filter((e) => e.despesaId === despesa.id);
  const totalEmpenhos = despesaEmpenhos.reduce(
    (sum, e) => sum + e.valorEmpenho,
    0
  );

  if (despesaEmpenhos.length === 0) {
    return "Aguardando Empenho";
  }

  if (totalEmpenhos < despesa.valor) {
    return "Parcialmente Empenhada";
  }

  // Verificar pagamentos
  const empenhoIds = despesaEmpenhos.map((e) => e.id);
  const despesaPagamentos = pagamentos.filter((p) =>
    empenhoIds.includes(p.empenhoId)
  );
  const totalPagamentos = despesaPagamentos.reduce(
    (sum, p) => sum + p.valorPagamento,
    0
  );

  if (despesaPagamentos.length === 0) {
    return "Aguardando Pagamento";
  }

  if (totalPagamentos < despesa.valor) {
    return "Parcialmente Paga";
  }

  return "Paga";
}

export function validateEmpenhoValue(
  despesa: Despesa,
  empenhos: Empenho[],
  novoValor: number,
  empenhoEditandoId?: string
): string | null {
  const empenhosExistentes = empenhos.filter(
    (e) => e.despesaId === despesa.id && e.id !== empenhoEditandoId
  );
  const totalExistente = empenhosExistentes.reduce(
    (sum, e) => sum + e.valorEmpenho,
    0
  );

  if (totalExistente + novoValor > despesa.valor) {
    return `O valor total dos empenhos (R$ ${(
      totalExistente + novoValor
    ).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}) não pode ultrapassar o valor da despesa (R$ ${despesa.valor.toLocaleString(
      "pt-BR",
      { minimumFractionDigits: 2 }
    )})`;
  }

  return null;
}

export function validatePagamentoValue(
  empenho: Empenho,
  pagamentos: Pagamento[],
  novoValor: number,
  pagamentoEditandoId?: string
): string | null {
  const pagamentosExistentes = pagamentos.filter(
    (p) =>
      p.empenhoId === empenho.id &&
      (!pagamentoEditandoId || p.id?.toString() !== pagamentoEditandoId)
  );
  const totalExistente = pagamentosExistentes.reduce(
    (sum, p) => sum + p.valorPagamento,
    0
  );

  if (totalExistente + novoValor > empenho.valorEmpenho) {
    return `O valor total dos pagamentos (R$ ${(
      totalExistente + novoValor
    ).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}) não pode ultrapassar o valor do empenho (R$ ${empenho.valorEmpenho.toLocaleString(
      "pt-BR",
      { minimumFractionDigits: 2 }
    )}).`;
  }

  return null;
}

export function canDeleteEmpenho(
  empenhoId: number, // Changed from string to number
  pagamentos: Pagamento[]
): boolean {
  return !pagamentos.some((p) => p.empenhoId === empenhoId);
}

export function canDeleteDespesa(
  despesaId: number, // Changed from string to number
  empenhos: Empenho[]
): boolean {
  return !empenhos.some((e) => e.despesaId === despesaId);
}
