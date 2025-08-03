// Library
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiAI {
  constructor(server) {
    this.server = server;
    
    // Config Gemini AI
    this.genAI = new GoogleGenerativeAI(this.server.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: this.server.env.GEMINI_MODEL
    });

    this.geminiConfig = {
      temperature: Number(this.server.env.GEMINI_TEMPERATURE),
      topP: Number(this.server.env.GEMINI_TOP_P),
      topK: Number(this.server.env.GEMINI_TOP_K),
      maxOutputTokens: 8192,
      responseMimeType: "application/json"
    };

    this.initChatSession();
  }

  initChatSession() {
    this.historySession = JSON.parse(this.server.FS.readFileSync(
      process.cwd() + '/server_data/additional_data/gemini_config/HistorySession.json', 
      'utf8'
    ));

    this.chatSession = this.model.startChat({
      generationConfig: this.geminiConfig,
      history: this.historySession,
    });
  }
  
  /**
   * Generates a response based on the provided input.
   *
   * @param {Object} input - The input data for generating the response.
   * @param {string} input.dailyActivity - Describes the user's daily activities.
   * @param {string} input.symptomDuration - Describes the duration of the symptoms.
   * @param {string} input.environmentalExposure - Describes the user's exposure to environmental factors.
   * @param {string} input.smokingHabits - Describes the user's smoking habits.
   * @param {string} input.peakTime - Describes when the symptoms are most severe.
   * @param {string} input.triggerFactors - Describes factors that alleviate or worsen the symptoms.
   * @param {string} input.chestComplaint - Describes any chest complaints the user has experienced.
   * @returns {Promise<Object>} The generated response.
   */
  async generateResponse(input) {
    const result = await this.chatSession.sendMessage(`
      dailyActivity: ${input.dailyActivity}
      symptomDuration: ${input.symptomDuration}
      environmentalExposure: ${input.environmentalExposure}
      smokingHabits: ${input.smokingHabits}
      peakTime: ${input.peakTime}
      triggerFactors: ${input.triggerFactors}
      chestComplaint: ${input.chestComplaint}
    `);

    return result;
  }
}

export default GeminiAI;