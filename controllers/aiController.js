const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Department = require('../models/Department');
const { generateJSON } = require('../services/geminiService');

// Simple i18n helper for EN/RW
function t(lang, en, rw) {
  return lang === 'rw' ? rw : en;
}

// Symptom checker knowledge base (simplified for demo)
const symptomDatabase = {
  'fever': {
    commonCauses: ['infection', 'flu', 'cold', 'covid-19'],
    recommendations: ['Stay hydrated', 'Rest', 'Monitor temperature', 'Seek medical attention if fever persists'],
    urgency: 'moderate',
    specialists: ['General Medicine', 'Emergency Medicine']
  },
  'chest pain': {
    commonCauses: ['heart disease', 'muscle strain', 'anxiety', 'acid reflux'],
    recommendations: ['Seek immediate medical attention', 'Do not ignore chest pain'],
    urgency: 'high',
    specialists: ['Cardiology', 'Emergency Medicine']
  },
  'headache': {
    commonCauses: ['tension', 'migraine', 'dehydration', 'stress'],
    recommendations: ['Rest in dark room', 'Stay hydrated', 'Consider over-counter pain relief'],
    urgency: 'low',
    specialists: ['Neurology', 'General Medicine']
  },
  'cough': {
    commonCauses: ['cold', 'flu', 'allergies', 'asthma', 'covid-19'],
    recommendations: ['Stay hydrated', 'Use humidifier', 'Avoid smoking'],
    urgency: 'low',
    specialists: ['General Medicine', 'Pulmonology']
  }
};

// Health tips database
const healthTips = [
  {
    category: 'general',
    title: 'Stay Hydrated',
    content: 'Drink at least 8 glasses of water daily to maintain proper body function.',
    tags: ['hydration', 'wellness']
  },
  {
    category: 'exercise',
    title: 'Regular Exercise',
    content: 'Aim for at least 30 minutes of moderate exercise 5 times per week.',
    tags: ['fitness', 'heart-health']
  },
  {
    category: 'nutrition',
    title: 'Balanced Diet',
    content: 'Include fruits, vegetables, whole grains, and lean proteins in your daily meals.',
    tags: ['nutrition', 'wellness']
  },
  {
    category: 'mental-health',
    title: 'Manage Stress',
    content: 'Practice meditation, deep breathing, or yoga to reduce stress levels.',
    tags: ['stress', 'mental-health']
  }
];

