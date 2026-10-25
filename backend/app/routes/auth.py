from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest, UserResponse, TokenResponse
from app.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user
from app.models.login_session import LoginSession
from app.schemas.auth import ChangePasswordRequest
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.security import decode_access_token
from fastapi import Request

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db)
):
    # Check if email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email
    )

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    data: LoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    # Find user by email
    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    # Don't reveal whether the email exists
    # or the password was incorrect.
    if not user or not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    
    # Create a unique session for this login
    login_session = LoginSession(
        user_id=user.id,
        device_name=request.headers.get(
            "user-agent",
            "Unknown device"
        )[:200],
    )

    db.add(login_session)
    db.flush()

    # Create JWT token linked to this session
    access_token = create_access_token(
        str(user.id),
        session_id=str(login_session.id),
    )

    db.commit()

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email
        )
    )

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return UserResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email
    )

@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
):
    # Verify the current password
    if not verify_password(
        data.current_password,
        current_user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Prevent reusing the same password
    if verify_password(
        data.new_password,
        current_user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different"
        )


    payload = decode_access_token(credentials.credentials)
    current_session_id = payload.get("sid")

    if not current_session_id:
      raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid login session. Please log in again.",
    )

    current_user.password_hash = hash_password(data.new_password)

# Revoke every other active session for this user
    db.query(LoginSession).filter(
    LoginSession.user_id == current_user.id,
    LoginSession.is_revoked.is_(False),
    LoginSession.id != current_session_id,
).update(
    {LoginSession.is_revoked: True},
    synchronize_session=False,
)

    db.commit()

    return {"message": "Password changed successfully"}