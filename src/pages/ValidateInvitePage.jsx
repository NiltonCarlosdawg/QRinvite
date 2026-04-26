import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, LoaderCircle } from 'lucide-react';
import { useInvite } from '../hooks/useInvite';

export default function ValidateInvitePage() {
  const { qrCode } = useParams();
  const { verifyInvite } = useInvite();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);

  const runValidation = async () => {
    try {
      setRetrying(true);
      setError('');
      const response = await verifyInvite(qrCode);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Não foi possível validar o convite.');
    } finally {
      setRetrying(false);
    }
  };

  useEffect(() => {
    runValidation();
  }, [qrCode, verifyInvite]);

  const convite = result?.convite;

  return (
    <main className="max-w-3xl mx-auto py-12">
      <div className="rounded-[32px] border border-champagne-300 bg-pearl-50 shadow-xl p-8 md:p-12 text-center">
        {!result && !error && (
          <>
            <LoaderCircle className="w-14 h-14 mx-auto text-olive-700 animate-spin mb-6" />
            <h1 className="text-4xl font-serif text-olive-800 mb-3">A validar convite</h1>
            <p className="text-olive-600">O estado será atualizado para usado assim que a verificação for confirmada.</p>
          </>
        )}

        {result && result.valido && (
          <>
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-600 mb-6" />
            <h1 className="text-4xl font-serif text-olive-800 mb-3">Convite confirmado</h1>
            <p className="text-green-700 mb-8">{result.mensagem}</p>
            <div className="rounded-2xl bg-white border border-green-200 p-6 text-left max-w-xl mx-auto">
              <p className="text-sm text-olive-500 uppercase tracking-[0.25em] mb-3">Detalhes</p>
              <p className="text-2xl font-serif text-olive-800">{convite?.nome_evento}</p>
              <p className="text-olive-700 mt-2">
                {[convite?.nome_convidado1, convite?.nome_convidado2].filter(Boolean).join(' & ')}
              </p>
              <p className="text-olive-600 mt-2">{convite?.local_evento}</p>
            </div>
          </>
        )}

        {result && !result.valido && (
          <>
            <XCircle className="w-16 h-16 mx-auto text-amber-600 mb-6" />
            <h1 className="text-4xl font-serif text-olive-800 mb-3">Convite já utilizado</h1>
            <p className="text-amber-700 mb-8">{result.mensagem}</p>
            {convite && (
              <div className="rounded-2xl bg-white border border-amber-200 p-6 text-left max-w-xl mx-auto">
                <p className="text-sm text-olive-500 uppercase tracking-[0.25em] mb-3">Convite</p>
                <p className="text-2xl font-serif text-olive-800">{convite.nome_evento}</p>
                <p className="text-olive-700 mt-2">
                  {[convite.nome_convidado1, convite.nome_convidado2].filter(Boolean).join(' & ')}
                </p>
              </div>
            )}
          </>
        )}

        {error && (
          <>
            <XCircle className="w-16 h-16 mx-auto text-red-600 mb-6" />
            <h1 className="text-4xl font-serif text-olive-800 mb-3">Validação falhou</h1>
            <p className="text-red-700 mb-8">{error}</p>
            <button
              onClick={runValidation}
              disabled={retrying}
              className="inline-flex px-6 py-3 rounded-full bg-green-700 text-white disabled:opacity-60"
            >
              {retrying ? 'A validar...' : 'Tentar novamente'}
            </button>
          </>
        )}

        <div className="mt-10">
          <Link to="/" className="inline-flex px-6 py-3 rounded-full bg-olive-800 text-pearl-50">
            Voltar ao painel
          </Link>
        </div>
      </div>
    </main>
  );
}
