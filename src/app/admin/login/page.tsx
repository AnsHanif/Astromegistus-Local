'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Shield } from 'lucide-react';
import Image from 'next/image';
import { useAdminLogin } from '@/hooks/mutation/admin-mutation/admin-mutations';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const adminLoginMutation = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    adminLoginMutation.mutate({ email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/test-stars.png"
          alt="Star Background"
          fill
          className="object-cover opacity-20"
        />
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-golden-glow rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-black" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-golden-glow" />
              Admin Login
            </CardTitle>
            <p className="text-white/70 mt-2">
              Access the Astromegistus Admin Panel
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-white/90"
                >
                  Admin Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@astromegistus.com"
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white/90"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-white/5 text-golden-glow focus:ring-golden-glow/20"
                  />
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                disabled={adminLoginMutation.isPending}
                className="w-full bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black font-semibold hover:from-golden-glow/90 hover:via-pink-shade/90 hover:to-golden-glow-dark/90 disabled:opacity-50"
              >
                {adminLoginMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Sign In to Admin Panel
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-white/50">
                  Authorized personnel only. All activities are logged and
                  monitored.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
