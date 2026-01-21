package com.systemos.backend.dto;

import com.systemos.backend.model.StatusOrdemServico;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrdemServicoResponseDTO {
    private Long id;
    private Long clienteId;
    private String clienteNome;
    private String clienteTelefone;
    private Long servicoId;
    private String servicoNome;
    private BigDecimal valor;
    private StatusOrdemServico status;
    private boolean ativo;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private String criadoPor;
    private String atualizadoPor;
}
