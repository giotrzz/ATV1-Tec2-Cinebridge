import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';
import { Competencia } from '../domain/entities/Competencia.js';
import { Avaliacao } from '../domain/entities/Avaliacao.js';
import { Intervalo } from '../domain/entities/Intervalo.js';
import { Papel } from '../domain/enums/Papel.js';
import { ProjetoDTO, ProfissionalDTO } from './DTOs.js';

export function converterProjeto(dto: ProjetoDTO): Projeto {
  const papeis = dto.papeisObrigatorios.map((p) => {
    if (!Object.values(Papel).includes(p as Papel)) {
      throw new Error(`Papel inválido: ${p}`);
    }
    return p as Papel;
  });

  return new Projeto(dto.id, dto.genero, dto.duracao, dto.orcamento, new Date(dto.prazo), papeis);
}

export function converterProfissional(dto: ProfissionalDTO): Profissional {
  const competencias = dto.competencias.map((c) => new Competencia(c.nome, c.nivel));
  const disponibilidade: Intervalo = {
    inicio: new Date(dto.disponibilidade.inicio),
    fim: new Date(dto.disponibilidade.fim),
  };

  const profissional = new Profissional(dto.id, dto.nome, competencias, disponibilidade, dto.precoMedio);

  for (const avaliacaoDto of dto.avaliacoes ?? []) {
    profissional.avaliacoes.push(
      new Avaliacao(avaliacaoDto.nota, avaliacaoDto.comentario, new Date(avaliacaoDto.data)),
    );
  }

  return profissional;
}