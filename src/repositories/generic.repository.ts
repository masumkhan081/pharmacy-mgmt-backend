import prisma from "../lib/prisma";

const create = async (data: any) => {
  return await prisma.generic.create({ data });
};

const findById = async (id: string) => {
  return await prisma.generic.findUnique({ where: { id } });
};

const findMany = async (params: any) => {
  return await prisma.generic.findMany(params);
};

const update = async (id: string, data: any) => {
  return await prisma.generic.update({ where: { id }, data });
};

const deleteById = async (id: string) => {
  return await prisma.generic.delete({ where: { id } });
};

const count = async (where: any) => {
  return await prisma.generic.count({ where });
};

export default {
  create,
  findById,
  findMany,
  update,
  deleteById,
  count,
};
