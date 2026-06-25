import type { Workspace } from '../types'

const STORAGE_KEY = 'genai_proposal_sow_workbench_v1'

export function loadWorkspaceFromStorage(): Workspace | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Workspace
  } catch {
    return null
  }
}

export function saveWorkspaceToStorage(workspace: Workspace): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
  } catch {
    console.warn('Failed to save workspace to localStorage')
  }
}

export function clearWorkspaceFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function exportWorkspaceAsJson(workspace: Workspace): void {
  const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const client = (workspace.opportunity.clientName || 'UntitledClient').replace(/[^a-zA-Z0-9_-]/g, '_')
  const useCase = (workspace.opportunity.useCaseName || 'UntitledUseCase').replace(/[^a-zA-Z0-9_-]/g, '_')
  const date = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `${client}_${useCase}_Workspace_${date}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importWorkspaceFromJson(): Promise<Workspace | null> {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) { resolve(null); return }
      try {
        const text = await file.text()
        const workspace = JSON.parse(text) as Workspace
        resolve(workspace)
      } catch {
        resolve(null)
      }
    }
    input.oncancel = () => resolve(null)
    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)
  })
}
