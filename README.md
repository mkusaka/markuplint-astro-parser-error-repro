# markuplint-astro-parser-error-repro

Minimal reproductions for `@markuplint/astro-parser` behavior with Astro syntax.

## Setup

```sh
pnpm install
```

The repro pins:

- `markuplint@4.18.1`
- `@markuplint/astro-parser@4.18.0`
- `astro-eslint-parser@1.4.0`

## Reproduce

Run all cases and keep going after expected failures:

```sh
pnpm repro
```

Inspect `astro-eslint-parser` diagnostics and `@markuplint/astro-parser` behavior directly:

```sh
pnpm inspect
```

Run one case:

```sh
pnpm case:astro-diagnostic
pnpm case:ts-assertion-spread
pnpm case:conditional-spread
pnpm case:dynamic-tag-spread
pnpm case:dynamic-tag-multiple-spreads
```

## Cases

| File | Command | Pattern | Observed behavior |
| --- | --- | --- | --- |
| `cases/00-ok-explicit-is-inline.astro` | `pnpm case:ok-inline` | Explicit `is:inline` with `define:vars` | Passes |
| `cases/01-astro-diagnostic-define-vars.astro` | `pnpm case:astro-diagnostic` | `define:vars` without explicit `is:inline` | Astro diagnostic is surfaced as markuplint `parse-error` |
| `cases/02-spread-with-ts-assertion.astro` | `pnpm case:ts-assertion-spread` | `{...{ command: 'close' } as any}` | Parsed as spread + bogus `as` / `any}` attrs, then reported by `invalid-attr` |
| `cases/03-conditional-spread-attr.astro` | `pnpm case:conditional-spread` | Conditional spread attribute | `Invalid tag syntax` parse error |
| `cases/04-dynamic-tag-spread-expression-child.astro` | `pnpm case:dynamic-tag-spread` | Dynamic tag + spread + expression child | `Invalid tag syntax` parse error |
| `cases/05-dynamic-tag-multiple-spreads-expression-child.astro` | `pnpm case:dynamic-tag-multiple-spreads` | Dynamic tag + multiple spreads + expression child | `Invalid tag syntax` parse error |

`pnpm inspect` is useful for issue reports because it shows that cases 02-05 are accepted by
`astro-eslint-parser`, while markuplint either builds a wrong AST or throws `ParserError`.
