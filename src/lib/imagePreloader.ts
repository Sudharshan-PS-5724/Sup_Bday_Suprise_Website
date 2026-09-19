import { birthdayPhotos } from "./content";

/** Preloads all app photos into browser cache in the background */
export function preloadImages() {
  if (typeof window === "undefined") return;

  const imagesToPreload = [
    ...birthdayPhotos,
    "/photos/birthday-person/pradz-01.jpg",
    "/photos/birthday-person/pradz-02.jpg",
    "/photos/birthday-person/whatsapp-95666-10545-0003.jpg",
    "/photos/birthday-person/whatsapp-95666-10545-0004.jpg",
    "/photos/birthday-person/whatsapp-95666-10545-0005.jpg",
    "/photos/birthday-person/whatsapp-95666-10545-0006.jpg",
    "/photos/birthday-person/whatsapp-95666-10545-0007.jpg",
    "/photos/birthday-person/whatsapp-95666-10545-0008.jpg",
    "/photos/birthday-person/whatsapp-95666-10545-0009.jpg",
  ];

  const preloaded = new Set<string>();

  function executePreload() {
    imagesToPreload.forEach((src) => {
      if (!src || preloaded.has(src)) return;
      preloaded.add(src);
      const img = new Image();
      img.src = src;
    });
  }

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(executePreload);
  } else {
    setTimeout(executePreload, 200);
  }
}
