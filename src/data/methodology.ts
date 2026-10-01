/**
 * Metodologia Pública e Versionada do Raio-X das Candidaturas 2026.
 * Versão: 1.2.0 (Setembro/2026).
 */

export const METODOLOGIA_INFO = {
  versao: '1.2.0',
  dataPublicacao: '2026-09-30',
  dataEleicao1oTurno: '2026-10-04',
  dataEleicao2oTurno: '2026-10-25',
  orgaoResponsavel: 'Observatório Cívico e de Transparência Eleitoral 2026',
  licenca: 'Creative Commons Atribuição 4.0 Internacional (CC-BY 4.0)',
  
  principios: [
    {
      titulo: '1. Neutralidade Estrita e Isonomia de Critérios',
      texto:
        'Todos os candidatos e partidos são submetidos rigorosamente aos mesmos critérios, fontes oficiais e campos de dados. Nenhum campo é preenchido manualmente ou customizado para um candidato específico. Não emitimos rankings, notas, pontuações morais, selos de qualidade ou cores arbitrárias de "bom" ou "ruim". A ordenação padrão é alfabética pelo nome de urna ou numérica pelo número na urna eletrônica.',
    },
    {
      titulo: '2. Rastreador e Rastreabilidade Total de Fontes',
      texto:
        'Todo e qualquer dado exibido na plataforma possui obrigatoriamente três metadados: (1) a instituição oficial de origem com link direto para o registro ou API; (2) a data e hora exata da coleta; e (3) a data de referência oficial do dado. Não há dados anônimos ou sem respaldo documental.',
    },
    {
      titulo: '3. Transparência de Lacunas ("Lacuna é Lacuna")',
      texto:
        'Quando uma casa legislativa ou órgão público não disponibiliza dados abertos em formato estruturado (como a maioria das Assembleias Legislativas estaduais), exibimos expressamente a mensagem: "Dado não disponível em formato aberto na fonte oficial (verificado em DD/MM/AAAA)". Nunca preenchemos com zero e nunca omitimos silenciosamente a ausência do dado.',
    },
    {
      titulo: '4. Presunção de Inocência e Rigor Jurídico',
      texto:
        'Em cumprimento estrito ao art. 5º, inciso LVII, da Constituição Federal, a existência de processo judicial não implica culpa. A plataforma diferencia expressamente os estágios processuais: Investigação ≠ Denúncia Oferecida ≠ Réu (denúncia recebida) ≠ Sentença de 1ª Instância (com recurso) ≠ Condenação Colegiada ≠ Trânsito em Julgado ≠ Absolvição/Arquivamento. Não utilizamos o rótulo vulgar "ficha suja" ou "ficha limpa": exibimos o status literal do julgamento de registro pela Justiça Eleitoral (Deferido, Indeferido com recurso, etc.).',
    },
    {
      titulo: '5. Conformidade Legal e Não-Recomendação',
      texto:
        'Em cumprimento à Lei 9.504/1997 (art. 33, §5º) e às Resoluções do TSE nº 23.610/2019 e 23.755/2026, é terminantemente proibida a realização de enquetes, votações de popularidade, termômetros eleitorais ou ferramentas de "match" e recomendação de votos por inteligência artificial. Todo o conteúdo é meramente factual e informativo.',
    },
    {
      titulo: '6. Minimização de Dados (LGPD)',
      texto:
        'Em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018, art. 7º, §§ 3º e 4º), dados sensíveis e pessoais de candidatos (CPF, título de eleitor, endereço residencial, telefone pessoal e e-mail) não são exibidos no aplicativo, no HTML exportado ou em registros de log.',
    },
  ],

  formulas: [
    {
      nome: 'Presença em Sessões Deliberativas (Câmara dos Deputados)',
      descricao:
        'Mede o comparecimento do deputado às sessões do Plenário em que houve votações e deliberações oficiais enquanto estava no exercício regular do mandato.',
      denominador: 'Total de Sessões Deliberativas do Plenário convocadas durante o exercício do mandato',
      formula:
        'Presença Estrita = (Presenças Confirmadas) / (Total de Sessões Convocadas) × 100%\nComparecimento ou Justificado = (Presenças Confirmadas + Ausências Justificadas) / (Total de Sessões Convocadas) × 100%',
      notaExecutivo:
        'Para candidatos que exerceram exclusivamente cargos no Poder Executivo (Prefeitos, Governadores ou Presidente), a presença parlamentar NÃO SE APLICA. Em seu lugar, auditamos o julgamento de contas públicas pelo TCU e Tribunais de Contas Estaduais (TCE/TCM).',
    },
    {
      nome: 'Índice de Coesão Partidária (Índice de Rice)',
      descricao:
        'Mede a concordância interna dos membros de uma bancada partidária em cada votação nominal do plenário.',
      formula: 'Rice = |% Votos "Sim" - % Votos "Não"| / (% Votos "Sim" + % Votos "Não")',
      escala:
        'Varia de 0,00 (bancada perfeitamente dividida: 50% Sim e 50% Não) a 1,00 (bancada 100% unânime no mesmo sentido).',
    },
    {
      nome: 'Taxa de Alinhamento com a Liderança do Governo',
      descricao:
        'Percentual de votos nominais de um parlamentar ou bancada que coincidem com a orientação expressa do Líder do Governo em plenário.',
      formula:
        'Alinhamento = (Votos coincidentes com a orientação do Governo) / (Votações nominais com orientação explícita do Governo) × 100%',
    },
  ],

  criteriosVotacoesRepercussao: [
    {
      codigo: 'C1',
      nome: 'Consenso de Noticiabilidade Multiveicular',
      descricao:
        'A proposição figurou na cobertura editorial de destaque em pelo menos 3 grandes organizações jornalísticas de linhas editoriais diversas ou no ranking do Congresso em Foco.',
    },
    {
      codigo: 'C2',
      nome: 'Relevância Constitucional ou Institucional',
      descricao:
        'Proposta de Emenda à Constituição (PEC), Lei Complementar (PLP), Código Nacional ou deliberação sobre Veto Presidencial.',
    },
    {
      codigo: 'C3',
      nome: 'Margem de Votação Apertada',
      descricao:
        'Diferença entre votos "Sim" e "Não" inferior ou igual a 10% do total de votantes no Plenário.',
    },
    {
      codigo: 'C4',
      nome: 'Impacto Orçamentário, Tributário ou Social Amplo',
      descricao:
        'Proposições que alteram o sistema tributário, regras fiscais da União, previdência, direitos civis ou marcos regulatórios setoriais.',
    },
    {
      codigo: 'C5',
      nome: 'Polarização de Bancadas',
      descricao:
        'Votação em que a liderança do Governo e a liderança da Oposição registraram formalmente orientações opostas no painel eletrônico.',
    },
  ],
};
