import Professor from '../entities/professor.entity';
import { FilterQuery } from '../utils/database/database';
import { Tables } from '../utils/tables.enum';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
import { Validador } from '../utils/utils';
import Repository from './repository';
import CursoRepository from './curso.repository'

class ProfessorRepository extends Repository<Professor> {
  constructor() {
    super(Tables.USUARIO);
  }

  async incluir(professor: Professor) {
    professor.senha = Validador.criptografarSenha(professor.senha);
    professor.tipo = TipoUsuario.PROFESSOR;

    return super.incluir(professor);
  }

  async alterar(filtro: FilterQuery<Professor>, professor: Professor) {
    
 
    if (filtro.senha) {
      console.log("entrou pra salvar:",filtro.senha,professor.id)
      professor.senha = Validador.criptografarSenha(professor.senha);
  }
    return super.alterar(filtro, professor);
  }

}

export default new ProfessorRepository();
