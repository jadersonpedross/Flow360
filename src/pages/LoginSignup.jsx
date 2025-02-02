// src/pages/LoginSignup.jsx
import React, { useState } from 'react';
import { auth, db, googleProvider, sendPasswordResetEmail } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isLogin && password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMessage('Login realizado com sucesso!');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          createdAt: new Date(),
        });
        setSuccessMessage('Cadastro realizado com sucesso! Faça login para continuar.');
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Erro:', error.code, error.message);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Este email já está em uso. Por favor, use outro ou faça login.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Email inválido. Verifique e tente novamente.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('A senha é muito fraca. Use pelo menos 6 caracteres.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Senha incorreta. Tente novamente.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('Usuário não encontrado. Verifique o email ou faça cadastro.');
      } else {
        setErrorMessage('Erro ao processar. Verifique as informações e tente novamente.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccessMessage('Login com Google realizado com sucesso!');
    } catch (error) {
      console.error('Erro Google Login:', error.code, error.message);
      setErrorMessage('Falha no login com Google.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage('Informe um email para redefinir a senha.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Email de redefinição de senha enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error('Erro redefinição de senha:', error.code, error.message);
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('Usuário não encontrado. Verifique o email digitado.');
      } else {
        setErrorMessage('Não foi possível enviar o email de redefinição. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {isLogin ? 'Login' : 'Cadastro'}
          </h2>

          {/* Mensagens de erro ou sucesso */}
          {errorMessage && (
            <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-2 text-red-700">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-2 text-green-700">
              {successMessage}
            </div>
          )}

          {/* Botão de Login com Google */}
          <button
            onClick={handleGoogleLogin}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2 text-gray-700 font-semibold transition duration-200 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google icon"
              className="h-5 w-5"
            />
            <span className="text-sm">Continuar com Google</span>
          </button>

          <div className="mb-6 flex items-center justify-center space-x-2">
            <div className="h-px w-1/4 bg-gray-300" />
            <span className="font-light text-gray-400">ou</span>
            <div className="h-px w-1/4 bg-gray-300" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome (exibido só no cadastro) */}
            {!isLogin && (
              <div>
                <label className="mb-1 block font-medium text-gray-600">Nome</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-1 block font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Senha (com mostrar/ocultar) */}
            <div>
              <label className="mb-1 block font-medium text-gray-600">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 3a7 7 0 0 0-7 7c0 1.308.853 3.164 2.355 4.56.431.415.947.829 1.522 1.212-.165-.76-.232-1.534-.232-2.272a15.073 15.073 0 0 1 .232-2.272A7 7 0 0 0 10 3zm-1.125 10.06a3 3 0 1 1 2.25-5.12 4.997 4.997 0 0 1 1.314 1.327 2.999 2.999 0 0 1-3.564 3.793z" />
                      <path
                        fillRule="evenodd"
                        d="M10 1a9 9 0 0 1 9 9c0 4.416-5.366 8-9 8S1 14.416 1 10a9 9 0 0 1 9-9zm0 16c3.9 0 7-3.336 7-7a7 7 0 0 0-14 0c0 3.664 3.09 7 7 7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.10 3.16a1 1 0 0 1 1.42 0l12.37 12.37a1 1 0 0 1-1.42 1.42l-1.93-1.93c-1.12.59-2.38.98-3.54.98-3.634 0-9-3.584-9-8 0-1.66.66-3.22 1.66-4.47L3.10 4.58a1 1 0 0 1 0-1.42zm13.8 7.56c0 .61-.13 1.28-.35 1.92l-2.08-2.08v-.05c0-.162-.013-.324-.04-.48A3 3 0 0 0 9.95 6.72c-.156-.027-.318-.04-.48-.04h-.05L7.35 4.65A7.074 7.074 0 0 1 10 4c3.63 0 9 3.58 9 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Botão Principal (Login ou Cadastro) */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-500 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-600"
            >
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          {/* Esqueci a senha (somente na tela de Login) */}
          {isLogin && (
            <div className="mt-4 text-right text-sm">
              <button
                onClick={handleForgotPassword}
                className="text-blue-500 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
          )}

          {/* Alternar entre Login e Cadastro */}
          <div className="mt-6 text-center">
            {isLogin ? (
              <span>
                Não tem conta?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-medium text-blue-500 hover:underline"
                >
                  Cadastre-se
                </button>
              </span>
            ) : (
              <span>
                Já possui conta?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-medium text-blue-500 hover:underline"
                >
                  Faça login
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
