import Fastify from 'fastify';
import { OrquestradorPadrao } from './orchestration/OrquestradorPadrao.js';
import { RegrasOrcamento } from './strategies/RegrasOrcamento.js';
import { SistemaRecomendacao } from './observers/SistemaRecomendacao.js';
import { NotificadorEmail } from './observers/NotificadorEmail.js';
import { NotificadorInterno } from './observers/NotificadorInterno.js';
import { AuditoriaRecomendacao } from './observers/AuditoriaRecomendacao.js';
import { registrarRotas } from './http/rotas.js';

export function criarApp() {
  const app = Fastify();

  const orquestrador = new OrquestradorPadrao();
  const estrategiaInicial = new RegrasOrcamento();
  const sistemaRecomendacao = new SistemaRecomendacao(orquestrador, estrategiaInicial);

  sistemaRecomendacao.adicionarObservador(new NotificadorEmail());
  sistemaRecomendacao.adicionarObservador(new NotificadorInterno());
  sistemaRecomendacao.adicionarObservador(new AuditoriaRecomendacao());

  registrarRotas(app, sistemaRecomendacao);

  return app;
}

async function iniciar() {
  const app = criarApp();
  try {
    await app.listen({ port: 3000 });
    console.log('Servidor rodando em http://localhost:3000');
  } catch (erro) {
    console.error(erro);
    process.exit(1);
  }
}

iniciar();