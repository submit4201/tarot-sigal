# Imagen 4 Prompt Optimization

## Overview
The prompt builder has been optimized for **Google's Imagen 4** - the latest photorealistic image generation model. Imagen 4 excels at:

- **Photorealistic rendering** with natural lighting
- **Rich color palettes** and cinematic composition  
- **Intricate details** - textures, patterns, fine elements
- **Complex prompt understanding** - responds well to detailed scene descriptions
- **Consistent character/element rendering** across variations

## How It Works

### Model Detection
The `_enhance_for_model()` method detects the model parameter and applies specific quality tags:

```python
if "imagen4" in model_key or "imagen 4" in model_key:
    quality_tags = (
        "highly detailed, photorealistic rendering, sharp focus, "
        "rich color palette, cinematic composition, professional illustration, "
        "intricate details, perfect lighting, tarot card format"
    )
```

### Usage

Generate prompts optimized for Imagen 4:

```bash
# Use --model imagen4 when generating prompts
py -m tarot_gen.prompt_builder --input-dir tarot_gen/data/input --model imagen4

# Or specify individual deck
py -m tarot_gen.prompt_builder --deck tarot_gen/data/input/my_deck.json --model imagen4
```

### What Changes

For each card prompt, the builder:

1. **Generates base prompt** using Puter AI → OpenRouter → DashScope (with fallback)
2. **Enhances with Imagen 4 tags**:
   - Adds photorealistic quality descriptors
   - Includes cinematic composition cues
   - Emphasizes sharp focus and rich detail
   - Specifies "tarot card format" for consistency

Example transformation:

**Before enhancement:**
```
A figure holding their own anxious or avoidant patterns—self-awareness transforming insecure attachment through therapeutic work...
```

**After Imagen 4 enhancement:**
```
A figure holding their own anxious or avoidant patterns—self-awareness transforming insecure attachment through therapeutic work..., psychological realism blended with abstract emotional architecture..., highly detailed, photorealistic rendering, sharp focus, rich color palette, cinematic composition, professional illustration, intricate details, perfect lighting, tarot card format
```

## Model Variants Supported

The prompt builder supports these models with specific optimizations:

| Model | Best For | Quality Tags |
|-------|----------|--------------|
| **imagen4** | Photorealism, rich detail, complex scenes | photorealistic rendering, cinematic composition, intricate details |
| **imagen3** | Coherent composition, natural lighting | detailed, coherent, natural lighting, rich details |
| imagen | General use | photoreal lighting, clean details |
| flux | Style consistency, sharp details | crisp details, sharp focus |
| klein | Painterly look, mood | painterly detail, moody atmosphere |
| zimage | High contrast, drama | high contrast, dramatic lighting |
| gptimage | Editorial quality | editorial quality, refined details |

## Tips for Best Results

1. **Descriptive prompts matter**: Imagen 4 responds well to detailed scene descriptions. The initial prompt generation focuses on concrete visuals, colors, and composition.

2. **Color palette specificity**: Include specific color ranges (e.g., "warm golds," "cool indigos") - Imagen 4 excels at rich, nuanced palettes.

3. **Composition guidance**: Phrases like "centered composition," "dynamic positioning," "layered depth" help Imagen 4 create balanced cards.

4. **Detail levels**: Imagen 4 can handle "intricate patterns," "fine textures," "delicate details" without becoming cluttered.

5. **Lighting descriptions**: "Perfect lighting," "cinematic shadows," "warm rim lighting" guide Imagen 4's photorealistic rendering.

## Example Generated Prompts (Imagen 4)

### Cognitive Bias Deck - Optimism Bias Card
```
A figure bathed in golden light with rosy-tinted glasses, neural pathways glowing warm, optimistic bias visible as selective color enhancement, confirmation bias as filtered reality, optimistic distortion of facts rendered visible through light refraction, bias illustrated as cognitive filter over objective reality, psychological distortion rendered as visual phenomenon, highly detailed, photorealistic rendering, sharp focus, rich color palette, cinematic composition, professional illustration, intricate details, perfect lighting, tarot card format
```

### Trauma & Integration Deck - Freeze Response
```
Figure frozen mid-motion, dorsal vagal blue rendering body immobile, clinical visualization of freeze response, cold shutdown tones, survival through stillness, nervous system state visible through physiological immobilization, trauma response as protective mechanism rendered literal, psyche rendered as body, highly detailed, photorealistic rendering, sharp focus, rich color palette, cinematic composition, professional illustration, intricate details, perfect lighting, tarot card format
```

## Performance Notes

- **Default model**: Changed from "flux" to "imagen4" in CLI
- **Generation time**: Unchanged - optimization happens during prompt enhancement, not generation
- **API compatibility**: Works with any image generation service that accepts detailed text prompts
- **Fallback behavior**: If Imagen 4 provider not available, fall back to other models or generic enhancement

## Future Enhancements

Planned improvements:
- Imagen 4 vision-based refinement (reference image guidance)
- Aspect ratio optimization for portrait/landscape cards
- Seasonal/thematic color palette injection for cohesive decks
- Diversity modifiers to prevent style repetition across 78 cards
