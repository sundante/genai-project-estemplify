import type { WorkbenchState } from '../../app/components/WorkbenchContext';
import { exportSectionAsExcel, exportSectionAsPdf, exportSectionAsWord, isDocxAvailable, isPdfAvailable, isXlsxAvailable } from './core';

export { isDocxAvailable, isPdfAvailable, isXlsxAvailable };
export const exportAsExcel = (state: WorkbenchState) => exportSectionAsExcel('risks', state);
export const exportAsPdf = (state: WorkbenchState) => exportSectionAsPdf('risks', state);
export const exportAsWord = (state: WorkbenchState) => exportSectionAsWord('risks', state);
