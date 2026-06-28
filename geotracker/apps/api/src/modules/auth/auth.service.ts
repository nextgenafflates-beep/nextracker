import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private async ensureWorkspaceForUser(userId: string, fullName: string) {
    const existingMembership = await this.prisma.workspaceMember.findFirst({
      where: { userId },
      include: { workspace: true }
    });

    if (existingMembership?.workspace) {
      return existingMembership.workspace;
    }

    const workspace = await this.prisma.workspace.create({
      data: {
        name: `${fullName.trim()}'s workspace`
      }
    });

    await this.prisma.workspaceMember.create({
      data: {
        userId,
        workspaceId: workspace.id,
        role: 'owner'
      }
    });

    return workspace;
  }

  async register(payload: { fullName: string; email: string; password: string; promoCode?: string }) {
    const fullName = payload.fullName?.trim();
    const email = payload.email?.trim().toLowerCase();
    const password = payload.password?.trim();

    if (!fullName || !email || !password) {
      throw new BadRequestException('Please fill out all required fields.');
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const allowedPromoCode = process.env.PROMO_CODE;
    const approved = allowedPromoCode && payload.promoCode?.trim() === allowedPromoCode;

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        status: approved ? 'active' : 'pending',
        approvedAt: approved ? new Date() : null,
        provider: 'email'
      }
    });

    const workspace = await this.ensureWorkspaceForUser(user.id, user.fullName);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      message: approved
        ? 'Account created successfully. You can sign in now.'
        : 'Account created successfully. Your access will be approved shortly.'
    };
  }

  async login(payload: { email: string; password: string }) {
    const email = payload.email?.trim().toLowerCase();
    const password = payload.password?.trim();

    if (!email || !password) {
      throw new BadRequestException('Email and password are required.');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Your account is still pending approval.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const workspace = await this.ensureWorkspaceForUser(user.id, user.fullName);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      message: 'Signed in successfully.'
    };
  }

  async googleSignIn(payload: { email: string; fullName: string; providerId: string }) {
    const email = payload.email?.trim().toLowerCase();
    const fullName = payload.fullName?.trim();

    if (!email || !fullName || !payload.providerId) {
      throw new BadRequestException('Google sign-in data is incomplete.');
    }

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          fullName,
          provider: 'google',
          providerId: payload.providerId,
          status: 'active',
          approvedAt: new Date()
        }
      });
    } else if (user.provider !== 'google') {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { provider: 'google', providerId: payload.providerId, status: 'active', approvedAt: new Date() }
      });
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const workspace = await this.ensureWorkspaceForUser(user.id, user.fullName);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      message: 'Signed in with Google successfully.'
    };
  }
}
