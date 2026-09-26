import { Role } from '@prisma/client';
import { prisma } from '../../config/prisma.js';

export interface SystemPermission {
  code: string;
  name: string;
  category: 'USUARIOS' | 'SEGURIDAD' | 'SERVIDOR' | 'AUDITORIA' | 'GIMNASIO' | 'TLC' | 'FINANZAS';
  description: string;
  defaultRoles: Role[];
}

export const ALL_SYSTEM_PERMISSIONS: SystemPermission[] = [
  // 1. Usuarios y Accesos
  {
    code: 'users:view',
    name: 'Visualizar Directorio de Usuarios',
    category: 'USUARIOS',
    description: 'Permite consultar la lista de usuarios, roles y perfiles registrados.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN, Role.ADMIN],
  },
  {
    code: 'users:create',
    name: 'Crear Nuevos Usuarios',
    category: 'USUARIOS',
    description: 'Habilita el registro de usuarios, selección de roles y negocios.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN],
  },
  {
    code: 'users:edit',
    name: 'Editar Información y Roles',
    category: 'USUARIOS',
    description: 'Permite actualizar nombres, teléfonos, documento, rol y afiliación.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN],
  },
  {
    code: 'users:status',
    name: 'Suspender / Activar Usuarios',
    category: 'USUARIOS',
    description: 'Permite bloquear o habilitar el ingreso al sistema.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN],
  },
  {
    code: 'users:reset_pwd',
    name: 'Restablecer Contraseñas',
    category: 'USUARIOS',
    description: 'Generar nuevas contraseñas temporales para cualquier cuenta.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN],
  },
  {
    code: 'users:delete',
    name: 'Eliminar Cuentas de Usuario',
    category: 'USUARIOS',
    description: 'Remover permanentemente o archivar una cuenta del sistema.',
    defaultRoles: [Role.SUPERADMIN],
  },

  // 2. Permisos y RBAC
  {
    code: 'permissions:view',
    name: 'Ver Matriz de Permisos',
    category: 'SEGURIDAD',
    description: 'Consultar permisos asignados por rol y usuario.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN],
  },
  {
    code: 'permissions:manage',
    name: 'Asignar Permisos Granulares',
    category: 'SEGURIDAD',
    description: 'Otorgar o revocar permisos específicos a usuarios individuales.',
    defaultRoles: [Role.SUPERADMIN],
  },

  // 3. Auditoría y Trazabilidad
  {
    code: 'audit:view',
    name: 'Consultar Bitácora de Auditoría',
    category: 'AUDITORIA',
    description: 'Acceso a registros de eventos, accesos, cambios y alertas del sistema.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN],
  },
  {
    code: 'audit:export',
    name: 'Exportar Informes de Auditoría',
    category: 'AUDITORIA',
    description: 'Descargar bitácoras en formato JSON o CSV.',
    defaultRoles: [Role.SUPERADMIN],
  },

  // 4. Servidor y Telemetría
  {
    code: 'server:view',
    name: 'Ver Estado y Salud del Servidor',
    category: 'SERVIDOR',
    description: 'Monitorear uso de memoria RAM, CPU, tiempo de actividad y latencia.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN],
  },
  {
    code: 'server:diagnostics',
    name: 'Ejecutar Diagnósticos de Servidor',
    category: 'SERVIDOR',
    description: 'Pruebas de latencia a base de datos y verificación de endpoints.',
    defaultRoles: [Role.SUPERADMIN],
  },
  {
    code: 'server:manage',
    name: 'Acciones Avanzadas de Servidor',
    category: 'SERVIDOR',
    description: 'Purgar memorias caché, reiniciar sockets y reconectar base de datos.',
    defaultRoles: [Role.SUPERADMIN],
  },

  // 5. Gimnasio & Socios
  {
    code: 'gym:checkin',
    name: 'Módulo Recepción y Check-In QR',
    category: 'GIMNASIO',
    description: 'Validar pases y registrar aforo físico.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN, Role.ADMIN, Role.TRAINER],
  },
  {
    code: 'gym:members',
    name: 'Directorio de Socios y Membresías',
    category: 'GIMNASIO',
    description: 'Gestionar suscripciones y planes del gimnasio.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN, Role.ADMIN],
  },
  {
    code: 'gym:routines',
    name: 'Catálogo de Rutinas y Ejercicios',
    category: 'GIMNASIO',
    description: 'Crear y prescribir entrenamientos.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN, Role.ADMIN, Role.TRAINER],
  },
  {
    code: 'gym:nutrition',
    name: 'Nutrición y Cálculo de Macros',
    category: 'GIMNASIO',
    description: 'Planes nutricionales y distribución calórica.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN, Role.ADMIN, Role.NUTRITIONIST],
  },
  {
    code: 'gym:assessments',
    name: 'Escaneo Corporal Biométrico IA',
    category: 'GIMNASIO',
    description: 'Análisis de grasa, somatotipo y postura.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN, Role.ADMIN, Role.TRAINER, Role.MEMBER],
  },

  // 6. Total Life Changes (TLC)
  {
    code: 'tlc:store',
    name: 'Tienda en Línea TLC y Catálogo',
    category: 'TLC',
    description: 'Visualizar productos y enlaces de referidos.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN, Role.AFFILIATE, Role.MEMBER],
  },
  {
    code: 'tlc:network',
    name: 'Red de Afiliados y Comisiones',
    category: 'TLC',
    description: 'Visualizar árbol de patrocinio y liquidación del 50%.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN, Role.AFFILIATE],
  },
  {
    code: 'tlc:video_ai',
    name: 'Generador de Video IA para Redes',
    category: 'TLC',
    description: 'Creación automatizada de contenido viral.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN, Role.AFFILIATE],
  },
  {
    code: 'tlc:contacts',
    name: 'Base de Prospectos Ley 1581 Colombia',
    category: 'TLC',
    description: 'Gestión de prospectos de détox y productos.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN, Role.AFFILIATE],
  },

  // 7. Finanzas
  {
    code: 'finance:view',
    name: 'Reportes de Ingresos y Facturación',
    category: 'FINANZAS',
    description: 'Consulta de balances, ventas y rentabilidad.',
    defaultRoles: [Role.SUPERADMIN, Role.BUSINESS_ADMIN],
  },
];

