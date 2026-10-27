import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: {
    tsconfig: "./tsconfig.build.json",
  },
  sourcemap: true,
  clean: true,
  platform: "node",
  target: "node20",
  outDir: "dist",
  outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
  deps: {
    neverBundle: [
      "@lazarshock/sendkit-core",
      "@modelcontextprotocol/client",
      "@modelcontextprotocol/server",
    ],
  },
});
