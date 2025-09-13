import {api_root_url} from "../Settings/constants";


export default async function createAccount  (firstName: string, lastName: string, email: string, password: string): Promise<boolean | undefined>  {
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

        // Account with this email already exists if false
        return !(response.status === 409)
    } catch (e) { console.error(e); }
}

