#!/usr/bin/env node

import("../src/main.js").catch((err) => {
  console.error("❌ CLI failed:", err.message);
  process.exit(1);
});
