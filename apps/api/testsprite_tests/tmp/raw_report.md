
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** api
- **Date:** 2026-07-13
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 post api v1 auth otp request with valid and invalid phone numbers
- **Test Code:** [TC001_post_api_v1_auth_otp_request_with_valid_and_invalid_phone_numbers.py](./TC001_post_api_v1_auth_otp_request_with_valid_and_invalid_phone_numbers.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 43, in <module>
  File "<string>", line 39, in test_post_api_v1_auth_otp_request_with_valid_and_invalid_phone_numbers
AssertionError: Expected 400 for invalid phone 12345, got 200

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fc7c5be7-e776-4b8b-b955-7f806fcb5f31/084d8d2f-ff0c-4365-8b8b-662106be79c1
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 post api v1 admin auth login with valid and invalid credentials
- **Test Code:** [TC002_post_api_v1_admin_auth_login_with_valid_and_invalid_credentials.py](./TC002_post_api_v1_admin_auth_login_with_valid_and_invalid_credentials.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 38, in test_post_api_v1_admin_auth_login_with_valid_and_invalid_credentials
AssertionError: Expected 200, got 401

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 75, in <module>
  File "<string>", line 44, in test_post_api_v1_admin_auth_login_with_valid_and_invalid_credentials
AssertionError: Valid credentials test failed: Expected 200, got 401

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fc7c5be7-e776-4b8b-b955-7f806fcb5f31/cccab709-f65d-47f5-a1ff-d7e89152601d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 get api v1 services search with valid and invalid queries
- **Test Code:** [TC003_get_api_v1_services_search_with_valid_and_invalid_queries.py](./TC003_get_api_v1_services_search_with_valid_and_invalid_queries.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 87, in <module>
  File "<string>", line 30, in test_get_api_v1_services_search_with_valid_and_invalid_queries
AssertionError: Response JSON structure unexpected for valid query

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fc7c5be7-e776-4b8b-b955-7f806fcb5f31/e3675c2b-d4ed-4164-b1c1-ff0f23808404
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **0.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---