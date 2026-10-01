/**
 * Visualização Completa do Perfil do Candidato — Raio-X 2026.
 * Neutro, auditável e 100% ancorado em fontes oficiais.
 */

import React, { useState } from 'react';
import { Candidato } from '../types';
import { ParliamentaryHistoryModule } from './ParliamentaryHistoryModule';
import { JudicialProcessesModule } from './JudicialProcessesModule';
import { MandatesTimeline } from './MandatesTimeline';
import {
  ArrowLeft,
  ExternalLink,
  Download,
  MessageSquareQuote,
  ShieldCheck,
  FileText,
  TrendingUp,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Newspaper,
  Scale
} from 'lucide-react';

interface Props {
  candidato: Candidato;
  onVoltar: () => void;
  onAbrirCorrecao: (candidato: Candidato) => void;
  onAbrirAuditJson: (candidato: Candidato) => void;
  onSelecionarOutroCandidato?: (sqCandidato: string) => void;
}

const CARGO_NOMES: Record<string, string> = {
  PRESIDENTE: 'Presidente da República',
  VICE_PRESIDENTE: 'Vice-Presidente da República',
  GOVERNADOR: 'Governador de Estado',
  VICE_GOVERNADOR: 'Vice-Governador de Estado',
  SENADOR: 'Senador da República',
  SUPLENTE_1: '1º Suplente de Senador',
  SUPLENTE_2: '2º Suplente de Senador',
  DEPUTADO_FEDERAL: 'Deputado Federal',
  DEPUTADO_ESTADUAL: 'Deputado Estadual',
  DEPUTADO_DISTRITAL: 'Deputado Distrital',
};

const SITUACAO_INFO: Record<string, { label: string; explicacao: string; bg: string; text: string; border: string }> = {
  DEFERIDO: {
    label: 'Candidatura Deferida',
    explicacao: 'Candidatura regular, com dados e certidões aprovados pela Justiça Eleitoral.',
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
  },
  DEFERIDO_COM_RECURSO: {
    label: 'Deferido com Recurso (Não definitivo)',
    explicacao: 'Candidatura deferida pela instância regional, porém com recurso pendente de julgamento no TSE.',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
  },
  AGUARDANDO_JULGAMENTO: {
    label: 'Aguardando Julgamento',
    explicacao: 'Pedido de registro protocolado dentro do prazo e ainda em análise pela Justiça Eleitoral.',
    bg: 'bg-stone-100',
    text: 'text-stone-800',
    border: 'border-stone-300',
  },
  INDEFERIDO: {
    label: 'Candidatura Indeferida',
    explicacao: 'Registro não aceito pela Justiça Eleitoral por ausência de condição de elegibilidade ou causa de inelegibilidade.',
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    border: 'border-rose-200',
  },
  INDEFERIDO_COM_RECURSO: {
    label: 'Indeferido com Recurso',
    explicacao: 'Registro indeferido, com recurso interposto pelo candidato perante instância superior.',
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    border: 'border-rose-200',
  },
  RENUNCIA: {
    label: 'Renúncia Homologada',
    explicacao: 'O candidato desistiu formalmente de disputar o pleito eleitoral.',
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-300',
  },
  CANCELADO: {
    label: 'Registro Cancelado',
    explicacao: 'Cancelamento decorrente de decisão judicial ou cancelamento partidário.',
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-300',
  },
  CASSADO: {
    label: 'Registro Cassado',
    explicacao: 'Cassação em ação eleitoral específica por abuso de poder ou ilícito correlato.',
    bg: 'bg-rose-100',
    text: 'text-rose-950',
    border: 'border-rose-300',
  },
};

