import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TinyMCEEditor from '../components/Editor/TinyMCEEditor';
import { useAuth } from '../context/AuthContext';
import { Send, Image as ImageIcon, Tag, ArrowLeft, RefreshCw, Save } from 'lucide-react';
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

const EditPost = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: 'Technology',
    tags: '',
  });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/posts/${id}`);
      const post = res.data.data;
      
      // Authorization check
      if (!user || (user.id !== post.author._id && user.role !== 'admin' && user.role !== 'superadmin')) {
        toast.error("Unauthorized", {
            description: "You do not have permission to modify this publication."
        });
        navigate('/');
        return;
      }

      setFormData({
        title: post.title,
        excerpt: post.excerpt || '',
        category: post.category || 'Technology',
        tags: post.tags?.join(', ') || '',
      });
      setContent(post.content);
    } catch (err) {
      toast.error("Error", {
          description: "Failed to load the article data for editing."
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCategoryChange = (val) => {
    setFormData({ ...formData, category: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const postData = {
        ...formData,
        content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t !== ''),
      };

      await axios.put(`http://localhost:5000/api/v1/posts/${id}`, postData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success("Publication Updated", {
          description: "Your changes have been successfully synchronized."
      });
      navigate(`/post/${id}`);
    } catch (err) {
      toast.error("Update Failed", {
          description: err.response?.data?.message || 'We encountered an error while updating your post.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return (
        <div className="container max-w-5xl py-20 flex flex-col items-center justify-center gap-6">
           <RefreshCw className="h-10 w-10 animate-spin text-primary" />
           <p className="font-bold tracking-widest uppercase text-sm">Retrieving Article Source...</p>
        </div>
     );
  }

  return (
    <div className="container max-w-5xl py-12 px-6">
      <header className="flex items-center justify-between mb-10 pb-6 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" onClick={() => navigate(-1)}>
             <ArrowLeft className="h-4 w-4" />
             <span className="text-xs font-bold uppercase tracking-tight">Return</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Revise Publication</h1>
          <p className="text-muted-foreground text-sm font-medium">Refining your voice and impact.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/dashboard">Cancel</Link>
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate(`/post/${id}`)}>
             <Eye className="h-4 w-4" /> Preview
          </Button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          < Card className="border-border/50 shadow-sm bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Primary Content</CardTitle>
              <CardDescription>Update the title and body of your article.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Publication Title</Label>
                <Input 
                  id="title" 
                  className="text-2xl font-black h-14 border-none bg-muted/30 focus-visible:ring-primary" 
                  placeholder="Enter title..." 
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
              <CardTitle className="text-lg font-bold">Metadata & Preservation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Classification</Label>
                <Select onValueChange={handleCategoryChange} value={formData.category}>
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
                  placeholder="Summary for feed..." 
                  className="h-32 resize-none bg-background focus-visible:ring-primary" 
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  maxLength={200}
                />
                <p className="text-[10px] text-right text-muted-foreground font-mono">{formData.excerpt.length}/200</p>
              </div>

              <Button type="submit" className="w-full font-black py-6 text-lg gap-2 shadow-xl shadow-primary/20" disabled={saving}>
                 {saving ? "Synchronizing..." : <><Save className="h-5 w-5" /> Save Changes</>}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
