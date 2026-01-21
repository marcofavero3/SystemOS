# Guia de Instalação e Execução - SystemOS

Este guia explica como rodar a aplicação SystemOS em um servidor local (sua "Máquina do Fundo").

## ✅ Pré-requisitos (O que instalar na outra máquina)

1.  **Java JDK 17** (ou superior): Necessário para rodar o sistema.
    *   [Baixar JDK 17](https://adoptium.net/)
2.  **Banco de Dados**: Escolha **UMA** das opções abaixo:
    *   **Opção A (Docker)**: Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/). (Recomendado)
    *   **Opção B (Manual)**: Instale o [PostgreSQL 15+](https://www.postgresql.org/download/).

---

## 🚀 Como Instalar e Rodar

Você tem duas formas de levar o sistema para lá: **Baixar o Código (Git)** ou **Levar o Arquivo Pronto (JAR)**.

### Método 1: Baixar o Código (Se você quiser mexer no código lá)

1.  Instale o **Git** e o **Maven** na máquina.
2.  Clone o projeto:
    ```powershell
    git clone https://github.com/marcofavero3/SystemOS.git
    cd SystemOS
    ```
3.  Suba o banco de dados (se usar Docker):
    ```powershell
    docker-compose up -d
    ```
4.  Rode o sistema:
    ```powershell
    cd backend
    ./mvnw spring-boot:run
    ```

### Método 2: Levar o Arquivo Pronto (Mais Simples - Só para usar)

Este método não precisa de Git ou Maven na outra máquina, apenas o Java.

#### 1. Na sua máquina atual (Dev):
1.  Gere o arquivo executável (que já inclui o Frontend):
    *   Abra o terminal no `frontend` e rode: `ng build`
    *   Copie o conteúdo de `dist/frontend/browser` para `backend/src/main/resources/static`.
    *   Abra o terminal no `backend` e rode: `mvn clean package`
2.  Pegue o arquivo gerado em `backend/target/backend-0.0.1-SNAPSHOT.jar`.

#### 2. Na máquina do fundo (Servidor):
1.  Crie uma pasta (ex: `C:\SistemaOS`).
2.  Coloque o arquivo **`backend-0.0.1-SNAPSHOT.jar`** lá.
3.  Se usar Docker, coloque também o **`docker-compose.yml`** e rode `docker-compose up -d`.
4.  Inicie o sistema:
    ```powershell
    java -jar backend-0.0.1-SNAPSHOT.jar
    ```

---

## 🌐 Como Acessar

- **Na própria máquina:** `http://localhost:8080`
- **De outro PC/Celular na rede:**
  1.  Descubra o IP da máquina do fundo (comando `ipconfig`).
  2.  Acesse `http://SEU_IP_AQUI:8080` (ex: `http://192.168.0.15:8080`).
