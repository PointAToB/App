import {api_root_url} from "../Settings/constants";


export default async function createAccount  (firstName: string, lastName: string, email: string, password: string): 
Promise<{success: boolean, msg: string} | undefined>  {
	const endpoint:string = api_root_url + 'user';

	try {
		const response: Response = await fetch(endpoint, {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password
			})
        });

		if (response.status === 200) return {success: true,  msg: 'success'}

        // Account with this email already exists if false
        if (response.status === 409 ) 
			return {success: false, msg: 'An account with this email already exists'}

		// Request of json body has empty fields or malinformed.
		if (response.status === 400)
			return {success: false, msg: 'Fields cannot be left empty'}
		
	// Fetch will throw error for network related issues
    } catch (e) { return {success: false, msg: 'Try again later'}; }
}

