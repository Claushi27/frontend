import { format } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm');
};

export const formatRut = (rut: string): string => {
  // Remove any existing formatting
  const cleanRut = rut.replace(/[^0-9kK]/g, '');

  if (cleanRut.length < 2) return cleanRut;

  const dv = cleanRut.slice(-1);
  const number = cleanRut.slice(0, -1);

  // Add dots for thousands
  const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${formattedNumber}-${dv}`;
};

export const validateRut = (rut: string): boolean => {
  const cleanRut = rut.replace(/[^0-9kK]/g, '');

  if (cleanRut.length < 2) return false;

  const dv = cleanRut.slice(-1).toLowerCase();
  const number = cleanRut.slice(0, -1);

  let sum = 0;
  let multiplier = 2;

  for (let i = number.length - 1; i >= 0; i--) {
    sum += parseInt(number[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const calculatedDv = remainder < 2 ? remainder.toString() : (11 - remainder === 10 ? 'k' : (11 - remainder).toString());

  return calculatedDv === dv;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};