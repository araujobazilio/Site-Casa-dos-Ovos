import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Phone, Clock, Edit3, Plus, Trash2, Save, Eye, Settings, Loader2 } from 'lucide-react';
import { supabase, Product, StoreSettings } from './lib/supabase';
import EggClassificationTable from './components/EggClassificationTable';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Load data from Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Load store settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }
      
      setStoreSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = (productName: string, price: number) => {
    if (!storeSettings?.whatsapp) return;
    
    const message = encodeURIComponent(
      `Olá! Tenho interesse no produto: ${productName} - R$ ${price.toFixed(2).replace('.', ',')}. Gostaria de mais informações.`
    );
    window.open(`https://wa.me/${storeSettings.whatsapp}?text=${message}`, '_blank');
  };

  const handleSaveProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (isAddingProduct) {
        const { error } = await supabase
          .from('products')
          .insert([product]);
        
        if (error) throw error;
        setIsAddingProduct(false);
      } else if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(product)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
      }
      
      setEditingProduct(null);
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', productId);
      
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erro ao excluir produto. Tente novamente.');
    }
  };

  const handleSaveStoreSettings = async (settings: Partial<StoreSettings>) => {
    try {
      if (storeSettings) {
        const { error } = await supabase
          .from('store_settings')
          .update(settings)
          .eq('id', storeSettings.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('store_settings')
          .insert([settings]);
        
        if (error) throw error;
      }
      
      loadData();
    } catch (error) {
      console.error('Error saving store settings:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    }
  };

  const ProductCard = ({ product, isAdminMode = false }: { product: Product; isAdminMode?: boolean }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative">
        <img 
          src={product.image || 'https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg?auto=compress&cs=tinysrgb&w=400'} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {isAdminMode && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => setEditingProduct(product)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => handleDeleteProduct(product.id)}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
        {product.classification && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {product.classification}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2 text-sm">
          <span className="font-semibold">Quantidade:</span> {product.quantity} {product.type === 'codorna' ? 'unidades' : 'dúzias'}
        </p>
        <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-orange-500">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          {!isAdminMode && storeSettings && (
            <button
              onClick={() => handleWhatsAppClick(product.name, product.price)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
            >
              <Phone size={18} />
              WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const ProductForm = ({ product, onSave, onCancel }: {
    product?: Product;
    onSave: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      image: product?.image || '',
      type: product?.type || 'estojo' as const,
      classification: product?.classification || 'G' as const,
      quantity: product?.quantity || 1,
      is_active: product?.is_active ?? true
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {product ? 'Editar Produto' : 'Adicionar Produto'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quantidade</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL da Imagem</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="estojo">Estojo</option>
                <option value="palhao">Palhão</option>
                <option value="caixa">Caixa</option>
                <option value="codorna">Codorna</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Classificação</label>
              <select
                value={formData.classification || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, classification: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="P">P - Pequeno</option>
                <option value="M">M - Médio</option>
                <option value="G">G - Grande</option>
                <option value="XL">XL - Extra</option>
                <option value="Jumbo">Jumbo</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onSave(formData)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-orange-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Carregando dados da loja...</p>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="text-orange-500" />
                Painel Administrativo
              </h1>
              <button
                onClick={() => setIsAdmin(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Eye size={18} />
                Ver Site
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Store Info Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Informações da Loja</h2>
            {storeSettings && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Loja</label>
                  <input
                    type="text"
                    value={storeSettings.store_name}
                    onChange={(e) => setStoreSettings(prev => prev ? ({
                      ...prev,
                      store_name: e.target.value
                    }) : null)}
                    onBlur={() => storeSettings && handleSaveStoreSettings({ store_name: storeSettings.store_name })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <input
                    type="text"
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings(prev => prev ? ({
                      ...prev,
                      phone: e.target.value
                    }) : null)}
                    onBlur={() => storeSettings && handleSaveStoreSettings({ phone: storeSettings.phone })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">WhatsApp (apenas números)</label>
                  <input
                    type="text"
                    value={storeSettings.whatsapp}
                    onChange={(e) => setStoreSettings(prev => prev ? ({
                      ...prev,
                      whatsapp: e.target.value
                    }) : null)}
                    onBlur={() => storeSettings && handleSaveStoreSettings({ whatsapp: storeSettings.whatsapp })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="5511987654321"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Horário de Funcionamento</label>
                  <input
                    type="text"
                    value={storeSettings.hours}
                    onChange={(e) => setStoreSettings(prev => prev ? ({
                      ...prev,
                      hours: e.target.value
                    }) : null)}
                    onBlur={() => storeSettings && handleSaveStoreSettings({ hours: storeSettings.hours })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Endereço</label>
                  <input
                    type="text"
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings(prev => prev ? ({
                      ...prev,
                      address: e.target.value
                    }) : null)}
                    onBlur={() => storeSettings && handleSaveStoreSettings({ address: storeSettings.address })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Banner Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Banner de Promoções</h2>
            {storeSettings && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={storeSettings.banner_active}
                    onChange={(e) => {
                      const newSettings = { ...storeSettings, banner_active: e.target.checked };
                      setStoreSettings(newSettings);
                      handleSaveStoreSettings({ banner_active: e.target.checked });
                    }}
                    className="w-5 h-5 text-orange-500"
                  />
                  <label className="text-sm font-medium">Banner ativo</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Texto do Banner</label>
                  <input
                    type="text"
                    value={storeSettings.banner_text}
                    onChange={(e) => setStoreSettings(prev => prev ? ({
                      ...prev,
                      banner_text: e.target.value
                    }) : null)}
                    onBlur={() => storeSettings && handleSaveStoreSettings({ banner_text: storeSettings.banner_text })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Products Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Produtos ({products.length})</h2>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Adicionar Produto
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} isAdminMode={true} />
              ))}
            </div>
          </section>
        </div>

        {/* Modals */}
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => setEditingProduct(null)}
          />
        )}
        {isAddingProduct && (
          <ProductForm
            onSave={handleSaveProduct}
            onCancel={() => setIsAddingProduct(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Admin Access Button */}
      <button
        onClick={() => setIsAdmin(true)}
        className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="Acesso Administrativo"
      >
        <Settings size={20} />
      </button>

      {/* Banner */}
      {storeSettings?.banner_active && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 text-center font-semibold">
          {storeSettings.banner_text}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <ShoppingCart className="text-orange-500 mr-3" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">
                {storeSettings?.store_name || 'Ovos da Granja'}
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center text-gray-600">
                <Phone className="mr-2" size={18} />
                <span>{storeSettings?.phone || '(11) 1234-5678'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="mr-2" size={18} />
                <span>{storeSettings?.hours || 'Segunda a Sábado: 7h às 18h'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Ovos Frescos
            <span className="block text-orange-500">Direto da Granja</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Os melhores preços da região! Compramos diretamente da granja e repassamos essa economia para você. 
            Qualidade garantida e frescor incomparável.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" id="produtos">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Nossos Produtos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Egg Classification Table */}
      <EggClassificationTable />

      {/* Location Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6 flex items-center">
                <MapPin className="text-orange-500 mr-3" size={40} />
                Nossa Localização
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Endereço:</h3>
                  <p className="text-gray-600 text-lg">
                    {storeSettings?.address || 'Rua das Galinhas, 123 - Centro - São Paulo/SP'}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Horário de Funcionamento:</h3>
                  <p className="text-gray-600 text-lg">
                    {storeSettings?.hours || 'Segunda a Sábado: 7h às 18h'}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Contato:</h3>
                  <p className="text-gray-600 text-lg">
                    {storeSettings?.phone || '(11) 1234-5678'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 h-96 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="text-orange-500 mx-auto mb-4" size={48} />
                <p className="text-gray-600 text-lg font-semibold">Mapa Interativo</p>
                <p className="text-gray-500 mt-2">
                  Integração com Google Maps<br />
                  pode ser adicionada aqui
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center mb-6">
            <ShoppingCart className="text-orange-500 mr-3" size={32} />
            <h3 className="text-2xl font-bold">
              {storeSettings?.store_name || 'Ovos da Granja'}
            </h3>
          </div>
          <p className="text-gray-300 mb-4">
            Os melhores ovos da região, direto da granja para sua mesa.
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <span>{storeSettings?.phone || '(11) 1234-5678'}</span>
            <span>{storeSettings?.address || 'Rua das Galinhas, 123 - Centro - São Paulo/SP'}</span>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © 2024 {storeSettings?.store_name || 'Ovos da Granja'}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;