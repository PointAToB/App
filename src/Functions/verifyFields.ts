

export function isEmpty(...fields: string[]): boolean {
	return fields.some(item => item === '')
}

export function verifyPassword(password: string): {success: boolean, msg: string} {
	// Verify password meets security standards
	let errors: string[] = []
	const minLength: number = 8

	if (password.length < minLength) errors.push(`- Be at least ${minLength} characters`)
	else if (!/[a-z]/.test(password)) errors.push('- Include a lowercase letter.')
	else if (!/[A-Z]/.test(password)) errors.push('- Include an uppercase letter.')
	else if (!/\d/.test(password)) errors.push('- Include a digit')

	if (errors.length === 0) return {success: true, msg: 'success'}

	return {success: false, msg: 'Your password must:\n' + errors.join('\n')}
}

export function compare(str1: string, str2: string) {
	return str1 === str2
}
