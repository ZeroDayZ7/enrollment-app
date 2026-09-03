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
    console.group('🔑 [DEBUG ANGULAR] Podpisywanie wyzwania');

    try {
      const challengeBytes = this.base64ToBytes(challengeB64);
      const prefixBytes = new TextEncoder().encode(domain + ':');
      const payload = new Uint8Array(prefixBytes.length + challengeBytes.length);
      payload.set(prefixBytes, 0);
      payload.set(challengeBytes, prefixBytes.length);

      const privateKeyBytes = hexToBytes(privateKeyHex);
      const seedBytes = privateKeyBytes.slice(0, 32);

      // Konwersja payloadu do HEX dla łatwego porównania z Go
      const payloadHex = Array.from(payload).map(b => b.toString(16).padStart(2, '0')).join('');
      const challengeHex = Array.from(challengeBytes).map(b => b.toString(16).padStart(2, '0')).join('');

      console.log('📥 Domain:', domain);
      console.log('📥 Challenge B64:', challengeB64);
      console.log('📥 Challenge HEX:', challengeHex);
      console.log('📥 Payload HEX:', payloadHex);
      console.log('📥 Payload String:', new TextDecoder().decode(payload));
      console.log('📥 Seed HEX (32 bajty):', Array.from(seedBytes).map(b => b.toString(16).padStart(2, '0')).join(''));

      const signatureBytes = ed25519.sign(payload, seedBytes);
      const signatureBase64 = btoa(String.fromCharCode(...signatureBytes));

      console.log('✅ Signature B64:', signatureBase64);
      console.log('✅ Signature HEX:', Array.from(signatureBytes).map(b => b.toString(16).padStart(2, '0')).join(''));
      console.groupEnd();

      return signatureBase64;
    } catch (err) {
      console.error('❌ Błąd podczas generowania podpisu:', err);
      console.groupEnd();
      throw err;
    }
  }
}