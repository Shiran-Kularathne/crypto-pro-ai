'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User } from 'firebase/auth';
import { firebaseAuth } from '../../../services/firebase/client';
import './auth-control.css';

export function AuthControl() {
  const [user, setUser] = useState<User | null>(null); const [open, setOpen] = useState(false); const [registering, setRegistering] = useState(false); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  useEffect(() => onAuthStateChanged(firebaseAuth, setUser), []);
  async function googleSignIn() { setError(''); try { await signInWithPopup(firebaseAuth, new GoogleAuthProvider()); setOpen(false); } catch (e) { setError(e instanceof Error ? e.message : 'Google sign-in failed.'); } }
  async function submitEmail(event: FormEvent) { event.preventDefault(); setError(''); try { if (registering) await createUserWithEmailAndPassword(firebaseAuth, email, password); else await signInWithEmailAndPassword(firebaseAuth, email, password); setOpen(false); } catch (e) { setError(e instanceof Error ? e.message : 'Email authentication failed.'); } }
  if (user) return <button className="ghost-button" type="button" onClick={() => signOut(firebaseAuth)}>Sign out {user.displayName?.split(' ')[0] || 'account'}</button>;
  return <><button className="ghost-button" type="button" onClick={() => setOpen(true)}>Sign in</button>{open && <div className="auth-backdrop" onClick={() => setOpen(false)}><section className="auth-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="auth-close" type="button" onClick={() => setOpen(false)}>×</button><span className="eyebrow">ACCOUNT ACCESS</span><h2>{registering ? 'Create your account' : 'Welcome back'}</h2><p className="auth-copy">Save project ideas, watchlists, and portfolio data securely.</p><button className="secondary-button full-width" type="button" onClick={googleSignIn}>Continue with Google</button><div className="auth-divider">or use email</div><form className="auth-form" onSubmit={submitEmail}><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" required /><input type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password (6+ characters)" required /><button className="primary-button full-width" type="submit">{registering ? 'Create account' : 'Sign in with email'}</button></form>{error && <p className="auth-error">{error}</p>}<button className="auth-switch" type="button" onClick={() => { setRegistering(!registering); setError(''); }}>{registering ? 'Already have an account? Sign in' : 'New here? Create an account'}</button></section></div>}</>;
}
