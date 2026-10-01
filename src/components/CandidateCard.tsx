/**
 * Cartão de Candidato — Neutro, sem rankings, sem selos morais.
 * Segue a regra do zero-pill: metadados limpos sem cápsulas coloridas.
 */

import React from 'react';
import { Candidato } from '../types';
import { Scale, Landmark, ChevronRight, Check, Newspaper, AlertCircle, ShieldCheck } from 'lucide-react';

interface Props {
  candidato: Candidato;
  onSelecionar: (candidato: Candidato) => void;
  noComparador?: boolean;
  onAlternarComparador?: (candidato: Candidato) => void;
  podeAdicionarComparador?: boolean;
}

const CARGO_NOMES: Record<string, string> = {
  PRESIDENTE: 'Presidente da República',
  VICE_PRESIDENTE: 'Vice-Presidente',
  GOVERNADOR: 'Governador de Estado',
  VICE_GOVERNADOR: 'Vice-Governador',
  SENADOR: 'Senador da República',
  SUPLENTE_1: '1º Suplente de Senador',
  SUPLENTE_2: '2º Suplente de Senador',
  DEPUTADO_FEDERAL: 'Deputado Federal',
  DEPUTADO_ESTADUAL: 'Deputado Estadual',
  DEPUTADO_DISTRITAL: 'Deputado Distrital',
};

const SITUACAO_LABELS: Record<string, { label: string; text: string }> = {
  DEFERIDO: { label: 'Registro Deferido', text: 'text-stone-800' },
  DEFERIDO_COM_RECURSO: { label: 'Deferido com Recurso (Não definitivo)', text: 'text-amber-900' },
  AGUARDANDO_JULGAMENTO: { label: 'Aguardando Julgamento', text: 'text-stone-600' },
  INDEFERIDO: { label: 'Registro Indeferido', text: 'text-rose-900' },
  INDEFERIDO_COM_RECURSO: { label: 'Indeferido com Recurso', text: 'text-rose-900' },
  RENUNCIA: { label: 'Renúncia', text: 'text-stone-500' },
  CANCELADO: { label: 'Registro Cancelado', text: 'text-stone-500' },
  CASSADO: { label: 'Registro Cassado', text: 'text-rose-900' },
};

