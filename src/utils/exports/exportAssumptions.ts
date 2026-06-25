import type { WorkbenchState } from '../../app/components/WorkbenchContext';
import { exportSectionAsExcel, exportSectionAsPdf, exportSectionAsWord, isDocxAvailable, isPdfAvailable, isXlsxAvailable } from './core';

export { isDocxAvailable, isPdfAvailable, isXlsxAvailable };
export const exportAsExcel = (state: WorkbenchState) => exportSectionAsExcel('assumptions', state);
export const exportAsPdf = (state: WorkbenchState) => exportSectionAsPdf('assumptions', state);
export const exportAsWord = (state: WorkbenchState) => exportSectionAsWord('assumptions', state);
