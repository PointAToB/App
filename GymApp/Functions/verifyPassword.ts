import * as yup from "yup";

// Used for password comparison
export function compare (password: string, passwordReEntry: string):boolean {
		return (password === passwordReEntry);
	}

// Schema for well-formed password
const schema = yup.object({
  password: yup.string()
    .min(8, 'Password must be at least 8 characters long.')
  	.matches(/[a-z]+/, 'Password must contain at least one lowercase letter.')
 		.matches(/[A-Z]+/, 'Password must contain at least one uppercase letter.')
  	.matches(/\d+/, 'Password must contain at least one number.')
});

// Validates schema against users password
export async function verifyPassword(password: string, errors: string[] | [], setErrors: (errors: string[] | [])=>void) {
	try {
			await schema.validate({ password: password }, { abortEarly: false });
			setErrors([]);
		} catch (e: any) { setErrors(e.errors) }
	}