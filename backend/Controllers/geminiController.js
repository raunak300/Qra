const axios = require('axios');

const analyzeTrends = async (req, res) => {
  const { posts } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!posts || !Array.isArray(posts)) {
    return res.status(400).json({ message: "Invalid posts data" });
  }

  const prompt = `
You're an assistant that detects trending topics.
Below are 10 posts with heading, content, and likes.
Analyze and give 5 bullet points on what is trending.

${posts.map((p, i) => `#${i + 1}
Heading: ${p.heading}
Content: ${p.content}
Likes: ${p.Likes}`).join('\n\n')}
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
            role: "user"
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const output = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ message: "Done", insights: output });
  } catch (error) {
    console.error("Gemini error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Gemini failed",
      error: error.response?.data?.error?.message || error.message
    });
  }
};

module.exports = { analyzeTrends };
