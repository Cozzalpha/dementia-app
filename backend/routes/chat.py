from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_socketio import emit, join_room, leave_room
from models import User, Message, Match, db
from datetime import datetime

chat_bp = Blueprint('chat', __name__)
socketio = None

def init_socketio(app):
    global socketio
    socketio = app.socketio

@chat_bp.route('/history/<int:user_id>', methods=['GET'])
@jwt_required()
def get_chat_history(user_id):
    current_user_id = get_jwt_identity()
    
    # Verify match exists
    match = Match.query.filter(
        ((Match.founder_id == current_user_id) & (Match.investor_id == user_id)) |
        ((Match.founder_id == user_id) & (Match.investor_id == current_user_id))
    ).first()
    
    if not match:
        return jsonify({'error': 'No match found between users'}), 404
    
    # Get messages between users
    messages = Message.query.filter(
        ((Message.sender_id == current_user_id) & (Message.receiver_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.receiver_id == current_user_id))
    ).order_by(Message.created_at).all()
    
    return jsonify({
        'messages': [{
            'id': msg.id,
            'sender_id': msg.sender_id,
            'receiver_id': msg.receiver_id,
            'content': msg.content,
            'created_at': msg.created_at.isoformat(),
            'read': msg.read
        } for msg in messages]
    }), 200

@chat_bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'receiver_id' not in data or 'content' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Verify match exists
    match = Match.query.filter(
        ((Match.founder_id == current_user_id) & (Match.investor_id == data['receiver_id'])) |
        ((Match.founder_id == data['receiver_id']) & (Match.investor_id == current_user_id))
    ).first()
    
    if not match:
        return jsonify({'error': 'No match found between users'}), 404
    
    # Create new message
    message = Message(
        sender_id=current_user_id,
        receiver_id=data['receiver_id'],
        content=data['content']
    )
    
    try:
        db.session.add(message)
        db.session.commit()
        
        # Emit message through WebSocket
        if socketio:
            room = f"chat_{min(current_user_id, data['receiver_id'])}_{max(current_user_id, data['receiver_id'])}"
            socketio.emit('new_message', {
                'id': message.id,
                'sender_id': message.sender_id,
                'receiver_id': message.receiver_id,
                'content': message.content,
                'created_at': message.created_at.isoformat()
            }, room=room)
        
        return jsonify({
            'message': 'Message sent successfully',
            'message_data': {
                'id': message.id,
                'sender_id': message.sender_id,
                'receiver_id': message.receiver_id,
                'content': message.content,
                'created_at': message.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/read/<int:message_id>', methods=['PUT'])
@jwt_required()
def mark_message_read(message_id):
    current_user_id = get_jwt_identity()
    message = Message.query.get_or_404(message_id)
    
    if message.receiver_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        message.read = True
        db.session.commit()
        
        return jsonify({
            'message': 'Message marked as read',
            'message_data': {
                'id': message.id,
                'sender_id': message.sender_id,
                'receiver_id': message.receiver_id,
                'content': message.content,
                'created_at': message.created_at.isoformat(),
                'read': message.read
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# WebSocket event handlers
@socketio.on('join')
@jwt_required()
def on_join(data):
    current_user_id = get_jwt_identity()
    other_user_id = data['user_id']
    
    # Create a unique room for the chat
    room = f"chat_{min(current_user_id, other_user_id)}_{max(current_user_id, other_user_id)}"
    join_room(room)
    
    emit('status', {'msg': f'User {current_user_id} has joined the room.'}, room=room)

@socketio.on('leave')
@jwt_required()
def on_leave(data):
    current_user_id = get_jwt_identity()
    other_user_id = data['user_id']
    
    room = f"chat_{min(current_user_id, other_user_id)}_{max(current_user_id, other_user_id)}"
    leave_room(room)
    
    emit('status', {'msg': f'User {current_user_id} has left the room.'}, room=room) 