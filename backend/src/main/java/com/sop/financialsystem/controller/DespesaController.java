package com.sop.financialsystem.controller;

import com.sop.financialsystem.dto.DespesaDTO;
import com.sop.financialsystem.service.DespesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/despesas")
@CrossOrigin(origins = "http://localhost:3000")
public class DespesaController {
    
    @Autowired
    private DespesaService despesaService;
    
    @GetMapping
    public ResponseEntity<List<DespesaDTO>> getAllDespesas() {
        try {
            List<DespesaDTO> despesas = despesaService.findAll();
            return ResponseEntity.ok(despesas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DespesaDTO> getDespesaById(@PathVariable Long id) {
        try {
            Optional<DespesaDTO> despesa = despesaService.findById(id);
            return despesa.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createDespesa(@RequestBody DespesaDTO despesaDTO) {
        try {
            DespesaDTO savedDespesa = despesaService.save(despesaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDespesa);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor");
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDespesa(@PathVariable Long id, @RequestBody DespesaDTO despesaDTO) {
        try {
            DespesaDTO updatedDespesa = despesaService.update(id, despesaDTO);
            return ResponseEntity.ok(updatedDespesa);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor");
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDespesa(@PathVariable Long id) {
        try {
            despesaService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor");
        }
    }
}