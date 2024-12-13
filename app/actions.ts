'use server'
import { Field, Prisma, User } from '@prisma/client';
import prisma from '../lib/prisma';

export async function fetchFields(step: number | undefined) {
  const fields = await prisma.field.findMany(step ? {
    where: {
      step,
    },
  } : undefined);
  return fields;
}

export async function handleUpdateFieldStep(fieldId: string, step: number) {
  try {
    const updatedField = await prisma.field.update({
      where: {
        id: fieldId,
      },
      data: { step },
    });
    return { success: true, data: updatedField };
  } catch (error) {
    return { success: false, errorMessage: (error as Error).message };
  }
}

// update fields, handle errors and return response to the client
export async function handleUpdateFields(fields: Field[]) {
  try {
    const updatedFields = await Promise.all(fields.map(async (field) => {
      const updatedField = await prisma.field.update({
        where: {
          id: field.id,
        },
        data: field,
      });
      return updatedField;
    }));
    return { success: true, data: updatedFields };
  } catch (error) {
    return { success: false, errorMessage: (error as Error).message };
  }
}

export interface Response<T> {
  success: boolean;
  data?: T;
  errorMessage?: string;
}

export interface UserCreate {
  email: string;
  password: string;
}

async function createUser(user: UserCreate): Promise<Response<User>> {
  try {
    const newUser = await prisma.user.create({
      data: user,
    });
    return { success: true, data: newUser };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        return { success: false, errorMessage: 'There is a unique constraint violation, a new user cannot be created with this email' }
      }
    }
    return { success: false, errorMessage: (error as Error).message };
  }
}

// fetch user by email, handle errors and return response to the client
export async function handleFetchUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return { success: true, data: user };
  } catch (error) {
    return { success: false, errorMessage: (error as Error).message };
  }
}

// update user, handle errors and return response to the client
export async function handleUpdateUser(user: User) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });
    return { success: true, data: updatedUser };
  } catch (error) {
    return { success: false, errorMessage: (error as Error).message };
  }
}

//update or create user, handle errors and return repsonse to the client
export async function handleUpdateOrCreateUser(user: User) {
  try {
    const updatedUser = await prisma.user.upsert({
      where: {
        id: user.id,
      },
      update: user,
      create: user,
    });
    return { success: true, data: updatedUser };
  } catch (error) {
    return { success: false, errorMessage: (error as Error).message };
  }
}

export async function handleCreateUser(user: UserCreate) {
  const response = await createUser(user);
  return response;
}

export async function handleFetchUsers(page: number, perPage: number) {
  try {
    const users = await prisma.user.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
    });
    console.log("🚀 ~ handleFetchUsers ~ users:", users)
    return { success: true, data: users };
  } catch (error) {
    return { success: false, errorMessage: (error as Error).message };
  }
}

export async function fetchUsersCount() {
  const count = await prisma.user.count();
  return count;
}