// Almacén de personalizaciones de permisos en memoria (Fallback y caché veloz)
const userOverridesMap = new Map<string, Record<string, boolean>>();

export class PermissionsService {
  /**
   * Obtiene todos los permisos disponibles en el sistema
   */
  static getAllPermissions(): SystemPermission[] {
    return ALL_SYSTEM_PERMISSIONS;
  }

  /**
   * Obtiene los permisos por defecto para un rol
   */
  static getRolePermissions(role: Role): string[] {
    if (role === Role.SUPERADMIN) {
      return ALL_SYSTEM_PERMISSIONS.map((p) => p.code);
    }
    return ALL_SYSTEM_PERMISSIONS.filter((p) => p.defaultRoles.includes(role)).map((p) => p.code);
  }

  /**
   * Obtiene los permisos efectivos para un usuario (rol base + personalizaciones explícitas)
   */
  static async getUserEffectivePermissions(userId: string, role: Role): Promise<{
    role: Role;
    effectivePermissions: string[];
    roleDefaultPermissions: string[];
    customGranted: string[];
    customRevoked: string[];
  }> {
    const roleDefaults = this.getRolePermissions(role);
    let customGranted: string[] = [];
    let customRevoked: string[] = [];

    // 1. Consultar base de datos si está disponible
    try {
      if ((prisma as any).userCustomPermission) {
        const dbOverrides = await (prisma as any).userCustomPermission.findMany({
          where: { userId },
        });

        if (dbOverrides && dbOverrides.length > 0) {
          dbOverrides.forEach((o: any) => {
            if (o.isGranted) {
              customGranted.push(o.permissionCode);
            } else {
              customRevoked.push(o.permissionCode);
            }
          });
        }
      }
    } catch {
      // Usar mapa en memoria si la BD no está lista
      const memOverrides = userOverridesMap.get(userId) || {};
      Object.entries(memOverrides).forEach(([code, isGranted]) => {
        if (isGranted) customGranted.push(code);
        else customRevoked.push(code);
      });
    }

    // Calcular permisos efectivos: (Base + Añadidos) - Revocados
    const permissionsSet = new Set<string>(roleDefaults);
    customGranted.forEach((code) => permissionsSet.add(code));
    customRevoked.forEach((code) => permissionsSet.delete(code));

    // Superadmin siempre conserva todo por diseño de seguridad
    if (role === Role.SUPERADMIN) {
      ALL_SYSTEM_PERMISSIONS.forEach((p) => permissionsSet.add(p.code));
    }

    return {
      role,
      effectivePermissions: Array.from(permissionsSet),
      roleDefaultPermissions: roleDefaults,
      customGranted,
      customRevoked,
    };
  }

  /**
   * Asigna un conjunto de personalizaciones de permisos para un usuario
   */
  static async setUserCustomPermissions(
    userId: string,
    overrides: { permissionCode: string; isGranted: boolean }[],
    grantedBy?: string
  ): Promise<void> {
    // 1. Guardar en memoria
    let currentMem = userOverridesMap.get(userId) || {};
    overrides.forEach(({ permissionCode, isGranted }) => {
      currentMem[permissionCode] = isGranted;
    });
    userOverridesMap.set(userId, currentMem);

    // 2. Guardar en PostgreSQL vía Prisma
    try {
      if ((prisma as any).userCustomPermission) {
        for (const { permissionCode, isGranted } of overrides) {
          await (prisma as any).userCustomPermission.upsert({
            where: {
              userId_permissionCode: {
                userId,
                permissionCode,
              },
            },
            update: {
              isGranted,
              grantedBy,
              grantedAt: new Date(),
            },
            create: {
              userId,
              permissionCode,
              isGranted,
              grantedBy,
            },
          });
        }
      }
    } catch (err) {
      // Memoria respalda la operación de forma transparente
    }
  }

  /**
   * Comprueba si un usuario tiene un permiso específico
   */
  static async hasPermission(userId: string, role: Role, permissionCode: string): Promise<boolean> {
    if (role === Role.SUPERADMIN) return true;
    const { effectivePermissions } = await this.getUserEffectivePermissions(userId, role);
    return effectivePermissions.includes(permissionCode);
  }
}
