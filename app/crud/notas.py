from sqlalchemy.orm import Session
from app.models.models import * 
from fastapi import HTTPException



def adicionar_notas(db:Session,aluno:int,materia:int,media:float,nota_1:float|None = None, nota_2:float|None = None,id: int|None = None):
    
    if isinstance(nota_1,None):
        nota_1 = db.query(Nota.nota1).filter(Nota.id == id).first()    
    if isinstance(nota_2,None):
        nota = Nota(aluno_id = aluno,
                    materia_id = materia,
                    nota1 = nota_1,
                    nota2 = None,
                    media = nota_1/1)
    else:
        nota = Nota(aluno_id = aluno,
                    materia_id = materia,
                    nota1 = nota_1,
                    nota2 = nota_2,
                    media = nota_1/2)
    
    
    db.add(nota)
    db.commit()
    db.refresh(nota)
    
    return nota


# def deletar_nota



    
    