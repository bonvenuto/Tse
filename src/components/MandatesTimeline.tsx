/**
 * Componente de Histórico de Mandatos — Raio-X das Candidaturas 2026.
 *
 * Exibe uma timeline interativa com:
 * - Legislatura
 * - Cargo
 * - Partido na época
 * - Período (início, fim ou em exercício)
 * - Casa Legislativa (Câmara dos Deputados, Senado Federal, etc.)
 * - Link para a fonte original na API oficial (Câmara / Senado)
 * - Data e hora exatas da coleta automatizada
 */

import React, { useState } from 'react';
import { MandatoAnterior, CasaLegislativa } from '../types';
import { Landmark, Calendar, ExternalLink, Clock, ShieldCheck, ChevronRight, ListFilter, Building } from 'lucide-react';

interface Props {
  mandatos: MandatoAnterior[];
  cargoAtual: string;
}

const CASA_LABELS: Record<CasaLegislativa, { label: string; badge: string; iconBg: string }> = {
  CAMARA_DOS_DEPUTADOS: {
    label: 'Câmara dos Deputados',
    badge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-800',
  },
  SENADO_FEDERAL: {
    label: 'Senado Federal',
    badge: 'bg-sky-50 text-sky-900 border-sky-200',
    iconBg: 'bg-sky-100 text-sky-800',
  },
  ASSEMBLEIA_LEGISLATIVA: {
    label: 'Assembleia Legislativa Estadual',
    badge: 'bg-amber-50 text-amber-900 border-amber-200',
    iconBg: 'bg-amber-100 text-amber-800',
  },
  CAMARA_LEGISLATIVA_DF: {
    label: 'Câmara Legislativa do DF (CLDF)',
    badge: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    iconBg: 'bg-indigo-100 text-indigo-800',
  },
  CAMARA_MUNICIPAL: {
    label: 'Câmara Municipal de Vereadores',
    badge: 'bg-stone-100 text-stone-900 border-stone-300',
    iconBg: 'bg-stone-200 text-stone-800',
  },
  PODER_EXECUTIVO: {
    label: 'Poder Executivo (Chefia/Ministério)',
    badge: 'bg-purple-50 text-purple-900 border-purple-200',
    iconBg: 'bg-purple-100 text-purple-800',
  },
};

