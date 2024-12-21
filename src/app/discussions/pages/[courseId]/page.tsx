"use client";

import React, { useState, useEffect } from 'react';
import usePosts from '../../hooks/usePosts';
import useCreatePost from '../../hooks/useCreatePost';
import PostList from '../../components/PostList';

const DiscussionPage = ({ params }: { params: Promise<{ courseId: string }> }) => {
  const [resolvedParams, setResolvedParams] = useState<{ courseId: string } | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const userId = '64c19af2b5f1b20edc8a4884'; // Replace with actual user ID

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const { courseId } = resolvedParams || {};

  const { posts, loading: postsLoading, error: postsError } = usePosts(courseId || '');
  const { handleCreatePost, error: postError } = useCreatePost();

  const handleSubmit = () => {
    if (courseId) {
      handleCreatePost(courseId, userId, newPostTitle, newPostContent);
    }
    setNewPostTitle('');
    setNewPostContent('');
  };

  if (!resolvedParams || postsLoading) return <p>Loading posts...</p>;
  if (postsError) return <p>{postsError}</p>;

  return (
    <div>
      <h1>Discussion Forum</h1>
      <div>
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          placeholder="Post title"
        />
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Write a new post..."
        />
        <button onClick={handleSubmit}>Post</button>
        {postError && <p>{postError}</p>}
      </div>
      <PostList posts={posts} userId={userId} />
    </div>
  );
};

export default DiscussionPage;