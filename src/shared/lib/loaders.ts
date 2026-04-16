const cache: Record<string, string> = {};

function isHtmlContent(content: string): boolean {
  const trimmed = content.trim().toLowerCase();
  return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html');
}

export async function loadLectureContent(filePath: string): Promise<string> {
  if (cache[filePath]) {
    return cache[filePath];
  }

  const response = await fetch(`/content/${filePath}.md`);
  const content = await response.text();

  if (!response.ok || isHtmlContent(content)) {
    throw new Error(`Материал не найден: ${filePath}`);
  }

  cache[filePath] = content;
  return content;
}

export async function loadLabContent(filePath: string): Promise<string> {
  if (cache[filePath]) {
    return cache[filePath];
  }

  const response = await fetch(`/content/${filePath}.md`);
  const content = await response.text();

  if (!response.ok || isHtmlContent(content)) {
    throw new Error(`Лабораторная не найдена: ${filePath}`);
  }

  cache[filePath] = content;
  return content;
}

export async function loadPresentationContent(filePath: string): Promise<string> {
  const cacheKey = `presentation_${filePath}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const response = await fetch(`/content/${filePath}.md`);
  const content = await response.text();

  if (!response.ok || isHtmlContent(content)) {
    throw new Error(`Презентация не найдена: ${filePath}`);
  }

  cache[cacheKey] = content;
  return content;
}

export async function loadTestContent(filePath: string): Promise<string> {
  const cacheKey = `test_${filePath}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const response = await fetch(`/content/${filePath}.md`);
  const content = await response.text();

  if (!response.ok || isHtmlContent(content)) {
    throw new Error(`Тест не найден: ${filePath}`);
  }

  cache[cacheKey] = content;
  return content;
}

export function clearLectureCache(): void {
  Object.keys(cache).forEach((key) => delete cache[key]);
}
