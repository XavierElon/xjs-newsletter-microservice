/*
EMAIL VALIDATION
- starts with an alphanumeric character or one of the following special characters: . ! # $ % & ' * + / = ? ^ _ ` { | } ~ -
- contains an @ symbol
- has a domain name with one or more dots (.)
- contains only lowercase and uppercase letters, numbers, dots, hyphens, and/or underscores
*/
export const validateEmail = (value: string): boolean => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(value);
}