export default defineNuxtPlugin((nuxtApp) => {
  const magic = () => {
    let fontSize = 100;
    if (window.innerWidth <= 1024) {
      let windowWidth = window.innerWidth > 650 ? 650 : window.innerWidth;
      fontSize = (windowWidth / 375) * 100;
      nuxtApp.$mainStore.setResultLayout('mobile');
    } else {
      fontSize = window.innerWidth > 1920 ? 100 : (window.innerWidth / 1920) * 100;
      nuxtApp.$mainStore.setResultLayout('desktop');
    }
    document.getElementsByTagName("html")[0].style.fontSize = Math.round(fontSize) + "%";
  };

  const getIcon = (icon, path) => {
    let imageSrc = '';
    try {
      let images;
        if (path == 'svg') images = import.meta.glob('@/assets/svg/*.svg', { eager: true });
        else if (path == 'flags') images = import.meta.glob('@/assets/flags/*.svg', { eager: true });
        else images = import.meta.glob('@/assets/icons/*.svg', { eager: true });
        const imagePath = `/assets/${icon}`;
        if (images[imagePath]) {
          imageSrc = images[imagePath].default
        } else {
          console.error(`Image not found: ${icon}`)
        }
      } catch (e) {
        console.error(`Error loading image: ${icon}`, e)
      }
      return imageSrc;
  };
  
  return {
    provide: {
      magic,
      getIcon
    }
  }
});
