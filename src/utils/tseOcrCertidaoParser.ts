/**
 * Parser e Validador de Certidões Criminais do TSE via OCR.
 *
 * Utilizado para processar certidões judiciais de 1º e 2º graus (Justiça Estadual,
 * Federal, STJ e STF) anexadas ao registro de candidatura no CANDex/DivulgaCandContas.
 *
 * Inclui validação do algoritmo do dígito verificador CNJ (módulo 97 base 10 - Resolução CNJ 65/2008).
 */

export interface ProcessoExtraidoOCR {
  numeroCnj: string;
  cnjValido: boolean;
  tribunalIdentificado: string;
  varaOuOrgao?: string;
  classeProcessual?: string;
  assuntoPrincipal?: string;
  polo?: 'REU' | 'INVESTIGADO' | 'AUTOR' | 'TERCEIRO';
  situacaoNoProcesso?: string;
}

export interface CertidaoOCRResultado {
  sucesso: boolean;
  tribunalEmissor: string;
  tipoCertidao: string; // ex: "Certidão Judicial Criminal de 1º Grau", "Certidão de Objeto e Pé"
  nomePesquisado: string;
  resultadoConstatacao: 'NADA_CONSTA' | 'CONSTA' | 'INDETERMINADO';
  codigoAutenticidade?: string;
  dataExpedicao?: string;
  processosIdentificados: ProcessoExtraidoOCR[];
  errosOuAlertas: string[];
}

/**
 * Validador oficial do dígito verificador do padrão CNJ (Resolução 65/2008).
 * Formato: NNNNNNN-DD.AAAA.J.TR.OOOO (20 dígitos).
 * Onde:
 *   NNNNNNN = número sequencial do processo no ano
 *   DD = dígito verificador
 *   AAAA = ano do processo
 *   J = ramo da Justiça (1: STF, 2: CNJ, 3: STJ, 4: Justiça Federal, 5: Justiça do Trabalho, 8: Justiça Estadual)
 *   TR = tribunal do respectivo ramo
 *   OOOO = comarca / seção judiciária
 */
export function validarNumeroCnj(numeroCnjBruto: string): boolean {
  if (!numeroCnjBruto) return false;
  
  // Limpa caracteres especiais
  const apenasDigitos = numeroCnjBruto.replace(/\D/g, '');
  if (apenasDigitos.length !== 20) {
    return false;
  }

  const sequencial = apenasDigitos.substring(0, 7);
  const digitoVerificador = parseInt(apenasDigitos.substring(7, 9), 10);
  const ano = apenasDigitos.substring(9, 13);
  const ramo = apenasDigitos.substring(13, 14);
  const tribunal = apenasDigitos.substring(14, 16);
  const orgao = apenasDigitos.substring(16, 20);

  // Cálculo Módulo 97 Base 10 segundo Resolução CNJ 65/2008:
  // DV = 98 - ( (sequencial + ano + ramo + tribunal + orgao + '00') % 97 )
  const s = sequencial + ano + ramo + tribunal + orgao + '00';
  const dvCalculado = Number(98n - (BigInt(s) % 97n));

  return dvCalculado === digitoVerificador;
}

/**
 * Normaliza e formata string de 20 dígitos para o formato CNJ legível.
 */
export function formatarNumeroCnj(apenasDigitos: string): string {
  const limpo = apenasDigitos.replace(/\D/g, '');
  if (limpo.length !== 20) return apenasDigitos;
  return `${limpo.substring(0, 7)}-${limpo.substring(7, 9)}.${limpo.substring(9, 13)}.${limpo.substring(13, 14)}.${limpo.substring(14, 16)}.${limpo.substring(16, 20)}`;
}

/**
 * Parser de texto resultante de OCR de certidões judiciais do TSE.
 */