export const CandidateProfile: React.FC<Props> = ({
  candidato,
  onVoltar,
  onAbrirCorrecao,
  onAbrirAuditJson,
  onSelecionarOutroCandidato,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<
    | 'ATUACAO_PARLAMENTAR'
    | 'HISTORICO_MANDATOS'
    | 'INFORMACOES_JUDICIAIS'
    | 'ESCANDALOS_E_NOTICIARIO'
    | 'DADOS_REGISTRO'
    | 'PROPOSTA_E_BENS'
    | 'ATUACAO_E_MANDATOS'
    | 'PROCESSOS_E_CONTROLE'
  >('ATUACAO_PARLAMENTAR');

  const situacao = SITUACAO_INFO[candidato.situacaoRegistroTSE] || {
    label: candidato.situacaoRegistroTSE,
    explicacao: candidato.motivoSituacaoRegistroTSE,
    bg: 'bg-stone-100',
    text: 'text-stone-800',
    border: 'border-stone-300',
  };

  // Posicionamentos em Temas de Destaque
  const posBlindagem = candidato.posicionamentosTemas.find((t) => t.temaId === 'PEC_BLINDAGEM');
  const posEscala = candidato.posicionamentosTemas.find((t) => t.temaId === 'FIM_ESCALA_6X1');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Botão de retorno e ações superiores */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onVoltar}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar à lista de candidatos
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAbrirAuditJson(candidato)}
            className="inline-flex items-center gap-1 text-xs text-stone-700 bg-white border border-stone-200 px-3 py-1.5 rounded hover:bg-stone-50 transition-colors"
            title="Baixar dados brutos auditáveis em JSON"
          >
            <Download className="w-3.5 h-3.5" /> Baixar Dados (JSON)
          </button>

          <button
            type="button"
            onClick={() => onAbrirCorrecao(candidato)}
            className="inline-flex items-center gap-1 text-xs font-medium text-stone-900 bg-stone-100 border border-stone-300 px-3 py-1.5 rounded hover:bg-stone-200 transition-colors"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" /> Direito de Resposta / Correção
          </button>
        </div>
      </div>

      {/* CABEÇALHO DO PERFIL — INSTITUCIONAL E NEUTRO */}
      <header className="bg-white border border-stone-200 rounded-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-24 h-32 bg-stone-100 rounded border border-stone-200 overflow-hidden shrink-0">
              <img
                src={candidato.fotoUrl}
                alt={`Foto oficial de registro eleitoral de ${candidato.nomeUrna}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-2xl font-serif font-bold text-stone-900">
                  {candidato.nomeUrna}
                </h1>
                <span className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
                  {candidato.numeroUrna}
                </span>
              </div>

              <p className="text-sm text-stone-600">
                Nome civil: <span className="font-medium text-stone-800">{candidato.nomeCivilNormalizado}</span>
              </p>

              {/* Informações eleitorais sem pills decorativos */}
              <div className="flex items-center gap-2 text-xs text-stone-600 flex-wrap pt-1">
                <span className="font-semibold text-stone-900">{candidato.partidoSigla} ({candidato.partidoNumero})</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="font-medium text-stone-800">{CARGO_NOMES[candidato.cargo] || candidato.cargo}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>UF: <strong>{candidato.uf}</strong></span>
                {candidato.concorreReeleicao && (
                  <>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-stone-700">Candidato à Reeleição</span>
                  </>
                )}
              </div>

              {candidato.federacaoColigacaoNome && (
                <p className="text-xs text-stone-500 pt-0.5">
                  Coligação / Federação: {candidato.federacaoColigacaoNome}
                </p>
              )}
            </div>
          </div>

          {/* BOX OFICIAL DE SITUAÇÃO DA CANDIDATURA NO TSE */}
          <div className={`p-4 rounded-lg border ${situacao.bg} ${situacao.border} text-xs space-y-1.5 max-w-sm shrink-0`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Situação no TSE</span>
              <span className={`font-semibold ${situacao.text}`}>{situacao.label}</span>
            </div>
            <p className="text-stone-700 leading-relaxed text-[11px]">
              {candidato.motivoSituacaoRegistroTSE || situacao.explicacao}
            </p>
            <div className="pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600">
              <span>SQ: <code className="font-mono">{candidato.sqCandidato}</code></span>
              <a
                href={candidato.urlProcessoRegistroTSE}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-stone-900 font-medium inline-flex items-center gap-1"
              >
                Autos no DivulgaCand <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* CHAPA VINCULADA (VICE-GOVERNADOR, VICE-PRESIDENTE OU SUPLENTES DE SENADOR) */}
        {candidato.chapaVinculada && candidato.chapaVinculada.length > 0 && (
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
              Composição da Chapa Vinculada (Justiça Eleitoral)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {candidato.chapaVinculada.map((item) => (
                <div key={item.sqCandidato} className="flex items-center gap-3 p-2.5 bg-stone-50 rounded border border-stone-200">
                  <div className="w-10 h-12 bg-stone-200 rounded overflow-hidden shrink-0">
                    <img
                      src={item.fotoUrl}
                      alt={item.nomeUrna}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                      {CARGO_NOMES[item.cargo] || item.cargo}
                    </span>
                    <strong className="text-stone-900 block truncate">{item.nomeUrna}</strong>
                    <span className="text-stone-500">{item.partido} · Urna: {item.numeroUrna}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAUTAS CRUCIAIS: POSICIONAMENTO DO POLÍTICO E DO SEU PARTIDO */}
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-stone-700" />
              Posicionamento nas Pautas Cruciais (PEC da Blindagem & Fim da Escala 6x1)
            </h4>
            <span className="text-[11px] text-stone-500">
              Confronto direto: Voto / Assinatura do Político vs Orientação de Bancada do Partido
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: PEC da Blindagem */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2 border-b border-stone-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    PEC da Blindagem (PEC 3/2021 / PEC 28/2024)
                  </span>
                  <span className="text-stone-700 text-xs block">
                    Restrição a buscas e medidas cautelares contra parlamentares
                  </span>
                </div>
                {posBlindagem && (
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] border shrink-0 ${
                      posBlindagem.posicaoCandidato === 'FAVORAVEL'
                        ? 'bg-amber-50 text-amber-950 border-amber-300'
                        : posBlindagem.posicaoCandidato === 'CONTRARIO'
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                        : 'bg-stone-100 text-stone-800 border-stone-300'
                    }`}
                  >
                    {posBlindagem.posicaoRotulo}
                  </span>
                )}
              </div>

              {posBlindagem ? (
                <div className="space-y-1.5 text-stone-700 leading-relaxed text-[11px]">
                  <p>
                    <strong className="text-stone-900">Ação / Voto do Político:</strong> {posBlindagem.detalheAcao}
                  </p>
                  <p className="text-stone-600">
                    <strong className="text-stone-900">Orientação do Partido ({candidato.partidoSigla}):</strong>{' '}
                    {posBlindagem.posicaoPartidoNaEpoca}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-stone-500">
                    <span>Registrado em: {posBlindagem.dataRegistro}</span>
                    <a
                      href={posBlindagem.urlFonteOficial}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-stone-900 font-medium inline-flex items-center gap-1"
                    >
                      Fonte Oficial Câmara/Senado <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-stone-500 italic">Sem manifestação ou votação registrada nesta pauta.</p>
              )}
            </div>

            {/* Box 2: Fim da Escala 6x1 */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2 border-b border-stone-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Fim da Escala 6x1 / Limite de 36h Semanais
                  </span>
                  <span className="text-stone-700 text-xs block">
                    PEC da redução de jornada de trabalho sem redução salarial
                  </span>
                </div>
                {posEscala && (
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] border shrink-0 ${
                      posEscala.posicaoCandidato === 'FAVORAVEL' || posEscala.posicaoCandidato === 'ASSINOU_PROPOSTA'
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                        : posEscala.posicaoCandidato === 'CONTRARIO'
                        ? 'bg-rose-50 text-rose-950 border-rose-300'
                        : 'bg-stone-100 text-stone-800 border-stone-300'
                    }`}
                  >
                    {posEscala.posicaoRotulo}
                  </span>
                )}
              </div>

              {posEscala ? (
                <div className="space-y-1.5 text-stone-700 leading-relaxed text-[11px]">
                  <p>
                    <strong className="text-stone-900">Ação / Voto do Político:</strong> {posEscala.detalheAcao}
                  </p>
                  <p className="text-stone-600">
                    <strong className="text-stone-900">Orientação do Partido ({candidato.partidoSigla}):</strong>{' '}
                    {posEscala.posicaoPartidoNaEpoca}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-stone-500">
                    <span>Registrado em: {posEscala.dataRegistro}</span>
                    <a
                      href={posEscala.urlFonteOficial}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-stone-900 font-medium inline-flex items-center gap-1"
                    >
                      Fonte Oficial <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-stone-500 italic">Sem manifestação ou votação registrada nesta pauta.</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* NAVEGAÇÃO DE ABAS DE AUDITORIA */}
      <div className="flex items-center gap-1 border-b border-stone-200 text-sm overflow-x-auto">
        <button
          type="button"
          onClick={() => setAbaAtiva('ATUACAO_PARLAMENTAR')}
          className={`px-4 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors ${
            abaAtiva === 'ATUACAO_PARLAMENTAR' || abaAtiva === 'ATUACAO_E_MANDATOS'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Atuação Parlamentar
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('HISTORICO_MANDATOS')}
          className={`px-4 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors ${
            abaAtiva === 'HISTORICO_MANDATOS'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Histórico de Mandatos ({candidato.mandatosAnteriores.length})
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('INFORMACOES_JUDICIAIS')}
          className={`px-4 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors ${
            abaAtiva === 'INFORMACOES_JUDICIAIS' || abaAtiva === 'PROCESSOS_E_CONTROLE'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Informações Judiciais e Sanções ({candidato.processosJudiciais.length})
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('ESCANDALOS_E_NOTICIARIO')}
          className={`px-4 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors ${
            abaAtiva === 'ESCANDALOS_E_NOTICIARIO'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Apurações & Noticiário ({candidato.noticiarioInvestigacoes.length})
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('DADOS_REGISTRO')}
          className={`px-4 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors ${
            abaAtiva === 'DADOS_REGISTRO'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Dados do Registro TSE
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('PROPOSTA_E_BENS')}
          className={`px-4 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors ${
            abaAtiva === 'PROPOSTA_E_BENS'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Patrimônio Declarado & Propostas
        </button>
      </div>

      {/* CONTEÚDO DAS ABAS */}
      {(abaAtiva === 'ATUACAO_PARLAMENTAR' || abaAtiva === 'ATUACAO_E_MANDATOS') && (
        <ParliamentaryHistoryModule
          mandatos={candidato.mandatosAnteriores}
          presenca={candidato.presencaParlamentarRecente}
          ultimas20Votacoes={candidato.ultimas20VotacoesNominais}
          cargoAtual={candidato.cargo}
          somenteAtuacao={true}
          onNavegarMandatos={() => setAbaAtiva('HISTORICO_MANDATOS')}
        />
      )}

      {abaAtiva === 'HISTORICO_MANDATOS' && (
        <MandatesTimeline
          mandatos={candidato.mandatosAnteriores}
          cargoAtual={candidato.cargo}
        />
      )}

      {(abaAtiva === 'INFORMACOES_JUDICIAIS' || abaAtiva === 'PROCESSOS_E_CONTROLE') && (
        <JudicialProcessesModule
          processos={candidato.processosJudiciais}
          elegibilidade={candidato.elegibilidadeControle}
          nomeCandidato={candidato.nomeUrna}
        />
      )}

      {abaAtiva === 'ESCANDALOS_E_NOTICIARIO' && (
        <section className="bg-white border border-stone-200 rounded-lg p-6 space-y-6" aria-labelledby="aba-escandalos-titulo">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 id="aba-escandalos-titulo" className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-stone-800" />
                Apurações Noticiadas, Investigações Policiais e CPIs
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Rastreamento factual de menções em veículos jornalísticos com status processual atualizado e contraditório assegurado.
              </p>
            </div>

            <span className="text-xs font-mono text-stone-500">
              {candidato.noticiarioInvestigacoes.length} caso(s) catalogado(s)
            </span>
          </div>

          {/* Aviso Legal de Neutralidade e Ampla Defesa */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded text-xs text-stone-700 space-y-1">
            <p className="font-semibold text-stone-900">
              Garantia do Contraditório e Rigor Jornalístico:
            </p>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              O Raio-X das Candidaturas 2026 não formula acusações morais nem utiliza rótulos editoriais pejorativos. Esta seção reúne apenas matérias de veículos com reconhecida prática de checagem, exige a citação do status jurídico atualizado do caso e assegura a transcrição literal da resposta pública da assessoria do candidato (&quot;Outro Lado&quot;).
            </p>
          </div>

          {candidato.noticiarioInvestigacoes.length === 0 ? (
            <div className="p-8 text-center bg-stone-50/70 rounded-lg border border-dashed border-stone-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-900">
                Nenhuma menção em escândalos noticiados, CPIs ou operações policiais encontrada
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-lg mx-auto">
                Não foram identificadas apurações de grande repercussão com imputação de irregularidades contra {candidato.nomeUrna} nos principais acervos jornalísticos monitorados.
              </p>
              <div className="text-[11px] text-stone-400 mt-3">
                Verificação automatizada e checagem de fontes de imprensa realizada em 30/09/2026.
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {candidato.noticiarioInvestigacoes.map((item) => (
                <article
                  key={item.id}
                  className="border border-stone-200 rounded-lg p-5 bg-white hover:border-stone-300 transition-colors space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-stone-900 leading-snug">
                        {item.tituloNoticia}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                        <span className="font-semibold text-stone-700">{item.veiculo}</span>
                        <span aria-hidden="true">·</span>
                        <span>Publicado em: {item.dataPublicacao}</span>
                      </div>
                    </div>

                    <a
                      href={item.urlMateria}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-stone-800 underline hover:text-stone-950 font-medium shrink-0"
                    >
                      Acessar reportagem original <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Fato Concreto Apurado */}
                  <div className="space-y-1 text-xs text-stone-800">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                      Fato Concreto Noticiado / Apurado:
                    </span>
                    <p className="leading-relaxed bg-stone-50 p-3 rounded border border-stone-100">
                      {item.fatoConcretoApurado}
                    </p>
                  </div>

                  {/* Fases Jurídicas: À época vs Status Atual */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-stone-50 rounded border border-stone-200">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block mb-0.5">
                        Fase Jurídica à Época da Notícia:
                      </span>
                      <span className="text-stone-800 font-medium">{item.faseJuridicaNaData}</span>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 block mb-0.5">
                        Status Jurídico Atual do Caso:
                      </span>
                      <span className="text-amber-950 font-semibold">{item.statusJuridicoAtual}</span>
                    </div>
                  </div>

                  {/* Box Obrigatório do Outro Lado / Manifestação da Defesa */}
                  <div className="p-3.5 bg-stone-100/90 rounded border-l-4 border-stone-800 text-xs space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <MessageSquareQuote className="w-3.5 h-3.5 text-stone-700" />
                      Manifestação do Candidato / Nota da Defesa Técnica (Outro Lado):
                    </span>
                    <p className="text-stone-700 italic leading-relaxed pt-0.5">
                      &quot;{item.outroLado}&quot;
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {abaAtiva === 'DADOS_REGISTRO' && (
        <section className="bg-white border border-stone-200 rounded-lg p-6 space-y-6" aria-labelledby="aba-dados-registro-titulo">
          <div className="border-b border-stone-100 pb-3">
            <h3 id="aba-dados-registro-titulo" className="text-lg font-serif font-semibold text-stone-900">
              Dados Oficiais Declarados no Registro Eleitoral 2026
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Informações autodeclaradas pelo candidato no CANDex/TSE, sob as penas do art. 350 do Código Eleitoral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-700">
            <div className="space-y-1">
              <span className="text-stone-500 block uppercase tracking-wider text-[11px]">Ocupação Declarada</span>
              <strong className="text-sm font-semibold text-stone-900 block">{candidato.ocupacaoDeclarada}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-stone-500 block uppercase tracking-wider text-[11px]">Grau de Instrução</span>
              <strong className="text-sm font-semibold text-stone-900 block">{candidato.grauInstrucao}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-stone-500 block uppercase tracking-wider text-[11px]">Cor / Raça Declarada</span>
              <strong className="text-sm font-semibold text-stone-900 block">{candidato.corRacaDeclarada}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-stone-500 block uppercase tracking-wider text-[11px]">Naturalidade / Nascimento</span>
              <strong className="text-sm font-semibold text-stone-900 block">
                {candidato.municipioNascimento} ({candidato.ufNascimento})
              </strong>
            </div>

            <div className="space-y-1">
              <span className="text-stone-500 block uppercase tracking-wider text-[11px]">Idade na Data da Eleição</span>
              <strong className="text-sm font-semibold text-stone-900 block">{candidato.idadeDeclarada} anos</strong>
            </div>

            <div className="space-y-1">
              <span className="text-stone-500 block uppercase tracking-wider text-[11px]">Ano da Eleição</span>
              <strong className="text-sm font-semibold text-stone-900 block">{candidato.anoEleicao} (Eleições Gerais)</strong>
            </div>
          </div>

          {/* Minimização LGPD */}
          <div className="p-3.5 bg-stone-50 rounded border border-stone-200 text-xs text-stone-600 space-y-1">
            <strong className="font-semibold text-stone-800 block">Política de Minimização de Dados (LGPD):</strong>
            <p className="leading-relaxed">
              Em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), o número do CPF, título de eleitor, endereço residencial, telefone pessoal e correio eletrônico não são exibidos na interface, nem em arquivos JSON gerados ou logs de aplicação.
            </p>
          </div>
        </section>
      )}

      {abaAtiva === 'PROPOSTA_E_BENS' && (
        <div className="space-y-6">
          {/* Declaração de Bens e Evolução */}
          <section className="bg-white border border-stone-200 rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-lg font-serif font-semibold text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-stone-700" />
                  Evolução Patrimonial e Bens Declarados
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Patrimônio declarado à Justiça Eleitoral no registro de 2026 comparado a eleições anteriores.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-stone-500 block">Total Declarado em 2026</span>
                <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                  R$ {candidato.totalBensDeclarados2026.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Comparativo de Eleições Anteriores */}
            {candidato.evolucaoPatrimonial.length > 1 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Histórico de Bens Declarados por Eleição
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {candidato.evolucaoPatrimonial.map((evo) => (
                    <div key={evo.anoEleicao} className="p-3 bg-stone-50 rounded border border-stone-200">
                      <span className="text-xs text-stone-500 block">Eleição {evo.anoEleicao}</span>
                      <span className="font-mono text-sm font-semibold text-stone-900 tabular-nums block mt-0.5">
                        R$ {evo.totalBens.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[11px] text-stone-500 block truncate">{evo.cargoDisputado}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabela de Itens de Bens */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                Discriminação dos Bens Declarados em 2026
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
                    <tr>
                      <th scope="col" className="py-2.5 px-3">Tipo do Bem</th>
                      <th scope="col" className="py-2.5 px-3">Descrição Registrada no TSE</th>
                      <th scope="col" className="py-2.5 px-3 text-right">Valor Declarado (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {candidato.itensBensDeclarados.map((bem) => (
                      <tr key={bem.ordem} className="hover:bg-stone-50/70">
                        <td className="py-2.5 px-3 font-medium text-stone-900">{bem.tipoBem}</td>
                        <td className="py-2.5 px-3 text-stone-600">{bem.descricao}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-stone-900 font-medium">
                          R$ {bem.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Propostas de Governo (quando aplicável: Executivo) */}
          {candidato.urlPropostaGovernoPdf && (
            <section className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-stone-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-stone-700" />
                    Programa de Governo Oficial (PDF Protocolado no TSE)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Documento obrigatório conforme o art. 11, §1º, inciso IX, da Lei 9.504/1997.
                  </p>
                </div>

                <a
                  href={candidato.urlPropostaGovernoPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3.5 py-2 rounded transition-colors"
                >
                  Baixar PDF Oficial no TSE <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {candidato.eixosPropostaGoverno && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Eixos Temáticos Estruturantes:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-700">
                    {candidato.eixosPropostaGoverno.map((eixo, idx) => (
                      <li key={idx} className="p-2.5 bg-stone-50 rounded border border-stone-200 flex items-start gap-2">
                        <span className="font-mono text-stone-400 font-bold">0{idx + 1}.</span>
                        <span>{eixo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* AUDITORIA, RASTREABILIDADE DA FONTE E CHANGELOG DO PERFIL */}
      <footer className="bg-white border border-stone-200 rounded-lg p-5 space-y-4 text-xs text-stone-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-stone-800" />
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Metadados de Auditoria e Rastreabilidade Deste Perfil
            </h4>
          </div>

          <span className="text-[11px] text-stone-500">
            Licença: {candidato.metadadosColeta.licenca}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
          <div>
            <span className="text-stone-400 block">Fonte Primária:</span>
            <span className="font-medium text-stone-800">{candidato.metadadosColeta.nomeFonte}</span>
          </div>

          <div>
            <span className="text-stone-400 block">Data e Hora da Coleta Automatizada:</span>
            <span className="font-mono text-stone-800">{candidato.metadadosColeta.dataColeta}</span>
          </div>

          <div>
            <span className="text-stone-400 block">Data de Referência Oficial:</span>
            <span className="font-mono text-stone-800">{candidato.metadadosColeta.dataReferenciaDado}</span>
          </div>
        </div>

        {/* Histórico público de alterações deste perfil */}
        {candidato.historicoAlteracoesPerfil && candidato.historicoAlteracoesPerfil.length > 0 && (
          <div className="pt-2 border-t border-stone-100">
            <span className="font-medium text-stone-700 block mb-1">Registro de Alterações do Perfil (Changelog):</span>
            <ul className="space-y-1">
              {candidato.historicoAlteracoesPerfil.map((log, i) => (
                <li key={i} className="text-[11px] text-stone-500 flex items-center gap-2">
                  <span className="font-mono text-stone-600">{log.data}</span>
                  <span aria-hidden="true">·</span>
                  <span>{log.descricao}</span>
                  <span aria-hidden="true">·</span>
                  <span className="italic text-stone-400">({log.autor})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </footer>
    </div>
  );
};
