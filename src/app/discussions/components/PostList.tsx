import React, { useState } from 'react';
import { Post } from '../interfaces/post';
import CommentList from './CommentList';
import useComments from '../hooks/useComments';
import useCreateComment from '../hooks/useCreateComment';

interface PostListProps {
  posts: Post[];
  userId: string;
}

const PostList: React.FC<PostListProps> = ({ posts, userId }) => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleToggleComments = (postId: string) => {
    setSelectedPostId(selectedPostId === postId ? null : postId);
  };

  return (
    <div>
      {posts.map(post => (
        <div key={post._id} className="post">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>By: {post.author.name}</p>
          <p>Posted on: {new Date(post.createdAt).toLocaleString()}</p>
          <button onClick={() => handleToggleComments(post._id)}>
            {selectedPostId === post._id ? 'Hide Comments' : 'Show Comments'}
          </button>
          {selectedPostId === post._id && (
            <CommentsSection postId={post._id} userId={userId} />
          )}
        </div>
      ))}
    </div>
  );
};

const CommentsSection: React.FC<{ postId: string; userId: string }> = ({ postId, userId }) => {
  const { comments, loading, error } = useComments(postId);
  const { handleCreateComment, error: commentError } = useCreateComment();
  const [newCommentContent, setNewCommentContent] = useState('');

  const handleSubmit = () => {
    handleCreateComment(postId, userId, newCommentContent);
    setNewCommentContent('');
  };

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <CommentList comments={comments} />
      <div>
        <textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Write a new comment..."
        />
        <button onClick={handleSubmit}>Comment</button>
        {commentError && <p>{commentError}</p>}
      </div>
    </div>
  );
};

export default PostList;