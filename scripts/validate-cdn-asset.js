#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const manifestPath = "deploy-manifest.json";
const runtimePath = "runtime-config.json";
const assetPath = "footer-code-injection.js";

if (!fs.existsSync(manifestPath) || !fs.existsSync(runtimePath) || !fs.existsSync(assetPath)) {
  fail("Missing one or more required CDN files");
}

const manifest = readJson(manifestPath);
const runtimeCfg = readJson(runtimePath);
const assetBytes = fs.readFileSync(assetPath);
const assetText = assetBytes.toString("utf8");
const sha = crypto.createHash("sha256").update(assetBytes).digest("hex");

if (typeof runtimeCfg.enabled !== "boolean") fail("runtime-config.enabled must be boolean");
if (runtimeCfg.assetPath !== assetPath) fail(`runtime-config.assetPath must equal ${assetPath}`);

if (manifest.assetPath !== assetPath) fail(`deploy-manifest.assetPath must equal ${assetPath}`);
if (!/^[a-f0-9]{64}$/i.test(String(manifest.sha256 || ""))) fail("deploy-manifest.sha256 must be a 64-char hex digest");
if (String(manifest.sha256).toLowerCase() !== sha) fail("deploy-manifest.sha256 does not match footer-code-injection.js");
if (Number(manifest.sizeBytes) !== assetBytes.length) fail("deploy-manifest.sizeBytes does not match footer-code-injection.js");
if (typeof manifest.sourceSha !== "string" || !manifest.sourceSha.trim()) fail("deploy-manifest.sourceSha must be a non-empty string");
if (typeof manifest.builtAtUtc !== "string" || !manifest.builtAtUtc.trim()) fail("deploy-manifest.builtAtUtc must be a non-empty string");

const forbidden = [
  /eval\s*\(/i,
  /new\s+Function\s*\(/i,
  /document\.write\s*\(/i,
  /http:\/\//i,
  /BEGIN\s+(RSA|EC|OPENSSH|PRIVATE)\s+KEY/i,
  /ghp_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /AIza[0-9A-Za-z_-]{35}/,
  /AKIA[0-9A-Z]{16}/,
  /ASIA[0-9A-Z]{16}/
];

for (const re of forbidden) {
  if (re.test(assetText)) {
    fail(`Forbidden pattern found in footer-code-injection.js: ${re}`);
  }
}

console.log("CDN asset integrity and safety checks passed.");
