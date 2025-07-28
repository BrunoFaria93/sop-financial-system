package com.sop.financialsystem.service;

import com.sop.financialsystem.dto.EmpenhoDTO;
import com.sop.financialsystem.entity.Despesa;
import com.sop.financialsystem.entity.Empenho;
import com.sop.financialsystem.repository.DespesaRepository;
import com.sop.financialsystem.repository.EmpenhoRepository;
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
            throw new RuntimeException("A soma dos empenhos não pode ultrapassar o valor da despesa");
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
        
        // Verifica se o novo número de empenho já existe (se for diferente do atual)
        if (!empenho.getNumeroEmpenho().equals(empenhoDTO.getNumeroEmpenho()) &&
            empenhoRepository.existsByNumeroEmpenho(empenhoDTO.getNumeroEmpenho())) {
            throw new RuntimeException("Número de empenho já existe: " + empenhoDTO.getNumeroEmpenho());
        }
        
        // Verificar se a nova soma dos empenhos não ultrapassará o valor da despesa
        BigDecimal valorEmpenhos = empenhoRepository.sumValorByDespesaId(empenho.getDespesa().getId());
        if (valorEmpenhos == null) valorEmpenhos = BigDecimal.ZERO;
        
        // Subtrair o valor atual do empenho e somar o novo valor
        BigDecimal novoTotal = valorEmpenhos.subtract(empenho.getValor()).add(empenhoDTO.getValor());
        if (novoTotal.compareTo(empenho.getDespesa().getValor()) > 0) {
            throw new RuntimeException("A soma dos empenhos não pode ultrapassar o valor da despesa");
        }
        
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