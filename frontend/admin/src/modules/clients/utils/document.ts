const CPF_LENGTH = 11;
const CNPJ_LENGTH = 14;

const stripNonDigits = (value: string) => value.replace(/\D+/g, '');

const formatCpf = (digits: string) => {
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 9);
  const part4 = digits.slice(9, 11);

  if (digits.length <= 3) return part1;
  if (digits.length <= 6) return `${part1}.${part2}`;
  if (digits.length <= 9) return `${part1}.${part2}.${part3}`;
  return `${part1}.${part2}.${part3}-${part4}`;
};

const formatCnpj = (digits: string) => {
  const part1 = digits.slice(0, 2);
  const part2 = digits.slice(2, 5);
  const part3 = digits.slice(5, 8);
  const part4 = digits.slice(8, 12);
  const part5 = digits.slice(12, 14);

  if (digits.length <= 2) return part1;
  if (digits.length <= 5) return `${part1}.${part2}`;
  if (digits.length <= 8) return `${part1}.${part2}.${part3}`;
  if (digits.length <= 12) return `${part1}.${part2}.${part3}/${part4}`;
  return `${part1}.${part2}.${part3}/${part4}-${part5}`;
};

export const formatDocument = (value: string): string => {
  const digits = stripNonDigits(value).slice(0, CNPJ_LENGTH);
  if (!digits) return '';
  if (digits.length <= CPF_LENGTH) {
    return formatCpf(digits);
  }
  return formatCnpj(digits);
};

export const isValidDocument = (value: string): boolean => {
  const digits = stripNonDigits(value);
  if (!digits) return false;
  if (digits.length !== CPF_LENGTH && digits.length !== CNPJ_LENGTH) {
    return false;
  }
  // avoid sequences like 00000000000
  if (/^(\d)\1*$/.test(digits)) {
    return false;
  }
  return true;
};

export const normalizeDocument = (value: string) => stripNonDigits(value);
