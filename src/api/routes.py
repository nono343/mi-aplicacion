import os
from flask import request, jsonify
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    unset_jwt_cookies,
    jwt_required,
)
from datetime import datetime, timedelta, timezone
import json
from werkzeug.utils import secure_filename
from app import api, bcrypt, db, jwt, flash, redirect
from models import User,Categories, Products , Packagings   
from util import allowed_file  # Importa la función allowed_file desde util.py
from flask import send_from_directory
from unidecode import unidecode
from sqlalchemy.orm import load_only
from sqlalchemy.orm import joinedload




@api.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# Ruta para servir archivos estáticos (actualizada)
@api.route('/uploads/<filename>')
def uploaded_file_user(filename):
    return send_from_directory(api.config['UPLOAD_FOLDER'], filename)


@api.route('/logintoken', methods=["POST"])
def create_token():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(username=username).first()
    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Wrong username or password"}), 401

    # Imprime información antes de crear el token
    print("User ID:", user.id)
    print("Username:", user.username)

    # Modifica la creación del token para incluir el name del archivo de la photo
    photo_filename = user.photo if user.photo else None

    # Crea el token con información adicional en la carga útil
    access_token = create_access_token(
        identity=user.id,
        additional_claims={
            "username": user.username,
            "isAdmin": user.isAdmin,
            "photo": photo_filename  # Cambia aquí para incluir el name del archivo
        }
    )

    # Imprime el token antes de devolverlo en la respuesta
    print("Access Token:", access_token)

    # Devuelve la respuesta con el token
    return jsonify({
        "id": user.id,
        "username": user.username,
        "access_token": access_token,
        "isAdmin": user.isAdmin,
        "photo": photo_filename
    })

@api.route("/signup", methods=["POST"])
def signup():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    username = request.form.get("username", None)
    password = request.form.get("password", None)

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user_exists = User.query.filter_by(username=username).first()
    if user_exists:
        return jsonify({"error": "Username already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        
        # Crear un directorio basado en el name de usuario si no existe dentro de /users
        user_folder = os.path.join(api.config['UPLOAD_FOLDER'], 'users', username)
        os.makedirs(user_folder, exist_ok=True)
        
        file.save(os.path.join(user_folder, filename))

    new_user = User(username=username, password=hashed_password, isAdmin=request.form.get("isAdmin", "user"), photo=filename)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "isAdmin": new_user.isAdmin,
        "photo": new_user.photo,
    })
 
 # Ruta para obtener la información de los usuarios
@api.route('/users', methods=['GET'])
def get_users():
    # Obtén la lista de usuarios (en este ejemplo, devuelve todos los usuarios)
    users = User.query.all()


    # Completa la transacción con un COMMIT
    db.session.commit()

    # Serializa la información de los usuarios (devuelve solo id y username)
    serialized_users = [{'id': user.id, 'username': user.username} for user in users]
    return jsonify({'users': serialized_users})


@api.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response
 
@api.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response
 
@api.route('/profile/<getusername>')
@jwt_required() 
def my_profile(getusername):
    if not getusername:
        return jsonify({"error": "Unauthorized Access"}), 401
       
    user = User.query.filter_by(username=getusername).first()
  
    response_body = {
        "id": user.id,
        "username": user.username,
        "isAdmin" : user.isAdmin
    }
  
    return response_body


