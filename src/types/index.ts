/**
 * Tipos e modelos de dados para o Raio-X das Candidaturas 2026.
 * Neutro, auditável e estritamente rastreável a fontes oficiais.
 */

export type CargoEleicao =
  | 'PRESIDENTE'
  | 'VICE_PRESIDENTE'
  | 'GOVERNADOR'
  | 'VICE_GOVERNADOR'
  | 'SENADOR'
  | 'SUPLENTE_1'
  | 'SUPLENTE_2'
  | 'DEPUTADO_FEDERAL'
  | 'DEPUTADO_ESTADUAL'
  | 'DEPUTADO_DISTRITAL';

export type SituacaoRegistroTSE =
  | 'DEFERIDO'
  | 'DEFERIDO_COM_RECURSO'
  | 'INDEFERIDO'
  | 'INDEFERIDO_COM_RECURSO'
  | 'AGUARDANDO_JULGAMENTO'
  | 'RENUNCIA'
  | 'CANCELADO'
  | 'CASSADO';

export type CasaLegislativa =
  | 'CAMARA_DOS_DEPUTADOS'
  | 'SENADO_FEDERAL'
  | 'ASSEMBLEIA_LEGISLATIVA'
  | 'CAMARA_LEGISLATIVA_DF'
  | 'CAMARA_MUNICIPAL'
  | 'PODER_EXECUTIVO';

export interface FonteMetadados {
  nomeFonte: string;
  urlOficial: string;
  endpoint?: string;
  dataColeta: string; // ISO 8601
  dataReferenciaDado: string;
  hashIntegridade?: string;
  licenca: string;
}

export interface MandatoAnterior {
  id: string;
  casaLegislativa: CasaLegislativa;
  cargo: string;
  legislatura?: string; // ex: "57ª (2023–2027)", "56ª (2019–2023)"
  uf: string;
  partidoNaEpoca: string;
  dataInicio: string; // YYYY-MM-DD
  dataFim: string; // YYYY-MM-DD ou "Em exercício"
  motivoTermino?: string; // "Término regular", "Licença saúde", "Renúncia para assumir outro cargo", "Em exercício"
  idExternoCasa: string; // ex: id do deputado na API da Câmara (ex: 204536) ou Senado (ex: 5982)
  urlPerfilOficial: string;
  fonte: FonteMetadados;
}

export type VotoTipo =
  | 'SIM'
  | 'NAO'
  | 'ABSTENCAO'
  | 'OBSTRUCAO'
  | 'ARTIGO_17' // Presidente da sessão que não vota regimentalmente
  | 'AUSENTE_JUSTIFICADO'
  | 'AUSENTE_NAO_JUSTIFICADO'
  | 'NAO_APLICAVEL';

export type OrientacaoBancada =
  | 'SIM'
  | 'NAO'
  | 'LIBERADO'
  | 'OBSTRUCAO'
  | 'SEM_ORIENTACAO';

export interface VotacaoNominal {
  idVotacao: string;
  casa: CasaLegislativa;
  dataHora: string; // YYYY-MM-DD HH:mm
  siglaTipoProposicao: string; // ex: "PEC", "PLP", "PL"
  numeroProposicao: string; // ex: "45/2019"
  tituloResumido: string;
  ementaOficial: string;
  votoCandidato: VotoTipo;
  orientacaoPartido: OrientacaoBancada;
  orientacaoGoverno: OrientacaoBancada;
  alinhouComPartido: boolean;
  alinhouComGoverno: boolean;
  resultadoAprovado: boolean;
  placarOficial: {
    sim: number;
    nao: number;
    abstencao: number;
    outros: number;
    totalVotantes: number;
  };
  criteriosRepercussao?: Array<'C1' | 'C2' | 'C3' | 'C4' | 'C5'>;
  urlOficialVotacao: string;
  fonte: FonteMetadados;
}

export interface PresencaEstatistica {
  casa: CasaLegislativa;
  periodoReferencia: string; // ex: "57ª Legislatura (2023–2026)"
  totalSessoesDeliberativasConvocadas: number; // Denominador oficial
  presencasConfirmadas: number;
  ausenciasJustificadas: number;
  ausenciasNaoJustificadas: number;
  percentualPresencaEstrita: number; // presenças / total
  percentualComparecimentoOuJustificado: number; // (presencas + justificadas) / total
  explicacaoMetodologica: string;
  fonte: FonteMetadados;
}

export interface BemItem {
  ordem: number;
  descricao: string;
  tipoBem: string;
  valor: number;
}

