export interface UserProfile {
	email: string
	avatar?: string
	name: string
	username: string | null
	connections: string[]
}

export interface AuthData {
	token: string
	user?: UserProfile
}
