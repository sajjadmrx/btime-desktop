export interface UserProfile {
	email: string
	avatar?: string
	name: string
	connections: string[]
}

export interface AuthData {
	token: string
	user?: UserProfile
}
