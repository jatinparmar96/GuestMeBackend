export type SpeakerRegisterRequestBody = {
  userName: string;
  userLastname: string;
  password: string;
  email: string;
  confirmPassword: string;
};

export type SpeakerLoginRequestBody = {
  email: string;
  password: string;
};
