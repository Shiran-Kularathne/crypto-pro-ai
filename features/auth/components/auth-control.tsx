'use client';

import { useEffect, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { firebaseAuth } from '../../../services/firebase/client';

export function AuthControl() {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => onAuthStateChanged(firebaseAuth, setUser), []);

  async function toggleAuth() {
    setBusy(true);
    try {
      if (user) await signOut(firebaseAuth);
      else await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    } finally {
      setBusy(false);
    }
  }

  return <button className="ghost-button auth-control" type="button" onClick={toggleAuth} disabled={busy}>
    {busy ? 'Connecting…' : user ? `Sign out ${user.displayName?.split(' ')[0] || ''}` : 'Sign in with Google'}
  </button>;
}
