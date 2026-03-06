// Simple wrapper that works
let animeInstance = null;

export const getAnime = async () => {
  if (!animeInstance) {
    const module = await import('animejs/lib/anime.es.js');
    animeInstance = module.default;
  }
  return animeInstance;
};

export default animeInstance;