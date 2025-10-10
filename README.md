# OneHealth Connect - Comprehensive Healthcare Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=vercel)](https://drive.google.com/drive/folders/1WF-NFJunWWYjeyWBCAkxUl7E5OwADwiU)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-green?style=for-the-badge&logo=render)](https://onehealthconnekt.onrender.com/api-docs)
[![Video Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=vercel)](https://drive.google.com/drive/folders/1WF-NFJunWWYjeyWBCAkxUl7E5OwADwiU)
## Project Overview

OneHealth Connect is a comprehensive digital healthcare platform designed to revolutionize healthcare access in Rwanda. The system connects patients with qualified medical professionals across multiple hospitals, providing teleconsultation services, appointment management, AI-powered health assistance, and emergency medical support.

### Mission Statement
*"Transforming healthcare access in Rwanda through innovative digital solutions. Our mission is to make quality healthcare accessible to all Rwandans."*

## System Architecture

### Backend Infrastructure
- **Runtime Environment**: Node.js 16+ with Express.js framework
- **Database**: MongoDB Atlas with Mongoose ODM for data modeling
- **Authentication**: JWT-based authentication with role-based access control
- **Real-time Communication**: Socket.io for live notifications and updates
- **Email Services**: Nodemailer with SMTP pooling for reliable delivery
- **AI Integration**: Google Generative AI (Gemini) for health assistance
- **File Management**: Cloudinary for secure medical document storage
- **Payment Processing**: Integrated payment gateway for transactions
- **Security**: Comprehensive middleware for validation, rate limiting, and monitoring

### Frontend Architecture
- **Framework**: Next.js 14 with TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API for global state
- **Data Fetching**: SWR for efficient caching and synchronization
- **UI Components**: Custom-built responsive components
- **Real-time Integration**: Socket.io client for live updates

## Dashboard Systems

### Patient Dashboard
The patient dashboard provides comprehensive health management capabilities:

**Health Overview Section**
- Current health status summary
- Upcoming appointments with doctor details
- Recent prescription history
- Medication reminders and adherence tracking
- Vital signs monitoring (blood pressure, weight, etc.)

**Appointment Management**
- Calendar view of scheduled appointments
- Quick booking interface with available time slots
- Doctor profiles with specialties and ratings
- Teleconsultation meeting links
- Appointment history with consultation notes

**Medical Records**
- Complete medical history timeline
- Lab results and imaging reports
- Prescription history with refill options
- Insurance information and coverage details
- Emergency contact management

**AI Health Assistant**
- Symptom checker with preliminary analysis
- Health tips and lifestyle recommendations
- Medication interaction warnings
- Health trend analysis over time
- Personalized health insights

### Doctor Dashboard
The doctor dashboard enables efficient patient care management:

**Patient Management**
- Active patient list with health status indicators
- Patient search and filtering capabilities
- Medical history access for each patient
- Consultation notes and treatment plans
- Follow-up appointment scheduling

**Appointment Scheduling**
- Calendar integration with availability management
- Meeting scheduling with patients
- Rescheduling capabilities with automatic notifications
- Meeting settings configuration
- Missed appointment tracking

**Consultation Tools**
- Teleconsultation meeting management
- Patient communication interface
- Prescription writing and management
- Lab order placement
- Referral system to specialists

**Performance Analytics**
- Patient consultation statistics
- Appointment completion rates
- Revenue tracking and reporting
- Patient satisfaction metrics
- Professional development insights

### Hospital Dashboard
The hospital dashboard provides administrative oversight and management:

**Hospital Overview**
- Total patient count and demographics
- Doctor availability and scheduling
- Department performance metrics
- Revenue analytics and financial reports
- Quality assurance indicators

**Staff Management**
- Doctor recruitment and onboarding
- Department assignments and scheduling
- Performance evaluation tools
- Training and certification tracking
- Staff communication systems

**Patient Administration**
- Patient registration and verification
- Insurance processing and claims
- Appointment coordination across departments
- Patient referral management
- Emergency case prioritization

**Operational Analytics**
- Resource utilization reports
- Capacity planning and optimization
- Cost analysis and budgeting
- Compliance monitoring
- Quality improvement initiatives

### Administrator Dashboard
The administrator dashboard provides system-wide management:

**System Overview**
- Total users across all roles
- System performance metrics
- Revenue analytics across hospitals
- User engagement statistics
- Platform health monitoring

**User Management**
- User registration and verification
- Role assignment and permissions
- Account status management
- Security monitoring and alerts
- User support and assistance

**Hospital Network Management**
- Hospital registration and approval
- Network performance monitoring
- Inter-hospital coordination
- Quality standards enforcement
- Partnership management

**System Administration**
- Feature flag management
- System configuration settings
- Backup and recovery procedures
- Security audit logs
- Performance optimization

## Data Management

### Patient Data Structure
The system manages comprehensive patient information:

**Demographic Information**
- Personal details (name, age, gender, contact information)
- Address and location data
- Emergency contact information
- Insurance and payment information
- Identification documents

**Medical History**
- Past medical conditions and treatments
- Current medications and dosages
- Allergies and adverse reactions
- Family medical history
- Chronic condition management

**Health Records**
- Consultation notes and diagnoses
- Lab results and test reports
- Imaging studies and radiology reports
- Prescription history and refills
- Treatment plans and follow-up care

### Doctor Data Structure
Comprehensive doctor profiles and capabilities:

**Professional Information**
- Medical qualifications and certifications
- Specialties and areas of expertise
- Hospital affiliations and departments
- Years of experience and practice areas
- Professional ratings and reviews

**Availability Management**
- Working hours and schedule preferences
- Available time slots for appointments
- Meeting room assignments
- Break time and personal schedule
- Emergency availability status

**Performance Metrics**
- Patient consultation statistics
- Appointment completion rates
- Patient satisfaction scores
- Revenue generation tracking
- Professional development progress

### Hospital Data Structure
Complete hospital network information:

**Institutional Details**
- Hospital name, location, and contact information
- Accreditation and certification status
- Department structure and specialties
- Staff count and capacity information
- Service offerings and capabilities

**Operational Data**
- Patient capacity and utilization rates
- Resource availability and scheduling
- Quality metrics and performance indicators
- Financial performance and revenue tracking
- Compliance and regulatory status

## Core Features and Functionality

### Teleconsultation Platform
**Meeting Management**
- Real-time video consultations with specialists
- Cross-hospital specialist access and coordination
- Meeting scheduling with calendar integration
- Automated email notifications for all parties
- Meeting rescheduling with conflict resolution
- Missed appointment tracking and follow-up

**Technical Features**
- High-quality video and audio streaming
- Screen sharing capabilities for medical images
- Recording functionality for consultation records
- Mobile-responsive interface for all devices
- Secure connection with end-to-end encryption
- Integration with electronic health records

### Appointment Management System
**Booking Process**
- Online appointment scheduling with real-time availability
- Doctor selection based on specialty and location
- Time slot selection with conflict prevention
- Automated confirmation and reminder notifications
- Rescheduling and cancellation capabilities
- Waitlist management for popular time slots

**Administrative Features**
- Appointment reassignment between doctors
- Bulk scheduling for recurring appointments
- Emergency appointment prioritization
- No-show tracking and management
- Revenue tracking and reporting
- Performance analytics and optimization

### AI-Powered Health Assistant
**Health Monitoring**
- Personalized health tracking and analysis
- Symptom checker with preliminary diagnosis
- Medication interaction warnings and alerts
- Health trend analysis over time
- Lifestyle recommendations and tips
- Preventive care suggestions

**Intelligent Features**
- Natural language processing for health queries
- Machine learning for personalized recommendations
- Integration with medical databases and guidelines
- Continuous learning from user interactions
- Privacy-preserving data analysis
- Evidence-based health advice

### Emergency Services
**Rapid Response System**
- 24/7 emergency assistance and coordination
- Critical case prioritization and routing
- Emergency contact management and notification
- Hospital capacity monitoring and optimization
- Emergency transportation coordination
- Real-time status updates and tracking

**Emergency Management**
- Triage system for case prioritization
- Emergency room capacity monitoring
- Critical care resource allocation
- Emergency communication protocols
- Disaster response coordination
- Emergency preparedness planning

### Pharmacy Integration
**Medication Management**
- Online medication ordering and delivery
- Prescription management and refills
- Drug interaction checking and warnings
- Medication adherence tracking and reminders
- Insurance coverage verification and processing
- Local pharmacy network coordination

**Delivery Services**
- Same-day delivery options for urgent medications
- Scheduled delivery for regular prescriptions
- Delivery tracking and status updates
- Secure medication handling and storage
- Insurance claim processing and reimbursement
- Customer support and assistance

## Security and Compliance

### Data Protection
**Healthcare Compliance**
- HIPAA-compliant data handling and storage
- Encrypted medical records and personal information
- Secure file uploads and document management
- Role-based data access and permissions
- Comprehensive audit logging for all operations
- Data retention and disposal policies

**Security Measures**
- Multi-factor authentication for all user accounts
- JWT token management with secure expiration
- Role-based permissions and access control
- Session management and timeout policies
- Password encryption and security policies
- Regular security audits and vulnerability assessments

### Privacy Protection
**Patient Privacy**
- Anonymous data collection and analysis
- Consent management for data sharing
- Privacy-preserving AI and analytics
- Secure communication channels
- Data minimization and purpose limitation
- Patient rights and data portability

**System Security**
- Network security and firewall protection
- Intrusion detection and prevention systems
- Regular security updates and patches
- Incident response and recovery procedures
- Security training and awareness programs
- Compliance monitoring and reporting

## Analytics and Reporting

### Real-time Dashboards
**Performance Metrics**
- Patient registration and engagement rates
- Appointment completion and satisfaction scores
- Doctor availability and utilization rates
- Hospital performance indicators and benchmarks
- Revenue analytics and financial reporting
- User engagement and platform usage statistics

**Operational Analytics**
- System performance and uptime monitoring
- Error tracking and resolution metrics
- User activity and behavior analysis
- Resource utilization and optimization
- Quality assurance and improvement metrics
- Compliance and regulatory reporting

### Administrative Reports
**System Administration**
- User registration and verification statistics
- System usage and performance reports
- Security audit logs and incident reports
- Financial performance and revenue analysis
- Quality metrics and improvement initiatives
- Compliance monitoring and regulatory reporting

**Business Intelligence**
- Market analysis and growth opportunities
- User demographics and behavior patterns
- Service utilization and optimization
- Revenue forecasting and financial planning
- Competitive analysis and benchmarking
- Strategic planning and decision support

## Installation and Setup

### Prerequisites
- Node.js 16 or higher
- MongoDB Atlas account and connection string
- Cloudinary account for file storage
- Google AI API key for AI features
- SMTP credentials for email services
- Payment gateway credentials (optional)

### Backend Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/onehealth-connect.git
   cd onehealth-connect
   ```

2. **Install dependencies**
```bash
npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/onehealth
   
   # Authentication
   JWT_SECRET=your-jwt-secret-key
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM="OneHealth <your-email@gmail.com>"
   
   # AI Services
   GEMINI_API_KEY=your-google-ai-api-key
   
   # File Storage
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   
   # Server Configuration
   PORT=5000
   NODE_ENV=production
   ```

4. **Database Setup**
   ```bash
node seed.js  # Creates realistic test data
   ```

5. **Start the server**
   ```bash
   npm start
   ```

### Frontend Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Configure the following environment variables:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://onehealthconnekt.onrender.com
   
   # Socket.io Configuration
   NEXT_PUBLIC_SOCKET_URL=https://onehealthconnekt.onrender.com
   
   # Feature Flags
   NEXT_PUBLIC_ENABLE_AI=true
   NEXT_PUBLIC_ENABLE_TELECONSULTATION=true
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Test Accounts
```
Administrator: admin@onehealth.rw | Admin#123
Hospital Admin: kgh-admin@onehealth.rw | Admin#123
Doctor: doctor_generalmedicine1@onehealth.rw | Doctor#123
Patient: patient1@onehealth.rw | Patient#123
```

## API Documentation

### Authentication Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /auth/resend-otp` - OTP resend functionality
- `POST /auth/verify-otp` - OTP verification
- `GET /auth/me` - Get current user profile

### Patient Management
- `GET /patients` - Get patient list (role-filtered)
- `POST /patients/register` - Patient registration
- `GET /patients/:id` - Get patient details
- `PUT /patients/:id` - Update patient information
- `GET /patients/my-for-doctor` - Get doctor's patients

### Doctor Management
- `GET /doctors` - Get doctor list
- `POST /doctors` - Create doctor profile
- `GET /doctors/:id` - Get doctor details
- `PUT /doctors/:id` - Update doctor information
- `GET /doctors/my-settings` - Get doctor settings
- `PUT /doctors/my-settings` - Update doctor settings

### Hospital Management
- `GET /hospitals` - Get hospital list
- `POST /hospitals` - Create hospital profile
- `GET /hospitals/:id` - Get hospital details
- `GET /hospitals/:id/doctors` - Get hospital doctors
- `POST /hospitals/:id/doctors` - Add doctor to hospital

### Appointment Management
- `GET /appointments` - Get appointments (role-filtered)
- `POST /appointments` - Book appointment
- `GET /appointments/:id` - Get appointment details
- `PUT /appointments/:id` - Update appointment
- `PATCH /appointments/:id/reassign` - Reassign appointment
- `DELETE /appointments/:id` - Cancel appointment

### Meeting Management
- `GET /meetings` - Get meetings (role-filtered)
- `POST /meetings` - Schedule meeting
- `GET /meetings/:id` - Get meeting details
- `PATCH /meetings/:id/reschedule` - Reschedule meeting
- `PATCH /meetings/:id/status` - Update meeting status
- `DELETE /meetings/:id` - Cancel meeting

### AI Services
- `POST /ai/chat/save` - Save AI conversation
- `GET /ai/chat/conversations` - Get conversation history
- `GET /ai/chat/history/:id` - Get specific conversation
- `POST /ai/symptom-checker` - Symptom analysis
- `POST /ai/health-tips` - Get health recommendations

## Live Demo and Documentation

### Live Application
- **Frontend**: [https://onehealthlineconnectsss.vercel.app/](https://onehealthlineconnectsss.vercel.app/)
- **Backend API**: [https://onehealthconnekt.onrender.com](https://onehealthconnekt.onrender.com)
- **API Documentation**: [https://onehealthconnekt.onrender.com/api-docs](https://onehealthconnekt.onrender.com/api-docs)

### Video Demonstration
A comprehensive screen recording demonstrating all system features is available at the live application URL, showcasing:
- Complete user journey across all roles
- Dashboard functionality and navigation
- Teleconsultation booking and management
- AI health assistant interactions
- Mobile responsiveness and cross-platform compatibility
- Real-time notifications and updates

## Dataset Information

### Comprehensive Medical Dataset Structure

The OneHealth Connect system utilizes a comprehensive, structured medical dataset designed specifically for the Rwandan healthcare context. The dataset encompasses multiple interconnected data models that simulate real-world healthcare scenarios while maintaining privacy and compliance standards.

### Dataset Components

#### 1. Hospital Network Dataset
**Source**: Custom-generated based on Rwanda healthcare infrastructure
**Format**: MongoDB collections with embedded documents
**Size**: 4 hospitals with complete operational data

**Data Points**:
- Hospital profiles (Kigali University Hospital, Rwanda Children's Hospital, Hope Valley Hospital, Sunrise Medical Center)
- Location data (addresses, contact information, service offerings)
- Working hours and operational schedules
- Service capabilities and specializations
- Approval status and compliance records

#### 2. Medical Department Dataset
**Source**: Standard medical department classifications adapted for Rwanda
**Format**: Structured JSON objects with hierarchical relationships
**Size**: 12 departments across multiple specialties

**Data Points**:
- Department names and specializations (General Medicine, Cardiology, Pediatrics, Surgery, Orthopedics, Emergency Medicine, Dermatology, Ophthalmology, Neurology, Psychiatry, Oncology, Urology)
- Consultation fees and pricing structures
- Hospital affiliations and department assignments
- Service descriptions and capabilities

#### 3. Healthcare Professional Dataset
**Source**: Generated profiles based on Rwanda medical professional standards
**Format**: MongoDB documents with embedded user profiles
**Size**: 20+ doctor profiles with complete professional data

**Data Points**:
- Professional qualifications and certifications
- Medical specialties and areas of expertise
- Hospital affiliations and department assignments
- Availability schedules and working hours
- Performance metrics and patient ratings
- Professional development records

#### 4. Patient Demographics Dataset
**Source**: Anonymized demographic data following Rwanda population patterns
**Format**: Structured patient profiles with medical history
**Size**: 50+ patient profiles with comprehensive medical records

**Data Points**:
- Personal demographics (age, gender, location, contact information)
- Medical history and chronic conditions
- Current medications and allergies
- Insurance coverage and payment information
- Emergency contacts and family medical history
- Blood type and vital health information

#### 5. Appointment and Scheduling Dataset
**Source**: Generated scheduling patterns based on healthcare industry standards
**Format**: Time-series data with appointment records
**Size**: 100+ appointment records with complete scheduling data

**Data Points**:
- Appointment scheduling patterns and preferences
- Doctor availability and time slot management
- Patient booking preferences and history
- Consultation types and duration
- Revenue tracking and financial data

#### 6. Medical Records Dataset
**Source**: Simulated medical records following standard healthcare documentation
**Format**: Hierarchical medical record structures
**Size**: Comprehensive medical history for all patients

**Data Points**:
- Consultation notes and diagnoses
- Lab results and test reports
- Prescription history and medication management
- Treatment plans and follow-up care
- Medical imaging and radiology reports

#### 7. Pharmacy and Medication Dataset
**Source**: Standard medication database adapted for Rwanda healthcare
**Format**: Structured medication profiles with interaction data
**Size**: 3 pharmacy locations with comprehensive medication catalogs

**Data Points**:
- Medication names, dosages, and classifications
- Drug interactions and contraindications
- Prescription management and refill tracking
- Pharmacy locations and delivery services
- Insurance coverage and pricing information

#### 8. Emergency Services Dataset
**Source**: Emergency response protocols based on Rwanda healthcare standards
**Format**: Emergency case management structures
**Size**: Emergency response scenarios and protocols

**Data Points**:
- Emergency case classifications and priorities
- Response time tracking and coordination
- Critical care resource allocation
- Emergency contact management
- Disaster response protocols

### Data Generation Methodology

#### Realistic Data Creation Process
The dataset was created using a multi-layered approach to ensure authenticity and relevance:

1. **Demographic Modeling**: Based on Rwanda's population demographics, age distributions, and geographic patterns
2. **Medical Standardization**: Aligned with international medical coding systems (ICD-10, CPT codes)
3. **Healthcare Context**: Adapted for Rwanda's healthcare system structure and regulations
4. **Privacy Compliance**: All data anonymized and structured to meet HIPAA and local privacy requirements

#### Data Quality Assurance
- **Validation Rules**: Comprehensive validation schemas ensure data integrity
- **Consistency Checks**: Cross-referenced data points maintain logical relationships
- **Completeness Verification**: All required fields populated with realistic values
- **Format Standardization**: Consistent data formats across all collections

### Dataset Usage and Implementation

#### Development and Testing
- **Seed Data Generation**: Automated seed script (`seed.js`) creates realistic test scenarios
- **Development Environment**: Complete dataset available for local development
- **Testing Scenarios**: Comprehensive test cases covering all user roles and workflows

#### Production Considerations
- **Data Migration**: Structured for easy migration to production databases
- **Scalability**: Designed to handle growth from hundreds to thousands of records
- **Backup and Recovery**: Regular backup procedures for data protection
- **Compliance Monitoring**: Built-in compliance tracking and audit trails

### Data Sources and References

#### Primary Sources
- **Rwanda Ministry of Health**: Healthcare system structure and regulations
- **World Health Organization**: International medical standards and classifications
- **Rwanda Medical Council**: Professional standards and certification requirements
- **Local Healthcare Providers**: Real-world operational patterns and service offerings

#### Secondary Sources
- **Medical Literature**: Evidence-based medical practices and treatment protocols
- **Healthcare Industry Standards**: Best practices for healthcare management systems
- **Technology Standards**: Healthcare IT standards and interoperability requirements

### Privacy and Security Compliance

#### Data Protection Measures
- **Anonymization**: All personal identifiers removed or masked
- **Encryption**: Sensitive data encrypted at rest and in transit
- **Access Controls**: Role-based access controls for data protection
- **Audit Trails**: Comprehensive logging of all data access and modifications

#### Regulatory Compliance
- **HIPAA Compliance**: Meets US healthcare privacy standards
- **Rwanda Data Protection**: Aligns with local data protection regulations
- **International Standards**: Follows WHO and international healthcare data standards

### Dataset Documentation

#### Technical Documentation
- **Schema Definitions**: Complete MongoDB schema documentation
- **API Documentation**: RESTful API endpoints for data access
- **Data Dictionary**: Comprehensive field definitions and data types
- **Relationship Mapping**: Entity relationship diagrams and data flow charts

#### User Documentation
- **Data Entry Guidelines**: Instructions for adding new records
- **Search and Filtering**: Guide to data retrieval and filtering
- **Reporting Capabilities**: Available reports and analytics
- **Data Export Options**: Methods for data extraction and backup

*Note: This dataset is specifically designed for demonstration and testing purposes. All patient data is completely anonymized and generated using realistic patterns. In a production environment, real patient data would be securely managed according to healthcare privacy regulations, Rwanda data protection laws, and international healthcare standards. The dataset serves as a comprehensive foundation for testing all system functionalities while maintaining the highest standards of privacy and security.*

## Proof of Eligibility

### Repository Requirements Compliance
- **README File**: Comprehensive project description with technical details
- **Source Code**: Complete full-stack application with clean architecture
- **Video Demonstration**: Screen recording showcasing all system features
- **Dataset Information**: Medical data structures and test scenarios
- **Eligibility Documentation**: Professional project presentation and compliance

### Technical Achievements
- **Scalable Architecture**: Microservices-ready design with modular components
- **Real-time Features**: Live notifications, updates, and communication
- **AI Integration**: Advanced health assistance and intelligent recommendations
- **Mobile Responsive**: Cross-platform compatibility and responsive design
- **Security Compliant**: Healthcare-grade data protection and privacy
- **Performance Optimized**: Fast loading times and efficient operations
- **Comprehensive Testing**: Robust error handling and quality assurance

### Professional Standards
- **Healthcare Compliance**: HIPAA-compliant data handling and security
- **Code Quality**: Clean, maintainable, and well-documented codebase
- **User Experience**: Intuitive interface design and smooth user flows
- **Performance**: Optimized for speed, reliability, and scalability
- **Security**: Comprehensive security measures and privacy protection
- **Documentation**: Detailed technical documentation and user guides

## Contributing

We welcome contributions to improve OneHealth Connect. Please follow these guidelines:

1. Fork the repository and create a feature branch
2. Make your changes with proper testing and documentation
3. Ensure all tests pass and code follows the established style guide
4. Submit a pull request with a detailed description of changes
5. Address any feedback and ensure compliance with project standards

## Support and Contact

### Technical Support
- **Email**: info@healthlinerwanda.com
- **Phone**: +250 788 777 888
- **Emergency**: +250 788 999 911

### Business Hours
- **Monday - Friday**: 8:00 AM - 8:00 PM
- **Saturday**: 9:00 AM - 6:00 PM
- **Sunday**: 10:00 AM - 4:00 PM
- **Emergency Services**: 24/7

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Rwanda healthcare professionals for domain expertise and guidance
- Open source community for foundational technologies and frameworks
- Medical coding standards organizations for compliance and best practices
- Healthcare privacy compliance frameworks for security and privacy standards
- Development team for dedication and commitment to excellence

---

**OneHealth Connect** - *Making quality healthcare accessible to all Rwandans through innovative digital solutions.*

[![Made with ❤️ in Rwanda](https://img.shields.io/badge/Made%20with%20❤️%20in-Rwanda-red?style=for-the-badge)](https://onehealthlineconnectsss.vercel.app/)