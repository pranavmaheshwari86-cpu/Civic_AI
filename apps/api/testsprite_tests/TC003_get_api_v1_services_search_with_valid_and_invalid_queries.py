import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_get_api_v1_services_search_with_valid_and_invalid_queries():
    endpoint = f"{BASE_URL}/api/v1/services/search"
    headers = {
        "Accept": "application/json"
    }

    # Test with relevant keyword query - expect 200 with matching services (non-empty list)
    params_valid = {"q": "health"}  # example relevant keyword
    try:
        response_valid = requests.get(endpoint, headers=headers, params=params_valid, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request with valid query failed: {e}"
    assert response_valid.status_code == 200, f"Expected 200 but got {response_valid.status_code} for valid query"
    try:
        data_valid = response_valid.json()
    except ValueError:
        assert False, "Response with valid query is not valid JSON"
    # Accept response as dict with 'services' key or list directly
    if isinstance(data_valid, dict) and "services" in data_valid:
        services_list = data_valid["services"]
        assert isinstance(services_list, list), "services key should contain a list"
    elif isinstance(data_valid, list):
        services_list = data_valid
    else:
        assert False, "Response JSON structure unexpected for valid query"

    # Test with empty query - expect 400 validation error or 200 with no matches (empty service list)
    params_empty = {"q": ""}
    try:
        response_empty = requests.get(endpoint, headers=headers, params=params_empty, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request with empty query failed: {e}"
    if response_empty.status_code == 400:
        # expected validation error
        try:
            data_empty = response_empty.json()
        except ValueError:
            assert False, "Response with empty query and 400 status is not valid JSON"
        # Could check for error message presence if exists
        assert "error" in data_empty or "message" in data_empty or data_empty != {}, "Expected error info in response"
    elif response_empty.status_code == 200:
        try:
            data_empty = response_empty.json()
        except ValueError:
            assert False, "Response with empty query and 200 status is not valid JSON"
        if isinstance(data_empty, dict) and "services" in data_empty:
            services_empty = data_empty["services"]
            assert isinstance(services_empty, list), "Services key should have list in empty query response"
            assert len(services_empty) == 0, "Expected no matching services with empty query"
        else:
            # Unexpected structure, fail
            assert False, "Unexpected response structure for empty query with 200 status"
    else:
        assert False, f"Unexpected status code {response_empty.status_code} for empty query"

    # Test with unsupported query - expect 400 validation error or 200 with no matches
    params_unsupported = {"q": "!!!@@@###"}
    try:
        response_unsupported = requests.get(endpoint, headers=headers, params=params_unsupported, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request with unsupported query failed: {e}"
    if response_unsupported.status_code == 400:
        try:
            data_unsup = response_unsupported.json()
        except ValueError:
            assert False, "Response with unsupported query and 400 status is not valid JSON"
        assert "error" in data_unsup or "message" in data_unsup or data_unsup != {}, "Expected error info in response"
    elif response_unsupported.status_code == 200:
        try:
            data_unsup = response_unsupported.json()
        except ValueError:
            assert False, "Response with unsupported query and 200 status is not valid JSON"
        if isinstance(data_unsup, dict) and "services" in data_unsup:
            services_unsup = data_unsup["services"]
            assert isinstance(services_unsup, list), "Services key should have list in unsupported query response"
            assert len(services_unsup) == 0, "Expected no matching services with unsupported query"
        else:
            assert False, "Unexpected response structure for unsupported query with 200 status"
    else:
        assert False, f"Unexpected status code {response_unsupported.status_code} for unsupported query"

test_get_api_v1_services_search_with_valid_and_invalid_queries()