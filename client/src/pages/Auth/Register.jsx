import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, User, ShieldCheck } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success("Account created!", {
          description: "Welcome to our community of creative writers."
      });
      navigate('/');
    } catch (err) {
      toast.error("Registration failed", {
          description: err.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <Card className="border-none shadow-none bg-transparent lg:bg-card lg:border lg:shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
              <CardDescription>
                Enter your details below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="johndoe" 
                    value={formData.username}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role (For Demonstration)</Label>
                  <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                    <SelectTrigger id="role" className="bg-background">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superadmin">Superadmin</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    * Roles determine your permissions in this demo application.
                  </p>
                </div>
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Modern Blog
        </div>
        <div className="relative z-20 mt-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
             <div className="space-y-4">
                <div className="p-2 bg-primary/20 rounded-lg w-fit">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Dynamic RBAC</h3>
                <p className="text-sm text-zinc-400">Granular control over who can create, edit, or delete content.</p>
             </div>
             <div className="space-y-4">
                <div className="p-2 bg-primary/20 rounded-lg w-fit">
                    <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Community Driven</h3>
                <p className="text-sm text-zinc-400">Join thousands of creators sharing their insights every day.</p>
             </div>
          </div>
          <p className="text-sm font-medium">© 2026 Modern Blog Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