@api.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(os.path.abspath(api.config['UPLOAD_FOLDER']), filename))
        return jsonify({'message': 'File uploaded successfully'}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

# Ruta para servir archivos estáticos
@api.route('/uploads/<category>/<filename>')
def uploaded_category_file(category, filename):
    return send_from_directory(api.config['UPLOAD_FOLDER'], f'{category}/{filename}')

@api.route('/upload_category', methods=['POST'])
def upload_category():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    nameesp = request.form['nameesp']
    nameeng = request.form['nameeng']

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        
        # Crear un directorio basado en el name de la categoría si no existe
        category_folder = os.path.join(api.config['UPLOAD_FOLDER'], nameesp)
        os.makedirs(category_folder, exist_ok=True)
        
        file.save(os.path.join(category_folder, filename))

        # Aquí puedes guardar la categoría con la photo en tu base de datos en la tabla Categories
        new_category = Categories(nameesp=nameesp, nameeng=nameeng, photo=filename)
        db.session.add(new_category)
        db.session.commit()

        return jsonify({'message': 'Category uploaded successfully'}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

@api.route('/edit_category/<int:category_id>', methods=['PUT'])
def edit_category(category_id):
    # Obtener la categoría existente por su ID
    category = Categories.query.get(category_id)
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    # Obtener los nuevos datos del formulario
    nameesp = request.form.get('nameesp')
    nameeng = request.form.get('nameeng')
    new_photo = request.files.get('file')

    # Guardar el nombre de la foto y la carpeta anteriores para borrarlas después
    old_photo = category.photo
    old_folder = category.nameesp

    # Actualizar los campos si se proporcionan nuevos valores
    if nameesp:
        category.nameesp = nameesp
    if nameeng:
        category.nameeng = nameeng

    # Renombrar la carpeta antigua si se edita el nombre
    if old_folder and old_folder != nameesp:
        old_folder_path = os.path.join(api.config['UPLOAD_FOLDER'], old_folder)
        new_folder_path = os.path.join(api.config['UPLOAD_FOLDER'], nameesp)

        if os.path.exists(old_folder_path):
            os.rename(old_folder_path, new_folder_path)

    # Actualizar la foto si se proporciona un nuevo archivo
    if new_photo and allowed_file(new_photo.filename):
        filename = secure_filename(new_photo.filename)
        category.photo = filename

        # Borrar la foto anterior si existe
        if old_photo:
            old_photo_path = os.path.join(api.config['UPLOAD_FOLDER'], nameesp, old_photo)
            if os.path.exists(old_photo_path):
                os.remove(old_photo_path)

        # Crear el nuevo directorio y guardar el archivo en él
        new_folder_path = os.path.join(api.config['UPLOAD_FOLDER'], nameesp)
        os.makedirs(new_folder_path, exist_ok=True)
        new_photo.save(os.path.join(new_folder_path, filename))

    # Guardar los cambios en la base de datos
    db.session.commit()

    return jsonify({'message': 'Category updated successfully'}), 200


@api.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Categories.query.all()  # Consulta todas las categorías en la base de datos
        category_list = []

        for category in categories:
            category_data = {
                'id': category.id,
                'nameesp': category.nameesp,
                'nameeng': category.nameeng,
                'photo': category.photo
            }
            category_list.append(category_data)

        # Completa la transacción con un COMMIT
        db.session.commit()

        return jsonify(categories=category_list)

    except Exception as e:
        # Manejar la excepción de manera adecuada, como hacer un ROLLBACK explícito si es necesario
        print(f"Error en la consulta de categorías: {str(e)}")
        # Puedes elegir devolver un mensaje de error específico
        return jsonify(error="Error al obtener las categorías"), 500


@api.route('/categories/<int:category_id>', methods=['GET'])
def get_category_by_id(category_id):
    try:
        # Obtener la categoría por su ID
        category = Categories.query.get(category_id)

        if category is None:
            return jsonify({'error': 'Categoría no encontrada'}), 404

        # Crear un diccionario con la información de la categoría
        category_data = {
            'id': category.id,
            'nameesp': category.nameesp,
            'nameeng': category.nameeng,
            'photo': category.photo  # Este es el nombre del archivo de la foto
            # Puedes agregar más campos según tus necesidades
        }

        # Completa la transacción con un COMMIT
        db.session.commit()

        return jsonify(category=category_data), 200
    except Exception as e:
        # Manejo de errores
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500



@api.route('/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    # Buscar la categoría por ID
    category = Categories.query.get(id)

    if category is None:
        return jsonify({'message': 'Categoría no encontrada'}), 404

    # Eliminar físicamente las photos asociadas a la categoría
    photo_path = os.path.join(api.config['UPLOAD_FOLDER'], category.nameesp, category.photo)

    # Elimina las photos si existen
    if os.path.exists(photo_path):
        os.remove(photo_path)

    # Eliminar la categoría en la base de datos
    db.session.delete(category)
    db.session.commit()

    return jsonify({'message': 'Categoría eliminada correctamente'}), 200


# Ruta para servir archivos estáticos de products
@api.route('/uploads/<category>/<productname>/<filename>')
def uploaded_product_file(category, productname, filename):
    return send_from_directory(os.path.join(api.config['UPLOAD_FOLDER'], category, productname), filename)

# Ruta para crear un nuevo product
@api.route('/upload_product', methods=['POST'])
def upload_product():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'At least one file is required'}), 400

        file = request.files['file']
        file2 = request.files.get('file2')  

        if file.filename == '':
            return jsonify({'error': 'No selected file for the first photo'}), 400

        nameesp = request.form.get('nameesp', '')
        nameeng = request.form.get('nameeng', '')
        descriptionesp = request.form.get('descriptionesp', '')
        descriptioneng = request.form.get('descriptioneng', '')
        varietyesp = request.form.get('varietyesp', '')
        varietyeng = request.form.get('varietyeng', '')
        claimesp = request.form.get('claimesp', '')
        claimeng = request.form.get('claimeng', '')
        category_id = request.form.get('category', '')
        monthsproduction = request.form.getlist('month_production')

        # Validar que los campos requeridos no estén vacíos
        if not all([nameesp, nameeng, descriptionesp, descriptioneng, varietyesp, varietyeng, claimesp, claimeng, category_id, monthsproduction]):
            return jsonify({'error': 'All fields are required'}), 400

        # Obtener el name de la categoría
        category = Categories.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404

        # Crear una carpeta para el product dentro de la categoría
        product_folder = os.path.join(api.config['UPLOAD_FOLDER'], category.nameesp, secure_filename(nameesp))
        os.makedirs(product_folder, exist_ok=True)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filename2 = None

            if file2 and allowed_file(file2.filename):
                filename2 = secure_filename(file2.filename)
                file2.save(os.path.join(product_folder, filename2))

            file.save(os.path.join(product_folder, filename))

            # Convierte la lista de meses a una cadena separada por comas
            months_production_str = ','.join(map(str, monthsproduction))

            nuevo_producto = Products(
                nameesp=nameesp,
                nameeng=nameeng,
                descriptionesp=descriptionesp,
                descriptioneng=descriptioneng,
                varietyesp=varietyesp,
                varietyeng=varietyeng,
                claimesp=claimesp,
                claimeng=claimeng,
                category_id=category_id,
                photo=filename,
                photo2=filename2,
                months_production=months_production_str,
            )

            db.session.add(nuevo_producto)
            db.session.commit()

            return jsonify({'message': 'Product uploaded successfully'}), 200
        else:
            return jsonify({'error': 'Invalid file type'}), 400
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


@api.route('/edit_product/<int:product_id>', methods=['PUT'])
def edit_product(product_id):
    try:
        # Obtener el producto existente por su ID
        product = Products.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        # Obtener los nuevos datos del formulario
        nameesp = request.form['nameesp']
        nameeng = request.form['nameeng']
        claimesp = request.form['claimesp']
        claimeng = request.form['claimeng']
        descriptionesp = request.form['descriptionesp']
        descriptioneng = request.form['descriptioneng']
        category_id = request.form['category']

        # Obtener la categoría asociada al producto
        category = Categories.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404

        # Guardar el nombre de las fotos y carpetas anteriores para borrarlas después
        old_photo = product.photo
        old_photo2 = product.photo2
        old_folder = secure_filename(product.nameesp)

        # Actualizar los datos del producto
        product.nameesp = nameesp
        product.nameeng = nameeng
        product.claimesp = claimesp
        product.claimeng = claimeng
        product.descriptionesp = descriptionesp
        product.descriptioneng = descriptioneng
        product.category_id = category_id

        # Renombrar la carpeta si cambia el nombre del producto
        new_folder = secure_filename(nameesp)
        if old_folder != new_folder:
            old_folder_path = os.path.join(api.config['UPLOAD_FOLDER'], category.nameesp, old_folder)
            new_folder_path = os.path.join(api.config['UPLOAD_FOLDER'], category.nameesp, new_folder)
            if os.path.exists(old_folder_path):
                os.rename(old_folder_path, new_folder_path)

        # Actualizar las imágenes solo si se proporcionan nuevas imágenes
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(new_folder_path, filename))
                product.photo = filename

                # Borrar la foto anterior si existe
                if old_photo:
                    old_image_path = os.path.join(api.config['UPLOAD_FOLDER'], category.nameesp, new_folder, old_photo)
                    if os.path.exists(old_image_path):
                        os.remove(old_image_path)

        if 'file2' in request.files:
            file2 = request.files['file2']
            if file2 and allowed_file(file2.filename):
                filename2 = secure_filename(file2.filename)
                file2.save(os.path.join(new_folder_path, filename2))
                product.photo2 = filename2

                # Borrar la foto anterior si existe
                if old_photo2:
                    old_image_path2 = os.path.join(api.config['UPLOAD_FOLDER'], category.nameesp, new_folder, old_photo2)
                    if os.path.exists(old_image_path2):
                        os.remove(old_image_path2)

        db.session.commit()

        return jsonify({'message': 'Product updated successfully'}), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500



