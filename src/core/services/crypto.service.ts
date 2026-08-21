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

  // 1. Wczytanie i walidacja pliku JSON
  async parseCardFile(file: File): Promise<DevCardFile> {
    const text = await file.text();
    const json = JSON.parse(text);

    if (!json.privateKey || !json.cardSerialNumber || !json.userId) {
      throw new Error('Nieprawidłowy format pliku karty urzędniczej.');
    }

    return json as DevCardFile;
  }

  // 2. Podpisanie wyzwania (Challenge) kluczem prywatnym HEX
  async signChallenge(challengeHex: string, privateKeyHex: string): Promise<string> {
    const challengeBytes = hexToBytes(challengeHex);
    const privateKeyBytes = hexToBytes(privateKeyHex);

    // Podpisanie wiadomości za pomocą Ed25519 z wykorzystaniem natywnych utils biblioteki
    const signatureBytes = ed25519.sign(challengeBytes, privateKeyBytes.slice(0, 32));

    return bytesToHex(signatureBytes);
  }
}