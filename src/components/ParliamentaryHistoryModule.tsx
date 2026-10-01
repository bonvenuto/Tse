/**
 * Módulo de Histórico de Mandatos Anteriores e Atuação Parlamentar Recente.
 *
 * REQUISITOS:
 * 1. Mandatos anteriores detalhados (legislatura, casa, partido, início, fim, motivo, link oficial).
 * 2. Resumo da atuação recente com porcentagem de presença (separando justificadas e não justificadas).
 * 3. As últimas 20 votações nominais com: voto dado, orientação do partido e orientação do governo na época.
 * 4. Dados rastreáveis até a API da Câmara dos Deputados e do Senado Federal.
 */

import React, { useState } from 'react';
import { MandatoAnterior, PresencaEstatistica, VotacaoNominal, VotoTipo, OrientacaoBancada } from '../types';
import { Landmark, Calendar, ExternalLink, Check, X, Minus, Filter, ChevronDown, ChevronUp, FileCode } from 'lucide-react';

interface Props {
  mandatos: MandatoAnterior[];
  presenca?: PresencaEstatistica;
  ultimas20Votacoes: VotacaoNominal[];
  cargoAtual: string;
  somenteAtuacao?: boolean;
  onNavegarMandatos?: () => void;
}

const CASA_NOMES: Record<string, string> = {
  CAMARA_DOS_DEPUTADOS: 'Câmara dos Deputados',
  SENADO_FEDERAL: 'Senado Federal',
  ASSEMBLEIA_LEGISLATIVA: 'Assembleia Legislativa Estadual',
  CAMARA_LEGISLATIVA_DF: 'Câmara Legislativa do DF (CLDF)',
  CAMARA_MUNICIPAL: 'Câmara Municipal de Vereadores',
  PODER_EXECUTIVO: 'Poder Executivo (Chefia ou Ministério)',
};

