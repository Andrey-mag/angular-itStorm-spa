export type CommentType = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  action?:string | null,
  user: {
    id: string,
    name: string
  }
}


