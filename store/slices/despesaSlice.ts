import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

export interface Despesa {
  id?: number;
  numeroProtocolo: string;
  tipoDespesa: "Obra de Edificação" | "Obra de Rodovias" | "Outros";
  dataProtocolo: string;
  dataVencimento: string;
  credor: string;
  descricao: string;
  valor: number;
  status?:
    | "Aguardando Empenho"
    | "Parcialmente Empenhada"
    | "Aguardando Pagamento"
    | "Parcialmente Paga"
    | "Paga";
}

interface DespesaState {
  despesas: Despesa[];
  loading: boolean;
  error: string | null;
}

const initialState: DespesaState = {
  despesas: [],
  loading: false,
  error: null,
};

// Configuração do Axios com variável de ambiente
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Função para converter dados do frontend para o formato esperado pelo backend
const formatDespesaForBackend = (despesa: Omit<Despesa, "id">) => {
  return {
    numeroProtocolo: despesa.numeroProtocolo,
    tipoDespesa: despesa.tipoDespesa,
    dataProtocolo: despesa.dataProtocolo + ":00",
    dataVencimento: despesa.dataVencimento.includes("T")
      ? despesa.dataVencimento + ":00"
      : despesa.dataVencimento + "T00:00:00",
    credor: despesa.credor,
    descricao: despesa.descricao,
    valor: despesa.valor,
  };
};

// Função para converter dados do backend para o formato do frontend
const formatDespesaFromBackend = (despesa: any): Despesa => {
  return {
    id: despesa.id,
    numeroProtocolo: despesa.numeroProtocolo,
    tipoDespesa: despesa.tipoDespesa,
    dataProtocolo: despesa.dataProtocolo
      ? despesa.dataProtocolo.slice(0, 16)
      : "",
    dataVencimento: despesa.dataVencimento
      ? despesa.dataVencimento.slice(0, 10)
      : "",
    credor: despesa.credor,
    descricao: despesa.descricao,
    valor: despesa.valor,
    status: despesa.status,
  };
};

// Async thunks com Axios
export const fetchDespesas = createAsyncThunk(
  "despesas/fetchDespesas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/despesas");
      return response.data.map(formatDespesaFromBackend);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao buscar despesas"
      );
    }
  }
);

export const createDespesa = createAsyncThunk(
  "despesas/createDespesa",
  async (despesa: Omit<Despesa, "id">, { rejectWithValue }) => {
    try {
      const despesaFormatted = formatDespesaForBackend(despesa);

      const response = await api.post("/despesas", despesaFormatted);
      return formatDespesaFromBackend(response.data);
    } catch (error: any) {
      console.log("Erro do servidor:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Erro ao criar despesa"
      );
    }
  }
);

export const updateDespesaAPI = createAsyncThunk(
  "despesas/updateDespesa",
  async (despesa: Despesa, { rejectWithValue }) => {
    try {
      const despesaFormatted = {
        ...formatDespesaForBackend(despesa),
        id: despesa.id,
      };

      const response = await api.put(
        `/despesas/${despesa.id}`,
        despesaFormatted
      );
      return formatDespesaFromBackend(response.data);
    } catch (error: any) {
      // Tentar diferentes formas de pegar a mensagem
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Erro ao atualizar despesa";

      return rejectWithValue(backendMessage);
    }
  }
);

export const deleteDespesaAPI = createAsyncThunk(
  "despesas/deleteDespesa",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/despesas/${id}`);
      return id;
    } catch (error: any) {
      // Tentar diferentes formas de pegar a mensagem do backend
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Erro ao deletar despesa";

      return rejectWithValue(backendMessage);
    }
  }
);

const despesaSlice = createSlice({
  name: "despesas",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch despesas
      .addCase(fetchDespesas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDespesas.fulfilled, (state, action) => {
        state.loading = false;
        state.despesas = action.payload;
      })
      .addCase(fetchDespesas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create despesa
      .addCase(createDespesa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDespesa.fulfilled, (state, action) => {
        state.loading = false;
        state.despesas.push(action.payload);
      })
      .addCase(createDespesa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update despesa
      .addCase(updateDespesaAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDespesaAPI.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.despesas.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) {
          state.despesas[index] = action.payload;
        }
      })
      .addCase(updateDespesaAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete despesa
      .addCase(deleteDespesaAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDespesaAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.despesas = state.despesas.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteDespesaAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setError, clearError } = despesaSlice.actions;
export default despesaSlice.reducer;

// Aliases para compatibilidade
export const addDespesa = createDespesa;
export const updateDespesa = updateDespesaAPI;
export const deleteDespesa = deleteDespesaAPI;
