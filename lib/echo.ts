import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Make Pusher available globally for Echo
if (typeof window !== "undefined") {
  (window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

type EchoInstance = Echo<"pusher">;

let echoInstance: EchoInstance | null = null;

export function getEchoInstance(): EchoInstance | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (echoInstance) {
    return echoInstance;
  }

  const token = localStorage.getItem("auth_token");

  if (!token) {
    return null;
  }

  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "mt1";

  if (!pusherKey) {
    console.warn("Pusher key not configured");
    return null;
  }

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: pusherKey,
    cluster: pusherCluster,
    forceTLS: true,
    authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  return echoInstance;
}

export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}

export function reconnectEcho(): EchoInstance | null {
  disconnectEcho();
  return getEchoInstance();
}
