// App roda em dark fixo (next-themes forcedTheme="dark").
// Shim para substituir o useColorModeValue do Chakra v2 (removido no v3).
export const useColorModeValue = <L, D>(_light: L, dark: D): D => dark;
