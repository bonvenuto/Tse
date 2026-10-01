/**
 * Top Navigation Bar — Contrato de 3 Zonas (Frontend Design Skill).
 *
 * Zone 1: Brand title (texto único sem subtítulos mecânicos)
 * Zone 2: Links de navegação em texto com hover limpo
 * Zone 3: Ação primária (Canal de Correções / Direito de Resposta)
 */

import React from 'react';
import { Scale, MessageSquareQuote, CheckSquare, Users, Building2, BookOpen, Database } from 'lucide-react';

export type SecaoAtiva =
  | 'CEDULA'
  | 'CANDIDATOS'
  | 'COMPARADOR'
  | 'PARTIDOS'
  | 'METODOLOGIA'
  | 'FONTES_COBERTURA';

interface Props {
  secaoAtiva: SecaoAtiva;
  onNavegar: (secao: SecaoAtiva) => void;
  onAbrirCorrecoes: () => void;
  qtdComparador: number;
}

export const Navbar: React.FC<Props> = ({
  secaoAtiva,
  onNavegar,
  onAbrirCorrecoes,
  qtdComparador,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* ZONA 1: BRAND TITLE (TEXTO ÚNICO) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavegar('CEDULA')}
            className="text-left group"
          >
            <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 tracking-tight block group-hover:text-stone-700 transition-colors">
              Raio-X das Candidaturas 2026
            </span>
          </button>
        </div>

        {/* ZONA 2: LINKS DE NAVEGAÇÃO LIMPOS (4-6 ITENS) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-stone-600">
          <button
            type="button"
            onClick={() => onNavegar('CEDULA')}
            className={`transition-colors pb-1 border-b-2 ${
              secaoAtiva === 'CEDULA'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Minha Cédula
          </button>

          <button
            type="button"
            onClick={() => onNavegar('CANDIDATOS')}
            className={`transition-colors pb-1 border-b-2 ${
              secaoAtiva === 'CANDIDATOS'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Candidaturas
          </button>

          <button
            type="button"
            onClick={() => onNavegar('COMPARADOR')}
            className={`transition-colors pb-1 border-b-2 flex items-center gap-1 ${
              secaoAtiva === 'COMPARADOR'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <span>Comparador</span>
            {qtdComparador > 0 && (
              <span className="font-mono text-[10px] bg-stone-800 text-white px-1.5 py-0.2 rounded-full tabular-nums">
                {qtdComparador}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavegar('PARTIDOS')}
            className={`transition-colors pb-1 border-b-2 ${
              secaoAtiva === 'PARTIDOS'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Partidos & Fundos
          </button>

          <button
            type="button"
            onClick={() => onNavegar('METODOLOGIA')}
            className={`transition-colors pb-1 border-b-2 ${
              secaoAtiva === 'METODOLOGIA'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Metodologia
          </button>

          <button
            type="button"
            onClick={() => onNavegar('FONTES_COBERTURA')}
            className={`transition-colors pb-1 border-b-2 ${
              secaoAtiva === 'FONTES_COBERTURA'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Fontes & Cobertura
          </button>
        </nav>

        {/* ZONA 3: AÇÕES PRIMÁRIAS */}
        <div className="flex items-center gap-2">
          {/* Botão de Comparador Mobile */}
          <button
            type="button"
            onClick={() => onNavegar('COMPARADOR')}
            className="lg:hidden p-2 text-stone-700 bg-white border border-stone-200 rounded relative"
            title="Abrir comparador"
          >
            <Scale className="w-4 h-4" />
            {qtdComparador > 0 && (
              <span className="absolute -top-1 -right-1 font-mono text-[9px] bg-stone-900 text-white w-4 h-4 rounded-full flex items-center justify-center">
                {qtdComparador}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onAbrirCorrecoes}
            className="px-3 py-1.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-stone-700" />
            <span className="hidden sm:inline">Canal de Correções & Direito de Resposta</span>
            <span className="sm:hidden">Correções</span>
          </button>
        </div>
      </div>

      {/* Menu secundário para dispositivos móveis */}
      <div className="lg:hidden flex items-center gap-3 px-4 py-2 border-t border-stone-200 text-xs overflow-x-auto bg-stone-50/80">
        <button
          type="button"
          onClick={() => onNavegar('CEDULA')}
          className={`whitespace-nowrap px-2 py-1 rounded ${secaoAtiva === 'CEDULA' ? 'font-semibold text-stone-900 bg-stone-200' : 'text-stone-600'}`}
        >
          Minha Cédula
        </button>
        <button
          type="button"
          onClick={() => onNavegar('CANDIDATOS')}
          className={`whitespace-nowrap px-2 py-1 rounded ${secaoAtiva === 'CANDIDATOS' ? 'font-semibold text-stone-900 bg-stone-200' : 'text-stone-600'}`}
        >
          Candidaturas
        </button>
        <button
          type="button"
          onClick={() => onNavegar('PARTIDOS')}
          className={`whitespace-nowrap px-2 py-1 rounded ${secaoAtiva === 'PARTIDOS' ? 'font-semibold text-stone-900 bg-stone-200' : 'text-stone-600'}`}
        >
          Partidos
        </button>
        <button
          type="button"
          onClick={() => onNavegar('METODOLOGIA')}
          className={`whitespace-nowrap px-2 py-1 rounded ${secaoAtiva === 'METODOLOGIA' ? 'font-semibold text-stone-900 bg-stone-200' : 'text-stone-600'}`}
        >
          Metodologia
        </button>
        <button
          type="button"
          onClick={() => onNavegar('FONTES_COBERTURA')}
          className={`whitespace-nowrap px-2 py-1 rounded ${secaoAtiva === 'FONTES_COBERTURA' ? 'font-semibold text-stone-900 bg-stone-200' : 'text-stone-600'}`}
        >
          Fontes
        </button>
      </div>
    </header>
  );
};
