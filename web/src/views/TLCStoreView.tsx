import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Share2, 
  Copy, 
  Check, 
  Plus, 
  Search, 
  ExternalLink, 
  QrCode, 
  DollarSign, 
  Award, 
  ShieldCheck, 
  Trash2, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowRight,
  Package,
  Send,
  Unlock
} from 'lucide-react';
import { 
  fetchTLCProducts, 
  createTLCProduct, 
  checkoutTLCStore, 
  TLCProduct, 
  AuthUser 
} from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface TLCStoreViewProps {
  user: AuthUser | null;
  currentTheme?: ColorTheme;
  referralCode?: string;
}

interface CartItem {
  product: TLCProduct;
  quantity: number;
}

export const TLCStoreView: React.FC<TLCStoreViewProps> = ({ 
  user, 
  currentTheme = getSavedTheme(),
  referralCode: initialRefCode
}) => {
  const [products, setProducts] = useState<TLCProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Carrito de compras
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<any | null>(null);

  // Enlace compartido
  const [copiedLink, setCopiedLink] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Superadministrador: Modal Agregar Producto
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    sku: '',
    category: 'DETOX',
    description: '',
    priceUsd: 59.95,
    pvPoints: 40,
    commissionUsd: 20.00,
    imageUrl: '',
    inStock: 100,
  });

  // Datos del cliente para checkout
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'WHATSAPP' as 'WHATSAPP' | 'CARD'
  });

  // Determinar código y asesor de referido
  const currentAffiliateName = user?.role === 'AFFILIATE' 
    ? `${user.firstName} ${user.lastName}`
    : (initialRefCode ? initialRefCode.replace(/-/g, ' ').toUpperCase() : 'Elena Morales (Director Nacional)');

  const affiliateSlug = (user?.firstName && user?.lastName)
    ? `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`
    : (initialRefCode || 'elena-morales');

  const storeShareUrl = `${window.location.origin}/?view=tlc_store&ref=${affiliateSlug}`;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await fetchTLCProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(storeShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddToCart = (product: TLCProduct) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role !== 'SUPERADMIN') {
      alert('Solo el Superadministrador tiene permisos para crear productos en la tienda.');
      return;
    }

    const res = await createTLCProduct(newProductForm);
    if (res.data) {
      setProducts([res.data, ...products]);
      setIsAddProductModalOpen(false);
      setNewProductForm({
        name: '',
        sku: '',
        category: 'DETOX',
        description: '',
        priceUsd: 59.95,
        pvPoints: 40,
        commissionUsd: 20.00,
        imageUrl: '',
        inStock: 100,
      });
    }
  };

  const cartTotalUsd = cart.reduce((acc, item) => acc + item.product.priceUsd * item.quantity, 0);
  const cartTotalPv = cart.reduce((acc, item) => acc + item.product.pvPoints * item.quantity, 0);
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderData = {
      refAffiliateId: user?.id || 'aff-elena-morales',
      affiliateName: currentAffiliateName,
      customerName: customerForm.name || 'Cliente Tienda TLC',
      customerPhone: customerForm.phone,
      customerEmail: customerForm.email,
      deliveryAddress: customerForm.address,
      items: cart.map((i) => ({
        quantity: i.quantity,
        unitPrice: i.product.priceUsd,
        productId: i.product.id,
        productName: i.product.name,
      })),
      totalUsd: cartTotalUsd,
      totalPv: cartTotalPv,
    };

    const res = await checkoutTLCStore(orderData);
    setCheckoutSuccess(res.data || orderData);
    setCart([]);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const isSuperAdmin = user?.role === 'SUPERADMIN';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER ESTILO NEXO: VIBRANTE + WIDGET FLOTANTE + TLC-SHOP */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        background: currentTheme.bannerGradient,
        borderRadius: '18px',
        padding: '2.5rem 3rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: `0 14px 40px ${currentTheme.primaryGlow}`,
      }}>
        {/* Patrón geométrico diagonal */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.22,
          backgroundImage: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(225deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(315deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(45deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%)
          `,
          backgroundSize: '90px 90px',
          backgroundPosition: '0 0, 45px 0, 45px -45px, 0px 45px',
          pointerEvents: 'none',
        }} />

        {/* Marca de agua gigante */}
        <div style={{
          position: 'absolute',
          right: '340px',
          bottom: '-30px',
          fontSize: '7.5rem',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.12)',
          letterSpacing: '-0.05em',
          userSelect: 'none',
          pointerEvents: 'none',
          fontStyle: 'italic',
        }}>
          TLC-SHOP
        </div>

        {/* Texto de la Izquierda */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{
              background: '#000000',
              color: currentTheme.primary,
              fontWeight: 900,
              fontSize: '0.72rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              % TIENDA EN LÍNEA TOTAL LIFE CHANGES
            </span>
            <span style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.82rem', fontWeight: 700 }}>
              E-Commerce Oficial & Enlace Compartible
            </span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#070a12',
            margin: '0.2rem 0',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
          }}>
            TIENDA EN LÍNEA <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>TLC HUB</span>
          </h1>

          <p style={{
            color: 'rgba(7, 10, 18, 0.85)',
            fontSize: '0.92rem',
            fontWeight: 600,
            margin: '0.4rem 0 0 0',
            lineHeight: 1.4,
          }}>
            Compra o comparte los kits originales de Iaso Tea, Gotas Resolution y suplementos détox. Cada venta mediante tu enlace otorga el <strong>50% de comisión ($20 USD)</strong> al asesor.
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {/* Solo Superadministrador puede agregar productos */}
            {isSuperAdmin && (
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#070a12',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Plus size={16} color={currentTheme.primary} />
                <span>+ Agregar Producto (Solo Superadmin)</span>
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#070a12',
                border: 'none',
                padding: '0.55rem 1.15rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ShoppingBag size={16} color="#059669" />
              <span>Ver Carrito ({cartTotalCount} items)</span>
            </button>
          </div>
        </div>

        {/* Status Card Flotante de la Derecha (Estilo Nexo) */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(7, 10, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          color: '#ffffff',
          minWidth: '290px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentTheme.primary, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} /> Tienda Verificada TLC
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              color: '#94a3b8',
            }}>
              100% Original
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Asesor Asignado
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
              {currentAffiliateName}
            </span>
          </div>

          {/* Barra de progreso Neón */}
          <div style={{
            height: '7px',
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '0.85rem',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: currentTheme.primary,
              boxShadow: `0 0 10px ${currentTheme.primary}`,
              borderRadius: '999px',
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Kits en Catálogo
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: currentTheme.primary, marginTop: '2px' }}>
                {products.length} Productos
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Bono Minorista
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                50% ($20 / kit)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BANNER DE COMPARTIR ENLACE DE LA TIENDA EN LÍNEA */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.25rem 1.75rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: currentTheme.primary,
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 14px ${currentTheme.primaryGlow}`,
            flexShrink: 0,
          }}>
            <Share2 size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Enlace Compartible de tu Tienda en Línea
              </h3>
              <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                50% Comisión Activa
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Envía este link por WhatsApp o redes. Tus clientes verán la tienda con tu perfil y las comisiones se asignarán a tu cuenta.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Input con el link listo */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '999px',
            padding: '0.35rem 0.85rem',
            fontSize: '0.78rem',
            color: '#0f172a',
            fontWeight: 600,
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {storeShareUrl}
          </div>

          {/* Botón Copiar */}
          <button
            onClick={handleCopyShareLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: copiedLink ? '#059669' : currentTheme.primary,
              color: copiedLink ? '#ffffff' : '#000000',
              border: 'none',
              borderRadius: '999px',
              padding: '0.45rem 0.95rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: `0 3px 12px ${currentTheme.primaryGlow}`,
              transition: 'all 0.15s ease',
            }}
          >
            {copiedLink ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Link'}</span>
          </button>

          {/* Botón WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Hola! Te comparto mi tienda oficial Total Life Changes para que conozcas los kits originales de Iaso Tea y Détox: ${storeShareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#25D366',
              color: '#ffffff',
              border: 'none',
              borderRadius: '999px',
              padding: '0.45rem 0.95rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 3px 12px rgba(37, 211, 102, 0.3)',
            }}
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </a>

          {/* Botón QR */}
          <button
            onClick={() => setIsQrModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '999px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <QrCode size={14} />
            <span>Ver QR</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FILTROS DE PRODUCTO Y BUSCADOR */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'Todos los Kits' },
            { id: 'DETOX', label: 'Détox (Iaso Tea)' },
            { id: 'WEIGHT_LOSS', label: 'Pérdida de Peso (Resolution)' },
            { id: 'ENERGY', label: 'Energía (NRG)' },
            { id: 'NUTRITION', label: 'Nutrición (NutraBurst)' },
            { id: 'KIT', label: 'Kits Estrella' },
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                style={{
                  padding: '0.42rem 0.9rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: isActive ? currentTheme.primary : '#f8fafc',
                  color: isActive ? '#000000' : '#64748b',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? `0 3px 12px ${currentTheme.primaryGlow}` : 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '999px',
          padding: '0.4rem 0.85rem',
          fontSize: '0.8rem',
        }}>
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Buscar suplemento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.8rem',
              color: '#0f172a',
              width: '180px',
            }}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* GRID DE PRODUCTOS DE LA TIENDA */}
      {/* ------------------------------------------------------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {filteredProducts.map((prod) => (
          <div key={prod.id} style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
          }}
          >
            {/* Imagen del Producto */}
            <div style={{ height: '190px', position: 'relative', overflow: 'hidden', background: '#070a12' }}>
              <img
                src={prod.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'}
                alt={prod.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: currentTheme.primary,
                color: '#000000',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.72rem',
                boxShadow: `0 2px 8px ${currentTheme.primaryGlow}`,
              }}>
                {prod.pvPoints} PV
              </span>
              <span style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.68rem',
              }}>
                SKU: {prod.sku}
              </span>
            </div>

            {/* Detalles */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                {prod.name}
              </h3>

              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4, flex: 1 }}>
                {prod.description}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '0.65rem 0',
                borderTop: '1px solid #f1f5f9',
                marginTop: 'auto',
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>PRECIO AL PÚBLICO</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>${prod.priceUsd} USD</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>COMISIÓN 50%</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669' }}>+${prod.commissionUsd || 20} USD</div>
                </div>
              </div>

              {/* Botón Agregar al Carrito */}
              <button
                onClick={() => handleAddToCart(prod)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  background: currentTheme.primary,
                  color: '#000000',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.65rem',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: `0 3px 12px ${currentTheme.primaryGlow}`,
                  transition: 'transform 0.15s ease',
                }}
              >
                <ShoppingBag size={15} />
                <span>Agregar al Carrito</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DRAWER / MODAL DEL CARRITO DE COMPRAS */}
      {/* ------------------------------------------------------------- */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 16, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '460px',
            height: '100%',
            overflowY: 'auto',
            padding: '1.75rem',
            boxShadow: '-10px 0 35px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            {/* Header del Carrito */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={22} color={currentTheme.primary} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Carrito de Compras ({cartTotalCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            {/* Aviso de Asesor Asignado */}
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '0.65rem 0.85rem',
              borderRadius: '12px',
              fontSize: '0.78rem',
              color: '#065f46',
            }}>
              Tu asesor de bienestar: <strong>{currentAffiliateName}</strong>. Comisión del 50% ($20/kit) y {cartTotalPv} PV asignados automáticamente.
            </div>

            {/* Lista de Productos en el Carrito */}
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                <ShoppingBag size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.35 }} />
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Tu carrito está vacío</div>
                <p style={{ fontSize: '0.8rem', margin: '0.35rem 0 0 0' }}>Agrega productos desde el catálogo para continuar con tu pedido.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {cart.map((item) => (
                  <div key={item.product.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                  }}>
                    <img
                      src={item.product.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100'}
                      alt={item.product.name}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                        ${item.product.priceUsd} USD • {item.product.pvPoints} PV
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, -1)}
                        style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 800 }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, minWidth: '18px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, 1)}
                        style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 800 }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Resumen y Checkout */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>Total Estimado:</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a' }}>${cartTotalUsd.toFixed(2)} USD</div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>Puntos de Red: {cartTotalPv} PV</div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Nombre del Comprador:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: Diana Marcela Gómez"
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Teléfono / WhatsApp de Contacto:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+57 300 123 4567"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Dirección de Entrega:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ciudad, Calle, Edificio / Apto"
                    value={customerForm.address}
                    onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: currentTheme.primary,
                    color: '#000000',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: `0 4px 16px ${currentTheme.primaryGlow}`,
                  }}
                >
                  <Send size={18} />
                  <span>Confirmar Pedido (${cartTotalUsd.toFixed(2)} USD)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL ÉXITO DE COMPRA */}
      {checkoutSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 16, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              ¡Orden Procesada Exitosamente!
            </h3>

            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Orden <strong>#{checkoutSuccess.id}</strong>. La venta ha sido vinculada al asesor <strong>{currentAffiliateName}</strong> con <strong>${Math.round((checkoutSuccess.totalPv / 40) * 20)} USD de comisión</strong>.
            </p>

            <button
              onClick={() => {
                setCheckoutSuccess(null);
                setIsCartOpen(false);
              }}
              style={{
                background: currentTheme.primary,
                color: '#000000',
                border: 'none',
                borderRadius: '999px',
                padding: '0.75rem',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      )}

      {/* MODAL: SUPERADMIN - AGREGAR NUEVO PRODUCTO A LA TIENDA */}
      {isAddProductModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 16, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '560px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={22} color={currentTheme.primary} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Agregar Producto a la Tienda TLC
                </h3>
              </div>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>
              🛡️ Permiso Exclusivo de Superadministrador: Este producto se publicará en el catálogo global de la tienda en línea.
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Nombre del Producto / Kit
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Kit Reto Détox 15 Días Plus"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Código SKU
                  </label>
                  <input
                    type="text"
                    placeholder="TLC-KIT-01"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Categoría
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="DETOX">Détox (Iaso Tea)</option>
                    <option value="WEIGHT_LOSS">Pérdida de Peso (Resolution)</option>
                    <option value="ENERGY">Energía (NRG)</option>
                    <option value="NUTRITION">Nutrición (NutraBurst)</option>
                    <option value="KIT">Kit Completo</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Precio USD ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProductForm.priceUsd}
                    onChange={(e) => setNewProductForm({ ...newProductForm, priceUsd: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Puntos PV
                  </label>
                  <input
                    type="number"
                    value={newProductForm.pvPoints}
                    onChange={(e) => setNewProductForm({ ...newProductForm, pvPoints: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Comisión USD
                  </label>
                  <input
                    type="number"
                    value={newProductForm.commissionUsd}
                    onChange={(e) => setNewProductForm({ ...newProductForm, commissionUsd: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  URL de Imagen del Producto
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProductForm.imageUrl}
                  onChange={(e) => setNewProductForm({ ...newProductForm, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Descripción & Beneficios del Kit
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe los beneficios principales del suplemento..."
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: currentTheme.primary,
                    color: '#000000',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: `0 3px 12px ${currentTheme.primaryGlow}`,
                  }}
                >
                  Publicar en Tienda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CÓDIGO QR DE LA TIENDA */}
      {isQrModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 16, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '420px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Código QR de tu Tienda
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: '#070a12',
              padding: '1.5rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${currentTheme.primary}`,
              boxShadow: `0 8px 30px ${currentTheme.primaryGlow}`,
            }}>
              <QrCode size={180} color={currentTheme.primary} />
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Escanea para abrir la tienda en línea de <strong>{currentAffiliateName}</strong>.
            </div>

            <button
              onClick={handleCopyShareLink}
              style={{
                width: '100%',
                background: currentTheme.primary,
                color: '#000000',
                border: 'none',
                borderRadius: '10px',
                padding: '0.65rem',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              {copiedLink ? '¡Enlace Copiado!' : 'Copiar URL Directa'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TLCStoreView;
