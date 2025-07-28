package com.sop.financialsystem.service;

import com.sop.financialsystem.dto.PagamentoDTO;
import com.sop.financialsystem.entity.Empenho;
import com.sop.financialsystem.entity.Pagamento;
import com.sop.financialsystem.repository.EmpenhoRepository;
import com.sop.financialsystem.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PagamentoService {
    
    @Autowired
    private PagamentoRepository pagamentoRepository;
    
    @Autowired
    private EmpenhoRepository empenhoRepository;
    
    public List<PagamentoDTO> findAll() {
        return pagamentoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<PagamentoDTO> findById(Long id) {
        return pagamentoRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public List<PagamentoDTO> findByEmpenhoId(Long empenhoId) {
        return pagamentoRepository.findByEmpenhoId(empenhoId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public PagamentoDTO save(PagamentoDTO pagamentoDTO) {
        if (pagamentoRepository.existsByNumeroPagamento(pagamentoDTO.getNumeroPagamento())) {
            throw new RuntimeException("Número de pagamento já existe: " + pagamentoDTO.getNumeroPagamento());
        }
        
        Optional<Empenho> empenho = empenhoRepository.findById(pagamentoDTO.getEmpenhoId());
        if (empenho.isEmpty()) {
            throw new RuntimeException("Empenho não encontrado com ID: " + pagamentoDTO.getEmpenhoId());
        }
        
        BigDecimal valorPagamentos = pagamentoRepository.sumValorByEmpenhoId(pagamentoDTO.getEmpenhoId());
        if (valorPagamentos == null) valorPagamentos = BigDecimal.ZERO;
        
        BigDecimal novoTotal = valorPagamentos.add(pagamentoDTO.getValor());
        if (novoTotal.compareTo(empenho.get().getValor()) > 0) {
            throw new RuntimeException("A soma dos pagamentos não pode ultrapassar o valor do empenho");
        }
        
        Pagamento pagamento = convertToEntity(pagamentoDTO);
        pagamento.setEmpenho(empenho.get());
        pagamento = pagamentoRepository.save(pagamento);
        return convertToDTO(pagamento);
    }
    
    public PagamentoDTO update(Long id, PagamentoDTO pagamentoDTO) {
        Optional<Pagamento> existingPagamento = pagamentoRepository.findById(id);
        if (existingPagamento.isEmpty()) {
            throw new RuntimeException("Pagamento não encontrado com ID: " + id);
        }

        Pagamento pagamento = existingPagamento.get();

        // Verifica se o novo número de pagamento já existe (se for diferente do atual)
        if (!pagamento.getNumeroPagamento().equals(pagamentoDTO.getNumeroPagamento()) &&
            pagamentoRepository.existsByNumeroPagamento(pagamentoDTO.getNumeroPagamento())) {
            throw new RuntimeException("Número de pagamento já existe: " + pagamentoDTO.getNumeroPagamento());
        }

        // Verificar e atualizar o empenho, se necessário
        Long newEmpenhoId = pagamentoDTO.getEmpenhoId();
        if (newEmpenhoId != null && !newEmpenhoId.equals(pagamento.getEmpenho().getId())) {
            Optional<Empenho> newEmpenho = empenhoRepository.findById(newEmpenhoId);
            if (newEmpenho.isEmpty()) {
                throw new RuntimeException("Empenho não encontrado com ID: " + newEmpenhoId);
            }

            // Recalculate totals
            BigDecimal oldValorPagamentos = pagamentoRepository.sumValorByEmpenhoId(pagamento.getEmpenho().getId());
            if (oldValorPagamentos == null) oldValorPagamentos = BigDecimal.ZERO;
            BigDecimal adjustedOldTotal = oldValorPagamentos.subtract(pagamento.getValor());

            BigDecimal newValorPagamentos = pagamentoRepository.sumValorByEmpenhoId(newEmpenhoId);
            if (newValorPagamentos == null) newValorPagamentos = BigDecimal.ZERO;
            BigDecimal novoTotal = newValorPagamentos.add(pagamentoDTO.getValor());

            if (novoTotal.compareTo(newEmpenho.get().getValor()) > 0) {
                throw new RuntimeException("A soma dos pagamentos não pode ultrapassar o valor do novo empenho");
            }

            // Update the empenho relationship and sync empenhoId
            pagamento.setEmpenho(newEmpenho.get());
        } else {
            // Validate with existing empenho
            BigDecimal valorPagamentos = pagamentoRepository.sumValorByEmpenhoId(pagamento.getEmpenho().getId());
            if (valorPagamentos == null) valorPagamentos = BigDecimal.ZERO;
            BigDecimal novoTotal = valorPagamentos.subtract(pagamento.getValor()).add(pagamentoDTO.getValor());
            if (novoTotal.compareTo(pagamento.getEmpenho().getValor()) > 0) {
                throw new RuntimeException("A soma dos pagamentos não pode ultrapassar o valor do empenho");
            }
        }

        // Update other fields
        pagamento.setNumeroPagamento(pagamentoDTO.getNumeroPagamento());
        pagamento.setDataPagamento(pagamentoDTO.getDataPagamento());
        pagamento.setValor(pagamentoDTO.getValor());
        pagamento.setObservacao(pagamentoDTO.getObservacao());

        // Save and return
   System.out.println("Before update: pagamento.empenhoId=" + pagamento.getEmpenho().getId());
pagamento = pagamentoRepository.save(pagamento);
System.out.println("After update: pagamento.empenhoId=" + pagamento.getEmpenho().getId());
        System.out.println("Updated Pagamento: id=" + pagamento.getId() + ", empenhoId=" + pagamento.getEmpenho().getId());
        return convertToDTO(pagamento);
    }
    
    public void deleteById(Long id) {
        pagamentoRepository.deleteById(id);
    }
    
    private PagamentoDTO convertToDTO(Pagamento pagamento) {
        PagamentoDTO dto = new PagamentoDTO();
        dto.setId(pagamento.getId());
        dto.setNumeroPagamento(pagamento.getNumeroPagamento());
        dto.setDataPagamento(pagamento.getDataPagamento());
        dto.setValor(pagamento.getValor());
        dto.setObservacao(pagamento.getObservacao());
        dto.setEmpenhoId(pagamento.getEmpenho().getId());
        dto.setNumeroEmpenho(pagamento.getEmpenho().getNumeroEmpenho()); // Assuming Empenho has numeroEmpenho
        return dto;
    }
    
    private Pagamento convertToEntity(PagamentoDTO dto) {
        Pagamento pagamento = new Pagamento();
        pagamento.setId(dto.getId());
        pagamento.setNumeroPagamento(dto.getNumeroPagamento());
        pagamento.setDataPagamento(dto.getDataPagamento());
        pagamento.setValor(dto.getValor());
        pagamento.setObservacao(dto.getObservacao());
        return pagamento;
    }
}