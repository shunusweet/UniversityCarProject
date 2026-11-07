
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const OpenAI = require("openai");
const Replicate = require("replicate");

// ============================================
// API CONFIGURATION
// ============================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// ============================================
// HELPER: IMAGE RESPONSE
// ============================================

const getImageResult = (imageData) => {
  if (imageData.url) {
    return imageData.url;
  }

  if (imageData.b64_json) {
    return `data:image/png;base64,${imageData.b64_json}`;
  }

  return null;
};

// ============================================
// 1. GENERATE AI RESPONSE
// ============================================

const generateAIResponse = async (req, res) => {
  const prompt = req.body.prompt?.trim();
  const originalImagePath = req.file?.path;

  const visualKeywords = [
    "image of",
    "photo of",
    "drawing of",
    "illustration",
    "generate image",
    "realistic",
    "fantasy",
    "scene",
    "painting",
    "render",
    "design",
    "logo",
    "a car",
    "a person",
    "a city",
    "picture",
    "visual",
    "beautiful",
    "model",
    "digital art",
    "ultra realistic",
    "studio",
    "artwork",
  ];

  const isVisualPrompt = prompt
    ? visualKeywords.some((kw) =>
        prompt.toLowerCase().includes(kw)
      )
    : false;

  try {
    // Image only: Generate variation
    if (originalImagePath && !prompt) {
      const parsed = path.parse(originalImagePath);

      const convertedImagePath = path.join(
        parsed.dir,
        `${parsed.name}-converted.png`
      );

      await sharp(originalImagePath)
        .resize(1024, 1024)
        .ensureAlpha()
        .png()
        .toFile(convertedImagePath);

      const imageResponse =
        await openai.images.createVariation({
          image: fs.createReadStream(convertedImagePath),
          n: 1,
          size: "1024x1024",
        });

      return res.status(200).json({
        success: true,
        type: "image_variation",
        url: getImageResult(imageResponse.data[0]),
      });
    }

    // Prompt only
    if (prompt && !originalImagePath) {
      if (isVisualPrompt) {
        const imageResponse =
          await openai.images.generate({
            model: "gpt-image-1",
            prompt,
            n: 1,
            size: "1024x1024",
          });

        return res.status(200).json({
          success: true,
          type: "image_generated",
          url: getImageResult(imageResponse.data[0]),
        });
      }

      const chatResponse =
        await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "gpt-4o-mini",
        });

      return res.status(200).json({
        success: true,
        type: "text_generated",
        response: chatResponse.choices[0].message.content,
      });
    }

    // Both prompt and image
    if (prompt && originalImagePath) {
      if (isVisualPrompt) {
        const imageResponse =
          await openai.images.generate({
            model: "gpt-image-1",
            prompt,
            n: 1,
            size: "1024x1024",
          });

        return res.status(200).json({
          success: true,
          type: "image_generated_from_prompt",
          url: getImageResult(imageResponse.data[0]),
        });
      }

      const chatResponse =
        await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "gpt-4o-mini",
        });

      return res.status(200).json({
        success: true,
        type: "text_generated_from_prompt_with_image",
        response: chatResponse.choices[0].message.content,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Please provide a prompt or an image.",
    });
  } catch (error) {
    console.error("AI Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================================
// 2. GENERATE REPLICATE IMAGE
// ============================================

const generateReplicateImage = async (req, res) => {
  const prompt = req.body.prompt?.trim();

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Prompt is required",
    });
  }

  try {
    const prediction = await replicate.predictions.create({
      version:
        "784f2ade7f143eec054227ada3603908f56c0d1f941d50c6dab42545dba89f63",

      input: {
        prompt,

        lora_scale: 0.8,

        negative_prompt:
          "blurry, low resolution, bad hands, disfigured, cartoonish",
      },
    });

    let finalResult = prediction;

    while (
      !["succeeded", "failed", "canceled"].includes(
        finalResult.status
      )
    ) {
      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      finalResult = await replicate.predictions.get(
        finalResult.id
      );
    }

    if (finalResult.status === "succeeded") {
      const output = finalResult.output;

      const imageUrl = Array.isArray(output)
        ? output[0]
        : output?.image || output;

      if (!imageUrl) {
        return res.status(500).json({
          success: false,
          message: "Image URL was not returned",
        });
      }

      return res.status(200).json({
        success: true,
        type: "replicate_image_generated",
        imageUrl,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Image generation failed",
      status: finalResult.status,
    });
  } catch (error) {
    console.error("Replicate Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate image from Replicate",
    });
  }
};

// ============================================
// 3. GENERATE OPENAI RESPONSE
// ============================================

const generateOpenAIResponse = async (req, res) => {
  const { prompt, inputType } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Prompt is required",
    });
  }

  try {
    let output;

    if (inputType === "image") {
      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      });

      output = getImageResult(response.data[0]);
    } else {
      const response =
        await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

      output = response.choices[0].message.content;
    }

    return res.status(200).json({
      success: true,
      type:
        inputType === "image"
          ? "image_generated"
          : "text_generated",
      output,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate from OpenAI API",
    });
  }
};

// ============================================
// 4. GENERATE OPENAI TEXT
// ============================================

const generateOpenAIText = async (req, res) => {
  const {
    prompt,
    model = "gpt-4.1-mini",
  } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Prompt is required",
    });
  }

  try {
    const response = await openai.responses.create({
      model,
      input: prompt,
      max_output_tokens: 1000,
    });

    return res.status(200).json({
      success: true,
      type: "text_generated",
      output: response.output_text,
    });
  } catch (error) {
    console.error(
      "OpenAI Text API Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate text from OpenAI API",
    });
  }
};

// ============================================
// EXPORT CONTROLLERS
// ============================================

module.exports = {
  generateAIResponse,
  generateReplicateImage,
  generateOpenAIResponse,
  generateOpenAIText,
};

