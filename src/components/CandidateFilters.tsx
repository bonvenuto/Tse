/**
 * Barra de Filtros e Busca Neutra para as Candidaturas 2026.
 *
 * PRINCÍPIO: Ordenação exclusivamente neutra (alfabética por nome ou numérica por número de urna).
 * Proibida categoricamente ordenação por indicadores ou pontuações morais.
 */

import React from 'react';
import { CargoEleicao } from '../types';
import { Search, RotateCcw, Filter } from 'lucide-react';

interface FiltrosEstado {
  busca: string;
  uf: string;
  cargo: string;
  partido: string;
  situacaoTSE: string;
  posicaoPecBlindagem: string;
  posicaoEscala6x1: string;
  situacaoJudicial: string;
  apenasComMandatoAnterior: boolean;
  apenasComProcessosOuTCU: boolean;
  apenasComEscandalos: boolean;
  ordenacao: 'NOME_AZ' | 'NOME_ZA' | 'NUMERO_CRESCENTE' | 'NUMERO_DECRESCENTE';
}

interface Props {
  filtros: FiltrosEstado;
  onChangeFiltros: (novosFiltros: FiltrosEstado) => void;
  onLimparFiltros: () => void;
  totalFiltrados: number;
  totalGeral: number;
  partidosDisponiveis: string[];
}

