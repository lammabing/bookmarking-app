export const importBookmarks = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(e.target.result, 'text/html');
    const links = doc.querySelectorAll('a');
    const bookmarks = Array.from(links).map((link) => ({
      url: link.href,
      title: link.textContent,
      description: '',
      tags: [],
    }));
    // Save bookmarks to state or localStorage
  };
  reader.readAsText(file);
};
