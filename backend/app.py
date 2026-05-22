from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)

CORS(app)

connection = sqlite3.connect(
    'store.db',
    check_same_thread=False
)

cursor = connection.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS products(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price INTEGER,
    image TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS orders(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT,
    price INTEGER
)
''')

cursor.execute('SELECT * FROM products')

products_exist = cursor.fetchall()

if len(products_exist) == 0:

    cursor.execute('''
    INSERT INTO products(name, price, image)
    VALUES

    (
    'Headphones',
    1999,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
    ),

    (
    'Shoes',
    2999,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
    ),

    (
    'Watch',
    1499,
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49'
    )
    ''')

connection.commit()

connection.close()

@app.route('/')

def home():
    return "Backend is running"
@app.route('/products')

def get_products():

    connection = sqlite3.connect(
        'store.db',
        check_same_thread=False
    )

    cursor = connection.cursor()

    cursor.execute('SELECT * FROM products')

    products = cursor.fetchall()

    connection.close()

    product_list = []

    for product in products:

        product_list.append({
            "id": product[0],
            "name": product[1],
            "price": product[2],
            "image": product[3]
        })

    return jsonify(product_list)


@app.route('/add-product', methods=['POST'])

def add_product():

    data = request.json

    connection = sqlite3.connect(
        'store.db',
        check_same_thread=False
    )

    cursor = connection.cursor()

    cursor.execute(
        '''
        INSERT INTO products(name, price, image)
        VALUES (?, ?, ?)
        ''',
        (
            data['name'],
            data['price'],
            data['image']
        )
    )

    connection.commit()

    connection.close()

    return jsonify({
        "message": "Product added"
    })


@app.route('/signup', methods=['POST'])

def signup():

    data = request.json

    connection = sqlite3.connect(
        'store.db',
        check_same_thread=False
    )

    cursor = connection.cursor()

    cursor.execute(
        '''
        INSERT INTO users(username, password)
        VALUES (?, ?)
        ''',
        (
            data['username'],
            data['password']
        )
    )

    connection.commit()

    connection.close()

    return jsonify({
        "message": "Signup successful"
    })


@app.route('/login', methods=['POST'])

def login():

    data = request.json

    connection = sqlite3.connect(
        'store.db',
        check_same_thread=False
    )

    cursor = connection.cursor()

    cursor.execute(
        '''
        SELECT * FROM users
        WHERE username=? AND password=?
        ''',
        (
            data['username'],
            data['password']
        )
    )

    user = cursor.fetchone()

    connection.close()

    if user:

        return jsonify({
            "message": "Login successful"
        })

    else:

        return jsonify({
            "message": "Invalid credentials"
        })


@app.route('/place-order', methods=['POST'])

def place_order():

    data = request.json

    connection = sqlite3.connect(
        'store.db',
        check_same_thread=False
    )

    cursor = connection.cursor()

    for item in data:

        cursor.execute(
            '''
            INSERT INTO orders(product_name, price)
            VALUES (?, ?)
            ''',
            (
                item['name'],
                item['price']
            )
        )

    connection.commit()

    connection.close()

    return jsonify({
        "message": "Order placed successfully"
    })


if __name__ == '__main__':
    app.run(debug=True)