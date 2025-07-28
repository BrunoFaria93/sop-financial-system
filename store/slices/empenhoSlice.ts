import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

export interface Empenho {
  id?: number;
  numeroEmpenho: string;
  dataEmpenho: string;
  valorEmpenho: number;
  observacao: string;
  despesaId: number;
  numeroProtocoloDespesa?: string;
}

interface EmpenhoState {
  empenhos: Empenho[];
  loading: boolean;
  error: string | null;
}

const initialState: EmpenhoState = {
  empenhos: [],
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
const formatEmpenhoForBackend = (
  empenho: Omit<Empenho, "id" | "numeroProtocoloDespesa">
) => {
  return {
    numeroEmpenho: empenho.numeroEmpenho,
    dataEmpenho: empenho.dataEmpenho,
    valor: empenho.valorEmpenho,
    observacao: empenho.observacao,
    despesaId: empenho.despesaId,
  };
};

// Função para converter dados do backend para o formato do frontend
const formatEmpenhoFromBackend = (empenho: any): Empenho => {
  return {
    id: empenho.id,
    numeroEmpenho: empenho.numeroEmpenho,
    dataEmpenho: empenho.dataEmpenho,
    valorEmpenho: empenho.valor,
    observacao: empenho.observacao,
    despesaId: empenho.despesaId,
    numeroProtocoloDespesa: empenho.numeroProtocoloDespesa,
  };
};

// Async thunks com Axios
export const fetchEmpenhos = createAsyncThunk(
  "empenhos/fetchEmpenhos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/empenhos");
      return response.data.map(formatEmpenhoFromBackend);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao buscar empenhos"
      );
    }
  }
);

export const fetchEmpenhosByDespesa = createAsyncThunk(
  "empenhos/fetchEmpenhosByDespesa",
  async (despesaId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/empenhos/despesa/${despesaId}`);
      return response.data.map(formatEmpenhoFromBackend);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao buscar empenhos da despesa"
      );
    }
  }
);

export const createEmpenho = createAsyncThunk(
  "empenhos/createEmpenho",
  async (
    empenho: Omit<Empenho, "id" | "numeroProtocoloDespesa">,
    { rejectWithValue }
  ) => {
    try {
      const empenhoFormatted = formatEmpenhoForBackend(empenho);

      const response = await api.post("/empenhos", empenhoFormatted);
      return formatEmpenhoFromBackend(response.data);
    } catch (error: any) {
      console.log("Erro do servidor:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Erro ao criar empenho"
      );
    }
  }
);

export const updateEmpenhoAPI = createAsyncThunk(
  "empenhos/updateEmpenho",
  async (empenho: Empenho, { rejectWithValue }) => {
    try {
      const empenhoFormatted = {
        ...formatEmpenhoForBackend(empenho),
        id: empenho.id,
      };

      const response = await api.put(
        `/empenhos/${empenho.id}`,
        empenhoFormatted
      );
      return formatEmpenhoFromBackend(response.data);
    } catch (error: any) {
      // Tentar diferentes formas de pegar a mensagem
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Erro ao atualizar empenho";

      return rejectWithValue(backendMessage);
    }
  }
);

export const deleteEmpenhoAPI = createAsyncThunk(
  "empenhos/deleteEmpenho",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/empenhos/${id}`);
      return id;
    } catch (error: any) {
      // Tentar diferentes formas de pegar a mensagem do backend
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Erro ao deletar empenho";

      return rejectWithValue(backendMessage);
    }
  }
);

const empenhoSlice = createSlice({
  name: "empenhos",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearEmpenhos: (state) => {
      state.empenhos = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all empenhos
      .addCase(fetchEmpenhos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpenhos.fulfilled, (state, action) => {
        state.loading = false;
        state.empenhos = action.payload;
      })
      .addCase(fetchEmpenhos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch empenhos by despesa
      .addCase(fetchEmpenhosByDespesa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpenhosByDespesa.fulfilled, (state, action) => {
        state.loading = false;
        state.empenhos = action.payload;
      })
      .addCase(fetchEmpenhosByDespesa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create empenho
      .addCase(createEmpenho.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmpenho.fulfilled, (state, action) => {
        state.loading = false;
        state.empenhos.push(action.payload);
      })
      .addCase(createEmpenho.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update empenho
      .addCase(updateEmpenhoAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmpenhoAPI.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.empenhos.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.empenhos[index] = action.payload;
        }
      })
      .addCase(updateEmpenhoAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete empenho
      .addCase(deleteEmpenhoAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmpenhoAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.empenhos = state.empenhos.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteEmpenhoAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setError, clearEmpenhos, clearError } =
  empenhoSlice.actions;
export default empenhoSlice.reducer;

// Aliases para compatibilidade
export const addEmpenho = createEmpenho;
export const updateEmpenho = updateEmpenhoAPI;
export const deleteEmpenho = deleteEmpenhoAPI;
