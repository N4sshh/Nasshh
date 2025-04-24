const questions = [
    { a: "Write only HTML for a year", b: "Write only CSS for a year" },
    { a: "Debug someone else's code", b: "Refactor your old project" },
    { a: "Use inline CSS", b: "Use !important everywhere" },
    { a: "Only use dark mode", b: "Only use light mode" },
    { a: "Use tables for layout", b: "Use deprecated HTML tags" },
    { a: "Have a missing semicolon", b: "Have an infinite loop" },
    { a: "Deploy with errors", b: "Push untested code" },
    { a: "Forget to close a PHP tag", b: "Forget a semicolon in SQL" },
    { a: "Write SQL joins forever", b: "Design ERDs forever" },
    { a: "Lose your project files", b: "Forget to commit to Git" },
    { a: "Use only vanilla JS", b: "Use only jQuery" },
    { a: "Use Bootstrap forever", b: "Use only custom CSS" },
    { a: "Work without a debugger", b: "Work without syntax highlighting" },
    { a: "Write code without comments", b: "Read code without comments" },
    { a: "Build login system from scratch", b: "Use third-party auth" },
    { a: "Use only MySQL", b: "Use only SQLite" },
    { a: "Host on free server with ads", b: "Pay monthly for hosting" },
    { a: "Use PHPMyAdmin only", b: "Use CLI for all SQL tasks" },
    { a: "Always forget passwords", b: "Always mistype variable names" },
    { a: "Have perfect frontend", b: "Have perfect backend" },
    { a: "Memorize all HTML tags", b: "Memorize all PHP functions" },
    { a: "Get stuck in infinite loop", b: "Have broken recursion" },
    { a: "Accidentally delete a table", b: "Forget to back up your DB" },
    { a: "Manually type all tags", b: "Auto-complete turns off forever" },
    { a: "Use only divs", b: "Use only spans" },
    { a: "Use 'echo' only", b: "Use 'print' only" },
    { a: "Use camelCase only", b: "Use snake_case only" },
    { a: "Forget closing bracket", b: "Forget closing quote" },
    { a: "Hardcode all styles", b: "Write CSS in JS" },
    { a: "Use HTML tables only", b: "Use Flexbox with no docs" },
    { a: "Forget to sanitize inputs", b: "Forget to hash passwords" },
    { a: "Use JS alerts for errors", b: "Log everything in console" },
    { a: "Use FTP to deploy", b: "Use Git but with merge conflicts" },
    { a: "Indent with 2 spaces", b: "Indent with 8 spaces" },
    { a: "Use <marquee> in every page", b: "Use Comic Sans for headers" },
    { a: "Do code reviews every day", b: "Attend meetings all day" },
    { a: "Write long switch statements", b: "Use nested if-else only" },
    { a: "Have your site hacked", b: "Have your DB wiped" },
    { a: "Get stuck on one bug for 8 hours", b: "Restart project 3 times" },
    { a: "Use drag-and-drop builder", b: "Code without preview" },
    { a: "Optimize only mobile view", b: "Optimize only desktop view" },
    { a: "Build portfolio from scratch", b: "Use templates with bugs" },
    { a: "Teach someone new", b: "Code solo forever" },
    { a: "Use ChatGPT to code", b: "Use StackOverflow only" },
    { a: "Write documentation", b: "Fix CSS bugs" },
    { a: "Test code manually", b: "Write unit tests" },
    { a: "Use React for 1 year", b: "Use only PHP for 1 year" },
    { a: "Host DB locally only", b: "Host DB in cloud only" },
    { a: "Type code on mobile", b: "Type on slow PC" },
    { a: "Work with spaghetti code", b: "Work with missing files" },
    { a: "Have syntax error on deadline", b: "Have hosting down on launch" },
    { a: "Use only inline JS", b: "Use only external JS" },
    { a: "Lose internet while coding", b: "Lose power while coding" },
    { a: "Use outdated browser", b: "Use outdated PHP version" },
    { a: "Only build CRUD apps", b: "Only build static pages" },
    { a: "Forget HTML boilerplate", b: "Forget meta tags" },
    { a: "Have 100 console logs", b: "Have no logs at all" },
    { a: "Use only GET requests", b: "Use only POST requests" },
    { a: "Only watch tutorials", b: "Only read documentation" },
    { a: "Use outdated jQuery plugins", b: "Use only vanilla JS" },
    { a: "Code with group forever", b: "Code alone forever" },
    { a: "Always have a deadline", b: "Never finish a project" },
    { a: "Push broken code", b: "Forget to push code" },
    { a: "Have outdated CSS", b: "Use too many animations" },
    { a: "Only use Notepad", b: "Only use VS Code with broken extensions" },
    { a: "Be a frontend dev only", b: "Be a backend dev only" },
    { a: "Only design UI", b: "Only optimize DBs" },
    { a: "Write unit tests daily", b: "Document all SQL queries" },
    { a: "Have slow site", b: "Have ugly UI" },
    { a: "Always forget semicolon", b: "Always forget closing tags" },
    { a: "Manually deploy site", b: "Use CI/CD with bugs" },
    { a: "Use inline styles", b: "Use external stylesheet with errors" },
    { a: "Use <br> for spacing", b: "Use padding incorrectly" },
    { a: "Write only PHP", b: "Write only SQL" },
    { a: "Always debug code", b: "Always clean code" },
    { a: "Forget favicon", b: "Forget robots.txt" },
    { a: "Use localhost only", b: "Deploy without domain" },
    { a: "Design forms forever", b: "Build login logic forever" },
    { a: "Use same password everywhere", b: "Reset password daily" },
    { a: "Use prompts to code", b: "Use templates to code" },
    { a: "Write in markdown", b: "Write in plain text" },
    { a: "Be in charge of team repo", b: "Be the tester" },
    { a: "Add comments to all code", b: "Have no comments" },
    { a: "Use drag-and-drop DB builder", b: "Use CLI for DB setup" },
    { a: "Forget media queries", b: "Forget alt text" },
    { a: "Be stuck in loading screen", b: "Be stuck on error 404" },
    { a: "Only code at night", b: "Only code in the morning" },
    { a: "Code while sleepy", b: "Code while hungry" },
    { a: "Code for 24 hours straight", b: "Do a 10-minute oral report" }
  ];
  
  
  const optionA = document.getElementById("optionA");
const optionB = document.getElementById("optionB");
const nextBtn = document.getElementById("nextBtn");

// Start with a random question index
let currentQuestion = Math.floor(Math.random() * questions.length);

function displayQuestion(index) {
  optionA.textContent = questions[index].a;
  optionB.textContent = questions[index].b;
}

nextBtn.addEventListener("click", () => {
  // Pick a new random index every time you click next
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * questions.length);
  } while (newIndex === currentQuestion); // avoid repeating the same question
  currentQuestion = newIndex;
  displayQuestion(currentQuestion);
});

optionA.addEventListener("click", () => {
  alert(`You chose: "${questions[currentQuestion].a}"`);
});
optionB.addEventListener("click", () => {
  alert(`You chose: "${questions[currentQuestion].b}"`);
});

displayQuestion(currentQuestion); // show the first random question on load
