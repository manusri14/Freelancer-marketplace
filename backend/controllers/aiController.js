const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generate a project description
// @route   POST /api/ai/generate-description
// @access  Private (Client only)
const generateDescription = async (req, res) => {
  try {
    const { title, category, keywords } = req.body;

    const prompt = `Write a professional, detailed project description for a freelance job posting. 
    Title: ${title}
    Category: ${category}
    Keywords/Requirements: ${keywords}
    
    Make it engaging and structured with paragraphs and bullet points if necessary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({ success: true, text: response.text });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate a proposal cover letter
// @route   POST /api/ai/generate-proposal
// @access  Private (Freelancer only)
const generateProposal = async (req, res) => {
  try {
    const { projectTitle, projectDescription, mySkills } = req.body;

    const prompt = `Write a professional cover letter for a freelance project proposal.
    Project Title: ${projectTitle}
    Project Description: ${projectDescription}
    My Skills: ${mySkills}
    
    Keep it concise, professional, and convincing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({ success: true, text: response.text });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateDescription,
  generateProposal
};
