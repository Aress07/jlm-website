"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics/track";

export function ViewTracker({
  event,
  data,
}: {
  event: AnalyticsEvent;
  data?: Record<string, string | number>;
}) {
  useEffect(() => {
    trackEvent(event, data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return null;
}
