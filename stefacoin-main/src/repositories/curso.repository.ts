import Curso from '../entities/curso.entity';
import { Tables } from '../utils/tables.enum';
import Repository from './repository';


class CursoRepository extends Repository<Curso> {

  async obterCursoPorIdProf(id: number): Promise<Curso[]> {
    console.log(id);
    return this.listar({ idProfessor: id });

  }

  async obterCursoPorIdAluno(id: number): Promise<Curso[]> {
    console.log(id);
    return this.listar({ idAluno: id });

  }


  constructor() {
    super(Tables.CURSO);
  }
}

export default new CursoRepository();
