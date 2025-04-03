from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Company, User, FundingRound, db
from datetime import datetime

company_bp = Blueprint('company', __name__)

@company_bp.route('/add', methods=['POST'])
@jwt_required()
def add_company():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user.role != 'founder':
        return jsonify({'error': 'Only founders can add companies'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'description', 'industry', 'funding_stage']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create new company
    company = Company(
        name=data['name'],
        description=data['description'],
        industry=data['industry'],
        funding_stage=data['funding_stage'],
        valuation=data.get('valuation')
    )
    
    try:
        db.session.add(company)
        db.session.commit()
        
        # Associate user with company
        user.company_id = company.id
        db.session.commit()
        
        return jsonify({
            'message': 'Company created successfully',
            'company': {
                'id': company.id,
                'name': company.name,
                'description': company.description,
                'industry': company.industry,
                'funding_stage': company.funding_stage,
                'valuation': company.valuation
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@company_bp.route('/<int:company_id>', methods=['GET'])
@jwt_required()
def get_company(company_id):
    company = Company.query.get_or_404(company_id)
    
    return jsonify({
        'id': company.id,
        'name': company.name,
        'description': company.description,
        'industry': company.industry,
        'funding_stage': company.funding_stage,
        'valuation': company.valuation,
        'created_at': company.created_at.isoformat(),
        'users': [{
            'id': user.id,
            'name': user.name,
            'role': user.role
        } for user in company.users],
        'funding_rounds': [{
            'id': round.id,
            'round_type': round.round_type,
            'amount': round.amount,
            'date': round.date.isoformat() if round.date else None,
            'investors': round.investors
        } for round in company.funding_rounds]
    }), 200

@company_bp.route('/<int:company_id>/funding', methods=['POST'])
@jwt_required()
def add_funding_round(company_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.company_id != company_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['round_type', 'amount', 'date']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create new funding round
    funding_round = FundingRound(
        company_id=company_id,
        round_type=data['round_type'],
        amount=data['amount'],
        date=datetime.fromisoformat(data['date']),
        investors=data.get('investors', '')
    )
    
    try:
        db.session.add(funding_round)
        db.session.commit()
        
        return jsonify({
            'message': 'Funding round added successfully',
            'funding_round': {
                'id': funding_round.id,
                'round_type': funding_round.round_type,
                'amount': funding_round.amount,
                'date': funding_round.date.isoformat(),
                'investors': funding_round.investors
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@company_bp.route('/<int:company_id>', methods=['PUT'])
@jwt_required()
def update_company(company_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.company_id != company_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    company = Company.query.get_or_404(company_id)
    data = request.get_json()
    
    try:
        # Update company fields
        for field in ['name', 'description', 'industry', 'funding_stage', 'valuation']:
            if field in data:
                setattr(company, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Company updated successfully',
            'company': {
                'id': company.id,
                'name': company.name,
                'description': company.description,
                'industry': company.industry,
                'funding_stage': company.funding_stage,
                'valuation': company.valuation
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 