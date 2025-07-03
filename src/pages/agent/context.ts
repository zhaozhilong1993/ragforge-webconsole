import { RAGForgeNodeType } from '@/interfaces/database/flow';
import { createContext } from 'react';

export const FlowFormContext = createContext<RAGForgeNodeType | undefined>(
  undefined,
);
