import {verifyPassword} from "./verifyPassword.ts";

function isEmpty(str: string): boolean {
	return str === ''
}

export default function verifyFields(
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	passwordReEntry: string,
	) {
	let errors: string[] = []

	// None of the above fields are an empty string
	if(isEmpty(firstName) || isEmpty(lastName) || isEmpty(email) || isEmpty(password) || isEmpty(passwordReEntry))
		errors.push('Fields cannot be left blank')

	// Password and PasswordReEntry have to match
	if(password !== passwordReEntry)
		errors.push('Passwords do not match')

	// Password is well-formed
	verifyPassword(password, errors)

	return errors
}