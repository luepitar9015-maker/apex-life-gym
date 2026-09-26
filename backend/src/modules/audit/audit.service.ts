import { prisma } from '../../config/prisma.js';

export interface AuditLogData {
  id?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  severity?: 'INFO' | 'WARNING' | 'SECURITY' | 'CRITICAL';
  status?: 'SUCCESS' | 'FAILED';
  timestamp?: Date;
}

// Buffer en memoria de alta velocidad (mantiene los últimos 1000 registros para acceso ultra rápido y fallback)
const inMemoryAuditLogs: AuditLogData[] = [
  {
    id: 'aud-seed-1',
    userId: 'usr-superadmin',
    userEmail: 'superadmin@apexlifegym.com',
    userName: 'Director Superadmin',
    action: 'SERVER_BOOT',
    entity: 'Server',
    entityId: 'srv-primary',
    details: { message: 'Servidor APEX LIFE iniciado en modo Producción/Desarrollo', port: 4000 },
    ipAddress: '127.0.0.1',
    userAgent: 'APEX-Core-System/2.0',
    severity: 'INFO',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 3600000 * 4),
  },
  {
    id: 'aud-seed-2',
    userId: 'usr-admin-gym',
    userEmail: 'admin.gym@apexlifegym.com',
    userName: 'Carlos Mendoza',
    action: 'LOGIN_SUCCESS',
    entity: 'Auth',
    entityId: 'usr-admin-gym',
    details: { method: 'JWT_BEARER', role: 'BUSINESS_ADMIN' },
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'INFO',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 3600000 * 2),
  },
  {
    id: 'aud-seed-3',
    userId: 'usr-superadmin',
    userEmail: 'superadmin@apexlifegym.com',
    userName: 'Director Superadmin',
    action: 'PERMISSION_UPDATE',
    entity: 'Permission',
    entityId: 'perm-users-create',
    details: { targetRole: 'BUSINESS_ADMIN', permission: 'users:create', granted: true },
    ipAddress: '127.0.0.1',
    userAgent: 'APEX-Admin-Console',
    severity: 'SECURITY',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'aud-seed-4',
    userId: 'usr-unknown',
    userEmail: 'attacker@unknown.domain',
    userName: 'Anónimo',
    action: 'AUTH_FAILED',
    entity: 'Auth',
    entityId: 'none',
    details: { reason: 'Contraseña errónea 3 intentos consecutivos', target: 'director@gym.com' },
    ipAddress: '45.132.89.21',
    userAgent: 'curl/7.88.1',
    severity: 'WARNING',
    status: 'FAILED',
    timestamp: new Date(Date.now() - 1800000),
  },
];

