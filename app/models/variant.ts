import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Attribute from '#models/attribute'
import Product from '#models/product'
import VariantImage from '#models/variant_image'

export default class Variant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productId: number | undefined

  @column()
  declare attributeId: number | undefined

  @column()
  declare sku_id: string

  @column()
  declare attribute_value: string

  @column()
  declare price: number

  @column()
  declare regular_price: number | null

  @column()
  declare status: boolean

  @column()
  declare sale_price: number | null

  @column()
  declare date_on_sale_from: DateTime | null

  @column()
  declare date_on_sale_to: DateTime | null

  @column()
  declare on_sale: Boolean

  @column()
  declare stock_quantity: number | null

  @column()
  declare stock_status: string

  @column()
  declare rating: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Attribute)
  declare attributes: BelongsTo<typeof Attribute>

  @belongsTo(() => Product)
  declare products: BelongsTo<typeof Product>

  @hasMany(() => VariantImage)
  declare images: HasMany<typeof VariantImage>
}
