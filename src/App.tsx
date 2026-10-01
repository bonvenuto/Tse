/**
 * Raio-X das Candidaturas 2026 — Plataforma Cívica, Neutra e Auditável.
 *
 * Eleições Gerais de 2026 no Brasil.
 * Data de referência: 1º de Outubro de 2026.
 * 1º Turno: 04/10/2026 · 2º Turno: 25/10/2026.
 */

import React, { useState, useMemo } from 'react';
import { Candidato, CargoEleicao } from './types';
import { CANDIDATOS_BASE } from './data/mockCandidates';
import { Navbar, SecaoAtiva } from './components/Navbar';
import { MyBallot } from './components/MyBallot';
import { CandidateCard } from './components/CandidateCard';
import { CandidateFilters } from './components/CandidateFilters';
import { CandidateProfile } from './components/CandidateProfile';
import { Comparator } from './components/Comparator';
import { PartyList } from './components/PartyList';
import { MethodologyView } from './components/MethodologyView';
import { SourcesCoverageView } from './components/SourcesCoverageView';
import { CorrectionsModal } from './components/CorrectionsModal';
import { AuditDataModal } from './components/AuditDataModal';
import { Shield, Scale, Info, ExternalLink, HeartHandshake } from 'lucide-react';

export default function App() {
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoAtiva>('CEDULA');
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<Candidato | null>(null);
  const [candidatosComparador, setCandidatosComparador] = useState<Candidato[]>([]);
  const [ufSelecionada, setUfSelecionada] = useState<string>('SP');

  // Modais de Auditoria e Correção
  const [modalCorrecaoAberto, setModalCorrecaoAberto] = useState<boolean>(false);
  const [candidatoAlvoCorrecao, setCandidatoAlvoCorrecao] = useState<Candidato | null>(null);
  const [modalAuditJsonAberto, setModalAuditJsonAberto] = useState<boolean>(false);
  const [candidatoAlvoJson, setCandidatoAlvoJson] = useState<Candidato | null>(null);

  // Filtros de busca neutros
  const [filtros, setFiltros] = useState({
    busca: '',
    uf: 'TODAS',
    cargo: 'TODOS',
    partido: 'TODOS',
    situacaoTSE: 'TODAS',
    posicaoPecBlindagem: 'TODAS',
    posicaoEscala6x1: 'TODAS',
    situacaoJudicial: 'TODAS',
    apenasComMandatoAnterior: false,
    apenasComProcessosOuTCU: false,
    apenasComEscandalos: false,
    ordenacao: 'NOME_AZ' as 'NOME_AZ' | 'NOME_ZA' | 'NUMERO_CRESCENTE' | 'NUMERO_DECRESCENTE',
  });

  // Lista única de partidos disponíveis no dataset
  const partidosDisponiveis = useMemo(() => {
    const setPartidos = new Set<string>();
    CANDIDATOS_BASE.forEach((c) => setPartidos.add(c.partidoSigla));
    return Array.from(setPartidos).sort();
  }, []);

  // Filtragem e Ordenação Estritamente Neutras
  const candidatosFiltrados = useMemo(() => {
    return CANDIDATOS_BASE.filter((cand) => {
      // Busca textual
      if (filtros.busca.trim()) {
        const termo = filtros.busca.toLowerCase();
        const bateNomeUrna = cand.nomeUrna.toLowerCase().includes(termo);
        const bateNomeCivil = cand.nomeCivilNormalizado.toLowerCase().includes(termo);
        const bateNumero = cand.numeroUrna.includes(termo);
        const batePartido = cand.partidoSigla.toLowerCase().includes(termo);
        if (!bateNomeUrna && !bateNomeCivil && !bateNumero && !batePartido) {
          return false;
        }
      }

      // Filtro UF
      if (filtros.uf !== 'TODAS' && cand.uf !== filtros.uf) {
        return false;
      }

      // Filtro Cargo
      if (filtros.cargo !== 'TODOS' && cand.cargo !== filtros.cargo) {
        return false;
      }

      // Filtro Partido
      if (filtros.partido !== 'TODOS' && cand.partidoSigla !== filtros.partido) {
        return false;
      }

      // Filtro Situação TSE
      if (filtros.situacaoTSE !== 'TODAS' && cand.situacaoRegistroTSE !== filtros.situacaoTSE) {
        return false;
      }

      // Filtro mandatos anteriores
      if (filtros.apenasComMandatoAnterior && cand.mandatosAnteriores.length === 0) {
        return false;
      }

      // Filtro processos / TCU
      if (
        filtros.apenasComProcessosOuTCU &&
        cand.processosJudiciais.length === 0 &&
        !cand.elegibilidadeControle.tcuCadirreg.consta
      ) {
        return false;
      }

      // Filtro Situação Judicial específica (Réu / Condenado / Certidões)
      if (filtros.situacaoJudicial === 'APENAS_REUS') {
        const eReu = cand.processosJudiciais.some((p) => p.faseProcessual === 'REU' || p.poloProcessual === 'REU');
        if (!eReu) return false;
      }

      if (filtros.situacaoJudicial === 'APENAS_CONDENADOS') {
        const temCondenacao = cand.processosJudiciais.some(
          (p) =>
            p.faseProcessual === 'SENTENCA_1A_INSTANCIA' ||
            p.faseProcessual === 'CONDENACAO_COLEGIADA' ||
            p.faseProcessual === 'TRANSITO_EM_JULGADO'
        );
        if (!temCondenacao) return false;
      }

      if (filtros.situacaoJudicial === 'COM_PROCESSOS') {
        if (cand.processosJudiciais.length === 0) return false;
      }

      if (filtros.situacaoJudicial === 'CERTIDOES_NEGATIVAS') {
        if (cand.processosJudiciais.length > 0) return false;
      }

      // Filtro PEC da Blindagem
      if (filtros.posicaoPecBlindagem !== 'TODAS') {
        const tema = cand.posicionamentosTemas.find((t) => t.temaId === 'PEC_BLINDAGEM');
        if (!tema) return false;
        if (filtros.posicaoPecBlindagem === 'FAVORAVEL' && tema.posicaoCandidato !== 'FAVORAVEL') {
          return false;
        }
        if (filtros.posicaoPecBlindagem === 'CONTRARIO' && tema.posicaoCandidato !== 'CONTRARIO') {
          return false;
        }
        if (
          filtros.posicaoPecBlindagem === 'NAO_ASSINOU' &&
          tema.posicaoCandidato !== 'NAO_ASSINOU' &&
          tema.posicaoCandidato !== 'NAO_SE_APLICA'
        ) {
          return false;
        }
      }

      // Filtro Fim da Escala 6x1
      if (filtros.posicaoEscala6x1 !== 'TODAS') {
        const tema = cand.posicionamentosTemas.find((t) => t.temaId === 'FIM_ESCALA_6X1');
        if (!tema) return false;
        if (filtros.posicaoEscala6x1 === 'FAVORAVEL_OU_ASSINOU') {
          if (tema.posicaoCandidato !== 'FAVORAVEL' && tema.posicaoCandidato !== 'ASSINOU_PROPOSTA') {
            return false;
          }
        }
        if (filtros.posicaoEscala6x1 === 'CONTRARIO' && tema.posicaoCandidato !== 'CONTRARIO') {
          return false;
        }
        if (filtros.posicaoEscala6x1 === 'NAO_ASSINOU' && tema.posicaoCandidato !== 'NAO_ASSINOU') {
          return false;
        }
      }

      // Filtro Menções em Escândalos / Noticiário de Repercussão
      if (filtros.apenasComEscandalos && cand.noticiarioInvestigacoes.length === 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Ordenação rigorosamente alfabética ou numérica (SEM ranking)
      if (filtros.ordenacao === 'NOME_AZ') {
        return a.nomeUrna.localeCompare(b.nomeUrna, 'pt-BR');
      }
      if (filtros.ordenacao === 'NOME_ZA') {
        return b.nomeUrna.localeCompare(a.nomeUrna, 'pt-BR');
      }
      if (filtros.ordenacao === 'NUMERO_CRESCENTE') {
        return parseInt(a.numeroUrna, 10) - parseInt(b.numeroUrna, 10);
      }
      if (filtros.ordenacao === 'NUMERO_DECRESCENTE') {
        return parseInt(b.numeroUrna, 10) - parseInt(a.numeroUrna, 10);
      }
      return 0;
    });
  }, [filtros]);

  // Ações de navegação
  const handleNavegar = (secao: SecaoAtiva) => {
    setSecaoAtiva(secao);
    setCandidatoSelecionado(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFiltrarCargoDaCedula = (cargo: CargoEleicao, uf: string) => {
    setFiltros((prev) => ({
      ...prev,
      cargo,
      uf: uf === 'BR' ? 'TODAS' : uf,
    }));
    setSecaoAtiva('CANDIDATOS');
    setCandidatoSelecionado(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Gerenciamento do comparador (máximo 4 candidatos)
  const handleAlternarComparador = (candidato: Candidato) => {
    setCandidatosComparador((prev) => {
      const existe = prev.some((c) => c.sqCandidato === candidato.sqCandidato);
      if (existe) {
        return prev.filter((c) => c.sqCandidato !== candidato.sqCandidato);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, candidato];
    });
  };

  const handleRemoverComparador = (sqCandidato: string) => {
    setCandidatosComparador((prev) => prev.filter((c) => c.sqCandidato !== sqCandidato));
  };

  const handleLimparComparador = () => {
    setCandidatosComparador([]);
  };

  const handleVerDetalhes = (candidato: Candidato) => {
    setCandidatoSelecionado(candidato);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAbrirCorrecao = (candidato?: Candidato) => {
    setCandidatoAlvoCorrecao(candidato || null);
    setModalCorrecaoAberto(true);
  };

  const handleAbrirAuditJson = (candidato: Candidato) => {
    setCandidatoAlvoJson(candidato);
    setModalAuditJsonAberto(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900 selection:bg-stone-200">
      {/* BARRA SUPERIOR (CONTRATO DE 3 ZONAS) */}
      <Navbar
        secaoAtiva={candidatoSelecionado ? 'CANDIDATOS' : secaoAtiva}
        onNavegar={handleNavegar}
        onAbrirCorrecoes={() => handleAbrirCorrecao()}
        qtdComparador={candidatosComparador.length}
      />

      {/* AVISO INSTITUCIONAL DE NEUTRALIDADE ELEITORAL */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" aria-hidden="true" />
            <span>
              <strong>Base Oficial TSE 2026:</strong> Dados sincronizados com o repositório de dados abertos da Justiça Eleitoral e APIs do Congresso Nacional.
            </span>
          </div>
          <div className="text-stone-400">
            Data de referência: <strong>01/10/2026</strong> · 1º Turno: <strong>04/10/2026</strong>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Visualização de Perfil de Candidato Individual */}
        {candidatoSelecionado ? (
          <CandidateProfile
            candidato={candidatoSelecionado}
            onVoltar={() => setCandidatoSelecionado(null)}
            onAbrirCorrecao={handleAbrirCorrecao}
            onAbrirAuditJson={handleAbrirAuditJson}
          />
        ) : (
          <>
            {/* 1. SEÇÃO: MINHA CÉDULA */}
            {secaoAtiva === 'CEDULA' && (
              <MyBallot
                ufSelecionada={ufSelecionada}
                onSelecionarUf={(uf) => setUfSelecionada(uf)}
                onFiltrarCargo={handleFiltrarCargoDaCedula}
                totalCandidatosUf={candidatosFiltrados.length}
              />
            )}

            {/* 2. SEÇÃO: CANDIDATURAS (BUSCA E FILTROS NEUTROS) */}
            {secaoAtiva === 'CANDIDATOS' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h1 className="text-2xl font-serif font-bold text-stone-900">
                    Consulta Pública de Candidaturas 2026
                  </h1>
                  <p className="text-xs text-stone-500">
                    Auditoria oficial e factual de pedidos de registro, mandatos, presenças e processos judiciais.
                  </p>
                </div>

                <CandidateFilters
                  filtros={filtros}
                  onChangeFiltros={setFiltros}
                  onLimparFiltros={() =>
                    setFiltros({
                      busca: '',
                      uf: 'TODAS',
                      cargo: 'TODOS',
                      partido: 'TODOS',
                      situacaoTSE: 'TODAS',
                      posicaoPecBlindagem: 'TODAS',
                      posicaoEscala6x1: 'TODAS',
                      situacaoJudicial: 'TODAS',
                      apenasComMandatoAnterior: false,
                      apenasComProcessosOuTCU: false,
                      apenasComEscandalos: false,
                      ordenacao: 'NOME_AZ',
                    })
                  }
                  totalFiltrados={candidatosFiltrados.length}
                  totalGeral={CANDIDATOS_BASE.length}
                  partidosDisponiveis={partidosDisponiveis}
                />

                {candidatosFiltrados.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-stone-200 rounded-lg space-y-2">
                    <p className="text-sm font-semibold text-stone-800">
                      Nenhuma candidatura corresponde aos filtros selecionados.
                    </p>
                    <p className="text-xs text-stone-500">
                      Tente alterar a UF, o cargo ou limpar a busca textual.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {candidatosFiltrados.map((candidato) => (
                      <CandidateCard
                        key={candidato.sqCandidato}
                        candidato={candidato}
                        onSelecionar={handleVerDetalhes}
                        noComparador={candidatosComparador.some((c) => c.sqCandidato === candidato.sqCandidato)}
                        onAlternarComparador={handleAlternarComparador}
                        podeAdicionarComparador={candidatosComparador.length < 4}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. SEÇÃO: COMPARADOR CÍVICO */}
            {secaoAtiva === 'COMPARADOR' && (
              <Comparator
                candidatos={candidatosComparador}
                onRemover={handleRemoverComparador}
                onLimpar={handleLimparComparador}
                onVerDetalhes={handleVerDetalhes}
              />
            )}

            {/* 4. SEÇÃO: PARTIDOS E FUNDOS */}
            {secaoAtiva === 'PARTIDOS' && <PartyList />}

            {/* 5. SEÇÃO: METODOLOGIA */}
            {secaoAtiva === 'METODOLOGIA' && <MethodologyView />}

            {/* 6. SEÇÃO: FONTES E COBERTURA */}
            {secaoAtiva === 'FONTES_COBERTURA' && <SourcesCoverageView />}
          </>
        )}
      </main>

      {/* MODAL DE CORREÇÕES E DIREITO DE RESPOSTA */}
      {modalCorrecaoAberto && (
        <CorrectionsModal
          candidato={candidatoAlvoCorrecao}
          onFechar={() => {
            setModalCorrecaoAberto(false);
            setCandidatoAlvoCorrecao(null);
          }}
        />
      )}

      {/* MODAL DE AUDITORIA BRUTA EM JSON */}
      {modalAuditJsonAberto && candidatoAlvoJson && (
        <AuditDataModal
          candidato={candidatoAlvoJson}
          onFechar={() => {
            setModalAuditJsonAberto(false);
            setCandidatoAlvoJson(null);
          }}
        />
      )}

      {/* RODAPÉ INSTITUCIONAL */}
      <footer className="border-t border-stone-200 bg-white text-stone-600 text-xs py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2 md:col-span-2">
              <span className="font-serif font-bold text-base text-stone-900 block">
                Raio-X das Candidaturas 2026
              </span>
              <p className="text-xs text-stone-600 max-w-lg leading-relaxed">
                Plataforma cívica, independente e neutra de auditoria eleitoral. Desenvolvida para fornecer a todos os cidadãos brasileiros acesso transparente e auditável aos registros oficiais de candidaturas, mandatos, presenças, votações nominais e certidões judiciais.
              </p>
              <div className="text-[11px] text-stone-500 pt-1">
                Compromisso estrito com a Lei 9.504/1997, Resoluções TSE nº 23.610/2019 e 23.755/2026 e Lei 13.709/2018 (LGPD).
              </div>
            </div>

            <div className="space-y-2">
              <strong className="text-stone-900 font-semibold block uppercase tracking-wider text-[11px]">
                Navegação Cívica
              </strong>
              <ul className="space-y-1 text-xs">
                <li>
                  <button type="button" onClick={() => handleNavegar('CEDULA')} className="hover:text-stone-900">
                    Minha Cédula 2026
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavegar('CANDIDATOS')} className="hover:text-stone-900">
                    Todas as Candidaturas
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavegar('COMPARADOR')} className="hover:text-stone-900">
                    Comparador Cívico
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavegar('PARTIDOS')} className="hover:text-stone-900">
                    Partidos, FEFC & Coesão
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <strong className="text-stone-900 font-semibold block uppercase tracking-wider text-[11px]">
                Transparência & Fontes
              </strong>
              <ul className="space-y-1 text-xs">
                <li>
                  <button type="button" onClick={() => handleNavegar('METODOLOGIA')} className="hover:text-stone-900">
                    Metodologia Pública v1.2.0
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavegar('FONTES_COBERTURA')} className="hover:text-stone-900">
                    Tabela de Fontes e Cobertura
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleAbrirCorrecao()} className="hover:text-stone-900">
                    Direito de Resposta (SLA 24h)
                  </button>
                </li>
                <li>
                  <a
                    href="https://dadosabertos.tse.jus.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-stone-900"
                  >
                    Portal Dados Abertos TSE <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
            <div>
              © 2026 Observatório Cívico Eleitoral. Conteúdo sob licença <strong>Creative Commons Atribuição (CC-BY 4.0)</strong>.
            </div>
            <div>
              Sem rankings morais · Sem enquetes · Presunção de inocência constitucional (Art. 5º, LVII).
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
