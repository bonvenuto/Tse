/**
 * Visão dos Partidos e Federações — Eleições 2026.
 *
 * Exibe: FEFC 2026 oficial, Fundo Partidário, Bancadas,
 * Índice de Coesão de Rice, Alinhamento Médio ao Governo,
 * e posicionamento oficial e percentual de bancada na:
 * 1. PEC da Blindagem (Prerrogativas)
 * 2. PEC do Fim da Escala 6x1
 */

import React, { useState, useMemo } from 'react';
import { PARTIDOS_BASE } from '../data/partiesData';
import { PartidoInfo } from '../types';
import { Building2, ExternalLink, Info, Scale, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const PartyList: React.FC = () => {
  const [filtroPauta, setFiltroPauta] = useState<
    'TODOS' | 'BLINDAGEM_FAVOR' | 'BLINDAGEM_CONTRA' | 'ESCALA_FAVOR' | 'ESCALA_CONTRA'
  >('TODOS');
  const [partidoDetalhe, setPartidoDetalhe] = useState<string | null>(null);

  const partidosFiltrados = useMemo(() => {
    return PARTIDOS_BASE.filter((p) => {
      if (filtroPauta === 'BLINDAGEM_FAVOR') {
        return p.posicaoPecBlindagem.posicaoResumida === 'FAVORAVEL';
      }
      if (filtroPauta === 'BLINDAGEM_CONTRA') {
        return p.posicaoPecBlindagem.posicaoResumida === 'CONTRARIA';
      }
      if (filtroPauta === 'ESCALA_FAVOR') {
        return p.posicaoFimEscala6x1.posicaoResumida === 'FAVORAVEL';
      }
      if (filtroPauta === 'ESCALA_CONTRA') {
        return p.posicaoFimEscala6x1.posicaoResumida === 'CONTRARIA';
      }
      return true;
    });
  }, [filtroPauta]);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-stone-800" />
              Posicionamento Partidário e Recursos Públicos (Eleições 2026)
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Valores oficiais do FEFC 2026, Fundo Partidário, bancadas e posicionamentos na PEC da Blindagem e Fim da Escala 6x1.
            </p>
          </div>

          <span className="text-xs text-stone-500 font-mono">
            {partidosFiltrados.length} de {PARTIDOS_BASE.length} agremiações
          </span>
        </div>

        {/* Resumo Comparativo das Duas Pautas Cruciais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-stone-50 rounded border border-stone-200 space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-stone-900">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-stone-700" /> PEC da Blindagem (Prerrogativas)
              </span>
              <span className="text-[11px] text-stone-500 font-mono">PEC 3/2021 / PEC 28/2024</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Exige autorização prévia da Mesa Diretora para cumprimento de mandados de busca contra parlamentares e restringe prisões cautelares.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFiltroPauta(filtroPauta === 'BLINDAGEM_FAVOR' ? 'TODOS' : 'BLINDAGEM_FAVOR')}
                className={`text-[11px] px-2.5 py-1 rounded transition-colors border ${
                  filtroPauta === 'BLINDAGEM_FAVOR'
                    ? 'bg-amber-100 text-amber-950 border-amber-300 font-semibold'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                Partidos Favoráveis
              </button>
              <button
                type="button"
                onClick={() => setFiltroPauta(filtroPauta === 'BLINDAGEM_CONTRA' ? 'TODOS' : 'BLINDAGEM_CONTRA')}
                className={`text-[11px] px-2.5 py-1 rounded transition-colors border ${
                  filtroPauta === 'BLINDAGEM_CONTRA'
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                Partidos Contrários
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded border border-stone-200 space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-stone-900">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-stone-700" /> Fim da Escala 6x1 (36h Semanais)
              </span>
              <span className="text-[11px] text-stone-500 font-mono">PEC Erika Hilton</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Propõe extinguir a jornada 6x1 e limitar a carga de trabalho semanal a até 36 horas sem diminuição da remuneração salarial.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFiltroPauta(filtroPauta === 'ESCALA_FAVOR' ? 'TODOS' : 'ESCALA_FAVOR')}
                className={`text-[11px] px-2.5 py-1 rounded transition-colors border ${
                  filtroPauta === 'ESCALA_FAVOR'
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                Bancadas que Assinaram / Apoiam
              </button>
              <button
                type="button"
                onClick={() => setFiltroPauta(filtroPauta === 'ESCALA_CONTRA' ? 'TODOS' : 'ESCALA_CONTRA')}
                className={`text-[11px] px-2.5 py-1 rounded transition-colors border ${
                  filtroPauta === 'ESCALA_CONTRA'
                    ? 'bg-rose-100 text-rose-950 border-rose-300 font-semibold'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                Bancadas Contrárias
              </button>
            </div>
          </div>
        </div>

        {/* Metodologia dos indicadores partidários */}
        <div className="p-3 bg-stone-50/70 rounded border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed text-[11px]">
            <p>
              <strong>Critério Neutro:</strong> Os dados de apoio às PECs baseiam-se em registros regimentais nominais do Sistema de Votação da Câmara dos Deputados e na lista oficial de signatários da Mesa Diretora.
            </p>
            <p>
              <strong>Índice de Rice:</strong> Mede o grau de coesão interna da bancada (<code>|%Sim - %Não|</code>). 1.00 = 100% de unanimidade.
            </p>
          </div>
        </div>
      </div>

      {/* Tabela dos Partidos */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th scope="col" className="p-3.5">Partido / Federação</th>
                <th scope="col" className="p-3.5 text-center">Nº</th>
                <th scope="col" className="p-3.5">PEC da Blindagem</th>
                <th scope="col" className="p-3.5">Fim da Escala 6x1</th>
                <th scope="col" className="p-3.5 text-center">Bancadas</th>
                <th scope="col" className="p-3.5 text-right">FEFC 2026 (R$)</th>
                <th scope="col" className="p-3.5 text-center">Coesão (Rice)</th>
                <th scope="col" className="p-3.5 text-center">Alinhamento Gov.</th>
                <th scope="col" className="p-3.5 text-right">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {partidosFiltrados.map((partido) => {
                const aberto = partidoDetalhe === partido.sigla;
                return (
                  <React.Fragment key={partido.sigla}>
                    <tr className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3.5">
                        <strong className="text-sm text-stone-900 block">{partido.sigla}</strong>
                        <span className="text-stone-500 block truncate max-w-xs">{partido.nomeOficial}</span>
                        {partido.federacao && (
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            {partido.federacao}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center font-mono font-semibold text-stone-900 tabular-nums">
                        {partido.numero}
                      </td>

                      {/* Marcação da PEC da Blindagem */}
                      <td className="p-3.5">
                        <span
                          className={`font-semibold text-[11px] inline-flex items-center gap-1 ${
                            partido.posicaoPecBlindagem.posicaoResumida === 'FAVORAVEL'
                              ? 'text-amber-900'
                              : partido.posicaoPecBlindagem.posicaoResumida === 'CONTRARIA'
                              ? 'text-emerald-900'
                              : 'text-stone-600'
                          }`}
                        >
                          {partido.posicaoPecBlindagem.posicaoResumida === 'FAVORAVEL' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                          ) : partido.posicaoPecBlindagem.posicaoResumida === 'CONTRARIA' ? (
                            <XCircle className="w-3.5 h-3.5 text-emerald-700" />
                          ) : null}
                          {partido.posicaoPecBlindagem.orientacaoBancada}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          {partido.posicaoPecBlindagem.rotuloExibicao}
                        </span>
                      </td>

                      {/* Marcação da Proibição da Escala 6x1 */}
                      <td className="p-3.5">
                        <span
                          className={`font-semibold text-[11px] inline-flex items-center gap-1 ${
                            partido.posicaoFimEscala6x1.posicaoResumida === 'FAVORAVEL'
                              ? 'text-emerald-900'
                              : partido.posicaoFimEscala6x1.posicaoResumida === 'CONTRARIA'
                              ? 'text-rose-900'
                              : 'text-stone-600'
                          }`}
                        >
                          {partido.posicaoFimEscala6x1.posicaoResumida === 'FAVORAVEL' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          ) : partido.posicaoFimEscala6x1.posicaoResumida === 'CONTRARIA' ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-700" />
                          ) : null}
                          {partido.posicaoFimEscala6x1.orientacaoBancada}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          {partido.posicaoFimEscala6x1.rotuloExibicao}
                        </span>
                      </td>

                      <td className="p-3.5 text-center font-mono tabular-nums text-stone-800">
                        <div>{partido.bancadaCamara2026} dep.</div>
                        <div className="text-[10px] text-stone-400">{partido.bancadaSenado2026} sen.</div>
                      </td>

                      <td className="p-3.5 text-right font-mono font-semibold text-stone-900 tabular-nums">
                        R$ {partido.fefc2026Valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-3.5 text-center font-mono tabular-nums">
                        <span className="font-semibold text-stone-800">
                          {partido.indiceCoesaoRiceMedio.toFixed(2)}
                        </span>
                      </td>

                      <td className="p-3.5 text-center font-mono tabular-nums">
                        <span className="font-semibold text-stone-800">
                          {partido.alinhamentoGovernoMedio.toFixed(1)}%
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setPartidoDetalhe(aberto ? null : partido.sigla)}
                          className="inline-flex items-center gap-1 text-stone-700 hover:text-stone-950 font-medium underline text-xs"
                        >
                          {aberto ? 'Fechar' : 'Ver Posições'}
                          {aberto ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>

                    {/* Linha expansível com justificativas das posições partidárias */}
                    {aberto && (
                      <tr className="bg-stone-50/90 border-b border-stone-200">
                        <td colSpan={9} className="p-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-3 bg-white border border-stone-200 rounded space-y-1">
                              <span className="font-bold text-stone-900 block">
                                Posição Detalhada: PEC da Blindagem
                              </span>
                              <p className="text-stone-700 leading-relaxed text-[11px]">
                                {partido.posicaoPecBlindagem.descricao}
                              </p>
                              <div className="pt-1 flex items-center justify-between text-[10px] text-stone-500">
                                <span>Adesão estimada: {partido.posicaoPecBlindagem.percentualAdesao}% da bancada</span>
                                <a
                                  href={partido.posicaoPecBlindagem.urlFonte}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline text-stone-700 hover:text-stone-950 inline-flex items-center gap-0.5"
                                >
                                  Fonte Câmara <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>

                            <div className="p-3 bg-white border border-stone-200 rounded space-y-1">
                              <span className="font-bold text-stone-900 block">
                                Posição Detalhada: Fim da Escala 6x1
                              </span>
                              <p className="text-stone-700 leading-relaxed text-[11px]">
                                {partido.posicaoFimEscala6x1.descricao}
                              </p>
                              <div className="pt-1 flex items-center justify-between text-[10px] text-stone-500">
                                <span>Adesão estimada: {partido.posicaoFimEscala6x1.percentualAdesao}% da bancada</span>
                                <a
                                  href={partido.posicaoFimEscala6x1.urlFonte}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline text-stone-700 hover:text-stone-950 inline-flex items-center gap-0.5"
                                >
                                  Fonte Proposição <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-stone-200 text-[11px] text-stone-500">
                            <span>Fundo Partidário Anual: R$ {partido.fundoPartidarioAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            <div className="flex items-center gap-3">
                              <a
                                href={partido.urlEstatutoOficialTSE}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-stone-900 inline-flex items-center gap-1 font-medium"
                              >
                                Estatuto TSE <ExternalLink className="w-3 h-3" />
                              </a>
                              <a
                                href={partido.urlProgramaOficialTSE}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-stone-900 inline-flex items-center gap-1 font-medium"
                              >
                                Programa do Partido <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
