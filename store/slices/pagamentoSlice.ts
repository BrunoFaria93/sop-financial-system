import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

export interface Pagamento {
  id?: number;
  numeroPagamento: string;
  dataPagamento: string;
  valorPagamento: number;
  observacao: string;
  empenhoId: number;
  numeroEmpenho?: string;
}

interface PagamentoState {
  pagamentos: Pagamento[];
  loading: boolean;
  error: string | null;
}

const initialState: PagamentoState = {
  pagamentos: [],
  loading: false,
  error: null,
};

// Configuração do Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Função para converter dados do frontend para o formato esperado pelo backend
const formatPagamentoForBackend = (
  pagamento: Omit<Pagamento, "id" | "numeroEmpenho">
) => {
  return {
    numeroPagamento: pagamento.numeroPagamento,
    dataPagamento: pagamento.dataPagamento,
    valor: pagamento.valorPagamento,
    observacao: pagamento.observacao,
    empenhoId: pagamento.empenhoId,
  };
};

// Função para converter dados do backend para o formato do frontend
const formatPagamentoFromBackend = (pagamento: any): Pagamento => {
  return {
    id: pagamento.id,
    numeroPagamento: pagamento.numeroPagamento,
    dataPagamento: pagamento.dataPagamento,
    valorPagamento: pagamento.valor,
    observacao: pagamento.observacao,
    empenhoId: pagamento.empenhoId,
    numeroEmpenho: pagamento.numeroEmpenho,
  };
};

// Async thunks com Axios
export const fetchPagamentos = createAsyncThunk(
  "pagamentos/fetchPagamentos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/pagamentos");
      return response.data.map(formatPagamentoFromBackend);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao buscar pagamentos"
      );
    }
  }
);

export const fetchPagamentosByEmpenho = createAsyncThunk(
  "pagamentos/fetchPagamentosByEmpenho",
  async (empenhoId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pagamentos/empenho/${empenhoId}`);
      return response.data.map(formatPagamentoFromBackend);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao buscar pagamentos do empenho"
      );
    }
  }
);

export const fetchPagamentosByDespesa = createAsyncThunk(
  "pagamentos/fetchPagamentosByDespesa",
  async (despesaId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pagamentos/despesa/${despesaId}`);
      return response.data.map(formatPagamentoFromBackend);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao buscar pagamentos da despesa"
      );
    }
  }
);

export const createPagamento = createAsyncThunk(
  "pagamentos/createPagamento",
  async (
    pagamento: Omit<Pagamento, "id" | "numeroEmpenho">,
    { rejectWithValue }
  ) => {
    try {
      const pagamentoFormatted = formatPagamentoForBackend(pagamento);

      const response = await api.post("/pagamentos", pagamentoFormatted);
      return formatPagamentoFromBackend(response.data);
    } catch (error: any) {
      console.log("Erro do servidor:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Erro ao criar pagamento"
      );
    }
  }
);

export const updatePagamentoAPI = createAsyncThunk(
  "pagamentos/updatePagamento",
  async (pagamento: Pagamento, { rejectWithValue }) => {
    try {
      const pagamentoFormatted = {
        ...formatPagamentoForBackend(pagamento),
        id: pagamento.id,
      };

      const response = await api.put(
        `/pagamentos/${pagamento.id}`,
        pagamentoFormatted
      );
      return formatPagamentoFromBackend(response.data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao atualizar pagamento"
      );
    }
  }
);

export const deletePagamentoAPI = createAsyncThunk(
  "pagamentos/deletePagamento",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/pagamentos/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao deletar pagamento"
      );
    }
  }
);

const pagamentoSlice = createSlice({
  name: "pagamentos",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearPagamentos: (state) => {
      state.pagamentos = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all pagamentos
      .addCase(fetchPagamentos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagamentos.fulfilled, (state, action) => {
        state.loading = false;
        state.pagamentos = action.payload;
      })
      .addCase(fetchPagamentos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch pagamentos by empenho
      .addCase(fetchPagamentosByEmpenho.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagamentosByEmpenho.fulfilled, (state, action) => {
        state.loading = false;
        state.pagamentos = action.payload;
      })
      .addCase(fetchPagamentosByEmpenho.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch pagamentos by despesa
      .addCase(fetchPagamentosByDespesa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagamentosByDespesa.fulfilled, (state, action) => {
        state.loading = false;
        state.pagamentos = action.payload;
      })
      .addCase(fetchPagamentosByDespesa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create pagamento
      .addCase(createPagamento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPagamento.fulfilled, (state, action) => {
        state.loading = false;
        state.pagamentos.push(action.payload);
      })
      .addCase(createPagamento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update pagamento
      .addCase(updatePagamentoAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePagamentoAPI.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pagamentos.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.pagamentos[index] = action.payload;
        }
      })
      .addCase(updatePagamentoAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete pagamento
      .addCase(deletePagamentoAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePagamentoAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.pagamentos = state.pagamentos.filter(
          (p) => p.id !== action.payload
        );
      })
      .addCase(deletePagamentoAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setError, clearPagamentos, clearError } =
  pagamentoSlice.actions;
export default pagamentoSlice.reducer;

// Aliases para compatibilidade
export const addPagamento = createPagamento;
export const updatePagamento = updatePagamentoAPI;
export const deletePagamento = deletePagamentoAPI;
