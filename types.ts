
export type JudgmentCategory = 
  | 'Смело'
  | 'Разумно'
  | 'Сомнительно'
  | 'Рискованно'
  | 'Ты точно подумал?'
  | 'Это может сработать… но';

export interface Judgment {
  category: JudgmentCategory;
  commentary: string;
}

export interface HistoryItem extends Judgment {
  id: string;
  decision: string;
  timestamp: number;
}
