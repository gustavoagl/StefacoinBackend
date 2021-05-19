import Professor from '../entities/professor.entity';
import cursoRepository from '../repositories/curso.repository';
import professorRepository from '../repositories/professor.repository';
import ProfessorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import Exception from '../utils/exceptions/exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class ProfessorController {
  async obterPorId(id: number): Promise<Professor> {
    Validador.validarParametros([{ id }]);
    return await ProfessorRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Professor> = {}): Promise<Professor> {
    return await ProfessorRepository.obter(filtro);
  }

  // #pegabandeira  resolved
  async listar(filtro: FilterQuery<Professor> = {}): Promise<Professor[]> {
    const professores = await ProfessorRepository.listar({ tipo: 1 });
    // const cursos = await cursoRepository.listar();

    for (let i = 0; i < professores.length; i++) {
      const cursos = await cursoRepository.obterCursoPorIdProf(professores[i].id);
      professores[i].cursos = cursos;
      console.log(cursos);
    }

    return professores;
  }

  // #pegabandeira resolved
  async incluir(professor: Professor) {
    const { nome, email, senha } = professor;
    Validador.validarParametros([{ nome }, { email }, { senha }]);
    professor.tipo = 1;

    const usuarioRepetido: Professor[] = await new ProfessorController().listar({ nome: { $eq: nome } });
    const emailRepetido: Professor[] = await new ProfessorController().listar({ email: { $eq: email } });
    if (!usuarioRepetido.length && !emailRepetido.length) {
      const id = await ProfessorRepository.incluir(professor);
      return new Mensagem('Professor incluido com sucesso!', {
        id,
      });
    } else {
      throw new Exception('Nome ou email ja existente!')
    }
  }

  async alterar(idProf: number, professor: Professor) {
    console.log(idProf)
    const { id, nome, email, senha, tipo } = professor;

    professor.id = idProf;

    Validador.validarParametros([{ idProf }, { nome }, { email }, { senha }, { tipo }]);
    console.log("Professor: ", professor)
    await professorRepository.alterar({ id }, professor)
    await professorRepository.alterar({ senha }, professor)

    return new Mensagem('Professor alterado com sucesso!', {

      idProf,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id },]);
    const cursos = await cursoRepository.obterCursoPorIdProf(id);

    if (cursos.length !== 0) {
      throw new Exception('Nao pode ser excluido,pois esta cadastrado em um curso!')
    } else {
      await ProfessorRepository.excluir({ id });
      return new Mensagem('Professor excluido com sucesso!', {
        id,
      });
    }

  }
}
