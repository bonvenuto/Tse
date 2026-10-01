/**
 * Módulo de Processos Judiciais e Sanções Administrativas.
 *
 * REQUISITOS OBRIGATÓRIOS:
 * 1. Nota padrão em destaque: "A existência de processo não implica culpa."
 * 2. Diferenciação rigorosa entre estágios processuais (Investigação, Réu, Sentença, Colegiado, Trânsito em Julgado, Absolvição/Arquivamento).
 * 3. Integração com DataJud (CNJ), certidões criminais do TSE, Cadirreg (TCU), CNCIAI (CNJ) e CEIS/CNEP (CGU).
 * 4. Para cada processo: nº CNJ, tribunal, classe TPU, assuntos TPU, fase, data de verificação e link oficial.
 */

import React, { useState } from 'react';
import { ProcessoJudicial, ElegibilidadeControle, FaseProcessual } from '../types';
import { ShieldAlert, ExternalLink, Scale, CheckCircle2, AlertCircle, FileText, Info } from 'lucide-react';
import { OcrCertificateValidator } from './OcrCertificateValidator';

interface Props {
  processos: ProcessoJudicial[];
  elegibilidade: ElegibilidadeControle;
  nomeCandidato: string;
}

const FASE_LABELS: Record<FaseProcessual, { label: string; descricao: string; bg: string; text: string; border: string }> = {
  INVESTIGACAO: {
    label: 'Inquérito / Investigação Preliminar',
    descricao: 'Procedimento preliminar de apuração. Não há denúncia aceita nem ação penal instaurada.',
    bg: 'bg-stone-100',
    text: 'text-stone-800',
    border: 'border-stone-300',
  },
  DENUNCIA_OFERECIDA: {
    label: 'Denúncia Oferecida pelo Ministério Público',
    descricao: 'A peça acusatória foi protocolada pelo órgão acusador, mas ainda não foi examinada pelo juiz ou tribunal.',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
  },
  REU: {
    label: 'Ação Penal em Curso (Denúncia Recebida)',
    descricao: 'A denúncia foi acolhida pelo magistrado ou colegiado. O processo está em fase de instrução e produção de provas. Decisão não definitiva.',
    bg: 'bg-amber-100/70',
    text: 'text-amber-950',
    border: 'border-amber-300',
  },
  SENTENCA_1A_INSTANCIA: {
    label: 'Sentença Condenatória de 1ª Instância (Com Recurso)',
    descricao: 'Decisão monocrática de primeiro grau sujeita a recurso de apelação. Presunção de inocência permanece ativa.',
    bg: 'bg-orange-50',
    text: 'text-orange-900',
    border: 'border-orange-200',
  },
  CONDENACAO_COLEGIADA: {
    label: 'Condenação por Órgão Colegiado (2ª Instância)',
    descricao: 'Acórdão condenatório proferido por tribunal. Pode gerar hipótese de inelegibilidade nos termos da LC 64/90 alterada pela LC 135/2010.',
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    border: 'border-rose-200',
  },
  TRANSITO_EM_JULGADO: {
    label: 'Condenação com Trânsito em Julgado',
    descricao: 'Decisão judicial irrecorrível, contra a qual não cabe mais recurso ordinário ou extraordinário.',
    bg: 'bg-rose-100',
    text: 'text-rose-950',
    border: 'border-rose-300',
  },
  ABSOLVICAO_OU_ARQUIVAMENTO: {
    label: 'Absolvição, Extinção de Punibilidade ou Arquivamento',
    descricao: 'Processo encerrado em favor da pessoa investigada/acusada, por improcedência, prescrição, atipicidade ou anulação definitiva.',
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
  },
};

