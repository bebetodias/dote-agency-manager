const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  { path: 'src/app/(dashboard)/clientes/page.tsx' },
  { path: 'src/app/(dashboard)/jobs/page.tsx' },
  { path: 'src/app/(dashboard)/producao/page.tsx' },
  { path: 'src/app/(dashboard)/config/page.tsx' },
  { path: 'src/app/(dashboard)/equipe/page.tsx' },
  { path: 'src/app/(dashboard)/clientes/[id]/page.tsx' },
  { path: 'src/app/(dashboard)/jobs/[id]/page.tsx' },
  { path: 'src/app/(dashboard)/equipe/[id]/page.tsx' },
  { path: 'src/app/page.tsx' },
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file.path);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace export const Name: React.FC = () => { ... with export default function Name() {
  content = content.replace(/export\s+const\s+([A-Za-z0-9_]+)\s*:\s*React\.FC(?:<[^>]+>)?\s*=\s*\([^)]*\)\s*=>\s*\{/g, 'export default function $1() {');

  // Also replace useParams if it's there
  content = content.replace(/useParams\(\)/g, 'useParams() as any'); // Quick hack to avoid Next.js useParams string/array type errors

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Export fixed: ${file.path}`);
});