const VOTO_FORMATO: Record<VotoTipo, { label: string; bg: string; text: string; border: string }> = {
  SIM: { label: 'Sim', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  NAO: { label: 'Não', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  ABSTENCAO: { label: 'Abstenção', bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' },
  OBSTRUCAO: { label: 'Obstrução', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  ARTIGO_17: { label: 'Art. 17 (Presidência)', bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  AUSENTE_JUSTIFICADO: { label: 'Ausente (Justificado)', bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-300' },
  AUSENTE_NAO_JUSTIFICADO: { label: 'Ausente (Não justificado)', bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-400' },
  NAO_APLICAVEL: { label: 'Não aplicável', bg: 'bg-stone-100', text: 'text-stone-500', border: 'border-stone-200' },
};

export const ParliamentaryHistoryModule: React.FC<Props> = ({
  mandatos,
  presenca,
  ultimas20Votacoes,
  cargoAtual,
  somenteAtuacao = false,
  onNavegarMandatos,
}) => {
  const [filtroAlinhamento, setFiltroAlinhamento] = useState<'TODOS' | 'COM_GOVERNO' | 'CONTRA_GOVERNO'>('TODOS');
  const [votacaoExpandida, setVotacaoExpandida] = useState<string | null>(null);

  const votacoesFiltradas = ultimas20Votacoes.filter((v) => {
    if (filtroAlinhamento === 'COM_GOVERNO') return v.alinhouComGoverno;
    if (filtroAlinhamento === 'CONTRA_GOVERNO') return !v.alinhouComGoverno;
    return true;
  });

  return (
    <section className="space-y-8" aria-labelledby="secao-atuacao-parlamentar">
      {/* BANNER DE NAVEGAÇÃO / ATUAÇÃO PARLAMENTAR */}
      {somenteAtuacao ? (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h2 id="secao-atuacao-parlamentar" className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-stone-800" aria-hidden="true" />
              Atuação Parlamentar Recente
            </h2>
            <p className="text-stone-500 text-xs mt-0.5">
              Assiduidade em sessões deliberativas e histórico de votações nominais com orientações oficiais de bancada e governo.
            </p>
          </div>

          {mandatos.length > 0 && onNavegarMandatos && (
            <button
              type="button"
              onClick={onNavegarMandatos}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-stone-300 font-semibold text-stone-800 hover:bg-stone-100 transition-colors shrink-0 shadow-2xs"
            >
              <span>Ver Timeline de Mandatos ({mandatos.length})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        /* 1. HISTÓRICO DETALHADO DE MANDATOS ANTERIORES */
        <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <h3 id="secao-historico-mandatos" className="text-lg font-serif font-semibold text-stone-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-stone-700" aria-hidden="true" />
                Histórico Detalhado de Mandatos Anteriores
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Trajetória oficial em cargos legislativos e executivos com identificadores nos portais das Casas.
              </p>
            </div>

            <span className="text-xs text-stone-500">
              {mandatos.length} {mandatos.length === 1 ? 'mandato registrado' : 'mandatos registrados'}
            </span>
          </div>

          {mandatos.length === 0 ? (
            <div className="p-5 text-center bg-stone-50 rounded border border-dashed border-stone-200">
              <p className="text-sm font-medium text-stone-700">
                Primeira candidatura a cargo público ou sem mandatos eletivos anteriores registrados.
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Não constam registros prévios na Câmara dos Deputados, no Senado Federal ou no Poder Executivo nos bancos de dados oficiais do TSE.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
                  <tr>
                    <th scope="col" className="py-2.5 px-3">Cargo / Mandato</th>
                    <th scope="col" className="py-2.5 px-3">Casa / Poder</th>
                    <th scope="col" className="py-2.5 px-3">Legislatura / Período</th>
                    <th scope="col" className="py-2.5 px-3">Partido na Época</th>
                    <th scope="col" className="py-2.5 px-3">Período de Exercício</th>
                    <th scope="col" className="py-2.5 px-3 text-right">Fonte Oficial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {mandatos.map((mand) => (
                    <tr key={mand.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-3 font-medium text-stone-900">
                        {mand.cargo}
                      </td>
                      <td className="py-3 px-3 text-stone-600">
                        {CASA_NOMES[mand.casaLegislativa] || mand.casaLegislativa} ({mand.uf})
                      </td>
                      <td className="py-3 px-3 text-stone-600">
                        {mand.legislatura || '—'}
                      </td>
                      <td className="py-3 px-3 font-semibold text-stone-800">
                        {mand.partidoNaEpoca}
                      </td>
                      <td className="py-3 px-3 text-stone-600 tabular-nums">
                        <span>{mand.dataInicio}</span>
                        <span className="mx-1 text-stone-400">até</span>
                        <span>{mand.dataFim}</span>
                        {mand.motivoTermino && (
                          <span className="block text-[11px] text-stone-400 mt-0.5">
                            {mand.motivoTermino}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={mand.urlPerfilOficial}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-stone-800 underline hover:text-stone-950 font-medium"
                        >
                          Ver na Casa <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. RESUMO DE ATUAÇÃO RECENTE: PRESENÇA EM SESSÕES DELIBERATIVAS */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-lg font-serif font-semibold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-stone-700" aria-hidden="true" />
              Presença e Assiduidade Parlamentar Recente (57ª Legislatura)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Critério rigoroso: Presenças, Ausências Justificadas e Ausências Não Justificadas sobre o total de sessões deliberativas convocadas.
            </p>
          </div>

          {presenca && (
            <span className="text-xs text-stone-500 font-mono">
              Período: 2023–2026
            </span>
          )}
        </div>

        {!presenca ? (
          <div className="p-5 text-center bg-stone-50 rounded border border-dashed border-stone-200">
            <p className="text-sm font-medium text-stone-700">
              Presença parlamentar não se aplica para este histórico recente.
            </p>
            <p className="text-xs text-stone-500 mt-1 max-w-xl mx-auto leading-relaxed">
              Candidato atuou no Poder Executivo (cujo controle se dá pela fiscalização de contas públicas nos Tribunais de Contas) ou é postulante sem mandato eletivo federal no quadriênio 2023–2026.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* GRÁFICO DE PRESENÇA PARLAMENTAR: PADRÃO DE 3 COMPONENTES + DENOMINADOR OFICIAL */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center p-4 bg-stone-50/80 rounded-lg border border-stone-200">
              {/* Gráfico Donut SVG Circular */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-2">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                    {/* Fundo do círculo */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E7E5E4" strokeWidth="12" />
                    
                    {/* Segmento 1: Presenças Confirmadas */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#1C1917"
                      strokeWidth="12"
                      strokeDasharray={`${(presenca.percentualPresencaEstrita * 2.51327).toFixed(1)} 251.327`}
                      strokeDashoffset="0"
                    />

                    {/* Segmento 2: Ausências Justificadas */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#78716C"
                      strokeWidth="12"
                      strokeDasharray={`${((presenca.ausenciasJustificadas / presenca.totalSessoesDeliberativasConvocadas) * 100 * 2.51327).toFixed(1)} 251.327`}
                      strokeDashoffset={`-${(presenca.percentualPresencaEstrita * 2.51327).toFixed(1)}`}
                    />

                    {/* Segmento 3: Ausências Não Justificadas */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#DC2626"
                      strokeWidth="12"
                      strokeDasharray={`${((presenca.ausenciasNaoJustificadas / presenca.totalSessoesDeliberativasConvocadas) * 100 * 2.51327).toFixed(1)} 251.327`}
                      strokeDashoffset={`-${((presenca.percentualPresencaEstrita + (presenca.ausenciasJustificadas / presenca.totalSessoesDeliberativasConvocadas) * 100) * 2.51327).toFixed(1)}`}
                    />
                  </svg>

                  {/* Denominador no centro do Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-xl font-bold text-stone-900 leading-none tabular-nums">
                      {presenca.totalSessoesDeliberativasConvocadas}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mt-0.5">
                      Sessões
                    </span>
                    <span className="text-[8px] text-stone-400">Denominador</span>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-stone-700 mt-2">
                  Taxa Global: {presenca.percentualComparecimentoOuJustificado.toFixed(1)}%
                </span>
              </div>

              {/* Detalhamento dos 3 Componentes Oficiais + Denominador */}
              <div className="md:col-span-8 space-y-3">
                <div className="border-b border-stone-200 pb-2">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block">
                    Padrão Oficial Regimental: 3 Componentes + Denominador Convocado
                  </span>
                  <span className="text-xs text-stone-500">
                    Sessões Deliberativas Ordinárias e Extraordinárias da 57ª Legislatura
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Componente 1: Presenças Confirmadas */}
                  <div className="p-3 bg-white border border-stone-300 rounded shadow-2xs space-y-0.5">
                    <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs">
                      <span className="w-2.5 h-2.5 bg-stone-900 rounded-xs" aria-hidden="true" />
                      <span>1. Presenças</span>
                    </div>
                    <div className="font-mono text-lg font-bold text-stone-900 tabular-nums">
                      {presenca.presencasConfirmadas}
                    </div>
                    <span className="text-[10px] text-stone-600 block font-medium">
                      {presenca.percentualPresencaEstrita.toFixed(1)}% do total
                    </span>
                  </div>

                  {/* Componente 2: Ausências Justificadas */}
                  <div className="p-3 bg-white border border-stone-300 rounded shadow-2xs space-y-0.5">
                    <div className="flex items-center gap-1.5 text-stone-700 font-semibold text-xs">
                      <span className="w-2.5 h-2.5 bg-stone-500 rounded-xs" aria-hidden="true" />
                      <span>2. Justificadas</span>
                    </div>
                    <div className="font-mono text-lg font-bold text-stone-800 tabular-nums">
                      {presenca.ausenciasJustificadas}
                    </div>
                    <span className="text-[10px] text-stone-500 block">
                      {((presenca.ausenciasJustificadas / presenca.totalSessoesDeliberativasConvocadas) * 100).toFixed(1)}% (licenças/missões)
                    </span>
                  </div>

                  {/* Componente 3: Ausências Não Justificadas */}
                  <div className="p-3 bg-white border border-stone-300 rounded shadow-2xs space-y-0.5">
                    <div className="flex items-center gap-1.5 text-rose-900 font-semibold text-xs">
                      <span className="w-2.5 h-2.5 bg-rose-600 rounded-xs" aria-hidden="true" />
                      <span>3. Não Justificadas</span>
                    </div>
                    <div className="font-mono text-lg font-bold text-stone-900 tabular-nums">
                      {presenca.ausenciasNaoJustificadas}
                    </div>
                    <span className="text-[10px] text-rose-700 block font-medium">
                      {((presenca.ausenciasNaoJustificadas / presenca.totalSessoesDeliberativasConvocadas) * 100).toFixed(1)}% faltas sem abono
                    </span>
                  </div>
                </div>

                {/* Barra Segmentada Proporcional */}
                <div className="space-y-1">
                  <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden flex" role="progressbar" aria-valuenow={presenca.percentualComparecimentoOuJustificado} aria-valuemin={0} aria-valuemax={100}>
                    <div
                      className="bg-stone-900 h-full"
                      style={{ width: `${presenca.percentualPresencaEstrita}%` }}
                      title={`Presenças Confirmadas: ${presenca.presencasConfirmadas} (${presenca.percentualPresencaEstrita.toFixed(1)}%)`}
                    />
                    <div
                      className="bg-stone-500 h-full"
                      style={{
                        width: `${(presenca.ausenciasJustificadas / presenca.totalSessoesDeliberativasConvocadas) * 100}%`,
                      }}
                      title={`Ausências Justificadas: ${presenca.ausenciasJustificadas} (${(((presenca.ausenciasJustificadas / presenca.totalSessoesDeliberativasConvocadas) * 100)).toFixed(1)}%)`}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{
                        width: `${(presenca.ausenciasNaoJustificadas / presenca.totalSessoesDeliberativasConvocadas) * 100}%`,
                      }}
                      title={`Ausências Não Justificadas: ${presenca.ausenciasNaoJustificadas} (${(((presenca.ausenciasNaoJustificadas / presenca.totalSessoesDeliberativasConvocadas) * 100)).toFixed(1)}%)`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-stone-500">
                    <span>0 sessões</span>
                    <span className="font-semibold text-stone-700">Denominador: {presenca.totalSessoesDeliberativasConvocadas} sessões convocadas</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Explicação e link da API */}
            <div className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded border border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p>{presenca.explicacaoMetodologica}</p>
              <a
                href={presenca.fonte.urlOficial}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-stone-700 underline hover:text-stone-900 inline-flex items-center gap-1 font-medium"
              >
                Endpoint API de Presenças da Casa <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 3. AS ÚLTIMAS 20 VOTAÇÕES NOMINAIS (CÂMARA / SENADO) */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-lg font-serif font-semibold text-stone-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-stone-700" aria-hidden="true" />
              Últimas 20 Votações Nominais de Maior Repercussão
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Exibição lado a lado: voto do parlamentar, orientação da bancada partidária e orientação do governo na época.
            </p>
          </div>

          {/* Filtro por alinhamento */}
          {ultimas20Votacoes.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-stone-500 font-medium">Filtrar:</span>
              <div className="flex rounded border border-stone-200 p-0.5 bg-stone-50">
                <button
                  type="button"
                  onClick={() => setFiltroAlinhamento('TODOS')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    filtroAlinhamento === 'TODOS' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Todas (20)
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroAlinhamento('COM_GOVERNO')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    filtroAlinhamento === 'COM_GOVERNO' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Com Governo
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroAlinhamento('CONTRA_GOVERNO')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    filtroAlinhamento === 'CONTRA_GOVERNO' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Contra Governo
                </button>
              </div>
            </div>
          )}
        </div>

        {ultimas20Votacoes.length === 0 ? (
          <div className="p-5 text-center bg-stone-50 rounded border border-dashed border-stone-200">
            <p className="text-sm font-medium text-stone-700">
              Votações nominais não disponíveis para este candidato.
            </p>
            <p className="text-xs text-stone-500 mt-1 max-w-xl mx-auto">
              Candidato não exerceu mandato parlamentar federal com voto em plenário na Câmara dos Deputados ou Senado Federal no período analisado.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {votacoesFiltradas.map((votacao, idx) => {
              const votoMeta = VOTO_FORMATO[votacao.votoCandidato] || VOTO_FORMATO.NAO_APLICAVEL;
              const expandido = votacaoExpandida === votacao.idVotacao;

              return (
                <article
                  key={votacao.idVotacao}
                  className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/40 hover:bg-stone-50 transition-colors space-y-2.5"
                >
                  {/* Linha superior: Proposição, Data, Voto */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-stone-900">
                          {votacao.siglaTipoProposicao} {votacao.numeroProposicao}
                        </span>
                        <span className="text-stone-300" aria-hidden="true">·</span>
                        <span className="text-xs font-medium text-stone-800">
                          {votacao.tituloResumido}
                        </span>
                        <span className="text-stone-300" aria-hidden="true">·</span>
                        <time className="text-[11px] text-stone-500 tabular-nums">
                          {votacao.dataHora}
                        </time>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-1">
                        {votacao.ementaOficial}
                      </p>
                    </div>

                    {/* Voto dado pelo Parlamentar */}
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[11px] text-stone-500 uppercase">Voto:</span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border ${votoMeta.bg} ${votoMeta.text} ${votoMeta.border}`}>
                        {votoMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* Linha de Orientações e Comparação */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-200/70 text-xs">
                    {/* Orientação do Partido */}
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Orientação Bancada</span>
                      <span className="font-semibold text-stone-800">
                        {votacao.orientacaoPartido}
                      </span>
                      <span className="block text-[10px] text-stone-500 mt-0.5">
                        {votacao.alinhouComPartido ? 'Seguiu a bancada' : 'Votou divergente'}
                      </span>
                    </div>

                    {/* Orientação do Governo */}
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Orientação Governo</span>
                      <span className="font-semibold text-stone-800">
                        {votacao.orientacaoGoverno}
                      </span>
                      <span className="block text-[10px] text-stone-500 mt-0.5">
                        {votacao.alinhouComGoverno ? 'Com o governo' : 'Contra o governo'}
                      </span>
                    </div>

                    {/* Placar Oficial */}
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Placar Geral</span>
                      <span className="font-mono text-stone-800 tabular-nums text-xs">
                        {votacao.placarOficial.sim} Sim · {votacao.placarOficial.nao} Não
                      </span>
                      <span className="block text-[10px] text-stone-500 mt-0.5">
                        {votacao.resultadoAprovado ? 'Aprovado' : 'Rejeitado'}
                      </span>
                    </div>

                    {/* Ações e Critérios */}
                    <div className="bg-white p-2 rounded border border-stone-200 flex flex-col justify-between">
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Rastreabilidade</span>
                      <div className="flex items-center justify-between mt-1">
                        <a
                          href={votacao.urlOficialVotacao}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-stone-800 underline hover:text-stone-950 inline-flex items-center gap-1 font-medium"
                        >
                          Ver no portal <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setVotacaoExpandida(expandido ? null : votacao.idVotacao)}
                          className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-0.5"
                        >
                          {expandido ? 'Menos' : 'Detalhes'}
                          {expandido ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes expandidos: Ementa completa e Critérios de Repercussão C1-C5 */}
                  {expandido && (
                    <div className="p-3 bg-white border border-stone-200 rounded text-xs space-y-2 mt-2">
                      <div>
                        <strong className="text-stone-800 block mb-0.5">Ementa Oficial Completa:</strong>
                        <p className="text-stone-600 leading-relaxed">{votacao.ementaOficial}</p>
                      </div>

                      {votacao.criteriosRepercussao && votacao.criteriosRepercussao.length > 0 && (
                        <div>
                          <strong className="text-stone-800 block mb-1">Critérios de Maior Repercussão Atendidos:</strong>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {votacao.criteriosRepercussao.map((c) => (
                              <span key={c} className="bg-stone-100 text-stone-700 text-[11px] px-2 py-0.5 rounded font-mono">
                                Critério {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-100 flex items-center justify-between">
                        <span>Casa: {CASA_NOMES[votacao.casa]}</span>
                        <span>Identificador único: {votacao.idVotacao}</span>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
