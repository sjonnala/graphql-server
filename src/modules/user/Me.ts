import { Resolver, Query, Ctx } from "type-graphql";

import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    console.log(ctx.req.session);

    if (!ctx.req.session) {
      return undefined;
    }

    return User.findOne(ctx.req.session.id);
  }
}
