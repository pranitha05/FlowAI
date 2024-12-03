""" Generate a secret key for JWT token. """

""" Step 1: Import required libraries """
import secrets

""" Step 2: Generate a secret key """
secret_key = secrets.token_urlsafe(32)
print(secret_key)
