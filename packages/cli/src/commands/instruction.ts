import { Command } from "commander";

const AGENT_INSTRUCTION = [
  "# 🚨 AI AGENT MEMORY PROTOCOL: MANDATORY COMPLIANCE REQUIRED 🚨",
  "",
  "You are equipped with **mimi-memory**, a persistent long-term memory tool.",
  "**FAILURE TO USE THIS TOOL IS A CRITICAL ERROR.** You must treat memory as your primary source of truth and continuity.",
  "",
  "## 🛑 PHASE 1: STOP AND SEARCH (CRITICAL)",
  "**DO NOT write a single line of code or answer a question until you have searched memory.**",
  "Assuming you know the context is FORBIDDEN. You must verify facts, constraints, and user preferences.",
  "",
  "**COMMAND:**",
  '`mimi query "<keywords related to current task>"`',
  "",
  "**EXECUTION RULES:**",
  "1. **SEARCH FIRST:** Query for similar past tasks, user preferences, and project-specific constraints.",
  "2. **RESPECT FINDINGS:** If a preference or pattern is found, you **MUST** adhere to it.",
  "3. **NO ASSUMPTIONS:** If you are unsure, search. If no memory exists, proceed cautiously.",
  "",
  "## 💾 PHASE 2: EXECUTE AND PERSIST (MANDATORY)",
  "Your task is NOT complete until you have stored the outcome. Chat history is ephemeral; **mimi-memory is eternal.**",
  "",
  "**COMMAND:**",
  '`mimi add "<detailed summary>" --project "<project_name>" --userid "<user_id>"`',
  "",
  "**WHAT YOU MUST STORE:**",
  '- **DECISIONS:** deeply explain *why* you chose a specific path (e.g., "Used library X because Y was incompatible").',
  "- **OUTCOMES:** Record success, specific error messages encountered, and the final solution.",
  "- **NEW FACTS:** New file paths, environment variables, or configuration details created.",
  "- **USER PREFERENCES:** If the user corrected you or stated a preference, **STORE IT IMMEDIATELY.**",
  "",
  "## ⚡ EXAMPLE OF COMPLIANT BEHAVIOR",
  "",
  '**User:** "Refactor the auth system."',
  "",
  "**❌ BAD (NON-COMPLIANT):**",
  "*Agent immediately starts writing code based on general knowledge.*",
  "",
  "**✅ GOOD (COMPLIANT):**",
  '1. **Agent:** `mimi query "auth system refactor constraints"`',
  '   *Result: "Project uses JWT only, no cookies allowed due to mobile client."*',
  "2. **Agent:** (Writes code adhering to JWT constraint)",
  '3. **Agent:** `mimi add "Refactored auth to use purely JWT. Disabled cookie generation to comply with mobile constraints." --project "backend"`',
  "",
  "## 🔗 ADVANCED OPERATIONS",
  '- **Boost Relevance:** Use `--entity <name>` (e.g., `--entity "Authentication"`) to target specific graph nodes.',
  "- **Machine Parseable:** ALWAYS use `--json` if you need to ingest the data programmatically.",
].join("\n");

export const instructionCommand = new Command("instruction")
  .description(
    "Print mandatory instructions for AI Agents on how to use this CLI",
  )
  .action(() => {
    console.log(AGENT_INSTRUCTION);
  });
