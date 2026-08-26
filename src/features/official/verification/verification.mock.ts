export interface VerificationDocument {
  qrCode: string;
  authority: string;
  documentType: string;
  documentNumber: string;
  citizenName: string;
  pesel: string;
  issueDate: string;
  expiryDate: string;
  lastVerifiedAt: string;
}

export const mockVerificationDocument: VerificationDocument = {
  qrCode: 'QR-2026-7812',
  authority: 'Urząd Miasta — Wydział Spraw Obywatelskich',
  documentType: 'Dowód osobisty',
  documentNumber: 'AK-2048-19',
  citizenName: 'Anna Kowalska',
  pesel: '82031219821',
  issueDate: '2021-04-10',
  expiryDate: '2031-04-09',
  lastVerifiedAt: '2026-08-26 09:14'
};
