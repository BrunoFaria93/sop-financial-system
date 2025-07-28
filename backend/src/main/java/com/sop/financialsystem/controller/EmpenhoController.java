package com.sop.financialsystem.controller;

import com.sop.financialsystem.dto.EmpenhoDTO;
import com.sop.financialsystem.service.EmpenhoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/empenhos")
@CrossOrigin(origins = "http://localhost:3000")
public class EmpenhoController {
    
    @Autowired
    private EmpenhoService empenhoService;
    
    @GetMapping
    public ResponseEntity<List<EmpenhoDTO>> getAllEmpenhos() {
        try {
            List<EmpenhoDTO> empenhos = empenhoService.findAll();
            return ResponseEntity.ok(empenhos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EmpenhoDTO> getEmpenhoById(@PathVariable Long id) {
        try {
            Optional<EmpenhoDTO> empenho = empenhoService.findById(id);
            return empenho.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/despesa/{despesaId}")
    public ResponseEntity<List<EmpenhoDTO>> getEmpenhosByDespesaId(@PathVariable Long despesaId) {
        try {
            List<EmpenhoDTO> empenhos = empenhoService.findByDespesaId(despesaId);
            return ResponseEntity.ok(empenhos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createEmpenho(@RequestBody EmpenhoDTO empenhoDTO) {
        try {
            EmpenhoDTO savedEmpenho = empenhoService.save(empenhoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEmpenho);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor");
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmpenho(@PathVariable Long id, @RequestBody EmpenhoDTO empenhoDTO) {
        try {
            EmpenhoDTO updatedEmpenho = empenhoService.update(id, empenhoDTO);
            return ResponseEntity.ok(updatedEmpenho);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor");
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmpenho(@PathVariable Long id) {
        try {
            empenhoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor");
        }
    }
}