/**
 * Comparador Cívico — Até 4 candidatos do mesmo cargo ou UF.
 *
 * PRINCÍPIO DE NEUTRALIDADE OBRIGATÓRIO:
 * - Mesmas linhas rigorosamente idênticas para todos os candidatos.
 * - SEM vencedores, SEM notas, SEM selos, SEM cores de melhor/pior.
 */

import React from 'react';
import { Candidato } from '../types';
import { X, Scale, Landmark, Calendar, ExternalLink, AlertCircle } from 'lucide-react';

interface Props {
  candidatos: Candidato[];
  onRemover: (sqCandidato: string) => void;
  onLimpar: () => void;
  onVerDetalhes: (candidato: Candidato) => void;
}

export const Comparator: React.FC<Props> = ({
  candidatos,
  onRemover,
  onLimpar,
  onVerDetalhes,
}) => {
  if (candidatos.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-lg p-10 text-center max-w-2xl mx-auto space-y-3">
        <Scale className="w-10 h-10 text-stone-400 mx-auto" />
        <h3 className="text-lg font-serif font-semibold text-stone-900">
          Nenhum candidato selecionado para comparação
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
          Navegue pelas candidaturas ou acesse a seção "Minha Cédula" e clique em <strong>+ Comparar</strong> para comparar até 4 candidatos lado a lado com os mesmos critérios auditáveis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-stone-800" />
            Comparador Cívico e Auditável ({candidatos.length}/4)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Critérios idênticos lado a lado. Sem notas, sem rankings e sem juízo de valor.
          </p>
        </div>

        <button
          type="button"
          onClick={onLimpar}
          className="text-xs text-stone-600 hover:text-stone-900 underline font-medium"
        >
          Limpar comparação
        </button>
      </div>

      {/* Nota de Presunção de Inocência no topo do comparador */}
      <div className="p-3 bg-stone-100 border-l-4 border-stone-800 rounded-r text-xs text-stone-700">
        <strong>Aviso de Neutralidade:</strong> As linhas abaixo comparam apenas dados oficiais cadastrados no TSE, Câmara dos Deputados, Senado Federal e órgãos de controle externo. A existência de processos judiciais não implica culpa (art. 5º, LVII da CF/88).
      </div>

      <div className="overflow-x-auto border border-stone-200 rounded-lg bg-white">
        <table className="w-full text-left text-xs text-stone-700 border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th scope="col" className="p-4 w-44 font-semibold text-stone-600 uppercase tracking-wider text-[11px]">
                Critério Oficial
              </th>
              {candidatos.map((cand) => (
                <th key={cand.sqCandidato} scope="col" className="p-4 min-w-[240px] max-w-[280px] align-top">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-14 h-18 bg-stone-100 rounded border border-stone-200 overflow-hidden shrink-0">
                        <img
                          src={cand.fotoUrl}
                          alt={cand.nomeUrna}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemover(cand.sqCandidato)}
                        className="text-stone-400 hover:text-stone-700 p-1"
                        title="Remover do comparador"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm">{cand.nomeUrna}</h4>
                      <p className="font-mono font-bold text-stone-800 text-xs">Nº {cand.numeroUrna}</p>
                      <p className="text-stone-500 text-[11px]">{cand.partidoSigla} · {cand.uf}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onVerDetalhes(cand)}
                      className="text-[11px] font-medium text-stone-800 underline hover:text-stone-950 block"
                    >
                      Ver perfil completo
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-200">
            {/* Linha 1: Situação do Registro na Justiça Eleitoral */}
            <tr className="hover:bg-stone-50/50">
              <th scope="row" className="p-4 bg-stone-50/70 font-semibold text-stone-700 align-top">
                Situação do Registro (TSE)
              </th>
              {candidatos.map((cand) => (
                <td key={cand.sqCandidato} className="p-4 align-top">
                  <span className="font-semibold text-stone-900 block">{cand.situacaoRegistroTSE}</span>
                  <span className="text-[11px] text-stone-500 block mt-1 line-clamp-2">
                    {cand.motivoSituacaoRegistroTSE}
                  </span>
                </td>
              ))}
            </tr>

            {/* Linha 2: Mandatos Anteriores */}
            <tr className="hover:bg-stone-50/50">
              <th scope="row" className="p-4 bg-stone-50/70 font-semibold text-stone-700 align-top">
                Mandatos Anteriores
              </th>
              {candidatos.map((cand) => (
                <td key={cand.sqCandidato} className="p-4 align-top space-y-1">
                  {cand.mandatosAnteriores.length === 0 ? (
                    <span className="text-stone-500 italic">Sem mandato eletivo anterior registrado</span>
                  ) : (
                    <ul className="space-y-1">
                      {cand.mandatosAnteriores.map((m) => (
                        <li key={m.id} className="text-[11px] text-stone-800">
                          <strong>{m.cargo}</strong> ({m.partidoNaEpoca}) · {m.dataInicio.substring(0, 4)}–{m.dataFim.substring(0, 4)}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              ))}
            </tr>

            {/* Linha 3: Presença Parlamentar Recente (57ª Legislatura) */}
            <tr className="hover:bg-stone-50/50">
              <th scope="row" className="p-4 bg-stone-50/70 font-semibold text-stone-700 align-top">
                Presença Parlamentar Recente
              </th>
              {candidatos.map((cand) => (
                <td key={cand.sqCandidato} className="p-4 align-top">
                  {cand.presencaParlamentarRecente ? (
                    <div className="space-y-1">
                      <div className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                        {cand.presencaParlamentarRecente.percentualPresencaEstrita.toFixed(1)}% estrita
                      </div>
                      <div className="text-[11px] text-stone-600">
                        {cand.presencaParlamentarRecente.presencasConfirmadas} presenças / {cand.presencaParlamentarRecente.totalSessoesDeliberativasConvocadas} sessões
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Justificadas: {cand.presencaParlamentarRecente.ausenciasJustificadas} · Não just.: {cand.presencaParlamentarRecente.ausenciasNaoJustificadas}
                      </div>
                    </div>
                  ) : (
                    <span className="text-stone-500 italic">
                      Não se aplica (cargo executivo anterior ou sem mandato legislativo 2023–2026)
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Linha 4: Total de Bens Declarados */}
            <tr className="hover:bg-stone-50/50">
              <th scope="row" className="p-4 bg-stone-50/70 font-semibold text-stone-700 align-top">
                Patrimônio Declarado (2026)
              </th>
              {candidatos.map((cand) => (
                <td key={cand.sqCandidato} className="p-4 align-top">
                  <div className="font-mono text-sm font-bold text-stone-900 tabular-nums">
                    R$ {cand.totalBensDeclarados2026.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    {cand.itensBensDeclarados.length} itens discriminados
                  </span>
                </td>
              ))}
            </tr>

            {/* Linha 5: Processos Judiciais e Órgãos de Controle */}
            <tr className="hover:bg-stone-50/50">
              <th scope="row" className="p-4 bg-stone-50/70 font-semibold text-stone-700 align-top">
                Processos e TCU Cadirreg
              </th>
              {candidatos.map((cand) => (
                <td key={cand.sqCandidato} className="p-4 align-top space-y-1.5">
                  <div className="text-[11px]">
                    <span className="font-semibold block text-stone-800">
                      TCU Cadirreg: {cand.elegibilidadeControle.tcuCadirreg.consta ? 'Consta na lista' : 'Não consta'}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-700">
                    <span className="font-semibold block">Processos mapeados:</span>
                    {cand.processosJudiciais.length === 0 ? (
                      <span className="text-stone-500 italic">Certidões criminais negativas</span>
                    ) : (
                      <ul className="space-y-1 mt-1">
                        {cand.processosJudiciais.map((p) => (
                          <li key={p.id} className="p-1.5 bg-stone-50 rounded border border-stone-200">
                            <span className="font-mono font-medium block text-stone-900">{p.numeroCnj}</span>
                            <span className="text-stone-600 block">{p.faseProcessualDescricao}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Linha 6: Grau de Instrução e Ocupação */}
            <tr className="hover:bg-stone-50/50">
              <th scope="row" className="p-4 bg-stone-50/70 font-semibold text-stone-700 align-top">
                Ocupação e Instrução
              </th>
              {candidatos.map((cand) => (
                <td key={cand.sqCandidato} className="p-4 align-top text-xs space-y-1">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Ocupação:</span>
                    <strong className="text-stone-800 font-medium">{cand.ocupacaoDeclarada}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">Escolaridade:</span>
                    <span className="text-stone-700">{cand.grauInstrucao}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Linha 7: Posicionamento na PEC da Blindagem */}
            <tr className="hover:bg-stone-50/50 bg-stone-50/30">
              <th scope="row" className="p-4 bg-stone-50/70 font-semibold text-stone-700 align-top">
                PEC da Blindagem (Prerrogativas)
              </th>
              {candidatos.map((cand) => {
                const tema = cand.posicionamentosTemas.find((t) => t.temaId === 'PEC_BLINDAGEM');
                return (
                  <td key={cand.sqCandidato} className="p-4 align-top space-y-1">
                    {tema ? (
                      <>
                        <span
                          className={`font-bold text-xs block ${
                            tema.posicaoCandidato === 'FAVORAVEL'
                              ? 'text-amber-900'
                              : tema.posicaoCandidato === 'CONTRARIO'
                              ? 'text-emerald-900'
                              : 'text-stone-700'
                          }`}
                        >
                          {tema.posicaoRotulo}
                        </span>
                        <p className="text-[11px] text-stone-600 leading-snug">{tema.detalheAcao}</p>
                        <span className="text-[10px] text-stone-400 block pt-0.5">
                          Partido: {tema.posicaoPartidoNaEpoca}
                        </span>
                      </>
                    ) : (
                      <span className="text-stone-400 italic">Sem registro</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Linha 8: Posicionamento no Fim da Escala 6x1 */}
            <tr className="hover:bg-stone-50/50 bg-stone-50/30">
              <th scope="row" className="p-4 bg-stone-50/70 font-semibold text-stone-700 align-top">
                Fim da Escala 6x1 (36h semanais)
              </th>
              {candidatos.map((cand) => {
                const tema = cand.posicionamentosTemas.find((t) => t.temaId === 'FIM_ESCALA_6X1');
                return (
                  <td key={cand.sqCandidato} className="p-4 align-top space-y-1">
                    {tema ? (
                      <>
                        <span
                          className={`font-bold text-xs block ${
                            tema.posicaoCandidato === 'FAVORAVEL' || tema.posicaoCandidato === 'ASSINOU_PROPOSTA'
                              ? 'text-emerald-900'
                              : tema.posicaoCandidato === 'CONTRARIO'
                              ? 'text-rose-900'
                              : 'text-stone-700'
                          }`}
                        >
                          {tema.posicaoRotulo}
                        </span>
                        <p className="text-[11px] text-stone-600 leading-snug">{tema.detalheAcao}</p>
                        <span className="text-[10px] text-stone-400 block pt-0.5">
                          Partido: {tema.posicaoPartidoNaEpoca}
                        </span>
                      </>
                    ) : (
                      <span className="text-stone-400 italic">Sem registro</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Linha 9: Menções em Apurações / Escândalos Noticiados */}
            <tr className="hover:bg-stone-50/50">
              <th scope="row" className="p-4 bg-stone-50/70 font-semibold text-stone-700 align-top">
                Apurações / Noticiário
              </th>
              {candidatos.map((cand) => (
                <td key={cand.sqCandidato} className="p-4 align-top text-xs space-y-1.5">
                  {cand.noticiarioInvestigacoes.length === 0 ? (
                    <span className="text-stone-500 italic text-[11px]">
                      Nenhuma menção em escândalos noticiados ou apurações de repercussão.
                    </span>
                  ) : (
                    <ul className="space-y-1.5">
                      {cand.noticiarioInvestigacoes.map((item) => (
                        <li key={item.id} className="p-2 bg-stone-50 rounded border border-stone-200 space-y-0.5">
                          <strong className="text-[11px] text-stone-900 block leading-tight">{item.tituloNoticia}</strong>
                          <span className="text-[10px] text-stone-500 block">{item.veiculo} ({item.dataPublicacao})</span>
                          <span className="text-[10px] text-amber-900 font-medium block">Status: {item.statusJuridicoAtual}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
