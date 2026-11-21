import {
  PERSONALIZATION,
  type MemoryPhotoItem,
} from '../config/personalization';

const MEMORY_STORAGE_KEY = 'alsfy_custom_memory_pairs_v1';
const GALLERY_STORAGE_KEY = 'alsfy_custom_gallery_photos_v1';

export async function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read selected file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported image format.'));
      img.onload = () => {
        const maxDim = 920;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function loadMemoryPairs(): MemoryPhotoItem[] {
  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (!raw) return PERSONALIZATION.memoryPairs;
    const parsed = JSON.parse(raw) as MemoryPhotoItem[];
    if (!Array.isArray(parsed) || parsed.length !== PERSONALIZATION.memoryPairs.length) {
      return PERSONALIZATION.memoryPairs;
    }
    return parsed;
  } catch {
    return PERSONALIZATION.memoryPairs;
  }
}

export function saveMemoryPairs(items: MemoryPhotoItem[]): boolean {
  try {
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

export function resetMemoryPairs(): MemoryPhotoItem[] {
  try {
    localStorage.removeItem(MEMORY_STORAGE_KEY);
  } catch {
    // Ignore
  }
  return PERSONALIZATION.memoryPairs;
}

export function loadGalleryPhotos(): MemoryPhotoItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return PERSONALIZATION.galleryPhotos;
    const parsed = JSON.parse(raw) as MemoryPhotoItem[];
    if (!Array.isArray(parsed) || parsed.length !== PERSONALIZATION.galleryPhotos.length) {
      return PERSONALIZATION.galleryPhotos;
    }
    return parsed;
  } catch {
    return PERSONALIZATION.galleryPhotos;
  }
}

export function saveGalleryPhotos(items: MemoryPhotoItem[]): boolean {
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

export function resetGalleryPhotos(): MemoryPhotoItem[] {
  try {
    localStorage.removeItem(GALLERY_STORAGE_KEY);
  } catch {
    // Ignore
  }
  return PERSONALIZATION.galleryPhotos;
}
