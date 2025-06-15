import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, isLoading } = useApp();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLoginMode) {
        const success = await login(formData.email, formData.password);
        if (success) {
          onClose();
          setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert('As senhas não coincidem');
          return;
        }
        
        const success = await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          isAdmin: false
        });
        
        if (success) {
          onClose();
          setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLoginMode ? 'Entrar' : 'Criar Conta'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Digite seu e-mail"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Confirme sua senha"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processando...' : (isLoginMode ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLoginMode ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
              <button
                onClick={toggleMode}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {isLoginMode ? 'Criar conta' : 'Fazer login'}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Contas de Demonstração:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Usuário:</strong> user@zaggo.com / 123456</div>
              <div><strong>Admin:</strong> admin@zaggo.com / 123456</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}