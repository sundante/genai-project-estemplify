import type { WorkbenchState } from '../../app/components/WorkbenchContext';
import { exportSectionAsExcel, exportSectionAsPdf, exportSectionAsWord, isDocxAvailable, isPdfAvailable, isXlsxAvailable } from './core';

export { isDocxAvailable, isPdfAvailable, isXlsxAvailable };
export const exportAsExcel = (state: WorkbenchState) => exportSectionAsExcel('infra', state);
export const exportAsPdf = (state: WorkbenchState) => exportSectionAsPdf('infra', state);
export const exportAsWord = (state: WorkbenchState) => exportSectionAsWord('infra', state);
