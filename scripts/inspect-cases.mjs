import { readFileSync } from 'node:fs';
import { parseTemplate } from 'astro-eslint-parser';
import { parser as markuplintAstroParser } from '@markuplint/astro-parser';

const files = [
  'cases/00-ok-explicit-is-inline.astro',
  'cases/01-astro-diagnostic-define-vars.astro',
  'cases/01b-astro-diagnostic-type-module.astro',
  'cases/01c-astro-diagnostic-data-attr.astro',
  'cases/01d-astro-diagnostic-defer.astro',
  'cases/02-spread-with-ts-assertion.astro',
  'cases/03a-static-spread-expression-child.astro',
  'cases/03b-component-spread-descendant-expression-child.astro',
  'cases/03-conditional-spread-attr.astro',
  'cases/04-dynamic-tag-spread-expression-child.astro',
  'cases/05-dynamic-tag-multiple-spreads-expression-child.astro',
];

for (const file of files) {
  const code = readFileSync(file, 'utf8');

  console.log(`\n## ${file}`);

  const { result } = parseTemplate(code);
  if (result.diagnostics.length === 0) {
    console.log('astro-eslint-parser: OK');
  } else {
    console.log('astro-eslint-parser diagnostics:');
    for (const diagnostic of result.diagnostics) {
      console.log(`- code=${diagnostic.code} severity=${diagnostic.severity} text=${firstLine(diagnostic.text)}`);
    }
  }

  try {
    const ast = markuplintAstroParser.parse(code);
    console.log('markuplint astro parser: OK');
    if (file.includes('02-spread-with-ts-assertion')) {
      printStartTagAttrs(ast);
    }
  } catch (error) {
    console.log(`markuplint astro parser: ${error.name}: ${firstLine(error.message)}`);
  }
}

function firstLine(message) {
  return String(message).split('\n')[0];
}

function printStartTagAttrs(ast) {
  const startTag = ast.nodeList.find((node) => node.type === 'starttag' && node.nodeName === 'button');
  const attrs = startTag?.attributes.map((attr) => ({
    type: attr.type,
    raw: attr.raw,
    name: attr.name?.raw,
  }));
  console.log('markuplint start tag attrs:');
  console.log(JSON.stringify(attrs, null, 2));
}
