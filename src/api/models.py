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
    photo = db.Column(db.String(120), nullable=True) 

    
    # Relación many-to-many con Packagings
    packagings = db.relationship('Packagings', secondary=user_packagings, backref=db.backref('users', lazy='dynamic'))

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'isAdmin': self.isAdmin,
            'photo': self.photo,
        }

class Categories(db.Model):
    __tablename__ = 'categories'  # Nombre de la tabla en la base de datos
    id = db.Column(db.Integer, primary_key=True)
    nameesp = db.Column(db.String(80), nullable=False)
    nameeng = db.Column(db.String(80), nullable=False)
    photo = db.Column(db.String(120), nullable=False)
    products = db.relationship('Products', backref='category', cascade='all, delete-orphan')


    def __init__(self, nameesp, nameeng, photo):
        self.nameesp = nameesp
        self.nameeng = nameeng
        self.photo = photo

    def serialize(self):
        return {
            'id': self.id,
            'nameesp': self.nameesp,
            'nameeng': self.nameeng,
            'photo': self.photo,
            # Otros campos si es necesario
        }

    def __repr__(self):
        return f'<Categories {self.nameesp}>'


# Modelo para los products
class Products(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    nameesp = db.Column(db.String(80), nullable=False)
    nameeng = db.Column(db.String(80), nullable=False)
    descriptionesp = db.Column(db.Text, nullable=False)
    descriptioneng = db.Column(db.Text, nullable=False)
    varietyesp = db.Column(db.String(80), nullable=True)
    varietyeng = db.Column(db.String(80), nullable=True)
    claimesp = db.Column(db.String(80), nullable=False)
    claimeng = db.Column(db.String(80), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    photo = db.Column(db.String(120), nullable=False)
    photo2 = db.Column(db.String(120), nullable=True)
    months_production = db.Column(db.String(50))  
    category_nameesp_rel = db.relationship('Categories', backref=db.backref('products_rel', lazy=True))
    packagings = db.relationship('Packagings', backref='product', cascade='all, delete-orphan')

    def __init__(self, nameesp, nameeng, descriptionesp, descriptioneng, varietyesp, varietyeng, claimesp, claimeng, category_id, photo, photo2, months_production):
        self.nameesp = nameesp
        self.nameeng = nameeng
        self.descriptionesp = descriptionesp
        self.descriptioneng = descriptioneng
        self.varietyesp = varietyesp
        self.varietyeng = varietyeng
        self.claimesp = claimesp
        self.claimeng = claimeng
        self.category_id = category_id
        self.photo = photo
        self.photo2 = photo2
        self.months_production = months_production

    def serialize(self):
        return {
            'id': self.id,
            'nameesp': self.nameesp,
            'nameeng': self.nameeng,
            'descriptionesp': self.descriptionesp,
            'descriptioneng': self.descriptioneng,
            'varietyesp': self.varietyesp,
            'varietyeng': self.varietyeng,
            'claimesp': self.claimesp,
            'claimeng': self.claimeng,
            'category_id': self.category_id,
            'category_nameesp': self.category.nameesp,
            'photo': self.photo,
            'photo2': self.photo2,
            'months_production': self.months_production.split(',') if self.months_production else [],
            'packagings': [packaging.serialize() for packaging in self.packagings],
        }

    def __repr__(self):
        return f'<Products {self.nameesp}>'


class Packagings(db.Model):
    __tablename__ = 'packagings'
    id = db.Column(db.Integer, primary_key=True)
    nameesp = db.Column(db.String(80), nullable=False)
    nameeng = db.Column(db.String(80), nullable=False)
    brand = db.Column(db.String(80), nullable=False)
    presentation = db.Column(db.String(80), nullable=False)
    caliber = db.Column(db.String(80), nullable=False)
    weight_presentation_g = db.Column(db.String(80), nullable=False)
    net_weight_kg = db.Column(db.String(80), nullable=False)
    box_size = db.Column(db.String(80), nullable=False)
    pallet_80x120 = db.Column(db.String(80), nullable=False)
    net_weight_pallet_80x120_kg = db.Column(db.String(80), nullable=False)
    pallet_100x120 = db.Column(db.String(80), nullable=False)
    net_weight_pallet_100x120_kg = db.Column(db.String(80), nullable=False)
    pallet_plane = db.Column(db.String(80), nullable=False)
    net_weight_pallet_plane_kg = db.Column(db.String(80), nullable=False)
    photo = db.Column(db.String(120), nullable=False)  
    photo2 = db.Column(db.String(120), nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', name='fk_packagings_product_id', ondelete='CASCADE'), nullable=False)
    category_id = db.Column(db.Integer, nullable=False)  # Nueva columna para el ID de la categoría
    category_nameesp = db.Column(db.String(80), nullable=False)  # Nueva columna para el nombre de la categoría
    product_nameesp = db.Column(db.String(80), nullable=False)  # Nueva columna para el nombre del product

    def __init__(self, nameesp, nameeng, brand, presentation, caliber, weight_presentation_g, net_weight_kg,
                 box_size, pallet_80x120, net_weight_pallet_80x120_kg, pallet_100x120,
                 net_weight_pallet_100x120_kg, pallet_plane, net_weight_pallet_plane_kg, photo, photo2, product_id):
        
        self.nameesp = nameesp
        self.nameeng = nameeng
        self.brand = brand
        self.presentation = presentation
        self.caliber = caliber
        self.weight_presentation_g = weight_presentation_g
        self.net_weight_kg = net_weight_kg
        self.box_size = box_size
        self.pallet_80x120 = pallet_80x120
        self.net_weight_pallet_80x120_kg = net_weight_pallet_80x120_kg
        self.pallet_100x120 = pallet_100x120
        self.net_weight_pallet_100x120_kg = net_weight_pallet_100x120_kg
        self.pallet_plane = pallet_plane
        self.net_weight_pallet_plane_kg = net_weight_pallet_plane_kg
        self.photo = photo
        self.photo2 = photo2
        self.product_id = product_id

        # Automatiza la asignación de la categoría del product al packaging
        product = Products.query.get(product_id)
        if product:
            self.category_id = product.category_id
            self.category_nameesp = product.category.nameesp
            self.product_nameesp = product.nameesp

    def serialize(self):
        return {
            'id': self.id,
            'nameesp': self.nameesp,
            'nameeng': self.nameeng,
            'brand': self.brand,
            'presentation': self.presentation,
            'caliber': self.caliber,
            'weight_presentation_g': self.weight_presentation_g,
            'net_weight_kg': self.net_weight_kg,
            'box_size': self.box_size,
            'pallet_80x120': self.pallet_80x120,
            'net_weight_pallet_80x120_kg': self.net_weight_pallet_80x120_kg,
            'pallet_100x120': self.pallet_100x120,
            'net_weight_pallet_100x120_kg': self.net_weight_pallet_100x120_kg,
            'pallet_plane': self.pallet_plane,
            'net_weight_pallet_plane_kg': self.net_weight_pallet_plane_kg,
            'photo': self.photo,
            'photo2': self.photo2,
            'product_id': self.product_id,
            'category_id': self.category_id,
            'category_nameesp': self.category_nameesp,
            'product_nameesp': self.product_nameesp,
            'users': [user.serialize() for user in self.users],
            # Otros campos si es necesario
        }

    def __repr__(self):
        return f'<Packagings {self.nameesp}>'
