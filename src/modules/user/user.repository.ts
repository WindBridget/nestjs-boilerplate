import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'common/repository/base.repository';
import { Role } from 'modules/user/schemas/role.schema';
import { User } from 'modules/user/schemas/user.schema';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectModel(User) private readonly userModel: ModelType<User>,
    @InjectModel(Role) private readonly roleModel: ModelType<Role>,
  ) {
    super(userModel);
  }

  async findAllId(): Promise<string[]> {
    const users = await this.userModel.find().select({ _id: 1 });
    return users.map((user) => user._id);
  }

  async findOne(opts: any = {}) {
    return await this.userModel.findOne(opts);
  }

  async addRole(userId: string, roleName: string) {
    const user = await this.findOneById(userId);

    // Only add the role if the user doesn't already have it
    const existingRole =
      user.roles && user.roles.find((role) => role.name === roleName);
    if (existingRole) {
      // If they have the role already, make sure its enabled here
      this.logger.log(`User: ${user.email} already has role: ${roleName}`);
      existingRole.enabled = true;
      user.markModified('roles');
      return await user.save();
    }

    user.roles.push(new this.roleModel({ name: roleName, enabled: true }));
    user.markModified('roles');
    return await user.save();
  }

  async disableRole(userId: string, roleName: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId, 'roles.name': roleName },
      {
        $set: {
          'roles.$.enabled': false,
        },
      },
      // Return the doc after the update
      { new: true },
    );
  }

  async findAllAndPaginateAllUser(perpage, currentpage): Promise<User[]> {
    return await this.userModel
      .find()
      .limit(perpage)
      .skip(perpage * currentpage);
  }

  async countUsers(): Promise<number> {
    return await this.userModel.estimatedDocumentCount();
  }
}
