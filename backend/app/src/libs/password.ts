import bcrypt from 'bcrypt';

export const encryptPassword = async (inputPassword: string): Promise<string> => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(inputPassword, saltRounds);
  return hashedPassword;
};

export const verifyPassword = async (inputPassword: string, storedHashedPassword: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
  return isMatch;
};
