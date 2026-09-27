import { OrquestradorEquipe } from './OrquestradorEquipe.js';
import { Projeto } from '../domain/entities/Projeto.js';
import { Profissional } from '../domain/entities/Profissional.js';
import { Papel } from '../domain/enums/Papel.js';

export class OrquestradorPadrao extends OrquestradorEquipe {
  protected validarRestricoes(projeto: Projeto): boolean {
    return projeto.orcamento > 0 && projeto.papeisObrigatorios.length > 0;
  }

  protected normalizarDados(projeto: Projeto, profissionais: Profissional[]): Profissional[] {
    const vistos = new Set<string>();
    return profissionais.filter((p) => {
      if (vistos.has(p.id)) return false;
      vistos.add(p.id);
      return true;
    });
  }

  protected posProcessar(
    recomendacoes: Map<Papel, Profissional[]>,
  ): Map<Papel, Profissional[]> {
    const resultado = new Map<Papel, Profissional[]>();
    for (const [papel, candidatos] of recomendacoes) {
      if (candidatos.length > 0) {
        resultado.set(papel, candidatos);
      }
    }
    return resultado;
  }
}