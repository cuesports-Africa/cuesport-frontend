"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Channel } from "laravel-echo";
import { getEchoInstance, reconnectEcho } from "@/lib/echo";

type EchoInstance = ReturnType<typeof getEchoInstance>;

export function useEcho() {
  const [echo, setEcho] = useState<EchoInstance>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const instance = getEchoInstance();
    if (instance) {
      setEcho(instance);
      setIsConnected(true);
    }

    return () => {
      // Don't disconnect on unmount - we want to keep the connection alive
    };
  }, []);

  const reconnect = useCallback(() => {
    const instance = reconnectEcho();
    if (instance) {
      setEcho(instance);
      setIsConnected(true);
    }
  }, []);

  return { echo, isConnected, reconnect };
}

interface UseChannelOptions<T> {
  channelName: string;
  eventName: string;
  onMessage: (data: T) => void;
  enabled?: boolean;
}

export function useChannel<T>({
  channelName,
  eventName,
  onMessage,
  enabled = true,
}: UseChannelOptions<T>) {
  const { echo, isConnected } = useEcho();
  const channelRef = useRef<Channel | null>(null);
  const onMessageRef = useRef(onMessage);

  // Update the callback ref when it changes
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!echo || !isConnected || !enabled || !channelName) {
      return;
    }

    // Subscribe to private channel
    const channel = echo.private(channelName);
    channelRef.current = channel;

    // Listen for the event
    channel.listen(`.${eventName}`, (data: T) => {
      onMessageRef.current(data);
    });

    return () => {
      if (channelRef.current) {
        echo.leave(channelName);
        channelRef.current = null;
      }
    };
  }, [echo, isConnected, enabled, channelName, eventName]);

  return { isConnected };
}

interface UseMatchChannelOptions {
  matchId: number | null;
  onResultSubmitted?: (data: unknown) => void;
  onResultConfirmed?: (data: unknown) => void;
  onDisputed?: (data: unknown) => void;
  onResolved?: (data: unknown) => void;
}

export function useMatchChannel({
  matchId,
  onResultSubmitted,
  onResultConfirmed,
  onDisputed,
  onResolved,
}: UseMatchChannelOptions) {
  const { echo, isConnected } = useEcho();
  const channelRef = useRef<Channel | null>(null);

  // Store callbacks in refs to avoid re-subscriptions
  const callbacksRef = useRef({
    onResultSubmitted,
    onResultConfirmed,
    onDisputed,
    onResolved,
  });

  useEffect(() => {
    callbacksRef.current = {
      onResultSubmitted,
      onResultConfirmed,
      onDisputed,
      onResolved,
    };
  }, [onResultSubmitted, onResultConfirmed, onDisputed, onResolved]);

  useEffect(() => {
    if (!echo || !isConnected || !matchId) {
      return;
    }

    const channelName = `match.${matchId}`;
    const channel = echo.private(channelName);
    channelRef.current = channel;

    // Listen for match events
    channel
      .listen(".match.result.submitted", (data: unknown) => {
        callbacksRef.current.onResultSubmitted?.(data);
      })
      .listen(".match.result.confirmed", (data: unknown) => {
        callbacksRef.current.onResultConfirmed?.(data);
      })
      .listen(".match.disputed", (data: unknown) => {
        callbacksRef.current.onDisputed?.(data);
      })
      .listen(".match.resolved", (data: unknown) => {
        callbacksRef.current.onResolved?.(data);
      });

    return () => {
      if (channelRef.current) {
        echo.leave(channelName);
        channelRef.current = null;
      }
    };
  }, [echo, isConnected, matchId]);

  return { isConnected };
}
