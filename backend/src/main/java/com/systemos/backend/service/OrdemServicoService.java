package com.systemos.backend.service;

import com.systemos.backend.dto.OrdemServicoRequestDTO;
import com.systemos.backend.dto.OrdemServicoResponseDTO;
import com.systemos.backend.exception.ResourceNotFoundException;
import com.systemos.backend.model.Cliente;
import com.systemos.backend.model.OrdemServico;
import com.systemos.backend.model.Servico;
import com.systemos.backend.model.StatusOrdemServico;
import com.systemos.backend.repository.ClienteRepository;
import com.systemos.backend.repository.OrdemServicoRepository;
import com.systemos.backend.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdemServicoService {

    private final OrdemServicoRepository osRepository;
    private final ClienteRepository clienteRepository;
    private final ServicoRepository servicoRepository;

    @Transactional
    public OrdemServicoResponseDTO criar(OrdemServicoRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + dto.getClienteId()));

        Servico servico = servicoRepository.findById(dto.getServicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado com id: " + dto.getServicoId()));

        OrdemServico os = new OrdemServico();
        os.setCliente(cliente);
        os.setServico(servico);
        os.setStatus(StatusOrdemServico.EM_ABERTO);
        
        // Se o valor não for informado no DTO, usa o valor do serviço
        if (dto.getValor() != null) {
            os.setValor(dto.getValor());
        } else {
            os.setValor(servico.getValor());
        }

        OrdemServico salvo = osRepository.save(os);
        return toDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<OrdemServicoResponseDTO> listarTodas() {
        return osRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrdemServicoResponseDTO buscarPorId(Long id) {
        OrdemServico os = osRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ordem de Serviço não encontrada com id: " + id));
        return toDTO(os);
    }

    @Transactional
    public OrdemServicoResponseDTO atualizar(Long id, OrdemServicoRequestDTO dto) {
        OrdemServico os = osRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ordem de Serviço não encontrada com id: " + id));

        // Se houver alteração de status
        if (dto.getStatus() != null) {
            // Aqui poderiam entrar regras de transição de status (ex: não voltar de FINALIZADO para EM_ABERTO)
            os.setStatus(dto.getStatus());
        }

        // Se houver alteração de valor
        if (dto.getValor() != null) {
            os.setValor(dto.getValor());
        }

        // Alteração de serviço (opcional, mas implementado por segurança)
        if (dto.getServicoId() != null && !dto.getServicoId().equals(os.getServico().getId())) {
            Servico novoServico = servicoRepository.findById(dto.getServicoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado com id: " + dto.getServicoId()));
            os.setServico(novoServico);
        }

        // Alteração de cliente (geralmente não se muda o cliente de uma OS, mas possível)
        if (dto.getClienteId() != null && !dto.getClienteId().equals(os.getCliente().getId())) {
             Cliente novoCliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + dto.getClienteId()));
             os.setCliente(novoCliente);
        }

        OrdemServico atualizada = osRepository.save(os);
        return toDTO(atualizada);
    }

    @Transactional
    public void deletar(Long id) {
        if (!osRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ordem de Serviço não encontrada com id: " + id);
        }
        osRepository.deleteById(id);
    }

    private OrdemServicoResponseDTO toDTO(OrdemServico os) {
        OrdemServicoResponseDTO dto = new OrdemServicoResponseDTO();
        dto.setId(os.getId());
        dto.setClienteId(os.getCliente().getId());
        dto.setClienteNome(os.getCliente().getNome());
        dto.setClienteTelefone(os.getCliente().getTelefone());
        dto.setServicoId(os.getServico().getId());
        dto.setServicoNome(os.getServico().getNome());
        dto.setValor(os.getValor());
        dto.setStatus(os.getStatus());
        dto.setAtivo(os.isAtivo());
        dto.setDataCriacao(os.getDataCriacao());
        dto.setDataAtualizacao(os.getDataAtualizacao());
        dto.setCriadoPor(os.getCriadoPor());
        dto.setAtualizadoPor(os.getAtualizadoPor());
        return dto;
    }
}
