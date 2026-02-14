# backend/src/models/user.py
"""
User Models
User, profile, and role management models
"""

import uuid
from datetime import datetime, timedelta
from typing import Optional, List
from enum import Enum as PyEnum

from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime, 
    Text, ForeignKey, Table, Enum, JSON, Index,
    UniqueConstraint, CheckConstraint, func, ARRAY
)
from sqlalchemy.orm import relationship, validates, backref
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.ext.hybrid import hybrid_property

from . import Base  # Changed from database.database import Base


# Association table for many-to-many user roles
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', PGUUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True),
    Column('assigned_at', DateTime, default=datetime.utcnow),
    Column('assigned_by', PGUUID(as_uuid=True), ForeignKey('users.id')),
    Index('idx_user_roles_user_id', 'user_id'),
    Index('idx_user_roles_role_id', 'role_id'),
)


# Association table for user followers/following
user_followers = Table(
    'user_followers',
    Base.metadata,
    Column('follower_id', PGUUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('followed_id', PGUUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('followed_at', DateTime, default=datetime.utcnow),
    CheckConstraint('follower_id != followed_id', name='check_no_self_follow'),
    Index('idx_user_followers_follower', 'follower_id'),
    Index('idx_user_followers_followed', 'followed_id'),
)


class UserRoleEnum(str, PyEnum):
    """User role enumeration"""
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    MODERATOR = "moderator"
    MANAGER = "manager"
    ANALYST = "analyst"
    CONTRIBUTOR = "contributor"
    USER = "user"
    VIEWER = "viewer"
    GUEST = "guest"


class UserStatusEnum(str, PyEnum):
    """User status enumeration"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    BANNED = "banned"
    PENDING = "pending"
    ARCHIVED = "archived"


class GenderEnum(str, PyEnum):
    """Gender enumeration"""
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class User(Base):
    """
    User model for authentication and basic user information
    """
    __tablename__ = "users"
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    public_id = Column(String(50), unique=True, index=True)  # Public-facing ID (e.g., u_abc123)
    
    # Authentication fields
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Security fields
    email_verified = Column(Boolean, default=False)
    email_verified_at = Column(DateTime, nullable=True)
    phone_verified = Column(Boolean, default=False)
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String(255), nullable=True)
    backup_codes = Column(JSON, nullable=True)  # Array of backup codes
    
    # User status
    status = Column(Enum(UserStatusEnum), default=UserStatusEnum.PENDING, index=True)
    is_active = Column(Boolean, default=True, index=True)
    is_staff = Column(Boolean, default=False)
    is_superuser = Column(Boolean, default=False)
    
    # Login tracking
    last_login = Column(DateTime, nullable=True)
    last_login_ip = Column(String(45), nullable=True)  # IPv4 or IPv6
    last_activity = Column(DateTime, nullable=True)
    login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), index=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime, nullable=True, index=True)  # Soft delete
    
    # Preferences (could be moved to separate table for performance)
    preferences = Column(JSON, default=dict)
    
    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    
    # Self-referential relationships (followers/following)
    followers = relationship(
        "User",
        secondary=user_followers,
        primaryjoin=(id == user_followers.c.followed_id),
        secondaryjoin=(id == user_followers.c.follower_id),
        backref=backref("following", lazy="dynamic"),
        lazy="dynamic"
    )
    
    # Social/OAuth connections
    social_accounts = relationship("SocialAccount", back_populates="user", cascade="all, delete-orphan")
    
    # Notification preferences
    notification_preferences = relationship("NotificationPreference", back_populates="user", cascade="all, delete-orphan")
    
    # Methods
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"
    
    def __str__(self):
        return f"{self.username} ({self.email})"
    
    @validates('email')
    def validate_email(self, key, email):
        """Validate email format"""
        if '@' not in email:
            raise ValueError("Invalid email format")
        return email.lower()
    
    @validates('username')
    def validate_username(self, key, username):
        """Validate username format"""
        if not username.replace('_', '').replace('.', '').isalnum():
            raise ValueError("Username can only contain alphanumeric characters, underscores, and dots")
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters long")
        return username.lower()
    
    @hybrid_property
    def full_name(self):
        """Get full name from profile if available"""
        if self.profile:
            return f"{self.profile.first_name} {self.profile.last_name}".strip()
        return None
    
    @hybrid_property
    def display_name(self):
        """Get display name (full name or username)"""
        if self.full_name:
            return self.full_name
        return self.username
    
    @hybrid_property
    def is_authenticated(self):
        """Check if user is authenticated"""
        return self.is_active and not self.deleted_at
    
    @hybrid_property
    def is_locked(self):
        """Check if user account is locked"""
        if self.locked_until:
            return datetime.utcnow() < self.locked_until
        return False
    
    def has_role(self, role_name: str) -> bool:
        """Check if user has a specific role"""
        return any(role.name == role_name for role in self.roles)
    
    def has_any_role(self, role_names: List[str]) -> bool:
        """Check if user has any of the specified roles"""
        user_role_names = {role.name for role in self.roles}
        return any(role_name in user_role_names for role_name in role_names)
    
    def has_all_roles(self, role_names: List[str]) -> bool:
        """Check if user has all specified roles"""
        user_role_names = {role.name for role in self.roles}
        return all(role_name in user_role_names for role_name in role_names)
    
    def has_permission(self, permission: str) -> bool:
        """Check if user has a specific permission"""
        # Superusers have all permissions
        if self.is_superuser:
            return True
        
        # Check permissions from all roles
        for role in self.roles:
            if permission in role.permissions or "*" in role.permissions:
                return True
        return False
    
    def add_role(self, role):
        """Add a role to user"""
        if role not in self.roles:
            self.roles.append(role)
    
    def remove_role(self, role):
        """Remove a role from user"""
        if role in self.roles:
            self.roles.remove(role)
    
    def follow(self, user):
        """Follow another user"""
        if user not in self.following:
            self.following.append(user)
    
    def unfollow(self, user):
        """Unfollow another user"""
        if user in self.following:
            self.following.remove(user)
    
    def is_following(self, user) -> bool:
        """Check if following another user"""
        return user in self.following
    
    def is_followed_by(self, user) -> bool:
        """Check if followed by another user"""
        return user in self.followers
    
    @classmethod
    def generate_public_id(cls):
        """Generate a public-facing ID"""
        import random
        import string
        return f"u_{''.join(random.choices(string.ascii_lowercase + string.digits, k=10))}"


class UserProfile(Base):
    """
    Extended user profile information
    """
    __tablename__ = "user_profiles"
    
    # Primary key (shared with User)
    id = Column(PGUUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    
    # Personal information
    first_name = Column(String(100))
    last_name = Column(String(100))
    display_name = Column(String(255))  # Custom display name
    
    # Demographics
    gender = Column(Enum(GenderEnum), nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    nationality = Column(String(100))
    language = Column(String(10), default="en")
    timezone = Column(String(50), default="UTC")
    
    # Contact information
    phone_number = Column(String(20))
    mobile_number = Column(String(20))
    website = Column(String(500))
    
    # Location
    address_line1 = Column(String(255))
    address_line2 = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))
    
    # Professional information
    job_title = Column(String(200))
    company = Column(String(200))
    department = Column(String(200))
    employee_id = Column(String(100))
    hire_date = Column(DateTime, nullable=True)
    biography = Column(Text)
    
    # Social media
    twitter_handle = Column(String(100))
    linkedin_url = Column(String(500))
    github_username = Column(String(100))
    
    # Visual representation
    avatar_url = Column(String(500))
    cover_image_url = Column(String(500))
    
    # Preferences
    theme = Column(String(20), default="light")  # light/dark/system
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    marketing_emails = Column(Boolean, default=False)
    
    # Custom fields
    custom_fields = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="profile")
    
    # Methods
    def __repr__(self):
        return f"<UserProfile(user_id={self.id}, name={self.first_name} {self.last_name})>"
    
    @hybrid_property
    def full_name(self) -> str:
        """Get full name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        return ""
    
    @hybrid_property
    def age(self) -> Optional[int]:
        """Calculate age from date of birth"""
        if self.date_of_birth:
            today = datetime.utcnow()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        return None
    
    @property
    def location(self) -> str:
        """Get formatted location"""
        parts = []
        if self.city:
            parts.append(self.city)
        if self.state:
            parts.append(self.state)
        if self.country:
            parts.append(self.country)
        return ", ".join(parts) if parts else ""
    
    def get_social_links(self) -> dict:
        """Get social media links"""
        links = {}
        if self.twitter_handle:
            links['twitter'] = f"https://twitter.com/{self.twitter_handle}"
        if self.linkedin_url:
            links['linkedin'] = self.linkedin_url
        if self.github_username:
            links['github'] = f"https://github.com/{self.github_username}"
        return links


class Role(Base):
    """
    Role model for permission management
    """
    __tablename__ = "roles"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Role information
    name = Column(String(50), unique=True, index=True, nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)  # ROLE_ADMIN, ROLE_USER, etc.
    description = Column(Text)
    level = Column(Integer, default=0)  # Hierarchy level (higher = more privileged)
    
    # Permissions
    permissions = Column(ARRAY(String), default=[])  # List of permission strings
    inherited_roles = Column(ARRAY(Integer), default=[])  # IDs of roles to inherit permissions from
    
    # System flag
    is_system = Column(Boolean, default=False, index=True)  # System roles cannot be deleted
    is_default = Column(Boolean, default=False, index=True)  # Assigned to new users
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    users = relationship("User", secondary=user_roles, back_populates="roles")
    
    # Methods
    def __repr__(self):
        return f"<Role(id={self.id}, name={self.name}, code={self.code})>"
    
    def has_permission(self, permission: str) -> bool:
        """Check if role has a specific permission"""
        # Check direct permissions
        if permission in self.permissions or "*" in self.permissions:
            return True
        
        # Check inherited roles (you'd need to fetch them from DB)
        return False
    
    def get_all_permissions(self) -> List[str]:
        """Get all permissions including inherited ones"""
        all_permissions = set(self.permissions)
        
        # Add inherited permissions (you'd need to implement this with actual DB queries)
        # This is a simplified version
        return list(all_permissions)
    
    def can_manage_role(self, target_role) -> bool:
        """Check if this role can manage another role (based on hierarchy)"""
        return self.level > target_role.level


class UserSession(Base):
    """
    User session tracking for security and analytics
    """
    __tablename__ = "user_sessions"
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Session information
    session_token = Column(String(500), unique=True, index=True, nullable=False)
    refresh_token = Column(String(500), unique=True, index=True, nullable=True)
    device_id = Column(String(255), index=True)  # Unique device identifier
    
    # Device information
    user_agent = Column(Text)
    ip_address = Column(String(45))  # IPv4 or IPv6
    location = Column(JSON)  # GeoIP data
    device_type = Column(String(50))  # mobile, desktop, tablet
    device_name = Column(String(255))  # iPhone 13, MacBook Pro, etc.
    os = Column(String(100))  # iOS 15, Windows 11, etc.
    browser = Column(String(100))  # Chrome, Safari, etc.
    
    # Session status
    is_active = Column(Boolean, default=True, index=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    revoked_at = Column(DateTime, nullable=True)
    revocation_reason = Column(String(255))
    
    # Usage statistics
    last_used_at = Column(DateTime, default=datetime.utcnow)
    usage_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), index=True)
    
    # Foreign keys
    user_id = Column(PGUUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    
    # Methods
    def __repr__(self):
        return f"<UserSession(id={self.id}, user_id={self.user_id}, device={self.device_name})>"
    
    @hybrid_property
    def is_valid(self):
        """Check if session is valid"""
        now = datetime.utcnow()
        return self.is_active and not self.revoked_at and now < self.expires_at
    
    def revoke(self, reason: str = "manual"):
        """Revoke session"""
        self.is_active = False
        self.revoked_at = datetime.utcnow()
        self.revocation_reason = reason
    
    def touch(self):
        """Update last used timestamp"""
        self.last_used_at = datetime.utcnow()
        self.usage_count += 1


class SocialAccount(Base):
    """
    Social/OAuth account connections
    """
    __tablename__ = "social_accounts"
    __table_args__ = (
        UniqueConstraint('provider', 'provider_user_id', name='uq_provider_user'),
        UniqueConstraint('user_id', 'provider', name='uq_user_provider'),
    )
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Provider information
    provider = Column(String(50), nullable=False, index=True)  # google, facebook, github, etc.
    provider_user_id = Column(String(255), nullable=False, index=True)  # ID from provider
    provider_email = Column(String(255), index=True)
    
    # Account information
    display_name = Column(String(255))
    profile_url = Column(String(500))
    avatar_url = Column(String(500))
    
    # Token information
    access_token = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    token_expires_at = Column(DateTime, nullable=True)
    
    # Additional data
    extra_data = Column(JSON, default=dict)
    
    # Status
    is_connected = Column(Boolean, default=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_used_at = Column(DateTime, nullable=True)
    
    # Foreign keys
    user_id = Column(PGUUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="social_accounts")
    
    # Methods
    def __repr__(self):
        return f"<SocialAccount(id={self.id}, provider={self.provider}, user_id={self.user_id})>"
    
    def disconnect(self):
        """Disconnect social account"""
        self.is_connected = False
        self.access_token = None
        self.refresh_token = None


class NotificationPreference(Base):
    """
    User notification preferences
    """
    __tablename__ = "notification_preferences"
    __table_args__ = (
        UniqueConstraint('user_id', 'notification_type', 'channel', name='uq_user_notification_channel'),
    )
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Notification settings
    notification_type = Column(String(100), nullable=False, index=True)  # system, email_digest, marketing, etc.
    channel = Column(String(50), nullable=False, index=True)  # email, push, sms, in_app
    is_enabled = Column(Boolean, default=True, index=True)
    
    # Frequency and timing
    frequency = Column(String(50), default="immediate")  # immediate, daily, weekly, never
    preferred_time = Column(String(10), nullable=True)  # HH:MM format
    
    # Customization
    filters = Column(JSON, default=dict)  # Category filters, importance levels, etc.
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Foreign keys
    user_id = Column(PGUUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="notification_preferences")
    
    # Methods
    def __repr__(self):
        return f"<NotificationPreference(id={self.id}, user_id={self.user_id}, type={self.notification_type})>"
    
    @hybrid_property
    def is_valid(self):
        """Check if session is valid"""
        now = datetime.utcnow()
        return self.is_active and not self.revoked_at and now < self.expires_at
    
    def revoke(self, reason: str = "manual"):
        """Revoke session"""
        self.is_active = False
        self.revoked_at = datetime.utcnow()
        self.revocation_reason = reason
    
    def touch(self):
        """Update last used timestamp"""
        self.last_used_at = datetime.utcnow()
        self.usage_count += 1


class SocialAccount(Base):
    """
    Social/OAuth account connections
    """
    __tablename__ = "social_accounts"
    __table_args__ = (
        UniqueConstraint('provider', 'provider_user_id', name='uq_provider_user'),
        UniqueConstraint('user_id', 'provider', name='uq_user_provider'),
    )
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Provider information
    provider = Column(String(50), nullable=False, index=True)  # google, facebook, github, etc.
    provider_user_id = Column(String(255), nullable=False, index=True)  # ID from provider
    provider_email = Column(String(255), index=True)
    
    # Account information
    display_name = Column(String(255))
    profile_url = Column(String(500))
    avatar_url = Column(String(500))
    
    # Token information
    access_token = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    token_expires_at = Column(DateTime, nullable=True)
    
    # Additional data
    extra_data = Column(JSON, default=dict)
    
    # Status
    is_connected = Column(Boolean, default=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_used_at = Column(DateTime, nullable=True)
    
    # Foreign keys
    user_id = Column(PGUUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="social_accounts")
    
    # Methods
    def __repr__(self):
        return f"<SocialAccount(id={self.id}, provider={self.provider}, user_id={self.user_id})>"
    
    def disconnect(self):
        """Disconnect social account"""
        self.is_connected = False
        self.access_token = None
        self.refresh_token = None


class NotificationPreference(Base):
    """
    User notification preferences
    """
    __tablename__ = "notification_preferences"
    __table_args__ = (
        UniqueConstraint('user_id', 'notification_type', 'channel', name='uq_user_notification_channel'),
    )
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Notification settings
    notification_type = Column(String(100), nullable=False, index=True)  # system, email_digest, marketing, etc.
    channel = Column(String(50), nullable=False, index=True)  # email, push, sms, in_app
    is_enabled = Column(Boolean, default=True, index=True)
    
    # Frequency and timing
    frequency = Column(String(50), default="immediate")  # immediate, daily, weekly, never
    preferred_time = Column(String(10), nullable=True)  # HH:MM format
    
    # Customization
    filters = Column(JSON, default=dict)  # Category filters, importance levels, etc.
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Foreign keys
    user_id = Column(PGUUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="notification_preferences")
    
    # Methods
    def __repr__(self):
        return f"<NotificationPreference(id={self.id}, user_id={self.user_id}, type={self.notification_type})>"


# Pre-defined system roles with permissions
SYSTEM_ROLES = [
    {
        "name": "Super Administrator",
        "code": "ROLE_SUPER_ADMIN",
        "description": "Full system access with all permissions",
        "level": 100,
        "permissions": ["*"],
        "is_system": True,
        "is_default": False
    },
    {
        "name": "Administrator",
        "code": "ROLE_ADMIN",
        "description": "System administrator with extensive privileges",
        "level": 90,
        "permissions": [
            "users:manage",
            "roles:manage",
            "assessments:manage",
            "reports:manage",
            "settings:manage",
            "analytics:view"
        ],
        "is_system": True,
        "is_default": False
    },
    {
        "name": "Manager",
        "code": "ROLE_MANAGER",
        "description": "Manager with elevated team management privileges",
        "level": 80,
        "permissions": [
            "users:view",
            "users:edit",
            "assessments:create",
            "assessments:edit",
            "reports:create",
            "reports:view_all",
            "teams:manage"
        ],
        "is_system": True,
        "is_default": False
    },
    {
        "name": "Analyst",
        "code": "ROLE_ANALYST",
        "description": "Data analyst with read and analyze permissions",
        "level": 70,
        "permissions": [
            "assessments:view",
            "reports:view",
            "analytics:view",
            "data:export"
        ],
        "is_system": True,
        "is_default": False
    },
    {
        "name": "Contributor",
        "code": "ROLE_CONTRIBUTOR",
        "description": "Content contributor with creation permissions",
        "level": 60,
        "permissions": [
            "assessments:create",
            "assessments:edit_own",
            "reports:create",
            "reports:edit_own"
        ],
        "is_system": True,
        "is_default": False
    },
    {
        "name": "User",
        "code": "ROLE_USER",
        "description": "Regular authenticated user",
        "level": 50,
        "permissions": [
            "profile:view",
            "profile:edit",
            "assessments:take",
            "reports:view_own",
            "notifications:manage"
        ],
        "is_system": True,
        "is_default": True  # Assigned to new users by default
    },
    {
        "name": "Viewer",
        "code": "ROLE_VIEWER",
        "description": "Read-only access user",
        "level": 40,
        "permissions": [
            "profile:view",
            "assessments:view_public",
            "reports:view_public"
        ],
        "is_system": True,
        "is_default": False
    },
    {
        "name": "Guest",
        "code": "ROLE_GUEST",
        "description": "Guest user with minimal permissions",
        "level": 10,
        "permissions": [
            "profile:view_public"
        ],
        "is_system": True,
        "is_default": False
    }
]


# Common permission strings for reference
PERMISSIONS = {
    # User permissions
    "users:view": "View users",
    "users:create": "Create users",
    "users:edit": "Edit users",
    "users:delete": "Delete users",
    "users:manage": "Full user management",
    
    # Role permissions
    "roles:view": "View roles",
    "roles:create": "Create roles",
    "roles:edit": "Edit roles",
    "roles:delete": "Delete roles",
    "roles:manage": "Full role management",
    "roles:assign": "Assign roles to users",
    
    # Assessment permissions
    "assessments:view": "View assessments",
    "assessments:view_public": "View public assessments",
    "assessments:create": "Create assessments",
    "assessments:edit": "Edit assessments",
    "assessments:edit_own": "Edit own assessments",
    "assessments:delete": "Delete assessments",
    "assessments:manage": "Full assessment management",
    "assessments:publish": "Publish assessments",
    "assessments:take": "Take assessments",
    "assessments:score": "Score assessments",
    
    # Report permissions
    "reports:view": "View reports",
    "reports:view_all": "View all reports",
    "reports:view_own": "View own reports",
    "reports:view_public": "View public reports",
    "reports:create": "Create reports",
    "reports:edit": "Edit reports",
    "reports:edit_own": "Edit own reports",
    "reports:delete": "Delete reports",
    "reports:manage": "Full report management",
    "reports:generate": "Generate reports",
    "reports:export": "Export reports",
    
    # Analytics permissions
    "analytics:view": "View analytics",
    "analytics:export": "Export analytics data",
    
    # System permissions
    "settings:view": "View settings",
    "settings:edit": "Edit settings",
    "settings:manage": "Full settings management",
    
    # Profile permissions
    "profile:view": "View profile",
    "profile:view_public": "View public profile",
    "profile:edit": "Edit profile",
    
    # Notification permissions
    "notifications:view": "View notifications",
    "notifications:manage": "Manage notification preferences",
    
    # Wildcard permissions
    "*": "All permissions"
}


# Example usage (commented out to avoid Pylance errors)
"""
# Example 1: Creating a new user
from models.user import User, UserProfile, Role
from core.security import hash_password

# Create user
user = User(
    email="alice@example.com",
    username="alice_smith",
    hashed_password=hash_password("secure_password123"),
    status="active",
    public_id=User.generate_public_id()
)

# Create profile
profile = UserProfile(
    first_name="Alice",
    last_name="Smith",
    job_title="Data Scientist",
    company="Tech Corp",
    user=user
)

# Example 2: Assigning roles and checking permissions
# This would typically be done in a service or view function
def assign_admin_role(user_id: str, db_session):
    admin_role = db_session.query(Role).filter_by(code="ROLE_ADMIN").first()
    if admin_role:
        user = db_session.query(User).get(user_id)
        if user:
            user.roles.append(admin_role)
            db_session.commit()

# Example 3: Session management
def create_user_session(user_id: str, device_info: dict):
    session_token = UserSession(
        user_id=user_id,
        session_token="unique_token_here",
        device_name=device_info.get("device_name"),
        os=device_info.get("os"),
        browser=device_info.get("browser"),
        expires_at=datetime.utcnow() + timedelta(days=7)  # Session expires in 7 days
    )
    return session_token

# Example 4: Checking permissions
def can_user_create_assessment(user: User) -> bool:
    return user.has_permission("assessments:create") or user.is_superuser
"""