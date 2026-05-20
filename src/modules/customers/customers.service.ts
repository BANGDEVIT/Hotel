import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { QueryCustomerDto } from './dto/query-customers.dto';
import { PaginatedCustomerResponseDto } from './dto/customer-response.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/chang-password-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}
  // create(createCustomerDto: CreateCustomerDto) {
  //   return 'This action adds a new customer';
  // }

  async findAll(
    query: QueryCustomerDto,
  ): Promise<PaginatedCustomerResponseDto> {
    const {
      page = 1,
      limit = 10,
      search,
      nationality,
      orderby = 'created_at',
      order = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {
      account: { is_active: true },
    };

    if (nationality) where.nationality = nationality;

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const validSortFields = [
      'first_name',
      'last_name',
      'reward_points',
      'created_at',
    ];
    const orderBy: Prisma.CustomerOrderByWithRelationInput =
      validSortFields.includes(orderby)
        ? { [orderby]: order }
        : { created_at: 'desc' };

    const [customersRaw, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          id_card: true,
          // id_card_img_url: true,    ← thêm sau AWS S3
          // id_card_img_back_url: true, ← thêm sau AWS S3
          nationality: true,
          reward_points: true,
          updated_at: true,
          account: {
            select: {
              id: true,
              email: true,
              is_active: true,
            },
          },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    const customers = customersRaw.map((c) => ({
      ...c,
      full_name: `${c.last_name} ${c.first_name}`,
    }));

    return {
      data: customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        id_card: true,
        // id_card_img_url: true,
        // id_card_img_back_url: true,
        nationality: true,
        reward_points: true,
        updated_at: true,
        account: {
          select: {
            id: true,
            email: true,
            is_active: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return {
      id: customer.id,
      full_name: `${customer.last_name} ${customer.first_name}`,
      phone: customer.phone,
      id_card: customer.id_card,
      // id_card_img_url: customer.id_card_img_url,
      // id_card_img_back_url: customer.id_card_img_back_url,
      nationality: customer.nationality,
      reward_points: customer.reward_points,
      updated_at: customer.updated_at,
      account: customer.account,
    };
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { account: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Tách account fields và customer fields
    const { is_active, ...customerFields } = updateCustomerDto;

    // Update customer fields
    const updateData: any = { ...customerFields };

    if (is_active !== undefined) {
      await this.prisma.account.update({
        where: { id: customer.account_id },
        data: { is_active },
      });
    }

    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        id_card: true,
        nationality: true,
        reward_points: true,
        updated_at: true,
        account: {
          select: {
            id: true,
            email: true,
            is_active: true,
          },
        },
      },
    });

    return {
      id: updatedCustomer.id,
      full_name: `${updatedCustomer.last_name} ${updatedCustomer.first_name}`,
      phone: updatedCustomer.phone,
      id_card: updatedCustomer.id_card,
      nationality: updatedCustomer.nationality,
      reward_points: updatedCustomer.reward_points,
      updated_at: updatedCustomer.updated_at,
      account: updatedCustomer.account,
    };
  }

  async remove(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Soft delete: chỉ vô hiệu hóa account
    await this.prisma.account.update({
      where: { id: customer.account_id },
      data: { is_active: false },
    });

    return { message: 'Customer deactivated successfully' };
  }

  async getProfile(accountId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { account_id: accountId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        id_card: true,
        // id_card_img_url: true,
        // id_card_img_back_url: true,
        nationality: true,
        reward_points: true,
        updated_at: true,
        account: {
          select: {
            id: true,
            email: true,
            is_active: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return {
      id: customer.id,
      full_name: `${customer.last_name} ${customer.first_name}`,
      phone: customer.phone,
      id_card: customer.id_card,
      // id_card_img_url: customer.id_card_img_url,
      // id_card_img_back_url: customer.id_card_img_back_url,
      nationality: customer.nationality,
      reward_points: customer.reward_points,
      updated_at: customer.updated_at,
      account: customer.account,
    };
  }

  async updateProfile(
    accountId: string,
    updateCustomerProfileDto: UpdateCustomerProfileDto,
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: { account_id: accountId },
      include: { account: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const { email, ...customerFields } = updateCustomerProfileDto;

    // Nếu có email -> update Account
    if (email) {
      // Check email đã tồn tại chưa
      const existingAccount = await this.prisma.account.findUnique({
        where: { email },
      });

      if (existingAccount && existingAccount.id !== accountId) {
        throw new BadRequestException('Email already exists');
      }

      await this.prisma.account.update({
        where: { id: accountId },
        data: { email },
      });

      // Update email trong customer
      await this.prisma.customer.update({
        where: { id: customer.id },
        data: { email },
      });
    }

    const updatedCustomer = await this.prisma.customer.update({
      where: { id: customer.id },
      data: customerFields,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        id_card: true,
        nationality: true,
        reward_points: true,
        updated_at: true,
        account: {
          select: {
            id: true,
            email: true,
            is_active: true,
          },
        },
      },
    });

    return {
      id: updatedCustomer.id,
      full_name: `${updatedCustomer.last_name} ${updatedCustomer.first_name}`,
      phone: updatedCustomer.phone,
      id_card: updatedCustomer.id_card,
      nationality: updatedCustomer.nationality,
      reward_points: updatedCustomer.reward_points,
      updated_at: updatedCustomer.updated_at,
      account: updatedCustomer.account,
    };
  }

  async changePassword(
    accountId: string,
    changePasswordDto: ChangePasswordDto,
  ) {
    const { current_password, new_password } = changePasswordDto;

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      current_password,
      account.hash_password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Check new password !== old password
    const isSamePassword = await bcrypt.compare(
      new_password,
      account.hash_password,
    );
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await this.prisma.account.update({
      where: { id: accountId },
      data: { hash_password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
