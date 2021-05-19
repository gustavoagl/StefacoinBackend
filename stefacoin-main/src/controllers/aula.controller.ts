import Aula from '../models/aula.model';
import Curso from '../entities/curso.entity';
import CursoRepository from '../repositories/curso.repository';
import Exception from '../utils/exceptions/exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class AulaController {
  async obterPorId(id: number, idCurso: number): Promise<Aula> {
    Validador.validarParametros([{ id }, { idCurso }]);
    const curso = await CursoRepository.obterPorId(idCurso);
    return curso.aulas.find((a) => a.id === id);
  }

  async listar(idCurso: number): Promise<Aula[]> {
    Validador.validarParametros([{ idCurso }]);
    const curso = await CursoRepository.obterPorId(idCurso);

    return curso.aulas;
  }

  async incluir(aula: Aula) {
    const { nome, duracao, topicos, idCurso } = aula;
    Validador.validarParametros([{ nome }, { duracao }, { topicos }, { idCurso }]);
    const curso = await CursoRepository.obterPorId(idCurso);

    let idAnterior = 0;
    console.log("entrando:", curso.aulas)
    if (curso.aulas !== undefined && curso.aulas.length > 0) {
      idAnterior = curso.aulas[curso.aulas.length - 1].id;
    } else {
      curso.aulas = [];
    }

    aula.id = idAnterior ? idAnterior + 1 : 1;
    curso.aulas.push(aula);

    await CursoRepository.alterar({ id: idCurso }, curso);


    return new Mensagem('Aula incluido com sucesso!', {
      id: aula.id,
      idCurso,
    });
  }

  async alterar(id: number, aula: Aula) {
    const { nome, duracao, topicos, idCurso } = aula;
    Validador.validarParametros([{ id }, { idCurso }, { nome }, { duracao }, { topicos }]);

    const curso = await CursoRepository.obterPorId(idCurso);

    if (duracao < 50) {
      throw new Exception("Duracao invalida!")
    }

    curso.aulas.map((a) => {
      if (a.id === id) {
        Object.keys(aula).forEach((k) => {
          a[k] = aula[k];
        });
      }
    });

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula alterado com sucesso!', {
      id,
      idCurso,
    });
  }

  async excluir(id: number, idProfessor: number) {
    Validador.validarParametros([{ id }, { idProfessor }]);
    let aulaAlterada: Aula[];
    const cursos: Curso[] = await CursoRepository.obterCursoPorIdProf(idProfessor);

    for (let index = 0; index < cursos.length; index++) {
      const element = cursos[index];

      for (let idxaula = 0; idxaula < element.aulas.length; idxaula++) {
        const aula = element.aulas[idxaula];
        if (aula.id === id) {
          element.aulas.splice(idxaula, 1);
        }
      }
      // if (element.aulas.length === 0){
      //   element.aulas = aulaAlterada;
      //   console.log("vai zerar", element.aulas);
      // }
      await CursoRepository.alterar({ id }, element);
    }
    return new Mensagem('Aula excluido com sucesso!');
  }
}
