import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, User, MessageSquare, Heart, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/posts');
      setPosts(res.data.data);
    } catch (err) {
      console.error('Error fetching posts', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-12 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="space-y-4">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container py-12 px-6">
      <section className="mb-20 text-center max-w-3xl mx-auto space-y-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
            Explore the Universe of Knowledge
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Insights and Stories from the <span className="text-primary italic">Modern World</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Deep dives into technology, creative perspectives, and the latest trends shaping our digital future.
          </p>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              key={post._id} 
              className="flex flex-col h-full border-border/50 bg-card/50 backdrop-blur-sm hover-lift transition-all cursor-pointer overflow-hidden group"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <AspectRatio ratio={16 / 9} className="overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${post._id}/800/600`} 
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground border-none hover:bg-background/90">
                  {post.category}
                </Badge>
              </AspectRatio>

              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author.username}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <CardTitle className="text-2xl leading-tight line-clamp-2 transition-colors">
                  <Link to={`/post/${post._id}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3 leading-relaxed text-[15px]">
                  {post.excerpt}
                </p>
              </CardContent>

              <CardFooter className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-4 text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5 text-xs">
                    <Heart className="w-4 h-4" /> {post.likes.length}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <MessageSquare className="w-4 h-4" /> {post.commentCount}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="font-bold gap-1 p-0 hover:bg-transparent hover:text-primary transition-all group/btn" asChild>
                  <Link to={`/post/${post._id}`}>
                    Read Story
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <MessageSquare className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold">Silence in the universe</h3>
          <p className="text-muted-foreground max-w-xs">No posts have been shared yet. Be the first to start the conversation.</p>
          <Button asChild className="mt-4">
            <Link to="/create-post">Create First Post</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
