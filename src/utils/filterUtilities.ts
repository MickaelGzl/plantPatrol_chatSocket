const phoneRegex = /\d{2}[ -]?\d{2}[ -]?\d{2}[ -]?\d{2}[ -]?\d{2}/g;

export const isPhoneNumberInMessage = (content: string) => {
  return phoneRegex.test(content);
};
