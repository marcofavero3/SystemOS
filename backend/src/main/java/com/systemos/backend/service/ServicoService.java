package com.systemos.backend.service;

import com.systemos.backend.dto.ServicoRequestDTO;
import com.systemos.backend.dto.ServicoResponseDTO;
import com.systemos.backend.exception.ResourceNotFoundException;
import com.systemos.backend.model.Servico;
import com.systemos.backend.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicoService {

    private final ServicoRepository servicoRepository;

    @Transactional
    public ServicoResponseDTO criar(ServicoRequestDTO dto) {
        Servico servico = new Servico();
        servico.setNome(dto.getNome());
        servico.setValor(dto.getValor());
        // ativo, datas e auditoria são geridos automaticamente

        Servico salvo = servicoRepository.save(servico);
        return toDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<ServicoResponseDTO> listarTodos() {
        return servicoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServicoResponseDTO buscarPorId(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado com id: " + id));
        return toDTO(servico);
    }

    @Transactional
    public ServicoResponseDTO atualizar(Long id, ServicoRequestDTO dto) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado com id: " + id));

        servico.setNome(dto.getNome());
        servico.setValor(dto.getValor());

        Servico atualizado = servicoRepository.save(servico);
        return toDTO(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!servicoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Serviço não encontrado com id: " + id);
        }
        servicoRepository.deleteById(id);
    }

    private ServicoResponseDTO toDTO(Servico servico) {
        ServicoResponseDTO dto = new ServicoResponseDTO();
        dto.setId(servico.getId());
        dto.setNome(servico.getNome());
        dto.setValor(servico.getValor());
        dto.setAtivo(servico.isAtivo());
        dto.setDataCriacao(servico.getDataCriacao());
        dto.setDataAtualizacao(servico.getDataAtualizacao());
        dto.setCriadoPor(servico.getCriadoPor());
        dto.setAtualizadoPor(servico.getAtualizadoPor());
        return dto;
    }
}
