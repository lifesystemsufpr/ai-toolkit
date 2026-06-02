/**
 * Mapeia cada repositório da org aos perfis de regra que se aplicam a ele.
 * O sync.ts usa isso para decidir quais regras da fonte neutra entram em cada repo.
 *
 * Perfis disponíveis: all (implícito), ts, backend, frontend, mobile, kotlin
 * Uma regra entra num repo se appliesTo inclui "all" OU intersecta os profiles do repo.
 */

export interface ProjectProfile {
  /** Nome do repositório na org lifesystemsufpr. */
  repo: string;
  /** Perfis que determinam quais regras se aplicam. */
  profiles: string[];
  /** IDEs/agentes para os quais gerar adaptadores neste repo. */
  ides: Array<"cursor" | "claude-code" | "copilot">;
}

export const ORG = "lifesystemsufpr";

export const PROJECTS: ProjectProfile[] = [
  { repo: "auth-service",        profiles: ["ts", "backend"],  ides: ["cursor", "claude-code", "copilot"] },
  { repo: "tecnoaging-back",     profiles: ["ts", "backend"],  ides: ["cursor", "claude-code", "copilot"] },
  { repo: "ivcf-back",           profiles: ["ts", "backend"],  ides: ["cursor", "claude-code", "copilot"] },
  { repo: "tecnoaging-front",    profiles: ["ts", "frontend"], ides: ["cursor", "claude-code", "copilot"] },
  { repo: "ivcf-front",          profiles: ["ts", "frontend"], ides: ["cursor", "claude-code", "copilot"] },
  { repo: "ivcf-mobile",         profiles: ["ts", "mobile"],   ides: ["cursor", "claude-code", "copilot"] },
  { repo: "equilibrium-mobile",  profiles: ["kotlin"],         ides: ["cursor", "claude-code", "copilot"] },
  { repo: "pipeline-demo",       profiles: ["ts", "backend"],  ides: ["cursor", "claude-code", "copilot"] },
];
