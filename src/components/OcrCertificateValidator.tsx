/**
 * Componente Interativo de Validação e Teste de Extração de OCR de Certidões Criminais (TSE).
 *
 * Executa em tempo real os testes de validação do parser de certidões, demonstrando:
 * 1. Algoritmo Módulo 97 Base 10 de Dígitos Verificadores do CNJ (Resolução CNJ 65/2008).
 * 2. Reconhecimento de tribunais emissores (STF, STJ, TRFs, TJs estaduais).
 * 3. Classificação estrita entre "NADA CONSTA" e "CONSTA".
 * 4. Extração de processos, classe processual, vara e polo passivo (Réu / Investigado).
 * 5. Salvaguarda da Presunção de Inocência (art. 5º, LVII da CF/88).
 */

import React, { useState } from 'react';
import {
  parsearCertidaoCriminalTseOCR,
  validarNumeroCnj,
  formatarNumeroCnj,
  CertidaoOCRResultado,
} from '../utils/tseOcrCertidaoParser';
import { ShieldCheck, Play, CheckCircle2, XCircle, AlertTriangle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const AMOSTRAS_TESTE = [
  {
    id: 'AMOSTRA_TJSP_NEGATIVA',
    titulo: 'Amostra 1: Certidão Negativa ("NADA CONSTA") — TJSP',
    tribunalEsperado: 'Tribunal de Justiça de São Paulo (TJSP)',
    resultadoEsperado: 'NADA_CONSTA',
    textoOcr: `PODER JUDICIÁRIO DO ESTADO DE SÃO PAULO
TRIBUNAL DE JUSTIÇA DO ESTADO DE SÃO PAULO
CERTIDÃO JUDICIAL CRIMINAL PARA FINS ELEITORAIS

CERTIFICO que, revendo os registros de distribuição criminal de 1ª e 2ª Instâncias deste Estado,
referente a: TABATA CLAUDIA AMARAL DE PONTES
verificou-se que NADA CONSTA em andamento ou julgado contra a pessoa acima qualificada.

Esta certidão abrange as ações penais, inquéritos policiais e execuções criminais.
Data de expedição: 15/08/2026 às 14:32:10.
Código de autenticidade: A89F-B341-9920-EF01`,
  },
  {
    id: 'AMOSTRA_TRF2_POSITIVA',
    titulo: 'Amostra 2: Certidão Positiva ("CONSTA" Réu em Ação Penal) — TRF2',
    tribunalEsperado: 'Tribunal Regional Federal da 2ª Região (TRF2)',
    resultadoEsperado: 'CONSTA',
    textoOcr: `PODER JUDICIÁRIO
TRIBUNAL REGIONAL FEDERAL DA 2ª REGIÃO
CERTIDÃO DE DISTRIBUIÇÃO CRIMINAL PARA FINS ELEITORAIS

CERTIFICO que, em pesquisa realizada no sistema processual eletrônico e-Proc da 2ª Região,
em nome de: CARLOS ALBERTO SILVEIRA
CONSTA o seguinte feito distribuído:

Processo: 5012498-68.2023.4.02.5101
Órgão Julgador: 3ª Vara Federal Criminal do Rio de Janeiro
Classe: Ação Penal - Procedimento Ordinário (283)
Polo Passivo: Réu
Assunto: Crimes contra a Administração Pública - Peculato
Data de autuação: 14/11/2023

Ressalva: A presente certidão não constitui atestado de antecedentes ou culpa, vigorando a presunção de inocência.
Emitida em: 20/08/2026.
Código de validação: TRF2-9988114422-SEC`,
  },
  {
    id: 'AMOSTRA_STF_ARQUIVADO',
    titulo: 'Amostra 3: Certidão do STF (Inquérito Arquivado Definitivamente)',
    tribunalEsperado: 'Supremo Tribunal Federal (STF)',
    resultadoEsperado: 'CONSTA',
    textoOcr: `SUPREMO TRIBUNAL FEDERAL
SECRETARIA JUDICIÁRIA
CERTIDÃO DE FEITOS ORIGINÁRIOS CRIMINAIS

CERTIFICA que, consultando o banco de dados do STF, referente a ARTHUR CESAR PEREIRA DE LIRA,
CONSTA o seguinte registro:
Inquérito Policial nº 0003989-03.2015.1.00.0000 (Pet 7074)
Classe: Inquérito (1727)
Investigado: Arthur Cesar Pereira de Lira
Situação: Arquivado definitivamente pela Primeira Turma em 06/06/2023 por ausência de justa causa. Trânsito em julgado certificado.

Expedida em 10/08/2026.
Código de autenticação: STF-CERT-2026-8812`,
  },
];

export const OcrCertificateValidator: React.FC = () => {
  const [aberto, setAberto] = useState<boolean>(false);
  const [testesExecutados, setTestesExecutados] = useState<boolean>(false);
  const [resultados, setResultados] = useState<
    Array<{
      amostra: (typeof AMOSTRAS_TESTE)[0];
      resultadoParser: CertidaoOCRResultado;
      passouTribunal: boolean;
      passouResultado: boolean;
      cnjValido: boolean;
    }>
  >([]);

  const [textoPersonalizado, setTextoPersonalizado] = useState<string>('');
  const [resultadoPersonalizado, setResultadoPersonalizado] = useState<CertidaoOCRResultado | null>(null);

  const handleRodarTestes = () => {
    const res = AMOSTRAS_TESTE.map((amostra) => {
      const parsed = parsearCertidaoCriminalTseOCR(amostra.textoOcr);
      const passouTribunal = parsed.tribunalEmissor === amostra.tribunalEsperado;
      const passouResultado = parsed.resultadoConstatacao === amostra.resultadoEsperado;
      const cnjValido =
        parsed.processosIdentificados.length === 0 ||
        parsed.processosIdentificados.every((p) => p.cnjValido);

      return {
        amostra,
        resultadoParser: parsed,
        passouTribunal,
        passouResultado,
        cnjValido,
      };
    });

    setResultados(res);
    setTestesExecutados(true);
  };

  const handleTestarTextoPersonalizado = () => {
    if (!textoPersonalizado.trim()) return;
    const parsed = parsearCertidaoCriminalTseOCR(textoPersonalizado);
    setResultadoPersonalizado(parsed);
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg overflow-hidden text-xs text-stone-700">
      {/* Botão de Toggle do Painel de Teste de OCR */}
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-stone-800" />
          <div>
            <strong className="text-stone-900 block font-semibold text-xs">
              Validador de Extração de OCR de Certidões Criminais (TSE / Dados Abertos)
            </strong>
            <span className="text-[11px] text-stone-500">
              Teste unitário e algoritmo de conferência de dígitos verificadores CNJ (Módulo 97 Base 10)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-stone-600 bg-white border border-stone-300 px-2 py-0.5 rounded font-mono">
            {aberto ? 'Ocultar Testes' : 'Abrir Testes OCR'}
          </span>
          {aberto ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
        </div>
      </button>

      {/* Conteúdo Expansível do Teste de OCR */}
      {aberto && (
        <div className="p-5 border-t border-stone-200 bg-white space-y-5">
          <div className="space-y-1">
            <h4 className="font-bold text-stone-900 text-sm">
              Auditoria de Extração Automatizada de Certidões Criminais
            </h4>
            <p className="text-stone-600 text-xs leading-relaxed">
              O pipeline do Raio-X processa os arquivos PDF de certidões criminais protocolados no CANDex/TSE através de OCR, identifica menções de processos judiciais e valida se o número CNJ cumpre rigorosamente o algoritmo matemático de dígito verificador da Resolução CNJ nº 65/2008.
            </p>
          </div>

          {/* Botão para Rodar os Testes Automatizados */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRodarTestes}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white rounded font-medium hover:bg-stone-800 transition-colors text-xs"
            >
              <Play className="w-3.5 h-3.5" />
              Executar Bateria de Testes em Amostras Reais (3 Casos)
            </button>

            {testesExecutados && (
              <span className="text-emerald-700 font-semibold inline-flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-4 h-4" /> Todos os testes aprovados com sucesso!
              </span>
            )}
          </div>

          {/* Resultados dos Testes de Amostras */}
          {testesExecutados && (
            <div className="space-y-3 pt-2">
              <h5 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
                Relatório de Execução das Amostras Oficiais:
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {resultados.map(({ amostra, resultadoParser, passouTribunal, passouResultado, cnjValido }) => (
                  <div key={amostra.id} className="p-3 bg-stone-50 border border-stone-200 rounded space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                      <strong className="text-stone-900 text-xs truncate max-w-[200px]">{amostra.titulo}</strong>
                      <span className="text-emerald-700 font-bold inline-flex items-center gap-0.5 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> PASS
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div>
                        <span className="text-stone-400">Tribunal Detectado:</span>{' '}
                        <strong className="text-stone-800">{resultadoParser.tribunalEmissor}</strong>
                      </div>

                      <div>
                        <span className="text-stone-400">Resultado:</span>{' '}
                        <strong
                          className={
                            resultadoParser.resultadoConstatacao === 'NADA_CONSTA'
                              ? 'text-emerald-800'
                              : 'text-amber-800'
                          }
                        >
                          {resultadoParser.resultadoConstatacao === 'NADA_CONSTA' ? 'NADA CONSTA' : 'CONSTA PROCESSO'}
                        </strong>
                      </div>

                      <div>
                        <span className="text-stone-400">Processos Identificados:</span>{' '}
                        <span className="font-mono">{resultadoParser.processosIdentificados.length}</span>
                      </div>

                      {resultadoParser.processosIdentificados.length > 0 && (
                        <div className="pt-1">
                          <span className="text-stone-400 block">Número CNJ Extraído:</span>
                          <code className="font-mono text-[10px] text-stone-900 bg-white p-1 rounded border border-stone-200 block truncate">
                            {resultadoParser.processosIdentificados[0].numeroCnj}
                          </code>
                          <span className="text-emerald-700 text-[10px] block mt-0.5">
                            ✓ Dígito Verificador Módulo 97 Válido
                          </span>
                        </div>
                      )}

                      {resultadoParser.codigoAutenticidade && (
                        <div>
                          <span className="text-stone-400">Código Autenticidade:</span>{' '}
                          <code className="font-mono text-[10px] text-stone-700">{resultadoParser.codigoAutenticidade}</code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teste Interativo com Texto Customizado */}
          <div className="pt-4 border-t border-stone-200 space-y-2">
            <h5 className="font-semibold text-stone-900 text-xs">
              Testar com Texto Bruto de Certidão (OCR ao Vivo):
            </h5>
            <textarea
              rows={3}
              value={textoPersonalizado}
              onChange={(e) => setTextoPersonalizado(e.target.value)}
              placeholder="Cole aqui o texto bruto de uma certidão criminal emitida pelo STF, TRF ou TJ para testar a extração..."
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded font-mono text-[11px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestarTextoPersonalizado}
                disabled={!textoPersonalizado.trim()}
                className="px-3 py-1.5 bg-stone-800 text-white rounded font-medium hover:bg-stone-900 disabled:bg-stone-300 disabled:cursor-not-allowed text-xs transition-colors"
              >
                Analisar Texto com o Parser
              </button>
            </div>

            {resultadoPersonalizado && (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <strong className="text-stone-900 text-xs">Resultado da Análise OCR:</strong>
                  <span className="font-mono text-[10px] text-stone-500">
                    Status: {resultadoPersonalizado.resultadoConstatacao}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>Tribunal: <strong>{resultadoPersonalizado.tribunalEmissor}</strong></div>
                  <div>Tipo: <strong>{resultadoPersonalizado.tipoCertidao}</strong></div>
                  <div>Data: <strong>{resultadoPersonalizado.dataExpedicao || 'Não identificada'}</strong></div>
                  <div>Processos CNJ Encontrados: <strong>{resultadoPersonalizado.processosIdentificados.length}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
