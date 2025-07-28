package com.sop.financialsystem.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "empenho")
public class Empenho {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "numero_empenho", nullable = false, unique = true)
    private String numeroEmpenho;
    
    @Column(name = "data_empenho", nullable = false)
    private LocalDate dataEmpenho;
    
    @Column(name = "valor", nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;
    
    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "despesa_id", nullable = false)
    private Despesa despesa;
    
    @OneToMany(mappedBy = "empenho", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pagamento> pagamentos;
    
    // Construtor padrão
    public Empenho() {}
    
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
    
    public Despesa getDespesa() { 
        return despesa; 
    }
    
    public void setDespesa(Despesa despesa) { 
        this.despesa = despesa; 
    }
    
    public List<Pagamento> getPagamentos() { 
        return pagamentos; 
    }
    
    public void setPagamentos(List<Pagamento> pagamentos) { 
        this.pagamentos = pagamentos; 
    }
}