export const MandatesTimeline: React.FC<Props> = ({ mandatos, cargoAtual }) => {
  const [mandatoSelecionadoId, setMandatoSelecionadoId] = useState<string | null>(
    mandatos.length > 0 ? mandatos[0].id : null
  );
  const [filtroCasa, setFiltroCasa] = useState<string>('TODAS');
  const [modoExibicao, setModoExibicao] = useState<'TIMELINE' | 'TABELA'>('TIMELINE');

  // Ordenação cronológica decrescente (mais recente primeiro)
  const mandatosOrdenados = [...mandatos].sort((a, b) => {
    return b.dataInicio.localeCompare(a.dataInicio);
  });

  const mandatosFiltrados = filtroCasa === 'TODAS'
    ? mandatosOrdenados
    : mandatosOrdenados.filter((m) => m.casaLegislativa === filtroCasa);

  const mandatoSelecionado = mandatos.find((m) => m.id === mandatoSelecionadoId) || mandatosFiltrados[0];

  if (mandatos.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-lg p-8 text-center space-y-3">
        <Landmark className="w-10 h-10 text-stone-400 mx-auto" />
        <h3 className="text-base font-serif font-semibold text-stone-900">
          Primeira Candidatura Federal / Sem Mandatos Eletivos Anteriores
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
          Esta candidatura não possui registros prévios de exercício parlamentar na Câmara dos Deputados ou no Senado Federal nas bases oficiais sincronizadas do Congresso Nacional e do TSE.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white border border-stone-200 rounded-lg p-6 space-y-6" aria-labelledby="timeline-mandatos-titulo">
      {/* Cabeçalho do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h3 id="timeline-mandatos-titulo" className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-stone-800" />
            Histórico de Mandatos Eletivos — Timeline Interativa
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Trajetória parlamentar oficial extraída das APIs da Câmara dos Deputados e do Senado Federal.
          </p>
        </div>

        {/* Alternância de Modo (Timeline visual vs Tabela tabular) */}
        <div className="flex items-center gap-2">
          <div className="flex rounded border border-stone-200 p-0.5 bg-stone-50 text-xs">
            <button
              type="button"
              onClick={() => setModoExibicao('TIMELINE')}
              className={`px-3 py-1 font-medium rounded transition-colors ${
                modoExibicao === 'TIMELINE' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Timeline Visual
            </button>
            <button
              type="button"
              onClick={() => setModoExibicao('TABELA')}
              className={`px-3 py-1 font-medium rounded transition-colors ${
                modoExibicao === 'TABELA' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tabela Completa
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Filtros por Casa Legislativa */}
      <div className="flex items-center justify-between gap-3 flex-wrap text-xs pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-stone-500 font-medium">Filtrar Casa:</span>
          <button
            type="button"
            onClick={() => setFiltroCasa('TODAS')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              filtroCasa === 'TODAS'
                ? 'bg-stone-800 text-white border-stone-800 font-medium'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            Todas as Casas ({mandatos.length})
          </button>

          {Array.from(new Set(mandatos.map((m) => m.casaLegislativa))).map((casa) => {
            const labelMeta = CASA_LABELS[casa] || { label: casa };
            return (
              <button
                key={casa}
                type="button"
                onClick={() => setFiltroCasa(casa)}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  filtroCasa === casa
                    ? 'bg-stone-800 text-white border-stone-800 font-medium'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {labelMeta.label}
              </button>
            );
          })}
        </div>

        <span className="text-stone-400 font-mono text-[11px]">
          {mandatosFiltrados.length} mandato(s) listado(s)
        </span>
      </div>

      {/* MODO 1: TIMELINE INTERATIVA */}
      {modoExibicao === 'TIMELINE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Lado Esquerdo: Linha do tempo visual */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {mandatosFiltrados.map((mand, idx) => {
                const casaMeta = CASA_LABELS[mand.casaLegislativa] || {
                  label: mand.casaLegislativa,
                  badge: 'bg-stone-100 text-stone-800 border-stone-200',
                  iconBg: 'bg-stone-200 text-stone-700',
                };
                const selecionado = mandatoSelecionado?.id === mand.id;
                const emExercicio = mand.dataFim === 'Em exercício';

                return (
                  <div
                    key={mand.id}
                    className={`relative cursor-pointer transition-all ${
                      selecionado ? 'scale-[1.01]' : 'opacity-85 hover:opacity-100'
                    }`}
                    onClick={() => setMandatoSelecionadoId(mand.id)}
                  >
                    {/* Marcador na linha do tempo */}
                    <div
                      className={`absolute -left-6 top-3.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selecionado
                          ? 'bg-stone-900 border-white ring-2 ring-stone-900 shadow-xs'
                          : 'bg-stone-100 border-stone-300'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${selecionado ? 'bg-white' : 'bg-stone-400'}`} />
                    </div>

                    {/* Card do Mandato na Timeline */}
                    <article
                      className={`p-4 rounded-lg border transition-all ${
                        selecionado
                          ? 'bg-white border-stone-900 shadow-xs ring-1 ring-stone-900'
                          : 'bg-stone-50/70 border-stone-200 hover:border-stone-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${casaMeta.badge}`}>
                              {casaMeta.label}
                            </span>
                            {emExercicio && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                                Em exercício
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-stone-900">
                            {mand.cargo}
                          </h4>
                        </div>

                        <span className="font-mono text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-1 rounded">
                          {mand.legislatura || 'Mandato'}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center gap-3 text-xs text-stone-600 flex-wrap">
                        <div>
                          <span className="text-stone-400">Partido:</span>{' '}
                          <strong className="text-stone-900">{mand.partidoNaEpoca}</strong>
                        </div>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <div>
                          <span className="text-stone-400">UF:</span>{' '}
                          <span className="font-medium text-stone-800">{mand.uf}</span>
                        </div>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <div className="font-mono text-[11px] text-stone-700">
                          {mand.dataInicio} → {mand.dataFim}
                        </div>
                      </div>

                      {mand.motivoTermino && (
                        <p className="text-[11px] text-stone-500 mt-2 italic border-t border-stone-100 pt-1.5">
                          Status: {mand.motivoTermino}
                        </p>
                      )}
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lado Direito: Painel de Auditoria e Detalhes da Fonte Oficial do Mandato Selecionado */}
          <div className="lg:col-span-5">
            {mandatoSelecionado ? (
              <div className="p-5 bg-stone-50 rounded-lg border border-stone-200 space-y-4 sticky top-6">
                <div className="border-b border-stone-200 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block mb-1">
                    Auditoria do Mandato Selecionado
                  </span>
                  <h4 className="text-base font-bold text-stone-900">
                    {mandatoSelecionado.cargo} ({mandatoSelecionado.legislatura || 'Exercício'})
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {CASA_LABELS[mandatoSelecionado.casaLegislativa]?.label || mandatoSelecionado.casaLegislativa} · {mandatoSelecionado.uf}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Agremiação Partidária:</span>
                    <strong className="text-stone-900 text-sm font-semibold">{mandatoSelecionado.partidoNaEpoca}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-white rounded border border-stone-200">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Data de Início</span>
                      <span className="font-mono font-semibold text-stone-900">{mandatoSelecionado.dataInicio}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-stone-200">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Data de Término</span>
                      <span className="font-mono font-semibold text-stone-900">{mandatoSelecionado.dataFim}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[11px]">Motivo do Encerramento:</span>
                    <span className="text-stone-800">{mandatoSelecionado.motivoTermino || 'Término regular da legislatura'}</span>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[11px]">Identificador do Parlamentar na Casa:</span>
                    <code className="font-mono text-stone-900 bg-stone-200/70 px-1.5 py-0.5 rounded text-[11px]">
                      {mandatoSelecionado.idExternoCasa}
                    </code>
                  </div>
                </div>

                {/* Metadados da API Oficial */}
                <div className="pt-3 border-t border-stone-200 text-[11px] text-stone-600 space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                    <ShieldCheck className="w-4 h-4 text-stone-700" />
                    <span>Rastreabilidade da API Oficial:</span>
                  </div>
                  <div className="space-y-1 bg-white p-2.5 rounded border border-stone-200 font-mono text-[10px] text-stone-600 break-all">
                    <div>Fonte: {mandatoSelecionado.fonte.nomeFonte}</div>
                    <div>Data/Hora da Coleta: {mandatoSelecionado.fonte.dataColeta}</div>
                    <div>Licença: {mandatoSelecionado.fonte.licenca}</div>
                  </div>

                  <a
                    href={mandatoSelecionado.urlPerfilOficial}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors mt-2"
                  >
                    Acessar perfil oficial na {CASA_LABELS[mandatoSelecionado.casaLegislativa]?.label || 'Casa'} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* MODO 2: TABELA TABULAR */}
      {modoExibicao === 'TABELA' && (
        <div className="overflow-x-auto border border-stone-200 rounded-lg">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th scope="col" className="p-3">Cargo / Mandato</th>
                <th scope="col" className="p-3">Casa Legislativa</th>
                <th scope="col" className="p-3">Legislatura</th>
                <th scope="col" className="p-3">Partido na Época</th>
                <th scope="col" className="p-3">Período de Exercício</th>
                <th scope="col" className="p-3">Motivo Término</th>
                <th scope="col" className="p-3 text-right">Fonte Original</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {mandatosFiltrados.map((mand) => (
                <tr key={mand.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-3 font-semibold text-stone-900">{mand.cargo}</td>
                  <td className="p-3 text-stone-600">{CASA_LABELS[mand.casaLegislativa]?.label || mand.casaLegislativa} ({mand.uf})</td>
                  <td className="p-3 font-mono">{mand.legislatura || '—'}</td>
                  <td className="p-3 font-semibold text-stone-800">{mand.partidoNaEpoca}</td>
                  <td className="p-3 font-mono text-stone-700">{mand.dataInicio} até {mand.dataFim}</td>
                  <td className="p-3 text-stone-500">{mand.motivoTermino || 'Término regular'}</td>
                  <td className="p-3 text-right">
                    <a
                      href={mand.urlPerfilOficial}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-stone-800 underline hover:text-stone-950 font-medium"
                    >
                      Ver autos <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
