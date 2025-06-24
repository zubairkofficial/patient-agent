// langgraph.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
  SystemMessage,
  AIMessage,
  HumanMessage,
  BaseMessage,
} from '@langchain/core/messages';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from './dto/response.dto';
import { Statement } from 'src/model/statement.model';
import { Section } from 'src/model/section.model';
import { Skills } from 'src/model/skills.model';
import { Emotions } from 'src/model/emotions.model';
import { Response } from 'src/model/response.model';
import { User } from 'src/model/user.model';
import { Doctor } from 'src/model/doctorprofile.model';
import { Op } from 'sequelize';

@Injectable()
export class LanggraphService {
  private model: ChatGoogleGenerativeAI;
  private readonly logger = new Logger(LanggraphService.name);

  constructor(private configService: ConfigService) {
    this.model = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      apiKey: this.configService.get<string>('GOOGLE_API_KEY'),
      temperature: 0.7, // For more natural medical responses
      maxOutputTokens: 1500, // Increased for structured response
    });
  }

  /**
   * Generate medical consultation prompt based on patient data
   */
  //   private generateMedicalPrompt(
  //     patient_statement: string,
  //     emotion_of_patient: any[],
  //     skills_to_evaluate: any[],
  //     doctor_response?: string
  //   ): string {
  //     return `You are an experienced, empathetic medical doctor providing consultation to a patient. Please respond professionally and compassionately based on the following information:

  // **PATIENT INFORMATION:**
  // Patient Statement: "${patient_statement || 'No statement provided'}"

  // **PATIENT'S EMOTIONAL STATE:**
  // ${emotion_of_patient && emotion_of_patient?.length > 0 ?
  //     emotion_of_patient.map(emotion =>
  //         `- ${emotion.emotion_name}: ${emotion.emotion_detail}`
  //     ).join('\n')
  //     : "No specific emotional indicators provided"
  // }

  // **RELEVANT MEDICAL SKILLS/AREAS TO CONSIDER:**
  // ${skills_to_evaluate && skills_to_evaluate.length > 0 ?
  //     skills_to_evaluate.map(skill =>
  //         `- ${skill.title}: ${skill.description}`
  //     ).join('\n')
  //     : "General medical consultation"
  // }

  // **PREVIOUS CONTEXT (if any):**
  // ${doctor_response ? `Previous Response: "${doctor_response}"` : "This is the initial consultation"}

  // **IMPORTANT: You must respond with a valid JSON object in the following exact format:**
  // {
  //   "bot_remarks": "Your detailed medical consultation response here (200-400 words). Address patient concerns with empathy, provide medically sound advice, ask follow-up questions if needed, recommend next steps, and include medical disclaimer.",
  //   "rating": [number from 0-10 based on severity/urgency of patient's condition]
  // }

  // **RATING SCALE EXPLANATION:**
  // - 0-2: Minor concerns, self-care sufficient
  // - 3-4: Mild symptoms, monitor and consider routine appointment
  // - 5-6: Moderate concerns, should see doctor within few days
  // - 7-8: Significant symptoms, seek medical attention soon
  // - 9-10: Urgent/severe symptoms, immediate medical attention required

  // **INSTRUCTIONS FOR bot_remarks:**
  // 1. Address the patient's concerns with empathy and understanding
  // 2. Consider their emotional state in your communication style
  // 3. Provide medically sound advice while being easily understandable
  // 4. If symptoms are mentioned, ask relevant follow-up questions
  // 5. Recommend appropriate next steps (tests, referrals, lifestyle changes)
  // 6. Maintain a professional yet warm tone
  // 7. If this is a serious condition, advise seeking immediate medical attention
  // 8. Always include a disclaimer about consulting healthcare professionals for diagnosis

  // **RESPONSE GUIDELINES:**
  // - Be concise but thorough (200-400 words)
  // - Use simple, non-medical language when possible
  // - Show empathy for patient's emotions
  // - Provide actionable advice
  // - Ask relevant questions to better understand the condition
  // - Structure your response clearly with paragraphs

  // **IMPORTANT MEDICAL ETHICS:**
  // - Never provide definitive diagnosis without proper examination
  // - Always recommend consulting healthcare professionals for serious symptoms
  // - Be supportive and non-judgmental
  // - Respect patient confidentiality and dignity

  // **CRITICAL: Your response must be ONLY a valid JSON object with bot_remarks (string) and rating (number 0-10). Do not include any other text outside the JSON.**`;
  //   }

  /**
   * Generate structured response prompt for evaluation
   */
  private generateEvaluationPrompt(
    patient_statement: string,
    emotion_of_patient: any[],
    skills_to_evaluate: any[],
    doctor_response?: string,
  ): string {
    return `As a medical AI assistant, evaluate the following patient case and provide a structured response:

**CASE DETAILS:**
Patient Statement: "${patient_statement}"

**PATIENT EMOTIONS:**
${
  emotion_of_patient && emotion_of_patient?.length > 0
    ? emotion_of_patient
        .map(
          (emotion) => `- ${emotion.emotion_name}: ${emotion.emotion_detail}`,
        )
        .join('\n')
    : 'No emotional indicators'
}

**MEDICAL AREAS/Skills TO EVALUATE:**
${
  skills_to_evaluate && skills_to_evaluate.length > 0
    ? skills_to_evaluate
        .map((skill) => `- ${skill.title}: ${skill.description}`)
        .join('\n')
    : 'General evaluation'
}

**CONTEXT:**
Doctor Response: ${doctor_response}

**REQUIRED OUTPUT FORMAT (JSON only):**
{{
  "bot_remarks": "Your professional medical consultation response addressing the patient's concerns, emotional state, and providing appropriate medical guidance with empathy and clarity.",
  "rating": [number 0-10]
}}

**RATING CRITERIA:**
It depends on the Medical Areas/Skills given in the prompt, the more the doctor response is according to the evaluation skills/areas given, the more the score is.

**bot_remarks REQUIREMENTS:**
- Professional yet empathetic tone
- Address patient's emotional state
- Provide clear, actionable advice
- Include appropriate medical disclaimers
- 150-300 words
- Use non-technical language

**RESPOND WITH ONLY THE JSON OBJECT - NO OTHER TEXT.**`;
  }

  /**
   * Parse AI response to extract JSON
   */
  private parseStructuredResponse(response: string): {
    bot_remarks: string;
    rating: number;
  } {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // Validate structure
        if (
          typeof parsed.bot_remarks === 'string' &&
          typeof parsed.rating === 'number' &&
          parsed.rating >= 0 &&
          parsed.rating <= 10
        ) {
          return {
            bot_remarks: parsed.bot_remarks,
            rating: Math.round(parsed.rating), // Ensure integer
          };
        }
      }

      // Fallback if parsing fails
      return {
        bot_remarks:
          response.replace(/[{}]/g, '').trim() ||
          "I apologize, but I'm unable to provide a proper consultation at this time. Please consult with a healthcare professional directly.",
        rating: 5, // Default moderate rating
      };
    } catch (error) {
      this.logger.error('Error parsing structured response:', error);
      return {
        bot_remarks:
          'I apologize, but I encountered an issue processing your request. Please consult with a healthcare professional for proper medical guidance.',
        rating: 5,
      };
    }
  }

  /**
   * Validate and extract patient data safely
   */
  private extractPatientData(statement: any) {
    try {
      const patient_statement = statement?.statement || '';
      const doctor_response = statement?.doctor_response || '';

      const skills_to_evaluate =
        statement?.section?.skills?.map((skill: Skills) => ({
          title: skill.title || 'Unknown Skill',
          description: skill.description || 'No description available',
        })) || [];

      const emotion_of_patient =
        statement?.emotion?.map((emotion: Emotions) => ({
          emotion_name: emotion.name || 'Unknown Emotion',
          emotion_detail: emotion.detail || 'No details available',
        })) || [];

      return {
        patient_statement,
        doctor_response,
        skills_to_evaluate,
        emotion_of_patient,
      };
    } catch (error) {
      this.logger.error('Error extracting patient data:', error);
      return {
        patient_statement: '',
        doctor_response: '',
        skills_to_evaluate: [],
        emotion_of_patient: [],
        isValid: false,
        error: error.message,
      };
    }
  }

  /**
   * Main method to run medical consultation with structured response
   */
  async runMedicalConsultation(dto: ResponseDto, req: any) {
    try {
      const user = await Doctor.findOne({
        where: {
          userId: {
            [Op.eq]: req.user.id,
          },
        },
      });
      this.logger.log(
        `Starting medical consultation for statement ID: ${dto.statementId}, user: ${user?.id}`,
      );
      console.log(
        `Starting medical consultation for statement ID: ${dto.statementId}, user: ${user?.id}`,
      );

      // Fetch patient data from database
      const statement = await Statement.findByPk(dto.statementId, {
        include: [
          {
            model: Section,
            include: [{ model: Skills }],
          },
          {
            model: Emotions,
          },
        ],
      });

      console.log("stateme tlola")
      if (!statement) {
        throw new Error(`Statement with ID ${dto.statementId} not found`);
      }

      // Extract and validate patient data
      const patientData = this.extractPatientData(statement);

      // Generate structured consultation prompt
      const medicalPrompt = this.generateEvaluationPrompt(
        patientData.patient_statement,
        patientData.emotion_of_patient,
        patientData.skills_to_evaluate,
        dto.response,
      );

      // Create system message for structured medical response
      const systemMessage = new SystemMessage({
        content:
          'You are a medical AI that provides structured consultations in JSON format. Always respond with valid JSON containing bot_remarks (string) and rating (number 0-10). Be professional, empathetic, and medically sound.',
      });

      // Create human message with the consultation request
      const humanMessage = new HumanMessage({
        content: medicalPrompt,
      });

      const messages: BaseMessage[] = [systemMessage, humanMessage];

      // Get AI response from Gemini
      this.logger.log('Sending request to Gemini AI...');
      console.log(`seding reuq`);
      const aiResponse = await this.model.invoke(messages);

      // Extract and parse the response content
      const rawResponse =
        typeof aiResponse.content === 'string'
          ? aiResponse.content
          : aiResponse.content.toString();

      const structuredResponse = this.parseStructuredResponse(rawResponse);

      this.logger.log('Medical consultation completed successfully');

      await Response.create({
        response: dto.response,
        botRemarks: structuredResponse.bot_remarks,
        rating: structuredResponse.rating,
        statementId: dto.statementId,
        doctorId: user?.id,
      });

      return {
        success: true,
        bot_remarks: structuredResponse.bot_remarks,
        rating: structuredResponse.rating,
        patient_summary: {
          statement: patientData.patient_statement,
          emotions_count: patientData.emotion_of_patient.length,
          skills_count: patientData.skills_to_evaluate.length,
          has_previous_context: !!dto.response,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          model_used: 'gemini-1.5-flash',
          statement_id: dto.statementId,
        },
      };
    } catch (error) {
      this.logger.error('Error in medical consultation:', error);
      console.log('Error in medical consultation:', error);

      return {
        success: false,
        error: error.message,
        bot_remarks:
          "I apologize, but I'm unable to provide a consultation at this time due to a technical issue. Please try again or consult with a healthcare professional directly.",
        rating: 5, // Default moderate rating for errors
        metadata: {
          timestamp: new Date().toISOString(),
          error_type: error.constructor.name,
        },
      };
    }
  }

  /**
   * Alternative method name for backward compatibility
   */
  async runGraphAgent(dto: ResponseDto, req: any) {
    return this.runMedicalConsultation(dto, req);
  }

  /**
   * Method to get structured AI response for general queries
   */
  async getStructuredResponse(
    query: string,
  ): Promise<{ bot_remarks: string; rating: number }> {
    try {
      const prompt = `You are a AI agent that evaluate the response of the doctor against the given skills, doctor will give response against the statement of patient, the paitient statement will include the emotions of patient too. 
      Provide a structured response in JSON format:

Query: "${query}"

Respond with ONLY this JSON structure:
{{
  "bot_remarks": "Your response addressing the query professionally and helpfully",
  "rating": [number 0-10 based on urgency/importance of the query]
    }}

Rating scale:
0-2: General information/casual query
3-4: Minor concern requiring basic guidance
5-6: Moderate concern needing attention
7-8: Important matter requiring prompt action
9-10: Urgent/critical matter needing immediate attention`;

      const humanMessage = new HumanMessage({ content: prompt });
      const response = await this.model.invoke([humanMessage]);

      const rawResponse =
        typeof response.content === 'string'
          ? response.content
          : response.content.toString();

      return this.parseStructuredResponse(rawResponse);
    } catch (error) {
      this.logger.error('Error in structured response:', error);
      return {
        bot_remarks:
          'I apologize, but I encountered an error processing your request. Please try again.',
        rating: 5,
      };
    }
  }

  /**
   * Method to get AI response for general queries (backward compatibility)
   */
  async getGeneralResponse(query: string): Promise<string> {
    try {
      const structuredResponse = await this.getStructuredResponse(query);
      return structuredResponse.bot_remarks;
    } catch (error) {
      this.logger.error('Error in general response:', error);
      throw new Error('Failed to get AI response');
    }
  }

  /**
   * Health check method
   */
  async healthCheck(): Promise<{
    status: string;
    model: string;
    timestamp: string;
  }> {
    try {
      const testResponse = await this.model.invoke([
        new HumanMessage({
          content: "Hello, please respond with 'OK' to confirm you're working.",
        }),
      ]);

      return {
        status: 'healthy',
        model: 'gemini-1.5-flash',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        model: 'gemini-1.5-flash',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
