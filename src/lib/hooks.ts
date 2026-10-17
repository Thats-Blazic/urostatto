"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Vraća vrednost koja postoji samo u browseru (npr. trenutni datum).
 * Na serveru i tokom hidratacije vraća `serverValue`, pa nema hydration razlike
 * i nema korišćenja `new Date()` tokom prerendera.
 */
export function useClientValue<T>(getClientValue: () => T, serverValue: T): T {
  return useSyncExternalStore(subscribe, getClientValue, () => serverValue);
}
