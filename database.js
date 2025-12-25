// database.js - Separated database and initial data

// Simple hash function (used for passwords)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(36);
}

// Student Database (2800 students)
export const studentDB = {};
const allClasses = [
    { num: '3', secs: ['A','B','C','D','E','F','G'], sub: null },
    { num: '4', secs: ['A','B','C','D','E','F','G'], sub: null },
    { num: '5', secs: ['A','B','C','D','E','F','G'], sub: null },
    { num: '6', secs: ['A','B','C','D','E','F','G'], sub: null },
    { num: '7', secs: ['A','B','C','D','E','F','G'], sub: null },
    { num: '8', secs: ['A','B','C','D','E','F','G'], sub: null },
    { num: '9', secs: ['A','B','C'], sub: 'Hindi' },
    { num: '9', secs: ['D','E','F','G'], sub: 'Sanskrit' }
];

function generateValidDOB() {
    const year = 200 + Math.floor(Math.random() * 3) + 12;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

allClasses.forEach(c => {
    c.secs.forEach(s => {
        for (let i = 1; i <= 40; i++) {
            const id = `${c.num}${s}${String(i).padStart(3,'0')}`;
            studentDB[id] = {
                name: `Student ${id}`,
                password: simpleHash(id),
                class: `${c.num}-${s}`,
                rollNo: String(i).padStart(3,'0'),
                subject: c.sub,
                email: `${id.toLowerCase()}@student.chinmaya.edu`,
                phone: `+91-98765${String(Math.floor(Math.random()*99999)).padStart(5,'0')}`,
                dob: generateValidDOB(),
                gender: Math.random() > 0.5 ? 'Male' : 'Female',
                address: `House ${Math.floor(Math.random()*500)+1}, Sector ${Math.floor(Math.random()*20)+1}, Bokaro`,
                attendance: { present: Math.floor(Math.random()*5)+20, absent: Math.floor(Math.random()*4), total: 25 },
                marks: { math: Math.floor(Math.random()*30)+70, science: Math.floor(Math.random()*30)+70, english: Math.floor(Math.random()*30)+70, hindi: Math.floor(Math.random()*30)+70, social: Math.floor(Math.random()*30)+70 }
            };
        }
    });
});

// Teacher Database
export const teacherDB = {
    'T001': { 
        name: 'Dr. R.K. Sharma', 
        password: simpleHash('teacher123'), 
        subject: 'Mathematics', 
        email: 'rk.sharma@chinmaya.edu', 
        phone: '+91-9876543210', 
        qualification: 'Ph.D. Mathematics' 
    },
    'T002': { 
        name: 'Prof. S. Banerjee', 
        password: simpleHash('teacher123'), 
        subject: 'Science', 
        email: 's.banerjee@chinmaya.edu', 
        phone: '+91-9876543211', 
        qualification: 'M.Sc. Physics' 
    },
    'T003': { 
        name: 'Ms. P. Chatterjee', 
        password: simpleHash('teacher123'), 
        subject: 'English', 
        email: 'p.chatterjee@chinmaya.edu', 
        phone: '+91-9876543212', 
        qualification: 'M.A. English' 
    },
    'T004': { 
        name: 'Mrs. A. Yadav', 
        password: simpleHash('teacher123'), 
        subject: 'Hindi', 
        email: 'a.yadav@chinmaya.edu', 
        phone: '+91-9876543213', 
        qualification: 'M.A. Hindi' 
    },
    'T005': { 
        name: 'Mr. R. Das', 
        password: simpleHash('teacher123'), 
        subject: 'Social Science', 
        email: 'r.das@chinmaya.edu', 
        phone: '+91-9876543214', 
        qualification: 'M.A. History' 
    }
};

// Timetable Base
export const baseTT = [
    { time: '08:00-09:00', mon: { sub: 'Math', t: 'Dr. Sharma' }, tue: { sub: 'English', t: 'Ms. Chatterjee' }, wed: { sub: 'Science', t: 'Prof. Banerjee' }, thu: { sub: 'Hindi', t: 'Mrs. Yadav' }, fri: { sub: 'Social', t: 'Mr. Das' }, sat: { sub: 'Computer', t: 'Mr. Gupta' } },
    { time: '09:00-10:00', mon: { sub: 'Science', t: 'Prof. Banerjee' }, tue: { sub: 'Math', t: 'Dr. Sharma' }, wed: { sub: 'Hindi', t: 'Mrs. Yadav' }, thu: { sub: 'English', t: 'Ms. Chatterjee' }, fri: { sub: 'Math', t: 'Dr. Sharma' }, sat: { sub: 'Science', t: 'Prof. Banerjee' } },
    { time: '10:00-11:00', mon: { sub: 'English', t: 'Ms. Chatterjee' }, tue: { sub: 'Social', t: 'Mr. Das' }, wed: { sub: 'Math', t: 'Dr. Sharma' }, thu: { sub: 'Science', t: 'Prof. Banerjee' }, fri: { sub: 'Hindi', t: 'Mrs. Yadav' }, sat: { sub: 'English', t: 'Ms. Chatterjee' } },
    { time: '11:00-11:30', break: true },
    { time: '11:30-12:30', mon: { sub: 'Hindi', t: 'Mrs. Yadav' }, tue: { sub: 'Science', t: 'Prof. Banerjee' }, wed: { sub: 'English', t: 'Ms. Chatterjee' }, thu: { sub: 'Math', t: 'Dr. Sharma' }, fri: { sub: 'Computer', t: 'Mr. Gupta' }, sat: { sub: 'Social', t: 'Mr. Das' } },
    { time: '12:30-01:30', mon: { sub: 'Social', t: 'Mr. Das' }, tue: { sub: 'Computer', t: 'Mr. Gupta' }, wed: { sub: 'Social', t: 'Mr. Das' }, thu: { sub: 'Computer', t: 'Mr. Gupta' }, fri: { sub: 'English', t: 'Ms. Chatterjee' }, sat: { sub: 'Art', t: 'Mr. Singh' } },
    { time: '01:30-02:30', mon: { sub: 'PE', t: 'Coach Kumar' }, tue: { sub: 'Hindi', t: 'Mrs. Yadav' }, wed: { sub: 'Library', t: 'Librarian' }, thu: { sub: 'Social', t: 'Mr. Das' }, fri: { sub: 'Science', t: 'Prof. Banerjee' }, sat: { sub: 'Assembly', t: 'Principal' } }
];

export const timetableDB = {};
allClasses.forEach(c => {
    c.secs.forEach(s => {
        timetableDB[`${c.num}-${s}`] = baseTT;
    });
});

// Initial announcements and events (December 2025 context)
export const announcementsDB = [
    { id: 1, title: 'Winter Vacation Notice', content: 'School will be closed from 25th December 2025 to 5th January 2026.', date: '2025-12-01', priority: 'high', category: 'Holiday' },
    { id: 2, title: 'Christmas Celebration', content: 'Christmas celebration on 24th December 2025.', date: '2025-12-20', priority: 'medium', category: 'Event' }
];

export const eventsDB = [
    { id: 1, name: 'Annual Sports Day', date: '2026-02-15', time: '08:00 AM', venue: 'School Ground', description: 'Annual sports day with various competitions.', registered: 320 },
    { id: 2, name: 'Republic Day Celebration', date: '2026-01-26', time: '07:30 AM', venue: 'School Auditorium', description: 'Republic Day parade and cultural program.', registered: 280 }
];