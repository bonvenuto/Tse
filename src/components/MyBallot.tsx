/**
 * Seção "Minha Cédula" — Guia do Eleitor para os 6 votos de 2026.
 * Em 2026, vota-se em: Presidente, Governador, 2 Senadores (2 vagas por UF),
 * Deputado Federal e Deputado Estadual (Distrital no DF).
 */

import React from 'react';
import { CargoEleicao } from '../types';
import { CheckSquare, ArrowRight, MapPin, Users, Vote } from 'lucide-react';

interface Props {
  ufSelecionada: string;
  onSelecionarUf: (uf: string) => void;
  onFiltrarCargo: (cargo: CargoEleicao, uf: string) => void;
  totalCandidatosUf: number;
}

const UFS_BRASIL = [
  'BR', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
  'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export const MyBallot: React.FC<Props> = ({
  ufSelecionada,
  onSelecionarUf,
  onFiltrarCargo,
  totalCandidatosUf,
}) => {
  const isDF = ufSelecionada === 'DF';

  const cargosCedula: Array<{
    cargo: CargoEleicao;
    titulo: string;
    subtitulo: string;
    ordemVotacaoUrna: number;
    digitos: number;
    descricao: string;
  }> = [
    {
      cargo: 'DEPUTADO_FEDERAL',
      titulo: 'Deputado(a) Federal',
      subtitulo: 'Câmara dos Deputados (Brasília)',
      ordemVotacaoUrna: 1,
      digitos: 4,
      descricao: 'Representa o povo da sua UF no Congresso Nacional. Legisla sobre leis federais e fiscaliza a União.',
    },
    {
      cargo: isDF ? 'DEPUTADO_DISTRITAL' : 'DEPUTADO_ESTADUAL',
      titulo: isDF ? 'Deputado(a) Distrital' : 'Deputado(a) Estadual',
      subtitulo: isDF ? 'Câmara Legislativa do DF (CLDF)' : `Assembleia Legislativa (${ufSelecionada})`,
      ordemVotacaoUrna: 2,
      digitos: 5,
      descricao: isDF
        ? 'Elabora as leis do Distrito Federal e fiscaliza o Governo do DF.'
        : `Elabora as leis do estado de ${ufSelecionada} e fiscaliza o Governo Estadual.`,
    },
    {
      cargo: 'SENADOR',
      titulo: 'Senador(a) — 1ª Vaga',
      subtitulo: 'Senado Federal (Renovação de 2/3 em 2026)',
      ordemVotacaoUrna: 3,
      digitos: 3,
      descricao: 'Representa os estados como entes federativos. Mandato de 8 anos com 2 suplentes vinculados na chapa.',
    },
    {
      cargo: 'SENADOR',
      titulo: 'Senador(a) — 2ª Vaga',
      subtitulo: 'Senado Federal (Segunda escolha obrigatória)',
      ordemVotacaoUrna: 4,
      digitos: 3,
      descricao: 'Em 2026 o eleitor vota duas vezes para o Senado, em candidatos de chapas diferentes.',
    },
    {
      cargo: 'GOVERNADOR',
      titulo: 'Governador(a) do Estado',
      subtitulo: isDF ? 'Governo do Distrito Federal' : `Poder Executivo de ${ufSelecionada}`,
      ordemVotacaoUrna: 5,
      digitos: 2,
      descricao: 'Chefe do Poder Executivo estadual. Eleito junto ao respectivo Vice-Governador.',
    },
    {
      cargo: 'PRESIDENTE',
      titulo: 'Presidente da República',
      subtitulo: 'Poder Executivo Federal',
      ordemVotacaoUrna: 6,
      digitos: 2,
      descricao: 'Chefe de Estado e de Governo da República Federativa do Brasil. Eleito junto ao Vice-Presidente.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* SELETOR DE UF E BANNER INFORMATIVO */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-stone-800" />
              Minha Cédula 2026 — Guia da Urna Eletrônica
            </h2>
            <p className="text-xs text-stone-500">
              Selecione o seu estado (UF) para auditar os candidatos dos 6 votos da eleição geral de 2026.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="select-uf-cedula" className="text-xs font-semibold text-stone-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-500" /> Sua UF:
            </label>
            <select
              id="select-uf-cedula"
              value={ufSelecionada}
              onChange={(e) => onSelecionarUf(e.target.value)}
              className="text-sm font-semibold bg-stone-50 border border-stone-300 rounded px-3 py-1.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              {UFS_BRASIL.map((uf) => (
                <option key={uf} value={uf}>
                  {uf === 'BR' ? 'Brasil (Nacional)' : uf}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resumo do Calendário Oficial */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600">
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <span className="text-stone-400 block text-[11px] uppercase">1º Turno da Eleição</span>
            <strong className="text-sm font-semibold text-stone-900 block mt-0.5">04 de Outubro de 2026</strong>
            <span className="text-[11px] text-stone-500">Todos os 6 cargos</span>
          </div>

          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <span className="text-stone-400 block text-[11px] uppercase">2º Turno (se houver)</span>
            <strong className="text-sm font-semibold text-stone-900 block mt-0.5">25 de Outubro de 2026</strong>
            <span className="text-[11px] text-stone-500">Presidente e Governador</span>
          </div>

          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <span className="text-stone-400 block text-[11px] uppercase">Regra do Senado em 2026</span>
            <strong className="text-sm font-semibold text-stone-900 block mt-0.5">2 Vagas por Estado</strong>
            <span className="text-[11px] text-stone-500">Renovação de dois terços das cadeiras</span>
          </div>
        </div>
      </div>

      {/* OS 6 CARGOS EM DISPUTA NA ORDEM DA URNA ELETRÔNICA */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            Ordem Oficial de Votação na Urna ({ufSelecionada === 'BR' ? 'Visão Geral' : `Eleitor de ${ufSelecionada}`})
          </h3>
          <span className="text-xs text-stone-500">
            Clique no cargo para consultar as candidaturas registradas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cargosCedula.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between hover:border-stone-400 transition-all space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-stone-500">
                    {item.ordemVotacaoUrna}º Voto na Urna
                  </span>
                  <span className="text-[11px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    {item.digitos} dígitos
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    {item.titulo}
                  </h4>
                  <p className="text-xs font-medium text-stone-600">
                    {item.subtitulo}
                  </p>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.descricao}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => onFiltrarCargo(item.cargo, item.cargo === 'PRESIDENTE' ? 'BR' : ufSelecionada)}
                  className="w-full text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 py-2 rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  Consultar Candidatos a {item.titulo} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