@api.route('/products', methods=['GET'])
def get_products():
    try:
        # Obtén el término de búsqueda del parámetro de consulta
        search_term = request.args.get('name', '')

        # Realiza la consulta filtrando por el name del product
        products = Products.query.filter(Products.nameesp.ilike(f'%{search_term}%')).all()

        # Lista para almacenar los datos de los products
        product_list = []

        for product in products:
            # Consulta los packagings asociados a cada product
            packagings = product.packagings  # Utiliza la relación packagings definida en el modelo Products

            months_production = product.months_production.split(',') if product.months_production else []

            # Crea una lista de datos de packaging asociados al product
            packaging_list = []
            for packaging in packagings:
                users = [user.username for user in packaging.users]  # Accede a los usuarios asociados al packaging
                packaging_data = {
                    'id': packaging.id,
                    'nameesp': packaging.nameesp,
                    'nameeng': packaging.nameeng,
                    'brand': packaging.brand,
                    'presentation': packaging.presentation,
                    'caliber': packaging.caliber,
                    'weight_presentation_g': packaging.weight_presentation_g,
                    'net_weight_kg': packaging.net_weight_kg,
                    'box_size': packaging.box_size,
                    'pallet_80x120': packaging.pallet_80x120,
                    'net_weight_pallet_80x120_kg': packaging.net_weight_pallet_80x120_kg,
                    'pallet_100x120': packaging.pallet_100x120,
                    'net_weight_pallet_100x120_kg': packaging.net_weight_pallet_100x120_kg,
                    'pallet_plane': packaging.pallet_plane,
                    'net_weight_pallet_plane_kg': packaging.net_weight_pallet_plane_kg,
                    'photo': packaging.photo,
                    'photo2': packaging.photo2,
                    'product_id': packaging.product_id,
                    'users': users,  # Agrega la lista de usuarios al diccionario de packaging_data
                }
                packaging_list.append(packaging_data)

            # Crea un diccionario de datos del product y sus packagings y meses de producción asociados
            product_data = {
                'id': product.id,
                'nameesp': product.nameesp,
                'nameeng': product.nameeng,
                'descriptionesp': product.descriptionesp,
                'descriptioneng': product.descriptioneng,
                'varietyesp': product.varietyesp,
                'varietyeng': product.varietyeng,
                'claimesp': product.claimesp,
                'claimeng': product.claimeng,
                'category_id': product.category_id,
                'photo': product.photo,
                'photo2': product.photo2,
                'category_nameesp': product.category_nameesp_rel.nameesp if product.category_nameesp_rel else None,
                'packagings': packaging_list,
                'months_production': months_production,
            }
            product_list.append(product_data)

        # Completa la transacción con un COMMIT
        db.session.commit()

        # Devuelve la lista de products en formato JSON
        return jsonify({'products': product_list}), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500



