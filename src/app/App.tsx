import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useEffect } from 'react';
import { WorkbenchProvider, useWorkbench } from './components/WorkbenchContext';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { UseCaseIntakePage } from './components/UseCaseIntakePage';
import { SolutionClassificationPage } from './components/SolutionClassificationPage';
import { ComplexityScoringPage } from './components/ComplexityScoringPage';
import { SolutionPatternBuilderPage } from './components/SolutionPatternBuilderPage';
import { AzureEstimationPage } from './components/AzureEstimationPage';
import { ExportCenterPage } from './components/ExportCenterPage';
import { TemplateLibraryPage } from './components/TemplateLibraryPage';
import { PrintFriendlyExportView } from './components/PrintFriendlyExportView';

function BeforeUnloadWarning() {
  const { state } = useWorkbench();

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!state.azure.unsavedChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [state.azure.unsavedChanges]);

  return null;
}

export default function App() {
  return (
    <WorkbenchProvider>
      <BeforeUnloadWarning />
      <BrowserRouter>
        <Routes>
          <Route path="/print-export" element={<PrintFriendlyExportView />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="intake" element={<UseCaseIntakePage />} />
            <Route path="classify" element={<SolutionClassificationPage />} />
            <Route path="complexity" element={<ComplexityScoringPage />} />
            <Route path="patterns" element={<Navigate to="/estimation" replace />} />
            <Route path="patterns-library" element={<SolutionPatternBuilderPage />} />
            <Route path="estimation" element={<AzureEstimationPage />} />
            <Route path="wbs" element={<Navigate to="/estimation?tab=wbs" replace />} />
            <Route path="resources" element={<Navigate to="/estimation?tab=resources" replace />} />
            <Route path="infra" element={<Navigate to="/estimation?tab=infra" replace />} />
            <Route path="assumptions" element={<Navigate to="/estimation?tab=assumptions" replace />} />
            <Route path="risks" element={<Navigate to="/estimation?tab=risks" replace />} />
            <Route path="export" element={<ExportCenterPage />} />
            <Route path="templates" element={<TemplateLibraryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WorkbenchProvider>
  );
}
