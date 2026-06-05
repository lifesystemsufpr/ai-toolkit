import { describe, it, expect } from 'vitest';
import {
  parseDoc,
  appliesToRepo,
  emitCursor,
  emitClaude,
  emitCopilot,
  type Doc,
  type OutFile,
} from './sync.js';
import type { ProjectProfile } from '../config/projects.js';

/** Acha um arquivo emitido por sufixo de caminho (normaliza separador de SO). */
function byPath(files: OutFile[], suffix: string): OutFile | undefined {
  return files.find((f) => f.path.replace(/\\/g, '/').endsWith(suffix));
}

function rule(over: Partial<Doc['meta']>, body = 'corpo da regra'): Doc {
  return {
    meta: { id: 'r', title: 'Regra', appliesTo: ['all'], always: false, ...over },
    body,
  };
}
function skill(over: Partial<Doc['meta']>, body = 'corpo da skill'): Doc {
  return {
    meta: { id: 's', title: 'Skill', appliesTo: ['all'], ...over },
    body,
  };
}

describe('parseDoc', () => {
  it('lê frontmatter escalar, array inline, boolean e corpo', () => {
    const raw = [
      '---',
      'id: x-rule',
      'title: Regra X',
      'description: desc da regra',
      'appliesTo: [backend, frontend]',
      'globs: [src/**/*.ts]',
      'always: true',
      '---',
      '',
      'corpo aqui.',
      '',
    ].join('\n');
    const doc = parseDoc(raw, 'rules/x.md');
    expect(doc.meta.id).toBe('x-rule');
    expect(doc.meta.title).toBe('Regra X');
    expect(doc.meta.description).toBe('desc da regra');
    expect(doc.meta.appliesTo).toEqual(['backend', 'frontend']);
    expect(doc.meta.globs).toEqual(['src/**/*.ts']);
    expect(doc.meta.always).toBe(true);
    expect(doc.body).toBe('corpo aqui.');
  });

  it('aceita appliesTo em lista (estilo dash)', () => {
    const raw = ['---', 'id: y', 'title: Y', 'appliesTo:', '  - backend', '  - kotlin', '---', 'b', ''].join('\n');
    expect(parseDoc(raw, 'rules/y.md').meta.appliesTo).toEqual(['backend', 'kotlin']);
  });

  it('lança quando falta frontmatter', () => {
    expect(() => parseDoc('sem frontmatter', 'rules/z.md')).toThrow(/Frontmatter ausente/);
  });
});

describe('appliesToRepo', () => {
  const repo = { repo: 'auth-service', profiles: ['backend', 'node'], ides: ['cursor'] } as unknown as ProjectProfile;

  it('"all" aplica a qualquer repo', () => {
    expect(appliesToRepo(rule({ appliesTo: ['all'] }), repo)).toBe(true);
  });
  it('aplica quando há interseção de perfil', () => {
    expect(appliesToRepo(rule({ appliesTo: ['backend'] }), repo)).toBe(true);
  });
  it('não aplica sem interseção', () => {
    expect(appliesToRepo(rule({ appliesTo: ['frontend'] }), repo)).toBe(false);
  });
});

describe('emitCursor', () => {
  it('gera .mdc com description, globs e alwaysApply', () => {
    const files = emitCursor([rule({ id: 'commits', title: 'Commits', globs: ['**/*.ts'], always: true })], []);
    const f = byPath(files, '.cursor/rules/commits.mdc');
    expect(f).toBeDefined();
    expect(f!.content).toContain('description: Commits');
    expect(f!.content).toContain('globs: **/*.ts');
    expect(f!.content).toContain('alwaysApply: true');
    expect(f!.content).toContain('corpo da regra');
  });

  it('skills viram skill-<id>.mdc com alwaysApply false', () => {
    const files = emitCursor([], [skill({ id: 'tdd', description: 'faz TDD' })]);
    const f = byPath(files, '.cursor/rules/skill-tdd.mdc');
    expect(f).toBeDefined();
    expect(f!.content).toContain('description: faz TDD');
    expect(f!.content).toContain('alwaysApply: false');
  });
});

describe('emitClaude', () => {
  it('CLAUDE.md separa regras sempre-aplicáveis das por-contexto; skill vira SKILL.md', () => {
    const files = emitClaude(
      'auth-service',
      [
        rule({ id: 'sec', title: 'Segurança', always: true }, 'sempre seguro'),
        rule({ id: 'ts', title: 'TS estrito', always: false, globs: ['**/*.ts'] }, 'use strict'),
      ],
      [skill({ id: 'review', description: 'revisa PR' }, 'passos de review')],
    );
    const claude = byPath(files, 'CLAUDE.md')!;
    expect(claude.content).toContain('# auth-service — Diretrizes do projeto');
    expect(claude.content).toContain('## Regras sempre aplicáveis');
    expect(claude.content).toContain('sempre seguro');
    expect(claude.content).toContain('## Regras por contexto de arquivo');
    expect(claude.content).toContain('### TS estrito  (aplica a: **/*.ts)');

    const skillFile = byPath(files, '.claude/skills/review/SKILL.md')!;
    expect(skillFile.content).toContain('name: review');
    expect(skillFile.content).toContain('description: revisa PR');
    expect(skillFile.content).toContain('passos de review');
  });
});

describe('emitCopilot', () => {
  it('gera copilot-instructions, instruction file com applyTo e prompt de skill', () => {
    const files = emitCopilot(
      'ivcf-front',
      [
        rule({ id: 'base', title: 'Base', always: true }, 'regra base'),
        rule({ id: 'comp', title: 'Componentes', always: false, globs: ['src/**/*.tsx'] }, 'regra comp'),
      ],
      [skill({ id: 'a11y', description: 'acessibilidade' }, 'checklist a11y')],
    );
    expect(byPath(files, '.github/copilot-instructions.md')!.content).toContain('regra base');

    const instr = byPath(files, '.github/instructions/comp.instructions.md')!;
    expect(instr.content).toContain('applyTo: "src/**/*.tsx"');
    expect(instr.content).toContain('regra comp');

    const prompt = byPath(files, '.github/prompts/a11y.prompt.md')!;
    expect(prompt.content).toContain('mode: agent');
    expect(prompt.content).toContain('description: acessibilidade');
  });
});
