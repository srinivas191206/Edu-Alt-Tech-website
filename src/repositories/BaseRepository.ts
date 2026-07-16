import { supabase } from '../../lib/supabase';

export class BaseRepository {
  protected table: string;

  constructor(table: string) {
    this.table = table;
  }

  protected get client() {
    return supabase.from(this.table);
  }

  async findAll<T = Record<string, unknown>>(options?: {
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }): Promise<T[]> {
    let query = this.client.select('*');
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch ${this.table}: ${error.message}`);
    return (data ?? []) as unknown as T[];
  }

  async findById<T = Record<string, unknown>>(id: string): Promise<T | null> {
    const { data, error } = await this.client.select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(`Failed to fetch ${this.table}: ${error.message}`);
    return data as unknown as T | null;
  }

  async findByColumn<T = Record<string, unknown>>(column: string, value: string): Promise<T[]> {
    const { data, error } = await this.client.select('*').eq(column, value);
    if (error) throw new Error(`Failed to fetch ${this.table}: ${error.message}`);
    return (data ?? []) as unknown as T[];
  }

  async create<T extends Record<string, unknown>>(item: T): Promise<{ id: string }> {
    const { data, error } = await this.client.insert(item).select('id').single();
    if (error) throw new Error(`Failed to create in ${this.table}: ${error.message}`);
    return { id: data?.id ?? '' };
  }

  async update(id: string, updates: Record<string, unknown>): Promise<void> {
    const { error } = await this.client.update(updates).eq('id', id);
    if (error) throw new Error(`Failed to update ${this.table}: ${error.message}`);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.delete().eq('id', id);
    if (error) throw new Error(`Failed to delete from ${this.table}: ${error.message}`);
  }
}
