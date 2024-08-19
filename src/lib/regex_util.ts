export function generateDoubleRangeRegex(min: number, max: number) {
	if (min > max) {
		throw new Error('Min value should be less than max value.');
	}

	const minStr = min.toString();
	const maxStr = max.toString();

	const escapeDecimal = (str: string) => str.replace('.', '\\.');

	const minRegex = `-?(${escapeDecimal(minStr)}|[${minStr.charAt(0)}-${maxStr.charAt(0)}][0-9]*\\.?[0-9]*)`;
	const maxRegex = `-?(${escapeDecimal(maxStr)}|[${minStr.charAt(0)}-${maxStr.charAt(0)}][0-9]*\\.?[0-9]*)`;

	const rangeRegex = `^(${minRegex}|${maxRegex})$`;

	return new RegExp(rangeRegex);
}
