export const generateRandomHash = (quantity: number): string => {
  let key: string = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#&*()-_=+[]{}|.<>/\\";

  for (let index = 0; index < quantity; index++)
    key += characters[Math.floor(Math.random() * characters.length)];

  return key;
};