package com.sop.financialsystem.repository;

import com.sop.financialsystem.entity.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    
    Optional<Pagamento> findByNumeroPagamento(String numeroPagamento);
    
    boolean existsByNumeroPagamento(String numeroPagamento);
    
    List<Pagamento> findByEmpenhoId(Long empenhoId);
    
    @Query("SELECT SUM(p.valor) FROM Pagamento p WHERE p.empenho.id = :empenhoId")
    BigDecimal sumValorByEmpenhoId(@Param("empenhoId") Long empenhoId);
    
    @Query("SELECT SUM(p.valor) FROM Pagamento p WHERE p.empenho.despesa.id = :despesaId")
    BigDecimal sumValorByDespesaId(@Param("despesaId") Long despesaId);
}