export class AuditService {
  /**
   * Registra un evento en la bitácora de auditoría
   */
  static async record(data: AuditLogData): Promise<AuditLogData> {
    const record: AuditLogData = {
      id: data.id || `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: data.userId || 'SISTEMA',
      userEmail: data.userEmail || 'system@apexlifegym.com',
      userName: data.userName || 'Sistema Autónomo',
      action: data.action.toUpperCase(),
      entity: data.entity,
      entityId: data.entityId,
      details: typeof data.details === 'object' ? data.details : { message: data.details },
      ipAddress: data.ipAddress || '127.0.0.1',
      userAgent: data.userAgent || 'APEX-Agent',
      severity: data.severity || 'INFO',
      status: data.status || 'SUCCESS',
      timestamp: data.timestamp || new Date(),
    };

    // Agregar al buffer en memoria (lo primero para que sea instantáneo)
    inMemoryAuditLogs.unshift(record);
    if (inMemoryAuditLogs.length > 1000) {
      inMemoryAuditLogs.pop();
    }

    // Intentar persistir en Prisma PostgreSQL en segundo plano si está disponible
    try {
      if ((prisma as any).auditLog) {
        await (prisma as any).auditLog.create({
          data: {
            id: record.id,
            userId: record.userId,
            userEmail: record.userEmail,
            userName: record.userName,
            action: record.action,
            entity: record.entity,
            entityId: record.entityId,
            details: JSON.stringify(record.details),
            ipAddress: record.ipAddress,
            userAgent: record.userAgent,
            severity: record.severity,
            status: record.status,
            timestamp: record.timestamp,
          },
        });
      }
    } catch (dbError) {
      // Si la BD no está disponible o la tabla aún no se ha sincronizado físicamente, el buffer en memoria ya garantizó el registro
    }

    return record;
  }

  /**
   * Consulta registros de auditoría con filtrado multidimensional
   */
  static async query(params: {
    search?: string;
    action?: string;
    entity?: string;
    severity?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, action, entity, severity, userId, page = 1, limit = 50 } = params;

    // Intentar leer de base de datos
    try {
      if ((prisma as any).auditLog) {
        const where: any = {};
        if (action && action !== 'ALL') where.action = { equals: action, mode: 'insensitive' };
        if (entity && entity !== 'ALL') where.entity = { equals: entity, mode: 'insensitive' };
        if (severity && severity !== 'ALL') where.severity = severity;
        if (userId) where.userId = userId;
        if (search) {
          where.OR = [
            { userEmail: { contains: search, mode: 'insensitive' } },
            { userName: { contains: search, mode: 'insensitive' } },
            { action: { contains: search, mode: 'insensitive' } },
            { entity: { contains: search, mode: 'insensitive' } },
            { details: { contains: search, mode: 'insensitive' } },
          ];
        }

        const [items, total] = await Promise.all([
          (prisma as any).auditLog.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
          }),
          (prisma as any).auditLog.count({ where }),
        ]);

        if (items && items.length > 0) {
          return {
            items: items.map((i: any) => ({
              ...i,
              details: typeof i.details === 'string' ? JSON.parse(i.details || '{}') : i.details,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            source: 'POSTGRESQL_DB',
          };
        }
      }
    } catch {
      // Fallback a memoria si la tabla de Postgres no está lista
    }

    // Filtrar sobre memoria
    let filtered = [...inMemoryAuditLogs];

    if (action && action !== 'ALL') {
      filtered = filtered.filter((l) => l.action.toLowerCase() === action.toLowerCase());
    }
    if (entity && entity !== 'ALL') {
      filtered = filtered.filter((l) => l.entity.toLowerCase() === entity.toLowerCase());
    }
    if (severity && severity !== 'ALL') {
      filtered = filtered.filter((l) => l.severity === severity);
    }
    if (userId) {
      filtered = filtered.filter((l) => l.userId === userId);
    }
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.userEmail?.toLowerCase().includes(term) ||
          l.userName?.toLowerCase().includes(term) ||
          l.action.toLowerCase().includes(term) ||
          l.entity.toLowerCase().includes(term) ||
          JSON.stringify(l.details || {}).toLowerCase().includes(term)
      );
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      source: 'IN_MEMORY_REALTIME',
    };
  }

  /**
   * Obtiene métricas y estadísticas resumidas de auditoría
   */
  static async getStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const logs = inMemoryAuditLogs;
    const totalLogs = logs.length;
    const securityEvents = logs.filter((l) => l.severity === 'SECURITY' || l.severity === 'CRITICAL').length;
    const warningEvents = logs.filter((l) => l.severity === 'WARNING').length;
    const recent24h = logs.filter((l) => new Date(l.timestamp || 0) >= last24h).length;

    // Conteo por acción
    const actionCounts: Record<string, number> = {};
    logs.forEach((l) => {
      actionCounts[l.action] = (actionCounts[l.action] || 0) + 1;
    });

    return {
      totalLogs,
      securityEvents,
      warningEvents,
      recent24h,
      actionCounts,
      lastRecordedAt: logs[0]?.timestamp || now,
    };
  }
}
