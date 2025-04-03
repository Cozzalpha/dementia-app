from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Company, db
from werkzeug.security import generate_password_hash

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    return jsonify({
        'id': user.id,
        'email': user.email,
        'name': user.name,
        'role': user.role,
        'bio': user.bio,
        'company': {
            'id': user.company.id,
            'name': user.company.name,
            'industry': user.company.industry,
            'funding_stage': user.company.funding_stage,
            'valuation': user.company.valuation
        } if user.company else None
    }), 200

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    data = request.get_json()
    
    try:
        # Update user fields
        if 'name' in data:
            user.name = data['name']
        if 'bio' in data:
            user.bio = data['bio']
        if 'password' in data:
            user.password_hash = generate_password_hash(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'bio': user.bio
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/search', methods=['GET'])
@jwt_required()
def search_users():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # Get query parameters
    query = request.args.get('q', '')
    role = request.args.get('role')
    industry = request.args.get('industry')
    
    # Build query
    user_query = User.query.filter(User.id != current_user_id)
    
    if query:
        user_query = user_query.filter(
            (User.name.ilike(f'%{query}%')) |
            (User.bio.ilike(f'%{query}%'))
        )
    
    if role:
        user_query = user_query.filter(User.role == role)
    
    if industry:
        user_query = user_query.join(Company).filter(Company.industry == industry)
    
    # Get results
    users = user_query.limit(20).all()
    
    return jsonify({
        'users': [{
            'id': user.id,
            'name': user.name,
            'role': user.role,
            'bio': user.bio,
            'company': {
                'id': user.company.id,
                'name': user.company.name,
                'industry': user.company.industry,
                'funding_stage': user.company.funding_stage
            } if user.company else None
        } for user in users]
    }), 200

@user_bp.route('/connections', methods=['GET'])
@jwt_required()
def get_connections():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # Get all matches for the current user
    if current_user.role == 'founder':
        matches = Match.query.filter_by(founder_id=current_user_id).all()
        connected_users = [match.investor for match in matches]
    else:
        matches = Match.query.filter_by(investor_id=current_user_id).all()
        connected_users = [match.founder for match in matches]
    
    return jsonify({
        'connections': [{
            'id': user.id,
            'name': user.name,
            'role': user.role,
            'bio': user.bio,
            'company': {
                'id': user.company.id,
                'name': user.company.name,
                'industry': user.company.industry,
                'funding_stage': user.company.funding_stage
            } if user.company else None
        } for user in connected_users]
    }), 200

@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'role': user.role,
        'bio': user.bio,
        'company': {
            'id': user.company.id,
            'name': user.company.name,
            'industry': user.company.industry,
            'funding_stage': user.company.funding_stage,
            'valuation': user.company.valuation
        } if user.company else None
    }), 200 