export interface EvolucaoPatrimonialAno {
  anoEleicao: number;
  totalBens: number;
  cargoDisputado: string;
}

export type FaseProcessual =
  | 'INVESTIGACAO'
  | 'DENUNCIA_OFERECIDA'
  | 'REU'
  | 'SENTENCA_1A_INSTANCIA'
  | 'CONDENACAO_COLEGIADA'
  | 'TRANSITO_EM_JULGADO'
  | 'ABSOLVICAO_OU_ARQUIVAMENTO';

export interface ProcessoJudicial {
  id: string;
  numeroCnj: string; // formato NNNNNNN-DD.AAAA.J.TR.OOOO
  tribunal: string; // ex: "Supremo Tribunal Federal (STF)", "Tribunal de Justiça de SP (TJSP)"
  classeTpu: string; // ex: "Ação Penal (Classe 1726)"
  assuntosTpu: string[]; // ex: ["Crimes contra a Administração Pública", "Dispensa indevida de licitação"]
  faseProcessual: FaseProcessual;
  faseProcessualDescricao: string; // descrição clara da fase
  poloProcessual: 'INVESTIGADO' | 'REU' | 'REQUERIDO' | 'RECORRENTE' | 'EXEQUENTE';
  descricaoObjeto: string; // descrição fática objetiva sem juízo moral
  dataUltimaMovimentacao?: string;
  dataUltimaVerificacao: string; // YYYY-MM-DD
  urlOficialTribunal: string;
  origemIdentificacao: 'CERTIDAO_CRIMINAL_TSE_OCR' | 'DATAJUD_PUBLICO' | 'PORTAL_TRIBUNAL';
  observacaoProcedimental?: string;
  fonte: FonteMetadados;
}

export interface ElegibilidadeControle {
  tcuCadirreg: {
    consta: boolean;
    ultimaVerificacao: string;
    numeroProcesso?: string;
    numeroAcordao?: string;
    orgaoJulgador?: string;
    anoJulgamento?: number;
    descricao?: string;
    linkCertidao?: string;
  };
  cguCeisCnep: {
    consta: boolean;
    ultimaVerificacao: string;
    cadastro?: string;
    linkConsulta: string;
    descricao?: string;
  };
  cnjImprobidade: {
    consta: boolean;
    ultimaVerificacao: string;
    descricao?: string;
    linkConsulta: string;
  };
  certidoesCriminaisApresentadasTse: {
    qtdApresentadas: number;
    urlConsultaTse: string;
    verificadoEm: string;
  };
  fonte: FonteMetadados;
}

export interface CandidatoChapaItem {
  cargo: CargoEleicao;
  nomeUrna: string;
  numeroUrna: string;
  partido: string;
  fotoUrl: string;
  sqCandidato: string;
}

export type PosicaoTemaTipo =
  | 'FAVORAVEL'
  | 'CONTRARIO'
  | 'ASSINOU_PROPOSTA'
  | 'NAO_ASSINOU'
  | 'ABSTENCAO'
  | 'NAO_SE_APLICA'
  | 'SEM_REGISTRO';

export interface PosicionamentoTemaDestaque {
  temaId: 'PEC_BLINDAGEM' | 'FIM_ESCALA_6X1';
  tituloTema: string;
  descricaoTema: string;
  posicaoCandidato: PosicaoTemaTipo;
  posicaoRotulo: string; // ex: "A favor", "Contra", "Assinou a PEC", "Não assinou"
  detalheAcao: string; // ex: "Votou Sim na PEC 3/2021 / PEC 28/2024" ou "Signatário da PEC da Jornada 4x3 (Erika Hilton)"
  dataRegistro: string;
  posicaoPartidoNaEpoca: string; // ex: "Orientou Sim", "Orientou Não", "Bancada majoritariamente favorável"
  urlFonteOficial: string;
}

export interface ItemMidiaInvestigacao {
  id: string;
  tituloNoticia: string;
  veiculo: string; // ex: "Folha de S.Paulo", "O Estado de S. Paulo", "G1", "CNN Brasil", "Poder360"
  dataPublicacao: string; // YYYY-MM-DD
  fatoConcretoApurado: string; // descrição fática sem juízo moral
  faseJuridicaNaData: string; // ex: "Inquérito policial / busca e apreensão", "Denúncia da PGR"
  statusJuridicoAtual: string; // ex: "Inquérito arquivado pelo STF em 2024", "Ação Penal em instrução", "Sem indiciamento"
  outroLado: string; // manifestação ou nota da assessoria jurídica do candidato
  urlMateria: string;
  fonte: FonteMetadados;
}

