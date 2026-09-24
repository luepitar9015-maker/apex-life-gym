import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { 
  Palette, 
  Dumbbell, 
  Leaf, 
  ChevronDown, 
  ShieldCheck, 
  User, 
  Check,
  Sparkles
} from 'lucide-react-native';
import { useTheme } from '../styles/themeConfig';

export type UserRole = 'SUPERADMIN' | 'BUSINESS_ADMIN' | 'AFFILIATE' | 'TRAINER' | 'MEMBER';

export interface MobileUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  affiliateCode?: string;
}

interface MobileHeaderProps {
  activeSystem: 'gym' | 'tlc';
  onSwitchSystem: (sys: 'gym' | 'tlc') => void;
  currentUser: MobileUser;
  onSwitchUser: (user: MobileUser) => void;
  onOpenPaletteModal: () => void;
}

export const DEMO_USERS: MobileUser[] = [
  {
    id: 'usr-super',
    name: 'Carlos Superadmin',
    email: 'superadmin@gymfit.com',
    role: 'SUPERADMIN',
    roleLabel: 'Superadministrador Global',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
    affiliateCode: 'carlos-super',
  },
  {
    id: 'usr-admin-gym',
    name: 'Roberto Mendoza',
    email: 'admin@powergym.com',
    role: 'BUSINESS_ADMIN',
    roleLabel: 'Administrador Gimnasio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
    affiliateCode: 'roberto-gym',
  },
  {
    id: 'usr-aff-tlc',
    name: 'Elena Morales',
    email: 'elena.tlc@totallifechanges.com',
    role: 'AFFILIATE',
    roleLabel: 'Afiliada TLC (Dir. Nacional)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop',
    affiliateCode: 'elena-morales',
  },
  {
    id: 'usr-coach',
    name: 'Marcos Valenzuela',
    email: 'marcos.coach@gymfit.com',
    role: 'TRAINER',
    roleLabel: 'Entrenador Personal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
    affiliateCode: 'marcos-coach',
  },
  {
    id: 'usr-member',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    role: 'MEMBER',
    roleLabel: 'Socio / Atleta VIP',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
    affiliateCode: 'juan-perez',
  },
];

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeSystem,
  onSwitchSystem,
  currentUser,
  onSwitchUser,
  onOpenPaletteModal,
}) => {
  const { colorTheme, envTheme } = useTheme();
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  return (
    <View style={[styles.headerContainer, { backgroundColor: envTheme.cardBg, borderBottomColor: envTheme.border }]}>
      {/* Fila Superior: Marca y Botón de Tableta de Colores */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <Text style={[styles.brandText, { color: envTheme.textMain }]}>
            {activeSystem === 'gym' ? (
              <>
                GY<Text style={{ color: colorTheme.primary }}>M</Text> FIT
              </>
            ) : (
              <>
                TL<Text style={{ color: colorTheme.primary }}>C</Text> HUB
              </>
            )}
          </Text>
          <View style={[styles.systemPill, { backgroundColor: colorTheme.accentBg }]}>
            <Text style={[styles.systemPillText, { color: colorTheme.primary }]}>
              {activeSystem === 'gym' ? 'PRO' : 'GLOBAL'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {/* Botón Switcher Sistema Dual: GYM vs TLC */}
          <TouchableOpacity
            style={[
              styles.systemToggleBtn,
              {
                backgroundColor: activeSystem === 'gym' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.2)',
                borderColor: colorTheme.primary,
              },
            ]}
            onPress={() => onSwitchSystem(activeSystem === 'gym' ? 'tlc' : 'gym')}
          >
            {activeSystem === 'gym' ? (
              <Dumbbell size={15} color={colorTheme.primary} />
            ) : (
              <Leaf size={15} color={colorTheme.primary} />
            )}
            <Text style={[styles.systemToggleText, { color: colorTheme.primary }]}>
              {activeSystem === 'gym' ? 'MODO GYM' : 'MODO TLC'}
            </Text>
          </TouchableOpacity>

          {/* Botón Selector de Tableta de Colores */}
          <TouchableOpacity
            style={[styles.paletteBtn, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}
            onPress={onOpenPaletteModal}
          >
            <Palette size={16} color={colorTheme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Fila Inferior: Perfil de Usuario con Selector de Rol */}
      <TouchableOpacity
        style={[styles.userBar, { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.06)' }]}
        onPress={() => setRoleModalVisible(true)}
      >
        <Image source={{ uri: currentUser.avatar }} style={[styles.avatar, { borderColor: colorTheme.primary }]} />
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={[styles.userName, { color: envTheme.textMain }]}>{currentUser.name}</Text>
            <View style={[styles.roleBadge, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
              <Text style={[styles.roleBadgeText, { color: colorTheme.primary }]}>{currentUser.role}</Text>
            </View>
          </View>
          <Text style={[styles.roleSubtitle, { color: envTheme.textMuted }]}>{currentUser.roleLabel}</Text>
        </View>
        <ChevronDown size={16} color={envTheme.textMuted} />
      </TouchableOpacity>

      {/* Modal de Cambio de Rol Rápido */}
      <Modal visible={roleModalVisible} transparent animationType="fade" onRequestClose={() => setRoleModalVisible(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setRoleModalVisible(false)}>
          <View style={[styles.roleModalContent, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
            <View style={styles.roleModalHeader}>
              <ShieldCheck size={18} color={colorTheme.primary} />
              <Text style={[styles.roleModalTitle, { color: envTheme.textMain }]}>Cambiar Perfil / Rol</Text>
            </View>

            {DEMO_USERS.map((u) => {
              const isSelected = currentUser.id === u.id;
              return (
                <TouchableOpacity
                  key={u.id}
                  style={[
                    styles.roleItem,
                    {
                      backgroundColor: isSelected ? colorTheme.accentBg : 'transparent',
                      borderColor: isSelected ? colorTheme.primary : 'rgba(255, 255, 255, 0.05)',
                    },
                  ]}
                  onPress={() => {
                    onSwitchUser(u);
                    setRoleModalVisible(false);
                  }}
                >
                  <Image source={{ uri: u.avatar }} style={styles.miniAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.roleItemName, { color: isSelected ? colorTheme.primary : envTheme.textMain }]}>
                      {u.name}
                    </Text>
                    <Text style={[styles.roleItemSub, { color: envTheme.textMuted }]}>
                      {u.roleLabel} • <Text style={{ color: colorTheme.primary, fontWeight: '700' }}>{u.role}</Text>
                    </Text>
                  </View>
                  {isSelected && <Check size={16} color={colorTheme.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandText: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  systemPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  systemPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  systemToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  systemToggleText: {
    fontSize: 10,
    fontWeight: '800',
  },
  paletteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  userBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
  },
  roleBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.8,
  },
  roleBadgeText: {
    fontSize: 8,
    fontWeight: '800',
  },
  roleSubtitle: {
    fontSize: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  roleModalContent: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    gap: 8,
  },
  roleModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  roleModalTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  roleItemName: {
    fontSize: 13,
    fontWeight: '700',
  },
  roleItemSub: {
    fontSize: 10,
  },
});
