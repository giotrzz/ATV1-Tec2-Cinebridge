import { FastifyInstance } from 'fastify';
import { SistemaRecomendacao } from '../observers/SistemaRecomendacao.js';
import { RecomendacaoRequestDTO } from './DTOs.js';
import { converterProjeto, converterProfissional } from './conversores.js';

export function registrarRotas(app: FastifyInstance, sistemaRecomendacao: SistemaRecomendacao): void {
  app.post<{ Body: RecomendacaoRequestDTO }>('/recomendacoes', async (request, reply) => {
    try {
      const projeto = converterProjeto(request.body.projeto);
      const profissionais = request.body.profissionais.map(converterProfissional);

      const equipe = sistemaRecomendacao.executarRecomendacao(projeto, profissionais);

      return reply.status(200).send({
        equipeId: equipe.id,
        status: equipe.status,
        membros: equipe.membros.map((m) => ({
          papel: m.papel,
          profissionalId: m.profissional.id,
          confirmado: m.confirmado,
        })),
      });
    } catch (erro) {
      return reply.status(400).send({
        erro: erro instanceof Error ? erro.message : 'Erro desconhecido ao processar a recomendação.',
      });
    }
  });
}