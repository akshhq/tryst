(function trystProductionSystem() {
  const POST_URL = 'https://script.google.com/macros/s/AKfycbyQAna9huOq3pPHqSAAu86QmoNRV0I2oKPdakbNGdIHuQwKHCOnvlJiE5gfkPZF7rZn/exec';

  const commonRules = [
    'Participants must carry valid college ID cards.',
    'Report on time and follow organiser instructions.',
    'Unsafe props or inappropriate content can lead to disqualification.',
    'The judges decision will be final.'
  ];

  const commonJudging = [
    'Creativity and originality',
    'Execution and presentation',
    'Stage presence',
    'Overall impact'
  ];

  const TRYST_EVENTS = {
    'lamp-lighting': {
      day: '1',
      title: 'Lamp Lighting',
      society: 'TRYST Organising Committee',
      time: '10:00 AM',
      location: 'Main Auditorium',
      poster: 'images/posters/campus.webp',
      description: 'The ceremonial opening of TRYST 2026 with the organising team, faculty, guests, and student representatives.',
      
    },
    'inaayat': {
      day: '1',
      title: 'Inaayat',
      society: 'Advaitaa Dance Society',
      time: 'TBA',
      location: 'Auditorium',
      poster: 'images/posters/Inaayat.png',
      description: 'Inaayat is a Western Group Dance Competition featuring team performances in front of judges where synchronization, choreography, and stage presence define the performance.',
      format: [
        'Team performances in front of judges',
        'Performances will be judged and top teams will secure winning positions',
        'Time Limit: 6–8 minutes per team (strictly followed)',
        'Audio: Teams must bring their music in a pen drive'
      ],
      rules: [
        'Only college teams are allowed',
        'Minimum 5 members in each team',
        'Western dance styles should be the main focus',
        'Props are allowed but must be safe and manageable',
        'Any vulgar or inappropriate content will lead to disqualification',
        'Participants must carry their college ID cards',
        'Teams must follow the time limit strictly',
        'Judges’ decision will be final and binding'
      ],
      judging: [
        'Choreography and formations',
        'Synchronization and teamwork',
        'Energy and execution',
        'Creativity and originality',
        'Stage presence and crowd connection'
      ],
      societyLink: '#student-union'
    },
    'aaghaaz': {
      day: '2',
      title: 'AAGHAZ',
      society: 'Advaitaa Dance Society',
      time: '2:00 PM - 3:00 PM',
      location: 'Auditorium',
      poster: 'images/posters/Aaghaaz.png',
      description: 'AAGHAZ is a street battle event — a collective test of synergy, power, and strategy featuring head-on, face-to-face battles and 1v1 solo battles where dancers adapt to DJ-selected tracks on the spot.',
      format: [
        'Crew vs Crew: Head-on, face-to-face battles with immediate knockout rounds until the final showdown',
        '1v1 Solo Battle: Prelims solo set followed by bracket-style knockout rounds until a champion is crowned',
        'Audio: Tracks are selected and played by the DJ on the spot'
      ],
      rules: [
        'Prepared sets and synchronized routines are permitted and encouraged for crew battles',
        'Freestyle is highly encouraged in both formats to show musical adaptability',
        'Use of inappropriate gestures, offensive signage, or derogatory behaviour will result in immediate disqualification',
        'Dancers must stay within the designated battle zone',
        'Participants must respect the exchange format (no interrupting an opponent’s round)',
        'Professionalism must be maintained throughout the event'
      ],
      judging: [
        'Precision and complexity of team routines',
        'Originality and creative innovation',
        'Musicality and accuracy in hitting beats',
        'Individuality and personal style',
        'Stage presence and crowd engagement'
      ],
      societyLink: '#student-union'
    },
    'nocturne': {
      day: '1',
      title: 'Nocturne',
      society: 'Anhad – Western Music Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Nocturne.png',
      description: 'Slaycappella is an acappella competition that celebrates the art of vocal music in its purest form where teams create music using only their voices, blending harmonies, rhythm, and creativity to deliver impactful performances under the theme Scarlett — embodying boldness, passion, and powerful, unapologetic energy.',
      format: [
        'Online Round (Prelims): Teams submit a raw and unedited video of their acappella performance',
        'Shortlisting based on vocal quality, creativity, and overall impact',
        'Offline Round (Finals): Shortlisted teams perform live'
      ],
      rules: [
        'Strictly no use of musical instruments or pre-recorded instrumental tracks',
        'Only vocal music is allowed (beatboxing/vocal percussion permitted)',
        'Time limit: 8–12 minutes',
        'Any inappropriate content will lead to disqualification',
        'Participants must carry valid college IDs',
        'The decision of the judges will be final and binding',
        'Participants will be disqualified if found not adhering to the rules and regulations'
      ],
      judging: [
        'Vocal quality',
        'Creativity',
        'Overall impact',
        'Harmony and rhythm',
        'Stage presence'
      ],
      societyLink: '#student-union'
    },
    'khayaal': {
      day: '2',
      title: 'Khayaal',
      society: 'ANHAD – The Indian Music Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Khayaal.png',
      description: 'KHAYAAL is the Indian Classical Choir Competition — a celebration of harmony, heritage, and heart where voices come together from ragas to rhythms, showcasing unity and musical depth.',
      format: [
        'Preliminary Round (Online): One entry per college submitted via Google Drive link',
        'Performance video must be within 10 minutes and recorded in a single take without edits',
        'Final Round (Offline): 10 minutes performance + 2 minutes sound check per team'
      ],
      rules: [
        'Each college can submit only one entry',
        'Google Drive link must be accessible without restrictions',
        'Performance must be recorded in a single take with no edits or modification',
        'Maximum 12 vocalists and 3 instrumentalists allowed',
        'Minimum 6 participants required (excluding instrumentalists)',
        'Bollywood and semi-classical songs are strictly prohibited',
        'Participants must bring their own instruments',
        'Use of Electronic Tanpura is allowed',
        'All participants must carry valid college ID card',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Harmony and coordination',
        'Understanding of ragas and classical elements',
        'Vocal quality and expression',
        'Discipline and composition',
        'Overall presentation'
      ],
      societyLink: '#student-union'
    },
    'rebuttal': {
      day: '1',
      title: 'Rebuttal’26',
      society: 'Vagmitā – DebSoc',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Rebuttal’26.png',
      description: 'Rebuttal’26 is an English Debate Competition featuring conventional debate rounds where participants engage in structured arguments and rebuttals with motions revealed prior to each round.',
      format: [
        'Round 1: Conventional Debate (motion revealed 24 hours prior)',
        'Round 2: Conventional Debate (motion revealed 10 minutes prior)'
      ],
      rules: [
        'Open to undergraduate and postgraduate students',
        'The debate will be conducted strictly in English',
        'Each participant will have 3 minutes for speech and 1 minute for rebuttal/Q&A',
        'Registration is free; a ₹100 refundable security deposit applies',
        'Limited slots; final allocation at the discretion of the organizing committee'
      ],
      judging: [
        'Content and argument quality',
        'Rebuttal effectiveness',
        'Clarity and articulation',
        'Confidence and delivery',
        'Overall impact'
      ],
      societyLink: '#student-union'
    },
    'khandan': {
      day: '2',
      title: 'खंडन’26',
      society: 'वाग्मिता – DebSoc',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/खंडन’26.png',
      description: 'खंडन’26 एक हिंदी वाद-विवाद प्रतियोगिता है जिसमें प्रतिभागी पारंपरिक वाद-विवाद प्रारूप में तर्क और प्रत्युत्तर प्रस्तुत करते हैं, जहाँ विषय प्रत्येक चरण से पहले घोषित किया जाता है।',
      format: [
        'चरण 1: पारंपरिक वाद-विवाद (विषय 24 घंटे पूर्व घोषित किया जाएगा)',
        'चरण 2: पारंपरिक वाद-विवाद (विषय 10 मिनट पूर्व घोषित किया जाएगा)'
      ],
      rules: [
        'स्नातक एवं स्नातकोत्तर छात्रों के लिए खुला',
        'वाद-विवाद पूर्णतः हिंदी भाषा में आयोजित होगा',
        'प्रत्येक प्रतिभागी को 3 मिनट वक्तव्य और 1 मिनट प्रत्युत्तर/प्रश्नोत्तर के लिए मिलेगा',
        'पंजीकरण निःशुल्क है; ₹100 की वापसी योग्य सुरक्षा राशि लागू होगी',
        'सीमित स्थान; अंतिम चयन आयोजन समिति के विवेक पर निर्भर करेगा'
      ],
      judging: [
        'तर्क और विषयवस्तु की गुणवत्ता',
        'प्रत्युत्तर की प्रभावशीलता',
        'स्पष्टता और अभिव्यक्ति',
        'आत्मविश्वास और प्रस्तुति',
        'समग्र प्रभाव'
      ],
      societyLink: '#student-union'
    },
    'jhalak': {
      day: '1',
      title: 'Jhalak',
      society: 'Illuminati – Photography Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Jhalak.png',
      description: 'JHALAK is an on-the-spot photography competition where participants are given a theme or subject on the spot and must capture the best possible shot within the given time, testing eye for detail, spontaneity, and creativity behind the lens.',
      format: [
        'Theme or subject is given on the spot',
        'Participants capture photographs within the given time',
        'Best shot is evaluated based on creativity and execution'
      ],
      rules: [
        'Participants must adhere to the given theme or subject',
        'Photos must be captured within the allotted time only',
        'Basic editing may be allowed unless specified otherwise',
        'Any form of plagiarism or use of old photos will lead to disqualification',
        'Participants must follow event guidelines and instructions'
      ],
      judging: [
        'Creativity and originality',
        'Eye for detail',
        'Composition and framing',
        'Relevance to theme',
        'Overall impact'
      ],
      societyLink: '#student-union'
    },
    'cinematica': {
      day: '2',
      title: 'Cinematica',
      society: 'Illuminati – Photography Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Cinematica.png',
      description: 'CINEMATICA is an on-the-spot reel making competition that challenges participants to unleash their storytelling skills within just 30 seconds where everything from concept to execution happens in real time.',
      format: [
        'On-the-spot reel making competition',
        'Participants create a reel within 30 seconds duration',
        'Concept, shooting, and execution happen in real time'
      ],
      rules: [
        'Reel must be created within the given time frame',
        'Duration must not exceed 30 seconds',
        'Content must be original and created on the spot',
        'Any inappropriate content will lead to disqualification',
        'Participants must follow event guidelines'
      ],
      judging: [
        'Storytelling and concept',
        'Creativity and originality',
        'Execution and editing',
        'Engagement and impact',
        'Overall presentation'
      ],
      societyLink: '#student-union'
    },
    'pixel': {
      day: '1',
      title: 'Pixel 6.0',
      society: 'Illuminati – Photography Society',
      time: 'TBA',
      location: 'Online',
      poster: 'images/posters/Pixel 6.0.png',
      description: 'PIXEL-6.0 is an online photo story competition where participants submit a series of photographs that together narrate a compelling story, with each image building on the last to create a powerful visual narrative.',
      format: [
        'Participants submit a series of photographs',
        'Images must collectively narrate a story',
        'Entries are evaluated as a complete visual narrative'
      ],
      rules: [
        'Photos must form a continuous and meaningful story',
        'Images must be original and captured by the participant',
        'Basic editing is allowed unless specified otherwise',
        'Any plagiarism will lead to disqualification',
        'Submission must follow the given guidelines and format'
      ],
      judging: [
        'Storytelling and narrative flow',
        'Creativity and originality',
        'Visual consistency',
        'Composition and technique',
        'Overall impact'
      ],
      societyLink: '#student-union'
    },
    'lenscraft': {
      day: '2',
      title: 'Lenscraft',
      society: 'Illuminati – Photography Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Lenscraft.png',
      description: 'LENSCRAFT is an exclusive photography exhibition showcasing stunning visuals, breathtaking landscapes, intimate portraits, and thought-provoking compositions, celebrating the art of photography and creative perspectives.',
      format: [
        'Photography exhibition showcasing selected works',
        'Display of landscapes, portraits, and conceptual compositions',
        'Open viewing for audience'
      ],
      rules: [
        'Exhibited works must be original',
        'Selected entries will be curated by the organizing team',
        'Any inappropriate or plagiarized content will be disqualified',
        'Participants must follow exhibition guidelines'
      ],
      judging: [
        'Visual appeal and aesthetics',
        'Creativity and perspective',
        'Technical excellence',
        'Concept and depth',
        'Overall presentation'
      ],
      societyLink: '#student-union'
    },
    'draped_duality': {
      day: '1',
      title: 'Draped Duality',
      society: 'Maniera – Fashion & Art Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Draped Duality.png',
      description: 'Draped Duality is a Newspaper Dressing Competition where teams transform everyday newspaper into extraordinary wearable art under the theme "Contrast of Two Things", embodying duality such as chaos and calm, tradition and modernity, strength and fragility.',
      format: [
        'Team of 3–4 members',
        'Newspapers are provided on the spot',
        'Duration: 4 hours to design, construct, and present the outfit',
        'Each team is assigned a random prop via lottery to be incorporated',
        'Presentation of the outfit concept is part of the event'
      ],
      rules: [
        'Only newspapers provided on the spot must be used',
        'Teams must incorporate the assigned random prop',
        'Outfit must reflect the theme "Contrast of Two Things"',
        'Participants must complete design and construction within 4 hours',
        'Presentation of concept is mandatory',
        'Open to all college students'
      ],
      judging: [
        'Creativity and concept of duality',
        'Innovation in use of newspaper',
        'Craftsmanship and construction',
        'Presentation and storytelling',
        'Overall visual impact'
      ],
      societyLink: '#student-union'
    },
    'reframe_the_fame': {
      day: '1',
      title: 'Reframe the Fame',
      society: 'Maniera – Fashion & Art Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Reframe the Fame.png',
      description: 'Reframe the Fame is a solo painting competition where the theme is revealed on the spot, giving participants an unscripted starting point to interpret and bring their vision to life.',
      format: [
        'Solo participation',
        'Theme revealed on the spot',
        'A3 sheet provided by organisers',
        'Participants bring their own art materials',
        'Duration: 2 hours'
      ],
      rules: [
        'Participants must bring their own art materials',
        'Artwork must be created within the given time',
        'Theme must be followed strictly',
        'Any plagiarism will lead to disqualification',
        'Open to all college students'
      ],
      judging: [
        'Creativity and interpretation of theme',
        'Artistic skills and technique',
        'Composition and use of space',
        'Originality',
        'Overall presentation'
      ],
      societyLink: '#student-union'
    },
    'syncstroke': {
      day: '2',
      title: 'SyncStroke',
      society: 'Maniera – Fashion & Art Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/SyncStroke.png',
      description: 'SyncStroke is a duo painting competition that tests artistic ability, intuition, adaptability, and unspoken connection where the canvas becomes a silent conversation between two artists.',
      format: [
        'Duo participation',
        'Theme announced on the spot',
        'Duration: 2.5 hours',
        'Member 1 paints solo for first 30 minutes while Member 2 observes',
        'Roles switch every 30 minutes with new surprise elements introduced',
        'Final 30 minutes: both members collaborate to complete the artwork'
      ],
      rules: [
        'Participants cannot communicate about the artwork during the competition',
        'Each 30-minute round must incorporate the surprise element',
        'Both members must follow the relay format strictly',
        'Artwork must be completed within 2.5 hours',
        'Open to all college students'
      ],
      judging: [
        'Coordination and synchrony',
        'Creativity and adaptability',
        'Incorporation of surprise elements',
        'Artistic quality and technique',
        'Final composition and impact'
      ],
      societyLink: '#student-union'
    },
    'envogue_group': {
      day: '1',
      title: 'Envogue - Group',
      society: 'Naksh – Fashion Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/envogue_group.png',
      description: 'ENVOGUE is the flagship fashion event presented by Naksh featuring a group competition conducted in two rounds where teams showcase creativity, style, and execution through choreographed performances.',
      format: [
        'Round 1: Teams submit a video of any previous performance with complete choreography',
        'Shortlisting based on creativity, style, and execution',
        'Round 2: Shortlisted teams perform live on stage',
        'Team size: 4–12 models with up to 5 creative members',
        'Performance time limit: 8–12 minutes (inclusive of setup)'
      ],
      rules: [
        'No restrictions on theme',
        'Participants must carry their audio tracks on a pen drive',
        'Participants must have valid student IDs',
        'Teams must bring their own props and are responsible for their belongings',
        'Any vulgarity, obscenity, or unfair practices will lead to immediate disqualification',
        'Participants grant permission for use of performance videos for promotional purposes',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Costumes and styling',
        'Theme interpretation',
        'Choreography',
        'Stage presence',
        'Walking stance and attitude',
        'Overall impact'
      ],
      societyLink: '#student-union'
    },
    'envogue_solo': {
      day: '2',
      title: 'Envogue - Solo',
      society: 'Naksh – Fashion Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/envogue_solo.png',
      description: 'ENVOGUE Solo Competition features individual participants performing live on stage where creativity, ramp walk, and expressions define their presence and impact.',
      format: [
        'Single round live performance at college premises',
        'Solo participation',
        'Performance time limit: up to 1 minute'
      ],
      rules: [
        'No restrictions on theme',
        'Participants must carry their audio track on a pen drive',
        'Participants must have a valid student ID',
        'Participants must bring their own props and are responsible for their belongings',
        'Any vulgarity, obscenity, or unfair practices will lead to immediate disqualification',
        'Participants grant permission for use of performance videos for promotional purposes',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Outfit and styling',
        'Creativity',
        'Ramp walk',
        'Expressions',
        'Stage presence',
        'Overall impact'
      ],
      societyLink: '#student-union'
    },
    'mridang': {
      day: '1',
      title: 'Mridang',
      society: 'Nrityaang – Dance Society',
      time: 'TBA',
      location: 'Auditorium',
      poster: 'images/posters/mridang.png',
      description: 'MRIDANG is a solo classical dance competition featuring Indian classical dance forms such as Bharatanatyam, Kathak, Odissi where participants showcase technique, expression, and discipline across online prelims and on-campus finals.',
      format: [
        'Round 1: Preliminary Round (Online Mode) – Solo performance video submission (maximum 2 minutes)',
        'Maximum 3 entries per college',
        'Round 2: Finals (On-Campus) – Live stage performance',
        'Performance duration: 6–8 minutes with total 8 minutes including setup'
      ],
      rules: [
        'Only Indian classical dance forms are permitted',
        'Bollywood songs are strictly prohibited',
        'Music should be purely classical',
        'Use of flowers, colours, and smoke is strictly prohibited',
        'Participants must adhere to the time limits',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Technique and form',
        'Expression and abhinaya',
        'Rhythm and musicality',
        'Stage presence',
        'Overall performance'
      ],
      societyLink: '#student-union'
    },
    'uthaan': {
      day: '2',
      title: 'Uthaan',
      society: 'Nrityaang – Dance Society',
      time: 'TBA',
      location: 'Auditorium',
      poster: 'images/posters/uthaan.png',
      description: 'UTHAAN is a group folk dance competition where teams present traditional and authentic performances showcasing cultural richness, energy, and coordination across online prelims and on-campus finals.',
      format: [
        'Round 1: Preliminary Round (Online Mode) – Group performance video (3–4 minutes)',
        'Team size: minimum 6 members and maximum 12 members',
        'Round 2: Finals (On-Campus) – Live stage performance',
        'Performance duration: 7–10 minutes including setup with total 10 minutes allotted'
      ],
      rules: [
        'Music must be traditional and authentic',
        'Bollywood songs are not allowed',
        'Team size must be between 6 and 12 members',
        'Use of flowers, colours, and smoke is strictly prohibited',
        'Participants must adhere to the time limits',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Coordination and synchronization',
        'Authenticity of folk style',
        'Energy and execution',
        'Choreography and formations',
        'Overall impact'
      ],
      societyLink: '#student-union'
    },
    'evince': {
      day: '1',
      title: 'Evince',
      society: 'Vagmita – Poetry Society',
      time: '10:00 AM - 12:30 PM',
      location: 'Keshav Mahavidyalaya',
      poster: 'images/posters/Evince.png',
      description: 'Evince is the English Poetry Competition featuring two rounds where participants showcase creativity, content, and performance through written and live poetry.',
      format: [
        'Round 1: Call for entries via Google Forms and shortlisting participants',
        'Judgement based on creativity, content, and flow',
        'Round 2: Live Performance Round with shortlisted participants',
        'Venue: Keshav Mahavidyalaya'
      ],
      rules: [
        'Participants must submit original poetry',
        'Shortlisted participants will perform live',
        'Participants must adhere to the given format and guidelines',
        'Professionalism must be maintained throughout the event',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Creativity and originality',
        'Content quality',
        'Flow and structure',
        'Performance and delivery',
        'Overall impact'
      ],
      societyLink: '#student-union'
    },
    'irshaad': {
      day: '2',
      title: 'Irshaad',
      society: 'Vagmita – Poetry Society',
      time: '3:00 PM - 4:30 PM',
      location: 'Keshav Mahavidyalaya',
      poster: 'images/posters/Irshaad.png',
      description: 'Irshaad is the Hindi/Urdu Poetry Competition featuring two rounds where participants present their poetry through written submissions and live performance.',
      format: [
        'Round 1: Call for entries via Google Forms and shortlisting participants',
        'Judgement based on creativity, content, and flow',
        'Round 2: Live Performance Round with shortlisted participants',
        'Venue: Keshav Mahavidyalaya'
      ],
      rules: [
        'Participants must submit original poetry in Hindi/Urdu',
        'Shortlisted participants will perform live',
        'Participants must adhere to the given format and guidelines',
        'Professionalism must be maintained throughout the event',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Creativity and originality',
        'Content quality',
        'Flow and expression',
        'Performance and delivery',
        'Overall impact'
      ],
      societyLink: '#student-union'
    },
    'kaaghaz': {
      day: '2',
      title: 'Kaaghaz',
      society: 'Vagmita – Poetry Society',
      time: '1:00 PM - 2:30 PM',
      location: 'Keshav Mahavidyalaya',
      poster: 'images/posters/Kaaghaz.png',
      description: 'Kaaghaz is a bilingual creative writing competition where participants write entries on given prompts within a stipulated time, focusing on creativity and expression.',
      format: [
        'Single round competition',
        'Participants write on given prompts',
        'Duration: 1 hour + 15 minutes',
        'Venue: Keshav Mahavidyalaya'
      ],
      rules: [
        'Participants must write original content',
        'Entries must be completed within the given time',
        'Participants must adhere to the given prompts',
        'Professionalism must be maintained',
        'Judges decision will be final and binding'
      ],
      judging: [
        'Content quality',
        'Creativity',
        'Grammar and language',
        'Relevance to prompts',
        'Overall impact'
      ],
      societyLink: '#student-union'
    },
    'baithak_street': {
      day: '1',
      title: 'Baithak Street',
      society: 'Shades – Dramatics Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Baithak Street.png',
      description: 'Baithak Street is a dynamic Nukkad Natak competition where teams compete and present performances rooted in tradition yet deeply relevant, using theatre to question, inform, and spark conversations on pressing social issues.',
      format: [
        'Nukkad Natak group performances',
        'Teams perform on topics of their choice',
        'Multiple teams compete against each other'
      ],
      rules: [
        'No team limit and no time limit',
        'Teams can perform on any topic of their choice',
        'No electronic instruments allowed',
        'Teams must carry their own instruments',
        'Participants must follow event guidelines'
      ],
      judging: [
        'Acting',
        'Clarity of the topic',
        'Direction'
      ],
      societyLink: '#student-union'
    },
    'baithak_mime': {
      day: '2',
      title: 'Baithak Mime',
      society: 'Shades – Dramatics Society',
      time: 'TBA',
      location: 'TBA',
      poster: 'images/posters/Baithak Mime.png',
      description: 'Baithak Mime is a silent storytelling competition where participants use body language, expressions, and movement to communicate powerful narratives.',
      format: [
        'Mime group performances',
        'Expression through body language and movement only',
        'Sound will be provided at the venue'
      ],
      rules: [
        'Maximum 15 members per team',
        'Time limit: 15 minutes (no minimum time limit)',
        'No dialogues allowed',
        'Teams must carry their own makeup and costumes',
        'Teams must carry their own lights (no lighting setup will be provided)',
        'Participants must follow event guidelines'
      ],
      judging: [
        'Acting',
        'Clarity of the topic',
        'Direction',
        'Music and lighting',
        'Body language',
        'Makeup and costumes'
      ],
      societyLink: '#student-union'
    }
  };

  const $ = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const listHTML = items => `<ul>${(Array.isArray(items) ? items : [items]).filter(Boolean).map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
  const eventOrder = Array.from(new Set(
    Array.from(document.querySelectorAll('.event-header[data-event-id], .events-modal-item[data-event-id]'))
      .map(el => el.dataset.eventId)
      .filter(Boolean)
  ));

  function attr(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function eventHeader(id) {
    return document.querySelector(`.event-header[data-event-id="${attr(id)}"], .schedule-event[data-event-id="${attr(id)}"] .event-header`);
  }

  function eventRow(id) {
    const header = eventHeader(id);
    return header?.closest('.schedule-event') || document.querySelector(`.schedule-event[data-event-id="${attr(id)}"]`);
  }

  function eventModalItem(id) {
    return document.querySelector(`.events-modal-item[data-event-id="${attr(id)}"]`);
  }

  function posterForTag(tag) {
    const value = String(tag || '').toLowerCase();
    if (value.includes('music')) return 'images/posters/crowd.webp';
    if (value.includes('art') || value.includes('photo') || value.includes('media')) return 'images/posters/gallery.jpg';
    if (value.includes('theatre') || value.includes('debate') || value.includes('poetry') || value.includes('writing')) return 'images/posters/entry.webp';
    return 'images/posters/stage.webp';
  }

  function inferEventData(id) {
    const header = eventHeader(id);
    const item = eventModalItem(id);
    const title = header?.querySelector('.event-title')?.textContent.trim()
      || item?.querySelector('.events-modal-name')?.textContent.trim()
      || id.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    const tag = header?.querySelector('.event-tag')?.textContent.trim()
      || item?.querySelector('.events-modal-tag')?.textContent.trim()
      || 'Event';
    const row = eventRow(id);
    const dayPanel = row?.closest('.schedule-day') || item?.closest('.events-modal-day');
    const time = row?.querySelector('.event-time')?.textContent.trim() || '';

    return {
      day: dayPanel?.dataset.day || dayPanel?.dataset.eventsDay || '1',
      title,
      society: `${tag} Society`,
      time,
      location: 'TRYST 2026 Venue',
      poster: posterForTag(tag),
      description: `${title} is a TRYST 2026 ${tag.toLowerCase()} event crafted for focused, high-energy participation.`,
      format: ['Register through the event form.', 'Participants perform or compete in the slot assigned by organisers.', 'Final round details will be shared by the organising society.'],
      rules: commonRules,
      judging: commonJudging,
      societyLink: '#student-union'
    };
  }

  function getEventData(id) {
    return { ...inferEventData(id), ...(TRYST_EVENTS[id] || {}) };
  }

  function setStatus(el, message, type = '') {
    if (!el) return;
    el.textContent = message || '';
    el.classList.remove('is-success', 'is-error');
    if (type) el.classList.add(`is-${type}`);
  }

  function setButtonLoading(btn, loading, text) {
    if (!btn) return;
    const inner = btn.querySelector('.reg-submit-inner, .ed-register-inner') || btn;
    if (!btn.dataset.defaultText) btn.dataset.defaultText = inner.textContent;
    btn.classList.toggle('reg-loading', loading);
    btn.disabled = loading;
    inner.textContent = loading ? text : btn.dataset.defaultText;
  }

  function resetButtonText(btn) {
    if (!btn) return;
    const inner = btn.querySelector('.reg-submit-inner, .ed-register-inner') || btn;
    inner.textContent = btn.dataset.defaultText || inner.textContent;
    btn.disabled = false;
    btn.classList.remove('reg-loading');
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('Could not read file.'));
      reader.readAsDataURL(file);
    });
  }

  const toBase64 = fileToBase64;
  window.toBase64 = toBase64;

  function postJSON(payload) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = POST_URL;
    form.target = "hidden_iframe";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "data";
    input.value = JSON.stringify(payload);

    form.appendChild(input);
    document.body.appendChild(form);

    form.submit();

    // ✅ fake success response
    return Promise.resolve({
      status: "success",
      regId: "SUBMITTED"
    });
  }

  function responseId(data) {
    return data?.regId || data?.registrationId || data?.id || data?.RegID || data?.regID || '';
  }

  function markInvalid(input) {
    if (!input) return;
    input.classList.add('reg-error');
    if (!window.gsap) return;
    gsap.fromTo(input, { x: -4 }, {
      x: 4,
      repeat: 4,
      yoyo: true,
      duration: 0.07,
      onComplete: () => gsap.set(input, { x: 0 })
    });
  }

  function validateRequired(inputs) {
    let valid = true;
    inputs.forEach(input => {
      const missingFile = input.type === 'file' && !input.files?.length;
      const missingValue = input.type !== 'file' && !String(input.value || '').trim();
      if ((input.required || input.dataset.required === 'true') && (missingFile || missingValue)) {
        valid = false;
        markInvalid(input);
      } else {
        input.classList.remove('reg-error');
      }
    });
    return valid;
  }

  function resetUploadZone(input) {
    const zone = input.closest('.reg-upload-zone');
    const preview = zone?.querySelector('.reg-upload-preview');
    if (preview) {
      preview.textContent = '';
      preview.innerHTML = '';
      preview.removeAttribute('style');
    }
    zone?.classList.remove('reg-has-file');
  }

  function bindUploadLabel(input) {
    if (!input) return;
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      const zone = input.closest('.reg-upload-zone');
      const preview = zone?.querySelector('.reg-upload-preview');
      if (!file || !zone || !preview) return;
      preview.innerHTML = `Added<br>${escapeHTML(file.name)}`;
      preview.style.backgroundImage = 'none';
      preview.style.display = 'flex';
      preview.style.alignItems = 'center';
      preview.style.justifyContent = 'center';
      preview.style.fontSize = '12px';
      preview.style.color = '#C9A84C';
      preview.style.textAlign = 'center';
      preview.style.padding = '10px';
      zone.classList.add('reg-has-file');
    });
  }

  document.querySelectorAll('.reg-file-input').forEach(bindUploadLabel);

  function renderEventsModal() {
    ['1', '2'].forEach(day => {
      const wrap = document.querySelector(`.events-modal-day[data-events-day="${day}"]`);
      if (!wrap) return;
      wrap.innerHTML = eventOrder
        .filter(id => getEventData(id).day === day)
        .map(id => {
          const event = getEventData(id);
          return `
            <div class="events-modal-item" data-event-id="${id}">
              <div class="events-modal-row" onclick="toggleEventsModalItem(this)">
                <div>
                  <span class="events-modal-tag">${escapeHTML(event.society)}</span>
                  <div class="events-modal-name">${escapeHTML(event.title)}</div>
                </div>
                <span class="events-modal-arrow">&rsaquo;</span>
              </div>
              <div class="events-modal-body">
                <p>${escapeHTML(event.description)}</p>
                <button class="know-more-btn" data-event-id="${id}" data-day="${event.day}" onclick="goToEvent(this)">Open Event</button>
              </div>
            </div>`;
        }).join('');
    });
  }

  function syncScheduleLabels() {
    eventOrder.forEach(id => {
      const tag = eventHeader(id)?.querySelector('.event-tag');
      if (tag) tag.textContent = getEventData(id).society;
    });
  }

  function setScheduleDay(day) {
    document.querySelectorAll('.schedule-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.day === day));
    document.querySelectorAll('.schedule-day').forEach(panel => {
      const active = panel.dataset.day === day;
      panel.classList.toggle('active', active);
      if (active) {
        panel.querySelectorAll('.fade-up').forEach(el => {
          el.classList.add('visible');
          el.style.opacity = 1;
          el.style.transform = 'none';
        });
      }
    });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  const edOverlay = $('edOverlay');
  const edModal = $('edModal');
  const edCard = $('edCard');
  const edCloseBtn = $('edCloseBtn');
  const edRegBtn = $('edRegisterBtn');
  const edSocietyLink = $('edSocietyLink');

  function openEventDetailById(eventId) {
    const event = getEventData(eventId);
    if (event) window.openEventDetailModal({ ...event, eventId });
  }

  window.toggleEvent = function(header) {
    const id = header?.dataset?.eventId || header?.closest('.schedule-event')?.dataset?.eventId;
    if (id) openEventDetailById(id);
  };

  window.openEventDetail = function(source) {
    const eventId = source?.dataset?.eventId || source?.closest('[data-event-id]')?.dataset?.eventId;
    if (!eventId) return;
    if (source.closest('#modal-events')) {
      window.goToEvent({ dataset: { eventId, day: getEventData(eventId).day } });
      return;
    }
    openEventDetailById(eventId);
  };

  window.goToEvent = function(source) {
    const eventId = typeof source === 'string' ? source : source?.dataset?.eventId;
    if (!eventId) return;
    const event = getEventData(eventId);
    const day = typeof source === 'string' ? event?.day : source?.dataset?.day || event?.day;

    if (typeof window.closeModal === 'function') closeModal();
    setTimeout(() => {
      const schedule = $('schedule');
      if (!schedule) return;
      gsap.to(window, {
        scrollTo: { y: schedule, offsetY: 76 },
        duration: 0.85,
        ease: 'expo.inOut',
        onComplete: () => {
          setScheduleDay(day);
          const row = eventRow(eventId);
          if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => openEventDetailById(eventId), 320);
        }
      });
    }, 220);
  };

  window.openEventDetailModal = function(event) {
    const data = event.eventId ? getEventData(event.eventId) : event;
    if (!data || !edModal) return;

    $('edTag').textContent = data.society || 'Organising Society';
    $('edTitle').textContent = data.title || 'Event';
    $('edMeta').textContent = [data.time, data.location].filter(Boolean).join(' | ');
    $('edDesc').textContent = data.description || '';
    $('edFormat').innerHTML = listHTML(data.format);
    $('edRules').innerHTML = listHTML(data.rules);
    $('edJudging').innerHTML = listHTML(data.judging);

    const poster = $('edPosterImg');
    if (poster) {
      poster.src = data.poster || '';
      poster.alt = data.title || 'Event poster';
    }

    if (edRegBtn) {
      edRegBtn.dataset.eventId = event.eventId || '';
      edRegBtn.dataset.eventTitle = data.title || 'Event';
    }
    if (edSocietyLink) edSocietyLink.href = data.societyLink || '#student-union';

    const scrollWrap = document.querySelector('.ed-desc-scroll');
    if (scrollWrap) scrollWrap.scrollTop = 0;

    edOverlay?.classList.add('ed-active');
    edModal.classList.add('ed-active');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(edCard, { opacity: 0, scale: 0.91, y: 18 }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.38,
      ease: 'expo.out',
      clearProps: 'transform'
    });
  };

  window.closeEventDetailModal = function() {
    if (!edModal?.classList.contains('ed-active')) return;
    gsap.to(edCard, {
      opacity: 0,
      scale: 0.93,
      y: 12,
      duration: 0.24,
      ease: 'power3.in',
      onComplete: () => {
        edOverlay?.classList.remove('ed-active');
        edModal.classList.remove('ed-active');
        document.body.style.overflow = '';
        gsap.set(edCard, { clearProps: 'all' });
      }
    });
  };

  edRegBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const title = edRegBtn.dataset.eventTitle || 'Event';
    window.closeEventDetailModal();
    setTimeout(() => window.openEventRegModal?.(title), 280);
  }, true);

  edCloseBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.closeEventDetailModal();
  }, true);

  edOverlay?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.closeEventDetailModal();
  }, true);

  edSocietyLink?.addEventListener('click', event => {
    const target = document.querySelector(edSocietyLink.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    window.closeEventDetailModal();
    setTimeout(() => {
      gsap.to(window, { scrollTo: { y: target, offsetY: 76 }, duration: 0.75, ease: 'expo.inOut' });
    }, 260);
  });

  const attendeeForm = $('registrationForm');
  $('register-now-btn')?.addEventListener('click', () => {
    setStatus($('regStatus'), '');
    resetButtonText($('regSubmitBtn'));
  }, true);

  if (typeof window.openRegisterModal === 'function') {
    const openRegisterModalBase = window.openRegisterModal;
    window.openRegisterModal = function(...args) {
      setStatus($('regStatus'), '');
      resetButtonText($('regSubmitBtn'));
      return openRegisterModalBase.apply(this, args);
    };
  }

  attendeeForm?.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const status = $('regStatus');
    const submitBtn = $('regSubmitBtn');
    setStatus(status, '');

    if (!validateRequired(attendeeForm.querySelectorAll('input[required], select[required]'))) {
      setStatus(status, 'Please complete all required fields and uploads.', 'error');
      return;
    }

    setButtonLoading(submitBtn, true, 'Submitting...');
    try {
      const payload = {
        formType: 'attendee',
        name: $('reg-name').value.trim(),
        email: $('reg-email').value.trim(),
        phone: $('reg-phone').value.trim(),
        college: $('reg-college').value.trim(),
        course: $('reg-course').value.trim(),
        year: $('reg-year').value,
        gender: $('reg-gender').value,
        collegeId: await toBase64($('reg-college-id').files[0]),
        task1: await toBase64($('reg-sponsor-1').files[0]),
        task2: await toBase64($('reg-sponsor-2').files[0])
      };

      const result = await postJSON(payload);
      const id = responseId(result);
      setStatus(status, id ? `Registration successful. Reg ID: ${id}` : 'Registration successful.', 'success');
      attendeeForm.reset();
      attendeeForm.querySelectorAll('input[type="file"]').forEach(resetUploadZone);
    } catch (error) {
      setStatus(status, error.message || 'Could not submit right now. Please try again.', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  }, true);

  const eventReg = {
    currentEvent: 'Event Registration',
    selectedType: '',
    participantCount: 0
  };

  const eventRegOverlay = $('eventRegOverlay');
  const eventRegModal = $('eventRegModal');
  const eventRegCard = $('eventRegCard');
  const eventRegForm = $('eventRegForm');

  function showEventRegStep(step) {
    [1, 2, 3].forEach(i => {
      const panel = $(`eventRegStep${i}`);
      if (panel) panel.style.display = i === step ? 'flex' : 'none';
    });
    if (eventRegCard) gsap.from(eventRegCard, { y: 6, duration: 0.22, ease: 'expo.out' });
  }

  function resetEventReg() {
    eventReg.selectedType = '';
    eventReg.participantCount = 0;
    setStatus($('eventRegStatus'), '');
    if ($('eregParticipantsWrap')) $('eregParticipantsWrap').innerHTML = '';
    eventRegForm?.reset();
    eventRegForm?.querySelectorAll('input[type="file"]').forEach(resetUploadZone);
    document.querySelectorAll('.ereg-type-btn').forEach(btn => btn.classList.remove('selected'));
    resetButtonText($('eregFinalSubmit'));
    resetButtonText($('eregToStep3Btn'));
    showEventRegStep(1);
  }

  window.openEventRegModal = function(eventTitle = 'Event Registration') {
    eventReg.currentEvent = eventTitle;
    resetEventReg();
    if ($('eventRegTitle')) $('eventRegTitle').textContent = eventTitle;
    if ($('ereg-event-name')) $('ereg-event-name').value = eventTitle;
    const eyebrow = document.querySelector('#eventRegStep1 .reg-eyebrow');
    if (eyebrow) eyebrow.textContent = `TRYST 2026 | ${eventTitle}`;

    eventRegOverlay?.classList.add('reg-active');
    eventRegModal?.classList.add('reg-active');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(eventRegCard, { opacity: 0, scale: 0.91, y: 22 }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.42,
      ease: 'expo.out'
    });
  };

  window.closeEventRegModal = function() {
    if (!eventRegModal?.classList.contains('reg-active')) return;
    gsap.to(eventRegCard, {
      opacity: 0,
      scale: 0.93,
      y: 14,
      duration: 0.26,
      ease: 'power3.in',
      onComplete: () => {
        eventRegOverlay?.classList.remove('reg-active');
        eventRegModal.classList.remove('reg-active');
        document.body.style.overflow = '';
        gsap.set(eventRegCard, { clearProps: 'all' });
        resetEventReg();
      }
    });
  };

  function configureType(type) {
    eventReg.selectedType = type;
    eventReg.participantCount = type === 'solo' ? 1 : type === 'duo' ? 2 : 0;

    document.querySelectorAll('.ereg-type-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.type === type);
    });

    const heading = document.querySelector('.ereg-type-heading');
    if (heading) heading.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Registration`;

    const groupWrap = document.querySelector('.ereg-group-size-wrap');
    if (groupWrap) groupWrap.style.display = type === 'group' ? 'flex' : 'none';

    const brand = $('ereg-brand');
    const brandStar = document.querySelector('.ereg-brand-required');
    if (brand) {
      brand.required = true;
      brand.placeholder = type === 'solo' ? 'Stage name or participant name' : 'Team name';
    }
    if (brandStar) brandStar.style.display = 'inline';

    if (type === 'solo' || type === 'duo') generateParticipantFields(eventReg.participantCount);
    if (type === 'group' && $('eregParticipantsWrap')) $('eregParticipantsWrap').innerHTML = '';
    showEventRegStep(2);
  }

  function generateParticipantFields(count) {
    const wrap = $('eregParticipantsWrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    eventReg.participantCount = count;

    for (let i = 1; i <= count; i++) {
      const block = document.createElement('div');
      block.className = 'ereg-participant-block';
      block.innerHTML = `
        <div class="ereg-participant-num">Member ${i}${i === 1 ? ' - Main Contact' : ''}</div>
        <div class="reg-form-row">
          <div class="reg-field">
            <label class="reg-label font-rajdhani">Name <span class="reg-required">*</span></label>
            <input type="text" name="p${i}_name" class="reg-input ereg-input" placeholder="Full name" required />
          </div>
          <div class="reg-field">
            <label class="reg-label font-rajdhani">Phone <span class="reg-required">*</span></label>
            <input type="tel" name="p${i}_phone" class="reg-input ereg-input" placeholder="+91 00000 00000" required />
          </div>
        </div>
        <div class="reg-form-row">
          <div class="reg-field">
            <label class="reg-label font-rajdhani">Course <span class="reg-required">*</span></label>
            <input type="text" name="p${i}_course" class="reg-input ereg-input" placeholder="Course" required />
          </div>
          <div class="reg-field">
            <label class="reg-label font-rajdhani">Year <span class="reg-required">*</span></label>
            <select name="p${i}_year" class="reg-input reg-select ereg-input" required>
              <option value="" disabled selected>Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
        </div>
        <label class="reg-upload-zone ereg-member-upload" for="p${i}_idFile">
          <div class="reg-upload-preview"></div>
          <div class="reg-upload-placeholder">
            <span class="reg-upload-label font-cinzel">College ID</span>
            <span class="reg-upload-hint font-cormorant">Tap to upload</span>
          </div>
          <input type="file" id="p${i}_idFile" name="p${i}_idFile" class="reg-file-input ereg-input" accept="image/*,.pdf" required />
        </label>`;
      wrap.appendChild(block);
      bindUploadLabel(block.querySelector('input[type="file"]'));
      gsap.from(block, { opacity: 0, y: 10, duration: 0.25, delay: i * 0.04, ease: 'expo.out' });
    }
  }

  function visibleEventInputs() {
    return Array.from(eventRegForm.querySelectorAll('.ereg-input')).filter(input => {
      if (input.readOnly) return false;
      return input.offsetParent !== null || input.type === 'file';
    });
  }

  function validateEventStep() {
    if (eventReg.selectedType === 'group' && !$('ereg-group-count').value) {
      markInvalid($('ereg-group-count'));
      return false;
    }
    if (!eventReg.participantCount) return false;
    return validateRequired(visibleEventInputs());
  }

  function memberField(index, key) {
    return eventRegForm.querySelector(`[name="p${index}_${key}"]`);
  }

  async function buildEventPayload() {
    const members = [];
    for (let i = 1; i <= eventReg.participantCount; i++) {
      members.push({
        name: memberField(i, 'name')?.value.trim() || '',
        email: i === 1 ? $('ereg-main-email').value.trim() : '',
        phone: memberField(i, 'phone')?.value.trim() || '',
        course: memberField(i, 'course')?.value.trim() || '',
        year: memberField(i, 'year')?.value || '',
        idFile: await toBase64(memberField(i, 'idFile')?.files?.[0])
      });
    }

    return {
      event: eventReg.currentEvent,
      type: eventReg.selectedType,
      brand: $('ereg-brand').value.trim(),
      mainEmail: $('ereg-main-email').value.trim(),
      mainPhone: $('ereg-main-phone').value.trim(),
      college: $('ereg-college').value.trim(),
      members
    };
  }

  function fillEventConfirm() {
    $('confirm-event').textContent = eventReg.currentEvent;
    $('confirm-brand').textContent = $('ereg-brand').value.trim() || '-';
    $('confirm-college').textContent = $('ereg-college').value.trim();
    $('confirm-contact').textContent = `${$('ereg-main-email').value.trim()} | ${$('ereg-main-phone').value.trim()}`;
    $('confirm-type').textContent = eventReg.selectedType.charAt(0).toUpperCase() + eventReg.selectedType.slice(1);
    $('confirm-count').textContent = eventReg.participantCount;

    const list = $('confirm-participants-list');
    list.innerHTML = '';
    for (let i = 1; i <= eventReg.participantCount; i++) {
      const div = document.createElement('div');
      div.className = 'ereg-confirm-participant';
      div.textContent = `${i}. ${memberField(i, 'name')?.value || ''}`;
      list.appendChild(div);
    }
  }

  document.querySelectorAll('.ereg-type-btn').forEach(btn => {
    btn.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      configureType(btn.dataset.type);
    }, true);
  });

  eventRegForm?.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    $('eregToStep3Btn')?.click();
  }, true);

  $('eregGenBtn')?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const count = parseInt($('ereg-group-count').value, 10);
    if (!count) return markInvalid($('ereg-group-count'));
    generateParticipantFields(count);
  }, true);

  $('ereg-group-count')?.addEventListener('change', () => {
    const count = parseInt($('ereg-group-count').value, 10);
    if (count) generateParticipantFields(count);
  });

  $('eregBackBtn')?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    showEventRegStep(1);
  }, true);

  $('eregToStep3Btn')?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!validateEventStep()) {
      setStatus($('eventRegStatus'), 'Please complete all required event fields.', 'error');
      return;
    }
    setStatus($('eventRegStatus'), '');
    fillEventConfirm();
    showEventRegStep(3);
  }, true);

  $('eregBackToStep2Btn')?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    showEventRegStep(2);
  }, true);

  $('eregFinalSubmit')?.addEventListener('click', async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const status = $('eventRegStatus');
    const btn = $('eregFinalSubmit');
    setStatus(status, '');
    setButtonLoading(btn, true, 'Submitting...');
    try {
      const result = await postJSON(await buildEventPayload());
      const id = responseId(result);
      setStatus(status, id ? `Event registration successful. Reg ID: ${id}` : 'Event registration successful.', 'success');
      setButtonLoading(btn, false);
      btn.querySelector('.reg-submit-inner').textContent = 'Submitted';
      setTimeout(() => window.closeEventRegModal(), 2200);
    } catch (error) {
      setStatus(status, error.message || 'Could not submit right now. Please try again.', 'error');
      setButtonLoading(btn, false);
    }
  }, true);

  $('eventRegCloseBtn')?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.closeEventRegModal();
  }, true);

  eventRegOverlay?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.closeEventRegModal();
  }, true);

  renderEventsModal();
  syncScheduleLabels();
})();

