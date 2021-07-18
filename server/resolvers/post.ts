import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";

@Resolver()
export class PostResolver {
  // find array of Post
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext
  ) : Promise<Post[]> {
    return em.find(Post, {}); // this returns Promise<Post[]> type that we already converted into graphql
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number, // find this id from Post
    @Ctx() { em }: MyContext
  ) : Promise<Post | null> {
    return em.findOne(Post, { id });
  }


  // Mutations => add data
  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string, // find this id from Post
    @Ctx() { em }: MyContext
  ) : Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ) : Promise<Post | null > {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    // if title is not undefined, it updates the value
    if (typeof title != 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Post)
  async deletePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) // title: string,
    @Ctx() { em }: MyContext
  ) : Promise< boolean > {

    await em.nativeDelete(Post, { id });
    return true;
  }
}