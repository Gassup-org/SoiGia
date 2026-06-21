export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}
