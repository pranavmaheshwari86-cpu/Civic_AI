import requests

BASE_URL = "http://localhost:3000"
LOGIN_ENDPOINT = "/api/v1/admin/auth/login"
TIMEOUT = 30
HEADERS = {"Content-Type": "application/json"}


def test_post_api_v1_admin_auth_login_with_valid_and_invalid_credentials():
    url = BASE_URL + LOGIN_ENDPOINT

    # Valid admin credentials (replace with known valid credentials)
    valid_payload = {
        "email": "admin@example.com",
        "password": "CorrectPassword123!"
    }

    # Invalid credentials (wrong password)
    invalid_payload = {
        "email": "admin@example.com",
        "password": "WrongPassword"
    }

    # Missing credentials - various cases
    missing_email_payload = {
        "password": "SomePassword"
    }

    missing_password_payload = {
        "email": "admin@example.com"
    }

    empty_payload = {}

    # Test valid credentials: expect 200 with a session token in response
    response = requests.post(url, json=valid_payload, headers=HEADERS, timeout=TIMEOUT)
    try:
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        json_response = response.json()
        # Assume token is provided as "token" or "sessionToken"
        token = json_response.get("token") or json_response.get("sessionToken")
        assert token and isinstance(token, str) and len(token) > 0, "Session token missing or invalid"
    except Exception as e:
        raise AssertionError(f"Valid credentials test failed: {e}")

    # Test invalid credentials: expect 401 Unauthorized
    response = requests.post(url, json=invalid_payload, headers=HEADERS, timeout=TIMEOUT)
    try:
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    except Exception as e:
        raise AssertionError(f"Invalid credentials test failed: {e}")

    # Test missing email: expect 400 validation error
    response = requests.post(url, json=missing_email_payload, headers=HEADERS, timeout=TIMEOUT)
    try:
        assert response.status_code == 400, f"Expected 400 for missing email, got {response.status_code}"
    except Exception as e:
        raise AssertionError(f"Missing email test failed: {e}")

    # Test missing password: expect 400 validation error
    response = requests.post(url, json=missing_password_payload, headers=HEADERS, timeout=TIMEOUT)
    try:
        assert response.status_code == 400, f"Expected 400 for missing password, got {response.status_code}"
    except Exception as e:
        raise AssertionError(f"Missing password test failed: {e}")

    # Test empty payload: expect 400 validation error
    response = requests.post(url, json=empty_payload, headers=HEADERS, timeout=TIMEOUT)
    try:
        assert response.status_code == 400, f"Expected 400 for empty payload, got {response.status_code}"
    except Exception as e:
        raise AssertionError(f"Empty payload test failed: {e}")


test_post_api_v1_admin_auth_login_with_valid_and_invalid_credentials()