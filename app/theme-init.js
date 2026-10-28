// Runs before the page paints so a saved dark preference never flashes light.
export const themeScript = "(function(){var saved;try{saved=localStorage.getItem('sayan-theme')}catch(e){}document.documentElement.dataset.theme=saved==='dark'?'dark':'light'})()";
