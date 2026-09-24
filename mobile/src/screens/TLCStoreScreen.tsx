import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  TextInput, 
  Modal,
  Alert,
  Share,
  Linking
} from 'react-native';
import { 
  ShoppingBag, 
  Share2, 
  Copy, 
  Check, 
  Plus, 
  Search, 
  QrCode, 
  DollarSign, 
  Award, 
  Sparkles, 
  Trash2, 
  MessageCircle, 
  X, 
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react-native';
import { useTheme } from '../styles/themeConfig';
import { MobileUser } from '../components/MobileHeader';

export interface MobileTLCProduct {
  id: string;
  name: string;
  sku: string;
  category: 'DETOX' | 'WEIGHT_LOSS' | 'ENERGY' | 'KITS';
  priceUsd: number;
  pvPoints: number;
  commissionUsd: number;
  imageUrl: string;
  description: string;
}

const INITIAL_PRODUCTS: MobileTLCProduct[] = [
  {
    id: 'prod-1',
    name: 'Iaso Tea Instantáneo con CBD',
    sku: 'TLC-TEA-CBD',
    category: 'DETOX',
    priceUsd: 59.95,
    pvPoints: 40,
    commissionUsd: 20.00,
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop',
    description: 'Fórmula original limpiadora digestiva con infusión de CBD para desintoxicación celular y calma.',
  },
  {
    id: 'prod-2',
    name: 'Gotas Resolution Drops',
    sku: 'TLC-RES-01',
    category: 'WEIGHT_LOSS',
    priceUsd: 59.95,
    pvPoints: 40,
    commissionUsd: 20.00,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop',
    description: 'Gotas sublinguales diseñadas para reducir los antojos de azúcar y acelerar la quema de grasa.',
  },
  {
    id: 'prod-3',
    name: 'NutraBurst Multivitamínico Líquido',
    sku: 'TLC-NB-01',
    category: 'ENERGY',
    priceUsd: 54.95,
    pvPoints: 40,
    commissionUsd: 20.00,
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop',
    description: '72 minerales, 12 hierbas y 22 fitonutrientes con una tasa de absorción celular de hasta el 98%.',
  },
  {
    id: 'prod-4',
    name: 'Kit Transformación Total 30 Días',
    sku: 'TLC-KIT-30',
    category: 'KITS',
    priceUsd: 149.90,
    pvPoints: 100,
    commissionUsd: 50.00,
    imageUrl: 'https://images.unsplash.com/photo-1616671285442-fbf78e727e16?w=500&auto=format&fit=crop',
    description: 'Trilogía completa: Iaso Tea + Resolution Drops + NutraBurst para cambios drásticos en 30 días.',
  },
];

interface CartItem {
  product: MobileTLCProduct;
  quantity: number;
}

interface TLCStoreScreenProps {
  currentUser: MobileUser;
}

export const TLCStoreScreen: React.FC<TLCStoreScreenProps> = ({ currentUser }) => {
  const { colorTheme, envTheme } = useTheme();

  const [products, setProducts] = useState<MobileTLCProduct[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Carrito de compras
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<any | null>(null);

  // Modal para Superadmin Agregar Producto
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    sku: '',
    category: 'DETOX' as 'DETOX' | 'WEIGHT_LOSS' | 'ENERGY' | 'KITS',
    priceUsd: '59.95',
    pvPoints: '40',
    commissionUsd: '20.00',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop',
  });

  // Formulario cliente para checkout
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Código de afiliado para el enlace
  const affiliateRef = currentUser.affiliateCode || 'elena-morales';
  const shareableUrl = `https://gymfit.app/tlc?ref=${affiliateRef}`;

  const isSuperAdmin = currentUser.role === 'SUPERADMIN';

  // 1-Touch Copiar Enlace
  const handleCopyLink = () => {
    Alert.alert('¡Enlace Copiado!', `El enlace de tu tienda TLC personalizada ha sido copiado:\n\n${shareableUrl}\n\nLas compras realizadas desde este link te sumarán 50% de comisión.`);
  };

  // 1-Touch Compartir por WhatsApp
  const handleShareWhatsApp = () => {
    const message = `👋 ¡Hola! Te invito a visitar mi Tienda Oficial TLC con los mejores productos de Détox, Pérdida de Peso y Energía. Pide directo aquí: ${shareableUrl}`;
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(whatsappUrl);
        } else {
          Share.share({ message });
        }
      })
      .catch(() => Share.share({ message }));
  };

  // Carrito
  const handleAddToCart = (product: MobileTLCProduct) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);
      if (exists) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const cartTotalUsd = cart.reduce((acc, i) => acc + i.product.priceUsd * i.quantity, 0);
  const cartTotalPv = cart.reduce((acc, i) => acc + i.product.pvPoints * i.quantity, 0);
  const cartItemsCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  // Crear Producto (Solo Superadmin)
  const handleCreateProduct = () => {
    if (!isSuperAdmin) {
      Alert.alert('Acceso Denegado', 'Solo el Superadministrador puede registrar productos.');
      return;
    }
    if (!newProductForm.name || !newProductForm.sku) {
      Alert.alert('Campos Incompletos', 'Ingresa el nombre y SKU del producto.');
      return;
    }

    const created: MobileTLCProduct = {
      id: `prod-${Date.now()}`,
      name: newProductForm.name,
      sku: newProductForm.sku,
      category: newProductForm.category,
      priceUsd: parseFloat(newProductForm.priceUsd) || 59.95,
      pvPoints: parseInt(newProductForm.pvPoints, 10) || 40,
      commissionUsd: parseFloat(newProductForm.commissionUsd) || 20.00,
      imageUrl: newProductForm.imageUrl || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop',
      description: newProductForm.description || 'Producto oficial Total Life Changes.',
    };

    setProducts([created, ...products]);
    setIsAddModalOpen(false);
    Alert.alert('¡Producto Publicado!', `"${created.name}" ya está visible en la Tienda TLC y disponible para todos los afiliados.`);
  };

  // Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!customerName || !customerPhone) {
      Alert.alert('Faltan datos', 'Por favor ingresa el nombre y teléfono del cliente.');
      return;
    }

    const orderData = {
      orderId: `TLC-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      customerPhone,
      customerAddress,
      totalUsd: cartTotalUsd,
      totalPv: cartTotalPv,
      affiliateAttributed: currentUser.name,
      commissionEarned: (cartTotalPv / 40) * 20, // 50% bonus
    };

    setCheckoutSuccess(orderData);
    setCart([]);
    setIsCartOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: envTheme.canvasBg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HERO BANNER ESTILO NEXO VIBRANTE */}
        <View style={[styles.heroBanner, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
          <Text style={[styles.watermark, { color: colorTheme.primaryGlow }]}>TLC-SHOP</Text>

          <View style={styles.heroHeaderRow}>
            <View style={[styles.verifiedBadge, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
              <ShieldCheck size={12} color={colorTheme.primary} />
              <Text style={[styles.verifiedBadgeText, { color: colorTheme.primary }]}>TIENDA OFICIAL TLC</Text>
            </View>
            <View style={styles.commissionBadge}>
              <DollarSign size={12} color="#f59e0b" />
              <Text style={styles.commissionBadgeText}>50% COMISIÓN</Text>
            </View>
          </View>

          <Text style={[styles.heroTitle, { color: envTheme.textMain }]}>
            Tienda en Línea <Text style={{ color: colorTheme.primary }}>TLC Global</Text>
          </Text>
          <Text style={[styles.heroSubtitle, { color: envTheme.textMuted }]}>
            Distribución inteligente de kits détox. Cada venta minorista genera{' '}
            <Text style={{ color: colorTheme.primary, fontWeight: '800' }}>$20.00 USD (40 PV)</Text> directos.
          </Text>

          {/* BARRA DE ENLACE COMPARTIBLE DE AFILIADO */}
          <View style={[styles.shareBar, { backgroundColor: 'rgba(0,0,0,0.4)', borderColor: colorTheme.primary }]}>
            <View style={styles.shareInfo}>
              <Text style={styles.shareLabel}>Tu Enlace Personalizado:</Text>
              <Text style={[styles.shareUrl, { color: colorTheme.gradientText }]} numberOfLines={1}>
                {shareableUrl}
              </Text>
            </View>

            <View style={styles.shareButtonsRow}>
              <TouchableOpacity
                style={[styles.copyBtn, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}
                onPress={handleCopyLink}
              >
                <Copy size={14} color={colorTheme.primary} />
                <Text style={[styles.copyBtnText, { color: colorTheme.primary }]}>Copiar Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.whatsappBtn, { backgroundColor: '#25D366' }]}
                onPress={handleShareWhatsApp}
              >
                <MessageCircle size={14} color="#000000" />
                <Text style={styles.whatsappBtnText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BOTÓN EXCLUSIVO SUPERADMIN: AGREGAR PRODUCTO */}
          {isSuperAdmin && (
            <TouchableOpacity
              style={[styles.superAdminAddBtn, { backgroundColor: colorTheme.primary }]}
              onPress={() => setIsAddModalOpen(true)}
            >
              <Plus size={16} color="#000000" />
              <Text style={styles.superAdminAddText}>+ AGREGAR PRODUCTO (SOLO SUPERADMIN)</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* BUSCADOR & FILTROS POR CATEGORÍA */}
        <View style={styles.filterSection}>
          <View style={[styles.searchBox, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
            <Search size={16} color={envTheme.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: envTheme.textMain }]}
              placeholder="Buscar té détox, gotas, suplementos..."
              placeholderTextColor={envTheme.textDark}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'DETOX', label: 'Détox Limpieza' },
              { id: 'WEIGHT_LOSS', label: 'Pérdida de Peso' },
              { id: 'ENERGY', label: 'Energía & Vitaminas' },
              { id: 'KITS', label: 'Kits 30 Días' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: isSelected ? colorTheme.primary : envTheme.cardBg,
                      borderColor: isSelected ? colorTheme.primary : envTheme.border,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text style={[styles.catChipText, { color: isSelected ? '#000000' : envTheme.textMuted }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* CATÁLOGO DE PRODUCTOS */}
        <View style={styles.productsGrid}>
          {filteredProducts.map((p) => (
            <View
              key={p.id}
              style={[
                styles.productCard,
                { backgroundColor: envTheme.cardBg, borderColor: envTheme.border },
              ]}
            >
              <Image source={{ uri: p.imageUrl }} style={styles.productImage} />

              <View style={styles.productBadgeRow}>
                <View style={[styles.pvBadge, { backgroundColor: colorTheme.accentBg }]}>
                  <Award size={10} color={colorTheme.primary} />
                  <Text style={[styles.pvBadgeText, { color: colorTheme.primary }]}>{p.pvPoints} PV</Text>
                </View>
                <View style={styles.profitBadge}>
                  <Text style={styles.profitBadgeText}>+${p.commissionUsd.toFixed(2)} USD COM</Text>
                </View>
              </View>

              <Text style={[styles.productName, { color: envTheme.textMain }]} numberOfLines={2}>
                {p.name}
              </Text>
              <Text style={[styles.productDesc, { color: envTheme.textMuted }]} numberOfLines={2}>
                {p.description}
              </Text>

              <View style={styles.productFooter}>
                <View>
                  <Text style={styles.priceLabel}>Precio Público</Text>
                  <Text style={[styles.priceValue, { color: envTheme.textMain }]}>${p.priceUsd.toFixed(2)} USD</Text>
                </View>

                <TouchableOpacity
                  style={[styles.addCartBtn, { backgroundColor: colorTheme.primary }]}
                  onPress={() => handleAddToCart(p)}
                >
                  <ShoppingBag size={14} color="#000000" />
                  <Text style={styles.addCartBtnText}>Comprar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* BOTÓN FLOTANTE DEL CARRITO */}
      {cartItemsCount > 0 && (
        <TouchableOpacity
          style={[styles.floatingCartBtn, { backgroundColor: colorTheme.primary }]}
          onPress={() => setIsCartOpen(true)}
        >
          <View style={styles.cartBadgeCircle}>
            <Text style={styles.cartBadgeNum}>{cartItemsCount}</Text>
          </View>
          <Text style={styles.floatingCartText}>Ver Carrito • ${cartTotalUsd.toFixed(2)} USD</Text>
          <ArrowRight size={18} color="#000000" />
        </TouchableOpacity>
      )}

      {/* MODAL DESLIZABLE DEL CARRITO Y CHECKOUT */}
      <Modal visible={isCartOpen} transparent animationType="slide" onRequestClose={() => setIsCartOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.cartSheet, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
            <View style={styles.sheetHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ShoppingBag size={20} color={colorTheme.primary} />
                <Text style={[styles.sheetTitle, { color: envTheme.textMain }]}>Carrito de Compras</Text>
              </View>
              <TouchableOpacity onPress={() => setIsCartOpen(false)}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
              {cart.map((item) => (
                <View key={item.product.id} style={[styles.cartItemRow, { borderColor: envTheme.border }]}>
                  <Image source={{ uri: item.product.imageUrl }} style={styles.cartItemImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cartItemTitle, { color: envTheme.textMain }]} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text style={{ fontSize: 11, color: colorTheme.primary }}>
                      ${item.product.priceUsd.toFixed(2)} USD • {item.product.pvPoints} PV
                    </Text>
                  </View>

                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => handleUpdateQty(item.product.id, -1)}
                    >
                      <Text style={{ color: '#fff', fontWeight: '800' }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', fontWeight: '700', paddingHorizontal: 6 }}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => handleUpdateQty(item.product.id, 1)}
                    >
                      <Text style={{ color: '#fff', fontWeight: '800' }}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {/* Formulario Cliente */}
              <View style={styles.checkoutForm}>
                <Text style={[styles.formHeader, { color: colorTheme.primary }]}>Datos de Entrega y Contacto</Text>
                <TextInput
                  style={[styles.formInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                  placeholder="Nombre Completo del Cliente"
                  placeholderTextColor="#64748b"
                  value={customerName}
                  onChangeText={setCustomerName}
                />
                <TextInput
                  style={[styles.formInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                  placeholder="Número de WhatsApp (+57 / +1...)"
                  placeholderTextColor="#64748b"
                  keyboardType="phone-pad"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                />
                <TextInput
                  style={[styles.formInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                  placeholder="Dirección de Envío y Ciudad"
                  placeholderTextColor="#64748b"
                  value={customerAddress}
                  onChangeText={setCustomerAddress}
                />

                <View style={[styles.summaryBox, { backgroundColor: 'rgba(0,0,0,0.3)', borderColor: envTheme.border }]}>
                  <View style={styles.summaryRow}>
                    <Text style={{ color: envTheme.textMuted }}>Total Puntos PV:</Text>
                    <Text style={{ color: colorTheme.primary, fontWeight: '700' }}>{cartTotalPv} PV</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={{ color: envTheme.textMuted }}>Asesor / Referido:</Text>
                    <Text style={{ color: '#38bdf8', fontWeight: '700' }}>{currentUser.name}</Text>
                  </View>
                  <View style={[styles.summaryRow, { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }]}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>Total a Pagar:</Text>
                    <Text style={{ color: colorTheme.primary, fontSize: 18, fontWeight: '900' }}>
                      ${cartTotalUsd.toFixed(2)} USD
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.confirmCheckoutBtn, { backgroundColor: colorTheme.primary }]}
                  onPress={handleCheckout}
                >
                  <Text style={styles.confirmCheckoutText}>Confirmar Pedido y Procesar Comisión</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL AGREGAR PRODUCTO (SOLO SUPERADMINISTRADOR) */}
      <Modal visible={isAddModalOpen} transparent animationType="slide" onRequestClose={() => setIsAddModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.cartSheet, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
            <View style={styles.sheetHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={20} color={colorTheme.primary} />
                <Text style={[styles.sheetTitle, { color: envTheme.textMain }]}>Nuevo Producto TLC</Text>
              </View>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
              <Text style={{ color: envTheme.textMuted, fontSize: 12, marginBottom: 12 }}>
                Como <Text style={{ color: colorTheme.primary, fontWeight: '800' }}>Superadministrador</Text>, el producto creado quedará disponible inmediatamente para toda la red de afiliados.
              </Text>

              <Text style={styles.inputLabel}>Nombre del Producto</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                placeholder="Ej. TLC Chaga Cápsulas Puras"
                placeholderTextColor="#64748b"
                value={newProductForm.name}
                onChangeText={(v) => setNewProductForm({ ...newProductForm, name: v })}
              />

              <Text style={styles.inputLabel}>SKU / Código Único</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                placeholder="Ej. TLC-CHAGA-01"
                placeholderTextColor="#64748b"
                value={newProductForm.sku}
                onChangeText={(v) => setNewProductForm({ ...newProductForm, sku: v })}
              />

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Precio (USD)</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                    keyboardType="numeric"
                    value={newProductForm.priceUsd}
                    onChangeText={(v) => setNewProductForm({ ...newProductForm, priceUsd: v })}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Puntos PV</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                    keyboardType="numeric"
                    value={newProductForm.pvPoints}
                    onChangeText={(v) => setNewProductForm({ ...newProductForm, pvPoints: v })}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Comisión (USD)</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                    keyboardType="numeric"
                    value={newProductForm.commissionUsd}
                    onChangeText={(v) => setNewProductForm({ ...newProductForm, commissionUsd: v })}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Descripción Comercial</Text>
              <TextInput
                style={[styles.formInput, { height: 70, backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                multiline
                placeholder="Beneficios, modo de uso y propiedades del producto..."
                placeholderTextColor="#64748b"
                value={newProductForm.description}
                onChangeText={(v) => setNewProductForm({ ...newProductForm, description: v })}
              />

              <TouchableOpacity
                style={[styles.confirmCheckoutBtn, { backgroundColor: colorTheme.primary, marginTop: 14 }]}
                onPress={handleCreateProduct}
              >
                <Text style={styles.confirmCheckoutText}>Publicar en Tienda Global</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL DE ÉXITO DE COMPRA & COMISIÓN ATRIBUIDA */}
      <Modal visible={!!checkoutSuccess} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.successCard, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
            <View style={[styles.successIconCircle, { backgroundColor: colorTheme.accentBg }]}>
              <Check size={36} color={colorTheme.primary} />
            </View>
            <Text style={[styles.successTitle, { color: envTheme.textMain }]}>¡Pedido Registrado con Éxito!</Text>
            <Text style={[styles.successSubtitle, { color: envTheme.textMuted }]}>
              Orden: <Text style={{ color: '#fff', fontWeight: '800' }}>{checkoutSuccess?.orderId}</Text>
            </Text>

            <View style={[styles.successDetails, { backgroundColor: 'rgba(0,0,0,0.4)', borderColor: envTheme.border }]}>
              <Text style={{ color: envTheme.textMuted, fontSize: 12 }}>
                Cliente: <Text style={{ color: '#fff', fontWeight: '700' }}>{checkoutSuccess?.customerName}</Text>
              </Text>
              <Text style={{ color: envTheme.textMuted, fontSize: 12, marginTop: 4 }}>
                Asesor Atribuido: <Text style={{ color: '#38bdf8', fontWeight: '700' }}>{checkoutSuccess?.affiliateAttributed}</Text>
              </Text>
              <View style={[styles.successCommissionBox, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
                <Text style={[styles.successCommissionText, { color: colorTheme.primary }]}>
                  +$ {checkoutSuccess?.commissionEarned?.toFixed(2)} USD Acreditados al Afiliado (50%)
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.closeSuccessBtn, { backgroundColor: colorTheme.primary }]}
              onPress={() => setCheckoutSuccess(null)}
            >
              <Text style={styles.closeSuccessBtnText}>Entendido • Volver a la Tienda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  heroBanner: {
    position: 'relative',
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    top: 6,
    right: 8,
    fontSize: 38,
    fontWeight: '900',
    opacity: 0.12,
    letterSpacing: -1,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  commissionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  commissionBadgeText: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  shareBar: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
    marginBottom: 10,
  },
  shareInfo: {
    gap: 2,
  },
  shareLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  shareUrl: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  shareButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  copyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 8,
  },
  whatsappBtnText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '800',
  },
  superAdminAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  superAdminAddText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  filterSection: {
    marginBottom: 16,
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  categoryScroll: {
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  productsGrid: {
    gap: 14,
  },
  productCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: '#1e293b',
  },
  productBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  pvBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pvBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  profitBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  profitBadgeText: {
    color: '#f59e0b',
    fontSize: 9,
    fontWeight: '800',
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 19,
  },
  productDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  priceLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addCartBtnText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '800',
  },
  floatingCartBtn: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cartBadgeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeNum: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  floatingCartText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  cartSheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 2,
    maxHeight: '85%',
    padding: 18,
    paddingBottom: 30,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cartList: {
    marginBottom: 10,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  cartItemImg: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  cartItemTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    padding: 2,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutForm: {
    marginTop: 16,
    gap: 10,
  },
  formHeader: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12,
  },
  inputLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 2,
  },
  summaryBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 4,
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmCheckoutBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  confirmCheckoutText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },
  successCard: {
    margin: 20,
    borderRadius: 22,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  successDetails: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 2,
  },
  successCommissionBox: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  successCommissionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  closeSuccessBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeSuccessBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },
});
