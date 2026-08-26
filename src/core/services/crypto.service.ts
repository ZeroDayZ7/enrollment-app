import { Injectable } from '@angular/core';
import { ed25519 } from '@noble/curves/ed25519.js';
import { hexToBytes } from '@noble/curves/utils.js';
import { environment } from '../../environments/environment';

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

  /**
   * Pomocnicza funkcja dekodująca Base64 / URL-Safe Base64 do Uint8Array
   */
  private base64ToBytes(b64: string): Uint8Array {
    let normalized = b64.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4 !== 0) {
      normalized += '=';
    }
    const binaryString = atob(normalized);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Podpisuje wyzwanie (challenge) kluczem prywatnym z uwzględnieniem domeny (Domain Binding).
   */
  async signChallenge(challengeB64: string, privateKeyHex: string, domain: string = environment.domain): Promise<string> {
    console.group('🔑 [CryptoService] Podpisywanie wyzwania');
    console.log('📥 Input Challenge (B64):', challengeB64);
    console.log('📥 Domain:', domain);
    console.log('📥 Input PrivateKey (Hex):', privateKeyHex ? `${privateKeyHex.substring(0, 10)}...` : 'BRAK');

    try {
      // 1. Dekodowanie challenge'a z Base64 do surowych bajtów
      const challengeBytes = this.base64ToBytes(challengeB64);
      console.log('🔢 Bajty challenge (length):', challengeBytes.length);

      // 2. Budowanie payloadu z domena – format "domain:challenge_bytes" (zgodny z Go fmt.Sprintf("%s:%s", domain, string(challengeBytes)))
      const prefixBytes = new TextEncoder().encode(domain + ':');
      const payload = new Uint8Array(prefixBytes.length + challengeBytes.length);
      payload.set(prefixBytes, 0);
      payload.set(challengeBytes, prefixBytes.length);

      console.log('🔢 Bajty pełnego payloadu (length):', payload.length);

      // 3. Dekodowanie klucza prywatnego z formatu Hex
      const privateKeyBytes = hexToBytes(privateKeyHex);
      console.log('🔢 Bajty klucza prywatnego (length):', privateKeyBytes.length);

      // 4. Generowanie podpisu Ed25519 za pomocą pierwszych 32 bajtów klucza
      const signatureBytes = ed25519.sign(payload, privateKeyBytes.slice(0, 32));

      // 5. Konwersja wygenerowanego podpisu do formatu Base64
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