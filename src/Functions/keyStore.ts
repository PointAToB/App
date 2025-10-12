import * as SecureStore from 'expo-secure-store'

export interface tokenType {
	token: 'access' | 'refresh' | 'dbKey'
}

// Get Token
export async function getToken(key: tokenType) {
	let res = await SecureStore.getItemAsync(key.token)
	return res ? res : null
}

// Set Token
export async function setToken(key: tokenType, value: string) {
	await SecureStore.setItemAsync(key.token, value)
}