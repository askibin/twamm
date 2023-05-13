import { spawnSync } from "node:child_process";
import test from "ava";

test("should parse argv", async (t) => {
  const cmd = spawnSync("./cli", ["--version"]);

  t.assert(cmd.stdout.toString(), "0.1.0");
});
