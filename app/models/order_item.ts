import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number | null

  @column()
  declare product_id: number

  @column()
  declare variant_id: number

  @column()
  declare product_sku: string

  @column()
  declare product_title: string

  @column()
  declare quantity: number

  @column()
  declare product_price: string

  @column()
  declare subtotal: string

  @column()
  declare product_image: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
