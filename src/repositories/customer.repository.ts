import prisma from "../lib/prisma";

const create = async (data: any) => {
  return await prisma.customer.create({ data });
};

const findById = async (id: string) => {
  return await prisma.customer.findUnique({ where: { id } });
};

const findMany = async (params: any) => {
  return await prisma.customer.findMany(params);
};

const update = async (id: string, data: any) => {
  return await prisma.customer.update({ where: { id }, data });
};

const deleteById = async (id: string) => {
  return await prisma.customer.delete({ where: { id } });
};

const count = async (where: any) => {
  return await prisma.customer.count({ where });
};

export default {
  create,
  findById,
  findMany,
  update,
  deleteById,
  count,
};
