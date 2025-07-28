"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  CreditCard,
  Banknote,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";
import DespesaForm from "./forms/despesa-form";
import EmpenhoForm from "./forms/empenho-form";
import PagamentoForm from "./forms/pagamento-form";
import { calculateDespesaStatus } from "@/utils/business-rules";

import { fetchDespesas, deleteDespesa } from "@/store/slices/despesaSlice";
import { fetchEmpenhos, deleteEmpenho } from "@/store/slices/empenhoSlice";
import {
  fetchPagamentos,
  deletePagamento,
} from "@/store/slices/pagamentoSlice";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState("overview");
  const [showDespesaForm, setShowDespesaForm] = useState(false);
  const [showEmpenhoForm, setShowEmpenhoForm] = useState(false);
  const [showPagamentoForm, setShowPagamentoForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    type: "despesa" | "empenho" | "pagamento";
  } | null>(null);

  const {
    despesas,
    loading: despesasLoading,
    error: despesasError,
  } = useSelector((state: RootState) => state.despesas);
  const {
    empenhos,
    loading: empenhosLoading,
    error: empenhosError,
  } = useSelector((state: RootState) => state.empenhos);
  const {
    pagamentos,
    loading: pagamentosLoading,
    error: pagamentosError,
  } = useSelector((state: RootState) => state.pagamentos);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchDespesas()).unwrap(),
          dispatch(fetchEmpenhos()).unwrap(),
          dispatch(fetchPagamentos()).unwrap(),
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, [dispatch]);

  const handleRefreshData = async () => {
    try {
      await Promise.all([
        dispatch(fetchDespesas()).unwrap(),
        dispatch(fetchEmpenhos()).unwrap(),
        dispatch(fetchPagamentos()).unwrap(),
      ]);
    } catch (error) {
      console.error("Erro ao recarregar dados:", error);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "despesa") {
        await dispatch(deleteDespesa(itemToDelete.id)).unwrap();
      } else if (itemToDelete.type === "empenho") {
        await dispatch(deleteEmpenho(itemToDelete.id)).unwrap();
      } else if (itemToDelete.type === "pagamento") {
        await dispatch(deletePagamento(itemToDelete.id)).unwrap();
      }

      // Só fecha o dialog e recarrega se deu certo
      setShowDeleteDialog(false);
      setItemToDelete(null);
      handleRefreshData();
    } catch (error: any) {
      console.error(`Erro ao deletar ${itemToDelete.type}:`, error);

      // Fechar o dialog mesmo com erro
      setShowDeleteDialog(false);
      setItemToDelete(null);

      // Mostrar mensagem de erro específica sem recarregar dados
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || `Erro ao deletar ${itemToDelete.type}`;

      alert(errorMessage);
    }
  };

  const openDeleteDialog = (
    id: number,
    type: "despesa" | "empenho" | "pagamento"
  ) => {
    setItemToDelete({ id, type });
    setShowDeleteDialog(true);
  };

  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
  const totalEmpenhos = empenhos.reduce((sum, e) => sum + e.valorEmpenho, 0);
  const totalPagamentos = pagamentos.reduce(
    (sum, p) => sum + p.valorPagamento,
    0
  );

  const isLoading = despesasLoading || empenhosLoading || pagamentosLoading;
  const hasError = despesasError || empenhosError || pagamentosError;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Paga":
        return "bg-green-100 text-green-800";
      case "Parcialmente Paga":
        return "bg-blue-100 text-blue-800";
      case "Aguardando Pagamento":
        return "bg-yellow-100 text-yellow-800";
      case "Parcialmente Empenhada":
        return "bg-orange-100 text-orange-800";
      case "Aguardando Empenho":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFormClose = () => {
    setShowDespesaForm(false);
    setShowEmpenhoForm(false);
    setShowPagamentoForm(false);
    setEditingItem(null);
    handleRefreshData();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistema de Controle Financeiro SOP
            </h1>
            <p className="text-gray-600">
              Gerencie despesas, empenhos e pagamentos de forma integrada
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>

        {hasError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">
              Erro ao carregar dados:{" "}
              {despesasError || empenhosError || pagamentosError}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">Carregando dados...</p>
          </div>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="despesas">
            Despesas ({despesas.length})
          </TabsTrigger>
          <TabsTrigger value="empenhos">
            Empenhos ({empenhos.length})
          </TabsTrigger>
          <TabsTrigger value="pagamentos">
            Pagamentos ({pagamentos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Despesas
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R${" "}
                  {totalDespesas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {despesas.length === 0
                    ? "Despesas"
                    : `${despesas.length} ${
                        despesas.length === 1
                          ? "despesa cadastrada"
                          : "despesas cadastradas"
                      }`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Empenhos
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R${" "}
                  {totalEmpenhos.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {empenhos.length === 0
                    ? "Empenhos"
                    : `${empenhos.length} ${
                        empenhos.length === 1
                          ? "empenho cadastrado"
                          : "empenhos cadastrados"
                      }`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Pagamentos
                </CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R${" "}
                  {totalPagamentos.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {pagamentos.length === 0
                    ? "Pagamentos"
                    : `${pagamentos.length} ${
                        pagamentos.length === 1
                          ? "pagamento cadastrado"
                          : "pagamentos cadastrados"
                      }`}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo das Despesas por Status</CardTitle>
              <CardDescription>
                Status calculado automaticamente baseado nas regras de negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {despesas.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma despesa cadastrada
                  </p>
                ) : (
                  despesas.map((despesa) => {
                    const status = calculateDespesaStatus(
                      despesa,
                      empenhos,
                      pagamentos
                    );
                    return (
                      <div
                        key={despesa.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            {despesa.numeroProtocolo}
                          </div>
                          <div className="text-sm text-gray-600">
                            {despesa.descricao}
                          </div>
                          <div className="text-sm font-medium">
                            R${" "}
                            {despesa.valor.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                        <Badge className={getStatusBadgeColor(status)}>
                          {status}
                        </Badge>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="despesas" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Despesas</h2>
            <Button onClick={() => setShowDespesaForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Despesa
            </Button>
          </div>

          <div className="grid gap-4">
            {despesas.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Nenhuma despesa cadastrada</p>
                </CardContent>
              </Card>
            ) : (
              despesas.map((despesa) => (
                <Card key={despesa.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Área do conteúdo principal - pode crescer mas não empurra os botões */}
                      <div className="min-w-0 flex-1">
                        {/* Header com número e badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-semibold min-w-0 break-words">
                            {despesa.numeroProtocolo}
                          </h3>
                          <Badge
                            variant="outline"
                            className="self-start sm:self-center whitespace-nowrap"
                          >
                            {despesa.tipoDespesa}
                          </Badge>
                        </div>

                        {/* Descrição */}
                        <p className="text-gray-600 mb-3 break-words">
                          {despesa.descricao}
                        </p>

                        {/* Grid de informações */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="min-w-0">
                            <span className="font-medium">Credor:</span>{" "}
                            <span className="break-words">
                              {despesa.credor}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium">Valor:</span> R${" "}
                            {despesa.valor.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium">Data Protocolo:</span>{" "}
                            <span className="break-words">
                              {new Date(despesa.dataProtocolo).toLocaleString(
                                "pt-BR"
                              )}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium">Vencimento:</span>{" "}
                            {new Date(
                              despesa.dataVencimento
                            ).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>

                      {/* Botões - nunca encolhem e ficam sempre visíveis */}
                      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(despesa);
                            setShowDespesaForm(true);
                          }}
                          className="whitespace-nowrap"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openDeleteDialog(despesa.id!, "despesa")
                          }
                          className="whitespace-nowrap"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="empenhos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Empenhos</h2>
            <Button onClick={() => setShowEmpenhoForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Empenho
            </Button>
          </div>

          <div className="grid gap-4">
            {empenhos.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Nenhum empenho cadastrado</p>
                </CardContent>
              </Card>
            ) : (
              empenhos.map((empenho) => {
                const despesa = despesas.find(
                  (d) => d.id === empenho.despesaId
                );
                return (
                  <Card key={empenho.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">
                            {empenho.numeroEmpenho}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {empenho.observacao}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Despesa:</span>{" "}
                              {despesa?.numeroProtocolo ||
                                empenho.numeroProtocoloDespesa}
                            </div>
                            <div>
                              <span className="font-medium">Valor:</span> R${" "}
                              {empenho.valorEmpenho.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                            <div>
                              <span className="font-medium">Data:</span>{" "}
                              {new Date(empenho.dataEmpenho).toLocaleDateString(
                                "pt-BR"
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(empenho);
                              setShowEmpenhoForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openDeleteDialog(empenho.id!, "empenho")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="pagamentos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Pagamentos</h2>
            <Button onClick={() => setShowPagamentoForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Pagamento
            </Button>
          </div>

          <div className="grid gap-4">
            {pagamentos.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Nenhum pagamento cadastrado</p>
                </CardContent>
              </Card>
            ) : (
              pagamentos.map((pagamento) => {
                const empenho = empenhos.find(
                  (e) => e.id === pagamento.empenhoId
                );
                const despesa = despesas.find(
                  (d) => d.id === empenho?.despesaId
                );
                return (
                  <Card key={pagamento.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">
                            {pagamento.numeroPagamento}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {pagamento.observacao}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Empenho:</span>{" "}
                              {empenho?.numeroEmpenho ||
                                pagamento.numeroEmpenho}
                            </div>
                            <div>
                              <span className="font-medium">Despesa:</span>{" "}
                              {despesa?.numeroProtocolo}
                            </div>
                            <div>
                              <span className="font-medium">Valor:</span> R${" "}
                              {pagamento.valorPagamento.toLocaleString(
                                "pt-BR",
                                { minimumFractionDigits: 2 }
                              )}
                            </div>
                            <div>
                              <span className="font-medium">Data:</span>{" "}
                              {new Date(
                                pagamento.dataPagamento
                              ).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(pagamento);
                              setShowPagamentoForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openDeleteDialog(pagamento.id!, "pagamento")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {showDespesaForm && (
        <DespesaForm despesa={editingItem} onClose={handleFormClose} />
      )}

      {showEmpenhoForm && (
        <EmpenhoForm empenho={editingItem} onClose={handleFormClose} />
      )}

      {showPagamentoForm && (
        <PagamentoForm pagamento={editingItem} onClose={handleFormClose} />
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este{" "}
              {itemToDelete?.type === "despesa"
                ? "despesa"
                : itemToDelete?.type === "empenho"
                ? "empenho"
                : "pagamento"}
              ? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
