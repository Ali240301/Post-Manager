import { useState, useEffect } from 'react';
import axios from 'axios';
import PostForm from './components/PostForm/PostForm';
import PostList from './components/PostList/PostList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSearch } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://68b6882873b3ec66cec1d576.mockapi.io/post');
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch posts. Please try again.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.description.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => b.like - a.like); // Sort by likes descending

  // Create new post
  const handleCreatePost = async (formData) => {
    try {
      // Validation: Check if title already exists
      const titleExists = posts.some(
        post => post.title.toLowerCase() === formData.title.toLowerCase()
      );

      if (titleExists) {
        setError('A post with this title already exists!');
        return;
      }

      const response = await axios.post('https://68b6882873b3ec66cec1d576.mockapi.io/post', {
        title: formData.title,
        image: formData.image,
        description: formData.description,
        like: 0 // Always start with 0 likes for new posts
      });

      setPosts(prev => [response.data, ...prev]);
      setError('');
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    }
  };

  // Update existing post - LIKE COUNT REMAINS UNCHANGED
  const handleUpdatePost = async (formData) => {
    try {
      // Validation: Check if title exists in other posts (excluding current one)
      const titleExists = posts.some(
        post =>
          post.id !== currentPost.id &&
          post.title.toLowerCase() === formData.title.toLowerCase()
      );

      if (titleExists) {
        setError('A post with this title already exists!');
        return;
      }

      const response = await axios.put(`https://68b6882873b3ec66cec1d576.mockapi.io/post/${currentPost.id}`, {
        title: formData.title,
        image: formData.image,
        description: formData.description,
        like: currentPost.like // Preserve the existing like count - NOT editable
      });

      setPosts(prev =>
        prev.map(post =>
          post.id === currentPost.id ? response.data : post
        )
      );

      setIsEditing(false);
      setCurrentPost(null);
      setError('');
    } catch (err) {
      setError('Failed to update post. Please try again.');
      console.error('Error updating post:', err);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`https://68b6882873b3ec66cec1d576.mockapi.io/post/${postId}`);
      setPosts(prev => prev.filter(post => post.id !== postId));
      setError('');
    } catch (err) {
      setError('Failed to delete post. Please try again.');
      console.error('Error deleting post:', err);
    }
  };

  // Like post - ONLY increases like count
  const handleLikePost = async (postId) => {
    try {
      const postToLike = posts.find(post => post.id === postId);
      const updatedLikeCount = postToLike.like + 1;

      const response = await axios.put(`https://68b6882873b3ec66cec1d576.mockapi.io/post/${postId}`, {
        ...postToLike,
        like: updatedLikeCount
      });

      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? response.data : post
        )
      );
    } catch (err) {
      setError('Failed to like post. Please try again.');
      console.error('Error liking post:', err);
    }
  };

  // Start editing a post
  const handleEditPost = (post) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentPost(null);
    setError('');
  };

  // Handle form submission (create or update)
  const handleFormSubmit = (formData) => {
    if (isEditing) {
      handleUpdatePost(formData);
    } else {
      handleCreatePost(formData);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <FontAwesomeIcon icon={faHeart} /> Post Manager
        </h1>
        <p>Create and manage your posts</p>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="dismiss-btn">×</button>
        </div>
      )}

      <main className="app-main">
        {/* Form Section - Above the posts */}
        <section className="form-section">
          <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
          <PostForm
            onSubmit={handleFormSubmit}
            initialData={currentPost}
            onCancel={handleCancelEdit}
            isEditing={isEditing}
          />
        </section>

        {/* Posts Section - Below the form */}
        <section className="posts-container">
          <div className="posts-header">
            <h2>All Posts ({filteredAndSortedPosts.length})</h2>
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search posts by title or description..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>
          <PostList
            posts={filteredAndSortedPosts}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onLike={handleLikePost}
          />
        </section>
      </main>
    </div>
  );
}

export default App;