import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, MapPin, Clock, Users, DollarSign, Image } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Field } from '../../types';

export function AdminPage() {
  const { user, fields, addField, updateField, deleteField, isLoading } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'fut7' as 'fut11' | 'fut7' | 'futsal',
    neighborhood: '',
    address: '',
    capacity: 14,
    hourlyRate: 80,
    amenities: [] as string[],
    images: [''],
    operatingHours: { start: '06:00', end: '22:00' }
  });

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você precisa ser administrador para acessar esta página</p>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'fut7',
      neighborhood: '',
      address: '',
      capacity: 14,
      hourlyRate: 80,
      amenities: [],
      images: [''],
      operatingHours: { start: '06:00', end: '22:00' }
    });
  };

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addField(formData);
    if (success) {
      setShowAddForm(false);
      resetForm();
    }
  };

  const handleEditField = (field: Field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      type: field.type,
      neighborhood: field.neighborhood,
      address: field.address,
      capacity: field.capacity,
      hourlyRate: field.hourlyRate,
      amenities: field.amenities,
      images: field.images,
      operatingHours: field.operatingHours
    });
  };

  const handleUpdateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingField) return;
    
    const success = await updateField(editingField.id, formData);
    if (success) {
      setEditingField(null);
      resetForm();
    }
  };

  const handleDeleteField = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este campo?')) {
      await deleteField(id);
    }
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        amenities: prev.amenities.filter(a => a !== amenity)
      }));
    }
  };

  const availableAmenities = [
    'Vestiário', 'Iluminação', 'Estacionamento', 'Bebedouro', 
    'Quadra Coberta', 'Grama Sintética', 'Gramado Natural', 
    'Arquibancada', 'Som Ambiente', 'Chuveiro', 'Segurança'
  ];

  const getFieldTypeLabel = (type: string) => {
    switch (type) {
      case 'fut11': return 'Futebol 11x11';
      case 'fut7': return 'Futebol 7';
      case 'futsal': return 'Futsal';
      default: return type;
    }
  };

  const getFieldTypeColor = (type: string) => {
    switch (type) {
      case 'fut11': return 'bg-yellow-100 text-yellow-800';
      case 'fut7': return 'bg-green-100 text-green-800';
      case 'futsal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie os campos esportivos do sistema
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚽</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {fields.filter(f => f.type === 'fut11').length}
                </h3>
                <p className="text-gray-600">Campos 11x11</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏟️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {fields.filter(f => f.type === 'fut7').length}
                </h3>
                <p className="text-gray-600">Campos Fut7</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏐</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {fields.filter(f => f.type === 'futsal').length}
                </h3>
                <p className="text-gray-600">Quadras Futsal</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">{fields.length}</h3>
                <p className="text-gray-600">Total de Campos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Field Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar Novo Campo</span>
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {(showAddForm || editingField) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingField ? 'Editar Campo' : 'Adicionar Novo Campo'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingField(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={editingField ? handleUpdateField : handleAddField} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Campo
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ex: Campo Municipal Centro"
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Campo
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'fut11' | 'fut7' | 'futsal' })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="fut11">⚽ Futebol 11x11</option>
                        <option value="fut7">🏟️ Futebol 7</option>
                        <option value="futsal">🏐 Futsal</option>
                      </select>
                    </div>

                    {/* Neighborhood */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ex: Centro"
                      />
                    </div>

                    {/* Capacity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacidade (jogadores)
                      </label>
                      <input
                        type="number"
                        required
                        min="10"
                        max="22"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Hourly Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor por Hora (R$)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Operating Hours */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horário de Funcionamento
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="time"
                          required
                          value={formData.operatingHours.start}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            operatingHours: { ...formData.operatingHours, start: e.target.value }
                          })}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="time"
                          required
                          value={formData.operatingHours.end}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            operatingHours: { ...formData.operatingHours, end: e.target.value }
                          })}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço Completo
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: Rua das Flores, 123 - Centro, Maringá - PR"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Image className="w-4 h-4 inline mr-2" />
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      value={formData.images[0]}
                      onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Comodidades
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableAmenities.map((amenity) => (
                        <label key={amenity} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingField(null);
                        resetForm();
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>{isLoading ? 'Salvando...' : (editingField ? 'Atualizar' : 'Adicionar')}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Fields List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Campos Cadastrados</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fields.map((field) => (
                  <tr key={field.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={field.images[0]}
                          alt={field.name}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {field.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Capacidade: {field.capacity} jogadores
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFieldTypeColor(field.type)}`}>
                        {getFieldTypeLabel(field.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{field.neighborhood}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {field.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        R$ {field.hourlyRate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {field.operatingHours.start} - {field.operatingHours.end}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditField(field)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteField(field.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}