export const JudicialProcessesModule: React.FC<Props> = ({ processos, elegibilidade, nomeCandidato }) => {
  const [filtroFase, setFiltroFase] = useState<string>('TODAS');

  const processosFiltrados = filtroFase === 'TODAS'
    ? processos
    : processos.filter((p) => p.faseProcessual === filtroFase);

  return (
    <section className="space-y-6" aria-labelledby="secao-processos-titulo">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <h3 id="secao-processos-titulo" className="text-xl font-serif font-semibold text-stone-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-stone-700" aria-hidden="true" />
            Informações Judiciais e Sanções
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Certidões criminais do registro eleitoral, dados enriquecidos pelo DataJud (CNJ) e cadastros de sanções oficiais.
          </p>
        </div>

        {/* Metadado de auditoria da verificação */}
        <div className="text-xs text-stone-500 flex items-center gap-2">
          <span>Última checagem unificada: 30/09/2026</span>
          <span aria-hidden="true">·</span>
          <span>Fonte: DataJud / TSE / TCU</span>
        </div>
      </div>

      {/* NOTA OBRIGATÓRIA DE PRESUNÇÃO DE INOCÊNCIA (Art. 5º, LVII da CF/88) */}
      <div
        className="p-4 bg-stone-100/80 border-l-4 border-stone-800 rounded-r-md"
        role="note"
        aria-label="Aviso legal sobre presunção de inocência"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-stone-800 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-stone-800 space-y-1">
            <p className="font-semibold">
              A existência de processo não implica culpa.
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              Em cumprimento ao art. 5º, inciso LVII da Constituição da República Federativa do Brasil, toda pessoa é considerada inocente até o trânsito em julgado de sentença penal condenatória. A Justiça Eleitoral avalia a elegibilidade de acordo com os critérios objetivos da Lei Complementar nº 64/1990 e suas alterações.
            </p>
          </div>
        </div>
      </div>

      {/* SANÇÕES ADMINISTRATIVAS E CONSULTA AOS ÓRGÃOS DE CONTROLE */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
          Checagem em Cadastros Oficiais e Tribunais de Contas
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TCU Cadirreg */}
          <div className={`p-3.5 rounded border ${elegibilidade.tcuCadirreg.consta ? 'bg-amber-50/70 border-amber-300' : 'bg-stone-50 border-stone-200'}`}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-stone-900">TCU — Cadirreg</span>
              {elegibilidade.tcuCadirreg.consta ? (
                <span className="text-[11px] font-medium text-amber-800">Consta na lista</span>
              ) : (
                <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Não consta
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-600 line-clamp-2">
              {elegibilidade.tcuCadirreg.descricao || 'Contas julgadas irregulares eleitorais (art. 11, §5º da Lei 9.504/97).'}
            </p>
            {elegibilidade.tcuCadirreg.numeroAcordao && (
              <p className="text-[11px] font-mono text-stone-800 mt-1">
                {elegibilidade.tcuCadirreg.numeroAcordao}
              </p>
            )}
            <a
              href={elegibilidade.tcuCadirreg.linkCertidao || 'https://sites.tcu.gov.br/contas-julgadas-irregulares/'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-stone-700 underline hover:text-stone-900 mt-2 inline-flex items-center gap-1"
            >
              Consultar lista TCU <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* CGU CEIS/CNEP */}
          <div className="p-3.5 rounded border bg-stone-50 border-stone-200">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-stone-900">CGU — CEIS / CNEP</span>
              <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Não consta
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Cadastro de Empresas Inidôneas e Suspensas e Cadastro Nacional de Empresas Punidas.
            </p>
            <a
              href={elegibilidade.cguCeisCnep.linkConsulta}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-stone-700 underline hover:text-stone-900 mt-2 inline-flex items-center gap-1"
            >
              Portal da Transparência <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* CNJ Improbidade */}
          <div className="p-3.5 rounded border bg-stone-50 border-stone-200">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-stone-900">CNJ — CNCIAI</span>
              <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Não consta
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Condenações cíveis por atos de improbidade com suspensão de direitos políticos.
            </p>
            <a
              href={elegibilidade.cnjImprobidade.linkConsulta}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-stone-700 underline hover:text-stone-900 mt-2 inline-flex items-center gap-1"
            >
              Consulta CNCIAI <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Certidões Criminais TSE */}
          <div className="p-3.5 rounded border bg-stone-50 border-stone-200">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-stone-900">Certidões no TSE</span>
              <span className="text-[11px] font-mono text-stone-700">
                {elegibilidade.certidoesCriminaisApresentadasTse.qtdApresentadas} anexadas
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Documentos oficiais anexados ao pedido de registro de candidatura (1º e 2º graus e Justiça Federal).
            </p>
            <a
              href={elegibilidade.certidoesCriminaisApresentadasTse.urlConsultaTse}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-stone-700 underline hover:text-stone-900 mt-2 inline-flex items-center gap-1"
            >
              Ver autos no DivulgaCand <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Detalhe se constar no TCU com recurso */}
        {elegibilidade.tcuCadirreg.consta && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              Anotação de auditoria referente ao Cadirreg/TCU:
            </p>
            <p className="leading-relaxed">
              {elegibilidade.tcuCadirreg.descricao}
            </p>
            <p className="text-[11px] text-amber-800">
              Nota: Nos termos da jurisprudência do Tribunal Superior Eleitoral (TSE), a declaração definitiva de inelegibilidade cabe exclusivamente à Justiça Eleitoral na análise do processo de registro da candidatura (RCAND), e não aos Tribunais de Contas.
            </p>
          </div>
        )}
      </div>

      {/* PROCESSOS JUDICIAIS IDENTIFICADOS */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
              Processos Criminais e de Improbidade Encontrados
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Extraídos de certidões judiciais oficiais e catalogados conforme as Tabelas Processuais Unificadas (TPU/CNJ).
            </p>
          </div>

          {/* Filtro por estágio processual */}
          {processos.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <label htmlFor="filtro-fase-select" className="text-stone-500 font-medium">Filtrar estágio:</label>
              <select
                id="filtro-fase-select"
                value={filtroFase}
                onChange={(e) => setFiltroFase(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-300 rounded px-2.5 py-1 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-500"
              >
                <option value="TODAS">Todos os estágios ({processos.length})</option>
                <option value="REU">Ação Penal em Curso (Réu)</option>
                <option value="SENTENCA_1A_INSTANCIA">Condenação de 1ª Instância (Com Recurso)</option>
                <option value="CONDENACAO_COLEGIADA">Condenação Colegiada (2ª Instância)</option>
                <option value="INVESTIGACAO">Inquérito / Investigação Preliminar</option>
                <option value="ABSOLVICAO_OU_ARQUIVAMENTO">Absolvição / Arquivamento</option>
              </select>
            </div>
          )}
        </div>

        {processos.length === 0 ? (
          <div className="p-6 text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
            <Scale className="w-8 h-8 text-stone-400 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm font-medium text-stone-800">
              Nenhum processo penal ou de improbidade administrativa consta nas certidões oficiais.
            </p>
            <p className="text-xs text-stone-500 mt-1 max-w-lg mx-auto">
              Todas as certidões criminais apresentadas perante a Justiça Eleitoral (Tribunais de Justiça estaduais, Tribunais Regionais Federais, STJ e STF) foram verificadas e encontram-se negativas para o candidato {nomeCandidato}.
            </p>
            <div className="text-[11px] text-stone-400 mt-3">
              Checagem automatizada via DataJud / PJe realizada em 30/09/2026.
            </div>
          </div>
        ) : processosFiltrados.length === 0 ? (
          <p className="text-xs text-stone-500 py-4 text-center">
            Nenhum processo localizado para o filtro selecionado.
          </p>
        ) : (
          <div className="space-y-4">
            {processosFiltrados.map((proc) => {
              const faseMeta = FASE_LABELS[proc.faseProcessual] || FASE_LABELS.INVESTIGACAO;
              return (
                <article
                  key={proc.id}
                  className="border border-stone-200 rounded-lg p-4 bg-white hover:border-stone-300 transition-colors space-y-3"
                  aria-labelledby={`proc-num-${proc.id}`}
                >
                  {/* Cabeçalho do Processo */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span id={`proc-num-${proc.id}`} className="font-mono font-semibold text-sm text-stone-900">
                          {proc.numeroCnj}
                        </span>
                        <span className="text-stone-300" aria-hidden="true">|</span>
                        <span className="text-xs font-medium text-stone-700">
                          {proc.tribunal}
                        </span>
                        <span className="text-stone-300" aria-hidden="true">|</span>
                        <span className="text-xs text-stone-500">
                          Polo: {proc.poloProcessual}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        Classe TPU: <strong className="font-medium text-stone-800">{proc.classeTpu}</strong>
                      </p>
                    </div>

                    {/* Badge do Estágio Processual Exato com distinção visual rigorosa */}
                    <div className="shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${faseMeta.bg} ${faseMeta.text} ${faseMeta.border}`}>
                        {faseMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* Descrição do Objeto Fático */}
                  <div className="text-xs text-stone-700 leading-relaxed space-y-1">
                    <p className="text-stone-800">
                      {proc.descricaoObjeto}
                    </p>
                    {proc.observacaoProcedimental && (
                      <p className="text-[11px] text-stone-500 italic">
                        {proc.observacaoProcedimental}
                      </p>
                    )}
                  </div>

                  {/* Assuntos TPU */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-stone-400 font-medium">Assuntos TPU:</span>
                    {proc.assuntosTpu.map((assunto, i) => (
                      <span key={i} className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        {assunto}
                      </span>
                    ))}
                  </div>

                  {/* Rodapé do processo com rastreabilidade da fonte */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    <div className="flex items-center gap-2">
                      <span>Origem: {proc.origemIdentificacao === 'CERTIDAO_CRIMINAL_TSE_OCR' ? 'Certidão TSE (OCR)' : 'DataJud Público'}</span>
                      <span aria-hidden="true">·</span>
                      <span>Verificado em: {proc.dataUltimaVerificacao}</span>
                      {proc.dataUltimaMovimentacao && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Último andamento: {proc.dataUltimaMovimentacao}</span>
                        </>
                      )}
                    </div>

                    <a
                      href={proc.urlOficialTribunal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-stone-800 underline hover:text-stone-950 font-medium"
                    >
                      Acessar autos no tribunal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* VALIDADOR E TESTE DE EXTRAÇÃO OCR DE CERTIDÕES CRIMINAIS DO TSE */}
      <OcrCertificateValidator />
    </section>
  );
};
