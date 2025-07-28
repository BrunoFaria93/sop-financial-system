package com.sop.financialsystem.service;

import com.sop.financialsystem.dto.EmpenhoDTO;
import com.sop.financialsystem.entity.Despesa;
import com.sop.financialsystem.entity.Empenho;
import com.sop.financialsystem.repository.DespesaRepository;
import com.sop.financialsystem.repository.EmpenhoRepository;
import com.sop.financialsystem.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmpenhoService {
    
    @Autowired
    private EmpenhoRepository empenhoRepository;
    
    @Autowired
    private DespesaRepository despesaRepository;
    
    @Autowired
    private PagamentoRepository pagamentoRepository;
    
    public List<EmpenhoDTO> findAll() {
        return empenhoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<EmpenhoDTO> findById(Long id) {
        return empenhoRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public List<EmpenhoDTO> findByDespesaId(Long despesaId) {
        return empenhoRepository.findByDespesaId(despesaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public EmpenhoDTO save(EmpenhoDTO empenhoDTO) {
        if (empenhoRepository.existsByNumeroEmpenho(empenhoDTO.getNumeroEmpenho())) {
            throw new RuntimeException("Número de empenho já existe: " + empenhoDTO.getNumeroEmpenho());
        }
        
        // Verificar se a despesa existe
        Optional<Despesa> despesa = despesaRepository.findById(empenhoDTO.getDespesaId());
        if (despesa.isEmpty()) {
            throw new RuntimeException("Despesa não encontrada com ID: " + empenhoDTO.getDespesaId());
        }
        
        // Verificar se a soma dos empenhos não ultrapassará o valor da despesa
        BigDecimal valorEmpenhos = empenhoRepository.sumValorByDespesaId(empenhoDTO.getDespesaId());
        if (valorEmpenhos == null) valorEmpenhos = BigDecimal.ZERO;
        
        BigDecimal novoTotal = valorEmpenhos.add(empenhoDTO.getValor());
        if (novoTotal.compareTo(despesa.get().getValor()) > 0) {
            throw new RuntimeException(String.format(
                "O valor total dos empenhos (R$ %.2f) não pode ultrapassar o valor da despesa (R$ %.2f)",
                novoTotal.doubleValue(),
                despesa.get().getValor().doubleValue()
            ));
        }
        
        Empenho empenho = convertToEntity(empenhoDTO);
        empenho.setDespesa(despesa.get());
        empenho = empenhoRepository.save(empenho);
        return convertToDTO(empenho);
    }
    
    public EmpenhoDTO update(Long id, EmpenhoDTO empenhoDTO) {
        Optional<Empenho> existingEmpenho = empenhoRepository.findById(id);
        if (existingEmpenho.isEmpty()) {
            throw new RuntimeException("Empenho não encontrado com ID: " + id);
        }
        
        Empenho empenho = existingEmpenho.get();
        
        // Debug logs
        System.out.println("=== DEBUG EMPENHO UPDATE ===");
        System.out.println("Empenho ID sendo editado: " + id);
        System.out.println("Valor atual do empenho: " + empenho.getValor());
        System.out.println("Novo valor do empenho: " + empenhoDTO.getValor());
        System.out.println("Despesa ID: " + empenho.getDespesa().getId());
        System.out.println("Valor da despesa: " + empenho.getDespesa().getValor());
        
        // Verifica se o novo número de empenho já existe (se for diferente do atual)
        if (!empenho.getNumeroEmpenho().equals(empenhoDTO.getNumeroEmpenho()) &&
            empenhoRepository.existsByNumeroEmpenho(empenhoDTO.getNumeroEmpenho())) {
            throw new RuntimeException("Número de empenho já existe: " + empenhoDTO.getNumeroEmpenho());
        }
        
        // NOVA VALIDAÇÃO: Verificar se o novo valor não é menor que a soma dos pagamentos já realizados
        BigDecimal valorPagamentos = pagamentoRepository.sumValorByEmpenhoId(id);
        if (valorPagamentos == null) valorPagamentos = BigDecimal.ZERO;
        
        System.out.println("Valor dos pagamentos do empenho: " + valorPagamentos);
        
        if (empenhoDTO.getValor().compareTo(valorPagamentos) < 0) {
            throw new RuntimeException(String.format(
                "O novo valor do empenho (R$ %.2f) não pode ser menor que a soma dos pagamentos já realizados (R$ %.2f)",
                empenhoDTO.getValor().doubleValue(),
                valorPagamentos.doubleValue()
            ));
        }
        
        // Verificar se a nova soma dos empenhos não ultrapassará o valor da despesa
        // Primeiro, vamos testar as duas abordagens para ver qual está dando problema
        
        // Abordagem 1: Soma todos e subtrai o atual
        BigDecimal valorTodosEmpenhos = empenhoRepository.sumValorByDespesaId(empenho.getDespesa().getId());
        if (valorTodosEmpenhos == null) valorTodosEmpenhos = BigDecimal.ZERO;
        BigDecimal novoTotalAbordagem1 = valorTodosEmpenhos.subtract(empenho.getValor()).add(empenhoDTO.getValor());
        
        System.out.println("Abordagem 1 - Soma todos empenhos: " + valorTodosEmpenhos);
        System.out.println("Abordagem 1 - Novo total: " + novoTotalAbordagem1);
        
        // Abordagem 2: Soma apenas os outros empenhos
        BigDecimal valorOutrosEmpenhos = empenhoRepository.sumValorByDespesaIdExcluding(
            empenho.getDespesa().getId(), 
            id
        );
        if (valorOutrosEmpenhos == null) valorOutrosEmpenhos = BigDecimal.ZERO;
        BigDecimal novoTotalAbordagem2 = valorOutrosEmpenhos.add(empenhoDTO.getValor());
        
        System.out.println("Abordagem 2 - Soma outros empenhos: " + valorOutrosEmpenhos);
        System.out.println("Abordagem 2 - Novo total: " + novoTotalAbordagem2);
        
        // Vamos usar a abordagem 2
        if (novoTotalAbordagem2.compareTo(empenho.getDespesa().getValor()) > 0) {
            throw new RuntimeException(String.format(
                "O valor total dos empenhos (R$ %.2f) não pode ultrapassar o valor da despesa (R$ %.2f)",
                novoTotalAbordagem2.doubleValue(),
                empenho.getDespesa().getValor().doubleValue()
            ));
        }
        
        System.out.println("Validação passou! Atualizando empenho...");
        System.out.println("=== FIM DEBUG ===");
        
        empenho.setNumeroEmpenho(empenhoDTO.getNumeroEmpenho());
        empenho.setDataEmpenho(empenhoDTO.getDataEmpenho());
        empenho.setValor(empenhoDTO.getValor());
        empenho.setObservacao(empenhoDTO.getObservacao());
        
        empenho = empenhoRepository.save(empenho);
        return convertToDTO(empenho);
    }
    
    public void deleteById(Long id) {
        if (empenhoRepository.hasPagamentos(id)) {
            throw new RuntimeException("Não é possível excluir empenho que possui pagamentos associados");
        }
        empenhoRepository.deleteById(id);
    }
    
    private EmpenhoDTO convertToDTO(Empenho empenho) {
        EmpenhoDTO dto = new EmpenhoDTO();
        dto.setId(empenho.getId());
        dto.setNumeroEmpenho(empenho.getNumeroEmpenho());
        dto.setDataEmpenho(empenho.getDataEmpenho());
        dto.setValor(empenho.getValor());
        dto.setObservacao(empenho.getObservacao());
        dto.setDespesaId(empenho.getDespesa().getId());
        dto.setNumeroProtocoloDespesa(empenho.getDespesa().getNumeroProtocolo());
        return dto;
    }
    
    private Empenho convertToEntity(EmpenhoDTO dto) {
        Empenho empenho = new Empenho();
        empenho.setId(dto.getId());
        empenho.setNumeroEmpenho(dto.getNumeroEmpenho());
        empenho.setDataEmpenho(dto.getDataEmpenho());
        empenho.setValor(dto.getValor());
        empenho.setObservacao(dto.getObservacao());
        return empenho;
    }
}