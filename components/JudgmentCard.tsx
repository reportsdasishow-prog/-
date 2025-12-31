
import React from 'react';
import { JudgmentCategory } from '../types';

interface JudgmentCardProps {
  category: JudgmentCategory;
  commentary: string;
  decision?: string;
}

const getCategoryStyles = (category: JudgmentCategory) => {
  switch (category) {
    case 'Разумно':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    case 'Смело':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    case 'Сомнительно':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'Рискованно':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'Ты точно подумал?':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'Это может сработать… но':
      return 'bg-sky-500/20 text-sky-400 border-sky-500/50';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
  }
};

const getIcon = (category: JudgmentCategory) => {
  switch (category) {
    case 'Разумно': return 'fa-brain';
    case 'Смело': return 'fa-bolt';
    case 'Сомнительно': return 'fa-question';
    case 'Рискованно': return 'fa-fire';
    case 'Ты точно подумал?': return 'fa-face-monocle';
    case 'Это может сработать… но': return 'fa-lightbulb';
    default: return 'fa-circle-info';
  }
};

export const JudgmentCard: React.FC<JudgmentCardProps> = ({ category, commentary, decision }) => {
  return (
    <div className={`p-6 rounded-2xl border transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-4 ${getCategoryStyles(category)}`}>
      {decision && (
        <div className="mb-4 text-sm opacity-60 italic border-b border-current pb-2">
          &ldquo;{decision}&rdquo;
        </div>
      )}
      <div className="flex items-center gap-3 mb-2">
        <i className={`fa-solid ${getIcon(category)} text-xl`}></i>
        <h3 className="text-xl font-bold uppercase tracking-wider">{category}</h3>
      </div>
      <p className="text-lg leading-relaxed text-slate-100 italic">
        {commentary}
      </p>
    </div>
  );
};
