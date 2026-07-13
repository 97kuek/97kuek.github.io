const htmlEntities: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
};

const matrixEnvironmentPattern = /\\begin\{((?:[pbBvV]?matrix)|smallmatrix|array)\}([\s\S]*?)\\end\{\1\}/g;

function restoreMatrixRowBreaks(formula: string): string {
  return formula.replace(matrixEnvironmentPattern, (_match, environment: string, body: string) => {
    const normalizedBody = body.replace(/(?<!\\)\\\s+/g, '\\\\\n');
    return `\\begin{${environment}}${normalizedBody}\\end{${environment}}`;
  });
}

export function normalizeMathSlot(raw: string): string {
  const formula = raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li)>/gi, '\n')
    .replace(/<(?:p|div|li)[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (entity) => htmlEntities[entity] ?? entity)
    .replace(/\u00a0/g, ' ')
    .trim();

  return restoreMatrixRowBreaks(formula);
}
