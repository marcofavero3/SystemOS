package com.systemos.backend.controller;

import com.systemos.backend.dto.OrdemServicoRequestDTO;
import com.systemos.backend.dto.OrdemServicoResponseDTO;
import com.systemos.backend.service.OrdemServicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordens-servico")
@RequiredArgsConstructor
public class OrdemServicoController {

    private final OrdemServicoService osService;

    @PostMapping
    public ResponseEntity<OrdemServicoResponseDTO> criar(@RequestBody @Valid OrdemServicoRequestDTO dto) {
        OrdemServicoResponseDTO novaOS = osService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaOS);
    }

    @GetMapping
    public ResponseEntity<List<OrdemServicoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(osService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdemServicoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(osService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdemServicoResponseDTO> atualizar(@PathVariable Long id, @RequestBody @Valid OrdemServicoRequestDTO dto) {
        return ResponseEntity.ok(osService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        osService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
