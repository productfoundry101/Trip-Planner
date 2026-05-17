import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, MapPin, ArrowDown, Sparkles, Map, Link2, UserCheck, Compass } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { HowItWorks } from '@/components/HowItWorks';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();

  const [isResetRequestMode, setIsResetRequestMode] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    const hash = window.location.hash || '';
    const query = window.location.search || '';
    if ((hash && (hash.includes('type=recovery') || hash.includes('access_token'))) || (query && query.includes('type=recovery'))) {
      setIsRecoveryMode(true);
      setIsResetRequestMode(false);
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
        setIsResetRequestMode(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (user && !isRecoveryMode) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = isSignUp
        ? await signUp(email, password, name)
        : await signIn(email, password);
      if (error) {
        toast({ title: 'Authentication Error', description: error.message, variant: 'destructive' });
      } else {
        toast({
          title: isSignUp ? 'Account Created' : 'Welcome Back',
          description: isSignUp
            ? 'Please check your email to verify your account.'
            : 'You have been successfully signed in.',
        });
      }
    } catch {
      toast({ title: 'Error', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: 'Email required', description: 'Please enter your email to reset your password.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) {
        toast({ title: 'Reset failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Reset email sent', description: 'Check your inbox for a link to reset your password.' });
        setIsResetRequestMode(false);
      }
    } catch {
      toast({ title: 'Error', description: 'Could not send reset email. Try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: 'Password too short', description: 'Use at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: 'Passwords do not match', description: 'Please re-enter matching passwords.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Password updated', description: 'Your password has been reset.' });
        setIsRecoveryMode(false);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch {
      toast({ title: 'Error', description: 'Could not update password. Try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Decorative hero background */}
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div className="absolute top-20 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-drift pointer-events-none" />
      <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-secondary/30 blur-3xl animate-drift-slow pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent/15 blur-3xl animate-drift pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-20 px-6 md:px-10 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <a href="#" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl gradient-warm flex items-center justify-center shadow-soft transition-transform group-hover:scale-110 group-hover:rotate-6">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Stashe</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <button onClick={() => scrollTo('how')} className="story-link text-foreground/80 hover:text-foreground">
            How it works
          </button>
          <button onClick={() => scrollTo('auth')} className="story-link text-foreground/80 hover:text-foreground">
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-10 pt-8 md:pt-16 pb-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left ~60% */}
          <div className="lg:col-span-7 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 text-accent text-xs font-medium tracking-wide uppercase mb-6 border border-secondary/30">
              <Sparkles className="h-3.5 w-3.5" />
              Travel, curated by friends
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              New city. No idea where to{' '}
              <span className="text-gradient-warm">eat or go</span>? Your friends do.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Send a link. Friends drop their top picks. You get a map worth trusting.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                onClick={() => scrollTo('auth')}
                className="gradient-warm text-primary-foreground shadow-soft hover:shadow-glow transition-all hover:scale-105 px-7 h-12 rounded-full font-semibold"
              >
                Plan my trip
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => scrollTo('how')}
                className="rounded-full px-6 h-12 hover:bg-foreground/5"
              >
                See how it works
                <ArrowDown className="h-4 w-4 ml-1 animate-float" />
              </Button>
            </div>
          </div>

          {/* Right ~40% — Auth card */}
          <div id="auth" className="lg:col-span-5 animate-scale-in">
            <div className="glass-card rounded-3xl p-8 shadow-glow hover:-translate-y-1 hover:shadow-[0_30px_80px_-15px_hsl(var(--primary)/0.45)] transition-all duration-500">
              {!isRecoveryMode && !isResetRequestMode && (
                <div className="flex items-center p-1 rounded-full bg-muted mb-6 text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-2 rounded-full transition-all ${!isSignUp ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-2 rounded-full transition-all ${isSignUp ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Sign up
                  </button>
                </div>
              )}

              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  {isRecoveryMode
                    ? 'Set a new password'
                    : isResetRequestMode
                      ? 'Reset your password'
                      : isSignUp
                        ? 'Create your account'
                        : 'Welcome back'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isRecoveryMode
                    ? 'Choose a new password to regain access.'
                    : isResetRequestMode
                      ? 'We\'ll email you a reset link.'
                      : isSignUp
                        ? 'Start collecting picks from your friends.'
                        : 'Sign in to plan your next trip.'}
                </p>
              </div>

              {isRecoveryMode ? (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required placeholder="Enter new password" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm new password</Label>
                    <Input id="confirm-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} minLength={6} required placeholder="Confirm new password" className="h-11 rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full h-11 rounded-xl gradient-warm text-primary-foreground hover:shadow-glow transition-all" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update password
                  </Button>
                  <div className="text-center text-sm">
                    <Button variant="link" className="p-0 h-auto font-normal" onClick={() => setIsRecoveryMode(false)}>
                      Back to sign in
                    </Button>
                  </div>
                </form>
              ) : isResetRequestMode ? (
                <form onSubmit={handleResetRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="h-11 rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full h-11 rounded-xl gradient-warm text-primary-foreground hover:shadow-glow transition-all" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send reset link
                  </Button>
                  <div className="text-center text-sm">
                    <Button variant="link" className="p-0 h-auto font-normal" onClick={() => setIsResetRequestMode(false)}>
                      Back to sign in
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className="h-11 rounded-xl" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 6 characters" minLength={6} className="h-11 rounded-xl" />
                    </div>
                    <Button type="submit" className="w-full h-11 rounded-xl gradient-warm text-primary-foreground hover:shadow-glow transition-all hover:scale-[1.02]" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSignUp ? 'Create account' : 'Sign in'}
                    </Button>
                  </form>
                  {!isSignUp && (
                    <div className="mt-3 text-center text-sm">
                      <Button variant="link" className="p-0 h-auto font-normal text-muted-foreground hover:text-primary" onClick={() => setIsResetRequestMode(true)}>
                        Forgot password?
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* Why Stashe */}
      <section id="why" className="relative px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-accent text-xs font-medium tracking-wide uppercase mb-4">
              Why Stashe
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
              The best restaurants and hidden gems in any city, sourced from the only people you{' '}
              <span className="text-gradient-warm">actually trust</span>.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Compass,
                title: 'From people who have actually been there',
                desc: 'Travel guides are written by strangers. Your friends have actually been there.',
              },
              {
                icon: UserCheck,
                title: 'One pick per friend, per category',
                desc: 'No noise, no overwhelming lists. Just the absolute best from each person.',
              },
              {
                icon: Link2,
                title: 'No app or account needed for contributors',
                desc: 'Friends contribute with just a link. Zero friction.',
              },
              {
                icon: Map,
                title: 'A live map that goes wherever you do',
                desc: 'Every pick pinned and ready. Take it on the road.',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl bg-card/60 border border-border hover:border-primary/40 hover:bg-card transition-all hover-lift"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl gradient-warm text-primary-foreground mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold mb-2">{f.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border py-12 px-6 text-center">
        <p className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground mb-2">
          Stop researching. Start exploring.
        </p>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Stashe</p>
      </footer>
    </div>
  );
}