export const CandidateCard: React.FC<Props> = ({
  candidato,
  onSelecionar,
  noComparador,
  onAlternarComparador,
  podeAdicionarComparador,
}) => {
  const situacao = SITUACAO_LABELS[candidato.situacaoRegistroTSE] || {
    label: candidato.situacaoRegistroTSE,
    text: 'text-stone-800',
  };

  // Identificação do status judicial para marcação precisa (Réu / Condenado / Absolvido / Negativo)
  const temReu = candidato.processosJudiciais.some(
    (p) => p.faseProcessual === 'REU' || p.poloProcessual === 'REU'
  );
  const temCondenacao = candidato.processosJudiciais.find(
    (p) =>
      p.faseProcessual === 'SENTENCA_1A_INSTANCIA' ||
      p.faseProcessual === 'CONDENACAO_COLEGIADA' ||
      p.faseProcessual === 'TRANSITO_EM_JULGADO'
  );
  const temArquivadoOuAbsolvido =
    !temReu &&
    !temCondenacao &&
    candidato.processosJudiciais.some((p) => p.faseProcessual === 'ABSOLVICAO_OU_ARQUIVAMENTO');

  // Posicionamentos nas duas pautas solicitadas
  const posPecBlindagem = candidato.posicionamentosTemas.find((t) => t.temaId === 'PEC_BLINDAGEM');
  const posEscala6x1 = candidato.posicionamentosTemas.find((t) => t.temaId === 'FIM_ESCALA_6X1');

  return (
    <article className="border border-stone-200 rounded-lg p-5 bg-white hover:border-stone-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Cabeçalho com foto e identificação */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-20 bg-stone-100 rounded overflow-hidden shrink-0 border border-stone-200">
            <img
              src={candidato.fotoUrl}
              alt={`Foto oficial de registro eleitoral de ${candidato.nomeUrna}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold text-stone-900 truncate">
                {candidato.nomeUrna}
              </h3>
              <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
                {candidato.numeroUrna}
              </span>
            </div>

            <p className="text-xs text-stone-500 truncate">
              {candidato.nomeCivilNormalizado}
            </p>

            {/* Metadados sem cápsulas pill */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600 flex-wrap">
              <span className="font-semibold text-stone-800">{candidato.partidoSigla}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{CARGO_NOMES[candidato.cargo] || candidato.cargo} ({candidato.uf})</span>
            </div>
          </div>
        </div>

        {/* Linha de Situação na Justiça Eleitoral */}
        <div className="pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-500">Justiça Eleitoral:</span>
            <span className={`font-medium ${situacao.text}`}>
              {situacao.label}
            </span>
          </div>
        </div>

        {/* MARCAÇÕES EM PAUTAS CRUCIAIS: PEC DA BLINDAGEM E ESCALA 6X1 */}
        <div className="p-2.5 bg-stone-50 rounded border border-stone-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-stone-500 font-medium">PEC da Blindagem:</span>
            {posPecBlindagem ? (
              <span
                className={`font-semibold text-[11px] ${
                  posPecBlindagem.posicaoCandidato === 'FAVORAVEL'
                    ? 'text-amber-900'
                    : posPecBlindagem.posicaoCandidato === 'CONTRARIO'
                    ? 'text-emerald-900'
                    : 'text-stone-600'
                }`}
              >
                {posPecBlindagem.posicaoRotulo}
              </span>
            ) : (
              <span className="text-stone-400">Sem registro</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-stone-500 font-medium">Fim da Escala 6x1:</span>
            {posEscala6x1 ? (
              <span
                className={`font-semibold text-[11px] ${
                  posEscala6x1.posicaoCandidato === 'FAVORAVEL' || posEscala6x1.posicaoCandidato === 'ASSINOU_PROPOSTA'
                    ? 'text-emerald-900'
                    : posEscala6x1.posicaoCandidato === 'CONTRARIO'
                    ? 'text-rose-900'
                    : 'text-stone-600'
                }`}
              >
                {posEscala6x1.posicaoRotulo}
              </span>
            ) : (
              <span className="text-stone-400">Sem registro</span>
            )}
          </div>
        </div>

        {/* MARCAÇÃO JUDICIAL EXPRESSA (RÉU / CONDENADO / ARQUIVADO / NEGATIVO) */}
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-stone-500">Situação Penal / Judicial:</span>
            {temReu ? (
              <span className="font-semibold text-[11px] text-amber-900 inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <AlertCircle className="w-3 h-3 text-amber-700" /> Réu em Ação Penal
              </span>
            ) : temCondenacao ? (
              <span className="font-semibold text-[11px] text-orange-950 inline-flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                <Scale className="w-3 h-3 text-orange-700" />
                {temCondenacao.faseProcessual === 'SENTENCA_1A_INSTANCIA'
                  ? 'Condenação 1ª Inst. (Recurso)'
                  : 'Condenação Colegiada'}
              </span>
            ) : temArquivadoOuAbsolvido ? (
              <span className="font-medium text-[11px] text-stone-700 inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded">
                <Scale className="w-3 h-3 text-stone-500" /> Extinto / Arquivado
              </span>
            ) : (
              <span className="font-medium text-[11px] text-stone-700 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500" /> Certidões Negativas
              </span>
            )}
          </div>

          {/* Menção em Escândalos / Noticiário de Repercussão */}
          {candidato.noticiarioInvestigacoes.length > 0 && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-stone-500">Apurações / Noticiário:</span>
              <span className="text-[11px] text-stone-800 font-medium inline-flex items-center gap-1">
                <Newspaper className="w-3 h-3 text-stone-500" />
                {candidato.noticiarioInvestigacoes.length} caso(s) (com outro lado)
              </span>
            </div>
          )}
        </div>

        {/* Resumo de Mandatos Anteriores e Bens */}
        <div className="space-y-1.5 text-xs text-stone-600 pt-1 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <span className="text-stone-500">Trajetória:</span>
            <span>
              {candidato.mandatosAnteriores.length > 0 ? (
                <span className="inline-flex items-center gap-1 text-stone-800">
                  <Landmark className="w-3.5 h-3.5 text-stone-500" />
                  {candidato.mandatosAnteriores.length} mandatos anteriores
                </span>
              ) : (
                'Primeira candidatura federal'
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-500">Bens declarados:</span>
            <span className="font-mono tabular-nums text-stone-800 font-medium">
              R$ {candidato.totalBensDeclarados2026.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Ações inferiores */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        {onAlternarComparador && (
          <button
            type="button"
            onClick={() => onAlternarComparador(candidato)}
            disabled={!noComparador && !podeAdicionarComparador}
            className={`text-xs px-2.5 py-1.5 rounded transition-colors flex items-center gap-1 ${
              noComparador
                ? 'bg-stone-800 text-white hover:bg-stone-900'
                : podeAdicionarComparador
                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                : 'bg-stone-50 text-stone-400 cursor-not-allowed'
            }`}
          >
            {noComparador ? (
              <>
                <Check className="w-3 h-3" /> No Comparador
              </>
            ) : (
              '+ Comparar'
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => onSelecionar(candidato)}
          className="text-xs font-medium text-stone-800 hover:text-stone-950 inline-flex items-center gap-1 ml-auto"
        >
          Ver Raio-X Completo <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
