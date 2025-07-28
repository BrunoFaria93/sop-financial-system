package com.sop.financialsystem.repository;

import com.sop.financialsystem.entity.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DespesaRepository extends JpaRepository<Despesa, Long> {
    
    Optional<Despesa> findByNumeroProtocolo(String numeroProtocolo);
    
    boolean existsByNumeroProtocolo(String numeroProtocolo);
    
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Empenho e WHERE e.despesa.id = :despesaId")
    boolean hasEmpenhos(@Param("despesaId") Long despesaId);
}