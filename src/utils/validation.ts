export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return 'Email обязателен';
  } else if (!emailRegex.test(email)) {
    return 'Неправильный формат email';
  } else return '';
};
