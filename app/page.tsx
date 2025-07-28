"use client"

import { Provider } from "react-redux"
import { store } from "@/store/store"
import Dashboard from "@/components/dashboard"

export default function Home() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
      </div>
    </Provider>
  )
}
