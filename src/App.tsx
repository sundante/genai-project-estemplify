import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { IntakePage } from './pages/IntakePage'
import { ClassificationPage } from './pages/ClassificationPage'
import { EstimationWorkspacePage } from './pages/EstimationWorkspacePage'
import { ExportCenterPage } from './pages/ExportCenterPage'
import { ExampleEstimationsPage } from './pages/TemplateLibraryPage'
import { SettingsPage } from './pages/SettingsPage'
import { PrintFriendlyView } from './components/export/PrintFriendlyView'
import { OverviewTab } from './components/estimation/OverviewTab'
import { ComponentsTab } from './components/estimation/ComponentsTab'
import { WbsTab } from './components/estimation/WbsTab'
import { ResourcesTab } from './components/estimation/ResourcesTab'
import { AssumptionsTab } from './components/estimation/AssumptionsTab'
import { RisksTab } from './components/estimation/RisksTab'
import { RoiTab } from './components/estimation/RoiTab'
import { DeliveryModelTab } from './components/estimation/DeliveryModelTab'
import { useThemeStore } from './store/themeStore'

function ThemeInitializer() {
  const { theme } = useThemeStore()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <Routes>
        {/* Print-friendly view — no app shell */}
        <Route path="/print-preview" element={<PrintFriendlyView />} />

        {/* Main app shell */}
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/intake" element={<IntakePage />} />
          <Route path="/classify" element={<ClassificationPage />} />
          <Route path="/complexity" element={<Navigate to="/estimation" replace />} />
          <Route path="/estimation" element={<EstimationWorkspacePage />}>
            <Route index element={<Navigate to="/estimation/overview" replace />} />
            <Route path="overview" element={<OverviewTab />} />
            <Route path="components" element={<ComponentsTab />} />
            <Route path="agents" element={<Navigate to="/estimation/components" replace />} />
            <Route path="wbs" element={<WbsTab />} />
            <Route path="resources" element={<ResourcesTab />} />
            <Route path="infra-tokens" element={<Navigate to="/estimation/components" replace />} />
            <Route path="assumptions" element={<AssumptionsTab />} />
            <Route path="risks" element={<RisksTab />} />
            <Route path="roi" element={<RoiTab />} />
            <Route path="delivery" element={<DeliveryModelTab />} />
          </Route>
          <Route path="/export" element={<ExportCenterPage />} />
          <Route path="/templates" element={<ExampleEstimationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
