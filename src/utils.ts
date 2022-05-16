
export const generateRandomString = (length = 10, onlyUppercase = false): string => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  if (!onlyUppercase) {
    characters += 'abcdefghijklmnopqrstuvwxyz';
  }

  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