export interface Candidato {
  sqCandidato: string; // Sequencial único do TSE (2026)
  anoEleicao: 2026;
  uf: string; // "BR" para presidente, "SP", "RJ", etc.
  cargo: CargoEleicao;
  nomeUrna: string;
  nomeCivilNormalizado: string; // Sem CPF ou dados pessoais conforme LGPD
  numeroUrna: string;
  partidoSigla: string;
  partidoNumero: number;
  federacaoColigacaoNome?: string;
  situacaoRegistroTSE: SituacaoRegistroTSE;
  motivoSituacaoRegistroTSE: string;
  urlProcessoRegistroTSE: string;
  fotoUrl: string;
  
  // Perfil e Registro
  ocupacaoDeclarada: string;
  grauInstrucao: string;
  corRacaDeclarada: string;
  municipioNascimento: string;
  ufNascimento: string;
  idadeDeclarada: number;
  concorreReeleicao: boolean;
  jaExerceuMandato: boolean;
  
  // Bens e Proposta
  totalBensDeclarados2026: number;
  itensBensDeclarados: BemItem[];
  evolucaoPatrimonial: EvolucaoPatrimonialAno[];
  urlPropostaGovernoPdf?: string;
  eixosPropostaGoverno?: string[];

  // Componentes vinculados da chapa
  chapaVinculada?: CandidatoChapaItem[];

  // Mandatos e Atuação Parlamentar (foco do prompt)
  mandatosAnteriores: MandatoAnterior[];
  presencaParlamentarRecente?: PresencaEstatistica;
  ultimas20VotacoesNominais: VotacaoNominal[];

  // Posicionamentos em Temas de Grande Repercussão (PEC da Blindagem e Fim da Escala 6x1)
  posicionamentosTemas: PosicionamentoTemaDestaque[];
  
  // Elegibilidade e Órgãos de Controle
  elegibilidadeControle: ElegibilidadeControle;
  processosJudiciais: ProcessoJudicial[];

  // Mídia Factual e Menções em Operações / Investigações com Outro Lado
  noticiarioInvestigacoes: ItemMidiaInvestigacao[];
  
  // Fontes e Metadados do Registro
  metadadosColeta: FonteMetadados;
  historicoAlteracoesPerfil: Array<{
    data: string;
    descricao: string;
    autor: string;
  }>;
}

export interface PosicionamentoPartidoTema {
  posicaoResumida: 'FAVORAVEL' | 'CONTRARIA' | 'LIBERADA' | 'DIVIDIDA';
  rotuloExibicao: string; // ex: "A favor (92% da bancada)", "Contra (88% da bancada)", "Bancada liberada"
  orientacaoBancada: string;
  descricao: string;
  percentualAdesao?: number; // % da bancada que apoiou ou assinou
  urlFonte: string;
}

export interface PartidoInfo {
  sigla: string;
  numero: number;
  nomeOficial: string;
  federacao?: string;
  bancadaCamara2026: number;
  bancadaSenado2026: number;
  fefc2026Valor: number; // Fundo Especial de Financiamento de Campanha oficial
  fundoPartidarioAnual: number;
  indiceCoesaoRiceMedio: number; // 0.00 a 1.00
  alinhamentoGovernoMedio: number; // 0% a 100%
  posicaoPecBlindagem: PosicionamentoPartidoTema;
  posicaoFimEscala6x1: PosicionamentoPartidoTema;
  urlEstatutoOficialTSE: string;
  urlProgramaOficialTSE: string;
  fonte: FonteMetadados;
}

export interface FonteCoberturaItem {
  fonte: string;
  uf: string;
  casa: string;
  temApi: boolean;
  temVotacaoNominal: boolean;
  temPresenca: boolean;
  formato: string;
  statusAbertura: 'DADOS_ABERTOS_COMPLETOS' | 'DADOS_PARCIAIS' | 'SEM_DADOS_ABERTOS' | 'SOLICITACAO_LAI';
  verificadoEm: string;
  observacao: string;
}

export interface SolicitacaoCorrecao {
  id: string;
  protocolo: string;
  dataHora: string;
  sqCandidato?: string;
  nomeCandidato?: string;
  tipoSolicitante: 'CANDIDATO_OU_ASSESSORIA' | 'CIDADAO' | 'PESQUISADOR';
  campoQuestionado: string;
  descricaoApontamento: string;
  urlComprovacaoOficial: string;
  status: 'RECEBIDO' | 'EM_ANALISE' | 'DEFERIDO' | 'INDEFERIDO';
  respostaPublica?: string;
  prazoSlaHoras: 24;
}
