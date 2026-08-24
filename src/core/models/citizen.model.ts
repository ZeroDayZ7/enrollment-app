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
  user_id: string;
  agreement_number: string;
  agreement_download_url: string;
  puk_code: string;
  created_at: string;
}