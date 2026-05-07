import { spawnSync } from 'node:child_process';

const cases = [
  {
    name: '00 ok: explicit is:inline',
    file: 'cases/00-ok-explicit-is-inline.astro',
  },
  {
    name: '01 parser error: Astro diagnostic from define:vars without is:inline',
    file: 'cases/01-astro-diagnostic-define-vars.astro',
  },
  {
    name: '01b parser error: Astro diagnostic from type="module" without is:inline',
    file: 'cases/01b-astro-diagnostic-type-module.astro',
  },
  {
    name: '01c parser error: Astro diagnostic from data-* without is:inline',
    file: 'cases/01c-astro-diagnostic-data-attr.astro',
  },
  {
    name: '01d parser error: Astro diagnostic from defer without is:inline',
    file: 'cases/01d-astro-diagnostic-defer.astro',
  },
  {
    name: '02 rule error: TS assertion spread tokenized as attrs',
    file: 'cases/02-spread-with-ts-assertion.astro',
  },
  {
    name: '03a parser error: static tag + spread + expression child',
    file: 'cases/03a-static-spread-expression-child.astro',
  },
  {
    name: '03b parser error: component spread + descendant expression child',
    file: 'cases/03b-component-spread-descendant-expression-child.astro',
  },
  {
    name: '03 parser error: conditional spread attribute + expression child',
    file: 'cases/03-conditional-spread-attr.astro',
  },
  {
    name: '04 parser error: dynamic tag + spread + expression child',
    file: 'cases/04-dynamic-tag-spread-expression-child.astro',
  },
  {
    name: '05 parser error: dynamic tag + multiple spreads + expression child',
    file: 'cases/05-dynamic-tag-multiple-spreads-expression-child.astro',
  },
];

let unexpected = false;

for (const testCase of cases) {
  console.log(`\n## ${testCase.name}`);
  console.log(`$ markuplint ${testCase.file} --config .markuplintrc --no-color --problem-only`);

  const result = spawnSync(
    'pnpm',
    ['exec', 'markuplint', testCase.file, '--config', '.markuplintrc', '--no-color', '--problem-only'],
    {
      encoding: 'utf8',
    },
  );

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stdout.write(result.stderr);
  }
  console.log(`exit: ${result.status}`);

  const expectedExit = testCase.file.startsWith('cases/00-') ? 0 : 1;
  if (result.status !== expectedExit) {
    unexpected = true;
    console.log(`unexpected exit: expected ${expectedExit}`);
  }
}

process.exitCode = unexpected ? 1 : 0;
