export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BookmarkDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('bookmarks')) {
        db.createObjectStore('bookmarks', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const getAllBookmarks = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('bookmarks', 'readonly');
    const store = transaction.objectStore('bookmarks');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addBookmark = (db, bookmark) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('bookmarks', 'readwrite');
    const store = transaction.objectStore('bookmarks');
    const request = store.add(bookmark);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateBookmark = (db, bookmark) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('bookmarks', 'readwrite');
    const store = transaction.objectStore('bookmarks');
    const request = store.put(bookmark);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteBookmark = (db, id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('bookmarks', 'readwrite');
    const store = transaction.objectStore('bookmarks');
    const request = store.delete(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
