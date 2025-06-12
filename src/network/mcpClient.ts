export async function callMCP() {
  console.log("⚠️ MCP is disabled. Running in local-only mode.");
  return { status: "ok", data: null };
}

export async function verify() {
  console.log("✅ Local verify stub activated.");
  return { success: true, issues: [] };
}
