import { Resolvers } from '../__generated__/resolvers-types';
import { initScalars } from './scalars';

export const initResolvers = (): Resolvers => {
  return {
    ...initScalars(),
    Query: {},
    Mutation: {},
  };
};
