import { onMounted, ref, shallowRef, type Ref, type ShallowRef } from 'vue';

interface CacheRecord<T> {
  value: T;
  expiry: number;
}

const cache = new Map<string, CacheRecord<unknown>>();

export interface UseAsyncDataResult<T> {
  state: ShallowRef<T | null>;
  isLoading: Ref<boolean>;
  error: ShallowRef<Error | null>;
  refresh: () => Promise<T>;
}

export const useAsyncData = <T>(
  key: string,
  loader: () => Promise<T>,
  ttl = 60_000
): UseAsyncDataResult<T> => {
  const state = shallowRef<T | null>(null);
  const isLoading = ref(false);
  const error = shallowRef<Error | null>(null);

  const execute = async (): Promise<T> => {
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expiry > now) {
      const value = cached.value as T;
      state.value = value;
      return value;
    }
    isLoading.value = true;
    error.value = null;
    try {
      const data = await loader();
      state.value = data;
      cache.set(key, { value: data, expiry: now + ttl });
      return data;
    } catch (err) {
      const wrapped = err instanceof Error ? err : new Error(String(err));
      error.value = wrapped;
      throw wrapped;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    void execute();
  });

  return {
    state,
    isLoading,
    error,
    refresh: execute
  };
};
