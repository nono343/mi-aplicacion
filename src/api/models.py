from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import PickleType
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

# Tabla de asociación para la relación many-to-many entre User y Packagings
user_packagings = db.Table(
    'user_packagings',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('packaging_id', db.Integer, db.ForeignKey('packagings.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(11), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(150), unique=True)
    password = db.Column(db.Text, nullable=False)
    isAdmin = db.Column(db.String(10), nullable=False)
    # foto = db.Column(db.String(120), nullable=True)  # Agrega la columna para la foto

    
    # Relación many-to-many con Packagings
    packagings = db.relationship('Packagings', secondary=user_packagings, backref=db.backref('users', lazy='dynamic'))

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'isAdmin': self.isAdmin,
            # 'foto': self.foto,
        }

class Categorias(db.Model):
    __tablename__ = 'categorias'  # Nombre de la tabla en la base de datos
    id = db.Column(db.Integer, primary_key=True)
    nombreesp = db.Column(db.String(80), nullable=False)
    nombreeng = db.Column(db.String(80), nullable=False)
    foto = db.Column(db.String(120), nullable=False)
    productos = db.relationship('Productos', backref='categoria', cascade='all, delete-orphan')


    def __init__(self, nombreesp, nombreeng, foto):
        self.nombreesp = nombreesp
        self.nombreeng = nombreeng
        self.foto = foto

    def serialize(self):
        return {
            'id': self.id,
            'nombreesp': self.nombreesp,
            'nombreeng': self.nombreeng,
            'foto': self.foto,
            # Otros campos si es necesario
        }

    def __repr__(self):
        return f'<Categorias {self.nombreesp}>'


# Modelo para los productos
class Productos(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key=True)
    nombreesp = db.Column(db.String(80), nullable=False)
    nombreeng = db.Column(db.String(80), nullable=False)
    descripcionesp = db.Column(db.Text, nullable=False)
    descripcioneng = db.Column(db.Text, nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)
    foto = db.Column(db.String(120), nullable=False)
    foto2 = db.Column(db.String(120), nullable=True)
    meses_produccion = db.Column(db.String(50))  # Cambia el tipo según tus necesidades
    categoria_nombreesp_rel = db.relationship('Categorias', backref=db.backref('productos_rel', lazy=True))
    packagings = db.relationship('Packagings', backref='producto', cascade='all, delete-orphan')

    def __init__(self, nombreesp, nombreeng, descripcionesp, descripcioneng, categoria_id, foto, foto2, meses_produccion):
        self.nombreesp = nombreesp
        self.nombreeng = nombreeng
        self.descripcionesp = descripcionesp
        self.descripcioneng = descripcioneng
        self.categoria_id = categoria_id
        self.foto = foto
        self.foto2 = foto2
        self.meses_produccion = meses_produccion

    def serialize(self):
        return {
            'id': self.id,
            'nombreesp': self.nombreesp,
            'nombreeng': self.nombreeng,
            'descripcionesp': self.descripcionesp,
            'descripcioneng': self.descripcioneng,
            'categoria_id': self.categoria_id,
            'categoria_nombreesp': self.categoria.nombreesp,
            'foto': self.foto,
            'foto2': self.foto2,
            'meses_produccion': self.meses_produccion.split(',') if self.meses_produccion else [],
            'packagings': [packaging.serialize() for packaging in self.packagings],

        }

    def __repr__(self):
        return f'<Productos {self.nombreesp}>'


class Packagings(db.Model):
    __tablename__ = 'packagings'
    id = db.Column(db.Integer, primary_key=True)
    nombreesp = db.Column(db.String(80), nullable=False)
    nombreeng = db.Column(db.String(80), nullable=False)
    marca = db.Column(db.String(80), nullable=False)
    presentacion = db.Column(db.String(80), nullable=False)
    calibre = db.Column(db.String(80), nullable=False)
    peso_presentacion_g = db.Column(db.String(80), nullable=False)
    peso_neto_kg = db.Column(db.String(80), nullable=False)
    tamano_caja = db.Column(db.String(80), nullable=False)
    pallet_80x120 = db.Column(db.String(80), nullable=False)
    peso_neto_pallet_80x120_kg = db.Column(db.String(80), nullable=False)
    pallet_100x120 = db.Column(db.String(80), nullable=False)
    peso_neto_pallet_100x120_kg = db.Column(db.String(80), nullable=False)
    pallet_avion = db.Column(db.String(80), nullable=False)
    peso_neto_pallet_avion = db.Column(db.String(80), nullable=False)

    foto = db.Column(db.String(120), nullable=False)  
    foto2 = db.Column(db.String(120), nullable=True)

    producto_id = db.Column(db.Integer, db.ForeignKey('productos.id', name='fk_packagings_producto_id', ondelete='CASCADE'), nullable=False)

    categoria_id = db.Column(db.Integer, nullable=False)  # Nueva columna para el ID de la categoría
    categoria_nombreesp = db.Column(db.String(80), nullable=False)  # Nueva columna para el nombre de la categoría
    producto_nombreesp = db.Column(db.String(80), nullable=False)  # Nueva columna para el nombre del producto

    def __init__(self, nombreesp, nombreeng, marca, presentacion, calibre, peso_presentacion_g, peso_neto_kg,
                 tamano_caja, pallet_80x120, peso_neto_pallet_80x120_kg, pallet_100x120,
                 peso_neto_pallet_100x120_kg, pallet_avion, peso_neto_pallet_avion, foto, foto2, producto_id):
        self.nombreesp = nombreesp
        self.nombreeng = nombreeng
        self.marca = marca
        self.presentacion = presentacion
        self.calibre = calibre
        self.peso_presentacion_g = peso_presentacion_g
        self.peso_neto_kg = peso_neto_kg
        self.tamano_caja = tamano_caja
        self.pallet_80x120 = pallet_80x120
        self.peso_neto_pallet_80x120_kg = peso_neto_pallet_80x120_kg
        self.pallet_100x120 = pallet_100x120
        self.peso_neto_pallet_100x120_kg = peso_neto_pallet_100x120_kg
        self.pallet_avion = pallet_avion
        self.peso_neto_pallet_avion = peso_neto_pallet_avion
        self.foto = foto
        self.foto2 = foto2
        self.producto_id = producto_id

        # Automatiza la asignación de la categoría del producto al packaging
        producto = Productos.query.get(producto_id)
        if producto:
            self.categoria_id = producto.categoria_id
            self.categoria_nombreesp = producto.categoria.nombreesp
            self.producto_nombreesp = producto.nombreesp

    def serialize(self):
        return {
            'id': self.id,
            'nombreesp': self.nombreesp,
            'nombreeng': self.nombreeng,
            'marca': self.marca,
            'presentacion': self.presentacion,
            'calibre': self.calibre,
            'peso_presentacion_g': self.peso_presentacion_g,
            'peso_neto_kg': self.peso_neto_kg,
            'tamano_caja': self.tamano_caja,
            'pallet_80x120': self.pallet_80x120,
            'peso_neto_pallet_80x120_kg': self.peso_neto_pallet_80x120_kg,
            'pallet_100x120': self.pallet_100x120,
            'peso_neto_pallet_100x120_kg': self.peso_neto_pallet_100x120_kg,
            'foto': self.foto,
            'foto2': self.foto2,
            'producto_id': self.producto_id,
            'categoria_id': self.categoria_id,
            'categoria_nombreesp': self.categoria_nombreesp,
            'producto_nombreesp': self.producto_nombreesp,
            'users': [user.serialize() for user in self.users],
            # Otros campos si es necesario
        }

    def __repr__(self):
        return f'<Packagings {self.nombreesp}>'
