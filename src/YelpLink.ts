import { FetchOptions, HttpLink } from 'apollo-link-http'
import * as fetch from 'cross-fetch'

export default class GitHubLink extends HttpLink {
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error(
        'No Yelp API key provided. You’ll need to create a client, join the beta program, and grab the API key from your client settings.',
      )
    }
    super({
      uri: 'https://api.yelp.com/v3/graphql',
      headers: { Authorization: `bearer ${apiKey}` },
      fetch,
    })
  }
}

