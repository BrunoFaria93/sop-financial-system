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
  createEmpenho,
  updateEmpenhoAPI,
  type Empenho,
} from "@/store/slices/empenhoSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { generateEmpenhoNumber } from "@/utils/generators";
import { validateEmpenhoValue } from "@/utils/business-rules";

interface EmpenhoFormProps {
  empenho?: Empenho | null;
  onClose: () => void;
}

export default function EmpenhoForm({ empenho, onClose }: EmpenhoFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const despesas = useSelector((state: RootState) => state.despesas.despesas);
  const empenhos = useSelector((state: RootState) => state.empenhos.empenhos);
  const { loading } = useSelector((state: RootState) => state.empenhos);

  const [formData, setFormData] = useState({
    numeroEmpenho: "",
    dataEmpenho: "",
    valorEmpenho: "",
    observacao: "",
    despesaId: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (empenho) {
      setFormData({
        numeroEmpenho: empenho.numeroEmpenho,
        dataEmpenho: new Date(empenho.dataEmpenho).toISOString().slice(0, 10),
        valorEmpenho: empenho.valorEmpenho.toString(),
        observacao: empenho.observacao,
        despesaId: empenho.despesaId,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        numeroEmpenho: generateEmpenhoNumber(),
        dataEmpenho: new Date().toISOString().slice(0, 10),
      }));
    }
  }, [empenho]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.despesaId || formData.despesaId === 0) {
      setError("Selecione uma despesa");
      return;
    }

    const valor = Number.parseFloat(formData.valorEmpenho);
    const despesa = despesas.find((d) => d.id === formData.despesaId);

    if (!despesa) {
      setError("Despesa não encontrada");
      return;
    }

    // CORREÇÃO: Converter empenho.id para string para comparação correta
    const empenhoEditandoId = empenho?.id;
    const validationError = validateEmpenhoValue(
      despesa,
      empenhos,
      valor,
      empenhoEditandoId
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    const empenhoData: Omit<Empenho, "id" | "numeroProtocoloDespesa"> = {
      numeroEmpenho: formData.numeroEmpenho,
      dataEmpenho: formData.dataEmpenho,
      valorEmpenho: valor,
      observacao: formData.observacao,
      despesaId: formData.despesaId,
    };

    try {
      if (empenho) {
        const empenhoToUpdate: Empenho = {
          ...empenhoData,
          id: empenho.id,
        };
        await dispatch(updateEmpenhoAPI(empenhoToUpdate)).unwrap();
      } else {
        await dispatch(createEmpenho(empenhoData)).unwrap();
      }
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar empenho:", error);
      setError(error || "Erro ao salvar empenho");
    }
  };

  const handleDespesaChange = (value: string) => {
    const despesaId = parseInt(value, 10);
    setFormData((prev) => ({ ...prev, despesaId }));

    if (
      error === "Despesa não encontrada" ||
      error === "Selecione uma despesa"
    ) {
      setError("");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {empenho ? "Editar Empenho" : "Novo Empenho"}
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
              <Label htmlFor="numeroEmpenho">Número do Empenho</Label>
              <Input
                id="numeroEmpenho"
                value={formData.numeroEmpenho}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    numeroEmpenho: e.target.value,
                  }))
                }
                placeholder="2025NE0003"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataEmpenho">Data do Empenho</Label>
              <Input
                id="dataEmpenho"
                type="date"
                value={formData.dataEmpenho}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataEmpenho: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorEmpenho">Valor do Empenho</Label>
              <Input
                id="valorEmpenho"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorEmpenho}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    valorEmpenho: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="despesaId">Despesa</Label>
              <Select
                value={
                  formData.despesaId > 0 ? formData.despesaId.toString() : ""
                }
                onValueChange={handleDespesaChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma despesa">
                    {formData.despesaId > 0 && (
                      <span>
                        {despesas.find((d) => d.id === formData.despesaId)
                          ?.numeroProtocolo || "Seleção inválida"}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {despesas.map((despesa) => (
                    <SelectItem key={despesa.id} value={despesa.id!.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {despesa.numeroProtocolo}
                        </span>
                        <span className="text-sm text-gray-500">
                          R${" "}
                          {despesa.valor.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
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
              {loading ? "Salvando..." : empenho ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
