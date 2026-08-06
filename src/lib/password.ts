import { compare, hash } from "bcryptjs";

const SALT_ROUNDS = 10;

export function hashPassword(plain: string) {
  return hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hashed: string) {
  return compare(plain, hashed);
}
