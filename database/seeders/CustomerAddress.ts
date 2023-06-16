import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import CustomerAddress from 'App/Models/CustomerAddress';

export default class extends BaseSeeder {
  public async run() {
    await CustomerAddress.createMany([
      {
        customerId: 1,
        address_type: 'shipping',
        phoneNumber: '123456789',
        firstName: 'customer',
        lastName: '1',
        address_1: 'address 1',
        address_2: 'address 2',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
      {
        customerId: 2,
        address_type: 'shipping',
        phoneNumber: '123456789',
        firstName: 'customer',
        lastName: '1',
        address_1: 'address 1',
        address_2: 'address 2',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
      {
        customerId: 1,
        address_type: 'billing',
        phoneNumber: '123456789',
        firstName: 'customer',
        lastName: '1',
        address_1: 'address 1',
        address_2: 'address 2',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
      {
        customerId: 2,
        address_type: 'billing',
        phoneNumber: '123456789',
        firstName: 'customer',
        lastName: '1',
        address_1: 'address 1',
        address_2: 'address 2',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
    ]);
  }
}
