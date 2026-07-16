import { BaseRepository } from './BaseRepository';
import type { Course } from '../../types';

class CourseRepository extends BaseRepository {
  constructor() {
    super('courses');
  }

  async findAllCourses(): Promise<Course[]> {
    return this.findAll<Course>({ orderBy: { column: 'created_at', ascending: false } });
  }

  async findByCategory(category: string): Promise<Course[]> {
    return this.findByColumn<Course>('category', category);
  }
}

export const courseRepository = new CourseRepository();
