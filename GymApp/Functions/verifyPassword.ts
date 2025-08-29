import * as yup from "yup";

// Used for password comparison, returns false if either entry is an empty string.
export function compare (password1: string, password2: string):boolean {
		if (password1 === '' || password2 === '') return false;
		return (password1 === password2);
	}

// Schema for well-formed password
const schema = yup.object({
  password: yup.string()
    .min(8, 'Password must be at least 8 characters long.')
  	.matches(/[a-z]+/, 'Password must contain at least one lowercase letter.')
 		.matches(/[A-Z]+/, 'Password must contain at least one uppercase letter.')
  	.matches(/\d+/, 'Password must contain at least one number.')
});

export async function verifyPassword(password: string, setErrors: (errors: [])=>void) {
		try {
			await schema.validate({ password: password }, { abortEarly: false });
			setErrors([]);
		} catch (e: any) { setErrors(e.errors); }
	}