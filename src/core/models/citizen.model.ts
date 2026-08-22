export interface CitizenPayload {
  firstName: string;
  secondName?: string | null;
  lastName: string;
  pesel: string;
  email: string;
  phoneNumber: string;
  city: string;
  street: string;
  houseNumber: string;
  flatNumber?: string | null;
  postalCode: string;
}

export interface RegisterCitizenResponse {
  userId: string;
  agreementNumber: string;
  pukCode: string;
  activationCode: string;
  registeredAt: string;
}