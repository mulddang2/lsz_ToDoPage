export const isNullOrEmpty = (str: string | null | undefined): boolean => {
  return str === null || str === undefined || str.trim().length === 0;
};
