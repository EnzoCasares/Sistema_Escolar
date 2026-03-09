from sqlalchemy import Column, Integer, String, Date, ForeignKey, DECIMAL, Text, Time
from sqlalchemy.orm import relationship
from app.db.base import Base


class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    senha = Column(String(255), nullable=False)
    nome = Column(String(255), nullable=False)

    aluno = relationship("Aluno", back_populates="usuario", uselist=False)
    professor = relationship("Professor", back_populates="usuario", uselist=False)
    administrador = relationship("Administrador", back_populates="usuario", uselist=False)


class Administrador(Base):
    __tablename__ = "administrador"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)

    usuario = relationship("Usuario", back_populates="administrador")


class Professor(Base):
    __tablename__ = "professor"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)

    usuario = relationship("Usuario", back_populates="professor")
    materias = relationship("Materia", back_populates="professor")
    observacoes = relationship("Observacao", back_populates="professor")


class Sala(Base):
    __tablename__ = "sala"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(100), nullable=False)

    alunos = relationship("Aluno", back_populates="sala")
    horarios = relationship("Horario", back_populates="sala")


class Aluno(Base):
    __tablename__ = "aluno"

    id = Column(Integer, primary_key=True, autoincrement=True)
    matricula = Column(String(50), nullable=False, unique=True)
    data_nascimento = Column(Date, nullable=True)
    sala_id = Column(Integer, ForeignKey("sala.id"), nullable=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=True)

    sala = relationship("Sala", back_populates="alunos")
    usuario = relationship("Usuario", back_populates="aluno")
    notas = relationship("Nota", back_populates="aluno")
    observacoes = relationship("Observacao", back_populates="aluno")


class Materia(Base):
    __tablename__ = "materia"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(150), nullable=False)
    professor_id = Column(Integer, ForeignKey("professor.id"), nullable=True)

    professor = relationship("Professor", back_populates="materias")
    notas = relationship("Nota", back_populates="materia")
    observacoes = relationship("Observacao", back_populates="materia")
    horarios = relationship("Horario", back_populates="materia")


class Nota(Base):
    __tablename__ = "notas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    aluno_id = Column(Integer, ForeignKey("aluno.id", ondelete="CASCADE"), nullable=False)
    materia_id = Column(Integer, ForeignKey("materia.id", ondelete="CASCADE"), nullable=False)
    nota1 = Column(DECIMAL(5, 2), nullable=True)
    nota2 = Column(DECIMAL(5, 2), nullable=True)
    media = Column(DECIMAL(5, 2), nullable=True)

    aluno = relationship("Aluno", back_populates="notas")
    materia = relationship("Materia", back_populates="notas")


class Observacao(Base):
    __tablename__ = "observacoes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    materia_id = Column(Integer, ForeignKey("materia.id"), nullable=True)
    aluno_id = Column(Integer, ForeignKey("aluno.id"), nullable=True)
    professor_id = Column(Integer, ForeignKey("professor.id"), nullable=True)
    comentario = Column(Text, nullable=True)

    materia = relationship("Materia", back_populates="observacoes")
    aluno = relationship("Aluno", back_populates="observacoes")
    professor = relationship("Professor", back_populates="observacoes")


class Horario(Base):
    __tablename__ = "horario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    sala_id = Column(Integer, ForeignKey("sala.id"), nullable=True)
    materia_id = Column(Integer, ForeignKey("materia.id"), nullable=True)
    hora_inicio = Column(Time, nullable=True)
    hora_fim = Column(Time, nullable=True)
    dia = Column(String(20), nullable=True)

    sala = relationship("Sala", back_populates="horarios")
    materia = relationship("Materia", back_populates="horarios")
