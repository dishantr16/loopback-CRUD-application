import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Course,
  Students,
} from '../models';
import {CourseRepository} from '../repositories';

export class CourseStudentsController {
  constructor(
    @repository(CourseRepository) protected courseRepository: CourseRepository,
  ) { }

  @get('/courses/{id}/students', {
    responses: {
      '200': {
        description: 'Array of Course has many Students',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Students)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Students>,
  ): Promise<Students[]> {
    return this.courseRepository.students(id).find(filter);
  }

  @post('/courses/{id}/students', {
    responses: {
      '200': {
        description: 'Course model instance',
        content: {'application/json': {schema: getModelSchemaRef(Students)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Course.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Students, {
            title: 'NewStudentsInCourse',
            optional: ['courseId']
          }),
        },
      },
    }) students: Omit<Students, 'id'>,
  ): Promise<Students> {
    return this.courseRepository.students(id).create(students);
  }

  @patch('/courses/{id}/students', {
    responses: {
      '200': {
        description: 'Course.Students PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Students, {partial: true}),
        },
      },
    })
    students: Partial<Students>,
    @param.query.object('where', getWhereSchemaFor(Students)) where?: Where<Students>,
  ): Promise<Count> {
    return this.courseRepository.students(id).patch(students, where);
  }

  @del('/courses/{id}/students', {
    responses: {
      '200': {
        description: 'Course.Students DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Students)) where?: Where<Students>,
  ): Promise<Count> {
    return this.courseRepository.students(id).delete(where);
  }
}
