import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from 'argon2';

// ここにClassを定義するとResolverの中が見やすくなる
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}


@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse{
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];


  @Field(() => User, { nullable: true })
  user?: User;
}

// Resolverではinputされるデータの取り扱い方を定義する
@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput ) options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {

    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2!",
          }
        ]
      }
    }

    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "length of password must be greater than 3!",
          }
        ]
      }
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, { username: options.username, password: hashedPassword });

    try {
      await em.persistAndFlush(user);
    } catch(e) {
      // handle duplocate usename error here
      if (e.code === '23505') {
        return {
          errors: [{
            field: "username",
            message: "username is already taken...",
          },
        ],
        };
      }
      console.log('message: ', e);
    }
    return {
      user,
    };
  }


  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UsernamePasswordInput ) options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) : Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "the username does not exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
      errors: [
        {
          field: "password",
          message: "incorrect password",
        },
      ],
    };
    }

    // ObjectTypeをreturnする
    return {
      user,
    };
  }


}