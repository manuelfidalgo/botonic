import * as contentful from 'contentful'
import { CreateClientParams, Entry } from 'contentful'
import {
  CmsException,
  CommonFields,
  ContentType,
  Context,
  FollowUp,
  SearchableBy,
} from '../cms'
import {
  SearchableByKeywordsDelivery,
  SearchableByKeywordsFields,
} from './search/searchable-by'
import { DateRangeDelivery, DateRangeFields } from './contents/date-range'
import { ReducedClientApi } from './delivery/client-api'
import { ContentfulOptions } from '../plugin'

/**
 * https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/
 */
export interface DeliveryApi {
  getAsset(id: string, context: Context, query?: any): Promise<contentful.Asset>

  getAssets(context: Context, query?: any): Promise<contentful.AssetCollection>

  getEntry<T>(
    id: string,
    context: Context,
    query?: any
  ): Promise<contentful.Entry<T>>

  getEntries<T>(
    context: Context,
    query?: any
  ): Promise<contentful.EntryCollection<T>>

  getContentType(id: string): Promise<contentful.ContentType>
}

/**
 * Manages the {@link Context}, parses Content's Id and ContentType from the Contentful entries...
 */
export class AdaptorDeliveryApi implements DeliveryApi {
  constructor(
    readonly client: ReducedClientApi,
    readonly options: ContentfulOptions
  ) {}

  async getAsset(
    id: string,
    context: Context,
    query?: any
  ): Promise<contentful.Asset> {
    return this.client.getAsset(id, this.queryFromContext(context, query))
  }

  async getAssets(
    context: Context,
    query?: any
  ): Promise<contentful.AssetCollection> {
    return this.client.getAssets(this.queryFromContext(context, query))
  }

  async getEntry<T>(
    id: string,
    context: Context,
    query: any = {}
  ): Promise<contentful.Entry<T>> {
    return this.client.getEntry<T>(id, this.queryFromContext(context, query))
  }

  async getEntries<T>(
    context: Context,
    query: any = {}
  ): Promise<contentful.EntryCollection<T>> {
    return this.client.getEntries<T>(this.queryFromContext(context, query))
  }

  async getContentType(id: string): Promise<contentful.ContentType> {
    try {
      return this.client.getContentType(id)
    } catch (e) {
      console.error(`ERROR in getContentType for id ${id}:`, e)
      throw e
    }
  }

  private queryFromContext(context: Context, query: any = {}): any {
    const locale = this.options.cmsLocale
      ? this.options.cmsLocale(context.locale)
      : context.locale
    if (locale) {
      query['locale'] = locale
    }
    return query
  }
}

export interface ContentWithNameFields {
  // The content code (eg. PRE_FAQ1) Not called Id to differentiate from contentful automatic Id
  name: string
}

export interface CommonEntryFields extends ContentWithNameFields {
  // Useful to display in buttons or reports
  shortText?: string
  keywords?: string[]
  searchableBy?: contentful.Entry<SearchableByKeywordsFields>[]
  partitions?: string[]
  dateRange?: contentful.Entry<DateRangeFields>
  followup?: contentful.Entry<FollowUpFields>
}
export type FollowUpFields = CommonEntryFields

export class ContentfulEntryUtils {
  static getContentModel<T extends ContentType = ContentType>(
    entry: contentful.Entry<any>
  ): T {
    // https://blog.oio.de/2014/02/28/typescript-accessing-enum-values-via-a-string/
    if (!entry.sys.contentType) {
      throw new CmsException(
        `Entry '${entry.sys.id}' not fully loaded or referencing a deleted content`
      )
    }
    const typ = entry.sys.contentType.sys.id
    return typ as T
  }

  static commonFieldsFromEntry(
    entry: Entry<CommonEntryFields>,
    followUp?: FollowUp
  ): CommonFields {
    const fields = entry.fields

    const searchableBy =
      fields.searchableBy &&
      new SearchableBy(
        fields.searchableBy.map(searchableBy =>
          SearchableByKeywordsDelivery.fromEntry(searchableBy)
        )
      )

    const dateRange =
      fields.dateRange && DateRangeDelivery.fromEntry(fields.dateRange)

    return new CommonFields(entry.sys.id, fields.name || '', {
      keywords: fields.keywords,
      shortText: fields.shortText,
      partitions: fields.partitions,
      searchableBy,
      dateRange,
      followUp,
    })
  }
}

export function createContentfulClientApi(
  options: ContentfulOptions
): contentful.ContentfulClientApi {
  const params: CreateClientParams = {
    space: options.spaceId,
    accessToken: options.accessToken,
    timeout: options.timeoutMs,
  }
  if (options.environment) {
    params.environment = options.environment
  }
  const client = contentful.createClient(params)
  return client
}
