/**
 * Testes unitários para o Parser e Validador de Certidões Criminais TSE via OCR.
 * Executável diretamente via `npx tsx src/utils/tseOcrCertidaoParser.test.ts`
 */

import {
  validarNumeroCnj,
  parsearCertidaoCriminalTseOCR,
  formatarNumeroCnj
} from './tseOcrCertidaoParser';

// Amostra 1: Certidão Negativa ("NADA CONSTA") do Tribunal de Justiça de SP
const AMOSTRA_OCR_NEGATIVA_TJSP = `
PODER JUDICIÁRIO DO ESTADO DE SÃO PAULO
TRIBUNAL DE JUSTIÇA DO ESTADO DE SÃO PAULO
CERTIDÃO JUDICIAL CRIMINAL PARA FINS ELEITORAIS

CERTIFICO que, revendo os registros de distribuição criminal de 1ª e 2ª Instâncias deste Estado,
referente a: TABATA CLAUDIA AMARAL DE PONTES
verificou-se que NADA CONSTA em andamento ou julgado contra a pessoa acima qualificada.

Esta certidão abrange as ações penais, inquéritos policiais e execuções criminais.
Data de expedição: 15/08/2026 às 14:32:10.
Código de autenticidade: A89F-B341-9920-EF01
`;

// Amostra 2: Certidão Positiva ("CONSTA") com Ação Penal no TRF2
// Processo: 5012498-68.2023.4.02.5101 (20 dígitos padrão CNJ válido, DV 68)
const AMOSTRA_OCR_POSITIVA_TRF2 = `
PODER JUDICIÁRIO
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
Código de validação: TRF2-9988114422-SEC
`;

// Amostra 3: Certidão do STF com Inquérito Arquivado
// Processo: 0003989-03.2015.1.00.0000 (DV 03)
const AMOSTRA_OCR_STF_ARQUIVADO = `
SUPREMO TRIBUNAL FEDERAL
SECRETARIA JUDICIÁRIA
CERTIDÃO DE FEITOS ORIGINÁRIOS CRIMINAIS

CERTIFICA que, consultando o banco de dados do STF, referente a ARTHUR CESAR PEREIRA DE LIRA,
CONSTA o seguinte registro:
Inquérito Policial nº 0003989-03.2015.1.00.0000 (Pet 7074)
Classe: Inquérito (1727)
Investigado: Arthur Cesar Pereira de Lira
Situação: Arquivado definitivamente pela Primeira Turma em 06/06/2023 por ausência de justa causa. Trânsito em julgado certificado.

Expedida em 10/08/2026.
Código de autenticação: STF-CERT-2026-8812
`;

function executarTestes() {
  console.log('=== TESTES DO PARSER DE CERTIDÕES CRIMINAIS TSE VIA OCR ===\n');
  let passaram = 0;
  let falharam = 0;

  function assert(condicao: boolean, nomeTeste: string) {
    if (condicao) {
      console.log(`[PASS] ${nomeTeste}`);
      passaram++;
    } else {
      console.error(`[FAIL] ${nomeTeste}`);
      falharam++;
    }
  }

  // 1. Validação de Dígitos Verificadores do CNJ (Módulo 97 Base 10)
  assert(validarNumeroCnj('5012498-68.2023.4.02.5101') === true, 'Valida CNJ real 5012498-68.2023.4.02.5101 (TRF2)');
  assert(validarNumeroCnj('0003989-03.2015.1.00.0000') === true, 'Valida CNJ real 0003989-03.2015.1.00.0000 (STF)');
  assert(validarNumeroCnj('5008912-54.2021.4.04.7003') === true, 'Valida CNJ real 5008912-54.2021.4.04.7003 (TRF4)');
  assert(validarNumeroCnj('5012498-99.2023.4.02.5101') === false, 'Rejeita CNJ com dígito verificador incorreto (99 em vez de 68)');
  assert(validarNumeroCnj('12345') === false, 'Rejeita string curta com tamanho incorreto');

  // 2. Teste da Amostra 1 (Certidão Negativa TJSP)
  const resNegativa = parsearCertidaoCriminalTseOCR(AMOSTRA_OCR_NEGATIVA_TJSP);
  assert(resNegativa.sucesso === true, 'Amostra TJSP: Reconhece tribunal com sucesso');
  assert(resNegativa.tribunalEmissor.includes('São Paulo'), 'Amostra TJSP: Identifica Tribunal de Justiça de SP');
  assert(resNegativa.resultadoConstatacao === 'NADA_CONSTA', 'Amostra TJSP: Detecta NADA CONSTA');
  assert(resNegativa.processosIdentificados.length === 0, 'Amostra TJSP: 0 processos listados');
  assert(resNegativa.codigoAutenticidade === 'A89F-B341-9920-EF01', 'Amostra TJSP: Extrai hash de autenticidade');
  assert(resNegativa.dataExpedicao === '15/08/2026', 'Amostra TJSP: Extrai data de expedição');

  // 3. Teste da Amostra 2 (Certidão Positiva TRF2 com Réu em Ação Penal)
  const resPositiva = parsearCertidaoCriminalTseOCR(AMOSTRA_OCR_POSITIVA_TRF2);
  assert(resPositiva.sucesso === true, 'Amostra TRF2: Reconhece tribunal com sucesso');
  assert(resPositiva.tribunalEmissor.includes('TRF2'), 'Amostra TRF2: Identifica TRF 2ª Região');
  assert(resPositiva.resultadoConstatacao === 'CONSTA', 'Amostra TRF2: Detecta CONSTA');
  assert(resPositiva.processosIdentificados.length === 1, 'Amostra TRF2: Identifica exatamente 1 processo');
  if (resPositiva.processosIdentificados.length > 0) {
    const proc = resPositiva.processosIdentificados[0];
    assert(proc.numeroCnj === '5012498-68.2023.4.02.5101', 'Amostra TRF2: Extrai número CNJ exato');
    assert(proc.cnjValido === true, 'Amostra TRF2: Confirma que o número CNJ é matematicamente válido');
    assert(proc.polo === 'REU', 'Amostra TRF2: Identifica polo passivo como Réu');
  }

  // 4. Teste da Amostra 3 (Certidão STF)
  const resStf = parsearCertidaoCriminalTseOCR(AMOSTRA_OCR_STF_ARQUIVADO);
  assert(resStf.sucesso === true, 'Amostra STF: Reconhece STF');
  assert(resStf.tribunalEmissor.includes('STF'), 'Amostra STF: Identifica Supremo Tribunal Federal');
  assert(resStf.processosIdentificados.length === 1, 'Amostra STF: Identifica 1 inquérito CNJ');
  if (resStf.processosIdentificados.length > 0) {
    assert(resStf.processosIdentificados[0].numeroCnj === '0003989-03.2015.1.00.0000', 'Amostra STF: Extrai CNJ do inquérito');
    assert(resStf.processosIdentificados[0].cnjValido === true, 'Amostra STF: CNJ válido');
  }

  console.log(`\nResultado Final: ${passaram} passaram, ${falharam} falharam.`);
  if (falharam > 0) {
    process.exit(1);
  } else {
    console.log('TODOS OS TESTES DE OCR E VALIDAÇÃO CNJ FORAM APROVADOS COM SUCESSO!\n');
  }
}

executarTestes();
