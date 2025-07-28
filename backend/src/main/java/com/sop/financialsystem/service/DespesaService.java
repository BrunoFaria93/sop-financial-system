package com.sop.financialsystem.service;

import com.sop.financialsystem.dto.DespesaDTO;
import com.sop.financialsystem.entity.Despesa;
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
public class DespesaService {
    
    @Autowired
    private DespesaRepository despesaRepository;
    
    @Autowired
    private EmpenhoRepository empenhoRepository;
    
    @Autowired
    private PagamentoRepository pagamentoRepository;
    
    public List<DespesaDTO> findAll() {
        return despesaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<DespesaDTO> findById(Long id) {
        return despesaRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public DespesaDTO save(DespesaDTO despesaDTO) {
        if (despesaRepository.existsByNumeroProtocolo(despesaDTO.getNumeroProtocolo())) {
            throw new RuntimeException("Número de protocolo já existe: " + despesaDTO.getNumeroProtocolo());
        }
        
        Despesa despesa = convertToEntity(despesaDTO);
        despesa = despesaRepository.save(despesa);
        return convertToDTO(despesa);
    }
    
    public DespesaDTO update(Long id, DespesaDTO despesaDTO) {
        System.out.println("=== INÍCIO UPDATE DESPESA ===");
        System.out.println("ID da despesa: " + id);
        System.out.println("Novo valor: " + despesaDTO.getValor());
        
        Optional<Despesa> existingDespesa = despesaRepository.findById(id);
        if (existingDespesa.isEmpty()) {
            throw new RuntimeException("Despesa não encontrada com ID: " + id);
        }
        
        Despesa despesa = existingDespesa.get();
        System.out.println("Valor atual da despesa: " + despesa.getValor());
        
        // Verifica se o novo número de protocolo já existe (se for diferente do atual)
        if (!despesa.getNumeroProtocolo().equals(despesaDTO.getNumeroProtocolo()) &&
            despesaRepository.existsByNumeroProtocolo(despesaDTO.getNumeroProtocolo())) {
            throw new RuntimeException("Número de protocolo já existe: " + despesaDTO.getNumeroProtocolo());
        }
        
        // NOVA VALIDAÇÃO: Verificar se o novo valor não é menor que a soma dos empenhos
        BigDecimal somaEmpenhos = empenhoRepository.sumValorByDespesaId(id);
        if (somaEmpenhos == null) {
            somaEmpenhos = BigDecimal.ZERO;
        }
        
        System.out.println("Soma atual dos empenhos: " + somaEmpenhos);
        
        // Se há empenhos e o novo valor é menor que a soma dos empenhos
        if (somaEmpenhos.compareTo(BigDecimal.ZERO) > 0 && 
            despesaDTO.getValor().compareTo(somaEmpenhos) < 0) {
            
            String erro = String.format(
                "O novo valor da despesa (R$ %,.2f) não pode ser menor que a soma dos empenhos já realizados (R$ %,.2f)",
                despesaDTO.getValor(), somaEmpenhos
            );
            
            System.out.println("ERRO: " + erro);
            throw new RuntimeException(erro);
        }
        
        System.out.println("Validação OK - Atualizando despesa");
        
        despesa.setNumeroProtocolo(despesaDTO.getNumeroProtocolo());
        despesa.setTipoDespesa(despesaDTO.getTipoDespesa());
        despesa.setDataProtocolo(despesaDTO.getDataProtocolo());
        despesa.setDataVencimento(despesaDTO.getDataVencimento());
        despesa.setCredor(despesaDTO.getCredor());
        despesa.setDescricao(despesaDTO.getDescricao());
        despesa.setValor(despesaDTO.getValor());
        
        despesa = despesaRepository.save(despesa);
        System.out.println("Despesa atualizada com sucesso");
        System.out.println("=== FIM UPDATE DESPESA ===");
        
        return convertToDTO(despesa);
    }
    
    public void deleteById(Long id) {
        if (despesaRepository.hasEmpenhos(id)) {
            throw new RuntimeException("Não é possível excluir despesa que possui empenhos associados");
        }
        despesaRepository.deleteById(id);
    }
    
    private DespesaDTO convertToDTO(Despesa despesa) {
        DespesaDTO dto = new DespesaDTO();
        dto.setId(despesa.getId());
        dto.setNumeroProtocolo(despesa.getNumeroProtocolo());
        dto.setTipoDespesa(despesa.getTipoDespesa());
        dto.setDataProtocolo(despesa.getDataProtocolo());
        dto.setDataVencimento(despesa.getDataVencimento());
        dto.setCredor(despesa.getCredor());
        dto.setDescricao(despesa.getDescricao());
        dto.setValor(despesa.getValor());
        dto.setStatus(calculateStatus(despesa.getId(), despesa.getValor()));
        return dto;
    }
    
    private Despesa convertToEntity(DespesaDTO dto) {
        Despesa despesa = new Despesa();
        despesa.setId(dto.getId());
        despesa.setNumeroProtocolo(dto.getNumeroProtocolo());
        despesa.setTipoDespesa(dto.getTipoDespesa());
        despesa.setDataProtocolo(dto.getDataProtocolo());
        despesa.setDataVencimento(dto.getDataVencimento());
        despesa.setCredor(dto.getCredor());
        despesa.setDescricao(dto.getDescricao());
        despesa.setValor(dto.getValor());
        return despesa;
    }
    
    private String calculateStatus(Long despesaId, BigDecimal valorDespesa) {
        BigDecimal valorEmpenhos = empenhoRepository.sumValorByDespesaId(despesaId);
        BigDecimal valorPagamentos = pagamentoRepository.sumValorByDespesaId(despesaId);
        
        if (valorEmpenhos == null) valorEmpenhos = BigDecimal.ZERO;
        if (valorPagamentos == null) valorPagamentos = BigDecimal.ZERO;
        
        if (valorEmpenhos.compareTo(BigDecimal.ZERO) == 0) {
            return "Aguardando Empenho";
        } else if (valorEmpenhos.compareTo(valorDespesa) < 0) {
            return "Parcialmente Empenhada";
        } else if (valorPagamentos.compareTo(BigDecimal.ZERO) == 0) {
            return "Aguardando Pagamento";
        } else if (valorPagamentos.compareTo(valorDespesa) < 0) {
            return "Parcialmente Paga";
        } else {
            return "Paga";
        }
    }
}