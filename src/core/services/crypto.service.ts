import { Injectable } from '@angular/core';
import { ed25519 } from '@noble/curves/ed25519.js';
import { bytesToHex, hexToBytes } from '@noble/curves/utils.js';

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

  private base64UrlToUint8Array(base64Url: string): Uint8Array {
    // 1. Zamiana znaków Base64URL na standardowy Base64
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // 2. Dopełnienie znakiem '=' do wielokrotności 4
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    // 3. Bezpieczne dekodowanie ciągu Base64
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async signChallenge(challengeBase64: string, privateKeyHex: string): Promise<string> {
    console.group('🔑 [CryptoService] Podpisywanie wyzwania');
    console.log('📥 Input Challenge (Base64):', challengeBase64);
    console.log('📥 Input PrivateKey (Hex):', privateKeyHex ? `${privateKeyHex.substring(0, 10)}...` : 'BRAK');

    try {
      // 1. Dekodowanie Base64
      const challengeBytes = this.base64UrlToUint8Array(challengeBase64);

      console.log('🔢 Bajty challenge (length):', challengeBytes.length, challengeBytes);

      // 2. Dekodowanie Private Key Hex
      const privateKeyBytes = hexToBytes(privateKeyHex);
      console.log('🔢 Bajty klucza prywatnego (length):', privateKeyBytes.length);

      // 3. Generowanie podpisu Ed25519
      const signatureBytes = ed25519.sign(challengeBytes, privateKeyBytes.slice(0, 32));
      const signatureHex = bytesToHex(signatureBytes);

      console.log('✅ Wygenerowany podpis (Hex):', signatureHex);
      console.groupEnd();
      return signatureHex;
    } catch (err) {
      console.error('❌ Błąd podczas generowania podpisu kryptograficznego:', err);
      console.groupEnd();
      throw err;
    }
  }
}