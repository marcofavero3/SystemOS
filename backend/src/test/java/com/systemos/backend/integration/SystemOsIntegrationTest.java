package com.systemos.backend.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.systemos.backend.dto.ClienteRequestDTO;
import com.systemos.backend.dto.OrdemServicoRequestDTO;
import com.systemos.backend.dto.ServicoRequestDTO;
import com.systemos.backend.model.StatusOrdemServico;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SystemOsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static Long clienteId;
    private static Long servicoId;
    private static Long ordemServicoId;

    @Test
    @Order(1)
    public void deveCriarCliente() throws Exception {
        ClienteRequestDTO cliente = new ClienteRequestDTO();
        cliente.setNome("João da Silva");
        cliente.setTelefone("11988887777");

        MvcResult result = mockMvc.perform(post("/api/clientes")
                .with(httpBasic("admin", "admin"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cliente)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nome", is("João da Silva")))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        clienteId = objectMapper.readTree(jsonResponse).get("id").asLong();
        System.out.println("Cliente criado com ID: " + clienteId);
    }

    @Test
    @Order(2)
    public void deveCriarServico() throws Exception {
        ServicoRequestDTO servico = new ServicoRequestDTO();
        servico.setNome("Formatação");
        servico.setValor(new BigDecimal("150.00"));

        MvcResult result = mockMvc.perform(post("/api/servicos")
                .with(httpBasic("admin", "admin"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(servico)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nome", is("Formatação")))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        servicoId = objectMapper.readTree(jsonResponse).get("id").asLong();
        System.out.println("Serviço criado com ID: " + servicoId);
    }

    @Test
    @Order(3)
    public void deveCriarOrdemServico() throws Exception {
        OrdemServicoRequestDTO os = new OrdemServicoRequestDTO();
        os.setClienteId(clienteId);
        os.setServicoId(servicoId);
        // Não envia valor para testar o valor default do serviço

        MvcResult result = mockMvc.perform(post("/api/ordens-servico")
                .with(httpBasic("admin", "admin"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(os)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.clienteId", is(clienteId.intValue())))
                .andExpect(jsonPath("$.servicoId", is(servicoId.intValue())))
                .andExpect(jsonPath("$.valor", is(150.0))) // Verifica se pegou o valor do serviço
                .andExpect(jsonPath("$.status", is("EM_ABERTO")))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ordemServicoId = objectMapper.readTree(jsonResponse).get("id").asLong();
        System.out.println("Ordem de Serviço criada com ID: " + ordemServicoId);
    }

    @Test
    @Order(4)
    public void deveAtualizarOrdemServico() throws Exception {
        OrdemServicoRequestDTO os = new OrdemServicoRequestDTO();
        os.setStatus(StatusOrdemServico.EM_EXECUCAO);
        os.setValor(new BigDecimal("180.00")); // Alterando valor

        mockMvc.perform(put("/api/ordens-servico/" + ordemServicoId)
                .with(httpBasic("admin", "admin"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(os)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("EM_EXECUCAO")))
                .andExpect(jsonPath("$.valor", is(180.0)));
    }

    @Test
    @Order(5)
    public void deveListarOrdensServico() throws Exception {
        mockMvc.perform(get("/api/ordens-servico")
                .with(httpBasic("admin", "admin")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @Order(6)
    public void deveDeletarOrdemServico() throws Exception {
        mockMvc.perform(delete("/api/ordens-servico/" + ordemServicoId)
                .with(httpBasic("admin", "admin")))
                .andExpect(status().isNoContent());
    }

    @Test
    @Order(7)
    public void naoDeveEncontrarOrdemServicoDeletada() throws Exception {
        // Tenta buscar a OS deletada. Como usamos Soft Delete + @SQLRestriction, 
        // o findById deve retornar vazio e o service lançar ResourceNotFoundException (404)
        mockMvc.perform(get("/api/ordens-servico/" + ordemServicoId)
                .with(httpBasic("admin", "admin")))
                .andExpect(status().isNotFound());
    }
}
