import { configureStore } from "@reduxjs/toolkit"
import despesaReducer from "./slices/despesaSlice"
import empenhoReducer from "./slices/empenhoSlice"
import pagamentoReducer from "./slices/pagamentoSlice"

export const store = configureStore({
  reducer: {
    despesas: despesaReducer,
    empenhos: empenhoReducer,
    pagamentos: pagamentoReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
