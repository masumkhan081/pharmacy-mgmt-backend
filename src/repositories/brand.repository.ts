import prisma from "../lib/prisma";

const create = async (data: any) => {
  return await prisma.brand.create({ data });
};

const findById = async (id: string) => {
  return await prisma.brand.findUnique({ where: { id } });
};

const findMany = async (params: any) => {
  return await prisma.brand.findMany(params);
};

const update = async (id: string, data: any) => {
  return await prisma.brand.update({ where: { id }, data });
};

const deleteById = async (id: string) => {
  return await prisma.brand.delete({ where: { id } });
};

const count = async (where: any) => {
  return await prisma.brand.count({ where });
};

export default {
  create,
  findById,
  findMany,
  update,
  deleteById,
  count,
};
