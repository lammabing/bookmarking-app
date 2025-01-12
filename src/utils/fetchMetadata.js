export const fetchMetadata = async (url) => {
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');
    const title = doc.querySelector('title')?.innerText || 'Untitled';
    return { title };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return { title: 'Untitled' };
  }
};
