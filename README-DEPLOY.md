# Guia de Instalação e Execução - SystemOS

Este guia explica como levar a aplicação da sua máquina de desenvolvimento para a "Máquina do Fundo" (Servidor Local).

## ⚠️ IMPORTANTE: Escolha UM caminho para o Banco de Dados

Você tem duas opções para o banco de dados. **Não faça as duas coisas**, escolha apenas uma:

- **Opção A (Recomendada - Mais Fácil)**: Instalar **Docker Desktop**. O Docker vai baixar e configurar o PostgreSQL automaticamente para você. **Não instale o PostgreSQL manualmente se usar esta opção.**
- **Opção B (Manual)**: Instalar o **PostgreSQL** manualmente no Windows e configurar o banco e usuário na mão.

---

## 1. Preparação na Máquina de Desenvolvimento (Aqui)

Antes de ir para a outra máquina, vamos gerar os arquivos necessários.

### Passo 1: Gerar o Executável (JAR) com Frontend Integrado
Isso cria um arquivo único que contém o Backend e o Frontend juntos.

1. Abra o terminal na pasta `frontend`.
2. Gere o build do site:
   ```powershell
   ng build
   ```
3. Copie **todo o conteúdo** da pasta `frontend/dist/frontend/browser/` para a pasta `backend/src/main/resources/static/`.
   *(Se a pasta static não existir, crie-a. Se tiver arquivos antigos lá, apague antes)*.

4. Abra o terminal na pasta `backend`.
5. Compile o projeto Java:
   ```powershell
   mvn clean package
   ```
   *(Ou `./mvnw clean package`)*

6. O arquivo final estará em: `backend/target/backend-0.0.1-SNAPSHOT.jar`.

---

## 2. Instalação na "Máquina do Fundo" (Lá)

### O que você precisa levar para lá:
1. O arquivo **`backend-0.0.1-SNAPSHOT.jar`** (que você gerou acima).
2. O arquivo **`docker-compose.yml`** (está na raiz do projeto).
3. Instalar o **Java JDK 17+** na máquina.

### Passo a Passo no Computador do Fundo:

#### Se você escolheu a Opção A (Docker):
1. Instale o **Docker Desktop** para Windows e abra-o.
2. Crie uma pasta (ex: `C:\SistemaOS`) e coloque os arquivos `backend-0.0.1-SNAPSHOT.jar` e `docker-compose.yml` dentro dela.
3. Abra o PowerShell nessa pasta e rode:
   ```powershell
   docker-compose up -d
   ```
   *O Docker vai baixar o Postgres e iniciar o banco sozinho. Aguarde uns instantes.*
4. Agora rode o sistema:
   ```powershell
   java -jar backend-0.0.1-SNAPSHOT.jar
   ```

#### Se você escolheu a Opção B (PostgreSQL Manual):
1. Instale o PostgreSQL 15+ for Windows.
2. Abra o pgAdmin (vem junto).
3. Crie um banco de dados chamado `systemosdb`.
4. Crie um usuário (role) chamado `systemos` com a senha `systemos`.
   *(Se preferir usar outros dados, você terá que mudar o arquivo application.properties no código e gerar o JAR de novo).*
5. Crie uma pasta, coloque o `backend-0.0.1-SNAPSHOT.jar` e rode:
   ```powershell
   java -jar backend-0.0.1-SNAPSHOT.jar
   ```

---

## 3. Como Acessar
- Na própria máquina do fundo: Abra o navegador e vá em `http://localhost:8080`
- De outros computadores/celulares na mesma rede Wi-Fi:
  1. Descubra o IP da máquina do fundo (abra o PowerShell nela e digite `ipconfig`, procure por IPv4, ex: `192.168.1.15`).
  2. Acesse `http://192.168.1.15:8080`
