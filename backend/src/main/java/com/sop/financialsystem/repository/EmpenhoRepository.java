package com.sop.financialsystem.repository;

import com.sop.financialsystem.entity.Empenho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmpenhoRepository extends JpaRepository<Empenho, Long> {
    
    Optional<Empenho> findByNumeroEmpenho(String numeroEmpenho);
    
    boolean existsByNumeroEmpenho(String numeroEmpenho);
    
    List<Empenho> findByDespesaId(Long despesaId);
    
    @Query("SELECT SUM(e.valor) FROM Empenho e WHERE e.despesa.id = :despesaId")
    BigDecimal sumValorByDespesaId(@Param("despesaId") Long despesaId);
    
    @Query("SELECT COALESCE(SUM(e.valor), 0) FROM Empenho e WHERE e.despesa.id = :despesaId AND e.id != :empenhoId")
    BigDecimal sumValorByDespesaIdExcluding(@Param("despesaId") Long despesaId, @Param("empenhoId") Long empenhoId);
    
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Pagamento p WHERE p.empenho.id = :empenhoId")
    boolean hasPagamentos(@Param("empenhoId") Long empenhoId);
}