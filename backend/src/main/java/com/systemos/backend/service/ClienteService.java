package com.systemos.backend.service;

import com.systemos.backend.dto.ClienteRequestDTO;
import com.systemos.backend.dto.ClienteResponseDTO;
import com.systemos.backend.exception.ResourceNotFoundException;
import com.systemos.backend.model.Cliente;
import com.systemos.backend.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Transactional
    public ClienteResponseDTO criar(ClienteRequestDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.getNome());
        cliente.setTelefone(dto.getTelefone());
        // ativo, datas e auditoria são geridos automaticamente
        
        Cliente salvo = clienteRepository.save(cliente);
        return toDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listarTodos() {
        return clienteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClienteResponseDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
        return toDTO(cliente);
    }

    @Transactional
    public ClienteResponseDTO atualizar(Long id, ClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
        
        cliente.setNome(dto.getNome());
        cliente.setTelefone(dto.getTelefone());
        
        Cliente atualizado = clienteRepository.save(cliente);
        return toDTO(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente não encontrado com id: " + id);
        }
        clienteRepository.deleteById(id); // O @SQLDelete na entidade fará o soft delete
    }

    private ClienteResponseDTO toDTO(Cliente cliente) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(cliente.getId());
        dto.setNome(cliente.getNome());
        dto.setTelefone(cliente.getTelefone());
        dto.setAtivo(cliente.isAtivo());
        dto.setDataCriacao(cliente.getDataCriacao());
        dto.setDataAtualizacao(cliente.getDataAtualizacao());
        dto.setCriadoPor(cliente.getCriadoPor());
        dto.setAtualizadoPor(cliente.getAtualizadoPor());
        return dto;
    }
}
