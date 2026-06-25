import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import type { WorkbenchState } from '../../app/components/WorkbenchContext';
import {
  fileStem,
  isDocxAvailable,
  isPdfAvailable,
  isXlsxAvailable,
  sectionTable,
  type SectionName,
} from './core';

export { isDocxAvailable, isPdfAvailable, isXlsxAvailable };

const sections: SectionName[] = ['overview', 'components', 'agents', 'wbs', 'resources', 'infra', 'roi', 'assumptions', 'risks'];

function safe(value: unknown) {
  return value === undefined || value === null || value === '' ? '-' : String(value);
}

export function exportAsExcel(state: WorkbenchState) {
  if (!isXlsxAvailable) return window.open('/print-export', '_blank');
  const wb = XLSX.utils.book_new();
  const summary = [
    ['Field', 'Value'],
    ['Client', state.intake.clientName],
    ['Opportunity', state.intake.opportunityName],
    ['Use-case', state.azure.overview.useCaseName],
    ['Segment', state.intake.marketSegment],
    ['Stage', state.intake.opportunityStage],
    ['Prepared by', 'Internal AI Practice'],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), 'Opportunity Summary');
  sections.forEach(section => {
    const table = sectionTable(section, state);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([table.headers, ...table.rows]), table.title.slice(0, 31));
  });
  XLSX.writeFile(wb, `${fileStem(state, 'Full_Package')}.xlsx`);
}

export function exportAsPdf(state: WorkbenchState) {
  if (!isPdfAvailable) return window.open('/print-export', '_blank');
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.text('GenAI Proposal & SOW Estimation Workbench', 14, 16);
  doc.setFontSize(10);
  doc.text(`${safe(state.intake.clientName)} | ${safe(state.azure.overview.useCaseName)} | ${new Date().toLocaleDateString()}`, 14, 24);

  let first = true;
  sections.forEach(section => {
    const table = sectionTable(section, state);
    if (!first) doc.addPage();
    first = false;
    doc.setFontSize(13);
    doc.text(table.title, 14, 18);
    autoTable(doc, {
      startY: 25,
      head: [table.headers],
      body: table.rows.map(row => row.map(safe)),
      styles: { overflow: 'linebreak', fontSize: 7 },
      headStyles: { fillColor: [37, 99, 235] },
      didDrawPage: () => {
        doc.setFontSize(8);
        doc.text(`Page ${doc.getNumberOfPages()}`, doc.internal.pageSize.width - 28, doc.internal.pageSize.height - 10);
      },
    });
  });
  doc.save(`${fileStem(state, 'Full_Package')}.pdf`);
}

export async function exportAsWord(state: WorkbenchState) {
  if (!isDocxAvailable) return window.open('/print-export', '_blank');
  const children: Array<Paragraph | Table> = [
    new Paragraph({ text: 'GenAI Proposal & SOW Estimation Workbench', heading: HeadingLevel.TITLE }),
    new Paragraph(`Client: ${safe(state.intake.clientName)}`),
    new Paragraph(`Use-case: ${safe(state.azure.overview.useCaseName)}`),
    new Paragraph('Prepared by Internal AI Practice'),
  ];

  sections.forEach(section => {
    const table = sectionTable(section, state);
    children.push(new Paragraph({ text: table.title, heading: HeadingLevel.HEADING_1 }));
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: table.headers.map(h => new TableCell({
            shading: { fill: '2563EB' },
            children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF' })] })],
          })),
        }),
        ...table.rows.map(row => new TableRow({
          children: row.map(cell => new TableCell({ children: [new Paragraph(safe(cell))] })),
        })),
      ],
    }));
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileStem(state, 'Full_Package')}.docx`);
}
