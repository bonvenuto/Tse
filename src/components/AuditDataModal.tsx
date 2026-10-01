/**
 * Modal para Auditoria de Dados em JSON.
 * Permite aos eleitores e pesquisadores auditarem o objeto completo do candidato.
 */

import React, { useState } from 'react';
import { Candidato } from '../types';
import { X, Copy, Download, Check } from 'lucide-react';

interface Props {
  candidato: Candidato;
  onFechar: () => void;
}

export const AuditDataModal: React.FC<Props> = ({ candidato, onFechar }) => {
  const [copiado, setCopiado] = useState(false);

  const jsonString = JSON.stringify(candidato, null, 2);

  const handleCopiar = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidatura_2026_${candidato.uf}_${candidato.numeroUrna}_${candidato.nomeUrna.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-300 rounded-lg shadow-xl max-w-3xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 shrink-0">
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900">
              Auditoria de Dados Brutos (JSON) — {candidato.nomeUrna}
            </h3>
            <p className="text-xs text-stone-500">
              SQ: {candidato.sqCandidato} · Dados extraídos conforme o schema de Dados Abertos 2026
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-stone-400 hover:text-stone-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-stone-900 text-stone-100 p-4 rounded-md font-mono text-[11px] leading-relaxed select-all">
          <pre>{jsonString}</pre>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100 shrink-0 text-xs">
          <span className="text-stone-500">Minimização LGPD ativa: sem CPF, título ou endereço</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopiar}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiado ? 'Copiado' : 'Copiar JSON'}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Baixar Arquivo .json
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
