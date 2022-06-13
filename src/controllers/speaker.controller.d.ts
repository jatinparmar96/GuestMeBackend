export type SpeakerRegisterRequestBody = {
	userName: string;
	password: string;
	email: string;
	confirmPassword: string;
};

export type SpeakerLoginRequestBody = {
	email: string;
	password: string;
};