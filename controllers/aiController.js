const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Department = require('../models/Department');
const { generateJSON } = require('../services/geminiService');

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
    const { symptoms, severity, duration, age, existingConditions } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one symptom',
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
      recommendations.push('⚠️ URGENT: Seek immediate medical attention or visit emergency room');
    } else if (highestUrgency === 'moderate') {
      recommendations.push('Consider scheduling an appointment with a healthcare provider');
    } else {
      recommendations.push('Monitor symptoms and consider home care measures');
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
      const schema = '{ "risk_level": "string", "possible_conditions": ["string"], "recommendations": ["string"], "specialists": ["string"], "urgency": "low|moderate|high" }';
      const promptText = `Analyze symptoms: ${JSON.stringify({ symptoms, severity, duration, age, existingConditions })}. Provide medical insights but emphasize this is not a diagnosis.`;
      aiInsights = await generateJSON(promptText, schema);
    } catch (e) {
      console.error('AI analysis error:', e.message);
      aiInsights = { note: 'AI analysis unavailable' };
    }

    res.status(200).json({
      success: true,
      message: 'Symptom analysis completed',
      data: {
        analysis: analysisResults,
        urgencyLevel: highestUrgency,
        recommendations,
        recommendedSpecialists: Array.from(recommendedSpecialists),
        nearbyDoctors,
        aiInsights,
        disclaimer: 'This is not a medical diagnosis. Please consult a healthcare professional for proper medical advice.'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing symptom analysis',
      data: { error: error.message }
    });
  }
};

// @desc    AI Appointment Booking Helper
// @route   POST /api/ai/book-appointment-helper
// @access  Private
exports.appointmentBookingHelper = async (req, res) => {
  try {
    const { symptoms, preferredLocation, insuranceType, urgency } = req.body;

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
        'Choose a hospital and doctor from the recommendations below',
        'Select appointment type (in-person or teleconsultation)',
        'Pick your preferred date and time',
        'Provide patient details and insurance information',
        'Confirm appointment and make payment'
      ],
      urgencyAdvice: urgency === 'high' ? 
        'Consider booking an emergency consultation or visit emergency services' :
        'You can book a regular appointment within the next few days'
    };

    // AI enrichment via Gemini
    let aiGuidance = null;
    try {
      const schema = '{ "recommended_specializations": ["string"], "priority": "low|normal|high", "advice": ["string"] }';
      const promptText = `Suggest booking guidance for: symptoms: ${symptoms?.join(',') || 'none'}, location: ${preferredLocation}, insurance: ${insuranceType}, urgency: ${urgency}`;
      aiGuidance = await generateJSON(promptText, schema);
    } catch (e) {
      console.error('AI guidance error:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Appointment booking guidance generated',
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
      message: 'Error generating appointment booking guidance',
      data: { error: error.message }
    });
  }
};

// @desc    AI Prescription Helper
// @route   POST /api/ai/prescription-helper
// @access  Private
exports.prescriptionHelper = async (req, res) => {
  try {
    const { medicationName, questions } = req.body;

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
        'Always follow your doctor\'s prescription exactly',
        'Do not share medications with others',
        'Complete the full course even if you feel better',
        'Contact your doctor if you experience side effects'
      ],
      disclaimer: 'This information is for educational purposes only. Always consult your healthcare provider.'
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
          return {
            question,
            answer: 'Common side effects vary by medication. Check with your pharmacist or doctor if you experience any unusual symptoms.'
          };
        } else if (q.includes('dose') || q.includes('how much')) {
          return {
            question,
            answer: 'Follow the dosage instructions on your prescription label. Never adjust the dose without consulting your doctor.'
          };
        } else if (q.includes('food')) {
          return {
            question,
            answer: 'Some medications should be taken with food, others on an empty stomach. Check your prescription label or ask your pharmacist.'
          };
        }
        return {
          question,
          answer: 'Please consult your healthcare provider or pharmacist for specific medication questions.'
        };
      });
    }

    // AI enrichment via Gemini
    let aiMedicationHelp = null;
    try {
      const schema = '{ "key_points": ["string"], "warnings": ["string"], "dosage_notes": "string" }';
      const promptText = `Provide patient-safe medication guidance for ${medicationName}. Questions: ${JSON.stringify(questions || [])}`;
      aiMedicationHelp = await generateJSON(promptText, schema);
    } catch (e) {
      console.error('AI medication help error:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Prescription guidance provided',
      data: { ...response, ai: aiMedicationHelp }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error providing prescription guidance',
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
      const schema = '{ "specialties": ["string"], "tests": ["string"], "notes": ["string"] }';
      const promptText = `Suggest referral plan for condition: ${condition}, current treatment: ${currentTreatment}`;
      aiReferral = await generateJSON(promptText, schema);
    } catch (e) {
      console.error('AI referral error:', e.message);
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
    const { category, condition, age, interests } = req.body;

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
      const schema = '{ "tips": [{"title": "string", "content": "string", "category": "string"}] }';
      const promptText = `Generate personalized health tips for: category: ${category}, condition: ${condition}, age: ${age}, interests: ${interests?.join(',') || 'general'}`;
      aiHealthTips = await generateJSON(promptText, schema);
    } catch (e) {
      console.error('AI health tips error:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Health tips generated',
      data: {
        tips: shuffledTips,
        aiGeneratedTips: aiHealthTips?.tips || [],
        disclaimer: 'These tips are for general guidance only. Consult your healthcare provider for personalized medical advice.'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating health tips',
      data: { error: error.message }
    });
  }
};