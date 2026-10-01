/**
 * Página de Metodologia Pública e Versionada (/metodologia).
 */

import React from 'react';
import { METODOLOGIA_INFO } from '../data/methodology';
import { BookOpen, CheckCircle, Scale, ShieldAlert, Cpu } from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <header className="bg-white border border-stone-200 rounded-lg p-6 space-y-3">
        <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-stone-800" />
            <h1 className="text-xl font-serif font-bold text-stone-900">
              Metodologia Pública e Critérios de Auditoria
            </h1>
          </div>
          <span className="text-xs font-mono text-stone-600 bg-stone-100 px-2.5 py-1 rounded">
            Versão {METODOLOGIA_INFO.versao} · {METODOLOGIA_INFO.dataPublicacao}
          </span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          Documento técnico público que rege o funcionamento, a coleta, o tratamento e a apresentação dos dados das candidaturas às Eleições Gerais de 2026 no Brasil.
        </p>
      </header>

      {/* Princípios de Neutralidade */}
      <section className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
        <h2 className="text-base font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">
          Princípios Fundamentais de Neutralidade e Isonomia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-700">
          {METODOLOGIA_INFO.principios.map((p, i) => (
            <div key={i} className="p-4 bg-stone-50 rounded border border-stone-200 space-y-1.5">
              <strong className="text-stone-900 font-semibold block text-sm">
                {p.titulo}
              </strong>
              <p className="text-stone-600 leading-relaxed">
                {p.texto}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Fórmulas Matemáticas Oficiais */}
      <section className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
        <h2 className="text-base font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">
          Metodologia dos Indicadores Sensíveis
        </h2>

        <div className="space-y-4 text-xs text-stone-700">
          {METODOLOGIA_INFO.formulas.map((f, i) => (
            <div key={i} className="p-4 bg-stone-50 rounded border border-stone-200 space-y-2">
              <strong className="text-sm font-semibold text-stone-900 block">
                {f.nome}
              </strong>
              <p className="text-stone-600">{f.descricao}</p>
              
              <div className="p-3 bg-white rounded border border-stone-200 font-mono text-[11px] text-stone-800 whitespace-pre-line">
                {f.formula}
              </div>

              {f.denominador && (
                <p className="text-stone-500 text-[11px]">
                  <strong>Denominador oficial:</strong> {f.denominador}
                </p>
              )}

              {f.notaExecutivo && (
                <p className="text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200 text-[11px]">
                  <strong>Nota para o Poder Executivo:</strong> {f.notaExecutivo}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Critérios de Votações de Maior Repercussão C1 a C5 */}
      <section className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
        <h2 className="text-base font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">
          Critérios de Seleção das Votações de Maior Repercussão (C1–C5)
        </h2>
        <p className="text-xs text-stone-600">
          Para evitar subjetividade editorial, uma votação nominal só integra a lista destacada se cumprir simultaneamente pelo menos <strong>dois (2) dos cinco critérios</strong> objetivos abaixo:
        </p>

        <div className="space-y-2.5 text-xs text-stone-700">
          {METODOLOGIA_INFO.criteriosVotacoesRepercussao.map((c) => (
            <div key={c.codigo} className="p-3 bg-stone-50 rounded border border-stone-200 flex items-start gap-3">
              <span className="font-mono font-bold text-sm bg-stone-200 text-stone-800 px-2 py-0.5 rounded shrink-0">
                {c.codigo}
              </span>
              <div>
                <strong className="text-stone-900 font-semibold block">{c.nome}</strong>
                <p className="text-stone-600 mt-0.5">{c.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conformidade Legal e Regras do TSE */}
      <section className="bg-white border border-stone-200 rounded-lg p-6 space-y-3 text-xs text-stone-600 leading-relaxed">
        <h2 className="text-base font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">
          Conformidade com a Legislação Eleitoral Vigente
        </h2>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
          <li>
            <strong>Lei 9.504/1997, art. 33, §5º:</strong> Proibição absoluta de enquetes eleitorais ou termômetros de preferência do usuário.
          </li>
          <li>
            <strong>Resolução TSE nº 23.610/2019 e Res. nº 23.755/2026:</strong> Proibição a sistemas de inteligência artificial de indicar, recomendar ou ranquear candidaturas.
          </li>
          <li>
            <strong>Código Eleitoral, art. 323:</strong> Garantia de veracidade estrita dos fatos, com rastreabilidade total de URLs e documentos oficiais.
          </li>
          <li>
            <strong>Lei 13.709/2018 (LGPD):</strong> Minimização de dados com ocultação estrita de CPF, endereço residencial, telefone e e-mail.
          </li>
        </ul>
      </section>
    </div>
  );
};
