import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TinyMCEEditor from '../components/Editor/TinyMCEEditor';
import { useNavigate, Link } from 'react-router-dom';
import { Send, Image as ImageIcon, Tag, ArrowLeft, Eye, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: 'Technology',
    tags: '',
  });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Authentication Required", {
          description: "Please sign in to share your story with the world."
      });
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCategoryChange = (val) => {
    setFormData({ ...formData, category: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || content.length < 50) {
        return toast.warning("Content too short", {
            description: "Please provide a more substantial article (at least 50 characters)."
        });
    }

    setLoading(true);
    try {
      const postData = {
        ...formData,
        content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t !== ''),
        status: 'published'
      };

      await axios.post('http://localhost:5000/api/v1/posts', postData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success("Publication Live!", {
          description: "Your article has been successfully deployed to the global feed."
      });
      navigate('/');
    } catch (err) {
      toast.error("Deployment Failed", {
          description: err.response?.data?.message || 'We encountered an error while publishing your post.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl py-12 px-6">
      <header className="flex items-center justify-between mb-10 pb-6 border-b">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">New Publication</h1>
          <p className="text-muted-foreground text-sm font-medium">Draft your next breakthrough story.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/">Cancel</Link>
          </Button>
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" /> Save Draft
          </Button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/50 shadow-sm bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Primary Content</CardTitle>
              <CardDescription>The core of your message. Use the rich text editor below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Publication Title</Label>
                <Input 
                  id="title" 
                  className="text-2xl font-black h-14 border-none bg-muted/30 focus-visible:ring-primary" 
                  placeholder="The Dawn of Quantum Computing..." 
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Article Body</Label>
                <div className="rounded-xl overflow-hidden border border-border/50">
                  <TinyMCEEditor
                    value={content}
                    onChange={(val) => setContent(val)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-border/50 shadow-sm bg-card/50 sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Metadata & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Classification</Label>
                <Select onValueChange={handleCategoryChange} defaultValue={formData.category}>
                  <SelectTrigger id="category" className="bg-background">
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Semantic Tags</Label>
                <div className="relative">
                   <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input 
                     id="tags" 
                     className="pl-9 bg-background" 
                     placeholder="ai, future, ethics..." 
                     value={formData.tags}
                     onChange={handleInputChange}
                   />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Global Preview (Excerpt)</Label>
                <Textarea 
                  id="excerpt" 
                  placeholder="A concise summary for the global feed discoverability..." 
                  className="h-32 resize-none bg-background focus-visible:ring-primary" 
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  maxLength={200}
                />
                <p className="text-[10px] text-right text-muted-foreground font-mono">{formData.excerpt.length}/200</p>
              </div>

              <Button type="submit" className="w-full font-black py-6 text-lg gap-2 shadow-xl shadow-primary/20" disabled={loading}>
                 {loading ? "Processing..." : <><Send className="h-5 w-5" /> Deploy Post</>}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
