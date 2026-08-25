import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';

const distDirectory = new URL('../dist/', import.meta.url);
const declarationFiles = readdirSync(distDirectory, { withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith('.d.ts'))
  .map(entry => new URL(entry.name, distDirectory));

let rewrittenCount = 0;

for (const declarationFile of declarationFiles) {
  const source = readFileSync(declarationFile, 'utf8');
  const normalized = source.replace(/(['"])(\.{1,2}\/[^'"]+)(\1)/g, (match, quote, specifier) => {
    if (extname(specifier)) return match;
    rewrittenCount += 1;
    return `${quote}${specifier}.js${quote}`;
  });

  if (normalized !== source) writeFileSync(declarationFile, normalized);
}

console.log(`Normalized ${rewrittenCount} relative declaration import${rewrittenCount === 1 ? '' : 's'}.`);