@api.route('/products/<int:product_id>', methods=['DELETE'])
def borrar_producto(product_id):
    product = Products.query.get(product_id)

    if product is None:
        return jsonify({'mensaje': 'Producto no encontrado'}), 404

    # Eliminar físicamente las photos asociadas al product
    photo_path = os.path.join(api.config['UPLOAD_FOLDER'], product.category_nameesp_rel.nameesp, product.nameesp, product.photo)
    photo2_path = os.path.join(api.config['UPLOAD_FOLDER'], product.category_nameesp_rel.nameesp, product.nameesp, product.photo2) if product.photo2 else None

    # Elimina las photos si existen
    if os.path.exists(photo_path):
        os.remove(photo_path)
    if photo2_path and os.path.exists(photo2_path):
        os.remove(photo2_path)

    db.session.delete(product)
    db.session.commit()

    return jsonify({'mensaje': 'Producto borrado correctamente'}), 200



# Ruta para servir archivos estáticos de products
@api.route('/uploads/<category>/<productname>/<namepackaging>/<boxsize>/<caliber>/<filename>')
def uploaded_packaging_file(category, productname, namepackaging, boxsize, caliber, filename):
    return send_from_directory(os.path.join(api.config['UPLOAD_FOLDER'], category, productname, namepackaging, boxsize, caliber), filename)


