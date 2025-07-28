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
  createDespesa,
  updateDespesaAPI,
  type Despesa,
} from "@/store/slices/despesaSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { generateProtocolNumber } from "@/utils/generators";

interface DespesaFormProps {
  despesa?: Despesa | null;
  onClose: () => void;
}

export default function DespesaForm({ despesa, onClose }: DespesaFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.despesas);

  const [formData, setFormData] = useState({
    numeroProtocolo: "",
    tipoDespesa: "Outros" as
      | "Obra de Edificação"
      | "Obra de Rodovias"
      | "Outros",
    dataProtocolo: "",
    dataVencimento: "",
    credor: "",
    descricao: "",
    valor: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (despesa) {
      setFormData({
        numeroProtocolo: despesa.numeroProtocolo,
        tipoDespesa: despesa.tipoDespesa,
        dataProtocolo: new Date(despesa.dataProtocolo)
          .toISOString()
          .slice(0, 16),
        dataVencimento: new Date(despesa.dataVencimento)
          .toISOString()
          .slice(0, 10),
        credor: despesa.credor,
        descricao: despesa.descricao,
        valor: despesa.valor.toString(),
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        numeroProtocolo: generateProtocolNumber(),
        dataProtocolo: new Date().toISOString().slice(0, 16),
      }));
    }
  }, [despesa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações básicas
    if (!formData.numeroProtocolo.trim()) {
      setError("Número do protocolo é obrigatório");
      return;
    }

    if (!formData.credor.trim()) {
      setError("Credor é obrigatório");
      return;
    }

    if (!formData.descricao.trim()) {
      setError("Descrição é obrigatória");
      return;
    }

    const valor = Number.parseFloat(formData.valor);
    if (!valor || valor <= 0) {
      setError("Valor deve ser maior que zero");
      return;
    }

    // CORREÇÃO: Preparar dados no formato correto para o slice
    const despesaData: Omit<Despesa, "id" | "status"> = {
      numeroProtocolo: formData.numeroProtocolo,
      tipoDespesa: formData.tipoDespesa,
      dataProtocolo: formData.dataProtocolo,
      dataVencimento: formData.dataVencimento,
      credor: formData.credor,
      descricao: formData.descricao,
      valor: valor,
    };

    try {
      if (despesa) {
        // Para edição, inclui o ID
        const despesaToUpdate: Despesa = {
          ...despesaData,
          id: despesa.id,
        };
        await dispatch(updateDespesaAPI(despesaToUpdate)).unwrap();
      } else {
        // Para criação, usa createDespesa
        await dispatch(createDespesa(despesaData)).unwrap();
      }
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar despesa:", error);
      setError(error || "Erro ao salvar despesa");
    }
  };

  const handleTipoDespesaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      tipoDespesa: value as
        | "Obra de Edificação"
        | "Obra de Rodovias"
        | "Outros",
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {despesa ? "Editar Despesa" : "Nova Despesa"}
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
              <Label htmlFor="numeroProtocolo">Número do Protocolo</Label>
              <Input
                id="numeroProtocolo"
                value={formData.numeroProtocolo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    numeroProtocolo: e.target.value,
                  }))
                }
                placeholder="43022.123456/2025-01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoDespesa">Tipo de Despesa</Label>
              <Select
                value={formData.tipoDespesa}
                onValueChange={handleTipoDespesaChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Obra de Edificação">
                    Obra de Edificação
                  </SelectItem>
                  <SelectItem value="Obra de Rodovias">
                    Obra de Rodovias
                  </SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataProtocolo">Data do Protocolo</Label>
              <Input
                id="dataProtocolo"
                type="datetime-local"
                value={formData.dataProtocolo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataProtocolo: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataVencimento">Data de Vencimento</Label>
              <Input
                id="dataVencimento"
                type="date"
                value={formData.dataVencimento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataVencimento: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credor">Credor da Despesa</Label>
              <Input
                id="credor"
                value={formData.credor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, credor: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor da Despesa</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, valor: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição da Despesa</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, descricao: e.target.value }))
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
              {loading ? "Salvando..." : despesa ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
