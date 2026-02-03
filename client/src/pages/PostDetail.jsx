import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Heart, MessageSquare, ArrowLeft, Send, Trash2, Clock, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/posts/${id}`);
      setPost(res.data.data);
      if (user && res.data.data.likes.includes(user.id)) {
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Error fetching post', err);
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.info("Please login to like this post");
      return navigate('/login');
    }
    try {
      const res = await axios.put(`http://localhost:5000/api/v1/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPost({ ...post, likes: res.data.data });
      setIsLiked(res.data.data.includes(user.id));
      if (!isLiked) toast.success("Post liked!");
    } catch (err) {
      toast.error("Error liking post");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/v1/posts/${id}/comments`, 
        { content: commentText },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success("Comment added!");
      fetchPost();
      setCommentText('');
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Comment deleted");
      fetchPost();
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) {
     return (
       <div className="container max-w-4xl py-12 px-6 animate-pulse space-y-8">
         <div className="h-10 w-32 bg-muted rounded-lg"></div>
         <div className="h-[400px] w-full bg-muted rounded-3xl"></div>
         <div className="space-y-4">
           <div className="h-12 w-3/4 bg-muted rounded-lg"></div>
           <div className="h-6 w-1/2 bg-muted rounded-lg"></div>
         </div>
       </div>
     );
  }

  if (!post) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 text-center space-y-4">
        <h2 className="text-3xl font-bold">Post not found</h2>
        <Button asChild variant="outline">
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12 px-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')} 
        className="mb-8 group text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Stories
      </Button>

      <article className="space-y-12">
        <header className="space-y-8">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1 uppercase tracking-wider text-[10px] font-bold">
              {post.category}
            </Badge>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              5 min read
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-border/50">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarImage src={`https://avatar.iran.liara.run/username?username=${post.author.username}`} />
                <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold leading-none">{post.author.username}</p>
                <p className="text-sm text-muted-foreground mt-1">Thought Leader & Creator</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant={isLiked ? "default" : "outline"} 
                size="sm" 
                onClick={handleLike}
                className={`gap-2 rounded-full ${isLiked ? 'bg-red-500 hover:bg-red-600 border-none' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                {post.likes.length}
              </Button>
              <Button variant="outline" size="sm" className="rounded-full gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {post.featuredImage && (
          <AspectRatio ratio={21 / 9} className="rounded-3xl overflow-hidden shadow-2xl border border-border/50">
             <img 
               src={`https://picsum.photos/seed/${post._id}/1200/600`} 
               alt={post.title}
               className="object-cover w-full h-full"
             />
          </AspectRatio>
        )}

        <div 
          className="prose prose-neutral dark:prose-invert prose-lg max-w-none prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:bg-muted prose-pre:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Separator className="my-16" />

        <section className="space-y-12 pb-20">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              Conversation ({post.comments?.length || 0})
            </h2>
          </div>

          {user ? (
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="pt-6">
                <form onSubmit={handleComment} className="space-y-4">
                  <Textarea 
                    placeholder="Join the discussion... Be respectful and constructive."
                    className="min-h-[120px] bg-background/50 border-border/50 focus-visible:ring-primary"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={submitting} className="font-bold gap-2">
                      {submitting ? 'Posting...' : <><Send className="h-4 w-4" /> Post Comment</>}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-muted/50 rounded-2xl p-8 text-center border border-dashed border-border/50">
              <p className="text-muted-foreground mb-4 font-medium">Want to share your perspective?</p>
              <Button asChild variant="outline">
                <Link to="/login">Login to Comment</Link>
              </Button>
            </div>
          )}

          <div className="grid gap-6">
            <AnimatePresence initial={false}>
              {post.comments?.map((comment, index) => (
                <motion.div 
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={`https://avatar.iran.liara.run/username?username=${comment.author.username}`} />
                          <AvatarFallback>{comment.author.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">{comment.author.username}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-sm">
                            {comment.content}
                          </p>
                          {(user && (user.id === comment.author._id || user.role === 'admin' || user.role === 'superadmin')) && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2 text-[10px] text-muted-foreground hover:text-destructive gap-1 mt-2"
                              onClick={() => handleDeleteComment(comment._id)}
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {post.comments?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm italic">No comments have been posted yet. Start the conversation!</p>
              </div>
            )}
          </div>
        </section>
      </article>
    </div>
  );
};

export default PostDetail;
