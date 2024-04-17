export const makeDisplayPageNumbers = (page: number, totalPages: number, displayPageRange: number): number[] => {
  const startPage = Math.max(1, page - Math.floor(displayPageRange / 2));
  const endPage = Math.min(totalPages, startPage + displayPageRange - 1);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
};
