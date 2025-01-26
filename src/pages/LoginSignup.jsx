// src/pages/LoginSignup.jsx
import React, { useState } from 'react'
import { auth, db, googleProvider, sendPasswordResetEmail } from '../firebase/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const LoginSignup = () => {
  // Controla se está em modo "Login" ou "Cadastro"
  const [isLogin, setIsLogin] = useState(true)

  // Campos do formulário
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Campos extras para cadastro
  const [name, setName] = useState('')

  // Mensagens de feedback
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Função para logar/cadastrar
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    // Validação mínima de senha
    if (!isLogin && password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, email, password)
        setSuccessMessage('Login realizado com sucesso!')
        // Redirecione para outra rota/página se desejar
      } else {
        // Cadastro
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        // Salva dados do usuário no Firestore (opcional, mas recomendado)
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          createdAt: new Date(),
        })

        setSuccessMessage('Cadastro realizado com sucesso! Faça login para continuar.')
        // Limpa campos
        setName('')
        setEmail('')
        setPassword('')
        // Muda automaticamente para tela de Login (opcional)
        // setIsLogin(true)
      }
    } catch (error) {
      console.error('Erro:', error.code, error.message)
      // Tratar alguns códigos de erro conhecidos
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Este email já está em uso. Por favor, use outro ou faça login.')
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Email inválido. Verifique e tente novamente.')
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('A senha é muito fraca. Use pelo menos 6 caracteres.')
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Senha incorreta. Tente novamente.')
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('Usuário não encontrado. Verifique o email ou faça cadastro.')
      } else {
        setErrorMessage('Erro ao processar. Verifique as informações e tente novamente.')
      }
    }
  }

  // Função para login com Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      setSuccessMessage('Login com Google realizado com sucesso!')
    } catch (error) {
      console.error('Erro Google Login:', error.code, error.message)
      setErrorMessage('Falha no login com Google.')
    }
  }

  // Função para reset de senha
  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage('Informe um email para redefinir a senha.')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setSuccessMessage('Email de redefinição de senha enviado! Verifique sua caixa de entrada.')
    } catch (error) {
      console.error('Erro redefinição de senha:', error.code, error.message)
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('Usuário não encontrado. Verifique o email digitado.')
      } else {
        setErrorMessage('Não foi possível enviar o email de redefinição. Tente novamente.')
      }
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo - Imagem ou gradiente */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-blue-400 to-purple-600 items-center justify-center relative overflow-hidden">
        <div className="text-white text-3xl font-bold p-5 drop-shadow-lg z-10">
          <p>Bem-vindo ao Flow 360</p>
          <p className="mt-2 text-sm font-normal">Gerencie facilmente seus investimentos</p>
        </div>
        {/* Pode usar uma imagem de fundo aqui se quiser */}
        {/* <img 
          src="https://images.unsplash.com/photo-1621589338703-eebd8329e1c2?..." 
          alt="background" 
          className="absolute inset-0 w-full h-full object-cover opacity-20" 
        /> */}
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-700">
            {isLogin ? 'Login' : 'Cadastro'}
          </h2>

          {/* Mensagens de erro ou sucesso */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative">
              {successMessage}
            </div>
          )}

          {/* Botão de Login com Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 rounded font-semibold transition duration-200"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google icon"
              className="w-5 h-5 mr-2"
            />
            <span>Continuar com Google</span>
          </button>

          <div className="flex items-center justify-center space-x-2">
            <div className="h-px bg-gray-300 w-1/4" />
            <span className="text-gray-400 font-light">ou</span>
            <div className="h-px bg-gray-300 w-1/4" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome (exibido só no cadastro) */}
            {!isLogin && (
              <div>
                <label className="block mb-1 font-medium text-gray-600">Nome</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Senha (com mostrar/ocultar) */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border border-gray-300 px-3 py-2 rounded pr-10 focus:outline-none focus:ring-1 focus:ring-blue-400"
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition-colors"
            >
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          {/* Esqueci a senha (somente na tela de Login) */}
          {isLogin && (
            <div className="text-right text-sm mt-2">
              <button
                onClick={handleForgotPassword}
                className="text-blue-500 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
          )}

          {/* Alternar entre Login e Cadastro */}
          <div className="text-center mt-4">
            {isLogin ? (
              <span>
                Não tem conta?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false)
                    setErrorMessage('')
                    setSuccessMessage('')
                  }}
                  className="text-blue-500 hover:underline font-medium"
                >
                  Cadastre-se
                </button>
              </span>
            ) : (
              <span>
                Já possui conta?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true)
                    setErrorMessage('')
                    setSuccessMessage('')
                  }}
                  className="text-blue-500 hover:underline font-medium"
                >
                  Faça login
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
