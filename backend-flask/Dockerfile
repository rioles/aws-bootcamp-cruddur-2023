# ------------------------
# Stage 1: Builder
# ------------------------
FROM python:3.10-slim-buster AS builder

WORKDIR /home/backend-flask

# Copy requirements and install packages
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# ------------------------
# Stage 2: Runtime
# ------------------------
FROM python:3.10-slim-buster

WORKDIR /home/backend-flask

# Copy site-packages and code from builder
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /home/backend-flask /home/backend-flask

# Environment variable
ENV FLASK_ENV=development

# Expose port
EXPOSE ${PORT}

# Run Flask
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=4567"]
