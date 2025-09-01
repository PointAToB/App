import {api_root_url} from "../Settings/constants";


export default async function CreateAccount  (firstName: string, lastName: string, email: string, password: string)  {
	const endpoint:string = api_root_url + "user/create";

		try {
			const response: Response = await fetch(endpoint, {
				method: "POST",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					firstName: firstName,
					lastName: lastName,
					email: email,
					passwordHash: password
				})
			});

			// Used for Debugging
			const text = await response.text();
			console.log(text);

		} catch (e) {
			console.error(e);
		}

}

