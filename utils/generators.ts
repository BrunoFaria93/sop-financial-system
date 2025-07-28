export function generateProtocolNumber(): string {
  const year = new Date().getFullYear()
  const random1 = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0")
  const random2 = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")
  const random3 = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0")

  return `${random1}.${random2}/${year}-${random3}`
}

export function generateEmpenhoNumber(): string {
  const year = new Date().getFullYear()
  const sequential = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")

  return `${year}NE${sequential}`
}

export function generatePagamentoNumber(): string {
  const year = new Date().getFullYear()
  const sequential = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")

  return `${year}NP${sequential}`
}
