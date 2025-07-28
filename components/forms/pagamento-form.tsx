"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPagamento,
  updatePagamentoAPI,
  type Pagamento,
} from "@/store/slices/pagamentoSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { generatePagamentoNumber } from "@/utils/generators";
import { validatePagamentoValue } from "@/utils/business-rules";

interface PagamentoFormProps {
  pagamento?: Pagamento | null;
  onClose: () => void;
}

export default function PagamentoForm({
  pagamento,
  onClose,
}: PagamentoFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const empenhos = useSelector((state: RootState) => state.empenhos.empenhos);
  const pagamentos = useSelector(
    (state: RootState) => state.pagamentos.pagamentos
  );
  const despesas = useSelector((state: RootState) => state.despesas.despesas);
  const { loading } = useSelector((state: RootState) => state.pagamentos);

  const [formData, setFormData] = useState({
    numeroPagamento: "",
    dataPagamento: "",
    valorPagamento: "",
    observacao: "",
    empenhoId: 0, // CORREÇÃO: Usar number como no tipo Pagamento
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (pagamento) {
      setFormData({
        numeroPagamento: pagamento.numeroPagamento,
        dataPagamento: new Date(pagamento.dataPagamento)
          .toISOString()
          .slice(0, 10),
        valorPagamento: pagamento.valorPagamento.toString(),
        observacao: pagamento.observacao,
        empenhoId: pagamento.empenhoId, // CORREÇÃO: Manter como number
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        numeroPagamento: generatePagamentoNumber(),
        dataPagamento: new Date().toISOString().slice(0, 10),
      }));
    }
  }, [pagamento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // CORREÇÃO: Verificar se empenhoId foi selecionado (maior que 0)
    if (!formData.empenhoId || formData.empenhoId === 0) {
      setError("Selecione um empenho");
      return;
    }

    const valor = Number.parseFloat(formData.valorPagamento);

    // CORREÇÃO: empenhoId já é number, não precisa converter
    const empenho = empenhos.find((e) => e.id === formData.empenhoId);

    if (!empenho) {
      setError("Empenho não encontrado");
      return;
    }

    const validationError = validatePagamentoValue(
      empenho,
      pagamentos,
      valor,
      pagamento?.id?.toString()
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    // CORREÇÃO: Preparar dados no formato correto para o slice
    const pagamentoData: Omit<Pagamento, "id" | "numeroEmpenho"> = {
      numeroPagamento: formData.numeroPagamento,
      dataPagamento: formData.dataPagamento,
      valorPagamento: valor,
      observacao: formData.observacao,
      empenhoId: formData.empenhoId, // Já é number
    };

    try {
      if (pagamento) {
        // Para edição, inclui o ID
        const pagamentoToUpdate: Pagamento = {
          ...pagamentoData,
          id: pagamento.id,
        };
        await dispatch(updatePagamentoAPI(pagamentoToUpdate)).unwrap();
      } else {
        // Para criação, usa createPagamento
        await dispatch(createPagamento(pagamentoData)).unwrap();
      }
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar pagamento:", error);
      setError(error || "Erro ao salvar pagamento");
    }
  };

  // CORREÇÃO: Handler que converte string do Select para number
  const handleEmpenhoChange = (value: string) => {
    const empenhoId = parseInt(value, 10);
    if (!isNaN(empenhoId)) {
      setFormData((prev) => ({ ...prev, empenhoId }));
      if (
        error === "Empenho não encontrado" ||
        error === "Selecione um empenho"
      ) {
        setError("");
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {pagamento ? "Editar Pagamento" : "Novo Pagamento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroPagamento">Número do Pagamento</Label>
              <Input
                id="numeroPagamento"
                value={formData.numeroPagamento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    numeroPagamento: e.target.value,
                  }))
                }
                placeholder="2025NP0012"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataPagamento">Data do Pagamento</Label>
              <Input
                id="dataPagamento"
                type="date"
                value={formData.dataPagamento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataPagamento: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorPagamento">Valor do Pagamento</Label>
              <Input
                id="valorPagamento"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorPagamento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    valorPagamento: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empenhoId">Empenho</Label>
              <Select
                value={
                  formData.empenhoId > 0 ? formData.empenhoId.toString() : ""
                }
                onValueChange={handleEmpenhoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um empenho">
                    {formData.empenhoId > 0 && (
                      <span>
                        {empenhos.find(
                          (e) =>
                            e.id === parseInt(formData.empenhoId.toString())
                        )?.numeroEmpenho || "Seleção inválida"}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {empenhos.map((empenho) => {
                    const despesa = despesas.find(
                      (d) => d.id === empenho.despesaId
                    );
                    return (
                      <SelectItem
                        key={empenho.id}
                        value={empenho.id!.toString()} // Ensure id is not undefined
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {empenho.numeroEmpenho}
                          </span>
                          <span className="text-sm text-gray-500">
                            {despesa?.numeroProtocolo}
                          </span>
                          <span className="text-sm text-green-600">
                            R${" "}
                            {empenho.valorEmpenho.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={formData.observacao}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, observacao: e.target.value }))
              }
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : pagamento ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
