import * as keychain from 'react-native-keychain';

// Used for Access Token and Refresh Token

export async function setToken (tokenStr: string, tokenName: string)  {
	try {
		await keychain.setGenericPassword(tokenName, tokenStr, { service: tokenName });
	} catch (e) { console.error(e); }
}

export async function getToken (tokenName: string){
	const token = await keychain.getGenericPassword({ service: tokenName });
	return token ? token.password : null;
}



