import React from 'react';
import { Comment } from '../interfaces/comment';

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div>
      {comments.map(comment => (
        <div key={comment._id} className="comment">
          <p>{comment.content}</p>
          <p>By: {comment.author.name}</p>
          <p>Posted on: {new Date(comment.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;