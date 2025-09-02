import './PostItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

function PostItem({ post, onEdit, onDelete, onLike }) {
  return (
    <div className="post-item">
      <h2 className="post-title">{post.title}</h2>
      
      <div className="post-image-container">
        {post.image ? (
          <img 
            src={post.image} 
            alt={post.title} 
            className="post-image"
          />
        ) : (
          <div className="post-image-placeholder">
            No Image
          </div>
        )}
      </div>
      
      <p className="post-description">{post.description}</p>
      
      <div className="post-actions">
        <button 
          className="like-btn"
          onClick={() => onLike(post.id)}
          aria-label="Like post"
        >
          <FontAwesomeIcon icon={faHeart} />
          <span className="like-count">{post.like}</span>
        </button>
        
        <button 
          className="edit-btn"
          onClick={() => onEdit(post)}
          aria-label="Edit post"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        
        <button 
          className="delete-btn"
          onClick={() => onDelete(post.id)}
          aria-label="Delete post"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

PostItem.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string.isRequired,
    like: PropTypes.number.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired
};

export default PostItem;