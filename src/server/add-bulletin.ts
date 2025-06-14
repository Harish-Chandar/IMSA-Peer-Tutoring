import pkg from 'sqlite3';
const { Database, verbose } = pkg;
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const db = new (verbose().Database)('peertutoringdb.sqlite', (err: Error | null) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database.');
});

const questions = [
    { name: 'title', question: 'Enter the title: ' },
    { name: 'content', question: 'Enter the content: ' },
    { name: 'event_date', question: 'Enter the event date (YYYY-MM-DD) or press Enter for none: ' },
    { name: 'expiration_date', question: 'Enter the expiration date (YYYY-MM-DD) or press Enter for none: ' },
    { name: 'author', question: 'Enter the author name: ' },
    { name: 'contact_info', question: 'Enter contact information or press Enter for none: ' },
    { name: 'highpriority', question: 'Is this high priority? (yes/no): ' }
];

const answers: { [key: string]: string } = {};

function askQuestion(index: number) {
    if (index === questions.length) {
        // All questions answered, insert into database
        const currentDate = new Date().toISOString().split('T')[0];
        const highpriority = answers.highpriority.toLowerCase() === 'yes' ? 1 : 0;
        
        const stmt = db.prepare(`
            INSERT INTO bulletin (
                title, content, creation_date, event_date, 
                expiration_date, author, contact_info, highpriority
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            answers.title,
            answers.content,
            currentDate,
            answers.event_date || null,
            answers.expiration_date || null,
            answers.author,
            answers.contact_info || null,
            highpriority,
            (err: Error | null) => {
                if (err) {
                    console.error('Error inserting data:', err.message);
                } else {
                    console.log('\nBulletin entry added successfully!');
                }
                stmt.finalize(() => {
                    db.close((err) => {
                        if (err) {
                            console.error('Error closing database:', err.message);
                        }
                        rl.close();
                    });
                });
            }
        );
        return;
    }

    rl.question(questions[index].question, (answer) => {
        answers[questions[index].name] = answer;
        askQuestion(index + 1);
    });
}

console.log('Adding a new bulletin entry...\n');
askQuestion(0); 