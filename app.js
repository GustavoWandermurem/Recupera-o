const express = require('express');
const app = express();
app.use(express.json());

let clientes = [
  
  {"id": 1,
   "nome": "Gustavo", 
   "telefone": "47989138862"}

];
let carros = [];

let servicos = [];
let agendamentos = [];


const gerarId = (array) => (array.length > 0 ? array[array.length - 1].id + 1 : 1);


const verificarCliente = (req, res, next) => {
  const cliente = clientes.find((c) => c.id === parseInt(req.params.codigo));
  if (!cliente)
   return res.status(404).json({ mensagem: 'Cliente não encontrado' });
  req.cliente = cliente;
  next();
};


const verificarCarro = (req, res, next) => {
  const carro = carros.find((c) => c.id === parseInt(req.params.codigo));
  if (!carro) return res.status(404).json({ mensagem: 'Carro não encontrado' });
  req.carro = carro;
  next();
};


const verificarServico = (req, res, next) => {
  const servico = servicos.find((s) => s.id === parseInt(req.params.codigo));
  if (!servico) return res.status(404).json({ mensagem: 'Serviço não encontrado' });
  req.servico = servico;
  next();
};


const verificarAgendamento = (req, res, next) => {
  const agendamento = agendamentos.find((a) => a.id === parseInt(req.params.codigo));
  if (!agendamento) return res.status(404).json({ mensagem: 'Agendamento não encontrado' });
  req.agendamento = agendamento;
  next();
};


app.get('/clientes', (req, res) => {
  res.json(clientes);
});

app.post('/clientes', (req, res) => {
  const { nome, telefone } = req.body;
  
  if (!nome || nome.length < 3) return res.status(400).json({ mensagem: "'nome' deve conter no mínimo 3 caracteres" });
  
  
  if (nome.length > 100) return res.status(400).json({ mensagem: "'nome' deve conter no máximo 100 caracteres" });

  if (!telefone || telefone.length !== 11 || isNaN(telefone))
    return res.status(400).json({ mensagem: "'telefone' deve conter exatamente 11 dígitos" });

  const cliente = { id: gerarId(clientes), nome, telefone };
  clientes.push(cliente);
  res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso', cliente });
});

app.get('/clientes/:codigo', verificarCliente, (req, res) => {
  res.json(req.cliente);
});

app.put('/clientes/:codigo', verificarCliente, (req, res) => {
  const { nome, telefone } = req.body;
  if (nome && (nome.length < 3 || nome.length > 100))
    return res.status(400).json({ mensagem: "'nome' deve conter entre 3 e 100 caracteres" });
  if (telefone && (telefone.length !== 11 || isNaN(telefone)))
    return res.status(400).json({ mensagem: "'telefone' deve conter exatamente 11 dígitos" });

  Object.assign(req.cliente, { nome, telefone });
  res.json({ mensagem: 'Cliente atualizado com sucesso', cliente: req.cliente });
});

app.delete('/clientes/:codigo', verificarCliente, (req, res) => {
  clientes = clientes.filter((c) => c.id !== req.cliente.id);
  res.json({ mensagem: 'Cliente removido com sucesso' });
});



app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});

module.exports = app;
