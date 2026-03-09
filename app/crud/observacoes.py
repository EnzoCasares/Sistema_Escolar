from sqlalchemy.orm import Session
from app.models.models import * 
from fastapi import HTTPException





def criar_observacao(db:Session, materia:int, professor: int , aluno: int, texto: str) -> Observacao|None:
    #verificações extra 
    if db.query(Materia).filter(Materia.id == materia).first() is None:
        raise HTTPException(status_code=401, detail= "Matéria não encontrado")
    if db.query(Professor).filter(Professor.id == professor).first() is None:
        raise HTTPException(status_code=401, detail= "Professor não encontrado")
    if db.query(Aluno).filter(Aluno.id == aluno).first() is None:
        raise HTTPException(status_code=401, detail= "Aluno não encontrado")
    
    
    
    observacao = Observacao(materia_id = materia,
                            aluno_id = aluno,
                            professor_id = professor,
                            comentario = texto)
    db.add(observacao)
    db.commit()
    db.refresh(observacao)
    
    return observacao


def deletar_observacao(db: Session, id_observacao: int) -> Observacao|None:
    observacao = db.get(Observacao,id_observacao)
    
    #verificação so pra ter
    if observacao is None:
        raise HTTPException(status_code= 400, detail="Não foi econtrado a observação")
    
    db.delete(observacao)
    db.commit()
    
    return observacao


def alterar_observacao(db:Session,observacao_id: int, texto = str) -> Observacao|None:
    observacao =  db.query(Observacao).filter(Observacao.id == observacao_id).first()
    
    if observacao is None:
        raise HTTPException(status_code=400,detail="Não foi encontrada observação")
    
    observacao.comentario = texto
    
    db.commit()
    db.refresh(observacao)
    return observacao

def buscar_observacao_por_aluno(db:Session, id_aluno: int) -> list:
    retorno = db.query(Observacao).filter(Observacao.aluno_id == id_aluno).all()
    
    return retorno 


def buscar_observacao_por_professor(db:Session, id_professor: int) -> list:
    retorno = db.query(Observacao).filter(Observacao.professor_id == id_professor).all()
    
    return retorno 



def buscar_observacao_por_materia(db:Session, id_materia: int) -> list:
    retorno = db.query(Observacao).filter(Observacao.materia_id == id_materia).all()
    
    return retorno 

    
    
    
    
    
    