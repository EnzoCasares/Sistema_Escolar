from sqlalchemy.orm import Session
from sqlalchemy import or_,and_,distinct
from app.models.models import * 
from fastapi import HTTPException



def criar_sala(db:Session,nome:str) -> Sala:
    sala = Sala(nome = nome)
    db.add(sala)
    db.commit()
    db.refresh(sala)
    return sala

def alterar_sala(db:Session,id_sala:int, novo_nome:str) -> Sala:
    sala = db.query(Sala).filter(Sala.id == id_sala).first()
    
    sala.nome = novo_nome
    
    db.commit()
    db.refresh(sala)
    
    return sala


def retirar_sala(db: Session, id:int) -> Sala:
    #primeiro retiramos os alunos depois a sala, apesar de criado, este método serve apenas a casos extremos
    horarios = db.query(Horario).filter(Horario.sala_id == id).all()
    
    for h in horarios:
        db.delete(h)
        
    alunos = db.query(Aluno).filter(Aluno.sala_id == id).all()
    
    for a in alunos:
        notas = db.query(Nota).filter(Nota.aluno_id == a.id).all()
        for n in notas:
            db.delete(n)
        db.delete(a)
    
    sala = db.get(Sala,id)
    db.delete(sala)
    db.commit()
    return sala




def buscar_salas(db:Session) -> list:
    salas = db.query(Sala).all()
    
    return salas

def buscar_alunos_por_sala(db:Session,id:int) -> list:
    alunos = db.query(Aluno).filter(Aluno.sala_id == id).all()
    
    return alunos

def buscar_horarios_por_sala(db:Session,id:int) -> list:
    horarios = db.query(Horario).filter(Horario.sala_id == id).order_by(Horario.hora_inicio).all()
    return horarios

def buscar_professores_por_sala(db:Session,id:int) -> list:
    professores = db.query(distinct(Professor)).join(Horario).filter(Horario.sala_id == id).all
    return professores
    
        
