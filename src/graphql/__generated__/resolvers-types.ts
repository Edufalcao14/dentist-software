import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import { UserEntity } from '../../entities/user/user';
import { DentistEntity } from '../../entities/dentist/dentist';
import { PatientEntity } from '../../entities/patient/patient';
import { MeEntity } from '../../entities/auth/me';
import { AuthTokensEntity } from '../../entities/auth/auth-tokens';
import { AppContext } from '../../libs/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  Email: { input: any; output: any };
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type AuthTokens = {
  __typename?: 'AuthTokens';
  accessToken: Scalars['String']['output'];
  expiredAt: Scalars['DateTime']['output'];
  refreshToken: Scalars['String']['output'];
};

export type CreateDentistInput = {
  clinic_id?: InputMaybe<Scalars['String']['input']>;
  cro_number: Scalars['String']['input'];
  email: Scalars['Email']['input'];
  firstname: Scalars['String']['input'];
  is_active: Scalars['Boolean']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone_number: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
  specialization?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePatientInput = {
  birthdate: Scalars['DateTime']['input'];
  civil_state?: InputMaybe<Scalars['String']['input']>;
  cpf: Scalars['String']['input'];
  email?: InputMaybe<Scalars['Email']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
};

export type Dentist = {
  __typename?: 'Dentist';
  clinic_id?: Maybe<Scalars['String']['output']>;
  cro_number: Scalars['String']['output'];
  id: Scalars['String']['output'];
  is_active: Scalars['Boolean']['output'];
  role: Scalars['String']['output'];
  specialization: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export enum DentistRole {
  Admin = 'Admin',
  Owner = 'Owner',
  Hired = 'hired',
}

export type Me = {
  __typename?: 'Me';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  dentist?: Maybe<Dentist>;
  displayName: Scalars['String']['output'];
  email: Scalars['Email']['output'];
  externalId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  patient?: Maybe<Patient>;
  teamId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createDentist: Dentist;
  createPatient: Patient;
  deleteDentist: Dentist;
  deletePatient: Patient;
  refreshToken: AuthTokens;
  signIn: AuthPayload;
  updateDentist: Dentist;
  updatePatient: Patient;
};

export type MutationCreateDentistArgs = {
  input: CreateDentistInput;
};

export type MutationCreatePatientArgs = {
  input: CreatePatientInput;
};

export type MutationDeleteDentistArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeletePatientArgs = {
  id: Scalars['String']['input'];
};

export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput;
};

export type MutationSignInArgs = {
  input: SignInInput;
};

export type MutationUpdateDentistArgs = {
  id: Scalars['String']['input'];
  input: UpdateDentistInput;
};

export type MutationUpdatePatientArgs = {
  id: Scalars['String']['input'];
  input: UpdatePatientInput;
};

export type Patient = {
  __typename?: 'Patient';
  birthdate: Scalars['DateTime']['output'];
  civil_state?: Maybe<Scalars['String']['output']>;
  cpf?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  getAllPatients: Array<Patient>;
  getDentistByEmail: Dentist;
  getDentistById: Dentist;
  getMe: Me;
  getPatientByCpf: Patient;
  getPatientByEmail: Patient;
  getPatientById: Patient;
};

export type QueryGetAllPatientsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGetDentistByEmailArgs = {
  email: Scalars['Email']['input'];
};

export type QueryGetDentistByIdArgs = {
  id: Scalars['String']['input'];
};

export type QueryGetPatientByCpfArgs = {
  cpf: Scalars['String']['input'];
};

export type QueryGetPatientByEmailArgs = {
  email: Scalars['Email']['input'];
};

export type QueryGetPatientByIdArgs = {
  id: Scalars['String']['input'];
};

export type RefreshTokenInput = {
  refreshToken: Scalars['String']['input'];
};

export type SignInInput = {
  email: Scalars['Email']['input'];
  password: Scalars['String']['input'];
};

export type UpdateDentistInput = {
  clinic_id?: InputMaybe<Scalars['String']['input']>;
  cro_number?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['Email']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  specialization?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePatientInput = {
  birthdate?: InputMaybe<Scalars['DateTime']['input']>;
  civil_state?: InputMaybe<Scalars['String']['input']>;
  cpf?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['Email']['output'];
  external_id?: Maybe<Scalars['String']['output']>;
  firstname: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastname: Scalars['String']['output'];
  phone_number: Scalars['String']['output'];
  role: UserRole;
};

export enum UserRole {
  Dentist = 'dentist',
  Patient = 'patient',
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthPayload: ResolverTypeWrapper<
    Omit<AuthPayload, 'user'> & { user: ResolversTypes['User'] }
  >;
  AuthTokens: ResolverTypeWrapper<AuthTokensEntity>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateDentistInput: CreateDentistInput;
  CreatePatientInput: CreatePatientInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Dentist: ResolverTypeWrapper<DentistEntity>;
  DentistRole: DentistRole;
  Email: ResolverTypeWrapper<Scalars['Email']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Me: ResolverTypeWrapper<MeEntity>;
  Mutation: ResolverTypeWrapper<{}>;
  Patient: ResolverTypeWrapper<PatientEntity>;
  Query: ResolverTypeWrapper<{}>;
  RefreshTokenInput: RefreshTokenInput;
  SignInInput: SignInInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateDentistInput: UpdateDentistInput;
  UpdatePatientInput: UpdatePatientInput;
  User: ResolverTypeWrapper<UserEntity>;
  UserRole: UserRole;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthPayload: Omit<AuthPayload, 'user'> & {
    user: ResolversParentTypes['User'];
  };
  AuthTokens: AuthTokensEntity;
  Boolean: Scalars['Boolean']['output'];
  CreateDentistInput: CreateDentistInput;
  CreatePatientInput: CreatePatientInput;
  DateTime: Scalars['DateTime']['output'];
  Dentist: DentistEntity;
  Email: Scalars['Email']['output'];
  Int: Scalars['Int']['output'];
  Me: MeEntity;
  Mutation: {};
  Patient: PatientEntity;
  Query: {};
  RefreshTokenInput: RefreshTokenInput;
  SignInInput: SignInInput;
  String: Scalars['String']['output'];
  UpdateDentistInput: UpdateDentistInput;
  UpdatePatientInput: UpdatePatientInput;
  User: UserEntity;
}>;

export type AuthPayloadResolvers<
  ContextType = AppContext,
  ParentType extends
    ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload'],
> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthTokensResolvers<
  ContextType = AppContext,
  ParentType extends
    ResolversParentTypes['AuthTokens'] = ResolversParentTypes['AuthTokens'],
> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiredAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DentistResolvers<
  ContextType = AppContext,
  ParentType extends
    ResolversParentTypes['Dentist'] = ResolversParentTypes['Dentist'],
> = ResolversObject<{
  clinic_id?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  cro_number?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  is_active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specialization?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface EmailScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Email'], any> {
  name: 'Email';
}

export type MeResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes['Me'] = ResolversParentTypes['Me'],
> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  dentist?: Resolver<Maybe<ResolversTypes['Dentist']>, ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['Email'], ParentType, ContextType>;
  externalId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  patient?: Resolver<Maybe<ResolversTypes['Patient']>, ParentType, ContextType>;
  teamId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = AppContext,
  ParentType extends
    ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createDentist?: Resolver<
    ResolversTypes['Dentist'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateDentistArgs, 'input'>
  >;
  createPatient?: Resolver<
    ResolversTypes['Patient'],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePatientArgs, 'input'>
  >;
  deleteDentist?: Resolver<
    ResolversTypes['Dentist'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteDentistArgs, 'id'>
  >;
  deletePatient?: Resolver<
    ResolversTypes['Patient'],
    ParentType,
    ContextType,
    RequireFields<MutationDeletePatientArgs, 'id'>
  >;
  refreshToken?: Resolver<
    ResolversTypes['AuthTokens'],
    ParentType,
    ContextType,
    RequireFields<MutationRefreshTokenArgs, 'input'>
  >;
  signIn?: Resolver<
    ResolversTypes['AuthPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationSignInArgs, 'input'>
  >;
  updateDentist?: Resolver<
    ResolversTypes['Dentist'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateDentistArgs, 'id' | 'input'>
  >;
  updatePatient?: Resolver<
    ResolversTypes['Patient'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePatientArgs, 'id' | 'input'>
  >;
}>;

export type PatientResolvers<
  ContextType = AppContext,
  ParentType extends
    ResolversParentTypes['Patient'] = ResolversParentTypes['Patient'],
> = ResolversObject<{
  birthdate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  civil_state?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  cpf?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = AppContext,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  getAllPatients?: Resolver<
    Array<ResolversTypes['Patient']>,
    ParentType,
    ContextType,
    Partial<QueryGetAllPatientsArgs>
  >;
  getDentistByEmail?: Resolver<
    ResolversTypes['Dentist'],
    ParentType,
    ContextType,
    RequireFields<QueryGetDentistByEmailArgs, 'email'>
  >;
  getDentistById?: Resolver<
    ResolversTypes['Dentist'],
    ParentType,
    ContextType,
    RequireFields<QueryGetDentistByIdArgs, 'id'>
  >;
  getMe?: Resolver<ResolversTypes['Me'], ParentType, ContextType>;
  getPatientByCpf?: Resolver<
    ResolversTypes['Patient'],
    ParentType,
    ContextType,
    RequireFields<QueryGetPatientByCpfArgs, 'cpf'>
  >;
  getPatientByEmail?: Resolver<
    ResolversTypes['Patient'],
    ParentType,
    ContextType,
    RequireFields<QueryGetPatientByEmailArgs, 'email'>
  >;
  getPatientById?: Resolver<
    ResolversTypes['Patient'],
    ParentType,
    ContextType,
    RequireFields<QueryGetPatientByIdArgs, 'id'>
  >;
}>;

export type UserResolvers<
  ContextType = AppContext,
  ParentType extends
    ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = ResolversObject<{
  email?: Resolver<ResolversTypes['Email'], ParentType, ContextType>;
  external_id?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone_number?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = AppContext> = ResolversObject<{
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  AuthTokens?: AuthTokensResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Dentist?: DentistResolvers<ContextType>;
  Email?: GraphQLScalarType;
  Me?: MeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Patient?: PatientResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;
