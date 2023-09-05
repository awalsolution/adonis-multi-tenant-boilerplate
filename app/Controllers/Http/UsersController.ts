import { BaseController } from 'App/Controllers/BaseController';
import User from 'App/Models/User';
import HttpCodes from 'App/Enums/HttpCodes';
import ResponseMessages from 'App/Enums/ResponseMessages';

export default class UsersController extends BaseController {
  public MODEL: typeof User;

  constructor() {
    super();
    this.MODEL = User;
  }

  // find all users  list
  public async findAllRecords({ auth, request, response }) {
    const user = auth.user!;
    let DQ = this.MODEL.query().whereNot('id', user.id);

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%');
    }

    if (!this.isSuperAdmin(user)) {
      DQ = DQ.where('shop_id', user.shopId!);
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Users Not Found',
      });
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions')
          .preload('roles', (PQ) => {
            PQ.preload('permissions');
          })
          .preload('profile')
          .preload('shop')
          .paginate(page, pageSize),
        message: 'Users find Successfully',
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions')
          .preload('roles', (PQ) => {
            PQ.preload('permissions');
          })
          .preload('profile')
          .preload('shop'),
        message: 'Users find Successfully',
      });
    }
  }

  // find single user by id
  public async findSingleRecord({ request, response }) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('permissions')
        .preload('roles', (RQ) => {
          RQ.where('name', '!=', 'super admin') // Exclude the "super admin" role
            .preload('permissions');
        })
        .preload('profile')
        .preload('shop')
        .first();

      if (data) {
        delete data.$attributes.password;
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'User find Successfully!',
        result: data,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ code: HttpCodes.SERVER_ERROR, message: e.toString() });
    }
  }

  // create new user
  public async create({ auth, request, response }) {
    const currentUser = auth.user!;
    try {
      let userExists = await this.MODEL.findBy('email', request.body().email);
      if (userExists && !userExists.isEmailVerified) {
        delete userExists.$attributes.password;

        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Provided Email: ' ${request.body().email} ' Already exists`,
        });
      }

      const user = new this.MODEL();
      if (this.isSuperAdmin(currentUser)) {
        user.shopId = request.body().shop_id;
      } else {
        user.shopId = currentUser.shopId;
      }
      user.email = request.body().email;
      user.status = request.body().status;
      user.password = request.body().password;

      await user.save();
      user.related('roles').sync(request.body().roles);
      user.related('profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
      });

      delete user.$attributes.password;
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'User Register Successfully!',
        result: user,
      });
    } catch (e) {
      console.log('register error', e.toString());
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // update user
  public async update({ auth, request, response }) {
    const currentUser = auth.user!;
    const user = await this.MODEL.findBy('id', request.param('id'));
    if (!user) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User Not Found',
      });
    }

    if (this.isSuperAdmin(currentUser)) {
      user.shopId = request.body().shop_id;
    } else {
      user.shopId = currentUser.shopId;
    }

    user.email = request.body().email;
    user.status = request.body().status;

    await user.save();
    user.related('permissions').sync(request.body().permissions);
    user.related('roles').sync(request.body().roles);

    delete user.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User Update successfully.',
      result: user,
    });
  }
  // assign permission to user
  public async assignPermission({ auth, request, response }) {
    const currentUser = auth.user!;
    const user = await this.MODEL.findBy('id', request.param('id'));
    if (!user) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User Not Found',
      });
    }

    if (this.isSuperAdmin(currentUser)) {
      user.shopId = request.body().shop_id;
    } else {
      user.shopId = currentUser.shopId;
    }

    await user.save();
    user.related('permissions').sync(request.body().permissions);

    delete user.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Assigned Permissions successfully.',
      result: user,
    });
  }

  // update user profile
  public async profileUpdate({ request, response }) {
    const user = await this.MODEL.findBy('id', request.param('id'));
    if (!user) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User Not Found',
      });
    }
    user.related('profile').updateOrCreate(
      {},
      {
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
        address: request.body().address,
        city: request.body().city,
        country: request.body().country,
        profile_picture: request.body().profile_picture,
      }
    );

    delete user.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User Profile Update successfully.',
      result: user,
    });
  }

  // delete single user using id
  public async destroy({ request, response }) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User not found',
      });
    }
    await data.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'User deleted successfully' },
    });
  }

  // auth user
  public async authenticated({ auth, response }) {
    const authenticatedUser = auth.user;
    if (!authenticatedUser) {
      return response.unauthorized({ message: ResponseMessages.UNAUTHORIZED });
    }
    delete authenticatedUser.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User find Successfully',
      result: auth.user,
    });
  }
}
