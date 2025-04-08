import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '../../../api/api'

interface LoginCredentials {
	password: string
	email: string
}

interface SignUpCredentials extends LoginCredentials {
	name: string
}

interface AuthResponse {
	statusCode: number
	message: string | null
	data: string // token
}

async function signIn(credentials: LoginCredentials): Promise<AuthResponse> {
	const client = await getMainClient()
	const response = await client.post<AuthResponse>('/auth/signin', credentials)
	return response.data
}

async function signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
	const client = await getMainClient()
	const response = await client.post<AuthResponse>('/auth/signup', credentials)
	return response.data
}

export function useSignIn() {
	return useMutation({
		mutationFn: (credentials: LoginCredentials) => signIn(credentials),
	})
}

export function useSignUp() {
	return useMutation({
		mutationFn: (credentials: SignUpCredentials) => signUp(credentials),
	})
}
