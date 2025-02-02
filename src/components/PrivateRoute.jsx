import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';

const PrivateRoute = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Enquanto não sabe se há user logado ou não, pode exibir um Loading:
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  // Se NÃO existe usuário logado, redireciona para "/"
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Se existe usuário, renderiza o "children" (ex: <Dashboard />)
  return children;
};

export default PrivateRoute;
