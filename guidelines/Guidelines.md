# Project Guidelines — GenAI Proposal & SOW Estimation Workbench

## Design System

- Component library: **shadcn/ui** (Radix UI primitives). Components live in `src/app/components/ui/`. Do not hand-edit them.
- CSS framework: **Tailwind CSS v4**. No `tailwind.config.js`. Use `@tailwindcss/vite` plugin only.
- Dark mode: use `dark:` Tailwind variants. CSS variables defined in `src/styles/`.
- Icons: **lucide-react** only. Do not use MUI icons or any other icon library.
- Do not use `@mui/material` or `@emotion` — they are installed from the scaffold but are not part of this project's design system.

## Layout

- Max content width: `max-w-4xl` for forms/single-column pages, `max-w-6xl` for dashboard/overview pages.
- Standard page padding: `p-6`.
- Cards: `bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6`.
- Use flexbox and grid layouts. Avoid absolute positioning except for overlays and dropdowns.
- Section spacing: `space-y-6` between major sections on a page.

## Typography

- Headings use Tailwind's default font scale. Do not set custom font families.
- Body text: `text-slate-600 dark:text-slate-300`, small labels: `text-slate-400 dark:text-slate-500`.
- Primary content text: `text-slate-800 dark:text-slate-100` or `text-slate-900 dark:text-slate-100`.

## Colour Usage

- Primary action: `bg-blue-600 hover:bg-blue-700 text-white`
- Success / complete: `text-emerald-500` or `text-emerald-600`
- Warning: `text-amber-500` or `text-amber-600`
- Destructive: `text-red-500` or `border-red-500`
- Muted/disabled: `text-slate-400`

## Buttons

- Primary: `<Button className="bg-blue-600 hover:bg-blue-700 text-white">`
- Secondary: `<Button variant="outline">`
- Destructive: `<Button variant="destructive">`
- Icon buttons: use `size="sm"` or `size="icon"` variants
- Never place more than one primary button per section

## Forms

- Always use `<Label>` from shadcn/ui paired with inputs.
- Required fields: append `<span className="text-red-500">*</span>` after the label text.
- Error state: add `border-red-500` class to the input, display error text below as `<p className="text-xs text-red-500">`.
- Multi-select chip toggles: use the `CheckChip` pattern (pill buttons with `rounded-full`, `border`, toggle selected state with `bg-blue-600`).

## Tables

- Inline-editable tables: use `<input>` or `<select>` directly in `<td>` cells with minimal styling.
- Table container: `overflow-x-auto` on a wrapping div.
- Row hover: `hover:bg-slate-50 dark:hover:bg-slate-700/50`.
- Sticky header row: `bg-slate-50 dark:bg-slate-700/50` with `text-xs uppercase tracking-wide text-slate-500`.

## Data Sanitisation

**Never** use real client names, company names, or proprietary content in any generated code, UI strings, seed data, or export output.

Permitted placeholder values:

- `"DemoClient"`
- `"Sample Payer"` / `"Sample Provider"`
- `"Internal AI Practice"`
- `"Agentic AI Prior Authorization Assist"`
