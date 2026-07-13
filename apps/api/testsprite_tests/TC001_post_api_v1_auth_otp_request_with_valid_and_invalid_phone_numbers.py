import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30
HEADERS = {
    "Content-Type": "application/json"
}

def test_post_api_v1_auth_otp_request_with_valid_and_invalid_phone_numbers():
    url = f"{BASE_URL}/api/v1/auth/otp/request"

    valid_phone_numbers = [
        "+14155552671",
        "+919876543210",
        "+442071838750"
    ]
    invalid_phone_numbers = [
        "12345",
        "phone123",
        "+1234-abc-5678",
        "",           # empty string
        "++123456789" # malformed
    ]

    # Test valid phone numbers - expect 200
    for phone in valid_phone_numbers:
        payload = {"phone": phone}
        try:
            response = requests.post(url, json=payload, headers=HEADERS, timeout=TIMEOUT)
            assert response.status_code == 200, f"Expected 200 for valid phone {phone}, got {response.status_code}"
        except requests.RequestException as e:
            assert False, f"Request failed for valid phone {phone}: {e}"

    # Test invalid or malformed phone numbers - expect 400
    for phone in invalid_phone_numbers:
        payload = {"phone": phone}
        try:
            response = requests.post(url, json=payload, headers=HEADERS, timeout=TIMEOUT)
            assert response.status_code == 400, f"Expected 400 for invalid phone {phone}, got {response.status_code}"
        except requests.RequestException as e:
            assert False, f"Request failed for invalid phone {phone}: {e}"

test_post_api_v1_auth_otp_request_with_valid_and_invalid_phone_numbers()