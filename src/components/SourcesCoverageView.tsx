/**
 * Página de Fontes e Cobertura (/fontes-e-cobertura).
 * Tabela de cobertura das 27 UFs e órgãos de dados abertos.
 */

import React, { useState } from 'react';
import { FONTES_COBERTURA } from '../data/sourcesCoverage';
import { Database, ExternalLink, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';

const STATUS_BADGE: Record<string, { label: string; icon: any; text: string }> = {
  DADOS_ABERTOS_COMPLETOS: { label: 'Dados Abertos Completos', icon: CheckCircle2, text: 'text-emerald-800' },
  DADOS_PARCIAIS: { label: 'Dados Parciais / Incompletos', icon: AlertTriangle, text: 'text-amber-800' },
  SEM_DADOS_ABERTOS: { label: 'Sem Dados Abertos Estruturados', icon: XCircle, text: 'text-stone-500' },
  SOLICITACAO_LAI: { label: 'Pedido LAI em Tramitação', icon: AlertTriangle, text: 'text-stone-700' },
};

export const SourcesCoverageView: React.FC = () => {
  const [busca, setBusca] = useState('');

  const fontesFiltradas = FONTES_COBERTURA.filter(
    (f) =>
      f.fonte.toLowerCase().includes(busca.toLowerCase()) ||
      f.uf.toLowerCase().includes(busca.toLowerCase()) ||
      f.casa.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-stone-800" />
              Fontes Oficiais e Cobertura de Dados por UF
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Transparência total sobre quais órgãos e assembleias disponibilizam dados abertos e onde há lacunas institucionais.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Filtrar por UF ou órgão..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded text-stone-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Princípio "Lacuna é lacuna" */}
        <div className="p-3.5 bg-stone-50 rounded border border-stone-200 text-xs text-stone-700">
          <p className="leading-relaxed">
            <strong>Princípio da Transparência Ativa:</strong> Quando uma Assembleia Legislativa estadual não oferece API ou arquivos abertos de votações nominais e presenças, nós não inventamos estimativas nem atribuímos zero. Exibimos a ausência oficial com a data da última auditoria.
          </p>
        </div>
      </div>

      {/* Tabela de Cobertura */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th scope="col" className="p-3.5">Órgão / Fonte</th>
                <th scope="col" className="p-3.5">Âmbito / UF</th>
                <th scope="col" className="p-3.5 text-center">API</th>
                <th scope="col" className="p-3.5 text-center">Votação Nominal</th>
                <th scope="col" className="p-3.5 text-center">Presença</th>
                <th scope="col" className="p-3.5">Status de Abertura</th>
                <th scope="col" className="p-3.5">Observações de Auditoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {fontesFiltradas.map((fonte, idx) => {
                const badge = STATUS_BADGE[fonte.statusAbertura] || STATUS_BADGE.SEM_DADOS_ABERTOS;
                const Icone = badge.icon;

                return (
                  <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3.5 font-medium text-stone-900">
                      {fonte.fonte}
                    </td>
                    <td className="p-3.5 font-semibold text-stone-800">
                      {fonte.uf}
                    </td>
                    <td className="p-3.5 text-center font-mono">
                      {fonte.temApi ? <span className="text-emerald-700">Sim</span> : <span className="text-stone-400">Não</span>}
                    </td>
                    <td className="p-3.5 text-center font-mono">
                      {fonte.temVotacaoNominal ? <span className="text-emerald-700">Sim</span> : <span className="text-stone-400">Não</span>}
                    </td>
                    <td className="p-3.5 text-center font-mono">
                      {fonte.temPresenca ? <span className="text-emerald-700">Sim</span> : <span className="text-stone-400">Não</span>}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${badge.text}`}>
                        <Icone className="w-3.5 h-3.5 shrink-0" />
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-600 max-w-xs text-[11px] leading-relaxed">
                      {fonte.observacao}
                      <span className="block text-stone-400 text-[10px] mt-0.5">
                        Verificado em: {fonte.verificadoEm}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
