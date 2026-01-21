const http = require('http');

function request(path, method, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8080,
            path: path,
            method: method,
            headers: {
                'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64'),
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(data ? JSON.parse(data) : null);
                    } catch (e) {
                        reject('Erro ao parsear JSON');
                    }
                } else {
                    reject(`Status Code: ${res.statusCode} para ${method} ${path} - Body: ${data}`);
                }
            });
        });

        req.on('error', (e) => {
            reject(e.message);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function test() {
    console.log('--- INICIANDO TESTES DE API COMPLETO (CRUD) ---');
    let errors = 0;
    let clienteId = null;
    let servicoId = null;

    // 1. Criar Cliente
    try {
        console.log('\n1. Testando POST /api/clientes...');
        const novoCliente = await request('/api/clientes', 'POST', {
            nome: 'Cliente Teste Node',
            telefone: '(11) 98765-4321'
        });
        console.log('[OK] Cliente criado:', novoCliente);
        clienteId = novoCliente.id;
    } catch (e) {
        console.error(`[ERRO] Falha ao criar cliente: ${e}`);
        errors++;
    }

    // 2. Criar Serviço
    try {
        console.log('\n2. Testando POST /api/servicos...');
        const novoServico = await request('/api/servicos', 'POST', {
            nome: 'Serviço Teste Node',
            valor: 200.50
        });
        console.log('[OK] Serviço criado:', novoServico);
        servicoId = novoServico.id;
    } catch (e) {
        console.error(`[ERRO] Falha ao criar serviço: ${e}`);
        errors++;
    }

    // 3. Criar Ordem de Serviço
    if (clienteId && servicoId) {
        try {
            console.log('\n3. Testando POST /api/ordens-servico...');
            const novaOS = await request('/api/ordens-servico', 'POST', {
                clienteId: clienteId,
                servicoId: servicoId
            });
            console.log('[OK] OS criada:', novaOS);

            // Validar campos de retorno
            if (!novaOS.clienteNome || !novaOS.clienteTelefone) {
                console.error('[ERRO] OS criada sem dados do cliente (nome ou telefone)');
                errors++;
            } else {
                console.log('   [OK] Dados do cliente presentes na OS.');
            }

        } catch (e) {
            console.error(`[ERRO] Falha ao criar OS: ${e}`);
            errors++;
        }
    } else {
        console.warn('\n[PULANDO] Teste de criação de OS pulado pois Cliente ou Serviço falharam.');
    }

    // 4. Listar Tudo
    try {
        console.log('\n4. Testando GET /api/ordens-servico (Listagem)...');
        const ordens = await request('/api/ordens-servico', 'GET');
        console.log(`[OK] Recuperadas ${ordens.length} ordens.`);
    } catch (e) {
        console.error(`[ERRO] Falha ao listar OS: ${e}`);
        errors++;
    }

    console.log('\n--- RESUMO ---');
    if (errors === 0) {
        console.log('SUCESSO TOTAL: Backend está 100% funcional para escrita e leitura.');
        process.exit(0);
    } else {
        console.error(`FALHA: ${errors} erro(s) encontrados.`);
        process.exit(1);
    }
}

test();
