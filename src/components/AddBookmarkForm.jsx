import React, { useState, useEffect } from 'react';
import { fetchMetadata } from '../utils/fetchMetadata';

const AddBookmarkForm = ({ onAdd }) => {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');

    // Extract URL parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const urlParam = queryParams.get('url');
        const titleParam = queryParams.get('title');
        const descriptionParam = queryParams.get('description');
        const faviconParam = queryParams.get('favicon');

        if (urlParam) {
            setUrl(decodeURIComponent(urlParam));
            setTitle(decodeURIComponent(titleParam || ''));
            setDescription(decodeURIComponent(descriptionParam || ''));
        }
    }, []);

    const handleUrlChange = async (e) => {
        const url = e.target.value;
        setUrl(url);
        if (url) {
            const { title } = await fetchMetadata(url);
            setTitle(title);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            id: Date.now(),
            url,
            title,
            description,
            tags: tags.split(',').map((tag) => tag.trim()),
            favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`,
        });
        setUrl('');
        setTitle('');
        setDescription('');
        setTags('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            <input
                type="url"
                placeholder="Enter URL"
                value={url}
                onChange={handleUrlChange}
                className="w-full p-2 border rounded-lg"
                required
            />
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-lg"
            />
            <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-2 border rounded-lg"
            />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg">
                Add Bookmark
            </button>
        </form>
    );
};

export default AddBookmarkForm;
