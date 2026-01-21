package com.systemos.backend.repository;

import com.systemos.backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Métodos padrão já incluem o filtro @SQLRestriction("ativo = true")
    // Se precisar buscar inativos, precisaria de uma query nativa ou customizada ignorando o filtro
}
