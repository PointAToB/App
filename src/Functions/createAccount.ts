import { api_root_url } from "../Settings/constants";
import { isEmpty, verifyPassword, compare } from "./verifyFields";


export default async function createAccount  (firstName: string, lastName: string, email: string, password: string, passwordReEntry: string):
Promise<{success: boolean, msg: string} | undefined>  {
	const endpoint:string = api_root_url + 'user';

	// Verify Fields
	if (isEmpty(firstName, lastName, email, password, passwordReEntry)) return {success: false, msg: 'Fields cannot be left empty'}

	const res = verifyPassword(password)
	if (!res.success) return {success: res.success, msg: res.msg}

	if (!compare(password, passwordReEntry)) return {success: false, msg: 'Passwords do not match'}

	try {
		const response: Response = await fetch(endpoint, {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email.toLowerCase(),
				password: password
			})
        });

		switch (response.status) {
			case 200: return {success: true,  msg: 'success'}

			case 409: return {success: false, msg: 'An account with this email already exists'}

			case 400: return {success: false, msg: 'Fields cannot be left empty'}
		}
		// Fetch will throw error for network related issues
	} catch (e) { return {success: false, msg: 'Try again later'}; }
}

