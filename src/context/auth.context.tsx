import { createContext, useContext, useEffect, useState } from 'react'
import type { AuthData, UserProfile } from '../../shared/user.interface'
import { getMainClient } from '../api/api'

interface AuthContextType {
	isAuthenticated: boolean
	token: string | null
	user: UserProfile | null
	isLoadingUser: boolean
	login: (token: string) => void
	logout: () => void
	refetchUser: () => Promise<UserProfile | null>
}

const AUTH_STORAGE_KEY = 'auth'

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [token, setToken] = useState<string | null>(null)
	const [user, setUser] = useState<UserProfile | null>(null)
	const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true)

	useEffect(() => {
		const loadAuthData = async () => {
			try {
				const authData: AuthData = window.store.get(AUTH_STORAGE_KEY)
				if (authData) {
					setToken(authData.token)
					if (authData.user) {
						setUser(authData.user)
						setIsLoadingUser(false)
					}

					fetchUserProfile(authData.token)
				} else {
					setIsLoadingUser(false)
				}
			} catch (error) {
				console.error('Failed to load auth data from Electron store:', error)
				setIsLoadingUser(false)
			}
		}
		loadAuthData()
	}, [])

	const fetchUserProfile = async (
		currentToken: string,
	): Promise<UserProfile | null> => {
		try {
			setIsLoadingUser(true)

			const client = await getMainClient()
			client.defaults.headers.Authorization = `Bearer ${currentToken}`

			const response = await client.get('/users/@me')
			const userData = response.data

			setUser(userData)

			const authData: AuthData = { token: currentToken, user: userData }
			window.store.set(AUTH_STORAGE_KEY, authData)

			setIsLoadingUser(false)
			return userData
		} catch (error) {
			if (error.response && error.response.status === 401) {
				logout()
				setToken(null)
			}

			console.error('Failed to fetch user profile:', error)
			setUser(null)
			setIsLoadingUser(false)
			return null
		}
	}

	const login = (newToken: string) => {
		setToken(newToken)

		const authData: AuthData = { token: newToken }
		window.store.set(AUTH_STORAGE_KEY, authData)

		fetchUserProfile(newToken)
	}

	const logout = () => {
		setToken(null)
		setUser(null)

		window.store.set(AUTH_STORAGE_KEY, null)
	}

	const refetchUser = async (): Promise<UserProfile | null> => {
		if (!token) return null
		return fetchUserProfile(token)
	}

	const value: AuthContextType = {
		isAuthenticated: !!token,
		token,
		user,
		isLoadingUser,
		login,
		logout,
		refetchUser,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
