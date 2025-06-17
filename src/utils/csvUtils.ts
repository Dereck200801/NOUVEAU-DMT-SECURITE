export const exportToCsv = <T extends Record<string, any>>(
  filename: string,
  rows: T[],
  columns?: (keyof T)[]
) => {
  if (rows.length === 0) return;
  const keys: (keyof T)[] = columns || (Object.keys(rows[0]) as (keyof T)[]);

  const escape = (value: any) => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const csvContent = [keys.join(',')]
    .concat(rows.map((row) => keys.map((k) => escape(row[k])).join(',')))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  link.click();
}; 