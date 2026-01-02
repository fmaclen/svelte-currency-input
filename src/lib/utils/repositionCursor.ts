type RepositionCursorProps = {
	selectionStart?: number | null;
	value: string;
	lastKeyStroke: string | null;
	stateValue?: string;
	groupSeparator?: string;
};

export const repositionCursor = ({
	selectionStart,
	value,
	lastKeyStroke,
	stateValue,
	groupSeparator
}: RepositionCursorProps): {
	modifiedValue: string;
	cursorPosition: number | null | undefined;
} => {
	let cursorPosition = selectionStart;
	let modifiedValue = value;
	if (stateValue && cursorPosition) {
		const splitValue = value.split('');
		if (lastKeyStroke === 'Backspace' && stateValue[cursorPosition] === groupSeparator) {
			splitValue.splice(cursorPosition - 1, 1);
			cursorPosition -= 1;
		}
		if (lastKeyStroke === 'Delete' && stateValue[cursorPosition] === groupSeparator) {
			splitValue.splice(cursorPosition, 1);
			cursorPosition += 1;
		}
		modifiedValue = splitValue.join('');
		return { modifiedValue, cursorPosition };
	}

	return { modifiedValue, cursorPosition: selectionStart };
};
