# Receipt Processing Bot

A Telegram bot built with NestJS that processes receipt images using OCR, helps categorize expenses, and automatically creates transactions in You Need A Budget (YNAB).

## Features

- Image OCR using Google Cloud Vision API
- Natural language processing for expense categorization
- Automatic YNAB transaction creation
- Telegram bot interface
- Redis-based state management
- Docker support

## How It Works

1. User sends a receipt photo to the Telegram bot
2. Google Cloud Vision API extracts text from the image
3. OpenAI processes the text to identify:
   - Store/merchant name
   - Total amount
   - Date of purchase
   - Individual items (if available)
4. The bot matches the merchant with YNAB payees
5. Based on the items and merchant, it suggests appropriate YNAB categories
6. A new transaction is created in YNAB with the extracted details
7. User receives a confirmation message with transaction details

## Prerequisites

- Node.js 20+
- pnpm
- Docker & Docker Compose (optional)
- Google Cloud Vision API credentials
- Telegram Bot Token
- OpenAI API Key
- YNAB Personal Access Token
- Redis server (if not using Docker)

## Setup

1. Clone the repository

```bash
git clone https://github.com/anonbeezy/receipt-formatter.git
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
cp env.sample .env
```

Edit the `.env` file with your credentials:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
OPENAI_API_KEY=your_openai_key
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
REDIS_URL=redis://localhost:6379
YNAB_ACCESS_TOKEN=your_ynab_token
YNAB_BUDGET_ID=your_budget_id
```

4. Set up YNAB Integration

- Log in to your YNAB account
- Go to Account Settings > Developer Settings
- Create a new Personal Access Token
- Copy the token to your .env file
- Get your budget ID from the YNAB URL when viewing your budget

4. Run the bot

```bash
pnpm start
```

## Configuration

Key configuration options in `config/`:

- `YNAB_DEFAULT_ACCOUNT`: ID of the default YNAB account for transactions
- `OCR_CONFIDENCE_THRESHOLD`: Minimum confidence score for OCR results (default: 0.8)
- `RECEIPT_PROCESSING_TIMEOUT`: Maximum time to process a receipt (default: 30s)

## Usage

1. Start a chat with your bot on Telegram
2. Send a receipt image to the bot
3. The bot will process the image and:
   - Extract text from the receipt
   - Categorize expenses
   - Calculate total amount
   - Create a new transaction in your YNAB budget
   - Return a confirmation with the YNAB transaction details

## Project Structure

```
src/
├── bot/          # Telegram bot handlers
├── ocr/          # OCR processing logic
├── nlp/          # Natural language processing
├── ynab/         # YNAB integration
└── redis/        # State management
```

## Development

### Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Run test coverage
pnpm test:cov
```

### Local Development

- Use `docker-compose.dev.yml` for local development
- Redis GUI available at `localhost:8001`
- API documentation available at `localhost:3000/api`
