package com.sop.financialsystem.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DespesaDTO {
    
    private Long id;
    private String numeroProtocolo;
    private String tipoDespesa;
    private LocalDateTime dataProtocolo;
    private LocalDateTime dataVencimento;
    private String credor;
    private String descricao;
    private BigDecimal valor;
    private String status;
    
    // Construtor padrão
    public DespesaDTO() {}
    
    // Construtor completo
    public DespesaDTO(Long id, String numeroProtocolo, String tipoDespesa, 
                     LocalDateTime dataProtocolo, LocalDateTime dataVencimento, 
                     String credor, String descricao, BigDecimal valor) {
        this.id = id;
        this.numeroProtocolo = numeroProtocolo;
        this.tipoDespesa = tipoDespesa;
        this.dataProtocolo = dataProtocolo;
        this.dataVencimento = dataVencimento;
        this.credor = credor;
        this.descricao = descricao;
        this.valor = valor;
    }
    
    // Getters e Setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }
    
    public String getNumeroProtocolo() { 
        return numeroProtocolo; 
    }
    
    public void setNumeroProtocolo(String numeroProtocolo) { 
        this.numeroProtocolo = numeroProtocolo; 
    }
    
    public String getTipoDespesa() { 
        return tipoDespesa; 
    }
    
    public void setTipoDespesa(String tipoDespesa) { 
        this.tipoDespesa = tipoDespesa; 
    }
    
    public LocalDateTime getDataProtocolo() { 
        return dataProtocolo; 
    }
    
    public void setDataProtocolo(LocalDateTime dataProtocolo) { 
        this.dataProtocolo = dataProtocolo; 
    }
    
    public LocalDateTime getDataVencimento() { 
        return dataVencimento; 
    }
    
    public void setDataVencimento(LocalDateTime dataVencimento) { 
        this.dataVencimento = dataVencimento; 
    }
    
    public String getCredor() { 
        return credor; 
    }
    
    public void setCredor(String credor) { 
        this.credor = credor; 
    }
    
    public String getDescricao() { 
        return descricao; 
    }
    
    public void setDescricao(String descricao) { 
        this.descricao = descricao; 
    }
    
    public BigDecimal getValor() { 
        return valor; 
    }
    
    public void setValor(BigDecimal valor) { 
        this.valor = valor; 
    }
    
    public String getStatus() { 
        return status; 
    }
    
    public void setStatus(String status) { 
        this.status = status; 
    }
}