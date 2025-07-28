package com.sop.financialsystem.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "despesa")
public class Despesa {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "numero_protocolo", nullable = false, unique = true)
    private String numeroProtocolo;
    
    @Column(name = "tipo_despesa", nullable = false)
    private String tipoDespesa;
    
    @Column(name = "data_protocolo", nullable = false)
    private LocalDateTime dataProtocolo;
    
    @Column(name = "data_vencimento", nullable = false)
    private LocalDateTime dataVencimento;
    
    @Column(name = "credor", nullable = false)
    private String credor;
    
    @Column(name = "descricao", columnDefinition = "TEXT", nullable = false)
    private String descricao;
    
    @Column(name = "valor", nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;
    
    @OneToMany(mappedBy = "despesa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Empenho> empenhos;
    
    // Construtor padrão
    public Despesa() {}
    
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
    
    public List<Empenho> getEmpenhos() { 
        return empenhos; 
    }
    
    public void setEmpenhos(List<Empenho> empenhos) { 
        this.empenhos = empenhos; 
    }
}