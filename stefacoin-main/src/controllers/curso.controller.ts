import Curso from '../entities/curso.entity';
import cursoRepository from '../repositories/curso.repository';
import CursoRepository from '../repositories/curso.repository';
import { FilterQuery } from '../utils/database/database';
import Exception from '../utils/exceptions/exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class CursoController {
  async obterPorId(id: number): Promise<Curso> {
    Validador.validarParametros([{ id }]);
    return await CursoRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Curso> = {}): Promise<Curso> {
    return await CursoRepository.obter(filtro);
  }

  async listar(filtro: FilterQuery<Curso> = {}): Promise<Curso[]> {
    return await CursoRepository.listar(filtro);
  }
  //Regra nome repetido validar campos
  async incluir(curso: Curso) {
    const { nome, descricao, aulas, idProfessor } = curso;
    Validador.validarParametros([{ nome }, { descricao }, { idProfessor }]);
    const CursoRepetido: Curso[] = await new CursoController().listar({ nome: { $eq: nome } });

    if (!CursoRepetido) {
      const id = await CursoRepository.incluir(curso);
      return new Mensagem('Aula incluido com sucesso!', {
        id,
      });
    } else {
      throw new Exception('Nome ja existente!')
    }


  }
  async alterar(id: number, curso: Curso) {
    const { nome, descricao, aulas, idProfessor } = curso;
    Validador.validarParametros([{ id }, { nome }, { descricao }, { aulas }, { idProfessor }]);

    await CursoRepository.alterar({ id }, curso);

    return new Mensagem('Aula alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);
    const cursos = await cursoRepository.obterCursoPorIdProf(id);



    if (cursos.length !== 0) {
      throw new Exception("Nao pode ser excluido,pois esta cadastrado em uma Aula!")
    } else {

      await CursoRepository.excluir({ id });
      return new Mensagem('Aula excluido com sucesso!', {
        id,
      });

    }

  }
}
