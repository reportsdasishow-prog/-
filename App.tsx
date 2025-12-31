
import React, { useState, useEffect } from 'react';
import { evaluateDecision } from './services/geminiService';
import { Judgment, HistoryItem } from './types';
import { JudgmentCard } from './components/JudgmentCard';

const App: React.FC = () => {
  const [decision, setDecision] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentJudgment, setCurrentJudgment] = useState<Judgment | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    "Консультируюсь с богами плохих решений...",
    "Опрашиваю твой здравый смысл (он занят)...",
    "Проверяю вероятность эпического провала...",
    "Анализирую последствия для твоей кармы...",
    "Ищу оправдание для этого безумия...",
  ];
  const [loadingMsg, setLoadingMsg] = useState(loadingMessages[0]);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsg(prev => {
          const idx = loadingMessages.indexOf(prev);
          return loadingMessages[(idx + 1) % loadingMessages.length];
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentJudgment(null);

    try {
      const result = await evaluateDecision(decision);
      setCurrentJudgment(result);
      
      const newItem: HistoryItem = {
        ...result,
        id: Math.random().toString(36).substring(7),
        decision: decision,
        timestamp: Date.now(),
      };
      
      setHistory(prev => [newItem, ...prev].slice(0, 10));
      setDecision('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при связи с Судьей');
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (text: string) => {
    setDecision(text);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col items-center py-8 px-4 sm:px-6 bg-[#0f172a]">
      <header className="max-w-2xl w-full text-center mb-12">
        <div className="inline-block p-3 rounded-full bg-indigo-600/20 mb-4 border border-indigo-500/30">
          <i className="fa-solid fa-gavel text-3xl text-indigo-400"></i>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Судья Жизни
        </h1>
        <p className="text-slate-400 text-lg">
          Расскажи мне о своем гениальном плане, и я скажу, насколько он... «гениален».
        </p>
      </header>

      <main className="max-w-2xl w-full space-y-8">
        <section className="glass rounded-3xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="Я решил(а)... (например, уволиться и стать фермером в Minecraft)"
                className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none placeholder:text-slate-500 text-white"
                disabled={loading}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading || !decision.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Думаю...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-bolt"></i>
                    <span>Вынести приговор</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {!currentJudgment && !loading && (
            <div className="mt-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 text-center">Или нажми на пример:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Купить крипту на все деньги",
                  "Написать бывшей в 3 часа ночи",
                  "Сделать татуировку на лбу",
                  "Уволиться без запаса денег"
                ].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleExample(ex)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {loading && (
          <div className="text-center py-12 animate-pulse">
            <p className="text-indigo-400 text-xl font-medium italic">
              {loadingMsg}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <i className="fa-solid fa-triangle-exclamation mt-1"></i>
            <div className="flex-1">
              <p className="font-bold">Ошибка</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        {currentJudgment && (
          <JudgmentCard 
            category={currentJudgment.category} 
            commentary={currentJudgment.commentary} 
          />
        )}

        {history.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest">Прошлые ошибки</h2>
              <button 
                onClick={() => setHistory([])}
                className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4"
              >
                Очистить
              </button>
            </div>
            <div className="grid gap-4">
              {history.map((item) => (
                <div key={item.id} className="opacity-80 hover:opacity-100 transition-opacity">
                   <JudgmentCard 
                    category={item.category} 
                    commentary={item.commentary}
                    decision={item.decision}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-auto py-8 text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Ироничный Судья. Используйте на свой страх и риск.</p>
      </footer>
    </div>
  );
};

export default App;
