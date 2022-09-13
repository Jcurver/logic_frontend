type TouchState = 'newBlack' | 'oldBlack' | 'newX' | 'oldX' | 'white';
export type TouchMode = 'black' | 'x' | 'removeBlack' | 'removeX';

export const TouchCase = (
	touchState: TouchState,
	mode: TouchMode
): string | void => {
	switch (mode) {
		case 'black':
			if (touchState === 'white') return 'newBlack';
			if (touchState === 'newBlack') return 'white';
			return touchState;

		case 'removeBlack':
			if (touchState === 'oldBlack') return 'white';
			return touchState;

		case 'x':
			if (touchState === 'white') return 'newX';
			if (touchState === 'newX') return 'white';
			return touchState;

		case 'removeX':
			if (touchState === 'oldX') return 'white';
			return touchState;
	}
};
