import { Injectable } from '@angular/core';
import { ed25519 } from '@noble/curves/ed25519.js';
import { hexToBytes } from '@noble/curves/utils.js';

export interface DevCardFile {
  cardSerialNumber: string;
  publicKey: string;
  privateKey: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  async parseCardFile(file: File): Promise<DevCardFile> {
    console.group('📁 [CryptoService] Odczyt pliku karty');
    console.log('📄 Plik:', file.name, 'Rozmiar:', file.size, 'bajtów');

    const text = await file.text();
    console.log('📄 Zawartość tekstowa pliku:', text);

    let json: any;
    try {
      json = JSON.parse(text);
      console.log('Zparsowany JSON:', json);
    } catch (e) {
      console.error('❌ Błąd parsowania JSON:', e);
      console.groupEnd();
      throw new Error('Plik nie jest poprawnym plikiem JSON.');
    }

    if (!json.privateKey || !json.cardSerialNumber || !json.userId) {
      console.error('❌ Brakujące pola w pliku JSON:', {
        privateKey: !!json.privateKey,
        cardSerialNumber: !!json.cardSerialNumber,
        userId: !!json.userId
      });
      console.groupEnd();
      throw new Error('Nieprawidłowy format pliku karty urzędniczej.');
    }

    console.log('✅ Karta odczytana poprawnie');
    console.groupEnd();
    return json as DevCardFile;
  }

  async signChallenge(challenge: string, privateKeyHex: string): Promise<string> {
    console.group('🔑 [CryptoService] Podpisywanie wyzwania');
    console.log('📥 Input Challenge:', challenge);
    console.log('📥 Input PrivateKey (Hex):', privateKeyHex ? `${privateKeyHex.substring(0, 10)}...` : 'BRAK');

    try {
      // 1. Konwersja ciągu wyzwania na bajty UTF-8 (zgodne z backendowym []byte(storedChallenge))
      const challengeBytes = new TextEncoder().encode(challenge);
      console.log('🔢 Bajty challenge (length):', challengeBytes.length);

      // 2. Dekodowanie klucza prywatnego z formatu Hex
      const privateKeyBytes = hexToBytes(privateKeyHex);
      console.log('🔢 Bajty klucza prywatnego (length):', privateKeyBytes.length);

      // 3. Generowanie podpisu Ed25519 za pomocą pierwszych 32 bajtów klucza
      const signatureBytes = ed25519.sign(challengeBytes, privateKeyBytes.slice(0, 32));

      // 4. Konwersja wygenerowanego podpisu do Base64 (backend oczekuje base64.StdEncoding.DecodeString)
      const signatureBase64 = btoa(String.fromCharCode(...signatureBytes));

      console.log('✅ Wygenerowany podpis (Base64):', signatureBase64);
      console.groupEnd();

      return signatureBase64;
    } catch (err) {
      console.error('❌ Błąd podczas generowania podpisu kryptograficznego:', err);
      console.groupEnd();
      throw err;
    }
  }
}