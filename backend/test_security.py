
from security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

# Test password hashing
password = "ManaHakkuTest123!"
hashed = hash_password(password)

assert hashed != password
assert verify_password(password, hashed)
assert not verify_password("WrongPassword123!", hashed)

# Test JWT creation and verification
token = create_access_token("test-user-123")
subject = decode_access_token(token)

assert subject == "test-user-123"

print("PASS: Password hashing works")
print("PASS: Password verification works")
print("PASS: JWT creation works")
print("PASS: JWT verification works")
