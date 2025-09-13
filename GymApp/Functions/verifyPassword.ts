import * as yup from "yup";

// Schema for well-formed password
const schema = yup.object({
  password: yup.string()
    .min(8, 'Passwords must be at least 8 characters long.')
  	.matches(/[a-z]+/, 'Passwords must contain at least one lowercase letter.')
 		.matches(/[A-Z]+/, 'Passwords must contain at least one uppercase letter.')
  	.matches(/\d+/, 'Passwords must contain at least one number.')
});

// Validates schema against users password
export async function verifyPassword(password: string, errors: string[]) {
	if(password === '') return

	try {
			await schema.validate({ password: password }, { abortEarly: false });
		} catch (e: any) { errors.push(e.errors) }

}