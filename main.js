import { FileText, Upload, Sparkles, Download, Copy, CheckCircle, Users, ListTodo, Target, Calendar, Clock, Info } from 'lucide';

class MeetingNotesGenerator {
  constructor() {
    this.app = document.getElementById('app');
    this.transcript = '';
    this.generatedNotes = null;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.app.innerHTML = `
      <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-primary-100 rounded-xl">
                <div id="header-icon"></div>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Meeting Notes Generator</h1>
                <p class="text-gray-600 text-sm sm:text-base mt-1">Buat catatan rapat otomatis dari transkrip</p>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            <!-- Input Section -->
            <div class="space-y-6">
              <div class="card animate-fade-in">
                <div class="flex items-center gap-2 mb-4">
                  <div id="upload-icon" class="text-primary-600"></div>
                  <h2 class="text-xl font-semibold text-gray-900">Input Transkrip</h2>
                </div>
                
                <div class="space-y-4">
                  <!-- File Upload Area -->
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors duration-200 cursor-pointer" id="dropzone">
                    <div id="file-icon" class="mx-auto text-gray-400 mb-3"></div>
                    <p class="text-gray-700 font-medium mb-1">Upload file transkrip</p>
                    <p class="text-sm text-gray-500 mb-3">atau seret dan letakkan di sini</p>
                    <input type="file" id="fileInput" class="hidden" accept=".txt,.doc,.docx">
                    <button id="uploadBtn" class="btn-secondary text-sm">
                      Pilih File
                    </button>
                    <p class="text-xs text-gray-400 mt-2">Format: TXT, DOC, DOCX</p>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="flex-1 h-px bg-gray-200"></div>
                    <span class="text-sm text-gray-500">atau</span>
                    <div class="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <!-- Text Input -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Paste Transkrip
                    </label>
                    <textarea 
                      id="transcriptInput" 
                      rows="12"
                      class="input-field resize-none font-mono text-sm"
                      placeholder="Contoh:

[09:00] John: Selamat pagi semua. Mari kita mulai rapat tim mingguan kita.

[09:01] Sarah: Minggu ini saya fokus pada fitur autentikasi pengguna. Sudah selesai 80%.

[09:02] Mike: Bagus Sarah. Saya sudah menyelesaikan integrasi API pembayaran.

[09:03] John: Sempurna. Action items untuk minggu depan:
- Sarah: Selesaikan fitur autentikasi
- Mike: Testing integrasi pembayaran
- Lisa: Design halaman dashboard

[09:05] Lisa: Saya akan kirim mockup dashboard hari Kamis.

[09:06] John: Terima kasih semua. Rapat ditutup."
                    ></textarea>
                  </div>

                  <!-- Meeting Info -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Judul Rapat
                      </label>
                      <input 
                        type="text" 
                        id="meetingTitle"
                        class="input-field"
                        placeholder="Rapat Tim Mingguan"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal
                      </label>
                      <input 
                        type="date" 
                        id="meetingDate"
                        class="input-field"
                      >
                    </div>
                  </div>

                  <button id="generateBtn" class="btn-primary w-full flex items-center justify-center gap-2">
                    <div id="sparkles-icon"></div>
                    <span>Generate Catatan Rapat</span>
                  </button>
                </div>
              </div>

              <!-- Sample Data -->
              <div class="card bg-blue-50 border-blue-200">
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-blue-100 rounded-lg shrink-0">
                    <div id="info-icon" class="text-blue-600"></div>
                  </div>
                  <div>
                    <h3 class="font-medium text-blue-900 mb-1">Tips Penggunaan</h3>
                    <ul class="text-sm text-blue-800 space-y-1">
                      <li>• Format transkrip dengan timestamp untuk hasil lebih baik</li>
                      <li>• Sebutkan nama peserta dengan jelas</li>
                      <li>• Tandai keputusan dan action items</li>
                      <li>• Gunakan contoh di atas sebagai referensi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Output Section -->
            <div class="space-y-6">
              <div id="outputSection" class="hidden">
                <div class="card animate-slide-up">
                  <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-2">
                      <div id="check-icon" class="text-green-600"></div>
                      <h2 class="text-xl font-semibold text-gray-900">Catatan Rapat</h2>
                    </div>
                    <div class="flex gap-2">
                      <button id="copyBtn" class="btn-secondary text-sm flex items-center gap-2">
                        <div id="copy-icon" class="w-4 h-4"></div>
                        <span class="hidden sm:inline">Salin</span>
                      </button>
                      <button id="downloadBtn" class="btn-primary text-sm flex items-center gap-2">
                        <div id="download-icon" class="w-4 h-4"></div>
                        <span class="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </div>

                  <div id="notesContent" class="space-y-6">
                    <!-- Content will be inserted here -->
                  </div>
                </div>
              </div>

              <!-- Placeholder -->
              <div id="placeholderSection" class="card text-center py-16">
                <div id="placeholder-icon" class="mx-auto text-gray-300 mb-4"></div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada catatan</h3>
                <p class="text-gray-500 text-sm max-w-sm mx-auto">
                  Masukkan transkrip rapat dan klik generate untuk membuat catatan rapat otomatis
                </p>
              </div>
            </div>
          </div>
        </main>

        <!-- Footer -->
        <footer class="mt-16 border-t border-gray-200 bg-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p class="text-center text-sm text-gray-500">
              © 2025 Meeting Notes Generator. Dibuat dengan Dualite Alpha.
            </p>
          </div>
        </footer>
      </div>
    `;

    this.renderIcons();
  }

