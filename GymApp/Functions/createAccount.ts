import {api_root_url} from "../Settings/constants";
/*
interface Props {
	firstName: string,
	lastName: string,
	email: string,
	password: string
}
*/
// Returns true if successful
const CreateAccount = (firstName: string, lastName: string, email: string, password: string) => {
	const endpoint:string = api_root_url + "user/create";

	// If any param is '' then return false.
	if (firstName === '' || lastName === '' || email === '' || password === '') { return false }

	const Post = async () => {
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

			const json = await response.text();
			console.log(json);

		} catch (e) {
			console.error(e);
			return false;
		}
	}

	Post();

	return true;
}


export default CreateAccount;