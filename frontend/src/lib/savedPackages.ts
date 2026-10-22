
export interface SavedPackage {
  name: string;
  country: string;
  category: string;
  packageType: string;
  price: number;
  hotelCategory: number;
  themes: string[];
  description: string;
  days: string;
  image: string;
}

function storageKey(userKey: string) {
  return `voyageai_saved_packages_${userKey}`;
}

export function getSavedPackages(userKey: string): SavedPackage[] {
  if (typeof window === "undefined" || !userKey) return [];

  try {
    const stored = localStorage.getItem(storageKey(userKey));
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as SavedPackage[]) : [];
  } catch {
    return [];
  }
}

export function isPackageSaved(
  userKey: string,
  packageName: string
): boolean {
  return getSavedPackages(userKey).some(
    (item) => item.name === packageName
  );
}

export function toggleSavedPackage(
  userKey: string,
  packageToToggle: SavedPackage
): SavedPackage[] {
  if (typeof window === "undefined" || !userKey) return [];

  const current = getSavedPackages(userKey);

  const alreadySaved = current.some(
    (item) => item.name === packageToToggle.name
  );

  const updated = alreadySaved
    ? current.filter((item) => item.name !== packageToToggle.name)
    : [...current, packageToToggle];

  localStorage.setItem(storageKey(userKey), JSON.stringify(updated));

  return updated;
}

const bookmarkStorageKey = (userKey: string) =>
  `voyageai_bookmarked_packages_${userKey}`;

export function getBookmarkedPackages(
  userKey: string
): SavedPackage[] {
  if (typeof window === "undefined" || !userKey) return [];

  try {
    const stored = localStorage.getItem(bookmarkStorageKey(userKey));
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as SavedPackage[]) : [];
  } catch {
    return [];
  }
}

export function toggleBookmarkedPackage(
  userKey: string,
  packageToToggle: SavedPackage
): SavedPackage[] {
  if (typeof window === "undefined" || !userKey) return [];

  const current = getBookmarkedPackages(userKey);

  const alreadyBookmarked = current.some(
    (item) => item.name === packageToToggle.name
  );

  const updated = alreadyBookmarked
    ? current.filter((item) => item.name !== packageToToggle.name)
    : [...current, packageToToggle];

  localStorage.setItem(
    bookmarkStorageKey(userKey),
    JSON.stringify(updated)
  );

  return updated;
}