// @desc    AI Symptom Checker
// @route   POST /api/ai/symptom-checker
// @access  Private
exports.symptomChecker = async (req, res) => {
  try {
    const { symptoms, severity, duration, age, existingConditions, lang = 'en' } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: t(lang, 'Please provide at least one symptom', 'Nyamuneka shyiramo nibura ishusho imwe y\'ibimenyetso'),
        data: null
      });
    }

    // Analyze symptoms
    let analysisResults = [];
    let highestUrgency = 'low';
    let recommendedSpecialists = new Set();

    symptoms.forEach(symptom => {
      const symptomLower = symptom.toLowerCase();
      const matchedSymptom = Object.keys(symptomDatabase).find(key => 
        symptomLower.includes(key)
      );

      if (matchedSymptom) {
        const data = symptomDatabase[matchedSymptom];
        analysisResults.push({
          symptom: symptom,
          matched: matchedSymptom,
          ...data
        });

        // Track highest urgency
        if (data.urgency === 'high') highestUrgency = 'high';
        else if (data.urgency === 'moderate' && highestUrgency !== 'high') {
          highestUrgency = 'moderate';
        }

        // Collect recommended specialists
        data.specialists.forEach(spec => recommendedSpecialists.add(spec));
      }
    });

    // Generate recommendations
    let recommendations = [];
    if (highestUrgency === 'high') {
      recommendations.push(t(lang, '⚠️ URGENT: Seek immediate medical attention or visit emergency room', '⚠️ BYIHUTIRWA: Shaka ubufasha bw\'ubuvuzi vuba cyangwa jya kwa muganga byihuse'));
    } else if (highestUrgency === 'moderate') {
      recommendations.push(t(lang, 'Consider scheduling an appointment with a healthcare provider', 'Tekereza guteganya gahunda yo kubonana n\'umukozi w\'ubuzima'));
    } else {
      recommendations.push(t(lang, 'Monitor symptoms and consider home care measures', 'Kurikirana ibimenyetso no gutekereza ku kwivuza mu rugo'));
    }

    // Find nearby doctors/hospitals
    const nearbyDoctors = await Doctor.find({
      specialization: { $in: Array.from(recommendedSpecialists) },
      isActive: true
    })
    .populate('user', 'name')
    .populate('hospital', 'name location')
    .limit(5);

    // AI enrichment via Gemini
    let aiInsights = null;
    try {
      console.log('🤖 [SYMPTOM CHECKER] Calling Gemini for AI insights...');
      const schema = '{ "risk_level": "string", "possible_conditions": ["string"], "recommendations": ["string"], "specialists": ["string"], "urgency": "low|moderate|high" }';
      const promptText = `${lang==='rw' ? 'Sobanura mu Kinyarwanda.' : 'Reply in English.'} 

User reported symptoms: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms}
Severity: ${severity || 'not specified'}
Duration: ${duration || 'not specified'}
Age: ${age || 'not specified'}
Existing conditions: ${existingConditions?.join(', ') || 'none'}

Please analyze these symptoms and provide helpful medical insights. This is NOT a diagnosis - provide educational information and recommendations. Be helpful and specific to the symptoms mentioned.`;
      aiInsights = await generateJSON(promptText, schema);
      console.log('✅ [SYMPTOM CHECKER] AI insights received:', aiInsights);
    } catch (e) {
      console.error('❌ [SYMPTOM CHECKER] AI analysis error:', e.message);
      console.error('   Error stack:', e.stack);
      aiInsights = { note: 'AI analysis unavailable' };
    }

    console.log('📤 [SYMPTOM CHECKER] Sending response...');
    console.log('   Analysis Results:', analysisResults.length);
    console.log('   Urgency Level:', highestUrgency);
    console.log('   Recommendations:', recommendations.length);
    console.log('   AI Insights:', aiInsights ? 'Present' : 'Missing');
    
    const responseData = {
        analysis: analysisResults,
        urgencyLevel: highestUrgency,
        recommendations,
        recommendedSpecialists: Array.from(recommendedSpecialists),
        nearbyDoctors,
        aiInsights,
        disclaimer: t(lang, 'This is not a medical diagnosis. Please consult a healthcare professional for proper medical advice.', 'Ibi si ibisubizo by\'ubuvuzi. Nyamuneka bagisha inama umukozi w\'ubuzima kubyerekeye inama nyayo z\'ubuvuzi.')
    };
    
    console.log('✅ [SYMPTOM CHECKER] Response data prepared');
    console.log('🔍 ============================================');
    console.log('🔍 [SYMPTOM CHECKER] Request Completed');
    console.log('🔍 ============================================\n');
    
    res.status(200).json({
      success: true,
      message: t(lang, 'Symptom analysis completed', 'Isesengura ry\'ibimenyetso rirarangiye'),
      data: responseData
    });
  } catch (error) {
    console.error('\n❌ ============================================');
    console.error('❌ [SYMPTOM CHECKER] Error');
    console.error('❌ ============================================');
    console.error('❌ Error type:', error?.constructor?.name || 'Unknown');
    console.error('❌ Error message:', error?.message);
    console.error('❌ Error stack:', error?.stack);
    console.error('❌ Full error:', error);
    console.error('❌ ============================================\n');
    
    res.status(500).json({
      success: false,
      message: t(req.body?.lang||'en', 'Error processing symptom analysis', 'Ikosa ribaye mu isesengura ry\'ibimenyetso'),
      data: { error: error.message }
    });
  }
};

