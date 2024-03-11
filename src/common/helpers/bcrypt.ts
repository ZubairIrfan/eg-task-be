import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function isValidPassword(
  hashedPassword: string,
  password: string,
) {
  const isPasswordMatched = await bcrypt.compare(password, hashedPassword);
  if (isPasswordMatched) {
    return true;
  }
  return false;
}
