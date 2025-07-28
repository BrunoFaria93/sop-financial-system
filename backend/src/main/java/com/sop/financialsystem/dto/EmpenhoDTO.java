package com.sop.financialsystem.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EmpenhoDTO {
    
    private Long id;
    private String numeroEmpenho;
    private LocalDate dataEmpenho;
    private BigDecimal valor;
    private String observacao;
    private Long despesaId;
    private String numeroProtocoloDespesa;
    
    // Construtor padrão
    public EmpenhoDTO() {}
    
    // Construtor completo
    public EmpenhoDTO(Long id, String numeroEmpenho, LocalDate dataEmpenho, 
                     BigDecimal valor, String observacao, Long despesaId) {
        this.id = id;
        this.numeroEmpenho = numeroEmpenho;
        this.dataEmpenho = dataEmpenho;
        this.valor = valor;
        this.observacao = observacao;
        this.despesaId = despesaId;
    }
    
    // Getters e Setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }
    
    public String getNumeroEmpenho() { 
        return numeroEmpenho; 
    }
    
    public void setNumeroEmpenho(String numeroEmpenho) { 
        this.numeroEmpenho = numeroEmpenho; 
    }
    
    public LocalDate getDataEmpenho() { 
        return dataEmpenho; 
    }
    
    public void setDataEmpenho(LocalDate dataEmpenho) { 
        this.dataEmpenho = dataEmpenho; 
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
    
    public Long getDespesaId() { 
        return despesaId; 
    }
    
    public void setDespesaId(Long despesaId) { 
        this.despesaId = despesaId; 
    }
    
    public String getNumeroProtocoloDespesa() { 
        return numeroProtocoloDespesa; 
    }
    
    public void setNumeroProtocoloDespesa(String numeroProtocoloDespesa) { 
        this.numeroProtocoloDespesa = numeroProtocoloDespesa; 
    }
}