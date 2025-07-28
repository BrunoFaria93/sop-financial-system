package com.sop.financialsystem.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "pagamentos")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroPagamento;
    private LocalDate dataPagamento;
    private BigDecimal valor;
    private String observacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empenho_id", nullable = false)
    private Empenho empenho;

    @Column(name = "empenho_id", insertable = false, updatable = false, nullable = false)
    private Long empenhoId; // Mirror the foreign key for clarity

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroPagamento() {
        return numeroPagamento;
    }

    public void setNumeroPagamento(String numeroPagamento) {
        this.numeroPagamento = numeroPagamento;
    }

    public LocalDate getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDate dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public Empenho getEmpenho() {
        return empenho;
    }

    public void setEmpenho(Empenho empenho) {
        this.empenho = empenho;
        if (empenho != null) {
            this.empenhoId = empenho.getId(); // Sync the id with the relationship
        }
    }

    public Long getEmpenhoId() {
        return empenhoId;
    }

    public void setEmpenhoId(Long empenhoId) {
        this.empenhoId = empenhoId;
    }
}