# Ruta para crear un nuevo packaging
@api.route('/upload_packaging', methods=['POST'])
def upload_packaging():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'At least one file is required'}), 400

        file = request.files['file']
        file2 = request.files.get('file2')  # Use get to allow file2 to be None

        if file.filename == '':
            return jsonify({'error': 'No selected file for the first photo'}), 400

        nameesp = request.form['nameesp']
        nameeng = request.form['nameeng']
        brand = request.form['brand']
        presentation = request.form['presentation']
        caliber = request.form['caliber']
        weight_presentation_g = request.form['weight_presentation_g']
        net_weight_kg = request.form['net_weight_kg']
        box_size = request.form['box_size']
        pallet_80x120 = request.form['pallet_80x120']
        net_weight_pallet_80x120_kg = request.form['net_weight_pallet_80x120_kg']
        pallet_100x120 = request.form['pallet_100x120']
        net_weight_pallet_100x120_kg = request.form['net_weight_pallet_100x120_kg']
        pallet_plane = request.form['pallet_plane']
        net_weight_pallet_plane_kg = request.form['net_weight_pallet_plane_kg']
        product_id = request.form['product_id']
        user_ids = request.form.getlist('user_ids')

        # Obtener el name de la categoría
        product = Products.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        # Crear una carpeta para el packaging dentro del product
        packaging_folder = os.path.join(
            api.config['UPLOAD_FOLDER'],
            product.category.nameesp,
            secure_filename(product.nameesp),
            secure_filename(nameesp),
            secure_filename(box_size),
            secure_filename(caliber)
        )
        os.makedirs(packaging_folder, exist_ok=True)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filename2 = None

            if file2 and allowed_file(file2.filename):
                filename2 = secure_filename(file2.filename)
                file2.save(os.path.join(packaging_folder, filename2))

            file.save(os.path.join(packaging_folder, filename))

            new_packaging = Packagings(
                nameesp=nameesp,
                nameeng=nameeng,
                brand=brand,
                presentation=presentation,
                caliber=caliber,
                weight_presentation_g=weight_presentation_g,
                net_weight_kg=net_weight_kg,
                box_size=box_size,
                pallet_80x120=pallet_80x120,
                net_weight_pallet_80x120_kg=net_weight_pallet_80x120_kg,
                pallet_100x120=pallet_100x120,
                net_weight_pallet_100x120_kg=net_weight_pallet_100x120_kg,
                pallet_plane=pallet_plane,
                net_weight_pallet_plane_kg=net_weight_pallet_plane_kg,
                photo=filename,
                photo2=filename2,
                product_id=product_id
            )

            # Agrega new_packaging a la sesión antes de operaciones relacionadas con la base de datos
            db.session.add(new_packaging)
            db.session.commit()

            # Asigna los usuarios al packaging después de agregar a la sesión
            for user_id in user_ids:
                user = User.query.get(user_id)
                if user:
                    new_packaging.users.append(user)

            # Realiza otro commit después de agregar usuarios
            db.session.commit()

        return jsonify({'message': 'Carga exitosa del embalaje'}), 200
    except Exception as e:
        # Registra el error en los registros del servidor
        print(f"Error en la carga del embalaje: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

# Ruta para obtener todos los packagings
@api.route('/packagings', methods=['GET'])
def get_packagings():
    try:
        packagings = Packagings.query.all()
        packaging_list = []

        for packaging in packagings:
            users = [{'id': user.id, 'username': user.username} for user in packaging.users]

            # Accede al name en español del product a través de la relación
            packaging.product.name = packaging.product.nameesp if packaging.product else None

            packaging_data = {
                'id': packaging.id,
                'nameesp': packaging.nameesp,
                'nameeng': packaging.nameeng,
                'brand': packaging.brand,
                'presentation': packaging.presentation,
                'caliber': packaging.caliber,
                'weight_presentation_g': packaging.weight_presentation_g,
                'net_weight_kg': packaging.net_weight_kg,
                'box_size': packaging.box_size,
                'pallet_80x120': packaging.pallet_80x120,
                'net_weight_pallet_80x120_kg': packaging.net_weight_pallet_80x120_kg,
                'pallet_100x120': packaging.pallet_100x120,
                'net_weight_pallet_100x120_kg': packaging.net_weight_pallet_100x120_kg,
                'pallet_plane': packaging.pallet_plane,
                'net_weight_pallet_plane_kg': packaging.net_weight_pallet_plane_kg,
                'photo': packaging.photo,
                'photo2': packaging.photo2,
                'product_id': packaging.product_id,
                'product': packaging.product_nameesp,
                'category': packaging.category_nameesp,
                'productname': packaging.product.name,  # Nuevo campo para el name del product en español
                'users': users,
            }

            packaging_list.append(packaging_data)

        # Completa la transacción con un COMMIT
        db.session.commit()

        return jsonify(packagings=packaging_list), 200
    except Exception as e:
            import traceback
            traceback.print_exc()

        # Manejo de errores
            return jsonify({'error': str(e)}), 500

# Ruta para editar usuarios asociados a un packaging
@api.route('/packagings/<int:packaging_id>/edit_users', methods=['PUT'])
def edit_packaging_users(packaging_id):
    try:
        # Obtener el packaging por su ID
        packaging = Packagings.query.get(packaging_id)

        # Verificar si el packaging existe
        if not packaging:
            return jsonify({'error': 'Packaging no encontrado'}), 404

        # Obtener datos de la solicitud JSON
        data = request.json

        # Verificar si se proporciona la lista de usuarios para actualizar
        if 'users' in data:
            new_users = data['users']

            # Limpiar la lista actual de usuarios asociados al packaging
            for existing_user in packaging.users:
                packaging.users.remove(existing_user)

            # Agregar nuevos usuarios al packaging
            for user_id in new_users:
                user = User.query.get(user_id)

                # Verificar si el usuario existe
                if user:
                    packaging.users.append(user)
                else:
                    return jsonify({'error': f'Usuario con ID {user_id} no encontrado'}), 404

            # Guardar los cambios en la base de datos
            db.session.commit()

            return jsonify({'message': 'Usuarios del packaging actualizados exitosamente'}), 200
        else:
            return jsonify({'error': 'Se requiere la lista de usuarios para actualizar'}), 400

    except Exception as e:
        # Manejo de errores
        print(f'Error en la ruta edit_packaging_users: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500


@api.route('/categories/<int:category_id>/products', methods=['GET'])
def search_products_in_category(category_id):
    try:
        # Obtén el término de búsqueda del parámetro de consulta
        search_term = request.args.get('name', '')

        # Obtener la categoría
        category = Categories.query.get(category_id)

        if category is None:
            return jsonify({'error': 'Categoría no encontrada'}), 404

        # Obtener los productos de la categoría filtrando por nombre
        products = Products.query.filter(
            Products.category_id == category.id,
            Products.nameesp.ilike(f'%{search_term}%')
        ).all()

        # Crear una lista para almacenar la información de cada producto
        products_info = []

        for product in products:

            # Agregar información relevante del producto a la lista
            product_info = {
                'id': product.id,
                'nameesp': product.nameesp,
                'nameeng': product.nameeng,
                'varietyesp': product.varietyesp,
                'varietyeng': product.varietyeng,
                'photo': product.photo,  # URL completa de la foto
                'category_id': product.category_id,
                'category_nameesp': product.category_nameesp_rel.nameesp if product.category_nameesp_rel else None,
                # Puedes agregar más campos según tus necesidades
            }
            products_info.append(product_info)

        # Completa la transacción con un COMMIT
        db.session.commit()

        # Devolver la lista de productos en formato JSON
        return jsonify({'category': {'nameesp': category.nameesp, 'nameeng': category.nameeng}, 'products': products_info})
    
    except Exception as e:
        # Manejo de errores
        return jsonify({'error': str(e)}), 500



@api.route('/categories/<int:category_id>/products/<int:product_id>', methods=['GET'])
def get_product_info_by_category(category_id, product_id):
    try:
        # Consulta el product y sus datos asociados
        product = Products.query.get(product_id)

        if not product:
            return jsonify({'error': 'Producto no encontrado'}), 404

        # Consulta los packagings asociados al product
        packagings = product.packagings

        # Lista para almacenar los datos de los packagings
        packaging_list = []

        for packaging in packagings:
            users = [user.serialize() for user in packaging.users]  # Obtén la información de los usuarios asociados al packaging
            packaging_data = {
                'id': packaging.id,
                'nameesp': packaging.nameesp,
                'nameeng': packaging.nameeng,
                'brand': packaging.brand,
                'presentation': packaging.presentation,
                'caliber': packaging.caliber,
                'weight_presentation_g': packaging.weight_presentation_g,
                'net_weight_kg': packaging.net_weight_kg,
                'box_size': packaging.box_size,
                'pallet_80x120': packaging.pallet_80x120,
                'net_weight_pallet_80x120_kg': packaging.net_weight_pallet_80x120_kg,
                'pallet_100x120': packaging.pallet_100x120,
                'net_weight_pallet_100x120_kg': packaging.net_weight_pallet_100x120_kg,
                'pallet_plane': packaging.pallet_plane,
                'net_weight_pallet_plane_kg': packaging.net_weight_pallet_plane_kg,
                'photo': packaging.photo,
                'photo2': packaging.photo2,
                'photo_url': f"http://localhost:5000/uploads/{product.category_nameesp_rel.nameesp}/{product.nameesp}/{unidecode(packaging.nameesp.replace(' ', '_'))}/{packaging.box_size.replace('*', '')}/{packaging.caliber}/{packaging.photo}",
                'photo2_url': f"http://localhost:5000/uploads/{product.category_nameesp_rel.nameesp}/{product.nameesp}/{unidecode(packaging.nameesp.replace(' ', '_'))}/{packaging.box_size.replace('*', '')}/{packaging.caliber}/{packaging.photo2}" if packaging.photo2 else None,
                'product_id': packaging.product_id,
                'users': users,
            }
            packaging_list.append(packaging_data)

        # Construye el diccionario con los datos del product y sus packagings
        product_data = {
            'id': product.id,
            'nameesp': product.nameesp,
            'nameeng': product.nameeng,
            'descriptionesp': product.descriptionesp,
            'descriptioneng': product.descriptioneng,
            'varietyesp': product.varietyesp,
            'varietyeng': product.varietyeng,
            'claimesp': product.claimesp,
            'claimeng': product.claimeng,
            'category_id': product.category_id,
            'category_nameesp': product.category_nameesp_rel.nameesp if product.category_nameesp_rel else None,
            'photo': product.photo,
            'photo2': product.photo2,
            'photo_url': f"http://localhost:5000/uploads/{product.category_nameesp_rel.nameesp}/{product.nameesp}/{product.photo}",
            'photo2_url': f"http://localhost:5000/uploads/{product.category_nameesp_rel.nameesp}/{product.nameesp}/{product.photo2}" if product.photo2 else None,
            'packagings': packaging_list,
            'months_production': product.months_production.split(',') if product.months_production else [],
        }

        # Completa la transacción con un COMMIT
        db.session.commit()

        # Devuelve la información en formato JSON
        return jsonify({'product': product_data}), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Error interno del servidor: {str(e)}'}), 500


# Nueva ruta para eliminar packagings

@api.route('/packagings/<int:packaging_id>', methods=['DELETE'])
def delete_packaging(packaging_id):
    try:
        # Busca el packaging por ID
        packaging = Packagings.query.get(packaging_id)

        if packaging is None:
            return jsonify({'error': 'Packaging no encontrado'}), 404

        # Elimina físicamente las photos asociadas al packaging
        photo_path = os.path.join(api.config['UPLOAD_FOLDER'], packaging.category_nameesp, packaging.product_nameesp, packaging.nameesp.replace(' ', '_'), packaging.box_size.replace('*', ''), packaging.caliber, packaging.photo)
        photo2_path = os.path.join(api.config['UPLOAD_FOLDER'], packaging.category_nameesp, packaging.product_nameesp, packaging.nameesp.replace(' ', '_'), packaging.box_size.replace('*', ''), packaging.caliber, packaging.photo2) if packaging.photo2 else None

        # Elimina las photos si existen
        if os.path.exists(photo_path):
            os.remove(photo_path)
        if photo2_path and os.path.exists(photo2_path):
            os.remove(photo2_path)

        # Elimina el packaging de la base de datos
        db.session.delete(packaging)
        db.session.commit()

        return jsonify({'message': 'Packaging eliminado correctamente'}), 200
    except Exception as e:
        # Manejo de errores
        return jsonify({'error': str(e)}), 500
