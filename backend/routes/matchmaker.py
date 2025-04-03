from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Company, Match, db
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

matchmaker_bp = Blueprint('matchmaker', __name__)

def calculate_company_similarity(company1, company2):
    """Calculate similarity between two companies based on their descriptions and industries."""
    # Combine company features into text
    text1 = f"{company1.description} {company1.industry}"
    text2 = f"{company2.description} {company2.industry}"
    
    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return similarity
    except:
        return 0.0

def calculate_match_score(founder, investor):
    """Calculate match score between a founder and an investor."""
    if not founder.company_id or not investor.company_id:
        return 0.0
    
    founder_company = Company.query.get(founder.company_id)
    investor_company = Company.query.get(investor.company_id)
    
    if not founder_company or not investor_company:
        return 0.0
    
    # Calculate base similarity score
    similarity_score = calculate_company_similarity(founder_company, investor_company)
    
    # Adjust score based on funding stage
    funding_stage_weights = {
        'seed': 1.0,
        'pre_seed': 0.9,
        'series_a': 0.8,
        'series_b': 0.7,
        'series_c': 0.6,
        'growth': 0.5
    }
    
    stage_weight = funding_stage_weights.get(founder_company.funding_stage.lower(), 0.5)
    
    # Final match score
    match_score = similarity_score * stage_weight
    
    return match_score

@matchmaker_bp.route('/matches', methods=['GET'])
@jwt_required()
def get_matches():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get all potential matches based on role
    if current_user.role == 'founder':
        potential_matches = User.query.filter_by(role='investor').all()
    else:
        potential_matches = User.query.filter_by(role='founder').all()
    
    matches = []
    for potential_match in potential_matches:
        # Skip if match already exists
        existing_match = Match.query.filter(
            ((Match.founder_id == current_user_id) & (Match.investor_id == potential_match.id)) |
            ((Match.founder_id == potential_match.id) & (Match.investor_id == current_user_id))
        ).first()
        
        if existing_match:
            continue
        
        # Calculate match score
        match_score = calculate_match_score(current_user, potential_match)
        
        if match_score > 0.3:  # Only include matches with score > 0.3
            matches.append({
                'user': {
                    'id': potential_match.id,
                    'name': potential_match.name,
                    'role': potential_match.role,
                    'bio': potential_match.bio
                },
                'match_score': match_score
            })
    
    # Sort matches by score
    matches.sort(key=lambda x: x['match_score'], reverse=True)
    
    return jsonify({
        'matches': matches[:10]  # Return top 10 matches
    }), 200

@matchmaker_bp.route('/connect', methods=['POST'])
@jwt_required()
def create_match():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'target_user_id' not in data:
        return jsonify({'error': 'Missing target user ID'}), 400
    
    target_user = User.query.get(data['target_user_id'])
    if not target_user:
        return jsonify({'error': 'Target user not found'}), 404
    
    current_user = User.query.get(current_user_id)
    
    # Determine founder and investor
    if current_user.role == 'founder':
        founder = current_user
        investor = target_user
    else:
        founder = target_user
        investor = current_user
    
    # Check if match already exists
    existing_match = Match.query.filter(
        ((Match.founder_id == founder.id) & (Match.investor_id == investor.id)) |
        ((Match.founder_id == investor.id) & (Match.investor_id == founder.id))
    ).first()
    
    if existing_match:
        return jsonify({'error': 'Match already exists'}), 409
    
    # Calculate match score
    match_score = calculate_match_score(founder, investor)
    
    # Create new match
    match = Match(
        founder_id=founder.id,
        investor_id=investor.id,
        match_score=match_score,
        status='pending'
    )
    
    try:
        db.session.add(match)
        db.session.commit()
        
        return jsonify({
            'message': 'Match created successfully',
            'match': {
                'id': match.id,
                'founder_id': match.founder_id,
                'investor_id': match.investor_id,
                'match_score': match.match_score,
                'status': match.status
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@matchmaker_bp.route('/matches/<int:match_id>/status', methods=['PUT'])
@jwt_required()
def update_match_status(match_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'status' not in data:
        return jsonify({'error': 'Missing status'}), 400
    
    match = Match.query.get_or_404(match_id)
    
    # Verify user is part of the match
    if current_user_id not in [match.founder_id, match.investor_id]:
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        match.status = data['status']
        db.session.commit()
        
        return jsonify({
            'message': 'Match status updated successfully',
            'match': {
                'id': match.id,
                'founder_id': match.founder_id,
                'investor_id': match.investor_id,
                'match_score': match.match_score,
                'status': match.status
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 