export function parsearCertidaoCriminalTseOCR(textoOcr: string): CertidaoOCRResultado {
  const errosOuAlertas: string[] = [];
  const textoLimpo = textoOcr.replace(/\r\n/g, '\n');

  // 1. Identificação do Tribunal Emissor
  let tribunalEmissor = 'Tribunal não identificado';
  if (/Supremo Tribunal Federal/i.test(textoLimpo) || /STF/i.test(textoLimpo)) {
    tribunalEmissor = 'Supremo Tribunal Federal (STF)';
  } else if (/Superior Tribunal de Justiça/i.test(textoLimpo) || /STJ/i.test(textoLimpo)) {
    tribunalEmissor = 'Superior Tribunal de Justiça (STJ)';
  } else if (/Tribunal Regional Federal da 1ª Regi[aã]o|TRF-?1/i.test(textoLimpo)) {
    tribunalEmissor = 'Tribunal Regional Federal da 1ª Região (TRF1)';
  } else if (/Tribunal Regional Federal da 2ª Regi[aã]o|TRF-?2/i.test(textoLimpo)) {
    tribunalEmissor = 'Tribunal Regional Federal da 2ª Região (TRF2)';
  } else if (/Tribunal Regional Federal da 3ª Regi[aã]o|TRF-?3/i.test(textoLimpo)) {
    tribunalEmissor = 'Tribunal Regional Federal da 3ª Região (TRF3)';
  } else if (/Tribunal Regional Federal da 4ª Regi[aã]o|TRF-?4/i.test(textoLimpo)) {
    tribunalEmissor = 'Tribunal Regional Federal da 4ª Região (TRF4)';
  } else if (/Tribunal Regional Federal da 5ª Regi[aã]o|TRF-?5/i.test(textoLimpo)) {
    tribunalEmissor = 'Tribunal Regional Federal da 5ª Região (TRF5)';
  } else if (/Tribunal de Justiça do Estado de S[aã]o Paulo|TJSP/i.test(textoLimpo)) {
    tribunalEmissor = 'Tribunal de Justiça de São Paulo (TJSP)';
  } else if (/Tribunal de Justiça do Estado do Rio de Janeiro|TJRJ/i.test(textoLimpo)) {
    tribunalEmissor = 'Tribunal de Justiça do Rio de Janeiro (TJRJ)';
  } else if (/Tribunal de Justiça do Estado de Minas Gerais|TJMG/i.test(textoLimpo)) {
    tribunalEmissor = 'Tribunal de Justiça de Minas Gerais (TJMG)';
  } else if (/Tribunal de Justiça do Estado de Alagoas|TJAL/i.test(textoLimpo)) {
    tribunalEmissor = 'Tribunal de Justiça de Alagoas (TJAL)';
  } else if (/Tribunal de Justiça do Estado do Paran[aá]|TJPR/i.test(textoLimpo)) {
    tribunalEmissor = 'Tribunal de Justiça do Paraná (TJPR)';
  } else if (/Justiça Federal/i.test(textoLimpo)) {
    tribunalEmissor = 'Justiça Federal';
  } else if (/Poder Judici[aá]rio/i.test(textoLimpo)) {
    tribunalEmissor = 'Poder Judiciário Estadual / Federal';
  }

  // 2. Tipo de certidão
  let tipoCertidao = 'Certidão Judicial';
  if (/CERTID[AÃ]O\s+(JUDICIAL\s+)?CRIMINAL/i.test(textoLimpo)) {
    tipoCertidao = 'Certidão Judicial Criminal';
  } else if (/CERTID[AÃ]O\s+DE\s+OBJETO\s+E\s+P[EÉ]/i.test(textoLimpo)) {
    tipoCertidao = 'Certidão de Objeto e Pé (Detalhada)';
  } else if (/CERTID[AÃ]O\s+DE\s+DISTRIBUI[ÇC][AÃ]O/i.test(textoLimpo)) {
    tipoCertidao = 'Certidão de Distribuição Cível e Criminal';
  } else if (/AÇÕES PENAIS/i.test(textoLimpo)) {
    tipoCertidao = 'Certidão de Ações Penais e Inquéritos';
  }

  // 3. Nome do Pesquisado
  let nomePesquisado = '';
  const matchNome = textoLimpo.match(/(?:CERTIFICA|CERTIFICO)\s+que[,\s]+revendo\s+os\s+(?:livros|assentos|registros)[\s\S]*?(?:em\s+nome\s+de|referente\s+a[:\s]+)([A-ZÁÉÍÓÚÀÃÕÂÊÔÇ\s]{4,60})/i) ||
                    textoLimpo.match(/(?:NOME|REQUERENTE|PESQUISADO)[:\s]+([A-ZÁÉÍÓÚÀÃÕÂÊÔÇ\s]{4,60})/i);
  if (matchNome && matchNome[1]) {
    nomePesquisado = matchNome[1].trim().replace(/\s+/g, ' ');
  }

  // 4. Detecção de Constatação (NADA CONSTA vs CONSTA)
  let resultadoConstatacao: 'NADA_CONSTA' | 'CONSTA' | 'INDETERMINADO' = 'INDETERMINADO';
  if (/NADA\s+CONSTA|N[AÃ]O\s+CONSTA|INEXISTEM\s+PROCESSOS/i.test(textoLimpo)) {
    resultadoConstatacao = 'NADA_CONSTA';
  } else if (/CONSTA(?:\s+o\s+seguinte|\s+distribu[ií]do|\s+processo|\s+a[çc][aã]o)|FORAM\s+ENCONTRADOS/i.test(textoLimpo)) {
    resultadoConstatacao = 'CONSTA';
  }

  // 5. Extração de Números de Processo no padrão CNJ
  // Regex para formato com pontuação: NNNNNNN-DD.AAAA.J.TR.OOOO ou sem pontuação com 20 dígitos
  const regexCnjComMascara = /\b(\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4})\b/g;
  const regexCnjApenasDigitos = /\b(\d{20})\b/g;

  const matchesEncontrados = new Set<string>();
  let match;
  while ((match = regexCnjComMascara.exec(textoLimpo)) !== null) {
    matchesEncontrados.add(match[1]);
  }
  while ((match = regexCnjApenasDigitos.exec(textoLimpo)) !== null) {
    matchesEncontrados.add(formatarNumeroCnj(match[1]));
  }

  const processosIdentificados: ProcessoExtraidoOCR[] = [];

  matchesEncontrados.forEach((numFormatado) => {
    const valido = validarNumeroCnj(numFormatado);
    if (!valido) {
      errosOuAlertas.push(`Número CNJ com dígito verificador inválido extraído do OCR: ${numFormatado}`);
    }

    // Busca contexto ao redor do número CNJ no texto
    const indice = textoLimpo.indexOf(numFormatado);
    let varaOuOrgao = undefined;
    let classeProcessual = undefined;
    let polo: 'REU' | 'INVESTIGADO' | 'AUTOR' | 'TERCEIRO' = 'REU';

    if (indice !== -1) {
      const trechoContexto = textoLimpo.substring(Math.max(0, indice - 150), Math.min(textoLimpo.length, indice + 250));
      
      const matchVara = trechoContexto.match(/(\d+ª?\s+Vara\s+(?:Criminal|Federal|Cível|da\s+Fazenda))/i);
      if (matchVara) varaOuOrgao = matchVara[1];

      const matchClasse = trechoContexto.match(/(?:Classe|Ação)[:\s]+([A-Za-záéíóúçãõ\s-]+(?:\(\d+\))?)/i) ||
                          trechoContexto.match(/(Ação Penal|Inquérito Policial|Ação Civil Pública)/i);
      if (matchClasse) classeProcessual = matchClasse[1].trim();

      if (/investigad[oa]|averiguad[oa]/i.test(trechoContexto)) {
        polo = 'INVESTIGADO';
      } else if (/r[ée]u|acusad[oa]|imputad[oa]/i.test(trechoContexto)) {
        polo = 'REU';
      }
    }

    processosIdentificados.push({
      numeroCnj: numFormatado,
      cnjValido: valido,
      tribunalIdentificado: tribunalEmissor,
      varaOuOrgao,
      classeProcessual: classeProcessual || 'Ação Penal / Processo Criminal',
      polo,
    });
  });

  // Se foram identificados processos válidos e o status era indeterminado, marca como CONSTA
  if (processosIdentificados.length > 0 && resultadoConstatacao !== 'NADA_CONSTA') {
    resultadoConstatacao = 'CONSTA';
  }

  // 6. Código de Autenticidade e Data
  const matchAutenticidade = textoLimpo.match(/(?:c[oó]digo\s+(?:de\s+)?autenticidade|autentica[çc][aã]o|valida[çc][aã]o)[:\s]+([A-Z0-9.\-_]{8,32})/i);
  const matchData = textoLimpo.match(/(?:expedi[çc][aã]o|emiss[aã]o|data(?:\s+de\s+expedi[çc][aã]o|\s+de\s+emiss[aã]o)?|emitida\s+em)[:\s]+(\d{2}\/\d{2}\/\d{4})/i) ||
                    textoLimpo.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);

  return {
    sucesso: tribunalEmissor !== 'Tribunal não identificado',
    tribunalEmissor,
    tipoCertidao,
    nomePesquisado,
    resultadoConstatacao,
    codigoAutenticidade: matchAutenticidade ? matchAutenticidade[1] : undefined,
    dataExpedicao: matchData ? matchData[1] : undefined,
    processosIdentificados,
    errosOuAlertas,
  };
}