/* =====================
   🔥 TRYST FORM PATCH
   Add this at the END of tryst-production.js
===================== */

(function formIntegration() {

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyQAna9huOq3pPHqSAAu86QmoNRV0I2oKPdakbNGdIHuQwKHCOnvlJiE5gfkPZF7rZn/exec';

  function toBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });
  }

  /* =====================
     🎫 ATTENDEE FORM
  ===================== */

  const attendeeForm = document.getElementById("registrationForm");

  if (attendeeForm) {
    attendeeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(attendeeForm);

    // convert files to base64 manually
    const collegeId = await toBase64(attendeeForm.collegeId.files[0]);
    const task1 = await toBase64(attendeeForm.task1.files[0]);
    const task2 = await toBase64(attendeeForm.task2.files[0]);

    const payload = {
      formType: "attendee",
      name: attendeeForm.name.value,
      email: attendeeForm.email.value,
      phone: attendeeForm.phone.value,
      college: attendeeForm.college.value,
      course: attendeeForm.course.value,
      year: attendeeForm.year.value,
      gender: attendeeForm.gender.value,
      collegeId,
      task1,
      task2
    };

    // 🔥 CREATE HIDDEN FORM (BYPASS CORS)
    const form = document.createElement("form");
    form.method = "POST";
    form.action = SCRIPT_URL;
    form.target = "hidden_iframe";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "data";
    input.value = JSON.stringify(payload);

    form.appendChild(input);
    document.body.appendChild(form);

    form.submit();

    alert("Submitted successfully!");
  });
  }


  /* =====================
     🎟️ EVENT FORM
  ===================== */

  const eventForm = document.getElementById("eventForm");

  if (eventForm) {
    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const f = eventForm;
        const type = f.type.value;

        const members = [];
        let i = 1;

        while (f[`name${i}`]) {
          members.push({
            name: f[`name${i}`].value,
            email: f[`email${i}`]?.value || "",
            phone: f[`phone${i}`].value,
            course: f[`course${i}`].value,
            year: f[`year${i}`].value,
            idFile: await toBase64(f[`id${i}`].files[0])
          });
          i++;
        }

        const data = {
          event: f.event.value,
          type: type,
          brand: f.brand.value,
          mainEmail: members[0]?.email || "",
          mainPhone: members[0]?.phone || "",
          members: members
        };

        // ✅ SUBMIT USING IFRAME (NO CORS)
        const form = document.createElement("form");
        form.method = "POST";
        form.action = SCRIPT_URL;
        form.target = "hidden_iframe";

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "data";
        input.value = JSON.stringify(data);

        form.appendChild(input);
        document.body.appendChild(form);

        form.submit();

        // ⏳ wait a bit for backend to write
        setTimeout(async () => {
          const regId = await getLatestRegId("Attendees");

          if (regId) {
            alert(`🎉 Registered! ID: ${regId}`);
          } else {
            alert("Submitted! Check email for confirmation.");
          }
        }, 2000);

        // ✅ FAKE SUCCESS (since no response)
        alert("🎉 Registration submitted successfully!");

        eventForm.reset();

        alert(`🎉 Registered! ID: ${result.regId}`);
        eventForm.reset();

      } catch (err) {
        console.error(err);
        alert("❌ Error submitting event form");
      }
    });
  }

})();

async function getLatestRegId(sheetName = "Attendees") {
  try {
    const res = await fetch(`${POST_URL}?sheet=${sheetName}`);
    const data = await res.json();

    if (data.status === "success") {
      return data.regId;
    }
  } catch (err) {
    console.error("Polling error:", err);
  }

  return null;
}