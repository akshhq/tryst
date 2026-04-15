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
      format: ['Traditional lamp lighting', 'Welcome address', 'Festival inauguration'],
      rules: ['Open to attendees and invited guests.', 'Please be seated before the ceremony begins.'],
      judging: ['This is a non-competitive ceremony.'],
      societyLink: '#student-union'
    },
    'nrityaang': {
      day: '1',
      title: 'Nrityaang - Mridang',
      society: 'Nrityaang Classical Dance Society',
      time: '10:00 AM - 11:20 AM',
      location: 'Auditorium',
      poster: 'images/posters/stage.webp',
      description: 'A solo classical dance event celebrating technique, expression, rhythm, and stage presence across Indian classical styles.',
      format: ['Solo classical performance', 'One prepared routine per participant', 'Music must follow event-team instructions'],
      rules: commonRules,
      judging: ['Technique and form', 'Expression', 'Rhythm and musicality', 'Stage presence'],
      societyLink: '#student-union'
    },
    'uthaan': {
      day: '1',
      title: 'Uthaan',
      society: 'Uthaan Folk Dance Society',
      time: '11:30 AM - 1:30 PM',
      location: 'Auditorium',
      poster: 'images/posters/crowd.webp',
      description: 'A group folk dance competition presenting regional traditions with authenticity, coordination, and celebratory energy.',
      format: ['Group folk dance performance', 'One routine per team', 'Safe props allowed'],
      rules: commonRules,
      judging: ['Authenticity of folk form', 'Synchronization', 'Costume and presentation', 'Energy'],
      societyLink: '#student-union'
    },
    'inaayat': {
      day: '1',
      title: 'Inaayat',
      society: 'Inaayat Western Dance Society',
      time: '1:30 PM - 6:30 PM',
      location: 'Auditorium',
      poster: 'images/posters/entry.webp',
      description: 'TRYST 2026s western group dance battle, built around choreography, precision, style, and stage command.',
      format: ['Group western dance performance', 'One routine per team', 'Recommended duration: 6 to 8 minutes'],
      rules: ['Only college teams may participate.', 'Minimum 5 members per team.', ...commonRules],
      judging: ['Choreography and formations', 'Synchronization and teamwork', 'Energy and execution', 'Creativity', 'Crowd connection'],
      societyLink: '#student-union'
    },
    'advaitaa': {
      day: '1',
      title: 'Advaitaa - Nazaat',
      society: 'Advaitaa Dance Society',
      time: '2:00 PM - 3:00 PM',
      location: 'Auditorium',
      poster: 'images/posters/artist.webp',
      description: 'A western solo dance event for performers who carry the stage with individual style, musicality, and command.',
      format: ['Solo western dance performance', 'One prepared routine per participant'],
      rules: commonRules,
      judging: ['Technique', 'Musicality', 'Originality', 'Stage presence'],
      societyLink: '#student-union'
    },
    'performance-showcase': {
      day: '1',
      title: 'Performance Showcase',
      society: 'TRYST Cultural Committee',
      time: '2:00 PM - 4:30 PM',
      location: 'Amphitheatre',
      poster: 'images/posters/support.webp',
      description: 'An open performance space for expressive acts that do not sit inside a single competition format.',
      format: ['Solo, duo, or group showcase slot', 'Open to campus-safe performance forms'],
      rules: ['Acts must be audience-appropriate.', 'Participants must follow stage and time instructions.'],
      judging: ['Creativity', 'Stage comfort', 'Audience connection'],
      societyLink: '#student-union'
    },
    'illuminati': {
      day: '2',
      title: 'Illuminati',
      society: 'Illuminati Quiz Society',
      time: '9:00 AM - 5:00 PM',
      location: 'Lecture Hall-2',
      poster: 'images/posters/stage.webp',
      description: 'A knowledge challenge for curious, quick-thinking participants across culture, science, history, literature, and current affairs.',
      format: ['Preliminary round', 'Shortlisted finalists move to moderated rounds'],
      rules: ['No unfair means or external help.', ...commonRules],
      judging: ['Accuracy', 'Speed', 'Breadth of knowledge', 'Tie-break performance'],
      societyLink: '#student-union'
    },
    'anhad': {
      day: '2',
      title: 'Anhad - Slaycapella',
      society: 'Anhad Music Society',
      time: '10:00 AM - 2:00 PM',
      location: 'Reading Room',
      poster: 'images/posters/crowd.webp',
      description: 'An a cappella event where every rhythm, harmony, and melodic layer is created by voice alone.',
      format: ['Group a cappella performance', 'No instrumental backing tracks'],
      rules: commonRules,
      judging: ['Vocal quality', 'Harmony and arrangement', 'Rhythm', 'Stage impact'],
      societyLink: '#student-union'
    },
    'baithak': {
      day: '2',
      title: 'Baithak + Vagmita Debsoc',
      society: 'Baithak Theatre Society and Vagmita Debating Society',
      time: '10:00 AM - 5:00 PM',
      location: 'Shades Lawn / Seminar Room',
      poster: 'images/posters/entry.webp',
      description: 'A parallel spoken-word stage where theatre meets structured debate, bringing performance and argument into one energetic day.',
      format: ['Street theatre or debate participation', 'Round details shared by organisers'],
      rules: commonRules,
      judging: ['Content clarity', 'Team coordination', 'Delivery', 'Adherence to format'],
      societyLink: '#student-union'
    },
    'vagmita-poetry': {
      day: '2',
      title: 'Vagmita Poetry - Irshaad',
      society: 'Vagmita Literary Society',
      time: '11:00 AM - 1:00 PM',
      location: 'LT-4',
      poster: 'images/posters/artist.webp',
      description: 'An open mic poetry event for original voices in Hindi, Urdu, English, or mixed-language performance.',
      format: ['Solo poetry or spoken-word performance', 'One slot per participant'],
      rules: ['Original work is preferred.', 'Plagiarism can lead to disqualification.', ...commonRules],
      judging: ['Originality', 'Language and imagery', 'Delivery', 'Emotional impact'],
      societyLink: '#student-union'
    },
    'maniera': {
      day: '2',
      title: 'Maniera: Atrang Rangmanch',
      society: 'Maniera Fine Arts Society',
      time: '11:00 AM - 3:00 PM',
      location: "Parking Area, Near Gill's Hostel",
      poster: 'images/posters/campus.webp',
      description: 'A visual arts showcase transforming festival spaces through installations, live art, murals, and mixed-media expression.',
      format: ['Outdoor art showcase or installation', 'Assigned space and setup instructions apply'],
      rules: ['No damage to campus property.', 'Materials must be safe for public spaces.', ...commonRules],
      judging: ['Creativity', 'Visual impact', 'Use of space', 'Craft and finish'],
      societyLink: '#student-union'
    },
    'chitrakala': {
      day: '2',
      title: 'Maniera: Chitrakala / Kala Sangini',
      society: 'Maniera Fine Arts Society',
      time: '11:00 AM - 2:00 PM',
      location: 'LT-1 and LT-3',
      poster: 'images/posters/support.webp',
      description: 'A fine arts competition for painting, sketching, mixed media, rangoli, and traditional decorative expression.',
      format: ['Individual or team visual art creation', 'Theme and medium instructions shared by organisers'],
      rules: ['Artwork must be original.', 'Workspace must be left clean.', ...commonRules],
      judging: ['Technique', 'Originality', 'Theme interpretation', 'Composition', 'Presentation'],
      societyLink: '#student-union'
    }
  };

  const eventOrder = Object.keys(TRYST_EVENTS);
  const $ = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const listHTML = items => `<ul>${(Array.isArray(items) ? items : [items]).filter(Boolean).map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
