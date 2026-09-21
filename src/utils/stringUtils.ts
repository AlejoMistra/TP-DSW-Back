export const calculateInitials = (name: string, surname: string): string => {
  const firstLetter = name.trim().charAt(0).toUpperCase();
  const lastLetter = surname.trim().charAt(0).toUpperCase();
  return `${firstLetter}${lastLetter}`;
};
