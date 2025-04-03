from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'founder' or 'investor'
    bio = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    
    # Relationships
    company = db.relationship('Company', backref='users')
    sent_messages = db.relationship('Message', backref='sender', foreign_keys='Message.sender_id')
    received_messages = db.relationship('Message', backref='receiver', foreign_keys='Message.receiver_id')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    industry = db.Column(db.String(50))
    funding_stage = db.Column(db.String(50))
    valuation = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    funding_rounds = db.relationship('FundingRound', backref='company', lazy=True)
    projects = db.relationship('Project', backref='company', lazy=True)

class FundingRound(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    round_type = db.Column(db.String(50))  # seed, series_a, etc.
    amount = db.Column(db.Float)
    date = db.Column(db.DateTime)
    investors = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50))  # open, in_progress, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    collaborators = db.relationship('User', secondary='project_collaborators')

class ProjectCollaborator(db.Model):
    __tablename__ = 'project_collaborators'
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    founder_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    investor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    match_score = db.Column(db.Float)
    status = db.Column(db.String(50))  # pending, accepted, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    founder = db.relationship('User', foreign_keys=[founder_id])
    investor = db.relationship('User', foreign_keys=[investor_id]) 