import * as repo from './apartment.repository';
import fs from 'fs';
import path from 'path';

const IMAGE_BASE_URL = '/images';
const BACKEND_URL = 'http://localhost:4000'; 

const SEED_IMAGES_FOLDER = path.resolve('prisma/seed-images');
const seedImages = fs.existsSync(SEED_IMAGES_FOLDER)
  ? fs.readdirSync(SEED_IMAGES_FOLDER).filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f))
  : [];

console.log('Found seed images:', seedImages);

export const createApartmentService = async (input: {
  unitName: string;
  unitNumber: string;
  projectName: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description?: string;
  images?: string[];
}) => {
  const project = await repo.createProjectIfNotExists(input.projectName);

  const imagesToSave = [seedImages[Math.floor(Math.random() * seedImages.length)]];
  

  const created = await repo.createApartment({
    unitName: input.unitName,
    unitNumber: input.unitNumber,
    projectId: project.id,
    price: input.price,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    area: input.area,
    description: input.description,
    images: imagesToSave,
  });
 const processed = {
    ...created,
    images: Array.isArray(created.images)
      ? created.images.map(f => `${BACKEND_URL}${IMAGE_BASE_URL}/${f}`)
      : [],
  };

  return processed;
};

export const listApartmentsService = async (params: repo.ListParams) => {
  const result = await repo.listApartments(params);

  return {
    ...result,
    data: result.data.map(a => ({
      ...a,
      images: Array.isArray(a.images)
        ? (a.images.filter(f => typeof f === 'string') as string[]).map(
            f => `${BACKEND_URL}${IMAGE_BASE_URL}/${f}`
          )
        : [],
    })),
  };
};

export const getApartmentService = async (id: string) => {
  const apt = await repo.findApartmentById(id);
  if (!apt) return null;

  apt.images = Array.isArray(apt.images)
    ? (apt.images.filter(f => typeof f === 'string') as string[]).map( f => `${BACKEND_URL}${IMAGE_BASE_URL}/${f}`)
    : [];

  return apt;
};
