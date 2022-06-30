export type OrganizationRegisterRequestBody = {
  organizationName: string;
  phone: string;
  password: string;
  email: string;
  confirmPassword: string;
};

export type OrganizationLoginRequestBody = {
  email: string;
  password: string;
};
