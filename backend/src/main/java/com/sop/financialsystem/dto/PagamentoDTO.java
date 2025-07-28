package com.sop.financialsystem.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PagamentoDTO {
    
    private Long id;
    private String numeroPagamento;
    private LocalDate dataPagamento;
    private BigDecimal valor;
    private String observacao;
    private Long empenhoId;
    private String numeroEmpenho; // Optional, can be derived from Empenho

    // Default constructor
    public PagamentoDTO() {}

    // Full constructor
    public PagamentoDTO(Long id, String numeroPagamento, LocalDate dataPagamento, 
                       BigDecimal valor, String observacao, Long empenhoId, String numeroEmpenho) {
        this.id = id;
        this.numeroPagamento = numeroPagamento;
        this.dataPagamento = dataPagamento;
        this.valor = valor;
        this.observacao = observacao;
        this.empenhoId = empenhoId;
        this.numeroEmpenho = numeroEmpenho;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroPagamento() { return numeroPagamento; }
    public void setNumeroPagamento(String numeroPagamento) { this.numeroPagamento = numeroPagamento; }
    public LocalDate getDataPagamento() { return dataPagamento; }
    public void setDataPagamento(LocalDate dataPagamento) { this.dataPagamento = dataPagamento; }
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
    public Long getEmpenhoId() { return empenhoId; }
    public void setEmpenhoId(Long empenhoId) { this.empenhoId = empenhoId; }
    public String getNumeroEmpenho() { return numeroEmpenho; }
    public void setNumeroEmpenho(String numeroEmpenho) { this.numeroEmpenho = numeroEmpenho; }
}