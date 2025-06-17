import type { Report } from '../types/report';

// Dynamic import to keep bundle small and avoid SSR issues.
export const exportReportsToPdf = async (filename: string, reports: Report[]) => {
  // Lazy load jsPDF and autotable
  const jsPDFModule = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const { jsPDF } = jsPDFModule;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Liste des rapports', 14, 22);

  const tableData = reports.map((r) => [
    r.title,
    r.type,
    r.date,
    r.author,
    r.size ?? '',
    r.status,
  ]);

  autoTable(doc, {
    startY: 28,
    head: [['Titre', 'Type', 'Date', 'Auteur', 'Taille', 'Statut']],
    body: tableData,
  });

  doc.save(filename);
};

// Export a single report (metadata + description) to a dedicated PDF file
export const exportReportDetailsToPdf = async (report: Report) => {
  const jsPDFModule = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const { jsPDF } = jsPDFModule;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(report.title, 14, 22);

  // Basic info table
  autoTable(doc, {
    startY: 30,
    head: [['Champ', 'Valeur']],
    body: [
      ['Type', report.type],
      ['Date', report.date],
      ['Auteur', report.author],
      ['Taille', report.size ?? ''],
      ['Statut', report.status],
    ],
    styles: { fontSize: 10 },
  });

  // Description block
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(12);
  doc.text('Description :', 14, finalY + 10);

  doc.setFontSize(10);
  const splitDesc = doc.splitTextToSize(report.description, 180);
  doc.text(splitDesc, 14, finalY + 16);

  const safeTitle = report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${safeTitle}.pdf`);
}; 