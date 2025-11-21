import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API for managing transport company content (services, regions, news, schedule)
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    params = event.get('queryStringParameters') or {}
    entity = params.get('entity', '')
    
    try:
        if method == 'GET':
            if entity == 'services':
                cursor.execute('SELECT * FROM services ORDER BY id')
                data = cursor.fetchall()
            elif entity == 'regions':
                cursor.execute('SELECT * FROM regions ORDER BY id')
                data = cursor.fetchall()
            elif entity == 'news':
                cursor.execute('SELECT * FROM news ORDER BY created_at DESC')
                data = cursor.fetchall()
            elif entity == 'schedule':
                cursor.execute('SELECT * FROM schedule ORDER BY id')
                data = cursor.fetchall()
            elif entity == 'company_info':
                cursor.execute('SELECT * FROM company_info')
                data = cursor.fetchall()
            else:
                cursor.execute('SELECT * FROM services ORDER BY id')
                services = cursor.fetchall()
                cursor.execute('SELECT * FROM regions ORDER BY id')
                regions = cursor.fetchall()
                cursor.execute('SELECT * FROM news ORDER BY created_at DESC LIMIT 10')
                news = cursor.fetchall()
                cursor.execute('SELECT * FROM schedule ORDER BY id')
                schedule = cursor.fetchall()
                cursor.execute('SELECT * FROM company_info')
                company_info = cursor.fetchall()
                
                data = {
                    'services': services,
                    'regions': regions,
                    'news': news,
                    'schedule': schedule,
                    'company_info': company_info
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(data, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            if entity == 'services':
                cursor.execute(
                    "INSERT INTO services (icon, title, description, color) VALUES (%s, %s, %s, %s) RETURNING *",
                    (body_data['icon'], body_data['title'], body_data['description'], body_data['color'])
                )
            elif entity == 'regions':
                cursor.execute(
                    "INSERT INTO regions (name, passengers, routes) VALUES (%s, %s, %s) RETURNING *",
                    (body_data['name'], body_data['passengers'], body_data['routes'])
                )
            elif entity == 'news':
                cursor.execute(
                    "INSERT INTO news (date, title, category, content) VALUES (%s, %s, %s, %s) RETURNING *",
                    (body_data['date'], body_data['title'], body_data['category'], body_data.get('content', ''))
                )
            elif entity == 'schedule':
                cursor.execute(
                    "INSERT INTO schedule (route, departure, arrival, transport) VALUES (%s, %s, %s, %s) RETURNING *",
                    (body_data['route'], body_data['departure'], body_data['arrival'], body_data['transport'])
                )
            
            conn.commit()
            result = cursor.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            item_id = body_data.get('id')
            
            if entity == 'services':
                cursor.execute(
                    "UPDATE services SET icon=%s, title=%s, description=%s, color=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s RETURNING *",
                    (body_data['icon'], body_data['title'], body_data['description'], body_data['color'], item_id)
                )
            elif entity == 'regions':
                cursor.execute(
                    "UPDATE regions SET name=%s, passengers=%s, routes=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s RETURNING *",
                    (body_data['name'], body_data['passengers'], body_data['routes'], item_id)
                )
            elif entity == 'news':
                cursor.execute(
                    "UPDATE news SET date=%s, title=%s, category=%s, content=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s RETURNING *",
                    (body_data['date'], body_data['title'], body_data['category'], body_data.get('content', ''), item_id)
                )
            elif entity == 'schedule':
                cursor.execute(
                    "UPDATE schedule SET route=%s, departure=%s, arrival=%s, transport=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s RETURNING *",
                    (body_data['route'], body_data['departure'], body_data['arrival'], body_data['transport'], item_id)
                )
            elif entity == 'company_info':
                cursor.execute(
                    "UPDATE company_info SET value=%s, updated_at=CURRENT_TIMESTAMP WHERE key=%s RETURNING *",
                    (body_data['value'], body_data['key'])
                )
            
            conn.commit()
            result = cursor.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            item_id = body_data.get('id')
            
            if entity == 'services':
                cursor.execute("DELETE FROM services WHERE id=%s", (item_id,))
            elif entity == 'regions':
                cursor.execute("DELETE FROM regions WHERE id=%s", (item_id,))
            elif entity == 'news':
                cursor.execute("DELETE FROM news WHERE id=%s", (item_id,))
            elif entity == 'schedule':
                cursor.execute("DELETE FROM schedule WHERE id=%s", (item_id,))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
    
    finally:
        cursor.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
