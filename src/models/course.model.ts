import {Entity, model, property, hasMany} from '@loopback/repository';
import {Students} from './students.model';

@model()
export class Course extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  id: number;

  @hasMany(() => Students)
  students: Students[];

  constructor(data?: Partial<Course>) {
    super(data);
  }
}

export interface CourseRelations {
  // describe navigational properties here
}

export type CourseWithRelations = Course & CourseRelations;
