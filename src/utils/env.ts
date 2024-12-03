export function getEnvVariable(key: string, defaultValue: string = ''): string {
  const fullKey = `VITE_${key}`;
  return import.meta.env[fullKey] || defaultValue;
}

export function getNumericEnvVariable(key: string, defaultValue: number): number {
  const value = getEnvVariable(key, String(defaultValue));
  return Number(value);
}