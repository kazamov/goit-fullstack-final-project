import type { GetAreaResponse } from '@goit-fullstack-final-project/schemas';
import { GetAreaResponseSchema } from '@goit-fullstack-final-project/schemas';

import { AreaDTO } from '../../infrastructure/db/index.js';

export async function getAreas(): Promise<GetAreaResponse> {
  const areas = await AreaDTO.findAll();
  return GetAreaResponseSchema.parse(areas.map((area) => area.toJSON()));
}
