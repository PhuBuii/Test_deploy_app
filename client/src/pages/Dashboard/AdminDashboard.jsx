import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Heart, 
  Trash2, 
  Edit, 
  BarChart3,
  ShieldAlert,
  Search,
  MoreHorizontal,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalComments: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };

      if (activeTab === 'posts') {
        const res = await axios.get('http://localhost:5000/api/v1/posts', config);
        setPosts(res.data.data);
        
        const totalLikes = res.data.data.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
        const totalComments = res.data.data.reduce((acc, post) => acc + (post.commentCount || 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalPosts: res.data.count,
          totalLikes,
          totalComments
        }));
      } else if (activeTab === 'users' && (user.role === 'admin' || user.role === 'superadmin')) {
        const res = await axios.get('http://localhost:5000/api/v1/auth/users', config);
        setUsers(res.data.data);
        setStats(prev => ({ ...prev, totalUsers: res.data.count }));
      }
    } catch (err) {
      toast.error("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(posts.filter(p => p._id !== id));
      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.filter(u => u._id !== id));
      toast.success("User removed successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-12 px-6 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px] py-0.5 font-bold">
            Administrative Console
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
             Command Center
          </h1>
          <p className="text-muted-foreground">Manage your ecosystem, users, and conversations.</p>
        </div>
        <Button onClick={() => navigate('/create-post')} className="gap-2 font-bold shadow-lg shadow-primary/20">
            <PlusCircle className="h-4 w-4" />
            New Publication
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Articles', value: stats.totalPosts, icon: FileText, trend: '+4% from last month' },
          { title: 'Registered Users', value: stats.totalUsers, icon: Users, trend: '+12% from last month' },
          { title: 'Community Likes', value: stats.totalLikes, icon: Heart, trend: '2.4k new this week' },
          { title: 'Conversations', value: stats.totalComments, icon: MessageSquare, trend: '+18% active threads' },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <StatsChart Placeholder />

      <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <TabsList className="grid grid-cols-2 w-full md:w-[300px] h-11">
            <TabsTrigger value="posts" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Articles</TabsTrigger>
            {(user.role === 'superadmin' || user.role === 'admin') && (
              <TabsTrigger value="users" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Personnel</TabsTrigger>
            )}
          </TabsList>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={`Search ${activeTab === 'posts' ? 'publications' : 'personnel'}...`}
                className="pl-10 h-11 bg-muted/30 border-border/50 focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === 'users' && (
              <Button onClick={() => navigate('/register')} variant="outline" className="h-11 gap-2 font-bold whitespace-nowrap">
                <PlusCircle className="h-4 w-4" />
                Add Personnel
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="posts">
          <Card className="border-border/50 overflow-hidden bg-card/30">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[300px]">Article</TableHead>
                  <TableHead>Principal Author</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead className="text-right">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post._id} className="hover:bg-muted/30 group">
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <p className="font-bold leading-none group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/post/${post._id}`)}>
                          {post.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">ID: {post._id.substring(0, 10)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 border">
                             <AvatarImage src={`https://avatar.iran.liara.run/username?username=${post.author.username}`} />
                             <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{post.author.username}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="capitalize text-[10px] font-bold py-0 h-5">
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1.5 text-xs"><Heart className="h-3 w-3" /> {post.likes?.length || 0}</span>
                        <span className="flex items-center gap-1.5 text-xs"><MessageSquare className="h-3 w-3" /> {post.commentCount || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/post/${post._id}`)}>
                            <ExternalLink className="mr-2 h-4 w-4" /> View Post
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/edit-post/${post._id}`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Content
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredPosts.length === 0 && !loading && (
              <div className="py-20 text-center text-muted-foreground space-y-4">
                <FileText className="h-12 w-12 mx-auto opacity-20" />
                <p>No publications found matching your criteria.</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-border/50 overflow-hidden bg-card/30">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>User Identity</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Temporal Origin</TableHead>
                  <TableHead className="text-right">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u._id} className="hover:bg-muted/30">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-primary/10">
                           <AvatarImage src={`https://avatar.iran.liara.run/username?username=${u.username}`} />
                           <AvatarFallback>{u.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold leading-none">{u.username}</p>
                          <p className="text-xs text-muted-foreground mt-1">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={u.role === 'superadmin' ? 'destructive' : u.role === 'admin' ? 'default' : 'secondary'} 
                        className="uppercase text-[10px] font-bold tracking-wider py-0 h-5"
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                       {new Date(u.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role === 'superadmin' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={u._id === user.id}
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
      
      {loading && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center z-50">
           <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold tracking-widest uppercase">Synchronizing Data...</p>
           </div>
        </div>
      )}
    </div>
  );
};

const StatsChart = () => (
    <Card className="border-border/50 bg-card/30 overflow-hidden">
        <CardHeader className="pb-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Engagement Trajectory</CardTitle>
            <CardDescription>Aggregate performance across all digital touchpoints.</CardDescription>
        </CardHeader>
        <CardContent className="h-32 flex items-end gap-1 px-6 pb-6 pt-4">
            {[40, 60, 45, 90, 65, 80, 50, 75, 55, 95, 70, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-colors cursor-help group relative" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border">
                        Day {i + 1}: {h * 12} views
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
)

export default AdminDashboard;
