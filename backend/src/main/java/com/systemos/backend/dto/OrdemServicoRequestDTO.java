package com.systemos.backend.dto;

import com.systemos.backend.model.StatusOrdemServico;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrdemServicoRequestDTO {

    // @NotNull removido para permitir atualização parcial sem enviar ID do cliente
    private Long clienteId;

    // @NotNull removido para permitir atualização parcial sem enviar ID do serviço
    private Long servicoId;

    @DecimalMin(value = "0.00", message = "O valor deve ser maior ou igual a zero")
    private BigDecimal valor; // Opcional, se nulo usa o valor do serviço

    private StatusOrdemServico status; // Opcional na criação (default EM_ABERTO)
}
