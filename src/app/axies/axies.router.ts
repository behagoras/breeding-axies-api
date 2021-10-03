import { PartGene } from 'agp-npm/dist/models/part';
import { Router } from 'express';
import getAllPossibleAxies from './services/getAllPossibleAxies';
import getAxies from './services/getAxies';
import { Pagination } from '../../types/pagination.types';
import filterDuplicates from '../../utils/filterDuplicates';
import filterAxies from '../../utils/useFilterAxies';
import { BASE_ENDPOINT } from '../../constants/endpoint';

// Export module for registering router in express app
export const router: Router = Router();

const routerPath = BASE_ENDPOINT + '/axies';

router.post(`${routerPath}`, async (req, res) => {
  const body = req.body as {
    Back?: PartGene;
    Mouth?: PartGene;
    Horn?: PartGene;
    Tail?: PartGene;
    species?: string[];
  };
  const axies = await getAxies(body, body)
  const pagination: Pagination = {
    total: axies.length,
    pages: 1,
    current: 1,
    next: null,
    previous: null
  }
  res.status(200).json({
    pagination,
    axies
  });
});

router.post(`${routerPath}/all`, async (req, res) => {
  const body = req.body as {
    Back?: PartGene;
    Mouth?: PartGene;
    Horn?: PartGene;
    Tail?: PartGene;
    species?: string[];
  };
  const response = await getAllPossibleAxies(body, body)
  const filteredAxies = filterDuplicates(response)
  const pagination: Pagination = {
    total: filteredAxies.length,
    pages: 1,
    current: 1,
    next: null,
    previous: null
  }
  res.status(200).json({
    pagination,
    axies: filteredAxies
  });
});

