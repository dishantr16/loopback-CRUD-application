import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Course, CourseRelations, Students} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {StudentsRepository} from './students.repository';

export class CourseRepository extends DefaultCrudRepository<
  Course,
  typeof Course.prototype.id,
  CourseRelations
> {

  public readonly students: HasManyRepositoryFactory<Students, typeof Course.prototype.id>;

  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
    @repository.getter('StudentsRepository')
    protected studentsRepositoryGetter: Getter<StudentsRepository>,
  ) {
    super(Course, dataSource);
    this.students = this.createHasManyRepositoryFactoryFor('students', studentsRepositoryGetter,);
    this.registerInclusionResolver('students', this.students.inclusionResolver);
  }
}
