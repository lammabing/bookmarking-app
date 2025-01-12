export const saveFontSettings = (settings) => {
  localStorage.setItem('fontSettings', JSON.stringify(settings));
};

export const loadFontSettings = () => {
const settings = localStorage.getItem('fontSettings');
return settings ? JSON.parse(settings) : null;
};
