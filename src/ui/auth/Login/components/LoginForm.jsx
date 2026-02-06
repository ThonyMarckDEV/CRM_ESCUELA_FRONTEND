import React from 'react';

const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  rememberMe,
  setRememberMe,
  setShowForgotPassword
}) => {
  return (
    <div className="w-full max-w-md">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Bienvenido de nuevo
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Por favor, ingresa tus credenciales para continuar.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-1">
          <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
            Usuario
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm"
            placeholder="nombre.usuario"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
              Recordar dispositivo
            </label>
          </div>
          <div className="text-sm">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="font-medium text-black hover:underline transition-all"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 transform active:scale-[0.98]"
        >
          Ingresar al Sistema
        </button>
      </form>
    </div>
  );
};

export default LoginForm;