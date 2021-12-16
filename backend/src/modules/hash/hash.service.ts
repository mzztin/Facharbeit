import { Injectable } from '@nestjs/common';
import { SHA256, enc } from 'crypto-js';

@Injectable()
export class HashService {
  hashPassword(password: string): string {
    return (
      SHA256(
        '53d0af5d1ccc03eab9088c234bb46a46deaa9e17682416d459beb49fc78802a1' +
          password,
      ) + ''
    );
  }

  matches(hash: string, haystack: string): boolean {
    return hash === this.hashPassword(haystack);
  }
}
