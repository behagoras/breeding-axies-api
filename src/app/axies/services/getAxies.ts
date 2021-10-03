/* eslint-disable no-loop-func */
import { AxieGene } from 'agp-npm/dist/axie-gene';
import { PartGene } from 'agp-npm/dist/models/part';
import { Axie, BreakdownPurity, PlainAxie, PlainAxieResult } from '../../../types/axies.types';
import { calculateBreakdownPurity } from '../../../utils/calculatePurity';
import axios from 'axios';
import buildQuery from './buildQuery';
import getParts from '../../../utils/getParts';
import { GetAxiesRequest, PartsAndSpecies } from '../../../types/getAxiesRequest.types';

const endpoint = 'https://axieinfinity.com/graphql-server-v2/graphql';
const breedCount = [0];

export const getAxies: GetAxiesRequest = async (include, _parts, omit): Promise<Axie[]> => {
  const { Back, Horn, Mouth, Tail } = _parts
  const parts = getParts({
    Back: include.Back,
    Horn: include.Horn,
    Mouth: include.Mouth,
    Tail: include.Tail
  });
  const body = {
    operationName: 'GetAxieBriefList',
    variables: {
      criteria: { classes: include.species, breedCount, parts },
    },
    query: buildQuery(),
  };
  const res: PlainAxieResult = await axios.post(endpoint, body);
  const axiesWithGenes: Axie[] = res
    .data
    .data
    .ax0
    .results
    .map((plainAxie) => {
      // if (plainAxie.genes.length === 0) return null;
      const genes = new AxieGene(plainAxie.genes);
      let breakdownPurity: BreakdownPurity | undefined
      let purity: number = 0
      if (
        !Array.isArray(Back)
        && !Array.isArray(Horn)
        && !Array.isArray(Mouth)
        && !Array.isArray(Tail)
      ) {
        breakdownPurity = calculateBreakdownPurity(genes, {
          Back: Array.isArray(Back) ? Back[0] : Back,
          Horn: Array.isArray(Horn) ? Horn[0] : Horn,
          Mouth: Array.isArray(Mouth) ? Mouth[0] : Mouth,
          Tail: Array.isArray(Tail) ? Tail[0] : Tail,
          ...omit,
        });
        purity = breakdownPurity.purity;
      }
      return {
        id: plainAxie.id,
        price: plainAxie.auction.currentPrice,
        genes,
        purity,
        breakdownPurity: breakdownPurity as BreakdownPurity,
      }
    }) as Axie[];
  return axiesWithGenes;
};



export default getAxies;
