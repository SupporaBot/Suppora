import { Database as DB } from "./supabase";

export type Database = DB
export type DatabaseTable = keyof Database['public']['Tables']
// @ts-expect-error
export type DatabaseRow<T = DatabaseTable> = Database['public']['Tables'][T]['Row']