  renderIcons() {
    const iconMap = {
      'header-icon': FileText,
      'upload-icon': Upload,
      'file-icon': FileText,
      'sparkles-icon': Sparkles,
      'info-icon': Info,
      'check-icon': CheckCircle,
      'copy-icon': Copy,
      'download-icon': Download,
      'placeholder-icon': FileText
    };

    Object.entries(iconMap).forEach(([id, IconComponent]) => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = ''; // Prevent duplicate icons
        const icon = IconComponent();
        icon.setAttribute('width', id.includes('placeholder') ? '64' : (id.includes('header') ? '32' : '20'));
        icon.setAttribute('height', id.includes('placeholder') ? '64' : (id.includes('header') ? '32' : '20'));
        icon.setAttribute('stroke-width', '2');
        element.appendChild(icon);
      }
    });
  }

  attachEventListeners() {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const dropzone = document.getElementById('dropzone');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const transcriptInput = document.getElementById('transcriptInput');

    uploadBtn?.addEventListener('click', () => fileInput?.click());
    
    fileInput?.addEventListener('change', (e) => this.handleFileUpload(e));
    
    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-primary-500', 'bg-primary-50');
    });
    
    dropzone?.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-primary-500', 'bg-primary-50');
    });
    
    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-primary-500', 'bg-primary-50');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.processFile(files[0]);
      }
    });

    generateBtn?.addEventListener('click', () => this.generateNotes());
    copyBtn?.addEventListener('click', () => this.copyNotes());
    downloadBtn?.addEventListener('click', () => this.downloadNotes());

    transcriptInput?.addEventListener('input', (e) => {
      this.transcript = e.target.value;
    });

    const meetingDate = document.getElementById('meetingDate');
    if (meetingDate) {
      meetingDate.value = new Date().toISOString().split('T')[0];
    }
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.transcript = e.target.result;
      const transcriptInput = document.getElementById('transcriptInput');
      if (transcriptInput) {
        transcriptInput.value = this.transcript;
      }
    };
    reader.readAsText(file);
  }

  generateNotes() {
    const transcriptInput = document.getElementById('transcriptInput');
    const meetingTitle = document.getElementById('meetingTitle');
    const meetingDate = document.getElementById('meetingDate');

    this.transcript = transcriptInput?.value || '';

    if (!this.transcript.trim()) {
      alert('Silakan masukkan transkrip rapat terlebih dahulu.');
      return;
    }

    const title = meetingTitle?.value || 'Rapat Tim';
    const date = meetingDate?.value || new Date().toISOString().split('T')[0];

    this.generatedNotes = this.processTranscript(this.transcript, title, date);
    this.displayNotes();
  }

  processTranscript(transcript, title, date) {
    const lines = transcript.split('\n').filter(line => line.trim());
    
    const attendees = new Set();
    const actionItems = [];
    const decisions = [];
    const keyPoints = [];
    let duration = '';

    const timePattern = /\[(\d{2}:\d{2})\]/g;
    const times = transcript.match(timePattern);
    
    if (times && times.length >= 2) {
      const startTime = times[0].replace(/[\[\]]/g, '');
      const endTime = times[times.length - 1].replace(/[\[\]]/g, '');
      duration = `${startTime} - ${endTime}`;
    }

    lines.forEach(line => {
      const speakerMatch = line.match(/\[?\d{2}:\d{2}\]?\s*([A-Za-z]+):/);
      if (speakerMatch) {
        attendees.add(speakerMatch[1]);
      }

      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('action') || lowerLine.includes('tugas') || lowerLine.includes('harus')) {
        const cleanLine = line.replace(/\[\d{2}:\d{2}\]\s*[A-Za-z]+:\s*/g, '').trim();
        if (cleanLine) actionItems.push(cleanLine);
      }

      if (lowerLine.includes('keputusan') || lowerLine.includes('setuju') || lowerLine.includes('diputuskan')) {
        const cleanLine = line.replace(/\[\d{2}:\d{2}\]\s*[A-Za-z]+:\s*/g, '').trim();
        if (cleanLine) decisions.push(cleanLine);
      }

      if (lowerLine.includes('selesai') || lowerLine.includes('progress') || lowerLine.includes('update')) {
        const cleanLine = line.replace(/\[\d{2}:\d{2}\]\s*[A-Za-z]+:\s*/g, '').trim();
        if (cleanLine && cleanLine.length > 20) keyPoints.push(cleanLine);
      }
    });

    const extractedActions = this.extractActionItems(lines);
    actionItems.push(...extractedActions);

    return {
      title,
      date,
      duration,
      attendees: Array.from(attendees),
      summary: this.generateSummary(lines),
      keyPoints: keyPoints.slice(0, 5),
      decisions: decisions.slice(0, 5),
      actionItems: Array.from(new Set(actionItems)).slice(0, 8)
    };
  }

  extractActionItems(lines) {
    const actions = [];
    const actionPattern = /[-•]\s*([A-Za-z]+):\s*(.+)/g;
    
    lines.forEach(line => {
      const matches = [...line.matchAll(actionPattern)];
      matches.forEach(match => {
        if (match[2]) {
          actions.push(`${match[1]}: ${match[2].trim()}`);
        }
      });
    });

    return actions;
  }

  generateSummary(lines) {
    const relevantLines = lines
      .filter(line => {
        const lower = line.toLowerCase();
        return !lower.includes('selamat') && 
               !lower.includes('terima kasih') && 
               line.length > 30;
      })
      .slice(0, 3);

    if (relevantLines.length === 0) {
      return 'Rapat membahas progress proyek dan mendiskusikan langkah-langkah selanjutnya untuk tim.';
    }

    return relevantLines
      .map(line => line.replace(/\[\d{2}:\d{2}\]\s*[A-Za-z]+:\s*/g, '').trim())
      .join(' ')
      .substring(0, 200) + '...';
  }

  displayNotes() {
    const outputSection = document.getElementById('outputSection');
    const placeholderSection = document.getElementById('placeholderSection');
    const notesContent = document.getElementById('notesContent');

    if (!this.generatedNotes) return;

    outputSection?.classList.remove('hidden');
    placeholderSection?.classList.add('hidden');

    const { title, date, duration, attendees, summary, keyPoints, decisions, actionItems } = this.generatedNotes;

    const formatDate = new Date(date).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    notesContent.innerHTML = `
      <!-- Header Info -->
      <div class="pb-6 border-b border-gray-200">
        <h3 class="text-2xl font-bold text-gray-900 mb-3">${title}</h3>
        <div class="flex flex-wrap gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <div id="calendar-icon-display"></div>
            <span>${formatDate}</span>
          </div>
          ${duration ? `
          <div class="flex items-center gap-2">
            <div id="clock-icon-display"></div>
            <span>${duration}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Attendees -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <div id="users-icon-display" class="text-primary-600"></div>
          <h4 class="font-semibold text-gray-900">Peserta (${attendees.length})</h4>
        </div>
        <div class="flex flex-wrap gap-2">
          ${attendees.map(name => `
            <span class="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
              ${name}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Summary -->
      <div>
        <h4 class="font-semibold text-gray-900 mb-3">Ringkasan</h4>
        <p class="text-gray-700 leading-relaxed">${summary}</p>
      </div>

      ${keyPoints.length > 0 ? `
      <!-- Key Points -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <div id="target-icon-display" class="text-primary-600"></div>
          <h4 class="font-semibold text-gray-900">Poin Penting</h4>
        </div>
        <ul class="space-y-2">
          ${keyPoints.map(point => `
            <li class="flex items-start gap-3">
              <span class="text-primary-600 mt-1">•</span>
              <span class="text-gray-700 flex-1">${point}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      ` : ''}

      ${decisions.length > 0 ? `
      <!-- Decisions -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <div id="check-icon-display" class="text-green-600"></div>
          <h4 class="font-semibold text-gray-900">Keputusan</h4>
        </div>
        <ul class="space-y-2">
          ${decisions.map(decision => `
            <li class="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <span class="text-green-600 mt-1">✓</span>
              <span class="text-gray-700 flex-1">${decision}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      ` : ''}

      <!-- Action Items -->
      ${actionItems.length > 0 ? `
      <div>
        <div class="flex items-center gap-2 mb-3">
          <div id="todo-icon-display" class="text-orange-600"></div>
          <h4 class="font-semibold text-gray-900">Action Items</h4>
        </div>
        <ul class="space-y-2">
          ${actionItems.map(item => `
            <li class="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <input type="checkbox" class="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500">
              <span class="text-gray-700 flex-1">${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      ` : ''}
    `;

    const displayIconMap = {
      'calendar-icon-display': Calendar,
      'clock-icon-display': Clock,
      'users-icon-display': Users,
      'target-icon-display': Target,
      'check-icon-display': CheckCircle,
      'todo-icon-display': ListTodo
    };

    Object.entries(displayIconMap).forEach(([id, IconComponent]) => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = ''; // Prevent duplicate icons
        const icon = IconComponent();
        icon.setAttribute('width', '20');
        icon.setAttribute('height', '20');
        icon.setAttribute('stroke-width', '2');
        element.appendChild(icon);
      }
    });
  }

  copyNotes() {
    if (!this.generatedNotes) return;

    const { title, date, duration, attendees, summary, keyPoints, decisions, actionItems } = this.generatedNotes;
    
    const formatDate = new Date(date).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    let text = `${title}\n`;
    text += `Tanggal: ${formatDate}\n`;
    if (duration) text += `Waktu: ${duration}\n`;
    text += `\n`;
    text += `PESERTA:\n${attendees.map(name => `- ${name}`).join('\n')}\n\n`;
    text += `RINGKASAN:\n${summary}\n\n`;
    
    if (keyPoints.length > 0) {
      text += `POIN PENTING:\n${keyPoints.map(point => `- ${point}`).join('\n')}\n\n`;
    }
    
    if (decisions.length > 0) {
      text += `KEPUTUSAN:\n${decisions.map(decision => `- ${decision}`).join('\n')}\n\n`;
    }
    
    if (actionItems.length > 0) {
      text += `ACTION ITEMS:\n${actionItems.map(item => `☐ ${item}`).join('\n')}\n`;
    }

    navigator.clipboard.writeText(text).then(() => {
      const copyBtn = document.getElementById('copyBtn');
      if (!copyBtn) return;
      
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<div class="w-4 h-4" id="temp-check"></div><span class="hidden sm:inline">Tersalin!</span>';
      
      const tempCheckContainer = document.getElementById('temp-check');
      if (tempCheckContainer) {
          const checkIcon = CheckCircle();
          checkIcon.setAttribute('width', '16');
          checkIcon.setAttribute('height', '16');
          tempCheckContainer.appendChild(checkIcon);
      }
      
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
      }, 2000);
    });
  }

  downloadNotes() {
    if (!this.generatedNotes) return;

    const { title, date, duration, attendees, summary, keyPoints, decisions, actionItems } = this.generatedNotes;
    
    const formatDate = new Date(date).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    let content = `${title}\n`;
    content += `${'='.repeat(title.length)}\n\n`;
    content += `Tanggal: ${formatDate}\n`;
    if (duration) content += `Waktu: ${duration}\n`;
    content += `\n`;
    content += `PESERTA (${attendees.length}):\n`;
    content += `${attendees.map(name => `  - ${name}`).join('\n')}\n\n`;
    content += `RINGKASAN:\n${summary}\n\n`;
    
    if (keyPoints.length > 0) {
      content += `POIN PENTING:\n`;
      content += `${keyPoints.map(point => `  • ${point}`).join('\n')}\n\n`;
    }
    
    if (decisions.length > 0) {
      content += `KEPUTUSAN:\n`;
      content += `${decisions.map(decision => `  ✓ ${decision}`).join('\n')}\n\n`;
    }
    
    if (actionItems.length > 0) {
      content += `ACTION ITEMS:\n`;
      content += `${actionItems.map(item => `  ☐ ${item}`).join('\n')}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-')}-${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

new MeetingNotesGenerator();