// @desc    AI Appointment Booking Helper
// @route   POST /api/ai/book-appointment-helper
// @access  Private
exports.appointmentBookingHelper = async (req, res) => {
  try {
    const { symptoms, preferredLocation, insuranceType, urgency, lang = 'en' } = req.body;

    // Determine recommended specialization based on symptoms
    let recommendedSpecializations = new Set();
    
    if (symptoms) {
      symptoms.forEach(symptom => {
        const symptomLower = symptom.toLowerCase();
        const matchedSymptom = Object.keys(symptomDatabase).find(key => 
          symptomLower.includes(key)
        );

        if (matchedSymptom) {
          symptomDatabase[matchedSymptom].specialists.forEach(spec => 
            recommendedSpecializations.add(spec)
          );
        }
      });
    }

    // If no specific symptoms, default to General Medicine
    if (recommendedSpecializations.size === 0) {
      recommendedSpecializations.add('General Medicine');
    }

    // Find suitable doctors and hospitals
    const query = {
      specialization: { $in: Array.from(recommendedSpecializations) },
      isActive: true
    };

    const doctors = await Doctor.find(query)
      .populate('user', 'name')
      .populate('hospital', 'name location contact')
      .populate('department', 'name')
      .sort({ 'rating.average': -1 })
      .limit(10);

    // Group by hospital for better presentation
    const hospitalGroups = doctors.reduce((acc, doctor) => {
      const hospitalId = doctor.hospital._id.toString();
      if (!acc[hospitalId]) {
        acc[hospitalId] = {
          hospital: doctor.hospital,
          doctors: []
        };
      }
      acc[hospitalId].doctors.push(doctor);
      return acc;
    }, {});

    // Generate booking guidance
    const guidance = {
      recommendedSpecializations: Array.from(recommendedSpecializations),
      bookingSteps: [
        t(lang,'Choose a hospital and doctor from the recommendations below','Hitamo ivuriro n\'umusuzuma mu bitekerezwa hepfo'),
        t(lang,'Select appointment type (in-person or teleconsultation)','Hitamo ubwoko bwa gahunda (ku ivuriro cyangwa kuri videwo)'),
        t(lang,'Pick your preferred date and time','Hitamo itariki n\'isaha wifuza'),
        t(lang,'Provide patient details and insurance information','Shyiramo amakuru y\'umurwayi n\'ubwishingizi'),
        t(lang,'Confirm appointment and make payment','Emeza gahunda kandi wishyure')
      ],
      urgencyAdvice: urgency === 'high' ? 
        t(lang,'Consider booking an emergency consultation or visit emergency services','Tekereza kwitabaza ubutabazi cyangwa serivisi z\'ihutirwa') :
        t(lang,'You can book a regular appointment within the next few days','Ushobora guteganya gahunda isanzwe mu minsi micye iri imbere')
    };

    // AI enrichment via Gemini
    let aiGuidance = null;
    try {
      console.log('🤖 [APPOINTMENT HELPER] Calling Gemini for AI guidance...');
      const schema = '{ "recommended_specializations": ["string"], "priority": "low|normal|high", "advice": ["string"] }';
      const promptText = `${lang==='rw' ? 'Sobanura mu Kinyarwanda.' : 'Reply in English.'} 

User needs appointment booking guidance:
- Symptoms: ${symptoms?.join(', ') || 'none'}
- Preferred location: ${preferredLocation || 'not specified'}
- Insurance type: ${insuranceType || 'not specified'}
- Urgency level: ${urgency || 'normal'}

Provide helpful, specific recommendations for which type of doctor/specialist would be most appropriate and practical booking advice.`;
      aiGuidance = await generateJSON(promptText, schema);
      console.log('✅ [APPOINTMENT HELPER] AI guidance received:', aiGuidance);
    } catch (e) {
      console.error('❌ [APPOINTMENT HELPER] AI guidance error:', e.message);
      console.error('   Error stack:', e.stack);
    }

    res.status(200).json({
      success: true,
      message: t(lang,'Appointment booking guidance generated','Inama zo guteganya gahunda zirakozwe'),
      data: {
        guidance,
        aiGuidance,
        recommendedOptions: Object.values(hospitalGroups),
        totalDoctors: doctors.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: t(req.body?.lang||'en','Error generating appointment booking guidance','Ikosa mu gukora inama zo guteganya gahunda'),
      data: { error: error.message }
    });
  }
};

// @desc    AI Prescription Helper
// @route   POST /api/ai/prescription-helper
// @access  Private
exports.prescriptionHelper = async (req, res) => {
  try {
    const { medicationName, questions, lang = 'en' } = req.body;

    // Simplified medication information (in real app, this would be a comprehensive database)
    const medicationInfo = {
      'paracetamol': {
        genericName: 'Paracetamol',
        brandNames: ['Panadol', 'Tylenol'],
        uses: ['Pain relief', 'Fever reduction'],
        dosage: 'Adults: 500-1000mg every 4-6 hours, maximum 4g daily',
        sideEffects: ['Nausea', 'Allergic reactions (rare)'],
        contraindications: ['Severe liver disease'],
        instructions: 'Take with or without food. Do not exceed recommended dose.'
      },
      'amoxicillin': {
        genericName: 'Amoxicillin',
        brandNames: ['Augmentin', 'Amoxil'],
        uses: ['Bacterial infections'],
        dosage: 'Adults: 250-500mg every 8 hours',
        sideEffects: ['Nausea', 'Diarrhea', 'Allergic reactions'],
        contraindications: ['Penicillin allergy'],
        instructions: 'Take with food to reduce stomach upset. Complete full course.'
      }
    };

    let response = {
      medicationFound: false,
      information: null,
      guidance: [
        t(lang,"Always follow your doctor's prescription exactly","Jya ukurikiza neza ibyo muganga yaguhaye"),
        t(lang,'Do not share medications with others','Ntugasangire imiti n\'abandi'),
        t(lang,'Complete the full course even if you feel better','Jya urangiza imiti yose n\'ubwo waba wiyumva neza'),
        t(lang,'Contact your doctor if you experience side effects','Vugana na muganga niba wumva ingaruka z\'imiti')
      ],
      disclaimer: t(lang,'This information is for educational purposes only. Always consult your healthcare provider.','Aya makuru ni ayo kugufasha gusa. Jya ugisha inama umukozi w\'ubuzima buri gihe.')
    };

    if (medicationName) {
      const medLower = medicationName.toLowerCase();
      const foundMed = Object.keys(medicationInfo).find(key => 
        medLower.includes(key) || 
        medicationInfo[key].brandNames.some(brand => 
          medLower.includes(brand.toLowerCase())
        )
      );

      if (foundMed) {
        response.medicationFound = true;
        response.information = medicationInfo[foundMed];
      }
    }

    // Answer common questions
    if (questions && questions.length > 0) {
      response.answers = questions.map(question => {
        const q = question.toLowerCase();
        if (q.includes('side effect')) {
          return { question, answer: t(lang,'Common side effects vary by medication. Check with your pharmacist or doctor if you experience any unusual symptoms.','Ingaruka z\'imiti ziratandukana. Baza farumasiye cyangwa muganga niba ubonye ibidasanzwe.') };
        } else if (q.includes('dose') || q.includes('how much')) {
          return { question, answer: t(lang,'Follow the dosage instructions on your prescription label. Never adjust the dose without consulting your doctor.','Kurikiza amabwiriza y\'ingano y\'imiti ku rupapuro rwa muganga. Ntugahindure ingano utabajije muganga.') };
        } else if (q.includes('food')) {
          return { question, answer: t(lang,'Some medications should be taken with food, others on an empty stomach. Check your prescription label or ask your pharmacist.','Imiti imwe ifatwa uriye, indi ifatwa utariye. Reba ku rupapuro rwa muganga cyangwa ubaze farumasiye.') };
        }
        return { question, answer: t(lang,'Please consult your healthcare provider or pharmacist for specific medication questions.','Nyamuneka babaza umukozi w\'ubuzima cyangwa farumasiye ku bibazo byihariye ku miti.') };
      });
    }

    // AI enrichment via Gemini
    let aiMedicationHelp = null;
    try {
      console.log('🤖 [PRESCRIPTION HELPER] Calling Gemini for AI medication help...');
      const schema = '{ "key_points": ["string"], "warnings": ["string"], "dosage_notes": "string" }';
      const promptText = `${lang==='rw' ? 'Sobanura mu Kinyarwanda.' : 'Reply in English.'} 

User is asking about medication: ${medicationName}
User's questions: ${questions?.join('; ') || 'General information requested'}

Provide helpful, patient-safe information about this medication. Answer the user's specific questions. Include important safety information, warnings, and dosage guidance.`;
      aiMedicationHelp = await generateJSON(promptText, schema);
      console.log('✅ [PRESCRIPTION HELPER] AI medication help received:', aiMedicationHelp);
    } catch (e) {
      console.error('❌ [PRESCRIPTION HELPER] AI medication help error:', e.message);
      console.error('   Error stack:', e.stack);
    }

    res.status(200).json({
      success: true,
      message: t(lang,'Prescription guidance provided','Inama ku miti zatanzwe'),
      data: { ...response, ai: aiMedicationHelp }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: t(req.body?.lang||'en','Error providing prescription guidance','Ikosa mu gutanga inama ku miti'),
      data: { error: error.message }
    });
  }
};

// @desc    AI Referral Support
// @route   POST /api/ai/referral-support
// @access  Private
exports.referralSupport = async (req, res) => {
  try {
    const { condition, currentTreatment, location, insuranceType } = req.body;

    // Determine specialist recommendations based on condition
    const specialistMappings = {
      'heart': ['Cardiology'],
      'diabetes': ['Endocrinology'],
      'mental health': ['Psychiatry'],
      'pregnancy': ['Gynecology'],
      'child': ['Pediatrics'],
      'eye': ['Ophthalmology'],
      'skin': ['Dermatology'],
      'bone': ['Orthopedics'],
      'cancer': ['Oncology']
    };

    let recommendedSpecialties = [];
    if (condition) {
      const conditionLower = condition.toLowerCase();
      Object.keys(specialistMappings).forEach(key => {
        if (conditionLower.includes(key)) {
          recommendedSpecialties.push(...specialistMappings[key]);
        }
      });
    }

    // If no specific match, suggest general specialists
    if (recommendedSpecialties.length === 0) {
      recommendedSpecialties = ['General Medicine'];
    }

    // Find specialists and hospitals
    const specialists = await Doctor.find({
      specialization: { $in: recommendedSpecialties },
      isActive: true
    })
    .populate('user', 'name')
    .populate('hospital', 'name location contact')
    .sort({ experience: -1, 'rating.average': -1 })
    .limit(10);

    // Find specialized hospitals/clinics
    const hospitals = await Hospital.find({
      isActive: true,
      services: { $in: recommendedSpecialties }
    }).limit(5);

    const referralGuidance = {
      recommendedSpecialties,
      steps: [
        'Discuss referral need with your current doctor',
        'Get a referral letter if required by your insurance',
        'Choose a specialist from our recommendations',
        'Schedule appointment with specialist',
        'Prepare medical history and current treatment information'
      ],
      whatToBring: [
        'Referral letter from your doctor',
        'Previous test results and medical records',
        'List of current medications',
        'Insurance card and identification',
        'List of questions for the specialist'
      ]
    };

    // AI enrichment via Gemini
    let aiReferral = null;
    try {
      console.log('🤖 [REFERRAL SUPPORT] Calling Gemini for AI referral...');
      const schema = '{ "specialties": ["string"], "tests": ["string"], "notes": ["string"] }';
      const promptText = `Suggest referral plan for condition: ${condition}, current treatment: ${currentTreatment}`;
      aiReferral = await generateJSON(promptText, schema);
      console.log('✅ [REFERRAL SUPPORT] AI referral received:', aiReferral);
    } catch (e) {
      console.error('❌ [REFERRAL SUPPORT] AI referral error:', e.message);
      console.error('   Error stack:', e.stack);
    }

    res.status(200).json({
      success: true,
      message: 'Referral guidance provided',
      data: {
        guidance: referralGuidance,
        aiReferral,
        specialists,
        specializedHospitals: hospitals,
        totalSpecialists: specialists.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error providing referral guidance',
      data: { error: error.message }
    });
  }
};

// @desc    AI Health Tips
// @route   POST /api/ai/health-tips
// @access  Private
exports.healthTips = async (req, res) => {
  try {
    const { category, condition, age, interests, lang = 'en' } = req.body;

    let filteredTips = [...healthTips];

    // Filter by category if specified
    if (category) {
      filteredTips = filteredTips.filter(tip => 
        tip.category === category || tip.tags.includes(category)
      );
    }

    // Add condition-specific tips
    if (condition) {
      const conditionTips = {
        'diabetes': [
          {
            title: 'Blood Sugar Monitoring',
            content: 'Check your blood sugar levels regularly as recommended by your doctor.',
            category: 'diabetes'
          },
          {
            title: 'Diabetic Diet',
            content: 'Focus on complex carbohydrates and avoid sugary foods.',
            category: 'diabetes'
          }
        ],
        'hypertension': [
          {
            title: 'Reduce Sodium',
            content: 'Limit sodium intake to less than 2,300mg per day.',
            category: 'hypertension'
          },
          {
            title: 'Regular Exercise',
            content: 'Moderate exercise can help lower blood pressure.',
            category: 'hypertension'
          }
        ]
      };

      const conditionLower = condition.toLowerCase();
      if (conditionTips[conditionLower]) {
        filteredTips.push(...conditionTips[conditionLower]);
      }
    }

    // Randomize and limit results
    const shuffledTips = filteredTips.sort(() => 0.5 - Math.random()).slice(0, 5);

    // AI enrichment via Gemini
    let aiHealthTips = null;
    try {
      console.log('🤖 [HEALTH TIPS] Calling Gemini for AI health tips...');
      const schema = '{ "tips": [{"title": "string", "content": "string", "category": "string"}] }';
      const promptText = `${lang==='rw' ? 'Sobanura mu Kinyarwanda.' : 'Reply in English.'} 

User is requesting health tips:
- Category/Topic: ${category || 'general wellness'}
- Health condition: ${condition || 'general'}
- Age: ${age || 'not specified'}
- Interests: ${interests?.join(', ') || 'general'}

Generate personalized, practical health tips that are relevant to the user's request. Make them actionable and helpful.`;
      aiHealthTips = await generateJSON(promptText, schema);
      console.log('✅ [HEALTH TIPS] AI health tips received:', aiHealthTips);
    } catch (e) {
      console.error('❌ [HEALTH TIPS] AI health tips error:', e.message);
      console.error('   Error stack:', e.stack);
    }

    res.status(200).json({
      success: true,
      message: t(lang,'Health tips generated','Inama z\'ubuzima zakozwe'),
      data: {
        tips: shuffledTips,
        aiGeneratedTips: aiHealthTips?.tips || [],
        disclaimer: t(lang,'These tips are for general guidance only. Consult your healthcare provider for personalized medical advice.','Izi nama ni izo kugufasha gusa. Jya ugisha inama umukozi w\'ubuzima ku nama zihariye.')
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: t(req.body?.lang||'en','Error generating health tips','Ikosa mu gutanga inama z\'ubuzima'),
      data: { error: error.message }
    });
  }
};


// @desc    General AI chat - conversational like ChatGPT
// @route   POST /api/ai/chat-general
// @access  Private
exports.generalChat = async (req, res) => {
  console.log('\n💬 ============================================');
  console.log('💬 [AI CHAT] General Chat Request');
  console.log('💬 ============================================');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('👤 User ID:', req.user?._id);
  console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { message, context, lang = 'en' } = req.body || {};
    
    console.log('📝 Parsed Request:');
    console.log('   Message:', message);
    console.log('   Context:', context);
    console.log('   Language:', lang);
    
    if (!message || typeof message !== 'string') {
      console.error('❌ [AI CHAT] Invalid message:', message);
      return res.status(400).json({ 
        success: false, 
        message: t(lang,'Message is required','Ubutumwa burakenewe'), 
        data: null 
      });
    }

    // Detect if message contains Kinyarwanda characters or common words
    const kinyarwandaIndicators = [
      'ni', 'na', 'cyangwa', 'kandi', 'mu', 'ku', 'no', 'nk', 'nka', 'muri', 'kuri',
      'wowe', 'jewe', 'twebwe', 'mwebwe', 'cya', 'cyo', 'cye', 'za', 'zo', 'ze',
      'ubwoba', 'kwiyubaka', 'gukabya', 'gutera', 'kwihangana',
      'umuganga', 'umurwayi', 'ubuzima', 'ubwoba', 'indwara', 'ikimenyetso',
      'mwiri', 'umutwe', 'agatuza', 'igifu', 'umuhondo', 'agakuba', 'umutima',
      'soma', 'vuga', 'jya', 'genda', 'komeza', 'tangira', 'gira', 'bona',
      'murakoze', 'muraho', 'mwiriwe', 'amahoro', 'mwiriweho'
    ];
    
    const messageLower = message.toLowerCase();
    const hasKinyarwanda = lang === 'rw' ||
                          kinyarwandaIndicators.some(word => {
                            const regex = new RegExp(`\\b${word}\\b`, 'i');
                            return regex.test(messageLower);
                          }) ||
                          /[áàâäéèêëíìîïóòôöúùûü]/i.test(message) || // Kinyarwanda accented characters
                          messageLower.includes('rw') || // Language code in message
                          (messageLower.includes('kinyarwanda') || messageLower.includes('ikinyarwanda'));
    
    // Build conversational prompt with language detection
    const languageInstruction = hasKinyarwanda
      ? 'IMPORTANT: You MUST respond ONLY in Kinyarwanda. The user is asking in Kinyarwanda, so you must reply in Kinyarwanda. Do not use English. Use Kinyarwanda language throughout your response. Sobanura mu Kinyarwanda gusa. Witondere kuvugana mu Kinyarwanda nk\'umunyamahanga w\'ubuzima. Irinde gutanga inama z\'ubuvuzi z\'umwuga; tekereza umutekano w\'umurwayi.'
      : 'Reply in English. Be helpful, conversational, and natural like ChatGPT.';
    
    const systemContext = hasKinyarwanda
      ? 'Ni umuyobozi w\'ubuzima. Wifashisha mu Kinyarwanda GUSA. Sobanura mu Kinyarwanda GUSA. Twunguranye mu Kinyarwanda. Witondere kuvugana mu Kinyarwanda. Ntukoreshe icyongereza.'
      : 'You are a helpful medical AI assistant. You provide health-related information, answer questions, and offer guidance.';
    
    const promptText = `${systemContext}

${languageInstruction}

User's message: "${message}"

${context ? `Context: ${JSON.stringify(context)}` : ''}

${hasKinyarwanda 
  ? 'IMPORTANT: Answer in Kinyarwanda ONLY. Sobanura mu Kinyarwanda GUSA. Sobanura ikibazo cy\'umurwayi mu Kinyarwanda. Ngaho ubwoba w\'ubuzima, wifashisha mu Kinyarwanda. Witondere kuvugana mu Kinyarwanda. Ntukoreshe icyongereza mu gisubizo cyawe. Gusa ukoreshe ikinyarwanda.'
  : 'Please provide a helpful, conversational response. Analyze what the user is asking and provide a relevant answer. Be natural and helpful, like a friendly medical assistant.'
}`;
    
    console.log('📤 [AI CHAT] Calling Gemini API for conversational response...');
    console.log('   Prompt:', promptText.substring(0, 200) + '...');
    
    let answer = '';
    try {
      const { generateConversationalResponse } = require('../services/geminiService');
      // Pass language info to help with response
      const detectedLang = hasKinyarwanda ? 'rw' : lang;
      answer = await generateConversationalResponse(promptText, { lang: detectedLang });
      console.log('✅ [AI CHAT] Gemini API call successful');
      console.log('📥 [AI CHAT] Response length:', answer.length);
      console.log('🌐 [AI CHAT] Detected language:', hasKinyarwanda ? 'Kinyarwanda' : 'English');
      
      if (!answer || answer.trim().length === 0) {
        console.warn('⚠️  [AI CHAT] Empty response from Gemini');
        answer = hasKinyarwanda 
          ? 'Ntumva neza ikibazo cyawe. Ushobora gusobanura neza? Nyamuneka wongereho ubutumwa mu Kinyarwanda cyangwa mu Cyongereza.' 
          : 'I didn\'t understand your question clearly. Could you clarify?';
      }
    } catch (e) {
      console.error('❌ [AI CHAT] Gemini API call failed:', e.message);
      console.error('   Error stack:', e.stack);
      // Soft fallback with language detection
      answer = hasKinyarwanda 
        ? 'Ndakumva. Ushobora gusobanura neza icyo ukeneye? Ni ikibazo cy\'ubuzima? Nyamuneka wongereho ubutumwa mu Kinyarwanda, kandi nzagufasha mu Kinyarwanda.' 
        : 'I hear you. Could you clarify what you need? If you have a health question, please describe your symptoms or concern, and I\'ll do my best to help!';
      console.log('🔄 [AI CHAT] Using fallback response');
      console.log('🌐 [AI CHAT] Fallback language:', hasKinyarwanda ? 'Kinyarwanda' : 'English');
    }
    
    console.log('📤 [AI CHAT] Sending response to client');
    console.log('💬 ============================================');
    console.log('💬 [AI CHAT] Request Completed');
    console.log('💬 ============================================\n');
    
    return res.status(200).json({ 
      success: true, 
      message: 'OK', 
      data: { answer } 
    });
  } catch (error) {
    console.error('\n❌ ============================================');
    console.error('❌ [AI CHAT] General Chat Error');
    console.error('❌ ============================================');
    console.error('❌ Error type:', error?.constructor?.name || 'Unknown');
    console.error('❌ Error message:', error?.message);
    console.error('❌ Error stack:', error?.stack);
    console.error('❌ Full error:', error);
    console.error('❌ ============================================\n');
    
    return res.status(500).json({ 
      success: false, 
      message: t(req.body?.lang||'en','Error processing request','Ikosa mu gutunganya ubusabe'), 
      data: { error: error.message } 
    });
  }
};