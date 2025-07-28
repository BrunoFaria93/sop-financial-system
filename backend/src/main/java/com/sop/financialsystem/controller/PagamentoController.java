package com.sop.financialsystem.controller;

import com.sop.financialsystem.dto.PagamentoDTO;
import com.sop.financialsystem.service.PagamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pagamentos")
@CrossOrigin(origins = "http://localhost:3000")
public class PagamentoController {
    
    @Autowired
    private PagamentoService pagamentoService;
    
    @GetMapping
    public ResponseEntity<List<PagamentoDTO>> getAllPagamentos() {
        try {
            List<PagamentoDTO> pagamentos = pagamentoService.findAll();
            return ResponseEntity.ok(pagamentos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PagamentoDTO> getPagamentoById(@PathVariable Long id) {
        try {
            Optional<PagamentoDTO> pagamento = pagamentoService.findById(id);
            return pagamento.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/empenho/{empenhoId}")
    public ResponseEntity<List<PagamentoDTO>> getPagamentosByEmpenhoId(@PathVariable Long empenhoId) {
        try {
            List<PagamentoDTO> pagamentos = pagamentoService.findByEmpenhoId(empenhoId);
            return ResponseEntity.ok(pagamentos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createPagamento(@RequestBody PagamentoDTO pagamentoDTO) {
        try {
            PagamentoDTO savedPagamento = pagamentoService.save(pagamentoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPagamento);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor");
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePagamento(@PathVariable Long id, @RequestBody PagamentoDTO pagamentoDTO) {
        try {
            PagamentoDTO updatedPagamento = pagamentoService.update(id, pagamentoDTO);
            return ResponseEntity.ok(updatedPagamento);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor");
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePagamento(@PathVariable Long id) {
        try {
            pagamentoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor");
        }
    }
}