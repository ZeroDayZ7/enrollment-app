export interface MockCitizenData {
  pesel: string;
  firstName: string;
  secondName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  street: string;
  houseNumber: string;
  flatNumber: string;
  postalCode: string;
  photoUrl: string;
}

/**
 * Generuje unikalne, losowe dane obywatela, aby uniknąć kolizji w bazie danych.
 */
export function generateMockCitizenData(): MockCitizenData {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  const randomHash = Math.random().toString(36).substring(2, 7);

  // Generowanie poprawnego strukturalnie PESEL (11 cyfr) z unikalną końcówką
  const pesel = `900101${randomSuffix}1`;

  // Generowanie dynamicznego avatara w formacie Data URL (SVG)
  const svgPhoto = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="200" viewBox="0 0 150 200"><rect width="100%" height="100%" fill="%232d3748"/><circle cx="75" cy="70" r="35" fill="%23cbd5e1"/><path d="M 25 170 A 50 50 0 0 1 125 170 Z" fill="%23cbd5e1"/><text x="75" y="195" font-size="10" fill="%2394a3b8" text-anchor="middle">MOCK-${randomHash.toUpperCase()}</text></svg>`;

  return {
    pesel,
    firstName: `Jan_${randomHash}`,
    secondName: 'Test',
    lastName: `Kowalski_${randomHash}`,
    email: `dev.${randomHash}.${Date.now()}@example.com`,
    phoneNumber: `+4860${Math.floor(1000000 + Math.random() * 9000000)}`,
    city: 'Warszawa',
    street: 'Marszałkowska',
    houseNumber: `${Math.floor(1 + Math.random() * 99)}`,
    flatNumber: `${Math.floor(1 + Math.random() * 50)}`,
    postalCode: '00-001',
    photoUrl: svgPhoto
  };
}