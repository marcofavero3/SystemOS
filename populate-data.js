
const BASE_URL = 'http://localhost:8080/api';
const AUTH = 'Basic ' + btoa('admin:admin');

async function populate() {
  try {
    console.log('Criando cliente...');
    const clienteRes = await fetch(`${BASE_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': AUTH },
      body: JSON.stringify({ nome: 'Cliente Teste', telefone: '11999999999', email: 'teste@email.com' })
    });
    
    if (!clienteRes.ok) throw new Error(`Erro cliente: ${clienteRes.status}`);
    const cliente = await clienteRes.json();
    console.log('Cliente criado:', cliente);

    console.log('Criando serviço...');
    const servicoRes = await fetch(`${BASE_URL}/servicos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': AUTH },
      body: JSON.stringify({ nome: 'Formatação', valor: 150.00 })
    });

    if (!servicoRes.ok) throw new Error(`Erro serviço: ${servicoRes.status}`);
    const servico = await servicoRes.json();
    console.log('Serviço criado:', servico);

    console.log('Criando OS...');
    const osRes = await fetch(`${BASE_URL}/ordens-servico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': AUTH },
      body: JSON.stringify({ clienteId: cliente.id, servicoId: servico.id, valor: 150.00, status: 'EM_ABERTO' })
    });

    if (!osRes.ok) {
      const errorText = await osRes.text();
      throw new Error(`Erro OS: ${osRes.status} - ${errorText}`);
    }
    const os = await osRes.json();
    console.log('OS criada:', os);

    console.log('Dados populados com sucesso!');
  } catch (error) {
    console.error('Falha ao popular:', error);
  }
}

populate();
