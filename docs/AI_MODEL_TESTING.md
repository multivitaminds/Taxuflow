# AI Model Testing Guide for Taxu

## Overview

Taxu now supports multiple AI models for document extraction, with easy switching and A/B testing capabilities.

## Available Models

### GPT-4o (Default)
- **Provider**: OpenAI
- **Best for**: Fast, reliable general-purpose extraction
- **Current model**: Your existing production model

### Gemini 3 Pro Preview (New)
- **Provider**: Google
- **Best for**: Complex documents, superior OCR, better address parsing
- **Strengths**: 
  - Advanced multimodal reasoning
  - Better handling of poor-quality scans
  - More accurate city/address extraction
  - Superior with handwritten notes

### Claude 3.5 Sonnet (Available)
- **Provider**: Anthropic
- **Best for**: High accuracy, detail-oriented extraction
- **Strengths**: Excellent attention to detail, structured output

## Quick Start

### Test Gemini 3 Pro

Add this environment variable to your project:

```bash
EXTRACTION_MODEL=gemini-3-pro
```

That's it! Your document extraction will now use Gemini 3 Pro.

### Switch Back to GPT-4o

```bash
EXTRACTION_MODEL=gpt-4o
```

### A/B Testing Mode

To compare both models side-by-side (useful for evaluating accuracy):

```bash
ENABLE_MODEL_COMPARISON=true
COMPARISON_MODEL=gemini-3-pro
```

This will:
1. Run extraction with BOTH models simultaneously
2. Log both results for comparison
3. Use the primary model's result (but you can see both in logs)

## Recommended Testing Approach

### Phase 1: Test on Problem Documents
Start by testing Gemini 3 Pro on documents that have caused issues:
- Complex addresses (like "480 Cedar Lane, Apt 2B, Springfield, IL")
- Poor quality scans
- Handwritten entries
- Multi-page documents

### Phase 2: Side-by-Side Comparison
Enable comparison mode and process 20-30 real documents:

```bash
ENABLE_MODEL_COMPARISON=true
COMPARISON_MODEL=gemini-3-pro
```

Check your logs to compare extraction quality.

### Phase 3: Production Test
Once you're confident, switch your production environment:

```bash
EXTRACTION_MODEL=gemini-3-pro
ENABLE_MODEL_COMPARISON=false
```

## Monitoring Extraction Quality

Check your debug logs for model performance:

```typescript
// You'll see logs like this:
[v0] Using AI model: Gemini 3 Pro Preview (Google)
[v0] AI extraction successful
[v0] Document type: w2
[v0] Extracted city: Springfield // Check accuracy here!
```

## Cost Considerations

- **GPT-4o**: Fast, cost-effective for high volume
- **Gemini 3 Pro**: Available through Vercel AI Gateway (check your plan)
- **Claude 3.5**: Higher quality, potentially higher cost

All models are available through your existing Vercel AI Gateway integration - no additional API keys needed!

## Need Help?

If you see errors or unexpected behavior:
1. Check the environment variable is set correctly
2. Review debug logs for model selection
3. Verify your Vercel AI Gateway access includes the chosen model

## Future Enhancements

Consider adding:
- Automatic model selection based on document quality
- User preference for model selection
- Performance metrics dashboard
- Cost tracking per model
