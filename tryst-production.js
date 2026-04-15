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

  async function postJSON(payload) {
    const response = await fetch(POST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      throw new Error('Backend did not return JSON. Check the Apps Script deployment.');
    }

    const failedStatus = data?.status && data.status !== 'success';
    if (!response.ok || failedStatus || data?.ok === false || data?.success === false) {
      throw new Error(data?.message || 'Submission failed. Please try again.');
    }
    return data;
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

      try {
        const f = attendeeForm;

        const data = {
          formType: "attendee",
          name: f.name.value,
          email: f.email.value,
          phone: f.phone.value,
          college: f.college.value,
          course: f.course.value,
          year: f.year.value,
          gender: f.gender.value,
          collegeId: await toBase64(f.collegeId.files[0]),
          task1: await toBase64(f.task1.files[0]),
          task2: await toBase64(f.task2.files[0])
        };

        const res = await fetch(SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        alert(`🎉 Registered! ID: ${result.regId}`);
        attendeeForm.reset();

      } catch (err) {
        console.error(err);
        alert("❌ Error submitting form");
      }
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

        const res = await fetch(SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        alert(`🎉 Registered! ID: ${result.regId}`);
        eventForm.reset();

      } catch (err) {
        console.error(err);
        alert("❌ Error submitting event form");
      }
    });
  }

})();
