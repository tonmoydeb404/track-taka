#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const ROOT = resolve(process.cwd());
const brand = JSON.parse(readFileSync(resolve(ROOT, "brand.json"), "utf8"));
const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));
pkg.version = brand.version;
writeFileSync(resolve(ROOT, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
console.log("synced brand version", brand.version);