import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    cli: "src/cli.ts",
    "skills/validate-cli": "src/skills/validate-cli.ts",
    "skills/index-cli": "src/skills/index-cli.ts",
    "workflows/list-cli": "src/workflows/list-cli.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: "node18",
  outDir: "dist",
  banner: {
    js: "#!/usr/bin/env node",
  },
});
