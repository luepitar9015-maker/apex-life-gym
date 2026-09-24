import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

// Texto legal estándar obligatorio de conformidad con la Ley 1581 de 2012 y Decreto 1377 de 2013 de Colombia
export const HABEAS_DATA_LEGAL_TEXT = `En cumplimiento de la Ley Estatutaria 1581 de 2012 de Protección de Datos Personales y el Decreto 1377 de 2013 de la República de Colombia, el titular autoriza de manera voluntaria, previa, explícita, informada e inequívoca a Total Life Changes (TLC) y sus distribuidores independientes autorizados, para recolectar, almacenar, usar, circular y suprimir los datos personales suministrados. 

Finalidades del tratamiento: 
1. Contacto comercial personalizado vía WhatsApp, llamada telefónica o correo electrónico.
2. Presentación y asesoría sobre productos détox, control de peso, nutrición y bienestar integral TLC.
3. Información sobre la oportunidad de negocio y afiliación como distribuidor independiente.
4. Seguimiento y acompañamiento postventa en los protocolos nutricionales.

Derechos del titular (Habeas Data): 
Conocer, actualizar, rectificar y solicitar la supresión de sus datos personales, así como revocar la autorización otorgada en cualquier momento mediante comunicación escrita.`;

/**
 * Obtener texto de política de datos Colombia
 */
export const getHabeasDataPolicy = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    law: 'Ley 1581 de 2012 - República de Colombia',
    decree: 'Decreto 1377 de 2013',
    policyText: HABEAS_DATA_LEGAL_TEXT,
    version: '2026.1',
  });
};

/**
 * Listar contactos registrados
 */
export const getTLCContacts = async (req: Request, res: Response) => {
  try {
    const { status, search, affiliateId } = req.query;

    const where: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }
    if (affiliateId && typeof affiliateId === 'string') {
      where.assignedAffiliateId = affiliateId;
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { documentId: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const contacts = await prisma.tLCContact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedAffiliate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: contacts,
      total: contacts.length,
    });
  } catch (error: any) {
    console.error('Error al listar contactos TLC:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de contactos.',
      error: error.message,
    });
  }
};

/**
 * Registrar nuevo contacto con cumplimiento de Ley 1581 de Colombia
 */
export const createTLCContact = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      documentType = 'CC',
      documentId,
      phone,
      email,
      department,
      city,
      leadSource = 'ORGANIC',
      interestProduct,
      notes,
      dataPolicyAccepted,
      assignedAffiliateId,
    } = req.body;

    // Validación estricta de consentimiento previo e informado
    if (!dataPolicyAccepted) {
      return res.status(400).json({
        success: false,
        message: 'De conformidad con la Ley 1581 de 2012 de Colombia, es obligatorio que el titular acepte la autorización de tratamiento de datos personales.',
      });
    }

    if (!firstName || !lastName || !phone || !email || !documentId) {
      return res.status(400).json({
        success: false,
        message: 'Nombres, apellidos, documento de identidad, teléfono/WhatsApp y correo son campos obligatorios.',
      });
    }

    // IP del cliente para registro probatorio de consentimiento digital
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;

    const contact = await prisma.tLCContact.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        documentType,
        documentId: documentId.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        department: department?.trim() || null,
        city: city?.trim() || null,
        leadSource,
        interestProduct: interestProduct?.trim() || 'Iaso Tea Original & Detox',
        notes: notes?.trim() || null,
        dataPolicyAccepted: true,
        acceptedAt: new Date(),
        ipAddress: typeof clientIp === 'string' ? clientIp : String(clientIp || ''),
        authorizationText: HABEAS_DATA_LEGAL_TEXT,
        assignedAffiliateId: assignedAffiliateId || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Contacto registrado exitosamente con autorización de datos personales (Ley 1581 de 2012).',
      data: contact,
    });
  } catch (error: any) {
    console.error('Error al registrar contacto TLC:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el contacto.',
      error: error.message,
    });
  }
};

/**
 * Actualizar estado o datos de contacto
 */
export const updateTLCContact = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status, notes, interestProduct, assignedAffiliateId } = req.body;

    const updated = await prisma.tLCContact.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(interestProduct && { interestProduct }),
        ...(assignedAffiliateId !== undefined && { assignedAffiliateId }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Contacto actualizado correctamente.',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error al actualizar contacto TLC:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el contacto.',
      error: error.message,
    });
  }
};

/**
 * Revocar consentimiento / Solicitud de Supresión (Derecho de Habeas Data)
 */
export const revokeTLCContactConsent = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const revoked = await prisma.tLCContact.update({
      where: { id },
      data: {
        revocationRequested: true,
        revocationDate: new Date(),
        status: 'DESCARTADO',
        notes: `Consentimiento revocado por solicitud del titular bajo la Ley 1581 de 2012 el ${new Date().toLocaleString('es-CO')}.`,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Consentimiento revocado y derecho de supresión registrado conforme a la Ley 1581.',
      data: revoked,
    });
  } catch (error: any) {
    console.error('Error al revocar consentimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la revocatoria de consentimiento.',
      error: error.message,
    });
  }
};
