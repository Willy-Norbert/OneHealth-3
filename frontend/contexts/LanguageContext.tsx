"use client";

import { title } from 'process';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'rw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    "dashboard1": {
    "welcomeBack": "Welcome back, {{name}}!",
    "healthJourneySubtitle": "Your health journey with Irabaruta continues. Stay healthy, stay informed.",
    "alerts": "Alerts",
    "aiAssistant": "AI Assistant",
    "healthBanner": {
      "title": "Your health is looking great!",
      "subtitle": "Your health score improved by 2% this week. Keep up the good work!",
      "viewDetails": "View Details"
    },
    "upcomingAppointments": "Upcoming Appointments",
    "activePrescriptions": "Active Prescriptions",
    "healthScore": "Health Score",
    "emergencyContacts": "Emergency Contacts",
    "unchanged": "Unchanged",
    "ready": "Ready",
    "quickActions": {
      "title": "Quick Actions",
      "bookAppointment": "Book Appointment",
      "bookAppointmentDesc": "Schedule a consultation with available doctors",
      "startTeleconsultation": "Start Teleconsultation",
      "startTeleconsultationDesc": "Connect with your doctor via video call",
      "available": "Available",
      "aiHealthAssistant": "AI Health Assistant",
      "aiHealthAssistantDesc": "Get personalized health insights and recommendations",
      "new": "New",
      "orderMedications": "Order Medications",
      "orderMedicationsDesc": "Refill prescriptions and order medications",
      "emergencyServices": "Emergency Services",
      "emergencyServicesDesc": "Access emergency contacts and services",
      "medicalHistory": "Medical History",
      "medicalHistoryDesc": "View your complete medical records and history"
    },
    "appointment": {
      "today": "Today",
      "tomorrow": "Tomorrow",
      "followUp": "Follow-up",
      "teleconsultation": "Teleconsultation",
      "consultation": "Consultation"
    },
    "departments": {
      "cardiology": "Cardiology",
      "generalMedicine": "General Medicine",
      "dermatology": "Dermatology"
    },
    "viewAll": "View All",
    "join": "Join",
    "today": "Today",
    "recentActivity": "Recent Activity",
    "healthInsights": "Health Insights",
    "healthInsightsheartRate": "Heart Rate",
    "healthInsightsnormalRange": "Normal range",
    "healthInsightsstepsToday": "Steps Today",
    "healthInsightsstepGoal": "Goal: 10,000",
    "healthInsightssleepQuality": "Sleep Quality",
    "healthInsightssleepHours": "7.5 hours",
    "activity": {
      "prescriptionFilled": "Prescription filled",
      "appointmentConfirmed": "Appointment confirmed",
      "healthReportGenerated": "Health report generated",
      "teleconsultationCompleted": "Teleconsultation completed",
      "hoursAgo": "{{count}} hours ago",
      "daysAgo": "{{count}} days ago",
      "weeksAgo": "{{count}} week ago"
    }
  },
    "cta7": {
    "title": "Book Your Teleconsultation Today",
    "subtitle": "Connect with our doctors from the comfort of your home in just a few clicks.",
    "button": "Book Now"
  },
    pharmacy_cta: {
      heading: "Get Your Medications Delivered Today",
      description: "Never run out of essential medications again. Order now and experience the convenience of having your prescriptions delivered right to your doorstep.",
      features: {
        easy_ordering: {
          title: "Easy Ordering",
          description: "Upload your prescription or select from our wide range of over-the-counter medications.",
        },
        fast_delivery: {
          title: "Fast Delivery",
          description: "Receive your medications within hours in urban areas and same-day in most locations.",
        },
        expert_support: {
          title: "Expert Support",
          description: "Get advice from licensed pharmacists about your medications and potential interactions.",
        },
      },
      buttons: {
        order: "Order Medications",
        upload: "Upload Prescription",
        call: "Call a Pharmacist",
      },
    },
    pharmacy_faq: {
      heading: "Frequently Asked",
      highlight: "Questions",
      description: "Find answers to common questions about our pharmacy and medication delivery services.",
      questions: {
        upload_prescription: {
          question: "How do I upload my prescription?",
          answer: "You can upload your prescription by taking a clear photo of it through our mobile app or website. Simply navigate to the 'Upload Prescription' section, take a photo or select an image from your gallery, and submit it. Our pharmacists will review it and process your order.",
        },
        medication_types: {
          question: "What types of medications can I order?",
          answer: "You can order both prescription and over-the-counter medications through our platform. We offer a wide range of products including chronic disease medications, antibiotics, pain relievers, vitamins, supplements, and medical devices. All medications are sourced from licensed pharmacies.",
        },
        delivery_time: {
          question: "How long does delivery take?",
          answer: "Delivery times vary based on your location. In Kigali urban areas, deliveries typically arrive within 1-3 hours. Provincial cities receive same-day delivery, while rural areas may take up to 24 hours. Express delivery options are available in most areas for urgent medication needs.",
        },
        minimum_order: {
          question: "Is there a minimum order amount?",
          answer: "There is no minimum order amount for medication orders. However, orders below RWF 10,000 may incur the standard delivery fee based on your location. Orders above RWF 10,000 qualify for free delivery in most urban areas.",
        },
        payment_methods: {
          question: "How do I pay for my medications?",
          answer: "We offer multiple payment options including mobile money (MTN MoMo, Airtel Money), credit/debit cards, and cash on delivery. For insurance coverage, you can upload your insurance card along with your prescription, and we'll process the claim directly with your provider.",
        },
        medication_authenticity: {
          question: "Are the medications authentic and safe?",
          answer: "Yes, all medications are sourced directly from licensed pharmacies and authorized distributors in Rwanda. We maintain strict quality control standards and proper storage conditions. Each medication comes with verification seals and batch numbers that can be verified.",
        },
        refund_policy: {
          question: "Can I get a refund if I receive the wrong medication?",
          answer: "Yes, if you receive incorrect medications or if there are quality issues, we offer a full refund or replacement. Please report any issues within 24 hours of receiving your order by contacting our customer support team.",
        },
        temperature_sensitive: {
          question: "Do you deliver temperature-sensitive medications?",
          answer: "Yes, we deliver temperature-sensitive medications like insulin using specialized temperature-controlled packaging. Our delivery personnel are trained to handle such medications properly, ensuring they maintain their efficacy throughout the delivery process.",
        },
      },
      contact: {
        prompt: "Still have questions about our pharmacy services?",
        message: "Contact our pharmacist team at {{email}} or call {{phone}}",
      },
    },
    pharmacy_testimonials: {
      heading_part1: "What Our",
      heading_part2: "Customers Say",
      description: "Thousands of Rwandans rely on our pharmacy service for their medication needs. Here's what they have to say.",
      quotes: {
        jean: "The medication delivery service has been life-changing for my mother who has diabetes. We no longer worry about running out of insulin as it's delivered right to our doorstep every month.",
        emmanuel: "I was skeptical at first, but after using the service for my blood pressure medication, I'm impressed with the reliability and speed. The pharmacist consultation was also very helpful.",
        marie: "Even though I live in a rural area, ONE HEALTHLINE CONNECT delivers my family's medications consistently. The packaging is secure and the delivery person is always professional.",
      },
      stats_heading: "Our Pharmacy Service in Numbers",
      stats_description: "We're committed to providing reliable medication services across Rwanda",
      stats: {
        on_time: "On-time delivery",
        monthly_deliveries: "Monthly deliveries",
        customer_satisfaction: "Customer satisfaction",
        medication_authenticity: "Medication authenticity",
      },
    },
        pharmacy_delivery: {
      heading: "Fast & Reliable",
      highlight: "Medication Delivery",
      description: "We deliver medications safely and promptly to your doorstep, ensuring you never run out of essential treatments.",
      image_alt: "Medication delivery service",
      features: {
        nationwide: { title: "Nationwide Coverage", description: "We deliver to all provinces in Rwanda, including remote areas, ensuring everyone has access to essential medications." },
        express: { title: "Express Delivery", description: "Need medications urgently? Our express delivery service ensures you receive critical medications within 1-3 hours in urban areas." },
        secure: { title: "Secure Packaging", description: "All medications are securely packaged to maintain integrity, protect privacy, and ensure they reach you in perfect condition." },
        temp: { title: "Temperature Control", description: "Sensitive medications are transported in temperature-controlled containers to maintain their efficacy and safety." },
      },
      zones_heading: "Delivery Zones & Timeframes",
      table: { zone: "Zone", standard: "Standard Delivery", fee: "Delivery Fee", express: "Express Option" },
      zones: { kigali_urban: "Kigali Urban", kigali_suburbs: "Kigali Suburbs", provincial_cities: "Provincial Cities", rural_areas: "Rural Areas" },
      same_day: "Same day",
      next_day: "Next day",
      map_alt: "Rwanda medication delivery coverage map",
      map_title: "Nationwide Coverage",
      map_description: "Our delivery network covers all 30 districts of Rwanda, ensuring medication access for everyone.",
    },
     pharmacy_products: {
      heading: "Browse Our",
      highlight: "Product Categories",
      description: "From prescription medications to healthcare essentials, we offer a comprehensive range of products for all your health needs.",
      categories: {
        prescription: "Prescription Medications",
        otc: "Over-the-Counter",
        chronic: "Chronic Conditions",
        vitamins: "Vitamins & Supplements",
        personal_care: "Personal Care",
        devices: "Medical Devices",
        first_aid: "First Aid",
        baby_maternal: "Baby & Maternal",
      },
      featured_heading: "Featured Products",
      reviews: "reviews",
      add_to_cart: "Add",
      view_all: "View All Products",
      featured: {
        bp_monitor: { name: "Blood Pressure Monitor", category: "Medical Devices" },
        multivitamin: { name: "Multivitamin Complex", category: "Vitamins & Supplements" },
        diabetes_strips: { name: "Diabetes Test Strips", category: "Chronic Conditions" },
        first_aid_kit: { name: "First Aid Kit", category: "First Aid" },
      },
    },
     pharmacy_partners: {
      heading: "Our Trusted",
      highlight: "Pharmacy Partners",
      description: "We've partnered with Rwanda's most reliable pharmacies to ensure you receive authentic medications with professional service.",
      labels: { locations: "Locations", specialties: "Specialties" },
      footer_note: "All partner pharmacies are licensed by the Rwanda Pharmacy Council and follow strict quality standards.",
      kigali: {
        name: "Kigali Pharmacy Network",
        description: "A network of 20+ pharmacies across Kigali providing a wide range of medications and healthcare products.",
        locations: "Kigali City",
        specialties: "Prescription medications, Chronic disease management",
      },
      butare: {
        name: "Butare Medical Supplies",
        description: "Specialized in hospital-grade medications and supplies with extensive inventory of rare medications.",
        locations: "Southern Province",
        specialties: "Specialized medications, Hospital supplies",
      },
      musanze: {
        name: "Musanze Health Pharmacy",
        description: "Serving the Northern Province with focus on rural healthcare needs and affordable medication options.",
        locations: "Northern Province",
        specialties: "Rural healthcare, Affordable medications",
      },
      rubavu: {
        name: "Rubavu Medication Center",
        description: "Western Rwanda's largest pharmacy network with international medication sourcing capabilities.",
        locations: "Western Province",
        specialties: "International medications, Specialty drugs",
      },
    },
     pharmacy_how_it_works: {
      heading: "How Our",
      highlight: "Pharmacy Service",
      description: "Getting your medications has never been easier. Follow these simple steps to order and receive your prescriptions.",
      upload_prescription: { title: "Upload Prescription or Select Medications", description: "Take a photo of your prescription or browse our catalog to select over-the-counter medications." },
      review_payment: { title: "Review Order and Payment", description: "Confirm your medication order, delivery address, and complete payment through our secure system." },
      pharmacist_verification: { title: "Pharmacist Verification", description: "A licensed pharmacist reviews your order and prescription to ensure accuracy and safety." },
      delivery: { title: "Delivery to Your Location", description: "Your medications are packaged securely and delivered directly to your doorstep by our trusted couriers." },
      order_now: "Order Now",
      need_help: "Need help with your medication order? Our support team is available 24/7.",
      contact_support: "Contact Support",
    },
    pharmacy_features: {
      heading: "Why Choose Our",
      highlight: "Pharmacy Service",
      description: "ONE HEALTHLINE CONNECT offers a comprehensive medication service designed to make healthcare more accessible and convenient for all Rwandans.",
      "24_7_ordering": { title: "24/7 Ordering", description: "Order medications anytime, day or night, through our online platform or mobile app." },
      fast_delivery: { title: "Fast Delivery", description: "Get medications delivered to your doorstep within 3 hours in urban areas and same-day in rural areas." },
      verified_medications: { title: "Verified Medications", description: "All medications are sourced from licensed pharmacies and verified for authenticity." },
      secure_payments: { title: "Secure Payments", description: "Multiple payment options including mobile money, credit cards, and insurance coverage." },
      medication_reminders: { title: "Medication Reminders", description: "Set up reminders to take your medications on time and never miss a dose." },
      pharmacist_consultation: { title: "Pharmacist Consultation", description: "Chat with licensed pharmacists for advice on medications and potential side effects." },
      easy_refills: { title: "Easy Refills", description: "Quickly reorder your prescriptions with one-click refills and automatic renewals." },
      digital_prescriptions: { title: "Digital Prescriptions", description: "Upload your prescription digitally or have your doctor send it directly to our platform." },
    },
     pharmacy_hero: {
      tagline: "Pharmacy Services",
      title_part1: "Medications",
      title_part2: "Delivered",
      title_part3: "To Your Doorstep",
      description:
        "Order prescription and over-the-counter medications from partner pharmacies across Rwanda. Upload your prescription, compare prices, and have your medications delivered to your home.",
      search_placeholder: "Search for medications...",
      search_button: "Search",
      order_button: "Order Medications",
      upload_button: "Upload Prescription",
      image_alt: "Pharmacy and medication delivery services",
      free_delivery: "Free Delivery",
      stats: [
        { value: "50+", label: "Pharmacies" },
        { value: "3 hrs", label: "Delivery Time" },
        { value: "1000+", label: "Medications" }
      ]
    },
     emergency_cta: {
      heading: "Emergency Medical Care When You Need It Most",
      subheading: "ONE HEALTHLINE CONNECT's emergency services are available 24/7 across the country. Save our emergency number for immediate assistance.",
      hotline_title: "Emergency Hotline",
      hotline_number: "912",
      hotline_subtext: "Available 24 hours a day, 7 days a week, 365 days a year",
      save_number: "Save Emergency Number",
      learn_services: "Learn About Our Services",
      features: [
        { title: "Download Our App", description: "Get one-touch emergency calling and share your location automatically" },
        { title: "Emergency Training", description: "Learn basic first aid and CPR through our community training programs" },
        { title: "Emergency Preparedness", description: "Create an emergency plan for your family with our free resources" },
      ],
      reminder: "Remember: In case of emergency, call 912 immediately. Every second counts."
    },
     emergency_faq: {
      heading: "Frequently Asked Questions",
      subheading: "Find answers to common questions about our emergency medical services.",
      faqs: [
        {
          question: "What number do I call for emergency services?",
          answer: "For emergency medical services, call our dedicated emergency number: 912. This number is available 24/7 and will connect you directly to our emergency dispatch center. In case you cannot reach this number, you can also call our alternative emergency line at 0788-HEALTH (0788-432584)."
        },
        {
          question: "How quickly will an ambulance arrive?",
          answer: "Our target response times are 5-15 minutes in urban areas and 15-30 minutes in rural areas. Actual response times may vary based on traffic conditions, weather, and the specific location. Our dispatch system sends the closest available emergency unit to minimize wait times."
        },
        // ... add remaining FAQs similarly
      ],
      contact_heading: "Have more questions about our emergency services?",
      contact_text: "Contact our customer service team at info@healthlinerwanda.com or call +250 788 123 456"
    },
    emergency_testimonials: {
      heading: "Lives Saved Through Our Emergency Services",
      subheading:
        "Read about real experiences from patients who received emergency care from ONE HEALTHLINE CONNECT.",
      testimonials: [
        {
          name: "Jean-Paul Mugisha",
          location: "Kigali, Rwanda",
          testimonial:
            "I was having severe chest pain at home when my wife called ONE HEALTHLINE CONNECT. The ambulance arrived within 10 minutes, and the paramedics immediately began treatment. They saved my life - I was having a major heart attack. The speed and professionalism of the team was incredible."
        },
        {
          name: "Marie Uwimana",
          location: "Huye, Rwanda",
          testimonial:
            "My son had a severe allergic reaction while we were at a family gathering in a rural area. I didn't think help would reach us in time, but ONE HEALTHLINE CONNECT's emergency team arrived quickly and administered life-saving treatment. Their calm expertise during such a frightening situation was remarkable."
        },
        {
          name: "Emmanuel Hakizimana",
          location: "Musanze, Rwanda",
          testimonial:
            "I was in a serious car accident on the highway. The ONE HEALTHLINE CONNECT emergency team arrived quickly, stabilized me at the scene, and coordinated with the hospital so everything was ready when I arrived. Their quick action prevented permanent damage. I'm forever grateful for their expertise."
        }
      ],
      stats_heading: "Emergency Response Statistics",
      stats: [
        "Average response time: <strong>12 minutes</strong>",
        "Emergencies responded to last year: <strong>4,500+</strong>",
        "Lives saved: <strong>98% survival rate</strong> for critical emergencies",
        "Patient satisfaction: <strong>4.9/5</strong> average rating"
      ],
      commitment_heading: "Our Commitment",
      commitment_p1:
        "At ONE HEALTHLINE CONNECT, we're committed to providing the fastest, most professional emergency medical care possible. Our teams undergo rigorous training and use the latest medical equipment to ensure the best outcomes for patients in emergency situations.",
      commitment_p2:
        "We continuously work to improve our response times and coverage areas to serve all Rwandans, no matter where they are located."
    },
    emergency_locations: {
      title: "Our Emergency Coverage Areas",
      description:
        "ONE HEALTHLINE CONNECT provides emergency medical services across the country, with strategic locations to ensure rapid response times.",
      map_placeholder: {
        title: "Interactive Map Coming Soon",
        subtitle: "View our emergency response units across Rwanda",
      },
      coverage_label: "Coverage Area:",
      response_time_label: "Response Time:",
      units_label: "Emergency Units:",
      footer_note_1: "Our emergency services cover all 30 districts of Rwanda, with strategic locations to minimize response times.",
      footer_note_2: "In remote areas, we utilize helicopter medical evacuation when necessary to ensure timely care.",
      kigali: {
        name: "Kigali Central",
        address: "KN 5 Ave, Kigali, Rwanda",
        coverage: "Nyarugenge, Kicukiro, Gasabo",
        responseTime: "5-10 minutes",
        units: "8 Ambulances, 4 Rapid Response Vehicles",
      },
      butare: {
        name: "Butare Station",
        address: "Huye District, Southern Province",
        coverage: "Huye, Gisagara, Nyanza",
        responseTime: "10-15 minutes",
        units: "5 Ambulances, 2 Rapid Response Vehicles",
      },
      musanze: {
        name: "Musanze Center",
        address: "Musanze District, Northern Province",
        coverage: "Musanze, Burera, Gakenke",
        responseTime: "10-20 minutes",
        units: "4 Ambulances, 2 Rapid Response Vehicles",
      },
      rubavu: {
        name: "Rubavu Station",
        address: "Rubavu District, Western Province",
        coverage: "Rubavu, Nyabihu, Rutsiro",
        responseTime: "10-20 minutes",
        units: "4 Ambulances, 2 Rapid Response Vehicles",
      },
      rwamagana: {
        name: "Rwamagana Center",
        address: "Rwamagana District, Eastern Province",
        coverage: "Rwamagana, Kayonza, Ngoma",
        responseTime: "15-25 minutes",
        units: "3 Ambulances, 2 Rapid Response Vehicles",
      },
      nyagatare: {
        name: "Nyagatare Station",
        address: "Nyagatare District, Eastern Province",
        coverage: "Nyagatare, Gatsibo",
        responseTime: "15-30 minutes",
        units: "3 Ambulances, 1 Rapid Response Vehicle",
      },
    },
     emergency_types: {
      heading: "Emergency Situations We Handle",
      subheading: "Our emergency teams are trained and equipped to respond to a wide range of medical emergencies across Rwanda.",
      cardiac: {
        title: "Cardiac Emergencies",
        desc: "Heart attacks, chest pain, cardiac arrest, and other heart-related emergencies requiring immediate attention."
      },
      neurological: {
        title: "Neurological Emergencies",
        desc: "Strokes, seizures, severe headaches, and other neurological conditions requiring rapid response."
      },
      trauma: {
        title: "Trauma & Injuries",
        desc: "Serious injuries from accidents, falls, or violence requiring immediate medical intervention."
      },
      respiratory: {
        title: "Respiratory Distress",
        desc: "Severe asthma attacks, difficulty breathing, choking, and other respiratory emergencies."
      },
      bleeding: {
        title: "Severe Bleeding",
        desc: "Uncontrolled bleeding from injuries, wounds, or medical conditions requiring immediate treatment."
      },
      poisoning: {
        title: "Poisoning & Overdose",
        desc: "Accidental or intentional poisoning, drug overdoses, and adverse reactions requiring urgent care."
      },
      burns: {
        title: "Burns & Scalds",
        desc: "Serious burns from fire, chemicals, electricity, or hot liquids requiring specialized treatment."
      },
      other: {
        title: "Other Emergencies",
        desc: "Allergic reactions, diabetic emergencies, pregnancy complications, and other urgent medical situations."
      },
      cta_title: "When to Call Emergency Services",
      cta_desc: "Call our emergency number (912) immediately if you or someone around you experiences:",
      urgent_signs: [
        "Chest pain or pressure",
        "Difficulty breathing",
        "Sudden weakness or numbness",
        "Severe bleeding",
        "Severe burns",
        "Poisoning or overdose",
        "Serious injuries",
        "Seizures",
        "Unconsciousness"
      ]
    },
     emergency_how_it_works: {
      heading: "How Our Emergency Service Works",
      subheading:
        "When every second counts, our streamlined emergency response process ensures you get the care you need as quickly as possible.",
      call_emergency: {
        title: "Call Emergency Number",
        description:
          "Dial our emergency number (912) to reach our 24/7 dispatch center. Our trained operators will ask key questions to assess the situation.",
      },
      rapid_dispatch: {
        title: "Rapid Dispatch",
        description:
          "Based on your location and emergency type, we dispatch the nearest appropriate emergency response unit to your location.",
      },
      on_site_treatment: {
        title: "On-Site Treatment",
        description:
          "Our emergency medical team arrives and provides immediate on-site assessment and treatment to stabilize the patient.",
      },
      hospital_transport: {
        title: "Hospital Transport",
        description:
          "If needed, we transport the patient to the most appropriate medical facility, communicating with the hospital to ensure seamless care.",
      },
      cta_text:
        "In life-threatening situations, every minute matters. Don't hesitate to call our emergency number:",
    },
     emergency_features: {
      heading: "Our Emergency Service Features",
      subheading:
        "ONE HEALTHLINE CONNECT provides comprehensive emergency medical services designed to deliver rapid, professional care when you need it most.",
      rapid_response: {
        title: "Rapid Response",
        description:
          "Our emergency teams aim to reach you within 5-15 minutes in urban areas and 15-30 minutes in rural locations.",
      },
      nationwide_coverage: {
        title: "Nationwide Coverage",
        description:
          "With emergency response units strategically located across Rwanda, we ensure help is always nearby.",
      },
      advanced_life_support: {
        title: "Advanced Life Support",
        description:
          "Our ambulances are equipped with advanced life support equipment and staffed by trained paramedics.",
      },
      medical_professionals: {
        title: "Medical Professionals",
        description:
          "Our emergency teams include doctors, nurses, and paramedics trained in emergency medicine.",
      },
      ambulance_fleet: {
        title: "Modern Ambulance Fleet",
        description:
          "Our fleet of modern ambulances is equipped with the latest medical technology for on-site treatment.",
      },
      dispatch_center: {
        title: "24/7 Dispatch Center",
        description:
          "Our emergency dispatch center is staffed around the clock to coordinate rapid response to emergencies.",
      },
      hospital_network: {
        title: "Hospital Network",
        description:
          "Direct coordination with hospitals ensures seamless transfer and immediate care upon arrival.",
      },
      insurance_coordination: {
        title: "Insurance Coordination",
        description:
          "We work with all major insurance providers to ensure your emergency care is covered.",
      },
    },
     emergency_hero: {
      label: "24/7 EMERGENCY SERVICES",
      title: "Immediate Medical Response When Every Second Counts",
      description:
        "Our emergency medical team is available 24/7 across Rwanda to provide rapid response and life-saving care during critical situations.",
      call_button: "Call Emergency",
      learn_more: "Learn More",
      stats: {
        response_time: { value: "5-15", label: "Minute Response Time" },
        availability: { value: "24/7", label: "Service Availability" },
        vehicles: { value: "30+", label: "Emergency Vehicles" },
        responders: { value: "100%", label: "Trained Responders" },
      },},
     appointments_cta: {
      title: "Ready to Book Your Healthcare Appointment?",
      subtitle: "Take control of your health journey today. Book an appointment with top healthcare providers in Rwanda in just a few clicks.",
      features: {
        easy_booking: {
          title: "Easy Booking",
          description: "Book appointments anytime, anywhere in just a few minutes."
        },
        instant_confirmation: {
          title: "Instant Confirmation",
          description: "Receive immediate confirmation and reminders via SMS and email."
        },
        support: {
          title: "24/7 Support",
          description: "Our support team is always available to assist with your booking."
        }
      },
      buttons: {
        book: "Book an Appointment",
        view_specialists: "View Specialists"
      },
      need_assistance: "Need assistance? Call us at"
    },
    appointments_faq: {
      title: "Frequently Asked",
      title_highlight: "Questions",
      subtitle: "Find answers to common questions about our appointment booking service.",
      q1: {
        question: "How do I book an appointment?",
        answer:
          "You can book an appointment through our website or mobile app. Simply create an account, search for a doctor or specialty, select your preferred date and time, and confirm your booking. You'll receive an immediate confirmation via email and SMS.",
      },
      q2: {
        question: "Can I book an appointment for someone else?",
        answer:
          "Yes, you can book appointments for family members or others. During the booking process, you'll have the option to specify who the appointment is for. You'll need to provide their basic information to complete the booking.",
      },
      q3: {
        question: "How far in advance can I book an appointment?",
        answer:
          "Most specialists allow bookings up to 3 months in advance. Some high-demand specialists may have shorter booking windows. Emergency appointments can often be booked for the same day or next day depending on availability.",
      },
      q4: {
        question: "What if I need to cancel or reschedule my appointment?",
        answer:
          "You can cancel or reschedule your appointment through your account up to 24 hours before the scheduled time without any penalty. For cancellations less than 24 hours in advance, a small fee may apply depending on the specialist's policy.",
      },
      q5: {
        question: "Do I need to pay when booking an appointment?",
        answer:
          "Some specialists require a deposit or full payment at the time of booking, while others allow payment at the time of the appointment. The payment requirements will be clearly indicated during the booking process.",
      },
      q6: {
        question: "What insurance providers do you accept?",
        answer:
          "We work with most major insurance providers in Rwanda. During the booking process, you can enter your insurance information to see which specialists accept your specific insurance plan.",
      },
      q7: {
        question: "How long before my appointment will I receive a reminder?",
        answer:
          "We send appointment reminders 48 hours and 2 hours before your scheduled appointment via SMS and email. You can adjust your reminder preferences in your account settings.",
      },
      q8: {
        question: "What should I bring to my appointment?",
        answer:
          "Please bring your ID, insurance card (if applicable), any relevant medical records or test results, a list of current medications, and any referral documents if required. For first-time visits, please arrive 15 minutes early to complete registration.",
      },
      need_more_help: "Still have questions about our appointment booking service?",
      contact_us_text: "Contact our support team at",
    },
    appointments_locations: {
      title: "Our",
      title_highlight: "Locations",
      subtitle: "Book appointments at any of our state-of-the-art facilities across Rwanda.",
      featured: "Featured",
      book_button: "Book at this Location",
      find_nearby: {
        title: "Find a Location Near You",
        subtitle: "We have partner facilities throughout Rwanda to serve you better."
      },
      view_all: "View All Locations",
      kigali: {
        name: "HEALTHLINE Kigali Center",
        address: "KN 5 Rd, Kigali, Rwanda",
        hours: "Mon-Sat: 8am-8pm, Sun: 9am-5pm"
      },
      butare: {
        name: "HEALTHLINE Butare Clinic",
        address: "Huye District, Southern Province, Rwanda",
        hours: "Mon-Fri: 8am-6pm, Sat: 9am-3pm"
      },
      musanze: {
        name: "HEALTHLINE Musanze Hospital",
        address: "Musanze District, Northern Province, Rwanda",
        hours: "24/7 Emergency Services"
      },
      rubavu: {
        name: "HEALTHLINE Rubavu Center",
        address: "Rubavu District, Western Province, Rwanda",
        hours: "Mon-Sat: 8am-7pm, Sun: 10am-4pm"
      }
    },
    appointments_testimonials: {
  title: "What Our",
  highlight: "Patients Say",
  subtitle: "Hear from people who have used our appointment booking service.",
  average_rating: "Average Rating",
  stars: "Stars",
  jean: {
    text: "The appointment booking process was incredibly simple. I was able to find a specialist, book a time that worked for me, and receive confirmation all within minutes. The reminders were helpful too!",
  },
  emmanuel: {
    text: "As someone living in a rural area, being able to book appointments online has been life-changing. I no longer have to travel just to schedule a visit. The system is easy to use and very reliable.",
  },
  marie: {
    text: "I appreciate how easy it is to reschedule when needed. Life happens, and ONE HEALTHLINE CONNECT understands that. The booking system is flexible and user-friendly.",
  }
},
     appointments_types: {
      title: "Appointment",
      title_highlight: "Types",
      subtitle: "We offer a wide range of appointment types to address all your healthcare needs.",
      popular: "Popular",
      book_now: "Book Now",
      more_specialties: "Don't see the appointment type you need? We offer many more specialized services.",
      view_all: "View All Specialties",
      general_consultation: {
        title: "General Consultation",
        description: "Regular check-ups and general health concerns with primary care physicians."
      },
      specialist_consultation: {
        title: "Specialist Consultation",
        description: "Focused care from specialists in various medical fields."
      },
      cardiology: {
        title: "Cardiology",
        description: "Heart health assessments and treatments with cardiologists."
      },
      ophthalmology: {
        title: "Ophthalmology",
        description: "Eye examinations and treatments with eye specialists."
      },
      orthopedics: {
        title: "Orthopedics",
        description: "Bone and joint care with orthopedic specialists."
      },
      pediatrics: {
        title: "Pediatrics",
        description: "Healthcare for infants, children, and adolescents."
      },
      pharmacy: {
        title: "Pharmacy Consultation",
        description: "Medication reviews and advice from pharmacists."
      },
      laboratory: {
        title: "Laboratory Tests",
        description: "Schedule laboratory tests and diagnostics."
      }
    },
    appointments_how: {
      title: "How to Book Your",
      title_highlight: "Appointment",
      subtitle: "Our simple 4-step process makes booking healthcare appointments quick and hassle-free.",
      steps: {
        create_account: {
          title: "Create an Account",
          description: "Sign up with your basic information to get started. It only takes a minute."
        },
        find_specialist: {
          title: "Find a Specialist",
          description: "Search for specialists by name, specialty, location, or availability."
        },
        select_date_time: {
          title: "Select Date & Time",
          description: "Choose from available time slots that work with your schedule."
        },
        confirm_pay: {
          title: "Confirm & Pay",
          description: "Review your appointment details, add any notes, and complete payment if required."
        }
      },
      book_now: "Book Now",
      need_help: "Need help booking your appointment? Our support team is available to assist you.",
      contact_support: "Contact Support"
    },
     appointments_features: {
      heading: "Why Choose Our",
      heading_highlight: "Appointment Service",
      subheading:
        "Our appointment booking system is designed to make healthcare access simple, efficient, and convenient for all Rwandans.",
      feature_24_7: {
        title: "24/7 Booking",
        description: "Schedule appointments any time of day or night, weekends and holidays included."
      },
      feature_instant: {
        title: "Instant Confirmation",
        description: "Receive immediate confirmation of your appointment with all details."
      },
      feature_specialist: {
        title: "Specialist Selection",
        description: "Choose from over 200 healthcare specialists across multiple disciplines."
      },
      feature_locations: {
        title: "Multiple Locations",
        description: "Book at any of our partner hospitals and clinics throughout Rwanda."
      },
      feature_payment: {
        title: "Secure Payment",
        description: "Pay for your appointment securely online with multiple payment options."
      },
      feature_sms: {
        title: "SMS Reminders",
        description: "Receive timely SMS reminders before your scheduled appointment."
      },
      feature_virtual: {
        title: "Virtual Options",
        description: "Choose between in-person or virtual consultations based on your needs."
      },
      feature_reschedule: {
        title: "Easy Rescheduling",
        description: "Reschedule or cancel appointments with just a few clicks when needed."
      },
      cta_title: "Ready to experience the difference?",
      cta_subtitle: "Join thousands of satisfied patients who have simplified their healthcare journey.",
      cta_stat_appointments: "Appointments Booked",
      cta_stat_satisfaction: "Satisfaction Rate"
    },
     appointments_hero: {
      badge: "Appointment Booking",
      title: "Schedule Care On",
      title_highlight: "Your Terms",
      subtitle:
        "Book appointments with healthcare providers at your convenience. Find and schedule visits with the right specialists, choose between in-person or virtual consultations.",
      search_placeholder: "Search for doctors, specialties, or hospitals...",
      search_button: "Search",
      book_button: "Book Appointment",
      view_specialties: "View Specialties",
      image_alt: "Doctor appointment booking",
      stats: {
        specialists: "Specialists",
        hospitals: "Hospitals",
        booking_time: "Booking Time",
      },
      easy_rescheduling: "Easy Rescheduling"
    },
     teleconsultation_cta: {
      title: "Ready to Experience Healthcare from Home?",
      subtitle:
        "Join thousands of Rwandans who are accessing quality healthcare through our teleconsultation service. Your first consultation is just a few clicks away.",
      start_button: "Start Consultation",
      learn_more: "Learn More"
    },
       faq4: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about our teleconsultation services. If you don't see your question here, please contact our support team.",
      q1: "What equipment do I need for a teleconsultation?",
      a1: "You'll need a device with a camera and microphone (smartphone, tablet, or computer), a stable internet connection, and the ONE HEALTHLINE CONNECT app installed. For the best experience, we recommend using headphones and finding a quiet, well-lit space for your consultation.",
      q2: "How long does a typical teleconsultation last?",
      a2: "A standard teleconsultation typically lasts 15-30 minutes, depending on the complexity of your health concern. Specialist consultations may last longer. You can see the expected duration when booking your appointment.",
      q3: "Can doctors prescribe medication through teleconsultation?",
      a3: "Yes, doctors can prescribe medications during teleconsultations when appropriate. The prescription will be digital and can be sent directly to our partner pharmacies for delivery or pickup. However, certain controlled medications may require an in-person visit.",
      q4: "What if I need lab tests or imaging?",
      a4: "If your doctor determines you need laboratory tests or imaging, they can provide a digital referral. You can visit any of our partner facilities to have these tests done. The results will be uploaded to your ONE HEALTHLINE CONNECT account and shared with your doctor for follow-up.",
      q5: "Is teleconsultation covered by insurance?",
      a5: "Many insurance providers in Rwanda now cover teleconsultation services. We work with major insurance companies including RSSB, MMI, SORAS, and others. You can verify coverage by entering your insurance details in your profile or contacting your insurance provider directly.",
      q6: "What if I need to see a doctor in person after my teleconsultation?",
      a6: "If your doctor determines that an in-person examination is necessary, they can refer you to an appropriate healthcare facility or specialist. Your teleconsultation records will be shared with the referred provider to ensure continuity of care."
    },
    testimonials2: {
      section_title: "What Our Patients Say",
      section_subtitle: "Hear from patients who have experienced our teleconsultation services firsthand.",
      read_more: "Read more patient testimonials",
      jean: {
        testimonial: "The teleconsultation service saved me so much time. I was able to speak with a doctor within 15 minutes for my child's fever, and received a prescription that was delivered to my home. Excellent service!",
        service: "Pediatric Consultation"
      },
      emmanuel: {
        testimonial: "Living in a rural area, it's difficult to access specialist care. Through ONE HEALTHLINE CONNECT, I was able to consult with a cardiologist without traveling to Kigali. The video quality was excellent and the doctor was very thorough.",
        service: "Cardiology Consultation"
      },
      marie: {
        testimonial: "I've been using the monthly plan for my chronic condition management. Being able to speak with my doctor regularly without visiting the hospital has made managing my health so much easier. Highly recommended!",
        service: "Chronic Disease Management"
      }
    },
    "pricing1": {
    "title": "Transparent Pricing Plans",
    "subtitle": "Choose the teleconsultation plan that best fits your healthcare needs and budget.",
    "plans": {
      "single": {
        "name": "Single Consultation",
        "price": "5,000 RWF",
        "description": "One-time consultation with a general practitioner",
        "features": [
          "30-minute video consultation",
          "Digital prescription if needed",
          "Follow-up messages for 24 hours",
          "Medical record of consultation"
        ]
      },
      "monthly": {
        "name": "Monthly Plan",
        "price": "15,000 RWF",
        "period": "per month",
        "description": "Unlimited consultations with general practitioners",
        "features": [
          "Unlimited consultations with GPs",
          "2 specialist consultations per month",
          "Digital prescriptions",
          "Priority scheduling",
          "24/7 access to medical chat",
          "Comprehensive medical records"
        ]
      },
      "family": {
        "name": "Family Plan",
        "price": "25,000 RWF",
        "period": "per month",
        "description": "Coverage for up to 4 family members",
        "features": [
          "Unlimited consultations with GPs",
          "4 specialist consultations per month",
          "Digital prescriptions",
          "Priority scheduling",
          "24/7 access to medical chat",
          "Family health dashboard",
          "Shared medical records management"
        ]
      }
    },
    "mostPopular": "Most Popular",
    "choosePlan": "Choose Plan",
    "footerNote": "All plans include access to our mobile app and web platform. Specialist consultations may have additional fees depending on the specialty. Prices are in Rwandan Francs (RWF)."
  },
    "teleconsultationSpecialties": {
    "title": "Available Medical Specialties",
    "description": "Our platform connects you with specialists across various medical fields to address your specific healthcare needs.",
    "specialties": {
      "generalMedicine": {
        "name": "General Medicine",
        "description": "Consultations for common illnesses, preventive care, and health assessments.",
        "availability": "24/7"
      },
      "pediatrics": {
        "name": "Pediatrics",
        "description": "Child healthcare, from newborn care to adolescent health issues.",
        "availability": "8AM - 8PM"
      },
      "dermatology": {
        "name": "Dermatology",
        "description": "Skin conditions, rashes, acne, and other dermatological concerns.",
        "availability": "By appointment"
      },
      "psychiatry": {
        "name": "Psychiatry",
        "description": "Mental health support, including anxiety, depression, and stress management.",
        "availability": "9AM - 5PM"
      },
      "cardiology": {
        "name": "Cardiology",
        "description": "Heart health consultations, including hypertension management.",
        "availability": "By appointment"
      },
      "nutrition": {
        "name": "Nutrition",
        "description": "Dietary advice, weight management, and nutritional planning.",
        "availability": "9AM - 6PM"
      }
    },
    "button": {
      "findSpecialists": "Find Specialists",
      "viewAll": "View All Specialties"
    }
  },
    "teleconsultationHowItWorks": {
    "heading": "How Teleconsultation Works",
    "description": "Our streamlined process makes it easy to connect with healthcare professionals in just a few steps.",
    "steps": [
      {
        "title": "Create an Account",
        "description": "Sign up and complete your health profile with relevant medical history and current medications."
      },
      {
        "title": "Choose a Specialist",
        "description": "Browse available doctors by specialty, ratings, and availability to find the right match."
      },
      {
        "title": "Book a Time Slot",
        "description": "Select a convenient time for your consultation from the doctor's available schedule."
      },
      {
        "title": "Join the Consultation",
        "description": "Connect via video call at the scheduled time and discuss your health concerns with the doctor."
      },
      {
        "title": "Receive Treatment Plan",
        "description": "Get a digital prescription, referrals, or follow-up appointment as recommended by the doctor."
      }
    ],
    "demoHeading": "See Teleconsultation in Action",
    "demoDescription": "Watch a short video demonstration of how our teleconsultation service works from start to finish.",
    "watchDemo": "Watch the demo",
    "videoAlt": "Teleconsultation demonstration video"
  },
    "teleconsultationFeatures": {
    "heading": "Comprehensive Teleconsultation Features",
    "description": "Our teleconsultation service offers a complete virtual healthcare experience with features designed to make remote healthcare accessible, convenient, and effective.",
    "features": {
      "video": {
        "title": "High-Quality Video Consultations",
        "description": "Connect with doctors through high-definition video calls that provide a clear and personal consultation experience."
      },
      "messaging": {
        "title": "Secure Messaging",
        "description": "Send and receive secure messages with your healthcare provider before and after your consultation."
      },
      "prescriptions": {
        "title": "Digital Prescriptions",
        "description": "Receive digital prescriptions that can be sent directly to our partner pharmacies for medication delivery."
      },
      "quickAccess": {
        "title": "Quick Access",
        "description": "Get medical attention quickly with an average wait time of just 15 minutes for urgent consultations."
      },
      "privacy": {
        "title": "Private & Secure",
        "description": "All consultations are conducted through encrypted connections to ensure your medical information remains private."
      },
      "multiDevice": {
        "title": "Multi-Device Access",
        "description": "Access teleconsultation services from any device - smartphone, tablet, or computer."
      }
    }
  },
    "teleconsultation3": {
    "serviceTag": "Teleconsultation Service",
    "title": "Virtual Healthcare At Your Fingertips",
    "description": "Connect with qualified healthcare professionals from the comfort of your home. Get medical advice, prescriptions, and follow-up care without the travel.",
    "startConsultation": "Start Consultation",
    "bookAppointment": "Book Appointment",
    "stats": {
      "doctors": "Doctors",
      "availability": "Availability",
      "avgWaitTime": "Avg. Wait Time"
    },
    "securePrivate": "Secure & Private"
  },
     "doctor1": {
    "menu": {
      "dashboard": "Dashboard",
      "appointments": "Appointments",
      "patients": "Patients",
      "teleconsultations": "Teleconsultations",
      "prescriptions": "Prescriptions",
      "settings": "Settings"
    },
    "header": {
      "panel": "Doctor's Panel"
    },
    "user": {
      "role": "Doctor"
    }
  },
  "nav": {
    "logout": "Log Out"
  },
    "settings": {
    "title": "Settings",
    "subtitle": "Manage your profile and preferences",
    "profileInformation": "Profile Information",
    "fullName": "Full Name",
    "email": "Email",
    "phoneNumber": "Phone Number",
    "specialty": "Specialty",
    "hospitalClinic": "Hospital/Clinic",
    "licenseNumber": "License Number",
    "bio": "Bio",
    "workingHours": "Working Hours",
    "to": "to",
    "notificationPreferences": "Notification Preferences",
    "newAppointmentRequests": {
      "title": "New Appointment Requests",
      "description": "Get notified when patients book appointments"
    },
    "teleconsultationReminders": {
      "title": "Teleconsultation Reminders",
      "description": "Reminders 10 minutes before virtual appointments"
    },
    "emergencyAlerts": {
      "title": "Emergency Alerts",
      "description": "Critical alerts for emergency consultations"
    },
    "patientMessages": {
      "title": "Patient Messages",
      "description": "Messages from patients through the platform"
    },
    "languageRegion": "Language & Region",
    "language": "Language",
    "timeZone": "Time Zone",
    "security": "Security",
    "currentPassword": "Current Password",
    "currentPasswordPlaceholder": "Enter current password",
    "newPassword": "New Password",
    "newPasswordPlaceholder": "Enter new password",
    "confirmNewPassword": "Confirm New Password",
    "confirmNewPasswordPlaceholder": "Confirm new password",
    "enableTwoFactorAuth": "Enable two-factor authentication",
    "saveChanges": "Save Changes"
  },
  "days": {
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday",
    "sunday": "Sunday"
  },
    "prescriptions1": {
    "title": "Prescriptions",
    "subtitle": "Manage patient prescriptions and medications",
    "newPrescription": "New Prescription",
    "searchPlaceholder": "Search by patient name or medication...",
    "allStatus": "All Status",
    "active": "Active",
    "completed": "Completed",
    "expired": "Expired",
    "date": "Date",
    "diagnosis": "Diagnosis",
    "medications": "Medications",
    "doctorsNotes": "Doctor's Notes",
    "duration": "Duration",
    "viewFull": "View Full Prescription",
    "exportPdf": "Export as PDF",
    "sendPharmacy": "Send to Pharmacy",
    "duplicate": "Duplicate Prescription",
    "pagination": {
      "previous": "Previous",
      "next": "Next",
      "pageInfo": "Page 1 of 1"
    }
  },
     "teleconsultations1": {
    "title": "Teleconsultations",
    "subtitle": "Manage virtual consultations and video calls",
    "virtualConsultations": "Virtual Consultations",
    "startCall": "Start Call",
    "scheduled": "Scheduled"
  },
     "patients": {
    "title": "My Patients",
    "subtitle": "Manage and track your assigned patients",
    "searchPlaceholder": "Search patients by name or condition...",
    "filters": {
      "conditions": {
        "all": "All Conditions",
        "hypertension": "Hypertension",
        "diabetes": "Diabetes",
        "heartDisease": "Heart Disease",
        "mentalHealth": "Mental Health"
      },
      "statuses": {
        "all": "All Status",
        "activeTreatment": "Active Treatment",
        "followUpRequired": "Follow-up Required",
        "stable": "Stable",
        "critical": "Critical"
      }
    },
    "primaryCondition": "Primary Condition",
    "status": "Status",
    "lastVisit": "Last Visit",
    "nextAppointment": "Next Appointment",
    "actions": {
      "viewFile": "View File",
      "call": "Call",
      "video": "Video"
    },
    "pagination": {
      "previous": "Previous",
      "next": "Next",
      "pageInfo": "Page {{current}} of {{total}}"
    }
  },
    "appointments1": {
    "title": "Appointments",
    "subtitle": "Manage your patient appointments and consultations",
    "status": {
      "confirmed": "confirmed",
      "pending": "pending"
    },
    "reason": "Reason",
    "joinCall": "Join Call",
    "viewDetails": "View Details"
  },
    "doctorDashboard": {
    "title": "Doctor Dashboard",
    "subtitle": "Manage your patients and consultations",
    "stats": {
      "appointmentsToday": "Today's Appointments",
      "totalPatients": "Total Patients",
      "teleconsultations": "Teleconsultations",
      "prescriptions": "Prescriptions"
    },
    "todaysSchedule": "Today's Schedule",
    "status": {
      "confirmed": "Confirmed",
      "pending": "Pending"
    },
    "quickActions": {
      "patientRecords": {
        "title": "Patient Records",
        "desc": "View and manage patient medical records"
      },
      "prescriptions": {
        "title": "Prescriptions",
        "desc": "Create and manage digital prescriptions"
      },
      "analytics": {
        "title": "Analytics",
        "desc": "View consultation statistics and insights"
      }
    },
    "appointments": {
      "generalConsultation": "General Consultation",
      "teleconsultation": "Teleconsultation",
      "followUpConsultation": "Follow-up Consultation"
    }
  },
     "userDropdown": {
    "dashboard": "Dashboard",
    "signOut": "Sign out",
    "defaultUser": "User",
    "defaultEmail": "user@example.com"
  },
     "adminSettings": {
    "title": "System Settings",
    "description": "Configure system-wide settings and preferences",
    "generalSettings": "General Settings",
    "siteName": "Site Name",
    "siteDescription": "Site Description",
    "primaryColor": "Primary Color",
    "language": "Language",
    "timezone": "Timezone",
    "notificationSettings": "Notification Settings",
    "emailNotifications": "Email Notifications",
    "emailNotificationsDesc": "Send notifications via email",
    "smsNotifications": "SMS Notifications",
    "smsNotificationsDesc": "Send notifications via SMS",
    "pushNotifications": "Push Notifications",
    "pushNotificationsDesc": "Send browser push notifications",
    "appointmentReminders": "Appointment Reminders",
    "appointmentRemindersDesc": "Automatic appointment reminders",
    "contactInformation": "Contact Information",
    "hospitalName": "Hospital Name",
    "hospitalAddress": "Hospital Address",
    "phoneNumber": "Phone Number",
    "emailAddress": "Email Address",
    "emergencyNumber": "Emergency Number",
    "appointmentSettings": "Appointment Settings",
    "appointmentSlotDuration": "Appointment Slot Duration (minutes)",
    "minutes": "{{count}} minutes",
    "maxAdvanceBooking": "Maximum Advance Booking (days)",
    "cancellationDeadline": "Cancellation Deadline (hours)",
    "acceptInsurance": "Accept Insurance",
    "acceptInsuranceDesc": "Allow insurance payments",
    "acceptMobileMoney": "Accept Mobile Money",
    "acceptMobileMoneyDesc": "Allow mobile money payments",
    "saveButton": "Save All Settings",
    "saveSuccess": "Settings saved successfully!",
    "acceptCash": "Accept Cash",
    "acceptCashDesc": "Allow cash payments"
  },
  "languages": {
    "english": "English",
    "kinyarwanda": "Kinyarwanda",
    "french": "French"
  },
  "timezones": {
    "caf": "Central Africa Time (UTC+2)",
    "cet": "Central European Time (UTC+1)"
  },
    "security": {
    "pageTitle": "Security Management",
    "pageDescription": "Monitor and configure system security settings",
    "status": {
      "secure": "Secure",
      "systemStatus": "System Status",
      "activeSessions": "Active Sessions",
      "securityAlerts": "Security Alerts",
      "uptime": "Uptime"
    },
    "settings": {
      "title": "Security Settings",
      "mfa": "Multi-Factor Authentication",
      "mfaDesc": "Require MFA for all users",
      "autoLogout": "Auto Logout",
      "autoLogoutDesc": "Automatically log out inactive users",
      "encryption": "Data Encryption",
      "encryptionDesc": "Encrypt sensitive data at rest",
      "sessionTimeout": "Session Timeout (minutes)",
      "passwordMinLength": "Minimum Password Length",
      "lockoutAttempts": "Account Lockout After Failed Attempts",
      "saveButton": "Save Security Settings"
    },
    "logs": {
      "title": "Security Logs",
      "status": {
        "success": "Success",
        "blocked": "Blocked"
      },
      "action": {
        "login": "Successful login",
        "failed_login": "Failed login attempt",
        "permission": "Accessed patient records"
      },
      "user": "User",
      "ip": "IP Address",
      "viewAll": "View All Logs"
    },
    "tools": {
      "title": "Security Tools",
      "systemBackup": {
        "title": "System Backup",
        "desc": "Create secure system backup"
      },
      "securityScan": {
        "title": "Security Scan",
        "desc": "Run vulnerability assessment"
      },
      "incidentResponse": {
        "title": "Incident Response",
        "desc": "View security incidents"
      }
    }
  },
    "reports": {
    "title": "Reports & Analytics",
    "description": "Comprehensive insights into system performance and health metrics",
    "exporting": "Exporting report in {{format}} format...",
    "export": {
      "pdf": "Export PDF",
      "excel": "Export Excel"
    },
    "period": {
      "week": "This Week",
      "month": "This Month",
      "quarter": "This Quarter",
      "year": "This Year"
    },
    "type": {
      "overview": "Overview",
      "appointments": "Appointments",
      "financial": "Financial",
      "patients": "Patients"
    },
    "metrics": {
      "totalPatients": "Total Patients",
      "appointments": "Appointments",
      "revenue": "Revenue (RWF)",
      "satisfactionRate": "Satisfaction Rate",
      "increase": "+{{percent}}% from last month"
    },
    "sections": {
      "departmentPerformance": "Department Performance",
      "appointmentStatus": "Appointment Status",
      "insuranceClaimsSummary": "Insurance Claims Summary",
      "reportTemplates": "Report Templates"
    },
    "labels": {
      "patients": "patients"
    },
    "appointmentStatus": {
      "completed": "Completed",
      "cancelled": "Cancelled",
      "noShow": "No Show",
      "rescheduled": "Rescheduled"
    },
    "insurance": {
      "provider": "Insurance Provider",
      "claimsCount": "Claims Count",
      "totalAmount": "Total Amount (RWF)",
      "avgClaim": "Avg. Claim"
    },
    "templates": {
      "monthlySummary": {
        "title": "Monthly Summary",
        "desc": "Comprehensive monthly report"
      },
      "patientAnalytics": {
        "title": "Patient Analytics",
        "desc": "Patient demographics and trends"
      },
      "financialReport": {
        "title": "Financial Report",
        "desc": "Revenue and expense analysis"
      }
    }
  },
    "appointments": {
    "management": "Appointments Management",
    "description": "Manage and monitor all appointments in the system",
    "stats": {
      "total": "Total Appointments",
      "confirmed": "Confirmed",
      "pending": "Pending",
      "teleconsultations": "Teleconsultations"
    },
    "filters": {
      "all": "All Appointments",
      "confirmed": "Confirmed",
      "pending": "Pending",
      "completed": "Completed",
      "cancelled": "Cancelled"
    },
    "searchPlaceholder": "Search appointments...",
    "table": {
      "patient": "Patient",
      "doctor": "Doctor",
      "dateTime": "Date & Time",
      "type": "Type",
      "status": "Status",
      "actions": "Actions"
    },
    "quickActions": {
      "title": "Quick Actions",
      "schedule": {
        "title": "Schedule Appointment",
        "desc": "Create new appointment"
      },
      "viewSchedule": {
        "title": "View Schedule",
        "desc": "See today's appointments"
      },
      "filters": {
        "title": "Advanced Filters",
        "desc": "Filter by date, doctor, etc."
      }
    },
    "statusOptions": {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "completed": "Completed",
      "cancelled": "Cancelled"
    }
  },
    "notifications": {
    "button_aria_label": "Toggle notifications dropdown",
    "title": "Notification",
    "close": "Close notifications",
    "requested_teleconsultation": "requested teleconsultation at",
    "uploaded_lab_results": "uploaded lab results to",
    "requested_pharmacy_delivery": "requested pharmacy delivery from",
    "cancelled_appointment": "cancelled upcoming appointment at",
    "appointment": "Appointment",
    "medical_report": "Medical Report",
    "prescription": "Prescription",
    "just_now": "Just now",
    "one_hour_ago": "1 hr ago",
    "minutes_ago": "{{count}} min ago",
    "view_all": "View All Notifications",
    "user_alt": "{{name}}'s profile picture"
  },
  "medicalHistory": {
    "title": "Medical History",
    "subtitle": "Your complete medical records and consultation history",
    "total_visits": "Total Visits",
    "doctors_seen": "Doctors Seen",
    "prescriptions": "Prescriptions",
    "lab_reports": "Lab Reports",
    "filter_title": "Filter History",
    "all_doctors": "All Doctors",
    "all_departments": "All Departments",
    "all_types": "All Types",
    "in_person": "In-Person",
    "teleconsultation": "Teleconsultation",
    "diagnosis": "Diagnosis",
    "medications": "Medications",
    "notes": "Doctor's Notes",
    "view_full_report": "View Full Report",
    "download_pdf": "Download PDF",
    "share_with_doctor": "Share with Doctor",
    "load_more": "Load More Records",
    "export_title": "Export Medical History",
    "export_description": "Download your complete medical history for personal records or sharing with healthcare providers.",
    "email_summary": "Email Summary"
  },
  "departments": {
    "cardiology": "Cardiology",
    "gynecology": "Gynecology",
    "mental_health": "Mental Health",
    "general_medicine": "General Medicine"
  },
  "departments": {
    "cardiology": "Cardiology",
    "gynecology": "Gynecology",
    "mental_health": "Mental Health",
    "general_medicine": "General Medicine"
  },
    "emergency1": {
    "title": "Emergency Request",
    "call_now": "Call emergency services immediately if the situation is critical",
    "hotlines": "Emergency Hotlines",
    "emergency": "Emergency",
    "police": "Police",
    "fire_rescue": "Fire & Rescue",
    "select_emergency_type": "Select the type of emergency",
    "continue": "Continue",
    "choose_help_type": "Choose the type of help you need",
    "back": "Back",
    "share_location": "Share Your Location",
    "use_gps": "Use GPS Location",
    "gps_description": "Automatically detect your current location using GPS",
    "manual_location": "Enter your location manually",
    "manual_location_placeholder": "Type your current address or nearby landmark",
    "describe_emergency": "Describe the Emergency",
    "description_label": "Emergency Description",
    "description_placeholder": "Provide details about what happened",
    "take_photo": "Take Photo",
    "record_voice_note": "Record Voice Note",
    "severity_level": "Select Severity Level",
    "submit_request": "Submit Request",
    "request_submitted": "Request Submitted",
    "request_confirmed": "Your request has been confirmed",
    "help_on_way": "Help is on the way",
    "response_status": "Response Status",
    "request_received": "Request received",
    "dispatching_help": "Dispatching help",
    "help_arrival": "Help arriving soon",
    "nearest_facility": "Nearest Medical Facility",
    "call_hotline": "Call Hotline",
    "track_response": "Track Response"
  },
  "emergencyTypes": {
    "accident": "Road Accident",
    "maternal": "Maternal Emergency",
    "mental": "Mental Health Crisis",
    "respiratory": "Respiratory Emergency",
    "covid": "COVID-19 Emergency",
    "cardiac": "Cardiac Emergency"
  },
  "helpTypes": {
    "ambulance": "Ambulance",
    "doctor": "Doctor",
    "medicine": "Medicine Delivery"
  },
  "severityLevels": {
    "mild": "Mild",
    "mild_desc": "Requires attention but not life-threatening",
    "intense": "Intense",
    "intense_desc": "Urgent but manageable",
    "severe": "Severe",
    "severe_desc": "Life-threatening situation"
  },
     aiAssistant: {
      title: "AI Health Assistant",
      subtitle: "Get personalized health guidance and support",
      quickFeatures: {
        symptomChecker: {
          title: "Symptom Checker",
          description: "Describe your symptoms and get preliminary health insights",
        },
        appointmentHelp: {
          title: "Appointment Help",
          description: "Get assistance with booking appointments and choosing doctors",
        },
        prescriptionGuide: {
          title: "Prescription Guide",
          description: "Understand your prescriptions and medication instructions",
        },
        referralSupport: {
          title: "Referral Support",
          description: "Get help finding the right specialists and clinics",
        },
        healthEducation: {
          title: "Health Education",
          description: "Learn about nutrition, hygiene, and disease prevention",
        },
        privacySafety: {
          title: "Privacy & Safety",
          description: "Your data is secure and conversations are confidential",
        },
      },
      chat: {
        title: "Chat with AI Assistant",
        assistantName: "AI Assistant",
        welcomeMessage: "Hello! I'm here to help you with your health questions. How can I assist you today?",
        quickActions: {
          checkSymptoms: "Check symptoms",
          bookAppointment: "Book appointment",
          understandPrescription: "Understand prescription",
          findSpecialist: "Find specialist",
        },
        inputPlaceholder: "Type your health question here...",
        sendButton: "Send",
      },
      healthTips: {
        title: "Today's Health Tips",
        tips: {
          stayHydrated: {
            title: "💧 Stay Hydrated",
            description: "Drink at least 8 glasses of water daily to maintain optimal health.",
          },
          exerciseRegularly: {
            title: "🏃‍♂️ Exercise Regularly",
            description: "Aim for 30 minutes of physical activity 5 times a week.",
          },
          balancedDiet: {
            title: "🍎 Balanced Diet",
            description: "Include fruits, vegetables, and whole grains in your daily meals.",
          },
        },
      },
      privacyNotice: {
        title: "Privacy & Data Safety",
        description:
          "Your conversations with our AI assistant are confidential and encrypted. We do not share your personal health information with third parties. For serious medical emergencies, please contact emergency services immediately.",
      },
    },
    "common": {
    "continue": "Continue",
    "back": "Back",
    "confirm": "Confirm",
    "or": "OR"
  },
  "pharmacyOrders": {
    "title": "Pharmacy Orders",
    "subtitle": "Order medications from partner pharmacies",
    "steps": {
      "choosePharmacy": "Choose Pharmacy",
      "pharmacyProfile": "Pharmacy Profile",
      "uploadPrescription": "Upload Prescription",
      "confirmMedications": "Confirm Medications",
      "paymentInsurance": "Payment & Insurance",
      "deliveryOptions": "Delivery Options",
      "orderConfirmation": "Order Confirmation",
      "orderHistory": "Medication Order History"
    },
    "services": "Services",
    "servicesList": {
      "PrescriptionFilling": "Prescription Filling",
      "DrugConsultation": "Drug Consultation",
      "HomeDelivery": "Home Delivery",
      "HealthProducts": "Health Products",
      "EmergencyDrugs": "Emergency Drugs",
      "MedicalSupplies": "Medical Supplies",
      "Delivery": "Delivery"
    },
    "insuranceAccepted": "Insurance Accepted",
    "rating": "Rating",
    "uploadEPrescription": "Upload E-Prescription",
    "dragDropOrBrowse": "Drag and drop your prescription file or click to browse",
    "chooseFile": "Choose File",
    "enterMedications": "Manually Enter Medications",
    "medicationName": "Medication Name",
    "dosage": "Dosage",
    "quantity": "Quantity",
    "addMedication": "Add Another Medication",
    "medications": {
      "paracetamol": "Paracetamol 500mg",
      "amoxicillin": "Amoxicillin 250mg"
    },
    "tablets": "tablets",
    "quantity": "Quantity",
    "requestClarification": "Request clarification",
    "total": "Total",
    "selectPaymentMethod": "Select Payment Method",
    "paymentMethods": {
      "MobileMoney": "Mobile Money",
      "BankTransfer": "Bank Transfer",
      "InsuranceCoverage": "Insurance Coverage",
      "CashonDelivery": "Cash on Delivery"
    },
    "insuranceDetails": "Insurance Details",
    "selectInsurance": "Select Insurance",
    "policyNumber": "Policy Number",
    "processPayment": "Process Payment",
    "pickupAtPharmacy": "Pickup at Pharmacy",
    "pickupDetails": "Free - Ready in 30 minutes",
    "homeDelivery": "Home Delivery",
    "homeDeliveryDetails": "1,500 RWF - 2-4 hours",
    "deliveryAddress": "Delivery Address",
    "enterDeliveryAddress": "Enter your delivery address",
    "orderPlacedSuccess": "Order Placed Successfully!",
    "orderId": "Order ID",
    "orderStatus": "Order Status",
    "status": {
      "orderReceived": "Order Received - Pending Pharmacy Approval",
      "approvedByPharmacy": "Approved by Pharmacy",
      "readyForPickup": "Ready for Pickup/Delivery"
    },
    "viewHistory": "View History",
    "orders": {
      "order1": {
        "id": "Order #PHR-2024-001",
        "pharmacy": "UBWIZA Pharmacy",
        "date": "March 15, 2024",
        "items": {
          "paracetamol": "Paracetamol 500mg (20 tablets)",
          "amoxicillin": "Amoxicillin 250mg (14 tablets)"
        },
        "status": "Delivered"
      },
      "order2": {
        "id": "Order #PHR-2024-002",
        "pharmacy": "Mama Teta Pharmacy",
        "date": "March 10, 2024",
        "items": {
          "ibuprofen": "Ibuprofen 400mg (12 tablets)"
        },
        "status": "Completed"
      }
    },
    "viewReceipt": "View Receipt",
    "placeNewOrder": "Place New Order"
  },
    "teleconsultation": {
    "title": "Teleconsultation",
    "subtitle": "Connect with healthcare professionals remotely",
    "available": "Available for teleconsultation",
    "fee": "Fee",
    "payAndContinue": "Pay & Continue",
    "joinInstructions": "Your doctor will join shortly. Please ensure you have a stable internet connection.",
    "joinNow": "Join Now",
    "completeConsultation": "Complete Consultation",
    "steps": {
      "selectHospital": "Select Hospital/Clinic",
      "chooseConsultationType": "Choose Consultation Type",
      "selectInsurance": "Select Payment/Insurance",
      "patientInfo": "Patient Information",
      "paymentMethod": "Payment Method",
      "joinConsultation": "Join Consultation",
      "followUpOptions": "Follow-up Options",
      "medicalHistory": "Medical History"
    },
    "consultations": {
      "general": "General Consultation",
      "cardiology": "Cardiology",
      "gynecology": "Gynecology",
      "mentalHealth": "Mental Health",
      "pediatrics": "Pediatrics"
    },
    "patientInfo": {
      "fullName": "Full Name",
      "age": "Age",
      "nationalId": "National ID",
      "phone": "Phone Number",
      "weight": "Weight (kg)",
      "selectGender": "Select Gender",
      "male": "Male",
      "female": "Female",
      "symptoms": "Describe your symptoms or reason for consultation"
    },
    "paymentMethods": {
      "mobileMoney": "Mobile Money (MTN/Airtel)",
      "bankTransfer": "Bank Transfer",
      "ussdPayment": "USSD Payment"
    },
    "callTypes": {
      "video": "Video Call",
      "phone": "Phone Call"
    },
    "followUp": {
      "digitalPrescription": "Digital Prescription",
      "receiveMedications": "Receive medications digitally",
      "scheduleFollowUp": "Schedule Follow-up",
      "bookNextAppointment": "Book next appointment",
      "medicalRecords": "Medical Records",
      "viewNotes": "View consultation notes"
    },
    "history": {
      "doctorName": "{{name}}",
      "department": {
        "cardiology": "Cardiology"
      },
      "date": "Date: {{date}}",
      "status": {
        "completed": "Completed"
      },
      "diagnosis": "Diagnosis",
      "medications": "Medications",
      "notes": "Notes"
    }
  },
    "bookAppointments": {
    "title": "Book Appointment",
    "subtitle": "Schedule your medical consultation",
    "steps": {
      "chooseType": "Choose Appointment Type",
      "selectHospital": "Select Hospital/Clinic",
      "chooseDepartment": "Choose Department",
      "patientInfo": "Patient Information",
      "selectDateTime": "Select Date & Time",
      "paymentConfirmation": "Payment & Confirmation"
    },
    "types": {
      "inclinic": "In-Clinic",
      "teleconsultation": "Teleconsultation",
      "followup": "Follow-up"
    },
    "typeDescriptions": {
      "inClinic": "Visit the hospital in person",
      "teleconsultation": "Virtual consultation from home",
      "followUp": "Follow-up on previous consultation"
    },
    "patientInfo": {
      "fullName": "Full Name",
      "nationalId": "National ID",
      "email": "Email Address",
      "phone": "Phone Number",
      "address": "Address"
    },
    "dateTime": {
      "preferredDate": "Preferred Date",
      "preferredTime": "Preferred Time"
    },
    "paymentSummary": "Appointment Summary",
    "type": "Type",
    "hospital": "Hospital",
    "department": "Department",
    "fee": "Fee",
    "paymentMethod": "Payment Method",
    "paymentMethods": {
      "mobilemoney": "Mobile Money",
      "banktransfer": "Bank Transfer",
      "insurance": "Insurance",
      "ussd": "USSD"
    },
    "confirmPay": "Confirm & Pay"
  },
  "departments1": {
    "generalmedicine": "General Medicine",
    "pediatrics": "Pediatrics",
    "gynecology": "Gynecology",
    "cardiology": "Cardiology",
    "mentalhealth": "Mental Health",
    "emergency": "Emergency"
  },
    "notificationButtonLabel": "Open notifications",
  "notificationTitle": "Notification",
  "closeDropdown": "Close notification dropdown",
  "userJeanUwizeye": "Jean Uwizeye",
  "requestedTeleconsultationAt": "requested teleconsultation at",
  "kingFaisalHospital": "King Faisal Hospital",
  "appointment": "Appointment",
  "justNow": "Just now",
  "userAlineMukamana": "Aline Mukamana",
  "uploadedLabResultsTo": "uploaded lab results to",
  "chuk": "CHUK",
  "medicalReport": "Medical Report",
  "minutesAgo": "{{count}} min ago",
  "userEricHabimana": "Eric Habimana",
  "requestedPharmacyDeliveryFrom": "requested pharmacy delivery from",
  "kibagabagaHospital": "Kibagabaga Hospital",
  "prescription": "Prescription",
  "userDivineIngabire": "Divine Ingabire",
  "cancelledUpcomingAppointmentAt": "cancelled upcoming appointment at",
  "rwandaMilitaryHospital": "Rwanda Military Hospital",
  "oneHourAgo": "1 hr ago",
  "viewAllNotifications": "View All Notifications",
    "patient1":{     
      "dashboard": {
      "title": "Patient Dashboard",
      "subtitle": "Manage your health and appointmentsss",
      "quickStats": {
        "upcomingAppointments": "Upcoming Appointments",
        "activePrescriptions": "Active Prescriptions",
        "healthScore": "Health Score"
      },
      "quickActions": {
        "bookAppointment": {
          "title": "Book Appointment",
          "description": "Schedule a visit with your healthcare provider"
        },
        "teleconsultation": {
          "title": "Teleconsultation",
          "description": "Connect with doctors virtually"
        },
        "pharmacyOrders": {
          "title": "Pharmacy Orders",
          "description": "Order medications from partner pharmacies"
        },
        "emergencyRequest": {
          "title": "Emergency Request",
          "description": "Request immediate medical assistance"
        },
        "medicalHistory": {
          "title": "Medical History",
          "description": "View your complete medical records"
        },
        "aiHealthAssistant": {
          "title": "AI Health Assistant",
          "description": "Get health advice and symptom checker"
        }
      },
      "recentActivity": {
        "title": "Recent Activity",
        "appointment": {
          "title": "Appointment with Dr. Smith",
          "time": "Tomorrow at 2:00 PM"
        },
        "prescription": {
          "title": "Prescription filled",
          "status": "Medication ready for pickup"
        }
      }
    }},
     "patient": {
    "menu": {
      "dashboard": "Dashboard",
      "bookAppointment": "Book Appointment",
      "teleconsultation": "Teleconsultation",
      "pharmacyOrders": "Pharmacy Orders",
      "aiAssistant": "AI Assistant",
      "emergency": "Emergency",
      "history": "History"
    },
    "header": {
      "panel": "Patient Panel"
    },
    "user": {
      "role": "Patient"
    }
  },
  "nav": {
    "logout": "Logout",
    "signin":"login"
  },
    "register": {
    "title": "Create Account",
    "description": "Join ONE HEALTHLINE CONNECT today",
    "labels": {
      "fullName": "Full Name",
      "email": "Email Address",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "accountType": "Account Type"
    },
    "placeholders": {
      "fullName": "Enter your full name",
      "email": "Enter your email",
      "password": "Enter your password",
      "confirmPassword": "Confirm your password"
    },
    "roles": {
      "patient": "Patient",
      "doctor": "Doctor",
      "admin": "Admin"
    },
    "buttons": {
      "createAccount": "Create Account",
      "creatingAccount": "Creating account...",
      "signIn": "Sign in"
    },
    "alreadyHaveAccount": "Already have an account?",
    "errors": {
      "passwordMismatch": "Passwords do not match",
      "passwordTooShort": "Password must be at least 6 characters long",
      "registrationFailed": "Registration failed. Please try again."
    }
  },
     "loginForm": {
    "title": "Welcome Back",
    "description": "Sign in to your ONE HEALTHLINE CONNECT account",
    "emailLabel": "Email Address",
    "emailPlaceholder": "Enter your email",
    "passwordLabel": "Password",
    "passwordPlaceholder": "Enter your password",
    "signIn": "Sign In",
    "signingIn": "Signing in...",
    "noAccount": "Don't have an account?",
    "signUp": "Sign up",
    "errorFallback": "Login failed. Please try again."
  },
     "contactCta": {
      "heading": "Stay Connected with ONE HEALTHLINE CONNECT",
      "description": "Download our app for the fastest way to access our services, contact our team, and manage your healthcare needs on the go.",
      "downloadApp": "Download Our App",
      "liveChat": "Live Chat Support",
      "callUs": "Call Us Now",
      "socialFollow": "Follow us on social media for updates, health tips, and more"
    },
    "social": {
      "facebook": "Facebook",
      "twitter": "Twitter",
      "instagram": "Instagram",
      "youtube": "YouTube"
    },
    "faq2": {
    "heading": "Frequently Asked Questions",
    "description": "Find answers to common questions about contacting and communicating with ONE HEALTHLINE CONNECT",
    "items": [
      {
        "question": "What are the best ways to contact ONE HEALTHLINE CONNECT?",
        "answer": "You can contact us through multiple channels: phone (+250 788 123 456), email (info@healthlinerwanda.com), the contact form on our website, or through the messaging feature in our mobile app. For emergencies, please use our emergency hotline (+250 788 999 911) or the Emergency Assistance feature in the app."
      },
      {
        "question": "How quickly can I expect a response to my inquiry?",
        "answer": "For general inquiries submitted through our contact form or email, we aim to respond within 24 hours during business days. Phone calls are typically answered immediately during business hours. For urgent medical matters, please use our emergency services for immediate assistance."
      },
      {
        "question": "Can I visit your offices without an appointment?",
        "answer": "Yes, you can visit our offices during regular business hours without an appointment for general inquiries or assistance with the app. However, for meetings with specific team members or for detailed discussions about partnerships or services, we recommend scheduling an appointment in advance to ensure the relevant staff are available."
      },
      {
        "question": "How do I provide feedback about your services?",
        "answer": "We welcome your feedback! You can provide feedback through our contact form (select 'Feedback' from the department dropdown), email us at feedback@healthlinerwanda.com, or use the feedback feature in our mobile app. Your insights help us improve our services and better meet the healthcare needs of our users."
      },
      {
        "question": "Who should I contact for technical issues with the app?",
        "answer": "For technical support with the ONE HEALTHLINE CONNECT app, please contact our technical support team at support@healthlinerwanda.com or call +250 788 123 456 and select the technical support option. You can also submit a support ticket through our contact form by selecting 'Technical Support' from the department dropdown."
      },
      {
        "question": "How can I report an emergency situation?",
        "answer": "For medical emergencies, please call our 24/7 emergency hotline at +250 788 999 911 or use the Emergency Assistance button in the ONE HEALTHLINE CONNECT app. Our emergency response team will assess your situation and dispatch appropriate help immediately."
      }
    ]
  },
  "contactLocations": {
    "heading": "Our Locations",
    "description": "Visit one of our physical locations for in-person assistance with our healthcare services",
    "viewOnMap": "View on Map",
    "locations": {
      "1": {
        "name": "ONE HEALTHLINE CONNECT Headquarters",
        "address": "KG 123 St, Kigali, Rwanda",
        "phone": "+250 788 123 456"
      },
      "2": {
        "name": "Butaro Branch Office",
        "address": "Near Butaro Hospital, Burera District, Rwanda",
        "phone": "+250 788 234 567"
      },
      "3": {
        "name": "Muhima Service Center",
        "address": "KN 2 Ave, Muhima, Kigali, Rwanda",
        "phone": "+250 788 345 678"
      }
    }
  },
    "contactInfo": {
    "heading": "Contact Information",
    "description": "Reach out to us through any of the following channels for assistance with our healthcare services",
    "cards": {
      "location": {
        "title": "Our Location",
        "details": ["KG 123 St, Kigali", "Rwanda"]
      },
      "phone": {
        "title": "Phone Numbers",
        "details": ["+250 788 123 456", "Emergency: +250 788 999 911"]
      },
      "email": {
        "title": "Email Addresses",
        "details": ["info@healthlinerwanda.com", "support@healthlinerwanda.com"]
      },
      "hours": {
        "title": "Working Hours",
        "details": ["Mon-Fri: 8:00 AM - 8:00 PM", "Sat-Sun: 9:00 AM - 5:00 PM"],
        "footer": "* Emergency services available 24/7"
      }
    },
    "emergency": {
      "title": "Emergency Contact",
      "desc": "For medical emergencies, please call our 24/7 emergency hotline or use the Emergency Assistance feature in the ONE HEALTHLINE CONNECT app.",
      "hotline": "Emergency Hotline: +250 788 999 911"
    }
  },
    "contactForm": {
    "heading": "Send Us a Message",
    "description": "Fill out the form below and our team will get back to you as soon as possible",
    "labels": {
      "name": "Full Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "department": "Department",
      "subject": "Subject",
      "message": "Message",
      "privacy": "I agree to the {privacyPolicy} and consent to the processing of my personal data."
    },
    "placeholders": {
      "name": "Your name",
      "email": "Your email",
      "phone": "Your phone number",
      "subject": "How can we help you?",
      "message": "Please provide details about your inquiry..."
    },
    "departments": {
      "general": "General Inquiry",
      "appointments": "Appointments",
      "billing": "Billing & Insurance",
      "technical": "Technical Support",
      "feedback": "Feedback"
    },
    "privacyPolicy": "Privacy Policy",
    "privacyLink": "/privacy",
    "required": "*",
    "successTitle": "Message Sent Successfully!",
    "successMessage": "Thank you for reaching out. Our team will get back to you shortly.",
    "sendMessage": "Send Message",
    "sending": "Sending..."
  },
      "contactHero": {
    "heading": "Get in {highlight} With Us",
    "highlight": "Touch",
    "description": "Have questions or need assistance? Our team is here to help you with any inquiries about our healthcare services.",
    "badge1": "24/7 Support Available",
    "badge2": "Multiple Contact Channels",
    "overlayTitle": "We're Here For You",
    "overlayDesc": "Reach out through your preferred channel",
    "badgeFloating1": "Quick Response",
    "badgeFloating2": "Professional Support"
  },
    "aboutCta": {
    "heading": "Join Us in Transforming Healthcare in Rwanda",
    "description": "Whether you’re a patient seeking care, a healthcare provider looking to expand your reach, or an organization interested in partnering with us, we invite you to be part of our journey.",
    "downloadButton": "Download Our App",
    "contactButton": "Contact Us"
  },
    "achievements": {
    "heading": "Milestones & Achievements",
    "subheading": "Our journey of growth and impact in the Rwandan healthcare landscape",
    "milestonesTitle": "Our Journey",
    "awardsTitle": "Awards & Recognition",
    "milestones": [
      {
        "year": "2023",
        "title": "ONE HEALTHLINE CONNECT Founded",
        "description": "Launched with a mission to transform healthcare access in Rwanda."
      },
      {
        "year": "2023",
        "title": "First Hospital Partnership",
        "description": "Partnered with Kigali University Hospital to offer teleconsultation services."
      },
      {
        "year": "2024",
        "title": "Mobile App Launch",
        "description": "Released our mobile application for iOS and Android platforms."
      },
      {
        "year": "2024",
        "title": "AI Health Assistant",
        "description": "Introduced our AI-powered health monitoring and advice system."
      },
      {
        "year": "2024",
        "title": "Expanded to 10 Hospitals",
        "description": "Grew our network to include 10 major hospitals across Rwanda."
      },
      {
        "year": "2025",
        "title": "5,000 Users Milestone",
        "description": "Celebrated reaching 5,000 registered users on our platform."
      }
    ],
    "awards": [
      {
        "title": "Rwanda Innovation Award",
        "year": "2024",
        "description": "Recognized for our innovative approach to healthcare delivery."
      },
      {
        "title": "Best Digital Health Solution",
        "year": "2024",
        "description": "Awarded by the Rwanda Information Society Authority."
      },
      {
        "title": "Healthcare Startup of the Year",
        "year": "2024",
        "description": "Named the top healthcare startup by Rwanda Business Magazine."
      },
      {
        "title": "Community Impact Award",
        "year": "2025",
        "description": "Recognized for our contribution to improving healthcare access in rural areas."
      }
    ]
  },
    "partners1": {
    "heading": "Our Partners",
    "subheading": "Collaborating with leading healthcare providers and organizations to deliver exceptional care"
  },
    "ourTeam": {
    "heading": "Leadership Team",
    "subheading": "Meet the dedicated professionals behind ONE HEALTHLINE CONNECT's mission to transform healthcare",
    
    "roles": {
      "founder": "Founder & CEO",
      "cto": "Chief Technology Officer",
      "cmo": "Chief Medical Officer"
    },
    
    "bios": {
      "charles": "Cardiologist with over {years} years of experience. Passionate about leveraging technology to improve healthcare access.",
      "urban": "Former Google engineer with expertise in AI and mobile applications. Led the development of our core platform.",
      "willy": "Experienced healthcare administrator who oversees our medical partnerships and ensures quality of care."
    }
  },
   "coreValues": {
    "heading": "Our Core Values",
    "subtitle": "The principles that guide our mission and shape our approach to healthcare",
    "compassion": {
      "title": "Compassion",
      "description": "We approach healthcare with empathy and understanding, recognizing that each patient has unique needs and concerns."
    },
    "integrity": {
      "title": "Integrity",
      "description": "We uphold the highest ethical standards in all our operations, ensuring privacy, security, and transparency."
    },
    "inclusivity": {
      "title": "Inclusivity",
      "description": "We are committed to making healthcare accessible to all Rwandans, regardless of location, income, or background."
    },
    "innovation": {
      "title": "Innovation",
      "description": "We continuously seek new and better ways to deliver healthcare services, leveraging technology to overcome challenges."
    },
    "excellence": {
      "title": "Excellence",
      "description": "We strive for excellence in everything we do, from the quality of our platform to the service we provide to our users."
    },
    "community": {
      "title": "Community",
      "description": "We believe in the power of community and work closely with local healthcare providers to create a robust healthcare ecosystem."
    }
  },
     "ourStory1": {
    "heading": "Our Story",
    "subheading": "The journey of ONE HEALTHLINE CONNECT from an idea to Rwanda's leading healthcare platform",
    "beginning": {
      "title": "The Beginning",
      "text": "ONE HEALTHLINE CONNECT was born out of a personal experience of our founder, Dr. Jean Mugabo, who witnessed firsthand the challenges faced by rural communities in accessing quality healthcare. After losing a family member due to delayed medical attention, he was determined to find a solution that would bridge the gap between patients and healthcare providers."
    },
    "challenge": {
      "title": "The Challenge",
      "text": "In Rwanda, many people still struggle to access healthcare services due to geographical barriers, limited resources, and a shortage of healthcare professionals. This is particularly true for those living in rural areas, who often have to travel long distances to reach the nearest healthcare facility."
    },
    "solution": {
      "title": "The Solution",
      "text": "Leveraging the high mobile phone penetration in Rwanda, we created a digital platform that connects patients with healthcare providers, allowing them to access medical consultations, book appointments, order medications, and receive emergency assistance—all from their mobile devices. By integrating artificial intelligence, we've also been able to provide personalized health monitoring and advice."
    },
    "today": {
      "title": "Today",
      "text": "Today, ONE HEALTHLINE CONNECT serves thousands of patients across the country, partnering with major hospitals, clinics, and pharmacies to provide comprehensive healthcare services. Our team has grown to include healthcare professionals, technology experts, and business leaders, all united by a common mission to improve healthcare access in Rwanda."
    },
    "images": {
      "foundingTeamAlt": "Founding Team",
      "firstOfficeAlt": "First Office",
      "earlyPrototypeAlt": "Early Prototype",
      "currentTeamAlt": "Current Team"
    }
  },
    "cta1": {
    "title": "Need Specialized Medical Care?",
    "subtitle": "Connect with our specialists across various departments for expert diagnosis and treatment tailored to your needs.",
    "book": "Book a Specialist",
    "emergency": "Emergency Assistance",
    "notSure": "Not sure which department you need?",
    "symptomChecker": "Try our symptom checker"
  },
    "faq1": {
    "title": "Frequently Asked Questions",
    "subtitle": "Find answers to common questions about our medical departments and specialists",
    "q1": "How do I know which department I need to visit?",
    "a1": "If you're unsure which department you need, you can start with a general practitioner who can assess your condition and refer you to the appropriate specialist. Alternatively, you can use our AI Health Assistant in the app to get guidance based on your symptoms. For emergencies, always use our Emergency Services option.",
    "q2": "Can I request a specific doctor within a department?",
    "a2": "Yes, you can request a specific doctor when booking an appointment. Our platform allows you to browse through specialists in each department, view their profiles, ratings, and availability, and select the one you prefer. However, availability may vary based on the doctor's schedule.",
    "q3": "What should I bring to my department appointment?",
    "a3": "For your appointment, please bring your identification, insurance information (if applicable), a list of current medications, any relevant medical records or test results, and a list of questions or concerns you want to discuss. For virtual consultations, ensure you have a stable internet connection and a quiet, private space.",
    "q4": "How long does a typical specialist appointment last?",
    "a4": "The duration varies by department and the nature of your visit. Initial consultations typically last 30-45 minutes, while follow-up appointments are usually 15-30 minutes. Complex cases may require longer appointments. The estimated duration will be shown when you book your appointment.",
    "q5": "Can I get a second opinion from another specialist in the same department?",
    "a5": "Yes, we encourage patients to seek second opinions when they feel it's necessary. You can book an appointment with another specialist in the same department through our platform. Your medical records can be shared between providers with your consent to ensure continuity of care.",
    "q6": "Are all departments available for virtual consultations?",
    "a6": "Most departments offer virtual consultation options, but some conditions may require in-person visits for proper diagnosis and treatment. When booking, you'll see which appointment types are available for each department and specialist. Some departments may offer initial consultations virtually with follow-up in-person visits if needed."
  },
     "departments1": {
    "featured_title": "Featured Departments",
    "featured_description": "Explore our most sought-after medical departments, offering specialized care with experienced healthcare professionals",
    "specialists_available": "{{count}} Specialists Available",
    "learn_more": "Learn More",
    "departments_list": {
      "cardiology": {
        "name": "Cardiology",
        "description": "Our Cardiology department provides comprehensive care for heart and cardiovascular conditions. From diagnostic tests to advanced treatments, our cardiologists are equipped to handle everything from routine check-ups to complex heart conditions.",
        "services": [
          "Echocardiography",
          "ECG",
          "Cardiac Stress Testing",
          "Heart Disease Management",
          "Hypertension Care"
        ]
      },
      "neurology": {
        "name": "Neurology",
        "description": "The Neurology department specializes in disorders of the nervous system, including the brain, spinal cord, and peripheral nerves. Our neurologists use advanced diagnostic tools and treatments to address conditions ranging from headaches to complex neurological disorders.",
        "services": [
          "EEG Testing",
          "Neurological Examinations",
          "Headache Management",
          "Stroke Care",
          "Movement Disorder Treatment"
        ]
      },
      "pediatrics": {
        "name": "Pediatrics",
        "description": "Our Pediatrics department is dedicated to the health and well-being of children from birth through adolescence. Our pediatricians provide preventive care, treat childhood illnesses, and monitor developmental milestones to ensure your child grows healthy and strong.",
        "services": [
          "Well-Child Visits",
          "Vaccinations",
          "Growth Monitoring",
          "Developmental Assessments",
          "Pediatric Consultations"
        ]
      }
    }
  },
     about: {
      title1: "About",
      highlight: "HEALTHLINE",
      title2: "RWANDA",
      subtitle: "Transforming healthcare access in Rwanda through innovative digital solutions",
      imageAlt: "ONE HEALTHLINE CONNECT Team",
      bottomTitle: "Bridging the Gap in Healthcare Access",
      bottomDescription: "Founded in 2025, ONE HEALTHLINE CONNECT is dedicated to making quality healthcare accessible to all Rwandans through technology and innovation.",
    },
     "departments": {
       "meet_doctors_title": "Meet Our Doctors",
    "meet_doctors_description": "Our departments are staffed by experienced healthcare professionals dedicated to providing exceptional care",
    "reviews": "{{count}} reviews",
    "book_appointment": "Book Appointment",
    "view_all_doctors": "View All Doctors",
    "title": "Our Medical Departments",
    "subtitle": "ONE HEALTHLINE CONNECT offers access to a wide range of medical specialties to address all your healthcare needs",
    "cardiology": {
      "name": "Cardiology",
      "description": "Diagnosis and treatment of heart diseases and cardiovascular conditions"
    },
    "pediatrics": {
      "name": "Pediatrics",
      "description": "Medical care for infants, children, and adolescents"
    },
    "orthopedics": {
      "name": "Orthopedics",
      "description": "Treatment of musculoskeletal system including bones, joints, and muscles"
    },
    "neurology": {
      "name": "Neurology",
      "description": "Diagnosis and treatment of disorders of the nervous system"
    },
    "dermatology": {
      "name": "Dermatology",
      "description": "Medical care for skin, hair, and nail conditions"
    },
    "ophthalmology": {
      "name": "Ophthalmology",
      "description": "Diagnosis and treatment of eye disorders and vision problems"
    },
    "ent": {
      "name": "ENT",
      "description": "Treatment of ear, nose, throat, head and neck disorders"
    },
    "gynecology": {
      "name": "Gynecology",
      "description": "Women's reproductive health and pregnancy care"
    },
    "urology": {
      "name": "Urology",
      "description": "Diagnosis and treatment of urinary tract and male reproductive system"
    },
    "psychiatry": {
      "name": "Psychiatry",
      "description": "Mental health care including therapy and medication management"
    },
    "dentistry": {
      "name": "Dentistry",
      "description": "Oral health care, preventive and restorative dental treatments"
    },
    "nutrition": {
      "name": "Nutrition",
      "description": "Dietary guidance and nutritional therapy for various health conditions"
    }
  },
    "medicalDepartments": {
    "title": "Medical",
    "highlight": "Departments",
    "subtitle": "Specialties",
    "description": "Access specialized healthcare services across multiple medical fields from Rwanda's top healthcare professionals.",
    "searchPlaceholder": "Search for a department or condition...",
    "departments": {
      "cardiology": "Cardiology",
      "pediatrics": "Pediatrics",
      "orthopedics": "Orthopedics",
      "neurology": "Neurology"
    },
    "imageAlt": "Medical Departments",
    "specializedCareTitle": "Specialized Care",
    "departmentsCount": "12+ medical departments available",
    "badges": {
      "expertSpecialists": "Expert Specialists",
      "advancedTreatments": "Advanced Treatments"
    }
  },
     "faq": {
    "title": "Frequently Asked Questions",
    "subtitle": "Find answers to common questions about our services. If you don't see your question here, feel free to contact us.",
    "teleconsultation": {
      "question": "How do I book a teleconsultation?",
      "answer": "To book a teleconsultation, download the ONE HEALTHLINE CONNECT app, create an account, and navigate to the Teleconsultation section. Select your preferred specialist, choose an available time slot, and confirm your booking. You'll receive a confirmation notification and a reminder before your appointment."
    },
    "specialists": {
      "question": "What types of specialists are available on the platform?",
      "answer": "ONE HEALTHLINE CONNECT partners with a wide range of specialists including general practitioners, pediatricians, cardiologists, dermatologists, psychiatrists, nutritionists, and more. The availability of specialists may vary based on your location and the time of day."
    },
    "emergency": {
      "question": "How does the emergency service work?",
      "answer": "In case of an emergency, open the ONE HEALTHLINE CONNECT app and tap the Emergency button. You'll be connected to our emergency response team who will assess your situation and dispatch appropriate help. The app also shares your GPS location to ensure help reaches you quickly."
    },
    "prescriptionOrder": {
      "question": "Can I order prescription medications through the app?",
      "answer": "Yes, you can order prescription medications through the app. After a consultation, your doctor can send a digital prescription directly to our partner pharmacies. Alternatively, you can upload a physical prescription through the app. Select your preferred pharmacy, review your order, and choose delivery or pickup."
    },
    "aiAssistantAccuracy": {
      "question": "How accurate is the AI Health Assistant?",
      "answer": "Our AI Health Assistant is designed to provide general health information and guidance based on the data you provide. While it uses advanced algorithms to analyze symptoms and health data, it is not a replacement for professional medical advice. Always consult with a healthcare professional for diagnosis and treatment."
    },
    "dataSecurity": {
      "question": "Is my health data secure on the platform?",
      "answer": "Yes, we take data security very seriously. All health data is encrypted and stored securely in compliance with data protection regulations. We do not share your personal health information with third parties without your explicit consent, except when required by law or in emergency situations."
    }
  },
      "servicesCta": {
    "title": "Get Started with Our Healthcare Services",
    "description": "Download our app or contact us today to access fast, reliable, and affordable healthcare solutions.",
    "downloadApp": "Download the App",
    "contactUs": "Contact Us"
  },
     "pricing": {
    "title": "Simple, Transparent Pricing",
    "subtitle": "Choose the plan that best fits your healthcare needs. All plans include access to our core services.",
    "mostPopular": "Most Popular",
    "ctaBusiness": "Contact Sales",
    "ctaDefault": "Get Started",
    "note": "All plans include access to our mobile app and web platform. Prices are in Rwandan Francs (RWF). For business plans, please contact our sales team for a customized quote.",

    "plans": {
      "basic": {
        "name": "Basic",
        "price": "Free",
        "description": "Essential healthcare services for individuals",
        "features": [
          "Teleconsultation with general practitioners",
          "Basic appointment booking",
          "Emergency assistance",
          "Medication ordering (delivery fees apply)",
          "Limited AI health assistant features"
        ]
      },
      "premium": {
        "name": "Premium",
        "price": "5,000 RWF",
        "period": "per month",
        "description": "Advanced healthcare services for individuals and families",
        "features": [
          "Unlimited teleconsultations with all specialists",
          "Priority appointment booking",
          "Emergency assistance with priority dispatch",
          "Medication ordering with free delivery",
          "Full AI health assistant features",
          "Family accounts (up to 4 members)",
          "Health records storage and sharing"
        ]
      },
      "business": {
        "name": "Business",
        "price": "Custom",
        "description": "Healthcare solutions for organizations and businesses",
        "features": [
          "Custom healthcare plans for employees",
          "Dedicated account manager",
          "Bulk appointment scheduling",
          "Employee health monitoring dashboard",
          "Corporate wellness programs",
          "Integration with existing health benefits"
        ]
      }
    }
  },
     "howItWorks": {
    "title": "How It Works",
    "subtitle": "A simple 4-step process to get started",

    "step1": {
      "title": "Sign Up",
      "description": "Create your free account in just a few minutes."
    },

    "step2": {
      "title": "Provide Your Details",
      "description": "Fill in your personal and medical information securely."
    },

    "step3": {
      "title": "Choose a Service",
      "description": "Select the healthcare service that fits your needs."
    },

    "step4": {
      "title": "Get Connected",
      "description": "Start your consultation or service instantly."
    }
  },
     "aiDoctor": {
    "label": "AI Health Assistant",
    "title": "Your Personal Health Companion Powered by AI",
    "description": "Our AI Health Assistant provides personalized health monitoring, advice, and guidance based on your health data and concerns. It's like having a healthcare professional in your pocket, available 24/7 to answer questions and provide support for your health journey.",
    "features": {
      "personalizedMonitoring": "Personalized health monitoring and tracking",
      "aiSymptomAssessment": "AI-powered symptom assessment",
      "wellnessRecommendations": "Lifestyle and wellness recommendations",
      "medicationReminders": "Medication reminders and adherence tracking",
      "healthDataAnalysis": "Health data analysis and insights",
      "integrationWithServices": "Seamless integration with other HEALTHLINE services"
    },
    "capabilitiesTitle": "AI Assistant Capabilities",
    "capabilities": {
      "generalInquiries": "General health inquiries",
      "chronicManagement": "Chronic disease management",
      "nutritionAdvice": "Nutrition and diet advice",
      "mentalHealthSupport": "Mental health support",
      "sleepImprovement": "Sleep improvement tips",
      "physicalActivity": "Physical activity recommendations"
    },
    "tryAssistant": "Try AI Assistant",
    "learnMore": "Learn More",
    "imageAlt": "AI Health Assistant",
    "overlay": {
      "healthMonitoringTitle": "Health Monitoring",
      "healthMonitoringDesc": "Track vital signs & symptoms",
      "personalizedPlansTitle": "Personalized Plans",
      "personalizedPlansDesc": "Custom health recommendations",
      "assistanceTitle": "24/7 Assistance",
      "assistanceDesc": "Always available to help"
    }
  },
    "pharmacy": {
    "label": "Pharmacy Services",
    "title": "Order Medications from Partner Pharmacies",
    "description": "Our pharmacy service allows you to order prescription and over-the-counter medications from partner pharmacies across Rwanda...",
    "features": {
      "order": "Order medications from partner pharmacies",
      "upload": "Upload prescriptions directly through the app",
      "compare": "Compare medication prices across pharmacies",
      "delivery": "Home delivery options available",
      "reminders": "Medication reminders and tracking",
      "refill": "Refill notifications for recurring prescriptions"
    },
    "partners": {
      "title": "Partner Pharmacies",
      "kigali": "Kigali Pharmacy",
      "rwanda": "Rwanda Pharmaceuticals",
      "kimironko": "Kimironko Pharmacy",
      "nyamirambo": "Nyamirambo Health Center Pharmacy",
      "remera": "Remera Pharmacy",
      "muhima": "Muhima Hospital Pharmacy"
    },
    "overlay": {
      "delivery": {
        "title": "Home Delivery",
        "subtitle": "Within 3 hours in Kigali"
      },
      "reminders": {
        "title": "Medication Reminders",
        "subtitle": "Never miss a dose"
      },
      "payment": {
        "title": "Multiple Payment Options",
        "subtitle": "Mobile money, cards, cash"
      }
    },
    "imageAlt": "Pharmacy Services",
    "buttons": {
      "order": "Order Medications",
      "view": "View Pharmacies"
    }
  },
    "emergency": {
    "label": "Emergency Services",
    "title": "Immediate Assistance When Every Minute Counts",
    "description": "Our emergency services provide immediate assistance during critical situations...",
    "features": {
      "24_7_hotline": "24/7 emergency assistance hotline",
      "ambulance_dispatch": "Ambulance dispatch services",
      "gps_tracking": "GPS location tracking for faster response",
      "direct_er_connection": "Direct connection to emergency rooms",
      "first_aid_guidance": "First aid guidance over the phone",
      "contact_notification": "Emergency contact notification"
    },
    "types_label": "Emergency Types We Handle",
    "types": {
      "medical": "Medical Emergencies",
      "accidents": "Accidents & Injuries",
      "cardiac": "Cardiac Events",
      "respiratory": "Respiratory Distress",
      "allergic": "Severe Allergic Reactions",
      "pregnancy": "Pregnancy Complications"
    },
    "cta_assistance": "Emergency Assistance",
    "cta_learn_more": "Learn More",
    "image_alt": "Emergency Services",
    "overlay": {
      "ambulance_title": "Ambulance Dispatch",
      "ambulance_sub": "Average arrival: 15 min",
      "medical_guidance_title": "Medical Guidance",
      "medical_guidance_sub": "First aid instructions",
      "gps_title": "GPS Tracking",
      "gps_sub": "Precise location sharing"
    }
  },
    "appointment": {
    "tag": "Appointment Booking",
    "title": "Schedule Appointments with Top Healthcare Providers",
    "description": "Our appointment booking service allows you to schedule visits with healthcare providers at your convenience. Whether you need a routine check-up or a specialist consultation, our platform makes it easy to find and book appointments with the right healthcare professional.",
    "features": [
      "Book appointments with specialists across Rwanda",
      "Choose between in-person or virtual appointments",
      "Receive appointment reminders via SMS and email",
      "Reschedule or cancel appointments with ease",
      "View doctor availability in real-time",
      "Access your appointment history"
    ],
    "partnerHospitalsTitle": "Partner Hospitals",
    "hospitals": [
      "Kigali University Hospital",
      "Rwanda Military Hospital",
      "King Faisal Hospital",
      "Butaro Hospital",
      "Kibagabaga Hospital",
      "CHUK"
    ],
    "buttons": {
      "book": "Book an Appointment",
      "viewSpecialties": "View Specialties"
    },
    "cards": {
      "availability": {
        "title": "Real-time Availability",
        "subtitle": "See open slots instantly"
      },
      "location": {
        "title": "Location Options",
        "subtitle": "In-person or virtual"
      },
      "facilities": {
        "title": "Multiple Facilities",
        "subtitle": "Hospitals across Rwanda"
      }
    }
  },
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.departments': 'Departments', 
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.signin': 'Sign In',
    'nav.logout': 'Logout',
    'nav.findDoctor': 'Find a Doctor',
    'nav.bookAppointment': 'Book Appointment',
    'nav.healthBlog': 'Health Blog',
    'nav.ourServices': 'Our Services',
    'nav.teleconsultation': 'Teleconsultation',
    'nav.appointments': 'Appointments',
    'nav.emergency': 'Emergency',
    'nav.pharmacy': 'Pharmacy',
    'nav.aiAssistant': 'Meet Your AI Health Assistant',

    // How It Works
    'howItWorks.title': 'How It Works',
    'howItWorks.subtitle': 'Getting started with ONE HEALTHLINE CONNECT is easy. Follow these simple steps to access our healthcare services.',
    'howItWorks.step1.title': 'Download the App',
    'howItWorks.step1.description': 'Download the ONE HEALTHLINE CONNECT app from the App Store or Google Play Store.',
    'howItWorks.step2.title': 'Create an Account',
    'howItWorks.step2.description': 'Sign up with your phone number or email and complete your health profile.',
    'howItWorks.step3.title': 'Choose a Service',
    'howItWorks.step3.description': 'Select the healthcare service you need from our comprehensive offerings.',
    'howItWorks.step4.title': 'Connect with Providers',
    'howItWorks.step4.description': 'Get connected with healthcare providers, book appointments, or access emergency services.',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.reset': 'Reset',
    'common.clear': 'Clear',
    'common.view': 'View',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.back': 'Back',
    'common.continue': 'Continue',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.close': 'Close',
    'common.open': 'Open',

    // Language
    'language.english': 'English',
    'language.kinyarwanda': 'Kinyarwanda',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.phone': 'Phone Number',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.loginError': 'Login failed. Please check your credentials.',
    'auth.registerError': 'Registration failed. Please try again.',
    'auth.invalidEmail': 'Please enter a valid email address.',
    'auth.passwordTooShort': 'Password must be at least 8 characters.',
    'auth.passwordMismatch': 'Passwords do not match.',

    // Patient Dashboard
    'patient.menu.dashboard': 'Dashboard',
    'patient.menu.bookAppointment': 'Book Appointment',
    'patient.menu.teleconsultation': 'Teleconsultation',
    'patient.menu.pharmacyOrders': 'Pharmacy Orders',
    'patient.menu.aiAssistant': 'AI Assistant',
    'patient.menu.emergency': 'Emergency',
    'patient.menu.history': 'Medical History',
    'patient.header.panel': 'Patient Panel',
    'patient.user.role': 'Patient',
    'patient.dashboard.title': 'Patient Dashboard',
    'patient.dashboard.welcome': 'Welcome back',
    'patient.dashboard.upcomingAppointments': 'Upcoming Appointments',
    'patient.dashboard.recentOrders': 'Recent Pharmacy Orders',
    'patient.dashboard.healthMetrics': 'Health Metrics',

    // Doctor Dashboard
    'doctor.menu.dashboard': 'Dashboard',
    'doctor.menu.appointments': 'Appointments',
    'doctor.menu.patients': 'Patients',
    'doctor.menu.teleconsultations': 'Teleconsultations',
    'doctor.menu.prescriptions': 'Prescriptions',
    'doctor.menu.settings': 'Settings',
    'doctor.header.panel': 'Doctor Panel',
    'doctor.user.role': 'Doctor',
    'doctor.dashboard.title': 'Doctor Dashboard',
    'doctor.dashboard.todayAppointments': "Today's Appointments",
    'doctor.dashboard.totalPatients': 'Total Patients',
    'doctor.dashboard.pendingConsultations': 'Pending Consultations',

    // Admin Dashboard
    "admin.menu.dashboard": "Dashboard",
    'admin.menu.userManagement': 'User Management',
    'admin.menu.patients': 'Patients',
    'admin.menu.doctors': 'Doctors',
    'admin.menu.appointments': 'Appointments',
    'admin.menu.reports': 'Reports',
    'admin.menu.security': 'Security',
    'admin.menu.settings': 'Settings',
    'admin.menu.analytics': 'Analytics',
    'admin.menu.messages': 'Messages',
    'admin.header.panel': 'Admin Panel',
    'admin.user.admin': 'Administrator',
    'admin.dashboard.title': 'Admin Dashboard',
    'admin.dashboard.totalUsers': 'Total Users',
    'admin.dashboard.activePatients': 'Active Patients',
    'admin.dashboard.activeDoctors': 'Active Doctors',
    'admin.dashboard.todayAppointments': "Today's Appointments",

    // Appointments
    'appointments.title': 'Appointments',
    'appointments.book': 'Book Appointment',
    'appointments.upcoming': 'Upcoming Appointments',
    'appointments.past': 'Past Appointments',
    'appointments.cancelled': 'Cancelled Appointments',
    'appointments.status.confirmed': 'Confirmed',
    'appointments.status.pending': 'Pending',
    'appointments.status.cancelled': 'Cancelled',
    'appointments.status.completed': 'Completed',
    'appointments.selectDoctor': 'Select Doctor',
    'appointments.selectDate': 'Select Date',
    'appointments.selectTime': 'Select Time',
    'appointments.reason': 'Reason for Visit',
    'appointments.notes': 'Additional Notes',
    'appointmentsPage.title': 'Book Your Appointment',
    'appointmentsPage.subtitle': 'Schedule a consultation with our healthcare professionals',

    // Services
    'services.teleconsultation': 'Teleconsultation',
    'services.appointments': 'Appointments',
    'services.emergency': 'Emergency',
    'services.pharmacy': 'Pharmacy',
    'services.aiAssistant': 'AI Health Assistant',
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive healthcare services at your fingertips',

    // Forms
    'form.required': 'This field is required',
    'form.invalidEmail': 'Please enter a valid email',
    'form.invalidPhone': 'Please enter a valid phone number',
    'form.selectOption': 'Please select an option',
    'form.enterDetails': 'Please enter details',

    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.support': 'Support',
    'footer.legal': 'Legal',
    'footer.contact': 'Contact Us',
    'footer.followUs': 'Follow Us',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',
    'footer.copyright': '© 2024 ONE HEALTHLINE CONNECT. All rights reserved.',
    'footer.description': 'Your trusted healthcare partner providing quality medical services across Rwanda.',

    // Emergency
    'emergency.title': 'Emergency Services',
    'emergency.description': 'Get immediate medical assistance',
    'emergency.call': 'Call Emergency',
    'emergency.number': '912',

    // Pharmacy
    'pharmacy.title': 'Pharmacy Services',
    'pharmacy.description': 'Order medications and health products',
    'pharmacy.orderMedicine': 'Order Medicine',
    'pharmacy.uploadPrescription': 'Upload Prescription',

    // AI Assistant
    'ai.title': 'AI Health Assistant',
    'ai.description': 'Get personalized health insights and recommendations',
    'ai.startChat': 'Start Chat',
    'ai.askQuestion': 'Ask a Question',

    // Errors
    'error.general': 'Something went wrong. Please try again.',
    'error.network': 'Network error. Please check your connection.',
    'error.unauthorized': 'You are not authorized to access this resource.',
    'error.notFound': 'The requested resource was not found.',
    'error.serverError': 'Server error. Please try again later.',

    // Success Messages
    'success.appointmentBooked': 'Appointment booked successfully!',
    'success.profileUpdated': 'Profile updated successfully!',
    'success.passwordChanged': 'Password changed successfully!',
    'success.emailSent': 'Email sent successfully!',

    // Tables
    'table.name': 'Name',
    'table.email': 'Email',
    'table.phone': 'Phone',
    'table.status': 'Status',
    'table.date': 'Date',
    'table.time': 'Time',
    'table.actions': 'Actions',
    'table.noData': 'No data available',
    'table.loading': 'Loading data...',

    // Modals
    'modal.confirmDelete': 'Are you sure you want to delete this item?',
    'modal.confirmCancel': 'Are you sure you want to cancel?',
    'modal.unsavedChanges': 'You have unsaved changes. Do you want to discard them?',

    // Profile
    'profile.title': 'Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.contactInfo': 'Contact Information',
    'profile.medicalInfo': 'Medical Information',
    'profile.emergencyContact': 'Emergency Contact',
    'profile.updateProfile': 'Update Profile',
    'profile.changePassword': 'Change Password',

    // Settings
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.security': 'Security',
    'settings.language': 'Language',
    'settings.theme': 'Theme',

    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Mark All as Read',
    'notifications.noNotifications': 'No notifications',
    'notifications.newAppointment': 'New appointment scheduled',
    'notifications.appointmentReminder': 'Appointment reminder',
    'notifications.prescriptionReady': 'Prescription ready for pickup',

    // Search
    'search.placeholder': 'Search...',
    'search.noResults': 'No results found',
    'search.searchResults': 'Search Results',
    'search.searchFor': 'Search for',

    // Filters
    'filter.all': 'All',
    'filter.active': 'Active',
    'filter.inactive': 'Inactive',
    'filter.pending': 'Pending',
    'filter.approved': 'Approved',
    'filter.rejected': 'Rejected',
    'filter.dateRange': 'Date Range',
    'filter.status': 'Status',
    'filter.category': 'Category',

    // Pagination
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    'pagination.page': 'Page',
    'pagination.of': 'of',
    'pagination.showing': 'Showing',
    'pagination.results': 'results',

    // Health Metrics
    'health.bloodPressure': 'Blood Pressure',
    'health.heartRate': 'Heart Rate',
    'health.temperature': 'Temperature',
    'health.weight': 'Weight',
    'health.height': 'Height',
    'health.bmi': 'BMI',
    'health.lastUpdated': 'Last Updated',

    // Medical History
    'medical.history': 'Medical History',
    'medical.allergies': 'Allergies',
    'medical.medications': 'Current Medications',
    'medical.conditions': 'Medical Conditions',
    'medical.surgeries': 'Past Surgeries',
    'medical.familyHistory': 'Family History',

    // Prescriptions
    'prescription.title': 'Prescriptions',
    'prescription.medication': 'Medication',
    'prescription.dosage': 'Dosage',
    'prescription.frequency': 'Frequency',
    'prescription.duration': 'Duration',
    'prescription.instructions': 'Instructions',
    'prescription.prescribedBy': 'Prescribed By',
    'prescription.prescribedDate': 'Prescribed Date',
    
    irabaruta_logo: "Irabaruta Logo",
    nav: {
      home: "Home",
      services: "Services",
      departments: "Departments",
      about: "About",
      contact: "Contact",
      teleconsultation: "Teleconsultation",
      appointments: "Appointments",
      emergency: "Emergency",
      pharmacy: "Pharmacy",
      aiAssistant: "Meet Your AI Health Assistant",
      logout: "Logout",
      user: "User",
      patient: "Patient",
    },
    hero1: {
      badge: "24/7 Healthcare Services",
      title: "Healthcare <span class='text-green-600'>Reimagined</span> for Rwanda",
      description:
        "ONE HEALTHLINE CONNECT brings advanced healthcare to your fingertips. Connect with specialists, book appointments, access emergency services, and manage your health journey—all in one platform.",
      cta_get_started: "Get Started",
      cta_emergency: "Emergency Assistance",
      users_count: "1,200+ Users",
      users_trust: "Trust our services",
      consultations_title: "Virtual Consultations",
      consultations_desc: "Connect with specialists from the comfort of your home",
      badge_new: "NEW",
      user1: "User 1",
      user2: "User 2",
      user3: "User 3",
      user4: "User 4",
      doctor_consulting_with_patient: "Doctor consulting with patient",
    },
    services2: {

      title: "Our Services",
      subtitle: "Comprehensive healthcare services designed to meet all your medical needs",
      teleconsultation: {
        title: "Teleconsultation",
        desc: "Connect with specialists from various hospitals across Rwanda",
      },
      appointments: {
        title: "Appointments",
        desc: "Book and manage medical appointments with ease",
      },
      emergency: {
        title: "Emergency",
        desc: "24/7 emergency assistance services when you need it most",
      },
      pharmacy: {
        title: "Pharmacy",
        desc: "Order medications from local pharmacies with delivery options",
      },
      ai: {
        badge: "AI-Powered",
        title: "Meet Your AI Health Assistant",
        desc:
          "Our advanced AI system provides personalized health monitoring, lifestyle tips, medication reminders, and preliminary consultations. Get instant health advice anytime, anywhere.",
        features: {
          monitoring: "Health Monitoring",
          lifestyle: "Lifestyle Tips",
          medication: "Medication Advice",
          symptom: "Symptom Checker & Analysis",
        },
        cta: "Try AI Assistant",
      },
      learnMore: "Learn more",
    },
    departments: {

      title: "Medical Departments",
      subtitle: "Access specialized care across multiple medical fields from Rwanda's top specialists",
      list: {
        cardiology: "Cardiology",
        ophthalmology: "Ophthalmology",
        dentistry: "Dentistry",
        antenatal: "Antenatal",
        neurology: "Neurology",
        orthopedics: "Orthopedics",
      },
      viewAll: "View All Departments",
    },
    stats: {
      partnerHospitals: "Partner Hospitals",
      medicalSpecialists: "Medical Specialists",
      availability: "Availability",
      patientsServed: "Patients Served",
      partnerHospitalsCount: "10+",
      medicalSpecialistsCount: "50+",
      availabilityCount: "24/7",
      patientsServedCount: "5000+",
    },
    doctorsSection: {
      title: "Meet Our Specialists",
      description: "Our network includes Rwanda's top medical professionals ready to provide you with exceptional care",
      viewAll: "View all doctors",
      available: "Available Today",
      unavailable: "Unavailable",
      book: "Book",
      chat: "Chat",
      specialties: {
        cardiologist: "Cardiologist",
        pediatrician: "Pediatrician",
        neurologist: "Neurologist",
        dentist: "Dentist",
      },
      reviews: "reviews",
      doctor1: {
        name: "Dr. Jean Mugabo",
        specialty: "Cardiologist",
        hospital: "Kigali University Hospital",
        reviewsCount: 120,
        rating: 4.9,
      },
      doctor2: {
        name: "Dr. Marie Uwase",
        specialty: "Pediatrician",
        hospital: "Rwanda Children's Hospital",
        reviewsCount: 120,
        rating: 4.9,
      },
      doctor3: {
        name: "Dr. Eric Ndayishimiye",
        specialty: "Neurologist",
        hospital: "CHUK",
        reviewsCount: 120,
        rating: 4.9,
      },
      doctor4: {
        name: "Claire Mutesi",
        specialty: "Dentist",
        hospital: "Gakwerere's Dental Clinic",
        reviewsCount: 120,
        rating: 4.9,
      },
    },
    testimonials: {
      title: "What Our Patients Say",
      subtitle: "Real experiences from people who have transformed their healthcare journey with ONE HEALTHLINE CONNECT",
      roles: {
        mother: "Mother of two",
      },
      quotes: {
        1: "ONE HEALTHLINE CONNECT has transformed how my family accesses healthcare. The teleconsultation feature saved us hours of travel when my son had a fever. The doctor was able to diagnose and prescribe medication that was delivered to our home within hours.",
      },
      prev: "Previous testimonial",
      next: "Next testimonial",
      goto: "Go to testimonial {{index}}",
    },
    cta2: {
      title: "Download the ONE HEALTHLINE CONNECT App Now",
      description: "Take control of your health journey with our unified digital app. Access all services anytime, anywhere.",
      features: {
        access_24_7: "24/7 Doctor Services",
        book_appointments: "Book appointments with specialists",
        order_medications: "Order home-delivered medications",
        emergency_assistance: "Emergency assistance when you need it most",
        ai_health_monitoring: "Health monitoring and AI-driven advice",
      },
      download_ios: "Download on iOS",
      download_android: "Download on Android",
      app_image_alt: "ONE HEALTHLINE CONNECT App",
    },
    contact: {
      title: "Contact Us",
      description: "Have questions or need assistance? Our team is here to help you with any inquiries.",
      form: {
        title: "Send us a message",
        name_label: "Full Name",
        name_placeholder: "Your name",
        email_label: "Email Address",
        email_placeholder: "Your email",
        subject_label: "Subject",
        subject_placeholder: "How can we help you?",
        message_label: "Message",
        message_placeholder: "Your message",
        send_button: "Send Message",
      },
      info: {
        title: "Contact Information",
        location: {
          title: "Our Location",
          address: "KG 123 St, Kigali, Rwanda",
        },
        phone: {
          title: "Phone Number",
          main: "+250 788 123 456",
          emergency: "Emergency: +250 788 999 911",
        },
        email: {
          title: "Email Address",
          main: "info@healthlinerwanda.com",
        },
      },
      hours: {
        title: "Working Hours",
        monday_friday: {
          day: "Monday - Friday:",
          time: "8:00 AM - 8:00 PM",
        },
        saturday: {
          day: "Saturday:",
          time: "9:00 AM - 6:00 PM",
        },
        sunday: {
          day: "Sunday:",
          time: "10:00 AM - 4:00 PM",
        },
        note: "* Emergency services available 24/7",
      },
    },
    logo: "Irabaruta Logo",
    footer: {
      description: "Transforming healthcare access in Rwanda through innovative digital solutions. Our mission is to make quality healthcare accessible to all Rwandans.",
      quickLinks: "Quick Links",
      services: "Our Services",
      support: "Support",
      contact: "Contact",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      copyright: "All rights reserved.",
      nav: {
        home: "Home",
        about: "About",
        services: "Services",
        departments: "Departments",
        contact: "Contact",
        teleconsultation: "Teleconsultation",
        appointments: "Appointments",
        emergency: "Emergency",
        pharmacy: "Pharmacy",
        aiAssistant: "AI Health Assistant",
      },
      faq: "FAQ",

    },
    
    servicesHero: {
      title: "Our <span class='text-green-600'>Healthcare</span> Services",
      description: "Comprehensive healthcare solutions designed to meet your needs, accessible anytime, anywhere in Rwanda.",
      getStarted: "Get Started",
      viewPricing: "View Pricing",
      imageAlt: "ONE HEALTHLINE CONNECT Services",
      coreServices: {
        title: "5 Core Services",
        description: "Designed for the Rwandan healthcare landscape",
      },
      badges: {
        support: "24/7 Support",
        coverage: "Nationwide Coverage",
      },
    },

    servicesOverview: {
      title: "Our Services at a Glance",
      description: "ONE HEALTHLINE CONNECT offers a comprehensive suite of healthcare services designed to meet the diverse needs of our users",
      learnMore: "Learn more",
    },

    services5: {
      teleconsultation: {
        title: "Teleconsultation",
        description: "Virtual consultations with healthcare professionals from various hospitals",
      },
      appointments: {
        title: "Appointments",
        description: "Schedule in-person or virtual appointments with specialists",
      },
      emergency: {
        title:"Emergency",
        description: "24/7 emergency assistance and ambulance dispatch",
      },
      pharmacy: {
        title: "Pharmacy",
        description: "Order medications from partner pharmacies with delivery options",
      },
      ai: {
        title: "AI Health Assistant",
        description: "Personalized health monitoring, advice, and guidance",
      },
    },
    "hero": {
    "label": "Teleconsultation Service",
    "title": "Connect with Healthcare Professionals from Home",
    "subtitle": "Our teleconsultation service connects you with qualified healthcare professionals from various hospitals across Rwanda."
  },
  "features": {
    "consultations": "Consultations with specialists from multiple hospitals",
    "high_quality_video": "High-quality video and audio calls",
    "secure_messaging": "Secure messaging with healthcare providers",
    "digital_prescriptions": "Digital prescription services",
    "medical_records": "Medical record access and sharing",
    "followup_scheduling": "Follow-up appointment scheduling"
  },
  "steps": {
    "title": "How Teleconsultation Works",
    "select_hospital": "Select Hospital/Clinic",
    "select_hospital_desc": "Choose from our partner healthcare providers",
    "choose_type": "Choose Consultation Type",
    "choose_type_desc": "General or Specialist consultation",
    "select_insurance": "Select Insurance",
    "select_insurance_desc": "Choose your payment method",
    "register_details": "Register Patient Details",
    "register_details_desc": "Fill in your information",
    "pay_fee": "Pay Consultation Fee",
    "pay_fee_desc": "Via Bank Transfer or USSD",
    "attend_consultation": "Attend Your Consultation",
    "attend_consultation_desc": "Secure video or phone call",
    "receive_followup": "Receive Follow-Up",
    "receive_followup_desc": "Digital prescription and referrals",
    "review_history": "Review Medical History",
    "review_history_desc": "Access your medical records"
  },
  "specialties": {
    "title": "Available Specialties",
    "general_medicine": "General Medicine",
    "pediatrics": "Pediatrics",
    "cardiology": "Cardiology",
    "dermatology": "Dermatology",
    "psychiatry": "Psychiatry",
    "nutrition": "Nutrition"
  },
  "availability": {
    "by_appointment": "By appointment"
  },
  "buttons": {
    "start_consultation": "Start Consultation",
    "view_records": "View Medical Records"
  },
  "partners": {
    "title": "Our Partner Healthcare Providers"
  },
  "cta": {
    "title": "Ready to Start Your Consultation?",
    "subtitle": "Join thousands of Rwandans accessing quality healthcare from home",
    "button": "Book Consultation Now"
  },
  
    missionVision: {
      mission: {
        title: "Our Mission",
        description:
          "To revolutionize healthcare delivery in Rwanda by providing accessible, affordable, and high-quality healthcare services through innovative digital solutions. We aim to connect patients with healthcare providers seamlessly, ensuring that every Rwandan has access to the care they need, when they need it."
      },
      vision: {
        title: "Our Vision",
        description:
          "To be the leading digital healthcare platform in Rwanda and East Africa, creating a healthcare ecosystem where technology bridges the gap between patients and healthcare providers. We envision a future where every Rwandan, regardless of location or economic status, has equal access to quality healthcare services."
      }
    },
    services: {
      title: "Services",
      subtitle: "Phone",
      teleconsultation: {
        desc: "Consult with doctors remotely using our teleconsultation service.",
      },
      learnMore: "Learn More",
      appointments: {
        desc: "Book appointments easily with healthcare professionals.",
      },
      emergency: {
        desc: "Access emergency medical assistance anytime.",
      },
      pharmacy: {
        desc: "Order medications conveniently through our pharmacy services.",
      },
      ai: {
        badge: "Meet Your AI Health Assistant",
        desc: "Our AI helps you monitor health, lifestyle, medications, and symptoms.",
        features: {
          monitoring: "Health Monitoring",
          lifestyle: "Lifestyle Advice",
          medication: "Medication Reminders",
          symptom: "Symptom Checker",
        },
        cta: "Discover AI Assistance",
      },
    },
    "departments2": {
    "title": "Services Across Departments",
    "description": "ONE HEALTHLINE CONNECT offers a comprehensive range of healthcare services through our various departments",
    "diagnostic": {
      "title": "Diagnostic Services",
      "services": {
        "imaging": "Advanced Medical Imaging (X-ray, CT, MRI)",
        "laboratory": "Laboratory Testing",
        "ecg": "Electrocardiogram (ECG/EKG)",
        "ultrasound": "Ultrasound",
        "endoscopy": "Endoscopy",
        "biopsy": "Biopsy"
      }
    },
    "treatment": {
      "title": "Treatment Services",
      "services": {
        "medication": "Medication Management",
        "surgery": "Surgical Procedures",
        "physicalTherapy": "Physical Therapy",
        "radiation": "Radiation Therapy",
        "chemotherapy": "Chemotherapy",
        "rehab": "Rehabilitation Services"
      }
    },
    "preventive": {
      "title": "Preventive Care",
      "services": {
        "screenings": "Health Screenings",
        "vaccinations": "Vaccinations",
        "checkups": "Wellness Check-ups",
        "nutrition": "Nutritional Counseling",
        "lifestyle": "Lifestyle Modification Programs",
        "education": "Preventive Education"
      }
    },
    "specialized": {
      "title": "Specialized Care",
      "services": {
        "chronic": "Chronic Disease Management",
        "maternal": "Maternal and Child Health",
        "geriatric": "Geriatric Care",
        "mental": "Mental Health Services",
        "pain": "Pain Management",
        "emergency": "Emergency Care"
      }
    }
  },
  "conditions": {
    "title": "Conditions We Treat",
    "subtitle": "Our departments are equipped to diagnose and treat a wide range of medical conditions",
    "viewMore": "View More",
    "cardiology": {
      "title": "Cardiology",
      "hypertension": "Hypertension",
      "coronaryArteryDisease": "Coronary Artery Disease",
      "heartFailure": "Heart Failure",
      "arrhythmias": "Arrhythmias",
      "valvularHeartDisease": "Valvular Heart Disease"
    },
    "neurology": {
      "title": "Neurology",
      "stroke": "Stroke",
      "epilepsy": "Epilepsy",
      "parkinsons": "Parkinson's Disease",
      "multipleSclerosis": "Multiple Sclerosis",
      "migraine": "Migraine"
    },
    "orthopedics": {
      "title": "Orthopedics",
      "arthritis": "Arthritis",
      "fractures": "Fractures",
      "jointPain": "Joint Pain",
      "osteoporosis": "Osteoporosis",
      "sportsInjuries": "Sports Injuries"
    },
    "dermatology": {
      "title": "Dermatology",
      "eczema": "Eczema",
      "psoriasis": "Psoriasis",
      "acne": "Acne",
      "skinCancer": "Skin Cancer",
      "fungalInfections": "Fungal Infections"
    },
    "gastroenterology": {
      "title": "Gastroenterology",
      "gerd": "GERD",
      "ibs": "Irritable Bowel Syndrome",
      "ulcerativeColitis": "Ulcerative Colitis",
      "crohnsDisease": "Crohn's Disease",
      "hepatitis": "Hepatitis"
    },
    "endocrinology": {
      "title": "Endocrinology",
      "diabetes": "Diabetes",
      "thyroidDisorders": "Thyroid Disorders",
      "hormonalImbalances": "Hormonal Imbalances",
      "osteoporosis": "Osteoporosis",
      "adrenalDisorders": "Adrenal Disorders"
    },
    "pulmonology": {
      "title": "Pulmonology",
      "asthma": "Asthma",
      "copd": "COPD",
      "pneumonia": "Pneumonia",
      "tuberculosis": "Tuberculosis",
      "sleepApnea": "Sleep Apnea"
    },
    "gynecology": {
      "title": "Gynecology",
      "menstrualDisorders": "Menstrual Disorders",
      "endometriosis": "Endometriosis",
      "pcos": "PCOS",
      "fibroids": "Fibroids",
      "infertility": "Infertility"
    }
  },

    doctor: {
      dashboard: {
        title: "Doctor Dashboard",
        subtitle: "Manage your patients and consultations",
        stats: {
          todaysAppointments: "Today's Appointments",
          totalPatients: "Total Patients", 
          teleconsultations: "Teleconsultations",
          prescriptions: "Prescriptions"
        },
        schedule: {
          title: "Today's Schedule",
          confirmed: "Confirmed",
          pending: "Pending"
        },
        quickActions: {
          patientRecords: {
            title: "Patient Records",
            description: "View and manage patient medical records"
          },
          prescriptions: {
            title: "Prescriptions",
            description: "Create and manage digital prescriptions"
          },
          analytics: {
            title: "Analytics",
            description: "View consultation statistics and insights"
          }
        }
      },
      appointments: {
        title: "Appointments",
        subtitle: "Manage your patient appointments and consultations",
        joinCall: "Join Call",
        viewDetails: "View Details",
        reason: "Reason",
        confirmed: "confirmed",
        pending: "pending"
      },
      patients: {
        title: "My Patients",
        subtitle: "Manage and track your assigned patients",
        search: "Search patients by name or condition...",
        filters: {
          allConditions: "All Conditions",
          hypertension: "Hypertension",
          diabetes: "Diabetes",
          heartDisease: "Heart Disease",
          mentalHealth: "Mental Health",
          allStatus: "All Status",
          activeTreatment: "Active Treatment",
          followupRequired: "Follow-up Required",
          stable: "Stable",
          critical: "Critical"
        },
        primaryCondition: "Primary Condition",
        status: "Status",
        lastVisit: "Last Visit",
        nextAppointment: "Next Appointment",
        actions: {
          viewFile: "View File",
          call: "Call",
          video: "Video"
        },
        pagination: {
          previous: "Previous",
          next: "Next",
          pageOf: "Page 1 of 1"
        }
      },
      menu: {
        dashboard: "Dashboard",
        appointments: "Appointments",
        patients: "Patients",
        teleconsultations: "Teleconsultations",
        prescriptions: "Prescriptions",
        settings: "Settings"
      },
      header: {
        panel: "Doctor Panel"
      },
      user: {
        role: "Doctor"
      }
    },
    admin: {
      dashboard: {
        title: "Dashboard",
        welcome: "Welcome back, Admin",
        cards: {
          users: {
            title: "User Management",
            desc: "Manage system users and permissions",
            action: "Manage Users"
          },
          settings: {
            title: "System Settings",
            desc: "Configure system preferences",
            action: "Manage Settings"
          },
          reports: {
            title: "Reports & Analytics",
            desc: "View system reports and analytics",
            action: "View Reports"
          }
        }
      },
      users: {
        title: "User Management",
        subtitle: "Manage and monitor all system users",
        stats: {
          totalUsers: "Total Users",
          doctors: "Doctors",
          patients: "Patients",
          admins: "Admins"
        },
        filters: {
          all: "All Users",
          doctor: "Doctors",
          patient: "Patients",
          admin: "Admins"
        },
        buttons: {
          addNewUser: "Add New User"
        },
        table: {
          user: "User",
          role: "Role",
          status: "Status",
          created: "Created",
          actions: "Actions"
        },
        roles: {
          admin: "Admin",
          doctor: "Doctor",
          patient: "Patient"
        },
        statuses: {
          active: "Active",
          inactive: "Inactive"
        }
      },
      appointments: {
        title: "Appointments Management",
        subtitle: "Manage and monitor all appointments in the system",
        stats: {
          totalAppointments: "Total Appointments",
          confirmed: "Confirmed",
          pending: "Pending",
          teleconsultations: "Teleconsultations"
        },
        filters: {
          allAppointments: "All Appointments",
          confirmed: "Confirmed",
          pending: "Pending",
          completed: "Completed"
        },
        search: "Search appointments...",
        table: {
          patient: "Patient",
          doctor: "Doctor",
          dateTime: "Date & Time",
          type: "Type",
          status: "Status",
          actions: "Actions"
        },
        statuses: {
          pending: "Pending",
          confirmed: "Confirmed",
          completed: "Completed",
          cancelled: "Cancelled"
        },
        types: {
          inPerson: "In Person",
          video: "Video",
          phone: "Phone"
        },
        quickActions: {
          title: "Quick Actions",
          schedule: {
            title: "Schedule Appointment",
            description: "Create new appointment"
          },
          viewSchedule: {
            title: "View Schedule",
            description: "See today's appointments"
          },
          advancedFilters: {
            title: "Advanced Filters",
            description: "Filter by date, doctor, etc."
          }
        }
      },
      reports: {
        title: "Reports & Analytics",
        subtitle: "Comprehensive insights into system performance and health metrics",
        periods: {
          week: "This Week",
          month: "This Month",
          quarter: "This Quarter",
          year: "This Year"
        },
        types: {
          overview: "Overview",
          appointments: "Appointments",
          financial: "Financial",
          patients: "Patients"
        },
        export: {
          pdf: "Export PDF",
          excel: "Export Excel"
        },
        metrics: {
          totalPatients: "Total Patients",
          appointments: "Appointments",
          revenue: "Revenue (RWF)",
          satisfactionRate: "Satisfaction Rate",
          trend: "+{percent}% from last month"
        },
        departmentPerformance: "Department Performance",
        appointmentStatus: "Appointment Status",
        insuranceClaims: "Insurance Claims Summary",
        templates: {
          title: "Report Templates",
          monthly: {
            title: "Monthly Summary",
            description: "Comprehensive monthly report"
          },
          patientAnalytics: {
            title: "Patient Analytics",
            description: "Patient demographics and trends"
          },
          financial: {
            title: "Financial Report",
            description: "Revenue and expense analysis"
          }
        },
        table: {
          insuranceProvider: "Insurance Provider",
          claimsCount: "Claims Count",
          totalAmount: "Total Amount (RWF)",
          avgClaim: "Avg. Claim"
        },
        statusLabels: {
          completed: "Completed",
          cancelled: "Cancelled",
          noShow: "No Show",
          rescheduled: "Rescheduled"
        }
      },
      menu: {
        dashboard: "Dashboard",
        userManagement: "User Management",
        appointments: "Appointments",
        reports: "Reports",
        security: "Security",
        settings: "Settings"
      },
      header: {
        panel: "Admin Panel"
      },
      user: {
        admin: "Admin"
      }
    }   },
  rw: {
    "dashboard1": {
    "welcomeBack": "Murakaza neza, {{name}}!",
    "healthJourneySubtitle": "Urugendo rwawe rw’ubuzima na Irabaruta rurakomeje. Gira ubuzima bwiza, ube mu makuru.",
    "alerts": "Amakuru",
    "aiAssistant": "Umufasha w’Ubwenge bw’Ubukorano",
    "healthBanner": {
      "title": "Ubuzima bwawe buri hejuru!",
      "subtitle": "Ijanisha ry’ubuzima bwawe ryazamutseho 2% muri iki cyumweru. Komeza ugire neza!",
      "viewDetails": "Reba ibisobanuro"
    },
    "upcomingAppointments": "Inama zitegerejwe",
    "activePrescriptions": "Imiti iriho",
    "healthScore": "Ijanisha ry’ubuzima",
    "emergencyContacts": "Abagufasha mu buryo bwihutirwa",
    "unchanged": "Ntacyo bihinduye",
    "ready": "Biteguye",
    "quickActions": {
      "title": "Ibikorwa Byihuse",
      "bookAppointment": "Tegura inama",
      "bookAppointmentDesc": "Shyiraho gahunda yo kuganira n’abaganga baboneka",
      "startTeleconsultation": "Tangira Inama Kuri Video",
      "startTeleconsultationDesc": "Vugana n’umuganga wawe ukoresheje video",
      "available": "Biboneka",
      "aiHealthAssistant": "Umufasha w’Ubwenge bw’Ubukorano",
      "aiHealthAssistantDesc": "Fata inama z’ubuzima bwite n’imyanzuro",
      "new": "Nshya",
      "orderMedications": "Tegura imiti",
      "orderMedicationsDesc": "Saba imiti ndetse unononsore izisanzwe",
      "emergencyServices": "Serivisi z’Inshingano",
      "emergencyServicesDesc": "Shaka abagufasha mu buryo bwihutirwa",
      "medicalHistory": "Amateka y’ubuzima",
      "medicalHistoryDesc": "Reba amateka yose y’ubuzima bwawe"
    },
    "appointment": {
      "today": "Uyu munsi",
      "tomorrow": "Ejo",
      "followUp": "Gukurikirana",
      "teleconsultation": "Inama Kuri Video",
      "consultation": "Kuganira n’umuganga"
    },
    "departments": {
      "cardiology": "Ubuvuzi bw’umutima",
      "generalMedicine": "Ubuvuzi rusange",
      "dermatology": "Ubuvuzi bw’uruhu"
    },
    "viewAll": "Reba byose",
    "join": "Jya",
    "today": "Uyu munsi",
    "recentActivity": "Ibikorwa by’ingenzi",
    "healthInsights": "Amakuru y’Ubuzima",
    "healthInsightsheartRate": "Umuvuduko w’amaraso",
    "healthInsightsnormalRange": "Bisanzwe",
    "healthInsightsstepsToday": "Intambwe z’umunsi",
    "healthInsightsstepGoal": "Intego: 10,000",
    "healthInsightssleepQuality": "Ubwiza bw’ikiruhuko",
    "healthInsightssleepHours": "Amasaha 7.5",
    "activity": {
      "prescriptionFilled": "Imiti yuzuye",
      "appointmentConfirmed": "Inama yemejwe",
      "healthReportGenerated": "Raporo y’ubuzima yakozwe",
      "teleconsultationCompleted": "Inama kuri video yarangiye",
      "hoursAgo": "Mu masaha {{count}} ashize",
      "daysAgo": "Mu minsi {{count}} ishize",
      "weeksAgo": "Mu cyumweru {{count}} gishize"
    }
  },
      "cta7": {
    "title": "Tegura Inama ya Teleconsultation Uyu Munsi",
    "subtitle": "Vugana n’abaganga bacu utavuye mu rugo mu gihe gito ukoresheje iminsi mike.",
    "button": "Tegura Ubu"
  }
,
    pharmacy_cta: {
      heading: "Bohereza Imiti Yawe Uyu Munsi",
      description: "Ntuzigire ikibazo cyo kubura imiti ikenewe. Tegura itegeko ryawe none maze wungukire uburyo bwo kohereza prescription yawe ku rugo rwawe.",
      features: {
        easy_ordering: {
          title: "Gutunganya Byoroshye",
          description: "Shyira prescription yawe cyangwa hitamo mu mitI iri ku isoko ryo hasi.",
        },
        fast_delivery: {
          title: "Gutwara Byihuse",
          description: "Bona imiti yawe mu masaha make mu mijyi no ku munsi umwe mu turere twinshi.",
        },
        expert_support: {
          title: "Inkunga y'Abahanga",
          description: "Habona inama z'abaforomate bemewe ku miti yawe n'ingaruka zishoboka.",
        },
      },
      buttons: {
        order: "Tegura Imiti",
        upload: "Shyira Prescription",
        call: "Hamagara Umuforomate",
      },
    },
    pharmacy_faq: {
      heading: "Ibibazo",
      highlight: "Bikunze Kubazwa",
      description: "Shakisha ibisubizo by'ibibazo bisanzwe ku ivuriro ryacu n'uburyo bwo gutanga imiti.",
      questions: {
        upload_prescription: {
          question: "Nigute nshyira prescription yanjye?",
          answer: "Ushobora gushyira prescription yawe ufotora neza ukoresheje application cyangwa urubuga rwacu. Jya mu gice cya 'Upload Prescription', ufotore cyangwa uhitemo ishusho muri gallery, hanyuma uyohereze. Abaforomate bacu bazayisuzuma kandi bakore gahunda y'itegeko ryawe.",
        },
        medication_types: {
          question: "Ni ubuhe bwoko bw'imiti nshobora gutumiza?",
          answer: "Ushobora gutumiza imiti yanditswe na prescription ndetse n'iyo ku isoko ryo hasi. Dutanga imiti y'indwara zikomeje, antibiotique, imiti y'ububabare, vitamini, supplements, n'ibikoresho by'ubuvuzi. Imiti yose iva mu mavuriro yemewe.",
        },
        delivery_time: {
          question: "Gutwara imiti bimara igihe kingana iki?",
          answer: "Igihe cyo gutwara imiti gitandukana hashingiwe ku karere uriho. Mu mujyi wa Kigali, gutwara bimara amasaha 1-3. Imijyi yo mu ntara igenerwa gutangwa ku munsi umwe, naho mu byaro bikaba bishobora gufata kugeza amasaha 24. Serivisi yihuse irahari mu turere twinshi ku miti yihutirwa.",
        },
        minimum_order: {
          question: "Hariho umubare muto w'itegeko?",
          answer: "Nta mubare muto w'itegeko ku itegeko ry'imiti. Ariko, amategeko ari munsi ya RWF 10,000 ashobora gusaba amafaranga yo gutwara hashingiwe ku karere. Amategeko arengeje RWF 10,000 akunze guhabwa gutangwa ku buntu mu mijyi.",
        },
        payment_methods: {
          question: "Nigute nishyura imiti yanjye?",
          answer: "Dutanga uburyo bwinshi bwo kwishyura harimo mobile money (MTN MoMo, Airtel Money), amakarita ya credit/debit, ndetse n'amafaranga ku buryo bwo gutanga. Ku birebana n'ubwishingizi, ushobora gushyira ikarita y'ubwishingizi hamwe na prescription, kandi tuzakurikirana ikirego n'umukoresha wawe.",
        },
        medication_authenticity: {
          question: "Ese imiti ni nyayo kandi ifite umutekano?",
          answer: "Yego, imiti yose iva mu mavuriro yemewe no mu bacuruzi bemerewe mu Rwanda. Dukurikiza amategeko y'ubuziranenge kandi dufite uburyo bwiza bwo kubika. Buri muti ufite ibimenyetso byo kwemeza n'imibare ya batch ishobora kugenzurwa.",
        },
        refund_policy: {
          question: "Ese nshobora gusubizwa amafaranga niba nahawe imiti itari yo?",
          answer: "Yego, niba uhabwa imiti itari yo cyangwa hari ikibazo cy'ubuziranenge, dutanga amafaranga yose cyangwa gusimbuza. Nyamuneka menyesha ikibazo mu masaha 24 uhereye igihe wakiriye itegeko ryawe uhamagara service y'abakiriya.",
        },
        temperature_sensitive: {
          question: "Ese mutanga imiti ikenera ubushyuhe bwihariye?",
          answer: "Yego, dutanga imiti ikenera ubushyuhe bwihariye nka insulin dukoresheje gupfunyika bikonjesha. Abakozi bacu bashinzwe gutwara imiti bahawe amahugurwa yo gukoresha neza iyi miti, kugira ngo ikomeze gukora neza mu gihe cyose cyo gutwara.",
        },
      },
      contact: {
        prompt: "Haracyari ibibazo ku bijyanye na serivisi zacu?",
        message: "Hamagara itsinda ry'abaforomate kuri {{email}} cyangwa uhamagare kuri {{phone}}",
      },
    },
     pharmacy_testimonials: {
      heading_part1: "Ibyo Abakiriya Bacu",
      heading_part2: "Bavuga",
      description: "Abanyarwanda benshi bifashisha serivisi yacu ya farumasi mu kubona imiti yabo. Dore ibyo bavuga.",
      quotes: {
        jean: "Serivisi yo gutanga imiti yahinduye ubuzima bwa nyina ufite diyabete. Ntitukibabara ku kubura insulin kuko itangwa ku rugo buri kwezi.",
        emmanuel: "Nari mfite impungenge mu ntangiriro, ariko nyuma yo gukoresha serivisi ku miti y'amaraso, nishimiye umutekano n'ubwihutire. Konsultasiyo n'umuforomokazi yarafashije cyane.",
        marie: "N'ubwo ntuye mu cyaro, ONE HEALTHLINE CONNECT itanga imiti y'umuryango wanjye buri gihe. Ipaki ni iyizewe kandi umukozi utanga imiti ni inyangamugayo.",
      },
      stats_heading: "Serivisi yacu ya Farumasi mu mibare",
      stats_description: "Twiyemeje gutanga serivisi y'imiti yizewe mu Rwanda hose",
      stats: {
        on_time: "Gutanga ku gihe",
        monthly_deliveries: "Ibipaki bya buri kwezi",
        customer_satisfaction: "Ibyishimo by'abakiriya",
        medication_authenticity: "Ukuri kw'Imiti",
      },
    },
     pharmacy_delivery: {
      heading: "Gutwara Imiti Byihuse kandi Bizira Impungenge",
      highlight: "Gutanga Imiti",
      description: "Dutanga imiti mu buryo bwizewe kandi vuba ku rugo rwawe, kugirango udahomba ku miti y'ingenzi.",
      image_alt: "Serivisi yo gutwara imiti",
      features: {
        nationwide: { title: "Gutanga mu Ntara Zose", description: "Dutanga mu turere twose twa Rwanda, harimo n'ahantu hakikijwe, kugirango buri wese abone imiti y'ingenzi." },
        express: { title: "Gutanga Byihuse", description: "Ukeneye imiti byihutirwa? Serivisi yacu yo gutanga byihuse ituma uhabwa imiti y'ingenzi mu masaha 1-3 mu mijyi." },
        secure: { title: "Gupfunyika Neza", description: "Imiti yose ipfunyikijwe neza kugirango irinde ubuziranenge, ubuzima bwite, kandi igere ku mutekano." },
        temp: { title: "Kugenzura Ubushyuhe", description: "Imiti ikeneye ubushyuhe igumishwa mu bikoresho bikonjesha kugirango ikomeze gukora neza." },
      },
      zones_heading: "Aho Dutanga & Igihe",
      table: { zone: "Akarere", standard: "Gutanga Bisanzwe", fee: "Amafaranga", express: "Uburyo Bwihuse" },
      zones: { kigali_urban: "Umujyi wa Kigali", kigali_suburbs: "Akarere ka Kigali", provincial_cities: "Imijyi yo mu Ntara", rural_areas: "Aho hatari mu mijyi" },
      same_day: "Kuwa Munsi Uwo Munsi",
      next_day: "Kuwa Munsi Ukurikira",
      map_alt: "Ikarita y'aho dutanga imiti mu Rwanda",
      map_title: "Gutanga mu Ntara Zose",
      map_description: "Urwego rwacu rw'itumanaho rutanga imiti mu turere twose 30 twa Rwanda, kugirango buri wese abone imiti.",
    },
     pharmacy_products: {
      heading: "Reba",
      highlight: "Amoko y'Ibicuruzwa",
      description: "Uhereye ku miti isaba prescription kugeza ku bikoresho by'ubuzima, dutanga ibicuruzwa byose ku buzima bwawe.",
      categories: {
        prescription: "Imiti isaba prescription",
        otc: "Imiti idasaba prescription",
        chronic: "Indwara zidakira",
        vitamins: "Vitamini & Ibikoresho by'inyongera",
        personal_care: "Kwita ku buzima bwite",
        devices: "Ibikoresho by'ubuvuzi",
        first_aid: "Agasanduku k'ubutabazi",
        baby_maternal: "Abana & Ababyeyi",
      },
      featured_heading: "Ibicuruzwa byihariye",
      reviews: "isesengura",
      add_to_cart: "Ongeramo",
      view_all: "Reba Ibicuruzwa Byose",
      featured: {
        bp_monitor: { name: "Blood Pressure Monitor", category: "Ibikoresho by'ubuvuzi" },
        multivitamin: { name: "Multivitamin Complex", category: "Vitamini & Ibikoresho by'inyongera" },
        diabetes_strips: { name: "Diabetes Test Strips", category: "Indwara zidakira" },
        first_aid_kit: { name: "First Aid Kit", category: "Agasanduku k'ubutabazi" },
      },
    },
     pharmacy_partners: {
      heading: "Abafatanyabikorwa bacu",
      highlight: "Ba Farumasi Bizewe",
      description: "Twafatanyije na za farumasi zizewe mu Rwanda kugira ngo ubone imiti y'ukuri n'uburyo bw'umwuga.",
      labels: { locations: "Aho bakorera", specialties: "Ubuhanga bwihariye" },
      footer_note: "Za farumasi zose zifatanyije nacu zifite uruhushya rwa Rwanda Pharmacy Council kandi zikurikiza amabwiriza y'ubuziranenge.",
      kigali: {
        name: "Kigali Pharmacy Network",
        description: "Umuyoboro wa farumasi 20+ muri Kigali utanga imiti n'ibikoresho by'ubuvuzi bitandukanye.",
        locations: "Umujyi wa Kigali",
        specialties: "Imiti isaba prescription, gucunga indwara zidakira",
      },
      butare: {
        name: "Butare Medical Supplies",
        description: "Bihariye mu miti ya hospitali n'ibikoresho byihariye hamwe n'ububiko bw'imiti idasanzwe.",
        locations: "Intara y'Amajyepfo",
        specialties: "Imiti yihariye, Ibikoresho bya hospitali",
      },
      musanze: {
        name: "Musanze Health Pharmacy",
        description: "Bafasha Intara y'Amajyaruguru bafite intego yo gufasha abaturage bo mu byaro no gutanga imiti iboneka ku giciro gito.",
        locations: "Intara y'Amajyaruguru",
        specialties: "Ubuvuzi bw’icyaro, Imiti igiciro gito",
      },
      rubavu: {
        name: "Rubavu Medication Center",
        description: "Umuyoboro munini w'amafuramasiyo mu Ntara y'Uburengerazuba ushobora gutumiza imiti mpuzamahanga.",
        locations: "Intara y'Uburengerazuba",
        specialties: "Imiti mpuzamahanga, Imiti yihariye",
      },
    },
    pharmacy_how_it_works: {
      heading: "Uko",
      highlight: "Serivisi za Farumasi",
      description: "Kugura imiti yawe biroroshye cyane. Kurikira izi ntambwe zoroshye kugira ngo ubone imiti yawe.",
      upload_prescription: { title: "Ohereza Prescription cyangwa Hitamo Imiti", description: "Fata ifoto ya prescription yawe cyangwa urebe catalog yacu uhitemo imiti idasaba prescription." },
      review_payment: { title: "Sobanukirwa n'Itegeko ry'Imiti na Kwishyura", description: "Emeza itegeko ry'imiti, aderesi yo gutumiza, hanyuma wishyure ukoresheje uburyo bwizewe." },
      pharmacist_verification: { title: "Kwemezwa n’Umuforomokazi", description: "Umuforomokazi wemewe asuzuma itegeko ryawe kugira ngo ryuzuze umutekano n’ubunyamwuga." },
      delivery: { title: "Gutwarwa ku Aderesi Yawe", description: "Imiti yawe itunganywa neza hanyuma itwarwa ku rugo rwawe n’abagenzi bacu bizewe." },
      order_now: "Tanga Itegeko",
      need_help: "Ukeneye ubufasha ku itegeko ryawe ry’imiti? Itsinda ryacu rihora rihari 24/7.",
      contact_support: "Vugana n'Ubufasha",
    },
    pharmacy_features: {
      heading: "Impamvu wahitamo",
      highlight: "Serivisi za Farumasi",
      description: "ONE HEALTHLINE CONNECT itanga serivisi y’imiti igamije korohereza Abanyarwanda kubona no gukoresha imiti byoroshye.",
      "24_7_ordering": { title: "Gutangira Igihe Cyose", description: "Tanga ibitegeko by’imiti igihe icyo ari cyo cyose ukoresheje urubuga rwacu cyangwa application." },
      fast_delivery: { title: "Gutanga Vuba", description: "Imiti igerwa ku rugo mu masaha 3 mu mijyi no ku munsi umwe mu byaro." },
      verified_medications: { title: "Icyemezo cy’Imiti", description: "Iyi miti yose iva muri farumasi zemewe kandi yemejwe." },
      secure_payments: { title: "Kwishyura Bizingiye ku Mutekano", description: "Uburyo bwinshi bwo kwishyura burimo Mobile Money, Credit Card, n’ubwishingizi." },
      medication_reminders: { title: "Ibibutsa Imiti", description: "Shiraho ibibutsa gufata imiti ku gihe ntuzigere ubyibagirwa." },
      pharmacist_consultation: { title: "Kugisha Inama Umuforomokazi", description: "Vugana n’abaforomokazi bemewe ku bijyanye n’imiti n’ingaruka zishoboka." },
      easy_refills: { title: "Kongera Imiti Byoroshye", description: "Ongera itegeko ry’imiti yawe mu buryo bwihuse n’ibyemererwa byikora." },
      digital_prescriptions: { title: "Prescription Digitali", description: "Ohereza prescription yawe cyangwa uyohereze kuri platform yacu." },
    },
     pharmacy_hero: {
      tagline: "Serivisi za Farumasi",
      title_part1: "Imiti",
      title_part2: "Igezwa",
      title_part3: "Kuri Urugo Rwawe",
      description:
        "Tanga itegeko ry’imiti yanditse n’iyo ku isoko muri farumasi zacu zifatanyije mu Rwanda. Ohereza prescription yawe, ugereranye ibiciro, kandi imiti iguhere mu rugo.",
      search_placeholder: "Shaka imiti...",
      search_button: "Shakisha",
      order_button: "Tanga Itegeko ry’Imiti",
      upload_button: "Ohereza Prescription",
      image_alt: "Farumasi n'ibikorwa byo kugeza imiti",
      free_delivery: "Kohereza Buntu",
      stats: [
        { value: "50+", label: "Farumasi" },
        { value: "3 hrs", label: "Igihe cyo Gutanga" },
        { value: "1000+", label: "Imiti" }
      ]
    },
      emergency_cta: {
      heading: "Ubuvuzi bw'Ibiza mu gihe Ukeneye Benshi",
      subheading: "Serivisi z’ubutabazi za ONE HEALTHLINE CONNECT ziboneka amasaha 24/24 n’iminsi 7/7 mu gihugu hose. Bika numero y’ubutabazi mu gihe ukeneye ubufasha bwihuse.",
      hotline_title: "Umurongo w'Ubuzima bw'Ibiza",
      hotline_number: "912",
      hotline_subtext: "Iboneka amasaha 24 ku munsi, iminsi 7 mu cyumweru, iminsi 365 mu mwaka",
      save_number: "Bika Numero y'Ubutabazi",
      learn_services: "Menya Serivisi Zacu",
      features: [
        { title: "Shyira App Ku Muryango", description: "Hamagarira ubutabazi rimwe gusa kandi usangire aho uri" },
        { title: "Amahugurwa y'Ubutabazi", description: "Menya ubutabazi bw’ibanze na CPR binyuze mu mahugurwa y’aho utuye" },
        { title: "Kwitegura Ibiza", description: "Tegura umugambi w’ubutabazi ku muryango wawe ukoresheje ibikoresho byacu by’ubuntu" },
      ],
      reminder: "Ibuka: Mu gihe cy'ubutabazi, hamagara 912 ako kanya. Sekonde yose irakenewe."
    },
    emergency_faq: {
      heading: "Ibibazo Bikunze Kubazwa",
      subheading: "Shakisha ibisubizo ku bibazo bisanzwe bijyanye na serivisi zacu z’ubuvuzi bw’ibyihutirwa.",
      faqs: [
        {
          question: "Nihamagara hehe mu gihe cy’akazi k’ubutabazi?",
          answer: "Mu gihe cy'ubuvuzi bw’ibyihutirwa, hamagara numero yacu yihariye ya 912. Iyi numero iboneka amasaha 24/24 n’iminsi 7/7 kandi izahuza nawe n’ikigo cyacu cy’ubutabazi. Niba utabashije guhamagara iyi numero, ushobora no guhamagara umurongo wacu w’ubutabazi: 0788-HEALTH (0788-432584)."
        },
        {
          question: "Ambulance izagera mu gihe kingana iki?",
          answer: "Igihe cyacu cyo gusubiza ni iminota 5-15 mu mijyi n’iminota 15-30 mu cyaro. Igihe nyacyo gishobora guhinduka bitewe n’urusobe rw’imodoka, ikirere, n’aho uherereye. Sisitemu yacu yohereza unit hafi yaho kugira ngo itegereze gito."
        },
        // ... add remaining FAQs similarly
      ],
      contact_heading: "Ufite ibindi bibazo ku bijyanye na serivisi zacu z’ubutabazi?",
      contact_text: "Hamagarira itsinda ryacu ry’abakiriya kuri info@healthlinerwanda.com cyangwa +250 788 123 456"
    },
     emergency_testimonials: {
      heading: "Ubuzima Bwokowe Binyuze mu Buvuzi bw’Ibyihutirwa",
      subheading:
        "Soma ku buryo abarwayi bakiriye ubuvuzi bw’ibyihutirwa muri ONE HEALTHLINE CONNECT babonye ubufasha.",
      testimonials: [
        {
          name: "Jean-Paul Mugisha",
          location: "Kigali, Rwanda",
          testimonial:
            "Nari mfite ububabare bukabije mu gituza ndimo ndi mu rugo ubwo umugore wanjye yahamagaye ONE HEALTHLINE CONNECT. Ambulance yaje mu minota 10, abaparemekeri batangira guha ubufasha ako kanya. Barokoye ubuzima bwanjye - nari mfite umutima uhagaze nabi. Umuvuduko n’umwuga w’ikipe byari byiza cyane."
        },
        {
          name: "Marie Uwimana",
          location: "Huye, Rwanda",
          testimonial:
            "Umwana wanjye yagize allergie ikomeye ubwo twari mu birori by’umuryango mu cyaro. Sinari nzi ko ubufasha buzagera ku gihe, ariko itsinda ryihutirwa rya ONE HEALTHLINE CONNECT ryaje vuba kandi ritanze ubufasha bwokora ubuzima. Ubuhanga bwabo mu gihe kibi nk’icyo bwari bwiza cyane."
        },
        {
          name: "Emmanuel Hakizimana",
          location: "Musanze, Rwanda",
          testimonial:
            "Nari mu mpanuka ikomeye ku muhanda. Itsinda ryihutirwa rya ONE HEALTHLINE CONNECT ryaje vuba, ryarokoye ahabaye impanuka, kandi ryateguye byose ku bitaro mbere y’uko mbera aho. Umuvuduko wabo wihuse warokoye ubuzima bwanjye. Ndashimira ubuhanga bwabo."
        }
      ],
      stats_heading: "Imibare y’Ubuvuzi bw’Ibyihutirwa",
      stats: [
        "Igihe cyo gusubiza: <strong>iminota 12</strong>",
        "Ibibazo byitabwaho umwaka ushize: <strong>4,500+</strong>",
        "Ubuzima bwokowe: <strong>98% y’abarokowe</strong> mu byihutirwa bikomeye",
        "Ibyishimo by’abarwayi: <strong>4.9/5</strong> ku gipimo cy’inyungu rusange"
      ],
      commitment_heading: "Icyo Twiyemeje",
      commitment_p1:
        "Muri ONE HEALTHLINE CONNECT, twiyemeje gutanga ubuvuzi bwihuse kandi bw’umwuga mu bihe by’ibyihutirwa. Amakipe yacu akora imyitozo ikomeye kandi akoresha ibikoresho by’ubuvuzi bya vuba kugirango abarwayi babone ibyiza.",
      commitment_p2:
        "Turakomeza gukora kugira ngo tugabanye igihe cyo gusubiza no gutambutsa serivisi mu bice byose by’u Rwanda, aho abarwayi bari hose."
    },
     "emergency_locations": {
    "title": "Aho Dutanga Serivisi z'Ubuvuzi bw'Igihe Cyose",
    "description": "ONE HEALTHLINE CONNECT itanga serivisi z'ubuvuzi bw'ihutirwa mu gihugu hose, ifite ahantu hateguwe neza kugirango igihe cyo gusubiza kibashe kuba gito.",
    "map_placeholder": {
      "title": "Ikarita Yuzuye Igihe Kizaza",
      "subtitle": "Reba uburyo bwo gusubiza ibibazo by'ubuzima mu Rwanda"
    },
    "coverage_label": "Agace Dukorera:",
    "response_time_label": "Igihe cyo Gusubiza:",
    "units_label": "Ibinyabiziga by'Iserivisi y'Ubuvuzi bw'Igihe Cyose:",
    "footer_note_1": "Serivisi zacu z'ubuvuzi bw'ihutirwa zikora mu turere twose 30 tw'u Rwanda, dufite ahantu hateguwe neza kugirango igihe cyo gusubiza kibe gito.",
    "footer_note_2": "Mu bice by'icyaro, dukoresha indege yo gutabara igihe bibaye ngombwa kugirango ubuvuzi bugere ku gihe.",
    "kigali": {
      "name": "Kigali Central",
      "address": "KN 5 Ave, Kigali, Rwanda",
      "coverage": "Nyarugenge, Kicukiro, Gasabo",
      "responseTime": "iminota 5-10",
      "units": "Ambulansi 8, Ibinyabiziga byihutirwa 4"
    },
    "butare": {
      "name": "Butare Station",
      "address": "Akarere ka Huye, Intara y'Amajyepfo",
      "coverage": "Huye, Gisagara, Nyanza",
      "responseTime": "iminota 10-15",
      "units": "Ambulansi 5, Ibinyabiziga byihutirwa 2"
    },
    "musanze": {
      "name": "Musanze Center",
      "address": "Akarere ka Musanze, Intara y'Amajyaruguru",
      "coverage": "Musanze, Burera, Gakenke",
      "responseTime": "iminota 10-20",
      "units": "Ambulansi 4, Ibinyabiziga byihutirwa 2"
    },
    "rubavu": {
      "name": "Rubavu Station",
      "address": "Akarere ka Rubavu, Intara y'Uburengerazuba",
      "coverage": "Rubavu, Nyabihu, Rutsiro",
      "responseTime": "iminota 10-20",
      "units": "Ambulansi 4, Ibinyabiziga byihutirwa 2"
    },
    "rwamagana": {
      "name": "Rwamagana Center",
      "address": "Akarere ka Rwamagana, Intara y'Iburasirazuba",
      "coverage": "Rwamagana, Kayonza, Ngoma",
      "responseTime": "iminota 15-25",
      "units": "Ambulansi 3, Ibinyabiziga byihutirwa 2"
    },
    "nyagatare": {
      "name": "Nyagatare Station",
      "address": "Akarere ka Nyagatare, Intara y'Iburasirazuba",
      "coverage": "Nyagatare, Gatsibo",
      "responseTime": "iminota 15-30",
      "units": "Ambulansi 3, Ikinyabiziga cyihutirwa 1"
    }
  },
    "emergency_types": {
    "heading": "Ibibazo by'Ubuzima Bikomeye Dukemura",
    "subheading": "Amatsinda yacu yihutirwa yateguwe kandi afite ibikoresho byo gusubiza vuba mu bihe by'uburwayi bwihutirwa hirya no hino mu Rwanda.",
    "cardiac": {
      "title": "Ibibazo by'umutima",
      "desc": "Indwara z’umutima, uburibwe mu gituza, guhagarara kw’umutima, n’ibindi bibazo by’umutima bisaba kwitabwaho ako kanya."
    },
    "neurological": {
      "title": "Ibibazo by’ubwonko",
      "desc": "Stroke, kugorwa n'inkorora, uburibwe bukabije bw’umutwe, n’izindi ndwara z’ubwonko zisaba kwitabwaho byihuse."
    },
    "trauma": {
      "title": "Ibikomere n’Ibikomere bikomeye",
      "desc": "Ibikomere bikomeye biterwa n’impanuka, kugwa, cyangwa urugomo bisaba kwitabwaho n’abaganga ako kanya."
    },
    "respiratory": {
      "title": "Ibibazo byo guhumeka",
      "desc": "Ibibazo bikomeye byo guhumeka, asthma ikaze, guhumeka bigoranye, cyangwa kuribwa mu muhogo bisaba kwitabwaho byihuse."
    },
    "bleeding": {
      "title": "Gukomereka bikabije",
      "desc": "Kuvurwa k’umuvuduko w’amaraso bidashobora guhagarara biturutse ku bikomere, ibisebe, cyangwa indwara bisaba kwitabwaho byihuse."
    },
    "poisoning": {
      "title": "Kwiyahura n’Ibiyobyabwenge",
      "desc": "Kwiyahura cyangwa gukoresha ibiyobyabwenge birengeje urugero, cyangwa ibindi byateza ikibazo cyihutirwa bisaba kwitabwaho ako kanya."
    },
    "burns": {
      "title": "Gukomeretsa",
      "desc": "Gukomeretsa bikomeye bitewe n’umuriro, imiti, amashanyarazi, cyangwa amazi ashyushye bisaba ubuvuzi bwihariye."
    },
    "other": {
      "title": "Ibindi bibazo byihutirwa",
      "desc": "Allergies, indwara z’isukari, ibibazo by’ubuzima bw’umugore utwite, n’ibindi bibazo byihutirwa."
    },
    "cta_title": "Igihe cyo guhamagara serivisi yihutirwa",
    "cta_desc": "Hamagara nimero yacu yihutirwa (912) ako kanya niba wowe cyangwa umuntu uri hafi yawe agize:",
    "urgent_signs": [
      "Uburibwe cyangwa umuvuduko mu gituza",
      "Guhumeka bigoranye",
      "Intege nke cyangwa kubura ubushobozi mu gice cy’umubiri",
      "Gukomereka bikomeye",
      "Gukomereka bikabije",
      "Kwiyahura cyangwa gukoresha ibiyobyabwenge birengeje urugero",
      "Ibikomere bikomeye",
      "Kurwara kidasanzwe",
      "Kutagira ubwenge cyangwa gucika intege"
    ]
  },
     emergency_how_it_works: {
      heading: "Uko Serivisi y'Ubutabazi Ikora",
      subheading:
        "Buri segonda ifite agaciro, kandi uburyo bwacu bwihuse bw’ubutabazi butuma ubona ubufasha vuba bishoboka.",
      call_emergency: {
        title: "Hamagarira Ubutabazi",
        description:
          "Hamagarira nimero y'ubutabazi (912) kugirango ugerweho na dispatch center yacu ikora amasaha 24/7. Abakozi batojwe bazabaza ibibazo by'ingenzi.",
      },
      rapid_dispatch: {
        title: "Ubutabazi Bwihuse",
        description:
          "Dushingiye ku mwanya wawe n'ubwoko bw'ubutabazi, twohereza ikigo cyegereye gikwiye vuba bishoboka.",
      },
      on_site_treatment: {
        title: "Ubufasha ku Kavuriro",
        description:
          "Itsinda ryacu ry’ubutabazi rigera aho uri rikagufasha ako kanya kugira ngo umurwayi agumane ubuzima.",
      },
      hospital_transport: {
        title: "Gutwara Kujya ku Bitaro",
        description:
          "Niba bikenewe, twohereza umurwayi ku bitaro bikwiye, tugahuza n’itsinda ry’itaro kugira ngo ubufasha butazuyaza.",
      },
      cta_text:
        "Mu bihe by'ubuzima butekanye, buri munota ni ingenzi. Ntutinye guhamagara nimero y'ubutabazi:",
    },
    emergency_features: {
      heading: "Ibikorwa byacu by’Ubufasha bw’Ibihutirwa",
      subheading:
        "ONE HEALTHLINE CONNECT itanga serivisi z’ubuvuzi bwihuse kandi zinoze kugirango igufashe igihe cyose bikenewe.",
      rapid_response: {
        title: "Ubufasha Bwihuse",
        description:
          "Amatsinda yacu y’ubutabazi agerageza kugera aho uri mu minota 5-15 mu mijyi no mu minota 15-30 mu byaro.",
      },
      nationwide_coverage: {
        title: "Serivisi ku Gihugu Hose",
        description:
          "Dufite ibice by’ubutabazi bihari mu gihugu hose kugirango tugufashe vuba igihe cyose.",
      },
      advanced_life_support: {
        title: "Ubufasha buhanitse mu buzima",
        description:
          "Ambulansi zacu zifite ibikoresho by’ubuvuzi buhanitse kandi zifite abakozi batojwe neza.",
      },
      medical_professionals: {
        title: "Abakozi b’Ubuvuzi",
        description:
          "Amatsinda yacu y’ubutabazi arimo abaganga, abaforomo, n’abakozi batojwe mu buvuzi bw’ibyihutirwa.",
      },
      ambulance_fleet: {
        title: "Ambulansi zigezweho",
        description:
          "Ambulansi zacu zigezweho zifite ikoranabuhanga rigezweho ry’ubuvuzi ku ivuriro aho uri.",
      },
      dispatch_center: {
        title: "Ikigo gishinzwe ubutabazi 24/7",
        description:
          "Ikigo cyacu gishinzwe ubutabazi kirimo abakozi amasaha 24 kugirango gishyire mu bikorwa ubutabazi bwihuse.",
      },
      hospital_network: {
        title: "Urutonde rw’Amavuriro",
        description:
          "Guhuza n’amavuriro bituma guhererekanya umurwayi biba byoroshye kandi bitanga ubufasha ako kanya.",
      },
      insurance_coordination: {
        title: "Guhuza n’Ubwishingizi",
        description:
          "Dukorana n’ibigo by’ubwishingizi by’ingenzi byose kugirango ubuvuzi bwawe bwihutirwa bube bwishyuwe.",
      },
    },
      emergency_hero: {
      label: "SERIVISI Z’IBYIHUTI 24/7",
      title: "Ubufasha bw’Ubuvuzi Ako kanya Mu Sekondi Zose Zifatika",
      description:
        "Itsinda ryacu ry’ubuvuzi bwihuse rihari 24/7 mu Rwanda ryatanga ubufasha bwihuse n’ubuzima bwo kurokora mu bihe by’ibyago.",
      call_button: "Hamagarira Ubufasha",
      learn_more: "Menya byinshi",
      stats: {
        response_time: { value: "5-15", label: "Igihe cyo Guhabwa Ubufasha" },
        availability: { value: "24/7", label: "Serivisi Ihari" },
        vehicles: { value: "30+", label: "Imodoka z’Ubufasha" },
        responders: { value: "100%", label: "Abatanga Ubufasha Batojwe" },
      },
    },
    appointments_faq: {
      title: "Ibibazo",
      title_highlight: "Bikunze Kubazwa",
      subtitle: "Shaka ibisubizo ku bibazo bikunze kubazwa ku buryo bwo gufata gahunda yo kubonana n’abaganga.",
      q1: {
        question: "Ntegereza gute gufata gahunda?",
        answer:
          "Urashobora gufata gahunda ukoresheje urubuga rwacu cyangwa application. Iyandikishe, shaka umuganga cyangwa ubuhanga, hitamo itariki n’igihe, hanyuma wemeze gahunda. Uzahabwa confirmation ako kanya kuri email na SMS.",
      },
      q2: {
        question: "Nshobora gufata gahunda ku wundi muntu?",
        answer:
          "Yego, ushobora gufata gahunda ku muryango cyangwa abandi bantu. Muri gahunda yo gufata rendez-vous, uzashobora kuvuga uwo gahunda iri kumwe na we. Ugomba gutanga amakuru ye y’ibanze.",
      },
      q3: {
        question: "Nshobora gufata gahunda hakiri kare cyane?",
        answer:
          "Abenshi mu baganga batanga gahunda kugeza amezi 3 mbere. Bamwe bafite byinshi basaba, bashobora gutanga gahunda mu gihe gito. Gahunda z’ubutabazi zishobora gufatwa ku munsi cyangwa ku munsi ukurikiyeho bitewe n’ubushobozi.",
      },
      q4: {
        question: "Ni iki niba nshaka guhindura cyangwa gusubika gahunda?",
        answer:
          "Urashobora gusubika cyangwa guhindura gahunda ukoresheje konti yawe kugeza amasaha 24 mbere y’igihe nta gihano. Ku gusubika munsi y’amasaha 24, amafaranga make ashobora gukenerwa bitewe n’amabwiriza y’umuganga.",
      },
      q5: {
        question: "Nkeneye kwishyura igihe mfata gahunda?",
        answer:
          "Bamwe mu baganga basaba deposit cyangwa kwishyura byose igihe ufata gahunda, abandi bakemera kwishyura igihe cyo kubonana. Ibisabwa byose bizagaragara igihe cyo gufata gahunda.",
      },
      q6: {
        question: "Ni izihe insurance mwakira?",
        answer:
          "Dukorana n’ibigo byinshi by’ubwishingizi mu Rwanda. Muri gahunda yo gufata rendez-vous, ushobora kwinjiza amakuru ya insurance yawe kugirango urebe abaganga bemera ubwishingizi bwawe.",
      },
      q7: {
        question: "Nzahabwa impuruza igihe kingana iki mbere y’igihe?",
        answer:
          "Twohereza impuruza amasaha 48 na 2 mbere y’igihe cya rendez-vous binyuze kuri SMS na email. Ushobora guhindura ibyo wifuza mu myanya ya konti yawe.",
      },
      q8: {
        question: "Ni ibihe nzizana igihe nza ku muganga?",
        answer:
          "Zizana indangamuntu, ikarita ya insurance (niba bihari), inyandiko z’ubuvuzi zikenewe, urutonde rw’imiti ukoresha, n’ibindi byangombwa byoherejwe. Ku bashya, gerayo iminota 15 mbere kugirango wuzuze registration.",
      },
      need_more_help: "Urikomeza kugira ibibazo ku buryo bwo gufata gahunda?",
      contact_us_text: "Hamagara itsinda ryacu ry’ubufasha kuri",
    },
    appointments_locations: {
      title: "Ahacu",
      title_highlight: "Hagezweho",
      subtitle: "Fata gahunda yo kubonana n’abaganga mu bigo byacu byose hirya no hino mu Rwanda.",
      featured: "Byihariye",
      book_button: "Fata gahunda hano",
      find_nearby: {
        title: "Shaka Ikigo Kiri Hafi Yawe",
        subtitle: "Dufite ibigo bifatanyije hirya no hino mu Rwanda kugirango tugufashe neza."
      },
      view_all: "Reba Ibigo Byose",
      kigali: {
        name: "HEALTHLINE Kigali Center",
        address: "KN 5 Rd, Kigali, Rwanda",
        hours: "Mbere-kuwa Gatandatu: 8am-8pm, Ku Cyumweru: 9am-5pm"
      },
      butare: {
        name: "HEALTHLINE Butare Clinic",
        address: "Akarere ka Huye, Intara y’Amajyepfo, Rwanda",
        hours: "Mbere-kuwa Gatanu: 8am-6pm, Ku wa Gatandatu: 9am-3pm"
      },
      musanze: {
        name: "HEALTHLINE Musanze Hospital",
        address: "Akarere ka Musanze, Intara y’Amajyaruguru, Rwanda",
        hours: "Serivisi 24/7 z’ibyihutirwa"
      },
      rubavu: {
        name: "HEALTHLINE Rubavu Center",
        address: "Akarere ka Rubavu, Intara y’Iburengerazuba, Rwanda",
        hours: "Mbere-kuwa Gatandatu: 8am-7pm, Ku Cyumweru: 10am-4pm"
      }
    },
    "appointments_testimonials": {
    "title": "Ibyo Abantu Bacu",
    "highlight": "Bavuga",
    "subtitle": "Wumve ibyo abantu bakoze gahunda zo kwakira abaganga kuri murandasi bavuga.",
    "average_rating": "Impuzandengo y'amanota",
    "stars": "Inyenyeri",
    "jean": {
      "text": "Gahunda yo gufata igihe cyo gusura umuganga yari yoroshye cyane. Nashoboye kubona umuganga, gufata igihe cyanyuze, kandi mbona ibyemezo mu minota micye. Inyibutsa zaba zifasha cyane!"
    },
    "emmanuel": {
      "text": "Nk'umuntu uba mu cyaro, gushobora gufata gahunda yo gusura umuganga kuri murandasi byarahinduye ubuzima. Simbisabwa gutembera ngo nshakishe igihe cyo gusura. Sisitemu iroroshye kandi yizewe cyane."
    },
    "marie": {
      "text": "Nshimira uburyo byoroshye guhindura igihe iyo bikenewe. Ubuzima burakomeza, kandi ONE HEALTHLINE CONNECT irabyumva. Sisitemu yo gufata gahunda iroroshye kandi ikoreshwa neza."
    }
  },
    appointments_types: {
      title: "Amoko ya",
      title_highlight: "Gahunda",
      subtitle: "Dutanga amoko menshi ya gahunda yo kwivuza kugirango duhangane n'ibikenewe byose by'ubuzima bwawe.",
      popular: "Izikunzwe",
      book_now: "Fata Gahunda",
      more_specialties: "Nta cyo wabonye mu moko ya gahunda ukeneye? Dutanga serivisi nyinshi z’umwihariko.",
      view_all: "Reba Serivisi Zose",
      general_consultation: {
        title: "Inama Rusange",
        description: "Isuzuma risanzwe n’ibibazo by’ubuzima rusange hamwe n’abaganga b’ibanze."
      },
      specialist_consultation: {
        title: "Inama y’Inzobere",
        description: "Kwita ku buzima by’umwihariko n’inzobere mu by’ubuvuzi bitandukanye."
      },
      cardiology: {
        title: "Umutima",
        description: "Isuzuma n’ubuvuzi bw’umutima hamwe n’inzobere mu mutima."
      },
      ophthalmology: {
        title: "Amat eyes",
        description: "Isuzuma n’ubuvuzi bw’amaso hamwe n’inzobere mu maso."
      },
      orthopedics: {
        title: "Imikaya n’Imikandara",
        description: "Kwita ku misokoro n’amagufa hamwe n’inzobere mu mikaya."
      },
      pediatrics: {
        title: "Abana",
        description: "Kwita ku buzima bw’abana bato, abakiri bato n’abangavu."
      },
      pharmacy: {
        title: "Inama ya Farumasi",
        description: "Isuzuma ry’imiti n’inama itangwa n’abaforomokazi."
      },
      laboratory: {
        title: "Ibizamini bya Laboratwari",
        description: "Gahunda y’ibizamini bya laboratwari n’isesengura."
      }
    },
    appointments_how: {
      title: "Uko Wafata",
      title_highlight: "Rendez-vous",
      subtitle: "Uburyo bwacu bworoshye mu byiciro 4 butuma gufata gahunda yo kubonana n’abaganga biba byihuse kandi bitagoranye.",
      steps: {
        create_account: {
          title: "Fungura Konti",
          description: "Iyandikishe ukoresheje amakuru yawe y’ibanze. Bifata umunota gusa."
        },
        find_specialist: {
          title: "Shaka Inzobere",
          description: "Shakisha inzobere ukoresheje izina, ubuhanga, aho ari cyangwa igihe aboneka."
        },
        select_date_time: {
          title: "Hitamo Itariki n’Igihe",
          description: "Hitamo mu masaha aboneka kandi akubereye."
        },
        confirm_pay: {
          title: "Emeza & Wishure",
          description: "Soma amakuru yose yerekeye gahunda yawe, wongereho ibisobanuro niba bikenewe, hanyuma urangize kwishyura niba bikenewe."
        }
      },
      book_now: "Fata Rendez-vous",
      need_help: "Ukeneye ubufasha mu gufata gahunda yawe? Itsinda ryacu ry’ubufasha rirahari ngo rigufashe.",
      contact_support: "Hamagara Ubufasha"
    },
    appointments_features: {
      heading: "Impamvu Guhitamo",
      heading_highlight: "Serivisi yo Gufata Rendez-vous",
      subheading:
        "Uburyo bwacu bwo gufata gahunda bugamije korohereza Abanyarwanda kubona serivisi z’ubuvuzi mu buryo bworoshye kandi bwihuse.",
      feature_24_7: {
        title: "Gufata Gahunda 24/7",
        description: "Fata gahunda igihe icyo ari cyo cyose, ku manywa cyangwa nijoro, ndetse no mu minsi mikuru."
      },
      feature_instant: {
        title: "Kwemezwa Ako kanya",
        description: "Bona kwemezwa kwa gahunda yawe ako kanya hamwe n’amakuru yose."
      },
      feature_specialist: {
        title: "Guhitamo Inzobere",
        description: "Hitamo mu nzobere z’ubuvuzi zirenga 200 mu byiciro bitandukanye."
      },
      feature_locations: {
        title: "Ahantu Hatandukanye",
        description: "Fata gahunda mu bitaro cyangwa amavuriro by’abafatanyabikorwa hirya no hino mu Rwanda."
      },
      feature_payment: {
        title: "Kwishyura Neza",
        description: "Ishyura gahunda yawe ukoresheje uburyo bwizewe kandi bwihuse."
      },
      feature_sms: {
        title: "Ubutumwa bwa SMS",
        description: "Bona ubutumwa buburira mbere y’igihe cyagenewe gahunda yawe."
      },
      feature_virtual: {
        title: "Amahitamo ya Videwo",
        description: "Hitamo hagati yo kubonana mu buryo bwa videwo cyangwa imbonankubone."
      },
      feature_reschedule: {
        title: "Guhindura Gahunda Byoroshye",
        description: "Hindura cyangwa usibe gahunda yawe mu buryo bworoshye iyo bikenewe."
      },
      cta_title: "Witeguye kubona itandukaniro?",
      cta_subtitle: "Injira mu bihumbi by’abanyuzwe bamaze koroherezwa urugendo rwabo rw’ubuvuzi.",
      cta_stat_appointments: "Gahunda Zafashwe",
      cta_stat_satisfaction: "Igipimo cyo Kunyurwa"
    },
     appointments_hero: {
      badge: "Gufata Rendez-vous",
      title: "Teganya Kwitabwaho",
      title_highlight: "Ku Buryo Bwawe",
      subtitle:
        "Fata gahunda yo kubonana n'abatanga serivisi z’ubuvuzi igihe ubishakiye. Shakisha kandi uteganye n’inzobere ziboneye, uhitamo hagati yo kubonana mu buryo bwa videwo cyangwa imbonankubone.",
      search_placeholder: "Shakisha abaganga, inzobere, cyangwa ibitaro...",
      search_button: "Shakisha",
      book_button: "Fata Rendez-vous",
      view_specialties: "Reba Inzobere",
      image_alt: "Gufata gahunda yo kubonana n’umuganga",
      stats: {
        specialists: "Inzobere",
        hospitals: "Ibitaro",
        booking_time: "Igihe cyo Gufata Gahunda",
      },
      easy_rescheduling: "Guhindura Gahunda Byoroshye"
    },
    teleconsultation_cta: {
      title: "Witeguye Guhabwa Serivisi z’Ubuvuzi Utavuye Mu Rugo?",
      subtitle:
        "Injira mu bihumbi by’Abanyarwanda bari kubona serivisi z’ubuvuzi zinoze binyuze muri telekonsitomasiyo. Inama ya mbere n’umuganga iri hafi gato n’udukanda duke gusa.",
      start_button: "Tangira Kugisha Inama",
      learn_more: "Menya Ibindi"
    },
    faq4: {
      title: "Ibibazo Bikunze Kubazwa",
      subtitle: "Reba ibisubizo by'ibibazo bikunze kubazwa ku bijyanye na serivisi zacu za telekonsitomasiyo. Niba ikibazo cyawe kitagaragara hano, nyamuneka hamagara itsinda ryacu ry'ubufasha.",
      q1: "Ni ibikoresho ki nkeneye kugira ngo nkore telekonsitomasiyo?",
      a1: "Ukeneye igikoresho gifite kamera na mikorofoni (telefone igendanwa, tablette, cyangwa mudasobwa), interineti yihuta kandi ikora neza, ndetse na porogaramu ya ONE HEALTHLINE CONNECT ishyizweho. Kugira ngo ugire ubunararibonye bwiza, turasaba gukoresha ecouteurs no gushaka ahantu hatuje kandi hasobanutse umucyo.",
      q2: "Telekonsitomasiyo isanzwe imara igihe kingana iki?",
      a2: "Telekonsitomasiyo isanzwe imara hagati y’iminota 15-30, bitewe n’uburemere bw’ikibazo cyawe cy’ubuzima. Kugisha inama ku baganga b’inzobere bishobora gufata igihe kinini. Ushobora kubona igihe bitezwe izamara igihe uri kwiyandikisha.",
      q3: "Ese abaganga bashobora gutanga imiti binyuze muri telekonsitomasiyo?",
      a3: "Yego, abaganga bashobora gutanga imiti mu gihe bikenewe mu gihe cya telekonsitomasiyo. Itegeko rizaba ari irya mudasobwa kandi rishobora koherezwa muri farumasi dukorana na zo kugira ngo iguhe cyangwa uyitware. Ariko, imiti yihariye ishobora gusaba kujya ku ivuriro mu buryo bw'umubiri.",
      q4: "Bite se niba nkeneye ibizamini by’amaraso cyangwa amashusho?",
      a4: "Niba umuganga asanze ukeneye ibizamini by’amaraso cyangwa amashusho, ashobora kuguha itegeko rya mudasobwa. Ushobora kujya ku bigo dukorana kugira ngo ukore ibyo bizamini. Ibisubizo bizashyirwa kuri konti yawe ya ONE HEALTHLINE CONNECT kandi bisangizwe n’umuganga wawe kugira ngo akomeze kugukurikirana.",
      q5: "Ese telekonsitomasiyo yishyurwa n’ubwishingizi?",
      a5: "Abatanga ubwishingizi benshi mu Rwanda ubu bishyura serivisi za telekonsitomasiyo. Dukorana n’ibigo by’ubwishingizi bikomeye birimo RSSB, MMI, SORAS, n’ibindi. Ushobora kwemeza niba bishyurwa winjiza amakuru yawe y’ubwishingizi kuri porofayili yawe cyangwa uhamagaye umushinzwe ubwishingizi bwawe.",
      q6: "Bite se niba nkeneye kubona umuganga mu buryo bw'umubiri nyuma ya telekonsitomasiyo?",
      a6: "Niba umuganga asanze hakenewe kugenzurwa mu buryo bw'umubiri, ashobora kugusaba kujya ku kigo cy’ubuvuzi kiboneye cyangwa umuganga w’inzobere. Amakuru yose yavuye muri telekonsitomasiyo azasangizwa uwo muganga kugira ngo ubuvuzi bukomeze neza."
    },
    testimonials2: {
      section_title: "Icyo Abaturage Bavuga",
      section_subtitle: "Umva ubuhamya bw'abakoresheje serivisi zacu za telekonsitomasiyo.",
      read_more: "Soma ubundi buhamya bw'abaturage",
      jean: {
        testimonial: "Serivisi ya telekonsitomasiyo yantabaye cyane mu gihe gito. Nabashije kuvugana n’umuganga mu minota 15 gusa ku burwayi bw’umwana wanjye kandi mpabwa umuti wangejejwe mu rugo. Serivisi nziza cyane!",
        service: "Kugisha Inama ku Buvuzi bw’Abana"
      },
      emmanuel: {
        testimonial: "Kuba ntuye mu cyaro bituma bigorana kubona abaganga b’inzobere. Binjiye muri ONE HEALTHLINE CONNECT, nabashije kuganira n’umuganga w’umutima ntarinze kujya i Kigali. Ubwiza bwa videwo bwari buhebuje kandi umuganga yari asobanura cyane.",
        service: "Kugisha Inama ku Buvuzi bw’Umuvuduko w’Amaraso"
      },
      marie: {
        testimonial: "Maze igihe nkoresha gahunda y’ukwezi yo gukurikirana indwara yanjye y’igihe kirekire. Kubasha kuganira n’umuganga wanjye kenshi ntagiye ku bitaro byorohereje cyane uburyo bwo kwita ku buzima bwanjye. Ndabigira inama!",
        service: "Kugisha Inama ku Buvuzi bw’Indwara z’Igihe Kirekire"
      }
    },
    "pricing1": {
    "title": "Ibyiciro by'ibiciro byumvikana neza",
    "subtitle": "Hitamo gahunda yo kuganira n'umuganga iboneye ubuzima bwawe n'ingengo y'imari yawe.",
    "plans": {
      "single": {
        "name": "Gahunda imwe yo kuganira",
        "price": "5,000 RWF",
        "description": "Kuganira rimwe n'umuganga rusange",
        "features": [
          "Iminota 30 yo kuganira kuri video",
          "Ibaruwa y'ubuvuzi mu buryo bw'ikoranabuhanga niba bikenewe",
          "Ubutumwa bwo gukurikirana amasaha 24",
          "Ibyanditswe by'ubuvuzi"
        ]
      },
      "monthly": {
        "name": "Gahunda y'ukwezi",
        "price": "15,000 RWF",
        "period": "buri kwezi",
        "description": "Kuganira kudashira n'abaganga rusange",
        "features": [
          "Kuganira kudafite umubare hamwe na GPs",
          "Kuganira n'abaganga babiri b'inzobere buri kwezi",
          "Ibaruwa z'ubuvuzi mu buryo bw'ikoranabuhanga",
          "Gahunda yihariye y'ibikorwa",
          "Uburenganzira bwo kugera ku butumwa bw'ubuvuzi 24/7",
          "Ibyanditswe byuzuye by'ubuvuzi"
        ]
      },
      "family": {
        "name": "Gahunda y'umuryango",
        "price": "25,000 RWF",
        "period": "buri kwezi",
        "description": "Ubwishingizi bw'abagize umuryango 4",
        "features": [
          "Kuganira kudafite umubare hamwe na GPs",
          "Kuganira n'abaganga bane b'inzobere buri kwezi",
          "Ibaruwa z'ubuvuzi mu buryo bw'ikoranabuhanga",
          "Gahunda yihariye y'ibikorwa",
          "Uburenganzira bwo kugera ku butumwa bw'ubuvuzi 24/7",
          "Dashboard y'ubuzima bw'umuryango",
          "Gucunga ibyanditswe by'ubuvuzi bihuriweho"
        ]
      }
    },
    "mostPopular": "Ikwirakwiriye cyane",
    "choosePlan": "Hitamo Gahunda",
    "footerNote": "Ibyiciro byose birimo kugera ku rubuga rwacu rwa mobile na web. Kuganira n'abaganga b'inzobere bishobora gusaba andi mafaranga bitewe n'ubwoko bw'inzobere. Ibiciro biri mu mafaranga y'u Rwanda (RWF)."
  },
    "teleconsultationSpecialties": {
    "title": "Ibyiciro by'Ubuvuzi bihari",
    "description": "Urubuga rwacu rukugeza ku baganga b'inzobere mu byiciro bitandukanye by'ubuvuzi kugira ngo uhabwe ubufasha bukwiye.",
    "specialties": {
      "generalMedicine": {
        "name": "Ubuvuzi Rusange",
        "description": "Inama ku ndwara zisanzwe, kwirinda indwara, no gusuzuma ubuzima.",
        "availability": "Igihe cyose 24/7"
      },
      "pediatrics": {
        "name": "Ubuvuzi bw'Abana",
        "description": "Kwita ku buzima bw'abana kuva bavuka kugeza bakuze.",
        "availability": "8AM - 8PM"
      },
      "dermatology": {
        "name": "Ubuvuzi bw'Uruhu",
        "description": "Indwara z'uruhu, ibisate, ibibazo bya acne, n'ibindi bibazo by'uruhu.",
        "availability": "Biteganyijwe"
      },
      "psychiatry": {
        "name": "Ubuvuzi bw'Ubuzima bwo Mu Mutwe",
        "description": "Ubufasha ku buzima bwo mu mutwe, harimo ubwoba, kwiheba, no guhangana n'umunaniro.",
        "availability": "9AM - 5PM"
      },
      "cardiology": {
        "name": "Ubuvuzi bw'umutima",
        "description": "Inama ku buzima bw'umutima, harimo no kugenzura umuvuduko w'amaraso.",
        "availability": "Biteganyijwe"
      },
      "nutrition": {
        "name": "Imirire",
        "description": "Inama ku mirire, kugabanya ibiro, no gutegura indyo iboneye.",
        "availability": "9AM - 6PM"
      }
    },
    "button": {
      "findSpecialists": "Shaka inzobere",
      "viewAll": "Reba ibyiciro byose"
    }
  },
    "teleconsultationHowItWorks": {
    "heading": "Uko Teleconsultation Ikora",
    "description": "Uburyo bworoshye bwo guhuza n’abaganga mu byiciro bike gusa.",
    "steps": [
      {
        "title": "Fungura Konti",
        "description": "Iyandikishe kandi wuzuze umwirondoro wawe w’ubuzima n’amakuru ajyanye n’imiti ukoresha."
      },
      {
        "title": "Hitamo Umuganga",
        "description": "Shakisha abaganga bakurikije ibyo bakora, amanota bahawe n’igihe bahari."
      },
      {
        "title": "Tegura Igihe cyo Kugisha Inama",
        "description": "Hitamo igihe kigukwiriye cyo kuganira n’umuganga."
      },
      {
        "title": "Jya mu Kiganiro",
        "description": "Hamagara umuganga ukoresheje video ku gihe mwumvikanyeho, muganire ku bibazo by’ubuzima bwawe."
      },
      {
        "title": "Habona Uburyo bwo Kuvurwa",
        "description": "Habona imiti, impapuro z’abajyanama, cyangwa gahunda yo gukurikirana nk’uko umuganga abigutegetse."
      }
    ],
    "demoHeading": "Reba Teleconsultation mu Bikorwa",
    "demoDescription": "Reba video igufi igaragaza uburyo teleconsultation ikora kuva itangira kugeza irangira.",
    "watchDemo": "Reba Video",
    "videoAlt": "Video igaragaza teleconsultation"
  },
    "teleconsultationFeatures": {
    "heading": "Ibikubiye muri Serivisi ya Teleconsultation",
    "description": "Serivisi yacu ya teleconsultation itanga ubuvuzi bwa mudasobwa bwuzuye bufite ibiranga bigamije korohereza, kugera byoroshye, no kugira akamaro mu buvuzi bw'ahantu hatandukanye.",
    "features": {
      "video": {
        "title": "Amashusho meza yo kuganira na Muganga",
        "description": "Vugana n'abaganga ukoresheje videwo ifite ireme rihanitse itanga ubunararibonye bwo kuganira bwihariye kandi busobanutse."
      },
      "messaging": {
        "title": "Ubutumwa Bwo Kwizerwa",
        "description": "Ohereza kandi wakire ubutumwa bwizewe n'umuganga wawe mbere na nyuma yo kuganira."
      },
      "prescriptions": {
        "title": "Imiti yanditse kuri mudasobwa",
        "description": "Bona imiti yanditse kuri mudasobwa ishobora koherezwa ku bubiko bwacu bufatanyije bwo kugeza imiti aho uri."
      },
      "quickAccess": {
        "title": "Kwihutisha Serivisi",
        "description": "Bona ubuvuzi vuba na bwangu hamwe n'igihe cyo gutegereza kingana n'iminota 15 ku bw'ibibazo byihutirwa."
      },
      "privacy": {
        "title": "Ibanga kandi Bifite Umutekano",
        "description": "Ibiganiro byose bikorwa hifashishijwe uburyo bw'ikoranabuhanga bwizewe kugira ngo amakuru yawe y'ubuvuzi agume ibanga."
      },
      "multiDevice": {
        "title": "Kwinjira kuri Mudasobwa nyinshi",
        "description": "Injira muri serivisi za teleconsultation ukoresheje mudasobwa, telefone, cyangwa tablet."
      }
    }
  },
     "teleconsultation3": {
    "serviceTag": "Serivisi ya Teleconsultation",
    "title": "Ubuvuzi bwa Mudasobwa Bukugezeho",
    "description": "Vugana n'abaganga babifitiye uburenganzira utavuye mu rugo. Fata inama z'ubuvuzi, imiti, n'uburyo bwo gukurikirana ubuzima utavuye aho uri.",
    "startConsultation": "Tangira Ikiganiro",
    "bookAppointment": "Tegura Gahunda",
    "stats": {
      "doctors": "Abaganga",
      "availability": "Igihe cyose",
      "avgWaitTime": "Igihe cyo gutegereza"
    },
    "securePrivate": "Bifite umutekano kandi by'ibanga"
  },
    "doctor1": {
    "menu": {
      "dashboard": "Urupapuro rw’ibanze",
      "appointments": "Inama",
      "patients": "Abarwayi",
      "teleconsultations": "Kuvugana kure",
      "prescriptions": "Imiti yanditswe",
      "settings": "Ibyahindurwa"
    },
    "header": {
      "panel": "Urubuga rw’Doctor"
    },
    "user": {
      "role": "Doctor"
    }
  },
  "nav": {
    "logout": "Sohoka"
  },
    "settings": {
    "title": "Imyanya",
    "subtitle": "Igenzura umwirondoro wawe n'ibyo ukunda",
    "profileInformation": "Amakuru y'umwirondoro",
    "fullName": "Amazina Yuzuye",
    "email": "Imeri",
    "phoneNumber": "Nomero ya Telefoni",
    "specialty": "Ubumenyi",
    "hospitalClinic": "Ibitaro/Ikigo nderabuzima",
    "licenseNumber": "Nomero y'Uruhushya",
    "bio": "Ibyerekeyewe",
    "workingHours": "Amasaha yo Gukora",
    "to": "kugera",
    "notificationPreferences": "Ibyerekeye Amatangazo",
    "newAppointmentRequests": {
      "title": "Ibisabwa bishya byo gukoresha",
      "description": "Umenyeshwa igihe abarwayi bateganyiriza igihe"
    },
    "teleconsultationReminders": {
      "title": "Ibibutsa bya Teleconsultation",
      "description": "Ibibutsa iminota 10 mbere y'inama za kure"
    },
    "emergencyAlerts": {
      "title": "Amatangazo y'Ibibazo Bikomeye",
      "description": "Amatangazo yihutirwa ku biganiro byihutirwa"
    },
    "patientMessages": {
      "title": "Ubutumwa bw'abarwayi",
      "description": "Ubutumwa buturutse ku barwayi binyuze ku rubuga"
    },
    "languageRegion": "Ururimi & Akarere",
    "language": "Ururimi",
    "timeZone": "Isaha y'Akarere",
    "security": "Umuryango w'Umutekano",
    "currentPassword": "Ijambo ry'ibanga ry'ubu",
    "currentPasswordPlaceholder": "Injiza ijambo ry'ibanga ry'ubu",
    "newPassword": "Ijambo ry'ibanga rishya",
    "newPasswordPlaceholder": "Injiza ijambo ry'ibanga rishya",
    "confirmNewPassword": "Emeza ijambo ry'ibanga rishya",
    "confirmNewPasswordPlaceholder": "Emeza ijambo ry'ibanga rishya",
    "enableTwoFactorAuth": "Shyiraho uburyo bwo kwemeza kabiri",
    "saveChanges": "Bika Impinduka"
  },
  "days": {
    "monday": "Kuwa Mbere",
    "tuesday": "Kuwa Kabiri",
    "wednesday": "Kuwa Gatatu",
    "thursday": "Kuwa Kane",
    "friday": "Kuwa Gatanu",
    "saturday": "Kuwa Gatandatu",
    "sunday": "Kuwa Mungu"
  },
    "prescriptions1": {
    "title": "Imiti yanditswe",
    "subtitle": "Tunganya imiti yandikiwe abarwayi",
    "newPrescription": "Andika umuti mushya",
    "searchPlaceholder": "Shakisha ku izina ry'umurwayi cyangwa umuti...",
    "allStatus": "Imiterere yose",
    "active": "Iriho",
    "completed": "Yarangiye",
    "expired": "Yarengeje igihe",
    "date": "Itariki",
    "diagnosis": "Indwara",
    "medications": "Imiti",
    "doctorsNotes": "Inama z'umuganga",
    "duration": "Igihe imiti izakoreshwa",
    "viewFull": "Reba umuti wuzuye",
    "exportPdf": "Ohereza nka PDF",
    "sendPharmacy": "Ohereza muri farumasi",
    "duplicate": "Kora kopi y'umutwe w'igikoresho",
    "pagination": {
      "previous": "Ibyabanje",
      "next": "Ibikurikira",
      "pageInfo": "Urupapuro rwa 1 muri 1"
    }
  },
     "teleconsultations1": {
    "title": "Ibiganiro by'ubuvuzi hifashishijwe ikoranabuhanga",
    "subtitle": "Tunganya ibiganiro by'ubuvuzi hifashishijwe videwo",
    "virtualConsultations": "Ibiganiro by'ubuvuzi hifashishijwe ikoranabuhanga",
    "startCall": "Tangira ikiganiro",
    "scheduled": "Biteganyijwe"
  },
    "patients": {
    "title": "Abakiriya Banjye",
    "subtitle": "Tunganya kandi ukurikirane abakiriya bawe",
    "searchPlaceholder": "Shakisha abakiriya ukoresheje amazina cyangwa indwara...",
    "filters": {
      "conditions": {
        "all": "Indwara Zose",
        "hypertension": "Umuvuduko w’amaraso",
        "diabetes": "Diabete",
        "heartDisease": "Indwara y’umutima",
        "mentalHealth": "Ubuzima bwo mu mutwe"
      },
      "statuses": {
        "all": "Imiterere Yose",
        "activeTreatment": "Gutanga Ubuvuzi",
        "followUpRequired": "Gukeneye Gukurikirana",
        "stable": "Imeze Neza",
        "critical": "Ibikomeye"
      }
    },
    "primaryCondition": "Indwara Nyamukuru",
    "status": "Imiterere",
    "lastVisit": "Urugendo rwa Nyuma",
    "nextAppointment": "Gahunda Ikurikira",
    "actions": {
      "viewFile": "Reba dosiye",
      "call": "Hamagarira",
      "video": "Video"
    },
    "pagination": {
      "previous": "Icyabanjirije",
      "next": "Ikurikira",
      "pageInfo": "Urupapuro {{current}} rwa {{total}}"
    }
  },
    "appointments1": {
    "title": "Amatariki y'ibiganiro",
    "subtitle": "Tunganya gahunda y'abakiriya bawe n'ibiganiro",
    "status": {
      "confirmed": "byemejwe",
      "pending": "bikiri gutegurwa"
    },
    "reason": "Impamvu",
    "joinCall": "Jya mu kiganiro",
    "viewDetails": "Reba ibisobanuro"
  },
    "doctorDashboard": {
    "title": "Dashibodi y'Umuganga",
    "subtitle": "Tunganya abarwayi n'ibiganiro by’ubuvuzi",
    "stats": {
      "appointmentsToday": "Inama za none",
      "totalPatients": "Ababwayi bose",
      "teleconsultations": "Inama z’ubuvuzi hifashishijwe ikoranabuhanga",
      "prescriptions": "Imiti yanditswe"
    },
    "todaysSchedule": "Igenamigambi rya none",
    "status": {
      "confirmed": "Yemejwe",
      "pending": "Itegereje"
    },
    "quickActions": {
      "patientRecords": {
        "title": "Amakuru y'abarwayi",
        "desc": "Reba kandi utegure amakuru y’ubuvuzi y’abarwayi"
      },
      "prescriptions": {
        "title": "Imiti yanditswe",
        "desc": "Andika kandi utegure imiti yanditswe mu buryo bwa digital"
      },
      "analytics": {
        "title": "Isesengura",
        "desc": "Reba imibare n’isesengura ry’ibiganiro by’ubuvuzi"
      }
    },
    "appointments": {
      "generalConsultation": "Ikiganiro rusange cy’ubuvuzi",
      "teleconsultation": "Ikiganiro cy’ubuvuzi hifashishijwe ikoranabuhanga",
      "followUpConsultation": "Ikiganiro cyo gukurikirana"
    }
  },
    "userDropdown": {
    "dashboard": "Dashibodi",
    "signOut": "Sohoka",
    "defaultUser": "Umukoresha",
    "defaultEmail": "umukoresha@example.com"
  },
    "adminSettings": {
    "title": "Igenamiterere rya Sisitemu",
    "description": "Shyiraho imiterere n'ibyo wifuza muri sisitemu",
    "generalSettings": "Igenamiterere Rusange",
    "siteName": "Izina ry'urubuga",
    "siteDescription": "Ibisobanuro by'urubuga",
    "primaryColor": "Ibara ry'ingenzi",
    "language": "Ururimi",
    "timezone": "Isaha y'akarere",
    "notificationSettings": "Igenamiterere rya Notifikesiyo",
    "emailNotifications": "Notifikesiyo za Email",
    "emailNotificationsDesc": "Ohereza notifikesiyo ukoresheje email",
    "smsNotifications": "Notifikesiyo za SMS",
    "smsNotificationsDesc": "Ohereza notifikesiyo ukoresheje SMS",
    "pushNotifications": "Notifikesiyo zishyirwa kuri Browser",
    "pushNotificationsDesc": "Ohereza notifikesiyo za browser",
    "appointmentReminders": "Kwitwaza Amasezerano",
    "appointmentRemindersDesc": "Kwitwaza amasezerano mu buryo bwikora",
    "contactInformation": "Amakuru y'Itumanaho",
    "hospitalName": "Izina ry'Ibitaro",
    "hospitalAddress": "Aderesi y'Ibitaro",
    "phoneNumber": "Numero ya Telefone",
    "emailAddress": "Aderesi ya Email",
    "emergencyNumber": "Numero y'Ubutabazi",
    "appointmentSettings": "Igenamiterere ry'Amasezerano",
    "appointmentSlotDuration": "Igihe cy'Igice cy'Amasezerano (amasegonda)",
    "minutes": "iminota {{count}}",
    "maxAdvanceBooking": "Iminsi ntarengwa yo kwitegura",
    "cancellationDeadline": "Igihe ntarengwa cyo guhindura amasezerano (mu masaha)",
    "acceptInsurance": "Emeza Ubwishingizi",
    "acceptInsuranceDesc": "Emerera kwishyura ukoresheje ubwishingizi",
    "acceptMobileMoney": "Emeza Mobile Money",
    "acceptMobileMoneyDesc": "Emerera kwishyura ukoresheje Mobile Money",
    "saveButton": "Bika Igenamiterere Ryose",
    "saveSuccess": "Igenamiterere ryabitswe neza!",
    "acceptCash": "Emeza Ifaranga",
    "acceptCashDesc": "Emerera kwishyura mu mafaranga"
  },
  "languages": {
    "english": "Icyongereza",
    "kinyarwanda": "Ikinyarwanda",
    "french": "Igifaransa"
  },
  "timezones": {
    "caf": "Isaha y' Afurika yo Hagati (UTC+2)",
    "cet": "Isaha y'Uburayi bwo Hagati (UTC+1)"
  },
    "security": {
    "pageTitle": "Imicungire y'Umutekano",
    "pageDescription": "Kurikirana no guhindura imyirondoro y'umutekano wa sisitemu",
    "status": {
      "secure": "Bifite Umutekano",
      "systemStatus": "Imiterere ya Sisitemu",
      "activeSessions": "Ibyiciro Bikora",
      "securityAlerts": "Ibyitonderwa by'Umutekano",
      "uptime": "Igihe Sisitemu Ikora"
    },
    "settings": {
      "title": "Imyirondoro y'Umutekano",
      "mfa": "Kwemeza inshuro nyinshi (MFA)",
      "mfaDesc": "Gusaba MFA ku bakoresha bose",
      "autoLogout": "Gusohoka Kuva Muri Sisitemu",
      "autoLogoutDesc": "Gusohora abakoresha batari gukora",
      "encryption": "Guhisha Amakuru",
      "encryptionDesc": "Guhisha amakuru y'ingenzi ari ku murongo",
      "sessionTimeout": "Igihe cya Session (iminota)",
      "passwordMinLength": "Uburebure bw'Ijambo ry'Ibanga",
      "lockoutAttempts": "Gufunga Konti Nyuma y'Ibigeragezo Bidashobotse",
      "saveButton": "Bika Imyirondoro y'Umutekano"
    },
    "logs": {
      "title": "Amadosiye y'Umutekano",
      "status": {
        "success": "Byagenze Neza",
        "blocked": "Byahagaritswe"
      },
      "action": {
        "login": "Injira Neza",
        "failed_login": "Kugerageza Kwinjira Kudakunze",
        "permission": "Kwinjira mu Madosiye y'Abakiriya"
      },
      "user": "Ukoresha",
      "ip": "Aderesi ya IP",
      "viewAll": "Reba Amadosiye Yose"
    },
    "tools": {
      "title": "Ibikoresho by'Umutekano",
      "systemBackup": {
        "title": "Gusubiza Sisitemu",
        "desc": "Kora kopi y'umutekano wa sisitemu"
      },
      "securityScan": {
        "title": "Isuzuma ry'Umutekano",
        "desc": "Kora isuzuma ry'uburyo sisitemu yatezuka"
      },
      "incidentResponse": {
        "title": "Igikorwa cyo Gucunga Ibibazo",
        "desc": "Reba ibibazo by'umutekano"
      }
    }
  },
    "reports": {
    "title": "Raporo & Isesengura",
    "description": "Ubusobanuro burambuye ku mikorere y'ikoranabuhanga n'ibipimo by'ubuzima",
    "exporting": "Kohereza raporo mu buryo bwa {{format}}...",
    "export": {
      "pdf": "Ohereza PDF",
      "excel": "Ohereza Excel"
    },
    "period": {
      "week": "Icyumweru Iki",
      "month": "Ukwezi Kw'uyu Munsi",
      "quarter": "Igihembwe",
      "year": "Umwaka"
    },
    "type": {
      "overview": "Isesengura rusange",
      "appointments": "Imishyikirano",
      "financial": "Imari",
      "patients": "Abarwayi"
    },
    "metrics": {
      "totalPatients": "Abarwayi bose",
      "appointments": "Imishyikirano",
      "revenue": "Inyungu (RWF)",
      "satisfactionRate": "Igipimo cy'ibyishimo",
      "increase": "+{{percent}}% ugereranije n'ukwezi gushize"
    },
    "sections": {
      "departmentPerformance": "Imikorere y’Ibice",
      "appointmentStatus": "Imiterere y’Imishyikirano",
      "insuranceClaimsSummary": "Isesengura ry’Ubwishingizi",
      "reportTemplates": "Ibyitegererezo bya Raporo"
    },
    "labels": {
      "patients": "abarwayi"
    },
    "appointmentStatus": {
      "completed": "Byarangiye",
      "cancelled": "Byahagaritswe",
      "noShow": "Ntabwo yaje",
      "rescheduled": "Yahinduwe igihe"
    },
    "insurance": {
      "provider": "Umutanga ubwishingizi",
      "claimsCount": "Umubare w’ibirego",
      "totalAmount": "Umubare w’amafaranga (RWF)",
      "avgClaim": "Igirekezo cy’ibirego"
    },
    "templates": {
      "monthlySummary": {
        "title": "Raporo y’ukwezi",
        "desc": "Raporo yuzuye y’ukwezi"
      },
      "patientAnalytics": {
        "title": "Isesengura ry’abarwayi",
        "desc": "Imibare n’imigendekere y’abarwayi"
      },
      "financialReport": {
        "title": "Raporo y’Imari",
        "desc": "Isesengura ry’inyungu n’imbogamizi"
      }
    }
  },
    "appointments": {
    "management": "Gucunga Amagena",
    "description": "Gucunga no gukurikirana amagena yose muri sisitemu",
    "stats": {
      "total": "Amagena yose",
      "confirmed": "Yemejwe",
      "pending": "Ategereje",
      "teleconsultations": "Amagana y'Ikoranabuhanga"
    },
    "filters": {
      "all": "Amagena yose",
      "confirmed": "Yemejwe",
      "pending": "Ategereje",
      "completed": "Yarangije",
      "cancelled": "Yahagaritswe"
    },
    "searchPlaceholder": "Shakisha amagena...",
    "table": {
      "patient": "Umurwayi",
      "doctor": "Umuganga",
      "dateTime": "Italiki n'Isaha",
      "type": "Ubwoko",
      "status": "Imiterere",
      "actions": "Ibikorwa"
    },
    "quickActions": {
      "title": "Ibikorwa Byihuse",
      "schedule": {
        "title": "Tegura Agena",
        "desc": "Ongeraho agena gashya"
      },
      "viewSchedule": {
        "title": "Reba Agena",
        "desc": "Reba amagana y'uyu munsi"
      },
      "filters": {
        "title": "Amasezerano Asobanutse",
        "desc": "Shakisha ukurikije italiki, umuganga, n'ibindi"
      }
    },
    "statusOptions": {
      "pending": "Ategereje",
      "confirmed": "Yemejwe",
      "completed": "Yarangije",
      "cancelled": "Yahagaritswe"
    }
  },
    "notifications": {
    "button_aria_label": "Fungura urutonde rw’amenyeshwa",
    "title": "Amenyeshwa",
    "close": "Funga amenyeshwa",
    "requested_teleconsultation": "yasabye kuvugana na muganga kuri telefoni kuri",
    "uploaded_lab_results": "yohereje ibisubizo by'ibizamini bya laboratoire kuri",
    "requested_pharmacy_delivery": "yasabye ko imiti imugezwa kuri",
    "cancelled_appointment": "yahagaritse gahunda y’inama kuri",
    "appointment": "Gahunda",
    "medical_report": "Raporo y’ubuvuzi",
    "prescription": "Itegeko ry’imiti",
    "just_now": "Ubu hashize akanya gato",
    "one_hour_ago": "Isaha imwe ishize",
    "minutes_ago": "Hashize iminota {{count}}",
    "view_all": "Reba Amenyeshwa Yose",
    "user_alt": "Ifoto ya {{name}}"
  },
 "medicalHistory": {
    "title": "Amateka y'Ubuvuzi",
    "subtitle": "Amakuru yawe yose y'ubuvuzi n'amateka y'ubujyanama",
    "total_visits": "Inzoga Zose",
    "doctors_seen": "Abaganga Wabonye",
    "prescriptions": "Imiti yanditswe",
    "lab_reports": "Raporo z'Igerageza",
    "filter_title": "Saba Amateka",
    "all_doctors": "Abaganga Bose",
    "all_departments": "Ibyiciro Byose",
    "all_types": "Ubwoko Bwose",
    "in_person": "Imbonankubone",
    "teleconsultation": "Inama hifashishijwe ikoranabuhanga",
    "diagnosis": "Icyorezo",
    "medications": "Imiti",
    "notes": "Ibyanditswe n'Umuganga",
    "view_full_report": "Reba Raporo Yuzuye",
    "download_pdf": "Kuramo PDF",
    "share_with_doctor": "Sangira n’Umuganga",
    "load_more": "Soma Amateka Menshi",
    "export_title": "Sohora Amateka y’Ubuvuzi",
    "export_description": "Kuramo amateka yawe yose y'ubuvuzi kugira ngo uyabike cyangwa uyasangize abaganga.",
    "email_summary": "Ohereza Inyandiko kuri Email"
  },
  "departments": {
    "cardiology": "Ubuganga bw’imitima",
    "gynecology": "Ubuganga bw’abagore",
    "mental_health": "Ubuzima bwo mu mutwe",
    "general_medicine": "Ubuganga rusange"
  },
  "departments": {
    "cardiology": "Ubuganga bw’imitima",
    "gynecology": "Ubuganga bw’abagore",
    "mental_health": "Ubuzima bwo mu mutwe",
    "general_medicine": "Ubuganga rusange"
  },
    "emergency1": {
    "title": "Gutanga Icyo Ukeneye mu By'Ubuzima Byihutirwa",
    "call_now": "Hamagara serivisi z’ubutabazi ako kanya niba ikibazo gikomeye",
    "hotlines": "Numero z’Ubutabazi",
    "emergency": "Ubutabazi",
    "police": "Polisi",
    "fire_rescue": "Kuzimya no Gutabara",
    "select_emergency_type": "Hitamo ubwoko bw'ikibazo cyihutirwa",
    "continue": "Komeza",
    "choose_help_type": "Hitamo ubufasha ukeneye",
    "back": "Subira Inyuma",
    "share_location": "Sangira Aho Uri",
    "use_gps": "Koresha GPS",
    "gps_description": "Menya aho uri hifashishijwe GPS",
    "manual_location": "Injiza aho uri intoki",
    "manual_location_placeholder": "Andika aho uri cyangwa ahantu hegereye hazwi",
    "describe_emergency": "Sobanura Icyabaye",
    "description_label": "Ibisobanuro ku kibazo cyihutirwa",
    "description_placeholder": "Tanga ibisobanuro ku byabaye",
    "take_photo": "Fata Ifoto",
    "record_voice_note": "Fata Ubutumwa Bw'ijwi",
    "severity_level": "Hitamo Urwego rw'Ubukana",
    "submit_request": "Ohereza Icyo Ukeneye",
    "request_submitted": "Icyo usabye cyoherejwe",
    "request_confirmed": "Icyo usabye cyemejwe",
    "help_on_way": "Ubufasha buri mu nzira",
    "response_status": "Imiterere y'Ubutabazi",
    "request_received": "Icyo usabye cyakiriwe",
    "dispatching_help": "Kohereza ubufasha",
    "help_arrival": "Ubufasha bugiye kugera",
    "nearest_facility": "Ikigo cy’Ubuvuzi cyegereye",
    "call_hotline": "Hamagara Numero y'Ubutabazi",
    "track_response": "Kurikirana Ubutabazi"
  },
  "emergencyTypes": {
    "accident": "Impanuka y’Umuhanda",
    "maternal": "Ubutabazi ku Mubyeyi",
    "mental": "Ibibazo by’Ubuzima bwo mu Mutwe",
    "respiratory": "Ibibazo byo Guhumeka",
    "covid": "Ubutabazi bwa COVID-19",
    "cardiac": "Ibibazo by’Umutima"
  },
  "helpTypes": {
    "ambulance": "Ambulansi",
    "doctor": "Dogiteri",
    "medicine": "Kugeza Imiti"
  },
  "severityLevels": {
    "mild": "Bucye",
    "mild_desc": "Bukeneye kwitabwaho ariko si ubuzima buri mu kaga",
    "intense": "Bukabije",
    "intense_desc": "Buteje ikibazo gikomeye ariko gishobora gucungurwa",
    "severe": "Bukomeye",
    "severe_desc": "Ubuzima buri mu kaga"
  },
     aiAssistant: {
      title: "Umufasha w’Ubuzima AI",
      subtitle: "Fata inama z’ubuzima zihariye kandi zifasha",
      quickFeatures: {
        symptomChecker: {
          title: "Genzura Ibimenyetso",
          description: "Sobanura ibimenyetso byawe ubone amakuru y'ibanze y’ubuzima",
        },
        appointmentHelp: {
          title: "Kugufasha Gukora Itegurwa",
          description: "Fashwa gutegura gahunda no guhitamo abaganga",
        },
        prescriptionGuide: {
          title: "Uburyo bwo Gusoma Imiti",
          description: "Sobanukirwa neza imiti n'amabwiriza y'uko uyifata",
        },
        referralSupport: {
          title: "Ubufasha bwo Kohereza",
          description: "Fashwa kubona inzobere n’amavuriro akwiriye",
        },
        healthEducation: {
          title: "Amakuru y’Ubuzima",
          description: "Menya ibyerekeye imirire, isuku, no kwirinda indwara",
        },
        privacySafety: {
          title: "Ibanga & Umutekano",
          description: "Amakuru yawe arinzwe kandi ibiganiro ni ibanga",
        },
      },
      chat: {
        title: "Vugana n’Umufasha AI",
        assistantName: "Umufasha AI",
        welcomeMessage: "Muraho! Ndi hano kugufasha ku bibazo by'ubuzima. Nkwifashe dute uyu munsi?",
        quickActions: {
          checkSymptoms: "Reba ibimenyetso",
          bookAppointment: "Tegura gahunda",
          understandPrescription: "Sobanukirwa imiti",
          findSpecialist: "Shaka inzobere",
        },
        inputPlaceholder: "Andika ikibazo cyawe cy'ubuzima hano...",
        sendButton: "Ohereza",
      },
      healthTips: {
        title: "Inama z’Ubuzima z’Uyu munsi",
        tips: {
          stayHydrated: {
            title: "💧 Kunywa Amazi Menshi",
            description: "Unywe ibyibuze ibyombo 8 by’amazi buri munsi kugira ngo ugire ubuzima bwiza.",
          },
          exerciseRegularly: {
            title: "🏃‍♂️ Gukora Imyitozo Ngororamubiri",
            description: "Gerageza gukora imyitozo iminota 30 inshuro 5 mu cyumweru.",
          },
          balancedDiet: {
            title: "🍎 Ifunguro Ryuzuye",
            description: "Kuramo imbuto, imboga, n'ibinyampeke mu mafunguro yawe ya buri munsi.",
          },
        },
      },
      privacyNotice: {
        title: "Ibanga & Umutekano w’Amakuru",
        description:
          "Ibiganiro byawe n’umufasha wacu wa AI ni ibanga kandi byanditswe mu buryo bwizewe. Ntitugirana amakuru yawe n’uruhande rwa gatatu. Mu bihe byihutirwa by’ubuzima, hamagara ubutabazi bwihutirwa ako kanya.",
      },
    },
     "common": {
      "loading":"biri kuza",
    "continue": "Komeza",
    "back": "Garuka",
    "confirm": "Emeza",
    "or": "CYANGWA"
  },
  "pharmacyOrders": {
    "title": "Gutanga Imiti",
    "subtitle": "Tegura imiti uvuye muri farumasi zifatanyije",
    "steps": {
      "choosePharmacy": "Hitamo Farumasi",
      "pharmacyProfile": "Amakuru ya Farumasi",
      "uploadPrescription": "Ohereza Ibaruwa y'Imiti",
      "confirmMedications": "Emeza Imiti",
      "paymentInsurance": "Uburyo bwo Kwishyura n'Ubwishingizi",
      "deliveryOptions": "Uburyo bwo Gutanga",
      "orderConfirmation": "Kwemeza Itegeko",
      "orderHistory": "Amateka y’Itegeko ry’Imiti"
    },
    "services": "Serivisi",
    "servicesList": {
      "PrescriptionFilling": "Kuzuza Ibaruwa y'Imiti",
      "DrugConsultation": "Inama ku Miti",
      "HomeDelivery": "Gutangira Imiti mu Rugo",
      "HealthProducts": "Ibicuruzwa by’Ubuzima",
      "EmergencyDrugs": "Imiti y’Ibyihutirwa",
      "MedicalSupplies": "Ibikoresho by’Ubuvuzi",
      "Delivery": "Gutangira"
    },
    "insuranceAccepted": "Ubwishingizi Bwemerewe",
    "rating": "Inyungu",
    "uploadEPrescription": "Ohereza Ibaruwa y'Imiti (E-Prescription)",
    "dragDropOrBrowse": "Tereka cyangwa ukande utoranye dosiye y'ibaruwa y'imiti",
    "chooseFile": "Hitamo Dosiye",
    "enterMedications": "Injiza Imiti Nka Manual",
    "medicationName": "Izina ry’Imiti",
    "dosage": "Ingano y'Imiti",
    "quantity": "Umubare",
    "addMedication": "Ongeraho Indi Miti",
    "medications": {
      "paracetamol": "Paracetamol 500mg",
      "amoxicillin": "Amoxicillin 250mg"
    },
    "tablets": "tablet",
    "requestClarification": "Saba Gusobanurirwa",
    "total": "Igiteranyo",
    "selectPaymentMethod": "Hitamo Uburyo bwo Kwishyura",
    "paymentMethods": {
      "MobileMoney": "Mobile Money",
      "BankTransfer": "Kohereza Banki",
      "InsuranceCoverage": "Ubwishingizi",
      "CashonDelivery": "Amafaranga Kuza Gutanga"
    },
    "insuranceDetails": "Amakuru y’Ubwishingizi",
    "selectInsurance": "Hitamo Ubwishingizi",
    "policyNumber": "Nomero ya Polisi",
    "processPayment": "Kora Kwishyura",
    "pickupAtPharmacy": "Kujya Gufata Imiti muri Farumasi",
    "pickupDetails": "Kubuntu - Iminota 30 byo gutegereza",
    "homeDelivery": "Gutangira mu Rugo",
    "homeDeliveryDetails": "1,500 RWF - Iminsi 2-4 yo gutanga",
    "deliveryAddress": "Aderesi yo Gutangiriraho",
    "enterDeliveryAddress": "Injiza aderesi yawe yo gutangira",
    "orderPlacedSuccess": "Itegeko Ryashyizweho Neza!",
    "orderId": "Nomero y'Itegeko",
    "orderStatus": "Imiterere y'Itegeko",
    "status": {
      "orderReceived": "Itegeko Ryakiriwe - Riri Gutegerezwa Kwemezwa na Farumasi",
      "approvedByPharmacy": "Ryemejwe na Farumasi",
      "readyForPickup": "Ryiteguye Gufatwa cyangwa Gutangwa"
    },
    "viewHistory": "Reba Amateka",
    "orders": {
      "order1": {
        "id": "Itegeko #PHR-2024-001",
        "pharmacy": "Farumasi UBWIZA",
        "date": "Werurwe 15, 2024",
        "items": {
          "paracetamol": "Paracetamol 500mg (tablet 20)",
          "amoxicillin": "Amoxicillin 250mg (tablet 14)"
        },
        "status": "Ryatanze"
      },
      "order2": {
        "id": "Itegeko #PHR-2024-002",
        "pharmacy": "Farumasi Mama Teta",
        "date": "Werurwe 10, 2024",
        "items": {
          "ibuprofen": "Ibuprofen 400mg (tablet 12)"
        },
        "status": "Ryarangiye"
      }
    },
    "viewReceipt": "Reba Resi",
    "placeNewOrder": "Tegura Itegeko Rishya"
  },
    "teleconsultation": {
    "title": "Kuganira n'abaganga kuri murandasi",
    "subtitle": "Hura n'abaganga uhoraho ukoresheje ikoranabuhanga",
    "available": "Iri murubuga rwa murandasi",
    "fee": "Amafaranga",
    "payAndContinue": "Kwishyura & Komeza",
    "joinInstructions": "Muganga wawe azahita yinjira. Nyamuneka ugire internet ihamye.",
    "joinNow": "Injira Ubu",
    "completeConsultation": "Irangiza Kuganira",
    "steps": {
      "selectHospital": "Hitamo Ibitaro/Kliniki",
      "chooseConsultationType": "Hitamo Ubwoko bwa Serivisi",
      "selectInsurance": "Hitamo Ubwishingizi/Ubwishyu",
      "patientInfo": "Amakuru y'Umurwayi",
      "paymentMethod": "Uburyo bwo Kwishyura",
      "joinConsultation": "Injira mu Kuganira",
      "followUpOptions": "Amahitamo yo gukurikiranwa",
      "medicalHistory": "Amateka y'Ubuzima"
    },
    "consultations": {
      "general": "Kuganira Rusange",
      "cardiology": "Ibibazo by'Umutima",
      "gynecology": "Ibibazo by'Abagore",
      "mentalHealth": "Ubuzima bwo Mu Mutwe",
      "pediatrics": "Ubuzima bw'Abana"
    },
    "patientInfo": {
      "fullName": "Amazina Yuzuye",
      "age": "Imyaka",
      "nationalId": "Indangamuntu",
      "phone": "Numero ya Telefone",
      "weight": "Ibiro (kg)",
      "selectGender": "Hitamo Igitsina",
      "male": "Gabo",
      "female": "Gore",
      "symptoms": "Sobanura ibimenyetso cyangwa impamvu y'ikiganiro"
    },
    "paymentMethods": {
      "mobileMoney": "Mobile Money (MTN/Airtel)",
      "bankTransfer": "Kohereza kuri Banki",
      "ussdPayment": "Kwishyura USSD"
    },
    "callTypes": {
      "video": "Kugirana Kuganira kuri Video",
      "phone": "Kugirana Kuganira kuri Telefone"
    },
    "followUp": {
      "digitalPrescription": "Ibaruwa y'Imiti kuri murandasi",
      "receiveMedications": "Bona imiti ukoresheje ikoranabuhanga",
      "scheduleFollowUp": "Shyiraho igihe cyo gukurikiranwa",
      "bookNextAppointment": "Teganya gahunda y'inama ikurikira",
      "medicalRecords": "Amakuru y'Ubuzima",
      "viewNotes": "Reba inyandiko z'ibiganiro"
    },
    "history": {
      "doctorName": "{{name}}",
      "department": {
        "cardiology": "Ibibazo by'Umutima"
      },
      "date": "Itariki: {{date}}",
      "status": {
        "completed": "Byarangiye"
      },
      "diagnosis": "Icyorezo",
      "medications": "Imiti",
      "notes": "Inyandiko"
    }
  },
    "bookAppointments": {
    "title": "Gufata Rendez-vous",
    "subtitle": "Teganya gahunda yo kuganira na muganga",
    "steps": {
      "chooseType": "Hitamo ubwoko bwa Rendez-vous",
      "selectHospital": "Hitamo Ibitaro/Kliniki",
      "chooseDepartment": "Hitamo Ishami",
      "patientInfo": "Amakuru y’Uburwayi",
      "selectDateTime": "Hitamo Itariki n’Igihe",
      "paymentConfirmation": "Kwishyura no Kwemeza"
    },
    "types": {
      "inclinic": "Ku bitaro",
      "teleconsultation": "Kuvugana n’umuganga kuri internet",
      "followup": "Gusubira kwa muganga"
    },
    "typeDescriptions": {
      "inClinic": "Kujya ku bitaro ku giti cyawe",
      "teleconsultation": "Kuganira na muganga uri mu rugo",
      "followUp": "Gusubira kubonana na muganga wabonanye mbere"
    },
    "patientInfo": {
      "fullName": "Amazina yose",
      "nationalId": "Indangamuntu",
      "email": "Aderesi ya Email",
      "phone": "Numero ya Telefone",
      "address": "Aho utuye"
    },
    "dateTime": {
      "preferredDate": "Itariki ushaka",
      "preferredTime": "Igihe ushaka"
    },
    "paymentSummary": "Incamake ya Rendez-vous",
    "type": "Ubwoko",
    "hospital": "Ibitaro",
    "department": "Ishami",
    "fee": "Igiciro",
    "paymentMethod": "Uburyo bwo kwishyura",
    "paymentMethods": {
      "mobilemoney": "Mobile Money",
      "banktransfer": "Kohereza kuri Banki",
      "insurance": "Ubwishingizi",
      "ussd": "USSD"
    },
    "confirmPay": "Emeza & wishyure"
  },
  "departments1": {
    "generalmedicine": "Ubuvuzi rusange",
    "pediatrics": "Indwara z’abana",
    "gynecology": "Ubuvuzi bw’abagore",
    "cardiology": "Ubuvuzi bw’umutima",
    "mentalhealth": "Ubuzima bwo mu mutwe",
    "emergency": "Ubuvuzi bwihutirwa"
  },
    "notificationButtonLabel": "Fungura amatangazo",
  "notificationTitle": "Itangazo",
  "closeDropdown": "Funga urutonde rw'amatangazo",
  "userJeanUwizeye": "Jean Uwizeye",
  "requestedTeleconsultationAt": "yasabye kugirwa inama kuri terefone kuri",
  "kingFaisalHospital": "Ibitaro bya King Faisal",
  "appointment": "Inama",
  "justNow": "Ubu hashize akanya gato",
  "userAlineMukamana": "Aline Mukamana",
  "uploadedLabResultsTo": "yohereje ibisubizo by'ibizamini kuri",
  "chuk": "CHUK",
  "medicalReport": "Raporo y'ubuvuzi",
  "minutesAgo": "Hashize iminota {{count}}",
  "userEricHabimana": "Eric Habimana",
  "requestedPharmacyDeliveryFrom": "yasabye ko imiti itangwa iva kuri",
  "kibagabagaHospital": "Ibitaro bya Kibagabaga",
  "prescription": "Icyemezo cy'umuti",
  "userDivineIngabire": "Divine Ingabire",
  "cancelledUpcomingAppointmentAt": "yahagaritse inama yari iteganyijwe kuri",
  "rwandaMilitaryHospital": "Ibitaro bya Gisirikare bya Rwanda",
  "oneHourAgo": "Hashize isaha 1",
  "viewAllNotifications": "Reba Amatangazo Yose",
   "patient1": {
    "dashboard": {
      "title": "Urupapuro rw’Umurwayi",
      "subtitle": "Genza ubuzima bwawe n’udukurikiranwa",

      "quickStats": {
        "upcomingAppointments": "Gahunda ziri imbere",
        "activePrescriptions": "Imiti iri mu bikorwa",
        "healthScore": "Ikigereranyo cy’ubuzima",
      },

      "quickActions": {
        "bookAppointment": {
          "title": "Tegura Inama",
          "description": "Shyiraho igihe cyo gusura umuganga wawe"
        },
        "teleconsultation": {
          "title": "Inama y’Ubuvuzi ku Murongo",
          "description": "Vugana n’abaganga ukoresheje ikoranabuhanga"
        },
        "pharmacyOrders": {
          "title": "Gura Imiti",
          "description": "Tegura imiti ku mavuriro dufatanyije"
        },
        "emergencyRequest": {
          "title": "Saba Ubufasha bw’Byihutirwa",
          "description": "Saba ubufasha bw’ubuvuzi bwihuse"
        },
        "medicalHistory": {
          "title": "Amateka y’Ubuvuzi",
          "description": "Reba dosiye yawe y’ubuvuzi yose"
        },
        "aiHealthAssistant": {
          "title": "Umujyanama w’Ubuzima wa AI",
          "description": "Fata inama ku buzima bwawe unarebe ibimenyetso"
        }
      },

      "recentActivity": {
        "title": "Ibikorwa Bishya",
        "appointment": {
          "title": "Inama na Dr. Smith",
          "time": "Ejo saa munani z’amanywa"
        },
        "prescription": {
          "title": "Imiti yateguwe",
          "status": "Itegurwa kuvanwaho"
        }
      }
    }
  },
    "patient": {
    "menu": {
      "dashboard": "Ahabanza",
      "bookAppointment": "Tegura Igenzura",
      "teleconsultation": "Kuganira na Muganga Online",
      "pharmacyOrders": "Ibikoresho By’Ubuvuzi",
      "aiAssistant": "Umufasha wa AI",
      "emergency": "Ibyihutirwa",
      "history": "Amateka"
    },
    "header": {
      "panel": "Agace k'Umurwayi"
    },
    "user": {
      "role": "Umurwayi"
    }
  },
  "nav": {
    "logout": "Sohoka",
    "signin":"Injira"

  },
     "register": {
    "title": "Iyandikishe",
    "description": "Injira muri ONE HEALTHLINE CONNECT uyu munsi",
    "labels": {
      "fullName": "Amazina yose",
      "email": "Imeyili",
      "password": "Ijambobanga",
      "confirmPassword": "Emeza ijambobanga",
      "accountType": "Ubwoko bw'Konti"
    },
    "placeholders": {
      "fullName": "Andika amazina yawe yose",
      "email": "Andika imeyili yawe",
      "password": "Andika ijambobanga ryawe",
      "confirmPassword": "Emeza ijambobanga ryawe"
    },
    "roles": {
      "patient": "Umurwayi",
      "doctor": "Muganga",
      "admin": "Umuyobozi"
    },
    "buttons": {
      "createAccount": "Iyandikishe",
      "creatingAccount": "Turimo kwiyandikisha...",
      "signIn": "Injira"
    },
    "alreadyHaveAccount": "Ufite konti?",
    "errors": {
      "passwordMismatch": "Amafaranga y'ijambobanga ntahura",
      "passwordTooShort": "Ijambobanga rigomba kuba rifite nibura inyuguti 6",
      "registrationFailed": "Iyandikishirizwa ryananiranye. Ongera ugerageze."
    }
  },
    "loginForm": {
    "title": "Murakaza Neza",
    "description": "Injira muri konti yawe ya ONE HEALTHLINE CONNECT",
    "emailLabel": "Imeyili",
    "emailPlaceholder": "Andika aderesi imeyili yawe",
    "passwordLabel": "Ijambo ry'ibanga",
    "passwordPlaceholder": "Andika ijambo ry'ibanga ryawe",
    "signIn": "Injira",
    "signingIn": "Kwinjira...",
    "noAccount": "Nta konti ufite?",
    "signUp": "Iyandikishe",
    "errorFallback": "Kwinjira byanze. Gerageza kongera."
  },
    "contactCta": {
      "heading": "Guma uhuze na ONE HEALTHLINE CONNECT",
      "description": "Kuramo porogaramu yacu kugirango ubone serivisi zacu vuba, uganire n’ikipe yacu, kandi ucunge ubuzima bwawe aho uri hose.",
      "downloadApp": "Kuramo Porogaramu Yacu",
      "liveChat": "Ubufasha bwo Kuvugana Ako kanya",
      "callUs": "Tuhamagare Ubu",
      "socialFollow": "Dukurikire ku mbuga nkoranyambaga kugira ngo ubone amakuru, inama z’ubuzima, n’ibindi"
    },
    "social": {
      "facebook": "Facebook",
      "twitter": "Twitter",
      "instagram": "Instagram",
      "youtube": "YouTube"
    },
    "faq2": {
    "heading": "Ibibazo Bikunze Kubazwa",
    "description": "Shaka ibisubizo by’ibibazo bisanzwe bijyanye no kuvugana na ONE HEALTHLINE CONNECT",
    "items": [
      {
        "question": "Ni gute nagera kuri ONE HEALTHLINE CONNECT?",
        "answer": "Waduhamagara kuri telefoni (+250 788 123 456), ukatwandikira kuri email (info@healthlinerwanda.com), ukoresheje ifishi yo kuvugana kuri website yacu, cyangwa ukoresheje ubutumwa bwo muri porogaramu yacu ya telefoni. Mu bihe byihutirwa, ukoresha umurongo wihutirwa wa telefoni (+250 788 999 911) cyangwa 'Emergency Assistance' muri porogaramu."
      },
      {
        "question": "Nzahabwa igisubizo ryihuse ry’ikihe gihe?",
        "answer": "Ku bibazo bisanzwe binyuzwa kuri ifishi yo kuvugana cyangwa email, dushaka gusubiza mu masaha 24 mu minsi y'akazi. Ibitumanaho kuri telefoni bisubizwa ako kanya mu masaha y'akazi. Ku bibazo byihutirwa by’ubuvuzi, ukoresha umurongo wihutirwa ku buryo bwihuse."
      },
      {
        "question": "Nshobora kuza ku biro byanyu ntategetse gahunda?",
        "answer": "Yego, ushobora kuza ku biro byacu mu masaha y'akazi usaba ubufasha cyangwa gusobanukirwa na porogaramu yacu. Ariko, ku nama cyangwa ibiganiro byimbitse, turasaba ko utegura gahunda mbere kugirango abakozi babigenewe baboneke."
      },
      {
        "question": "Nakora nte ngo ntange ibitekerezo ku mikorere yanyu?",
        "answer": "Twishimira kwakira ibitekerezo byawe! Ushobora gutanga ibitekerezo ukoresheje ifishi yo kuvugana (hitamo 'Feedback' mu gice cy’akazi), ukatwandikira kuri email feedback@healthlinerwanda.com, cyangwa ukoresheje uburyo bwo gutanga ibitekerezo muri porogaramu yacu ya telefoni. Ibi bidufasha kunoza serivisi zacu."
      },
      {
        "question": "Nganira nde mu gihe mfite ibibazo bya tekinike kuri porogaramu?",
        "answer": "Ku bibazo bya tekinike muri porogaramu ya ONE HEALTHLINE CONNECT, hamagara itsinda ryacu rya tekinike kuri support@healthlinerwanda.com cyangwa +250 788 123 456 ukavamo guhitamo serivisi za tekinike. Ushobora kandi kohereza itike yo gusaba ubufasha ukoresheje ifishi yo kuvugana ukavamo 'Technical Support'."
      },
      {
        "question": "Nakora nte ngo menyeshe ikibazo cyihutirwa?",
        "answer": "Mu bihe by'amage yihutirwa, hamagara umurongo wacu wa telefoni 24/7 kuri +250 788 999 911 cyangwa ukoreshe 'Emergency Assistance' muri porogaramu ya ONE HEALTHLINE CONNECT. Itsinda ryacu rizakugira inama no kohereza ubufasha bwihuse."
      }
    ]
  },
  "contactLocations": {
    "heading": "Ahantu Hacu",
    "description": "Sura imwe mu nzu zacu kugira ngo ubone ubufasha bw’umwihariko ku bikorwa by’ubuvuzi",
    "viewOnMap": "Reba ku Ikarita",
    "locations": {
      "1": {
        "name": "Ibiro Bikuru bya ONE HEALTHLINE CONNECT",
        "address": "KG 123 St, Kigali, Rwanda",
        "phone": "+250 788 123 456"
      },
      "2": {
        "name": "Ishami rya Butaro",
        "address": "Hafi ya Butaro Hospital, Akarere ka Burera, Rwanda",
        "phone": "+250 788 234 567"
      },
      "3": {
        "name": "Ikigo cya Muhima",
        "address": "KN 2 Ave, Muhima, Kigali, Rwanda",
        "phone": "+250 788 345 678"
      }
    }
  },
    "contactInfo": {
    "heading": "Amakuru y'Itumanaho",
    "description": "Twandikire ukoresheje bumwe muri ubu buryo bwose kugira ngo ubone ubufasha ku bijyanye na serivisi zacu z'ubuvuzi",
    "cards": {
      "location": {
        "title": "Aho Turi",
        "details": ["KG 123 St, Kigali", "Rwanda"]
      },
      "phone": {
        "title": "Numero za Telefoni",
        "details": ["+250 788 123 456", "Icyihutirwa: +250 788 999 911"]
      },
      "email": {
        "title": "Aderesi za Email",
        "details": ["info@healthlinerwanda.com", "support@healthlinerwanda.com"]
      },
      "hours": {
        "title": "Amasaha yo Gukora",
        "details": ["Kuwa Mbere-Kuwa Gatanu: 8:00 AM - 8:00 PM", "Kuwa Gatandatu-Kuwa Mungu: 9:00 AM - 5:00 PM"],
        "footer": "* Serivisi z'ibanze zihari amasaha 24/7"
      }
    },
    "emergency": {
      "title": "Itumanaho ry’Ibyihutirwa",
      "desc": "Mu gihe cy'ibyihutirwa by'ubuvuzi, hamagara umurongo wacu wa 24/7 cyangwa ukoresheje uburyo bwo gufasha mu buryo bwihutirwa muri porogaramu ya ONE HEALTHLINE CONNECT.",
      "hotline": "Umurongo w’Ibyihutirwa: +250 788 999 911"
    }
  },
    "contactForm": {
    "heading": "Twandikire Ubutumwa",
    "description": "Sobanura ibikenewe hasi maze itsinda ryacu rigusubize vuba bishoboka",
    "labels": {
      "name": "Amazina Yuzuye",
      "email": "Imeli",
      "phone": "Numero ya Telefone",
      "department": "Ishami",
      "subject": "Ingingo",
      "message": "Ubutumwa",
      "privacy": "Nemera {privacyPolicy} no kwemera ko amakuru yanjye akoreshwa."
    },
    "placeholders": {
      "name": "Amazina yawe",
      "email": "Imeli yawe",
      "phone": "Numero ya telefone yawe",
      "subject": "Twabafasha dute?",
      "message": "Sobanura ibikenewe muri iki kibazo..."
    },
    "departments": {
      "general": "Ibibazo rusange",
      "appointments": "Gahunda z’inama",
      "billing": "Kwishyura & Ubwishingizi",
      "technical": "Ubufasha bwa tekiniki",
      "feedback": "Ibyifuzo"
    },
    "privacyPolicy": "Politiki y’Ubuzima Bwite",
    "privacyLink": "/privacy",
    "required": "*",
    "successTitle": "Ubutumwa bwoherejwe neza!",
    "successMessage": "Murakoze kutwandikira. Itsinda ryacu rizagusubiza bidatinze.",
    "sendMessage": "Ohereza Ubutumwa",
    "sending": "Kohereza..."
  },
  "contactHero": {
    "heading": "Twandikire tukurebereho {highlight}",
    "highlight": "Byihuse",
    "description": "Ufite ibibazo cyangwa ukeneye ubufasha? Itsinda ryacu rirahari kugufasha ku bibazo byose bijyanye na serivisi zacu z’ubuvuzi.",
    "badge1": "Ubufasha bwa 24/7 burahari",
    "badge2": "Imiyoboro myinshi yo kutugezaho",
    "overlayTitle": "Turi Hano Kugufasha",
    "overlayDesc": "Twandikire uko ubishaka",
    "badgeFloating1": "Ibisubizo Byihuse",
    "badgeFloating2": "Ubufasha Bunyamwuga"
  },
    "aboutCta": {
    "heading": "Duhuze Imbaraga mu Guhindura Ubuvuzi mu Rwanda",
    "description": "Niba uri umurwayi ushaka ubuvuzi, umujyanama w’ubuvuzi wifuza kugera kure, cyangwa umuryango ushaka gufatanya natwe, turagutumiye kuba igice cy’urugendo rwacu.",
    "downloadButton": "Kuramo Porogaramu yacu",
    "contactButton": "Twandikire"
  },
    "achievements": {
    "heading": "Ibikorwa n’Ibyagezweho",
    "subheading": "Urugendo rwacu rw’iterambere n’ingaruka mu buvuzi mu Rwanda",
    "milestonesTitle": "Urugendo rwacu",
    "awardsTitle": "Ibihembo n’Icyubahiro",
    "milestones": [
      {
        "year": "2023",
        "title": "Hashinzwe ONE HEALTHLINE CONNECT",
        "description": "Yatangijwe n’intego yo guhindura uburyo bwo kugera ku buvuzi mu Rwanda."
      },
      {
        "year": "2023",
        "title": "Ubufatanye bwa Mbere na Ibitaro",
        "description": "Twagiranye ubufatanye na Kigali University Hospital mu gutanga serivisi za teleconsultation."
      },
      {
        "year": "2024",
        "title": "Gushyira ku Isoko Porogaramu ya Telefone",
        "description": "Twasohoye porogaramu yacu ya mobile kuri iOS na Android."
      },
      {
        "year": "2024",
        "title": "Umufasha w’ubuzima wifashisha AI",
        "description": "Twazanye sisitemu yacu ikoreshwa na AI mu kugenzura ubuzima no gutanga inama."
      },
      {
        "year": "2024",
        "title": "Kwagura ku Bitaro 10",
        "description": "Twongereye umubare w’ibitaro bikorana natwe kugeza ku 10 mu Rwanda hose."
      },
      {
        "year": "2025",
        "title": "Abakoresha 5,000 Bagezweho",
        "description": "Twizihije kugera ku bakoresha 5,000 banditse ku rubuga rwacu."
      }
    ],
    "awards": [
      {
        "title": "Igihembo cy’Ikoranabuhanga mu Rwanda",
        "year": "2024",
        "description": "Twashimwe kubera uburyo bugezweho dukoresha mu gutanga serivisi z’ubuvuzi."
      },
      {
        "title": "Igisubizo Cyiza mu Buvuzi bw’Ikoranabuhanga",
        "year": "2024",
        "description": "Twahawe n’Ikigo cy’Igihugu cy’Ikoranabuhanga mu Itumanaho."
      },
      {
        "title": "Ikigo cy'Ubuvuzi Cyatangije Umushinga w'Umwaka",
        "year": "2024",
        "description": "Twahiriwe nka startup itangiza ubuvuzi y’indashyikirwa n’Ikinyamakuru cy’Ubucuruzi mu Rwanda."
      },
      {
        "title": "Igihembo cy’Ingaruka ku Muryango",
        "year": "2025",
        "description": "Twashimwe ku musanzu wacu mu kunoza uburyo bwo kugera ku buvuzi mu bice by'icyaro."
      }
    ]
  },
    "partners1": {
    "heading": "Abafatanyabikorwa bacu",
    "subheading": "Dukorana n’abatanga serivisi z’ubuvuzi n’imiryango itandukanye mu gutanga ubuvuzi bufite ireme"
  },
    "ourTeam": {
    "heading": "Itsinda ry’Abayobozi",
    "subheading": "Umenyere abahanga b’inzobere baharanira guhindura ubuvuzi muri ONE HEALTHLINE CONNECT",
    
    "roles": {
      "founder": "Umushinga n’Umuyobozi Mukuru",
      "cto": "Umuyobozi Mukuru wa Tekinoloji",
      "cmo": "Umuyobozi Mukuru w’Ubuvuzi"
    },
    
    "bios": {
      "charles": "Umuganga w’umutima ufite imyaka myinshi y'uburambe ({years}). Akunda gukoresha ikoranabuhanga mu kunoza serivisi z’ubuvuzi.",
      "urban": "Uwari injeniyeri muri Google ufite ubumenyi mu bwenge bw’ubukorano na porogaramu za telefone. Yayoboye iterambere ry’urubuga rwacu rw’ingenzi.",
      "willy": "Umuyobozi w’inyubako y’ubuvuzi ufite uburambe, ureberera ubufatanye bwacu n’abaganga kandi wita ku ireme rya serivisi."
    }
  },
 "coreValues": {
    "heading": "Indangagaciro zacu",
    "subtitle": "Amafaranga adushoboza gukora umurimo wacu no kuyobora uburyo dukora ubuvuzi",
    "compassion": {
      "title": "Impuhwe",
      "description": "Twegereza ubuvuzi dufite impuhwe no kumva neza, tumenya ko buri murwayi afite ibyo akeneye n’ibibazo bye."
    },
    "integrity": {
      "title": "Ubunyangamugayo",
      "description": "Dukora dushyira imbere amahame y’ubunyangamugayo muri byose, twita ku buzima bw’abakiriya bacu, umutekano wabo, n’ukuri mu makuru."
    },
    "inclusivity": {
      "title": "Kwishyira hamwe",
      "description": "Duharanira ko ubuvuzi bugera kuri buri Munyarwanda, aho yaba atuye hose, uko amerewe kose, cyangwa inkomoko ye."
    },
    "innovation": {
      "title": "Udushya",
      "description": "Duhora dushaka uburyo bushya kandi bwiza bwo gutanga serivisi z’ubuvuzi, dukoresheje ikoranabuhanga mu gukemura ibibazo."
    },
    "excellence": {
      "title": "Ubuhanga",
      "description": "Duharanira ubuhanga mu byo dukora byose, kuva ku rwego rw’urubuga rwacu kugeza ku murimo dutanga ku bakiriya bacu."
    },
    "community": {
      "title": "Umuryango",
      "description": "Twemera imbaraga z’umuryango kandi dukorana n’abatanga serivisi z’ubuvuzi mu gace kacu kugira ngo duteze imbere sisitemu y’ubuvuzi."
    }
  },
   "ourStory1": {
    "heading": "Inkuru yacu",
    "subheading": "Urugendo rwa ONE HEALTHLINE CONNECT kuva ku gitekerezo kugera ku rubuga nyamukuru rw'ubuvuzi mu Rwanda",
    "beginning": {
      "title": "Itangiriro",
      "text": "ONE HEALTHLINE CONNECT yavutse mu bunararibonye bw’umushinga wacu, Dr. Jean Mugabo, wabonye imbogamizi abaturage bo mu cyaro bahura nazo mu kubona ubuvuzi bufite ireme. Nyuma yo kubura umwe mu muryango we kubera gutinda kwa serivisi z’ubuvuzi, yiyemeje gushaka igisubizo cyafasha guhuza abarwayi n’abaganga."
    },
    "challenge": {
      "title": "Icyibazo",
      "text": "Mu Rwanda, abantu benshi baracyahura n’imbogamizi zo kubona serivisi z’ubuvuzi bitewe n’imiterere y’ahatuye, ubushobozi buke, n’ubuke bw’abaganga. Ibi cyane cyane ku batuye mu cyaro, bakenera kugenda intera ndende kugera ku kigo nderabuzima."
    },
    "solution": {
      "title": "Igisubizo",
      "text": "Dushingiye ku gukwirakwira kwa telefoni ngendanwa mu Rwanda, twakoze urubuga rwa digitale ruhuza abarwayi n’abaganga, rubemerera kugisha inama, kwiyandikisha, gutumiza imiti, no kubona ubufasha bwihutirwa — byose bakoresheje telefone zabo. Twanashyizeho ubwenge bw’ubukorano butanga ubujyanama bwihariye mu buzima."
    },
    "today": {
      "title": "Uyu munsi",
      "text": "Uyu munsi, ONE HEALTHLINE CONNECT itanga serivisi ku barwayi ibihumbi mu gihugu hose, ifatanya n’ibitaro, amavuriro, n’amafamasi akomeye, itanga serivisi z’ubuvuzi zifatika. Itsinda ryacu ryagutse rikubiyemo abaganga, abahanga mu ikoranabuhanga, n’abayobozi b’ubucuruzi, bose bafite intego imwe yo guteza imbere ubuvuzi mu Rwanda."
    },
    "images": {
      "foundingTeamAlt": "Itsinda ry’abashinze",
      "firstOfficeAlt": "Ibiro bya mbere",
      "earlyPrototypeAlt": "Icyitegererezo cya mbere",
      "currentTeamAlt": "Itsinda ririho ubu"
    }
  },
    "cta2": {
    "title": "Ukeneye Ubuvuzi Bwihariye?",
    "subtitle": "Hura n’inzobere zacu mu mashami atandukanye kugira ngo ugirwe inama no kuvurwa hakurikijwe ibyo ukeneye.",
    "book": "Teganya Gahunda n’Inzobere",
    "emergency": "Ubufasha bw’Ubutabazi",
    "notSure": "Ntizi neza ishami ukeneye?",
    "symptomChecker": "Gerageza isuzuma rya bimenyetso"
     },
    "faq1": {
    "title": "Ibibazo Bikunze Kubazwa",
    "subtitle": "Shakisha ibisubizo ku bibazo bikunze kubazwa ku mashami yacu n'inzobere",
    "q1": "Nigute menya ishami ngomba gusura?",
    "a1": "Niba utizeye ishami ukeneye, tangirira ku muganga rusange ushobora kugusuzuma akaguhitiramo inzobere ikwiye. Ushobora kandi gukoresha AI Health Assistant iri muri porogaramu yacu kugira ngo uguhuze n’ishami rikwiye hashingiwe ku bimenyetso byawe. Mu gihe cy'ibyago bikomeye, ukoreshe serivisi zacu z'ubutabazi.",
    "q2": "Nshobora gusaba muganga runaka mu ishami?",
    "a2": "Yego, ushobora gusaba muganga runaka igihe uteganya gahunda. Urubuga rwacu rukwemerera kureba inzobere ziri mu ishami, gusoma umwirondoro wabo, amanota bahawe, igihe baboneka, no guhitamo uwo ukunda. Ariko, igihe cyo kuboneka gishobora gutandukana bitewe n'imirimo yabo.",
    "q3": "Ni iki ngomba kuzana mu gihe mfite gahunda yo mu ishami?",
    "a3": "Mu gihe cya gahunda yawe, uzane indangamuntu yawe, amakuru ya ubwishingizi (niba ari ngombwa), urutonde rw’imiti urimo gufata, inyandiko zose z’ubuvuzi cyangwa ibisubizo by’ibipimo, ndetse n’urwandiko rw’ibibazo cyangwa impungenge wifuza kuganiraho. Ku nama za kure, menya ko ufite interineti yihuta kandi ahantu hatuje kandi hihariye.",
    "q4": "Gahunda isanzwe yo kubonana n'inzobere imara igihe kingana iki?",
    "a4": "Igihe gitandukanye bitewe n’ishami n’impamvu y'urugendo rwawe. Guhura bwa mbere bimara iminota 30-45, naho gahunda zo gukurikiraho zimara iminota 15-30. Ibibazo bigoye bishobora gufata igihe kirekire. Igihe giteganyijwe kizerekanwa igihe uteganya gahunda yawe.",
    "q5": "Nshobora kubona igitekerezo cya kabiri ku nzobere imwe mu ishami rimwe?",
    "a5": "Yego, dushyigikira abarwayi gushaka ibitekerezo bya kabiri igihe babona ari ngombwa. Ushobora guteganya gahunda n’indi nzobere mu ishami rimwe ukoresheje urubuga rwacu. Inyandiko zawe z’ubuvuzi zishobora gusangirwa hagati y’abatanga serivisi niba ubihaye uburenganzira.",
    "q6": "Ese amashami yose atanga serivisi zo kuganira kuri interineti?",
    "a6": "Amashami menshi atanga uburyo bwo kuganira kuri interineti, ariko zimwe mu ndwara zisaba kujya ku ivuriro kugira ngo zibone ibisubizo nyabyo. Igihe uteganya gahunda, uzabona ubwoko bw’ibiganiro buboneka kuri buri shami n'inzobere. Amwe mu mashami ashobora gutangira ibiganiro kuri interineti, hanyuma ugakomeza kuganira mu buryo bwo guhura imbona nkubone niba ari ngombwa."
  },
    "conditions": {
    "title": "Indwara Duvura",
    "subtitle": "Amashami yacu afite ubushobozi bwo gusuzuma no kuvura indwara zitandukanye",
    "viewMore": "Reba Byinshi",
    "cardiology": {
      "title": "Indwara z'Umutima",
      "hypertension": "Umuvuduko w'amaraso uri hejuru",
      "coronaryArteryDisease": "Indwara y'imitsi y'umutima",
      "heartFailure": "Kunanirwa k'umutima",
      "arrhythmias": "Kudakubitana k'umutima neza",
      "valvularHeartDisease": "Indwara z'udufunguzo tw'umutima"
    },
    "neurology": {
      "title": "Indwara z'Ubuyoborantimba",
      "stroke": "Guhagarara k'ubwonko",
      "epilepsy": "Igituntu cy’ubwonko (Epilepsie)",
      "parkinsons": "Indwara ya Parkinson",
      "multipleSclerosis": "Multiple Sclerosis",
      "migraine": "Uburibwe bw'umutwe bukabije"
    },
    "orthopedics": {
      "title": "Indwara z'Imikaya n'Amagufa",
      "arthritis": "Kubabara imitsi y'amagufa (Arthritis)",
      "fractures": "Kuvunika",
      "jointPain": "Kubabara mu ngingo",
      "osteoporosis": "Kunanuka kw'amagufa",
      "sportsInjuries": "Ibikomere by'imikino"
    },
    "dermatology": {
      "title": "Indwara z'uruhu",
      "eczema": "Uruhu rukakaye (Eczema)",
      "psoriasis": "Psoriasis",
      "acne": "Uruhu rufite uduheri (Acne)",
      "skinCancer": "Kanseri y'uruhu",
      "fungalInfections": "Indwara ziterwa n'ububore"
    },
    "gastroenterology": {
      "title": "Indwara z'Igifu n'Amara",
      "gerd": "Indwara y'inyuma y'igifu (GERD)",
      "ibs": "Indwara y'amara (IBS)",
      "ulcerativeColitis": "Ulcerative Colitis",
      "crohnsDisease": "Indwara ya Crohn",
      "hepatitis": "Hepatite"
    },
    "endocrinology": {
      "title": "Indwara z'Ubwirinzi bw'Umubiri",
      "diabetes": "Diyabete",
      "thyroidDisorders": "Indwara za thyroid",
      "hormonalImbalances": "Kutangana k'imisemburo",
      "osteoporosis": "Kunanuka kw'amagufa",
      "adrenalDisorders": "Indwara z'utunyama twa adrenal"
    },
    "pulmonology": {
      "title": "Indwara z'Imyanya y'Ubuhumekero",
      "asthma": "Astitima",
      "copd": "Indwara y'ubuhumekero idakira (COPD)",
      "pneumonia": "Inzoka y'ubuhumekero (Pneumonia)",
      "tuberculosis": "Igituntu",
      "sleepApnea": "Guhagarara guhumeka mu gihe cyo gusinzira"
    },
    "gynecology": {
      "title": "Indwara z'Abagore",
      "menstrualDisorders": "Ibibazo byo mu mihango",
      "endometriosis": "Endometriosis",
      "pcos": "PCOS",
      "fibroids": "Fibroids",
      "infertility": "Kutabyara"
    }
  },
    "departments1": {
    "featured_title": "Ibice Byihariye",
    "featured_description": "Sura ibice byacu by’ubuvuzi bikunzwe cyane, bitanga ubuvuzi bw’umwihariko butangwa n’abaganga babimenyereye",
    "specialists_available": "Abahanga {{count}} baboneka",
    "learn_more": "Menya byinshi",
    "departments_list": {
      "cardiology": {
        "name": "Cardiology",
        "description": "Ishami rya Cardiology ritanga ubuvuzi bwuzuye ku ndwara z’umutima n’imiyoboro y’amaraso. Kuva ku bipimo by’ubuvuzi kugeza ku buvuzi buhanitse, abaganga bacu b’umutima bashobora gufasha byose kuva ku bipimo bisanzwe kugeza ku ndwara zikomeye z’umutima.",
        "services": [
          "Echocardiography",
          "ECG",
          "Ikizamini cy’umutima ku kazi",
          "Gucunga indwara z’umutima",
          "Kwita ku gitutu cy’amaraso"
        ]
      },
      "neurology": {
        "name": "Neurology",
        "description": "Ishami rya Neurology rihugukira indwara z’ubwonko, umusaya w’inyuma n’imitsi. Abaganga bacu bakoresha ibikoresho by’ubuvuzi buhanitse mu kuvura indwara zitandukanye kuva ku mutwe kugeza ku ndwara zikomeye z’ubwonko.",
        "services": [
          "Ikizamini cya EEG",
          "Isuzuma ry’ubwonko",
          "Gucunga umutwe",
          "Kwita ku gukomereka k’ubwonko",
          "Kuvura indwara z’imitsi"
        ]
      },
      "pediatrics": {
        "name": "Pediatrics",
        "description": "Ishami rya Pediatrics rihatira ubuzima bw’abana kuva bavutse kugeza bakuze. Abaganga b’abana batanga ubuvuzi bwo kubarinda indwara, kuvura indwara z’abana, no gukurikirana iterambere ryabo kugira ngo bakure neza.",
        "services": [
          "Gusura kwa muganga kwa buri mwana",
          "Inkingo",
          "Gukurikirana ubuzima bw’umwana",
          "Isuzuma ry’iterambere",
          "Kugisha inama abaganga b’abana"
        ]
      }
    }
  },
    services: {
      title: "Serivisi",
      subtitle: "Telefone",
      teleconsultation: {
        desc: "Ganira n’abaganga ukoresheje serivisi yacu yo kuvugana kure (teleconsultation).",
      },
      learnMore: "Menya byinshi",
      appointments: {
        desc: "Teganya gahunda z’ibiganiro n’abaganga byoroshye.",
      },
      emergency: {
        desc: "Shaka ubufasha bw’ubutabazi bwihuse igihe cyose ubukeneye.",
      },
      pharmacy: {
        desc: "Tuma imiti ukoresheje serivisi zacu za farumasi.",
      },
      ai: {
        badge: "Menya Umufasha wawe w’Ubuzima wa AI",
        desc: "AI yacu igufasha gukurikirana ubuzima, imigenzereze, imiti, n’ibimenyetso by’indwara.",
        features: {
          monitoring: "Gukurikirana Ubuzima",
          lifestyle: "Inama z’Imigenzereze",
          medication: "Kwibutsa Imiti",
          symptom: "Kureba Ibimenyetso by’Indwara",
        },
        cta: "Menya Umufasha wa AI",
      },
    },

    
    missionVision: {
      mission: {
        title: "Inshingano Zacu",
        description:
          "Guhindura uburyo bwo gutanga serivisi z’ubuvuzi mu Rwanda binyuze mu gutanga serivisi zoroshye, zihendutse kandi zifite ireme hifashishijwe ikoranabuhanga rigezweho. Intego yacu ni uguhuza abarwayi n’abatanga serivisi z’ubuvuzi mu buryo bworoshye, tukemeza ko buri Munyarwanda abona ubuvuzi akeneye igihe abukeneye."
      },
      vision: {
        title: "Icyerekezo Cyacu",
        description:
          "Kuba urubuga rw’ibanze rw’ikoranabuhanga mu buvuzi mu Rwanda no muri Afurika y’Uburasirazuba, duhanga sisitemu y’ubuvuzi aho ikoranabuhanga ryambuka icyuho hagati y’abarwayi n’abatanga serivisi z’ubuvuzi. Dufite icyizere cy’ahazaza aho buri Munyarwanda, atitaye ku gahenge ke cyangwa uko ahagaze mu bukungu, azagira uburenganzira bungana bwo kubona serivisi z’ubuvuzi zifite ireme."
      }
    },
     about: {
      title1: "Ibyerekeye",
      highlight: "HEALTHLINE",
      title2: "RWANDA",
      subtitle: "Guhindura uburyo bwo kugera ku buvuzi mu Rwanda binyuze mu ikoranabuhanga rigezweho",
      imageAlt: "Itsinda rya ONE HEALTHLINE CONNECT",
      bottomTitle: "Guhuza inzira mu kugera ku buvuzi",
      bottomDescription: "Yashinzwe mu mwaka wa 2025, ONE HEALTHLINE CONNECT yiyemeje korohereza Abanyarwanda bose kubona ubuvuzi bufite ireme binyuze mu ikoranabuhanga no guhanga udushya.",
    },
    "departmentss": {
    "title": "Ishami ryacu ry'ubuvuzi",
    "subtitle": "ONE HEALTHLINE CONNECT iguha uburyo bwo kugera ku byiciro bitandukanye by’ubuvuzi kugira ngo uhabwe serivisi zose ukeneye",
    "cardiology": {
      "name": "Ubuganga bw’umutima",
      "description": "Isuzuma n’ivuriro ry’indwara z’umutima n’ubundi burwayi bwa sisitemu y’amaraso"
    },
    "pediatrics": {
      "name": "Ubuvuzi bw’abana",
      "description": "Ubuvuzi bw’abana b’incuke, abato n’ingimbi"
    },
    "orthopedics": {
      "name": "Ubuvuzi bw’amagufwa",
      "description": "Kuvura indwara z’amagufwa, ingingo n’imikaya"
    },
    "neurology": {
      "name": "Ubuvuzi bw’ubwonko",
      "description": "Isuzuma n’ivuriro ry’indwara z’ubwonko na sisitemu y’imyakura"
    },
    "dermatology": {
      "name": "Ubuvuzi bw’uruhu",
      "description": "Kwita ku ndwara z’uruhu, imisatsi n’inzara"
    },
    "ophthalmology": {
      "name": "Ubuvuzi bw’amaso",
      "description": "Isuzuma n’ivuriro ry’indwara z’amaso n’ibibazo byo kubona"
    },
    "ent": {
      "name": "Ubuvuzi bw’amatwi, izuru n’umuhogo",
      "description": "Kuvura indwara z’amatwi, izuru, umunwa, umutwe n’ijosi"
    },
    "gynecology": {
      "name": "Ubuvuzi bw’abagore",
      "description": "Ubuzima bw’imyororokere y’abagore n’ivuriro ry’ababyeyi batwite"
    },
    "urology": {
      "name": "Ubuvuzi bw’imyanya y’inkari",
      "description": "Isuzuma n’ivuriro ry’indwara z’imyanya y’inkari n’imyororokere y’abagabo"
    },
    "psychiatry": {
      "name": "Ubuvuzi bw’indwara zo mu mutwe",
      "description": "Kwita ku buzima bwo mu mutwe, harimo inama n’imiti"
    },
    "dentistry": {
      "name": "Ubuvuzi bw’amenyo",
      "description": "Kwita ku buzima bw’amenyo, isuku n’ivuriro"
    },
    "nutrition": {
      "name": "Ibijyanye n’imirire",
      "description": "Inama n’ubuvuzi bushingiye ku mirire ku ndwara zitandukanye"
    }
  },
    "medicalDepartments": {
    "title": "Ibitaro bya",
    "highlight": "Ubuvuzi",
    "subtitle": "n'Ubuhanga",
    "description": "Fungura serivisi z’ubuvuzi bwihariye mu mashami atandukanye y’ubuvuzi hamwe n’abaganga b’icyitegererezo mu Rwanda.",
    "searchPlaceholder": "Shakisha ishami cyangwa indwara...",
    "departments": {
      "cardiology": "Ishami ry’imitima",
      "pediatrics": "Ishami ry’abana",
      "orthopedics": "Ishami ry’imikaya n’amagufa",
      "neurology": "Ishami ry’ubwonko"
    },
    "imageAlt": "Ibitaro by'Ubuvuzi",
    "specializedCareTitle": "Serivisi z’Ubufasha bwihariye",
    "departmentsCount": "Amashami 12+ y’ubuvuzi aboneka",
    "badges": {
      "expertSpecialists": "Abahanga B’inzobere",
      "advancedTreatments": "Ubufasha bugezweho"
    }
  },
    "faq": {
    "title": "Ibibazo Bikunze Kubazwa",
    "subtitle": "Shakisha ibisubizo by’ibibazo bisanzwe ku bijyanye na serivisi zacu. Niba udabona ikibazo cyawe hano, twandikire.",
    "teleconsultation": {
      "question": "Nigute nakwiyandikisha mu kugisha inama hifashishijwe ikoranabuhanga?",
      "answer": "Kugira ngo wiyandikishe mu kugisha inama hifashishijwe ikoranabuhanga, shira porogaramu ya ONE HEALTHLINE CONNECT, wiyandikishe, hanyuma ujye mu gice cya Teleconsultation. Hitamo inzobere wifuza, uhitemo igihe gihari, hanyuma wemeze gahunda. Uzahabwa ubutumwa bwo kwemeza ndetse n'ubutumwa bwo kwibutsa mbere y’inama yawe."
    },
    "specialists": {
      "question": "Ni ubuhe bwoko bw’inzobere buboneka kuri uru rubuga?",
      "answer": "ONE HEALTHLINE CONNECT ifatanya n’inzobere zitandukanye zirimo abaganga rusange, abaganga b’abana, abaganga b’umutima, abaganga b’uruhu, abaganga b’imitekerereze, abaganga b’imirire, n’izindi. Ubwinshi bw’inzobere bushobora gutandukana bitewe n’aho uherereye n’igihe cy’umunsi."
    },
    "emergency": {
      "question": "Serivisi y’ihutirwa ikora ite?",
      "answer": "Mu gihe cy’ibyihutirwa, fungura porogaramu ya ONE HEALTHLINE CONNECT hanyuma ukande kuri buto ya Emergency. Uzahuzwa n’ikipe yacu yihutirwa izasuzuma ikibazo cyawe kandi ikwohereze ubufasha bukwiriye. Porogaramu inatanga amakuru y’aho uri hakoreshejwe GPS kugira ngo ubufasha bugereho vuba."
    },
    "prescriptionOrder": {
      "question": "Ese nshobora gutumiza imiti yanditswe na muganga binyuze muri porogaramu?",
      "answer": "Yego, ushobora gutumiza imiti yanditswe na muganga binyuze muri porogaramu. Nyuma y’inama, muganga wawe ashobora kohereza icyemezo cy’imiti ku mabitaro dufatanyije. Cyangwa nanone, ushobora gushyira ifoto y’icyemezo cyawe muri porogaramu. Hitamo farumasi wifuza, reba ibyo wasabye, hanyuma uhitemo koherezwa cyangwa kuza kubikura."
    },
    "aiAssistantAccuracy": {
      "question": "Umufasha mu buzima wa AI ni uwuhe mu kuri?",
      "answer": "Umufasha wacu wa AI mu buzima ugenewe gutanga amakuru rusange n’inama bishingiye ku makuru utanze. Nubwo ukoresha uburyo buhanitse bwo gusesengura ibimenyetso n’amakuru y’ubuzima, ntabwo usimbura inama z’umuganga. Buri gihe ganira n’umuganga ku byo uvurwa."
    },
    "dataSecurity": {
      "question": "Amakuru yanjye y’ubuzima arinzwe kuri uru rubuga?",
      "answer": "Yego, turakingira amakuru y’ubuzima bwawe. Amakuru yose arakingirwa kandi abitswe mu buryo butekanye hakurikijwe amategeko arengera amakuru. Ntituzasangiza abandi makuru yawe atabiherewe uburenganzira, keretse igihe amategeko abisaba cyangwa mu bihe by'ibyihutirwa."
    }
  },
    "pricing": {
    "title": "Ibiciro Byumvikana kandi Bifunguye",
    "subtitle": "Hitamo gahunda ikwiranye n'ibyo ukeneye mu buvuzi. Gahunda zose zirimo serivisi shingiro zacu.",
    "mostPopular": "Ikoreshwa cyane",
    "ctaBusiness": "Vugana n'Ishami ry'Ubucuruzi",
    "ctaDefault": "Tangira",
    "note": "Gahunda zose zirimo uburyo bwo gukoresha porogaramu ya telefoni n'urubuga. Ibiciro byerekanwe biri mu mafaranga y'u Rwanda (RWF). Ku bijyanye na gahunda z'ibigo, nyamuneka vugana n'itsinda ryacu ry'ubucuruzi kugira ngo tubagezeho igiciro gikwiye.",

    "plans": {
      "basic": {
        "name": "Isanzwe",
        "price": "Ubuntu",
        "description": "Serivisi z'ubuvuzi z'ibanze ku bantu ku giti cyabo",
        "features": [
          "Guhanahana amakuru n'abaganga rusange hakoreshejwe ikoranabuhanga",
          "Kubika gahunda y'ubuvuzi y'ibanze",
          "Ubufasha mu gihe cy'ibibazo by'ubuzima",
          "Gutanga imiti (harimo amafaranga yo kuyigeza aho uri)",
          "Imikorere mike ya AI mu buvuzi"
        ]
      },
      "premium": {
        "name": "Yisumbuye",
        "price": "5,000 RWF",
        "period": "buri kwezi",
        "description": "Serivisi z'ubuvuzi zigezweho ku bantu ku giti cyabo n'imiryango",
        "features": [
          "Guhanahana amakuru ukoresheje ikoranabuhanga n'abaganga bose b'inzobere uko ubyifuza",
          "Kuba uwa mbere mu gushyirirwaho gahunda",
          "Ubufasha mu gihe cy'ibibazo by'ubuzima mu buryo bwihuse",
          "Gutanga imiti ku buntu",
          "Imikorere yuzuye ya AI mu buvuzi",
          "Konti z'umuryango (ku bantu kugeza kuri 4)",
          "Kubika no gusangira dosiye z'ubuzima"
        ]
      },
      "business": {
        "name": "Ibigo",
        "price": "Ibiganiro byihariye",
        "description": "Ibisubizo by'ubuvuzi ku bigo n'imiryango y'ubucuruzi",
        "features": [
          "Gahunda z'ubuvuzi zihariye ku bakozi",
          "Umuyobozi wihariye ku bigo",
          "Gahunda yo guha gahunda abantu benshi icyarimwe",
          "Ikibaho cyo gukurikirana ubuzima bw'abakozi",
          "Porogaramu z'ubuzima ku bigo",
          "Guhuza n'inyungu z'ubuvuzi zisanzwe"
        ]
      }
    }
  },
      "howItWorks": {
    "title": "Uburyo Bikora",
    "subtitle": "Uburyo bworoshye mu byiciro 4 byo gutangira",

    "step1": {
      "title": "Iyandikishe",
      "description": "Fungura konti y'ubuntu mu minota mike gusa."
    },

    "step2": {
      "title": "Tanga Amakuru Yawe",
      "description": "Uzuza amakuru yawe bwite n'ay'ubuvuzi mu buryo bwizewe."
    },

    "step3": {
      "title": "Hitamo Serivisi",
      "description": "Hitamo serivisi y'ubuvuzi ijyanye n'ibyo ukeneye."
    },

    "step4": {
      "title": "Tangira Kwifashishwa",
      "description": "Tangirira ako kanya kuganira n'umuganga cyangwa kwakira serivisi."
    }
  },
    "aiDoctor": {
    "label": "Umufasha mu Buzima wa AI",
    "title": "Umunshuti wawe w'ubuzima ukoresheje AI",
    "description": "Umufasha wacu mu buzima ukoresheje AI aguha uburyo bwo kugenzura ubuzima bwawe, inama, n’ubuyobozi bishingiye ku makuru y’ubuzima bwawe n’ibibazo byawe. Ni nko kugira umukozi w’ubuzima mu mufuka wawe, uhora ahari amasaha 24/7 kugira ngo agusubize no kuguha ubufasha mu rugendo rwawe rw’ubuzima.",
    "features": {
      "personalizedMonitoring": "Uburyo bwo kugenzura ubuzima bwawe bwihariye",
      "aiSymptomAssessment": "Isuzuma ry'ibimenyetso ukoresheje AI",
      "wellnessRecommendations": "Inama z’imibereho myiza",
      "medicationReminders": "Ibukiranya byo gufata imiti no kugenzura",
      "healthDataAnalysis": "Isesengura ry’amakuru y’ubuzima",
      "integrationWithServices": "Guhuza neza n’izindi serivisi za HEALTHLINE"
    },
    "capabilitiesTitle": "Ubumenyi bw’Umufasha wa AI",
    "capabilities": {
      "generalInquiries": "Ibibazo rusange ku buzima",
      "chronicManagement": "Gucunga indwara zidakira",
      "nutritionAdvice": "Inama ku mirire n'ibiribwa",
      "mentalHealthSupport": "Ubufasha mu buzima bwo mu mutwe",
      "sleepImprovement": "Inama zo kunoza ibijyanye no gusinzira",
      "physicalActivity": "Inama ku myitozo ngororamubiri"
    },
    "tryAssistant": "Gerageza Umufasha wa AI",
    "learnMore": "Menya byinshi",
    "imageAlt": "Umufasha mu buzima wa AI",
    "overlay": {
      "healthMonitoringTitle": "Kugenzura ubuzima",
      "healthMonitoringDesc": "Kugenzura ibimenyetso n’imyitwarire",
      "personalizedPlansTitle": "Gahunda zihariye",
      "personalizedPlansDesc": "Inama z'ubuzima zigenewe wowe",
      "assistanceTitle": "Ubufasha 24/7",
      "assistanceDesc": "Buri gihe ahari kugufasha"
    }
  },
    "pharmacy": {
    "label": "Serivisi za Farumasi",
    "title": "Tegeka imiti muri farumasi zifatanyije",
    "description": "Serivisi yacu ya farumasi igufasha gutumiza imiti yandikiwe na muganga n'itarandikwa mu mafarumasi y’igihugu hose...",
    "features": {
      "order": "Teka imiti mu mafarumasi yifatanyije",
      "upload": "Ohereza ordonnance muri app",
      "compare": "Geranya ibiciro by’imiti mu mafarumasi",
      "delivery": "Gutwara imiti ku rugo biraboneka",
      "reminders": "Ibuka gufata imiti yawe",
      "refill": "Kumenyeshwa igihe cyo kongera guhabwa imiti"
    },
    "partners": {
      "title": "Afarumasi dukorana",
      "kigali": "Farumasi ya Kigali",
      "rwanda": "Rwanda Pharmaceuticals",
      "kimironko": "Farumasi ya Kimironko",
      "nyamirambo": "Farumasi y'Ikigo Nderabuzima cya Nyamirambo",
      "remera": "Farumasi ya Remera",
      "muhima": "Farumasi y'Ibitaro bya Muhima"
    },
    "overlay": {
      "delivery": {
        "title": "Kugeza ku rugo",
        "subtitle": "Mu masaha 3 muri Kigali"
      },
      "reminders": {
        "title": "Ibuka gufata imiti",
        "subtitle": "Ntuzigere uyibagirwa"
      },
      "payment": {
        "title": "Uburyo bwinshi bwo kwishyura",
        "subtitle": "Mobile money, amakarita, amafaranga"
      }
    },
    "imageAlt": "Serivisi za farumasi",
    "buttons": {
      "order": "Tegeka imiti",
      "view": "Reba amafarumasi"
    }
  },
    "emergency": {
    "label": "Serivisi z'Amahutwa",
    "title": "Ubufasha bwihuse mu gihe buri munota ari ingenzi",
    "description": "Serivisi zacu z'ubutabazi zitanga ubufasha bwihuse mu bihe by'amage...",
    "features": {
      "24_7_hotline": "Ubufasha bw'amasaha 24/7 ku murongo",
      "ambulance_dispatch": "Kohereza Ambulance",
      "gps_tracking": "Gukurikirana aho uri ukoresheje GPS",
      "direct_er_connection": "Kwihuza n'ibyumba by'ubutabazi",
      "first_aid_guidance": "Inama z'ubutabazi bwa mbere kuri telefone",
      "contact_notification": "Kumenyesha abantu ba hafi"
    },
    "types_label": "Ubwoko bw'ibibazo dukemura",
    "types": {
      "medical": "Ibibazo by'ubuvuzi",
      "accidents": "Impanuka n'ibikomere",
      "cardiac": "Indwara z'umutima",
      "respiratory": "Ibibazo byo guhumeka",
      "allergic": "Allergie zikomeye",
      "pregnancy": "Ibibazo byo mu gihe cyo gutwita"
    },
    "cta_assistance": "Ubufasha bw'Amahutwa",
    "cta_learn_more": "Menya Ibindi",
    "image_alt": "Serivisi z'Amahutwa",
    "overlay": {
      "ambulance_title": "Kohereza Ambulance",
      "ambulance_sub": "Igihe gisanzwe cyo kugera: iminota 15",
      "medical_guidance_title": "Inama z'ubuvuzi",
      "medical_guidance_sub": "Amabwiriza y'ubutabazi bwa mbere",
      "gps_title": "Gukurikirana GPS",
      "gps_sub": "Kumenya aho uri neza"
    }
  },
     "appointment": {
    "tag": "Gufata Rendez-vous",
    "title": "Teganya Rendez-vous n'Abatanga Serivisi z'Ubuzima Bakomeye",
    "description": "Serivisi yacu yo gufata rendez-vous igufasha kubona igihe cyo gusura abatanga serivisi z’ubuzima igihe cyose ubishaka. Waba ukeneye isuzuma rusange cyangwa kugisha inama inzobere, urubuga rwacu rugufasha kubona no gufata igihe cya muganga bigufashe.",
    "features": [
      "Fata rendez-vous n'inzobere mu Rwanda hose",
      "Hitamo hagati yo kujya kwa muganga cyangwa gukoresha uburyo bwo kuri interineti",
      "Bona ibikumbusho bya rendez-vous ukoresheje SMS na email",
      "Hindura cyangwa usibe rendez-vous byoroshye",
      "Reba igihe cya muganga mu buryo bw’ako kanya",
      "Geraho amateka ya rendez-vous yawe"
    ],
    "partnerHospitalsTitle": "Amavuriro Dukorana",
    "hospitals": [
      "Ibitaro bya Kaminuza ya Kigali",
      "Ibitaro bya Gisirikare bya Rwanda",
      "Ibitaro bya King Faisal",
      "Ibitaro bya Butaro",
      "Ibitaro bya Kibagabaga",
      "CHUK"
    ],
    "buttons": {
      "book": "Fata Rendez-vous",
      "viewSpecialties": "Reba Ibyiciro by’Ubuvuzi"
    },
    "cards": {
      "availability": {
        "title": "Igihe gihari ako kanya",
        "subtitle": "Reba amasaha ahari instantly"
      },
      "location": {
        "title": "Amahitamo y'Aho gukorera",
        "subtitle": "Mu maso cyangwa kuri interineti"
      },
      "facilities": {
        "title": "Amavuriro Menshi",
        "subtitle": "Ibitaro mu gihugu hose"
      }
    }
  },
    "cta.subtitle":"Serivisi z'ubuvuzi bugezweho mu Rwanda",
    "nav.home": "Ahabanza",
    "hero": {
    "label": "Serivisi yo Kwivuza Hifashishijwe Ikoranabuhanga",
    "title": "Hura n’Abaganga b’Inzobere Utavuye mu Rugo",
    "subtitle": "Serivisi yacu iguhuza n’abaganga b’inzobere baturuka mu bitaro bitandukanye byo mu Rwanda."
  },
  "features": {
    "consultations": "Inama n’inzobere zivuye mu bitaro bitandukanye",
    "high_quality_video": "Amashusho n’amajwi byiza cyane",
    "secure_messaging": "Ubutumwa bwizewe hagati yawe n’umuganga",
    "digital_prescriptions": "Ibyo muganga yanditse mu buryo bwa mudasobwa",
    "medical_records": "Kureba no gusangira dosiye y’ubuvuzi",
    "followup_scheduling": "Gutegeka igihe cyo kongera kuganira n’umuganga"
  },
  "steps": {
    "title": "Uburyo Serivisi yo Kwivuza Hifashishijwe Ikoranabuhanga Ikora",
    "select_hospital": "Hitamo Ibitaro/Kwa muganga",
    "select_hospital_desc": "Hitamo mu bafatanyabikorwa bacu",
    "choose_type": "Hitamo Ubwoko bw’Inama",
    "choose_type_desc": "Inama rusange cyangwa iy’inzobere",
    "select_insurance": "Hitamo Ubwishingizi",
    "select_insurance_desc": "Hitamo uburyo bwo kwishyura",
    "register_details": "Andika Ibisobanuro by’Umurwayi",
    "register_details_desc": "Injiza amakuru yawe",
    "pay_fee": "Ishyura Amafaranga y’Inama",
    "pay_fee_desc": "Koresha Banki cyangwa USSD",
    "attend_consultation": "Jya mu Nama yawe",
    "attend_consultation_desc": "Hifashishijwe amashusho cyangwa telefone",
    "receive_followup": "Yakira Igikorwa gikurikira",
    "receive_followup_desc": "Ibyo muganga yanditse n’inama zikurikira",
    "review_history": "Reba Amateka y’Ubuvuzi",
    "review_history_desc": "Reba dosiye yawe y’ubuvuzi"
  },
  "specialties": {
    "title": "Ubwoko bw’Ubuvuzi Buhari",
    "general_medicine": "Ubuvuzi rusange",
    "pediatrics": "Ubuvuzi bw’Abana",
    "cardiology": "Ubuvuzi bw’Umutima",
    "dermatology": "Ubuvuzi bw’Uruhu",
    "psychiatry": "Ubuvuzi bwo mu mutwe",
    "nutrition": "Ubuvuzi bwo kugaburira"
  },
  "availability": {
    "by_appointment": "Binyuze mu gutumiza"
  },
  "buttons": {
    "start_consultation": "Tangira Inama",
    "view_records": "Reba Dosiye y’Ubuvuzi"
  },
  "partners": {
    "title": "Ibitaro n’Abafatanyabikorwa Bacu"
  },
  "cta1": {
    "title": "Witeguye Gutangira Inama?",
    "subtitle": "Ujye mu mubare w’Abanyarwanda ibihumbi bakoresha ubuvuzi bwo mu rugo",
    "button": "Bukisha Inama Ubu",
    "book":"gushyiraho",
    "emergency": "Ibyihutirwa",
    "notSure":"ntago witeguye",
    "symptomChecker":"kureba ibimenyetso"
  },
    'nav.home': 'Ahabanza',
    'nav.services': 'Serivisi',
    'nav.departments': 'Amashami',
    'nav.about': 'Ibyerekeye',
    'nav.contact': 'Kuvugana',
    'nav.signin': 'Kwinjira',
    'nav.logout': 'Gusohoka',
    'nav.findDoctor': 'Shakisha Muganga',
    'nav.bookAppointment': 'Gena Agenda',
    'nav.healthBlog': 'Blog y\'Ubuzima',
    'nav.ourServices': 'Serivisi Zacu',
    'nav.teleconsultation': 'Teleconsultation',
    'nav.appointments': 'Amagena',
    'nav.emergency': 'Ibyihutirwa',
    'nav.pharmacy': 'Farumasi',
    'nav.aiAssistant': 'Umufasha wa AI w\'Ubuzima',

    // How It Works
    'howItWorks.title': 'Uko Bikora',
    'howItWorks.subtitle': 'Gutangira ONE HEALTHLINE CONNECT byoroshye. Kurikira intambwe zoroshye kugirango ubonere serivisi z\'ubuvuzi.',
    'howItWorks.step1.title': 'Gukuramo Porogaramu',
    'howItWorks.step1.description': 'Gukuramo porogaramu ya ONE HEALTHLINE CONNECT muri App Store cyangwa Google Play Store.',
    'howItWorks.step2.title': 'Gukora Konti',
    'howItWorks.step2.description': 'Kwiyandikisha ukoresheje nimero ya telefoni cyangwa imeli hanyuma uzuza umwirondoro w\'ubuzima.',
    'howItWorks.step3.title': 'Guhitamo Serivisi',
    'howItWorks.step3.description': 'Hitamo serivisi y\'ubuvuzi ukeneye mu byiciro byose tutanga.',
    'howItWorks.step4.title': 'Guhuza n\'Abatanga Serivisi',
    'howItWorks.step4.description': 'Guhuza n\'abatanga serivisi z\'ubuvuzi, gena amagena, cyangwa kubona serivisi z\'ibyihutirwa.',

    // Common
    'common.loading': 'Gukuramo...',
    'common.error': 'Ikosa',
    'common.success': 'Byakunze',
    'common.cancel': 'Kuraguza',
    'common.save': 'Kubika',
    'common.edit': 'Guhindura',
    'common.delete': 'Gusiba',
    'common.submit': 'Kohereza',
    'common.search': 'Gushaka',
    'common.filter': 'Kuyungurura',
    'common.reset': 'Gutangiza',
    'common.clear': 'Gusiba',
    'common.view': 'Kureba',
    'common.download': 'Gukuramo',
    'common.upload': 'Kohereza',
    'common.next': 'Ikurikira',
    'common.previous': 'Ibibanziriza',
    'common.back': 'Gusubira inyuma',
    'common.continue': 'Komeza',
    'common.confirm': 'Kwemeza',
    'common.yes': 'Yego',
    'common.no': 'Oya',
    'common.close': 'Gufunga',
    'common.open': 'Gufungura',

    // Language
    'language.english': 'Icyongereza',
    'language.kinyarwanda': 'Ikinyarwanda',

    // Auth
    'auth.login': 'Kwinjira',
    'auth.register': 'Kwiyandikisha',
    'auth.email': 'Imeli',
    'auth.password': 'Ijambo ry\'ibanga',
    'auth.confirmPassword': 'Kwemeza ijambo ry\'ibanga',
    'auth.firstName': 'Izina rya mbere',
    'auth.lastName': 'Izina ry\'umuryango',
    'auth.phone': 'Telefoni',
    'auth.forgotPassword': 'Wibagiwe ijambo ry\'ibanga?',
    'auth.rememberMe': 'Nzibuke',
    'auth.alreadyHaveAccount': 'Usanzwe ufite konti?',
    'auth.dontHaveAccount': 'Ntufite konti?',
    'auth.loginError': 'Kwinjira byanze. Suzuma ibyo wanditse.',
    'auth.registerError': 'Kwiyandikisha byanze. Ongera ugerageze.',
    'auth.invalidEmail': 'Andika imeli nyayo.',
    'auth.passwordTooShort': 'Ijambo ry\'ibanga rigomba kuba rifite ibiharuro 8 byibuze.',
    'auth.passwordMismatch': 'Amagambo y\'ibanga ntabwo ahuje.',

    // Patient Dashboard
    'patient.menu.dashboard': 'Ibikubiyemo',
    'patient.menu.bookAppointment': 'Gena Agenda',
    'patient.menu.teleconsultation': 'Teleconsultation',
    'patient.menu.pharmacyOrders': 'Ibicuruzwa bya Farumasi',
    'patient.menu.aiAssistant': 'Umufasha wa AI',
    'patient.menu.emergency': 'Ibyihutirwa',
    'patient.menu.history': 'Amateka y\'Ubuvuzi',
    'patient.header.panel': 'Ikiyega cy\'Umurwayi',
    'patient.user.role': 'Umurwayi',
    'patient.dashboard.title': 'Ikiyega cy\'Umurwayi',
    'patient.dashboard.welcome': 'Murakaza neza',
    'patient.dashboard.upcomingAppointments': 'Amagena azaza',
    'patient.dashboard.recentOrders': 'Ibicuruzwa bya vuba',
    'patient.dashboard.healthMetrics': 'Ibipimo by\'ubuzima',

    // Doctor Dashboard
    'doctor.menu.dashboard': 'Ibikubiyemo',
    'doctor.menu.appointments': 'Amagena',
    'doctor.menu.patients': 'Abarwayi',
    'doctor.menu.teleconsultations': 'Teleconsultation',
    'doctor.menu.prescriptions': 'Imiti yanditse',
    'doctor.menu.settings': 'Amagenamiterere',
    'doctor.header.panel': 'Ikiyega cy\'Umuganga',
    'doctor.user.role': 'Umuganga',
    'doctor.dashboard.title': 'Ikiyega cy\'Umuganga',
    'doctor.dashboard.todayAppointments': 'Amagena y\'uyu munsi',
    'doctor.dashboard.totalPatients': 'Abarwayi bose',
    'doctor.dashboard.pendingConsultations': 'Amagena ategereje',

    // Admin Dashboard
   "admin": {
      "users": {
      "title": "Gucunga Abakoresha",
      "subtitle": "Gucunga abakoresha bose muri sisitemu",
      "stats": {
        "totalUsers": "Abakoresha bose",
        "doctors": "Abaganga",
        "patients": "Abarwayi",
        "admins": "Abayobozi"
      },
      "filters": {
        "all": "Abakoresha bose",
        "doctor": "Abaganga",
        "patient": "Abarwayi",
        "admin": "Abayobozi"
      },
      "buttons": {
        "addNewUser": "Ongeraho Umukoresha Mushya"
      },
      "table": {
        "user": "Umukoresha",
        "role": "Inshingano",
        "status": "Imiterere",
        "created": "Igihe yanditsweho",
        "actions": "Ibikorwa"
      },
      "roles": {
        "doctor": "Umuganga",
        "patient": "Umurwayi",
        "admin": "Umuyobozi"
      },
      "statuses": {
        "active": "Akora",
        "inactive": "Ntakora"
      }
    },
 
    "menu": {
      "dashboard": "Ibikubiyemo",
      "userManagement": "Gucunga Abakoresha",
      "patients": "Abarwayi",
      "doctors": "Abaganga",
      "appointments": "Amagena",
      "reports": "Raporo",
      "security": "Umutekano",
      "settings": "Amagenamiterere",
      "analytics": "Isesengura",
      "messages": "Ubutumwa"
    },
    "header": {
      "panel": "Ikiyega cy'Umuyobozi"
    },
    "user": {
      "admin": "Umuyobozi"
    },
    "dashboard": {
      "title": "Ikiyega cy'Umuyobozi",
      "welcome": "Murakaza neza ku kiyega cy'ubuyobozi",
      "totalUsers": "Abakoresha bose",
      "activePatients": "Abarwayi bakora",
      "activeDoctors": "Abaganga bakora",
      "todayAppointments": "Amagena y'uyu munsi",
      "cards": {
        "users": {
          "title": "Isuzuma ry’Abakoresha",
          "desc": "Incamake y’abakoresha bose",
          "action": "Gucunga Abakoresha"
        },
        "settings": {
          "title": "Isuzuma ry’Amagenamiterere",
          "desc": "Hindura uburyo bwa sisitemu",
          "action": "Jya ku Magenamiterere"
        },
        "reports": {
          "title": "Isuzuma rya Raporo",
          "desc": "Reba raporo za sisitemu",
          "action": "Reba Raporo"
        }
      }
    },
  "nav": {
    "logout": "Sohoka"
  },
   },

    // Appointments
    'appointments.title': 'Amagena',
    'appointments.book': 'Gena Agenda',
    'appointments.upcoming': 'Amagena azaza',
    'appointments.past': 'Amagena yarangiye',
    'appointments.cancelled': 'Amagena yahagaritswe',
    'appointments.status.confirmed': 'Byemejwe',
    'appointments.status.pending': 'Bitegereje',
    'appointments.status.cancelled': 'Byahagaritswe',
    'appointments.status.completed': 'Byarangiye',
    'appointments.selectDoctor': 'Hitamo Umuganga',
    'appointments.selectDate': 'Hitamo Itariki',
    'appointments.selectTime': 'Hitamo Igihe',
    'appointments.reason': 'Impamvu yo gusura',
    'appointments.notes': 'Andi manota',
    'appointmentsPage.title': 'Gena Agenda Yawe',
    'appointmentsPage.subtitle': 'Gena igihe cyo kubonana n\'inzobere mu buzima',

    // Services
    'services.teleconsultation': 'Teleconsultation',
    'services.appointments': 'Amagena',
    'services.emergency': 'Ibyihutirwa',
    'services.pharmacy': 'Farumasi',
    'services.aiAssistant': 'Umufasha wa AI w\'Ubuzima',
    'services.title': 'Serivisi Zacu',
    'services.subtitle': 'Serivisi z\'ubuvuzi zuzuye ku ntoki zawe',

    // Forms
    'form.required': 'Iki cyiciro kirakenewe',
    'form.invalidEmail': 'Andika imeli nyayo',
    'form.invalidPhone': 'Andika nimero ya telefoni nyayo',
    'form.selectOption': 'Hitamo ikigufitiye',
    'form.enterDetails': 'Andika amakuru',

    // Footer
    'footer.quickLinks': 'Ihuza ryihuse',
    'footer.services': 'Serivisi',
    'footer.support': 'Ubufasha',
    'footer.legal': 'Amategeko',
    'footer.contact': 'Duhamagare',
    'footer.followUs': 'Dukurikire',
    'footer.privacyPolicy': 'Politike y\'Ibanga',
    'footer.termsOfService': 'Amabwiriza y\'Ubukoresha',
    'footer.copyright': '© 2024 ONE HEALTHLINE CONNECT. Uburenganzira bwose butunganijwe.',
    'footer.description': 'Umufasha wawe wizewe w\'ubuvuzi utanga serivisi z\'ubuvuzi nziza mu Rwanda hose.',

    // Emergency
    'emergency.title': 'Serivisi z\'Ibyihutirwa',
    'emergency.description': 'Bonera ubufasha bw\'ubuvuzi bwihutirwa',
    'emergency.call': 'Hamagara Ibyihutirwa',
    'emergency.number': '912',

    // Pharmacy
    'pharmacy.title': 'Serivisi za Farumasi',
    'pharmacy.description': 'Gena imiti n\'ibicuruzwa by\'ubuzima',
    'pharmacy.orderMedicine': 'Gena Imiti',
    'pharmacy.uploadPrescription': 'Kohereza Umwandiko w\'imiti',

    // AI Assistant
    'ai.title': 'Umufasha wa AI w\'Ubuzima',
    'ai.description': 'Bonera inama z\'ubuzima zihariye kandi zigufasha',
    'ai.startChat': 'Tangira Guganira',
    'ai.askQuestion': 'Baza Ikibazo',

    // Errors
    'error.general': 'Hari ikibazo. Ongera ugerageze.',
    'error.network': 'Ikibazo cy\'uruyaga. Suzuma kwihuza kwawe.',
    'error.unauthorized': 'Ntufite uburenganzira bwo kubona iki.',
    'error.notFound': 'Ibyo wasabye ntibibonetse.',
    'error.serverError': 'Ikibazo cy\'umuyombi. Ongera ugerageze nyuma.',

    // Success Messages
    'success.appointmentBooked': 'Agenda yagenze neza!',
    'success.profileUpdated': 'Umwirondoro wavuguruwe neza!',
    'success.passwordChanged': 'Ijambo ry\'ibanga ryahinduwe neza!',
    'success.emailSent': 'Imeli yoherejwe neza!',

    // Tables
    'table.name': 'Izina',
    'table.email': 'Imeli',
    'table.phone': 'Telefoni',
    'table.status': 'Uko bimeze',
    'table.date': 'Itariki',
    'table.time': 'Igihe',
    'table.actions': 'Ibikorwa',
    'table.noData': 'Nta makuru ahari',
    'table.loading': 'Gukuramo amakuru...',

    // Modals
    'modal.confirmDelete': 'Wizeye ko ushaka gusiba iki kintu?',
    'modal.confirmCancel': 'Wizeye ko ushaka guhagarika?',
    'modal.unsavedChanges': 'Ufite impinduka zitabitswe. Urashaka kuzireka?',

    // Profile
    'profile.title': 'Umwirondoro',
    'profile.personalInfo': 'Amakuru Bwite',
    'profile.contactInfo': 'Amakuru yo Kuvugana',
    'profile.medicalInfo': 'Amakuru y\'Ubuvuzi',
    'profile.emergencyContact': 'Uhagurishijwe mu byihutirwa',
    'profile.updateProfile': 'Vugurura Umwirondoro',
    'profile.changePassword': 'Hindura Ijambo ry\'ibanga',

    // Settings
    'settings.title': 'Amagenamiterere',
    'settings.general': 'Rusange',
    'settings.notifications': 'Ibimenyesha',
    'settings.privacy': 'Ibanga',
    'settings.security': 'Umutekano',
    'settings.language': 'Ururimi',
    'settings.theme': 'Ubushushanyo',

    // Notifications
    'notifications.title': 'Ibimenyesha',
    'notifications.markAllRead': 'Menya Byose ko Byasomwe',
    'notifications.noNotifications': 'Nta bimenyesha',
    'notifications.newAppointment': 'Agenda nshya yashyizweho',
    'notifications.appointmentReminder': 'Kwibuka agenda',
    'notifications.prescriptionReady': 'Imiti yiteguye yo gufatwa',

    // Search
    'search.placeholder': 'Gushaka...',
    'search.noResults': 'Nta bisubizo byabonetse',
    'search.searchResults': 'Ibisubizo by\'Gushaka',
    'search.searchFor': 'Gushaka',

    // Filters
    'filter.all': 'Byose',
    'filter.active': 'Bikora',
    'filter.inactive': 'Bitakora',
    'filter.pending': 'Bitegereje',
    'filter.approved': 'Byemewe',
    'filter.rejected': 'Byangwe',
    'filter.dateRange': 'Igihe',
    'filter.status': 'Uko bimeze',
    'filter.category': 'Icyiciro',

    // Pagination
    'pagination.previous': 'Ibibanziriza',
    'pagination.next': 'Ikurikira',
    'pagination.page': 'Urupapuro',
    'pagination.of': 'muri',
    'pagination.showing': 'Byerekana',
    'pagination.results': 'ibisubizo',

    // Health Metrics
    'health.bloodPressure': 'Umuvuduko w\'amaraso',
    'health.heartRate': 'Umuvuduko w\'umutima',
    'health.temperature': 'Ubushyuhe',
    'health.weight': 'Ibiro',
    'health.height': 'Uburebure',
    'health.bmi': 'BMI',
    'health.lastUpdated': 'Bwanyuma bwavuguruwe',

    // Medical History
    'medical.history': 'Amateka y\'Ubuvuzi',
    'medical.allergies': 'Allergies',
    'medical.medications': 'Imiti y\'ubu',
    'medical.conditions': 'Indwara',
    'medical.surgeries': 'Ubuganga bwakozwe',
    'medical.familyHistory': 'Amateka y\'umuryango',

    // Prescriptions
    'prescription.title': 'Imiti yanditse',
    'prescription.medication': 'Umuti',
    'prescription.dosage': 'Ingano',
    'prescription.frequency': 'Inshuro',
    'prescription.duration': 'Igihe',
    'prescription.instructions': 'Amabwiriza',
    'prescription.prescribedBy': 'Yanditswe na',
    'prescription.prescribedDate': 'Itariki yanditsweho',
    irabaruta_logo: "Ikirango cya Irabaruta",
    ourStory: {
      title: "Inkuru Yacu",
      subtitle: "Urugendo rwa ONE HEALTHLINE CONNECT kuva ku gitekerezo kugeza ku kuba urubuga rw’ubuvuzi ruzwi mu Rwanda",
      sections: {
        beginning: {
          title: "Intangiriro",
          description:
            "ONE HEALTHLINE CONNECT yavutse kubera uburambe bw’umuntu bw’umuyobozi wayo, Dr. Jean Mugabo, wabonye imbogamizi imiryango yo mu cyaro ihura nazo mu kubona ubuvuzi bufite ireme. Nyuma yo kubura umwe mu bo mu muryango bitewe no gutinda kubona ubuvuzi, yihaye intego yo gushaka igisubizo cyazajya gihuza abarwayi n’abatanga serivisi z’ubuvuzi."
        },
        challenge: {
          title: "Inzitizi",
          description:
            "Mu Rwanda, abantu benshi bagihura n’ingorane zo kubona serivisi z’ubuvuzi kubera imbogamizi z’ubutaka, kubura ibikoresho bihagije, n’ikibazo cy’abaganga bake. Ibi cyane cyane ku batuye mu byaro, bakaba bagomba kugenda intera ndende kugira ngo bagere ku ivuriro rya hafi."
        },
        solution: {
          title: "Igisubizo",
          description:
            "Dushingiye ku kuba telefoni ngendanwa zikwirakwiriye cyane mu Rwanda, twashizeho urubuga rwa digital ruhuza abarwayi n’abatanga serivisi z’ubuvuzi, rubemerera kubona ibiganiro n’abaganga, guteganya gahunda, gutumiza imiti, no kubona ubufasha bwihutirwa—byose biboneka kuri telefoni zabo. Tunashyizeho ubwenge bw’ubukorano butanga ubufasha bwihariye ku buzima bw’umuntu."
        },
        today: {
          title: "Uyu Munsi",
          description:
            "Uyu munsi, ONE HEALTHLINE CONNECT itanga serivisi ku barwayi ibihumbi mu gihugu hose, ifatanya n’ibitaro binini, amavuriro, n’amaduka y’imiti mu gutanga serivisi zuzuye z’ubuvuzi. Ikipe yacu yakomeje kwaguka ikubiyemo abaganga, inzobere mu ikoranabuhanga, n’abayobozi b’ubucuruzi, bose bafite intego imwe yo kunoza uburyo bwo kubona ubuvuzi mu Rwanda."
        }
      }
    },
  
    nav: {
      home: "Ahabanza",
      services: "Serivisi",
      departments: "Amashami",
      about: "Abo turi bo",
      contact: "Tuvugishe",
      teleconsultation: "Kuganira na Muganga Kuri Telefone",
      appointments: "Guhamagara Inama",
      emergency: "Ibyihutirwa",
      pharmacy: "Farumasi",
      aiAssistant: "Menya Umufasha wawe w’Ubuzima wa AI",
      logout: "Sohoka",
      user: "Umukoresha",
      patient: "Umurwayi",
    },
    hero1: {
        label: "Ubuvuzi Bushya mu Rwanda",
    subtitle: "Urubuga rw'ubuvuzi bugezweho kandi buboneka kuri bose",
              badge: "Serivisi z'ubuvuzi amasaha 24/7",
      title: "Ubuvuzi Bushya mu Rwanda",
      description:
        "ONE HEALTHLINE CONNECT ikuzanira ubuvuzi bugezweho mu ntoki zawe. Hura n’inzobere, bukisha gahunda, gerwaho serivisi z’ubutabazi, kandi ukurikiranire ubuzima bwawe hamwe kuri uru rubuga.",
      cta_get_started: "Tangira",
      cta_emergency: "Ubufasha bw'ihutirwa",
      users_count: "Abakoresha 1,200+",
      users_trust: "Bizera serivisi zacu",
      consultations_title: "Inama z'ubuvuzi kuri interineti",
      consultations_desc: "Hura n’inzobere utavuye mu rugo",
      badge_new: "BISHYA",
      user1: "Umukoresha 1",
      user2: "Umukoresha 2",
      user3: "Umukoresha 3",
      user4: "Umukoresha 4",
      doctor_consulting_with_patient: "Muganga ari kuganira n’umurwayi",
    },
    services2: {
      title: "Serivisi Zacu",
      subtitle: "Serivisi z’ubuzima zuzuye zigenewe guhaza ibyifuzo byawe byose by’ubuvuzi",
      teleconsultation: {
        title: "Kuganira na Muganga Kuri Telefone",
        desc: "Vugana n’abaganga b’inzobere baturutse mu bitaro bitandukanye byo mu Rwanda",
      },
      appointments: {
        title: "Guhamagara Inama",
        desc: "Tegura kandi uyobore inama z’ubuvuzi byoroshye",
      },
      emergency: {
        title: "Ibyihutirwa",
        desc: "Serivisi z’inkunga yihuse amasaha 24/7 igihe ukeneye cyane",
      },
      pharmacy: {
        title: "Farumasi",
        desc: "Tegura imiti mu mafamuzi yo mu karere hamwe no kuyigeza aho uri",
      },
      ai: {
        badge: "Ikoranabuhanga rya AI",
        title: "Menya Umufasha wawe w’Ubuzima wa AI",
        desc:
          "Sisitemu yacu ya AI itanga kugenzura ubuzima bwawe bwite, inama z’imibereho, kwibutsa imiti, n’ibanze mu kuganira na muganga. Fata inama zihuse igihe cyose, aho uri hose.",
        features: {
          monitoring: "Kugenzura Ubuzima",
          lifestyle: "Inama z’Imibereho",
          medication: "Inama z’Imiti",
          symptom: "Gusesengura Ibimenyetso",
        },
        cta: "Gerageza AI Assistant",
      },
      learnMore: "Menya byinshi",
    },
    departments: {
      "meet_doctors_title": "Sanga Abaganga Bacu",
    "meet_doctors_description": "Ibice byacu byuzuyemo abaganga babimenyereye bafite intego yo gutanga serivisi nziza",
    "reviews": "Inyandiko {{count}}",
    "book_appointment": "Tegura Inama",
    "view_all_doctors": "Reba Abaganga Bose",
      title: "Amashami y’Ubuvuzi",
      subtitle: "Gerwaho ubuvuzi bw’inzobere mu byiciro bitandukanye by’ubuvuzi mu Rwanda",
      list: {
        cardiology: "Ibindi Byerekeye umutima",
        ophthalmology: "Ibyerekeye amaso",
        dentistry: "Ubuvuzi bw’amenyo",
        antenatal: "Kwitaho Ababyeyi",
        neurology: "Ubwonko n’Imitsi",
        orthopedics: "Ibindi Byerekeye amagufwa",
      },
      viewAll: "Reba Amashami Yose",
    },
    stats: {
      partnerHospitals: "Ibitaro dufatanya na byo",
      medicalSpecialists: "Abaganga b’inzobere",
      availability: "Igihe Serivisi iboneka",
      patientsServed: "Abakiriya twitayeho",
      partnerHospitalsCount: "10+",
      medicalSpecialistsCount: "50+",
      availabilityCount: "Amasaha 24/7",
      patientsServedCount: "5000+",
    },
    doctorsSection: {
      title: "Hura n’Abaganga b’Inzobere",
      description: "Dufite abaganga b’inzobere bo mu Rwanda bategereje kugufasha",
      viewAll: "Reba abaganga bose",
      available: "Ababoneka uyu munsi",
      unavailable: "Ntaboneka",
      book: "Tegura",
      chat: "Sangira ubutumwa",
      specialties: {
        cardiologist: "Umuganga w’umutima",
        pediatrician: "Umuganga w’abana",
        neurologist: "Umuganga w’ubwonko",
        dentist: "Umuganga w’amenyo",
      },
      reviews: "ibitekerezo",
      doctor1: {
        name: "Dr. Jean Mugabo",
        specialty: "Umuganga w’umutima",
        hospital: "Ibitaro bya Kaminuza ya Kigali",
        reviewsCount: 120,
        rating: 4.9,
      },
      doctor2: {
        name: "Dr. Marie Uwase",
        specialty: "Umuganga w’abana",
        hospital: "Ibitaro by’Abana bya Rwanda",
        reviewsCount: 120,
        rating: 4.9,
      },
      doctor3: {
        name: "Dr. Eric Ndayishimiye",
        specialty: "Umuganga w’ubwonko",
        hospital: "CHUK",
        reviewsCount: 120,
        rating: 4.9,
      },
      doctor4: {
        name: "Claire Mutesi",
        specialty: "Umuganga w’amenyo",
        hospital: "Kliniki ya Gakwerere",
        reviewsCount: 120,
        rating: 4.9,
      },
    },
    testimonials: {
      title: "Ibyo Abakiriya Bacu Bavuga",
      subtitle: "Incamake z’ubuzima bwiza bwavuye kuri ONE HEALTHLINE CONNECT",
      roles: {
        mother: "Umubyeyi w’abana babiri",
      },
      quotes: {
        1: "ONE HEALTHLINE CONNECT yahinduye uburyo umuryango wanjye ubona ubuvuzi. Kuganira na muganga kuri telefone byadutwaye igihe gito cyane ubwo umwana wanjye yari afite umuriro. Muganga yabashije kumuvura byihuse kandi imiti yaduherejwe vuba.",
      },
      prev: "Ibyavuzwe mbere",
      next: "Ibikurikira",
      goto: "Jya kuri testimonial {{index}}",
    },
    cta2: {
      title: "Kuramo Porogaramu ya ONE HEALTHLINE CONNECT Ubu",
      description:
        "Fata ubuzima bwawe mu biganza byawe hamwe na porogaramu yacu imwe ikubiyemo serivisi zose. Gerwaho serivisi igihe cyose, aho uri hose.",
      features: {
        access_24_7: "Serivisi z’abaganga amasaha 24/7",
        book_appointments: "Tegura inama n’inzobere",
        order_medications: "Tegura imiti igezweho mu rugo",
        emergency_assistance: "Ubufasha bwihuse mu byihutirwa",
        ai_health_monitoring: "Kugenzura ubuzima n’inama za AI",
      },
      download_ios: "Kuramo kuri iOS",
      download_android: "Kuramo kuri Android",
      app_image_alt: "Porogaramu ya ONE HEALTHLINE CONNECT",
    },
    contact: {
      title: "Tuvugishe",
      description: "Ufite ikibazo cyangwa ushaka ubufasha? Itsinda ryacu riri hano kugufasha.",
      form: {
        title: "Twandikire ubutumwa",
        name_label: "Amazina yawe",
        name_placeholder: "Andika amazina yawe",
        email_label: "Imeri",
        email_placeholder: "Andika imeri yawe",
        subject_label: "Insanganyamatsiko",
        subject_placeholder: "Tugire icyo tugufasha?",
        message_label: "Ubutumwa",
        message_placeholder: "Andika ubutumwa bwawe",
        send_button: "Ohereza Ubutumwa",
      },
      info: {
        title: "Amakuru y'Itumanaho",
        location: {
          title: "Aho turi",
          address: "KG 123 St, Kigali, Rwanda",
        },
        phone: {
          title: "Telefoni",
          main: "+250 788 123 456",
          emergency: "Ibyihutirwa: +250 788 999 911",
        },
        email: {
          title: "Imeri",
          main: "info@healthlinerwanda.com",
        },
      },
      hours: {
        title: "Amasaha yo Gukorera",
        monday_friday: {
          day: "Kuwa mbere - kuwa gatanu:",
          time: "8:00 AM - 8:00 PM",
        },
        saturday: {
          day: "Kuwa gatandatu:",
          time: "9:00 AM - 6:00 PM",
        },
        sunday: {
          day: "Kuwa mbere:",
          time: "10:00 AM - 4:00 PM",
        },
        note: "* Serivisi z’ihutirwa zihari amasaha 24/7",
      },
    },
    logo: "Ikirango cya Irabaruta",
    footer: {
      description:
        "Duhindura uburyo ubuvuzi buboneka mu Rwanda biciye mu ikoranabuhanga. Intego yacu ni ugutanga ubuvuzi bufite ireme ku banyarwanda bose.",
      quickLinks: "Inzira Zihuse",
      services: "Serivisi zacu",
      support: "Ubufasha",
      contact: "Tuvugishe",
      privacyPolicy: "Amategeko y’ibanga",
      termsOfService: "Amategeko y’akazi",
      copyright: "Uburenganzira bwose burabitswe.",
      nav: {
        home: "Ahabanza",
        about: "Abo turi bo",
        services: "Serivisi",
        departments: "Amashami",
        contact: "Tuvugishe",
        teleconsultation: "Kuganira na Muganga Kuri Telefone",
        appointments: "Guhamagara Inama",
        emergency: "Ibyihutirwa",
        pharmacy: "Farumasi",
        aiAssistant: "Umufasha w’Ubuzima wa AI",
      },
      faq: "Ibibazo Bikunze Kubazwa",
    },
  servicesHero: {
      title: "Serivisi zacu z’<span class='text-green-600'>Ubuvuzi</span>",
      description: "Ibisubizo byuzuye by’ubuvuzi byateguwe guhaza ibyo ukeneye, biboneka igihe cyose, aho uri hose mu Rwanda.",
      getStarted: "Tangira",
      viewPricing: "Reba Ibiciro",
      imageAlt: "Serivisi za ONE HEALTHLINE CONNECT",
      coreServices: {
        title: "Serivisi 5 Z’ingenzi",
        description: "Zateguwe hakurikijwe uburyo bw’ubuvuzi mu Rwanda",
      },
      badges: {
        support: "Ubufasha amasaha 24/7",
        coverage: "Kugeza hose mu gihugu",
      },
    },

    servicesOverview: {
      title: "Serivisi zacu mu ncamake",
      description: "ONE HEALTHLINE CONNECT itanga serivisi z’ubuvuzi zuzuye ziteguye guhaza ibyifuzo bitandukanye by’abakoresha bacu",
      learnMore: "Menya byinshi",
    },
    

    services5: {
      teleconsultation: {
        title: "Kuganira na Muganga Kuri Telefone",
        desc: "Kuganira na Muganga Kuri Telefone",
      },
      appointments: {
        title: "Guhamagara Inama",
        desc: "Guhamagara Inama",
      },
      emergency: {
        title: "Ibyihutirwa",
        desc: "Ibyihutirwa",
      },
      pharmacy: {
        title: "Farumasi",
        desc: "Farumasi",
      },
      ai: {
        title: "Menya Umufasha wawe w’Ubuzima wa AI",
        desc: "Menya Umufasha wawe w’Ubuzima wa AI",
      },
    },
    servicesCta: {
    "title": "Tangira gukoresha Serivisi z'Ubuvuzi zacu",
    "description": "Kuramo porogaramu yacu cyangwa tuvugishe uyu munsi kugirango ubone serivisi z'ubuvuzi zihuse, zizewe kandi zidahenze.",
    "downloadApp": "Kuramo Porogaramu",
    "contactUs": "Tuvugishe"
  },
  "departments2": {
    "title": "Serivisi mu Mashami Atandukanye",
    "description": "ONE HEALTHLINE CONNECT itanga serivisi z'ubuvuzi zitandukanye binyuze mu mashami yayo",
    "diagnostic": {
      "title": "Serivisi zo Gusuzuma Indwara",
      "services": {
        "imaging": "Isuzuma ryifashisha ibikoresho by'ikoranabuhanga (X-ray, CT, MRI)",
        "laboratory": "Igeragezwa mu Laboratwari",
        "ecg": "Electrocardiogram (ECG/EKG)",
        "ultrasound": "Ultrasound",
        "endoscopy": "Endoscopy",
        "biopsy": "Biopsy"
      }
    },
    "treatment": {
      "title": "Serivisi zo Kuvura",
      "services": {
        "medication": "Gucunga Imiti",
        "surgery": "Kubaga",
        "physicalTherapy": "Kuvura hifashishijwe imyitozo ngororamubiri",
        "radiation": "Radiation Therapy",
        "chemotherapy": "Chemotherapy",
        "rehab": "Serivisi zo Gusubiza Ubuzima"
      }
    },
    "preventive": {
      "title": "Ubuvuzi bwo Kwirinda",
      "services": {
        "screenings": "Gusuzuma Ubuzima",
        "vaccinations": "Gukingira",
        "checkups": "Isuzuma rya buri gihe",
        "nutrition": "Inama ku mirire",
        "lifestyle": "Guhindura Imyitwarire y’Ubuzima",
        "education": "Uburezi bwo Kwirinda"
      }
    },
    "specialized": {
      "title": "Ubuvuzi Bwihariye",
      "services": {
        "chronic": "Kwitaho Indwara z'Igihe Kirekire",
        "maternal": "Ubuzima bw'Ababyeyi n'Abana",
        "geriatric": "Ubuzima bw’Abakuze",
        "mental": "Ubuvuzi bw’Indwara zo Mu Mutwe",
        "pain": "Gukemura Ibibazo by’Uburibwe",
        "emergency": "Ubuvuzi bw’Amahutwa"
      }
    },
  }
  },
};
  


interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'rw')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage: changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
