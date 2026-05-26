import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config: no R2 incremental cache binding to keep the free-tier
// deploy self-contained. ISR/cache won't persist across Worker instances,
// which is fine for this mostly client-rendered frontend.
export default defineCloudflareConfig();
