import { IResolvers } from 'graphql-tools/dist/Interfaces'
import {
  delegateToSchema,
  makeExecutableSchema,
  makeRemoteExecutableSchema,
} from 'graphql-tools'
import {
  GraphQLSchema,
  GraphQLResolveInfo,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLScalarType,
  buildSchema,
  GraphQLAbstractType,
} from 'graphql'
import * as fs from 'fs'
import * as path from 'path'
import YelpLink from './YelpLink'

export class Yelp {
  schema: GraphQLSchema

  constructor(apiKey: string) {
    const typeDefs = fs.readFileSync(
      path.join(__dirname, '..', 'schema', 'yelp.graphql'),
      { encoding: 'utf8' },
    )

    const link = new YelpLink(apiKey)

    this.schema = makeRemoteExecutableSchema({
      schema: typeDefs,
      link,
    })
  }

  delegate(
    operation: 'query' | 'mutation',
    fieldName: string,
    args: { [key: string]: any },
    context: any,
    info: GraphQLResolveInfo,
  ) {
    return delegateToSchema(
      this.schema,
      {},
      operation,
      fieldName,
      args,
      context,
      info,
    )
  }

  remoteResolvers(filterSchema?: GraphQLSchema | string): IResolvers {
    const typeMap = this.schema.getTypeMap()

    if (filterSchema && typeof filterSchema === 'string') {
      filterSchema = buildSchema(filterSchema)
    }
    const filterTypeMap =
      filterSchema instanceof GraphQLSchema
        ? filterSchema.getTypeMap()
        : typeMap
    const filterType = typeName => typeName in filterTypeMap

    const resolvers = {}
    Object.keys(typeMap)
      .filter(filterType)
      .forEach(typeName => {
        const type = typeMap[typeName]
        if (
          type instanceof GraphQLUnionType ||
          type instanceof GraphQLInterfaceType
        ) {
          resolvers[typeName] = {
            __resolveType: type.resolveType,
          }
        } else if (type instanceof GraphQLScalarType) {
          resolvers[typeName] = type
        }
      })

    return resolvers
  }
}
