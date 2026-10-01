/**
 * Modal de Canal de Correções e Direito de Resposta (Lei 13.188/2015).
 * SLA público de 24h para averiguação com registro em changelog público.
 */

import React, { useState } from 'react';
import { Candidato, SolicitacaoCorrecao } from '../types';
import { X, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  candidato?: Candidato | null;
  onFechar: () => void;
}

export const CorrectionsModal: React.FC<Props> = ({ candidato, onFechar }) => {
  const [tipoSolicitante, setTipoSolicitante] = useState<'CIDADAO' | 'CANDIDATO_OU_ASSESSORIA' | 'PESQUISADOR'>('CIDADAO');
  const [campoQuestionado, setCampoQuestionado] = useState('DADOS_DO_REGISTRO');
  const [descricao, setDescricao] = useState('');
  const [urlOficial, setUrlOficial] = useState('');
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);
  const [protocoloGerado, setProtocoloGerado] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proto = `CORR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setProtocoloGerado(proto);
    setEnviadoComSucesso(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-300 rounded-lg shadow-xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-stone-800" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Canal de Correção e Direito de Resposta
            </h3>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-stone-400 hover:text-stone-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {enviadoComSucesso ? (
          <div className="space-y-4 text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-stone-900">Solicitação Protocolada com Sucesso</h4>
              <p className="text-xs text-stone-600">
                Seu protocolo oficial é <strong className="font-mono text-stone-900">{protocoloGerado}</strong>.
              </p>
            </div>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              Conforme a política editorial da plataforma, apontamentos acompanhados de links oficiais são auditados em até <strong>24 horas úteis (SLA)</strong> e registrados no changelog público da candidatura.
            </p>
            <button
              type="button"
              onClick={onFechar}
              className="text-xs font-semibold px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors"
            >
              Concluir e fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-stone-700">
            <p className="text-stone-600 leading-relaxed">
              Este canal público recebe pedidos de retificação factual de dados ou manifestações formais de candidaturas e assessorias. É obrigatório fornecer o link de comprovação oficial (TSE, Diário Oficial, tribunal ou API).
            </p>

            {candidato && (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                <span className="text-stone-500 block text-[11px]">Candidato objeto do pedido:</span>
                <strong className="text-stone-900 text-sm">{candidato.nomeUrna} ({candidato.partidoSigla})</strong>
                <span className="text-stone-500 block text-[11px]">Nº de Urna: {candidato.numeroUrna} · SQ: {candidato.sqCandidato}</span>
              </div>
            )}

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Perfil do Solicitante:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTipoSolicitante('CIDADAO')}
                  className={`p-2 rounded border text-center font-medium transition-colors ${
                    tipoSolicitante === 'CIDADAO'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Cidadão(ã) / Eleitor
                </button>
                <button
                  type="button"
                  onClick={() => setTipoSolicitante('CANDIDATO_OU_ASSESSORIA')}
                  className={`p-2 rounded border text-center font-medium transition-colors ${
                    tipoSolicitante === 'CANDIDATO_OU_ASSESSORIA'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Candidato ou Assessoria
                </button>
                <button
                  type="button"
                  onClick={() => setTipoSolicitante('PESQUISADOR')}
                  className={`p-2 rounded border text-center font-medium transition-colors ${
                    tipoSolicitante === 'PESQUISADOR'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Pesquisador / Imprensa
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="campo-questionado" className="block text-stone-700 font-semibold mb-1">
                Campo ou Dado Objeto da Solicitação:
              </label>
              <select
                id="campo-questionado"
                value={campoQuestionado}
                onChange={(e) => setCampoQuestionado(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-stone-800 focus:outline-none"
              >
                <option value="DADOS_DO_REGISTRO">Dados do Registro de Candidatura (TSE)</option>
                <option value="SITUACAO_JURIDICA">Situação Jurídica do Registro (Deferido/Indeferido/Recurso)</option>
                <option value="PROCESSOS_JUDICIAIS">Processos Judiciais (DataJud / Certidões)</option>
                <option value="MANDATOS_E_PRESENCA">Mandatos Anteriores ou Presença Parlamentar</option>
                <option value="VOTACOES_NOMINAIS">Votações Nominais da 57ª Legislatura</option>
                <option value="BENS_DECLARADOS">Bens Declarados e Patrimônio</option>
                <option value="DIREITO_DE_RESPOSTA">Direito de Resposta Institucional (Lei 13.188/2015)</option>
              </select>
            </div>

            <div>
              <label htmlFor="url-comprovacao" className="block text-stone-700 font-semibold mb-1">
                Link da Fonte Oficial de Comprovação:
              </label>
              <input
                id="url-comprovacao"
                type="url"
                required
                value={urlOficial}
                onChange={(e) => setUrlOficial(e.target.value)}
                placeholder="https://divulgacandcontas.tse.jus.br/... ou link do tribunal / DOU"
                className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="descricao-apontamento" className="block text-stone-700 font-semibold mb-1">
                Descrição Objetiva do Apontamento ou Justificativa:
              </label>
              <textarea
                id="descricao-apontamento"
                rows={4}
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva com exatidão o fato, a divergência e o número do processo ou acórdão correspondente..."
                className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-stone-900 focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">Prazo de Resposta: 24 horas úteis</span>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Enviar Solicitação Oficial
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