const UFS = [
  'TODAS', 'BR', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const CARGOS: Array<{ valor: string; label: string }> = [
  { valor: 'TODOS', label: 'Todos os Cargos' },
  { valor: 'PRESIDENTE', label: 'Presidente da República' },
  { valor: 'GOVERNADOR', label: 'Governador de Estado' },
  { valor: 'SENADOR', label: 'Senador da República (2 Vagas)' },
  { valor: 'DEPUTADO_FEDERAL', label: 'Deputado Federal' },
  { valor: 'DEPUTADO_ESTADUAL', label: 'Deputado Estadual' },
  { valor: 'DEPUTADO_DISTRITAL', label: 'Deputado Distrital (DF)' },
];

export const CandidateFilters: React.FC<Props> = ({
  filtros,
  onChangeFiltros,
  onLimparFiltros,
  totalFiltrados,
  totalGeral,
  partidosDisponiveis,
}) => {
  const handleChange = (campo: keyof FiltrosEstado, valor: any) => {
    onChangeFiltros({
      ...filtros,
      [campo]: valor,
    });
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
      {/* Linha superior: Barra de Busca textual */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="search"
            value={filtros.busca}
            onChange={(e) => handleChange('busca', e.target.value)}
            placeholder="Buscar por nome de urna, nome civil, número ou partido..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>

        {/* Ordenação estritamente alfabética ou numérica */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 text-xs">
          <label htmlFor="select-ordenacao" className="text-stone-500 font-medium whitespace-nowrap">
            Ordenar por:
          </label>
          <select
            id="select-ordenacao"
            value={filtros.ordenacao}
            onChange={(e) => handleChange('ordenacao', e.target.value)}
            className="text-xs bg-stone-50 border border-stone-300 rounded px-2.5 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            <option value="NOME_AZ">Nome de Urna (A → Z)</option>
            <option value="NOME_ZA">Nome de Urna (Z → A)</option>
            <option value="NUMERO_CRESCENTE">Número de Urna (Crescente)</option>
            <option value="NUMERO_DECRESCENTE">Número de Urna (Decrescente)</option>
          </select>
        </div>
      </div>

      {/* Linha de filtros específicos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Filtro UF */}
        <div>
          <label htmlFor="select-uf" className="text-stone-500 block mb-1 font-medium">Estado / UF</label>
          <select
            id="select-uf"
            value={filtros.uf}
            onChange={(e) => handleChange('uf', e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none"
          >
            {UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf === 'TODAS' ? 'Todas as UFs' : uf === 'BR' ? 'Brasil (Nacional)' : uf}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Cargo */}
        <div>
          <label htmlFor="select-cargo" className="text-stone-500 block mb-1 font-medium">Cargo Disputado</label>
          <select
            id="select-cargo"
            value={filtros.cargo}
            onChange={(e) => handleChange('cargo', e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none"
          >
            {CARGOS.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Partido */}
        <div>
          <label htmlFor="select-partido" className="text-stone-500 block mb-1 font-medium">Partido / Federação</label>
          <select
            id="select-partido"
            value={filtros.partido}
            onChange={(e) => handleChange('partido', e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none"
          >
            <option value="TODOS">Todos os partidos</option>
            {partidosDisponiveis.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Filtro Situação TSE */}
        <div>
          <label htmlFor="select-situacao" className="text-stone-500 block mb-1 font-medium">Situação Registro TSE</label>
          <select
            id="select-situacao"
            value={filtros.situacaoTSE}
            onChange={(e) => handleChange('situacaoTSE', e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none"
          >
            <option value="TODAS">Todas as situações</option>
            <option value="DEFERIDO">Deferido</option>
            <option value="DEFERIDO_COM_RECURSO">Deferido com Recurso</option>
            <option value="AGUARDANDO_JULGAMENTO">Aguardando Julgamento</option>
            <option value="INDEFERIDO">Indeferido</option>
            <option value="INDEFERIDO_COM_RECURSO">Indeferido com Recurso</option>
          </select>
        </div>
      </div>

      {/* Linha 2 de filtros específicos: Situação Judicial e Posicionamentos em Pautas Cruciais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-stone-100">
        {/* Filtro Situação Judicial / Processual */}
        <div>
          <label htmlFor="select-situacao-judicial" className="text-stone-700 block mb-1 font-semibold flex items-center gap-1">
            <span>Situação Judicial / Processos</span>
          </label>
          <select
            id="select-situacao-judicial"
            value={filtros.situacaoJudicial}
            onChange={(e) => handleChange('situacaoJudicial', e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-500 font-medium"
          >
            <option value="TODAS">Todas as situações judiciais</option>
            <option value="APENAS_REUS">⚖️ Réu em Ação Penal (em curso)</option>
            <option value="APENAS_CONDENADOS">🏛️ Condenado (1ª instância ou colegiado)</option>
            <option value="COM_PROCESSOS">Com processos penais catalogados</option>
            <option value="CERTIDOES_NEGATIVAS">Sem processos (certidões 100% negativas)</option>
          </select>
        </div>

        {/* Filtro PEC da Blindagem */}
        <div>
          <label htmlFor="select-pec-blindagem" className="text-stone-700 block mb-1 font-semibold">
            PEC da Blindagem (Prerrogativas)
          </label>
          <select
            id="select-pec-blindagem"
            value={filtros.posicaoPecBlindagem}
            onChange={(e) => handleChange('posicaoPecBlindagem', e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            <option value="TODAS">Todas as posições na PEC Blindagem</option>
            <option value="FAVORAVEL">A favor da PEC da Blindagem</option>
            <option value="CONTRARIO">Contra a PEC da Blindagem</option>
            <option value="NAO_ASSINOU">Não assinou / Posição cautelosa</option>
          </select>
        </div>

        {/* Filtro Proibição da Escala 6x1 */}
        <div>
          <label htmlFor="select-escala-6x1" className="text-stone-700 block mb-1 font-semibold">
            Fim da Escala 6x1 (36h semanais)
          </label>
          <select
            id="select-escala-6x1"
            value={filtros.posicaoEscala6x1}
            onChange={(e) => handleChange('posicaoEscala6x1', e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            <option value="TODAS">Todas as posições na Escala 6x1</option>
            <option value="FAVORAVEL_OU_ASSINOU">A favor ou assinou a PEC 6x1</option>
            <option value="CONTRARIO">Contra a extinção da 6x1</option>
            <option value="NAO_ASSINOU">Não assinou a proposta</option>
          </select>
        </div>
      </div>

      {/* Filtros em toggles e contagem de registros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="inline-flex items-center gap-1.5 cursor-pointer text-stone-700">
            <input
              type="checkbox"
              checked={filtros.apenasComMandatoAnterior}
              onChange={(e) => handleChange('apenasComMandatoAnterior', e.target.checked)}
              className="rounded text-stone-800 focus:ring-stone-500"
            />
            <span>Apenas com mandatos anteriores</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer text-stone-700">
            <input
              type="checkbox"
              checked={filtros.apenasComProcessosOuTCU}
              onChange={(e) => handleChange('apenasComProcessosOuTCU', e.target.checked)}
              className="rounded text-stone-800 focus:ring-stone-500"
            />
            <span>Apenas com processos / TCU Cadirreg</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer text-stone-700 font-medium">
            <input
              type="checkbox"
              checked={filtros.apenasComEscandalos}
              onChange={(e) => handleChange('apenasComEscandalos', e.target.checked)}
              className="rounded text-stone-800 focus:ring-stone-500"
            />
            <span>Apenas com menções em apurações de escândalo / CPI / PF</span>
          </label>
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <span className="text-stone-500 tabular-nums">
            Exibindo <strong>{totalFiltrados}</strong> de {totalGeral} pedidos de registro
          </span>

          <button
            type="button"
            onClick={onLimparFiltros}
            className="text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
            title="Redefinir filtros para o padrão"
          >
            <RotateCcw className="w-3 h-3" /> Limpar
          </button>
        </div>
      </div>
    </div>
  );
};
