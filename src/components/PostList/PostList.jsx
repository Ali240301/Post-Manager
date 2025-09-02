import PostItem from '../PostItem/PostItem';
import './PostList.css';

function PostList({ posts, onEdit, onDelete, onLike }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="post-list-empty">
        <p>No posts yet. Create your first post!</p>
      </div>
    );
  }

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
        />
      ))}
    </div>
  );
}

export default PostList;