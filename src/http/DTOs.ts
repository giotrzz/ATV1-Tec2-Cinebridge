export interface ProjetoDTO {
  id: string;
  genero: string;
  duracao: number;
  orcamento: number;
  prazo: string; // ISO date string
  papeisObrigatorios: string[]; // valores do enum Papel, como string
}

export interface CompetenciaDTO {
  nome: string;
  nivel: number;
}

export interface AvaliacaoDTO {
  nota: number;
  comentario: string;
  data: string; // ISO date string
}

export interface ProfissionalDTO {
  id: string;
  nome: string;
  competencias: CompetenciaDTO[];
  disponibilidade: { inicio: string; fim: string };
  precoMedio: number;
  avaliacoes?: AvaliacaoDTO[];
}

export interface RecomendacaoRequestDTO {
  projeto: ProjetoDTO;
  profissionais: ProfissionalDTO[];
}