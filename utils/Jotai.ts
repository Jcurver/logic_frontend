import { atom } from 'jotai';
import { TouchMode } from '../components/board/interface';

export const TouchModeAtom = atom<TouchMode>('black');
export const LeftLineFinish = atom<boolean[]>(
	Array.from({ length: 20 }, () => false)
);
export const TopLineFinish = atom<boolean[]>(
	Array.from({ length: 20 }, () => false)
);
